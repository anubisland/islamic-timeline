#!/usr/bin/env python3
"""
check_voc.py — integrity gate for the diacritized-narration sidecar.

The TTS generator (gen_tts.py) prefers a fully-vocalized (mushakkal) Arabic
narration from tools/narration_ar.json (keyed `<era>_<step>`) over the bare
on-screen `descAr`, so the neural voice reads the intended harakat instead of
guessing. That sidecar is keyed BY INDEX, so it silently goes stale whenever a
step's `descAr` is edited, or a step is inserted/removed/reordered (every later
index shifts). When that happens the audio narrates the wrong text.

This script catches five failure modes:

  - MISSING  : a step has narration text but no sidecar entry  -> bare-descAr TTS
  - EXTRA    : a sidecar key no longer matches any step        -> stale/renamed
  - MISMATCH : the consonant skeleton differs from descAr      -> text edited or
                                                                  index shifted
  - BARE     : entry exists but harakat density is below the threshold (default
               40% marks-per-letter; genuinely mushakkal text measures 80%+).
               A bare entry passes the skeleton check trivially — this is how the
               Umayyad (4.8%) and Abbasid (0.6%) eras shipped with guessed vowels
               in v3.0–3.3 — so density is checked explicitly.
  - FOREIGN  : descAr or the sidecar entry contains non-Arabic letters (CJK,
               Cyrillic, stray Latin words...) — e.g. the machine-translation
               leftover «جيش足以 الصمود» that shipped in abassi_24. Latin digits,
               punctuation, ﷺ and whitespace are allowed.

The skeleton check guarantees the vocalized text is the SAME words as descAr
(only vowels added); it deliberately does not judge harakat *choices* — those
are a human/listening call. Date tokens هـ/م stay bare in both, and the
build-time بن->ابن rewrite lives in gen_tts (not the sidecar), so neither
affects the skeleton.

Exit code 0 = clean, 1 = problems found (so it works as a pre-commit / CI gate).

Usage:
    python tools/check_voc.py
    python tools/check_voc.py --quiet            # only print the summary line
    python tools/check_voc.py --min-density 30   # loosen the BARE threshold
"""

import argparse
import json
import os
import re
import subprocess
import sys

try:  # Windows consoles default to cp1252 and choke on Arabic / ✓ in print().
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:  # noqa: BLE001
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOC_PATH = os.path.join(ROOT, "tools", "narration_ar.json")

# All Arabic combining marks (tanwin, harakat, shadda, sukun, superscript alef,
# tatweel, Quranic annotation marks) — stripped to recover the consonant line.
_HARAKAT = re.compile(r"[ؐ-ًؚ-ٰٟـۖ-ۭ]")


def skeleton(s):
    """Consonant skeleton: drop harakat, fold alef/hamza/ya spelling variants,
    keep only Arabic letters + digits. Two strings with the same skeleton are
    the same words (only vowels/spelling-of-hamza differ)."""
    s = _HARAKAT.sub("", s)
    s = re.sub(r"[آأإٱ]", "ا", s)   # آأإٱ -> ا
    s = s.replace("ؤ", "و").replace("ئ", "ي")  # ؤ->و ئ->ي
    s = s.replace("ى", "ي").replace("ء", "")        # ى->ي, drop ء
    return re.sub(r"[^ا-ي0-9٠-٩]", "", s)


def load_descar():
    """{ '<era>_<step>': descAr } for every step in data.js + data_imams.js."""
    shim = (
        "global.window={};require('./data.js');require('./data_imams.js');"
        "const d=Object.assign({},window.SEERAH_DB);"
        "const I=window.FOUR_IMAMS_DB||{};for(const k in I)d['imam-'+k]=I[k];"
        "const o={};for(const e of Object.keys(d))"
        "d[e].steps.forEach((s,i)=>o[e+'_'+i]=s.descAr||'');"
        "process.stdout.write(JSON.stringify(o))"
    )
    out = subprocess.check_output(["node", "-e", shim], cwd=ROOT)
    return json.loads(out)


def load_voc():
    with open(VOC_PATH, encoding="utf-8") as f:
        return {k: v for k, v in json.load(f).items() if k != "_comment"}


