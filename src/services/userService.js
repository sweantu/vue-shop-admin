import { apiClient, handleApiError } from './api'

export const userService = {
  // Auth endpoints
  async register(userData) {
    try {
      const { data } = await apiClient.post('/users/register', userData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async login(credentials) {
    try {
      const { data } = await apiClient.post('/users/login', credentials)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getUserInfo() {
    try {
      const { data } = await apiClient.get('/users/me')
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async updateProfile(userData) {
    try {
      const { data } = await apiClient.put('/users/me', userData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Admin user management endpoints
  async getUsers(params = {}) {
    try {
      const { data } = await apiClient.get('/admin/users', { params })
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async createUser(userData) {
    try {
      const { data } = await apiClient.post('/admin/users', userData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async updateUser(userId, userData) {
    try {
      const { data } = await apiClient.put(`/admin/users/${userId}`, userData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async deleteUser(userId) {
    try {
      const { data } = await apiClient.delete(`/admin/users/${userId}`)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
