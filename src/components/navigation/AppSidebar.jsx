import { workspaceNav, converterNav, personalNav } from '../../navigation/userNavigation'

export default function AppSidebar({ user, onLogout }) {
  const currentPath = window.location.pathname
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Pengguna'
  const initials = displayName.slice(0, 2).toUpperCase()

  const renderItem = ([Icon, label, href]) => {
    const active = href === '/dashboard'
      ? currentPath === href
      : currentPath === href || currentPath.startsWith(`${href}/`)

    return (
      <a
        key={label}
        href={href}
        title={label}
        className={`group mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
          active
            ? 'bg-[#12324A] font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.10)]'
            : 'text-[#8FA4B8] hover:bg-white/[0.05] hover:text-white'
        }`}
      >
        <Icon size={17} strokeWidth={1.7} className={active ? 'text-[#22D3EE]' : 'text-[#71869A] group-hover:text-[#A9BDCF]'} />
        <span className="truncate">{label}</span>
      </a>
    )
  }

  const renderGroup = (label, items) => (
    <div className="mt-5 first:mt-0" key={label}>
      <div className="hidden px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D] lg:block">{label}</div>
      {items.map(renderItem)}
    </div>
  )

  return (
    <aside className="hidden w-[76px] shrink-0 border-r border-white/[0.07] bg-[#06111B] lg:flex lg:w-[220px] lg:flex-col">
      <div className="border-b border-white/[0.07] px-3 py-5 lg:px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#0D2535] text-xs font-bold text-[#22D3EE] shadow-[0_0_22px_rgba(34,211,238,0.08)]">{initials}</div>
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-xs font-semibold text-white">{displayName}</div>
            <div className="mt-0.5 truncate text-[10px] text-[#71869A]">Personal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-5 lg:px-3">
        {renderGroup('Personal', personalNav)}
        {renderGroup('Workspace', workspaceNav)}
        {renderGroup('Converter', converterNav)}
      </nav>

      <div className="border-t border-white/[0.07] px-2 py-3 lg:px-3">
        <button
          type="button"
          onClick={onLogout}
          title="Keluar"
          className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#71869A] transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <span className="lg:hidden">↪</span>
          <span className="hidden lg:inline">Keluar</span>
        </button>
      </div>
    </aside>
  )
}
