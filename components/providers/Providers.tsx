'use client'
import { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  )
}
