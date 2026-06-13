/* Probe: palette correctness at each chapter (rect-based conductor). */
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(6000)

const bgAt = () => page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--voie-bg').trim())

const go = async (t, o) => {
  await page.evaluate(({ t, o }) => {
    const el = [...document.querySelectorAll('h2, h3, p, span')].find(e => e.textContent?.trim().includes(t))
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * o
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)
  }, { t, o })
  await page.waitForTimeout(1800)
}

const r = {}
await go('LA FORCE', 0.2); r.force = await bgAt()
await go('EXÉCUTE', 0.3); r.projection = await bgAt()
await go('CINQUANTE-CINQ', 0.25); r.noir = await bgAt()
await page.screenshot({ path: 'scripts/verify-shots/revert-noir.png' })
await go('MONTE SUR LE TATAMI', 0.25); r.finale = await bgAt()
await page.evaluate(() => window.__lenis
  ? window.__lenis.scrollTo(0, { immediate: true })
  : window.scrollTo(0, 0))
await page.waitForTimeout(1800)
r.blanc = await bgAt()
await page.screenshot({ path: 'scripts/verify-shots/revert-blanc.png' })
console.log(JSON.stringify(r, null, 2))
await browser.close()
