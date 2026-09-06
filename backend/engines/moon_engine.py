import math
from datetime import date, timedelta

SYNODIC_MONTH = 29.53058867
REFERENCE_NEW_MOON = date(2000, 1, 6)

MOON_PHASES = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
]

def _moon_age(target_date: date):
    return ((target_date - REFERENCE_NEW_MOON).days - 0.28) % SYNODIC_MONTH

def next_full_moon(target_date: date):
    age = _moon_age(target_date)
    days_until = (SYNODIC_MONTH / 2) - age

    if days_until <= 0:
        days_until += SYNODIC_MONTH

    return target_date + timedelta(days=math.ceil(days_until))

def get_moon_data(target_date: date):
    age = _moon_age(target_date)
    illumination = (
        (1 - math.cos(2 * math.pi * age / SYNODIC_MONTH)) / 2
    ) * 100
    phase_index = int((age / SYNODIC_MONTH) * 8 + 0.5) % 8

    full_moon = next_full_moon(target_date)

    return {
        "phase": MOON_PHASES[phase_index],
        "age": round(age, 2),
        "illumination": round(illumination),
        "next_full_moon": full_moon.isoformat(),
    }
