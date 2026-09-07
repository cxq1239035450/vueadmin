/** 新项目优先修改环境变量。 */
export const demoEnabled = import.meta.env.VITE_DEMO === 'true'
export const legacyEnabled =
  import.meta.env.VITE_ENABLE_LEGACY_MODULES === 'true'

export const appConfig = Object.freeze({
  title: import.meta.env.VITE_APP_TITLE || 'Vue Admin',
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || 'vueadmin',
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  requestTimeout: 30_000,
  demo: demoEnabled,
  legacyModules: legacyEnabled,
})
