import router from '@/router'
import nprogress from 'nprogress'
router.beforeEach((to, from, next) => {
  nprogress.start()
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(() => {
  nprogress.done()
})
