import { apiClient, handleApiError } from './api'

export const uploadService = {
  async uploadImages(formData) {
    try {
      const { data } = await apiClient.post('/files/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
