# MovieFlix - Netflix-style Movie Streaming App

A premium, Netflix-inspired movie streaming application built with React, featuring TMDB API integration, user authentication with PostgreSQL (Aiven), and a beautiful, cinematic UI.

## Features

- 🎬 **Netflix-style UI** - Cinematic design with full-bleed hero sections, smooth animations, and premium UX
- 🔐 **User Authentication** - Secure registration and login with bcrypt password hashing
- 💾 **PostgreSQL Database** - Aiven PostgreSQL for user management
- 🎥 **TMDB Integration** - Browse trending, popular, top-rated, and upcoming movies
- 🎭 **Genre Discovery** - Explore movies by genre (Action, Comedy, etc.)
- 📱 **Fully Responsive** - Beautiful on desktop, tablet, and mobile
- 🎨 **Premium Typography** - Bebas Neue for headings, Inter for body text
- ⚡ **Fast & Smooth** - Optimized animations and transitions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))
- Aiven PostgreSQL database (or any PostgreSQL instance)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ritesh-1912/movieflix_kodnest.git
   cd movieflix_kodnest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your credentials:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
   ```

4. **Run the development servers:**
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

### PostgreSQL (Aiven) - User Authentication

The `users` table is automatically created on server startup:

```sql
CREATE TABLE users (
  "userID" SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SQLite (Optional) - Favorites & Watch History

If `better-sqlite3` is available, the following tables are created:

- **`favorites`** - User's favorite movies
- **`watch_history`** - Movies the user has watched
- **`user_preferences`** - User preferences and settings

## Project Structure

```
movieflix_kodnest/
├── src/
│   ├── api/
│   │   └── auth.js          # Authentication API calls
│   ├── components/
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Hero.jsx         # Featured movie hero section
│   │   ├── MovieRow.jsx     # Horizontal scrolling movie rows
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/
│   │   ├── Home.jsx         # Main landing page (protected)
│   │   ├── Login.jsx        # Login page
│   │   └── Register.jsx     # Registration page
│   ├── utils/
│   │   └── tmdb.js          # TMDB API integration
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── server/
│   ├── db.js                # PostgreSQL connection
│   └── index.js             # Express backend
├── package.json
└── vite.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "phone_number": "string"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Movies (SQLite - Optional)
- `GET /api/favorites` - Get all favorite movies
- `POST /api/favorites` - Add a movie to favorites
- `DELETE /api/favorites/:movieId` - Remove a movie from favorites
- `GET /api/watch-history` - Get watch history
- `POST /api/watch-history` - Add to watch history
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Update user preferences

## User Flow

1. **Registration** → User creates account → Redirected to Login
2. **Login** → User authenticates → Redirected to Home
3. **Home** → Protected route showing Netflix-style landing page with movies
4. **Browse** → Scroll through movie rows, hover for details
5. **Logout** → Sign out → Redirected to Login

## Technologies Used

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Bebas Neue** - Display font (Google Fonts)
- **Inter** - Body font (Google Fonts)

### Backend
- **Express.js** - Web framework
- **PostgreSQL** (via `pg`) - User database (Aiven)
- **bcrypt** - Password hashing
- **SQLite** (better-sqlite3, optional) - Favorites/history
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Passwords never returned in API responses
- ✅ Protected routes require authentication
- ✅ Session persistence via localStorage
- ✅ SSL connection to PostgreSQL
- ✅ Input validation and sanitization

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TMDB_API_KEY` | TMDB API key for movie data | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
