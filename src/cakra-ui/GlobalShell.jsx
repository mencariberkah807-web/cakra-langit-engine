import { useState } from 'react'

const primaryNav = [
  ['⌂', 'Dashboard'],
  ['☼', 'Kalkulasi Hari Ini'],
  ['◈', 'Natural Layer'],
  ['♙', 'Birth Converter'],
  ['▣', 'Weton'],
  ['東', 'BaZi'],
  ['▤', 'Paririmbon'],
  ['☾', 'Almanac'],
  ['↶', 'Riwayat'],
]

const personalNav = [
  ['☑', 'Personal Tasks'],
  ['♙', 'Profil Saya'],
  ['⚙', 'Pengaturan'],
]

function Navigation({ onLogout, mobile = false }) {
  return (
    <nav className={mobile ? 'space-y-1 px-2 pb-4' : 'flex-1 px-3 text-sm text-slate-700'}>
      {primaryNav.map(([icon, label], index) => (
        <div
          key={label}
          className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${index === 0 ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-700'}`}
        >
          <span className="w-5 text-center text-lg">{icon}</span>
          <span>{label}</span>
        </div>
      ))}
      <div className="my-5 border-t border-slate-200" />
      {personalNav.map(([icon, label]) => (
        <div key={label} className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700">
          <span className="w-5 text-center text-lg">{icon}</span>
          <span>{label}</span>
        </div>
      ))}
      {mobile && (
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600"
        >
          Keluar
        </button>
      )}
    </nav>
  )
}

export default function GlobalShell({ user, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const displayName = user?.display_name || user?.email || 'Pengguna'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[230px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="px-6 pb-5 pt-7 text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-700">✧</div>
            <div className="font-serif text-xl tracking-wide text-slate-900">CAKRA LANGIT</div>
            <div className="text-xs text-slate-500">Personal Almanac</div>
          </div>
          <Navigation onLogout={onLogout} />
          <div className="px-6 pb-5 text-center">
            <div className="mb-3 text-left font-serif text-sm italic leading-5 text-slate-600">“Langit, Waktu,<br />Manusia, Harmoni.”</div>
            <button type="button" onClick={onLogout} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
              Keluar
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[72px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Buka navigasi"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="mr-3 rounded-lg border border-slate-200 px-2.5 py-1.5 text-lg text-slate-600 lg:hidden"
            >
              ☰
            </button>
            <div>
              <div className="text-xs font-medium tracking-wide text-slate-500">CAKRA LANGIT</div>
              <div className="text-sm font-semibold text-slate-900">Personal Almanac</div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">{initials}</div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                <div className="text-xs text-slate-500">Akun Saya</div>
              </div>
            </div>
          </header>

          {mobileOpen && (
            <div className="fixed inset-x-0 top-[72px] z-30 border-b border-slate-200 bg-white px-3 py-3 shadow-lg lg:hidden">
              <Navigation mobile onLogout={onLogout} />
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
