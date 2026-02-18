import pg from 'pg'

const { Pool } = pg

let connectionString = process.env.DATABASE_URL
if (connectionString && connectionString.includes('sslmode=require')) {
  try {
    const u = new URL(connectionString)
    u.searchParams.delete('sslmode')
    connectionString = u.toString()
  } catch (_) {}
}

const useSSL = connectionString && (connectionString.includes('aivencloud.com') || connectionString.includes('sslmode=require'))

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    })
  : null

export async function initUsersTable() {
  if (!pool) return
  let client
  try {
    client = await pool.connect()
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        "userID" SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
  } catch (err) {
    console.error('Init users table:', err.message)
  } finally {
    if (client) client.release()
  }
}
