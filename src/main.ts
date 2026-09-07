import { createApp } from 'vue'
import App from './App.vue'
import './sass/index.scss'

import router from './router'
import './permission'

import 'element-plus/theme-chalk/base.css'
import 'nprogress/nprogress.css'
import { createPinia } from 'pinia'
window.document.documentElement.setAttribute('data-theme', 'light')

createApp(App).use(createPinia()).use(router).mount('#app')
