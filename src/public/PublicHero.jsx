import { ArrowRight } from 'lucide-react'
import PublicTodaySummary from './PublicTodaySummary'

export default function PublicHero({ data, isAuthenticated }) {
  const exploreHref = isAuthenticated ? '/dashboard' : '/login'

  return (
    <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-br from-[#EAF4FF] via-[#F5F9FD] to-[#DCE8F1]">
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(160deg,transparent_35%,rgba(148,163,184,0.18)_36%,rgba(100,116,139,0.18)_58%,transparent_59%),linear-gradient(20deg,transparent_42%,rgba(71,85,105,0.12)_43%,rgba(100,116,139,0.16)_65%,transparent_66%)]" />
      <div className="relative mx-auto grid max-w-[1360px] items-center gap-10 px-6 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-16">
        <div className="max-w-[610px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Personal Almanac</p>
          <h1 className="mt-3 max-w-[560px] text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#0B1736] sm:text-5xl">
            Harmoni Langit,<br />Panduan Kehidupan
          </h1>
          <p className="mt-5 max-w-[540px] text-sm leading-6 text-[#475569] sm:text-[15px]">
            Cakra Langit membantu Anda memahami waktu, alam, dan diri melalui berbagai sistem kalender tradisional dan astronomi modern.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={exploreHref} className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1D4ED8]">
              Mulai Jelajahi <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a href="/dashboard/almanac" className="rounded-md bg-white px-5 py-2.5 text-xs font-semibold text-[#334155] shadow-sm ring-1 ring-[#CBD5E1] hover:bg-[#F8FAFC]">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        <div className="flex justify-start lg:justify-end">
          <PublicTodaySummary data={data} />
        </div>
      </div>
    </section>
  )
}
