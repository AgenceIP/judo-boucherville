/* Adversarial checks for the tour hero: flick test, worst-frame legibility,
 * reduced motion (before load and flipped live), video blocked, tablet gates. */
import { chromium } from 'playwright'

const URL = 'http://localhost:3000/fr'
const OUT = 'scripts/verify-shots'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const lum = ([r, g, b]) => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

// 1. Flick test: wheel steps of 120 / 240 / 360 px
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => document.querySelector('.tour-stage.video-ready'))
  for (const step of [120, 240, 360]) {
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(500)
    await page.mouse.move(700, 450)
    const plateau = [0, 0, 0, 0], seen = [0, 0, 0, 0], run = [0, 0, 0, 0]
    const range = await page.evaluate(() => document.querySelector('.tour-scrub').offsetHeight - innerHeight)
    for (let y = 0; y < range + step; y += step) {
      await page.mouse.wheel(0, step); await page.waitForTimeout(400)
      const ops = await page.evaluate(() => [...document.querySelectorAll('.band')].map(b => +getComputedStyle(b).opacity))
      ops.forEach((o, i) => { if (o > 0.95) { run[i]++; seen[i] = 1; plateau[i] = Math.max(plateau[i], run[i]) } else run[i] = 0 })
    }
    console.log(`flick ${step}px: full-opacity steps per band = ${plateau.join(' ')}  (seen: ${seen.join(' ')})`)
  }
  await page.close()
}

// 2. Worst-frame legibility: hide the glyphs, screenshot, find the worst pixel under each text box
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => document.querySelector('.tour-stage.video-ready'))
  const range = await page.evaluate(() => document.querySelector('.tour-scrub').offsetHeight - innerHeight)
  const checks = [
    { p: [0.0, 0.07, 0.13], sel: '.band-1 .title', text: [11, 27, 56] },
    { p: [0.86, 0.93, 1.0], sel: '.band-4 .hajime', text: [11, 27, 56] },
    { p: [0.86, 0.93, 1.0], sel: '.band-4 .sub', text: [11, 27, 56] },
  ]
  for (const c of checks) {
    let worst = Infinity
    for (const p of c.p) {
      await page.evaluate(y => scrollTo(0, y), Math.round(p * range)); await page.waitForTimeout(1500)
      const box = await page.evaluate(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }, c.sel)
      await page.addStyleTag({ content: '.band *{visibility:hidden !important}' }).then(h => h.evaluate(n => (n.id = 'hide')))
      const buf = await page.screenshot({ clip: box })
      await page.evaluate(() => document.getElementById('hide')?.remove())
      const px = await page.evaluate(async b64 => {
        const img = await createImageBitmap(await (await fetch('data:image/png;base64,' + b64)).blob())
        const cv = new OffscreenCanvas(img.width, img.height).getContext('2d'); cv.drawImage(img, 0, 0)
        const d = cv.getImageData(0, 0, img.width, img.height).data
        let darkest = [255, 255, 255], dl = 3
        for (let i = 0; i < d.length; i += 4) { const s = d[i] + d[i + 1] + d[i + 2]; if (s < dl * 255) { dl = s / 255; darkest = [d[i], d[i + 1], d[i + 2]] } }
        return darkest
      }, buf.toString('base64'))
      worst = Math.min(worst, ratio(lum(px), lum(c.text)))
    }
    console.log(`legibility ${c.sel}: worst contrast ${worst.toFixed(2)}:1 (need 3.5)`)
  }
  await page.close()
}

// 3. Reduced motion before load: static hero, no video request
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  let req = false
  page.on('request', r => { if (r.url().includes('tour.mp4')) req = true })
  await page.goto(URL, { waitUntil: 'networkidle' })
  const staticShown = await page.evaluate(() => getComputedStyle(document.querySelector('.tour-static')).display !== 'none')
  console.log(`reduced motion: static hero shown=${staticShown}, video requested=${req}`)
  // flip it off live: the scrub must arm itself
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(2500)
  const armed = await page.evaluate(() => ({ scrub: getComputedStyle(document.querySelector('.tour-scrub')).display, poster: document.querySelector('.tour-layer--start').style.backgroundImage }))
  console.log(`reduced motion flipped off: scrub display=${armed.scrub}, poster set=${!!armed.poster}, video requested=${req}`)
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(500)
  const back = await page.evaluate(() => getComputedStyle(document.querySelector('.tour-static')).display)
  console.log(`reduced motion flipped back on: static display=${back}`)
  await ctx.close()
}

// 4. Video blocked: page still complete, ending still lands on the logo wall image
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.route('**/tour.mp4', r => r.abort())
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const range = await page.evaluate(() => document.querySelector('.tour-scrub').offsetHeight - innerHeight)
  await page.evaluate(y => scrollTo(0, y), range); await page.waitForTimeout(1500)
  const st = await page.evaluate(() => ({ failed: document.querySelector('.tour-stage').classList.contains('video-failed'), end: getComputedStyle(document.querySelector('.tour-layer--end')).opacity, band4: getComputedStyle(document.querySelector('.band-4')).opacity }))
  console.log(`video blocked: failed=${st.failed} ending layer opacity=${st.end} settle band=${st.band4}`)
  await page.screenshot({ path: `${OUT}/video-blocked-end.png` })
  await page.close()
}

// 5. Portrait tablet (touch) gets the static hero; landscape desktop-size tablet gets the scrub
{
  const tab = await browser.newPage({ viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true })
  await tab.goto(URL, { waitUntil: 'networkidle' })
  console.log('portrait tablet static:', await tab.evaluate(() => getComputedStyle(document.querySelector('.tour-static')).display))
  await tab.setViewportSize({ width: 1180, height: 820 }); await tab.waitForTimeout(800)
  console.log('landscape tablet static:', await tab.evaluate(() => getComputedStyle(document.querySelector('.tour-static')).display))
  await tab.close()
}

// 6. Phone header: menu button visible, nothing cut off
{
  const phone = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  await phone.goto(URL, { waitUntil: 'networkidle' })
  const hdr = await phone.evaluate(() => {
    const btn = document.querySelector('button[aria-controls="site-menu"]').getBoundingClientRect()
    return { burgerRight: Math.round(btn.right), vw: innerWidth }
  })
  console.log('phone burger right edge / viewport:', hdr.burgerRight, '/', hdr.vw)
  await phone.screenshot({ path: `${OUT}/phone-top-2.png` })
  await phone.close()
}

await browser.close()
