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

### 🚀 快速部署
1. **复制代码**：将 `worker.js` 的内容贴入 Cloudflare Worker 编辑器。
2. **绑定 KV**：创建名为 `GUARD_DB` 的 KV 命名空间并完成绑定。
3. **环境变量**：在设置中添加 `ADMIN_USER` 和 `ADMIN_PASS`。
4. **管理后台**：访问 `https://你的域名/admin` 进行设置。

---

## English

A lightweight CORS proxy gateway built on **Cloudflare Workers** and **KV Storage**. Focused on backend logic. **No frontend provided; please implement your own.**

### ✨ Key Features
* **CORS Proxy**: Seamlessly bypass cross-origin restrictions.
* **Auto-Ban**: Automatically detect and block malicious IPs via KV.
* **Admin Panel**: Built-in `/admin` route for manual control.
* **Security**: Referer-based whitelist protection.

---

## 日本語

**Cloudflare Workers** と **KV Storage** で構築された CORS プロキシゲートウェイ。バックエンドロジックに特化。**フロントエンドは提供されません。各自で実装してください。**

### ✨ 主な機能
* **CORS プロキシ**: フロントエンドのクロスドメイン問題を解決。
* **自動ブロック**: 異常アクセスを検知し、IP を自動制限。
* **管理パネル**: `/admin` パスでブロック解除などの操作が可能。
* **セキュリティ**: Referer 検証によるホワイトリスト保護。

---

## ⚖️ License
MIT License.
