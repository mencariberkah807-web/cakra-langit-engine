import { useEffect, useState } from 'react'
import { ImagePlus, Save, Trash2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const textFields = [
  ['site_name', 'Site Name'],
  ['tagline', 'Tagline'],
  ['hero_title', 'Hero Title'],
  ['hero_description', 'Hero Description'],
  ['primary_cta_label', 'Primary CTA Label'],
  ['secondary_cta_label', 'Secondary CTA Label'],
  ['feature_1_title', 'Feature 1 Title'],
  ['feature_1_description', 'Feature 1 Description'],
  ['feature_2_title', 'Feature 2 Title'],
  ['feature_2_description', 'Feature 2 Description'],
  ['feature_3_title', 'Feature 3 Title'],
  ['feature_3_description', 'Feature 3 Description'],
  ['feature_4_title', 'Feature 4 Title'],
  ['feature_4_description', 'Feature 4 Description'],
  ['page_title', 'Page Title'],
  ['meta_description', 'Meta Description'],
]

const imageFields = [
  ['logo', 'Logo', 'logo'],
  ['favicon', 'Favicon', 'favicon'],
  ['hero_image', 'Hero Image', 'hero'],
  ['login_image', 'Login Image', 'login'],
]

function assetSrc(url) {
  return url ? `${API_BASE}${url}` : ''
}

export default function AdminPanel() {
  const { user, token, logout } = useAuth()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_BASE}/api/admin/site/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok) throw new Error(payload?.detail || 'Gagal memuat pengaturan situs')
        setSettings(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat pengaturan situs')
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [token])

  function updateField(key, value) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  async function saveSettings(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch(`${API_BASE}/api/admin/site/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.detail || 'Gagal menyimpan pengaturan')
      setSettings(payload)
      setMessage('Pengaturan situs berhasil disimpan.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  async function uploadImage(key, assetKey, file) {
    if (!file) return
    setMessage('')
    setError('')
    try {
      const form = new FormData()
      form.append('key', assetKey)
      form.append('file', file)
      const response = await fetch(`${API_BASE}/api/admin/site/assets`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.detail || 'Gagal mengunggah gambar')
      updateField(key, payload.url)
      setMessage(`${key} berhasil diunggah. Simpan pengaturan untuk menerapkannya.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah gambar')
    }
  }

  async function removeImage(key) {
    updateField(key, null)
    setMessage(`${key} dihapus dari konfigurasi. Klik Simpan untuk menerapkan.`)
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm text-[#64748B]">Memuat CMS…</main>
  }

  if (!settings) {
    return <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5 text-sm text-red-700" role="alert">{error || 'Pengaturan tidak tersedia.'}</main>
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-[#0F172A] sm:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Cakra Langit</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Site CMS</h1>
            <p className="mt-2 text-sm text-[#64748B]">Kelola branding, public hero, feature highlights, login image, dan SEO.</p>
          </div>
          <button type="button" onClick={logout} className="rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC]">Keluar</button>
        </header>

        <form className="mt-7 space-y-6" onSubmit={saveSettings}>
          {message ? <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
          {error ? <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Brand</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {textFields.slice(0, 2).map(([key, label]) => <TextField key={key} label={label} value={settings[key] || ''} onChange={(value) => updateField(key, value)} />)}
              {imageFields.slice(0, 2).map(([key, label, assetKey]) => <ImageField key={key} label={label} value={settings[key]} onUpload={(file) => uploadImage(key, assetKey, file)} onRemove={() => removeImage(key)} />)}
            </div>
          </section>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Public Hero</h2>
            <div className="mt-5 space-y-5">
              <ImageField label="Hero Image" value={settings.hero_image} onUpload={(file) => uploadImage('hero_image', 'hero', file)} onRemove={() => removeImage('hero_image')} />
              {textFields.slice(2, 5).map(([key, label]) => <TextField key={key} label={label} value={settings[key] || ''} onChange={(value) => updateField(key, value)} multiline={key === 'hero_description'} />)}
            </div>
          </section>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Feature Highlights</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {textFields.slice(5, 13).map(([key, label]) => <TextField key={key} label={label} value={settings[key] || ''} onChange={(value) => updateField(key, value)} multiline={key.includes('description')} />)}
            </div>
          </section>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Login</h2>
            <div className="mt-5">
              <ImageField label="Login Image" value={settings.login_image} onUpload={(file) => uploadImage('login_image', 'login', file)} onRemove={() => removeImage('login_image')} />
            </div>
          </section>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">SEO</h2>
            <div className="mt-5 space-y-5">
              {textFields.slice(13).map(([key, label]) => <TextField key={key} label={label} value={settings[key] || ''} onChange={(value) => updateField(key, value)} multiline={key === 'meta_description'} />)}
            </div>
          </section>

          <div className="sticky bottom-4 flex justify-end">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="h-4 w-4" />
              {saving ? 'Menyimpan…' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs text-[#94A3B8]">Admin: {user?.email}</p>
      </div>
    </main>
  )
}

function TextField({ label, value, onChange, multiline = false }) {
  const className = "w-full rounded-md border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#334155]">{label}</span>
      {multiline ? <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} className={className} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={className} />}
    </label>
  )
}

function ImageField({ label, value, onUpload, onRemove }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-[#334155]">{label}</span>
      <div className="rounded-lg border border-dashed border-[#CBD5E1] p-3">
        {value ? <img src={assetSrc(value)} alt={`${label} preview`} className="mb-3 max-h-44 w-full rounded-md object-contain bg-[#F8FAFC] p-2" /> : <div className="mb-3 flex h-28 items-center justify-center rounded-md bg-[#F8FAFC] text-[#94A3B8]"><ImagePlus className="h-6 w-6" /></div>}
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]">
            <ImagePlus className="h-3.5 w-3.5" />
            {value ? 'Ganti' : 'Upload'}
            <input type="file" accept="image/*,.ico" className="hidden" onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = '' }} />
          </label>
          {value ? <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] px-3 py-2 text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC]"><Trash2 className="h-3.5 w-3.5" />Hapus</button> : null}
        </div>
      </div>
    </div>
  )
}
