import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { createAlmanacContext } from './context'
import {
  findLocation,
  findLocationByCoordinates,
  findLocationById,
  getLocationUtcOffset,
  getTimezoneLabel,
  getPopularLocations,
  findLocationByTimezone,
} from '../services/locationService'

const TodayContext = createContext(null)

const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const LOCATION_STORAGE_KEY = 'personal-almanac:selected-location'
const LOCATION_SOURCE_STORAGE_KEY = 'personal-almanac:selected-location-source'

function getApiBase() {
  if (ENV_API_BASE) return ENV_API_BASE
  if (typeof window !== 'undefined' && window.location.hostname.includes('-5173.app.github.dev')) {
    return `https://${window.location.hostname.replace('-5173.app.github.dev', '-8000.app.github.dev')}`
  }
  return 'http://127.0.0.1:8000'
}

function getLocalDateISO(date, timezone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

async function fetchAlmanac(location, date, isLive = false) {
  if (!location || !date) return null

  const params = new URLSearchParams({
    city: location.city,
    datetime_value: date.toISOString(),
  })

  if (location.id && !String(location.id).includes(':')) {
    params.set('location_id', location.id)
  }

  if (!isLive) {
    params.set('date_value', getLocalDateISO(date, location.timezone))
  }

  const response = await fetch(`${getApiBase()}/api/almanac?${params}`)

  if (!response.ok) {
    throw new Error(`Almanac API error: ${response.status}`)
  }

  return response.json()
}

function getMode(selectedDate, now) {
  const selectedTimestamp = selectedDate.getTime()
  const nowTimestamp = now.getTime()

  if (Math.abs(selectedTimestamp - nowTimestamp) < 1000) return 'live'
  return selectedTimestamp < nowTimestamp ? 'past' : 'future'
}

function formatSelectedTime(date, timezone) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function applyTimeToDate(date, time) {
  if (!date || !time) return date
  const [hours, minutes, seconds = 0] = time.split(':').map(Number)
  const next = new Date(date)
  next.setHours(hours || 0, minutes || 0, seconds || 0, 0)
  return next
}

export function TodayProvider({ children }) {
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDateState] = useState(null)
  const [selectedTimeState, setSelectedTimeState] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const browserLocation = findLocationByTimezone(browserTimezone)
    if (browserLocation?.countryCode === 'ID') return browserLocation
    return null
  })
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function initializeLocation() {
      let storedId = null
      let storedSource = null

      try {
        storedId = window.localStorage.getItem(LOCATION_STORAGE_KEY)
        storedSource = window.localStorage.getItem(LOCATION_SOURCE_STORAGE_KEY)
      } catch {}

      if (storedSource === 'manual' && storedId) {
        try {
          const storedLocation = await findLocationById(storedId)
          if (!cancelled && storedLocation) setSelectedLocation(storedLocation)
          return
        } catch {}
      }

      if (!navigator.geolocation) return

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const browserLocation = findLocationByCoordinates(coords.latitude, coords.longitude)
          if (!browserLocation || browserLocation.countryCode !== 'ID') return

          if (!cancelled) {
            setSelectedLocation(browserLocation)
            try {
              window.localStorage.setItem(LOCATION_STORAGE_KEY, browserLocation.id)
              window.localStorage.setItem(LOCATION_SOURCE_STORAGE_KEY, 'browser')
            } catch {}
          }
        },
        () => {},
        { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 }
      )
    }

    initializeLocation()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const liveMode = selectedDate === null
  const activeTimezone = selectedLocation?.timezone || 'Asia/Jakarta'
  const liveTime = formatSelectedTime(now, activeTimezone)
  const selectedTime = selectedTimeState || (liveMode ? liveTime : '12:00:00')
  const activeDate = liveMode ? now : applyTimeToDate(selectedDate, selectedTime)
  const almanacFetchDate = liveMode
    ? new Date(Math.floor(now.getTime() / 60000) * 60000)
    : activeDate

  useEffect(() => {
    let cancelled = false

    fetchAlmanac(selectedLocation, almanacFetchDate, liveMode)
      .then((result) => {
        if (!cancelled) setApiData(result)
      })
      .catch(() => {
        if (!cancelled) setApiData(null)
      })

    return () => { cancelled = true }
  }, [selectedLocation, almanacFetchDate, liveMode])

  function setSelectedDate(date) {
    if (!date) {
      setSelectedDateState(null)
      setSelectedTimeState(null)
      return
    }
    setSelectedDateState(date)
    setSelectedTimeState('12:00:00')
  }

  function setSelectedTime(time) {
    if (!time) return
    const normalized = time.length === 5 ? `${time}:00` : time
    setSelectedTimeState(normalized)
  }

  function setLocation(location) {
    setSelectedLocation(location)
    try {
      if (location?.id) {
        window.localStorage.setItem(LOCATION_STORAGE_KEY, location.id)
        window.localStorage.setItem(LOCATION_SOURCE_STORAGE_KEY, 'manual')
      }
    } catch {}
  }

  function setLocationByCity(city, countryCode = null) {
    const location = findLocation(city, countryCode)
    if (!location) throw new Error(`Unknown location: ${city}`)
    setLocation(location)
  }

  async function setLocationById(idOrLocation) {
    if (idOrLocation && typeof idOrLocation === 'object') {
      setLocation(idOrLocation)
      return
    }
    const location = await findLocationById(idOrLocation)
    if (!location) throw new Error(`Unknown location id: ${idOrLocation}`)
    setLocation(location)
  }

  const value = useMemo(() => {
    const almanacContext = createAlmanacContext({ date: activeDate, location: selectedLocation })
    const location = selectedLocation
      ? {
          ...selectedLocation,
          name: selectedLocation.city,
          region: selectedLocation.province,
          tz: selectedLocation.timezone,
          tz_label: selectedLocation.timezoneLabel || getTimezoneLabel(selectedLocation.timezone, now),
          utc: getLocationUtcOffset(selectedLocation.timezone, now),
        }
      : null

    return {
      ...almanacContext,
      location,
      locations: getPopularLocations(100),
      apiData,
      now,
      selectedDate: activeDate,
      selectedTime,
      mode: getMode(activeDate, now),
      setSelectedDate,
      setSelectedTime,
      setLocation,
      setLocationByCity,
      setLocationById,
      goLive() {
        setSelectedDateState(null)
        setSelectedTimeState(null)
      },
    }
  }, [activeDate, now, selectedLocation, apiData, selectedTime, liveMode])

  return <TodayContext.Provider value={value}>{children}</TodayContext.Provider>
}

export function useTodayContext() {
  const context = useContext(TodayContext)
  if (!context) throw new Error('useTodayContext must be used inside TodayProvider')
  return context
}
