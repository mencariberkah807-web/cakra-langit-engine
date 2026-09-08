const PILLARS = ["Year", "Month", "Day", "Hour"];
const DETAILS = [
  ["Heavenly Stem", "—"],
  ["Earthly Branch", "—"],
  ["Five Element", "—"],
  ["Polarity", "—"],
  ["Hidden Stems", "—"],
  ["Na Yin", "—"],
];

function SectionCard({ title, eyebrow, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-white/[0.07] bg-[#0A1723] shadow-[0_12px_40px_rgba(0,0,0,0.16)] ${className}`}>
      <div className="border-b border-white/[0.07] px-5 py-4 sm:px-6">
        {eyebrow && <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{eyebrow}</div>}
        <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function BaZiPage() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Chinese Lunar</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">BaZi</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">
          Perhitungan Four Pillars berdasarkan data kelahiran dan konteks solar terms.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <SectionCard title="Data Kelahiran" eyebrow="Input">
          <p className="-mt-1 mb-4 text-[11px] leading-5 text-[#536A7D]">Masukkan konteks kelahiran sebelum perhitungan dilakukan.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal lahir</span>
              <input type="date" className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Waktu lahir</span>
              <input type="time" className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Lokasi lahir</span>
              <input type="text" placeholder="Kota / lokasi" className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white placeholder:text-[#536A7D] outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Timezone</span>
              <input type="text" placeholder="Asia/Jakarta" className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white placeholder:text-[#536A7D] outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" />
            </label>
          </div>
          <button type="button" disabled className="mt-5 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3 text-sm font-semibold text-[#536A7D]">Hitung BaZi</button>
        </SectionCard>

        <SectionCard title="Calculation Context" eyebrow="Context">
          <div className="space-y-3 text-sm">
            {[["Solar Term", "—"], ["Li Chun / Jie", "—"], ["Timezone", "—"], ["Solar Time", "—"]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-3 last:border-0 last:pb-0">
                <span className="text-[#71869A]">{label}</span><span className="text-[#A9BDCF]">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard title="Four Pillars" eyebrow="Result">
          <p className="-mt-1 text-[11px] leading-5 text-[#536A7D]">Hasil utama akan muncul setelah engine terhubung.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div key={pillar} className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">{pillar}</p>
                <p className="mt-4 text-2xl font-semibold text-[#536A7D]">—</p>
                <p className="mt-2 text-xs text-[#71869A]">Stem / Branch</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard title="Core Details" eyebrow="Details">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DETAILS.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#536A7D]">{label}</p>
                <p className="mt-2 text-sm text-[#8FA4B8]">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <section className="rounded-2xl border border-dashed border-white/[0.12] bg-[#0A1723]/60 p-5 sm:p-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Method Boundary</div>
          <h2 className="mt-1 text-sm font-semibold text-white">Interpretation</h2>
          <p className="mt-2 text-sm leading-6 text-[#71869A]">
            Belum ditampilkan. Cakra Langit memisahkan perhitungan inti dari interpretasi agar metode dan sumber dapat ditelusuri dengan jelas.
          </p>
        </section>
      </div>
    </section>
  );
}
