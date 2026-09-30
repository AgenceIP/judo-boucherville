# Sanity CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fayçal (head coach, non-technical) edits every piece of site content in a French Sanity Studio at `/studio`, and a published change reaches the live site in under a minute without a redeploy.

**Architecture:** Content moves from `data/*.ts`, `data/archive/*.json` and three pages' inline data into a Sanity dataset (migrated once with deterministic `_id`s). A thin content layer (`lib/content/`) runs GROQ with an ISR fetch (revalidated every 30 s), plus a drafts client used only in draft mode, and post-processes results into the **same TypeScript shapes the components already use**, so page code changes at the import, not in the markup. The Studio is embedded at `/studio`, in French, with a menu shaped like the site, singletons, per-field help, and click-to-edit through the Presentation tool.

**Tech Stack:** Next.js 16.2.6 App Router (Turbopack), React 19.2.4, next-intl, Tailwind 4, sanity 6.16.0, next-sanity 13.3.4, styled-components 6.5.3, @sanity/locale-fr-fr 1.2.37, @sanity/orderable-document-list 2.0.25; dev: groq-js 2.0.0, tsx 4.23.15 (migration only, removed in Task 14), @sanity/client (scripts); vitest 4 (jsdom), Playwright with Edge (`channel: 'msedge'`).

**Spec:** `docs/superpowers/specs/2026-09-29-sanity-cms-design.md` (read it first; this plan argues from it).

## Global Constraints

- Git: work on `redesign-tatami` only. **Never push `master` or deploy production without Yousif's explicit OK for that push.** Never commit `.claude/settings.local.json`. Never `git filter-branch` or force-push.
- Commits: small, conventional (`feat(cms): …`, `test(cms): …`), each message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Commit messages with French apostrophes go through a quoted heredoc (`git commit -F- <<'EOF'`), never `-m`.
- Ask Yousif before: production deploys, deleting Sanity data, inviting Fayçal (or anyone) to Sanity, anything that costs money. The Sanity free plan must be enough.
- Secrets: `SANITY_API_WRITE_TOKEN` lives in `.env.local` only, **never in Vercel**. `SANITY_API_READ_TOKEN` is server-side (no `NEXT_PUBLIC_` prefix) and goes to Vercel. `.env*` is already gitignored.
- Amira Bousbiat: her photos must never appear on the site or in Sanity. Do not run `scripts/import-legacy.mjs` (it would re-import them); it is deleted in Task 14.
- Local server: never run `next build` while something listens on :3000. Free the port first (PowerShell): `Get-NetTCPConnection -LocalPort 3000 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force -Confirm:$false }`.
- Design: out of scope (motifs, kanji, logos, colours, fonts, the v6 motion level). No Lenis. Yuji Boku only for decorative kanji.
- Studio copy: every label, description, validation message and help text is in French, plain words, with a real example from the site. No technical field is visible (ids, slugs, sort order).
- Minimal code: reuse `lib/schedule.ts` and next-sanity's re-exports (`createClient`, `PortableText`, …). No `@sanity/image-url` (the CDN URL plus the hotspot is enough). `@sanity/client` is only a devDependency for the scripts (Task 8).
- Tests: `npx vitest run` must stay green (26 tests today), `npx tsc --noEmit` must pass, and `npm run lint` must pass after every task.

## Deviations from the spec (tell Yousif)

1. **No `sanity typegen`.** The hand-kept types in `lib/content/types.ts` (copied from today's `data/` types) are checked by a groq-js round-trip test over the real migrated documents (Task 8) and by the text snapshot compare (Tasks 1, 9–12). Same guarantee, no generated file to maintain.
2. **`COLONNES_TARIF` becomes editable** as `club.inscription.colonnesTarif` (« Avant le 19 août », « Après le 19 août » change every season).
3. **Shapes that change:** `Instructeur.photoSrc` → `photo?: Photo`; `Programme.qr` stays a URL string but comes from an uploaded image; challenge `commanditaires` become `[src, nom]` (a full logo URL instead of a file name); `Entree.blocks` → `Entree.contenu` (Portable Text); `Journal.thumb` becomes optional; `Programme.colonnes` is always resolved (the programme's own columns, else the club's); `Saison` lists carry `saisons: string[]`; an instructor line's grade is optional (a name typed by hand has none); ambient photos become `Photo` objects (`src`, `w`, `h`, `pos` from the hotspot, `alt`, `altEn`).
4. **Slugs are set automatically at the first « Publier »** by a custom publish action (hidden field, unique, never changed afterwards so URLs stay stable).
5. **No Live API: pages are cached 30 s (ISR).** A published change is online within about a minute, with no redeploy. `SANITY_API_READ_TOKEN` stays on the server: it is used only in draft mode (Presentation) and by the route that turns draft mode on. Visitors never receive it.
6. The Navigation's programme menu stays in code (menus are UI, per the spec's out-of-scope list). The help page says so and names Yousif as the person to ask.
7. The two spellings « Emile / Émile Nadeau-Denis » become one athlete (« Émile Nadeau-Denis »), like the eight other spelling pairs: 92 athlete documents, not 93.
8. **English fields fall back to French** when left empty, so a forgotten translation never shows a blank.
9. **Some club fields are required** (contact details, head coach, registration text, social links): the site cannot render without them, so the Studio refuses to publish them empty.
10. **Instructor lines in a programme** point to an instructor's card (name and grade follow it) or take a name typed by hand. **Newspapers** are ordered by hand (drag and drop), like programmes and instructors.
11. **On `/resultats/2014-2015`, six link lines now show medal icons** where the old site printed the raw markers. The snapshot compare ignores the markers for that reason.
12. **Build details:** the news and results archives fetch one season per page; `PageHero` splits into a server part (fetches the photos) and a client part (reads the URL); `Blocks.tsx` goes in Task 12 with its last importer; the migration runs with `tsx`; the repo is already linked to Vercel.
13. **The end-to-end test publishes through the API**, not by clicking in the Studio: it proves Studio load and publish-to-site. Yousif tests the clicking himself (Task 15, the six help tasks, cold; the spec said five, the help page has six since click-to-edit got its own).

## Review Focus

1. **A field Fayçal clears** (English description, notes, lieu) must render as absent, never as `null` text or an empty heading; required lists (groupes, tarifs, photos, personnes) default to `[]`. → Task 7, `clean()` and `opt()` tests.
2. **A new article or a new season lands on top**: a new « nouvelle » in 2026-2027 appears first in its season, and the season appears first in the season nav, with no manual sort field. → Task 5 (`tri` initial value) and Task 7 (`groupSaisons` test).
3. **Athletes:** an athlete unchecked from every team disappears from the athletes page (profile still reachable if it has one); names with accents sort with French collation (« Édouard » between « David » and « Frédéric »); a team with nobody left is hidden. → Task 7, `buildEquipes` tests.
4. **Calendar dates:** an event from Aug 30 to Sep 2 shows once, under August, as « 30/08–02/09 »; events that ended before the current season started are hidden, so old seasons don't pile up. → Task 7, `buildCalendrier` tests.
5. **Stega (click-to-edit markers) must never reach logic fields**: slugs, hrefs, schedules parsed by `parseHoraire`, clientèles, seasons, dates, emails and phone numbers stay clean in draft mode, or the week grid and links break for the person previewing. → Task 13, `stegaFilter` tests.

---

## File Structure

**Create**

| Path | Responsibility |
|---|---|
| `scripts/snapshot-text.mjs` | Record / compare the visible text of every FR and EN route (the migration's safety net) |
| `data/pages.ts` | Conseil, historique and téléchargements data moved out of the pages (Task 2, deleted in Task 14) |
| `data/photos.ts` | The eight ambient photos with FR/EN alt text (Task 2, deleted in Task 14) |
| `sanity.config.ts` | Studio config: French locale, structure, Presentation, singletons, publish action |
| `sanity.cli.ts` | CLI config (project id, dataset) for `npx sanity …` |
| `sanity/env.ts` | Project id, dataset, API version, read from env |
| `sanity/schemas/index.ts` | Exports `schemaTypes` |
| `sanity/schemas/champs.ts` | Shared field builders: `slugField`, `texte`, `paragraphe`, `liste`, `nombre`, `lien`, `image`, `pdf`, `documentPdf`, `objets`, `groupe` |
| `sanity/schemas/{club,programme,instructeur,evenement,ceintureNoire,challenge,athlete,article,journaux,conseil,historique,telechargements,photosSite}.ts` | One document type each (`article.ts` exports both `actualite` and `resultat`) |
| `sanity/schemas/contenu.ts` | The Portable Text field for news and results: headings, bold, links, images, medal button, medal tally |
| `sanity/validation.ts` | `horaireWarning`, `clienteleWarning`, `prixWarning`, `lienError` |
| `sanity/equipes.ts` | The 13 team keys and labels (shared by schema, structure, athletes page) |
| `sanity/structure.ts` | Site-shaped menu |
| `sanity/actions.ts` | `withSlug` publish action |
| `sanity/HelpPane.tsx` | « Comment faire » page |
| `sanity/presentation.ts` | Presentation tool `resolve` (document ↔ page URL) |
| `app/studio/layout.tsx`, `app/studio/[[...tool]]/page.tsx` | Embedded Studio |
| `lib/slug.ts`, `lib/saison.ts` | `slugify`, `saisonCourante`, `debutSaison`, `saisonValide` |
| `lib/sanity/client.ts`, `lib/sanity/stega.ts` | Client and `sanityFetch` (ISR, or drafts in draft mode), stega filter |
| `lib/content/types.ts` | The site's content types (moved from `data/`) |
| `lib/content/queries.ts` | GROQ strings |
| `lib/content/transform.ts` | Pure post-processing: `clean`, `photo`, `toClub`, `toChallenge`, `buildCalendrier`, `buildEquipes`, `groupSaisons`, `medailles` |
| `lib/content/index.ts` | `getClub`, `getProgrammes`, … (fetch + transform) |
| `components/archive/Contenu.tsx` | Portable Text renderer (replaces `Blocks`) |
| `components/archive/Medal.tsx` | Medal icon (moved out of `Blocks`) |
| `components/shared/PageHeroView.tsx` | Client half of `PageHero` |
| `components/sanity/DisableDraftMode.tsx` | « Quitter l'aperçu » button |
| `app/api/draft-mode/enable/route.ts`, `app/api/draft-mode/disable/route.ts` | Draft mode on/off |
| `scripts/migrate/transform.ts`, `scripts/migrate/check.ts`, `scripts/migrate-to-sanity.ts` | Migration (pure transform, dataset check, runner with asset upload); deleted in Task 14 |
| `scripts/studio-shot.mjs` | Logged-in Studio screenshots for the smoke check and the help page |
| `scripts/e2e-cms.mjs` | End-to-end: the Studio loads, a published change reaches the page |
| `public/studio-help/*.png` | Help screenshots |
| Tests: `lib/__tests__/slug.test.ts`, `lib/__tests__/saison.test.ts`, `sanity/__tests__/validation.test.ts`, `lib/content/__tests__/transform.test.ts`, `lib/content/__tests__/queries.test.ts`, `lib/sanity/__tests__/stega.test.ts`, `scripts/migrate/__tests__/roundtrip.test.ts`, `components/archive/__tests__/Contenu.test.tsx` | |

**Modify:** `package.json`, `.gitignore`, `next.config.ts`, `proxy.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/[locale]/layout.tsx`, every page under `app/[locale]/` that imports `@/data`, `components/home/{ClassFinder,WeekSchedule,Sections,TourHero}.tsx`, `components/layout/{Footer,Navigation}.tsx`, `components/pages/{ProgrammeTemplate,InstructeurTemplate}.tsx`, `components/ui/InstructorCard.tsx`, `components/shared/PageHero.tsx` (+ its test), `components/archive/SeasonArchive.tsx`.

**Delete:** `components/archive/Blocks.tsx` (Task 12, `Medal` moved out first). In Task 14: `data/`, `scripts/import-legacy.mjs`, `scripts/extract-legacy.mjs`, `scripts/migrate/` (with the round-trip test), `scripts/migrate-to-sanity.ts`, `scripts/snapshot-text.mjs`, `public/archive/`, `public/images/{photos,qr,challenge,scraped}/`. Kept: `public/images/{Dojo,Logos,brand}/` and the logo.

---

### Task 1: Text snapshot of the current site

The migration's safety net: every route's visible text, FR and EN, before anything moves.

**Files:**
- Create: `scripts/snapshot-text.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `node scripts/snapshot-text.mjs record [base]` writes `scripts/snapshots/before.json`; `node scripts/snapshot-text.mjs compare [base]` prints every differing route and exits 1 on any difference. `base` defaults to `http://localhost:3000`. Tasks 2, 9, 10, 11, 12 and 13 run `compare`.

- [ ] **Step 1: Write the script**

```js
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
```

- [ ] **Step 2: Ignore the output**

Append to `.gitignore`:

```
scripts/snapshots/
```

- [ ] **Step 3: Record against the current build**

The production server from commit c71aca4's build is already on :3000 (the docs commits since then touch no page). If nothing listens on :3000: `npm run build && npx next start -p 3000` in the background.

Run: `node scripts/snapshot-text.mjs record`
Expected: `recorded N pages` with N ≈ 180 (90 FR routes from the sitemap + their EN twins). Open `scripts/snapshots/before.json` and check `/fr/athletes` and `/en/programmes/judo-enfants` contain real text.

- [ ] **Step 4: Prove compare works**

Run: `node scripts/snapshot-text.mjs compare`
Expected: `identical (N pages)`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/snapshot-text.mjs .gitignore
git commit -F- <<'EOF'
test(cms): snapshot the visible text of every page before the migration

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Move inline page data and ambient photos into `data/`

The migration reads only `data/`. Conseil, historique and téléchargements keep their data inside the page files, and the eight ambient photos are hard-coded paths in three components. Move them out, unchanged, so the text snapshot stays identical.

**Files:**
- Create: `data/pages.ts`, `data/photos.ts`
- Modify: `app/[locale]/conseil/page.tsx:15-52`, `app/[locale]/historique/page.tsx:23-112`, `app/[locale]/telechargements/page.tsx:3-36`, `components/home/Sections.tsx:96-99,245`, `components/shared/PageHero.tsx:14-22,47`, `components/home/TourHero.tsx:15`

**Interfaces:**
- Produces (`data/pages.ts`): `membres: [string, string, string, string][]` ([rôle FR, rôle EN, nom, courriel]), `presidents: [string, string][]` ([mandat, nom]), `timeline: [string, string, string, string][]` ([date FR, date EN, texte FR, texte EN]), `type Participation = [number, string, string, string?]`, `international: [string, string, Participation[]][]`, `ancienDojo: string[]`, `inauguration: string[]`, `telechargements: { titre: [string, string]; docs: { titre: string; href: string }[] }[]`.
- Produces (`data/photos.ts`): `photosSite: Record<PhotoKey, { src: string; alt: string; altEn: string }>` with `type PhotoKey = 'murCjb' | 'murCjbLoin' | 'tatamiLong' | 'valeursRespect' | 'kano' | 'ceinturesNoires' | 'hautsGrades' | 'entree'`.

- [ ] **Step 1: Create `data/pages.ts`**

Cut these declarations out of the pages, verbatim (values and source comments), paste them into `data/pages.ts`, and add `export` to each:
- from `app/[locale]/conseil/page.tsx`: `membres` (lines 15-25) and `presidents` (lines 27-52);
- from `app/[locale]/historique/page.tsx`: `timeline` (lines 23-34), `Participation` (line 37), `international` (lines 38-106), `ancienDojo` (line 108), `inauguration` (lines 109-112);
- from `app/[locale]/telechargements/page.tsx`: `OLD` (line 4, not exported) and `groupes` (lines 6-36), **renamed `telechargements`**.

- [ ] **Step 2: Import them back in the pages**

```ts
// app/[locale]/conseil/page.tsx
import { membres, presidents } from '@/data/pages'
// app/[locale]/historique/page.tsx
import { ancienDojo, inauguration, international, timeline } from '@/data/pages'
// app/[locale]/telechargements/page.tsx
import { telechargements as groupes } from '@/data/pages'
```

Delete the now-unused `ponytail:` comment about old PDFs from `telechargements/page.tsx` (it moves with `OLD` into `data/pages.ts`).

- [ ] **Step 3: Create `data/photos.ts`**

```ts
// The site's ambient photos (home sections, page heroes, tour ending on phones).
export type PhotoKey = 'murCjb' | 'murCjbLoin' | 'tatamiLong' | 'valeursRespect' | 'kano' | 'ceinturesNoires' | 'hautsGrades' | 'entree'

export const photosSite: Record<PhotoKey, { src: string; alt: string; altEn: string }> = {
  murCjb: {
    src: '/images/photos/mur-cjb.jpg',
    alt: 'Le logo du Club de Judo Boucherville peint sur le mur de bois du dojo',
    altEn: 'The Club de Judo Boucherville logo painted on the dojo’s wooden wall',
  },
  murCjbLoin: {
    src: '/images/photos/mur-cjb-loin.jpg',
    alt: 'Le mur du club et son logo, vus depuis le tatami jaune',
    altEn: 'The club wall and its logo, seen from the yellow tatami',
  },
  tatamiLong: {
    src: '/images/photos/tatami-long.jpg',
    alt: 'Le tatami du dojo, jaune et bleu, vu vers le mur du club',
    altEn: 'The yellow and blue tatami, looking toward the club wall',
  },
  valeursRespect: {
    src: '/images/photos/valeurs-respect.jpg',
    alt: 'Le mur des valeurs : Respect, Contrôle de soi, Amitié',
    altEn: 'The values wall: Respect, Self-control, Friendship',
  },
  kano: {
    src: '/images/photos/kano.jpg',
    alt: 'Portrait de Jigoro Kano, fondateur du judo, sous le mot Honneur',
    altEn: 'Portrait of Jigoro Kano, founder of judo, under the word Honour',
  },
  ceinturesNoires: {
    src: '/images/photos/ceintures-noires.jpg',
    alt: 'Le tableau des ceintures noires du club',
    altEn: 'The club’s black belt board',
  },
  hautsGrades: {
    src: '/images/photos/hauts-grades.jpg',
    alt: 'Le tableau des hauts gradés du club, sous le mot Sincérité',
    altEn: 'The club’s high-grades board, under the word Sincerity',
  },
  entree: {
    src: '/images/photos/entree.jpg',
    alt: 'Le dojo vu de l’entrée, le tatami et le mur du club au fond',
    altEn: 'The dojo from the entrance, the tatami and the club wall at the far end',
  },
}
```

- [ ] **Step 4: Use it in the three components**

`components/home/Sections.tsx` — add `import { photosSite as P } from '@/data/photos'`, then replace the five `<Photo src="/images/photos/…" alt={fr ? '…' : '…'} …>` props (lines 96-99, 245) with the matching key, e.g.:

```tsx
<Photo src={P.tatamiLong.src} alt={fr ? P.tatamiLong.alt : P.tatamiLong.altEn} className="col-span-6 md:col-span-3 md:row-span-2 aspect-[4/5] md:aspect-auto" sizes="(min-width: 768px) 50vw, 100vw" />
```

(`valeursRespect`, `kano`, `ceinturesNoires` on lines 97-99, `entree` on line 245; keep every `className` and `sizes` as is.)

`components/shared/PageHero.tsx` — replace the paths in `PHOTOS` (lines 14-22) and the fallback (line 47) with keys:

```ts
import { photosSite, type PhotoKey } from '@/data/photos'

const PHOTOS: [RegExp, PhotoKey][] = [
  [/programmes/, 'tatamiLong'],
  [/inscription/, 'murCjb'],
  [/equipe/, 'kano'],
  [/ceintures-noires/, 'ceinturesNoires'],
  [/historique|conseil/, 'hautsGrades'],
  [/contact/, 'entree'],
  [/resultats|athletes|challenge/, 'murCjbLoin'],
]
// line 47:
const photo = photosSite[PHOTOS.find(([re]) => re.test(pathname))?.[1] ?? 'valeursRespect'].src
```

`components/home/TourHero.tsx:15`:

```ts
import { photosSite } from '@/data/photos'
const ENDING_PHONE = photosSite.murCjb.src
```

- [ ] **Step 5: Verify nothing changed**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
```

Free :3000 (Global Constraints), then `npm run build && npx next start -p 3000` in the background, then:

Run: `node scripts/snapshot-text.mjs compare`
Expected: `identical (N pages)`.

- [ ] **Step 6: Commit**

```bash
git add data/pages.ts data/photos.ts "app/[locale]/conseil/page.tsx" "app/[locale]/historique/page.tsx" "app/[locale]/telechargements/page.tsx" components/home/Sections.tsx components/shared/PageHero.tsx components/home/TourHero.tsx
git commit -F- <<'EOF'
refactor(content): move inline page data and ambient photos into data/

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: Provision Sanity and embed an empty French Studio at `/studio`

Steps marked 🛑 need Yousif at the keyboard (a browser login or an account choice). Stop, tell him exactly what to run or click, and continue when he says it's done.

**Files:**
- Create: `sanity/env.ts`, `sanity.cli.ts`, `sanity.config.ts`, `app/studio/layout.tsx`, `app/studio/[[...tool]]/page.tsx`
- Modify: `package.json` (dependencies), `next.config.ts` (images), `app/robots.ts`, `.env.example`, `.env.local` (not committed)

**Interfaces:**
- Produces: `sanity/env.ts` exports `projectId: string`, `dataset: string`, `apiVersion = '2026-09-01'`. `sanity.config.ts` default-exports the Studio config (Tasks 5, 6 and 13 add to it). Env vars in `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`. In Vercel: the first three only.

- [ ] **Step 1: 🛑 Vercel CLI**

The repo is already linked (`.vercel/project.json`, project `judo-boucherville`). Yousif runs:

```bash
npm i -g vercel@latest
vercel login
```

Check: `vercel env ls` lists the project's variables (names only).

- [ ] **Step 2: Add the Sanity integration (once)**

```bash
vercel integration discover --category cms
vercel integration add sanity --yes --no-claim
```

**Never run `add` twice** (a second run can create a second Sanity project). If the CLI hands off to the browser, 🛑 Yousif picks: free plan, project name « Judo Boucherville », dataset `production`, all environments (Production, Preview, Development). If only the agent-skill install fails afterwards, run just the `npx skills add …` line the CLI prints.

Then `vercel env ls`. If the integration created a **write/editor** token variable in Vercel (any `SANITY_*TOKEN*` other than a read/viewer one), tell Yousif and remove it: `vercel env rm <NAME> --yes` (the write token must never be in Vercel).

- [ ] **Step 3: Pull the Sanity variables into `.env.local` without overwriting it**

```bash
vercel env pull .env.pull.tmp --yes --environment=development
grep -o '^[A-Z_]*SANITY[A-Z_]*' .env.pull.tmp
grep 'SANITY' .env.pull.tmp >> .env.local
rm .env.pull.tmp
```

Expected names: `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (maybe `SANITY_API_READ_TOKEN` too). If the names differ, map them **only** in `sanity/env.ts` and `sanity.cli.ts` (Step 8), nowhere else. Never print values.

- [ ] **Step 4: Install**

```bash
npm i sanity@6.16.0 next-sanity@13.3.4 styled-components@6.5.3 @sanity/locale-fr-fr@1.2.37 @sanity/orderable-document-list@2.0.25
npm i -D groq-js@2.0.0 tsx@4.23.15
npm ls @sanity/ui @sanity/icons
```

Pin the two versions `npm ls` shows as direct dependencies (`npm i @sanity/ui@<v> @sanity/icons@<v>`) so schema files can import icons. Then check the entry points this plan imports exist:

```bash
node -p "Object.keys(require('./node_modules/next-sanity/package.json').exports).join(' ')"
```

Expected to include `./studio`, `./visual-editing`, `./draft-mode`, `./hooks`.

- [ ] **Step 5: 🛑 Tokens**

Yousif runs `npx sanity login` (browser). Then:

```bash
save() { node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>require('fs').appendFileSync('.env.local','\n'+process.argv[1]+'='+JSON.parse(s).key+'\n'))" "$1"; }
grep -q '^SANITY_API_READ_TOKEN=' .env.local || npx sanity tokens add "Site (lecture)" --role=viewer --yes --json | save SANITY_API_READ_TOKEN
npx sanity tokens add "Migration (local)" --role=editor --yes --json | save SANITY_API_WRITE_TOKEN
grep -c '^SANITY_API_\(READ\|WRITE\)_TOKEN=sk' .env.local
```

Expected: `2`. If `tokens add` is not available, 🛑 Yousif creates the two tokens at sanity.io/manage → API → Tokens (same names and roles) and pastes them into `.env.local`.

- [ ] **Step 6: Read token to Vercel (server-side only)**

```bash
for env in production preview development; do
  node -e "process.loadEnvFile('.env.local');process.stdout.write(process.env.SANITY_API_READ_TOKEN)" | vercel env add SANITY_API_READ_TOKEN $env
done
vercel env ls | grep SANITY
```

Skip if Step 2 already put a read token in Vercel. If `preview` asks for a branch, leave it empty (all preview branches). Never add `SANITY_API_WRITE_TOKEN`.

- [ ] **Step 7: CORS (the Studio's hosts)**

```bash
npx sanity cors list
npx sanity cors add http://localhost:3000 --credentials
npx sanity cors add https://www.judoboucherville.com --credentials
vercel inspect "$(vercel ls --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).deployments.find(d=>d.meta?.githubCommitRef==='redesign-tatami')?.url))")"
```

Add the `judo-boucherville-git-redesign-tatami-….vercel.app` alias that `inspect` prints, with `--credentials`. No wildcard origin (another Vercel team could own a matching name).

- [ ] **Step 8: Config files**

`sanity/env.ts`:

```ts
// Relative imports only inside sanity/: the Sanity CLI does not know the @/ alias.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = '2026-09-01'
```

`sanity.cli.ts`:

```ts
import { defineCliConfig } from 'sanity/cli'

// The CLI does not read .env.local on its own
try { process.loadEnvFile('.env.local') } catch {}

export default defineCliConfig({
  api: { projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production' },
})
```

`sanity.config.ts`:

```ts
'use client'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { frFRLocale } from '@sanity/locale-fr-fr'
import { dataset, projectId } from './sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Club de Judo Boucherville',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), frFRLocale()],
  schema: { types: [] },
})
```

`app/studio/layout.tsx` (the root `app/layout.tsx` only returns its children, so the Studio gets its own document, without the site's header, fonts or next-intl):

```tsx
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
```

`app/studio/[[...tool]]/page.tsx`:

```tsx
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 9: Images, robots, env example**

