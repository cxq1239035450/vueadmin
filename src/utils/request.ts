import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { generateKey, addPending, removePending, cancelAll } from './cancel-manager'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** 是否跳过去重（如轮询、重复提交场景），默认 false */
    skipDedup?: boolean
  }
}

let cachedToken: string | null = null

function getToken(): string | null {
  if (cachedToken === null) {
    cachedToken = sessionStorage.getItem('token')
  }
  return cachedToken
}

export function clearTokenCache(): void {
  cachedToken = null
}

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    if (config.skipDedup) return config

    const key = generateKey(config)
    const controller = new AbortController()
    if (!addPending(key, controller)) {
      return Promise.reject(new axios.Cancel(`重复请求已取消: ${config.url}`))
    }
    config.signal = controller.signal
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    removePending(generateKey(response.config))
    return response.data
  },
  (error) => {
    if (error.config && !error.config.skipDedup) {
      removePending(generateKey(error.config))
    }
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    const { response } = error
    if (response?.status === 401) {
      cancelAll()
      clearTokenCache()
      sessionStorage.removeItem('token')
      ElMessage.error('登录已过期，请重新登录')
      window.location.hash = '#/login'
      return Promise.reject(error)
    }
    const msg = response?.data?.msg || error.message || '请求失败'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default service
