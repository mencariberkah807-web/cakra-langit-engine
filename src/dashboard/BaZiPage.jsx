import React from "react";

const PILLARS = ["Year", "Month", "Day", "Hour"];
const DETAILS = [
  ["Heavenly Stem", "—"],
  ["Earthly Branch", "—"],
  ["Five Element", "—"],
  ["Polarity", "—"],
  ["Hidden Stems", "—"],
  ["Na Yin", "—"],
];

export default function BaZiPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Four Pillars / 八字</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">BaZi</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Perhitungan Four Pillars berdasarkan data kelahiran dan konteks solar terms.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-white">Data Kelahiran</h2>
          <p className="mt-1 text-sm text-slate-400">Masukkan konteks kelahiran sebelum perhitungan dilakukan.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Tanggal lahir</span>
              <input type="date" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Waktu lahir</span>
              <input type="time" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Lokasi lahir</span>
              <input type="text" placeholder="Kota / lokasi" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white placeholder:text-slate-600 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Timezone</span>
              <input type="text" placeholder="Asia/Jakarta" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white placeholder:text-slate-600 outline-none" />
            </label>
          </div>
          <button type="button" disabled className="mt-5 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400">
            Hitung BaZi
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-white">Calculation Context</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[["Solar Term", "—"], ["Li Chun / Jie", "—"], ["Timezone", "—"], ["Solar Time", "—"]].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-400">{label}</span><span className="text-slate-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">Four Pillars</h2>
            <p className="mt-1 text-sm text-slate-400">Hasil utama akan muncul setelah engine terhubung.</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div key={pillar} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{pillar}</p>
              <p className="mt-4 text-2xl font-semibold text-slate-500">—</p>
              <p className="mt-2 text-sm text-slate-600">Stem / Branch</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-white">Core Details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DETAILS.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm text-slate-300">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5">
        <h2 className="text-base font-semibold text-white">Interpretation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Belum ditampilkan. Cakra Langit memisahkan perhitungan inti dari interpretasi agar metode dan sumber dapat ditelusuri dengan jelas.
        </p>
      </div>
    </section>
  );
}
