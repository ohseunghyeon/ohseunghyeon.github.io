import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import remarkSmartypants from 'remark-smartypants'

// gatsby-remark-autolink-headers가 넣던 GitHub 옥티콘 링크 아이콘.
const linkIcon = {
  type: 'element',
  tagName: 'svg',
  properties: {
    ariaHidden: 'true',
    focusable: 'false',
    height: 16,
    width: 16,
    version: '1.1',
    viewBox: '0 0 16 16',
  },
  children: [
    {
      type: 'element',
      tagName: 'path',
      properties: {
        fillRule: 'evenodd',
        d: 'M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z',
      },
      children: [],
    },
  ],
}

export default defineConfig({
  site: 'https://ohseunghyeon.github.io',
  // 글 URL이 /카테고리/슬러그/ 형태였다. 기존 URL을 그대로 유지한다.
  trailingSlash: 'always',
  build: { format: 'directory' },

  // 반응형 이미지. 이걸 켜지 않으면 마크다운 이미지가 srcset 없이
  // 원본 해상도 그대로 나간다 (3088px, 545KB). 구 사이트는
  // gatsby-remark-images가 163~3088w의 srcset을 만들어 브라우저가
  // 화면에 맞는 것을 골랐다.
  image: { layout: 'constrained' },
  // sitemap은 src/pages/sitemap.xml.ts에서 직접 만든다 (경로 보존 이유는 그 파일 참조)
  integrations: [react()],
  markdown: {
    // gatsby-remark-prismjs 대체. prism-okaidia는 monokai 계열이다.
    shikiConfig: {
      theme: 'monokai',
      wrap: false,
    },
    remarkPlugins: [remarkSmartypants],
    rehypePlugins: [
      // Astro는 기본적으로 헤딩 id를 사용자 플러그인 '이후'에 붙인다.
      // autolink는 id가 있는 헤딩만 링크하므로 여기서 명시적으로 먼저 실행해야 한다.
      // rehype-slug 대신 이것을 쓰는 이유: Astro가 목차(headings)에 쓰는 슬러그와
      // 헤딩 id가 같은 출처에서 나와야 목차 링크가 어긋나지 않는다.
      rehypeHeadingIds,
      // gatsby-remark-autolink-headers 대체
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: { className: ['anchor', 'before'] },
          content: linkIcon,
        },
      ],
      // gatsby-remark-external-links 대체
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
})
