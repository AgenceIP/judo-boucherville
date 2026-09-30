import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { BookIcon } from '@sanity/icons/Book'
import { ClipboardIcon } from '@sanity/icons/Clipboard'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { UserIcon } from '@sanity/icons/User'
import { UsersIcon } from '@sanity/icons/Users'
import { EQUIPES } from './equipes'
import { HelpPane } from './HelpPane'

type Tri = { field: string; direction: 'asc' | 'desc' }[]

export const structure: StructureResolver = (S, context) => {
  const unique = (type: string, title: string) =>
    S.listItem().title(title).id(type).schemaType(type).child(S.document().schemaType(type).documentId(type).title(title))
  const ordre = (type: string, title: string, icon: typeof UserIcon) =>
    orderableDocumentListDeskItem({ type, title, icon, S, context })
  const liste = (type: string, title: string, by: Tri) =>
    S.documentTypeListItem(type).title(title).child(S.documentTypeList(type).title(title).defaultOrdering(by))
  const athletes = (id: string, title: string, filter: string, params: Record<string, string> = {}) =>
    S.documentList().id(id).title(title).schemaType('athlete').filter(filter).params(params)
      .defaultOrdering([{ field: 'nom', direction: 'asc' }])

  return S.list().title('Contenu').items([
    S.listItem().title('Comment faire').id('aide').icon(HelpCircleIcon).child(S.component(HelpPane).id('aide').title('Comment faire')),
    S.divider(),
    unique('club', 'Club et inscription'),
    ordre('programme', 'Programmes (horaires et tarifs)', ClipboardIcon),
    liste('evenement', 'Calendrier', [{ field: 'debut', direction: 'desc' }]),
    ordre('instructeur', 'Instructeurs', UserIcon),
    S.listItem().title('Athlètes').id('athletes').icon(UsersIcon).child(
      S.list().title('Athlètes').items([
        S.listItem().title('Tous les athlètes').id('tous').child(athletes('tous', 'Tous les athlètes', '_type == "athlete"')),
        S.divider(),
        ...EQUIPES.map(([key, fr]) => S.listItem().title(fr).id(`equipe-${key}`).child(
          athletes(`equipe-${key}`, fr, '_type == "athlete" && $e in equipes', { e: key })
            .initialValueTemplates([S.initialValueTemplateItem('athlete-equipe', { equipe: key })]),
        )),
        S.divider(),
        S.listItem().title('Sans équipe').id('sans-equipe').child(
          athletes('sans-equipe', 'Sans équipe', '_type == "athlete" && count(coalesce(equipes, [])) == 0'),
        ),
      ]),
    ),
    liste('actualite', 'Nouvelles', [{ field: 'saison', direction: 'desc' }, { field: 'tri', direction: 'desc' }]),
    liste('resultat', 'Résultats', [{ field: 'saison', direction: 'desc' }, { field: 'tri', direction: 'desc' }]),
    ordre('journaux', 'Journaux', BookIcon),
    liste('ceintureNoire', 'Ceintures noires', [{ field: 'annee', direction: 'desc' }]),
    S.divider(),
    unique('challenge', 'Challenge'),
    unique('conseil', 'Conseil d’administration'),
    unique('historique', 'Historique'),
    unique('telechargements', 'Téléchargements'),
    unique('photosSite', 'Photos du site'),
  ])
}
