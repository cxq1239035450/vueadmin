import type { RouteRecordRaw } from 'vue-router'
import { demoEnabled, legacyEnabled } from '@/config/app'
import system from './modules/system'
import legacy from './legacy'

// 新业务模块在这里显式注册，禁用模块不进入菜单和路由。
const routes: RouteRecordRaw[] = [
  ...system,
  ...(legacyEnabled && !demoEnabled ? legacy : []),
]
export default routes
