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

BIRTH_NAGA_DIRECTION = {
    "Ahad": "Utara",
    "Ngahad": "Utara",
    "Minggu": "Utara",
    "Senen": "Timur",
    "Senin": "Timur",
    "Selasa": "Tenggara",
    "Rebo": "Barat Laut",
    "Rabu": "Barat Laut",
    "Kemis": "Barat",
    "Kamis": "Barat",
    "Jemuwah": "Barat Daya",
    "Jumaah": "Barat Daya",
    "Jumat": "Barat Daya",
    "Setu": "Barat",
    "Saptu": "Barat",
    "Sabtu": "Barat",
}

WATEK_HARI = {
    "Jemuwah": ["Karang Piluwang"],
    "Jumaah": ["Karang Piluwang"],
    "Setu": ["Sumur Pinungkeb", "Karang Tinangtang"],
    "Saptu": ["Sumur Pinungkeb", "Karang Tinangtang"],
    "Ngahad": ["Macan Katawang", "Nuju Pati"],
    "Ahad": ["Macan Katawang", "Nuju Pati"],
    "Senen": ["Nuju Padu"],
    "Selasa": ["Mantri Sinareja"],
    "Rebo": ["Demang Kanduruwan", "Putri Tinurung"],
    "Kemis": ["Demang Palasan", "Alas Kobar"],
}

# p.38 gives the numbered Watek entries and their source interpretation.
# Keep the day lookup above for compatibility, but expose the underlying
# data so calculation results carry the actual source meaning.
WATEK_DETAIL = {
    2: {"name": "Karang Piluwang", "meaning": "jelek kepada diri sendiri"},
    3: {"name": "Sumur Pinungkeb", "meaning": "sesak napas bawaannya"},
    4: {"name": "Karang Tinangtang", "meaning": "kuat wataknya baik"},
    5: {"name": "Macan Katawang", "meaning": "baik dilihat orang"},
    6: {"name": "Nuju Pati", "meaning": "jelek akan menemui ajal"},
    7: {"name": "Nuju Padu", "meaning": "jelek suka cerewet"},
    8: {"name": "Mantri Sinareja", "meaning": "jelek suka sakit"},
    9: {"name": "Demang Kanduruwan", "meaning": "paling baik"},
    10: {"name": "Putri Tinurung", "meaning": "banyak yang memberi"},
    11: {"name": "Demang Palasan", "meaning": "tidak mendapat pekerjaan"},
    12: {"name": "Alas Kobar", "meaning": "bakal kebakaran"},
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
        "rizki_direction": "Barat Laut",
    },
    "Jumadilawal": {
        "aliases": ["Jumadilawal"],
        "pantangan": ["Senen", "Selasa"],
        "keselamatan": ["Jemuwah"],
        "rizki_direction": "Barat Laut",
    },
    "Jumadilakhir": {
        "aliases": ["Jumadilakhir"],
        "pantangan": ["Senen", "Selasa"],
        "keselamatan": ["Jemuwah"],
        "rizki_direction": "Barat Laut",
    },
    "Rajab": {
        "aliases": ["Rajab"],
        "pantangan": ["Rebo", "Kemis"],
        "keselamatan": ["Setu", "Ngahad"],
        "rizki_direction": "Barat Daya",
    },
    "Sya'ban": {
        "aliases": ["Sya'ban", "Rewah"],
        "pantangan": ["Rebo", "Kemis"],
        "keselamatan": ["Setu", "Ngahad"],
        "rizki_direction": "Barat Daya",
    },
    "Ramadan": {
        "aliases": ["Ramadan", "Puasa"],
        "pantangan": ["Rebo", "Kemis"],
        "keselamatan": ["Setu", "Ngahad"],
        "rizki_direction": "Barat Daya",
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

PARINGKELAN = [
    "Tungle",
    "Aryang",
    "Warukung",
    "Paningron",
    "Umwas",
    "Mawulu",
]


MANGSA_DURATION_DAYS = {
    "Kasa": 41,
    "Karo": 23,
    "Katilu": 24,
    "Kaopat": 25,
    "Kalima": 27,
    "Kagenep": 43,
    "Kapitu": 43,
    "Kawolu": 26,
    "Kasasanga": 25,
    "Kasapuluh": 24,
    "Kasabelas": 23,
    "Kasaduabelas": 41,
}

MANGSA = [
    ("Kasa", 6, 22),
    ("Karo", 8, 2),
    ("Katilu", 8, 25),
    ("Kaopat", 9, 18),
    ("Kalima", 10, 13),
    ("Kagenep", 11, 8),
    ("Kapitu", 12, 22),
    ("Kawolu", 2, 3),
    ("Kasasanga", 3, 1),
    ("Kasapuluh", 3, 26),
    ("Kasabelas", 4, 19),
    ("Kasaduabelas", 5, 12),
]


def _get_mangsa(target_date: date):
    month_day = (target_date.month, target_date.day)
    starts = [(m, d, name) for name, m, d in MANGSA]
    candidates = [(m, d, name) for m, d, name in starts if (m, d) <= month_day]
    if candidates:
        _, _, name = max(candidates)
        return name
    return "Kasaduabelas"


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

    mangsa = _get_mangsa(target_date)

    pernaasan_dates = PERNAASAN.get(month_group_name or month_name, [])
    is_pernaasan = hijri_day in pernaasan_dates

    watek = WATEK_HARI.get(day_name, [])
    gagalang = GAGALANG_MANIS_PAHING.get(pasaran)

    pawukon_day = jawa["detail"]["wuku"]["pawukon_day"]
    paringkelan_index = (pawukon_day - 1) % 6
    paringkelan = PARINGKELAN[paringkelan_index]

    return {
        "date": target_date.isoformat(),
        "calendar": {
            "day": day_name,
            "pasaran": pasaran,
            "wuku": jawa["detail"]["wuku"]["name"],
            "wuku_day": jawa["detail"]["wuku"]["day_in_wuku"],
            "pawukon_day": pawukon_day,
            "paringkelan": {
                "name": paringkelan,
                "index": paringkelan_index + 1,
                "cycle": 6,
                "source": _source_meta("naskah cycle 7 × 5 × 6 × 30"),
            },
            "mangsa": {
                "name": mangsa,
                "duration_days": MANGSA_DURATION_DAYS.get(mangsa),
                "source": _source_meta("naskah p.115"),
            },
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
            "entries": [
                WATEK_DETAIL[item]
                for item in watek
                for _naktu, _item in WATEK_DETAIL.items()
                if _item["name"] == item
            ],
            "source": _source_meta("naskah p.21 / p.36; makna naskah p.38"),
        },
        "birth_context": {
            "naga_direction": BIRTH_NAGA_DIRECTION.get(day_name),
            "source": _source_meta("naskah p.90"),
            "status": "SOURCE_DATA",
            "note": "Arah tempat naga menurut hari kelahiran; ini adalah data tradisional sumber, bukan aturan arah perjalanan universal.",
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
        "meta": {
            "status": "IMPLEMENTED_BASE_LAYER",
            "source_policy": "PARIRIMBON SUNDA is SSOT; UGA KALA excluded.",
        },
    }
