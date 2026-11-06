import {defineField, defineType} from 'sanity'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Used for #anchor links on the menu page. Click "Generate".',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 2}),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers show first.',
      initialValue: 10,
    }),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', order: 'order'},
    prepare: ({title, order}) => ({title, subtitle: `Order: ${order ?? '-'}`}),
  },
})
