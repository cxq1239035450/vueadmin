import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './sass/index.scss'
import 'virtual:uno.css'
import 'nprogress/nprogress.css'
import router from './router'
import './permission'
import { useLayoutStore } from '@/store/layout'
const app = createApp(App)
app.use(createPinia())
useLayoutStore().applyTheme()
app.use(router).mount('#app')
