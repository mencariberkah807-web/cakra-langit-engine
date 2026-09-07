import { primaryNav, personalNav } from '../../navigation/userNavigation'

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
        className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
          active
            ? 'bg-[#EFF6FF] font-semibold text-[#2563EB]'
            : 'text-[#475569] hover:bg-[#F8FAFC]'
        }`}
      >
        <Icon size={16} strokeWidth={1.7} className={active ? 'text-[#2563EB]' : 'text-[#64748B]'} />
        <span>{label}</span>
      </a>
    )
  }

  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">
      <div className="px-4 py-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">Akun Saya</div>
        <div className="mt-2 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-[10px] font-bold text-white">{initials}</div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-[#0F172A]">{displayName}</div>
            <div className="truncate text-[10px] text-[#64748B]">Personal Almanac</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4">
        {primaryNav.map(renderItem)}
        <div className="my-4 border-t border-[#E2E8F0]" />
        {personalNav.map(renderItem)}
      </nav>

      <div className="border-t border-[#E2E8F0] px-4 py-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full text-left text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
        >
          Keluar
        </button>
      </div>
    </aside>
  )
}
