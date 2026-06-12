'use client'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import RevealText from '@/components/ui/RevealText'
import { useReveal } from '@/hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

/** Chapter 05 — Black belt. The destination: 55 years of mastery. */
export default function ChapterNoir() {
  const locale = useLocale()
  const en = locale === 'en'
  const sectionRef = useRef<HTMLElement>(null)
  const linksRef = useReveal<HTMLDivElement>()

  const medals = [
    { value: 84, label: en ? 'Gold' : 'Or' },
    { value: 51, label: en ? 'Silver' : 'Argent' },
    { value: 39, label: en ? 'Bronze' : 'Bronze' },
    { value: 126, label: en ? 'Black belts' : 'Ceintures noires' },
  ]

  const timeline = [
    { year: '1970', text: en ? 'Marcel Bourelly founds the club at centre La Seigneurie.' : 'Marcel Bourelly fonde le club au centre La Seigneurie.' },
    { year: '1995', text: en ? 'First judo sports-studies program in Canada, with École De Mortagne.' : "Premier sport-études judo au Canada, avec l'École De Mortagne." },
    { year: '2008', text: en ? 'Named Regional Development Centre by Judo Québec.' : 'Désigné Centre Régional de Développement par Judo Québec.' },
    { year: '2017', text: en ? 'The Dojo Marcel Bourelly opens.' : 'Inauguration du Dojo Marcel Bourelly.' },
    { year: '2026', text: en ? '245 members. AAA club. Two Olympians.' : '245 membres. Club AAA. Deux olympiens.' },
  ]

  const links = [
    { href: '/equipe', fr: 'Les professeurs', en: 'The instructors' },
    { href: '/ceintures-noires', fr: 'Les 126 ceintures noires', en: 'The 126 black belts' },
    { href: '/historique', fr: "L'histoire complète", en: 'The full history' },
    { href: '/resultats', fr: 'Les résultats', en: 'The results' },
  ]

  useGSAP(() => {
    // Full-bleed dojo: unmask + slow drift inside its frame
    gsap.fromTo('.noir-band',
      { clipPath: 'inset(18% 6% 18% 6%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: '.noir-band', start: 'top 90%', end: 'top 30%', scrub: 0.5 },
      }
    )
    gsap.fromTo('.noir-band img',
      { yPercent: -8, scale: 1.12 },
      {
        yPercent: 8,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: '.noir-band', start: 'top bottom', end: 'bottom top', scrub: true },
      }
    )
    gsap.from('.noir-medal', {
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.noir-medals', start: 'top 80%' },
    })
    gsap.from('.noir-rule', {
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: { trigger: '.noir-timeline', start: 'top 80%', end: 'bottom 65%', scrub: 0.6 },
    })
    gsap.from('.noir-item', {
      opacity: 0,
      x: -20,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.noir-timeline', start: 'top 82%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      data-voie-bg="#0A0A0A"
      data-voie-ink="#FAFAFA"
      data-voie-muted="#888888"
      data-voie-hairline="rgba(250,250,250,0.08)"
      className="relative py-28 md:py-40 overflow-hidden"
    >
      {/* Ghost kanji 道 — the way — mirrors the 始 of the white world */}
      <span
        className="font-jp absolute -left-[6vw] top-24 leading-none select-none pointer-events-none"
        style={{ fontSize: '40vw', color: 'var(--voie-ink)', opacity: 0.04 }}
        aria-hidden="true"
      >
        道
      </span>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <p className="text-[10px] tracking-[.4em] uppercase mb-6" style={{ color: 'var(--voie-ink-muted)' }}>
          <span className="font-jp text-xs mr-3 opacity-60">五</span>
          {en ? 'Chapter 05 · Black belt' : 'Chapitre 05 · Ceinture noire'}
        </p>
        <RevealText
          as="h2"
          className="voie-title font-heading text-[clamp(52px,9vw,120px)] leading-[.9] tracking-tight mb-6"
          style={{ color: 'var(--voie-ink)' }}
        >
          {en ? 'FIFTY-FIVE YEARS OF BLACK.' : 'CINQUANTE-CINQ ANS DE NOIR.'}
        </RevealText>
        <p className="italic text-lg md:text-2xl max-w-xl leading-relaxed mb-20" style={{ color: 'var(--voie-ink-muted)' }}>
          {en
            ? 'The black belt is not the end of the way — it is where it truly begins. Here is what generations of judokas built at Boucherville.'
            : "La ceinture noire n'est pas la fin de la voie — c'est là qu'elle commence vraiment. Voici ce que des générations de judokas ont bâti à Boucherville."}
        </p>
      </div>

      {/* Full-bleed dojo band */}
      <div className="noir-band relative h-[52vh] md:h-[64vh] overflow-hidden mb-24">
        <Image
          src="/images/voie/dojo.jpg"
          alt={en ? 'The Marcel Bourelly dojo at night' : 'Le Dojo Marcel Bourelly, la nuit'}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/30" />
        <p className="absolute bottom-6 left-6 lg:left-12 text-[10px] tracking-[.35em] uppercase text-white/50">
          Dojo Marcel Bourelly — Boucherville
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* Medal wall */}
        <div className="noir-medals grid grid-cols-2 md:grid-cols-4 gap-px mb-24" style={{ background: 'var(--voie-hairline)' }}>
          {medals.map(m => (
            <div key={m.label} className="noir-medal p-8 md:p-10" style={{ background: 'var(--voie-bg)' }}>
              <p className="font-heading text-royal leading-none tabular-nums" style={{ fontSize: 'clamp(48px, 5.5vw, 90px)' }}>
                <AnimatedCounter end={m.value} />
              </p>
              <p className="text-[11px] tracking-[.25em] uppercase mt-3" style={{ color: 'var(--voie-ink-muted)' }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Condensed history */}
          <div className="noir-timeline relative pl-8">
            <div className="noir-rule absolute left-0 top-0 bottom-0 w-px" style={{ background: 'var(--voie-hairline)' }} />
            {timeline.map(item => (
              <div key={item.year} className="noir-item mb-8 last:mb-0">
                <span className="font-heading text-royal text-2xl">{item.year}</span>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--voie-ink-muted)' }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Doors into the black world */}
          <div ref={linksRef} className="reveal-stagger">
            {links.map(l => (
              <Link
                key={l.href}
                href={`/${locale}${l.href}`}
                className="group flex items-center justify-between py-6 border-t transition-colors duration-300"
                style={{ borderColor: 'var(--voie-hairline)' }}
              >
                <span className="font-heading text-2xl md:text-3xl tracking-wide group-hover:text-royal transition-colors duration-200" style={{ color: 'var(--voie-ink)' }}>
                  {en ? l.en : l.fr}
                </span>
                <span className="text-lg group-hover:translate-x-1.5 group-hover:text-royal transition-all duration-200" style={{ color: 'var(--voie-ink-muted)' }}>
                  →
                </span>
              </Link>
            ))}
            <div className="border-t" style={{ borderColor: 'var(--voie-hairline)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
