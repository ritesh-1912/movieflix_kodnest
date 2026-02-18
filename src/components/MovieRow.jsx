import { useState, useRef, useEffect } from 'react'
import { IMAGE_BASE_URL } from '../utils/tmdb'

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null)
  const [isMoved, setIsMoved] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      setIsMoved(scrollLeft > 0)
    }
  }

  useEffect(() => {
    checkScroll()
    const row = rowRef.current
    if (!row) return
    row.addEventListener('scroll', checkScroll)
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        window.scrollBy(0, e.deltaY)
      }
    }
    row.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      row.removeEventListener('scroll', checkScroll)
      row.removeEventListener('wheel', onWheel)
    }
  }, [movies])

  const handleClick = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="mb-10 md:mb-14 animate-fadeIn">
      <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-normal tracking-tight mb-4 md:mb-5 px-4 md:px-8 text-white">
        {title}
      </h2>
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => handleClick('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-12 md:w-16 bg-gradient-to-r from-black/80 via-black/60 to-transparent hover:from-black/90 hover:via-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <svg
              className="w-7 h-7 md:w-9 md:h-9 text-white drop-shadow-lg hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Movie Row - vertical wheel scrolls the page; use arrows to scroll row horizontally */}
        <div
          ref={rowRef}
          className="flex space-x-2 md:space-x-3 lg:space-x-4 overflow-x-scroll scrollbar-hide px-4 md:px-8 scroll-smooth pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="min-w-[140px] md:min-w-[200px] lg:min-w-[240px] cursor-pointer transform transition-all duration-500 ease-out hover:scale-110 hover:z-30 relative group/item snap-start"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative overflow-hidden rounded-md shadow-lg group-hover/item:shadow-2xl transition-all duration-500">
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover/item:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/300x450?text=No+Image'
                  }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                
                {/* Movie info on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover/item:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2">
                    {movie.title || movie.name}
                  </h3>
                  {movie.vote_average && (
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-xs">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => handleClick('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-12 md:w-16 bg-gradient-to-l from-black/80 via-black/60 to-transparent hover:from-black/90 hover:via-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <svg
              className="w-7 h-7 md:w-9 md:h-9 text-white drop-shadow-lg hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default MovieRow
