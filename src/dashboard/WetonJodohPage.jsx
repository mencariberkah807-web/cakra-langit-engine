import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

const WETON_REFERENCE = {
  'Minggu Legi': { pancasuda: 'Sumur Sinaba', paarasan: 'Aras Pepet', rakam: 'Macan Ketawan' },
  'Minggu Pahing': { pancasuda: 'Wasesa Segara', paarasan: 'Lakuning Rembulan', rakam: 'Nuju Padu' },
  'Minggu Pon': { pancasuda: 'Bumi Kapetak', paarasan: 'Aras Kembang', rakam: 'Kala Tinantang' },
  'Minggu Wage': { pancasuda: 'Satriya Wibawa', paarasan: 'Lakuning Angin', rakam: 'Kala Tinantang' },
  'Minggu Kliwon': { pancasuda: 'Lebu Katiyup Angin', paarasan: 'Lakuning Lintang', rakam: 'Mantri Sinaroja' },
  'Senen Legi': { pancasuda: 'Tunggak Semi', paarasan: 'Lakuning Geni', rakam: 'Nuju Pati' },
  'Senen Pahing': { pancasuda: 'Bumi Kapetak', paarasan: 'Lakuning Lintang', rakam: 'Nuju Padu' },
  'Senen Pon': { pancasuda: 'Sumur Sinaba', paarasan: 'Aras Tuding', rakam: 'Nuju Pati' },
  'Senen Wage': { pancasuda: 'Wasesa Segara', paarasan: 'Lakuning Geni', rakam: 'Sanggar Waringin', padangon: 'Jagur', lambangAlam: 'Api', watak: 'Menarik simpati; penyabar dan jujur, namun dapat keras hati.' },
  'Senen Kliwon': { pancasuda: 'Satriya Wirang', paarasan: 'Aras Kembang', rakam: 'Macan Ketawan' },
  'Selasa Legi': { pancasuda: 'Wasesa Segara', paarasan: 'Lakuning Geni', rakam: 'Nuju Padu' },
  'Selasa Pahing': { pancasuda: 'Satriya Wirang', paarasan: 'Aras Kembang', rakam: 'Kala Tinantang' },
  'Selasa Pon': { pancasuda: 'Satriya Wibawa', paarasan: 'Aras Pepet', rakam: 'Sanggar Waringin' },
  'Selasa Wage': { pancasuda: 'Lebu Katiyup Angin', paarasan: 'Lakuning Geni', rakam: 'Mantri Sinaroja' },
  'Selasa Kliwon': { pancasuda: 'Sumur Sinaba', paarasan: 'Aras Tuding', rakam: 'Nuju Pati' },
  'Rebo Legi': { pancasuda: 'Sumur Sinaba', paarasan: 'Aras Kembang', rakam: 'Kala Tinantang' },
  'Rebo Pahing': { pancasuda: 'Wasesa Segara', paarasan: 'Lakuning Banyu', rakam: 'Sanggar Waringin', padangon: 'Wurung', lambangAlam: 'Api', watak: 'Murah hati, suka menolong, berhati-hati, berpandangan luas dan cenderung mengayomi.' },
  'Rebo Pon': { pancasuda: 'Bumi Kapetak', paarasan: 'Lakuning Rembulan', rakam: 'Mantri Sinaroja' },
  'Rebo Wage': { pancasuda: 'Satriya Wibawa', paarasan: 'Aras Tuding', rakam: 'Macan Ketawan' },
  'Rebo Kliwon': { pancasuda: 'Lebu Katiyup Angin', paarasan: 'Lakuning Srengenge', rakam: 'Nuju Padu' },
  'Kemis Legi': { pancasuda: 'Satriya Wibawa', paarasan: 'Lakuning Lintang', rakam: 'Sanggar Waringin' },
  'Kemis Pahing': { pancasuda: 'Lebu Katiyup Angin', paarasan: 'Lakuning Bumi', rakam: 'Mantri Sinaroja' },
  'Kemis Pon': { pancasuda: 'Satriya Wirang', paarasan: 'Lakuning Srengenge', rakam: 'Macan Ketawan' },
  'Kemis Wage': { pancasuda: 'Tunggak Semi', paarasan: 'Aras Kembang', rakam: 'Nuju Pati' },
  'Kemis Kliwon': { pancasuda: 'Bumi Kapetak', paarasan: 'Lakuning Banyu', rakam: 'Kala Tinantang' },
  'Jumat Legi': { pancasuda: 'Satriya Wirang', paarasan: 'Aras Tuding', rakam: 'Sanggar Waringin' },
  'Jumat Pahing': { pancasuda: 'Tunggak Semi', paarasan: 'Lakuning Srengenge', rakam: 'Mantri Sinaroja' },
  'Jumat Pon': { pancasuda: 'Lebu Katiyup Angin', paarasan: 'Lakuning Lintang', rakam: 'Macan Ketawan' },
  'Jumat Wage': { pancasuda: 'Sumur Sinaba', paarasan: 'Aras Pepet', rakam: 'Nuju Pati' },
  'Jumat Kliwon': { pancasuda: 'Wasesa Segara', paarasan: 'Lakuning Rembulan', rakam: 'Mantri Sinaroja' },
  'Sabtu Legi': { pancasuda: 'Bumi Kapetak', paarasan: 'Aras Pepet', rakam: 'Macan Ketawan' },
  'Sabtu Pahing': { pancasuda: 'Satriya Wibawa', paarasan: 'Lakuning Geni', rakam: 'Macan Ketawan' },
  'Sabtu Pon': { pancasuda: 'Wasesa Segara', paarasan: 'Lakuning Banyu', rakam: 'Nuju Pati' },
  'Sabtu Wage': { pancasuda: 'Satriya Wirang', paarasan: 'Lakuning Lintang', rakam: 'Mantri Sinaroja' },
  'Sabtu Kliwon': { pancasuda: 'Tunggak Semi', paarasan: 'Lakuning Bumi', rakam: 'Sanggar Waringin' },
}

