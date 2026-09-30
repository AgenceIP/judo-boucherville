// data/ → Sanity documents. Pure: no network. Images are recorded by local path and uploaded by the runner.
import { EQUIPES } from '@/sanity/equipes'
import { slugify } from '@/lib/slug'
import { club, inscription, palmares } from '@/data/club'
import { COLONNES_TARIF, programmes } from '@/data/programmes'
import { instructeurs } from '@/data/instructeurs'
import { calendrier, calendrierJudoQuebec } from '@/data/evenements'
import { ceintures } from '@/data/ceintures-noires'
import { challenge, commanditaires, divisions, palmaresChallenge } from '@/data/challenge'
import { actualites, athletes, equipes, journaux, resultats, type Block, type Saison } from '@/data/archive'
import { ancienDojo, inauguration, international, membres, presidents, telechargements, timeline } from '@/data/pages'
import { photosSite } from '@/data/photos'

export type Doc = { _id: string; _type: string } & Record<string, unknown>

/** One spelling per athlete: the team lists and the profiles disagreed on these names (Deviation 12). */
export const NOMS: Record<string, string> = {
  'Melody Grenier': 'Mélody Grenier',
  'Edouard Chassé': 'Édouard Chassé',
  'Noah Beauregrad': 'Noah Beauregard',
  'Askan Khahan Zamora': 'Ashkan Khahan Zamora',
  'Jerome Lajoie et Jacob St-Jean': 'Jérome Lajoie et Jacob St-Jean',
  'Eric De Rome et Ludovic Durrieu': 'Éric De Rome et Ludovic Durrieu',
  'Marie-Michele Girard': 'Marie-Michèle Girard',
  'Alex Emond': 'Alexandre Emond',
  'Emile Nadeau-Denis': 'Émile Nadeau-Denis',
}
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const k = <T extends object>(items: readonly T[], p = 'k') => items.map((x, i) => ({ _key: `${p}${i}`, ...x }))
const rank = (i: number) => `0|${(1000 * (i + 1)).toString(36).padStart(6, '0')}:`
const ref = (_ref: string) => ({ _type: 'reference', _ref })
const lien = (href: string) => ({ lien: href })
const vide = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null))

/** Replaces each `_upload: src` with the uploaded asset reference. */
export function withAssets<T>(v: T, ids: Map<string, string>): T {
  if (Array.isArray(v)) return v.map(x => withAssets(x, ids)) as T
  if (!v || typeof v !== 'object') return v
  const { _upload, ...rest } = v as Record<string, unknown>
  const out = Object.fromEntries(Object.entries(rest).map(([key, x]) => [key, withAssets(x, ids)]))
  return (_upload ? { ...out, asset: ref(ids.get(_upload as string)!) } : out) as T
}

function enfants(text: string, marks: string[]) {
  return text.split(/⟨(or|argent|bronze)⟩/).map((t, i) => i % 2
    ? { _key: `c${i}`, _type: 'medaille', kind: t }
    : { _key: `c${i}`, _type: 'span', text: t, marks })
}

