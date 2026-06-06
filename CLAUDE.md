# CLAUDE.md — Briefing for Claude (Anthropic) on the Madani Era Timeline

> **Repo:** `anubisland/madani-era-timeline-app`
> **Live:** https://anubisland.github.io/madani-era-timeline-app/

## TL;DR

A static, no-build, vanilla-JS bilingual (AR RTL / EN LTR) timeline of the Prophet's biography. **4 eras / 36 stages**. Deployed to GitHub Pages from `main`. No build step, no framework, no npm runtime dependency.

| Key | Era | Steps |
|---|---|---|
| `meccan`  | Meccan Era (570 CE → eve of Hijra) | 16 |
| `hijra`   | The Hijra | 6 |
| `badr`    | Battle of Badr | 3 |
| `medinan` | Medinan Era (1 – 11 AH) | 11 |

## File map (the entire surface area)

```
Sera/
├── index.html              # Entry — UI + 4 inline SVG maps
├── style.css               # Emerald (#063529) + gold (#C5A059) design system
├── app.js                  # All behaviour: lang toggle, switchEv, step nav, TTS
├── data.js                 # Bilingual data — window.SEERAH_DB
├── timeline_data.geojson   # 24 geographic features
├── package.json            # version + npm start (npx serve)
├── README.md               # User docs
├── CHANGELOG.md            # Keep-a-Changelog, semver
├── CONTRIBUTING.md         # How to add a step / era
├── LICENSE                 # MIT
├── docs/                   # ARCHITECTURE, DATA_SCHEMA, SOURCES
└── .editorconfig
```

## Hard rules for Claude

1. **No build step. No framework. No npm runtime dependency.** Site must work from `file://` AND any static host. Do not propose React, Vue, Svelte, Tailwind, Vite, Webpack, esbuild, etc.
2. **No new files unless necessary.** Edit existing files. Only create a new file when adding a new era with its own SVG.
3. **Every UI string has a `data-ar` AND `data-en` pair.** Verify with a regex sweep after editing `index.html`.
4. **All content must be sourced from the Ahl al-Sunnah wal-Jama'ah canon.** This is non-negotiable. Accepted references: the Six Books (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah) + Musnad Ahmad + Muwatta Malik; classical Sirah (Ibn Hisham, Ibn Ishaq, al-Waqidi, al-Tabari, Ibn Kathir's al-Bidayah); later Sunni scholars (Ibn al-Qayyim's Zad al-Ma'ad, al-Bayhaqi's Dala'il al-Nubuwwah, al-Qadi Iyad's al-Shifa, Ibn Hajar, al-Nawawi); modern Sunni scholarship (Mubarakpuri's al-Rahiq al-Makhtum, Zurqani on al-Mawahib, Dr. Hamidullah). **Do not** introduce narrations that are weak (da'if) without grading, fabricated (mawdu'), or sourced from non-Sunni collections (e.g. al-Kafi, al-Sahifa al-Sajjadiyya, Bihar al-Anwar). If a hadith is graded weak, the source chip must note the grade.
5. **MIT for code; classical Seerah content stays public domain with citations.** Never remove a `srcs[]` entry.
6. **Single state object** in `app.js`: `{ EVT, STEP, LANG }`. No new globals.
7. **Commit format: Conventional Commits.** `feat:` / `fix:` / `docs:` / `style:` / `refactor:`.
8. **Update `CHANGELOG.md` and bump `package.json` version** in the same commit that changes behaviour.
9. **No secrets, .env files, or `node_modules/` committed.** Use `npx --yes serve .` so the install stays ephemeral.
10. **Don't push to `main` if changes break the live site** — the only reviewer is GitHub Pages itself.

## Adding a step (most common task)

1. Edit `data.js`, find the event object (e.g. `meccan.steps[]`).
2. Append a step object with **all** these fields (empty `""` is fine for `ayah` / `ayahRef`):
   ```
   ayah, ayahRef, ayahEn, ayahRefEn,
   dateAr, dateEn,
   titleAr, titleEn,
   mtAr, mtEn, mdAr, mdEn,
   amb,                 // "day" | "dawn" | "noon" | "night" | "winter"
   timeAr, timeEn, distAr, distEn,
   descAr, descEn,
   charsAr[], charsEn[], // { i, n, r } per figure
   lessonAr, lessonEn,
   srcs[]                // ["البخاري (…)", "مسلم (…)", ...]
   ```
