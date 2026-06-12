'use client'

/**
 * Aurora — three drifting light fields that give the dark worlds a living
 * atmosphere. Pure CSS animation, GPU-cheap (three blurred layers).
 */
export default function Aurora({ className = '', opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="aurora-blob aurora-a" style={{ width: '55vw', height: '55vw', top: '-18%', left: '-12%' }} />
      <div className="aurora-blob aurora-b" style={{ width: '48vw', height: '48vw', bottom: '-22%', right: '-10%' }} />
      <div className="aurora-blob aurora-c" style={{ width: '36vw', height: '36vw', top: '28%', left: '38%' }} />
    </div>
  )
}
