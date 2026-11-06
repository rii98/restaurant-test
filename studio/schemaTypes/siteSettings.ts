import {defineField, defineType} from 'sanity'

// A "singleton": only one of these exists (see structure.ts)
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Restaurant Settings',
  type: 'document',
  // Groups = tabs at the top of the editor form
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'contact', title: 'Contact & Hours'},
    {name: 'media', title: 'Images'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---- General ----
    defineField({name: 'name', title: 'Restaurant name', type: 'string', group: 'general', validation: (r) => r.required()}),
    defineField({name: 'tagline', type: 'string', group: 'general'}),
    defineField({
      name: 'announcement',
      title: 'Announcement banner',
      type: 'string',
      group: 'general',
      description: 'Optional bar at the top of every page, e.g. "Closed Dec 25". Leave empty to hide.',
    }),
    defineField({name: 'about', title: 'About text', type: 'text', rows: 5, group: 'general'}),
    defineField({name: 'cuisine', type: 'string', group: 'general', description: 'e.g. Nepali, Indian'}),
    defineField({
      name: 'currency',
      type: 'string',
      group: 'general',
      description: 'ISO code used to format prices, e.g. USD, NPR, EUR',
      initialValue: 'USD',
      validation: (r) => r.required().length(3).uppercase(),
    }),
    defineField({name: 'reservationUrl', title: 'Reservation link', type: 'url', group: 'general'}),
    defineField({name: 'orderUrl', title: 'Online ordering link', type: 'url', group: 'general'}),

    // ---- Contact ----
    defineField({name: 'phone', type: 'string', group: 'contact'}),
    defineField({name: 'email', type: 'string', group: 'contact', validation: (r) => r.email()}),
    defineField({
      name: 'address',
      type: 'object',
      group: 'contact',
      fields: [
        {name: 'street', type: 'string'},
        {name: 'city', type: 'string'},
        {name: 'region', title: 'State / Region', type: 'string'},
        {name: 'postalCode', type: 'string'},
        {name: 'country', type: 'string', description: '2-letter code, e.g. US, NP'},
      ],
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps embed URL',
      type: 'url',
      group: 'contact',
      description: 'Google Maps → Share → Embed a map → copy only the src="..." URL',
    }),
    defineField({
      name: 'timezone',
      type: 'string',
      group: 'contact',
      description: 'IANA timezone, used for the "Open now" badge, e.g. America/Chicago, Asia/Kathmandu',
      initialValue: 'America/Chicago',
    }),
    defineField({name: 'hours', type: 'array', of: [{type: 'openingHours'}], group: 'contact'}),
    defineField({
      name: 'social',
      type: 'object',
      group: 'contact',
      fields: [
        {name: 'instagram', type: 'url'},
        {name: 'facebook', type: 'url'},
        {name: 'tiktok', type: 'url'},
      ],
    }),

    // ---- Media ----
    defineField({name: 'heroImage', type: 'imageWithAlt', group: 'media'}),
    defineField({name: 'gallery', type: 'array', of: [{type: 'imageWithAlt'}], group: 'media', options: {layout: 'grid'}}),

    // ---- SEO ----
    defineField({
      name: 'seoTitle',
      type: 'string',
      group: 'seo',
      validation: (r) => r.max(60).warning('Google cuts titles over ~60 characters'),
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (r) => r.max(160).warning('Google cuts descriptions over ~160 characters'),
    }),
    defineField({name: 'priceRange', type: 'string', group: 'seo', description: 'For Google, e.g. $$', initialValue: '$$'}),
  ],
  preview: {prepare: () => ({title: 'Restaurant Settings'})},
})
