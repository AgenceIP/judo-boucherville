'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import gsap from 'gsap'
import { programmePreviews } from '@/lib/previews'

type Props = {
  titre: string
  description: string
  horaire: string
  slug: string
  categorie: 'enfants' | 'adultes' | 'arts-martiaux'
  icon?: string
}

const categoryLabel: Record<string, string> = {
  enfants: 'Enfants',
  adultes: 'Adultes',
  'arts-martiaux': 'Arts martiaux',
}

export default function ProgrammeCard({ titre, description, horaire, slug, categorie }: Props) {
  const locale = useLocale()
  const previewRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const image = programmePreviews[slug]

  // The cinematic still chases the cursor while the row is hovered
  useEffect(() => {
    const el = previewRef.current
    if (!el || !image) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
    const rot = gsap.quickTo(el, 'rotation', { duration: 0.6, ease: 'power3.out' })
    let lastX = 0
    const onMove = (e: MouseEvent) => {
      x(e.clientX + 28)
      y(e.clientY - 120)
      rot(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.45))
      lastX = e.clientX
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [image])

  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    gsap.to(el, {
      opacity: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.92,
      duration: 0.35,
      ease: 'power3.out',
    })
    if (hovered) {
      gsap.fromTo(el.querySelector('img'),
        { clipPath: 'inset(10% 0% 10% 0%)', scale: 1.08 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.45, ease: 'power3.out' }
      )
    }
  }, [hovered])

  return (
    <>
      {image && (
        <div
          ref={previewRef}
          className="fixed top-0 left-0 z-[60] w-44 h-60 overflow-hidden pointer-events-none opacity-0 hidden md:block"
          aria-hidden="true"
        >
          <Image src={image} alt="" fill sizes="176px" className="object-cover" />
        </div>
      )}
      <Link
        href={`/${locale}/programmes/${slug}`}
        className="group flex items-center gap-6 border-t border-white/[0.06] py-5 transition-all duration-300 hover:border-royal/30 hover:pl-3"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-4">
            <h3 className="font-heading text-xl text-white tracking-wide group-hover:text-royal transition-colors duration-200">
              {titre}
            </h3>
            <span className="text-[10px] text-muted tracking-[.2em] uppercase shrink-0">
              {categoryLabel[categorie]}
            </span>
          </div>
          <p className="text-muted text-sm mt-1 leading-relaxed line-clamp-1">{description}</p>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-sm text-muted tabular-nums">{horaire}</p>
        </div>
        <span className="shrink-0 text-muted group-hover:text-royal group-hover:translate-x-1 transition-all duration-200 text-lg">
          →
        </span>
      </Link>
    </>
  )
}
