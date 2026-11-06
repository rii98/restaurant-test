import {defineField, defineType} from 'sanity'

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'category',
      type: 'reference', // a link to another document
      to: [{type: 'menuCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({
      name: 'price',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({name: 'image', type: 'imageWithAlt'}),
    defineField({
      name: 'dietary',
      title: 'Dietary tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Vegetarian', value: 'vegetarian'},
          {title: 'Vegan', value: 'vegan'},
          {title: 'Gluten free', value: 'gluten-free'},
          {title: 'Spicy', value: 'spicy'},
          {title: 'Contains nuts', value: 'nuts'},
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Show on homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'available',
      title: 'Currently available',
      type: 'boolean',
      description: 'Turn off to hide the item without deleting it (e.g. seasonal dishes).',
      initialValue: true,
    }),
    defineField({name: 'order', title: 'Sort order', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', price: 'price', category: 'category.title', media: 'image', available: 'available'},
    prepare: ({title, price, category, media, available}) => ({
      title: available === false ? `${title} (hidden)` : title,
      subtitle: `${category ?? 'No category'} · ${price ?? '-'}`,
      media,
    }),
  },
})
