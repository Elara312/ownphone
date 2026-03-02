// ==================== CHAR的世界微博 ====================
// couple_twitter_worlds: [{id, name, charId, charName, charAvatar, charPersonality, userAccount, createdAt, pairDate}]
// couple_twitter_active_world: worldId
// couple_twitter_{wid}_posts, _trending, _npcs, _fan_messages, _dms, _cp_posts, _fan_tiers, _couple_profile, _ads, _controversies, _char_stats

function getS(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } }
function setS(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

const NPC_EMOJIS = ['🧑','👩','👨','🧔','👱','🧑‍🦰','👩‍🦳','🧑‍🦱','👴','👵','🧒','👦','👧','🤓','😎','🥸','🤠','👻','🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐧','🦉','🐝'];
const NPC_MAX = 50;
const POST_MAX = 200;
const FAN_MSG_MAX = 200;
const DM_MAX = 50;
const CP_POST_MAX = 300;
const NEWS_CATS = [
  { id: 'military', label: '军事', emoji: '🎖️' },
  { id: 'tech', label: '科技', emoji: '🔬' },
  { id: 'entertainment', label: '娱乐', emoji: '🎬' },
  { id: 'economy', label: '经济', emoji: '📈' },
  { id: 'politics', label: '政治', emoji: '🏛️' },
  { id: 'culture', label: '人文', emoji: '📚' }
];
const AD_TYPES = ['美妆','数码','食品','游戏','服饰','家居'];
const MILESTONES = [7, 30, 100, 200, 365, 500, 1000];

let currentTab = 'feed';
let currentTopicFilter = 'all';
let pendingNewPostTopic = null;
let currentDmNpcId = null;
let setupCharId = null;
let isRefreshing = false;
let liveActive = false;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  // 加载并应用自定义CSS方案
  loadCssSchemes();
  if (wbActiveCssId !== 'default') applyCssScheme(wbActiveCssId);

  const worlds = getWorlds();
  if (worlds.length === 0) {
    showCharSelector();
  } else {
    enterWorld();
  }
}

function getWorlds() { return getS('couple_twitter_worlds', []); }
function getActiveWorldId() { return getS('couple_twitter_active_world', null); }
function getActiveWorld() {
  const worlds = getWorlds();
  const aid = getActiveWorldId();
  return worlds.find(w => w.id === aid) || worlds[0];
}
function wKey(suffix) {
  const w = getActiveWorld();
  return w ? `couple_twitter_${w.id}_${suffix}` : `couple_twitter_none_${suffix}`;
}

// ==================== CHAR选择 ====================
function showCharSelector() {
  hideAllViews();
  document.getElementById('worldBar').style.display = 'none';
  document.getElementById('tabBar').style.display = 'none';
  document.getElementById('charSelector').style.display = 'block';
  const contacts = getS('vibe_contacts', []);
  const list = document.getElementById('charList');
  if (contacts.length === 0) {
    list.innerHTML = '<div class="empty-state">还没有CHAR，请先在消息应用中添加联系人</div>';
    return;
  }
  // 用索引来避免id类型问题
  window._charSelectList = contacts;
  list.innerHTML = contacts.map((c, idx) => `
    <div class="char-item" onclick="selectCharByIndex(${idx})">
      <div class="avatar">${c.avatar || '😊'}</div>
      <div class="info">
        <div class="name">${esc(c.name)}</div>
        <div class="desc">${esc((c.personality || '').substring(0, 40))}${(c.personality||'').length > 40 ? '...' : ''}</div>
      </div>
    </div>
  `).join('');
}

function selectCharByIndex(idx) {
  const contacts = window._charSelectList || getS('vibe_contacts', []);
  const c = contacts[idx];
  if (!c) { toast('找不到该CHAR'); return; }
  setupCharId = String(c.id != null ? c.id : c.name);
  hideAllViews();
  document.getElementById('userSetup').style.display = 'block';
  document.getElementById('setupSubtitle').textContent = `在${c.name}的世界里，你是谁？`;
}

function confirmUserSetup() {
  const nickname = document.getElementById('setupNickname').value.trim();
  const emoji = document.getElementById('setupEmoji').value.trim() || '🌸';
  const bio = document.getElementById('setupBio').value.trim();
  if (!nickname) { toast('请输入昵称'); return; }
  createWorld(setupCharId, { nickname, avatarEmoji: emoji, bio });
}

function createWorld(charId, userAccount) {
  const contacts = getS('vibe_contacts', []);
  // 宽松匹配：id可能是数字或字符串
  const c = contacts.find(x => String(x.id) === String(charId) || x.name === charId);
  if (!c) { toast('找不到该CHAR'); return; }
  const wid = 'w_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const world = {
    id: wid, name: `${c.name}的世界`, charId: String(c.id != null ? c.id : c.name),
    charName: c.name, charAvatar: c.avatar || '😊',
    charPersonality: c.personality || '', userAccount,
    createdAt: Date.now(), pairDate: Date.now()
  };
  const worlds = getWorlds();
  worlds.push(world);
  setS('couple_twitter_worlds', worlds);
  setS('couple_twitter_active_world', wid);
  // 初始化数据
  setS(`couple_twitter_${wid}_posts`, []);
  setS(`couple_twitter_${wid}_trending`, []);
  setS(`couple_twitter_${wid}_npcs`, []);
  setS(`couple_twitter_${wid}_fan_messages`, []);
  setS(`couple_twitter_${wid}_dms`, []);
  setS(`couple_twitter_${wid}_cp_posts`, []);
  setS(`couple_twitter_${wid}_fan_tiers`, { totalFollowers: 50, loyal: 15, casual: 30, anti: 5 });
  setS(`couple_twitter_${wid}_couple_profile`, { signature: '', pairDate: Date.now(), milestones: [] });
  setS(`couple_twitter_${wid}_ads`, []);
  setS(`couple_twitter_${wid}_controversies`, []);
  setS(`couple_twitter_${wid}_char_stats`, { postCount: 0, followerCount: 50 });
  enterWorld();
}

// ==================== 进入世界 / 世界观切换 ====================
function enterWorld() {
  const world = getActiveWorld();
  if (!world) { showCharSelector(); return; }
  setS('couple_twitter_active_world', world.id);
  hideAllViews();
  document.getElementById('worldBar').style.display = 'flex';
  document.getElementById('tabBar').style.display = 'flex';
  renderWorldBar();
  switchTab('feed');
}

function switchWorld(wid) {
  setS('couple_twitter_active_world', wid);
  renderWorldBar();
  switchTab(currentTab);
}

function renderWorldBar() {
  const worlds = getWorlds();
  const aid = getActiveWorldId();
  const bar = document.getElementById('worldBar');
  bar.innerHTML = `<button class="world-back" onclick="window.location.href='index.html'">‹</button>` +
    worlds.map(w => {
      const active = w.id === aid ? 'active' : '';
      return `<button class="world-chip ${active}" onclick="switchWorld('${w.id}')"><span class="dot" style="background:${w.id === aid ? '#e5e5e5' : '#555'}"></span>${esc(w.charName)}</button>`;
    }).join('') + `<button class="world-add" onclick="showCharSelector()">+</button>`;
}

// ==================== Tab切换 ====================
function switchTab(tab) {
  currentTab = tab;
  hideAllViews();
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const viewMap = { feed: 'feedView', trending: 'trendingView', cp: 'cpView', dm: 'dmView', profile: 'profileView' };
  const view = document.getElementById(viewMap[tab]);
  if (view) view.style.display = 'block';
  if (tab === 'feed') renderFeed();
  else if (tab === 'trending') renderTrendingList();
  else if (tab === 'cp') renderCpSuperTopic();
  else if (tab === 'dm') renderDmInbox();
  else if (tab === 'profile') renderProfile();
}

function hideAllViews() {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
}

// ==================== 数据读写辅助 ====================
function getPosts() { return getS(wKey('posts'), []); }
function savePosts(p) { setS(wKey('posts'), p); }
function getTrending() { return getS(wKey('trending'), []); }
function saveTrending(t) { setS(wKey('trending'), t); }
function getNpcs() { return getS(wKey('npcs'), []); }
function saveNpcs(n) { setS(wKey('npcs'), n); }
function getFanMessages() { return getS(wKey('fan_messages'), []); }
function saveFanMessages(m) { setS(wKey('fan_messages'), m); }
function getDmList() { return getS(wKey('dms'), []); }
function saveDmList(d) { setS(wKey('dms'), d); }
function getCpPosts() { return getS(wKey('cp_posts'), []); }
function saveCpPosts(p) { setS(wKey('cp_posts'), p); }
function getFanTiers() { return getS(wKey('fan_tiers'), { totalFollowers: 50, loyal: 15, casual: 30, anti: 5 }); }
function saveFanTiers(t) { setS(wKey('fan_tiers'), t); }
function getCoupleProfile() { return getS(wKey('couple_profile'), { signature: '', pairDate: Date.now(), milestones: [] }); }
function saveCoupleProfile(p) { setS(wKey('couple_profile'), p); }
function getCharStats() { return getS(wKey('char_stats'), { postCount: 0, followerCount: 50 }); }
function saveCharStats(s) { setS(wKey('char_stats'), s); }

// 判断某个key记录的日期是否是今天
function isDoneToday(key) {
  const last = getS(key, null);
  if (!last) return false;
  const today = new Date().toDateString();
  return new Date(last).toDateString() === today;
}
function markDoneToday(key) { setS(key, Date.now()); }

// ==================== 富媒体标签渲染 ====================
function formatMediaTags(text) {
  if (!text) return '';
  return esc(text)
    .replace(/\[图片[:：]([^\]]+)\]/g, '<span class="media-tag media-img" title="$1">🖼️ $1</span>')
    .replace(/\[视频[:：]([^\]]+)\]/g, '<span class="media-tag media-vid" title="$1">🎬 $1</span>')
    .replace(/\[音乐[:：]([^\]]+)\]/g, '<span class="media-tag media-aud" title="$1">🎵 $1</span>')
    .replace(/\[位置[:：]([^\]]+)\]/g, '<span class="media-tag media-loc" title="$1">📍 $1</span>')
    .replace(/@(\S+)/g, '<span class="mention">@$1</span>');
}

// ==================== 收藏功能 ====================
function getBookmarks() { return getS(wKey('bookmarks'), []); }
function saveBookmarks(b) { setS(wKey('bookmarks'), b); }

function toggleBookmark(postId) {
  let bm = getBookmarks();
  const idx = bm.indexOf(postId);
  if (idx >= 0) { bm.splice(idx, 1); toast('已取消收藏'); }
  else { bm.unshift(postId); toast('已收藏'); }
  saveBookmarks(bm);
  // 刷新当前视图
  if (currentTab === 'feed') renderFeed();
  else if (currentTab === 'cp') renderCpSuperTopic();
}

function openBookmarks() {
  const bm = getBookmarks();
  const posts = getPosts();
  const cpPosts = getCpPosts();
  const allPosts = [...posts, ...cpPosts];
  const saved = bm.map(id => allPosts.find(p => p.id === id)).filter(Boolean);
  document.getElementById('bookmarkList').innerHTML = saved.length === 0
    ? '<div class="empty-state">还没有收藏~<br>点帖子上的⭐收藏喜欢的内容</div>'
    : saved.map(p => renderPostItem(p)).join('');
  showModal('bookmarks');
}

// ==================== 信息流渲染 ====================
function renderFeed() {
  const world = getActiveWorld();
  if (!world) return;
  document.getElementById('feedTitle').textContent = world.name;
  const posts = getPosts();
  const list = document.getElementById('feedList');
  if (posts.length === 0) {
    list.innerHTML = '<div class="empty-state">世界还很安静...<br>点击 🔄 刷新来推动世界运转</div>';
    return;
  }
  list.innerHTML = posts.slice().sort((a, b) => b.createdAt - a.createdAt).map(p => renderPostItem(p)).join('');
}

