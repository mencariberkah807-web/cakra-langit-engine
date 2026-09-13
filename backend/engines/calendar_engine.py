from datetime import date, datetime
from zoneinfo import ZoneInfo

from engines.hijri_engine import get_hijri_data
from engines.jawa_engine import get_jawa_data
from engines.saka_sunda_engine import get_saka_sunda_calendar
from engines.chinese_lunar_engine import get_chinese_lunar_calendar
from engines.bali_engine import get_bali_calendar
from engines.pararasan_engine import get_pararasan_variants
from engines.kalacakra_engine import get_kalacakra_calendar


DINO_NEPTU = {
    "Senen": 4,
    "Selasa": 3,
    "Rebo": 7,
    "Kemis": 8,
    "Jemuwah": 6,
    "Setu": 9,
    "Ngahad": 5,
}

PASARAN_NEPTU = {
    "Legi": 5,
    "Pahing": 9,
    "Pon": 7,
    "Wage": 4,
    "Kliwon": 8,
}

DAYS_ID = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
]


def get_calendar_data(
    target_date: date,
    timezone_name: str = "Asia/Jakarta",
    local_datetime: datetime | None = None,
    solar: dict | None = None,
):
    local_datetime = local_datetime or datetime(
        target_date.year,
        target_date.month,
        target_date.day,
        12,
        0,
        tzinfo=ZoneInfo(timezone_name),
    )

    if local_datetime.tzinfo is None:
        local_datetime = local_datetime.replace(
            tzinfo=ZoneInfo(timezone_name)
        )

    jawa_effective_date = target_date
    sunset_applied = False

    sunset_value = (solar or {}).get("sunset")

    if sunset_value:
        try:
            sunset_hour, sunset_minute = (
                int(part)
                for part in sunset_value.split(":", 1)
            )
            sunset_datetime = local_datetime.replace(
                hour=sunset_hour,
                minute=sunset_minute,
                second=0,
                microsecond=0,
            )

            if local_datetime >= sunset_datetime:
                from datetime import timedelta
                jawa_effective_date = target_date + timedelta(days=1)
                sunset_applied = True
        except (ValueError, TypeError):
            pass

    hijri = get_hijri_data(
        target_date.year,
        target_date.month,
        target_date.day,
    )

    jawa = get_jawa_data(jawa_effective_date)
    saka_sunda = get_saka_sunda_calendar(target_date)
    chinese_lunar = get_chinese_lunar_calendar(target_date)
    bali = get_bali_calendar(target_date)
    pararasan_variants = get_pararasan_variants()
    kalacakra = get_kalacakra_calendar(local_datetime)

    dino_neptu = DINO_NEPTU[jawa["dayName"]]
    pasaran_neptu = PASARAN_NEPTU[jawa["pasaran"]]
    neptu_total = dino_neptu + pasaran_neptu

    pawukon_day = jawa["pawukonDay"]
    wuku_index = ((pawukon_day - 1) // 7) + 1
    day_in_wuku = ((pawukon_day - 1) % 7) + 1

    return {
        "bali": {
            "id": "bali",
            "name": "Bali",
            "headline": f"{bali['saptawara']} {bali['pancawara']}",
            "sub": bali["wuku"],
            "fields": [
                {"k": "Saptawara", "v": bali["saptawara"]},
                {"k": "Pancawara", "v": bali["pancawara"]},
                {"k": "Wuku", "v": bali["wuku"]},
                {"k": "Hari Wuku", "v": str(bali["dayInWuku"])},
                {"k": "Pawukon Day", "v": str(bali["pawukonDay"])},
                {"k": "Lintang", "v": bali["lintang"]},
                {"k": "Padangon", "v": bali["padangon"]},
                {"k": "Panca Sudha", "v": bali["pancaSudha"]},
                {"k": "Rakam", "v": bali["rakam"]},
            ],
            "effectiveDate": bali["effectiveDate"],
            "boundary": bali["boundary"],
            "detail": {
                "lintang": bali["lintang"],
                "lintangIndex": bali["lintangIndex"],
                "padangon": bali["padangon"],
                "padangonIndex": bali["padangonIndex"],
                "saptawara": bali["saptawara"],
                "pancawara": bali["pancawara"],
                "wuku": bali["wuku"],
                "pawukonDay": bali["pawukonDay"],
                "pancaSudha": bali["pancaSudha"],
                "pancaSudhaIndex": bali["pancaSudhaIndex"],
                "rakam": bali["rakam"],
                "rakamIndex": bali["rakamIndex"],
                "pararasanVariants": pararasan_variants,
            },
            "meta": {
                **bali["meta"],
                "saptawara": bali["saptawara"],
                "pancawara": bali["pancawara"],
                "wuku": bali["wuku"],
                "dayInWuku": bali["dayInWuku"],
                "pawukonDay": bali["pawukonDay"],
                "lintang": bali["lintang"],
                "lintangIndex": bali["lintangIndex"],
                "padangon": bali["padangon"],
                "padangonIndex": bali["padangonIndex"],
                "pancaSudha": bali["pancaSudha"],
                "pancaSudhaIndex": bali["pancaSudhaIndex"],
                "rakam": bali["rakam"],
                "rakamIndex": bali["rakamIndex"],
                "pararasanVariants": pararasan_variants,
            },
        },
        "kalacakra": {
            "id": "kalacakra",
            "name": "Kalacakra",
            "headline": f"{kalacakra['number']} {kalacakra['name']}",
            "sub": kalacakra["indung"],
            "fields": [
                {"k": "Indung", "v": kalacakra["indung"]},
                {"k": "Tanggal Kalacakra", "v": str(kalacakra["number"])},
                {"k": "Nama Tanggal", "v": kalacakra["name"]},
                {"k": "Poe", "v": kalacakra["poe"]},
                {"k": "Uga", "v": kalacakra["uga"]},
                {"k": "Kala", "v": kalacakra["kala"]},
                {"k": "Hari Absolut Kalacakra", "v": str(kalacakra["absoluteDay"])},
                {"k": "Pergantian Hari", "v": kalacakra["meta"]["transitionTime"]},
            ],
            "effectiveDate": kalacakra["effectiveDate"],
            "boundary": kalacakra["boundary"],
            "meta": {
                **kalacakra["meta"],
                "indung": kalacakra["indung"],
                "number": kalacakra["number"],
                "name": kalacakra["name"],
                "poe": kalacakra["poe"],
                "uga": kalacakra["uga"],
                "kala": kalacakra["kala"],
                "absoluteDay": kalacakra["absoluteDay"],
                "cycleDay": kalacakra["cycleDay"],
                "cyclePosition": kalacakra["cyclePosition"],
            },
        },
        "chineseLunar": {
            "id": "chinese-lunar",
            "name": "Chinese Lunar",
            "headline": (
                f"{chinese_lunar['month']} "
                f"{chinese_lunar['day']}"
            ),
            "sub": (
                f"{chinese_lunar['year']} "
                f"({chinese_lunar['yearName']})"
            ),
            "fields": [
                {"k": "Tahun", "v": str(chinese_lunar["year"])},
                {"k": "Nama Tahun", "v": chinese_lunar["yearName"]},
                {"k": "Bulan", "v": str(chinese_lunar["month"])},
                {"k": "Tanggal", "v": str(chinese_lunar["day"])},
                {"k": "Boundary", "v": chinese_lunar["boundary"]},
            ],
            "effectiveDate": chinese_lunar["effectiveDate"],
            "boundary": chinese_lunar["boundary"],
            "meta": {
                **chinese_lunar["meta"],
                "year": chinese_lunar["year"],
                "yearName": chinese_lunar["yearName"],
                "month": chinese_lunar["month"],
                "day": chinese_lunar["day"],
                "isLeapMonth": chinese_lunar["isLeapMonth"],
            },
        },
        "sakaSunda": {
            "id": "saka-sunda",
            "name": "Saka Sunda",
            "headline": f"{saka_sunda['day']} {saka_sunda['monthName']} {saka_sunda['year']}",
            "sub": saka_sunda["yearType"],
            "fields": [
                {"k": "Tanggal", "v": str(saka_sunda["day"] )},
                {"k": "Bulan", "v": saka_sunda["monthName"]},
                {"k": "Tahun", "v": str(saka_sunda["year"])},
                {"k": "Tipe Tahun", "v": saka_sunda["yearType"]},
            ],
            "effectiveDate": saka_sunda["effectiveDate"],
            "boundary": saka_sunda["boundary"],
            "meta": saka_sunda["meta"],
        },
        "hijri": {
            "id": "hijri",
            "name": "Hijri",
            "headline": f"{hijri['day']} {hijri['month_name']} {hijri['year']} H",
            "sub": hijri["system"],
            "fields": [
                {"k": "Tanggal", "v": str(hijri["day"] )},
                {"k": "Bulan", "v": hijri["month_name"]},
                {"k": "Tahun", "v": f"{hijri['year']} H"},
                {"k": "Hari", "v": DAYS_ID[target_date.weekday()]},
            ],
            "effectiveDate": hijri["effectiveDate"],
            "boundary": hijri["boundary"],
            "meta": hijri["meta"],
        },
        "jawa": {
            "id": "jawa",
            "name": "Jawa",
            "headline": (
                f"{jawa['day']} {jawa['monthName']} "
                f"{jawa['year']} {jawa['yearName']}"
            ),
            "sub": jawa["weton"],
            "fields": [
                {"k": "Weton", "v": jawa["weton"]},
                {"k": "Wuku", "v": jawa["wuku"]},
                {"k": "Tahun", "v": jawa["yearName"]},
                {"k": "Kurup", "v": jawa["kurup"]},
                {"k": "Windu", "v": jawa["windu"]},
                {"k": "Lambang", "v": jawa["lambang"]},
            ],
            "effectiveDate": jawa["effectiveDate"],
            "boundary": "SUNSET",
            "detail": {
                "jawa_date": (
                    f"{jawa['day']} {jawa['monthName']} "
                    f"{jawa['year']}"
                ),
                "tahun": jawa["yearName"],
                "windu": jawa["windu"],
                "dino": {
                    "name": jawa["dayName"],
                    "neptu": dino_neptu,
                },
                "pasaran": {
                    "name": jawa["pasaran"],
                    "neptu": pasaran_neptu,
                },
                "neptu_total": neptu_total,
                "wuku": {
                    "name": jawa["wuku"],
                    "index": wuku_index,
                    "day_in_wuku": day_in_wuku,
                    "pawukon_day": jawa["pawukonDay"],
                },
            },
            "meta": {
                **jawa["meta"],
                "sunsetApplied": sunset_applied,
            },
        },
    }
