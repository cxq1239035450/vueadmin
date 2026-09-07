import type { RouteRecordRaw } from 'vue-router'
export default [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/users',
    meta: { title: '系统管理', icon: 'Setting', permissions: ['user:read'] },
    children: [
      {
        path: '/system/users',
        name: 'SystemUsers',
        component: () => import('@/views/System/Users.vue'),
        meta: { title: '用户管理', icon: 'User', permissions: ['user:read'] },
      },
    ],
  },
] satisfies RouteRecordRaw[]
