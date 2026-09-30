import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons/Home'
import { groupe, image, lien, liste, nombre, objets, paragraphe, texte } from './champs'
import { saisonValide } from '../../lib/saison'

export const club = defineType({
  name: 'club',
  title: 'Club et inscription',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'inscription', title: 'Inscription', default: true },
    { name: 'club', title: 'Coordonnées' },
    { name: 'palmares', title: 'Palmarès' },
  ],
  fields: [
    defineField({
      name: 'inscription', title: 'Inscription', type: 'object', group: 'inscription',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'saison', title: 'Saison', type: 'string',
          description: 'Exemple : « 2026-2027 ». Change le chercheur de cours, l’horaire de la semaine et les titres d’inscription.',
          validation: r => r.required().error('« Saison » est obligatoire.')
            .custom((s?: string) => !s || saisonValide(s) || 'Écrivez la saison comme « 2026-2027 » : deux années qui se suivent, avec un trait d’union.'),
        }),
        lien('formulaire', 'Formulaire d’inscription (lien)', 'Exemple : https://forms.gle/7rzQi6hEVvBZ8VhY8', true),
        image('qr', 'Code QR du formulaire', 'L’image du code QR qui mène au formulaire. Sans image, la page Inscription n’affiche pas de code QR.'),
        objets('debutCours', 'Début des cours', 'Une ligne par groupe de cours, dans l’ordre des dates.', [
          texte('programme', 'Cours', 'Exemple : « Cours du samedi »', true),
          texte('programmeEn', 'Cours (anglais)', 'Exemple : « Saturday classes »'),
          texte('date', 'Date', 'Exemple : « 5 septembre 2026 »', true),
          texte('dateEn', 'Date (anglais)', 'Exemple : « September 5, 2026 »'),
        ], { title: 'programme', subtitle: 'date' }),
        paragraphe('enLigne', 'Inscription en ligne', 'Exemple : « En ligne avant le 19 août 2026 pour bénéficier du tarif préférentiel, ou jusqu’au 31 août 2026 (tarif régulier). »', true),
        paragraphe('enLigneEn', 'Inscription en ligne (anglais)'),
        paragraphe('surPlace', 'Inscription sur place', 'Exemple : « Nous serons présents les 17 et 18 août 2026 de 18h00 à 21h00… »', true),
        paragraphe('surPlaceEn', 'Inscription sur place (anglais)'),
        paragraphe('paiement', 'Paiement', 'Exemple : « Chèque libellé à l’ordre du Club de judo Boucherville, ou virement Interac… »', true),
        paragraphe('paiementEn', 'Paiement (anglais)'),
        liste('notes', 'Notes', 'Une phrase par ligne. Exemple : « Les horaires sont sujets à changement selon le nombre d’inscriptions. »'),
        liste('notesEn', 'Notes (anglais)', 'Mêmes phrases, dans le même ordre.'),
        { ...liste('colonnesTarif', 'Colonnes des tarifs', 'Les titres des colonnes de prix, dans l’ordre. Exemple : « Avant le 19 août », « Après le 19 août ». Un programme peut avoir les siennes.'),
          validation: r => r.min(1).error('Ajoutez au moins une colonne de prix.') },
        liste('colonnesTarifEn', 'Colonnes des tarifs (anglais)', 'Exemple : « Before Aug 19 », « After Aug 19 ».'),
      ],
    }),
    ...groupe('club', [
      texte('nom', 'Nom du club', 'Exemple : « Club de Judo Boucherville »', true),
      lien('site', 'Adresse du site', 'Exemple : https://www.judoboucherville.com', true),
      texte('dojo', 'Nom du dojo', 'Exemple : « Dojo Marcel Bourelly »', true),
      texte('lieu', 'Bâtiment', 'Exemple : « Complexe aquatique Laurie-Eve-Cormier »', true),
      texte('adresse', 'Adresse', 'Exemple : « 490, chemin du Lac, Boucherville (Québec) J4B 6X3 »', true),
      texte('tel', 'Téléphone', 'Exemple : « 450 655-1888 »', true),
      texte('courriel', 'Courriel', 'Exemple : « info@judoboucherville.com »', true),
      texte('responsable', 'Entraîneur chef', 'Exemple : « Fayçal Bousbiat »', true),
      texte('president', 'Président', 'Exemple : « Frédéric Bourque »', true),
      lien('instagram', 'Instagram', 'Affiché dans le bas de page.', true),
      lien('facebook', 'Facebook', 'Affiché dans le bas de page.', true),
      lien('twitter', 'X (Twitter)', 'Affiché dans le bas de page.', true),
      lien('tiktok', 'TikTok', 'Affiché dans le bas de page.', true),
      lien('youtube', 'YouTube', 'Affiché dans le bas de page.', true),
      lien('calendrierJudoQuebec', 'Calendrier de Judo Québec (lien)', 'Le PDF des compétitions de la saison, en bas de la page Calendrier.'),
    ]),
    { ...objets('palmares', 'Palmarès du club', 'Médailles aux championnats, sur l’accueil et la page Historique.', [
      texte('championnat', 'Championnat', 'Exemple : « Championnat provincial U15-U16 »', true),
      texte('championnatEn', 'Championnat (anglais)'),
      nombre('or', 'Or', undefined, true),
      nombre('argent', 'Argent', undefined, true),
      nombre('bronze', 'Bronze', undefined, true),
    ], { title: 'championnat' }), group: 'palmares' },
  ],
  preview: { prepare: () => ({ title: 'Club et inscription' }) },
})
