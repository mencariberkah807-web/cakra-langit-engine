import { useAuth } from './auth/AuthContext'
import UserDashboardLayer from './auth/UserDashboardLayer'
import LoginPage from './auth/LoginPage'
import PublicConverterLayer from './public/PublicConverterLayer'
import AdminLogin from './admin/AdminLogin'
import AdminPanel from './admin/AdminPanel'

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
  const { loading, isAuthenticated, user } = useAuth()
  const rawPath = window.location.pathname

  if (loading) return <LoadingScreen />

  // Private admin entry point. The backend role remains the real security boundary.
  if (rawPath === '/saehu' || rawPath.startsWith('/saehu/')) {
    return isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <AdminLogin />
  }

  // /calculation was the former application route. It is an engine/domain name,
  // not a user-facing page. Keep legacy links from exposing that route.
  if (rawPath === '/calculation' || rawPath.startsWith('/calculation/')) {
    window.location.replace('/dashboard')
    return <LoadingScreen />
  }

  const path = rawPath

  if (path === '/login') {
    return isAuthenticated ? <UserDashboardLayer /> : <LoginPage />
  }

  if (authenticatedPaths.has(path)) {
    return isAuthenticated ? <UserDashboardLayer /> : <LoginPage />
  }

  return <PublicConverterLayer />
}
