'use client'
import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InkCanvas from '@/components/voie/InkCanvas'
import Aurora from '@/components/voie/Aurora'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

// Each section of the site carries its own ideogram
const KANJI: [RegExp, string][] = [
  [/programmes/, '技'],        // waza — technique
  [/equipe/, '師'],            // shi — master
  [/resultats/, '勝'],         // shō — victory
  [/challenge/, '試'],         // shi — trial
  [/actualites/, '報'],        // hō — news
  [/contact/, '縁'],           // en — bond
  [/inscription/, '入'],       // nyū — to enter
  [/historique/, '歴'],        // reki — history
  [/ceintures-noires/, '帯'],  // obi — belt
  [/conseil/, '議'],           // gi — council
]

/**
 * Internal page hero — the night-world counterpart of the white chapter:
 * royal vapor flows under the cursor, the page's ideogram haunts the right
 * edge, the title rises out of its mask.
 */
export default function PageHero({ title, subtitle, tag, tagColor = 'text-royal' }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [kanji, setKanji] = useState<string | null>(null)

  useEffect(() => {
    const path = window.location.pathname
    setKanji(KANJI.find(([re]) => re.test(path))?.[1] ?? '道')
  }, [])

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.15 })

    if (titleRef.current) {
      tl.from(titleRef.current, {
        yPercent: 105,
        duration: 1.2,
        ease: 'power4.out',
      })
    }
    tl.from('.hero-meta', {
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
    }, '-=0.7')

    gsap.to(contentRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[46vh] flex flex-col justify-end pt-36 pb-16 bg-black border-b border-white/[0.06] overflow-hidden"
    >
      {/* The northern light of the night world */}
      <Aurora opacity={0.6} />

      {/* Ghost ideogram of this section */}
      {kanji && (
        <span
          className="font-jp absolute -right-[2vw] -top-[4vw] leading-none select-none pointer-events-none animate-fade-in"
          style={{ fontSize: '26vw', color: '#FAFAFA', opacity: 0.04 }}
          aria-hidden="true"
        >
          {kanji}
        </span>
      )}

      {/* Royal vapor — the night counterpart of the white world's ink */}
      <InkCanvas color={[0.34, 0.48, 0.98]} maxAlpha={0.4} />

      <div ref={contentRef} className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {tag && (
          <span className={`hero-meta text-[11px] tracking-[.4em] uppercase ${tagColor} block mb-5`}>
            {tag}
          </span>
        )}
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="voie-title font-heading text-white tracking-tight leading-[.88]"
            style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}
          >
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="hero-meta italic text-lg md:text-xl mt-6 max-w-2xl leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
