'use client'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { useTranslations } from 'next-intl'

const stats = [
  { end: 55, suffix: '+', labelKey: 'stats_years' },
  { end: 245, suffix: '', labelKey: 'stats_members' },
  { end: 37, suffix: '', labelKey: 'stats_gold' },
  { end: 0, suffix: 'AAA', prefix: '', labelKey: 'stats_level', isText: true },
]

export default function StatsSection() {
  const t = useTranslations('home')

  return (
    <section className="py-20 bg-bg-surface border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.labelKey} className="text-center">
              <div className="font-heading text-5xl md:text-6xl lg:text-7xl text-accent-blue">
                {stat.isText
                  ? <span>{stat.suffix}</span>
                  : <AnimatedCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} />
                }
              </div>
              <p className="text-muted text-sm md:text-base mt-2">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
