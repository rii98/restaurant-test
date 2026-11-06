import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, SINGLETONS} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Restaurant CMS',
  projectId,
  dataset,

  plugins: [
    structureTool({structure}),
    // Vision = GROQ query playground. Great for learning; you can remove it for clients.
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Hide singletons from the global "Create new" menu
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    // Singletons: no duplicate / delete actions
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
