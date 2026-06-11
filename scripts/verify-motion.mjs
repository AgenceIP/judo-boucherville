/* Runtime verification of the premium motion redesign.
 * Drives the real site in Edge, captures screenshots + console errors. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'scripts/verify-shots'
mkdirSync(OUT, { recursive: true })

const errors = []
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

console.log('— Loading homepage /fr')
await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.screenshot({ path: `${OUT}/01-hero-early.png` })
await page.waitForTimeout(2200)
await page.screenshot({ path: `${OUT}/02-hero-revealed.png` })

// Video scrub: read currentTime at top, then after deep scroll
const videoAtTop = await page.evaluate(() => {
  const v = document.querySelector('video')
  return v ? { t: v.currentTime, dur: v.duration, ready: v.readyState } : null
})

// Smooth scroll via real wheel input (exercises Lenis)
console.log('— Wheel-scrolling to stats')
for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 350); await page.waitForTimeout(90) }
await page.waitForTimeout(1600)
await page.screenshot({ path: `${OUT}/03-stats.png` })

console.log('— Scrolling to programmes + club')
for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(80) }
await page.waitForTimeout(1600)
await page.screenshot({ path: `${OUT}/04-programmes.png` })

// Programme filter layout animation
const filterBtn = page.locator('button', { hasText: 'Enfants' }).first()
if (await filterBtn.count()) {
  await filterBtn.click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/05-filter-enfants.png` })
}

for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 420); await page.waitForTimeout(80) }
await page.waitForTimeout(1600)
await page.screenshot({ path: `${OUT}/06-club-or-achievements.png` })

// Countdown: two captures 1.3s apart to confirm rolling digits
console.log('— Scrolling to countdown')
const countdown = page.getByText('Compte à rebours', { exact: false }).first()
await countdown.scrollIntoViewIfNeeded().catch(() => {})
await page.waitForTimeout(1200)
const cdText1 = await page.evaluate(() => document.body.innerText.match(/\d{2,3}\s*:\s*\d{2}\s*:\s*\d{2}\s*:\s*\d{2}/)?.[0] ?? null)
await page.screenshot({ path: `${OUT}/07-countdown-a.png` })
await page.waitForTimeout(1300)
const cdText2 = await page.evaluate(() => document.body.innerText.match(/\d{2,3}\s*:\s*\d{2}\s*:\s*\d{2}\s*:\s*\d{2}/)?.[0] ?? null)
await page.screenshot({ path: `${OUT}/08-countdown-b.png` })

// Bottom: CTA + footer wordmark
for (let i = 0; i < 16; i++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(70) }
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/09-footer.png` })

const videoDeep = await page.evaluate(() => {
  const v = document.querySelector('video')
  return v ? { t: v.currentTime, dur: v.duration, scrollY: window.scrollY } : null
})

// Nav hide/show: scroll up a bit, header should reappear
await page.mouse.wheel(0, -600)
await page.waitForTimeout(900)
const navVisible = await page.evaluate(() => {
  const h = document.querySelector('header')
  return h ? getComputedStyle(h).transform : null
})

// Internal page hero reveal
console.log('— Loading /fr/programmes')
await page.goto('http://localhost:3000/fr/programmes', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1800)
await page.screenshot({ path: `${OUT}/10-internal-page.png` })

console.log(JSON.stringify({
  videoAtTop, videoDeep,
  countdown: { first: cdText1, second: cdText2, rolled: cdText1 !== cdText2 },
  navTransformAfterScrollUp: navVisible,
  lenisActive: await page.evaluate(() => document.documentElement.classList.contains('lenis')),
  consoleErrors: errors,
}, null, 2))

await browser.close()