`next.config.ts` — add to `nextConfig`, above `async redirects()`:

```ts
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
```

`app/robots.ts` — `disallow: ['/api/', '/studio']`.

`.env.example` — replace the Sanity block and drop `NEXT_PUBLIC_SANITY_API_VERSION` (the version is fixed in `sanity/env.ts`):

```
# Sanity (the first three are also in Vercel)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_viewer_token
# Local only, for scripts/migrate-to-sanity.ts. Never in Vercel.
SANITY_API_WRITE_TOKEN=your_editor_token
```

- [ ] **Step 10: Verify**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
```

Expected: pass, 26 tests. Free :3000 (Global Constraints), then `npx next dev -p 3000` in the background, then:

```bash
curl -s http://localhost:3000/studio | grep -o 'noindex' | head -1
```

Then open http://localhost:3000/studio in Edge. Expected: `noindex`, and the Studio shows its login screen **in French** (« Se connecter »…). If the page says the project id is missing, the variable names from Step 3 differ: fix `sanity/env.ts`.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json sanity/env.ts sanity.cli.ts sanity.config.ts app/studio next.config.ts app/robots.ts .env.example
git commit -F- <<'EOF'
feat(cms): embed an empty French Sanity Studio at /studio

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 4: Slugs, seasons, Studio warnings and team list (pure functions)

**Files:**
- Create: `lib/slug.ts`, `lib/saison.ts`, `sanity/validation.ts`, `sanity/equipes.ts`
- Test: `lib/__tests__/slug.test.ts`, `lib/__tests__/saison.test.ts`, `sanity/__tests__/validation.test.ts`

**Interfaces:**
- Consumes: `parseHoraire(horaire: string): Seance[]`, `birthYears(clientele: string, season: number): YearRange | null` from `lib/schedule.ts`.
- Produces:
  - `slugify(s: string): string`
  - `saisonCourante(d?: Date): string` (« 2026-2027 » from Aug 1), `debutSaison(saison: string): string` (`'2026-08-01'`), `saisonValide(s: string): boolean`
  - `horaireWarning(h?: string)`, `clienteleWarning(c?: string)`, `prixWarning(prix: string[] | undefined, colonnes: string[])`, `lienError(v?: string)`, each `string | undefined` (the French message, or nothing). Schemas use them as `r => r.custom(v => fn(v) ?? true).warning()` (or `.error()` for `lienError`).
  - `EQUIPES: [key: string, fr: string, en: string][]`, the 13 teams in page order.
- Files under `sanity/` import with relative paths only (`../lib/schedule`), because the Sanity CLI does not know `@/`.

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/slug.test.ts`:

```ts
import { slugify } from '../slug'

describe('slugify', () => {
  it.each([
    ['Édouard Chassé', 'edouard-chasse'],
    ['Jérome Lajoie et Jacob St-Jean', 'jerome-lajoie-et-jacob-st-jean'],
    ['  Judo — enfants (5-6 ans)  ', 'judo-enfants-5-6-ans'],
    ['Fayçal Bousbiat', 'faycal-bousbiat'],
  ])('%s → %s', (s, slug) => expect(slugify(s)).toBe(slug))

  it('stays under 96 characters without a trailing dash', () => {
    const s = slugify('Championnat provincial '.repeat(10))
    expect(s.length).toBeLessThanOrEqual(96)
    expect(s).not.toMatch(/-$/)
  })
})
```

`lib/__tests__/saison.test.ts`:

```ts
import { debutSaison, saisonCourante, saisonValide } from '../saison'

describe('saisonCourante', () => {
  it('switches on August 1', () => {
    expect(saisonCourante(new Date(2026, 6, 31))).toBe('2025-2026')
    expect(saisonCourante(new Date(2026, 7, 1))).toBe('2026-2027')
    expect(saisonCourante(new Date(2027, 0, 15))).toBe('2026-2027')
  })
})

it('debutSaison', () => expect(debutSaison('2026-2027')).toBe('2026-08-01'))

it('saisonValide', () => {
  expect(saisonValide('2026-2027')).toBe(true)
  for (const s of ['2026-2028', '2026', '2026–2027']) expect(saisonValide(s)).toBe(false)
})
```

`sanity/__tests__/validation.test.ts` (the lists are every value on the site today: none may warn):

```ts
import { clienteleWarning, horaireWarning, lienError, prixWarning } from '../validation'

const HORAIRES = [
  'Samedi 09h00 à 10h00', 'Samedi 10h15 à 11h15', 'Samedi 11h30 à 12h30', 'Samedi 13h00 à 14h00',
  'Lundi et vendredi 18h00 à 19h00', 'Mardi et jeudi 18h00 à 19h30, samedi 14h30 à 16h30',
  'Judo : lundi et vendredi 19h00 à 20h30, mercredi 18h00 à 19h30', 'Judo : lundi 19h00 à 20h30, mercredi 19h30 à 21h00',
  'Mardi et jeudi 20h00 à 21h30', 'Lundi, mardi, mercredi ou jeudi 12h00 à 13h00, ou dimanche 14h00 à 15h00',
  'Lundi, mardi, mercredi, jeudi ou vendredi 09h00 à 10h00', 'Mardi, mercredi ou jeudi 16h00 à 17h30',
  'Lundi et mercredi 18h00 à 19h00',
  'Du 06 au 10 juillet 2026', 'Du 17 au 21 août 2026', // day camp: dates, not a weekly class
]
const CLIENTELES = [
  'Nés en 2020-2021', 'Nés en 2018-2019', 'Nés en 2016-2017', 'Nés en 2014-2015', 'Nés en 2016-2017 / 2014-2015',
  'Nés en 2012-2013', 'Nés en 2010-2011', 'Nés en 2007-2008-2009', 'Nés en 2006 et avant',
  'Parents / enfants nés en 2019, 2020, 2021, 2022', 'Femmes et hommes nés en 2010 et avant', 'Femmes nées en 2010 et avant',
  'Femmes et hommes de 50 ans et plus', 'Élèves de 3e, 4e et 5e année', '8 à 13 ans', '16 ans et plus',
]

describe('horaireWarning', () => {
  it.each(HORAIRES)('accepts « %s »', h => expect(horaireWarning(h)).toBeUndefined())
  it('warns, with an example, when the week grid cannot read it', () => {
    expect(horaireWarning('Samedi matin')).toMatch(/Samedi 09h00 à 10h00/)
  })
  it('says nothing while empty (required is checked elsewhere)', () => expect(horaireWarning('')).toBeUndefined())
})

describe('clienteleWarning', () => {
  it.each(CLIENTELES)('accepts « %s »', c => expect(clienteleWarning(c)).toBeUndefined())
  it('warns when the class finder cannot read it', () => expect(clienteleWarning('Tout le monde')).toMatch(/Nés en 2020-2021/))
})

describe('prixWarning', () => {
  const colonnes = ['Avant le 19 août', 'Après le 19 août']
  it('accepts one price per column', () => expect(prixWarning(['265 $', '280 $'], colonnes)).toBeUndefined())
  it('names the columns when the count differs', () => {
    expect(prixWarning(['265 $'], colonnes)).toBe(
      'Il y a 2 colonnes de prix (Avant le 19 août, Après le 19 août) mais 1 prix. Écrivez un prix par colonne, dans le même ordre.')
  })
  it('counts a missing list as zero', () => expect(prixWarning(undefined, ['Coût'])).toMatch(/mais 0 prix/))
})

describe('lienError', () => {
  it.each(['https://forms.gle/x', '/inscription', 'mailto:info@judoboucherville.com', undefined])('accepts %s', v =>
    expect(lienError(v)).toBeUndefined())
  it('rejects a bare domain', () => expect(lienError('www.judo-quebec.qc.ca')).toMatch(/https:\/\//))
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run lib/__tests__/slug.test.ts lib/__tests__/saison.test.ts sanity/__tests__/validation.test.ts`
Expected: FAIL, cannot resolve `../slug`, `../saison`, `../validation`.

- [ ] **Step 3: Implement**

`lib/slug.ts`:

```ts
/** « Édouard Chassé » → « edouard-chasse »: the URL part of a name (accents dropped, 96 characters max). */
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 96).replace(/^-|-$/g, '')
```

`lib/saison.ts`:

```ts
// A club season runs from August 1 to July 31: « 2026-2027 ».
export function saisonCourante(d = new Date()) {
  const y = d.getFullYear() - (d.getMonth() < 7 ? 1 : 0)
  return `${y}-${y + 1}`
}
export const debutSaison = (saison: string) => `${saison.slice(0, 4)}-08-01`
export const saisonValide = (s: string) => /^\d{4}-\d{4}$/.test(s) && Number(s.slice(5)) === Number(s.slice(0, 4)) + 1
```

`sanity/validation.ts`:

```ts
// Studio checks that reuse the site's own parsers: what Fayçal types is what the site can read.
import { birthYears, parseHoraire } from '../lib/schedule'

// Day-camp weeks (« Du 06 au 10 juillet 2026 ») are dates, not a weekly class
const PLAGE = /\bdu \d{1,2} au \d{1,2}\b/i

export const horaireWarning = (h?: string) =>
  !h || PLAGE.test(h) || parseHoraire(h).length > 0
    ? undefined
    : 'L’horaire de la semaine ne sait pas lire ce texte : ce groupe n’y apparaîtra pas. Écrivez le jour et les heures, par exemple « Samedi 09h00 à 10h00 » ou « Lundi et mercredi 18h00 à 19h00 ».'

export const clienteleWarning = (c?: string) =>
  !c || birthYears(c, 2026)
    ? undefined
    : 'Le chercheur de cours ne sait pas lire cette clientèle : ce groupe n’y sera pas proposé. Écrivez par exemple « Nés en 2020-2021 », « 8 à 13 ans » ou « 16 ans et plus ».'

export const prixWarning = (prix: string[] | undefined, colonnes: string[]) => {
  const n = prix?.length ?? 0
  return n === colonnes.length
    ? undefined
    : `Il y a ${colonnes.length} colonnes de prix (${colonnes.join(', ')}) mais ${n} prix. Écrivez un prix par colonne, dans le même ordre.`
}

export const lienError = (v?: string) =>
  !v || /^(\/|https?:\/\/|mailto:)/.test(v) ? undefined : 'Le lien doit commencer par https:// (autre site) ou / (page de ce site).'
```

`sanity/equipes.ts`:

```ts
// The teams of the athletes page, in page order: [key, French, English].
export const EQUIPES: [string, string, string][] = [
  ['canada', 'Équipe du Canada', 'Team Canada'],
  ['quebec', 'Équipe du Québec', 'Team Québec'],
  ['sport-etudes', 'Sport-études', 'Sport-études'],
  ['u10', 'U10', 'U10'],
  ['u12', 'U12', 'U12'],
  ['u14', 'U14', 'U14'],
  ['u16', 'U16', 'U16'],
  ['u18', 'U18', 'U18'],
  ['u21', 'U21', 'U21'],
  ['senior', 'Senior', 'Senior'],
  ['master', 'Master', 'Masters'],
  ['kata', 'Kata', 'Kata'],
  ['anciens', 'Anciens athlètes', 'Alumni'],
]
```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run lib/__tests__/slug.test.ts lib/__tests__/saison.test.ts sanity/__tests__/validation.test.ts`
Expected: PASS. If one of `HORAIRES` or `CLIENTELES` warns, the regex in `lib/schedule.ts` is the truth: fix the warning function, never the data.

- [ ] **Step 5: Full check and commit**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
git add lib/slug.ts lib/saison.ts sanity/validation.ts sanity/equipes.ts lib/__tests__/slug.test.ts lib/__tests__/saison.test.ts sanity/__tests__/validation.test.ts
git commit -F- <<'EOF'
feat(cms): slugs, seasons and Studio warnings that reuse the site's parsers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 5: Content model (schemas, in French)

Every label and help line is in French with a real example from the site. English fields are optional everywhere (empty English falls back to French in the queries, Task 7), except the alt texts of `photosSite`.

**Files:**
- Create: `sanity/schemas/champs.ts`, `sanity/schemas/contenu.ts`, `sanity/schemas/{club,programme,instructeur,evenement,ceintureNoire,challenge,athlete,article,journaux,conseil,historique,telechargements,photosSite,index}.ts`
- Modify: `sanity.config.ts` (`schema.types`)

**Interfaces:**
- Consumes: Task 4's `horaireWarning`, `clienteleWarning`, `prixWarning`, `lienError`, `saisonCourante`, `saisonValide`, `EQUIPES`.
- Produces: document types and field names that Tasks 6–13 query and write. Singletons use their type name as `_id`: `club`, `challenge`, `conseil`, `historique`, `telechargements`, `photosSite`. Exact fields are in the code below; the key ones:
  - `programme`: `orderRank`, `slug`, `titre`, `titreEn`, `categorie`, `resume`, `resumeEn`, `horaire`, `description`, `descriptionEn`, `prealable`, `cours`, `debut`, `inscription`, `groupes[] {clientele, code, horaire}`, `colonnes[]`, `tarifs[] {periode, prix[]}`, `notes[]`, `instructeurs[] {ref → instructeur, nom, grade}`, `formulaire`, `qr` (image), `documents[] {titre, pdf}`, `contacts[] {nom, role, tel, courriel}`.
  - `pdf` fields are objects `{ fichier (file), lien (string) }`.
  - `actualite` / `resultat`: `saison`, `tri` (number, hidden), `date`, `lieu`, `titre`, `contenu` (Portable Text: blocks `normal`/`h4`, inline `medaille {kind}`, `image {petit}`, `bilanMedailles {or, argent, bronze}`).
  - `schemaTypes` (all types) and `SINGLETONS: string[]` from `sanity/schemas/index.ts`.

- [ ] **Step 1: Shared field builders — `sanity/schemas/champs.ts`**

```ts
// Field builders shared by every document type: French label, one line of help, French error.
import { defineArrayMember, defineField, type FieldDefinition, type PreviewValue } from 'sanity'
import { lienError } from '../validation'

const requis = (title: string) => `« ${title} » est obligatoire.`

/** Filled by the publish action (sanity/actions.ts), never shown. */
export const slugField = (source: string) =>
  defineField({ name: 'slug', type: 'slug', hidden: true, readOnly: true, options: { source } })

export const texte = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'string', validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

export const paragraphe = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'text', rows: 4, validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

export const nombre = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'number', validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

export const liste = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: 'array', of: [defineArrayMember({ type: 'string' })] })

export const lien = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({
    name, title, description, type: 'string',
    validation: r => r.custom((v?: string) => (!v ? (obligatoire ? requis(title) : true) : (lienError(v) ?? true))),
  })

export const image = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({ name, title, description, type: 'image', options: { hotspot: true }, validation: r => (obligatoire ? r.required().error(requis(title)) : r) })

/** A PDF, uploaded or already online elsewhere. */
export const pdf = (name: string, title: string, description?: string, obligatoire = false) =>
  defineField({
    name, title, description, type: 'object',
    fields: [
      defineField({ name: 'fichier', title: 'Fichier PDF', type: 'file', options: { accept: 'application/pdf' } }),
      lien('lien', 'Ou un lien vers le PDF', 'Seulement si le PDF est déjà en ligne ailleurs. Exemple : https://www.judo-quebec.qc.ca/…'),
    ],
    validation: r => r.custom((v?: { fichier?: unknown; lien?: string }) =>
      obligatoire && !v?.fichier && !v?.lien ? 'Ajoutez un fichier PDF ou un lien.' : true),
  })

/** A list of objects, each shown in the list as `select.title` / `select.subtitle` (or what `prepare` builds from `select`). */
export const objets = (
  name: string, title: string, description: string | undefined, fields: FieldDefinition[],
  select: Record<string, string>, prepare?: (v: Record<string, any>) => PreviewValue,
) =>
  defineField({ name, title, description, type: 'array', of: [defineArrayMember({ type: 'object', fields, preview: { select, prepare } })] })

export const documentPdf = (name: string, title: string, description?: string) =>
  objets(name, title, description, [
    texte('titre', 'Titre', 'Exemple : « Formulaire d’inscription 2026-2027 »', true),
    pdf('pdf', 'Document', undefined, true),
  ], { title: 'titre' })

/** Puts fields in a form tab. */
export const groupe = <T extends object>(group: string, fields: T[]) => fields.map(f => ({ ...f, group }))
```

- [ ] **Step 2: `sanity/schemas/club.ts`**

```ts
import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'
import { groupe, image, lien, liste, nombre, objets, paragraphe, texte } from './champs'
import { saisonValide } from '../../lib/saison'

export const club = defineType({
  name: 'club',
  title: 'Club et inscription',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'inscription', title: 'Inscription', default: true },
    { name: 'club', title: 'Coordonnées' },
    { name: 'palmares', title: 'Palmarès' },
  ],
  fields: [
    defineField({
      name: 'inscription', title: 'Inscription', type: 'object', group: 'inscription',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'saison', title: 'Saison', type: 'string',
          description: 'Exemple : « 2026-2027 ». Change le chercheur de cours, l’horaire de la semaine et les titres d’inscription.',
          validation: r => r.required().error('« Saison » est obligatoire.')
            .custom((s?: string) => !s || saisonValide(s) || 'Écrivez la saison comme « 2026-2027 » : deux années qui se suivent, avec un trait d’union.'),
        }),
        lien('formulaire', 'Formulaire d’inscription (lien)', 'Exemple : https://forms.gle/7rzQi6hEVvBZ8VhY8', true),
        image('qr', 'Code QR du formulaire', 'L’image du code QR qui mène au formulaire. Sans image, la page Inscription n’affiche pas de code QR.'),
        objets('debutCours', 'Début des cours', 'Une ligne par groupe de cours, dans l’ordre des dates.', [
          texte('programme', 'Cours', 'Exemple : « Cours du samedi »', true),
          texte('programmeEn', 'Cours (anglais)', 'Exemple : « Saturday classes »'),
          texte('date', 'Date', 'Exemple : « 5 septembre 2026 »', true),
          texte('dateEn', 'Date (anglais)', 'Exemple : « September 5, 2026 »'),
        ], { title: 'programme', subtitle: 'date' }),
        paragraphe('enLigne', 'Inscription en ligne', 'Exemple : « En ligne avant le 19 août 2026 pour bénéficier du tarif préférentiel, ou jusqu’au 31 août 2026 (tarif régulier). »', true),
        paragraphe('enLigneEn', 'Inscription en ligne (anglais)'),
        paragraphe('surPlace', 'Inscription sur place', 'Exemple : « Nous serons présents les 17 et 18 août 2026 de 18h00 à 21h00… »', true),
        paragraphe('surPlaceEn', 'Inscription sur place (anglais)'),
        paragraphe('paiement', 'Paiement', 'Exemple : « Chèque libellé à l’ordre du Club de judo Boucherville, ou virement Interac… »', true),
        paragraphe('paiementEn', 'Paiement (anglais)'),
        liste('notes', 'Notes', 'Une phrase par ligne. Exemple : « Les horaires sont sujets à changement selon le nombre d’inscriptions. »'),
        liste('notesEn', 'Notes (anglais)', 'Mêmes phrases, dans le même ordre.'),
        { ...liste('colonnesTarif', 'Colonnes des tarifs', 'Les titres des colonnes de prix, dans l’ordre. Exemple : « Avant le 19 août », « Après le 19 août ». Un programme peut avoir les siennes.'),
          validation: r => r.min(1).error('Ajoutez au moins une colonne de prix.') },
        liste('colonnesTarifEn', 'Colonnes des tarifs (anglais)', 'Exemple : « Before Aug 19 », « After Aug 19 ».'),
      ],
    }),
    ...groupe('club', [
      texte('nom', 'Nom du club', 'Exemple : « Club de Judo Boucherville »', true),
      lien('site', 'Adresse du site', 'Exemple : https://www.judoboucherville.com', true),
      texte('dojo', 'Nom du dojo', 'Exemple : « Dojo Marcel Bourelly »', true),
      texte('lieu', 'Bâtiment', 'Exemple : « Complexe aquatique Laurie-Eve-Cormier »', true),
      texte('adresse', 'Adresse', 'Exemple : « 490, chemin du Lac, Boucherville (Québec) J4B 6X3 »', true),
      texte('tel', 'Téléphone', 'Exemple : « 450 655-1888 »', true),
      texte('courriel', 'Courriel', 'Exemple : « info@judoboucherville.com »', true),
      texte('responsable', 'Entraîneur chef', 'Exemple : « Fayçal Bousbiat »', true),
      texte('president', 'Président', 'Exemple : « Frédéric Bourque »', true),
      lien('instagram', 'Instagram', 'Affiché dans le bas de page.', true),
      lien('facebook', 'Facebook', 'Affiché dans le bas de page.', true),
      lien('twitter', 'X (Twitter)', 'Affiché dans le bas de page.', true),
      lien('tiktok', 'TikTok', 'Affiché dans le bas de page.', true),
      lien('youtube', 'YouTube', 'Affiché dans le bas de page.', true),
      lien('calendrierJudoQuebec', 'Calendrier de Judo Québec (lien)', 'Le PDF des compétitions de la saison, en bas de la page Calendrier.'),
    ]),
    { ...objets('palmares', 'Palmarès du club', 'Médailles aux championnats, sur l’accueil et la page Historique.', [
      texte('championnat', 'Championnat', 'Exemple : « Championnat provincial U15-U16 »', true),
      texte('championnatEn', 'Championnat (anglais)'),
      nombre('or', 'Or', undefined, true),
      nombre('argent', 'Argent', undefined, true),
      nombre('bronze', 'Bronze', undefined, true),
    ], { title: 'championnat' }), group: 'palmares' },
  ],
  preview: { prepare: () => ({ title: 'Club et inscription' }) },
})
```

- [ ] **Step 3: `sanity/schemas/programme.ts`**

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'
import { ClipboardIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { documentPdf, groupe, image, lien, liste, objets, paragraphe, slugField, texte } from './champs'
import { clienteleWarning, horaireWarning, prixWarning } from '../validation'

export const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  icon: ClipboardIcon,
  groups: [
    { name: 'presentation', title: 'Présentation', default: true },
    { name: 'groupes', title: 'Groupes et horaires' },
    { name: 'tarifs', title: 'Tarifs' },
    { name: 'gens', title: 'Instructeurs et contacts' },
    { name: 'documents', title: 'Documents' },
  ],
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'programme' }),
    slugField('titre'),
    ...groupe('presentation', [
      texte('titre', 'Titre', 'Exemple : « Judo enfants »', true),
      texte('titreEn', 'Titre (anglais)', 'Exemple : « Kids judo »'),
      defineField({
        name: 'categorie', title: 'Catégorie', type: 'string',
        options: { layout: 'radio', list: [
          { title: 'Enfants', value: 'enfants' },
          { title: 'Adultes', value: 'adultes' },
          { title: 'Arts martiaux', value: 'arts-martiaux' },
        ] },
        validation: r => r.required().error('Choisissez une catégorie.'),
      }),
      texte('resume', 'Résumé', 'Une phrase, sur la liste des programmes. Exemple : « Jeux d’opposition partagés entre le parent et l’enfant (2019–2022). »', true),
      texte('resumeEn', 'Résumé (anglais)'),
      texte('horaire', 'Horaire court', 'Pour les listes et le bas de page. Exemple : « Sam 09h00–10h00 »', true),
      paragraphe('description', 'Description', 'Laissez une ligne vide entre deux paragraphes.', true),
      paragraphe('descriptionEn', 'Description (anglais)'),
      texte('prealable', 'Préalable', 'Exemple : « Minimum une saison de pratique. »'),
      texte('cours', 'Cours par semaine', 'Exemple : « 2 cours par semaine »'),
      texte('debut', 'Début des cours', 'Exemple : « Samedi 05 septembre 2026 »'),
      texte('inscription', 'Inscription', 'Seulement si elle diffère de l’inscription du club. Exemple : « En ligne avant le 31 août 2026 pour réserver une place. »'),
    ]),
    { ...objets('groupes', 'Groupes', 'Un groupe par âge et par horaire. Ils remplissent l’horaire de la semaine et le chercheur de cours de l’accueil.', [
      defineField({
        name: 'clientele', title: 'Pour qui', type: 'string',
        description: 'Exemple : « Nés en 2020-2021 », « 8 à 13 ans », « 16 ans et plus »',
        validation: r => [r.required().error('« Pour qui » est obligatoire.'), r.custom((v?: string) => clienteleWarning(v) ?? true).warning()],
      }),
      texte('code', 'Code du groupe', 'Exemple : « PES »', true),
      defineField({
        name: 'horaire', title: 'Horaire', type: 'string',
        description: 'Le jour et les heures. Exemple : « Samedi 09h00 à 10h00 » ou « Lundi et mercredi 18h00 à 19h00 »',
        validation: r => [r.required().error('« Horaire » est obligatoire.'), r.custom((v?: string) => horaireWarning(v) ?? true).warning()],
      }),
    ], { title: 'clientele', subtitle: 'horaire' }), group: 'groupes' },
    ...groupe('tarifs', [
      liste('colonnes', 'Colonnes de prix de ce programme', 'Laissez vide pour utiliser les colonnes du club (« Avant le 19 août », « Après le 19 août »). Exemple : « Coût ».'),
      defineField({
        name: 'tarifs', title: 'Tarifs', type: 'array',
        of: [defineArrayMember({
          type: 'object',
          fields: [
            texte('periode', 'Période', 'Exemple : « 05 sep. au 19 déc. (16 semaines) »', true),
            defineField({
              name: 'prix', title: 'Prix', type: 'array', of: [defineArrayMember({ type: 'string' })],
              description: 'Un prix par colonne, dans le même ordre. Exemple : « 265 $ », puis « 280 $ ».',
              validation: r => r.custom(async (prix: string[] | undefined, { document, getClient }) => {
                const propres = (document?.colonnes as string[] | undefined) ?? []
                const colonnes = propres.length ? propres
                  : (await getClient({ apiVersion: '2026-09-01' }).fetch<string[] | null>('*[_id == "club"][0].inscription.colonnesTarif')) ?? []
                return prixWarning(prix, colonnes) ?? true
              }).warning(),
            }),
          ],
          preview: { select: { title: 'periode', prix: 'prix' }, prepare: ({ title, prix }) => ({ title, subtitle: (prix ?? []).join(' · ') }) },
        })],
      }),
      liste('notes', 'Notes', 'Sous les tarifs. Une phrase par ligne.'),
    ]),
    ...groupe('gens', [
      {
        ...objets('instructeurs', 'Instructeurs', 'Choisissez une fiche d’instructeur, ou écrivez le nom et le grade.', [
          defineField({ name: 'ref', title: 'Fiche d’instructeur', type: 'reference', to: [{ type: 'instructeur' }] }),
          texte('nom', 'Nom (sans fiche)', 'Seulement si la personne n’a pas de fiche. Exemple : « Marc Tremblay »'),
          texte('grade', 'Grade affiché', 'Laissez vide pour prendre le grade de la fiche. Exemple : « 2e dan »'),
        ],
        { refNom: 'ref.nom', nom: 'nom', grade: 'grade', refGrade: 'ref.grade', media: 'ref.photo' },
        ({ refNom, nom, grade, refGrade, media }) => ({ title: refNom ?? nom, subtitle: grade ?? refGrade, media })),
        validation: r => r.custom((items?: { ref?: unknown; nom?: string }[]) =>
          (items ?? []).every(i => i.ref || i.nom) || 'Choisissez une fiche d’instructeur, ou écrivez le nom et le grade.'),
      },
      objets('contacts', 'Personnes à joindre', 'Laissez vide pour afficher l’entraîneur chef, le téléphone et le courriel du club.', [
        texte('nom', 'Nom', undefined, true),
        texte('role', 'Rôle', 'Exemple : « Responsable du parascolaire »'),
        texte('tel', 'Téléphone'),
        texte('courriel', 'Courriel'),
      ], { title: 'nom', subtitle: 'role' }),
    ]),
    ...groupe('documents', [
      lien('formulaire', 'Formulaire d’inscription (lien)', 'Exemple : https://forms.gle/vMyBkBuCJj6H8XJc6'),
      image('qr', 'Code QR du formulaire'),
      documentPdf('documents', 'Documents', 'Des PDF à télécharger sur la page du programme.'),
    ]),
  ],
  preview: { select: { title: 'titre', subtitle: 'horaire' } },
})
```

