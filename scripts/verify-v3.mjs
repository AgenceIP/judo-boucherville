/* v3 verification: hover previews, marquee, noir band, full journey, no errors. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/verify-shots', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
const failed = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))
page.on('requestfailed', r => failed.push(r.url()))

await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(5000)

const gotoText = async (text, offset = 0.3) => {
  await page.evaluate(({ t, o }) => {
    const el = [...document.querySelectorAll('h2, h3, p, span')].find(e => e.textContent?.trim().includes(t))
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * o
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)
  }, { t: text, o: offset })
  await page.waitForTimeout(1800)
}

// 1. École: hover a row → floating preview
await gotoText("L'ÉCOLE", 0.15)
const row = page.locator('a[href*="/programmes/judo-competition"]').first()
await row.hover()
await page.waitForTimeout(900)
await page.mouse.move(720, 500)
await page.waitForTimeout(700)
await page.screenshot({ path: 'scripts/verify-shots/w01-hover-preview.png' })
const previewVisible = await page.evaluate(() => {
  const img = [...document.querySelectorAll('img')].find(i => i.src.includes('/images/voie/'))
  if (!img) return false
  const wrap = img.closest('div')
  return wrap ? getComputedStyle(wrap).opacity : false
})

// 2. Marquee
await gotoText('JUDO BOUCHERVILLE — DEPUIS', 0.4)
await page.screenshot({ path: 'scripts/verify-shots/w02-marquee.png' })

// 3. Noir band
await gotoText('Dojo Marcel Bourelly — Boucherville', 0.55)
await page.screenshot({ path: 'scripts/verify-shots/w03-noir-band.png' })

// 4. Finale glow
await gotoText('MONTE SUR LE TATAMI', 0.25)
await page.screenshot({ path: 'scripts/verify-shots/w04-finale-glow.png' })

console.log(JSON.stringify({
  previewVisible,
  voieImagesFailed: failed.filter(u => u.includes('/images/voie/')),
  consoleErrors: errors,
}, null, 2))
await browser.close()
