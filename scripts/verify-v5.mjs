/* v5: randori letter physics, black-belt constellation, sound toggle UI. */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/verify-shots', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

// ——— 1. Randori: grab the first letter and hurl it
await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(8500) // ritual + intro + randoriReady

const letter = page.locator('[data-randori]').first()
const before = await letter.evaluate(el => el.getBoundingClientRect().x)
const box = await letter.boundingBox()
let impactFired = false
await page.exposeFunction('reportImpact', () => { impactFired = true })
await page.evaluate(() => window.addEventListener('dojo:impact', () => window.reportImpact()))

await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
await page.mouse.down()
await page.mouse.move(box.x + 420, box.y - 160, { steps: 8 })
await page.mouse.up()
await page.waitForTimeout(600)
const mid = await letter.evaluate(el => el.getBoundingClientRect().x)
await page.screenshot({ path: 'scripts/verify-shots/r01-thrown.png' })
await page.waitForTimeout(4500) // rest + elastic return
const after = await letter.evaluate(el => {
  const r = el.getBoundingClientRect()
  return { x: r.x, transform: el.style.transform }
})
await page.screenshot({ path: 'scripts/verify-shots/r02-restored.png' })

// ——— 2. Constellation
await page.goto('http://localhost:3000/fr/ceintures-noires', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.mouse.move(700, 400)
await page.waitForTimeout(900)
await page.mouse.move(760, 430, { steps: 4 })
await page.waitForTimeout(900)
const hoverName = await page.evaluate(() => {
  const tips = [...document.querySelectorAll('.font-heading')]
  return tips.find(t => t.className.includes('whitespace-nowrap'))?.textContent ?? null
})
await page.screenshot({ path: 'scripts/verify-shots/r03-constellation.png' })

// ——— 3. Sound toggle UI (audio itself can't be heard headless — UI + no crash)
const toggle = page.getByRole('button', { name: /son du dojo|dojo sound/i })
const toggleVisible = await toggle.count()
await toggle.click()
await page.waitForTimeout(600)
const pressed = await toggle.getAttribute('aria-pressed')
await page.mouse.wheel(0, 800)
await page.waitForTimeout(800)

console.log(JSON.stringify({
  randori: { xBefore: before, xDuringFlight: mid, moved: Math.abs(mid - before) > 60, returned: after.transform === '' },
  impactEventFired: impactFired,
  constellationHover: hoverName,
  sound: { toggleVisible: toggleVisible > 0, pressedAfterClick: pressed },
  consoleErrors: errors,
}, null, 2))
await browser.close()
