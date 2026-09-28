/* The dojo tour on a phone: video loads, scrubs with touch scrolling, captions
 * switch bands, the ending dissolves into the portrait logo-wall photo. */
import { chromium } from 'playwright'
const URL = process.argv[2] ?? 'http://localhost:3000/fr'
const OUT = 'scripts/verify-shots'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
let bytes = 0
page.on('response', async r => { if (r.url().includes('tour.mp4')) bytes = Number(r.headers()['content-length'] || 0) })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForFunction(() => document.querySelector('.tour-stage.video-ready'), null, { timeout: 30000 }).catch(() => errors.push('video never ready'))
const range = await page.evaluate(() => document.querySelector('.tour-scrub').offsetHeight - innerHeight)
for (const p of [0, 0.3, 0.6, 0.97]) {
  await page.evaluate(y => scrollTo(0, y), Math.round(p * range)); await page.waitForTimeout(1600)
  const s = await page.evaluate(() => ({
    t: document.querySelector('video').currentTime.toFixed(2),
    bands: [...document.querySelectorAll('.band')].map(b => (+getComputedStyle(b).opacity).toFixed(2)).join(' '),
    end: getComputedStyle(document.querySelector('.tour-layer--end')).opacity,
    endImg: document.querySelector('.tour-layer--end').style.backgroundImage.split('/').pop(),
  }))
  console.log(`p=${p} t=${s.t} bands=${s.bands} endLayer=${(+s.end).toFixed(2)} ${s.endImg}`)
  await page.screenshot({ path: `${OUT}/phone-tour-${p}.png` })
}
console.log('video bytes:', bytes, '| overflow:', await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
console.log(errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no errors')
await browser.close()
