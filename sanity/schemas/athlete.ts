import { defineArrayMember, defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { groupe, liste, nombre, objets, slugField, texte } from './champs'
import { EQUIPES } from '../equipes'

export const athlete = defineType({
  name: 'athlete',
  title: 'Athlète',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'equipes', title: 'Équipes et photos', default: true },
    { name: 'profil', title: 'Profil' },
  ],
  fields: [
    slugField('nom'),
    ...groupe('equipes', [
      texte('nom', 'Nom', 'Exemple : « Émile Nadeau-Denis ». Pour un duo de kata : « Jérome Lajoie et Jacob St-Jean ».', true),
      defineField({
        name: 'equipes', title: 'Équipes', type: 'array', of: [defineArrayMember({ type: 'string' })],
        description: 'Cochez toutes ses équipes. Décochez tout pour le retirer de la page Athlètes (sa page de profil reste en ligne).',
        options: { layout: 'grid', list: EQUIPES.map(([value, title]) => ({ value, title })) },
      }),
      defineField({
        name: 'photos', title: 'Photos', type: 'array', of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
        options: { layout: 'grid' },
        description: 'Glissez-déposez les photos ici. Avec des photos ou un profil, l’athlète a sa propre page.',
      }),
    ]),
    { ...objets('personnes', 'Profil', 'Une personne (deux pour un duo de kata).', [
      texte('nom', 'Nom', undefined, true),
      texte('naissance', 'Naissance', 'Exemple : « 2008 »'),
      texte('debut', 'Début du judo', 'Exemple : « 2014 »'),
      texte('grade', 'Grade', 'Exemple : « 1er dan »'),
      texte('etudes', 'Études', 'Exemple : « Sport-études, École secondaire De Mortagne »'),
      texte('judoinside', 'Fiche JudoInside (lien)'),
      liste('faits', 'Faits saillants'),
      liste('objCourt', 'Objectifs à court terme'),
      liste('objLong', 'Objectifs à long terme'),
      objets('saisons', 'Résultats par saison', undefined, [
        texte('saison', 'Saison', 'Exemple : « 2025-2026 »', true),
        nombre('victoires', 'Victoires'),
        nombre('defaites', 'Défaites'),
        liste('resultats', 'Résultats', 'Une compétition par ligne. Exemple : « Championnat canadien U18 : 🥈 »'),
      ], { title: 'saison' }),
    ], { title: 'nom' }), group: 'profil' },
  ],
  preview: {
    select: { title: 'nom', equipes: 'equipes', media: 'photos.0' },
    prepare: ({ title, equipes, media }) => ({
      title, media,
      subtitle: (equipes ?? []).map((e: string) => EQUIPES.find(([k]) => k === e)?.[1] ?? e).join(', ') || 'Aucune équipe',
    }),
  },
})
