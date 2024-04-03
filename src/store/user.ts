import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/user'
import { anyObject } from '@/type/userType'
export const useUserStore = defineStore('user', {
  state: () => ({
    info: {},
  }),
  actions: {
    async getUserInfoStore(data: anyObject) {
      // 异步操作
      try {
        const resData = await getUserInfo(data)
        // this.$patch(state => {
        //   state.info = resData
        // })
        this.info = resData
      } catch {
        return Promise.reject(new Error('获取用户信息失败'))
      }
    },
  },
})
