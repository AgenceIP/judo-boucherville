'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  title: string
  subtitle?: string
  tag?: string
  tagColor?: string
}

export default function PageHero({ title, subtitle, tag, tagColor = 'text-royal' }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.15 })

    // Title rises out of its clipped wrapper — masked block reveal
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

    // Parallax on scroll
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
    <section ref={sectionRef} className="pt-36 pb-20 bg-black border-b border-white/[0.06] overflow-hidden">
      <div ref={contentRef} className="max-w-7xl mx-auto px-6 lg:px-12">
        {tag && (
          <span className={`hero-meta text-[11px] tracking-[.4em] uppercase ${tagColor} block mb-5`}>
            {tag}
          </span>
        )}
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="font-heading text-white tracking-tight leading-[.88]"
            style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}
          >
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="hero-meta text-muted text-lg mt-6 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
