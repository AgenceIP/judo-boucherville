// One-off importer: old judoboucherville.com text dumps -> data/archive/*.json + public/archive images.
// Run from a work dir holding html/ (downloaded .php pages) and text/ (output of extract-legacy.mjs):
//   node <repo>/scripts/extract-legacy.mjs && node <repo>/scripts/import-legacy.mjs   (DRY=1 skips downloads)
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const REPO = path.resolve(import.meta.dirname, '..')
const sharp = createRequire(REPO + '/package.json')('sharp')
const OLD = 'https://judoboucherville.com/'
const OUT_DATA = process.env.DRY ? 'dry' : REPO + '/data/archive'
const OUT_PUB = REPO + '/public/archive'
fs.mkdirSync(OUT_DATA, { recursive: true })

const read = f => fs.readFileSync('text/' + f + '.txt', 'utf8').replace(/^[\s\S]*?Contenu principale de la page -->/, '')

// ---------- assets ----------
const assetJobs = new Map() // oldUrl -> {kind, out}
const slugPath = p => p.replace(/^(\.\.\/|\/)+/, '').replace(/^html\//, '').replace(/[^A-Za-z0-9/._-]+/g, '-')
function img(src) {
  if (/Medailles\/|histats/.test(src)) return null
  const rel = slugPath(src).replace(/\.(jpe?g|png|gif|bmp)$/i, '.webp')
  const url = src.startsWith('http') ? src : OLD + src.replace(/^(\.\.\/)+/, '').replace(/^\//, '')
  assetJobs.set(url, { kind: 'img', out: '/archive/' + rel })
  return url
}
function doc(href) {
  const url = OLD + 'html/' + href.replace(/^html\//, '')
  const rel = '/archive/docs/' + path.basename(href).replace(/[^A-Za-z0-9._-]+/g, '-')
  assetJobs.set(url, { kind: 'pdf', out: rel })
  return url
}

// ---------- line -> blocks ----------
const MEDAL = { gold: 'or', silver: 'argent', bronze: 'bronze' }
let athleteByPhp = {}
function mapHref(u) {
  u = u.trim()
  if (/^mailto:|^tel:/.test(u)) return u
  if (/histats/.test(u)) return null
  if (/^https?:\/\//.test(u)) {
    const m = u.match(/^https?:\/\/(www\.)?judoboucherville\.com\/(html\/)?(.*)$/i)
    if (!m) return u
    u = m[3]
  }
  if (/\.(jpe?g|png|gif)$/i.test(u)) return null
  if (/\.pdf$/i.test(u)) return doc(u)
  const php = path.basename(u.replace(/#.*$/, ''))
  const base = php.replace(/\.php$/, '')
  if (athleteByPhp[base]) return '/athletes/' + athleteByPhp[base]
  let m
  if ((m = base.match(/^resultats(\d{4}-\d{4})$/))) return '/resultats/' + m[1]
  if ((m = base.match(/^actualite(\d{4}-\d{4})$/))) return '/actualites/archives/' + m[1]
  return null
}

function lineBlocks(line) {
  const out = []
  line = line.replace(/\[IMG [^\]]*?(gold|silver|bronze)medal\.gif\]/g, (_, c) => `⟨${MEDAL[c]}⟩`)
  line = line.replace(/\[IMG ([^\]]+)\]\s*(\{\{([^}]+)\}\})?/g, (_, src, _l, href) => {
    const u = img(src.trim())
    if (u) out.push({ t: 'img', src: u })
    if (href && !/\.(jpe?g|png|gif)$/i.test(href)) return ` {{${href}}}`
    return ' '
  })
  // links
  const parts = []
  let last = 0
  for (const m of line.matchAll(/\{\{([^}]+)\}\}/g)) {
    parts.push({ text: line.slice(last, m.index), href: m[1] })
    last = m.index + m[0].length
  }
  const tail = line.slice(last)
  for (const p of parts) {
    const text = p.text.replace(/^[\s|:-]+|[\s|:]+$/g, '').trim()
    const href = mapHref(p.href)
    if (href) out.push({ t: 'a', text: text || 'Lien', href })
    else if (text) out.push({ t: 'p', text })
  }
  const t = tail.replace(/^\s*[|]+|[|]+\s*$/g, '').trim()
  if (t && t !== '-' && !/^\|+$/.test(t)) out.push({ t: 'p', text: t })
  return out
}

// normalize text into [{level, text}] with empty heading merged into next line
function lines(txt) {
  const raw = txt.split('\n').map(l => l.trim().replace(/^\|\s*/, '').replace(/\s*\|$/, '').trim()).filter(l => l && l !== '|')
  const res = []
  for (let i = 0; i < raw.length; i++) {
    const m = raw[i].match(/^(#{1,6})\s*(.*)$/)
    if (m) {
      let text = m[2]
      if (!text && i + 1 < raw.length && !/^#/.test(raw[i + 1])) text = raw[++i]
      if (text) res.push({ level: m[1].length, text })
    } else res.push({ level: 0, text: raw[i] })
  }
  return res
}

const DATEBAR = /^(\d{1,2}(?:\s*[-/]\s*\d{1,2})?[./-]\d{1,2}[./-]+\d{4})\s*\|\s*(.*)$/
const DATEISH = /\d{1,2}(er)?\b.{0,12}\b(janv|f[ée]v|mars|avr|mai|juin|juil|ao[uû]|sept|oct|nov|d[ée]c)[a-zéû]*\.?\s+\d{4}|\d{1,2}[./-]\d{1,2}[./-]+\d{4}/i
const hasYear =s => /\b(19|20)\d{2}\b/.test(s)
const plain = s => s.replace(/⟨\w+⟩/g, '').replace(/\{\{[^}]*\}\}/g, '').replace(/\[IMG[^\]]*\]/g, '').trim()

function pushLine(entry, l) {
  // headings on the old site often carry stray links ("Total {{url}}") — keep the text only
  if (l.level) l = { ...l, text: l.text.replace(/\{\{[^}]*\}\}/g, '').trim() }
  if (/^Médailles\s*:\s*\d+$/i.test(plain(l.text))) return // redundant with the medal line
  const mm = l.text.replace(/\[IMG [^\]]*?(gold|silver|bronze)medal\.gif\]/g, (_, c) => `⟨${MEDAL[c]}⟩`).match(/⟨or⟩\s*(\d+)\D*⟨argent⟩\s*(\d+)\D*⟨bronze⟩\s*(\d+)/)
  if (mm) { entry.blocks.push({ t: 'm', o: +mm[1], a: +mm[2], b: +mm[3] }); return }
  const bl = lineBlocks(l.text)
  for (const b of bl) if (b.text) b.text = b.text.replace(/^-\s*/, '').replace(/\s+-(?=\s?[A-Za-zÀ-ÿ⟨])/g, ' ·').trim()
  if (l.level) {
    const first = bl.find(b => b.t === 'p')
    if (first && !/⟨/.test(first.text)) first.t = 'h'
  }
  entry.blocks.push(...bl)
}

