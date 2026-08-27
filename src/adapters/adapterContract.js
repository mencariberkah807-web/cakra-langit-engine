export function createCalendarResult({
  id,
  title,
  primary = '',
  secondary = '',
  details = [],
  effectiveDate = null,
  boundary = 'ENGINE_SPECIFIC',
  events = [],
  meta = {},
}) {
  return {
    id,
    title,
    primary,
    secondary,
    details,
    effectiveDate,
    boundary,
    events,
    meta,
  }
}