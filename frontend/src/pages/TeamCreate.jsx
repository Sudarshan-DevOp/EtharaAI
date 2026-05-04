import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'

export default function TeamCreate() {
  const navigate = useNavigate()
  const { createTeam } = useData()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await createTeam(formData)
      success('Team created successfully!')
      navigate('/dashboard')
    } catch (err) {
      error(err.response?.data?.detail || 'Failed to create team')
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
    <div className="card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
      <button 
        className="btn-back" 
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      
      <h2>Create New Team</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Team Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter team name"
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter team description (optional)"
          ></textarea>
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
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  )
}
