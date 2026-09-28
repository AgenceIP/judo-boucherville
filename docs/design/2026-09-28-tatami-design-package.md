# Design package: « Hajime » (dojo tour, one 12-second continuous shot)

Branch: `redesign-tatami`. Replaces the v6 « La Voie » look across the whole site.
Architecture deviation from the 10k-websites default, stated on purpose: the site stays the
existing Next.js app (20 routes, FR/EN, archives, Resend contact form). The scrub hero is
built to the skill's engineering standard as a client component inside it.

## 1. Brand premise

**Hajime.** The referee's word that starts every judo match: « commencez ». The whole site
sells starting: find your class, register, show up for the first class. Every section funnels
to one call to action: **Trouver mon cours** (the class finder), which ends on a registration link.
The footage lands on the two start marks of the competition square, the exact spot where
« Hajime » is called.

Information comes first. This is an informational site: the hero is shorter than the skill
default (300vh instead of 400vh), its captions carry real facts, and a quick-info bar is always
visible (Horaire · Tarifs · Inscription · Nous trouver · phone).

## 2. Palette (from the real dojo photos; finalize from approved footage)

```css
:root{
  --canvas:#F4F2EC;         /* the white dojo walls, warmed; never pure white */
  --panel:#FBFAF6;          /* cards, raised surfaces */
  --ink:#0B1B38;            /* text-primary: ceiling / padding navy */
  --text-secondary:#46526A;
  --blue:#0A3F8C;           /* wall padding and mat border royal blue: the brand color */
  --blue-logo:#3A56A5;      /* the logo's own blue, used for the mark only */
  --accent:#F2B705;         /* tatami yellow: CTA buttons and rare emphasis only */
  --accent-hover:#FFC61A;
  --accent-muted:rgba(242,183,5,.18);
  --wood:#C99A5E;           /* the maple wall: warm panels, dividers */
}
```

Rules: yellow is only for « S'inscrire » / « Trouver mon cours » buttons, focus rings, and the
lit mats in the finder. Text on yellow is always `--ink`. Never the rejected v7 poster look
(no extended grotesk, no full-bleed color blocks, no electric cobalt).

## 3. Type trio

- Display: **Big Shoulders Display** 700 and 800. Scoreboard-tall, great for numbers (hours, prices, medal counts).
- Body: **Public Sans** 400 and 600. Signage clarity for dense info.
- Mono: **IBM Plex Mono** 500. Group codes and times (« U10C · 18h00 »).

## 4. Band map (as built)

The approved footage: Seedance 2.5, 12 s, 1080p, image-to-video from the overhead start frame to the
real logo-wall photo (outpainted to 16:9) as the end frame. Scroll maps to time through a
motion-equalized curve (KNOTS in `components/home/TourHero.tsx`), so the fast tilt at 2.5 to 4.5 s gets
more scroll. Hero height 650vh.

| Band | Range | Footage moment | Copy FR | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.14 | Overhead, yellow square | « Club de Judo Boucherville » / « Depuis 1970. Club reconnu AAA par Judo Québec. » | grid snap-align, load ramp |
| 2 | 0.20 to 0.40 | Camera pitches up, the room falls into frame | « Dès 4 ans. Sans âge limite. » | drift-down |
| 3 | 0.46 to 0.72 | Glide across the tatami | « 13 programmes. » / disciplines / « Du lundi au dimanche » | approach-from-depth |
| 4 | 0.84 to 1.00 | Push-in, rest on the logo wall | « Hajime. » / sub / CTAs flanking the logo | word-punch, staged settle |

Deviation, stated on purpose: bands 2 and 3 sit on light signage cards (panel at 90%) instead of dark
scrims, because the palette is bright. Band 1 gets a warm yellow wash behind the title. Measured
worst-pixel contrast: band 1 4.23:1, « Hajime. » 5.57:1, settle subline 6.22:1. Flick test passes
at 120, 240 and 360 px steps (`scripts/verify-tour-edge.mjs`).

## 5. Static hero (phones, portrait tablets, reduced motion)

Ending frame full-bleed. « Hajime. » / « Votre premier cours commence ici. » / « Trouver mon cours »
(primary) and « Inscription 2026-2027 ». Below it, immediately, the quick-info bar.

