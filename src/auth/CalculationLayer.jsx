import { TodayProvider } from '../core/TodayContext'
import AppShell from '../dashboard/AppShell'
import CalculationDashboard from './CalculationDashboard'
import { useAuth } from './AuthContext'

export default function CalculationLayer() {
  const { user, logout } = useAuth()

  return (
    <TodayProvider>
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="flex min-h-screen">
          <aside className="hidden w-[230px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
            <div className="px-6 pb-5 pt-7 text-center">
              <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-700">✧</div>
              <div className="font-serif text-xl tracking-wide text-slate-900">CAKRA LANGIT</div>
              <div className="text-xs text-slate-500">Personal Almanac</div>
            </div>
            <nav className="flex-1 px-3 text-sm text-slate-700">
              {[
                ['⌂', 'Dashboard', true],
                ['☼', 'Kalkulasi Hari Ini'],
                ['◈', 'Natural Layer'],
                ['♙', 'Birth Converter'],
                ['▣', 'Weton'],
                ['東', 'BaZi'],
                ['▤', 'Paririmbon'],
                ['☾', 'Almanac'],
                ['↶', 'Riwayat'],
              ].map(([icon, label, active]) => (
                <div key={label} className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 ${active ? 'bg-blue-50 font-medium text-blue-700' : ''}`}>
                  <span className="w-5 text-center text-lg">{icon}</span><span>{label}</span>
                </div>
              ))}
              <div className="my-5 border-t border-slate-200" />
              {[
                ['☑', 'Personal Tasks'],
                ['♙', 'Profil Saya'],
                ['⚙', 'Pengaturan'],
              ].map(([icon, label]) => (
                <div key={label} className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <span className="w-5 text-center text-lg">{icon}</span><span>{label}</span>
                </div>
              ))}
            </nav>
            <div className="px-6 pb-5 text-center">
              <div className="mb-3 text-left font-serif text-sm italic leading-5 text-slate-600">“Langit, Waktu,<br />Manusia, Harmoni.”</div>
              <button onClick={logout} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Keluar</button>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
              <div>
                <div className="text-xs font-medium text-slate-500">CAKRA LANGIT</div>
                <div className="text-sm font-semibold text-slate-900">Personal Almanac</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {(user?.display_name || user?.email || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-slate-900">{user?.display_name || user?.email}</div>
                  <div className="text-xs text-slate-500">Akun Saya</div>
                </div>
              </div>
            </header>

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
          </div>
        </div>
      </div>
    </TodayProvider>
  )
}
