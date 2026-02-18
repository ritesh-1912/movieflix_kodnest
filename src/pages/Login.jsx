import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../api/auth'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const { user, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-netflix-black border-t-netflix-red" />
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiLogin({ username, password })
      login(res.user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg min-h-screen flex flex-col">
      {/* Top bar - Netflix style */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 md:py-8">
        <Link
          to="/"
          className="text-netflix-red text-2xl md:text-4xl font-bold tracking-tight font-display hover:opacity-90 transition-opacity duration-300"
        >
          MOVIEFLIX
        </Link>
        <Link
          to="/register"
          className="text-white/90 hover:text-white text-sm font-medium transition-colors duration-200"
        >
          Sign up
        </Link>
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center px-4 pb-24 -mt-8">
        <div className="w-full max-w-[400px] animate-fadeInUp">
          <div className="bg-black/75 backdrop-blur-md rounded-md shadow-card px-12 py-10 md:px-16 md:py-12 border border-white/10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Sign In</h1>
            <p className="text-white/70 text-sm mb-8">Welcome back. Sign in to continue.</p>

            {error && (
              <div
                className="mb-6 py-3 px-4 rounded bg-netflix-red/20 text-red-200 text-sm border border-red-500/30 animate-fadeIn"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="username"
                  placeholder="Username"
                  className={`w-full px-4 py-3.5 rounded bg-neutral-800/90 border text-white placeholder-neutral-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                    focused === 'username'
                      ? 'border-white bg-neutral-700/90'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="current-password"
                  placeholder="Password"
                  className={`w-full px-4 py-3.5 rounded bg-neutral-800/90 border text-white placeholder-neutral-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                    focused === 'password'
                      ? 'border-white bg-neutral-700/90'
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3.5 rounded bg-netflix-red text-white text-lg font-semibold hover:bg-[#f40612] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-netflix-red disabled:active:scale-100"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-white/70 text-sm">
              New to MovieFlix?{' '}
              <Link to="/register" className="text-white hover:underline font-medium">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-netflix-black to-transparent" />
    </div>
  )
}

export default Login
