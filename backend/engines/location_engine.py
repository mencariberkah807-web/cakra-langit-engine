import json

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
INDONESIA_DATA_FILE = BASE_DIR / "data" / "indonesiaLocations.json"
GLOBAL_DATA_FILE = BASE_DIR / "data" / "cityMap.json"


with INDONESIA_DATA_FILE.open("r", encoding="utf-8") as f:
    INDONESIA_DATA = json.load(f).get("locations", [])


with GLOBAL_DATA_FILE.open("r", encoding="utf-8") as f:
    CITY_DATA = json.load(f)


def indonesia_timezone_label(timezone):
    return {
        "Asia/Jakarta": "WIB",
        "Asia/Makassar": "WITA",
        "Asia/Jayapura": "WIT",
    }.get(timezone)


INDONESIA_BY_ID = {
    str(record.get("id")): record
    for record in INDONESIA_DATA
}


def get_indonesia_province(record):
    if not record:
        return ""

    current = record

    while current:
        if current.get("level") == 1:
            return current.get("name") or ""

        parent_id = current.get("parentId")
        if not parent_id:
            break

        current = INDONESIA_BY_ID.get(str(parent_id))

    return ""


def normalize_indonesia_location(record):
    if not record:
        return None

    latitude = record.get("latitude")
    longitude = record.get("longitude")

    return {
        "id": record.get("id"),
        "city": record.get("name"),
        "province": get_indonesia_province(record),
        "country": "Indonesia",
        "countryCode": "ID",
        "timezone": record.get("timezone"),
        "timezoneLabel": indonesia_timezone_label(record.get("timezone")),
        "latitude": float(latitude) if latitude is not None else None,
        "longitude": float(longitude) if longitude is not None else None,
        "population": int(record.get("population") or 0),
        "level": record.get("level"),
        "parentId": record.get("parentId"),
        "coastal": record.get("coastal") is True,
    }


def normalize_location(record):
    if not record:
        return None

    latitude = float(record.get("lat") or 0)
    longitude = float(record.get("lng") or 0)

    return {
        "id": ":".join([
            str(record.get("iso2") or ""),
            str(record.get("city") or ""),
            str(record.get("province") or ""),
            str(latitude),
            str(longitude),
        ]),
        "city": record.get("city"),
        "province": record.get("province") or "",
        "country": record.get("country") or "",
        "countryCode": record.get("iso2") or "",
        "timezone": record.get("timezone"),
        "timezoneLabel": indonesia_timezone_label(record.get("timezone")),
        "latitude": latitude,
        "longitude": longitude,
        "population": int(record.get("pop") or 0),
    }


def search_locations(city, province="", limit=20):
    normalized_city = normalize_indonesia_name(city)
    normalized_province = str(province or "").strip().lower()

    if not normalized_city:
        return []

    indonesia_matches = []

    for record in INDONESIA_DATA:
        if record.get("level") != 2:
            continue

        record_province = get_indonesia_province(record).strip().lower()
        if normalized_province and record_province != normalized_province:
            continue

        record_name = normalize_indonesia_name(
            record.get("name"),
            record.get("level"),
        )

        if record_name == normalized_city:
            indonesia_matches.append(record)

    indonesia_results = [
        normalize_indonesia_location(record)
        for record in indonesia_matches[:limit]
    ]

    if indonesia_results:
        return indonesia_results

    global_matches = []

    for record in CITY_DATA:
        city_name = str(record.get("city") or "").strip().lower()
        ascii_name = str(record.get("city_ascii") or "").strip().lower()
        record_province = str(record.get("province") or "").strip().lower()

        city_match = (
            city_name == normalized_city
            or ascii_name == normalized_city
        )

        province_match = (
            not normalized_province
            or record_province == normalized_province
        )

        if city_match and province_match:
            global_matches.append(record)

    global_matches.sort(
        key=lambda record: int(record.get("pop") or 0),
        reverse=True,
    )

    return [
        normalize_location(record)
        for record in global_matches[:limit]
    ]

