import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfo as fetchUserInfo, login } from '@/api/auth'
import type { LoginParams } from '@/types/api'
import type { UserInfo } from '@/types/auth'
import { tokenStorage } from '@/utils/storage'
import { cancelAllRequests } from '@/utils/request'
import { useRoutersStore } from './routers'

export const useUserStore = defineStore('user', () => {
  const info = ref<UserInfo | null>(null)
  const sessionVersion = ref(0)
  let initialization: Promise<void> | null = null

  async function getUserInfo() {
    // 多次导航共享恢复请求，避免重复请求取消导致误退出。
    if (initialization) return initialization
    const token = tokenStorage.get()
    const version = sessionVersion.value
    const task = (async () => {
      const user = await fetchUserInfo()
      if (
        !token ||
        tokenStorage.get() !== token ||
        version !== sessionVersion.value
      ) {
        throw new Error('登录状态已变更')
      }
      info.value = user
      useRoutersStore().getRouters(user)
    })()
    initialization = task
    try {
      await task
    } finally {
      if (initialization === task) initialization = null
    }
  }
  async function userLogin(data: LoginParams) {
    resetSession()
    const version = sessionVersion.value
    const token = await login(data)
    if (version === sessionVersion.value) tokenStorage.set(token)
  }
  function resetSession() {
    sessionVersion.value++
    initialization = null
    tokenStorage.clear()
    cancelAllRequests()
    info.value = null
    useRoutersStore().resetRoutes()
  }
  return { info, sessionVersion, getUserInfo, userLogin, resetSession }
})
