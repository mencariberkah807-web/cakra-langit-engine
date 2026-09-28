const CALCULATIONS = [
  { id: 'weton', label: 'Weton', description: 'Dina, Pasaran, dan Neptu' },
  { id: 'pangarasan', label: 'Pangarasan', description: 'Perhitungan berdasarkan Neptu' },
  { id: 'pancasuda', label: 'Pancasuda', description: 'Metode Pancasuda yang bersumber' },
  { id: 'rakam', label: 'Rakam', description: 'Perhitungan Rakam' },
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

export default function WetonPage() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Jawa</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Weton Jawa</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">
          Workspace untuk menghitung dan membaca data Weton berdasarkan metode yang tersedia.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-5">
          <SectionCard title="Data Kelahiran" eyebrow="Input">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal lahir</span>
                <input
                  type="date"
                  className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Waktu lahir</span>
                <input
                  type="time"
                  className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                />
              </label>
            </div>
            <p className="mt-4 text-[11px] leading-5 text-[#536A7D]">Input ini menjadi konteks untuk perhitungan Weton. Belum terhubung ke engine pada tahap UI shell.</p>
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
            <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-5 text-center sm:p-7">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">Belum ada data</div>
              <div className="mt-2 text-lg font-semibold text-white">Masukkan data kelahiran</div>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#71869A]">
                Hasil Weton akan ditampilkan di area ini setelah page dihubungkan ke engine yang sudah ada.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Konteks Kalender Jawa" eyebrow="Calendar Context">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {['Dina', 'Pasaran', 'Neptu', 'Wuku', 'Windu', 'Lambang', 'Kurup', 'Tahun Jawa'].map((label) => (
                <div key={label} className="rounded-xl border border-white/[0.06] bg-[#07111C] px-3 py-3">
                  <div className="text-[10px] text-[#536A7D]">{label}</div>
                  <div className="mt-1 text-xs font-semibold text-[#8FA4B8]">—</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  )
}
