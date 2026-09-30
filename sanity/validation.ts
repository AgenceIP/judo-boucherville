// Studio checks that reuse the site's own parsers: what Fayçal types is what the site can read.
import { birthYears, parseHoraire } from '../lib/schedule'

// Day-camp weeks (« Du 06 au 10 juillet 2026 ») are dates, not a weekly class
const PLAGE = /\bdu \d{1,2} au \d{1,2}\b/i

export const horaireWarning = (h?: string) =>
  !h || PLAGE.test(h) || parseHoraire(h).length > 0
    ? undefined
    : 'L’horaire de la semaine ne sait pas lire ce texte : ce groupe n’y apparaîtra pas. Écrivez le jour et les heures, par exemple « Samedi 09h00 à 10h00 » ou « Lundi et mercredi 18h00 à 19h00 ».'

export const clienteleWarning = (c?: string) =>
  !c || birthYears(c, 2026)
    ? undefined
    : 'Le chercheur de cours ne sait pas lire cette clientèle : ce groupe n’y sera pas proposé. Écrivez par exemple « Nés en 2020-2021 », « 8 à 13 ans » ou « 16 ans et plus ».'

export const prixWarning = (prix: string[] | undefined, colonnes: string[]) => {
  const n = prix?.length ?? 0
  return n === colonnes.length
    ? undefined
    : `Il y a ${colonnes.length} colonnes de prix (${colonnes.join(', ')}) mais ${n} prix. Écrivez un prix par colonne, dans le même ordre.`
}

export const lienError = (v?: string) =>
  !v || /^(\/|https?:\/\/|mailto:)/.test(v) ? undefined : 'Le lien doit commencer par https:// (autre site) ou / (page de ce site).'
