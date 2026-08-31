import math
import os
import logging
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Query, HTTPException
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from astral import LocationInfo
from astral.sun import sun, golden_hour, SunDirection
from hijri_converter import Gregorian

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

CITIES = {
    "bandung": {"id": "bandung", "name": "Bandung", "region": "Jawa Barat, Indonesia", "lat": -6.9175, "lon": 107.6191, "tz": "Asia/Jakarta", "tz_label": "WIB"},
    "jakarta": {"id": "jakarta", "name": "Jakarta", "region": "DKI Jakarta, Indonesia", "lat": -6.2088, "lon": 106.8456, "tz": "Asia/Jakarta", "tz_label": "WIB"},
    "yogyakarta": {"id": "yogyakarta", "name": "Yogyakarta", "region": "DI Yogyakarta, Indonesia", "lat": -7.7956, "lon": 110.3695, "tz": "Asia/Jakarta", "tz_label": "WIB"},
    "surabaya": {"id": "surabaya", "name": "Surabaya", "region": "Jawa Timur, Indonesia", "lat": -7.2575, "lon": 112.7521, "tz": "Asia/Jakarta", "tz_label": "WIB"},
    "denpasar": {"id": "denpasar", "name": "Denpasar", "region": "Bali, Indonesia", "lat": -8.6705, "lon": 115.2126, "tz": "Asia/Makassar", "tz_label": "WITA"},
    "medan": {"id": "medan", "name": "Medan", "region": "Sumatera Utara, Indonesia", "lat": 3.5952, "lon": 98.6722, "tz": "Asia/Jakarta", "tz_label": "WIB"},
}
UTC_OFFSETS = {"WIB": "UTC+7", "WITA": "UTC+8", "WIT": "UTC+9"}

DAYS_ID = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
             "Agustus", "September", "Oktober", "November", "Desember"]
PASARAN = [("Legi", 5), ("Pahing", 9), ("Pon", 7), ("Wage", 4), ("Kliwon", 8)]
DINO_NEPTU = [4, 3, 7, 8, 6, 9, 5]  # Mon..Sun
DINO_JAWA = ["Senin", "Selasa", "Rebo", "Kemis", "Jumat", "Sabtu", "Ahad"]
SUNDA_DAYS = ["Senén", "Salasa", "Rebo", "Kemis", "Jumaah", "Saptu", "Minggu"]
BALI_DAYS = ["Soma", "Anggara", "Buda", "Wraspati", "Sukra", "Saniscara", "Redite"]
BALI_PASARAN = ["Umanis", "Paing", "Pon", "Wage", "Kliwon"]
WUKU = ["Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit",
        "Warigagung", "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir",
        "Mandasiya", "Julungpujut", "Pahang", "Kuruwelut", "Marakeh", "Tambir",
        "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala", "Wugu",
        "Wayang", "Kulawu", "Dukut", "Watugunung"]
JAWA_MONTHS = ["Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadilawal", "Jumadilakir",
               "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela", "Besar"]
HIJRI_MONTHS = ["Muharram", "Safar", "Rabiulawal", "Rabiulakhir", "Jumadilawal",
                "Jumadilakhir", "Rajab", "Sya'ban", "Ramadan", "Syawal",
                "Zulkaidah", "Zulhijah"]
TAHUN_JAWA = ["Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"]
WINDU = ["Adi", "Kuntara", "Sengara", "Sancaya"]
MOON_PHASES = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
               "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"]

ECLIPSES = [
    {"date": "2026-03-03", "type": "Total Lunar Eclipse", "visibility": "Asia, Australia & Pacific"},
    {"date": "2026-08-12", "type": "Total Solar Eclipse", "visibility": "Arctic, Spain & Iceland"},
    {"date": "2027-02-06", "type": "Annular Solar Eclipse", "visibility": "South America"},
    {"date": "2027-08-02", "type": "Total Solar Eclipse", "visibility": "North Africa & Middle East"},
    {"date": "2028-01-26", "type": "Annular Solar Eclipse", "visibility": "South America & Iberia"},
    {"date": "2028-07-22", "type": "Total Solar Eclipse", "visibility": "Australia & New Zealand"},
    {"date": "2029-06-12", "type": "Partial Solar Eclipse", "visibility": "Northern Hemisphere"},
    {"date": "2030-06-01", "type": "Annular Solar Eclipse", "visibility": "Asia & North Africa"},
]

