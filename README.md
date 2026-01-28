# 🛡️ CloudGuard Proxy (Yunluo Gateway)

[简体中文](#简体中文) | [English](#english) | [日本語](#日本語)

---

## 简体中文

这是一个基于 **Cloudflare Workers** 和 **KV 存储** 构建的轻量级跨域代理网关。它专注于后端转发逻辑，不提供统一前端页面，调用需自写。

### ⚠️ 调用说明
**本项目不提供前端展示页面，请开发者根据需求自行编写前端调用逻辑。**

### ✨ 核心功能
* **跨域转发**：一键解决代理请求中的 CORS 限制。
* **自动封禁**：监测异常访问频率，超限自动拦截并记录至 KV。
* **可视化简易后台**：内置 `/admin` 管理路径，支持手动解封、开关切换。
* **白名单保护**：基于 Referer 校验，确保只有你的域名可以调用。
* **零成本**：完全运行在 Cloudflare 免费额度内。

### 🔌 API 调用示例
```javascript
// 前端 JavaScript 调用（GET 请求）
const proxyUrl = 'https://你的网关域名/';
const targetUrl = 'https://example.com/data';

// 基础 GET 请求
fetch(`${proxyUrl}?url=${encodeURIComponent(targetUrl)}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// 带自定义 Headers 的 POST 请求
fetch(proxyUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://api.example.com/login',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer token'
    },
    data: { username: 'test', password: '123' }
  })
});
```

```bash
# cURL 调用示例
# GET 请求
curl "https://你的网关域名/?url=https://api.example.com/data"

# POST 请求
curl -X POST "https://你的网关域名/" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://api.example.com/login","method":"POST","data":{"user":"test"}}'
```

### 🚀 快速部署
#### 方法一：通过 Wrangler CLI（推荐）
```bash
# 1. 克隆项目
git clone https://github.com/jiayuxuan123/cloudflare-guard-proxy.git
cd cloudflare-guard-proxy

# 2. 安装依赖（只需要 Wrangler）
npm install

# 3. 登录 Cloudflare
npx wrangler login

# 4. 创建 KV 命名空间
npx wrangler kv:namespace create GUARD_DB

# 5. 编辑 wrangler.toml，将生成的 KV ID 填入
# 编辑后的 wrangler.toml 示例：
# name = "cloudguard-proxy"
# main = "worker.js"
# compatibility_date = "2024-01-01"
# 
# [[kv_namespaces]]
# binding = "GUARD_DB"
# id = "这里填入上一步生成的 KV ID"

# 6. 设置环境变量（管理员密码）
npx wrangler secret put ADMIN_USER
npx wrangler secret put ADMIN_PASS

# 7. 部署！
npm run deploy
```

#### 方法二：通过 Workers 控制台
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **创建应用程序**
3. 将 `worker.js` 全部内容粘贴到编辑器
4. 点击**保存并部署**
5. 在**设置** → **变量**中添加：
   - `ADMIN_USER`: 你的管理员用户名
   - `ADMIN_PASS`: 你的管理员密码
6. 在**KV**中创建命名空间 `GUARD_DB` 并绑定到 Worker

### ⚙️ 配置说明
#### 环境变量（必需）
| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ADMIN_USER` | 管理后台用户名 | `admin` |
| `ADMIN_PASS` | 管理后台密码 | `your-strong-password` |

#### 白名单配置
修改 `worker.js` 中的 `allowedOrigins` 数组（约第 30 行）：
```javascript
const allowedOrigins = [
  "yourdomain.com",      // 你的生产域名
  "localhost:3000",      // 本地开发环境
  "127.0.0.1:8080"       // 本地测试
];
```

### 🔧 管理后台
部署后访问：`https://你的域名/admin`
- 使用环境变量中设置的账号密码登录
- 查看封禁 IP 列表
- 手动解封 IP
- 开关自动封禁功能