An instructor line with neither a reference nor a name blocks publishing (the array validation above). The grade typed on the line wins over the grade of the reference, because a programme sometimes shows a different grade than the instructor's own page (Task 8 migrates that case).

- [ ] **Step 4: `instructeur`, `evenement`, `ceintureNoire`**

`sanity/schemas/instructeur.ts`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { image, liste, paragraphe, slugField, texte } from './champs'

export const instructeur = defineType({
  name: 'instructeur',
  title: 'Instructeur',
  type: 'document',
  icon: UserIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'instructeur' }),
    slugField('nom'),
    texte('nom', 'Nom', 'Exemple : « Fayçal Bousbiat »', true),
    image('photo', 'Photo', 'Un portrait. Déplacez le point bleu sur le visage pour qu’il reste visible quand la photo est recadrée.'),
    texte('grade', 'Grade', 'Exemple : « 7e dan »', true),
    texte('pnce', 'Certification PNCE', 'Exemple : « PNCE niveau 3 »'),
    defineField({
      name: 'disciplines', title: 'Disciplines', type: 'array', of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'grid', list: [
        { title: 'Judo', value: 'judo' },
        { title: 'Kata', value: 'kata' },
        { title: 'Jiu-jitsu brésilien', value: 'jiu-jitsu-bresilien' },
        { title: 'Aiki ju-jitsu', value: 'aiki-jujitsu' },
      ] },
    }),
    texte('role', 'Rôle', 'Exemple : « Entraîneur chef et directeur technique »', true),
    paragraphe('bio', 'Biographie', 'Laissez une ligne vide entre deux paragraphes.'),
    paragraphe('bioEn', 'Biographie (anglais)'),
    liste('competitions', 'Compétitions et expérience', 'Une ligne par élément. Exemple : « Entraîneur Sport-Études, École secondaire De Mortagne »'),
  ],
  preview: { select: { title: 'nom', subtitle: 'role', media: 'photo' } },
})
```

`sanity/schemas/evenement.ts`:

```ts
import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'
import { lien, texte } from './champs'

export const evenement = defineType({
  name: 'evenement',
  title: 'Événement',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({ name: 'debut', title: 'Date', type: 'date', options: { dateFormat: 'D MMMM YYYY' }, validation: r => r.required().error('« Date » est obligatoire.') }),
    defineField({
      name: 'fin', title: 'Dernier jour (si plusieurs jours)', type: 'date', options: { dateFormat: 'D MMMM YYYY' },
      validation: r => r.custom((fin: string | undefined, { document }) =>
        !fin || !document?.debut || fin >= (document.debut as string) || 'Le dernier jour doit être après la date de début.'),
    }),
    texte('titre', 'Titre', 'Exemple : « Championnat provincial U14-U16 »', true),
    defineField({ ...texte('lieu', 'Lieu', 'Exemple : « Boucherville », « Laval »'), initialValue: 'Boucherville' }),
    lien('lien', 'Lien', 'Une page de ce site (« /inscription ») ou d’un autre (https://www.judo-quebec.qc.ca/…)'),
  ],
  orderings: [{ title: 'Date', name: 'debut', by: [{ field: 'debut', direction: 'desc' }] }],
  preview: { select: { title: 'titre', debut: 'debut', lieu: 'lieu' }, prepare: ({ title, debut, lieu }) => ({ title, subtitle: [debut, lieu].filter(Boolean).join(' · ') }) },
})
```

`sanity/schemas/ceintureNoire.ts`:

```ts
import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'
import { liste, nombre } from './champs'

export const ceintureNoire = defineType({
  name: 'ceintureNoire',
  title: 'Ceintures noires',
  type: 'document',
  icon: StarIcon,
  fields: [
    nombre('annee', 'Année', 'Exemple : 2026', true),
    defineField({ ...liste('noms', 'Noms', 'Une personne par ligne.'), validation: r => r.min(1).error('Ajoutez au moins un nom.') }),
  ],
  orderings: [{ title: 'Année', name: 'annee', by: [{ field: 'annee', direction: 'desc' }] }],
  preview: { select: { annee: 'annee', noms: 'noms' }, prepare: ({ annee, noms }) => ({ title: String(annee ?? ''), subtitle: (noms ?? []).join(', ') }) },
})
```

- [ ] **Step 5: `challenge`**

`sanity/schemas/challenge.ts`:

```ts
import { defineField, defineType } from 'sanity'
import { TrophyIcon } from '@sanity/icons'
import { groupe, image, lien, liste, nombre, objets, pdf, texte } from './champs'

export const challenge = defineType({
  name: 'challenge',
  title: 'Challenge',
  type: 'document',
  icon: TrophyIcon,
  groups: [
    { name: 'edition', title: 'Édition', default: true },
    { name: 'divisions', title: 'Divisions et bourses' },
    { name: 'commanditaires', title: 'Commanditaires' },
    { name: 'palmares', title: 'Palmarès' },
  ],
  fields: [
    ...groupe('edition', [
      nombre('edition', 'Numéro de l’édition', 'Exemple : 27', true),
      defineField({ name: 'date', title: 'Date et heure', type: 'datetime', description: 'Le compte à rebours de la page vise cette date.', validation: r => r.required().error('« Date et heure » est obligatoire.') }),
      nombre('depuis', 'Première édition', 'Exemple : 1997', true),
      liste('pays', 'Pays présents', 'Exemple : « France », « Italie »'),
      liste('paysEn', 'Pays présents (anglais)', 'Mêmes pays, dans le même ordre.'),
      lien('formulaire', 'Formulaire d’inscription (lien)'),
      pdf('programme', 'Programme (PDF)'),
      pdf('devis', 'Devis (PDF)'),
      lien('video', 'Vidéo (lien YouTube)'),
      texte('president', 'Président du comité', 'Exemple : « Olivier Bry »', true),
      objets('couts', 'Coûts par équipe', undefined, [
        texte('athletes', 'Nombre d’athlètes', 'Exemple : « 4 »', true),
        texte('prix', 'Coût', 'Exemple : « 200 $ »', true),
      ], { title: 'athletes', subtitle: 'prix' }),
      objets('limites', 'Dates limites', undefined, [
        texte('pour', 'Pour', 'Exemple : « Équipes du Canada et des États-Unis »', true),
        texte('pourEn', 'Pour (anglais)'),
        texte('date', 'Date', 'Exemple : « 4 avril 2026 »', true),
        texte('dateEn', 'Date (anglais)'),
      ], { title: 'pour', subtitle: 'date' }),
    ]),
    ...groupe('divisions', [
      objets('divisions', 'Divisions', undefined, [
        texte('division', 'Division', 'Exemple : « U14 »', true),
        texte('hommes', 'Catégories hommes (kg)'),
        texte('femmes', 'Catégories femmes (kg)'),
        texte('nes', 'Nés en'),
        texte('nesEn', 'Nés en (anglais)'),
        texte('grades', 'Grades'),
        texte('gradesEn', 'Grades (anglais)'),
        texte('pesee', 'Pesée'),
      ], { title: 'division', subtitle: 'nes' }),
      objets('bourses', 'Bourses', undefined, [
        texte('division', 'Division', 'Exemple : « Masters »', true),
        texte('divisionEn', 'Division (anglais)'),
        texte('montant', 'Montant', 'Exemple : « 800 $ »', true),
      ], { title: 'division', subtitle: 'montant' }),
    ]),
    { ...objets('commanditaires', 'Commanditaires', 'Le logo et le nom de chaque commanditaire.', [
      image('logo', 'Logo', undefined, true),
      texte('nom', 'Nom', undefined, true),
    ], { title: 'nom', media: 'logo' }), group: 'commanditaires' },
    { ...objets('palmares', 'Palmarès', 'Une ligne par année, la plus récente en haut.', [
      nombre('annee', 'Année', undefined, true),
      objets('coupe', 'Coupe des clubs', 'Les trois premiers clubs, dans l’ordre.', [
        texte('club', 'Club', undefined, true),
        nombre('points', 'Points'),
      ], { title: 'club', subtitle: 'points' }),
      objets('divisions', 'Podiums par division', undefined, [
        texte('division', 'Division', undefined, true),
        texte('or', 'Or'), texte('argent', 'Argent'), texte('bronze', 'Bronze'),
        texte('meilleur', 'Meilleur athlète'),
      ], { title: 'division', subtitle: 'or' }),
    ], { title: 'annee' }), group: 'palmares' },
  ],
  preview: { prepare: () => ({ title: 'Challenge' }) },
})
```

- [ ] **Step 6: `athlete`**

`sanity/schemas/athlete.ts`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { groupe, liste, nombre, objets, slugField, texte } from './champs'
import { EQUIPES } from '../equipes'

export const athlete = defineType({
  name: 'athlete',
  title: 'Athlète',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'equipes', title: 'Équipes et photos', default: true },
    { name: 'profil', title: 'Profil' },
  ],
  fields: [
    slugField('nom'),
    ...groupe('equipes', [
      texte('nom', 'Nom', 'Exemple : « Émile Nadeau-Denis ». Pour un duo de kata : « Jérome Lajoie et Jacob St-Jean ».', true),
      defineField({
        name: 'equipes', title: 'Équipes', type: 'array', of: [defineArrayMember({ type: 'string' })],
        description: 'Cochez toutes ses équipes. Décochez tout pour le retirer de la page Athlètes (sa page de profil reste en ligne).',
        options: { layout: 'grid', list: EQUIPES.map(([value, title]) => ({ value, title })) },
      }),
      defineField({
        name: 'photos', title: 'Photos', type: 'array', of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
        options: { layout: 'grid' },
        description: 'Glissez-déposez les photos ici. Avec des photos ou un profil, l’athlète a sa propre page.',
      }),
    ]),
    { ...objets('personnes', 'Profil', 'Une personne (deux pour un duo de kata).', [
      texte('nom', 'Nom', undefined, true),
      texte('naissance', 'Naissance', 'Exemple : « 2008 »'),
      texte('debut', 'Début du judo', 'Exemple : « 2014 »'),
      texte('grade', 'Grade', 'Exemple : « 1er dan »'),
      texte('etudes', 'Études', 'Exemple : « Sport-études, École secondaire De Mortagne »'),
      texte('judoinside', 'Fiche JudoInside (lien)'),
      liste('faits', 'Faits saillants'),
      liste('objCourt', 'Objectifs à court terme'),
      liste('objLong', 'Objectifs à long terme'),
      objets('saisons', 'Résultats par saison', undefined, [
        texte('saison', 'Saison', 'Exemple : « 2025-2026 »', true),
        nombre('victoires', 'Victoires'),
        nombre('defaites', 'Défaites'),
        liste('resultats', 'Résultats', 'Une compétition par ligne. Exemple : « Championnat canadien U18 : 🥈 »'),
      ], { title: 'saison' }),
    ], { title: 'nom' }), group: 'profil' },
  ],
  preview: {
    select: { title: 'nom', equipes: 'equipes', media: 'photos.0' },
    prepare: ({ title, equipes, media }) => ({
      title, media,
      subtitle: (equipes ?? []).map((e: string) => EQUIPES.find(([k]) => k === e)?.[1] ?? e).join(', ') || 'Aucune équipe',
    }),
  },
})
```

- [ ] **Step 7: News and results — `contenu.ts` and `article.ts`**

`sanity/schemas/contenu.ts`:

```ts
// The text editor of news and results: paragraphs, subheadings, bold, links, photos, medals.
import { defineArrayMember, defineField } from 'sanity'
import { nombre } from './champs'
import { lienError } from '../validation'

const MEDAILLES = [
  { title: '🥇 Or', value: 'or' },
  { title: '🥈 Argent', value: 'argent' },
  { title: '🥉 Bronze', value: 'bronze' },
]

export const contenu = defineField({
  name: 'contenu',
  title: 'Texte',
  description: 'Écrivez comme dans un courriel. Le bouton « Médaille » ajoute une pastille or, argent ou bronze dans la ligne.',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Paragraphe', value: 'normal' }, { title: 'Intertitre', value: 'h4' }],
      lists: [],
      marks: {
        decorators: [{ title: 'Gras', value: 'strong' }],
        annotations: [{
          name: 'link', type: 'object', title: 'Lien',
          fields: [defineField({
            name: 'href', title: 'Adresse', type: 'string',
            description: 'Une page de ce site (« /inscription ») ou d’un autre (https://…)',
            validation: r => r.required().error('Ajoutez l’adresse du lien.').custom((v?: string) => lienError(v) ?? true),
          })],
        }],
      },
      of: [defineArrayMember({
        name: 'medaille', title: 'Médaille', type: 'object',
        fields: [defineField({ name: 'kind', title: 'Médaille', type: 'string', options: { list: MEDAILLES, layout: 'radio' }, validation: r => r.required() })],
        preview: { select: { kind: 'kind' }, prepare: ({ kind }) => ({ title: MEDAILLES.find(m => m.value === kind)?.title ?? 'Médaille' }) },
      })],
    }),
    defineArrayMember({
      type: 'image', title: 'Photo', options: { hotspot: true },
      fields: [defineField({ name: 'petit', title: 'C’est un logo (affiché en petit)', type: 'boolean', initialValue: false })],
    }),
    defineArrayMember({
      name: 'bilanMedailles', title: 'Bilan de médailles', type: 'object',
      fields: [nombre('or', '🥇 Or'), nombre('argent', '🥈 Argent'), nombre('bronze', '🥉 Bronze')],
      preview: { select: { or: 'or', argent: 'argent', bronze: 'bronze' }, prepare: ({ or, argent, bronze }) => ({ title: `Bilan : ${or ?? 0} or, ${argent ?? 0} argent, ${bronze ?? 0} bronze` }) },
    }),
  ],
})
```

`sanity/schemas/article.ts`:

```ts
import { defineField, defineType } from 'sanity'
import { DocumentTextIcon, BarChartIcon } from '@sanity/icons'
import { texte } from './champs'
import { contenu } from './contenu'
import { saisonCourante, saisonValide } from '../../lib/saison'

const article = (name: 'actualite' | 'resultat', title: string, icon: typeof DocumentTextIcon) => defineType({
  name, title, type: 'document', icon,
  fields: [
    defineField({
      name: 'saison', title: 'Saison', type: 'string', initialValue: () => saisonCourante(),
      description: 'Exemple : « 2026-2027 ». Déjà remplie avec la saison en cours.',
      validation: r => r.required().error('« Saison » est obligatoire.')
        .custom((s?: string) => !s || saisonValide(s) || 'Écrivez la saison comme « 2026-2027 ».'),
    }),
    // newest on top of its season: new documents get a bigger number than every migrated one
    defineField({ name: 'tri', type: 'number', hidden: true, initialValue: () => Date.now() }),
    texte('date', 'Date affichée', 'Exemple : « 14 mars 2026 » ou « 14-15 mars 2026 »'),
    texte('lieu', 'Lieu', 'Exemple : « Laval »'),
    texte('titre', 'Titre', 'Exemple : « Championnat provincial U14-U16 »'),
    contenu,
  ],
  validation: r => r.custom((d?: { titre?: string; lieu?: string; date?: string }) =>
    d?.titre || d?.lieu || d?.date ? true : 'Écrivez au moins un titre, un lieu ou une date.'),
  orderings: [{ title: 'Plus récentes', name: 'recent', by: [{ field: 'saison', direction: 'desc' }, { field: 'tri', direction: 'desc' }] }],
  preview: {
    select: { titre: 'titre', lieu: 'lieu', date: 'date', saison: 'saison' },
    prepare: ({ titre, lieu, date, saison }) => ({ title: titre ?? lieu ?? date, subtitle: [date, titre && lieu, saison].filter(Boolean).join(' · ') }),
  },
})

export const actualite = article('actualite', 'Nouvelle', DocumentTextIcon)
export const resultat = article('resultat', 'Résultat', BarChartIcon)
```

- [ ] **Step 8: `journaux`, `conseil`, `historique`, `telechargements`, `photosSite`**

`sanity/schemas/journaux.ts`:

```ts
import { defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { image, objets, pdf, texte } from './champs'

// « 1970 et avant » comes last: the order is set by hand in the Studio, not sorted on the period
export const journaux = defineType({
  name: 'journaux',
  title: 'Journaux',
  type: 'document',
  icon: BookIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'journaux' }),
    texte('periode', 'Période', 'Exemple : « 2008-2009 »', true),
    objets('numeros', 'Numéros', undefined, [
      texte('titre', 'Titre', 'Exemple : « Journal de décembre »', true),
      image('vignette', 'Vignette (image de la couverture)'),
      pdf('pdf', 'Journal (PDF)', undefined, true),
    ], { title: 'titre', media: 'vignette' }),
  ],
  preview: { select: { title: 'periode' } },
})
```

`sanity/schemas/conseil.ts`:

```ts
import { defineType } from 'sanity'
import { CaseIcon } from '@sanity/icons'
import { objets, texte } from './champs'

export const conseil = defineType({
  name: 'conseil',
  title: 'Conseil d’administration',
  type: 'document',
  icon: CaseIcon,
  fields: [
    objets('membres', 'Membres', 'Dans l’ordre de la page.', [
      texte('role', 'Rôle', 'Exemple : « Président »', true),
      texte('roleEn', 'Rôle (anglais)'),
      texte('nom', 'Nom', 'Exemple : « Frédéric Bourque »', true),
      texte('courriel', 'Courriel'),
    ], { title: 'nom', subtitle: 'role' }),
    objets('presidents', 'Anciens présidents', 'Le plus récent en haut.', [
      texte('mandat', 'Mandat', 'Exemple : « 2018-2022 »', true),
      texte('nom', 'Nom', undefined, true),
    ], { title: 'nom', subtitle: 'mandat' }),
  ],
  preview: { prepare: () => ({ title: 'Conseil d’administration' }) },
})
```

`sanity/schemas/historique.ts`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'
import { ClockIcon } from '@sanity/icons'
import { nombre, objets, paragraphe, texte } from './champs'

const photos = (name: string, title: string) =>
  defineField({ name, title, type: 'array', options: { layout: 'grid' }, of: [defineArrayMember({ type: 'image', options: { hotspot: true } })] })

export const historique = defineType({
  name: 'historique',
  title: 'Historique',
  type: 'document',
  icon: ClockIcon,
  fields: [
    objets('timeline', 'Ligne du temps', undefined, [
      texte('date', 'Date', 'Exemple : « Mars 1970 »', true),
      texte('dateEn', 'Date (anglais)'),
      paragraphe('texte', 'Texte', undefined, true),
      paragraphe('texteEn', 'Texte (anglais)'),
    ], { title: 'date', subtitle: 'texte' }),
    objets('international', 'Participations internationales', undefined, [
      texte('titre', 'Compétition', 'Exemple : « Jeux olympiques »', true),
      texte('titreEn', 'Compétition (anglais)'),
      objets('participations', 'Participations', undefined, [
        nombre('annee', 'Année', undefined, true),
        texte('athletes', 'Athlète(s)', undefined, true),
        texte('lieu', 'Lieu', undefined, true),
        texte('resultat', 'Résultat'),
      ], { title: 'athletes', subtitle: 'lieu' }),
    ], { title: 'titre' }),
    photos('ancienDojo', 'Photos de l’ancien dojo'),
    photos('inauguration', 'Photos de l’inauguration'),
  ],
  preview: { prepare: () => ({ title: 'Historique' }) },
})
```

`sanity/schemas/telechargements.ts`:

```ts
import { defineType } from 'sanity'
import { DownloadIcon } from '@sanity/icons'
import { documentPdf, objets, texte } from './champs'

export const telechargements = defineType({
  name: 'telechargements',
  title: 'Téléchargements',
  type: 'document',
  icon: DownloadIcon,
  fields: [
    objets('groupes', 'Groupes de documents', 'Dans l’ordre de la page.', [
      texte('titre', 'Titre du groupe', 'Exemple : « Inscription »', true),
      texte('titreEn', 'Titre du groupe (anglais)'),
      documentPdf('docs', 'Documents'),
    ], { title: 'titre' }),
  ],
  preview: { prepare: () => ({ title: 'Téléchargements' }) },
})
```

`sanity/schemas/photosSite.ts`:

```ts
import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { texte } from './champs'

// [key, label, where it shows]
const PHOTOS: [string, string, string][] = [
  ['murCjb', 'Mur du club', 'En-tête de la page Inscription, et la fin de la visite sur téléphone.'],
  ['murCjbLoin', 'Mur du club, vu de loin', 'En-tête des pages Résultats, Athlètes et Challenge.'],
  ['tatamiLong', 'Tatami', 'Accueil (section « Le dojo ») et en-tête des pages Programmes.'],
  ['valeursRespect', 'Mur des valeurs', 'Accueil (section « Le dojo ») et en-tête des autres pages.'],
  ['kano', 'Portrait de Jigoro Kano', 'Accueil (section « Le dojo ») et en-tête de la page Équipe.'],
  ['ceinturesNoires', 'Tableau des ceintures noires', 'Accueil (section « Le dojo ») et en-tête de la page Ceintures noires.'],
  ['hautsGrades', 'Tableau des hauts gradés', 'En-tête des pages Historique et Conseil.'],
  ['entree', 'Entrée du dojo', 'Accueil (section « Nous trouver ») et en-tête de la page Contact.'],
]

export const photosSite = defineType({
  name: 'photosSite',
  title: 'Photos du site',
  type: 'document',
  icon: ImagesIcon,
  fields: PHOTOS.map(([name, title, description]) => defineField({
    name, title, description, type: 'image', options: { hotspot: true },
    fields: [
      texte('alt', 'Description', 'Ce que montre la photo, pour les personnes aveugles et Google. Exemple : « Le tableau des ceintures noires du club »', true),
      texte('altEn', 'Description (anglais)', 'Exemple : « The club’s black belt board »', true),
    ],
    validation: r => r.required().error('Cette photo est obligatoire : elle est affichée sur le site.'),
  })),
  preview: { prepare: () => ({ title: 'Photos du site' }) },
})
```

- [ ] **Step 9: `sanity/schemas/index.ts` and the config**

```ts
import { club } from './club'
import { programme } from './programme'
import { instructeur } from './instructeur'
import { evenement } from './evenement'
import { ceintureNoire } from './ceintureNoire'
import { challenge } from './challenge'
import { athlete } from './athlete'
import { actualite, resultat } from './article'
import { journaux } from './journaux'
import { conseil } from './conseil'
import { historique } from './historique'
import { telechargements } from './telechargements'
import { photosSite } from './photosSite'

export const schemaTypes = [club, programme, instructeur, evenement, ceintureNoire, challenge, athlete, actualite, resultat, journaux, conseil, historique, telechargements, photosSite]

/** One document each, `_id` = type name: opened directly, never created, deleted or duplicated. */
export const SINGLETONS = ['club', 'challenge', 'conseil', 'historique', 'telechargements', 'photosSite']
```

In `sanity.config.ts`: `import { schemaTypes } from './sanity/schemas'` and `schema: { types: schemaTypes }`.

- [ ] **Step 10: Verify**

```bash
node -e "const i=require('@sanity/icons');for(const n of ['HomeIcon','ClipboardIcon','UserIcon','CalendarIcon','StarIcon','TrophyIcon','UsersIcon','DocumentTextIcon','BarChartIcon','BookIcon','CaseIcon','ClockIcon','DownloadIcon','ImagesIcon','HelpCircleIcon'])if(!i[n])console.log('missing',n)"
npx sanity schema validate
npx tsc --noEmit && npx vitest run && npm run lint
```

Expected: no `missing` line (replace any missing icon with `DocumentIcon`), `schema validate` reports no errors, the rest passes. With `npx next dev -p 3000` running, http://localhost:3000/studio lists the 14 types in the default menu (Task 6 reshapes it).

- [ ] **Step 11: Commit**

```bash
git add sanity/schemas sanity.config.ts
git commit -F- <<'EOF'
feat(cms): content model in French, with help lines and warnings on every field

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 6: Studio made for Fayçal — menu, help page, singletons, automatic URLs

**Files:**
- Modify: `lib/slug.ts`, `lib/__tests__/slug.test.ts`, `sanity.config.ts`, `.gitignore`
- Create: `sanity/actions.ts`, `sanity/structure.ts`, `sanity/HelpPane.tsx`, `scripts/studio-shot.mjs`

**Interfaces:**
- Consumes: `slugify` (Task 4), `EQUIPES` (Task 4), `schemaTypes`, `SINGLETONS` (Task 5), `apiVersion` (Task 3).
- Produces: `slugLibre(base: string, pris: string[]): string`; `SLUG_TYPES: Record<string, string>`; `withSlug(publish, context)`; `structure: StructureResolver`; `node scripts/studio-shot.mjs --login [base]` / `node scripts/studio-shot.mjs <path> <out.png> [base]` (Task 15).

