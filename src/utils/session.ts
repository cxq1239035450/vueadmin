import { tokenStorage } from '@/utils/storage'
/** 通过事件解除请求层对 Router / Pinia 的依赖。 */
export function expireSession() {
  if (!tokenStorage.get()) return
  tokenStorage.clear()
  window.dispatchEvent(new Event('app:session-expired'))
}