def normalize_indonesia_name(name, level=None):
    normalized = str(name or "").strip().lower()
    if level == 2:
        for prefix in ("kabupaten ", "kota "):
            if normalized.startswith(prefix):
                return normalized[len(prefix):].strip()
    return normalized


def find_location(city, country_code=None, province=None):
    normalized_city = normalize_indonesia_name(city)
    normalized_province = str(province or "").strip().lower()

    if not normalized_city:
        return None

    if not country_code or str(country_code).lower() == "id":
        candidates = []

        for record in INDONESIA_DATA:
            record_province = get_indonesia_province(record).strip().lower()

            if normalized_province and record_province != normalized_province:
                continue

            record_name = normalize_indonesia_name(
                record.get("name"),
                record.get("level"),
            )

            if record_name == normalized_city:
                candidates.append(record)

        level_two = [
            record
            for record in candidates
            if record.get("level") == 2
        ]

        if len(level_two) == 1:
            return normalize_indonesia_location(level_two[0])

        if len(level_two) > 1:
            kota_matches = [
                record
                for record in level_two
                if str(record.get("name") or "").strip().lower().startswith("kota ")
            ]
            if len(kota_matches) == 1:
                return normalize_indonesia_location(kota_matches[0])
            return None

        if len(candidates) == 1:
            return normalize_indonesia_location(candidates[0])

        if len(candidates) > 1:
            return None

        if normalized_province:
            return None

    matches = []
    for record in CITY_DATA:
        city_name = str(record.get("city") or "").lower()
        ascii_name = str(record.get("city_ascii") or "").lower()
        record_province = str(record.get("province") or "").lower()
        if country_code:
            country_match = (
                str(record.get("iso2") or "").lower()
                == str(country_code).lower()
            )
        else:
            country_match = True
        name_match = (
            city_name == normalized_city
            or ascii_name == normalized_city
        )
        province_match = (
            not normalized_province
            or record_province == normalized_province
        )
        if country_match and name_match and province_match:
            matches.append(record)

    if not matches:
        return None

    matches.sort(
        key=lambda record: int(record.get("pop") or 0),
        reverse=True,
    )
    return normalize_location(matches[0])


def find_location_by_id(location_id):
    if not location_id:
        return None

    normalized_id = str(location_id)

    indonesia_record = next(
        (
            record
            for record in INDONESIA_DATA
            if str(record.get("id")) == normalized_id
        ),
        None,
    )

    if indonesia_record:
        return normalize_indonesia_location(indonesia_record)

    for record in CITY_DATA:
        latitude = float(record.get("lat") or 0)
        longitude = float(record.get("lng") or 0)

        record_id = ":".join([
            str(record.get("iso2") or ""),
            str(record.get("city") or ""),
            str(record.get("province") or ""),
            str(latitude),
            str(longitude),
        ])

        if record_id == normalized_id:
            return normalize_location(record)

    return None


def get_indonesia_provinces():
    provinces = [
        normalize_indonesia_location(record)
        for record in INDONESIA_DATA
        if record.get("level") == 1
    ]

    provinces.sort(key=lambda record: record.get("city") or "")
    return provinces


def get_popular_locations(limit=100):
    indonesia_records = sorted(
        INDONESIA_DATA,
        key=lambda record: int(record.get("population") or 0),
        reverse=True,
    )

    indonesia_results = [
        normalize_indonesia_location(record)
        for record in indonesia_records[:limit]
    ]

    if len(indonesia_results) >= limit:
        return indonesia_results

    remaining = limit - len(indonesia_results)

    global_records = sorted(
        CITY_DATA,
        key=lambda record: int(record.get("pop") or 0),
        reverse=True,
    )

    global_results = [
        normalize_location(record)
        for record in global_records
    ]

    indonesia_ids = {item["id"] for item in indonesia_results}

    return (
        indonesia_results
        + [
            item
            for item in global_results
            if item["id"] not in indonesia_ids
        ][:remaining]
    )