- [ ] **Step 1: Failing test for `slugLibre`**

Append to `lib/__tests__/slug.test.ts`:

```ts
import { slugLibre } from '../slug'

describe('slugLibre', () => {
  it('keeps a free slug', () => expect(slugLibre('judo', ['karate'])).toBe('judo'))
  it('adds the first free number', () => expect(slugLibre('judo', ['judo', 'judo-2'])).toBe('judo-3'))
})
```

Run: `npx vitest run lib/__tests__/slug.test.ts` — Expected: FAIL, `slugLibre` is not exported.

- [ ] **Step 2: Implement**

Append to `lib/slug.ts`:

```ts
/** `base`, or `base-2`, `base-3`… if already taken: two athletes with the same name get two pages. */
export function slugLibre(base: string, pris: string[]) {
  let s = base
  for (let i = 2; pris.includes(s); i++) s = `${base}-${i}`
  return s
}
```

Run the test again — Expected: PASS.

- [ ] **Step 3: `sanity/actions.ts` — the URL is written once, at first publish**

The slug field is hidden (Task 5). This action fills it from the name the first time the document is published, then never touches it again, so a renamed programme keeps its URL and old links keep working.

```ts
import { useDocumentOperation, type DocumentActionComponent, type DocumentActionsContext } from 'sanity'
import { apiVersion } from './env'
import { slugLibre, slugify } from '../lib/slug'

/** Types whose page URL comes from a field: written at first publish, never changed after. */
export const SLUG_TYPES: Record<string, string> = { programme: 'titre', instructeur: 'nom', athlete: 'nom' }

const PRIS = '*[_type == $type && defined(slug.current) && !(_id in [$id, "drafts." + $id])].slug.current'

export function withSlug(publish: DocumentActionComponent, context: DocumentActionsContext): DocumentActionComponent {
  const client = context.getClient({ apiVersion })
  const Action: DocumentActionComponent = props => {
    const original = publish(props)
    const { patch } = useDocumentOperation(props.id, props.type)
    const doc = (props.draft ?? props.published) as ({ slug?: { current?: string } } & Record<string, unknown>) | null
    if (!original || doc?.slug?.current) return original
    return {
      ...original,
      onHandle: async () => {
        const pris = await client.fetch<string[]>(PRIS, { type: props.type, id: props.id })
        const base = slugify(String(doc?.[SLUG_TYPES[props.type]] ?? ''))
        patch.execute([{ set: { slug: { _type: 'slug', current: slugLibre(base, pris) } } }])
        original.onHandle?.()
      },
    }
  }
  Action.action = 'publish'
  return Action
}
```

- [ ] **Step 4: `sanity/HelpPane.tsx` — « Comment faire »**

```tsx
import { Card, Container, Heading, Stack, Text } from '@sanity/ui'

const TACHES: { titre: string; image: string; etapes: string[] }[] = [
  { titre: 'Modifier en cliquant sur le site', image: 'presentation.png', etapes: [
    'Cliquez sur « Présentation » en haut de l’écran.',
    'Cliquez sur un texte ou une photo du site : le bon champ s’ouvre à côté.',
    'L’aperçu montre votre changement avant qu’il soit en ligne.',
    'Cliquez sur « Publier ».',
  ] },
  { titre: 'Changer un horaire ou un tarif', image: 'horaire.png', etapes: [
    'Menu « Programmes (horaires et tarifs) », puis le programme.',
    'Onglet « Groupes et horaires ». Écrivez comme l’exemple : « Samedi 09h00 à 10h00 ». Un avertissement jaune veut dire que la grille de la semaine ne comprend pas l’horaire : suivez l’exemple.',
    'Onglet « Tarifs » : un prix par colonne, dans le même ordre que les colonnes.',
    'Cliquez sur « Publier » : le site est à jour en moins d’une minute.',
  ] },
  { titre: 'Ajouter une nouvelle', image: 'nouvelle.png', etapes: [
    'Menu « Nouvelles », puis le bouton « + ».',
    'La saison est déjà remplie. Écrivez la date, le lieu, le titre et le texte.',
    'Le bouton « Médaille » ajoute une médaille d’or, d’argent ou de bronze dans la ligne.',
    'Glissez une photo directement dans le texte.',
    'Cliquez sur « Publier » : la nouvelle arrive en tête de sa saison.',
  ] },
  { titre: 'Ajouter un athlète', image: 'athlete.png', etapes: [
    'Menu « Athlètes », puis l’équipe (par exemple U16), puis « + » : l’équipe est déjà cochée.',
    'Écrivez le nom. Ajoutez des photos si l’athlète doit avoir sa propre page.',
    'Cliquez sur « Publier ». Pour retirer quelqu’un d’une équipe, décochez l’équipe et publiez.',
  ] },
  { titre: 'Changer une photo', image: 'photo.png', etapes: [
    'Ouvrez la fiche (ou « Photos du site » pour les photos d’ambiance).',
    'Glissez la nouvelle photo sur l’ancienne.',
    'Recadrage : placez le point sur le sujet pour qu’il reste visible sur téléphone.',
    'Écrivez la description en français et en anglais, puis cliquez sur « Publier ».',
  ] },
  { titre: 'Annuler une erreur', image: 'historique.png', etapes: [
    'Pas encore publié : menu « … » en bas, puis « Annuler les modifications ».',
    'Déjà publié : icône d’horloge en haut (historique), choisissez une version, « Restaurer », puis « Publier ».',
    'Fiche supprimée par erreur : écrivez à Yousif.',
  ] },
]

export function HelpPane() {
  return (
    <Container width={1} padding={4}>
      <Stack space={5}>
        <Heading size={3}>Comment faire</Heading>
        <Text muted>
          Vos changements restent privés tant que vous n’avez pas cliqué sur « Publier ». S’il manque une information
          obligatoire, le bouton « Publier » est bloqué et le champ à corriger est indiqué en rouge.
        </Text>
        {TACHES.map(({ titre, image, etapes }) => (
          <Card key={titre} padding={4} radius={2} shadow={1}>
            <Stack space={4}>
              <Heading size={1}>{titre}</Heading>
              {etapes.map((e, i) => <Text key={i}>{`${i + 1}. ${e}`}</Text>)}
              {/* eslint-disable-next-line @next/next/no-img-element -- Studio pane, not a site page */}
              <img src={`/studio-help/${image}`} alt={titre} style={{ width: '100%', borderRadius: 4 }}
                onError={e => (e.currentTarget.style.display = 'none')} />
            </Stack>
          </Card>
        ))}
        <Text muted size={1}>
          Les menus du site, les boutons et le design restent dans le code : pour les changer, demandez à Yousif.
        </Text>
      </Stack>
    </Container>
  )
}
```

- [ ] **Step 5: `sanity/structure.ts` — the menu follows the site**

```ts
import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { BookIcon, ClipboardIcon, HelpCircleIcon, UserIcon, UsersIcon } from '@sanity/icons'
import { EQUIPES } from './equipes'
import { HelpPane } from './HelpPane'

type Tri = { field: string; direction: 'asc' | 'desc' }[]

export const structure: StructureResolver = (S, context) => {
  const unique = (type: string, title: string) =>
    S.listItem().title(title).id(type).schemaType(type).child(S.document().schemaType(type).documentId(type).title(title))
  const ordre = (type: string, title: string, icon: typeof UserIcon) =>
    orderableDocumentListDeskItem({ type, title, icon, S, context })
  const liste = (type: string, title: string, by: Tri) =>
    S.documentTypeListItem(type).title(title).child(S.documentTypeList(type).title(title).defaultOrdering(by))
  const athletes = (id: string, title: string, filter: string, params: Record<string, string> = {}) =>
    S.documentList().id(id).title(title).schemaType('athlete').filter(filter).params(params)
      .defaultOrdering([{ field: 'nom', direction: 'asc' }])

  return S.list().title('Contenu').items([
    S.listItem().title('Comment faire').id('aide').icon(HelpCircleIcon).child(S.component(HelpPane).id('aide').title('Comment faire')),
    S.divider(),
    unique('club', 'Club et inscription'),
    ordre('programme', 'Programmes (horaires et tarifs)', ClipboardIcon),
    liste('evenement', 'Calendrier', [{ field: 'debut', direction: 'desc' }]),
    ordre('instructeur', 'Instructeurs', UserIcon),
    S.listItem().title('Athlètes').id('athletes').icon(UsersIcon).child(
      S.list().title('Athlètes').items([
        S.listItem().title('Tous les athlètes').id('tous').child(athletes('tous', 'Tous les athlètes', '_type == "athlete"')),
        S.divider(),
        ...EQUIPES.map(([key, fr]) => S.listItem().title(fr).id(`equipe-${key}`).child(
          athletes(`equipe-${key}`, fr, '_type == "athlete" && $e in equipes', { e: key })
            .initialValueTemplates([S.initialValueTemplateItem('athlete-equipe', { equipe: key })]),
        )),
        S.divider(),
        S.listItem().title('Sans équipe').id('sans-equipe').child(
          athletes('sans-equipe', 'Sans équipe', '_type == "athlete" && count(coalesce(equipes, [])) == 0'),
        ),
      ]),
    ),
    liste('actualite', 'Nouvelles', [{ field: 'saison', direction: 'desc' }, { field: 'tri', direction: 'desc' }]),
    liste('resultat', 'Résultats', [{ field: 'saison', direction: 'desc' }, { field: 'tri', direction: 'desc' }]),
    ordre('journaux', 'Journaux', BookIcon),
    liste('ceintureNoire', 'Ceintures noires', [{ field: 'annee', direction: 'desc' }]),
    S.divider(),
    unique('challenge', 'Challenge'),
    unique('conseil', 'Conseil d’administration'),
    unique('historique', 'Historique'),
    unique('telechargements', 'Téléchargements'),
    unique('photosSite', 'Photos du site'),
  ])
}
```

- [ ] **Step 6: Wire it in `sanity.config.ts`**

Replace the `plugins` and `schema` lines, and add `document`:

```ts
import { structure } from './sanity/structure'
import { SLUG_TYPES, withSlug } from './sanity/actions'
import { schemaTypes, SINGLETONS } from './sanity/schemas'

// inside defineConfig({...}):
  plugins: [structureTool({ structure, title: 'Contenu' }), frFRLocale()],
  schema: {
    types: schemaTypes,
    templates: prev => [
      ...prev.filter(t => !SINGLETONS.includes(t.schemaType)),
      {
        id: 'athlete-equipe', title: 'Athlète dans une équipe', schemaType: 'athlete',
        parameters: [{ name: 'equipe', type: 'string' }],
        value: ({ equipe }: { equipe: string }) => ({ equipes: [equipe] }),
      },
    ],
  },
  document: {
    // the global « + » only offers real content types, never a second Club or the team template
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter(t => t.templateId !== 'athlete-equipe') : prev,
    // singletons: publish, discard, restore only (no delete, no duplicate)
    actions: (prev, context) =>
      SINGLETONS.includes(context.schemaType)
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : context.schemaType in SLUG_TYPES
          ? prev.map(a => (a.action === 'publish' ? withSlug(a, context) : a))
          : prev,
  },
```

- [ ] **Step 7: `scripts/studio-shot.mjs` — screenshots with a saved login**

```js
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
```

Append to `.gitignore`: `scripts/.studio-profile/`

- [ ] **Step 8: Verify**

```bash
npx vitest run lib/__tests__/slug.test.ts
npx sanity schema validate
npx tsc --noEmit && npx vitest run && npm run lint
```

Expected: all pass. Start `npx next dev -p 3000` in the background (free :3000 first, see Global Constraints).

🛑 **Yousif:** run `node scripts/studio-shot.mjs --login`, sign in to Sanity in the window that opens, close it.

Run: `node scripts/studio-shot.mjs /studio/structure menu.png` and open `menu.png`.
Expected: « Comment faire » first, then the 14 entries in the order of Step 5, all in French.

Check by hand in Edge at http://localhost:3000/studio:
- « Club et inscription » opens the form directly; its « … » menu has no « Supprimer » and no « Dupliquer ».
- Athlètes → U16 → « + » opens a new athlete with U16 already checked.
- The global « + » (top left) lists neither Club, Challenge, Conseil, Historique, Téléchargements, Photos du site nor « Athlète dans une équipe ».
- « Comment faire » shows the six tasks (images are hidden until Task 15 adds them).

Close the tab without publishing anything (the dataset is still empty).

- [ ] **Step 9: Commit**

```bash
git add lib/slug.ts lib/__tests__/slug.test.ts sanity/actions.ts sanity/structure.ts sanity/HelpPane.tsx sanity.config.ts scripts/studio-shot.mjs .gitignore
git commit -F- <<'EOF'
feat(cms): site-shaped Studio menu, help page, locked singletons, automatic URLs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 7: Content layer — queries that return today's shapes

Pages will import from `@/lib/content` instead of `@/data`. This task builds and tests that layer against an in-memory dataset (groq-js); no page changes yet.

**Files:**
- Create: `lib/content/types.ts`, `lib/content/queries.ts`, `lib/content/transform.ts`, `lib/content/index.ts`, `lib/sanity/client.ts`, `components/archive/Medal.tsx`, `components/archive/Contenu.tsx`
- Modify: `components/archive/Blocks.tsx` (Medal moves out)
- Test: `lib/content/__tests__/transform.test.ts`, `lib/content/__tests__/queries.test.ts`, `components/archive/__tests__/Contenu.test.tsx`

**Interfaces:**
- Consumes: `EQUIPES` (Task 4), `saisonCourante`, `debutSaison` (Task 4), `projectId`, `dataset`, `apiVersion` (Task 3).
- Produces (used by Tasks 8–13):
  - `sanityFetch<T>(query, params?)` in `lib/sanity/client.ts`; `client`.
  - Getters in `lib/content/index.ts`: `getClub(): Promise<{club, inscription, palmares, totalPalmares}>`, `getProgrammes(): Promise<Programme[]>`, `getProgramme(slug): Promise<Programme | null>`, `getInstructeurs(): Promise<Instructeur[]>`, `getInstructeur(slug): Promise<Instructeur | null>`, `getCalendrier(): Promise<Mois[]>`, `getCeintures(): Promise<{ceintures, total}>`, `getChallenge(): Promise<ChallengeData>`, `getEquipes(): Promise<Equipes>`, `getAthleteSlugs(): Promise<string[]>`, `getAthlete(slug): Promise<Athlete | null>`, `getSaisons(type: 'actualite' | 'resultat'): Promise<string[]>` (newest first), `getSaison(type, saison): Promise<Saison | null>`, `getJournaux(): Promise<Periode[]>`, `getConseil(): Promise<Conseil>`, `getHistorique(): Promise<Historique>`, `getTelechargements(): Promise<Telechargement[]>`, `getPhotosSite(): Promise<PhotosSite>`.
  - `medailles(s: Saison): {or, argent, bronze}` in `lib/content/transform.ts` (re-exported from `lib/content`).
  - Every type in `lib/content/types.ts` (re-exported from `lib/content`).
  - `<Medal kind locale />` from `components/archive/Medal.tsx`; `<Contenu contenu locale alt />` default export of `components/archive/Contenu.tsx`.

- [ ] **Step 1: `lib/content/types.ts`**

Same shapes as `data/`, except: `Photo` gains `pos` (focal point), `Instructeur.photoSrc` becomes `photo: Photo`, `Programme.colonnes` is always resolved, an instructor line's `grade` is optional, `Entree.blocks` becomes `contenu` (Portable Text), `Journal.thumb` is optional.

```ts
export type Photo = { src: string; w: number; h: number; pos?: string }

export type Club = {
  nom: string; site: string; dojo: string; lieu: string; adresse: string; tel: string; courriel: string
  responsable: string; president: string; instagram: string; facebook: string; twitter: string; tiktok: string
  youtube: string; calendrierJudoQuebec?: string
}
export type Inscription = {
  saison: string; formulaire: string; qr?: string
  debutCours: [string, string, string, string][]
  enLigne: string; enLigneEn: string; surPlace: string; surPlaceEn: string; paiement: string; paiementEn: string
  notes: string[]; notesEn: string[]; colonnesTarif: string[]; colonnesTarifEn: string[]
}
export type Palmares = [string, string, number, number, number]

export type Categorie = 'enfants' | 'adultes' | 'arts-martiaux'
export type Programme = {
  slug: string; titre: string; titreEn: string; categorie: Categorie; resume: string; resumeEn: string
  horaire: string; description: string; descriptionEn?: string; prealable?: string; cours?: string; debut?: string
  inscription?: string
  groupes: { clientele: string; code: string; horaire: string }[]
  colonnes: string[]
  tarifs: { periode: string; prix: string[] }[]
  notes?: string[]
  instructeurs: { nom: string; grade?: string; slug?: string | null }[]
  formulaire?: string; qr?: string
  documents?: { titre: string; href: string }[]
  contacts?: { nom: string; role?: string; tel?: string; courriel?: string }[]
}

export type Instructeur = {
  id: string; nom: string; slug: string; photo?: Photo; grade: string; pnce?: string; disciplines: string[]
  role: string; bio?: string; bioEn?: string; competitions: string[]
}

export type Evenement = { jour: string; titre: string; lieu?: string; lien?: string }
export type Mois = { mois: string; moisEn: string; evenements: Evenement[] }

export type Challenge = {
  edition: number; date: string; depuis: number; pays: string[]; paysEn: string[]
  formulaire?: string; programme?: string; devis?: string; video?: string; president: string
  couts: [string, string][]; bourses: [string, string, string][]; limites: [string, string, string, string][]
}
export type Division = [string, string, string, string, string, string, string, string]
export type Ligne = [string, string, string, string, string]
export type Edition = { annee: number; coupe: [string, number?][]; divisions?: Ligne[] }
export type ChallengeData = { challenge: Challenge; divisions: Division[]; commanditaires: [string, string][]; palmaresChallenge: Edition[] }

export type Personne = {
  nom: string; naissance?: string; debut?: string; grade?: string; etudes?: string; judoinside?: string
  faits?: string[]; objCourt?: string[]; objLong?: string[]
  saisons?: { saison: string; victoires?: number; defaites?: number; resultats: string[] }[]
}
export type Athlete = { slug: string; nom: string; photos: Photo[]; personnes: Personne[] }
export type Membre = { nom: string; slug: string | null }
export type Equipes = Record<string, Membre[]>

export type Span = { _type: 'span'; _key: string; text: string; marks?: string[] }
export type MedailleInline = { _type: 'medaille'; _key: string; kind: 'or' | 'argent' | 'bronze' }
export type Bloc =
  | { _type: 'block'; _key: string; style?: 'normal' | 'h4'; children: (Span | MedailleInline)[]; markDefs?: { _key: string; _type: 'link'; href: string }[] }
  | { _type: 'image'; _key: string; src: string; w: number; h: number; petit?: boolean }
  | { _type: 'bilanMedailles'; _key: string; or?: number; argent?: number; bronze?: number }
export type Entree = { date?: string; lieu?: string; titre?: string; contenu: Bloc[] }
export type Saison = { saison: string; entrees: Entree[] }

export type Journal = { titre: string; thumb?: string; pdf: string }
export type Periode = { periode: string; numeros: Journal[] }

export type Conseil = { membres: [string, string, string, string][]; presidents: [string, string][] }
export type Participation = [number, string, string, string?]
export type Historique = {
  timeline: [string, string, string, string][]
  international: [string, string, Participation[]][]
  ancienDojo: string[]; inauguration: string[]
}
export type Telechargement = { titre: [string, string]; docs: { titre: string; href: string }[] }

export const PHOTO_KEYS = ['murCjb', 'murCjbLoin', 'tatamiLong', 'valeursRespect', 'kano', 'ceinturesNoires', 'hautsGrades', 'entree'] as const
export type PhotoKey = (typeof PHOTO_KEYS)[number]
export type PhotosSite = Record<PhotoKey, Photo & { alt: string; altEn: string }>
```

Check `PHOTO_KEYS` against `data/photos.ts` (Task 2): `grep -o "^  [a-zA-Z]*:" data/photos.ts` must print the same 8 keys.

- [ ] **Step 2: Failing transform tests**

`lib/content/__tests__/transform.test.ts`:

```ts
import { buildCalendrier, buildEquipes, clean, groupSaisons, medailles, photo, toChallenge, type ArticleRow, type ChallengeRow } from '../transform'
import type { Bloc } from '../types'

const span = (text: string, marks: string[] = []) => ({ _type: 'span' as const, _key: text, text, marks })
const bloc = (children: Extract<Bloc, { _type: 'block' }>['children'], href?: string): Bloc => ({
  _type: 'block', _key: 'b', style: 'normal', children, markDefs: href ? [{ _key: 'l', _type: 'link', href }] : [],
})

describe('clean', () => {
  it('drops null, undefined and empty strings, keeps 0 and false', () => {
    expect(clean({ a: null, b: '', c: 0, d: false, e: ['x', null, ''], f: { g: undefined } })).toEqual({ c: 0, d: false, e: ['x'], f: {} })
  })
})

describe('photo', () => {
  it('turns the hotspot into an object-position', () => {
    expect(photo({ src: 's', w: 1, h: 1, hotspot: { x: 0.5, y: 0.25 } })).toEqual({ src: 's', w: 1, h: 1, pos: '50% 25%' })
    expect(photo({ src: 's', w: 1, h: 1 })).toEqual({ src: 's', w: 1, h: 1 })
  })
})

describe('groupSaisons', () => {
  const rows: ArticleRow[] = [
    { saison: '2025-2026', tri: 5, titre: 'Ancienne', contenu: [] },
    { saison: '2026-2027', tri: 1, titre: 'Migrée', contenu: [] },
    { saison: '2026-2027', tri: 1770000000000, titre: 'Nouvelle fiche', lieu: '', contenu: [] },
  ]
  it('newest season first, newest entry on top, empty fields dropped', () => {
    const s = groupSaisons(rows)
    expect(s.map(x => x.saison)).toEqual(['2026-2027', '2025-2026'])
    expect(s[0].entrees).toEqual([{ titre: 'Nouvelle fiche', contenu: [] }, { titre: 'Migrée', contenu: [] }])
  })
})

describe('buildEquipes', () => {
  it('sorts in French, links only athletes with a page, hides empty teams', () => {
    const e = buildEquipes([
      { nom: 'Frédéric B', slug: 'frederic-b', equipes: ['u16'], aPage: false },
      { nom: 'Édouard C', slug: 'edouard-c', equipes: ['u16', 'u18'], aPage: true },
      { nom: 'David A', slug: 'david-a', equipes: ['u16'], aPage: true },
      { nom: 'Sans Équipe', slug: 'sans-equipe', equipes: [], aPage: true },
    ])
    expect(e.u16).toEqual([{ nom: 'David A', slug: 'david-a' }, { nom: 'Édouard C', slug: 'edouard-c' }, { nom: 'Frédéric B', slug: null }])
    expect(e.u18).toEqual([{ nom: 'Édouard C', slug: 'edouard-c' }])
    expect(Object.keys(e)).toEqual(['u16', 'u18'])
  })
})

describe('buildCalendrier', () => {
  const today = new Date(2026, 8, 29) // season 2026-2027 started on 2026-08-01
  const m = buildCalendrier([
    { debut: '2026-07-20', fin: '2026-07-31', titre: 'Fini' },
    { debut: '2026-07-28', fin: '2026-08-02', titre: 'Camp' },
    { debut: '2026-08-17', fin: '2026-08-18', titre: 'Inscriptions', lieu: 'Boucherville' },
    { debut: '2026-08-30', fin: '2026-09-02', titre: 'Stage' },
    { debut: '2026-09-04', titre: 'Rentrée', lien: '' },
  ], today)
  it('hides events that ended before the season, groups by start month', () => {
    expect(m.map(x => x.mois)).toEqual(['Juillet 2026', 'Août 2026', 'Septembre 2026'])
    expect(m[0]).toEqual({ mois: 'Juillet 2026', moisEn: 'July 2026', evenements: [{ jour: '28/07–02/08', titre: 'Camp' }] })
    expect(m[1].evenements).toEqual([{ jour: '17-18', titre: 'Inscriptions', lieu: 'Boucherville' }, { jour: '30/08–02/09', titre: 'Stage' }])
    expect(m[2].evenements).toEqual([{ jour: '04', titre: 'Rentrée' }])
  })
})

describe('medailles', () => {
  it('counts the medals in the text, links included, but not the tally block', () => {
    const contenu: Bloc[] = [
      bloc([span('Léa '), { _type: 'medaille', _key: 'm1', kind: 'or' }]),
      bloc([span('Résultats', ['l']), { _type: 'medaille', _key: 'm2', kind: 'bronze' }], 'https://x.org'),
      { _type: 'bilanMedailles', _key: 't', or: 9, argent: 9, bronze: 9 },
    ]
    expect(medailles({ saison: 's', entrees: [{ contenu }] })).toEqual({ or: 1, argent: 0, bronze: 1 })
  })
})

describe('toChallenge', () => {
  it('rebuilds the tuples the page reads, with empty cells as ""', () => {
    const row: ChallengeRow = {
      edition: 27, date: '2026-04-11T12:00:00Z', depuis: 1997, pays: ['France'], paysEn: ['France'], president: 'P',
      couts: [{ athletes: '4', prix: '200 $' }], bourses: [{ division: 'Masters', divisionEn: 'Masters', montant: '800 $' }],
      limites: [{ pour: 'Canada', pourEn: 'Canada', date: '4 avril', dateEn: 'April 4' }],
      divisions: [{ division: 'U14', hommes: '-40', femmes: null, nes: '2013', nesEn: '2013', grades: 'Jaune', gradesEn: 'Yellow', pesee: '8 h' }],
      commanditaires: [{ logo: 'https://cdn.sanity.io/l.png', nom: 'Resto' }],
      palmares: [{ annee: 2025, coupe: [{ club: 'A', points: 30 }, { club: 'B', points: null }], divisions: [] }],
    }
    const c = toChallenge(row)
    expect(c.challenge.couts).toEqual([['4', '200 $']])
    expect(c.challenge.bourses).toEqual([['Masters', 'Masters', '800 $']])
    expect(c.challenge.limites).toEqual([['Canada', 'Canada', '4 avril', 'April 4']])
    expect(c.divisions).toEqual([['U14', '-40', '', '2013', '2013', 'Jaune', 'Yellow', '8 h']])
    expect(c.commanditaires).toEqual([['https://cdn.sanity.io/l.png', 'Resto']])
    expect(c.palmaresChallenge).toEqual([{ annee: 2025, coupe: [['A', 30], ['B']] }])
    expect(c.challenge).not.toHaveProperty('formulaire')
  })
})
```

Run: `npx vitest run lib/content` — Expected: FAIL, `../transform` not found.

- [ ] **Step 3: `lib/content/transform.ts`**

```ts
import { EQUIPES } from '@/sanity/equipes'
import { debutSaison, saisonCourante } from '@/lib/saison'
import {
  PHOTO_KEYS, type Athlete, type Bloc, type ChallengeData, type Club, type Conseil, type Division, type Equipes,
  type Historique, type Inscription, type Instructeur, type Ligne, type Mois, type Palmares, type Participation,
  type PhotosSite, type Saison, type Telechargement,
} from './types'

