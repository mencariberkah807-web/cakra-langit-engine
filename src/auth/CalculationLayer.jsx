import { TodayProvider } from '../core/TodayContext'
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
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Cakra Langit</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
      </div>
    </section>
  )
}

function CalculationContent({ displayName }) {
  const path = window.location.pathname

  if (path === '/calculation') return <CalculationDashboard displayName={displayName} />
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
