import { defineStore } from 'pinia'
import { getUserInfo, login } from '@/api/auth'
import { anyObject } from '@/type/userType'
import router from '@/router'
import { useRoutersStore } from './routers'
export const useUserStore = defineStore('user', {
  state: () => ({
    info: null as Object | null,
  }),
  actions: {
    async getUserInfo() {
      // 异步操作
      try {
        const resData = await getUserInfo()
        // this.$patch(state => {
        //   state.info = resData
        // })

        this.info = resData
        const routerStore = useRoutersStore()
        routerStore.getRouters()
      } catch {
        sessionStorage.removeItem('token')
        return Promise.reject(new Error('获取用户信息失败'))
      }
    },
    async userLogin(data: anyObject) {
      const res = await login(data)
      sessionStorage.setItem('token', res.data.access_token)
      return true
    },
    setUserInfoStore() {
      router.push('/')
    },
  },
})
