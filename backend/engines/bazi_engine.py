import json
import subprocess
from datetime import datetime
from pathlib import Path

from engines.bazi.bazi_normalizer import BaziPolicy, normalize_bazi


PROJECT_ROOT = Path(__file__).resolve().parents[2]

WORKER = (
    PROJECT_ROOT
    / "backend"
    / "engines"
    / "bazi"
    / "bazi_worker.mjs"
)


def get_bazi_data(
    year: int,
    month: int,
    day: int,
    hour: int = 0,
    minute: int = 0,
    second: int = 0,
    day_boundary: str = "MIDNIGHT",
):
    datetime(year, month, day, hour, minute, second)

    payload = {
        "year": year,
        "month": month,
        "day": day,
        "hour": hour,
        "minute": minute,
        "second": second,
    }

    completed = subprocess.run(
        [
            "node",
            str(WORKER),
            json.dumps(payload, ensure_ascii=False),
        ],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )

    if completed.returncode != 0:
        raise RuntimeError(
            completed.stderr.strip() or "BaZi engine failed"
        )

    try:
        raw = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "BaZi engine returned invalid JSON"
        ) from exc

    raw["engine"] = "lunar-javascript"

    normalized = normalize_bazi(
        raw,
        BaziPolicy(day_boundary=day_boundary),
    )

    return normalized
