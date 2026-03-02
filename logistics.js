// ==================== 物流中心 ====================

function getStorageJSON(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
}
function setStorageJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

let currentCharId = null;
let currentFilter = 'all';
let currentDetailOrder = null;
let reviewStars = 0;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCharList();
    checkAllOrderStatus();
    renderOrders();
});

function loadCharList() {
    const contacts = getStorageJSON('vibe_contacts', []);
    const select = document.getElementById('charSelect');
    select.innerHTML = '<option value="">全部CHAR</option>';
    contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nickname || c.name;
        select.appendChild(opt);
    });
}

function onCharChange() {
    currentCharId = document.getElementById('charSelect').value || null;
    checkAllOrderStatus();
    renderOrders();
}

function filterOrders(status, el) {
    currentFilter = status;
    document.querySelectorAll('.logi-filter').forEach(f => f.classList.toggle('active', f === el));
    renderOrders();
}

// ==================== 订单状态检查（真实时间） ====================
function checkAllOrderStatus() {
    const contacts = getStorageJSON('vibe_contacts', []);
    contacts.forEach(c => {
        const orders = getStorageJSON(`shop_orders_${c.id}`, []);
        const now = Date.now();
        let changed = false;

        orders.forEach(order => {
            // pending_accept 等CHAR回复，不自动推进
            if (order.status === 'pending_accept') return;
            if (order.status === 'ordered') {
                const delay = order.shippingDelay || 2 * 60 * 60 * 1000;
                if (now - order.createdAt >= delay) {
                    order.status = 'shipping';
                    order.shippingAt = now;
                    order.deliveryAt = now + (order.deliveryMs || 0);
                    const days = order.deliveryDays || 0;
                    const dayText = days === 0 ? '当日送达' : `预计${days}天后送达`;
                    order.timeline.push({ status: 'shipping', time: now, text: `已发货，${dayText}` });
                    changed = true;
                }
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

// ==================== 获取所有订单 ====================
function getAllOrders() {
    const contacts = getStorageJSON('vibe_contacts', []);
    let all = [];

    const charIds = currentCharId ? [currentCharId] : contacts.map(c => c.id);

    charIds.forEach(cid => {
        const contact = contacts.find(c => String(c.id) === String(cid));
        const charName = contact ? (contact.nickname || contact.name) : 'CHAR';
        const orders = getStorageJSON(`shop_orders_${cid}`, []);
        orders.forEach(o => {
            all.push({ ...o, charId: cid, charName });
        });
    });

    // 按创建时间倒序
    all.sort((a, b) => b.createdAt - a.createdAt);

    // 筛选
    if (currentFilter !== 'all') {
        all = all.filter(o => o.status === currentFilter);
    }

    return all;
}

// ==================== 渲染订单列表 ====================
function renderOrders() {
    const orders = getAllOrders();
    const list = document.getElementById('orderList');

    if (orders.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>暂无订单</p></div>';
        return;
    }

    list.innerHTML = orders.map(o => {
        const statusMap = {
            pending_accept: '待确认', ordered: '待发货', shipping: '配送中',
            pending_receive: '待签收', received: '已签收', returned: '已退货', rejected: '已拒收'
        };
        const dirText = o.direction === 'user_to_char' ? `→ ${o.charName}` : `${o.charName} →`;
        const timeStr = fmtTime(o.createdAt);
        const deliveryInfo = getDeliveryInfo(o);

        let actionBtns = '';
        if (o.status === 'pending_receive') {
            actionBtns = `
                <button class="order-action-btn receive" onclick="event.stopPropagation();receiveOrder('${o.id}','${o.charId}')">签收</button>
                <button class="order-action-btn return" onclick="event.stopPropagation();returnOrder('${o.id}','${o.charId}')">退货</button>
            `;
        } else if (o.status === 'received' && !o.review) {
            actionBtns = `<button class="order-action-btn review" onclick="event.stopPropagation();openReview('${o.id}','${o.charId}')">写评价</button>`;
        }

        // 退货原因标签
        let returnInfo = '';
        if (o.status === 'returned' && o.returnedByChar && o.returnReason) {
            returnInfo = `<div style="padding:0 16px 10px;font-size:12px;color:#ef4444;">退货原因：${esc(o.returnReason)}</div>`;
        }

        return `
            <div class="order-card" onclick="openDetail('${o.id}','${o.charId}')">
                <div class="order-card-top">
                    <div class="order-card-img">
                        ${o.product.imageUrl ? `<img src="${esc(o.product.imageUrl)}">` : '🎁'}
                    </div>
                    <div class="order-card-info">
                        <div class="order-card-name">${esc(o.product.name)}</div>
                        <div class="order-card-meta">
                            <span>${dirText}</span>
                            <span>${timeStr}</span>
                            ${deliveryInfo ? `<span>${deliveryInfo}</span>` : ''}
                        </div>
                    </div>
                    <div class="order-card-price">💰${o.product.price}</div>
                </div>
                <div class="order-card-bottom">
                    <span class="order-status-badge ${o.status}">${statusMap[o.status] || o.status}</span>
                    <div class="order-card-actions">${actionBtns}</div>
                </div>
                ${o.review ? `<div style="padding:0 16px 10px;"><span style="color:#f59e0b;font-size:13px;">${'★'.repeat(o.review.stars)}${'☆'.repeat(5-o.review.stars)}</span></div>` : ''}
                ${returnInfo}
            </div>
        `;
    }).join('');
}

function getDeliveryInfo(order) {
    if (order.status === 'shipping' && order.deliveryAt) {
        const remaining = order.deliveryAt - Date.now();
        if (remaining <= 0) return '即将送达';
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        if (hours < 1) return '即将送达';
        if (hours < 24) return `约${hours}小时后送达`;
        const days = Math.ceil(hours / 24);
        return `约${days}天后送达`;
    }
    if (order.status === 'ordered') {
        return '等待发货';
    }
    return '';
}

// ==================== 订单操作 ====================
function receiveOrder(orderId, charId) {
    if (!confirm('确认签收？')) return;
    const orders = getStorageJSON(`shop_orders_${charId}`, []);
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== 'pending_receive') return;

    order.status = 'received';
    order.receivedAt = Date.now();
    order.timeline.push({ status: 'received', time: Date.now(), text: '已签收' });
    setStorageJSON(`shop_orders_${charId}`, orders);
    renderOrders();
}

function returnOrder(orderId, charId) {
    if (!confirm('确认退货？积分将退还')) return;
    const orders = getStorageJSON(`shop_orders_${charId}`, []);
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== 'pending_receive') return;

    order.status = 'returned';
    order.returnedAt = Date.now();
    order.timeline.push({ status: 'returned', time: Date.now(), text: '已退货，积分已退还' });
    setStorageJSON(`shop_orders_${charId}`, orders);

    // 退积分
    const points = getStorageJSON('alipay_points', {});
    points[charId] = (points[charId] || 0) + order.product.price;
    setStorageJSON('alipay_points', points);

    renderOrders();
    alert('退货成功，积分已退还');
}

// ==================== 订单详情 ====================
function openDetail(orderId, charId) {
    const orders = getStorageJSON(`shop_orders_${charId}`, []);
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    currentDetailOrder = { orderId, charId };
    const contacts = getStorageJSON('vibe_contacts', []);
    const contact = contacts.find(c => String(c.id) === String(charId));
    const charName = contact ? (contact.nickname || contact.name) : 'CHAR';

    const statusMap = {
        pending_accept: '待确认', ordered: '待发货', shipping: '配送中',
        pending_receive: '待签收', received: '已签收', returned: '已退货', rejected: '已拒收'
    };
    const dirText = order.direction === 'user_to_char' ? `我 → ${charName}` : `${charName} → 我`;

    let html = `
        <div class="detail-row"><span class="detail-label">商品</span><span class="detail-value">${esc(order.product.name)}</span></div>
        <div class="detail-row"><span class="detail-label">价格</span><span class="detail-value" style="color:#d97706">💰${order.product.price}</span></div>
        <div class="detail-row"><span class="detail-label">方向</span><span class="detail-value">${dirText}</span></div>
        <div class="detail-row"><span class="detail-label">状态</span><span class="detail-value">${statusMap[order.status]}</span></div>
        <div class="detail-row"><span class="detail-label">下单时间</span><span class="detail-value">${fmtTime(order.createdAt)}</span></div>
    `;

    // 物流时间线
    if (order.timeline && order.timeline.length > 0) {
        html += '<div class="detail-section-title">物流追踪</div><div class="timeline">';
        // 倒序显示（最新在上）
        const reversed = [...order.timeline].reverse();
        reversed.forEach(t => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-text">${esc(t.text)}</div>
                    <div class="timeline-time">${fmtTime(t.time)}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    // 评价
    if (order.review) {
        html += `
            <div class="detail-section-title">我的评价</div>
            <div class="review-display">
                <div class="review-stars">${'★'.repeat(order.review.stars)}${'☆'.repeat(5 - order.review.stars)}</div>
                ${order.review.text ? `<div class="review-text">${esc(order.review.text)}</div>` : ''}
            </div>
        `;
    }

    // CHAR退货原因
    if (order.status === 'returned' && order.returnedByChar && order.returnReason) {
        html += `
            <div class="detail-section-title">退货原因</div>
            <div style="padding:8px 12px;background:#fef2f2;border-radius:8px;color:#dc2626;font-size:13px;">
                ${esc(order.returnReason)}
            </div>
        `;
    }

    // 拒收原因（从聊天记录中获取）
    if (order.status === 'rejected') {
        const rejectReason = order.timeline.find(t => t.status === 'rejected');
        if (rejectReason) {
            html += `
                <div class="detail-section-title">拒收信息</div>
                <div style="padding:8px 12px;background:#fef2f2;border-radius:8px;color:#dc2626;font-size:13px;">
                    ${esc(rejectReason.text)}
                </div>
            `;
        }
    }

    document.getElementById('orderDetailBody').innerHTML = html;

    // 操作按钮
    let actions = '';
    if (order.status === 'pending_receive') {
        actions = `
            <button class="modal-btn confirm" onclick="receiveOrder('${orderId}','${charId}');closeDetail();">签收</button>
            <button class="modal-btn cancel" onclick="returnOrder('${orderId}','${charId}');closeDetail();">退货</button>
        `;
    } else if (order.status === 'received' && !order.review) {
        actions = `<button class="modal-btn confirm" onclick="closeDetail();openReview('${orderId}','${charId}')">写评价</button>`;
    }
    actions += `<button class="modal-btn cancel" onclick="closeDetail()">关闭</button>`;
    document.getElementById('orderDetailActions').innerHTML = actions;

    document.getElementById('orderDetailModal').style.display = 'flex';
}

function closeDetail() {
    document.getElementById('orderDetailModal').style.display = 'none';
    currentDetailOrder = null;
}

// ==================== 评价 ====================
let reviewOrderId = null;
let reviewCharId = null;

function openReview(orderId, charId) {
    reviewOrderId = orderId;
    reviewCharId = charId;
    reviewStars = 0;
    document.querySelectorAll('#starRating .star').forEach(s => { s.textContent = '☆'; s.classList.remove('active'); });
    document.getElementById('reviewText').value = '';
    document.getElementById('reviewModal').style.display = 'flex';
}

function closeReview() {
    document.getElementById('reviewModal').style.display = 'none';
    reviewOrderId = null;
    reviewCharId = null;
}

function setStar(n) {
    reviewStars = n;
    document.querySelectorAll('#starRating .star').forEach(s => {
        const v = parseInt(s.dataset.v);
        s.textContent = v <= n ? '★' : '☆';
        s.classList.toggle('active', v <= n);
    });
}

function submitReview() {
    if (reviewStars === 0) { alert('请选择评分'); return; }

    const orders = getStorageJSON(`shop_orders_${reviewCharId}`, []);
    const order = orders.find(o => o.id === reviewOrderId);
    if (!order) return;

    order.review = {
        stars: reviewStars,
        text: document.getElementById('reviewText').value.trim(),
        time: Date.now()
    };
    order.timeline.push({ status: 'reviewed', time: Date.now(), text: `已评价 ${'★'.repeat(reviewStars)}` });
    setStorageJSON(`shop_orders_${reviewCharId}`, orders);

    closeReview();
    renderOrders();
    alert('评价已提交');
}

// ==================== 工具 ====================
function fmtTime(ts) {
    const d = new Date(ts);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${h}:${m}`;
}

function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}
