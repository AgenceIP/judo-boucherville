import { describe, it, expect } from 'vitest'
import { clienteleWarning, horaireWarning, lienError, prixWarning } from '../validation'

const HORAIRES = [
  'Samedi 09h00 à 10h00', 'Samedi 10h15 à 11h15', 'Samedi 11h30 à 12h30', 'Samedi 13h00 à 14h00',
  'Lundi et vendredi 18h00 à 19h00', 'Mardi et jeudi 18h00 à 19h30, samedi 14h30 à 16h30',
  'Judo : lundi et vendredi 19h00 à 20h30, mercredi 18h00 à 19h30', 'Judo : lundi 19h00 à 20h30, mercredi 19h30 à 21h00',
  'Mardi et jeudi 20h00 à 21h30', 'Lundi, mardi, mercredi ou jeudi 12h00 à 13h00, ou dimanche 14h00 à 15h00',
  'Lundi, mardi, mercredi, jeudi ou vendredi 09h00 à 10h00', 'Mardi, mercredi ou jeudi 16h00 à 17h30',
  'Lundi et mercredi 18h00 à 19h00',
  'Du 06 au 10 juillet 2026', 'Du 17 au 21 août 2026', // day camp: dates, not a weekly class
]
const CLIENTELES = [
  'Nés en 2020-2021', 'Nés en 2018-2019', 'Nés en 2016-2017', 'Nés en 2014-2015', 'Nés en 2016-2017 / 2014-2015',
  'Nés en 2012-2013', 'Nés en 2010-2011', 'Nés en 2007-2008-2009', 'Nés en 2006 et avant',
  'Parents / enfants nés en 2019, 2020, 2021, 2022', 'Femmes et hommes nés en 2010 et avant', 'Femmes nées en 2010 et avant',
  'Femmes et hommes de 50 ans et plus', 'Élèves de 3e, 4e et 5e année', '8 à 13 ans', '16 ans et plus',
]

describe('horaireWarning', () => {
  it.each(HORAIRES)('accepts « %s »', h => expect(horaireWarning(h)).toBeUndefined())
  it('warns, with an example, when the week grid cannot read it', () => {
    expect(horaireWarning('Samedi matin')).toMatch(/Samedi 09h00 à 10h00/)
  })
  it('says nothing while empty (required is checked elsewhere)', () => expect(horaireWarning('')).toBeUndefined())
})

describe('clienteleWarning', () => {
  it.each(CLIENTELES)('accepts « %s »', c => expect(clienteleWarning(c)).toBeUndefined())
  it('warns when the class finder cannot read it', () => expect(clienteleWarning('Tout le monde')).toMatch(/Nés en 2020-2021/))
})

describe('prixWarning', () => {
  const colonnes = ['Avant le 19 août', 'Après le 19 août']
  it('accepts one price per column', () => expect(prixWarning(['265 $', '280 $'], colonnes)).toBeUndefined())
  it('names the columns when the count differs', () => {
    expect(prixWarning(['265 $'], colonnes)).toBe(
      'Il y a 2 colonnes de prix (Avant le 19 août, Après le 19 août) mais 1 prix. Écrivez un prix par colonne, dans le même ordre.')
  })
  it('counts a missing list as zero', () => expect(prixWarning(undefined, ['Coût'])).toMatch(/mais 0 prix/))
})

describe('lienError', () => {
  it.each(['https://forms.gle/x', '/inscription', 'mailto:info@judoboucherville.com', undefined])('accepts %s', v =>
    expect(lienError(v)).toBeUndefined())
  it('rejects a bare domain', () => expect(lienError('www.judo-quebec.qc.ca')).toMatch(/https:\/\//))
})
