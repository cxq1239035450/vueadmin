import { RouteRecordRaw } from 'vue-router'

const routers: Array<RouteRecordRaw> = [
  {
    path: '/task',
    name: 'task',
    meta: {
      title: '定时任务',
      icon: 'ep-menu',
    },
    children: [
      {
        path: '/taskList',
        name: 'taskList',
        component: () => import('@/views/ScheduledTask/index.vue'),
        meta: {
          title: '任务列表',
          icon: 'Menu',
        },
      },
    ],
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'ep-menu',
    },
    children: [
      {
        path: '/userList',
        name: 'userList',
        component: () => import('@/views/User/index.vue'),
        meta: {
          title: '用户列表',
          icon: 'Menu',
        },
      },
    ],
  },
]
export default routers
