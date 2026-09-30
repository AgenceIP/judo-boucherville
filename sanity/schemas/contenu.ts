// The text editor of news and results: paragraphs, subheadings, bold, links, photos, medals.
import { defineArrayMember, defineField } from 'sanity'
import { nombre } from './champs'
import { lienError } from '../validation'

const MEDAILLES = [
  { title: '🥇 Or', value: 'or' },
  { title: '🥈 Argent', value: 'argent' },
  { title: '🥉 Bronze', value: 'bronze' },
]

export const contenu = defineField({
  name: 'contenu',
  title: 'Texte',
  description: 'Écrivez comme dans un courriel. Le bouton « Médaille » ajoute une pastille or, argent ou bronze dans la ligne.',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Paragraphe', value: 'normal' }, { title: 'Intertitre', value: 'h4' }],
      lists: [],
      marks: {
        decorators: [{ title: 'Gras', value: 'strong' }],
        annotations: [{
          name: 'link', type: 'object', title: 'Lien',
          fields: [defineField({
            name: 'href', title: 'Adresse', type: 'string',
            description: 'Une page de ce site (« /inscription ») ou d’un autre (https://…)',
            validation: r => r.required().error('Ajoutez l’adresse du lien.').custom((v?: string) => lienError(v) ?? true),
          })],
        }],
      },
      of: [defineArrayMember({
        name: 'medaille', title: 'Médaille', type: 'object',
        fields: [defineField({ name: 'kind', title: 'Médaille', type: 'string', options: { list: MEDAILLES, layout: 'radio' }, validation: r => r.required() })],
        preview: { select: { kind: 'kind' }, prepare: ({ kind }) => ({ title: MEDAILLES.find(m => m.value === kind)?.title ?? 'Médaille' }) },
      })],
    }),
    defineArrayMember({
      type: 'image', title: 'Photo', options: { hotspot: true },
      fields: [defineField({ name: 'petit', title: 'C’est un logo (affiché en petit)', type: 'boolean', initialValue: false })],
    }),
    defineArrayMember({
      name: 'bilanMedailles', title: 'Bilan de médailles', type: 'object',
      fields: [nombre('or', '🥇 Or'), nombre('argent', '🥈 Argent'), nombre('bronze', '🥉 Bronze')],
      preview: { select: { or: 'or', argent: 'argent', bronze: 'bronze' }, prepare: ({ or, argent, bronze }) => ({ title: `Bilan : ${or ?? 0} or, ${argent ?? 0} argent, ${bronze ?? 0} bronze` }) },
    }),
  ],
})
