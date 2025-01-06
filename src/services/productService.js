import { apiClient, handleApiError } from './api'

export const productService = {
  async getProducts(params = {}) {
    try {
      const { data } = await apiClient.get('/admin/products', { params })
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async createProduct(productData) {
    try {
      const { data } = await apiClient.post('/admin/products', productData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async updateProduct(productId, productData) {
    try {
      const { data } = await apiClient.put(`/admin/products/${productId}`, productData)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async deleteProduct(productId) {
    try {
      const { data } = await apiClient.delete(`/admin/products/${productId}`)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getProduct(productId) {
    try {
      const { data } = await apiClient.get(`/admin/products/${productId}`)
      return { data, error: null }
    } catch (error) {
      return handleApiError(error)
    }
  },
}
