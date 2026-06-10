#!/usr/bin/env python3
"""
check_release.py — consolidated pre-commit/pre-push gate for the whole site.

Run this before EVERY commit that touches data, audio, or UI. It runs all the
project's mechanical checks in one shot; each one exists because its failure
mode actually shipped to the live site at least once:

  1. JS syntax        node --check on app.js / data.js / data_imams.js
  2. GeoJSON parse    timeline_data.geojson is valid JSON
  3. Bilingual        every data-ar has a matching data-en in index.html
  4. Vocalization     tools/check_voc.py (sidecar sync + density + foreign chars)
  5. Slot sync        gen_tts.py SLOTS == app.js VOICE_SLOTS == manifest slots
  6. Audio coverage   every step x slot x lang MP3 exists and is non-empty
                      (catches half-generated eras, e.g. a new voice slot or a
                      new era generated for only some voices)
  7. Cache-bust       any of app.js/data.js/data_imams.js/style.css that differs
                      from origin/main must have ?v=<package.json version> in
                      index.html ("new HTML + stale cached JS -> clicking does
                      nothing" shipped three separate times)

Exit 0 = all green. Exit 1 = problems listed (grouped per check).

Usage:
    python tools/check_release.py
    python tools/check_release.py --no-coverage   # skip the (slow) audio scan
"""

import argparse
import json
import os
import re
import subprocess
import sys

try:  # Windows consoles default to cp1252 and choke on Arabic in print().
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:  # noqa: BLE001
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, "audio")
FAILS = []


def fail(check, msg):
    FAILS.append((check, msg))


def run(cmd, **kw):
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True,
                          encoding="utf-8", errors="replace", shell=False, **kw)


def check_js_syntax():
    for f in ("app.js", "data.js", "data_imams.js"):
        r = run(["node", "--check", f])
        if r.returncode != 0:
            fail("js-syntax", f"{f}: {r.stderr.strip().splitlines()[0] if r.stderr else 'parse error'}")


def check_geojson():
    try:
        with open(os.path.join(ROOT, "timeline_data.geojson"), encoding="utf-8") as f:
            json.load(f)
    except Exception as e:  # noqa: BLE001
        fail("geojson", str(e))


def check_bilingual():
    with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
        h = f.read()
    ar, en = len(re.findall(r"data-ar=", h)), len(re.findall(r"data-en=", h))
    if ar != en:
        fail("bilingual", f"data-ar={ar} vs data-en={en} in index.html — every string needs both")


def check_voc():
    r = run([sys.executable, os.path.join(ROOT, "tools", "check_voc.py")])
    if r.returncode != 0:
        fail("vocalization", (r.stdout or r.stderr).strip())


def load_db():
    shim = (
        "global.window={};require('./data.js');require('./data_imams.js');"
        "const d=Object.assign({},window.SEERAH_DB);"
        "const I=window.FOUR_IMAMS_DB||{};for(const k in I)d['imam-'+k]=I[k];"
        "const o={};for(const e of Object.keys(d))o[e]=d[e].steps.length;"
        "process.stdout.write(JSON.stringify(o))"
    )
    r = run(["node", "-e", shim])
    return json.loads(r.stdout)


def gen_slots():
    """SLOTS keys from gen_tts.py without importing it (no edge_tts needed)."""
    with open(os.path.join(ROOT, "tools", "gen_tts.py"), encoding="utf-8") as f:
        src = f.read()
    m = re.search(r"^SLOTS\s*=\s*\{(.*?)^\}", src, re.S | re.M)
    return re.findall(r'^\s*"([a-z]+)":\s*\{', m.group(1), re.M) if m else []


def app_slots():
    with open(os.path.join(ROOT, "app.js"), encoding="utf-8") as f:
        src = f.read()
    m = re.search(r"VOICE_SLOTS\s*=\s*\[(.*?)\]", src, re.S)
    return re.findall(r"id:\s*'([a-z]+)'", m.group(1)) if m else []


def manifest_slots():
    try:
        with open(os.path.join(AUDIO, "manifest.json"), encoding="utf-8") as f:
            return list(json.load(f)["slots"].keys())
    except Exception as e:  # noqa: BLE001
        fail("slot-sync", f"manifest.json unreadable: {e}")
        return []


def check_slot_sync():
    g, a, m = gen_slots(), app_slots(), manifest_slots()
    if not (set(g) == set(a) == set(m)) or not g:
        fail("slot-sync", f"gen_tts SLOTS={g} | app.js VOICE_SLOTS={a} | manifest={m} — must be identical")
    return g


def check_audio_coverage(slots, db):
    missing, empty = [], []
    for slot in slots:
        for era, n in db.items():
            for i in range(n):
                for lang in ("ar", "en"):
                    p = os.path.join(AUDIO, slot, f"{era}_{i}_{lang}.mp3")
                    if not os.path.exists(p):
                        missing.append(f"{slot}/{era}_{i}_{lang}.mp3")
                    elif os.path.getsize(p) == 0:
                        empty.append(f"{slot}/{era}_{i}_{lang}.mp3")
    if missing:
        fail("audio-coverage", f"{len(missing)} missing clip(s), e.g. {missing[:5]} — run gen_tts.py for those eras/slots")
    if empty:
        fail("audio-coverage", f"{len(empty)} EMPTY (0-byte) clip(s): {empty[:5]} — delete and regenerate (a failed edge-tts call leaves a 0-byte file that later runs skip as 'exists')")


def check_cachebust():
    with open(os.path.join(ROOT, "package.json"), encoding="utf-8") as f:
        ver = json.load(f)["version"]
    with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
        h = f.read()
    # which trackable assets differ from origin/main (committed or working tree)?
    r = run(["git", "diff", "--name-only", "origin/main"])
    changed = set(r.stdout.split()) if r.returncode == 0 else set()
    for asset in ("app.js", "data.js", "data_imams.js", "style.css"):
        m = re.search(re.escape(asset) + r"\?v=([0-9.]+)", h)
        if not m:
            fail("cache-bust", f"{asset} has NO ?v= query in index.html — stale-cache bug guaranteed")
        elif asset in changed and m.group(1) != ver:
            fail("cache-bust", f"{asset} changed vs origin/main but index.html pins ?v={m.group(1)} "
                               f"(package.json is {ver}) — bump it or cached browsers keep the old file")


def main():
    ap = argparse.ArgumentParser(description="Run all release gates.")
    ap.add_argument("--no-coverage", action="store_true", help="skip the audio file scan (slowest check)")
    args = ap.parse_args()

    check_js_syntax()
    check_geojson()
    check_bilingual()
    check_voc()
    slots = check_slot_sync()
    db = load_db()
    if not args.no_coverage and slots:
        check_audio_coverage(slots, db)
    check_cachebust()

    if not FAILS:
        n = sum(db.values())
        print(f"OK: all release gates green — {len(db)} eras/modules, {n} steps, slots={slots}.")
        return 0
    print(f"FAIL: {len(FAILS)} problem(s):\n")
    for check, msg in FAILS:
        print(f"[{check}] {msg}\n")
    return 1


if __name__ == "__main__":
    sys.exit(main())
