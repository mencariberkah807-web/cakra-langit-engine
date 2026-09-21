from datetime import date

from engines.palintangan_sunda_engine import calculate_palintangan
from engines.jaya_apes_sunda_engine import calculate_jaya_apes


SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"


def calculate_kelahiran(target_date: date, timezone_name: str = "Asia/Jakarta"):
    daily = calculate_palintangan(target_date, timezone_name)
    jaya_apes = calculate_jaya_apes(daily["calendar"]["day"], daily["calendar"]["pasaran"], daily["naktu"]["wedal"])
    return {
        "birth_date": target_date.isoformat(),
        "calendar": daily["calendar"],
        "naktu": daily["naktu"],
        "watek": daily["watek"],
        "birth_context": daily["birth_context"],
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
