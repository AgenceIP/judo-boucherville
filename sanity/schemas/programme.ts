import { defineField, defineType } from 'sanity'

export const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre (FR)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titreEn', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug URL', type: 'slug', options: { source: 'titre' }, validation: r => r.required() }),
    defineField({
      name: 'categorie', title: 'Catégorie', type: 'string',
      options: { list: ['enfants', 'adultes', 'arts-martiaux'] },
      validation: r => r.required()
    }),
    defineField({ name: 'description', title: 'Description (FR)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'descriptionEn', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'horaires', title: 'Horaires', type: 'array',
      of: [{
        type: 'object', fields: [
          { name: 'jours', title: 'Jours', type: 'string' },
          { name: 'heures', title: 'Heures', type: 'string' },
          { name: 'lieu', title: 'Lieu', type: 'string' },
        ]
      }]
    }),
    defineField({ name: 'tarif', title: 'Tarif (ex: 350$/session)', type: 'string' }),
    defineField({
      name: 'instructeurs', title: 'Instructeurs', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'instructeur' }] }]
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'ordre', title: "Ordre d'affichage", type: 'number' }),
  ],
  preview: {
    select: { title: 'titre', subtitle: 'categorie' },
  },
})
