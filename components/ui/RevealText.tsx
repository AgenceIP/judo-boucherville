'use client'
import { useRef, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText)

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** 'lines' for paragraphs, 'words' for big headlines */
  split?: 'lines' | 'words'
  delay?: number
  style?: React.CSSProperties
}

/**
 * Masked text reveal — content slides up out of clipped line containers
 * when it enters the viewport. Falls back to plain text if reduced motion.
 */
export default function RevealText({
  children,
  as: Tag = 'h2',
  className,
  split = 'words',
  delay = 0,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('is-revealed'); return }

    const splitInstance = SplitText.create(el, {
      type: split === 'lines' ? 'lines' : 'lines,words',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => {
        const tween = gsap.from(split === 'lines' ? self.lines : self.words, {
          yPercent: 110,
          duration: 0.8,
          stagger: split === 'lines' ? 0.08 : 0.04,
          ease: 'power4.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 94%',
            once: true,
          },
        })
        // words now sit below their masks, so the heading can stop being hidden (see globals.css)
        el.classList.add('is-revealed')
        return tween
      },
    })

    return () => splitInstance.revert()
  }, { scope: ref })

  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style} data-reveal="">
      {children}
    </Tag>
  )
}
