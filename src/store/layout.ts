import { defineStore } from 'pinia'
import { appConfig } from '@/config/app'
const key = `${appConfig.storagePrefix}:layout`
function readPreferences(): { collapsed: boolean; dark: boolean } {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}')
    return { collapsed: saved?.collapsed === true, dark: saved?.dark === true }
  } catch {
    return { collapsed: false, dark: false }
  }
}
const preferences = readPreferences()
export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isCollapse: preferences.collapsed,
    dark: preferences.dark,
    mobileOpen: false,
  }),
  actions: {
    save() {
      localStorage.setItem(
        key,
        JSON.stringify({ collapsed: this.isCollapse, dark: this.dark })
      )
    },
    toggleCollapse() {
      if (window.matchMedia('(max-width: 760px)').matches)
        this.mobileOpen = !this.mobileOpen
      else {
        this.isCollapse = !this.isCollapse
        this.save()
      }
    },
    applyTheme() {
      document.documentElement.classList.toggle('dark', this.dark)
      document.documentElement.dataset.theme = this.dark ? 'dark' : 'light'
    },
    toggleTheme() {
      this.dark = !this.dark
      this.applyTheme()
      this.save()
    },
  },
})
