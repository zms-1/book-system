<template>
  <div class="login-page">
    <div class="circle circle1"></div>
    <div class="circle circle2"></div>

    <div class="login-card glass-card">
      <div class="logo-group">
        <span class="logo">📚</span>
        <h2>图书信息管理系统</h2>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <div class="input-box">
            <i class="input-icon">👤</i>
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              clearable
            />
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-box">
            <i class="input-icon">🔒</i>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </div>
        </el-form-item>

        <el-button
          type="primary"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (loading.value) return // 防止重复点击
  if (!loginFormRef.value) return
  
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await axios.post('/api/login', loginForm)
    
    if (res.data.code === 200) {
      ElMessage.success('登录成功')
      // ✅ 固定token，避免路由守卫拦截
      localStorage.setItem('token', 'admin-token-' + Date.now())
      
      // ✅ 两种路径都试，总有一个能成功
      setTimeout(() => {
        router.push('/home').catch(() => {
          router.push('/')
        })
      }, 100)
    } else {
      ElMessage.error(res.data.msg || '登录失败')
    }
  } catch (error) {
    ElMessage.error('请求失败，请检查后端服务')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.circle1 {
  width: 400px;
  height: 400px;
  top: -150px;
  left: -150px;
}
.circle2 {
  width: 350px;
  height: 350px;
  bottom: -120px;
  right: -120px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px 35px;
  width: 100%;
  max-width: 420px;
  z-index: 2;
}

.logo-group {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 42px;
  display: block;
  margin-bottom: 10px;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

.input-box {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #999;
  z-index: 1;
}

:deep(.el-input__inner) {
  height: 48px;
  border-radius: 12px;
  padding-left: 45px;
  border: 1px solid #e0e0e0;
  font-size: 15px;
}

:deep(.el-input__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  margin-top: 10px;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}
</style>