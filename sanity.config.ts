'use client'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { frFRLocale } from '@sanity/locale-fr-fr'
import { dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Club de Judo Boucherville',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), frFRLocale()],
  schema: { types: schemaTypes },
})
