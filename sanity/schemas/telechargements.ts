import { defineType } from 'sanity'
import { DownloadIcon } from '@sanity/icons/Download'
import { documentPdf, objets, texte } from './champs'

export const telechargements = defineType({
  name: 'telechargements',
  title: 'Téléchargements',
  type: 'document',
  icon: DownloadIcon,
  fields: [
    objets('groupes', 'Groupes de documents', 'Dans l’ordre de la page.', [
      texte('titre', 'Titre du groupe', 'Exemple : « Inscription »', true),
      texte('titreEn', 'Titre du groupe (anglais)'),
      documentPdf('docs', 'Documents'),
    ], { title: 'titre' }),
  ],
  preview: { prepare: () => ({ title: 'Téléchargements' }) },
})