type Hotspot = { x: number; y: number }
type Vide = string | null | undefined

/** GROQ returns null for empty fields; the site's types use "absent". Drops null, undefined and '' at every level. */
export function clean<T>(v: T): T {
  if (Array.isArray(v)) return v.filter(x => x != null && x !== '').map(clean) as T
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x != null && x !== '').map(([k, x]) => [k, clean(x)])) as T
  }
  return v
}

/** Sanity's focal point (hotspot) becomes a CSS object-position, so a cropped photo keeps its subject in view. */
export function photo<T extends { hotspot?: Hotspot }>({ hotspot, ...p }: T): Omit<T, 'hotspot'> & { pos?: string } {
  return hotspot ? { ...p, pos: `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%` } : p
}

export type ClubRow = Club & {
  inscription: Omit<Inscription, 'debutCours'> & { debutCours: { programme: string; programmeEn: string; date: string; dateEn: string }[] }
  palmares: { championnat: string; championnatEn: string; or: number; argent: number; bronze: number }[]
}
export function toClub(r: ClubRow) {
  const { inscription: { debutCours, ...inscription }, palmares, ...club } = clean(r)
  const p: Palmares[] = palmares.map(x => [x.championnat, x.championnatEn, x.or, x.argent, x.bronze])
  return {
    club: club as Club,
    inscription: { ...inscription, debutCours: debutCours.map(d => [d.programme, d.programmeEn, d.date, d.dateEn]) } as Inscription,
    palmares: p,
    totalPalmares: p.reduce((t, [, , o, a, b]) => [t[0] + o, t[1] + a, t[2] + b], [0, 0, 0]),
  }
}

export type InstructeurRow = Omit<Instructeur, 'photo'> & { photo?: { src: string; w: number; h: number; hotspot?: Hotspot } }
export const toInstructeur = (r: InstructeurRow): Instructeur => {
  const { photo: p, ...i } = clean(r)
  return p ? { ...i, photo: photo(p) } : i
}

export type AthleteRow = Omit<Athlete, 'photos'> & { photos: { src: string; w: number; h: number; hotspot?: Hotspot }[] }
export const toAthlete = (r: AthleteRow): Athlete => {
  const a = clean(r)
  return { ...a, photos: a.photos.map(photo) }
}

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export type EvenementRow = { debut: string; fin?: string; titre: string; lieu?: string; lien?: string }
/** Events of the current season (and later), grouped by start month, in date order. */
export function buildCalendrier(rows: EvenementRow[], today = new Date()): Mois[] {
  const depuis = debutSaison(saisonCourante(today))
  const mois: Mois[] = []
  for (const { debut, fin, titre, lieu, lien } of rows) {
    if ((fin ?? debut) < depuis) continue
    const [a, m, j] = debut.split('-')
    const jour = !fin || fin === debut ? j
      : fin.slice(0, 7) === debut.slice(0, 7) ? `${j}-${fin.slice(8)}`
      : `${j}/${m}–${fin.slice(8)}/${fin.slice(5, 7)}`
    const nom = `${MOIS[+m - 1]} ${a}`
    let g = mois.at(-1)
    if (g?.mois !== nom) mois.push((g = { mois: nom, moisEn: `${MONTHS[+m - 1]} ${a}`, evenements: [] }))
    g.evenements.push(clean({ jour, titre, lieu, lien }))
  }
  return mois
}

export type EquipeRow = { nom: string; slug?: string | null; equipes?: string[] | null; aPage: boolean }
/** Team lists in the site's team order, names in French alphabetical order; a name links only if its page exists. */
export function buildEquipes(rows: EquipeRow[]): Equipes {
  const tri = [...rows].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  return Object.fromEntries(
    EQUIPES.map(([key]) => [key, tri.filter(r => r.equipes?.includes(key)).map(r => ({ nom: r.nom, slug: r.aPage && r.slug ? r.slug : null }))] as const)
      .filter(([, membres]) => membres.length),
  )
}

export type ArticleRow = { saison: string; tri: number; date?: string | null; lieu?: string | null; titre?: string | null; contenu: Bloc[] }
/** One entry per document → the site's « one list per season », newest season and newest entry first. */
export function groupSaisons(rows: ArticleRow[]): Saison[] {
  return [...new Set(rows.map(r => r.saison))].sort().reverse().map(saison => ({
    saison,
    entrees: rows.filter(r => r.saison === saison).sort((a, b) => b.tri - a.tri)
      .map(({ date, lieu, titre, contenu }) => ({ ...clean({ date, lieu, titre }), contenu }) as Saison['entrees'][number]),
  }))
}

/** Medals inserted in the text with the « Médaille » button (the tally block is a summary, not counted). */
export function medailles(s: Saison) {
  const n = { or: 0, argent: 0, bronze: 0 }
  for (const e of s.entrees) for (const b of e.contenu) if (b._type === 'block') for (const c of b.children) if (c._type === 'medaille') n[c.kind]++
  return n
}

export type ChallengeRow = Omit<ChallengeData['challenge'], 'couts' | 'bourses' | 'limites'> & {
  couts: { athletes: string; prix: string }[]
  bourses: { division: string; divisionEn: string; montant: string }[]
  limites: { pour: string; pourEn: string; date: string; dateEn: string }[]
  divisions: { division: string; hommes: Vide; femmes: Vide; nes: Vide; nesEn: Vide; grades: Vide; gradesEn: Vide; pesee: Vide }[]
  commanditaires: { logo: string; nom: string }[]
  palmares: { annee: number; coupe: { club: string; points?: number | null }[]; divisions: { division: string; or: Vide; argent: Vide; bronze: Vide; meilleur: Vide }[] }[]
}
const c = (s: Vide) => s ?? ''
export function toChallenge(r: ChallengeRow): ChallengeData {
  const { couts, bourses, limites, divisions, commanditaires, palmares, ...challenge } = r
  return {
    challenge: {
      ...clean(challenge),
      couts: couts.map(x => [x.athletes, x.prix]),
      bourses: bourses.map(x => [x.division, x.divisionEn, x.montant]),
      limites: limites.map(x => [x.pour, x.pourEn, x.date, x.dateEn]),
    },
    divisions: divisions.map(d => [d.division, c(d.hommes), c(d.femmes), c(d.nes), c(d.nesEn), c(d.grades), c(d.gradesEn), c(d.pesee)] as Division),
    commanditaires: commanditaires.map(x => [x.logo, x.nom]),
    palmaresChallenge: palmares.map(e => ({
      annee: e.annee,
      coupe: e.coupe.map(x => (x.points == null ? [x.club] : [x.club, x.points]) as [string, number?]),
      ...(e.divisions.length > 0 && { divisions: e.divisions.map(d => [d.division, c(d.or), c(d.argent), c(d.bronze), c(d.meilleur)] as Ligne) }),
    })),
  }
}

export type ConseilRow = { membres: { role: string; roleEn: string; nom: string; courriel?: string | null }[]; presidents: { mandat: string; nom: string }[] }
export const toConseil = (r: ConseilRow): Conseil => ({
  membres: r.membres.map(m => [m.role, m.roleEn, m.nom, m.courriel ?? '']),
  presidents: r.presidents.map(p => [p.mandat, p.nom]),
})

export type HistoriqueRow = {
  timeline: { date: string; dateEn: string; texte: string; texteEn: string }[]
  international: { titre: string; titreEn: string; participations: { annee: number; athletes: string; lieu: string; resultat?: string | null }[] }[]
  ancienDojo: string[]; inauguration: string[]
}
export const toHistorique = (r: HistoriqueRow): Historique => ({
  timeline: r.timeline.map(t => [t.date, t.dateEn, t.texte, t.texteEn]),
  international: r.international.map(i => [i.titre, i.titreEn, i.participations.map(p =>
    (p.resultat ? [p.annee, p.athletes, p.lieu, p.resultat] : [p.annee, p.athletes, p.lieu]) as Participation)]),
  ancienDojo: r.ancienDojo,
  inauguration: r.inauguration,
})

export type TelechargementsRow = { groupes: { titre: string; titreEn: string; docs: { titre: string; href: string }[] }[] }
export const toTelechargements = (r: TelechargementsRow): Telechargement[] =>
  clean(r).groupes.map(g => ({ titre: [g.titre, g.titreEn], docs: g.docs }))

export type PhotosSiteRow = Record<string, { src: string; w: number; h: number; hotspot?: Hotspot; alt: string; altEn: string }>
export const toPhotosSite = (r: PhotosSiteRow) =>
  Object.fromEntries(PHOTO_KEYS.map(k => [k, photo(clean(r[k]))])) as PhotosSite
```

Run: `npx vitest run lib/content` — Expected: PASS (6 describe blocks).

- [ ] **Step 4: Failing query tests (GROQ run in memory by groq-js)**

`lib/content/__tests__/queries.test.ts`:

```ts
import { evaluate, parse } from 'groq-js'
import { ATHLETE, CLUB, EQUIPES, PROGRAMMES, SAISONS } from '../queries'

const run = async (q: string, dataset: object[], params: Record<string, unknown> = {}) =>
  await (await evaluate(parse(q, { params }), { dataset, params })).get()

const img = { _id: 'image-1', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/a.jpg', metadata: { dimensions: { width: 800, height: 600 } } }
const club = {
  _id: 'club', _type: 'club', nom: 'Club',
  inscription: { saison: '2026-2027', colonnesTarif: ['Avant', 'Après'], notes: ['Note'], debutCours: [{ programme: 'Adultes', date: '2 sept.' }] },
  palmares: [{ championnat: 'Provinciaux', or: 1, argent: 2, bronze: 3 }],
}

describe('CLUB', () => {
  it('falls back to French when an English field is empty', async () => {
    const r = await run(CLUB, [club])
    expect(r.inscription.debutCours).toEqual([{ programme: 'Adultes', programmeEn: 'Adultes', date: '2 sept.', dateEn: '2 sept.' }])
    expect(r.inscription.notesEn).toEqual(['Note'])
    expect(r.inscription.colonnesTarifEn).toEqual(['Avant', 'Après'])
    expect(r.palmares[0].championnatEn).toBe('Provinciaux')
  })
})

describe('PROGRAMMES', () => {
  const instr = { _id: 'instructeur-jeremie-blain', _type: 'instructeur', nom: 'Jérémie Blain', grade: '1er dan', slug: { current: 'jeremie-blain' } }
  const base = { _type: 'programme', titre: 'Judo', groupes: [], tarifs: [] }
  const dataset = [club, instr, img,
    { ...base, _id: 'programme-a', slug: { current: 'a' }, orderRank: '0|b', titreEn: 'Judo EN',
      instructeurs: [{ ref: { _ref: 'instructeur-jeremie-blain' }, grade: 'Ceinture noire judo et BJJ' }, { nom: 'Invité', grade: '2e dan' }],
      qr: { asset: { _ref: 'image-1' } }, notes: [] },
    { ...base, _id: 'programme-b', slug: { current: 'b' }, orderRank: '0|a', colonnes: ['Session'] },
    { ...base, _id: 'drafts.programme-c', orderRank: '0|c' }, // never published: no slug yet
  ]
  it('resolves instructors, columns, English fallback, images and empty lists', async () => {
    const [b, a] = await run(PROGRAMMES, dataset)
    expect(b.slug).toBe('b')
    expect(b.colonnes).toEqual(['Session'])
    expect(a.colonnes).toEqual(['Avant', 'Après'])
    expect(a.titreEn).toBe('Judo EN')
    expect(b.titreEn).toBe('Judo')
    expect(a.instructeurs).toEqual([
      { nom: 'Jérémie Blain', grade: 'Ceinture noire judo et BJJ', slug: 'jeremie-blain' },
      { nom: 'Invité', grade: '2e dan', slug: null },
    ])
    expect(a.qr).toBe('https://cdn.sanity.io/a.jpg')
    expect(a.notes).toBeNull()
  })
  it('skips programmes that were never published', async () => {
    expect(await run(PROGRAMMES, dataset)).toHaveLength(2)
  })
})

describe('athletes', () => {
  const dataset = [img,
    { _id: 'athlete-a', _type: 'athlete', nom: 'A', slug: { current: 'a' }, equipes: ['u16'], photos: [{ asset: { _ref: 'image-1' }, hotspot: { x: 0.5, y: 0.2 } }] },
    { _id: 'athlete-b', _type: 'athlete', nom: 'B', slug: { current: 'b' }, equipes: ['u16'] },
  ]
  it('a page exists only with photos or a profile', async () => {
    expect(await run(EQUIPES, dataset)).toEqual([
      { nom: 'A', slug: 'a', equipes: ['u16'], aPage: true },
      { nom: 'B', slug: 'b', equipes: ['u16'], aPage: false },
    ])
    expect(await run(ATHLETE, dataset, { slug: 'b' })).toBeNull()
    const a = await run(ATHLETE, dataset, { slug: 'a' })
    expect(a.photos).toEqual([{ src: 'https://cdn.sanity.io/a.jpg', w: 800, h: 600, hotspot: { x: 0.5, y: 0.2 } }])
  })
})

describe('SAISONS', () => {
  it('lists each season once', async () => {
    const r = await run(SAISONS, [
      { _id: '1', _type: 'resultat', saison: '2025-2026' }, { _id: '2', _type: 'resultat', saison: '2025-2026' },
      { _id: '3', _type: 'actualite', saison: '2024-2025' },
    ], { type: 'resultat' })
    expect(r).toEqual(['2025-2026'])
  })
})
```

Run: `npx vitest run lib/content/__tests__/queries.test.ts` — Expected: FAIL, `../queries` not found.

- [ ] **Step 5: `lib/content/queries.ts`**

```ts
import { PHOTO_KEYS } from './types'

/** English field, or the French one when Fayçal left it empty. */
const en = (f: string) => `"${f}En": coalesce(${f}En, ${f})`
const enListe = (f: string) => `"${f}En": coalesce(select(count(${f}En) > 0 => ${f}En, ${f}), [])`
/** Optional list: null (dropped by `clean`) when empty, like today's absent fields. */
const opt = (f: string, proj = '') => `"${f}": select(count(${f}) > 0 => ${f}${proj})`
const PHOTO = '{"src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, hotspot}'
/** An uploaded PDF wins over a link. */
const PDF = (f: string) => `coalesce(${f}.fichier.asset->url, ${f}.lien)`
const A_PAGE = 'coalesce(count(photos), 0) + coalesce(count(personnes), 0) > 0'

export const CLUB = `*[_id == "club"][0]{
  nom, site, dojo, lieu, adresse, tel, courriel, responsable, president, instagram, facebook, twitter, tiktok, youtube, calendrierJudoQuebec,
  "inscription": inscription{
    saison, formulaire, "qr": qr.asset->url,
    "debutCours": coalesce(debutCours[]{programme, ${en('programme')}, date, ${en('date')}}, []),
    enLigne, ${en('enLigne')}, surPlace, ${en('surPlace')}, paiement, ${en('paiement')},
    "notes": coalesce(notes, []), ${enListe('notes')}, "colonnesTarif": coalesce(colonnesTarif, []), ${enListe('colonnesTarif')}
  },
  "palmares": coalesce(palmares[]{championnat, ${en('championnat')}, or, argent, bronze}, [])
}`

const PROG = `{
  "slug": slug.current, titre, ${en('titre')}, categorie, resume, ${en('resume')}, horaire, description, descriptionEn,
  prealable, cours, debut, inscription,
  "groupes": coalesce(groupes[]{clientele, code, horaire}, []),
  "colonnes": select(count(colonnes) > 0 => colonnes, *[_id == "club"][0].inscription.colonnesTarif),
  "tarifs": coalesce(tarifs[]{periode, "prix": coalesce(prix, [])}, []),
  ${opt('notes')},
  "instructeurs": coalesce(instructeurs[]{"nom": coalesce(nom, ref->nom), "grade": coalesce(grade, ref->grade), "slug": ref->slug.current}, []),
  formulaire, "qr": qr.asset->url,
  ${opt('documents', `[]{titre, "href": ${PDF('pdf')}}`)},
  ${opt('contacts', '[]{nom, role, tel, courriel}')}
}`
export const PROGRAMMES = `*[_type == "programme" && defined(slug.current)] | order(orderRank) ${PROG}`
export const PROGRAMME = `*[_type == "programme" && slug.current == $slug][0] ${PROG}`

const INSTR = `{
  "id": _id, nom, "slug": slug.current, "photo": photo${PHOTO}, grade, pnce, "disciplines": coalesce(disciplines, []),
  role, bio, bioEn, "competitions": coalesce(competitions, [])
}`
export const INSTRUCTEURS = `*[_type == "instructeur" && defined(slug.current)] | order(orderRank) ${INSTR}`
export const INSTRUCTEUR = `*[_type == "instructeur" && slug.current == $slug][0] ${INSTR}`

export const EVENEMENTS = '*[_type == "evenement"] | order(debut asc){debut, fin, titre, lieu, lien}'
export const CEINTURES = '*[_type == "ceintureNoire"] | order(annee asc){annee, "noms": coalesce(noms, [])}'

export const CHALLENGE = `*[_id == "challenge"][0]{
  edition, date, depuis, "pays": coalesce(pays, []), ${enListe('pays')}, formulaire,
  "programme": ${PDF('programme')}, "devis": ${PDF('devis')}, video, president,
  "couts": coalesce(couts[]{athletes, prix}, []),
  "bourses": coalesce(bourses[]{division, ${en('division')}, montant}, []),
  "limites": coalesce(limites[]{pour, ${en('pour')}, date, ${en('date')}}, []),
  "divisions": coalesce(divisions[]{division, hommes, femmes, nes, ${en('nes')}, grades, ${en('grades')}, pesee}, []),
  "commanditaires": coalesce(commanditaires[]{"logo": logo.asset->url, nom}, []),
  "palmares": coalesce(palmares[]{annee, "coupe": coalesce(coupe[]{club, points}, []),
    "divisions": coalesce(divisions[]{division, or, argent, bronze, meilleur}, [])}, [])
}`

export const EQUIPES = `*[_type == "athlete"]{nom, "slug": slug.current, equipes, "aPage": ${A_PAGE}}`
export const ATHLETE_SLUGS = `*[_type == "athlete" && defined(slug.current) && ${A_PAGE}].slug.current`
export const ATHLETE = `*[_type == "athlete" && slug.current == $slug && ${A_PAGE}][0]{
  "slug": slug.current, nom, "photos": coalesce(photos[]${PHOTO}, []),
  "personnes": coalesce(personnes[]{nom, naissance, debut, grade, etudes, judoinside, ${opt('faits')}, ${opt('objCourt')}, ${opt('objLong')},
    ${opt('saisons', '[]{saison, victoires, defaites, "resultats": coalesce(resultats, [])}')}}, [])
}`

/** Season list (sorted newest first by the getter) and one season at a time: a whole archive would exceed the 2 MB fetch cache. */
export const SAISONS = 'array::unique(*[_type == $type].saison)'
export const SAISON = `*[_type == $type && saison == $saison]{
  saison, tri, date, lieu, titre,
  "contenu": coalesce(contenu[]{..., _type == "image" => {"src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height}}, [])
}`

export const JOURNAUX = `*[_type == "journaux"] | order(orderRank){periode, "numeros": coalesce(numeros[]{titre, "thumb": vignette.asset->url, "pdf": ${PDF('pdf')}}, [])}`

export const CONSEIL = `*[_id == "conseil"][0]{
  "membres": coalesce(membres[]{role, ${en('role')}, nom, courriel}, []),
  "presidents": coalesce(presidents[]{mandat, nom}, [])
}`
export const HISTORIQUE = `*[_id == "historique"][0]{
  "timeline": coalesce(timeline[]{date, ${en('date')}, texte, ${en('texte')}}, []),
  "international": coalesce(international[]{titre, ${en('titre')}, "participations": coalesce(participations[]{annee, athletes, lieu, resultat}, [])}, []),
  "ancienDojo": coalesce(ancienDojo[].asset->url, []),
  "inauguration": coalesce(inauguration[].asset->url, [])
}`
export const TELECHARGEMENTS = `*[_id == "telechargements"][0]{
  "groupes": coalesce(groupes[]{titre, ${en('titre')}, "docs": coalesce(docs[]{titre, "href": ${PDF('pdf')}}, [])}, [])
}`
export const PHOTOS_SITE = `*[_id == "photosSite"][0]{
  ${PHOTO_KEYS.map(k => `"${k}": ${k}{"src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, hotspot, alt, ${en('alt')}}`).join(',\n  ')}
}`
```

Run: `npx vitest run lib/content` — Expected: PASS.

- [ ] **Step 6: `lib/sanity/client.ts` and the getters**

`lib/sanity/client.ts`:

```ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })

/** Published content, cached 30 s: a change published in the Studio is online within a minute, with no redeploy. */
export const sanityFetch = <T>(query: string, params: Record<string, unknown> = {}) =>
  client.fetch<T>(query, params, { next: { revalidate: 30 } })
```

`lib/content/index.ts`:

```ts
import { sanityFetch } from '@/lib/sanity/client'
import * as Q from './queries'
import {
  buildCalendrier, buildEquipes, clean, groupSaisons, toAthlete, toChallenge, toClub, toConseil, toHistorique,
  toInstructeur, toPhotosSite, toTelechargements,
  type ArticleRow, type AthleteRow, type ChallengeRow, type ClubRow, type ConseilRow, type EquipeRow, type EvenementRow,
  type HistoriqueRow, type InstructeurRow, type PhotosSiteRow, type TelechargementsRow,
} from './transform'
import type { Periode, Programme } from './types'

export * from './types'
export { medailles } from './transform'

/** Singletons are required: a missing one fails the build, and Vercel keeps the previous deployment online. */
async function unique<T>(query: string, nom: string) {
  const r = await sanityFetch<T | null>(query)
  if (!r) throw new Error(`Sanity : la fiche « ${nom} » est introuvable`)
  return r
}

export const getClub = async () => toClub(await unique<ClubRow>(Q.CLUB, 'Club'))
export const getProgrammes = async () => clean(await sanityFetch<Programme[]>(Q.PROGRAMMES))
export const getProgramme = async (slug: string) => clean(await sanityFetch<Programme | null>(Q.PROGRAMME, { slug }))
export const getInstructeurs = async () => (await sanityFetch<InstructeurRow[]>(Q.INSTRUCTEURS)).map(toInstructeur)
export const getInstructeur = async (slug: string) => {
  const r = await sanityFetch<InstructeurRow | null>(Q.INSTRUCTEUR, { slug })
  return r && toInstructeur(r)
}
export const getCalendrier = async () => buildCalendrier(clean(await sanityFetch<EvenementRow[]>(Q.EVENEMENTS)))
export const getCeintures = async () => {
  const ceintures = await sanityFetch<{ annee: number; noms: string[] }[]>(Q.CEINTURES)
  return { ceintures, total: ceintures.reduce((n, y) => n + y.noms.length, 0) }
}
export const getChallenge = async () => toChallenge(await unique<ChallengeRow>(Q.CHALLENGE, 'Challenge'))
export const getEquipes = async () => buildEquipes(await sanityFetch<EquipeRow[]>(Q.EQUIPES))
export const getAthleteSlugs = () => sanityFetch<string[]>(Q.ATHLETE_SLUGS)
export const getAthlete = async (slug: string) => {
  const r = await sanityFetch<AthleteRow | null>(Q.ATHLETE, { slug })
  return r && toAthlete(r)
}
export type Archive = 'actualite' | 'resultat'
export const getSaisons = async (type: Archive) => (await sanityFetch<string[]>(Q.SAISONS, { type })).sort().reverse()
export const getSaison = async (type: Archive, saison: string) =>
  groupSaisons(await sanityFetch<ArticleRow[]>(Q.SAISON, { type, saison }))[0] ?? null
export const getJournaux = async () => clean(await sanityFetch<Periode[]>(Q.JOURNAUX))
export const getConseil = async () => toConseil(await unique<ConseilRow>(Q.CONSEIL, 'Conseil'))
export const getHistorique = async () => toHistorique(await unique<HistoriqueRow>(Q.HISTORIQUE, 'Historique'))
export const getTelechargements = async () => toTelechargements(await unique<TelechargementsRow>(Q.TELECHARGEMENTS, 'Téléchargements'))
export const getPhotosSite = async () => toPhotosSite(await unique<PhotosSiteRow>(Q.PHOTOS_SITE, 'Photos du site'))
```

- [ ] **Step 7: Move `Medal`, failing test for `Contenu`**

`components/archive/Medal.tsx` — cut `MEDAL`, `MEDAL_EN` and `Medal` out of `Blocks.tsx` unchanged:

```tsx
const MEDAL = { or: 'bg-[#e8c547]', argent: 'bg-[#c9ced6]', bronze: 'bg-[#c98a4b]' }
const MEDAL_EN = { or: 'gold', argent: 'silver', bronze: 'bronze' }

export function Medal({ kind, locale }: { kind: keyof typeof MEDAL; locale: string }) {
  return (
    <span role="img" aria-label={locale === 'fr' ? `médaille d’${kind}` : `${MEDAL_EN[kind]} medal`}
      className={`inline-block w-2.5 h-2.5 rounded-full align-middle mx-1 ${MEDAL[kind]}`} />
  )
}
```

In `Blocks.tsx`: delete those lines, add `import { Medal } from './Medal'` and `export { Medal }` (Blocks is deleted in Task 12, once its last importer is gone).

`components/archive/__tests__/Contenu.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Contenu from '../Contenu'
import type { Bloc } from '@/lib/content/types'

const s = (text: string, marks: string[] = []) => ({ _type: 'span' as const, _key: text, text, marks })
const lien = (href: string, children: Extract<Bloc, { _type: 'block' }>['children']): Bloc =>
  ({ _type: 'block', _key: href, style: 'normal', children, markDefs: [{ _key: 'l', _type: 'link', href }] })

it('a line that is only a link renders like the old standalone link, medals included', () => {
  render(<Contenu locale="fr" alt="x" contenu={[lien('https://judo.org/r', [s('Résultats complets', ['l']), { _type: 'medaille', _key: 'm', kind: 'or' }, s('', ['l'])])]} />)
  const a = screen.getByRole('link')
  expect(a).toHaveAttribute('href', 'https://judo.org/r')
  expect(a).toHaveClass('inline-block', 'break-all')
  expect(a).toHaveTextContent('Résultats complets ↗')
  expect(screen.getByRole('img', { name: 'médaille d’or' })).toBeInTheDocument()
})

it('a link inside a sentence stays in the sentence, localized when internal', () => {
  render(<Contenu locale="en" alt="x" contenu={[{ _type: 'block', _key: 'p', style: 'normal',
    markDefs: [{ _key: 'l', _type: 'link', href: '/inscription' }], children: [s('Voir '), s('inscription', ['l']), s('.')] }]} />)
  const a = screen.getByRole('link')
  expect(a).toHaveAttribute('href', '/en/inscription')
  expect(a.closest('p')).toHaveTextContent('Voir inscription.')
})

it('renders headings, bold, the medal tally and small logos', () => {
  const { container } = render(<Contenu locale="fr" alt="Logo" contenu={[
    { _type: 'block', _key: 'h', style: 'h4', children: [s('Coupe Canada')] },
    { _type: 'block', _key: 'p', style: 'normal', children: [s('Léa', ['strong']), s(' 1re')] },
    { _type: 'bilanMedailles', _key: 'b', or: 2, argent: 0, bronze: 1 },
    { _type: 'image', _key: 'i', src: '/images/logo.png', w: 200, h: 100, petit: true },
  ]} />)
  expect(container.querySelector('h4')).toHaveTextContent('Coupe Canada')
  expect(container.querySelector('strong')).toHaveTextContent('Léa')
  const bilan = container.querySelector('p.tabular-nums')!
  expect(bilan).toHaveTextContent('201')
  expect(bilan.querySelectorAll('[role=img]')).toHaveLength(3)
  expect(screen.getByAltText('Logo')).toHaveClass('h-20')
})
```

Run: `npx vitest run components/archive` — Expected: FAIL, `../Contenu` not found.

- [ ] **Step 8: `components/archive/Contenu.tsx`**

Same markup and classes as `Blocks.tsx`, read from Portable Text. A block whose every span is one link is the old « a » line (a standalone link); a link inside a sentence is inline.

```tsx
import { Fragment, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Bloc } from '@/lib/content/types'
import { Medal } from './Medal'

type Block = Extract<Bloc, { _type: 'block' }>

/** The href if the whole line is one link, like the old « a » blocks. */
function lienSeul(b: Block) {
  const [d] = b.markDefs ?? []
  return b.markDefs?.length === 1 && b.children.every(c => c._type !== 'span' || c.marks?.includes(d._key)) ? d.href : null
}

function Enfants({ b, locale, liens }: { b: Block; locale: string; liens: boolean }) {
  return b.children.map(c => {
    if (c._type === 'medaille') return <Medal key={c._key} kind={c.kind} locale={locale} />
    let n: ReactNode = c.text
    if (c.marks?.includes('strong')) n = <strong>{n}</strong>
    const href = liens && b.markDefs?.find(d => c.marks?.includes(d._key))?.href
    if (href) n = href.startsWith('/')
      ? <Link href={`/${locale}${href}`} className="text-accent-blue hover:underline">{n}</Link>
      : <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">{n} ↗</a>
    return <Fragment key={c._key}>{n}</Fragment>
  })
}

export default function Contenu({ contenu, locale, alt }: { contenu: Bloc[]; locale: string; alt: string }) {
  return (
    <div className="space-y-2 min-w-0">
      {contenu.map(b => {
        if (b._type === 'bilanMedailles') return (
          <p key={b._key} className="text-sm text-muted pt-2 tabular-nums">
            <Medal kind="or" locale={locale} />{b.or ?? 0}
            <Medal kind="argent" locale={locale} />{b.argent ?? 0}
            <Medal kind="bronze" locale={locale} />{b.bronze ?? 0}
          </p>
        )
        if (b._type === 'image') return b.petit
          ? <Image key={b._key} src={b.src} width={b.w} height={b.h} alt={alt} sizes="96px" className="h-20 w-auto object-contain my-2" />
          : <Image key={b._key} src={b.src} width={b.w} height={b.h} alt={alt} sizes="(min-width: 1024px) 640px, 100vw" className="w-full max-w-xl h-auto my-3" />
        const href = lienSeul(b)
        if (href) return href.startsWith('/')
          ? <Link key={b._key} href={`/${locale}${href}`} className="inline-block text-sm text-accent-blue hover:underline mr-3"><Enfants b={b} locale={locale} liens={false} /></Link>
          : <a key={b._key} href={href} target="_blank" rel="noopener noreferrer" className="inline-block py-3 px-1 text-sm text-accent-blue hover:underline mr-2 break-all"><Enfants b={b} locale={locale} liens={false} /> ↗</a>
        return b.style === 'h4'
          ? <h4 key={b._key} className="text-[.78rem] text-muted uppercase tracking-[.25em] pt-4"><Enfants b={b} locale={locale} liens /></h4>
          : <p key={b._key} className="text-sm text-ink/80 leading-relaxed break-words"><Enfants b={b} locale={locale} liens /></p>
      })}
    </div>
  )
}
```

Run: `npx vitest run components/archive` — Expected: PASS.

- [ ] **Step 9: Verify and commit**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
```

Expected: all pass; the site is unchanged (nothing imports `lib/content` yet).

```bash
git add lib/content lib/sanity/client.ts components/archive/Medal.tsx components/archive/Contenu.tsx components/archive/Blocks.tsx components/archive/__tests__
git commit -F- <<'EOF'
feat(cms): content layer — GROQ queries returning the site's current shapes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 8: Migration script, proven by a round trip before it touches Sanity

**Files:**
- Create: `scripts/migrate/transform.ts`, `scripts/migrate-to-sanity.ts`
- Test: `scripts/migrate/__tests__/roundtrip.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: everything under `data/` (including `data/pages.ts`, `data/photos.ts` from Task 2), `slugify` (Task 4), `EQUIPES` (Task 4), the getters of Task 7.
- Produces: `toDocuments(): { docs: Doc[]; images: Map<string, { w?: number; h?: number }> }`, `withAssets(v, assetIds: Map<string, string>)`, `NOMS`; `npx tsx --env-file=.env.local scripts/migrate-to-sanity.ts` (Task 9).

- [ ] **Step 1: Failing round-trip test**

The test runs the real getters of Task 7 over the migrated documents (groq-js instead of Sanity) and compares with `data/`. If it passes, the site will read exactly what it reads today.

`scripts/migrate/__tests__/roundtrip.test.ts`:

```ts
import { evaluate, parse } from 'groq-js'
import { NOMS, toDocuments, withAssets } from '../transform'
import * as C from '@/lib/content'
import { club, inscription, palmares, totalPalmares } from '@/data/club'
import { COLONNES_TARIF, programmes } from '@/data/programmes'
import { instructeurs } from '@/data/instructeurs'
import { calendrier, calendrierJudoQuebec } from '@/data/evenements'
import { ceintures, totalCeintures } from '@/data/ceintures-noires'
import { challenge, commanditaires, divisions, palmaresChallenge } from '@/data/challenge'
import { actualites, athletes, equipes, journaux, medailles, resultats, type Block } from '@/data/archive'
import { ancienDojo, inauguration, international, membres, presidents, telechargements, timeline } from '@/data/pages'
import { photosSite } from '@/data/photos'
import type { Bloc } from '@/lib/content'

const db = vi.hoisted(() => ({ dataset: [] as object[] }))
vi.mock('@/lib/sanity/client', () => ({
  sanityFetch: async (q: string, params: Record<string, unknown> = {}) =>
    await (await evaluate(parse(q, { params }), { dataset: db.dataset, params })).get(),
}))

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 29))
  const { docs, images } = toDocuments()
  const ids = new Map([...images.keys()].map((src, i) => [src, `image-${i}`]))
  db.dataset = [
    ...docs.map(d => withAssets(d, ids)),
    ...[...images].map(([src, { w = 1, h = 1 }]) => ({
      _id: ids.get(src), _type: 'sanity.imageAsset', url: src, metadata: { dimensions: { width: w, height: h } },
    })),
  ]
})
afterAll(() => vi.useRealTimers())

