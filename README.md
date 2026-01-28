# 🛡️ CloudGuard Proxy (Yunluo Gateway)

[简体中文](#简体中文) | [English](#english) | [日本語](#日本語)

---

## 简体中文

这是一个基于 **Cloudflare Workers** 和 **KV 存储** 构建的轻量级跨域代理网关。它不仅能解决前端跨域 (CORS) 问题，还内置了自动 IP 频率限制和可视化管理后台。

### ✨ 核心功能
* **跨域转发**：一键解决代理请求中的 CORS 限制。
* **自动封禁**：监测异常访问频率，超限自动拦截并记录至 KV。
* **可视化后台**：内置 `/admin` 管理路径，支持手动解封、开关切换。
* **白名单保护**：基于 Referer 校验，确保只有你的域名可以调用。
* **零成本**：完全运行在 Cloudflare 免费额度内。

### 🚀 快速部署
1. **复制代码**：将 `worker.js` 的内容贴入 Cloudflare Worker 编辑器。
2. **绑定 KV**：创建名为 `GUARD_DB` 的 KV 命名空间并完成绑定。
3. **环境变量**：在设置中添加 `ADMIN_USER` 和 `ADMIN_PASS`。
4. **访问后台**：部署后访问 `https://你的域名/admin`。

---

## English

A lightweight CORS proxy gateway built on **Cloudflare Workers** and **KV Storage**. It features automatic IP rate limiting and a built-in management dashboard.

### ✨ Key Features
* **CORS Proxy**: Seamlessly bypass cross-origin restrictions.
* **Auto-Ban**: Automatically detect and block malicious IP addresses via KV.
* **Admin Panel**: Built-in `/admin` route for manual unbanning and status toggling.
* **Security**: Referer-based whitelist to prevent API unauthorized usage.
* **Free Tier Optimized**: Runs entirely within Cloudflare's free quota.

### 🚀 Quick Start
1. **Copy Code**: Paste `worker.js` into your Cloudflare Worker.
2. **Bind KV**: Create and bind a KV namespace named `GUARD_DB`.
3. **Environment Variables**: Set `ADMIN_USER` and `ADMIN_PASS`.
4. **Manage**: Visit `https://your-domain/admin` after deployment.

---

## 日本語

**Cloudflare Workers** と **KV Storage** で構築された軽量な CORS プロキシゲートウェイです。自動 IP 制限機能と管理画面を内蔵しています。

### ✨ 主な機能
* **CORS プロキシ**: フロントエンドのクロスドメイン問題を簡単に解決。
* **自動ブロック**: 異常なアクセス頻度を検知し、自動的に IP を制限。
* **管理パネル**: `/admin` パスで手動のブロック解除や設定の切り替えが可能。
* **ホワイトリスト**: Referer 検証により、許可されたドメインのみが利用可能。
* **コストゼロ**: すべて Cloudflare の無料枠内で動作。

### 🚀 使い方
1. **コードの貼り付け**: `worker.js` を Cloudflare Worker にデプロイ。
2. **KV のバインド**: `GUARD_DB` という名前の KV 空間を作成しバインド。
3. **環境変数**: `ADMIN_USER` と `ADMIN_PASS` を設定。
4. **管理画面**: `https://あなたのドメイン/admin` にアクセス。

---

## ⚖️ License
MIT License. Feel free to use and contribute.

