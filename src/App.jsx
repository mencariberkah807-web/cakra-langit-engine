import { useAuth } from './auth/AuthContext'
import UserDashboardLayer from './auth/UserDashboardLayer'
import LoginPage from './auth/LoginPage'
import PublicConverterLayer from './public/PublicConverterLayer'

const authenticatedPaths = new Set([
  '/dashboard',
  '/dashboard/today',
  '/dashboard/natural',
  '/dashboard/birth-converter',
  '/dashboard/weton',
  '/dashboard/bazi',
  '/dashboard/paririmbon',
  '/dashboard/almanac',
  '/dashboard/history',
  '/dashboard/tasks',
  '/dashboard/profile',
  '/dashboard/settings',
])

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm text-[#64748B]">
      Memuat sesi…
    </main>
  )
}

export default function App() {
  const { loading, isAuthenticated } = useAuth()
  const path = window.location.pathname

  if (loading) return <LoadingScreen />

  if (path === '/login') {
    return isAuthenticated ? <UserDashboardLayer /> : <LoginPage />
  }

  if (authenticatedPaths.has(path)) {
    return isAuthenticated ? <UserDashboardLayer /> : <LoginPage />
  }

  return <PublicConverterLayer />
}
