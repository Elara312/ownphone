// ==================== 网易云音乐 App ====================

// 工具函数
function getS(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } }
function setS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// 网易云API配置 - 支持自建API或公开代理
const NETEASE_API_DEFAULT = '';
const PUBLIC_PROXIES = [
    'https://enhanced-xi.vercel.app'
];
// CORS代理列表（用于直接调用网易云官方接口）
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
];
let activeProxy = null; // 缓存可用的代理

function getNeteaseApi() {
    return localStorage.getItem('netease_api_url') || '';
}

// 状态
let currentCharId = null;
let currentPlaylistId = null;
let playQueue = [];
let playIndex = -1;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0=off, 1=all, 2=one
let audio = new Audio();
let listenSession = null; // 一起听会话
let ltCommentTimer = null;
let neteaseLoginStatus = null; // 登录状态
let neteaseCookie = localStorage.getItem('netease_cookie') || ''; // 持久化登录cookie

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCharList();
    setupAudioEvents();
    checkNeteaseLogin();
    loadApiUrlInput();
});

function loadCharList() {
    const contacts = getS('vibe_contacts', []);
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
    renderAll();
}

function renderAll() {
    renderDiscoverPage();
    renderCharPlaylists();
    renderShares();
}

// ==================== API 配置 ====================
function getApiConfig() {
    const contacts = getS('vibe_contacts', []);
    for (const c of contacts) {
        if (c.apiScheme) {
            const schemes = getS('vibe_api_schemes', []);
            const scheme = schemes.find(s => s.id === c.apiScheme);
            if (scheme && scheme.apiUrl && scheme.apiKey) {
                return { apiUrl: scheme.apiUrl, apiKey: scheme.apiKey, model: scheme.model };
            }
        }
    }
    return {
        apiUrl: localStorage.getItem('apiUrl'),
        apiKey: localStorage.getItem('apiKey'),
        model: localStorage.getItem('selectedModel')
    };
}

async function callLLM(prompt, temperature, systemPrompt) {
    const { apiUrl, apiKey, model } = getApiConfig();
    if (!apiUrl || !apiKey) throw new Error('请先在消息app中配置API方案');
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });
    const resp = await fetch(`${apiUrl}/chat/completions`.replace(/([^:]\/)\/+/g, '$1'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, temperature: temperature || 0.7 })
    });
    if (!resp.ok) throw new Error(`API错误: ${resp.status}`);
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || '';
}

function getCharInfo(charId) {
    const contacts = getS('vibe_contacts', []);
    const c = contacts.find(x => String(x.id) === String(charId));
    if (!c) return null;
    return {
        id: c.id,
        name: c.nickname || c.name || 'CHAR',
        personality: c.personality || '',
        avatar: c.avatar || '🎭'
    };
}

// ==================== 网易云API（多源容错） ====================

// 带超时的fetch
async function fetchWithTimeout(url, opts = {}, ms = 8000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);
    opts.signal = controller.signal;
    try {
        const resp = await fetch(url, opts);
        clearTimeout(timeout);
        return resp;
    } catch (e) {
        clearTimeout(timeout);
        throw e;
    }
}

// 尝试用指定base调用API
async function tryNeteaseCall(base, path, params = {}) {
    params.realIP = params.realIP || '116.25.146.177';
    // 附带持久化的cookie（Vercel无状态，需要每次传cookie）
    if (neteaseCookie && !params.cookie) {
        params.cookie = neteaseCookie;
    }
    const qs = new URLSearchParams(params).toString();
    const url = `${base}${path}${qs ? '?' + qs : ''}`;
    const resp = await fetchWithTimeout(url, { mode: 'cors' });
    if (!resp.ok) throw new Error(`${resp.status}`);
    return resp.json();
}

// 核心请求函数：先试用户自建API，再试CORS代理直连网易云
async function neteaseGet(path, params = {}) {
    // 1. 用户自建API优先
    const userApi = getNeteaseApi();
    if (userApi) {
        try {
            return await tryNeteaseCall(userApi, path, params);
        } catch (e) {
            console.warn('自建API失败:', e.message);
        }
    }
    // 2. 已缓存的可用代理
    if (activeProxy) {
        try {
            return await tryNeteaseCall(activeProxy, path, params);
        } catch {
            activeProxy = null;
        }
    }
    // 3. 遍历公开NeteaseCloudMusicApi实例
    for (const proxy of PUBLIC_PROXIES) {
        try {
            const data = await tryNeteaseCall(proxy, path, params);
            activeProxy = proxy;
            console.log('使用公开API:', proxy);
            return data;
        } catch { continue; }
    }
    throw new Error('音乐API不可用，请在设置中配置API地址');
}

// ==================== 搜索/播放 fallback ====================
// 当NeteaseCloudMusicApi完全不可用时，用CORS代理直接调网易云Web接口
async function corsProxyFetch(targetUrl) {
    for (const proxy of CORS_PROXIES) {
        try {
            const resp = await fetchWithTimeout(proxy + encodeURIComponent(targetUrl));
            if (resp.ok) return resp.json();
        } catch { continue; }
    }
    // 最后直接试（可能CORS会拦，但试试）
    const resp = await fetchWithTimeout(targetUrl);
    if (resp.ok) return resp.json();
    throw new Error('请求失败');
}

