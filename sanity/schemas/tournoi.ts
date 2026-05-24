import { defineField, defineType } from 'sanity'

export const tournoi = defineType({
  name: 'tournoi',
  title: 'Tournoi Challenge',
  type: 'document',
  fields: [
    defineField({ name: 'edition', title: 'Édition (ex: 27e)', type: 'string' }),
    defineField({ name: 'date', title: 'Date du tournoi', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'lieu', title: 'Lieu', type: 'string' }),
    defineField({
      name: 'categories', title: "Catégories d'âge", type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'prix', title: 'Prix', type: 'array',
      of: [{
        type: 'object', fields: [
          { name: 'categorie', title: 'Catégorie', type: 'string' },
          { name: 'montant', title: 'Montant (ex: 1 000 $)', type: 'string' },
        ]
      }]
    }),
    defineField({ name: 'description', title: 'Description (FR)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'descriptionEn', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'inscriptionUrl', title: "Lien d'inscription", type: 'url' }),
  ],
  preview: {
    select: { title: 'edition', subtitle: 'date' },
  },
})
