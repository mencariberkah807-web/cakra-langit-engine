import { useEffect, useMemo, useState } from 'react'
import { Check, Edit3, LoaderCircle, Mail, MapPin, Search, ShieldCheck, UserRound, X } from 'lucide-react'
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

function SectionCard({ eyebrow, title, children, action }) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[#081522]/95 shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-4 sm:px-6">
        <div><div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400/75">{eyebrow}</div><h2 className="mt-1 text-base font-semibold text-slate-100">{title}</h2></div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function DataRow({ label, value, icon: Icon }) {
  return <div className="flex items-start gap-3 border-b border-slate-800/70 py-4 last:border-b-0"><div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-[#06111d]"><Icon className="h-4 w-4 text-cyan-400/70" /></div><div className="min-w-0"><div className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">{label}</div><div className="mt-1 break-words text-sm font-medium text-slate-200">{value || 'Belum diatur'}</div></div></div>
}

function InputField({ label, value, onChange, type = 'text', helper }) {
  return <label className="block"><span className="mb-2 block text-xs font-medium text-slate-400">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-800 bg-[#06111d] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20" />{helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}</label>
}

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [displayName, setDisplayName] = useState('')
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
  const avatar = useMemo(() => initials(displayName || user?.display_name, email), [displayName, user?.display_name, email])
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true); setError('')
        const response = await fetch(`${API_BASE}/api/profile`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!response.ok) throw new Error('Profil tidak dapat dimuat.')
        const payload = await response.json(); if (cancelled) return
        const data = payload.profile || {}
        setProfile(data); setDisplayName(data.display_name || user?.display_name || ''); setBirthDate(data.birth_date || '')
        setBirthTime(data.birth_time ? data.birth_time.slice(0, 5) : ''); setBirthTimeUnknown(Boolean(data.birth_time_unknown)); setBirthLocationId(data.birth_location_id || ''); setBirthLocation(data.birth_location || null)
      } catch (err) { if (!cancelled) setError(err.message || 'Profil tidak dapat dimuat.') } finally { if (!cancelled) setLoading(false) }
    }
    load(); return () => { cancelled = true }
  }, [token, user?.display_name])

  useEffect(() => {
    if (!locationOpen || provinces.length > 0) return
    let cancelled = false; getIndonesiaProvinces().then((items) => { if (!cancelled) setProvinces(items) }); return () => { cancelled = true }
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

  function startEditing() {
    setMessage(''); setError(''); setEditing(true)
  }
  function cancelEditing() {
    if (profile) { setDisplayName(profile.display_name || user?.display_name || ''); setBirthDate(profile.birth_date || ''); setBirthTime(profile.birth_time ? profile.birth_time.slice(0, 5) : ''); setBirthTimeUnknown(Boolean(profile.birth_time_unknown)); setBirthLocationId(profile.birth_location_id || ''); setBirthLocation(profile.birth_location || null) }
    setEditing(false); setMessage(''); setError('')
  }
  function openLocationPicker() { setCityQuery(''); setProvinceQuery(''); setProvinceOpen(false); setResults([]); setSearchError(false); setLocationOpen(true) }
  function selectProvince(province) { setProvinceQuery(province.city); setProvinceOpen(false) }
  function selectLocation(location) { setBirthLocationId(location.id); setBirthLocation(location); setLocationOpen(false); setCityQuery(''); setProvinceQuery(''); setProvinceOpen(false); setResults([]); setSearchError(false) }

  async function saveProfile(event) {
    event.preventDefault(); setSaving(true); setMessage(''); setError('')
    try {
      const response = await fetch(`${API_BASE}/api/profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ display_name: displayName || null, birth_date: birthDate || null, birth_time: birthTimeUnknown ? null : (birthTime || null), birth_time_unknown: birthTimeUnknown, birth_location_id: birthLocationId || null }) })
      const payload = await response.json().catch(() => null); if (!response.ok) throw new Error(payload?.detail || 'Profil gagal disimpan.')
      setProfile(payload.profile); setBirthLocation(payload.profile?.birth_location || birthLocation); setMessage('Profil tersimpan.'); setEditing(false)
    } catch (err) { setError(err.message || 'Profil gagal disimpan.') } finally { setSaving(false) }
  }

  const name = profile?.display_name || displayName || user?.display_name || 'Profil Saya'
  const selectedLocationLabel = birthLocation ? [birthLocation.city, birthLocation.province, birthLocation.country].filter(Boolean).join(', ') : ''
  const birthDateLabel = birthDate ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${birthDate}T00:00:00`)) : ''
  const birthTimeLabel = birthTimeUnknown ? 'Tidak diketahui' : birthTime || ''

  return <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
    <header className="mb-6"><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">CAKRA LANGIT</div><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Profil Saya</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Informasi akun dan konteks kelahiran yang digunakan oleh kalkulasi personal.</p></header>
    {error ? <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-sm text-red-200">{error}</div> : null}
    {message ? <div className="mb-5 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3 text-sm text-cyan-200"><Check className="h-4 w-4" />{message}</div> : null}
    {loading ? <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-800 bg-[#081522]/95 text-sm text-slate-500"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Memuat profil…</div> : editing ? <form onSubmit={saveProfile}>
      <div className="mb-4 flex items-center justify-between"><div><div className="text-xs uppercase tracking-[0.16em] text-cyan-400/70">EDIT PROFILE</div><div className="mt-1 text-sm text-slate-500">Perbarui data yang menjadi konteks personal.</div></div><button type="button" onClick={cancelEditing} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-800 px-4 text-sm text-slate-300 hover:border-slate-700"><X className="h-4 w-4" />Batal</button></div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
        <SectionCard eyebrow="ACCOUNT" title="Identitas Akun"><div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#06111d] p-4"><div className="flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">{avatar}</div><div><div className="text-base font-semibold text-slate-100">{name}</div><div className="mt-1 text-sm text-slate-400">{email}</div></div></div><div className="mt-5 space-y-4"><InputField label="Nama Tampilan" value={displayName} onChange={setDisplayName} /><div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><Mail className="h-3.5 w-3.5 text-cyan-400/70" />Email</div><div className="flex h-11 items-center rounded-xl border border-slate-800 bg-slate-900/30 px-4 text-sm text-slate-500">{email}</div></div></div><div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4"><ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-400/80" /><div><div className="text-sm font-medium text-slate-200">Akun aktif</div><p className="mt-1 text-xs text-slate-500">Status akun dikelola oleh sistem autentikasi Cakra Langit.</p></div></div></SectionCard>
        <SectionCard eyebrow="PERSONAL CONTEXT" title="Data Kelahiran"><div className="grid gap-4 sm:grid-cols-2"><InputField label="Tanggal Lahir" type="date" value={birthDate} onChange={setBirthDate} /><InputField label="Waktu Lahir" type="time" value={birthTime} onChange={setBirthTime} /><label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-[#06111d] px-4 py-3"><input type="checkbox" checked={birthTimeUnknown} onChange={(event) => setBirthTimeUnknown(event.target.checked)} className="h-4 w-4 accent-cyan-400" /><span><span className="block text-sm font-medium text-slate-200">Waktu lahir tidak diketahui</span><span className="mt-1 block text-xs text-slate-500">Engine yang membutuhkan waktu menangani kondisi ini sesuai kontraknya.</span></span></label><div className="sm:col-span-2"><span className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><MapPin className="h-3.5 w-3.5 text-cyan-400/70" />Lokasi Lahir</span><button type="button" onClick={openLocationPicker} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-800 bg-[#06111d] px-4 text-left text-sm text-slate-100 hover:border-cyan-400/50"><span className={selectedLocationLabel ? 'truncate text-slate-100' : 'truncate text-slate-500'}>{selectedLocationLabel || 'Pilih lokasi lahir'}</span><MapPin className="h-4 w-4 text-cyan-400/70" /></button></div></div><div className="mt-6 flex justify-end"><button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saving ? 'Menyimpan…' : 'Simpan Profil'}</button></div></SectionCard>
      </div>
    </form> : <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
      <SectionCard eyebrow="ACCOUNT" title="Identitas Akun" action={<button type="button" onClick={startEditing} className="inline-flex h-9 items-center gap-2 rounded-lg border border-cyan-400/20 px-3 text-xs font-semibold text-cyan-300 hover:border-cyan-400/40"><Edit3 className="h-3.5 w-3.5" />Edit Profile</button>}><div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#06111d] p-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">{initials(name, email)}</div><div className="min-w-0"><div className="truncate text-lg font-semibold text-slate-100">{name}</div><div className="mt-1 truncate text-sm text-slate-400">{email}</div></div></div><div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" /><div><div className="text-sm font-medium text-slate-200">Akun aktif</div><p className="mt-1 text-xs leading-5 text-slate-500">Status akun dikelola oleh sistem autentikasi Cakra Langit.</p></div></div></SectionCard>
      <SectionCard eyebrow="PERSONAL CONTEXT" title="Birth Profile" action={<button type="button" onClick={startEditing} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-800 px-3 text-xs font-semibold text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300"><Edit3 className="h-3.5 w-3.5" />Edit</button>}><div><DataRow label="Tanggal Lahir" value={birthDateLabel} icon={UserRound} /><DataRow label="Waktu Lahir" value={birthTimeLabel} icon={UserRound} /><DataRow label="Lokasi Lahir" value={selectedLocationLabel} icon={MapPin} /><DataRow label="Timezone" value={profile?.birth_timezone || '—'} icon={MapPin} /></div><div className="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.025] p-4"><div className="text-sm font-semibold text-slate-100">Personal calculation context</div><p className="mt-1.5 text-xs leading-5 text-slate-500">Data ini disimpan sebagai konteks bersama. Engine tetap bertanggung jawab atas kalkulasinya masing-masing.</p></div></SectionCard>
    </div>}
    <Dialog open={locationOpen} onOpenChange={setLocationOpen}><DialogContent className="w-[calc(100vw-2rem)] max-w-xl border-white/[0.10] bg-[#0B1825] text-white"><DialogHeader><DialogTitle className="text-white">Change Location</DialogTitle><DialogDescription className="text-[#8FA4B8]">Select a city and province in Indonesia.</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2"><div className="relative"><label htmlFor="birth-location-city-input" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">City</label><Search className="absolute left-3 top-[2.35rem] h-4 w-4 -translate-y-1/2 text-[#71869A]" /><input autoFocus id="birth-location-city-input" value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Bandung" className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] pl-10 pr-3 text-sm text-white placeholder:text-[#536A7D] outline-none focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10" /></div><div className="relative"><label htmlFor="birth-location-province-input" className="mb-1.5 block text-xs font-semibold text-[#AFC0CF]">Province</label><input id="birth-location-province-input" value={provinceQuery} onFocus={() => setProvinceOpen(true)} onChange={(event) => { setProvinceQuery(event.target.value); setProvinceOpen(true) }} placeholder="Jawa Barat" className="h-11 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 text-sm text-white placeholder:text-[#536A7D] outline-none focus:border-[#22D3EE]/40 focus:ring-2 focus:ring-[#22D3EE]/10" />{provinceOpen && provinces.length > 0 ? <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-white/[0.10] bg-[#0B1825] py-1 shadow-2xl">{provinces.filter((province) => province.city.toLowerCase().includes(provinceQuery.trim().toLowerCase())).map((province) => <button key={province.id} type="button" onClick={() => selectProvince(province)} className="w-full px-3 py-2 text-left text-sm text-[#D8E3EC] hover:bg-white/[0.06]">{province.city}</button>)}</div> : null}</div></div><div className="max-h-[420px] overflow-y-auto rounded-xl border border-white/[0.10]">{!cityQuery.trim() && <div className="px-4 py-8 text-center text-sm text-[#71869A]">Type a city name to search locations.</div>}{cityQuery.trim() && searching && <div className="px-4 py-8 text-center text-sm text-[#71869A]">Searching locations...</div>}{cityQuery.trim() && !searching && searchError && <div className="px-4 py-8 text-center text-sm text-[#71869A]">Unable to search locations.</div>}{cityQuery.trim() && !searching && !searchError && results.length === 0 && <div className="px-4 py-8 text-center text-sm text-[#71869A]">No locations found.</div>}{!searching && !searchError && results.map((location) => <button key={location.id} type="button" onClick={() => selectLocation(location)} className="flex w-full items-start gap-3 border-b border-white/[0.06] px-4 py-3 text-left hover:bg-white/[0.05]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#71869A]" /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#D8E3EC]">{location.city}</span><span className="mt-0.5 block truncate text-xs text-[#8FA4B8]">{[location.province, location.country].filter(Boolean).join(' — ')}</span><span className="mt-0.5 block text-[11px] text-[#536A7D]">{location.timezone}</span></span></button>)}</div></DialogContent></Dialog>
  </section>
}
