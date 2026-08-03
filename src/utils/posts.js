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
