import { useEffect, useMemo, useState } from 'react'
import { useTodayContext } from '../core/TodayContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

const PANCASUDA = {
  1: { name: 'Sri', meaning: 'Rezeki / kelimpahan' },
  2: { name: 'Lungguh', meaning: 'Derajat / kedudukan' },
  3: { name: 'Gedhong', meaning: 'Harta / kekayaan' },
  4: { name: 'Lara', meaning: 'Kesulitan / sakit' },
  5: { name: 'Pati', meaning: 'Kehilangan / akhir' },
}

const PANGARASAN = {
  7: { name: 'Lakuning Bumi', meaning: 'Pemurah, pengampun, dan pelindung' },
  8: { name: 'Lakuning Geni', meaning: 'Berwatak seperti api' },
  9: { name: 'Lakuning Angin', meaning: 'Berwatak seperti angin' },
  10: { name: 'Aras Pepet', meaning: 'Tertutup dan cenderung prihatin' },
  11: { name: 'Aras Tuding', meaning: 'Sering menjadi orang yang ditunjuk' },
  12: { name: 'Aras Kembang', meaning: 'Memiliki pesona yang memikat' },
  13: { name: 'Lakuning Lintang', meaning: 'Berwatak seperti bintang' },
  14: { name: 'Lakuning Rembulan', meaning: 'Simpatik dan penuh daya tarik' },
  15: { name: 'Lakuning Srengenge', meaning: 'Terang dan berwibawa' },
  16: { name: 'Lakuning Banyu', meaning: 'Tenang dan mengalir seperti air' },
  17: { name: 'Lakuning Bumi', meaning: 'Pemurah, pengampun, dan pelindung' },
  18: { name: 'Lakuning Geni', meaning: 'Berwatak seperti api' },
}

const RAKAM_DINO_KUPIH = { Jemuwah: 1, Setu: 2, Ngahad: 3, Senen: 4, Selasa: 5, Rebo: 6, Kemis: 7 }
const RAKAM_PASARAN_KUPIH = { Kliwon: 1, Legi: 2, Pahing: 3, Pon: 4, Wage: 5 }
const RAKAM = {
  0: 'Pati',
  1: 'Kala Tinantang',
  2: 'Demang Kandhuruwan',
  3: 'Sanggar Waringin',
  4: 'Mantri Sinaroja',
  5: 'Macan Ketawan',
}

const FUTURE_SECTIONS = [
  ['Watak', 'Watak Weton dan karakter turunan.', 'Sumber tafsir belum terhubung'],
  ['Pranata Mangsa', 'Mangsa dan pembacaan konteks musim.', 'Sumber mangsa belum terhubung'],
  ['Kesehatan', 'Pembacaan kesehatan berdasarkan sumber yang tervalidasi.', 'Sumber tafsir belum terhubung'],
  ['Rezeki', 'Pembacaan rezeki dan kecenderungan finansial.', 'Sumber tafsir belum terhubung'],
  ['Asmara', 'Pembacaan hubungan dan karakter relasi.', 'Sumber tafsir belum terhubung'],
  ['Analisis Kitab', 'Dina Ala, Kala Tinantang, Tibo Loro, dan metode kitab lain.', 'Sumber metode belum terhubung'],
]

function Section({ eyebrow, title, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A1723] shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
      <div className="border-b border-white/[0.07] px-5 py-4 sm:px-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6F8CA3]">{eyebrow}</div>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function Metric({ label, value, accent = 'text-[#A9BDCF]' }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536A7D]">{label}</div>
      <div className={`mt-2 text-base font-semibold ${accent}`}>{value ?? '—'}</div>
    </div>
  )
}

function getField(jawa, key) {
  return jawa?.fields?.find((field) => field.k === key)?.v
}