const PITU = ['Wasesa Segara', 'Tunggak Semi', 'Satriya Wibawa', 'Sumur Sinaba', 'Satriya Wirang', 'Bumi Kapetak', 'Lebu Katiyup Angin']
const PANCASUDA_MEANING = {
  'Wasesa Segara': 'Pemaaf, lapang dada, suka menolong, dan berwibawa.',
  'Tunggak Semi': 'Rezeki dikaitkan dengan kemampuan tumbuh dan datang kembali.',
  'Satriya Wibawa': 'Dikaitkan dengan kemuliaan, keluhuran, dan kewibawaan.',
  'Sumur Sinaba': 'Dikaitkan dengan menjadi tempat bertanya dan sumber pengetahuan.',
  'Satriya Wirang': 'Dikaitkan dengan cobaan, rasa malu, dan kebutuhan menjaga keteguhan.',
  'Bumi Kapetak': 'Dikaitkan dengan ketekunan bekerja dan daya tahan menghadapi kesulitan.',
  'Lebu Katiyup Angin': 'Dikaitkan dengan ketidakpastian dan cita-cita yang mudah berubah.',
}

const PAARASAN_MEANING = {
  'Lakuning Geni': 'Bersemangat, tegas, dan mudah tersulut ketika menghadapi tekanan.',
  'Lakuning Banyu': 'Teduh, murah hati, mengalir dan mudah menyesuaikan diri.',
  'Lakuning Lintang': 'Cenderung menyendiri, mandiri, dan memiliki daya tarik tersendiri.',
  'Lakuning Rembulan': 'Menenteramkan dan cenderung menjadi pembimbing.',
  'Lakuning Srengenge': 'Memberi penerangan dan dikaitkan dengan kewibawaan.',
  'Lakuning Bumi': 'Penyabar dan menjadi tempat berpijak atau mengayomi.',
  'Lakuning Angin': 'Dinamis, lincah, dan mudah bergerak mengikuti keadaan.',
  'Aras Kembang': 'Lembut, menarik simpati, dan mudah disenangi.',
  'Aras Tuding': 'Sering menjadi pihak yang ditunjuk atau dimintai tanggung jawab.',
  'Aras Pepet': 'Cepat menangkap sesuatu tetapi perlu ketekunan agar hasilnya tercapai.',
}

const RAKAM_MEANING = {
  'Pati': 'Simbol peringatan dan kehati-hatian.',
  'Kala Tinantang': 'Pemberani dan dapat menghadapi banyak tantangan.',
  'Demang Kandhuruwan': 'Dikaitkan dengan banyak perkara dan kegelisahan.',
  'Sanggar Waringin': 'Teduh, suka memberi perlindungan, dan menjadi tempat berteduh.',
  'Mantri Sinaroja': 'Dikaitkan dengan kecukupan dan kemudahan memperoleh hasil dari pekerjaan.',
  'Macan Ketawan': 'Dikaitkan dengan keberanian, tetapi perlu menjaga konflik dan pertengkaran.',
  'Nuju Pati': 'Peringatan untuk berhati-hati terhadap aral dan keadaan yang tidak menguntungkan.',
}

