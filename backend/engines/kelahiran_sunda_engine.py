from datetime import date

from engines.palintangan_sunda_engine import calculate_palintangan
from engines.jaya_apes_sunda_engine import calculate_jaya_apes


SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

HOUSE_DIRECTION_VERIFIED = {
    "Sabtu": "Utara",
    "Setu": "Utara",
    "Minggu": "Timur",
    "Ahad": "Timur",
    "Selasa": "Utara",
    "Kamis": "Timur",
    "Kemis": "Timur",
}

BIRTH_DOA = {
    "Ahad": {"dua": "ya hayu ya kayumu", "count": 500},
    "Minggu": {"dua": "ya hayu ya kayumu", "count": 500},
    "Senen": {"dua": "ya rahmanu ya rahimu", "count": 400},
    "Senin": {"dua": "ya rahmanu ya rahimu", "count": 400},
    "Selasa": {"dua": "ya malikul qudus", "count": 300},
    "Rebo": {"dua": "ya basiru ya mutaha", "count": 700},
    "Rabu": {"dua": "ya basiru ya mutaha", "count": 700},
    "Kemis": {"dua": "ya alliyu ya adimu", "count": 800},
    "Kamis": {"dua": "ya alliyu ya adimu", "count": 800},
    "Jumaah": {"dua": "ya kapi ya mugaeni", "count": 600},
    "Jumat": {"dua": "ya kapi ya mugaeni", "count": 600},
    "Jemuwah": {"dua": "ya kapi ya mugaeni", "count": 600},
    "Setu": {"dua": "ya pattahu ya rajaku", "count": 900},
    "Sabtu": {"dua": "ya pattahu ya rajaku", "count": 900},
}



def calculate_kelahiran(target_date: date, timezone_name: str = "Asia/Jakarta"):
    daily = calculate_palintangan(target_date, timezone_name)
    jaya_apes = calculate_jaya_apes(daily["calendar"]["day"], daily["calendar"]["pasaran"], daily["naktu"]["wedal"])
    return {
        "birth_date": target_date.isoformat(),
        "calendar": daily["calendar"],
        "naktu": daily["naktu"],
        "watek": daily["watek"],
        "birth_context": daily["birth_context"],
        "birth_house_direction": {
            "direction": HOUSE_DIRECTION_VERIFIED.get(daily["calendar"]["day"]),
            "status": "PARTIAL_SOURCE" if daily["calendar"]["day"] not in HOUSE_DIRECTION_VERIFIED else "VERIFIED_DATA",
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE, "location": "naskah p.90"},
            "note": "Hanya hari yang eksplisit terbaca pada source yang diisi; hari lain tidak diinferensikan.",
        },
        "birth_doa": {
            **BIRTH_DOA.get(daily["calendar"]["day"], {}),
            "count_basis": "naktu hari × 100" if daily["naktu"]["hari"] is not None else None,
            "count_check": (BIRTH_DOA.get(daily["calendar"]["day"], {}).get("count") == daily["naktu"]["hari"] * 100) if daily["naktu"]["hari"] is not None and daily["calendar"]["day"] in BIRTH_DOA else None,
            "source": {"source_id": SOURCE_ID, "source_title": SOURCE_TITLE, "location": "naskah p.89"},
        },
        "gagalang": daily["gagalang"],
        "jaya_apes": jaya_apes,
        "monthly_rule": daily["monthly_rule"],
        "meta": {
            "status": "IMPLEMENTED_BASE_LAYER",
            "source_id": SOURCE_ID,
            "source_title": SOURCE_TITLE,
            "note": "Kelahiran memakai calendar context dan Naktu/Watek yang sudah tervalidasi. Tafsir personal tambahan belum ditambahkan tanpa source rule yang eksplisit.",
        },
    }
