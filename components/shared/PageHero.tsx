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

/**
 * Inner page header: title and one line of context on the wall-white canvas,
 * a photo of the dojo on the side, and a strip of tatami along the bottom edge.
 */
export default function PageHero({ title, subtitle, tag, tagColor = 'text-blue' }: Props) {
  const pathname = usePathname() ?? ''
  const photo = PHOTOS.find(([re]) => re.test(pathname))?.[1] ?? '/images/photos/valeurs-respect.jpg'

  return (
    <section className="relative pt-28 lg:pt-32 pb-12 lg:pb-14 overflow-hidden">
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
        <div className="clip-reveal relative hidden lg:block h-48 rounded-[4px]">
          <Image src={photo} alt="" fill sizes="22rem" className="object-cover" priority />
        </div>
      </div>
      {/* Tatami strip: blue safety area with the yellow contest area in the middle */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2 grid grid-cols-[1fr_2fr_1fr]">
        <span className="bg-blue" /><span className="bg-accent" /><span className="bg-blue" />
      </div>
    </section>
  )
}
