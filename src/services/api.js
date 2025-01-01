import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/users/register`, userData)
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.detail || 'Registration failed',
    }
  }
}

export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/users/login`, credentials)
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.detail || 'Login failed',
    }
  }
}

export const getUserInfo = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.detail || 'Failed to fetch user info',
    }
  }
}
