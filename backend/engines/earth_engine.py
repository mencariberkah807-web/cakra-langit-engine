from datetime import date


def get_earth_data(target_date: date):
    day_of_year = target_date.timetuple().tm_yday

    days_in_year = 366 if (
        target_date.year % 4 == 0 and
        (target_date.year % 100 != 0 or target_date.year % 400 == 0)
    ) else 365

    annual_pct = round((day_of_year / days_in_year) * 100, 1)

    return {
        "day_of_year": day_of_year,
        "annual_pct": annual_pct,
    }
