import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Used by `npm run deploy` → https://<studioHost>.sanity.studio
  // studioHost: 'my-restaurant',
})
