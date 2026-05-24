import { defineField, defineType } from 'sanity'

export const instructeur = defineType({
  name: 'instructeur',
  title: 'Instructeur',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom complet', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug URL', type: 'slug', options: { source: 'nom' }, validation: r => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'grade', title: 'Grade (ex: 7e dan)', type: 'string' }),
    defineField({
      name: 'disciplines', title: 'Disciplines', type: 'array',
      of: [{ type: 'string', options: { list: ['judo', 'aiki-jujitsu', 'jiu-jitsu-bresilien', 'kata'] } }]
    }),
    defineField({ name: 'role', title: 'Rôle (ex: Directeur technique)', type: 'string' }),
    defineField({ name: 'bio', title: 'Biographie (FR)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'bioEn', title: 'Biography (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'competitions', title: 'Compétitions notables', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'ordre', title: "Ordre d'affichage", type: 'number' }),
  ],
  preview: {
    select: { title: 'nom', subtitle: 'grade', media: 'photo' },
  },
})
