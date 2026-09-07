import { BadgeCheck, CalendarDays, Heart, RefreshCw } from 'lucide-react'

const items = [
  [BadgeCheck, 'Akurat', 'dengan data astronomi'],
  [CalendarDays, 'Menggabungkan', 'kearifan tradisional'],
  [Heart, 'Mudah digunakan', 'untuk semua orang'],
  [RefreshCw, 'Selalu diperbarui', 'setiap hari'],
]

export default function PublicFeatureHighlights() {
  return (
    <section className="border-b border-[#E2E8F0] bg-white">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 divide-y divide-[#E2E8F0] px-5 sm:grid-cols-2 sm:px-7 sm:divide-y-0 lg:grid-cols-4 lg:px-10">
        {items.map(([Icon, title, description]) => (
          <div key={title} className="flex items-center gap-3 px-4 py-5 lg:px-7">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
              <Icon className="h-4 w-4" strokeWidth={1.7} />
            </span>
            <span>
              <span className="block text-[10px] font-semibold text-[#334155]">{title}</span>
              <span className="mt-0.5 block text-[10px] text-[#64748B]">{description}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
