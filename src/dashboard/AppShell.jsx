import { useState } from 'react'

import TodayHeader from './today/TodayHeader'
import CalendarLayer from './today/CalendarLayer'
import NaturalLayer from './today/NaturalLayer'
import Timeline from './timeline/Timeline'

import CalendarDetail from './calendar-detail/CalendarDetail'

import { useTodayContext } from '../core/TodayContext'
import { getResultsByGroup } from '../core/resultRegistry.js'

export default function AppShell() {
  const [selectedResultId, setSelectedResultId] =
    useState(null)

  const context = useTodayContext()

  const calendarResults = getResultsByGroup(
    'calendar',
    context
  )

  const selectedResult =
    calendarResults.find(
      (result) => result.id === selectedResultId
    ) || null

  return (
    <main className="app-shell">
      <TodayHeader />

      <CalendarLayer
        selectedResultId={selectedResultId}
        onSelectResult={setSelectedResultId}
      />

      {selectedResult && (
        <CalendarDetail
          result={selectedResult}
        />
      )}

      <NaturalLayer />

      <Timeline />
    </main>
  )
}
