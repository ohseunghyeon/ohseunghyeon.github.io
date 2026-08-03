import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  slugFromFilePath,
  groupByCategory,
  categoryPaths,
  siblingPosts,
  readingTime,
} from './posts.js'

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
  assert.equal(paths.filter(p => p === 'algorithm').length, 1)
  assert.equal(new Set(paths).size, paths.length)
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
  assert.ok(middle.previous.filePath.endsWith('a.md'))
  assert.ok(middle.next.filePath.endsWith('c.md'))

  const newest = siblingPosts(posts, 0)
  assert.equal(newest.next, null)
  assert.ok(newest.previous.filePath.endsWith('b.md'))

  const oldest = siblingPosts(posts, 2)
  assert.equal(oldest.previous, null)
  assert.ok(oldest.next.filePath.endsWith('b.md'))
})

test('siblingPosts: 글이 하나뿐이면 양쪽 모두 null', () => {
  const posts = [entry('only.md', 'x', '2021-01-01')]
  assert.deepEqual(siblingPosts(posts, 0), { previous: null, next: null })
})

test('readingTime: 짧은 글도 최소 1분', () => {
  assert.equal(readingTime('짧다'), 1)
  assert.equal(readingTime(''), 1)
})

test('readingTime: 한글은 글자당 0.56단어로 센다', () => {
  // 한글 500자 -> 280단어 -> round(280/265) = 1
  assert.equal(readingTime('가'.repeat(500)), 1)
  // 한글 1000자 -> 560단어 -> round(560/265) = 2
  assert.equal(readingTime('가'.repeat(1000)), 2)
})

test('readingTime: 라틴 단어는 265wpm 기준', () => {
  assert.equal(readingTime('word '.repeat(265)), 1)
  assert.equal(readingTime('word '.repeat(530)), 2)
})

test('readingTime: 한글과 라틴이 섞이면 합산한다', () => {
  // 라틴 265단어(=1.0분) + 한글 500자(=280단어, 1.06분) -> round(545/265) = 2
  assert.equal(readingTime('word '.repeat(265) + '가'.repeat(500)), 2)
})

test('readingTime: 마크다운 기호는 단어로 세지 않는다', () => {
  const withMarkup = '## 제목\n\n- 항목\n- 항목\n\n`code`'
  const withoutMarkup = '제목 항목 항목 code'
  assert.equal(readingTime(withMarkup), readingTime(withoutMarkup))
})
