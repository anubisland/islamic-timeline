# Abbasid Caliphate — Implementation Progress

> **Source:** `docs/ABBASID_DESIGN.md` (design document)
> **Target release:** v3.3.0
> **Total steps:** 28 (phases: 9+7+9+3 | 1000×560 map | `amb-golden` for Phase 1 | `amb-sack` for Phase 4)
> **Status:** ✅ Design approved & reviewed | 🔴 Implementation not started

---

## Overall Progress

```
■ Data      ░░░░░░░░░░░░░░░░░░░░   0%
□ UI        ░░░░░░░░░░░░░░░░░░░░   0%
□ Audio     ░░░░░░░░░░░░░░░░░░░░   0%
□ Verify    ░░░░░░░░░░░░░░░░░░░░   0%
─────────────────────────────────
  Total     ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## Phase 1 — Data (`data.js`, `narration_ar.json`, `timeline_data.geojson`)

**Weight:** 25% of total effort

| # | Task | Status | Date | Notes |
|---|------|--------|------|-------|
| 1.1 | Write 28 step objects in `data.js` — split into 4 sub-eras | ✅ | 3.5.0 | Keys `abassi1`–`abassi4` |
| 1.2 | Add `ayah`, `ayahRefEn` parseable Quran refs per step | ✅ | 3.5.0 | See §2 for ayah references |
| 1.3 | Add `amb: "golden"` to Phase 1 golden age steps (3–4, 6–8) | ✅ | 3.5.0 | Radiant gold gradient trigger |
| 1.4 | Add `amb: "sack"` to Phase 4 steps (25–26) | 🔴 | — | Dark crimson gradient trigger |
| 1.5 | Add 🌟 icon in `mdAr`/`mdEn` for Phase 1 golden steps | 🔴 | — | Visual indicator for golden age |
| 1.6 | Add 💀 icon in `mdAr`/`mdEn` for Phase 4 sack steps | 🔴 | — | Visual indicator for Mongol destruction |
| 1.7 | Add `narration_ar.json` entries for abassi_0–27 | ✅ | 3.5.0 | Keys renamed to abassi1_0–abassi4_9 |
| 1.8 | Run `python tools/check_voc.py` — fix mismatches | ⏳ | — | Must pass clean |
| 1.9 | Add GeoJSON features to `timeline_data.geojson` | ✅ | 3.5.0 | 21 locations, event_id `abassiN_M` |
| 1.10 | `node --check data.js` | ✅ | 3.5.0 | Syntax validation |
| 1.11 | Validate GeoJSON: `node -e "JSON.parse(...)"` | ✅ | 3.5.0 | Syntax validation |

---

## Phase 2 — UI (`index.html`, `app.js`, `style.css`)

**Weight:** 35% of total effort

| # | Task | Status | Date | Notes |
|---|------|--------|------|-------|
| 2.1 | Add 4 `#home-abassi1..4` cards in `index.html` home screen | ✅ | 3.5.0 | Replaced single `#home-abassi` card |
| 2.2 | Add inline SVG `<svg id="svg-abassi">` (1000×560 viewBox) | ✅ | 3.5.0 | After svg-umawi |
| 2.3 | Draw SVG city nodes with `data-ar`/`data-en` (19 cities) | ✅ | 3.5.0 | Baghdad central at 470,280 |
| 2.4 | Draw Tigris & Euphrates rivers in SVG | ✅ | 3.5.0 | Geographical spine |
| 2.5 | Draw expansion/trade routes (Khurasan → Baghdad → Byzantium) | ✅ | 3.5.0 | Dotted lines with markers |
| 2.6 | Add decorative Abbasid motifs (Kufic borders, Samarra stucco) | ✅ | 3.5.0 | See §8 of design doc |
| 2.7 | Add `focus-abassi` layer (pulse + star-wake) to SVG | ✅ | 3.5.0 | Same pattern as other SVGs |
| 2.8 | `MAP_VB` in `app.js`: add `abassi1..4` (4 entries) | ✅ | 3.5.0 | All share [1000, 560] |
| 2.9 | `allSvgs` in `switchEv()`: `key.startsWith('abassi')` → `svg-abassi` | ✅ | 3.5.0 | Single shared SVG |
| 2.10 | Click handlers in `init()`: `#home-abassi1..4` wired via forEach | ✅ | 3.5.0 | Dynamic `goToAbassiN()` functions |
| 2.11 | `goToHome()` back handler: `EVT.startsWith('abassi')` | ✅ | 3.5.0 | Same pattern as `umawi` |
| 2.12 | Add `.amb-golden` CSS class in `style.css` | ✅ | 3.5.0 | Radiant gold gradient |
| 2.13 | Add `.amb-sack` CSS class in `style.css` | ✅ | 3.5.0 | Dark fiery crimson gradient |
| 2.14 | Phase 1 golden ribbon styles in `style.css` | ✅ | 3.5.0 | Gold bar/badge |
| 2.15 | `data-ar`/`data-en` regex sweep | ✅ | 3.5.0 | Balanced |

