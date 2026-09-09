import cityTimezones from 'city-timezones'
const CITY_DATA = cityTimezones.cityMapping

function getIndonesiaTimezoneLabel(timezone) {
  switch (timezone) {
    case 'Asia/Jakarta': return 'WIB'
    case 'Asia/Makassar': return 'WITA'
    case 'Asia/Jayapura': return 'WIT'
    default: return null
  }
}

function normalizeLocation(record) {
  if (!record) return null
  const latitude = Number(record.lat)
  const longitude = Number(record.lng)
  return { id: [record.iso2 || '', record.city || '', record.province || '', latitude, longitude].join(':'), city: record.city, province: record.province || '', country: record.country || '', countryCode: record.iso2 || '', timezone: record.timezone, timezoneLabel: getIndonesiaTimezoneLabel(record.timezone), latitude, longitude, population: Number(record.pop) || 0 }
}

const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL || ''
function getApiBase() {
  if (typeof window !== 'undefined' && window.location.hostname.includes('-5173.app.github.dev')) {
    return ''
  }
  if (ENV_API_BASE) return ENV_API_BASE
  return 'http://127.0.0.1:8000'
}

function getLocalProvinces() {
  const unique = new Map()
  CITY_DATA.filter((record) => String(record.iso2 || '').toUpperCase() === 'ID' && record.province).forEach((record) => {
    const province = String(record.province).trim()
    const key = province.toLowerCase()
    if (!unique.has(key)) unique.set(key, { id: `ID:${province}`, city: province, province, country: 'Indonesia', countryCode: 'ID' })
  })
  return Array.from(unique.values())
}

export async function getIndonesiaProvinces() {
  const apiBase = getApiBase()
  try {
    const response = await fetch(`${apiBase}/api/provinces`)
    if (!response.ok) throw new Error(`Province API error: ${response.status}`)
    const results = await response.json()
    return Array.isArray(results) ? results : []
  } catch {
    return getLocalProvinces()
  }
}

function searchLocalLocations(city, province = '', limit = 20) {
  const normalizedCity = String(city || '').trim().toLowerCase()
  const normalizedProvince = String(province || '').trim().toLowerCase()
  return CITY_DATA.filter((record) => {
    if (String(record.iso2 || '').toUpperCase() !== 'ID') return false
    const recordCity = String(record.city || '').toLowerCase()
    const recordAscii = String(record.city_ascii || '').toLowerCase()
    const recordProvince = String(record.province || '').toLowerCase()
    const cityMatches = !normalizedCity || recordCity.includes(normalizedCity) || recordAscii.includes(normalizedCity)
    const provinceMatches = !normalizedProvince || recordProvince === normalizedProvince || recordProvince.includes(normalizedProvince)
    return cityMatches && provinceMatches
  }).sort((a, b) => (Number(b.pop) || 0) - (Number(a.pop) || 0)).slice(0, limit).map(normalizeLocation)
}

export async function searchLocations(city, province = '', limit = 20) {
  const normalizedCity = String(city || '').trim()
  const normalizedProvince = String(province || '').trim()
  if (!normalizedCity && !normalizedProvince) return []
  const params = new URLSearchParams({ city: normalizedCity, province: normalizedProvince, limit: String(limit) })
  const apiBase = getApiBase()
  try {
    const response = await fetch(`${apiBase}/api/locations?${params}`)
    if (!response.ok) throw new Error(`Location API error: ${response.status}`)
    const results = await response.json()
    return Array.isArray(results) ? results : []
  } catch {
    return searchLocalLocations(normalizedCity, normalizedProvince, limit)
  }
}

export function findLocationByTimezone(timezone) {
  const normalizedTimezone = String(timezone || '').trim()
  if (!normalizedTimezone) return null
  const matches = CITY_DATA.filter((record) => record.timezone === normalizedTimezone).sort((a, b) => (Number(b.pop) || 0) - (Number(a.pop) || 0))
  return normalizeLocation(matches[0])
}

export function findLocationByCoordinates(latitude, longitude) {
  const lat = Number(latitude), lng = Number(longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  const indonesiaMatches = CITY_DATA.filter((record) => String(record.iso2 || '').toUpperCase() === 'ID')
  if (!indonesiaMatches.length) return null
  const toRadians = (value) => (value * Math.PI) / 180
  const earthRadiusKm = 6371, lat1 = toRadians(lat), lng1 = toRadians(lng)
  let nearest = null, nearestDistance = Infinity
  for (const record of indonesiaMatches) {
    const recordLat = Number(record.lat), recordLng = Number(record.lng)
    if (!Number.isFinite(recordLat) || !Number.isFinite(recordLng)) continue
    const lat2 = toRadians(recordLat), lng2 = toRadians(recordLng), dLat = lat2 - lat1, dLng = lng2 - lng1
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    const distance = 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    if (distance < nearestDistance) { nearestDistance = distance; nearest = record }
  }
  return normalizeLocation(nearest)
}

export function findLocation(city, countryCode = null) {
  const normalizedCity = String(city || '').trim().toLowerCase()
  if (!normalizedCity) return null
  const matches = CITY_DATA.filter((record) => {
    const recordCity = String(record.city || '').toLowerCase(), ascii = String(record.city_ascii || '').toLowerCase()
    if (countryCode) return (recordCity === normalizedCity || ascii === normalizedCity) && String(record.iso2 || '').toLowerCase() === String(countryCode).toLowerCase()
    return recordCity === normalizedCity || ascii === normalizedCity
  })
  if (!matches.length) return null
  return normalizeLocation(matches.sort((a, b) => (Number(b.pop) || 0) - (Number(a.pop) || 0))[0])
}

export async function findLocationById(id) {
  if (!id) return null
  const normalizedId = String(id)
  if (/^\d+(?:\.\d+){0,3}$/.test(normalizedId)) {
    const response = await fetch(`${getApiBase()}/api/locations/${encodeURIComponent(normalizedId)}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Location API error: ${response.status}`)
    return response.json()
  }
  const record = CITY_DATA.find((item) => [item.iso2 || '', item.city || '', item.province || '', Number(item.lat), Number(item.lng)].join(':') === normalizedId)
  return normalizeLocation(record)
}

export function getLocationTimezone(location) { return location?.timezone || 'UTC' }

export function getLocationUtcOffset(timezone, date = new Date()) {
  if (!timezone) return 'UTC+0'
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' }).formatToParts(date)
  return parts.find((part) => part.type === 'timeZoneName')?.value?.replace('GMT', 'UTC') || 'UTC+0'
}

export function getTimezoneLabel(timezone, date = new Date()) {
  if (!timezone) return 'UTC'
  const indonesiaLabels = { 'Asia/Jakarta': 'WIB', 'Asia/Makassar': 'WITA', 'Asia/Jayapura': 'WIT' }
  if (indonesiaLabels[timezone]) return indonesiaLabels[timezone]
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' }).formatToParts(date)
  return parts.find((part) => part.type === 'timeZoneName')?.value || timezone
}

export function getPopularLocations(limit = 100) {
  return CITY_DATA.slice().sort((a, b) => (Number(b.pop) || 0) - (Number(a.pop) || 0)).slice(0, limit).map(normalizeLocation)
}
