const serverless = require('serverless-http')
const app = require('./app')

// 腾讯云 SCF 入口
exports.main_server = serverless(app)
