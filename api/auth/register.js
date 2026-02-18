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
    const { username, password, email, phone_number } = req.body || {}
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
      return res.status(201).json({
        message: 'Registration successful',
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
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' })
    }
    console.error('Register error:', error.message)
    return res.status(500).json({ error: error.message || 'Registration failed' })
  }
}
