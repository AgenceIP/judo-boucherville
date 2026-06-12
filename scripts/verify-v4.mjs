/* v4: the experience spread site-wide — vapor heroes, kanji per page,
 * progress line, programme previews, footer sign-off, 404. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/verify-shots', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

const kanjiOn = async (path) => {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1600)
  return page.evaluate(() => {
    const spans = [...document.querySelectorAll('span.font-jp')]
    const ghost = spans.find(s => parseFloat(getComputedStyle(s).fontSize) > 200)
    return ghost?.textContent ?? null
  })
}

// 1. Internal heroes: vapor + per-page kanji
const kProg = await kanjiOn('/fr/programmes')
// paint vapor with the cursor over the hero
await page.mouse.move(300, 300)
for (let i = 0; i <= 24; i++) {
  await page.mouse.move(300 + i * 35, 300 + Math.sin(i / 4) * 90)
  await page.waitForTimeout(16)
}
await page.waitForTimeout(500)
await page.screenshot({ path: 'scripts/verify-shots/x01-programmes-vapor.png' })

// progress line after scrolling
await page.mouse.wheel(0, 1200)
await page.waitForTimeout(1300)
const progressScale = await page.evaluate(() => {
  const el = document.querySelector('.bg-royal.origin-left')
  return el ? getComputedStyle(el).transform : null
})

// programme card hover preview
const card = page.locator('a[href*="/programmes/judo-competition"]').first()
await card.scrollIntoViewIfNeeded()
await page.waitForTimeout(800)
await card.hover()
await page.waitForTimeout(800)
await page.screenshot({ path: 'scripts/verify-shots/x02-card-preview.png' })

const kEquipe = await kanjiOn('/fr/equipe')
const kHisto = await kanjiOn('/fr/historique')
await page.screenshot({ path: 'scripts/verify-shots/x03-historique-hero.png' })

// 2. Footer sign-off + wordmark
await page.evaluate(() => window.__lenis
  ? window.__lenis.scrollTo(document.body.scrollHeight, { immediate: true })
  : window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1500)
const signoff = await page.getByText('À bientôt sur le tatami', { exact: false }).count()
await page.screenshot({ path: 'scripts/verify-shots/x04-footer.png' })

// 3. 404
await page.goto('http://localhost:3000/fr/cette-page-nexiste-pas', { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
const notFound = await page.getByText('QUITTÉ LE TATAMI', { exact: false }).count()
await page.screenshot({ path: 'scripts/verify-shots/x05-404.png' })

// 4. Homepage regression: ritual, ink, chapters still alive
await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle' })
await page.waitForTimeout(5200)
const homeOk = await page.evaluate(() => !!document.getElementById('voie-root'))
await page.screenshot({ path: 'scripts/verify-shots/x06-home.png' })

console.log(JSON.stringify({
  kanji: { programmes: kProg, equipe: kEquipe, historique: kHisto },
  progressScale,
  signoff: signoff > 0,
  notFound: notFound > 0,
  homeOk,
  consoleErrors: errors,
}, null, 2))
await browser.close()
