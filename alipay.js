// ==================== 支付宝 - 情侣任务系统 ====================

// 辅助函数
function getStorageJSON(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
}
function setStorageJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

// 状态
let currentCharId = null;
let todayTasks = null;     // { date, tasks: [{id, name, points, status}], refreshCount }
let selectedVerifyMsgs = new Set();

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCharList();
    loadPoints();
});

function loadCharList() {
    const contacts = getStorageJSON('vibe_contacts', []);
    const select = document.getElementById('charSelect');
    select.innerHTML = '<option value="">请选择CHAR...</option>';
    contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nickname || c.name;
        select.appendChild(opt);
    });
}

function loadPoints() {
    const data = getStorageJSON('alipay_points', {});
    const charPoints = currentCharId ? (data[currentCharId] || 0) : 0;
    document.getElementById('totalPoints').textContent = charPoints;
}

function onCharChange() {
    currentCharId = document.getElementById('charSelect').value;
    if (!currentCharId) {
        document.getElementById('taskStyleSection').style.display = 'none';
        document.getElementById('taskCardSection').style.display = 'none';
        document.getElementById('verifyPanel').style.display = 'none';
        document.getElementById('historySection').style.display = 'none';
        document.getElementById('charWorkSection').style.display = 'none';
        return;
    }
    document.getElementById('taskStyleSection').style.display = '';
    document.getElementById('taskCardSection').style.display = '';
    document.getElementById('historySection').style.display = '';
    document.getElementById('charWorkSection').style.display = '';

    // 加载任务风格
    const styles = getStorageJSON('alipay_task_styles', {});
    document.getElementById('taskStyleInput').value = styles[currentCharId] || '';
    document.getElementById('taskStyleInput').oninput = () => {
        styles[currentCharId] = document.getElementById('taskStyleInput').value;
        setStorageJSON('alipay_task_styles', styles);
    };

    loadTodayTasks();
    renderHistory();
    loadPoints();
    loadCharWork();
}

// ==================== 任务管理 ====================
function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getTodayDisplay() {
    const d = new Date();
    return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
}

function loadTodayTasks() {
    const key = `alipay_tasks_${currentCharId}`;
    const saved = getStorageJSON(key, null);
    const today = getTodayStr();

    if (saved && saved.date === today) {
        todayTasks = saved;
    } else {
        todayTasks = { date: today, tasks: [], refreshCount: 0 };
        setStorageJSON(key, todayTasks);
    }

    document.getElementById('taskDate').textContent = getTodayDisplay() + ' 任务';
    renderTasks();
    updateRefreshUI();
}

function saveTodayTasks() {
    const key = `alipay_tasks_${currentCharId}`;
    setStorageJSON(key, todayTasks);
}

function updateRefreshUI() {
    const remaining = 3 - todayTasks.refreshCount;
    document.getElementById('refreshCount').textContent = `剩余${remaining}次`;
    document.getElementById('refreshBtn').disabled = remaining <= 0;
}

function renderTasks() {
    const list = document.getElementById('taskList');
    const actions = document.getElementById('taskActions');

    if (!todayTasks.tasks || todayTasks.tasks.length === 0) {
        list.innerHTML = '<div class="task-empty">点击刷新获取今日任务</div>';
        actions.style.display = 'none';
        return;
    }

    actions.style.display = 'flex';
    list.innerHTML = todayTasks.tasks.map(t => {
        const cls = t.status === 'completed' ? 'completed' : t.status === 'rejected' ? 'rejected' : '';
        const check = t.status === 'completed' ? '✓' : t.status === 'rejected' ? '✗' : '';
        return `
            <div class="task-item ${cls}">
                <div class="task-checkbox">${check}</div>
                <div class="task-content">
                    <div class="task-name">${t.name}</div>
                </div>
                <div class="task-points">+${t.points}</div>
            </div>
        `;
    }).join('');
}

