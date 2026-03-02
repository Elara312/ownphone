// ==================== 商店系统 ====================

// 工具函数
function getStorageJSON(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
}
function setStorageJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

// 状态
let currentCharId = null;
let currentBuyProduct = null;
let buyDirection = 'user_to_char';

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCharList();
});

function loadCharList() {
    const contacts = getStorageJSON('vibe_contacts', []);
    const select = document.getElementById('charSelect');
    select.innerHTML = '<option value="">选择CHAR</option>';
    contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nickname || c.name;
        select.appendChild(opt);
    });
}

function onCharChange() {
    currentCharId = document.getElementById('charSelect').value;
    loadWallet();
    if (currentCharId) {
        loadRecommend();
        loadCustomProducts();
    } else {
        document.getElementById('recommendGrid').innerHTML = '<div class="empty-state"><div class="empty-icon">🎁</div><p>选择CHAR后点击「换一批」获取推荐</p></div>';
        document.getElementById('customGrid').innerHTML = '<div class="empty-state"><div class="empty-icon">✨</div><p>还没有自定义商品，点击添加</p></div>';
    }
}

function loadWallet() {
    const points = getStorageJSON('alipay_points', {});
    const amount = currentCharId ? (points[currentCharId] || 0) : 0;
    document.getElementById('walletAmount').textContent = amount;
}

// ==================== Tab 切换 ====================
function switchTab(tabId) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tabId));
}

// ==================== API 配置 ====================
function getApiConfig() {
    const contact = getStorageJSON('vibe_contacts', []).find(c => String(c.id) === String(currentCharId));
    let apiUrl, apiKey, model;
    if (contact && contact.apiScheme) {
        const schemes = getStorageJSON('vibe_api_schemes', []);
        const scheme = schemes.find(s => s.id === contact.apiScheme);
        if (scheme) { apiUrl = scheme.apiUrl; apiKey = scheme.apiKey; model = scheme.model; }
    }
    if (!apiUrl) {
        apiUrl = localStorage.getItem('apiUrl');
        apiKey = localStorage.getItem('apiKey');
        model = (contact && contact.model) || localStorage.getItem('selectedModel');
    }
    return { apiUrl, apiKey, model };
}

function getCharName() {
    const contact = getStorageJSON('vibe_contacts', []).find(c => String(c.id) === String(currentCharId));
    return contact ? (contact.nickname || contact.name) : 'CHAR';
}

// ==================== 推荐商品 ====================
function loadRecommend() {
    if (!currentCharId) return;
    const cached = getStorageJSON(`shop_recommend_${currentCharId}`, []);
    if (cached.length > 0) renderProducts('recommendGrid', cached);
}

async function refreshRecommend() {
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey) { alert('请先配置API'); return; }

    const charName = getCharName();
    const btn = document.getElementById('refreshRecommendBtn');
    btn.disabled = true;
    btn.textContent = '⏳ 生成中...';
    showLoading('recommendGrid');

    try {
        const hasRare = Math.random() < 0.01;
        const rareLine = hasRare
            ? '\n特别要求：在这6个商品中，混入恰好1个"异世界稀有物品"——来自奇幻世界的神奇道具（如时光沙漏、心灵感应耳机、灵魂交换药水等），价格300-500积分，名称前加【稀有】标记。其余5个必须是正常的现实商品。'
            : '';

        const prompt = `请推荐6个商品。商品类型随机多样，像真实购物App（淘宝、京东）首页推荐那样什么品类都有，例如：
- 服饰鞋包：卫衣、运动鞋、帆布包、棒球帽
- 数码3C：蓝牙耳机、充电宝、手机壳、键盘
- 零食饮料：坚果礼盒、咖啡豆、奶茶、薯片
- 家居日用：香薰蜡烛、马克杯、抱枕、收纳盒
- 美妆护肤：面膜、护手霜、口红、香水小样
- 文创手办：盲盒、手账本、贴纸、桌面摆件
- 运动户外：瑜伽垫、水杯、跳绳、露营灯
- 宠物用品：猫粮、狗玩具、宠物窝
${rareLine}

要求：
- 商品名称简洁自然，就像淘宝商品标题
- 描述15-25字，写商品卖点
- 价格10-300积分
- emoji贴合商品本身
- 品类要多样，不要集中在同一类

请严格按以下JSON格式返回，不要有其他文字：
[{"name":"商品名","desc":"描述","price":价格数值,"emoji":"🎁"}]`;

        const sysPrompt = '你是淘宝/京东的商品推荐系统。你只输出JSON，不输出任何其他文字。商品必须是现实中能买到的普通商品，禁止出现虚构、魔法、超自然、中二的东西。';
        const resp = await callLLM(apiUrl, apiKey, model, prompt, 0.6, sysPrompt);
        const products = parseLLMProducts(resp);
        if (products.length === 0) throw new Error('未能解析商品数据');

        const items = products.map((p, i) => ({
            id: `rec_${Date.now()}_${i}`,
            name: p.name,
            desc: p.desc || p.description || '',
            price: Math.max(10, Math.min(500, parseInt(p.price) || 50)),
            emoji: p.emoji || '🎁',
            type: 'ai'
        }));

        setStorageJSON(`shop_recommend_${currentCharId}`, items);
        renderProducts('recommendGrid', items);
    } catch (e) {
        console.error('推荐生成失败:', e);
        alert('生成推荐失败: ' + e.message);
        loadRecommend();
    } finally {
        btn.disabled = false;
        btn.textContent = '🔄 换一批';
    }
}