const CATEGORY = /^(U\d+|Senior|Masters?|Vétéran|Individuel(le)?|Par équipe|Kata|Total)\b|\d+V\s*\d+D|^\d*kg/i
function finalize(e) {
  e.blocks = e.blocks.filter(b => b.t !== 'p' || b.text.replace(/[-–|\s]/g, ''))
  if (!e.titre) {
    const i = e.blocks.findIndex(b => b.t === 'h' || b.t === 'p')
    if (i >= 0 && e.blocks[i].text.length < 160 && !CATEGORY.test(e.blocks[i].text)) e.titre = e.blocks.splice(i, 1)[0].text
    else e.titre = e.lieu || e.date || ''
  }
  e.titre = e.titre.replace(/⟨\w+⟩/g, '').trim()
  return e
}

// ---------- news ----------
function parseNews(txt) {
  const entries = []
  let cur = null
  for (const l of lines(txt)) {
    const db = l.text.match(DATEBAR)
    // h5 is also used for photo captions and result tables: only a short line carrying a date opens a story
    const p5 = plain(l.text)
    if ((l.level === 5 && p5.length <= 60 && DATEISH.test(p5)) || (db && l.level === 0)) {
      if (cur) entries.push(finalize(cur))
      cur = db ? { date: db[1].replace(/\s+/g, ''), lieu: db[2].trim(), blocks: [] } : { date: l.text, blocks: [] }
      continue
    }
    if (!cur) { if (process.env.DRY) console.error('preamble:', l.text.slice(0, 90)); continue } // season header, decorative dojo image
    if (l.level && l.level <= 4 && !cur.titre && !cur.blocks.some(b => b.t === 'p' || b.t === 'h')) {
      const t = plain(l.text)
      if (t) { cur.titre = t; const extra = lineBlocks(l.text).filter(b => b.t !== 'p'); cur.blocks.push(...extra); continue }
    }
    pushLine(cur, l)
  }
  if (cur) entries.push(finalize(cur))
  return entries
}

