import express from 'express'
import { query } from '../config/database.js'

const router = express.Router()

router.get('/employees', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, department, role FROM employees ORDER BY name'
    )

    res.json({ employees: result.rows })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Failed to fetch employees',
      error: error.message
    }))
    res.status(500).json({ error: 'Failed to fetch employees' })
  }
})

router.get('/attendance', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM attendance 
       ORDER BY date DESC, check_in DESC 
       LIMIT 100`
    )

    res.json({ records: result.rows })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Failed to fetch attendance records',
      error: error.message
    }))
    res.status(500).json({ error: 'Failed to fetch attendance records' })
  }
})

export default router
