import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function LoginPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-12 text-[#0F172A]">
      <button
        type="button"
        onClick={goBack}
        className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#475569] shadow-sm hover:text-[#0F172A]"
        aria-label="Kembali"
      >
        <span aria-hidden="true">←</span>
        <span>Kembali</span>
      </button>

      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <section className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">
              Cakra Langit
            </p>
            <h1 className="text-2xl font-semibold">
              {mode === 'login' ? 'Masuk ke Calculation Layer' : 'Buat akun'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              {mode === 'login'
                ? 'Weton, BaZi, Paririmbon, dan perhitungan personal tersedia setelah login.'
                : 'Akun digunakan untuk menyimpan konteks dan calculation profile personal.'}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Nama</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-[#475569]"
                  autoComplete="name"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-[#475569]"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 outline-none focus:border-[#475569]"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={8}
                required
              />
            </label>

            {error && (
              <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#991B1B]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy
                ? 'Memproses…'
                : mode === 'login'
                  ? 'Masuk'
                  : 'Buat akun'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
            }}
            className="mt-5 w-full text-sm font-medium text-[#2563EB]"
          >
            {mode === 'login'
              ? 'Belum punya akun? Buat akun'
              : 'Sudah punya akun? Masuk'}
          </button>
        </section>
      </div>
    </main>
  )
}
