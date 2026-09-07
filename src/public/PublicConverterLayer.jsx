import { TodayProvider, useTodayContext } from '../core/TodayContext'
import { useAuth } from '../auth/AuthContext'
import PublicLayout from '../layouts/PublicLayout'
import PublicNavigation from './PublicNavigation'
import PublicHero from './PublicHero'
import PublicFeatureHighlights from './PublicFeatureHighlights'
import Ticker from '../cakra-ui/Ticker'

function PublicPageContent({ isAuthenticated }) {
  const context = useTodayContext()
  const data = {
    ...context,
    ...(context.apiData || {}),
    location: context.location,
    selectedDate: context.selectedDate,
  }

  return (
    <>
      <PublicNavigation isAuthenticated={isAuthenticated} />
      <PublicHero data={data} isAuthenticated={isAuthenticated} />
      <PublicFeatureHighlights />
      <Ticker data={data} />
    </>
  )
}

export default function PublicConverterLayer() {
  const { isAuthenticated } = useAuth()

  return (
    <PublicLayout>
      <TodayProvider>
        <PublicPageContent isAuthenticated={isAuthenticated} />
      </TodayProvider>
    </PublicLayout>
  )
}
