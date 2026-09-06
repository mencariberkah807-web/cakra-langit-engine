from datetime import date

from astral import LocationInfo
from astral.sun import golden_hour, sun, SunDirection


def _fmt(value):
    return value.strftime("%H:%M")


def get_solar_data(
    latitude: float,
    longitude: float,
    timezone: str,
    city: str = "",
    region: str = "",
    target_date: date | None = None,
):
    if target_date is None:
        target_date = date.today()

    location = LocationInfo(
        city or "Location",
        region or "",
        timezone,
        latitude,
        longitude,
    )

    solar = sun(
        location.observer,
        date=target_date,
        tzinfo=timezone,
    )

    golden = list(
        golden_hour(
            location.observer,
            direction=SunDirection.SETTING,
            date=target_date,
            tzinfo=timezone,
        )
    )

    return {
        "dawn": _fmt(solar["dawn"]),
        "sunrise": _fmt(solar["sunrise"]),
        "noon": _fmt(solar["noon"]),
        "sunset": _fmt(solar["sunset"]),
        "dusk": _fmt(solar["dusk"]),
        "golden_hour": _fmt(golden[0]) if golden else None,
    }