// ---------- results ----------
function parseResults(txt) {
  const entries = []
  let cur = null
  let lastDate = null
  for (const l of lines(txt)) {
    const db = l.text.match(DATEBAR)
    const t = plain(l.text)
    if (db && (l.level === 5 || l.level === 0)) {
      if (cur) entries.push(finalize(cur))
      lastDate = { date: db[1].replace(/\s+/g, ''), lieu: db[2].trim() }
      cur = { ...lastDate, blocks: [] }
      continue
    }
    if (l.level >= 1 && l.level <= 2) continue // "## Résultats"
    if (l.level === 3 && /^\d{4}\s*-\s*\d{4}$/.test(t)) continue // season header
    const isEvent = (l.level === 3 || l.level === 4 || l.level === 5) && hasYear(t) && !/⟨/.test(l.text) && !/^(Total|Médailles|\(Résultats)/i.test(t)
    if (isEvent) {
      if (cur && !cur.titre && !cur.blocks.some(b => b.t === 'p' || b.t === 'h')) {
        cur.titre = t
        cur.blocks.push(...lineBlocks(l.text).filter(b => b.t !== 'p'))
        continue
      }
      if (cur) entries.push(finalize(cur))
      cur = { ...(lastDate && entries.length && cur ? { date: cur.date, lieu: cur.lieu } : {}), titre: t, blocks: [] }
      cur.blocks.push(...lineBlocks(l.text).filter(b => b.t !== 'p'))
      continue
    }
    if (!cur) cur = { titre: '', blocks: [] }
    pushLine(cur, l)
  }
  if (cur) entries.push(finalize(cur))
  return entries.filter(e => e.blocks.length || e.titre)
}

// ---------- athletes ----------
const LABELS = [
  ['naissance', /^Date de naissance\s*:\s*(.*)$/i],
  ['debut', /^d[ée]but au judo\s*:\s*(.*)$/i],
  ['grade', /^Grade\s*:\s*(.*)$/i],
  ['etudes', /^Domaine d.[ée]tude\s*:\s*(.*)$/i],
  ['faits', /^R[ée]sultats int[ée]ressants\s*:\s*(.*)$/i],
  ['objCourt', /^Objectif [àa] court terme\s*:\s*(.*)$/i],
  ['objLong', /^Objectif [àa] long terme\s*:\s*(.*)$/i],
]
const slugify = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
function parseAthlete(txt) {
  const people = []
  const photos = []
  let p = null, field = null, season = null
  const add = (v) => {
    v = v.replace(/^-\s*/, '').trim()
    if (!v || v === '-') return
    if (season) season.resultats.push(v)
    else if (field === 'faits' || field === 'objCourt' || field === 'objLong') (p[field] ??= []).push(v)
    else if (field) p[field] = p[field] ? p[field] + ' ' + v : v
  }
  for (const l of lines(txt)) {
    const imgs = [...l.text.matchAll(/\[IMG ([^\]]+)\]/g)].map(m => img(m[1].trim())).filter(Boolean)
    const text = plain(l.text)
    if (!p && imgs.length) { photos.push(...imgs); if (!text) continue }
    if (l.level === 2 && text) { p = { nom: text, saisons: [] }; people.push(p); field = null; season = null; continue }
    if (!p) continue
    if (imgs.length) photos.push(...imgs)
    const sm = text.match(/^R[ée]sultats\s+(\d{4}\s*-\s*\d{4})\s*:\s*(.*)$/i)
    if (sm) {
      const v = sm[2].match(/Victoires?\s*:\s*(\d+)/i), d = sm[2].match(/D[ée]faites?\s*:\s*(\d+)/i)
      season = { saison: sm[1].replace(/\s/g, ''), victoires: v ? +v[1] : null, defaites: d ? +d[1] : null, resultats: [] }
      p.saisons.push(season); field = null; continue
    }
    const lab = LABELS.find(([, re]) => re.test(text))
    if (lab) { field = lab[0]; season = null; add(text.match(lab[1])[1]); continue }
    if (text) add(text)
  }
  return { photos: [...new Set(photos)], people }
}

