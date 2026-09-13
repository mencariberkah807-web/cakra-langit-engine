import { TodayProvider } from '../core/TodayContext'
import { LanguageProvider } from '../core/LanguageContext'
import UserLayout from '../layouts/UserLayout'
import DashboardHome from '../dashboard/DashboardHome'
import WetonFullReadingPage from '../dashboard/WetonFullReadingPage'
import WetonJodohPage from '../dashboard/WetonJodohPage'
import ProfilePage from '../dashboard/ProfilePage'
import ProfileOverviewPage from '../dashboard/ProfileOverviewPage'
import BaZiPage from '../dashboard/BaZiPage'
import ParirimbonPage from '../dashboard/ParirimbonPage'
import PalelintanganPage from '../dashboard/PalelintanganPage'
import { useAuth } from './AuthContext'

const pageMap = {
  '/dashboard/today': ['Kalkulasi Hari Ini', 'Konteks kalkulasi untuk hari ini.'],
  '/dashboard/natural': ['Natural Layer', 'Eksplorasi lapisan perhitungan alam.'],
  '/dashboard/birth-converter': ['Birth Converter', 'Konversi data kelahiran untuk kalkulasi personal.'],
  '/dashboard/palintangan': ['Palintangan Sunda', 'Kalkulasi dan referensi Palintangan Sunda.'],
  '/dashboard/bazi': ['BaZi', 'Kalkulasi dan informasi BaZi.'],
  '/dashboard/paririmbon': ['Paririmbon', 'Kalkulasi dan referensi Paririmbon.'],
  '/dashboard/palelintangan': ['Palelintangan Bali', 'Kalkulasi dan referensi Palelintangan Bali.'],
  '/dashboard/almanac': ['Almanac', 'Informasi almanak personal.'],
  '/dashboard/history': ['Riwayat', 'Riwayat kalkulasi personal.'],
  '/dashboard/tasks': ['Personal Tasks', 'Daftar tugas personal.'],
}

function PagePlaceholder({ title, description }) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
      <div className="rounded-xl border border-slate-800 bg-[#081522] px-6 py-7 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400/75">Cakra Langit</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>
      </div>
    </section>
  )
}

function UserDashboardContent({ user, onUserUpdated }) {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/dashboard') {
    return <DashboardHome showFooter={true} user={user} />
  }

  if (path === '/dashboard/weton') {
    return <WetonFullReadingPage />
  }

  if (path === '/dashboard/weton/jodoh' || path === '/dashboard/weton/jodoh/hitung') {
    return <WetonJodohPage />
  }

  if (path === '/dashboard/profile') {
    return <ProfileOverviewPage user={user} />
  }

  if (path === '/dashboard/profile/edit') {
    return <ProfilePage user={user} onUserUpdated={onUserUpdated} />
  }

  if (path === '/dashboard/bazi') {
    return <BaZiPage />
  }

  if (path === '/dashboard/paririmbon') {
    return <ParirimbonPage />
  }

  if (path === '/dashboard/palelintangan') {
    return <PalelintanganPage />
  }

  const page = pageMap[path]
  if (page) return <PagePlaceholder title={page[0]} description={page[1]} />

  return <PagePlaceholder title="Halaman Tidak Ditemukan" description="Halaman Cakra Langit yang diminta tidak tersedia." />
}

export default function UserDashboardLayer() {
  const { user, logout, updateUser } = useAuth()

  return (
    <LanguageProvider>
      <TodayProvider>
        <UserLayout user={user} onLogout={logout}>
          <UserDashboardContent user={user} onUserUpdated={updateUser} />
        </UserLayout>
      </TodayProvider>
    </LanguageProvider>
  )
}
