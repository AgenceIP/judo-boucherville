'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

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

/** A single digit that rolls vertically when its value changes */
function RollingDigit({ digit }: { digit: string }) {
  return (
    <span className="relative inline-flex overflow-hidden" style={{ width: '0.62em' }}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          exit={{ y: '-105%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const t = useTranslations('challenge')
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const update = () => {
      setTime(getTimeLeft(targetDate))
      setExpired(new Date(targetDate).getTime() <= Date.now())
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (expired) {
    return (
      <p className="font-heading text-2xl md:text-3xl text-white/70 tracking-wider leading-snug max-w-sm">
        {t('countdown_expired')}
      </p>
    )
  }

  const units = [
    { value: time.days, label: t('countdown_days') },
    { value: time.hours, label: t('countdown_hours') },
    { value: time.minutes, label: t('countdown_minutes') },
    { value: time.seconds, label: t('countdown_seconds') },
  ]

  return (
    <div className="flex items-start">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start">
          {i > 0 && (
            <span
              className="font-heading text-royal/60 leading-none mx-2 md:mx-4 select-none"
              style={{ fontSize: 'clamp(40px, 5.5vw, 88px)' }}
            >
              :
            </span>
          )}
          <div>
            <div
              className="font-heading text-white leading-none tabular-nums flex"
              style={{ fontSize: 'clamp(48px, 6.5vw, 104px)' }}
            >
              {String(u.value).padStart(2, '0').split('').map((d, j) => (
                <RollingDigit key={`${u.label}-${j}`} digit={d} />
              ))}
            </div>
            <p className="text-muted text-[10px] mt-3 uppercase tracking-[.3em]">{u.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
