// One place for all page data. Pages call these, not the client directly.
import {sanityFetch} from './sanity'
import {featuredQuery, menuQuery, settingsQuery} from './queries'
import {demoFeatured, demoMenu, demoSettings} from './demo-data'
import type {MenuCategory, MenuItem, SiteSettings} from './types'

let settingsCache: Promise<SiteSettings> | undefined

export function getSettings() {
  // Cached so a build with many pages only asks Sanity once
  settingsCache ??= sanityFetch<SiteSettings | null>(settingsQuery, demoSettings).then((s) => {
    if (!s) throw new Error('No "Restaurant Settings" document found in Sanity. Open the Studio and publish it.')
    return s
  })
  return settingsCache
}

export const getMenu = () => sanityFetch<MenuCategory[]>(menuQuery, demoMenu)
export const getFeatured = () => sanityFetch<MenuItem[]>(featuredQuery, demoFeatured)
