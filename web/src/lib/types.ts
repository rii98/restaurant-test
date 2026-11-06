// Shapes of the data returned by our GROQ queries (see queries.ts)

export interface SanityImage {
  _type?: string
  asset?: {_ref: string; _type?: string}
  alt?: string
  hotspot?: unknown
  crop?: unknown
}

export interface OpeningHours {
  _key: string
  _type?: string
  day: string
  closed?: boolean
  opens?: string
  closes?: string
}

export interface SiteSettings {
  name: string
  tagline?: string
  announcement?: string
  about?: string
  cuisine?: string
  currency: string
  reservationUrl?: string
  orderUrl?: string
  phone?: string
  email?: string
  address?: {street?: string; city?: string; region?: string; postalCode?: string; country?: string}
  mapEmbedUrl?: string
  timezone?: string
  hours?: OpeningHours[]
  social?: {instagram?: string; facebook?: string; tiktok?: string}
  heroImage?: SanityImage
  gallery?: (SanityImage & {_key: string})[]
  seoTitle?: string
  seoDescription?: string
  priceRange?: string
}

export interface MenuItem {
  _id: string
  name: string
  description?: string
  price: number
  dietary?: string[]
  image?: SanityImage
  category?: string
}

export interface MenuCategory {
  _id: string
  title: string
  slug: string
  description?: string
  items: MenuItem[]
}

export interface Special {
  _id: string
  title: string
  description?: string
  price: number
  date: string
  soldOut?: boolean
  image?: SanityImage
}
