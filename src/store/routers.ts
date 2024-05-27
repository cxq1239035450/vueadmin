import { defineStore } from 'pinia'
import router from '@/router'
import routers from '@/router/asyncRouters'
import { RouteRecordRaw } from 'vue-router'
export const useRoutersStore = defineStore('routers', {
  state: () => ({
    menuList: [] as Array<RouteRecordRaw>,
  }),
  actions: {
    // 设置菜单
    setMenuList(data: any) {
      this.menuList = data
    },
    // 获取菜单
    getMenuList() {
      return this.menuList
    },
    // 设置路由
    async setRouters(data: Array<RouteRecordRaw>) {
      await data.forEach(res => {
        router.addRoute('layout', res)
      })
      console.log(router)
    },
    // 获取路由
    async getRouters() {
      this.menuList = routers
      await this.setRouters(routers)
    },
    // 删除路由
  },
})
