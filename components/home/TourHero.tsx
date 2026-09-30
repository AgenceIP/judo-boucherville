'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Magnetic from '@/components/ui/Magnetic'
import { photosSite } from '@/data/photos'
import './tour.css'

const VIDEO_URL = '/hero/tour.mp4'
const VIDEO_BYTES = 6396146 // fallback when Content-Length is missing
const POSTER = '/hero/tour-poster.jpg'
const ENDING = '/hero/tour-ending.jpg'
// Phones: a portrait screen crops the 16:9 tour to its center, so the last beat
// dissolves into the real vertical photo of the logo wall, whole and sharp.
const ENDING_PHONE = photosSite.murCjb.src
const PHONE = '(max-width: 720px)'

// Scroll progress → video time. Motion-equalized from the footage's own
// frame-difference curve (50% linear), so the fast tilt at 2.5–4.5 s gets
// more scroll distance and every stretch of the tour feels equally calm.
const KNOTS: [number, number][] = [[0, 0], [0.0261, 0.5], [0.0555, 1], [0.086, 1.5], [0.1147, 2], [0.1474, 2.5], [0.1962, 3], [0.2622, 3.5], [0.335, 4], [0.4019, 4.5], [0.4531, 5], [0.4945, 5.5], [0.536, 6], [0.5813, 6.5], [0.63, 7], [0.6773, 7.5], [0.7242, 8], [0.7692, 8.5], [0.8101, 9], [0.8488, 9.5], [0.8848, 10], [0.9159, 10.5], [0.9465, 11], [0.9761, 11.5], [1, 12]]

// Static hero only where the tour can't work: phones held sideways (no height for
// it) and reduced motion. Must match tour.css character for character.
const GATES = [
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
]

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}
function timeAt(p: number) {
  for (let i = 1; i < KNOTS.length; i++) {
    const [p1, t1] = KNOTS[i]
    if (p <= p1) {
      const [p0, t0] = KNOTS[i - 1]
      return t0 + (t1 - t0) * ((p - p0) / (p1 - p0 || 1))
    }
  }
  return KNOTS[KNOTS.length - 1][1]
}
function rng(seed: number) {
  let s = seed >>> 0
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}

type Copy = {
  place: string; title: [string, string]; since: string
  season: string; hajime: string; hajimeSub: string
  find: string; register: string; skip: string; loading: string
}

