const DETAIL_REGISTRY = {
  gregorian: {
    title: 'Gregorian Calendar',
    description: 'Core civil date system',
    group: 'calendar',
  },

  jawa: {
    title: 'Jawa Calendar',
    description:
      'Weton, pasaran, wuku, kurup, windu, and year cycle',
    group: 'calendar',
  },

  'saka-sunda': {
    title: 'Saka Sunda Calendar',
    description:
      'Saka Sunda date and year cycle',
    group: 'calendar',
  },

  bali: {
    title: 'Bali Calendar',
    description:
      'Balinese Pawukon cycle including Saptawara, Pancawara, and Wuku',
    group: 'calendar',
  },

  kalacakra: {
    title: 'Kalacakra',
    description:
      'Kalacakra day cycle including Indung, Poe, Uga, and Kala',
    group: 'calendar',
  },
  'chinese-lunar': {
    title: 'Chinese Lunar Calendar',
    description:
      'Chinese lunisolar calendar date and year cycle',
    group: 'calendar',
  },
}

export function getDetailDefinition(id) {
  return DETAIL_REGISTRY[id] || null
}

export function getCalendarDetailIds() {
  return Object.keys(DETAIL_REGISTRY)
}
