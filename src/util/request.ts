import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  Canceler,
} from 'axios'
import { addPending, removePending } from './screen'
let key = 0
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // api的base_url
  timeout: 60000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
const CancelToken = axios.CancelToken
const source = CancelToken.source()
// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.params = {
      ...config.params,
      key: '40871c14a12b4079b9b505de9a211af4',
    }
    config.cancelToken = new CancelToken(function executor(source: Canceler) {
      addPending(String(1), source)
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
    removePending(String(1))
    return response
  },
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject({
        code: 0,
        message: '重复请求已取消',
      })
    }
    return Promise.reject(error)
  }
)
export default service
