'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InkCanvas from '@/components/voie/InkCanvas'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

/**
 * Internal page hero — poster-light: huge wide type on paper, a cobalt tag,
 * and the living ink under the cursor. Closed by a thick black rule.
 */
export default function PageHero({ title, subtitle, tag, tagColor = 'text-royal' }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.15 })

    if (titleRef.current) {
      tl.from(titleRef.current, {
        yPercent: 105,
        duration: 1.1,
        ease: 'power4.out',
      })
    }
    tl.from('.hero-meta', {
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6')

    gsap.to(contentRef.current, {
      yPercent: 18,
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
      className="relative min-h-[42vh] flex flex-col justify-end pt-36 pb-14 overflow-hidden border-b-[3px] border-foreground"
    >
      {/* The cursor inks cobalt into the paper */}
      <InkCanvas color={[0.11, 0.25, 1.0]} maxAlpha={0.5} />

      <div ref={contentRef} className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {tag && (
          <span className={`hero-meta font-heading text-sm md:text-base ${tagColor} block mb-5`}>
            {tag}
          </span>
        )}
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="voie-title font-heading text-foreground leading-[.92]"
            style={{ fontSize: 'clamp(38px, 6.6vw, 96px)' }}
          >
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="hero-meta text-base md:text-lg font-medium mt-6 max-w-2xl leading-snug text-muted">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