### 📁 项目结构
```
cloudflare-guard-proxy/
├── worker.js          # Worker 主代码
├── wrangler.toml      # 部署配置模板
├── package.json       # 项目配置
├── README.md          # 说明文档
├── LICENSE            # MIT 许可证
└── .gitignore         # 忽略文件规则
```

### ⚠️ 重要安全提醒
1. **务必修改默认的管理员密码**
2. **根据你的域名修改白名单列表**
3. **定期检查封禁列表和访问日志**
4. **不要将真实的 KV ID 提交到公开仓库**

### ❓ 常见问题
#### Q: 为什么返回 403 错误？
A: 请确保调用域名的 Referer 在白名单中，或检查 IP 是否被封禁。

#### Q: 如何查看访问日志？
A: 在 Cloudflare Workers 控制台查看实时日志，或使用 `npx wrangler tail` 命令。

#### Q: KV 数据会过期吗？
A: 封禁记录默认 24 小时后自动过期，计数器 60 秒后过期。

---

## English

A lightweight CORS proxy gateway built on **Cloudflare Workers** and **KV Storage**. Focused on backend logic. **No frontend provided; please implement your own.**

### ✨ Key Features
* **CORS Proxy**: Seamlessly bypass cross-origin restrictions.
* **Auto-Ban**: Automatically detect and block malicious IPs via KV.
* **Admin Panel**: Built-in `/admin` route for manual control.
* **Referer Whitelist**: Only allowed domains can access.
* **Zero Cost**: Runs entirely within Cloudflare's free tier.

### 🔌 Usage Examples
```javascript
// Basic GET request
fetch('https://your-worker.workers.dev/?url=https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 🚀 Quick Deploy
```bash
# 1. Clone and install
git clone https://github.com/jiayuxuan123/cloudflare-guard-proxy.git
cd cloudflare-guard-proxy
npm install

# 2. Login to Cloudflare
npx wrangler login

# 3. Create KV namespace
npx wrangler kv:namespace create GUARD_DB

# 4. Set secrets
npx wrangler secret put ADMIN_USER
npx wrangler secret put ADMIN_PASS

# 5. Deploy!
npm run deploy
```

### 🔧 Configuration
Edit `allowedOrigins` array in `worker.js` to add your domains.

### ⚠️ Security Notes
1. **Change default admin credentials**
2. **Update whitelist with your domains**
3. **Check ban list regularly**
4. **Do not expose real KV IDs**

---

## 日本語

**Cloudflare Workers** と **KV Storage** で構築された CORS プロキシゲートウェイ。
バックエンドロジックに特化。**フロントエンドは提供されません。各自で実装してください。**

### ✨ 主な機能
* **CORS プロキシ**: フロントエンドのクロスドメイン問題を解決。
* **自動ブロック**: 異常アクセスを検知し、IP を自動制限。
* **管理パネル**: `/admin` パスでブロック解除などの操作が可能。
* **セキュリティ**: Referer 検証によるホワイトリスト保護。
* **無料利用**: Cloudflare の無料枠内で完全動作。

### 🔌 使用例
```javascript
fetch('https://your-worker.workers.dev/?url=https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 🚀 デプロイ方法
```bash
git clone https://github.com/jiayuxuan123/cloudflare-guard-proxy.git
cd cloudflare-guard-proxy
npm install
npx wrangler login
npx wrangler kv:namespace create GUARD_DB
npx wrangler secret put ADMIN_USER
npx wrangler secret put ADMIN_PASS
npm run deploy
```

### ⚠️ セキュリティ注意
1. **デフォルトの管理者パスワードを変更してください**
2. **あなたのドメインをホワイトリストに追加してください**
3. **定期的にブロックリストを確認してください**

---

## ⚖️ License
MIT License © 2026

## 📞 Support
- GitHub Issues: [jiayuxuan123/cloudflare-guard-proxy](https://github.com/jiayuxuan123/cloudflare-guard-proxy)
- 请确保阅读代码中的注释，根据你的需求进行修改。

**🚀 Happy Coding!**