# Astro 이전 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 4년간 배포가 멈춘 Gatsby 2 블로그를 Astro 7로 이전하고, 기존 URL을 한 개도 바꾸지 않은 채 GitHub Pages 배포를 복구한다.

**Architecture:** `gatsby-blog` 저장소의 `astro-migration` 브랜치에서 Astro로 재작성하고 URL 동일성 검증을 통과시킨 뒤(1단계), `ohseunghyeon.github.io` 저장소로 소스를 병합해 Pages를 Actions 방식으로 전환한다(2단계). GraphQL 계층이 사라지고 Content Collections + 평범한 JS 함수로 대체된다. 인터랙티브 컴포넌트만 React 아일랜드로 남기고 나머지는 정적 `.astro`로 전환한다.

**Tech Stack:** Astro 7.1.x, Node 22 LTS, React 18 (아일랜드 전용), dart-sass, Shiki, remark/rehype, `node:test` (테스트 러너, 추가 의존성 없음)

## Global Constraints

이 절의 요구사항은 모든 태스크에 암묵적으로 포함된다.

- **URL 보존이 최상위 제약이다.** utterances 댓글이 `issue-term: pathname`으로 걸려 있어 URL이 바뀌면 댓글이 떨어진다. 예외는 스펙 3-3의 `/refernece` → `/reference` 단 하나다.
- **URL은 반드시 `slugFromFilePath()`를 통해서만 만든다.** `entry.id`는 glob 로더가 소문자로 정규화하므로 URL에 직접 쓰면 안 된다 (스펙 3-1-1).
- Node 버전은 **22 LTS**로 고정한다. `.nvmrc`, `package.json`의 `engines`, CI 워크플로우 세 곳이 일치해야 한다.
- Astro 설정: `trailingSlash: 'always'`, `build.format: 'directory'`, `site: 'https://ohseunghyeon.github.io'`
- 글 113개, 첨부 파일 53개. 프론트매터 스키마에서 `description`은 **선택**이다 (1개 글에 없음).
- 시각적 결과 보존이 목표다. 디자인 개선·리뉴얼·신기능 추가는 범위 밖이다.
- 로컬 개발 시 Node 22를 쓴다. 머신 기본값은 26.5.1이므로 `nvm use` 또는 `~/.nvm/versions/node/v22.13.1/bin` 직접 사용이 필요하다.

## File Structure

**1단계에서 생성**

| 파일 | 책임 |
|---|---|
| `astro.config.mjs` | Astro 설정, remark/rehype 플러그인 배선, 통합(integration) 등록 |
| `src/content.config.ts` | Content Collections 정의 + Zod 스키마 |
| `src/utils/posts.js` | 순수 함수 3개: `slugFromFilePath`, `groupByCategory`, `categoryPaths` |
| `src/utils/posts.test.js` | 위 3개 함수의 단위 테스트 (`node:test`) |
| `src/utils/helpers.js` | `formatReadingTime` — 기존 파일 이동만 |
| `src/layouts/BaseLayout.astro` | `<head>`, 다크모드 초기화 스크립트, Header 배치, Container/Content 레이아웃 |
| `src/components/Header/Header.jsx` | React 아일랜드. headroom.js + Hamburger/Nav/Toggle 조립 |
| `src/components/Header/HeaderNav.jsx` | 카테고리 내비. 데이터를 props로 받음 (GraphQL 제거) |
| `src/components/Header/HeaderHamburger.jsx` | 모바일 토글 버튼 |
| `src/components/Header/Toggle.jsx` | 다크모드 토글 |
| `src/components/Bio.astro` | 프로필 + 작성자 링크 |
| `src/components/PostFrontmatter.astro` | 날짜/읽기시간/카테고리 |
| `src/components/PostFrontmatterTIL.astro` | `report` 카테고리 전용 (creator/created_at/link) |
| `src/components/PostListTitle.astro` | 목록 제목 |
| `src/components/PostTableOfContent.astro` | 목차 (고정 사이드바) |
| `src/components/PostComment.astro` | utterances 스크립트 주입 |
| `src/pages/index.astro` | 홈. `algorithm`·`report` 제외 목록 |
| `src/pages/[...slug].astro` | 글 상세 + 카테고리 내 prev/next |
| `src/pages/[...category].astro` | 카테고리 페이지. `report`는 내부 분기 |
| `src/pages/about.astro`, `src/pages/404.astro` | 정적 페이지 |
| `src/pages/rss.xml.ts` | RSS 피드 |
| `src/styles/typography.css` | 굳힌 typography.js 출력 (9,471 byte) |
| `public/sw.js` | 서비스 워커 묘비 |
| `public/manifest.webmanifest` | PWA 매니페스트 |
| `scripts/verify-urls.mjs` | URL 동일성 검증 (핵심 게이트) |
| `scripts/live-sitemap.txt` | 정답지 URL 목록 (라이브 사이트 스냅샷) |
| `scripts/new-post.mjs` | `npm run post` 대체 |
| `.nvmrc` | `22` |

**이동**

| 원본 | 대상 |
|---|---|
| `content/blog/**` | `src/content/blog/**` |
| `src/styles/global.scss`, `variables.scss` | 그대로 유지 |
| `src/components/Header/*.scss` (3개) | 그대로 유지 |
| `src/assets/*` | `src/assets/*` 유지 |

**삭제 (1단계 마지막)**

`gatsby-config.js`, `gatsby-node.js`, `gatsby-browser.js`, `src/html.js`, `src/utils/typography.js`, `src/components/Layout.js`, `src/components/Seo.js`, `src/templates/**`, `cli/`, `yarn.lock`, `src/pages/using-typescript.tsx.backup`, `content/blog/blogging/making-table-of-contents-on-gatsby-starter-blog.md.backup`

**2단계에서 생성**

| 파일 | 책임 |
|---|---|
| `.github/workflows/deploy.yml` | Pages 배포 (`ohseunghyeon.github.io` 저장소) |

---

## 1단계 — Astro 재작성

### Task 1: `slugFromFilePath` — URL 생성의 단일 경로

이 함수가 전체 마이그레이션의 URL 정확성을 담당한다. 가장 먼저, 테스트부터 만든다.

**Files:**
- Create: `src/utils/posts.js`
- Test: `src/utils/posts.test.js`
- Modify: `package.json` (test 스크립트)

**Interfaces:**
- Produces: `slugFromFilePath(filePath: string) => string` — `src/content/blog/` 기준 상대 슬러그를 반환. 선행/후행 슬래시 없음.

- [ ] **Step 1: `package.json`의 test 스크립트를 실제 러너로 교체**

현재 값은 `echo "Write tests! ..." && exit 1`이다. 다음으로 바꾼다.

```json
"test": "node --test"
```

인자 없는 `node --test`는 Node 22가 `**/*.test.js`를 자동 탐색한다. 글롭을 직접 넘기면 npm이 스크립트를 `sh`로 실행하므로 `**`가 재귀 확장되지 않아 깊은 경로의 테스트를 조용히 놓친다.

- [ ] **Step 2: 실패하는 테스트 작성**

`src/utils/posts.test.js`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { slugFromFilePath } from './posts.js'

test('일반 글: 확장자를 떼고 base 경로를 제거한다', () => {
  assert.equal(
    slugFromFilePath('src/content/blog/lavender/1-year.md'),
    'lavender/1-year'
  )
})

test('대소문자를 보존한다 — id는 소문자화되므로 이 함수가 유일한 방어선이다', () => {
  assert.equal(
    slugFromFilePath('src/content/blog/study/APIs-The-Good-The-Bad-The-Ugly/index.md'),
    'study/APIs-The-Good-The-Bad-The-Ugly'
  )
  assert.equal(
    slugFromFilePath('src/content/blog/algorithm/hackerrank/Utopian-Tree.md'),
    'algorithm/hackerrank/Utopian-Tree'
  )
})

test('index.md는 디렉터리 슬러그로 축약된다', () => {
  assert.equal(
    slugFromFilePath('src/content/blog/blogging/deploying-github-pages-with-github-actions/index.md'),
    'blogging/deploying-github-pages-with-github-actions'
  )
})

test('한글 경로를 그대로 보존한다', () => {
  assert.equal(
    slugFromFilePath('src/content/blog/algorithm/programmers/큰-수-만들기.md'),
    'algorithm/programmers/큰-수-만들기'
  )
})

test('중첩 카테고리 경로를 유지한다', () => {
  assert.equal(
    slugFromFilePath('src/content/blog/algorithm/reference/선택-정렬.md'),
    'algorithm/reference/선택-정렬'
  )
})

test('index가 파일명 일부인 경우를 잘못 자르지 않는다', () => {
  assert.equal(
    slugFromFilePath('src/content/blog/study/postgres-index.md'),
    'study/postgres-index'
  )
})
```

마지막 테스트가 중요하다. `/index$/` 대신 `index$`로 잘못 쓰면 `postgres-index`가 `postgres-`로 잘린다.

- [ ] **Step 3: 테스트가 실패하는 것을 확인**

Run: `node --test src/utils/posts.test.js`
Expected: FAIL — `Cannot find module './posts.js'`

- [ ] **Step 4: 최소 구현**

`src/utils/posts.js`:

```js
const BLOG_BASE = 'src/content/blog/'

/**
 * Content Collections의 entry.filePath에서 URL 슬러그를 만든다.
 *
 * entry.id를 쓰지 않는 이유: glob 로더가 id를 소문자로 정규화한다.
 * 대문자를 포함한 글 3개의 URL이 바뀌면 utterances 댓글이 떨어진다.
 */
