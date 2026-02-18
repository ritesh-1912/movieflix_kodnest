# MovieFlix – Netflix-style Movie Streaming App

A premium, Netflix-inspired movie streaming application built with React and Vite, featuring TMDB API integration, user authentication with PostgreSQL (Aiven), serverless auth on Vercel, and a cinematic UI with profile dropdown, expandable search, and smooth scrolling.

---

## Features

- **Netflix-style UI** – Full-bleed hero, horizontal movie rows, smooth animations, dark theme
- **User authentication** – Register and login with bcrypt; session via localStorage
- **PostgreSQL (Aiven)** – User storage; optional SQLite locally for favorites/watch history
- **TMDB integration** – Trending, popular, top-rated, upcoming, and genre-based movies
- **Profile dropdown** – Account, Help Centre, Sign out; smooth fade in/out
- **Expandable search** – Search icon expands to bar with placeholder “Titles, people, genres”
- **Responsive layout** – Desktop, tablet, and mobile
- **Footer** – Company/Legal/Help links, social icons (Facebook, Instagram, Twitter, YouTube), copyright
- **Smooth scroll** – Native trackpad/mouse scroll over movie rows (no custom wheel handler)
- **Vercel deployment** – Frontend + serverless auth API routes; see [VERCEL_SETUP.md](./VERCEL_SETUP.md)

---

## Tech Stack

### Frontend

| Technology    | Purpose / version |
|---------------|--------------------|
| **React**     | UI (^18.2.0)       |
| **Vite**      | Build, dev server, HMR (^5.0.8) |
| **React Router** | Client-side routing (^6.20.0) |
| **Tailwind CSS**  | Styling (^3.4.0)   |
| **PostCSS**   | CSS processing (^8.4.32) |
| **Autoprefixer** | Vendor prefixes (^10.4.16) |
| **Axios**     | HTTP client (^1.6.2) |
| **Bebas Neue** | Display font (Google Fonts) |
| **Inter**     | Body font (Google Fonts) |

### Backend (local / Express)

| Technology    | Purpose / version |
|---------------|--------------------|
| **Node.js**   | Runtime (v16+)     |
| **Express**   | API server (^4.18.2) |
| **pg**        | PostgreSQL client (^8.11.3) |
| **bcrypt**    | Password hashing (^5.1.1) |
| **dotenv**    | Env vars (^16.3.1) |
| **cors**      | CORS (^2.8.5)      |
| **better-sqlite3** | Optional SQLite (^9.2.2, optionalDependencies) |

### Backend (Vercel serverless)

| Technology    | Purpose |
|---------------|---------|
| **Vercel Serverless Functions** | `/api/auth/login`, `/api/auth/register` (Web Standard `fetch`) |
| **Node.js**   | Runtime for API routes |
| **pg**        | PostgreSQL (same as local) |
| **bcrypt**    | Password hashing (same as local) |

### Database

| Technology    | Purpose |
|---------------|---------|
| **PostgreSQL (Aiven)** | Users table (username, email, password hash, phone_number) |
| **SQLite (optional)** | Favorites, watch history, preferences (local Express only) |

### DevOps / Tooling

| Technology    | Purpose |
|---------------|---------|
| **Git**       | Version control |
| **GitHub**    | Repo hosting |
| **Vercel**    | Hosting, serverless functions, env vars |
| **concurrently** | Run frontend + Express together (^8.2.2) |

---

## Prerequisites

- **Node.js** v16 or higher  
- **npm** (or yarn)  
- **TMDB API key** – [Get one](https://www.themoviedb.org/settings/api)  
- **PostgreSQL** – e.g. Aiven PostgreSQL (or any Postgres instance)

---

## Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/ritesh-1912/movieflix_kodnest.git
   cd movieflix_kodnest
   npm install
   ```

2. **Environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   DATABASE_URL=postgres://user:password@host:port/dbname?sslmode=require
   ```

3. **Run locally**
   ```bash
   npm run dev:all
   ```
   - Frontend: http://localhost:3000  
   - Backend: http://localhost:3001  

   Or separately: `npm run dev` and `npm run server`.

---

## Project structure

```
movieflix_kodnest/
├── api/                    # Vercel serverless (auth only)
│   ├── db.js               # PostgreSQL pool for serverless
│   ├── auth/
│   │   ├── login.js
│   │   └── register.js
├── server/                  # Express (local)
│   ├── db.js
│   └── index.js
├── src/
│   ├── api/auth.js         # Auth API client
│   ├── components/
│   │   ├── Header.jsx      # Nav, search bar, profile dropdown
│   │   ├── Hero.jsx
│   │   ├── MovieRow.jsx
│   │   ├── Footer.jsx      # Links + social icons
│   │   └── ProtectedRoute.jsx
│   ├── context/AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── utils/
│   │   ├── tmdb.js
│   │   └── authErrors.js   # User-facing error messages
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── vercel.json             # Build + output for Vercel
├── vite.config.js
├── tailwind.config.js
├── package.json
├── README.md
└── VERCEL_SETUP.md         # Vercel env + redeploy guide
```

---

## API

### Auth (used by frontend; implemented in Express and in Vercel `api/`)

- **POST /api/auth/register** – Body: `{ username, password, email, phone_number }`
- **POST /api/auth/login** – Body: `{ username, password }`

### Optional (Express only, when SQLite is available)

- `GET/POST /api/favorites`, `DELETE /api/favorites/:movieId`
- `GET/POST /api/watch-history`, `GET/POST /api/preferences`

---

## Database schema (PostgreSQL)

```sql
CREATE TABLE users (
  "userID" SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Created automatically on first use (Express or Vercel).

---

## Environment variables

| Variable            | Required | Description |
|---------------------|----------|-------------|
| `VITE_TMDB_API_KEY` | Yes      | TMDB API key (client + build) |
| `DATABASE_URL`      | Yes      | PostgreSQL URL (server + Vercel API routes) |

---

## Deploying to Vercel

- Set **`DATABASE_URL`** in Vercel → Settings → Environment Variables (Production, and Preview if needed).
- **Redeploy** after adding or changing env vars.
- Full steps and troubleshooting: **[VERCEL_SETUP.md](./VERCEL_SETUP.md)**.

---

## Scripts

| Command        | Description |
|----------------|-------------|
| `npm run dev`  | Start Vite dev server |
| `npm run build`| Production build (Vite) |
| `npm run preview` | Preview production build |
| `npm run server`  | Start Express API |
| `npm run dev:all` | Frontend + Express together |

---

## License

MIT

## Contributing

Contributions are welcome; feel free to open a Pull Request.
