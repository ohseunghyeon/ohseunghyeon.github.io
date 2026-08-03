#!/usr/bin/env node
/**
 * 빌드 산출물의 URL 집합을 라이브 사이트 sitemap과 대조한다.
 *
 * URL이 바뀌면 utterances 댓글(issue-term: pathname)이 떨어지므로
 * 이 검증이 마이그레이션의 핵심 게이트다.
 *
 * 정답지 scripts/live-sitemap.txt는 2021-07-08에 마지막으로 배포된
 * 라이브 사이트의 sitemap.xml에서 뽑았다. 124개 = 글 112개 + 카테고리
 * 10개 + /about/ + 홈.
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const DIST = 'dist'
const BASELINE = 'scripts/live-sitemap.txt'

// 의도된 차이만 여기에 기록한다. 그 외의 차이는 모두 실패로 다룬다.
const EXPECTED_REMOVED = new Set([
  // 오타 카테고리. ^/refernece/ 로 필터해 매칭 0건인 빈 페이지였다.
  '/refernece/',
])

const EXPECTED_ADDED = new Set([
  // 오타 수정 결과. 글 URL(/reference/...)은 변하지 않는다.
  '/reference/',
  // 2022-01-11에 커밋됐으나 CI가 깨져 배포되지 못한 글.
  // 이 URL이 새로 생기는 것이 마이그레이션의 목적이다.
  '/lavender/21-month-baby/',
])

/** trailing slash를 항상 있는 형태로 정규화한다. */
function normalize(path) {
  if (path === '/') return '/'
  return path.endsWith('/') ? path : `${path}/`
}

async function collectBuiltUrls(dir, out = new Set()) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, item.name)
    if (item.isDirectory()) {
      await collectBuiltUrls(full, out)
    } else if (item.name === 'index.html') {
      const rel = relative(DIST, full).replace(/index\.html$/, '')
      out.add(normalize(`/${rel}`))
    }
  }
  return out
}

const baseline = new Set(
  (await readFile(BASELINE, 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map(normalize)
)

const built = await collectBuiltUrls(DIST)

// 404는 sitemap에 없고 빌드에는 있는 정상 케이스다.
built.delete('/404/')

const missing = [...baseline].filter(u => !built.has(u) && !EXPECTED_REMOVED.has(u))
const added = [...built].filter(u => !baseline.has(u) && !EXPECTED_ADDED.has(u))

const unexpectedlyKept = [...EXPECTED_REMOVED].filter(u => built.has(u))
const missingExpected = [...EXPECTED_ADDED].filter(u => !built.has(u))

let failed = false

if (missing.length) {
  failed = true
  console.error(`\n❌ 사라진 URL ${missing.length}개 — 댓글과 SEO가 유실된다:`)
  for (const u of missing.sort()) console.error(`   ${u}`)
}
if (added.length) {
  failed = true
  console.error(`\n❌ 예상치 못한 새 URL ${added.length}개:`)
  for (const u of added.sort()) console.error(`   ${u}`)
}
if (unexpectedlyKept.length) {
  failed = true
  console.error(`\n❌ 제거되어야 할 URL이 남아있다: ${unexpectedlyKept.join(', ')}`)
}
if (missingExpected.length) {
  failed = true
  console.error(`\n❌ 추가되어야 할 URL이 없다: ${missingExpected.join(', ')}`)
}

if (failed) {
  console.error(`\n정답지 ${baseline.size}개 / 빌드 ${built.size}개`)
  process.exit(1)
}

console.log(
  `✅ URL ${built.size}개 전부 일치 ` +
    `(의도된 차이 ${EXPECTED_REMOVED.size + EXPECTED_ADDED.size}건 반영)`
)
