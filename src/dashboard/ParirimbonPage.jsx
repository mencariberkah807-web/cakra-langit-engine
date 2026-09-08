import React from "react";

const CONTEXT = [
  ["Saptawara", "—"],
  ["Pancawara", "—"],
  ["Paringkelan", "—"],
  ["Wuku", "—"],
  ["Windu", "—"],
];

const METHODS = [
  ["Pernasiban", "Perhitungan pernasiban berdasarkan sumber terdokumentasi."],
  ["Watak", "Keterangan watak berdasarkan sumber tradisional."],
  ["Pertanian", "Perhitungan yang berkaitan dengan bertanam."],
  ["Lainnya", "Metode lain hanya ditampilkan setelah sumber dan metodenya tervalidasi."],
];

export default function ParirimbonPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Palintangan / Paririmbon</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Paririmbon Sunda</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Perhitungan dan keterangan berdasarkan sumber serta metode tradisional yang terdokumentasi.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-white">Data Tanggal / Waktu</h2>
          <p className="mt-1 text-sm text-slate-400">Masukkan konteks tanggal sebelum metode yang tersedia digunakan.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Tanggal</span>
              <input type="date" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Waktu</span>
              <input type="time" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none" />
            </label>
          </div>
          <button type="button" disabled className="mt-5 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400">
            Tampilkan Konteks
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-white">Calendar Context</h2>
          <div className="mt-4 space-y-3 text-sm">
            {CONTEXT.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-white">Metode Paririmbon</h2>
        <p className="mt-1 text-sm text-slate-400">Metode ditampilkan berdasarkan ketersediaan sumber dan implementasi yang tervalidasi.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {METHODS.map(([name, description]) => (
            <div key={name} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{name}</h3>
                <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">Segera</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5">
        <h2 className="text-base font-semibold text-white">Sumber &amp; Metode</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p className="text-slate-300"><span className="text-slate-500">Sumber:</span> PARIRIMBON SUNDA (JAWA BARAT)</p>
          <p className="text-slate-300"><span className="text-slate-500">Metode:</span> Belum terhubung ke engine</p>
          <p className="text-slate-300"><span className="text-slate-500">Status:</span> Source-backed / Research</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Hasil hanya akan ditampilkan setelah metode dan implementasinya tervalidasi. Tidak ada formula atau interpretasi baru yang dibuat oleh UI ini.
        </p>
      </div>
    </section>
  );
}
