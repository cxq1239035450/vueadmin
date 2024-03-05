import type { Canceler } from 'axios'
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
