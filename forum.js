// ==================== 论坛 - 多世界系统 ====================
// forum_worlds: [{id, name, desc, theme, boards}]
// forum_active_world: worldId
// forum_posts_{worldId}: [{id, boardId, authorType, authorId, authorName, title, content, likes, pinned, replies, createdAt}]

function getS(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } }
function setS(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
// JS字符串转义（用于onclick属性中的字符串参数）
function escJs(s) { return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/</g,'\\x3c').replace(/>/g,'\\x3e'); }

// 预设主题
const THEMES = {
    light:   { name: '白色', accent: '#1a1a1a', bg: '#f5f5f5', card: '#fff', text: '#1a1a1a', textSub: '#999', headerBg: '#fff', inputBg: '#fafafa', tagBg: '#f0f0f0' },
    dark:    { name: '黑色', accent: '#6366f1', bg: '#0f0f0f', card: '#1a1a1a', text: '#e5e5e5', textSub: '#777', headerBg: '#111', inputBg: '#222', tagBg: '#2a2a2a' },
    ocean:   { name: '海洋', accent: '#0ea5e9', bg: '#f0f9ff', card: '#fff', text: '#0c4a6e', textSub: '#7dd3fc', headerBg: '#e0f2fe', inputBg: '#f0f9ff', tagBg: '#e0f2fe' },
    forest:  { name: '森林', accent: '#16a34a', bg: '#f0fdf4', card: '#fff', text: '#14532d', textSub: '#86efac', headerBg: '#dcfce7', inputBg: '#f0fdf4', tagBg: '#dcfce7' },
    sunset:  { name: '日落', accent: '#ea580c', bg: '#fff7ed', card: '#fff', text: '#7c2d12', textSub: '#fdba74', headerBg: '#ffedd5', inputBg: '#fff7ed', tagBg: '#ffedd5' },
    purple:  { name: '紫夜', accent: '#a855f7', bg: '#0a0014', card: '#1a0a2e', text: '#e9d5ff', textSub: '#7c3aed', headerBg: '#120026', inputBg: '#1a0a2e', tagBg: '#2d1050' },
    rose:    { name: '玫瑰', accent: '#e11d48', bg: '#fff1f2', card: '#fff', text: '#881337', textSub: '#fda4af', headerBg: '#ffe4e6', inputBg: '#fff1f2', tagBg: '#ffe4e6' },
    cyber:   { name: '赛博', accent: '#06b6d4', bg: '#020617', card: '#0f172a', text: '#22d3ee', textSub: '#475569', headerBg: '#0f172a', inputBg: '#1e293b', tagBg: '#1e293b' },
};

const DEFAULT_BOARDS = [
    { id: 'general', name: '综合', emoji: '💬' },
    { id: 'daily', name: '日常', emoji: '☀️' },
    { id: 'funny', name: '搞笑', emoji: '😂' },
    { id: 'question', name: '提问', emoji: '❓' },
    { id: 'share', name: '分享', emoji: '📎' }
];

let currentBoard = 'all';
let currentPostId = null;
let editingWorldId = null;
let isRefreshingReplies = false;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initWorlds();
    renderWorldBar();
    applyTheme();
    renderBoards();
    renderPosts();
    renderNewWorldThemes('newWorldThemeRow');
});

function initWorlds() {
    const worlds = getS('forum_worlds', null);
    if (!worlds) {
        // 首次：创建默认世界
        setS('forum_worlds', [{
            id: 'default',
            name: '默认论坛',
            desc: '',
            themeId: 'light',
            customTheme: null,
            boards: DEFAULT_BOARDS
        }]);
        setS('forum_active_world', 'default');
    }
}

function getWorlds() { return getS('forum_worlds', []); }
function getActiveWorldId() { return getS('forum_active_world', 'default'); }
function getActiveWorld() { return getWorlds().find(w => w.id === getActiveWorldId()) || getWorlds()[0]; }

// ==================== 世界切换栏 ====================
function renderWorldBar() {
    const worlds = getWorlds();
    const activeId = getActiveWorldId();
    const bar = document.getElementById('worldBar');

    bar.innerHTML = worlds.map(w => {
        const active = w.id === activeId ? 'active' : '';
        const themeColor = getWorldAccent(w);
        const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${themeColor};margin-right:6px;"></span>`;
        return `<button class="forum-world-chip ${active}" onclick="switchWorld('${w.id}')">${dot}${esc(w.name)}</button>`;
    }).join('') + `<button class="forum-world-add" onclick="openWorldManager()" title="新建世界">+</button>`;

    // 更新标题和描述
    const world = getActiveWorld();
    if (world) {
        document.getElementById('forumTitle').textContent = world.name;
        const descEl = document.getElementById('worldDesc');
        if (world.desc) {
            descEl.textContent = world.desc;
            descEl.style.display = 'block';
        } else {
            descEl.style.display = 'none';
        }
    }
}

function getWorldAccent(world) {
    if (world.customTheme) return world.customTheme;
    const t = THEMES[world.themeId];
    return t ? t.accent : '#1a1a1a';
}

function switchWorld(worldId) {
    setS('forum_active_world', worldId);
    currentBoard = 'all';
    applyTheme();
    renderWorldBar();
    renderBoards();
    renderPosts();
}

// ==================== 主题应用 ====================
function applyTheme() {
    const world = getActiveWorld();
    if (!world) return;
    const root = document.documentElement;

    if (world.customTheme) {
        // 自定义单色 → 自动生成明暗
        const hex = world.customTheme;
        const isDark = isColorDark(hex);
        if (isDark) {
            root.style.setProperty('--forum-bg', '#0f0f0f');
            root.style.setProperty('--forum-text', '#e5e5e5');
            root.style.setProperty('--forum-text-sub', '#777');
            root.style.setProperty('--forum-card-bg', '#1a1a1a');
            root.style.setProperty('--forum-card-border', '#333');
            root.style.setProperty('--forum-header-bg', '#111');
            root.style.setProperty('--forum-header-border', '#333');
            root.style.setProperty('--forum-accent', hex);
            root.style.setProperty('--forum-accent-text', '#fff');
            root.style.setProperty('--forum-tag-bg', '#2a2a2a');
            root.style.setProperty('--forum-input-bg', '#222');
            root.style.setProperty('--forum-input-border', '#444');
            root.style.setProperty('--forum-modal-bg', '#1a1a1a');
            root.style.setProperty('--forum-divider', '#333');
        } else {
            root.style.setProperty('--forum-bg', '#f5f5f5');
            root.style.setProperty('--forum-text', '#1a1a1a');
            root.style.setProperty('--forum-text-sub', '#999');
            root.style.setProperty('--forum-card-bg', '#fff');
            root.style.setProperty('--forum-card-border', '#eee');
            root.style.setProperty('--forum-header-bg', '#fff');
            root.style.setProperty('--forum-header-border', '#e5e5e5');
            root.style.setProperty('--forum-accent', hex);
            root.style.setProperty('--forum-accent-text', '#fff');
            root.style.setProperty('--forum-tag-bg', '#f0f0f0');
            root.style.setProperty('--forum-input-bg', '#fafafa');
            root.style.setProperty('--forum-input-border', '#ddd');
            root.style.setProperty('--forum-modal-bg', '#fff');
            root.style.setProperty('--forum-divider', '#f0f0f0');
        }
    } else {
        const t = THEMES[world.themeId] || THEMES.light;
        root.style.setProperty('--forum-bg', t.bg);
        root.style.setProperty('--forum-text', t.text);
        root.style.setProperty('--forum-text-sub', t.textSub);
        root.style.setProperty('--forum-card-bg', t.card);
        root.style.setProperty('--forum-card-border', isColorDark(t.bg) ? '#333' : '#eee');
        root.style.setProperty('--forum-header-bg', t.headerBg);
        root.style.setProperty('--forum-header-border', isColorDark(t.bg) ? '#333' : '#e5e5e5');
        root.style.setProperty('--forum-accent', t.accent);
        root.style.setProperty('--forum-accent-text', isColorDark(t.accent) ? '#fff' : '#fff');
        root.style.setProperty('--forum-tag-bg', t.tagBg);
        root.style.setProperty('--forum-input-bg', t.inputBg);
        root.style.setProperty('--forum-input-border', isColorDark(t.bg) ? '#444' : '#ddd');
        root.style.setProperty('--forum-modal-bg', t.card);
        root.style.setProperty('--forum-divider', isColorDark(t.bg) ? '#333' : '#f0f0f0');
    }
}

function isColorDark(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
    return (r*299 + g*587 + b*114) / 1000 < 128;
}

// ==================== 板块 ====================
function getBoards() {
    const world = getActiveWorld();
    return world ? world.boards : DEFAULT_BOARDS;
}

function renderBoards() {
    const boards = getBoards();
    const nav = document.getElementById('forumBoards');
    const allActive = currentBoard === 'all' ? 'active' : '';
    nav.innerHTML = `<button class="forum-board-tag ${allActive}" onclick="filterBoard('all')">全部</button>` +
        boards.map(b => {
            const active = currentBoard === b.id ? 'active' : '';
            return `<button class="forum-board-tag ${active}" onclick="filterBoard('${b.id}')">${b.emoji} ${b.name}</button>`;
        }).join('');
}

function filterBoard(boardId) {
    currentBoard = boardId;
    renderBoards();
    renderPosts();
}

// ==================== 帖子 ====================
function getPosts() {
    const worldId = getActiveWorldId();
    return getS(`forum_posts_${worldId}`, []);
}
function savePosts(posts) {
    const worldId = getActiveWorldId();
    setS(`forum_posts_${worldId}`, posts);
}

function renderPosts() {
    let posts = getPosts();
    if (currentBoard !== 'all') posts = posts.filter(p => p.boardId === currentBoard);
    posts.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt);

    const list = document.getElementById('forumList');
    const empty = document.getElementById('forumEmpty');

    if (!posts.length) { list.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    const boards = getBoards();
    const contacts = getS('vibe_contacts', []);
    const npcs = getNpcs();

    list.innerHTML = posts.map(p => {
        const board = boards.find(b => b.id === p.boardId);
        const boardTag = board ? `<span class="forum-post-board-tag">${board.emoji} ${board.name}</span>` : '';
        const avatar = getAvatar(p, contacts);
        const replyCount = (p.replies || []).length;
        const pinIcon = p.pinned ? '📌 ' : '';
        const bmClass = p.bookmarked ? 'bookmarked' : '';
        // NPC点击和星标
        const isNpc = p.authorType === 'npc';
        const npc = isNpc ? npcs.find(n => n.name === p.authorName) : null;
        const starBadge = (npc && npc.followed) ? '<span class="npc-follow-star-badge">⭐</span>' : '';
        const avatarClick = isNpc ? `onclick="event.stopPropagation();openNpcProfile('${escJs(p.authorName)}')" style="cursor:pointer;"` : '';
        const nameClick = isNpc ? `onclick="event.stopPropagation();openNpcProfile('${escJs(p.authorName)}')" style="cursor:pointer;"` : '';
        return `
            <div class="forum-post-card" onclick="openPostDetail('${p.id}')">
                <span class="forum-bookmark-icon ${bmClass}" onclick="event.stopPropagation();toggleBookmarkFromList('${p.id}')" title="追更">🔖</span>
                <div class="forum-post-card-header">
                    <div class="forum-post-avatar" ${avatarClick}>${avatar}${starBadge}</div>
                    <div class="forum-post-meta">
                        <div class="forum-post-author" ${nameClick}>${esc(p.authorName || '匿名')}</div>
                        <div class="forum-post-info"><span>${timeAgo(p.createdAt)}</span>${boardTag}</div>
                    </div>
                </div>
                <div class="forum-post-title">${pinIcon}${esc(p.title)}</div>
                <div class="forum-post-preview">${esc(p.content)}</div>
                <div class="forum-post-footer"><span>💬 ${replyCount}</span><span>👍 ${p.likes || 0}</span>${p.attachments && p.attachments.length ? '<span>📎 ' + p.attachments.length + '</span>' : ''}</div>
            </div>`;
    }).join('');
}