// 网易云Web端搜索接口（不需要NeteaseCloudMusicApi）
async function neteaseWebSearch(keyword, limit = 20) {
    const url = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(keyword)}&type=1&offset=0&limit=${limit}`;
    const data = await corsProxyFetch(url);
    return data.result?.songs || [];
}

// 网易云Web端获取歌曲URL（免费音质）
async function neteaseWebSongUrl(id) {
    const url = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    return url; // 这个URL可以直接播放（302重定向到真实地址）
}

// 搜索歌曲（带fallback）
async function neteaseSearch(keyword, limit = 20) {
    // 先试NeteaseCloudMusicApi
    try {
        const data = await neteaseGet('/search', { keywords: keyword, limit });
        return data.result?.songs || [];
    } catch {
        // fallback: 直接调网易云Web接口
        try {
            return await neteaseWebSearch(keyword, limit);
        } catch (e) {
            console.warn('搜索失败:', e.message);
            return [];
        }
    }
}

// 获取歌曲播放URL（带fallback）
async function neteaseGetSongUrl(id) {
    // 先试NeteaseCloudMusicApi（可能有VIP音质）
    try {
        const data = await neteaseGet('/song/url', { id, br: 320000 });
        const urlInfo = data.data?.[0];
        if (urlInfo?.url) return urlInfo.url;
    } catch {}
    // fallback: 网易云直链（免费音质，部分歌曲可用）
    return await neteaseWebSongUrl(id);
}

// 获取歌曲详情（封面等）
async function neteaseGetSongDetail(ids) {
    const data = await neteaseGet('/song/detail', { ids: ids.join(',') });
    return data.songs || [];
}

// 获取歌词
async function neteaseGetLyric(id) {
    const data = await neteaseGet('/lyric', { id });
    return data.lrc?.lyric || '';
}

// 检查登录状态
async function checkNeteaseLogin() {
    // 有cookie时，用任何可用的API检查登录状态
    if (neteaseCookie) {
        try {
            const data = await neteaseGet('/login/status', { timestamp: Date.now() });
            const profile = data.data?.profile;
            if (profile) {
                neteaseLoginStatus = profile;
                updateLoginUI(true, profile.nickname);
                return;
            } else {
                // cookie过期了，清除
                neteaseCookie = '';
                localStorage.removeItem('netease_cookie');
                console.log('登录cookie已过期，需要重新扫码');
            }
        } catch {
            // cookie可能过期
        }
    }

    const userApi = getNeteaseApi();
    if (!userApi) {
        // 没有自建API时，检查公开代理是否可用
        updateLoginUI(false);
        try {
            await neteaseGet('/search', { keywords: 'test', limit: 1 });
            updateLoginUI(false, null, true); // API可用但未登录
        } catch {
            console.log('正在寻找可用的音乐API...');
        }
        return;
    }
    try {
        const data = await tryNeteaseCall(userApi, '/login/status', {});
        const profile = data.data?.profile;
        if (profile) {
            neteaseLoginStatus = profile;
            updateLoginUI(true, profile.nickname);
        } else {
            updateLoginUI(false);
        }
    } catch {
        updateLoginUI(false);
    }
}

function updateLoginUI(loggedIn, nickname, apiReady) {
    const btn = document.getElementById('loginStatusBtn');
    if (!btn) return;
    if (loggedIn) {
        btn.textContent = `🟢 ${nickname}`;
        btn.title = '已登录';
    } else if (apiReady) {
        btn.textContent = '🟡 可用';
        btn.title = '使用公开API（点击设置扫码登录获取VIP音质）';
    } else {
        btn.textContent = '⚙️ 设置';
        btn.title = '点击配置';
    }
    // 更新设置弹窗中的登录信息
    const loginInfoBox = document.getElementById('loginInfoBox');
    const loginInfoText = document.getElementById('loginInfoText');
    const qrLoginBtn = document.getElementById('qrLoginBtn');
    const qrStatus = document.getElementById('qrLoginStatus');
    if (loginInfoBox && loginInfoText) {
        if (loggedIn) {
            loginInfoBox.style.display = 'block';
            loginInfoText.textContent = `✅ 已登录：${nickname}（cookie已保存，刷新页面无需重新扫码）`;
            if (qrLoginBtn) qrLoginBtn.style.display = 'none';
            if (qrStatus) qrStatus.style.display = 'none';
        } else {
            loginInfoBox.style.display = 'none';
            if (qrLoginBtn) qrLoginBtn.style.display = '';
            if (qrStatus) qrStatus.style.display = '';
        }
    }
}

function loadApiUrlInput() {
    const input = document.getElementById('neteaseApiUrl');
    if (input) input.value = getNeteaseApi();
}

function logoutNetease() {
    neteaseCookie = '';
    localStorage.removeItem('netease_cookie');
    neteaseLoginStatus = null;
    updateLoginUI(false);
    const qrStatus = document.getElementById('qrLoginStatus');
    if (qrStatus) qrStatus.textContent = '已退出登录，点击下方按钮重新扫码';
    alert('已退出登录');
}

function saveNeteaseApiUrl() {
    const input = document.getElementById('neteaseApiUrl');
    if (!input) return;
    const url = input.value.trim().replace(/\/+$/, '');
    if (url) {
        localStorage.setItem('netease_api_url', url);
    } else {
        localStorage.removeItem('netease_api_url');
    }
    activeProxy = null; // 重置代理缓存
    alert(url ? 'API地址已保存' : '已切换为公开API模式');
    checkNeteaseLogin();
}

// 二维码登录流程
let qrLoginTimer = null;

async function startQrLogin() {
    const statusEl = document.getElementById('qrLoginStatus');
    const imgEl = document.getElementById('qrCodeImg');
    try {
        statusEl.textContent = '正在获取二维码...';
        // 1. 获取key
        const keyData = await neteaseGet('/login/qr/key', { timestamp: Date.now() });
        const key = keyData.data?.unikey;
        if (!key) throw new Error('获取key失败');

        // 2. 生成二维码
        const qrData = await neteaseGet('/login/qr/create', { key, qrimg: true, timestamp: Date.now() });
        const qrImg = qrData.data?.qrimg;
        if (qrImg) {
            imgEl.src = qrImg;
            imgEl.style.display = 'block';
        }
        statusEl.textContent = '请用网易云音乐APP扫码';

        // 3. 轮询检查状态
        if (qrLoginTimer) clearInterval(qrLoginTimer);
        qrLoginTimer = setInterval(async () => {
            try {
                const checkData = await neteaseGet('/login/qr/check', { key, timestamp: Date.now() });
                const code = checkData.code;
                if (code === 800) {
                    statusEl.textContent = '二维码已过期，请重新获取';
                    clearInterval(qrLoginTimer);
                    imgEl.style.display = 'none';
                } else if (code === 801) {
                    statusEl.textContent = '等待扫码...';
                } else if (code === 802) {
                    statusEl.textContent = '扫码成功，请在手机上确认';
                } else if (code === 803) {
                    statusEl.textContent = '✅ 登录成功！';
                    clearInterval(qrLoginTimer);
                    imgEl.style.display = 'none';
                    // 保存cookie到localStorage实现持久化登录
                    if (checkData.cookie) {
                        neteaseCookie = checkData.cookie;
                        localStorage.setItem('netease_cookie', checkData.cookie);
                        console.log('登录cookie已保存，下次无需重新扫码');
                    }
                    checkNeteaseLogin();
                    setTimeout(() => closeModal('settingsModal'), 1500);
                }
            } catch {
                // 忽略轮询错误
            }
        }, 2000);
    } catch (e) {
        statusEl.textContent = '获取二维码失败：' + e.message;
    }
}

// ==================== Tab 切换 ====================
function switchTab(tabId) {
    document.querySelectorAll('.music-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tabId));
}

// ==================== 歌单数据 ====================
function getPlaylists(charId) {
    return getS(`music_playlists_${charId}`, []);
}
function savePlaylists(charId, pls) {
    setS(`music_playlists_${charId}`, pls);
}

// ==================== 发现页 ====================
function renderDiscoverPage() {
    const grid = document.getElementById('allPlaylistsGrid');
    const contacts = getS('vibe_contacts', []);
    let allPls = [];
    contacts.forEach(c => {
        const pls = getPlaylists(c.id);
        pls.forEach(pl => allPls.push({ ...pl, charId: c.id, charName: c.nickname || c.name }));
    });
    if (allPls.length === 0) {
        grid.innerHTML = '<div class="empty-state">还没有歌单，去「歌单」页面让CHAR创建吧</div>';
        return;
    }
    grid.innerHTML = allPls.map(pl => `
        <div class="playlist-card" onclick="openPlaylistDetail('${pl.charId}','${pl.id}')">
            <div class="playlist-card-cover">${pl.cover || '🎵'}</div>
            <div class="playlist-card-info">
                <div class="playlist-card-name">${esc(pl.name)}</div>
                <div class="playlist-card-meta">${esc(pl.charName)} · ${pl.songs.length}首</div>
            </div>
        </div>
    `).join('');
}

// ==================== 歌单页 ====================
function renderCharPlaylists() {
    const container = document.getElementById('charPlaylists');
    if (!currentCharId) {
        container.innerHTML = '<div class="empty-state">选择CHAR后查看歌单</div>';
        return;
    }
    const pls = getPlaylists(currentCharId);
    if (pls.length === 0) {
        container.innerHTML = '<div class="empty-state">还没有歌单，点击上方按钮创建</div>';
        return;
    }
    container.innerHTML = pls.map(pl => `
        <div class="playlist-item" onclick="openPlaylistDetail('${currentCharId}','${pl.id}')">
            <div class="playlist-item-cover">${pl.cover || '🎵'}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-name">${esc(pl.name)}</div>
                <div class="playlist-item-count">${pl.songs.length}首 · ${pl.createdBy === 'char' ? 'AI生成' : '手动创建'}</div>
            </div>
        </div>
    `).join('');
}

// AI生成歌单
async function generatePlaylist() {
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    const char = getCharInfo(currentCharId);
    if (!char) return;

    const btn = document.querySelector('.playlist-header-bar .action-btn');
    const origText = btn.textContent;
    btn.textContent = '🤖 生成中...';
    btn.disabled = true;

    try {
        const sysPrompt = `你是${char.name}，性格特点：${char.personality || '温和友善'}。
