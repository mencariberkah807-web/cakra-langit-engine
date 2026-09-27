import { useEffect, useMemo, useState } from 'react'
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

function parseDateInput(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
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

const WATEK_MEANINGS = {
  'Wani': {
    tone: 'BAIK',
    meaning: 'Baik — dalam setiap pekerjaan akan berhasil dengan baik.',
  },
  'Karang Piwulang': {
    tone: 'JELEK',
    meaning: 'Jelek — diri berada di bawah pamor orang lain.',
  },
  'Sumur Pinungkeb': {
    tone: 'JELEK',
    meaning: 'Jelek — sesak napas, dalam arti akan mendapat susah.',
  },
  'Karang Tinangtang': {
    tone: 'BAIK',
    meaning: 'Baik — akan kuat.',
  },
  'Macan Katawang': {
    tone: 'NETRAL',
    meaning: 'Dilihat orang banyak.',
  },
  'Nuju Pati': {
    tone: 'JELEK',
    meaning: 'Jelek — mendapat kenaasan atau apes.',
  },
  'Nuju Padu': {
    tone: 'JELEK',
    meaning: 'Jelek — karena akan menyebabkan pertengkaran.',
  },
  'Mantri Sinareja': {
    tone: 'JELEK',
    meaning: 'Jelek — akan menyebabkan sakit.',
  },
  'Demang Kanduruan': {
    tone: 'BAIK',
    meaning: 'Baik — akan disenangi orang.',
  },
  'Putri Tinuting': {
    tone: 'BAIK',
    meaning: 'Banyak yang memberi.',
  },
  'Demang Palasah': {
    tone: 'JELEK',
    meaning: 'Tidak mendapat pekerjaan.',
  },
  'Alas Kobar': {
    tone: 'JELEK',
    meaning: 'Menyebabkan kebakaran.',
  },
}

function getWatekMeaning(name) {
  return WATEK_MEANINGS[name] || {
    tone: 'INFO',
    meaning: 'Makna belum tersedia pada data yang sudah diverifikasi.',
  }
}

function toneClass(tone) {
  if (tone === 'BAIK') return 'border-emerald-400/20 bg-emerald-950/20 text-emerald-300'
  if (tone === 'JELEK') return 'border-red-400/20 bg-red-950/20 text-red-300'
  return 'border-cyan-300/15 bg-cyan-950/10 text-cyan-200'
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

function SummaryCard({ label, value, sub, meaning, detail }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value || '—'}</div>
      {sub && <div className="mt-1 text-[11px] text-[#71869A]">{sub}</div>}
      {meaning && <div className="mt-3 text-xs leading-5 text-[#A9BDCF]">{meaning}</div>}
      {detail && <div className="mt-2 text-[11px] leading-4 text-[#71869A]">{detail}</div>}
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
    kelahiran: ['Kelahiran', 'Baca konteks kelahiran, naktu, watek, Gagalang, Pernaasan, dan Jaya / Apes.'],
    nama: ['Hitung Nama', 'Masuk ke perhitungan naktu nama dan Pancaka yang mapping-nya sudah terverifikasi.'],
    jodoh: ['Repok / Jodoh', 'Ruang untuk membandingkan dua konteks personal.'],
    'tanam-panen': ['Tanam / Panen', 'Gunakan tanggal dan rule Palintangan yang berkaitan dengan tanam dan panen.'],
    perjalanan: ['Perjalanan / Arah', 'Baca Gagalang, arah, pantangan, dan keselamatan untuk konteks perjalanan.'],
    waktu: ['Waktu / Jam', 'Masuk ke perhitungan berbasis waktu dan jam ketika rule sumber sudah tersedia.'],
  }
  const [title, description] = titles[view] || titles.kelahiran
  const watekMeaning = getWatekMeaning(watek?.watek)

  const detail = {
    kelahiran: [
      ['Hari / Pasaran', calendar ? `${calendar.hari} · ${calendar.pasaran}` : '—', 'Identitas kalender pada tanggal yang diperiksa.'],
      ['Naktu Wedal', naktu?.wedal, 'Jumlah naktu hari + naktu pasaran.'],
      ['Watek Patokan', watek?.watek, watekMeaning.meaning],
      ['Jaya / Apes', jayaApes ? `${jayaApes.jaya} / ${jayaApes.apes}` : '—', 'Posisi siklus rekonstruksi Cakra Langit.'],
    ],
    nama: [
      ['Naktu Nama', 'Siap dihitung', 'Gunakan konteks nama pada modul Hitung Nama.'],
      ['Pancaka 4 / 5', 'Tersedia', 'Mapping terverifikasi sesuai konteks sumber.'],
      ['Pancaka 7 / 8 / 12', 'Tersedia', 'Mapping terverifikasi sesuai konteks sumber.'],
    ],
    jodoh: [
      ['Profil pertama', displayName, 'Profil aktif yang sedang dibaca.'],
      ['Profil kedua', 'Belum dipilih', 'Masukkan konteks orang kedua untuk perbandingan.'],
      ['Status', 'Siap untuk perbandingan', 'Rule detail perbandingan akan mengikuti data sumber yang tersedia.'],
    ],
    'tanam-panen': [
      ['Tanggal', selectedDate ? formatDate(selectedDate) : '—', 'Tanggal yang sedang diperiksa.'],
      ['Pernaasan', pernaasan?.is_today ? 'PERNAASAN' : 'Bukan pernaasan', pernaasan?.dates?.join(' · ') || 'Tanggal Pernaasan bulan ini.'],
      ['Status hari', navigation?.status_hari, navigation?.interpretation],
    ],
    perjalanan: [
      ['Arah Rizki', navigation?.arah_rizki, 'Arah yang ditunjukkan rule kelompok bulan.'],
      ['Gagalang', gagalang?.direction, gagalang?.next_pasaran ? `Pasaran berikutnya: ${gagalang.next_pasaran}` : null],
      ['Keselamatan', navigation?.hari_keselamatan?.join(' · ') || '—', 'Hari yang ditandai sebagai hari keselamatan.'],
      ['Pantangan', navigation?.pantangan_hari?.join(' · ') || '—', 'Hari yang ditandai sebagai hari pantangan.'],
    ],
    waktu: [
      ['Naktu Wedal', naktu?.wedal, naktu?.formula || 'Jumlah naktu hari + pasaran.'],
      ['Hari', calendar?.hari, 'Konteks hari aktif.'],
      ['Pasaran', calendar?.pasaran, 'Konteks pasaran aktif.'],
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
          Gunakan menu Palintangan untuk berpindah ke jenis perhitungan lain. Formula yang belum terverifikasi tidak diisi dengan inferensi.
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
  const [inspectionDate, setInspectionDate] = useState(selectedDate || new Date())
  const [profileLabel, setProfileLabel] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const view = new URLSearchParams(window.location.search).get('view')
  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Pengguna'
  const activeProfileName = profileLabel.trim() || displayName
  const locationName = location?.name || apiData?.location?.name || 'Lokasi aktif'
  const isoDate = toDateISO(inspectionDate)

  useEffect(() => {
    if (selectedDate) setInspectionDate(selectedDate)
  }, [selectedDate])

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
  const watekMeaning = getWatekMeaning(watekPatokan?.watek)

  const watekDetails = useMemo(
    () => (gagalangPoe?.watek || []).map((name) => ({ name, ...getWatekMeaning(name) })),
    [gagalangPoe?.watek]
  )

  if (view) {
    return (
      <DetailView
        view={view}
        data={data}
        selectedDate={inspectionDate}
        displayName={activeProfileName}
        locationName={locationName}
      />
    )
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Sunda</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Palintangan Sunda</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">
          Peta hari pribadi berdasarkan profil dan tanggal yang diperiksa. Hasil dijelaskan dengan bahasa yang mudah dibaca sebelum Anda memilih perhitungan lain.
        </p>
      </header>

      <section className="rounded-2xl border border-cyan-300/10 bg-[#0A1723] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Profil & konteks aktif</div>
            <h2 className="mt-2 text-xl font-semibold text-white">{activeProfileName}</h2>
            <p className="mt-1 text-xs text-[#71869A]">{locationName} · {formatDate(inspectionDate)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Nama / profil yang diperiksa</span>
              <input
                value={profileLabel}
                onChange={(event) => setProfileLabel(event.target.value)}
                placeholder={displayName}
                className="w-full rounded-xl border border-white/[0.08] bg-[#07111C] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-[#536A7D] focus:border-cyan-300/30"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Tanggal yang diperiksa</span>
              <input
                type="date"
                value={isoDate}
                onChange={(event) => {
                  const next = parseDateInput(event.target.value)
                  if (next) setInspectionDate(next)
                }}
                className="w-full rounded-xl border border-white/[0.08] bg-[#07111C] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-300/30"
              />
            </label>
          </div>
        </div>
        {loading && <div className="mt-4 text-xs text-[#71869A]">Memuat peta Palintangan…</div>}
        {error && <div className="mt-4 rounded-xl border border-red-400/10 bg-red-950/20 px-4 py-3 text-xs text-red-200">{error}</div>}
      </section>

      <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22D3EE]">Peta Hari Ini</div>
        <div className="mt-1 text-base font-semibold text-white">Bagaimana posisi tanggal ini menurut Palintangan?</div>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-[#71869A]">
          Ini adalah ringkasan yang dibaca pengguna terlebih dahulu. Nama simbol selalu disertai arti dari sumber agar hasil tidak berhenti sebagai istilah tradisional saja.
        </p>

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
            meaning="Menentukan bulan dan kelompok aturan Palintangan yang berlaku."
          />
          <SummaryCard
            label="Watek Patokan"
            value={watekPatokan?.watek}
            sub={watekPatokan?.month ? `Bulan ${watekPatokan.month}` : null}
            meaning={watekMeaning.meaning}
            detail={`Status: ${watekMeaning.tone}`}
          />
          <SummaryCard
            label="Status Hari"
            value={navigation?.status_hari}
            sub={navigation?.interpretation}
            meaning="Ringkasan rule bulan: apakah tanggal termasuk pantangan, keselamatan, atau kondisi normal."
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Gagalang Pasaran"
            value={gagalang?.direction}
            sub={gagalang?.next_pasaran ? `Berikutnya: ${gagalang.next_pasaran}` : null}
            meaning="Arah yang ditunjukkan oleh pasangan pasaran dalam rule Gagalang."
          />
          <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Gagalang Poe</div>
            <div className="mt-2 space-y-2">
              {watekDetails.length ? watekDetails.map((item) => (
                <div key={item.name}>
                  <div className="text-lg font-semibold text-white">{item.name}</div>
                  <div className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${toneClass(item.tone)}`}>{item.tone}</div>
                  <div className="mt-2 text-xs leading-5 text-[#A9BDCF]">{item.meaning}</div>
                </div>
              )) : <div className="text-lg font-semibold text-white">—</div>}
            </div>
            {gagalangPoe?.month_patokan?.watek && (
              <div className="mt-3 border-t border-white/[0.06] pt-3 text-[11px] leading-4 text-[#71869A]">
                Patokan bulan: <span className="text-[#A9BDCF]">{gagalangPoe.month_patokan.watek}</span>
              </div>
            )}
          </div>
          <SummaryCard
            label="Pernaasan"
            value={pernaasan?.is_today ? 'PERNAASAN' : 'Bukan pernaasan'}
            sub={pernaasan?.dates?.length ? `Tanggal: ${pernaasan.dates.join(' · ')}` : null}
            meaning={pernaasan?.is_today
              ? 'Tanggal ini termasuk tanggal Pernaasan yang ditandai sumber.'
              : 'Tanggal ini tidak termasuk tanggal Pernaasan yang tercatat untuk bulan tersebut.'}
          />
          <SummaryCard
            label="Jaya · Apes"
            value={jayaApes ? `${jayaApes.jaya} · ${jayaApes.apes}` : null}
            sub={jayaApes?.status === 'CAKRA_LANGIT_RECONSTRUCTED' ? 'Rekonstruksi Cakra Langit' : jayaApes?.status}
            meaning="Menunjukkan posisi dua titik dalam siklus Jaya / Apes. Status rekonstruksi ditampilkan agar sumbernya tidak disalahartikan."
          />
        </div>

        <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">Navigasi Hari Ini</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Pantangan"
              value={navigation?.pantangan_hari?.join(' · ') || '—'}
              meaning="Hari yang ditandai sebagai hari pantangan dalam kelompok bulan ini."
            />
            <SummaryCard
              label="Keselamatan"
              value={navigation?.hari_keselamatan?.join(' · ') || '—'}
              meaning="Hari yang ditandai sebagai hari keselamatan dalam kelompok bulan ini."
            />
            <SummaryCard
              label="Arah Rizki"
              value={navigation?.arah_rizki}
              sub={navigation?.month_group ? `Kelompok bulan ${navigation.month_group}` : null}
              meaning="Arah yang ditunjukkan oleh rule kelompok bulan. Ini adalah informasi tradisional, bukan jaminan hasil."
            />
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Navigasi Palintangan</div>
          <h2 className="mt-1 text-base font-semibold text-white">Apa yang ingin Anda hitung?</h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-[#71869A]">
            Setelah melihat peta tanggal, pilih tujuan perhitungan. Tanggal dan nama profil di atas dapat diganti untuk membaca pasangan, anak, teman, atau anggota keluarga.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card icon={UserRound} title="Kelahiran" description="Baca konteks kelahiran: hari, pasaran, naktu, watek, Gagalang, Pernaasan, dan Jaya / Apes." href="/dashboard/palintangan?view=kelahiran" />
          <Card icon={Moon} title="Hitung Nama" description="Hitung naktu nama dan gunakan Pancaka yang mapping sumbernya sudah terverifikasi." href="/dashboard/palintangan?view=nama" />
          <Card icon={HeartHandshake} title="Repok / Jodoh" description="Bandingkan dua profil personal ketika rule perbandingan yang relevan tersedia." href="/dashboard/palintangan?view=jodoh" />
          <Card icon={Leaf} title="Tanam / Panen" description="Periksa tanggal dan rule Palintangan yang berkaitan dengan tanam, panen, dan hasil." href="/dashboard/palintangan?view=tanam-panen" />
          <Card icon={Route} title="Perjalanan / Arah" description="Baca Gagalang, arah, pantangan, dan keselamatan untuk konteks perjalanan." href="/dashboard/palintangan?view=perjalanan" />
          <Card icon={Compass} title="Waktu / Jam" description="Masuk ke perhitungan berbasis waktu dan jam ketika rule sumber sudah tersedia." href="/dashboard/palintangan?view=waktu" />
        </div>
      </section>
    </section>
  )
}