// ==================== 帖子详情 ====================
function openPostDetail(postId) {
    currentPostId = postId;
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const contacts = getS('vibe_contacts', []);
    const boards = getBoards();
    const board = boards.find(b => b.id === post.boardId);
    const avatar = getAvatar(post, contacts);
    const npcs = getNpcs();

    // 更新书签按钮状态
    const bmBtn = document.getElementById('bookmarkBtn');
    if (bmBtn) bmBtn.className = `forum-btn-icon${post.bookmarked ? ' active' : ''}`;

    // 帖子作者NPC点击
    const isPostNpc = post.authorType === 'npc';
    const postNpc = isPostNpc ? npcs.find(n => n.name === post.authorName) : null;
    const postStar = (postNpc && postNpc.followed) ? '<span class="npc-follow-star-badge">⭐</span>' : '';
    const postAvatarClick = isPostNpc ? `onclick="openNpcProfile('${escJs(post.authorName)}')" style="cursor:pointer;"` : '';
    const postNameClick = isPostNpc ? `onclick="openNpcProfile('${escJs(post.authorName)}')" style="cursor:pointer;"` : '';

    let html = '';
    // 总结条
    if (post.summary) {
        html += `<div class="forum-summary-bar"><span class="summary-label">🧠 长期记忆：</span><span class="summary-text">${esc(post.summary)}</span></div>`;
    }

    html += `
        <div class="forum-detail-post">
            <div class="forum-post-card-header">
                <div class="forum-post-avatar" ${postAvatarClick}>${avatar}${postStar}</div>
                <div class="forum-post-meta">
                    <div class="forum-post-author" ${postNameClick}>${esc(post.authorName || '匿名')}</div>
                    <div class="forum-post-info"><span>${timeAgo(post.createdAt)}</span>${board ? `<span class="forum-post-board-tag">${board.emoji} ${board.name}</span>` : ''}</div>
                </div>
            </div>
            <div class="forum-detail-title">${esc(post.title)}</div>
            <div class="forum-detail-content">${esc(post.content)}</div>
            ${renderAttachments(post.attachments)}
            <div class="forum-detail-footer">
                <span onclick="toggleLike('${post.id}')" style="cursor:pointer;">👍 ${post.likes || 0}</span>
                <span>💬 ${(post.replies || []).length}</span>
            </div>
        </div>`;

    const replies = post.replies || [];
    html += `<div class="forum-replies"><div class="forum-replies-title">回复 (${replies.length})</div>`;
    if (replies.length) {
        html += replies.map(r => {
            const rAvatar = getReplyAvatar(r, contacts);
            const isReplyNpc = r.authorType === 'npc';
            const replyNpc = isReplyNpc ? npcs.find(n => n.name === r.authorName) : null;
            const replyStar = (replyNpc && replyNpc.followed) ? '<span class="npc-follow-star-badge">⭐</span>' : '';
            const replyAvatarClick = isReplyNpc ? `onclick="openNpcProfile('${escJs(r.authorName)}')" style="cursor:pointer;"` : '';
            const replyNameClick = isReplyNpc ? `onclick="openNpcProfile('${escJs(r.authorName)}')" style="cursor:pointer;"` : '';
            return `<div class="forum-reply-item"><div class="forum-reply-avatar" ${replyAvatarClick}>${rAvatar}${replyStar}</div><div class="forum-reply-body"><span class="forum-reply-author" ${replyNameClick}>${esc(r.authorName || '匿名')}</span><span class="forum-reply-time">${timeAgo(r.createdAt)}</span><div class="forum-reply-text">${esc(r.content)}</div>${renderAttachments(r.attachments)}</div></div>`;
        }).join('');
    } else {
        html += `<div style="padding:20px 0;text-align:center;font-size:13px;">暂无回复</div>`;
    }
    html += `</div>`;

    document.getElementById('postDetailContent').innerHTML = html;
    document.getElementById('postDetailTitle').textContent = post.title;
    showModal('postDetail');
}

function closePostDetail() { hideModal('postDetail'); currentPostId = null; }

function toggleLike(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    post.likes = (post.likes || 0) + 1;
    savePosts(posts);
    if (currentPostId === postId) openPostDetail(postId);
    renderPosts();
}

function submitReply() {
    const input = document.getElementById('replyInput');
    const text = input.value.trim();
    if (!text || !currentPostId) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;
    if (!post.replies) post.replies = [];

    const reply = { id: 'r_' + Date.now(), authorType: 'user', authorName: 'USER', content: text, createdAt: Date.now() };

    // 检查附件
    const attachPanel = document.getElementById('replyAttachPanel');
    if (attachPanel.style.display !== 'none') {
        const url = document.getElementById('replyAttachUrl').value.trim();
        const type = document.getElementById('replyAttachType').value;
        const desc = document.getElementById('replyAttachDesc').value.trim();
        if (url) {
            reply.attachments = [{ type, url, desc }];
        }
    }

    post.replies.push(reply);
    savePosts(posts);
    input.value = '';
    document.getElementById('replyAttachUrl').value = '';
    document.getElementById('replyAttachDesc').value = '';
    document.getElementById('replyAttachPanel').style.display = 'none';

    // 自动总结触发检查
    const trigger = post.autoSumTrigger || 0;
    if (trigger > 0) {
        const lastSumAt = post._lastSumAt || 0;
        if (post.replies.length - lastSumAt >= trigger) {
            triggerAutoSummarize(post, posts);
        }
    }

    openPostDetail(currentPostId);
    renderPosts();
}

// ==================== 发帖 ====================
function openNewPost() {
    const contacts = getS('vibe_contacts', []);
    const boards = getBoards();
    document.getElementById('newPostAuthor').innerHTML = `<option value="user">👤 我自己</option>` +
        contacts.map(c => `<option value="${c.id}">${esc(c.nickname || c.name || 'CHAR')}</option>`).join('');
    document.getElementById('newPostBoard').innerHTML = boards.map(b => `<option value="${b.id}">${b.emoji} ${b.name}</option>`).join('');
    document.getElementById('newPostTitle').value = '';
    document.getElementById('newPostContent').value = '';
    document.getElementById('newPostAttachments').innerHTML = '';
    showModal('newPost');
}
function closeNewPost() { hideModal('newPost'); }

function submitNewPost() {
    const authorVal = document.getElementById('newPostAuthor').value;
    const boardId = document.getElementById('newPostBoard').value;
    const title = document.getElementById('newPostTitle').value.trim();
    const content = document.getElementById('newPostContent').value.trim();
    if (!title) { alert('请输入标题'); return; }
    if (!content) { alert('请输入内容'); return; }

    const contacts = getS('vibe_contacts', []);
    let authorName = 'USER', authorType = 'user', authorId = null;
    if (authorVal !== 'user') {
        const c = contacts.find(ct => String(ct.id) === String(authorVal));
        if (c) { authorName = c.nickname || c.name || 'CHAR'; authorType = 'char'; authorId = c.id; }
    }

    const posts = getPosts();
    const newPost = { id: 'p_' + Date.now(), boardId, authorType, authorId, authorName, title, content, likes: 0, pinned: false, replies: [], createdAt: Date.now() };

    // 收集附件
    const attachRows = document.querySelectorAll('#newPostAttachments .forum-attach-edit-row');
    if (attachRows.length) {
        newPost.attachments = [];
        attachRows.forEach(row => {
            const url = row.querySelector('.attach-url').value.trim();
            const type = row.querySelector('.attach-type').value;
            const desc = row.querySelector('.attach-desc').value.trim();
            if (url) newPost.attachments.push({ type, url, desc });
        });
        if (!newPost.attachments.length) delete newPost.attachments;
    }

    posts.unshift(newPost);
    savePosts(posts);
    closeNewPost();
    renderPosts();
}

// ==================== 板块管理 ====================
function openBoardManager() { renderBoardList(); showModal('boardManager'); }
function closeBoardManager() { hideModal('boardManager'); }

function renderBoardList() {
    const boards = getBoards();
    document.getElementById('boardList').innerHTML = boards.map(b => `
        <div class="board-item">
            <span>${b.emoji}</span>
            <span class="board-item-name">${esc(b.name)}</span>
            <button class="board-item-delete" onclick="deleteBoard('${b.id}')" title="删除">🗑️</button>
        </div>`).join('');
}

function addBoard() {
    const name = document.getElementById('newBoardName').value.trim();
    const emoji = document.getElementById('newBoardEmoji').value.trim() || '📌';
    if (!name) { alert('请输入板块名称'); return; }
    const worlds = getWorlds();
    const world = worlds.find(w => w.id === getActiveWorldId());
    if (!world) return;
    world.boards.push({ id: 'b_' + Date.now(), name, emoji });
    setS('forum_worlds', worlds);
    document.getElementById('newBoardName').value = '';
    document.getElementById('newBoardEmoji').value = '';
    renderBoardList();
    renderBoards();
}

function deleteBoard(boardId) {
    if (!confirm('确认删除此板块？')) return;
    const worlds = getWorlds();
    const world = worlds.find(w => w.id === getActiveWorldId());
    if (!world) return;
    world.boards = world.boards.filter(b => b.id !== boardId);
    setS('forum_worlds', worlds);
    if (currentBoard === boardId) currentBoard = 'all';
    renderBoardList();
    renderBoards();
    renderPosts();
}

// ==================== 世界管理 ====================
function openWorldManager() {
    renderNewWorldThemes('newWorldThemeRow');
    renderWorldList();
    document.getElementById('newWorldName').value = '';
    document.getElementById('newWorldDesc').value = '';
    document.getElementById('newWorldThemeCustom').value = '';
    showModal('worldManager');
}
function closeWorldManager() { hideModal('worldManager'); }

function renderNewWorldThemes(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = Object.entries(THEMES).map(([id, t]) =>
        `<button class="theme-color-btn" data-theme="${id}" style="background:${t.accent};" onclick="selectTheme(this,'${containerId}')" title="${t.name}"></button>`
    ).join('');
}

function selectTheme(btn, containerId) {
    document.querySelectorAll(`#${containerId} .theme-color-btn`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function getSelectedTheme(containerId, customInputId) {
    const custom = document.getElementById(customInputId).value.trim();
    if (custom && /^#[0-9a-fA-F]{3,6}$/.test(custom)) {
        return { themeId: null, customTheme: custom };
    }
    const active = document.querySelector(`#${containerId} .theme-color-btn.active`);
    if (active) return { themeId: active.dataset.theme, customTheme: null };
    return { themeId: 'light', customTheme: null };
}

function addWorld() {
    const name = document.getElementById('newWorldName').value.trim();
    if (!name) { alert('请输入世界名称'); return; }
    const desc = document.getElementById('newWorldDesc').value.trim();
    const { themeId, customTheme } = getSelectedTheme('newWorldThemeRow', 'newWorldThemeCustom');

    const worlds = getWorlds();
    const newId = 'w_' + Date.now();
    worlds.push({
        id: newId, name, desc,
        themeId: themeId || 'light',
        customTheme,
        boards: [...DEFAULT_BOARDS]
    });
    setS('forum_worlds', worlds);
    setS('forum_active_world', newId);

    closeWorldManager();
    currentBoard = 'all';
    applyTheme();
    renderWorldBar();
    renderBoards();
    renderPosts();
}

function renderWorldList() {
    const worlds = getWorlds();
    document.getElementById('worldList').innerHTML = worlds.map(w => {
        const color = getWorldAccent(w);
        return `
            <div class="world-item">
                <span class="world-item-color" style="background:${color};"></span>
                <span class="world-item-name">${esc(w.name)}</span>
                <button class="world-item-btn" onclick="openEditWorld('${w.id}')" title="编辑">✏️</button>
            </div>`;
    }).join('');
}

// ==================== 编辑世界 ====================
function openEditWorld(worldId) {
    editingWorldId = worldId;
    const world = getWorlds().find(w => w.id === worldId);
    if (!world) return;

    document.getElementById('editWorldName').value = world.name;
    document.getElementById('editWorldDesc').value = world.desc || '';
    document.getElementById('editWorldThemeCustom').value = world.customTheme || '';

    renderNewWorldThemes('editWorldThemeRow');
    if (world.themeId) {
        const btn = document.querySelector(`#editWorldThemeRow .theme-color-btn[data-theme="${world.themeId}"]`);
        if (btn) btn.classList.add('active');
    }

    showModal('editWorld');
}
function closeEditWorld() { hideModal('editWorld'); editingWorldId = null; }

function saveEditWorld() {
    if (!editingWorldId) return;
    const worlds = getWorlds();
    const world = worlds.find(w => w.id === editingWorldId);
    if (!world) return;

    world.name = document.getElementById('editWorldName').value.trim() || world.name;
    world.desc = document.getElementById('editWorldDesc').value.trim();
    const { themeId, customTheme } = getSelectedTheme('editWorldThemeRow', 'editWorldThemeCustom');
    world.themeId = themeId || world.themeId;
    world.customTheme = customTheme;

    setS('forum_worlds', worlds);
    closeEditWorld();
    applyTheme();
    renderWorldBar();
    renderWorldList();
}

function deleteCurrentEditWorld() {
    if (!editingWorldId) return;
    const worlds = getWorlds();
    if (worlds.length <= 1) { alert('至少保留一个世界'); return; }
    if (!confirm('确认删除此世界？所有帖子将被清除。')) return;

    // 删除帖子
    localStorage.removeItem(`forum_posts_${editingWorldId}`);

    const newWorlds = worlds.filter(w => w.id !== editingWorldId);
    setS('forum_worlds', newWorlds);

    // 如果删的是当前世界，切到第一个
    if (getActiveWorldId() === editingWorldId) {
        setS('forum_active_world', newWorlds[0].id);
    }

    closeEditWorld();
    currentBoard = 'all';
    applyTheme();
    renderWorldBar();
    renderBoards();
    renderPosts();
    renderWorldList();
}

// ==================== 弹窗工具 ====================
function showModal(name) {
    document.getElementById(name + 'Overlay').style.display = 'block';
    document.getElementById(name + 'Modal').style.display = 'flex';
}
function hideModal(name) {
    document.getElementById(name + 'Overlay').style.display = 'none';
    document.getElementById(name + 'Modal').style.display = 'none';
}

// ==================== 时间格式化 ====================
function timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return mins + '分钟前';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + '小时前';
    const days = Math.floor(hours / 24);
    if (days < 30) return days + '天前';
    return new Date(ts).toLocaleDateString('zh-CN');
}


// ==================== LLM 调用 ====================
function getApiConfig() {
    const contacts = getS('vibe_contacts', []);
    // 尝试从第一个有 API 方案的 CHAR 获取配置
    for (const c of contacts) {
        if (c.apiScheme) {
            const schemes = getS('vibe_api_schemes', []);
            const scheme = schemes.find(s => s.id === c.apiScheme);
            if (scheme && scheme.apiUrl && scheme.apiKey) {
                return { apiUrl: scheme.apiUrl, apiKey: scheme.apiKey, model: scheme.model };
            }
        }
    }
    // fallback: 全局配置
    const apiUrl = localStorage.getItem('apiUrl');
    const apiKey = localStorage.getItem('apiKey');
    const model = localStorage.getItem('selectedModel');
    return { apiUrl, apiKey, model };
}

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
        throw new Error('网络连接失败');
    }
    if (!resp.ok) {
        let detail = ''; try { detail = await resp.text(); } catch (_) {}
        throw new Error(`API请求失败(${resp.status}): ${detail.slice(0, 200)}`);
    }
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('API返回非JSON');
    const data = await resp.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) throw new Error('API返回格式异常');
    return data.choices[0].message.content.trim();
}

