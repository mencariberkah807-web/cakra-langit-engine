import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Edit3, MapPin, Sparkles, UserRound } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

function initials(name, email) {
  const source = (name || email || 'CL').trim()
  const parts = source.split(/\s+/).filter(Boolean)
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : source.slice(0, 2).toUpperCase()
}

function Card({ eyebrow, title, action, children }) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[#081522]/95 shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-4 sm:px-6">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400/75">{eyebrow}</div>
          <h2 className="mt-1 text-base font-semibold text-slate-100">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function Value({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-800/70 py-4 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-[#06111d]"><Icon className="h-4 w-4 text-cyan-400/70" /></div>
      <div className="min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-[0.13em] text-slate-500">{label}</div>
        <div className={`mt-1 break-words text-sm font-medium ${muted ? 'text-slate-500' : 'text-slate-200'}`}>{value || 'Belum diatur'}</div>
      </div>
    </div>
  )
}

function formatDate(value) {
  if (!value) return null
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

export default function ProfileOverviewPage({ user }) {
  const [profile, setProfile] = useState(null)
  const [weton, setWeton] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wetonLoading, setWetonLoading] = useState(false)
  const [error, setError] = useState('')
  const [wetonError, setWetonError] = useState('')
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch(`${API_BASE}/api/profile`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!response.ok) throw new Error('Profil tidak dapat dimuat.')
        const payload = await response.json()
        if (!cancelled) setProfile(payload.profile || {})
      } catch (err) {
        if (!cancelled) setError(err.message || 'Profil tidak dapat dimuat.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token])

  useEffect(() => {
    if (!profile?.birth_date || !profile?.birth_location_id) {
      setWeton(null)
      return undefined
    }

    const controller = new AbortController()
    async function loadWeton() {
      setWetonLoading(true)
      setWetonError('')
      try {
        const params = new URLSearchParams({ location_id: profile.birth_location_id, date_value: profile.birth_date })
        if (!profile.birth_time_unknown && profile.birth_time) {
          params.set('datetime_value', `${profile.birth_date}T${profile.birth_time.slice(0, 8)}`)
        }
        const response = await fetch(`${API_BASE}/api/almanac?${params.toString()}`, {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!response.ok) throw new Error('Snapshot Weton belum dapat dimuat.')
        const payload = await response.json()
        const jawa = payload?.calendars?.find((calendar) => calendar.id === 'jawa')
        if (!jawa) throw new Error('Data kalender Jawa belum tersedia.')
        setWeton({ ...jawa, location: payload.location, dateInfo: payload.date_info })
      } catch (err) {
        if (err.name !== 'AbortError') setWetonError(err.message || 'Snapshot Weton belum dapat dimuat.')
      } finally {
        if (!controller.signal.aborted) setWetonLoading(false)
      }
    }
    loadWeton()
    return () => controller.abort()
  }, [profile?.birth_date, profile?.birth_time, profile?.birth_time_unknown, profile?.birth_location_id, token])

  const name = profile?.display_name || user?.display_name || user?.email?.split('@')[0] || 'Pengguna'
  const email = user?.email || '—'
  const avatar = useMemo(() => initials(name, email), [name, email])
  const dateLabel = formatDate(profile?.birth_date)
  const timeLabel = profile?.birth_time_unknown ? 'Tidak diketahui' : profile?.birth_time?.slice(0, 5)
  const location = profile?.birth_location
  const locationLabel = location ? [location.city, location.province, location.country].filter(Boolean).join(', ') : null
  const completeness = [profile?.display_name, profile?.birth_date, profile?.birth_time_unknown || profile?.birth_time, profile?.birth_location_id].filter(Boolean).length
  const percent = Math.round((completeness / 4) * 100)
  const detail = weton?.detail || {}
  const dino = detail.dino || {}
  const pasaran = detail.pasaran || {}
  const wuku = detail.wuku || {}
  const wetonHeadline = weton?.headline || (dino.name && pasaran.name ? `${dino.name} ${pasaran.name}` : null)
  const wetonDate = weton?.dateInfo?.date_long || formatDate(profile?.birth_date)

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">CAKRA LANGIT</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Profil Saya</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Pusat identitas dan konteks kelahiran untuk pengalaman kalkulasi personal.</p>
        </div>
        <a href="/dashboard/profile/edit" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cyan-400/20 px-4 text-sm font-semibold text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.04]"><Edit3 className="h-4 w-4" />Edit Profile</a>
      </header>

      {error ? <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-sm text-red-200">{error}</div> : null}
      {loading ? <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-800 bg-[#081522]/95 text-sm text-slate-500">Memuat profil…</div> : (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
            <Card eyebrow="IDENTITY" title="Account Overview">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-xl font-semibold text-cyan-300">{avatar}</div>
                <div className="min-w-0">
                  <div className="text-2xl font-semibold text-slate-100">{name}</div>
                  <div className="mt-1 text-sm text-slate-400">{email}</div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-3 py-1 text-xs text-cyan-300"><CheckCircle2 className="h-3.5 w-3.5" />Akun aktif</div>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-[#06111d] p-4"><div className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Profile completeness</div><div className="mt-2 flex items-end justify-between"><span className="text-2xl font-semibold text-slate-100">{percent}%</span><span className="text-xs text-slate-500">{completeness}/4 data</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${percent}%` }} /></div></div>
                <div className="rounded-xl border border-slate-800 bg-[#06111d] p-4"><div className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Personal context</div><div className="mt-2 text-sm font-medium text-slate-200">Birth Profile</div><p className="mt-1 text-xs leading-5 text-slate-500">Data ini menjadi konteks bersama. Setiap engine tetap menjalankan perhitungannya sendiri.</p></div>
              </div>
            </Card>

            <Card eyebrow="BIRTH PROFILE" title="Birth Context" action={<a href="/dashboard/profile/edit" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">Edit</a>}>
              <Value icon={CalendarDays} label="Tanggal Lahir" value={dateLabel} />
              <Value icon={Clock3} label="Waktu Lahir" value={timeLabel} />
              <Value icon={MapPin} label="Lokasi Lahir" value={locationLabel} />
              <Value icon={MapPin} label="Timezone" value={profile?.birth_timezone} />
            </Card>
          </div>

          <div className="mt-5">
            <Card
              eyebrow="JAWA · PERSONAL ENGINE"
              title="Weton Snapshot"
              action={<a href="/dashboard/weton" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">Lihat Lengkap</a>}
            >
              {wetonLoading ? (
                <div className="flex min-h-32 items-center justify-center rounded-xl border border-slate-800 bg-[#06111d] text-sm text-slate-500">Memuat snapshot Weton…</div>
              ) : weton ? (
                <a href="/dashboard/weton" className="group block rounded-xl border border-cyan-400/15 bg-[#06111d] p-5 transition hover:border-cyan-400/35 hover:bg-[#091a29]">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/70">Weton Kelahiran</div>
                      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">{wetonHeadline || '—'}</div>
                      <div className="mt-1 text-sm text-slate-400">{wetonDate}{profile?.birth_time && !profile?.birth_time_unknown ? ` · ${profile.birth_time.slice(0, 5)}` : ''}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-3">
                      <div><div className="text-[9px] uppercase tracking-[0.14em] text-slate-500">Neptu</div><div className="mt-1 text-xl font-semibold text-cyan-300">{detail.neptu_total ?? '—'}</div></div>
                      <ArrowRight className="ml-3 h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-800 bg-[#081522] p-3"><div className="text-[9px] uppercase tracking-[0.13em] text-slate-500">Dina</div><div className="mt-1 text-sm font-semibold text-slate-200">{dino.name || '—'}</div><div className="mt-1 text-xs text-slate-500">Neptu {dino.neptu ?? '—'}</div></div>
                    <div className="rounded-lg border border-slate-800 bg-[#081522] p-3"><div className="text-[9px] uppercase tracking-[0.13em] text-slate-500">Pasaran</div><div className="mt-1 text-sm font-semibold text-slate-200">{pasaran.name || '—'}</div><div className="mt-1 text-xs text-slate-500">Neptu {pasaran.neptu ?? '—'}</div></div>
                    <div className="rounded-lg border border-slate-800 bg-[#081522] p-3"><div className="text-[9px] uppercase tracking-[0.13em] text-slate-500">Wuku</div><div className="mt-1 text-sm font-semibold text-slate-200">{wuku.name || '—'}</div><div className="mt-1 text-xs text-slate-500">Hari ke-{wuku.day_in_wuku ?? '—'}</div></div>
                  </div>
                </a>
              ) : (
                <div className="rounded-xl border border-amber-300/15 bg-amber-300/[0.035] p-5">
                  <div className="text-sm font-semibold text-slate-200">Snapshot Weton belum tersedia</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Lengkapi tanggal dan lokasi kelahiran di Profil Saya untuk menampilkan ringkasan Weton personal.</p>
                  {wetonError ? <div className="mt-3 text-xs text-amber-200">{wetonError}</div> : null}
                  <a href="/dashboard/profile/edit" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/[0.04]">Lengkapi Profil <ArrowRight className="h-3.5 w-3.5" /></a>
                </div>
              )}
            </Card>
          </div>

          <div className="mt-5">
            <Card eyebrow="PERSONAL ENGINES" title="Calculation Workspace">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[['Weton', '/dashboard/weton', 'Jawa · Snapshot tersedia'], ['Birth Converter', '/dashboard/birth-converter', 'Birth context'], ['BaZi', '/dashboard/bazi', 'Chinese engine'], ['Paririmbon', '/dashboard/paririmbon', 'Personal reference']].map(([label, href, detailText]) => (
                  <a key={href} href={href} className="group rounded-xl border border-slate-800 bg-[#06111d] p-4 transition hover:border-cyan-400/30 hover:bg-[#091a29]">
                    <div className="flex items-center justify-between"><Sparkles className="h-4 w-4 text-cyan-400/70" /><ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" /></div>
                    <div className="mt-4 text-sm font-semibold text-slate-200">{label}</div>
                    <div className="mt-1 text-xs text-slate-500">{detailText}</div>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/80" /><div><div className="text-sm font-semibold text-slate-200">One personal context</div><p className="mt-1 text-xs leading-5 text-slate-500">Profil menyimpan data kelahiran sebagai input bersama. Weton, BaZi, Birth Converter, dan engine lain tetap bertanggung jawab atas kalkulasi domain masing-masing.</p></div></div>
          </div>
        </>
      )}
    </section>
  )
}
