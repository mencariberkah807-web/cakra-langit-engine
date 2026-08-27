import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { createAlmanacContext } from './context'
import {
  DEFAULT_LOCATION,
  findIndonesianLocation,
} from './location'

const TodayContext = createContext(null)

function getMode(selectedDate, now) {
  const selectedTimestamp = selectedDate.getTime()
  const nowTimestamp = now.getTime()

  if (Math.abs(selectedTimestamp - nowTimestamp) < 1000) {
    return 'live'
  }

  return selectedTimestamp < nowTimestamp
    ? 'past'
    : 'future'
}

export function TodayProvider({ children }) {
  const [now, setNow] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedLocation, setSelectedLocation] =
    useState(DEFAULT_LOCATION)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const activeDate = selectedDate ?? now

  function setLocation(location) {
    setSelectedLocation(location)
  }

  function setLocationByCity(city) {
    const location = findIndonesianLocation(city)

    if (!location) {
      throw new Error(`Unknown Indonesian location: ${city}`)
    }

    setSelectedLocation(location)
  }

  const value = useMemo(() => {
    const almanacContext = createAlmanacContext({
      date: activeDate,
      location: selectedLocation,
    })

    return {
      ...almanacContext,

      selectedDate: activeDate,
      mode: getMode(activeDate, now),

      setSelectedDate,
      setLocation,
      setLocationByCity,

      goLive() {
        setSelectedDate(null)
      },
    }
  }, [activeDate, now, selectedLocation])

  return (
    <TodayContext.Provider value={value}>
      {children}
    </TodayContext.Provider>
  )
}

export function useTodayContext() {
  const context = useContext(TodayContext)

  if (!context) {
    throw new Error(
      'useTodayContext must be used inside TodayProvider'
    )
  }

  return context
}
