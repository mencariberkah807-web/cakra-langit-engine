import cityTimezones from 'city-timezones'
const CITY_DATA = cityTimezones.cityMapping

function getIndonesiaTimezoneLabel(timezone) {
  switch (timezone) {
    case 'Asia/Jakarta':
      return 'WIB'
    case 'Asia/Makassar':
      return 'WITA'
    case 'Asia/Jayapura':
      return 'WIT'
    default:
      return null
  }
}

function normalizeLocation(record) {
  if (!record) return null

  const latitude = Number(record.lat)
  const longitude = Number(record.lng)

  return {
    id: [
      record.iso2 || '',
      record.city || '',
      record.province || '',
      latitude,
      longitude,
    ].join(':'),
    city: record.city,
    province: record.province || '',
    country: record.country || '',
    countryCode: record.iso2 || '',
    timezone: record.timezone,
    timezoneLabel: getIndonesiaTimezoneLabel(record.timezone),
    latitude,
    longitude,
    population: Number(record.pop) || 0,
  }
}

const API_BASE = 'http://127.0.0.1:8000'

export async function getIndonesiaProvinces() {
  const response = await fetch(`${API_BASE}/api/provinces`)

  if (!response.ok) {
    throw new Error(`Province API error: ${response.status}`)
  }

  const results = await response.json()

  return Array.isArray(results) ? results : []
}

export async function searchLocations(city, province = '', limit = 20) {
  const normalizedCity = String(city || '').trim()
  const normalizedProvince = String(province || '').trim()

  if (!normalizedCity && !normalizedProvince) return []

  const params = new URLSearchParams({
    city: normalizedCity,
    province: normalizedProvince,
    limit: String(limit),
  })

  const response = await fetch(`${API_BASE}/api/locations?${params}`)

  if (!response.ok) {
    throw new Error(`Location API error: ${response.status}`)
  }

  const results = await response.json()

  return Array.isArray(results) ? results : []
}

export function findLocationByTimezone(timezone) {
  const normalizedTimezone = String(timezone || '').trim()
  if (!normalizedTimezone) return null

  const matches = CITY_DATA
    .filter((record) => record.timezone === normalizedTimezone)
    .sort((a, b) => (Number(b.pop) || 0) - (Number(a.pop) || 0))

  return normalizeLocation(matches[0])
}

export function findLocation(city, countryCode = null) {
  const normalizedCity = String(city || '').trim().toLowerCase()
  if (!normalizedCity) return null

  const matches = CITY_DATA.filter((record) => {
    const city = String(record.city || '').toLowerCase()
    const ascii = String(record.city_ascii || '').toLowerCase()

    if (countryCode) {
      return (
        (city === normalizedCity || ascii === normalizedCity) &&
        String(record.iso2 || '').toLowerCase() ===
          String(countryCode).toLowerCase()
      )
    }

    return city === normalizedCity || ascii === normalizedCity
  })

  if (!matches.length) return null

  return normalizeLocation(
    matches.sort(
      (a, b) => (Number(b.pop) || 0) - (Number(a.pop) || 0)
    )[0]
  )
}

export async function findLocationById(id) {
  if (!id) return null

  const normalizedId = String(id)

  if (/^\d+(?:\.\d+){0,3}$/.test(normalizedId)) {
    const response = await fetch(
      `${API_BASE}/api/locations/${encodeURIComponent(normalizedId)}`
    )

    if (response.status === 404) return null

    if (!response.ok) {
      throw new Error(`Location API error: ${response.status}`)
    }

    return response.json()
  }

  const record = CITY_DATA.find((item) => {
    const latitude = Number(item.lat)
    const longitude = Number(item.lng)

    const recordId = [
      item.iso2 || '',
      item.city || '',
      item.province || '',
      latitude,
      longitude,
    ].join(':')

    return recordId === normalizedId
  })

  return normalizeLocation(record)
}

export function getLocationTimezone(location) {
  return location?.timezone || 'UTC'
}

export function getLocationUtcOffset(timezone, date = new Date()) {
  if (!timezone) return 'UTC+0'

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  }).formatToParts(date)

  return (
    parts.find((part) => part.type === 'timeZoneName')?.value
      ?.replace('GMT', 'UTC') || 'UTC+0'
  )
}

export function getTimezoneLabel(timezone, date = new Date()) {
  if (!timezone) return 'UTC'

  const indonesiaLabels = {
    'Asia/Jakarta': 'WIB',
    'Asia/Makassar': 'WITA',
    'Asia/Jayapura': 'WIT',
  }

  if (indonesiaLabels[timezone]) {
    return indonesiaLabels[timezone]
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  }).formatToParts(date)

  return parts.find((part) => part.type === 'timeZoneName')?.value || timezone
}


export function getPopularLocations(limit = 100) {
  return CITY_DATA
    .slice()
    .sort((a, b) => (Number(b.pop) || 0) - (Number(a.pop) || 0))
    .slice(0, limit)
    .map(normalizeLocation)
}
