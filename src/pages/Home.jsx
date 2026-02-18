import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieGenres,
  getMoviesByGenre,
} from '../utils/tmdb'

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [comedyMovies, setComedyMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true)
        const [
          trending,
          topRated,
          popular,
          nowPlaying,
          upcoming,
          genres,
        ] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getPopularMovies(),
          getNowPlayingMovies(),
          getUpcomingMovies(),
          getMovieGenres(),
        ])

        setTrendingMovies(trending)
        setTopRatedMovies(topRated)
        setPopularMovies(popular)
        setNowPlayingMovies(nowPlaying)
        setUpcomingMovies(upcoming)

        // Get Action and Comedy movies
        const actionGenre = genres.find((g) => g.name === 'Action')
        const comedyGenre = genres.find((g) => g.name === 'Comedy')

        if (actionGenre) {
          const action = await getMoviesByGenre(actionGenre.id)
          setActionMovies(action)
        }
        if (comedyGenre) {
          const comedy = await getMoviesByGenre(comedyGenre.id)
          setComedyMovies(comedy)
        }
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMovies()
  }, [])

  if (loading) {
    return (
      <div className="h-screen bg-netflix-black flex flex-col items-center justify-center gap-8">
        <span className="text-netflix-red text-4xl font-display font-bold tracking-tight">MOVIEFLIX</span>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-800 border-t-netflix-red" />
          <p className="text-neutral-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-netflix-black min-h-screen">
      <Header />
      <Hero />
      <div className="relative -mt-20 md:-mt-32 lg:-mt-40 z-10 pb-16">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Top Rated" movies={topRatedMovies} />
        <MovieRow title="Popular on MovieFlix" movies={popularMovies} />
        <MovieRow title="Now Playing" movies={nowPlayingMovies} />
        <MovieRow title="Upcoming" movies={upcomingMovies} />
        {actionMovies.length > 0 && (
          <MovieRow title="Action Movies" movies={actionMovies} />
        )}
        {comedyMovies.length > 0 && (
          <MovieRow title="Comedy Movies" movies={comedyMovies} />
        )}
      </div>
    </div>
  )
}

export default Home
