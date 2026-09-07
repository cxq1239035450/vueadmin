import router from '@/router'
import nprogress from 'nprogress'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { tokenStorage } from '@/utils/storage'
import { hasAccess, safeRedirect } from '@/utils/access'
import { appConfig } from '@/config/app'
nprogress.configure({ showSpinner: false })
router.beforeEach(async to => {
  nprogress.start()
  if (to.meta.public) {
    if (to.path === '/login' && tokenStorage.get())
      return safeRedirect(to.query.redirect)
    return true
  }
  if (!tokenStorage.get())
    return { path: '/login', query: { redirect: to.fullPath } }
  const userStore = useUserStore()
  if (!userStore.info) {
    const sessionVersion = userStore.sessionVersion
    try {
      await userStore.getUserInfo()
      return { path: to.path, query: to.query, hash: to.hash, replace: true }
    } catch {
      if (sessionVersion !== userStore.sessionVersion) return false
      userStore.resetSession()
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
  const info = userStore.info
  if (to.matched.some(record => !hasAccess(info, record.meta))) return '/403'
  return true
})
router.afterEach(to => {
  document.title = to.meta.title
    ? `${to.meta.title} · ${appConfig.title}`
    : appConfig.title
  nprogress.done()
})
router.onError(() => {
  nprogress.done()
  ElMessage.error('页面加载失败，请刷新后重试')
})
window.addEventListener('app:session-expired', () => {
  const redirect = router.currentRoute.value.fullPath
  useUserStore().resetSession()
  ElMessage.warning('登录已过期，请重新登录')
  void router.replace({ path: '/login', query: { redirect } })
})
