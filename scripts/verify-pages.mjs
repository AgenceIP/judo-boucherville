/* Screenshot every inner page (desktop full page, after a scroll pass so lazy
 * images load) and report console errors. Needs the dev server on :3000. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'scripts/verify-shots/pages'
mkdirSync(OUT, { recursive: true })
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : [
  'programmes', 'programmes/judo-enfants', 'inscription', 'contact', 'historique', 'equipe', 'equipe/faycal-bousbiat',
  'ceintures-noires', 'conseil', 'resultats', 'challenge', 'actualites', 'calendrier', 'journaux', 'telechargements', 'athletes', 'page-inexistante',
]

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', e => errors.push(`${page.url()} PAGEERROR ${e.message}`))
page.on('console', m => { if (m.type() === 'error') errors.push(`${page.url()} ${m.text().slice(0, 200)}`) })

for (const p of PAGES) {
  await page.goto(`http://localhost:3000/fr/${p}`, { waitUntil: 'networkidle', timeout: 90000 })
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 700) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(60) }
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/${p.replace(/\//g, '_')}.png`, fullPage: true })
  console.log('ok', p, h)
}
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors')
await browser.close()
