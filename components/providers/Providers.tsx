'use client'
import { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Native scroll on purpose: the tour hero eases its own video time, and a
// second smoothing layer would make the scrub lag behind the wheel.
gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>
}