function renderPostItem(p) {
  const isChar = p.authorType === 'char';
  const isUser = p.authorType === 'user';
  const tagClass = isChar ? 'char' : isUser ? 'me' : p.authorIdentity === '媒体' ? 'media' : p.authorIdentity === '网红' ? 'influencer' : p.authorIdentity === '粉丝' ? 'fan' : p.authorIdentity === '杠精' ? 'troll' : '';
  const avatarHtml = p.authorAvatarUrl
    ? `<img src="${esc(p.authorAvatarUrl)}" alt="" loading="lazy">`
    : esc(p.authorAvatar || '🧑');
  const topicHtml = p.topicTitle ? `<div class="post-topic">${esc(p.topicTitle)}</div>` : '';
  const contentHtml = formatMediaTags(p.content || '');
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.includes(p.id);
  return `<div class="post-item ${isChar ? 'char-post' : ''}" onclick="openPostDetail('${p.id}')">
    <div class="post-header">
      <div class="post-avatar" onclick="event.stopPropagation();openAuthorProfile('${p.authorType}','${esc(p.authorId || '')}')">${avatarHtml}</div>
      <div class="post-meta">
        <div class="post-author">${esc(p.authorName)}<span class="post-tag ${tagClass}">${esc(p.authorIdentity || p.authorType)}</span></div>
        <div class="post-time">${timeAgo(p.createdAt)}</div>
      </div>
    </div>
    ${topicHtml}
    <div class="post-body">${contentHtml}</div>
    <div class="post-actions">
      <button class="post-action ${p.userLiked ? 'liked' : ''}" onclick="event.stopPropagation();toggleLike('${p.id}')">
        ${p.userLiked ? '❤️' : '🤍'} ${p.likes || 0}
      </button>
      <button class="post-action" onclick="event.stopPropagation();openPostDetail('${p.id}')">
        💬 ${(p.comments || []).length}
      </button>
      <button class="post-action" onclick="event.stopPropagation();toggleBookmark('${p.id}')">${isBookmarked ? '⭐' : '☆'}</button>
      ${(p.authorType === 'npc' || p.authorType === 'media' || (p.authorType === 'char' && !isChar)) ? `<button class="post-action" onclick="event.stopPropagation();shareToChat('${p.id}')">📤</button>` : ''}
      <button class="post-action" onclick="event.stopPropagation();deletePost('${p.id}')">🗑️</button>
    </div>
  </div>`;
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
  return new Date(ts).toLocaleDateString('zh-CN');
}

// ==================== 帖子详情 ====================
function openPostDetail(postId) {
  const posts = getPosts();
  const p = posts.find(x => x.id === postId);
  if (!p) return;
  const world = getActiveWorld();
  const isUser = p.authorType === 'user';
  const avatarHtml = p.authorAvatarUrl ? `<img src="${esc(p.authorAvatarUrl)}" alt="">` : esc(p.authorAvatar || '🧑');
  const contentHtml = formatMediaTags(p.content || '');
  const topicHtml = p.topicTitle ? `<div class="post-topic">${esc(p.topicTitle)}</div>` : '';
  const canDelete = isUser || p.authorType === 'char';
  const deleteBtn = canDelete ? `<button class="post-action" onclick="deletePost('${p.id}')" style="color:#ff6b6b">🗑️ 删除</button>` : '';

  let html = `<div style="padding:16px">
    <div class="post-header">
      <div class="post-avatar">${avatarHtml}</div>
      <div class="post-meta">
        <div class="post-author">${esc(p.authorName)}<span class="post-tag">${esc(p.authorIdentity || '')}</span></div>
        <div class="post-time">${timeAgo(p.createdAt)}</div>
      </div>
    </div>
    ${topicHtml}
    <div class="post-body" style="font-size:16px;margin:12px 0">${contentHtml}</div>
    <div class="post-actions">
      <button class="post-action ${p.userLiked ? 'liked' : ''}" onclick="toggleLike('${p.id}');renderPostDetailInPlace('${p.id}')">
        ${p.userLiked ? '❤️' : '🤍'} ${p.likes || 0}
      </button>
      ${deleteBtn}
    </div>
  </div>
  <div style="padding:8px 16px;font-size:13px;color:#777;border-bottom:1px solid #1a1a1a">评论 (${(p.comments||[]).length})</div>
  <div class="comment-list">
    ${(p.comments || []).map(c => {
      const cAvatar = c.authorAvatarUrl ? `<img src="${esc(c.authorAvatarUrl)}" alt="">` : esc(c.authorAvatar || '🧑');
      return `<div class="comment-item">
        <div class="comment-avatar">${cAvatar}</div>
        <div class="comment-body">
          <div class="comment-author">${esc(c.authorName)}</div>
          <div class="comment-text">${esc(c.content)}</div>
          <div class="comment-time">${timeAgo(c.createdAt)}</div>
        </div>
      </div>`;
    }).join('')}
  </div>`;

  document.getElementById('postDetailContent').innerHTML = html +
    `<div class="comment-input-bar">
      <input type="text" id="commentInput" placeholder="写评论..." maxlength="200">
      <button onclick="submitComment('${p.id}')">发送</button>
    </div>`;
  showModal('postDetail');
}

function renderPostDetailInPlace(postId) {
  openPostDetail(postId);
}

// ==================== 用户互动 ====================
function openNewPost(topicId, topicTitle) {
  pendingNewPostTopic = topicId ? { id: topicId, title: topicTitle } : null;
  const topicEl = document.getElementById('newPostTopic');
  if (pendingNewPostTopic) {
    topicEl.innerHTML = `<span class="post-topic">${esc(topicTitle)}</span>`;
    topicEl.style.display = 'block';
  } else {
    topicEl.style.display = 'none';
  }
  document.getElementById('newPostContent').value = '';
  showModal('newPost');
}

function submitPost() {
  const content = document.getElementById('newPostContent').value.trim();
  if (!content) { toast('请输入内容'); return; }
  const world = getActiveWorld();
  const posts = getPosts();
  const post = {
    id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    authorType: 'user', authorId: 'user',
    authorName: world.userAccount.nickname,
    authorAvatar: world.userAccount.avatarEmoji,
    authorAvatarUrl: null,
    authorIdentity: '我',
    content, topicId: pendingNewPostTopic?.id || null,
    topicTitle: pendingNewPostTopic?.title || null,
    isCouplePost: false, likes: 0, userLiked: false,
    comments: [], createdAt: Date.now()
  };
  posts.unshift(post);
  savePosts(posts);
  pruneOldPosts();
  closeModal('newPost');
  renderFeed();
  toast('发布成功');
}

function toggleLike(postId) {
  const posts = getPosts();
  const p = posts.find(x => x.id === postId);
  if (!p) return;
  p.userLiked = !p.userLiked;
  p.likes = Math.max(0, (p.likes || 0) + (p.userLiked ? 1 : -1));
  savePosts(posts);
  renderFeed();
}

function submitComment(postId) {
  const input = document.getElementById('commentInput');
  const content = input.value.trim();
  if (!content) return;
  const world = getActiveWorld();
  const posts = getPosts();
  const p = posts.find(x => x.id === postId);
  if (!p) return;
  p.comments = p.comments || [];
  p.comments.push({
    id: 'c_' + Date.now(), authorType: 'user', authorId: 'user',
    authorName: world.userAccount.nickname, authorAvatar: world.userAccount.avatarEmoji,
    authorAvatarUrl: null, content, createdAt: Date.now()
  });
  savePosts(posts);
  openPostDetail(postId);
}

function deletePost(postId) {
  if (!confirm('确定删除这条帖子？')) return;
  let posts = getPosts();
  posts = posts.filter(p => p.id !== postId);
  savePosts(posts);
  closeModal('postDetail');
  renderFeed();
  toast('已删除');
}

function pruneOldPosts() {
  let posts = getPosts();
  if (posts.length > POST_MAX) {
    posts.sort((a, b) => b.createdAt - a.createdAt);
    posts = posts.slice(0, POST_MAX);
    savePosts(posts);
  }
}

// ==================== NPC系统 ====================
function getOrCreateNpc(name, personality, identityType, relationTag, fanTier) {
  let npcs = getNpcs();
  let npc = npcs.find(n => n.name === name);
  if (npc) {
    npc.lastActiveAt = Date.now();
    if (fanTier) npc.fanTier = fanTier;
    saveNpcs(npcs);
    return npc;
  }
  // 分配头像
  const avatarPool = getS('forum_avatar_pool', []);
  let avatarUrl = null, emoji = NPC_EMOJIS[Math.floor(Math.random() * NPC_EMOJIS.length)];
  if (avatarPool.length > 0) {
    const usedUrls = npcs.filter(n => n.avatarUrl).map(n => n.avatarUrl);
    const available = avatarPool.filter(u => !usedUrls.includes(u));
    if (available.length > 0) avatarUrl = available[Math.floor(Math.random() * available.length)];
    else avatarUrl = avatarPool[Math.floor(Math.random() * avatarPool.length)];
  }
  npc = {
    id: 'npc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name, emoji, avatarUrl, personality: personality || '',
    identityType: identityType || 'normal',
    relationTag: relationTag || '路人',
    fanTier: fanTier || 'casual',
    createdAt: Date.now(), lastActiveAt: Date.now()
  };
  npcs.push(npc);
  if (npcs.length > NPC_MAX) npcs = pruneNpcs(npcs);
  saveNpcs(npcs);
  return npc;
}

function pruneNpcs(npcs) {
  npcs.sort((a, b) => b.lastActiveAt - a.lastActiveAt);
  return npcs.slice(0, NPC_MAX);
}

function renderNpcCard(npcId) {
  const npcs = getNpcs();
  const npc = npcs.find(n => n.id === npcId);
  if (!npc) return;
  const avatarHtml = npc.avatarUrl ? `<img src="${esc(npc.avatarUrl)}" alt="">` : `<span style="font-size:40px">${esc(npc.emoji)}</span>`;
  document.getElementById('npcCardContent').innerHTML = `<div class="npc-card">
    <div class="avatar">${avatarHtml}</div>
    <div class="name">${esc(npc.name)}</div>
    <div class="identity">${esc(npc.relationTag)} · ${esc(npc.identityType)}</div>
    <div class="personality">${esc(npc.personality)}</div>
  </div>`;
  showModal('npcCard');
}

function openAuthorProfile(type, authorId) {
  if (type === 'char') renderCharProfile();
  else if (type === 'user') renderUserProfile();
  else {
    const npcs = getNpcs();
    const npc = npcs.find(n => n.id === authorId);
    if (npc) renderNpcCard(npc.id);
  }
}

function renderCharProfile() {
  const world = getActiveWorld();
  const stats = getCharStats();
  const tiers = getFanTiers();
  const posts = getPosts().filter(p => p.authorType === 'char');
  document.getElementById('profileModalTitle').textContent = world.charName;
  document.getElementById('profileModalContent').innerHTML = `
    <div class="profile-card">
      <div class="avatar">${esc(world.charAvatar)}</div>
      <div class="nickname">${esc(world.charName)}</div>
      <div class="bio" style="color:#58a6ff">CHAR</div>
      <div class="profile-stats">
        <div class="profile-stat"><div class="num">${tiers.totalFollowers}</div><div class="lbl">粉丝</div></div>
        <div class="profile-stat"><div class="num">${posts.length}</div><div class="lbl">帖子</div></div>
      </div>
    </div>
    <div class="feed-list">${posts.slice(0, 20).map(p => renderPostItem(p)).join('')}</div>`;
  showModal('profile');
}

function renderUserProfile() {
  const world = getActiveWorld();
  const posts = getPosts().filter(p => p.authorType === 'user');
  document.getElementById('profileModalTitle').textContent = world.userAccount.nickname;
  document.getElementById('profileModalContent').innerHTML = `
    <div class="profile-card">
      <div class="avatar">${esc(world.userAccount.avatarEmoji)}</div>
      <div class="nickname">${esc(world.userAccount.nickname)}</div>
      <div class="bio">${esc(world.userAccount.bio || '')}</div>
      <div class="profile-stats">
        <div class="profile-stat"><div class="num">${posts.length}</div><div class="lbl">帖子</div></div>
      </div>
    </div>
    <div class="feed-list">${posts.slice(0, 20).map(p => renderPostItem(p)).join('')}</div>`;
  showModal('profile');
}

