/* Probe: countdown expired state + rolling digits with a shifted clock */
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'msedge', headless: true })

// 1. Real clock — expired state should show the localized message
const page1 = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page1.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page1.getByText('Compte à rebours', { exact: false }).first().scrollIntoViewIfNeeded()
await page1.waitForTimeout(1500)
const expiredText = await page1.getByText('Édition terminée', { exact: false }).count()
await page1.screenshot({ path: 'scripts/verify-shots/11-countdown-expired.png' })
await page1.close()

// 2. Clock shifted 90 days back — countdown is live, seconds must roll
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await ctx.addInitScript(() => {
  const offset = 90 * 86400000
  const RealDate = Date
  // eslint-disable-next-line no-global-assign
  Date = class extends RealDate {
    constructor(...args) { args.length ? super(...args) : super(RealDate.now() - offset) }
    static now() { return RealDate.now() - offset }
  }
})
const page2 = await ctx.newPage()
const errors = []
page2.on('pageerror', e => errors.push(e.message))
await page2.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page2.getByText('Compte à rebours', { exact: false }).first().scrollIntoViewIfNeeded()
await page2.waitForTimeout(1500)

const grab = () => page2.evaluate(() => {
  const el = [...document.querySelectorAll('p')].find(p => p.textContent?.includes('Compte à rebours'))
  return el?.parentElement?.innerText.replace(/\s+/g, ' ').trim() ?? null
})
const a = await grab()
await page2.screenshot({ path: 'scripts/verify-shots/12-countdown-live-a.png' })
await page2.waitForTimeout(2100)
const b = await grab()
await page2.screenshot({ path: 'scripts/verify-shots/13-countdown-live-b.png' })

console.log(JSON.stringify({ expiredMessageFound: expiredText > 0, liveA: a, liveB: b, rolled: a !== b, errors }, null, 2))
await browser.close()