export function slugFromFilePath(filePath) {
  return filePath
    .replace(BLOG_BASE, '')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `node --test src/utils/posts.test.js`
Expected: PASS — 6개 테스트 모두 통과

- [ ] **Step 6: 커밋**

```bash
git add src/utils/posts.js src/utils/posts.test.js package.json
git commit -m "URL 슬러그 생성 함수와 테스트 추가

entry.id는 glob 로더가 소문자로 정규화하므로 filePath에서
슬러그를 파생한다. 대문자를 포함한 글 3개의 URL 보존이 목적이다."
```

---

### Task 2: Astro 골격 + 콘텐츠 이동 + Zod 스키마

빌드가 성공하는 것 자체가 113개 글의 프론트매터 검증을 통과했다는 증거가 된다.

**Files:**
- Create: `astro.config.mjs`, `src/content.config.ts`, `.nvmrc`
- Modify: `package.json` (의존성 전면 교체)
- Move: `content/blog/**` → `src/content/blog/**`
- Create: `src/pages/index.astro` (임시 — Task 10에서 완성)

**Interfaces:**
- Produces: `blog` 컬렉션. 엔트리는 `{ id, filePath, data: { title, date, category, description?, creator?, created_at?, link?, todo? } }`

- [ ] **Step 1: `package.json` 의존성 교체**

기존 `dependencies`/`devDependencies` 전체를 아래로 대체한다. `gatsby-*` 24개, `node-sass`, `react-typography`, `typography*`, `@mdx-js/mdx`, `react-helmet`, `styled-components`, `react-toggle`, `yarn`(의존성에 들어가 있었다)이 모두 사라진다.

```json
{
  "name": "lazy-nyaong-blog",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": { "node": ">=22 <23" },
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "node --test",
    "verify:urls": "node scripts/verify-urls.mjs",
    "post": "node scripts/new-post.mjs"
  },
  "dependencies": {
    "@astrojs/react": "^4.4.0",
    "@astrojs/rss": "^4.0.12",
    "@astrojs/sitemap": "^3.7.0",
    "astro": "^7.1.6",
    "headroom.js": "^0.12.0",
    "medium-zoom": "^1.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-toggle": "^4.1.3",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-external-links": "^3.0.0",
    "rehype-slug": "^6.0.0",
    "remark-smartypants": "^3.0.2",
    "sass": "^1.93.0"
  },
  "devDependencies": {
    "@inquirer/prompts": "^7.4.0",
    "gray-matter": "^4.0.3"
  }
}
```

`@astrojs/react`·`@astrojs/rss`·`@astrojs/sitemap`의 버전 범위는 설치 시점의 Astro 7 호환 버전을 따른다. 설치 후 경고가 나오면 `npm install @astrojs/react@latest` 등으로 맞춘다.

`react-toggle`은 **유지한다.** 순수 React 패키지라 네이티브 빌드가 없어 이 프로젝트를 고장낸 유형(`node-sass`, 구버전 `sharp`)이 아니고, 유지하면 `Toggle.scss`를 손대지 않아도 되어 생김새가 정확히 보존된다. React 18 peer 경고가 나올 수 있으나 동작에는 지장이 없다 — 경고가 설치를 막으면 `npm install --legacy-peer-deps` 대신 `npm install react-toggle --force`로 처리하고 그 사실을 보고한다.

- [ ] **Step 2: `.nvmrc` 생성**

```
22
```

- [ ] **Step 3: 의존성 설치**

Run: `nvm use && rm -rf node_modules package-lock.json yarn.lock && npm install`
Expected: 네이티브 빌드 실패 없이 완료. `node-sass`가 사라졌으므로 `node-gyp` 오류가 발생하지 않아야 한다.

- [ ] **Step 4: 콘텐츠 이동**

```bash
mkdir -p src/content
git mv content/blog src/content/blog
rmdir content 2>/dev/null || true
```

Run: `find src/content/blog -name "*.md" | wc -l`
Expected: `113`

- [ ] **Step 5: `astro.config.mjs` 생성**

remark/rehype 플러그인은 Task 13에서 추가한다. 지금은 최소 설정만 둔다.

```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://ohseunghyeon.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
})
```

- [ ] **Step 6: `src/content.config.ts` 생성**

`description`이 선택인 것에 주의한다 — 필수로 두면 글 1개에서 빌드가 실패한다.

```ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    // 113개 중 112개에만 존재한다
    description: z.string().optional(),
    // report 카테고리 전용 (11개)
    creator: z.string().optional(),
    created_at: z.string().optional(),
    link: z.string().optional(),
    todo: z.boolean().optional(),
  }),
})

export const collections = { blog }
```

- [ ] **Step 7: 임시 홈 페이지로 컬렉션 개수 확인**

`src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content'
const posts = await getCollection('blog')
---
<html><body>
  <p data-count={posts.length}>글 {posts.length}개</p>
</body></html>
```

- [ ] **Step 8: 빌드 실행 — 스키마 검증 통과 확인**

Run: `npm run build`
Expected: 성공. Zod 오류가 나오면 해당 글의 프론트매터를 확인한다 (스펙 4절 스키마와 대조).

Run: `grep -o 'data-count="[0-9]*"' dist/index.html`
Expected: `data-count="113"`

- [ ] **Step 9: 커밋**

```bash
git add -A
git commit -m "Astro 골격 구성 및 콘텐츠 이동

gatsby-* 의존성 24개와 node-sass를 제거하고 Astro 7로 교체했다.
글 113개를 src/content/blog로 옮기고 Zod 스키마를 정의했다.
description은 112개 글에만 있어 선택 필드로 둔다."
```

---

### Task 3: `groupByCategory` / `categoryPaths`

`gatsby-node.js`가 하던 카테고리 그룹핑과 카테고리 경로 생성을 순수 함수로 옮긴다. 글 상세의 prev/next와 카테고리 페이지 목록이 모두 이 두 함수에 의존한다.

**Files:**
- Modify: `src/utils/posts.js`
- Modify: `src/utils/posts.test.js`

**Interfaces:**
- Consumes: `slugFromFilePath` (Task 1)
- Produces:
  - `groupByCategory(entries) => Map<string, Entry[]>` — 각 배열은 `date` 역순 정렬. `entries`는 `{ filePath, data: { category, date } }` 형태만 요구한다.
  - `categoryPaths(categories: Iterable<string>) => string[]` — 중첩 카테고리를 단계별로 펼친 중복 없는 배열. 예: `['algorithm/programmers']` → `['algorithm', 'algorithm/programmers']`
  - `siblingPosts(posts, index) => { previous, next }` — Gatsby 동작과 동일하게 `previous`는 더 오래된 글, `next`는 더 최신 글

- [ ] **Step 1: 실패하는 테스트 추가**

`src/utils/posts.test.js` 끝에 추가한다.

```js
import { groupByCategory, categoryPaths, siblingPosts } from './posts.js'

const entry = (filePath, category, date) => ({
  filePath: `src/content/blog/${filePath}`,
  data: { category, date: new Date(date) },
})

test('groupByCategory: 카테고리별로 묶고 날짜 역순으로 정렬한다', () => {
  const entries = [
    entry('lavender/a.md', 'lavender', '2021-01-01'),
    entry('lavender/c.md', 'lavender', '2021-03-01'),
    entry('lavender/b.md', 'lavender', '2021-02-01'),
    entry('essay/x.md', 'essay', '2020-01-01'),
  ]
  const grouped = groupByCategory(entries)

  assert.deepEqual([...grouped.keys()].sort(), ['essay', 'lavender'])
  assert.deepEqual(
    grouped.get('lavender').map(e => e.filePath.split('/').pop()),
    ['c.md', 'b.md', 'a.md']
  )
  assert.equal(grouped.get('essay').length, 1)
})

test('categoryPaths: 중첩 카테고리를 단계별로 펼친다', () => {
  assert.deepEqual(
    categoryPaths(['algorithm/programmers']),
    ['algorithm', 'algorithm/programmers']
  )
})

test('categoryPaths: 상위 카테고리를 중복 생성하지 않는다', () => {
  const paths = categoryPaths([
    'algorithm/programmers',
    'algorithm/hackerrank',
    'algorithm/reference',
    'lavender',
  ])
  assert.deepEqual(paths.filter(p => p === 'algorithm').length, 1)
  assert.deepEqual(new Set(paths).size, paths.length)
  assert.ok(paths.includes('algorithm/hackerrank'))
  assert.ok(paths.includes('lavender'))
})

test('siblingPosts: previous는 더 오래된 글, next는 더 최신 글', () => {
  // 날짜 역순 정렬된 배열 — index 0이 가장 최신
  const posts = [
    entry('c.md', 'x', '2021-03-01'),
    entry('b.md', 'x', '2021-02-01'),
    entry('a.md', 'x', '2021-01-01'),
  ]

  const middle = siblingPosts(posts, 1)
  assert.equal(middle.previous.filePath.endsWith('a.md'), true)
  assert.equal(middle.next.filePath.endsWith('c.md'), true)

  const newest = siblingPosts(posts, 0)
  assert.equal(newest.next, null)
  assert.equal(newest.previous.filePath.endsWith('b.md'), true)

  const oldest = siblingPosts(posts, 2)
  assert.equal(oldest.previous, null)
  assert.equal(oldest.next.filePath.endsWith('b.md'), true)
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test`
Expected: FAIL — `groupByCategory is not a function` (import는 성공하나 undefined 호출)

- [ ] **Step 3: 구현 추가**

`src/utils/posts.js`에 추가한다.

```js
/** 카테고리별로 묶고 각 배열을 날짜 역순으로 정렬한다. */
export function groupByCategory(entries) {
  const grouped = new Map()

  for (const e of entries) {
    const category = e.data.category
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category).push(e)
  }

  for (const posts of grouped.values()) {
    posts.sort((a, b) => b.data.date - a.data.date)
  }

  return grouped
}

/**
 * 중첩 카테고리를 단계별로 펼친다.
 * 'algorithm/programmers' -> ['algorithm', 'algorithm/programmers']
 */
export function categoryPaths(categories) {
  const paths = new Set()

  for (const full of categories) {
    let acc = ''
    for (const chunk of full.split('/')) {
      acc = acc ? `${acc}/${chunk}` : chunk
      paths.add(acc)
    }
  }

  return [...paths]
}

/**
 * 날짜 역순 배열에서 이웃 글을 찾는다.
 * Gatsby 동작과 동일: previous는 더 오래된 글, next는 더 최신 글.
 */
export function siblingPosts(posts, index) {
  return {
    previous: index === posts.length - 1 ? null : posts[index + 1],
    next: index === 0 ? null : posts[index - 1],
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS — 10개 테스트 모두 통과

- [ ] **Step 5: 커밋**

```bash
git add src/utils/posts.js src/utils/posts.test.js
git commit -m "카테고리 그룹핑과 이웃 글 계산 함수 추가

gatsby-node.js의 로직을 순수 함수로 옮겼다. prev/next는
카테고리 내에서 계산하는 기존 동작을 유지한다."
```

---

### Task 4: URL 동일성 검증 스크립트 — 핵심 게이트

이 스크립트를 먼저 만들어 두면 이후 모든 태스크가 이것을 통과 목표로 삼는다. 지금은 당연히 실패하며, Task 12에서 통과한다.

**Files:**
- Create: `scripts/verify-urls.mjs`, `scripts/live-sitemap.txt`

**Interfaces:**
- Produces: `npm run verify:urls` — 종료 코드 0이면 통과. 차이가 있으면 누락/추가 URL을 출력하고 1로 종료.

- [ ] **Step 1: 라이브 사이트 정답지 저장**

라이브 사이트가 아직 2021년 버전을 서빙하고 있어 정답지로 쓸 수 있다.

```bash
mkdir -p scripts
curl -s https://ohseunghyeon.github.io/sitemap.xml \
  | grep -o '<loc>[^<]*</loc>' \
  | sed 's|<loc>https://ohseunghyeon.github.io||; s|</loc>||' \
  | sed 's|^$|/|' \
  | sort > scripts/live-sitemap.txt
```

Run: `wc -l scripts/live-sitemap.txt`
Expected: `124`

- [ ] **Step 2: 검증 스크립트 작성**

```js
#!/usr/bin/env node
/**
 * 빌드 산출물의 URL 집합을 라이브 사이트 sitemap과 대조한다.
 *
 * URL이 바뀌면 utterances 댓글(issue-term: pathname)이 떨어지므로
 * 이 검증이 마이그레이션의 핵심 게이트다.
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
  // 현재 sitemap에 홈이 누락되어 있다 (Gatsby sitemap 플러그인이 빠뜨림).
  '/',
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

console.log(`✅ URL ${built.size}개 전부 일치 (의도된 차이 ${EXPECTED_REMOVED.size + EXPECTED_ADDED.size}건 반영)`)
```

- [ ] **Step 3: 지금은 실패하는 것을 확인**

Run: `npm run build && npm run verify:urls`
Expected: FAIL — 아직 페이지가 없으므로 "사라진 URL 123개" 수준으로 출력된다. 이 스크립트가 정상 동작한다는 증거다.

- [ ] **Step 4: 커밋**

```bash
git add scripts/verify-urls.mjs scripts/live-sitemap.txt package.json
git commit -m "URL 동일성 검증 스크립트 추가

라이브 sitemap 124개를 정답지로 빌드 결과와 대조한다.
utterances 댓글이 pathname에 걸려 있어 URL 보존이 필수다.
의도된 차이(refernece 오타 수정, 홈 추가)만 예외로 기록했다."
```

---

### Task 5: 타이포그래피 굳히기

`typography.js` 출력을 정적 CSS로 만들어 의존성 없이 렌더링을 보존한다.

**Files:**
- Create: `src/styles/typography.css`
- Modify: `src/styles/variables.scss`

**Interfaces:**
- Produces: `src/styles/typography.css` (import 대상), `variables.scss`의 `--rhythm-*` 커스텀 프로퍼티

- [ ] **Step 1: 임시 디렉터리에서 CSS 생성**

프로젝트에 의존성을 추가하지 않기 위해 프로젝트 밖에서 생성한다.

```bash
TMP=$(mktemp -d)
cd "$TMP"
npm init -y >/dev/null
npm install typography@0.16.19 typography-theme-github@0.16.19 --no-audit --no-fund
cat > gen.cjs <<'EOF'
const Typography = require('typography')
const GitHub = require('typography-theme-github').default
GitHub.overrideThemeStyles = () => ({
  'a:hover': { textDecoration: `none` },
  'a.gatsby-resp-image-link': { boxShadow: `none`, textDecoration: `none` },
  'h1, h2, h3': { marginTop: `2.625rem` },
})
GitHub.bodyFontFamily = ['Apple SD Gothic Neo', 'NanumGothic', 'sans-serif']
const t = new Typography(GitHub)
require('fs').writeFileSync('typography.css', t.toString())
for (const v of [1/4, 1/2, 3/4, 1, 1.5, 2, 2.5]) console.log(v, t.rhythm(v))
EOF
node gen.cjs
```

`require('typography')`에 `.default`를 붙이면 `Typography is not a constructor`로 실패한다 — 이 패키지는 함수를 직접 export한다.

- [ ] **Step 2: 생성된 CSS를 프로젝트로 복사**

```bash
cp "$TMP/typography.css" <프로젝트>/src/styles/typography.css
```

Run: `wc -c src/styles/typography.css`
Expected: `9471` (normalize.css가 포함된 값이다)

- [ ] **Step 3: `variables.scss`에 rhythm 변수 추가**

기존 내용(`$border-color: #d6d9dc;`)은 유지하고 아래를 추가한다.

```scss
$border-color: #d6d9dc;

// typography.js(typography-theme-github)의 rhythm 값을 굳힌 것.
// baseLineHeight 1.625rem의 배수다. 의존성은 제거하고 값만 보존한다.
:root {
  --rhythm-quarter: 0.40625rem;
  --rhythm-half: 0.8125rem;
  --rhythm-three-quarter: 1.21875rem;
  --rhythm-1: 1.625rem;
  --rhythm-1-5: 2.4375rem;
  --rhythm-2: 3.25rem;
  --rhythm-2-5: 4.0625rem;
}
```

`rhythm(2.5)`는 `Bio.js`에서 쓰이므로 함께 넣는다. Step 1의 출력값으로 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add src/styles/typography.css src/styles/variables.scss
git commit -m "typography.js 출력을 정적 CSS로 굳힘

typography/react-typography/gatsby-plugin-typography 의존성을
제거하면서 렌더링 결과를 보존한다. rhythm 값은 CSS 커스텀
프로퍼티로 옮겨 13곳의 호출을 대체한다."
```

---

### Task 6: BaseLayout — `<head>`, 다크모드, 레이아웃

`html.js` + `Layout.js` + `Seo.js` 세 파일을 하나로 합친다. `html.js`의 `alert()` 버그를 제거한다.

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Reference: `src/html.js` (다크모드 스크립트 원본), `src/components/Layout.js`, `src/components/Seo.js`

**Interfaces:**
- Produces: `BaseLayout` — props `{ title: string, description?: string, pathname: string }`. 슬롯에 본문을 받는다.
- 전역 계약: 인라인 스크립트가 `window.__theme`, `window.__setPreferredTheme(theme)`, `window.__onThemeChange` 를 정의한다. `Toggle.jsx`(Task 7)가 이 세 개에 의존한다.

- [ ] **Step 1: BaseLayout 작성**

```astro
---
import '../styles/typography.css'
import '../styles/global.scss'
import Header from '../components/Header/Header.jsx'
import { getCollection } from 'astro:content'
import { groupByCategory, categoryPaths } from '../utils/posts.js'

const { title, description, pathname } = Astro.props

const SITE_TITLE = 'Lazy Nyaong'
const SITE_DESCRIPTION = 'Code, Lazy, Cat'
const AUTHOR = 'Oh SeungHyeon'

const metaDescription = description || SITE_DESCRIPTION
const pageTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE

// Header의 카테고리 내비 데이터. Gatsby에서는 useStaticQuery의
// group(field: frontmatter___category)가 하던 일이다.
const posts = await getCollection('blog')
const grouped = groupByCategory(posts)
const counts = new Map()
for (const [category, items] of grouped) {
  let acc = ''
  for (const chunk of category.split('/')) {
    acc = acc ? `${acc}/${chunk}` : chunk
    counts.set(acc, (counts.get(acc) || 0) + items.length)
  }
}
const navCategories = categoryPaths(grouped.keys()).map(slug => ({
  slug,
  cat: slug.split('/').pop(),
  count: counts.get(slug),
  depth: slug.split('/').length - 1,
}))
---

<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>{pageTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta property="og:title" content={title || SITE_TITLE} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content={AUTHOR} />
    <meta name="twitter:title" content={title || SITE_TITLE} />
    <meta name="twitter:description" content={metaDescription} />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
    <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/rss.xml" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" />
  </head>
  <body class="light">
    <script is:inline>
      // 다크모드를 페인트 전에 적용해 깜빡임을 막는다.
      // 원본(src/html.js)에는 matchMedia 리스너 안에 alert(e.matches)가
      // 남아 있어 OS 테마 변경 시 경고창이 떴다. 제거했다.
      ;(function () {
        window.__onThemeChange = function () {}

        function setTheme(newTheme) {
          window.__theme = newTheme
          document.body.className = newTheme
          window.__onThemeChange(newTheme)
        }

        var preferredTheme
        try {
          preferredTheme = localStorage.getItem('theme')
        } catch (err) {}

        window.__setPreferredTheme = function (newTheme) {
          setTheme(newTheme)
          try {
            localStorage.setItem('theme', newTheme)
          } catch (err) {}
        }

        var darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
        darkQuery.addEventListener('change', function (e) {
          window.__setPreferredTheme(e.matches ? 'dark' : 'light')
        })

        setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'))
      })()
    </script>

    <div class="layout-container">
      <Header title={SITE_TITLE} pathname={pathname} categories={navCategories} client:load />
      <div class="layout-content">
        <main>
          <slot />
        </main>
        <footer></footer>
      </div>
    </div>
  </body>
</html>

<style>
  .layout-container {
    display: flex;
    color: var(--textNormal);
    background: var(--bg);
    transition: color 0.2s ease-out, background 0.2s ease-out;
  }
  .layout-content {
    margin: 0 auto;
    width: 100%;
    max-width: 49rem;
    padding: 0 var(--rhythm-three-quarter) var(--rhythm-1-5);
  }
  main {
    position: relative;
  }
  @media screen and (max-width: 768px) {
    .layout-container {
      display: block;
    }
    .layout-content {
      padding-top: 50px;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    .layout-content {
      max-width: calc(100% - 228px);
    }
  }
</style>
```

`<style>`은 `.astro` 스코프 스타일이라 `styled-components`를 대체한다. `--rhythm-*` 변수는 `global.scss`가 import하는 `variables.scss`에서 온다. `global.scss`가 `variables.scss`를 import하지 않는다면 이 태스크에서 `@use '../styles/variables.scss';` 한 줄을 `global.scss` 상단에 추가한다.

- [ ] **Step 2: 빌드가 깨지는 것을 확인 (Header 미구현)**

Run: `npm run build`
Expected: FAIL — `Header.jsx`를 찾을 수 없다. Task 7에서 해결한다.

- [ ] **Step 3: 커밋**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.scss
git commit -m "BaseLayout 추가 — html.js/Layout.js/Seo.js 통합

react-helmet과 styled-components 없이 head와 레이아웃을 구성한다.
다크모드 초기화 스크립트의 alert() 버그를 제거하고
deprecated된 addListener를 addEventListener로 교체했다."
```

---

### Task 7: Header React 아일랜드

인터랙티브 컴포넌트 4개를 React 아일랜드로 옮긴다. GraphQL과 `gatsby`의 `Link`를 제거한다. `react-toggle`은 유지해 토글 생김새를 정확히 보존한다.

**Files:**
- Create: `src/components/Header/Header.jsx`, `HeaderNav.jsx`, `HeaderHamburger.jsx`, `Toggle.jsx`
- Keep (수정 없음): `src/components/Header/index.scss`, `HeaderNav.scss`, `HeaderHamburger.scss`, `Toggle.scss`
- Delete: `src/components/Header/index.js`, `HeaderNav.js`, `HeaderHamburger.js`, `Toggle.js`

**Interfaces:**
- Consumes: `BaseLayout`이 넘기는 props (Task 6)
- Produces: `Header({ title, pathname, categories })`. `categories`는 `{ slug, cat, count, depth }[]`

- [ ] **Step 1: `Toggle.jsx` — 확장자만 바꿔 그대로 이동**

`react-toggle`을 유지하므로 원본 로직을 바꾸지 않는다. `.scss` 파일도 손대지 않는다. `react-toggle`의 기본 CSS import가 원본에 없었다면 추가하지 않는다 — 기존 동작을 그대로 유지한다.

```jsx
import { useState, useEffect } from 'react'
import ReactToggle from 'react-toggle'

import sun from '../../assets/sun.png'
import moon from '../../assets/moon.png'

import './Toggle.scss'

const Toggle = () => {
  const [theme, setTheme] = useState()

  useEffect(() => {
    setTheme(window.__theme)
    window.__onThemeChange = () => {
      setTheme(window.__theme)
    }
  }, [])

  return (
    <ReactToggle
      icons={{
        checked: (
          <img
            src={moon.src ?? moon}
            width="16"
            height="16"
            alt="presentation"
            style={{ pointerEvents: 'none' }}
          />
        ),
        unchecked: (
          <img
            src={sun.src ?? sun}
            width="16"
            height="16"
            alt="presentation"
            style={{ pointerEvents: 'none' }}
          />
        ),
      }}
      checked={theme === 'dark'}
      onChange={e =>
        window.__setPreferredTheme(e.target.checked ? 'dark' : 'light')
      }
    />
  )
}

export default Toggle
```

원본과의 유일한 차이는 `sun.src ?? sun`이다. Astro의 이미지 import는 문자열이 아니라 `{ src, width, height }` 객체를 반환하므로, 두 경우를 모두 처리한다.

- [ ] **Step 2: `Toggle.scss`가 그대로 동작하는지 확인**

`react-toggle`을 유지하므로 `.react-toggle*` 선택자가 그대로 유효하다. **이 파일은 수정하지 않는다.** Step 7의 시각 확인에서 토글 모양이 라이브 사이트와 같은지 대조한다.

- [ ] **Step 3: `HeaderHamburger.jsx` — 거의 그대로 이동**

```jsx
import { useCallback, useRef } from 'react'
import './HeaderHamburger.scss'

const NavToggle = () => {
  const refButton = useRef(null)
  const handleToggle = useCallback(() => {
    refButton.current.classList.toggle('active')
  }, [])

  return (
    <button
      className="nav-toggle"
      ref={refButton}
      onClick={handleToggle}
      aria-label="nav-toggle"
    />
  )
}

export default NavToggle
```

- [ ] **Step 4: `HeaderNav.jsx` — GraphQL 제거, props 수신**

카테고리 집계는 `BaseLayout`으로 옮겼으므로 여기서는 렌더링만 한다.

```jsx
import './HeaderNav.scss'

const Nav = ({ pathname, categories }) => {
  const slug = pathname.replace(/^\//, '')

  // 가장 긴 접두사 매칭. 원본과 동일하게 마지막 일치를 택한다.
  const currentCategory = categories.reduce(
    (current, next) => (slug.indexOf(next.slug) === 0 ? next.slug : current),
    ''
  )

  return (
    <nav className="nav" role="navigation">
      <ol className="nav-links">
        {categories.map(({ slug, cat, count, depth }) => (
          <li
            className={`nav-link ${depth ? 'sub' : ''} ${currentCategory === slug ? 'current' : ''}`}
            key={slug}
          >
            <a href={`/${slug}/`}>
              {cat}
              <small>({count})</small>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Nav
```

원본은 `~slug.indexOf(next.slug)`로 부분 문자열 포함을 검사했다. 이는 `reference`가 `algorithm/reference`와 교차 매칭될 수 있어 `indexOf(...) === 0`(접두사)으로 바꾼다. `key`도 `cat`에서 `slug`로 바꾼다 — `reference`가 `algorithm/reference`와 `cat` 값이 같아 React key가 중복됐다.

- [ ] **Step 5: `Header.jsx` 조립**

```jsx
import { useEffect, useRef } from 'react'
import Headroom from 'headroom.js'
import Hamburger from './HeaderHamburger.jsx'
import Nav from './HeaderNav.jsx'
import Toggle from './Toggle.jsx'
import './index.scss'

const Header = ({ title, pathname, categories }) => {
  const refHeader = useRef()

  useEffect(() => {
    const headroom = new Headroom(refHeader.current)
    headroom.init()
    return () => headroom.destroy()
  }, [])

  return (
    <header ref={refHeader} className="header">
      <Hamburger />
      <a style={{ color: 'var(--textTitle)' }} className="header-logo" href="/">
        {title}
      </a>
      <Nav pathname={pathname} categories={categories} />
      <Toggle />
    </header>
  )
}

export default Header
```

- [ ] **Step 6: 구 파일 삭제**

```bash
git rm src/components/Header/index.js src/components/Header/HeaderNav.js \
       src/components/Header/HeaderHamburger.js src/components/Header/Toggle.js
```

- [ ] **Step 7: 빌드 확인**

`src/pages/index.astro`를 BaseLayout을 쓰는 최소 형태로 임시 수정한다.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout title="All posts" pathname={Astro.url.pathname}>
  <p>임시</p>
</BaseLayout>
```

Run: `npm run build && npm run preview`
Expected: 빌드 성공. 브라우저에서 헤더가 보이고, 다크모드 토글이 동작하며, 카테고리 목록에 개수가 표시된다.

- [ ] **Step 8: 커밋**

```bash
git add -A src/components/Header src/pages/index.astro
git commit -m "Header를 React 아일랜드로 전환

GraphQL useStaticQuery를 제거하고 카테고리 데이터를 props로 받는다.
카테고리 현재 위치 판정을 부분 문자열에서 접두사 매칭으로 고쳐
reference와 algorithm/reference의 교차 매칭을 없앴다.
Toggle은 react-toggle과 Toggle.scss를 그대로 유지한다."
```

---

### Task 8: 정적 컴포넌트 `.astro` 전환

클라이언트 JS가 필요 없는 컴포넌트 6개를 `.astro`로 옮긴다. `rhythm()` 호출은 CSS 변수로 대체한다.

**Files:**
- Create: `src/components/Bio.astro`, `PostFrontmatter.astro`, `PostFrontmatterTIL.astro`, `PostListTitle.astro`, `PostTableOfContent.astro`, `PostComment.astro`
- Delete: 같은 이름의 `.js` 6개
- Keep: `src/utils/helpers.js`

**Interfaces:**
- `PostFrontmatter` props: `{ date: string, timeToRead?: number, category: string, isInPost?: boolean }`
- `PostFrontmatterTIL` props: 위 + `{ creator?: string, created_at?: string, link?: string }`
- `PostListTitle` props: `{ title: string }`
- `PostTableOfContent` props: `{ headings: { depth: number, slug: string, text: string }[] }`
- `Bio`, `PostComment`: props 없음

- [ ] **Step 1: `PostListTitle.astro`**

```astro
---
const { title } = Astro.props
---
<h2>{title}</h2>

<style>
  h2 {
    text-transform: uppercase;
    border-bottom: 0;
  }
</style>
```

- [ ] **Step 2: `PostFrontmatter.astro`**

원본의 `scale(-1/5)`는 `{ fontSize: '0.87055rem', lineHeight: '1.625rem' }`이다 (Task 5에서 확인한 값).

```astro
---
import { formatReadingTime } from '../utils/helpers.js'

const { date, timeToRead, category, isInPost } = Astro.props
---
{isInPost ? (
  <p class="frontmatter in-post">
    {date}
    {timeToRead && ` • ${formatReadingTime(timeToRead)}`}
    {category && (
      <a class="category-link" href={`/${category}/`}><br />{category}</a>
    )}
  </p>
) : (
  <small class="frontmatter">
    {date}
    {timeToRead && ` • ${formatReadingTime(timeToRead)}`}
    {category && (
      <a class="category-link" href={`/${category}/`}><br />{category}</a>
    )}
  </small>
)}

<style>
  .in-post {
    font-size: 0.87055rem;
    line-height: 1.625rem;
    display: block;
    margin-bottom: var(--rhythm-1);
  }
  .category-link {
    opacity: 0.75;
  }
  .category-link::before {
    content: ' • ';
  }
  .category-link br {
    display: none;
  }
  @media screen and (max-width: 768px) {
    .category-link::before {
      display: none;
    }
    .category-link br {
      display: inline;
    }
  }
</style>
```

- [ ] **Step 3: `PostFrontmatterTIL.astro`**

`report` 카테고리 전용이다. 원본과 달리 `timeToRead`를 표시하지 않는 동작을 유지한다.

```astro
---
const { date, category, creator, created_at, link } = Astro.props
---
<p class="frontmatter in-post">
  {date}
  {category && (
    <a class="category-link" href={`/${category}/`}><br />{category}</a>
  )}
  <br />
  {link && <span class="til-field">link: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></span>}
  {creator && <span class="til-field">creator: {creator}</span>}
  {created_at && <span class="til-field">created_at: {created_at}</span>}
</p>

<style>
  .in-post {
    font-size: 0.87055rem;
    line-height: 1.625rem;
    display: block;
    margin-bottom: var(--rhythm-1);
  }
  .til-field {
    display: block;
  }
  .category-link {
    opacity: 0.75;
  }
  .category-link::before {
    content: ' • ';
  }
  .category-link br {
    display: none;
  }
  @media screen and (max-width: 768px) {
    .category-link::before {
      display: none;
    }
    .category-link br {
      display: inline;
    }
  }
</style>
```

원본은 `<div>`를 `<p>` 안에 넣어 잘못된 HTML을 만들었다. `<span class="til-field">` + `display: block`으로 같은 시각 결과를 유지하며 유효한 HTML로 고친다.

- [ ] **Step 4: `PostTableOfContent.astro`**

Gatsby의 `tableOfContents`(HTML 문자열) 대신 Astro의 `headings` 배열을 받아 직접 목록을 만든다.

```astro
---
const { headings } = Astro.props
// h2, h3만 표시한다 — Gatsby tableOfContents의 기본 동작과 같다.
const items = headings.filter(h => h.depth >= 2 && h.depth <= 3)
---
{items.length > 0 && (
  <div class="toc">
    <ul>
      {items.map(h => (
        <li class={`depth-${h.depth}`}>
          <a href={`#${h.slug}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  </div>
)}

<style>
  .toc {
    display: none;
    position: fixed;
    top: 3.25rem;
    right: 10px;
    white-space: nowrap;
    font-size: 0.9em;
    width: calc((100vw - 228px - 49rem) / 2 - 2.03125rem);
    overflow: hidden;
    border-left: 5px solid var(--border-color);
  }
  @media screen and (min-width: 1278px) {
    .toc {
      display: block;
    }
  }
  .toc ul {
    list-style: none;
    margin-left: 1.015625rem;
    margin-bottom: 0;
  }
  .toc li {
    margin-bottom: 0.2em;
  }
  .toc li.depth-3 {
    margin-left: 1.015625rem;
  }
  .toc a {
    color: inherit;
  }
</style>
```

- [ ] **Step 5: `Bio.astro`**

`gatsby-image`의 `fixed(width: 50, height: 50)`을 Astro `<Image>`로 대체한다.

```astro
---
import { Image } from 'astro:assets'
import profilePic from '../assets/profile-pic.png'

const AUTHOR = 'Oh SeungHyeon'
const GITHUB = 'ohseunghyeon'
---
<div class="bio">
  <Image src={profilePic} alt={AUTHOR} width={50} height={50} class="bio-avatar" />
  <p class="bio-text">
    <span>Code, Lazy, Cat.</span>
    <a href={`https://github.com/${GITHUB}`} target="_blank" rel="noopener noreferrer">
      {AUTHOR}
    </a>
  </p>
</div>

<style>
  .bio {
    display: flex;
    margin-bottom: var(--rhythm-2-5);
  }
  .bio-avatar {
    margin-right: var(--rhythm-half);
    margin-bottom: 0;
    min-width: 50px;
    border-radius: 50%;
  }
  .bio-text {
    display: flex;
    flex-direction: column;
  }
</style>
```

- [ ] **Step 6: `PostComment.astro`**

utterances의 `repo`와 `issue-term`은 **절대 바꾸면 안 된다** — 기존 댓글이 여기에 매달려 있다.

```astro
<div id="utterances-container"></div>

<script is:inline>
  ;(function () {
    var container = document.getElementById('utterances-container')
    if (!container || container.childElementCount > 0) return

    var script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    // repo와 issue-term은 기존 댓글이 매달린 좌표다. 바꾸면 댓글이 사라진다.
    script.setAttribute('repo', 'ohseunghyeon/ohseunghyeon.github.io')
    script.setAttribute('issue-term', 'pathname')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    container.appendChild(script)
  })()
</script>
```

- [ ] **Step 7: 구 파일 삭제**

```bash
git rm src/components/Bio.js src/components/PostFrontmatter.js \
       src/components/PostFrontmatterTIL.js src/components/PostListTitle.js \
       src/components/PostTableOfContent.js src/components/PostComment.js
```

- [ ] **Step 8: 빌드 확인**

Run: `npm run build`
Expected: 성공 (아직 이 컴포넌트들을 쓰는 페이지가 없으므로 컴파일만 확인된다)

- [ ] **Step 9: 커밋**

```bash
git add -A src/components
git commit -m "정적 컴포넌트 6개를 .astro로 전환

styled-components와 rhythm() 호출을 스코프 스타일과 CSS 변수로
대체했다. 목차는 Gatsby의 HTML 문자열 대신 headings 배열로 만든다.
PostFrontmatterTIL의 p 안 div 중첩(유효하지 않은 HTML)을 고쳤다.
utterances의 repo/issue-term은 그대로 유지한다."
```

---

### Task 9: 글 상세 페이지

URL 보존의 핵심 지점이다. `slugFromFilePath`를 반드시 사용한다.

**Files:**
- Create: `src/pages/[...slug].astro`
- Delete: `src/templates/blog-post.js`

**Interfaces:**
- Consumes: `slugFromFilePath`, `groupByCategory`, `siblingPosts` (Task 1·3), `BaseLayout` (Task 6), 컴포넌트 6개 (Task 8)

- [ ] **Step 1: 페이지 작성**

```astro
---
import { getCollection, render } from 'astro:content'
import BaseLayout from '../layouts/BaseLayout.astro'
import Bio from '../components/Bio.astro'
import PostFrontmatter from '../components/PostFrontmatter.astro'
import PostFrontmatterTIL from '../components/PostFrontmatterTIL.astro'
import PostTableOfContent from '../components/PostTableOfContent.astro'
import PostComment from '../components/PostComment.astro'
import { slugFromFilePath, groupByCategory, siblingPosts, readingTime } from '../utils/posts.js'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  const grouped = groupByCategory(posts)
  const paths = []

  // prev/next는 카테고리 안에서 계산한다 (gatsby-node.js와 동일한 동작).
  for (const items of grouped.values()) {
    items.forEach((post, index) => {
      const { previous, next } = siblingPosts(items, index)
      paths.push({
        // entry.id가 아니라 filePath에서 슬러그를 만든다 — 대소문자 보존.
        params: { slug: slugFromFilePath(post.filePath) },
        props: {
          post,
          previous: previous
            ? { slug: slugFromFilePath(previous.filePath), title: previous.data.title }
            : null,
          next: next
            ? { slug: slugFromFilePath(next.filePath), title: next.data.title }
            : null,
        },
      })
    })
  }

  return paths
}

const { post, previous, next } = Astro.props
const { Content, headings } = await render(post)

const formattedDate = post.data.date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  timeZone: 'UTC',
})
const timeToRead = readingTime(post.body)
const isReport = post.data.category === 'report'
---

<BaseLayout
  title={post.data.title}
  description={post.data.description}
  pathname={Astro.url.pathname}
>
  <article itemscope itemtype="https://schema.org/Article">
    <header>
      <h1 itemprop="headline" class="post-title">{post.data.title}</h1>
      {isReport ? (
        <PostFrontmatterTIL
          date={formattedDate}
          category={post.data.category}
          creator={post.data.creator}
          created_at={post.data.created_at}
          link={post.data.link}
        />
      ) : (
        <PostFrontmatter
          date={formattedDate}
          timeToRead={timeToRead}
          category={post.data.category}
          isInPost={true}
        />
      )}
    </header>

    <PostTableOfContent headings={headings} />

    <section itemprop="articleBody">
      <Content />
    </section>

    <hr class="post-divider" />

    <footer>
      <Bio />
    </footer>
  </article>

  <nav>
    <ul class="post-nav">
      <li>{previous && <a href={`/${previous.slug}/`} rel="prev">← {previous.title}</a>}</li>
      <li>{next && <a href={`/${next.slug}/`} rel="next">{next.title} →</a>}</li>
    </ul>
  </nav>

  <PostComment />
</BaseLayout>

<style>
  .post-title {
    margin-top: var(--rhythm-2);
    margin-bottom: 0;
  }
  .post-divider {
    margin-bottom: var(--rhythm-1);
  }
  .post-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style: none;
    padding: 0;
  }
</style>
```

날짜 형식은 Gatsby의 `formatString: "MMMM DD, YYYY"`와 같은 결과(`July 08, 2021`)를 내야 한다. `timeZone: 'UTC'`가 중요하다 — 없으면 로컬 시간대에 따라 날짜가 하루 밀린다.

`readingTime`은 Task 3에서 구현한 순수 함수다. `post.body`만 필요해 `render()` 결과에 의존하지 않으므로 목록 페이지에서도 같은 값을 쓸 수 있다.

- [ ] **Step 2: 빌드 후 URL 확인**

Run: `npm run build`
Expected: 113개 글 페이지 생성

Run: `ls -d dist/study/APIs-The-Good-The-Bad-The-Ugly dist/algorithm/hackerrank/Utopian-Tree`
Expected: 두 디렉터리 모두 존재 (대문자 보존 확인). 소문자로 생성됐다면 `slugFromFilePath`를 거치지 않은 코드가 있다.

- [ ] **Step 3: 구 템플릿 삭제**

```bash
git rm src/templates/blog-post.js
```

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "글 상세 페이지 추가

URL은 slugFromFilePath로만 만들어 대소문자를 보존한다.
prev/next는 카테고리 내에서 계산하는 기존 동작을 유지한다.
날짜 포맷에 timeZone UTC를 지정해 날짜가 밀리지 않게 한다."
```

---

### Task 10: 홈 페이지

**Files:**
- Modify: `src/pages/index.astro` (Task 2·7의 임시 내용을 대체)
- Delete: `src/pages/index.js`

**Interfaces:**
- Consumes: `slugFromFilePath` (Task 1), `BaseLayout`, `PostListTitle`, `PostFrontmatter`

- [ ] **Step 1: 페이지 작성**

원본 GraphQL 필터 `regex: "/^(?!algorithm|report)/"`를 JS로 옮긴다.

```astro
---
import { getCollection } from 'astro:content'
import BaseLayout from '../layouts/BaseLayout.astro'
import PostListTitle from '../components/PostListTitle.astro'
import PostFrontmatter from '../components/PostFrontmatter.astro'
import { slugFromFilePath, readingTime } from '../utils/posts.js'

const EXCLUDED_PREFIXES = ['algorithm', 'report']

const posts = (await getCollection('blog'))
  .filter(p => !EXCLUDED_PREFIXES.some(prefix => p.data.category.startsWith(prefix)))
  .sort((a, b) => b.data.date - a.data.date)
---

<BaseLayout title="All posts" pathname={Astro.url.pathname}>
  <PostListTitle title="All Posts" />
  {posts.map(post => (
    <article>
      <header>
        <h3 class="post-list-title">
          <a href={`/${slugFromFilePath(post.filePath)}/`} itemprop="url">
            <span itemprop="headline">{post.data.title}</span>
          </a>
        </h3>
        <PostFrontmatter
          date={post.data.date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: '2-digit', timeZone: 'UTC',
          })}
          timeToRead={readingTime(post.body)}
          category={post.data.category}
        />
      </header>
      <section>
        <p itemprop="description" set:html={post.data.description ?? ''} />
      </section>
    </article>
  ))}
</BaseLayout>

<style>
  .post-list-title {
    margin-bottom: var(--rhythm-quarter);
  }
  .post-list-title a {
    box-shadow: none;
  }
</style>
```

원본은 `description || excerpt`로 폴백했다. `description`이 없는 글은 1개이고 그 글은 `algorithm` 또는 `report` 카테고리인지 확인이 필요하다. 홈 목록에 포함되면서 `description`이 없다면 빈 문단이 나오므로, Step 2에서 확인해 필요 시 본문 앞부분으로 폴백한다.

- [ ] **Step 2: `description` 없는 글의 카테고리 확인**

Run:
```bash
grep -L "^description:" $(find src/content/blog -name "*.md") | head
```
Expected: 파일 1개. 그 파일의 `category`를 확인한다.

- `algorithm/*` 또는 `report`라면 → 홈에 안 나오므로 추가 처리 불필요
- 그 외라면 → `post.body`의 앞 160자를 폴백으로 쓰도록 아래를 적용한다

```astro
const excerpt = (body) =>
  body.replace(/^---[\s\S]*?---/, '').replace(/[#*`>\[\]]/g, '').trim().slice(0, 160)
```

그리고 `set:html={post.data.description ?? excerpt(post.body)}`로 바꾼다.

- [ ] **Step 3: 구 페이지 삭제 및 빌드**

```bash
git rm src/pages/index.js
```

Run: `npm run build`
Expected: `dist/index.html` 생성. 목록에 `algorithm`·`report` 글이 없어야 한다.

Run: `grep -c 'algorithm/' dist/index.html`
Expected: `0` (카테고리 내비는 Header에 있으므로 0이 아닐 수 있다. 그 경우 `<article>` 내부만 확인한다)

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "홈 페이지 추가

GraphQL 부정 전방탐색 정규식 필터를 startsWith 기반 JS 필터로
대체했다. algorithm과 report 카테고리를 홈 목록에서 제외한다."
```

---

### Task 11: 카테고리 페이지 + `report` 분기

**Files:**
- Create: `src/pages/[...category].astro`
- Delete: `src/templates/category-page.js`, `src/templates/read-list.js`

**Interfaces:**
- Consumes: `slugFromFilePath`, `groupByCategory`, `categoryPaths` (Task 1·3)

**주의:** `[...slug].astro`(Task 9)와 `[...category].astro`가 같은 형태의 rest 파라미터라 경로 충돌이 발생할 수 있다. Astro는 더 구체적인 라우트를 우선하지만, 두 라우트가 서로 다른 경로 집합을 생성하므로 실제 충돌은 없다. 만약 빌드가 중복 경로 오류를 내면 카테고리 페이지를 `src/pages/category/[...path].astro`가 아니라 **명시적 경로 생성**으로 바꿔야 하므로, 이 태스크에서 빌드 결과를 반드시 확인한다.

- [ ] **Step 1: 페이지 작성**

**⚠️ 이 태스크의 초안은 틀렸다.** 원본 `read-list.js`와 라이브 마크업을 대조해 확정한 실제 구조는 다음과 같다.

**일반 카테고리** (`category-page.js`) — `PostFrontmatter`에 `date`와 `timeToRead`만 넘긴다. **`category`를 넘기지 않으므로 카테고리 링크가 없다.**

```html
<article><header>
  <h3 style="margin-bottom:0.40625rem">
    <a style="box-shadow:none" href="/lavender/1-year/">1 year</a>
  </h3>
  <small>April 14, 2021 • ☕️ 1 min read</small>
</header>
<section><p>설명</p></section></article>
```

**`report` 카테고리** (`read-list.js`) — `PostFrontmatter`도 `PostFrontmatterTIL`도 쓰지 않는다. `h4`와 날짜 하나뿐이고, 설명 섹션도 카테고리 링크도 없다. `creator`/`created_at`/`link`는 목록에 나오지 않는다.

```html
<article><header>
  <h4 style="margin-bottom:0.40625rem">
    <a style="box-shadow:none" href="/report/slug/">제목</a>
  </h4>
  <section><p style="font-size:0.8125rem">June 14, 2021</p></section>
</header></article>
```

`font-size:0.8125rem`은 원본이 `rhythm(1/2)`을 font-size로 쓴 결과다. 의도한 코드는 아니겠지만 그대로 보존한다.

`PostFrontmatterTIL`은 **글 상세 페이지에서만** 쓰인다.

```astro
---
import { getCollection } from 'astro:content'
import BaseLayout from '../layouts/BaseLayout.astro'
import PostListTitle from '../components/PostListTitle.astro'
import PostFrontmatter from '../components/PostFrontmatter.astro'
import { slugFromFilePath, groupByCategory, categoryPaths, readingTime } from '../utils/posts.js'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  const grouped = groupByCategory(posts)

  return categoryPaths(grouped.keys()).map(category => {
    // 하위 카테고리 글까지 포함한다 (원본의 ^/category/ 정규식과 동일한 의도).
    const items = posts
      .filter(p => p.data.category === category || p.data.category.startsWith(`${category}/`))
      .sort((a, b) => b.data.date - a.data.date)

    return { params: { category }, props: { category, items } }
  })
}

const { category, items } = Astro.props
// report는 read-list 레이아웃을 쓴다. h4와 날짜만 있고 설명도 카테고리 링크도 없다.
const isReadList = category === 'report'

const fmt = d => d.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: '2-digit', timeZone: 'UTC',
})
---

<BaseLayout title={category} pathname={Astro.url.pathname}>
  <PostListTitle title={category} />
  {items.map(post => (
    <article>
      <header>
        {isReadList ? (
          <>
            <h4 class="post-list-title">
              <a href={`/${slugFromFilePath(post.filePath)}/`}>{post.data.title}</a>
            </h4>
            <section>
              <p class="read-list-date">{fmt(post.data.date)}</p>
            </section>
          </>
        ) : (
          <h3 class="post-list-title">
            <a href={`/${slugFromFilePath(post.filePath)}/`}>{post.data.title}</a>
          </h3>
        )}
        {!isReadList && (
          <PostFrontmatter date={fmt(post.data.date)} timeToRead={readingTime(post.body)} />
        )}
      </header>
      {!isReadList && (
        <section>
          <p set:html={post.data.description ?? ''} />
        </section>
      )}
    </article>
  ))}
</BaseLayout>

<style>
  .post-list-title {
    margin-bottom: var(--rhythm-quarter);
  }
  .post-list-title a {
    box-shadow: none;
  }
  /* 원본이 rhythm(1/2)을 font-size로 쓴 결과. 의도한 코드는 아니지만 보존한다. */
  .read-list-date {
    font-size: var(--rhythm-half);
  }
</style>
```

`PostFrontmatter`에 `category`를 넘기지 않는 것이 중요하다. 넘기면 원본에 없는 카테고리 링크가 생긴다.

- [ ] **Step 2: 빌드하고 라우트 충돌 여부 확인**

Run: `npm run build`
Expected: 성공. 중복 경로 오류가 나면 위 "주의"에 따라 대응한다.

Run: `ls -d dist/lavender dist/report dist/algorithm dist/algorithm/programmers`
Expected: 네 디렉터리 모두 존재

Run: `ls dist/refernece 2>/dev/null; echo "exit=$?"`
Expected: 존재하지 않음 — 아직 오타를 안 고쳤으므로 이 시점에는 `/refernece`가 생성된다. Task 14에서 고친 뒤 사라진다.

- [ ] **Step 3: 구 템플릿 삭제**

```bash
git rm src/templates/category-page.js src/templates/read-list.js
rmdir src/templates 2>/dev/null || true
```

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "카테고리 페이지 추가

category-page와 read-list 두 템플릿을 하나로 합치고 report만
내부에서 분기한다. 카테고리 URL 생성 로직이 한곳에 모인다."
```

---

### Task 12: about · 404 페이지, URL 검증 1차 통과

**Files:**
- Create: `src/pages/about.astro`, `src/pages/404.astro`
- Delete: `src/pages/about.js`, `src/pages/404.js`, `src/pages/using-typescript.tsx.backup`

- [ ] **Step 1: 기존 about·404 내용 확인**

Run: `cat src/pages/about.js src/pages/404.js`

두 파일의 본문 마크업을 그대로 `.astro`로 옮긴다. `<Layout>` → `<BaseLayout>`, `<SEO title=...>` → `BaseLayout`의 `title` prop으로 바꾸고 `rhythm()`은 CSS 변수로 대체한다.

- [ ] **Step 2: `about.astro` 작성**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout title="About" pathname={Astro.url.pathname}>
  <!-- src/pages/about.js의 JSX 본문을 여기로 옮긴다 -->
</BaseLayout>
```

- [ ] **Step 3: `404.astro` 작성**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout title="404: Not Found" pathname={Astro.url.pathname}>
  <!-- src/pages/404.js의 JSX 본문을 여기로 옮긴다 -->
</BaseLayout>
```

- [ ] **Step 4: 구 파일 삭제**

```bash
git rm src/pages/about.js src/pages/404.js src/pages/using-typescript.tsx.backup
```

- [ ] **Step 5: URL 검증 실행 — 이 태스크의 핵심**

Run: `npm run build && npm run verify:urls`
Expected: 이 시점에는 아직 **실패**한다. 남은 차이는 정확히 두 개여야 한다.

```
❌ 제거되어야 할 URL이 남아있다: /refernece/
❌ 추가되어야 할 URL이 없다: /reference/
```

다른 차이가 출력되면 그것이 진짜 문제다. 특히 "사라진 URL"이 하나라도 있으면 즉시 원인을 찾는다 — 대소문자 소문자화, trailing slash 불일치, 카테고리 누락 중 하나다.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "about·404 페이지 이전

URL 검증에서 refernece 오타 관련 2건만 남았다."
```

---

### Task 13: remark/rehype 플러그인 배선

**Files:**
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: `readingTime` (Task 3) — 이 태스크는 읽기 시간 관련 코드를 추가하지 않는다

- [ ] **Step 1: reading-time은 이미 구현돼 있다 — 이 단계는 건너뛴다**

읽기 시간은 remark 플러그인이 아니라 `src/utils/posts.js`의 `readingTime(body)`로 처리한다 (Task 3에서 구현, 테스트 포함).

플러그인 대신 순수 함수를 쓰는 이유: 목록 페이지(홈·카테고리)도 읽기 시간을 표시하는데, remark 플러그인의 결과는 `render()`를 거쳐야 얻을 수 있다. 목록마다 113개 글을 렌더링하는 대신 `post.body`에서 직접 계산한다. 상세 페이지와 목록 페이지가 같은 함수를 쓰므로 값이 어긋날 여지도 없다.

Gatsby의 `timeToRead`는 재현하지 않는다. 원본이 `sanitizeHTML(html, { allowTags: [] })`를 쓰는데 sanitize-html의 실제 옵션명은 `allowedTags`라서 인자가 무시되고, 태그 이름과 속성까지 단어로 계산됐다. 그 수치는 Gatsby가 만든 HTML 마크업(Prism의 token span 더미 등)에 의존하므로 마크다운 파이프라인이 다른 Astro에서는 재현 대상이 아니다. 라이브 실측값 81건 대비 65건 일치, 최대 2분 차이로 확인했다.

- [ ] **Step 2: `astro.config.mjs`에 플러그인 배선**

```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import { remarkSmartypants } from 'remark-smartypants'

export default defineConfig({
  site: 'https://ohseunghyeon.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
  markdown: {
    // gatsby-remark-prismjs를 대체한다. prism-okaidia 테마와
    // 가장 가까운 내장 테마를 쓴다.
    shikiConfig: {
      theme: 'github-dark',
      wrap: false,
    },
    remarkPlugins: [remarkSmartypants],
    rehypePlugins: [
      rehypeSlug,
      // gatsby-remark-autolink-headers 대체. 헤딩 앞에 앵커를 붙인다.
      [rehypeAutolinkHeadings, { behavior: 'prepend', properties: { class: 'anchor' } }],
      // gatsby-remark-external-links 대체. target=_blank + rel 보강.
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
})
```

- [ ] **Step 3: 코드 하이라이팅 테마 대조**

Run: `npm run build && npm run preview`

코드블록이 있는 글을 라이브 사이트와 나란히 비교한다. 예: `/study/when-the-duplicates-are-created-on-postgreSQL-with-unique-index-by-null/`

`github-dark`가 기존 `prism-okaidia`와 크게 다르면 `shikiConfig.theme`를 `'monokai'`로 바꾼다 — okaidia는 monokai 계열이다.

- [ ] **Step 4: 읽기 시간 표시 확인**

Run: `grep -o '☕️*[^<]*min read' dist/lavender/1-year/index.html | head -1`
Expected: `☕️ N min read` 형태의 문자열이 나온다

- [ ] **Step 5: 헤딩 앵커 확인**

Run: `grep -o 'class="anchor"' dist/study/APIs-The-Good-The-Bad-The-Ugly/index.html | head -1`
Expected: 앵커가 존재한다. 목차 링크(`#슬러그`)와 헤딩 `id`가 같은 slugger에서 나오므로 서로 맞는다.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "remark/rehype 플러그인 배선

gatsby-remark-* 5개를 표준 remark/rehype 플러그인으로 대체했다.
코드 하이라이팅은 Shiki 내장으로 빌드타임 처리되어 런타임 JS가 없다.
timeToRead는 265 wpm 기준으로 직접 계산한다."
```

---

### Task 14: 콘텐츠 치환 및 오타 수정

**Files:**
- Modify: `src/content/blog/lavender/6-months-of-babysitting.md`
- Modify: `src/content/blog/study/APIs-The-Good-The-Bad-The-Ugly/index.md`
- Modify: `src/content/blog/blogging/deploying-github-pages-with-github-actions/index.md`
- Modify: `src/content/blog/reference/npm-모듈-설치-시-node-gyp-rebuild-에러.md`
- Modify: `src/styles/global.scss`
- Delete: `src/content/blog/blogging/making-table-of-contents-on-gatsby-starter-blog.md.backup`
- Modify: 이모지 문법이 있는 글 (Step 3에서 확인)

- [ ] **Step 1: `refernece` 오타 수정**

이것이 URL 검증을 통과시키는 마지막 조각이다.

Run:
```bash
grep -n "^category:" "src/content/blog/reference/npm-모듈-설치-시-node-gyp-rebuild-에러.md"
```
Expected: `category: refernece`

`category: reference`로 수정한다. **글의 파일 경로는 바꾸지 않는다** — 글 URL이 파일 경로에서 나오므로 경로를 건드리면 댓글이 떨어진다.

- [ ] **Step 2: 유튜브 임베드 3곳 치환**

각 파일에서 `` `youtube:URL` `` 형태의 인라인 코드를 찾아 아래로 바꾼다. video ID는 URL 형태별로 다르게 추출한다.

| 파일 | 원본 | video ID |
|---|---|---|
| `lavender/6-months-of-babysitting.md` | `` `youtube:https://youtu.be/fcHfzN9XBHk` `` | `fcHfzN9XBHk` |
| `study/APIs-The-Good-The-Bad-The-Ugly/index.md` | `` `youtube:https://www.youtube.com/watch?v=t0nl5aUfAvY` `` | `t0nl5aUfAvY` |
| `blogging/deploying-github-pages-with-github-actions/index.md` | `` `youtube:https://www.youtube.com/embed/E1OunoCyuhY` `` | `E1OunoCyuhY` |

치환 형태 (VIDEO_ID를 위 표의 값으로 채운다):

```html
<div class="video-embed">
  <iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="YouTube video player"
    loading="lazy"
    allowfullscreen
  ></iframe>
</div>
```

- [ ] **Step 3: 이모지 문법 4곳 치환**

Run:
```bash
grep -rn ':[a-z_+-]\{2,20\}:' src/content/blog
```

출력된 각 위치의 `:emoji_name:`을 해당 유니코드 이모지 문자로 직접 바꾼다. 4곳뿐이라 플러그인이 필요 없다.

- [ ] **Step 4: `global.scss`에 `.video-embed` 스타일 추가**

`gatsby-remark-responsive-iframe`의 padding-bottom 방식을 `aspect-ratio`로 대체한다.

```scss
.video-embed {
  position: relative;
  aspect-ratio: 16 / 9;
  margin-bottom: var(--rhythm-1);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
}
```

- [ ] **Step 5: 백업 파일 삭제**

```bash
git rm "src/content/blog/blogging/making-table-of-contents-on-gatsby-starter-blog.md.backup"
```

- [ ] **Step 6: URL 검증 통과 확인 — 1단계의 결승선**

Run: `npm run build && npm run verify:urls`
Expected: **PASS**

```
✅ URL 125개 전부 일치 (의도된 차이 3건 반영)
```

실패하면 출력된 차이를 하나씩 해결한다. 통과할 때까지 다음 태스크로 넘어가지 않는다.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "콘텐츠 치환 및 refernece 오타 수정

유튜브 임베드 3곳을 반응형 iframe으로, 이모지 문법 4곳을
리터럴 이모지로 바꿔 플러그인 2개를 제거했다.
refernece 오타를 고쳐 글 0개였던 카테고리 페이지를 살렸다.
글 파일 경로는 그대로 두어 URL과 댓글을 보존한다.

URL 동일성 검증 통과."
```

---

### Task 15: 이미지 확대 · 매니페스트 · 서비스 워커 묘비

**Files:**
- Create: `public/sw.js`, `public/manifest.webmanifest`
- Modify: `src/layouts/BaseLayout.astro` (medium-zoom 초기화)
- Copy: `src/assets/profile-pic.png` → `public/icons/`

- [ ] **Step 1: 서비스 워커 묘비 작성**

`gatsby-plugin-offline`이 등록해둔 SW가 방문자 브라우저에 남아 있다. 그냥 지우면 낡은 캐시가 계속 서빙된다.

`public/sw.js`:

```js
// gatsby-plugin-offline이 등록한 서비스 워커를 정리하는 묘비.
// 등록된 SW는 서버에서 파일이 사라져도 스스로 사라지지 않으므로,
// 같은 경로에 자기 자신을 등록 해제하는 SW를 배포해야 한다.
//
// 기존 방문자가 모두 정리될 때까지 이 파일을 삭제하지 말 것.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map(k => caches.delete(k)))
      await self.registration.unregister()

      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) client.navigate(client.url)
    })()
  )
})
```

- [ ] **Step 2: 매니페스트 작성**

`gatsby-plugin-manifest`의 설정값을 그대로 옮긴다.

```bash
mkdir -p public/icons
cp src/assets/profile-pic.png public/icons/icon-512.png
```

`public/manifest.webmanifest`:

```json
{
  "name": "Lazy Nyaong",
  "short_name": "LazyNyaong",
  "start_url": "/",
  "background_color": "#ffffff",
  "theme_color": "#663399",
  "display": "minimal-ui",
  "icons": [
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

아이콘 원본이 512×512보다 작으면 `sizes`를 실제 크기로 맞춘다.

Run: `node -e "console.log(require('image-size'))" 2>/dev/null || file src/assets/profile-pic.png`

- [ ] **Step 3: medium-zoom 초기화**

`BaseLayout.astro`의 `</body>` 직전에 추가한다. `gatsby-remark-images-medium-zoom`을 대체한다.

```astro
<script>
  import mediumZoom from 'medium-zoom'
  // 본문 이미지에만 적용한다. 프로필 사진과 토글 아이콘은 제외.
  mediumZoom('article section img', { background: 'var(--bg)' })
</script>
```

`is:inline`을 붙이지 않는다 — Astro가 번들링해야 `medium-zoom` import가 해결된다.

- [ ] **Step 4: 확인**

Run: `npm run build`
Expected: 성공

Run: `ls dist/sw.js dist/manifest.webmanifest dist/icons/icon-512.png`
Expected: 세 파일 모두 존재

Run: `npm run preview` → 글 페이지에서 본문 이미지를 클릭
Expected: 확대 동작

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "서비스 워커 묘비·매니페스트·이미지 확대 추가

gatsby-plugin-offline이 등록한 SW가 방문자 브라우저에 남아
낡은 캐시를 서빙하지 않도록 자기 자신을 등록 해제하는 sw.js를
같은 경로에 배포한다. 기존 방문자 정리 전까지 삭제 금지."
```

---

### Task 16: RSS 피드

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: 피드 작성**

원본 `gatsby-plugin-feed`의 필터(`algorithm`·`report` 제외)와 출력 경로(`/rss.xml`)를 유지한다.

원본 `gatsby-plugin-feed`는 `content:encoded`에 본문 HTML 전체를 넣었다. 구독자 경험을 보존하기 위해 이를 유지한다.

```ts
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { slugFromFilePath } from '../utils/posts.js'

const EXCLUDED_PREFIXES = ['algorithm', 'report']

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter(p => !EXCLUDED_PREFIXES.some(prefix => p.data.category.startsWith(prefix)))
    .sort((a, b) => b.data.date - a.data.date)

  // 본문 HTML을 얻으려면 각 글을 렌더링해야 한다.
  // gatsby-plugin-feed의 content:encoded 동작을 보존한다.
  const container = await AstroContainer.create()

  const items = []
  for (const post of posts) {
    const { Content } = await post.render()
    const html = await container.renderToString(Content)
    items.push({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/${slugFromFilePath(post.filePath)}/`,
      content: html,
    })
  }

  return rss({
    title: 'Lazy Nyaong',
    description: 'Code, Lazy, Cat',
    site: context.site,
    items,
  })
}
```

`@astrojs/rss`의 `content` 필드가 `content:encoded`로 출력된다.

**주의:** Astro 7에서 컬렉션 엔트리의 렌더링 API가 `post.render()`인지 `render(post)`(`astro:content`에서 import)인지 확인이 필요하다. Task 9에서 `[...slug].astro`가 쓴 형태와 **같은 API를 쓴다.** 두 곳이 달라지면 한쪽이 조용히 깨진다.

`AstroContainer` API가 이 버전에서 동작하지 않으면 대안은 두 가지다.
1. `container.renderToString()` 대신 `@astrojs/rss`의 `compiledContent()` 지원 여부 확인
2. 그래도 안 되면 `content` 필드를 빼고 `description`만 제공하되, **그 사실을 보고하고 사용자 판단을 받는다** — 조용히 축소하지 않는다.

- [ ] **Step 2: 확인**

Run: `npm run build`

Run: `grep -c '<item>' dist/rss.xml`
Expected: `algorithm`·`report`를 제외한 글 수 (113 − 28 − 10 − 4 − 30 = 41개 전후. `algorithm/*` 42개와 `report` 30개를 뺀 값)

Run: `grep -o '<link>[^<]*</link>' dist/rss.xml | head -3`
Expected: `algorithm/`이나 `report/`로 시작하는 링크가 없다

Run: `grep -c 'content:encoded' dist/rss.xml`
Expected: `<item>` 개수와 같다 — 본문 전문이 모든 항목에 들어갔다는 확인

- [ ] **Step 3: 커밋**

```bash
git add src/pages/rss.xml.ts
git commit -m "RSS 피드 추가

algorithm과 report 카테고리를 제외하는 기존 필터와
content:encoded 본문 전문 제공을 모두 유지한다."
```

---

### Task 17: 글 생성 CLI

**Files:**
- Create: `scripts/new-post.mjs`
- Delete: `cli/create-new-post.js`

- [ ] **Step 1: 새 스크립트 작성**

기존 동작을 보존한다: 카테고리 선택(신규 입력 포함), 제목 입력, 파일/디렉터리 선택, `report`의 추가 필드. 경로만 `src/content/blog`로 바뀐다.

```js
#!/usr/bin/env node
import { mkdir, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { select, input } from '@inquirer/prompts'
import matter from 'gray-matter'

const TARGET_DIR = 'src/content/blog'
// 이 카테고리는 하위 카테고리를 가진다
const SUB_CATEGORY_LIST = ['algorithm']
const CREATE_NEW = '[[ CREATE NEW CATEGORY ]]'

async function findCategories() {
  const result = []
  for (const item of await readdir(TARGET_DIR, { withFileTypes: true })) {
    if (!item.isDirectory()) continue
    if (SUB_CATEGORY_LIST.includes(item.name)) {
      for (const sub of await readdir(join(TARGET_DIR, item.name), { withFileTypes: true })) {
        if (sub.isDirectory()) result.push(`${item.name}/${sub.name}`)
      }
    } else {
      result.push(item.name)
    }
  }
  return result.sort()
}

const categories = await findCategories()

let category = await select({
  message: 'Select a category',
  choices: [...categories.map(c => ({ value: c })), { value: CREATE_NEW }],
})

if (category === CREATE_NEW) {
  category = await input({ message: 'Enter the customized category' })
}
if (!category) throw new Error('Cannot find category!')

const title = await input({ message: 'Enter the title', default: 'New post title' })

const headers = {
  title,
  date: new Date().toISOString(),
  description: '',
  category,
}
if (category === 'report') {
  headers.creator = ''
  headers.created_at = ''
  headers.link = ''
}

const type = await select({
  message: 'Select the way to make file',
  choices: [{ value: 'file' }, { value: 'directory' }],
})

const slug = title.split(' ').join('-').toLowerCase()
const destDir = join(TARGET_DIR, category, type === 'directory' ? slug : '')
const fileName = `${type === 'directory' ? 'index' : slug}.md`
const filePath = join(destDir, fileName)

await mkdir(destDir, { recursive: true })
// 원본과 동일하게 작은따옴표를 제거한다 (프론트매터 인용 부호 정리)
await writeFile(filePath, matter.stringify('', headers).split("'").join(''))

console.log('\nSuccess to create new post!')
console.log(filePath)
```

- [ ] **Step 2: 동작 확인**

Run: `npm run post`

카테고리 목록이 나오는지, `lavender`를 선택하고 제목을 입력했을 때 `src/content/blog/lavender/<슬러그>.md`가 생성되는지 확인한다.

- [ ] **Step 3: 생성된 파일이 스키마를 통과하는지 확인**

Run: `npm run build`
Expected: 성공. 실패하면 프론트매터 형식이 Zod 스키마와 맞지 않는 것이다.

- [ ] **Step 4: 테스트로 만든 글 삭제 후 커밋**

```bash
rm src/content/blog/lavender/<테스트로-만든-파일>.md
git rm -r cli
git add scripts/new-post.mjs
git commit -m "글 생성 CLI를 ESM으로 다시 작성

inquirer 7(CommonJS)을 @inquirer/prompts로 교체하고
콘텐츠 경로를 src/content/blog로 맞췄다.
카테고리 선택·신규 입력·report 추가 필드 동작은 그대로 유지한다."
```

---

### Task 18: Gatsby 잔재 제거 및 1단계 최종 검증

**Files:**
- Delete: `gatsby-config.js`, `gatsby-node.js`, `gatsby-browser.js`, `src/html.js`, `src/utils/typography.js`, `src/components/Layout.js`, `src/components/Seo.js`, `yarn.lock`
- Modify: `README.md`

- [ ] **Step 1: 남은 Gatsby 파일 삭제**

```bash
git rm gatsby-config.js gatsby-node.js gatsby-browser.js \
       src/html.js src/utils/typography.js \
       src/components/Layout.js src/components/Seo.js \
       yarn.lock
```

- [ ] **Step 2: 참조가 남아있지 않은지 확인**

Run: `grep -rn "gatsby\|typography.js\|styled-components\|react-helmet" src scripts astro.config.mjs package.json --exclude-dir=node_modules`

Expected: 다음만 남아야 한다.
- `src/styles/typography.css` 안의 `a.gatsby-resp-image-link` 선택자 — 굳힌 CSS의 일부이므로 정상. 다만 이제 해당 클래스를 생성하는 코드가 없으니 이 규칙은 무해한 사문(dead rule)이다.
- 주석 안의 설명 문구

`import` 문에 남아 있으면 삭제하거나 대체한다.

- [ ] **Step 3: 테스트 전체 실행**

Run: `npm test`
Expected: PASS — 10개 테스트

- [ ] **Step 4: URL 검증 재실행**

Run: `npm run build && npm run verify:urls`
Expected: PASS

- [ ] **Step 5: 시각 대조 (스펙 8-4)**

Run: `npm run preview`

라이브 사이트와 나란히 열고 다음을 확인한다.

- [ ] 홈 — 목록, 날짜·읽기시간·카테고리 표기
- [ ] 글 상세 — `/lavender/1-year/`, 본문 타이포그래피, 목차(1278px 이상 창), prev/next
- [ ] `report` 목록 — `/report/`, creator·created_at·link 표시
- [ ] 카테고리 — `/algorithm/programmers/`
- [ ] 다크모드 토글 — 전환, 새로고침 후 유지, OS 테마 변경 시 경고창이 뜨지 않는 것
- [ ] 모바일 폭 — 햄버거 메뉴
- [ ] 코드 하이라이팅, 이미지 확대, 유튜브 임베드 3곳
- [ ] `/reference/` — 오타 수정 후 글 1개가 보이는 것 (기존에는 0개)

- [ ] **Step 6: README 갱신**

Gatsby 기준으로 쓰인 설치·개발 안내를 Astro 기준으로 바꾼다. Node 22 요구사항과 `npm run dev`·`npm run build`·`npm test`·`npm run verify:urls`·`npm run post` 사용법을 적는다.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "Gatsby 잔재 제거 및 README 갱신

1단계 완료. 로컬 빌드 성공, 테스트 10개 통과,
URL 동일성 검증 통과."
```

---

## 2단계 — 저장소 통합 및 배포 전환

1단계의 URL 검증이 통과한 뒤에만 진행한다.

### Task 19: 배포 워크플로우 작성

**Files:**
- Create: `.github/workflows/deploy.yml`
- Delete: `.github/workflows/continuous-deployment-workflow.yml`

- [ ] **Step 1: 새 워크플로우 작성**

시크릿이 필요 없다. `GITHUB_TOKEN`의 권한만 사용한다.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# 배포가 겹치지 않게 한다. 진행 중인 배포는 취소하지 않는다.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Node 버전을 명시적으로 고정한다.
      # 이 고정이 없어서 2021년에 러너의 기본 Node가 올라갔을 때
      # 빌드가 깨지고 4년간 배포가 멈췄다.
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - run: npm test

      - run: npm run build

      # URL이 하나라도 바뀌면 배포를 막는다.
      # utterances 댓글이 pathname에 걸려 있다.
      - run: npm run verify:urls

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`npm run verify:urls`를 CI에 넣는 것이 중요하다. 앞으로 누군가 글 파일을 옮기면 배포가 실패하며 막아준다.

- [ ] **Step 2: 구 워크플로우 삭제**

```bash
git rm .github/workflows/continuous-deployment-workflow.yml
```

- [ ] **Step 3: 로컬에서 CI 단계 재현**

Run: `npm ci && npm test && npm run build && npm run verify:urls`
Expected: 네 단계 모두 성공. `npm ci`는 `package-lock.json`이 최신이어야 하므로 실패하면 `npm install` 후 lock 파일을 커밋한다.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "Pages 배포 워크플로우 추가

GITHUB_TOKEN만 사용해 시크릿과 deploy key가 필요 없다.
Node 22를 명시적으로 고정한다 — 이 고정이 없어서 러너의
기본 Node가 올라갔을 때 4년간 배포가 멈췄다.
URL 검증을 배포 게이트로 걸어 글 이동 시 배포를 막는다."
```

---

### Task 20: 저장소 통합 및 Pages 전환

**되돌리기 어려운 작업이다.** 각 단계에서 사용자 확인을 받는다.

**Files:** 저장소 구조 변경. 코드 변경 없음.

- [ ] **Step 1: 롤백 지점 확보**

`ohseunghyeon.github.io`의 현재 상태를 태그로 찍는다.

```bash
cd ~/Workspace
git clone git@github.com:ohseunghyeon/ohseunghyeon.github.io.git
cd ohseunghyeon.github.io
git tag pre-astro-migration
git push origin pre-astro-migration
```

Run: `git log --oneline -1`
Expected: 2021-07-08 시점의 커밋

- [ ] **Step 2: 현재 Pages 설정 기록**

되돌릴 때 필요하다.

```bash
gh api repos/ohseunghyeon/ohseunghyeon.github.io/pages > /tmp/pages-before.json
cat /tmp/pages-before.json
```

Expected: `"build_type":"legacy"`, `"source":{"branch":"master","path":"/"}`

- [ ] **Step 3: `astro-migration` 브랜치를 대상 저장소로 병합**

두 저장소의 히스토리를 모두 보존한다.

```bash
cd ~/Workspace/ohseunghyeon.github.io
git remote add source ~/Workspace/gatsby-blog
git fetch source astro-migration
git checkout -b astro-source
git merge --allow-unrelated-histories source/astro-migration
```

충돌은 양쪽에 같은 이름의 파일이 있는 경우에만 발생한다. 정적 산출물(`index.html`, `*.js` 등)과 소스 파일이 겹치면 **소스 쪽을 택한다**.

- [ ] **Step 4: 기존 정적 산출물 제거**

Pages가 Actions 방식으로 바뀌면 `master`에 빌드 결과가 필요 없다. 소스만 남긴다.

```bash
# 소스 파일 목록을 확인하고, 그 외 최상위 항목을 제거한다
ls -a
```

`git rm -r`로 제거할 대상은 병합 전 `ohseunghyeon.github.io`에 있던 정적 파일들이다. 남겨야 하는 것은 `src/`, `public/`, `scripts/`, `docs/`, `.github/`, `astro.config.mjs`, `package.json`, `package-lock.json`, `.nvmrc`, `.gitignore`, `.prettierrc`, `.prettierignore`, `README.md`, `LICENSE`, `LICENSE-posts`, `.vscode/`다.

`CNAME` 파일이 있으면 **삭제하지 않고 `public/CNAME`으로 옮긴다** — 커스텀 도메인 설정이다.

Run: `ls public/`
Expected: `sw.js`, `manifest.webmanifest`, `icons/`, (있다면) `CNAME`

- [ ] **Step 5: 빌드 확인**

```bash
npm ci && npm test && npm run build && npm run verify:urls
```
Expected: 네 단계 모두 성공

- [ ] **Step 6: 사용자 확인 후 `master`로 병합 및 push**

여기서부터 라이브 사이트에 영향이 간다. **진행 전 사용자에게 확인받는다.**

```bash
git add -A
git commit -m "Astro 소스로 전환 및 정적 산출물 제거

gatsby-blog 저장소의 소스를 히스토리와 함께 병합했다.
Pages를 Actions 방식으로 전환하므로 master에 빌드 결과를
두지 않는다. 되돌리려면 pre-astro-migration 태그를 참조한다."
git checkout master
git merge astro-source
git push origin master
```

- [ ] **Step 7: Pages를 Actions 방식으로 전환**

```bash
gh api -X PUT repos/ohseunghyeon/ohseunghyeon.github.io/pages \
  -f build_type=workflow
```

Run: `gh api repos/ohseunghyeon/ohseunghyeon.github.io/pages`
Expected: `"build_type":"workflow"`

- [ ] **Step 8: 배포 확인**

```bash
gh run list --repo ohseunghyeon/ohseunghyeon.github.io --limit 3
gh run watch --repo ohseunghyeon/ohseunghyeon.github.io
```

Expected: `build`와 `deploy` 잡 모두 성공

- [ ] **Step 9: 라이브 사이트 검증**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ohseunghyeon.github.io/
```
Expected: `200`

**4년간 배포되지 못한 글 2개가 올라왔는지 확인한다** (스펙 10절 3단계).

```bash
curl -s -o /dev/null -w "21개월 글: %{http_code}\n" https://ohseunghyeon.github.io/lavender/21-month-baby/
curl -s -o /dev/null -w "reference 카테고리: %{http_code}\n" https://ohseunghyeon.github.io/reference/
```
Expected: 둘 다 `200`. `/lavender/21-month-baby/`는 지금까지 존재하지 않던 URL이다.

- [ ] **Step 10: 댓글 보존 확인**

댓글이 달려 있던 글을 브라우저로 열어 utterances가 기존 스레드를 불러오는지 확인한다. 대문자를 포함한 글을 반드시 포함한다.

- [ ] `https://ohseunghyeon.github.io/study/APIs-The-Good-The-Bad-The-Ugly/`
- [ ] `https://ohseunghyeon.github.io/algorithm/hackerrank/Utopian-Tree/`

- [ ] **Step 11: 구 저장소 정리**

`gatsby-blog` 저장소는 역할이 끝났다. README에 이전 안내를 남기고 GitHub에서 아카이브한다.

```bash
gh repo archive ohseunghyeon/gatsby-blog
```

이 단계는 되돌릴 수 있으므로(`gh repo unarchive`) 위험하지 않지만, 사용자에게 확인받는다.

---

## Self-Review

**1. 스펙 커버리지**

| 스펙 절 | 구현 태스크 |
|---|---|
| 1-1 빌드 실패 원인 | Task 2 (node-sass 제거), Task 19 (Node 고정) |
| 1-2 배포 인증 | Task 20 (저장소 통합으로 제거) |
| 2 결정 사항 | Task 2 (Astro·GA 제거), Task 5 (타이포그래피), Task 20 (통합) |
| 3 URL 보존 | Task 1, 4, 9, 14 |
| 3-1-1 id 매핑 | Task 1 (`slugFromFilePath`) |
| 3-3 오타 | Task 14 Step 1 |
| 3-4 헤딩 앵커 | Task 13 Step 5 |
| 4 콘텐츠 인벤토리 | Task 2 Step 6 (Zod 스키마) |
| 5 목표 구조 | 전체 |
| 5 데이터 흐름 (`posts.js`) | Task 1, 3 |
| 5 아일랜드 경계 | Task 7 (React), Task 8 (정적) |
| 6 플러그인 매핑 | Task 13 (remark/rehype), Task 14 (콘텐츠), Task 15 (zoom·manifest), Task 16 (RSS) |
| 6-1 타이포그래피 | Task 5 |
| 6-2 SW 묘비 | Task 15 Step 1 |
| 7 CI·배포 | Task 19, 20 |
| 8-1 URL 검증 | Task 4 (작성), Task 12·14·18 (통과) |
| 8-2 콘텐츠 완전성 | Task 2 Step 8 |
| 8-3 기능 검증 | Task 13, 15, 16, 18 Step 5 |
| 8-4 시각 대조 | Task 18 Step 5 |
| 8-5 롤백 | Task 20 Step 1, 2 |
| 9 정리 대상 | Task 6 (alert), Task 14 (오타·백업), Task 17 (CLI), Task 12·18 (방치 파일) |
| 10 단계 구분 | 1단계 = Task 1~18, 2단계 = Task 19~20 |
| 11 비목표 | 계획에 포함하지 않음 |

누락 없음.

**2. 플레이스홀더 점검**

Task 12 Step 2·3의 `<!-- src/pages/about.js의 JSX 본문을 여기로 옮긴다 -->`는 의도된 것이다. 해당 파일 내용을 읽지 않았으므로 코드를 지어내는 대신 Step 1에서 원본을 확인하는 단계를 두었다. 다른 태스크는 모두 실제 코드를 포함한다.

Task 20 Step 4의 삭제 대상 목록은 병합 시점의 실제 파일 목록에 의존하므로 "남겨야 하는 것"을 명시하는 방식으로 기술했다.

**3. 타입·시그니처 일관성**

- `slugFromFilePath(filePath)` — Task 1 정의, Task 9·10·11·16에서 동일하게 사용
- `groupByCategory(entries) => Map` — Task 3 정의, Task 6·9·11에서 사용
- `categoryPaths(iterable) => string[]` — Task 3 정의, Task 6·11에서 사용
- `siblingPosts(posts, index) => { previous, next }` — Task 3 정의, Task 9에서 사용
- `BaseLayout` props `{ title, description?, pathname }` — Task 6 정의, Task 9·10·11·12에서 사용
- `Header` props `{ title, pathname, categories }` — Task 6이 전달, Task 7이 소비
- `PostFrontmatter` props `{ date, timeToRead?, category, isInPost? }` — Task 8 정의, Task 9·10·11에서 사용
- `PostTableOfContent` props `{ headings }` — Task 8 정의, Task 9에서 사용
- `window.__theme` / `__setPreferredTheme` / `__onThemeChange` — Task 6이 정의, Task 7 `Toggle.jsx`가 소비
- `readingTime(body) => number` — Task 3 정의, Task 9·10·11에서 사용

불일치 없음.
