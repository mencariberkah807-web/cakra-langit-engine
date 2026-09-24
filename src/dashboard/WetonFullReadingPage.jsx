import { useEffect, useMemo, useState } from 'react'
import { useTodayContext } from '../core/TodayContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

const WETON_READINGS = {
  "Senen Wage": {
    source: "Ki-Demang + JavaneseTime",
    watak: "Sederhana, tekun, cenderung tidak mencari perhatian. Mampu bekerja baik ketika tujuan jelas, tetapi sikap pendiam kadang mudah disalahpahami.",
    rezeki: "Dalam tafsir tradisional, rezeki berkembang melalui keterampilan yang terus dilatih dan kerja yang tekun.",
    karier: "Bidang yang membutuhkan ketelitian, administrasi, riset, analisis, pengelolaan, atau pekerjaan teknis.",
    asmara: "Cenderung membutuhkan hubungan yang tenang dan jelas. Komunikasi tentang perasaan dan kebutuhan perlu dijaga agar tidak terjadi jarak.",
    pancasuda: { name: "Dunya (Gedhong)", meaning: "Dikaitkan dengan kecukupan harta melalui usaha dan ketekunan." },
    pangarasan: { name: "Lakuning Geni", meaning: "Dalam sumber Ki-Demang: mudah marah dan ambisius." },
    rakam: { name: "Sanggar Waringin", meaning: "Teduh hati dan suka memberi perlindungan." },
    saptawara: { name: "Tunggak Semi", meaning: "Rezeki digambarkan dapat tumbuh kembali setelah berkurang." },
    kesehatan: "Gunakan pembacaan ini sebagai pengingat menjaga ritme hidup, istirahat, dan kebiasaan sehat; bukan sebagai diagnosis.",
    hariBaik: "Dalam salah satu rujukan Primbon.ID untuk Wage, Rabu, Jumat, dan Minggu disebut sebagai hari yang dipercaya baik untuk memulai kegiatan.",
    wuku: "Mandhasiya: sumber Ki-Demang mencatat tema perlindungan, penghematan, dan kehati-hatian dalam perjalanan serta mencari nafkah.",
  },
}

const NEPTU_PETUNGAN = {
  7: { name: "Lungguh", meaning: "Dikaitkan dengan kedudukan, kepercayaan, atau tanggung jawab." },
  8: { name: "Dunya (Gedhong)", meaning: "Dikaitkan dengan kecukupan harta melalui usaha dan kerja keras." },
  9: { name: "Loro (Lara)", meaning: "Dibaca sebagai pengingat untuk berhati-hati dan menjaga diri." },
  10: { name: "Pati", meaning: "Dibaca sebagai fase yang menuntut kehati-hatian dan ikhtiar." },
  11: { name: "Sri", meaning: "Dikaitkan dengan kelancaran rezeki dan penerimaan sosial." },
  12: { name: "Lungguh", meaning: "Dikaitkan dengan kedudukan, kepercayaan, atau tanggung jawab." },
  13: { name: "Dunya (Gedhong)", meaning: "Dikaitkan dengan kecukupan harta melalui usaha dan kerja keras." },
  14: { name: "Loro (Lara)", meaning: "Dibaca sebagai pengingat untuk berhati-hati dan menjaga diri." },
  15: { name: "Pati", meaning: "Dibaca sebagai fase yang menuntut kehati-hatian dan ikhtiar." },
  16: { name: "Sri", meaning: "Dikaitkan dengan kelancaran rezeki dan penerimaan sosial." },
  17: { name: "Lungguh", meaning: "Dikaitkan dengan kedudukan, kepercayaan, atau tanggung jawab." },
  18: { name: "Dunya (Gedhong)", meaning: "Dikaitkan dengan kecukupan harta melalui usaha dan kerja keras." },
}

const DAY_READING = {
  Senen: "Cenderung perasa, mempertimbangkan akibat, dan menjaga hubungan; perlu menghindari terlalu banyak memendam.",
  Selasa: "Cenderung berkemauan kuat dan berani bergerak; perlu menjaga kesabaran ketika menghadapi tekanan.",
  Rebo: "Cenderung cerdas, adaptif, dan banyak akal; perlu menjaga agar banyak gagasan tetap terarah.",
  Kemis: "Cenderung bijaksana, bertanggung jawab, dan mengayomi; perlu menyeimbangkan ketegasan dengan keluwesan.",
  Jemuwah: "Cenderung lembut, empatik, dan menjaga hubungan; perlu tetap tegas terhadap batas pribadi.",
  Setu: "Cenderung mandiri, berwibawa, dan teguh; perlu menghindari sikap terlalu kaku.",
  Ngahad: "Cenderung terbuka, mudah bergaul, dan percaya diri; perlu menjaga konsistensi dan pertimbangan.",
}

