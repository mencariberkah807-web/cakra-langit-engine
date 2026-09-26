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

WATEK_PATOKAN = {
    "Muharam": {"ordinal": 1, "watek": "Wani"},
    "Sapar": {"ordinal": 2, "watek": "Karang Piwulang"},
    "Rabiulawal": {"ordinal": 3, "watek": "Sumur Pinungkeb"},
    "Rabiulakhir": {"ordinal": 4, "watek": "Karang Tinangtang"},
    "Jumadilawal": {"ordinal": 5, "watek": "Macan Katawang"},
    "Jumadilakhir": {"ordinal": 6, "watek": "Nuju Pati"},
    "Rajab": {"ordinal": 7, "watek": "Nuju Padu"},
    "Rewah": {"ordinal": 8, "watek": "Mantri Sinareja"},
    "Puasa": {"ordinal": 9, "watek": "Demang Kanduruan"},
    "Sawal": {"ordinal": 10, "watek": "Putri Tinuting"},
    "Dulkaidah": {"ordinal": 11, "watek": "Demang Palasah"},
    "Rayagung": {"ordinal": 12, "watek": "Alas Kobar"},
}

# Source table: Gagalang Poe / Babalang Dua.
# Each fixed weekday carries the Watek Patokan(s) for the months shown in that row.
GAGALANG_POE = {
    "Jemuwah": ["Wani", "Karang Piwulang"],
    "Setu": ["Sumur Pinungkeb", "Karang Tinangtang"],
    "Ngahad": ["Macan Katawang", "Nuju Pati"],
    "Senen": ["Nuju Padu"],
    "Selasa": ["Mantri Sinareja"],
    "Rebo": ["Demang Kanduruan", "Putri Tinuting"],
    "Kemis": ["Demang Palasah", "Alas Kobar"],
}

GAGALANG_POE_MONTHS = {
    "Muharam": {"hari": "Jemuwah", "ordinal": 1, "watek": "Wani"},
    "Sapar": {"hari": "Jemuwah", "ordinal": 2, "watek": "Karang Piwulang"},
    "Rabiulawal": {"hari": "Setu", "ordinal": 3, "watek": "Sumur Pinungkeb"},
    "Rabiulakhir": {"hari": "Setu", "ordinal": 4, "watek": "Karang Tinangtang"},
    "Jumadilawal": {"hari": "Ngahad", "ordinal": 5, "watek": "Macan Katawang"},
    "Jumadilakhir": {"hari": "Ngahad", "ordinal": 6, "watek": "Nuju Pati"},
    "Rajab": {"hari": "Senen", "ordinal": 7, "watek": "Nuju Padu"},
    "Rewah": {"hari": "Selasa", "ordinal": 8, "watek": "Mantri Sinareja"},
    "Puasa": {"hari": "Rebo", "ordinal": 9, "watek": "Demang Kanduruan"},
    "Sawal": {"hari": "Rebo", "ordinal": 10, "watek": "Putri Tinuting"},
    "Dulkaidah": {"hari": "Kemis", "ordinal": 11, "watek": "Demang Palasah"},
    "Rayagung": {"hari": "Kemis", "ordinal": 12, "watek": "Alas Kobar"},
}