export default function TourHero({ locale, copy }: { locale: string; copy: Copy }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current!
    const stage = root.querySelector<HTMLElement>('.tour-stage')!
    const video = root.querySelector<HTMLVideoElement>('video')!
    const startLayer = root.querySelector<HTMLElement>('.tour-layer--start')!
    const ring = root.querySelector<HTMLElement>('.tour-ring circle')!
    const bands = [...root.querySelectorAll<HTMLElement>('.band')].map(el => ({
      el,
      a: Number(el.dataset.a),
      b: Number(el.dataset.b),
      ramp: el.dataset.ramp ? Number(el.dataset.ramp) : 0,
      op: -1,
      k: -1,
      live: false,
    }))

    let target = 0, shown = 0, rafId: number | null = null, lastTick = 0
    let onScreen = true, scrubOn = false, heroInit = false, videoOk = false
    let seekBusy = false, pendingTime: number | null = null
    let lastEnd = -1
    const phoneMq = window.matchMedia(PHONE)
    let lastLanded: boolean | null = null
    const loadStart = performance.now()

    const progress = () => {
      const r = root.getBoundingClientRect()
      return clamp(-r.top / (r.height - window.innerHeight), 0, 1)
    }

    function requestSeek(t: number) {
      if (!videoOk || !video.duration) return
      t = Math.min(t, video.duration - 0.05)
      if (seekBusy) { pendingTime = t; return }
      seekBusy = true
      video.currentTime = t
    }
    video.addEventListener('seeked', () => {
      seekBusy = false
      if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t) }
    })
    video.addEventListener('error', () => { seekBusy = false; pendingTime = null; failVideo() })

    function updateCaptions(p: number, now: number) {
      const loadK = clamp((now - loadStart) / 1400, 0, 1)
      bands.forEach((band, i) => {
        const { a, b } = band
        const f = Math.min(0.02, (b - a) / 3)
        const first = i === 0, last = i === bands.length - 1
        const op = (first ? 1 : smoothstep(p, a, a + f)) * (last ? 1 : 1 - smoothstep(p, b - f, b))
        let k = clamp((p - a) / (band.ramp || Math.min(0.025, (b - a) * 0.35)), 0, 1)
        if (first) k = Math.max(k, 1 - Math.pow(1 - loadK, 3))
        if (Math.abs(op - band.op) > 0.004) { band.op = op; band.el.style.opacity = op.toFixed(3) }
        if (Math.abs(k - band.k) > 0.008 || (k === 1 && band.k !== 1)) { band.k = k; band.el.style.setProperty('--k', k.toFixed(3)) }
        const live = op > 0.5
        if (live !== band.live) { band.live = live; band.el.classList.toggle('live', live) }
      })
      // Still-image stand-in until the video is ready (or if it never is)
      const landed = p > 0.8
      if (landed !== lastLanded) { lastLanded = landed; stage.classList.toggle('landed', landed) }
      const end = videoOk ? (phoneMq.matches ? smoothstep(p, 0.86, 0.94) : 0) : smoothstep(p, 0.8, 0.9)
      if (Math.abs(end - lastEnd) > 0.01) { lastEnd = end; stage.style.setProperty('--end', end.toFixed(2)) }
    }

    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now))
      lastTick = now
      shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667))
      const loading = now - loadStart < 1500
      if (Math.abs(target - shown) < 0.0005 && !loading) {
        shown = target; rafId = null; lastTick = 0
      } else {
        rafId = requestAnimationFrame(tick)
      }
      requestSeek(timeAt(shown))
      updateCaptions(shown, now)
    }
    const wake = () => { if (rafId === null && onScreen && scrubOn) rafId = requestAnimationFrame(tick) }
    const onScroll = () => { target = progress(); wake() }

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) onScroll() })
    io.observe(root)

    // Poster first, then the streamed Blob behind an honest ring
    let started = false
    async function loadHeroBlob() {
      const ctrl = new AbortController()
      let watchdog = setTimeout(() => ctrl.abort(), 20000)
      const res = await fetch(VIDEO_URL, { priority: 'low', signal: ctrl.signal } as RequestInit)
      if (!res.ok || !res.body) throw new Error('video')
      const total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES
      const reader = res.body.getReader()
      const chunks: BlobPart[] = []
      let got = 0, lastRing = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        clearTimeout(watchdog)
        watchdog = setTimeout(() => ctrl.abort(), 20000)
        chunks.push(value)
        got += value.length
        const frac = Math.min(1, got / total)
        const now = performance.now()
        if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.strokeDashoffset = String(Math.round(126 * (1 - frac))) }
      }
      clearTimeout(watchdog)
      ring.style.strokeDashoffset = '0'
      video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))
      video.load()
      video.addEventListener('canplay', () => {
        videoOk = true
        // iOS paints no frame for a video that has never played: one silent play/pause wakes it
        video.play().then(() => video.pause()).catch(() => {})
        requestSeek(timeAt(shown))
        stage.classList.add('video-ready')
        lastEnd = -1
        updateCaptions(shown, performance.now())
      }, { once: true })
    }
    function failVideo() {
      videoOk = false
      stage.classList.add('video-failed')
    }
    function startBlobFetch() {
      if (started) return
      started = true
      loadHeroBlob().catch(failVideo)
    }
    function initHeroOnce() {
      if (heroInit) return
      heroInit = true
      startLayer.style.backgroundImage = `url('${POSTER}')`
      setEndImage()
      const img = new window.Image()
      img.onload = startBlobFetch
      img.onerror = startBlobFetch
      img.src = POSTER
      setTimeout(startBlobFetch, 4000)
    }

    function enableScrub() {
      if (scrubOn) return
      scrubOn = true
      initHeroOnce()
      window.addEventListener('scroll', onScroll, { passive: true })
      bands.forEach(b => { b.op = -1; b.k = -1 })
      target = shown = progress()
      updateCaptions(shown, performance.now())
      onScroll()
    }
    function disableScrub() {
      if (!scrubOn) return
      scrubOn = false
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
    }
    function setEndImage() {
      root.querySelector<HTMLElement>('.tour-layer--end')!.style.backgroundImage = `url('${phoneMq.matches ? ENDING_PHONE : ENDING}')`
      lastEnd = -1
    }
    const onPhoneChange = () => { if (heroInit) { setEndImage(); updateCaptions(shown, performance.now()) } }
    phoneMq.addEventListener('change', onPhoneChange)

    const MQLS = GATES.map(q => window.matchMedia(q))
    const applyHeroMode = () => (MQLS.some(m => m.matches) ? disableScrub() : enableScrub())
    MQLS.forEach(m => m.addEventListener('change', applyHeroMode))
    applyHeroMode()

    return () => {
      disableScrub()
      io.disconnect()
      MQLS.forEach(m => m.removeEventListener('change', applyHeroMode))
      phoneMq.removeEventListener('change', onPhoneChange)
      if (video.src.startsWith('blob:')) URL.revokeObjectURL(video.src)
    }
  }, [])

  // Split once, seeded, so the "random" offsets are identical on every load
  const r = rng(1970)
  const titleChars = copy.title.map(line => line.split(' ').map(word => [...word]))
  const totalChars = titleChars.flat(2).length
  let ci = 0

  return (
    <section aria-label={copy.title.join(' ')}>
      <div ref={rootRef} className="tour-scrub">
        <div className="tour-stage">
          <div className="tour-layer tour-layer--start" aria-hidden="true" />
          <video className="tour-video" preload="none" muted playsInline aria-hidden="true" tabIndex={-1} />
          <div className="tour-layer tour-layer--end" aria-hidden="true" />

          <div className="band band-1" data-a="0" data-b="0.14">
            <p className="label text-ink mb-5">{copy.place}</p>
            <h1 className="title">
              <span className="sr-only">{copy.title.join(' ')}</span>
              <span aria-hidden="true">
                {titleChars.map((words, li) => (
                  <span key={li} className="line">
                    {words.map((chars, wi) => (
                      <span key={wi} className="whitespace-nowrap">
                        {chars.map((ch, k) => {
                          const i = ci++
                          const style = {
                            '--th': (i / totalChars) * 0.55 + r() * 0.06,
                            '--jx': `${(li % 2 ? 1 : -1) * (40 + r() * 60)}px`,
                          } as React.CSSProperties
                          return <span key={k} className="c" style={style}>{ch}</span>
                        })}
                        {wi < words.length - 1 && ' '}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </h1>
            <p className="mt-6 text-[1.05rem] font-semibold text-ink">{copy.since}</p>
          </div>

          <div className="band band-4" data-a="0.84" data-b="1" data-ramp="0.08">
            <div className="left">
              <p className="label text-ink mb-3">{copy.season}</p>
              <p className="hajime">
                <span className="w" style={{ '--th': 0 } as React.CSSProperties}>{copy.hajime}</span>
              </p>
              <p className="sub mt-4 text-ink text-[1.1rem] leading-snug font-semibold max-w-[26ch]">{copy.hajimeSub}</p>
            </div>
            <div className="right">
              <Magnetic strength={0.3}><a href="#trouver" className="btn btn-primary">{copy.find} <ArrowRight size={16} aria-hidden="true" className="arr" /></a></Magnetic>
              <Link href={`/${locale}/inscription`} className="btn btn-ghost">{copy.register}</Link>
            </div>
          </div>

          <div className="tour-ring" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(11,27,56,.15)" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="126" strokeDashoffset="126" transform="rotate(-90 24 24)" />
            </svg>
            <span className="label">{copy.loading}</span>
          </div>
          <a href="#trouver" className="tour-skip btn btn-panel !py-3 !text-[.88rem]">{copy.skip}</a>
        </div>
      </div>

      {/* Phones, portrait tablets, reduced motion: the arrival, composed */}
      <div className="tour-static pt-16">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
          <Image src={ENDING} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="px-4 py-8 max-w-xl">
          <p className="label text-blue mb-3">{copy.season} · {copy.place}</p>
          <h1 className="font-display uppercase text-[2.6rem] leading-[1] text-ink">
            {copy.hajime}
          </h1>
          <p className="mt-4 text-[1.1rem] font-semibold leading-snug text-ink">{copy.hajimeSub}</p>
          <p className="mt-3 text-ink-2">{copy.title.join(' ')}. {copy.since}</p>
          <div className="mt-6 grid gap-3 sm:flex">
            <a href="#trouver" className="btn btn-primary">{copy.find}</a>
            <Link href={`/${locale}/inscription`} className="btn btn-ghost">{copy.register}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
