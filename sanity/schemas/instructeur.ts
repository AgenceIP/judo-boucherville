import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { image, liste, paragraphe, slugField, texte } from './champs'

export const instructeur = defineType({
  name: 'instructeur',
  title: 'Instructeur',
  type: 'document',
  icon: UserIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'instructeur' }),
    slugField('nom'),
    texte('nom', 'Nom', 'Exemple : « Fayçal Bousbiat »', true),
    image('photo', 'Photo', 'Un portrait. Déplacez le point bleu sur le visage pour qu’il reste visible quand la photo est recadrée.'),
    texte('grade', 'Grade', 'Exemple : « 7e dan »', true),
    texte('pnce', 'Certification PNCE', 'Exemple : « PNCE niveau 3 »'),
    defineField({
      name: 'disciplines', title: 'Disciplines', type: 'array', of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'grid', list: [
        { title: 'Judo', value: 'judo' },
        { title: 'Kata', value: 'kata' },
        { title: 'Jiu-jitsu brésilien', value: 'jiu-jitsu-bresilien' },
        { title: 'Aiki ju-jitsu', value: 'aiki-jujitsu' },
      ] },
    }),
    texte('role', 'Rôle', 'Exemple : « Entraîneur chef et directeur technique »', true),
    paragraphe('bio', 'Biographie', 'Laissez une ligne vide entre deux paragraphes.'),
    paragraphe('bioEn', 'Biographie (anglais)'),
    liste('competitions', 'Compétitions et expérience', 'Une ligne par élément. Exemple : « Entraîneur Sport-Études, École secondaire De Mortagne »'),
  ],
  preview: { select: { title: 'nom', subtitle: 'role', media: 'photo' } },
})
