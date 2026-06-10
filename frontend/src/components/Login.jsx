import { useState } from 'react'
import axios from 'axios'
import '../styles/Login.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email })
      onLogin(response.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Employee Attendance</h1>
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="demo-info">
          <p>Demo accounts:</p>
          <ul>
            <li>john.doe@company.com (Employee)</li>
            <li>admin@company.com (Admin)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
