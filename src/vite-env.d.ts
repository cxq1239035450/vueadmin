/// <reference types="vite/client" />
// import 引入vue文件报错问题
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
