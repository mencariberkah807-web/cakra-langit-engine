from datetime import date, datetime, timedelta


MONTHS = [
    {"name": "Kasa", "days": 30},
    {"name": "Karo", "days": 31},
    {"name": "Katiga", "days": 30},
    {"name": "Kapat", "days": 31},
    {"name": "Kalima", "days": 30},
    {"name": "Kanem", "days": 31},
    {"name": "Kapitu", "days": 30},
    {"name": "Kawalu", "days": 31},
    {"name": "Kasanga", "days": 30},
    {"name": "Kadasa", "days": 31},
    {"name": "Hapitlemah", "days": 30},
    {"name": "Hapitkayu", "days": 30},
]


ANCHOR_DATE = date(2011, 12, 22)
ANCHOR_YEAR = 1934


def is_wuntu_year(year: int) -> bool:
    if year % 128 == 0:
        return False
    return year % 4 == 0


def get_year_type(year: int) -> str:
    return "WUNTU" if is_wuntu_year(year) else "WASTU"


def get_year_length(year: int) -> int:
    return 366 if is_wuntu_year(year) else 365


def get_month_length(year: int, month_index: int) -> int:
    if month_index == 11:
        return 31 if is_wuntu_year(year) else 30
    return MONTHS[month_index]["days"]


def get_day_offset(target_date: date) -> int:
    return (target_date - ANCHOR_DATE).days


def get_month_and_day(year: int, day_of_year: int) -> tuple[int, int]:
    remaining = day_of_year

    for month_index in range(len(MONTHS)):
        month_length = get_month_length(year, month_index)

        if remaining < month_length:
            return month_index, remaining + 1

        remaining -= month_length

    raise ValueError(
        f"Invalid Saka Sunda day-of-year: {day_of_year}"
    )


def move_forward(offset: int) -> tuple[int, int, int]:
    year = ANCHOR_YEAR
    remaining = offset

    while remaining >= get_year_length(year):
        remaining -= get_year_length(year)
        year += 1

    month_index, day = get_month_and_day(year, remaining)

    return year, month_index, day


def move_backward(offset: int) -> tuple[int, int, int]:
    year = ANCHOR_YEAR - 1
    remaining = abs(offset) - 1

    while remaining >= get_year_length(year):
        remaining -= get_year_length(year)
        year -= 1

    day_of_year = get_year_length(year) - 1 - remaining
    month_index, day = get_month_and_day(year, day_of_year)

    return year, month_index, day


def get_saka_sunda_calendar(value: date | datetime) -> dict:
    if isinstance(value, datetime):
        target_date = value.date()
    elif isinstance(value, date):
        target_date = value
    else:
        raise TypeError("value must be date or datetime")

    offset = get_day_offset(target_date)

    if offset >= 0:
        year, month_index, day = move_forward(offset)
    else:
        year, month_index, day = move_backward(offset)

    return {
        "year": year,
        "month": month_index,
        "day": day,
        "monthName": MONTHS[month_index]["name"],
        "yearType": get_year_type(year),
        "effectiveDate": target_date.isoformat(),
        "boundary": "MIDNIGHT",
        "meta": {
            "engine": "Saka Sunda",
            "phase": "SOURCE_COMPILED",
            "anchorGregorian": ANCHOR_DATE.isoformat(),
            "anchorYear": ANCHOR_YEAR,
        },
    }