const WOLU_TONES = {
  Pegat: 'border-rose-300/40 bg-rose-300/[0.06] text-rose-200',
  Ratu: 'border-amber-300/40 bg-amber-300/[0.06] text-amber-200',
  Jodoh: 'border-emerald-300/40 bg-emerald-300/[0.06] text-emerald-200',
  Topo: 'border-amber-300/40 bg-amber-300/[0.06] text-amber-200',
  Tinari: 'border-emerald-300/40 bg-emerald-300/[0.06] text-emerald-200',
  Padu: 'border-orange-300/40 bg-orange-300/[0.06] text-orange-200',
  Sujanan: 'border-rose-300/40 bg-rose-300/[0.06] text-rose-200',
  Pesthi: 'border-emerald-300/40 bg-emerald-300/[0.06] text-emerald-200',
}

function Card({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-white/[0.08] bg-[#0A1723] shadow-[0_10px_35px_rgba(0,0,0,0.14)] ${className}`}>
      {title ? <div className="border-b border-white/[0.08] px-5 py-3.5 text-sm font-semibold text-white">{title}</div> : null}
      <div className="p-5">{children}</div>
    </section>
  )
}

function Field({ label, value, onChange, disabled = false }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#647D8F]">{label}</span>
      <input type="text" inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value.replace(/[^0-9/]/g, '').slice(0, 10))} placeholder="DD/MM/YYYY" disabled={disabled} className="mt-2 w-full rounded-lg border border-amber-200/20 bg-[#07111C] px-3 py-3 text-sm text-white outline-none placeholder:text-[#526A7B] focus:border-amber-300/50 disabled:opacity-50" />
    </label>
  )
}

function ProfileCheckbox({ checked, onChange }) {
  return <label className="mt-3 flex items-center gap-2 text-xs text-[#91A7B7]"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-amber-400" /><span>Gunakan profil saya</span></label>
}

function toIsoDate(value) {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return null
  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12)
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

async function getProfile() {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null
  const response = await fetch(`${API_BASE}/api/profile`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!response.ok) throw new Error('Profil kelahiran belum dapat dimuat.')
  const payload = await response.json()
  return payload?.profile || null
}

async function getAlmanac(dateValue, profile = null) {
  const locationQuery = profile?.birth_location_id ? `location_id=${encodeURIComponent(profile.birth_location_id)}` : `city=${encodeURIComponent(profile?.birth_location?.city || 'Bandung')}`
  const response = await fetch(`${API_BASE}/api/almanac?${locationQuery}&date_value=${encodeURIComponent(dateValue)}`)
  if (!response.ok) throw new Error('Data kalender tidak dapat diambil.')
  const payload = await response.json()
  const jawa = payload?.calendars?.find((calendar) => calendar.id === 'jawa') || null
  const bali = payload?.calendars?.find((calendar) => calendar.id === 'bali') || null
  const detail = jawa?.detail || {}
  const dino = detail.dino || {}
  const pasaran = detail.pasaran || {}
  const neptu = Number(detail.neptu_total)
  if (!Number.isFinite(neptu)) throw new Error('Neptu Weton belum tersedia dari engine Jawa.')
  const weton = jawa?.sub || `${dino.name || '—'} ${pasaran.name || '—'}`
  const ref = WETON_REFERENCE[weton] || {}
  const baliDetail = bali?.detail || {}
  const field = (name) => bali?.fields?.find((item) => item.k === name)?.v
  const lintang = baliDetail.lintang || field('Lintang') || '—'
  const padangon = ref.padangon || baliDetail.padangon || field('Padangon') || field('Sangawara') || '—'

  return {
    date: dateValue,
    weton,
    dino: dino.name || '—',
    dinoNeptu: dino.neptu ?? '—',
    pasaran: pasaran.name || '—',
    pasaranNeptu: pasaran.neptu ?? '—',
    neptu,
    wuku: detail.wuku?.name || baliDetail.wuku || '—',
    lintang,
    padangon,
    lambangAlam: ref.lambangAlam || (padangon === 'Wurung' ? 'Api' : padangon === 'Jagur' ? 'Harimau' : '—'),
    pancasuda: ref.pancasuda || '—',
    pancaMeaning: PANCASUDA_MEANING[ref.pancasuda] || 'Data makna belum tersedia pada referensi yang dipakai.',
    paarasan: ref.paarasan || '—',
    paarasanMeaning: PAARASAN_MEANING[ref.paarasan] || 'Data makna belum tersedia pada referensi yang dipakai.',
    rakam: ref.rakam || '—',
    rakamMeaning: RAKAM_MEANING[ref.rakam] || 'Data makna belum tersedia pada referensi yang dipakai.',
    watak: ref.watak || 'Pembacaan watak mengikuti kombinasi Weton dan referensi yang tersedia; tidak dibuat dari skor kecocokan.',
  }
}

