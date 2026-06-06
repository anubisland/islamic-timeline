# AGENTS.md — Project Briefing for AI Coding Agents

> **Repo:** `anubisland/madani-era-timeline-app` — public, GitHub Pages from `main`.
> **Live:** https://anubisland.github.io/madani-era-timeline-app/

## What this project is

A **single-page, no-build, vanilla-JS** bilingual (Arabic RTL / English LTR) timeline of the Prophet's biography. **4 eras / 36 stages**:

| Key | Era | Steps |
|---|---|---|
| `meccan` | Meccan Era (570 CE → eve of Hijra) | 16 |
| `hijra`  | The Hijra | 6 |
| `badr`   | Battle of Badr | 3 |
| `medinan`| Medinan Era (1 – 11 AH) | 11 |

## File map

```
Sera/
├── index.html              # Entry — UI + 4 inline SVG maps
├── style.css               # Emerald (#063529) + gold (#C5A059) design system
├── app.js                  # All behaviour: language toggle, switchEv, step nav, TTS
├── data.js                 # Bilingual data module — window.SEERAH_DB
├── timeline_data.geojson   # 24 geographic features (one per major location)
├── package.json            # version + npm start (npx serve)
├── README.md               # User-facing docs
├── CHANGELOG.md            # Keep-a-Changelog, semver
├── CONTRIBUTING.md         # How to add a step / era
├── LICENSE                 # MIT
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATA_SCHEMA.md
│   └── SOURCES.md
└── .editorconfig
```

## Hard rules (DO NOT violate)

1. **No build step, no framework, no npm runtime dependency.** The site must work from `file://` AND from any static host.
2. **No new files unless necessary.** Edit existing files; add files only when adding a new era/map with its own SVG.
3. **Every UI string has a `data-ar` and `data-en` pair.** Verify with a regex sweep after editing `index.html`.
4. **MIT license for code; classical Seerah content stays public domain with citations.** Never remove a `srcs[]` entry.
5. **Single state object** in `app.js`: `{ EVT, STEP, LANG }`. No new globals.
6. **Commit format: Conventional Commits.** `feat:` / `fix:` / `docs:` / `style:` / `refactor:`.
7. **Update `CHANGELOG.md` and bump `package.json` version** in the same commit that changes behaviour.
8. **Do not commit secrets, .env files, or `node_modules/`.**

## Adding a step (most common task)

1. Open `data.js` and find the event object (e.g. `meccan.steps[]`).
2. Append a step object with **all** these fields (string-empty `""` is fine for `ayah` / `ayahRef`):
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
4. Bump the event's `stepCount` description in CHANGELOG only if adding an era.

See `docs/DATA_SCHEMA.md` for the canonical field reference.

## Adding an era (rare)

1. Add a new key to `window.SEERAH_DB` in `data.js` (insert in chronological order: meccan → hijra → badr → medinan).
2. Add a `<button class="ev-btn" data-ev="<key>" ...>` to `index.html`'s `.event-switch`.
3. Add an inline `<svg id="svg-<key>" class="map-svg hidden" ...>` to `index.html` directly after `svg-badr`.
4. Extend `app.js` `switchEv()` to toggle the new SVG (mirror the existing 4 lines).
5. Bump `package.json` minor version. Add a CHANGELOG entry.

## Build / verify commands

```bash
# Serve locally
npm start                 # alias for: npx --yes serve .

# Quick JS validation (no build needed)
node -e "new Function(require('fs').readFileSync('data.js','utf8'))"

# GeoJSON validation
node -e "JSON.parse(require('fs').readFileSync('timeline_data.geojson','utf8'))"
```

There is **no test framework, no linter, no formatter** in this project. Visual verification is by opening `index.html` in a browser.

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
- ❌ Don't push directly to `main` if changes break the live site; the only reviewer is GitHub Pages itself

## Reference: `data-ar` / `data-en` sweep

After editing `index.html`, run this from a one-off Node session to confirm every `data-ar` has a `data-en`:

```js
const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const ar = (h.match(/data-ar=/g) || []).length;
const en = (h.match(/data-en=/g) || []).length;
console.log({ ar, en, ok: ar === en });
```
