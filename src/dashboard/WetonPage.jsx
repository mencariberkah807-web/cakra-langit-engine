import { useMemo, useState } from 'react'
import { useTodayContext } from '../core/TodayContext'

const CALCULATIONS = [
  { id: 'weton', label: 'Weton', description: 'Dina, Pasaran, dan Neptu', active: true },
  { id: 'pangarasan', label: 'Pangarasan', description: 'Perhitungan berdasarkan Neptu', active: false },
  { id: 'pancasuda', label: 'Pancasuda', description: 'Metode Pancasuda yang bersumber', active: false },
  { id: 'rakam', label: 'Rakam', description: 'Perhitungan Rakam', active: false },
]

const CONTEXT_MODES = [
  { id: 'profile', label: 'Profil Saya' },
  { id: 'other', label: 'Orang Lain' },
  { id: 'partner', label: 'Pasangan' },
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
  const {
    apiData,
    selectedDate,
    selectedTime,
    location,
    locations,
    setSelectedDate,
    setSelectedTime,
    setLocationById,
    goLive,
  } = useTodayContext()
  const [contextMode, setContextMode] = useState('profile')
  const [manualDate, setManualDate] = useState('')
  const [manualTime, setManualTime] = useState('12:00')
  const [personName, setPersonName] = useState('')

  const isManual = contextMode !== 'profile'
  const hasBirthContext = isManual && Boolean(manualDate)
  const jawa = hasBirthContext ? apiData?.calendars?.find((calendar) => calendar.id === 'jawa') : null
  const detail = jawa?.detail || {}
  const dino = detail.dino || {}
  const pasaran = detail.pasaran || {}
  const wuku = detail.wuku || {}
  const timezone = location?.tz || location?.timezone || 'Asia/Jakarta'
  const dateValue = hasBirthContext ? localDateValue(selectedDate, timezone) : manualDate
  const timeValue = selectedTime ? String(selectedTime).slice(0, 5) : manualTime

  const formula = useMemo(() => {
    if (dino.neptu == null || pasaran.neptu == null || detail.neptu_total == null) return null
    return `${dino.name} ${dino.neptu} + ${pasaran.name} ${pasaran.neptu} = ${detail.neptu_total}`
  }, [dino.name, dino.neptu, pasaran.name, pasaran.neptu, detail.neptu_total])

  function activateContext(mode) {
    setContextMode(mode)
    if (mode === 'profile') {
      setManualDate('')
      setManualTime('12:00')
      setPersonName('')
      goLive()
    }
  }

  function handleDateChange(event) {
    const value = event.target.value
    setManualDate(value)
    if (value) setSelectedDate(new Date(`${value}T12:00:00`))
  }

  function handleTimeChange(event) {
    const value = event.target.value
    setManualTime(value)
    if (value) setSelectedTime(value)
  }

  function handleLocationChange(event) {
    if (event.target.value) setLocationById(event.target.value)
  }

  const contextLabel = contextMode === 'partner' ? 'Data Kelahiran Pasangan' : 'Data Kelahiran Orang Lain'

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Jawa</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Weton Jawa</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">
          Eksplorasi Weton berdasarkan konteks kelahiran. Profil menjadi sumber default; data manual hanya berlaku untuk perhitungan ini.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-5">
          <SectionCard title="Birth Context" eyebrow="Context">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {CONTEXT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => activateContext(mode.id)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    contextMode === mode.id
                      ? 'border-cyan-300/25 bg-[#12324A] shadow-[0_0_24px_rgba(34,211,238,0.06)]'
                      : 'border-white/[0.06] bg-[#07111C] hover:border-white/[0.12]'
                  }`}
                >
                  <div className={`text-xs font-semibold ${contextMode === mode.id ? 'text-white' : 'text-[#8FA4B8]'}`}>{mode.label}</div>
                  <div className="mt-1 text-[10px] text-[#536A7D]">
                    {mode.id === 'profile' ? 'Gunakan data profil' : mode.id === 'partner' ? 'Konteks pasangan' : 'Hitung data lain'}
                  </div>
                </button>
              ))}
            </div>

            {contextMode === 'profile' ? (
              <div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
                <div className="text-xs font-semibold text-amber-200">Profil kelahiran belum tersedia</div>
                <p className="mt-1 text-[11px] leading-5 text-[#8FA4B8]">
                  Lengkapi data kelahiran di Profil Saya untuk menjadikan profil sebagai sumber otomatis. Untuk sementara, pilih Orang Lain atau Pasangan untuk menghitung secara manual.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Nama <span className="font-normal text-[#536A7D]">(opsional)</span></span>
                  <input
                    type="text"
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    placeholder={contextMode === 'partner' ? 'Nama pasangan' : 'Nama orang yang dihitung'}
                    className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white placeholder:text-[#536A7D] outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal lahir</span>
                    <input type="date" value={manualDate} onChange={handleDateChange} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Waktu lahir</span>
                    <input type="time" value={manualTime} onChange={handleTimeChange} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Lokasi konteks kalender</span>
                  <select value={location?.id || ''} onChange={handleLocationChange} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10">
                    {locations?.map((item) => <option key={item.id} value={item.id}>{item.city}{item.province ? ` · ${item.province}` : ''}</option>)}
                  </select>
                  <span className="mt-2 block text-[10px] leading-4 text-[#536A7D]">Digunakan sebagai konteks lokasi existing untuk boundary kalender. Tidak mengubah data profil.</span>
                </label>
              </div>
            )}
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
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">{personName || (contextMode === 'partner' ? 'Pasangan' : 'Weton')}</div>
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
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">Birth Context</div>
                <div className="mt-2 text-lg font-semibold text-white">{contextMode === 'profile' ? 'Profil siap menjadi sumber otomatis' : `Masukkan ${contextLabel.toLowerCase()}`}</div>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#71869A]">
                  {contextMode === 'profile' ? 'Data kelahiran profil belum tersedia pada schema saat ini.' : 'Setelah tanggal lahir dipilih, hasil dihitung menggunakan Almanac API dan engine Jawa existing.'}
                </p>
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
