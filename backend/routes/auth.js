import express from 'express'
import { query } from '../config/database.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const result = await query(
      'SELECT id, name, email, department, role FROM employees WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]
    console.log(JSON.stringify({
      level: 'info',
      message: 'User logged in',
      userId: user.id,
      email: user.email
    }))

    res.json({ 
      success: true,
      user 
    })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Login error',
      error: error.message
    }))
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