const PASARAN_READING = {
  Legi: "Legi sering dibaca sebagai unsur yang ramah, mudah bergaul, dan membawa suasana menyenangkan.",
  Pahing: "Pahing sering dibaca sebagai unsur yang kuat, berani, tegas, dan bersemangat.",
  Pon: "Pon sering dibaca sebagai unsur yang tenang, berwibawa, dan mempunyai insting tajam.",
  Wage: "Wage sering dibaca sebagai unsur yang sederhana, teliti, hemat, dan berhati-hati.",
  Kliwon: "Kliwon sering dibaca sebagai unsur yang peka, karismatik, dan kuat dalam kepekaan batin.",
}

const CAREER_BY_DAY = {
  Senen: "Administrasi, riset, analisis, pengelolaan, perdagangan, atau pekerjaan yang membutuhkan ketelitian.",
  Selasa: "Wirausaha, pekerjaan lapangan, perdagangan, olahraga, atau bidang yang membutuhkan keberanian.",
  Rebo: "Desain, teknologi, pendidikan, komunikasi, analisis, atau pekerjaan kreatif.",
  Kemis: "Kepemimpinan, organisasi, pelayanan, pengelolaan, pemerintahan, atau kegiatan sosial.",
  Jemuwah: "Pelayanan, pendidikan, kesehatan, seni, konseling, komunikasi, atau kegiatan sosial.",
  Setu: "Wirausaha, pengelolaan, pekerjaan mandiri, hukum, kepemimpinan, atau bidang yang membutuhkan ketegasan.",
  Ngahad: "Komunikasi, pemasaran, perdagangan, pelayanan, hubungan masyarakat, atau pekerjaan dengan banyak relasi.",
}

const JODOH_RESULTS = {
  1: "Pegat",
  2: "Ratu",
  3: "Jodoh",
  4: "Topo",
  5: "Tinari",
  6: "Padu",
  7: "Sujanan",
  8: "Pesthi",
}

