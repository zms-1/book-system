const express = require('express')
const cors = require('cors')
const path = require('path')
const bookRouter = require('./router/book')
const serverlessHttp = require('serverless-http')

const app = express()

// 跨域 + 解析 JSON
app.use(cors())
app.use(express.json())

// API 路由
app.use('/api', bookRouter)

// 生产环境：提供前端静态文件
const FRONTEND_DIST = path.join(__dirname, '../book-front/dist')
if (require.main === module) {
  // 本地运行：serve 静态文件
  app.use(express.static(FRONTEND_DIST))
  // SPA 路由兜底
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(FRONTEND_DIST, 'index.html'))
    } else {
      next()
    }
  })
  // 启动端口
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`服务已启动：http://localhost:${PORT}`)
  })
}

// Vercel Serverless 导出
module.exports = serverlessHttp(app)
