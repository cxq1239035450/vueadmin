import type { Canceler, InternalAxiosRequestConfig } from 'axios'
//保留第一个请求 后面相同的请求就会被取消掉
const pendingPromise = new Map<string, Canceler>()

export const addPending = (id: string, cancel: Canceler) => {
  if (!pendingPromise.has(id)) {
    pendingPromise.set(id, cancel)
  } else {
    cancel()
  }
}
export const removePending = (id: string) => {
  console.log(pendingPromise, id, '================')

  pendingPromise.delete(id)
}
export const getPending = (id: string) => {
  return pendingPromise.get(id)
}
export const clearPending = () => {
  for (const key in pendingPromise) {
    getPending(key)!()
  }
  pendingPromise.clear()
}
export const getPendingKey = (config: InternalAxiosRequestConfig): string => {
  const { url, method, data, params } = config
  return url + method! + toString(data) + toString(params)
}
// 未完善 key可能重复
const toString = (data: any) => {
  if (typeof data === 'string') {
    return data
  }
  try {
    return JSON.stringify(data)
  } catch {
    return ''
  }
}
