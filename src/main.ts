import { createApp } from 'vue'
import App from './App.vue'
import './sass/index.scss'
import './icon/iconfont.css'
import 'virtual:uno.css'
import router from './router'
import './permission'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
window.document.documentElement.setAttribute('data-theme', 'light')

createApp(App).use(ElementPlus).use(router).use(createPinia()).mount('#app')
