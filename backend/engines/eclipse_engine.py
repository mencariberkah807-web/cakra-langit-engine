from datetime import date

ECLIPSES = [
    {
        "date": date(2026, 2, 17),
        "type": "Annular Solar Eclipse",
        "visibility": False,
    },
    {
        "date": date(2026, 3, 3),
        "type": "Total Lunar Eclipse",
        "visibility": True,
    },
    {
        "date": date(2026, 8, 12),
        "type": "Total Solar Eclipse",
        "visibility": False,
    },
    {
        "date": date(2026, 8, 28),
        "type": "Partial Lunar Eclipse",
        "visibility": False,
    },
]


def get_eclipse_data(target_date: date):
    today = None
    upcoming = None

    for eclipse in ECLIPSES:
        if eclipse["date"] == target_date:
            today = eclipse
        elif eclipse["date"] > target_date and upcoming is None:
            upcoming = eclipse

    return {
        "today": today,
        "next": upcoming,
    }
