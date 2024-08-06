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
    async setRouters(data: Array<RouteRecordRaw>, parent?: RouteRecordRaw) {
      await data.forEach(res => {
        console.log(res, parent, parent?.name, '================')

        router.addRoute(parent?.name || 'layout', res)
        if (res.children) {
          this.setRouters(res.children as unknown as Array<RouteRecordRaw>, res)
        }
      })
      // console.log(router.getRoutes())
    },
    // 获取路由
    async getRouters() {
      this.menuList = routers
      await this.setRouters(routers)
    },
    // 删除路由
  },
})
