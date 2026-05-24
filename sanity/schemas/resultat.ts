import { defineField, defineType } from 'sanity'

export const resultat = defineType({
  name: 'resultat',
  title: 'Résultat',
  type: 'document',
  fields: [
    defineField({ name: 'saison', title: 'Saison (ex: 2024-2025)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'competition', title: 'Compétition', type: 'string', validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'athlete', title: 'Athlète', type: 'string' }),
    defineField({ name: 'categorie', title: 'Catégorie (ex: -57kg U18)', type: 'string' }),
    defineField({
      name: 'medaille', title: 'Médaille', type: 'string',
      options: { list: ['or', 'argent', 'bronze'] },
      validation: r => r.required()
    }),
  ],
  preview: {
    select: { title: 'athlete', subtitle: 'competition' },
  },
})
