import router from '@/router'
import nprogress from 'nprogress'
import { useUserStore } from '@/store/user'

router.beforeEach(async (to, from, next) => {
  nprogress.start()
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')

    if (token) {
      const userStore = useUserStore()
      if (!userStore.info) {
        await userStore.getUserInfo({ token: 1111 })
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
