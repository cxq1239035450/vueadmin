import { defineStore } from 'pinia'
import { getUserInfo, login } from '@/api/auth'
import type { LoginParams } from '@/types/api'
import { useRoutersStore } from './routers'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null as Record<string, unknown> | null,
  }),
  actions: {
    async getUserInfo() {
      try {
        this.info = await getUserInfo()
        useRoutersStore().getRouters()
      } catch (error) {
        sessionStorage.removeItem('token')
        throw error
      }
    },
    async userLogin(data: LoginParams) {
      const res = await login(data)
      sessionStorage.setItem('token', res.data.access_token)
      this.info = null
    },
  },
})
