'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import RevealText from '@/components/ui/RevealText'

type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

// Each section of the site shows a corner of the real dojo
const PHOTOS: [RegExp, string][] = [
  [/programmes/, '/images/photos/tatami-long.jpg'],
  [/inscription/, '/images/photos/mur-cjb.jpg'],
  [/equipe/, '/images/photos/kano.jpg'],
  [/ceintures-noires/, '/images/photos/ceintures-noires.jpg'],
  [/historique|conseil/, '/images/photos/hauts-grades.jpg'],
  [/contact/, '/images/photos/entree.jpg'],
  [/resultats|athletes|challenge/, '/images/photos/mur-cjb-loin.jpg'],
]

// ...and a brushed ideogram behind the title. A new kanji must also be added to
// public/fonts/yuji-boku-kanji.woff2, which holds only the ones in use.
const KANJI: [RegExp, string][] = [
  [/programmes/, '技'],           // waza, technique
  [/inscription/, '始'],          // hajime, begin
  [/equipe/, '師'],               // shi, teacher
  [/ceintures-noires/, '段'],     // dan, grade
  [/historique/, '歴'],           // reki, history
  [/conseil/, '和'],              // wa, harmony
  [/contact/, '礼'],              // rei, the bow
  [/resultats|athletes/, '勝'],   // shō, victory
  [/challenge/, '挑'],            // idomu, to take on a challenge
  [/calendrier/, '暦'],           // koyomi, calendar
  [/actualites|journaux/, '新'],  // shin, new
  [/telechargements/, '書'],      // sho, writing
]

/**
 * Inner page header: title and one line of context on the wall-white canvas,
 * a photo of the dojo on the side, and a strip of tatami along the bottom edge.
 */
export default function PageHero({ title, subtitle, tag, tagColor = 'text-blue' }: Props) {
  const pathname = usePathname() ?? ''
  const photo = PHOTOS.find(([re]) => re.test(pathname))?.[1] ?? '/images/photos/valeurs-respect.jpg'
  const kanji = KANJI.find(([re]) => re.test(pathname))?.[1] ?? '柔'

  return (
    <section data-kanji={kanji} data-flip className="relative isolate pt-28 lg:pt-32 pb-12 lg:pb-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-[1fr_22rem] gap-10 items-end">
        <div>
          {tag && <span className={`label ${tagColor} block mb-4`}>{tag}</span>}
          <RevealText as="h1" className="display text-ink text-[clamp(3rem,7vw,6rem)]">
            {title}
          </RevealText>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-[1.1rem] leading-relaxed text-ink-2">{subtitle}</p>
          )}
        </div>
        <div className="clip-reveal relative h-44 sm:h-56 lg:h-48 rounded-[4px]">
          <Image src={photo} alt="" fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" priority />
        </div>
      </div>
      {/* Tatami strip: blue safety area with the yellow contest area in the middle */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2 grid grid-cols-[1fr_2fr_1fr]">
        <span className="bg-blue" /><span className="bg-accent" /><span className="bg-blue" />
      </div>
    </section>
  )
}
