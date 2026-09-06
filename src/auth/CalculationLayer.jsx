import { TodayProvider } from '../core/TodayContext'
import AppShell from '../dashboard/AppShell'
import CalculationDashboard from './CalculationDashboard'
import { useAuth } from './AuthContext'
import GlobalShell from '../cakra-ui/GlobalShell'

export default function CalculationLayer() {
  const { user, logout } = useAuth()

  return (
    <TodayProvider>
      <GlobalShell user={user} onLogout={logout}>
        <main>
          <section className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
              <div className="text-sm font-medium text-slate-500">Good morning,</div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{user?.display_name || user?.email?.split('@')[0] || 'Pengguna'}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Temukan petunjuk hari ini melalui alam dan berbagai sistem kalender Cakra Langit.</p>
            </div>
          </section>

          <AppShell />
          <CalculationDashboard />
        </main>
      </GlobalShell>
    </TodayProvider>
  )
}
