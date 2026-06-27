import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import BookHome from '../views/BookHome.vue'

const routes = [
  // 根路径 → 自动跳登录页
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: BookHome
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：没登录不让进首页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    // 已登录还去登录页 → 踢回首页
    if (token) return next('/home')
    else return next()
  }
  // 非登录页，没token → 去登录
  if (!token) return next('/login')
  next()
})

export default router