export const DEFAULT_LOCATION = {
  city: 'Bandung',
  province: 'Jawa Barat',
  country: 'Indonesia',
  timezone: 'Asia/Jakarta',
  timezoneLabel: 'WIB',
  latitude: -6.9175,
  longitude: 107.6191,
  elevation: null,
}

export const INDONESIAN_LOCATIONS = [
  {
    city: 'Bandung',
    province: 'Jawa Barat',
    country: 'Indonesia',
    timezone: 'Asia/Jakarta',
    timezoneLabel: 'WIB',
  },
  {
    city: 'Jakarta',
    province: 'DKI Jakarta',
    country: 'Indonesia',
    timezone: 'Asia/Jakarta',
    timezoneLabel: 'WIB',
  },
  {
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    country: 'Indonesia',
    timezone: 'Asia/Jakarta',
    timezoneLabel: 'WIB',
  },
  {
    city: 'Surabaya',
    province: 'Jawa Timur',
    country: 'Indonesia',
    timezone: 'Asia/Jakarta',
    timezoneLabel: 'WIB',
  },
  {
    city: 'Denpasar',
    province: 'Bali',
    country: 'Indonesia',
    timezone: 'Asia/Makassar',
    timezoneLabel: 'WITA',
  },
  {
    city: 'Makassar',
    province: 'Sulawesi Selatan',
    country: 'Indonesia',
    timezone: 'Asia/Makassar',
    timezoneLabel: 'WITA',
  },
  {
    city: 'Jayapura',
    province: 'Papua',
    country: 'Indonesia',
    timezone: 'Asia/Jayapura',
    timezoneLabel: 'WIT',
  },
]

export function createLocationContext(overrides = {}) {
  return {
    ...DEFAULT_LOCATION,
    ...overrides,
  }
}

export function findIndonesianLocation(city) {
  return INDONESIAN_LOCATIONS.find(
    (location) => location.city === city
  )
}
