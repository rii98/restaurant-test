import {defineField, defineType} from 'sanity'

// Reusable image type that forces alt text (accessibility + SEO)
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true}, // lets editors choose the focal point for cropping
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers and Google, e.g. "Steamed chicken momo with tomato chutney".',
      validation: (rule) => rule.required().warning('Alt text helps SEO and accessibility'),
    }),
  ],
})
