import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

const RESULT_TONES = {
  Pegat: 'border-[#603B3D] bg-[radial-gradient(circle_at_top,rgba(180,75,85,0.12),transparent_55%),linear-gradient(135deg,rgba(36,21,26,0.98),rgba(10,17,23,0.98))] text-[#DFA7AA]',
  Ratu: 'border-[#5A4A24] bg-[radial-gradient(circle_at_top,rgba(212,183,94,0.14),transparent_55%),linear-gradient(135deg,rgba(28,27,20,0.98),rgba(10,17,22,0.98))] text-[#E6D58B]',
  Jodoh: 'border-[#28546A] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%),linear-gradient(135deg,rgba(9,33,45,0.98),rgba(5,16,25,0.98))] text-[#8DD6ED]',
  Topo: 'border-[#5A4A24] bg-[radial-gradient(circle_at_top,rgba(212,183,94,0.11),transparent_55%),linear-gradient(135deg,rgba(28,27,20,0.98),rgba(10,17,22,0.98))] text-[#E6D58B]',
  Tinari: 'border-[#28546A] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%),linear-gradient(135deg,rgba(9,33,45,0.98),rgba(5,16,25,0.98))] text-[#8DD6ED]',
  Padu: 'border-[#603B3D] bg-[radial-gradient(circle_at_top,rgba(180,75,85,0.12),transparent_55%),linear-gradient(135deg,rgba(36,21,26,0.98),rgba(10,17,23,0.98))] text-[#DFA7AA]',
  Sujanan: 'border-[#603B3D] bg-[radial-gradient(circle_at_top,rgba(180,75,85,0.12),transparent_55%),linear-gradient(135deg,rgba(36,21,26,0.98),rgba(10,17,23,0.98))] text-[#DFA7AA]',
  Pesthi: 'border-[#28546A] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%),linear-gradient(135deg,rgba(9,33,45,0.98),rgba(5,16,25,0.98))] text-[#8DD6ED]',
}

function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-[#21425A] bg-[linear-gradient(135deg,rgba(10,28,42,0.98),rgba(5,15,24,0.98))] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.12)] ${className}`}>{children}</div>
}

function Field({ label, value, onChange, placeholder = 'DD/MM/YYYY', disabled = false }) {
  return (
    <div>
      <label className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E8195]">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="bday"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9/]/g, '').slice(0, 10))}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-2 w-full rounded-xl border border-[#28506A] bg-[#071925] px-4 py-3 text-sm text-[#D8F3FF] outline-none transition placeholder:text-[#496579] focus:border-[#4D8FB0] disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="mt-1 text-[9px] text-[#587388]">Masukkan tanggal hari/bulan/tahun.</div>
    </div>
  )
}

