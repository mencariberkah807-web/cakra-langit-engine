import { useEffect, useState } from 'react'

const CALCULATIONS = [
  { id: 'weton', label: 'Weton', description: 'Dina, Pasaran, dan Neptu' },
  { id: 'pangarasan', label: 'Pangarasan', description: 'Perhitungan berdasarkan Neptu' },
  { id: 'pancasuda', label: 'Pancasuda', description: 'Metode Pancasuda yang bersumber' },
  { id: 'rakam', label: 'Rakam', description: 'Perhitungan Rakam' },
]

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

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

function ValueCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] px-3 py-3">
      <div className="text-[10px] text-[#536A7D]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[#DCEBFA]">{value ?? '—'}</div>
    </div>
  )
}

export default function WetonPage() {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function calculate() {
    if (!birthDate) {
      setError('Tanggal lahir wajib diisi.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        city: 'Bandung',
        date_value: birthDate,
        datetime_value: `${birthDate}T${birthTime || '12:00'}:00+07:00`,
      })

      const response = await fetch(`${API_BASE}/api/almanac?${params.toString()}`)
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.detail || `Almanac API error: ${response.status}`)
      }

      const result = await response.json()
      const jawa = result.calendars?.find((calendar) => calendar.id === 'jawa')

      if (!jawa?.detail) {
        throw new Error('Data Kalender Jawa tidak tersedia.')
      }

      setData({ ...result, jawa })
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Gagal menghitung Weton.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!birthDate) return
    calculate()
  }, [])

  const detail = data?.jawa?.detail
  const jawa = data?.jawa

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Jawa</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Weton Jawa</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">
          Hitung Weton dari tanggal kelahiran menggunakan engine Kalender Jawa yang sudah tersedia.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-5">
          <SectionCard title="Data Kelahiran" eyebrow="Input">
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal lahir</span>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Waktu lahir <span className="font-normal text-[#536A7D]">(opsional)</span></span>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(event) => setBirthTime(event.target.value)}
                  className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                />
              </label>

              <button
                type="button"
                onClick={calculate}
                disabled={loading || !birthDate}
                className="rounded-xl bg-[#22A7E8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2CB4F3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Menghitung…' : 'Hitung Weton'}
              </button>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs leading-5 text-red-200">
                  {error}
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Pilih Perhitungan" eyebrow="Method">
            <div className="grid gap-2">
              {CALCULATIONS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={index !== 0}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    index === 0
                      ? 'border-cyan-300/20 bg-[#12324A] text-white shadow-[0_0_24px_rgba(34,211,238,0.06)]'
                      : 'border-white/[0.06] bg-[#07111C] text-[#536A7D] opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{item.label}</span>
                    {index === 0 && <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#22D3EE]">Aktif</span>}
                    {index !== 0 && <span className="text-[9px] font-semibold uppercase tracking-[0.1em]">Segera</span>}
                  </div>
                  <div className="mt-1 text-[11px] text-[#71869A]">{item.description}</div>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Hasil Weton" eyebrow="Result">
            {!detail ? (
              <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-5 text-center sm:p-7">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">Belum ada data</div>
                <div className="mt-2 text-lg font-semibold text-white">Masukkan data kelahiran</div>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#71869A]">
                  Hasil Weton akan ditampilkan setelah perhitungan dijalankan.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-cyan-300/10 bg-[#07111C] p-5 sm:p-7">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">Weton</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{jawa.sub}</div>
                  <div className="mt-1 text-xs text-[#71869A]">
                    {detail.jawa_date} · Tahun {detail.tahun} · Windu {detail.windu}
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-2">
                    <ValueCard label="Dino" value={detail.dino.name} />
                    <div className="self-center text-lg text-[#536A7D]">+</div>
                    <ValueCard label="Pasaran" value={detail.pasaran.name} />
                    <div className="self-center text-lg text-[#536A7D]">=</div>
                    <ValueCard label="Neptu" value={detail.neptu_total} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <ValueCard label="Wuku" value={detail.wuku.name} />
                  <ValueCard label="Hari Wuku" value={`ke-${detail.wuku.day_in_wuku}`} />
                  <ValueCard label="Pawukon" value={`${detail.wuku.pawukon_day} / 210`} />
                  <ValueCard label="Kurup" value={jawa.fields?.find((field) => field.k === 'Kurup')?.v} />
                </div>
              </>
            )}
          </SectionCard>

          <SectionCard title="Konteks Kalender Jawa" eyebrow="Calendar Context">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <ValueCard label="Dina" value={detail?.dino?.name} />
              <ValueCard label="Pasaran" value={detail?.pasaran?.name} />
              <ValueCard label="Neptu" value={detail?.neptu_total} />
              <ValueCard label="Wuku" value={detail?.wuku?.name} />
              <ValueCard label="Windu" value={detail ? detail.windu : null} />
              <ValueCard label="Lambang" value={jawa?.fields?.find((field) => field.k === 'Lambang')?.v} />
              <ValueCard label="Kurup" value={jawa?.fields?.find((field) => field.k === 'Kurup')?.v} />
              <ValueCard label="Tahun Jawa" value={detail?.tahun} />
            </div>

            {data?.jawa?.meta?.sunsetApplied && (
              <p className="mt-4 rounded-xl border border-amber-300/10 bg-amber-300/5 px-4 py-3 text-[11px] leading-5 text-amber-100/80">
                Waktu lahir melewati batas sunset yang dihitung engine, sehingga tanggal efektif Kalender Jawa bergeser ke hari berikutnya.
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </section>
  )
}
