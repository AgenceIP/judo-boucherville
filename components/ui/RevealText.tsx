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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const splitInstance = SplitText.create(el, {
      type: split === 'lines' ? 'lines' : 'lines,words',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(split === 'lines' ? self.lines : self.words, {
          yPercent: 110,
          duration: 1.1,
          stagger: split === 'lines' ? 0.12 : 0.06,
          ease: 'power4.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }),
    })

    return () => splitInstance.revert()
  }, { scope: ref })

  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style}>
      {children}
    </Tag>
  )
}
