const { Low } = require('lowdb')
const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, 'data.json')

// lowdb v7 自定义 adapter
const adapter = {
  read: async () => {
    try {
      const data = fs.readFileSync(file, 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  },
  write: async (data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
  }
}

const db = new Low(adapter, { admin: [], books: [] })

// 随机数据池
const categories = ['文学', '历史', '科技', '教育', '小说', '计算机', '经济', '艺术', '哲学', '医学', '法律', '工程', '语言', '自然', '生活']
const authors = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑一', '冯二', '陈明', '林华', '黄丽', '刘洋', '杨帆', '朱军', '秦刚', '韩梅', '李雷', '宋晓']
const bookPrefixes = ['深入理解', '从零开始学', '实战指南', '精要解读', '入门到精通', '高级编程', '经典回顾', '前沿探索', '系统设计', '算法导论', '数据结构', '网络编程', '数据库原理', '人工智能', '机器学习', 'Python入门', 'Java核心技术', 'Vue3实战', 'React进阶', 'Node.js开发']
const bookSuffixes = ['与实战', '完全手册', '权威指南', '详解', '基础教程', '案例分析', '原理剖析', '设计与实现', '最佳实践', '进阶之路', '项目实战', '开发笔记', '性能优化', '架构设计', '源码分析', '应用实践', '运维指南', '安全研究', '云计算', '大数据']
const remarks = ['经典好书', '推荐阅读', '专业教材', '畅销书', '获奖作品', '专家推荐', '年度好书', '必读经典', '实用工具书', '参考书目']

// 生成100条随机图书
function generateBooks(count) {
  const books = []
  const usedNames = new Set()
  for (let i = 1; i <= count; i++) {
    let name
    do {
      const prefix = bookPrefixes[Math.floor(Math.random() * bookPrefixes.length)]
      const suffix = bookSuffixes[Math.floor(Math.random() * bookSuffixes.length)]
      name = prefix + suffix
    } while (usedNames.has(name))
    usedNames.add(name)

    books.push({
      id: i,
      book_name: name,
      author: authors[Math.floor(Math.random() * authors.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      price: parseFloat((Math.random() * 100 + 19.9).toFixed(1)),
      stock: Math.floor(Math.random() * 200 + 5),
      isbn: '978-' + Math.floor(10000000 + Math.random() * 90000000),
      remark: remarks[Math.floor(Math.random() * remarks.length)]
    })
  }
  return books
}

// 初始化
db.read().then(() => {
  if (db.data === null || db.data.admin.length === 0) {
    db.data = {
      admin: [
        { username: 'admin', password: 'admin123' }
      ],
      books: generateBooks(100)
    }
    db.write()
    console.log('已初始化默认管理员账号：admin / admin123')
    console.log('已预置 100 条图书数据')
  } else if (db.data.books.length === 0) {
    // 已有管理员但没有图书，补充数据
    db.data.books = generateBooks(100)
    db.write()
    console.log('已补充 100 条图书数据')
  }
}).catch(err => {
  console.error('数据库初始化失败:', err)
})

module.exports = db
