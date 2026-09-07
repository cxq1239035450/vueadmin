import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import router, { homeRoute } from '@/router'
import routes from '@/router/asyncRouters'
import { hasAccess, type AccessSubject } from '@/utils/access'
const removers: (() => void)[] = []
function filterMenus(
  routes: RouteRecordRaw[],
  subject: AccessSubject
): RouteRecordRaw[] {
  return routes.flatMap(route => {
    if (route.meta?.hidden || !hasAccess(subject, route.meta ?? {})) return []
    const children = route.children
      ? filterMenus(route.children, subject)
      : undefined
    if (route.children?.length && !children?.length) return []
    return [{ ...route, children } as RouteRecordRaw]
  })
}
export const useRoutersStore = defineStore('routers', {
  state: () => ({ menuList: [] as RouteRecordRaw[] }),
  actions: {
    getRouters(subject: AccessSubject) {
      this.resetRoutes()
      // 守卫单独校验权限，直接访问无权限页面时明确显示 403。
      routes.forEach(route => removers.push(router.addRoute('layout', route)))
      this.menuList = filterMenus([homeRoute, ...routes], subject)
    },
    resetRoutes() {
      removers.splice(0).forEach(remove => remove())
      this.menuList = []
    },
  },
})
