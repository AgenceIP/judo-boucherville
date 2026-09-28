import Image from 'next/image'
import Link from 'next/link'
import type { Block } from '@/data/archive'

const MEDAL: Record<string, string> = { or: 'bg-[#e8c547]', argent: 'bg-[#c9ced6]', bronze: 'bg-[#c98a4b]' }
const MEDAL_EN: Record<string, string> = { or: 'gold', argent: 'silver', bronze: 'bronze' }

export function Medal({ kind, locale }: { kind: string; locale: string }) {
  return (
    <span
      role="img"
      aria-label={locale === 'fr' ? `médaille d’${kind}` : `${MEDAL_EN[kind]} medal`}
      className={`inline-block w-2.5 h-2.5 rounded-full align-middle mx-1 ${MEDAL[kind]}`}
    />
  )
}

/** Renders medal tokens (⟨or⟩, ⟨argent⟩, ⟨bronze⟩) inside imported text */
function Text({ text, locale }: { text: string; locale: string }) {
  return text.split(/⟨(or|argent|bronze)⟩/).map((part, i) =>
    i % 2 ? <Medal key={i} kind={part} locale={locale} /> : part
  )
}

export default function Blocks({ blocks, locale, alt }: { blocks: Block[]; locale: string; alt: string }) {
  return (
    <div className="space-y-2 min-w-0">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h':
            return <h4 key={i} className="text-[.78rem] text-muted uppercase tracking-[.25em] pt-4"><Text text={b.text} locale={locale} /></h4>
          case 'p':
            return <p key={i} className="text-sm text-ink/80 leading-relaxed break-words"><Text text={b.text} locale={locale} /></p>
          case 'img': {
            const logo = b.src.includes('/Logo/')
            return (
              <Image
                key={i}
                src={b.src}
                width={b.w}
                height={b.h}
                alt={alt}
                sizes={logo ? '96px' : '(min-width: 1024px) 640px, 100vw'}
                className={logo ? 'h-20 w-auto object-contain my-2' : 'w-full max-w-xl h-auto my-3'}
              />
            )
          }
          case 'a':
            return b.href.startsWith('/')
              ? <Link key={i} href={`/${locale}${b.href}`} className="inline-block text-sm text-accent-blue hover:underline mr-3">{b.text}</Link>
              : <a key={i} href={b.href} target="_blank" rel="noopener noreferrer" className="inline-block py-3 text-sm text-accent-blue hover:underline mr-3 break-all">{b.text} ↗</a>
          case 'm':
            return (
              <p key={i} className="text-sm text-muted pt-2 tabular-nums">
                <Medal kind="or" locale={locale} />{b.o}
                <Medal kind="argent" locale={locale} />{b.a}
                <Medal kind="bronze" locale={locale} />{b.b}
              </p>
            )
        }
      })}
    </div>
  )
}
