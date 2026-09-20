"""Open natural-data providers for the Nature Layer Future Engines.

Providers are public/open-data services. The engine keeps provider failures isolated:
one unavailable source must not disable the other future-engine cards.
"""

from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timedelta
from math import asin, cos, radians, sin, sqrt
import json
import ssl
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import certifi


TIMEOUT_SECONDS = 5
USER_AGENT = "CakraLangit/1.0 (+https://github.com/mencariberkah807-web/cakra-langit-engine)"
SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())

WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
GEOMAG_URL = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"
RADIATION_URL = "https://simplemap.safecast.org/ogc/collections/sensors/items"
VOLCANO_URL = "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows"
EARTHQUAKE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"
MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"


WMO_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}


def _get_json(url, params=None):
    if params:
        url = f"{url}?{urlencode(params)}"
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    with urlopen(request, timeout=TIMEOUT_SECONDS, context=SSL_CONTEXT) as response:
        return json.loads(response.read().decode("utf-8"))


def _available(id_, title, primary, secondary, details, source):
    return {
        "id": id_,
        "title": title,
        "available": True,
        "primary": primary,
        "secondary": secondary,
        "details": details,
        "source": source,
    }


def _unavailable(id_, title, source, error):
    return {
        "id": id_,
        "title": title,
        "available": False,
        "primary": "No data",
        "secondary": "Provider unavailable",
        "details": [{"label": "Status", "value": str(error)[:140]}],
        "source": source,
    }


def _weather_code(value):
    try:
        return WMO_CODES.get(int(value), f"WMO {value}")
    except (TypeError, ValueError):
        return "Unknown"


def _fetch_weather(latitude, longitude, timezone):
    data = _get_json(
        WEATHER_URL,
        {
            "latitude": latitude,
            "longitude": longitude,
            "current": ",".join(
                [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "apparent_temperature",
                    "precipitation",
                    "rain",
                    "showers",
                    "snowfall",
                    "weather_code",
                    "cloud_cover",
                    "pressure_msl",
                    "surface_pressure",
                    "wind_speed_10m",
                    "wind_direction_10m",
                    "wind_gusts_10m",
                ]
            ),
            "timezone": timezone,
            "forecast_days": 1,
        },
    )
    current = data.get("current") or {}
    units = data.get("current_units") or {}

    weather = _available(
        "weather",
        "Weather",
        _weather_code(current.get("weather_code")),
        f"{current.get('temperature_2m', '—')} {units.get('temperature_2m', '°C')}",
        [
            {"label": "Feels like", "value": f"{current.get('apparent_temperature', '—')} {units.get('apparent_temperature', '°C')}"},
            {"label": "Wind", "value": f"{current.get('wind_speed_10m', '—')} {units.get('wind_speed_10m', 'km/h')}"},
            {"label": "Rain", "value": f"{current.get('precipitation', '—')} {units.get('precipitation', 'mm')}"},
        ],
        "Open-Meteo Weather Forecast API",
    )

    atmosphere = _available(
        "atmosphere",
        "Atmosphere",
        f"{current.get('pressure_msl', '—')} {units.get('pressure_msl', 'hPa')}",
        f"Humidity {current.get('relative_humidity_2m', '—')}{units.get('relative_humidity_2m', '%')}",
        [
            {"label": "Surface pressure", "value": f"{current.get('surface_pressure', '—')} {units.get('surface_pressure', 'hPa')}"},
            {"label": "Cloud cover", "value": f"{current.get('cloud_cover', '—')} {units.get('cloud_cover', '%')}"},
            {"label": "Wind gust", "value": f"{current.get('wind_gusts_10m', '—')} {units.get('wind_gusts_10m', 'km/h')}"},
        ],
        "Open-Meteo Weather Forecast API",
    )
    return {"weather": weather, "atmosphere": atmosphere}


