import { TodayProvider } from './core/TodayContext'
import AppShell from './dashboard/AppShell'

export default function App() {
  return (
    <TodayProvider>
      <AppShell />
    </TodayProvider>
  )
}