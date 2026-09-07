import { useEffect, useState } from 'react'
import { TodayProvider, useTodayContext } from '../core/TodayContext'
import { useAuth } from '../auth/AuthContext'
import PublicLayout from '../layouts/PublicLayout'
import PublicNavigation from './PublicNavigation'
import PublicHero from './PublicHero'
import PublicFeatureHighlights from './PublicFeatureHighlights'
import Ticker from '../cakra-ui/Ticker'
import { defaultSettings, fetchSiteSettings, resolveAssetUrl } from './siteSettings'

function PublicPageContent({ isAuthenticated, settings }) {
  const context = useTodayContext()
  const data = {
    ...context,
    ...(context.apiData || {}),
    location: context.location,
    selectedDate: context.selectedDate,
  }

  useEffect(() => {
    if (settings.page_title) document.title = settings.page_title
    if (settings.meta_description !== null) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = settings.meta_description || ''
    }

    const faviconUrl = resolveAssetUrl(settings.favicon)
    if (faviconUrl) {
      let link = document.querySelector('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = faviconUrl
    }
  }, [settings])

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
