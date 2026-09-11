import { useMemo } from 'react'
import { Mail, ShieldCheck, UserRound } from 'lucide-react'

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

function Field({ label, value, helper, icon: Icon }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
        {Icon ? <Icon className="h-3.5 w-3.5 text-cyan-400/70" /> : null}
        <span>{label}</span>
      </div>
      <div className="min-h-11 rounded-xl border border-slate-800 bg-[#06111d] px-4 py-3 text-sm text-slate-200">
        {value || 'Belum diisi'}
      </div>
      {helper ? <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p> : null}
    </div>
  )
}

export default function ProfilePage({ user }) {
  const displayName = user?.display_name || 'Profil Saya'
  const email = user?.email || '—'
  const avatar = useMemo(() => initials(user?.display_name, user?.email), [user?.display_name, user?.email])

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7">
      <header className="mb-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">CAKRA LANGIT</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Profil Saya</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Kelola identitas akun dan konteks personal yang digunakan di ruang kerja Cakra Langit.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
        <SectionCard eyebrow="ACCOUNT" title="Identitas Akun">
          <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#06111d] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
              {avatar}
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-slate-100">{displayName}</div>
              <div className="mt-1 truncate text-sm text-slate-400">{email}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nama Tampilan" value={user?.display_name} icon={UserRound} />
            <Field label="Email" value={email} icon={Mail} />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" />
            <div>
              <div className="text-sm font-medium text-slate-200">Akun aktif</div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Status akun dikelola oleh sistem autentikasi Cakra Langit.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="PERSONAL CONTEXT" title="Profil Kelahiran">
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <div className="text-sm font-semibold text-amber-200">Data kelahiran belum tersedia</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Schema profil saat ini belum menyimpan tanggal, waktu, dan lokasi kelahiran. Karena itu Cakra Langit belum menjadikan Profil Saya sebagai sumber otomatis untuk kalkulasi personal.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Tanggal Lahir" value="Belum tersedia" helper="Menjadi konteks dasar kalkulasi personal." />
            <Field label="Waktu Lahir" value="Belum tersedia" helper="Digunakan bila metode membutuhkan waktu kelahiran." />
            <div className="sm:col-span-2">
              <Field label="Lokasi Lahir" value="Belum tersedia" helper="Lokasi diperlukan untuk konteks waktu dan sistem yang bergantung pada zona waktu." />
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  )
}