GAGALANG_PASARAN = {
    "Kliwon": {"next_pasaran": "Manis", "direction": "Timur"},
    "Manis": {"next_pasaran": "Pahing", "direction": "Selatan"},
    "Pahing": {"next_pasaran": "Pon", "direction": "Barat"},
    "Pon": {"next_pasaran": "Wage", "direction": "Utara"},
    "Wage": {"next_pasaran": "Kliwon", "direction": "Tengah"},
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

JAYA_APES_DAY_INDEX = {
    "Ngahad": 0,
    "Senen": 1,
    "Selasa": 2,
    "Rebo": 3,
    "Kemis": 4,
    "Jemuwah": 5,
    "Setu": 6,
}

DAY_INDEX_TO_NAME = {index: name for name, index in JAYA_APES_DAY_INDEX.items()}

# Cakra Langit personal reconstruction:
# The recovered Sunda example Senen + Pahing (Naktu 13) -> Jaya Setu / Apes Kemis
# is reproduced by a 7-day cyclic index:
#   Jaya = Naktu Wedal mod 7
#   Apes = (Naktu Wedal - 2) mod 7
# This is intentionally labeled RECONSTRUCTED, not presented as a manuscript formula.
def calculate_jaya_apes(day_name: str, naktu_wedal: int) -> dict:
    jaya_index = naktu_wedal % 7
    apes_index = (naktu_wedal - 2) % 7
    return {
        "jaya": DAY_INDEX_TO_NAME[jaya_index],
        "apes": DAY_INDEX_TO_NAME[apes_index],
        "jaya_index": jaya_index,
        "apes_index": apes_index,
        "status": "CAKRA_LANGIT_RECONSTRUCTED",
        "source_note": (
            "Rekonstruksi personal Cakra Langit dari grammar siklus naktu Palintangan Sunda, "
            "dikunci untuk menghasilkan contoh sumber Senen + Pahing (Naktu 13) -> Jaya Setu / Apes Kemis. "
            "Bukan klaim sebagai formula manuskrip tunggal."
        ),
    }

MONTH_RULES = {
    "Muharam": {"group": 1, "forbidden_days": ["Setu", "Ngahad"], "safe_days": ["Rebo", "Kemis"], "rizki_direction": "Tenggara"},
    "Sapar": {"group": 1, "forbidden_days": ["Setu", "Ngahad"], "safe_days": ["Rebo", "Kemis"], "rizki_direction": "Tenggara"},
    "Rabiulawal": {"group": 1, "forbidden_days": ["Setu", "Ngahad"], "safe_days": ["Rebo", "Kemis"], "rizki_direction": "Tenggara"},
    "Rabiulakhir": {"group": 2, "forbidden_days": ["Senen", "Selasa"], "safe_days": ["Jemuwah"], "rizki_direction": "Barat Laut"},
    "Jumadilawal": {"group": 2, "forbidden_days": ["Senen", "Selasa"], "safe_days": ["Jemuwah"], "rizki_direction": "Barat Laut"},
    "Jumadilakhir": {"group": 2, "forbidden_days": ["Senen", "Selasa"], "safe_days": ["Jemuwah"], "rizki_direction": "Barat Laut"},
    "Rajab": {"group": 3, "forbidden_days": ["Rebo", "Kemis"], "safe_days": ["Setu", "Ngahad"], "rizki_direction": "Barat Daya"},
    "Rewah": {"group": 3, "forbidden_days": ["Rebo", "Kemis"], "safe_days": ["Setu", "Ngahad"], "rizki_direction": "Barat Daya"},
    "Puasa": {"group": 3, "forbidden_days": ["Rebo", "Kemis"], "safe_days": ["Setu", "Ngahad"], "rizki_direction": "Barat Daya"},
    "Sawal": {"group": 4, "forbidden_days": ["Jemuwah"], "safe_days": ["Senen"], "rizki_direction": "Timur Laut"},
    "Dulkaidah": {"group": 4, "forbidden_days": ["Jemuwah"], "safe_days": ["Senen"], "rizki_direction": "Timur Laut"},
    "Rayagung": {"group": 4, "forbidden_days": ["Jemuwah"], "safe_days": ["Senen"], "rizki_direction": "Timur Laut"},
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
    watek_patokan = WATEK_PATOKAN.get(hijri_month)
    gagalang = GAGALANG_PASARAN.get(pasaran_name)
    gagalang_poe = GAGALANG_POE.get(day_name, [])
    gagalang_poe_month = GAGALANG_POE_MONTHS.get(hijri_month)
    pernaasan_dates = PERNAASAN.get(hijri_month, [])
    is_pernaasan = hijri["day"] in pernaasan_dates
    is_forbidden = bool(month_rule and day_name in month_rule["forbidden_days"])
    is_safe_day = bool(month_rule and day_name in month_rule["safe_days"])

    status = "NORMAL"
    if is_pernaasan or is_forbidden:
        status = "NAAS"
    elif is_safe_day:
        status = "SELAMET"

    jaya_apes = calculate_jaya_apes(day_name, naktu_wedal)

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
            "hijri": {"day": hijri["day"], "month": hijri["month_name"], "year": hijri["year"]},
            "wuku": jawa["wuku"],
        },
        "naktu": {
            "hari": day_naktu,
            "pasaran": pasaran_naktu,
            "wedal": naktu_wedal,
            "formula": f"{day_naktu} + {pasaran_naktu} = {naktu_wedal}",
        },
        "gagalang_poe": {
            "hari": day_name,
            "watek": gagalang_poe,
            "month_patokan": gagalang_poe_month,
            "status": "VERIFIED" if gagalang_poe_month else ("SOURCE_DATA" if gagalang_poe else "UNKNOWN"),
            "source": {
                "name": "PARIRIMBON SUNDA (JAWA BARAT)",
                "section": "Gagalang poe / Babalang Dua / 12 Watek Patokan",
                "note": "The source table pairs each of the 12 month patokan with a fixed weekday and Watek. The current calendar weekday is retained separately; the month patokan is the source-backed Gagalang Poe result.",
            },
        },
        "gagalang": {
            "pasaran": pasaran_name,
            "next_pasaran": gagalang["next_pasaran"] if gagalang else None,
            "direction": gagalang["direction"] if gagalang else None,
            "status": "VERIFIED" if gagalang else "UNKNOWN",
            "source": {
                "name": "PARIRIMBON SUNDA (JAWA BARAT)",
                "section": "Gagalang poe dan gagalang manis pahing",
                "note": "Arah keberuntungan pasaran mengikuti rotasi Timur, Selatan, Barat, Utara, Tengah.",
            },
        },
        "watek_patokan": {
            "month": hijri_month,
            "ordinal": watek_patokan["ordinal"] if watek_patokan else None,
            "watek": watek_patokan["watek"] if watek_patokan else None,
            "status": "VERIFIED" if watek_patokan else "UNKNOWN",
            "source": {
                "name": "PARIRIMBON SUNDA (JAWA BARAT)",
                "section": "Gagalang poe / 12 Watek Patokan",
                "note": "Dua belas patokan menunjukkan nama bulan selama satu tahun secara beraturan.",
            },
        },
        "pernaasan": {
            "month": hijri_month,
            "dates": pernaasan_dates,
            "is_today": is_pernaasan,
            "status": "SOURCE_COMPILED",
            "note": "Some published transcriptions contain OCR/variant discrepancies; values are preserved as transcribed.",
        },
        "jaya_apes": {
            "status": jaya_apes["status"],
            "hari": day_name,
            "pasaran": pasaran_name,
            "wedal": naktu_wedal,
            "jaya": jaya_apes["jaya"],
            "apes": jaya_apes["apes"],
            "jaya_index": jaya_apes["jaya_index"],
            "apes_index": jaya_apes["apes_index"],
            "source": {
                "name": "CAKRA LANGIT · PALINTANGAN SUNDA",
                "status": jaya_apes["status"],
                "note": jaya_apes["source_note"],
            },
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
            {"step": 4, "rule": "gagalang_poe", "input": {"hari": day_name, "bulan": hijri_month}, "result": gagalang_poe_month},
            {"step": 5, "rule": "gagalang_pasaran", "input": pasaran_name, "result": {"next_pasaran": gagalang["next_pasaran"] if gagalang else None, "direction": gagalang["direction"] if gagalang else None}},
            {"step": 6, "rule": "watek_patokan", "input": {"bulan_hijriah": hijri_month}, "result": {"ordinal": watek_patokan["ordinal"] if watek_patokan else None, "watek": watek_patokan["watek"] if watek_patokan else None}},
            {"step": 7, "rule": "jaya_apes_cakra_langit", "input": {"hari": day_name, "pasaran": pasaran_name, "wedal": naktu_wedal}, "result": {"formula_jaya": f"{naktu_wedal} mod 7", "formula_apes": f"({naktu_wedal} - 2) mod 7", "jaya": jaya_apes["jaya"], "apes": jaya_apes["apes"], "status": jaya_apes["status"]}},
            {"step": 8, "rule": "kala_navigation", "input": {"bulan_hijriah": hijri_month, "hari": day_name}, "result": {"pantangan": is_forbidden, "keselamatan": is_safe_day, "arah_rizki": month_rule["rizki_direction"] if month_rule else None}},
        ],
    }
