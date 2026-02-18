import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const profileContainerRef = useRef(null)
  const searchContainerRef = useRef(null)
  const searchInputRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!profileOpen) return
    const handleClickOutside = (e) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [profileOpen])

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
          <div
            ref={searchContainerRef}
            className={`flex items-center overflow-hidden rounded-full bg-white/5 border border-transparent transition-all duration-300 ease-out ${
              searchExpanded ? 'w-52 md:w-64 border-white/20 bg-white/10' : 'w-10 md:w-11 hover:bg-white/10'
            }`}
            onMouseEnter={() => setSearchExpanded(true)}
            onMouseLeave={() => {
              if (searchInputRef.current !== document.activeElement) setSearchExpanded(false)
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSearchExpanded(true)
                requestAnimationFrame(() => searchInputRef.current?.focus())
              }}
              className="flex-shrink-0 p-2.5 text-white/90 hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Titles, people, genres"
              className={`bg-transparent text-white placeholder-white/50 text-sm outline-none transition-all duration-300 ease-out ${
                searchExpanded ? 'w-full min-w-0 opacity-100 pr-3' : 'w-0 min-w-0 opacity-0 pr-0'
              }`}
              onFocus={() => setSearchExpanded(true)}
              onBlur={() => setTimeout(() => setSearchExpanded(false), 150)}
              aria-label="Search for titles, people, genres"
            />
          </div>
          {user ? (
            <div
              ref={profileContainerRef}
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-md bg-netflix-red text-white font-semibold text-sm border-2 border-white/20 hover:border-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                title={user.username}
                aria-label="Profile"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                {(user.username || 'U').charAt(0).toUpperCase()}
              </button>
              <div
                className={`absolute right-0 top-full pt-2 transition-[opacity,transform] duration-300 ease-out ${
                  profileOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-1 pointer-events-none'
                }`}
                role="menu"
                aria-hidden={!profileOpen}
              >
                <div className="min-w-[180px] rounded-md bg-black/95 backdrop-blur-md border border-white/10 shadow-xl py-1 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-white/10">
                    <p className="text-white font-medium text-sm truncate">{user.username}</p>
                    <p className="text-white/60 text-xs truncate">{user.email}</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    Account
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    Help Centre
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 transition-colors border-t border-white/10"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
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
