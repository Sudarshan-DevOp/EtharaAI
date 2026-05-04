import api from './client'

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
  getUsers: (search = '') => api.get('/auth/users/', { params: { search } }),
}

// Team endpoints
export const teamsAPI = {
  list: () => api.get('/auth/teams/'),
  create: (data) => api.post('/auth/teams/create/', data),
  detail: (id) => api.get(`/auth/teams/${id}/`),
  update: (id, data) => api.put(`/auth/teams/${id}/`, data),
  delete: (id) => api.delete(`/auth/teams/${id}/`),
  addMember: (id, data) => api.post(`/auth/teams/${id}/members/add/`, data),
  removeMember: (id, data) => api.post(`/auth/teams/${id}/members/remove/`, data),
}

// Project endpoints
export const projectsAPI = {
  list: (params) => api.get('/projects/', { params }),
  create: (data) => api.post('/projects/create/', data),
  detail: (id) => api.get(`/projects/${id}/`),
  update: (id, data) => api.put(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
  dashboard: (id) => api.get(`/projects/${id}/dashboard/`),
}

// Task endpoints
export const tasksAPI = {
  list: (params) => api.get('/tasks/', { params }),
  create: (data) => api.post('/tasks/create/', data),
  detail: (id) => api.get(`/tasks/${id}/`),
  update: (id, data) => api.put(`/tasks/${id}/`, data),
  delete: (id) => api.delete(`/tasks/${id}/`),
  addComment: (id, data) => api.post(`/tasks/${id}/comments/`, data),
  dashboard: () => api.get('/tasks/dashboard/'),
}

export default {
  authAPI,
  teamsAPI,
  projectsAPI,
  tasksAPI,
}
