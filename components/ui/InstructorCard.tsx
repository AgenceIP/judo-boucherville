'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'

type Props = {
  nom: string
  grade: string
  role?: string
  disciplines: string[]
  slug: string
  photoSrc?: string
}

export default function InstructorCard({ nom, grade, role, disciplines, slug, photoSrc }: Props) {
  const [flipped, setFlipped] = useState(false)
  const locale = useLocale()

  return (
    <div
      className="relative h-64 cursor-pointer perspective-1000"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-transform duration-500"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-bg-surface border border-white/5 rounded-2xl overflow-hidden">
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={nom}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-bg-surface to-accent-blue/10 flex items-center justify-center">
              <span className="font-heading text-6xl text-accent-blue/30">
                {nom.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-heading text-lg text-foreground">{nom}</p>
            <p className="text-accent-blue text-sm">{grade}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-accent-blue/10 border border-accent-blue/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <p className="font-heading text-lg text-foreground">{nom}</p>
            <p className="text-accent-blue text-sm mb-3">{grade}</p>
            {role && <p className="text-muted text-xs mb-2">{role}</p>}
            <div className="flex flex-wrap gap-1">
              {disciplines.map(d => (
                <span key={d} className="text-xs bg-white/5 text-muted px-2 py-1 rounded-full">{d}</span>
              ))}
            </div>
          </div>
          <Link
            href={`/${locale}/equipe/${slug}`}
            className="text-sm text-accent-blue hover:text-accent-glow transition-colors"
          >
            Voir le profil →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
