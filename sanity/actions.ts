import { useDocumentOperation, type DocumentActionComponent, type DocumentActionsContext } from 'sanity'
import { apiVersion } from './env'
import { slugLibre, slugify } from '../lib/slug'

/** Types whose page URL comes from a field: written at first publish, never changed after. */
export const SLUG_TYPES: Record<string, string> = { programme: 'titre', instructeur: 'nom', athlete: 'nom' }

const PRIS = '*[_type == $type && defined(slug.current) && !(_id in [$id, "drafts." + $id])].slug.current'

export function withSlug(publish: DocumentActionComponent, context: DocumentActionsContext): DocumentActionComponent {
  const client = context.getClient({ apiVersion })
  const Action: DocumentActionComponent = props => {
    const original = publish(props)
    const { patch } = useDocumentOperation(props.id, props.type)
    const doc = (props.draft ?? props.published) as ({ slug?: { current?: string } } & Record<string, unknown>) | null
    if (!original || doc?.slug?.current) return original
    return {
      ...original,
      onHandle: async () => {
        const pris = await client.fetch<string[]>(PRIS, { type: props.type, id: props.id })
        const base = slugify(String(doc?.[SLUG_TYPES[props.type]] ?? ''))
        patch.execute([{ set: { slug: { _type: 'slug', current: slugLibre(base, pris) } } }])
        original.onHandle?.()
      },
    }
  }
  Action.action = 'publish'
  return Action
}
