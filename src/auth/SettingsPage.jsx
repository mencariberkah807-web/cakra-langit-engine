import { useEffect, useState } from 'react'
import {
  deleteImage,
  getImage,
  getStoredImageBytes,
  IMAGE_RULES,
  saveImage,
  TOTAL_IMAGE_QUOTA,
} from '../cakra-ui/imagePreferences'

const IMAGE_ITEMS = [
  ['logo', 'Logo', 'Logo Cakra Langit yang digunakan pada application shell.', '500 KB', '1000 × 1000'],
  ['login', 'Login Image', 'Gambar utama pada halaman login.', '2 MB', '1600 × 2000'],
  ['publicHero', 'Public Hero Image', 'Gambar hero untuk Public UI yang menggunakan hero image.', '2 MB', '2400 × 1400'],
]

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ImageCard({ item, onChanged }) {
  const [record, setRecord] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [inputKey, setInputKey] = useState(0)

  const [key, title, description, maxSize, dimensions] = item

  async function refresh() {
    const next = await getImage(key)
    setRecord(next || null)
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message))
  }, [key])

  useEffect(() => {
    if (!record?.blob) {
      setPreviewUrl('')
      return undefined
    }
    const url = URL.createObjectURL(record.blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [record])

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const next = await saveImage(key, file)
      setRecord(next)
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      setInputKey((value) => value + 1)
    }
  }

  async function handleDelete() {
    setBusy(true)
    setError('')
    try {
      await deleteImage(key)
      setRecord(null)
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const rule = IMAGE_RULES[key]

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{maxSize}</span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[220px_1fr]">
        <div className="flex min-h-[150px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
          {previewUrl ? (
            <img src={previewUrl} alt={`${title} preview`} className="h-full max-h-[220px] w-full object-cover" />
          ) : (
            <div className="px-5 text-center text-xs text-slate-400">Belum ada gambar custom</div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="text-xs leading-5 text-slate-500">
            <div>Format: JPG, PNG, WebP</div>
            <div>Maksimum dimensi: {dimensions}</div>
            <div>Gambar otomatis di-resize dan dikompresi sebelum disimpan.</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              {busy ? 'Memproses…' : 'Ganti Gambar'}
              <input
                key={inputKey}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={busy}
                onChange={handleFile}
              />
            </label>
            {record && (
              <button type="button" disabled={busy} onClick={handleDelete} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                Hapus
              </button>
            )}
          </div>
          {record && <div className="text-xs text-slate-400">Tersimpan {formatBytes(record.bytes)} · {record.width} × {record.height}px</div>}
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>
      </div>
    </article>
  )
}

export default function SettingsPage() {
  const [usedBytes, setUsedBytes] = useState(0)

  async function refreshUsage() {
    setUsedBytes(await getStoredImageBytes())
  }

  useEffect(() => {
    refreshUsage().catch(() => setUsedBytes(0))
  }, [])

  const usagePercent = Math.min(100, (usedBytes / TOTAL_IMAGE_QUOTA) * 100)

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Appearance</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Pengaturan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Kelola tampilan personal Cakra Langit tanpa mengubah source code.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Image Storage</div>
            <div className="mt-1 text-xs text-slate-500">Batas total custom image: 10 MB.</div>
          </div>
          <div className="text-sm font-semibold text-slate-700">{formatBytes(usedBytes)} / 10 MB</div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${usagePercent}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {IMAGE_ITEMS.map((item) => (
          <ImageCard key={item[0]} item={item} onChanged={refreshUsage} />
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-400">Image disimpan di browser untuk perangkat ini. File sumber tidak disimpan; gambar diperkecil dan dikompresi sebelum disimpan.</p>
    </section>
  )
}
