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

def calculate_pancaka_12(name: str):
    clean = " ".join(name.strip().split())
    if not clean:
        raise ValueError("Nama diperlukan")

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
        "status": "VERIFIED" if not unknown else "PARTIAL_DATASET",
        "unknown_letters": unknown,
        "context": "watak nama",
        "source": {
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "location": "naskah p.84-85",
        },
        "note": "Pancaka 12 adalah rule nama terpisah: jumlah naktu huruf Arab dibagi 12; sisa menentukan nama Nabi. Mapping Nabi mengikuti urutan yang disebut pada source naskah.",
    }
}
