import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/components/layout/index.vue'
import ErrorPage from '@/components/errorPage/index.tsx'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/',
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
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
})
export default router
