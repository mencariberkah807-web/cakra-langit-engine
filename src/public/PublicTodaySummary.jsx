import {
  ArrowRight,
  CalendarDays,
  CloudSun,
  MapPin,
  Moon,
  Sun,
} from 'lucide-react'
import { getResultsByGroup } from '../core/resultRegistry.js'

function formatDate(date, timezone) {
  if (!date) return 'Hari ini'

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(date)
}

function formatPercent(value) {
  if (value == null) return '—'
  const number = Number(value)
  if (!Number.isFinite(number)) return String(value)
  return `${Math.round(number)}%`
}

function valueFromDetails(details, labels) {
  if (!Array.isArray(details)) return null

  const match = details.find((item) =>
    labels.some((label) => String(item?.label || '').toLowerCase() === label)
  )

  return match?.value ?? null
}

function DataValue({ children }) {
  return <strong className="font-semibold text-white">{children ?? '—'}</strong>
}

export default function PublicTodaySummary({ data }) {
  const location = data?.location
  const naturalFromApi = data?.apiData?.natural || data?.natural || null
  const naturalResults = getResultsByGroup('natural', data || {})

  const sunResult = naturalResults.find((result) => result.id === 'sun')
  const moonResult = naturalResults.find((result) => result.id === 'moon')
  const skyResult = naturalResults.find((result) => result.id === 'sky')

  const sun = naturalFromApi?.sun || sunResult || {}
  const moon = naturalFromApi?.moon || moonResult || {}
  const sky = naturalFromApi?.sky || skyResult || {}

  const sunDetails = sun?.details || []
  const moonDetails = moon?.details || []
  const skyDetails = sky?.details || []

  const sunrise = sun?.sunrise ?? valueFromDetails(sunDetails, ['sunrise'])
  const sunset = sun?.sunset ?? valueFromDetails(sunDetails, ['sunset'])
  const moonPhase = moon?.phase ?? moon?.phase_name ?? moon?.primary ?? null
  const moonAge = moon?.age ?? moon?.age_days ?? null
  const moonIllumination = moon?.illumination
  const skyState = sky?.skyState ?? sky?.primary ?? valueFromDetails(skyDetails, ['sky state'])
  const bortle = sky?.bortle ?? valueFromDetails(skyDetails, ['bortle'])
  const moonlight = sky?.moonlight ?? valueFromDetails(skyDetails, ['moonlight'])

  const city = location?.name || location?.city || '—'
  const country = location?.country || location?.countryName || '—'
  const timezone = location?.timezone || location?.tz || null
  const date = formatDate(data?.selectedDate, timezone)

  return (
    <section className="w-full max-w-[520px] rounded-2xl border border-[#123A5A] bg-[linear-gradient(135deg,#071A2C,#0A2038)] p-5 shadow-[0_16px_40px_rgba(2,12,27,0.28)] sm:p-6">
      <header className="flex items-start justify-between gap-4 border-b border-[#1B4565] pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#0EA5E9]/40 bg-[#0EA5E9]/10 text-[#38BDF8]">
            <CalendarDays className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-white">{date}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.7} />
              {city}, {country}
            </p>
          </div>
        </div>
        <a href="/dashboard/almanac" className="hidden shrink-0 rounded-md bg-white/5 px-3 py-2 text-[11px] font-semibold text-cyan-300 ring-1 ring-cyan-400/15 transition-colors hover:bg-white/10 sm:inline-flex">
          Lihat Detail
        </a>
      </header>

      <div className="divide-y divide-[#1B4565]">
        <div className="grid grid-cols-[auto_1fr] gap-3 py-4 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
            <Sun className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Matahari</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Terbit · Terbenam</p>
          </div>
          <div className="text-left sm:border-l sm:border-[#1B4565] sm:pl-4">
            <p className="text-sm font-semibold text-white"><DataValue>{sunrise}</DataValue></p>
            <p className="mt-0.5 text-[9px] text-slate-400">Terbit</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white"><DataValue>{sunset}</DataValue></p>
            <p className="mt-0.5 text-[9px] text-slate-400">Terbenam</p>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
            <Moon className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Bulan</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Fase · Visibilitas</p>
          </div>
          <div className="text-left sm:border-l sm:border-[#1B4565] sm:pl-4">
            <p className="text-sm font-semibold text-white"><DataValue>{moonPhase}</DataValue></p>
            <p className="mt-0.5 text-[9px] text-slate-400">
              {moonIllumination != null ? `Iluminasi ${formatPercent(moonIllumination)}` : moonAge != null ? `Usia ${Number(moonAge).toFixed(1)} hari` : 'Data fase'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 py-4 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
            <CloudSun className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Langit</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Kondisi · Observasi</p>
          </div>
          <div className="text-left sm:border-l sm:border-[#1B4565] sm:pl-4">
            <p className="text-sm font-semibold text-white"><DataValue>{skyState}</DataValue></p>
            <p className="mt-0.5 text-[9px] text-slate-400">{bortle || '—'}</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white"><DataValue>{moonlight}</DataValue></p>
            <p className="mt-0.5 text-[9px] text-slate-400">Moonlight</p>
          </div>
        </div>
      </div>

      <div className="mt-1 rounded-xl bg-cyan-400/5 px-4 py-3 ring-1 ring-cyan-400/15">
        <a href="/dashboard/almanac" className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-300">
          <CalendarDays className="h-4 w-4" strokeWidth={1.7} />
          Lihat Detail Almanac Hari Ini
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
        </a>
      </div>
    </section>
  )
}
