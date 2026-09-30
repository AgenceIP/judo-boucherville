// Studio screenshots with a saved login.
// Once per site: node scripts/studio-shot.mjs --login [base]   (sign in, then close the window)
// Then: node scripts/studio-shot.mjs /studio/structure out.png [base]
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const login = process.argv[2] === '--login'
const [path = '/studio', out = 'studio.png', base = 'http://localhost:3000'] = login ? [undefined, undefined, process.argv[3]] : process.argv.slice(2)
const profile = fileURLToPath(new URL('./.studio-profile/', import.meta.url))

if (login) {
  // A plain Edge window on the same profile: Google refuses to sign in inside a Playwright-driven browser
  const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync)
  if (!edge) throw new Error('Microsoft Edge introuvable')
  spawn(edge, [`--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', base + path], { stdio: 'ignore' })
    .on('exit', () => console.log('fenêtre fermée, connexion enregistrée'))
} else {
  const ctx = await chromium.launchPersistentContext(profile, { channel: 'msedge', headless: true, viewport: { width: 1440, height: 900 } })
  const page = ctx.pages()[0] ?? await ctx.newPage()
  await page.goto(base + path)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: out })
  await ctx.close()
}
