import { createContext, useContext, useState, useCallback } from 'react'
import { projectsAPI, tasksAPI, teamsAPI } from '../api/endpoints'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      const response = await projectsAPI.list(params)
      setProjects(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch projects')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTasks = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tasksAPI.list(params)
      setTasks(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch tasks')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTeams = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await teamsAPI.list()
      setTeams(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch teams')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createProject = useCallback(async (data) => {
    try {
      const response = await projectsAPI.create(data)
      setProjects([...projects, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project')
      throw err
    }
  }, [projects])

  const createTask = useCallback(async (data) => {
    try {
      const response = await tasksAPI.create(data)
      setTasks([...tasks, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task')
      throw err
    }
  }, [tasks])

  const createTeam = useCallback(async (data) => {
    try {
      const response = await teamsAPI.create(data)
      setTeams([...teams, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create team')
      throw err
    }
  }, [teams])

  const updateProject = useCallback(async (id, data) => {
    try {
      const response = await projectsAPI.update(id, data)
      setProjects(projects.map(p => p.id === id ? response.data : p))
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update project')
      throw err
    }
  }, [projects])

  const updateTask = useCallback(async (id, data) => {
    try {
      const response = await tasksAPI.update(id, data)
      setTasks(tasks.map(t => t.id === id ? response.data : t))
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update task')
      throw err
    }
  }, [tasks])

  const deleteProject = useCallback(async (id) => {
    try {
      await projectsAPI.delete(id)
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete project')
      throw err
    }
  }, [projects])

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksAPI.delete(id)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete task')
      throw err
    }
  }, [tasks])

  const value = {
    projects,
    tasks,
    teams,
    loading,
    error,
    fetchProjects,
    fetchTasks,
    fetchTeams,
    createProject,
    createTask,
    createTeam,
    updateProject,
    updateTask,
    deleteProject,
    deleteTask,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
