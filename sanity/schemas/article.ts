import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { BarChartIcon } from '@sanity/icons/BarChart'
import { texte } from './champs'
import { contenu } from './contenu'
import { saisonCourante, saisonValide } from '../../lib/saison'

const article = (name: 'actualite' | 'resultat', title: string, icon: typeof DocumentTextIcon) => defineType({
  name, title, type: 'document', icon,
  fields: [
    defineField({
      name: 'saison', title: 'Saison', type: 'string', initialValue: () => saisonCourante(),
      description: 'Exemple : « 2026-2027 ». Déjà remplie avec la saison en cours.',
      validation: r => r.required().error('« Saison » est obligatoire.')
        .custom((s?: string) => !s || saisonValide(s) || 'Écrivez la saison comme « 2026-2027 ».'),
    }),
    // newest on top of its season: new documents get a bigger number than every migrated one
    defineField({ name: 'tri', type: 'number', hidden: true, initialValue: () => Date.now() }),
    texte('date', 'Date affichée', 'Exemple : « 14 mars 2026 » ou « 14-15 mars 2026 »'),
    texte('lieu', 'Lieu', 'Exemple : « Laval »'),
    texte('titre', 'Titre', 'Exemple : « Championnat provincial U14-U16 »'),
    contenu,
  ],
  validation: r => r.custom(d =>
    d?.titre || d?.lieu || d?.date ? true : 'Écrivez au moins un titre, un lieu ou une date.'),
  orderings: [{ title: 'Plus récentes', name: 'recent', by: [{ field: 'saison', direction: 'desc' }, { field: 'tri', direction: 'desc' }] }],
  preview: {
    select: { titre: 'titre', lieu: 'lieu', date: 'date', saison: 'saison' },
    prepare: ({ titre, lieu, date, saison }) => ({ title: titre ?? lieu ?? date, subtitle: [date, titre && lieu, saison].filter(Boolean).join(' · ') }),
  },
})

export const actualite = article('actualite', 'Nouvelle', DocumentTextIcon)
export const resultat = article('resultat', 'Résultat', BarChartIcon)
