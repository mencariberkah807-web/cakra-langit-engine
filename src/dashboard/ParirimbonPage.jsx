import React from "react";

const CALENDAR_LAYERS = [
  ["Saptawara", "VERIFIED"],
  ["Pancawara / Pasaran", "VERIFIED"],
  ["Paringkelan / Sadwara", "VERIFIED"],
  ["Wuku", "VERIFIED"],
  ["Windu", "PARTIAL"],
  ["Mangsa", "VERIFIED"],
];

const NAKTU = [
  ["Naktu Hari", "Saptawara", "Lookup SSOT", "LOCKED"],
  ["Naktu Pasaran", "Pasaran", "Lookup SSOT", "VERIFIED"],
  ["Naktu Bulan", "Bulan", "Lookup SSOT", "LOCKED"],
  ["Naktu Tahun", "Tahun", "Lookup SSOT", "LOCKED"],
  ["Naktu Wedal", "Hari + Pasaran", "Jumlah Naktu", "LOCKED"],
  ["Naktu Ngaran", "Nama", "Segment → Naktu → total", "LOCKED"],
  ["Naktu Huruf", "Aksara / nama", "Lookup dataset", "VERIFIED"],
];

const PASARAN = [
  ["Kaliwon", "8"],
  ["Manis", "5"],
  ["Pahing", "9"],
  ["Pon", "7"],
  ["Wage", "4"],
];

const PERNAASAN = [
  ["Muharam", "3", "12", "20"],
  ["Sapar", "1", "10", "20"],
  ["Rabiulawal", "7", "11", "15"],
  ["Rabiulakhir", "3", "10", "20"],
  ["Jumadilawal", "5", "10", "11"],
  ["Jumadilakhir", "3", "10", "14"],
  ["Rajab", "3", "7", "10"],
  ["Rewah", "1", "11", "20"],
  ["Puasa", "9", "20", "29"],
  ["Sawal", "—", "—", "—"],
  ["Dulkaidah", "3", "12", "20"],
  ["Rayagung", "2", "6", "20"],
];

const METHODS = [
  ["Naktu", "Layer nilai yang bersumber dari komponen kalender dan data personal.", "SOURCE-BACKED"],
  ["Pernaasan", "Tanggal pernaasan per bulan tersedia sebagai data SSOT; formula pembentukannya belum diketahui.", "VERIFIED / FORMULA UNKNOWN"],
  ["Kala", "Konsep arah, pantangan, keselamatan, dan rizki terdokumentasi; rule tertentu masih perlu validasi.", "PARTIAL"],
  ["Watek", "12 Watek Patokan terdokumentasi dan harus dipisahkan dari Watek Jam.", "VERIFIED"],
  ["Watek Jam", "Perhitungan intraday terbukti ada, tetapi interval lengkap belum direkonstruksi.", "PARTIAL"],
  ["Pancaka", "Keluarga metode dengan konteks berbeda; tidak boleh diperlakukan sebagai satu formula universal.", "PARTIAL"],
];

function Status({ children }) {
  return <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">{children}</span>;
}

export default function ParirimbonPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Palintangan / Paririmbon</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Paririmbon Sunda</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Digitalisasi data dan metode Paririmbon Sunda dengan provenance sumber yang jelas. Data yang sudah terdokumentasi ditampilkan tanpa mengubahnya menjadi formula ramalan baru.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-white">Data Tanggal / Waktu</h2>
          <p className="mt-1 text-sm text-slate-400">Konteks input untuk layer kalender dan metode yang relevan.</p>
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
            {CALENDAR_LAYERS.map(([label, status]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-400">{label}</span><Status>{status}</Status>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-white">Naktu</h2>
        <p className="mt-1 text-sm text-slate-400">Komponen Naktu yang sudah memiliki status penelitian di Master Rule Matrix.</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.1em] text-slate-500">
              <tr><th className="pb-3">Component</th><th className="pb-3">Input</th><th className="pb-3">Transform</th><th className="pb-3">Status</th></tr>
            </thead>
            <tbody>{NAKTU.map(([component, input, transform, status]) => (
              <tr key={component} className="border-t border-slate-800">
                <td className="py-3 text-slate-200">{component}</td><td className="py-3 text-slate-400">{input}</td><td className="py-3 text-slate-400">{transform}</td><td className="py-3"><Status>{status}</Status></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-white">Pasaran — Naktu</h2>
          <p className="mt-1 text-sm text-slate-400">Nilai yang disebutkan secara eksplisit dalam sumber.</p>
          <div className="mt-4 space-y-3 text-sm">
            {PASARAN.map(([name, value]) => <div key={name} className="flex justify-between border-b border-slate-800 pb-3 last:border-0"><span className="text-slate-300">{name}</span><strong className="text-white">{value}</strong></div>)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-white">Metode &amp; Status</h2>
          <div className="mt-4 space-y-3">
            {METHODS.map(([name, description, status]) => (
              <div key={name} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-white">{name}</h3><Status>{status}</Status></div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-white">Pernaasan — Data SSOT</h2>
        <p className="mt-1 text-sm text-slate-400">Tiga tanggal pernaasan per bulan. Sumber menyatakan cara penentuannya belum berhasil diketahui secara pasti.</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.1em] text-slate-500"><tr><th className="pb-3">Bulan</th><th className="pb-3">Tanggal 1</th><th className="pb-3">Tanggal 2</th><th className="pb-3">Tanggal 3</th></tr></thead>
            <tbody>{PERNAASAN.map(([month, d1, d2, d3]) => <tr key={month} className="border-t border-slate-800"><td className="py-3 text-slate-200">{month}</td><td className="py-3 text-slate-400">{d1}</td><td className="py-3 text-slate-400">{d2}</td><td className="py-3 text-slate-400">{d3}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5">
        <h2 className="text-base font-semibold text-white">Sumber &amp; Method Boundary</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Primary source: <span className="text-slate-300">PARIRIMBON SUNDA (JAWA BARAT)</span>. UGA KALA tidak digunakan. Pancasuda Universal, Kala Alit, dan Kala Ageung tetap NOT LOCKED sampai rule SSOT terverifikasi.</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">UI ini hanya mempresentasikan data dan status penelitian. Formula yang belum terverifikasi tidak dihitung atau disimpulkan oleh page.</p>
      </div>
    </section>
  );
}
