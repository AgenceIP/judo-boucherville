import { describe, it, expect } from 'vitest'
import { buildCalendrier, buildEquipes, clean, groupSaisons, medailles, photo, toChallenge, type ArticleRow, type ChallengeRow } from '../transform'
import type { Bloc } from '../types'

const span = (text: string, marks: string[] = []) => ({ _type: 'span' as const, _key: text, text, marks })
const bloc = (children: Extract<Bloc, { _type: 'block' }>['children'], href?: string): Bloc => ({
  _type: 'block', _key: 'b', style: 'normal', children, markDefs: href ? [{ _key: 'l', _type: 'link', href }] : [],
})

describe('clean', () => {
  it('drops null, undefined and empty strings, keeps 0 and false', () => {
    expect(clean({ a: null, b: '', c: 0, d: false, e: ['x', null, ''], f: { g: undefined } })).toEqual({ c: 0, d: false, e: ['x'], f: {} })
  })
})

describe('photo', () => {
  it('turns the hotspot into an object-position', () => {
    expect(photo({ src: 's', w: 1, h: 1, hotspot: { x: 0.5, y: 0.25 } })).toEqual({ src: 's', w: 1, h: 1, pos: '50% 25%' })
    expect(photo({ src: 's', w: 1, h: 1 })).toEqual({ src: 's', w: 1, h: 1 })
  })
})

describe('groupSaisons', () => {
  const rows: ArticleRow[] = [
    { saison: '2025-2026', tri: 5, titre: 'Ancienne', contenu: [] },
    { saison: '2026-2027', tri: 1, titre: 'Migrée', contenu: [] },
    { saison: '2026-2027', tri: 1770000000000, titre: 'Nouvelle fiche', lieu: '', contenu: [] },
  ]
  it('newest season first, newest entry on top, empty fields dropped', () => {
    const s = groupSaisons(rows)
    expect(s.map(x => x.saison)).toEqual(['2026-2027', '2025-2026'])
    expect(s[0].entrees).toEqual([{ titre: 'Nouvelle fiche', contenu: [] }, { titre: 'Migrée', contenu: [] }])
  })
})

describe('buildEquipes', () => {
  it('sorts in French, links only athletes with a page, hides empty teams', () => {
    const e = buildEquipes([
      { nom: 'Frédéric B', slug: 'frederic-b', equipes: ['u16'], aPage: false },
      { nom: 'Édouard C', slug: 'edouard-c', equipes: ['u16', 'u18'], aPage: true },
      { nom: 'David A', slug: 'david-a', equipes: ['u16'], aPage: true },
      { nom: 'Sans Équipe', slug: 'sans-equipe', equipes: [], aPage: true },
    ])
    expect(e.u16).toEqual([{ nom: 'David A', slug: 'david-a' }, { nom: 'Édouard C', slug: 'edouard-c' }, { nom: 'Frédéric B', slug: null }])
    expect(e.u18).toEqual([{ nom: 'Édouard C', slug: 'edouard-c' }])
    expect(Object.keys(e)).toEqual(['u16', 'u18'])
  })
})

describe('buildCalendrier', () => {
  const today = new Date(2026, 8, 29) // season 2026-2027 started on 2026-08-01
  const m = buildCalendrier([
    { debut: '2026-07-20', fin: '2026-07-31', titre: 'Fini' },
    { debut: '2026-07-28', fin: '2026-08-02', titre: 'Camp' },
    { debut: '2026-08-17', fin: '2026-08-18', titre: 'Inscriptions', lieu: 'Boucherville' },
    { debut: '2026-08-30', fin: '2026-09-02', titre: 'Stage' },
    { debut: '2026-09-04', titre: 'Rentrée', lien: '' },
  ], today)
  it('hides events that ended before the season, groups by start month', () => {
    expect(m.map(x => x.mois)).toEqual(['Juillet 2026', 'Août 2026', 'Septembre 2026'])
    expect(m[0]).toEqual({ mois: 'Juillet 2026', moisEn: 'July 2026', evenements: [{ jour: '28/07–02/08', titre: 'Camp' }] })
    expect(m[1].evenements).toEqual([{ jour: '17-18', titre: 'Inscriptions', lieu: 'Boucherville' }, { jour: '30/08–02/09', titre: 'Stage' }])
    expect(m[2].evenements).toEqual([{ jour: '04', titre: 'Rentrée' }])
  })
})

describe('medailles', () => {
  it('counts the medals in the text, links included, but not the tally block', () => {
    const contenu: Bloc[] = [
      bloc([span('Léa '), { _type: 'medaille', _key: 'm1', kind: 'or' }]),
      bloc([span('Résultats', ['l']), { _type: 'medaille', _key: 'm2', kind: 'bronze' }], 'https://x.org'),
      { _type: 'bilanMedailles', _key: 't', or: 9, argent: 9, bronze: 9 },
    ]
    expect(medailles({ saison: 's', entrees: [{ contenu }] })).toEqual({ or: 1, argent: 0, bronze: 1 })
  })
})

describe('toChallenge', () => {
  it('rebuilds the tuples the page reads, with empty cells as ""', () => {
    const row: ChallengeRow = {
      edition: 27, date: '2026-04-11T12:00:00Z', depuis: 1997, pays: ['France'], paysEn: ['France'], president: 'P',
      couts: [{ athletes: '4', prix: '200 $' }], bourses: [{ division: 'Masters', divisionEn: 'Masters', montant: '800 $' }],
      limites: [{ pour: 'Canada', pourEn: 'Canada', date: '4 avril', dateEn: 'April 4' }],
      divisions: [{ division: 'U14', hommes: '-40', femmes: null, nes: '2013', nesEn: '2013', grades: 'Jaune', gradesEn: 'Yellow', pesee: '8 h' }],
      commanditaires: [{ logo: 'https://cdn.sanity.io/l.png', nom: 'Resto' }],
      palmares: [{ annee: 2025, coupe: [{ club: 'A', points: 30 }, { club: 'B', points: null }], divisions: [] }],
    }
    const c = toChallenge(row)
    expect(c.challenge.couts).toEqual([['4', '200 $']])
    expect(c.challenge.bourses).toEqual([['Masters', 'Masters', '800 $']])
    expect(c.challenge.limites).toEqual([['Canada', 'Canada', '4 avril', 'April 4']])
    expect(c.divisions).toEqual([['U14', '-40', '', '2013', '2013', 'Jaune', 'Yellow', '8 h']])
    expect(c.commanditaires).toEqual([['https://cdn.sanity.io/l.png', 'Resto']])
    expect(c.palmaresChallenge).toEqual([{ annee: 2025, coupe: [['A', 30], ['B']] }])
    expect(c.challenge).not.toHaveProperty('formulaire')
  })
})
