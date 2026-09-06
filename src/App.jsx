import { useAuth } from './auth/AuthContext'
import CalculationLayer from './auth/CalculationLayer'
import LoginPage from './auth/LoginPage'
import PublicConverterLayer from './public/PublicConverterLayer'

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
    return isAuthenticated ? <CalculationLayer /> : <LoginPage />
  }

  if (path === '/calculation') {
    return isAuthenticated ? <CalculationLayer /> : <LoginPage />
  }

  return <PublicConverterLayer />
}
