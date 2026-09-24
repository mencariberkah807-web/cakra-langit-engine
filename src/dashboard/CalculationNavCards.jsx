import { ArrowUpRight, Compass, HeartHandshake, Layers3, Sparkles, UserRound } from 'lucide-react'

const CALCULATIONS = [
  {
    href: '/dashboard/weton',
    icon: Sparkles,
    eyebrow: 'JAWA',
    title: 'Weton',
    description: 'Watak, rezeki, karier, relasi, dan petungan kelahiran.',
  },
  {
    href: '/dashboard/weton/jodoh',
    icon: HeartHandshake,
    eyebrow: 'JAWA',
    title: 'Cek Jodoh',
    description: 'Bandingkan weton dua orang dan lihat hasil petungannya.',
  },
  {
    href: '/dashboard/palintangan',
    icon: Layers3,
    eyebrow: 'SUNDA',
    title: 'Palintangan',
    description: 'Perhitungan tanggal, hari, pasaran, dan naktu.',
  },
  {
    href: '/dashboard/paririmbon',
    icon: Compass,
    eyebrow: 'SUNDA',
    title: 'Paririmbon',
    description: 'Jelajahi perhitungan dan pembacaan Paririmbon Sunda.',
  },
  {
    href: '/dashboard/bazi',
    icon: UserRound,
    eyebrow: 'TIONGHOA',
    title: 'BaZi',
    description: 'Perhitungan personal berdasarkan data kelahiran.',
  },
]

export default function CalculationNavCards({ current }) {
  const items = CALCULATIONS.filter((item) => item.href !== current)

  return (
    <section className="rounded-[20px] border border-[#1B3447] bg-[linear-gradient(135deg,rgba(9,24,36,0.98),rgba(5,15,24,0.98))] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5F8AA2]">Jelajahi</div>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#D8F3FF]">Perhitungan Lain</h2>
          <p className="mt-1 text-xs leading-5 text-[#7896A8]">Pilih perhitungan lain tanpa kembali ke menu utama.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ href, icon: Icon, eyebrow, title, description }) => (
          <a
            key={href}
            href={href}
            className="group rounded-2xl border border-[#1D3A4D] bg-[linear-gradient(135deg,rgba(11,29,43,0.98),rgba(5,16,25,0.98))] p-4 transition hover:border-[#2A5972] hover:bg-[#0D2434] focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#24495F] bg-[#0B2030] text-[#7EC5DF]">
                <Icon size={17} strokeWidth={1.8} />
              </div>
              <ArrowUpRight size={16} className="text-[#49697C] transition group-hover:text-[#8CCFE5]" />
            </div>
            <div className="mt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#5D8398]">{eyebrow}</div>
            <div className="mt-1 text-sm font-semibold text-[#D8F3FF]">{title}</div>
            <div className="mt-2 text-xs leading-5 text-[#7896A8]">{description}</div>
          </a>
        ))}
      </div>
    </section>
  )
}
