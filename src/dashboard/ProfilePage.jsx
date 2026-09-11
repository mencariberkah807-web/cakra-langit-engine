import { useEffect, useMemo, useState } from 'react'
import { Check, LoaderCircle, Mail, MapPin, Search, ShieldCheck, UserRound } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getIndonesiaProvinces, searchLocations } from '../services/locationService'

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
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-800 bg-[#06111d] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20" />
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  )
}

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false)
  const [birthLocationId, setBirthLocationId] = useState('')
  const [birthLocation, setBirthLocation] = useState(null)
  const [locationOpen, setLocationOpen] = useState(false)
  const [cityQuery, setCityQuery] = useState('')
  const [provinceQuery, setProvinceQuery] = useState('')
  const [provinces, setProvinces] = useState([])
  const [provinceOpen, setProvinceOpen] = useState(false)
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(false)

  const email = user?.email || '—'
  const avatar = useMemo(() => initials(displayName, email), [displayName, email])
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true); setError('')
        const response = await fetch(`${API_BASE}/api/profile`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!response.ok) throw new Error('Profil tidak dapat dimuat.')
        const payload = await response.json()
        if (cancelled) return
        const data = payload.profile || {}
        setProfile(data)
        setDisplayName(data.display_name || user?.display_name || '')
        setBirthDate(data.birth_date || '')
        setBirthTime(data.birth_time ? data.birth_time.slice(0, 5) : '')
        setBirthTimeUnknown(Boolean(data.birth_time_unknown))
        setBirthLocationId(data.birth_location_id || '')
        setBirthLocation(data.birth_location || null)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Profil tidak dapat dimuat.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token, user?.display_name])

  useEffect(() => {
    if (!locationOpen || provinces.length > 0) return
    let cancelled = false
    getIndonesiaProvinces().then((items) => { if (!cancelled) setProvinces(items) })
    return () => { cancelled = true }
  }, [locationOpen, provinces.length])

  useEffect(() => {
    const city = cityQuery.trim(); const province = provinceQuery.trim()
    if (!city) { setResults([]); setSearching(false); setSearchError(false); return }
    let cancelled = false
    const timer = setTimeout(() => {
      setSearching(true); setSearchError(false)
      searchLocations(city, province, 20).then((items) => { if (!cancelled) setResults(items) }).catch(() => { if (!cancelled) { setResults([]); setSearchError(true) } }).finally(() => { if (!cancelled) setSearching(false) })
    }, 300)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [cityQuery, provinceQuery])

  function openLocationPicker() {
    setCityQuery(''); setProvinceQuery(''); setProvinceOpen(false); setResults([]); setSearchError(false); setLocationOpen(true)
  }

  function selectProvince(province) {
    setProvinceQuery(province.city); setProvinceOpen(false)
  }

  function selectLocation(location) {
    setBirthLocationId(location.id)
    setBirthLocation(location)
    setLocationOpen(false)
    setCityQuery(''); setProvinceQuery(''); setProvinceOpen(false); setResults([]); setSearchError(false)
  }

  async function saveProfile(event) {
    event.preventDefault(); setSaving(true); setMessage(''); setError('')
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ display_name: displayName || null, birth_date: birthDate || null, birth_time: birthTimeUnknown ? null : (birthTime || null), birth_time_unknown: birthTimeUnknown, birth_location_id: birthLocationId || null }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.detail || 'Profil gagal disimpan.')
      setProfile(payload.profile); setBirthLocation(payload.profile?.birth_location || birthLocation); setMessage('Profil tersimpan. Data kelahiran ini menjadi sumber personal bersama untuk kalkulasi yang mendukungnya.')
    } catch (err) { setError(err.message || 'Profil gagal disimpan.') } finally { setSaving(false) }
  }

  const selectedLocationLabel = birthLocation ? [birthLocation.city, birthLocation.province, birthLocation.country].filter(Boolean).join(', ') : ''

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
      <header className="mb-6"><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">CAKRA LANGIT</div><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Profil Saya</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Satu sumber data kelahiran untuk kalkulasi personal Cakra Langit yang mendukungnya.</p></header>
      {error ? <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-sm text-red-200">{error}</div> : null}
      {message ? <div className="mb-5 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3 text-sm text-cyan-200"><Check className="h-4 w-4" />{message}</div> : null}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
        <SectionCard eyebrow="ACCOUNT" title="Identitas Akun">
          <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#06111d] p-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">{avatar}</div><div className="min-w-0"><div className="truncate text-base font-semibold text-slate-100">{displayName || 'Profil Saya'}</div><div className="mt-1 truncate text-sm text-slate-400">{email}</div></div></div>
          <div className="mt-5 space-y-4"><InputField label="Nama Tampilan" value={displayName} onChange={setDisplayName} icon={UserRound} /><div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><Mail className="h-3.5 w-3.5 text-cyan-400/70" />Email</div><div className="flex h-11 items-center rounded-xl border border-slate-800 bg-slate-900/30 px-4 text-sm text-slate-500">{email}</div><p className="mt-2 text-xs text-slate-600">Email dikelola oleh autentikasi akun.</p></div></div>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" /><div><div className="text-sm font-medium text-slate-200">Akun aktif</div><p className="mt-1 text-xs leading-5 text-slate-500">Status akun dikelola oleh sistem autentikasi Cakra Langit.</p></div></div>
        </SectionCard>
        <form onSubmit={saveProfile}>
          <SectionCard eyebrow="PERSONAL CONTEXT" title="Data Kelahiran">
            {loading ? <div className="flex min-h-48 items-center justify-center text-sm text-slate-500"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Memuat profil…</div> : <>
              <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.025] p-4 sm:p-5"><div className="text-sm font-semibold text-slate-100">Digunakan bersama oleh kalkulasi personal</div><p className="mt-2 text-sm leading-6 text-slate-400">Simpan data kelahiran sekali. Weton dan engine/converter personal lain dapat menggunakannya sebagai konteks default tanpa membuat data kelahiran terpisah di setiap halaman.</p></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InputField label="Tanggal Lahir" type="date" value={birthDate} onChange={setBirthDate} helper="Tanggal kelahiran utama untuk kalkulasi personal." />
                <InputField label="Waktu Lahir" type="time" value={birthTime} onChange={setBirthTime} helper="Opsional untuk engine yang membutuhkan waktu." />
                <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-[#06111d] px-4 py-3"><input type="checkbox" checked={birthTimeUnknown} onChange={(event) => setBirthTimeUnknown(event.target.checked)} className="h-4 w-4 accent-cyan-400" /><span><span className="block text-sm font-medium text-slate-200">Waktu lahir tidak diketahui</span><span className="mt-1 block text-xs text-slate-500">Engine yang membutuhkan waktu harus menangani kondisi ini sesuai kontraknya.</span></span></label>
                <div className="sm:col-span-2">
                  <span className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><MapPin className="h-3.5 w-3.5 text-cyan-400/70" />Lokasi Lahir</span>
                  <button type="button" onClick={openLocationPicker} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-800 bg-[#06111d] px-4 text-left text-sm text-slate-100 outline-none transition hover:border-cyan-400/50 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20"><span className={selectedLocationLabel ? 'truncate text-slate-100' : 'truncate text-slate-500'}>{selectedLocationLabel || 'Pilih lokasi lahir'}</span><MapPin className="ml-2 h-4 w-4 shrink-0 text-cyan-400/70" /></button>
                  <span className="mt-2 block text-xs leading-5 text-slate-500">Timezone disimpan berdasarkan lokasi yang dipilih.</span>
                </div>
              </div>
              {profile?.birth_location ? <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 text-xs text-slate-500">Lokasi: <span className="text-slate-300">{profile.birth_location.city}</span> · Timezone: <span className="text-slate-300">{profile.birth_timezone || '—'}</span></div> : null}
              <div className="mt-6 flex justify-end"><button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saving ? 'Menyimpan…' : 'Simpan Profil'}</button></div>
            </>}
          </SectionCard>
        </form>
      </div>
      <Dialog open={locationOpen} onOpenChange={setLocationOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-xl border-white/[0.10] bg-[#0B1825] text-white">
          <DialogHeader><DialogTitle className="text-white">Change Location</DialogTitle><DialogDescription className="text-[#8FA4B8]">Select a city and province in Indonesia.</DialogDescription></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative"><label htmlFor="birth-location-city-input" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">City</label><Search className="absolute left-3 top-[2.35rem] h-4 w-4 -translate-y-1/2 text-[#71869A]" /><input autoFocus id="birth-location-city-input" value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Bandung" className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] pl-10 pr-3 text-sm text-white placeholder:text-[#536A7D] outline-none transition focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10" /></div>
            <div className="relative"><label htmlFor="birth-location-province-input" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">Province</label><input id="birth-location-province-input" value={provinceQuery} onFocus={() => setProvinceOpen(true)} onChange={(event) => { setProvinceQuery(event.target.value); setProvinceOpen(true) }} placeholder="Jawa Barat" className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white placeholder:text-[#536A7D] outline-none transition focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10" />{provinceOpen && provinces.length > 0 ? <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-white/[0.10] bg-[#0B1825] py-1 shadow-2xl">{provinces.filter((province) => province.city.toLowerCase().includes(provinceQuery.trim().toLowerCase())).map((province) => <button key={province.id} type="button" onClick={() => selectProvince(province)} className="w-full px-3 py-2 text-left text-sm text-[#D8E3EC] transition-colors hover:bg-white/[0.06]">{province.city}</button>)}</div> : null}</div>
          </div>
          <div className="max-h-[420px] overflow-y-auto rounded-xl border border-white/[0.10]">
            {!cityQuery.trim() && <div className="px-4 py-8 text-center text-sm text-[#71869A]">Type a city name to search locations.</div>}
            {cityQuery.trim() && searching && <div className="px-4 py-8 text-center text-sm text-[#71869A]">Searching locations...</div>}
            {cityQuery.trim() && !searching && searchError && <div className="px-4 py-8 text-center text-sm text-[#71869A]">Unable to search locations.</div>}
            {cityQuery.trim() && !searching && !searchError && results.length === 0 && <div className="px-4 py-8 text-center text-sm text-[#71869A]">No locations found.</div>}
            {!searching && !searchError && results.map((location) => <button key={location.id} type="button" onClick={() => selectLocation(location)} className="flex w-full items-start gap-3 border-b border-white/[0.06] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.05]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#71869A]" strokeWidth={1.8} /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#D8E3EC]">{location.city}</span><span className="mt-0.5 block truncate text-xs text-[#8FA4B8]">{[location.province, location.country].filter(Boolean).join(' — ')}</span><span className="mt-0.5 block text-[11px] text-[#536A7D]">{location.timezone}</span></span></button>)}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