def _fetch_air_quality(latitude, longitude, timezone):
    data = _get_json(
        AIR_QUALITY_URL,
        {
            "latitude": latitude,
            "longitude": longitude,
            "current": ",".join(
                [
                    "european_aqi",
                    "us_aqi",
                    "pm2_5",
                    "pm10",
                    "carbon_monoxide",
                    "nitrogen_dioxide",
                    "sulphur_dioxide",
                    "ozone",
                ]
            ),
            "timezone": timezone,
        },
    )
    current = data.get("current") or {}
    units = data.get("current_units") or {}
    aqi = current.get("us_aqi")
    primary = f"US AQI {aqi}" if aqi is not None else "AQI unavailable"

    return _available(
        "air-quality",
        "Air Quality",
        primary,
        f"PM2.5 {current.get('pm2_5', '—')} {units.get('pm2_5', 'µg/m³')}",
        [
            {"label": "PM10", "value": f"{current.get('pm10', '—')} {units.get('pm10', 'µg/m³')}"},
            {"label": "Ozone", "value": f"{current.get('ozone', '—')} {units.get('ozone', 'µg/m³')}"},
            {"label": "NO₂", "value": f"{current.get('nitrogen_dioxide', '—')} {units.get('nitrogen_dioxide', 'µg/m³')}"},
        ],
        "Open-Meteo Air Quality API · CAMS",
    )


def _fetch_geomagnetic():
    data = _get_json(GEOMAG_URL)
    rows = data if isinstance(data, list) else []
    if rows and isinstance(rows[0], dict) and "time_tag" not in rows[0]:
        keys = rows[0]
        rows = [
            dict(zip(keys, row))
            for row in rows[1:]
            if isinstance(row, list)
        ]

    latest = next((row for row in reversed(rows) if isinstance(row, dict)), None)
    if not latest:
        raise RuntimeError("No planetary K-index observation")

    kp = latest.get("kp_index")
    if kp is None:
        kp = latest.get("Kp")
    if kp is None:
        raise RuntimeError("Kp value unavailable")

    try:
        kp_number = float(kp)
    except (TypeError, ValueError):
        kp_number = None

    if kp_number is not None and kp_number >= 5:
        state = f"Geomagnetic storm · Kp {kp_number:g}"
    elif kp_number is not None and kp_number >= 4:
        state = f"Active · Kp {kp_number:g}"
    elif kp_number is not None:
        state = f"Quiet · Kp {kp_number:g}"
    else:
        state = f"Kp {kp}"

    return _available(
        "geomagnetic",
        "Geomagnetic",
        state,
        str(latest.get("time_tag") or "Latest observation"),
        [
            {"label": "Planetary Kp", "value": str(kp)},
            {"label": "Observation", "value": str(latest.get("time_tag") or "—")},
        ],
        "NOAA Space Weather Prediction Center",
    )


def _distance_km(lat1, lon1, lat2, lon2):
    radius = 6371.0
    p1, p2 = radians(lat1), radians(lat2)
    dp = radians(lat2 - lat1)
    dl = radians(lon2 - lon1)
    a = sin(dp / 2) ** 2 + cos(p1) * cos(p2) * sin(dl / 2) ** 2
    return radius * 2 * asin(sqrt(max(0.0, min(1.0, a))))


def _fetch_radiation(latitude, longitude):
    span = 2.5
    data = _get_json(
        RADIATION_URL,
        {
            "bbox": f"{longitude - span},{latitude - span},{longitude + span},{latitude + span}",
            "limit": 100,
        },
    )
    features = data.get("features") or []
    candidates = []
    for feature in features:
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates") or []
        if len(coords) < 2:
            continue
        props = feature.get("properties") or {}
        dose = props.get("doserate_uSvh")
        if dose is None:
            dose = props.get("dose_rate_uSvh")
        if dose is None:
            continue
        try:
            distance = _distance_km(latitude, longitude, float(coords[1]), float(coords[0]))
            candidates.append((distance, props, dose))
        except (TypeError, ValueError):
            continue

    if not candidates:
        return _available(
            "radiation",
            "Radiation",
            "No nearby calibrated reading",
            "Safecast public monitoring",
            [{"label": "Status", "value": "No suitable dose-rate sensor in the search area"}],
            "Safecast",
        )

    distance, props, dose = min(candidates, key=lambda item: item[0])
    unit = props.get("unit") or "µSv/h"
    sensor = props.get("device_name") or props.get("device_id") or "Safecast sensor"

    return _available(
        "radiation",
        "Radiation",
        f"{dose} {unit}",
        f"{distance:.1f} km · {sensor}",
        [
            {"label": "Dose rate", "value": f"{dose} {unit}"},
            {"label": "Sensor", "value": str(sensor)},
            {"label": "Reading time", "value": str(props.get("last_reading_at") or "—")},
        ],
        "Safecast · CC0 public data",
    )


