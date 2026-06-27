# 图书信息管理系统 — Railway 一键部署教程

> 前后端合一，免费部署，手机电脑都能访问。

---

## 一、准备工作（5 分钟）

### 1. 创建 GitHub 仓库

1. 打开 [github.com](https://github.com) 并登录
2. 点击 **New repository**
3. 填写：
   - Repository name：`book-system`（任意名字）
   - 勾选 **Public**
   - 点击 **Create repository**

### 2. 推送代码到 GitHub

在你的电脑上打开 **PowerShell** 或 **CMD**，依次执行：

```bash
cd "D:\桌面\所有作业\实验报告\web\work.4"

# 初始化 git（如果还没有的话）
git init

# 添加所有文件
git add .

# 提交
git commit -m "初版：图书信息管理系统"

# 关联你的 GitHub 仓库（把下面的 URL 换成你自己的）
git remote add origin https://github.com/你的用户名/book-system.git

# 推送（第一次需要加 -u）
git push -u origin main
```

> 💡 如果提示 `branch 'main' does not exist`，把上面最后一行改成 `git push -u origin master`

---

## 二、部署到 Railway（免费，3 分钟）

### 1. 注册 Railway

1. 打开 [railway.app](https://railway.app)
2. 点击 **Log In** → 用 **GitHub 账号** 一键登录
3. 进入 Dashboard

### 2. 创建项目

1. 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 找到你刚才创建的 `book-system` 仓库，点击它

### 3. 配置部署

Railway 会自动检测你的项目并开始部署。你需要告诉 Railway 如何启动：

1. 在项目页面，点击右上角 **Variables**（环境变量）
2. 添加以下变量：

| Name | Value |
|------|-------|
| `PORT` | `3000` |

3. 点击右上角 **Settings** → **General**
4. 向下滚动找到 **Build Command**，填入：
   ```
   cd book-server && npm install && cd ../book-front && npm install && npm run build && cd ../book-server
   ```
5. 回到 **Deployments** 标签，Railway 会自动重新部署

### 4. 等待部署完成

大约 2-3 分钟后，你会看到绿色的 **Live** 标记。

点击顶部的域名链接（类似 `https://book-system-productionxxx.up.railway.app`），就能访问你的网站了！

---

## 三、首次使用

### 登录账号

- **用户名**：`admin`
- **密码**：`admin123`

> 这是系统默认的初始账号，登录后可以在用户中心修改密码。

### 添加图书

1. 登录后进入「图书管理」
2. 点击「新增图书」按钮
3. 填写信息并提交

### 数据保存

所有图书数据保存在服务器端的 `data.json` 文件中，重启不会丢失。

---

## 四、常见问题

### Q1：网站打不开 / 502 错误

- 等待 1-2 分钟，Railway 首次部署需要编译
- 点击 **Logs** 查看是否有报错
- 确保 Variables 里设置了 `PORT=3000`

### Q2：登录提示"请求失败"

- 确认 Railway 部署状态是 **Live**（绿色）
- 清除浏览器缓存后重试

### Q3：免费额度够吗？

Railway 免费套餐：
- 每月 $5 免费额度
- 如果 30 天不活跃会暂停，任意操作后自动恢复
- 个人作业完全够用

### Q4：手机端能访问吗？

可以！Railway 分配的域名在手机浏览器中直接打开即可，页面已做响应式适配。

---

## 五、本地调试（可选）

在推送代码之前，你可以在本地测试：

```bash
# 启动后端（会自动构建前端并 serve）
cd book-server
npm install
node app.js

# 浏览器打开 http://localhost:3000
```

---

## 六、最终效果

部署成功后，你会得到一个类似这样的链接：

```
https://book-system-xxxxx.up.railway.app
```

- ✅ 电脑浏览器直接打开
- ✅ 手机扫码或复制链接打开
- ✅ 完整的登录 + 图书增删改查功能
- ✅ 数据永久保存
- ✅ 完全免费

---

**祝部署顺利！** 🎉