// 支持多轮对话的LLM调用（私信用）
async function callLLMMultiTurn(apiUrl, apiKey, model, messages, temperature) {
    let resp;
    try {
        resp = await fetch(`${apiUrl}/chat/completions`.replace(/([^:]\/)\/+/g, '$1'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model, messages, temperature: temperature || 0.7 })
        });
    } catch (e) {
        throw new Error('网络连接失败');
    }
    if (!resp.ok) {
        let detail = ''; try { detail = await resp.text(); } catch (_) {}
        throw new Error(`API请求失败(${resp.status}): ${detail.slice(0, 200)}`);
    }
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('API返回非JSON');
    const data = await resp.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) throw new Error('API返回格式异常');
    return data.choices[0].message.content.trim();
}

// ==================== 路人 NPC 池 ====================
function getNpcs() {
    const worldId = getActiveWorldId();
    return getS(`forum_npcs_${worldId}`, []);
}
function saveNpcs(npcs) {
    const worldId = getActiveWorldId();
    setS(`forum_npcs_${worldId}`, npcs);
}

const NPC_EMOJIS = ['🧑','👩','👨','🧔','👱','🧑‍🦰','👩‍🦳','🧑‍🦱','👴','👵','🧒','👦','👧','🤓','😎','🥸','🤠','👻','🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐧','🦉','🐝'];

const NPC_MAX_POOL = 50; // NPC池上限

// ==================== 时区与时间感知 ====================
const COMMON_TIMEZONES = [
    { offset: 8, label: '东八区 (中国/新加坡)', cities: '北京/上海/新加坡' },
    { offset: 9, label: '东九区 (日本/韩国)', cities: '东京/首尔' },
    { offset: -5, label: '西五区 (美东)', cities: '纽约/华盛顿' },
    { offset: -8, label: '西八区 (美西)', cities: '洛杉矶/旧金山' },
    { offset: 0, label: 'UTC+0 (英国)', cities: '伦敦' },
    { offset: 1, label: '东一区 (中欧)', cities: '巴黎/柏林' },
    { offset: 3, label: '东三区 (莫斯科)', cities: '莫斯科' },
    { offset: 5.5, label: '东五半区 (印度)', cities: '孟买/新德里' },
    { offset: -3, label: '西三区 (巴西)', cities: '圣保罗' },
    { offset: 10, label: '东十区 (澳洲)', cities: '悉尼' },
    { offset: 7, label: '东七区 (泰国)', cities: '曼谷' },
    { offset: -6, label: '西六区 (美中)', cities: '芝加哥' },
];

function getTimePeriod(hour) {
    if (hour >= 0 && hour < 5) return '深夜';
    if (hour < 8) return '早晨';
    if (hour < 12) return '上午';
    if (hour < 14) return '中午';
    if (hour < 18) return '下午';
    if (hour < 20) return '傍晚';
    return '晚上';
}

function getTimeContext() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const pad = n => String(n).padStart(2, '0');
    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    const localTime = `${pad(h)}:${pad(m)}`;
    const date = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    const weekday = weekdays[now.getDay()];
    const period = getTimePeriod(h);
    return { localTime, date, weekday, period, description: `${date} ${weekday} ${period}${localTime}` };
}

function getLocalTimeForTimezone(utcOffset) {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const targetMs = utcMs + utcOffset * 3600000;
    const target = new Date(targetMs);
    const h = target.getHours(), m = target.getMinutes();
    const pad = n => String(n).padStart(2, '0');
    return { hour: h, minute: m, period: getTimePeriod(h), time: `${pad(h)}:${pad(m)}` };
}

function formatTimezoneLabel(offset) {
    const tz = COMMON_TIMEZONES.find(t => t.offset === offset);
    const sign = offset >= 0 ? '+' : '';
    const offsetStr = Number.isInteger(offset) ? `${offset}` : `${offset}`;
    return tz ? `UTC${sign}${offsetStr} ${tz.cities}` : `UTC${sign}${offsetStr}`;
}

function buildTimeContextPrompt(sampledNpcs) {
    const tc = getTimeContext();
    let prompt = `\n【当前时间】\n用户本地时间：${tc.description}\n`;
    if (sampledNpcs && sampledNpcs.length) {
        prompt += '\n【NPC时区参考】\n论坛用户来自世界各地，以下是部分用户的当地时间：\n';
        for (const npc of sampledNpcs) {
            const offset = npc.timezone != null ? npc.timezone : 8;
            const lt = getLocalTimeForTimezone(offset);
            const tzLabel = formatTimezoneLabel(offset);
            prompt += `- ${npc.name}（${tzLabel}）：${lt.period}${lt.time}\n`;
        }
    }
    prompt += '\n请根据每个角色的当地时间生成符合时间氛围的内容。例如：\n';
    prompt += '- 深夜的用户可能发emo帖、失眠吐槽、深夜放毒\n';
    prompt += '- 早晨的用户可能发早安帖、通勤吐槽\n';
    prompt += '- 中午的用户可能讨论午饭、摸鱼\n';
    prompt += '- 周末和工作日的话题也应有所不同\n';
    return prompt;
}

// ==================== 发帖记忆系统 ====================
const DEFAULT_CHAR_POST_MEMORY_LIMIT = 20;
const DEFAULT_NPC_POST_MEMORY_LIMIT = 15;

function getForumSettings() {
    return getS('forum_settings', { charPostMemoryLimit: DEFAULT_CHAR_POST_MEMORY_LIMIT, npcPostMemoryLimit: DEFAULT_NPC_POST_MEMORY_LIMIT });
}
function saveForumSettings(settings) { setS('forum_settings', settings); }

function getCharPostMemory(charId) {
    const worldId = getActiveWorldId();
    return getS(`forum_char_post_memory_${worldId}_${charId}`, []);
}
function saveCharPostMemory(charId, entries) {
    const worldId = getActiveWorldId();
    const limit = getForumSettings().charPostMemoryLimit || DEFAULT_CHAR_POST_MEMORY_LIMIT;
    if (entries.length > limit) entries = entries.slice(-limit);
    setS(`forum_char_post_memory_${worldId}_${charId}`, entries);
}

function getNpcPostMemory(npcId) {
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === npcId);
    return (npc && npc.postMemory) ? npc.postMemory : [];
}
function saveNpcPostMemory(npcId, entries) {
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === npcId);
    if (!npc) return;
    const limit = getForumSettings().npcPostMemoryLimit || DEFAULT_NPC_POST_MEMORY_LIMIT;
    if (entries.length > limit) entries = entries.slice(-limit);
    npc.postMemory = entries;
    saveNpcs(npcs);
}

function generatePostSummary(type, title, content) {
    const short = (content || '').slice(0, 30) + ((content || '').length > 30 ? '...' : '');
    if (type === 'post') return `发帖「${title}」：${short}`;
    return `在「${title}」中回复：${short}`;
}

function addPostMemoryEntry(targetType, targetId, summary, timestamp, postTitle, type) {
    const entry = { id: Date.now() + Math.floor(Math.random() * 1000), summary, timestamp: timestamp || Date.now(), postTitle: postTitle || '', type: type || 'post' };
    if (targetType === 'char') {
        const entries = getCharPostMemory(targetId);
        entries.push(entry);
        saveCharPostMemory(targetId, entries);
    } else {
        const entries = getNpcPostMemory(targetId);
        entries.push(entry);
        saveNpcPostMemory(targetId, entries);
    }
    return entry;
}

function editPostMemoryEntry(targetType, targetId, entryId, summary) {
    let entries = targetType === 'char' ? getCharPostMemory(targetId) : getNpcPostMemory(targetId);
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return false;
    entry.summary = summary;
    if (targetType === 'char') saveCharPostMemory(targetId, entries);
    else saveNpcPostMemory(targetId, entries);
    return true;
}

function deletePostMemoryEntry(targetType, targetId, entryId) {
    let entries = targetType === 'char' ? getCharPostMemory(targetId) : getNpcPostMemory(targetId);
    entries = entries.filter(e => e.id !== entryId);
    if (targetType === 'char') saveCharPostMemory(targetId, entries);
    else saveNpcPostMemory(targetId, entries);
}

function scanAndSavePostMemory(newPosts) {
    const contacts = getS('vibe_contacts', []);
    const npcs = getNpcs();
    const followedNpcNames = new Set(npcs.filter(n => n.followed).map(n => n.name));

    for (const post of newPosts) {
        // 帖子作者
        if (post.authorType === 'char' && post.authorId) {
            const summary = generatePostSummary('post', post.title, post.content);
            addPostMemoryEntry('char', post.authorId, summary, post.createdAt, post.title, 'post');
        } else if (post.authorType === 'npc' && followedNpcNames.has(post.authorName)) {
            const npc = npcs.find(n => n.name === post.authorName);
            if (npc) {
                const summary = generatePostSummary('post', post.title, post.content);
                addPostMemoryEntry('npc', npc.id, summary, post.createdAt, post.title, 'post');
            }
        }
        // 回复
        for (const reply of (post.replies || [])) {
            if (reply.authorType === 'char' && reply.authorId) {
                const summary = generatePostSummary('reply', post.title, reply.content);
                addPostMemoryEntry('char', reply.authorId, summary, reply.createdAt, post.title, 'reply');
            } else if (reply.authorType === 'npc' && followedNpcNames.has(reply.authorName)) {
                const npc = npcs.find(n => n.name === reply.authorName);
                if (npc) {
                    const summary = generatePostSummary('reply', post.title, reply.content);
                    addPostMemoryEntry('npc', npc.id, summary, reply.createdAt, post.title, 'reply');
                }
            }
        }
    }
}

function scanAndSaveReplyMemory(postTitle, newReplies) {
    const npcs = getNpcs();
    const followedNpcNames = new Set(npcs.filter(n => n.followed).map(n => n.name));

    for (const reply of newReplies) {
        if (reply.authorType === 'char' && reply.authorId) {
            const summary = generatePostSummary('reply', postTitle, reply.content);
            addPostMemoryEntry('char', reply.authorId, summary, reply.createdAt, postTitle, 'reply');
        } else if (reply.authorType === 'npc' && followedNpcNames.has(reply.authorName)) {
            const npc = npcs.find(n => n.name === reply.authorName);
            if (npc) {
                const summary = generatePostSummary('reply', postTitle, reply.content);
                addPostMemoryEntry('npc', npc.id, summary, reply.createdAt, postTitle, 'reply');
            }
        }
    }
}

function buildPostMemoryPrompt(contacts, followedNpcs) {
    let sections = [];
    // CHAR 发帖记忆
    for (const c of contacts) {
        const charId = c.id;
        const name = c.nickname || c.name || 'CHAR';
        const entries = getCharPostMemory(charId);
        if (!entries.length) continue;
        let lines = `${name}（CHAR）最近的论坛动态：\n`;
        for (const e of entries.slice(-10)) {
            const dateStr = new Date(e.timestamp).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
            lines += `- ${e.summary} (${dateStr})\n`;
        }
        sections.push(lines);
    }
    // 已关注 NPC 发帖记忆
    for (const npc of followedNpcs) {
        const entries = getNpcPostMemory(npc.id);
        if (!entries.length) continue;
        let lines = `${npc.name}（已关注NPC）最近的论坛动态：\n`;
        for (const e of entries.slice(-8)) {
            const dateStr = new Date(e.timestamp).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
            lines += `- ${e.summary} (${dateStr})\n`;
        }
        sections.push(lines);
    }
    if (!sections.length) return '';
    return '\n【角色发帖历史】\n以下角色之前在论坛发过的内容，请保持连贯性：\n\n' + sections.join('\n');
}

function getOrCreateNpc(name, personality) {
    let npcs = getNpcs();
    let npc = npcs.find(n => n.name === name);
    if (!npc) {
        // 从头像池随机选取
        const avatarPool = getS('forum_avatar_pool', []);
        let avatarUrl = null;
        if (avatarPool.length) {
            avatarUrl = avatarPool[Math.floor(Math.random() * avatarPool.length)];
        }
        // 随机分配时区
        const tz = COMMON_TIMEZONES[Math.floor(Math.random() * COMMON_TIMEZONES.length)];
        npc = {
            id: 'npc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            name,
            emoji: NPC_EMOJIS[Math.floor(Math.random() * NPC_EMOJIS.length)],
            avatarUrl,
            personality: personality || '',
            timezone: tz.offset,
            createdAt: Date.now(),
            lastActiveAt: Date.now()
        };
        npcs.push(npc);
        // 超过上限时淘汰最久没活跃的
        if (npcs.length > NPC_MAX_POOL) {
            npcs = pruneNpcs(npcs);
        }
        saveNpcs(npcs);
    } else {
        // 更新活跃时间
        npc.lastActiveAt = Date.now();
        if (personality && !npc.personality) npc.personality = personality;
        saveNpcs(npcs);
    }
    return npc;
}

