import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

const RESULT_TONES = {
  Pegat: 'border-[#603B3D] bg-[#24151A] text-[#DFA7AA]',
  Ratu: 'border-[#5A4A24] bg-[#1C1B14] text-[#E6D58B]',
  Jodoh: 'border-[#28546A] bg-[#09212D] text-[#8DD6ED]',
  Topo: 'border-[#5A4A24] bg-[#1C1B14] text-[#E6D58B]',
  Tinari: 'border-[#28546A] bg-[#09212D] text-[#8DD6ED]',
  Padu: 'border-[#603B3D] bg-[#24151A] text-[#DFA7AA]',
  Sujanan: 'border-[#603B3D] bg-[#24151A] text-[#DFA7AA]',
  Pesthi: 'border-[#28546A] bg-[#09212D] text-[#8DD6ED]',
}

function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-[#21425A] bg-[linear-gradient(135deg,rgba(10,28,42,0.98),rgba(5,15,24,0.98))] p-5 ${className}`}>{children}</div>
}

function Field({ label, value, onChange, placeholder = 'DD/MM/YYYY' }) {
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
        className="mt-2 w-full rounded-xl border border-[#28506A] bg-[#071925] px-4 py-3 text-sm text-[#D8F3FF] outline-none transition placeholder:text-[#496579] focus:border-[#4D8FB0]"
      />
      <div className="mt-1 text-[9px] text-[#587388]">Masukkan tanggal hari/bulan/tahun.</div>
    </div>
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

async function getPartnerData(dateValue, profile) {
  const locationQuery = profile?.birth_location_id
    ? `location_id=${encodeURIComponent(profile.birth_location_id)}`
    : `city=${encodeURIComponent(profile?.birth_location?.city || 'Bandung')}`
  const response = await fetch(`${API_BASE}/api/almanac?${locationQuery}&date_value=${encodeURIComponent(dateValue)}`)
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.detail || 'Data kalender pasangan tidak dapat diambil.')
  }
  const almanac = await response.json()
  const jawa = almanac?.calendars?.find((calendar) => calendar.id === 'jawa') || null
  const detail = jawa?.detail || {}
  const neptu = Number(detail.neptu_total)
  if (!Number.isFinite(neptu) || neptu <= 0) throw new Error('Neptu pasangan belum tersedia dari engine Jawa.')
  return {
    weton: jawa?.sub || `${detail?.dino?.name || ''} ${detail?.pasaran?.name || ''}`.trim(),
    dino: detail?.dino?.name || '—',
    pasaran: detail?.pasaran?.name || '—',
    neptu,
  }
}

function JodohFormPage() {
  const [profile, setProfile] = useState(null)
  const [partnerDate, setPartnerDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile().then(setProfile).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [])

  const profileDate = profile?.birth_date
  const submit = (event) => {
    event.preventDefault()
    const iso = toIsoDate(partnerDate)
    if (!iso) {
      setError('Tanggal pasangan harus valid dengan format DD/MM/YYYY.')
      return
    }
    window.location.assign(`/dashboard/weton/jodoh/hitung?date=${encodeURIComponent(iso)}`)
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7 text-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D4B75E]">Analisis Asmara · Weton Jawa</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#D8F3FF] sm:text-4xl">Kecocokan Jodoh</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#8FAEC1]">Hitung kecocokan berdasarkan Weton profil dan tanggal lahir pasangan.</p>
      </header>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#78A9C7]">Weton Profil</div>
            <div className="mt-3 text-xl font-semibold text-[#EDF9FF]">{profile?.display_name || 'Profil Saya'}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#173044] bg-[#071925] p-3"><div className="text-[8px] uppercase tracking-[0.12em] text-[#527184]">Tanggal lahir</div><div className="mt-1 text-xs font-semibold text-[#BFD8E7]">{formatDate(profileDate)}</div></div>
              <div className="rounded-xl border border-[#173044] bg-[#071925] p-3"><div className="text-[8px] uppercase tracking-[0.12em] text-[#527184]">Lokasi</div><div className="mt-1 text-xs font-semibold text-[#BFD8E7]">{profile?.birth_location?.city || '—'}</div></div>
            </div>
          </Card>
          <Card>
            <Field label="Tanggal lahir pasangan" value={partnerDate} onChange={setPartnerDate} />
          </Card>
        </div>

        {error ? <div className="rounded-xl border border-[#603B3D] bg-[#24151A] px-4 py-3 text-xs leading-5 text-[#DFA7AA]">{error}</div> : null}
        <button type="submit" disabled={loading} className="w-full rounded-xl border border-[#C59E32] bg-[#B99124] px-4 py-3 text-sm font-bold text-[#071925] transition hover:bg-[#D0A82E] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Memuat profil…' : 'Analisis Kecocokan Jodoh'}</button>
      </form>
    </section>
  )
}

