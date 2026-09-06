export function createCalendarResult({
  id,
  title,
  primary = '',
  secondary = '',
  details = [],
  detail = null,
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
    detail,
    effectiveDate,
    boundary,
    events,
    meta,
  }
}