import { BadgeCheck, CalendarDays, Heart, RefreshCw } from 'lucide-react'

const icons = [BadgeCheck, CalendarDays, Heart, RefreshCw]

export default function PublicFeatureHighlights({ settings }) {
  const items = [1, 2, 3, 4].map((index) => [
    icons[index - 1],
    settings?.[`feature_${index}_title`] || ['Akurat', 'Menggabungkan', 'Mudah digunakan', 'Selalu diperbarui'][index - 1],
    settings?.[`feature_${index}_description`] || ['dengan data astronomi', 'kearifan tradisional', 'untuk semua orang', 'setiap hari'][index - 1],
  ])

  return (
    <section className="border-b border-white/10 bg-[#07111C]">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-2 sm:px-7 sm:divide-y-0 lg:grid-cols-4 lg:px-10">
        {items.map(([Icon, title, description]) => (
          <div key={title} className="flex items-center gap-5 px-5 py-8 lg:border-r lg:border-white/10 lg:px-8 lg:py-9 lg:last:border-r-0">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Icon className="h-6 w-6" strokeWidth={1.7} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold tracking-[-0.01em] text-white sm:text-base">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400 sm:text-[13px]">{description}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
