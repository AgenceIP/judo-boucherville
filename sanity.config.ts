import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { projectId, dataset, apiVersion } from './sanity/env'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  title: 'Club Judo Boucherville — CMS',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
