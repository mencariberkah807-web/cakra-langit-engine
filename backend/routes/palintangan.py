from datetime import date

from fastapi import APIRouter, HTTPException

from engines.palintangan_sunda_engine import calculate_pancaka, get_palintangan_sunda_data

router = APIRouter(prefix="/api/palintangan", tags=["palintangan"])


@router.get("/pancaka")
def palintangan_pancaka(value: int, divisor: int):
    result = calculate_pancaka(value, divisor)
    if result["status"] == "UNKNOWN":
        raise HTTPException(status_code=400, detail="Pancaka divisor is not available.")
    return result


@router.get("/sunda")
def palintangan_sunda(date_value: str = ""):
    try:
        target_date = date.fromisoformat(date_value) if date_value else date.today()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date_value: {exc}")

    return get_palintangan_sunda_data(target_date)
