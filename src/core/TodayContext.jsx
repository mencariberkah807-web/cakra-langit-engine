import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useAuth } from '../auth/AuthContext'
import { createAlmanacContext } from './context'
import {
  findLocation,
  findLocationById,
  getLocationUtcOffset,
  getTimezoneLabel,
  getPopularLocations,
  findLocationByTimezone,
} from '../services/locationService'

const TodayContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const LOCATION_STORAGE_KEY = 'personal-almanac:selected-location'

function getLocalDateISO(date, timezone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

async function fetchAlmanac(location, date, token, isLive = false) {
  if (!location || !date || !token) return null

  const params = new URLSearchParams({
    location_id: location.id,
    city: location.city,
    datetime_value: date.toISOString(),
  })

  if (!isLive) {
    params.set('date_value', getLocalDateISO(date, location.timezone))
  }

  const response = await fetch(`${API_BASE}/api/almanac?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Almanac API error: ${response.status}`)
  }

  return response.json()
}

function getMode(selectedDate, now) {
  const selectedTimestamp = selectedDate.getTime()
  const nowTimestamp = now.getTime()

  if (Math.abs(selectedTimestamp - nowTimestamp) < 1000) {
    return 'live'
  }

  return selectedTimestamp < nowTimestamp ? 'past' : 'future'
}

export function TodayProvider({ children }) {
  const { token } = useAuth()
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const browserLocation = findLocationByTimezone(browserTimezone)

    if (browserLocation?.countryCode === 'ID') {
      return browserLocation
    }

    return null
  })
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function restoreStoredLocation() {
      try {
        const storedId = window.localStorage.getItem(LOCATION_STORAGE_KEY)
        if (!storedId) return

        const storedLocation = await findLocationById(storedId)
        if (!cancelled && storedLocation) {
          setSelectedLocation(storedLocation)
        }
      } catch {
        // Ignore storage errors and keep the default location.
      }
    }

    restoreStoredLocation()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const activeDate = selectedDate ?? now

  useEffect(() => {
    try {
      if (selectedLocation?.id) {
        window.localStorage.setItem(
          LOCATION_STORAGE_KEY,
          selectedLocation.id
        )
      }
    } catch {
      // Ignore storage errors.
    }
  }, [selectedLocation])

  useEffect(() => {
    let cancelled = false

    fetchAlmanac(
      selectedLocation,
      activeDate,
      token,
      selectedDate === null
    )
      .then((result) => {
        if (!cancelled) setApiData(result)
      })
      .catch(() => {
        if (!cancelled) setApiData(null)
      })

    return () => {
      cancelled = true
    }
  }, [selectedLocation, activeDate, selectedDate, token])

  function setLocation(location) {
    setSelectedLocation(location)
  }

  function setLocationByCity(city, countryCode = null) {
    const location = findLocation(city, countryCode)
    if (!location) {
      throw new Error(`Unknown location: ${city}`)
    }
    setSelectedLocation(location)
  }

  async function setLocationById(id) {
    const location = await findLocationById(id)
    if (!location) {
      throw new Error(`Unknown location id: ${id}`)
    }
    setSelectedLocation(location)
  }

  const value = useMemo(() => {
    const almanacContext = createAlmanacContext({
      date: activeDate,
      location: selectedLocation,
    })

    const location = selectedLocation
      ? {
          ...selectedLocation,
          name: selectedLocation.city,
          region: selectedLocation.province,
          tz: selectedLocation.timezone,
          tz_label:
            selectedLocation.timezoneLabel ||
            getTimezoneLabel(selectedLocation.timezone, now),
          utc: getLocationUtcOffset(selectedLocation.timezone, now),
        }
      : null

    return {
      ...almanacContext,
      location,
      locations: getPopularLocations(100),
      apiData,
      selectedDate: activeDate,
      mode: getMode(activeDate, now),
      setSelectedDate,
      setLocation,
      setLocationByCity,
      setLocationById,
      goLive() {
        setSelectedDate(null)
      },
    }
  }, [activeDate, now, selectedLocation, apiData])

  return (
    <TodayContext.Provider value={value}>
      {children}
    </TodayContext.Provider>
  )
}

export function useTodayContext() {
  const context = useContext(TodayContext)

  if (!context) {
    throw new Error('useTodayContext must be used inside TodayProvider')
  }

  return context
}
