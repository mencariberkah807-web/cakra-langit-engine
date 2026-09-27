import { useEffect, useState } from 'react'
import {
  Compass,
  HeartHandshake,
  Leaf,
  Moon,
  Route,
  UserRound,
} from 'lucide-react'
import { useTodayContext } from '../core/TodayContext'
import { useAuth } from '../auth/AuthContext'

const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function getApiBase() {
  if (typeof window !== 'undefined' && window.location.hostname.includes('-5173.app.github.dev')) return ''
  if (ENV_API_BASE) return ENV_API_BASE
  return 'http://127.0.0.1:8000'
}

function toDateISO(date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function Card({ icon: Icon, title, description, href }) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-[#0D1D2B] hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#12324A] text-[#22D3EE]">
        <Icon size={19} strokeWidth={1.7} />
      </div>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="mt-2 text-xs leading-5 text-[#71869A]">{description}</p>
        </div>
        <span className="text-[#536A7D] transition-colors group-hover:text-[#22D3EE]">→</span>
      </div>
    </a>
  )
}

function SummaryCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value || '—'}</div>
      {sub && <div className="mt-1 text-[11px] text-[#71869A]">{sub}</div>}
    </div>
  )
}

export default function PalintanganPage() {
  const { user } = useAuth()
  const { selectedDate, location, apiData } = useTodayContext()
  const isoDate = toDateISO(selectedDate)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isoDate) return
    let cancelled = false
    setLoading(true)
    setError('')

    fetch(`${getApiBase()}/api/palintangan/sunda?date_value=${isoDate}`)
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
  const navigation = data?.navigation
  const gagalang = data?.gagalang
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Pengguna'
  const locationName = location?.name || apiData?.location?.name || 'Lokasi aktif'

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Palintangan Sunda</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">
          Peta navigasi Palintangan Sunda. Pilih tujuan perhitungan yang ingin Anda gunakan.
        </p>
      </header>

      <section className="rounded-2xl border border-cyan-300/10 bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Profil & konteks aktif</div>
            <h2 className="mt-2 text-xl font-semibold text-white">{displayName}</h2>
            <p className="mt-1 text-xs text-[#71869A]">{locationName} · {formatDate(selectedDate)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Hari" value={calendar?.hari} />
            <SummaryCard label="Pasaran" value={calendar?.pasaran} />
            <SummaryCard label="Naktu" value={naktu?.wedal} sub="Wedal" />
            <SummaryCard label="Arah Rizki" value={navigation?.arah_rizki} />
          </div>
        </div>
        {loading && <div className="mt-4 text-xs text-[#71869A]">Memuat konteks Palintangan…</div>}
        {error && <div className="mt-4 rounded-xl border border-red-400/10 bg-red-950/20 px-4 py-3 text-xs text-red-200">{error}</div>}
      </section>

      <section className="mt-6">
        <div className="mb-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Navigasi Palintangan</div>
          <h2 className="mt-1 text-base font-semibold text-white">Apa yang ingin Anda hitung?</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            icon={UserRound}
            title="Kelahiran"
            description="Baca konteks kelahiran, naktu, watek, Gagalang, Pernaasan, dan Jaya / Apes."
            href="/dashboard/palintangan?view=kelahiran"
          />
          <Card
            icon={Moon}
            title="Hitung Nama"
            description="Masuk ke perhitungan naktu nama dan Pancaka yang mapping-nya sudah terverifikasi."
            href="/dashboard/palintangan?view=nama"
          />
          <Card
            icon={HeartHandshake}
            title="Repok / Jodoh"
            description="Ruang untuk membandingkan dua konteks personal dalam perhitungan yang relevan."
            href="/dashboard/palintangan?view=jodoh"
          />
          <Card
            icon={Leaf}
            title="Tanam / Panen"
            description="Gunakan tanggal dan rule Palintangan yang berkaitan dengan tanam, panen, dan hasil."
            href="/dashboard/palintangan?view=tanam-panen"
          />
          <Card
            icon={Route}
            title="Perjalanan / Arah"
            description="Baca Gagalang, arah, pantangan, dan keselamatan untuk konteks perjalanan."
            href="/dashboard/palintangan?view=perjalanan"
          />
          <Card
            icon={Compass}
            title="Waktu / Jam"
            description="Masuk ke perhitungan berbasis waktu dan jam ketika rule sumber sudah tersedia."
            href="/dashboard/palintangan?view=waktu"
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Peta Hari Ini</div>
        <div className="mt-1 text-base font-semibold text-white">Ringkasan navigasi</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Hari / Pasaran" value={calendar ? `${calendar.hari} · ${calendar.pasaran}` : null} />
          <SummaryCard label="Gagalang" value={gagalang?.direction} sub={gagalang?.next_pasaran ? `Pasaran berikutnya: ${gagalang.next_pasaran}` : null} />
          <SummaryCard label="Status Hari" value={navigation?.status_hari} sub={navigation?.interpretation} />
        </div>
        <p className="mt-4 text-xs leading-5 text-[#71869A]">
          Peta memberi pituduh; nu nyetir tetep urang. Detail formula dan jejak perhitungan ditempatkan di halaman perhitungan masing-masing, bukan di dashboard utama.
        </p>
      </section>
    </section>
  )
}