// ==================== 刷新任务（API调用） ====================
async function refreshTasks() {
    if (todayTasks.refreshCount >= 3) {
        alert('今日刷新次数已用完');
        return;
    }

    const contact = getStorageJSON('vibe_contacts', []).find(c => String(c.id) === String(currentCharId));
    if (!contact) { alert('找不到CHAR'); return; }

    const style = document.getElementById('taskStyleInput').value.trim() || '甜蜜浪漫风';

    // 获取API配置
    const { apiUrl, apiKey, model } = getApiConfig(contact);
    if (!apiUrl || !apiKey) {
        alert('请先在设置中配置API');
        return;
    }

    document.getElementById('refreshBtn').disabled = true;
    document.getElementById('refreshBtn').textContent = '⏳ 生成中...';

    try {
        const prompt = `你是支付宝情侣任务系统。请为用户和他的伴侣"${contact.nickname || contact.name}"生成今日情侣任务。

要求：
- 风格：${style}
- 生成3-5个任务
- 每个任务有名称和积分奖励（10-200分之间）
- 所有任务必须是通过线上聊天就能完成的（比如：说情话、互相夸奖、玩文字游戏、分享照片、角色扮演对话、猜谜、写小作文给对方等）
- 禁止生成需要线下见面才能完成的任务（比如：亲吻、拥抱、一起做饭、牵手散步等）
- 任务应该有趣、有创意、能促进两人感情
- 积分越高的任务难度越大、需要花更多心思

请严格按以下JSON格式返回，不要有其他文字：
[{"name":"任务描述","points":积分数值}]`;

        const resp = await fetch(`${apiUrl}/chat/completions`.replace(/([^:]\/)\/+/g, '$1'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.9
            })
        });

        if (!resp.ok) throw new Error('API请求失败: ' + resp.status);

        const data = await resp.json();
        const content = data.choices[0].message.content.trim();

        // 解析JSON（兼容markdown代码块）
        let tasks;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            tasks = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('无法解析任务数据');
        }

        todayTasks.tasks = tasks.map((t, i) => ({
            id: Date.now() + '_' + i,
            name: t.name,
            points: Math.max(10, Math.min(200, parseInt(t.points) || 50)),
            status: 'pending'  // pending / completed / rejected
        }));
        todayTasks.refreshCount++;
        saveTodayTasks();
        renderTasks();
        updateRefreshUI();

    } catch (e) {
        console.error('刷新任务失败:', e);
        alert('生成任务失败: ' + e.message);
    } finally {
        document.getElementById('refreshBtn').disabled = false;
        document.getElementById('refreshBtn').textContent = '🔄 刷新任务';
        updateRefreshUI();
    }
}

// ==================== 分享到聊天 ====================
function shareToChat() {
    if (!todayTasks.tasks || todayTasks.tasks.length === 0) {
        alert('没有任务可分享');
        return;
    }

    const contact = getStorageJSON('vibe_contacts', []).find(c => String(c.id) === String(currentCharId));
    if (!contact) return;

    // 构建任务卡消息
    let msg = `📋 ${getTodayDisplay()} 支付宝情侣任务\n\n`;
    todayTasks.tasks.forEach(t => {
        const icon = t.status === 'completed' ? '✅' : t.status === 'rejected' ? '❌' : '☐';
        msg += `${icon} ${t.name}  +${t.points}\n`;
    });
    msg += `\n来一起完成任务吧～`;

    // 写入聊天记录
    if (!contact.chat_history) contact.chat_history = [];
    contact.chat_history.push({
        sender: 'user',
        message: msg,
        timestamp: new Date().toISOString(),
        type: 'alipay_task_card'
    });

    // 保存
    const contacts = getStorageJSON('vibe_contacts', []);
    const idx = contacts.findIndex(c => String(c.id) === String(currentCharId));
    if (idx >= 0) {
        contacts[idx] = contact;
        setStorageJSON('vibe_contacts', contacts);
    }

    alert('已分享到与' + (contact.nickname || contact.name) + '的聊天');
}

