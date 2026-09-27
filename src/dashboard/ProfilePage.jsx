import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, Edit3, Save, Sparkles, X } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useTodayContext } from '../core/TodayContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function SnapshotCard({ title, eyebrow, headline, sub, fields = [], tone = 'default' }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A1723] shadow-[0_12px_40px_rgba(0,0,0,0.14)]">
      <div className="border-b border-white/[0.07] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{eyebrow}</div>
            <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
          </div>
          <div className={tone === 'ready'
            ? 'rounded-full border border-emerald-400/20 bg-emerald-950/20 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-300'
            : 'rounded-full border border-white/[0.07] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#536A7D]'}>
            {tone === 'ready' ? 'Tersedia' : 'Snapshot'}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
          <div className="text-lg font-semibold text-white">{headline || '—'}</div>
          {sub && <div className="mt-1 text-xs text-[#71869A]">{sub}</div>}
          {fields.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {fields.slice(0, 4).map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/[0.05] bg-[#0A1723] px-3 py-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">{label}</div>
                  <div className="mt-1 text-xs font-semibold text-[#A9BDCF]">{value || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { apiData, location, selectedDate } = useTodayContext()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [palintangan, setPalintangan] = useState(null)

  useEffect(() => {
    setDisplayName(user?.display_name || '')
  }, [user?.display_name])

  useEffect(() => {
    if (!selectedDate) return
    const iso = [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, '0'),
      String(selectedDate.getDate()).padStart(2, '0'),
    ].join('-')
    let cancelled = false
    fetch(API_BASE + '/api/palintangan/sunda?date_value=' + iso)
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!cancelled) setPalintangan(result)
      })
      .catch(() => {
        if (!cancelled) setPalintangan(null)
      })
    return () => { cancelled = true }
  }, [selectedDate])

  const calendars = apiData?.calendars || []
  const jawa = calendars.find((item) => item.id === 'jawa')
  const hijri = calendars.find((item) => item.id === 'hijri')
  const saka = calendars.find((item) => item.id === 'saka-sunda')
  const kalacakra = calendars.find((item) => item.id === 'kalacakra')

  const locationLabel = location?.name || apiData?.location?.name || 'Lokasi aktif'
  const dateLabel = apiData?.date_info?.date_long || 'Tanggal aktif'

  const profileInitials = useMemo(() => {
    const value = (user?.display_name || user?.email || 'PL').trim()
    return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  }, [user])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await updateProfile({ display_name: displayName })
      setEditing(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan profil.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Personal</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Profil Saya</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Data profil, konteks aktif, dan ringkasan output engine yang sedang digunakan Cakra Langit.</p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-cyan-300/10 bg-[#0A1723] shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#12324A] text-lg font-bold text-[#22D3EE]">{profileInitials}</div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22D3EE]">Profil Pengguna</div>
                <div className="mt-1 text-xl font-semibold text-white">{user?.display_name || 'Nama belum diisi'}</div>
                <div className="mt-1 text-xs text-[#71869A]">{user?.email || '—'}</div>
              </div>
            </div>
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-[#A9BDCF] hover:bg-[#12324A] hover:text-white"><Edit3 size={15} /> Edit Profil</button>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-semibold text-[#71869A] hover:text-white"><X size={15} /> Batal</button>
                <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#12324A] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#174461] disabled:opacity-60"><Save size={15} /> {saving ? 'Menyimpan…' : 'Simpan'}</button>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-white/[0.07] pt-5">
            {editing ? (
              <label className="block max-w-xl">
                <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Nama tampilan</span>
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={120} autoFocus className="w-full rounded-xl border border-cyan-300/20 bg-[#07111C] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40" />
              </label>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">Nama</div><div className="mt-2 text-sm font-semibold text-white">{user?.display_name || '—'}</div></div>
                <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">Email</div><div className="mt-2 text-sm font-semibold text-white">{user?.email || '—'}</div></div>
                <div className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4"><div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">Lokasi aktif</div><div className="mt-2 text-sm font-semibold text-white">{locationLabel}</div></div>
              </div>
            )}
            {saved && <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-300"><Check size={14} /> Profil tersimpan.</div>}
            {error && <div className="mt-3 text-xs text-red-300">{error}</div>}
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22D3EE]">Engine Output</div>
          <h2 className="mt-1 text-lg font-semibold text-white">Snapshot hasil perhitungan</h2>
          <p className="mt-1 text-xs text-[#71869A]">{locationLabel} · {dateLabel}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SnapshotCard title="Weton Jawa" eyebrow="Calendar Engine" headline={jawa?.sub || jawa?.headline} sub={jawa?.headline} fields={jawa?.fields?.slice(0, 4).map((item) => [item.k, item.v])} tone={jawa ? 'ready' : 'default'} />
          <SnapshotCard title="Paririmbon Sunda" eyebrow="Sunda Calendar" headline={saka?.headline || hijri?.headline} sub={saka?.sub || 'Konteks kalender Sunda'} fields={saka?.fields?.map((item) => [item.k, item.v])} tone={saka ? 'ready' : 'default'} />
          <SnapshotCard title="Palintangan Sunda" eyebrow="Palintangan Engine" headline={palintangan?.calendar_context ? palintangan.calendar_context.hari + ' ' + palintangan.calendar_context.pasaran : 'Memuat output…'} sub={palintangan?.watek_patokan?.watek ? 'Watek: ' + palintangan.watek_patokan.watek : 'Peta hari belum tersedia'} fields={palintangan ? [['Naktu Wedal', palintangan.naktu?.wedal], ['Status Hari', palintangan.navigation?.status_hari], ['Pernaasan', palintangan.pernaasan?.is_today ? 'PERNAASAN' : 'Bukan pernaasan'], ['Jaya · Apes', palintangan.jaya_apes ? palintangan.jaya_apes.jaya + ' · ' + palintangan.jaya_apes.apes : '—']] : []} tone={palintangan ? 'ready' : 'default'} />
          <SnapshotCard title="Kalacakra" eyebrow="Cycle Engine" headline={kalacakra?.headline} sub={kalacakra?.sub} fields={kalacakra?.fields?.map((item) => [item.k, item.v])} tone={kalacakra ? 'ready' : 'default'} />
          <SnapshotCard title="Natural Layer" eyebrow="Natural Engine" headline={apiData?.natural?.sun?.sunrise ? 'Sunrise ' + apiData.natural.sun.sunrise : 'Natural context'} sub={apiData?.natural?.moon?.phase ? 'Moon: ' + apiData.natural.moon.phase : 'Output natural layer'} fields={apiData?.natural?.earth ? [['Day of Year', apiData.natural.earth.day_of_year], ['Annual', apiData.natural.earth.annual_pct], ['Moon', apiData.natural.moon?.phase], ['Illumination', apiData.natural.moon?.illumination ? apiData.natural.moon.illumination + '%' : '—']] : []} tone={apiData?.natural ? 'ready' : 'default'} />
          <SnapshotCard title="BaZi" eyebrow="Birth Engine" headline="Belum ada data kelahiran" sub="Isi konteks kelahiran untuk menampilkan Four Pillars." fields={[['Status', 'Menunggu data'], ['Engine', 'BaZi']]} />
        </div>
      </section>

      <section className="mt-7 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CalendarDays size={18} className="mt-0.5 shrink-0 text-[#22D3EE]" />
          <div>
            <h2 className="text-sm font-semibold text-white">Konteks profil & engine</h2>
            <p className="mt-1 text-xs leading-5 text-[#71869A]">Snapshot membaca konteks kalkulasi aktif. Profil menyimpan identitas pengguna; data kelahiran belum disimpan pada schema profil saat ini, sehingga BaZi belum dapat diisi otomatis.</p>
          </div>
        </div>
      </section>
    </section>
  )
}
