// Records or compares the visible text of every page (FR and EN) — the migration's safety net.
// Usage: node scripts/snapshot-text.mjs record|compare [base]
import { chromium } from 'playwright'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const [mode = 'record', base = 'http://localhost:3000'] = process.argv.slice(2)
const OUT = new URL('./snapshots/before.json', import.meta.url)

// Spelling pairs the migration merges on purpose (one athlete document per person).
const NOMS = {
  'Melody Grenier': 'Mélody Grenier',
  'Edouard Chassé': 'Édouard Chassé',
  'Noah Beauregrad': 'Noah Beauregard',
  'Askan Khahan Zamora': 'Ashkan Khahan Zamora',
  'Jerome Lajoie et Jacob St-Jean': 'Jérome Lajoie et Jacob St-Jean',
  'Eric De Rome et Ludovic Durrieu': 'Éric De Rome et Ludovic Durrieu',
  'Marie-Michele Girard': 'Marie-Michèle Girard',
  'Alex Emond': 'Alexandre Emond',
  'Emile Nadeau-Denis': 'Émile Nadeau-Denis',
}
const normalize = (path, text) => {
  for (const [from, to] of Object.entries(NOMS)) text = text.replaceAll(from, to)
  // the old site printed raw medal markers in a few link lines; the new one shows icons
  text = text.replace(/⟨(or|argent|bronze)⟩/g, '').replace(/[ \t]+/g, ' ')
  // team lists become alphabetical: compare the athletes page as a sorted set of lines
  if (/\/athletes$/.test(path)) text = [...new Set(text.split('\n'))].sort().join('\n')
  return text
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
const paths = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => new URL(m[1]).pathname)
  .flatMap(p => [p, p.replace(/^\/fr(?=\/|$)/, '/en')]))].sort()

const browser = await chromium.launch({ channel: 'msedge' })
const context = await browser.newContext({ reducedMotion: 'reduce' })
const result = {}
const queue = [...paths]
await Promise.all(Array.from({ length: 4 }, async () => {
  const page = await context.newPage()
  for (let path; (path = queue.shift());) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    result[path] = normalize(path, (await page.locator('main').innerText()).replace(/[ \t]+/g, ' ').trim())
  }
}))
await browser.close()

if (mode === 'record') {
  await mkdir(new URL('./snapshots/', import.meta.url), { recursive: true })
  await writeFile(OUT, JSON.stringify(result, null, 1))
  console.log(`recorded ${paths.length} pages`)
} else {
  const before = JSON.parse(await readFile(OUT, 'utf8'))
  const all = [...new Set([...Object.keys(before), ...Object.keys(result)])].sort()
  const diff = all.filter(p => before[p] !== result[p])
  for (const p of diff) {
    const a = (before[p] ?? '(absent)').split('\n'), b = (result[p] ?? '(absent)').split('\n')
    const i = a.findIndex((line, k) => line !== b[k])
    console.log(`✗ ${p}\n  avant : ${a[i]}\n  après : ${b[i]}`)
  }
  console.log(diff.length ? `${diff.length} page(s) differ` : `identical (${all.length} pages)`)
  process.exit(diff.length ? 1 : 0)
}
