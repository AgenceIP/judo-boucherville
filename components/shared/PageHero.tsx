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

export default function PageHero({ title, subtitle, tag, tagColor = 'text-gold' }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Entrance animation
    const tl = gsap.timeline({ delay: 0.1 })
    if (!contentRef.current) return
    tl.from(contentRef.current.children, {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    })

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
          <span className={`text-[11px] tracking-[.4em] uppercase ${tagColor} block mb-5`}>
            {tag}
          </span>
        )}
        <h1
          className="font-heading text-white tracking-tight leading-[.88]"
          style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted text-lg mt-6 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
