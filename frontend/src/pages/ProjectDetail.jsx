import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectsAPI } from '../api/endpoints'
import { useToast } from '../components/Toast'
import '../styles/TaskDetail.css' // Reusing styles

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { error: showError } = useToast()
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await projectsAPI.detail(id)
        setProject(response.data)
      } catch (err) {
        showError('Failed to load project details')
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  if (loading) return <div className="loading">Loading project...</div>
  if (!project) return <div className="error">Project not found</div>

  return (
    <div className="task-detail animate-fade-in">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      
      <div className="task-view animate-slide-up delay-100">
        <div className="task-header">
          <h1>{project.name}</h1>
        </div>

        <div className="task-meta">
          <div className="meta-item">
            <span className={`status ${project.status}`}>{project.status}</span>
          </div>
          <div className="meta-item">
            <strong>Team:</strong> {project.team_name || 'No team assigned'}
          </div>
          {project.start_date && (
            <div className="meta-item">
              <strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}
            </div>
          )}
          {project.end_date && (
            <div className="meta-item">
              <strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}
            </div>
          )}
        </div>

        {project.description && (
          <div className="task-description">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
