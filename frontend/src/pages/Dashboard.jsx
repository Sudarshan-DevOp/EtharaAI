import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { tasksAPI } from '../api/endpoints'
import '../styles/Dashboard.css'
import { formatDistanceToNow } from 'date-fns'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { fetchTeams, fetchProjects, fetchTasks, teams, projects, tasks } = useData()
  const { success: showSuccess, error: showError } = useToast()
  
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await tasksAPI.dashboard()
        setDashboardData(response.data)
        await fetchTeams()
        await fetchProjects()
        await fetchTasks()
      } catch (err) {
        showError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard animate-fade-in">
      <h1 className="animate-slide-up">Welcome, {user?.first_name || user?.username}!</h1>

      <div className="dashboard-grid animate-slide-up delay-100">
        <div className="stats-section">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{dashboardData?.total_tasks || 0}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{dashboardData?.completed_tasks || 0}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{dashboardData?.in_progress_tasks || 0}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card alert">
              <div className="stat-number">{dashboardData?.overdue_tasks || 0}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        </div>

        <div className="my-tasks-section">
          <h2>My Tasks</h2>
          <div className="mini-stats">
            <div className="mini-stat">
              <span>My Tasks:</span>
              <strong>{dashboardData?.my_tasks || 0}</strong>
            </div>
            <div className="mini-stat">
              <span>In Progress:</span>
              <strong>{dashboardData?.my_in_progress_tasks || 0}</strong>
            </div>
            <div className="mini-stat">
              <span>Overdue:</span>
              <strong className="danger">{dashboardData?.my_overdue_tasks || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-sections animate-slide-up delay-200">
        <div className="quick-section">
          <h2>Teams ({teams?.length || 0})</h2>
          <div className="items-list">
            {teams && teams.length > 0 ? (
              teams.map(team => (
                <div key={team.id} className="item-card">
                  <h4>{team.name}</h4>
                  <p className="text-secondary">Members: {team.member_count}</p>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    View Team
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-state">No teams yet</p>
            )}
          </div>
          {user?.role === 'admin' && (
            <button
              className="btn-primary"
              onClick={() => navigate('/teams/new')}
            >
              Create Team
            </button>
          )}
        </div>

        <div className="quick-section">
          <h2>Recent Projects ({projects?.length || 0})</h2>
          <div className="items-list">
            {projects && projects.length > 0 ? (
              projects.slice(0, 3).map(project => (
                <div key={project.id} className="item-card">
                  <h4>{project.name}</h4>
                  <p className="text-secondary">Status: {project.status}</p>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    View Project
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-state">No projects yet</p>
            )}
          </div>
          {user?.role === 'admin' && (
            <button
              className="btn-primary"
              onClick={() => navigate('/projects/new')}
            >
              Create Project
            </button>
          )}
        </div>
      </div>

      {dashboardData?.top_overdue_tasks && dashboardData.top_overdue_tasks.length > 0 && (
        <div className="overdue-section">
          <h2>Top Overdue Tasks</h2>
          <div className="tasks-list">
            {dashboardData.top_overdue_tasks.map(task => (
              <div key={task.id} className="task-item overdue">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p className="text-secondary">{task.project_name}</p>
                </div>
                <div className="task-meta">
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                  <span className="due-date">Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