请根据你的性格和喜好创建一个音乐歌单。返回严格JSON格式：
{
  "name": "歌单名称（要有个性，符合你的性格）",
  "description": "歌单描述（一两句话）",
  "cover": "一个代表歌单氛围的emoji",
  "songs": [
    {"name":"歌名","artist":"歌手","tags":["标签1","标签2"]}
  ]
}
要求：
1. 歌单包含8-12首歌，中英文歌曲都可以
2. 歌曲选择要符合你的性格和审美
3. 歌单名称要有创意，像真实用户会起的名字
4. 只返回JSON，不要其他文字`;

        const resp = await callLLM('请创建一个歌单', 0.85, sysPrompt);
        const jsonMatch = resp.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('AI返回格式错误');
        const plData = JSON.parse(jsonMatch[0]);

        const playlist = {
            id: 'pl_' + Date.now(),
            name: plData.name || `${char.name}的歌单`,
            description: plData.description || '',
            cover: plData.cover || '🎵',
            songs: (plData.songs || []).map((s, i) => ({
                id: 's_' + Date.now() + '_' + i,
                name: s.name,
                artist: s.artist,
                tags: s.tags || [],
                url: '',
                neteaseId: null
            })),
            createdAt: Date.now(),
            createdBy: 'char'
        };

        const pls = getPlaylists(currentCharId);
        pls.push(playlist);
        savePlaylists(currentCharId, pls);
        renderCharPlaylists();
        renderDiscoverPage();
        alert(`歌单「${playlist.name}」已创建，包含${playlist.songs.length}首歌\n正在后台匹配网易云歌曲...`);

        // 后台异步匹配网易云歌曲ID
        resolvePlaylistNeteaseIds(currentCharId, playlist.id);
    } catch (e) {
        alert('生成失败：' + e.message);
    } finally {
        btn.textContent = origText;
        btn.disabled = false;
    }
}

function createEmptyPlaylist() {
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    openModal('newPlaylistModal');
}

// 后台匹配歌单中歌曲的网易云ID
async function resolvePlaylistNeteaseIds(charId, plId) {
    const pls = getPlaylists(charId);
    const pl = pls.find(p => p.id === plId);
    if (!pl) return;
    let matched = 0;
    for (const song of pl.songs) {
        if (song.neteaseId) continue;
        try {
            const keyword = `${song.name} ${song.artist}`.trim();
            const results = await neteaseSearch(keyword, 1);
            if (results.length > 0) {
                song.neteaseId = results[0].id;
                song.id = 'ne_' + results[0].id;
                matched++;
            }
            // 避免请求太快
            await new Promise(r => setTimeout(r, 300));
        } catch { /* 忽略单首匹配失败 */ }
    }
    savePlaylists(charId, pls);
    if (matched > 0) {
        console.log(`歌单匹配完成：${matched}/${pl.songs.length}首已匹配到网易云`);
    }
}

function confirmCreatePlaylist() {
    const name = document.getElementById('newPlName').value.trim();
    if (!name) { alert('请输入歌单名称'); return; }
    const desc = document.getElementById('newPlDesc').value.trim();
    const playlist = {
        id: 'pl_' + Date.now(),
        name, description: desc, cover: '🎵', songs: [],
        createdAt: Date.now(), createdBy: 'user'
    };
    const pls = getPlaylists(currentCharId);
    pls.push(playlist);
    savePlaylists(currentCharId, pls);
    renderCharPlaylists();
    renderDiscoverPage();
    closeModal('newPlaylistModal');
    document.getElementById('newPlName').value = '';
    document.getElementById('newPlDesc').value = '';
}

// ==================== 歌单详情 ====================
function openPlaylistDetail(charId, plId) {
    currentPlaylistId = plId;
    const pls = getPlaylists(charId);
    const pl = pls.find(p => p.id === plId);
    if (!pl) return;

    document.getElementById('plDetailTitle').textContent = '歌单详情';
    document.getElementById('plDetailCover').textContent = pl.cover || '🎵';
    document.getElementById('plDetailName').textContent = pl.name;
    document.getElementById('plDetailDesc').textContent = pl.description || '暂无描述';

    const songsEl = document.getElementById('plDetailSongs');
    if (pl.songs.length === 0) {
        songsEl.innerHTML = '<div class="empty-state">歌单是空的，添加一些歌曲吧</div>';
    } else {
        songsEl.innerHTML = pl.songs.map((s, i) => {
            const playing = playQueue[playIndex] && playQueue[playIndex].id === s.id;
            return `<div class="song-item ${playing ? 'playing' : ''}" onclick="playSongFromPlaylist('${charId}','${plId}',${i})">
                <span class="song-index">${playing ? '♪' : (i + 1)}</span>
                <div class="song-info">
                    <div class="song-name">${esc(s.name)}</div>
                    <div class="song-artist-tag">${esc(s.artist)}${s.tags?.length ? ' · ' + s.tags.join('/') : ''}</div>
                </div>
                <button class="song-del" onclick="event.stopPropagation();removeSong('${charId}','${plId}','${s.id}')">✕</button>
            </div>`;
        }).join('');
    }
    // 存储当前查看的charId用于添加歌曲
    document.getElementById('playlistDetailModal').dataset.charId = charId;
    openModal('playlistDetailModal');
}

function playAllPlaylist() {
    const charId = document.getElementById('playlistDetailModal').dataset.charId;
    const pls = getPlaylists(charId);
    const pl = pls.find(p => p.id === currentPlaylistId);
    if (!pl || pl.songs.length === 0) { alert('歌单是空的'); return; }
    playQueue = [...pl.songs];
    playIndex = 0;
    startPlayback();
    closeModal('playlistDetailModal');
}

function playSongFromPlaylist(charId, plId, index) {
    const pls = getPlaylists(charId);
    const pl = pls.find(p => p.id === plId);
    if (!pl) return;
    playQueue = [...pl.songs];
    playIndex = index;
    startPlayback();
}

function addSongToPlaylist() {
    openModal('addSongModal');
}

function confirmAddSong() {
    const name = document.getElementById('addSongName').value.trim();
    const artist = document.getElementById('addSongArtist').value.trim();
    const url = document.getElementById('addSongUrl').value.trim();
    const tags = document.getElementById('addSongTags').value.trim().split(/[,，]/).filter(Boolean);
    if (!name) { alert('请输入歌曲名'); return; }

    const charId = document.getElementById('playlistDetailModal').dataset.charId;
    const pls = getPlaylists(charId);
    const pl = pls.find(p => p.id === currentPlaylistId);
    if (!pl) return;

    pl.songs.push({
        id: 's_' + Date.now(),
        name, artist: artist || '未知', tags, url: url || ''
    });
    savePlaylists(charId, pls);
    openPlaylistDetail(charId, currentPlaylistId);
    closeModal('addSongModal');
    document.getElementById('addSongName').value = '';
    document.getElementById('addSongArtist').value = '';
    document.getElementById('addSongUrl').value = '';
    document.getElementById('addSongTags').value = '';
}

function removeSong(charId, plId, songId) {
    if (!confirm('确定删除这首歌？')) return;
    const pls = getPlaylists(charId);
    const pl = pls.find(p => p.id === plId);
    if (!pl) return;
    pl.songs = pl.songs.filter(s => s.id !== songId);
    savePlaylists(charId, pls);
    openPlaylistDetail(charId, plId);
}

function deleteCurrentPlaylist() {
    if (!confirm('确定删除这个歌单？')) return;
    const charId = document.getElementById('playlistDetailModal').dataset.charId;
    let pls = getPlaylists(charId);
    pls = pls.filter(p => p.id !== currentPlaylistId);
    savePlaylists(charId, pls);
    closeModal('playlistDetailModal');
    renderCharPlaylists();
    renderDiscoverPage();
}

// ==================== 音乐播放器 ====================
function setupAudioEvents() {
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onSongEnd);
    audio.addEventListener('error', () => {
        console.warn('音频加载失败，尝试下一首');
        // 不自动跳下一首，让用户知道需要URL
    });
}

function startPlayback() {
    if (playIndex < 0 || playIndex >= playQueue.length) return;
    const song = playQueue[playIndex];
    updatePlayerUI(song);

    // 如果有网易云id但没有url，先获取url
    if (!song.url && song.neteaseId) {
        neteaseGetSongUrl(song.neteaseId).then(url => {
            if (url) {
                song.url = url;
                playAudioUrl(url);
            } else {
                console.warn('无法获取播放链接，可能需要VIP');
                isPlaying = false;
                updatePlayIcons();
            }
        }).catch(e => {
            console.warn('获取播放链接失败:', e);
            isPlaying = false;
            updatePlayIcons();
        });
        return;
    }

    if (song.url) {
        playAudioUrl(song.url);
    } else {
        // 没有URL也没有neteaseId，尝试通过歌名搜索
        autoSearchAndPlay(song);
    }
}

function playAudioUrl(url) {
    audio.src = url;
    audio.play().then(() => {
        isPlaying = true;
        updatePlayIcons();
    }).catch(e => {
        console.warn('播放失败:', e);
        isPlaying = false;
        updatePlayIcons();
    });
}

// 自动搜索歌名获取播放链接
async function autoSearchAndPlay(song) {
    try {
        const keyword = `${song.name} ${song.artist}`.trim();
        const results = await neteaseSearch(keyword, 1);
        if (results.length > 0) {
            const nId = results[0].id;
            song.neteaseId = nId;
            const url = await neteaseGetSongUrl(nId);
            if (url) {
                song.url = url;
                playAudioUrl(url);
                return;
            }
        }
        console.warn('自动搜索未找到可播放链接');
        isPlaying = false;
        updatePlayIcons();
    } catch (e) {
        console.warn('自动搜索失败:', e);
        isPlaying = false;
        updatePlayIcons();
    }
}

function togglePlay() {
    if (playQueue.length === 0) return;
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        if (audio.src) {
            audio.play().catch(() => {});
            isPlaying = true;
        } else if (playIndex >= 0) {
            startPlayback();
            return;
        }
    }
    updatePlayIcons();
}

function playNext() {
    if (playQueue.length === 0) return;
    if (isShuffle) {
        playIndex = Math.floor(Math.random() * playQueue.length);
    } else {
        playIndex = (playIndex + 1) % playQueue.length;
    }
    startPlayback();
}

function playPrev() {
    if (playQueue.length === 0) return;
    playIndex = (playIndex - 1 + playQueue.length) % playQueue.length;
    startPlayback();
}

function onTimeUpdate() {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('miniProgressFill').style.width = pct + '%';
    document.getElementById('fpProgress').value = pct;
    document.getElementById('fpCurrentTime').textContent = fmtTime(audio.currentTime);
    document.getElementById('fpDuration').textContent = fmtTime(audio.duration);
    // 一起听进度
    if (listenSession) {
        document.getElementById('ltProgressFill').style.width = pct + '%';
    }
}

function onSongEnd() {
    if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play();
        return;
    }
    playNext();
}

function seekTo(val) {
    if (audio.duration) {
        audio.currentTime = (val / 100) * audio.duration;
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffleIcon').style.opacity = isShuffle ? '1' : '0.4';
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    const icon = document.getElementById('repeatIcon');
    icon.textContent = repeatMode === 2 ? '🔂' : '🔁';
    icon.style.opacity = repeatMode === 0 ? '0.4' : '1';
}

function updatePlayerUI(song) {
    document.getElementById('miniSongName').textContent = song.name;
    document.getElementById('miniArtist').textContent = song.artist;
    document.getElementById('fpSongName').textContent = song.name;
    document.getElementById('fpArtist').textContent = song.artist;
    // 旋转唱片
    const art = document.getElementById('fpAlbumArt');
    art.classList.toggle('spinning', isPlaying);
}

function updatePlayIcons() {
    const icon = isPlaying ? '⏸' : '▶';
    document.getElementById('miniPlayIcon').textContent = icon;
    document.getElementById('fpPlayIcon').textContent = icon;
    document.getElementById('fpAlbumArt').classList.toggle('spinning', isPlaying);
}

function fmtTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

// 全屏播放器
function openFullPlayer(e) {
    document.getElementById('fullPlayer').classList.add('active');
}
function closeFullPlayer() {
    document.getElementById('fullPlayer').classList.remove('active');
}

// 播放队列
function openPlayQueue() {
    const list = document.getElementById('playQueueList');
    if (playQueue.length === 0) {
        list.innerHTML = '<div class="empty-state">播放列表为空</div>';
    } else {
        list.innerHTML = playQueue.map((s, i) => `
            <div class="song-item ${i === playIndex ? 'playing' : ''}" onclick="playIndex=${i};startPlayback();closeModal('playQueueModal');">
                <span class="song-index">${i === playIndex ? '♪' : (i + 1)}</span>
                <div class="song-info">
                    <div class="song-name">${esc(s.name)}</div>
                    <div class="song-artist-tag">${esc(s.artist)}</div>
                </div>
            </div>
        `).join('');
    }
    openModal('playQueueModal');
}

// ==================== 搜索音乐 ====================
function openMusicSearch() {
    openModal('searchModal');
    document.getElementById('musicSearchInput').focus();
}

async function searchMusic() {
    const keyword = document.getElementById('musicSearchInput').value.trim();
    if (!keyword) return;
    const resultsEl = document.getElementById('searchResults');

    // 检查是否是直接URL
    if (keyword.match(/^https?:\/\/.+/i)) {
        resultsEl.innerHTML = `
            <div class="search-result-item" onclick="playDirectUrl('${esc(keyword)}')">
                <span class="sr-icon">🔗</span>
                <div class="sr-info">
                    <div class="sr-name">直接播放URL</div>
                    <div class="sr-artist">${esc(keyword.substring(0, 50))}...</div>
                </div>
                <div class="sr-actions">
                    <button class="sr-btn" onclick="event.stopPropagation();playDirectUrl('${esc(keyword)}')">▶ 播放</button>
                </div>
            </div>`;
        return;
    }

    resultsEl.innerHTML = '<div class="empty-state"><span class="loading-spinner"></span> 搜索中...</div>';

    try {
        const songs = await neteaseSearch(keyword);
        if (songs.length === 0) {
            resultsEl.innerHTML = '<div class="empty-state">未找到结果</div>';
            return;
        }
        resultsEl.innerHTML = songs.map(s => {
            const artists = (s.artists || []).map(a => a.name).join('/');
            const album = s.album?.name || '';
            const duration = s.duration ? fmtTime(s.duration / 1000) : '';
            return `<div class="search-result-item">
                <span class="sr-icon">🎵</span>
                <div class="sr-info">
                    <div class="sr-name">${esc(s.name)}</div>
                    <div class="sr-artist">${esc(artists)}${album ? ' · ' + esc(album) : ''}${duration ? ' · ' + duration : ''}</div>
                </div>
                <div class="sr-actions">
                    <button class="sr-btn" onclick="event.stopPropagation();playNeteaseById(${s.id},'${esc(s.name)}','${esc(artists)}')">▶</button>
                    <button class="sr-btn" onclick="event.stopPropagation();addNeteaseToPlaylist(${s.id},'${esc(s.name)}','${esc(artists)}')">➕</button>
                </div>
            </div>`;
        }).join('');
    } catch (e) {
        resultsEl.innerHTML = `<div class="empty-state">搜索失败：${esc(e.message)}<br>请确认网易云API服务已启动</div>`;
    }
}

// 播放网易云歌曲（通过id获取URL）
async function playNeteaseById(id, name, artist) {
    try {
        const url = await neteaseGetSongUrl(id);
        if (!url) {
            alert('无法获取播放链接，可能需要VIP或登录');
            return;
        }
        const song = { id: 'ne_' + id, neteaseId: id, name, artist, tags: [], url };
        playQueue.push(song);
        playIndex = playQueue.length - 1;
        startPlayback();
        closeModal('searchModal');
    } catch (e) {
        alert('获取播放链接失败：' + e.message);
    }
}

// 添加网易云歌曲到歌单
async function addNeteaseToPlaylist(id, name, artist) {
    if (!currentCharId || !currentPlaylistId) {
        alert('请先打开一个歌单');
        return;
    }
    const pls = getPlaylists(currentCharId);
    const pl = pls.find(p => p.id === currentPlaylistId);
    if (!pl) { alert('请先打开一个歌单'); return; }
    pl.songs.push({ id: 'ne_' + id, neteaseId: id, name, artist, tags: [], url: '' });
    savePlaylists(currentCharId, pls);
    alert(`已添加「${name}」到歌单`);
}

function playDirectUrl(url) {
    const song = { id: 's_' + Date.now(), name: '在线音乐', artist: '', tags: [], url };
    playQueue = [song];
    playIndex = 0;
    startPlayback();
    closeModal('searchModal');
}

// ==================== CHAR分享 ====================
function getShares(charId) {
    return getS(`music_shares_${charId}`, []);
}
function saveShares(charId, shares) {
    setS(`music_shares_${charId}`, shares);
}

function renderShares() {
    const container = document.getElementById('sharesList');
    if (!currentCharId) {
        container.innerHTML = '<div class="empty-state">选择CHAR后查看分享</div>';
        return;
    }
    const shares = getShares(currentCharId);
    const char = getCharInfo(currentCharId);
    if (shares.length === 0) {
        container.innerHTML = '<div class="empty-state">还没有分享记录，点击上方按钮让TA分享</div>';
        return;
    }
    container.innerHTML = shares.slice().reverse().map(sh => `
        <div class="share-card">
            <div class="share-card-header">
                <div class="share-avatar">${char?.avatar || '🎭'}</div>
                <div>
                    <div class="share-char-name">${esc(char?.name || 'CHAR')}</div>
                    <div class="share-time">${new Date(sh.timestamp).toLocaleString('zh-CN')}</div>
                </div>
            </div>
            <div class="share-message">${esc(sh.message)}</div>
            <div class="share-song-card" onclick="playSharedSong('${esc(sh.song.name)}','${esc(sh.song.artist)}','${esc(sh.song.url || '')}')">
                <span class="share-song-icon">🎵</span>
                <div class="share-song-info">
                    <div class="share-song-name">${esc(sh.song.name)}</div>
                    <div class="share-song-artist">${esc(sh.song.artist)}</div>
                </div>
                <button class="share-play-btn">▶</button>
            </div>
        </div>
    `).join('');
}

async function generateShare() {
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    const char = getCharInfo(currentCharId);
    if (!char) return;

    const btn = document.querySelector('.shares-toolbar .action-btn');
    const origText = btn.textContent;
    btn.textContent = '🎁 生成中...';
    btn.disabled = true;

    try {
        const sysPrompt = `你是${char.name}，性格特点：${char.personality || '温和友善'}。
