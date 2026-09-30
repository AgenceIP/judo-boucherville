import { Fragment, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Bloc } from '@/lib/content/types'
import { Medal } from './Medal'

type Block = Extract<Bloc, { _type: 'block' }>

/** The href if the whole line is one link, like the old « a » blocks. */
function lienSeul(b: Block) {
  const [d] = b.markDefs ?? []
  return b.markDefs?.length === 1 && b.children.every(c => c._type !== 'span' || c.marks?.includes(d._key)) ? d.href : null
}

function Enfants({ b, locale, liens }: { b: Block; locale: string; liens: boolean }) {
  return b.children.map(c => {
    if (c._type === 'medaille') return <Medal key={c._key} kind={c.kind} locale={locale} />
    let n: ReactNode = c.text
    if (c.marks?.includes('strong')) n = <strong>{n}</strong>
    const href = liens && b.markDefs?.find(d => c.marks?.includes(d._key))?.href
    if (href) n = href.startsWith('/')
      ? <Link href={`/${locale}${href}`} className="text-accent-blue hover:underline">{n}</Link>
      : <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">{n} ↗</a>
    return <Fragment key={c._key}>{n}</Fragment>
  })
}

export default function Contenu({ contenu, locale, alt }: { contenu: Bloc[]; locale: string; alt: string }) {
  return (
    <div className="space-y-2 min-w-0">
      {contenu.map(b => {
        if (b._type === 'bilanMedailles') return (
          <p key={b._key} className="text-sm text-muted pt-2 tabular-nums">
            <Medal kind="or" locale={locale} />{b.or ?? 0}
            <Medal kind="argent" locale={locale} />{b.argent ?? 0}
            <Medal kind="bronze" locale={locale} />{b.bronze ?? 0}
          </p>
        )
        if (b._type === 'image') return b.petit
          ? <Image key={b._key} src={b.src} width={b.w} height={b.h} alt={alt} sizes="96px" className="h-20 w-auto object-contain my-2" />
          : <Image key={b._key} src={b.src} width={b.w} height={b.h} alt={alt} sizes="(min-width: 1024px) 640px, 100vw" className="w-full max-w-xl h-auto my-3" />
        const href = lienSeul(b)
        if (href) return href.startsWith('/')
          ? <Link key={b._key} href={`/${locale}${href}`} className="inline-block text-sm text-accent-blue hover:underline mr-3"><Enfants b={b} locale={locale} liens={false} /></Link>
          : <a key={b._key} href={href} target="_blank" rel="noopener noreferrer" className="inline-block py-3 px-1 text-sm text-accent-blue hover:underline mr-2 break-all"><Enfants b={b} locale={locale} liens={false} /> ↗</a>
        return b.style === 'h4'
          ? <h4 key={b._key} className="text-[.78rem] text-muted uppercase tracking-[.25em] pt-4"><Enfants b={b} locale={locale} liens /></h4>
          : <p key={b._key} className="text-sm text-ink/80 leading-relaxed break-words"><Enfants b={b} locale={locale} liens /></p>
      })}
    </div>
  )
}