// ==================== 搜索商品 ====================
async function searchProducts() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) { alert('请输入搜索关键词'); return; }
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey) { alert('请先配置API'); return; }

    switchTab('search-results');
    document.getElementById('searchResultTitle').textContent = `"${keyword}" 的搜索结果`;
    showLoading('searchGrid');

    try {
        const hasRare = Math.random() < 0.01;
        const rareLine = hasRare
            ? '\n其中可以有1个"异世界稀有物品"（来自奇幻世界的神奇道具，价格300-500，名称前加【稀有】），其余必须是正常现实商品。'
            : '';

        const prompt = `用户搜索了"${keyword}"，请生成6个与此关键词相关的商品。

商品应该像在淘宝、京东里搜索出来的真实商品。
${rareLine}

要求：
- 商品要与搜索词相关，可以合理延伸到相关品类
- 名称简洁像真实商品标题，描述15-25字写卖点
- 价格10-300积分
- emoji贴合商品本身

请严格按以下JSON格式返回，不要有其他文字：
[{"name":"商品名","desc":"描述","price":价格数值,"emoji":"🎁"}]`;

        const sysPrompt = '你是淘宝/京东的商品搜索引擎。你只输出JSON，不输出任何其他文字。搜索结果必须是现实中能买到的普通商品，禁止出现虚构、魔法、超自然、中二的东西。';
        const resp = await callLLM(apiUrl, apiKey, model, prompt, 0.6, sysPrompt);
        const products = parseLLMProducts(resp);
        if (products.length === 0) throw new Error('未能解析搜索结果');

        const items = products.map((p, i) => ({
            id: `search_${Date.now()}_${i}`,
            name: p.name,
            desc: p.desc || p.description || '',
            price: Math.max(10, Math.min(500, parseInt(p.price) || 50)),
            emoji: p.emoji || '🎁',
            type: 'ai'
        }));
        renderProducts('searchGrid', items);
    } catch (e) {
        console.error('搜索失败:', e);
        document.getElementById('searchGrid').innerHTML = '<div class="empty-state"><div class="empty-icon">😥</div><p>搜索失败: ' + e.message + '</p></div>';
    }
}

// ==================== 自定义商品 ====================
function loadCustomProducts() {
    if (!currentCharId) return;
    const items = getStorageJSON(`shop_custom_${currentCharId}`, []);
    if (items.length > 0) renderProducts('customGrid', items);
    else document.getElementById('customGrid').innerHTML = '<div class="empty-state"><div class="empty-icon">✨</div><p>还没有自定义商品，点击添加</p></div>';
}

function openAddProduct() {
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    document.getElementById('addProdName').value = '';
    document.getElementById('addProdDesc').value = '';
    document.getElementById('addProdPrice').value = '';
    document.getElementById('addProductModal').style.display = 'flex';
}

function closeAddProduct() { document.getElementById('addProductModal').style.display = 'none'; }

function saveCustomProduct() {
    const name = document.getElementById('addProdName').value.trim();
    const desc = document.getElementById('addProdDesc').value.trim();
    const price = parseInt(document.getElementById('addProdPrice').value);
    if (!name) { alert('请输入商品名称'); return; }
    if (!price || price < 1) { alert('请输入有效价格（正整数）'); return; }

    const items = getStorageJSON(`shop_custom_${currentCharId}`, []);
    items.push({ id: `custom_${Date.now()}`, name, desc, price, emoji: '✨', type: 'custom' });
    setStorageJSON(`shop_custom_${currentCharId}`, items);
    closeAddProduct();
    renderProducts('customGrid', items);
}

