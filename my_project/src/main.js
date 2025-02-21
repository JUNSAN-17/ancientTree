import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 全局样式的导入
import './assets/css/main.css'
import App from './App.vue'
import router from './router'

// 引入 Element Plus 组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入 Element Plus 的中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 创建应用实例
const app = createApp(App)

// 使用 Pinia 状态管理
app.use(createPinia())

// 配置路由
app.use(router)

// 使用 Element Plus 并设置中文语言环境
app.use(ElementPlus, {
  locale: zhCn,  // 设置 Element Plus 为中文语言
})

// 挂载应用
app.mount('#app')
