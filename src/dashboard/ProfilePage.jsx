import { useEffect, useMemo, useState } from 'react'
import { Check, LoaderCircle, Mail, MapPin, ShieldCheck, UserRound } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

function initials(name, email) {
  const source = (name || email || 'CL').trim()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function SectionCard({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[#081522]/95 shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
      <div className="border-b border-slate-800/80 px-5 py-4 sm:px-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400/75">{eyebrow}</div>
        <h2 className="mt-1 text-base font-semibold text-slate-100">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function InputField({ label, value, onChange, type = 'text', helper, icon: Icon }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
        {Icon ? <Icon className="h-3.5 w-3.5 text-cyan-400/70" /> : null}
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-800 bg-[#06111d] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20"
      />
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  )
}

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false)
  const [birthLocationId, setBirthLocationId] = useState('')

  const email = user?.email || '—'
  const avatar = useMemo(() => initials(displayName, email), [displayName, email])
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError('')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const [profileResponse, locationsResponse] = await Promise.all([
          fetch(`${API_BASE}/api/profile`, { headers }),
          fetch(`${API_BASE}/api/locations?limit=100`, { headers }),
        ])
        if (!profileResponse.ok) throw new Error('Profil tidak dapat dimuat.')
        const payload = await profileResponse.json()
        const locationPayload = locationsResponse.ok ? await locationsResponse.json() : []
        if (cancelled) return
        const data = payload.profile || {}
        setProfile(data)
        setDisplayName(data.display_name || user?.display_name || '')
        setBirthDate(data.birth_date || '')
        setBirthTime(data.birth_time ? data.birth_time.slice(0, 5) : '')
        setBirthTimeUnknown(Boolean(data.birth_time_unknown))
        setBirthLocationId(data.birth_location_id || '')
        setLocations(Array.isArray(locationPayload) ? locationPayload : [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Profil tidak dapat dimuat.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [token, user?.display_name])

  async function saveProfile(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          display_name: displayName || null,
          birth_date: birthDate || null,
          birth_time: birthTimeUnknown ? null : (birthTime || null),
          birth_time_unknown: birthTimeUnknown,
          birth_location_id: birthLocationId || null,
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.detail || 'Profil gagal disimpan.')
      setProfile(payload.profile)
      setMessage('Profil tersimpan. Data kelahiran ini menjadi sumber personal bersama untuk kalkulasi yang mendukungnya.')
    } catch (err) {
      setError(err.message || 'Profil gagal disimpan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
      <header className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">CAKRA LANGIT</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Profil Saya</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Satu sumber data kelahiran untuk kalkulasi personal Cakra Langit yang mendukungnya.
        </p>
      </header>

      {error ? <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-sm text-red-200">{error}</div> : null}
      {message ? <div className="mb-5 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3 text-sm text-cyan-200"><Check className="h-4 w-4" />{message}</div> : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
        <SectionCard eyebrow="ACCOUNT" title="Identitas Akun">
          <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#06111d] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">{avatar}</div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-slate-100">{displayName || 'Profil Saya'}</div>
              <div className="mt-1 truncate text-sm text-slate-400">{email}</div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <InputField label="Nama Tampilan" value={displayName} onChange={setDisplayName} icon={UserRound} />
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><Mail className="h-3.5 w-3.5 text-cyan-400/70" />Email</div>
              <div className="flex h-11 items-center rounded-xl border border-slate-800 bg-slate-900/30 px-4 text-sm text-slate-500">{email}</div>
              <p className="mt-2 text-xs text-slate-600">Email dikelola oleh autentikasi akun.</p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" />
            <div><div className="text-sm font-medium text-slate-200">Akun aktif</div><p className="mt-1 text-xs leading-5 text-slate-500">Status akun dikelola oleh sistem autentikasi Cakra Langit.</p></div>
          </div>
        </SectionCard>

        <form onSubmit={saveProfile}>
          <SectionCard eyebrow="PERSONAL CONTEXT" title="Data Kelahiran">
            {loading ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-slate-500"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Memuat profil…</div>
            ) : (
              <>
                <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.025] p-4 sm:p-5">
                  <div className="text-sm font-semibold text-slate-100">Digunakan bersama oleh kalkulasi personal</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Simpan data kelahiran sekali. Weton dan engine/converter personal lain dapat menggunakannya sebagai konteks default tanpa membuat data kelahiran terpisah di setiap halaman.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InputField label="Tanggal Lahir" type="date" value={birthDate} onChange={setBirthDate} helper="Tanggal kelahiran utama untuk kalkulasi personal." />
                  <InputField label="Waktu Lahir" type="time" value={birthTime} onChange={setBirthTime} helper="Opsional untuk engine yang membutuhkan waktu." />
                  <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-[#06111d] px-4 py-3">
                    <input type="checkbox" checked={birthTimeUnknown} onChange={(event) => setBirthTimeUnknown(event.target.checked)} className="h-4 w-4 accent-cyan-400" />
                    <span><span className="block text-sm font-medium text-slate-200">Waktu lahir tidak diketahui</span><span className="mt-1 block text-xs text-slate-500">Engine yang membutuhkan waktu harus menangani kondisi ini sesuai kontraknya.</span></span>
                  </label>
                  <label className="sm:col-span-2 block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><MapPin className="h-3.5 w-3.5 text-cyan-400/70" />Lokasi Lahir</span>
                    <select value={birthLocationId} onChange={(event) => setBirthLocationId(event.target.value)} className="h-11 w-full rounded-xl border border-slate-800 bg-[#06111d] px-4 text-sm text-slate-100 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20">
                      <option value="">Pilih lokasi lahir</option>
                      {locations.map((location) => <option key={location.id} value={location.id}>{location.city}{location.province ? ` · ${location.province}` : ''}</option>)}
                    </select>
                    <span className="mt-2 block text-xs leading-5 text-slate-500">Timezone disimpan berdasarkan lokasi yang dipilih.</span>
                  </label>
                </div>

                {profile?.birth_location ? <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 text-xs text-slate-500">Lokasi: <span className="text-slate-300">{profile.birth_location.city}</span> · Timezone: <span className="text-slate-300">{profile.birth_timezone || '—'}</span></div> : null}

                <div className="mt-6 flex justify-end">
                  <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {saving ? 'Menyimpan…' : 'Simpan Profil'}
                  </button>
                </div>
              </>
            )}
          </SectionCard>
        </form>
      </div>
    </section>
  )
}
