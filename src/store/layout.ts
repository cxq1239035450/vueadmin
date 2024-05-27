import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isCollapse: false,
  }),
  actions: {
    // 切换菜单展开/收起
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
})