const nom = (n: string) => NOMS[n] ?? n
// old blocks and new Portable Text, both flattened to comparable lines
const ancien = (b: Block) => b.t === 'img' ? b.src : b.t === 'm' ? `${b.o}/${b.a}/${b.b}` : `${b.t === 'a' ? `${b.href} ` : ''}${b.text}`
const nouveau = (b: Bloc) => b._type === 'image' ? b.src : b._type === 'bilanMedailles' ? `${b.or}/${b.argent}/${b.bronze}`
  : `${b.markDefs?.[0] && b.children.every(c => c._type !== 'span' || c.marks?.length) ? `${b.markDefs[0].href} ` : ''}${b.children.map(c => c._type === 'span' ? c.text : `⟨${c.kind}⟩`).join('')}`

it('club and registration', async () => {
  expect(await C.getClub()).toEqual({
    club: { ...club, calendrierJudoQuebec },
    inscription: { ...inscription, colonnesTarif: COLONNES_TARIF, colonnesTarifEn: ['Before Aug 19', 'After Aug 19'] },
    palmares, totalPalmares,
  })
})

it('programmes and instructors', async () => {
  expect(await C.getProgrammes()).toEqual(programmes.map(p => ({ ...p, colonnes: p.colonnes ?? COLONNES_TARIF })))
  expect(await C.getProgramme(programmes[0].slug)).toEqual({ ...programmes[0], colonnes: programmes[0].colonnes ?? COLONNES_TARIF })
  expect(await C.getProgramme('inconnu')).toBeNull()
  const got = (await C.getInstructeurs()).map(({ photo, ...i }) => ({ ...i, ...(photo && { photoSrc: photo.src }) }))
  expect(got).toEqual(instructeurs.map(i => ({ ...i, id: expect.any(String) })))
})

it('calendar, black belts, challenge', async () => {
  expect(await C.getCalendrier()).toEqual(calendrier)
  expect(await C.getCeintures()).toEqual({ ceintures, total: totalCeintures })
  const c = await C.getChallenge()
  expect(c.challenge).toEqual(challenge)
  expect(c.divisions).toEqual(divisions)
  expect(c.commanditaires).toEqual(commanditaires.map(([f, n]) => [`/images/challenge/${f}`, n]))
  expect(c.palmaresChallenge).toEqual(palmaresChallenge)
})

it('athletes: one document per person, teams sorted, same profile pages', async () => {
  const e = await C.getEquipes()
  const tri = (l: { nom: string; slug: string | null }[]) => [...l].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  expect(e).toEqual(Object.fromEntries(Object.entries(equipes).map(([k, l]) => [k, tri(l.map(m => ({ ...m, nom: nom(m.nom) })))])))
  expect((await C.getAthleteSlugs()).sort()).toEqual(athletes.map(a => a.slug).sort())
  for (const a of athletes) expect(await C.getAthlete(a.slug)).toEqual({ ...a, nom: nom(a.nom) })
  expect((await C.getAthlete('amira-bousbiat'))?.photos ?? []).toEqual([])
})

it.each([['actualite', actualites], ['resultat', resultats]] as const)('%s: same seasons, entries, text and medals', async (type, avant) => {
  expect(await C.getSaisons(type)).toEqual(avant.map(s => s.saison))
  for (const s of avant) {
    const apres = (await C.getSaison(type, s.saison))!
    expect(apres.entrees.map(({ contenu, ...e }) => ({ ...e, lignes: contenu.map(nouveau) })))
      .toEqual(s.entrees.map(({ blocks, ...e }) => ({ ...e, lignes: blocks.map(ancien) })))
    expect(C.medailles(apres)).toEqual(medailles(s))
  }
})

it('journals, board, history, downloads, site photos', async () => {
  expect(await C.getJournaux()).toEqual(journaux.map(p => ({ ...p, numeros: p.numeros.map(({ thumb, ...n }) => (thumb ? { ...n, thumb } : n)) })))
  expect(await C.getConseil()).toEqual({ membres, presidents })
  expect(await C.getHistorique()).toEqual({ timeline, international, ancienDojo, inauguration })
  expect(await C.getTelechargements()).toEqual(telechargements)
  expect(await C.getPhotosSite()).toMatchObject(photosSite)
})
```

Run: `npx vitest run scripts/migrate` — Expected: FAIL, `../transform` not found.

- [ ] **Step 2: `scripts/migrate/transform.ts`**

```ts
// data/ → Sanity documents. Pure: no network. Images are recorded by local path and uploaded by the runner.
import { EQUIPES } from '@/sanity/equipes'
import { slugify } from '@/lib/slug'
import { club, inscription, palmares } from '@/data/club'
import { COLONNES_TARIF, programmes } from '@/data/programmes'
import { instructeurs } from '@/data/instructeurs'
import { calendrier, calendrierJudoQuebec } from '@/data/evenements'
import { ceintures } from '@/data/ceintures-noires'
import { challenge, commanditaires, divisions, palmaresChallenge } from '@/data/challenge'
import { actualites, athletes, equipes, journaux, resultats, type Block, type Saison } from '@/data/archive'
import { ancienDojo, inauguration, international, membres, presidents, telechargements, timeline } from '@/data/pages'
import { photosSite } from '@/data/photos'

export type Doc = { _id: string; _type: string } & Record<string, unknown>

/** One spelling per athlete: the team lists and the profiles disagreed on these names (Deviation 12). */
export const NOMS: Record<string, string> = {
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
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const k = <T extends object>(items: readonly T[], p = 'k') => items.map((x, i) => ({ _key: `${p}${i}`, ...x }))
const rank = (i: number) => `0|${(1000 * (i + 1)).toString(36).padStart(6, '0')}:`
const ref = (_ref: string) => ({ _type: 'reference', _ref })
const lien = (href: string) => ({ lien: href })
const vide = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null))

/** Replaces each `_upload: src` with the uploaded asset reference. */
export function withAssets<T>(v: T, ids: Map<string, string>): T {
  if (Array.isArray(v)) return v.map(x => withAssets(x, ids)) as T
  if (!v || typeof v !== 'object') return v
  const { _upload, ...rest } = v as Record<string, unknown>
  const out = Object.fromEntries(Object.entries(rest).map(([key, x]) => [key, withAssets(x, ids)]))
  return (_upload ? { ...out, asset: ref(ids.get(_upload as string)!) } : out) as T
}

function enfants(text: string, marks: string[]) {
  return text.split(/⟨(or|argent|bronze)⟩/).map((t, i) => i % 2
    ? { _key: `c${i}`, _type: 'medaille', kind: t }
    : { _key: `c${i}`, _type: 'span', text: t, marks })
}

export function toDocuments() {
  const images = new Map<string, { w?: number; h?: number }>()
  const img = (src: string, dims: { w?: number; h?: number } = {}, extra: object = {}) => {
    if (!src.startsWith('/')) throw new Error(`image distante non migrable : ${src}`)
    images.set(src, { ...images.get(src), ...dims }) // keep known dimensions when a file is reused
    return { _type: 'image', _upload: src, ...extra }
  }
  const contenu = (blocks: Block[]) => blocks.map((b, i) => {
    const _key = `b${i}`
    if (b.t === 'img') return { _key, ...img(b.src, { w: b.w, h: b.h }, { petit: b.src.includes('/Logo/') }) }
    if (b.t === 'm') return { _key, _type: 'bilanMedailles', or: b.o, argent: b.a, bronze: b.b }
    if (b.t === 'a') return { _key, _type: 'block', style: 'normal', markDefs: [{ _key: 'l', _type: 'link', href: b.href }], children: enfants(b.text, ['l']) }
    return { _key, _type: 'block', style: b.t === 'h' ? 'h4' : 'normal', markDefs: [], children: enfants(b.text, []) }
  })
  const articles = (type: string, saisons: Saison[]) => {
    const n = saisons.reduce((t, s) => t + s.entrees.length, 0)
    let i = 0
    return saisons.flatMap(s => s.entrees.map((e, j) => ({
      _id: `${type}-${s.saison}-${j}`, _type: type, saison: s.saison, tri: n - i++,
      ...vide({ date: e.date, lieu: e.lieu, titre: e.titre }), contenu: contenu(e.blocks),
    })))
  }

  const fiches = new Map(instructeurs.map(i => [i.slug, i]))
  const docs: Doc[] = [
    {
      _id: 'club', _type: 'club', ...club, calendrierJudoQuebec,
      inscription: {
        saison: inscription.saison, formulaire: inscription.formulaire, qr: img(inscription.qr),
        debutCours: k(inscription.debutCours.map(([programme, programmeEn, date, dateEn]) => ({ programme, programmeEn, date, dateEn }))),
        enLigne: inscription.enLigne, enLigneEn: inscription.enLigneEn, surPlace: inscription.surPlace, surPlaceEn: inscription.surPlaceEn,
        paiement: inscription.paiement, paiementEn: inscription.paiementEn, notes: inscription.notes, notesEn: inscription.notesEn,
        colonnesTarif: COLONNES_TARIF, colonnesTarifEn: ['Before Aug 19', 'After Aug 19'],
      },
      palmares: k(palmares.map(([championnat, championnatEn, or, argent, bronze]) => ({ championnat, championnatEn, or, argent, bronze }))),
    },

    ...programmes.map(({ slug, colonnes, instructeurs: profs, qr, documents, groupes, tarifs, contacts, ...p }, i) => ({
      _id: `programme-${slug}`, _type: 'programme', orderRank: rank(i), slug: { _type: 'slug', current: slug }, ...p,
      ...(colonnes && colonnes.join() !== COLONNES_TARIF.join() && { colonnes }),
      groupes: k(groupes), tarifs: k(tarifs), ...(contacts && { contacts: k(contacts) }),
      instructeurs: k(profs.map(({ nom, grade, slug: s }) => {
        if (!s) return { nom, grade }
        const f = fiches.get(s)
        if (!f) throw new Error(`instructeur inconnu : ${s}`)
        return { ref: ref(`instructeur-${s}`), ...(nom !== f.nom && { nom }), ...(grade !== f.grade && { grade }) }
      })),
      ...(qr ? { qr: img(qr) } : {}),
      ...(documents && { documents: k(documents.map(({ titre, href }) => ({ titre, pdf: lien(href) }))) }),
    })),

    ...instructeurs.map(({ id: _, slug, photoSrc, ...i }, n) => ({
      _id: `instructeur-${slug}`, _type: 'instructeur', orderRank: rank(n), slug: { _type: 'slug', current: slug }, ...i,
      ...(photoSrc ? { photo: img(photoSrc) } : {}),
    })),

    ...calendrier.flatMap(m => {
      const [nomMois, annee] = m.mois.split(' ')
      const mm = String(MOIS.indexOf(nomMois) + 1).padStart(2, '0')
      if (mm === '00') throw new Error(`mois inconnu : ${m.mois}`)
      return m.evenements.map(({ jour, ...e }, i) => {
        const [d, f] = jour.split('-')
        const debut = `${annee}-${mm}-${d.padStart(2, '0')}`
        return { _id: `evenement-${debut}-${i}`, _type: 'evenement', debut, ...(f ? { fin: `${annee}-${mm}-${f.padStart(2, '0')}` } : {}), ...e }
      })
    }),

    ...ceintures.map(c => ({ _id: `ceinture-${c.annee}`, _type: 'ceintureNoire', ...c })),

    {
      _id: 'challenge', _type: 'challenge', ...challenge,
      programme: lien(challenge.programme), devis: lien(challenge.devis),
      couts: k(challenge.couts.map(([athletes, prix]) => ({ athletes, prix }))),
      bourses: k(challenge.bourses.map(([division, divisionEn, montant]) => ({ division, divisionEn, montant }))),
      limites: k(challenge.limites.map(([pour, pourEn, date, dateEn]) => ({ pour, pourEn, date, dateEn }))),
      divisions: k(divisions.map(([division, hommes, femmes, nes, nesEn, grades, gradesEn, pesee]) =>
        vide({ division, hommes, femmes, nes, nesEn, grades, gradesEn, pesee }))),
      commanditaires: k(commanditaires.map(([f, nom]) => ({ logo: img(`/images/challenge/${f}`), nom }))),
      palmares: k(palmaresChallenge.map(e => ({
        annee: e.annee,
        coupe: k(e.coupe.map(([club, points]) => (points == null ? { club } : { club, points }))),
        ...(e.divisions && { divisions: k(e.divisions.map(([division, or, argent, bronze, meilleur]) => vide({ division, or, argent, bronze, meilleur }))) }),
      }))),
    },

    ...athletesDocs(img),
    ...articles('actualite', actualites),
    ...articles('resultat', resultats),

    ...journaux.map((p, i) => ({
      _id: `journaux-${i}`, _type: 'journaux', orderRank: rank(i), periode: p.periode,
      numeros: k(p.numeros.map(n => ({ titre: n.titre, ...(n.thumb ? { vignette: img(n.thumb) } : {}), pdf: lien(n.pdf) }))),
    })),

    {
      _id: 'conseil', _type: 'conseil',
      membres: k(membres.map(([role, roleEn, nom, courriel]) => vide({ role, roleEn, nom, courriel }))),
      presidents: k(presidents.map(([mandat, nom]) => ({ mandat, nom }))),
    },
    {
      _id: 'historique', _type: 'historique',
      timeline: k(timeline.map(([date, dateEn, texte, texteEn]) => ({ date, dateEn, texte, texteEn }))),
      international: k(international.map(([titre, titreEn, ps]) => ({
        titre, titreEn, participations: k(ps.map(([annee, athletes, lieu, resultat]) => vide({ annee, athletes, lieu, resultat }))),
      }))),
      ancienDojo: k(ancienDojo.map(src => img(src))),
      inauguration: k(inauguration.map(src => img(src))),
    },
    {
      _id: 'telechargements', _type: 'telechargements',
      groupes: k(telechargements.map(g => ({
        titre: g.titre[0], titreEn: g.titre[1],
        docs: k(g.docs.map(({ titre, href }) => ({ titre, pdf: lien(href) }))),
      }))),
    },
    {
      _id: 'photosSite', _type: 'photosSite',
      ...Object.fromEntries(Object.entries(photosSite).map(([key, p]) => [key, img(p.src, {}, { alt: p.alt, altEn: p.altEn })])),
    },
  ]
  return { docs, images }
}

/** One document per person: team lists and profiles are merged by slug (or by name when there is no profile). */
function athletesDocs(img: (src: string, dims?: { w?: number; h?: number }) => object): Doc[] {
  const groupes = new Map<string, { nom: string; equipes: string[] }>()
  for (const [key] of EQUIPES) for (const m of equipes[key] ?? []) {
    const id = m.slug ?? slugify(m.nom)
    const g = groupes.get(id) ?? { nom: NOMS[m.nom] ?? m.nom, equipes: [] }
    g.equipes.push(key)
    groupes.set(id, g)
  }
  for (const a of athletes) if (!groupes.has(a.slug)) throw new Error(`profil sans équipe : ${a.slug}`)
  return [...groupes].map(([id, g]) => {
    const a = athletes.find(x => x.slug === id)
    if (id === 'amira-bousbiat' && a?.photos.length) throw new Error('Amira Bousbiat : aucune photo ne doit être migrée')
    return {
      _id: `athlete-${id}`, _type: 'athlete', slug: { _type: 'slug', current: id }, nom: g.nom, equipes: g.equipes,
      ...(a && {
        photos: k(a.photos.map(p => img(p.src, { w: p.w, h: p.h }))),
        personnes: k(a.personnes.map(({ saisons, ...p }) => ({ ...p, ...(saisons && { saisons: k(saisons) }) }))),
      }),
    }
  })
}
```

Run: `npx vitest run scripts/migrate` — Expected: PASS. Typical failures and what they mean:
- `getProgrammes` differs on `instructeurs[].grade` → the override rule (store `grade` only when it differs from the fiche) is broken.
- `getCalendrier` differs → a `jour` format the parser does not know; add it to the split, don't touch the data.
- A season's `lignes` differ → a block type `contenu()` mishandles; fix `contenu()`.

Add three guards to the same test file:

```ts
it('document ids are unique and Sanity-safe', () => {
  const ids = toDocuments().docs.map(d => d._id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(ids.filter(id => !/^[a-zA-Z0-9_-]+$/.test(id))).toEqual([])
})
it('one document per athlete, unique URLs', () => {
  const a = toDocuments().docs.filter(d => d._type === 'athlete')
  expect(a).toHaveLength(92)
  const slugs = a.map(d => (d.slug as { current: string }).current)
  expect(new Set(slugs).size).toBe(slugs.length)
})
it('never migrates a photo of Amira Bousbiat', () => {
  const amira = toDocuments().docs.find(d => d._id === 'athlete-amira-bousbiat')
  expect(amira?.photos ?? []).toEqual([])
})
```

Note on `_id`s: season `2025-2026` gives `actualite-2025-2026-0` — hyphens only, never dots (a dot makes a document private).

- [ ] **Step 3: The runner `scripts/migrate-to-sanity.ts`**

```ts
// Uploads the local images, then writes every document (createOrReplace: safe to run again).
// Run: npx tsx --env-file=.env.local scripts/migrate-to-sanity.ts
import { createClient } from '@sanity/client'
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { toDocuments, withAssets } from './migrate/transform'
import { apiVersion, dataset, projectId } from '../sanity/env'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) throw new Error('SANITY_API_WRITE_TOKEN manquant dans .env.local')
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const CACHE = 'scripts/migrate/.assets.json'
const ids: Record<string, string> = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {}
const { docs, images } = toDocuments()

let n = 0
for (const src of images.keys()) {
  n++
  if (ids[src]) continue
  const asset = await client.assets.upload('image', createReadStream(`public${src}`), { filename: basename(src) })
  ids[src] = asset._id
  writeFileSync(CACHE, JSON.stringify(ids, null, 1)) // resume where it stopped if the network drops
  console.log(`image ${n}/${images.size} ${src}`)
}

