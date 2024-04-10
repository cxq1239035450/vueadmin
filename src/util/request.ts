import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  Canceler,
} from 'axios'
import { addPending, removePending, getPendingKey } from './screen'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // api的base_url
  timeout: 60000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})
const CancelToken = axios.CancelToken
const source = CancelToken.source()
// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.params = {
      ...config.params,
    }

    config.cancelToken = new CancelToken(function executor(source: Canceler) {
      addPending(getPendingKey(config), source)
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  (response): AxiosResponse => {
    removePending(getPendingKey(response.config))
    return response.data
  },
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('重复请求已取消'))
    }
    return Promise.reject(error)
  }
)
export default service
