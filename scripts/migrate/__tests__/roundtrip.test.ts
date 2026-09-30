import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import { evaluate, parse } from 'groq-js'
import { NOMS, toDocuments, withAssets } from '../transform'
import * as C from '@/lib/content'
import { club, inscription, palmares, totalPalmares } from '@/data/club'
import { COLONNES_TARIF, programmes } from '@/data/programmes'
import { instructeurs } from '@/data/instructeurs'
import { calendrier, calendrierJudoQuebec } from '@/data/evenements'
import { ceintures, totalCeintures } from '@/data/ceintures-noires'
import { challenge, commanditaires, divisions, palmaresChallenge } from '@/data/challenge'
import { actualites, athletes, equipes, journaux, medailles, resultats, type Block } from '@/data/archive'
import { ancienDojo, inauguration, international, membres, presidents, telechargements, timeline } from '@/data/pages'
import { photosSite } from '@/data/photos'
import type { Bloc } from '@/lib/content'
import { clean } from '@/lib/content/transform'

const db = vi.hoisted(() => ({ dataset: [] as object[] }))
vi.mock('@/lib/sanity/client', () => ({
  sanityFetch: async (q: string, params: Record<string, unknown> = {}) =>
    await (await evaluate(parse(q, { params }), { dataset: db.dataset, params })).get(),
}))

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 29))
  const { docs, images } = toDocuments()
  const ids = new Map([...images.keys()].map((src, i) => [src, `image-${i}`]))
  db.dataset = [
    ...docs.map(d => withAssets(d, ids)),
    ...[...images].map(([src, { w = 1, h = 1 }]) => ({
      _id: ids.get(src), _type: 'sanity.imageAsset', url: src, metadata: { dimensions: { width: w, height: h } },
    })),
  ]
})
afterAll(() => vi.useRealTimers())

const nom = (n: string) => NOMS[n] ?? n
// old blocks and new Portable Text, both flattened to comparable lines
const ancien = (b: Block) => b.t === 'img' ? b.src : b.t === 'm' ? `${b.o}/${b.a}/${b.b}` : `${b.t === 'a' ? `${b.href} ` : ''}${b.text}`
const nouveau = (b: Bloc) => b._type === 'image' ? b.src : b._type === 'bilanMedailles' ? `${b.or}/${b.argent}/${b.bronze}`
  : `${b.markDefs?.[0] && b.children.every(c => c._type !== 'span' || c.marks?.length) ? `${b.markDefs[0].href} ` : ''}${b.children.map(c => c._type === 'span' ? c.text : `⟨${c.kind}⟩`).join('')}`

it('club and registration', async () => {
  expect(await C.getClub()).toEqual({
    club: { ...club, calendrierJudoQuebec },
    inscription: { ...inscription, colonnesTarif: COLONNES_TARIF, colonnesTarifEn: ['Before Aug 19', 'After Aug 19'] },
    palmares, totalPalmares,
  })
})

it('programmes and instructors', async () => {
  expect(await C.getProgrammes()).toEqual(programmes.map(p => ({ ...p, colonnes: p.colonnes ?? COLONNES_TARIF })))
  expect(await C.getProgramme(programmes[0].slug)).toEqual({ ...programmes[0], colonnes: programmes[0].colonnes ?? COLONNES_TARIF })
  expect(await C.getProgramme('inconnu')).toBeNull()
  const got = (await C.getInstructeurs()).map(({ photo, ...i }) => ({ ...i, ...(photo && { photoSrc: photo.src }) }))
  expect(got).toEqual(instructeurs.map(i => ({ ...i, id: expect.any(String) })))
})

it('calendar, black belts, challenge', async () => {
  expect(await C.getCalendrier()).toEqual(calendrier)
  expect(await C.getCeintures()).toEqual({ ceintures, total: totalCeintures })
  const c = await C.getChallenge()
  expect(c.challenge).toEqual(challenge)
  expect(c.divisions).toEqual(divisions)
  expect(c.commanditaires).toEqual(commanditaires.map(([f, n]) => [`/images/challenge/${f}`, n]))
  expect(c.palmaresChallenge).toEqual(palmaresChallenge)
})

it('athletes: one document per person, teams sorted, same profile pages', async () => {
  const e = await C.getEquipes()
  const tri = (l: { nom: string; slug: string | null }[]) => [...l].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  expect(e).toEqual(Object.fromEntries(Object.entries(equipes).map(([k, l]) => [k, tri(l.map(m => ({ ...m, nom: nom(m.nom) })))])))
  expect((await C.getAthleteSlugs()).sort()).toEqual(athletes.map(a => a.slug).sort())
  // Sanity stores no nulls or empty lists: they come back absent, which the profile page renders the same
  const vide = (v: unknown) => JSON.parse(JSON.stringify(clean(v), (k, x) => (k && Array.isArray(x) && !x.length ? undefined : x)))
  for (const a of athletes) expect(vide(await C.getAthlete(a.slug))).toEqual(vide({ ...a, nom: nom(a.nom) }))
  expect((await C.getAthlete('amira-bousbiat'))?.photos ?? []).toEqual([])
})

it.each([['actualite', actualites], ['resultat', resultats]] as const)('%s: same seasons, entries, text and medals', async (type, avant) => {
  expect(await C.getSaisons(type)).toEqual(avant.map(s => s.saison))
  for (const s of avant) {
    const apres = (await C.getSaison(type, s.saison))!
    expect(apres.entrees.map(({ contenu, ...e }) => ({ ...e, lignes: contenu.map(nouveau) })))
      .toEqual(s.entrees.map(({ blocks, ...e }) => ({ ...e, lignes: blocks.map(ancien) })))
    expect(C.medailles(apres)).toEqual(medailles(s))
  }
})

it('journals, board, history, downloads, site photos', async () => {
  expect(await C.getJournaux()).toEqual(journaux.map(p => ({ ...p, numeros: p.numeros.map(({ thumb, ...n }) => (thumb ? { ...n, thumb } : n)) })))
  expect(await C.getConseil()).toEqual({ membres, presidents })
  expect(await C.getHistorique()).toEqual({ timeline, international, ancienDojo, inauguration })
  expect(await C.getTelechargements()).toEqual(telechargements)
  expect(await C.getPhotosSite()).toMatchObject(photosSite)
})
it('document ids are unique and Sanity-safe', () => {
  const ids = toDocuments().docs.map(d => d._id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(ids.filter(id => !/^[a-zA-Z0-9_-]+$/.test(id))).toEqual([])
})
it('one document per athlete, unique URLs', () => {
  const a = toDocuments().docs.filter(d => d._type === 'athlete')
  expect(a).toHaveLength(92)
  const slugs = a.map(d => (d.slug as { current: string }).current)
  expect(new Set(slugs).size).toBe(slugs.length)
})
it('never migrates a photo of Amira Bousbiat', () => {
  const amira = toDocuments().docs.find(d => d._id === 'athlete-amira-bousbiat')
  expect(amira?.photos ?? []).toEqual([])
})
