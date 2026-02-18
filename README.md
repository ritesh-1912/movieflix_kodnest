# MovieFlix - Netflix-like Movie App

A modern, Netflix-inspired movie streaming application built with React and Vite, featuring TMDB API integration and SQLite database.

## Features

- 🎬 Netflix-like UI with dark theme
- 🎥 Browse trending, popular, top-rated, and upcoming movies
- 🎭 Genre-based movie discovery (Action, Comedy, etc.)
- 💾 SQLite database for favorites and watch history
- 🔍 Search functionality
- 📱 Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

3. **Run the development servers:**
   ```bash
   npm run dev:all
   ```
   
   This will start both:
   - Frontend server on `http://localhost:3000`
   - Backend API server on `http://localhost:3001`

   Or run them separately:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   npm run server
   ```

## Database Schema

The application uses SQLite with the following tables:

### `favorites`
- Stores user's favorite movies
- Fields: id, movie_id, title, poster_path, backdrop_path, overview, release_date, vote_average, created_at

### `watch_history`
- Tracks movies the user has watched
- Fields: id, movie_id, title, poster_path, watched_at

### `user_preferences`
- Stores user preferences and settings
- Fields: id, preference_key, preference_value, updated_at

The database file (`movies.db`) will be automatically created in the `server` directory on first run.

## Project Structure

```
movie_app/
├── src/
│   ├── components/     # React components
│   │   ├── Header.jsx  # Navigation header
│   │   ├── Hero.jsx    # Featured movie hero section
│   │   └── MovieRow.jsx # Horizontal scrolling movie rows
│   ├── pages/
│   │   └── Home.jsx    # Main landing page
│   ├── utils/
│   │   └── tmdb.js     # TMDB API integration
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── server/
│   └── index.js        # Express backend with SQLite
├── package.json
└── vite.config.js
```

## API Endpoints

- `GET /api/favorites` - Get all favorite movies
- `POST /api/favorites` - Add a movie to favorites
- `DELETE /api/favorites/:movieId` - Remove a movie from favorites
- `GET /api/watch-history` - Get watch history
- `POST /api/watch-history` - Add to watch history
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Update user preferences

## Technologies Used

- **Frontend:**
  - React 18
  - Vite
  - React Router
  - Tailwind CSS
  - Axios

- **Backend:**
  - Express.js
  - SQLite (better-sqlite3)
  - CORS

## License

MIT
