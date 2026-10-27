import AppSidebar from '../components/navigation/AppSidebar'
import { Home, CalendarDays, Sparkles, Compass, UserRound } from 'lucide-react'

const mobileNav = [
  [Home, 'Dashboard', '/dashboard'],
  [CalendarDays, 'Penanggalan', '/dashboard/almanac'],
  [Sparkles, 'Blueprint', '/dashboard/weton'],
  [Compass, 'Strategi', '/dashboard/palintangan'],
  [UserRound, 'Profil', '/dashboard/profile'],
]

export default function UserLayout({ user, onLogout, children }) {
  const currentPath = window.location.pathname

  return (
    <div className="min-h-screen bg-[#07111C] font-sans text-white antialiased">
      <div className="flex min-h-screen items-start">
        <AppSidebar user={user} onLogout={onLogout} />
        <main className="min-w-0 flex-1 bg-[#07111C] pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#06111B]/95 px-2 py-2 backdrop-blur-xl lg:hidden"
        aria-label="Navigasi utama mobile"
      >
        <div className="mx-auto flex max-w-xl items-center justify-around gap-1">
          {mobileNav.map(([Icon, label, href]) => {
            const active = href === '/dashboard'
              ? currentPath === href
              : href === '/dashboard/weton'
                ? ['/dashboard/weton', '/dashboard/bazi', '/dashboard/paririmbon', '/dashboard/palelintangan'].includes(currentPath)
                : currentPath === href || currentPath.startsWith(`${href}/`)

            return (
              <a
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-semibold transition-colors ${
                  active
                    ? 'bg-[#12324A] text-[#22D3EE]'
                    : 'text-[#71869A] hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <Icon size={17} strokeWidth={1.7} />
                <span className="max-w-full truncate">{label}</span>
              </a>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