// 淘汰不活跃的NPC，保留被当前帖子引用的和已关注的
function pruneNpcs(npcs) {
    const posts = getPosts();
    // 收集当前帖子中引用的NPC名字
    const activeNames = new Set();
    posts.forEach(p => {
        if (p.authorType === 'npc') activeNames.add(p.authorName);
        (p.replies || []).forEach(r => {
            if (r.authorType === 'npc') activeNames.add(r.authorName);
        });
    });
    // 已关注的NPC必须保留
    const followed = npcs.filter(n => n.followed);
    // 被帖子引用的必须保留（排除已在followed中的）
    const referenced = npcs.filter(n => !n.followed && activeNames.has(n.name));
    // 其余按lastActiveAt排序淘汰
    const unreferenced = npcs.filter(n => !n.followed && !activeNames.has(n.name));
    unreferenced.sort((a, b) => (b.lastActiveAt || b.createdAt) - (a.lastActiveAt || a.createdAt));
    const keep = NPC_MAX_POOL - followed.length - referenced.length;
    return [...followed, ...referenced, ...unreferenced.slice(0, Math.max(0, keep))];
}

// 随机抽样NPC（避免总是同一批人出现）
function sampleNpcs(npcs, count) {
    if (npcs.length <= count) return npcs;
    const shuffled = [...npcs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ==================== NPC关注与私信系统 ====================

// 关注/取消关注NPC
function toggleFollowNpc(npcId) {
    let npcs = getNpcs();
    const npc = npcs.find(n => n.id === npcId);
    if (!npc) return;
    npc.followed = !npc.followed;
    saveNpcs(npcs);
    return npc.followed;
}

// 读取私信数据
function getDmData(npcId) {
    const worldId = getActiveWorldId();
    return getS(`forum_dm_${worldId}_${npcId}`, {
        npcId,
        messages: [],
        summary: '',
        contextWindow: 10
    });
}

// 保存私信数据
function saveDmData(npcId, data) {
    const worldId = getActiveWorldId();
    setS(`forum_dm_${worldId}_${npcId}`, data);
}

// 构建NPC私信的system prompt
function buildDmSystemPrompt(npc, dmData) {
    let prompt = `你是论坛用户「${npc.name}」，性格特点：${npc.personality || '普通网友'}。\n`;
    prompt += '请以该角色身份与用户进行私信聊天，保持性格一致，回复自然口语化，不要太长。\n';
    const memoryText = formatDmStructuredMemory(dmData);
    if (memoryText) {
        prompt += '\n' + memoryText + '\n';
    }
    return prompt;
}

// 构建发送给LLM的消息数组（含上下文窗口）
function buildDmMessages(dmData, userMessage) {
    const window = dmData.contextWindow || 10;
    const recent = dmData.messages.slice(-window);
    const msgs = recent.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.message
    }));
    msgs.push({ role: 'user', content: userMessage });
    return msgs;
}

// ==================== NPC资料弹窗 ====================
let currentNpcProfileId = null;

function openNpcProfile(npcName) {
    const npcs = getNpcs();
    const npc = npcs.find(n => n.name === npcName);
    if (!npc) { alert('找不到该NPC'); return; }
    currentNpcProfileId = npc.id;
    renderNpcProfile(npc);
    showModal('npcProfile');
}

function closeNpcProfile() { hideModal('npcProfile'); currentNpcProfileId = null; }

function renderNpcProfile(npc) {
    // 头像
    const avatarEl = document.getElementById('npcProfileAvatar');
    if (npc.avatarUrl) {
        avatarEl.innerHTML = `<img src="${esc(npc.avatarUrl)}" onerror="this.parentElement.textContent='${npc.emoji || '🧑'}'">`;
    } else {
        avatarEl.textContent = npc.emoji || '🧑';
    }
    // 名字 + 关注星标
    const starHtml = npc.followed ? ' <span class="npc-profile-follow-star">⭐ 已关注</span>' : '';
    document.getElementById('npcProfileName').innerHTML = esc(npc.name) + starHtml;

    // 时区显示
    const offset = npc.timezone != null ? npc.timezone : 8;
    const lt = getLocalTimeForTimezone(offset);
    const tzInfo = `🌍 ${formatTimezoneLabel(offset)} — 当地${lt.period}${lt.time}`;
    document.getElementById('npcProfileTime').textContent = tzInfo + ' · 加入于 ' + new Date(npc.createdAt).toLocaleDateString('zh-CN');
    document.getElementById('npcProfileTitle').textContent = npc.name + ' 的资料';

    const isFollowed = !!npc.followed;

    // 性格描述：关注后可编辑，否则只读
    const readonlyEl = document.getElementById('npcProfilePersonalityReadonly');
    const editEl = document.getElementById('npcProfilePersonalityEdit');
    if (isFollowed) {
        readonlyEl.style.display = 'none';
        editEl.style.display = '';
        editEl.value = npc.personality || '';
    } else {
        readonlyEl.style.display = '';
        editEl.style.display = 'none';
        readonlyEl.textContent = npc.personality || '（暂无性格描述）';
    }

    // 头像URL编辑
    const editAvatarEl = document.getElementById('npcProfileEditAvatar');
    if (isFollowed) {
        editAvatarEl.style.display = '';
        document.getElementById('npcProfileAvatarUrl').value = npc.avatarUrl || '';
    } else {
        editAvatarEl.style.display = 'none';
    }

    // 时区编辑（仅已关注）
    const tzEditEl = document.getElementById('npcProfileEditTimezone');
    if (tzEditEl) {
        if (isFollowed) {
            tzEditEl.style.display = '';
            const tzSelect = document.getElementById('npcProfileTimezoneSelect');
            if (tzSelect) {
                tzSelect.innerHTML = COMMON_TIMEZONES.map(tz => {
                    const sign = tz.offset >= 0 ? '+' : '';
                    const selected = tz.offset === offset ? 'selected' : '';
                    return `<option value="${tz.offset}" ${selected}>UTC${sign}${tz.offset} ${tz.cities}</option>`;
                }).join('');
            }
        } else {
            tzEditEl.style.display = 'none';
        }
    }

    // 发帖记忆（仅已关注）
    const postMemEl = document.getElementById('npcProfilePostMemory');
    if (postMemEl) {
        if (isFollowed) {
            postMemEl.style.display = '';
            const entries = getNpcPostMemory(npc.id);
            if (entries.length) {
                postMemEl.innerHTML = `<label>📋 论坛动态 (${entries.length})</label>` +
                    entries.slice(-10).map(e => {
                        const dateStr = new Date(e.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
                        return `<div class="npc-post-memory-item">
                            <span class="npc-pm-text">${esc(e.summary)}</span>
                            <span class="npc-pm-date">${dateStr}</span>
                            <button class="dm-sm-btn-icon" onclick="event.stopPropagation();deleteNpcPostMemoryFromProfile('${npc.id}',${e.id})" title="删除">🗑</button>
                        </div>`;
                    }).join('');
            } else {
                postMemEl.innerHTML = `<label>📋 论坛动态</label><div class="dm-sm-empty-hint">暂无论坛动态记录</div>`;
            }
        } else {
            postMemEl.style.display = 'none';
        }
    }

    // 关注按钮
    const followBtn = document.getElementById('npcProfileFollowBtn');
    followBtn.textContent = isFollowed ? '💔 取消关注' : '⭐ 关注';
    followBtn.style.background = isFollowed ? '#e74c3c' : '';

    // 发私信按钮
    const dmBtn = document.getElementById('npcProfileDmBtn');
    dmBtn.style.opacity = isFollowed ? '1' : '0.5';

    // 保存按钮
    document.getElementById('npcProfileSaveBtn').style.display = isFollowed ? '' : 'none';
}

function deleteNpcPostMemoryFromProfile(npcId, entryId) {
    deletePostMemoryEntry('npc', npcId, entryId);
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === npcId);
    if (npc) renderNpcProfile(npc);
}

function handleNpcFollow() {
    if (!currentNpcProfileId) return;
    const followed = toggleFollowNpc(currentNpcProfileId);
    // 重新渲染弹窗（不关闭）
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === currentNpcProfileId);
    if (npc) renderNpcProfile(npc);
    // 刷新帖子列表中的星标
    renderPosts();
}

function handleNpcDm() {
    if (!currentNpcProfileId) return;
    const npcId = currentNpcProfileId;
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === npcId);
    if (!npc || !npc.followed) {
        alert('请先关注该NPC才能发私信哦~');
        return;
    }
    closeNpcProfile();
    openDmChat(npcId);
}

function saveNpcProfile() {
    if (!currentNpcProfileId) return;
    let npcs = getNpcs();
    const npc = npcs.find(n => n.id === currentNpcProfileId);
    if (!npc || !npc.followed) return;

    const newAvatarUrl = document.getElementById('npcProfileAvatarUrl').value.trim();
    const newPersonality = document.getElementById('npcProfilePersonalityEdit').value.trim();

    npc.avatarUrl = newAvatarUrl || npc.avatarUrl;
    npc.personality = newPersonality || npc.personality;

    // 保存时区
    const tzSelect = document.getElementById('npcProfileTimezoneSelect');
    if (tzSelect) {
        npc.timezone = parseFloat(tzSelect.value);
    }

    saveNpcs(npcs);

    // 刷新弹窗显示
    renderNpcProfile(npc);
    renderPosts();
    alert('资料已保存');
}

// ==================== 私信聊天弹窗 ====================
let currentDmNpcId = null;

function openDmChat(npcId) {
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === npcId);
    if (!npc) { alert('该NPC已不存在'); return; }
    currentDmNpcId = npcId;
    document.getElementById('dmChatTitle').textContent = '💌 ' + npc.name;
    const dmData = getDmData(npcId);
    renderDmMessages(dmData, npc);
    showModal('dmChat');
    document.getElementById('dmChatInput').value = '';
    // 滚动到底部
    setTimeout(() => {
        const body = document.getElementById('dmChatMessages');
        body.scrollTop = body.scrollHeight;
    }, 100);
}

function closeDmChat() { hideModal('dmChat'); currentDmNpcId = null; }

function renderDmMessages(dmData, npc) {
    const container = document.getElementById('dmChatMessages');
    if (!dmData.messages.length) {
        container.innerHTML = `<div style="padding:40px 20px;text-align:center;color:var(--forum-text-sub);font-size:14px;">还没有消息，说点什么吧~</div>`;
        return;
    }
    const npcAvatar = npc.avatarUrl
        ? `<img src="${esc(npc.avatarUrl)}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px;" onerror="this.style.display='none'">`
        : (npc.emoji || '🧑') + ' ';

    container.innerHTML = `<div class="dm-msg-list">` + dmData.messages.map(m => {
        const isUser = m.sender === 'user';
        const cls = isUser ? 'dm-msg-user' : 'dm-msg-npc';
        const prefix = isUser ? '' : npcAvatar;
        return `<div class="dm-msg-bubble ${cls}">${prefix}${esc(m.message)}<div class="dm-msg-time">${timeAgo(m.timestamp)}</div></div>`;
    }).join('') + `</div>`;
}

async function sendDmMessage() {
    if (!currentDmNpcId) return;
    const input = document.getElementById('dmChatInput');
    const text = input.value.trim();
    if (!text) return;

    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === currentDmNpcId);
    if (!npc) return;

    // 保存用户消息
    const dmData = getDmData(currentDmNpcId);
    dmData.messages.push({ sender: 'user', message: text, timestamp: Date.now() });
    saveDmData(currentDmNpcId, dmData);
    input.value = '';
    renderDmMessages(dmData, npc);

    // 滚动到底部
    const body = document.getElementById('dmChatMessages');
    body.scrollTop = body.scrollHeight;

    // 显示"正在输入"
    const msgList = body.querySelector('.dm-msg-list');
    if (msgList) {
        msgList.insertAdjacentHTML('beforeend', `<div class="dm-msg-bubble dm-msg-typing" id="dmTypingIndicator">正在输入...</div>`);
        body.scrollTop = body.scrollHeight;
    }

    // 禁用发送按钮
    const sendBtn = document.getElementById('dmSendBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = '...';

    try {
        const { apiUrl, apiKey, model } = getApiConfig();
        if (!apiUrl || !apiKey) throw new Error('请先在消息app中配置API方案');

        const systemPrompt = buildDmSystemPrompt(npc, dmData);
        const chatMessages = buildDmMessages(dmData, text);

        // 构建完整消息数组：system + 对话历史
        const fullMessages = [{ role: 'system', content: systemPrompt }, ...chatMessages];
        const reply = await callLLMMultiTurn(apiUrl, apiKey, model, fullMessages, 0.8);

        // 保存NPC回复
        const freshData = getDmData(currentDmNpcId);
        freshData.messages.push({ sender: 'npc', message: reply, timestamp: Date.now() });
        saveDmData(currentDmNpcId, freshData);
        renderDmMessages(freshData, npc);

        // 自动总结触发检查
        const trigger = freshData.autoSumTrigger || 0;
        if (trigger > 0) {
            const lastSumAt = freshData._lastSumAt || 0;
            const newTotal = freshData.messages.length;
            if (newTotal - lastSumAt >= trigger) {
                triggerDmAutoSummarize(currentDmNpcId);
            }
        }
    } catch (e) {
        // 移除typing indicator，显示错误
        const typing = document.getElementById('dmTypingIndicator');
        if (typing) typing.remove();
        const errDiv = document.createElement('div');
        errDiv.className = 'dm-msg-bubble dm-msg-error';
        errDiv.textContent = '⚠️ ' + (e.message || '发送失败');
        if (msgList) msgList.appendChild(errDiv);
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = '发送';
        body.scrollTop = body.scrollHeight;
    }
}

