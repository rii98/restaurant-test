// @ts-check
import {defineConfig} from 'astro/config'
import {loadEnv} from 'vite'
import sitemap from '@astrojs/sitemap'

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')

/**
 * The site's public URL, used for canonical URLs, Open Graph and the sitemap.
 * Priority: SITE_URL (your real domain) → CF_PAGES_URL (set automatically by
 * Cloudflare Pages builds) → placeholder. Tolerates a missing "https://".
 */
function resolveSite() {
  const raw = (env.SITE_URL || process.env.CF_PAGES_URL || '').trim()
  if (!raw) return 'https://example.com'
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(withProtocol).origin
  } catch {
    throw new Error(`SITE_URL is not a valid URL: "${raw}". Use e.g. https://myrestaurant.com`)
  }
}

export default defineConfig({
  site: resolveSite(),
  output: 'static', // every page is pre-rendered to HTML at build time
  integrations: [sitemap()],
})
