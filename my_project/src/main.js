import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 全局样式的导入
import './assets/css/main.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')


