import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { addPending, removePending, getPendingKey } from './screen'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

service.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.cancelToken = new axios.CancelToken(cancel => {
    addPending(getPendingKey(config), cancel)
  })
  return config
})

service.interceptors.response.use(
  response => {
    removePending(getPendingKey(response.config))
    return response.data
  },
  error => {
    // 重复请求不拥有 pending 记录，不能移除仍在执行的首个请求。
    if (axios.isCancel(error)) return Promise.reject(error)
    if (error.config) removePending(getPendingKey(error.config))
    ElMessage.error(
      error.response?.data?.msg || error.message || '网络请求失败'
    )
    return Promise.reject(error)
  }
)

// 响应拦截器已解包 response.data，对外类型与实际返回值保持一致。
export default function request<T = unknown>(config: AxiosRequestConfig) {
  return service.request<T, T>(config)
}
