import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getImage } from '../cakra-ui/imagePreferences'
import { defaultSettings, fetchSiteSettings, resolveAssetUrl } from '../public/siteSettings'

export default function LoginPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loginImage, setLoginImage] = useState('')

  useEffect(() => {
    let active = true
    let localUrl = ''

    fetchSiteSettings().then((settings) => {
      if (!active) return
      const remoteUrl = resolveAssetUrl(settings.login_image)
      if (remoteUrl) {
        setLoginImage(remoteUrl)
        return
      }

      return getImage('login').then((record) => {
        if (!active || !record?.blob) return
        localUrl = URL.createObjectURL(record.blob)
        setLoginImage(localUrl)
      })
    }).catch(() => {
      getImage('login')
        .then((record) => {
          if (!active || !record?.blob) return
          localUrl = URL.createObjectURL(record.blob)
          setLoginImage(localUrl)
        })
        .catch(() => {})
    })

    return () => {
      active = false
      if (localUrl) URL.revokeObjectURL(localUrl)
    }
  }, [])

  useEffect(() => {
    if (defaultSettings.page_title) document.title = `Masuk — ${defaultSettings.page_title}`
    if (defaultSettings.meta_description !== null) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = defaultSettings.meta_description || ''
    }

    const faviconUrl = resolveAssetUrl(defaultSettings.favicon)
    if (faviconUrl) {
      let link = document.querySelector('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = faviconUrl
    }
  }, [])

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      if (mode === 'register') {
        await register(email, password, displayName)
      } else {
        await login(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 text-[#0F172A] sm:px-6">
      <button type="button" onClick={goBack} className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#475569] shadow-sm hover:text-[#0F172A]" aria-label="Kembali">
        <span aria-hidden="true">←</span><span>Kembali</span>
      </button>

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden min-h-[620px] overflow-hidden bg-slate-900 lg:block">
            {loginImage ? <img src={loginImage} alt="Cakra Langit" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#DCEBFF_0,#8AA8C8_42%,#0F172A_100%)]" />}
            <div className="absolute inset-0 bg-slate-950/25" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 text-xl">✧</div>
                <div className="font-serif text-2xl tracking-wide">CAKRA LANGIT</div>
                <div className="mt-1 text-sm text-white/75">Personal Almanac</div>
              </div>
              <div className="max-w-sm">
                <p className="font-serif text-2xl leading-9">“Selaras dengan alam, lebih dekat pada diri sendiri.”</p>
                <div className="mt-5 h-px w-10 bg-white/80" />
              </div>
            </div>
          </div>

          <div className="flex items-center p-7 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">Cakra Langit</p>
                <h1 className="text-3xl font-semibold tracking-tight">{mode === 'login' ? 'Selamat Datang Kembali' : 'Buat akun'}</h1>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{mode === 'login' ? 'Masuk untuk melanjutkan perjalanan Anda di Cakra Langit.' : 'Buat akun untuk menyimpan konteks dan calculation profile personal.'}</p>
              </div>

              <div className="mb-6 grid grid-cols-2 border-b border-slate-200 text-sm font-medium">
                <button type="button" onClick={() => setMode('login')} className={`border-b-2 py-3 ${mode === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>Masuk</button>
                <button type="button" onClick={() => setMode('register')} className={`border-b-2 py-3 ${mode === 'register' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>Daftar</button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {mode === 'register' && <label className="block"><span className="mb-1 block text-sm font-medium">Nama</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" autoComplete="name" /></label>}
                <label className="block"><span className="mb-1 block text-sm font-medium">Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" autoComplete="email" required /></label>
                <label className="block"><span className="mb-1 block text-sm font-medium">Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required /></label>
                {error && <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#991B1B]">{error}</div>}
                <button type="submit" disabled={busy} className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{busy ? 'Memproses…' : mode === 'login' ? 'Masuk' : 'Buat akun'}</button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">{mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}<button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} className="font-medium text-blue-600">{mode === 'login' ? 'Buat akun' : 'Masuk'}</button></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