const map = new Map(Object.entries(ids))
for (let i = 0; i < docs.length; i += 50) {
  const tx = client.transaction()
  for (const d of docs.slice(i, i + 50)) tx.createOrReplace(withAssets(d, map))
  await tx.commit({ visibility: 'async' })
  console.log(`documents ${Math.min(i + 50, docs.length)}/${docs.length}`)
}
console.log('migration terminée')
```

Run `npm i -D @sanity/client`: it is already in `node_modules` through `next-sanity`; declaring it makes the script's import explicit.

Append to `.gitignore`: `scripts/migrate/.assets.json`

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
```

Expected: all pass, including the round trip.

```bash
git add scripts/migrate scripts/migrate-to-sanity.ts .gitignore package.json package-lock.json
git commit -F- <<'EOF'
feat(cms): migration script, proven by a round trip through the real queries

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 9: Run the migration and check the dataset

**Files:**
- Create: `scripts/migrate/check.ts` (deleted with `scripts/migrate/` in Task 14)

**Interfaces:**
- Consumes: `toDocuments()` from `scripts/migrate/transform.ts` (Task 8), `SANITY_API_WRITE_TOKEN` in `.env.local` (Task 3).
- Produces: a `production` dataset holding every document and image, which Tasks 10–12 read.

- [ ] **Step 1: 🛑 Preconditions**

`.env.local` holds `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` and `SANITY_API_WRITE_TOKEN` (check the names only: `grep -o "^[A-Z_]*SANITY[A-Z_]*" .env.local`). If the write token is missing, stop and ask Yousif to create it (Task 3, Step 5).

- [ ] **Step 2: Run it**

```bash
npx tsx --env-file=.env.local scripts/migrate-to-sanity.ts
```

Expected: `image n/N` lines, then `documents …`, then `migration terminée`. If the network drops, run the same command again: uploaded images are cached in `scripts/migrate/.assets.json` and documents use `createOrReplace`.

- [ ] **Step 3: `scripts/migrate/check.ts` — the dataset matches what the script wrote**

```ts
// Counts in Sanity must equal what the migration wrote, and Amira Bousbiat has no photo.
// Run: npx tsx --env-file=.env.local scripts/migrate/check.ts
import { createClient } from '@sanity/client'
import { toDocuments } from './transform'
import { apiVersion, dataset, projectId } from '../../sanity/env'

const client = createClient({ projectId, dataset, apiVersion, token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false })
const attendu: Record<string, number> = {}
for (const d of toDocuments().docs) attendu[d._type] = (attendu[d._type] ?? 0) + 1

let ok = true
for (const [type, n] of Object.entries(attendu)) {
  const vrai = await client.fetch<number>('count(*[_type == $type && !(_id in path("drafts.**"))])', { type })
  if (vrai !== n) ok = false
  console.log(`${vrai === n ? 'ok   ' : 'ÉCART'} ${type}: ${vrai}/${n}`)
}
const amira = await client.fetch<number>('count(*[_type == "athlete" && slug.current == "amira-bousbiat"][0].photos)')
if (amira) ok = false
console.log(amira ? `ÉCART Amira Bousbiat : ${amira} photo(s)` : 'ok    Amira Bousbiat : aucune photo')
process.exit(ok ? 0 : 1)
```

Run: `npx tsx --env-file=.env.local scripts/migrate/check.ts`
Expected: every line starts with `ok`, `athlete: 92/92`, exit code 0.

- [ ] **Step 4: Look at it as Fayçal will**

`npx next dev -p 3001` in the background (the :3000 server keeps serving the old build for the snapshot), open http://localhost:3001/studio in Edge, log in, and check: the menu lists every section with content; « Club » opens on the real phone number; « Programmes → Judo enfants » shows its groups and fees; « Athlètes » lists 92 names; « Photos du site » shows the eight photos. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate/check.ts
git commit -F- <<'EOF'
chore(cms): check the migrated dataset against the source data

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 10: Archive, athletes, press and black belts read Sanity

Each page swaps its `@/data` import for the async getter and awaits it inside the component. Markup does not change.

**Files:**
- Modify: `components/archive/SeasonArchive.tsx`, `app/[locale]/actualites/[saison]/page.tsx`, `app/[locale]/resultats/[saison]/page.tsx`, `app/[locale]/athletes/page.tsx`, `app/[locale]/athletes/[slug]/page.tsx`, `app/[locale]/journaux/page.tsx`, `app/[locale]/ceintures-noires/page.tsx`

**Interfaces:**
- Consumes (Task 7, `@/lib/content`): `getSaisons(type): Promise<string[]>` (newest first), `getSaison(type, saison): Promise<Saison | null>`, `getEquipes(): Promise<Equipes>` (`Membre.slug` is `null` when the athlete has no page), `getAthleteSlugs()`, `getAthlete(slug)`, `getJournaux()`, `getCeintures(): Promise<{ceintures, total}>`, `medailles`, types `Saison`, `Personne`; `Contenu` (default export of `components/archive/Contenu.tsx`), `Medal` from `components/archive/Medal.tsx`; `EQUIPES` from `@/sanity/equipes` (Task 4, `[key, fr, en][]`).
- Produces: `SeasonArchive` props become `{ base; saisons: string[]; saison: Saison; locale }`.

- [ ] **Step 1: `components/archive/SeasonArchive.tsx`**

```tsx
import { medailles, type Saison } from '@/lib/content'
import Contenu from './Contenu'
import { Medal } from './Medal'

type Props = { base: 'resultats' | 'actualites'; saisons: string[]; saison: Saison; locale: string }
```

In the season nav, `saisons` are now strings: replace `s.saison` with `s` in `key`, `href`, `aria-current`, the class test and the label. Replace the `<Blocks …/>` line with:

```tsx
<Contenu contenu={e.contenu} locale={locale} alt={e.titre ?? e.lieu ?? saison.saison} />
```

- [ ] **Step 2: `app/[locale]/actualites/[saison]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getSaison, getSaisons } from '@/lib/content'
import PageHero from '@/components/shared/PageHero'
import SeasonArchive from '@/components/archive/SeasonArchive'

type Props = { params: Promise<{ locale: string; saison?: string }> }

export async function generateStaticParams() {
  const saisons = await getSaisons('actualite')
  return ['fr', 'en'].flatMap(locale => saisons.map(saison => ({ locale, saison })))
}
```

`generateMetadata` is unchanged. In the page, replace the two lines that pick `s` with:

```tsx
  const saisons = await getSaisons('actualite')
  const s = await getSaison('actualite', saison ?? saisons[0] ?? '')
  if (!s) notFound()
```

and render `<SeasonArchive base="actualites" saisons={saisons} saison={s} locale={locale} />`.

- [ ] **Step 3: `app/[locale]/resultats/[saison]/page.tsx`**

The same four edits with `'resultat'` and `base="resultats"`:

```tsx
import { getSaison, getSaisons } from '@/lib/content'

export async function generateStaticParams() {
  const saisons = await getSaisons('resultat')
  return ['fr', 'en'].flatMap(locale => saisons.map(saison => ({ locale, saison })))
}
// in the page:
  const saisons = await getSaisons('resultat')
  const s = await getSaison('resultat', saison ?? saisons[0] ?? '')
  if (!s) notFound()
// …
      <SeasonArchive base="resultats" saisons={saisons} saison={s} locale={locale} />
```

- [ ] **Step 4: `app/[locale]/athletes/page.tsx`**

```tsx
import { getEquipes } from '@/lib/content'
import { EQUIPES } from '@/sanity/equipes'

const LABELS: Record<string, [string, string]> = Object.fromEntries(EQUIPES.map(([k, fr, en]) => [k, [fr, en]]))
```

(delete the hard-coded `LABELS` object). In the page, add `const equipes = await getEquipes()` after `const fr = …`, and replace the link test `m.slug && getAthlete(m.slug)` with `m.slug` (the getter already sets `slug: null` when there is no page).

- [ ] **Step 5: `app/[locale]/athletes/[slug]/page.tsx`**

```tsx
import { getAthlete, getAthleteSlugs, type Personne } from '@/lib/content'

export async function generateStaticParams() {
  const slugs = await getAthleteSlugs()
  return ['fr', 'en'].flatMap(locale => slugs.map(slug => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return { title: (await getAthlete(slug))?.nom }
}
```

In the page: `const a = await getAthlete(slug)`.

- [ ] **Step 6: `journaux` and `ceintures-noires`**

`app/[locale]/journaux/page.tsx`: `import { getJournaux } from '@/lib/content'`, then first line after `const fr = …`: `const journaux = await getJournaux()`.

`app/[locale]/ceintures-noires/page.tsx`: `import { getCeintures } from '@/lib/content'`, then after `const locale = …`: `const { ceintures, total } = await getCeintures()`.

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
grep -rn "@/data" components/archive/SeasonArchive.tsx "app/[locale]/actualites" "app/[locale]/resultats" "app/[locale]/athletes" "app/[locale]/journaux" "app/[locale]/ceintures-noires"
```

Expected: checks pass; the grep prints nothing. Free :3000 (Global Constraints), then `npm run build && npx next start -p 3000` in the background, then:

Run: `node scripts/snapshot-text.mjs compare`
Expected: `identical (N pages)`. A difference names the route: open it at http://localhost:3000 next to https://judoboucherville.com and fix the page or the query (Task 7), never `before.json`.

- [ ] **Step 8: Commit**

```bash
git add components/archive/SeasonArchive.tsx "app/[locale]/actualites" "app/[locale]/resultats" "app/[locale]/athletes" "app/[locale]/journaux" "app/[locale]/ceintures-noires"
git commit -F- <<'EOF'
feat(cms): archive, athletes, press and black belts read Sanity

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 11: Club, programmes, instructors and calendar read Sanity

Server components fetch; the client components they render (`Navigation`, `Footer`, `ClassFinder`, `WeekSchedule`, `TourHero`, `InstructorCard`) receive the data as props. Calling the same getter from several components of one page costs one request: Next memoizes identical fetches.

**Files:**
- Modify: `app/[locale]/layout.tsx`, `components/layout/Navigation.tsx`, `components/layout/Footer.tsx`, `app/[locale]/page.tsx`, `components/home/Sections.tsx`, `components/home/ClassFinder.tsx`, `components/home/WeekSchedule.tsx`, `components/home/TourHero.tsx`, `app/[locale]/inscription/page.tsx`, `components/pages/ProgrammeTemplate.tsx`, `app/[locale]/programmes/page.tsx`, `app/[locale]/programmes/[slug]/page.tsx`, `app/[locale]/equipe/page.tsx`, `app/[locale]/equipe/[slug]/page.tsx`, `components/pages/InstructeurTemplate.tsx`, `components/ui/InstructorCard.tsx`, `app/[locale]/calendrier/page.tsx`, `app/[locale]/contact/page.tsx`, `app/robots.ts`, `app/sitemap.ts`

**Interfaces:**
- Consumes (`@/lib/content`): `getClub(): Promise<{club, inscription, palmares, totalPalmares}>`, `getProgrammes()`, `getProgramme(slug)`, `getInstructeurs()`, `getInstructeur(slug)`, `getCalendrier(): Promise<Mois[]>`, `getPhotosSite()`, `getAthleteSlugs()`, `getSaisons(type)`; types `Club`, `Programme`, `Instructeur`, `Photo`, `Categorie`.
- Produces (props, used by Task 13's draft mode as-is): `Navigation({ club })`, `Footer({ club, horaires })`, `ClassFinder({ locale, programmes, saison })`, `WeekSchedule({ locale, programmes, saison })`, `TourHero({ …, endingPhone })`, `InstructorCard({ …, photo?: Photo })`.

- [ ] **Step 1: Layout, `Navigation`, `Footer`**

`app/[locale]/layout.tsx`:

```tsx
import { getClub, getProgrammes } from '@/lib/content'

// The footer's short schedules, in this order
const HORAIRES = ['parents-enfants', 'judo-enfants', 'judo-adultes', 'aiki-jujitsu', 'jiu-jitsu-bresilien']
```

In `generateMetadata`, first line after `const { locale } = …`: `const { club } = await getClub()`. In `LocaleLayout`, after the `notFound()` guard:

```tsx
  const [{ club }, programmes] = await Promise.all([getClub(), getProgrammes()])
  // Only the four fields the footer shows: the full programmes would weigh down every page
  const horaires = HORAIRES.flatMap(s => programmes.filter(p => p.slug === s))
    .map(({ slug, titre, titreEn, horaire }) => ({ slug, titre, titreEn, horaire }))
```

and render `<Navigation club={club} />`, `<Footer club={club} horaires={horaires} />`. A programme Fayçal deletes simply leaves the footer list.

`components/layout/Navigation.tsx`: replace `import { club } from '@/data/club'` with `import type { Club } from '@/lib/content'`, change the signature to `export default function Navigation({ club }: { club: Club })`, and move the module-level `const tel = …` line to the top of the function body, unchanged.

`components/layout/Footer.tsx`: replace both `@/data` imports with `import type { Club, Programme } from '@/lib/content'`, delete the module-level `schedules` (and its comment), and:

```tsx
type Props = { club: Club; horaires: Pick<Programme, 'slug' | 'titre' | 'titreEn' | 'horaire'>[] }

export default function Footer({ club, horaires }: Props) {
```

Rename `schedules.map(` to `horaires.map(`.

- [ ] **Step 2: Home — `ClassFinder`, `WeekSchedule`, `TourHero`**

`components/home/ClassFinder.tsx`: replace both `@/data` imports with `import type { Programme } from '@/lib/content'` and drop `useMemo` from the React import. Move the module constants into the component (they now depend on props) and compute `matches` directly:

```tsx
export default function ClassFinder({ locale, programmes, saison }: { locale: string; programmes: Programme[]; saison: string }) {
  const fr = locale === 'fr'
  const [year, setYear] = useState<number | null>(null)

  // Everything follows the season set in the Studio (« 2026-2027 » → 2026): the year list and the matching follow on their own.
  const SEASON = Number(saison.slice(0, 4))
  // Programs with age groups the finder can match (sport-études has none)
  const board = programmes.filter(p => p.groupes.length > 0)
  // Youngest birth year any group accepts (2022 this season), down to 1940
  const YOUNGEST = Math.max(...board.flatMap(p => p.groupes.map(g => birthYears(g.clientele, SEASON)?.max ?? -Infinity)))
  const YEARS = Array.from({ length: YOUNGEST - 1940 + 1 }, (_, i) => YOUNGEST - i)

  const matches = year === null ? [] : board
    .map(p => ({ p, groupes: p.groupes.filter(g => matchesBirthYear(g.clientele, year, SEASON)) }))
    .filter(m => m.groupes.length > 0)
```

Delete the old module-level block (its comment, `SEASON`, `board`, `YOUNGEST`, `YEARS`) and replace `inscription.saison` with `saison` in the copy.

`components/home/WeekSchedule.tsx`: replace both `@/data` imports with `import type { Categorie, Programme } from '@/lib/content'`. Wrap the module-level loop in a function and keep `minutes` above it:

```tsx
const minutes = (h: string) => { const [a, b] = h.split('h').map(Number); return a * 60 + b }

// One list per weekday, merged by program + time, sorted by start time
function semaine(programmes: Programme[]) {
  const week: Slot[][] = Array.from({ length: 7 }, () => [])
  for (const p of programmes) {
    if (p.slug === 'camp-de-jour') continue // summer only, not a weekly class
    for (const g of p.groupes) {
      for (const s of parseHoraire(g.horaire)) {
        const day = week[s.day]
        const same = day.find(x => x.slug === p.slug && x.start === s.start && x.end === s.end)
        if (same) { if (!same.codes.includes(g.code)) same.codes.push(g.code) }
        else day.push({ slug: p.slug, titre: p.titre, titreEn: p.titreEn, categorie: p.categorie, start: s.start, end: s.end, codes: [g.code] })
      }
    }
  }
  week.forEach(d => d.sort((a, b) => minutes(a.start) - minutes(b.start)))
  return week
}
```

Signature: `export default function WeekSchedule({ locale, programmes, saison }: { locale: string; programmes: Programme[]; saison: string })`, first body line `const WEEK = semaine(programmes)`; replace `inscription.saison` with `saison`.

`components/home/TourHero.tsx`: delete the `ENDING_PHONE` constant and its `@/data/photos` import (Task 2), add `endingPhone: string` to the props type and the destructuring, use `endingPhone` where `ENDING_PHONE` was, and change that effect's dependency list from `[]` to `[endingPhone]`.

- [ ] **Step 3: Home — `Sections.tsx` and `page.tsx`**

`components/home/Sections.tsx`: replace the `@/data/club` and `@/data/photos` imports with `import { getClub, getPhotosSite } from '@/lib/content'` and delete the module-level `tel`. Let the photo honour the focal point set in the Studio:

```tsx
function Photo({ src, alt, pos, className = '', sizes }: { src: string; alt: string; pos?: string; className?: string; sizes: string }) {
```

and add `style={{ objectPosition: pos }}` to its `<Image>`. Then make each section async and fetch what it reads:

```tsx
export async function Steps({ locale }: { locale: string }) {
  const { inscription } = await getClub()
export async function Dojo({ locale }: { locale: string }) {
  const [{ club }, P] = await Promise.all([getClub(), getPhotosSite()])
export async function Palmares({ locale }: { locale: string }) {
  const { palmares, totalPalmares } = await getClub()
export async function Faq({ locale }: { locale: string }) {
  const { club, inscription } = await getClub()
  const tel = `tel:+1${club.tel.replace(/\D/g, '')}`
export async function FindUs({ locale }: { locale: string }) {
  const [{ club }, P] = await Promise.all([getClub(), getPhotosSite()])
  const tel = `tel:+1${club.tel.replace(/\D/g, '')}`
```

Each `<Photo src={P.x.src} alt={…}` also gets `pos={P.x.pos}`.

`app/[locale]/page.tsx`: replace the `@/data/club` import with `import { getClub, getPhotosSite, getProgrammes } from '@/lib/content'`. Turn the module-level `jsonLd` object into a function of `club` (body unchanged):

```tsx
import type { Club } from '@/lib/content'

const jsonLd = (club: Club) => ({
  // … the same object as before …
})
```

In `generateMetadata`: `const { inscription } = await getClub()`. In `HomePage`, first line after `const { locale } = …`:

```tsx
  const [{ club, inscription }, programmes, photos] = await Promise.all([getClub(), getProgrammes(), getPhotosSite()])
```

then `JSON.stringify(jsonLd(club))`, `<TourHero locale={locale} copy={copy} endingPhone={photos.murCjb.src} />`, `<ClassFinder locale={locale} programmes={programmes} saison={inscription.saison} />`, `<WeekSchedule locale={locale} programmes={programmes} saison={inscription.saison} />`.

- [ ] **Step 4: Programmes and registration**

`components/pages/ProgrammeTemplate.tsx`: replace both `@/data` imports with `import { getClub, type Programme } from '@/lib/content'`, make the component `async`, add `const { club, inscription } = await getClub()` as its first line, and replace `p.colonnes ?? COLONNES_TARIF` with `p.colonnes`.

`app/[locale]/programmes/page.tsx`: `import { getProgrammes } from '@/lib/content'`; `const programmes = await getProgrammes()`.

`app/[locale]/programmes/[slug]/page.tsx`:

```tsx
import { getProgramme, getProgrammes } from '@/lib/content'

export async function generateStaticParams() {
  const programmes = await getProgrammes()
  return ['fr', 'en'].flatMap(locale => programmes.map(p => ({ locale, slug: p.slug })))
}
```

and `const programme = await getProgramme(slug)` in `generateMetadata` and in the page.

`app/[locale]/inscription/page.tsx`: replace both `@/data` imports with `import { getClub, getProgrammes } from '@/lib/content'`. In `generateMetadata`: `const { inscription } = await getClub()`. In the page, first line after `const { locale } = …`:

```tsx
  const [{ club, inscription }, programmes] = await Promise.all([getClub(), getProgrammes()])
```

The English fee headers now come from the Studio (the column names change each season):

```tsx
  const colonnesEn: Record<string, string> = {
    ...Object.fromEntries(inscription.colonnesTarif.map((c, i) => [c, inscription.colonnesTarifEn[i] ?? c])),
    'Coût': 'Fee',
  }
```

(replaces the hard-coded `colonnesEn`; keep every other key it had that is not a season column). Replace `p.colonnes ?? COLONNES_TARIF` with `p.colonnes`. The QR code is optional now: wrap the `<div>` that holds `<Image src={inscription.qr} …>` in `{inscription.qr && ( … )}`.

- [ ] **Step 5: Instructors**

`components/ui/InstructorCard.tsx`: add `import type { Photo } from '@/lib/content'`; in `Props` and the destructuring, `photoSrc?: string` becomes `photo?: Photo`. The image branch (the fallback initials stay):

```tsx
        {photo ? (
          <Image
            src={photo.src}
            alt={nom}
            fill
            style={{ objectPosition: photo.pos }}
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
```

The Studio focal point, when set, overrides `object-top`.

`components/pages/InstructeurTemplate.tsx`: `import type { Instructeur } from '@/lib/content'`, and the image branch:

```tsx
              {instructeur.photo ? (
                <Image
                  src={instructeur.photo.src}
                  alt={instructeur.nom}
                  fill
                  style={{ objectPosition: instructeur.photo.pos }}
                  className="object-cover object-top grayscale"
                />
              ) : (
```

`app/[locale]/equipe/page.tsx`: `import { getInstructeurs } from '@/lib/content'`, `const instructeurs = await getInstructeurs()`, `photo={instr.photo}`.

`app/[locale]/equipe/[slug]/page.tsx`:

```tsx
import { getInstructeur, getInstructeurs } from '@/lib/content'

export async function generateStaticParams() {
  const instructeurs = await getInstructeurs()
  return ['fr', 'en'].flatMap(locale => instructeurs.map(i => ({ locale, slug: i.slug })))
}
```

and `const instructeur = await getInstructeur(slug)` in `generateMetadata` and in the page.

- [ ] **Step 6: Calendar, contact, robots, sitemap**

`app/[locale]/calendrier/page.tsx`: replace both `@/data` imports with `import { getCalendrier, getClub } from '@/lib/content'`. In `generateMetadata` and the page, fetch what they read; in the page:

```tsx
  const [{ club, inscription }, calendrier] = await Promise.all([getClub(), getCalendrier()])
```

Replace `calendrierJudoQuebec` with `club.calendrierJudoQuebec` and render that link only when it is set: `{club.calendrierJudoQuebec && ( … )}`.

`app/[locale]/contact/page.tsx`: `import { getClub } from '@/lib/content'`. In `generateMetadata`: `const { club } = await getClub()`. Move the module-level `reseaux` array into the page, after `const { club } = await getClub()`.

`app/robots.ts`:

```ts
import { MetadataRoute } from 'next'
import { getClub } from '@/lib/content'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { club } = await getClub()
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/studio'] }],
    sitemap: `${club.site}/sitemap.xml`,
  }
}
```

`app/sitemap.ts`:

```ts
import { MetadataRoute } from 'next'
import { getAthleteSlugs, getClub, getInstructeurs, getProgrammes, getSaisons } from '@/lib/content'

const locales = ['fr', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ club }, programmes, instructeurs, athletes, resultats, actualites] = await Promise.all([
    getClub(), getProgrammes(), getInstructeurs(), getAthleteSlugs(), getSaisons('resultat'), getSaisons('actualite'),
  ])
  const BASE_URL = club.site
  const routes: [string, number][] = [
    ...['', '/programmes', '/inscription', '/calendrier'].map(r => [r, r ? 0.9 : 1] as [string, number]),
    ...['/historique', '/conseil', '/ceintures-noires', '/equipe', '/athletes', '/resultats', '/actualites', '/challenge', '/journaux', '/telechargements', '/contact'].map(r => [r, 0.7] as [string, number]),
    ...programmes.map(p => [`/programmes/${p.slug}`, 0.8] as [string, number]),
    ...instructeurs.map(i => [`/equipe/${i.slug}`, 0.5] as [string, number]),
    ...athletes.map(slug => [`/athletes/${slug}`, 0.4] as [string, number]),
    ...resultats.map(s => [`/resultats/${s}`, 0.4] as [string, number]),
    ...actualites.map(s => [`/actualites/${s}`, 0.4] as [string, number]),
  ]
```

The `return` is unchanged.

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
grep -rln "@/data" app components lib
```

Expected: checks pass; the grep lists only `challenge`, `conseil`, `historique`, `telechargements`, `components/archive/Blocks.tsx`, `components/shared/PageHero.tsx` (Task 12). Free :3000, `npm run build && npx next start -p 3000` in the background, then:

Run: `node scripts/snapshot-text.mjs compare`
Expected: `identical (N pages)`. Also open http://localhost:3000/fr in Edge: pick 2016 in « Trouver mon cours » (the mats flip), the week grid shows classes, the footer lists five schedules, and the phone ending of the tour still shows the club wall (DevTools, phone size).

- [ ] **Step 8: Commit**

```bash
git add "app/[locale]/layout.tsx" "app/[locale]/page.tsx" "app/[locale]/inscription" "app/[locale]/programmes" "app/[locale]/equipe" "app/[locale]/calendrier" "app/[locale]/contact" app/robots.ts app/sitemap.ts components/layout components/home components/pages components/ui/InstructorCard.tsx
git commit -F- <<'EOF'
feat(cms): club, programmes, instructors and calendar read Sanity

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 12: Challenge, board, history, downloads and page photos read Sanity

**Files:**
- Modify: `app/[locale]/challenge/page.tsx`, `app/[locale]/conseil/page.tsx`, `app/[locale]/historique/page.tsx`, `app/[locale]/telechargements/page.tsx`
- Move: `components/shared/PageHero.tsx` → `components/shared/PageHeroView.tsx` (client), then create a new server `components/shared/PageHero.tsx`
- Modify: `components/shared/__tests__/PageHero.test.tsx`
- Delete: `components/archive/Blocks.tsx` (no importer left)

**Interfaces:**
- Consumes (`@/lib/content`): `getChallenge(): Promise<{challenge, divisions, commanditaires: [src, nom][], palmaresChallenge}>`, `getConseil(): Promise<{membres, presidents}>`, `getHistorique(): Promise<{timeline, international, ancienDojo, inauguration}>`, `getTelechargements()`, `getClub()`, `getPhotosSite()`, `PHOTO_KEYS`, types `PhotosSite`, `PhotoKey`; `Medal` from `@/components/archive/Medal`.
- Produces: `<PageHero title subtitle? tag? />` keeps its props and import path, so no page changes; `PageHeroView` takes the same props plus `photos: PhotosSite`.

- [ ] **Step 1: Challenge**

`app/[locale]/challenge/page.tsx`: `import { Medal } from '@/components/archive/Medal'`, and replace the `@/data/club` and `@/data/challenge` imports with `import { getChallenge, getClub } from '@/lib/content'`. In `generateMetadata`: `const { challenge: c } = await getChallenge()`. In the page, first line after `const { locale } = …`:

```tsx
  const [{ club }, { challenge: c, commanditaires, divisions, palmaresChallenge }] = await Promise.all([getClub(), getChallenge()])
```

The four documents are optional in the Studio: wrap each of the `<Button>`s for `c.formulaire`, `c.devis`, `c.programme`, `c.video` in `{c.x && ( … )}`. Sponsor logos are full URLs now: `src={fichier}` instead of `` src={`/images/challenge/${fichier}`} ``. If `tsc` rejects a `<Medal kind={…}>` whose kind comes from an array literal, type that array's medal column as `'or' | 'argent' | 'bronze'` (add `as const` to the literal); no `any`.

- [ ] **Step 2: Board, history, downloads**

`app/[locale]/conseil/page.tsx`: replace `import { membres, presidents } from '@/data/pages'` with `import { getConseil } from '@/lib/content'`, then in the page `const { membres, presidents } = await getConseil()`. An email is optional in the Studio: render the `mailto:` link only when `courriel` is set (`{courriel && <a …>}`).

`app/[locale]/historique/page.tsx`: `import { Medal } from '@/components/archive/Medal'`; replace the `@/data/club` and `@/data/pages` imports with `import { getClub, getHistorique } from '@/lib/content'`. In the page, first line after `const { locale } = …`:

```tsx
  const [{ timeline, international, ancienDojo, inauguration }, { palmares, totalPalmares: tot }] = await Promise.all([getHistorique(), getClub()])
```

`app/[locale]/telechargements/page.tsx`: replace the `@/data/pages` import with `import { getTelechargements } from '@/lib/content'`, then in the page `const groupes = await getTelechargements()`.

- [ ] **Step 3: Update the PageHero test first**

```bash
git mv components/shared/PageHero.tsx components/shared/PageHeroView.tsx
```

In `components/shared/__tests__/PageHero.test.tsx`, render the view with a photo set, and pin the focal point:

```tsx
import PageHeroView from '../PageHeroView'
import { PHOTO_KEYS, type PhotosSite } from '@/lib/content'

const photos = Object.fromEntries(PHOTO_KEYS.map(k => [k, { src: `/${k}.jpg`, w: 1600, h: 1000, pos: '30% 70%', alt: k, altEn: k }])) as PhotosSite
```

Replace every `<PageHero ` with `<PageHeroView photos={photos} ` in the existing tests, and add:

```tsx
it('uses the photo and focal point set in the Studio', () => {
  const { container } = render(<PageHeroView photos={photos} title="Test Title" />)
  const img = container.querySelector('img')!
  expect(img.getAttribute('src')).toContain('valeursRespect.jpg')
  expect(img.style.objectPosition).toBe('30% 70%')
})
```

(`usePathname` returns `null` outside the app router, so the fallback `valeursRespect` applies.)

Run: `npx vitest run components/shared` — Expected: FAIL (`photos` is not used yet, the image still points to the old path).

- [ ] **Step 4: Split `PageHero`**

`components/shared/PageHeroView.tsx` (stays `'use client'`): replace the `@/data/photos` import with `import type { PhotosSite, PhotoKey } from '@/lib/content'`, rename the component to `PageHeroView`, add `photos: PhotosSite` to its props, and pick the photo from it:

```tsx
  const p = photos[PHOTOS.find(([re]) => re.test(pathname ?? ''))?.[1] ?? 'valeursRespect']
```

The `<Image>` becomes `<Image src={p.src} alt="" fill sizes=… className="object-cover" style={{ objectPosition: p.pos }} priority />` (keep its existing `sizes`). `PHOTOS` keeps its `[RegExp, PhotoKey][]` type from Task 2. Rename `type Props` to `export type PageHeroProps` (fields unchanged: `title`, `subtitle?`, `tag?`, `tagColor?`) and type the view `PageHeroProps & { photos: PhotosSite }`.

New `components/shared/PageHero.tsx`:

```tsx
import { getPhotosSite } from '@/lib/content'
import PageHeroView, { type PageHeroProps } from './PageHeroView'

/** Server half: fetches the photos Fayçal sets in the Studio, the view animates them. */
export default async function PageHero(props: PageHeroProps) {
  return <PageHeroView {...props} photos={await getPhotosSite()} />
}
```

Run: `npx vitest run components/shared` — Expected: PASS.

- [ ] **Step 5: Delete `Blocks.tsx`**

```bash
grep -rn "archive/Blocks\|from './Blocks'" app components lib
```

Expected: nothing. Then `git rm components/archive/Blocks.tsx`.

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
grep -rn "@/data" app components lib
```

Expected: checks pass; the grep prints **nothing** — the site no longer reads `data/`. Free :3000, `npm run build && npx next start -p 3000` in the background, then:

Run: `node scripts/snapshot-text.mjs compare`
Expected: `identical (N pages)`. Open http://localhost:3000/fr/challenge and /fr/historique in Edge: sponsor logos, flags and the old-dojo photos load (from `cdn.sanity.io`).

- [ ] **Step 7: Commit**

```bash
git add "app/[locale]/challenge" "app/[locale]/conseil" "app/[locale]/historique" "app/[locale]/telechargements" components/shared components/archive
git commit -F- <<'EOF'
feat(cms): challenge, board, history, downloads and page photos read Sanity

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 13: Click-to-edit — draft preview and the Presentation tool

Fayçal opens « Présentation » in the Studio, sees the site with his unpublished changes, clicks a text, and its field opens. Behind it: Next draft mode, a drafts client with stega markers, and `<VisualEditing />`.

**Files:**
- Create: `lib/sanity/stega.ts`, `lib/sanity/__tests__/stega.test.ts`, `app/api/draft-mode/enable/route.ts`, `app/api/draft-mode/disable/route.ts`, `components/sanity/DisableDraftMode.tsx`, `sanity/presentation.ts`
- Modify: `lib/sanity/client.ts`, `app/[locale]/layout.tsx`, `sanity.config.ts`, `proxy.ts`

**Interfaces:**
- Consumes: `client`, `sanityFetch` (Task 7), `SANITY_API_READ_TOKEN` (Task 3, server-only), `structure` (Task 6), `EQUIPES`.
- Produces: `stegaFilter` (stega `filter` option); `GET /api/draft-mode/enable` (called by Presentation with its own secret), `GET /api/draft-mode/disable`; `sanityFetch` unchanged in signature.

- [ ] **Step 1: Failing test — markers never touch fields the site reads as data**

`lib/sanity/__tests__/stega.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { stegaFilter } from '../stega'

type Path = (string | number | { _key: string; _index: number })[]
const marque = (sourcePath: Path, value: string, filterDefault = () => true) =>
  stegaFilter({ sourcePath, resultPath: sourcePath, value, sourceDocument: { _id: 'x', _type: 'programme' }, filterDefault })

describe('stegaFilter', () => {
  it('marks text Fayçal edits', () => {
    expect(marque(['titre'], 'Judo enfants')).toBe(true)
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'notes'], 'Apporter une bouteille d’eau')).toBe(true)
  })
  it('leaves parsed and compared fields clean', () => {
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'horaire'], 'Samedi 09h00 à 10h00')).toBe(false)
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'clientele'], '5 à 7 ans')).toBe(false)
    expect(marque(['groupes', { _key: 'a', _index: 0 }, 'code'], 'JE1')).toBe(false)
    expect(marque(['slug', 'current'], 'judo-enfants')).toBe(false)
    expect(marque(['inscription', 'saison'], '2026-2027')).toBe(false)
    expect(marque(['colonnes', 0], 'Avant le 19 août')).toBe(false)
    expect(marque(['categorie'], 'enfants')).toBe(false)
    expect(marque(['equipes', 0], 'u16')).toBe(false)
    expect(marque(['debut'], '2026-08-30')).toBe(false)
  })
  it('leaves links, emails and phone numbers clean', () => {
    expect(marque(['tel'], '450 655-1888')).toBe(false)
    expect(marque(['courriel'], 'info@judoboucherville.com')).toBe(false)
    expect(marque(['formulaire'], 'https://example.com/inscription.pdf')).toBe(false)
    expect(marque(['texte'], '/fr/inscription')).toBe(false)
  })
  it('defers everything else to the default filter', () => {
    expect(marque(['titre'], 'Judo enfants', () => false)).toBe(false)
  })
})
```

Run: `npx vitest run lib/sanity`
Expected: FAIL, `Cannot find module '../stega'`.

- [ ] **Step 2: `lib/sanity/stega.ts`**

```ts
import type { StegaConfig } from 'next-sanity'

// Fields the site parses, compares or puts in URLs: an invisible click-to-edit marker would break
// the week grid (horaire), the class finder (clientele, saison), links (slug) or grouping (code, equipes).
const LOGIQUE = new Set(['slug', 'saison', 'horaire', 'clientele', 'code', 'categorie', 'colonnes', 'colonnesTarif', 'equipes', 'kind', 'medaille', 'tel', 'courriel', 'debut', 'fin'])
const LIEN = /^(https?:|mailto:|tel:|\/)|@/

export const stegaFilter: NonNullable<StegaConfig['filter']> = props =>
  props.sourcePath.some(s => typeof s === 'string' && LOGIQUE.has(s)) || LIEN.test(props.value)
    ? false
    : props.filterDefault(props)
```

If `StegaConfig` is not re-exported by `next-sanity`, import the type from `@sanity/client` (a devDependency since Task 8; `import type` adds nothing to the bundle).

Run: `npx vitest run lib/sanity`
Expected: PASS.

- [ ] **Step 3: `lib/sanity/client.ts` — drafts with markers in draft mode only**

```ts
import { draftMode } from 'next/headers'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { stegaFilter } from './stega'

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })

// Draft mode is only ever on for people logged into the Studio: drafts, click-to-edit markers, no cache.
// The read token stays on the server; visitors never get it.
const apercu = client.withConfig({
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: 'drafts',
  stega: { enabled: true, studioUrl: '/studio', filter: stegaFilter },
})

// generateStaticParams, the sitemap and robots run outside a request: draftMode() throws there, and there is no preview
const enApercu = async () => { try { return (await draftMode()).isEnabled } catch { return false } }

/** Published content, cached 30 s: a change published in the Studio is online within a minute, with no redeploy. */
export const sanityFetch = async <T>(query: string, params: Record<string, unknown> = {}) =>
  (await enApercu())
    ? apercu.fetch<T>(query, params, { cache: 'no-store' })
    : client.fetch<T>(query, params, { next: { revalidate: 30 } })
```

- [ ] **Step 4: Draft-mode routes and the « Quitter l'aperçu » button**

`app/api/draft-mode/enable/route.ts`:

```ts
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/lib/sanity/client'

// Presentation opens the site through this route with a one-time secret; the viewer token checks it
export const { GET } = defineEnableDraftMode({ client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }) })
```

`app/api/draft-mode/disable/route.ts`:

```ts
import { draftMode } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  (await draftMode()).disable()
  return NextResponse.redirect(new URL('/', request.url))
}
```

`components/sanity/DisableDraftMode.tsx` — without it, Fayçal visiting the site in the same browser after the Studio would see his drafts and think they are online:

```tsx
'use client'
import { useIsPresentationTool } from 'next-sanity/hooks'

