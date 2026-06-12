'use client'
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

export default function InstructorCard({ nom, grade, role, slug, photoSrc }: Props) {
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/equipe/${slug}`}
      className="group block border-t border-foreground/20 pt-5 pb-6 hover:border-royal/30 transition-colors duration-300"
    >
      <div className="relative h-56 mb-4 overflow-hidden bg-foreground/[0.05]">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={nom}
            fill
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-[80px] leading-none text-foreground/[0.06] select-none">
              {nom.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
      </div>
      <p className="font-heading text-lg text-foreground tracking-wide group-hover:text-royal transition-colors duration-200 leading-tight">
        {nom}
      </p>
      <p className="text-muted text-sm mt-0.5">{grade}{role ? ` · ${role}` : ''}</p>
    </Link>
  )
}
