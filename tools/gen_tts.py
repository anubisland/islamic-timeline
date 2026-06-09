#!/usr/bin/env python3
"""
gen_tts.py — Offline neural-TTS narration generator for the Madani Era Timeline.

Generates static MP3 narration for every step using Microsoft's free neural
voices (via edge-tts — NO API key, NO account). The MP3s are committed as
plain static assets so every visitor, on every browser, hears the same warm
storytelling voice — fully offline / file:// / GitHub Pages compatible.

This is a DEV TOOL. It is never loaded by the site at runtime. The only thing
shipped is the audio/ folder it produces.

Layout produced:
    audio/<slot>/<era>_<step>_<lang>.mp3
    e.g. audio/classic/hijra_0_ar.mp3

Usage:
    python tools/gen_tts.py                      # everything (all slots/eras/langs)
    python tools/gen_tts.py --eras hijra         # one era (pilot)
    python tools/gen_tts.py --slots classic gentle
    python tools/gen_tts.py --langs ar
    python tools/gen_tts.py --force              # regenerate even if file exists
    python tools/gen_tts.py --manifest-only      # just (re)write audio/manifest.json

Requires: edge-tts (pip install edge-tts), node (to read data.js).
"""

import argparse
import asyncio
import json
import os
import subprocess
import sys

# Windows consoles default to cp1252 and choke on non-Latin chars in print().
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:  # noqa: BLE001
    pass

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "audio")

# Voice slots — the 4 user-chosen Arabic voices, each paired with a matched
# English neural voice. The in-app picker selects a slot; the site loads the
# MP3 for (slot, era, step, current language).
SLOTS = {
    "classic": {"ar": "ar-SA-HamedNeural",   "en": "en-US-GuyNeural",
                "labelAr": "حامد",  "labelEn": "Hamed",   "descAr": "صوت فصيح",   "descEn": "Classic ♂"},
    "gentle":  {"ar": "ar-SA-ZariyahNeural", "en": "en-US-AriaNeural",
                "labelAr": "زارية", "labelEn": "Zariyah", "descAr": "صوت هادئ",   "descEn": "Gentle ♀"},
    "story":   {"ar": "ar-EG-SalmaNeural",   "en": "en-US-JennyNeural",
                "labelAr": "سلمى",  "labelEn": "Salma",   "descAr": "حكواتي",     "descEn": "Storyteller ♀"},
    "warm":    {"ar": "ar-OM-AbdullahNeural", "en": "en-GB-RyanNeural",
                "labelAr": "عبدالله", "labelEn": "Ryan",   "descAr": "صوت ودود",   "descEn": "Warm ♂"},
    "shakir":  {"ar": "ar-EG-ShakirNeural",  "en": "en-US-BrianNeural",
                "labelAr": "شاكر",  "labelEn": "Brian",   "descAr": "صوت مصري",   "descEn": "Egyptian ♂"},
}

# Storytelling pace: a touch slower than default, steady volume.
RATE = "-8%"
VOLUME = "+0%"
CONCURRENCY = 6  # be gentle on the free endpoint


def load_db():
    """Read window.SEERAH_DB (data.js) AND window.FOUR_IMAMS_DB (data_imams.js)
    via a tiny node shim. The four imams are merged in under `imam-<id>` keys, so
    the generation loop emits audio/<slot>/imam-<id>_<step>_<lang>.mp3 — exactly
    the path narrationURL() builds in imam mode."""
    shim = (
        "global.window={};require('./data.js');require('./data_imams.js');"
        "const d=Object.assign({},window.SEERAH_DB);"
        "const I=window.FOUR_IMAMS_DB||{};for(const k in I)d['imam-'+k]=I[k];"
        "process.stdout.write(JSON.stringify(d))"
    )
    out = subprocess.check_output(["node", "-e", shim], cwd=ROOT)
    return json.loads(out)


import re

# Arabic date abbreviations the neural voice otherwise spells out letter-by-letter
# (e.g. "م" read as the Latin letter "m" / "meters"). Expand them ONLY in the TTS
# input — the on-screen text keeps the proper abbreviations.
_AR_LETTERS = "ء-ي"  # hamza .. ya
_DIGITS = "0-9٠-٩"  # Latin + Arabic-indic


def normalize_ar_for_tts(text):
    # Hijri: "هـ" -> "هجرية"  (e.g. "سنة 80 هـ" -> "سنة 80 هجرية")
    text = text.replace("هـ", "هجرية")
    # Gregorian: a standalone "م" right after a number (Latin OR Arabic-indic)
    # -> "ميلادية"  ("699 م)" / "٥٧٠ م" -> "… ميلادية"; not inside words like "محرم").
    # Without this the voice reads "م" as the bare letter / "meters" (user-reported).
    text = re.sub(r"([" + _DIGITS + r"])\s*م(?![" + _AR_LETTERS + r"])", r"\1 ميلادية", text)
    # Genealogical connector "بن"/"بْن" ("son of", between two names): written
    # without an alif, the neural voice clips the bare consonant cluster and it
    # sounds like "pon". Prepend the hamzat-waṣl alif ("ابن") so it reads a clear
    # "ibn". Matches ONLY the standalone token (space-bounded, optional sukūn on
    # the bā' + optional case vowel on the nūn) — so بِنْت (daughter), بَنِي (sons
    # of), بَنَى (built), and an already-alif'd ابن are left untouched.
    text = re.sub(r"(?<!\S)(بْ?ن[َُِ]?)(?=\s)", r"ا\1", text)
    return text


