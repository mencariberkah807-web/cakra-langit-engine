import { adaptSun } from '../../adapters/sun.adapter.js'
import { adaptEclipse } from '../../adapters/eclipse.adapter.js'

function normalizeTimedEvent(event, source, date) {
  return {
    id: `${source}:${event.id}`,
    source,
    title: event.title ?? event.name ?? 'Untitled event',
    type: event.type ?? 'GENERAL',
    date,
    time: event.time,
    timing: 'TIMED',
    meta: event.meta ?? {},
  }
}

function normalizeAllDayEvent(event, source, fallbackDate) {
  return {
    id: `${source}:${event.id}`,
    source,
    title: event.title ?? event.name ?? 'Untitled event',
    type: event.type ?? 'GENERAL',
    date: event.date ?? fallbackDate,
    time: null,
    timing: 'ALL_DAY',
    meta: event.meta ?? {},
  }
}

function normalizeEvents(result, source, fallbackDate) {
  return (result.events ?? []).map((event) => {
    if (event.time) {
      return normalizeTimedEvent(
        event,
        source,
        event.date ?? fallbackDate
      )
    }

    return normalizeAllDayEvent(
      event,
      source,
      fallbackDate
    )
  })
}

function getContextDate(context) {
  return context.time.instant
    .toLocaleDateString('en-CA', {
      timeZone: context.location.timezone,
    })
}

function sortTimelineItems(items) {
  return [...items].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date)
    }

    if (a.timing !== b.timing) {
      return a.timing === 'ALL_DAY' ? -1 : 1
    }

    if (a.timing === 'TIMED') {
      return a.time.localeCompare(b.time)
    }

    return a.title.localeCompare(b.title)
  })
}

export function getDailyTimeline(context) {
  const date = getContextDate(context)

  const sources = [
    {
      id: 'sun',
      result: adaptSun(context),
    },
    {
      id: 'eclipse',
      result: adaptEclipse(context),
    },
  ]

  const items = sources.flatMap((source) =>
    normalizeEvents(
      source.result,
      source.id,
      date
    )
  )

  return sortTimelineItems(items)
}
