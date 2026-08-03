import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { slugFromFilePath } from '../utils/posts.js'

// 원본 gatsby-plugin-feed의 필터 regex: "/^(?!algorithm|report)/"
const EXCLUDED_PREFIXES = ['algorithm', 'report']

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter(p => !EXCLUDED_PREFIXES.some(prefix => p.data.category.startsWith(prefix)))
    .sort((a, b) => b.data.date - a.data.date)

  return rss({
    title: 'Lazy Nyaong',
    description: 'Code, Lazy, Cat',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/${slugFromFilePath(post.filePath)}/`,
      // gatsby-plugin-feed는 content:encoded에 본문 HTML 전체를 넣었다.
      // Content Collections가 렌더링된 HTML을 그대로 노출하므로
      // render()를 호출하지 않고도 같은 결과를 낼 수 있다.
      content: post.rendered?.html ?? '',
    })),
  })
}
