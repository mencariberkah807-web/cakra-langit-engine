import { navigationGroups, personalNav } from '../../navigation/userNavigation'
import { LogOut } from 'lucide-react'

export default function AppSidebar({ user, onLogout }) {
  const currentPath = window.location.pathname
  const currentHash = window.location.hash
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Pengguna'
  const initials = displayName.slice(0, 2).toUpperCase()

  const renderItem = ([Icon, label, href]) => {
    const [targetPath, targetHash = ''] = href.split('#')
    const active = targetHash
      ? currentPath === targetPath && currentHash === `#${targetHash}`
      : href === '/dashboard'
        ? currentPath === href && !currentHash
        : currentPath === href || currentPath.startsWith(`${href}/`)

    return (
      <a
        key={href}
        href={href}
        title={label}
        aria-current={active ? 'page' : undefined}
        className={`group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
          active
            ? 'bg-[#12324A] font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.10)]'
            : 'text-[#8FA4B8] hover:bg-white/[0.05] hover:text-white'
        }`}
      >
        <Icon size={17} strokeWidth={1.7} className={active ? 'shrink-0 text-[#22D3EE]' : 'shrink-0 text-[#71869A] group-hover:text-[#A9BDCF]'} />
        <span className="min-w-0 truncate">{label}</span>
      </a>
    )
  }

  return (
    <aside className="hidden w-[76px] shrink-0 border-r border-white/[0.07] bg-[#06111B] lg:flex lg:w-[248px] lg:flex-col">
      <div className="border-b border-white/[0.07] px-3 py-5 lg:px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#0D2535] text-xs font-bold text-[#22D3EE] shadow-[0_0_22px_rgba(34,211,238,0.08)]">{initials}</div>
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-xs font-semibold text-white">{displayName}</div>
            <div className="mt-0.5 truncate text-[10px] text-[#71869A]">Cakra Langit · Personal Almanac</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-3" aria-label="Navigasi utama">
        {navigationGroups.map((group) => (
          <section key={group.label} className="mb-4">
            <h2 className="hidden px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#536A7D] lg:block">
              {group.label}
            </h2>
            {group.items.map(renderItem)}
          </section>
        ))}

        <div className="my-3 border-t border-white/[0.07]" />
        <section>
          <h2 className="hidden px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#536A7D] lg:block">Personal</h2>
          {personalNav.map(renderItem)}
        </section>
      </nav>

      <div className="border-t border-white/[0.07] px-2 py-3 lg:px-3">
        <button
          type="button"
          onClick={onLogout}
          title="Keluar"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#71869A] transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <LogOut size={16} strokeWidth={1.7} />
          <span className="hidden lg:inline">Keluar</span>
        </button>
      </div>
    </aside>
  )
}
