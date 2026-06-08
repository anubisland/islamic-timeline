# Merge Plan: Sera + Four Imams

> This document tracks all tasks needed to merge the `Four_Imams` project into the `Sera` project as a unified homepage with two content modules.

---

## Phase 0: Current State Analysis

### Sera Project (current)
- **10 eras / 72 stages**: Pre-Prophethood (11), Meccan (16), Hijra (6), Badr (3), Medinan (11), Abu Bakr (5), Umar (5), Uthman (5), Ali (5), Hasan (5)
- **Stack**: Vanilla HTML/CSS/JS, no build tools, works from `file://`
- **Navigation**: Splash → Event switcher (click era) → Step-by-step (prev/next buttons)
- **Bilingual**: `data-ar`/`data-en` attribute pairs on every UI element
- **Maps**: Inline SVG with focus pan/zoom, `data-ar`/`data-en` on text elements
- **Audio**: Pre-recorded neural MP3s (`audio/<slot>/<era>_<step>_<lang>.mp3`) + verse recitation streamed from everyayah.com
- **Data**: `window.SEERAH_DB = { eraKey: { labelAr, labelEn, steps: [...] } }` in `data.js`

### Four Imams Project (current)
- **4 imams / 20 phases**: Abu Hanifa (5), Malik (5), Al-Shafi'i (5), Ahmad ibn Hanbal (5)
- **Stack**: Vanilla HTML/CSS/JS + Leaflet CDN (not actually used — maps are inline SVG-dynamic)
- **Navigation**: Home → Imam card click → 5-phase accordion timeline
- **Bilingual**: `L(ar, en)` wrapper objects accessed by `tt(obj)` helper
- **Maps**: Dynamic SVG rendered in JS with city coordinate system
- **Audio**: None
- **Data**: `const IMAMS = [...]` in `js/data.js` each with `phases[]`

---

## Phase 1: Homepage — Abstract Launcher

### Design
Create a new first-screen splash with two large tiled options:

```
┌─────────────────────────────────┐
│          ✦ الأئمة ✦            │
│    (The Imams — Main Menu)      │
├────────────────┬────────────────┤
│                │                │
│   السيرة       │   الأئمة       │
│   والخلافة     │   الأربعة      │
│                │                │
│  سيرة النبي ﷺ  │  أبو حنيفة     │
│  والخلفاء      │  مالك          │
│  الراشدون      │  الشافعي       │
│                │  أحمد          │
│  47+ مرحلة     │  20 مرحلة      │
│                │                │
├────────────────┴────────────────┤
│             الخيارات            │
└─────────────────────────────────┘
```

- Each card shows a brief description and count of stages
- Clicking either card enters that module's sub-splash
- Back button on sub-splash returns to this master menu
- Uses the same emerald + gold design system

### Tasks
- [x] **H-1.1**: Modify `index.html` to add a new primary splash (or modify existing splash to be the abstract menu)
- [x] **H-1.2**: Add CSS for the two-card layout with ornamental decorations
- [x] **H-1.3**: Add bilingual `data-ar`/`data-en` labels to everything
- [x] **H-1.4**: Modify `app.js` to add a new top-level state (`MODE: 'home' | 'sera' | 'imams'`) and routing logic
- [x] **H-1.5**: Back navigation from either module to home
- [x] **H-1.6**: Responsive: cards stack vertically on mobile ≤720px
- **Merged to `main`** in commit `4258fdc` — v2.10.0

---

## Phase 2: Four Imams Module — Data Integration

### Data Schema Conversion
Convert `Four_Imams/js/data.js` structure to match Sera's `window.SEERAH_DB` pattern so both modules use a uniform data access layer.

| Current (Four_Imams) | Target (Sera-style) |
|---|---|
| `const IMAMS = [...]` | `window.FOUR_IMAMS_DB = { ... }` |
| `phases[]` → `id, title, dateAH, dateCE, description, details, location, figures, lessons` | `steps[]` → same fields, renamed to match Sera conventions |
| `L(ar, en)` objects | Convert to `fieldAr` / `fieldEn` parallel strings |

**Important**: Keep all bilingual content — every field has Arabic and English.

### Tasks
- [ ] **D-2.1**: Create `data_imams.js` with the Four Imams data in Sera's parallel-field format (`titleAr`/`titleEn`, etc.)
- [ ] **D-2.2**: Add step fields: `ayah`, `ayahRef`, `ayahEn`, `ayahRefEn` (set to `""` for steps without a Quranic verse)
- [ ] **D-2.3**: Add `amb`, `timeAr`, `timeEn`, `distAr`, `distEn` fields to each step
- [ ] **D-2.4**: Add `mapFocus` coordinates for each phase (SVG focus pan)
- [ ] **D-2.5**: Add `srcs[]` (sources) array to each step
- [ ] **D-2.6**: Load `data_imams.js` before `app.js` in `index.html`

---

## Phase 3: Four Imams Module — UI Implementation

### Navigation Model
Each imam = an "era" in Sera terminology. Each imam has 5 phases = "steps".

```
[Home] → [Imam Selection Splash]
         ├── أبو حنيفة (5 phases)
         ├── مالك (5 phases)
         ├── الشافعي (5 phases)
         └── أحمد بن حنبل (5 phases)
```

