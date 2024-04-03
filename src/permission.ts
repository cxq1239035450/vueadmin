import router from '@/router'

router.beforeEach((to, from, next) => {
  // if (to.path === '/login') return next()
  // const token = localStorage.getItem('token')
  // try {
  //   if (!token) {
  //     return next('/login')
  //   } else {
  //     next()
  //   }
  // } catch (error) {
  //   return next('/login')
  // }
  next()
})
