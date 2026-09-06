from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


DayBoundary = Literal["MIDNIGHT", "ZI_HOUR_23"]


@dataclass(frozen=True)
class BaziPolicy:
    day_boundary: DayBoundary = "MIDNIGHT"


def normalize_bazi(raw: dict, policy: BaziPolicy | None = None) -> dict:
    """
    Normalize raw lunar-javascript output into the CakraLangit BaZi contract.

    Year and Month use exact JieQi boundaries.
    Day boundary is explicit:
      - MIDNIGHT: standard calendar-day boundary
      - ZI_HOUR_23: Zi-hour boundary at 23:00

    The engine's eightChar string is intentionally not used as SSOT.
    """

    policy = policy or BaziPolicy()

    raw_year = raw["year"]
    raw_month = raw["month"]
    raw_day = raw["day"]
    raw_hour = raw["hour"]

    if policy.day_boundary == "MIDNIGHT":
        selected_day = raw_day["ganzhi"]
    elif policy.day_boundary == "ZI_HOUR_23":
        selected_day = raw_day["exact"]
    else:
        raise ValueError(
            f"Unsupported day boundary policy: {policy.day_boundary}"
        )

    selected_year = raw_year["exact"]
    selected_month = raw_month["exact"]

    return {
        "id": "bazi",
        "name": "BaZi",
        "engine": raw.get("engine", "lunar-javascript"),
        "input": raw["input"],
        "pillars": {
            "year": {
                **raw_year,
                "selected": selected_year,
            },
            "month": {
                **raw_month,
                "selected": selected_month,
            },
            "day": {
                **raw_day,
                "selected": selected_day,
            },
            "hour": raw_hour,
        },
        "eightChar": " ".join(
            [
                selected_year,
                selected_month,
                selected_day,
                raw_hour["ganzhi"],
            ]
        ),
        "policy": {
            "dayBoundary": policy.day_boundary,
        },
        "meta": {
            "engine": raw.get("engine", "lunar-javascript"),
            "runtime": raw.get("meta", {}).get("runtime", "node"),
            "boundary": policy.day_boundary,
        },
    }