function JodohResultPage() {
  const [profile, setProfile] = useState(null)
  const [partner, setPartner] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dateValue = new URLSearchParams(window.location.search).get('date')
    if (!dateValue) {
      setError('Tanggal pasangan belum dipilih.')
      setLoading(false)
      return
    }
    Promise.all([getProfile(), Promise.resolve(dateValue)])
      .then(async ([nextProfile, date]) => {
        setProfile(nextProfile)
        const jawa = await getPartnerData(date, nextProfile)
        setPartner(jawa)
        const mainTotal = Number(nextProfile?.weton_neptu_total)
        const profileResponse = await fetch(`${API_BASE}/api/almanac?${nextProfile?.birth_location_id ? `location_id=${encodeURIComponent(nextProfile.birth_location_id)}` : `city=${encodeURIComponent(nextProfile?.birth_location?.city || 'Bandung')}`}&date_value=${encodeURIComponent(nextProfile?.birth_date || '')}`)
        if (!profileResponse.ok) throw new Error('Weton profil tidak dapat dihitung ulang.')
        const profileAlmanac = await profileResponse.json()
        const profileJawa = profileAlmanac?.calendars?.find((calendar) => calendar.id === 'jawa') || null
        const profileTotal = Number(profileJawa?.detail?.neptu_total ?? mainTotal)
        if (!Number.isFinite(profileTotal) || profileTotal <= 0) throw new Error('Neptu profil belum tersedia dari engine Jawa.')
        const response = await fetch(`${API_BASE}/api/weton/jodoh?neptu_one=${encodeURIComponent(profileTotal)}&neptu_two=${encodeURIComponent(jawa.neptu)}`)
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.detail || 'Perhitungan jodoh tidak dapat diproses.')
        }
        setResult(await response.json())
      })
      .catch((err) => setError(err?.message || 'Perhitungan jodoh gagal diproses.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <section className="mx-auto max-w-[1180px] px-5 py-16 text-center text-sm text-[#7896A8]">Menghitung kecocokan jodoh…</section>
  if (error) return <section className="mx-auto max-w-[900px] px-5 py-16"><div className="rounded-2xl border border-[#603B3D] bg-[#24151A] p-6 text-sm text-[#DFA7AA]">{error}</div></section>

  const tone = RESULT_TONES[result?.name] || RESULT_TONES.Topo
  const profileWeton = profile?.weton || 'Weton profil'

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7 text-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D4B75E]">Analisis Asmara · Hasil</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#D8F3FF] sm:text-4xl">Hasil Kecocokan Jodoh</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#8FAEC1]">Petungan pasangan berdasarkan total Neptu Weton kedua pihak.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#78A9C7]">Weton Profil</div>
          <div className="mt-3 text-xl font-semibold text-[#EDF9FF]">{profileWeton}</div>
          <div className="mt-1 text-xs text-[#7896A8]">Neptu {result?.neptu_one}</div>
        </Card>
        <Card>
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#78A9C7]">Weton Pasangan</div>
          <div className="mt-3 text-xl font-semibold text-[#EDF9FF]">{partner?.weton}</div>
          <div className="mt-1 text-xs text-[#7896A8]">{partner?.dino} · {partner?.pasaran} · Neptu {result?.neptu_two}</div>
        </Card>
      </div>

      <Card className={`mt-5 ${tone}`}>
        <div className="flex flex-col items-center text-center">
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-75">Hasil Utama · Petungan Wolu</div>
          <div className="mt-3 text-4xl font-semibold">{result?.name}</div>
          <div className="mt-2 max-w-2xl text-sm leading-6 opacity-90">{result?.meaning}</div>
          <div className="mt-5 rounded-full border border-current/30 px-4 py-1.5 text-xs font-bold">Sisa {result?.remainder}</div>
        </div>
        <div className="mt-5 border-t border-current/20 pt-4 font-mono text-[11px] opacity-75">{result?.neptu_one} + {result?.neptu_two} = {result?.total_neptu} · modulo 8</div>
        <div className="mt-2 text-[10px] leading-4 opacity-65">{result?.method}</div>
      </Card>

      <div className="mt-5 rounded-2xl border border-[#173044] bg-[#071925] p-5 text-xs leading-6 text-[#7896A8]">
        <div className="font-semibold text-[#B9D2E2]">Catatan</div>
        <p className="mt-1">Hasil ini merupakan referensi petungan tradisional, bukan penentu mutlak hubungan. Variasi metode dan sumber dapat menghasilkan pembacaan berbeda.</p>
      </div>

      <div className="mt-6 text-center">
        <a href="/dashboard/weton/jodoh" className="inline-flex rounded-xl border border-[#C59E32] bg-[#B99124] px-5 py-2.5 text-xs font-bold text-[#071925] transition hover:bg-[#D0A82E]">Cek Pasangan Lainnya</a>
      </div>
    </section>
  )
}

export default function WetonJodohPage() {
  return window.location.pathname === '/dashboard/weton/jodoh/hitung' ? <JodohResultPage /> : <JodohFormPage />
}
