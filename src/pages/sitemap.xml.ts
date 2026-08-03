import { getCollection } from 'astro:content'
import { slugFromFilePath, groupByCategory, categoryPaths } from '../utils/posts.js'

/**
 * @astrojs/sitemap 대신 직접 만드는 이유:
 * 그 통합은 sitemap-index.xml과 sitemap-0.xml을 만들고 /sitemap.xml은
 * 만들지 않는다. 기존 사이트는 /sitemap.xml을 서빙했고 robots.txt도
 * 그 경로를 가리킨다. 검색엔진에 등록된 URL이므로 보존해야 한다.
 *
 * 글이 125개뿐이라 분할이 필요 없다 (sitemap 규격 상한은 50,000개).
 */
export async function GET(context) {
  const posts = await getCollection('blog')
  const grouped = groupByCategory(posts)

  const paths = [
    '/',
    '/about/',
    ...categoryPaths(grouped.keys()).map(c => `/${c}/`),
    ...posts.map(p => `/${slugFromFilePath(p.filePath)}/`),
  ]

  // new URL().href를 쓰면 한글 경로가 퍼센트 인코딩된다. 가리키는 리소스는
  // 같지만 기존 sitemap은 원문 그대로였으므로 표기를 유지한다.
  // XML에서 한글은 그대로 써도 되고, 이스케이프가 필요한 문자는 &만이다.
  const origin = String(context.site).replace(/\/$/, '')
  const urls = paths
    .map(p => `  <url><loc>${(origin + p).replace(/&/g, '&amp;')}</loc></url>`)
    .join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } }
  )
}
