import { useMemo, useState } from 'react'

const PASARAN_NAKTU = [
  ['Kaliwon', 8],
  ['Manis / Legi', 5],
  ['Pahing', 9],
  ['Pon', 7],
  ['Wage', 4],
]

export default function PalintanganPage() {
  const [date, setDate] = useState('')

  const stage = useMemo(() => ({
    date,
    status: date ? 'READY FOR NEXT CALCULATION' : 'WAITING FOR DATE',
  }), [date])

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Palintangan Sunda</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">
          Perhitungan dibangun bertahap dari data dan rule yang dapat ditelusuri ke Paririmbon Sunda (Jawa Barat). Formula yang belum terverifikasi tidak dihitung.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Input</div>
          <h2 className="mt-1 text-sm font-semibold text-white">Tanggal Perhitungan</h2>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
            />
          </label>
          <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#536A7D]">Calculation Stage</div>
            <div className="mt-2 text-sm font-semibold text-white">Stage 1 · Input date</div>
            <p className="mt-1 text-xs leading-5 text-[#71869A]">{stage.status}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">SSOT Boundary</div>
          <h2 className="mt-1 text-sm font-semibold text-white">Calculation Pipeline</h2>
          <div className="mt-5 space-y-3">
            {[
              ['01', 'Tanggal', 'INPUT'],
              ['02', 'Saptawara / Hari', 'NEXT'],
              ['03', 'Pasaran', 'NEXT'],
              ['04', 'Naktu', 'NEXT'],
              ['05', 'Palintangan rule', 'RESEARCH'],
            ].map(([no, label, status]) => (
              <div key={no} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3">
                <span className="text-xs font-bold text-[#536A7D]">{no}</span>
                <span className="flex-1 text-sm text-[#A9BDCF]">{label}</span>
                <span className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#536A7D]">{status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Verified Data</div>
        <h2 className="mt-1 text-sm font-semibold text-white">Naktu Pasaran</h2>
        <p className="mt-2 text-xs leading-5 text-[#71869A]">
          Nilai ini sudah terdokumentasi dalam source. Belum digunakan untuk membuat rule Palintangan baru.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PASARAN_NAKTU.map(([name, value]) => (
            <div key={name} className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
              <div className="text-xs text-[#71869A]">{name}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-dashed border-white/[0.12] bg-[#0A1723]/60 p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Source Boundary</div>
        <h2 className="mt-1 text-sm font-semibold text-white">Paririmbon Sunda (Jawa Barat)</h2>
        <p className="mt-2 text-sm leading-6 text-[#71869A]">
          Primary source aktif. UGA KALA tidak digunakan. Calculation akan ditambahkan satu rule pada satu waktu setelah source, input, transform, output, dan context terverifikasi.
        </p>
      </section>
    </section>
  )
}
