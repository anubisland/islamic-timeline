# Contributing

Thank you for your interest in this project. All forms of contribution are welcome — from fixing a typo in a description to adding new historical events or improving the maps.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Issues](#reporting-issues)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
- [Adding a New Event](#adding-a-new-event)
- [Adding a New Language](#adding-a-new-language)
- [Commit Messages](#commit-messages)

---

## Code of Conduct

This project documents the life of the Prophet Muhammad ﷺ and the early Muslim community. Please keep all contributions **respectful, accurate, and in line with mainstream Sunni scholarship** (Ahl al-Sunnah wa al-Jama'ah). Differences of opinion are welcome in matters of fiqh; matters of `aqidah`, `manhaj`, and historical narration should follow the classical Seerah and Hadith sources listed in [`docs/SOURCES.md`](docs/SOURCES.md).

## Reporting Issues

Use the GitHub Issues tab. For each report please include:
- A clear, descriptive title.
- Steps to reproduce (if it's a bug).
- Expected vs. actual behaviour.
- Browser / OS / screen size.
- Screenshots or screen recordings when relevant.

## Suggesting Enhancements

Open an issue with the `enhancement` label. Describe:
- The problem the change would solve.
- Your proposed solution.
- Any alternatives you considered.
- Whether you're willing to implement it yourself.

## Pull Requests

1. **Fork** the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make focused commits** — one logical change per commit.
3. **Test locally** — open `index.html` in at least two browsers, or run `npm start` and use the QR code with Expo Go / a phone browser.
4. **Verify keyboard shortcuts** still work in both AR and EN.
5. **Update documentation** — if your change affects public API or structure, update the relevant file under `docs/`.
6. **Reference any issue** with `Closes #123` in the PR description.
7. Ensure the PR is **squash-merged** into `main` (one commit per change).

## Style Guides

### JavaScript (`app.js`)
- ES2020+ syntax; IIFE wrapper is fine.
- 2-space indentation, single quotes, semicolons.
- `const` / `let` only — no `var`.
- Helper functions at the top, then state, then render, then init.
- Comments are sparse and explain *why*, not *what*.

### CSS (`style.css`)
- 2-space indentation.
- All design tokens declared as CSS custom properties at `:root`.
- Mobile-first media queries (`@media (max-width: ...)`).
- Avoid `!important`; if needed, isolate with a comment.

### HTML (`index.html`)
- 2-space indentation, lowercase tags.
- Every user-facing string must carry `data-ar` and `data-en` attributes (or live in `data.js`).
- `lang` and `dir` attributes on `<html>` must be kept in sync with state.

### Data (`data.js`)
- All step fields are bilingual (`*Ar` / `*En`).
- Each step includes: verse + ref (both langs), title, description, date, time, distance, characters (array of `{i, n, r}`), lesson, ambient (`night`/`dawn`/`day`), sources.
- Sources are listed in their original Arabic (Bukhari, Muslim, …) and are not translated — the user should look them up in their original form.

### Markdown
- Wrap lines at ~100 characters.
- Use ATX-style headings (`#`).
- Code blocks always specify a language (e.g. ` ```js `).

## Adding a New Event

Suppose you want to add a new stage to the Hijra (or create a new event like the Battle of Uhud).

### 1. Add data to `data.js`
Pick a key (e.g. `uhud`) and follow the existing shape:
```js
uhud: {
  labelAr: '...',
  labelEn: '...',
  mapLabelAr: '...',
  mapLabelEn: '...',
  offsets: [],  // empty if no animated route
  steps: [
    {
      ayah, ayahRef, ayahEn, ayahRefEn,
      dateAr, dateEn,
      titleAr, titleEn,
      mtAr, mtEn, mdAr, mdEn,
      amb: 'day' | 'dawn' | 'night',
      timeAr, timeEn, distAr, distEn,
      descAr, descEn,
      charsAr: [{i, n, r}, ...],
      charsEn: [{i, n, r}, ...],
      lessonAr, lessonEn,
      srcs: ['البخاري (...)', ...]
    }
  ]
}
```

### 2. Add a switcher button to `index.html`
```html
<button class="ev-btn" data-ev="uhud" data-ar="⚔️ غزوة أحد" data-en="⚔️ Battle of Uhud">⚔️ غزوة أحد</button>
```

### 3. Add an SVG map (or reuse a pattern)
Place the SVG inside `<main class="wrap">` and give it `id="svg-uhud"`. Default to `class="map-svg hidden"`. Update `app.js` to toggle it in `switchEv()`.

### 4. Add a `GeoJSON` feature
Append a `Feature` to `timeline_data.geojson` with `event_id` matching the step (e.g. `uhud_0`). Use real geographic coordinates.

### 5. Generate narration audio + check verse recitation 🔊
Audio is **pre-recorded only** (there is no live TTS). After adding/editing any narration text:
```bash
pip install edge-tts          # one-time
python tools/gen_tts.py --eras uhud --force
```
This writes `audio/<slot>/uhud_<step>_<lang>.mp3` for all 4 voice slots × both languages and refreshes `audio/manifest.json`. **Commit the new `audio/**` files in the same PR.**

Also make each step's `ayahRefEn` a parseable Quran citation — `"Surah X (10), verse 1"` / `"verses 1-3"` **or** `"Surah X — 10:1"` — so verse mode can stream the reciter audio from everyayah.com. Confirm the ayah resolves before committing.

### 6. Update `CHANGELOG.md`
Add a line under the `Unreleased` / next-version section.

## Adding a New Language

The project uses a strict `data-ar` / `data-en` attribute pair pattern, so adding a third language (e.g. Urdu) is straightforward:

1. Add `data-ur` next to every `data-ar` / `data-en` in `index.html`.
2. Extend the `data.js` step fields with `*Ur` (e.g. `titleUr`, `descUr`).
3. Add a `Ur` branch to the `t()` helper in `app.js` and to `applyLanguage()`.
4. Add a translation mapping in the language toggle button.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Battle of Uhud event with 4 steps
fix: correct offset for Cave of Thawr node
docs: clarify Google TTS limitations in README
style: reformat app.js with 2-space indent
refactor: extract renderStory() from render()
chore: bump version to 2.1.0
```

Use the imperative mood ("add" not "added"), keep the subject line ≤ 72 chars, and add a body if the change is non-obvious.

---

جزاكم الله خيراً على مساهمتكم
