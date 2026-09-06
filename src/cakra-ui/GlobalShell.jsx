import { useEffect, useState } from 'react'
import { Bell, CalendarDays, ChevronDown, CircleUserRound, Home, Leaf, ListChecks, Moon, Settings, Sparkles, Sun, UserRound, WandSparkles } from 'lucide-react'
import { getImage } from './imagePreferences'

export const primaryNav = [
  [Home, 'Dashboard', '/dashboard'],
  [Sun, 'Kalkulasi Hari Ini', '/dashboard/today'],
  [Leaf, 'Natural Layer', '/dashboard/natural'],
  [WandSparkles, 'Birth Converter', '/dashboard/birth-converter'],
  [Sparkles, 'Weton', '/dashboard/weton'],
  [CircleUserRound, 'BaZi', '/dashboard/bazi'],
  [ListChecks, 'Paririmbon', '/dashboard/paririmbon'],
  [Moon, 'Almanac', '/dashboard/almanac'],
  [CalendarDays, 'Riwayat', '/dashboard/history'],
]

export const personalNav = [
  [ListChecks, 'Personal Tasks', '/dashboard/tasks'],
  [UserRound, 'Profil Saya', '/dashboard/profile'],
  [Settings, 'Pengaturan', '/dashboard/settings'],
]

function Navigation({ onLogout, mobile = false }) {
  const currentPath = window.location.pathname

  const renderItem = ([Icon, label, href]) => {
    const active = href === '/dashboard'
      ? currentPath === href
      : currentPath === href || currentPath.startsWith(`${href}/`)

    return (
      <a
        key={label}
        href={href}
        onClick={() => mobile && window.setTimeout(() => window.scrollTo(0, 0), 0)}
        className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
      >
        <Icon size={16} strokeWidth={1.7} className={active ? 'text-blue-600' : 'text-slate-500'} />
        <span>{label}</span>
      </a>
    )
  }

  return (
    <nav className={mobile ? 'space-y-1 px-2 pb-4' : 'flex-1 px-3 text-sm text-slate-700'}>
      {primaryNav.map(renderItem)}
      <div className="my-5 border-t border-slate-200" />
      {personalNav.map(renderItem)}
      {mobile && (
        <button type="button" onClick={onLogout} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600">
          Keluar
        </button>
      )}
    </nav>
  )
}

export default function GlobalShell({ user, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Pengguna'
  const initials = displayName.slice(0, 2).toUpperCase()

  useEffect(() => {
    let url = ''
    getImage('logo')
      .then((record) => {
        if (!record?.blob) return
        url = URL.createObjectURL(record.blob)
        setLogoUrl(url)
      })
      .catch(() => {})
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[204px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="px-5 pb-6 pt-6">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Cakra Langit" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-700">✧</div>
              )}
              <div>
                <div className="font-serif text-[15px] tracking-wide text-slate-900">CAKRA LANGIT</div>
                <div className="text-[10px] text-slate-500">Personal Almanac</div>
              </div>
            </div>
          </div>
          <Navigation onLogout={onLogout} />
          <div className="border-t border-slate-200 px-4 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">{initials}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-slate-900">{displayName}</div>
                <div className="text-[10px] text-slate-500">Akun Saya</div>
              </div>
              <button type="button" onClick={onLogout} aria-label="Keluar" className="text-xs text-slate-400 hover:text-slate-700">↪</button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[64px] items-center border-b border-slate-200 bg-white px-5 sm:px-7">
            <button type="button" aria-label="Buka navigasi" aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="mr-3 rounded-lg border border-slate-200 px-2.5 py-1.5 text-lg text-slate-600 lg:hidden">
              ☰
            </button>
            <div className="hidden md:flex w-[300px] items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
              <span className="mr-2">⌕</span>
              <span>Cari di Cakra Langit...</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button type="button" aria-label="Notifikasi" className="relative text-slate-500 hover:text-slate-800">
                <Bell size={18} strokeWidth={1.7} />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>
              <div className="h-6 border-l border-slate-200" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">{initials}</div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900">{displayName}</div>
                  <div className="text-[10px] text-slate-500">Akun Saya</div>
                </div>
                <ChevronDown size={15} className="text-slate-400" />
              </div>
            </div>
          </header>

          {mobileOpen && (
            <div className="fixed inset-x-0 top-[64px] z-30 border-b border-slate-200 bg-white px-3 py-3 shadow-lg lg:hidden">
              <Navigation mobile onLogout={onLogout} />
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
