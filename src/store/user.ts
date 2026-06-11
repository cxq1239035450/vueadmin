import { defineStore } from 'pinia'
import { getUserInfo, login } from '@/api/auth'
import type { LoginParams, LoginResult, UserInfo } from '@/type/api'
import router from '@/router'
import { useRoutersStore } from './routers'
import { cancelAll } from '@/utils/cancel-manager'
import { clearTokenCache } from '@/utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null as UserInfo | null,
  }),
  actions: {
    async getUserInfo() {
      try {
        const resData = await getUserInfo()
        this.info = resData as UserInfo
        const routerStore = useRoutersStore()
        routerStore.getRouters()
      } catch {
        sessionStorage.removeItem('token')
        clearTokenCache()
        return Promise.reject(new Error('获取用户信息失败'))
      }
    },
    async userLogin(data: LoginParams) {
      const res = await login(data)
      sessionStorage.setItem('token', res.access_token)
      clearTokenCache()
      return true
    },
    logout() {
      cancelAll()
      clearTokenCache()
      sessionStorage.removeItem('token')
      this.info = null
      router.push('/login')
    },
  },
})
