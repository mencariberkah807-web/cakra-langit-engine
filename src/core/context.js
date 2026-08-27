import { createTimeContext } from './time'
import { createLocationContext } from './location'

export function createAlmanacContext({ date = new Date(), location = {} } = {}) {
  return {
    time: createTimeContext(date),
    location: createLocationContext(location),
  }
}