// ==================== 热搜榜 ====================
function renderTrendingList() {
  const trending = getTrending();
  // 分类筛选栏
  const catsHtml = `<button class="cat-chip ${currentTopicFilter === 'all' ? 'active' : ''}" onclick="filterTrending('all')">全部</button>` +
    NEWS_CATS.map(c => `<button class="cat-chip ${currentTopicFilter === c.id ? 'active' : ''}" onclick="filterTrending('${c.id}')">${c.emoji} ${c.label}</button>`).join('');
  document.getElementById('trendingCategories').innerHTML = catsHtml;

  const filtered = currentTopicFilter === 'all' ? trending : trending.filter(t => t.category === currentTopicFilter);
  const list = document.getElementById('trendingList');
  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">暂无热搜<br>刷新世界来生成热搜话题</div>';
    return;
  }
  list.innerHTML = filtered.sort((a, b) => b.heat - a.heat).map((t, i) => `
    <div class="trending-item" onclick="openTopicPosts('${t.id}','${esc(t.title)}')">
      <div class="trending-rank ${i < 3 ? 'top3' : ''}">${i + 1}</div>
      <div class="trending-info">
        <div class="trending-title">${esc(t.title)}</div>
        <div class="trending-meta">
          <span class="trending-cat-tag">${esc(t.categoryLabel || t.category)}</span>
          <span class="trending-heat">${t.heat > 10000 ? (t.heat / 10000).toFixed(1) + '万' : t.heat} 热度</span>
          ${t.isNew ? '<span class="trending-new">新</span>' : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function filterTrending(cat) {
  currentTopicFilter = cat;
  renderTrendingList();
}

function openTopicPosts(topicId, topicTitle) {
  const trending = getTrending();
  const topic = trending.find(t => t.id === topicId);
  const posts = getPosts().filter(p => p.topicId === topicId);
  document.getElementById('topicPostsTitle').textContent = topicTitle;

  let html = '';
  // 热搜来源帖子
  if (topic && topic.sourcePost) {
    html += `<div class="post-item source-post">
      <div class="post-header">
        <div class="post-avatar">📰</div>
        <div class="post-meta">
          <div class="post-author">${esc(topic.sourcePost.authorName)}<span class="post-tag media">来源</span></div>
          <div class="post-time">${timeAgo(topic.createdAt)}</div>
        </div>
      </div>
      <div class="post-body">${formatMediaTags(topic.sourcePost.content)}</div>
    </div>`;
    // 吃瓜评论
    if (topic.comments && topic.comments.length > 0) {
      html += `<div class="topic-comments-section"><div class="section-label">🍉 吃瓜评论</div>`;
      topic.comments.forEach(c => {
        html += `<div class="topic-comment">
          <span class="topic-comment-name">${esc(c.authorName)}</span>
          <span class="topic-comment-text">${esc(c.content)}</span>
        </div>`;
      });
      html += `</div>`;
    }
  }
  // 相关帖子
  if (posts.length > 0) {
    html += `<div class="section-label" style="padding:12px 16px 4px;font-size:12px;color:#888">相关帖子</div>`;
    html += posts.map(p => renderPostItem(p)).join('');
  }
  if (!html) html = '<div class="empty-state">暂无相关内容</div>';
  html += `<div style="padding:16px;text-align:center">
    <button class="btn-primary" style="width:auto;padding:10px 24px;font-size:13px" onclick="closeModal('topicPosts');openNewPost('${topicId}','${esc(topicTitle)}')">参与讨论</button>
  </div>`;
  document.getElementById('topicPostsList').innerHTML = html;
  showModal('topicPosts');
}

function decayTrending() {
  let trending = getTrending();
  trending = trending.map(t => ({ ...t, heat: Math.floor(t.heat * 0.7), isNew: false }));
  trending = trending.filter(t => t.heat > 100);
  saveTrending(trending);
}

// ==================== CP超话 ====================
function renderCpSuperTopic() {
  const world = getActiveWorld();
  const profile = getCoupleProfile();
  const daysTogether = Math.floor((Date.now() - (profile.pairDate || world.pairDate || world.createdAt)) / 86400000);
  // 里程碑
  document.getElementById('cpMilestone').innerHTML = `
    <div class="days">${daysTogether}</div>
    <div class="label">天</div>
    <div class="couple-names">${esc(world.userAccount.avatarEmoji)} ${esc(world.userAccount.nickname)} ❤️ ${esc(world.charAvatar)} ${esc(world.charName)}</div>
    ${profile.signature ? `<div style="font-size:12px;color:#999;margin-top:6px">${esc(profile.signature)}</div>` : ''}
  `;
  const cpPosts = getCpPosts();
  const feedEl = document.getElementById('cpFeedList');
  if (cpPosts.length === 0) {
    feedEl.innerHTML = '<div class="empty-state">CP超话还没有内容~<br>刷新世界或发帖来开始</div>';
    return;
  }
  feedEl.innerHTML = cpPosts.slice().sort((a, b) => b.createdAt - a.createdAt).map(p => renderPostItem(p)).join('');
}

function openCpNewPost() {
  pendingNewPostTopic = null;
  document.getElementById('newPostContent').value = '';
  document.getElementById('newPostTopic').style.display = 'none';
  // 标记为CP帖子
  showModal('newPost');
  // 覆盖提交按钮
  document.querySelector('#newPostModal .btn-post').onclick = submitCpPost;
}

function submitCpPost() {
  const content = document.getElementById('newPostContent').value.trim();
  if (!content) { toast('请输入内容'); return; }
  const world = getActiveWorld();
  const post = {
    id: 'cp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    authorType: 'user', authorId: 'user',
    authorName: world.userAccount.nickname,
    authorAvatar: world.userAccount.avatarEmoji,
    authorAvatarUrl: null, authorIdentity: '正主',
    content, topicId: null, topicTitle: null,
    isCouplePost: true, likes: 0, userLiked: false,
    comments: [], createdAt: Date.now()
  };
  const cpPosts = getCpPosts();
  cpPosts.unshift(post);
  saveCpPosts(cpPosts);
  // 也加到主信息流
  const posts = getPosts();
  posts.unshift(post);
  savePosts(posts);
  pruneCpPosts();
  closeModal('newPost');
  // 恢复发帖按钮
  document.querySelector('#newPostModal .btn-post').onclick = submitPost;
  renderCpSuperTopic();
  toast('发布成功');
}

function pruneCpPosts() {
  let cpPosts = getCpPosts();
  if (cpPosts.length > CP_POST_MAX) {
    // 正主帖子优先保留
    const main = cpPosts.filter(p => p.authorType === 'user' || p.authorType === 'char');
    const npc = cpPosts.filter(p => p.authorType !== 'user' && p.authorType !== 'char');
    npc.sort((a, b) => b.createdAt - a.createdAt);
    const keep = main.concat(npc).slice(0, CP_POST_MAX);
    saveCpPosts(keep);
  }
}

// ==================== 私信 ====================
function renderDmInbox() {
  const dms = getDmList();
  const inbox = document.getElementById('dmInbox');
  if (dms.length === 0) {
    inbox.innerHTML = '<div class="empty-state">暂无私信<br>刷新世界后可能会收到粉丝私信</div>';
    return;
  }
  inbox.innerHTML = dms.sort((a, b) => b.lastMessageAt - a.lastMessageAt).map(dm => {
    const avatarHtml = dm.npcAvatarUrl ? `<img src="${esc(dm.npcAvatarUrl)}" alt="">` : esc(dm.npcAvatar || '🧑');
    const lastMsg = dm.messages && dm.messages.length > 0 ? dm.messages[dm.messages.length - 1].content : '';
    return `<div class="dm-item" onclick="openDmChat('${dm.id}')">
      <div class="dm-avatar">${avatarHtml}</div>
      <div class="dm-info">
        <div class="dm-name">${esc(dm.npcName)}</div>
        <div class="dm-preview">${esc(lastMsg.substring(0, 30))}</div>
      </div>
      <div class="dm-time">${timeAgo(dm.lastMessageAt)}</div>
    </div>`;
  }).join('');
}

function openDmChat(dmId) {
  const dms = getDmList();
  const dm = dms.find(d => d.id === dmId);
  if (!dm) return;
  currentDmNpcId = dmId;
  document.getElementById('dmChatTitle').textContent = dm.npcName;
  const world = getActiveWorld();
  document.getElementById('dmChatContent').innerHTML = (dm.messages || []).map(m => {
    const isUser = m.senderType === 'user';
    const isChar = m.senderType === 'char';
    const name = isUser ? world.userAccount.nickname : isChar ? world.charName : dm.npcName;
    return `<div class="comment-item" style="${isUser ? 'flex-direction:row-reverse;text-align:right' : ''}">
      <div class="comment-avatar">${isUser ? esc(world.userAccount.avatarEmoji) : isChar ? esc(world.charAvatar) : (dm.npcAvatarUrl ? `<img src="${esc(dm.npcAvatarUrl)}" alt="">` : esc(dm.npcAvatar || '🧑'))}</div>
      <div class="comment-body">
        <div class="comment-author">${esc(name)}</div>
        <div class="comment-text">${esc(m.content)}</div>
        <div class="comment-time">${timeAgo(m.createdAt)}</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('dmMsgInput').value = '';
  showModal('dmChat');
  // 滚动到底部
  setTimeout(() => { const el = document.getElementById('dmChatContent'); el.scrollTop = el.scrollHeight; }, 100);
}

function sendDmReply() {
  const input = document.getElementById('dmMsgInput');
  const content = input.value.trim();
  if (!content || !currentDmNpcId) return;
  const dms = getDmList();
  const dm = dms.find(d => d.id === currentDmNpcId);
  if (!dm) return;
  dm.messages.push({ id: 'msg_' + Date.now(), senderType: 'user', content, createdAt: Date.now() });
  dm.lastMessageAt = Date.now();
  saveDmList(dms);
  input.value = '';
  openDmChat(currentDmNpcId);
}

async function charAutoReply() {
  if (!currentDmNpcId) return;
  const dms = getDmList();
  const dm = dms.find(d => d.id === currentDmNpcId);
  if (!dm) return;
  const world = getActiveWorld();
  showLoading('CHAR正在回复...');
  try {
    const lastMsgs = dm.messages.slice(-6).map(m => `${m.senderType === 'user' ? world.userAccount.nickname : m.senderType === 'char' ? world.charName : dm.npcName}: ${m.content}`).join('\n');
    const prompt = `你是${world.charName}，性格：${world.charPersonality}。你正在帮你的情侣${world.userAccount.nickname}回复粉丝${dm.npcName}的私信。
最近对话：
${lastMsgs}

请以${world.charName}的口吻回复一条消息，简短自然，符合人设。只输出回复内容，不要加引号或前缀。`;
    const reply = await callLLM(prompt, 0.8);
    if (reply) {
      dm.messages.push({ id: 'msg_' + Date.now(), senderType: 'char', content: reply.trim(), createdAt: Date.now() });
      dm.lastMessageAt = Date.now();
      saveDmList(dms);
      openDmChat(currentDmNpcId);
    }
  } catch (e) { toast('回复失败: ' + e.message); }
  hideLoading();
}

function pruneDms() {
  let dms = getDmList();
  if (dms.length > DM_MAX) {
    dms.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    dms = dms.filter(d => !d.pinned).slice(0, DM_MAX);
    saveDmList(dms);
  }
}

// ==================== 我的/个人中心 ====================
function renderProfile() {
  const world = getActiveWorld();
  const tiers = getFanTiers();
  const posts = getPosts();
  const userPosts = posts.filter(p => p.authorType === 'user').length;
  const charPosts = posts.filter(p => p.authorType === 'char').length;
  const total = tiers.totalFollowers || 1;
  const loyalPct = Math.round((tiers.loyal / total) * 100);
  const casualPct = Math.round((tiers.casual / total) * 100);
  const antiPct = 100 - loyalPct - casualPct;

  document.getElementById('profileContent').innerHTML = `
    <div class="profile-card">
      <div class="avatar">${esc(world.userAccount.avatarEmoji)}</div>
      <div class="nickname">${esc(world.userAccount.nickname)}</div>
      <div class="bio">${esc(world.userAccount.bio || '')}</div>
      <div class="profile-stats">
        <div class="profile-stat"><div class="num">${userPosts}</div><div class="lbl">我的帖子</div></div>
        <div class="profile-stat"><div class="num">${tiers.totalFollowers}</div><div class="lbl">粉丝</div></div>
        <div class="profile-stat"><div class="num">${charPosts}</div><div class="lbl">CHAR帖子</div></div>
      </div>
      <div class="fan-bar" style="margin:12px 16px 0">
        <div class="loyal" style="width:${loyalPct}%"></div>
        <div class="casual" style="width:${casualPct}%"></div>
        <div class="anti" style="width:${antiPct}%"></div>
      </div>
      <div style="display:flex;justify-content:center;gap:16px;margin-top:6px;font-size:10px;color:#777">
        <span>🩷 铁粉 ${loyalPct}%</span><span>💙 路人粉 ${casualPct}%</span><span>⬛ 黑粉 ${antiPct}%</span>
      </div>
    </div>
    <div class="profile-menu">
      <div class="profile-menu-item" onclick="openBookmarks()"><span class="icon">⭐</span>我的收藏<span class="arrow">›</span></div>
      <div class="profile-menu-item" onclick="openCoupleProfile()"><span class="icon">💕</span>情侣关系页<span class="arrow">›</span></div>
      <div class="profile-menu-item" onclick="openFanGroup()"><span class="icon">👥</span>粉丝群<span class="arrow">›</span></div>
      <div class="profile-menu-item" onclick="startLivestream()"><span class="icon">📺</span>开直播<span class="arrow">›</span></div>
      <div class="profile-menu-item" onclick="checkAdManual()"><span class="icon">💰</span>广告中心<span class="arrow">›</span></div>
      <div class="profile-menu-item" onclick="openAvatarManager()"><span class="icon">🖼️</span>头像库管理<span class="arrow">›</span></div>
      <div class="profile-menu-item" onclick="openWorldManager()"><span class="icon">🌍</span>世界观管理<span class="arrow">›</span></div>
      <div class="profile-menu-item" onclick="openCssEditor()"><span class="icon">🎨</span>自定义CSS<span class="arrow">›</span></div>
    </div>`;
}

