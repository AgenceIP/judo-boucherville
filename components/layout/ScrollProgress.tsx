'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * A royal hairline at the very top of internal pages, filling with reading
 * progress. The homepage has the belt rail instead, so it stays out of there.
 */
export default function ScrollProgress() {
  const pathname = usePathname()
  const fillRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  const isHome = /^\/(fr|en)\/?$/.test(pathname)

  useEffect(() => {
    setShow(!isHome)
  }, [isHome])

  useEffect(() => {
    if (!show) return
    const fill = fillRef.current
    if (!fill) return
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => gsap.set(fill, { scaleX: self.progress }),
    })
    return () => st.kill()
  }, [show, pathname])

  if (!show) return null

  return (
    <div className="fixed top-0 inset-x-0 z-[70] h-[2px] pointer-events-none">
      <div ref={fillRef} className="h-full bg-royal origin-left scale-x-0" />
    </div>
  )
}
