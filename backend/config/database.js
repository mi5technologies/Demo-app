import pg from 'pg'
const { Pool } = pg

let pool

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'attendance_db',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    pool.on('error', (err) => {
      console.error(JSON.stringify({
        level: 'error',
        message: 'Unexpected database error',
        error: err.message
      }))
    })
  }
  return pool
}

export async function initDatabase() {
  const client = await getPool().connect()
  try {
    await client.query('SELECT NOW()')
    console.log(JSON.stringify({ 
      level: 'info', 
      message: 'Database connection established' 
    }))
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Database connection failed',
      error: error.message
    }))
    throw error
  } finally {
    client.release()
  }
}

export async function query(text, params) {
  const start = Date.now()
  try {
    const result = await getPool().query(text, params)
    const duration = Date.now() - start
    console.log(JSON.stringify({
      level: 'debug',
      message: 'Query executed',
      duration,
      rows: result.rowCount
    }))
    return result
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Query error',
      error: error.message,
      query: text
    }))
    throw error
  }
}
