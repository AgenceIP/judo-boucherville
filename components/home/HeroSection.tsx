'use client'
import { useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText)

const VIDEO_SRC = '/videos/hero.mp4'

export default function HeroSection() {
  const locale = useLocale()
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const desc = locale === 'en'
    ? '55 years of martial tradition. Perfect technique is born from repetition.'
    : '55 ans de tradition martiale. La technique parfaite naît de la répétition.'
  const cue = locale === 'en' ? 'Scroll' : 'Défiler'

  // Scroll-scrubbed video, smoothed with a per-frame lerp so seeks feel cinematic
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let target = 0
    let current = 0

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      target = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
    }

    const tick = () => {
      if (vid.readyState < 2 || !vid.duration) return
      current += (target - current) * (reduced ? 1 : 0.09)
      const desired = current * vid.duration
      if (Math.abs(vid.currentTime - desired) > 0.02) {
        vid.currentTime = desired
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    gsap.ticker.add(tick)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      gsap.ticker.remove(tick)
    }
  }, [])

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const title = titleRef.current
    if (!title) return

    // Masked character rise on the title, then the rest of the content
    SplitText.create(title, {
      type: 'lines,chars',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 112,
          duration: 1.4,
          stagger: 0.028,
          ease: 'power4.out',
          delay: 0.25,
        }),
    })

    gsap.from('.hero-fade', {
      opacity: 0,
      y: 18,
      duration: 1.1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 1.0,
    })

    // Content drifts up and dissolves as the story scrolls on
    gsap.to(contentRef.current, {
      yPercent: -28,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '85% top',
        scrub: true,
      },
    })
  }, { scope: sectionRef })

  return (
    <>
      {/* Fixed video — scrubbed by scroll, persists behind all homepage sections */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>
      {/* Dark overlay — keeps text readable across all sections */}
      <div className="fixed inset-0 -z-10 bg-[#0A0A0A]/10" />

      {/* Hero content */}
      <section
        ref={sectionRef}
        className="relative h-screen flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-20"
      >
        {/* Bottom vignette for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/25 to-transparent pointer-events-none" />

        <div ref={contentRef} className="relative">
          <h1
            ref={titleRef}
            className="font-heading leading-[.88] tracking-tight text-white mb-5"
            style={{ fontSize: 'clamp(68px, 12vw, 148px)' }}
          >
            JUDO<br />
            <span className="text-royal">BOUCHERVILLE</span>
          </h1>
          <p className="hero-fade text-[#999] text-base md:text-lg max-w-lg leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Scroll cue */}
        <div className="hero-fade absolute bottom-10 right-8 md:right-16 lg:right-20 flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[.35em] uppercase text-white/40 [writing-mode:vertical-rl]">
            {cue}
          </span>
          <span className="block w-px h-12 bg-white/30 animate-scroll-cue" />
        </div>
      </section>
    </>
  )
}
