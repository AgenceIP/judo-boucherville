/* Focused probe: the pinned throw chapter — scrub by scroll and by drag. */
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', e => errors.push(e.message))

await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4500) // let the ritual finish

const goto = (frac) => page.evaluate((f) => {
  const spacer = document.querySelector('.pin-spacer')
  const sec = document.querySelector('[data-cursor="drag"]')
  if (!spacer || !sec) return null
  const start = spacer.getBoundingClientRect().top + window.scrollY
  const range = window.innerHeight * 2.6
  const dest = start + range * f
  const lenis = window.__lenis
  if (lenis) lenis.scrollTo(dest, { immediate: true })
  else window.scrollTo(0, dest)
  return dest
}, frac)

const state = () => page.evaluate(() => {
  const v = document.querySelector('video')
  const phases = [...document.querySelectorAll('[data-cursor="drag"] .font-heading')]
    .filter(el => /kuzushi|tsukuri|kake/i.test(el.textContent ?? ''))
    .map(el => ({ name: el.textContent, opacity: getComputedStyle(el.parentElement).opacity }))
  return { t: v ? +v.currentTime.toFixed(2) : null, dur: v ? +v.duration.toFixed(2) : null, phases }
})

await goto(0.2)
await page.waitForTimeout(1800)
const at20 = await state()
await page.screenshot({ path: 'scripts/verify-shots/p01-pin-20.png' })

await goto(0.55)
await page.waitForTimeout(1800)
const at55 = await state()
await page.screenshot({ path: 'scripts/verify-shots/p02-pin-55.png' })

await goto(0.9)
await page.waitForTimeout(1800)
const at90 = await state()
await page.screenshot({ path: 'scripts/verify-shots/p03-pin-90.png' })

// Drag backwards from 90%: pull left should rewind the throw
await page.mouse.move(900, 450)
await page.mouse.down()
await page.mouse.move(250, 450, { steps: 16 })
await page.mouse.up()
await page.waitForTimeout(1600)
const afterDrag = await state()
await page.screenshot({ path: 'scripts/verify-shots/p04-after-drag.png' })

console.log(JSON.stringify({
  at20: { t: at20.t, active: at20.phases.find(p => p.opacity === '1')?.name },
  at55: { t: at55.t, active: at55.phases.find(p => p.opacity === '1')?.name },
  at90: { t: at90.t, active: at90.phases.find(p => p.opacity === '1')?.name },
  afterDrag: { t: afterDrag.t, active: afterDrag.phases.find(p => p.opacity === '1')?.name },
  dur: at20.dur,
  scrubForward: at20.t < at55.t && at55.t < at90.t,
  dragRewound: afterDrag.t < at90.t,
  errors,
}, null, 2))

await browser.close()