// ---------- teams ----------
function parseTeam(txt) {
  const out = []
  for (const l of lines(txt)) {
    const lone = l.text.match(/^\{\{([A-Za-z0-9_-]+)\.php\}\}$/)
    if (lone) { const prev = out.at(-1); if (prev && !prev.php && lone[1] !== 'Construction') prev.php = lone[1]; continue }
    const m = l.text.match(/^([^{[]+?)\s*\{\{([A-Za-z0-9_-]+)\.php\}\}\s*$/)
    const name = m ? m[1].trim() : (!/\{\{|\[IMG|Contenu|Cliquer|Le Club de judo|^Équipe/.test(l.text) && !l.level ? l.text.trim() : null)
    if (!name || /^(U\d+|Senior|Master|Kata|Anciens athlètes)$/.test(name)) continue
    const php = m?.[2]
    out.push({ nom: name, php: php && php !== 'Construction' ? php : null })
  }
  // dedupe by name
  return out.filter((x, i, a) => a.findIndex(y => y.nom === x.nom) === i)
}

// ---------- journaux ----------
function parseJournaux(txt) {
  const items = []
  const re = /\[IMG ([^\]]+)\]\s*\n?\s*([^\n{]*?)\s*\{\{([^}]+\.pdf)\}\}/gi
  for (const m of txt.matchAll(re)) {
    const thumb = img(m[1].trim())
    items.push({ titre: m[2].trim(), thumb, pdf: OLD + 'html/' + m[3].trim() })
  }
  return items
}

// ================= run =================
const teamPages = { canada: 'EquipeCanada', quebec: 'EquipeQuebec', 'sport-etudes': 'EquipeSportEtudes', u10: 'EquipeU10', u12: 'EquipeU12', u14: 'EquipeU14', u16: 'EquipeU16', u18: 'EquipeU18', u21: 'EquipeU21', senior: 'EquipeSenior', master: 'EquipeMaster', kata: 'EquipeKata', anciens: 'EquipeRetraite' }
const teams = Object.fromEntries(Object.entries(teamPages).map(([k, f]) => [k, parseTeam(read(f))]))
const phpSet = new Set(Object.values(teams).flat().map(x => x.php).filter(Boolean))
// profile pages that exist on disk but are only linked from older lists
const profileFiles = fs.readdirSync('html').map(f => f.replace(/\.php$/, '')).filter(b => {
  const t = fs.existsSync('text/' + b + '.txt') ? read(b) : ''
  return /Date de naissance/i.test(t)
})
profileFiles.forEach(b => phpSet.add(b))

const athletes = []
for (const php of [...phpSet].sort()) {
  if (!fs.existsSync('text/' + php + '.txt')) { console.log('no profile', php); continue }
  const { photos, people } = parseAthlete(read(php))
  if (!people.length) { console.log('empty profile', php); continue }
  const nom = people.map(p => p.nom).join(' et ')
  const slug = slugify(nom)
  athleteByPhp[php] = slug
  athletes.push({ slug, php, nom, photos, personnes: people })
}
for (const list of Object.values(teams)) for (const m of list) { m.slug = m.php ? athleteByPhp[m.php] ?? null : null; delete m.php }
for (const a of athletes) delete a.php

const seasons = f => f.match(/(\d{4}-\d{4})/)[1]
const newsFiles = fs.readdirSync('text').filter(f => /^actualite\d{4}-\d{4}\.txt$/.test(f)).map(f => f.slice(0, -4))
const resFiles = fs.readdirSync('text').filter(f => /^resultats\d{4}-\d{4}\.txt$/.test(f)).map(f => f.slice(0, -4))
const actualites = newsFiles.map(f => ({ saison: seasons(f), entrees: parseNews(read(f)) })).filter(s => +s.saison.slice(5) - +s.saison.slice(0, 4) === 1 && s.entrees.length)
  .sort((a, b) => b.saison.localeCompare(a.saison))
{ // the same story is sometimes posted on two season pages: keep the newest season's copy
  const seen = new Set()
  for (const s of actualites) s.entrees = s.entrees.filter(e => { const k = e.date + e.titre; if (seen.has(k)) return false; seen.add(k); return true })
}
const resultats = resFiles.map(f => ({ saison: seasons(f), entrees: parseResults(read(f)) })).filter(s => +s.saison.slice(5) - +s.saison.slice(0, 4) === 1 && s.entrees.length)
// resultats2012-2013.php on the old site also contains a full copy of 2014-2015: drop entries that belong to another season
const yearOf = d => d?.match(/(\d{4})$/)?.[1]
for (const s of resultats) s.entrees = s.entrees.filter(e => { const y = yearOf(e.date); return !y || s.saison.includes(y) || !resultats.some(o => o !== s && o.saison.includes(y) && o.entrees.some(x => x.date === e.date && x.titre === e.titre)) })

const journFiles = fs.readdirSync('text').filter(f => /^Journaux\d{4}-\d{4}\.txt$/.test(f) && !f.startsWith('Journaux1900')).map(f => f.slice(0, -4))
const journaux = journFiles.map(f => ({ periode: seasons(f), numeros: parseJournaux(read(f)) })).filter(j => j.numeros.length)
  .concat([{ periode: '1970 et avant', numeros: parseJournaux(read('Journaux1900-1970')) }])

// ---------- download + optimize ----------
const results = new Map()
const jobs = [...assetJobs.entries()]
let done = 0
async function run([url, job]) {
  const file = OUT_PUB.replace(/\/archive$/, '') + job.out
  try {
    if (fs.existsSync(file)) {
      if (job.kind === 'img') { const m = await sharp(file).metadata(); results.set(url, { src: job.out, w: m.width, h: m.height }) } else results.set(url, { src: job.out })
      return
    }
    const r = await fetch(encodeURI(url).replace(/%25/g, '%'))
    if (!r.ok) return
    const buf = Buffer.from(await r.arrayBuffer())
    fs.mkdirSync(path.dirname(file), { recursive: true })
    if (job.kind === 'img') {
      const isThumb = /Journaux\//.test(url)
      const { data, info } = await sharp(buf).rotate().resize({ width: isThumb ? 360 : 1200, withoutEnlargement: true }).webp({ quality: isThumb ? 68 : 70 }).toBuffer({ resolveWithObject: true })
      fs.writeFileSync(file, data)
      results.set(url, { src: job.out, w: info.width, h: info.height })
    } else { fs.writeFileSync(file, buf); results.set(url, { src: job.out }) }
  } catch (e) { /* unreachable or corrupt: dropped */ } finally { if (++done % 100 === 0) console.log('assets', done, '/', jobs.length) }
}
if (!process.env.DRY) for (let i = 0; i < jobs.length; i += 16) await Promise.all(jobs.slice(i, i + 16).map(run))

// ---------- rewrite urls ----------
function fixBlocks(bl) {
  return bl.flatMap(b => {
    if (b.t === 'img') { const r = results.get(b.src); return r ? [{ t: 'img', src: r.src, w: r.w, h: r.h }] : [] }
    if (b.t === 'a' && assetJobs.has(b.href)) { const r = results.get(b.href); return r ? [{ ...b, href: r.src }] : [] }
    return [b]
  }).filter((b, i, a) => !(b.t === 'img' && a.findIndex(x => x.t === 'img' && x.src === b.src) !== i))
}
for (const s of [...actualites, ...resultats]) for (const e of s.entrees) e.blocks = fixBlocks(e.blocks)
for (const a of athletes) a.photos = a.photos.map(u => results.get(u)).filter(Boolean)
for (const j of journaux) j.numeros = j.numeros.map(n => ({ ...n, thumb: results.get(n.thumb)?.src ?? null }))

const w = (f, d) => fs.writeFileSync(OUT_DATA + '/' + f, JSON.stringify(d))
w('actualites.json', actualites.sort((a, b) => b.saison.localeCompare(a.saison)))
w('resultats.json', resultats.sort((a, b) => b.saison.localeCompare(a.saison)))
w('journaux.json', journaux)
w('athletes.json', { equipes: teams, athletes })
console.log('news', actualites.map(s => s.saison + ':' + s.entrees.length).join(' '))
console.log('results', resultats.map(s => s.saison + ':' + s.entrees.length).join(' '))
console.log('journaux', journaux.map(j => j.periode + ':' + j.numeros.length).join(' '))
console.log('athletes', athletes.length, 'assets ok', results.size, '/', assetJobs.size)
