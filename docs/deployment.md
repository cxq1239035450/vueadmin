# 构建与部署

`pnpm build` 读取生产环境变量，输出 dist。环境变量在构建时写入，修改后必须重新构建。
`pnpm build:demo` 输出无需后端的演示站点。
本地 `pnpm preview` 只预览静态构建，不代替生产反向代理。

默认 Hash 路由，静态服务器不需要为业务路径配置 history fallback。

## 同源 API

默认 VITE_BASE_URL=/api。开发代理移除 /api 前缀，例如 /api/user/info → 后端 /user/info。
后端保留 /api 前缀时，删除 vite.config.ts 中的 rewrite。
生产环境应在 Nginx 或网关实现同样的代理行为：

```nginx
server {
    listen 80;
    root /srv/vueadmin/dist;
    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

如使用跨域 API，则配置完整 VITE_BASE_URL，并由后端启用相应 CORS。

## 子目录部署

例如站点位于 /admin/：构建时设置 VITE_PUBLIC_PATH=/admin/，将 dist 文件部署到该目录。
接口前缀独立设置（例如 /api），不会随站点子目录自动变化。浏览器访问 /admin/#/home。
Vite base 和 Hash history 使用同一 BASE_URL。

## 发布检查

运行 `pnpm check` 和 `pnpm test:e2e`，并针对真实后端验证登录、用户信息、分页、权限和 401。
前端仓库中的演示测试不能代替具体项目的后端联调。
VITE\_ 变量公开给浏览器，不放服务端密钥。
