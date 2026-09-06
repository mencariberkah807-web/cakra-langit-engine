from hijridate import Gregorian


HIJRI_MONTHS = [
    "Muharram",
    "Safar",
    "Rabiulawal",
    "Rabiulakhir",
    "Jumadilawal",
    "Jumadilakhir",
    "Rajab",
    "Sya'ban",
    "Ramadan",
    "Syawal",
    "Zulkaidah",
    "Zulhijah",
]


def get_hijri_data(year: int, month: int, day: int):
    h = Gregorian(year, month, day).to_hijri()

    return {
        "year": h.year,
        "month": h.month,
        "day": h.day,
        "month_name": HIJRI_MONTHS[h.month - 1],
        "system": "Ummul Qura",
        "effectiveDate": f"{year:04d}-{month:02d}-{day:02d}",
        "boundary": "MIDNIGHT",
        "meta": {
            "engine": "Hijri",
            "phase": "SOURCE_EXISTING",
            "calendar": "ummul-qura",
        },
    }
