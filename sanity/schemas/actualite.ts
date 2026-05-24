import { defineField, defineType } from 'sanity'

export const actualite = defineType({
  name: 'actualite',
  title: 'Actualité',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre (FR)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titreEn', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titre' }, validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'image', title: 'Image principale', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'extrait', title: 'Extrait (FR)', type: 'text', rows: 3 }),
    defineField({ name: 'extraitEn', title: 'Excerpt (EN)', type: 'text', rows: 3 }),
    defineField({ name: 'contenu', title: 'Contenu (FR)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'contenuEn', title: 'Content (EN)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
  ],
  orderings: [{ title: 'Date récente', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'titre', subtitle: 'date', media: 'image' },
  },
})
