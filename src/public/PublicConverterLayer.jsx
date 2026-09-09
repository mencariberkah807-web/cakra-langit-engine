import { TodayProvider } from '../core/TodayContext'
import { LanguageProvider } from '../core/LanguageContext'
import { useAuth } from '../auth/AuthContext'
import DashboardHome from '../dashboard/DashboardHome'

export default function PublicConverterLayer() {
  const { isAuthenticated } = useAuth()

  return (
    <LanguageProvider>
      <TodayProvider>
        <DashboardHome showFooter={true} user={isAuthenticated ? undefined : null} />
        {!isAuthenticated && (
          <div className="fixed right-5 top-5 z-50 flex items-center gap-2">
            <a
              href="/login"
              className="rounded-md border border-cyan-300/25 bg-[#0D2535]/90 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur hover:bg-[#12324A]"
            >
              Masuk
            </a>
            <a
              href="/login"
              className="rounded-md bg-[#2563EB] px-4 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
            >
              Daftar
            </a>
          </div>
        )}
      </TodayProvider>
    </LanguageProvider>
  )
}
