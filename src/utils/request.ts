import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { appConfig } from '@/config/app'
import { tokenStorage } from '@/utils/storage'
import { expireSession } from '@/utils/session'
import { getPendingKey } from './screen'
export interface RequestOptions extends AxiosRequestConfig {
  skipDedup?: boolean
  skipAuth?: boolean
  silent?: boolean
}
const service = axios.create({
  baseURL: appConfig.baseURL,
  timeout: appConfig.requestTimeout,
})
const pending = new Map<string, AbortController>()
const controllers = new Set<AbortController>()
export function cancelAllRequests() {
  controllers.forEach(controller => controller.abort())
  controllers.clear()
  pending.clear()
}
/** 仅解包 HTTP response.data；业务响应结构在各 API 适配器中处理。 */
export default async function request<T = unknown>(
  options: RequestOptions
): Promise<T> {
  const { skipDedup, skipAuth, silent, ...config } = options
  const controller = new AbortController()
  const key = getPendingKey({ baseURL: appConfig.baseURL, ...config })
  const dedup =
    !skipDedup &&
    !(config.data instanceof FormData) &&
    !(config.data instanceof Blob) &&
    !(config.data instanceof ArrayBuffer)
  if (dedup && pending.has(key) && !pending.get(key)?.signal.aborted)
    throw new axios.CanceledError('重复请求已取消')
  if (dedup) pending.set(key, controller)
  controllers.add(controller)
  const abort = () => controller.abort()
  config.signal?.addEventListener?.('abort', abort)
  if (config.signal?.aborted) controller.abort()
  const token = skipAuth ? null : tokenStorage.get()
  try {
    const response = await service.request<T>({
      ...config,
      signal: controller.signal,
      headers: {
        ...config.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (controller.signal.aborted) throw new axios.CanceledError()
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) throw error
    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === 401 &&
        !skipAuth &&
        token === tokenStorage.get()
      ) {
        expireSession()
      } else if (!silent) {
        const message =
          error.response?.data?.message ?? error.response?.data?.msg
        ElMessage.error(
          typeof message === 'string'
            ? message
            : error.message || '网络请求失败'
        )
      }
    } else if (!silent) ElMessage.error('请求处理失败')
    throw error
  } finally {
    config.signal?.removeEventListener?.('abort', abort)
    controllers.delete(controller)
    if (pending.get(key) === controller) pending.delete(key)
  }
}
