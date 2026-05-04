import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { teamsAPI } from '../api/endpoints'
import { useToast } from '../components/Toast'
import '../styles/TaskDetail.css' // Reusing styles

export default function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { error: showError } = useToast()
  
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingMember, setAddingMember] = useState(false)
  const [newMemberId, setNewMemberId] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userOptions, setUserOptions] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await teamsAPI.detail(id)
        setTeam(response.data)
      } catch (err) {
        showError('Failed to load team details')
      } finally {
        setLoading(false)
      }
    }
    loadTeam()
  }, [id])

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!selectedUserId) return

    try {
      const response = await teamsAPI.addMember(id, { user_id: selectedUserId })
      setTeam(response.data)
      setNewMemberId('')
      setUserSearch('')
      setSelectedUserId(null)
      setAddingMember(false)
      showError('Member added successfully!') // Using showError as showSuccess for now if success is missing from destructuring
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to add member.')
    }
  }

  // Effect to fetch users when search changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (userSearch.length < 1) {
        setUserOptions([])
        return
      }
      try {
        const { authAPI } = await import('../api/endpoints')
        const response = await authAPI.getUsers(userSearch)
        setUserOptions(response.data)
      } catch (err) {
        console.error('Failed to fetch users', err)
      }
    }
    
    // Simple debounce
    const timeoutId = setTimeout(() => {
      fetchUsers()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [userSearch])

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return
    
    try {
      const response = await teamsAPI.removeMember(id, { user_id: userId })
      setTeam(response.data)
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to remove member.')
    }
  }

  if (loading) return <div className="loading">Loading team...</div>
  if (!team) return <div className="error">Team not found</div>

  return (
    <div className="task-detail animate-fade-in">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      
      <div className="task-view animate-slide-up delay-100">
        <div className="task-header">
          <h1>{team.name}</h1>
        </div>

        {team.description && (
          <div className="task-description">
            <h3>Description</h3>
            <p>{team.description}</p>
          </div>
        )}
        
        <div className="task-comments">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Members ({team.members?.length || 0})</h3>
            {!addingMember && (
              <button className="btn-secondary" onClick={() => setAddingMember(true)}>
                Add Member
              </button>
            )}
          </div>

          {addingMember && (
            <form onSubmit={handleAddMember} className="comment-form" style={{ marginBottom: '1.5rem', background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)' }}>
              <div className="form-group">
                <label>Search User</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                  />
                  {userOptions.length > 0 && (
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', maxHeight: '150px', overflowY: 'auto' }}>
                      {userOptions.map(user => (
                        <div 
                          key={user.id} 
                          onClick={() => {
                            setSelectedUserId(user.id)
                            setUserSearch(`${user.name} (${user.email})`)
                            setUserOptions([])
                          }}
                          style={{ 
                            padding: '0.5rem 1rem', 
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--border)',
                            background: selectedUserId === user.id ? 'var(--primary-light)' : 'transparent'
                          }}
                        >
                          <strong>{user.name}</strong> <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {userSearch && userOptions.length === 0 && !selectedUserId && (
                    <div style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No users found matching "{userSearch}"</div>
                  )}
                </div>
              </div>
              <div className="form-buttons" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" disabled={!selectedUserId}>Add Member</button>
                <button type="button" className="btn-secondary" onClick={() => {
                  setAddingMember(false)
                  setUserSearch('')
                  setSelectedUserId(null)
                  setUserOptions([])
                }}>Cancel</button>
              </div>
            </form>
          )}

          <div className="comments-list">
            {team.members && team.members.map(member => (
              <div key={member.id} className="comment" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p><strong>{member.first_name || member.username}</strong> ({member.email})</p>
                <button 
                  className="btn-danger" 
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            {(!team.members || team.members.length === 0) && (
              <p>No members yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