const RAKAM_DINO_KUPIH = { Jemuwah: 1, Setu: 2, Ngahad: 3, Senen: 4, Selasa: 5, Rebo: 6, Kemis: 7 }
const RAKAM_PASARAN_KUPIH = { Kliwon: 1, Legi: 2, Pahing: 3, Pon: 4, Wage: 5 }
const RAKAM = {
  0: "Kala Tinantang",
  1: "Demang Kandhuruwan",
  2: "Sanggar Waringin",
  3: "Mantri Sinaroja",
  4: "Macan Ketawan",
  5: "Nuju Pati",
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
  }, [])

  const jawa = useMemo(() => apiData?.calendars?.find((calendar) => calendar.id === 'jawa') || null, [apiData])
  const detail = jawa?.detail || {}
  const dino = detail.dino || {}
  const pasaran = detail.pasaran || {}
  const wuku = detail.wuku || {}
  const total = Number(detail.neptu_total)
  const wetonKey = jawa?.sub || `${dino.name || ""} ${pasaran.name || ""}`.trim()
  const sourceReading = WETON_READINGS[wetonKey] || {}
  const neptuReading = NEPTU_PETUNGAN[total] || null
  const rakam = useMemo(() => {
    const dinoKupih = RAKAM_DINO_KUPIH[dino.name]
    const pasaranKupih = RAKAM_PASARAN_KUPIH[pasaran.name]
    if (dinoKupih == null || pasaranKupih == null) return null
    const remainder = (dinoKupih + pasaranKupih) % 6
    return { dinoKupih, pasaranKupih, remainder, name: RAKAM[remainder] }
  }, [dino.name, pasaran.name])
  const pancasuda = sourceReading.pancasuda || neptuReading
  const pangarasan = sourceReading.pangarasan || {
    name: `Unsur ${pasaran.name || "Pasaran"}`,
    meaning: PASARAN_READING[pasaran.name] || "Pembacaan tradisional berdasarkan pasaran.",
  }
  const rakamReading = sourceReading.rakam || (rakam ? {
    name: rakam.name,
    meaning: "Hasil petungan Rakam dari kombinasi kupih hari dan pasaran.",
  } : null)
  const saptawara = sourceReading.saptawara || {
    name: "Pembacaan Saptawara",
    meaning: "Pembacaan tambahan berdasarkan tradisi weton dan nilai hari.",
  }

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
              <div className="mt-1 text-xs text-[#A99362]">Neptu {total} · {pancasuda?.meaning || 'Belum tersedia'}</div>
              <div className="mt-3 font-mono text-[10px] text-[#6F6247]">{pancasuda ? `Neptu ${total}` : '—'}</div>
            </WorkspaceCard>
            <WorkspaceCard title="Pangarasan" eyebrow="Petungan · Neptu">
              <div className="text-2xl font-semibold text-[#E6D58B]">{pangarasan?.name || '—'}</div>
              <div className="mt-1 text-xs text-[#A99362]">{pangarasan?.meaning || 'Belum tersedia'}</div>
              <div className="mt-3 font-mono text-[10px] text-[#6F6247]">Neptu {Number.isInteger(total) ? total : '—'}</div>
            </WorkspaceCard>
            <WorkspaceCard title="Rakam" eyebrow="Petungan · Kupih">
              <div className="text-2xl font-semibold text-[#E6D58B]">{rakamReading?.name || '—'}</div>
              <div className="mt-1 text-xs text-[#A99362]">Sisa {rakam?.remainder ?? '—'}</div>
              <div className="mt-3 font-mono text-[10px] text-[#6F6247]">{rakam ? `${rakam.dinoKupih} + ${rakam.pasaranKupih} → sisa ${rakam.remainder}` : '—'}</div>
            </WorkspaceCard>
          </div>
        </Section>

        <Section eyebrow="04 · Reading" title="Watak Weton" accent="cyan">
          <div className="grid gap-4 lg:grid-cols-2">
            <WorkspaceCard title={wetonKey || "Weton"} eyebrow="Watak · Tradisi Jawa">
              <p className="text-sm leading-7 text-[#A9C0CF]">{sourceReading.watak || `${DAY_READING[dino.name] || "Pembacaan hari tersedia."} ${PASARAN_READING[pasaran.name] || ""}`}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Unsur Hari & Pasaran" eyebrow="Pembacaan gabungan">
              <p className="text-sm leading-7 text-[#A9C0CF]">{DAY_READING[dino.name] || "Pembacaan hari belum tersedia."}</p>
              <p className="mt-3 text-sm leading-7 text-[#A9C0CF]">{PASARAN_READING[pasaran.name] || "Pembacaan pasaran belum tersedia."}</p>
            </WorkspaceCard>
          </div>
        </Section>

        <Section eyebrow="05 · Reading Layers" title="Pembacaan Lengkap" accent="blue">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <WorkspaceCard title="Rezeki & Panguripan" eyebrow="Tradisi Jawa">
              <p className="text-sm leading-7 text-[#A9C0CF]">{sourceReading.rezeki || neptuReading?.meaning || "Pembacaan rezeki berdasarkan petungan tradisional."}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Pekerjaan & Karier" eyebrow="Pakaryan">
              <p className="text-sm leading-7 text-[#A9C0CF]">{sourceReading.karier || CAREER_BY_DAY[dino.name] || "Pembacaan pekerjaan berdasarkan kecenderungan weton."}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Asmara & Relasi" eyebrow="Hubungan">
              <p className="text-sm leading-7 text-[#A9C0CF]">{sourceReading.asmara || "Dalam pembacaan tradisional, komunikasi, kepercayaan, dan kemampuan memahami pasangan menjadi bagian penting."}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Kesehatan & Laku" eyebrow="Kehidupan">
              <p className="text-sm leading-7 text-[#A9C0CF]">{sourceReading.kesehatan || "Gunakan pembacaan tradisional sebagai pengingat menjaga ritme hidup dan kebiasaan sehat; bukan diagnosis."}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Hari Baik" eyebrow="Hari yang dipercaya">
              <p className="text-sm leading-7 text-[#A9C0CF]">{sourceReading.hariBaik || "Belum ada daftar khusus untuk weton ini dari rujukan yang sedang dipakai."}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Wuku & Pawukon" eyebrow="Konteks Wuku">
              <p className="text-sm leading-7 text-[#A9C0CF]">{sourceReading.wuku || `Wuku ${wuku.name || "belum tersedia"} menjadi lapisan tambahan dalam pembacaan Pawukon.`}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Pancasuda" eyebrow="Petungan">
              <div className="text-xl font-semibold text-[#E6D58B]">{pancasuda?.name || "—"}</div>
              <p className="mt-2 text-xs leading-5 text-[#A99362]">{pancasuda?.meaning || "Belum tersedia."}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Paarasan / Pangarasan" eyebrow="Petungan">
              <div className="text-xl font-semibold text-[#E6D58B]">{pangarasan?.name || "—"}</div>
              <p className="mt-2 text-xs leading-5 text-[#A99362]">{pangarasan?.meaning || "Belum tersedia."}</p>
            </WorkspaceCard>
            <WorkspaceCard title="Rakam & Saptawara" eyebrow="Petungan">
              <div className="text-xl font-semibold text-[#E6D58B]">{rakamReading?.name || "—"}</div>
              <p className="mt-2 text-xs leading-5 text-[#A99362]">{rakamReading?.meaning || "Belum tersedia."}</p>
              <div className="mt-3 border-t border-[#18374A] pt-3">
                <div className="text-sm font-semibold text-[#BFD8E7]">{saptawara.name}</div>
                <p className="mt-1 text-[11px] leading-5 text-[#7896A8]">{saptawara.meaning}</p>
              </div>
            </WorkspaceCard>
          </div>
        </Section>

        <Section eyebrow="06 · Jawa Workspace" title="Fitur Jawa Lainnya" accent="blue">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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