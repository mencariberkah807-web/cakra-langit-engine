export function createTimeContext(date = new Date()) {
  return {
    instant: date,
    timestamp: date.getTime(),
  }
}

export function formatGregorian(
  date,
  locale = 'id-ID',
  timezone
) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(date)
}

export function formatClock(
  date,
  locale = 'id-ID',
  timezone
) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(date)
}