// ==================== 情侣关系页 ====================
function openCoupleProfile() {
  const world = getActiveWorld();
  const profile = getCoupleProfile();
  const tiers = getFanTiers();
  const daysTogether = Math.floor((Date.now() - (profile.pairDate || world.pairDate || world.createdAt)) / 86400000);
  const userPosts = getPosts().filter(p => p.authorType === 'user').length;
  const charPosts = getPosts().filter(p => p.authorType === 'char').length;

  document.getElementById('coupleContent').innerHTML = `
    <div style="text-align:center;padding:24px 16px;background:linear-gradient(135deg,#1a0a1e,#0a1a2e)">
      <div style="display:flex;justify-content:center;align-items:center;gap:20px;margin-bottom:12px">
        <div><div style="font-size:40px">${esc(world.userAccount.avatarEmoji)}</div><div style="font-size:13px;margin-top:4px">${esc(world.userAccount.nickname)}</div></div>
        <div style="font-size:24px">❤️</div>
        <div><div style="font-size:40px">${esc(world.charAvatar)}</div><div style="font-size:13px;margin-top:4px">${esc(world.charName)}</div></div>
      </div>
      <div style="font-size:12px;color:#ff8fa0">恋爱中 · ${daysTogether} 天</div>
      <div style="margin-top:12px">
        <input type="text" value="${esc(profile.signature || '')}" placeholder="写一句情侣签名..." 
          style="background:rgba(255,255,255,.05);border:1px solid #333;border-radius:20px;padding:8px 16px;color:#e5e5e5;font-size:13px;width:80%;text-align:center;outline:none"
          onchange="updateCoupleSignature(this.value)">
      </div>
    </div>
    <div style="display:flex;justify-content:space-around;padding:16px;border-bottom:1px solid #1a1a1a">
      <div style="text-align:center"><div style="font-size:16px;font-weight:600">${userPosts}</div><div style="font-size:11px;color:#777">我的帖子</div></div>
      <div style="text-align:center"><div style="font-size:16px;font-weight:600">${charPosts}</div><div style="font-size:11px;color:#777">CHAR帖子</div></div>
      <div style="text-align:center"><div style="font-size:16px;font-weight:600">${tiers.totalFollowers}</div><div style="font-size:11px;color:#777">粉丝</div></div>
    </div>
    <div style="padding:16px;font-size:13px;color:#777">
      <div>里程碑: ${(profile.milestones || []).map(m => m + '天').join(' · ') || '暂无'}</div>
    </div>`;
  showModal('couple');
}

function updateCoupleSignature(text) {
  const profile = getCoupleProfile();
  profile.signature = text;
  saveCoupleProfile(profile);
}

function checkMilestone() {
  const world = getActiveWorld();
  const profile = getCoupleProfile();
  const daysTogether = Math.floor((Date.now() - (profile.pairDate || world.pairDate || world.createdAt)) / 86400000);
  for (const m of MILESTONES) {
    if (daysTogether >= m && !(profile.milestones || []).includes(m)) {
      profile.milestones = profile.milestones || [];
      profile.milestones.push(m);
      saveCoupleProfile(profile);
      return m;
    }
  }
  return null;
}

// ==================== 粉丝群 ====================
function openFanGroup() {
  const msgs = getFanMessages();
  const world = getActiveWorld();
  document.getElementById('fanGroupContent').innerHTML = msgs.length === 0
    ? '<div class="empty-state">粉丝群还没有消息<br>刷新世界后粉丝会开始聊天</div>'
    : msgs.map(m => {
      const isUser = m.senderType === 'user';
      const isChar = m.senderType === 'char';
      const avatar = isUser ? esc(world.userAccount.avatarEmoji) : isChar ? esc(world.charAvatar) : (m.senderAvatarUrl ? `<img src="${esc(m.senderAvatarUrl)}" alt="" style="width:28px;height:28px;border-radius:50%">` : esc(m.senderAvatar || '🧑'));
      const name = isUser ? world.userAccount.nickname : isChar ? world.charName : m.senderName;
      return `<div class="comment-item">
        <div class="comment-avatar">${avatar}</div>
        <div class="comment-body">
          <div class="comment-author" style="color:${isChar ? '#58a6ff' : isUser ? '#7ee787' : '#888'}">${esc(name)}</div>
          <div class="comment-text">${esc(m.content)}</div>
          <div class="comment-time">${timeAgo(m.createdAt)}</div>
        </div>
      </div>`;
    }).join('');
  showModal('fanGroup');
  setTimeout(() => { const el = document.getElementById('fanGroupContent'); el.scrollTop = el.scrollHeight; }, 100);
}

function sendFanMessage() {
  const input = document.getElementById('fanMsgInput');
  const content = input.value.trim();
  if (!content) return;
  const world = getActiveWorld();
  const msgs = getFanMessages();
  msgs.push({
    id: 'fm_' + Date.now(), senderType: 'user', senderId: 'user',
    senderName: world.userAccount.nickname, senderAvatar: world.userAccount.avatarEmoji,
    senderAvatarUrl: null, content, createdAt: Date.now()
  });
  saveFanMessages(msgs);
  pruneFanMessages();
  input.value = '';
  openFanGroup();
}

function pruneFanMessages() {
  let msgs = getFanMessages();
  if (msgs.length > FAN_MSG_MAX) {
    msgs = msgs.slice(-FAN_MSG_MAX);
    saveFanMessages(msgs);
  }
}

// ==================== 直播间 ====================
let liveStreamer = null; // 'char' or 'user'
let liveStagedMessages = [];
let liveRpHistory = []; // 直播演绎历史

function startLivestream() {
  // 显示选择界面：谁来直播
  const world = getActiveWorld();
  liveActive = false;
  liveStagedMessages = [];
  liveRpHistory = [];
  liveStreamer = null;
  showModal('live');
  document.getElementById('liveTitle').textContent = '开始直播';
  document.getElementById('liveStagingArea').style.display = 'none';
  document.getElementById('liveContent').innerHTML = `
    <div class="live-choose">
      <div class="live-choose-title">谁来直播？</div>
      <div class="live-choose-btns">
        <div class="live-choose-btn" onclick="chooseLiveStreamer('char')">
          <div class="name">${esc(world.charAvatar)} ${esc(world.charName)} 直播</div>
          <div class="desc">CHAR开直播，你在旁边互动（CHAR有概率拒绝哦）</div>
        </div>
        <div class="live-choose-btn" onclick="chooseLiveStreamer('user')">
          <div class="name">${esc(world.userAccount.avatarEmoji)} ${esc(world.userAccount.nickname)} 直播</div>
          <div class="desc">你来开直播，CHAR在旁边陪你</div>
        </div>
      </div>
    </div>`;
}

async function chooseLiveStreamer(who) {
  const world = getActiveWorld();
  if (who === 'char') {
    // CHAR有概率拒绝
    if (Math.random() < 0.25) {
      const excuses = [
        `${world.charName}：今天不太想播...下次吧～`,
        `${world.charName}：我现在有点累，改天好不好？`,
        `${world.charName}：啊...今天状态不好，不想面对镜头`,
        `${world.charName}：不要嘛，今天素颜！`,
        `${world.charName}：我在忙呢，你自己播吧～`
      ];
      document.getElementById('liveContent').innerHTML = `
        <div class="live-choose">
          <div style="font-size:48px;margin-bottom:16px">😅</div>
          <div style="font-size:15px;color:#d4d4d4;margin-bottom:20px">${esc(excuses[Math.floor(Math.random() * excuses.length)])}</div>
          <div class="live-choose-btns">
            <div class="live-choose-btn" onclick="chooseLiveStreamer('user')">
              <div class="name">那我自己播吧</div>
            </div>
            <div class="live-choose-btn" onclick="closeModal('live')">
              <div class="name">算了不播了</div>
            </div>
          </div>
        </div>`;
      return;
    }
  }
  liveStreamer = who;
  liveActive = true;
  initLiveRoom();
}

function initLiveRoom() {
  const world = getActiveWorld();
  const streamerName = liveStreamer === 'char' ? world.charName : world.userAccount.nickname;
  document.getElementById('liveTitle').textContent = `🔴 ${streamerName} 的直播`;
  document.getElementById('liveStagingArea').style.display = 'block';
  document.getElementById('liveMsgInput').placeholder = '（动作描写）"语言描写"';
  renderLiveRoom();
}

function renderLiveRoom() {
  const rpHtml = liveRpHistory.map(m => {
    const authorClass = m.type === 'char' ? 'char-author' : m.type === 'user' ? 'user-author' : '';
    const formatted = formatRpText(m.content);
    return `<div class="live-rp-msg">
      <div class="author ${authorClass}">${esc(m.name)}</div>
      <div class="rp-text">${formatted}</div>
    </div>`;
  }).join('');

  const danmakuHtml = (liveRpHistory.filter(m => m.type === 'danmaku')).map(m =>
    `<div class="danmaku-item ${m.tier || ''}"><span class="name">${esc(m.name)}</span>${esc(m.content)}</div>`
  ).join('');

  document.getElementById('liveContent').innerHTML = `
    <div class="live-rp-area" id="liveRpArea">${rpHtml || '<div class="empty-state" style="padding:20px">直播开始了！输入你的演绎内容，暂存后合并发送</div>'}</div>
    <div class="live-danmaku" id="liveDanmaku">${danmakuHtml}</div>`;
  setTimeout(() => {
    const area = document.getElementById('liveRpArea');
    if (area) area.scrollTop = area.scrollHeight;
  }, 50);
}

