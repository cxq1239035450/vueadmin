import type { AxiosRequestConfig, Canceler } from 'axios'

const pendingRequests = new Set<string>()

// 保留第一个请求，取消后续相同的请求。
export const addPending = (id: string, cancel: Canceler) => {
  if (pendingRequests.has(id)) {
    cancel('重复请求已取消')
  } else {
    pendingRequests.add(id)
  }
}

export const removePending = (id: string) => {
  pendingRequests.delete(id)
}

const serialize = (data: unknown): string | undefined => {
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

export const getPendingKey = (config: AxiosRequestConfig): string => {
  const { baseURL, url, method, data, params } = config
  return JSON.stringify([
    baseURL,
    url,
    method,
    serialize(data),
    serialize(params),
  ])
}
