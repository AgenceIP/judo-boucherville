/**
 * The sound of the dojo — synthesized entirely in Web Audio, no files.
 * A low tatami thump for impacts, a soft step for chapter changes, a gong
 * cluster when the experience is enabled, and a breath of air tied to
 * scroll velocity. Everything is quiet by design and strictly opt-in.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
let whooshGain: GainNode | null = null
let whooshRaf = 0

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.9
    master.connect(ctx.destination)

    const len = ctx.sampleRate * 2
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function noiseBurst(when: number, duration: number, freq: number, gain: number) {
  if (!ctx || !master || !noiseBuffer) return
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = freq
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, when)
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration)
  src.connect(filter).connect(g).connect(master)
  src.start(when)
  src.stop(when + duration)
}

function sineDrop(when: number, from: number, to: number, duration: number, gain: number) {
  if (!ctx || !master) return
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(from, when)
  osc.frequency.exponentialRampToValueAtTime(to, when + duration)
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, when)
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration)
  osc.connect(g).connect(master)
  osc.start(when)
  osc.stop(when + duration)
}

/** A body lands on the tatami. */
export function thump(intensity = 1) {
  const c = ensureContext()
  if (!c) return
  const t = c.currentTime
  sineDrop(t, 82, 36, 0.22, 0.22 * intensity)
  noiseBurst(t, 0.13, 260, 0.1 * intensity)
}

/** A quiet step — the world shifts a chapter. */
export function step() {
  const c = ensureContext()
  if (!c) return
  const t = c.currentTime
  sineDrop(t, 64, 40, 0.16, 0.07)
  noiseBurst(t, 0.08, 180, 0.035)
}

/** The bow — played once when sound is enabled. */
export function gong() {
  const c = ensureContext()
  if (!c || !master) return
  const t = c.currentTime
  for (const [freq, gain, len] of [[156, 0.05, 3.2], [196, 0.045, 2.8], [233.5, 0.028, 2.2]] as const) {
    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + len)
    osc.connect(g).connect(master)
    osc.start(t)
    osc.stop(t + len)
  }
  noiseBurst(t, 0.4, 900, 0.012)
}

/** Continuous breath of air mapped to scroll speed. */
export function startWhoosh() {
  const c = ensureContext()
  if (!c || !master || !noiseBuffer || whooshGain) return
  const src = c.createBufferSource()
  src.buffer = noiseBuffer
  src.loop = true
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 420
  filter.Q.value = 0.8
  whooshGain = c.createGain()
  whooshGain.gain.value = 0
  src.connect(filter).connect(whooshGain).connect(master)
  src.start()

  let lastY = window.scrollY
  let level = 0
  const tick = () => {
    whooshRaf = requestAnimationFrame(tick)
    const y = window.scrollY
    const v = Math.abs(y - lastY)
    lastY = y
    const target = Math.min(0.05, v * 0.0011)
    level += (target - level) * 0.06
    if (whooshGain) whooshGain.gain.value = level
  }
  whooshRaf = requestAnimationFrame(tick)
}

export function stopWhoosh() {
  cancelAnimationFrame(whooshRaf)
  whooshRaf = 0
  if (whooshGain) {
    whooshGain.gain.value = 0
    whooshGain = null
  }
}

export function suspendAll() {
  stopWhoosh()
  void ctx?.suspend()
}
