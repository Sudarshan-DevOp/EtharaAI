import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Navigation.css'

export default function Navigation() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar animate-fade-in">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          📊 ProjectManager
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/tasks" className="nav-link">Tasks</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <Link to="/teams" className="nav-link">Teams</Link>

          <div className="navbar-user">
            <span className="user-name">{user?.first_name || user?.username}</span>
            {user?.role === 'admin' && (
              <span className="admin-badge">Admin</span>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
