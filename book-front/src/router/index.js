import { createRouter, createWebHistory } from 'vue-router'
import BookHome from '../views/BookHome.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: BookHome
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router