export function toDocuments() {
  const images = new Map<string, { w?: number; h?: number }>()
  const img = (src: string, dims: { w?: number; h?: number } = {}, extra: object = {}) => {
    if (!src.startsWith('/')) throw new Error(`image distante non migrable : ${src}`)
    images.set(src, { ...images.get(src), ...dims }) // keep known dimensions when a file is reused
    return { _type: 'image', _upload: src, ...extra }
  }
  const contenu = (blocks: Block[]) => blocks.map((b, i) => {
    const _key = `b${i}`
    if (b.t === 'img') return { _key, ...img(b.src, { w: b.w, h: b.h }, { petit: b.src.includes('/Logo/') }) }
    if (b.t === 'm') return { _key, _type: 'bilanMedailles', or: b.o, argent: b.a, bronze: b.b }
    if (b.t === 'a') return { _key, _type: 'block', style: 'normal', markDefs: [{ _key: 'l', _type: 'link', href: b.href }], children: enfants(b.text, ['l']) }
    return { _key, _type: 'block', style: b.t === 'h' ? 'h4' : 'normal', markDefs: [], children: enfants(b.text, []) }
  })
  const articles = (type: string, saisons: Saison[]) => {
    const n = saisons.reduce((t, s) => t + s.entrees.length, 0)
    let i = 0
    return saisons.flatMap(s => s.entrees.map((e, j) => ({
      _id: `${type}-${s.saison}-${j}`, _type: type, saison: s.saison, tri: n - i++,
      ...vide({ date: e.date, lieu: e.lieu, titre: e.titre }), contenu: contenu(e.blocks),
    })))
  }

  const fiches = new Map(instructeurs.map(i => [i.slug, i]))
  const docs: Doc[] = [
    {
      _id: 'club', _type: 'club', ...club, calendrierJudoQuebec,
      inscription: {
        saison: inscription.saison, formulaire: inscription.formulaire, qr: img(inscription.qr),
        debutCours: k(inscription.debutCours.map(([programme, programmeEn, date, dateEn]) => ({ programme, programmeEn, date, dateEn }))),
        enLigne: inscription.enLigne, enLigneEn: inscription.enLigneEn, surPlace: inscription.surPlace, surPlaceEn: inscription.surPlaceEn,
        paiement: inscription.paiement, paiementEn: inscription.paiementEn, notes: inscription.notes, notesEn: inscription.notesEn,
        colonnesTarif: COLONNES_TARIF, colonnesTarifEn: ['Before Aug 19', 'After Aug 19'],
      },
      palmares: k(palmares.map(([championnat, championnatEn, or, argent, bronze]) => ({ championnat, championnatEn, or, argent, bronze }))),
    },

    ...programmes.map(({ slug, colonnes, instructeurs: profs, qr, documents, groupes, tarifs, contacts, ...p }, i) => ({
      _id: `programme-${slug}`, _type: 'programme', orderRank: rank(i), slug: { _type: 'slug', current: slug }, ...p,
      ...(colonnes && colonnes.join() !== COLONNES_TARIF.join() && { colonnes }),
      groupes: k(groupes), tarifs: k(tarifs), ...(contacts && { contacts: k(contacts) }),
      instructeurs: k(profs.map(({ nom, grade, slug: s }) => {
        if (!s) return { nom, grade }
        const f = fiches.get(s)
        if (!f) throw new Error(`instructeur inconnu : ${s}`)
        return { ref: ref(`instructeur-${s}`), ...(nom !== f.nom && { nom }), ...(grade !== f.grade && { grade }) }
      })),
      ...(qr ? { qr: img(qr) } : {}),
      ...(documents && { documents: k(documents.map(({ titre, href }) => ({ titre, pdf: lien(href) }))) }),
    })),

    ...instructeurs.map(({ id: _, slug, photoSrc, ...i }, n) => ({
      _id: `instructeur-${slug}`, _type: 'instructeur', orderRank: rank(n), slug: { _type: 'slug', current: slug }, ...i,
      ...(photoSrc ? { photo: img(photoSrc) } : {}),
    })),

    ...calendrier.flatMap(m => {
      const [nomMois, annee] = m.mois.split(' ')
      const mm = String(MOIS.indexOf(nomMois) + 1).padStart(2, '0')
      if (mm === '00') throw new Error(`mois inconnu : ${m.mois}`)
      return m.evenements.map(({ jour, ...e }, i) => {
        const [d, f] = jour.split('-')
        const debut = `${annee}-${mm}-${d.padStart(2, '0')}`
        return { _id: `evenement-${debut}-${i}`, _type: 'evenement', debut, ...(f ? { fin: `${annee}-${mm}-${f.padStart(2, '0')}` } : {}), ...e }
      })
    }),

    ...ceintures.map(c => ({ _id: `ceinture-${c.annee}`, _type: 'ceintureNoire', ...c })),

    {
      _id: 'challenge', _type: 'challenge', ...challenge,
      programme: lien(challenge.programme), devis: lien(challenge.devis),
      couts: k(challenge.couts.map(([athletes, prix]) => ({ athletes, prix }))),
      bourses: k(challenge.bourses.map(([division, divisionEn, montant]) => ({ division, divisionEn, montant }))),
      limites: k(challenge.limites.map(([pour, pourEn, date, dateEn]) => ({ pour, pourEn, date, dateEn }))),
      divisions: k(divisions.map(([division, hommes, femmes, nes, nesEn, grades, gradesEn, pesee]) =>
        vide({ division, hommes, femmes, nes, nesEn, grades, gradesEn, pesee }))),
      commanditaires: k(commanditaires.map(([f, nom]) => ({ logo: img(`/images/challenge/${f}`), nom }))),
      palmares: k(palmaresChallenge.map(e => ({
        annee: e.annee,
        coupe: k(e.coupe.map(([club, points]) => (points == null ? { club } : { club, points }))),
        ...(e.divisions && { divisions: k(e.divisions.map(([division, or, argent, bronze, meilleur]) => vide({ division, or, argent, bronze, meilleur }))) }),
      }))),
    },

    ...athletesDocs(img),
    ...articles('actualite', actualites),
    ...articles('resultat', resultats),

    ...journaux.map((p, i) => ({
      _id: `journaux-${i}`, _type: 'journaux', orderRank: rank(i), periode: p.periode,
      numeros: k(p.numeros.map(n => ({ titre: n.titre, ...(n.thumb ? { vignette: img(n.thumb) } : {}), pdf: lien(n.pdf) }))),
    })),

    {
      _id: 'conseil', _type: 'conseil',
      membres: k(membres.map(([role, roleEn, nom, courriel]) => vide({ role, roleEn, nom, courriel }))),
      presidents: k(presidents.map(([mandat, nom]) => ({ mandat, nom }))),
    },
    {
      _id: 'historique', _type: 'historique',
      timeline: k(timeline.map(([date, dateEn, texte, texteEn]) => ({ date, dateEn, texte, texteEn }))),
      international: k(international.map(([titre, titreEn, ps]) => ({
        titre, titreEn, participations: k(ps.map(([annee, athletes, lieu, resultat]) => vide({ annee, athletes, lieu, resultat }))),
      }))),
      ancienDojo: k(ancienDojo.map(src => img(src))),
      inauguration: k(inauguration.map(src => img(src))),
    },
    {
      _id: 'telechargements', _type: 'telechargements',
      groupes: k(telechargements.map(g => ({
        titre: g.titre[0], titreEn: g.titre[1],
        docs: k(g.docs.map(({ titre, href }) => ({ titre, pdf: lien(href) }))),
      }))),
    },
    {
      _id: 'photosSite', _type: 'photosSite',
      ...Object.fromEntries(Object.entries(photosSite).map(([key, p]) => [key, img(p.src, {}, { alt: p.alt, altEn: p.altEn })])),
    },
  ]
  return { docs, images }
}

