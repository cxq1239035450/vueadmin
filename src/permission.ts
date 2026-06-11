import router from '@/router'
import nprogress from 'nprogress'
import { useUserStore } from '@/store/user'
import { cancelAll } from '@/utils/cancel-manager'
import { clearTokenCache } from '@/utils/request'

router.beforeEach(async (to, from, next) => {
  nprogress.start()
  if (to.path === '/login') {
    cancelAll()
    clearTokenCache()
    next()
  } else {
    const token = sessionStorage.getItem('token')

    if (token) {
      const userStore = useUserStore()
      if (!userStore.info) {
        await userStore.getUserInfo()
        return next({ ...to })
      }
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(() => {
  nprogress.done()
})
