// @ts-check
import {defineConfig} from 'astro/config'
import {loadEnv} from 'vite'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'

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
  // 'static' = every page is pre-rendered to HTML at build time (fast, free, cached on the CDN)…
  output: 'static',
  // …EXCEPT pages that opt out with `export const prerender = false`.
  // Those run as code on Cloudflare Workers on every request (live data, forms, database).
  adapter: cloudflare({
    imageService: 'passthrough', // images come from Sanity's CDN, no Cloudflare Images needed
  }),
  session: false, // we don't use Astro sessions, so don't provision a KV store for them
  integrations: [
    sitemap({
      // keep private/live-only routes out of the sitemap
      filter: (page) => !page.includes('/admin/'),
    }),
  ],
})
