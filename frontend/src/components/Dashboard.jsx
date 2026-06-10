import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function Dashboard({ user, onLogout }) {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [todayRecord, setTodayRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchAttendanceRecords()
  }, [])

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/records?employeeId=${user.id}`)
      setAttendanceRecords(response.data.records)
      setTodayRecord(response.data.today)
      setLoading(false)
    } catch (err) {
      setError('Failed to load attendance records')
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      await axios.post(`${API_URL}/attendance/checkin`, { employeeId: user.id })
      fetchAttendanceRecords()
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed')
    }
  }

  const handleCheckOut = async () => {
    try {
      await axios.post(`${API_URL}/attendance/checkout`, { employeeId: user.id })
      fetchAttendanceRecords()
    } catch (err) {
      setError(err.response?.data?.error || 'Check-out failed')
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1>Attendance Tracker</h1>
          <div className="nav-actions">
            <span className="user-name">{user.name}</span>
            {user.role === 'admin' && (
              <button onClick={() => navigate('/admin')} className="btn-secondary">
                Admin Panel
              </button>
            )}
            <button onClick={onLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user.name}!</h2>
          <p className="department">{user.department}</p>
        </div>

        <div className="today-section">
          <h3>Today's Attendance</h3>
          <div className="today-card">
            <div className="time-display">
              <div className="time-item">
                <span className="label">Check-In</span>
                <span className="time">{todayRecord?.check_in ? formatTime(todayRecord.check_in) : '--:--'}</span>
              </div>
              <div className="time-item">
                <span className="label">Check-Out</span>
                <span className="time">{todayRecord?.check_out ? formatTime(todayRecord.check_out) : '--:--'}</span>
              </div>
            </div>
            <div className="action-buttons">
              {!todayRecord?.check_in && (
                <button onClick={handleCheckIn} className="btn-primary">
                  Check In
                </button>
              )}
              {todayRecord?.check_in && !todayRecord?.check_out && (
                <button onClick={handleCheckOut} className="btn-primary">
                  Check Out
                </button>
              )}
              {todayRecord?.check_in && todayRecord?.check_out && (
                <div className="status-message">You've completed today's attendance</div>
              )}
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="history-section">
          <h3>Attendance History</h3>
          {loading ? (
            <div className="loading">Loading records...</div>
          ) : (
            <div className="records-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => {
                    const duration = record.check_in && record.check_out
                      ? Math.round((new Date(record.check_out) - new Date(record.check_in)) / (1000 * 60 * 60))
                      : null
                    return (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{formatTime(record.check_in)}</td>
                        <td>{formatTime(record.check_out)}</td>
                        <td>{duration ? `${duration}h` : 'In Progress'}</td>
                      </tr>
                    )
                  })}
                  {attendanceRecords.length === 0 && (
                    <tr>
                      <td colSpan="4" className="no-records">No attendance records yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
