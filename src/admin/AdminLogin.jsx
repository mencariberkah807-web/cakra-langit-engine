import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'
const USER_KEY = 'cakra-langit:user'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.detail || 'Login gagal')
      }

      if (payload?.user?.role !== 'admin') {
        throw new Error('Akun ini tidak memiliki akses admin')
      }

      window.localStorage.setItem(TOKEN_KEY, payload.access_token)
      window.localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      window.location.assign('/saehu')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5 py-10 text-[#0F172A]">
      <section className="w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-7 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Cakra Langit</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Admin Login</h1>
        <p className="mt-2 text-sm text-[#64748B]">Masuk ke area pengelolaan situs.</p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#334155]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-md border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#334155]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
            />
          </label>

          {error ? <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Memeriksa…' : 'Masuk sebagai Admin'}
          </button>
        </form>
      </section>
    </main>
  )
}
