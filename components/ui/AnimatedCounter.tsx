'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2 }: Props) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const obj = { val: 0 }
    const anim = gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      snap: { val: 1 },
      onUpdate: () => setValue(Math.round(obj.val)),
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        once: true,
      },
    })
    return () => { anim.kill() }
  }, [end, duration])

  return (
    <span ref={ref}>
      {prefix}{value}{suffix}
    </span>
  )
}
