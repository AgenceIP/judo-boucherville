import { defineType } from 'sanity'
import { CaseIcon } from '@sanity/icons'
import { objets, texte } from './champs'

export const conseil = defineType({
  name: 'conseil',
  title: 'Conseil d’administration',
  type: 'document',
  icon: CaseIcon,
  fields: [
    objets('membres', 'Membres', 'Dans l’ordre de la page.', [
      texte('role', 'Rôle', 'Exemple : « Président »', true),
      texte('roleEn', 'Rôle (anglais)'),
      texte('nom', 'Nom', 'Exemple : « Frédéric Bourque »', true),
      texte('courriel', 'Courriel'),
    ], { title: 'nom', subtitle: 'role' }),
    objets('presidents', 'Anciens présidents', 'Le plus récent en haut.', [
      texte('mandat', 'Mandat', 'Exemple : « 2018-2022 »', true),
      texte('nom', 'Nom', undefined, true),
    ], { title: 'nom', subtitle: 'mandat' }),
  ],
  preview: { prepare: () => ({ title: 'Conseil d’administration' }) },
})
