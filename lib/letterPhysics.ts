/**
 * Randori physics — a tiny hand-rolled rigid-body world for DOM letters.
 * Grab a letter, throw it: it tumbles, breakfalls on the floor (ukemi),
 * then the dojo restores order — each letter springs back to its exact
 * place in the kata. No dependencies.
 */
import gsap from 'gsap'

type Body = {
  el: HTMLElement
  // deltas from the letter's home position
  x: number; y: number; angle: number
  vx: number; vy: number; va: number
  w: number; h: number
  homeLeft: number; homeTop: number
  grabbed: boolean
  grabDX: number; grabDY: number
  active: boolean
  restAt: number
  returning: boolean
  hadImpact: boolean
}

export type LetterPhysics = { destroy: () => void; reset: () => void }

const GRAVITY = 2600
const RESTITUTION = 0.42
const RETURN_DELAY = 2200

export function createLetterPhysics(
  container: HTMLElement,
  letters: HTMLElement[],
  opts?: { onImpact?: (intensity: number) => void }
): LetterPhysics {
  const bodies: Body[] = []
  const cRect = () => container.getBoundingClientRect()

  for (const el of letters) {
    const r = el.getBoundingClientRect()
    const c = cRect()
    bodies.push({
      el,
      x: 0, y: 0, angle: 0, vx: 0, vy: 0, va: 0,
      w: r.width, h: r.height,
      homeLeft: r.left - c.left, homeTop: r.top - c.top,
      grabbed: false, grabDX: 0, grabDY: 0,
      active: false, restAt: 0, returning: false, hadImpact: false,
    })
    el.style.cursor = 'grab'
    el.style.touchAction = 'none'
    el.style.display = 'inline-block'
    el.style.willChange = 'transform'
  }

  let grabbedBody: Body | null = null
  const pointerHistory: { x: number; y: number; t: number }[] = []

  const apply = (b: Body) => {
    b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.angle}deg)`
  }

  const onDown = (e: PointerEvent) => {
    const target = (e.target as HTMLElement).closest?.('[data-randori]') as HTMLElement | null
    if (!target) return
    const b = bodies.find(x => x.el === target)
    if (!b || b.returning) return
    e.preventDefault()
    grabbedBody = b
    b.grabbed = true
    b.active = true
    b.hadImpact = false
    gsap.killTweensOf(b)
    const r = b.el.getBoundingClientRect()
    b.grabDX = e.clientX - (r.left + r.width / 2)
    b.grabDY = e.clientY - (r.top + r.height / 2)
    pointerHistory.length = 0
    b.el.style.cursor = 'grabbing'
  }

  const onMove = (e: PointerEvent) => {
    const b = grabbedBody
    if (!b) return
    const c = cRect()
    const targetX = (e.clientX - c.left - b.grabDX - b.w / 2) - b.homeLeft
    const targetY = (e.clientY - c.top - b.grabDY - b.h / 2) - b.homeTop
    b.vx = (targetX - b.x) * 28
    b.vy = (targetY - b.y) * 28
    b.x = targetX
    b.y = targetY
    b.va = gsap.utils.clamp(-720, 720, b.vx * 0.35)
    pointerHistory.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    if (pointerHistory.length > 5) pointerHistory.shift()
    apply(b)
  }

  const onUp = () => {
    const b = grabbedBody
    if (!b) return
    grabbedBody = null
    b.grabbed = false
    b.el.style.cursor = 'grab'
    // Release velocity from recent pointer motion — the throw
    if (pointerHistory.length >= 2) {
      const a = pointerHistory[0]
      const z = pointerHistory[pointerHistory.length - 1]
      const dt = Math.max(0.016, (z.t - a.t) / 1000)
      b.vx = gsap.utils.clamp(-3200, 3200, ((z.x - a.x) / dt) * 1.15)
      b.vy = gsap.utils.clamp(-3600, 3600, ((z.y - a.y) / dt) * 1.15)
      b.va = gsap.utils.clamp(-900, 900, b.vx * 0.4)
    }
  }

  const tick = () => {
    const now = performance.now()
    const dt = Math.min(0.024, gsap.ticker.deltaRatio(60) / 60)
    const c = cRect()

    for (const b of bodies) {
      if (!b.active || b.grabbed || b.returning) continue

      b.vy += GRAVITY * dt
      b.x += b.vx * dt
      b.y += b.vy * dt
      b.angle += b.va * dt

      // Floor — the tatami
      const floorY = c.height - (b.homeTop + b.h)
      if (b.y > floorY) {
        b.y = floorY
        if (Math.abs(b.vy) > 90) {
          if (!b.hadImpact) {
            b.hadImpact = true
            opts?.onImpact?.(Math.min(1, Math.abs(b.vy) / 2600))
          }
          b.vy = -b.vy * RESTITUTION
          b.vx *= 0.82
          b.va = gsap.utils.clamp(-540, 540, b.va * -0.55 + b.vx * 0.3)
        } else {
          b.vy = 0
          b.vx *= 0.86
          b.va *= 0.8
        }
      }

      // Walls
      const leftLimit = -b.homeLeft
      const rightLimit = c.width - (b.homeLeft + b.w)
      if (b.x < leftLimit) { b.x = leftLimit; b.vx = Math.abs(b.vx) * 0.5 }
      if (b.x > rightLimit) { b.x = rightLimit; b.vx = -Math.abs(b.vx) * 0.5 }
      if (b.y < -b.homeTop - b.h) { b.y = -b.homeTop - b.h; b.vy = Math.abs(b.vy) * 0.3 }

      apply(b)

      // At rest on the floor → schedule the kata return
      const resting = b.y >= floorY - 0.5 && Math.abs(b.vx) < 12 && Math.abs(b.vy) < 12
      if (resting) {
        if (!b.restAt) b.restAt = now
        if (now - b.restAt > RETURN_DELAY) returnHome(b)
      } else {
        b.restAt = 0
      }
    }
  }

  const returnHome = (b: Body) => {
    b.returning = true
    b.active = false
    b.restAt = 0
    gsap.to(b, {
      x: 0, y: 0, angle: 0,
      duration: 1.15,
      ease: 'elastic.out(1, 0.55)',
      onUpdate: () => apply(b),
      onComplete: () => {
        b.returning = false
        b.vx = b.vy = b.va = 0
        b.el.style.transform = ''
      },
    })
  }

  container.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
  gsap.ticker.add(tick)

  return {
    reset() {
      for (const b of bodies) if (b.active || b.x || b.y) returnHome(b)
    },
    destroy() {
      container.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      gsap.ticker.remove(tick)
      for (const b of bodies) {
        gsap.killTweensOf(b)
        b.el.style.transform = ''
        b.el.style.cursor = ''
      }
    },
  }
}
