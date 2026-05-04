import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'
import '../styles/TasksList.css'
import { formatDistanceToNow } from 'date-fns'

export default function TasksList() {
  const navigate = useNavigate()
  const { tasks, fetchTasks, loading } = useData()
  const { error: showError } = useToast()
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigned_to: '',
  })

  useEffect(() => {
    loadTasks()
  }, [filters])

  const loadTasks = async () => {
    try {
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.priority) params.priority = filters.priority
      if (filters.assigned_to) params.assigned_to = filters.assigned_to
      
      await fetchTasks(params)
    } catch (err) {
      showError('Failed to load tasks')
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      in_progress: '#2196f3',
      completed: '#4caf50',
      on_hold: '#9e9e9e',
    }
    return colors[status] || '#999'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
      critical: '#9c27b0',
    }
    return colors[priority] || '#999'
  }

  return (
    <div className="tasks-container animate-fade-in">
      <div className="tasks-header animate-slide-up">
        <h1>Tasks</h1>
        <button className="btn-primary" onClick={() => navigate('/tasks/new')}>
          Create Task
        </button>
      </div>

      <div className="tasks-filters">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          name="assigned_to"
          value={filters.assigned_to}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Users</option>
          <option value="me">My Tasks</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks && tasks.length > 0 ? (
        <div className="tasks-grid animate-slide-up delay-100">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`task-card ${task.is_overdue ? 'overdue' : ''}`}
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <div className="task-badges">
                  <span
                    className="badge status"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                  <span
                    className="badge priority"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              <p className="task-project">{task.project_name}</p>

              <div className="task-card-footer">
                <div className="task-assigned">
                  {task.assigned_to_name ? (
                    <span>Assigned to: {task.assigned_to_name}</span>
                  ) : (
                    <span className="unassigned">Unassigned</span>
                  )}
                </div>
                {task.due_date && (
                  <div className="task-due">
                    {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No tasks found</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/tasks/new')}
          >
            Create Your First Task
          </button>
        </div>
      )}
    </div>
  )
}
