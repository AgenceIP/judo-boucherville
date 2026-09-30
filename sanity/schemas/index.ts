import { club } from './club'
import { programme } from './programme'
import { instructeur } from './instructeur'
import { evenement } from './evenement'
import { ceintureNoire } from './ceintureNoire'
import { challenge } from './challenge'
import { athlete } from './athlete'
import { actualite, resultat } from './article'
import { journaux } from './journaux'
import { conseil } from './conseil'
import { historique } from './historique'
import { telechargements } from './telechargements'
import { photosSite } from './photosSite'

export const schemaTypes = [club, programme, instructeur, evenement, ceintureNoire, challenge, athlete, actualite, resultat, journaux, conseil, historique, telechargements, photosSite]

/** One document each, `_id` = type name: opened directly, never created, deleted or duplicated. */
export const SINGLETONS = ['club', 'challenge', 'conseil', 'historique', 'telechargements', 'photosSite']
