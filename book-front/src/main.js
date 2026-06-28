import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)

// 配置后端 API 地址（前后端同域部署，使用相对路径）
axios.defaults.baseURL = ''

app.config.globalProperties.$axios = axios
app.mount('#app')
