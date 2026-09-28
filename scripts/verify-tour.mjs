/* Runtime check of the « Hajime » redesign: the dojo tour hero, bands, finder,
 * static hero on phones. Needs the dev server on :3000. Screens go to scripts/verify-shots. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'scripts/verify-shots'
mkdirSync(OUT, { recursive: true })
const URL = process.argv[2] ?? 'http://localhost:3000/fr'

const errors = []
const browser = await chromium.launch({ channel: 'msedge', headless: true })

// Desktop: scrub the tour at band positions
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))
await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForFunction(() => document.querySelector('.tour-stage')?.classList.contains('video-ready'), null, { timeout: 30000 })
  .catch(() => errors.push('video never became ready'))

const scrollRange = await page.evaluate(() => {
  const el = document.querySelector('.tour-scrub')
  return el.getBoundingClientRect().height - innerHeight
})
for (const p of [0, 0.3, 0.6, 0.95]) {
  await page.evaluate(y => window.scrollTo(0, y), Math.round(p * scrollRange))
  await page.waitForTimeout(1600)
  const state = await page.evaluate(() => ({
    t: document.querySelector('video')?.currentTime?.toFixed(2),
    bands: [...document.querySelectorAll('.band')].map(b => (+getComputedStyle(b).opacity).toFixed(2)).join(' '),
  }))
  console.log(`p=${p} t=${state.t} bands=${state.bands}`)
  await page.screenshot({ path: `${OUT}/tour-${p}.png` })
}

// Below the hero: pick a year in the finder
await page.locator('#trouver').scrollIntoViewIfNeeded()
await page.selectOption('#trouver select', '2017')
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/finder.png` })
const lit = await page.evaluate(() => [...document.querySelectorAll('#trouver ul a')].filter(a => a.style.transform.includes('rotateX')).map(a => a.getAttribute('aria-label').slice(0, 30)))
console.log('finder 2017 lit:', lit.join(' | '))

await page.locator('#horaire').scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
await page.screenshot({ path: `${OUT}/horaire.png` })
// walk the whole page like a reader so every reveal fires, then capture it
const H = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < H; y += 500) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(120) }
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true })

// Phone: static hero, no video request
const phone = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
let videoRequested = false
phone.on('request', r => { if (r.url().includes('tour.mp4')) videoRequested = true })
phone.on('pageerror', e => errors.push('PHONE PAGEERROR: ' + e.message))
await phone.goto(URL, { waitUntil: 'networkidle', timeout: 90000 })
await phone.screenshot({ path: `${OUT}/phone-top.png` })
await phone.screenshot({ path: `${OUT}/phone-full.png`, fullPage: true })
console.log('phone video requested:', videoRequested)

const overflow = await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth)
console.log('phone horizontal overflow:', overflow)

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors')
await browser.close()
