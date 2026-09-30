// A club season runs from August 1 to July 31: « 2026-2027 ».
export function saisonCourante(d = new Date()) {
  const y = d.getFullYear() - (d.getMonth() < 7 ? 1 : 0)
  return `${y}-${y + 1}`
}
export const debutSaison = (saison: string) => `${saison.slice(0, 4)}-08-01`
export const saisonValide = (s: string) => /^\d{4}-\d{4}$/.test(s) && Number(s.slice(5)) === Number(s.slice(0, 4)) + 1
