import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    public?: boolean
    roles?: string[]
    permissions?: string[]
    activeMenu?: string
  }
}
