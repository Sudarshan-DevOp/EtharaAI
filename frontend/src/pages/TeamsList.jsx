import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import '../styles/TasksList.css' // Reusing tasks list styles

export default function TeamsList() {
  const navigate = useNavigate()
  const { teams, fetchTeams, loading } = useData()
  const { user } = useAuth()

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  return (
    <div className="tasks-container animate-fade-in">
      <div className="tasks-header animate-slide-up">
        <h1>Teams</h1>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => navigate('/teams/new')}>
            Create Team
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading teams...</div>
      ) : teams && teams.length > 0 ? (
        <div className="tasks-grid animate-slide-up delay-100">
          {teams.map(team => (
            <div
              key={team.id}
              className="task-card"
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <div className="task-card-header">
                <h3>{team.name}</h3>
              </div>
              <p className="task-project">{team.description || 'No description provided'}</p>
              
              <div className="task-card-footer">
                <div className="task-assigned">
                  <span>Members: {team.member_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No teams found</p>
          {user?.role === 'admin' && (
            <button
              className="btn-primary"
              onClick={() => navigate('/teams/new')}
            >
              Create Your First Team
            </button>
          )}
        </div>
      )}
    </div>
  )
}