def text_for(step, lang, voc=None):
    """Narration text = the story description in the chosen language.
    We DO NOT strip punctuation — commas/periods give the neural voice its
    natural pauses. Arabic date abbreviations (هـ / م) are expanded so they're
    spoken naturally.

    For Arabic we prefer a hand-vocalized (fully-diacritized) version when one
    exists in tools/narration_ar.json (keyed `<era>_<step>`). Bare consonantal
    text forces the neural voice to GUESS every harakah, and it sometimes guesses
    the wrong fatha/kasra/damma or case ending. Feeding diacritized text removes
    the guessing. Falls back to the on-screen descAr when no vocalized text is
    provided, so rollout can be incremental. The on-screen text is never changed."""
    if lang == "ar":
        return normalize_ar_for_tts(voc or step.get("descAr") or "")
    return step.get("descEn") or ""


VOC_PATH = os.path.join(ROOT, "tools", "narration_ar.json")


def load_voc():
    """Load the optional diacritized-narration sidecar (build-time only; the app
    never reads it). Returns {} if absent so the generator still works."""
    try:
        with open(VOC_PATH, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


async def synth_one(sem, voice, text, out_path, force):
    if not text.strip():
        return ("skip-empty", out_path)
    if os.path.exists(out_path) and not force:
        return ("exists", out_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    async with sem:
        try:
            comm = edge_tts.Communicate(text, voice, rate=RATE, volume=VOLUME)
            await comm.save(out_path)
            return ("ok", out_path)
        except Exception as e:  # noqa: BLE001 — surface, don't hide (per repo BUGS.md ethos)
            return (f"ERROR: {e}", out_path)


def build_manifest(db, slots):
    """Write audio/manifest.json: which (slot, era, step, lang) files exist,
    plus the slot labels for the picker UI. The site reads this to know
    whether a pre-generated clip is available before falling back to live TTS."""
    have = {}
    for slot in slots:
        for era, ev in db.items():
            for i in range(len(ev.get("steps", []))):
                for lang in ("ar", "en"):
                    rel = f"{slot}/{era}_{i}_{lang}.mp3"
                    if os.path.exists(os.path.join(AUDIO_DIR, rel)):
                        have.setdefault(slot, {}).setdefault(era, {}).setdefault(str(i), []).append(lang)
    manifest = {
        "rate": RATE,
        "slots": {s: {k: SLOTS[s][k] for k in ("ar", "en", "labelAr", "labelEn", "descAr", "descEn")} for s in slots},
        "have": have,
    }
    os.makedirs(AUDIO_DIR, exist_ok=True)
    with open(os.path.join(AUDIO_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print(f"manifest -> audio/manifest.json ({len(json.dumps(have))} bytes of index)")


async def main_async(args):
    db = load_db()
    slots = args.slots or list(SLOTS.keys())
    eras = args.eras or list(db.keys())
    langs = args.langs or ["ar", "en"]

    if args.manifest_only:
        build_manifest(db, slots)
        return

    voc = load_voc()
    voc_hits = 0
    sem = asyncio.Semaphore(CONCURRENCY)
    tasks = []
    for slot in slots:
        for era in eras:
            ev = db.get(era)
            if not ev:
                print(f"!! unknown era: {era}", file=sys.stderr)
                continue
            for i, step in enumerate(ev["steps"]):
                for lang in langs:
                    voice = SLOTS[slot][lang]
                    out_path = os.path.join(AUDIO_DIR, slot, f"{era}_{i}_{lang}.mp3")
                    override = voc.get(f"{era}_{i}") if lang == "ar" else None
                    if override:
                        voc_hits += 1
                    tasks.append(synth_one(sem, voice, text_for(step, lang, override), out_path, args.force))

    print(f"Generating {len(tasks)} clips  (slots={slots}, eras={len(eras)}, langs={langs}) …")
    if langs and "ar" in langs:
        print(f"  vocalized (diacritized) Arabic used for {voc_hits} of the AR clips; rest fall back to descAr.")
    results = await asyncio.gather(*tasks)

    stats = {"ok": 0, "exists": 0, "skip-empty": 0, "error": 0}
    for status, path in results:
        if status == "ok":
            stats["ok"] += 1
        elif status == "exists":
            stats["exists"] += 1
        elif status == "skip-empty":
            stats["skip-empty"] += 1
        else:
            stats["error"] += 1
            print(f"  {status}  ({os.path.relpath(path, ROOT)})", file=sys.stderr)
    print(f"Done: {stats}")
    build_manifest(db, slots)


def parse_args():
    p = argparse.ArgumentParser(description="Generate neural-TTS narration MP3s.")
    p.add_argument("--eras", nargs="*", help="subset of era keys (default: all)")
    p.add_argument("--slots", nargs="*", choices=list(SLOTS.keys()), help="subset of voice slots")
    p.add_argument("--langs", nargs="*", choices=["ar", "en"], help="subset of languages")
    p.add_argument("--force", action="store_true", help="regenerate even if the file exists")
    p.add_argument("--manifest-only", action="store_true", help="only (re)write audio/manifest.json")
    return p.parse_args()


if __name__ == "__main__":
    asyncio.run(main_async(parse_args()))
