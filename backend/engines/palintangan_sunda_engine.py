from datetime import date

from engines.calendar_engine import get_calendar_data
from engines.hijri_engine import get_hijri_data


SOURCE_ID = "SSOT-PARIRIMBON-JABAR"
SOURCE_TITLE = "PARIRIMBON SUNDA (JAWA BARAT).pdf"

PASARAN_NAKTU = {
    "Kaliwon": 8,
    "Manis": 5,
    "Legi": 5,
    "Pahing": 9,
    "Pon": 7,
    "Wage": 4,
}

# Naktu Bulan/Tahun are the four-component Naktu table described on
# Paririmbon Sunda p.51-52. "Sapar" and "Jumadilakhir" are normalized
# from the same source table; year aliases follow the source terminology.
BULAN_NAKTU = {
    "Muharram": 7,
    "Muharam": 7,
    "Safar": 2,
    "Sapar": 2,
    "Rabiulawal": 3,
    "Mulud": 3,
    "Rabiulakhir": 5,
    "Silihmulud": 5,
    "Silih Mulud": 5,
    "Jumadilawal": 6,
    "Jumadilakhir": 1,
    "Rajab": 2,
    "Sya'ban": 4,
    "Rewah": 4,
    "Ramadan": 5,
    "Puasa": 5,
    "Syawal": 7,
    "Sawal": 7,
    "Zulkaidah": 1,
    "Hapit": 1,
    "Zulhijah": 3,
    "Rayagung": 3,
}

TAHUN_NAKTU = {
    "Alip": 1,
    "Ehe": 5,
    "Jimawal": 3,
    "Jim": 3,
    "Je": 7,
    "Dal": 4,
    "Be": 2,
    "Wawu": 6,
    "Wau": 6,
    "Jimakir": 3,
    "Jim akhir": 3,
}

WATEK_HARI = {
    "Jemuwah": ["Karang Piwulang"],
    "Jumaah": ["Karang Piwulang"],
    "Setu": ["Sumur Pinungkeb", "Karang Tinangtang"],
    "Saptu": ["Sumur Pinungkeb", "Karang Tinangtang"],
    "Ngahad": ["Macan Katawang", "Nuju Pati"],
    "Ahad": ["Macan Katawang", "Nuju Pati"],
    "Senen": ["Nuju Padu"],
    "Selasa": ["Mantri Sinarreja"],
    "Rebo": ["Demang Kanduruwan", "Putri Tinurung"],
    "Kemis": ["Demang Palasah", "Alas Kobar"],
}

GAGALANG_MANIS_PAHING = {
    "Kaliwon": {"next": "Manis", "direction": "Timur"},
    "Legi": {"next": "Pahing", "direction": "Selatan"},
    "Manis": {"next": "Pahing", "direction": "Selatan"},
    "Pahing": {"next": "Pon", "direction": "Barat"},
    "Pon": {"next": "Wage", "direction": "Utara"},
    "Wage": {"next": "Kaliwon", "direction": "Tengah-tengah"},
}

