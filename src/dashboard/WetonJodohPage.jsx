import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

const RESULT_TONES = {
  Pegat: 'border-rose-300/40 bg-rose-300/[0.07] text-rose-200',
  Ratu: 'border-amber-300/40 bg-amber-300/[0.07] text-amber-200',
  Jodoh: 'border-emerald-300/40 bg-emerald-300/[0.07] text-emerald-200',
  Topo: 'border-amber-300/40 bg-amber-300/[0.07] text-amber-200',
  Tinari: 'border-emerald-300/40 bg-emerald-300/[0.07] text-emerald-200',
  Padu: 'border-orange-300/40 bg-orange-300/[0.07] text-orange-200',
  Sujanan: 'border-rose-300/40 bg-rose-300/[0.07] text-rose-200',
  Pesthi: 'border-emerald-300/40 bg-emerald-300/[0.07] text-emerald-200',
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
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9/]/g, '').slice(0, 10))}
        placeholder="DD/MM/YYYY"
        disabled={disabled}
        className="mt-2 w-full rounded-lg border border-amber-200/20 bg-[#07111C] px-3 py-3 text-sm text-white outline-none placeholder:text-[#526A7B] focus:border-amber-300/50 disabled:opacity-50"
      />
    </label>
  )
}

function ProfileCheckbox({ checked, onChange }) {
  return (
    <label className="mt-3 flex items-center gap-2 text-xs text-[#91A7B7]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-amber-400" />
      <span>Gunakan profil saya</span>
    </label>
  )
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
  const locationQuery = profile?.birth_location_id
    ? `location_id=${encodeURIComponent(profile.birth_location_id)}`
    : `city=${encodeURIComponent(profile?.birth_location?.city || 'Bandung')}`
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
  const baliDetail = bali?.detail || {}

  return {
    date: dateValue,
    weton: jawa?.sub || '—',
    dino: dino.name || '—',
    dinoNeptu: dino.neptu ?? '—',
    pasaran: pasaran.name || '—',
    pasaranNeptu: pasaran.neptu ?? '—',
    neptu,
    rakam: baliDetail.rakam || bali?.fields?.find((field) => field.k === 'Rakam')?.v || '—',
    pancaSudha: baliDetail.pancaSudha || bali?.fields?.find((field) => field.k === 'Panca Sudha')?.v || '—',
    lintang: baliDetail.lintang || bali?.fields?.find((field) => field.k === 'Lintang')?.v || '—',
    wuku: detail.wuku?.name || baliDetail.wuku || '—',
    bali,
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
    getProfile()
      .then((nextProfile) => {
        setProfile(nextProfile)
        if (nextProfile?.birth_date) setDateOne(nextProfile.birth_date.split('-').reverse().join('/'))
        else setUseProfileOne(false)
      })
      .catch((err) => {
        setUseProfileOne(false)
        setError(err.message)
      })
      .finally(() => setLoading(false))
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
      <header className="mb-7 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Analisis Asmara</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Kecocokan Jodoh</h1>
        <p className="mt-2 text-sm text-[#8FA7B8]">Hitung kecocokan berdasarkan weton, lalu baca beberapa petungan tradisional secara berdampingan.</p>
      </header>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Data Orang Pertama">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label="Tanggal lahir" value={useProfileOne && profile?.birth_date ? profile.birth_date.split('-').reverse().join('/') : dateOne} onChange={setDateOne} disabled={useProfileOne} />
              <ProfileCheckbox checked={useProfileOne} onChange={setUseProfileOne} />
            </div>
          </Card>
          <Card title="Data Orang Kedua">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label="Tanggal lahir" value={useProfileTwo && profile?.birth_date ? profile.birth_date.split('-').reverse().join('/') : dateTwo} onChange={setDateTwo} disabled={useProfileTwo} />
              <ProfileCheckbox checked={useProfileTwo} onChange={setUseProfileTwo} />
            </div>
          </Card>
        </div>
        {error ? <div className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] px-4 py-3 text-xs text-rose-200">{error}</div> : null}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#D4AF37] px-4 py-3.5 text-sm font-bold text-[#10251F] shadow-[0_8px_24px_rgba(212,175,55,0.16)] hover:bg-[#E5C24A] disabled:opacity-50">
          {loading ? 'Memuat profil…' : '♡  Analisis Kecocokan Jodoh'}
        </button>
      </form>
    </section>
  )
}

