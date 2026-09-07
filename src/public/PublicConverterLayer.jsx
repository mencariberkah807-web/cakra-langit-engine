import { useEffect, useState } from 'react'
import { TodayProvider, useTodayContext } from '../core/TodayContext'
import { useAuth } from '../auth/AuthContext'
import PublicLayout from '../layouts/PublicLayout'
import PublicNavigation from './PublicNavigation'
import PublicHero from './PublicHero'
import PublicFeatureHighlights from './PublicFeatureHighlights'
import Ticker from '../cakra-ui/Ticker'
import { defaultSettings, fetchSiteSettings } from './siteSettings'

function PublicPageContent({ isAuthenticated, settings }) {
  const context = useTodayContext()
  const data = {
    ...context,
    ...(context.apiData || {}),
    location: context.location,
    selectedDate: context.selectedDate,
  }

  return (
    <>
      <PublicNavigation isAuthenticated={isAuthenticated} settings={settings} />
      <Ticker data={data} />
      <PublicHero data={data} isAuthenticated={isAuthenticated} settings={settings} />
      <PublicFeatureHighlights settings={settings} />
    </>
  )
}

export default function PublicConverterLayer() {
  const { isAuthenticated } = useAuth()
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    let active = true
    fetchSiteSettings().then((nextSettings) => {
      if (active) setSettings(nextSettings)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <PublicLayout>
      <TodayProvider>
        <PublicPageContent isAuthenticated={isAuthenticated} settings={settings} />
      </TodayProvider>
    </PublicLayout>
  )
}
