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

const READING_LAYERS = [
  ['Pranata Mangsa', 'Mangsa dan pembacaan konteks musim.', 'Sumber belum terhubung'],
  ['Kesehatan', 'Pembacaan kesehatan dari sumber yang tervalidasi.', 'Sumber belum terhubung'],
  ['Rezeki', 'Pembacaan rezeki dan kecenderungan finansial.', 'Sumber belum terhubung'],
  ['Asmara', 'Pembacaan hubungan dan karakter relasi.', 'Sumber belum terhubung'],
  ['Analisis Kitab', 'Dina Ala, Kala Tinantang, Tibo Loro, dan metode kitab lain.', 'Sumber belum terhubung'],
]

function Section({ eyebrow, title, children, accent = 'cyan' }) {
  const accents = {
    cyan: { border: 'border-[#214A60]', glow: 'shadow-[0_16px_50px_rgba(34,211,238,0.05)]', label: 'text-[#67B9D6]' },
    blue: { border: 'border-[#2A4564]', glow: 'shadow-[0_16px_50px_rgba(96,165,250,0.05)]', label: 'text-[#86A9D5]' },
    gold: { border: 'border-[#5A4A24]', glow: 'shadow-[0_16px_50px_rgba(251,191,36,0.04)]', label: 'text-[#D4B75E]' },
  }
  const tone = accents[accent] || accents.cyan
  return (
    <section className={`overflow-hidden rounded-[18px] border bg-[linear-gradient(135deg,rgba(13,31,44,0.98),rgba(6,17,27,0.98)_72%)] ${tone.border} ${tone.glow}`}>
      <div className="border-b border-[#1B3447] bg-[linear-gradient(90deg,rgba(17,42,58,0.42),rgba(7,18,29,0.08))] px-5 py-4 sm:px-6">
        <div className={`text-[9px] font-bold uppercase tracking-[0.2em] ${tone.label}`}>{eyebrow}</div>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#D8F3FF]">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function Metric({ label, value, accent = 'text-[#A9BDCF]' }) {
  return (
    <div className="rounded-xl border border-[#173044] bg-[linear-gradient(135deg,rgba(10,27,40,0.98),rgba(5,15,24,0.98))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
      <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5E7A8F]">{label}</div>
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

function WorkspaceCard({ title, eyebrow, description, children, accent = 'blue' }) {
  return (
    <div className="rounded-2xl border border-[#21425A] bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.07),transparent_48%),linear-gradient(135deg,rgba(10,28,42,0.98),rgba(5,15,24,0.98))] p-5">
      <div className={`text-[9px] font-bold uppercase tracking-[0.18em] ${accent === 'gold' ? 'text-[#D4B75E]' : 'text-[#78A9C7]'}`}>{eyebrow}</div>
      <h3 className="mt-2 text-base font-semibold text-[#D8F3FF]">{title}</h3>
      {description ? <p className="mt-2 text-xs leading-5 text-[#7896A8]">{description}</p> : null}
      <div className="mt-4 border-t border-[#18374A] pt-4">{children}</div>
    </div>
  )
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
  const watak = detail.watak || {}
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
  const birthLocationLabel = birthLocation ? [birthLocation.city, birthLocation.province, birthLocation.country].filter(Boolean).join(', ') : '—'
  const birthTimeLabel = profile?.birth_time_unknown ? 'Waktu tidak diketahui' : (profile?.birth_time?.slice(0, 5) || '—')
  const formula = dino.neptu != null && pasaran.neptu != null && detail.neptu_total != null ? `${dino.name} ${dino.neptu} + ${pasaran.name} ${pasaran.neptu} = ${detail.neptu_total}` : null

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
      <header className="mb-7">
        <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#527D95]">Cakra Langit · Jawa</div>
        <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#D8F3FF] sm:text-4xl">Weton Jawa</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FAEC1]">Panduan Weton berdasarkan konteks kelahiran yang tersimpan di profil Anda.</p>
            <div className="mt-3 text-xs font-medium text-[#668397]">Profil: <span className="text-[#B9D2E2]">{profileName}</span></div>
          </div>
          <div className="w-full rounded-[18px] border border-[#1E3A4E] bg-[linear-gradient(135deg,rgba(12,31,45,0.98),rgba(5,16,25,0.98))] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.14)] lg:max-w-[560px]">
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#5E8195]">Profil Kelahiran</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div><div className="text-[9px] uppercase tracking-[0.12em] text-[#527184]">Tanggal</div><div className="mt-1 text-sm font-semibold text-[#EDF9FF]">{formatBirthDate(profile?.birth_date)}</div></div>
              <div><div className="text-[9px] uppercase tracking-[0.12em] text-[#527184]">Waktu</div><div className="mt-1 text-sm font-semibold text-[#EDF9FF]">{birthTimeLabel}</div></div>
              <div><div className="text-[9px] uppercase tracking-[0.12em] text-[#527184]">Lokasi</div><div className="mt-1 text-sm font-semibold text-[#EDF9FF]">{birthLocationLabel}</div></div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <Section eyebrow="01 · Core" title="Weton Utama" accent="cyan">
            {jawa ? (
              <div className="grid gap-3 lg:grid-cols-[1fr_2fr]">
                <div className="rounded-2xl border border-[#28546A] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_45%),linear-gradient(135deg,rgba(8,29,43,0.98),rgba(4,15,24,0.98))] p-5">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5FA6BE]">Weton</div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight text-[#EDF9FF]">{jawa.sub || `${dino.name || '—'} ${pasaran.name || ''}`}</div>
                  <div className="mt-3 h-px bg-[#23485C]" />
                  <div className="mt-3 text-xs leading-5 text-[#7896A8]">Dina dan Pasaran menjadi dasar pembacaan Weton Jawa.</div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Metric label="Dina" value={dino.name} />
                  <Metric label="Pasaran" value={pasaran.name} />
                  <Metric label="Neptu Dina" value={dino.neptu} />
                  <Metric label="Neptu Pasaran" value={pasaran.neptu} />
                  <div className="rounded-xl border border-[#28546A] bg-[linear-gradient(135deg,rgba(12,38,53,0.98),rgba(5,16,25,0.98))] px-4 py-3 sm:col-span-2">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5E8195]">Total Neptu</div>
                    <div className="mt-1 text-xl font-semibold text-[#D8F3FF]">{detail.neptu_total ?? '—'}</div>
                    {formula && <div className="mt-1 font-mono text-[11px] text-[#7896A8]">{formula}</div>}
                  </div>
                </div>
              </div>
            ) : <div className="rounded-xl border border-[#173044] bg-[#06131F] p-6 text-sm text-[#8FAEC1]">Data Weton belum tersedia untuk konteks profil ini.</div>}
          </Section>

          <Section eyebrow="02 · Calendar" title="Konteks Kalender Jawa" accent="blue">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                ['Tanggal Jawa', detail.jawa_date], ['Tahun Jawa', detail.tahun], ['Wuku', wuku.name],
                ['Hari Wuku', wuku.day_in_wuku], ['Pawukon Day', wuku.pawukon_day], ['Windu', detail.windu],
                ['Lambang', getField(jawa, 'Lambang')], ['Kurup', getField(jawa, 'Kurup')],
              ].map(([label, value]) => <Metric key={label} label={label} value={value} />)}
            </div>
            {jawa?.effectiveDate && <div className="mt-3 rounded-xl border border-[#24415A] bg-[#071925] p-4 text-xs leading-5 text-[#7896A8]">Tanggal efektif: <span className="font-semibold text-[#B9D2E2]">{jawa.effectiveDate}</span> · Batas hari: <span className="font-semibold text-[#B9D2E2]">{jawa.boundary || 'SUNSET'}</span></div>}
          </Section>
        </div>

        <Section eyebrow="03 · Symbol" title="Lambang & Petungan" accent="gold">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <WorkspaceCard title="Pancasuda" eyebrow="Petungan · Neptu">
              <div className="text-2xl font-semibold text-[#E6D58B]">{pancasuda?.name || '—'}</div>
              <div className="mt-1 text-xs text-[#A99362]">Sisa {pancasuda?.remainder ?? '—'} · {pancasuda?.meaning || 'Belum tersedia'}</div>
              <div className="mt-3 font-mono text-[10px] text-[#6F6247]">{pancasuda ? `${total} ÷ 5 → sisa ${pancasuda.remainder}` : '—'}</div>
            </WorkspaceCard>
            <WorkspaceCard title="Pangarasan" eyebrow="Petungan · Neptu">
              <div className="text-2xl font-semibold text-[#E6D58B]">{pangarasan?.name || '—'}</div>
              <div className="mt-1 text-xs text-[#A99362]">{pangarasan?.meaning || 'Belum tersedia'}</div>
              <div className="mt-3 font-mono text-[10px] text-[#6F6247]">Neptu {Number.isInteger(total) ? total : '—'}</div>
            </WorkspaceCard>
            <WorkspaceCard title="Rakam" eyebrow="Petungan · Kupih">
              <div className="text-2xl font-semibold text-[#E6D58B]">{rakam?.name || '—'}</div>
              <div className="mt-1 text-xs text-[#A99362]">Sisa {rakam?.remainder ?? '—'}</div>
              <div className="mt-3 font-mono text-[10px] text-[#6F6247]">{rakam ? `${rakam.dinoKupih} + ${rakam.pasaranKupih} → sisa ${rakam.remainder}` : '—'}</div>
            </WorkspaceCard>
          </div>
        </Section>

        <Section eyebrow="04 · Reading" title="Watak Weton" accent="cyan">
          {watak?.name ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)]">
              <div className="rounded-2xl border border-[#28546A] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_48%),linear-gradient(135deg,rgba(9,31,44,0.98),rgba(5,16,25,0.98))] p-6">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5FA6BE]">Watak Neptu</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight text-[#EDF9FF]">{watak.name}</div>
                <div className="mt-4 inline-flex rounded-full border border-[#244C61] bg-[#0A2230] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#77BBD4]">Neptu {detail.neptu_total ?? '—'}</div>
              </div>
              <div className="rounded-2xl border border-[#173B50] bg-[linear-gradient(135deg,rgba(9,25,37,0.98),rgba(5,15,24,0.98))] p-6">
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#5E8195]">Pembacaan Tradisional</div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#A9C0CF]">{watak.desc}</p>
                <div className="mt-4 h-px bg-[#18374A]" />
                <p className="mt-3 text-[11px] leading-5 text-[#668397]">Disajikan sebagai referensi tradisional dan bahan pertimbangan dalam panduan kehidupan.</p>
              </div>
            </div>
          ) : <div className="rounded-xl border border-[#173044] bg-[#06131F] p-6 text-sm text-[#8FAEC1]">Data watak belum tersedia dari konteks Jawa existing.</div>}
        </Section>

        <Section eyebrow="05 · Reading Layers" title="Pembacaan Lanjutan" accent="blue">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {READING_LAYERS.map(([title, description, status]) => (
              <div key={title} className="rounded-xl border border-[#173044] bg-[linear-gradient(135deg,rgba(9,25,37,0.98),rgba(5,15,24,0.98))] p-5">
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-[#D8F3FF]">{title}</h3><span className="rounded-full border border-[#254155] bg-[#091A28] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#668397]">{status}</span></div>
                <p className="mt-2 text-xs leading-5 text-[#7896A8]">{description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="06 · Jawa Workspace" title="Fitur Jawa Lainnya" accent="blue">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <WorkspaceCard title="Kecocokan Jodoh" eyebrow="Repok · Jodoh" description="Ruang untuk metode kecocokan pasangan berbasis sumber yang tervalidasi.">
              <div className="text-sm font-semibold text-[#BFD8E7]">Menunggu formula sumber</div>
              <div className="mt-1 text-[11px] leading-5 text-[#7896A8]">Metode kecocokan pasangan memiliki beberapa versi petungan; hasil tidak ditampilkan sebelum metode dan sumber dipastikan.</div>
              <div className="mt-2 text-[9px] uppercase tracking-[0.12em] text-[#587388]">Formula belum tervalidasi</div>
            </WorkspaceCard>
            <WorkspaceCard title="Arah Rejeki" eyebrow="Kala · Arah" description="Arah rejeki harus mengikuti konteks Kala yang benar-benar tersedia, bukan dipaksakan sebagai sifat Weton.">
              <div className="text-sm font-semibold text-[#BFD8E7]">Konteks Kala</div>
              <div className="mt-1 text-[11px] leading-5 text-[#7896A8]">Gunakan arah rizki hanya ketika data Kala untuk tanggal/konteks tersebut tersedia.</div>
              <div className="mt-2 text-[9px] uppercase tracking-[0.12em] text-[#587388]">Belum ada hasil personal Weton</div>
            </WorkspaceCard>
            <WorkspaceCard title="Pal Laduni" eyebrow="Pembacaan" description="Pal Laduni tetap dipisahkan dari petungan Jawa yang sudah tervalidasi agar formula tidak tercampur.">
              <div className="text-sm font-semibold text-[#BFD8E7]">Menunggu formula sumber</div>
              <div className="mt-1 text-[11px] leading-5 text-[#7896A8]">Tidak membuat hasil sintetis tanpa formula dan provenance yang dapat diverifikasi.</div>
              <div className="mt-2 text-[9px] uppercase tracking-[0.12em] text-[#587388]">Belum terhubung</div>
            </WorkspaceCard>
          </div>
        </Section>

        <div className="rounded-[18px] border border-[#1A3448] bg-[linear-gradient(135deg,rgba(9,24,36,0.98),rgba(5,15,24,0.98))] px-5 py-4 text-xs leading-5 text-[#718FA2] shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
          Struktur ini memisahkan <span className="font-semibold text-[#B9D2E2]">hasil kalender</span>, <span className="font-semibold text-[#B9D2E2]">petungan</span>, dan <span className="font-semibold text-[#B9D2E2]">tafsir</span>. Hasil hanya ditampilkan ketika metode dan sumbernya tersedia; engine Jawa existing tetap menjadi sumber perhitungan.
        </div>
      </div>
    </section>
  )
}