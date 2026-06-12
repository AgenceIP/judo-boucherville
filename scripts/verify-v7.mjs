/* v7 rebrand verification: poster look across all worlds. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/verify-shots', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(1000)
await page.screenshot({ path: 'scripts/verify-shots/p7-00-punch.png' })
await page.waitForTimeout(5500)
await page.screenshot({ path: 'scripts/verify-shots/p7-01-hero.png' })

const gotoText = async (text, offset = 0.3) => {
  await page.evaluate(({ t, o }) => {
    const el = [...document.querySelectorAll('h2, h3, p, span')].find(e => e.textContent?.trim().includes(t))
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * o
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)
  }, { t: text, o: offset })
  await page.waitForTimeout(2200)
}

await gotoText("L'ÉCOLE", 0.2)
await page.screenshot({ path: 'scripts/verify-shots/p7-02-ecole.png' })
await gotoText('LA FORCE', 0.2)
await page.screenshot({ path: 'scripts/verify-shots/p7-03-cobalt.png' })
await gotoText('CINQUANTE-CINQ', 0.25)
await page.screenshot({ path: 'scripts/verify-shots/p7-04-noir.png' })
await gotoText('MONTE SUR LE TATAMI', 0.25)
await page.screenshot({ path: 'scripts/verify-shots/p7-05-finale.png' })
await page.evaluate(() => window.__lenis
  ? window.__lenis.scrollTo(document.body.scrollHeight, { immediate: true })
  : window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1500)
await page.screenshot({ path: 'scripts/verify-shots/p7-06-footer.png' })

await page.goto('http://localhost:3000/fr/programmes', { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.screenshot({ path: 'scripts/verify-shots/p7-07-internal.png' })
await page.goto('http://localhost:3000/fr/inscription', { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.mouse.wheel(0, 900)
await page.waitForTimeout(1200)
await page.screenshot({ path: 'scripts/verify-shots/p7-08-inscription.png' })

console.log(JSON.stringify({ errors }, null, 2))
await browser.close()
