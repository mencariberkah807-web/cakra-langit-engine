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

# Cacarakan 20 variant exactly as documented in the SSOT (p.72).
# The source itself lists two consecutive "ya" entries at 13 and 14.
# This apparent source ambiguity is preserved instead of silently corrected.
CACARAKAN_20_TABLE = [
    ("ha", 1),
    ("na", 2),
    ("ca", 3),
    ("ra", 4),
    ("ka", 5),
    ("da", 6),
    ("ta", 7),
    ("sa", 8),
    ("wa", 9),
    ("la", 10),
    ("pa", 11),
    ("dha", 12),
    ("ya", 13),
    ("ya", 14),
    ("nya", 15),
    ("ma", 16),
    ("ga", 17),
    ("ba", 18),
    ("tha", 19),
    ("nga", 20),
]

CACARAKAN_VARIANTS = {
    "cacarakan_18": {
        "label": "Cacarakan 18",
        "table": [(key, value) for key, value in CACARAKAN_18.items()],
        "status": "SOURCE_BACKED",
    },
    "cacarakan_20": {
        "label": "Cacarakan 20",
        "table": CACARAKAN_20_TABLE,
        "status": "SOURCE_BACKED_WITH_SOURCE_AMBIGUITY",
    },
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

def _normalize_latin_consonant(text: str):
    """Normalize foreign/modern Latin consonants to the nearest Cacarakan base.

    This is a calculator aid only. It is explicitly marked as APPROXIMATE;
    it does not replace a source-backed transliteration.
    """
    aliases = (
        ("kh", "ka"),
        ("gh", "ga"),
        ("ph", "pa"),
        ("bh", "ba"),
        ("th", "ta"),
        ("dh", "da"),
        ("sh", "sa"),
        ("sy", "sa"),
        ("ch", "ca"),
        ("ng", "nga"),
        ("ny", "nya"),
    )
    value = text.lower()
    for source, target in aliases:
        if value == source:
            return target
    return {
        "f": "pa",
        "v": "wa",
        "q": "ka",
        "x": "ka",
        "z": "ja",
    }.get(value, LATIN_TO_CACARAKAN.get(value))


def suggest_cacarakan_segments(name: str):
    """Return a calculator-style consonant/base conversion.

    Example: Fareza -> pa, ra, ja.
    Vowels are not counted as separate Naktu units; the consonant/base
    is represented using the inherent Cacarakan 'a' vowel.
    """
    suggestions = []
    for word in [item.lower() for item in name.strip().split() if item.strip()]:
        i = 0
        units = []
        while i < len(word):
            if word[i] in "aiueo":
                i += 1
                continue
            pair = word[i:i + 2]
            if pair in {"ng", "ny", "kh", "gh", "ph", "bh", "th", "dh", "sh", "sy", "ch"}:
                mapped = _normalize_latin_consonant(pair)
                if mapped:
                    units.append(mapped)
                else:
                    units.append(None)
                i += 2
                continue
            mapped = _normalize_latin_consonant(word[i])
            units.append(mapped)
            i += 1
        suggestions.append({
            "input": word,
            "segments": units,
            "display": " ".join(units) if all(units) else None,
        })
    return suggestions


def calculate_naktu_nama(name: str):
    clean = " ".join(name.strip().split())
    if not clean:
        raise ValueError("Nama diperlukan")

    parts = [part.lower() for part in clean.split(" ")]
    rows = []
    unknown = []
    used_validated_alias = False

    for part in parts:
        alias = VALIDATED_SEGMENT_ALIASES.get(part)
        if alias:
            used_validated_alias = True
            base, value = alias
            rows.append({
                "segment": part,
                "source_letter": base,
                "naktu": value,
                "status": "VERIFIED",
            })
            continue

        units = _segment_name_part(part)
        if not units:
            unknown.append(part)
            continue

        for unit in units:
            rows.append({
                "segment": part,
                "source_letter": unit,
                "naktu": CACARAKAN_18[unit],
                "status": "SOURCE_MAPPING",
            })

    total = sum(item["naktu"] for item in rows)

    calculator = suggest_cacarakan_segments(clean)
    calculator_unknown = any(item["display"] is None for item in calculator)

    return {
        "name": clean,
        "segments": parts,
        "naktu": rows,
        "total": total if not unknown else None,
        "status": "VERIFIED" if not unknown and used_validated_alias and all(part in VALIDATED_SEGMENT_ALIASES for part in parts) else "PARTIAL_SOURCE",
        "unknown_segments": unknown,
        "calculator": {
            "system": "Cacarakan 18 · consonant/base approximation",
            "segments": calculator,
            "status": "APPROXIMATE" if not calculator_unknown else "PARTIAL_APPROXIMATION",
            "editable": True,
            "note": "Converter membantu memecah nama Latin menjadi dasar Cacarakan yang paling dekat. Hasil ini adalah pendekatan kalkulator, bukan transliterasi SSOT yang sudah tervalidasi.",
        },
        "source": {
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "location": "naskah p.72",
        },
        "note": "Segmen yang memang tervalidasi tetap VERIFIED. Converter Latin→Cacarakan adalah bantuan pendekatan dan tidak mengubah status source-backed.",
    }
}
