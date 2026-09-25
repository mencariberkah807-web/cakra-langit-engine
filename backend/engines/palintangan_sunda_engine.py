from datetime import date
from engines.hijri_engine import get_hijri_data
from engines.jawa_engine import get_jawa_data

DINO_NAKTU = {
    "Senen": 4,
    "Selasa": 3,
    "Rebo": 7,
    "Kemis": 8,
    "Jemuwah": 6,
    "Setu": 9,
    "Ngahad": 5,
}

PASARAN_NAKTU = {
    "Kliwon": 8,
    "Kaliwon": 8,
    "Legi": 5,
    "Manis": 5,
    "Pahing": 9,
    "Pon": 7,
    "Wage": 4,
}

PERNAASAN = {
    "Muharam": [3, 12, 20],
    "Sapar": [1, 10, 20],
    "Rabiulawal": [7, 11, 15],
    "Rabiulakhir": [3, 10, 20],
    "Jumadilawal": [5, 10, 11],
    "Jumadilakhir": [3, 10, 14],
    "Rajab": [3, 7, 10],
    "Rewah": [1, 11, 20],
    "Puasa": [9, 20, 29],
    "Sawal": [],
    "Dulkaidah": [3, 12, 20],
    "Rayagung": [2, 6, 20],
}

MONTH_RULES = {
    "Muharam": {
        "group": 1, "forbidden_days": ["Setu", "Ngahad"],
        "safe_days": ["Rebo", "Kemis"], "rizki_direction": "Tenggara",
    },
    "Sapar": {
        "group": 1, "forbidden_days": ["Setu", "Ngahad"],
        "safe_days": ["Rebo", "Kemis"], "rizki_direction": "Tenggara",
    },
    "Rabiulawal": {
        "group": 1, "forbidden_days": ["Setu", "Ngahad"],
        "safe_days": ["Rebo", "Kemis"], "rizki_direction": "Tenggara",
    },
    "Rabiulakhir": {
        "group": 2, "forbidden_days": ["Senen", "Selasa"],
        "safe_days": ["Jemuwah"], "rizki_direction": "Barat Laut",
    },
    "Jumadilawal": {
        "group": 2, "forbidden_days": ["Senen", "Selasa"],
        "safe_days": ["Jemuwah"], "rizki_direction": "Barat Laut",
    },
    "Jumadilakhir": {
        "group": 2, "forbidden_days": ["Senen", "Selasa"],
        "safe_days": ["Jemuwah"], "rizki_direction": "Barat Laut",
    },
    "Rajab": {
        "group": 3, "forbidden_days": ["Rebo", "Kemis"],
        "safe_days": ["Setu", "Ngahad"], "rizki_direction": "Barat Daya",
    },
    "Rewah": {
        "group": 3, "forbidden_days": ["Rebo", "Kemis"],
        "safe_days": ["Setu", "Ngahad"], "rizki_direction": "Barat Daya",
    },
    "Puasa": {
        "group": 3, "forbidden_days": ["Rebo", "Kemis"],
        "safe_days": ["Setu", "Ngahad"], "rizki_direction": "Barat Daya",
    },
    "Sawal": {
        "group": 4, "forbidden_days": ["Jemuwah"],
        "safe_days": ["Senen"], "rizki_direction": "Timur Laut",
    },
    "Dulkaidah": {
        "group": 4, "forbidden_days": ["Jemuwah"],
        "safe_days": ["Senen"], "rizki_direction": "Timur Laut",
    },
    "Rayagung": {
        "group": 4, "forbidden_days": ["Jemuwah"],
        "safe_days": ["Senen"], "rizki_direction": "Timur Laut",
    },
}

HIJRI_ALIASES = {
    "Muharram": "Muharam",
    "Safar": "Sapar",
    "Rabi' al-awwal": "Rabiulawal",
    "Rabi al-awwal": "Rabiulawal",
    "Rabiul Awwal": "Rabiulawal",
    "Rabi' al-thani": "Rabiulakhir",
    "Rabi al-thani": "Rabiulakhir",
    "Rabiul Akhir": "Rabiulakhir",
    "Jumada al-awwal": "Jumadilawal",
    "Jumada al-thani": "Jumadilakhir",
    "Jumadil Awal": "Jumadilawal",
    "Jumadil Akhir": "Jumadilakhir",
    "Sha'ban": "Rewah",
    "Shaaban": "Rewah",
    "Ramadan": "Puasa",
    "Dhul Qadah": "Dulkaidah",
    "Dhu al-Qidah": "Dulkaidah",
    "Dzulqaidah": "Dulkaidah",
    "Dhul Hijjah": "Rayagung",
    "Dhu al-Hijjah": "Rayagung",
    "Dzulhijah": "Rayagung",
    "Syawal": "Sawal",
}