_AR_LETTER = re.compile(r"[ء-ي]")
_VOWEL_MARKS = re.compile(r"[ً-ْٰ]")  # tanwin + fatha/damma/kasra + shadda + sukun + dagger alif


def density(s):
    """Harakat marks per Arabic letter, in percent. Fully-vocalized text in this
    project measures ~80-86%; bare text <5%."""
    letters = len(_AR_LETTER.findall(s))
    if not letters:
        return 100.0  # nothing to vowel (e.g. empty) — don't flag
    return 100.0 * len(_VOWEL_MARKS.findall(s)) / letters


# Allowed in narration text: Arabic block incl. harakat, digits (Latin +
# Arabic-indic), common punctuation/quotes/dashes, ﷺ (U+FDFA) and other Arabic
# presentation forms, whitespace. Anything else (CJK, Cyrillic, Latin LETTERS...)
# is flagged — Latin letters are included deliberately: descAr should not
# contain English words, and TTS reads them in the Arabic voice badly.
_FOREIGN = re.compile(r"[^؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿"
                      r"0-9\s\.,;:!\?\'\"«»\(\)\[\]\{\}—–\-_%&\*\+=/\\#@٪؟،؛]")


def foreign_chars(s):
    """Return the set of disallowed characters found in s (empty set = clean)."""
    return set(_FOREIGN.findall(s))


def main():
    ap = argparse.ArgumentParser(description="Validate the diacritized narration sidecar.")
    ap.add_argument("--quiet", action="store_true", help="print only the summary line")
    ap.add_argument("--min-density", type=float, default=40.0,
                    help="minimum harakat-per-letter %% for a sidecar entry (default 40; real tashkil is 80+)")
    args = ap.parse_args()

    orig = load_descar()
    voc = load_voc()

    # MISSING: a step with real narration text but no (non-empty) sidecar entry.
    missing = [k for k, v in orig.items() if v.strip() and not voc.get(k, "").strip()]
    # EXTRA: a sidecar key that no longer maps to a step.
    extra = [k for k in voc if k not in orig]
    # MISMATCH: entry exists but its consonants differ from descAr.
    mismatch = [k for k in orig if k in voc and voc[k].strip()
                and skeleton(orig[k]) != skeleton(voc[k])]
    # BARE: entry exists and matches, but is not actually vocalized.
    bare = ["%s (%.0f%%)" % (k, density(voc[k])) for k in sorted(voc)
            if k in orig and voc[k].strip() and density(voc[k]) < args.min_density]
    # FOREIGN: non-Arabic letters in descAr or the sidecar entry.
    foreign = []
    for k in sorted(orig):
        bad = foreign_chars(orig[k]) | foreign_chars(voc.get(k, ""))
        if bad:
            foreign.append("%s (%s)" % (k, " ".join(repr(c) for c in sorted(bad))))

    problems = len(missing) + len(extra) + len(mismatch) + len(bare) + len(foreign)

    if not args.quiet:
        def show(label, keys, hint):
            if keys:
                print(f"\n{label} ({len(keys)}) — {hint}")
                for k in keys if label in ("BARE", "FOREIGN") else sorted(keys):
                    print(f"    {k}")
        show("MISSING", missing, "step has narration but no diacritized entry (will use bare descAr)")
        show("EXTRA", extra, "sidecar key matches no step (stale after a rename/removal)")
        show("MISMATCH", mismatch, "consonants differ from descAr (text edited or index shifted)")
        show("BARE", bare, f"harakat density < {args.min_density:.0f}%% — entry is not really vocalized; TTS will guess vowels")
        show("FOREIGN", foreign, "non-Arabic letters in the narration text (CJK/Latin/... corruption)")

    if problems == 0:
        print(f"OK: narration_ar.json is in sync — {len(voc)} entries, all skeletons match descAr, "
              f"all vocalized (>= {args.min_density:.0f}%), no foreign characters.")
        return 0
    print(f"\nFAIL: {problems} problem(s) — {len(missing)} missing, {len(extra)} extra, "
          f"{len(mismatch)} mismatched, {len(bare)} bare, {len(foreign)} with foreign chars. "
          f"Re-vocalize the listed steps in tools/narration_ar.json (keep the consonant skeleton "
          f"identical to descAr), fix any corrupted descAr in data.js, then regenerate AR audio.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
