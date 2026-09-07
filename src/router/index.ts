import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'
import Layout from '@/components/layout/index.vue'
export const homeRoute: RouteRecordRaw = {
  path: '/home',
  name: 'Home',
  component: () => import('@/views/Home/index.vue'),
  meta: { title: '工作台', icon: 'House' },
}
export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/index.vue'),
      meta: { public: true, title: '登录' },
    },
    {
      path: '/',
      name: 'layout',
      redirect: '/home',
      component: Layout,
      children: [
        homeRoute,
        {
          path: '/403',
          name: 'Forbidden',
          component: () => import('@/components/errorPage/index.vue'),
          props: { code: '403' },
          meta: { title: '无访问权限', hidden: true },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/components/errorPage/index.vue'),
          props: { code: '404' },
          meta: { title: '页面不存在', hidden: true },
        },
      ],
    },
  ],
})
