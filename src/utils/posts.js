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

const HANGUL = /[가-힯ㄱ-ㆎ]/g
const WORDS_PER_MINUTE = 265
// 한글 한 글자를 0.56단어로 센다. Gatsby가 중국어/일본어에 쓴 상수인데,
// 한글은 cjRanges에서 빠져 있어 적용되지 않았다.
const HANGUL_WORD_RATIO = 0.56

/**
 * "N min read"에 쓰는 읽기 시간(분).
 *
 * Gatsby의 timeToRead를 그대로 재현할 수는 없다. 원본은
 * sanitizeHTML(html, { allowTags: [] })를 쓰는데 sanitize-html의 실제
 * 옵션명이 allowedTags라 이 인자가 무시된다. 결과적으로 태그가 제거되지
 * 않고 태그 이름과 속성까지 단어로 계산됐다. 그 수치는 Gatsby가 만든
 * HTML 마크업에 의존하므로(Prism의 token span 더미 등) 마크다운 파이프라인이
 * 다른 Astro에서는 재현 대상이 아니다.
 *
 * 그래서 Gatsby의 '의도된' 계산을 따르고, 누락된 한글 처리를 추가했다.
 * 라이브 사이트의 실측값 81건과 대조해 65건이 정확히 일치하고
 * 나머지는 최대 2분 차이다(대부분 1분).
 */
export function readingTime(body) {
  const hangulCount = (body.match(HANGUL) || []).length
  const latinWords = (body.replace(HANGUL, ' ').match(/[A-Za-z0-9]+/g) || []).length

  const wordCount = latinWords + hangulCount * HANGUL_WORD_RATIO

  return Math.round(wordCount / WORDS_PER_MINUTE) || 1
}
