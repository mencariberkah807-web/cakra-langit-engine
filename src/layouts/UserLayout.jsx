import AppSidebar from '../components/navigation/AppSidebar'
import { primaryNav } from '../navigation/userNavigation'

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
        aria-label="Mobile navigation"
      >
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {primaryNav.map(([Icon, label, href]) => {
            const active = href === '/dashboard'
              ? currentPath === href
              : currentPath === href || currentPath.startsWith(`${href}/`)

            return (
              <a
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-w-[72px] shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] font-semibold transition-colors ${
                  active
                    ? 'bg-[#12324A] text-[#22D3EE]'
                    : 'text-[#71869A] hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <Icon size={17} strokeWidth={1.7} />
                <span className="max-w-[76px] truncate">{label}</span>
              </a>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
