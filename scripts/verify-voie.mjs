/* Runtime verification of "La Voie" — entry ritual, luminance arc,
 * pinned video scrub, belt rail, drag-to-scrub, internal pages intact. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'scripts/verify-shots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

const vars = () => page.evaluate(() => {
  const s = getComputedStyle(document.documentElement)
  return { bg: s.getPropertyValue('--voie-bg').trim(), ink: s.getPropertyValue('--voie-ink').trim() }
})
const beltLabel = () => page.evaluate(() =>
  [...document.querySelectorAll('span')].find(s => /ceinture|belt/i.test(s.textContent ?? ''))?.textContent?.trim() ?? null
)
const videoTime = () => page.evaluate(() => {
  const v = document.querySelector('video')
  return v ? +v.currentTime.toFixed(2) : null
})

console.log('— First visit: entry ritual')
await page.goto('http://localhost:3000/fr', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/v01-ritual.png` })
await page.waitForTimeout(3800)
await page.screenshot({ path: `${OUT}/v02-white-world.png` })
const white = await vars()
const beltAtTop = await beltLabel()

console.log('— Scrolling: école → force (dusk)')
for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(90) }
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/v03-ecole.png` })
for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 420); await page.waitForTimeout(90) }
await page.waitForTimeout(1600)
const dusk = await vars()
await page.screenshot({ path: `${OUT}/v04-force-dusk.png` })

console.log('— Entering the pinned throw')
for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 450); await page.waitForTimeout(90) }
await page.waitForTimeout(1800)
const tA = await videoTime()
await page.screenshot({ path: `${OUT}/v05-projection-start.png` })
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 450); await page.waitForTimeout(110) }
await page.waitForTimeout(1500)
const tB = await videoTime()
await page.screenshot({ path: `${OUT}/v06-projection-mid.png` })

console.log('— Drag-to-scrub probe (backwards)')
await page.mouse.move(720, 450)
await page.mouse.down()
await page.mouse.move(300, 450, { steps: 12 })
await page.mouse.up()
await page.waitForTimeout(1200)
const tAfterDrag = await videoTime()

console.log('— Through to the black world')
for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 480); await page.waitForTimeout(80) }
await page.waitForTimeout(1600)
const black = await vars()
const beltDeep = await beltLabel()
await page.screenshot({ path: `${OUT}/v07-noir.png` })
for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(80) }
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/v08-finale.png` })

console.log('— Reload: ritual must NOT replay (session)')
await page.goto('http://localhost:3000/fr', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1200)
const ritualOnReload = await page.evaluate(() => !!document.querySelector('.font-jp') &&
  [...document.querySelectorAll('div')].some(d => d.getAttribute('aria-hidden') === 'true' && d.className.includes('z-[100]')))
await page.screenshot({ path: `${OUT}/v09-reload-no-ritual.png` })

console.log('— Internal page must stay dark and readable')
await page.goto('http://localhost:3000/fr/programmes', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const internal = await vars()
await page.screenshot({ path: `${OUT}/v10-internal.png` })

console.log(JSON.stringify({
  white, dusk, black, internal,
  beltAtTop, beltDeep,
  video: { atPinStart: tA, afterScroll: tB, afterBackwardDrag: tAfterDrag, scrubbed: tB > tA, dragWorked: tAfterDrag < tB },
  ritualOnReload,
  consoleErrors: errors,
}, null, 2))

await browser.close()
