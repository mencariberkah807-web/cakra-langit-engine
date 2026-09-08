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

function Status({ children }) {
  return <span className="rounded-full border border-white/[0.08] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536A7D]">{children}</span>;
}

export default function ParirimbonPage() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Paririmbon Sunda</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">
          Digitalisasi data dan metode Paririmbon Sunda dengan provenance sumber yang jelas. Data yang sudah terdokumentasi ditampilkan tanpa mengubahnya menjadi formula ramalan baru.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <SectionCard title="Data Tanggal / Waktu" eyebrow="Input">
          <p className="-mt-1 mb-4 text-[11px] leading-5 text-[#536A7D]">Konteks input untuk layer kalender dan metode yang relevan.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span><input type="date" className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" /></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Waktu</span><input type="time" className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" /></label>
          </div>
          <button type="button" disabled className="mt-5 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3 text-sm font-semibold text-[#536A7D]">Tampilkan Konteks</button>
        </SectionCard>

        <SectionCard title="Calendar Context" eyebrow="Context">
          <div className="space-y-3 text-sm">
            {CALENDAR_LAYERS.map(([label, status]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-3 last:border-0 last:pb-0"><span className="text-[#71869A]">{label}</span><Status>{status}</Status></div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard title="Naktu" eyebrow="Method">
          <p className="-mt-1 text-[11px] leading-5 text-[#536A7D]">Komponen Naktu yang sudah memiliki status penelitian di Master Rule Matrix.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]"><tr><th className="pb-3">Component</th><th className="pb-3">Input</th><th className="pb-3">Transform</th><th className="pb-3">Status</th></tr></thead>
              <tbody>{NAKTU.map(([component, input, transform, status]) => <tr key={component} className="border-t border-white/[0.07]"><td className="py-3 text-[#A9BDCF]">{component}</td><td className="py-3 text-[#71869A]">{input}</td><td className="py-3 text-[#71869A]">{transform}</td><td className="py-3"><Status>{status}</Status></td></tr>)}</tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SectionCard title="Pasaran — Naktu" eyebrow="Reference">
          <p className="-mt-1 text-[11px] leading-5 text-[#536A7D]">Nilai yang disebutkan secara eksplisit dalam sumber.</p>
          <div className="mt-4 space-y-3 text-sm">{PASARAN.map(([name, value]) => <div key={name} className="flex justify-between border-b border-white/[0.07] pb-3 last:border-0"><span className="text-[#A9BDCF]">{name}</span><strong className="text-white">{value}</strong></div>)}</div>
        </SectionCard>

        <SectionCard title="Metode & Status" eyebrow="Method Boundary">
          <div className="space-y-3">{METHODS.map(([name, description, status]) => <div key={name} className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-white">{name}</h3><Status>{status}</Status></div><p className="mt-2 text-sm leading-6 text-[#71869A]">{description}</p></div>)}</div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard title="Pernaasan — Data SSOT" eyebrow="Source Data">
          <p className="-mt-1 text-[11px] leading-5 text-[#536A7D]">Tiga tanggal pernaasan per bulan. Sumber menyatakan cara penentuannya belum berhasil diketahui secara pasti.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]"><tr><th className="pb-3">Bulan</th><th className="pb-3">Tanggal 1</th><th className="pb-3">Tanggal 2</th><th className="pb-3">Tanggal 3</th></tr></thead>
              <tbody>{PERNAASAN.map(([month, d1, d2, d3]) => <tr key={month} className="border-t border-white/[0.07]"><td className="py-3 text-[#A9BDCF]">{month}</td><td className="py-3 text-[#71869A]">{d1}</td><td className="py-3 text-[#71869A]">{d2}</td><td className="py-3 text-[#71869A]">{d3}</td></tr>)}</tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="mt-5">
        <section className="rounded-2xl border border-dashed border-white/[0.12] bg-[#0A1723]/60 p-5 sm:p-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Method Boundary</div>
          <h2 className="mt-1 text-sm font-semibold text-white">Sumber &amp; Method Boundary</h2>
          <p className="mt-2 text-sm leading-6 text-[#71869A]">Primary source: <span className="text-[#A9BDCF]">PARIRIMBON SUNDA (JAWA BARAT)</span>. UGA KALA tidak digunakan. Pancasuda Universal, Kala Alit, dan Kala Ageung tetap NOT LOCKED sampai rule SSOT terverifikasi.</p>
          <p className="mt-2 text-sm leading-6 text-[#536A7D]">UI ini hanya mempresentasikan data dan status penelitian. Formula yang belum terverifikasi tidak dihitung atau disimpulkan oleh page.</p>
        </section>
      </div>
    </section>
  );
}
