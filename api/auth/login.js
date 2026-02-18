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
      console.error('[login] Pool is null - DATABASE_URL:', process.env.DATABASE_URL ? 'SET (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET')
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
      const { username, password } = body || {}
      if (!username?.trim() || !password) {
        return Response.json({ error: 'Username and password are required' }, { status: 400 })
      }

      const client = await pool.connect()
      try {
        const result = await client.query(
          'SELECT "userID", username, password, email, phone_number FROM users WHERE username = $1',
          [username.trim()]
        )
        const user = result.rows[0]
        if (!user) {
          return Response.json({ error: 'Invalid username or password' }, { status: 401 })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
          return Response.json({ error: 'Invalid username or password' }, { status: 401 })
        }
        return Response.json(
          {
            message: 'Login successful',
            user: {
              userID: user.userID,
              username: user.username,
              email: user.email,
              phone_number: user.phone_number,
            },
          },
          {
            status: 200,
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
      console.error('[login] Error:', error.message)
      return Response.json({ error: error.message || 'Login failed' }, { status: 500 })
    }
  },
}
