'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const t = useTranslations('challenge')
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setTime(getTimeLeft(targetDate))
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const units = [
    { value: time.days, label: t('countdown_days') },
    { value: time.hours, label: t('countdown_hours') },
    { value: time.minutes, label: t('countdown_minutes') },
    { value: time.seconds, label: t('countdown_seconds') },
  ]

  return (
    <div className="flex gap-4 md:gap-8 justify-center">
      {units.map(u => (
        <div key={u.label} className="text-center">
          <div className="font-heading text-4xl md:text-6xl text-accent-blue bg-bg-surface border border-white/10 rounded-xl px-4 py-3 min-w-[70px] md:min-w-[100px]">
            {String(u.value).padStart(2, '0')}
          </div>
          <p className="text-muted text-xs mt-2 uppercase tracking-wider">{u.label}</p>
        </div>
      ))}
    </div>
  )
}
