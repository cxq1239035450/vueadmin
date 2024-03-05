import router from '@/router'

router.beforeEach((to, from, next) => {
  //   if (to.path === '/login') return next()
  //   const token = localStorage.getItem('token')
  //   if (!token) return next('/login')
  console.log(to)

  next()
})