你想分享一首歌给你喜欢的人。请返回严格JSON格式：
{
  "song": {"name":"歌名","artist":"歌手"},
  "message": "分享语（1-3句话，要符合你的性格，可以说为什么想分享这首歌）"
}
要求：
1. 选一首真实存在的歌曲
2. 分享语要自然、有感情，符合你的性格
3. 只返回JSON`;

        const resp = await callLLM('分享一首歌给我吧', 0.85, sysPrompt);
        const jsonMatch = resp.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('格式错误');
        const shareData = JSON.parse(jsonMatch[0]);

        const share = {
            id: 'sh_' + Date.now(),
            song: { name: shareData.song?.name || '未知歌曲', artist: shareData.song?.artist || '未知', url: '', neteaseId: null },
            message: shareData.message || '分享给你这首歌~',
            timestamp: Date.now()
        };

        // 尝试匹配网易云ID
        try {
            const keyword = `${share.song.name} ${share.song.artist}`.trim();
            const results = await neteaseSearch(keyword, 1);
            if (results.length > 0) {
                share.song.neteaseId = results[0].id;
            }
        } catch { /* 忽略匹配失败 */ }

        const shares = getShares(currentCharId);
        shares.push(share);
        saveShares(currentCharId, shares);
        renderShares();
    } catch (e) {
        alert('分享生成失败：' + e.message);
    } finally {
        btn.textContent = origText;
        btn.disabled = false;
    }
}

function playSharedSong(name, artist, url) {
    const song = { id: 's_' + Date.now(), name, artist, tags: [], url: url || '' };
    // 尝试从分享记录中找到neteaseId
    if (currentCharId) {
        const shares = getShares(currentCharId);
        const sh = shares.find(s => s.song.name === name && s.song.artist === artist);
        if (sh?.song?.neteaseId) {
            song.neteaseId = sh.song.neteaseId;
            song.id = 'ne_' + sh.song.neteaseId;
        }
    }
    playQueue.push(song);
    playIndex = playQueue.length - 1;
    startPlayback();
}

function shareCurrentSong() {
    if (playQueue.length === 0 || playIndex < 0) { alert('当前没有播放歌曲'); return; }
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    const song = playQueue[playIndex];
    // 直接保存为用户分享给CHAR（反向分享）
    alert(`已将「${song.name}」分享给CHAR`);
}

// ==================== 一起听 ====================
async function inviteListenTogether() {
    if (!currentCharId) { alert('请先选择CHAR'); return; }
    if (playQueue.length === 0 || playIndex < 0) { alert('请先播放一首歌'); return; }

    const char = getCharInfo(currentCharId);
    if (!char) return;
    const song = playQueue[playIndex];

    // AI判断是否接受邀请
    try {
        const hour = new Date().getHours();
        let timeDesc = '白天';
        if (hour < 6) timeDesc = '凌晨';
        else if (hour < 9) timeDesc = '早上';
        else if (hour < 12) timeDesc = '上午';
        else if (hour < 14) timeDesc = '中午';
        else if (hour < 18) timeDesc = '下午';
        else if (hour < 22) timeDesc = '晚上';
        else timeDesc = '深夜';

        const sysPrompt = `你是${char.name}，性格特点：${char.personality || '温和友善'}。
