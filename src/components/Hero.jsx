import { useState, useEffect } from 'react'
import { IMAGE_BASE_URL, getTrendingMovies } from '../utils/tmdb'

const Hero = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      const movies = await getTrendingMovies()
      if (movies.length > 0) {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)]
        setFeaturedMovie(randomMovie)
      }
    }
    fetchFeaturedMovie()
  }, [])

  if (!featuredMovie) {
    return (
      <div className="h-screen bg-netflix-black flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-netflix-black border-t-netflix-red" />
        </div>
      </div>
    )
  }

  const truncate = (str, n) => (str?.length > n ? str.slice(0, n - 1) + '...' : str)

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1200ms] ease-out ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${IMAGE_BASE_URL}${featuredMovie.backdrop_path})`,
        }}
      >
        <img
          src={`${IMAGE_BASE_URL}${featuredMovie.backdrop_path}`}
          alt=""
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-netflix-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end md:justify-center pb-24 md:pb-0 md:pt-0 pt-32 px-4 md:px-10 lg:px-16">
        <div className="max-w-xl lg:max-w-2xl animate-fadeInUp">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white drop-shadow-2xl leading-[0.95] mb-4 md:mb-5">
            {featuredMovie.title || featuredMovie.name}
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-xl leading-relaxed drop-shadow-lg mb-6 md:mb-8 line-clamp-3">
            {truncate(featuredMovie.overview, 180)}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="group flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded bg-white text-black font-semibold text-base md:text-lg hover:bg-white/90 active:scale-[0.98] transition-all duration-200 shadow-xl"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play
            </button>
            <button
              type="button"
              className="group flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded bg-white/15 text-white font-semibold text-base md:text-lg backdrop-blur-sm border border-white/30 hover:bg-white/25 active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-t from-netflix-black to-transparent z-[1]" />
    </div>
  )
}

export default Hero