// ==================== 私信结构化记忆数据层 ====================

const DM_DEFAULT_MEMORY_CATEGORIES = [
    { id: 'F', name: '偏好/事实', isDefault: true },
    { id: 'R', name: '关系变化', isDefault: true },
    { id: 'E', name: '事件', isDefault: true },
    { id: 'P', name: '计划/待办', isDefault: true },
    { id: 'D', name: '决定', isDefault: true },
    { id: 'M', name: '情绪节点', isDefault: true }
];

function getDmStructuredMemory(dmData) {
    if (!dmData.structuredMemory) {
        dmData.structuredMemory = {
            categories: DM_DEFAULT_MEMORY_CATEGORIES.map(c => ({ ...c })),
            entries: []
        };
    }
    return dmData.structuredMemory;
}

function saveDmStructuredMemory(npcId, memory) {
    const dmData = getDmData(npcId);
    dmData.structuredMemory = memory;
    saveDmData(npcId, dmData);
}

function addDmMemoryEntry(npcId, categoryId, text, date) {
    const dmData = getDmData(npcId);
    const memory = getDmStructuredMemory(dmData);
    const entry = {
        id: Date.now(),
        category: categoryId,
        text: text,
        date: date,
        createdAt: Date.now()
    };
    memory.entries.push(entry);
    saveDmStructuredMemory(npcId, memory);
    return entry;
}

function editDmMemoryEntry(npcId, entryId, text, date) {
    const dmData = getDmData(npcId);
    const memory = getDmStructuredMemory(dmData);
    const entry = memory.entries.find(e => e.id === entryId);
    if (!entry) return false;
    if (text !== undefined) entry.text = text;
    if (date !== undefined) entry.date = date;
    saveDmStructuredMemory(npcId, memory);
    return true;
}

function deleteDmMemoryEntry(npcId, entryId) {
    const dmData = getDmData(npcId);
    const memory = getDmStructuredMemory(dmData);
    memory.entries = memory.entries.filter(e => e.id !== entryId);
    saveDmStructuredMemory(npcId, memory);
}

function addDmCustomCategory(npcId, name, shortId) {
    const dmData = getDmData(npcId);
    const memory = getDmStructuredMemory(dmData);
    if (memory.categories.some(c => c.id === shortId)) return false;
    memory.categories.push({ id: shortId, name: name, isDefault: false });
    saveDmStructuredMemory(npcId, memory);
    return true;
}

function deleteDmCustomCategory(npcId, categoryId) {
    const dmData = getDmData(npcId);
    const memory = getDmStructuredMemory(dmData);
    const cat = memory.categories.find(c => c.id === categoryId);
    if (!cat || cat.isDefault) return false;
    memory.categories = memory.categories.filter(c => c.id !== categoryId);
    memory.entries = memory.entries.filter(e => e.category !== categoryId);
    saveDmStructuredMemory(npcId, memory);
    return true;
}

function estimateDmTokenCount(memory) {
    if (!memory || !memory.entries || memory.entries.length === 0) return 0;
    let total = 0;
    for (const entry of memory.entries) {
        const text = entry.text || '';
        for (const char of text) {
            if (char.charCodeAt(0) >= 0x4E00 && char.charCodeAt(0) <= 0x9FFF) {
                total += 1.5;
            } else {
                total += 0.25;
            }
        }
    }
    const categoryCount = memory.categories ? memory.categories.length : 6;
    total += categoryCount * 10;
    return Math.round(total);
}

// ==================== 私信结构化记忆核心逻辑 ====================

function formatDmStructuredMemory(dmData) {
    const memory = dmData.structuredMemory;
    if (!memory || !memory.entries || memory.entries.length === 0) return '';
    const lines = ['[角色记忆]'];
    for (const cat of memory.categories) {
        const catEntries = memory.entries.filter(e => e.category === cat.id);
        if (catEntries.length === 0) continue;
        lines.push(`【${cat.name}】`);
        for (const entry of catEntries) {
            lines.push(`- ${entry.text} (${entry.date})`);
        }
        lines.push('');
    }
    return lines.join('\n');
}

async function extractDmStructuredMemory(npcId) {
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey || !model) {
        console.error('❌ [DM记忆提取] 无 API 配置');
        return null;
    }

    const dmData = getDmData(npcId);
    const memory = getDmStructuredMemory(dmData);
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === npcId);
    const charName = npc ? npc.name : 'NPC';
    const today = new Date().toISOString().slice(0, 10);

    // 构建自定义类别描述
    const customCats = memory.categories
        .filter(c => !c.isDefault)
        .map(c => `   - ${c.id}: ${c.name}`)
        .join('\n');
    const customCategoriesBlock = customCats ? '\n' + customCats : '';

    // 构建现有记忆上下文
    let existingMemoryBlock = '';
    for (const cat of memory.categories) {
        const catEntries = memory.entries.filter(e => e.category === cat.id);
        if (catEntries.length === 0) continue;
        existingMemoryBlock += `【${cat.name}(${cat.id})】\n`;
        for (const entry of catEntries) {
            existingMemoryBlock += `- ${entry.text} (${entry.date})\n`;
        }
    }
    if (!existingMemoryBlock) existingMemoryBlock = '（暂无）';

    const extractionPrompt = `你是一个记忆提取助手。请从以下对话中提取关键信息，以角色（${charName}）的第一人称视角书写。

要求：
1. 每条记忆用简短客观的一句话描述
2. 附带日期（YYYY-MM-DD格式，使用今天的日期：${today}）
3. 按以下类别分类：
   - F: 偏好/事实（用户的喜好、个人信息等）
   - R: 关系变化（关系状态的变化）
   - E: 事件（发生的重要事件）
   - P: 计划/待办（提到的计划或待办事项）
   - D: 决定（做出的决定）
   - M: 情绪节点（重要的情绪变化）${customCategoriesBlock}

现有记忆（请判断哪些需要更新或新增，避免重复）：
${existingMemoryBlock}

请以JSON格式输出：
{
  "entries": [
    {"category": "F", "text": "记忆内容", "date": "${today}"},
    ...
  ]
}

只输出JSON，不要其他文字。`;

    // 构建对话文本
    const conversationText = dmData.messages.map(m => {
        const sender = m.sender === 'user' ? '用户' : charName;
        return `${sender}: ${m.message}`;
    }).join('\n');

    try {
        const reply = await callLLM(apiUrl, apiKey, model, conversationText, 0.3, extractionPrompt);

        // 尝试提取 JSON（处理可能的 markdown 代码块包裹）
        let jsonStr = reply.trim();
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1].trim();

        const parsed = JSON.parse(jsonStr);
        if (!parsed.entries || !Array.isArray(parsed.entries)) {
            throw new Error('返回 JSON 缺少 entries 数组');
        }

        // 校验并过滤有效条目
        const validCategoryIds = new Set(memory.categories.map(c => c.id));
        const validEntries = parsed.entries.filter(e => {
            if (!e.category || !e.text || !e.date) return false;
            if (!validCategoryIds.has(e.category)) return false;
            return true;
        });

        // 合并到现有记忆
        const freshData = getDmData(npcId);
        const freshMemory = getDmStructuredMemory(freshData);
        for (const item of validEntries) {
            freshMemory.entries.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                category: item.category,
                text: item.text,
                date: item.date,
                createdAt: Date.now()
            });
        }
        saveDmStructuredMemory(npcId, freshMemory);

        // 更新 _lastSumAt 标记
        const updatedData = getDmData(npcId);
        updatedData._lastSumAt = updatedData.messages.length;
        saveDmData(npcId, updatedData);

        console.log(`✅ [DM记忆提取] 成功提取 ${validEntries.length} 条记忆`);
        return validEntries;

    } catch (error) {
        console.error('❌ [DM记忆提取] 失败:', error);
        return null;
    }
}

// ==================== 私信记忆设置弹窗 ====================

function openDmMemory() {
    if (!currentDmNpcId) return;
    const dmData = getDmData(currentDmNpcId);
    document.getElementById('dmContextWindow').value = dmData.contextWindow || 10;
    document.getElementById('dmAutoSumTrigger').value = dmData.autoSumTrigger || 0;
    renderDmStructuredMemory(currentDmNpcId);
    showModal('dmMemory');
}

function closeDmMemory() { hideModal('dmMemory'); }

function saveDmMemorySettings() {
    if (!currentDmNpcId) return;
    const dmData = getDmData(currentDmNpcId);
    dmData.contextWindow = parseInt(document.getElementById('dmContextWindow').value) || 10;
    dmData.autoSumTrigger = parseInt(document.getElementById('dmAutoSumTrigger').value) || 0;
    saveDmData(currentDmNpcId, dmData);
    closeDmMemory();
}

// ==================== 私信结构化记忆 UI ====================

function renderDmStructuredMemory(npcId) {
    const container = document.getElementById('dmSmContainer');
    if (!container) return;
    const dmData = getDmData(npcId);
    const memory = getDmStructuredMemory(dmData);

    // Token 计数
    const tokenCount = estimateDmTokenCount(memory);
    const tokenEl = document.getElementById('dmSmTokenCount');
    if (tokenEl) tokenEl.textContent = `Token: ~${tokenCount}`;

    container.innerHTML = '';

    // 按类别渲染
    for (const cat of memory.categories) {
        const catEntries = memory.entries.filter(e => e.category === cat.id);
        const section = document.createElement('div');
        section.className = 'dm-sm-category-section';

        const header = document.createElement('div');
        header.className = 'dm-sm-category-header';
        header.innerHTML = `
            <span class="dm-sm-category-name">▼ ${cat.name} (${cat.id})</span>
            <span class="dm-sm-category-meta">
                <span class="dm-sm-category-count">${catEntries.length}条</span>
                ${!cat.isDefault ? `<button class="dm-sm-btn-icon dm-sm-btn-del-cat" onclick="dmSmDeleteCategory('${escJs(cat.id)}')" title="删除类别">🗑</button>` : ''}
                <button class="dm-sm-btn-icon" onclick="dmSmShowAddForm('${escJs(cat.id)}')" title="添加条目">+</button>
            </span>
        `;
        section.appendChild(header);

        // 添加条目内联表单（默认隐藏）
        const addForm = document.createElement('div');
        addForm.className = 'dm-sm-add-form';
        addForm.id = `dm-sm-add-form-${cat.id}`;
        addForm.style.display = 'none';
        const today = new Date().toISOString().slice(0, 10);
        addForm.innerHTML = `
            <input type="text" class="dm-sm-input" id="dm-sm-add-text-${cat.id}" placeholder="输入记忆内容（角色第一人称）">
            <input type="date" class="dm-sm-input dm-sm-input-date" id="dm-sm-add-date-${cat.id}" value="${today}">
            <div class="dm-sm-add-actions">
                <button class="dm-sm-btn dm-sm-btn-primary" onclick="dmSmConfirmAdd('${escJs(cat.id)}')">添加</button>
                <button class="dm-sm-btn dm-sm-btn-secondary" onclick="dmSmCancelAdd('${escJs(cat.id)}')">取消</button>
            </div>
        `;
        section.appendChild(addForm);

        if (catEntries.length === 0) {
            const emptyHint = document.createElement('div');
            emptyHint.className = 'dm-sm-empty-hint';
            emptyHint.textContent = '暂无条目，点击 + 添加';
            section.appendChild(emptyHint);
        } else {
            for (const entry of catEntries) {
                const entryEl = document.createElement('div');
                entryEl.className = 'dm-sm-entry';
                entryEl.innerHTML = `
                    <div class="dm-sm-entry-view" id="dm-sm-view-${entry.id}">
                        <span class="dm-sm-entry-text">• ${esc(entry.text)} <span class="dm-sm-entry-date">(${esc(entry.date)})</span></span>
                        <span class="dm-sm-entry-actions">
                            <button class="dm-sm-btn-icon" onclick="dmSmEditEntry(${entry.id})" title="编辑">✏️</button>
                            <button class="dm-sm-btn-icon" onclick="dmSmDeleteEntry(${entry.id})" title="删除">🗑</button>
                        </span>
                    </div>
                    <div class="dm-sm-entry-edit" id="dm-sm-edit-${entry.id}" style="display:none;">
                        <input type="text" class="dm-sm-input" id="dm-sm-edit-text-${entry.id}" value="${esc(entry.text)}">
                        <input type="date" class="dm-sm-input dm-sm-input-date" id="dm-sm-edit-date-${entry.id}" value="${entry.date}">
                        <div class="dm-sm-add-actions">
                            <button class="dm-sm-btn dm-sm-btn-primary" onclick="dmSmConfirmEdit(${entry.id})">保存</button>
                            <button class="dm-sm-btn dm-sm-btn-secondary" onclick="dmSmCancelEdit(${entry.id})">取消</button>
                        </div>
                    </div>
                `;
                section.appendChild(entryEl);
            }
        }
        container.appendChild(section);
    }

    // 添加自定义类别按钮
    const addCatArea = document.createElement('div');
    addCatArea.className = 'dm-sm-add-category-area';
    addCatArea.innerHTML = `
        <div id="dm-sm-add-cat-form" style="display:none;" class="dm-sm-add-form">
            <input type="text" class="dm-sm-input" id="dm-sm-add-cat-name" placeholder="类别名称（如：习惯）">
            <input type="text" class="dm-sm-input" id="dm-sm-add-cat-id" placeholder="标识符（如：H）" maxlength="3">
            <div class="dm-sm-add-actions">
                <button class="dm-sm-btn dm-sm-btn-primary" onclick="dmSmConfirmAddCategory()">添加</button>
                <button class="dm-sm-btn dm-sm-btn-secondary" onclick="document.getElementById('dm-sm-add-cat-form').style.display='none'">取消</button>
            </div>
        </div>
        <button class="dm-sm-btn dm-sm-btn-outline" onclick="document.getElementById('dm-sm-add-cat-form').style.display='block'">+ 添加自定义类别</button>
    `;
    container.appendChild(addCatArea);

    // 手动总结按钮
    const sumArea = document.createElement('div');
    sumArea.className = 'dm-sm-summarize-area';
    sumArea.innerHTML = `<button class="dm-sm-btn dm-sm-btn-summarize" id="dmSmExtractBtn" onclick="dmSmManualExtract()">🤖 总结</button>`;
    container.appendChild(sumArea);
}

