const express = require('express')
const router = express.Router()
const db = require('../db')

// 工具函数：等待 db 加载完成
function waitForDb () {
  return new Promise(resolve => {
    const timer = setInterval(() => {
      db.read().catch(() => {})
      if (db.data !== null) {
        clearInterval(timer)
        resolve()
      }
    }, 50)
  })
}

// 1. 管理员登录接口 POST /api/login
router.post('/login', async (req, res) => {
  try {
    await waitForDb()
    const { username, password } = req.body
    const admin = db.data.admin.find(
      a => a.username === username && a.password === password
    )
    if (admin) {
      res.json({ code: 200, msg: '登录成功', data: admin })
    } else {
      res.json({ code: 500, msg: '用户名或密码错误' })
    }
  } catch (err) {
    res.json({ code: 500, msg: '服务器错误' })
  }
})

// 2. 获取图书列表 + 分页 + 搜索 GET /api/book?page=1&book_name=xxx
router.get('/book', async (req, res) => {
  try {
    await waitForDb()
    let { page = 1, book_name = '', pageSize = 10 } = req.query
    page = parseInt(page)
    pageSize = parseInt(pageSize)

    // 过滤搜索
    let filtered = db.data.books.filter(b =>
      b.book_name && b.book_name.includes(book_name)
    )

    // 分页
    const total = filtered.length
    const offset = (page - 1) * pageSize
    const list = filtered.slice(offset, offset + pageSize)

    res.json({
      code: 200,
      data: { list, total }
    })
  } catch (err) {
    res.json({ code: 500, msg: '服务器错误' })
  }
})

// 3. 新增图书接口 POST /api/book
router.post('/book', async (req, res) => {
  try {
    await waitForDb()
    const { book_name, author, category, price, stock, isbn, remark } = req.body
    const newId = db.data.books.length > 0
      ? Math.max(...db.data.books.map(b => b.id)) + 1
      : 1
    db.data.books.push({
      id: newId,
      book_name, author, category, price, stock, isbn, remark
    })
    await db.write()
    res.json({ code: 200, msg: '新增成功' })
  } catch (err) {
    res.json({ code: 500, msg: '服务器错误' })
  }
})

// 4. 修改图书接口 PUT /api/book/:id
router.put('/book/:id', async (req, res) => {
  try {
    await waitForDb()
    const id = parseInt(req.params.id)
    const idx = db.data.books.findIndex(b => b.id === id)
    if (idx === -1) {
      return res.json({ code: 404, msg: '图书不存在' })
    }
    const { book_name, author, category, price, stock, isbn, remark } = req.body
    db.data.books[idx] = { id, book_name, author, category, price, stock, isbn, remark }
    await db.write()
    res.json({ code: 200, msg: '修改成功' })
  } catch (err) {
    res.json({ code: 500, msg: '服务器错误' })
  }
})

// 5. 删除图书接口 DELETE /api/book/:id
router.delete('/book/:id', async (req, res) => {
  try {
    await waitForDb()
    const id = parseInt(req.params.id)
    db.data.books = db.data.books.filter(b => b.id !== id)
    await db.write()
    res.json({ code: 200, msg: '删除成功' })
  } catch (err) {
    res.json({ code: 500, msg: '服务器错误' })
  }
})

module.exports = router