/** One document per person: team lists and profiles are merged by slug (or by name when there is no profile). */
function athletesDocs(img: (src: string, dims?: { w?: number; h?: number }) => object): Doc[] {
  const groupes = new Map<string, { nom: string; equipes: string[] }>()
  for (const [key] of EQUIPES) for (const m of equipes[key] ?? []) {
    const id = m.slug ?? slugify(m.nom)
    const g = groupes.get(id) ?? { nom: NOMS[m.nom] ?? m.nom, equipes: [] }
    g.equipes.push(key)
    groupes.set(id, g)
  }
  for (const a of athletes) if (!groupes.has(a.slug)) throw new Error(`profil sans équipe : ${a.slug}`)
  return [...groupes].map(([id, g]) => {
    const a = athletes.find(x => x.slug === id)
    if (id === 'amira-bousbiat' && a?.photos.length) throw new Error('Amira Bousbiat : aucune photo ne doit être migrée')
    return {
      _id: `athlete-${id}`, _type: 'athlete', slug: { _type: 'slug', current: id }, nom: g.nom, equipes: g.equipes,
      ...(a && {
        photos: k(a.photos.map(p => img(p.src, { w: p.w, h: p.h }))),
        personnes: k(a.personnes.map(({ saisons, ...p }) => ({ ...p, ...(saisons && { saisons: k(saisons) }) }))),
      }),
    }
  })
}
