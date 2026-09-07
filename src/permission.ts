import router from '@/router'
import nprogress from 'nprogress'
import { useUserStore } from '@/store/user'

router.beforeEach(async to => {
  nprogress.start()
  if (to.path === '/login') return true
  if (!sessionStorage.getItem('token')) return '/login'

  const userStore = useUserStore()
  if (!userStore.info) {
    try {
      await userStore.getUserInfo()
      return { path: to.path, query: to.query, hash: to.hash, replace: true }
    } catch {
      return '/login'
    }
  }
  return true
})

router.afterEach(() => nprogress.done())
router.onError(() => nprogress.done())
