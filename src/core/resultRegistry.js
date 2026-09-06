import { adaptGregorian } from '../adapters/gregorian.adapter.js'
import { adaptJawaCalendar } from '../adapters/jawa.adapter.js'
import { adaptSakaSunda } from '../adapters/sakaSunda.adapter.js'
import { adaptBaliCalendar } from '../adapters/bali.adapter.js'
import { adaptKalacakraCalendar } from '../adapters/kalacakra.adapter.js'
import { adaptChineseLunar } from '../adapters/chineseLunar.adapter.js'
import { adaptHijri } from '../adapters/hijri.adapter.js'

import { adaptSun } from '../adapters/sun.adapter.js'
import { adaptMoon } from '../adapters/moon.adapter.js'
import { adaptEclipse } from '../adapters/eclipse.adapter.js'
import { adaptSky } from '../adapters/sky.adapter.js'
import { adaptEarthSpace } from '../adapters/earth.adapter.js'
import { adaptTide } from '../adapters/tide.adapter.js'

export const RESULT_REGISTRY = [
  {
    id: 'gregorian',
    group: 'calendar',
    adapt: adaptGregorian,
  },
  {
    id: 'jawa',
    group: 'calendar',
    adapt: adaptJawaCalendar,
  },
  {
    id: 'saka-sunda',
    group: 'calendar',
    adapt: adaptSakaSunda,
  },
  {
    id: 'bali',
    group: 'calendar',
    adapt: adaptBaliCalendar,
  },
  {
    id: 'kalacakra',
    group: 'calendar',
    adapt: adaptKalacakraCalendar,
  },
  {
    id: 'chinese-lunar',
    group: 'calendar',
    adapt: adaptChineseLunar,
  },
  {
    id: 'hijri',
    group: 'calendar',
    adapt: adaptHijri,
  },

  {
    id: 'sun',
    group: 'natural',
    adapt: adaptSun,
  },
  {
    id: 'moon',
    group: 'natural',
    adapt: adaptMoon,
  },
  {
    id: 'eclipse',
    group: 'natural',
    adapt: adaptEclipse,
  },
  {
    id: 'sky',
    group: 'natural',
    adapt: adaptSky,
  },
  {
    id: 'earth-space',
    group: 'natural',
    adapt: adaptEarthSpace,
  },
  {
    id: 'tide',
    group: 'natural',
    adapt: adaptTide,
  },
]

export function getResultsByGroup(group, context) {
  return RESULT_REGISTRY
    .filter((entry) => entry.group === group)
    .map((entry) => entry.adapt(context))
}

export function getCalendarLayerResults(context) {
  const calendarIds = new Set([
    'jawa',
    'saka-sunda',
    'bali',
    'kalacakra',
    'chinese-lunar',
    'hijri',
  ])

  return RESULT_REGISTRY
    .filter(
      (entry) =>
        entry.group === 'calendar' &&
        calendarIds.has(entry.id)
    )
    .map((entry) => entry.adapt(context))
}
