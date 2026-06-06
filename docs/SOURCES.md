# Islamic Sources

Every claim in the app is anchored in classical, well-known Sunni sources. This document lists them in the form cited in the application, with brief context.

> How the sources are used in the data model: see [`DATA_SCHEMA.md`](DATA_SCHEMA.md) (`Step.srcs`).

## 1. Primary sources

### صحيح البخاري — *Sahih al-Bukhari*
- **Author:** Muhammad ibn Ismail al-Bukhari (194–256 AH / 810–870 CE)
- **Coverage:** The most authoritative hadith collection in Sunni Islam. Compiled ~16 years, vetted against the Quran and chains of transmission.
- **Use in the app:** The hijra narration, the Battle of Badr, supplications, and many other foundational reports.
- **Citation format:** `البخاري (hadith-number)`, e.g. `البخاري (٣٩٠٥)`.

### صحيح مسلم — *Sahih Muslim*
- **Author:** Muslim ibn al-Hajjaj al-Naysaburi (206–261 AH / 815–875 CE)
- **Coverage:** Companion volume to Bukhari; sometimes contains variants and additional chains.
- **Use in the app:** Cross-references and additional chains for the same events.
- **Citation format:** `مسلم (hadith-number)`, e.g. `مسلم (٢٣٨١)`.

### السيرة النبوية لابن هشام — *Al-Sirah al-Nabawiyyah*
- **Author:** Ibn Hisham (d. 218 AH / 833 CE), based on the earlier *Sirah* of Ibn Ishaq (d. 150 AH / 767 CE).
- **Coverage:** The canonical classical biography of the Prophet ﷺ. Provides the day-by-day narrative of the Hijra, the Badr campaign, and dozens of character sketches.
- **Use in the app:** Most of the historical detail and many of the named characters.
- **Citation format:** `ابن هشام (volume/page)`, e.g. `ابن هشام (٢/٩٩)`.

## 2. Modern and supplementary sources

### الرحيق المختوم — *Al-Rahiq Al-Makhtum* (The Sealed Nectar)
- **Author:** Safi-ur-Rahman al-Mubarakfuri (b. 1943)
- **Coverage:** A modern, comprehensive Seerah in Arabic, English, and many translations. Awarded first prize by the Muslim World League (1979) as the best biography of the Prophet ﷺ.
- **Use in the app:** Cross-references and source of some modern English-friendly phrasing.
- **Citation format:** `الرحيق المختوم ص<page>`, e.g. `الرحيق المختوم ص١٩٤`.

### زاد المعاد في هدي خير العباد — *Zad al-Maad*
- **Author:** Ibn al-Qayyim al-Jawziyyah (691–751 AH / 1292–1350 CE)
- **Coverage:** A 6-volume work covering the Prophet's biography **and** his guidance on fiqh, worship, ethics, and statecraft. Particularly strong on leadership analysis.
- **Use in the app:** Strategic and leadership analysis — e.g. the logistics of the Badr wells, the hijra as a covert operation.
- **Citation format:** `زاد المعاد (volume/page)`, e.g. `زاد المعاد (٣/٢٤)`.

### دلائل النبوة — *Dala'il al-Nubuwwah*
- **Author:** Abu Bakr al-Bayhaqi (384–458 AH / 994–1066 CE)
- **Coverage:** Compiles reports of miracles (*mu'jizat*), prophetic signs, and confirmations of his prophethood. A goldmine for events like the miracle of Umm Mabad's ewe.
- **Use in the app:** Reports of miracles and signs.
- **Citation format:** `دلائل النبوة للبيهقي (volume/page)`, e.g. `دلائل النبوة (٢/٥٢٩)`.

### المستدرك على الصحيحين — *Al-Mustadrak*
- **Author:** Al-Hakim al-Naysaburi (321–405 AH / 933–1014 CE)
- **Coverage:** Compiles hadith that meet the chains of Bukhari or Muslim but were not included in either. Includes many narrations on miracles and the Companions' virtues.
- **Use in the app:** The miracle of Umm Mabad and similar.
- **Citation format:** `المستدرك (volume/page)`, e.g. `المستدرك (٣/٩)`.

### الشفا بتعريف حقوق المصطفى — *Al-Shifa*
- **Author:** Qadi Iyad (476–544 AH / 1083–1149 CE)
- **Coverage:** A revered work on the Prophet's ﷺ character, rights, and attributes. Includes the famous physical description of Umm Mabad.
- **Use in the app:** Character descriptions and the famous *hilyah* (description of the Prophet ﷺ).
- **Citation format:** `الشفا للقاضي عياض` (no page numbers — section/chapter only).

## 3. How we cite

In the data file, each step's `srcs[]` array lists the references used for that step. Each entry is the **Arabic short-title followed by the locator in Arabic-Indic digits**:

```js
srcs: [
  "البخاري (٣٩٠٥)",
  "مسلم (٢٣٨١)",
  "ابن هشام (٢/٩٩)",
  "الرحيق المختوم ص١٩٤"
]
```

These are rendered as small "chip" badges in the story panel:

```
[ 📖 البخاري (٣٩٠٥) ]  [ 📖 مسلم (٢٣٨١) ]  [ 📖 ابن هشام (٢/٩٩) ]  [ 📖 الرحيق المختوم ص١٩٤ ]
```

We deliberately **do not** translate the source citations — scholars cite Bukhari and Muslim by those names in every language, and the Arabic form preserves the link to the printed editions.

## 4. Translation methodology

Where the app offers English text (`*En` fields), the goal is **clear, idiomatic scholarly English** — not a literal word-for-word rendering. We:

- Quote Quranic translations from widely-recognised translators (Pickthall, Sahih International, Yusuf Ali) and reference the translator in the field name (e.g. `ayahEn` carries a translation; the original transliteration is not preserved).
- Use present tense for ongoing historical narrative ("He devises a plan"), past tense for completed events.
- Prefer active voice for character descriptions and passives sparingly.
- Use Arabic names with the `ibn`/`bint` patronymic where helpful; common English renderings (e.g. "Abu Bakr" not "Abu Bakr ibn Abi Quhafa") are used as the primary form.

## 5. What is *not* a source

The following are **not** cited in the app and we explicitly avoid them:

- **Isra'iliyyat** (narrations from Jewish or Christian sources) — not used even where they are well-known.
- **Shi'a-only narrations** — not used; the audience is the mainstream Sunni community, and we cite sources they recognise.
- **Fabricated hadith** — every hadith reference is to a known, muttasil chain via Bukhari, Muslim, Ibn Hisham, or the recognised supplementary works.
- **Unverifiable modern claims** — e.g. specific casualty counts beyond what Bukhari/Muslim report.

If you find a claim in the app that you believe is weakly sourced, please open an issue. We would rather remove a point than keep a dubious one.

---

والله أعلم — And Allah knows best.
