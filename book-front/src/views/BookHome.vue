<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="header glass-card">
      <div class="header-left">
        <span class="logo-icon">📚</span>
        <h1 class="title">图书信息管理系统</h1>
      </div>
      <div class="user-info">
        <span class="username-tag">当前账号：{{ username }}</span>
        <button class="btn btn-danger" @click="logout">退出登录</button>
      </div>
    </header>

    <div class="main-container">
      <!-- 侧边栏（美化版） -->
      <aside class="sidebar glass-card">
        <div 
          class="sidebar-item" 
          :class="{ active: activeMenu === 'book' }"
          @click="handleMenuClick('book')"
        >
          <span class="menu-icon">📚</span>
          <span class="menu-text">图书管理</span>
        </div>
        <div 
          class="sidebar-item" 
          :class="{ active: activeMenu === 'user' }"
          @click="handleMenuClick('user')"
        >
          <span class="menu-icon">👤</span>
          <span class="menu-text">用户中心</span>
        </div>
        <div 
          class="sidebar-item" 
          :class="{ active: activeMenu === 'setting' }"
          @click="handleMenuClick('setting')"
        >
          <span class="menu-icon">⚙️</span>
          <span class="menu-text">系统设置</span>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="content-area">
        <!-- 图书管理页面 -->
        <div v-if="activeMenu === 'book'">
          <!-- 数据统计卡片（美化版） -->
          <div class="stats-container">
            <div class="stat-card glass-card">
              <div class="stat-icon">📚</div>
              <div class="stat-info">
                <h3>{{ totalBooks }}</h3>
                <p>图书总数</p>
              </div>
            </div>
            <div class="stat-card glass-card">
              <div class="stat-icon">🏷️</div>
              <div class="stat-info">
                <h3>{{ uniqueCategories }}</h3>
                <p>分类数量</p>
              </div>
            </div>
            <div class="stat-card glass-card">
              <div class="stat-icon">📦</div>
              <div class="stat-info">
                <h3>{{ totalStock }}</h3>
                <p>库存总量</p>
              </div>
            </div>
          </div>

          <!-- 搜索+新增区域 -->
          <div class="search-bar glass-card">
            <div class="search-input-group">
              <span class="search-icon">🔍</span>
              <input 
                v-model="searchName" 
                @input="handleSearch"
                class="input" 
                placeholder="输入书名搜索" 
              />
            </div>
            <button class="btn btn-primary" @click="openAddDialog">新增图书</button>
          </div>

          <!-- 图书表格 -->
          <div class="table-container glass-card">
            <el-table 
              :data="bookList" 
              border 
              stripe
              style="width: 100%"
              class="custom-table"
            >
              <el-table-column prop="id" label="编号" width="80" />
              <el-table-column prop="book_name" label="书名" />
              <el-table-column prop="author" label="作者" />
              <el-table-column prop="category" label="分类" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="stock" label="库存" />
              <el-table-column prop="isbn" label="ISBN" />
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <button class="btn btn-success" @click="openEditDialog(scope.row)">编辑</button>
                  <button class="btn btn-danger" @click="deleteBook(scope.row)">删除</button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                @current-change="handlePageChange"
                layout="prev, pager, next, jumper, ->, total"
              />
            </div>
          </div>
        </div>

        <!-- 用户中心页面（重点美化） -->
        <div v-if="activeMenu === 'user'" class="user-center glass-card">
          <div class="page-header">
            <span class="page-icon">👤</span>
            <h2>用户中心</h2>
          </div>

          <div class="user-profile-card">
            <!-- 头像区域 -->
            <div class="avatar-section">
              <div class="avatar-wrapper" @click="triggerUpload">
                <img v-if="avatarUrl" :src="avatarUrl" class="user-avatar-img" />
                <div v-else class="user-avatar">
                  {{ username.charAt(0).toUpperCase() }}
                </div>
                <div class="avatar-overlay">
                  <span>📷</span>
                </div>
                <input 
                  type="file" 
                  ref="avatarInput" 
                  accept="image/*" 
                  style="display: none" 
                  @change="handleAvatarChange"
                />
              </div>
              <p class="avatar-tip">点击头像更换</p>
            </div>

            <!-- 用户信息 -->
            <div class="info-section">
              <div class="info-item">
                <span class="info-label">用户名</span>
                <span class="info-value">{{ username }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">角色</span>
                <span class="info-value role-tag">管理员</span>
              </div>
              <div class="info-item">
                <span class="info-label">登录时间</span>
                <span class="info-value">{{ loginTime }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button class="btn btn-primary btn-lg" @click="openPasswordDialog">修改密码</button>
            <button class="btn btn-success btn-lg" @click="triggerUpload">更换头像</button>
            <button v-if="avatarUrl" class="btn btn-danger btn-lg" @click="removeAvatar">删除头像</button>
          </div>
        </div>

        <!-- 系统设置页面 -->
        <div v-if="activeMenu === 'setting'" class="system-setting glass-card">
          <div class="page-header">
            <span class="page-icon">⚙️</span>
            <h2>系统设置</h2>
          </div>
          <div class="setting-list">
            <div class="setting-item">
              <div class="setting-label">
                <span class="setting-icon">📄</span>
                <span>每页显示条数</span>
              </div>
              <el-select v-model="pageSize" @change="handlePageSizeChange">
                <el-option label="5条" :value="5" />
                <el-option label="10条" :value="10" />
                <el-option label="20条" :value="20" />
              </el-select>
            </div>
            <div class="setting-item">
              <div class="setting-label">
                <span class="setting-icon">🎨</span>
                <span>主题模式</span>
              </div>
              <el-radio-group v-model="themeMode">
                <el-radio label="light">浅色模式</el-radio>
                <el-radio label="dark">深色模式</el-radio>
              </el-radio-group>
            </div>
            <div class="setting-item">
              <div class="setting-label">
                <span class="setting-icon">✅</span>
                <span>系统状态</span>
              </div>
              <span class="status-tag">正常运行中</span>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle" 
      width="600px"
      class="glass-dialog"
    >
      <el-form :model="formData" label-width="80px">
        <el-form-item label="书名">
          <el-input v-model="formData.book_name" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formData.author" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="formData.category" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="formData.price" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model.number="formData.stock" />
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="formData.isbn" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <button class="btn" @click="dialogVisible = false">取消</button>
        <button class="btn btn-primary" @click="saveBook">保存</button>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="旧密码">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <button class="btn" @click="passwordDialogVisible = false">取消</button>
        <button class="btn btn-primary" @click="changePassword">确认修改</button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 全局配置
const username = ref('zms')
const loginTime = ref(new Date().toLocaleString())
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const bookList = ref([])
const searchName = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新增图书')
const formData = ref({})

// 用户中心
const passwordDialogVisible = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
// 头像相关
const avatarUrl = ref(localStorage.getItem('userAvatar') || '')
const avatarInput = ref(null)

// 系统设置
const themeMode = ref('light')

// 菜单激活
const activeMenu = ref('book')

// 菜单点击
const handleMenuClick = (menu) => {
  activeMenu.value = menu
  if(menu === 'book') ElMessage.success('图书管理')
  if(menu === 'user') ElMessage.success('用户中心')
  if(menu === 'setting') ElMessage.success('系统设置')
}

// 计算统计数据
const totalBooks = computed(() => bookList.value.length)
const uniqueCategories = computed(() => {
  const categories = new Set(bookList.value.map(item => item.category))
  return categories.size
})
const totalStock = computed(() => {
  return bookList.value.reduce((sum, item) => sum + Number(item.stock), 0)
})

// 获取图书列表
const getBookList = async () => {
  try {
    const res = await axios.get('/api/book', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        book_name: searchName.value
      }
    })
    if (res.data.code === 200) {
      bookList.value = res.data.data.list
      total.value = res.data.data.total
    }
  } catch (error) {
    ElMessage.error('获取图书列表失败')
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getBookList()
}

// 分页切换
const handlePageChange = () => {
  getBookList()
}

// 每页条数切换
const handlePageSizeChange = () => {
  currentPage.value = 1
  getBookList()
}

// 打开新增弹窗
const openAddDialog = () => {
  dialogTitle.value = '新增图书'
  formData.value = {}
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (row) => {
  dialogTitle.value = '编辑图书'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 保存图书
const saveBook = async () => {
  try {
    if (formData.value.id) {
      await axios.put(`/api/book/${formData.value.id}`, formData.value)
      ElMessage.success('编辑成功')
    } else {
      await axios.post('/api/book', formData.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getBookList()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 删除图书
const deleteBook = async (row) => {
  if (confirm('确定要删除吗？')) {
    try {
      await axios.delete(`/api/book/${row.id}`)
      ElMessage.success('删除成功')
      getBookList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }
}

// 修改密码
const openPasswordDialog = () => {
  passwordDialogVisible.value = true
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const changePassword = () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm.value
  if (!oldPassword || !newPassword || !confirmPassword) {
    return ElMessage.error('请填写完整信息')
  }
  if (newPassword !== confirmPassword) {
    return ElMessage.error('两次密码不一致')
  }
  ElMessage.success('密码修改成功')
  passwordDialogVisible.value = false
}

// 头像上传相关
const triggerUpload = () => {
  avatarInput.value.click()
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    return ElMessage.error('请选择图片文件')
  }
  if (file.size > 2 * 1024 * 1024) {
    return ElMessage.error('图片大小不能超过2MB')
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    avatarUrl.value = event.target.result
    localStorage.setItem('userAvatar', avatarUrl.value)
    ElMessage.success('头像上传成功')
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  avatarUrl.value = ''
  localStorage.removeItem('userAvatar')
  ElMessage.success('头像已删除')
}

// 退出登录
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    router.push('/login')
    ElMessage.success('退出成功')
  }
}

// 初始化
onMounted(() => {
  getBookList()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

/* 玻璃卡片通用样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
}

.username-tag {
  color: #666;
}

/* 主容器 */
.main-container {
  display: flex;
  flex: 1;
  gap: 16px;
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  padding: 16px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.sidebar-item:hover {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.sidebar-item.active {
  background: linear-gradient(90deg, rgba(52, 152, 219, 0.2) 0%, transparent 100%);
  color: #3498db;
  border-left-color: #3498db;
}

.menu-icon {
  font-size: 20px;
}

.menu-text {
  font-size: 16px;
  font-weight: 500;
}

/* 主内容区 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 统计卡片 */
.stats-container {
  display: flex;
  gap: 16px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 12px;
}

.stat-info h3 {
  font-size: 32px;
  color: #3498db;
  margin: 0 0 4px 0;
  font-weight: 700;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #999;
}

.input {
  padding: 10px 12px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 300px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #3498db;
}

/* 表格容器 */
.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.custom-table {
  --el-table-header-text-color: #2c3e50;
  --el-table-row-hover-bg-color: rgba(52, 152, 219, 0.05);
}

.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}

/* 用户中心页面 */
.user-center {
  padding: 32px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.page-icon {
  font-size: 28px;
}

.page-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
}

.user-profile-card {
  display: flex;
  align-items: center;
  gap: 48px;
  margin-bottom: 32px;
}

.avatar-section {
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  margin: 0 auto 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-tip {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.info-section {
  flex: 1;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.info-label {
  width: 100px;
  color: #666;
  font-size: 16px;
}

.info-value {
  font-size: 18px;
  font-weight: 500;
  color: #2c3e50;
}

.role-tag {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
}

/* 系统设置页面 */
.system-setting {
  padding: 32px;
}

.setting-list {
  margin-top: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #2c3e50;
}

.setting-icon {
  font-size: 20px;
}

.status-tag {
  color: #27ae60;
  font-weight: bold;
  font-size: 16px;
}

/* 按钮美化 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* 弹窗美化 */
:deep(.glass-dialog .el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>