function ProfileCheckbox({ checked, onChange }) {
  return (
    <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-[#9CB8C8]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded border-[#28506A] bg-[#071925] accent-[#D4B75E]" />
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
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

async function getProfile() {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null
  const response = await fetch(`${API_BASE}/api/profile`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!response.ok) throw new Error('Profil kelahiran belum dapat dimuat.')
  const payload = await response.json()
  return payload?.profile || null
}

async function getJawaData(dateValue, profile = null) {
  const locationQuery = profile?.birth_location_id ? `location_id=${encodeURIComponent(profile.birth_location_id)}` : `city=${encodeURIComponent(profile?.birth_location?.city || 'Bandung')}`
  const response = await fetch(`${API_BASE}/api/almanac?${locationQuery}&date_value=${encodeURIComponent(dateValue)}`)
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.detail || 'Data kalender Jawa tidak dapat diambil.')
  }
  const almanac = await response.json()
  const jawa = almanac?.calendars?.find((calendar) => calendar.id === 'jawa') || null
  const detail = jawa?.detail || {}
  const neptu = Number(detail.neptu_total)
  if (!Number.isFinite(neptu) || neptu <= 0) throw new Error('Neptu Weton belum tersedia dari engine Jawa.')
  return {
    date: dateValue,
    weton: jawa?.sub || `${detail?.dino?.name || ''} ${detail?.pasaran?.name || ''}`.trim(),
    dino: detail?.dino?.name || '—',
    pasaran: detail?.pasaran?.name || '—',
    dinoNeptu: Number(detail?.dino?.neptu) || null,
    pasaranNeptu: Number(detail?.pasaran?.neptu) || null,
    neptu,
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
    }).catch((err) => {
      setUseProfileOne(false)
      setError(err.message)
    }).finally(() => setLoading(false))
  }, [])

  const submit = (event) => {
    event.preventDefault()
    setError('')
    const resolvedOne = useProfileOne ? profile?.birth_date : toIsoDate(dateOne)
    const resolvedTwo = useProfileTwo ? profile?.birth_date : toIsoDate(dateTwo)
    if (!resolvedOne) return setError('Tanggal orang pertama harus valid dengan format DD/MM/YYYY.')
    if (!resolvedTwo) return setError('Tanggal orang kedua harus valid dengan format DD/MM/YYYY.')
    const params = new URLSearchParams({ date_one: resolvedOne, date_two: resolvedTwo })
    window.location.assign(`/dashboard/weton/jodoh/hitung?${params.toString()}`)
  }

  const profileLabel = profile?.display_name || 'Profil Saya'

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7 text-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D4B75E]">Analisis Asmara · Weton Jawa</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#D8F3FF] sm:text-4xl">Kecocokan Jodoh</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#8FAEC1]">Hitung kecocokan siapa saja berdasarkan tanggal lahir dan Weton kedua pihak.</p>
      </header>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#78A9C7]">Orang Pertama</div>
            <div className="mt-3 text-xl font-semibold text-[#EDF9FF]">{useProfileOne ? profileLabel : 'Data Kelahiran'}</div>
            <div className="mt-3"><Field label="Tanggal lahir" value={useProfileOne && profile?.birth_date ? profile.birth_date.split('-').reverse().join('/') : dateOne} onChange={setDateOne} disabled={useProfileOne} /><ProfileCheckbox checked={useProfileOne} onChange={setUseProfileOne} /></div>
            {useProfileOne ? <div className="mt-2 text-[9px] text-[#587388]">Menggunakan tanggal lahir dari profil.</div> : null}
          </Card>
          <Card>
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#78A9C7]">Orang Kedua</div>
            <div className="mt-3 text-xl font-semibold text-[#EDF9FF]">{useProfileTwo ? profileLabel : 'Data Kelahiran'}</div>
            <div className="mt-3"><Field label="Tanggal lahir" value={dateTwo} onChange={setDateTwo} disabled={useProfileTwo} /><ProfileCheckbox checked={useProfileTwo} onChange={setUseProfileTwo} /></div>
            {useProfileTwo ? <div className="mt-2 text-[9px] text-[#587388]">Menggunakan tanggal lahir dari profil.</div> : null}
          </Card>
        </div>
        {error ? <div className="rounded-xl border border-[#603B3D] bg-[#24151A] px-4 py-3 text-xs leading-5 text-[#DFA7AA]">{error}</div> : null}
        <button type="submit" disabled={loading} className="w-full rounded-xl border border-[#C59E32] bg-[#B99124] px-4 py-3 text-sm font-bold text-[#071925] transition hover:bg-[#D0A82E] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Memuat profil…' : 'Analisis Kecocokan Jodoh'}</button>
      </form>
    </section>
  )
}

