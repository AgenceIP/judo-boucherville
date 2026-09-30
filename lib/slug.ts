/** « Édouard Chassé » → « edouard-chasse »: the URL part of a name (accents dropped, 96 characters max). */
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 96).replace(/^-|-$/g, '')
