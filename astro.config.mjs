import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://ohseunghyeon.github.io',
  // 글 URL이 /카테고리/슬러그/ 형태였다. 기존 URL을 그대로 유지한다.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
})
