import { createTimeContext } from './time'
import { createLocationContext } from './location'

export function createAlmanacContext({ date = new Date(), location = {} } = {}) {
  return {
    time: createTimeContext(date),
    location: createLocationContext(location),
  }
}

export function createProfileContext({
  id = null,
  displayName = '',
  birthDate = null,
  birthTime = null,
  birthLocation = null,
} = {}) {
  return {
    id,
    displayName,
    birth: {
      date: birthDate,
      time: birthTime,
      location: birthLocation,
    },
  }
}