function formatRpText(text) {
  // 将（动作）和"语言"格式化
  return esc(text)
    .replace(/[（(]([^）)]+)[）)]/g, '<span class="action">（$1）</span>')
    .replace(/["""]([^"""]+)["""]/g, '<span class="speech">"$1"</span>');
}

function stageLiveMessage() {
  const input = document.getElementById('liveMsgInput');
  const content = input.value.trim();
  if (!content) return;
  const world = getActiveWorld();
  liveStagedMessages.push({
    name: world.userAccount.nickname,
    type: 'user',
    content
  });
  input.value = '';
  renderStagingArea();
}

function renderStagingArea() {
  document.getElementById('stagingCount').textContent = liveStagedMessages.length;
  document.getElementById('stagingList').innerHTML = liveStagedMessages.map((m, i) => `
    <div class="staging-item">
      <span class="text">${esc(m.content)}</span>
      <button class="del" onclick="removeStagedMessage(${i})">×</button>
    </div>
  `).join('');
}

function removeStagedMessage(idx) {
  liveStagedMessages.splice(idx, 1);
  renderStagingArea();
}

async function flushLiveMessages() {
  if (liveStagedMessages.length === 0) { toast('没有待发送的消息'); return; }
  if (!liveActive) return;
  const world = getActiveWorld();
  const tiers = getFanTiers();

  // 先把暂存消息加入演绎历史
  liveStagedMessages.forEach(m => liveRpHistory.push(m));
  const userMsgs = liveStagedMessages.map(m => m.content).join('\n');
  liveStagedMessages = [];
  renderStagingArea();
  renderLiveRoom();

  showLoading('生成直播反应...');
  try {
    const streamerIsChar = liveStreamer === 'char';
    const recentRp = liveRpHistory.slice(-10).map(m => `[${m.name}] ${m.content}`).join('\n');

    const prompt = `你是一个直播间模拟器。当前直播设定：
- 主播：${streamerIsChar ? world.charName + '（CHAR）' : world.userAccount.nickname + '（USER）'}
- ${streamerIsChar ? 'USER' : 'CHAR'}（${streamerIsChar ? world.userAccount.nickname : world.charName}）在旁边陪播
- CHAR性格：${world.charPersonality || '活泼开朗'}
- 粉丝数：${tiers.totalFollowers}

直播演绎历史：
${recentRp}

USER刚发送的内容：
${userMsgs}

请生成回应，JSON格式：
{
  "streamer_response": "${streamerIsChar ? 'CHAR' : '不需要，留空'}的演绎回应（用（动作描写）"语言描写"格式）",
  "partner_response": "${streamerIsChar ? 'USER不需要，留空' : 'CHAR的演绎回应（用（动作描写）"语言描写"格式，符合CHAR性格）'}",
  "danmaku": [{"name":"粉丝昵称","content":"弹幕内容","tier":"loyal/casual/anti"}]
}
生成4-8条弹幕，体现不同粉丝等级风格。弹幕要对直播内容有反应。
${streamerIsChar ? 'streamer_response必须填写CHAR的回应。partner_response留空字符串。' : 'streamer_response留空字符串。partner_response必须填写CHAR的回应。'}
只输出JSON。`;

    const result = await callLLM(prompt, 0.9);
    const data = parseJSON(result);
    if (data) {
      // CHAR的回应
      const charResponse = streamerIsChar ? data.streamer_response : data.partner_response;
      if (charResponse && charResponse.trim()) {
        liveRpHistory.push({ name: world.charName, type: 'char', content: charResponse.trim() });
      }
      // 弹幕
      if (data.danmaku && Array.isArray(data.danmaku)) {
        data.danmaku.forEach(d => {
          liveRpHistory.push({ name: d.name, type: 'danmaku', content: d.content, tier: d.tier });
        });
      }
      renderLiveRoom();
    }
  } catch (e) { toast('生成失败: ' + e.message); }
  hideLoading();
}

function endLivestream() {
  if (liveActive && liveRpHistory.length > 0) {
    // 生成直播回顾帖子
    const world = getActiveWorld();
    const streamerName = liveStreamer === 'char' ? world.charName : world.userAccount.nickname;
    const posts = getPosts();
    posts.unshift({
      id: 'p_' + Date.now() + '_live',
      authorType: liveStreamer === 'char' ? 'char' : 'user',
      authorId: liveStreamer === 'char' ? 'char' : 'user',
      authorName: streamerName,
      authorAvatar: liveStreamer === 'char' ? world.charAvatar : world.userAccount.avatarEmoji,
      authorAvatarUrl: null,
      authorIdentity: liveStreamer === 'char' ? 'CHAR' : '我',
      content: `直播结束啦～谢谢大家来看！今天播了好久，下次再见 @${liveStreamer === 'char' ? world.userAccount.nickname : world.charName} 💕`,
      topicId: null, topicTitle: null, isCouplePost: false,
      likes: Math.floor(Math.random() * 50) + 10, userLiked: false,
      comments: [], createdAt: Date.now()
    });
    savePosts(posts);
    toast('直播已结束，已生成回顾帖子');
  }
  liveActive = false;
  liveStreamer = null;
  liveStagedMessages = [];
  liveRpHistory = [];
  closeModal('live');
}

// ==================== 广告合作 ====================
function checkAdManual() {
  const tiers = getFanTiers();
  if (tiers.totalFollowers < 100) {
    toast('粉丝数不足100，暂无广告机会');
    return;
  }
  // 生成一个广告机会
  const brandNames = ['花漾美妆','极客数码','味道工坊','星际游戏','潮流衣橱','温馨家居','清风茶社','光影摄影'];
  const brand = brandNames[Math.floor(Math.random() * brandNames.length)];
  const adType = AD_TYPES[Math.floor(Math.random() * AD_TYPES.length)];
  const reward = Math.floor(tiers.totalFollowers * (0.1 + Math.random() * 0.3));
  const ad = {
    id: 'ad_' + Date.now(), brandName: brand, adType, reward,
    description: `${brand}邀请你们推广最新产品，需要发一条体验帖子`,
    status: 'pending', createdAt: Date.now()
  };
  renderAdInvite(ad);
}

function renderAdInvite(ad) {
  document.getElementById('adContent').innerHTML = `<div class="ad-card">
    <div class="brand">${esc(ad.brandName)}</div>
    <div class="type">${esc(ad.adType)} · 广告合作</div>
    <div class="reward">${ad.reward}</div>
    <div class="reward-label">支付宝积分</div>
    <div class="desc">${esc(ad.description)}</div>
    <div class="ad-btns">
      <button class="reject" onclick="rejectAd();closeModal('ad')">拒绝</button>
      <button class="accept" onclick="acceptAd('${ad.id}',${ad.reward},'${esc(ad.brandName)}','${esc(ad.adType)}')">接受</button>
    </div>
  </div>`;
  showModal('ad');
}

function acceptAd(adId, reward, brandName, adType) {
  closeModal('ad');
  const world = getActiveWorld();
  // 生成广告帖子
  const posts = getPosts();
  posts.unshift({
    id: 'p_' + Date.now() + '_ad',
    authorType: 'char', authorId: 'char',
    authorName: world.charName, authorAvatar: world.charAvatar,
    authorAvatarUrl: null, authorIdentity: 'CHAR',
    content: `【广告】最近在用${brandName}的产品，体验还不错～推荐给大家！#${adType}好物分享`,
    topicId: null, topicTitle: null, isCouplePost: false,
    likes: Math.floor(Math.random() * 20) + 5, userLiked: false,
    comments: [], createdAt: Date.now()
  });
  savePosts(posts);
  // 积分写入alipay_points
  addAlipayPoints(reward);
  toast(`获得 ${reward} 积分！`);
  // 翻车检查
  if (Math.random() < 0.3) {
    setTimeout(() => adBacklash(brandName), 1000);
  }
  renderFeed();
}

function rejectAd() { toast('已拒绝广告'); }

function adBacklash(brandName) {
  const tiers = getFanTiers();
  const lostFollowers = Math.floor(tiers.totalFollowers * 0.05 + Math.random() * 10);
  tiers.totalFollowers = Math.max(10, tiers.totalFollowers - lostFollowers);
  tiers.loyal = Math.max(0, tiers.loyal - Math.floor(lostFollowers * 0.3));
  tiers.casual = Math.max(0, tiers.casual - Math.floor(lostFollowers * 0.5));
  tiers.anti += Math.floor(lostFollowers * 0.2);
  saveFanTiers(tiers);
  // 生成差评帖子
  const posts = getPosts();
  const npc = getOrCreateNpc('失望的粉丝', '对恰饭行为不满', 'fan', '路人粉', 'casual');
  posts.unshift({
    id: 'p_' + Date.now() + '_backlash',
    authorType: 'npc', authorId: npc.id,
    authorName: npc.name, authorAvatar: npc.emoji,
    authorAvatarUrl: npc.avatarUrl, authorIdentity: '粉丝',
    content: `又恰饭...${brandName}的广告也接？有点失望了`,
    topicId: null, topicTitle: null, isCouplePost: false,
    likes: Math.floor(Math.random() * 30) + 5, userLiked: false,
    comments: [], createdAt: Date.now()
  });
  savePosts(posts);
  toast(`⚠️ 广告翻车！掉了 ${lostFollowers} 粉丝`);
  renderFeed();
}

function addAlipayPoints(amount) {
  const world = getActiveWorld();
  try {
    const points = getS('alipay_points', {});
    const charKey = world.charId || 'default';
    points[charKey] = (points[charKey] || 0) + amount;
    setS('alipay_points', points);
  } catch (e) {}
}

// ==================== 争议事件 ====================
function triggerControversy(desc) {
  const world = getActiveWorld();
  const event = {
    id: 'ce_' + Date.now(), trigger: 'anti_fan',
    description: desc || '有黑粉在攻击你们的情侣号',
    responseType: null, result: null, followerChange: 0,
    resolved: false, createdAt: Date.now()
  };
  renderControversy(event);
}

function renderControversy(event) {
  document.getElementById('controversyContent').innerHTML = `
    <div class="controversy-chain">
      <div class="controversy-desc">${esc(event.description)}</div>
    </div>
    <div style="padding:0 16px 8px;font-size:13px;color:#999">选择回应方式：</div>
    <div class="response-options">
      <button class="response-btn" onclick="respondToControversy('${event.id}','ignore','${esc(event.description)}')">😶 无视 - 不理会，让事情自然平息</button>
      <button class="response-btn" onclick="respondToControversy('${event.id}','fight','${esc(event.description)}')">💪 反击 - 正面回应，澄清事实</button>
      <button class="response-btn" onclick="respondToControversy('${event.id}','apologize','${esc(event.description)}')">🙏 道歉 - 承认不足，诚恳道歉</button>
      <button class="response-btn" onclick="respondToControversy('${event.id}','clarify','${esc(event.description)}')">📝 澄清 - 发布详细澄清声明</button>
    </div>`;
  showModal('controversy');
}

async function respondToControversy(eventId, responseType, desc) {
  closeModal('controversy');
  showLoading('评估回应效果...');
  const world = getActiveWorld();
  const tiers = getFanTiers();
  try {
    const prompt = `情侣号遇到争议事件：${desc}
回应方式：${responseType === 'ignore' ? '无视' : responseType === 'fight' ? '反击' : responseType === 'apologize' ? '道歉' : '澄清'}
当前粉丝数：${tiers.totalFollowers}

请评估回应效果，JSON格式：
{"result":"good/neutral/bad","followerChange":数字(正数涨粉负数掉粉),"charResponse":"CHAR发的帖子内容(护着情侣的)","publicReaction":"路人的反应(一句话)"}
只输出JSON。`;
    const result = await callLLM(prompt, 0.7);
    const data = parseJSON(result);
    if (data) {
      // 更新粉丝数
      const change = data.followerChange || 0;
      tiers.totalFollowers = Math.max(10, tiers.totalFollowers + change);
      if (data.result === 'bad') {
        tiers.loyal = Math.max(0, tiers.loyal - Math.abs(Math.floor(change * 0.3)));
        tiers.anti += Math.abs(Math.floor(change * 0.2));
      } else if (data.result === 'good') {
        tiers.loyal += Math.floor(Math.abs(change) * 0.3);
        tiers.anti = Math.max(0, tiers.anti - Math.floor(Math.abs(change) * 0.2));
      }
      saveFanTiers(tiers);
      // CHAR发帖护着User
      if (data.charResponse) {
        const posts = getPosts();
        posts.unshift({
          id: 'p_' + Date.now() + '_cr',
          authorType: 'char', authorId: 'char',
          authorName: world.charName, authorAvatar: world.charAvatar,
          authorAvatarUrl: null, authorIdentity: 'CHAR',
          content: data.charResponse, topicId: null, topicTitle: null,
          isCouplePost: false, likes: Math.floor(Math.random() * 40) + 10,
          userLiked: false, comments: [], createdAt: Date.now()
        });
        savePosts(posts);
      }
      toast(change >= 0 ? `处理得当！涨了 ${change} 粉丝` : `掉了 ${Math.abs(change)} 粉丝`);
      renderFeed();
    }
  } catch (e) { toast('评估失败'); }
  hideLoading();
}

// ==================== 世界观管理 ====================
function openWorldManager() {
  const worlds = getWorlds();
  const aid = getActiveWorldId();
  document.getElementById('worldManagerContent').innerHTML = worlds.map(w => `
    <div class="world-mgr-item">
      <div style="font-size:24px">${esc(w.charAvatar)}</div>
      <div class="info">
        <div class="name">${esc(w.name)}</div>
        <div class="char">${esc(w.charName)} · ${esc(w.userAccount.nickname)}</div>
      </div>
      <div class="world-mgr-actions">
        ${w.id === aid ? '<span style="font-size:11px;color:#7ee787">当前</span>' : `<button onclick="switchWorld('${w.id}');closeModal('worldManager')">切换</button>`}
        <button class="del" onclick="deleteWorld('${w.id}')">删除</button>
      </div>
    </div>
  `).join('') + `<div style="padding:16px;text-align:center">
    <button class="btn-primary" style="width:auto;padding:10px 24px;font-size:13px" onclick="closeModal('worldManager');showCharSelector()">创建新世界观</button>
  </div>`;
  showModal('worldManager');
}

function deleteWorld(wid) {
  if (!confirm('确定删除这个世界观？所有数据将被清除。')) return;
  let worlds = getWorlds();
  worlds = worlds.filter(w => w.id !== wid);
  setS('couple_twitter_worlds', worlds);
  // 清除该世界观的所有数据
  const suffixes = ['posts','trending','npcs','fan_messages','dms','cp_posts','fan_tiers','couple_profile','ads','controversies','char_stats'];
  suffixes.forEach(s => localStorage.removeItem(`couple_twitter_${wid}_${s}`));
  if (worlds.length === 0) {
    localStorage.removeItem('couple_twitter_active_world');
    showCharSelector();
  } else {
    if (getActiveWorldId() === wid) {
      setS('couple_twitter_active_world', worlds[0].id);
    }
    enterWorld();
  }
  closeModal('worldManager');
}

// ==================== 头像库管理 ====================
function openAvatarManager() {
  const pool = getS('forum_avatar_pool', []);
  document.getElementById('avatarMgrContent').innerHTML = `
    <div class="avatar-mgr-input">
      <textarea id="avatarUrlInput" placeholder="每行一个图片URL，批量导入头像"></textarea>
    </div>
    <div class="avatar-mgr-btns">
      <button class="add" onclick="batchAddAvatars()">批量导入</button>
      <button class="clear" onclick="clearAvatarPool()">清空头像库</button>
    </div>
    <div style="padding:8px 16px;font-size:12px;color:#777">当前头像库: ${pool.length} 个（与论坛共享）</div>
    <div class="avatar-pool" id="avatarPoolList">
      ${pool.map((url, i) => `<div class="avatar-pool-item">
        <img src="${esc(url)}" alt="" loading="lazy">
        <button class="del" onclick="removeAvatar(${i})">×</button>
      </div>`).join('')}
    </div>`;
  showModal('avatarMgr');
}

function batchAddAvatars() {
  const input = document.getElementById('avatarUrlInput');
  const urls = input.value.split('\n').map(u => u.trim()).filter(u => u.startsWith('http'));
  if (urls.length === 0) { toast('请输入有效的图片URL'); return; }
  const pool = getS('forum_avatar_pool', []);
  urls.forEach(u => { if (!pool.includes(u)) pool.push(u); });
  setS('forum_avatar_pool', pool);
  toast(`已导入 ${urls.length} 个头像`);
  openAvatarManager();
}

function removeAvatar(index) {
  const pool = getS('forum_avatar_pool', []);
  pool.splice(index, 1);
  setS('forum_avatar_pool', pool);
  openAvatarManager();
}

function clearAvatarPool() {
  if (!confirm('确定清空头像库？')) return;
  setS('forum_avatar_pool', []);
  openAvatarManager();
}

// ==================== CSS主题编辑器 ====================
let wbCssSchemes = [];
let wbActiveCssId = 'default';

function loadCssSchemes() {
  wbCssSchemes = getS('couple_twitter_css_schemes', []);
  if (!Array.isArray(wbCssSchemes)) wbCssSchemes = [];
  const saved = localStorage.getItem('couple_twitter_active_css');
  wbActiveCssId = (saved && saved !== 'undefined' && saved !== 'null') ? saved : 'default';
}

function saveCssSchemesData() {
  setS('couple_twitter_css_schemes', wbCssSchemes);
  localStorage.setItem('couple_twitter_active_css', wbActiveCssId);
}

function openCssEditor() {
  loadCssSchemes();
  const sel = document.getElementById('cssSchemeSelect');
  sel.innerHTML = '<option value="default">默认主题（Ins暗色风）</option>';
  wbCssSchemes.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id; o.textContent = s.name; sel.appendChild(o);
  });
  sel.value = wbActiveCssId;
  loadSelectedScheme();
  showModal('cssEditor');
}

function closeCssEditor() { closeModal('cssEditor'); }

function loadSelectedScheme() {
  const sel = document.getElementById('cssSchemeSelect');
  const editor = document.getElementById('cssEditorArea');
  if (sel.value === 'default') {
    editor.value = getDefaultWbCss();
  } else {
    const s = wbCssSchemes.find(x => x.id === sel.value);
    if (s) editor.value = s.css;
  }
}

function createCssScheme() {
  const name = prompt('新方案名称：');
  if (!name || !name.trim()) return;
  const editor = document.getElementById('cssEditorArea');
  const ns = { id: Date.now().toString(), name: name.trim(), css: editor.value || getDefaultWbCss() };
  wbCssSchemes.push(ns);
  saveCssSchemesData();
  const sel = document.getElementById('cssSchemeSelect');
  const o = document.createElement('option');
  o.value = ns.id; o.textContent = ns.name; sel.appendChild(o);
  sel.value = ns.id;
  toast('方案已创建');
}

function deleteCssScheme() {
  const sel = document.getElementById('cssSchemeSelect');
  if (sel.value === 'default') { toast('默认方案不能删除'); return; }
  const s = wbCssSchemes.find(x => x.id === sel.value);
  if (!s || !confirm('删除方案「' + s.name + '」？')) return;
  wbCssSchemes = wbCssSchemes.filter(x => x.id !== sel.value);
  if (wbActiveCssId === sel.value) { wbActiveCssId = 'default'; applyCssScheme('default'); }
  saveCssSchemesData();
  sel.querySelector('option[value="' + s.id + '"]').remove();
  sel.value = 'default';
  loadSelectedScheme();
  toast('已删除');
}

function saveCssScheme() {
  const sel = document.getElementById('cssSchemeSelect');
  const css = document.getElementById('cssEditorArea').value;
  if (sel.value === 'default') {
    const name = prompt('为自定义方案命名：', '我的主题');
    if (!name || !name.trim()) return;
    const ns = { id: Date.now().toString(), name: name.trim(), css: css };
    wbCssSchemes.push(ns);
    wbActiveCssId = ns.id;
    const o = document.createElement('option');
    o.value = ns.id; o.textContent = ns.name; sel.appendChild(o);
    sel.value = ns.id;
  } else {
    const s = wbCssSchemes.find(x => x.id === sel.value);
    if (s) s.css = css;
    wbActiveCssId = sel.value;
  }
  saveCssSchemesData();
  applyCssScheme(wbActiveCssId);
  closeCssEditor();
  toast('已保存并应用');
}

function previewCss() {
  const css = document.getElementById('cssEditorArea').value;
  let el = document.getElementById('wbCustomCss');
  if (!el) { el = document.createElement('style'); el.id = 'wbCustomCss'; document.head.appendChild(el); }
  el.textContent = css;
  toast('预览中（未保存）');
}

function resetToDefault() {
  if (!confirm('恢复默认CSS？当前编辑内容将丢失')) return;
  document.getElementById('cssEditorArea').value = getDefaultWbCss();
  toast('已恢复默认');
}

function applyCssScheme(id) {
  let el = document.getElementById('wbCustomCss');
  if (id === 'default') { if (el) el.textContent = ''; return; }
  const s = wbCssSchemes.find(x => x.id === id);
  if (!s) return;
  if (!el) { el = document.createElement('style'); el.id = 'wbCustomCss'; document.head.appendChild(el); }
  el.textContent = s.css;
}

function getDefaultWbCss() {
  return '/* ==================== CHAR的世界微博 - 默认Ins暗色主题 ==================== */\n'
+ '/* 修改这里的CSS来自定义你的世界微博外观 */\n'
+ '/* 保存后会覆盖默认样式，可以随时恢复默认 */\n\n'
+ '/* === 全局基础 === */\n'
+ '* { margin:0; padding:0; box-sizing:border-box; }\n'
+ 'body {\n'
+ '  font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;\n'
+ '  background: #0a0a0a;  /* 页面背景色 */\n'
+ '  color: #e5e5e5;        /* 默认文字颜色 */\n'
+ '  min-height: 100vh;\n'
+ '}\n\n'
+ '/* === 顶部世界栏 === */\n'
+ '.world-bar { background: #0a0a0a; border-bottom: 1px solid #1a1a1a; }\n'
+ '.world-chip { border: 1px solid #333; background: transparent; color: #999; border-radius: 20px; font-size: 13px; }\n'
+ '.world-chip.active { background: #e5e5e5; color: #0a0a0a; border-color: #e5e5e5; }\n\n'
+ '/* === 信息流头部 === */\n'
+ '.feed-header { background: #0a0a0a; border-bottom: 1px solid #1a1a1a; /* 信息流标题栏 */ }\n'
+ '.feed-title { font-size: 18px; font-weight: 600; color: #e5e5e5; /* 标题文字 */ }\n\n'
+ '/* === 信息流帖子 === */\n'
+ '.post-item { border-bottom: 1px solid #1a1a1a; }\n'
+ '.post-item.char-post { background: #0d1117; /* CHAR帖子背景 */ }\n'
+ '.post-avatar { background: #1a1a1a; }\n'
+ '.post-body { color: #d4d4d4; font-size: 14px; line-height: 1.6; /* 帖子正文 */ }\n'
+ '.post-topic { color: #58a6ff; background: #0d1926; /* 话题标签 */ }\n'
+ '.post-action { color: #555; }\n'
+ '.post-action.liked { color: #ff6b6b; }\n\n'
+ '/* === 身份标签 === */\n'
+ '.post-tag { background: #2a2a2a; color: #999; }\n'
+ '.post-tag.char { background: #1a2332; color: #58a6ff; }\n'
+ '.post-tag.me { background: #1a2e1a; color: #7ee787; }\n'
+ '.post-tag.media { background: #2d1f00; color: #f0b040; }\n'
+ '.post-tag.influencer { background: #2d1030; color: #d68fff; }\n'
+ '.post-tag.fan { background: #2d1a1a; color: #ff8888; }\n'
+ '.post-tag.troll { background: #1a1a1a; color: #666; }\n\n'
+ '/* === 底部Tab栏 === */\n'
+ '.tab-bar { background: #0a0a0a; border-top: 1px solid #1a1a1a; }\n'
+ '.tab { color: #555; }\n'
+ '.tab.active { color: #e5e5e5; }\n\n'
+ '/* === 热搜榜 === */\n'
+ '.trending-categories { border-bottom: 1px solid #1a1a1a; /* 分类栏 */ }\n'
+ '.cat-chip { border: 1px solid #333; background: transparent; color: #999; }\n'
+ '.cat-chip.active { background: #e5e5e5; color: #0a0a0a; border-color: #e5e5e5; }\n'
+ '.trending-item { border-bottom: 1px solid #1a1a1a; }\n'
+ '.trending-rank { color: #555; }\n'
+ '.trending-rank.top3 { color: #ff6b6b; }\n'
+ '.trending-title { font-size: 14px; }\n'
+ '.trending-cat-tag { background: #1a1a1a; color: #888; }\n'
+ '.trending-new { color: #ff6b6b; }\n\n'
+ '/* === CP超话 === */\n'
+ '.cp-milestone { background: linear-gradient(135deg, #1a0a1e 0%, #0a1a2e 100%); }\n'
+ '.cp-milestone .days { color: #ff8fa0; }\n\n'
+ '/* === 私信 === */\n'
+ '.dm-item { border-bottom: 1px solid #1a1a1a; }\n'
+ '.dm-avatar { background: #1a1a1a; }\n'
+ '.dm-preview { color: #666; }\n\n'
+ '/* === 个人中心 === */\n'
+ '.profile-card { border-bottom: 1px solid #1a1a1a; }\n'
+ '.profile-menu-item { border-bottom: 1px solid #111; font-size: 14px; }\n'
+ '.fan-bar .loyal { background: #ff8fa0; }\n'
+ '.fan-bar .casual { background: #58a6ff; }\n'
+ '.fan-bar .anti { background: #555; }\n\n'
+ '/* === 模态框 === */\n'
+ '.modal { background: #0a0a0a; }\n'
+ '.modal.modal-sm { background: #141414; }\n'
+ '.modal-header { border-bottom: 1px solid #1a1a1a; }\n'
+ '.btn-post { background: #e5e5e5; color: #0a0a0a; }\n\n'
+ '/* === 评论区 === */\n'
+ '.comment-item { border-bottom: 1px solid #111; }\n'
+ '.comment-author { color: #888; }\n'
+ '.comment-text { font-size: 13px; }\n\n'
+ '/* === 输入框 === */\n'
+ '.chat-input-bar { background: #0a0a0a; border-top: 1px solid #1a1a1a; /* 输入栏背景 */ }\n'
+ '.chat-input-bar input, .comment-input-bar input { background: #141414; border: 1px solid #2a2a2a; color: #e5e5e5; }\n'
+ '.chat-input-bar button, .comment-input-bar button { background: #e5e5e5; color: #0a0a0a; }\n\n'
+ '/* === FAB浮动按钮 === */\n'
+ '.fab { background: #e5e5e5; color: #0a0a0a; box-shadow: 0 4px 12px rgba(0,0,0,.5); }\n\n'
+ '/* === 直播间 === */\n'
+ '.danmaku-item .name { color: #58a6ff; }\n'
+ '.danmaku-item.loyal .name { color: #ff8fa0; }\n'
+ '.danmaku-item.user .name { color: #7ee787; }\n\n'
+ '/* === 富媒体标签 === */\n'
+ '.media-img { background: #1a2a1a; color: #7ee787; }\n'
+ '.media-vid { background: #2a1a2a; color: #d2a8ff; }\n'
+ '.media-aud { background: #1a1a2a; color: #79c0ff; }\n'
+ '.media-loc { background: #2a2a1a; color: #f0c674; }\n\n'
+ '/* === 加载动画 === */\n'
+ '.loading-spinner { border: 3px solid #333; border-top-color: #e5e5e5; }\n'
+ '.loading-text { color: #999; }\n\n'
+ '/* === 通知提示 === */\n'
+ '.toast { background: #222; color: #e5e5e5; }\n';
}

// ==================== LLM API ====================
function getApiConfig() {
  const world = getActiveWorld();
  if (world) {
    const contacts = getS('vibe_contacts', []);
    const c = contacts.find(x => String(x.id) === String(world.charId) || x.name === world.charId);
    if (c && c.apiScheme) {
      const schemes = getS('vibe_api_schemes', []);
      const scheme = schemes.find(s => s.id === c.apiScheme);
      if (scheme && scheme.apiUrl && scheme.apiKey) {
        return { apiUrl: scheme.apiUrl, apiKey: scheme.apiKey, model: scheme.model };
      }
    }
  }
  const apiUrl = localStorage.getItem('apiUrl');
  const apiKey = localStorage.getItem('apiKey');
  const model = localStorage.getItem('selectedModel');
  return { apiUrl, apiKey, model };
}

async function callLLM(prompt, temperature = 0.7, systemPrompt = '') {
  const { apiUrl, apiKey, model } = getApiConfig();
  if (!apiUrl || !apiKey) throw new Error('请先配置API');
  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });
  // 兼容 message.js 的 URL 格式：直接 apiUrl + /chat/completions
  let base = apiUrl.replace(/\/+$/, '');
  const url = base + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || 'gpt-4o-mini', messages, temperature, max_tokens: 4000 })
  });
  if (!res.ok) throw new Error(`API错误: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function parseJSON(str) {
  try {
    // 尝试提取JSON块
    const match = str.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return null;
  } catch (e) {
    console.error('JSON解析失败:', e, str);
    return null;
  }
}


// ==================== 首页刷新结果处理 ====================
function processFeedResult(data) {
  const world = getActiveWorld();
  const now = Date.now();
  let posts = getPosts();
  let trending = getTrending();
  let cpPosts = getCpPosts();

  // 新闻帖子
  const newsPosts = [];
  if (data.news_posts && Array.isArray(data.news_posts)) {
    data.news_posts.forEach(np => {
      const npc = getOrCreateNpc(np.authorName || '新闻媒体', '专业媒体', 'media', '媒体');
      const post = makePost(npc, '媒体', np.content, np.topicTitle, now);
      posts.unshift(post);
      newsPosts.push(post);
    });
  }

  // NPC帖子
  const npcPosts = [];
  if (data.npc_posts && Array.isArray(data.npc_posts)) {
    data.npc_posts.forEach(np => {
      const npc = getOrCreateNpc(np.authorName, np.authorPersonality, np.identityType || 'normal', np.relationTag || '路人');
      const identityLabel = np.identityType === 'influencer' ? '网红' : np.identityType === 'fan' ? '粉丝' : np.identityType === 'troll' ? '杠精' : '路人';
      const post = makePost(npc, identityLabel, np.content, np.topicTitle, now);
      posts.unshift(post);
      npcPosts.push(post);
    });
  }

  // CHAR帖子
  const charPosts = [];
  if (data.char_posts && Array.isArray(data.char_posts)) {
    data.char_posts.forEach(cp => {
      let content = cp.content;
      if (cp.mentionUser) content += ` @${world.userAccount.nickname}`;
      const post = {
        id: 'p_' + now + '_c' + Math.random().toString(36).substr(2, 4),
        authorType: 'char', authorId: 'char',
        authorName: world.charName, authorAvatar: world.charAvatar,
        authorAvatarUrl: null, authorIdentity: 'CHAR',
        content, topicId: null, topicTitle: cp.topicTitle || null,
        isCouplePost: cp.isCouplePost || false,
        likes: Math.floor(Math.random() * 50 + 10), userLiked: false,
        comments: [], createdAt: now + Math.random() * 1000
      };
      if (cp.topicTitle) {
        const t = trending.find(x => x.title === cp.topicTitle);
        if (t) post.topicId = t.id;
      }
      posts.unshift(post);
      charPosts.push(post);
      if (cp.isCouplePost) cpPosts.unshift(post);
    });
    // 标记今天CHAR已发帖
    if (charPosts.length > 0) markDoneToday(wKey('last_char_post_date'));
  }

  // CHAR评论
  if (data.char_comments && Array.isArray(data.char_comments)) {
    data.char_comments.forEach(cc => {
      const targetArr = cc.targetPostType === 'news' ? newsPosts : npcPosts;
      const target = targetArr[cc.targetPostIndex || 0];
      if (target) {
        target.comments = target.comments || [];
        target.comments.push({
          id: 'c_' + now + '_' + Math.random().toString(36).substr(2, 3),
          authorType: 'char', authorId: 'char',
          authorName: world.charName, authorAvatar: world.charAvatar,
          authorAvatarUrl: null, content: cc.content, createdAt: now
        });
      }
    });
  }

  // NPC评论CHAR帖子 — 不在首页刷新时生成，改为CP超话刷新时统一处理

  // 里程碑帖子
  if (data.milestone_post) {
    const mp = {
      id: 'p_' + now + '_ms',
      authorType: 'char', authorId: 'char',
      authorName: world.charName, authorAvatar: world.charAvatar,
      authorAvatarUrl: null, authorIdentity: 'CHAR',
      content: data.milestone_post.content + ` @${world.userAccount.nickname}`,
      topicId: null, topicTitle: null, isCouplePost: true,
      likes: Math.floor(Math.random() * 80 + 30), userLiked: false,
      comments: [], createdAt: now
    };
    posts.unshift(mp);
    cpPosts.unshift(mp);
    saveCpPosts(cpPosts);
  }

  // 涨粉
  const tiers = getFanTiers();
  const gain = Math.floor(Math.random() * 10 + 3);
  tiers.totalFollowers += gain;
  tiers.casual += Math.floor(gain * 0.6);
  tiers.loyal += Math.floor(gain * 0.3);
  tiers.anti += Math.floor(gain * 0.1);
  saveFanTiers(tiers);

  savePosts(posts);
  pruneOldPosts();
}

// ==================== 热搜单独刷新 ====================
async function refreshTrending() {
  if (isRefreshing) return;
  isRefreshing = true;
  showLoading('热搜刷新中...');
  try {
    const catList = NEWS_CATS.map(c => c.label).join('、');
    const existing = getTrending().slice(0, 5);
    const existingSummary = existing.length > 0
      ? `\n当前热搜（可以生成后续/反转/新进展）：\n${existing.map(t => `- ${t.title}(${t.categoryLabel}, 热度${t.heat})`).join('\n')}\n你可以选择为1-2条旧热搜生成后续话题（标题体现是后续，如"#xxx最新进展#"），也可以全部生成新话题。`
      : '';
    const prompt = `你是一个社交媒体热搜生成器。请生成3-5条热搜话题。
分类从[${catList}]中选，至少覆盖2个分类。${existingSummary}
每条热搜需要附带一条原始新闻帖子（作为热搜来源）和2-3条NPC评论（吃瓜群众的反应）。
请严格按JSON格式输出：
\`\`\`json
{"trending":[{"title":"#话题#","category":"tech/military/entertainment/economy/politics/culture","heat":数字,"sourcePost":{"authorName":"媒体/博主名","content":"原始新闻/爆料内容，100字左右"},"comments":[{"authorName":"NPC名","content":"吃瓜评论"}]}]}
\`\`\`
只输出JSON，不要其他文字。内容要自然生动，中文。评论要有不同立场和风格。`;
    const result = await callLLM(prompt, 0.9);
    const data = parseJSON(result);
    if (data && data.trending) {
      const now = Date.now();
      let trending = getTrending();
      data.trending.forEach(t => {
        const catObj = NEWS_CATS.find(c => c.id === t.category) || NEWS_CATS[2];
        const topicId = 'topic_' + now + '_' + Math.random().toString(36).substr(2, 4);
        // 保存热搜来源帖子和评论
        const sourcePost = t.sourcePost ? {
          authorName: t.sourcePost.authorName || '热点快报',
          content: t.sourcePost.content || ''
        } : null;
        const comments = (t.comments || []).map(c => ({
          authorName: c.authorName || '吃瓜群众',
          content: c.content || ''
        }));
        trending.unshift({
          id: topicId,
          title: t.title, category: t.category || catObj.id,
          categoryLabel: catObj.label, heat: t.heat || Math.floor(Math.random() * 8000 + 2000),
          createdAt: now, isNew: true,
          sourcePost, comments
        });
      });
      decayTrending();
      saveTrending(trending);
      renderTrendingList();
      toast('热搜已刷新');
    } else { toast('生成失败，请重试'); }
  } catch (e) { toast('刷新失败: ' + e.message); }
  isRefreshing = false;
  hideLoading();
}

// ==================== CP超话单独刷新 ====================
async function refreshCp() {
  if (isRefreshing) return;
  isRefreshing = true;
  showLoading('CP超话刷新中...');
  try {
    const world = getActiveWorld();
    const tiers = getFanTiers();

    // 收集需要NPC评论的帖子（USER/CHAR帖子中评论少于2条的）
    const posts = getPosts();
    const needCommentPosts = posts.filter(p =>
      (p.authorType === 'user' || p.authorType === 'char') &&
      (!p.comments || p.comments.length < 2) &&
      Date.now() - p.createdAt < 86400000 * 2
    ).slice(0, 4);

    const commentBlock = needCommentPosts.length > 0
      ? `\n另外，以下帖子还没有粉丝评论，请为每条生成1-2条NPC评论：
${needCommentPosts.map((p, i) => `[${i}] ${p.authorName}(${p.authorIdentity}): ${p.content.substring(0, 50)}`).join('\n')}
在JSON中加入 "npc_comments": [{"postIndex":0,"authorName":"NPC名","authorPersonality":"性格","fanTier":"loyal/casual/anti","content":"评论"}]`
      : '';

    // CP超话每天生成一次CHAR内容
    const cpDoneToday = isDoneToday(wKey('last_cp_refresh_date'));
    const charCpInstruction = cpDoneToday
      ? '今天CHAR已经在CP超话互动过了，不需要生成char_cp_post。'
      : '生成1条CHAR在CP超话发的帖子（秀恩爱/日常/撒娇等）。';
    const charCpBlock = cpDoneToday ? '' : `,"char_cp_post":{"content":"CHAR的CP帖子内容"}`;

    const prompt = `你是一个CP粉丝社区模拟器。
CP信息：${world.userAccount.nickname} ❤️ ${world.charName}，CHAR性格：${world.charPersonality || '活泼开朗'}，粉丝数${tiers.totalFollowers}。
请生成2-3条CP粉丝在超话发的嗑CP帖子，以及1-2条粉丝群聊天消息。
${charCpInstruction}${commentBlock}
\`\`\`json
{"cp_fan_posts":[{"authorName":"CP粉名","content":"嗑CP内容"}],"fan_messages":[{"senderName":"名字","content":"消息"}]${charCpBlock}${needCommentPosts.length > 0 ? ',"npc_comments":[{"postIndex":0,"authorName":"NPC名","authorPersonality":"性格","fanTier":"loyal/casual/anti","content":"评论"}]' : ''}}
\`\`\`
只输出JSON，不要其他文字。内容要自然生动，中文，体现粉丝嗑CP的热情。`;
    const result = await callLLM(prompt, 0.85);
    const data = parseJSON(result);
    if (data) {
      const now = Date.now();
      // CP粉帖子
      if (data.cp_fan_posts && Array.isArray(data.cp_fan_posts)) {
        let cpPosts = getCpPosts();
        data.cp_fan_posts.forEach(cp => {
          const npc = getOrCreateNpc(cp.authorName, '嗑CP达人', 'fan', 'CP粉');
          cpPosts.unshift({
            id: 'cp_' + now + '_' + Math.random().toString(36).substr(2, 4),
            authorType: 'npc', authorId: npc.id,
            authorName: npc.name, authorAvatar: npc.emoji,
            authorAvatarUrl: npc.avatarUrl, authorIdentity: 'CP粉',
            content: cp.content, topicId: null, topicTitle: null,
            isCouplePost: true, likes: Math.floor(Math.random() * 20 + 3),
            userLiked: false, comments: [], createdAt: now
          });
        });
        saveCpPosts(cpPosts);
        pruneCpPosts();
      }
      // 粉丝群消息
      if (data.fan_messages && Array.isArray(data.fan_messages)) {
        let fanMsgs = getFanMessages();
        data.fan_messages.forEach(fm => {
          const npc = getOrCreateNpc(fm.senderName, '', 'fan', '粉丝');
          fanMsgs.push({
            id: 'fm_' + now + '_' + Math.random().toString(36).substr(2, 3),
            senderType: 'npc', senderId: npc.id,
            senderName: npc.name, senderAvatar: npc.emoji,
            senderAvatarUrl: npc.avatarUrl, content: fm.content, createdAt: now
          });
        });
        saveFanMessages(fanMsgs);
        pruneFanMessages();
      }
      // CHAR的CP帖子
      if (data.char_cp_post && !cpDoneToday) {
        let cpPosts = getCpPosts();
        let mainPosts = getPosts();
        const post = {
          id: 'cp_' + now + '_char',
          authorType: 'char', authorId: 'char',
          authorName: world.charName, authorAvatar: world.charAvatar,
          authorAvatarUrl: null, authorIdentity: 'CHAR',
          content: data.char_cp_post.content, topicId: null, topicTitle: null,
          isCouplePost: true, likes: Math.floor(Math.random() * 40 + 10),
          userLiked: false, comments: [], createdAt: now
        };
        cpPosts.unshift(post);
        mainPosts.unshift(post);
        saveCpPosts(cpPosts);
        savePosts(mainPosts);
        markDoneToday(wKey('last_cp_refresh_date'));
      }
      // NPC评论USER/CHAR帖子
      if (data.npc_comments && Array.isArray(data.npc_comments)) {
        let allPosts = getPosts();
        data.npc_comments.forEach(nc => {
          const target = needCommentPosts[nc.postIndex || 0];
          if (target) {
            const realPost = allPosts.find(p => p.id === target.id);
            if (realPost) {
              const npc = getOrCreateNpc(nc.authorName, nc.authorPersonality || '', nc.identityType || 'fan', nc.fanTier === 'loyal' ? 'CHAR铁粉' : nc.fanTier === 'anti' ? '黑粉' : '路人粉', nc.fanTier);
              realPost.comments = realPost.comments || [];
              realPost.comments.push({
                id: 'c_' + now + '_' + Math.random().toString(36).substr(2, 3),
                authorType: 'npc', authorId: npc.id,
                authorName: npc.name, authorAvatar: npc.emoji,
                authorAvatarUrl: npc.avatarUrl, content: nc.content, createdAt: now
              });
            }
          }
        });
        savePosts(allPosts);
      }
      renderCpSuperTopic();
      toast('CP超话已刷新');
    } else { toast('生成失败，请重试'); }
  } catch (e) { toast('刷新失败: ' + e.message); }
  isRefreshing = false;
  hideLoading();
}

// ==================== 私信单独刷新 ====================
async function refreshDm() {
  if (isRefreshing) return;
  isRefreshing = true;
  showLoading('私信刷新中...');
  try {
    const world = getActiveWorld();
    const tiers = getFanTiers();
    const npcs = getNpcs().filter(n => n.identityType === 'fan').slice(0, 5);
    const npcNames = npcs.length > 0 ? '已有粉丝：' + npcs.map(n => n.name).join('、') : '';

    // 找出USER已回复但CHAR还没回复的对话（最后一条是user发的）
    const dmList = getDmList();
    const needCharReply = dmList.filter(dm => {
      if (!dm.messages || dm.messages.length === 0) return false;
      const last = dm.messages[dm.messages.length - 1];
      return last.senderType === 'user';
    }).slice(0, 3);

    const charReplyBlock = needCharReply.length > 0
      ? `\n另外，以下私信对话中USER已经回复了，请以${world.charName}的口吻为每条生成CHAR的回复：
${needCharReply.map((dm, i) => {
  const lastMsgs = dm.messages.slice(-4).map(m => `${m.senderType === 'user' ? world.userAccount.nickname : m.senderType === 'char' ? world.charName : dm.npcName}: ${m.content}`).join('\n');
  return `[${i}] 与${dm.npcName}的对话：\n${lastMsgs}`;
}).join('\n')}
在JSON中加入 "char_replies": [{"dmIndex":0,"content":"CHAR的回复"}]`
      : '';

    const prompt = `你是一个社交媒体私信模拟器。
CHAR：${world.charName}，性格：${world.charPersonality || '活泼开朗'}，粉丝数${tiers.totalFollowers}。${npcNames}
请生成1-2条粉丝发来的新私信。${charReplyBlock}
\`\`\`json
{"dms":[{"npcName":"粉丝名","npcPersonality":"性格","content":"私信内容"}]${needCharReply.length > 0 ? ',"char_replies":[{"dmIndex":0,"content":"CHAR的回复"}]' : ''}}
\`\`\`
只输出JSON，不要其他文字。内容自然，中文。`;
    const result = await callLLM(prompt, 0.85);
    const data = parseJSON(result);
    if (data) {
      const now = Date.now();
      let updatedDmList = getDmList();
      // 新私信
      if (data.dms && Array.isArray(data.dms)) {
        data.dms.forEach(dm => {
          const npc = getOrCreateNpc(dm.npcName, dm.npcPersonality, 'fan', '粉丝');
          const existing = updatedDmList.find(d => d.npcId === npc.id);
          if (existing) {
            existing.messages.push({ id: 'msg_' + now, senderType: 'npc', content: dm.content, createdAt: now });
            existing.lastMessageAt = now;
          } else {
            updatedDmList.push({
              id: 'dm_' + now + '_' + Math.random().toString(36).substr(2, 3),
              npcId: npc.id, npcName: npc.name, npcAvatar: npc.emoji, npcAvatarUrl: npc.avatarUrl,
              messages: [{ id: 'msg_' + now, senderType: 'npc', content: dm.content, createdAt: now }],
              lastMessageAt: now, pinned: false
            });
          }
        });
      }
      // CHAR回复未回复的对话
      if (data.char_replies && Array.isArray(data.char_replies)) {
        data.char_replies.forEach(cr => {
          const target = needCharReply[cr.dmIndex || 0];
          if (target) {
            const realDm = updatedDmList.find(d => d.id === target.id);
            if (realDm) {
              realDm.messages.push({ id: 'msg_' + now + '_cr', senderType: 'char', content: cr.content.trim(), createdAt: now });
              realDm.lastMessageAt = now;
            }
          }
        });
      }
      saveDmList(updatedDmList);
      pruneDms();
      renderDmInbox();
      toast('私信已刷新');
    } else { toast('生成失败，请重试'); }
  } catch (e) { toast('刷新失败: ' + e.message); }
  isRefreshing = false;
  hideLoading();
}


// ==================== 世界刷新引擎（首页） ====================
async function worldRefresh() {
  if (isRefreshing) return;
  isRefreshing = true;
  const world = getActiveWorld();
  if (!world) { isRefreshing = false; return; }
  showLoading('首页刷新中...');
  try {
    const prompt = buildFeedRefreshPrompt();
    const result = await callLLM(prompt, 0.85);
    const data = parseJSON(result);
    if (!data) { toast('生成失败，请重试'); isRefreshing = false; hideLoading(); return; }
    processFeedResult(data);
    updateActivitySummary();
    renderFeed();
    toast('首页已刷新');
  } catch (e) {
    console.error('worldRefresh error:', e);
    toast('刷新失败: ' + e.message);
  }
  isRefreshing = false;
  hideLoading();
}

function buildFeedRefreshPrompt() {
  const world = getActiveWorld();
  const trending = getTrending();
  const npcs = getNpcs();
  const tiers = getFanTiers();
  const posts = getPosts();
  const activeNpcs = npcs.slice(0, 8);

  const trendingSummary = trending.length > 0
    ? '当前热搜：' + trending.slice(0, 5).map(t => t.title).join('、')
    : '暂无热搜';

  const npcSummary = activeNpcs.length > 0
    ? '活跃NPC：' + activeNpcs.map(n => `${n.name}(${n.personality})`).join('、')
    : '';

  // 检查CHAR今天是否已发帖
  const charPostedToday = isDoneToday(wKey('last_char_post_date'));
  const charPostInstruction = charPostedToday
    ? '今天CHAR已经发过帖子了，不需要再生成char_posts和char_comments。'
    : '生成1条CHAR帖子（符合性格），0-2条CHAR对NPC/新闻的评论。';

  const chatMemory = (!charPostedToday && getChatMemoryForChar()) || '';
  const charMemoryBlock = chatMemory
    ? `\n## CHAR私聊记忆（仅用于生成CHAR的帖子和评论）\n${chatMemory}`
    : '';

  const milestone = !charPostedToday ? checkMilestone() : null;

  // 构建JSON模板
  let jsonFields = [
    '"news_posts": [{"authorName":"媒体名","content":"新闻内容","topicTitle":"#关联话题#或null"}]',
    '"npc_posts": [{"authorName":"NPC名","authorPersonality":"性格","identityType":"normal/influencer/fan/troll","content":"内容","topicTitle":null}]'
  ];
  if (!charPostedToday) {
    jsonFields.push('"char_posts": [{"content":"内容","isCouplePost":false,"mentionUser":false}]');
    jsonFields.push('"char_comments": [{"targetPostType":"npc/news","targetPostIndex":0,"content":"评论"}]');
  }
  if (milestone) {
    jsonFields.push('"milestone_post": {"content":"纪念日帖子内容"}');
  }
  const jsonTemplate = '{\n  ' + jsonFields.join(',\n  ') + '\n}';

  return `你是一个社交媒体世界模拟器。请为首页信息流生成新动态。

## 世界设定
- ${trendingSummary}
- ${npcSummary}

## CHAR设定
- CHAR名字：${world.charName}
- CHAR性格：${world.charPersonality || '活泼开朗'}
- CHAR的情侣：${world.userAccount.nickname}
- 粉丝数：${tiers.totalFollowers}
${charMemoryBlock}

## 生成要求
只生成首页信息流内容。新闻和NPC帖子独立于CHAR。
${charPostInstruction}
请严格按JSON格式输出：
\`\`\`json
${jsonTemplate}
\`\`\`
生成1-2条新闻、2-4条NPC帖子。${charPostInstruction}
帖子内容可以适当包含富媒体标签如[图片:自拍照][视频:vlog片段][音乐:歌名][位置:地点名]，不是每条都要有，自然穿插即可。
只输出JSON，不要其他文字。内容要自然生动，中文。`;
}

function makePost(npc, identityLabel, content, topicTitle, ts) {
  const trending = getTrending();
  let topicId = null;
  if (topicTitle) {
    const t = trending.find(x => x.title === topicTitle);
    if (t) topicId = t.id;
  }
  return {
    id: 'p_' + ts + '_' + Math.random().toString(36).substr(2, 4),
    authorType: 'npc', authorId: npc.id,
    authorName: npc.name, authorAvatar: npc.emoji,
    authorAvatarUrl: npc.avatarUrl, authorIdentity: identityLabel,
    content, topicId, topicTitle: topicTitle || null,
    isCouplePost: false, likes: Math.floor(Math.random() * 30 + 2),
    userLiked: false, comments: [], createdAt: ts + Math.random() * 2000
  };
}

// ==================== 分享帖子到聊天 ====================
function shareToChat(postId) {
  const world = getActiveWorld();
  if (!world) return;
  const posts = getPosts();
  const p = posts.find(x => x.id === postId);
  if (!p) return;

  // 写入共享队列
  const shareData = {
    id: 'share_' + Date.now(),
    charId: String(world.charId),
    postAuthor: p.authorName,
    postIdentity: p.authorIdentity || '',
    postContent: p.content,
    postTopic: p.topicTitle || null,
    timestamp: Date.now()
  };
  localStorage.setItem('couple_twitter_share_to_chat', JSON.stringify(shareData));

  toast('已分享，正在跳转到聊天...');
  setTimeout(() => {
    // 跳转到聊天页面
    window.location.href = `message.html?openChat=${encodeURIComponent(world.charId)}`;
  }, 500);
}

// ==================== 跨应用记忆桥接 ====================

// 世界微博 → 聊天：生成CHAR活动摘要供聊天页面读取
function updateActivitySummary() {
  const world = getActiveWorld();
  if (!world) return;
  const posts = getPosts();
  const tiers = getFanTiers();
  const cpProfile = getCoupleProfile();
  const daysTogether = Math.floor((Date.now() - (cpProfile.pairDate || world.pairDate || world.createdAt)) / 86400000);

  // 只提取CHAR相关的活动
  const charPosts = posts.filter(p => p.authorType === 'char').slice(0, 5);
  const charPostLines = charPosts.map(p => {
    const time = new Date(p.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    return `- ${p.content.substring(0, 50)} (${time})`;
  });

  // CHAR收到的评论（别人对CHAR帖子的评论）
  const charReceivedComments = [];
  charPosts.forEach(p => {
    (p.comments || []).filter(c => c.authorType !== 'char').slice(0, 2).forEach(c => {
      charReceivedComments.push(`${c.authorName}评论了：${c.content.substring(0, 30)}`);
    });
  });

  // CHAR发出的评论（CHAR对别人帖子的评论）
  const charComments = [];
  posts.filter(p => p.authorType !== 'char').forEach(p => {
    (p.comments || []).filter(c => c.authorType === 'char').slice(0, 1).forEach(c => {
      charComments.push(`评论了${p.authorName}的帖子：${c.content.substring(0, 30)}`);
    });
  });

  let summary = `[${world.charName}的微博动态] `;
  summary += `粉丝${tiers.totalFollowers}(铁粉${tiers.loyal}/路人粉${tiers.casual}/黑粉${tiers.anti})，和${world.userAccount.nickname}在一起${daysTogether}天。\n`;
  if (charPostLines.length) summary += `最近发帖：\n${charPostLines.join('\n')}\n`;
  if (charComments.length) summary += `最近评论：${charComments.slice(0, 3).join('；')}\n`;
  if (charReceivedComments.length) summary += `收到的评论：${charReceivedComments.slice(0, 3).join('；')}`;

  if (summary.length > 300) summary = summary.substring(0, 297) + '...';
  localStorage.setItem(`couple_twitter_activity_${world.charId}`, summary);
}

// 聊天 → 世界微博：读取聊天structured memory，只在CHAR生成帖子/评论时使用
function getChatMemoryForChar() {
  const world = getActiveWorld();
  if (!world) return '';
  try {
    const contacts = getS('vibe_contacts', []);
    const contact = contacts.find(c => String(c.id) === String(world.charId));
    if (!contact || !contact.structuredMemory) return '';
    const memory = contact.structuredMemory;
    if (!memory.entries || memory.entries.length === 0) return '';
    const recent = memory.entries.slice(-10);
    const lines = recent.map(e => `- [${e.category || ''}] ${e.text}`);
    return lines.join('\n');
  } catch (e) {
    return '';
  }
}

// ==================== 模态框与UI辅助 ====================
function showModal(name) {
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById(name + 'Modal').style.display = 'flex';
}

function closeModal(name) {
  document.getElementById(name + 'Modal').style.display = 'none';
  document.getElementById('modalOverlay').style.display = 'none';
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  document.getElementById('modalOverlay').style.display = 'none';
}

function showLoading(text) {
  const el = document.getElementById('loadingOverlay');
  el.querySelector('.loading-text').textContent = text || '加载中...';
  el.style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

let toastTimer = null;
function toast(msg) {
  let el = document.getElementById('toastEl');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toastEl';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}
