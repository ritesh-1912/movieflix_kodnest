import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'your-api-key-here'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

export const getTrendingMovies = async () => {
  try {
    const response = await api.get('/trending/movie/week')
    return response.data.results
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return []
  }
}

export const getTopRatedMovies = async () => {
  try {
    const response = await api.get('/movie/top_rated')
    return response.data.results
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    return []
  }
}

export const getPopularMovies = async () => {
  try {
    const response = await api.get('/movie/popular')
    return response.data.results
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return []
  }
}

export const getNowPlayingMovies = async () => {
  try {
    const response = await api.get('/movie/now_playing')
    return response.data.results
  } catch (error) {
    console.error('Error fetching now playing movies:', error)
    return []
  }
}

export const getUpcomingMovies = async () => {
  try {
    const response = await api.get('/movie/upcoming')
    return response.data.results
  } catch (error) {
    console.error('Error fetching upcoming movies:', error)
    return []
  }
}

export const getMovieGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list')
    return response.data.genres
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}

export const getMoviesByGenre = async (genreId) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
      },
    })
    return response.data.results
  } catch (error) {
    console.error('Error fetching movies by genre:', error)
    return []
  }
}

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
}

export { IMAGE_BASE_URL }
