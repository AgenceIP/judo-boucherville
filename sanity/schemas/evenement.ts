import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { lien, texte } from './champs'

export const evenement = defineType({
  name: 'evenement',
  title: 'Événement',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({ name: 'debut', title: 'Date', type: 'date', options: { dateFormat: 'D MMMM YYYY' }, validation: r => r.required().error('« Date » est obligatoire.') }),
    defineField({
      name: 'fin', title: 'Dernier jour (si plusieurs jours)', type: 'date', options: { dateFormat: 'D MMMM YYYY' },
      validation: r => r.custom((fin: string | undefined, { document }) =>
        !fin || !document?.debut || fin >= (document.debut as string) || 'Le dernier jour doit être après la date de début.'),
    }),
    texte('titre', 'Titre', 'Exemple : « Championnat provincial U14-U16 »', true),
    defineField({ ...texte('lieu', 'Lieu', 'Exemple : « Boucherville », « Laval »'), initialValue: 'Boucherville' }),
    lien('lien', 'Lien', 'Une page de ce site (« /inscription ») ou d’un autre (https://www.judo-quebec.qc.ca/…)'),
  ],
  orderings: [{ title: 'Date', name: 'debut', by: [{ field: 'debut', direction: 'desc' }] }],
  preview: { select: { title: 'titre', debut: 'debut', lieu: 'lieu' }, prepare: ({ title, debut, lieu }) => ({ title, subtitle: [debut, lieu].filter(Boolean).join(' · ') }) },
})
