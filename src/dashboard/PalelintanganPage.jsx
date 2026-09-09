const SECTIONS = [
  ['Lintang', 'Nama lintang hasil siklus Pawukon 35 hari.'],
  ['Pawukon Context', 'Saptawara, Pancawara, Wuku, dan posisi hari.'],
]

export default function PalelintanganPage() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
      <div className="mb-7">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-400">Cakra Langit · Bali</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Palelintangan Bali</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Perhitungan Palelintangan berdasarkan siklus Pawukon dan 35 Lintang.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Tanggal Kelahiran</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs text-slate-400">Tanggal</span>
              <input type="date" className="w-full rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-3 text-sm text-white outline-none" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs text-slate-400">Waktu</span>
              <input type="time" className="w-full rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-3 text-sm text-white outline-none" />
            </label>
          </div>
          <button type="button" disabled className="mt-5 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-500">
            Hitung Palelintangan
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">Boundary saat ini mengikuti kalender Bali yang digunakan engine.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Hasil Palelintangan</div>
          <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
            <div className="text-xs uppercase tracking-[0.14em] text-cyan-400">Lintang</div>
            <div className="mt-2 text-2xl font-semibold text-white">—</div>
            <div className="mt-2 text-sm text-slate-400">Masukkan tanggal kelahiran untuk melihat hasil.</div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {SECTIONS.map(([title, description]) => (
              <div key={title} className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
                <div className="mt-3 text-sm text-slate-400">—</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Metode & Sumber</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div><div className="text-xs text-slate-500">Domain</div><div className="mt-1 text-sm text-white">Palelintangan / Wariga Bali</div></div>
          <div><div className="text-xs text-slate-500">Siklus</div><div className="mt-1 text-sm text-white">35 Lintang</div></div>
          <div><div className="text-xs text-slate-500">Method</div><div className="mt-1 text-sm text-white">Pawukon day mod 35</div></div>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">Implementasi mengikuti reference computation yang telah ditetapkan dalam riset; interpretasi watak/ramalan belum ditambahkan.</p>
      </div>
    </section>
  )
}
