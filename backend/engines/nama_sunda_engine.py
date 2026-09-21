SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

# Cacarakan 18-letter values explicitly listed in the SSOT (p.72).
CACARAKAN_18 = {
    "ha": 1,
    "na": 2,
    "ca": 3,
    "ra": 4,
    "ka": 5,
    "da": 6,
    "ta": 7,
    "sa": 8,
    "wa": 9,
    "la": 10,
    "pa": 11,
    "ja": 12,
    "ya": 13,
    "nya": 14,
    "ma": 15,
    "ga": 16,
    "ba": 17,
    "nga": 18,
}

# Existing validated segment aliases are preserved explicitly.
VALIDATED_SEGMENT_ALIASES = {
    "wi": ("wa", 9),
    "kan": ("ka", 5),
    "ta": ("ta", 7),
    "wa": ("wa", 9),
    "ya": ("nya", 14),
}

# Consonant-to-Cacarakan base normalization for ordinary Latin names.
# Vowels are carried by the inherent Cacarakan vowel and therefore do not
# create a second value. Digraphs are matched before single letters.
LATIN_TO_CACARAKAN = {
    "ng": "nga",
    "ny": "nya",
    "kh": "ka",   # not a source-native mapping; kept unresolved below
    "h": "ha",
    "n": "na",
    "c": "ca",
    "r": "ra",
    "k": "ka",
    "d": "da",
    "t": "ta",
    "s": "sa",
    "w": "wa",
    "l": "la",
    "p": "pa",
    "j": "ja",
    "y": "ya",
    "m": "ma",
    "g": "ga",
    "b": "ba",
}

def _segment_name_part(part: str):
    """Map one Latin name part to Cacarakan base units without guessing."""
    text = part.lower()
    units = []
    i = 0
    while i < len(text):
        if text[i].isspace():
            i += 1
            continue
        if i + 1 < len(text) and text[i:i + 2] in ("ng", "ny"):
            units.append(LATIN_TO_CACARAKAN[text[i:i + 2]])
            i += 2
            continue
        char = text[i]
        if char in "aiueo":
            i += 1
            continue
        mapped = LATIN_TO_CACARAKAN.get(char)
        if mapped is None:
            return None
        units.append(mapped)
        i += 1
    return units

def calculate_naktu_nama(name: str):
    clean = " ".join(name.strip().split())
    if not clean:
        raise ValueError("Nama diperlukan")

    parts = [part.lower() for part in clean.split(" ")]
    rows = []
    unknown = []

    for part in parts:
        # Preserve the previously validated source example/segments.
        alias = VALIDATED_SEGMENT_ALIASES.get(part)
        if alias:
            base, value = alias
            rows.append({
                "segment": part,
                "source_letter": base,
                "naktu": value,
            })
            continue

        units = _segment_name_part(part)
        if not units:
            unknown.append(part)
            continue

        part_rows = [{"segment": part, "source_letter": unit, "naktu": CACARAKAN_18[unit]} for unit in units]
        rows.extend(part_rows)

    total = sum(item["naktu"] for item in rows)

    return {
        "name": clean,
        "segments": parts,
        "naktu": rows,
        "total": total if not unknown else None,
        "status": "VERIFIED" if not unknown else "PARTIAL_DATASET",
        "unknown_segments": unknown,
        "system": "Cacarakan 18",
        "source": {
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "location": "naskah p.72",
        },
        "note": "Naktu nama memakai nilai Cacarakan 18 dari SSOT. Segmen tervalidasi lama seperti Ya=14 dipertahankan sebagai dataset source-backed terpisah; source p.72 juga mencatat Cacarakan 18 ya=13 dan nya=14, sehingga keduanya tidak dicampur diam-diam.",
    }
}
