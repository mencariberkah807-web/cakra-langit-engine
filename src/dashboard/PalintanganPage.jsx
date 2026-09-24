import { useMemo } from 'react'
import { useTodayContext } from '../core/TodayContext'
import CalculationNavCards from './CalculationNavCards'

const PASARAN_NAKTU = {
  Kliwon: 8,
  Kaliwon: 8,
  Legi: 5,
  Manis: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
}

function Section({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{eyebrow}</div>
      <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Value({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
      <div className="text-[10px] uppercase tracking-[0.1em] text-[#536A7D]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value || '—'}</div>
      {sub && <div className="mt-1 text-[11px] text-[#71869A]">{sub}</div>}
    </div>
  )
}

export default function PalintanganPage() {
  const { apiData, selectedDate, setSelectedDate } = useTodayContext()
  const jawa = useMemo(
    () => apiData?.calendars?.find((item) => item.id === 'jawa') || null,
    [apiData],
  )
  const detail = jawa?.detail || null
  const pasaranNaktu = detail?.pasaran?.name
    ? PASARAN_NAKTU[detail.pasaran.name]
    : null
  const naktuWedal = detail?.dino?.neptu && pasaranNaktu
    ? detail.dino.neptu + pasaranNaktu
    : null
  const isoDate = apiData?.date_info?.iso || selectedDate?.toISOString().slice(0, 10) || ''

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Palintangan Sunda</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">
          Layer perhitungan mengikuti pola kalender yang sudah dipakai pada Weton: tanggal → hari → pasaran → nilai dasar. Rule Palintangan ditambahkan setelah sumbernya terverifikasi.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <Section eyebrow="Input" title="Tanggal Perhitungan">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span>
            <input
              type="date"
              value={isoDate}
              onChange={(event) => {
                if (!event.target.value) return
                setSelectedDate(new Date(event.target.value + 'T12:00:00'))
              }}
              className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
            />
          </label>
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3 text-xs text-[#71869A]">
            SSOT tanggal: <span className="font-semibold text-[#A9BDCF]">{isoDate || '—'}</span>
          </div>
        </Section>

        <Section eyebrow="Calendar Base" title="Tanggal → Hari → Pasaran">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Value label="Hari" value={detail?.dino?.name} />
            <Value label="Pasaran" value={detail?.pasaran?.name} />
            <Value label="Naktu Hari" value={detail?.dino?.neptu} sub="nilai kalender Jawa saat ini" />
            <Value label="Naktu Pasaran" value={pasaranNaktu} sub="lookup Paririmbon" />
          </div>
        </Section>
      </div>

      <section className="mt-5 rounded-2xl border border-cyan-300/10 bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">First Calculation</div>
        <h2 className="mt-1 text-sm font-semibold text-white">Naktu Wedal</h2>
        <p className="mt-2 text-xs leading-5 text-[#71869A]">Hari + Pasaran → jumlah nilai dasar. Ini mengikuti struktur perhitungan yang sudah dipakai pada Weton; hasil Palintangan belum diterapkan.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-[#07111C] px-5 py-4 text-sm text-[#A9BDCF]">
            {detail?.dino?.name || '—'} <span className="text-[#536A7D]">({detail?.dino?.neptu ?? '—'})</span>
          </div>
          <span className="text-[#536A7D]">+</span>
          <div className="rounded-xl border border-white/[0.06] bg-[#07111C] px-5 py-4 text-sm text-[#A9BDCF]">
            {detail?.pasaran?.name || '—'} <span className="text-[#536A7D]">({pasaranNaktu ?? '—'})</span>
          </div>
          <span className="text-[#536A7D]">=</span>
          <div className="rounded-xl border border-cyan-300/15 bg-[#12324A] px-6 py-4 text-xl font-semibold text-white">
            {naktuWedal ?? '—'}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Section eyebrow="Calendar Context" title="Wuku">
          <div className="grid gap-3 sm:grid-cols-3">
            <Value label="Wuku" value={detail?.wuku?.name} />
            <Value label="Index" value={detail?.wuku?.index} />
            <Value label="Hari Wuku" value={detail?.wuku?.day_in_wuku} />
          </div>
        </Section>
        <Section eyebrow="Next Rule" title="Palintangan">
          <div className="rounded-xl border border-dashed border-white/[0.1] bg-[#07111C] p-4 text-xs leading-5 text-[#71869A]">
            Rule Palintangan belum dihitung pada tahap ini. Layer berikutnya harus menggunakan rule yang ditemukan dan diverifikasi dari <span className="font-semibold text-[#A9BDCF]">PARIRIMBON SUNDA (JAWA BARAT)</span>.
          </div>
        </Section>
      </div>
    <div className="mt-5">
      <CalculationNavCards current="/dashboard/palintangan" />
    </div>
    </section>
  )
}
