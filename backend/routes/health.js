import express from 'express'
import { getPool } from '../config/database.js'

const router = express.Router()

let isReady = false

setTimeout(() => {
  isReady = true
}, 5000)

router.get('/live', async (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

router.get('/ready', async (req, res) => {
  if (!isReady) {
    return res.status(503).json({ 
      status: 'not ready',
      message: 'Application is starting up'
    })
  }

  try {
    const pool = getPool()
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    
    res.status(200).json({ 
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Readiness check failed',
      error: error.message
    }))
    
    res.status(503).json({ 
      status: 'not ready',
      database: 'disconnected',
      error: error.message
    })
  }
})

export default router