// ==================== 私信结构化记忆 UI 交互 ====================

function dmSmShowAddForm(categoryId) {
    document.getElementById(`dm-sm-add-form-${categoryId}`).style.display = 'block';
    document.getElementById(`dm-sm-add-text-${categoryId}`).focus();
}

function dmSmCancelAdd(categoryId) {
    document.getElementById(`dm-sm-add-form-${categoryId}`).style.display = 'none';
    document.getElementById(`dm-sm-add-text-${categoryId}`).value = '';
}

function dmSmConfirmAdd(categoryId) {
    if (!currentDmNpcId) return;
    const text = document.getElementById(`dm-sm-add-text-${categoryId}`).value.trim();
    const date = document.getElementById(`dm-sm-add-date-${categoryId}`).value;
    if (!text) { alert('请输入记忆内容'); return; }
    addDmMemoryEntry(currentDmNpcId, categoryId, text, date || new Date().toISOString().slice(0, 10));
    renderDmStructuredMemory(currentDmNpcId);
}

function dmSmEditEntry(entryId) {
    document.getElementById(`dm-sm-view-${entryId}`).style.display = 'none';
    document.getElementById(`dm-sm-edit-${entryId}`).style.display = 'block';
}

function dmSmCancelEdit(entryId) {
    document.getElementById(`dm-sm-view-${entryId}`).style.display = '';
    document.getElementById(`dm-sm-edit-${entryId}`).style.display = 'none';
}

function dmSmConfirmEdit(entryId) {
    if (!currentDmNpcId) return;
    const text = document.getElementById(`dm-sm-edit-text-${entryId}`).value.trim();
    const date = document.getElementById(`dm-sm-edit-date-${entryId}`).value;
    if (!text) { alert('请输入记忆内容'); return; }
    editDmMemoryEntry(currentDmNpcId, entryId, text, date);
    renderDmStructuredMemory(currentDmNpcId);
}

function dmSmDeleteEntry(entryId) {
    if (!confirm('确定要删除这条记忆吗？')) return;
    if (!currentDmNpcId) return;
    deleteDmMemoryEntry(currentDmNpcId, entryId);
    renderDmStructuredMemory(currentDmNpcId);
}

function dmSmConfirmAddCategory() {
    if (!currentDmNpcId) return;
    const name = document.getElementById('dm-sm-add-cat-name').value.trim();
    const shortId = document.getElementById('dm-sm-add-cat-id').value.trim().toUpperCase();
    if (!name || !shortId) { alert('请填写类别名称和标识符'); return; }
    if (!addDmCustomCategory(currentDmNpcId, name, shortId)) {
        alert('标识符已存在，请更换');
        return;
    }
    renderDmStructuredMemory(currentDmNpcId);
}

function dmSmDeleteCategory(categoryId) {
    if (!confirm('删除该类别将同时删除其下所有条目，确定吗？')) return;
    if (!currentDmNpcId) return;
    deleteDmCustomCategory(currentDmNpcId, categoryId);
    renderDmStructuredMemory(currentDmNpcId);
}

async function dmSmManualExtract() {
    if (!currentDmNpcId) return;
    const dmData = getDmData(currentDmNpcId);
    if (!dmData.messages || !dmData.messages.length) {
        alert('还没有聊天记录，无法总结');
        return;
    }
    const btn = document.getElementById('dmSmExtractBtn');
    btn.disabled = true;
    btn.textContent = '🤖 提取中...';
    try {
        const result = await extractDmStructuredMemory(currentDmNpcId);
        if (result) {
            renderDmStructuredMemory(currentDmNpcId);
            alert(`记忆提取完成！提取了 ${result.length} 条记忆`);
        } else {
            alert('记忆提取失败，请检查 API 配置');
        }
    } catch (e) {
        alert('记忆提取失败：' + (e.message || '未知错误'));
    } finally {
        btn.disabled = false;
        btn.textContent = '🤖 总结';
    }
}

// ==================== 私信自动总结触发 ====================

async function triggerDmAutoSummarize(npcId) {
    try {
        const result = await extractDmStructuredMemory(npcId);
        if (result) {
            console.log('✅ 私信自动记忆提取完成');
        }
    } catch (e) {
        console.error('私信自动记忆提取失败:', e);
    }
}

// ==================== 私信列表弹窗 ====================

function openDmList() {
    const npcs = getNpcs();
    const followedNpcs = npcs.filter(n => n.followed);

    const container = document.getElementById('dmListContent');

    if (!followedNpcs.length) {
        container.innerHTML = `<div class="dm-list-empty">💌 还没有关注任何NPC<br><span style="font-size:12px;margin-top:8px;display:block;">在帖子中点击NPC头像即可关注</span></div>`;
        showModal('dmList');
        return;
    }

    // 获取每个NPC的最后消息时间
    const npcWithDm = followedNpcs.map(npc => {
        const dm = getDmData(npc.id);
        const lastMsg = dm.messages.length ? dm.messages[dm.messages.length - 1] : null;
        return { npc, dm, lastMsg, lastTime: lastMsg ? lastMsg.timestamp : 0 };
    });

    // 按最后消息时间倒序，无消息的排最后
    npcWithDm.sort((a, b) => b.lastTime - a.lastTime);

    container.innerHTML = npcWithDm.map(({ npc, lastMsg }) => {
        const avatar = npc.avatarUrl
            ? `<img src="${esc(npc.avatarUrl)}" onerror="this.parentElement.textContent='${npc.emoji || '🧑'}'">`
            : (npc.emoji || '🧑');
        const preview = lastMsg
            ? esc((lastMsg.sender === 'user' ? '我: ' : '') + lastMsg.message)
            : '还没有消息';
        const time = lastMsg ? timeAgo(lastMsg.timestamp) : '';
        return `<div class="dm-list-item" onclick="closeDmList();openDmChat('${npc.id}')">
            <div class="dm-list-avatar">${avatar}</div>
            <div class="dm-list-info">
                <div class="dm-list-name">${esc(npc.name)}</div>
                <div class="dm-list-preview">${preview}</div>
            </div>
            <div class="dm-list-time">${time}</div>
        </div>`;
    }).join('');

    showModal('dmList');
}

function closeDmList() { hideModal('dmList'); }

// ==================== 发帖记忆管理弹窗 ====================
function openPostMemoryManager() {
    renderPostMemoryManager();
    showModal('postMemoryManager');
}
function closePostMemoryManager() { hideModal('postMemoryManager'); }

