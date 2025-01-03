import axios from 'axios'

export const API_BASE_URL = 'http://127.0.0.1:8000'

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptor to handle auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Generic error handler
export const handleApiError = (error) => ({
  data: null,
  error: error.response?.data?.detail || 'An error occurred',
})
