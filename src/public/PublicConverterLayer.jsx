import { TodayProvider } from '../core/TodayContext'
import AppShell from '../dashboard/AppShell'
import { useAuth } from '../auth/AuthContext'

export default function PublicConverterLayer() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <TodayProvider>
        <AppShell />
      </TodayProvider>
      <a
        href={isAuthenticated ? '/calculation' : '/login'}
        className="fixed right-5 top-5 z-50 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
      >
        {isAuthenticated ? 'Akun Saya' : 'Masuk'}
      </a>
    </>
  )
}