PASARAN_ANCHOR = date(2024, 1, 1)  # Senin Pahing
PAWUKON_OFFSET = 68  # aligns 27 Aug 2026 -> Pawukon day 144 (Wuku Maktal)


def pasaran_index(d: date) -> int:
    return (1 + (d - PASARAN_ANCHOR).days) % 5


def pawukon_day(d: date) -> int:
    return ((d - date(2000, 1, 1)).days + PAWUKON_OFFSET) % 210 + 1


def moon_info(d: date) -> dict:
    syn = 29.530588853
    age = ((d - date(2000, 1, 6)).days - 0.28) % syn
    illum = (1 - math.cos(2 * math.pi * age / syn)) / 2 * 100
    idx = int((age / syn) * 8 + 0.5) % 8
    return {"phase": MOON_PHASES[idx], "illumination": round(illum), "age": round(age, 2)}


def saka_year(d: date) -> int:
    return d.year - 78 if d >= date(d.year, 3, 22) else d.year - 79


def fmt(dt) -> str:
    return dt.strftime("%H:%M")


@api_router.get("/")
async def root():
    return {"message": "Personal Almanac Engine v1.0.0"}


@api_router.get("/locations")
async def locations():
    return list(CITIES.values())


@api_router.get("/almanac")
async def almanac(city: str = "bandung", date_str: str = Query(None, alias="date")):
    c = CITIES.get(city)
    if not c:
        raise HTTPException(status_code=404, detail="Unknown city")
    try:
        d = date.fromisoformat(date_str) if date_str else datetime.now(ZoneInfo(c["tz"])).date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date, use YYYY-MM-DD")

    tz = ZoneInfo(c["tz"])
    loc = LocationInfo(c["name"], "Indonesia", c["tz"], c["lat"], c["lon"])
    s = sun(loc.observer, date=d, tzinfo=tz)
    gh = list(golden_hour(loc.observer, date=d, direction=SunDirection.SETTING, tzinfo=tz))

    wd = d.weekday()
    p_idx = pasaran_index(d)
    pasaran_name, pasaran_neptu = PASARAN[p_idx]
    neptu = DINO_NEPTU[wd] + pasaran_neptu
    p_day = pawukon_day(d)
    wuku = WUKU[(p_day - 1) // 7]
    h = Gregorian(d.year, d.month, d.day).to_hijri()
    jawa_year = h.year + 512
    doy = d.timetuple().tm_yday
    year_days = 366 if (d.year % 4 == 0 and (d.year % 100 != 0 or d.year % 400 == 0)) else 365
    moon = moon_info(d)

    eclipse_today = next((e for e in ECLIPSES if e["date"] == d.isoformat()), None)
    eclipse_next = next((e for e in ECLIPSES if e["date"] > d.isoformat()), None)

    sunrise, sunset, noon = fmt(s["sunrise"]), fmt(s["sunset"]), fmt(s["noon"])
    dawn, dusk, gh_start = fmt(s["dawn"]), fmt(s["dusk"]), fmt(gh[0])

    weton = f"{DINO_JAWA[wd]} {pasaran_name}"
    schedule = [
        {"time": dawn, "title": "Fajar — Dawn Window", "cat": "SKY", "sub": "Sky"},
        {"time": sunrise, "title": "Sunrise — Surya Terbit", "cat": "SOLAR", "sub": "Sun"},
        {"time": noon, "title": "Solar Noon — Kulminasi", "cat": "SOLAR", "sub": "Sun"},
        {"time": gh_start, "title": "Golden Hour", "cat": "SOLAR", "sub": "Sun"},
        {"time": sunset, "title": "Sunset — Surya Surup", "cat": "SOLAR", "sub": "Sun"},
        {"time": dusk, "title": "Dusk — Stargazing Window", "cat": "SKY", "sub": "Night sky"},
    ]

    return {
        "location": {**c, "utc": UTC_OFFSETS.get(c["tz_label"], "UTC+7")},
        "date_info": {
            "iso": d.isoformat(),
            "day_name": DAYS_ID[wd],
            "date_long": f"{DAYS_ID[wd]}, {d.day} {MONTHS_ID[d.month - 1]} {d.year}",
            "month_label": f"{MONTHS_ID[d.month - 1]} {d.year}",
            "day_of_year": doy,
            "annual_pct": round(doy / year_days * 100, 2),
        },
        "natural": {
            "sun": {"sunrise": sunrise, "sunset": sunset, "noon": noon,
                    "golden_hour": gh_start, "dawn": dawn, "dusk": dusk},
            "moon": moon,
            "eclipse": {"today": eclipse_today, "next": eclipse_next},
            "sky": {"context": "Night Sky",
                    "moonlight": "High" if moon["illumination"] >= 60 else "Low",
                    "bortle": "Bortle 5"},
            "earth": {"day_of_year": doy,
                      "annual_pct": round(doy / year_days * 100, 2)},
            "tide": {"note": "Tide data requires local model", "region": c["name"]},
        },
        "calendars": [
            {"id": "jawa", "name": "Jawa",
             "headline": f"{h.day} {JAWA_MONTHS[h.month - 1]} {jawa_year}",
             "sub": weton,
             "fields": [{"k": "Weton", "v": weton}, {"k": "Neptu", "v": str(neptu)},
                        {"k": "Wuku", "v": wuku},
                        {"k": "Tahun", "v": TAHUN_JAWA[(jawa_year - 1955) % 8]},
                        {"k": "Windu", "v": WINDU[((jawa_year - 1555) // 8) % 4]},
                        {"k": "Pasaran", "v": pasaran_name}]},
            {"id": "sunda", "name": "Saka Sunda",
             "headline": f"Taun {saka_year(d)} Saka",
             "sub": SUNDA_DAYS[wd],
             "fields": [{"k": "Poé", "v": SUNDA_DAYS[wd]},
                        {"k": "Pasaran", "v": pasaran_name},
                        {"k": "Taun", "v": f"{saka_year(d)} Saka"},
                        {"k": "Sasih", "v": JAWA_MONTHS[h.month - 1]},
                        {"k": "Boundary", "v": "Midnight"}]},
            {"id": "bali", "name": "Bali",
             "headline": f"{BALI_DAYS[wd]} {BALI_PASARAN[p_idx]}",
             "sub": f"Wuku {wuku}",
             "fields": [{"k": "Saptawara", "v": BALI_DAYS[wd]},
                        {"k": "Pancawara", "v": BALI_PASARAN[p_idx]},
                        {"k": "Wuku", "v": wuku},
                        {"k": "Pawukon Day", "v": str(p_day)},
                        {"k": "Taun Saka", "v": str(saka_year(d))},
                        {"k": "Sasih", "v": JAWA_MONTHS[h.month - 1]}]},
            {"id": "kalacakra", "name": "Kalacakra", "future": True},
            {"id": "candrakala", "name": "Candra Kala", "future": True},
            {"id": "cannse", "name": "Cannse Lunar", "future": True},
            {"id": "hijri", "name": "Hijri",
             "headline": f"{h.day} {HIJRI_MONTHS[h.month - 1]} {h.year} H",
             "sub": "Ummul Qura",
             "fields": [{"k": "Tanggal", "v": str(h.day)},
                        {"k": "Bulan", "v": HIJRI_MONTHS[h.month - 1]},
                        {"k": "Tahun", "v": f"{h.year} H"},
                        {"k": "Hari", "v": DAYS_ID[wd]}]},
        ],
        "schedule": schedule,
        "ticker": [
            f"Weton {weton}", f"Neptu {neptu}", f"Sunrise {sunrise}",
            f"Sunset {sunset}", f"Moon {moon['phase']} {moon['illumination']}%",
            f"Moon Age {moon['age']} days", f"Wuku {wuku}", f"Pawukon Day {p_day}",
            f"Hijri {h.day} {HIJRI_MONTHS[h.month - 1]} {h.year} H",
            f"Day {doy} of {year_days}", f"Solar Noon {noon}",
        ],
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
