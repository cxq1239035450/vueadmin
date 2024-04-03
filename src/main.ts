import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './sass/theme.scss'
import './icon/iconfont.css'
import 'virtual:uno.css'
import './permission'
import router from './router'
import { createPinia } from 'pinia'
window.document.documentElement.setAttribute('data-theme', 'light')

createApp(App).use(router).use(createPinia()).mount('#app')