export default function DisableDraftMode() {
  // Inside the Studio, Presentation controls the preview itself
  if (useIsPresentationTool() !== false) return null
  return (
    <a href="/api/draft-mode/disable" className="btn btn-primary fixed bottom-4 right-4 z-50">
      Aperçu des brouillons · Quitter
    </a>
  )
}
```

`app/[locale]/layout.tsx`: add

```tsx
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import DisableDraftMode from '@/components/sanity/DisableDraftMode'
```

in `LocaleLayout`, next to the `Promise.all` from Task 11: `const { isEnabled: apercu } = await draftMode()`, and as the last children of `<body>`:

```tsx
        {apercu && <><VisualEditing /><DisableDraftMode /></>}
```

`<VisualEditing />` draws the click targets and refreshes the page when Fayçal types.

`proxy.ts`: let `/api/…` through untranslated (otherwise next-intl redirects `/api/draft-mode/enable` to `/fr/api/…`):

```ts
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
```

- [ ] **Step 5: `sanity/presentation.ts` — which pages show which document**

```ts
import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

const select = { titre: 'titre', nom: 'nom', slug: 'slug.current', saison: 'saison' }
const page = (title: string, href: string) => ({ title, href })
const pages = (...l: { title: string; href: string }[]) => defineLocations({ locations: l })

export const resolve: PresentationPluginOptions['resolve'] = {
  // The « Utilisé sur » box above each form: one click opens the page beside it
  locations: {
    club: pages(page('Accueil', '/fr'), page('Inscription', '/fr/inscription'), page('Contact', '/fr/contact')),
    programme: defineLocations({
      select,
      resolve: d => ({ locations: d?.slug ? [page(d.titre ?? 'Programme', `/fr/programmes/${d.slug}`), page('Inscription', '/fr/inscription'), page('Accueil', '/fr')] : [] }),
    }),
    instructeur: defineLocations({
      select,
      resolve: d => ({ locations: d?.slug ? [page(d.nom ?? 'Instructeur', `/fr/equipe/${d.slug}`), page('Équipe', '/fr/equipe')] : [] }),
    }),
    athlete: defineLocations({
      select,
      resolve: d => ({ locations: [...(d?.slug ? [page(d.nom ?? 'Athlète', `/fr/athletes/${d.slug}`)] : []), page('Athlètes', '/fr/athletes')] }),
    }),
    actualite: defineLocations({ select, resolve: d => ({ locations: d?.saison ? [page(`Nouvelles ${d.saison}`, `/fr/actualites/${d.saison}`)] : [] }) }),
    resultat: defineLocations({ select, resolve: d => ({ locations: d?.saison ? [page(`Résultats ${d.saison}`, `/fr/resultats/${d.saison}`)] : [] }) }),
    evenement: pages(page('Calendrier', '/fr/calendrier')),
    journaux: pages(page('Journaux', '/fr/journaux')),
    ceintureNoire: pages(page('Ceintures noires', '/fr/ceintures-noires')),
    challenge: pages(page('Challenge', '/fr/challenge')),
    conseil: pages(page('Conseil', '/fr/conseil')),
    historique: pages(page('Historique', '/fr/historique')),
    telechargements: pages(page('Téléchargements', '/fr/telechargements')),
    photosSite: pages(page('Accueil', '/fr'), page('Programmes', '/fr/programmes')),
  },
  // Browsing the site inside Presentation opens the matching form on its own
  mainDocuments: defineDocuments([
    { route: '/fr/programmes/:slug', filter: '_type == "programme" && slug.current == $slug' },
    { route: '/fr/equipe/:slug', filter: '_type == "instructeur" && slug.current == $slug' },
    { route: '/fr/athletes/:slug', filter: '_type == "athlete" && slug.current == $slug' },
    { route: '/fr/inscription', filter: '_id == "club"' },
    { route: '/fr/contact', filter: '_id == "club"' },
    { route: '/fr/challenge', filter: '_id == "challenge"' },
    { route: '/fr/conseil', filter: '_id == "conseil"' },
    { route: '/fr/historique', filter: '_id == "historique"' },
    { route: '/fr/telechargements', filter: '_id == "telechargements"' },
  ]),
}
```

In `sanity.config.ts`, add Presentation between the menu and the locale:

```ts
import { presentationTool } from 'sanity/presentation'
import { resolve } from './sanity/presentation'

  plugins: [
    structureTool({ structure, title: 'Contenu' }),
    presentationTool({ title: 'Présentation', resolve, previewUrl: { initial: '/fr', previewMode: { enable: '/api/draft-mode/enable' } } }),
    frFRLocale(),
  ],
```

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
```

Expected: pass. Free :3000, `npm run build && npx next start -p 3000` in the background.

Run: `node scripts/snapshot-text.mjs compare`
Expected: `identical (N pages)` (draft mode is off for the crawler).

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/enable`
Expected: `401` (no secret: refused), not `307` (a redirect to `/fr/api/…` means the `proxy.ts` matcher change is missing).

By hand in Edge, logged in, at http://localhost:3000/studio:
1. « Présentation » shows the home page beside the menu.
2. Click the season line of « Trouver mon cours »: nothing happens (saison is clean). Click the title « Judo enfants » in the week grid: the programme form opens.
3. In that form, add « TEST » to the title without publishing: the preview shows it within a few seconds, the week grid still has every class, and « Trouver mon cours » still flips the mats for 2016.
4. Open http://localhost:3000/fr in a normal tab of the same browser: the « Aperçu des brouillons · Quitter » button shows, and « TEST » too. Click the button: back on the home page, « TEST » gone, button gone.
5. In the Studio, « … » → « Annuler les modifications » on the programme. Nothing was published.

- [ ] **Step 7: Commit**

```bash
git add lib/sanity app/api/draft-mode components/sanity sanity/presentation.ts sanity.config.ts "app/[locale]/layout.tsx" proxy.ts
git commit -F- <<'EOF'
feat(cms): click-to-edit preview with the Presentation tool

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 14: Delete the old content sources

Sanity is now the only source. Everything that fed or checked the migration goes, and so do the images the migration uploaded.

**Files:**
- Delete: `data/`, `scripts/import-legacy.mjs`, `scripts/extract-legacy.mjs`, `scripts/migrate/`, `scripts/migrate-to-sanity.ts`, `scripts/snapshot-text.mjs`, `public/archive/`, `public/images/photos/`, `public/images/qr/`, `public/images/challenge/`, `public/images/scraped/`
- Modify: `lib/schedule.ts` (comment), `.gitignore`, `package.json`

**Interfaces:**
- Consumes: the migrated dataset (Task 9) and pages that read only `@/lib/content` (Tasks 10–12).
- Produces: nothing new. Kept on purpose: `public/images/{Dojo,Logos,brand}`, `public/images/logo-cjb-improved.png`, `public/{hero,fonts,motifs,videos}`, `scripts/studio-shot.mjs`.

- [ ] **Step 1: Nothing outside the doomed files still reads them**

```bash
grep -rln "@/data\|data/archive\|import-legacy\|extract-legacy\|snapshot-text\|migrate-to-sanity\|scripts/migrate" app components lib sanity proxy.ts next.config.ts package.json
grep -rn "/archive/\|images/photos\|images/qr\|images/challenge\|images/scraped" app components lib sanity
```

Expected: both print nothing. A hit is a page still pointing at a local file: send it through `@/lib/content` first (the image is in Sanity since Task 9).

- [ ] **Step 2: Delete**

```bash
git rm -r -q data scripts/import-legacy.mjs scripts/extract-legacy.mjs scripts/migrate scripts/migrate-to-sanity.ts scripts/snapshot-text.mjs public/archive public/images/photos public/images/qr public/images/challenge public/images/scraped
rm -rf scripts/snapshots scripts/migrate
```

(`scripts/snapshots/` and `scripts/migrate/.assets.json` are gitignored, hence the `rm`.) In `.gitignore`, delete the `scripts/snapshots/` and `scripts/migrate/.assets.json` lines. In `lib/schedule.ts`, the first comment line now reads `// Reads the free-text schedules and age groups set in the Studio (Programmes), so the`.

`tsx` only ran the migration, now gone: `npm uninstall -D tsx`. Keep `groq-js` (Task 7 tests) and `@sanity/client` (Task 15 test).

- [ ] **Step 3: Verify — every page, no dead image**

```bash
npx tsc --noEmit && npx vitest run && npm run lint
```

Expected: pass (the round-trip test left with `scripts/migrate/`). Free :3000, then `npm run build && npx next start -p 3000` in the background.

Save this outside the repo (your scratchpad) as `pages-ok.mjs` and run `node pages-ok.mjs`:

```js
// Every sitemap page answers 200 and references no deleted local file.
const base = 'http://localhost:3000'
const xml = await (await fetch(`${base}/sitemap.xml`)).text()
const paths = [...xml.matchAll(/<loc>[^<]*?(\/(?:fr|en)[^<]*)<\/loc>/g)].map(m => m[1])
const MORT = /\/(archive|images\/(photos|qr|challenge|scraped))\//
let ko = 0
for (const p of paths) {
  const r = await fetch(base + p)
  const html = (await r.text()).replaceAll('%2F', '/') // next/image URL-encodes the source path
  if (r.status !== 200 || MORT.test(html)) { ko++; console.log(r.status, p, html.match(MORT)?.[0] ?? '') }
}
console.log(`${paths.length - ko}/${paths.length} pages ok`)
process.exit(ko ? 1 : 0)
```

Expected: `N/N pages ok`, N being every FR and EN route in the sitemap (several hundred).

- [ ] **Step 4: Commit**

```bash
git add -A data scripts public lib/schedule.ts .gitignore package.json package-lock.json
git commit -F- <<'EOF'
chore(cms): remove the old content files, Sanity is the only source

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 15: End-to-end test, help screenshots, preview, handoff

**Files:**
- Create: `scripts/e2e-cms.mjs`, `public/studio-help/{presentation,horaire,nouvelle,athlete,photo,historique}.png`

**Interfaces:**
- Consumes: `scripts/studio-shot.mjs` (`--login [base]` saves a login per site, Task 6), `SANITY_API_WRITE_TOKEN` in `.env.local`, the six image names in `sanity/HelpPane.tsx` (Task 6).

- [ ] **Step 1: `scripts/e2e-cms.mjs` — the Studio loads, a published change reaches the page**

```js
// End-to-end: the Studio loads (logged in), and a change published in Sanity shows on the page without a redeploy.
// Needs the site running on base, .env.local, and the saved login (node scripts/studio-shot.mjs --login).
// Run: node --env-file=.env.local scripts/e2e-cms.mjs [base]
import { chromium } from 'playwright'
import { createClient } from '@sanity/client'
import { fileURLToPath } from 'node:url'

const base = process.argv[2] ?? 'http://localhost:3000'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
const ctx = await chromium.launchPersistentContext(fileURLToPath(new URL('./.studio-profile/', import.meta.url)), { channel: 'msedge' })
const page = ctx.pages()[0] ?? await ctx.newPage()

await page.goto(`${base}/studio/structure`)
await page.getByText('Club et inscription').first().waitFor({ timeout: 60_000 })
console.log('ok  le Studio se charge')

// A visible, harmless field, put back as it was whatever happens
const { responsable } = await client.fetch('*[_id == "club"][0]{responsable}')
const marque = `${responsable} (test ${Date.now() % 10000})`
await client.patch('club').set({ responsable: marque }).commit()
try {
  const debut = Date.now()
  for (;;) {
    await page.goto(`${base}/fr/inscription`)
    if ((await page.locator('body').innerText()).includes(marque)) break
    if (Date.now() - debut > 120_000) throw new Error('changement toujours absent après 2 minutes')
    await page.waitForTimeout(5_000)
  }
  console.log(`ok  changement publié visible en ${Math.round((Date.now() - debut) / 1000)} s`)
} finally {
  await client.patch('club').set({ responsable }).commit()
  await ctx.close()
}
```

Free :3000, `npm run build && npx next start -p 3000` in the background.

Run: `node --env-file=.env.local scripts/e2e-cms.mjs`
Expected: two `ok` lines, the second under 90 s. If it times out, check `sanityFetch`'s `revalidate: 30` (Task 7) before anything else.

```bash
git add scripts/e2e-cms.mjs
git commit -F- <<'EOF'
test(cms): end-to-end check that a published change reaches the site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 2: Help screenshots**

Server still on :3000, logged in (Task 6). Each shot shows the screen its help task starts from. The migration's programme ids are `programme-<slug>`; `/intent/edit/…` opens a document wherever it sits in the menu.

```bash
mkdir -p public/studio-help
node scripts/studio-shot.mjs "/studio/presentation?preview=/fr" public/studio-help/presentation.png
node scripts/studio-shot.mjs "/studio/intent/edit/id=programme-judo-enfants;type=programme" public/studio-help/horaire.png
node scripts/studio-shot.mjs "/studio/structure/actualite" public/studio-help/nouvelle.png
node scripts/studio-shot.mjs "/studio/structure/athletes;equipe-u16" public/studio-help/athlete.png
node scripts/studio-shot.mjs "/studio/structure/photosSite" public/studio-help/photo.png
node scripts/studio-shot.mjs "/studio/structure/club" public/studio-help/historique.png
```

Open each PNG. `horaire.png` shows the programme form with its tabs (« Groupes et horaires », « Tarifs »); `historique.png` shows a form with the history clock at the top and « … » at the bottom. A login screen in a shot means the saved login expired: `node scripts/studio-shot.mjs --login`, then retake.

Then in Edge at http://localhost:3000/studio → « Comment faire »: every task shows its image.

```bash
git add public/studio-help
git commit -F- <<'EOF'
docs(cms): screenshots for the Studio help page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 3: Preview deployment**

```bash
git push origin redesign-tatami
```

Vercel builds the branch preview. Use its branch URL (`…-git-redesign-tatami-….vercel.app`), which stays the same across pushes:

```bash
npx sanity cors add https://<preview-host> --credentials
node scripts/studio-shot.mjs --login https://<preview-host>
node --env-file=.env.local scripts/e2e-cms.mjs https://<preview-host>
```

🛑 The second line opens Edge: Yousif signs in to Sanity (and to Vercel if the preview asks), then closes the window.
Expected: two `ok` lines. Never push `master`.

- [ ] **Step 4: SEO check**

Run the `seo-page` skill on `<preview>/fr`, `/fr/inscription`, `/fr/programmes`, `/fr/challenge`, `/fr/contact`. Expected: same findings as before the migration (titles, descriptions, JSON-LD unchanged); `/studio` is `noindex` and disallowed in `robots.txt`. Fix any regression in its own commit.

- [ ] **Step 5: 🛑 Yousif tries it cold**

Ask Yousif to do the six « Comment faire » tasks on `<preview>/studio`, alone, reading only the help page, and to note every hesitation. Each hesitation becomes a wording fix (field `description`, help step, or menu title) in its own commit, then re-push the branch.

- [ ] **Step 6: 🛑 Handoff**

Ask Yousif (in French) for:
1. The OK to invite Fayçal to the Sanity project as administrator (`npx sanity users invite <his email> --role administrator`, only after that OK).
2. A separate OK to merge into `master` and deploy production. Until then, production keeps reading `data/` from its own commit, so nothing Fayçal publishes shows on the live site: tell Yousif so plainly.

Report: the preview URL, the Studio URL, what Fayçal can change, what stays in code (menus, buttons, design), and the E2E timing from Step 3.
