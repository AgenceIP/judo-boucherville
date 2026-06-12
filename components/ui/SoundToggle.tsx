'use client'
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { gong, step, thump, startWhoosh, suspendAll } from '@/lib/dojoSound'

const KEY = 'dojo-son'

/**
 * The dojo's sound, strictly opt-in. When on: a gong bows you in, chapters
 * land with a soft tatami step, thrown letters thump on impact, and the air
 * whispers with your scroll.
 */
export default function SoundToggle() {
  const locale = useLocale()
  const [on, setOn] = useState(false)

  // Restore preference; audio itself still waits for this first gesture
  useEffect(() => {
    if (localStorage.getItem(KEY) === '1') setOn(true)
  }, [])

  useEffect(() => {
    if (!on) return
    const onImpact = (e: Event) => thump((e as CustomEvent).detail?.intensity ?? 1)
    const onChapter = () => step()
    window.addEventListener('dojo:impact', onImpact)
    window.addEventListener('voie:chapter', onChapter)
    startWhoosh()
    return () => {
      window.removeEventListener('dojo:impact', onImpact)
      window.removeEventListener('voie:chapter', onChapter)
      suspendAll()
    }
  }, [on])

  const toggle = () => {
    const next = !on
    setOn(next)
    localStorage.setItem(KEY, next ? '1' : '0')
    if (next) gong()
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="fixed bottom-5 right-5 lg:right-9 z-[80] flex items-center gap-2.5 px-3 py-2 text-[9px] tracking-[.3em] uppercase transition-opacity duration-300 opacity-60 hover:opacity-100"
      style={{ color: 'var(--voie-ink)' }}
      aria-label={locale === 'en' ? 'Toggle dojo sound' : 'Activer le son du dojo'}
    >
      <span className="font-jp text-sm" aria-hidden="true">音</span>
      <span className={on ? '' : 'line-through opacity-60'}>
        {locale === 'en' ? 'Sound' : 'Son'}
      </span>
      <span
        className="block h-1 w-1 rounded-full transition-colors duration-300"
        style={{ background: on ? '#4169E1' : 'var(--voie-ink-muted)' }}
      />
    </button>
  )
}