// ==================== 验证面板 ====================
function openVerifyPanel() {
    if (!todayTasks.tasks || todayTasks.tasks.length === 0) return;

    const pendingTasks = todayTasks.tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length === 0) {
        alert('所有任务已完成或被拒绝');
        return;
    }

    const contact = getStorageJSON('vibe_contacts', []).find(c => String(c.id) === String(currentCharId));
    if (!contact || !contact.chat_history) {
        alert('没有聊天记录可选');
        return;
    }

    // 显示最近30条聊天记录供选择
    const recent = contact.chat_history.slice(-30);
    selectedVerifyMsgs = new Set();

    const container = document.getElementById('verifyMessages');
    container.innerHTML = recent.map((msg, i) => {
        const sender = msg.sender === 'user' ? '我' : (contact.nickname || contact.name);
        const realIdx = contact.chat_history.length - 30 + i;
        return `
            <div class="verify-msg-item" data-idx="${realIdx}" onclick="toggleVerifyMsg(this, ${realIdx})">
                <div class="verify-msg-check"></div>
                <div>
                    <div class="verify-msg-sender">${sender}</div>
                    <div class="verify-msg-content">${escapeHtml(msg.message || '').substring(0, 100)}</div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('verifyPanel').style.display = '';
}

function toggleVerifyMsg(el, idx) {
    if (selectedVerifyMsgs.has(idx)) {
        selectedVerifyMsgs.delete(idx);
        el.classList.remove('selected');
    } else {
        selectedVerifyMsgs.add(idx);
        el.classList.add('selected');
    }
}

function closeVerifyPanel() {
    document.getElementById('verifyPanel').style.display = 'none';
    selectedVerifyMsgs = new Set();
}

// ==================== 提交验证（API调用） ====================
async function submitVerification() {
    if (selectedVerifyMsgs.size === 0) {
        alert('请选择聊天记录作为证据');
        return;
    }

    const contact = getStorageJSON('vibe_contacts', []).find(c => String(c.id) === String(currentCharId));
    if (!contact) return;

    const { apiUrl, apiKey, model } = getApiConfig(contact);
    if (!apiUrl || !apiKey) {
        alert('请先配置API');
        return;
    }

    // 收集选中的消息
    const msgs = [];
    selectedVerifyMsgs.forEach(idx => {
        if (contact.chat_history[idx]) {
            const m = contact.chat_history[idx];
            const sender = m.sender === 'user' ? '用户' : (contact.nickname || contact.name);
            msgs.push(`${sender}: ${m.message}`);
        }
    });

    const pendingTasks = todayTasks.tasks.filter(t => t.status === 'pending');

    const prompt = `你是支付宝情侣任务验证系统。请根据以下聊天记录，严格判断哪些任务已完成。

待验证任务：
${pendingTasks.map(t => `- [ID:${t.id}] ${t.name} (+${t.points}分)`).join('\n')}

聊天记录证据：
${msgs.join('\n')}

判断规则：
- 严格审查：聊天记录中必须有明确的、实质性的内容对应任务要求，不能仅凭只言片语就判定完成
- 例如任务是"写一段情话"，那聊天中必须真的出现了一段像样的情话，而不是随便一句"我爱你"就算
- 例如任务是"互相夸奖对方三个优点"，那必须真的列出了具体的优点，数量也要够
- 如果聊天内容只是提到了任务但没有实际执行，不算完成
- 如果CHAR明确表示拒绝某任务（如"不要""拒绝""不想做""算了"等），标记为rejected
- 模棱两可、证据不足的情况应标记为pending而非completed
- 返回JSON格式，不要其他文字

返回格式：
[{"id":"任务ID","status":"completed或rejected或pending","reason":"简短理由"}]`;

    document.querySelector('.verify-submit-btn').textContent = '⏳ 验证中...';
    document.querySelector('.verify-submit-btn').disabled = true;

    try {
        const resp = await fetch(`${apiUrl}/chat/completions`.replace(/([^:]\/)\/+/g, '$1'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3
            })
        });

        if (!resp.ok) throw new Error('API请求失败');

        const data = await resp.json();
        const content = data.choices[0].message.content.trim();

        let results;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            results = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('无法解析验证结果');
        }

        // 应用结果
        let earnedPoints = 0;
        const resultMsgs = [];

        results.forEach(r => {
            const task = todayTasks.tasks.find(t => t.id === r.id);
            if (!task || task.status !== 'pending') return;

            if (r.status === 'completed') {
                task.status = 'completed';
                earnedPoints += task.points;
                resultMsgs.push(`✅ ${task.name} +${task.points}分 (${r.reason})`);
            } else if (r.status === 'rejected') {
                task.status = 'rejected';
                resultMsgs.push(`❌ ${task.name} 被拒绝 (${r.reason})`);
            } else {
                resultMsgs.push(`⏳ ${task.name} 未完成 (${r.reason})`);
            }
        });

        // 加积分
        if (earnedPoints > 0) {
            const points = getStorageJSON('alipay_points', {});
            points[currentCharId] = (points[currentCharId] || 0) + earnedPoints;
            setStorageJSON('alipay_points', points);
            loadPoints();
        }

        saveTodayTasks();
        saveHistory();
        renderTasks();
        closeVerifyPanel();

        alert(`验证完成！\n\n${resultMsgs.join('\n')}\n\n本次获得 ${earnedPoints} 积分`);

    } catch (e) {
        console.error('验证失败:', e);
        alert('验证失败: ' + e.message);
    } finally {
        document.querySelector('.verify-submit-btn').textContent = '📤 提交验证';
        document.querySelector('.verify-submit-btn').disabled = false;
    }
}

// ==================== 历史记录 ====================
function saveHistory() {
    const key = `alipay_history_${currentCharId}`;
    const history = getStorageJSON(key, []);

    // 更新或添加今日记录
    const todayIdx = history.findIndex(h => h.date === todayTasks.date);
    const record = {
        date: todayTasks.date,
        tasks: todayTasks.tasks.map(t => ({ name: t.name, points: t.points, status: t.status })),
        earnedPoints: todayTasks.tasks.filter(t => t.status === 'completed').reduce((s, t) => s + t.points, 0)
    };

    if (todayIdx >= 0) {
        history[todayIdx] = record;
    } else {
        history.unshift(record);
    }

    // 只保留最近30天
    setStorageJSON(key, history.slice(0, 30));
}

function renderHistory() {
    const key = `alipay_history_${currentCharId}`;
    const history = getStorageJSON(key, []);
    const list = document.getElementById('historyList');

    if (history.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:20px;color:#bbb;">暂无历史记录</div>';
        return;
    }

    list.innerHTML = history.slice(0, 10).map(h => `
        <div class="history-item">
            <div class="history-item-date">${h.date}</div>
            <div class="history-item-tasks">
                ${h.tasks.map(t => {
                    const icon = t.status === 'completed' ? '✅' : t.status === 'rejected' ? '❌' : '☐';
                    return `${icon} ${t.name} +${t.points}`;
                }).join('<br>')}
            </div>
            <div class="history-item-points">获得 ${h.earnedPoints} 积分</div>
        </div>
    `).join('');
}

// ==================== API配置 ====================
function getApiConfig(contact) {
    let apiUrl, apiKey, model;

    // 优先用联系人的API方案
    if (contact && contact.apiScheme) {
        const schemes = getStorageJSON('vibe_api_schemes', []);
        const scheme = schemes.find(s => s.id === contact.apiScheme);
        if (scheme) {
            apiUrl = scheme.apiUrl;
            apiKey = scheme.apiKey;
            model = scheme.model;
        }
    }

    // 回退到全局配置
    if (!apiUrl) {
        apiUrl = localStorage.getItem('apiUrl');
        apiKey = localStorage.getItem('apiKey');
        model = (contact && contact.model) || localStorage.getItem('selectedModel');
    }

    return { apiUrl, apiKey, model };
}

// ==================== 工具函数 ====================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==================== CHAR 今日动态系统 ====================

function getCharWorkKey() { return `char_work_${currentCharId}`; }
function getCharWalletKey() { return `char_wallet_${currentCharId}`; }

function loadCharWork() {
    if (!currentCharId) return;
    const saved = getStorageJSON(getCharWorkKey(), null);
    const today = getTodayStr();

    // 显示存款
    const wallet = getStorageJSON(getCharWalletKey(), 0);
    document.getElementById('charWalletAmount').textContent = wallet;
    document.getElementById('charWorkDate').textContent = getTodayDisplay();

    if (saved && saved.date === today) {
        renderCharWork(saved);
        updateCharWorkRefreshUI(saved);
    } else {
        // 新的一天，自动生成
        document.getElementById('charWorkList').innerHTML = '<div class="task-empty">点击生成查看CHAR今日动态</div>';
        document.getElementById('charWorkSummary').textContent = '';
        updateCharWorkRefreshUI({ refreshCount: 0 });
    }
}

function updateCharWorkRefreshUI(data) {
    const remaining = 1 - (data.refreshCount || 0);
    const btn = document.getElementById('charWorkRefreshBtn');
    const countEl = document.getElementById('charWorkRefreshCount');
    countEl.textContent = remaining > 0 ? `剩余${remaining}次` : '今日已用完';
    btn.disabled = remaining <= 0;
}

function renderCharWork(data) {
    const list = document.getElementById('charWorkList');
    if (!data.tasks || data.tasks.length === 0) {
        list.innerHTML = '<div class="task-empty">暂无动态</div>';
        return;
    }
    let earned = 0;
    list.innerHTML = data.tasks.map(t => {
        const done = t.status === 'done';
        if (done) earned += t.points;
        return `<div class="char-work-item ${done ? 'done' : 'undone'}">
            <span class="cw-icon">${done ? '✅' : '❌'}</span>
            <span class="cw-name">${escapeHtml(t.name)}</span>
            <span class="cw-pts">${done ? '+' + t.points : '—'}</span>
        </div>`;
    }).join('');

    document.getElementById('charWorkSummary').textContent = `今日收入：+${earned} 积分`;
}

async function refreshCharWork() {
    if (!currentCharId) return;
    const saved = getStorageJSON(getCharWorkKey(), null);
    const today = getTodayStr();
    if (saved && saved.date === today && saved.refreshCount >= 1) {
        alert('今日已生成过，明天再来吧');
        return;
    }

    const contact = getStorageJSON('vibe_contacts', []).find(c => String(c.id) === String(currentCharId));
    if (!contact) { alert('找不到CHAR'); return; }

    const { apiUrl, apiKey, model } = getApiConfig(contact);
    if (!apiUrl || !apiKey) { alert('请先配置API'); return; }

    const btn = document.getElementById('charWorkRefreshBtn');
    btn.disabled = true;
    btn.textContent = '⏳ 生成中...';

    try {
        const charName = contact.nickname || contact.name || 'CHAR';
        const persona = contact.personality || '';
        const personaHint = persona ? `\nCHAR的人设简介：${persona.slice(0, 200)}` : '';

        const prompt = `请为角色"${charName}"生成今天的趣味任务完成情况。${personaHint}

任务应该像RPG游戏里的每日委托/冒险日志，有趣、有画面感，例如：
- 帮咖啡店老板试喝新品并写了评价
- 在旧书店发现了一本绝版漫画
- 挑战一口气爬了12层楼梯
- 路上捡到一只迷路的小猫并送回主人
- 和便利店店员猜拳赢了一瓶饮料
- 在雨天帮陌生人撑伞走了两条街
- 尝试自己做了一杯拉花咖啡（失败了）
- 在公园长椅上写了一首打油诗

要求：
- 生成4-6个任务，有趣、有生活气息、带点小故事感
- 符合角色人设但不要太正经，要有趣味
- 每个任务有完成状态（done或undone），大约70%完成率
- 完成的任务给5-30积分，总和不超过100
- 任务名称10-20字，像冒险日志的条目

请严格按以下JSON格式返回，不要有其他文字：
[{"name":"任务描述","points":积分,"status":"done或undone"}]`;

        const sysPrompt = '你是一个趣味生活模拟系统，为角色生成有趣的每日冒险日志。任务要有画面感和故事性，不要无聊的日常流水账。只输出JSON。';

        let resp;
        try {
            resp = await fetch(`${apiUrl}/chat/completions`.replace(/([^:]\/)\/+/g, '$1'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({ model, messages: [
                    { role: 'system', content: sysPrompt },
                    { role: 'user', content: prompt }
                ], temperature: 0.8 })
            });
        } catch (e) {
            throw new Error('网络连接失败');
        }
        if (!resp.ok) throw new Error('API请求失败: ' + resp.status);

        const data = await resp.json();
        const content = data.choices[0].message.content.trim();
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('无法解析数据');

        let tasks = JSON.parse(jsonMatch[0]);

        // 强制积分上限100
        let total = 0;
        tasks = tasks.map(t => {
            const done = t.status === 'done';
            let pts = Math.max(5, Math.min(30, parseInt(t.points) || 10));
            if (done) {
                if (total + pts > 100) pts = Math.max(0, 100 - total);
                total += pts;
            }
            return { name: t.name, points: pts, status: done ? 'done' : 'undone' };
        });

        const workData = { date: today, tasks, refreshCount: (saved && saved.date === today) ? (saved.refreshCount || 0) + 1 : 1 };
        setStorageJSON(getCharWorkKey(), workData);

        // 把收入加到CHAR存款
        const wallet = getStorageJSON(getCharWalletKey(), 0);
        // 如果是重新生成，先减去上次的收入
        const prevEarned = (saved && saved.date === today) ? saved.tasks.filter(t => t.status === 'done').reduce((s, t) => s + t.points, 0) : 0;
        const newEarned = total;
        setStorageJSON(getCharWalletKey(), wallet - prevEarned + newEarned);

        renderCharWork(workData);
        updateCharWorkRefreshUI(workData);
        document.getElementById('charWalletAmount').textContent = getStorageJSON(getCharWalletKey(), 0);

    } catch (e) {
        console.error('CHAR动态生成失败:', e);
        alert('生成失败: ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '🔄 重新生成';
        updateCharWorkRefreshUI(getStorageJSON(getCharWorkKey(), { refreshCount: 0 }));
    }
}

// 获取CHAR今日任务摘要（供聊天页面注入）
function getCharWorkSummaryForChat(charId) {
    const data = JSON.parse(localStorage.getItem(`char_work_${charId}`) || 'null');
    const today = new Date().toISOString().slice(0, 10);
    if (!data || data.date !== today || !data.tasks) return '';
    const wallet = JSON.parse(localStorage.getItem(`char_wallet_${charId}`) || '0');
    const done = data.tasks.filter(t => t.status === 'done');
    const undone = data.tasks.filter(t => t.status === 'undone');
    const earned = done.reduce((s, t) => s + t.points, 0);
    let summary = `\n[你今天的日常]\n`;
    summary += `完成的事：${done.map(t => t.name).join('、') || '无'}\n`;
    if (undone.length) summary += `没做完的：${undone.map(t => t.name).join('、')}\n`;
    summary += `今日收入：${earned}积分，存款余额：${wallet}积分\n`;
    return summary;
}

// ==================== CSS 自定义方案系统 ====================

const ALIPAY_CSS_STORAGE_KEY = 'alipay_css_schemes';
const ALIPAY_CSS_ACTIVE_KEY = 'alipay_css_active_scheme';

const ALIPAY_DEFAULT_CSS = `/* 主背景渐变 */
--alipay-bg-start: #1677FF;
--alipay-bg-end: #0958d9;

/* 主题色 */
--alipay-primary: #1677FF;
--alipay-primary-hover: #0958d9;

/* 卡片 */
--alipay-card-bg: #fff;
--alipay-card-radius: 12px;
--alipay-card-shadow: 0 2px 12px rgba(0,0,0,0.08);

/* 文字 */
--alipay-text: #333;
--alipay-text-secondary: #999;
--alipay-text-light: #bbb;

/* 积分/金币 */
--alipay-gold: #FFD700;
--alipay-points-color: #FFB800;

/* 状态色 */
--alipay-success: #52c41a;
--alipay-success-bg: #f0fff4;
--alipay-success-border: #b7eb8f;
--alipay-danger: #ff4d4f;
--alipay-danger-bg: #fff2f0;
--alipay-danger-border: #ffccc7;

/* 任务项 */
--alipay-task-bg: #f8faff;
--alipay-task-border: #e8eeff;

/* 输入框 */
--alipay-input-border: #e0e0e0;
--alipay-input-bg: #f8faff;

/* 顶部栏 */
--alipay-header-bg: rgba(255,255,255,0.15);
--alipay-header-text: #fff;

/* CHAR动态卡片 */
--alipay-char-card-bg: linear-gradient(135deg, #fff7ed, #fff);
--alipay-char-card-border: #fed7aa;`;

let cssSchemes = [];
let activeCssSchemeId = null;

function loadCssSchemes() {
    cssSchemes = getStorageJSON(ALIPAY_CSS_STORAGE_KEY, []);
    if (cssSchemes.length === 0) {
        cssSchemes = [{ id: 'default', name: '默认方案', css: ALIPAY_DEFAULT_CSS }];
        setStorageJSON(ALIPAY_CSS_STORAGE_KEY, cssSchemes);
    }
    activeCssSchemeId = localStorage.getItem(ALIPAY_CSS_ACTIVE_KEY) || cssSchemes[0].id;
    applyCssScheme();
}

function applyCssScheme() {
    const scheme = cssSchemes.find(s => s.id === activeCssSchemeId) || cssSchemes[0];
    let styleEl = document.getElementById('alipay-custom-css');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'alipay-custom-css';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `:root { ${scheme.css} }`;
}

function openCssSettings() {
    document.getElementById('cssSettingsOverlay').style.display = 'flex';
    renderCssSchemeBar();
    loadCssEditorContent();
}

function closeCssSettings() {
    document.getElementById('cssSettingsOverlay').style.display = 'none';
}

function renderCssSchemeBar() {
    const bar = document.getElementById('cssSchemeBar');
    bar.innerHTML = cssSchemes.map(s =>
        `<div class="css-scheme-chip ${s.id === activeCssSchemeId ? 'active' : ''}" onclick="switchCssScheme('${s.id}')">${escapeHtml(s.name)}</div>`
    ).join('') + `<div class="css-scheme-chip add-btn" onclick="addCssScheme()">+ 新建</div>`;

    // 默认方案不能删除/重命名
    const isDefault = activeCssSchemeId === 'default';
    document.getElementById('cssSchemeActions').style.display = isDefault ? 'none' : 'flex';
}

function loadCssEditorContent() {
    const scheme = cssSchemes.find(s => s.id === activeCssSchemeId) || cssSchemes[0];
    document.getElementById('cssEditorTextarea').value = scheme.css;
}

function switchCssScheme(id) {
    activeCssSchemeId = id;
    localStorage.setItem(ALIPAY_CSS_ACTIVE_KEY, id);
    applyCssScheme();
    renderCssSchemeBar();
    loadCssEditorContent();
}

function addCssScheme() {
    const name = prompt('新方案名称：');
    if (!name || !name.trim()) return;
    const id = 'scheme_' + Date.now();
    cssSchemes.push({ id, name: name.trim(), css: ALIPAY_DEFAULT_CSS });
    setStorageJSON(ALIPAY_CSS_STORAGE_KEY, cssSchemes);
    switchCssScheme(id);
}

function renameCssScheme() {
    const scheme = cssSchemes.find(s => s.id === activeCssSchemeId);
    if (!scheme || scheme.id === 'default') return;
    const name = prompt('新名称：', scheme.name);
    if (!name || !name.trim()) return;
    scheme.name = name.trim();
    setStorageJSON(ALIPAY_CSS_STORAGE_KEY, cssSchemes);
    renderCssSchemeBar();
}

function deleteCssScheme() {
    if (activeCssSchemeId === 'default') return;
    if (!confirm('确定删除此方案？')) return;
    cssSchemes = cssSchemes.filter(s => s.id !== activeCssSchemeId);
    setStorageJSON(ALIPAY_CSS_STORAGE_KEY, cssSchemes);
    switchCssScheme(cssSchemes[0].id);
}

function saveCssScheme() {
    const scheme = cssSchemes.find(s => s.id === activeCssSchemeId);
    if (!scheme) return;
    scheme.css = document.getElementById('cssEditorTextarea').value;
    setStorageJSON(ALIPAY_CSS_STORAGE_KEY, cssSchemes);
    applyCssScheme();
    closeCssSettings();
}

// 页面加载时应用CSS方案
document.addEventListener('DOMContentLoaded', loadCssSchemes);