// ==================== 购买流程 ====================
function openBuyModal(product) {
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    currentBuyProduct = product;
    buyDirection = 'user_to_char';
    const points = getStorageJSON('alipay_points', {});
    const balance = points[currentCharId] || 0;
    const charWallet = JSON.parse(localStorage.getItem(`char_wallet_${currentCharId}`) || '0');
    const charName = getCharName();
    const enough = balance >= product.price;

    document.getElementById('buyModalBody').innerHTML = `
        <div class="buy-info-row"><span class="buy-info-label">商品</span><span class="buy-info-value">${product.emoji || '🎁'} ${product.name}</span></div>
        <div class="buy-info-row"><span class="buy-info-label">价格</span><span class="buy-info-value price">💰${product.price}</span></div>
        <div class="buy-info-row"><span class="buy-info-label">共用余额</span><span class="buy-info-value ${enough ? 'balance' : 'insufficient'}">💰${balance}${enough ? '' : ' (不足)'}</span></div>
        <div class="buy-info-row"><span class="buy-info-label">${charName}存款</span><span class="buy-info-value balance">💰${charWallet}</span></div>
        <div class="buy-direction">
            <div class="buy-dir-btn active" onclick="setBuyDir(this,'user_to_char')">🎁 我买给${charName}</div>
            <div class="buy-dir-btn" onclick="setBuyDir(this,'char_to_user')">💝 ${charName}买给我</div>
        </div>
        <div class="buy-account-hint" id="buyAccountHint" style="font-size:12px;color:#a89888;margin-top:8px;">
            从共用账户扣款
        </div>`;
    document.getElementById('buyModal').style.display = 'flex';
    updateBuyAccountHint();
}

