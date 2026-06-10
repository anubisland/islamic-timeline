# Data Schema

This document describes the structure of every data file in the project. Keep it in sync when you add new fields.

> For how the data is *consumed*, see [`ARCHITECTURE.md`](ARCHITECTURE.md).
> For the sources behind the data, see [`SOURCES.md`](SOURCES.md).

## 1. `data.js` — `window.SEERAH_DB`

A single global object with ten top-level keys (one per era): `preb`, `meccan`, `hijra`, `badr`, `medinan`, `abubakr`, `umar`, `uthman`, `ali`, `hasan`. Each is an *event* with the following shape:

```ts
type Event = {
  labelAr:    string;   // event display name (Arabic)
  labelEn:    string;   // event display name (English)
  mapLabelAr: string;   // map topbar text (Arabic)
  mapLabelEn: string;   // map topbar text (English)
  offsets:    number[]; // SVG route-drawing progress per step
                        //   (Hijra only — empty array for Badr)
  steps:      Step[];   // ordered list of chronological stages
}
```

### Step

```ts
type Step = {
  // Quranic verse + reference (bilingual)
  ayah:        string;   // Arabic verse in ﴿ ﴾
  ayahRef:     string;   // Arabic Surah ref, e.g. 'سورة التوبة — الآية ٤٠'
  ayahEn:      string;   // English translation
  ayahRefEn:   string;   // English Surah ref, e.g. 'Surah At-Tawbah — 9:40'

  // Date
  dateAr:      string;   // Arabic Hijri date
  dateEn:      string;   // English Hijri date

  // Title and description
  titleAr:     string;   // Arabic title
  titleEn:     string;   // English title
  descAr:      string;   // Arabic long-form narrative
  descEn:      string;   // English long-form narrative

  // Map card overlay
  mtAr:        string;   // Arabic map card title
  mtEn:        string;   // English map card title
  mdAr:        string;   // Arabic map card description
  mdEn:        string;   // English map card description

  // Time and distance badges
  amb:         'day' | 'dawn' | 'noon' | 'night' | 'winter'
             | 'golden' | 'sack' | 'reform';
             // map ambient gradient. EVERY value used here must have a matching
             // .amb-<value> rule in style.css — an undefined class renders as a
             // fully transparent overlay (the ambience silently vanishes).
             // golden = Abbasid golden age; sack = fall of Baghdad; reform =
             // Umar II's reforms. Prefer 'day' over omitting the field.
  timeAr:      string;   // Arabic time-of-day badge (e.g. '🌙 ليلاً')
  timeEn:      string;   // English time-of-day badge
  distAr:      string;   // Arabic distance badge
  distEn:      string;   // English distance badge

  // Characters
  charsAr:     Char[];   // Arabic characters
  charsEn:     Char[];   // English characters

  // Lesson
  lessonAr:    string;   // Arabic leadership insight
  lessonEn:    string;   // English leadership insight

  // Sources
  srcs:        string[]; // list of source citations (Arabic)
}
```

### Char

```ts
type Char = {
  i: string;  // emoji icon, e.g. '🛡️'
  n: string;  // display name
  r: string;  // role / one-line description
}
```

### Example

```js
{
  ayah: "﴿ إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا ﴾",
  ayahRef: "سورة التوبة — الآية ٤٠",
  ayahEn: "\"Do not grieve; indeed Allah is with us\"",
  ayahRefEn: "Surah At-Tawbah — 9:40",
  dateAr: "٢٧ صفر سنة ١٤ من البعثة",
  dateEn: "27 Safar, Year 14 of the Prophethood",
  titleAr: "ليلة الخروج والتمويه العسكري الذكي",
  titleEn: "The Night of Departure — A Masterful Deception",
  // ... (see app.js or data.js for the full record)
  charsAr: [
    { i: "🛡️", n: "علي بن أبي طالب رضي الله عنه", r: "نام في الفراش تضحيةً" },
    // ...
  ],
  charsEn: [
    { i: "🛡️", n: "Ali ibn Abi Talib (RA)", r: "Slept in the Prophet's bed as a decoy" },
    // ...
  ],
  srcs: ["البخاري (٣٩٠٥)", "مسلم (٢٣٨١)", "ابن هشام (٢/٩٩)"]
}
```