MONTH_GROUPS = {
    "Muharram": {
        "aliases": ["Muharram", "Muharam"],
        "pantangan": ["Setu", "Ngahad"],
        "keselamatan": ["Rebo", "Kemis"],
        "rizki_direction": "Tenggara",
    },
    "Safar": {
        "aliases": ["Safar", "Sapar"],
        "pantangan": ["Setu", "Ngahad"],
        "keselamatan": ["Rebo", "Kemis"],
        "rizki_direction": "Tenggara",
    },
    "Rabiulawal": {
        "aliases": ["Rabiulawal", "Mulud"],
        "pantangan": ["Setu", "Ngahad"],
        "keselamatan": ["Rebo", "Kemis"],
        "rizki_direction": "Tenggara",
    },
    "Rabiulakhir": {
        "aliases": ["Rabiulakhir", "Silih Mulud"],
        "pantangan": ["Senen", "Selasa"],
        "keselamatan": ["Jemuwah"],
        "rizki_direction": "Barat Daya",
    },
    "Jumadilawal": {
        "aliases": ["Jumadilawal"],
        "pantangan": ["Senen", "Selasa"],
        "keselamatan": ["Jemuwah"],
        "rizki_direction": "Barat Daya",
    },
    "Jumadilakhir": {
        "aliases": ["Jumadilakhir"],
        "pantangan": ["Senen", "Selasa"],
        "keselamatan": ["Jemuwah"],
        "rizki_direction": "Barat Daya",
    },
    "Rajab": {
        "aliases": ["Rajab"],
        "pantangan": ["Rebo", "Kemis"],
        "keselamatan": ["Setu", "Ngahad"],
        "rizki_direction": "Barat Laut",
    },
    "Sya'ban": {
        "aliases": ["Sya'ban", "Rewah"],
        "pantangan": ["Rebo", "Kemis"],
        "keselamatan": ["Setu", "Ngahad"],
        "rizki_direction": "Barat Laut",
    },
    "Ramadan": {
        "aliases": ["Ramadan", "Puasa"],
        "pantangan": ["Rebo", "Kemis"],
        "keselamatan": ["Setu", "Ngahad"],
        "rizki_direction": "Barat Laut",
    },
    "Syawal": {
        "aliases": ["Syawal", "Sawal"],
        "pantangan": ["Jemuwah"],
        "keselamatan": ["Senen", "Selasa"],
        "rizki_direction": "Timur Laut",
    },
    "Zulkaidah": {
        "aliases": ["Zulkaidah", "Dulkaidah", "Hapit"],
        "pantangan": ["Jemuwah"],
        "keselamatan": ["Senen", "Selasa"],
        "rizki_direction": "Timur Laut",
    },
    "Zulhijah": {
        "aliases": ["Zulhijah", "Rayagung"],
        "pantangan": ["Jemuwah"],
        "keselamatan": ["Senen", "Selasa"],
        "rizki_direction": "Timur Laut",
    },
}

PERNAASAN = {
    "Muharram": [3, 12, 20],
    "Safar": [1, 10, 20],
    "Rabiulawal": [7, 11, 15],
    "Rabiulakhir": [3, 10, 20],
    "Jumadilawal": [5, 10, 11],
    "Jumadilakhir": [3, 10, 14],
    "Rajab": [3, 7, 10],
    "Sya'ban": [1, 11, 20],
    "Ramadan": [9, 20, 29],
    "Syawal": [2, 1, 20],
    "Zulkaidah": [3, 12, 20],
    "Zulhijah": [2, 6, 20],
}

PANCAKA_4 = {
    1: {"name": "Sri", "meaning": "bagus", "context": "rizki"},
    2: {"name": "Kala", "meaning": "jelek", "context": "segala pekerjaan akan apes"},
    3: {"name": "Naga", "meaning": "bagus", "context": "mulai menuai / dapat menyimpan rizki"},
    0: {"name": "Numpi", "meaning": "bagus", "context": "menyimpan padi / diam, tidak banyak pengeluaran"},
}


def _source_meta(location: str):
    return {
        "source_id": SOURCE_ID,
        "source_title": SOURCE_TITLE,
        "location": location,
    }


def _find_month_group(month_name: str):
    for group_name, item in MONTH_GROUPS.items():
        if month_name in item["aliases"]:
            return group_name, item
    return None, None


