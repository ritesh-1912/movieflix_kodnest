import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import path from 'path'
import { fileURLToPath } from 'url'
import pool, { initUsersTable } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null
try {
  const Database = (await import('better-sqlite3')).default
  const dbPath = path.join(__dirname, 'movies.db')
  db = new Database(dbPath)
  db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      backdrop_path TEXT,
      overview TEXT,
      release_date TEXT,
      vote_average REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(movie_id)
    );
    CREATE TABLE IF NOT EXISTS watch_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(movie_id)
    );
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      preference_key TEXT NOT NULL UNIQUE,
      preference_value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
} catch (err) {
  console.warn('SQLite not available (favorites/watch history disabled):', err.message)
}

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// API Routes

// Get all favorites
app.get('/api/favorites', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Favorites not available' })
  try {
    const favorites = db.prepare('SELECT * FROM favorites ORDER BY created_at DESC').all()
    res.json(favorites)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add to favorites
app.post('/api/favorites', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Favorites not available' })
  try {
    const { movie_id, title, poster_path, backdrop_path, overview, release_date, vote_average } = req.body
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO favorites 
      (movie_id, title, poster_path, backdrop_path, overview, release_date, vote_average)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(movie_id, title, poster_path, backdrop_path, overview, release_date, vote_average)
    res.json({ id: result.lastInsertRowid, message: 'Added to favorites' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Remove from favorites
app.delete('/api/favorites/:movieId', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Favorites not available' })
  try {
    const { movieId } = req.params
    const stmt = db.prepare('DELETE FROM favorites WHERE movie_id = ?')
    stmt.run(movieId)
    res.json({ message: 'Removed from favorites' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get watch history
app.get('/api/watch-history', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Watch history not available' })
  try {
    const history = db.prepare('SELECT * FROM watch_history ORDER BY watched_at DESC').all()
    res.json(history)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add to watch history
app.post('/api/watch-history', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Watch history not available' })
  try {
    const { movie_id, title, poster_path } = req.body
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO watch_history 
      (movie_id, title, poster_path)
      VALUES (?, ?, ?)
    `)
    
    const result = stmt.run(movie_id, title, poster_path)
    res.json({ id: result.lastInsertRowid, message: 'Added to watch history' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user preferences
app.get('/api/preferences', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Preferences not available' })
  try {
    const preferences = db.prepare('SELECT * FROM user_preferences').all()
    const prefsObj = {}
    preferences.forEach(p => {
      prefsObj[p.preference_key] = p.preference_value
    })
    res.json(prefsObj)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user preferences
app.post('/api/preferences', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Preferences not available' })
  try {
    const { key, value } = req.body
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_preferences (preference_key, preference_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `)
    
    stmt.run(key, value)
    res.json({ message: 'Preference updated' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ----- Auth (PostgreSQL / Aiven) -----

// Register
app.post('/api/auth/register', async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: 'User database not configured' })
  }
  try {
    const { username, password, email, phone_number } = req.body
    if (!username?.trim() || !password || !email?.trim() || !phone_number?.trim()) {
      return res.status(400).json({ error: 'Username, password, email and phone number are required' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO users (username, password, email, phone_number)
         VALUES ($1, $2, $3, $4)
         RETURNING "userID", username, email, phone_number`,
        [username.trim(), hashedPassword, email.trim(), String(phone_number).trim()]
      )
      const user = result.rows[0]
      res.status(201).json({ message: 'Registration successful', user: { userID: user.userID, username: user.username, email: user.email, phone_number: user.phone_number } })
    } finally {
      client.release()
    }
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' })
    }
    res.status(500).json({ error: error.message || 'Registration failed' })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: 'User database not configured' })
  }
  try {
    const { username, password } = req.body
    if (!username?.trim() || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT "userID", username, password, email, phone_number FROM users WHERE username = $1',
        [username.trim()]
      )
      const user = result.rows[0]
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(401).json({ error: 'Invalid username or password' })
      }
      res.json({
        message: 'Login successful',
        user: {
          userID: user.userID,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
        },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Login failed' })
  }
})

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`)
  if (db) console.log('SQLite (favorites/history) enabled')
  await initUsersTable()
})
