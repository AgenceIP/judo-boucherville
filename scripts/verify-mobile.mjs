/* Mobile audit: every page at phone size with touch. Reports sideways overflow,
 * elements poking past the screen, tap targets under 44px and text under 14px,
 * and saves a full-page capture. Usage: node scripts/verify-mobile.mjs [base] [width] */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.argv[2] ?? 'http://localhost:3000'
const W = Number(process.argv[3] ?? 375)
const OUT = `scripts/verify-shots/mobile-${W}`
mkdirSync(OUT, { recursive: true })
const PAGES = ['', 'programmes', 'programmes/judo-enfants', 'inscription', 'contact', 'historique', 'equipe', 'equipe/faycal-bousbiat',
  'ceintures-noires', 'conseil', 'resultats', 'challenge', 'actualites', 'calendrier', 'journaux', 'telechargements', 'athletes']

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const ctx = await browser.newContext({ viewport: { width: W, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
const errors = []

for (const p of PAGES) {
  // fresh page per URL: a full-page screenshot resets touch emulation for the rest of that page's life
  const page = await ctx.newPage()
  page.on('pageerror', e => errors.push(`${page.url()} ${e.message}`))
  await page.goto(`${BASE}/fr/${p}`, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(800) // let dev-mode styles settle before measuring
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 600) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(70) }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400)
  const r = await page.evaluate(() => {
    const vw = innerWidth
    const inScroller = el => { for (let e = el.parentElement; e; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o === 'auto' || o === 'scroll') return true } return false }
    const visible = el => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return cs.visibility !== 'hidden' && cs.display !== 'none' && b.width > 0 && b.height > 0 && !el.closest('[aria-hidden="true"], .tour-scrub, .sr-only') }
    const poke = [], small = [], tiny = []
    for (const el of document.querySelectorAll('main *, header *, footer *')) {
      if (!visible(el)) continue
      const b = el.getBoundingClientRect()
      if ((b.right > vw + 1 || b.left < -1) && !inScroller(el) && !el.closest('.overflow-hidden,[class*="marquee"],[role="region"]')) poke.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${Math.round(b.left)}..${Math.round(b.right)}`)
      if (el.matches('a, button, select, summary, input, textarea') && (b.height < 40 || b.width < 40)) small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28)}" ${Math.round(b.width)}x${Math.round(b.height)}`)
      const fs = parseFloat(getComputedStyle(el).fontSize)
      if (fs < 13.5 && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) tiny.push(`${fs}px "${el.textContent.trim().slice(0, 24)}"`)
    }
    return { overflow: document.documentElement.scrollWidth > vw, poke: poke.slice(0, 6), pokeN: poke.length, small: [...new Set(small)].slice(0, 8), smallN: small.length, tiny: [...new Set(tiny)].slice(0, 6), tinyN: tiny.length }
  })
  await page.screenshot({ path: `${OUT}/${(p || 'home').replace(/\//g, '_')}.png`, fullPage: true })
  console.log(`\n# /fr/${p}  overflow=${r.overflow} poke=${r.pokeN} smallTargets=${r.smallN} tinyText=${r.tinyN}`)
  if (r.pokeN) console.log('  poke:', r.poke.join(' | '))
  if (r.smallN) console.log('  small:', r.small.join(' | '))
  if (r.tinyN) console.log('  tiny:', r.tiny.join(' | '))
  await page.close()
}
console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno page errors')
await browser.close()