function JodohFormPage() {
  const [profile, setProfile] = useState(null)
  const [dateOne, setDateOne] = useState('')
  const [dateTwo, setDateTwo] = useState('')
  const [useProfileOne, setUseProfileOne] = useState(true)
  const [useProfileTwo, setUseProfileTwo] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile().then((nextProfile) => {
      setProfile(nextProfile)
      if (nextProfile?.birth_date) setDateOne(nextProfile.birth_date.split('-').reverse().join('/'))
      else setUseProfileOne(false)
    }).catch((err) => { setUseProfileOne(false); setError(err.message) }).finally(() => setLoading(false))
  }, [])

  function submit(event) {
    event.preventDefault()
    setError('')
    const resolvedOne = useProfileOne ? profile?.birth_date : toIsoDate(dateOne)
    const resolvedTwo = useProfileTwo ? profile?.birth_date : toIsoDate(dateTwo)
    if (!resolvedOne) return setError('Tanggal orang pertama harus valid dengan format DD/MM/YYYY.')
    if (!resolvedTwo) return setError('Tanggal orang kedua harus valid dengan format DD/MM/YYYY.')
    window.location.assign(`/dashboard/weton/jodoh/hitung?${new URLSearchParams({ date_one: resolvedOne, date_two: resolvedTwo }).toString()}`)
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7 text-center"><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Analisis Asmara</div><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Kecocokan Jodoh</h1><p className="mt-2 text-sm text-[#8FA7B8]">Analisis weton pasangan berdasarkan petungan Jawa dan data pendukung yang tersedia.</p></header>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Data Pria / Pihak Pertama"><Field label="Tanggal lahir" value={useProfileOne && profile?.birth_date ? profile.birth_date.split('-').reverse().join('/') : dateOne} onChange={setDateOne} disabled={useProfileOne} /><ProfileCheckbox checked={useProfileOne} onChange={setUseProfileOne} /></Card>
          <Card title="Data Wanita / Pihak Kedua"><Field label="Tanggal lahir" value={useProfileTwo && profile?.birth_date ? profile.birth_date.split('-').reverse().join('/') : dateTwo} onChange={setDateTwo} disabled={useProfileTwo} /><ProfileCheckbox checked={useProfileTwo} onChange={setUseProfileTwo} /></Card>
        </div>
        {error ? <div className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] px-4 py-3 text-xs text-rose-200">{error}</div> : null}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#D4AF37] px-4 py-3.5 text-sm font-bold text-[#10251F] shadow-[0_8px_24px_rgba(212,175,55,0.16)] hover:bg-[#E5C24A] disabled:opacity-50">{loading ? 'Memuat profil…' : '♡  Analisis Kecocokan Jodoh'}</button>
      </form>
    </section>
  )
}

function PersonSummary({ title, person, feminine = false }) {
  return <Card title={title}><div className="flex flex-wrap items-center gap-2 text-base font-bold text-white"><span>{person?.weton || '—'}</span><span className={`rounded border px-2 py-1 text-[10px] ${feminine ? 'border-rose-300/30 text-rose-200' : 'border-emerald-300/30 text-emerald-200'}`}>Neptu {person?.neptu ?? '—'}</span></div><div className="mt-2 text-xs text-[#8298A8]">{formatDate(person?.date)}</div><div className="my-4 border-t border-white/[0.08]" /><div className="grid gap-2 text-xs leading-5 text-[#B7C8D4] sm:grid-cols-2"><div><strong className="text-white">Rakam:</strong> {person?.rakam || '—'}</div><div><strong className="text-white">Pancasudha:</strong> {person?.pancasuda || '—'}</div><div><strong className="text-white">Paarasan:</strong> {person?.paarasan || '—'}</div><div><strong className="text-white">Wuku:</strong> {person?.wuku || '—'}</div></div></Card>
}

