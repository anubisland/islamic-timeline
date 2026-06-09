#!/usr/bin/env python3
"""
check_voc.py — integrity gate for the diacritized-narration sidecar.

The TTS generator (gen_tts.py) prefers a fully-vocalized (mushakkal) Arabic
narration from tools/narration_ar.json (keyed `<era>_<step>`) over the bare
on-screen `descAr`, so the neural voice reads the intended harakat instead of
guessing. That sidecar is keyed BY INDEX, so it silently goes stale whenever a
step's `descAr` is edited, or a step is inserted/removed/reordered (every later
index shifts). When that happens the audio narrates the wrong text.

This script catches all three failure modes by comparing each entry's
*consonantal skeleton* (letters with harakat stripped and alef/hamza/ya variants
normalized) against the current `descAr`:

  - MISSING  : a step has narration text but no sidecar entry  -> bare-descAr TTS
  - EXTRA    : a sidecar key no longer matches any step        -> stale/renamed
  - MISMATCH : the skeleton differs                            -> text edited or
                                                                  index shifted

It deliberately checks only the skeleton (consonants), not the harakat choices —
those are a human/listening call. A skeleton match guarantees the vocalized text
is the SAME words as descAr (only vowels added). Date tokens هـ/م stay bare in
both, and the build-time بن->ابن rewrite lives in gen_tts (not the sidecar), so
neither affects the skeleton.

Exit code 0 = clean, 1 = problems found (so it works as a pre-commit / CI gate).

Usage:
    python tools/check_voc.py
    python tools/check_voc.py --quiet     # only print the summary line
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


def main():
    ap = argparse.ArgumentParser(description="Validate the diacritized narration sidecar.")
    ap.add_argument("--quiet", action="store_true", help="print only the summary line")
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

    problems = len(missing) + len(extra) + len(mismatch)

    if not args.quiet:
        def show(label, keys, hint):
            if keys:
                print(f"\n{label} ({len(keys)}) — {hint}")
                for k in sorted(keys):
                    print(f"    {k}")
        show("MISSING", missing, "step has narration but no diacritized entry (will use bare descAr)")
        show("EXTRA", extra, "sidecar key matches no step (stale after a rename/removal)")
        show("MISMATCH", mismatch, "consonants differ from descAr (text edited or index shifted)")

    if problems == 0:
        print(f"OK: narration_ar.json is in sync — {len(voc)} entries, all skeletons match descAr.")
        return 0
    print(f"\nFAIL: {problems} problem(s) — {len(missing)} missing, {len(extra)} extra, "
          f"{len(mismatch)} mismatched. Re-vocalize the listed steps in tools/narration_ar.json "
          f"(keep the consonant skeleton identical to descAr), then regenerate AR audio.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
