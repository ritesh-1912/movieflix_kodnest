import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USER_KEY = 'movieflix_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = checking, null = not logged in, object = logged in

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (_) {
        localStorage.removeItem(USER_KEY)
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
