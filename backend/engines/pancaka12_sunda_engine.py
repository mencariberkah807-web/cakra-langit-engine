SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

ARABIC_LETTER_NAKTU = {
    "a": 1,
    "i": 1,
    "u": 1,
    "e": 1,
    "o": 1,
    "eu": 1,
    "b": 2,
    "t": 3,
    "th": 8,
    "j": 3,
    "h": 3,
    "kh": 6,
    "d": 3,
    "dh": 5,
    "r": 2,
    "z": 7,
    "s": 6,
    "sy": 3,
    "sh": 9,
    "dh2": 11,
    "ain": 3,
    "gh": 4,
    "f": 8,
    "q": 10,
    "l": 3,
    "m": 4,
    "n": 3,
    "w": 6,
    "ha": 5,
    "la": 3,
    "hamzah": 2,
    "y": 10,
}

ARABIC_LETTER_NAME_ALIASES = {
    "alif": "a",
    "ba": "b",
    "ta": "t",
    "tha": "th",
    "jim": "j",
    "ha": "h",
    "kha": "kh",
    "dal": "d",
    "dhal": "dh",
    "ra": "r",
    "za": "z",
    "sin": "s",
    "syin": "sy",
    "sad": "sh",
    "dad": "dh2",
    "ain": "ain",
    "ghain": "gh",
    "fa": "f",
    "qaf": "q",
    "lam": "l",
    "mim": "m",
    "nun": "n",
    "wau": "w",
    "ha5": "ha",
    "lamalif": "la",
    "hamzah": "hamzah",
    "ya": "y",
}

NABI_BY_REMAINDER = {
    1: "Nabi Adam",
    2: "Nabi Sulaeman",
    3: "Nabi Daud",
    4: "Nabi Isa",
    5: "Nabi Muhammad",
    6: "Nabi Yusuf",
    7: "Nabi Yunus",
    8: "Nabi Noh",
    9: "Nabi Idris",
    10: "Nabi Ayub",
    11: "Nabi Musa",
    12: "Nabi Ibrahim",
}

def _tokenize_latin_name(name: str):
    text = "".join(ch for ch in name.lower().strip() if ch.isalpha() or ch.isspace())
    tokens = []
    i = 0
    while i < len(text):
        if text[i].isspace():
            i += 1
            continue
        matched = False
        for token in ("hamzah", "eu", "sy", "sh", "th", "kh", "dh", "gh", "la"):
            if text.startswith(token, i):
                tokens.append(token)
                i += len(token)
                matched = True
                break
        if matched:
            continue
        tokens.append(text[i])
        i += 1
    return tokens

def calculate_pancaka_12(name: str, letters: str = ""):
    clean = " ".join(name.strip().split())
    if not clean and not letters.strip():
        raise ValueError("Nama atau huruf Arab diperlukan")

    # Source-safe production path: caller supplies the Arabic-derived letter
    # tokens used for the calculation. A Latin name alone cannot be promoted
    # to VERIFIED because the SSOT does not define transliteration rules.
    token_source = letters.strip() if letters.strip() else clean
    tokens = [ARABIC_LETTER_NAME_ALIASES.get(token.strip().lower(), token.strip().lower()) for token in token_source.replace(",", " ").split()]
    if not letters.strip():
        tokens = _tokenize_latin_name(clean)
    rows = []
    unknown = []

    for token in tokens:
        value = ARABIC_LETTER_NAKTU.get(token)
        if value is None:
            unknown.append(token)
        else:
            rows.append({"letter": token, "naktu": value})

    total = sum(row["naktu"] for row in rows)
    remainder = total % 12
    result_index = 12 if remainder == 0 else remainder

    return {
        "name": clean,
        "letters": rows,
        "total": total if not unknown else None,
        "divisor": 12,
        "remainder": remainder if not unknown else None,
        "result_index": result_index if not unknown else None,
        "nabi": NABI_BY_REMAINDER.get(result_index) if not unknown else None,
        "status": "VERIFIED" if letters.strip() and not unknown else "PARTIAL_DATASET",
        "unknown_letters": unknown,
        "context": "watak nama",
        "source": {
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "location": "naskah p.84-85",
        },
        "note": "Pancaka 12 adalah rule nama terpisah. Production VERIFIED memakai token huruf Arab yang diberikan eksplisit; Latin name tanpa token huruf tetap PARTIAL karena SSOT tidak memberi aturan transliterasi Latin→Arab.",
    }
}
