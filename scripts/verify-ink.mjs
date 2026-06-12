/* Probe: the WebGL ink fluid — does the brush leave living ink? */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/verify-shots', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:3000/fr', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(5000) // ritual + opening ink drops

const webgl = await page.evaluate(() => {
  const c = document.createElement('canvas')
  return !!c.getContext('webgl2')
})

await page.screenshot({ path: 'scripts/verify-shots/ink-after-drops.png' })

// Paint with the cursor — a long S-stroke across the paper
await page.mouse.move(200, 700)
for (let i = 0; i <= 40; i++) {
  const t = i / 40
  const x = 200 + t * 1000
  const y = 700 - Math.sin(t * Math.PI * 2) * 220 - t * 240
  await page.mouse.move(x, y)
  await page.waitForTimeout(16)
}
await page.waitForTimeout(400)
await page.screenshot({ path: 'scripts/verify-shots/ink-stroke.png' })
await page.waitForTimeout(2500)
await page.screenshot({ path: 'scripts/verify-shots/ink-fading.png' })

// Is the canvas actually non-empty? Read back a sample
const inkPresent = await page.evaluate(() => {
  const canvas = document.querySelector('section canvas')
  if (!canvas) return 'no-canvas'
  const gl = canvas.getContext('webgl2')
  if (!gl) return 'no-ctx'
  const px = new Uint8Array(4)
  // sample center
  gl.readPixels(canvas.width / 2 | 0, canvas.height / 2 | 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
  return Array.from(px).join(',')
})

console.log(JSON.stringify({ webgl, inkPresent, errors }, null, 2))
await browser.close()