3. If the step has a new map location, append a feature to `timeline_data.geojson` with `event_id: "<era>_<stepIndex>"`.
4. No need to bump `package.json` for an intra-era step; only add a CHANGELOG line under "Unreleased" if relevant.

## Adding an era (rare)

1. Add a new key to `window.SEERAH_DB` in `data.js` (insert in chronological order: meccan → hijra → badr → medinan).
2. Add a `<button class="ev-btn" data-ev="<key>" ...>` to `index.html`'s `.event-switch`.
3. Add an inline `<svg id="svg-<key>" class="map-svg hidden" ...>` to `index.html` directly after `svg-badr`. All `<text>` elements must use `data-ar` / `data-en` pairs.
4. Extend `app.js` `switchEv()` to toggle the new SVG (mirror the existing 4 lines).
5. Bump `package.json` minor version. Add a CHANGELOG entry.

## Bilingual content — Claude's special care

The Arabic content here is **sacred and historical**. When translating or paraphrasing:

- **Quranic verses** must be exact; cite Surah and Ayah. Do not paraphrase.
- **Hadith references** must use authentic canonical collections: البخاري (Bukhari), مسلم (Muslim), أبو داود (Abu Dawud), الترمذي (Tirmidhi), النسائي (al-Nasa'i), ابن ماجه (Ibn Majah), أحمد (Musnad Ahmad), الموطأ (Muwatta Malik).
- **Sirah sources**: ابن هشام (Ibn Hisham), ابن كثير (Ibn Kathir), الطبري (al-Tabari), الواقدي (al-Waqidi), الرحيق المختوم (al-Rahiq al-Makhtum by al-Mubarakpuri), زاد المعاد (Zad al-Ma'ad by Ibn al-Qayyim), دلائل النبوة (Dala'il al-Nubuwwah by al-Bayhaqi).
- **Names**: keep Arabic i'rab (e.g. ﷺ for the Prophet ﷺ, رضي الله عنه for Companions). The English field can add the honorific "(RA)" after the name.
- **Era / location spellings**: standardise to *Makkah, Madinah, Hijra, Badr, Uhud, Khandaq, Hudaybiyyah, Arafat, Ta'if, Syria (al-Sham), Abyssinia, Heraclius, Chosroes, Negus, Muqawqis*. Avoid "Mecca / Medina" transliterations — use the academic forms.

## Build / verify commands

```bash
# Serve locally
npm start                 # alias for: npx --yes serve .

# JS validation (no build needed)
node -e "new Function(require('fs').readFileSync('data.js','utf8'))"

# GeoJSON validation
node -e "JSON.parse(require('fs').readFileSync('timeline_data.geojson','utf8'))"
```

There is **no test framework, no linter, no formatter**. Visual verification is by opening `index.html` in a browser.

## Mobile checklist (verify before merging UI changes)

- [ ] Event switcher wraps to 2×2 grid on ≤720px screens
- [ ] All buttons have ≥44px tap target
- [ ] Map SVG height capped at 50vh on small screens (no horizontal scroll)
- [ ] Ayah box font scales: 1.05rem AR / 0.85rem EN on phones
- [ ] `data-ar` / `data-en` labels present in every new SVG `<text>` element

## Don'ts

- ❌ Don't add a bundler, transpiler, or framework (React, Vue, Alpine, etc.)
- ❌ Don't introduce a runtime npm dependency
- ❌ Don't replace inline SVGs with raster images (PNG/JPG) — keep vector for zoom
- ❌ Don't remove bilingual parallel fields when "refactoring" — they are the feature
- ❌ Don't commit the `node_modules/` from `npx serve` — use `npx --yes serve .` so it stays ephemeral
- ❌ Don't push directly to `main` if changes break the live site

## Reference: `data-ar` / `data-en` sweep

After editing `index.html`, run this from a one-off Node session to confirm every `data-ar` has a `data-en`:

```js
const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const ar = (h.match(/data-ar=/g) || []).length;
const en = (h.match(/data-en=/g) || []).length;
console.log({ ar, en, ok: ar === en });
```
