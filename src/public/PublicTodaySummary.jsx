import { CloudSun, Moon, Sun } from 'lucide-react'

function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function PublicTodaySummary({ data }) {
  const location = data?.location
  const natural = data?.natural || data?.apiData?.natural || {}
  const sun = natural?.sun || {}
  const moon = natural?.moon || {}
  const date = data?.selectedDate ? formatDate(data.selectedDate) : 'Hari ini'

  const city = location?.name || 'Jakarta'
  const country = location?.country || 'Indonesia'
  const sunrise = sun?.sunrise || '05:50'
  const sunset = sun?.sunset || '17:51'
  const moonName = moon?.phase_name || moon?.phase || 'Waning Crescent'
  const moonAge = moon?.age_days != null ? `${Number(moon.age_days).toFixed(1)} hari` : '—'

  return (
    <div className="w-full max-w-[330px] rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <Sun className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" strokeWidth={1.7} />
        <div>
          <p className="text-[12px] font-semibold text-[#0F172A]">{date}</p>
          <p className="mt-0.5 text-[10px] text-[#64748B]">{city}, {country}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-[#E2E8F0] pt-3">
        <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
          <Sun className="h-4 w-4 text-[#F59E0B]" strokeWidth={1.7} />
          <span className="w-14">Matahari</span>
          <span>Terbit <strong className="font-semibold text-[#334155]">{sunrise}</strong></span>
          <span>Terbenam <strong className="font-semibold text-[#334155]">{sunset}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
          <Moon className="h-4 w-4 text-[#2563EB]" strokeWidth={1.7} />
          <span className="w-14">Bulan</span>
          <strong className="font-semibold text-[#334155]">{moonName}</strong>
          <span>Usia {moonAge}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
          <CloudSun className="h-4 w-4 text-[#2563EB]" strokeWidth={1.7} />
          <span className="w-14">Langit</span>
          <strong className="font-semibold text-[#334155]">Cerah</strong>
          <span>Visibilitas baik</span>
        </div>
      </div>
    </div>
  )
}
