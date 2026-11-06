import {createClient, type FilteredResponseQueryOptions} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'
import type {SanityImage} from './types'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

/** false = no project ID set → site uses demo data from demo-data.ts */
export const isSanityConfigured = Boolean(projectId)

export const client = createClient({
  projectId: projectId || 'demo',
  dataset,
  apiVersion: '2025-01-01', // pin a date so API changes never break the site
  useCdn: false, // build-time fetching: always get the freshest published content
  perspective: 'published', // never leak drafts onto the live site
})

/**
 * Client for LIVE pages (prerender = false). Skips Sanity's API CDN, which can serve answers
 * up to ~60s old. Pair with `{cache: 'no-store'}` on fetch so Cloudflare doesn't cache it either.
 * Trade-off: every visit is one uncached Sanity API request (fine at restaurant traffic).
 */
export const liveClient = client.withConfig({useCdn: false})

/**
 * Fetch option telling Cloudflare not to cache the request to Sanity.
 * @sanity/client forwards `cache` to fetch() at runtime, but only types it for Next.js — hence the cast.
 */
export const NO_STORE = {cache: 'no-store'} as unknown as FilteredResponseQueryOptions

/** Run a GROQ query. In demo mode, returns the fallback instead. */
export async function sanityFetch<T>(query: string, fallback: T, params: Record<string, unknown> = {}): Promise<T> {
  if (!isSanityConfigured) return fallback
  return client.fetch<T>(query, params)
}

const builder = createImageUrlBuilder({projectId: projectId || 'demo', dataset})

/** Build a Sanity CDN image URL (resized, cropped to hotspot, auto WebP/AVIF). */
export function urlFor(source: SanityImage) {
  return builder.image(source).auto('format').fit('crop')
}

export function hasImage(img?: SanityImage): img is SanityImage {
  return Boolean(img?.asset?._ref)
}
