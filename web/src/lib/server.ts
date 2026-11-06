// Server-only helpers for LIVE pages. Never import this from a prerendered (static) page.
import {env} from 'cloudflare:workers'
import type {SiteSettings} from './types'

/** Runtime config from wrangler.jsonc "vars", secrets, and bindings. */
export function runtime(settings?: SiteSettings) {
  return {
    db: env.DB,
    timeZone: settings?.timezone || env.RESTAURANT_TIMEZONE || 'UTC',
    seatsPerSlot: Number(env.SEATS_PER_SLOT) || 20,
    adminPassword: env.ADMIN_PASSWORD as string | undefined,
  }
}

/** Reject form POSTs that come from other websites (basic CSRF protection). */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin
}
