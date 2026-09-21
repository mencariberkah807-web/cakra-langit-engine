import { useMemo } from 'react'
import { useTodayContext } from '../core/TodayContext'

const PASARAN_NAKTU = { Kliwon: 8, Kaliwon: 8, Legi: 5, Manis: 5, Pahing: 9, Pon: 7, Wage: 4 }

function Metric({ label, value, note }) {
  return <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5E7A8F]">{label}</div><div className="mt-2 text-lg font-semibold text-white">{value ?? '—'}</div>{note ? <div className="mt-1 text-[11px] text-[#71869A]">{note}</div> : null}</div>
}

export default function PalintanganPage() {
  const { apiData, selectedDate, setSelectedDate } = useTodayContext()
  const jawa = useMemo(() => apiData?.calendars?.find((item) => item.id === 'jawa') || null, [apiData])
  const detail = jawa?.detail || {}
  const dayNaktu = detail.dino?.neptu
  const pasaranNaktu = PASARAN_NAKTU[detail.pasaran?.name]
  const wedal = Number.isFinite(Number(dayNaktu)) && Number.isFinite(Number(pasaranNaktu)) ? Number(dayNaktu) + Number(pasaranNaktu) : null
  const isoDate = apiData?.date_info?.iso || selectedDate?.toISOString().slice(0, 10) || ''
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Palintangan Sunda</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Perhitungan menggunakan kalender Jawa yang sudah menjadi engine dasar: tanggal → hari → pasaran → naktu → naktu wedal.</p></header>
      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Input</div><h2 className="mt-1 text-sm font-semibold text-white">Tanggal Perhitungan</h2><label className="mt-5 block"><span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span><input type="date" value={isoDate} onChange={(event) => { if (event.target.value) setSelectedDate(new Date(event.target.value + 'T12:00:00')) }} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" /></label><div className="mt-4 rounded-xl border border-white/[0.06] bg-[#07111C] p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">SSOT</div><div className="mt-1 text-sm font-semibold text-[#C8DCEA]">{isoDate || '—'}</div></div></section>
        <section className="rounded-2xl border border-cyan-300/10 bg-[#0A1723] p-5 sm:p-6"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Calendar Base</div><h2 className="mt-1 text-sm font-semibold text-white">Weton sebagai dasar hitung</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Hari" value={detail.dino?.name} /><Metric label="Pasaran" value={detail.pasaran?.name} /><Metric label="Naktu Hari" value={dayNaktu} /><Metric label="Naktu Pasaran" value={pasaranNaktu} note="nilai Sunda" /></div>
          <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-[#12324A] p-5"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6EB9D2]">Naktu Wedal</div><div className="mt-3 flex flex-wrap items-center gap-3"><span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{dayNaktu ?? '—'}</span><span className="text-[#536A7D]">+</span><span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{pasaranNaktu ?? '—'}</span><span className="text-[#536A7D]">=</span><span className="rounded-lg bg-[#07111C] px-5 py-3 text-xl font-semibold text-white">{wedal ?? '—'}</span></div><p className="mt-3 text-xs leading-5 text-[#7896A8]">Naktu Wedal = Naktu Hari + Naktu Pasaran.</p></div></section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Calendar Context</div><h2 className="mt-1 text-sm font-semibold text-white">Konteks Weton</h2><div className="mt-5 grid gap-3 sm:grid-cols-3"><Metric label="Weton" value={jawa?.sub} /><Metric label="Wuku" value={detail.wuku?.name} /><Metric label="Hari Wuku" value={detail.wuku?.day_in_wuku} /></div></section>
        <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Palintangan</div><h2 className="mt-1 text-sm font-semibold text-white">Rule layer</h2><div className="mt-5 rounded-xl border border-dashed border-white/[0.1] bg-[#07111C] p-4 text-xs leading-6 text-[#7896A8]">Calendar base sudah aktif. Rule Palintangan Sunda berikutnya akan memakai hasil Weton/Naktu Wedal ini sebagai input, tanpa membuat formula baru di halaman.</div></section></div>
    </section>
  )
}