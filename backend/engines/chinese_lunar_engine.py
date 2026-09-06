import json
import subprocess
from datetime import date, datetime
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
WORKER = PROJECT_ROOT / "engines" / "bazi" / "chinese_lunar_worker.mjs"


def get_chinese_lunar_calendar(value: date | datetime) -> dict:
    if isinstance(value, datetime):
        target = value
    elif isinstance(value, date):
        target = datetime(
            value.year,
            value.month,
            value.day,
        )
    else:
        raise TypeError("value must be date or datetime")

    payload = {
        "year": target.year,
        "month": target.month,
        "day": target.day,
        "hour": target.hour,
        "minute": target.minute,
        "second": target.second,
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
            completed.stderr.strip()
            or "Chinese Lunar worker failed"
        )

    try:
        raw = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Invalid Chinese Lunar worker output: {completed.stdout!r}"
        ) from exc

    return {
        "year": raw["year"],
        "yearName": raw["yearName"],
        "month": raw["month"],
        "day": raw["day"],
        "isLeapMonth": raw["isLeapMonth"],
        "effectiveDate": target.isoformat(),
        "boundary": "MIDNIGHT",
        "meta": {
            "engine": "lunar-javascript",
            "phase": "NODE_WORKER",
            "calendar": "chinese-lunar",
        },
    }