function SymbolCard({ title, person, feminine = false }) {
  return <Card title={title}><div className={`text-center text-2xl font-bold ${feminine ? 'text-rose-300' : 'text-emerald-300'}`}>{person?.lintang || '—'}</div><div className="mt-1 text-center text-xs text-[#8298A8]">Lintang / lambang weton</div><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-lg bg-[#07111C] p-4 text-center"><div className="text-xs font-bold uppercase tracking-[0.12em] text-[#6F8798]">Paarasan</div><div className="mt-2 text-sm font-bold text-white">{person?.paarasan || '—'}</div><div className="mt-1 text-[10px] text-[#71899A]">{person?.lambangAlam || '—'}</div></div><div className="rounded-lg bg-[#07111C] p-4 text-center"><div className="text-xs font-bold uppercase tracking-[0.12em] text-[#6F8798]">Padangon</div><div className="mt-2 text-sm font-bold text-white">{person?.padangon || '—'}</div><div className="mt-1 text-[10px] text-[#71899A]">Lambang alam: {person?.lambangAlam || '—'}</div></div></div><div className="mt-5 rounded-lg border border-white/[0.06] bg-[#07111C]/70 p-4"><div className="text-xs font-bold text-white">Watak</div><p className="mt-1 text-xs leading-5 text-[#91A7B7]">{person?.watak || '—'}</p></div></Card>
}

function IndividualAnalysis({ title, person }) {
  return <Card title={title}><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-[#07111C] p-4"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">Pancasudha</div><div className="mt-2 text-base font-bold text-amber-200">{person?.pancasuda || '—'}</div><p className="mt-2 text-xs leading-5 text-[#91A7B7]">{person?.pancaMeaning || '—'}</p></div><div className="rounded-lg bg-[#07111C] p-4"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">Rakam</div><div className="mt-2 text-base font-bold text-cyan-200">{person?.rakam || '—'}</div><p className="mt-2 text-xs leading-5 text-[#91A7B7]">{person?.rakamMeaning || '—'}</p></div><div className="rounded-lg bg-[#07111C] p-4"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">Paarasan</div><div className="mt-2 text-base font-bold text-emerald-200">{person?.paarasan || '—'}</div><p className="mt-2 text-xs leading-5 text-[#91A7B7]">{person?.paarasanMeaning || '—'}</p></div></div></Card>
}

function PairPetungCard({ title, item, tone = 'amber' }) {
  if (!item) return null
  const toneClass = tone === 'green' ? 'border-emerald-300/40 text-emerald-200' : tone === 'blue' ? 'border-cyan-300/30 text-cyan-200' : 'border-amber-300/40 text-amber-200'
  return <div className={`rounded-lg border bg-[#07111C] p-4 ${toneClass}`}><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">{title}</div><div className="mt-2 text-base font-bold">{item.name}</div><p className="mt-2 text-xs leading-5 text-[#91A7B7]">{item.meaning}</p><div className="mt-3 text-[10px] text-[#6F8798]">Sisa {item.remainder} · modulo {item.divisor}</div></div>
}

function WarigaBali({ one, two, total }) {
  const available = one?.pancasuda && two?.pancasuda
  return <Card title="☀ Tradisi Wariga Bali"><div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div className="text-center"><div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6F8798]">Patemon / Referensi Bali</div><div className="mt-3 text-2xl font-bold text-amber-300">{available ? `${one.pancasuda} · ${two.pancasuda}` : 'Data belum tersedia'}</div><p className="mt-2 text-xs text-[#91A7B7]">Data Bali ditampilkan sebagai lapisan pendukung, bukan pengganti petungan Jawa.</p></div><div className="space-y-2 text-xs leading-5 text-[#B7C8D4]"><div><strong className="text-white">Total Urip/Neptu pasangan:</strong> {total}</div><div><strong className="text-white">Panca Sudha pihak pertama:</strong> {one?.pancasuda || '—'}</div><div><strong className="text-white">Panca Sudha pihak kedua:</strong> {two?.pancasuda || '—'}</div><div><strong className="text-white">Rakam pihak pertama:</strong> {one?.rakam || '—'}</div><div><strong className="text-white">Rakam pihak kedua:</strong> {two?.rakam || '—'}</div><div><strong className="text-white">Tri Pramana:</strong> Belum tersedia pada engine Cakra Langit; tidak diisi dengan tebakan.</div></div></div></Card>
}

function JodohResultPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const dateOne = params.get('date_one') || ''
  const dateTwo = params.get('date_two') || ''
  const [result, setResult] = useState(null)
  const [one, setOne] = useState(null)
  const [two, setTwo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!dateOne || !dateTwo) { setError('Tanggal pasangan tidak lengkap.'); setLoading(false); return }
    Promise.all([getAlmanac(dateOne), getAlmanac(dateTwo), fetch(`${API_BASE}/api/weton/jodoh?neptu_one=0&neptu_two=0`)]).catch(() => null)
    Promise.all([getAlmanac(dateOne), getAlmanac(dateTwo)]).then(async ([first, second]) => {
      const response = await fetch(`${API_BASE}/api/weton/jodoh?neptu_one=${encodeURIComponent(first.neptu)}&neptu_two=${encodeURIComponent(second.neptu)}`)
      if (!response.ok) throw new Error('Perhitungan jodoh tidak dapat diambil.')
      const payload = await response.json()
      setOne(first); setTwo(second); setResult(payload)
    }).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [dateOne, dateTwo])

  const petungan = result?.petungan || {}
  const woluTone = WOLU_TONES[result?.name] || 'border-amber-300/40 bg-amber-300/[0.06] text-amber-200'
  const total = result?.total_neptu ?? (one?.neptu || 0) + (two?.neptu || 0)
  const formula = useMemo(() => `${one?.neptu ?? '—'} + ${two?.neptu ?? '—'} = ${total}`, [one, two, total])

  if (loading) return <section className="mx-auto max-w-[1180px] px-5 py-12 text-center text-sm text-[#91A7B7]">Memuat pembacaan weton pasangan…</section>
  if (error) return <section className="mx-auto max-w-[1180px] px-5 py-12"><div className="rounded-xl border border-rose-300/20 bg-rose-300/[0.05] p-5 text-sm text-rose-200">{error}</div></section>

  return <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
    <header className="mb-7 text-center"><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Analisis Asmara · Hasil Weton Jawa</div><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Hasil Perhitungan Jodoh</h1><p className="mt-2 text-sm text-[#8FA7B8]">Pembacaan berdasarkan beberapa petungan tradisional; hasil utama mengikuti Petungan Pitu.</p></header>

    <Card className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/30 text-amber-300">✦</div><div className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6F8798]">Hasil Utama · Petungan Luwiyan (Modulo 7)</div><div className="mx-auto mt-3 inline-flex rounded-lg border border-amber-300/35 bg-amber-300/[0.05] px-4 py-2 text-2xl font-bold text-amber-200">{petungan.pitu?.name || '—'}</div><p className="mx-auto mt-3 max-w-xl text-sm text-[#A6B8C5]">{petungan.pitu?.meaning || '—'}</p><div className="mx-auto mt-6 h-2 max-w-[650px] overflow-hidden rounded-full bg-[#142838]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" style={{ width: `${((petungan.pitu?.remainder || 1) / 7) * 100}%` }} /></div><div className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8EA4B4]">Sisa {petungan.pitu?.remainder || '—'} dari 7 · bukan skor probabilitas</div><div className="mt-5 border-t border-white/[0.08] pt-4 text-left text-xs text-cyan-200"><span>{formula}</span><span className="float-right text-[9px] uppercase tracking-[0.12em] text-[#6F8798]">Total Neptu Pasangan</span></div></Card>

    <div className="mt-4"><Card title="PETUNGAN PELENGKAP — PERNIKAHAN (WOLU, MOD 8)"><div className="grid gap-5 md:grid-cols-[0.55fr_1.45fr] md:items-center"><div className="text-center"><div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6F8798]">Hasil Wolu</div><div className={`mx-auto mt-3 inline-flex rounded-lg border px-4 py-2 text-xl font-bold ${woluTone}`}>{petungan.wolu?.name || result?.name || '—'}</div></div><div><p className="text-sm text-[#B7C8D4]">{petungan.wolu?.meaning || result?.meaning || '—'}</p><p className="mt-2 text-xs text-[#71899A]">Metode: total Neptu pasangan dibagi 8; sisa 0 dibaca sebagai sisa 8.</p></div></div></Card></div>

    <div className="mt-4 grid gap-4 lg:grid-cols-2"><PersonSummary title="Weton Pihak Pertama" person={one} /><PersonSummary title="Weton Pihak Kedua" person={two} feminine /></div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2"><SymbolCard title="Lambang — Pihak Pertama" person={one} /><SymbolCard title="Lambang — Pihak Kedua" person={two} feminine /></div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2"><IndividualAnalysis title="Analisis Petungan — Pihak Pertama" person={one} /><IndividualAnalysis title="Analisis Petungan — Pihak Kedua" person={two} /></div>

    <div className="mt-4"><Card title="☀ Analisis Petungan Pasangan"><p className="text-xs text-[#A9BBC7]">Perhitungan dari total neptu gabungan: <strong className="text-white">{total}</strong> ({one?.neptu} + {two?.neptu}).</p><p className="mt-2 text-[11px] text-[#71899A]">Tiga petungan utama ditampilkan bersama agar hasil pasangan tidak tercampur dengan kartu individual.</p><div className="mt-4 grid gap-3 lg:grid-cols-3"><PairPetungCard title="Petungan Pitu · Mod 7" item={petungan.pitu} tone="amber" /><PairPetungCard title="Petungan Papat · Mod 4" item={petungan.papat} tone="blue" /><PairPetungCard title="Petungan Wolu · Mod 8" item={petungan.wolu} tone="green" /></div><div className="mt-3 grid gap-3 lg:grid-cols-2"><PairPetungCard title="Petungan Lima · Mod 5" item={petungan.lima} tone="blue" /><div className="rounded-lg border border-white/[0.08] bg-[#07111C] p-4"><div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">Rujukan</div><p className="mt-2 text-xs leading-5 text-[#91A7B7]">Petungan 4, 5, 7, dan 8 digunakan sebagai lapisan pembacaan tradisional. Variasi primbon dapat menghasilkan pemetaan berbeda; hasil ditampilkan sebagai referensi budaya, bukan kepastian hubungan.</p></div></div></Card></div>

    <div className="mt-4"><WarigaBali one={one} two={two} total={total} /></div>

    <div className="mt-4"><Card title="● Nasihat Primbon"><div className="space-y-3 text-xs leading-6 text-[#B7C8D4]"><p><strong className="text-white">Petungan utama:</strong> {petungan.pitu?.name || '—'} — {petungan.pitu?.meaning || '—'}</p><p><strong className="text-white">Petungan pernikahan:</strong> {petungan.wolu?.name || result?.name || '—'} — {petungan.wolu?.meaning || result?.meaning || '—'}</p><p className="italic text-[#8298A8]">Hasil ini merupakan referensi petungan tradisional, bukan penentu mutlak hubungan. Variasi metode dan sumber primbon dapat menghasilkan pembacaan yang berbeda.</p></div></Card></div>

    <details className="mt-4 rounded-xl border border-white/[0.08] bg-[#0A1723]"><summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-white">▦ Detail Cara Perhitungan</summary><div className="border-t border-white/[0.08] p-5 text-xs leading-6 text-[#B7C8D4]"><div>Neptu pihak pertama: <strong className="text-white">{one?.neptu}</strong></div><div>Neptu pihak kedua: <strong className="text-white">{two?.neptu}</strong></div><div>Total: <strong className="text-white">{total}</strong></div><div className="mt-2">Modulo 7: sisa {petungan.pitu?.remainder}</div><div>Modulo 4: sisa {petungan.papat?.remainder}</div><div>Modulo 5: sisa {petungan.lima?.remainder}</div><div>Modulo 8: sisa {petungan.wolu?.remainder}</div></div></details>

    <div className="mt-5 text-center"><button type="button" onClick={() => window.location.assign('/dashboard/weton/jodoh')} className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#10251F] hover:bg-[#E5C24A]">← Cek Pasangan Lainnya</button></div>
    <div className="mt-12 pb-10"><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Jelajahi</div><h2 className="mt-2 text-2xl font-semibold text-white">Fitur Lainnya</h2><p className="mt-2 text-sm text-[#71899A]">Weton lengkap, Palintangan, Palelintangan, dan sistem almanak lain tetap tersedia dari workspace Cakra Langit.</p></div>
  </section>
}

export default function WetonJodohPage() {
  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') || '/' : '/'
  return path === '/dashboard/weton/jodoh/hitung' ? <JodohResultPage /> : <JodohFormPage />
}
