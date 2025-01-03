import { userService } from '@/services/userService'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: !!localStorage.getItem('token'),
  }),

  actions: {
    async fetchUser() {
      if (this.isLoggedIn) {
        const { data, error } = await userService.getUserInfo()
        if (!error) {
          this.user = data
          this.isLoggedIn = true
        } else {
          this.logout()
        }
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
    },

    login(token) {
      localStorage.setItem('token', token)
      this.isLoggedIn = true
    },
  },
})
