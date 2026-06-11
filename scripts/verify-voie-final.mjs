/* Final visual pass: each chapter framed precisely. */
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4500)

const gotoText = async (text, shot, settle = 2000) => {
  await page.evaluate((t) => {
    const el = [...document.querySelectorAll('h2, p')].find(e => e.textContent?.includes(t))
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * 0.3
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(y, { immediate: true })
    else window.scrollTo(0, y)
  }, text)
  await page.waitForTimeout(settle)
  await page.screenshot({ path: `scripts/verify-shots/${shot}` })
}

await page.screenshot({ path: 'scripts/verify-shots/f01-blanc.png' })
await gotoText("L'ÉCOLE", 'f02-ecole.png')
await gotoText('LA FORCE', 'f03-force.png')
await gotoText('MONTE SUR LE TATAMI', 'f04-finale.png')
const duskBg = await page.evaluate(() => {
  const el = [...document.querySelectorAll('h2')].find(e => e.textContent?.includes('LA FORCE'))
  const lenis = window.__lenis
  const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * 0.3
  if (lenis) lenis.scrollTo(y, { immediate: true })
  return null
})
await page.waitForTimeout(2200)
const vars = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--voie-bg').trim())
console.log(JSON.stringify({ duskBgAtForce: vars }))
await browser.close()
