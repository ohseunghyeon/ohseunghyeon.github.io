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
