import { ArrowRight } from 'lucide-react'
import PublicTodaySummary from './PublicTodaySummary'
import { resolveAssetUrl } from './siteSettings'

export default function PublicHero({ data, isAuthenticated, settings }) {
  const exploreHref = isAuthenticated ? '/dashboard' : '/login'
  const heroTitle = settings?.hero_title || 'Harmoni Langit, Panduan Kehidupan'
  const [titleFirst, ...titleRest] = heroTitle.split(',')
  const titleSecond = titleRest.join(',').trim()
  const heroImageUrl = resolveAssetUrl(settings?.hero_image)

  return (
    <section
      className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-br from-[#EAF4FF] via-[#F5F9FD] to-[#DCE8F1]"
      style={heroImageUrl ? { backgroundImage: `url(${heroImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {heroImageUrl ? <div className="absolute inset-0 bg-white/55" /> : null}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(162deg,transparent_34%,rgba(148,163,184,0.16)_35%,rgba(100,116,139,0.18)_56%,transparent_57%),linear-gradient(18deg,transparent_40%,rgba(71,85,105,0.10)_41%,rgba(100,116,139,0.15)_64%,transparent_65%)]" />
      <div className="absolute right-[-8%] top-[-18%] h-72 w-72 rounded-full bg-white/30 blur-3xl" />
      <div className="relative mx-auto grid min-h-[430px] max-w-[1360px] items-center gap-12 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.12fr_0.88fr] lg:px-12 lg:py-20">
        <div className="max-w-[650px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">{settings?.tagline || 'Personal Almanac'}</p>
          <h1 className="mt-4 max-w-[600px] text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#0B1736] sm:text-6xl">
            {titleFirst}{titleSecond ? <><br />{titleSecond}</> : null}
          </h1>
          <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-[#475569] sm:text-base">
            {settings?.hero_description || 'Cakra Langit membantu Anda memahami waktu, alam, dan diri melalui berbagai sistem kalender tradisional dan astronomi modern.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={exploreHref} className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#1D4ED8]">
              {settings?.primary_cta_label || 'Mulai Jelajahi'} <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a href="/dashboard/almanac" className="rounded-md bg-white/90 px-5 py-3 text-xs font-semibold text-[#334155] shadow-sm ring-1 ring-[#CBD5E1] hover:bg-white">
              {settings?.secondary_cta_label || 'Pelajari Lebih Lanjut'}
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -inset-8 rounded-full bg-white/20 blur-2xl" />
          <PublicTodaySummary data={data} />
        </div>
      </div>
    </section>
  )
}
