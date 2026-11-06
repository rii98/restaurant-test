// @ts-check
import {defineConfig} from 'astro/config'
import {loadEnv} from 'vite'
import sitemap from '@astrojs/sitemap'

const {SITE_URL} = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')

export default defineConfig({
  // Your real domain. Used for canonical URLs, Open Graph and the sitemap.
  site: SITE_URL || 'https://example.com',
  output: 'static', // every page is pre-rendered to HTML at build time
  integrations: [sitemap()],
})
