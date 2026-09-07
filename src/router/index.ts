import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'
import Layout from '@/components/layout/index.vue'
import ErrorPage from '@/components/errorPage/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
  },
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/index.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    component: ErrorPage,
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
