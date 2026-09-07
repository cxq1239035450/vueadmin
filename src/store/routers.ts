import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import routes from '@/router/asyncRouters'

export const useRoutersStore = defineStore('routers', {
  state: () => ({
    menuList: [] as RouteRecordRaw[],
  }),
  actions: {
    getRouters() {
      this.menuList = routes
      // addRoute 会同时注册子路由，无需再次递归。
      routes.forEach(route => {
        if (!route.name || !router.hasRoute(route.name)) {
          router.addRoute('layout', route)
        }
      })
    },
  },
})
