# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-06-06

### Added
- Full **bilingual UI** (Arabic RTL / English LTR) with `localStorage` persistence.
- **9 chronological events** across two eras: the Hijra (6 stages) and the Battle of Badr (3 stages).
- **Two interactive SVG maps**:
  - Hijra route (Makkah → Cave of Thawr → Coastal route → Qudayd → Suraqah's chase → Madinah) with animated route drawing.
  - Badr tactical map with well-blocking, cistern and battle-clash overlays that unlock per step.
- **Google TTS** verse recitation with `speechSynthesis` fallback.
- **GeoJSON dataset** (`timeline_data.geojson`) covering all 9 event locations.
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
