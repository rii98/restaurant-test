import {defineField, defineType} from 'sanity'

// Daily specials are shown on a LIVE page (/specials/) that reads Sanity on every visit,
// so changes appear instantly — no rebuild needed. Compare with menu items (rebuild via webhook).
export const special = defineType({
  name: 'special',
  title: 'Daily Special',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'price', type: 'number', validation: (r) => r.required().min(0)}),
    defineField({
      name: 'date',
      type: 'date',
      description: 'The day this special is served.',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'soldOut',
      title: 'Sold out',
      type: 'boolean',
      description: 'Flip this during service — the website updates within seconds.',
      initialValue: false,
    }),
    defineField({name: 'image', type: 'imageWithAlt'}),
  ],
  orderings: [{title: 'Date, newest', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', date: 'date', soldOut: 'soldOut', media: 'image'},
    prepare: ({title, date, soldOut, media}) => ({title: soldOut ? `${title} (SOLD OUT)` : title, subtitle: date, media}),
  },
})