function renderPostMemoryManager() {
    const container = document.getElementById('postMemoryManagerContent');
    const contacts = getS('vibe_contacts', []);
    const npcs = getNpcs();
    const followedNpcs = npcs.filter(n => n.followed);
    let html = '<div class="forum-form">';

    // CHAR 发帖记忆
    for (const c of contacts.slice(0, 10)) {
        const charId = c.id;
        const name = c.nickname || c.name || 'CHAR';
        const entries = getCharPostMemory(charId);
        html += `<div class="pm-group-card">
            <div class="pm-group-header"><span>👤 ${esc(name)}</span><span class="pm-group-count">${entries.length}条</span></div>`;
        if (entries.length) {
            html += entries.map(e => {
                const dateStr = new Date(e.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
                return `<div class="pm-entry-row" id="pm-view-char-${charId}-${e.id}">
                    <span class="pm-entry-text">${esc(e.summary)}</span>
                    <span class="pm-entry-date">${dateStr}</span>
                    <button class="dm-sm-btn-icon" onclick="pmStartEdit('char','${charId}',${e.id})" title="编辑">✏️</button>
                    <button class="dm-sm-btn-icon" onclick="pmDelete('char','${charId}',${e.id})" title="删除">🗑</button>
                </div>
                <div class="pm-entry-edit-row" id="pm-edit-char-${charId}-${e.id}" style="display:none;">
                    <input type="text" class="dm-sm-input" id="pm-edit-input-char-${charId}-${e.id}" value="${esc(e.summary)}">
                    <button class="dm-sm-btn dm-sm-btn-primary" onclick="pmSaveEdit('char','${charId}',${e.id})">保存</button>
                    <button class="dm-sm-btn dm-sm-btn-secondary" onclick="pmCancelEdit('char','${charId}',${e.id})">取消</button>
                </div>`;
            }).join('');
        } else {
            html += '<div class="dm-sm-empty-hint">暂无论坛动态</div>';
        }
        html += `<div class="pm-add-row">
            <input type="text" class="dm-sm-input" id="pm-add-char-${charId}" placeholder="手动添加记忆...">
            <button class="dm-sm-btn dm-sm-btn-primary" onclick="pmAdd('char','${charId}')">添加</button>
        </div></div>`;
    }

    // 已关注 NPC 发帖记忆
    for (const npc of followedNpcs) {
        const entries = getNpcPostMemory(npc.id);
        html += `<div class="pm-group-card">
            <div class="pm-group-header"><span>⭐ ${esc(npc.name)}</span><span class="pm-group-count">${entries.length}条</span></div>`;
        if (entries.length) {
            html += entries.map(e => {
                const dateStr = new Date(e.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
                return `<div class="pm-entry-row" id="pm-view-npc-${npc.id}-${e.id}">
                    <span class="pm-entry-text">${esc(e.summary)}</span>
                    <span class="pm-entry-date">${dateStr}</span>
                    <button class="dm-sm-btn-icon" onclick="pmStartEdit('npc','${npc.id}',${e.id})" title="编辑">✏️</button>
                    <button class="dm-sm-btn-icon" onclick="pmDelete('npc','${npc.id}',${e.id})" title="删除">🗑</button>
                </div>
                <div class="pm-entry-edit-row" id="pm-edit-npc-${npc.id}-${e.id}" style="display:none;">
                    <input type="text" class="dm-sm-input" id="pm-edit-input-npc-${npc.id}-${e.id}" value="${esc(e.summary)}">
                    <button class="dm-sm-btn dm-sm-btn-primary" onclick="pmSaveEdit('npc','${npc.id}',${e.id})">保存</button>
                    <button class="dm-sm-btn dm-sm-btn-secondary" onclick="pmCancelEdit('npc','${npc.id}',${e.id})">取消</button>
                </div>`;
            }).join('');
        } else {
            html += '<div class="dm-sm-empty-hint">暂无论坛动态</div>';
        }
        html += `<div class="pm-add-row">
            <input type="text" class="dm-sm-input" id="pm-add-npc-${npc.id}" placeholder="手动添加记忆...">
            <button class="dm-sm-btn dm-sm-btn-primary" onclick="pmAdd('npc','${npc.id}')">添加</button>
        </div></div>`;
    }

    if (!contacts.length && !followedNpcs.length) {
        html += '<div class="dm-sm-empty-hint" style="text-align:center;padding:40px 0;">暂无角色，请先添加联系人或关注NPC</div>';
    }

    html += '</div>';
    container.innerHTML = html;
}

function pmStartEdit(type, id, entryId) {
    document.getElementById(`pm-view-${type}-${id}-${entryId}`).style.display = 'none';
    document.getElementById(`pm-edit-${type}-${id}-${entryId}`).style.display = 'flex';
}
function pmCancelEdit(type, id, entryId) {
    document.getElementById(`pm-view-${type}-${id}-${entryId}`).style.display = '';
    document.getElementById(`pm-edit-${type}-${id}-${entryId}`).style.display = 'none';
}
function pmSaveEdit(type, id, entryId) {
    const input = document.getElementById(`pm-edit-input-${type}-${id}-${entryId}`);
    const text = input.value.trim();
    if (!text) { alert('内容不能为空'); return; }
    editPostMemoryEntry(type, id, entryId, text);
    renderPostMemoryManager();
}
function pmDelete(type, id, entryId) {
    if (!confirm('确定删除这条记忆？')) return;
    deletePostMemoryEntry(type, id, entryId);
    renderPostMemoryManager();
}
function pmAdd(type, id) {
    const input = document.getElementById(`pm-add-${type}-${id}`);
    const text = input.value.trim();
    if (!text) return;
    addPostMemoryEntry(type, id, text, Date.now(), '', 'post');
    input.value = '';
    renderPostMemoryManager();
}

// 发帖记忆设置
function openPostMemorySettings() {
    const settings = getForumSettings();
    document.getElementById('charPostMemoryLimit').value = settings.charPostMemoryLimit || DEFAULT_CHAR_POST_MEMORY_LIMIT;
    document.getElementById('npcPostMemoryLimit').value = settings.npcPostMemoryLimit || DEFAULT_NPC_POST_MEMORY_LIMIT;
    showModal('postMemorySettings');
}
function closePostMemorySettings() { hideModal('postMemorySettings'); }
function savePostMemorySettings() {
    const settings = getForumSettings();
    settings.charPostMemoryLimit = parseInt(document.getElementById('charPostMemoryLimit').value) || DEFAULT_CHAR_POST_MEMORY_LIMIT;
    settings.npcPostMemoryLimit = parseInt(document.getElementById('npcPostMemoryLimit').value) || DEFAULT_NPC_POST_MEMORY_LIMIT;
    saveForumSettings(settings);
    closePostMemorySettings();
    alert('设置已保存');
}

// ==================== 刷新生成帖子 ====================
let isRefreshing = false;

async function refreshForum() {
    if (isRefreshing) return;
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey) { alert('请先在消息app中配置API方案'); return; }

    isRefreshing = true;
    const btn = document.getElementById('refreshBtn');
    btn.classList.add('spinning');
    btn.style.pointerEvents = 'none';

    try {
        const world = getActiveWorld();
        const boards = world.boards;
        const contacts = getS('vibe_contacts', []);
        const existingNpcs = getNpcs();

        // 构建 CHAR 信息（含结构化记忆摘要）
        const charInfos = contacts.slice(0, 5).map(c => {
            const name = c.nickname || c.name || 'CHAR';
            const persona = c.personality ? c.personality.slice(0, 100) : '';
            // 附加结构化记忆中的关键信息
            let memoryHint = '';
            if (c.structuredMemory && c.structuredMemory.entries && c.structuredMemory.entries.length) {
                const keyFacts = c.structuredMemory.entries
                    .filter(e => e.category === 'F' || e.category === 'R' || e.category === 'E')
                    .slice(-5)
                    .map(e => e.text)
                    .join('；');
                if (keyFacts) memoryHint = `，记忆：${keyFacts}`;
            }
            return `${name}${persona ? '（' + persona + '）' : ''}${memoryHint}`;
        });

        // 构建路人信息（随机抽几个老路人，鼓励创建新人）
        const sampledNpcs = sampleNpcs(existingNpcs, 3);
        const npcInfos = sampledNpcs.map(n => {
            const tags = n.personality ? `（${n.personality}）` : '';
            return `${n.name}${tags}`;
        });

        const boardNames = boards.map(b => `${b.emoji}${b.name}`).join('、');
        const worldDesc = world.desc || world.name;

        // 构建时间上下文和发帖记忆
        const followedNpcs = existingNpcs.filter(n => n.followed);
        const timeContextBlock = buildTimeContextPrompt(sampledNpcs);
        const postMemoryBlock = buildPostMemoryPrompt(contacts.slice(0, 5), followedNpcs);

        const sysPrompt = `你是一个论坛内容生成器。你要为一个名为"${world.name}"的论坛生成帖子。
世界观设定：${worldDesc}
论坛板块：${boardNames}
${timeContextBlock}${postMemoryBlock}
规则：
1. 生成5-8个帖子，混合不同板块
2. 帖子作者分两类：
   - CHAR（已知角色）：${charInfos.length ? charInfos.join('、') : '无'}。他们发帖要符合自己的性格
   - 路人（论坛普通用户）：${npcInfos.length ? '可以偶尔复用这些老用户：' + npcInfos.join('、') + '。但大部分帖子请创建全新的路人，论坛用户是流动的' : '请创建新路人'}
3. 路人的网名要像真实互联网用户，风格多样：
   - 可以是谐音梗、缩写、二次元、自嘲、抽象、文艺、搞笑等各种风格
   - 例如：今天也在摸鱼、xswl别笑了、深夜emo选手、咸鱼本鱼、不想上班的第365天、摆烂大师、人间清醒、退堂鼓表演艺术家
   - 绝对不要用"XX爱好者""XX小达人""XX之星"这种模板化命名
4. 每个新路人要有一个personality字段，描述他们的性格特点（10-20字），让每个人说话风格不同
   - 有的毒舌、有的温柔、有的话痨、有的高冷、有的搞笑、有的丧、有的中二
5. 帖子内容要自然、多样，像真实论坛一样。有日常吐槽、提问、分享、搞笑段子等
6. 每个帖子可以有0-3条回复，回复者可以是其他CHAR、路人、或者不同的路人
7. 回复内容要符合回复者的性格特点
8. 世界不是围绕CHAR转的，路人有自己的生活和话题
9. 部分帖子和回复可以带附件（图片/视频/音频），用attachments字段表示
10. 只输出JSON，不要输出其他文字

JSON格式：
[{
  "authorType": "char或npc",
  "authorName": "作者名",
  "personality": "性格特点（仅新路人需要）",
  "board": "板块名（必须是上面列出的板块之一）",
  "title": "帖子标题",
  "content": "帖子内容（50-200字）",
  "attachments": [{"type":"image或video或audio","url":"https://虚构链接","desc":"文字描述内容"}],
  "replies": [{"authorType":"char或npc","authorName":"回复者名","personality":"性格特点（仅新路人需要）","content":"回复内容","attachments":[]}]
}]`;

        const resp = await callLLM(apiUrl, apiKey, model, '请生成论坛帖子', 0.85, sysPrompt);

        // 解析 JSON
        let generated;
        try {
            const jsonMatch = resp.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('未找到JSON');
            generated = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error('论坛生成解析失败:', e, resp);
            throw new Error('生成内容解析失败');
        }

        if (!Array.isArray(generated) || !generated.length) throw new Error('生成内容为空');

        // 转换为帖子格式
        const now = Date.now();
        const newPosts = [];

        generated.forEach((item, i) => {
            // 匹配板块
            const board = boards.find(b => b.name === item.board) || boards[0];

            // 处理作者
            let authorId = null, authorType = item.authorType || 'npc', authorName = item.authorName || '匿名';
            if (authorType === 'char') {
                const c = contacts.find(ct => (ct.nickname || ct.name) === authorName);
                if (c) { authorId = c.id; } else { authorType = 'npc'; }
            }
            if (authorType === 'npc') {
                getOrCreateNpc(authorName, item.personality);
            }

            // 处理回复
            const replies = (item.replies || []).map((r, ri) => {
                let rType = r.authorType || 'npc', rName = r.authorName || '路人';
                let rId = null;
                if (rType === 'char') {
                    const c = contacts.find(ct => (ct.nickname || ct.name) === rName);
                    if (c) { rId = c.id; } else { rType = 'npc'; }
                }
                if (rType === 'npc') getOrCreateNpc(rName, r.personality);
                const reply = {
                    id: `r_${now}_${i}_${ri}`,
                    authorType: rType, authorId: rId, authorName: rName,
                    content: r.content || '', createdAt: now - (generated.length - i) * 60000 + ri * 30000
                };
                if (r.attachments && Array.isArray(r.attachments) && r.attachments.length) {
                    reply.attachments = r.attachments.map(a => ({ type: a.type || 'image', url: a.url || '', desc: a.desc || '' }));
                }
                return reply;
            });

            const newPost = {
                id: `p_${now}_${i}`,
                boardId: board.id,
                authorType, authorId, authorName,
                title: item.title || '无题',
                content: item.content || '',
                likes: Math.floor(Math.random() * 50),
                pinned: false,
                bookmarked: false,
                replies,
                createdAt: now - (generated.length - i) * 120000
            };
            if (item.attachments && Array.isArray(item.attachments) && item.attachments.length) {
                newPost.attachments = item.attachments.map(a => ({ type: a.type || 'image', url: a.url || '', desc: a.desc || '' }));
            }
            newPosts.push(newPost);
        });

        // 保留追更的帖子，替换非追更的
        const existing = getPosts();
        const bookmarked = existing.filter(p => p.bookmarked);
        savePosts([...newPosts, ...bookmarked]);

        // 自动生成发帖记忆
        scanAndSavePostMemory(newPosts);

        renderPosts();
        console.log(`✅ 论坛刷新成功: 生成${newPosts.length}个帖子，保留${bookmarked.length}个追更帖`);

    } catch (e) {
        console.error('论坛刷新失败:', e);
        alert('刷新失败: ' + e.message);
    } finally {
        isRefreshing = false;
        btn.classList.remove('spinning');
        btn.style.pointerEvents = '';
    }
}

// ==================== 路人头像渲染 ====================
// 覆盖 getAvatar 以支持 NPC
function getAvatar(post, contacts) {
    if (post.authorType === 'user') return '👤';
    if (post.authorType === 'char') {
        const c = contacts.find(ct => String(ct.id) === String(post.authorId));
        if (c && c.avatarUrl) return `<img src="${esc(c.avatarUrl)}" alt="">`;
        return post.authorName ? post.authorName[0] : '?';
    }
    // NPC - 优先使用URL头像
    const npcs = getNpcs();
    const npc = npcs.find(n => n.name === post.authorName);
    if (npc) {
        if (npc.avatarUrl) return `<img src="${esc(npc.avatarUrl)}" alt="">`;
        return npc.emoji;
    }
    return post.authorName ? post.authorName[0] : '?';
}

function getReplyAvatar(reply, contacts) {
    if (reply.authorType === 'user') return '👤';
    if (reply.authorType === 'char') {
        const c = contacts.find(ct => String(ct.id) === String(reply.authorId));
        if (c && c.avatarUrl) return `<img src="${esc(c.avatarUrl)}" alt="">`;
        return reply.authorName ? reply.authorName[0] : '?';
    }
    const npcs = getNpcs();
    const npc = npcs.find(n => n.name === reply.authorName);
    if (npc) {
        if (npc.avatarUrl) return `<img src="${esc(npc.avatarUrl)}" alt="">`;
        return npc.emoji;
    }
    return reply.authorName ? reply.authorName[0] : '?';
}

// ==================== 追更/书签系统 ====================
function toggleBookmark() {
    if (!currentPostId) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;
    post.bookmarked = !post.bookmarked;
    savePosts(posts);
    const bmBtn = document.getElementById('bookmarkBtn');
    if (bmBtn) bmBtn.className = `forum-btn-icon${post.bookmarked ? ' active' : ''}`;
    renderPosts();
}

function toggleBookmarkFromList(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    post.bookmarked = !post.bookmarked;
    savePosts(posts);
    renderPosts();
}

// ==================== 头像库管理 ====================
function openAvatarManager() {
    const pool = getS('forum_avatar_pool', []);
    document.getElementById('avatarUrlBatch').value = '';
    document.getElementById('avatarCount').textContent = pool.length;
    renderAvatarPool();
    showModal('avatarManager');
}
function closeAvatarManager() { hideModal('avatarManager'); }

function batchAddAvatars() {
    const text = document.getElementById('avatarUrlBatch').value.trim();
    if (!text) return;
    const urls = text.split('\n').map(u => u.trim()).filter(u => u && (u.startsWith('http://') || u.startsWith('https://')));
    if (!urls.length) { alert('未找到有效URL'); return; }
    const pool = getS('forum_avatar_pool', []);
    const existing = new Set(pool);
    let added = 0;
    urls.forEach(u => { if (!existing.has(u)) { pool.push(u); existing.add(u); added++; } });
    setS('forum_avatar_pool', pool);
    document.getElementById('avatarUrlBatch').value = '';
    document.getElementById('avatarCount').textContent = pool.length;
    renderAvatarPool();
    alert(`已添加 ${added} 个头像`);
}

function renderAvatarPool() {
    const pool = getS('forum_avatar_pool', []);
    const container = document.getElementById('avatarPoolPreview');
    container.innerHTML = pool.map((url, i) =>
        `<div class="avatar-pool-item" onclick="removeAvatar(${i})" title="点击删除"><img src="${esc(url)}" alt=""></div>`
    ).join('') || '<p style="font-size:13px;color:var(--forum-text-sub);">头像库为空</p>';
}

function removeAvatar(index) {
    const pool = getS('forum_avatar_pool', []);
    pool.splice(index, 1);
    setS('forum_avatar_pool', pool);
    document.getElementById('avatarCount').textContent = pool.length;
    renderAvatarPool();
}

function clearAvatarPool() {
    if (!confirm('确认清空所有头像？')) return;
    setS('forum_avatar_pool', []);
    document.getElementById('avatarCount').textContent = '0';
    renderAvatarPool();
}

// ==================== 帖子内回复刷新 ====================
async function refreshReplies() {
    if (!currentPostId || isRefreshingReplies) return;
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey) { alert('请先配置API方案'); return; }

    isRefreshingReplies = true;
    const btn = document.getElementById('refreshRepliesBtn');
    btn.classList.add('spinning');
    btn.style.pointerEvents = 'none';

    try {
        const posts = getPosts();
        const post = posts.find(p => p.id === currentPostId);
        if (!post) throw new Error('帖子不存在');

        const world = getActiveWorld();
        const contacts = getS('vibe_contacts', []);
        const existingNpcs = getNpcs();
        const contextWindow = post.contextWindow || 10;

        // 构建上下文：首楼（必须） + 总结 + 最近N条回复
        const allReplies = post.replies || [];
        const recentReplies = allReplies.slice(-contextWindow);
        let contextStr = `【首楼/原帖】\n标题：${post.title}\n作者：${post.authorName}\n内容：${post.content}\n`;
        if (post.attachments && post.attachments.length) {
            contextStr += '附件：' + post.attachments.map(a => `[${a.type}: ${a.desc || a.url}]`).join('、') + '\n';
        }
        contextStr += '\n';
        if (post.summary) contextStr += `【帖子长期记忆/总结】${post.summary}\n\n`;
        if (recentReplies.length) {
            contextStr += '【最近回复】\n' + recentReplies.map(r => {
                let line = `${r.authorName}: ${r.content}`;
                if (r.attachments && r.attachments.length) {
                    line += r.attachments.map(a => ` [附件:${a.type}-${a.desc || a.url}]`).join('');
                }
                return line;
            }).join('\n');
        }

        // CHAR信息（含结构化记忆摘要）
        const charInfos = contacts.slice(0, 5).map(c => {
            const name = c.nickname || c.name || 'CHAR';
            const persona = c.personality ? c.personality.slice(0, 80) : '';
            let memoryHint = '';
            if (c.structuredMemory && c.structuredMemory.entries && c.structuredMemory.entries.length) {
                const keyFacts = c.structuredMemory.entries
                    .filter(e => e.category === 'F' || e.category === 'R' || e.category === 'E')
                    .slice(-5)
                    .map(e => e.text)
                    .join('；');
                if (keyFacts) memoryHint = `，记忆：${keyFacts}`;
            }
            return `${name}${persona ? '（' + persona + '）' : ''}${memoryHint}`;
        });

        // NPC信息（随机抽样，避免总是同一批人）
        const sampledNpcs = sampleNpcs(existingNpcs, 5);
        const npcInfos = sampledNpcs.map(n => {
            const tags = n.personality ? `（${n.personality}）` : '';
            return `${n.name}${tags}`;
        });

        // 构建时间上下文和发帖记忆
        const followedNpcs = existingNpcs.filter(n => n.followed);
        const timeContextBlock = buildTimeContextPrompt(sampledNpcs);
        const replyPostMemoryBlock = buildPostMemoryPrompt(contacts.slice(0, 5), followedNpcs);

        const sysPrompt = `你是一个论坛回复生成器。为以下帖子生成新回复。
世界观：${world.desc || world.name}
${timeContextBlock}
帖子标题：${post.title}
帖子内容：${post.content}
帖子作者：${post.authorName}

${contextStr}
${replyPostMemoryBlock}
可用角色：
- CHAR：${charInfos.length ? charInfos.join('、') : '无'}
- 路人：${npcInfos.length ? '可以偶尔复用：' + npcInfos.join('、') + '，但也请创建新路人参与讨论' : '可以创建新路人'}

规则：
1. 生成5-10条新回复
2. 回复者混合CHAR和路人，也可以创建新路人
3. 新路人的网名要像真实互联网用户，风格多样（谐音梗、缩写、自嘲、抽象等），不要模板化
4. 每个新路人要有personality字段
5. 回复要自然，有互动感，可以回复之前的内容，可以跑题，可以吵架，可以玩梗
6. 每个人的说话风格要符合自己的性格
7. 部分回复可以带附件（图片/视频/音频），用attachments字段表示，每个附件有type（image/video/audio）、url（虚构的链接）、desc（文字描述内容）
8. 只输出JSON

JSON格式：
[{"authorType":"char或npc","authorName":"名字","personality":"性格（仅新路人）","content":"回复内容","attachments":[{"type":"image","url":"https://...","desc":"图片的文字描述"}]}]`;

        const resp = await callLLM(apiUrl, apiKey, model, '请生成帖子回复', 0.85, sysPrompt);

        let generated;
        try {
            const jsonMatch = resp.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('未找到JSON');
            generated = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error('回复生成解析失败:', e, resp);
            throw new Error('回复解析失败');
        }

        if (!Array.isArray(generated) || !generated.length) throw new Error('生成回复为空');

        const now = Date.now();
        const newReplies = generated.map((r, ri) => {
            let rType = r.authorType || 'npc', rName = r.authorName || '路人';
            let rId = null;
            if (rType === 'char') {
                const c = contacts.find(ct => (ct.nickname || ct.name) === rName);
                if (c) { rId = c.id; } else { rType = 'npc'; }
            }
            if (rType === 'npc') getOrCreateNpc(rName, r.personality);
            const reply = {
                id: `r_${now}_${ri}`,
                authorType: rType, authorId: rId, authorName: rName,
                content: r.content || '', createdAt: now + ri * 15000
            };
            if (r.attachments && Array.isArray(r.attachments) && r.attachments.length) {
                reply.attachments = r.attachments.map(a => ({
                    type: a.type || 'image', url: a.url || '', desc: a.desc || ''
                }));
            }
            return reply;
        });

        if (!post.replies) post.replies = [];
        const prevCount = post.replies.length;
        post.replies.push(...newReplies);
        savePosts(posts);

        // 自动生成发帖记忆
        scanAndSaveReplyMemory(post.title, newReplies);

        // 自动总结触发检查
        const trigger = post.autoSumTrigger || 0;
        if (trigger > 0) {
            const newTotal = post.replies.length;
            const lastSumAt = post._lastSumAt || 0;
            if (newTotal - lastSumAt >= trigger) {
                // 异步触发自动总结
                triggerAutoSummarize(post, posts);
            }
        }

        openPostDetail(currentPostId);
        renderPosts();
        console.log(`✅ 回复刷新成功: 新增${newReplies.length}条回复`);

    } catch (e) {
        console.error('回复刷新失败:', e);
        alert('回复刷新失败: ' + e.message);
    } finally {
        isRefreshingReplies = false;
        btn.classList.remove('spinning');
        btn.style.pointerEvents = '';
    }
}

