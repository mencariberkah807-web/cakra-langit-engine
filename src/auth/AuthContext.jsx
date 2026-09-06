import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'cakra-langit:access-token'

const AuthContext = createContext(null)

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.detail || 'Authentication request failed')
  }

  return payload
}

function storeToken(value) {
  window.localStorage.setItem(TOKEN_KEY, value)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return window.localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    try {
      window.localStorage.removeItem(TOKEN_KEY)
    } catch {
      // Ignore storage errors.
    }
    window.location.assign('/')
  }, [])

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await request('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!cancelled) setUser(currentUser)
      } catch {
        if (!cancelled) {
          try {
            window.localStorage.removeItem(TOKEN_KEY)
          } catch {
            // Ignore storage errors.
          }
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [token])

  const login = useCallback(async (email, password) => {
    const payload = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    setToken(payload.access_token)
    setUser(payload.user)
    storeToken(payload.access_token)
    window.location.assign('/calculation')
  }, [])

  const register = useCallback(async (email, password, displayName) => {
    const payload = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        display_name: displayName || null,
      }),
    })

    setToken(payload.access_token)
    setUser(payload.user)
    storeToken(payload.access_token)
    window.location.assign('/calculation')
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout: clearSession,
      apiBase: API_BASE,
    }),
    [token, user, loading, login, register, clearSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