function PersonCard({ label, person }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-400/5 blur-2xl" />
      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5E8195]">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-[#EDF9FF]">{person?.weton || '—'}</div>
      <div className="mt-1 text-xs text-[#7896A8]">{formatDate(person?.date)}</div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[#173B50] bg-[#071925] p-3"><div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#527184]">Dina</div><div className="mt-1 text-sm font-semibold text-[#BFD8E7]">{person?.dino || '—'}</div><div className="mt-1 text-[10px] text-[#7896A8]">Neptu {person?.dinoNeptu ?? '—'}</div></div>
        <div className="rounded-xl border border-[#173B50] bg-[#071925] p-3"><div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#527184]">Pasaran</div><div className="mt-1 text-sm font-semibold text-[#BFD8E7]">{person?.pasaran || '—'}</div><div className="mt-1 text-[10px] text-[#7896A8]">Neptu {person?.pasaranNeptu ?? '—'}</div></div>
        <div className="rounded-xl border border-[#28546A] bg-[#09212D] p-3"><div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#5E8195]">Neptu</div><div className="mt-1 text-xl font-semibold text-[#8DD6ED]">{person?.neptu ?? '—'}</div><div className="mt-1 text-[10px] text-[#7896A8]">Total</div></div>
      </div>
    </Card>
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
      const [one, two] = await Promise.all([getJawaData(dateOne, profile), getJawaData(dateTwo, profile)])
      setPeople({ one, two })
      const response = await fetch(`${API_BASE}/api/weton/jodoh?neptu_one=${encodeURIComponent(one.neptu)}&neptu_two=${encodeURIComponent(two.neptu)}`)
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.detail || 'Perhitungan jodoh tidak dapat diproses.')
      }
      setResult(await response.json())
    }).catch((err) => setError(err?.message || 'Perhitungan jodoh gagal diproses.')).finally(() => setLoading(false))
  }, [])

  if (loading) return <section className="mx-auto max-w-[1180px] px-5 py-16 text-center text-sm text-[#7896A8]">Menghitung kecocokan jodoh…</section>
  if (error) return <section className="mx-auto max-w-[900px] px-5 py-16"><div className="rounded-2xl border border-[#603B3D] bg-[#24151A] p-6 text-sm text-[#DFA7AA]">{error}</div></section>

  const tone = RESULT_TONES[result?.name] || RESULT_TONES.Topo

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-7 sm:px-7 lg:px-8 lg:py-9">
      <header className="mb-8 text-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#D4B75E]">Analisis Asmara · Hasil Weton Jawa</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#D8F3FF] sm:text-4xl">Hasil Kecocokan Jodoh</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#8FAEC1]">Pembacaan kecocokan berdasarkan pertemuan Neptu Weton kedua pihak.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2"><PersonCard label="Orang Pertama" person={people.one} /><PersonCard label="Orang Kedua" person={people.two} /></div>

      <Card className={`mt-5 overflow-hidden p-0 ${tone}`}>
        <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="text-[9px] font-bold uppercase tracking-[0.24em] opacity-75">Hasil Utama · Petungan Wolu</div>
          <div className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">{result?.name}</div>
          <div className="mx-auto mt-3 max-w-2xl text-sm leading-7 opacity-90">{result?.meaning}</div>
          <div className="mt-5 inline-flex rounded-full border border-current/30 bg-black/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]">Sisa {result?.remainder}</div>
        </div>
        <div className="border-t border-current/15 bg-black/10 px-6 py-4 sm:px-10"><div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"><div className="font-mono text-xs opacity-80">{result?.neptu_one} + {result?.neptu_two} = {result?.total_neptu}</div><div className="text-[10px] uppercase tracking-[0.12em] opacity-65">Total Neptu pasangan · Modulo 8</div></div></div>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4B75E]">01 · Perhitungan</div>
          <h2 className="mt-2 text-xl font-semibold text-[#D8F3FF]">Cara Hasil Diperoleh</h2>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#173B50] bg-[#071925] px-4 py-3"><span className="text-xs text-[#7896A8]">Neptu Orang Pertama</span><span className="font-mono text-sm font-semibold text-[#BFD8E7]">{result?.neptu_one}</span></div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#173B50] bg-[#071925] px-4 py-3"><span className="text-xs text-[#7896A8]">Neptu Orang Kedua</span><span className="font-mono text-sm font-semibold text-[#BFD8E7]">{result?.neptu_two}</span></div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#28546A] bg-[#09212D] px-4 py-3"><span className="text-xs font-semibold text-[#8FAEC1]">Total Neptu</span><span className="font-mono text-base font-semibold text-[#8DD6ED]">{result?.total_neptu}</span></div>
            <div className="rounded-xl border border-[#5A4A24] bg-[#15160F] px-4 py-3"><div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#A99362]">Rumus</div><div className="mt-2 font-mono text-sm text-[#D4B75E]">{result?.total_neptu} ÷ 8 → sisa {result?.remainder}</div></div>
          </div>
        </Card>

        <Card>
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#78A9C7]">02 · Referensi</div>
          <h2 className="mt-2 text-xl font-semibold text-[#D8F3FF]">Metode Petungan</h2>
          <p className="mt-4 text-sm leading-7 text-[#8FAEC1]">{result?.method}</p>
          <div className="mt-5 rounded-xl border border-[#173044] bg-[#071925] p-4"><div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#5E8195]">Status</div><div className="mt-2 inline-flex rounded-full border border-[#28546A] bg-[#09212D] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8DD6ED]">{result?.status || 'TRADITIONAL_REFERENCE'}</div></div>
        </Card>
      </div>

      <Card className="mt-5">
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4B75E]">03 · Pembacaan</div>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div><h2 className="text-xl font-semibold text-[#D8F3FF]">Makna {result?.name}</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-[#A9C0CF]">{result?.meaning}</p></div>
          <div className={`shrink-0 rounded-xl border px-4 py-3 ${tone}`}><div className="text-[8px] font-bold uppercase tracking-[0.14em] opacity-70">Hasil</div><div className="mt-1 text-lg font-semibold">{result?.name}</div></div>
        </div>
      </Card>

      <Card className="mt-5 border-[#1A3448] bg-[linear-gradient(135deg,rgba(9,24,36,0.98),rgba(5,15,24,0.98))]">
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5E8195]">04 · Catatan</div>
        <p className="mt-3 text-xs leading-6 text-[#7896A8]">Hasil ini merupakan referensi petungan tradisional, bukan penentu mutlak hubungan. Variasi metode dan sumber primbon dapat menghasilkan pembacaan yang berbeda. Keputusan hubungan tetap berada pada kedua pihak.</p>
      </Card>

      <div className="mt-6 flex justify-center"><button type="button" onClick={() => { window.location.href = '/dashboard/weton/jodoh' }} className="rounded-xl border border-[#C59E32] bg-[#B99124] px-6 py-3 text-xs font-bold text-[#071925] transition hover:bg-[#D0A82E]">Cek Pasangan Lainnya</button></div>
    </section>
  )
}

export default function WetonJodohPage() {
  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') || '/' : '/'
  return path === '/dashboard/weton/jodoh/hitung' ? <JodohResultPage /> : <JodohFormPage />
}
