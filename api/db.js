import pg from 'pg'

const { Pool } = pg

let pool = null

function getPool() {
  if (pool) return pool

  let connectionString = process.env.DATABASE_URL
  console.log('[db.js] DATABASE_URL present:', !!connectionString)
  console.log('[db.js] DATABASE_URL length:', connectionString?.length || 0)

  if (!connectionString) {
    console.error('[db.js] DATABASE_URL is not set in environment variables')
    return null
  }

  if (connectionString.includes('sslmode=require')) {
    try {
      const u = new URL(connectionString)
      u.searchParams.delete('sslmode')
      connectionString = u.toString()
    } catch (err) {
      console.error('[db.js] Error parsing DATABASE_URL:', err.message)
    }
  }

  const useSSL = connectionString && (connectionString.includes('aivencloud.com') || connectionString.includes('sslmode=require'))

  try {
    pool = new Pool({
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    })
    console.log('[db.js] Pool created successfully')
    return pool
  } catch (err) {
    console.error('[db.js] Error creating pool:', err.message)
    return null
  }
}

export { getPool }

export async function initUsersTable() {
  const currentPool = getPool()
  if (!currentPool) {
    console.error('[initUsersTable] Pool is null, cannot initialize table')
    return
  }
  let client
  try {
    client = await currentPool.connect()
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
    console.log('[initUsersTable] Users table ready')
  } catch (err) {
    console.error('[initUsersTable] Error:', err.message)
  } finally {
    if (client) client.release()
  }
}
