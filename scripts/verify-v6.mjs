/* v6 futuristic re-skin: holo grid + gradient titles + auroras + nebula. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/verify-shots', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(7500)
await page.screenshot({ path: 'scripts/verify-shots/f6-01-blanc.png' })

const gotoText = async (text, offset = 0.3) => {
  await page.evaluate(({ t, o }) => {
    const el = [...document.querySelectorAll('h2, h3, p, span')].find(e => e.textContent?.trim().includes(t))
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * o
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)
  }, { t: text, o: offset })
  await page.waitForTimeout(2200)
}

await gotoText('LA FORCE', 0.25)
await page.screenshot({ path: 'scripts/verify-shots/f6-02-force.png' })

// gradient title visibility check: is the noir title's text painted?
await gotoText('CINQUANTE-CINQ', 0.3)
await page.screenshot({ path: 'scripts/verify-shots/f6-03-noir.png' })
const titleVisible = await page.evaluate(() => {
  const h2 = [...document.querySelectorAll('h2')].find(e => e.textContent?.includes('CINQUANTE-CINQ'))
  if (!h2) return 'missing'
  const s = getComputedStyle(h2)
  return { clip: s.webkitBackgroundClip || s.backgroundClip, colorTransparent: s.color === 'rgba(0, 0, 0, 0)' }
})

await gotoText('MONTE SUR LE TATAMI', 0.25)
await page.screenshot({ path: 'scripts/verify-shots/f6-04-finale.png' })

await page.goto('http://localhost:3000/fr/ceintures-noires', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.evaluate(() => {
  const c = document.querySelectorAll('canvas')[1]
  if (!c) return
  const y = c.getBoundingClientRect().top + window.scrollY - innerHeight * 0.15
  window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)
})
await page.waitForTimeout(1800)
await page.screenshot({ path: 'scripts/verify-shots/f6-05-nebula.png' })

console.log(JSON.stringify({ titleVisible, errors }, null, 2))
await browser.close()
