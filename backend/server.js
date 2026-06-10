import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import attendanceRoutes from './routes/attendance.js'
import adminRoutes from './routes/admin.js'
import healthRoutes from './routes/health.js'
import { initDatabase } from './config/database.js'

dotenv.config()

const app = express()
const PORT = process.env.API_PORT || 3000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(JSON.stringify({
    timestamp,
    method: req.method,
    path: req.path,
    ip: req.ip
  }))
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/health', healthRoutes)

app.get('/', (req, res) => {
  res.json({ 
    message: 'Employee Attendance API',
    version: '1.0.0',
    status: 'running'
  })
})

let server

async function startServer() {
  try {
    await initDatabase()
    console.log(JSON.stringify({ 
      level: 'info', 
      message: 'Database initialized successfully' 
    }))
    
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(JSON.stringify({ 
        level: 'info', 
        message: `Server running on port ${PORT}`,
        port: PORT,
        env: process.env.NODE_ENV || 'development'
      }))
    })
  } catch (error) {
    console.error(JSON.stringify({ 
      level: 'error', 
      message: 'Failed to start server',
      error: error.message 
    }))
    process.exit(1)
  }
}

process.on('SIGTERM', () => {
  console.log(JSON.stringify({ level: 'info', message: 'SIGTERM received, shutting down gracefully' }))
  if (server) {
    server.close(() => {
      console.log(JSON.stringify({ level: 'info', message: 'Server closed' }))
      process.exit(0)
    })
  }
})

startServer()

export default app
