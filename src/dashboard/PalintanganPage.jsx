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

export default function PalintanganPage() {
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
  const pancaka = result?.pancaka_4

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

        <Panel eyebrow="Pancaka 4" title="Hasil tanggal">
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{pancaka?.input_day_of_month ?? '—'}</span>
            <span className="text-[#536A7D]">÷ 4 → sisa</span>
            <span className="rounded-lg bg-[#12324A] px-5 py-3 text-xl font-semibold text-white">{pancaka?.remainder ?? '—'}</span>
          </div>
          <div className="mt-5 rounded-xl border border-cyan-300/10 bg-[#07111C] p-4">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">Hasil</div>
            <div className="mt-1 text-xl font-semibold text-white">{pancaka?.result || '—'}</div>
            <div className="mt-2 text-xs leading-5 text-[#7896A8]">
              {pancaka?.context ? pancaka.context + '. ' : ''}
              {pancaka?.meaning || ''}
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
