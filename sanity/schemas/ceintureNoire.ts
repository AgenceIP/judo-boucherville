import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons/Star'
import { liste, nombre } from './champs'

export const ceintureNoire = defineType({
  name: 'ceintureNoire',
  title: 'Ceintures noires',
  type: 'document',
  icon: StarIcon,
  fields: [
    nombre('annee', 'Année', 'Exemple : 2026', true),
    defineField({ ...liste('noms', 'Noms', 'Une personne par ligne.'), validation: r => r.min(1).error('Ajoutez au moins un nom.') }),
  ],
  orderings: [{ title: 'Année', name: 'annee', by: [{ field: 'annee', direction: 'desc' }] }],
  preview: { select: { annee: 'annee', noms: 'noms' }, prepare: ({ annee, noms }) => ({ title: String(annee ?? ''), subtitle: (noms ?? []).join(', ') }) },
})