function setBuyDir(el, dir) {
    buyDirection = dir;
    document.querySelectorAll('.buy-dir-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    updateBuyAccountHint();
}

function updateBuyAccountHint() {
    const hint = document.getElementById('buyAccountHint');
    if (!hint) return;
    if (buyDirection === 'user_to_char') {
        hint.textContent = '从共用账户扣款，礼物将发送到聊天中';
    } else {
        hint.textContent = '将在聊天中发起代付请求，由CHAR决定是否代付';
    }
}

function closeBuyModal() { document.getElementById('buyModal').style.display = 'none'; currentBuyProduct = null; }

function confirmBuy() {
    if (!currentBuyProduct || !currentCharId) return;
    const price = currentBuyProduct.price;
    const charName = getCharName();

    if (buyDirection === 'user_to_char') {
        // USER 买给 CHAR → 从共用账户扣款，发送礼物气泡到聊天
        const points = getStorageJSON('alipay_points', {});
        const balance = points[currentCharId] || 0;
        if (balance < price) { alert('共用积分不足'); return; }

        points[currentCharId] = balance - price;
        setStorageJSON('alipay_points', points);
        loadWallet();

        // 创建待确认订单（CHAR可以拒收）
        const now = Date.now();
        const orders = getStorageJSON(`shop_orders_${currentCharId}`, []);
        const orderId = `order_${now}`;
        orders.unshift({
            id: orderId,
            product: { name: currentBuyProduct.name, desc: currentBuyProduct.desc, price, emoji: currentBuyProduct.emoji || '🎁' },
            direction: 'user_to_char',
            status: 'pending_accept',
            createdAt: now, shippingAt: null,
            shippingDelay: 2 * 60 * 60 * 1000,
            deliveryDays: Math.floor(Math.random() * 3) + 1,
            deliveryMs: 0, deliveryAt: null,
            receivedAt: null, returnedAt: null, review: null,
            timeline: [{ status: 'ordered', time: now, text: 'USER下单，等待CHAR确认' }]
        });
        const order = orders[0];
        order.deliveryMs = order.deliveryDays * 24 * 60 * 60 * 1000;
        setStorageJSON(`shop_orders_${currentCharId}`, orders);

        // 写入聊天记录（礼物气泡）
        const contacts = getStorageJSON('vibe_contacts', []);
        const contact = contacts.find(c => String(c.id) === String(currentCharId));
        if (contact) {
            if (!contact.chat_history) contact.chat_history = [];
            contact.chat_history.push({
                id: now,
                sender: 'user',
                message: `送你一个礼物：${currentBuyProduct.emoji || '🎁'} ${currentBuyProduct.name}`,
                timestamp: new Date().toISOString(),
                type: 'shop_gift',
                giftData: { orderId, name: currentBuyProduct.name, price, emoji: currentBuyProduct.emoji || '🎁', status: 'pending_accept' }
            });
            setStorageJSON('vibe_contacts', contacts);
        }

        closeBuyModal();
        alert(`礼物已发送到聊天！${charName}可以选择接受或拒收。`);

    } else {
        // CHAR 买给 USER → 发起代付请求气泡
        const contacts = getStorageJSON('vibe_contacts', []);
        const contact = contacts.find(c => String(c.id) === String(currentCharId));
        if (contact) {
            if (!contact.chat_history) contact.chat_history = [];
            const now = Date.now();
            contact.chat_history.push({
                id: now,
                sender: 'user',
                message: `想让你帮我代付：${currentBuyProduct.emoji || '🎁'} ${currentBuyProduct.name}（💰${price}）`,
                timestamp: new Date().toISOString(),
                type: 'shop_payment_request',
                paymentData: { name: currentBuyProduct.name, desc: currentBuyProduct.desc, price, emoji: currentBuyProduct.emoji || '🎁', status: 'pending' }
            });
            setStorageJSON('vibe_contacts', contacts);
        }

        closeBuyModal();
        alert(`代付请求已发送到聊天！${charName}会决定是否帮你付款。`);
    }
}

// ==================== 订单状态流转 ====================
function advanceOrderStatus(orderId, charId) {
    const cid = charId || currentCharId;
    if (!cid) return;
    const orders = getStorageJSON(`shop_orders_${cid}`, []);
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const now = Date.now();
    let changed = false;
    // pending_accept 状态不自动推进，等CHAR回复
    if (order.status === 'pending_accept') return;
    if (order.status === 'ordered' && now - order.createdAt >= (order.shippingDelay || 7200000)) {
        order.status = 'shipping'; order.shippingAt = now; order.deliveryAt = now + (order.deliveryMs || 0);
        order.timeline.push({ status: 'shipping', time: now, text: `已发货，${order.deliveryDays === 0 ? '当日送达' : `预计${order.deliveryDays}天后送达`}` });
        changed = true;
    }
    if (order.status === 'shipping' && order.deliveryAt && now >= order.deliveryAt) {
        order.status = 'pending_receive';
        order.timeline.push({ status: 'pending_receive', time: now, text: '已送达，等待签收' });
        changed = true;
    }
    if (changed) setStorageJSON(`shop_orders_${cid}`, orders);
}

function checkAllOrderStatus() {
    getStorageJSON('vibe_contacts', []).forEach(c => {
        const orders = getStorageJSON(`shop_orders_${c.id}`, []);
        const now = Date.now();
        let changed = false;
        orders.forEach(order => {
            if (order.status === 'ordered' && now - order.createdAt >= (order.shippingDelay || 7200000)) {
                order.status = 'shipping'; order.shippingAt = now; order.deliveryAt = now + (order.deliveryMs || 0);
                order.timeline.push({ status: 'shipping', time: now, text: `已发货，${order.deliveryDays === 0 ? '当日送达' : `预计${order.deliveryDays}天后送达`}` });
                changed = true;
            }
            if (order.status === 'shipping' && order.deliveryAt && now >= order.deliveryAt) {
                order.status = 'pending_receive';
                order.timeline.push({ status: 'pending_receive', time: now, text: '已送达，等待签收' });
                changed = true;
            }
        });
        if (changed) setStorageJSON(`shop_orders_${c.id}`, orders);
    });
}

// ==================== 渲染 ====================
function renderProducts(containerId, products) {
    const grid = document.getElementById(containerId);
    if (!products || products.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><p>暂无商品</p></div>';
        return;
    }
    window._shopProducts = window._shopProducts || {};
    products.forEach(p => { window._shopProducts[p.id] = p; });

    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="openBuyModal(window._shopProducts['${p.id}'])">
            <div class="product-card-img">${p.emoji || '🎁'}</div>
            <div class="product-card-body">
                <div class="product-card-name">${esc(p.name)}</div>
                <div class="product-card-desc">${esc(p.desc)}</div>
                <div class="product-card-footer">
                    <span class="product-price">${p.price}</span>
                    <button class="buy-btn" onclick="event.stopPropagation();openBuyModal(window._shopProducts['${p.id}'])">购买</button>
                </div>
            </div>
        </div>`).join('');
}

function showLoading(containerId) {
    document.getElementById(containerId).innerHTML = `
        <div class="loading-overlay">
            <div class="loading-spinner-ring"></div>
            <div class="loading-text">正在生成商品...</div>
        </div>`;
}

// ==================== LLM 调用 ====================
async function callLLM(apiUrl, apiKey, model, prompt, temperature, systemPrompt) {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    let resp;
    try {
        resp = await fetch(`${apiUrl}/chat/completions`.replace(/([^:]\/)\/+/g, '$1'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model, messages, temperature: temperature || 0.7 })
        });
    } catch (e) {
        throw new Error('网络连接失败，请检查网络或API地址是否可用');
    }

    if (!resp.ok) {
        let detail = '';
        try { detail = await resp.text(); } catch (_) {}
        throw new Error(`API请求失败(${resp.status}): ${detail || '未知错误'}`);
    }

    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        const text = await resp.text();
        throw new Error('API返回了非JSON格式: ' + text.slice(0, 200));
    }

    const data = await resp.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API返回格式异常: ' + JSON.stringify(data).slice(0, 200));
    }
    return data.choices[0].message.content.trim();
}


function parseLLMProducts(content) {
    const match = content.match(/\[[\s\S]*\]/);
    if (!match) return [];
    try { return JSON.parse(match[0]); } catch { return []; }
}

// ==================== 工具 ====================
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}
