# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — 2026-06-06

### Added
- **Meccan Era** (`meccan`) — 16 new stages covering Birth → Nursing in Bani Sa'd → Childhood → First revelation at Cave Hira → Public call → Dar al-Arqam → First Abyssinian migration → Second Abyssinian migration → Year of Sorrow → Boycott of Banu Hashim → Isra & Mi'raj → Boycott lifted → Hilf al-Fudul → Ta'if → Second pledge of Aqabah → the eve of the Hijra.
- **Medinan Era** (`medinan`) — 11 new stages: Building the Prophet's Mosque & founding the state → Al-Baqi' market → Change of Qiblah → Badr → Uhud → Khandaq (Battle of the Trench) → Hudaybiyyah treaty → Royal correspondence → Conquest of Makkah → Farewell Hajj → Death of the Prophet ﷺ and transfer of leadership.
- **Two new interactive SVG maps**:
  - Meccan map: Makkah center, Jabal Noor (Cave Hira), Bani Sa'd desert, Cave Thawr, Ta'if, plus directional arrows to Syria (trade) and Abyssinia (migration).
  - Medinan map: Madinah capital center, Badr SW, Mount Uhud N, Khandaq trench N, Hudaybiyyah W, Makkah S, Arafat SE — with campaign-arrows to each battle site.
- **Mobile-friendly UI**:
  - Event-switch wraps into a 2×2 grid on screens ≤ 720px (4 buttons total).
  - All interactive buttons enforce a 44px minimum touch target.
  - Map SVG capped at 50vh on small screens with auto-scaling.
  - Ayah box, lesson box, and map card paddings reduced for narrow viewports.
- **GeoJSON expansion** from 9 → 24 features covering all 36 stages.
- `data.js` header comment updated to reflect the new totals: `Meccan (16) + Hijra (6) + Badr (3) + Medinan (11) = 36 stages`.

### Changed
- Event switcher now hosts **four** buttons: 🕋 Meccan Era · 🧭 The Hijra · ⚔️ Battle of Badr · 🏛️ Medinan Era.
- `switchEv()` in `app.js` extended to toggle `svg-meccan` and `svg-medinan` alongside the existing two.
- `.event-switch` style now allows flex-wrap and a less aggressive border-radius to accommodate the extra buttons.
- README feature list and project description updated to mention all four eras and 36 stages.

### Technical
- No new runtime dependencies. Pure static site.
- All new Arabic content is parallel-English; every `data-ar` has a `data-en` pair (verified by review).
- `data.js` re-validated with Node: parses as valid JavaScript, exports `window.SEERAH_DB` with 4 keys totaling 36 steps.

---

## [2.0.0] — 2026-06-06

### Added
- Full **bilingual UI** (Arabic RTL / English LTR) with `localStorage` persistence.
- **9 chronological events** across two eras: the Hijra (6 stages) and the Battle of Badr (3 stages).
- **Two interactive SVG maps**:
  - Hijra route (Makkah → Cave of Thawr → Coastal route → Qudayd → Suraqah's chase → Madinah) with animated route drawing.
  - Badr tactical map with well-blocking, cistern and battle-clash overlays that unlock per step.
- **Google TTS** verse recitation with `speechSynthesis` fallback.
- **Keyboard shortcuts**: arrow keys (auto-flipped for RTL), `Space` to play, `L` to toggle language.
- **Documentation**: `docs/ARCHITECTURE.md`, `docs/DATA_SCHEMA.md`, `docs/SOURCES.md`.
- **Standard open-source files**: `LICENSE` (MIT), `CONTRIBUTING.md`, `.editorconfig`.

### Changed
- Rebuilt from a single-card mockup into a full single-page app with two-panel layout (map + story).
- Adopted emerald (`#063529`) + gold (`#C5A059`) design system across HTML, CSS and SVG.
- README restructured with badges, table of contents, and links to docs/.

### Technical
- Pure HTML / CSS / vanilla JavaScript. **No build step, no framework, no npm runtime dependency.**
- Single in-memory state object: `{ EVT, STEP, LANG }`.
- All map labels and UI strings carry `data-ar` / `data-en` attributes for O(1) language swap.

---

## [1.0.0] — 2026-06-06

### Added
- Initial bilingual static site.
- Single event card example (Building of Al-Masjid an-Nabawi) as a placeholder.
- Basic AR/EN toggle persisted in `localStorage`.
- GitHub Pages deployment on the `main` branch.

### Notes
- Based on the original Gemini export that was refined and converted from React Native to plain HTML/CSS/JS.
- Project skeleton: `index.html`, `style.css`, `app.js`, `package.json`, `timeline_data.geojson`.

[2.0.0]: #200--2026-06-06
[1.0.0]: #100--2026-06-06
