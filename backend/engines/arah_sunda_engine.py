from datetime import date

from engines.palintangan_sunda_engine import calculate_palintangan


SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"


def calculate_arah(target_date: date, timezone_name: str = "Asia/Jakarta"):
    daily = calculate_palintangan(target_date, timezone_name)
    monthly = daily["monthly_rule"]
    return {
        "date": target_date.isoformat(),
        "direction": {
            "rizki": monthly["rizki_direction"],
            "source": {
                "source_id": SOURCE_ID,
                "source_title": SOURCE_TITLE,
                "location": "naskah p.21 / p.36",
            },
        },
        "calendar_context": {
            "day": daily["calendar"]["day"],
            "pasaran": daily["calendar"]["pasaran"],
            "hijri": daily["calendar"]["hijri"],
        },
        "meta": {
            "status": "IMPLEMENTED_SOURCE_RULE",
            "note": "Arah yang ditampilkan adalah arah rizki berdasarkan kelompok bulan. Ini bukan aturan arah perjalanan universal.",
        },
    }