现在是${timeDesc}，用户邀请你一起听「${song.name}」（${song.artist}）。
根据你的性格和当前时间，决定是否接受。返回JSON：
{"accept":true或false,"reply":"你的回复（1-2句话，口语化）"}
注意：大部分情况下你会接受，除非你的性格设定中有特别的原因（比如正在忙、不喜欢这类音乐等）。只返回JSON。`;

        const resp = await callLLM('一起听歌吧', 0.7, sysPrompt);
        const jsonMatch = resp.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('格式错误');
        const result = JSON.parse(jsonMatch[0]);

        if (!result.accept) {
            alert(`${char.name}：${result.reply || '现在不太方便...'}`);
            return;
        }

        // 接受邀请，开始一起听
        startListenTogether(char, song, result.reply);
    } catch (e) {
        // 如果AI调用失败，默认接受
        startListenTogether(char, song, '好呀，一起听~');
    }
}

function startListenTogether(char, song, greeting) {
    listenSession = {
        charId: char.id,
        charName: char.name,
        charPersonality: char.personality,
        song: song,
        startTime: Date.now(),
        comments: [],
        active: true
    };

    // 更新UI
    document.getElementById('ltCharAvatar').textContent = char.avatar || '🎭';
    document.getElementById('ltSongName').textContent = song.name;
    document.getElementById('ltArtist').textContent = song.artist;
    document.getElementById('ltComments').innerHTML = '';

    // 显示覆盖层
    document.getElementById('listenTogetherOverlay').classList.add('active');
    closeFullPlayer();

    // 添加CHAR的问候
    addLtComment('char', char.name, greeting);

    // 启动定时感想
    startCommentTimer();
}

function startCommentTimer() {
    if (ltCommentTimer) clearInterval(ltCommentTimer);
    // 每30-60秒生成一条感想
    const interval = 30000 + Math.random() * 30000;
    ltCommentTimer = setInterval(() => {
        if (listenSession && listenSession.active) {
            generateLtComment();
        }
    }, interval);
}

async function generateLtComment() {
    if (!listenSession) return;
    const { charName, charPersonality, song, comments } = listenSession;

    // 最近几条对话作为上下文
    const recentComments = comments.slice(-5).map(c =>
        `${c.from === 'char' ? charName : '用户'}：${c.text}`
    ).join('\n');

    try {
        const sysPrompt = `你是${charName}，性格：${charPersonality || '温和'}。
