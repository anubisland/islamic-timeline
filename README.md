# Madani Era Timeline (الخط الزمني للعهد المدني)

A bilingual (Arabic / English) **static website** that visualizes the key events of the **Madani Era** in Islamic history, presented with an emerald and gold Islamic visual identity.

> Pure HTML / CSS / vanilla JavaScript. **No build step.** Open `index.html` in a browser, or serve the folder with any static server.

## Features

- Emerald royal palette (`#063529`) with gold accents (`#C5A059`)
- Islamic eight-pointed star ornament in the corners
- Bilingual UI: Arabic (RTL) / English (LTR) toggle, with `localStorage` persistence
- Event card with Quranic verse reference
- GeoJSON dataset of historical landmarks ready for map integration
- Responsive layout (mobile → desktop)

## Project Structure

```
Sera/
├── index.html              # Web entry point
├── style.css               # All styling
├── app.js                  # Language toggle (vanilla JS)
├── timeline_data.geojson   # Geographic dataset of historical events
├── package.json            # Optional, only for `npm start` (uses npx serve)
├── .gitignore
└── README.md
```

## Getting Started

### Option 1 — Open directly
Double-click `index.html`. The site works fully from the `file://` protocol.

### Option 2 — Local static server (recommended)
```bash
npm start
# or
npx serve .
```
Then open the printed URL (usually http://localhost:3000).

> A static server is only needed if you later want to `fetch('timeline_data.geojson')` from JavaScript.

## Data Schema

`timeline_data.geojson` follows the GeoJSON FeatureCollection spec. Each feature has:

| Field            | Description                            |
|------------------|----------------------------------------|
| `id`             | Unique identifier (snake_case)         |
| `name_ar`        | Arabic name                            |
| `name_en`        | English name                           |
| `year_ah`        | Hijri year                             |
| `description_ar` | Arabic description                     |
| `description_en` | English description                    |
| `coordinates`    | `[longitude, latitude]`                |

## Roadmap

- [ ] Add Leaflet map to plot `timeline_data.geojson`
- [ ] Expand chronological dataset (Hijri 1 AH → 11 AH)
- [ ] Add a scrollable timeline rail with year markers
- [ ] Add deep links / URL params for language: `?lang=en`
