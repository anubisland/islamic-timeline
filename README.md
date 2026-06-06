# Madani Era Timeline (الخط الزمني للعهد المدني)

A bilingual (Arabic / English) React Native application that visualizes the key events of the **Madani Era** in Islamic history, presented with an emerald and gold Islamic visual identity.

## Features

- Emerald royal palette (`#063529`) with gold accents (`#C5A059`)
- Islamic eight-pointed star ornament in the corners
- Bilingual UI: Arabic (RTL) / English (LTR) toggle
- Event cards with Quranic verse references
- GeoJSON dataset of historical landmarks ready for map integration

## Project Structure

```
Sera/
├── App.js                  # Main React Native entry point
├── timeline_data.geojson   # Geographic dataset of historical events
├── package.json            # Dependencies and scripts
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (installed automatically via `npx`)
- Expo Go app on your phone (iOS / Android) for quick testing

### Install & Run

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** to launch the app on your device.

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

- [ ] Integrate `react-native-maps` to plot `timeline_data.geojson`
- [ ] Add full chronological dataset (Hijri 1 AH → 11 AH)
- [ ] Persist language preference with `AsyncStorage`
- [ ] Use `I18nManager.forceRTL` for full layout mirroring