### `offsets[]` semantics (Hijra only)

`offsets[i]` is the value assigned to `stroke-dashoffset` on the `h-route-anim` SVG path when the user is on step `i`.

- A value of `1400` (or anything ≥ path length) → the path is fully hidden.
- A value of `0` → the path is fully drawn.
- Interpolated values give a "drawing" animation between steps.

The path length is ~1400 SVG user units, so the array in `data.js` uses values from `1400` (start) to `0` (end), decreasing per step:

```js
hijra: {
  offsets: [1400, 1150, 820, 500, 220, 0]
}
```

## 2. `timeline_data.geojson`

A standard GeoJSON `FeatureCollection`. Each `Feature` is a point representing one historical location.

```ts
type Feature = {
  type: 'Feature',
  properties: {
    id:              string;   // unique slug, e.g. 'cave_thawr'
    event_id:        string;   // link to a step, e.g. 'hijra_1'
    name_ar:         string;   // Arabic location name
    name_en:         string;   // English location name
    year_ah:         string;   // Hijri year or stage
    event_title_ar:  string;   // Arabic event-title snippet
    event_title_en:  string;   // English event-title snippet
  },
  geometry: {
    type: 'Point',
    coordinates: [number, number]  // [longitude, latitude] in WGS84
  }
}
```

### Field reference

| Field | Description |
|---|---|
| `id` | Stable, unique across the file. Use snake_case. |
| `event_id` | Must match a step in `data.js` — format: `<eventKey>_<stepIndex>`, e.g. `hijra_0`, `badr_2`. |
| `name_ar` / `name_en` | Display name for the location. |
| `year_ah` | Hijri year or a stage label (e.g. `'نقطة الانطلاق'` for a starting point). |
| `event_title_ar` / `event_title_en` | One-line event title; appears in map tooltips. |
| `coordinates` | `[lng, lat]` (note: longitude first, per the GeoJSON spec). |

### Loading

The current app does not load `timeline_data.geojson` at runtime — it is provided for downstream consumers (Leaflet, MapLibre, QGIS, Google Earth, etc.). If you want to render it as a base map, the standard loader is:

```js
fetch('timeline_data.geojson').then(r => r.json()).then(geo => {
  L.geoJSON(geo, {
    pointToLayer: (f, latlng) => L.marker(latlng).bindPopup(f.properties.name_en)
  }).addTo(map);
});
```

## 3. `index.html` data attributes

User-facing strings inside the static chrome use paired attributes:

```html
<button data-ar="🧭 رحلة الهجرة"
        data-en="🧭 The Hijra">🧭 رحلة الهجرة</button>
```

`applyLanguage()` in `app.js` then swaps `textContent` on every element that has both attributes.

Conventions:
- `data-ar` is always present, even for purely-numeric content like step counters.
- `data-en` must contain an idiomatic English equivalent — not a transliteration.
- For numbers, Arabic-Indic digits (`٠١٢٣`) live in `data-ar`, ASCII digits in `data-en`.
- The element's `textContent` is the *initial* value (Arabic by default) and is overwritten on first `applyLanguage()` call.

## 4. Versioning the data

When you add a step:
1. Append it to the relevant event's `steps[]` in `data.js`.
2. If it changes the route drawing, update `offsets[]` to a new value at that index.
3. Add a matching `Feature` to `timeline_data.geojson` with `event_id = '<eventKey>_<newIndex>'`.
4. Bump the version in `package.json` (follow semver).
5. Add an entry to `CHANGELOG.md`.

When you change a field:
- Add it to all existing steps (or document the optionality).
- Update this document.
- Update the `Step` type in `ARCHITECTURE.md` if you maintain it there.

When you remove a step:
- Keep the data; mark it as deprecated in `CHANGELOG.md` rather than deleting.
- This preserves the meaning of any deep links (`?event=…&step=…`) that may exist externally.
