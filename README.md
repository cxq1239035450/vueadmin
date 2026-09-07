# Vue Admin

基于 Vue 3、TypeScript、Vite、Pinia 和 Element Plus 的后台模板，包含登录、用户列表、定时任务和 AI 对话页面。

## 开发

使用 Node.js 22.18+（测试直接运行 TypeScript 源文件）和 pnpm。

```sh
pnpm install
pnpm dev
```

开发接口地址配置在 `.env.development` 的 `VITE_BASE_URL` 中，默认为 `http://localhost:443`。生产环境默认使用同源接口，可在 `.env.production` 中修改。

## 常用命令

| 命令             | 用途                             |
| ---------------- | -------------------------------- |
| `pnpm dev`       | 启动开发服务                     |
| `pnpm prod`      | 使用生产环境变量启动开发服务     |
| `pnpm typecheck` | 检查 TypeScript 和 Vue 模板类型  |
| `pnpm lint`      | 检查代码，要求无警告             |
| `pnpm test`      | 验证请求去重和 AI 流解析         |
| `pnpm build`     | 先检查类型，再构建到 dist        |
| `pnpm preview`   | 预览构建产物                     |
| `pnpm analyze`   | 构建并生成 visualizer/stats.html |
| `pnpm format`    | 统一源代码格式                   |

## 目录约定

- `src/api`：接口请求和响应类型的使用；AI 流式请求独立使用 fetch。
- `src/types`：接口数据类型。
- `src/utils`：请求去重、日期格式化和消息流解析。
- `src/router`、`src/permission.ts`：静态路由和登录后注册的菜单路由。
- `src/store`：用户、路由和布局状态。
- `src/views`、`src/components`：页面和共享组件。
- `tests`：关键逻辑回归测试。

Vue API 和图标显式导入；Element Plus 模板组件及其样式通过插件按需导入。直接调用 ElMessage 等服务时应导入对应样式。`src/components.d.ts` 由开发服务或构建自动生成，保留此文件以支持首次类型检查。

当前仓库只有前端，接口联调需要启动配套后端。定时任务的新增/修改弹窗目前仍是表单占位，提交与更新流程需要补齐；分页和任务筛选也需要确认后端参数后接入。
