import { Search, Sparkles } from 'lucide-react'
import { resolveAssetUrl } from './siteSettings'

const links = [
  ['Beranda', '/'],
  ['Almanac', '/dashboard/almanac'],
  ['Natural Layer', '/dashboard/natural'],
  ['Kalender', '/dashboard/today'],
  ['Tentang', '#tentang'],
]

export default function PublicNavigation({ isAuthenticated, settings }) {
  const accountHref = isAuthenticated ? '/dashboard' : '/login'
  const accountLabel = isAuthenticated ? 'Akun Saya' : 'Masuk'
  const siteName = settings?.site_name || 'Cakra Langit'
  const tagline = settings?.tagline || 'Personal Almanac'
  const logoUrl = resolveAssetUrl(settings?.logo)

  return (
    <header className="border-b border-[#E2E8F0] bg-white">
      <nav className="mx-auto flex min-h-[76px] max-w-[1360px] items-center gap-8 px-5 sm:px-7 lg:px-10" aria-label="Navigasi utama">
        <a href="/" className="flex shrink-0 items-center gap-3" aria-label={`${siteName} Beranda`}>
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2563EB]/30 bg-[#EFF6FF] text-[#2563EB]">
              <Sparkles className="h-5 w-5" strokeWidth={1.6} />
            </span>
          )}
          <span>
            <span className="block text-[12px] font-bold tracking-[0.06em] text-[#0F172A]">{siteName.toUpperCase()}</span>
            <span className="block text-[9px] text-[#64748B]">{tagline}</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href], index) => (
            <a key={label} href={href} className={`relative py-7 text-[11px] font-medium ${index === 0 ? 'text-[#2563EB]' : 'text-[#475569] hover:text-[#0F172A]'}`}>
              {label}
              {index === 0 && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#2563EB]" />}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <button type="button" aria-label="Cari" className="hidden h-9 w-9 items-center justify-center rounded-md text-[#475569] hover:bg-[#F8FAFC] sm:flex">
            <Search className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <a href={accountHref} className="rounded-md border border-[#93B4FF] px-4 py-2 text-[11px] font-semibold text-[#2563EB] hover:bg-[#EFF6FF]">
            {accountLabel}
          </a>
          {!isAuthenticated && (
            <a href="/login" className="rounded-md bg-[#2563EB] px-4 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-[#1D4ED8]">
              Daftar
            </a>
          )}
        </div>
      </nav>
    </header>
  )
}
