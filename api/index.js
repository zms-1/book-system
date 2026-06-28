const express = require('express')
const cors = require('cors')
const bookRouter = require('./router/book')

const app = express()

// 跨域 + 解析 JSON
app.use(cors())
app.use(express.json())

// API 路由
app.use('/api', bookRouter)

// 处理 OPTIONS 预检请求
app.options('*', cors())

// Vercel Serverless 导出
module.exports = app
