import { defineType } from 'sanity'
import { BookIcon } from '@sanity/icons/Book'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { image, objets, pdf, texte } from './champs'

// « 1970 et avant » comes last: the order is set by hand in the Studio, not sorted on the period
export const journaux = defineType({
  name: 'journaux',
  title: 'Journaux',
  type: 'document',
  icon: BookIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'journaux' }),
    texte('periode', 'Période', 'Exemple : « 2008-2009 »', true),
    objets('numeros', 'Numéros', undefined, [
      texte('titre', 'Titre', 'Exemple : « Journal de décembre »', true),
      image('vignette', 'Vignette (image de la couverture)'),
      pdf('pdf', 'Journal (PDF)', undefined, true),
    ], { title: 'titre', media: 'vignette' }),
  ],
  preview: { select: { title: 'periode' } },
})
