import { useEffect, useState } from 'react'
import { useTodayContext } from '../core/TodayContext'

function Metric({ label, value, note }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5E7A8F]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value ?? '—'}</div>
      {note ? <div className="mt-1 text-[11px] leading-5 text-[#71869A]">{note}</div> : null}
    </div>
  )
}

function Panel({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{eyebrow}</div>
      <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
      {children}
    </section>
  )
}

function ListValue({ items }) {
  if (!items?.length) return <span className="text-[#71869A]">—</span>
  return <span>{items.join(' · ')}</span>
}

function DailyGlobalPage({ onBack }) {
  const { apiData, selectedDate, setSelectedDate } = useTodayContext()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isoDate =
    apiData?.date_info?.iso ||
    selectedDate?.toISOString().slice(0, 10) ||
    ''

  useEffect(() => {
    if (!isoDate) return

    let cancelled = false
    setLoading(true)
    setError('')

    fetch('/api/palintangan?date_value=' + encodeURIComponent(isoDate))
      .then((response) => {
        if (!response.ok) throw new Error('Palintangan API ' + response.status)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Gagal memuat perhitungan Palintangan')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isoDate])

  const naktu = result?.naktu
  const calendar = result?.calendar
  const monthly = result?.monthly_rule
  const pernaasan = result?.pernaasan
  const gagalang = result?.gagalang
  const watek = result?.watek

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <button type="button" onClick={onBack} className="mb-4 rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-2 text-xs font-semibold text-[#A9BDCF] hover:border-cyan-300/20">← Palintangan</button>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">
          Cakra Langit · Sunda
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Palintangan Sunda
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#8FA4B8]">
          Daily calculation engine berbasis Paririmbon Sunda: kalender → naktu →
          Gagalang → Watek → Pernaasan → aturan bulanan → Pancaka.
          Ini bukan Weton engine.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Panel eyebrow="Input" title="Tanggal Perhitungan">
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span>
            <input
              type="date"
              value={isoDate}
              onChange={(event) => {
                if (event.target.value) {
                  setSelectedDate(new Date(event.target.value + 'T12:00:00'))
                }
              }}
              className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Metric label="Tanggal SSOT" value={isoDate || '—'} />
            <Metric
              label="Status Engine"
              value={loading ? 'Calculating…' : result?.meta?.status || '—'}
              note={error || 'Backend calculation engine'}
            />
          </div>
        </Panel>

        <Panel eyebrow="Daily Calendar" title="Hari lengkap">
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Hari" value={calendar?.day} />
            <Metric label="Pasaran" value={calendar?.pasaran} />
            <Metric label="Hijriah" value={calendar?.hijri ? calendar.hijri.day + ' ' + calendar.hijri.month : '—'} />
            <Metric label="Tahun Hijriah" value={calendar?.hijri?.year ? calendar.hijri.year + ' H' : '—'} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Wuku" value={calendar?.wuku} note={calendar?.wuku_day ? 'Hari ke-' + calendar.wuku_day : null} />
            <Metric label="Mangsa" value={calendar?.mangsa} note="data musim Paririmbon" />
            <Metric label="Paringkelan" value={calendar?.paringkelan?.name} note={calendar?.paringkelan?.index ? 'Siklus ke-' + calendar.paringkelan.index + ' / 6' : null} />
            <Metric
              label="Saka Sunda"
              value={
                calendar?.saka_sunda
                  ? calendar.saka_sunda.day + ' ' + calendar.saka_sunda.month
                  : '—'
              }
              note={
                calendar?.saka_sunda?.year
                  ? calendar.saka_sunda.year + ' · ' + calendar.saka_sunda.year_type
                  : null
              }
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric label="Naktu Bulan" value={naktu?.bulan} note="lookup Paririmbon" />
            <Metric label="Naktu Tahun" value={naktu?.tahun} note="lookup Paririmbon" />
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-[#12324A] p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6EB9D2]">
              Naktu Wedal
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{naktu?.hari ?? '—'}</span>
              <span className="text-[#536A7D]">+</span>
              <span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{naktu?.pasaran ?? '—'}</span>
              <span className="text-[#536A7D]">=</span>
              <span className="rounded-lg bg-[#07111C] px-5 py-3 text-xl font-semibold text-white">{naktu?.wedal ?? '—'}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#7896A8]">
              Naktu Wedal = Naktu Hari + Naktu Pasaran.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#07111C] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#536A7D]">
              Four Naktu Total
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">{naktu?.four_component_total ?? '—'}</div>
            <div className="mt-1 text-xs text-[#71869A]">
              Hari + Pasaran + Bulan + Tahun
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel eyebrow="Gagalang" title="Gagalang Manis Pahing">
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric label="Pasaran saat ini" value={gagalang?.pasaran} />
            <Metric label="Pasaran berikutnya" value={gagalang?.next_pasaran} />
            <Metric label="Arah Gagalang" value={gagalang?.direction} note="arah yang ditunjukkan pasangan Gagalang" />
            <Metric label="Watek Hari" value={<ListValue items={watek?.names} />} />
          </div>
        </Panel>

        <Panel eyebrow="Monthly Rule" title={monthly?.group || 'Aturan bulan'}>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Metric label="Pantangan" value={<ListValue items={monthly?.pantangan} />} />
            <Metric label="Keselamatan" value={<ListValue items={monthly?.keselamatan} />} />
            <Metric label="Arah Rizki" value={monthly?.rizki_direction} />
            <Metric
              label="Status Hari Ini"
              value={
                monthly?.today_is_pantangan
                  ? 'Pantangan'
                  : monthly?.today_is_keselamatan
                    ? 'Keselamatan'
                    : 'Tidak termasuk dua daftar'
              }
            />
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel eyebrow="Pernaasan" title="Tanggal Naas bulan ini">
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(pernaasan?.dates || []).map((day) => (
              <div key={day} className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4 text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5E7A8F]">Tanggal</div>
                <div className="mt-2 text-2xl font-semibold text-white">{day}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#07111C] p-4">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">Tanggal Hijriah input</div>
            <div className="mt-1 text-sm font-semibold text-white">
              {pernaasan?.hijri_day ?? '—'} {pernaasan?.month || ''}
            </div>
            <div className="mt-2 text-xs text-[#7896A8]">
              {pernaasan?.is_pernaasan ? 'Tanggal ini termasuk Pernaasan.' : 'Tanggal ini bukan tanggal Pernaasan.'}
            </div>
          </div>
        </Panel>


      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Engine Boundary</div>
        <h2 className="mt-1 text-sm font-semibold text-white">Source-controlled calculation</h2>
        <p className="mt-3 max-w-4xl text-xs leading-6 text-[#7896A8]">
          Backend sekarang menghitung empat komponen Naktu dari tabel Paririmbon
          Sunda dan menjumlahkannya sebagai Four Naktu Total. Interpretasi hasil
          tidak dipaksa menjadi satu label baik/buruk, karena source menjelaskan
          bahwa penggunaan hasil perhitungan bergantung pada konteks niat atau pekerjaan.
        </p>
      </div>
    </section>
  )
}

function PertanianPage({ onBack }) {
  const { selectedDate, setSelectedDate } = useTodayContext()
  const isoDate = selectedDate?.toISOString().slice(0, 10) || ''
  const [activity, setActivity] = useState('panen')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isoDate) return
    let cancelled = false
    setLoading(true)
    setError('')
    fetch('/api/palintangan/pertanian?date_value=' + encodeURIComponent(isoDate) + '&activity=' + encodeURIComponent(activity))
      .then((response) => {
        if (!response.ok) throw new Error('Pertanian API ' + response.status)
        return response.json()
      })
      .then((data) => { if (!cancelled) setResult(data) })
      .catch((err) => { if (!cancelled) setError(err.message || 'Gagal memuat rule pertanian') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [isoDate, activity])

  const pancaka = result?.pancaka_4

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <button type="button" onClick={onBack} className="mb-5 rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF] hover:border-cyan-300/20">← Palintangan</button>
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Task · Pertanian</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Tanam / Panen</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Rule pertanian dipisahkan dari Daily Global. Pancaka 4 dihitung hanya di category ini. Pemetaan Tanam belum diaktifkan karena source yang tersedia baru memverifikasi konteks panen dan penyimpanan.</p>
      </header>
      <Panel eyebrow="Input" title="Tanggal & kegiatan">
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span>
            <input type="date" value={isoDate} onChange={(event) => event.target.value && setSelectedDate(new Date(event.target.value + 'T12:00:00'))} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Kegiatan</span>
            <select value={activity} onChange={(event) => setActivity(event.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none">
              <option value="tanam">Tanam</option>
              <option value="panen">Panen</option>
              <option value="simpan">Simpan hasil</option>
            </select>
          </label>
        </div>
      </Panel>
      <div className="mt-5">
        <Panel eyebrow="Pancaka 4" title="Hasil pertanian">
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{isoDate ? isoDate.slice(-2).replace(/^0/, '') : '—'}</span>
            <span className="text-[#536A7D]">÷ 4 → sisa</span>
            <span className="rounded-lg bg-[#12324A] px-5 py-3 text-xl font-semibold text-white">{pancaka?.remainder ?? '—'}</span>
          </div>
          <div className="mt-5 rounded-xl border border-cyan-300/10 bg-[#07111C] p-4">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">Hasil</div>
            <div className="mt-1 text-xl font-semibold text-white">{pancaka?.result || '—'}</div>
            <div className="mt-2 text-xs leading-5 text-[#7896A8]">{pancaka?.context ? pancaka.context + '. ' : ''}{pancaka?.meaning || error || (loading ? 'Calculating…' : '')}</div>
          </div>
        </Panel>
      </div>
    </section>
  )
}

const CATEGORIES = [
  {
    key: 'daily',
    eyebrow: 'Global',
    title: 'Daily Global',
    description: 'Kondisi kalender dan rule global untuk tanggal yang dipilih.',
  },
  {
    key: 'nama',
    eyebrow: 'Personal',
    title: 'Hitung Nama',
    description: 'Naktu nama dan rule yang menggunakan nama sebagai input.',
  },
  {
    key: 'kelahiran',
    eyebrow: 'Personal',
    title: 'Kelahiran',
    description: 'Perhitungan yang khusus menggunakan konteks kelahiran.',
  },
  {
    key: 'jodoh',
    eyebrow: 'Task',
    title: 'Repok / Jodoh',
    description: 'Perhitungan pasangan nama dan rule Repok/Jodoh.',
  },
  {
    key: 'tanam',
    eyebrow: 'Task',
    title: 'Tanam / Panen',
    description: 'Rule pertanian berdasarkan tanggal dan kegiatan.',
  },
  {
    key: 'arah',
    eyebrow: 'Task',
    title: 'Perjalanan / Arah',
    description: 'Rule arah dan Kala untuk kebutuhan perjalanan.',
  },
  {
    key: 'waktu',
    eyebrow: 'Task',
    title: 'Waktu / Jam',
    description: 'Rule intraday seperti Watek Jam jika datanya tersedia.',
  },
]

function CategoryCard({ category, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.key)}
      className="group rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 text-left transition hover:border-cyan-300/20 hover:bg-[#0D1C2A]"
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22D3EE]">
        {category.eyebrow}
      </div>
      <h2 className="mt-2 text-base font-semibold text-white">{category.title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#71869A]">{category.description}</p>
      <div className="mt-4 text-xs font-semibold text-[#6EB9D2] group-hover:text-cyan-200">
        Buka →
      </div>
    </button>
  )
}

function JodohPage({ onBack }) {
  const [one, setOne] = useState('')
  const [two, setTwo] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function calculate() {
    setError('')
    setResult(null)
    const a = Number(one)
    const b = Number(two)
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      setError('Masukkan dua nilai Naktu nama yang valid.')
      return
    }
    try {
      const response = await fetch('/api/palintangan/jodoh?naktu_nama_one=' + encodeURIComponent(a) + '&naktu_nama_two=' + encodeURIComponent(b))
      if (!response.ok) throw new Error('Jodoh API ' + response.status)
      setResult(await response.json())
    } catch (err) {
      setError(err.message || 'Gagal menghitung Repok/Jodoh')
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <button type="button" onClick={onBack} className="mb-5 rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF] hover:border-cyan-300/20">← Palintangan</button>
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Task · Repok / Jodoh</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Repok / Jodoh</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Pancaka 7 dipisahkan sebagai rule khusus Repok/Jodoh. Inputnya adalah hasil Naktu nama, bukan Naktu hari atau Four Naktu.</p>
      </header>
      <Panel eyebrow="Input" title="Naktu Nama">
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Naktu Nama 1</span><input type="number" min="1" value={one} onChange={(e) => setOne(e.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none" /></label>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Naktu Nama 2</span><input type="number" min="1" value={two} onChange={(e) => setTwo(e.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none" /></label>
        </div>
        <button type="button" onClick={calculate} className="mt-5 rounded-xl bg-[#12324A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#17415D]">Hitung Repok / Jodoh</button>
        {error ? <div className="mt-4 text-xs text-rose-300">{error}</div> : null}
      </Panel>
      {result ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Panel eyebrow="Naktu Nama" title="Input & total">
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="Nama 1" value={result.naktu_nama.one} />
              <Metric label="Nama 2" value={result.naktu_nama.two} />
              <Metric label="Total" value={result.naktu_nama.total} />
            </div>
          </Panel>
          <Panel eyebrow="Pancaka 7" title={result.pancaka_7.result}>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="Pembagi" value="7" />
              <Metric label="Sisa" value={result.pancaka_7.remainder} />
              <Metric label="Index" value={result.pancaka_7.result_index} />
            </div>
          </Panel>
        </div>
      ) : null}
    </section>
  )
}

function ArahPage({ onBack }) {
  const [dateValue, setDateValue] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function calculate() {
    setError('')
    setResult(null)
    if (!dateValue) { setError('Pilih tanggal.'); return }
    try {
      const response = await fetch('/api/palintangan/arah?date_value=' + encodeURIComponent(dateValue))
      if (!response.ok) throw new Error('Arah API ' + response.status)
      setResult(await response.json())
    } catch (err) {
      setError(err.message || 'Gagal menghitung arah')
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <button type="button" onClick={onBack} className="mb-5 rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF]">← Palintangan</button>
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Task · Arah</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Perjalanan / Arah</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Menampilkan arah rizki dari rule kelompok bulan yang sudah terdokumentasi.</p>
      </header>
      <Panel eyebrow="Input" title="Tanggal">
        <div className="mt-5 flex gap-3">
          <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} className="rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none" />
          <button type="button" onClick={calculate} className="rounded-xl bg-[#12324A] px-5 py-3 text-sm font-semibold text-white">Hitung</button>
        </div>
        {error ? <div className="mt-4 text-xs text-rose-300">{error}</div> : null}
      </Panel>
      {result ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Panel eyebrow="Arah Rizki" title={result.direction.rizki}>
            <p className="mt-4 text-sm leading-6 text-[#71869A]">Arah ini berasal dari kelompok bulan dalam source Palintangan.</p>
          </Panel>
          <Panel eyebrow="Context" title={result.calendar_context.day + ' · ' + result.calendar_context.pasaran}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Hijri" value={result.calendar_context.hijri.day + ' ' + result.calendar_context.hijri.month} />
              <Metric label="Rule" value="Rizki bulan" />
            </div>
          </Panel>
        </div>
      ) : null}
    </section>
  )
}

function KelahiranPage({ onBack }) {
  const [dateValue, setDateValue] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function calculate() {
    setError('')
    setResult(null)
    if (!dateValue) { setError('Pilih tanggal lahir.'); return }
    try {
      const response = await fetch('/api/palintangan/kelahiran?date_value=' + encodeURIComponent(dateValue))
      if (!response.ok) throw new Error('Kelahiran API ' + response.status)
      setResult(await response.json())
    } catch (err) {
      setError(err.message || 'Gagal menghitung kelahiran')
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <button type="button" onClick={onBack} className="mb-5 rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF]">← Palintangan</button>
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Personal · Kelahiran</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Kelahiran</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Tanggal lahir → calendar context → Naktu, Watek, dan data Palintangan yang sudah tervalidasi.</p>
      </header>
      <Panel eyebrow="Input" title="Tanggal lahir">
        <div className="mt-5 flex gap-3">
          <input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} className="rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none" />
          <button type="button" onClick={calculate} className="rounded-xl bg-[#12324A] px-5 py-3 text-sm font-semibold text-white">Hitung</button>
        </div>
        {error ? <div className="mt-4 text-xs text-rose-300">{error}</div> : null}
      </Panel>
      {result ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Panel eyebrow="Calendar Context" title={result.calendar.day + ' · ' + result.calendar.pasaran}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Wuku" value={result.calendar.wuku} />
              <Metric label="Paringkelan" value={result.calendar.paringkelan?.name} />
              <Metric label="Hijri" value={result.calendar.hijri?.day + ' ' + result.calendar.hijri?.month} />
              <Metric label="Saka Sunda" value={result.calendar.saka_sunda?.year} />
            </div>
          </Panel>
          <Panel eyebrow="Naktu" title="Naktu Wedal">
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Metric label="Hari" value={result.naktu.hari} />
              <Metric label="Pasaran" value={result.naktu.pasaran} />
              <Metric label="Wedal" value={result.naktu.wedal} />
            </div>
          </Panel>
          <Panel eyebrow="Watek" title="Watek Hari">
            <div className="mt-5 flex flex-wrap gap-2">{(result.watek.names || []).map((item) => <span key={item} className="rounded-full border border-white/[0.08] px-3 py-2 text-xs text-[#B8C9D8]">{item}</span>)}</div>
          </Panel>
          <Panel eyebrow="Jaya / Apes" title={result.jaya_apes.status}>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Jaya" value={result.jaya_apes.jaya || 'Belum tersedia'} />
              <Metric label="Apes" value={result.jaya_apes.apes || 'Belum tersedia'} />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#71869A]">{result.jaya_apes.note || 'Baseline tervalidasi.'}</p>
          </Panel>
          <Panel eyebrow="Boundary" title="Source status">
            <p className="mt-5 text-sm leading-6 text-[#71869A]">{result.meta.note}</p>
          </Panel>
        </div>
      ) : null}
    </section>
  )
}

function NamaPage({ onBack }) {
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function calculate() {
    setError('')
    setResult(null)
    if (!name.trim()) {
      setError('Masukkan nama.')
      return
    }
    try {
      const response = await fetch('/api/palintangan/nama?name=' + encodeURIComponent(name))
      if (!response.ok) throw new Error('Nama API ' + response.status)
      setResult(await response.json())
    } catch (err) {
      setError(err.message || 'Gagal menghitung Naktu Nama')
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <button type="button" onClick={onBack} className="mb-5 rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF] hover:border-cyan-300/20">← Palintangan</button>
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Personal · Nama</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Hitung Nama</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Naktu Nama dihitung dari segmen nama yang memiliki nilai tervalidasi. Dataset yang belum tersedia tidak ditebak.</p>
      </header>
      <Panel eyebrow="Input" title="Nama">
        <div className="mt-5 flex gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Wi Kan Ta" className="min-w-0 flex-1 rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" />
          <button type="button" onClick={calculate} className="rounded-xl bg-[#12324A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#17415D]">Hitung</button>
        </div>
        {error ? <div className="mt-4 text-xs text-rose-300">{error}</div> : null}
      </Panel>
      {result ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Panel eyebrow="Naktu Huruf / Segmen" title={result.status}>
            <div className="mt-5 space-y-3">
              {result.segments.map((segment) => {
                const found = result.naktu.find((item) => item.segment === segment)
                return <div key={segment} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3"><span className="text-sm text-[#A9BDCF]">{segment}</span><strong className="text-white">{found ? found.naktu : 'Belum tervalidasi'}</strong></div>
              })}
            </div>
            {result.unknown_segments?.length ? <p className="mt-4 text-xs leading-5 text-amber-300">Dataset belum memuat: {result.unknown_segments.join(', ')}.</p> : null}
          </Panel>
          <Panel eyebrow="Naktu Nama" title={result.total ?? 'Belum dapat dihitung'}>
            <p className="mt-5 text-sm leading-6 text-[#71869A]">Total hanya diberikan ketika seluruh segmen nama memiliki nilai source-backed.</p>
            {result.total !== null ? <div className="mt-4 text-xs text-[#536A7D]">Source-backed total Naktu Nama.</div> : null}
          </Panel>
        </div>
      ) : null}
    </section>
  )
}

function CategoryPlaceholder({ category, onBack }) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 rounded-xl border border-white/[0.08] bg-[#07111C] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF] hover:border-cyan-300/20"
      >
        ← Palintangan
      </button>

      <Panel eyebrow={category.eyebrow} title={category.title}>
        <div className="mt-5 rounded-xl border border-dashed border-white/[0.10] bg-[#07111C] p-5">
          <div className="text-sm font-semibold text-white">{category.title}</div>
          <p className="mt-2 text-sm leading-6 text-[#71869A]">
            {category.description}
          </p>
          <div className="mt-4 text-xs text-[#536A7D]">
            Category sudah dikunci. Rule calculation akan dihubungkan ke engine
            khusus category ini, tanpa mengambil logic dari category lain.
          </div>
        </div>
      </Panel>
    </section>
  )
}

export default function PalintanganPage() {
  const [category, setCategory] = useState(null)

  if (category === 'daily') {
    return <DailyGlobalPage onBack={() => setCategory(null)} />
  }

  if (category === 'tanam') {
    return <PertanianPage onBack={() => setCategory(null)} />
  }

  if (category === 'jodoh') {
    return <JodohPage onBack={() => setCategory(null)} />
  }

  if (category === 'nama') {
    return <NamaPage onBack={() => setCategory(null)} />
  }

  if (category === 'kelahiran') {
    return <KelahiranPage onBack={() => setCategory(null)} />
  }

  if (category === 'arah') {
    return <ArahPage onBack={() => setCategory(null)} />
  }

  if (category) {
    const selected = CATEGORIES.find((item) => item.key === category)
    return <CategoryPlaceholder category={selected} onBack={() => setCategory(null)} />
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">
          Cakra Langit · Sunda
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Palintangan Sunda
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#8FA4B8]">
          Pilih kebutuhan perhitungan. Daily Global tetap menjadi layer kalender
          bersama, sedangkan rule Personal dan Task dihitung hanya pada category
          yang sesuai.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((categoryItem) => (
          <CategoryCard
            key={categoryItem.key}
            category={categoryItem}
            onSelect={setCategory}
          />
        ))}
      </div>
    </section>
  )
}
