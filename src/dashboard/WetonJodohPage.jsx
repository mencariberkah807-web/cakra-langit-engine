import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const JODOH = {
  1: { name: 'Pegat', desc: 'Dalam salah satu versi petungan, dikaitkan dengan ujian atau konflik yang perlu dikelola.' },
  2: { name: 'Ratu', desc: 'Dikaitkan dengan hubungan yang mendapat penghormatan dan dukungan lingkungan.' },
  3: { name: 'Jodoh', desc: 'Dikaitkan dengan kecocokan dan kemampuan saling menerima.' },
  4: { name: 'Topo', desc: 'Dikaitkan dengan masa penyesuaian dan perjuangan yang membutuhkan kesabaran.' },
  5: { name: 'Tinari', desc: 'Dikaitkan dengan kemudahan dan peluang rezeki dalam kehidupan bersama.' },
  6: { name: 'Padu', desc: 'Dikaitkan dengan potensi perbedaan pendapat yang perlu dikelola dengan komunikasi.' },
  7: { name: 'Sujanan', desc: 'Dikaitkan dengan ujian kepercayaan; bukan dasar untuk menuduh pasangan.' },
  8: { name: 'Pesthi', desc: 'Dikaitkan dengan ketenteraman dan kemampuan menjaga kerukunan.' },
}

async function getWeton(date) {
  const response = await fetch(`${API_BASE}/api/almanac?city=Bandung&date_value=${date}`)
  if (!response.ok) throw new Error('Gagal mengambil kalender Jawa')
  const payload = await response.json()
  const jawa = payload?.calendars?.find((item) => item.id === 'jawa')
  if (!jawa) throw new Error('Data Jawa tidak tersedia')
  return {
    weton: jawa.sub,
    dino: jawa.detail?.dino?.name,
    pasaran: jawa.detail?.pasaran?.name,
    neptu: Number(jawa.detail?.neptu_total),
    jawaDate: jawa.detail?.jawa_date,
  }
}

export default function WetonJodohPage() {
  const [firstDate, setFirstDate] = useState('')
  const [secondDate, setSecondDate] = useState('')
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function calculate() {
    if (!firstDate || !secondDate) {
      setError('Masukkan kedua tanggal lahir.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const [a, b] = await Promise.all([getWeton(firstDate), getWeton(secondDate)])
      const total = a.neptu + b.neptu
      const remainder = total % 8 || 8
      setFirst(a)
      setSecond(b)
      setResult({ total, remainder, ...JODOH[remainder] })
    } catch (err) {
      setError(err.message || 'Perhitungan gagal.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
      <div className="mb-7">
        <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#527D95]">Cakra Langit · Jawa</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#D8F3FF]">Kecocokan Jodoh Weton</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FAEC1]">Hitung weton dua orang, jumlah neptu, lalu baca kategori petungan jodoh.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {[['Orang Pertama', firstDate, setFirstDate], ['Orang Kedua', secondDate, setSecondDate]].map(([label, value, setter]) => (
          <div key={label} className="rounded-2xl border border-[#21425A] bg-[linear-gradient(135deg,rgba(10,28,42,0.98),rgba(5,15,24,0.98))] p-6">
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#78A9C7]">{label}</div>
            <h2 className="mt-2 text-lg font-semibold text-[#D8F3FF]">Tanggal Lahir</h2>
            <input
              type="date"
              value={value}
              onChange={(event) => setter(event.target.value)}
              className="mt-4 w-full rounded-xl border border-[#21425A] bg-[#071925] px-4 py-3 text-sm text-[#D8F3FF] outline-none"
            />
            {label === 'Orang Pertama' && first ? <div className="mt-4 text-sm text-[#A9C0CF]">{first.weton} · Neptu {first.neptu}<div className="mt-1 text-xs text-[#668397]">{first.jawaDate}</div></div> : null}
            {label === 'Orang Kedua' && second ? <div className="mt-4 text-sm text-[#A9C0CF]">{second.weton} · Neptu {second.neptu}<div className="mt-1 text-xs text-[#668397]">{second.jawaDate}</div></div> : null}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={calculate}
        disabled={loading}
        className="mt-5 w-full rounded-xl border border-[#2E78A0] bg-[#0C4665] px-4 py-3 text-sm font-bold text-[#E5F8FF] transition hover:bg-[#105575] disabled:opacity-50"
      >
        {loading ? 'Menghitung…' : 'Hitung Kecocokan'}
      </button>

      {error ? <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-300">{error}</div> : null}

      {result ? (
        <div className="mt-5 rounded-2xl border border-[#5A4A24] bg-[linear-gradient(135deg,rgba(25,25,17,0.98),rgba(10,17,22,0.98))] p-6">
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#D4B75E]">Hasil Petungan</div>
          <div className="mt-2 text-3xl font-semibold text-[#E6D58B]">{result.name}</div>
          <div className="mt-2 text-sm text-[#A99362]">Jumlah neptu: {result.total} · sisa {result.remainder}</div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#A9C0CF]">{result.desc}</p>
          <p className="mt-4 text-xs leading-5 text-[#668397]">Metode yang dipakai adalah salah satu versi pembagian 8 kategori: Pegat, Ratu, Jodoh, Topo, Tinari, Padu, Sujanan, Pesthi. Versi primbon lain dapat memakai pembagian berbeda.</p>
        </div>
      ) : null}
    </section>
  )
}
