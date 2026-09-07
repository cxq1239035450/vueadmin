# 架构与后端接入

## 依赖方向

页面 → composable / API → request。请求层通过 session-expired 事件通知应用，不导入 Router 或 Pinia。
业务数据结构集中在 types；HTTP 层只解包 Axios 的 response.data，不假设业务 code 或 data 包装。

## 修改四个入口

1. 环境变量：品牌、接口地址、缓存前缀、演示/业务模块开关。
2. `src/api/auth.ts`：将后端登录响应转换为 token 字符串，将用户信息转换为 UserInfo。
3. `src/api/system-users.ts`：转换列表、创建、更新、删除接口。
4. `src/router/asyncRouters.ts`：注册项目需要的模块。

`src/api/user.ts`、`task.ts`、`ai.ts` 是保留的旧业务适配器，新模块使用独立文件。

## 默认真实 API 契约

下列是前端期望的默认契约，并不代表仓库内含对应后端。

| 接口              | 请求                            | 响应                                                                |
| ----------------- | ------------------------------- | ------------------------------------------------------------------- |
| POST /auth/login  | { username, password }          | { data: { access_token } }                                          |
| GET /user/info    | Bearer token                    | { id, username, nickname?, roles: string[], permissions: string[] } |
| GET /users        | page, pageSize, keyword, status | { list: AdminUser[], total: number }                                |
| POST /users       | UserForm                        | 任意成功响应 / 204                                                  |
| PATCH /users/:id  | UserForm                        | 任意成功响应 / 204                                                  |
| DELETE /users/:id | 无请求体                        | 任意成功响应 / 204                                                  |

用户示例字段：id、username、email、role（admin / viewer）、status（enabled / disabled）、createdAt（ISO 时间）。
页码从 1 开始，pageSize 默认 10。真实业务可替换 UserForm 和对应页面。

例如后端返回 `{ code: 0, data: { records, count } }`：

```ts
const result = await request<BackendPage>({
  url: '/members/list',
  params: { pageNo: query.page, limit: query.pageSize, name: query.keyword },
  signal,
  silent: true,
})
if (result.code !== 0) throw new Error(result.message || '加载失败')
return { list: result.data.records.map(toAdminUser), total: result.data.count }
```

业务错误码在适配器中判断；HTTP 401 统一失效登录；403 等普通 HTTP 错误不会强制退出。
`silent: true` 允许页面自己显示表单/列表错误。登录及 CRUD 示例已采用局部错误反馈。
`skipAuth: true` 用于登录等公共请求，`skipDedup: true` 用于允许重复执行的操作。
文件上传传 FormData，无需手工 Content-Type；可通过 signal 取消请求。

## 权限规则

- `meta.roles`：任一角色匹配。
- `meta.permissions`：要求全部权限；用户被明确授予 `permissions: ['*']` 时可通过所有权限判断。
- 同时配置角色与权限时，两项都必须满足。父子路由都校验。
- 未返回角色/权限默认空数组，不自动提升为管理员。
- `hidden` 只隐藏菜单，不授予或拒绝路由访问。
- 没有权限字段的路由要求登录，公共页面显式设置 `public: true`。
- 已启用但无权限的路由显示 403，未启用/不存在的路由显示 404。
- 退出会删除已注册业务路由并取消 HTTP 请求，重新登录按新用户重新生成菜单。

按钮权限：

```vue
<script setup lang="ts">
import { usePermission } from '@/composables/usePermission'
const { can } = usePermission()
</script>
<template><el-button v-if="can('order:create')">新建订单</el-button></template>
```

## 增加一个模块

在 `src/router/modules/orders.ts` 定义路由：

```ts
import type { RouteRecordRaw } from 'vue-router'
export default [
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders/index.vue'),
    meta: { title: '订单管理', icon: 'Menu', permissions: ['order:read'] },
  },
] satisfies RouteRecordRaw[]
```

在 asyncRouters 中导入并展开。路径统一使用绝对路径、路由 name 保持全局唯一。
嵌套路由组填写 redirect，菜单和面包屑来自同一份路由定义。新图标在 Sidebar/menuItem.vue 的显式映射中注册。
复制 Users.vue 的 PageContainer、useTable 和 API 适配方式即可创建列表页；不要求业务页面使用固定的表格列配置。

## 演示与真实环境

演示层通过动态 import 按需加载，不发起后端请求。生产配置 VITE_DEMO=false。
默认生产构建会裁剪演示数据和未启用的旧业务分块；演示账号仅在本地演示层有效，不是后端凭据。
不要使用演示层作为生产鉴权实现。

主题由 Element Plus CSS 变量控制，统一修改 src/sass/theme.scss。根布局不缓存登录/业务组件，避免切换账号残留旧页面状态。
