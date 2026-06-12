'use client'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

type YearGroup = { annee: number; noms: string[] }
type Star = {
  name: string
  year: number
  x: number // 0..1 along the timeline
  y: number // 0..1 vertical
  r: number
  phase: number
}

// Deterministic hash so each belt keeps its place in the sky forever
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

/**
 * Fifty-five years of black belts as a night sky. Each star is a real name;
 * time runs left to right from the founder's star. Move through the sky to
 * read the lineage — a constellation no other club has.
 */
export default function BlackBeltConstellation({ ceintures }: { ceintures: YearGroup[] }) {
  const locale = useLocale()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<{ name: string; year: number; cx: number; cy: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const years = ceintures.map(c => c.annee)
    const minY = Math.min(...years)
    const maxY = Math.max(...years)

    const stars: Star[] = []
    for (const { annee, noms } of ceintures) {
      for (const nom of noms) {
        const h1 = hash(nom)
        const h2 = hash(nom + annee)
        stars.push({
          name: nom,
          year: annee,
          x: 0.06 + 0.92 * ((annee - minY) / (maxY - minY)) + (h1 - 0.5) * 0.014,
          y: 0.14 + 0.72 * h2,
          r: 1.3 + h1 * 1.6,
          phase: h1 * Math.PI * 2,
        })
      }
    }
    // The founder — the origin star
    const founder: Star = { name: 'Marcel Bourelly', year: 1970, x: 0.025, y: 0.45, r: 3.4, phase: 0 }

    // Constellation lines: each star linked to its nearest elder
    const links: [Star, Star][] = []
    for (const s of stars) {
      const elders = stars.filter(o => o.year < s.year)
      const pool = elders.length ? elders : [founder]
      let best: Star = pool[0]
      let bestD = Infinity
      for (const o of pool) {
        const d = (o.x - s.x) ** 2 + ((o.y - s.y) * 0.6) ** 2
        if (d < bestD) { bestD = d; best = o }
      }
      links.push([best, s])
    }
    const firstGen = stars.filter(s => s.year === minY)
    for (const s of firstGen) links.push([founder, s])

    let W = 0, H = 0, dpr = 1
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = wrap.clientWidth
      H = wrap.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
    }
    resize()
    window.addEventListener('resize', resize)

    let mx = -1, my = -1
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mx = e.clientX - r.left
      my = e.clientY - r.top
    }
    const onLeave = () => { mx = -1; my = -1; setHovered(null) }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    const px = (s: Star) => ({ X: s.x * W, Y: s.y * H })
    let raf = 0
    let t = 0
    let lastHover: string | null = null

    const draw = () => {
      raf = requestAnimationFrame(draw)
      t += reduced ? 0 : 0.016
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Find the star under the pointer
      let near: Star | null = null
      let nearD = 26 ** 2
      if (mx >= 0) {
        for (const s of [...stars, founder]) {
          const { X, Y } = px(s)
          const d = (X - mx) ** 2 + (Y - my) ** 2
          if (d < nearD) { nearD = d; near = s }
        }
      }

      // Lineage lines
      ctx.lineWidth = 1
      for (const [a, b] of links) {
        const A = px(a), B = px(b)
        const lit = near && (a === near || b === near)
        ctx.strokeStyle = lit ? 'rgba(65,105,225,0.65)' : 'rgba(250,250,250,0.05)'
        ctx.beginPath()
        ctx.moveTo(A.X, A.Y)
        ctx.lineTo(B.X, B.Y)
        ctx.stroke()
      }

      // Stars
      for (const s of stars) {
        const { X, Y } = px(s)
        const tw = reduced ? 1 : 0.72 + 0.28 * Math.sin(t * 1.6 + s.phase)
        const isNear = near === s
        const sameYear = near && near !== founder && s.year === near.year
        ctx.beginPath()
        ctx.arc(X, Y, isNear ? s.r + 2.4 : s.r, 0, Math.PI * 2)
        ctx.fillStyle = isNear
          ? '#FFFFFF'
          : sameYear
            ? 'rgba(120,150,255,0.95)'
            : `rgba(225,232,255,${0.55 * tw})`
        ctx.fill()
        if (isNear || sameYear) {
          ctx.beginPath()
          ctx.arc(X, Y, (isNear ? 9 : 6), 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(65,105,225,0.5)'
          ctx.stroke()
        }
      }

      // The founder burns steady
      const F = px(founder)
      const g = ctx.createRadialGradient(F.X, F.Y, 0, F.X, F.Y, 26)
      g.addColorStop(0, 'rgba(120,150,255,0.85)')
      g.addColorStop(1, 'rgba(120,150,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(F.X, F.Y, 26, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(F.X, F.Y, founder.r, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()

      const key = near ? near.name : null
      if (key !== lastHover) {
        lastHover = key
        if (near) {
          const { X, Y } = px(near)
          setHovered({ name: near.name, year: near.year, cx: X, cy: Y })
        } else {
          setHovered(null)
        }
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [ceintures])

  return (
    <div ref={wrapRef} className="relative h-[62vh] md:h-[70vh] overflow-hidden border-y border-white/[0.06]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Legend */}
      <div className="absolute top-6 left-6 lg:left-12 pointer-events-none">
        <p className="text-[10px] tracking-[.4em] uppercase text-white/40">
          {locale === 'en' ? 'The lineage — 1970 to today' : 'La lignée — de 1970 à aujourd’hui'}
        </p>
        <p className="italic text-sm text-white/50 mt-2 max-w-xs leading-relaxed">
          {locale === 'en'
            ? 'Every star is a black belt of the club. Move through the sky.'
            : 'Chaque étoile est une ceinture noire du club. Promène-toi dans le ciel.'}
        </p>
      </div>

      {/* Hovered belt */}
      {hovered && (
        <div
          className="absolute pointer-events-none -translate-x-1/2"
          style={{ left: hovered.cx, top: Math.max(8, hovered.cy - 56) }}
        >
          <p className="font-heading text-white text-xl md:text-2xl tracking-wider whitespace-nowrap text-center">
            {hovered.name}
          </p>
          <p className="text-royal text-xs tracking-[.3em] text-center mt-0.5">{hovered.year}</p>
        </div>
      )}
    </div>
  )
}
