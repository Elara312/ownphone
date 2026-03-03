// Service Worker - 让 PWA 可安装 + 处理导航请求
const CACHE_NAME = 'couple-space-v3';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
    // 清除旧缓存
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// 网络优先策略：先尝试网络，失败则用缓存
self.addEventListener('fetch', (event) => {
    // 只处理同源的导航请求和静态资源
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // 缓存成功的响应
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                    return response;
                })
                .catch(() => {
                    // 网络失败，尝试缓存
                    return caches.match(event.request);
                })
        );
    }
});
