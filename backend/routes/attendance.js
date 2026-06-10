import express from 'express'
import { query } from '../config/database.js'

const router = express.Router()

router.get('/records', async (req, res) => {
  try {
    const { employeeId } = req.query

    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' })
    }

    const recordsResult = await query(
      `SELECT * FROM attendance 
       WHERE employee_id = $1 
       ORDER BY date DESC 
       LIMIT 30`,
      [employeeId]
    )

    const today = new Date().toISOString().split('T')[0]
    const todayResult = await query(
      `SELECT * FROM attendance 
       WHERE employee_id = $1 AND date = $2`,
      [employeeId, today]
    )

    res.json({
      records: recordsResult.rows,
      today: todayResult.rows[0] || null
    })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Failed to fetch records',
      error: error.message
    }))
    res.status(500).json({ error: 'Failed to fetch records' })
  }
})

router.post('/checkin', async (req, res) => {
  try {
    const { employeeId } = req.body

    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' })
    }

    const today = new Date().toISOString().split('T')[0]
    
    const existing = await query(
      'SELECT * FROM attendance WHERE employee_id = $1 AND date = $2',
      [employeeId, today]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already checked in today' })
    }

    const result = await query(
      `INSERT INTO attendance (employee_id, date, check_in) 
       VALUES ($1, $2, NOW()) 
       RETURNING *`,
      [employeeId, today]
    )

    console.log(JSON.stringify({
      level: 'info',
      message: 'Employee checked in',
      employeeId,
      date: today
    }))

    res.json({ 
      success: true, 
      record: result.rows[0] 
    })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Check-in failed',
      error: error.message
    }))
    res.status(500).json({ error: 'Check-in failed' })
  }
})

router.post('/checkout', async (req, res) => {
  try {
    const { employeeId } = req.body

    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' })
    }

    const today = new Date().toISOString().split('T')[0]
    
    const existing = await query(
      'SELECT * FROM attendance WHERE employee_id = $1 AND date = $2',
      [employeeId, today]
    )

    if (existing.rows.length === 0) {
      return res.status(400).json({ error: 'No check-in found for today' })
    }

    if (existing.rows[0].check_out) {
      return res.status(400).json({ error: 'Already checked out today' })
    }

    const result = await query(
      `UPDATE attendance 
       SET check_out = NOW() 
       WHERE employee_id = $1 AND date = $2 
       RETURNING *`,
      [employeeId, today]
    )

    console.log(JSON.stringify({
      level: 'info',
      message: 'Employee checked out',
      employeeId,
      date: today
    }))

    res.json({ 
      success: true, 
      record: result.rows[0] 
    })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Check-out failed',
      error: error.message
    }))
    res.status(500).json({ error: 'Check-out failed' })
  }
})

export default router