- **Imam Selection Splash**: Shows 4 imam cards (like Sera's era switcher but larger format)
- **Within an Imam**: Same step-by-step navigation (prev/next) as Sera
- **Step display**: Shows title, dates, description, details, location map, figures, lessons, sources

### UI Elements to Build
- [ ] **UI-3.1**: Imam selection splash with 4 imam cards
- [ ] **UI-3.2**: Event switcher bar (4 imams instead of 10 eras)
- [ ] **UI-3.3**: Step content box (reuse Sera's `.tl-step` pattern or create `.step-imam`)
- [ ] **UI-3.4**: SVG map for each phase with city markers and zoom
- [ ] **UI-3.5**: Figures section (charsAr/charsEn) per step
- [ ] **UI-3.6**: Lessons section per step
- [ ] **UI-3.7**: Sources (srcs) display per step
- [ ] **UI-3.8**: Nav buttons (prev/next step + progress indicator)
- [ ] **UI-3.9**: Maps for each imam's phases (SVG with city dots, active location glow)
- [ ] **UI-3.10**: Timeline strip (dots at bottom tracking progress within the imam)

### SVG Map System
The Four_Imams repo already has a dynamic SVG city map system with coordinates for Kufa, Baghdad, Basra, Makkah, Madinah, Damascus, Fustat, etc. This needs to be:
- [ ] **M-3.11**: Converted to inline SVG (one per imam or one global) with `data-ar`/`data-en` on text
- [ ] **M-3.12**: Integrated into Sera's existing map zoom/pan system
- [ ] **M-3.13**: All city labels bilingual

---

## Phase 4: Audio System — Four Imams

### Narration
- [ ] **A-4.1**: Add `descAr`/`descEn` narration text to each step (already exists as `description` + `details`)
- [ ] **A-4.2**: Run `python tools/gen_tts.py` to generate MP3s for all 4 voices × 20 steps × 2 languages
- [ ] **A-4.3**: Update `audio/manifest.json` with new clips

### Verse Recitation
- [ ] **A-4.4**: Identify a relevant Quranic ayah for each phase (asbāb al-nuzul approach)
- [ ] **A-4.5**: Add `ayahRefEn` in parseable format for every step (use `""` where no matching ayah exists)
- [ ] **A-4.6**: Verify each ayah resolves on everyayah.com

---

## Phase 5: CSS and Design System

- [ ] **C-5.1**: Add imam-specific accent colors (Abu Hanifa: gold, Malik: green, Al-Shafi'i: burgundy, Ahmad: deep purple)
- [ ] **C-5.2**: Ensure all new UI elements follow the responsive mobile checklist
- [ ] **C-5.3**: `data-ar`/`data-en` regex sweep on all modified HTML
- [ ] **C-5.4**: Verify RTL/LTR switching works for all new content
- [ ] **C-5.5**: Test at breakpoints: 360px, 600px, 900px, 1200px

---

## Phase 6: Review Cycles — Content Accuracy

### Source Documents
The 5 DOCX files in `C:\Users\melwa\OneDrive\Documents\الائمة الاربعة\` contain the source material:
1. `الترتيب الزمنى للائمة الاربعة.docx` — chronological comparison table
2. `الإمام_أبوحنيفة.docx` — Abu Hanifa lecture
3. `الإمام_مالك.docx` — Malik lecture
4. `الإمام_الشافعي.docx` — Al-Shafi'i lecture
5. `الإمام_أحمد_بن_حنبل.docx` — Ahmad ibn Hanbal lecture

### Review Tasks
- [ ] **R-6.1**: Read each DOCX file and extract verified facts
- [ ] **R-6.2**: Cross-check every date (birth, death, phase boundaries) against sources
- [ ] **R-6.3**: Verify all location names and coordinates
- [ ] **R-6.4**: Verify figures listed for each phase match source material
- [ ] **R-6.5**: Verify lessons/extracted morals are consistent with lectures
- [ ] **R-6.6**: Add `srcs[]` referencing the appropriate lecture DOCX + known sources (Siyar A'lam al-Nubala', etc.)
- [ ] **R-6.7**: Ensure Ahl al-Sunnah sourcing rules are followed (rule #4 from AGENTS.md)

---

## Phase 7: Testing & Deployment

- [ ] **T-7.1**: `node --check app.js` and `node --check data_imams.js`
- [ ] **T-7.2**: Verify no broken links, missing assets, or console errors
- [ ] **T-7.3**: Test bilingual switching in both modules
- [ ] **T-7.4**: Test all 4 imams × 5 phases navigation
- [ ] **T-7.5**: Test audio playback for imam phases
- [ ] **T-7.6**: Test on mobile viewport sizes
- [ ] **T-7.7**: Update CHANGELOG.md and bump version in package.json
- [ ] **T-7.8**: Update AGENTS.md and CLAUDE.md with new file map and module info
- [ ] **T-7.9**: Push to main and verify on live GitHub Pages

---

## Effort Estimate (Rough)

| Phase | Tasks | Estimated Effort |
|-------|-------|-----------------|
| P1: Homepage | 6 tasks | ~2-3 hours |
| P2: Data Integration | 6 tasks | ~3-4 hours |
| P3: UI Implementation | 11 tasks | ~6-8 hours |
| P4: Audio System | 6 tasks | ~2-3 hours |
| P5: CSS & Design | 5 tasks | ~2 hours |
| P6: Review Cycle | 7 tasks | ~3-4 hours |
| P7: Testing & Deploy | 9 tasks | ~2 hours |
| **Total** | **50 tasks** | **~20-26 hours** |

---

## Decision Points

1. **Separate data file vs. same file**: Create `data_imams.js` as a separate file (keeps concerns separated, follows existing pattern)
2. **Separate SVG maps vs. unified**: Each imam gets one inline SVG map (like Sera's per-era maps) with city markers for all their phases
3. **Audio generation**: Same `tools/gen_tts.py` — needs no modification, just pointing at new era keys
4. **Homepage architecture**: Either split `index.html` into pages or keep it as one SPA with routing via `MODE` state
