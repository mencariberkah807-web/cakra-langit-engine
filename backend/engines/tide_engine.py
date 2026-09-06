from datetime import date, datetime, timedelta
from math import sin, pi
from zoneinfo import ZoneInfo


# Approximate mean tidal period. This engine intentionally provides
# astronomical estimates, not official station observations.
TIDAL_PERIOD_HOURS = 12.42

# Reference high tide used only as a deterministic astronomical phase anchor.
REFERENCE_HIGH = datetime(2024, 1, 1, 0, 0)


def _hours_since_reference(local_midnight):
    naive = local_midnight.replace(tzinfo=None)
    return (naive - REFERENCE_HIGH).total_seconds() / 3600


def _estimate_height(hours_from_high, latitude, longitude):
    """
    Approximate tidal range modulation.

    This is deliberately conservative: without local harmonic constituents,
    the result is an astronomical estimate rather than a station-grade height.
    """
    phase = (2 * pi * hours_from_high) / TIDAL_PERIOD_HOURS
    latitude_factor = 0.75 + 0.25 * abs(sin(latitude * pi / 180))
    longitude_factor = 0.9 + 0.1 * sin(longitude * pi / 180)

    amplitude = 0.65 * latitude_factor * longitude_factor
    mean_level = 0.95

    return mean_level + amplitude * sin(phase)


def get_tide_data(location, target_date: date, timezone_name: str):
    coastal = location.get("coastal")

    city = (
        location.get("city")
        or location.get("name")
        or "Location not configured"
    )
    region = (
        location.get("province")
        or city
        or location.get("country")
    )

    if coastal is not True:
        return {
            "region": region,
            "location": city,
            "timezone": timezone_name,
            "high": [],
            "low": [],
            "events": [],
            "model": "astronomical-estimate",
            "configured": False,
            "available": False,
            "reason": "Location is not configured as coastal.",
        }

    tz = ZoneInfo(timezone_name)

    local_midnight = datetime(
        target_date.year,
        target_date.month,
        target_date.day,
        0,
        0,
        tzinfo=tz,
    )

    longitude = float(location.get("longitude") or 0)
    latitude = float(location.get("latitude") or 0)

    # Longitude shifts the approximate tidal phase geographically.
    longitude_hours = longitude / 15.0
    base_hours = _hours_since_reference(local_midnight) + longitude_hours

    events = []

    # Search the local day in hourly increments, then refine each
    # turning point using a quadratic interpolation around the local
    # maximum/minimum. This keeps the output deterministic without
    # introducing a new dependency.
    samples = []
    for minute in range(0, 24 * 60 + 61, 60):
        instant = local_midnight + timedelta(minutes=minute)
        hours = base_hours + minute / 60
        height = _estimate_height(hours, latitude, longitude)
        samples.append((instant, height))

    for index in range(1, len(samples) - 1):
        prev_time, prev_height = samples[index - 1]
        current_time, current_height = samples[index]
        next_time, next_height = samples[index + 1]

        is_high = current_height >= prev_height and current_height >= next_height
        is_low = current_height <= prev_height and current_height <= next_height

        if not (is_high or is_low):
            continue

        denominator = prev_height - 2 * current_height + next_height

        if denominator:
            offset = 0.5 * (prev_height - next_height) / denominator
            offset = max(-0.5, min(0.5, offset))
        else:
            offset = 0

        event_time = current_time + timedelta(hours=offset)
        event_height = _estimate_height(
            base_hours + (event_time - local_midnight).total_seconds() / 3600,
            latitude,
            longitude,
        )

        events.append(
            {
                "type": "HIGH" if is_high else "LOW",
                "time": event_time.isoformat(),
                "height_m": round(event_height, 2),
            }
        )

    events = events[:4]

    high = [event for event in events if event["type"] == "HIGH"]
    low = [event for event in events if event["type"] == "LOW"]

    return {
        "region": region,
        "location": city,
        "timezone": timezone_name,
        "high": high,
        "low": low,
        "events": events,
        "model": "astronomical-estimate",
        "configured": True,
    }