def normalize_hijri_month(name: str) -> str:
    raw = (name or "").strip()
    return HIJRI_ALIASES.get(raw, raw)

def get_palintangan_sunda_data(target_date: date) -> dict:
    jawa = get_jawa_data(target_date)
    hijri = get_hijri_data(target_date.year, target_date.month, target_date.day)

    day_name = jawa["dayName"]
    pasaran_name = jawa["pasaran"]
    day_naktu = DINO_NAKTU[day_name]
    pasaran_naktu = PASARAN_NAKTU[pasaran_name]
    naktu_wedal = day_naktu + pasaran_naktu

    hijri_month = normalize_hijri_month(hijri["month_name"])
    month_rule = MONTH_RULES.get(hijri_month)
    pernaasan_dates = PERNAASAN.get(hijri_month, [])
    is_pernaasan = hijri["day"] in pernaasan_dates
    is_forbidden = bool(month_rule and day_name in month_rule["forbidden_days"])
    is_safe_day = bool(month_rule and day_name in month_rule["safe_days"])

    status = "NORMAL"
    if is_pernaasan or is_forbidden:
        status = "NAAS"
    elif is_safe_day:
        status = "SELAMET"

    return {
        "source": {
            "name": "PARIRIMBON SUNDA (JAWA BARAT)",
            "mode": "SOURCE_COMPILED",
            "note": "Palintangan rules are kept separate from the general calendar engine.",
        },
        "date": target_date.isoformat(),
        "calendar_context": {
            "hari": day_name,
            "pasaran": pasaran_name,
            "hijri": {
                "day": hijri["day"],
                "month": hijri["month_name"],
                "year": hijri["year"],
            },
            "wuku": jawa["wuku"],
        },
        "naktu": {
            "hari": day_naktu,
            "pasaran": pasaran_naktu,
            "wedal": naktu_wedal,
            "formula": f"{day_naktu} + {pasaran_naktu} = {naktu_wedal}",
        },
        "pernaasan": {
            "month": hijri_month,
            "dates": pernaasan_dates,
            "is_today": is_pernaasan,
            "status": "SOURCE_COMPILED",
            "note": "Some published transcriptions contain OCR/variant discrepancies; values are preserved as transcribed.",
        },
        "navigation": {
            "month_group": month_rule["group"] if month_rule else None,
            "pantangan_hari": month_rule["forbidden_days"] if month_rule else [],
            "hari_keselamatan": month_rule["safe_days"] if month_rule else [],
            "arah_rizki": month_rule["rizki_direction"] if month_rule else None,
            "status_hari": status,
            "interpretation": (
                "Arah rizki dan hari keselamatan/pantangan berasal dari rule Palintangan Sunda yang dikompilasi dari sumber."
                if month_rule else
                "Rule bulan Hijriah ini belum tersedia pada registry."
            ),
        },
        "trace": [
            {"step": 1, "rule": "calendar_context", "input": target_date.isoformat(), "result": {"hari": day_name, "pasaran": pasaran_name}},
            {"step": 2, "rule": "naktu_wedal", "input": {"hari": day_name, "pasaran": pasaran_name}, "result": naktu_wedal},
            {"step": 3, "rule": "pernaasan", "input": {"bulan_hijriah": hijri_month, "tanggal": hijri["day"]}, "result": {"dates": pernaasan_dates, "is_today": is_pernaasan}},
            {"step": 4, "rule": "kala_navigation", "input": {"bulan_hijriah": hijri_month, "hari": day_name}, "result": {"pantangan": is_forbidden, "keselamatan": is_safe_day, "arah_rizki": month_rule["rizki_direction"] if month_rule else None}},
        ],
    }
