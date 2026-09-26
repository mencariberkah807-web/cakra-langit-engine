import { useEffect, useState } from 'react'
import { useTodayContext } from '../core/TodayContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function Section({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{eyebrow}</div>
      <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Value({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
      <div className="text-[10px] uppercase tracking-[0.1em] text-[#536A7D]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value ?? '—'}</div>
      {sub && <div className="mt-1 text-[11px] text-[#71869A]">{sub}</div>}
    </div>
  )
}

function DayList({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(items || []).map((item) => (
        <span key={item} className="rounded-full border border-white/[0.08] bg-[#07111C] px-3 py-1.5 text-xs font-semibold text-[#A9BDCF]">
          {item}
        </span>
      ))}
    </div>
  )
}

export default function PalintanganPage() {
  const { selectedDate, setSelectedDate } = useTodayContext()
  const isoDate = selectedDate?.toISOString().slice(0, 10) || ''
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isoDate) return
    let cancelled = false

    setLoading(true)
    setError('')

    fetch(`${API_BASE}/api/palintangan/sunda?date_value=${isoDate}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Palintangan API error: ${response.status}`)
        return response.json()
      })
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Gagal memuat Palintangan Sunda.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [isoDate])

  const calendar = data?.calendar_context
  const naktu = data?.naktu
  const pernaasan = data?.pernaasan
  const watekPatokan = data?.watek_patokan
  const gagalang = data?.gagalang
  const gagalangPoe = data?.gagalang_poe
  const navigation = data?.navigation
  const jayaApes = data?.jaya_apes

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Palintangan Sunda</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">
          Peta perhitungan Palintangan Sunda: waktu, naktu, pantangan, keselamatan, dan arah rizki. Peta memberi pituduh; nu nyetir tetep urang.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <Section eyebrow="Input" title="Tanggal Perhitungan">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span>
            <input
              type="date"
              value={isoDate}
              onChange={(event) => {
                if (!event.target.value) return
                setSelectedDate(new Date(`${event.target.value}T12:00:00`))
              }}
              className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
            />
          </label>
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3 text-xs text-[#71869A]">
            SSOT tanggal: <span className="font-semibold text-[#A9BDCF]">{isoDate || '—'}</span>
          </div>
          {loading && <div className="mt-3 text-xs text-[#71869A]">Menghitung Palintangan Sunda…</div>}
          {error && <div className="mt-3 rounded-xl border border-red-400/10 bg-red-950/20 px-4 py-3 text-xs text-red-200">{error}</div>}
        </Section>

        <Section eyebrow="Calendar Context" title="Waktu Kelahiran / Perhitungan">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Value label="Hari" value={calendar?.hari} />
            <Value label="Pasaran" value={calendar?.pasaran} />
            <Value label="Hijriah" value={calendar?.hijri ? `${calendar.hijri.day} ${calendar.hijri.month} ${calendar.hijri.year} H` : null} />
            <Value label="Wuku" value={calendar?.wuku} />
          </div>
        </Section>
      </div>

      <div className="mt-5">
        <Section eyebrow="Naktu" title="Naktu Wedal">
          <p className="text-xs leading-5 text-[#71869A]">Nilai hari + pasaran menjadi titik dasar perhitungan Palintangan. Nilai ini ditampilkan sebagai data kalkulasi, bukan sebagai keputusan otomatis.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Value label="Naktu Hari" value={naktu?.hari} sub={calendar?.hari} />
            <span className="text-[#536A7D]">+</span>
            <Value label="Naktu Pasaran" value={naktu?.pasaran} sub={calendar?.pasaran} />
            <span className="text-[#536A7D]">=</span>
            <div className="rounded-xl border border-cyan-300/15 bg-[#12324A] px-6 py-5 text-2xl font-semibold text-white">{naktu?.wedal ?? '—'}</div>
          </div>
          {naktu?.formula && <div className="mt-4 text-[11px] text-[#536A7D]">Trace: {naktu.formula}</div>}
        </Section>
      </div>

      <div className="mt-5">
        <Section eyebrow="Watek" title="Watek Patokan Bulan">
          <div className="grid gap-3 sm:grid-cols-3">
            <Value label="Bulan" value={watekPatokan?.month} />
            <Value label="Patokan" value={watekPatokan?.ordinal ? `Patokan ${watekPatokan.ordinal}` : null} />
            <Value label="Watek" value={watekPatokan?.watek} />
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#536A7D]">
            Dua belas Watek Patokan mengikuti urutan 12 bulan dalam sumber Paririmbon Sunda. Status data: {watekPatokan?.status || '—'}.
          </p>
        </Section>
      </div>

      <div className="mt-5">
        <Section eyebrow="Gagalang" title="Arah Keberuntungan Pasaran">
          <div className="grid gap-3 sm:grid-cols-3">
            <Value label="Pasaran" value={gagalang?.pasaran} />
            <Value label="Pasaran Berikutnya" value={gagalang?.next_pasaran} />
            <Value label="Arah" value={gagalang?.direction} />
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#536A7D]">
            Rule Gagalang pasaran dari Paririmbon Sunda. Status data: {gagalang?.status || '—'}.
          </p>
        </Section>
      </div>

      <div className="mt-5">
        <Section eyebrow="Gagalang Poe" title="Babalang Dua · Watek Patokan">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Value label="Bulan" value={calendar?.hijri?.month} />
            <Value label="Hari Patokan" value={gagalangPoe?.month_patokan?.hari} />
            <Value label="Patokan" value={gagalangPoe?.month_patokan?.ordinal ? `Patokan ${gagalangPoe.month_patokan.ordinal}` : null} />
            <Value label="Watek" value={gagalangPoe?.month_patokan?.watek} />
          </div>
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Hari Kalender Saat Ini</div>
            <div className="mt-2 text-sm font-semibold text-white">{gagalangPoe?.hari || '—'}</div>
            <div className="mt-1 text-[11px] text-[#71869A]">Ditampilkan terpisah dari Hari Patokan Babalang Dua.</div>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#536A7D]">
            Source mengaitkan Gagalang Poe dengan Babalang Dua dan 12 patokan tetap. Untuk bulan yang dipilih, hasil source-backed adalah pasangan Hari Patokan + Watek di atas.
          </p>
        </Section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Section eyebrow="Pernaasan" title="Hari Naas">
          <div className="grid gap-3 sm:grid-cols-3">
            <Value label="Bulan Hijriah" value={pernaasan?.month} />
            <Value label="Tanggal Pernaasan" value={pernaasan?.dates?.join(' · ') || '—'} />
            <Value label="Hari Ini" value={pernaasan?.is_today ? 'PERNAASAN' : 'Bukan pernaasan'} />
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#536A7D]">{pernaasan?.note}</p>
        </Section>

        <Section eyebrow="Navigation" title="Kala · Pantangan · Keselamatan · Rizki">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Pantangan</div>
              <DayList items={navigation?.pantangan_hari} />
            </div>
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Keselamatan</div>
              <DayList items={navigation?.hari_keselamatan} />
            </div>
            <div className="rounded-xl border border-cyan-300/10 bg-[#07111C] p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Arah Rizki</div>
              <div className="mt-2 text-xl font-semibold text-white">{navigation?.arah_rizki || '—'}</div>
              <div className="mt-1 text-[11px] text-[#71869A]">Kelompok bulan {navigation?.month_group ?? '—'}</div>
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-5">
        <Section eyebrow="Jaya / Apes" title="Siklus Jaya · Apes">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Value label="Naktu Wedal" value={jayaApes?.wedal} sub={jayaApes?.hari && jayaApes?.pasaran ? `${jayaApes.hari} · ${jayaApes.pasaran}` : null} />
            <Value label="Jaya" value={jayaApes?.jaya} sub={jayaApes?.jaya_index != null ? `Index ${jayaApes.jaya_index}` : null} />
            <Value label="Apes" value={jayaApes?.apes} sub={jayaApes?.apes_index != null ? `Index ${jayaApes.apes_index}` : null} />
            <Value label="Status" value={jayaApes?.status === 'CAKRA_LANGIT_RECONSTRUCTED' ? 'REKONSTRUKSI' : jayaApes?.status} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Formula Jaya</div>
              <div className="mt-2 font-mono text-sm text-[#A9BDCF]">{jayaApes?.wedal != null ? `${jayaApes.wedal} mod 7 = ${jayaApes.jaya_index}` : '—'}</div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Formula Apes</div>
              <div className="mt-2 font-mono text-sm text-[#A9BDCF]">{jayaApes?.wedal != null ? `(${jayaApes.wedal} - 2) mod 7 = ${jayaApes.apes_index}` : '—'}</div>
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#536A7D]">{jayaApes?.source?.note || '—'}</p>
        </Section>
      </div>

      <div className="mt-5">
        <Section eyebrow="Navigation Status" title={navigation?.status_hari || '—'}>
          <p className="text-sm leading-6 text-[#A9BDCF]">{navigation?.interpretation || '—'}</p>
          <div className="mt-4 rounded-xl border border-dashed border-white/[0.1] bg-[#07111C] p-4 text-xs leading-5 text-[#71869A]">
            <strong className="text-[#A9BDCF]">Prinsip CAKRA LANGIT:</strong> hasil ini adalah informasi navigasi berdasarkan rule Palintangan yang dikompilasi dari sumber. Pengguna tetap menjadi pengemudi dan menentukan keputusan sendiri.
          </div>
        </Section>
      </div>

      {data?.trace?.length > 0 && (
        <div className="mt-5">
          <Section eyebrow="Calculation Trace" title="Jejak Perhitungan">
            <div className="space-y-3">
              {data.trace.map((item) => (
                <div key={item.step} className="grid gap-2 rounded-xl border border-white/[0.06] bg-[#07111C] p-4 sm:grid-cols-[42px_180px_1fr]">
                  <span className="text-xs font-bold text-[#536A7D]">#{item.step}</span>
                  <span className="text-xs font-semibold text-[#A9BDCF]">{item.rule}</span>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] leading-5 text-[#71869A]">{JSON.stringify(item.result)}</pre>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </section>
  )
}
