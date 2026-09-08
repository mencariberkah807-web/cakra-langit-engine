import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getImage } from '../cakra-ui/imagePreferences'
import { fetchSiteSettings, resolveAssetUrl } from '../public/siteSettings'

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

      if (settings.page_title) document.title = `Masuk — ${settings.page_title}`
      if (settings.meta_description !== null) {
        let meta = document.querySelector('meta[name="description"]')
        if (!meta) {
          meta = document.createElement('meta')
          meta.name = 'description'
          document.head.appendChild(meta)
        }
        meta.content = settings.meta_description || ''
      }

      const faviconUrl = resolveAssetUrl(settings.favicon)
      if (faviconUrl) {
        let link = document.querySelector('link[rel="icon"]')
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = faviconUrl
      }

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
    <main className="min-h-screen bg-[#07111C] px-4 py-8 text-white sm:px-6 lg:py-10">
      <button type="button" onClick={goBack} className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-[#0B1A2A]/90 px-3 py-2 text-sm font-medium text-[#9FB1C1] shadow-lg backdrop-blur-xl transition-colors hover:border-[#22D3EE]/30 hover:text-white" aria-label="Kembali">
        <span aria-hidden="true">←</span><span>Kembali</span>
      </button>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center lg:min-h-[calc(100vh-5rem)]">
        <section className="grid w-full overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0B1A2A] shadow-2xl shadow-black/30 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden min-h-[620px] overflow-hidden bg-[#06172B] lg:block">
            {loginImage ? <img src={loginImage} alt="Cakra Langit" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#163A5C_0,#0B1A2A_45%,#06111B_100%)]" />}
            <div className="absolute inset-0 bg-[#06111B]/35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.10),transparent_38%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#22D3EE]/40 bg-[#0B1A2A]/50 text-xl text-[#67E8F9]">✧</div>
                <div className="font-serif text-2xl tracking-wide">CAKRA LANGIT</div>
                <div className="mt-1 text-sm text-[#9FB1C1]">Personal Almanac</div>
              </div>
              <div className="max-w-sm">
                <p className="font-serif text-2xl leading-9 text-white">“Selaras dengan alam, lebih dekat pada diri sendiri.”</p>
                <div className="mt-5 h-px w-10 bg-[#22D3EE]/70" />
              </div>
            </div>
          </div>

          <div className="flex items-center bg-[#0B1A2A] p-7 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#22D3EE]">Cakra Langit</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">{mode === 'login' ? 'Selamat Datang Kembali' : 'Buat akun'}</h1>
                <p className="mt-2 text-sm leading-6 text-[#8FA3B5]">{mode === 'login' ? 'Masuk untuk melanjutkan perjalanan Anda di Cakra Langit.' : 'Buat akun untuk menyimpan konteks dan calculation profile personal.'}</p>
              </div>

              <div className="mb-6 grid grid-cols-2 border-b border-white/[0.08] text-sm font-medium">
                <button type="button" onClick={() => setMode('login')} className={`border-b-2 py-3 transition-colors ${mode === 'login' ? 'border-[#22D3EE] text-[#22D3EE]' : 'border-transparent text-[#64788A] hover:text-white'}`}>Masuk</button>
                <button type="button" onClick={() => setMode('register')} className={`border-b-2 py-3 transition-colors ${mode === 'register' ? 'border-[#22D3EE] text-[#22D3EE]' : 'border-transparent text-[#64788A] hover:text-white'}`}>Daftar</button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {mode === 'register' && <label className="block"><span className="mb-1 block text-sm font-medium text-[#C7D2DE]">Nama</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-xl border border-white/[0.10] bg-[#06172B] px-3 py-2.5 text-white outline-none transition focus:border-[#22D3EE]/60 focus:ring-2 focus:ring-[#22D3EE]/10" autoComplete="name" /></label>}
                <label className="block"><span className="mb-1 block text-sm font-medium text-[#C7D2DE]">Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/[0.10] bg-[#06172B] px-3 py-2.5 text-white outline-none transition focus:border-[#22D3EE]/60 focus:ring-2 focus:ring-[#22D3EE]/10" autoComplete="email" required /></label>
                <label className="block"><span className="mb-1 block text-sm font-medium text-[#C7D2DE]">Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/[0.10] bg-[#06172B] px-3 py-2.5 text-white outline-none transition focus:border-[#22D3EE]/60 focus:ring-2 focus:ring-[#22D3EE]/10" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required /></label>
                {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}
                <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#22D3EE] px-4 py-2.5 font-semibold text-[#06111B] transition hover:bg-[#67E8F9] disabled:cursor-not-allowed disabled:opacity-60">{busy ? 'Memproses…' : mode === 'login' ? 'Masuk' : 'Buat akun'}</button>
              </form>

              <p className="mt-5 text-center text-sm text-[#71869A]">{mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}<button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} className="font-medium text-[#22D3EE] hover:text-[#67E8F9]">{mode === 'login' ? 'Buat akun' : 'Masuk'}</button></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
