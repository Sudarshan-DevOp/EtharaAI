import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../api/endpoints'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const register = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register(data)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setToken(response.data.token)
      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login(data)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setToken(response.data.token)
      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.updateProfile(data)
      localStorage.setItem('user', JSON.stringify(response.data))
      setUser(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Update failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    token,
    loading,
    error,
    is_authenticated: !!token,
    is_admin: user?.role === 'admin',
    register,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
