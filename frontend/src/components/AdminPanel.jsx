import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/AdminPanel.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function AdminPanel({ user, onLogout }) {
  const [employees, setEmployees] = useState([])
  const [allRecords, setAllRecords] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [employeesRes, recordsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/employees`),
        axios.get(`${API_URL}/admin/attendance`)
      ])
      setEmployees(employeesRes.data.employees)
      setAllRecords(recordsRes.data.records)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load data:', err)
      setLoading(false)
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

  const filteredRecords = selectedEmployee === 'all' 
    ? allRecords 
    : allRecords.filter(r => r.employee_id === parseInt(selectedEmployee))

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1>Admin Panel</h1>
          <div className="nav-actions">
            <span className="user-name">{user.name}</span>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              My Dashboard
            </button>
            <button onClick={onLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <div className="admin-content">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{allRecords.filter(r => r.check_in && !r.check_out).length}</div>
            <div className="stat-label">Currently Checked In</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{allRecords.filter(r => {
              const today = new Date().toDateString()
              return new Date(r.date).toDateString() === today
            }).length}</div>
            <div className="stat-label">Today's Attendance</div>
          </div>
        </div>

        <div className="employees-section">
          <h3>Employees</h3>
          <div className="employees-grid">
            {employees.map(emp => (
              <div key={emp.id} className="employee-card">
                <h4>{emp.name}</h4>
                <p>{emp.email}</p>
                <p className="department">{emp.department}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="records-section">
          <div className="section-header">
            <h3>Attendance Records</h3>
            <select 
              value={selectedEmployee} 
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="employee-filter"
            >
              <option value="all">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading records...</div>
          ) : (
            <div className="records-table">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    const employee = employees.find(e => e.id === record.employee_id)
                    const duration = record.check_in && record.check_out
                      ? Math.round((new Date(record.check_out) - new Date(record.check_in)) / (1000 * 60 * 60))
                      : null
                    return (
                      <tr key={record.id}>
                        <td>{employee?.name || 'Unknown'}</td>
                        <td>{formatDate(record.date)}</td>
                        <td>{formatTime(record.check_in)}</td>
                        <td>{formatTime(record.check_out)}</td>
                        <td>{duration ? `${duration}h` : 'In Progress'}</td>
                      </tr>
                    )
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan="5" className="no-records">No records found</td>
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

export default AdminPanel
