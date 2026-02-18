import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-netflix-black/98 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 md:py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            to="/"
            className="text-netflix-red text-2xl md:text-3xl font-bold tracking-tight font-display hover:opacity-90 transition-opacity"
          >
            MOVIEFLIX
          </Link>
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm lg:text-base font-medium text-white/90 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            className="text-white/90 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Search"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-sm text-white/80 hidden sm:block truncate max-w-[120px]">{user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium rounded bg-netflix-red text-white hover:bg-[#f40612] transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-sm font-medium rounded bg-netflix-red text-white hover:bg-[#f40612] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