// ==================== 总结/记忆设置 ====================
function openSummarySettings() {
    if (!currentPostId) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;
    document.getElementById('postSummaryText').value = post.summary || '';
    document.getElementById('contextWindowSize').value = post.contextWindow || 10;
    document.getElementById('autoSumTrigger').value = post.autoSumTrigger || 0;
    document.getElementById('customSumPrompt').value = post.customSumPrompt || '';
    showModal('summarySettings');
}
function closeSummarySettings() { hideModal('summarySettings'); }

function saveAllMemorySettings() {
    if (!currentPostId) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;
    post.summary = document.getElementById('postSummaryText').value.trim();
    post.contextWindow = parseInt(document.getElementById('contextWindowSize').value) || 10;
    post.autoSumTrigger = parseInt(document.getElementById('autoSumTrigger').value) || 0;
    post.customSumPrompt = document.getElementById('customSumPrompt').value.trim();
    savePosts(posts);
    openPostDetail(currentPostId);
    closeSummarySettings();
}

function saveSummary() {
    if (!currentPostId) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;
    post.summary = document.getElementById('postSummaryText').value.trim();
    savePosts(posts);
    openPostDetail(currentPostId);
    closeSummarySettings();
}

function saveContextWindow() {
    if (!currentPostId) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;
    post.contextWindow = parseInt(document.getElementById('contextWindowSize').value) || 10;
    savePosts(posts);
    alert('上下文窗口已保存');
}

async function autoSummarize() {
    if (!currentPostId) return;
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey) { alert('请先配置API方案'); return; }

    const posts = getPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;

    const replies = post.replies || [];
    if (replies.length < 3) { alert('回复太少，无需总结'); return; }

    const btn = document.getElementById('autoSumBtn');
    btn.classList.add('spinning');
    btn.textContent = '总结中...';

    try {
        const replyText = replies.map(r => {
            let line = `${r.authorName}: ${r.content}`;
            if (r.attachments && r.attachments.length) {
                line += r.attachments.map(a => ` [附件:${a.type}-${a.desc || a.url}]`).join('');
            }
            return line;
        }).join('\n');

        // 使用自定义提示词或默认
        const customPrompt = post.customSumPrompt || '';
        const defaultSysPrompt = `你是一个帖子总结助手。请将以下论坛帖子和回复总结为简洁的长期记忆，保留关键信息、人物关系、重要事件和讨论走向。总结控制在200字以内。只输出总结文本，不要其他内容。`;
        const sysPrompt = customPrompt
            ? `你是一个帖子总结助手。用户的总结要求：${customPrompt}\n\n请根据以上要求总结帖子内容。总结控制在200字以内。只输出总结文本。`
            : defaultSysPrompt;

        let postAttachInfo = '';
        if (post.attachments && post.attachments.length) {
            postAttachInfo = '\n帖子附件：' + post.attachments.map(a => `[${a.type}: ${a.desc || a.url}]`).join('、');
        }
        const prompt = `帖子标题：${post.title}\n帖子内容：${post.content}${postAttachInfo}\n\n回复内容：\n${replyText}`;

        const summary = await callLLM(apiUrl, apiKey, model, prompt, 0.3, sysPrompt);
        document.getElementById('postSummaryText').value = summary;
        post.summary = summary;
        savePosts(posts);
        openPostDetail(currentPostId);
    } catch (e) {
        console.error('自动总结失败:', e);
        alert('总结失败: ' + e.message);
    } finally {
        btn.classList.remove('spinning');
        btn.textContent = '🤖 自动总结';
    }
}

// ==================== 附件系统 ====================
const ATTACH_ICONS = { image: '🖼️', video: '🎬', audio: '🎵' };

function renderAttachments(attachments) {
    if (!attachments || !attachments.length) return '';
    return '<div style="margin-top:6px;">' + attachments.map((a, i) => {
        const icon = ATTACH_ICONS[a.type] || '📎';
        const label = a.type === 'image' ? '图片' : a.type === 'video' ? '视频' : a.type === 'audio' ? '音频' : '文件';
        // 用 base64 编码 desc 避免转义问题
        const descB64 = btoa(unescape(encodeURIComponent(a.desc || '')));
        return `<span class="forum-attachment-tag" onclick="event.stopPropagation();viewAttachment('${esc(a.type)}','${esc(a.url)}','${descB64}')">${icon} ${label}</span>`;
    }).join(' ') + '</div>';
}

function viewAttachment(type, url, descB64) {
    const desc = decodeURIComponent(escape(atob(descB64)));
    const icon = ATTACH_ICONS[type] || '📎';
    const label = type === 'image' ? '图片' : type === 'video' ? '视频' : type === 'audio' ? '音频' : '文件';
    document.getElementById('attachViewerTitle').textContent = `${icon} ${label}详情`;

    let html = '<div class="forum-attach-viewer-body">';
    if (type === 'image' && url) {
        html += `<img class="attach-preview" src="${esc(url)}" alt="附件图片" onerror="this.style.display='none'">`;
    } else if (type === 'video' && url) {
        html += `<div style="padding:20px;text-align:center;background:#000;border-radius:8px;margin-bottom:12px;"><span style="font-size:48px;">🎬</span><br><a href="${esc(url)}" target="_blank" style="color:#4fc3f7;font-size:13px;word-break:break-all;">${esc(url)}</a></div>`;
    } else if (type === 'audio' && url) {
        html += `<div style="padding:20px;text-align:center;background:var(--forum-tag-bg);border-radius:8px;margin-bottom:12px;"><span style="font-size:48px;">🎵</span><br><a href="${esc(url)}" target="_blank" style="color:var(--forum-accent);font-size:13px;word-break:break-all;">${esc(url)}</a></div>`;
    }
    if (desc) {
        html += `<div class="attach-desc">${esc(desc)}</div>`;
    } else {
        html += `<div class="attach-desc" style="text-align:center;color:var(--forum-text-sub);">无文字描述</div>`;
    }
    html += '</div>';

    document.getElementById('attachViewerContent').innerHTML = html;
    showModal('attachViewer');
}

function closeAttachViewer() { hideModal('attachViewer'); }

function toggleReplyAttach() {
    const panel = document.getElementById('replyAttachPanel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

// 发帖附件编辑
function addNewPostAttachment() {
    const container = document.getElementById('newPostAttachments');
    const row = document.createElement('div');
    row.className = 'forum-attach-edit-row';
    row.innerHTML = `
        <select class="forum-select attach-type"><option value="image">🖼️</option><option value="video">🎬</option><option value="audio">🎵</option></select>
        <input type="text" class="forum-input attach-url" placeholder="URL">
        <input type="text" class="forum-input attach-desc" placeholder="文字描述">
        <button class="forum-attach-remove" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(row);
}

// ==================== 自动总结触发 ====================
async function triggerAutoSummarize(post, posts) {
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey) return;

    try {
        const replies = post.replies || [];
        const replyText = replies.map(r => {
            let line = `${r.authorName}: ${r.content}`;
            if (r.attachments && r.attachments.length) {
                line += r.attachments.map(a => ` [附件:${a.type}-${a.desc || a.url}]`).join('');
            }
            return line;
        }).join('\n');

        const customPrompt = post.customSumPrompt || '';
        const defaultSysPrompt = `你是一个帖子总结助手。请将以下论坛帖子和回复总结为简洁的长期记忆，保留关键信息、人物关系、重要事件和讨论走向。总结控制在200字以内。只输出总结文本。`;
        const sysPrompt = customPrompt
            ? `你是一个帖子总结助手。用户的总结要求：${customPrompt}\n\n请根据以上要求总结。总结控制在200字以内。只输出总结文本。`
            : defaultSysPrompt;

        let postAttachInfo = '';
        if (post.attachments && post.attachments.length) {
            postAttachInfo = '\n帖子附件：' + post.attachments.map(a => `[${a.type}: ${a.desc || a.url}]`).join('、');
        }
        const prompt = `帖子标题：${post.title}\n帖子内容：${post.content}${postAttachInfo}\n\n回复内容：\n${replyText}`;

        const summary = await callLLM(apiUrl, apiKey, model, prompt, 0.3, sysPrompt);
        post.summary = summary;
        post._lastSumAt = post.replies.length;
        savePosts(posts);
        if (currentPostId === post.id) openPostDetail(post.id);
        console.log('✅ 自动总结完成');
    } catch (e) {
        console.error('自动总结失败:', e);
    }
}
