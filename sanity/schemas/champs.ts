// Field builders shared by every document type: French label, one line of help, French error.
import { defineArrayMember, defineField, type FieldDefinition, type PreviewValue } from 'sanity'
import { lienError } from '../validation'

const requis = (title: string) => `« ${title} » est obligatoire.`

/** Filled by the publish action (sanity/actions.ts), never shown. */
export const slugField = (source: string) =>
  defineField({ name: 'slug', type: 'slug', hidden: true, readOnly: true, options: { source } })

export const texte = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'string', validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

export const paragraphe = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'text', rows: 4, validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

export const nombre = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'number', validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

export const liste = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: 'array', of: [defineArrayMember({ type: 'string' })] })

export const lien = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({
    name, title, description, type: 'string',
    validation: r => r.custom((v?: string) => (!v ? (obligatoire ? requis(title) : true) : (lienError(v) ?? true))),
  })

export const image = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'image', options: { hotspot: true }, validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

/** A PDF, uploaded or already online elsewhere. */
export const pdf = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({
    name, title, description, type: 'object',
    fields: [
      defineField({ name: 'fichier', title: 'Fichier PDF', type: 'file', options: { accept: 'application/pdf' } }),
      lien('lien', 'Ou un lien vers le PDF', 'Seulement si le PDF est déjà en ligne ailleurs. Exemple : https://www.judo-quebec.qc.ca/…'),
    ],
    validation: r => r.custom((v?: { fichier?: unknown; lien?: string }) =>
      obligatoire && !v?.fichier && !v?.lien ? 'Ajoutez un fichier PDF ou un lien.' : true),
  })

/** A list of objects, each shown in the list as `select.title` / `select.subtitle` (or what `prepare` builds from `select`). */
export const objets = (
  name: string, title: string, description: string | undefined, fields: FieldDefinition[],
  select: Record<string, string>, prepare?: (v: Record<string, any>) => PreviewValue,
) =>
  defineField({ name, title, description, type: 'array', of: [defineArrayMember({ type: 'object', fields, preview: { select, prepare } })] })

export const documentPdf = (name: string, title: string, description?: string) =>
  objets(name, title, description, [
    texte('titre', 'Titre', 'Exemple : « Formulaire d’inscription 2026-2027 »', true),
    pdf('pdf', 'Document', undefined, true),
  ], { title: 'titre' })

/** Puts fields in a form tab. */
export const groupe = <T extends object>(group: string, fields: T[]) => fields.map(f => ({ ...f, group }))
