from datetime import date, datetime, time, timedelta


KALACAKRA_NAMES = [
    "I",
    "Eu",
    "U",
    "Ga",
    "Sa",
    "Ca",
    "Ka",
    "La",
    "Guna",
    "Ra",
    "Ja",
    "Tha",
    "Cakra",
    "Pra",
    "Hyang",
    "Nga",
    "E",
    "Nya",
    "É",
    "Ta",
    "Tri",
    "Ya",
    "Na",
    "Ba",
    "O",
    "A",
    "Da",
    "Ma",
    "Pa",
    "Dha",
    "Sri",
    "Ha",
    "Wa",
]

INDUNG = [
    "Ngaherang",
    "Lumenggang",
    "Gumulung",
    "Gumeter",
    "Usik",
    "Malik",
    "Kolot",
    "Ngora",
    "Medal",
    "Tunggal",
    "Siliwangi",
]

POE = [
    "Rahayu",
    "Wangi",
    "Andaya",
    "Waluya",
    "Rumangsa",
    "Galih",
    "Lingga",
    "Gumilang",
    "Guna",
]

UGA = [
    "Kerta",
    "Palangka",
    "Ratu",
    "Purusha",
    "Purwa",
    "Jati",
    "Sandikala",
    "Sunda",
    "Darana",
]

KALA = [
    "Sa-Hyang",
    "Da-Hyang",
    "Ra-Hyang",
]

DAYS_PER_INDUNG = 33
INDUNG_COUNT = 11
FULL_CYCLE = DAYS_PER_INDUNG * INDUNG_COUNT

KALACAKRA_ANCHOR = date(2024, 8, 17)


def mod(value, divisor):
    return ((value % divisor) + divisor) % divisor


def get_absolute_day(value):
    """
    Preserve the V1 Kalacakra boundary:

    00:00–11:59 belongs to the previous
    Kalacakra day.

    The anchor date is 17 August 2024.
    """

    if isinstance(value, datetime):
        working_date = value.date()

        if value.hour < 12:
            working_date -= timedelta(days=1)
    elif isinstance(value, date):
        working_date = value
    else:
        raise TypeError("Kalacakra requires a date or datetime")

    return (working_date - KALACAKRA_ANCHOR).days


def get_kalacakra_calendar(instant):
    effective_date = instant

    absolute_day = get_absolute_day(effective_date)

    cycle_day = mod(
        absolute_day,
        FULL_CYCLE,
    )

    indung_index = cycle_day // DAYS_PER_INDUNG

    date_index = mod(
        absolute_day,
        DAYS_PER_INDUNG,
    )

    poe_index = mod(
        absolute_day,
        len(POE),
    )

    kala_index = mod(
        absolute_day,
        len(KALA),
    )

    return {
        "indung": INDUNG[indung_index],
        "indungIndex": indung_index,
        "number": date_index + 1,
        "name": KALACAKRA_NAMES[date_index],
        "poe": POE[poe_index],
        "uga": UGA[poe_index],
        "kala": KALA[kala_index],
        "absoluteDay": absolute_day,
        "cycleDay": cycle_day,
        "cyclePosition": date_index + 1,
        "effectiveDate": effective_date,
        "boundary": "NOON",
        "meta": {
            "engine": "Kalacakra",
            "phase": "SOURCE_PORTED",
            "cycle": FULL_CYCLE,
            "daysPerIndung": DAYS_PER_INDUNG,
            "indungCount": INDUNG_COUNT,
            "dateCycle": len(KALACAKRA_NAMES),
            "poeCycle": len(POE),
            "kalaCycle": len(KALA),
            "anchor": {
                "date": KALACAKRA_ANCHOR.isoformat(),
                "absoluteDay": 0,
                "indung": "Ngaherang",
                "number": 1,
                "name": "I",
            },
            "indungIndex": indung_index,
            "dateIndex": date_index,
            "poeIndex": poe_index,
            "kalaIndex": kala_index,
            "transitionTime": "12:00",
        },
    }
