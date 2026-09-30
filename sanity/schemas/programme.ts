import { defineArrayMember, defineField, defineType, type ArrayRule } from 'sanity'
import { ClipboardIcon } from '@sanity/icons/Clipboard'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { documentPdf, groupe, image, lien, liste, objets, paragraphe, slugField, texte } from './champs'
import { clienteleWarning, horaireWarning, prixWarning } from '../validation'

export const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  icon: ClipboardIcon,
  groups: [
    { name: 'presentation', title: 'Présentation', default: true },
    { name: 'groupes', title: 'Groupes et horaires' },
    { name: 'tarifs', title: 'Tarifs' },
    { name: 'gens', title: 'Instructeurs et contacts' },
    { name: 'documents', title: 'Documents' },
  ],
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'programme' }),
    slugField('titre'),
    ...groupe('presentation', [
      texte('titre', 'Titre', 'Exemple : « Judo enfants »', true),
      texte('titreEn', 'Titre (anglais)', 'Exemple : « Kids judo »'),
      defineField({
        name: 'categorie', title: 'Catégorie', type: 'string',
        options: { layout: 'radio', list: [
          { title: 'Enfants', value: 'enfants' },
          { title: 'Adultes', value: 'adultes' },
          { title: 'Arts martiaux', value: 'arts-martiaux' },
        ] },
        validation: r => r.required().error('Choisissez une catégorie.'),
      }),
      texte('resume', 'Résumé', 'Une phrase, sur la liste des programmes. Exemple : « Jeux d’opposition partagés entre le parent et l’enfant (2019–2022). »', true),
      texte('resumeEn', 'Résumé (anglais)'),
      texte('horaire', 'Horaire court', 'Pour les listes et le bas de page. Exemple : « Sam 09h00–10h00 »', true),
      paragraphe('description', 'Description', 'Laissez une ligne vide entre deux paragraphes.', true),
      paragraphe('descriptionEn', 'Description (anglais)'),
      texte('prealable', 'Préalable', 'Exemple : « Minimum une saison de pratique. »'),
      texte('cours', 'Cours par semaine', 'Exemple : « 2 cours par semaine »'),
      texte('debut', 'Début des cours', 'Exemple : « Samedi 05 septembre 2026 »'),
      texte('inscription', 'Inscription', 'Seulement si elle diffère de l’inscription du club. Exemple : « En ligne avant le 31 août 2026 pour réserver une place. »'),
    ]),
    { ...objets('groupes', 'Groupes', 'Un groupe par âge et par horaire. Ils remplissent l’horaire de la semaine et le chercheur de cours de l’accueil.', [
      defineField({
        name: 'clientele', title: 'Pour qui', type: 'string',
        description: 'Exemple : « Nés en 2020-2021 », « 8 à 13 ans », « 16 ans et plus »',
        validation: r => [r.required().error('« Pour qui » est obligatoire.'), r.custom((v?: string) => clienteleWarning(v) ?? true).warning()],
      }),
      texte('code', 'Code du groupe', 'Exemple : « PES »', true),
      defineField({
        name: 'horaire', title: 'Horaire', type: 'string',
        description: 'Le jour et les heures. Exemple : « Samedi 09h00 à 10h00 » ou « Lundi et mercredi 18h00 à 19h00 »',
        validation: r => [r.required().error('« Horaire » est obligatoire.'), r.custom((v?: string) => horaireWarning(v) ?? true).warning()],
      }),
    ], { title: 'clientele', subtitle: 'horaire' }), group: 'groupes' },
    ...groupe('tarifs', [
      liste('colonnes', 'Colonnes de prix de ce programme', 'Laissez vide pour utiliser les colonnes du club (« Avant le 19 août », « Après le 19 août »). Exemple : « Coût ».'),
      defineField({
        name: 'tarifs', title: 'Tarifs', type: 'array',
        of: [defineArrayMember({
          type: 'object',
          fields: [
            texte('periode', 'Période', 'Exemple : « 05 sep. au 19 déc. (16 semaines) »', true),
            defineField({
              name: 'prix', title: 'Prix', type: 'array', of: [defineArrayMember({ type: 'string' })],
              description: 'Un prix par colonne, dans le même ordre. Exemple : « 265 $ », puis « 280 $ ».',
              validation: r => r.custom(async (prix: string[] | undefined, { document, getClient }) => {
                const propres = (document?.colonnes as string[] | undefined) ?? []
                const colonnes = propres.length ? propres
                  : (await getClient({ apiVersion: '2026-09-01' }).fetch<string[] | null>('*[_id == "club"][0].inscription.colonnesTarif')) ?? []
                return prixWarning(prix, colonnes) ?? true
              }).warning(),
            }),
          ],
          preview: { select: { title: 'periode', prix: 'prix' }, prepare: ({ title, prix }) => ({ title, subtitle: (prix ?? []).join(' · ') }) },
        })],
      }),
      liste('notes', 'Notes', 'Sous les tarifs. Une phrase par ligne.'),
    ]),
    ...groupe('gens', [
      {
        ...objets('instructeurs', 'Instructeurs', 'Choisissez une fiche d’instructeur, ou écrivez le nom et le grade.', [
          defineField({ name: 'ref', title: 'Fiche d’instructeur', type: 'reference', to: [{ type: 'instructeur' }] }),
          texte('nom', 'Nom (sans fiche)', 'Seulement si la personne n’a pas de fiche. Exemple : « Marc Tremblay »'),
          texte('grade', 'Grade affiché', 'Laissez vide pour prendre le grade de la fiche. Exemple : « 2e dan »'),
        ],
        { refNom: 'ref.nom', nom: 'nom', grade: 'grade', refGrade: 'ref.grade', media: 'ref.photo' },
        ({ refNom, nom, grade, refGrade, media }) => ({ title: refNom ?? nom, subtitle: grade ?? refGrade, media })),
        validation: (r: ArrayRule<{ ref?: unknown; nom?: string }[]>) => r.custom(items =>
          (items ?? []).every(i => i.ref || i.nom) || 'Choisissez une fiche d’instructeur, ou écrivez le nom et le grade.'),
      },
      objets('contacts', 'Personnes à joindre', 'Laissez vide pour afficher l’entraîneur chef, le téléphone et le courriel du club.', [
        texte('nom', 'Nom', undefined, true),
        texte('role', 'Rôle', 'Exemple : « Responsable du parascolaire »'),
        texte('tel', 'Téléphone'),
        texte('courriel', 'Courriel'),
      ], { title: 'nom', subtitle: 'role' }),
    ]),
    ...groupe('documents', [
      lien('formulaire', 'Formulaire d’inscription (lien)', 'Exemple : https://forms.gle/vMyBkBuCJj6H8XJc6'),
      image('qr', 'Code QR du formulaire'),
      documentPdf('documents', 'Documents', 'Des PDF à télécharger sur la page du programme.'),
    ]),
  ],
  preview: { select: { title: 'titre', subtitle: 'horaire' } },
})
