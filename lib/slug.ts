/** « Édouard Chassé » → « edouard-chasse »: the URL part of a name (accents dropped, 96 characters max). */
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 96).replace(/^-|-$/g, '')

/** `base`, or `base-2`, `base-3`… if already taken: two athletes with the same name get two pages. */
export function slugLibre(base: string, pris: string[]) {
  let s = base
  for (let i = 2; pris.includes(s); i++) s = `${base}-${i}`
  return s
}
