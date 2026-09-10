import { useMemo } from 'react'
import { useTodayContext } from '../core/TodayContext'

const CALCULATIONS = [
  { id: 'weton', label: 'Weton', description: 'Dina, Pasaran, dan Neptu', active: true },
  { id: 'pangarasan', label: 'Pangarasan', description: 'Perhitungan berdasarkan Neptu', active: false },
  { id: 'pancasuda', label: 'Pancasuda', description: 'Metode Pancasuda yang bersumber', active: false },
  { id: 'rakam', label: 'Rakam', description: 'Perhitungan Rakam', active: false },
]

function SectionCard({ title, eyebrow, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-white/[0.07] bg-[#0A1723] shadow-[0_12px_40px_rgba(0,0,0,0.16)] ${className}`}>
      <div className="border-b border-white/[0.07] px-5 py-4 sm:px-6">
        {eyebrow && <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{eyebrow}</div>}
        <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function Metric({ label, value, accent = 'text-[#8FA4B8]' }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536A7D]">{label}</div>
      <div className={`mt-2 text-lg font-semibold ${accent}`}>{value ?? '—'}</div>
    </div>
  )
}

function localDateValue(date, timezone) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function localTimeValue(date, timezone) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone || 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export default function WetonPage() {
  const { apiData, selectedDate, selectedTime, location, setSelectedDate, setSelectedTime } = useTodayContext()
  const jawa = apiData?.calendars?.find((calendar) => calendar.id === 'jawa')
  const detail = jawa?.detail || {}
  const dino = detail.dino || {}
  const pasaran = detail.pasaran || {}
  const wuku = detail.wuku || {}
  const timezone = location?.tz || location?.timezone || 'Asia/Jakarta'
  const dateValue = localDateValue(selectedDate, timezone)
  const timeValue = selectedTime ? String(selectedTime).slice(0, 5) : localTimeValue(selectedDate, timezone)

  const formula = useMemo(() => {
    if (dino.neptu == null || pasaran.neptu == null || detail.neptu_total == null) return null
    return `${dino.name} ${dino.neptu} + ${pasaran.name} ${pasaran.neptu} = ${detail.neptu_total}`
  }, [dino.name, dino.neptu, pasaran.name, pasaran.neptu, detail.neptu_total])

  function handleDateChange(event) {
    const value = event.target.value
    if (!value) return
    setSelectedDate(new Date(`${value}T12:00:00`))
  }

  function handleTimeChange(event) {
    if (event.target.value) setSelectedTime(event.target.value)
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Jawa</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Weton Jawa</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">
          Perhitungan Weton menggunakan data kalender Jawa yang sudah tersedia di engine Cakra Langit.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-5">
          <SectionCard title="Data Kelahiran" eyebrow="Input">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal lahir</span>
                <input type="date" value={dateValue} onChange={handleDateChange} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Waktu lahir</span>
                <input type="time" value={timeValue} onChange={handleTimeChange} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
              </label>
            </div>
            <p className="mt-4 text-[11px] leading-5 text-[#536A7D]">Tanggal dan waktu diteruskan ke konteks Almanac existing. Perhitungan kalender Jawa tidak dibuat ulang di halaman ini.</p>
          </SectionCard>

          <SectionCard title="Perhitungan Tersedia" eyebrow="Method">
            <div className="grid gap-2">
              {CALCULATIONS.map((item) => (
                <div key={item.id} className={`w-full rounded-xl border px-4 py-3 ${item.active ? 'border-cyan-300/20 bg-[#12324A] shadow-[0_0_24px_rgba(34,211,238,0.06)]' : 'border-white/[0.06] bg-[#07111C]'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`text-sm font-semibold ${item.active ? 'text-white' : 'text-[#71869A]'}`}>{item.label}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${item.active ? 'text-[#22D3EE]' : 'text-[#536A7D]'}`}>{item.active ? 'Terhubung' : 'Menunggu sumber'}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#71869A]">{item.description}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Hasil Weton" eyebrow="Result">
            {jawa ? (
              <>
                <div className="rounded-xl border border-cyan-300/10 bg-[#07111C] p-5 sm:p-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">Weton</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{jawa.sub || '—'}</div>
                  <div className="mt-1 text-sm text-[#71869A]">{jawa.headline || '—'}</div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <Metric label="Dina" value={dino.name} />
                  <Metric label="Pasaran" value={pasaran.name} />
                  <Metric label="Total Neptu" value={detail.neptu_total} accent="text-amber-300" />
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Metric label="Neptu Dina" value={dino.neptu} />
                  <Metric label="Neptu Pasaran" value={pasaran.neptu} />
                </div>
                {formula && <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3 font-mono text-xs text-[#A9BDCF]">{formula}</div>}
              </>
            ) : (
              <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-5 text-center sm:p-7">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">Memuat data Jawa</div>
                <div className="mt-2 text-lg font-semibold text-white">Menunggu engine</div>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#71869A]">Halaman menggunakan data dari Almanac API existing.</p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Konteks Kalender Jawa" eyebrow="Calendar Context">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                ['Tanggal Jawa', jawa?.detail?.jawa_date],
                ['Tahun Jawa', detail.tahun],
                ['Wuku', wuku.name],
                ['Hari Wuku', wuku.day_in_wuku],
                ['Pawukon Day', wuku.pawukon_day],
                ['Windu', detail.windu],
                ['Lambang', jawa?.fields?.find((field) => field.k === 'Lambang')?.v],
                ['Kurup', jawa?.fields?.find((field) => field.k === 'Kurup')?.v],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/[0.06] bg-[#07111C] px-3 py-3">
                  <div className="text-[10px] text-[#536A7D]">{label}</div>
                  <div className="mt-1 text-xs font-semibold text-[#8FA4B8]">{value ?? '—'}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  )
}
