import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { texte } from './champs'

// [key, label, where it shows]
const PHOTOS: [string, string, string][] = [
  ['murCjb', 'Mur du club', 'En-tête de la page Inscription, et la fin de la visite sur téléphone.'],
  ['murCjbLoin', 'Mur du club, vu de loin', 'En-tête des pages Résultats, Athlètes et Challenge.'],
  ['tatamiLong', 'Tatami', 'Accueil (section « Le dojo ») et en-tête des pages Programmes.'],
  ['valeursRespect', 'Mur des valeurs', 'Accueil (section « Le dojo ») et en-tête des autres pages.'],
  ['kano', 'Portrait de Jigoro Kano', 'Accueil (section « Le dojo ») et en-tête de la page Équipe.'],
  ['ceinturesNoires', 'Tableau des ceintures noires', 'Accueil (section « Le dojo ») et en-tête de la page Ceintures noires.'],
  ['hautsGrades', 'Tableau des hauts gradés', 'En-tête des pages Historique et Conseil.'],
  ['entree', 'Entrée du dojo', 'Accueil (section « Nous trouver ») et en-tête de la page Contact.'],
]

export const photosSite = defineType({
  name: 'photosSite',
  title: 'Photos du site',
  type: 'document',
  icon: ImagesIcon,
  fields: PHOTOS.map(([name, title, description]) => defineField({
    name, title, description, type: 'image', options: { hotspot: true },
    fields: [
      texte('alt', 'Description', 'Ce que montre la photo, pour les personnes aveugles et Google. Exemple : « Le tableau des ceintures noires du club »', true),
      texte('altEn', 'Description (anglais)', 'Exemple : « The club’s black belt board »', true),
    ],
    validation: r => r.required().error('Cette photo est obligatoire : elle est affichée sur le site.'),
  })),
  preview: { prepare: () => ({ title: 'Photos du site' }) },
})