def _fetch_volcanic(latitude, longitude):
    span = 5.0
    data = _get_json(
        VOLCANO_URL,
        {
            "service": "WFS",
            "version": "1.0.0",
            "request": "GetFeature",
            "typeName": "GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes",
            "outputFormat": "application/json",
            "maxFeatures": 100,
            "bbox": f"{longitude - span},{latitude - span},{longitude + span},{latitude + span}",
        },
    )
    features = data.get("features") or []
    candidates = []
    for feature in features:
        props = feature.get("properties") or {}
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates") or []
        if len(coords) < 2:
            continue
        try:
            distance = _distance_km(latitude, longitude, float(coords[1]), float(coords[0]))
            candidates.append((distance, props))
        except (TypeError, ValueError):
            continue

    if not candidates:
        return _available(
            "volcanic",
            "Volcanic",
            "No nearby volcano record",
            "Smithsonian GVP",
            [{"label": "Search radius", "value": "≈ 550 km"}],
            "Smithsonian Global Volcanism Program",
        )

    distance, props = min(candidates, key=lambda item: item[0])
    name = props.get("Volcano_Name") or props.get("Volcano_Name_") or "Unnamed volcano"
    number = props.get("Volcano_Number") or "—"

    return _available(
        "volcanic",
        "Volcanic",
        str(name),
        f"{distance:.0f} km · Holocene volcano",
        [
            {"label": "Volcano number", "value": str(number)},
            {"label": "Distance", "value": f"{distance:.0f} km"},
            {"label": "Dataset", "value": "VOTW Holocene volcanoes"},
        ],
        "Smithsonian Global Volcanism Program",
    )


def _fetch_seismic(latitude, longitude, timezone, target_date):
    start = datetime.combine(target_date, datetime.min.time())
    end = start + timedelta(days=1)
    data = _get_json(
        EARTHQUAKE_URL,
        {
            "format": "geojson",
            "starttime": start.isoformat(),
            "endtime": end.isoformat(),
            "latitude": latitude,
            "longitude": longitude,
            "maxradiuskm": 500,
            "minmagnitude": 2.5,
            "orderby": "time",
            "limit": 20,
        },
    )
    features = data.get("features") or []
    if not features:
        return _available(
            "seismic",
            "Seismic",
            "No M2.5+ events",
            "USGS catalog",
            [{"label": "Search radius", "value": "500 km"}, {"label": "Period", "value": target_date.isoformat()}],
            "USGS Earthquake Catalog",
        )

    events = []
    for feature in features:
        props = feature.get("properties") or {}
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates") or []
        if len(coords) < 2:
            continue
        try:
            distance = _distance_km(latitude, longitude, float(coords[1]), float(coords[0]))
        except (TypeError, ValueError):
            distance = None
        events.append((props.get("time") or 0, distance, props))

    events.sort(key=lambda item: item[0], reverse=True)
    _, distance, props = events[0]
    magnitude = props.get("mag")
    place = props.get("place") or "Earthquake"
    primary = f"M{magnitude}" if magnitude is not None else "Event"

    return _available(
        "seismic",
        "Seismic",
        primary,
        f"{place} · {distance:.0f} km" if distance is not None else place,
        [
            {"label": "Events", "value": str(len(events))},
            {"label": "Latest", "value": place},
            {"label": "Distance", "value": f"{distance:.0f} km" if distance is not None else "—"},
        ],
        "USGS Earthquake Catalog",
    )


def get_ocean_data(location):
    latitude = float(location["latitude"])
    longitude = float(location["longitude"])
    timezone = location.get("timezone") or "UTC"
    return _fetch_ocean(latitude, longitude, timezone)


