// Studio screenshots with a saved login.
// Once per site: node scripts/studio-shot.mjs --login [base]   (sign in, then close the window)
// Then: node scripts/studio-shot.mjs /studio/structure out.png [base]
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'

const login = process.argv[2] === '--login'
const [path = '/studio', out = 'studio.png', base = 'http://localhost:3000'] = login ? [undefined, undefined, process.argv[3]] : process.argv.slice(2)
const ctx = await chromium.launchPersistentContext(fileURLToPath(new URL('./.studio-profile/', import.meta.url)), {
  channel: 'msedge', headless: !login, viewport: { width: 1440, height: 900 },
})
const page = ctx.pages()[0] ?? await ctx.newPage()
await page.goto(base + path)
if (login) await new Promise(r => ctx.on('close', r))
else {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: out })
  await ctx.close()
}
