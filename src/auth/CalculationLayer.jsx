import AppShell from '../dashboard/AppShell'
import { useAuth } from './AuthContext'

export default function CalculationLayer() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-end gap-3 border-b border-[#E2E8F0] bg-white px-4 py-2 text-xs text-[#64748B]">
        <span>{user?.display_name || user?.email}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-[#CBD5E1] px-2.5 py-1.5 font-medium text-[#334155] hover:bg-[#F8FAFC]"
        >
          Keluar
        </button>
      </div>
      <AppShell />
    </div>
  )
}
