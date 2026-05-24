import { defineField, defineType } from 'sanity'

export const pageContent = defineType({
  name: 'pageContent',
  title: 'Contenu de page',
  type: 'document',
  fields: [
    defineField({
      name: 'page', title: 'Page', type: 'string',
      options: { list: ['historique', 'inscription', 'contact'] },
      validation: r => r.required()
    }),
    defineField({ name: 'contenu', title: 'Contenu (FR)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'contenuEn', title: 'Content (EN)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
  ],
  preview: {
    select: { title: 'page' },
  },
})
