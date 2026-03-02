/**
 * Cloudflare Workers 代理脚本
 * 用于解决 MiniMax API 的 CORS 问题
 * 
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard (https://dash.cloudflare.com/)
 * 2. 进入 Workers & Pages
 * 3. 创建新的 Worker
 * 4. 复制此代码到 Worker 编辑器
 * 5. 点击"保存并部署"
 * 6. 复制 Worker 的 URL（如 https://your-worker.your-subdomain.workers.dev）
 * 7. 在 MiniMax 配置中选择"自定义代理地址"，填入 Worker URL
 */

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    try {
      const url = new URL(request.url);
      
      // 构建目标 URL - 转发到 MiniMax API
      // 你可以根据需要修改目标域名
      const targetUrl = 'https://api.minimax.chat' + url.pathname + url.search;
      
      console.log('转发请求到:', targetUrl);

      // 创建新的请求，保留原始请求的所有信息
      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow'
      });

      // 发送请求到 MiniMax API
      const response = await fetch(newRequest);

      // 创建新的响应，添加 CORS 头
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      // 添加 CORS 头，允许所有来源访问
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', '*');
      newResponse.headers.set('Access-Control-Max-Age', '86400');

      return newResponse;

    } catch (error) {
      console.error('代理错误:', error);
      
      return new Response(JSON.stringify({
        error: '代理服务器错误',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};

// 处理 CORS 预检请求
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400'
    }
  });
}

/**
 * 高级配置（可选）
 * 
 * 1. 限制允许的来源（更安全）：
 *    将 '*' 改为你的网站域名，如：
 *    'Access-Control-Allow-Origin': 'https://your-website.com'
 * 
 * 2. 添加请求日志：
 *    在 fetch 函数中添加：
 *    console.log('请求方法:', request.method);
 *    console.log('请求头:', Object.fromEntries(request.headers));
 * 
 * 3. 添加速率限制：
 *    使用 Cloudflare Workers KV 存储请求计数
 * 
 * 4. 支持多个 MiniMax 域名：
 *    根据请求路径或参数选择不同的目标域名
 * 
 * 5. 添加缓存：
 *    对于相同的请求，可以缓存响应以提高性能
 */

/**
 * 使用示例：
 * 
 * 假设你的 Worker URL 是：https://minimax-proxy.your-subdomain.workers.dev
 * 
 * 在 MiniMax 配置中：
 * 1. 域名选择：自定义代理地址
 * 2. 自定义代理地址：https://minimax-proxy.your-subdomain.workers.dev
 * 3. 保存配置
 * 
 * 实际请求会变成：
 * 原始: https://api.minimax.chat/v1/t2a_v2
 * 代理: https://minimax-proxy.your-subdomain.workers.dev/v1/t2a_v2
 * 
 * Worker 会自动转发到 MiniMax API 并添加 CORS 头
 */