function formatBirthDate(value) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export default function WetonFullReadingPage() {
  const { apiData, setSelectedDate, setSelectedTime, setLocationById } = useTodayContext()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null
    let cancelled = false
    async function loadProfile() {
      try {
        const response = await fetch(`${API_BASE}/api/profile`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!response.ok) return
        const payload = await response.json()
        if (cancelled) return
        const nextProfile = payload?.profile || null
        setProfile(nextProfile)
        if (nextProfile?.birth_date) {
          const nextTime = nextProfile.birth_time_unknown ? '12:00' : (nextProfile.birth_time?.slice(0, 5) || '12:00')
          setSelectedDate(new Date(`${nextProfile.birth_date}T12:00:00`))
          setSelectedTime(nextTime)
          if (nextProfile.birth_location_id) setLocationById(nextProfile.birth_location_id)
        }
      } catch {
        // Preserve existing TodayContext when profile hydration is unavailable.
      }
    }
    loadProfile()
    return () => { cancelled = true }
  }, [setSelectedDate, setSelectedTime, setLocationById])

  const jawa = useMemo(() => apiData?.calendars?.find((calendar) => calendar.id === 'jawa') || null, [apiData])
  const detail = jawa?.detail || {}
  const dino = detail.dino || {}
  const pasaran = detail.pasaran || {}
  const wuku = detail.wuku || {}
  const total = Number(detail.neptu_total)
  const pancasuda = Number.isFinite(total) && total > 0 ? { remainder: total % 5 || 5, ...PANCASUDA[total % 5 || 5] } : null
  const pangarasan = Number.isInteger(total) ? PANGARASAN[total] : null
  const rakam = useMemo(() => {
    const dinoKupih = RAKAM_DINO_KUPIH[dino.name]
    const pasaranKupih = RAKAM_PASARAN_KUPIH[pasaran.name]
    if (dinoKupih == null || pasaranKupih == null) return null
    const remainder = (dinoKupih + pasaranKupih) % 6
    return { dinoKupih, pasaranKupih, remainder, name: RAKAM[remainder] }
  }, [dino.name, pasaran.name])

  const profileName = profile?.display_name || 'Profil Saya'
  const birthLocation = profile?.birth_location
  const birthLocationLabel = birthLocation
    ? [birthLocation.city, birthLocation.province, birthLocation.country].filter(Boolean).join(', ')
    : '—'
  const birthTimeLabel = profile?.birth_time_unknown
    ? 'Waktu tidak diketahui'
    : (profile?.birth_time?.slice(0, 5) || '—')
  const formula = dino.neptu != null && pasaran.neptu != null && detail.neptu_total != null
    ? `${dino.name} ${dino.neptu} + ${pasaran.name} ${pasaran.neptu} = ${detail.neptu_total}`
    : null

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6F8CA3]">Cakra Langit · Jawa</div>
        <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Weton Jawa</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA4B8]">Panduan Weton berdasarkan konteks kelahiran yang tersimpan di profil Anda.</p>
            <div className="mt-3 text-xs font-medium text-[#71869A]">Profil: <span className="text-[#A9BDCF]">{profileName}</span></div>
          </div>
          <div className="w-full rounded-2xl border border-white/[0.07] bg-[#07111C] p-4 lg:max-w-[520px]">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Profil Kelahiran</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-[9px] uppercase tracking-[0.12em] text-[#536A7D]">Tanggal</div>
                <div className="mt-1 text-sm font-semibold text-white">{formatBirthDate(profile?.birth_date)}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.12em] text-[#536A7D]">Waktu</div>
                <div className="mt-1 text-sm font-semibold text-white">{birthTimeLabel}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.12em] text-[#536A7D]">Lokasi</div>
                <div className="mt-1 text-sm font-semibold text-white">{birthLocationLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <Section eyebrow="01 · Core" title="Weton Utama">
            {jawa ? (
              <div className="grid gap-3 lg:grid-cols-[1fr_2fr] lg:items-stretch">
                <div className="rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_top_right,rgba(93,135,164,0.10),transparent_42%),#07111C] p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#536A7D]">Weton</div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{jawa.sub || `${dino.name || '—'} ${pasaran.name || ''}`}</div>
                  <div className="mt-3 h-px bg-white/[0.06]" />
                  <div className="mt-3 text-xs leading-5 text-[#71869A]">Dina dan Pasaran menjadi dasar pembacaan Weton Jawa.</div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Metric label="Dina" value={dino.name} />
                  <Metric label="Pasaran" value={pasaran.name} />
                  <Metric label="Neptu Dina" value={dino.neptu} />
                  <Metric label="Neptu Pasaran" value={pasaran.neptu} />
                  <div className="rounded-xl border border-white/[0.07] bg-[#07111C] px-4 py-3 sm:col-span-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536A7D]">Total Neptu</div>
                    <div className="mt-1 text-xl font-semibold text-[#C7D4DF]">{detail.neptu_total ?? '—'}</div>
                    {formula && <div className="mt-1 font-mono text-[11px] text-[#71869A]">{formula}</div>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-6 text-sm text-[#8FA4B8]">Data Weton belum tersedia untuk konteks profil ini.</div>
            )}
          </Section>

          <Section eyebrow="02 · Calendar" title="Konteks Kalender Jawa">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                ['Tanggal Jawa', detail.jawa_date],
                ['Tahun Jawa', detail.tahun],
                ['Wuku', wuku.name],
                ['Hari Wuku', wuku.day_in_wuku],
                ['Pawukon Day', wuku.pawukon_day],
                ['Windu', detail.windu],
                ['Lambang', getField(jawa, 'Lambang')],
                ['Kurup', getField(jawa, 'Kurup')],
              ].map(([label, value]) => <Metric key={label} label={label} value={value} />)}
            </div>
            {jawa?.effectiveDate && <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3 text-xs text-[#71869A]">Tanggal efektif: <span className="font-semibold text-[#A9BDCF]">{jawa.effectiveDate}</span> · Boundary: <span className="font-semibold text-[#A9BDCF]">{jawa.boundary || 'SUNSET'}</span></div>}
            {jawa?.meta?.sunsetApplied && <div className="mt-2 rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3 text-[11px] leading-5 text-[#A9BDCF]">Boundary sunset diterapkan oleh engine kalender existing.</div>}
          </Section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section eyebrow="03 · Symbol" title="Lambang">
            <div className="rounded-2xl border border-white/[0.07] bg-[#07111C] p-6 text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536A7D]">Lambang Weton</div>
              <div className="mt-3 text-2xl font-semibold text-[#C7D4DF]">{getField(jawa, 'Lambang') || '—'}</div>
              <p className="mt-2 text-xs leading-5 text-[#71869A]">Nilai lambang ditampilkan dari data kalender Jawa existing. Tafsir naratif tidak ditambahkan tanpa sumber tervalidasi.</p>
            </div>
          </Section>

          <Section eyebrow="04 · Petungan" title="Analisis Petungan">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Pancasuda</div><div className="mt-2 text-lg font-semibold text-[#C7D4DF]">{pancasuda?.name || '—'}</div><p className="mt-1 text-xs leading-5 text-[#8FA4B8]">{pancasuda?.meaning || 'Menunggu data Neptu.'}</p><div className="mt-2 font-mono text-[10px] text-[#536A7D]">{pancasuda ? `${detail.neptu_total} mod 5 = ${pancasuda.remainder}` : '—'}</div></div>
              <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Pangarasan</div><div className="mt-2 text-lg font-semibold text-[#C7D4DF]">{pangarasan?.name || '—'}</div><p className="mt-1 text-xs leading-5 text-[#8FA4B8]">{pangarasan?.meaning || 'Menunggu data Neptu.'}</p><div className="mt-2 font-mono text-[10px] text-[#536A7D]">{pangarasan ? `Neptu ${total} → ${pangarasan.name}` : '—'}</div></div>
              <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Rakam</div><div className="mt-2 text-lg font-semibold text-[#C7D4DF]">{rakam?.name || '—'}</div><p className="mt-1 text-xs leading-5 text-[#8FA4B8]">Klasifikasi berdasarkan kupih Dina + Pasaran.</p><div className="mt-2 font-mono text-[10px] text-[#536A7D]">{rakam ? `${rakam.dinoKupih} + ${rakam.pasaranKupih} → sisa ${rakam.remainder}` : '—'}</div></div>
            </div>
          </Section>
        </div>

        <Section eyebrow="05 · Reading Layers" title="Pembacaan Lanjutan">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FUTURE_SECTIONS.map(([title, description, status]) => (
              <div key={title} className="rounded-xl border border-white/[0.06] bg-[#07111C] p-5">
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-white">{title}</h3><span className="rounded-full border border-white/[0.06] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">{status}</span></div>
                <p className="mt-2 text-xs leading-5 text-[#71869A]">{description}</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="rounded-2xl border border-white/[0.07] bg-[#07111C] px-5 py-4 text-xs leading-5 text-[#71869A]">
          Struktur ini memisahkan <span className="font-semibold text-[#A9BDCF]">hasil kalender</span>, <span className="font-semibold text-[#A9BDCF]">petungan</span>, dan <span className="font-semibold text-[#A9BDCF]">tafsir</span>. Layer tafsir hanya akan diisi setelah sumber/metode masing-masing tervalidasi; engine Jawa existing tetap menjadi sumber perhitungan.
        </div>
      </div>
    </section>
  )
}
