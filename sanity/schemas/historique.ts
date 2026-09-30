import { defineArrayMember, defineField, defineType } from 'sanity'
import { ClockIcon } from '@sanity/icons/Clock'
import { nombre, objets, paragraphe, texte } from './champs'

const photos = (name: string, title: string) =>
  defineField({ name, title, type: 'array', options: { layout: 'grid' }, of: [defineArrayMember({ type: 'image', options: { hotspot: true } })] })

export const historique = defineType({
  name: 'historique',
  title: 'Historique',
  type: 'document',
  icon: ClockIcon,
  fields: [
    objets('timeline', 'Ligne du temps', undefined, [
      texte('date', 'Date', 'Exemple : « Mars 1970 »', true),
      texte('dateEn', 'Date (anglais)'),
      paragraphe('texte', 'Texte', undefined, true),
      paragraphe('texteEn', 'Texte (anglais)'),
    ], { title: 'date', subtitle: 'texte' }),
    objets('international', 'Participations internationales', undefined, [
      texte('titre', 'Compétition', 'Exemple : « Jeux olympiques »', true),
      texte('titreEn', 'Compétition (anglais)'),
      objets('participations', 'Participations', undefined, [
        nombre('annee', 'Année', undefined, true),
        texte('athletes', 'Athlète(s)', undefined, true),
        texte('lieu', 'Lieu', undefined, true),
        texte('resultat', 'Résultat'),
      ], { title: 'athletes', subtitle: 'lieu' }),
    ], { title: 'titre' }),
    photos('ancienDojo', 'Photos de l’ancien dojo'),
    photos('inauguration', 'Photos de l’inauguration'),
  ],
  preview: { prepare: () => ({ title: 'Historique' }) },
})
