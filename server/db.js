import pg from 'pg'

const { Pool } = pg

let connectionString = process.env.DATABASE_URL
// Strip sslmode from URL so our ssl config is used (avoid self-signed cert rejection)
if (connectionString && connectionString.includes('sslmode=require')) {
  const u = new URL(connectionString)
  u.searchParams.delete('sslmode')
  connectionString = u.toString()
}

// Aiven (and many cloud Postgres) use SSL with certs that may be self-signed
const useSSL = connectionString && (connectionString.includes('aivencloud.com') || process.env.DATABASE_URL?.includes('sslmode=require'))

const pool = connectionString
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
    console.log('PostgreSQL users table ready')
  } catch (err) {
    console.error('Failed to init users table:', err.message)
  } finally {
    if (client) client.release()
  }
}

export default pool
