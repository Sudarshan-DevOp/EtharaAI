import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import '../styles/TasksList.css' // Reusing tasks list styles

export default function ProjectsList() {
  const navigate = useNavigate()
  const { projects, fetchProjects, loading } = useData()
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const getStatusColor = (status) => {
    const colors = {
      active: '#2196f3',
      on_hold: '#ff9800',
      completed: '#4caf50',
      archived: '#9e9e9e',
    }
    return colors[status] || '#999'
  }

  return (
    <div className="tasks-container animate-fade-in">
      <div className="tasks-header animate-slide-up">
        <h1>Projects</h1>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => navigate('/projects/new')}>
            Create Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : projects && projects.length > 0 ? (
        <div className="tasks-grid animate-slide-up delay-100">
          {projects.map(project => (
            <div
              key={project.id}
              className="task-card"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="task-card-header">
                <h3>{project.name}</h3>
                <div className="task-badges">
                  <span
                    className="badge status"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              <p className="task-project">{project.description || 'No description provided'}</p>

              <div className="task-card-footer">
                <div className="task-assigned">
                  <span>Team: {project.team_name || 'No team'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No projects found</p>
          {user?.role === 'admin' && (
            <button
              className="btn-primary"
              onClick={() => navigate('/projects/new')}
            >
              Create Your First Project
            </button>
          )}
        </div>
      )}
    </div>
  )
}
