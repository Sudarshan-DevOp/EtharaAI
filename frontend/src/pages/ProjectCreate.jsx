import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'

export default function ProjectCreate() {
  const navigate = useNavigate()
  const { createProject, teams, fetchTeams } = useData()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team: '',
    status: 'active',
    start_date: '',
    end_date: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (teams.length === 0) {
      fetchTeams()
    }
  }, [teams.length, fetchTeams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await createProject(formData)
      success('Project created successfully!')
      navigate('/dashboard')
    } catch (err) {
      error(err.response?.data?.detail || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '2rem' }}>
      <button 
        className="btn-back" 
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      
      <h2>Create New Project</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter project name"
            />
          </div>
          
          <div className="form-group">
            <label>Team *</label>
            <select 
              name="team" 
              value={formData.team} 
              onChange={handleChange} 
              required
            >
              <option value="">Select a Team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter project description (optional)"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || teams.length === 0}
            title={teams.length === 0 ? "You must create a team first" : ""}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
