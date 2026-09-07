# Vue Admin

可复制到不同业务项目的 Vue 3 后台基础模板。使用 TypeScript、Vite、Pinia、Vue Router、Element Plus 和 UnoCSS。默认开发模式无需后端即可运行，生产构建默认连接真实 API。

## 快速启动

Node.js 22.18+，pnpm 10.27。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

开发演示账号：`admin / 123456`（全部权限）、`viewer / 123456`（用户只读）、`guest / 123456`（仅工作台，可体验 403）。
演示列表保存在浏览器 localStorage，演示登录账号独立固定；修改列表不会修改演示登录凭据。

## 用于新项目

在模板目录执行：

```sh
pnpm create-project ../my-admin
cd ../my-admin
pnpm install --frozen-lockfile
pnpm dev
```

生成器拒绝覆盖已有目录，不复制 Git 历史、node_modules、构建产物或 `*.local` 配置。
在新项目中修改 `package.json` 的名称，再复制 `.env.example` 为 `.env.development.local`：

```dotenv
VITE_APP_TITLE=我的管理后台
VITE_STORAGE_PREFIX=my-admin
VITE_DEMO=false
VITE_ENABLE_LEGACY_MODULES=false
VITE_BASE_URL=/api
VITE_PUBLIC_PATH=/
API_PROXY_TARGET=http://localhost:3000
```

不同项目应设置不同的 storage prefix。登录令牌保存在当前标签页的 sessionStorage，主题和演示数据使用带项目前缀的 localStorage。

## 已包含

- 登录校验、站内回跳、刷新恢复、退出清理、HTTP 401 登录过期处理。
- 模块化路由、按角色和权限生成菜单、路由守卫及按钮权限、403 / 404。
- 响应式布局、面包屑、页面标题、主题与侧栏偏好保存、Element Plus 中文。
- 请求超时、Bearer 令牌、AbortController 取消、重复请求拦截与可选静默错误。
- 通用列表 composable：分页、筛选、重置、加载/错误/空状态、竞态保护及删空末页回退。
- 完整用户 CRUD 示例：表单校验、提交锁定、删除确认、管理员和只读账号。
- 类型检查、ESLint、回归测试、浏览器测试、CI、新项目生成脚本。

## 项目结构

```text
src/
  config/app.ts              品牌、环境、业务开关
  api/                      后端适配：URL / 参数 / 响应转换
  mock/                     仅演示模式调用的本地数据实现
  router/modules/           业务模块路由
  router/asyncRouters.ts     启用模块的注册入口
  router/legacy.ts           原有定时任务、用户、AI 可选路由
  permission.ts             登录和权限守卫
  store/                    用户、路由、布局状态
  composables/              useTable / usePermission
  components/               布局、PageContainer、错误页
  types/                    统一领域类型和路由 meta 类型
  utils/                    请求、令牌、权限、竞态等工具
  views/System/Users.vue    可复制的 CRUD 页面
scripts/create-project.mjs  新项目生成器
tests/                     核心行为回归
e2e/                       浏览器流程测试
docs/                      后端、扩展和部署说明
```

## 命令

| 命令                          | 用途                            |
| ----------------------------- | ------------------------------- |
| `pnpm dev`                    | 默认本地演示开发                |
| `pnpm typecheck`              | TypeScript 和 Vue 模板检查      |
| `pnpm lint`                   | ESLint，零警告                  |
| `pnpm test`                   | 核心逻辑回归测试                |
| `pnpm test:e2e`               | 浏览器测试，首次需安装 Chromium |
| `pnpm check`                  | 类型、lint、单元测试、生产构建  |
| `pnpm build`                  | 真实 API 模式构建到 dist        |
| `pnpm build:demo`             | 可独立预览的演示构建            |
| `pnpm preview`                | 预览最近一次构建                |
| `pnpm analyze`                | 生成 visualizer/stats.html      |
| `pnpm format`                 | 格式化源码                      |
| `pnpm create-project ../name` | 复制成新项目                    |

首次运行浏览器测试：`pnpm exec playwright install chromium`。
Windows 已安装 Edge 时可使用 PowerShell：`$env:PLAYWRIGHT_CHANNEL='msedge'; pnpm test:e2e`。

## 接入和扩展

详见 [架构与接入](docs/architecture.md) 和 [部署](docs/deployment.md)。

原定时任务和 AI 页面通过 `VITE_ENABLE_LEGACY_MODULES=true` 在真实 API 模式下启用。它们仍依赖原后端；定时任务编辑弹窗、执行语义和分页契约尚未完成联调，不能视作通用模板的已完成业务能力。新项目默认关闭这些模块。

自动导入类型和组件类型文件由 Vite 生成并保留在版本库，以支持首次构建前的类型检查。框架工具与新页面优先显式导入，Element Plus 组件按需加载。

前端权限控制用于导航与交互，真实后端必须独立校验每个接口的角色和权限。模板不假定所有后端都实现刷新令牌；需要时在认证适配层增加。
