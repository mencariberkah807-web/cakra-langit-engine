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
      className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.13),transparent_35%),radial-gradient(circle_at_82%_10%,rgba(124,58,237,0.10),transparent_30%),#07111C]"
      style={heroImageUrl ? { backgroundImage: `linear-gradient(rgba(7,17,28,0.58),rgba(7,17,28,0.78)),url(${heroImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(162deg,transparent_34%,rgba(14,165,233,0.06)_35%,rgba(30,64,175,0.10)_56%,transparent_57%),linear-gradient(18deg,transparent_40%,rgba(56,189,248,0.05)_41%,rgba(100,116,139,0.08)_64%,transparent_65%)]" />
      <div className="absolute right-[-8%] top-[-18%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[430px] max-w-[1360px] items-center gap-12 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.12fr_0.88fr] lg:px-12 lg:py-20">
        <div className="max-w-[650px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">{settings?.tagline || 'Personal Almanac'}</p>
          <h1 className="mt-4 max-w-[600px] text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl">
            {titleFirst}{titleSecond ? <><br />{titleSecond}</> : null}
          </h1>
          <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-slate-300 sm:text-base">
            {settings?.hero_description || 'Cakra Langit membantu Anda memahami waktu, alam, dan diri melalui berbagai sistem kalender tradisional dan astronomi modern.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={exploreHref} className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#1D4ED8]">
              {settings?.primary_cta_label || 'Mulai Jelajahi'} <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a href="/dashboard/almanac" className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-white/10">
              {settings?.secondary_cta_label || 'Pelajari Lebih Lanjut'}
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-2xl" />
          <PublicTodaySummary data={data} />
        </div>
      </div>
    </section>
  )
}
