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
  let url
  try {
    url = new URL(withProtocol)
  } catch {
    url = undefined
  }
  // A real domain has a dot (myrestaurant.com, my-site.pages.dev); "riyaj2" alone is just a name.
  if (!url || (!url.hostname.includes('.') && url.hostname !== 'localhost')) {
    throw new Error(
      `SITE_URL must be the full site address, got "${raw}". ` +
        'Use e.g. https://my-project.pages.dev or https://myrestaurant.com',
    )
  }
  return url.origin
}

export default defineConfig({
  site: resolveSite(),
  output: 'static', // every page is pre-rendered to HTML at build time
  integrations: [sitemap()],
})
