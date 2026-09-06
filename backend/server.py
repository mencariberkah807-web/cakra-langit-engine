from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Personal Almanac V1 API")

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



@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "personal-almanac-v1",
    }

from engines.hijri_engine import get_hijri_data


@app.get("/api/hijri")
def hijri(year: int, month: int, day: int):
    return get_hijri_data(year, month, day)

from engines.location_engine import (
    find_location,
    find_location_by_id,
    get_popular_locations,
    get_indonesia_provinces,
    search_locations,
)


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

from datetime import date, datetime
from zoneinfo import ZoneInfo
from engines.location_engine import find_location
from engines.solar_engine import get_solar_data
from engines.moon_engine import get_moon_data
from engines.eclipse_engine import get_eclipse_data
from engines.sky_engine import get_sky_data
from engines.earth_engine import get_earth_data
from engines.tide_engine import get_tide_data
from engines.calendar_engine import get_calendar_data
from engines.bazi_engine import get_bazi_data


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
    tide = get_tide_data(
        location,
        target_date,
        location["timezone"],
    )

    quick_jumps = {
        "today": target_date.isoformat(),
        "next_full_moon": moon.get("next_full_moon"),
        "next_eclipse": (
            eclipse["next"]["date"]
            if eclipse.get("next")
            else None
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
        {
            "time": solar.get("dawn"),
            "title": "Fajar — Dawn Window",
            "cat": "SKY",
            "sub": "Sky",
        },
        {
            "time": solar.get("sunrise"),
            "title": "Sunrise — Surya Terbit",
            "cat": "SOLAR",
            "sub": "Sun",
        },
        {
            "time": solar.get("noon"),
            "title": "Solar Noon — Kulminasi",
            "cat": "SOLAR",
            "sub": "Sun",
        },
        {
            "time": solar.get("golden_hour"),
            "title": "Golden Hour",
            "cat": "SOLAR",
            "sub": "Sun",
        },
        {
            "time": solar.get("sunset"),
            "title": "Sunset — Surya Surup",
            "cat": "SOLAR",
            "sub": "Sun",
        },
        {
            "time": solar.get("dusk"),
            "title": "Dusk — Stargazing Window",
            "cat": "SKY",
            "sub": "Night sky",
        },
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
            "utc": "UTC" + __import__("datetime").datetime.now(
                __import__("zoneinfo").ZoneInfo(location["timezone"])
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
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )
