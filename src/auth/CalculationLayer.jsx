import { TodayProvider } from '../core/TodayContext'
import AppShell from '../dashboard/AppShell'
import CalculationDashboard from './CalculationDashboard'
import SettingsPage from './SettingsPage'
import { useAuth } from './AuthContext'
import GlobalShell from '../cakra-ui/GlobalShell'

const pageMap = {
  '/calculation/today': ['Kalkulasi Hari Ini', 'Konteks kalkulasi untuk hari ini.'],
  '/calculation/natural': ['Natural Layer', 'Eksplorasi lapisan perhitungan alam.'],
  '/calculation/birth-converter': ['Birth Converter', 'Konversi data kelahiran untuk kalkulasi personal.'],
  '/calculation/weton': ['Weton', 'Kalkulasi dan informasi Weton.'],
  '/calculation/bazi': ['BaZi', 'Kalkulasi dan informasi BaZi.'],
  '/calculation/paririmbon': ['Paririmbon', 'Kalkulasi dan referensi Paririmbon.'],
  '/calculation/almanac': ['Almanac', 'Informasi almanak personal.'],
  '/calculation/history': ['Riwayat', 'Riwayat kalkulasi personal.'],
  '/calculation/tasks': ['Personal Tasks', 'Daftar tugas personal.'],
  '/calculation/profile': ['Profil Saya', 'Informasi dan data profil pengguna.'],
}

function PagePlaceholder({ title, description }) {
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Cakra Langit</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
      </div>
    </section>
  )
}

function CalculationContent({ displayName }) {
  const path = window.location.pathname

  if (path === '/calculation') {
    return (
      <>
        <section className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
            <div className="text-sm font-medium text-slate-500">Good morning,</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{displayName}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Temukan petunjuk hari ini melalui alam dan berbagai sistem kalender Cakra Langit.</p>
          </div>
        </section>
        <AppShell />
        <CalculationDashboard />
      </>
    )
  }

  if (path === '/calculation/settings') return <SettingsPage />

  const page = pageMap[path]
  if (page) return <PagePlaceholder title={page[0]} description={page[1]} />

  return <PagePlaceholder title="Halaman Tidak Ditemukan" description="Halaman Cakra Langit yang diminta tidak tersedia." />
}

export default function CalculationLayer() {
  const { user, logout } = useAuth()
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Pengguna'

  return (
    <TodayProvider>
      <GlobalShell user={user} onLogout={logout}>
        <main>
          <CalculationContent displayName={displayName} />
        </main>
      </GlobalShell>
    </TodayProvider>
  )
}
