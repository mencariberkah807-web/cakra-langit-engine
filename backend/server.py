from datetime import date, datetime
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User
from engines.bazi_engine import get_bazi_data
from engines.calendar_engine import get_calendar_data
from engines.eclipse_engine import get_eclipse_data
from engines.earth_engine import get_earth_data
from engines.hijri_engine import get_hijri_data
from engines.location_engine import (
    find_location,
    find_location_by_id,
    get_indonesia_provinces,
    get_popular_locations,
    search_locations,
)
from engines.moon_engine import get_moon_data
from engines.sky_engine import get_sky_data
from engines.solar_engine import get_solar_data
from engines.tide_engine import get_tide_data
from routes.auth import router as auth_router
from services.auth_dependencies import get_current_user
from services.auth_service import create_access_token, verify_password
from services.user_service import (
    create_user,
    get_user_by_email,
    serialize_user,
)


app = FastAPI(title="Personal Almanac V1 API")
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterRequest(BaseModel):
    email: str
    password: str
    display_name: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "personal-almanac-v1",
    }


@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: DbSession):
    email = payload.email.strip().lower()
    password = payload.password

    if "@" not in email or len(email) > 255:
        raise HTTPException(status_code=400, detail="Invalid email")

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    if get_user_by_email(db, email):
        raise HTTPException(status_code=409, detail="Email already registered")

    user = create_user(
        db,
        email=email,
        password=password,
        display_name=payload.display_name,
    )
    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@app.post("/api/auth/login")
def login(payload: LoginRequest, db: DbSession):
    user = get_user_by_email(db, payload.email)

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@app.get("/api/auth/me")
def me(current_user: CurrentUser):
    return serialize_user(current_user)


@app.get("/api/hijri")
def hijri(year: int, month: int, day: int):
    return get_hijri_data(year, month, day)


@app.get("/api/provinces")
def provinces():
    return get_indonesia_provinces()


@app.get("/api/locations")
def locations(
    q: str = "",
    city: str = "",
    province: str = "",
    limit: int = 100,
):
    if city.strip() or province.strip():
        return search_locations(city, province, limit)

    if q.strip():
        return search_locations(q, "", limit)

    return get_popular_locations(limit)


@app.get("/api/locations/{location_id}")
def location_by_id(location_id: str):
    location = find_location_by_id(location_id)

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    return location


@app.get("/api/almanac")
def almanac(
    city: str = "Bandung",
    location_id: str = "",
    date_value: str = "",
    datetime_value: str = "",
):
    location = (
        find_location_by_id(location_id)
        if location_id
        else find_location(city, "ID")
    )

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    local_datetime = None

    if datetime_value:
        try:
            instant = datetime.fromisoformat(
                datetime_value.replace("Z", "+00:00")
            )
            local_datetime = instant.astimezone(
                ZoneInfo(location["timezone"])
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid datetime_value: {exc}",
            )

    try:
        target_date = (
            date.fromisoformat(date_value)
            if date_value
            else (
                local_datetime.date()
                if local_datetime
                else datetime.now(
                    ZoneInfo(location["timezone"])
                ).date()
            )
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    solar = get_solar_data(
        latitude=location["latitude"],
        longitude=location["longitude"],
        timezone=location["timezone"],
        city=location["city"],
        region=location["province"],
        target_date=target_date,
    )

    calendar_data = get_calendar_data(
        target_date,
        location["timezone"],
        local_datetime=local_datetime,
        solar=solar,
    )
    calendars = list(calendar_data.values())

    moon = get_moon_data(target_date)
    eclipse = get_eclipse_data(target_date)
    sky = get_sky_data(moon)
    earth = get_earth_data(target_date)
    tide = get_tide_data(location, target_date, location["timezone"])

    quick_jumps = {
        "today": target_date.isoformat(),
        "next_full_moon": moon.get("next_full_moon"),
        "next_eclipse": (
            eclipse["next"]["date"] if eclipse.get("next") else None
        ),
    }

    jawa_calendar = next(
        (calendar for calendar in calendars if calendar.get("id") == "jawa"),
        None,
    )

    ticker = [
        f"{location['city']} · {target_date.strftime('%d %B %Y')}",
        f"Sunrise {solar.get('sunrise')} · Sunset {solar.get('sunset')}",
        f"Moon {moon.get('phase')} · {moon.get('illumination')}%",
        f"Jawa {jawa_calendar['headline']}" if jawa_calendar else None,
    ]
    ticker = [item for item in ticker if item]

    schedule = [
        {"time": solar.get("dawn"), "title": "Fajar — Dawn Window", "cat": "SKY", "sub": "Sky"},
        {"time": solar.get("sunrise"), "title": "Sunrise — Surya Terbit", "cat": "SOLAR", "sub": "Sun"},
        {"time": solar.get("noon"), "title": "Solar Noon — Kulminasi", "cat": "SOLAR", "sub": "Sun"},
        {"time": solar.get("golden_hour"), "title": "Golden Hour", "cat": "SOLAR", "sub": "Sun"},
        {"time": solar.get("sunset"), "title": "Sunset — Surya Surup", "cat": "SOLAR", "sub": "Sun"},
        {"time": solar.get("dusk"), "title": "Dusk — Stargazing Window", "cat": "SKY", "sub": "Night sky"},
    ]
    schedule = [item for item in schedule if item["time"]]

    return {
        "location": {
            **location,
            "name": location["city"],
            "region": location["province"],
            "tz": location["timezone"],
            "tz_label": {
                "Asia/Jakarta": "WIB",
                "Asia/Makassar": "WITA",
                "Asia/Jayapura": "WIT",
            }.get(location["timezone"], location["timezone"]),
            "utc": "UTC" + datetime.now(
                ZoneInfo(location["timezone"])
            ).strftime("%z")[:3],
        },
        "date_info": {
            "iso": target_date.isoformat(),
            "day_name": target_date.strftime("%A"),
            "date_long": target_date.strftime("%d %B %Y"),
            "month_label": target_date.strftime("%B %Y"),
            "day_of_year": earth["day_of_year"],
            "annual_pct": earth["annual_pct"],
        },
        "natural": {
            "sun": solar,
            "moon": moon,
            "eclipse": eclipse,
            "sky": sky,
            "earth": earth,
            "tide": tide,
        },
        "calendars": calendars,
        "schedule": schedule,
        "quick_jumps": quick_jumps,
        "ticker": ticker,
    }


@app.get("/api/bazi")
def bazi(
    current_user: CurrentUser,
    year: int,
    month: int,
    day: int,
    hour: int = 0,
    minute: int = 0,
    second: int = 0,
    day_boundary: str = "MIDNIGHT",
):
    try:
        return get_bazi_data(
            year=year,
            month=month,
            day=day,
            hour=hour,
            minute=minute,
            second=second,
            day_boundary=day_boundary,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
