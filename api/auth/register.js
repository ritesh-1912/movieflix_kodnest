import bcrypt from 'bcrypt'
import { getPool, initUsersTable } from '../db.js'

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }

    const pool = getPool()
    if (!pool) {
      console.error('[register] Pool is null - DATABASE_URL:', process.env.DATABASE_URL ? 'SET (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET')
      return Response.json(
        {
          error: 'Database not configured. In Vercel, add DATABASE_URL under Settings → Environment Variables and redeploy.',
          debug: process.env.DATABASE_URL ? 'DATABASE_URL is set but pool creation failed' : 'DATABASE_URL is not set',
        },
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    await initUsersTable()

    try {
      const body = await request.json()
      const { username, password, email, phone_number } = body || {}
      if (!username?.trim() || !password || !email?.trim() || !phone_number?.trim()) {
        return Response.json({ error: 'Username, password, email and phone number are required' }, { status: 400 })
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
        return Response.json(
          {
            message: 'Registration successful',
            user: {
              userID: user.userID,
              username: user.username,
              email: user.email,
              phone_number: user.phone_number,
            },
          },
          {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
      } finally {
        client.release()
      }
    } catch (error) {
      if (error.code === '23505') {
        return Response.json({ error: 'Username or email already exists' }, { status: 409 })
      }
      console.error('[register] Error:', error.message)
      return Response.json({ error: error.message || 'Registration failed' }, { status: 500 })
    }
  },
}
