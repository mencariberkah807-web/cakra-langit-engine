import { useAuth } from '../auth/AuthContext'

export default function AdminPanel() {
  const { user, logout } = useAuth()

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-[#0F172A] sm:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Cakra Langit</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Admin Panel</h1>
            <p className="mt-2 text-sm text-[#64748B]">Pengelolaan konfigurasi situs.</p>
          </div>
          <button type="button" onClick={logout} className="rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC]">
            Keluar
          </button>
        </div>
        <section className="mt-7 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Selamat datang</div>
          <p className="mt-1 text-sm text-[#64748B]">{user?.email}</p>
        </section>
      </div>
    </main>
  )
}
