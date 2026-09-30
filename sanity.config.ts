'use client'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { frFRLocale } from '@sanity/locale-fr-fr'
import { dataset, projectId } from './sanity/env'
import { structure } from './sanity/structure'
import { SLUG_TYPES, withSlug } from './sanity/actions'
import { schemaTypes, SINGLETONS } from './sanity/schemas'
import { resolve } from './sanity/presentation'

export default defineConfig({
  name: 'default',
  title: 'Club de Judo Boucherville',
  basePath: '/studio',
  projectId,
  dataset,
  // the Vercel button goes through Vercel's Marketplace SSO, which lands on sanity.io and never back in the Studio
  auth: { providers: prev => prev.filter(p => p.name !== 'vercel') },
  plugins: [
    structureTool({ structure, title: 'Contenu' }),
    presentationTool({ title: 'Présentation', resolve, previewUrl: { initial: '/fr', previewMode: { enable: '/api/draft-mode/enable' } } }),
    frFRLocale(),
  ],
  schema: {
    types: schemaTypes,
    templates: prev => [
      ...prev.filter(t => !SINGLETONS.includes(t.schemaType)),
      {
        id: 'athlete-equipe', title: 'Athlète dans une équipe', schemaType: 'athlete',
        parameters: [{ name: 'equipe', type: 'string' }],
        value: ({ equipe }: { equipe: string }) => ({ equipes: [equipe] }),
      },
    ],
  },
  document: {
    // the global « + » only offers real content types, never a second Club or the team template
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter(t => t.templateId !== 'athlete-equipe') : prev,
    // singletons: publish, discard, restore only (no delete, no duplicate)
    actions: (prev, context) =>
      SINGLETONS.includes(context.schemaType)
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : context.schemaType in SLUG_TYPES
          ? prev.map(a => (a.action === 'publish' ? withSlug(a, context) : a))
          : prev,
  },
})
