import { defineField, defineType } from 'sanity'
import { StarFilledIcon } from '@sanity/icons/StarFilled'
import { groupe, image, lien, liste, nombre, objets, pdf, texte } from './champs'

export const challenge = defineType({
  name: 'challenge',
  title: 'Challenge',
  type: 'document',
  icon: StarFilledIcon,
  groups: [
    { name: 'edition', title: 'Édition', default: true },
    { name: 'divisions', title: 'Divisions et bourses' },
    { name: 'commanditaires', title: 'Commanditaires' },
    { name: 'palmares', title: 'Palmarès' },
  ],
  fields: [
    ...groupe('edition', [
      nombre('edition', 'Numéro de l’édition', 'Exemple : 27', true),
      defineField({ name: 'date', title: 'Date et heure', type: 'datetime', description: 'Le compte à rebours de la page vise cette date.', validation: r => r.required().error('« Date et heure » est obligatoire.') }),
      nombre('depuis', 'Première édition', 'Exemple : 1997', true),
      liste('pays', 'Pays présents', 'Exemple : « France », « Italie »'),
      liste('paysEn', 'Pays présents (anglais)', 'Mêmes pays, dans le même ordre.'),
      lien('formulaire', 'Formulaire d’inscription (lien)'),
      pdf('programme', 'Programme (PDF)'),
      pdf('devis', 'Devis (PDF)'),
      lien('video', 'Vidéo (lien YouTube)'),
      texte('president', 'Président du comité', 'Exemple : « Olivier Bry »', true),
      objets('couts', 'Coûts par équipe', undefined, [
        texte('athletes', 'Nombre d’athlètes', 'Exemple : « 4 »', true),
        texte('prix', 'Coût', 'Exemple : « 200 $ »', true),
      ], { title: 'athletes', subtitle: 'prix' }),
      objets('limites', 'Dates limites', undefined, [
        texte('pour', 'Pour', 'Exemple : « Équipes du Canada et des États-Unis »', true),
        texte('pourEn', 'Pour (anglais)'),
        texte('date', 'Date', 'Exemple : « 4 avril 2026 »', true),
        texte('dateEn', 'Date (anglais)'),
      ], { title: 'pour', subtitle: 'date' }),
    ]),
    ...groupe('divisions', [
      objets('divisions', 'Divisions', undefined, [
        texte('division', 'Division', 'Exemple : « U14 »', true),
        texte('hommes', 'Catégories hommes (kg)'),
        texte('femmes', 'Catégories femmes (kg)'),
        texte('nes', 'Nés en'),
        texte('nesEn', 'Nés en (anglais)'),
        texte('grades', 'Grades'),
        texte('gradesEn', 'Grades (anglais)'),
        texte('pesee', 'Pesée'),
      ], { title: 'division', subtitle: 'nes' }),
      objets('bourses', 'Bourses', undefined, [
        texte('division', 'Division', 'Exemple : « Masters »', true),
        texte('divisionEn', 'Division (anglais)'),
        texte('montant', 'Montant', 'Exemple : « 800 $ »', true),
      ], { title: 'division', subtitle: 'montant' }),
    ]),
    { ...objets('commanditaires', 'Commanditaires', 'Le logo et le nom de chaque commanditaire.', [
      image('logo', 'Logo', undefined, true),
      texte('nom', 'Nom', undefined, true),
    ], { title: 'nom', media: 'logo' }), group: 'commanditaires' },
    { ...objets('palmares', 'Palmarès', 'Une ligne par année, la plus récente en haut.', [
      nombre('annee', 'Année', undefined, true),
      objets('coupe', 'Coupe des clubs', 'Les trois premiers clubs, dans l’ordre.', [
        texte('club', 'Club', undefined, true),
        nombre('points', 'Points'),
      ], { title: 'club', subtitle: 'points' }),
      objets('divisions', 'Podiums par division', undefined, [
        texte('division', 'Division', undefined, true),
        texte('or', 'Or'), texte('argent', 'Argent'), texte('bronze', 'Bronze'),
        texte('meilleur', 'Meilleur athlète'),
      ], { title: 'division', subtitle: 'or' }),
    ], { title: 'annee' }), group: 'palmares' },
  ],
  preview: { prepare: () => ({ title: 'Challenge' }) },
})