你正在和用户一起听「${song.name}」（${song.artist}）。
${recentComments ? '最近的对话：\n' + recentComments + '\n' : ''}
请发表一句简短的感想或评论（10-30字），要自然口语化，符合你的性格。
可以评论歌曲、分享感受、或者和用户互动。
只返回你要说的话，不要引号或其他格式。`;

        const comment = await callLLM('发表感想', 0.85, sysPrompt);
        if (comment && listenSession) {
            addLtComment('char', charName, comment.trim().replace(/^["「]|["」]$/g, ''));
        }
    } catch (e) {
        console.warn('生成感想失败:', e);
    }
}

function addLtComment(from, name, text) {
    if (!listenSession) return;
    listenSession.comments.push({ from, name, text, time: Date.now() });

    const container = document.getElementById('ltComments');
    const div = document.createElement('div');
    div.className = `lt-comment ${from}`;
    div.innerHTML = `<div class="lt-comment-name">${esc(name)}</div>${esc(text)}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function sendLtMessage() {
    const input = document.getElementById('ltInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    addLtComment('user', '我', text);

    // 用户发消息后，CHAR立即回应
    setTimeout(() => generateLtComment(), 1500);
}

function endListenTogether() {
    if (ltCommentTimer) {
        clearInterval(ltCommentTimer);
        ltCommentTimer = null;
    }
    listenSession = null;
    document.getElementById('listenTogetherOverlay').classList.remove('active');
}

// ==================== 弹窗管理 ====================
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ==================== 工具 ====================
function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
