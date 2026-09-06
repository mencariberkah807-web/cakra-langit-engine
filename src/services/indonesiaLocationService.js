import indonesiaLocationData from '../../backend/data/indonesiaLocations.json'

const LOCATIONS = indonesiaLocationData.locations || []

const PROVINCES = new Map(
  LOCATIONS
    .filter((record) => record.level === 1)
    .map((record) => [record.id, record])
)

function timezoneLabel(timezone) {
  return {
    'Asia/Jakarta': 'WIB',
    'Asia/Makassar': 'WITA',
    'Asia/Jayapura': 'WIT',
  }[timezone] || null
}

function normalize(record) {
  if (!record) return null

  const provinceCode = record.id.split('.')[0]
  const province = PROVINCES.get(provinceCode)

  return {
    id: record.id,
    kode: record.kode,
    city: record.name,
    province: province?.name || '',
    country: 'Indonesia',
    countryCode: 'ID',
    timezone: record.timezone,
    timezoneLabel: timezoneLabel(record.timezone),
    latitude: Number.isFinite(Number(record.latitude))
      ? Number(record.latitude)
      : null,
    longitude: Number.isFinite(Number(record.longitude))
      ? Number(record.longitude)
      : null,
    population: Number(record.population) || 0,
    level: record.level,
    parentId: record.parentId || null,
    coastal: record.coastal === true,
  }
}

export function searchIndonesiaLocations(query, limit = 20) {
  const normalized = String(query || '').trim().toLowerCase()
  if (!normalized) return []

  return LOCATIONS
    .filter((record) => {
      const name = String(record.name || '').toLowerCase()
      const province = String(
        PROVINCES.get(record.id.split('.')[0])?.name || ''
      ).toLowerCase()

      return (
        name.includes(normalized) ||
        province.includes(normalized)
      )
    })
    .sort(
      (a, b) =>
        (Number(b.population) || 0) -
        (Number(a.population) || 0)
    )
    .slice(0, limit)
    .map(normalize)
}

export function findIndonesiaLocationById(id) {
  return normalize(
    LOCATIONS.find((record) => String(record.id) === String(id))
  )
}

export function findIndonesiaLocation(city) {
  const normalized = String(city || '').trim().toLowerCase()
  if (!normalized) return null

  return normalize(
    LOCATIONS
      .filter(
        (record) =>
          String(record.name || '').toLowerCase() === normalized
      )
      .sort(
        (a, b) =>
          (Number(b.population) || 0) -
          (Number(a.population) || 0)
      )[0]
  )
}

export function getIndonesiaLocationsByLevel(level) {
  return LOCATIONS
    .filter((record) => record.level === level)
    .map(normalize)
}

export function getIndonesiaLocationStats() {
  return {
    total: LOCATIONS.length,
    provinces: LOCATIONS.filter((x) => x.level === 1).length,
    regenciesCities: LOCATIONS.filter((x) => x.level === 2).length,
    districts: LOCATIONS.filter((x) => x.level === 3).length,
    villages: LOCATIONS.filter((x) => x.level === 4).length,
    coordinates: LOCATIONS.filter(
      (x) =>
        x.latitude !== null &&
        x.longitude !== null
    ).length,
    timezones: LOCATIONS.filter(
      (x) => x.timezone !== null
    ).length,
  }
}
