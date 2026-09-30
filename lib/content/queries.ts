import { PHOTO_KEYS } from './types'

/** English field, or the French one when Fayçal left it empty. */
const en = (f: string) => `"${f}En": coalesce(${f}En, ${f})`
const enListe = (f: string) => `"${f}En": coalesce(select(count(${f}En) > 0 => ${f}En, ${f}), [])`
/** Optional list: null (dropped by `clean`) when empty, like today's absent fields. */
const opt = (f: string, proj = '') => `"${f}": select(count(${f}) > 0 => ${f}${proj})`
const PHOTO = '{"src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, hotspot}'
/** An uploaded PDF wins over a link. */
const PDF = (f: string) => `coalesce(${f}.fichier.asset->url, ${f}.lien)`
const A_PAGE = 'coalesce(count(photos), 0) + coalesce(count(personnes), 0) > 0'

export const CLUB = `*[_id == "club"][0]{
  nom, site, dojo, lieu, adresse, tel, courriel, responsable, president, instagram, facebook, twitter, tiktok, youtube, calendrierJudoQuebec,
  "inscription": inscription{
    saison, formulaire, "qr": qr.asset->url,
    "debutCours": coalesce(debutCours[]{programme, ${en('programme')}, date, ${en('date')}}, []),
    enLigne, ${en('enLigne')}, surPlace, ${en('surPlace')}, paiement, ${en('paiement')},
    "notes": coalesce(notes, []), ${enListe('notes')}, "colonnesTarif": coalesce(colonnesTarif, []), ${enListe('colonnesTarif')}
  },
  "palmares": coalesce(palmares[]{championnat, ${en('championnat')}, or, argent, bronze}, [])
}`

const PROG = `{
  "slug": slug.current, titre, ${en('titre')}, categorie, resume, ${en('resume')}, horaire, description, descriptionEn,
  prealable, cours, debut, inscription,
  "groupes": coalesce(groupes[]{clientele, code, horaire}, []),
  "colonnes": select(count(colonnes) > 0 => colonnes, *[_id == "club"][0].inscription.colonnesTarif),
  "tarifs": coalesce(tarifs[]{periode, "prix": coalesce(prix, [])}, []),
  ${opt('notes')},
  "instructeurs": coalesce(instructeurs[]{"nom": coalesce(nom, ref->nom), "grade": coalesce(grade, ref->grade), "slug": ref->slug.current}, []),
  formulaire, "qr": qr.asset->url,
  ${opt('documents', `[]{titre, "href": ${PDF('pdf')}}`)},
  ${opt('contacts', '[]{nom, role, tel, courriel}')}
}`
export const PROGRAMMES = `*[_type == "programme" && defined(slug.current)] | order(orderRank) ${PROG}`
export const PROGRAMME = `*[_type == "programme" && slug.current == $slug][0] ${PROG}`

const INSTR = `{
  "id": _id, nom, "slug": slug.current, "photo": photo${PHOTO}, grade, pnce, "disciplines": coalesce(disciplines, []),
  role, bio, bioEn, "competitions": coalesce(competitions, [])
}`
export const INSTRUCTEURS = `*[_type == "instructeur" && defined(slug.current)] | order(orderRank) ${INSTR}`
export const INSTRUCTEUR = `*[_type == "instructeur" && slug.current == $slug][0] ${INSTR}`

export const EVENEMENTS = '*[_type == "evenement"] | order(debut asc){debut, fin, titre, lieu, lien}'
export const CEINTURES = '*[_type == "ceintureNoire"] | order(annee asc){annee, "noms": coalesce(noms, [])}'

export const CHALLENGE = `*[_id == "challenge"][0]{
  edition, date, depuis, "pays": coalesce(pays, []), ${enListe('pays')}, formulaire,
  "programme": ${PDF('programme')}, "devis": ${PDF('devis')}, video, president,
  "couts": coalesce(couts[]{athletes, prix}, []),
  "bourses": coalesce(bourses[]{division, ${en('division')}, montant}, []),
  "limites": coalesce(limites[]{pour, ${en('pour')}, date, ${en('date')}}, []),
  "divisions": coalesce(divisions[]{division, hommes, femmes, nes, ${en('nes')}, grades, ${en('grades')}, pesee}, []),
  "commanditaires": coalesce(commanditaires[]{"logo": logo.asset->url, nom}, []),
  "palmares": coalesce(palmares[]{annee, "coupe": coalesce(coupe[]{club, points}, []),
    "divisions": coalesce(divisions[]{division, or, argent, bronze, meilleur}, [])}, [])
}`

export const EQUIPES = `*[_type == "athlete"]{nom, "slug": slug.current, equipes, "aPage": ${A_PAGE}}`
export const ATHLETE_SLUGS = `*[_type == "athlete" && defined(slug.current) && ${A_PAGE}].slug.current`
export const ATHLETE = `*[_type == "athlete" && slug.current == $slug && ${A_PAGE}][0]{
  "slug": slug.current, nom, "photos": coalesce(photos[]${PHOTO}, []),
  "personnes": coalesce(personnes[]{nom, naissance, debut, grade, etudes, judoinside, ${opt('faits')}, ${opt('objCourt')}, ${opt('objLong')},
    ${opt('saisons', '[]{saison, victoires, defaites, "resultats": coalesce(resultats, [])}')}}, [])
}`

/** Season list (sorted newest first by the getter) and one season at a time: a whole archive would exceed the 2 MB fetch cache. */
export const SAISONS = 'array::unique(*[_type == $type].saison)'
export const SAISON = `*[_type == $type && saison == $saison]{
  saison, tri, date, lieu, titre,
  "contenu": coalesce(contenu[]{..., _type == "image" => {"src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height}}, [])
}`

export const JOURNAUX = `*[_type == "journaux"] | order(orderRank){periode, "numeros": coalesce(numeros[]{titre, "thumb": vignette.asset->url, "pdf": ${PDF('pdf')}}, [])}`

export const CONSEIL = `*[_id == "conseil"][0]{
  "membres": coalesce(membres[]{role, ${en('role')}, nom, courriel}, []),
  "presidents": coalesce(presidents[]{mandat, nom}, [])
}`
export const HISTORIQUE = `*[_id == "historique"][0]{
  "timeline": coalesce(timeline[]{date, ${en('date')}, texte, ${en('texte')}}, []),
  "international": coalesce(international[]{titre, ${en('titre')}, "participations": coalesce(participations[]{annee, athletes, lieu, resultat}, [])}, []),
  "ancienDojo": coalesce(ancienDojo[].asset->url, []),
  "inauguration": coalesce(inauguration[].asset->url, [])
}`
export const TELECHARGEMENTS = `*[_id == "telechargements"][0]{
  "groupes": coalesce(groupes[]{titre, ${en('titre')}, "docs": coalesce(docs[]{titre, "href": ${PDF('pdf')}}, [])}, [])
}`
export const PHOTOS_SITE = `*[_id == "photosSite"][0]{
  ${PHOTO_KEYS.map(k => `"${k}": ${k}{"src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, hotspot, alt, ${en('alt')}}`).join(',\n  ')}
}`
