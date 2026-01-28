/**
 * CloudGuard Worker Proxy V1.0
 * 开源协议: MIT
 */

export default {
  async fetch(request, env, ctx) {
    const urlObj = new URL(request.url);
    const clientIP = request.headers.get("cf-connecting-ip") || "0.0.0.0";
    const targetUrl = urlObj.searchParams.get('url');

    // --- 1. 管理后台 (路径已脱敏) ---
    if (urlObj.pathname === "/admin") {
      return handleAdminDashboard(request, env);
    }
    
    // --- 2. 安全检查 (确保已绑定 KV) ---
    if (env.GUARD_DB) {
      const banStatus = await env.GUARD_DB.get(`BAN:${clientIP}`);
      if (banStatus) {
        return new Response("Access Denied. Your IP is restricted.", { status: 403 });
      }

      // 自动封禁逻辑
      const isAutoBan = await env.GUARD_DB.get("CONFIG:AUTO_BAN") === "true";
      if (isAutoBan) {
        let count = await env.GUARD_DB.get(`COUNT:${clientIP}`) || 0;
        count = parseInt(count) + 1;
        // 计数器缓存 60 秒
        await env.GUARD_DB.put(`COUNT:${clientIP}`, count, { expirationTtl: 60 });
        
        if (count > 100) { 
          const expireAt = new Date(Date.now() + 24*60*60*1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
          await env.GUARD_DB.put(`BAN:${clientIP}`, expireAt);
        }
      }
    }

    // --- 3. 来源白名单 (使用前请修改此处) ---
    const referer = request.headers.get("Referer");
    const allowedOrigins = [
      "localhost",      // 本地开发环境
      "yourdomain.com"  // 你的生产域名
    ];
    const isAuthorized = allowedOrigins.some(domain => referer && referer.includes(domain));
    
    // 跨域预检处理
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (!isAuthorized && targetUrl) {
      return new Response("Unauthorized Domain", { status: 403 });
    }

    if (!targetUrl) return new Response("CloudGuard Proxy is Running", { status: 200 });

    // --- 4. 核心抓取转发 ---
    try {
      const newHeaders = new Headers(request.headers);
      newHeaders.delete("Host");
      newHeaders.delete("Origin");
      newHeaders.delete("Referer");
      newHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0");

      const response = await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: (request.method !== 'GET' && request.method !== 'HEAD') ? request.body : null,
        redirect: "follow"
      });

      const outResponse = new Response(response.body, { status: response.status, headers: response.headers });
      outResponse.headers.set("Access-Control-Allow-Origin", "*");
      outResponse.headers.set("Access-Control-Expose-Headers", "*");
      // 移除安全限制头以允许前端展示
      outResponse.headers.delete("Content-Security-Policy");
      outResponse.headers.delete("X-Frame-Options");

      return outResponse;
    } catch (err) {
      return new Response("Fetch Error: " + err.message, { status: 500 });
    }
  }
};

/**
 * 管理后台渲染函数
 */
async function handleAdminDashboard(request, env) {
  const auth = request.headers.get("Authorization");
  const expectedAuth = "Basic " + btoa(`${env.ADMIN_USER}:${env.ADMIN_PASS}`);

  if (!auth || auth !== expectedAuth) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { 
        "WWW-Authenticate": 'Basic realm="CloudGuard Admin"',
        "Cache-Control": "no-store"
      }
    });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const ip = url.searchParams.get("ip");

  if (action === "unban" && ip) {
    await env.GUARD_DB.delete(`BAN:${ip}`);
    return Response.redirect(url.origin + url.pathname, 302);
  }
  
  if (action === "toggle") {
    const cur = await env.GUARD_DB.get("CONFIG:AUTO_BAN");
    await env.GUARD_DB.put("CONFIG:AUTO_BAN", cur === "true" ? "false" : "true");
    return Response.redirect(url.origin + url.pathname, 302);
  }

  const list = await env.GUARD_DB.list();
  const isAuto = await env.GUARD_DB.get("CONFIG:AUTO_BAN") || "false";
  
  let rows = "";
  for (const key of list.keys) {
    if (key.name.startsWith("BAN:")) {
      const val = await env.GUARD_DB.get(key.name);
      const targetIp = key.name.split(":")[1];
      rows += `<tr><td>${targetIp}</td><td style="color:red">Banned</td><td>${val}</td><td><a href="?action=unban&ip=${targetIp}">Unlock</a></td></tr>`;
    }
  }

  return new Response(`
    <html><head><meta charset="utf-8"><title>CloudGuard Admin</title>
    <style>
      body{font-family:system-ui;background:#f0f2f5;padding:20px}
      .card{background:#fff;padding:20px;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);margin-bottom:20px}
      table{width:100%;border-collapse:collapse} th,td{border-bottom:1px solid #eee;padding:12px;text-align:left}
      .btn{background:#007bff;color:#fff;padding:8px 16px;text-decoration:none;border-radius:6px;font-size:14px}
    </style>
    </head><body>
    <div class="card"><h2>🛡️ CloudGuard Admin</h2><p>Auto-Ban: <b>${isAuto}</b> <a class="btn" href="?action=toggle">Toggle</a></p></div>
    <div class="card"><table><tr><th>IP</th><th>Status</th><th>Expire</th><th>Action</th></tr>${rows||'<tr><td colspan="4">No Records</td></tr>'}</table></div>
    </body></html>`, { headers: { "Content-Type": "text/html" } });
}

