import { defineField, defineType } from 'sanity'

export const president = defineType({
  name: 'president',
  title: 'Président',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', validation: r => r.required() }),
    defineField({ name: 'periode', title: 'Période (ex: 1979–1985)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Biographie courte', type: 'text', rows: 3 }),
    defineField({ name: 'ordre', title: 'Ordre chronologique', type: 'number' }),
  ],
  preview: {
    select: { title: 'nom', subtitle: 'periode', media: 'photo' },
  },
})
