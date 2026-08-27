export function getGregorianCalendar(context) {
  const { time } = context

  return {
    date: time.instant,
    timestamp: time.timestamp,
  }
}