def _fetch_ocean(latitude, longitude, timezone):
    data = _get_json(
        MARINE_URL,
        {
            "latitude": latitude,
            "longitude": longitude,
            "current": ",".join(
                [
                    "wave_height",
                    "wave_direction",
                    "wave_period",
                    "swell_wave_height",
                    "sea_surface_temperature",
                    "ocean_current_velocity",
                    "ocean_current_direction",
                ]
            ),
            "timezone": timezone,
            "cell_selection": "nearest",
        },
    )
    current = data.get("current") or {}
    units = data.get("current_units") or {}
    marine_values = [
        current.get("wave_height"),
        current.get("wave_direction"),
        current.get("wave_period"),
        current.get("swell_wave_height"),
        current.get("sea_surface_temperature"),
        current.get("ocean_current_velocity"),
        current.get("ocean_current_direction"),
    ]
    if not current or all(value is None for value in marine_values):
        return _unavailable(
            "ocean",
            "Ocean",
            "Open-Meteo Marine API",
            "No marine observation for this location; location is inland or outside marine coverage.",
            [
                {"label": "Status", "value": "Open-Meteo returned no marine observation for this coordinate"},
                {"label": "Location", "value": f"{latitude:.4f}, {longitude:.4f}"},
            ],
            "Open-Meteo Marine API",
        )

    return _available(
        "ocean",
        "Ocean",
        f"Wave {current.get('wave_height', '—')} {units.get('wave_height', 'm')}",
        f"SST {current.get('sea_surface_temperature', '—')} {units.get('sea_surface_temperature', '°C')}",
        [
            {"label": "Wave period", "value": f"{current.get('wave_period', '—')} {units.get('wave_period', 's')}"},
            {"label": "Swell", "value": f"{current.get('swell_wave_height', '—')} {units.get('swell_wave_height', 'm')}"},
            {"label": "Current", "value": f"{current.get('ocean_current_velocity', '—')} {units.get('ocean_current_velocity', 'km/h')}"},
        ],
        "Open-Meteo Marine API",
    )


def get_future_natural_data(location, target_date: date):
    latitude = float(location["latitude"])
    longitude = float(location["longitude"])
    timezone = location.get("timezone") or "UTC"

    tasks = {
        "weather_bundle": lambda: _fetch_weather(latitude, longitude, timezone),
        "air-quality": lambda: _fetch_air_quality(latitude, longitude, timezone),
        "geomagnetic": _fetch_geomagnetic,
        "radiation": lambda: _fetch_radiation(latitude, longitude),
        "volcanic": lambda: _fetch_volcanic(latitude, longitude),
        "seismic": lambda: _fetch_seismic(latitude, longitude, timezone, target_date),
        "ocean": lambda: get_ocean_data(location),
    }

    results = {}
    with ThreadPoolExecutor(max_workers=len(tasks)) as executor:
        futures = {executor.submit(fn): key for key, fn in tasks.items()}
        for future in as_completed(futures):
            key = futures[future]
            try:
                value = future.result()
                if key == "weather_bundle":
                    results.update(value)
                else:
                    results[key] = value
            except Exception as exc:
                title = {
                    "weather_bundle": "Weather",
                    "air-quality": "Air Quality",
                    "geomagnetic": "Geomagnetic",
                    "radiation": "Radiation",
                    "volcanic": "Volcanic",
                    "seismic": "Seismic",
                    "ocean": "Ocean",
                }[key]
                results[key] = _unavailable(
                    key,
                    title,
                    "Open public provider",
                    f"{type(exc).__name__}: {exc}",
                )
                if key == "weather_bundle":
                    results["atmosphere"] = _unavailable(
                        "atmosphere",
                        "Atmosphere",
                        "Open-Meteo Weather Forecast API",
                        f"{type(exc).__name__}: {exc}",
                    )

    return {
        "location": {
            "city": location.get("city"),
            "province": location.get("province"),
            "country": location.get("country"),
        },
        "date": target_date.isoformat(),
        "engines": results,
    }