## 6. Below-fold outline (home)

1. **Trouver mon cours** (the one interactive moment, and the signature). A board of tatami
   mats, one per program. The visitor taps a birth year (2022 back to « 2006 et avant ») or
   « 50 ans et plus »; matching mats light yellow in sequence and their cards list group code,
   days and hours, price, and a « S'inscrire » link to that program's form. Reduced motion:
   instant final state. Heading: « Trouver mon cours » / sub: « Choisissez l'année de naissance. Les cours qui vous conviennent s'allument. »
2. **Horaire de la semaine**: Monday to Sunday grid of every class, filterable Enfants / Adultes / Arts martiaux.
   Heading: « La semaine au dojo ».
3. **Inscription en 3 étapes**: 1 « Remplissez le formulaire en ligne » · 2 « Payez par chèque ou virement Interac » · 3 « Présentez-vous au premier cours ».
   Payment line from `inscription.paiement`, start dates from `inscription.debutCours`.
4. **Le dojo** (real photos): tatami, the CJB wall, the values on the walls, Jigoro Kano, the black belt board.
   Heading: « Dojo Marcel Bourelly ». The eight values listed as they appear on the walls.
5. **Pourquoi ici** (proof): « Club reconnu AAA par Judo Québec » · « 423 médailles provinciales et canadiennes depuis 2002 » · « Tous nos professeurs sont accrédités. Aucun bénévole. » · « Entraîneur-chef 7e dan ».
6. **Questions fréquentes**, from research:
   - « À partir de quel âge? » Dès 4 ans avec le cours Parents / enfants (nés de 2019 à 2022). Le parent est inscrit gratuitement.
   - « Mon enfant est timide (ou très actif). Est-ce pour lui? » Oui. On apprend d'abord à tomber sans se faire mal, puis à respecter son partenaire. Les timides prennent confiance. Les plus énergiques apprennent les règles.
   - « Est-ce sécuritaire? » La première chose qu'on apprend au judo, c'est la chute. Tous nos professeurs sont accrédités, aucun bénévole.
   - « Je suis adulte et débutant. Est-ce trop tard? » Non. Le cours Judo adultes accueille débutants et avancés. Un ou deux cours par semaine suffisent pour progresser.
   - « Quel équipement faut-il? » Un judogi (habit de judo), des sandales et la Carte d'Accès Boucherville. Les détails sont donnés à l'inscription.
   - « Comment payer? » Chèque à l'ordre du Club de judo Boucherville, ou virement Interac à info@judoboucherville.com avec le nom du participant.
   - « Les horaires peuvent-ils changer? » Oui, selon le nombre d'inscriptions. On vous avise avant le début des cours.
7. **Nous trouver**: address, map link, phone, email, socials. Existing Resend contact form stays on /contact.
8. Footer: logo, quick links, season, socials.

Inner pages: same tokens, same nav and quick-info bar, page header on a tatami-seam band
instead of the v6 ink/aurora hero. Program pages lead with: groups + hours, prices, « S'inscrire », then description.

## 7. Vector layer

- Tatami seams: SVG hairlines forming the 1:2 mat grid, drawing themselves behind section headings on entry.
- Whisper-level dust motes drifting in the hero light (canvas off when converged / off-screen).
- One fixed background layer: a very faint mat grid on `--canvas` with a slow light drift (60s+ cycle).
- All honor reduced motion: final states shown, drives stopped.

## 8. Engineering list

Blob fetch with loading ring (streamed if over 8 MB), dt-normalized lerp in a resting rAF loop,
gated deadlock-safe seeks, delta-gated DOM writes, band pacing plus flick test, four-layer
legibility system plus worst-frame audit, the five static-hero gates kept live with change
listeners (identical strings in CSS and JS), complete without video, reduced motion live in both
directions, the quality floor, and the self-test checklist, all per `scrub-pipeline.md`.

## 9. Copy gate

Every line above ships verbatim. The built pages must pass: zero em dashes in new copy, zero stock
words (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions), plus the
body-copy sweep for AI tells, before anyone sees it.
