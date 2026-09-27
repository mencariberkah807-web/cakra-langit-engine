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

function SummaryCard({ label, value, sub, meaning }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value || '—'}</div>
      {sub && <div className="mt-1 text-[11px] text-[#71869A]">{sub}</div>}
      {meaning && <div className="mt-2 text-[11px] leading-4 text-[#8FA4B8]">{meaning}</div>}
    </div>
  )
}

function DetailView({ view, data, selectedDate, displayName, locationName }) {
  const calendar = data?.calendar_context
  const naktu = data?.naktu
  const navigation = data?.navigation
  const gagalang = data?.gagalang
  const watek = data?.watek_patokan
  const pernaasan = data?.pernaasan
  const jayaApes = data?.jaya_apes

  const titles = {
    kelahiran: ['Kelahiran', 'Konteks kelahiran dan hasil Palintangan personal.'],
    nama: ['Hitung Nama', 'Perhitungan naktu nama dan Pancaka yang tersedia.'],
    jodoh: ['Repok / Jodoh', 'Ruang perbandingan dua konteks personal.'],
    'tanam-panen': ['Tanam / Panen', 'Konteks tanggal untuk tanam dan panen.'],
    perjalanan: ['Perjalanan / Arah', 'Gagalang, arah, pantangan, dan keselamatan.'],
    waktu: ['Waktu / Jam', 'Perhitungan berbasis waktu dan jam.'],
  }
  const [title, description] = titles[view] || titles.kelahiran

  const detail = {
    kelahiran: [
      ['Hari / Pasaran', calendar ? `${calendar.hari} · ${calendar.pasaran}` : '—', 'Kalender kelahiran'],
      ['Naktu Wedal', naktu?.wedal, 'Hari + pasaran'],
      ['Watek Patokan', watek?.watek, watek?.month],
      ['Jaya / Apes', jayaApes ? `${jayaApes.jaya} / ${jayaApes.apes}` : '—', 'Status rekonstruksi Cakra Langit'],
    ],
    nama: [
      ['Naktu Nama', 'Siap dihitung', 'Gunakan konteks nama pada modul Hitung Nama'],
      ['Pancaka 4 / 5', 'Tersedia', 'Mapping terverifikasi'],
      ['Pancaka 7 / 8 / 12', 'Tersedia', 'Mapping terverifikasi sesuai konteks'],
    ],
    jodoh: [
      ['Profil pertama', displayName, 'Konteks aktif'],
      ['Profil kedua', 'Belum dipilih', 'Perlu konteks orang kedua'],
      ['Status', 'Siap untuk perbandingan', 'Rule detail belum ditampilkan di hub'],
    ],
    'tanam-panen': [
      ['Tanggal', selectedDate ? formatDate(selectedDate) : '—', 'Tanggal aktif'],
      ['Pernaasan', pernaasan?.is_today ? 'PERNAASAN' : 'Bukan pernaasan', pernaasan?.dates?.join(' · ') || '—'],
      ['Status hari', navigation?.status_hari, navigation?.interpretation],
    ],
    perjalanan: [
      ['Arah Rizki', navigation?.arah_rizki, 'Rule kelompok bulan'],
      ['Gagalang', gagalang?.direction, gagalang?.next_pasaran ? `Pasaran berikutnya: ${gagalang.next_pasaran}` : null],
      ['Keselamatan', navigation?.hari_keselamatan?.join(' · ') || '—', 'Hari keselamatan'],
      ['Pantangan', navigation?.pantangan_hari?.join(' · ') || '—', 'Hari pantangan'],
    ],
    waktu: [
      ['Naktu Wedal', naktu?.wedal, naktu?.formula || '—'],
      ['Hari', calendar?.hari, 'Konteks hari aktif'],
      ['Pasaran', calendar?.pasaran, 'Konteks pasaran aktif'],
    ],
  }[view] || []

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <a href="/dashboard/palintangan" className="text-xs font-semibold text-[#22D3EE] hover:text-white">← Kembali ke Palintangan</a>
      <header className="mt-5 mb-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Palintangan Sunda · Perhitungan</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">{description}</p>
      </header>

      <section className="rounded-2xl border border-cyan-300/10 bg-[#0A1723] p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Konteks Personal</div>
        <div className="mt-2 text-lg font-semibold text-white">{displayName}</div>
        <div className="mt-1 text-xs text-[#71869A]">{locationName} · {formatDate(selectedDate)}</div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {detail.map(([label, value, sub]) => (
          <SummaryCard key={label} label={label} value={value} sub={sub} />
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="text-sm font-semibold text-white">Navigasi lanjutan</div>
        <p className="mt-2 text-xs leading-5 text-[#71869A]">
          Perhitungan detail akan mengikuti data sumber yang sudah tersedia. Formula yang belum terverifikasi tidak diisi dengan inferensi.
        </p>
        <a href="/dashboard/palintangan" className="mt-4 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF] hover:bg-white/[0.07] hover:text-white">
          Pilih perhitungan lain
        </a>
      </section>
    </section>
  )
}

export default function PalintanganPage() {
  const { user } = useAuth()
  const { selectedDate, location, apiData } = useTodayContext()
  const isoDate = toDateISO(selectedDate)
  const view = new URLSearchParams(window.location.search).get('view')
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
  const gagalangPoe = data?.gagalang_poe
  const watekPatokan = data?.watek_patokan
  const pernaasan = data?.pernaasan
  const jayaApes = data?.jaya_apes
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Pengguna'
  const locationName = location?.name || apiData?.location?.name || 'Lokasi aktif'

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Palintangan Sunda</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">
          Peta navigasi Palintangan Sunda. Lihat peta hari ini terlebih dahulu, lalu pilih perhitungan yang ingin Anda gunakan.
        </p>
      </header>

      <section className="rounded-2xl border border-cyan-300/10 bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Profil & konteks aktif</div>
            <h2 className="mt-2 text-xl font-semibold text-white">{displayName}</h2>
            <p className="mt-1 text-xs text-[#71869A]">{locationName} · {formatDate(selectedDate)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryCard label="Hari" value={calendar?.hari} />
            <SummaryCard label="Pasaran" value={calendar?.pasaran} />
            <SummaryCard label="Naktu Wedal" value={naktu?.wedal} />
          </div>
        </div>
        {loading && <div className="mt-4 text-xs text-[#71869A]">Memuat konteks Palintangan…</div>}
        {error && <div className="mt-4 rounded-xl border border-red-400/10 bg-red-950/20 px-4 py-3 text-xs text-red-200">{error}</div>}
      </section>

      <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22D3EE]">Peta Hari Ini</div>
        <div className="mt-1 text-base font-semibold text-white">Konteks Palintangan untuk hari yang dipilih</div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Hari · Pasaran"
            value={calendar ? `${calendar.hari} · ${calendar.pasaran}` : null}
            sub={calendar?.wuku ? `Wuku ${calendar.wuku}` : null}
            meaning="Identitas hari yang menjadi dasar pembacaan Palintangan."
          />
          <SummaryCard
            label="Hijriah"
            value={calendar?.hijri ? `${calendar.hijri.day} ${calendar.hijri.month}` : null}
            sub={calendar?.hijri?.year ? `${calendar.hijri.year} H` : null}
            meaning="Menentukan bulan dan kelompok aturan Palintangan yang sedang berlaku."
          />
          <SummaryCard
            label="Watek Patokan"
            value={watekPatokan?.watek}
            sub={watekPatokan?.month ? `Bulan ${watekPatokan.month}` : null}
            meaning="Watek yang menjadi patokan karakter bulan menurut sumber."
          />
          <SummaryCard
            label="Status Hari"
            value={navigation?.status_hari}
            sub={navigation?.interpretation}
            meaning="NORMAL berarti tidak masuk pantangan atau hari selamet khusus; NAAS dan SELAMET mengikuti rule bulan."
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Gagalang Pasaran"
            value={gagalang?.direction}
            sub={gagalang?.next_pasaran ? `Berikutnya: ${gagalang.next_pasaran}` : null}
            meaning="Arah yang ditunjukkan oleh rotasi pasaran dalam rule Gagalang."
          />
          <SummaryCard
            label="Gagalang Poe"
            value={gagalangPoe?.watek?.join(' · ') || '—'}
            sub={gagalangPoe?.month_patokan?.watek ? `Patokan: ${gagalangPoe.month_patokan.watek}` : null}
            meaning="Watek yang dikaitkan sumber dengan pasangan hari patokan bulan."
          />
          <SummaryCard
            label="Pernaasan"
            value={pernaasan?.is_today ? 'PERNAASAN' : 'Bukan pernaasan'}
            sub={pernaasan?.dates?.length ? `Tanggal: ${pernaasan.dates.join(' · ')}` : null}
            meaning="Menunjukkan apakah tanggal ini termasuk tanggal yang ditandai Pernaasan pada bulan tersebut."
          />
          <SummaryCard
            label="Jaya · Apes"
            value={jayaApes ? `${jayaApes.jaya} · ${jayaApes.apes}` : null}
            sub={jayaApes?.status === 'CAKRA_LANGIT_RECONSTRUCTED' ? 'Rekonstruksi Cakra Langit' : jayaApes?.status}
            meaning="Posisi siklus Jaya dan Apes. Hasil ini diberi label rekonstruksi, bukan klaim formula manuskrip tunggal."
          />
        </div>

        <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Navigasi Hari Ini</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Pantangan" value={navigation?.pantangan_hari?.join(' · ') || '—'} meaning="Hari yang ditandai sebagai hari pantangan dalam kelompok bulan ini." />
            <SummaryCard label="Keselamatan" value={navigation?.hari_keselamatan?.join(' · ') || '—'} meaning="Hari yang ditandai sebagai hari selamet dalam kelompok bulan ini." />
            <SummaryCard label="Arah Rizki" value={navigation?.arah_rizki} sub={navigation?.month_group ? `Kelompok bulan ${navigation.month_group}` : null} meaning="Arah yang ditunjukkan rule kelompok bulan; bukan jaminan hasil atau keputusan otomatis." />
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-[#71869A]">
          Peta ini menjawab “hari ini posisinya bagaimana?” sebelum Anda memilih perhitungan berikutnya. Nilai di atas adalah pembacaan rule Palintangan; pengguna tetap menentukan tindakan dan keputusan.
        </p>
      </section>

      <section className="mt-6">
        <div className="mb-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Navigasi Palintangan</div>
          <h2 className="mt-1 text-base font-semibold text-white">Apa yang ingin Anda hitung?</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card icon={UserRound} title="Kelahiran" description="Untuk membaca karakter dan konteks seseorang dari tanggal kelahiran: hari, pasaran, naktu, watek, dan hasil terkait." href="/dashboard/palintangan?view=kelahiran" />
          <Card icon={Moon} title="Hitung Nama" description="Untuk menghitung naktu dari nama dan membaca hasil Pancaka yang mapping sumbernya sudah tersedia." href="/dashboard/palintangan?view=nama" />
          <Card icon={HeartHandshake} title="Repok / Jodoh" description="Untuk membandingkan dua profil personal ketika rule perbandingan yang relevan digunakan." href="/dashboard/palintangan?view=jodoh" />
          <Card icon={Leaf} title="Tanam / Panen" description="Untuk membaca tanggal dan rule yang berkaitan dengan waktu menanam, memanen, dan hasil." href="/dashboard/palintangan?view=tanam-panen" />
          <Card icon={Route} title="Perjalanan / Arah" description="Untuk membaca arah Gagalang serta hari pantangan dan keselamatan sebelum melakukan perjalanan." href="/dashboard/palintangan?view=perjalanan" />
          <Card icon={Compass} title="Waktu / Jam" description="Untuk membaca perhitungan yang memakai waktu atau jam ketika rule sumbernya tersedia." href="/dashboard/palintangan?view=waktu" />
        </div>
      </section>
    </section>
  
  )
}