def calculate_palintangan(target_date: date, timezone_name: str = "Asia/Jakarta"):
    calendars = get_calendar_data(target_date, timezone_name)
    jawa = calendars["jawa"]
    saka_sunda = calendars["sakaSunda"]
    hijri = get_hijri_data(target_date.year, target_date.month, target_date.day)

    day_name = jawa["detail"]["dino"]["name"]
    pasaran = jawa["detail"]["pasaran"]["name"]
    day_naktu = jawa["detail"]["dino"]["neptu"]
    pasaran_naktu = PASARAN_NAKTU.get(pasaran)
    wedal = day_naktu + pasaran_naktu if pasaran_naktu is not None else None

    month_name = hijri["month_name"]
    hijri_day = hijri["day"]
    naktu_bulan = BULAN_NAKTU.get(month_name)
    year_name = jawa["detail"]["tahun"]
    naktu_tahun = TAHUN_NAKTU.get(year_name)
    four_naktu_total = (
        day_naktu + pasaran_naktu + naktu_bulan + naktu_tahun
        if None not in (day_naktu, pasaran_naktu, naktu_bulan, naktu_tahun)
        else None
    )
    month_group_name, month_rule = _find_month_group(month_name)

    pernaasan_dates = PERNAASAN.get(month_group_name or month_name, [])
    is_pernaasan = hijri_day in pernaasan_dates

    watek = WATEK_HARI.get(day_name, [])
    gagalang = GAGALANG_MANIS_PAHING.get(pasaran)

    gregorian_remainder = target_date.day % 4
    pancaka4 = PANCAKA_4[gregorian_remainder]

    return {
        "date": target_date.isoformat(),
        "calendar": {
            "day": day_name,
            "pasaran": pasaran,
            "wuku": jawa["detail"]["wuku"]["name"],
            "wuku_day": jawa["detail"]["wuku"]["day_in_wuku"],
            "saka_sunda": {
                "day": saka_sunda["meta"].get("day", saka_sunda["fields"][0]["v"]),
                "month": saka_sunda["meta"].get("monthName", saka_sunda["headline"]),
                "year": saka_sunda["meta"].get("year", saka_sunda["headline"]),
                "year_type": saka_sunda["sub"],
            },
            "hijri": {
                "day": hijri_day,
                "month": month_name,
                "year": hijri["year"],
            },
        },
        "naktu": {
            "hari": day_naktu,
            "pasaran": pasaran_naktu,
            "bulan": naktu_bulan,
            "tahun": naktu_tahun,
            "wedal": wedal,
            "four_component_total": four_naktu_total,
            "four_component_status": "IMPLEMENTED",
            "four_component_note": "Jumlah empat naktu; interpretasi baik/buruk tetap context-specific.",
        },
        "gagalang": {
            "pasaran": pasaran,
            "next_pasaran": gagalang["next"] if gagalang else None,
            "direction": gagalang["direction"] if gagalang else None,
            "source": _source_meta("naskah p.21 / p.36"),
        },
        "watek": {
            "hari": day_name,
            "names": watek,
            "source": _source_meta("naskah p.21 / p.36"),
        },
        "monthly_rule": {
            "group": month_group_name,
            "pantangan": month_rule["pantangan"] if month_rule else None,
            "keselamatan": month_rule["keselamatan"] if month_rule else None,
            "rizki_direction": month_rule["rizki_direction"] if month_rule else None,
            "today_is_pantangan": day_name in (month_rule["pantangan"] if month_rule else []),
            "today_is_keselamatan": day_name in (month_rule["keselamatan"] if month_rule else []),
            "source": _source_meta("naskah p.21 / p.36"),
        },
        "pernaasan": {
            "month": month_name,
            "dates": pernaasan_dates,
            "hijri_day": hijri_day,
            "is_pernaasan": is_pernaasan,
            "source": _source_meta("naskah p.21 / p.67"),
        },
        "pancaka_4": {
            "input_day_of_month": target_date.day,
            "remainder": gregorian_remainder,
            "result": pancaka4["name"],
            "meaning": pancaka4["meaning"],
            "context": pancaka4["context"],
            "source": _source_meta("naskah p.80"),
        },
        "meta": {
            "status": "PARTIAL_ENGINE",
            "source_policy": "PARIRIMBON SUNDA is SSOT; UGA KALA excluded.",
        },
    }
