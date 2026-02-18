import bcrypt from 'bcrypt'
import { pool, initUsersTable } from '../db.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!pool) {
    return res.status(503).json({ error: 'User database not configured' })
  }

  await initUsersTable()

  try {
    const { username, password } = req.body || {}
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
      return res.status(200).json({
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
    console.error('Login error:', error.message)
    return res.status(500).json({ error: error.message || 'Login failed' })
  }
}