function PersonSummary({ title, person, accent = 'text-emerald-300' }) {
  return (
    <Card title={title}>
      <div className="text-base font-bold text-white">
        {person?.weton || '—'}
        <span className={`ml-2 rounded border border-current/30 px-2 py-1 text-[10px] ${accent}`}>Neptu {person?.neptu ?? '—'}</span>
      </div>
      <div className="mt-2 text-xs text-[#8298A8]">{formatDate(person?.date)}</div>
      <div className="my-3 border-t border-white/[0.08]" />
      <div className="space-y-2 text-xs text-[#B7C8D4]">
        <div><strong className="text-white">Rakam:</strong> {person?.rakam || '—'}</div>
        <div><strong className="text-white">Pancasudha:</strong> {person?.pancaSudha || '—'}</div>
        <div><strong className="text-white">Elemen:</strong> —</div>
      </div>
    </Card>
  )
}

function SymbolCard({ title, person, feminine = false }) {
  return (
    <Card title={title}>
      <div className={`text-center text-lg font-bold ${feminine ? 'text-rose-300' : 'text-emerald-300'}`}>{person?.lintang || '—'}</div>
      <div className="mt-1 text-center text-xs text-[#8298A8]">Lintang / lambang yang tersedia dari engine</div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[#07111C] p-4 text-center">
          <div className="text-xl text-amber-200">◎</div>
          <div className="mt-2 text-xs font-semibold text-white">Wuku</div>
          <div className="mt-1 text-[10px] text-[#71899A]">{person?.wuku || '—'}</div>
        </div>
        <div className="rounded-lg bg-[#07111C] p-4 text-center">
          <div className="text-xl text-amber-200">♡</div>
          <div className="mt-2 text-xs font-semibold text-white">Pasaran</div>
          <div className="mt-1 text-[10px] text-[#71899A]">{person?.pasaran || '—'}</div>
        </div>
      </div>
      <div className="mt-5">
        <div className="text-xs font-bold text-white">Watak</div>
        <p className="mt-2 text-xs leading-5 text-[#91A7B7]">Interpretasi watak/lambang yang belum mempunyai formula terverifikasi tidak diisi dengan tebakan.</p>
      </div>
    </Card>
  )
}

function PairPetungCard({ title, item, tone = 'amber' }) {
  const toneClass = tone === 'green' ? 'border-emerald-300/40 text-emerald-200' : tone === 'blue' ? 'border-cyan-300/30 text-cyan-200' : 'border-amber-300/40 text-amber-200'
  return (
    <div className={`rounded-lg border bg-[#07111C] p-4 ${toneClass}`}>
      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">{title}</div>
      <div className="mt-2 text-base font-bold">{item?.name || '—'}</div>
      <p className="mt-2 text-xs leading-5 text-[#A6B8C5]">{item?.meaning || '—'}</p>
      <div className="mt-3 text-[10px] text-[#72899A]">Sisa {item?.remainder ?? '—'} · modulo {item?.divisor ?? '—'}</div>
    </div>
  )
}

function JodohResultPage() {
  const [people, setPeople] = useState({ one: null, two: null })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dateOne = params.get('date_one')
    const dateTwo = params.get('date_two')
    if (!dateOne || !dateTwo) {
      setError('Tanggal kedua pihak belum dipilih.')
      setLoading(false)
      return
    }

    getProfile().catch(() => null).then(async (profile) => {
      const [one, two] = await Promise.all([getAlmanac(dateOne, profile), getAlmanac(dateTwo, profile)])
      const response = await fetch(`${API_BASE}/api/weton/jodoh?neptu_one=${one.neptu}&neptu_two=${two.neptu}`)
      if (!response.ok) throw new Error('Perhitungan jodoh tidak dapat diproses.')
      const jodoh = await response.json()
      setPeople({ one, two })
      setResult(jodoh)
    }).catch((err) => setError(err?.message || 'Perhitungan jodoh gagal diproses.')).finally(() => setLoading(false))
  }, [])

  if (loading) return <section className="mx-auto max-w-[1180px] px-5 py-16 text-center text-sm text-[#8298A8]">Memuat hasil perhitungan…</section>
  if (error) return <section className="mx-auto max-w-[1180px] px-5 py-16"><Card><div className="text-sm text-rose-200">{error}</div></Card></section>

  const pitu = result?.petungan?.pitu
  const papat = result?.petungan?.papat
  const wolu = result?.petungan?.wolu
  const tone = RESULT_TONES[result?.name] || RESULT_TONES.Jodoh
  const total = result?.total_neptu || 0

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-8 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">Analisis Asmara · Hasil Weton Jawa</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Hasil Perhitungan Jodoh</h1>
        <p className="mt-2 text-sm text-[#8FA7B8]">Pembacaan kecocokan berdasarkan beberapa petungan tradisional, dengan hasil utama mengikuti Petungan Pitu.</p>
      </header>

      <div className="rounded-xl border border-white/[0.08] bg-[#0A1723] p-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.14)] sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/30 text-2xl text-amber-300">✦</div>
        <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72899A]">Hasil Utama · Petungan Luwiyan (Modulo 7)</div>
        <div className="mx-auto mt-4 inline-flex rounded-lg border border-amber-300/40 bg-amber-300/[0.07] px-5 py-2 text-3xl font-bold text-amber-200">{pitu?.name || '—'}</div>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#A7BAC7]">{pitu?.meaning || '—'}</p>
        <div className="mx-auto mt-6 max-w-[760px] rounded-full bg-[#162633]">
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-cyan-300/70 via-amber-300/80 to-amber-200/40" />
        </div>
        <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8EA5B5]">Sisa {pitu?.remainder ?? '—'} dari 7 · bukan skor probabilitas</div>
        <div className="mt-5 border-t border-white/[0.08] pt-5 text-left text-xs text-[#8FA7B8]">
          <span className="font-mono text-cyan-200">{people.one.neptu} + {people.two.neptu} = {total}</span>
          <span className="float-right uppercase tracking-[0.12em] text-[9px]">Total Neptu Pasangan</span>
        </div>
      </div>

      <Card title="PETUNGAN PELENGKAP — PERNIKAHAN (WOLU, MOD 8)" className="mt-5">
        <div className="grid gap-4 md:grid-cols-[0.65fr_1.35fr] md:items-center">
          <div className="text-center">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">Hasil Wolu</div>
            <div className={`mt-3 inline-flex rounded-lg border px-4 py-2 text-2xl font-bold ${tone}`}>{wolu?.name || result?.name || '—'}</div>
          </div>
          <div>
            <p className="text-sm text-[#B7C8D4]">{wolu?.meaning || result?.meaning || '—'}</p>
            <p className="mt-2 text-xs leading-5 text-[#8298A8]">Metode: total Neptu pasangan dibagi 8; sisa 0 dibaca sebagai sisa 8.</p>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <PersonSummary title="Weton Pihak Pertama" person={people.one} />
        <PersonSummary title="Weton Pihak Kedua" person={people.two} accent="text-rose-300" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SymbolCard title="Lambang — Pihak Pertama" person={people.one} />
        <SymbolCard title="Lambang — Pihak Kedua" person={people.two} feminine />
      </div>

      <Card title="☀ Analisis Petungan Pasangan" className="mt-4">
        <p className="text-xs text-[#A6B8C5]">Perhitungan dari total neptu gabungan: <strong className="text-white">{total}</strong> ({people.one.neptu} + {people.two.neptu})</p>
        <p className="mt-2 text-xs text-[#8298A8]">Tiga petungan utama ditampilkan bersama agar hasil tidak lagi mencampurkan hasil pasangan ke dalam kartu individu.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <PairPetungCard title="Petungan Pitu · Mod 7" item={pitu} />
          <PairPetungCard title="Petungan Papat · Mod 4" item={papat} tone="blue" />
          <PairPetungCard title="Petungan Wolu · Mod 8" item={wolu} tone="green" />
        </div>
      </Card>

      <Card title="☀ Tradisi Wariga Bali" className="mt-4">
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="text-center">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F8798]">Patemon · Referensi Bali</div>
            <div className="mt-3 text-xl font-bold text-amber-300">{people.one.pancaSudha || '—'}</div>
            <div className="mt-2 text-xs text-[#91A7B7]">Data Panca Sudha/Rakam tetap berasal dari engine Bali Cakra Langit.</div>
          </div>
          <div className="space-y-2 text-xs leading-5 text-[#A6B8C5]">
            <div><strong className="text-white">Total Urip/Neptu pasangan:</strong> {total}</div>
            <div><strong className="text-white">Panca Sudha pihak pertama:</strong> {people.one.pancaSudha}</div>
            <div><strong className="text-white">Panca Sudha pihak kedua:</strong> {people.two.pancaSudha}</div>
            <div><strong className="text-white">Rakam pihak pertama:</strong> {people.one.rakam}</div>
            <div><strong className="text-white">Rakam pihak kedua:</strong> {people.two.rakam}</div>
            <div><strong className="text-white">Tri Pramana:</strong> Belum tersedia pada engine Cakra Langit saat ini — tidak diisi dengan tebakan.</div>
          </div>
        </div>
      </Card>

      <Card title="● Nasihat Primbon" className="mt-4">
        <p className="text-xs leading-6 text-[#A6B8C5]"><strong className="text-white">Petungan utama:</strong> {pitu?.meaning || '—'}</p>
        <p className="mt-2 text-xs leading-6 text-[#A6B8C5]"><strong className="text-white">Petungan pernikahan:</strong> {wolu?.meaning || result?.meaning || '—'}</p>
        <p className="mt-2 text-xs italic leading-6 text-[#8FA7B8]">Hasil ini merupakan referensi petungan tradisional, bukan penentu mutlak hubungan. Sumber dan metode primbon dapat menghasilkan pembacaan yang berbeda.</p>
      </Card>

      <details className="mt-4 rounded-xl border border-white/[0.08] bg-[#0A1723]">
        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-white">▦ Detail Cara Perhitungan <span className="float-right">⌄</span></summary>
        <div className="border-t border-white/[0.08] px-5 py-4 text-xs leading-6 text-[#91A7B7]">
          <div>Neptu pihak pertama: <strong className="text-white">{people.one.neptu}</strong></div>
          <div>Neptu pihak kedua: <strong className="text-white">{people.two.neptu}</strong></div>
          <div>Total: <strong className="text-white">{total}</strong></div>
          <div className="mt-2"><strong className="text-white">Pitu:</strong> {total} modulo 7 = {pitu?.remainder}</div>
          <div><strong className="text-white">Papat:</strong> {total} modulo 4 = {papat?.remainder}</div>
          <div><strong className="text-white">Wolu:</strong> {total} modulo 8 = {wolu?.remainder}</div>
          <div className="mt-2">{result?.method}</div>
        </div>
      </details>

      <div className="mt-5 text-center">
        <button type="button" onClick={() => window.location.assign('/dashboard/weton/jodoh')} className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#10251F] hover:bg-[#E5C24A]">← &nbsp; Cek Pasangan Lainnya</button>
      </div>

      <div className="mt-12">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Jelajahi</div>
        <h2 className="mt-2 text-2xl font-semibold text-white">Fitur Lainnya</h2>
      </div>
    </section>
  )
}

export default function WetonJodohPage() {
  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') || '/' : '/'
  return path === '/dashboard/weton/jodoh/hitung' ? <JodohResultPage /> : <JodohFormPage />
}
