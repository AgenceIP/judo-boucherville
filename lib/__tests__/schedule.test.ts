import { describe, it, expect } from 'vitest'
import { parseHoraire, birthYears, matchesBirthYear } from '../schedule'

describe('parseHoraire', () => {
  it('reads days joined by "et" with one time range', () => {
    expect(parseHoraire('Lundi et vendredi 18h00 à 19h00')).toEqual([
      { day: 0, start: '18h00', end: '19h00' },
      { day: 4, start: '18h00', end: '19h00' },
    ])
  })

  it('reads several segments, each with its own days', () => {
    expect(parseHoraire('Judo : lundi et vendredi 19h00 à 20h30, mercredi 18h00 à 19h30')).toEqual([
      { day: 0, start: '19h00', end: '20h30' },
      { day: 4, start: '19h00', end: '20h30' },
      { day: 2, start: '18h00', end: '19h30' },
    ])
  })

  it('reads comma-separated day lists with "ou"', () => {
    expect(parseHoraire('Lundi, mardi, mercredi ou jeudi 12h00 à 13h00, ou dimanche 14h00 à 15h00')).toEqual([
      { day: 0, start: '12h00', end: '13h00' },
      { day: 1, start: '12h00', end: '13h00' },
      { day: 2, start: '12h00', end: '13h00' },
      { day: 3, start: '12h00', end: '13h00' },
      { day: 6, start: '14h00', end: '15h00' },
    ])
  })

  it('ignores date ranges and free text', () => {
    expect(parseHoraire('Du 06 au 10 juillet 2026')).toEqual([])
    expect(parseHoraire('Selon l’horaire scolaire')).toEqual([])
  })
})

describe('birthYears', () => {
  it('expands listed and dashed years', () => {
    expect(birthYears('Nés en 2018-2019', 2026)).toEqual({ min: 2018, max: 2019 })
    expect(birthYears('Nés en 2007-2008-2009', 2026)).toEqual({ min: 2007, max: 2009 })
    expect(birthYears('Parents / enfants nés en 2019, 2020, 2021, 2022', 2026)).toEqual({ min: 2019, max: 2022 })
  })

  it('handles "et avant" as open-ended', () => {
    expect(birthYears('Nés en 2006 et avant', 2026)).toEqual({ min: -Infinity, max: 2006 })
    expect(birthYears('Femmes nées en 2010 et avant', 2026)).toEqual({ min: -Infinity, max: 2010 })
  })

  it('converts ages to birth years for the season', () => {
    expect(birthYears('Femmes et hommes de 50 ans et plus', 2026)).toEqual({ min: -Infinity, max: 1976 })
    expect(birthYears('8 à 13 ans', 2026)).toEqual({ min: 2013, max: 2018 })
  })

  it('maps school grades 3 to 5 to ages 8 to 11', () => {
    expect(birthYears('Élèves de 3e, 4e et 5e année', 2026)).toEqual({ min: 2015, max: 2018 })
  })

  it('returns null when there is nothing to match', () => {
    expect(birthYears('Selon le niveau', 2026)).toBeNull()
  })
})

describe('matchesBirthYear', () => {
  it('matches inside the range only', () => {
    expect(matchesBirthYear('Nés en 2016-2017 / 2014-2015', 2015, 2026)).toBe(true)
    expect(matchesBirthYear('Nés en 2016-2017 / 2014-2015', 2013, 2026)).toBe(false)
    expect(matchesBirthYear('Nés en 2006 et avant', 1980, 2026)).toBe(true)
  })
})
