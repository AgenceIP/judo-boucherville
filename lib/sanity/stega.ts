import type { StegaConfig } from 'next-sanity'

// Fields the site parses, compares or puts in URLs: an invisible click-to-edit marker would break
// the week grid (horaire), the class finder (clientele, saison), links (slug) or grouping (code, equipes).
const LOGIQUE = new Set(['slug', 'saison', 'horaire', 'clientele', 'code', 'categorie', 'colonnes', 'colonnesTarif', 'equipes', 'kind', 'medaille', 'tel', 'courriel', 'debut', 'fin'])
const LIEN = /^(https?:|mailto:|tel:|\/)|@/

export const stegaFilter: NonNullable<StegaConfig['filter']> = props =>
  props.sourcePath.some(s => typeof s === 'string' && LOGIQUE.has(s)) || LIEN.test(props.value)
    ? false
    : props.filterDefault(props)
