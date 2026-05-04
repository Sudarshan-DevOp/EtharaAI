import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tasksAPI } from '../api/endpoints'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import '../styles/TaskDetail.css'
import { formatDistanceToNow } from 'date-fns'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [comment, setComment] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
  })

  useEffect(() => {
    loadTask()
  }, [id])

  const loadTask = async () => {
    try {
      const response = await tasksAPI.detail(id)
      setTask(response.data)
      setFormData({
        title: response.data.title,
        description: response.data.description,
        status: response.data.status,
        priority: response.data.priority,
        due_date: response.data.due_date,
      })
    } catch (err) {
      showError('Failed to load task')
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

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await tasksAPI.update(id, formData)
      setTask(response.data)
      setEditing(false)
      showSuccess('Task updated successfully')
    } catch (err) {
      showError('Failed to update task')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      const response = await tasksAPI.addComment(id, { content: comment })
      setTask({
        ...task,
        comments: [...task.comments, response.data]
      })
      setComment('')
      setCommenting(false)
      showSuccess('Comment added')
    } catch (err) {
      showError('Failed to add comment')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id)
        showSuccess('Task deleted')
        navigate('/tasks')
      } catch (err) {
        showError('Failed to delete task')
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!task) return <div className="error">Task not found</div>

  const canEdit = user?.email === task.created_by_email
  const isAssigned = task.assigned_to?.id === user?.id

  return (
    <div className="task-detail animate-fade-in">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      {editing ? (
        <form onSubmit={handleUpdate} className="task-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="task-view animate-slide-up delay-100">
          <div className="task-header">
            <h1>{task.title}</h1>
            <div className="task-actions">
              {canEdit && (
                <>
                  <button className="btn-secondary" onClick={() => setEditing(true)}>Edit</button>
                  <button className="btn-danger" onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          </div>

          <div className="task-meta">
            <div className="meta-item">
              <span className={`status ${task.status}`}>{task.status}</span>
              <span className={`priority ${task.priority}`}>{task.priority}</span>
            </div>
            <div className="meta-item">
              <strong>Project:</strong> {task.project_name}
            </div>
            <div className="meta-item">
              <strong>Assigned to:</strong> {task.assigned_to_name || 'Unassigned'}
            </div>
            {task.due_date && (
              <div className="meta-item">
                <strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}
                {task.is_overdue && <span className="overdue-badge">Overdue</span>}
              </div>
            )}
          </div>

          {task.description && (
            <div className="task-description">
              <h3>Description</h3>
              <p>{task.description}</p>
            </div>
          )}

          <div className="task-comments">
            <h3>Comments ({task.comments?.length || 0})</h3>
            
            {!commenting && (
              <button className="btn-secondary" onClick={() => setCommenting(true)}>
                Add Comment
              </button>
            )}

            {commenting && (
              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  required
                ></textarea>
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">Post Comment</button>
                  <button type="button" className="btn-secondary" onClick={() => setCommenting(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="comments-list">
              {task.comments && task.comments.map(c => (
                <div key={c.id} className="comment">
                  <div className="comment-header">
                    <strong>{c.user_name}</strong>
                    <span className="comment-time">
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p>{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
