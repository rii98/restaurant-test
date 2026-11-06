import {defineField, defineType} from 'sanity'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const openingHours = defineType({
  name: 'openingHours',
  title: 'Opening hours',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      type: 'string',
      options: {list: DAYS},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'closed', title: 'Closed this day', type: 'boolean', initialValue: false}),
    defineField({
      name: 'opens',
      type: 'string',
      description: '24h format, e.g. 11:00',
      hidden: ({parent}) => parent?.closed,
      validation: (rule) => rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'HH:MM'}),
    }),
    defineField({
      name: 'closes',
      type: 'string',
      description: '24h format, e.g. 22:00',
      hidden: ({parent}) => parent?.closed,
      validation: (rule) => rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'HH:MM'}),
    }),
  ],
  preview: {
    select: {day: 'day', opens: 'opens', closes: 'closes', closed: 'closed'},
    prepare: ({day, opens, closes, closed}) => ({
      title: day,
      subtitle: closed ? 'Closed' : `${opens ?? '?'} – ${closes ?? '?'}`,
    }),
  },
})
