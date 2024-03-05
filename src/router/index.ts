import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw,
} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    // alias: '/login',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
  },
]
const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
})
export default router