---

## Phase 3 — Audio (narration MP3s + manifest)

**Weight:** 15% of total effort

| # | Task | Status | Date | Notes |
|---|------|--------|------|-------|
| 3.1 | Rename audio files abassi_* → abassi1..4_* (280 clips) | ✅ | 3.5.0 | 5 voice slots × 2 langs × 28 steps |
| 3.2 | Verify `audio/*/abassi{1..4}_*_*.mp3` exist (280 files) | ✅ | 3.5.0 | All present post-rename |
| 3.3 | Regenerate `audio/manifest.json` with new era keys | ✅ | 3.5.0 | `--manifest-only` after rename |
| 3.4 | Sample-check Phase 1 clip (e.g. classic/abassi1_3_ar.mp3) | ⏳ | — | Ensure Harun al-Rashid pronunciation correct |
| 3.5 | Sample-check Phase 4 clip (e.g. classic/abassi4_8_ar.mp3) | ⏳ | — | Ensure correct pronunciation of Mongol names |

---

## Phase 4 — Verification (browser testing)

**Weight:** 15% of total effort

| # | Task | Status | Date | Notes |
|---|------|--------|------|-------|
| 4.1 | Open `index.html` in browser | 🔴 | — | — |
| 4.2 | Navigate to Abbasid from home screen | 🔴 | — | Test card + click handler |
| 4.3 | Walk all 28 steps sequentially | 🔴 | — | No console errors |
| 4.4 | Test AR ↔ EN language toggle at step 0, step 3, and step 25 | 🔴 | — | Verify phase labels |
| 4.5 | Test map focus: each step's pulse at correct coordinates | 🔴 | — | 1000×560 coordinate check |
| 4.6 | Test Phase 1: verify `amb-golden` radiant gradient on steps 3–4, 6–8 | 🔴 | — | Map glow + gold ribbon/badge |
| 4.7 | Test Phase 4: verify `amb-sack` fiery gradient on steps 25–26 | 🔴 | — | Dark crimson map overlay |
| 4.8 | Test 5 voice slots (classic, gentle, story, warm, shakir) | 🔴 | — | All play correct abassi clips |
| 4.9 | Test verse recitation on 3 random steps | 🔴 | — | everyayah.com resolves |
| 4.10 | Test mobile viewports: 360px, 720px | 🔴 | — | Home screen scroll, map height, font scale |
| 4.11 | Test back nav: Abbasid → home → Seerah → back → Imams → back | 🔴 | — | MODE state graph complete |
| 4.12 | `node --check app.js` | 🔴 | — | Syntax validation |
| 4.13 | Check home screen overflow with 6 cards | 🔴 | — | May need layout adjustment |

---

## Phase 5 — Release (commit + deploy)

**Weight:** 10% of total effort

| # | Task | Status | Date | Notes |
|---|------|--------|------|-------|
| 5.1 | Update `CHANGELOG.md` | 🔴 | — | feat: add Abbasid Caliphate era (28 steps) |
| 5.2 | Bump `package.json` to v3.3.0 | 🔴 | — | Minor version bump |
| 5.3 | Update cache-bust query params in `index.html` | 🔴 | — | `?v=3.3.0` on all CSS/JS links |
| 5.4 | Update `AGENTS.md` / `CLAUDE.md` | 🔴 | — | Add abassi to era table, step count |
| 5.5 | `git add -A && git commit -m "feat: add Abbasid Caliphate module"` | 🔴 | — | Conventional commit |
| 5.6 | `git push origin main` | 🔴 | — | Deploy to GitHub Pages |

---

## Quick Reference

| Phase | Files Changed | Key Lines |
|-------|--------------|-----------|
| Data | `data.js`, `tools/narration_ar.json`, `timeline_data.geojson` | After `umawi` closure |
| UI | `index.html`, `app.js`, `style.css` | `MAP_VB:62`, `allSvgs:~562`, click:~1103, back handler |
| Audio | `audio/*/abassi_*_*.mp3`, `audio/manifest.json` | Auto-generated |
| Verify | — | Browser + `node --check` |
| Release | `package.json`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`, `index.html` | v3.3.0 |

### Legend

| Icon | Meaning |
|------|---------|
| 🔴 | Not started |
| 🟡 | In progress |
| 🟢 | Completed |
| ⚪ | Blocked |
| ✅ | Verified |
