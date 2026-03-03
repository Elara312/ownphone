// 预设头像库（Ins 风格）
const presetAvatars = [
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23667eea"/><stop offset="100%" style="stop-color:%23764ba2"/></linearGradient></defs><rect fill="url(%23g1)" width="200" height="200"/><circle cx="100" cy="100" r="60" fill="none" stroke="white" stroke-width="3"/><circle cx="100" cy="100" r="40" fill="none" stroke="white" stroke-width="3"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f093fb"/><stop offset="100%" style="stop-color:%234facfe"/></linearGradient></defs><rect fill="url(%23g2)" width="200" height="200"/><path d="M50 100 Q100 50 150 100 T250 100" fill="none" stroke="white" stroke-width="4"/><path d="M50 120 Q100 70 150 120 T250 120" fill="none" stroke="white" stroke-width="4"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23fa709a"/><stop offset="100%" style="stop-color:%23fee140"/></linearGradient></defs><rect fill="url(%23g3)" width="200" height="200"/><circle cx="100" cy="80" r="30" fill="white" opacity="0.8"/><path d="M70 120 Q100 150 130 120" fill="white" opacity="0.8"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2330cfd0"/><stop offset="100%" style="stop-color:%23330867"/></linearGradient></defs><rect fill="url(%23g4)" width="200" height="200"/><rect x="60" y="60" width="80" height="80" fill="none" stroke="white" stroke-width="3" rx="10"/><circle cx="100" cy="100" r="25" fill="white" opacity="0.6"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23a8edea"/><stop offset="100%" style="stop-color:%23fed6e3"/></linearGradient></defs><rect fill="url(%23g5)" width="200" height="200"/><polygon points="100,40 130,90 170,100 130,110 100,160 70,110 30,100 70,90" fill="white" opacity="0.8"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23ff9a9e"/><stop offset="100%" style="stop-color:%23fecfef"/></linearGradient></defs><rect fill="url(%23g6)" width="200" height="200"/><path d="M100 50 L120 90 L160 90 L130 115 L145 155 L100 130 L55 155 L70 115 L40 90 L80 90 Z" fill="white" opacity="0.8"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23ffecd2"/><stop offset="100%" style="stop-color:%23fcb69f"/></linearGradient></defs><rect fill="url(%23g7)" width="200" height="200"/><circle cx="70" cy="70" r="20" fill="white" opacity="0.7"/><circle cx="130" cy="70" r="20" fill="white" opacity="0.7"/><circle cx="100" cy="130" r="25" fill="white" opacity="0.7"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23ff6e7f"/><stop offset="100%" style="stop-color:%23bfe9ff"/></linearGradient></defs><rect fill="url(%23g8)" width="200" height="200"/><path d="M100 40 L100 160 M40 100 L160 100" stroke="white" stroke-width="4" opacity="0.8"/><circle cx="100" cy="100" r="35" fill="none" stroke="white" stroke-width="4" opacity="0.8"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g9" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23e0c3fc"/><stop offset="100%" style="stop-color:%238ec5fc"/></linearGradient></defs><rect fill="url(%23g9)" width="200" height="200"/><rect x="50" y="50" width="100" height="100" fill="none" stroke="white" stroke-width="3" rx="20" opacity="0.8"/><circle cx="100" cy="100" r="30" fill="white" opacity="0.5"/></svg>'
];

// 标签颜色
const tagColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
];

// 全局数据结构
let vibeProfilesList = [];
let currentProfileId = null;
let sharedAvatars = []; // 共享头像库

// 提示词管理系统
let promptSchemes = {}; // 所有提示词方案
let currentPromptSchemeId = 'default'; // 当前使用的方案ID

// 初始化
async function init() {
    loadAllProfiles();
    loadSharedAvatars();
    updateMainPage();
    applyWallpaperColor();
    await applyGlobalCustomFont();
    loadPromptSchemes(); // 加载提示词方案
    migrateOldPromptSettings(); // 迁移旧设置
    loadWorldBooks();
}

// ==================== 提示词管理系统 ====================

// 默认提示词方案
const defaultPromptSchemes = {
    default: {
        id: 'default',
        name: '默认方案',
        prompts: {
            personality: '', // 人设提示词（用于普通聊天）
            videoCall: `你正在与用户进行视频通话，描写规范：
请使用以下三维描写法：
（动作描写）：描述你在视频画面中的表情、手势或背景动作。
"语言描写"：你真正说出口的话。
*心理描写*：你内心的真实想法

重要规则：
1. 每次回复都必须包含"语言描写"（双引号内的内容），这是你说出口的话
2. 动作描写和心理描写是可选的，但语言描写是必须的
3. 如果只有动作没有语言，用户会感到困惑

示例格式：
（微笑着挥手）"你好！很高兴见到你！"*今天心情真好*`,
            voiceCall: `[语音通话模式]
你现在正在进行语音通话。请注意：
1. 这是语音通话，不是面对面交流，你看不到对方
2. 你的回复会被朗读出来，所以要口语化、简洁
3. 严禁使用颜文字、Emoji或视觉描述
4. 可以使用语气词（嗯、啊、那个...）让对话更自然
5. 保持自然对话风格，避免过长的回复`,
            summary: '请简洁地总结以上对话的核心内容和关键信息。',
            messageFormat: '' // 消息格式提示词
        },
        createdAt: Date.now(),
        isDefault: true
    }
};

// 加载提示词方案
function loadPromptSchemes() {
    promptSchemes = getStorageJSON('promptSchemes', {});
    currentPromptSchemeId = localStorage.getItem('currentPromptSchemeId') || 'default';
    
    // 如果没有方案，初始化默认方案
    if (Object.keys(promptSchemes).length === 0) {
        promptSchemes = JSON.parse(JSON.stringify(defaultPromptSchemes));
        savePromptSchemes();
    }
    
    // 确保默认方案存在
    if (!promptSchemes.default) {
        promptSchemes.default = JSON.parse(JSON.stringify(defaultPromptSchemes.default));
        savePromptSchemes();
    }
    
    console.log('✅ 提示词方案已加载:', Object.keys(promptSchemes).length, '个方案');
}

// 保存提示词方案
function savePromptSchemes() {
    setStorageJSON('promptSchemes', promptSchemes);
    localStorage.setItem('currentPromptSchemeId', currentPromptSchemeId);
    console.log('💾 提示词方案已保存');
}

// 获取当前方案的指定类型提示词
function getCurrentPrompt(type) {
    // 检查 promptSchemes 是否已加载
    if (!promptSchemes || Object.keys(promptSchemes).length === 0) {
        console.error('❌ 提示词方案未加载，请检查 init() 函数是否正确执行');
        return defaultPromptSchemes.default.prompts[type] || '';
    }
    
    const scheme = promptSchemes[currentPromptSchemeId];
    if (!scheme || !scheme.prompts) {
        console.warn('⚠️ 当前方案不存在:', currentPromptSchemeId, '，使用默认方案');
        return defaultPromptSchemes.default.prompts[type] || '';
    }
    
    const prompt = scheme.prompts[type];
    if (!prompt || prompt.trim() === '') {
        console.log('ℹ️ 当前方案没有设置', type, '提示词，使用默认方案');
        return defaultPromptSchemes.default.prompts[type] || '';
    }
    
    return prompt;
}

// 创建新的提示词方案
function createPromptScheme(name) {
    const id = 'scheme_' + Date.now();
    promptSchemes[id] = {
        id: id,
        name: name,
        prompts: {
            personality: '',
            videoCall: defaultPromptSchemes.default.prompts.videoCall,
            voiceCall: defaultPromptSchemes.default.prompts.voiceCall,
            summary: defaultPromptSchemes.default.prompts.summary,
            messageFormat: ''
        },
        createdAt: Date.now(),
        isDefault: false
    };
    savePromptSchemes();
    return id;
}

// 更新提示词方案
function updatePromptScheme(schemeId, type, content) {
    if (!promptSchemes[schemeId]) {
        console.error('❌ 方案不存在:', schemeId);
        return false;
    }
    if (!promptSchemes[schemeId].prompts) {
        promptSchemes[schemeId].prompts = {};
    }
    promptSchemes[schemeId].prompts[type] = content;
    savePromptSchemes();
    console.log('✅ 提示词已更新:', schemeId, type);
    return true;
}

// 删除提示词方案
function deletePromptScheme(schemeId) {
    if (schemeId === 'default') {
        alert('默认方案不能删除');
        return false;
    }
    if (currentPromptSchemeId === schemeId) {
        currentPromptSchemeId = 'default';
    }
    delete promptSchemes[schemeId];
    savePromptSchemes();
    console.log('🗑️ 方案已删除:', schemeId);
    return true;
}

// 切换提示词方案
function switchPromptScheme(schemeId) {
    if (!promptSchemes[schemeId]) {
        console.error('❌ 方案不存在:', schemeId);
        return false;
    }
    currentPromptSchemeId = schemeId;
    savePromptSchemes();
    console.log('🔄 已切换到方案:', promptSchemes[schemeId].name);
    return true;
}

// 迁移旧的提示词设置
function migrateOldPromptSettings() {
    let migrated = false;
    
    // 检查是否已经迁移过
    if (localStorage.getItem('promptSettingsMigrated') === 'true') {
        return;
    }
    
    // 遍历所有联系人，迁移旧的提示词设置
    const contacts = getStorageJSON('vibe_contacts', []);
    contacts.forEach(contact => {
        // 迁移视频通话提示词
        if (contact.videoCallSettings && contact.videoCallSettings.videoCallPrompt) {
            const customPrompt = contact.videoCallSettings.videoCallPrompt;
            if (customPrompt !== defaultPromptSchemes.default.prompts.videoCall) {
                // 创建一个新方案保存这个自定义提示词
                const schemeId = createPromptScheme(`${contact.name || '联系人'}_视频通话`);
                updatePromptScheme(schemeId, 'videoCall', customPrompt);
                migrated = true;
                console.log('📦 已迁移视频通话提示词:', contact.name);
            }
        }
        
        // 迁移语音通话提示词
        if (contact.voiceCallSettings && contact.voiceCallSettings.voiceCallPrompt) {
            const customPrompt = contact.voiceCallSettings.voiceCallPrompt;
            if (customPrompt !== defaultPromptSchemes.default.prompts.voiceCall) {
                const schemeId = createPromptScheme(`${contact.name || '联系人'}_语音通话`);
                updatePromptScheme(schemeId, 'voiceCall', customPrompt);
                migrated = true;
                console.log('📦 已迁移语音通话提示词:', contact.name);
            }
        }
        
        // 迁移总结提示词
        if (contact.summarySettings && contact.summarySettings.prompt) {
            const customPrompt = contact.summarySettings.prompt;
            if (customPrompt !== defaultPromptSchemes.default.prompts.summary) {
                const schemeId = createPromptScheme(`${contact.name || '联系人'}_总结`);
                updatePromptScheme(schemeId, 'summary', customPrompt);
                migrated = true;
                console.log('📦 已迁移总结提示词:', contact.name);
            }
        }
    });
    
    if (migrated) {
        console.log('✅ 旧提示词设置迁移完成');
    }
    
    // 标记为已迁移
    localStorage.setItem('promptSettingsMigrated', 'true');
}

let worldBooks = [];

function loadWorldBooks() {
    try {
        worldBooks = JSON.parse(localStorage.getItem('vibe_world_books') || '[]');
    } catch (e) {
        worldBooks = [];
    }
    if (!Array.isArray(worldBooks)) {
        worldBooks = [];
    }
}

function saveWorldBooks() {
    localStorage.setItem('vibe_world_books', JSON.stringify(worldBooks || []));
}

function renderContactWorldBookList(selectedIds) {
    if (!Array.isArray(worldBooks)) {
        loadWorldBooks();
    }
    const container = document.getElementById('contactWorldBookList');
    if (!container) return;
    container.innerHTML = '';
    if (!worldBooks || worldBooks.length === 0) {
        const span = document.createElement('span');
        span.textContent = '当前没有世界书，请先在 iPad 主界面的「备忘录」App 中创建。';
        span.style.fontSize = '12px';
        span.style.color = '#7f8c8d';
        container.appendChild(span);
        return;
    }
    const selectedSet = new Set(selectedIds || []);
    worldBooks.forEach(book => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '6px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.setAttribute('data-worldbook-id', book.id);
        cb.checked = selectedSet.has(book.id);
        const text = document.createElement('span');
        text.textContent = book.name || '未命名世界书';
        label.appendChild(cb);
        label.appendChild(text);
        container.appendChild(label);
    });
}

function renderContactMountedBookList(selectedBookIds) {
    const container = document.getElementById('contactMountedBookList');
    if (!container) return;
    container.innerHTML = '';
    let books = [];
    try { books = JSON.parse(localStorage.getItem('vibe_reading_books') || '[]'); } catch(e) { books = []; }
    if (!Array.isArray(books) || books.length === 0) {
        const span = document.createElement('span');
        span.textContent = '暂无共读书籍，请先在共读App中上传书籍。';
        span.style.fontSize = '12px';
        span.style.color = '#7f8c8d';
        container.appendChild(span);
        return;
    }
    const selectedSet = new Set(selectedBookIds || []);
    books.forEach(book => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '6px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.setAttribute('data-mounted-book-id', book.id);
        cb.checked = selectedSet.has(book.id);
        const statusMap = { '在读': '📖', '已读完': '✅', '搁置': '⏸️' };
        const icon = statusMap[book.status] || '📖';
        const text = document.createElement('span');
        text.textContent = `${icon} ${book.title || '未命名'} (${book.status || '在读'})`;
        label.appendChild(cb);
        label.appendChild(text);
        container.appendChild(label);
    });
}


// 应用全局自定义字体
async function applyGlobalCustomFont() {
    // 初始化 IndexedDB
    const fontDB = await initFontDB();
    
    // 加载字体方案元数据
    const fontSchemes = getStorageJSON('fontSchemes', {});
    const activeFontScheme = localStorage.getItem('activeFontScheme'); // 这是字符串，不是JSON
    
    if (activeFontScheme && fontSchemes[activeFontScheme]) {
        const scheme = fontSchemes[activeFontScheme];
        
        // 从 IndexedDB 加载完整数据
        let fontData;
        if (scheme.type === 'file') {
            try {
                const dbData = await loadFontFromDB(fontDB, activeFontScheme);
                if (dbData && dbData.data) {
                    fontData = dbData.data;
                }
            } catch (error) {
                console.error('从 IndexedDB 加载字体失败:', error);
            }
        } else if (scheme.type === 'url') {
            // URL 类型需要重新构建 fontFace
            let format = scheme.format || 'woff2';
            fontData = {
                fontFace: `@font-face { 
                    font-family: 'CustomFont_${activeFontScheme}'; 
                    src: url('${fontSchemes[activeFontScheme].source}') format('${format}');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }`
            };
        }
        
        if (fontData) {
            let style = document.getElementById('customFontStyle');
            if (!style) {
                style = document.createElement('style');
                style.id = 'customFontStyle';
                document.head.appendChild(style);
            }
            style.textContent = fontData.fontFace;
            
            // 应用字体到所有元素
            applyFontToAllElements(scheme.fontFamily);
        }
    } else {
        const systemFont = localStorage.getItem('systemFont'); // 这是字符串，不是JSON
        if (systemFont) {
            applyFontToAllElements(systemFont);
        }
    }
}

// 初始化 IndexedDB（如果尚未定义）
if (typeof initFontDB === 'undefined') {
    function initFontDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('FontStorage', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('fonts')) {
                    db.createObjectStore('fonts', { keyPath: 'name' });
                }
            };
        });
    }
}

// 从 IndexedDB 加载字体（如果尚未定义）
if (typeof loadFontFromDB === 'undefined') {
    function loadFontFromDB(db, schemeName) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['fonts'], 'readonly');
            const store = transaction.objectStore('fonts');
            const request = store.get(schemeName);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// 应用字体到所有元素（如果尚未定义）
if (typeof applyFontToAllElements === 'undefined') {
    function applyFontToAllElements(fontFamily) {
        document.body.style.fontFamily = fontFamily;
        
        // 应用到所有表单元素
        const elements = document.querySelectorAll('input, textarea, select, button, option');
        elements.forEach(el => {
            el.style.fontFamily = fontFamily;
        });
    }
}

// 加载所有方案
function loadAllProfiles() {
    vibeProfilesList = getStorageJSON('vibe_profiles_list', []);
    
    // 如果没有方案，创建默认方案
    if (vibeProfilesList.length === 0) {
        const defaultProfile = {
            id: Date.now(),
            schemeName: '初始人设',
            realName: '',
            nickname: '',
            bio: '',
            tags: [],
            avatarUrl: presetAvatars[0]
        };
        vibeProfilesList.push(defaultProfile);
    }
    
    // 加载当前方案 ID
    const savedCurrentId = localStorage.getItem('current_profile_id'); // 这是字符串，不是JSON
    if (savedCurrentId) {
        currentProfileId = parseInt(savedCurrentId);
    } else {
        currentProfileId = vibeProfilesList[0].id;
    }
    
    saveAllProfiles();
}

// 保存所有方案
function saveAllProfiles() {
    setStorageJSON('vibe_profiles_list', vibeProfilesList);
    localStorage.setItem('current_profile_id', currentProfileId);
}

// 获取当前方案
function getCurrentProfile() {
    return vibeProfilesList.find(p => p.id === currentProfileId) || vibeProfilesList[0];
}

// 加载共享头像库
function loadSharedAvatars() {
    sharedAvatars = getStorageJSON('shared_avatars', []);
    if (sharedAvatars.length === 0) {
        sharedAvatars = [...presetAvatars];
        saveSharedAvatars();
    }
}

// 保存共享头像库
function saveSharedAvatars() {
    setStorageJSON('shared_avatars', sharedAvatars);
}

// 更新主页面
function updateMainPage() {
    const profile = getCurrentProfile();
    const mainAvatar = document.getElementById('mainAvatar');
    const currentProfileName = document.getElementById('currentProfileName');
    const displayRealName = document.getElementById('displayRealName');
    
    if (mainAvatar) {
        if (profile.avatarUrl) {
            mainAvatar.src = profile.avatarUrl;
        } else {
            mainAvatar.src = '';
            mainAvatar.textContent = profile.schemeName ? profile.schemeName.charAt(0) : '我';
        }
    }
    
    if (currentProfileName) {
        currentProfileName.textContent = profile.schemeName || '未设置';
    }
    
    if (displayRealName) {
        displayRealName.textContent = profile.realName || '未设置';
    }
}

// 打开页面
function openPage(pageId) {
    console.log('openPage called with pageId:', pageId);
    
    // 关闭所有其他页面
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(p => {
        if (p.id !== pageId) {
            p.classList.remove('active');
        }
    });
    
    // 打开目标页面
    const page = document.getElementById(pageId);
    if (!page) {
        console.error('Page element not found:', pageId);
        return;
    }
    
    console.log('Opening page:', pageId);
    page.classList.add('active');
    page.style.display = 'block';
    
    // 强制重绘
    page.offsetHeight;
    
    console.log('Page classes:', page.className);
    console.log('Page display:', page.style.display);
    
    // 加载对应页面的数据
    if (pageId === 'page-info') {
        loadInfoPage();
    } else if (pageId === 'page-avatars') {
        loadAvatarsPage();
    }
}

// 关闭页面（返回主 Tab 界面）
function closePageToMain(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    
    page.classList.remove('active');
    page.style.display = 'none';
    
    // 清理预览样式
    if (pageId === 'page-add-contact') {
        const bubblePreviewStyle = document.getElementById('bubblePreviewStyle');
        if (bubblePreviewStyle) bubblePreviewStyle.remove();
        
        const callBubblePreviewStyle = document.getElementById('callBubblePreviewStyle');
        if (callBubblePreviewStyle) callBubblePreviewStyle.remove();
    }
    
    // 重置 z-index
    if (pageId === 'page-add-contact') {
        page.style.zIndex = '';
    }
    
    // 确保主页面和联系人页面的状态正确
    if (pageId === 'page-chat' || pageId === 'page-add-contact') {
        // 如果是从编辑页面返回，检查聊天页面是否还在
        const chatPage = document.getElementById('page-chat');
        if (pageId === 'page-add-contact' && chatPage && chatPage.classList.contains('active')) {
            // 返回到聊天页面，不做其他操作
            return;
        }
        
        // 从聊天或添加联系人返回到联系人列表
        const contactsPage = document.getElementById('page-contacts');
        const mePage = document.getElementById('page-me');
        if (contactsPage) contactsPage.classList.add('active');
        if (mePage) mePage.classList.remove('active');
        updateNavBar('contacts');
    } else {
        // 从其他页面返回到"我"页面
        const mePage = document.getElementById('page-me');
        const contactsPage = document.getElementById('page-contacts');
        if (mePage) mePage.classList.add('active');
        if (contactsPage) contactsPage.classList.remove('active');
        updateNavBar('me');
    }
}

// 更新导航栏状态
function updateNavBar(activeTab) {
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.classList.remove('active');
        if ((activeTab === 'me' && index === 0) || 
            (activeTab === 'contacts' && index === 1)) {
            item.classList.add('active');
        }
    });
}

// 加载信息页面
function loadInfoPage() {
    const profile = getCurrentProfile();
    
    document.getElementById('realName').value = profile.realName || '';
    document.getElementById('nickname').value = profile.nickname || '';
    document.getElementById('bio').value = profile.bio || '';
    document.getElementById('currentSchemeName').textContent = profile.schemeName;
    
    const previewAvatar = document.getElementById('previewAvatar');
    if (profile.avatarUrl) {
        previewAvatar.src = profile.avatarUrl;
        previewAvatar.style.fontSize = '0';
    } else {
        previewAvatar.textContent = '👤';
        previewAvatar.style.fontSize = '50px';
    }
    
    renderTags();
}

// 渲染标签
function renderTags() {
    const profile = getCurrentProfile();
    const container = document.getElementById('tagsContainer');
    container.innerHTML = '';
    
    profile.tags.forEach((tag, index) => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag';
        tagEl.style.background = tagColors[index % tagColors.length];
        tagEl.innerHTML = `
            <span>${tag}</span>
            <span class="tag-remove" onclick="removeTag(${index})">×</span>
        `;
        container.appendChild(tagEl);
    });
}

// 添加标签
function addTag() {
    const input = document.getElementById('tagInput');
    const tag = input.value.trim();
    const profile = getCurrentProfile();
    
    if (tag && !profile.tags.includes(tag)) {
        profile.tags.push(tag);
        input.value = '';
        renderTags();
    }
}

// 移除标签
function removeTag(index) {
    const profile = getCurrentProfile();
    profile.tags.splice(index, 1);
    renderTags();
}

// 保存用户信息（页面头部保存按钮）
function saveUserInfo() {
    saveCurrentProfile();
    alert('信息已保存');
}

// 保存当前方案
function saveCurrentProfile() {
    const profile = getCurrentProfile();
    
    profile.realName = document.getElementById('realName').value.trim();
    profile.nickname = document.getElementById('nickname').value.trim();
    profile.bio = document.getElementById('bio').value.trim();
    
    saveAllProfiles();
    updateMainPage();
    
    // 显示保存成功提示
    const saveBtn = document.querySelector('.save-scheme-btn');
    if (saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ 已保存';
        setTimeout(() => {
            saveBtn.textContent = originalText;
        }, 1500);
    }
}

// 保存为新方案
function saveAsNewProfile() {
    const schemeName = prompt('请输入新方案名称：');
    if (!schemeName || !schemeName.trim()) {
        return;
    }
    
    const currentProfile = getCurrentProfile();
    const newProfile = {
        id: Date.now(),
        schemeName: schemeName.trim(),
        realName: document.getElementById('realName').value.trim(),
        nickname: document.getElementById('nickname').value.trim(),
        bio: document.getElementById('bio').value.trim(),
        tags: currentProfile.tags ? [...currentProfile.tags] : [],
        avatarUrl: currentProfile.avatarUrl || presetAvatars[0]
    };
    
    vibeProfilesList.push(newProfile);
    currentProfileId = newProfile.id;
    saveAllProfiles();
    
    // 更新显示
    document.getElementById('currentSchemeName').textContent = newProfile.schemeName;
    updateMainPage();
    
    alert(`方案 "${schemeName}" 已创建并切换`);
}

// 加载头像库
function loadAvatarsPage() {
    const grid = document.getElementById('avatarsGrid');
    grid.innerHTML = '';
    const profile = getCurrentProfile();
    
    sharedAvatars.forEach((avatar, index) => {
        const item = document.createElement('div');
        item.className = 'avatar-item';
        if (avatar === profile.avatarUrl) {
            item.classList.add('selected');
        }
        
        const img = document.createElement('img');
        img.src = avatar;
        img.alt = `头像 ${index + 1}`;
        
        item.appendChild(img);
        item.onclick = () => selectAvatar(avatar);
        
        grid.appendChild(item);
    });
}

// 选择头像
function selectAvatar(avatar) {
    const profile = getCurrentProfile();
    profile.avatarUrl = avatar;
    saveAllProfiles();
    updateMainPage();
    
    // 更新预览
    const previewAvatar = document.getElementById('previewAvatar');
    if (previewAvatar) {
        previewAvatar.src = avatar;
        previewAvatar.style.fontSize = '0';
    }
    
    // 更新选中状态
    document.querySelectorAll('.avatar-item').forEach(item => {
        item.classList.remove('selected');
        if (item.querySelector('img').src === avatar) {
            item.classList.add('selected');
        }
    });
}

// URL 上传
function uploadFromUrl() {
    const url = prompt('请输入图片 URL：');
    if (url) {
        // 验证 URL
        const img = new Image();
        img.onload = () => {
            sharedAvatars.unshift(url);
            saveSharedAvatars();
            loadAvatarsPage();
        };
        img.onerror = () => {
            alert('图片加载失败，请检查 URL 是否正确');
        };
        img.src = url;
    }
}

// 本地文件上传
function uploadFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        sharedAvatars.unshift(e.target.result);
        saveSharedAvatars();
        loadAvatarsPage();
    };
    reader.readAsDataURL(file);
}

// 打开方案选择器
function openProfileSelector() {
    const modal = document.getElementById('profileSelectorModal');
    modal.classList.add('active');
    renderProfileList();
}

// 关闭方案选择器
function closeProfileSelector() {
    const modal = document.getElementById('profileSelectorModal');
    modal.classList.remove('active');
}

// 渲染方案列表
function renderProfileList() {
    const list = document.getElementById('profileList');
    list.innerHTML = '';
    
    vibeProfilesList.forEach(profile => {
        const item = document.createElement('div');
        item.className = 'profile-item';
        if (profile.id === currentProfileId) {
            item.classList.add('active');
        }
        
        const avatar = document.createElement('img');
        avatar.className = 'profile-item-avatar';
        if (profile.avatarUrl) {
            avatar.src = profile.avatarUrl;
        } else {
            avatar.textContent = '👤';
            avatar.style.fontSize = '24px';
        }
        
        const info = document.createElement('div');
        info.className = 'profile-item-info';
        info.innerHTML = `
            <div class="profile-item-name">${profile.schemeName}</div>
            <div class="profile-item-bio">${profile.bio || profile.nickname || '暂无描述'}</div>
        `;
        
        const check = document.createElement('span');
        check.className = 'profile-item-check';
        check.textContent = '✓';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'profile-item-delete';
        deleteBtn.textContent = '🗑';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteProfile(profile.id);
        };
        
        item.appendChild(avatar);
        item.appendChild(info);
        item.appendChild(check);
        if (vibeProfilesList.length > 1) {
            item.appendChild(deleteBtn);
        }
        
        item.onclick = () => switchProfile(profile.id);
        
        list.appendChild(item);
    });
}

// 切换方案
function switchProfile(profileId) {
    if (profileId === currentProfileId) {
        closeProfileSelector();
        return;
    }
    
    currentProfileId = profileId;
    saveAllProfiles();
    
    // 添加切换动画
    const avatarSection = document.getElementById('avatarSection');
    avatarSection.classList.add('switching');
    
    setTimeout(() => {
        updateMainPage();
        avatarSection.classList.remove('switching');
    }, 300);
    
    closeProfileSelector();
    
    const profile = getCurrentProfile();
    
    // 显示切换提示
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(102, 126, 234, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideDown 0.4s ease;
    `;
    notification.textContent = `已切换到「${profile.schemeName}」`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 2000);
}

// 删除方案
function deleteProfile(profileId) {
    if (vibeProfilesList.length <= 1) {
        alert('至少需要保留一个方案');
        return;
    }
    
    const profile = vibeProfilesList.find(p => p.id === profileId);
    if (!confirm(`确定要删除方案「${profile.schemeName}」吗？`)) {
        return;
    }
    
    vibeProfilesList = vibeProfilesList.filter(p => p.id !== profileId);
    
    // 如果删除的是当前方案，切换到第一个方案
    if (profileId === currentProfileId) {
        currentProfileId = vibeProfilesList[0].id;
        updateMainPage();
    }
    
    saveAllProfiles();
    renderProfileList();
}

// 应用壁纸颜色（动态毛玻璃）
function applyWallpaperColor() {
    const wallpaper = localStorage.getItem('wallpaper'); // 这是字符串，不是JSON
    if (wallpaper) {
        const mode = localStorage.getItem('wallpaperMode') || 'cover';
        document.body.style.backgroundImage = wallpaper;
        if (mode === 'repeat') {
            document.body.style.backgroundSize = 'auto';
            document.body.style.backgroundRepeat = 'repeat';
        } else {
            document.body.style.backgroundSize = mode;
            document.body.style.backgroundRepeat = 'no-repeat';
        }
        document.body.style.backgroundPosition = 'center';
        document.body.style.imageRendering = '-webkit-optimize-contrast';
    }
}

// 添加滑动动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -20px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 监听 Enter 键添加标签
document.addEventListener('DOMContentLoaded', () => {
    const tagInput = document.getElementById('tagInput');
    if (tagInput) {
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        });
    }
    
    // 点击弹窗外部关闭
    const modal = document.getElementById('profileSelectorModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProfileSelector();
            }
        });
    }
});

// 支持左滑返回
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX - touchStartX > 100) {
        // 右滑，返回上一页
        const activePages = document.querySelectorAll('.page.active');
        if (activePages.length > 1) {
            const currentPage = activePages[activePages.length - 1];
            currentPage.classList.remove('active');
        }
    }
}

// 初始化应用
init();


// ==================== 页面背景图管理 ====================

// 当前选中的背景类型
let currentBgType = 'myBg';

// 更新背景类型选择
function updateBackgroundType() {
    const select = document.getElementById('bgTypeSelect');
    currentBgType = select.value;
    
    // 加载并显示当前背景的预览
    const savedBg = localStorage.getItem(currentBgType); // 这是字符串，不是JSON
    const preview = document.getElementById('bgPreview');
    const urlInput = document.getElementById('bgImageUrl');
    
    if (savedBg) {
        preview.style.backgroundImage = `url(${savedBg})`;
        preview.textContent = '';
        urlInput.value = savedBg;
    } else {
        preview.style.backgroundImage = '';
        preview.textContent = '背景图预览';
        urlInput.value = '';
    }
}

// 应用URL背景
function applyBackgroundUrl() {
    const urlInput = document.getElementById('bgImageUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('请输入图片URL');
        return;
    }
    
    // 保存到localStorage
    localStorage.setItem(currentBgType, url);
    
    // 更新预览
    const preview = document.getElementById('bgPreview');
    preview.style.backgroundImage = `url(${url})`;
    preview.textContent = '';
    
    // 应用到对应页面
    applyBackgroundToPage(currentBgType, url);
    
    alert('背景已应用');
}

// 触发文件上传
function uploadBackgroundImage() {
    document.getElementById('bgImageFile').click();
}

// 处理文件上传
function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        
        // 保存到localStorage
        localStorage.setItem(currentBgType, dataUrl);
        
        // 更新预览
        const preview = document.getElementById('bgPreview');
        preview.style.backgroundImage = `url(${dataUrl})`;
        preview.textContent = '';
        
        // 更新URL输入框
        document.getElementById('bgImageUrl').value = dataUrl;
        
        // 应用到对应页面
        applyBackgroundToPage(currentBgType, dataUrl);
        
        alert('背景已上传并应用');
    };
    reader.readAsDataURL(file);
}

// 清除背景图
function clearBackgroundImage() {
    if (!confirm('确定要清除当前背景图吗？')) {
        return;
    }
    
    // 从localStorage删除
    localStorage.removeItem(currentBgType);
    
    // 清除预览
    const preview = document.getElementById('bgPreview');
    preview.style.backgroundImage = '';
    preview.textContent = '背景图预览';
    
    // 清除URL输入框
    document.getElementById('bgImageUrl').value = '';
    
    // 清除页面背景
    applyBackgroundToPage(currentBgType, '');
    
    alert('背景已清除');
}

// 应用背景到对应页面
function applyBackgroundToPage(bgType, url) {
    let panelId;
    
    switch(bgType) {
        case 'myBg':
            panelId = 'panel-me';
            break;
        case 'contactBg':
            panelId = 'panel-contacts';
            break;
        case 'npcBg':
            panelId = 'panel-npc';
            break;
        default:
            return;
    }
    
    const panel = document.getElementById(panelId);
    if (panel) {
        if (url) {
            panel.style.backgroundImage = `url(${url})`;
            panel.style.backgroundSize = 'cover';
            panel.style.backgroundPosition = 'center';
            panel.style.backgroundRepeat = 'repeat';
        } else {
            panel.style.backgroundImage = '';
            panel.style.backgroundSize = '';
            panel.style.backgroundPosition = '';
            panel.style.backgroundRepeat = '';
        }
    }
}

// 页面加载时应用所有保存的背景
function loadAllBackgrounds() {
    const bgTypes = ['myBg', 'contactBg', 'npcBg'];
    bgTypes.forEach(bgType => {
        const savedBg = localStorage.getItem(bgType); // 这是字符串，不是JSON
        if (savedBg) {
            applyBackgroundToPage(bgType, savedBg);
        }
    });
}

// 在页面加载时调用
document.addEventListener('DOMContentLoaded', () => {
    loadAllBackgrounds();
    // 初始化背景类型选择
    if (document.getElementById('bgTypeSelect')) {
        updateBackgroundType();
    }
});


// ==================== 联系人管理 ====================

let vibeContacts = [];
let currentChatContactId = null;
let bubbleSchemes = {};
let pendingMessages = []; // 待合并发送的消息队列

// 辅助函数：从localStorage获取并解析JSON
function getStorageJSON(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error(`解析 ${key} 失败:`, e);
        return defaultValue;
    }
}

// 辅助函数：保存JSON到localStorage
function setStorageJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error(`保存 ${key} 失败:`, e);
        return false;
    }
}

// 默认气泡样式（带详细注释，方便用户理解和修改）
const defaultBubbleCSS = `/* 聊天气泡样式 - 使用CSS变量统一管理颜色 */

/* ========== 方法1: 修改CSS变量（推荐，会自动同步阴影颜色） ========== */
:root {
    --received-bubble-bg: rgba(230, 230, 235, 0.9);   /* 接收气泡背景 */
    --received-bubble-color: #2c3e50;                 /* 接收气泡文字颜色 */
    --received-bubble-border: #000000;                /* 接收气泡边框颜色 */
    --received-bubble-shadow: #cccccc;                /* 接收气泡阴影颜色 */
    
    --sent-bubble-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 发送气泡背景（支持渐变） */
    --sent-bubble-color: white;                       /* 发送气泡文字颜色 */
    --sent-bubble-border: #000000;                    /* 发送气泡边框颜色 */
    --sent-bubble-shadow: #9b7ec4;                    /* 发送气泡阴影颜色 */
}

/* ========== 方法2: 直接修改样式类（传统方式） ========== */
/* 如果你想完全自定义，可以覆盖下面的样式 */

/* 接收的消息（对方发的） */
.message-bubble.received {
    /* 使用变量（推荐） */
    background: var(--received-bubble-bg);
    color: var(--received-bubble-color);
    border: 2px solid var(--received-bubble-border);
    box-shadow: 3px 3px 0px var(--received-bubble-shadow);
    
    /* 或者直接写固定值（不推荐，阴影不会自动同步） */
    /* background: #FFE4E9; */
    /* color: #c06c84; */
    /* border: 2px solid #FFB6C1; */
    /* border-radius: 20px; */
    /* padding: 15px; */
}

/* 发送的消息（自己发的） */
.message-bubble.sent {
    /* 使用变量（推荐） */
    background: var(--sent-bubble-bg);
    color: var(--sent-bubble-color);
    border: 2px solid var(--sent-bubble-border);
    box-shadow: 3px 3px 0px var(--sent-bubble-shadow);
    
    /* 或者直接写固定值 */
    /* background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); */
    /* color: white; */
}

/* ========== 示例配色方案 ========== */
/* 粉色恋人：
:root {
    --received-bubble-bg: rgba(255, 182, 193, 0.3);
    --received-bubble-color: #c06c84;
    --received-bubble-shadow: #FFB6C1;
    --sent-bubble-bg: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    --sent-bubble-color: white;
    --sent-bubble-shadow: #ff9a9e;
}
*/

/* 冷静蓝调：
:root {
    --received-bubble-bg: rgba(173, 216, 230, 0.3);
    --received-bubble-color: #355c7d;
    --received-bubble-shadow: #ADD8E6;
    --sent-bubble-bg: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --sent-bubble-color: white;
    --sent-bubble-shadow: #4facfe;
}
*/

/* 清新绿意：
:root {
    --received-bubble-bg: rgba(144, 238, 144, 0.3);
    --received-bubble-color: #2d5016;
    --received-bubble-shadow: #90EE90;
    --sent-bubble-bg: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    --sent-bubble-color: white;
    --sent-bubble-shadow: #43e97b;
}
*/`;

// 加载联系人
function loadContacts() {
    vibeContacts = getStorageJSON('vibe_contacts', []);
    
    // 数据迁移：确保所有联系人都有 callBubbleScheme 属性
    let needsSave = false;
    vibeContacts.forEach(contact => {
        if (!contact.callBubbleScheme) {
            contact.callBubbleScheme = 'default';
            needsSave = true;
        }
    });
    
    if (needsSave) {
        saveContacts();
    }
    
    // 加载气泡方案
    bubbleSchemes = getStorageJSON('bubble_schemes', {});
    if (Object.keys(bubbleSchemes).length === 0) {
        bubbleSchemes = {
            'default': defaultBubbleCSS,
            'pink': `:root {
    --received-bubble-bg: rgba(255, 182, 193, 0.3);
    --received-bubble-color: #c06c84;
    --received-bubble-border: #FFB6C1;
    --received-bubble-shadow: #FFB6C1;
    --sent-bubble-bg: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    --sent-bubble-color: white;
    --sent-bubble-border: #ff9a9e;
    --sent-bubble-shadow: #ff9a9e;
}`,
            'blue': `:root {
    --received-bubble-bg: rgba(173, 216, 230, 0.3);
    --received-bubble-color: #355c7d;
    --received-bubble-border: #ADD8E6;
    --received-bubble-shadow: #ADD8E6;
    --sent-bubble-bg: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --sent-bubble-color: white;
    --sent-bubble-border: #4facfe;
    --sent-bubble-shadow: #4facfe;
}`,
            'green': `:root {
    --received-bubble-bg: rgba(144, 238, 144, 0.3);
    --received-bubble-color: #2d5016;
    --received-bubble-border: #90EE90;
    --received-bubble-shadow: #90EE90;
    --sent-bubble-bg: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    --sent-bubble-color: white;
    --sent-bubble-border: #43e97b;
    --sent-bubble-shadow: #43e97b;
}`
        };
        saveBubbleSchemes();
    }
}

// 保存联系人
function saveContacts() {
    try {
        setStorageJSON('vibe_contacts', vibeContacts);
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('localStorage 配额已满，尝试压缩数据...');
            
            // 尝试清理一些不必要的数据
            alert('存储空间不足！建议：\n1. 删除一些不常用的联系人\n2. 减少使用 base64 图片，改用外部链接\n3. 清理聊天记录');
            
            // 仍然尝试保存，但可能会失败
            try {
                // 创建一个精简版本，移除一些大数据
                const simplifiedContacts = vibeContacts.map(contact => {
                    const simplified = { ...contact };
                    // 保留最近50条聊天记录
                    if (simplified.chat_history && simplified.chat_history.length > 50) {
                        simplified.chat_history = simplified.chat_history.slice(-50);
                    }
                    return simplified;
                });
                setStorageJSON('vibe_contacts', simplifiedContacts);
                console.log('已保存精简版本的联系人数据');
            } catch (e2) {
                console.error('保存失败:', e2);
                alert('保存失败！请立即导出数据备份，然后清理存储空间。');
            }
        } else {
            console.error('保存联系人失败:', e);
            throw e;
        }
    }
}

// 保存气泡方案
function saveBubbleSchemes() {
    setStorageJSON('bubble_schemes', bubbleSchemes);
}

// 切换主标签页（左侧导航）
function switchMainTab(tab) {
    // 更新左侧导航激活状态
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.sidebar-nav-item[data-tab="${tab}"]`)?.classList.add('active');
    
    // 切换内容面板
    document.querySelectorAll('.content-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    if (tab === 'me') {
        document.getElementById('panel-me').classList.add('active');
    } else if (tab === 'contacts') {
        document.getElementById('panel-contacts').classList.add('active');
        renderContactsGroups();
    } else if (tab === 'npc') {
        document.getElementById('panel-npc').classList.add('active');
        renderNPCList();
    }
}

// 兼容旧的switchTab函数（用于其他地方调用）
function switchTab(tab) {
    switchMainTab(tab);
}

// ==================== 联系人分组功能 ====================

// 打开创建分组对话框
function openCreateGroup() {
    document.getElementById('newGroupName').value = '';
    document.getElementById('createGroupModal').classList.add('active');
}

// 关闭创建分组对话框
function closeCreateGroup() {
    document.getElementById('createGroupModal').classList.remove('active');
}

// 保存新分组
function saveNewGroup() {
    const groupName = document.getElementById('newGroupName').value.trim();
    if (!groupName) {
        alert('请输入分组名称');
        return;
    }
    
    // 检查分组是否已存在
    const existingGroups = new Set();
    vibeContacts.forEach(contact => {
        if (contact.group) {
            existingGroups.add(contact.group);
        }
    });
    
    if (existingGroups.has(groupName)) {
        alert('该分组已存在');
        return;
    }
    
    // 创建一个占位联系人来保存分组（稍后可以删除或编辑）
    // 或者我们可以使用localStorage单独存储分组列表
    let customGroups = getStorageJSON('vibe_custom_groups', []);
    if (!customGroups.includes(groupName)) {
        customGroups.push(groupName);
        setStorageJSON('vibe_custom_groups', customGroups);
    }
    
    closeCreateGroup();
    alert(`分组"${groupName}"已创建`);
    
    // 刷新联系人列表和分组选项
    renderContactsGroups();
    loadGroupSuggestions();
}

// 渲染联系人分组
function renderContactsGroups() {
    const container = document.getElementById('contactsGroupsContainer');
    
    // 获取所有分组
    const groups = {};
    vibeContacts.forEach(contact => {
        const groupName = contact.group || '默认分组';
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(contact);
    });
    
    if (Object.keys(groups).length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #000000;">
                <div style="font-size: 48px; margin-bottom: 16px;">👥</div>
                <div style="font-size: 16px; font-weight: bold;">还没有联系人</div>
                <div style="font-size: 14px; margin-top: 8px;">点击右上角 + 添加联系人</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    Object.keys(groups).forEach(groupName => {
        const contacts = groups[groupName];
        const groupDiv = document.createElement('div');
        groupDiv.className = 'contact-group';
        
        groupDiv.innerHTML = `
            <div class="group-header" onclick="toggleGroup(this)">
                <span class="group-toggle">▼</span>
                <span class="group-name">${groupName}</span>
                <span class="group-count">${contacts.length}人</span>
            </div>
            <div class="group-contacts expanded">
                ${contacts.map(contact => {
                    const displayName = contact.nickname || contact.name;
                    const firstChar = displayName.charAt(0);
                    
                    // 头像HTML - 确保只生成纯净的内容
                    let avatarContent;
                    if (contact.avatarUrl) {
                        // 使用data属性存储备用文本，不使用alt避免显示
                        avatarContent = `<img src="${contact.avatarUrl}" onerror="this.style.display='none';this.parentElement.textContent='${firstChar}';">`;
                    } else {
                        avatarContent = firstChar;
                    }
                    
                    // 检查是否有封图
                    const hasCover = !!(contact.coverImageUrl);
                    const cardClass = hasCover ? 'contact-card has-cover' : 'contact-card';
                    
                    // 封图背景图片（如果有）
                    const coverImageHtml = hasCover 
                        ? `<img src="${contact.coverImageUrl}" onerror="this.style.display='none';">`
                        : '';
                    
                    return `
                        <div class="${cardClass}" onclick="openChat(${contact.id})">
                            <div class="contact-card-cover">
                                ${coverImageHtml}
                                <div class="contact-card-avatar">${avatarContent}</div>
                            </div>
                            <div class="contact-card-name">${displayName}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        container.appendChild(groupDiv);
    });
}

// 切换分组展开/收起
function toggleGroup(header) {
    const toggle = header.querySelector('.group-toggle');
    const contacts = header.nextElementSibling;
    
    toggle.classList.toggle('collapsed');
    contacts.classList.toggle('expanded');
}

// ==================== NPC功能 ====================

// 渲染NPC列表（按CHAR分组显示）
function renderNPCList() {
    const list = document.getElementById('npcList');
    
    // 按CHAR分组
    const charGroups = [];
    vibeContacts.forEach(contact => {
        if (contact.npcs && contact.npcs.length > 0) {
            charGroups.push(contact);
        }
    });
    
    if (charGroups.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #95a5a6;">
                <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                <div style="font-size: 16px;">还没有NPC</div>
                <div style="font-size: 14px; margin-top: 8px;">点击右上角 + 添加NPC</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = charGroups.map(contact => `
        <div class="npc-char-group">
            <div class="npc-char-header">
                <div class="npc-char-avatar">
                    ${contact.avatarUrl ? `<img class="avatar-img" src="${contact.avatarUrl}" alt="${contact.name}">` : contact.name.charAt(0)}
                </div>
                <div class="npc-char-info">
                    <div class="npc-char-name">${contact.name}</div>
                    <div class="npc-char-meta">${contact.group || '默认分组'} · ${contact.npcs.length}个NPC</div>
                </div>
                <button class="npc-action-btn npc-graph-btn" onclick="openNPCRelations('${contact.id}')">🔗 关系图</button>
            </div>
            <div class="npc-char-npcs">
                ${contact.npcs.map(npc => `
                    <div class="npc-item">
                        <div class="npc-item-header">
                            <div class="npc-avatar">
                                ${npc.avatar ? `<img class="avatar-img" src="${npc.avatar}" alt="${npc.name}">` : npc.name.charAt(0)}
                            </div>
                            <div class="npc-info">
                                <div class="npc-name">${npc.name}</div>
                                <div class="npc-relation">${(() => { const r = normalizeRelation(npc.relation); const vis = r.visibility === 'known' ? '🟢' : '🔴'; return r.label ? vis + ' ' + r.label : vis + (r.visibility === 'known' ? ' CHAR可知' : ' CHAR不知'); })()}${npc.personality ? ' · ' + npc.personality.substring(0, 20) + (npc.personality.length > 20 ? '...' : '') : ''}</div>
                            </div>
                            <div class="npc-actions">
                                <button class="npc-action-btn" onclick="editNPC('${contact.id}', '${npc.id}')">编辑</button>
                                <button class="npc-action-btn" onclick="deleteNPC('${contact.id}', '${npc.id}')">删除</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 打开添加NPC对话框
function openAddNPC() {
    document.getElementById('npcModalTitle').textContent = '添加NPC';
    document.getElementById('editingNPCContactId').value = '';
    document.getElementById('editingNPCId').value = '';
    document.getElementById('npcName').value = '';
    document.getElementById('npcAvatarUrl').value = '';
    document.getElementById('npcPersonality').value = '';
    document.getElementById('npcRelationLabel').value = '';
    document.getElementById('npcRelationVisibility').value = 'known';
    
    // 重置头像显示
    const avatarDisplay = document.getElementById('npcAvatarDisplay');
    avatarDisplay.innerHTML = '🤖';
    avatarDisplay.style.fontSize = '40px';
    
    // 加载联系人选项
    const select = document.getElementById('npcContactSelect');
    select.innerHTML = '';
    
    if (vibeContacts.length === 0) {
        select.innerHTML = '<option value="">请先添加联系人</option>';
    } else {
        vibeContacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = contact.id;
            option.textContent = contact.name;
            select.appendChild(option);
        });
    }
    
    document.getElementById('npcManagementModal').classList.add('active');
}

// 打开NPC头像库选择器
function openNPCAvatarSelector() {
    const modal = document.getElementById('npcAvatarSelectorModal');
    const grid = document.getElementById('npcAvatarSelectorGrid');
    grid.innerHTML = '';
    
    if (sharedAvatars.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">头像库为空，请先在"我"页面上传头像</div>';
    } else {
        sharedAvatars.forEach(avatar => {
            const item = document.createElement('div');
            item.className = 'avatar-selector-item';
            const img = document.createElement('img');
            img.src = avatar;
            item.appendChild(img);
            item.onclick = () => {
                document.getElementById('npcAvatarUrl').value = avatar;
                const avatarDisplay = document.getElementById('npcAvatarDisplay');
                avatarDisplay.innerHTML = '';
                const displayImg = document.createElement('img');
                displayImg.className = 'avatar-img';
                displayImg.src = avatar;
                displayImg.alt = 'NPC头像';
                avatarDisplay.appendChild(displayImg);
                closeNPCAvatarSelector();
            };
            grid.appendChild(item);
        });
    }
    
    modal.classList.add('active');
}

// 关闭NPC头像库选择器
function closeNPCAvatarSelector() {
    document.getElementById('npcAvatarSelectorModal').classList.remove('active');
}

// 关闭NPC管理弹窗
function closeNPCManagement() {
    document.getElementById('npcManagementModal').classList.remove('active');
}

// 从URL更新NPC头像
function updateNPCAvatarFromUrl() {
    const url = document.getElementById('npcAvatarUrl').value.trim();
    if (!url) {
        alert('请输入头像URL');
        return;
    }
    
    const avatarDisplay = document.getElementById('npcAvatarDisplay');
    avatarDisplay.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'avatar-img';
    img.src = url;
    img.alt = 'NPC头像';
    avatarDisplay.appendChild(img);
}

// 上传NPC头像
function uploadNPCAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const avatarDisplay = document.getElementById('npcAvatarDisplay');
        avatarDisplay.innerHTML = '';
        const img = document.createElement('img');
        img.className = 'avatar-img';
        img.src = e.target.result;
        img.alt = 'NPC头像';
        avatarDisplay.appendChild(img);
        document.getElementById('npcAvatarUrl').value = e.target.result;
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 保存NPC
function saveNPC() {
    const name = document.getElementById('npcName').value.trim();
    if (!name) {
        alert('请输入NPC名称');
        return;
    }
    
    const contactId = document.getElementById('npcContactSelect').value;
    if (!contactId) {
        alert('请选择绑定的CHAR');
        return;
    }
    
    const contact = vibeContacts.find(c => c.id == contactId);
    if (!contact) {
        alert('找不到绑定的CHAR');
        return;
    }
    
    if (!contact.npcs) {
        contact.npcs = [];
    }
    
    const avatarUrl = document.getElementById('npcAvatarUrl').value.trim();
    const gender = document.getElementById('npcGender').value;
    const relationLabel = document.getElementById('npcRelationLabel').value.trim();
    const relationVisibility = document.getElementById('npcRelationVisibility').value;
    const personality = document.getElementById('npcPersonality').value.trim();
    
    const editingNPCId = document.getElementById('editingNPCId').value;
    
    if (editingNPCId) {
        // 编辑现有NPC
        const npc = contact.npcs.find(n => n.id === editingNPCId);
        if (npc) {
            npc.name = name;
            npc.gender = gender;
            npc.avatar = avatarUrl;
            npc.relation = { label: relationLabel, visibility: relationVisibility };
            npc.personality = personality;
        }
    } else {
        // 添加新NPC
        contact.npcs.push({
            id: Date.now().toString(),
            name: name,
            gender: gender,
            avatar: avatarUrl,
            relation: { label: relationLabel, visibility: relationVisibility },
            personality: personality,
            relations: {} // 存储与其他NPC的关系
        });
    }
    
    // 生成NPC关系文档
    generateNPCRelationsDocument(contact);
    
    saveContacts();
    closeNPCManagement();
    renderNPCList();
    alert('NPC已保存');
}

// 生成NPC关系文档（供AI读取）
function generateNPCRelationsDocument(contact) {
    if (!contact.npcs || contact.npcs.length === 0) {
        contact.npcRelationsDoc = null;
        return;
    }
    
    const sameGroupChars = getSameGroupChars(contact);
    
    let doc = `# ${contact.name} 的NPC关系网络\n\n`;
    doc += `## 基本信息\n`;
    doc += `- CHAR名称：${contact.name}\n`;
    doc += `- 分组/世界观：${contact.group || '默认分组'}\n`;
    if (sameGroupChars.length > 0) {
        doc += `- 同分组CHAR：${sameGroupChars.map(c => c.name).join('、')}\n`;
    }
    doc += `\n`;
    
    doc += `## NPC列表\n\n`;
    contact.npcs.forEach((npc, index) => {
        doc += `### ${index + 1}. ${npc.name}\n`;
        doc += `- 性别：${npc.gender || '未设置'}\n`;
        const rel = normalizeRelation(npc.relation);
        const relDesc = rel.label ? `${rel.label}` : '未命名';
        const visDesc = rel.visibility === 'known' ? 'CHAR知道这段关系' : 'CHAR不知道这段关系';
        doc += `- 与${contact.name}的关系：${relDesc}（${visDesc}）\n`;
        if (npc.personality) {
            doc += `- 人设：${npc.personality}\n`;
        }
        doc += `\n`;
    });
    
    doc += `## NPC之间的关系\n\n`;
    let hasRelations = false;
    contact.npcs.forEach(npc1 => {
        if (npc1.relations && Object.keys(npc1.relations).length > 0) {
            Object.keys(npc1.relations).forEach(npc2Id => {
                const npc2 = contact.npcs.find(n => n.id === npc2Id);
                if (npc2) {
                    const r = normalizeRelation(npc1.relations[npc2Id]);
                    const label = r.label || '未命名';
                    const vis = r.visibility === 'known' ? 'CHAR可知' : 'CHAR不知';
                    doc += `- ${npc1.name} ↔ ${npc2.name}：${label}（${vis}）\n`;
                    hasRelations = true;
                }
            });
        }
    });
    if (!hasRelations) {
        doc += `暂无NPC之间的关系设置\n`;
    }
    
    // NPC与同组CHAR的关系
    doc += `\n## NPC与同分组CHAR的关系\n\n`;
    let hasCharRelations = false;
    contact.npcs.forEach(npc => {
        if (npc.charRelations && Object.keys(npc.charRelations).length > 0) {
            Object.keys(npc.charRelations).forEach(charId => {
                const otherChar = vibeContacts.find(c => c.id == charId);
                if (otherChar) {
                    const r = normalizeRelation(npc.charRelations[charId]);
                    const label = r.label || '未命名';
                    const vis = r.visibility === 'known' ? 'CHAR可知' : 'CHAR不知';
                    doc += `- ${npc.name} ↔ ${otherChar.name}：${label}（${vis}）\n`;
                    hasCharRelations = true;
                }
            });
        }
    });
    if (!hasCharRelations) {
        doc += `暂无NPC与同分组CHAR的关系设置\n`;
    }
    
    // 同组CHAR之间的关系（包括中心CHAR与同组CHAR的关系）
    if (contact.charRelations && Object.keys(contact.charRelations).length > 0) {
        doc += `\n## 同分组CHAR之间的关系\n\n`;
        Object.keys(contact.charRelations).forEach(key => {
            const ids = key.split('_');
            // id可能是中心CHAR自己或同组的其他CHAR
            const name1 = String(contact.id) == String(ids[0]) ? contact.name : (vibeContacts.find(c => c.id == ids[0]) || {}).name;
            const name2 = String(contact.id) == String(ids[1]) ? contact.name : (vibeContacts.find(c => c.id == ids[1]) || {}).name;
            if (name1 && name2) {
                const r = normalizeRelation(contact.charRelations[key]);
                const label = r.label || '未命名';
                const vis = r.visibility === 'known' ? 'CHAR可知' : 'CHAR不知';
                doc += `- ${name1} ↔ ${name2}：${label}（${vis}）\n`;
            }
        });
    }
    
    doc += `\n## 使用说明\n`;
    doc += `- 当CHAR与这些NPC互动时，请根据上述关系网络调整对话内容\n`;
    doc += `- "CHAR可知"的NPC和关系，CHAR在对话中可以提及\n`;
    doc += `- "CHAR不知"的NPC和关系，CHAR不应该知道，除非通过对话中透露\n`;
    
    contact.npcRelationsDoc = doc;
}

// 编辑NPC
function editNPC(contactId, npcId) {
    const contact = vibeContacts.find(c => c.id == contactId);
    if (!contact || !contact.npcs) return;
    
    const npc = contact.npcs.find(n => n.id === npcId);
    if (!npc) return;
    
    document.getElementById('npcModalTitle').textContent = '编辑NPC';
    document.getElementById('editingNPCContactId').value = contactId;
    document.getElementById('editingNPCId').value = npcId;
    document.getElementById('npcName').value = npc.name;
    document.getElementById('npcGender').value = npc.gender || '';
    document.getElementById('npcAvatarUrl').value = npc.avatar || '';
    document.getElementById('npcPersonality').value = npc.personality || '';
    // 兼容旧数据：relation可能是字符串或对象
    const rel = npc.relation || {};
    if (typeof rel === 'string') {
        document.getElementById('npcRelationLabel').value = '';
        document.getElementById('npcRelationVisibility').value = rel;
    } else {
        document.getElementById('npcRelationLabel').value = rel.label || '';
        document.getElementById('npcRelationVisibility').value = rel.visibility || 'known';
    }
    
    // 设置头像显示
    const avatarDisplay = document.getElementById('npcAvatarDisplay');
    if (npc.avatar) {
        avatarDisplay.innerHTML = '';
        const img = document.createElement('img');
        img.className = 'avatar-img';
        img.src = npc.avatar;
        img.alt = npc.name;
        avatarDisplay.appendChild(img);
    } else {
        avatarDisplay.innerHTML = '🤖';
    }
    
    // 加载联系人选项
    const select = document.getElementById('npcContactSelect');
    select.innerHTML = '';
    vibeContacts.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        if (c.id == contactId) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    document.getElementById('npcManagementModal').classList.add('active');
}

// 删除NPC
function deleteNPC(contactId, npcId) {
    if (!confirm('确定要删除这个NPC吗？')) return;
    
    const contact = vibeContacts.find(c => c.id == contactId);
    if (!contact || !contact.npcs) return;
    
    contact.npcs = contact.npcs.filter(n => n.id !== npcId);
    
    saveContacts();
    renderNPCList();
    alert('NPC已删除');
}

// 格式化时间
function formatTime(timeStr) {
    const time = new Date(timeStr);
    const now = new Date();
    const diff = now - time;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
    
    return time.toLocaleDateString('zh-CN');
}

// 旧的showAddMenu和renderContactsList函数已被新的分组功能替代

// 打开添加联系人页面
function openAddContact() {
    // 先打开页面
    openPage('page-add-contact');
    
    // 等待页面渲染后再填充表单
    setTimeout(() => {
        document.getElementById('editingContactId').value = '';
        document.getElementById('contactFormTitle').textContent = '添加联系人';
        
        // 清空表单
        document.getElementById('contactName').value = '';
        document.getElementById('contactNickname').value = '';
        document.getElementById('contactGroup').value = '';
        document.getElementById('contactGender').value = '';
        document.getElementById('contactPersonality').value = '';
    
    // 加载用户人设选项
    loadUserPersonaOptions();
    if (document.getElementById('contactUserPersona')) {
        document.getElementById('contactUserPersona').value = '';
        updateUserPersonaPreview();
    }
    
    document.getElementById('contactGreeting').value = '';
    document.getElementById('contactApiScheme').value = '';
    document.getElementById('contactModel').value = '';
    document.getElementById('contactNotificationSound').value = '';
    document.getElementById('contactRingtone').value = '';
    document.getElementById('contactBubbleScheme').value = 'default';
    document.getElementById('contactChatBgUrl').value = '';
    
    // 加载分组建议
    loadGroupSuggestions();
    
    // 初始化时区设置
    document.querySelector('input[name="timeMode"][value="same"]').checked = true;
    document.getElementById('sharedTimezone').value = 'Asia/Shanghai';
    document.getElementById('userTimezone').value = 'Asia/Shanghai';
    document.getElementById('aiTimezone').value = 'America/New_York';
    toggleTimeMode();
    
    // 初始化双语设置
    document.getElementById('bilingualEnabled').checked = false;
    document.getElementById('bilingualMode').value = 'zh-en';
    toggleBilingualSettings();
    
    renderContactWorldBookList([]);
    renderContactMountedBookList([]);
    
    const avatar = document.getElementById('contactAvatar');
    avatar.src = '';
    avatar.textContent = '👤';
    avatar.style.fontSize = '45px';
    
    // 清空封图
    const coverImg = document.getElementById('contactCoverImage');
    const coverPlaceholder = document.querySelector('.cover-placeholder');
    if (coverImg) {
        coverImg.src = '';
        coverImg.style.display = 'none';
    }
    if (coverPlaceholder) {
        coverPlaceholder.style.display = 'block';
    }
    document.getElementById('contactCoverUrl').value = '';
    
    // 加载 API 方案列表
    loadApiSchemeOptions();
    
    // 加载模型列表
    loadModelOptions();
    
    // 加载气泡方案
    loadBubbleSchemeOptions();
    }, 50); // 等待50ms让页面完全渲染
}

// 加载分组选项
function loadGroupSuggestions(currentGroup) {
    const select = document.getElementById('contactGroup');
    if (!select) return;
    
    // 获取所有已存在的分组（从联系人中）
    const groups = new Set();
    vibeContacts.forEach(contact => {
        if (contact.group) {
            groups.add(contact.group);
        }
    });
    
    // 添加自定义创建的分组
    const customGroups = getStorageJSON('vibe_custom_groups', []);
    customGroups.forEach(group => groups.add(group));
    
    // 保存当前选中的值（优先使用传入的参数）
    const valueToRestore = currentGroup || select.value;
    
    select.innerHTML = '<option value="">选择分组</option>';
    
    // 按字母顺序排序
    const sortedGroups = Array.from(groups).sort();
    sortedGroups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        select.appendChild(option);
    });
    
    // 恢复之前选中的值（即使不在列表中也要恢复）
    if (valueToRestore) {
        // 如果当前值不在列表中，添加它
        if (!groups.has(valueToRestore)) {
            const option = document.createElement('option');
            option.value = valueToRestore;
            option.textContent = valueToRestore;
            select.appendChild(option);
        }
        select.value = valueToRestore;
    }
}

// 加载 API 方案选项
function loadApiSchemeOptions() {
    const select = document.getElementById('contactApiScheme');
    if (!select) return;
    
    select.innerHTML = '<option value="">使用默认配置</option>';
    
    const schemes = getStorageJSON('vibe_api_schemes', []);
    schemes.forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme.id;
        option.textContent = scheme.name;
        select.appendChild(option);
    });
}

// 加载用户人设选项
function loadUserPersonaOptions() {
    const select = document.getElementById('contactUserPersona');
    if (!select) return;
    
    // 保存当前选中的值
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">不使用用户人设</option>';
    
    // 从 vibeProfilesList 加载所有用户人设
    if (typeof vibeProfilesList !== 'undefined' && vibeProfilesList.length > 0) {
        vibeProfilesList.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            option.textContent = profile.schemeName || '未命名人设';
            option.setAttribute('data-bio', profile.bio || '');
            option.setAttribute('data-name', profile.realName || '');
            option.setAttribute('data-nickname', profile.nickname || '');
            select.appendChild(option);
        });
    }
    
    // 恢复之前选中的值
    if (currentValue) {
        select.value = currentValue;
        updateUserPersonaPreview();
    }
}

// 更新用户人设预览
function updateUserPersonaPreview() {
    const select = document.getElementById('contactUserPersona');
    const preview = document.getElementById('userPersonaPreview');
    const content = document.getElementById('userPersonaContent');
    
    if (!select || !preview || !content) return;
    
    const selectedOption = select.options[select.selectedIndex];
    
    if (select.value && selectedOption) {
        const bio = selectedOption.getAttribute('data-bio') || '';
        const name = selectedOption.getAttribute('data-name') || '';
        const nickname = selectedOption.getAttribute('data-nickname') || '';
        
        let previewText = '';
        if (name) previewText += `姓名：${name}\n`;
        if (nickname) previewText += `昵称：${nickname}\n`;
        if (bio) previewText += `简介：${bio}`;
        
        content.textContent = previewText || '该人设暂无详细信息';
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

// 为联系人加载 API 方案
function loadApiSchemeForContact() {
    const schemeId = document.getElementById('contactApiScheme').value;
    const modelSelect = document.getElementById('contactModel');
    
    if (!schemeId) {
        loadModelOptions();
        return;
    }
    
    const schemes = getStorageJSON('vibe_api_schemes', []);
    const scheme = schemes.find(s => s.id === schemeId);
    
    if (scheme) {
        modelSelect.innerHTML = '';
        
        const option = document.createElement('option');
        option.value = schemeId; // 存储方案 ID 而不是模型名
        option.textContent = `${scheme.name} - ${scheme.model}`;
        option.selected = true;
        option.setAttribute('data-scheme-id', schemeId);
        option.setAttribute('data-model', scheme.model);
        modelSelect.appendChild(option);
    } else {
        loadModelOptions();
    }
}

// 加载模型选项
function loadModelOptions() {
    const select = document.getElementById('contactModel');
    select.innerHTML = '<option value="">使用默认模型</option>';
    
    // 从 localStorage 读取模型列表
    const models = getStorageJSON('availableModels', []);
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        select.appendChild(option);
    });
    
    // 如果有默认选中的模型
    const savedModel = localStorage.getItem('selectedModel'); // 这是字符串，不是JSON
    if (savedModel && !select.querySelector(`option[value="${savedModel}"]`)) {
        const option = document.createElement('option');
        option.value = savedModel;
        option.textContent = savedModel;
        select.appendChild(option);
    }
}

// 加载气泡方案选项
function loadBubbleSchemeOptions() {
    const select = document.getElementById('contactBubbleScheme');
    select.innerHTML = '';
    
    Object.keys(bubbleSchemes).forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme;
        option.textContent = scheme === 'default' ? '默认蓝色' : 
                            scheme === 'pink' ? '粉色恋人' :
                            scheme === 'blue' ? '冷静蓝调' :
                            scheme === 'green' ? '清新绿意' : scheme;
        select.appendChild(option);
    });
    
    previewBubbleScheme();
}

// 预览气泡方案
function previewBubbleScheme() {
    const scheme = document.getElementById('contactBubbleScheme').value;
    const css = bubbleSchemes[scheme] || defaultBubbleCSS;
    
    let styleEl = document.getElementById('bubblePreviewStyle');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'bubblePreviewStyle';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
}

// 预览通话气泡方案
function previewCallBubbleScheme() {
    const schemeId = document.getElementById('contactCallBubbleScheme').value;
    
    if (!schemeId || schemeId === 'default') {
        // 如果是默认样式，移除预览样式
        const oldStyle = document.getElementById('callBubblePreviewStyle');
        if (oldStyle) oldStyle.remove();
        return;
    }
    
    const schemes = getStorageJSON('vibe_call_bubble_schemes', {});
    const scheme = schemes[schemeId];
    
    if (!scheme || !scheme.css) {
        // 如果方案不存在或无效，移除预览样式
        const oldStyle = document.getElementById('callBubblePreviewStyle');
        if (oldStyle) oldStyle.remove();
        return;
    }
    
    // 移除旧预览样式
    const oldStyle = document.getElementById('callBubblePreviewStyle');
    if (oldStyle) oldStyle.remove();
    
    // 插入新预览样式
    const style = document.createElement('style');
    style.id = 'callBubblePreviewStyle';
    style.textContent = scheme.css;
    document.head.appendChild(style);
}

// 打开头像选择器
function openAvatarSelector() {
    const modal = document.getElementById('avatarSelectorModal');
    modal.classList.add('active');
    
    const grid = document.getElementById('avatarsSelectorGrid');
    grid.innerHTML = '';
    
    sharedAvatars.forEach(avatar => {
        const item = document.createElement('div');
        item.className = 'avatar-selector-item';
        
        const img = document.createElement('img');
        img.src = avatar;
        item.appendChild(img);
        
        item.onclick = () => {
            const avatarEl = document.getElementById('contactAvatar');
            avatarEl.src = avatar;
            avatarEl.style.fontSize = '0';
            closeAvatarSelector();
        };
        
        grid.appendChild(item);
    });
}

// 关闭头像选择器
function closeAvatarSelector() {
    document.getElementById('avatarSelectorModal').classList.remove('active');
}

// 应用封图URL
function applyCoverUrl() {
    const url = document.getElementById('contactCoverUrl').value.trim();
    if (!url) {
        alert('请输入封图URL');
        return;
    }
    
    const img = document.getElementById('contactCoverImage');
    const placeholder = document.querySelector('.cover-placeholder');
    
    img.src = url;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
}

// 上传封图
function uploadCoverImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('contactCoverImage');
        const placeholder = document.querySelector('.cover-placeholder');
        
        img.src = e.target.result;
        img.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        
        document.getElementById('contactCoverUrl').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 清除封图
function clearCoverImage() {
    const img = document.getElementById('contactCoverImage');
    const placeholder = document.querySelector('.cover-placeholder');
    
    img.src = '';
    img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
    
    document.getElementById('contactCoverUrl').value = '';
}

// 保存联系人
function saveContact() {
    const name = document.getElementById('contactName').value.trim();
    if (!name) {
        alert('请输入姓名');
        return;
    }
    
    const editingId = document.getElementById('editingContactId').value;
    const avatarEl = document.getElementById('contactAvatar');
    const avatarUrl = avatarEl.src && !avatarEl.src.includes('message.html') ? avatarEl.src : '';
    
    const apiScheme = document.getElementById('contactApiScheme').value;
    let model = document.getElementById('contactModel').value;
    
    // 如果选择了 API 方案，从方案中获取模型
    if (apiScheme) {
        const schemes = getStorageJSON('vibe_api_schemes', []);
        const scheme = schemes.find(s => s.id === apiScheme);
        if (scheme) {
            model = scheme.model;
        }
    }
    
    // 获取时区设置
    const timeMode = document.querySelector('input[name="timeMode"]:checked').value;
    const timezoneSettings = {
        mode: timeMode,
        sharedTimezone: document.getElementById('sharedTimezone').value,
        userTimezone: document.getElementById('userTimezone').value,
        aiTimezone: document.getElementById('aiTimezone').value
    };
    
    // 获取双语设置
    const bilingualSettings = {
        enabled: document.getElementById('bilingualEnabled').checked,
        mode: document.getElementById('bilingualMode').value
    };
    
    // 获取 TTS 设置
    const ttsSettings = {
        enabled: document.getElementById('ttsEnabled').checked,
        voiceId: document.getElementById('ttsVoiceId').value.trim(),
        language: document.getElementById('ttsLanguage').value,
        speed: parseFloat(document.getElementById('ttsSpeed').value)
    };
    
    // 获取分组 - 支持下拉选择和手动输入
    const groupSelect = document.getElementById('contactGroup');
    let groupValue = '';
    if (groupSelect.tagName === 'SELECT') {
        groupValue = groupSelect.value.trim();
    } else if (groupSelect.tagName === 'INPUT') {
        groupValue = groupSelect.value.trim();
    }
    
    // 获取封面图URL
    const coverImageUrl = document.getElementById('contactCoverUrl').value.trim();
    
    // 获取用户人设
    const userPersonaId = document.getElementById('contactUserPersona') ? 
        document.getElementById('contactUserPersona').value : '';
    
    let userPersona = '';
    if (userPersonaId && typeof vibeProfilesList !== 'undefined') {
        const profile = vibeProfilesList.find(p => p.id === parseInt(userPersonaId));
        if (profile) {
            // 构建完整的用户人设信息
            let personaParts = [];
            if (profile.realName) personaParts.push(`姓名：${profile.realName}`);
            if (profile.nickname) personaParts.push(`昵称：${profile.nickname}`);
            if (profile.bio) personaParts.push(profile.bio);
            userPersona = personaParts.join('；');
        }
    }
    
    // 解析自动回复规则（按行：状态 => 文本）
    const autoReplyRaw = document.getElementById('autoReplyRulesInput') ? document.getElementById('autoReplyRulesInput').value : '';
    const autoReplyRules = [];
    if (autoReplyRaw && autoReplyRaw.trim()) {
        autoReplyRaw.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            const parts = trimmed.split('=>');
            if (parts.length >= 2) {
                const status = parts[0].trim();
                const text = parts.slice(1).join('=>').trim();
                if (status && text) {
                    autoReplyRules.push({ status, text });
                }
            }
        });
    }
    
    const worldBookIds = [];
    const worldBookList = document.getElementById('contactWorldBookList');
    if (worldBookList) {
        const checkboxes = worldBookList.querySelectorAll('input[type="checkbox"][data-worldbook-id]');
        checkboxes.forEach(cb => {
            if (cb.checked) {
                worldBookIds.push(cb.getAttribute('data-worldbook-id'));
            }
        });
    }
    
    const mountedBooks = [];
    const mountedBookList = document.getElementById('contactMountedBookList');
    if (mountedBookList) {
        const checkboxes = mountedBookList.querySelectorAll('input[type="checkbox"][data-mounted-book-id]');
        checkboxes.forEach(cb => {
            if (cb.checked) {
                mountedBooks.push(cb.getAttribute('data-mounted-book-id'));
            }
        });
    }
    
    const contactData = {
        name: name,
        nickname: document.getElementById('contactNickname').value.trim(),
        group: groupValue || '默认分组',
        gender: document.getElementById('contactGender').value,
        personality: document.getElementById('contactPersonality').value.trim(),
        greeting: document.getElementById('contactGreeting').value.trim(),
        apiScheme: apiScheme,
        model: model,
        notificationSound: document.getElementById('contactNotificationSound').value.trim(),
        ringtone: document.getElementById('contactRingtone').value.trim(),
        bubbleScheme: document.getElementById('contactBubbleScheme').value,
        callBubbleScheme: document.getElementById('contactCallBubbleScheme').value,
        avatarUrl: avatarUrl,
        coverImageUrl: coverImageUrl,
        chatBackground: document.getElementById('contactChatBgUrl').value.trim(),
        timezoneSettings: timezoneSettings,
        bilingualSettings: bilingualSettings,
        ttsSettings: ttsSettings,
        userPersona: userPersona,
        userPersonaId: userPersonaId,
        autoReplyRules: autoReplyRules,
        worldBookIds: worldBookIds,
        mountedBooks: mountedBooks
    };
    
    console.log('保存联系人数据:', contactData); // 调试日志
    
    if (editingId) {
        // 编辑现有联系人
        const contact = vibeContacts.find(c => c.id === parseInt(editingId));
        if (contact) {
            Object.assign(contact, contactData);
            console.log('更新后的联系人:', contact); // 调试日志
        }
    } else {
        // 新建联系人
        const newContact = {
            id: Date.now(),
            ...contactData,
            chat_history: [],
            moments: [],
            npcs: [],
            createdAt: new Date().toISOString()
        };
        
        vibeContacts.push(newContact);
        
        // 如果有初次见面语，添加到聊天记录
        if (contactData.greeting) {
            newContact.chat_history.push({
                id: Date.now(),
                sender: 'contact',
                message: contactData.greeting,
                timestamp: new Date().toISOString()
            });
            
            // 显示通知
            setTimeout(() => {
                showNotification(newContact, contactData.greeting);
            }, 500);
        }
    }
    
    saveContacts();
    closePageToMain('page-add-contact');
    renderContactsGroups();
    
    alert(editingId ? '联系人已更新' : '联系人已添加');
}

// 打开聊天页面
function openChat(contactId) {
    console.log('openChat called with contactId:', contactId);
    const contact = vibeContacts.find(c => c.id === contactId);
    if (!contact) {
        console.error('Contact not found:', contactId);
        return;
    }
    console.log('Contact found:', contact.name);
    
    currentChatContactId = contactId;
    
    // 清空待发送队列
    pendingMessages = [];
    updateMergeSendButton();
    
    // 清除之前的总结请求（如果有）
    if (window.currentSummaryRequest) {
        const dialog = document.querySelector('.summary-confirm-dialog');
        if (dialog) {
            dialog.remove();
        }
        window.currentSummaryRequest = null;
    }
    
    // 清除之前的重新生成请求（如果有）
    if (window.currentRegenerateRequest) {
        const dialog = document.querySelector('.summary-confirm-dialog');
        if (dialog) {
            dialog.remove();
        }
        window.currentRegenerateRequest = null;
    }
    
    // 更新聊天头部
    const chatAvatar = document.getElementById('chatAvatar');
    const chatName = document.getElementById('chatName');
    const chatStatus = document.getElementById('chatStatus');
    
    if (contact.avatarUrl) {
        chatAvatar.src = contact.avatarUrl;
        chatAvatar.style.fontSize = '0';
    } else {
        chatAvatar.textContent = '👤';
        chatAvatar.style.fontSize = '20px';
    }
    
    chatName.textContent = contact.nickname || contact.name;
    
    // 检查AI自动状态系统是否已设置状态
    let shouldSetStatus = true;
    if (window.AIAutoStatus && window.AIAutoStatus.isRunning) {
        try {
            const aiStatus = AIAutoStatus.statusManager.getCurrentStatus(contact.id);
            if (aiStatus && aiStatus.currentStatus) {
                // AI系统已设置状态，不覆盖
                shouldSetStatus = false;
                console.log('🤖 [聊天页面] 使用AI自动状态:', aiStatus.currentStatus);
            }
        } catch (error) {
            console.warn('⚠️ [聊天页面] 获取AI状态失败，使用默认状态:', error);
        }
    }
    
    // 只有在AI系统未设置状态时才使用联系人的静态状态
    if (shouldSetStatus) {
        chatStatus.textContent = contact.status || '在线';
    }
    
    if (window.AIAutoStatus && AIAutoStatus.statusManager) {
        try {
            AIAutoStatus.statusManager.checkAndUpdateStatus(contact.id);
        } catch (error) {
            console.warn('⚠️ [聊天页面] 触发联系人状态快速检查失败:', error);
        }
    }
    
    // 应用自定义图标
    if (contact.customIcons) {
        const tokenBtn = document.querySelector('button[onclick="openTokenAnalysis()"]');
        const memoryBtn = document.querySelector('button[onclick="openMemoryBank()"]');
        const regenerateBtn = document.querySelector('button[onclick="showRegenerateMenu()"]');
        const voiceBtn = document.getElementById('voiceFunctionIcon');
        const editBtn = document.getElementById('messageEditIcon');
        const favoritesBtn = document.getElementById('favoritesIcon');
        
        if (tokenBtn && contact.customIcons.tokenAnalysis) {
            const img = tokenBtn.querySelector('img');
            if (img) {
                img.src = contact.customIcons.tokenAnalysis;
            }
        }
        
        if (memoryBtn && contact.customIcons.memoryBank) {
            const img = memoryBtn.querySelector('img');
            if (img) {
                img.src = contact.customIcons.memoryBank;
            }
        }
        
        if (regenerateBtn && contact.customIcons.regenerate) {
            const img = regenerateBtn.querySelector('img');
            if (img) {
                img.src = contact.customIcons.regenerate;
            }
        }
        
        if (voiceBtn && contact.customIcons.voice) {
            voiceBtn.src = contact.customIcons.voice;
        }
        
        if (editBtn && contact.customIcons.messageEdit) {
            editBtn.src = contact.customIcons.messageEdit;
        }
        
        if (favoritesBtn && contact.customIcons.favorites) {
            favoritesBtn.src = contact.customIcons.favorites;
        }
    }
    
    // 应用管理图标
    if (contact.managementIcons) {
        loadManagementIcons(contact);
    }
    
    // 应用聊天背景到聊天页面
    const chatPage = document.getElementById('page-chat');
    if (contact.chatBackground) {
        chatPage.style.backgroundImage = `url(${contact.chatBackground})`;
        chatPage.style.backgroundSize = 'cover';
        chatPage.style.backgroundPosition = 'center';
        chatPage.style.backgroundRepeat = 'no-repeat';
        chatPage.style.backgroundAttachment = 'fixed';
    } else {
        chatPage.style.backgroundImage = '';
        chatPage.style.backgroundSize = '';
        chatPage.style.backgroundPosition = '';
        chatPage.style.backgroundRepeat = '';
        chatPage.style.backgroundAttachment = '';
    }
    
    // 应用气泡样式
    applyChatBubbleStyle(contact.bubbleScheme || 'default');
    
    // 应用通话气泡样式
    applyCallBubbleStyle(contact);
    
    // 渲染聊天记录
    renderChatMessages();
    
    openPage('page-chat');
    
    // 直接滚动到底部，不使用 setTimeout
    requestAnimationFrame(() => {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

// 应用聊天气泡样式
function applyChatBubbleStyle(scheme) {
    const css = bubbleSchemes[scheme] || defaultBubbleCSS;
    
    let styleEl = document.getElementById('chatBubbleStyle');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'chatBubbleStyle';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
}

// 应用通话气泡样式
function applyCallBubbleStyle(contact) {
    if (!contact || !contact.callBubbleScheme || contact.callBubbleScheme === 'default') {
        // 如果是默认样式，移除自定义样式
        const oldStyle = document.getElementById('callBubbleCustomStyle');
        if (oldStyle) oldStyle.remove();
        return;
    }
    
    const schemes = getStorageJSON('vibe_call_bubble_schemes', {});
    const scheme = schemes[contact.callBubbleScheme];
    
    if (!scheme || !scheme.css) {
        // 如果方案不存在或无效，移除自定义样式
        const oldStyle = document.getElementById('callBubbleCustomStyle');
        if (oldStyle) oldStyle.remove();
        return;
    }
    
    // 移除旧样式
    const oldStyle = document.getElementById('callBubbleCustomStyle');
    if (oldStyle) oldStyle.remove();
    
    // 插入新样式
    const style = document.createElement('style');
    style.id = 'callBubbleCustomStyle';
    style.textContent = scheme.css;
    document.head.appendChild(style);
}

// 渲染聊天消息
function renderChatMessages() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 确保旧数据也有 chat_history 数组，防止崩溃
    if (!contact.chat_history) contact.chat_history = [];
    
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    contact.chat_history.forEach(msg => {
        const messageEl = createMessageElement(msg, contact);
        container.appendChild(messageEl);
    });
}

// 创建消息元素
function createMessageElement(msg, contact) {
    const div = document.createElement('div');
    div.className = `chat-message ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    const profile = getCurrentProfile();
    const avatar = msg.sender === 'user' ? profile.avatarUrl : contact.avatarUrl;
    
    const time = new Date(msg.timestamp).toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // 创建时间戳（放在头像远端）
    const timeDiv = document.createElement('div');
    timeDiv.className = 'chat-message-time';
    timeDiv.textContent = time;
    
    // 创建头像
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-message-avatar';
    
    // 增加判断：如果 avatar 是一个正常的 URL 才显示 img
    if (avatar && (avatar.startsWith('http') || avatar.startsWith('data:image'))) {
        const img = document.createElement('img');
        img.src = avatar;
        img.className = 'avatar-img';
        avatarDiv.appendChild(img);
    } else {
        // 否则显示一个默认图标或名字首字符
        avatarDiv.textContent = contact.name ? contact.name.charAt(0) : '👤';
    }
    
    // 创建消息内容
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-message-content';
    
    // 根据消息类型创建不同的气泡
    let bubbleDiv;
    if (msg.role === 'system_call') {
        // 通话记录气泡
        bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble system-call';
        
        // 用户视角：显示简短文本
        bubbleDiv.textContent = msg.display_text || `通话结束 ${msg.duration || 0}秒`;
        bubbleDiv.title = '点击查看通话详情';
        
        // 点击查看详情
        bubbleDiv.onclick = () => {
            const content = msg.message || msg.hidden_content || '无通话内容';
            alert('通话记录：\n\n' + content);
        };
    } else if (msg.type === 'sticker') {
        bubbleDiv = createStickerBubble(msg, contact);
    } else if (msg.type === 'voice') {
        bubbleDiv = createVoiceBubble(msg, contact);
    } else if (msg.type === 'image') {
        bubbleDiv = createImageBubble(msg, contact);
    } else if (msg.type === 'video') {
        bubbleDiv = createVideoBubble(msg, contact);
    } else if (msg.type === 'video_call') {
        bubbleDiv = createVideoCallRecordBubble(msg, contact);
    } else if (msg.type === 'voice_call') {
        bubbleDiv = createVoiceCallRecordBubble(msg, contact);
    } else if (msg.type === 'alipay_task_card') {
        bubbleDiv = createAlipayTaskBubble(msg, contact);
    } else if (msg.type === 'shop_gift') {
        bubbleDiv = createShopGiftBubble(msg, contact);
    } else if (msg.type === 'shop_payment_request') {
        bubbleDiv = createPaymentRequestBubble(msg, contact);
    } else if (msg.type === 'weibo_share') {
        bubbleDiv = createWeiboShareBubble(msg, contact);
    } else {
        // 普通文本消息
        bubbleDiv = createTextBubble(msg, contact);
    }
    
    // 添加编辑模式支持（但不覆盖语音气泡和双语消息的原有点击事件）
    bubbleDiv.dataset.msgId = msg.id;
    
    // 检查是否是双语消息
    const isBilingualMessage = bubbleDiv.classList.contains('bilingual-message');
    
    // 为非语音、非双语、非通话记录气泡添加点击事件
    if (msg.type !== 'voice' && !isBilingualMessage && msg.role !== 'system_call') {
        bubbleDiv.onclick = function(e) {
            if (isEditMode) {
                e.stopPropagation();
                bubbleDiv.classList.toggle('selected');
                toggleMessageSelection(msg.id);
            }
        };
    } else if (msg.type === 'voice') {
        // 语音气泡：保留原有的点击事件，但在编辑模式下添加选择功能
        const originalOnClick = bubbleDiv.onclick;
        bubbleDiv.onclick = function(e) {
            if (isEditMode) {
                e.stopPropagation();
                bubbleDiv.classList.toggle('selected');
                toggleMessageSelection(msg.id);
            } else if (originalOnClick) {
                originalOnClick.call(this, e);
            }
        };
    } else if (isBilingualMessage) {
        // 双语消息：保留原有的点击事件，但在编辑模式下添加选择功能
        const originalOnClick = bubbleDiv.onclick;
        bubbleDiv.onclick = function(e) {
            if (isEditMode) {
                e.stopPropagation();
                bubbleDiv.classList.toggle('selected');
                toggleMessageSelection(msg.id);
            } else if (originalOnClick) {
                originalOnClick.call(this, e);
            }
        };
    }
    
    // 添加双击收藏功能
    bubbleDiv.ondblclick = function(e) {
        if (!isEditMode) {
            e.stopPropagation();
            addToFavorites(msg, contact);
        }
    };
    
    // 为特殊类型消息添加原始文本属性（用于编辑模式显示）
    if (msg.type === 'voice') {
        bubbleDiv.setAttribute('data-raw-text', `[VOICE:${msg.tone}]${msg.message}`);
    } else if (msg.type === 'image') {
        bubbleDiv.setAttribute('data-raw-text', `[IMAGE]${msg.description || ''}`);
    } else if (msg.type === 'video') {
        bubbleDiv.setAttribute('data-raw-text', `[VIDEO]${msg.description || ''}`);
    } else if (msg.type === 'sticker') {
        bubbleDiv.setAttribute('data-raw-text', `[STICKER:${msg.stickerName}]`);
    } else if (msg.type === 'alipay_task_card') {
        bubbleDiv.setAttribute('data-raw-text', msg.message || '');
    } else if (msg.type === 'weibo_share') {
        const w = msg.weiboData || {};
        bubbleDiv.setAttribute('data-raw-text', `[微博分享] ${w.postAuthor || ''}(${w.postIdentity || ''}): ${w.postContent || ''}`);
    }
    
    // 创建包含气泡和时间戳的容器
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.style.display = 'flex';
    bubbleWrapper.style.alignItems = 'flex-end';
    bubbleWrapper.style.gap = '8px';
    
    if (msg.sender === 'user') {
        // 发送消息：时间戳在左，气泡在右
        bubbleWrapper.style.flexDirection = 'row-reverse';
        bubbleWrapper.appendChild(bubbleDiv);
        bubbleWrapper.appendChild(timeDiv);
    } else {
        // 接收消息：气泡在左，时间戳在右
        bubbleWrapper.appendChild(bubbleDiv);
        bubbleWrapper.appendChild(timeDiv);
    }
    
    contentDiv.appendChild(bubbleWrapper);
    
    // 组装消息结构
    div.appendChild(avatarDiv);
    div.appendChild(contentDiv);
    
    return div;
}

// 创建支付宝任务卡气泡
function createAlipayTaskBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble alipay-task-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;

    // 解析消息文本提取任务
    const lines = (msg.message || '').split('\n').filter(l => l.trim());
    let dateTitle = '';
    const tasks = [];
    let footer = '';

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('📋')) {
            dateTitle = trimmed.replace('📋', '').trim();
        } else if (/^[☐✅❌]/.test(trimmed)) {
            const match = trimmed.match(/^([☐✅❌])\s*(.+?)\s+\+(\d+)$/);
            if (match) {
                tasks.push({ icon: match[1], name: match[2], points: match[3] });
            } else {
                tasks.push({ icon: trimmed[0], name: trimmed.slice(1).trim(), points: '' });
            }
        } else if (trimmed && !dateTitle) {
            dateTitle = trimmed;
        } else if (trimmed) {
            footer = trimmed;
        }
    }

    // 卡片头部
    const header = document.createElement('div');
    header.className = 'atb-header';
    header.innerHTML = `<span class="atb-logo">💰</span><span class="atb-title">${dateTitle || '支付宝情侣任务'}</span>`;
    bubbleDiv.appendChild(header);

    // 任务列表
    if (tasks.length > 0) {
        const list = document.createElement('div');
        list.className = 'atb-tasks';
        tasks.forEach(t => {
            const row = document.createElement('div');
            row.className = 'atb-task-row';
            const iconClass = t.icon === '✅' ? 'done' : t.icon === '❌' ? 'rejected' : 'pending';
            row.innerHTML = `<span class="atb-icon ${iconClass}">${t.icon}</span><span class="atb-name">${t.name}</span>${t.points ? `<span class="atb-pts">+${t.points}</span>` : ''}`;
            list.appendChild(row);
        });
        bubbleDiv.appendChild(list);
    }

    // 底部
    if (footer) {
        const ft = document.createElement('div');
        ft.className = 'atb-footer';
        ft.textContent = footer;
        bubbleDiv.appendChild(ft);
    }

    return bubbleDiv;
}

// ==================== 商店礼物气泡 ====================
function createShopGiftBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble shop-gift-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    const g = msg.giftData || {};
    const statusMap = { accepted: '✅ 已接受', rejected: '❌ 已拒收', pending_accept: '⏳ 等待确认' };
    const statusText = statusMap[g.status] || '⏳ 等待确认';
    let reasonHtml = '';
    if (g.status === 'rejected' && g.rejectReason) {
        reasonHtml = `<div class="gift-card-reason" style="font-size:11px;color:#ef4444;margin-top:4px;">原因：${g.rejectReason}</div>`;
    }
    bubbleDiv.innerHTML = `
        <div class="gift-card">
            <div class="gift-card-icon">${g.emoji || '🎁'}</div>
            <div class="gift-card-info">
                <div class="gift-card-name">${g.name || '礼物'}</div>
                <div class="gift-card-price">💰 ${g.price || 0}</div>
                ${reasonHtml}
            </div>
            <div class="gift-card-status">${statusText}</div>
        </div>`;
    return bubbleDiv;
}

// ==================== 代付请求气泡 ====================
function createPaymentRequestBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble shop-payment-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    const p = msg.paymentData || {};
    const statusMap = { paid: '✅ 已代付', rejected: '❌ 已拒绝', pending: '⏳ 等待代付' };
    const statusText = statusMap[p.status] || '⏳ 等待代付';
    let reasonHtml = '';
    if (p.status === 'rejected' && p.rejectReason) {
        reasonHtml = `<div class="payment-card-reason" style="font-size:11px;color:#ef4444;margin-top:4px;">原因：${p.rejectReason}</div>`;
    }
    bubbleDiv.innerHTML = `
        <div class="payment-card">
            <div class="payment-card-icon">${p.emoji || '💳'}</div>
            <div class="payment-card-info">
                <div class="payment-card-name">${p.name || '商品'}</div>
                <div class="payment-card-price">💰 ${p.price || 0}</div>
                ${reasonHtml}
            </div>
            <div class="payment-card-status">${statusText}</div>
        </div>`;
    return bubbleDiv;
}

function createWeiboShareBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble weibo-share-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    const w = msg.weiboData || {};
    const contentPreview = (w.postContent || '').length > 80 ? w.postContent.substring(0, 80) + '...' : (w.postContent || '');
    const topicHtml = w.postTopic ? `<div class="weibo-share-topic">#${w.postTopic}#</div>` : '';
    bubbleDiv.innerHTML = `
        <div class="weibo-share-card">
            <div class="weibo-share-header">
                <span class="weibo-share-icon">🌐</span>
                <span class="weibo-share-label">世界微博</span>
            </div>
            <div class="weibo-share-body">
                <div class="weibo-share-author">${w.postAuthor || '未知'}${w.postIdentity ? ' · ' + w.postIdentity : ''}</div>
                <div class="weibo-share-content">${contentPreview}</div>
                ${topicHtml}
            </div>
        </div>`;
    return bubbleDiv;
}


// 创建文本气泡
function createTextBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    // 添加已总结标记
    if (msg.summarized) {
        bubbleDiv.classList.add('summarized');
    }
    
    // 检查是否是报告/日记分享消息
    const isReport = msg.message && (msg.message.startsWith('=====') || msg.message.startsWith('[日记分享]'));
    
    if (isReport) {
        bubbleDiv.classList.add('report-bubble');
        const reportHtml = formatReportBubble(msg.message);
        bubbleDiv.innerHTML = reportHtml;
        return bubbleDiv;
    }
    
    // 检查是否是双语消息（仅对 AI 回复）
    if (msg.sender === 'contact' && contact.bilingualSettings && contact.bilingualSettings.enabled) {
        const parsed = parseBilingualMessage(msg.message);
        
        if (parsed.hasBilingual) {
            // 双语消息
            const originalText = document.createElement('div');
            originalText.className = 'bilingual-original';
            originalText.textContent = parsed.original;
            
            const translationText = document.createElement('div');
            translationText.className = 'bilingual-translation';
            translationText.textContent = extractTranslations(parsed.fullText);
            translationText.style.display = 'none';
            
            bubbleDiv.appendChild(originalText);
            bubbleDiv.appendChild(translationText);
            
            // 添加点击切换功能
            bubbleDiv.style.cursor = 'pointer';
            bubbleDiv.onclick = function() {
                if (translationText.style.display === 'none') {
                    translationText.style.display = 'block';
                } else {
                    translationText.style.display = 'none';
                }
            };
            
            // 添加双语标识
            bubbleDiv.classList.add('bilingual-message');
        } else {
            // 普通消息
            bubbleDiv.textContent = msg.message;
        }
    } else {
        // 用户消息或未启用双语
        bubbleDiv.textContent = msg.message;
    }
    
    return bubbleDiv;
}

// 格式化报告消息为HTML
function formatReportBubble(text) {
    const lines = text.split('\n');
    let html = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 报告标题行 ===== 日报 =====
        if (line.match(/^=====.*=====$/)) {
            const title = line.replace(/=/g, '').trim();
            html += `<div class="report-title">${title}</div>`;
        }
        // 日期范围行
        else if (line.startsWith('日期范围：')) {
            html += `<div class="report-date">${line}</div>`;
        }
        // 日记分享标记
        else if (line.startsWith('[日记分享]')) {
            html += `<div class="report-title">📖 日记分享</div>`;
            html += `<div class="report-section-content">${line.replace('[日记分享] ', '')}</div>`;
        }
        // 分区标题（emoji开头）
        else if (/^[📋📝🏃💰😊💤🧴🩸🏋🚽🍽️📖]/.test(line.trim()) && !line.trim().startsWith('-')) {
            html += `<div class="report-section-title">${line.trim()}</div>`;
        }
        // 列表项
        else if (line.trim().startsWith('- ')) {
            html += `<div class="report-item">${line.trim()}</div>`;
        }
        // 统计行（完成率等）
        else if (line.trim().match(/^(完成率|平均|共\d)/)) {
            html += `<div class="report-stat">${line.trim()}</div>`;
        }
        // 收支行
        else if (line.trim().match(/^收入：|^支出：/)) {
            html += `<div class="report-stat">${line.trim()}</div>`;
        }
        // 其他非空行
        else if (line.trim()) {
            html += `<div class="report-line">${line.trim()}</div>`;
        }
    }
    
    return html;
}

// 创建语音气泡
function createVoiceBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble voice-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    // 添加已总结标记
    if (msg.summarized) {
        bubbleDiv.classList.add('summarized');
    }
    
    // 计算语音条长度（根据文字长度，但设置最大值）
    const textLength = msg.message.length;
    const duration = Math.min(Math.ceil(textLength / 5), 60); // 估算秒数，最大 60 秒
    
    // 创建语音条（iOS 风格：5 个波形条）
    const voiceBar = document.createElement('div');
    voiceBar.className = 'voice-bar';
    voiceBar.innerHTML = `
        <div class="voice-duration">${duration}″</div>
        <div class="voice-waves">
            <div class="voice-wave"></div>
            <div class="voice-wave"></div>
            <div class="voice-wave"></div>
            <div class="voice-wave"></div>
            <div class="voice-wave"></div>
        </div>
    `;
    
    // 创建语音内容（使用 max-height 过渡而不是 display）
    const voiceContent = document.createElement('div');
    voiceContent.className = 'voice-content';
    voiceContent.innerHTML = `<div class="voice-tone">(${msg.tone})</div><div>${msg.message}</div>`;
    
    // 点击切换显示
    bubbleDiv.style.cursor = 'pointer';
    bubbleDiv.onclick = function(e) {
        // 先展开内容
        if (!voiceContent.classList.contains('visible')) {
            voiceContent.classList.add('visible');
            voiceBar.classList.add('playing');
        }
        
        // 如果是 AI 消息且启用了 TTS，播放音频
        if (msg.sender === 'contact' && contact.ttsSettings && contact.ttsSettings.enabled) {
            playTtsAudio(msg, contact, bubbleDiv);
        }
    };
    
    // 长按重新生成 TTS
    let longPressTimer;
    bubbleDiv.onmousedown = bubbleDiv.ontouchstart = function(e) {
        if (msg.sender === 'contact' && contact.ttsSettings && contact.ttsSettings.enabled) {
            longPressTimer = setTimeout(() => {
                showRegenerateTtsDialog(msg, contact, bubbleDiv);
            }, 800); // 长按 800ms
        }
    };
    
    bubbleDiv.onmouseup = bubbleDiv.onmouseleave = bubbleDiv.ontouchend = function(e) {
        clearTimeout(longPressTimer);
    };
    
    bubbleDiv.appendChild(voiceBar);
    bubbleDiv.appendChild(voiceContent);
    
    return bubbleDiv;
}

// 创建表情包气泡
function createStickerBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble sticker-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    // 添加已总结标记
    if (msg.summarized) {
        bubbleDiv.classList.add('summarized');
    }
    
    const img = document.createElement('img');
    img.src = msg.stickerUrl;
    img.alt = msg.stickerName;
    img.title = msg.stickerName;
    
    bubbleDiv.appendChild(img);
    
    return bubbleDiv;
}

// 创建图片气泡
function createImageBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble image-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    // 添加已总结标记
    if (msg.summarized) {
        bubbleDiv.classList.add('summarized');
    }
    
    // 获取默认图片
    const defaultImage = (contact.messageFormatSettings && contact.messageFormatSettings.defaultImageUrl) || 
                        'https://files.catbox.moe/gd7ol9.jpg';
    
    const imageUrl = msg.imageUrl || defaultImage;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'message-image';
    img.alt = '图片';
    
    // 预设尺寸，防止加载时跳动
    img.style.width = '200px';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    
    // 点击查看描述
    img.onclick = function() {
        showImageDescription(msg, contact);
    };
    
    bubbleDiv.appendChild(img);
    
    return bubbleDiv;
}

// 创建视频气泡
function createVideoBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble video-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    // 添加已总结标记
    if (msg.summarized) {
        bubbleDiv.classList.add('summarized');
    }
    
    // 获取默认图片
    const defaultVideo = (contact.messageFormatSettings && contact.messageFormatSettings.defaultVideoUrl) || 
                        'https://i.ibb.co/prxBykPd/video-default.jpg';
    
    const videoUrl = msg.videoUrl || defaultVideo;
    
    const videoThumb = document.createElement('div');
    videoThumb.className = 'video-thumbnail';
    videoThumb.style.backgroundImage = `url(${videoUrl})`;
    
    // 预设尺寸，防止加载时跳动
    videoThumb.style.width = '200px';
    videoThumb.style.height = '150px';
    videoThumb.style.minHeight = '150px';
    
    const playIcon = document.createElement('div');
    playIcon.className = 'video-play-icon';
    playIcon.textContent = '▶';
    
    videoThumb.appendChild(playIcon);
    
    // 点击查看描述
    videoThumb.onclick = function() {
        showVideoDescription(msg, contact);
    };
    
    bubbleDiv.appendChild(videoThumb);
    
    return bubbleDiv;
}

// 显示图片描述
function showImageDescription(msg, contact) {
    const description = msg.description || '这是一张图片';
    const imageUrl = msg.imageUrl || ((contact.messageFormatSettings && contact.messageFormatSettings.defaultImageUrl) || 'https://files.catbox.moe/gd7ol9.jpg');
    
    const dialog = document.createElement('div');
    dialog.className = 'summary-confirm-dialog active';
    dialog.innerHTML = `
        <div class="summary-confirm-content">
            <div class="summary-confirm-header">
                <h3>🖼️ 图片消息</h3>
            </div>
            <div class="summary-confirm-body">
                <img src="${imageUrl}" 
                     style="width: 100%; border-radius: 12px; margin-bottom: 15px;">
                <p style="font-size: 15px; line-height: 1.6; color: #2c3e50;">${description}</p>
            </div>
            <div class="summary-confirm-actions">
                <button class="btn-primary" onclick="this.closest('.summary-confirm-dialog').remove()" style="width: 100%;">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// 显示视频描述
function showVideoDescription(msg, contact) {
    const description = msg.description || '这是一个视频';
    const videoUrl = msg.videoUrl || ((contact.messageFormatSettings && contact.messageFormatSettings.defaultVideoUrl) || 'https://i.ibb.co/prxBykPd/video-default.jpg');
    
    const dialog = document.createElement('div');
    dialog.className = 'summary-confirm-dialog active';
    dialog.innerHTML = `
        <div class="summary-confirm-content">
            <div class="summary-confirm-header">
                <h3>🎬 视频消息</h3>
            </div>
            <div class="summary-confirm-body">
                <img src="${videoUrl}" 
                     style="width: 100%; border-radius: 12px; margin-bottom: 15px;">
                <p style="font-size: 15px; line-height: 1.6; color: #2c3e50;">${description}</p>
            </div>
            <div class="summary-confirm-actions">
                <button class="btn-primary" onclick="this.closest('.summary-confirm-dialog').remove()" style="width: 100%;">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// 创建视频通话记录气泡
function createVideoCallRecordBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble video-call-record-bubble received';
    
    // 添加已总结标记
    if (msg.summarized) {
        bubbleDiv.classList.add('summarized');
    }
    
    const header = document.createElement('div');
    header.className = 'video-call-record-header';
    header.innerHTML = '📹 视频通话';
    
    const duration = document.createElement('div');
    duration.className = 'video-call-record-duration';
    
    // 使用 display_text 或计算时长文本
    if (msg.display_text) {
        duration.textContent = msg.display_text;
    } else {
        const minutes = Math.floor(msg.duration / 60);
        const seconds = msg.duration % 60;
        duration.textContent = `通话结束 ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    bubbleDiv.appendChild(header);
    bubbleDiv.appendChild(duration);
    
    // 点击查看详情
    bubbleDiv.onclick = function() {
        showVideoCallRecordDetails(msg, contact);
    };
    
    return bubbleDiv;
}

// 创建语音通话记录气泡
function createVoiceCallRecordBubble(msg, contact) {
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble voice-call-record-bubble received';
    
    // 添加已总结标记
    if (msg.summarized) {
        bubbleDiv.classList.add('summarized');
    }
    
    const header = document.createElement('div');
    header.className = 'voice-call-record-header';
    header.innerHTML = '🎤 语音通话';
    
    const duration = document.createElement('div');
    duration.className = 'voice-call-record-duration';
    
    // 使用 display_text
    duration.textContent = msg.display_text || '通话结束';
    
    bubbleDiv.appendChild(header);
    bubbleDiv.appendChild(duration);
    
    // 点击查看详情（显示完整通话内容）
    bubbleDiv.onclick = function() {
        showVoiceCallRecordDetails(msg, contact);
    };
    
    return bubbleDiv;
}

// 显示视频通话记录详情
function showVideoCallRecordDetails(msg, contact) {
    const modal = document.getElementById('videoCallRecordModal');
    const body = document.getElementById('videoCallRecordModalBody');
    
    body.innerHTML = '';
    
    // 计算开始和结束时间
    const startTime = new Date(msg.timestamp);
    const endTime = new Date(startTime.getTime() + (msg.duration * 1000));
    
    // 计算时长文本
    const minutes = Math.floor(msg.duration / 60);
    const seconds = msg.duration % 60;
    const durationText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // 添加通话信息
    const info = document.createElement('div');
    info.style.cssText = 'padding: 16px; background: linear-gradient(135deg, #FFF5F7 0%, #FFE4E9 100%); border-radius: 12px; margin-bottom: 20px; border: 2px solid #FFB6C1;';
    info.innerHTML = `
        <div style="font-size: 14px; color: #666; margin-bottom: 6px;">
            ⏰ 开始时间: ${startTime.toLocaleString('zh-CN')}
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 6px;">
            ⏱️ 结束时间: ${endTime.toLocaleString('zh-CN')}
        </div>
        <div style="font-size: 14px; color: #666;">
            ⌛ 通话时长: ${durationText}
        </div>
    `;
    body.appendChild(info);
    
    // 获取用户信息
    const profile = getCurrentProfile();
    const userName = profile.nickname || '我';
    const userAvatar = profile.avatarUrl || '';
    const contactName = contact.nickname || contact.name;
    const contactAvatar = contact.avatarUrl || '';
    
    // 添加消息列表
    if (msg.messages && msg.messages.length > 0) {
        msg.messages.forEach(m => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `video-call-record-message ${m.sender === 'user' ? 'user' : 'contact'}`;
            
            // 创建消息结构：头像 + 名字 + 内容
            const isUser = m.sender === 'user';
            const avatar = isUser ? userAvatar : contactAvatar;
            const name = isUser ? userName : contactName;
            
            msgDiv.innerHTML = `
                <div class="record-msg-avatar">
                    ${avatar ? `<img src="${avatar}" alt="${name}">` : `<div class="record-msg-avatar-text">${name.charAt(0)}</div>`}
                </div>
                <div class="record-msg-content">
                    <div class="record-msg-name">${name}</div>
                    <div class="record-msg-text">${m.message}</div>
                </div>
            `;
            body.appendChild(msgDiv);
        });
    } else {
        const empty = document.createElement('p');
        empty.style.cssText = 'text-align: center; color: #999; padding: 40px; font-size: 16px;';
        empty.textContent = '📭 暂无消息记录';
        body.appendChild(empty);
    }
    
    modal.classList.add('active');
}

// 显示语音通话记录详情
function showVoiceCallRecordDetails(msg, contact) {
    // 使用与视频通话相同的模态框
    showVideoCallRecordDetails(msg, contact);
}

// 关闭视频通话记录详情
function closeVideoCallRecordModal() {
    const modal = document.getElementById('videoCallRecordModal');
    modal.classList.remove('active');
}

// 处理聊天输入回车
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 发送消息（不调用 AI，只添加到待发送队列）
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentChatContactId) return;
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    console.log('发送消息到队列:', message);
    
    // 添加用户消息到聊天记录
    const userMsg = {
        id: Date.now(),
        sender: 'user',
        message: message,
        timestamp: new Date().toISOString()
    };
    
    contact.chat_history.push(userMsg);
    
    // 添加到待发送队列
    pendingMessages.push(message);
    
    saveContacts();
    
    // 清空输入框
    input.value = '';
    
    // 渲染消息
    const container = document.getElementById('chatMessages');
    container.appendChild(createMessageElement(userMsg, contact));
    
    // 使用 requestAnimationFrame 优化滚动，防止抖动
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
    
    // 更新合并发送按钮状态
    updateMergeSendButton();
    
    // 检查是否需要提示用户总结（在用户发送消息后）
    checkAndPromptSummary(contact);
}

// 智能分割回复成1-8条气泡（模拟真实聊天）
function smartSplitReplies(reply) {
    // 先按换行符分割
    let parts = reply.split('\n').filter(r => r.trim());
    
    // 如果只有1条，尝试按句子分割
    if (parts.length === 1) {
        // 按句号、问号、感叹号分割，但保留标点
        parts = reply.match(/[^。！？\n]+[。！？]?/g) || [reply];
        parts = parts.map(p => p.trim()).filter(p => p);
    }
    
    // 如果分割后太多，合并一些
    if (parts.length > 8) {
        const targetCount = Math.floor(Math.random() * 4) + 5; // 5-8条
        const newParts = [];
        const chunkSize = Math.ceil(parts.length / targetCount);
        
        for (let i = 0; i < parts.length; i += chunkSize) {
            newParts.push(parts.slice(i, i + chunkSize).join(' '));
        }
        parts = newParts;
    }
    
    // 如果分割后太少，尝试进一步分割
    if (parts.length < 2 && parts[0] && parts[0].length > 50) {
        const text = parts[0];
        const targetCount = Math.floor(Math.random() * 4) + 2; // 2-5条
        const chunkSize = Math.ceil(text.length / targetCount);
        parts = [];
        
        for (let i = 0; i < text.length; i += chunkSize) {
            parts.push(text.slice(i, i + chunkSize).trim());
        }
    }
    
    // 确保至少有1条，最多8条
    if (parts.length === 0) parts = [reply];
    if (parts.length > 8) parts = parts.slice(0, 8);
    
    return parts;
}

// 更新合并发送按钮
function updateMergeSendButton() {
    const btn = document.querySelector('.chat-merge-send-btn');
    if (pendingMessages.length > 0) {
        btn.classList.add('has-pending');
        btn.setAttribute('data-count', pendingMessages.length);
    } else {
        btn.classList.remove('has-pending');
        btn.removeAttribute('data-count');
    }
}

// 合并发送所有待发送的消息
async function mergeSendMessages() {
    if (pendingMessages.length === 0) {
        alert('没有待发送的消息');
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 合并所有消息
    const mergedMessage = pendingMessages.join('\n');
    
    // 清空待发送队列
    pendingMessages = [];
    updateMergeSendButton();
    
    // 显示"正在输入中"状态
    showTypingIndicator(contact);
    
    // 调用 AI 获取回复
    await getAIResponse(contact, mergedMessage);
    
    // 隐藏"正在输入中"状态
    hideTypingIndicator(contact);
    
    // AI回复完成后，检查是否需要提示用户总结
    checkAndPromptSummary(contact);
}

// 显示"正在输入中"状态
function showTypingIndicator(contact) {
    const nameEl = document.getElementById('chatName');
    const statusEl = document.getElementById('chatStatus');
    const typingEl = document.getElementById('typingIndicator');
    
    nameEl.textContent = `${contact.name}正在输入中...`;
    nameEl.classList.add('typing');
    statusEl.style.display = 'none';
    typingEl.classList.add('active');
}

// 隐藏"正在输入中"状态
function hideTypingIndicator(contact) {
    const nameEl = document.getElementById('chatName');
    const statusEl = document.getElementById('chatStatus');
    const typingEl = document.getElementById('typingIndicator');
    
    nameEl.textContent = contact.name;
    nameEl.classList.remove('typing');
    statusEl.style.display = 'block';
    typingEl.classList.remove('active');
}

// 获取 AI 回复
async function getAIResponse(contact, userMessage) {
    let apiUrl, apiKey, model;
    
    console.log('🔍 [聊天] 当前联系人:', contact.name, 'API方案ID:', contact.apiScheme);
    
    // 优先使用联系人的 API 方案
    if (contact.apiScheme) {
        const schemes = getStorageJSON('vibe_api_schemes', []);
        console.log('📋 [聊天] 所有API方案:', schemes);
        
        const scheme = schemes.find(s => s.id === contact.apiScheme);
        if (scheme) {
            apiUrl = scheme.apiUrl;
            apiKey = scheme.apiKey;
            model = scheme.model;
            console.log('✅ [聊天] 使用联系人API方案:', scheme.name, '模型:', model);
        } else {
            console.warn('⚠️ [聊天] 联系人API方案不存在(ID:' + contact.apiScheme + ')');
        }
    }
    
    // 如果没有方案，使用全局配置
    if (!apiUrl) {
        apiUrl = localStorage.getItem('apiUrl'); // 这是字符串，不是JSON
        apiKey = localStorage.getItem('apiKey'); // 这是字符串，不是JSON
        model = contact.model || localStorage.getItem('selectedModel'); // 这是字符串，不是JSON
        console.log('🌐 [聊天] 使用全局API配置');
    }
    
    if (!apiUrl || !apiKey) {
        console.warn('⚠️ [聊天] 无API配置，使用模拟回复');
        // 模拟回复
        setTimeout(() => {
            const mockReplies = generateMockReplies(contact, userMessage);
            sendRepliesOneByOne(contact, mockReplies);
        }, 1000);
        return;
    }
    
    try {
        const systemPrompt = buildTimezoneAwarePrompt(contact, userMessage);
        
        let autoReplyContext = '';
        try {
            if (window.AIAutoStatus && AIAutoStatus.statusManager) {
                const aiStatus = AIAutoStatus.statusManager.getCurrentStatus(contact.id);
                const rules = contact.autoReplyRules || [];
                if (aiStatus && aiStatus.currentStatus && rules.length > 0) {
                    const matchedRule = matchAutoReplyRule(aiStatus, rules);
                    if (matchedRule) {
                        const currentStatusText = aiStatus.currentStatus;
                        autoReplyContext = `\n\n[自动回复策略]\n当前你的状态是「${currentStatusText}」。用户为这个状态配置了一条自动回复信息：\n「${matchedRule.text}」。\n你需要根据自己的性格、与用户的亲密度和当下状态来决定：\n- 有一定概率你会直接被吵醒并亲自回复用户（正常AI回复）；\n- 也有一定概率你没有醒来，只让系统自动发送上面的自动回复文本。\n如果你选择自动回复，请只返回自动回复文本本身，不要添加其他说明。请你自己在心里掷硬币决策，不要向用户解释这个机制。`;
                        console.log('📮 [自动回复] 命中状态规则:', {
                            contactId: contact.id,
                            status: currentStatusText,
                            rule: matchedRule
                        });
                    }
                }
            }
        } catch (e) {
            console.warn('⚠️ [自动回复] 构建自动回复提示词失败:', e);
        }
        
        // 添加结构化记忆内容
        let memoryContext = '';
        const smText = formatStructuredMemory(contact);
        if (smText) {
            memoryContext = '\n\n' + smText;
        }

        let coupleMemoryContext = '';
        try {
            if (window.CoupleSpace && contact.id != null) {
                const bank = CoupleSpace.loadCoupleMemoryBank(contact.id);
                if (bank) {
                    const parts = [];
                    const settings = bank.settings || {};
                    const dailyCount = typeof settings.injectDaily === 'number' ? settings.injectDaily : 3;
                    const weeklyCount = typeof settings.injectWeekly === 'number' ? settings.injectWeekly : 1;
                    const monthlyCount = typeof settings.injectMonthly === 'number' ? settings.injectMonthly : 1;
                    const yearlyCount = typeof settings.injectYearly === 'number' ? settings.injectYearly : 1;

                    function pickActive(list, n) {
                        if (!Array.isArray(list) || n <= 0) return [];
                        // Sort by date descending to get recent ones
                        const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
                        const active = sorted.filter(m => m && (m.active !== false));
                        return active.slice(0, n);
                    }

                    const dailies = pickActive(bank.daily, dailyCount);
                    if (dailies.length > 0) parts.push('【日】' + dailies.map(m => m.content).join('; '));
                    
                    const weeklies = pickActive(bank.weekly, weeklyCount);
                    if (weeklies.length > 0) parts.push('【周】' + weeklies.map(m => m.content).join('; '));
                    
                    const monthlies = pickActive(bank.monthly, monthlyCount);
                    if (monthlies.length > 0) parts.push('【月】' + monthlies.map(m => m.content).join('; '));
                    
                    const yearlies = pickActive(bank.yearly, yearlyCount);
                    if (yearlies.length > 0) parts.push('【年】' + yearlies.map(m => m.content).join('; '));

                    if (parts.length > 0) {
                        coupleMemoryContext =
                            '\n\n[情侣空间记忆] 以下是基于情侣空间生成的精简总结：\n' +
                            parts.join('\n');
                        console.log('✅ [聊天] 注入情侣空间记忆:', parts.length + '条');
                    }
                }
            }
        } catch (e) {
            console.warn('⚠️ [聊天] 注入情侣空间记忆失败:', e);
        }
        
        // 获取上下文窗口大小（从Token分析设置中读取）
        const contextWindowSize =
            (contact.summarySettings && contact.summarySettings.contextWindowSize) ||
            10;
        // 构建带时间感知的消息列表
        const recentHistory = contact.chat_history.slice(-contextWindowSize)
            .filter(msg => msg.message && msg.message.trim());
        const historyMessages = [];
        let prevTimestamp = null;
        for (const msg of recentHistory) {
            const ts = msg.timestamp ? new Date(msg.timestamp) : null;
            // 如果与上一条消息间隔超过1小时，插入时间标记
            if (ts && prevTimestamp) {
                const gapMs = ts - prevTimestamp;
                const gapHours = gapMs / (1000 * 60 * 60);
                if (gapHours >= 24) {
                    const days = Math.floor(gapHours / 24);
                    historyMessages.push({ role: 'system', content: `[过了${days}天]` });
                } else if (gapHours >= 1) {
                    const hours = Math.floor(gapHours);
                    historyMessages.push({ role: 'system', content: `[过了${hours}小时]` });
                }
            }
            if (ts) prevTimestamp = ts;
            historyMessages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.message
            });
        }
        // 获取论坛发帖历史（跨页面读取 localStorage）
        let forumPostMemoryContext = '';
        try {
            const forumWorlds = JSON.parse(localStorage.getItem('forum_worlds') || '[]');
            const charId = contact.id;
            if (charId && forumWorlds.length) {
                const allEntries = [];
                for (const world of forumWorlds) {
                    const key = `forum_char_post_memory_${world.id}_${charId}`;
                    const entries = JSON.parse(localStorage.getItem(key) || '[]');
                    for (const e of entries) allEntries.push(e);
                }
                if (allEntries.length) {
                    allEntries.sort((a, b) => b.timestamp - a.timestamp);
                    const recent = allEntries.slice(0, 10);
                    const lines = recent.map(e => {
                        const dateStr = new Date(e.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
                        return `- ${e.summary} (${dateStr})`;
                    });
                    forumPostMemoryContext = '\n\n[论坛动态] 你最近在论坛发过的内容：\n' + lines.join('\n');
                    console.log('✅ [聊天] 注入论坛发帖记忆:', recent.length + '条');
                }
            }
        } catch (e) {
            console.warn('⚠️ [聊天] 读取论坛发帖记忆失败:', e);
        }

        // 获取世界微博活动摘要（跨页面读取 localStorage）
        let weiboActivityContext = '';
        try {
            const charId = contact.id;
            if (charId) {
                const summary = localStorage.getItem(`couple_twitter_activity_${charId}`);
                if (summary) {
                    weiboActivityContext = '\n\n' + summary;
                    console.log('✅ [聊天] 注入世界微博活动摘要');
                }
            }
        } catch (e) {
            console.warn('⚠️ [聊天] 读取世界微博活动摘要失败:', e);
        }

        const messages = [
            {
                role: 'system',
                content: systemPrompt + memoryContext + coupleMemoryContext + forumPostMemoryContext + weiboActivityContext + autoReplyContext
            },
            ...historyMessages
        ];
        
        console.log('📤 [聊天] 发送API请求:', apiUrl, '模型:', model);
        console.log('📝 [聊天] 消息数量:', messages.length);
        
        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [聊天] API请求失败:', response.status, errorText);
            
            // 尝试解析错误信息
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.error && errorData.error.message) {
                    throw new Error(`API错误: ${errorData.error.message}`);
                }
            } catch (e) {
                // 如果不是JSON格式，使用原始错误
            }
            
            throw new Error(`API 请求失败 (${response.status}): ${errorText.substring(0, 200)}`);
        }
        
        const data = await response.json();
        console.log('📥 [聊天] API返回数据:', data);
        
        // 检查是否是错误响应（有些API即使200也返回错误）
        if (data.error) {
            console.error('❌ [聊天] API返回错误:', data.error);
            throw new Error(`API错误: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        // 尝试从不同的API格式中提取回复
        let reply = null;
        
        // OpenAI格式: data.choices[0].message.content
        if (data.choices && data.choices[0] && data.choices[0].message) {
            reply = data.choices[0].message.content;
            console.log('✅ [聊天] 使用OpenAI格式');
        }
        // Gemini格式: data.candidates[0].content.parts[0].text
        else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            if (parts && parts[0] && parts[0].text) {
                reply = parts[0].text;
                console.log('✅ [聊天] 使用Gemini格式');
            }
        }
        // Claude格式: data.content[0].text
        else if (data.content && data.content[0] && data.content[0].text) {
            reply = data.content[0].text;
            console.log('✅ [聊天] 使用Claude格式');
        }
        // 直接返回文本: data.text 或 data.response
        else if (data.text) {
            reply = data.text;
            console.log('✅ [聊天] 使用简单文本格式 (text)');
        }
        else if (data.response) {
            reply = data.response;
            console.log('✅ [聊天] 使用简单文本格式 (response)');
        }
        
        // 如果所有格式都不匹配
        if (!reply) {
            console.error('❌ [聊天] 无法识别的API返回格式:', JSON.stringify(data, null, 2));
            throw new Error('API返回数据格式不支持\n\n请检查：\n1. API端点是否正确\n2. 模型名称是否正确\n3. 查看控制台了解详细的返回数据');
        }
        
        console.log('AI原始回复:', reply);
        
        // ==================== CHAR 自主购买检测 ====================
        reply = processCharGift(reply, contact);
        
        // 检查是否启用了双语模式
        const isBilingual = contact.bilingualSettings && contact.bilingualSettings.enabled;
        
        let replies;
        if (isBilingual) {
            // 双语模式：按句子分割，保持 <translate> 标签完整
            console.log('双语模式启用');
            replies = splitBilingualReplies(reply);
        } else {
            // 普通模式：智能分割成1-8条气泡
            replies = smartSplitReplies(reply);
        }
        
        console.log('分割后的气泡数:', replies.length, replies);
        
        // 一条一条发送
        await sendRepliesOneByOne(contact, replies);
        
        // 检查是否需要自动总结
        checkAutoSummary(contact);
        
    } catch (error) {
        console.error('❌ [聊天] AI 回复错误:', error);
        const mockReplies = generateMockReplies(contact, userMessage);
        await sendRepliesOneByOne(contact, mockReplies);
    }
}

// 分割双语回复（保持每个句子的原文和翻译在一起）
function splitBilingualReplies(text) {
    // 方法1：使用正则表达式匹配完整的双语句子
    // 匹配：任意字符（非贪婪） + <translate>内容</translate>
    const bilingualPattern = /.+?<translate>.+?<\/translate>/gs;
    const matches = text.match(bilingualPattern);
    
    if (matches && matches.length > 0) {
        // 找到双语格式的句子
        const sentences = matches.map(m => m.trim()).filter(m => m);
        
        // 检查是否还有剩余内容（没有翻译标签的部分）
        let remainingText = text;
        matches.forEach(match => {
            remainingText = remainingText.replace(match, '');
        });
        
        // 如果有剩余内容，按行分割并添加
        const remaining = remainingText.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.includes('<translate>'));
        
        return [...sentences, ...remaining];
    }
    
    // 如果没有找到双语格式，按普通方式分割
    return text.split('\n').map(line => line.trim()).filter(line => line);
}

// 生成模拟回复（多条）
function generateMockReplies(contact, userMessage) {
    const replyGroups = [
        ['收到你的消息了！', '让我想想...', '这个想法不错呢'],
        ['明白了', '我理解你的意思', '有什么我可以帮助的吗？'],
        ['好的', '我知道了', '还有其他问题吗？'],
        ['有意思！', '这确实值得思考', '我们可以继续聊聊这个话题']
    ];
    
    return replyGroups[Math.floor(Math.random() * replyGroups.length)];
}

function matchAutoReplyRule(aiStatus, rules) {
    const currentStatusText = aiStatus.currentStatus || '';
    const activityType = aiStatus.activityType || '';
    if (!rules || rules.length === 0) return null;
    
    for (const rule of rules) {
        const label = (rule.status || '').trim();
        if (!label) continue;
        if (currentStatusText && (label === currentStatusText || currentStatusText.includes(label) || label.includes(currentStatusText))) {
            return rule;
        }
    }
    
    if (!activityType) return null;
    
    for (const rule of rules) {
        const label = (rule.status || '').trim();
        if (!label) continue;
        const mapped = mapLabelToActivityType(label);
        if (mapped && mapped === activityType) {
            return rule;
        }
    }
    
    return null;
}

function mapLabelToActivityType(label) {
    const text = String(label || '').toLowerCase();
    
    if (/[睡眠就寝午睡晚睡打盹]/.test(label) || text.includes('sleep')) {
        return 'sleep';
    }
    if (/[会议开会碰头]/.test(label) || text.includes('meeting')) {
        return 'meeting';
    }
    if (/[工作上班办公写代码处理邮件review调试]/.test(label) || text.includes('work')) {
        return 'work';
    }
    if (/[学习自习备考听课阅读复习]/.test(label) || text.includes('study')) {
        return 'study';
    }
    if (/[早餐早饭午餐午饭晚餐晚饭夜宵用餐吃饭咖啡下午茶]/.test(label) || text.includes('meal')) {
        return 'meal';
    }
    if (/[运动健身跑步瑜伽骑行游泳锻炼]/.test(label) || text.includes('exercise')) {
        return 'exercise';
    }
    if (/[休息放松小憩冥想发呆散步]/.test(label) || text.includes('rest')) {
        return 'rest';
    }
    if (/[娱乐游戏看剧电影追番音乐逛街]/.test(label) || text.includes('entertainment')) {
        return 'entertainment';
    }
    if (/[起床洗漱通勤出门回家抵达]/.test(label)) {
        return 'free';
    }
    
    return '';
}

// 一条一条发送回复
async function sendRepliesOneByOne(contact, replies) {
    for (let i = 0; i < replies.length; i++) {
        // 每条消息之间延迟 800-1500ms
        const delay = 800 + Math.random() * 700;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const reply = replies[i].trim();
        if (!reply) continue;
        
        addContactMessage(contact, reply, false); // false 表示不播放提示音（避免连续播放）
    }
    
    // 最后一条消息播放提示音
    if (contact.notificationSound) {
        playSound(contact.notificationSound);
    }
}

// 添加联系人消息
function addContactMessage(contact, message, playNotification = true) {
    // 检测消息类型标记
    const messageData = parseAIMessageFormat(message, contact);
    
    const contactMsg = {
        id: Date.now() + Math.random(), // 确保唯一性
        sender: 'contact',
        type: messageData.type,
        message: messageData.message,
        tone: messageData.tone,
        imageUrl: messageData.imageUrl,
        videoUrl: messageData.videoUrl,
        description: messageData.description,
        stickerName: messageData.stickerName,
        stickerUrl: messageData.stickerUrl,
        timestamp: new Date().toISOString()
    };
    
    contact.chat_history.push(contactMsg);
    saveContacts();
    
    // 渲染消息
    const container = document.getElementById('chatMessages');
    container.appendChild(createMessageElement(contactMsg, contact));
    
    // 使用 requestAnimationFrame 优化滚动，防止抖动
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
    
    // 播放提示音
    if (playNotification && contact.notificationSound) {
        playSound(contact.notificationSound);
    }
    
    // 如果不在聊天页面，显示通知
    const chatPage = document.getElementById('page-chat');
    if (!chatPage.classList.contains('active')) {
        showNotification(contact, messageData.message);
    }
}

// 解析 AI 消息格式
function parseAIMessageFormat(message, contact) {
    // 检测表情包消息: [STICKER:表情包名称]
    const stickerMatch = message.match(/^\[STICKER:(.+?)\]$/s);
    if (stickerMatch) {
        const stickerName = stickerMatch[1].trim();
        
        // 从联系人的表情包设置中查找
        let stickerUrl = null;
        if (contact.stickers && contact.stickers.length > 0) {
            const sticker = contact.stickers.find(s => s.name === stickerName);
            if (sticker) {
                stickerUrl = sticker.url;
            }
        }
        
        // 如果联系人没有设置，从全局表情包中查找
        if (!stickerUrl) {
            const stickersArr = (globalStickers && globalStickers.stickers) || (Array.isArray(globalStickers) ? globalStickers : []);
            const globalSticker = stickersArr.find(s => s.name === stickerName);
            if (globalSticker) {
                stickerUrl = globalSticker.url;
            }
        }
        
        return {
            type: 'sticker',
            stickerName: stickerName,
            stickerUrl: stickerUrl || 'https://i.ibb.co/yFDN2pB/image.png' // 默认图片
        };
    }
    
    // 检测语音消息: [VOICE:语气]"内容" 或 [VOICE:语气]内容
    const voiceMatch = message.match(/^\[VOICE:(.+?)\](.+)$/s);
    if (voiceMatch) {
        const tone = voiceMatch[1].trim();
        let content = voiceMatch[2].trim();
        
        // 提取引号内的文本（如果有）
        const quotedMatch = content.match(/^[""](.+?)[""]$/s);
        if (quotedMatch) {
            content = quotedMatch[1].trim();
        }
        
        return {
            type: 'voice',
            message: content,  // 这是实际要朗读的文本（可能包含语气词标签）
            tone: tone         // 这是语气描述（用于显示）
        };
    }
    
    // 检测图片消息: [IMAGE]描述内容
    const imageMatch = message.match(/^\[IMAGE\](.+)$/s);
    if (imageMatch) {
        const defaultImage = (contact.messageFormatSettings && contact.messageFormatSettings.defaultImageUrl) || 
                            'https://files.catbox.moe/gd7ol9.jpg';
        return {
            type: 'image',
            message: '',  // 不显示文字，只显示图片
            description: imageMatch[1].trim(),
            imageUrl: defaultImage
        };
    }
    
    // 检测视频消息: [VIDEO]描述内容
    const videoMatch = message.match(/^\[VIDEO\](.+)$/s);
    if (videoMatch) {
        const defaultVideo = (contact.messageFormatSettings && contact.messageFormatSettings.defaultVideoUrl) || 
                            'https://i.ibb.co/prxBykPd/video-default.jpg';
        return {
            type: 'video',
            message: '',  // 不显示文字，只显示视频缩略图
            description: videoMatch[1].trim(),
            videoUrl: defaultVideo
        };
    }
    
    // 普通文本消息
    return {
        type: 'text',
        message: message
    };
}

// 显示通知
function showNotification(contact, message) {
    const banner = document.getElementById('notificationBanner');
    const avatar = document.getElementById('notificationAvatar');
    const title = document.getElementById('notificationTitle');
    const msg = document.getElementById('notificationMessage');
    
    if (contact.avatarUrl) {
        avatar.src = contact.avatarUrl;
        avatar.style.fontSize = '0';
    } else {
        avatar.textContent = '👤';
        avatar.style.fontSize = '22px';
    }
    
    title.textContent = contact.nickname || contact.name;
    msg.textContent = message;
    
    banner.classList.add('show');
    
    // 播放提示音
    if (contact.notificationSound) {
        playSound(contact.notificationSound);
    }
    
    // 3秒后自动隐藏
    setTimeout(() => {
        banner.classList.remove('show');
    }, 3000);
    
    // 点击通知打开聊天
    banner.onclick = () => {
        banner.classList.remove('show');
        openChat(contact.id);
    };
}

// 播放声音
function playSound(url) {
    try {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('播放声音失败:', e));
    } catch (e) {
        console.log('播放声音失败:', e);
    }
}

// 打开气泡自定义器
function openBubbleCustomizer() {
    const modal = document.getElementById('bubbleCustomizerModal');
    modal.classList.add('active');
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) {
        // 如果没有当前联系人，使用默认方案
        document.getElementById('bubbleSchemeName').value = '';
        document.getElementById('bubbleCustomCSS').value = defaultBubbleCSS;
    } else {
        // 获取当前联系人使用的气泡方案
        const currentScheme = contact.bubbleScheme || 'default';
        const currentCSS = bubbleSchemes[currentScheme] || defaultBubbleCSS;
        
        // 显示当前方案的CSS作为参考
        document.getElementById('bubbleSchemeName').value = '';
        document.getElementById('bubbleCustomCSS').value = currentCSS;
    }
    
    // 添加提示信息
    const textarea = document.getElementById('bubbleCustomCSS');
    textarea.placeholder = '当前联系人使用的气泡样式CSS（可参照修改）';
    
    // 加载可删除的方案列表
    loadBubbleSchemesToDelete();
    
    updateBubbleCustomPreview();
    
    // 实时预览
    document.getElementById('bubbleCustomCSS').oninput = updateBubbleCustomPreview;
}

// 加载可删除的气泡方案列表
function loadBubbleSchemesToDelete() {
    const select = document.getElementById('bubbleSchemeToDelete');
    if (!select) return;
    
    select.innerHTML = '<option value="">选择要删除的方案</option>';
    
    Object.keys(bubbleSchemes).forEach(scheme => {
        // 跳过内置方案
        if (scheme === 'default' || scheme === 'pink' || 
            scheme === 'blue' || scheme === 'green') {
            return;
        }
        
        const option = document.createElement('option');
        option.value = scheme;
        option.textContent = scheme;
        select.appendChild(option);
    });
}

// 关闭气泡自定义器
function closeBubbleCustomizer() {
    document.getElementById('bubbleCustomizerModal').classList.remove('active');
}

// 打开通话记录气泡自定义器
function openCallBubbleCustomizer() {
    const modal = document.getElementById('callBubbleCustomizerModal');
    if (!modal) {
        console.error('找不到callBubbleCustomizerModal元素');
        return;
    }
    modal.classList.add('active');
    
    // 加载当前联系人的通话气泡设置（如果有）
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (contact && contact.callBubbleScheme && contact.callBubbleScheme !== 'default') {
        // 加载自定义方案
        const schemes = getStorageJSON('vibe_call_bubble_schemes', {});
        const scheme = schemes[contact.callBubbleScheme];
        if (scheme) {
            document.getElementById('callBubbleSchemeName').value = scheme.name || '';
            document.getElementById('callBubbleCustomCSS').value = scheme.css || '';
            updateCallBubbleCustomPreview();
        }
    } else {
        // 加载默认模板
        document.getElementById('callBubbleSchemeName').value = '';
        document.getElementById('callBubbleCustomCSS').value = getDefaultCallBubbleCSS();
        updateCallBubbleCustomPreview();
    }
    
    // 加载可删除的方案列表
    loadCallBubbleSchemesToDelete();
}

// 加载可删除的通话气泡方案列表
function loadCallBubbleSchemesToDelete() {
    const select = document.getElementById('callBubbleSchemeToDelete');
    if (!select) return;
    
    select.innerHTML = '<option value="">选择要删除的方案</option>';
    
    const schemes = getStorageJSON('vibe_call_bubble_schemes', {});
    
    // 过滤掉无效的方案（没有 name 或 css 的）
    const validSchemes = Object.values(schemes).filter(scheme => {
        return scheme && scheme.name && scheme.css && scheme.id;
    });
    
    if (validSchemes.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "暂无可删除的方案";
        option.disabled = true;
        select.appendChild(option);
        return;
    }
    
    validSchemes.forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme.id;
        option.textContent = scheme.name;
        select.appendChild(option);
    });
}

// 关闭通话记录气泡自定义器
function closeCallBubbleCustomizer() {
    const modal = document.getElementById('callBubbleCustomizerModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 获取默认通话气泡CSS模板
function getDefaultCallBubbleCSS() {
    return `/* 通话记录气泡自定义样式 - 使用 CSS 变量 */

/* 修改这些变量即可自定义通话气泡的颜色 */
:root {
    /* 视频通话气泡背景（支持渐变） */
    --video-call-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    /* 语音通话气泡背景（支持渐变） */
    --voice-call-bg: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    
    /* 通话气泡文字颜色 */
    --call-bubble-color: #FFFFFF;
    
    /* 通话气泡边框颜色 */
    --call-bubble-border: #000000;
    
    /* 通话气泡阴影颜色 */
    --call-bubble-shadow: rgba(0, 0, 0, 0.2);
}

/* 示例：纯色背景 */
/*
:root {
    --video-call-bg: #8d6e63;
    --voice-call-bg: #e59a91;
    --call-bubble-color: white;
    --call-bubble-border: #5d4037;
    --call-bubble-shadow: rgba(0, 0, 0, 0.2);
}
*/

/* 示例：透明背景 */
/*
:root {
    --video-call-bg: rgba(102, 126, 234, 0.8);
    --voice-call-bg: rgba(240, 147, 251, 0.8);
    --call-bubble-color: white;
    --call-bubble-border: rgba(255, 255, 255, 0.5);
    --call-bubble-shadow: rgba(0, 0, 0, 0.3);
}
*/`;
}

// 更新通话气泡自定义预览
function updateCallBubbleCustomPreview() {
    const css = document.getElementById('callBubbleCustomCSS').value;
    
    let styleEl = document.getElementById('callBubbleCustomPreviewStyle');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'callBubbleCustomPreviewStyle';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
}

// 保存通话气泡方案
function saveCallBubbleScheme() {
    const name = document.getElementById('callBubbleSchemeName').value.trim();
    const css = document.getElementById('callBubbleCustomCSS').value.trim();
    
    if (!name) {
        alert('请输入方案名称');
        return;
    }
    
    if (!css) {
        alert('请输入 CSS 样式代码');
        return;
    }
    
    const schemeId = Date.now().toString();
    const schemes = getStorageJSON('vibe_call_bubble_schemes', {});
    
    // 确保保存完整的方案数据
    schemes[schemeId] = {
        id: schemeId,
        name: name,
        css: css,
        createdAt: new Date().toISOString()
    };
    
    // 立即保存到 localStorage
    setStorageJSON('vibe_call_bubble_schemes', schemes);
    
    // 验证保存是否成功
    const savedSchemes = getStorageJSON('vibe_call_bubble_schemes', {});
    if (!savedSchemes[schemeId]) {
        alert('保存失败，请重试');
        return;
    }
    
    // 应用到当前联系人
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (contact) {
        contact.callBubbleScheme = schemeId;
        saveContacts();
        
        // 如果当前正在聊天页面，立即应用样式并重新渲染
        if (currentChatContactId === contact.id) {
            applyCallBubbleStyle(contact);
            renderChatMessages(); // 重新渲染当前聊天消息
        }
    }
    
    // 重新加载方案选项
    loadCallBubbleSchemeOptions();
    
    // 关闭弹窗
    closeCallBubbleCustomizer();
    
    alert(`通话气泡方案「${name}」已保存并应用`);
}

// 加载通话气泡方案选项
function loadCallBubbleSchemeOptions() {
    const select = document.getElementById('contactCallBubbleScheme');
    if (!select) return;
    
    const schemes = getStorageJSON('vibe_call_bubble_schemes', {});
    
    // 清空现有选项（保留默认选项）
    select.innerHTML = '<option value="default">默认样式（跟随聊天气泡）</option>';
    
    // 过滤并添加有效的自定义方案
    const validSchemes = Object.values(schemes).filter(scheme => {
        return scheme && scheme.name && scheme.css && scheme.id;
    });
    
    validSchemes.forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme.id;
        option.textContent = scheme.name;
        select.appendChild(option);
    });
}

// 删除通话气泡方案
function deleteCallBubbleScheme() {
    const select = document.getElementById('callBubbleSchemeToDelete');
    if (!select) return;
    
    const schemeIdToDelete = select.value;
    
    if (!schemeIdToDelete) {
        alert('请选择要删除的方案');
        return;
    }
    
    const schemes = getStorageJSON('vibe_call_bubble_schemes', {});
    const scheme = schemes[schemeIdToDelete];
    
    if (!scheme) {
        alert('未找到该方案');
        return;
    }
    
    if (!confirm(`确定要删除方案「${scheme.name}」吗？`)) {
        return;
    }
    
    // 删除方案
    delete schemes[schemeIdToDelete];
    setStorageJSON('vibe_call_bubble_schemes', schemes);
    
    // 检查所有联系人，如果使用了这个方案，都重置为默认
    vibeContacts.forEach(c => {
        if (c.callBubbleScheme === schemeIdToDelete) {
            c.callBubbleScheme = 'default';
        }
    });
    saveContacts();
    
    // 重新加载方案选项
    loadCallBubbleSchemeOptions();
    loadCallBubbleSchemesToDelete();
    
    alert('方案已删除');
}

// 更新气泡自定义预览
function updateBubbleCustomPreview() {
    const css = document.getElementById('bubbleCustomCSS').value;
    
    let styleEl = document.getElementById('bubbleCustomPreviewStyle');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'bubbleCustomPreviewStyle';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
}

// 保存气泡方案
function saveBubbleScheme() {
    const name = document.getElementById('bubbleSchemeName').value.trim();
    const css = document.getElementById('bubbleCustomCSS').value.trim();
    
    if (!name) {
        alert('请输入方案名称');
        return;
    }
    
    if (!css) {
        alert('请输入 CSS 代码');
        return;
    }
    
    bubbleSchemes[name] = css;
    saveBubbleSchemes();
    
    closeBubbleCustomizer();
    loadBubbleSchemeOptions();
    
    document.getElementById('contactBubbleScheme').value = name;
    previewBubbleScheme();
    
    alert(`方案 "${name}" 已保存`);
}

// 删除气泡方案
function deleteBubbleScheme() {
    const select = document.getElementById('bubbleSchemeToDelete');
    if (!select) return;
    
    const schemeToDelete = select.value;
    
    if (!schemeToDelete) {
        alert('请选择要删除的方案');
        return;
    }
    
    // 不能删除默认方案
    if (schemeToDelete === 'default' || schemeToDelete === 'pink' || 
        schemeToDelete === 'blue' || schemeToDelete === 'green') {
        alert('无法删除内置方案');
        return;
    }
    
    if (!bubbleSchemes[schemeToDelete]) {
        alert('未找到该方案');
        return;
    }
    
    if (!confirm(`确定要删除方案「${schemeToDelete}」吗？`)) {
        return;
    }
    
    // 删除方案
    delete bubbleSchemes[schemeToDelete];
    saveBubbleSchemes();
    
    // 检查所有联系人，如果使用了这个方案，都重置为默认
    vibeContacts.forEach(c => {
        if (c.bubbleScheme === schemeToDelete) {
            c.bubbleScheme = 'default';
        }
    });
    saveContacts();
    
    // 重新加载方案选项
    loadBubbleSchemeOptions();
    loadBubbleSchemesToDelete();
    
    alert('方案已删除');
}

// 初始化时加载联系人
loadContacts();

// 检测世界微博分享内容
setTimeout(() => {
    try {
        const shareRaw = localStorage.getItem('couple_twitter_share_to_chat');
        if (shareRaw) {
            const share = JSON.parse(shareRaw);
            // 检查是否在10秒内分享的（防止旧数据）
            if (share && Date.now() - share.timestamp < 10000) {
                localStorage.removeItem('couple_twitter_share_to_chat');
                // 找到对应CHAR并打开聊天
                const contact = vibeContacts.find(c => String(c.id) === String(share.charId));
                if (contact) {
                    openChat(contact.id);
                    // 延迟一下等聊天页面渲染完成
                    setTimeout(() => {
                        injectWeiboShare(contact, share);
                    }, 500);
                }
            } else {
                localStorage.removeItem('couple_twitter_share_to_chat');
            }
        }
        // 也检查URL参数
        const params = new URLSearchParams(window.location.search);
        const openChatId = params.get('openChat');
        if (openChatId && !shareRaw) {
            const contact = vibeContacts.find(c => String(c.id) === String(openChatId));
            if (contact) openChat(contact.id);
        }
    } catch (e) {
        console.warn('检测微博分享失败:', e);
    }
}, 300);

// 注入微博分享消息到聊天
function injectWeiboShare(contact, share) {
    const shareMsg = {
        id: Date.now(),
        sender: 'user',
        type: 'weibo_share',
        message: `[分享了一条微博] ${share.postAuthor}(${share.postIdentity}): ${share.postContent}`,
        weiboData: {
            postAuthor: share.postAuthor,
            postIdentity: share.postIdentity,
            postContent: share.postContent,
            postTopic: share.postTopic
        },
        timestamp: Date.now()
    };
    contact.chat_history = contact.chat_history || [];
    contact.chat_history.push(shareMsg);
    saveContacts();
    renderChatMessages(contact);
    // 滚动到底部
    setTimeout(() => {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}


// 显示聊天菜单
function showChatMenu() {
    const menu = document.getElementById('chatMenu');
    const isActive = menu.classList.contains('active');
    
    // 先移除旧的监听器
    document.removeEventListener('click', closeChatMenuOutside);
    
    if (!isActive) {
        menu.classList.add('active');
        // 延迟添加监听器，避免立即触发
        setTimeout(() => {
            document.addEventListener('click', closeChatMenuOutside);
        }, 100);
    } else {
        menu.classList.remove('active');
    }
}

function closeChatMenuOutside(e) {
    const menu = document.getElementById('chatMenu');
    const btn = document.querySelector('.chat-menu-btn');
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('active');
        document.removeEventListener('click', closeChatMenuOutside);
    }
}

// 编辑当前联系人
function editCurrentContact() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 关闭菜单
    document.getElementById('chatMenu').classList.remove('active');
    
    // 先打开编辑页面
    const editPage = document.getElementById('page-add-contact');
    editPage.style.zIndex = '10001'; // 确保在聊天页面之上
    openPage('page-add-contact');
    
    // 等待页面渲染后再填充表单
    setTimeout(() => {
        // 填充表单
        document.getElementById('editingContactId').value = contact.id;
        document.getElementById('contactFormTitle').textContent = '编辑联系人';
        document.getElementById('contactName').value = contact.name || '';
        document.getElementById('contactNickname').value = contact.nickname || '';
        document.getElementById('contactGender').value = contact.gender || '';
        document.getElementById('contactPersonality').value = contact.personality || '';
    
    // 加载分组建议并设置分组值
    loadGroupSuggestions(contact.group);
    
    // 加载用户人设选项
    loadUserPersonaOptions();
    
    // 设置用户人设
    if (contact.userPersonaId) {
        document.getElementById('contactUserPersona').value = contact.userPersonaId;
        updateUserPersonaPreview();
    }
    
    document.getElementById('contactGreeting').value = contact.greeting || '';
    
    const autoReplyInput = document.getElementById('autoReplyRulesInput');
    if (autoReplyInput) {
        const rules = contact.autoReplyRules || [];
        autoReplyInput.value = rules.map(r => `${r.status} => ${r.text}`).join('\n');
    }
    
    const worldBookIds = contact.worldBookIds || [];
    renderContactWorldBookList(worldBookIds);
    
    const mountedBookIds = contact.mountedBooks || [];
    renderContactMountedBookList(mountedBookIds);
    
    // 设置头像
    const avatar = document.getElementById('contactAvatar');
    if (contact.avatarUrl) {
        avatar.src = contact.avatarUrl;
        avatar.style.fontSize = '0';
    } else {
        avatar.src = '';
        avatar.textContent = '👤';
        avatar.style.fontSize = '45px';
    }
    
    // 设置封图
    const coverImg = document.getElementById('contactCoverImage');
    const coverPlaceholder = document.querySelector('.cover-placeholder');
    const coverUrlInput = document.getElementById('contactCoverUrl');
    
    if (contact.coverImageUrl) {
        coverUrlInput.value = contact.coverImageUrl;
        coverImg.src = contact.coverImageUrl;
        coverImg.style.display = 'block';
        if (coverPlaceholder) coverPlaceholder.style.display = 'none';
    } else {
        coverUrlInput.value = '';
        coverImg.src = '';
        coverImg.style.display = 'none';
        if (coverPlaceholder) coverPlaceholder.style.display = 'block';
    }
    
    // 加载选项
    loadApiSchemeOptions();
    loadBubbleSchemeOptions();
    loadCallBubbleSchemeOptions();
    
    // 设置 API 方案
    const apiSchemeSelect = document.getElementById('contactApiScheme');
    if (contact.apiScheme) {
        apiSchemeSelect.value = contact.apiScheme;
        // 加载该方案的模型并显示方案名
        const schemes = getStorageJSON('vibe_api_schemes', []);
        const scheme = schemes.find(s => s.id === contact.apiScheme);
        
        if (scheme) {
            const modelSelect = document.getElementById('contactModel');
            modelSelect.innerHTML = '';
            
            const option = document.createElement('option');
            option.value = contact.apiScheme;
            option.textContent = `${scheme.name} - ${scheme.model}`;
            option.selected = true;
            option.setAttribute('data-scheme-id', contact.apiScheme);
            option.setAttribute('data-model', scheme.model);
            modelSelect.appendChild(option);
        } else {
            loadModelOptions();
            if (contact.model) {
                document.getElementById('contactModel').value = contact.model;
            }
        }
    } else {
        apiSchemeSelect.value = '';
        // 加载所有可用模型
        loadModelOptions();
        // 设置当前模型
        if (contact.model) {
            const modelSelect = document.getElementById('contactModel');
            // 如果模型不在列表中，添加它
            if (!modelSelect.querySelector(`option[value="${contact.model}"]`)) {
                const option = document.createElement('option');
                option.value = contact.model;
                option.textContent = contact.model;
                modelSelect.appendChild(option);
            }
            modelSelect.value = contact.model;
        }
    }
    
    // 设置其他字段
    document.getElementById('contactNotificationSound').value = contact.notificationSound || '';
    document.getElementById('contactRingtone').value = contact.ringtone || '';
    document.getElementById('contactBubbleScheme').value = contact.bubbleScheme || 'default';
    document.getElementById('contactCallBubbleScheme').value = contact.callBubbleScheme || 'default';
    document.getElementById('contactChatBgUrl').value = contact.chatBackground || '';
    
    // 加载时区设置
    const timezoneSettings = contact.timezoneSettings || { mode: 'same', sharedTimezone: 'Asia/Shanghai' };
    
    if (timezoneSettings.mode === 'same') {
        document.querySelector('input[name="timeMode"][value="same"]').checked = true;
        document.getElementById('sharedTimezone').value = timezoneSettings.sharedTimezone || 'Asia/Shanghai';
    } else {
        document.querySelector('input[name="timeMode"][value="different"]').checked = true;
        document.getElementById('userTimezone').value = timezoneSettings.userTimezone || 'Asia/Shanghai';
        document.getElementById('aiTimezone').value = timezoneSettings.aiTimezone || 'America/New_York';
    }
    
    toggleTimeMode();
    
    // 加载双语设置
    const bilingualSettings = contact.bilingualSettings || { enabled: false, mode: 'zh-en' };
    document.getElementById('bilingualEnabled').checked = bilingualSettings.enabled;
    document.getElementById('bilingualMode').value = bilingualSettings.mode || 'zh-en';
    toggleBilingualSettings();
    
    // 加载 TTS 设置
    const ttsSettings = contact.ttsSettings || { enabled: false, voiceId: '', language: 'zh', speed: 1.0 };
    document.getElementById('ttsEnabled').checked = ttsSettings.enabled;
    document.getElementById('ttsVoiceId').value = ttsSettings.voiceId || '';
    document.getElementById('ttsLanguage').value = ttsSettings.language || 'zh';
    document.getElementById('ttsSpeed').value = ttsSettings.speed || 1.0;
    toggleTtsSettings();
    
    // 预览气泡方案
    previewBubbleScheme();
    previewCallBubbleScheme();
    }, 50); // 等待50ms让页面完全渲染
}

// 删除当前联系人
function deleteCurrentContact() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    if (!confirm(`确定要删除联系人「${contact.name}」吗？\n聊天记录、行程卡和记忆库也会被删除。`)) {
        return;
    }
    
    // 关闭菜单
    document.getElementById('chatMenu').classList.remove('active');
    
    // 删除联系人
    vibeContacts = vibeContacts.filter(c => c.id !== currentChatContactId);
    saveContacts();
    
    // 清理行程卡相关数据
    cleanupTravelCardData(currentChatContactId);
    
    // 返回联系人列表
    closePageToMain('page-chat');
    renderContactsGroups();
    
    alert('联系人已删除');
}

// 清空聊天记录
function clearChatHistory() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    if (!confirm(`确定要清空与「${contact.name}」的聊天记录吗？`)) {
        return;
    }
    
    // 关闭菜单
    document.getElementById('chatMenu').classList.remove('active');
    
    // 清空聊天记录
    contact.chat_history = [];
    saveContacts();
    
    // 重新渲染
    renderChatMessages();
    
    alert('聊天记录已清空');
}


// 切换时区模式
function toggleTimeMode() {
    const timeMode = document.querySelector('input[name="timeMode"]:checked').value;
    const sameSettings = document.getElementById('sameTimeZoneSettings');
    const differentSettings = document.getElementById('differentTimeZoneSettings');
    
    if (timeMode === 'same') {
        sameSettings.style.display = 'block';
        differentSettings.style.display = 'none';
    } else {
        sameSettings.style.display = 'none';
        differentSettings.style.display = 'block';
    }
}

// 切换双语设置
function toggleBilingualSettings() {
    const enabled = document.getElementById('bilingualEnabled').checked;
    const settings = document.getElementById('bilingualSettings');
    
    if (enabled) {
        settings.style.display = 'block';
    } else {
        settings.style.display = 'none';
    }
}

// 切换 TTS 设置
function toggleTtsSettings() {
    const enabled = document.getElementById('ttsEnabled').checked;
    const settings = document.getElementById('ttsSettings');
    
    if (enabled) {
        settings.style.display = 'block';
    } else {
        settings.style.display = 'none';
    }
}

// 上传聊天背景
function uploadChatBackground(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('contactChatBgUrl').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 清除聊天背景
function clearChatBackground() {
    document.getElementById('contactChatBgUrl').value = '';
}

// 获取指定时区的当前时间
function getTimeInTimezone(timezone) {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const parts = formatter.formatToParts(now);
        const dateObj = {};
        parts.forEach(part => {
            if (part.type !== 'literal') {
                dateObj[part.type] = part.value;
            }
        });
        
        return {
            year: dateObj.year,
            month: dateObj.month,
            day: dateObj.day,
            hour: dateObj.hour,
            minute: dateObj.minute,
            second: dateObj.second,
            formatted: `${dateObj.year}-${dateObj.month}-${dateObj.day} ${dateObj.hour}:${dateObj.minute}:${dateObj.second}`,
            timeString: `${dateObj.hour}:${dateObj.minute}`
        };
    } catch (error) {
        console.error('获取时区时间失败:', error);
        return null;
    }
}

// 构建时区感知的系统提示
function buildTimezoneAwarePrompt(contact, userMessage) {
    const settings = contact.timezoneSettings || { mode: 'same', sharedTimezone: 'Asia/Shanghai' };
    const bilingualSettings = contact.bilingualSettings || { enabled: false };
    const formatSettings = contact.messageFormatSettings || {};
    
    // 添加用户人设
    let userPersonaInfo = '';
    if (contact.userPersona && contact.userPersona.trim()) {
        userPersonaInfo = `\n\n[用户信息] ${contact.userPersona}`;
    }
    
    let timeInfo = '';
    
    if (settings.mode === 'same') {
        // 同地时间
        const time = getTimeInTimezone(settings.sharedTimezone);
        if (time) {
            timeInfo = `\n\n[时间信息] 当前时间: ${time.formatted}。你和用户处于同一时区。`;
        }
    } else {
        // 异地时间
        const userTime = getTimeInTimezone(settings.userTimezone);
        const aiTime = getTimeInTimezone(settings.aiTimezone);
        
        if (userTime && aiTime) {
            timeInfo = `\n\n[时间信息] 用户当前时间: ${userTime.formatted}（${settings.userTimezone}）。你当前时间: ${aiTime.formatted}（${settings.aiTimezone}）。你们处于不同时区，请在回复时考虑这个时间差异。`;
        }
    }
    let bilingualInfo = '';
    
    if (bilingualSettings.enabled) {
        const languageMap = {
            'zh-en': { 
                primary: '英语', 
                secondary: '中文', 
                code: 'English',
                example: 'Hello, how are you today? <translate>你好，你今天怎么样？</translate>'
            },
            'zh-ja': { 
                primary: '日语', 
                secondary: '中文', 
                code: 'Japanese',
                example: 'こんにちは、元気ですか？<translate>你好，你好吗？</translate>'
            },
            'zh-ko': { 
                primary: '韩语', 
                secondary: '中文', 
                code: 'Korean',
                example: '안녕하세요, 어떻게 지내세요? <translate>你好，你好吗？</translate>'
            },
            'zh-de': { 
                primary: '德语', 
                secondary: '中文', 
                code: 'German',
                example: 'Hallo, wie geht es dir? <translate>你好，你好吗？</translate>'
            }
        };
        
        const lang = languageMap[bilingualSettings.mode];
        
        bilingualInfo = `\n\n[双语模式] 你必须使用以下格式回复：
1. 你的母语是${lang.primary}（${lang.code}），首先用${lang.primary}表达你的回复
2. 然后在同一段落中，用<translate>标签包裹${lang.secondary}翻译
3. 格式：[${lang.primary}原文] <translate>中文翻译</translate>

示例格式：
${lang.example}

重要规则：
- 每句话都必须包含${lang.primary}原文和<translate>标签包裹的中文翻译
- ${lang.primary}在外面，中文在<translate>标签里面
- 保持自然的对话风格
- 翻译要准确传达原意
- 在语音通话中，你的${lang.primary}回复会被朗读出来

视频通话中的双语规则（极其重要）：
- 如果使用三维描写法（动作）"语言"*心理*，<translate>标签内必须翻译所有部分
- 必须翻译：括号（）、引号""、星号**内的所有内容
- 翻译必须是完整的镜像，包含所有符号和内容
- 正确示例：（微笑）"你好！"*开心* <translate>（微笑）"你好！"*开心*</translate> ✓
- 错误示例：（微笑）"你好！"*开心* <translate>你好！</translate> ❌ 缺少括号和星号
- 错误示例：（微笑）"你好！"*开心* <translate>"你好！"</translate> ❌ 缺少括号和星号
- 翻译规则：原文有什么符号，翻译就必须有什么符号，一个都不能少`;
    }
    
    // 添加消息格式说明
    let formatInfo = '';
    // 优先使用统一提示词管理系统中的消息格式提示词
    const messageFormatPrompt = getCurrentPrompt('messageFormat');
    
    if (messageFormatPrompt && messageFormatPrompt.trim()) {
        formatInfo = `\n\n[消息格式]\n${messageFormatPrompt}`;
    } else if (formatSettings.formatInstructions) {
        formatInfo = `\n\n[消息格式]\n${formatSettings.formatInstructions}`;
    } else {
        // 使用默认格式说明
        formatInfo = `\n\n[消息格式]\n你可以使用以下格式发送不同类型的消息：

1. 语音消息：当你想表达强烈情绪时使用
   格式：[VOICE:语气]内容
   例如：[VOICE:开心]哈哈哈，太有趣了！

2. 图片消息：当你想分享视觉内容时使用
   格式：[IMAGE]描述内容
   例如：[IMAGE]这是一张美丽的日落照片

3. 视频消息：当你想分享动态内容时使用
   格式：[VIDEO]描述内容
   例如：[VIDEO]我录制了一段在公园散步的视频

4. 表情包消息：当你想用表情包表达情绪时使用
   格式：[STICKER:表情包名称]
   例如：[STICKER:开心]

根据对话情境自然地选择合适的消息格式。`;
    }
    
    // 添加表情包列表
    let stickerInfo = '';
    if (contact.stickers && contact.stickers.length > 0) {
        const stickerNames = contact.stickers.map(s => s.name).join('、');
        stickerInfo = `\n\n[可用表情包]\n你可以使用以下表情包：${stickerNames}\n使用格式：[STICKER:表情包名称]`;
    }
    
    const personalityPrompt = getCurrentPrompt('personality') || contact.personality || '你是一个友好的助手。';
    
    let travelCardInfo = '';
    try {
        // 获取CHAR的今日行程卡（基于CHAR的时区）
        const charTimezone = settings.mode === 'same' ? settings.sharedTimezone : settings.aiTimezone;
        const charToday = getDateInTimezone(charTimezone);
        
        if (charToday) {
            const travelCardData = getTravelCardData(contact.id, charToday);
            if (travelCardData && travelCardData.schedules) {
                // 获取当前时间，判断哪些行程已经可见
                const now = new Date();
                const visibleSchedules = travelCardData.schedules.filter(schedule => {
                    return isScheduleVisibleForChat(schedule, now, charTimezone);
                });
                
                if (visibleSchedules.length > 0) {
                    // 只注入"报备"的行程（正面），不注入真实活动
                    const scheduleText = visibleSchedules.map(s => {
                        const reportedTitle = s.reported ? s.reported.title : s.activity;
                        const location = s.location ? ` (${s.location})` : '';
                        return `${s.time}: ${reportedTitle}${location}`;
                    }).join('\n');
                    travelCardInfo = `\n\n[你今日的行程]\n${scheduleText}\n\n重要：这是你主动报备给用户的行程，请在聊天中坚持这个说法，不要透露任何隐藏的真实活动。`;
                }
            }
        }
    } catch (e) {
        console.error('获取行程卡信息失败:', e);
    }
    
    let consolidatedMemoryInfo = '';
    try {
        const memories = getTravelCardMemories(contact.id);
        if (memories && memories.length > 0) {
            // 获取设置中的记忆条数限制
            const settings = getTravelCardSettings();
            const maxMemoryCount = settings.maxMemoryCount || 5;
            
            // 只取最近的N条记忆
            const recentMemories = memories.slice(-maxMemoryCount);
            const memoryText = recentMemories.map(m => 
                `${m.date}: ${m.summary}`
            ).join('\n');
            consolidatedMemoryInfo = `\n\n[你的记忆库]\n以下是你最近的重要记忆：\n${memoryText}`;
        }
    } catch (e) {
        console.error('获取固化记忆失败:', e);
    }
    
    const worldBookContext = buildWorldBookContext(contact, userMessage);
    
    // 共读：阅读进度 + 记忆召回
    const readingContext = buildReadingContext(contact);
    const readingMemoryRecall = buildReadingMemoryRecall(contact, userMessage);
    
    // NPC关系网络（常驻注入）+ 触发式NPC人设
    const npcRelationsSummary = buildNPCRelationsSummary(contact);
    const triggeredNPCPersonas = buildTriggeredNPCPersonas(contact, userMessage);

    // CHAR今日任务动态注入
    const charWorkInfo = buildCharWorkContext(contact);
    
    return (
        (worldBookContext.before_all || '') +
        personalityPrompt +
        (worldBookContext.after_personality || '') +
        userPersonaInfo +
        npcRelationsSummary +
        charWorkInfo +
        timeInfo +
        (worldBookContext.after_time || '') +
        bilingualInfo +
        formatInfo +
        stickerInfo +
        travelCardInfo +
        triggeredNPCPersonas +
        readingContext +
        readingMemoryRecall +
        (worldBookContext.before_memory || '') +
        consolidatedMemoryInfo +
        (worldBookContext.after_all || '')
    );
}


// ==================== NPC关系网络注入（聊天用） ====================

// ==================== CHAR 自主购买系统 ====================

function processCharGift(reply, contact) {
    const charId = contact.id;

    // ===== [GIFT:{...}] CHAR自主购买 =====
    const giftMatch = reply.match(/\[GIFT:\s*(\{[\s\S]*?\})\s*\]/);
    if (giftMatch) {
        try {
            const gift = JSON.parse(giftMatch[1]);
            const price = parseInt(gift.price) || 0;
            const useShared = gift.account === 'shared';
            let canAfford = false;

            if (useShared) {
                const pts = JSON.parse(localStorage.getItem('alipay_points') || '{}');
                canAfford = price > 0 && price <= (pts[charId] || 0);
            } else {
                const wallet = JSON.parse(localStorage.getItem(`char_wallet_${charId}`) || '0');
                canAfford = price > 0 && price <= wallet;
            }

            if (!canAfford) {
                console.log('🚫 [GIFT] 余额不足，静默拦截', { price, account: gift.account });
                return reply.replace(giftMatch[0], '').trim();
            }

            // 扣款
            if (useShared) {
                const pts = JSON.parse(localStorage.getItem('alipay_points') || '{}');
                pts[charId] = (pts[charId] || 0) - price;
                localStorage.setItem('alipay_points', JSON.stringify(pts));
            } else {
                const wallet = JSON.parse(localStorage.getItem(`char_wallet_${charId}`) || '0');
                localStorage.setItem(`char_wallet_${charId}`, JSON.stringify(wallet - price));
            }

            // 冷却
            const cdDays = 3 + Math.floor(Math.random() * 5);
            localStorage.setItem(`char_gift_cooldown_${charId}`, String(Date.now()));
            localStorage.setItem(`char_gift_cd_days_${charId}`, String(cdDays));

            // 创建物流订单
            const now = Date.now();
            const deliveryDays = Math.floor(Math.random() * 3) + 1;
            const orders = JSON.parse(localStorage.getItem(`shop_orders_${charId}`) || '[]');
            orders.unshift({
                id: `gift_${now}`, product: { name: gift.name || '神秘礼物', desc: gift.reason || 'CHAR送给你的礼物', price, emoji: gift.emoji || '🎁' },
                direction: 'to_user', fromChar: true, paidBy: useShared ? 'shared' : 'personal',
                status: 'ordered', createdAt: now, shippingAt: null,
                shippingDelay: 2 * 60 * 60 * 1000, deliveryDays, deliveryMs: deliveryDays * 24 * 60 * 60 * 1000,
                deliveryAt: null, receivedAt: null, returnedAt: null, review: null,
                timeline: [{ status: 'ordered', time: now, text: `${contact.nickname || contact.name}下单了` }]
            });
            localStorage.setItem(`shop_orders_${charId}`, JSON.stringify(orders));

            // 延迟通知
            const delayMs = (2 + Math.random() * 8) * 60 * 1000;
            setTimeout(() => {
                showGiftNotification(contact, gift.emoji || '🎁', gift.name || '神秘礼物', contact.nickname || contact.name);
            }, delayMs);
            console.log(`🎁 [GIFT] CHAR购买成功: ${gift.name}, 花费${price}, 通知${Math.round(delayMs/60000)}分钟后`);

            reply = reply.replace(giftMatch[0], '').trim();
        } catch (e) {
            console.error('🚫 [GIFT] 解析失败:', e);
            reply = reply.replace(giftMatch[0], '').trim();
        }
    }

    // ===== [ACCEPT_GIFT:{...}] CHAR接受礼物 =====
    const acceptMatch = reply.match(/\[ACCEPT_GIFT:\s*(\{[\s\S]*?\})\s*\]/);
    if (acceptMatch) {
        try {
            const data = JSON.parse(acceptMatch[1]);
            const orderId = data.orderId;
            const orders = JSON.parse(localStorage.getItem(`shop_orders_${charId}`) || '[]');
            const order = orders.find(o => o.id === orderId);
            if (order && order.status === 'pending_accept') {
                order.status = 'ordered';
                const now = Date.now();
                order.timeline.push({ status: 'accepted', time: now, text: `${contact.nickname || contact.name}接受了礼物` });
                localStorage.setItem(`shop_orders_${charId}`, JSON.stringify(orders));

                // 更新聊天记录中的礼物状态
                const contacts = JSON.parse(localStorage.getItem('vibe_contacts') || '[]');
                const c = contacts.find(ct => String(ct.id) === String(charId));
                if (c && c.chat_history) {
                    const msg = c.chat_history.find(m => m.type === 'shop_gift' && m.giftData && m.giftData.orderId === orderId);
                    if (msg) { msg.giftData.status = 'accepted'; }
                    localStorage.setItem('vibe_contacts', JSON.stringify(contacts));
                }
                console.log('✅ [ACCEPT_GIFT] 礼物已接受:', orderId);
            }
            reply = reply.replace(acceptMatch[0], '').trim();
        } catch (e) {
            console.error('🚫 [ACCEPT_GIFT] 解析失败:', e);
            reply = reply.replace(acceptMatch[0], '').trim();
        }
    }

    // ===== [REJECT_GIFT:{...}] CHAR拒收礼物 =====
    const rejectGiftMatch = reply.match(/\[REJECT_GIFT:\s*(\{[\s\S]*?\})\s*\]/);
    if (rejectGiftMatch) {
        try {
            const data = JSON.parse(rejectGiftMatch[1]);
            const orderId = data.orderId;
            const orders = JSON.parse(localStorage.getItem(`shop_orders_${charId}`) || '[]');
            const order = orders.find(o => o.id === orderId);
            if (order && order.status === 'pending_accept') {
                order.status = 'rejected';
                const now = Date.now();
                order.timeline.push({ status: 'rejected', time: now, text: `${contact.nickname || contact.name}拒收了礼物${data.reason ? '：' + data.reason : ''}` });
                localStorage.setItem(`shop_orders_${charId}`, JSON.stringify(orders));

                // 退款到共用账户
                const pts = JSON.parse(localStorage.getItem('alipay_points') || '{}');
                pts[charId] = (pts[charId] || 0) + order.product.price;
                localStorage.setItem('alipay_points', JSON.stringify(pts));

                // 更新聊天记录
                const contacts = JSON.parse(localStorage.getItem('vibe_contacts') || '[]');
                const c = contacts.find(ct => String(ct.id) === String(charId));
                if (c && c.chat_history) {
                    const msg = c.chat_history.find(m => m.type === 'shop_gift' && m.giftData && m.giftData.orderId === orderId);
                    if (msg) { msg.giftData.status = 'rejected'; msg.giftData.rejectReason = data.reason || ''; }
                    localStorage.setItem('vibe_contacts', JSON.stringify(contacts));
                }
                console.log('❌ [REJECT_GIFT] 礼物已拒收:', orderId, '退款:', order.product.price);
            }
            reply = reply.replace(rejectGiftMatch[0], '').trim();
        } catch (e) {
            console.error('🚫 [REJECT_GIFT] 解析失败:', e);
            reply = reply.replace(rejectGiftMatch[0], '').trim();
        }
    }

    // ===== [PAY:{...}] CHAR同意代付 =====
    const payMatch = reply.match(/\[PAY:\s*(\{[\s\S]*?\})\s*\]/);
    if (payMatch) {
        try {
            const data = JSON.parse(payMatch[1]);
            const price = parseInt(data.price) || 0;
            const useShared = data.account === 'shared';
            let canAfford = false;

            if (useShared) {
                const pts = JSON.parse(localStorage.getItem('alipay_points') || '{}');
                canAfford = price > 0 && price <= (pts[charId] || 0);
            } else {
                const wallet = JSON.parse(localStorage.getItem(`char_wallet_${charId}`) || '0');
                canAfford = price > 0 && price <= wallet;
            }

            if (!canAfford) {
                console.log('🚫 [PAY] 余额不足，静默拦截');
                reply = reply.replace(payMatch[0], '').trim();
            } else {
                // 扣款
                if (useShared) {
                    const pts = JSON.parse(localStorage.getItem('alipay_points') || '{}');
                    pts[charId] = (pts[charId] || 0) - price;
                    localStorage.setItem('alipay_points', JSON.stringify(pts));
                } else {
                    const wallet = JSON.parse(localStorage.getItem(`char_wallet_${charId}`) || '0');
                    localStorage.setItem(`char_wallet_${charId}`, JSON.stringify(wallet - price));
                }

                // 创建物流订单（CHAR代付 → 发给USER）
                const now = Date.now();
                const deliveryDays = Math.floor(Math.random() * 3) + 1;
                const orders = JSON.parse(localStorage.getItem(`shop_orders_${charId}`) || '[]');
                orders.unshift({
                    id: `pay_${now}`, product: { name: data.name || '商品', desc: '', price, emoji: data.emoji || '🎁' },
                    direction: 'char_to_user', fromChar: true, paidBy: useShared ? 'shared' : 'personal',
                    status: 'ordered', createdAt: now, shippingAt: null,
                    shippingDelay: 2 * 60 * 60 * 1000, deliveryDays, deliveryMs: deliveryDays * 24 * 60 * 60 * 1000,
                    deliveryAt: null, receivedAt: null, returnedAt: null, review: null,
                    timeline: [{ status: 'ordered', time: now, text: `${contact.nickname || contact.name}代付成功` }]
                });
                localStorage.setItem(`shop_orders_${charId}`, JSON.stringify(orders));

                // 更新聊天记录中的代付状态
                const contacts = JSON.parse(localStorage.getItem('vibe_contacts') || '[]');
                const c = contacts.find(ct => String(ct.id) === String(charId));
                if (c && c.chat_history) {
                    const msg = [...c.chat_history].reverse().find(m =>
                        m.type === 'shop_payment_request' && m.paymentData && m.paymentData.status === 'pending' && m.paymentData.name === data.name
                    );
                    if (msg) { msg.paymentData.status = 'paid'; }
                    localStorage.setItem('vibe_contacts', JSON.stringify(contacts));
                }
                console.log(`💳 [PAY] 代付成功: ${data.name}, ${price}积分, 账户:${data.account}`);

                reply = reply.replace(payMatch[0], '').trim();
            }
        } catch (e) {
            console.error('🚫 [PAY] 解析失败:', e);
            reply = reply.replace(payMatch[0], '').trim();
        }
    }

    // ===== [REJECT_PAY:{...}] CHAR拒绝代付 =====
    const rejectPayMatch = reply.match(/\[REJECT_PAY:\s*(\{[\s\S]*?\})\s*\]/);
    if (rejectPayMatch) {
        try {
            const data = JSON.parse(rejectPayMatch[1]);
            const contacts = JSON.parse(localStorage.getItem('vibe_contacts') || '[]');
            const c = contacts.find(ct => String(ct.id) === String(charId));
            if (c && c.chat_history) {
                const msg = [...c.chat_history].reverse().find(m =>
                    m.type === 'shop_payment_request' && m.paymentData && m.paymentData.status === 'pending' && m.paymentData.name === data.name
                );
                if (msg) { msg.paymentData.status = 'rejected'; msg.paymentData.rejectReason = data.reason || ''; }
                localStorage.setItem('vibe_contacts', JSON.stringify(contacts));
            }
            console.log('❌ [REJECT_PAY] 代付已拒绝:', data.name);
            reply = reply.replace(rejectPayMatch[0], '').trim();
        } catch (e) {
            console.error('🚫 [REJECT_PAY] 解析失败:', e);
            reply = reply.replace(rejectPayMatch[0], '').trim();
        }
    }

    // ===== [RETURN_ORDER:{...}] CHAR退货 =====
    const returnMatch = reply.match(/\[RETURN_ORDER:\s*(\{[\s\S]*?\})\s*\]/);
    if (returnMatch) {
        try {
            const data = JSON.parse(returnMatch[1]);
            const orderId = data.orderId;
            const orders = JSON.parse(localStorage.getItem(`shop_orders_${charId}`) || '[]');
            const order = orders.find(o => o.id === orderId);
            if (order && order.status === 'pending_receive') {
                order.status = 'returned';
                order.returnedAt = Date.now();
                order.returnReason = data.reason || '';
                order.returnedByChar = true;
                order.timeline.push({ status: 'returned', time: Date.now(), text: `${contact.nickname || contact.name}退货了${data.reason ? '：' + data.reason : ''}` });
                localStorage.setItem(`shop_orders_${charId}`, JSON.stringify(orders));

                // 退款：根据订单方向退到对应账户
                if (order.direction === 'user_to_char') {
                    // USER送的礼物，退回共用账户
                    const pts = JSON.parse(localStorage.getItem('alipay_points') || '{}');
                    pts[charId] = (pts[charId] || 0) + order.product.price;
                    localStorage.setItem('alipay_points', JSON.stringify(pts));
                }
                // CHAR自己买的不退（已经是CHAR的钱）

                console.log('📦 [RETURN_ORDER] CHAR退货:', orderId, '原因:', data.reason);
            }
            reply = reply.replace(returnMatch[0], '').trim();
        } catch (e) {
            console.error('🚫 [RETURN_ORDER] 解析失败:', e);
            reply = reply.replace(returnMatch[0], '').trim();
        }
    }

    return reply;
}



function showGiftNotification(contact, emoji, productName, charName) {
    const banner = document.getElementById('notificationBanner');
    const avatar = document.getElementById('notificationAvatar');
    const title = document.getElementById('notificationTitle');
    const msg = document.getElementById('notificationMessage');

    if (contact.avatarUrl) {
        avatar.src = contact.avatarUrl;
        avatar.style.fontSize = '0';
    } else {
        avatar.textContent = emoji;
        avatar.style.fontSize = '22px';
    }

    title.textContent = `📦 ${charName} 的快递`;
    msg.textContent = `${charName}给你买了「${productName}」${emoji}`;

    banner.classList.add('show');

    // 播放提示音
    if (contact.notificationSound) {
        try { playSound(contact.notificationSound); } catch (_) {}
    }

    // 5秒后自动隐藏
    setTimeout(() => { banner.classList.remove('show'); }, 5000);

    // 点击跳转物流页面
    banner.onclick = () => {
        banner.classList.remove('show');
        window.open('logistics.html', '_blank');
    };
}

// ==================== CHAR今日任务动态注入 ====================
function buildCharWorkContext(contact) {
    try {
        const charId = contact.id;
        const wallet = JSON.parse(localStorage.getItem(`char_wallet_${charId}`) || '0');
        const sharedPoints = JSON.parse(localStorage.getItem('alipay_points') || '{}');
        const sharedBalance = sharedPoints[charId] || 0;

        let ctx = '';

        // 今日任务动态
        const data = JSON.parse(localStorage.getItem(`char_work_${charId}`) || 'null');
        const today = new Date().toISOString().slice(0, 10);
        if (data && data.date === today && data.tasks) {
            const done = data.tasks.filter(t => t.status === 'done');
            const undone = data.tasks.filter(t => t.status === 'undone');
            const earned = done.reduce((s, t) => s + t.points, 0);
            ctx += `\n[你今天的日常（你知道这些但不要主动提起，除非对方问起）]\n`;
            ctx += `完成的事：${done.map(t => t.name).join('、') || '无'}\n`;
            if (undone.length) ctx += `没做完的：${undone.map(t => t.name).join('、')}\n`;
            ctx += `今日收入：${earned}积分\n`;
        }

        ctx += `\n[你的财务状况] 个人存款：${wallet}积分，共用账户：${sharedBalance}积分\n`;

        // CHAR 自主购买能力（带冷却检测）
        const totalAvailable = wallet + sharedBalance;
        if (totalAvailable > 0) {
            const cooldownKey = `char_gift_cooldown_${charId}`;
            const lastGiftTime = parseInt(localStorage.getItem(cooldownKey) || '0');
            const daysSinceLastGift = (Date.now() - lastGiftTime) / (1000 * 60 * 60 * 24);
            const cooldownDays = parseInt(localStorage.getItem(`char_gift_cd_days_${charId}`) || '3');
            if (daysSinceLastGift >= cooldownDays) {
                ctx += `\n[购买能力] 你可以用自己的存款(${wallet})或共用账户(${sharedBalance})给对方买礼物。如果想买，在回复最末尾加标记：\n`;
                ctx += `[GIFT:{"name":"商品名","price":价格数字,"emoji":"🎁","reason":"理由","account":"personal或shared"}]\n`;
                ctx += `规则：price不能超过对应账户余额。不要每次都买，只在真的合适的时候才买。\n`;
            }
        }

        // 检测待处理的礼物（USER送给CHAR的）
        const pendingGifts = (contact.chat_history || []).filter(m =>
            m.type === 'shop_gift' && m.giftData && m.giftData.status === 'pending_accept'
        );
        if (pendingGifts.length > 0) {
            ctx += `\n[待处理礼物] 对方送了你礼物，你需要决定接受还是拒收。在回复末尾加标记：\n`;
            pendingGifts.forEach(m => {
                ctx += `- ${m.giftData.emoji} ${m.giftData.name}（💰${m.giftData.price}）订单号:${m.giftData.orderId}\n`;
            });
            ctx += `接受：[ACCEPT_GIFT:{"orderId":"订单号"}]\n`;
            ctx += `拒收：[REJECT_GIFT:{"orderId":"订单号","reason":"拒收理由"}]\n`;
            ctx += `根据你的性格和心情自然地决定，不要每次都接受。回复中自然地提到你的决定。\n`;
        }

        // 检测待处理的代付请求
        const pendingPayments = (contact.chat_history || []).filter(m =>
            m.type === 'shop_payment_request' && m.paymentData && m.paymentData.status === 'pending'
        );
        if (pendingPayments.length > 0) {
            ctx += `\n[待处理代付] 对方请你帮忙代付，你需要决定是否帮忙。\n`;
            pendingPayments.forEach(m => {
                ctx += `- ${m.paymentData.emoji} ${m.paymentData.name}（💰${m.paymentData.price}）\n`;
            });
            ctx += `同意代付：[PAY:{"name":"商品名","price":价格,"account":"personal或shared"}]（从你的存款或共用账户扣）\n`;
            ctx += `拒绝代付：[REJECT_PAY:{"name":"商品名","reason":"拒绝理由"}]\n`;
            ctx += `如果你的存款和共用账户都不够，就自动拒绝并说明原因。\n`;
        }

        // 检测已送达的礼物（CHAR可以退货）
        const orders = JSON.parse(localStorage.getItem(`shop_orders_${charId}`) || '[]');
        const deliveredGifts = orders.filter(o =>
            o.status === 'pending_receive' && o.direction === 'user_to_char'
        );
        if (deliveredGifts.length > 0) {
            ctx += `\n[已送达的礼物] 以下礼物已送达，你可以签收使用，也可以退货。如果要退货，在回复末尾加标记：\n`;
            deliveredGifts.forEach(o => {
                ctx += `- ${o.product.emoji || '🎁'} ${o.product.name}（💰${o.product.price}）订单号:${o.id}\n`;
            });
            ctx += `退货：[RETURN_ORDER:{"orderId":"订单号","reason":"退货理由"}]\n`;
            ctx += `只有在你真的不喜欢或不需要的时候才退货，大多数时候应该开心收下。\n`;
        }

        return ctx;
    } catch (e) { return ''; }
}

// 常驻注入：生成精简的NPC关系网络摘要（不含人设详情）
function buildNPCRelationsSummary(contact) {
    if (!contact.npcs || contact.npcs.length === 0) return '';
    
    const lines = [];
    
    // NPC与CHAR的关系
    contact.npcs.forEach(npc => {
        const rel = normalizeRelation(npc.relation);
        const label = rel.label || '关联';
        const vis = rel.visibility === 'known' ? '' : '（你不知道）';
        lines.push(`- ${npc.name}：与你是「${label}」关系${vis}`);
    });
    
    // NPC之间的关系
    const npcPairs = new Set();
    contact.npcs.forEach(npc => {
        if (npc.relations) {
            Object.keys(npc.relations).forEach(otherId => {
                const pairKey = [npc.id, otherId].sort().join('_');
                if (npcPairs.has(pairKey)) return;
                npcPairs.add(pairKey);
                const other = contact.npcs.find(n => n.id === otherId);
                if (other) {
                    const r = normalizeRelation(npc.relations[otherId]);
                    const label = r.label || '关联';
                    const vis = r.visibility === 'known' ? '' : '（你不知道）';
                    lines.push(`- ${npc.name} 和 ${other.name}：「${label}」${vis}`);
                }
            });
        }
        // NPC与同组CHAR的关系
        if (npc.charRelations) {
            Object.keys(npc.charRelations).forEach(charId => {
                const otherChar = vibeContacts.find(c => c.id == charId);
                if (otherChar) {
                    const r = normalizeRelation(npc.charRelations[charId]);
                    const label = r.label || '关联';
                    const vis = r.visibility === 'known' ? '' : '（你不知道）';
                    lines.push(`- ${npc.name} 和 ${otherChar.name}：「${label}」${vis}`);
                }
            });
        }
    });
    
    // 同组CHAR之间的关系
    if (contact.charRelations) {
        Object.keys(contact.charRelations).forEach(key => {
            const ids = key.split('_');
            const r = normalizeRelation(contact.charRelations[key]);
            const name1 = String(contact.id) == String(ids[0]) ? '你' : (vibeContacts.find(c => c.id == ids[0]) || {}).name;
            const name2 = String(contact.id) == String(ids[1]) ? '你' : (vibeContacts.find(c => c.id == ids[1]) || {}).name;
            if (name1 && name2) {
                const label = r.label || '关联';
                const vis = r.visibility === 'known' ? '' : '（你不知道）';
                lines.push(`- ${name1} 和 ${name2}：「${label}」${vis}`);
            }
        });
    }
    
    if (lines.length === 0) return '';
    
    return '\n\n[NPC关系网络]\n' +
        '以下是你身边的人物关系。标注"你不知道"的关系，你在对话中不应主动提及，除非用户透露。\n' +
        lines.join('\n');
}

// 触发式注入：检测用户消息中是否提到NPC名字或关系标签，返回匹配NPC的完整人设
function buildTriggeredNPCPersonas(contact, userMessage) {
    if (!contact.npcs || contact.npcs.length === 0 || !userMessage) return '';
    
    const msg = userMessage.toLowerCase();
    const triggeredNPCs = new Set();
    
    contact.npcs.forEach(npc => {
        // 1. 按NPC名字匹配
        if (npc.name && msg.includes(npc.name.toLowerCase())) {
            triggeredNPCs.add(npc.id);
        }
        
        // 2. 按关系标签匹配（如用户说"姐妹"，匹配所有关系label含"姐妹"的NPC）
        const rel = normalizeRelation(npc.relation);
        if (rel.label && msg.includes(rel.label.toLowerCase())) {
            triggeredNPCs.add(npc.id);
        }
        
        // 3. 检查NPC之间的关系标签
        if (npc.relations) {
            Object.values(npc.relations).forEach(r => {
                const nr = normalizeRelation(r);
                if (nr.label && msg.includes(nr.label.toLowerCase())) {
                    triggeredNPCs.add(npc.id);
                }
            });
        }
        
        // 4. 检查NPC与同组CHAR的关系标签
        if (npc.charRelations) {
            Object.values(npc.charRelations).forEach(r => {
                const nr = normalizeRelation(r);
                if (nr.label && msg.includes(nr.label.toLowerCase())) {
                    triggeredNPCs.add(npc.id);
                }
            });
        }
    });
    
    if (triggeredNPCs.size === 0) return '';
    
    const personas = [];
    triggeredNPCs.forEach(npcId => {
        const npc = contact.npcs.find(n => n.id === npcId);
        if (!npc) return;
        const rel = normalizeRelation(npc.relation);
        let desc = `【${npc.name}】`;
        if (rel.label) desc += ` 与你的关系：${rel.label}`;
        if (npc.gender) desc += `，性别：${npc.gender === 'male' ? '男' : npc.gender === 'female' ? '女' : npc.gender}`;
        if (npc.personality) desc += `\n人设：${npc.personality}`;
        personas.push(desc);
    });
    
    console.log(`🎭 [NPC触发] 用户消息触发了 ${triggeredNPCs.size} 个NPC人设注入`);
    
    return '\n\n[触发的NPC人设详情]\n' +
        '用户提到了以下NPC相关内容，请在回复时参考他们的人设：\n' +
        personas.join('\n\n');
}

// 解析双语消息
function parseBilingualMessage(text) {
    // 查找 <translate>...</translate> 标签
    const regex = /<translate>(.*?)<\/translate>/g;
    const translations = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        translations.push({
            start: match.index,
            end: match.index + match[0].length,
            translation: match[1]
        });
    }
    
    if (translations.length === 0) {
        // 没有翻译标签，返回原文
        return { hasBilingual: false, original: text };
    }
    
    // 移除翻译标签，只保留原文
    let original = text;
    for (let i = translations.length - 1; i >= 0; i--) {
        const t = translations[i];
        original = original.substring(0, t.start) + original.substring(t.end);
    }
    
    return {
        hasBilingual: true,
        original: original.trim(),
        fullText: text,
        translations: translations
    };
}

// 提取翻译文本
function extractTranslations(text) {
    const regex = /<translate>(.*?)<\/translate>/g;
    const translations = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        translations.push(match[1]);
    }
    
    return translations.join(' ');
}

// ==================== 共读：阅读感知与记忆召回 ====================

function buildReadingContext(contact) {
    const bookIds = Array.isArray(contact.mountedBooks) ? contact.mountedBooks : [];
    if (bookIds.length === 0) return '';
    let books = [];
    try { books = JSON.parse(localStorage.getItem('vibe_reading_books') || '[]'); } catch(e) { return ''; }
    if (!Array.isArray(books) || books.length === 0) return '';
    const parts = [];
    bookIds.forEach(bid => {
        const book = books.find(b => b.id === bid);
        if (!book) return; // 已删除的书籍，跳过
        let pages = [];
        try { pages = JSON.parse(localStorage.getItem('vibe_reading_pages_' + bid) || '[]'); } catch(e) {}
        const total = Array.isArray(pages) ? pages.length : 0;
        const current = book.currentPage || 1;
        const status = book.status || '在读';
        let line = `《${book.title}》- 当前第${current}页/共${total}页 - 状态：${status}`;
        if (status === '在读') {
            line += '\n⚠️ 用户尚未读完此书，请勿剧透用户未读到的内容。';
        }
        parts.push(line);
    });
    if (parts.length === 0) return '';
    return '\n\n[共读·阅读进度]\n' + parts.join('\n');
}

function buildReadingMemoryRecall(contact, userMessage) {
    const bookIds = Array.isArray(contact.mountedBooks) ? contact.mountedBooks : [];
    if (bookIds.length === 0 || !userMessage) return '';
    const msg = String(userMessage).toLowerCase();
    const allMatched = [];
    bookIds.forEach(bid => {
        let table = null;
        try { table = JSON.parse(localStorage.getItem('vibe_reading_table_' + bid) || 'null'); } catch(e) {}
        if (!table || !Array.isArray(table.rows) || !Array.isArray(table.fields)) return;
        table.rows.forEach(row => {
            const rowText = row.join(' ').toLowerCase();
            // 提取关键词：将用户消息按空格和标点分词，过滤短词
            const keywords = msg.replace(/[，。！？、；：""''（）\[\]{},.!?;:'"()\s]+/g, ' ').split(' ').filter(w => w.length >= 2);
            const matched = keywords.some(kw => rowText.includes(kw));
            if (matched) {
                const formatted = table.fields.map((f, i) => `${f}:${row[i] || ''}`).join(' | ');
                allMatched.push(formatted);
            }
        });
    });
    if (allMatched.length === 0) return '';
    return '\n\n[共读·记忆召回]\n' + allMatched.join('\n');
}

function buildWorldBookContext(contact, userMessage) {
    if (!Array.isArray(worldBooks)) {
        loadWorldBooks();
    }
    const result = {
        before_all: '',
        after_personality: '',
        after_time: '',
        before_memory: '',
        after_all: ''
    };
    if (!worldBooks || worldBooks.length === 0) {
        return result;
    }
    const ids = Array.isArray(contact.worldBookIds) ? contact.worldBookIds : [];
    if (ids.length === 0) {
        return result;
    }
    const text = String(userMessage || '').toLowerCase();
    const books = worldBooks.filter(b => ids.includes(b.id));
    books.forEach(book => {
        const entries = Array.isArray(book.entries) ? book.entries : [];
        entries.forEach(entry => {
            if (!entry || entry.enabled === false) return;
            if (entry.keywords && entry.keywords.trim()) {
                const parts = entry.keywords.split('|').map(p => p.trim()).filter(p => p);
                if (parts.length > 0) {
                    const matched = parts.some(k => text.indexOf(k.toLowerCase()) !== -1);
                    if (!matched) return;
                }
            }
            const segment = '\n\n[世界书] ' + (book.name || '') + ' - ' + (entry.title || '') + '\n' + (entry.content || '');
            const pos = entry.position || 'after_personality';
            if (result[pos] === undefined) {
                result.after_personality += segment;
            } else {
                result[pos] += segment;
            }
        });
    });
    return result;
}


// ==================== Token 分析与总结功能 ====================

// 打开 Token 分析弹窗
function openTokenAnalysis() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const modal = document.getElementById('tokenAnalysisModal');
    modal.classList.add('active');
    
    // 计算 Token 统计
    updateTokenStats(contact);
    
    // 加载总结设置（确保从保存的设置中加载）
    loadSummarySettings(contact);
    
    // 加载自定义图标
    const iconUrl = (contact.customIcons && contact.customIcons.tokenAnalysis) || 'https://files.catbox.moe/vm8m1n.jpg';
    document.getElementById('tokenAnalysisIconUrl').value = iconUrl;
    document.getElementById('tokenAnalysisIconPreview').src = iconUrl;
    
    // 如果有保存的设置，确保 UI 显示正确
    if (contact.summarySettings) {
        // 强制更新 UI
        setTimeout(() => {
            if (contact.summarySettings.apiScheme) {
                document.getElementById('summaryApiScheme').value = contact.summarySettings.apiScheme;
                loadSummaryScheme();
            }
        }, 100);
    }
}

// 关闭 Token 分析弹窗
function closeTokenAnalysis() {
    const modal = document.getElementById('tokenAnalysisModal');
    modal.classList.remove('active');
}

// 更新 Token 统计
function updateTokenStats(contact) {
    // 确保 chat_history 存在
    if (!contact.chat_history) {
        contact.chat_history = [];
    }
    
    const messageCount = contact.chat_history.length;
    document.getElementById('currentMessageCount').textContent = messageCount;
    
    // 获取上下文窗口大小
    const contextWindow = parseInt(document.getElementById('contextWindowSize').value) || 10;
    
    // 估算下次调用的 Token 数（粗略估计：中文1字≈1.5token，英文1词≈1token）
    const recentMessages = contact.chat_history.slice(-contextWindow);
    let estimatedTokens = 0;
    
    // 系统提示词
    const systemPrompt = buildTimezoneAwarePrompt(contact, '');
    estimatedTokens += Math.ceil(systemPrompt.length / 2);
    
    // 结构化记忆内容
    const smForTokens = formatStructuredMemory(contact);
    if (smForTokens) {
        estimatedTokens += Math.ceil(smForTokens.length / 2);
    }
    
    // 历史消息
    recentMessages.forEach(msg => {
        if (msg && msg.message) {
            estimatedTokens += Math.ceil(msg.message.length / 2);
        }
    });
    
    document.getElementById('nextCallTokens').textContent = estimatedTokens;
}

// 加载总结设置
function loadSummarySettings(contact) {
    const settings = contact.summarySettings || {
        // 不再使用 prompt 字段，使用统一管理系统
        // prompt: '请简洁地总结以上对话的核心内容和关键信息。',
        autoEnabled: false,
        autoThreshold: 20,
        contextWindowSize: 10,
        apiScheme: '',
        apiUrl: '',
        apiKey: '',
        model: ''
    };
    
    console.log('加载总结设置:', settings);
    
    // 不再加载提示词到 DOM，使用统一管理系统
    // document.getElementById('summaryPrompt').value = settings.prompt;
    document.getElementById('autoSummaryEnabled').checked = settings.autoEnabled;
    document.getElementById('autoSummaryThreshold').value = settings.autoThreshold;
    document.getElementById('contextWindowSize').value = settings.contextWindowSize || 10;
    document.getElementById('summaryApiUrl').value = settings.apiUrl;
    document.getElementById('summaryApiKey').value = settings.apiKey;
    document.getElementById('summaryModel').value = settings.model;
    
    toggleAutoSummary();
    loadSummaryApiSchemes();
    
    // 如果有保存的方案，加载它
    if (settings.apiScheme) {
        console.log('加载 API 方案:', settings.apiScheme);
        document.getElementById('summaryApiScheme').value = settings.apiScheme;
        loadSummaryScheme();
    } else {
        console.log('没有保存的 API 方案');
    }
}

// 切换自动总结
function toggleAutoSummary() {
    const enabled = document.getElementById('autoSummaryEnabled').checked;
    const settings = document.getElementById('autoSummarySettings');
    settings.style.display = enabled ? 'block' : 'none';
}

// 加载总结 API 方案
function loadSummaryApiSchemes() {
    const select = document.getElementById('summaryApiScheme');
    select.innerHTML = '<option value="">使用默认配置</option>';
    
    const schemes = getStorageJSON('summary_api_schemes', []);
    schemes.forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme.id;
        option.textContent = scheme.name;
        select.appendChild(option);
    });
}

// 加载总结方案
function loadSummaryScheme() {
    const schemeId = document.getElementById('summaryApiScheme').value;
    
    if (!schemeId) {
        // 清空显示
        document.getElementById('summaryApiUrl').value = '';
        document.getElementById('summaryApiKey').value = '';
        document.getElementById('summaryModel').value = '';
        
        const modelDisplay = document.getElementById('summaryModelDisplay');
        modelDisplay.innerHTML = '<option value="">选择或输入模型</option>';
        return;
    }
    
    const schemes = getStorageJSON('summary_api_schemes', []);
    const scheme = schemes.find(s => s.id === schemeId);
    
    if (scheme) {
        document.getElementById('summaryApiUrl').value = scheme.apiUrl;
        document.getElementById('summaryApiKey').value = scheme.apiKey;
        document.getElementById('summaryModel').value = scheme.model;
        
        // 在下拉框中显示方案名称和模型
        const modelDisplay = document.getElementById('summaryModelDisplay');
        modelDisplay.innerHTML = '';
        
        const option = document.createElement('option');
        option.value = scheme.model;
        option.textContent = `${scheme.name} - ${scheme.model}`;
        option.selected = true;
        modelDisplay.appendChild(option);
    }
}

// 拉取总结模型
async function fetchSummaryModels() {
    const apiUrl = document.getElementById('summaryApiUrl').value.trim();
    const apiKey = document.getElementById('summaryApiKey').value.trim();
    
    if (!apiUrl || !apiKey) {
        alert('请先填写 API URL 和 API Key');
        return;
    }
    
    // 移除 URL 末尾的斜杠，并确保格式正确
    let cleanUrl = apiUrl.replace(/\/$/, '');
    
    // 如果 URL 不包含 /v1，添加它
    if (!cleanUrl.includes('/v1')) {
        cleanUrl = cleanUrl + '/v1';
    }
    
    try {
        console.log('正在拉取模型列表...', cleanUrl);
        console.log('使用的完整 URL:', `${cleanUrl}/models`);
        
        const response = await fetch(`${cleanUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('响应状态:', response.status);
        console.log('响应头:', [...response.headers.entries()]);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('错误响应:', errorText);
            throw new Error(`获取模型列表失败 (${response.status}): ${errorText.substring(0, 100)}`);
        }
        
        const data = await response.json();
        console.log('模型数据:', data);
        
        const select = document.getElementById('summaryModelDisplay');
        select.innerHTML = '<option value="">选择模型</option>';
        
        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.id;
                select.appendChild(option);
            });
            
            // 监听选择变化
            select.onchange = function() {
                if (this.value) {
                    document.getElementById('summaryModel').value = this.value;
                }
            };
            
            alert(`成功加载 ${data.data.length} 个模型`);
        } else if (Array.isArray(data)) {
            // 有些 API 直接返回数组
            data.forEach(model => {
                const option = document.createElement('option');
                const modelId = typeof model === 'string' ? model : (model.id || model.name);
                option.value = modelId;
                option.textContent = modelId;
                select.appendChild(option);
            });
            
            // 监听选择变化
            select.onchange = function() {
                if (this.value) {
                    document.getElementById('summaryModel').value = this.value;
                }
            };
            
            alert(`成功加载 ${data.length} 个模型`);
        } else {
            console.error('未知的数据格式:', data);
            throw new Error('返回的数据格式不正确');
        }
        
    } catch (error) {
        console.error('获取模型失败:', error);
        alert('获取模型列表失败: ' + error.message + '\n\n请检查：\n1. API URL 是否正确（应包含完整路径，如 https://api.example.com/v1）\n2. API Key 是否有效\n3. 网络连接是否正常\n4. 查看浏览器控制台获取详细错误信息');
    }
}

// 保存总结方案
function saveSummaryScheme() {
    const name = prompt('请输入方案名称：');
    if (!name || !name.trim()) return;
    
    const scheme = {
        id: Date.now().toString(),
        name: name.trim(),
        apiUrl: document.getElementById('summaryApiUrl').value,
        apiKey: document.getElementById('summaryApiKey').value,
        model: document.getElementById('summaryModel').value
    };
    
    const schemes = getStorageJSON('summary_api_schemes', []);
    schemes.push(scheme);
    setStorageJSON('summary_api_schemes', schemes);
    
    loadSummaryApiSchemes();
    alert('方案已保存');
}

// 手动总结
async function manualSummary() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 确保 chat_history 存在
    if (!contact.chat_history) {
        contact.chat_history = [];
    }
    
    const start = parseInt(document.getElementById('summaryRangeStart').value);
    const end = parseInt(document.getElementById('summaryRangeEnd').value);
    
    if (!start || !end || start < 1 || end < start || end > contact.chat_history.length) {
        alert('请输入有效的范围（1 到 ' + contact.chat_history.length + '）');
        return;
    }
    
    // 获取指定范围的消息
    const messages = contact.chat_history.slice(start - 1, end);
    
    // 检查是否有已总结的消息
    const alreadySummarized = messages.filter(msg => msg.summarized);
    if (alreadySummarized.length > 0) {
        const confirm = window.confirm(
            `选择的范围中有 ${alreadySummarized.length} 条消息已经被总结过（标记为 ♥）。\n\n是否继续总结？这可能导致重复总结。`
        );
        if (!confirm) return;
    }
    
    await performSummary(contact, messages, start, end);
}

// 执行总结
async function performSummary(contact, messages, startIndex, endIndex) {
    // 使用新的结构化记忆提取替代旧的纯文本总结
    const result = await extractStructuredMemory(contact, messages);
    if (result) {
        // 标记已总结的消息
        markMessagesSummarized(contact, startIndex, endIndex);
        alert('记忆提取完成！');
        renderChatMessages();
    }
}

// [已移除] saveToMemoryBank — 旧记忆库保存函数，已被结构化记忆系统替代

// 标记已总结的消息
function markMessagesSummarized(contact, startIndex, endIndex) {
    for (let i = startIndex - 1; i < endIndex; i++) {
        if (contact.chat_history[i]) {
            contact.chat_history[i].summarized = true;
        }
    }
    saveContacts();
}

// 保存总结设置到联系人
function saveSummarySettingsToContact() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    contact.summarySettings = {
        // 不再保存 prompt，使用统一管理系统
        // prompt: document.getElementById('summaryPrompt').value,
        autoEnabled: document.getElementById('autoSummaryEnabled').checked,
        autoThreshold: parseInt(document.getElementById('autoSummaryThreshold').value),
        contextWindowSize: parseInt(document.getElementById('contextWindowSize').value) || 10,
        apiScheme: document.getElementById('summaryApiScheme').value,
        apiUrl: document.getElementById('summaryApiUrl').value,
        apiKey: document.getElementById('summaryApiKey').value,
        model: document.getElementById('summaryModel').value
    };
    
    saveContacts();
}

// 保存所有总结设置（包括图标）
function saveAllSummarySettings() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 保存总结设置
    saveSummarySettingsToContact();
    
    // 保存图标
    const iconUrl = document.getElementById('tokenAnalysisIconUrl').value.trim();
    if (iconUrl) {
        if (!contact.customIcons) {
            contact.customIcons = {};
        }
        contact.customIcons.tokenAnalysis = iconUrl;
        saveContacts();
        
        // 更新聊天页面的图标
        updateChatIcons(contact);
    }
    
    console.log('保存后的总结设置:', contact.summarySettings);
    
    alert('所有设置已保存');
}

// 检查是否需要自动总结
function checkAutoSummary(contact) {
    if (!contact.summarySettings || !contact.summarySettings.autoEnabled) return;
    
    const threshold = contact.summarySettings.autoThreshold;
    
    // 只统计未总结的消息
    let unsummarizedCount = 0;
    const unsummarizedMessages = [];
    
    for (const msg of contact.chat_history) {
        if (!msg.summarized) {
            unsummarizedMessages.push(msg);
            unsummarizedCount += 1;
        }
    }
    
    console.log(`未总结消息数: ${unsummarizedCount}, 阈值: ${threshold}`);
    
    // 达到阈值后，自动触发结构化记忆提取
    if (unsummarizedCount >= threshold) {
        // 检查是否正在提取中
        if (contact._extractingMemory) {
            console.log('正在提取记忆中，跳过');
            return;
        }
        
        contact._extractingMemory = true;
        console.log('🧠 达到总结阈值，自动触发结构化记忆提取');
        
        extractStructuredMemory(contact, unsummarizedMessages).then(() => {
            // 标记消息为已总结
            markMessagesSummarized(contact, 
                contact.chat_history.indexOf(unsummarizedMessages[0]) + 1,
                contact.chat_history.indexOf(unsummarizedMessages[unsummarizedMessages.length - 1]) + 1
            );
            contact._extractingMemory = false;
            contact.pendingSummary = false;
            saveContacts();
        }).catch(err => {
            console.error('自动记忆提取失败:', err);
            contact._extractingMemory = false;
        });
    }
}

// 检查并提示用户总结（在用户发送消息后调用）
function checkAndPromptSummary(contact) {
    if (!contact.pendingSummary) return;
    
    // 找到第一条未总结的消息的索引
    const firstUnsummarizedIndex = contact.chat_history.findIndex(msg => !msg.summarized);
    
    if (firstUnsummarizedIndex === -1) {
        // 没有未总结的消息，清除标记
        contact.pendingSummary = false;
        saveContacts();
        return;
    }
    
    const unsummarizedMessages = contact.chat_history.filter(msg => !msg.summarized);
    const startIndex = firstUnsummarizedIndex + 1; // 转换为 1-based 索引
    const endIndex = contact.chat_history.length;
    
    // 显示总结确认弹窗
    showSummaryConfirmDialog(contact, unsummarizedMessages, startIndex, endIndex);
}

// ==================== 结构化记忆数据层 ====================

const DEFAULT_MEMORY_CATEGORIES = [
    { id: 'F', name: '偏好/事实', isDefault: true },
    { id: 'R', name: '关系变化', isDefault: true },
    { id: 'E', name: '事件', isDefault: true },
    { id: 'P', name: '计划/待办', isDefault: true },
    { id: 'D', name: '决定', isDefault: true },
    { id: 'M', name: '情绪节点', isDefault: true }
];

// 获取联系人的结构化记忆，不存在则初始化默认结构
function getStructuredMemory(contact) {
    if (!contact.structuredMemory) {
        contact.structuredMemory = {
            categories: DEFAULT_MEMORY_CATEGORIES.map(c => ({ ...c })),
            entries: []
        };
    }
    return contact.structuredMemory;
}

// 保存结构化记忆到联系人并持久化
function saveStructuredMemory(contact, memory) {
    contact.structuredMemory = memory;
    saveContacts();
}

// 添加一条记忆条目
function addMemoryEntry(contact, categoryId, text, date) {
    const memory = getStructuredMemory(contact);
    const entry = {
        id: Date.now(),
        category: categoryId,
        text: text,
        date: date,
        createdAt: Date.now()
    };
    memory.entries.push(entry);
    saveStructuredMemory(contact, memory);
    return entry;
}

// 编辑一条记忆条目
function editMemoryEntry(contact, entryId, text, date) {
    const memory = getStructuredMemory(contact);
    const entry = memory.entries.find(e => e.id === entryId);
    if (!entry) return false;
    if (text !== undefined) entry.text = text;
    if (date !== undefined) entry.date = date;
    saveStructuredMemory(contact, memory);
    return true;
}

// 删除一条记忆条目
function deleteMemoryEntry(contact, entryId) {
    const memory = getStructuredMemory(contact);
    memory.entries = memory.entries.filter(e => e.id !== entryId);
    saveStructuredMemory(contact, memory);
}

// 添加自定义类别
function addCustomCategory(contact, name, shortId) {
    const memory = getStructuredMemory(contact);
    if (memory.categories.some(c => c.id === shortId)) {
        return false; // ID 冲突
    }
    memory.categories.push({ id: shortId, name: name, isDefault: false });
    saveStructuredMemory(contact, memory);
    return true;
}

// 删除自定义类别及其所有条目
function deleteCustomCategory(contact, categoryId) {
    const memory = getStructuredMemory(contact);
    const cat = memory.categories.find(c => c.id === categoryId);
    if (!cat || cat.isDefault) return false; // 不能删除默认类别
    memory.categories = memory.categories.filter(c => c.id !== categoryId);
    memory.entries = memory.entries.filter(e => e.category !== categoryId);
    saveStructuredMemory(contact, memory);
    return true;
}

// 计算结构化记忆的近似 token 数
function estimateTokenCount(memory) {
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

// ==================== 结构化记忆核心逻辑 ====================

// 将结构化记忆格式化为系统提示词注入文本
function formatStructuredMemory(contact) {
    const memory = contact.structuredMemory;
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

// 调用 LLM 从对话中提取结构化记忆
async function extractStructuredMemory(contact, messages) {
    const settings = contact.summarySettings || {};
    const apiUrl = settings.apiUrl || localStorage.getItem('apiUrl');
    const apiKey = settings.apiKey || localStorage.getItem('apiKey');
    const model = settings.model || localStorage.getItem('selectedModel');

    if (!apiUrl || !apiKey || !model) {
        console.error('❌ [记忆提取] 无 API 配置');
        alert('请配置总结 API 设置');
        return;
    }

    const memory = getStructuredMemory(contact);
    const today = new Date().toISOString().slice(0, 10);
    const charName = contact.name || '角色';

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
    const conversationText = messages.map(msg => {
        const sender = msg.sender === 'user' ? '用户' : charName;
        return `${sender}: ${msg.message}`;
    }).join('\n');

    startSummarizingAnimation();

    try {
        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: extractionPrompt },
                    { role: 'user', content: conversationText }
                ]
            })
        });

        if (!response.ok) throw new Error(`API 请求失败 (${response.status})`);

        const data = await response.json();
        let reply = '';
        if (data.choices && data.choices[0] && data.choices[0].message) {
            reply = data.choices[0].message.content;
        } else if (data.content && data.content[0] && data.content[0].text) {
            reply = data.content[0].text;
        } else {
            throw new Error('无法识别的 API 返回格式');
        }

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
        mergeExtractedMemory(contact, validEntries);

        stopSummarizingAnimation();
        console.log(`✅ [记忆提取] 成功提取 ${validEntries.length} 条记忆`);
        return validEntries;

    } catch (error) {
        console.error('❌ [记忆提取] 失败:', error);
        stopSummarizingAnimation();
        alert('记忆提取失败: ' + error.message);
        return null;
    }
}

// 将 LLM 提取的新条目合并到现有记忆
function mergeExtractedMemory(contact, extracted) {
    if (!extracted || extracted.length === 0) return;
    const memory = getStructuredMemory(contact);
    for (const item of extracted) {
        memory.entries.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            category: item.category,
            text: item.text,
            date: item.date,
            createdAt: Date.now()
        });
    }
    saveStructuredMemory(contact, memory);
}

// ==================== 记忆库功能 ====================

// 打开记忆库
function openMemoryBank() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const modal = document.getElementById('memoryBankModal');
    modal.classList.add('active');
    
    // 加载自定义图标
    const iconUrl = (contact.customIcons && contact.customIcons.memoryBank) || 'https://files.catbox.moe/9136hf.jpg';
    document.getElementById('memoryBankIconUrl').value = iconUrl;
    document.getElementById('memoryBankIconPreview').src = iconUrl;
    
    renderStructuredMemory(contact);
}

// 关闭记忆库
function closeMemoryBank() {
    const modal = document.getElementById('memoryBankModal');
    modal.classList.remove('active');
}

// 渲染结构化记忆 UI
function renderStructuredMemory(contact) {
    const container = document.getElementById('memoryList');
    const empty = document.getElementById('memoryEmpty');
    const memory = getStructuredMemory(contact);
    
    // Token 计数
    const tokenCount = estimateTokenCount(memory);
    let tokenEl = document.getElementById('smTokenCount');
    if (tokenEl) tokenEl.textContent = `Token: ~${tokenCount}`;
    
    container.innerHTML = '';
    
    const hasEntries = memory.entries.length > 0;
    if (empty) empty.style.display = 'none';
    
    // 按类别渲染
    for (const cat of memory.categories) {
        const catEntries = memory.entries.filter(e => e.category === cat.id);
        
        const section = document.createElement('div');
        section.className = 'sm-category-section';
        
        const header = document.createElement('div');
        header.className = 'sm-category-header';
        header.innerHTML = `
            <span class="sm-category-name">▼ ${cat.name} (${cat.id})</span>
            <span class="sm-category-meta">
                <span class="sm-category-count">${catEntries.length}条</span>
                ${!cat.isDefault ? `<button class="sm-btn-icon sm-btn-del-cat" onclick="uiDeleteCustomCategory('${cat.id}')" title="删除类别">🗑</button>` : ''}
                <button class="sm-btn-icon" onclick="uiAddEntry('${cat.id}')" title="添加条目">+</button>
            </span>
        `;
        section.appendChild(header);
        
        // 添加条目的内联输入区（默认隐藏）
        const addForm = document.createElement('div');
        addForm.className = 'sm-add-form';
        addForm.id = `sm-add-form-${cat.id}`;
        addForm.style.display = 'none';
        const today = new Date().toISOString().slice(0, 10);
        addForm.innerHTML = `
            <input type="text" class="sm-input" id="sm-add-text-${cat.id}" placeholder="输入记忆内容（角色第一人称）">
            <input type="date" class="sm-input sm-input-date" id="sm-add-date-${cat.id}" value="${today}">
            <div class="sm-add-actions">
                <button class="sm-btn sm-btn-primary" onclick="uiConfirmAddEntry('${cat.id}')">添加</button>
                <button class="sm-btn sm-btn-secondary" onclick="uiCancelAddEntry('${cat.id}')">取消</button>
            </div>
        `;
        section.appendChild(addForm);
        
        if (catEntries.length === 0) {
            const emptyHint = document.createElement('div');
            emptyHint.className = 'sm-empty-hint';
            emptyHint.textContent = '暂无条目，点击 + 添加';
            section.appendChild(emptyHint);
        } else {
            for (const entry of catEntries) {
                const entryEl = document.createElement('div');
                entryEl.className = 'sm-entry';
                entryEl.id = `sm-entry-${entry.id}`;
                entryEl.innerHTML = `
                    <div class="sm-entry-view" id="sm-entry-view-${entry.id}">
                        <span class="sm-entry-text">• ${entry.text} <span class="sm-entry-date">(${entry.date})</span></span>
                        <span class="sm-entry-actions">
                            <button class="sm-btn-icon" onclick="uiEditEntry(${entry.id})" title="编辑">✏️</button>
                            <button class="sm-btn-icon" onclick="uiDeleteEntry(${entry.id})" title="删除">🗑</button>
                        </span>
                    </div>
                    <div class="sm-entry-edit" id="sm-entry-edit-${entry.id}" style="display:none;">
                        <input type="text" class="sm-input" id="sm-edit-text-${entry.id}" value="${entry.text.replace(/"/g, '&quot;')}">
                        <input type="date" class="sm-input sm-input-date" id="sm-edit-date-${entry.id}" value="${entry.date}">
                        <div class="sm-add-actions">
                            <button class="sm-btn sm-btn-primary" onclick="uiConfirmEditEntry(${entry.id})">保存</button>
                            <button class="sm-btn sm-btn-secondary" onclick="uiCancelEditEntry(${entry.id})">取消</button>
                        </div>
                    </div>
                `;
                section.appendChild(entryEl);
            }
        }
        
        container.appendChild(section);
    }
    
    // 添加自定义类别按钮
    const addCatBtn = document.createElement('div');
    addCatBtn.className = 'sm-add-category-area';
    addCatBtn.innerHTML = `
        <div id="sm-add-cat-form" style="display:none;" class="sm-add-form">
            <input type="text" class="sm-input" id="sm-add-cat-name" placeholder="类别名称（如：习惯）">
            <input type="text" class="sm-input" id="sm-add-cat-id" placeholder="标识符（如：H）" maxlength="3">
            <div class="sm-add-actions">
                <button class="sm-btn sm-btn-primary" onclick="uiConfirmAddCategory()">添加</button>
                <button class="sm-btn sm-btn-secondary" onclick="document.getElementById('sm-add-cat-form').style.display='none'">取消</button>
            </div>
        </div>
        <button class="sm-btn sm-btn-outline" onclick="document.getElementById('sm-add-cat-form').style.display='block'">+ 添加自定义类别</button>
    `;
    container.appendChild(addCatBtn);
    
    // 手动总结按钮
    const summarizeBtn = document.createElement('div');
    summarizeBtn.className = 'sm-summarize-area';
    summarizeBtn.innerHTML = `<button class="sm-btn sm-btn-summarize" onclick="uiManualExtract()">🤖 总结</button>`;
    container.appendChild(summarizeBtn);
}

// ==================== 结构化记忆 UI 交互 ====================

function uiAddEntry(categoryId) {
    document.getElementById(`sm-add-form-${categoryId}`).style.display = 'block';
    document.getElementById(`sm-add-text-${categoryId}`).focus();
}

function uiCancelAddEntry(categoryId) {
    document.getElementById(`sm-add-form-${categoryId}`).style.display = 'none';
    document.getElementById(`sm-add-text-${categoryId}`).value = '';
}

function uiConfirmAddEntry(categoryId) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    const text = document.getElementById(`sm-add-text-${categoryId}`).value.trim();
    const date = document.getElementById(`sm-add-date-${categoryId}`).value;
    if (!text) { alert('请输入记忆内容'); return; }
    addMemoryEntry(contact, categoryId, text, date || new Date().toISOString().slice(0, 10));
    renderStructuredMemory(contact);
}

function uiEditEntry(entryId) {
    document.getElementById(`sm-entry-view-${entryId}`).style.display = 'none';
    document.getElementById(`sm-entry-edit-${entryId}`).style.display = 'block';
}

function uiCancelEditEntry(entryId) {
    document.getElementById(`sm-entry-view-${entryId}`).style.display = '';
    document.getElementById(`sm-entry-edit-${entryId}`).style.display = 'none';
}

function uiConfirmEditEntry(entryId) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    const text = document.getElementById(`sm-edit-text-${entryId}`).value.trim();
    const date = document.getElementById(`sm-edit-date-${entryId}`).value;
    if (!text) { alert('请输入记忆内容'); return; }
    editMemoryEntry(contact, entryId, text, date);
    renderStructuredMemory(contact);
}

function uiDeleteEntry(entryId) {
    if (!confirm('确定要删除这条记忆吗？')) return;
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    deleteMemoryEntry(contact, entryId);
    renderStructuredMemory(contact);
}

function uiConfirmAddCategory() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    const name = document.getElementById('sm-add-cat-name').value.trim();
    const shortId = document.getElementById('sm-add-cat-id').value.trim().toUpperCase();
    if (!name || !shortId) { alert('请填写类别名称和标识符'); return; }
    if (!addCustomCategory(contact, name, shortId)) {
        alert('标识符已存在，请更换');
        return;
    }
    renderStructuredMemory(contact);
}

function uiDeleteCustomCategory(categoryId) {
    if (!confirm('删除该类别将同时删除其下所有条目，确定吗？')) return;
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    deleteCustomCategory(contact, categoryId);
    renderStructuredMemory(contact);
}

async function uiManualExtract() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    const unsummarized = (contact.chat_history || []).filter(m => !m.summarized && m.message);
    if (unsummarized.length === 0) {
        alert('没有需要总结的新消息');
        return;
    }
    await extractStructuredMemory(contact, unsummarized);
    // 标记为已总结
    for (const msg of unsummarized) { msg.summarized = true; }
    saveContacts();
    renderStructuredMemory(contact);
    alert('记忆提取完成！');
}

// 点击弹窗外部关闭
document.addEventListener('click', (e) => {
    const analysisModal = document.getElementById('tokenAnalysisModal');
    const memoryModal = document.getElementById('memoryBankModal');
    
    if (e.target === analysisModal) {
        closeTokenAnalysis();
    }
    
    if (e.target === memoryModal) {
        closeMemoryBank();
    }
});

// ==================== 图标上传功能 ====================

// 上传 Token 分析图标
function uploadTokenAnalysisIcon(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const iconUrl = e.target.result;
        document.getElementById('tokenAnalysisIconUrl').value = iconUrl;
        document.getElementById('tokenAnalysisIconPreview').src = iconUrl;
    };
    reader.readAsDataURL(file);
}

// 上传记忆库图标
function uploadMemoryBankIcon(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const iconUrl = e.target.result;
        document.getElementById('memoryBankIconUrl').value = iconUrl;
        document.getElementById('memoryBankIconPreview').src = iconUrl;
    };
    reader.readAsDataURL(file);
}

// 保存记忆库图标
function saveMemoryBankIcon() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const iconUrl = document.getElementById('memoryBankIconUrl').value.trim();
    
    if (!contact.customIcons) {
        contact.customIcons = {};
    }
    
    contact.customIcons.memoryBank = iconUrl || 'https://files.catbox.moe/9136hf.jpg';
    saveContacts();
    
    // 更新聊天页面的图标
    updateChatIcons(contact);
    
    alert('图标已保存');
}

// 更新聊天页面的图标
function updateChatIcons(contact) {
    const tokenBtn = document.querySelector('button[onclick="openTokenAnalysis()"]');
    const memoryBtn = document.querySelector('button[onclick="openMemoryBank()"]');
    
    if (tokenBtn && contact.customIcons && contact.customIcons.tokenAnalysis) {
        const img = tokenBtn.querySelector('img');
        if (img) {
            img.src = contact.customIcons.tokenAnalysis;
        }
    }
    
    if (memoryBtn && contact.customIcons && contact.customIcons.memoryBank) {
        const img = memoryBtn.querySelector('img');
        if (img) {
            img.src = contact.customIcons.memoryBank;
        }
    }
}

// 监听 URL 输入框变化，实时更新预览
document.addEventListener('DOMContentLoaded', () => {
    const tokenUrlInput = document.getElementById('tokenAnalysisIconUrl');
    const memoryUrlInput = document.getElementById('memoryBankIconUrl');
    
    if (tokenUrlInput) {
        tokenUrlInput.addEventListener('input', function() {
            const preview = document.getElementById('tokenAnalysisIconPreview');
            if (this.value.trim()) {
                preview.src = this.value.trim();
            }
        });
    }
    
    if (memoryUrlInput) {
        memoryUrlInput.addEventListener('input', function() {
            const preview = document.getElementById('memoryBankIconPreview');
            if (this.value.trim()) {
                preview.src = this.value.trim();
            }
        });
    }
    
    // 监听上下文窗口大小变化，实时更新 Token 统计
    const contextWindowInput = document.getElementById('contextWindowSize');
    if (contextWindowInput) {
        contextWindowInput.addEventListener('input', function() {
            const contact = vibeContacts.find(c => c.id === currentChatContactId);
            if (contact) {
                updateTokenStats(contact);
            }
        });
    }
});

// ==================== 总结动画功能 ====================

// 开始总结动画
function startSummarizingAnimation() {
    const tokenBtn = document.querySelector('button[onclick="openTokenAnalysis()"]');
    const memoryBtn = document.querySelector('button[onclick="openMemoryBank()"]');
    
    if (tokenBtn) {
        tokenBtn.classList.add('summarizing');
    }
    
    if (memoryBtn) {
        memoryBtn.classList.add('summarizing');
    }
}

// 停止总结动画
function stopSummarizingAnimation() {
    const tokenBtn = document.querySelector('button[onclick="openTokenAnalysis()"]');
    const memoryBtn = document.querySelector('button[onclick="openMemoryBank()"]');
    
    if (tokenBtn) {
        tokenBtn.classList.remove('summarizing');
    }
    
    if (memoryBtn) {
        memoryBtn.classList.remove('summarizing');
    }
}

// 开始重新生成动画
function startRegeneratingAnimation() {
    const regenerateBtn = document.querySelector('button[onclick="regenerateLastReply()"]');
    
    if (regenerateBtn) {
        regenerateBtn.classList.add('summarizing');
    }
}

// 停止重新生成动画
function stopRegeneratingAnimation() {
    const regenerateBtn = document.querySelector('button[onclick="regenerateLastReply()"]');
    
    if (regenerateBtn) {
        regenerateBtn.classList.remove('summarizing');
    }
}

// 显示总结确认弹窗
function showSummaryConfirmDialog(contact, messages, startIndex, endIndex) {
    const messageCount = messages.length;
    
    // 创建自定义确认对话框
    const dialog = document.createElement('div');
    dialog.className = 'summary-confirm-dialog';
    dialog.innerHTML = `
        <div class="summary-confirm-content">
            <div class="summary-confirm-header">
                <h3>📝 自动总结提醒</h3>
            </div>
            <div class="summary-confirm-body">
                <p>检测到 <strong>${messageCount}</strong> 条未总结的消息（第 ${startIndex} - ${endIndex} 条）</p>
                <p>是否现在进行总结？</p>
                <div class="summary-confirm-note">
                    💡 总结后的内容会保存到记忆库，消息会被标记为 ♥
                </div>
            </div>
            <div class="summary-confirm-actions">
                <button class="btn-secondary" onclick="cancelSummary()">稍后再说</button>
                <button class="btn-primary" onclick="confirmSummary()">立即总结</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 添加淡入动画
    setTimeout(() => {
        dialog.classList.add('active');
    }, 10);
    
    // 保存当前总结信息到全局变量
    window.currentSummaryRequest = {
        contact: contact,
        messages: messages,
        startIndex: startIndex,
        endIndex: endIndex
    };
}

// 确认总结
async function confirmSummary() {
    const dialog = document.querySelector('.summary-confirm-dialog');
    if (dialog) {
        dialog.classList.remove('active');
        setTimeout(() => dialog.remove(), 300);
    }
    
    if (!window.currentSummaryRequest) return;
    
    const { contact, messages, startIndex, endIndex } = window.currentSummaryRequest;
    
    // 清除待总结标记
    contact.pendingSummary = false;
    saveContacts();
    
    // 执行总结
    await performSummary(contact, messages, startIndex, endIndex);
    
    // 清除全局变量
    window.currentSummaryRequest = null;
}

// 取消总结
function cancelSummary() {
    const dialog = document.querySelector('.summary-confirm-dialog');
    if (dialog) {
        dialog.classList.remove('active');
        setTimeout(() => dialog.remove(), 300);
    }
    
    if (!window.currentSummaryRequest) return;
    
    const { contact } = window.currentSummaryRequest;
    
    // 保持待总结标记，下次对话轮次后再次提示
    console.log('用户取消总结，将在下次对话轮次后再次提示');
    
    // 清除全局变量
    window.currentSummaryRequest = null;
}

// ==================== 重新生成回复功能 ====================

// 重新生成最后一条 AI 回复
function regenerateLastReply() {
    // 关闭重新生成菜单
    document.getElementById('regenerateMenu').classList.remove('active');
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 确保 chat_history 存在
    if (!contact.chat_history || contact.chat_history.length === 0) {
        alert('没有聊天记录，无法重新生成');
        return;
    }
    
    // 找到最后一条 AI 消息
    const lastAIMessageIndex = contact.chat_history.length - 1;
    let lastAIMessage = null;
    let lastAIIndex = -1;
    
    // 从后往前找第一条 AI 消息
    for (let i = contact.chat_history.length - 1; i >= 0; i--) {
        if (contact.chat_history[i].sender === 'contact') {
            lastAIMessage = contact.chat_history[i];
            lastAIIndex = i;
            break;
        }
    }
    
    if (!lastAIMessage) {
        alert('没有找到 AI 的回复，无法重新生成');
        return;
    }
    
    // 检查是否有对应的用户消息
    let hasUserMessage = false;
    for (let i = lastAIIndex - 1; i >= 0; i--) {
        if (contact.chat_history[i].sender === 'user') {
            hasUserMessage = true;
            break;
        }
    }
    
    if (!hasUserMessage) {
        alert('没有找到对应的用户消息，无法重新生成');
        return;
    }
    
    // 显示确认对话框
    showRegenerateConfirmDialog(contact, lastAIIndex);
}

// 显示重新生成菜单
function showRegenerateMenu() {
    const menu = document.getElementById('regenerateMenu');
    menu.classList.toggle('active');
    
    // 关闭其他菜单
    document.getElementById('chatMenu').classList.remove('active');
    
    // 点击外部关闭
    if (menu.classList.contains('active')) {
        setTimeout(() => {
            document.addEventListener('click', closeRegenerateMenuOutside);
        }, 100);
    }
}

function closeRegenerateMenuOutside(e) {
    const menu = document.getElementById('regenerateMenu');
    const btn = document.querySelector('button[onclick="showRegenerateMenu()"]');
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('active');
        document.removeEventListener('click', closeRegenerateMenuOutside);
    }
}

// 打开重新生成图标设置
function openRegenerateIconSettings() {
    // 关闭菜单
    document.getElementById('regenerateMenu').classList.remove('active');
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const modal = document.getElementById('regenerateIconModal');
    modal.classList.add('active');
    
    // 加载当前图标
    const iconUrl = (contact.customIcons && contact.customIcons.regenerate) || 'https://files.catbox.moe/cbatt5.jpg';
    document.getElementById('regenerateIconUrl').value = iconUrl;
    document.getElementById('regenerateIconPreview').src = iconUrl;
}

// 关闭重新生成图标设置
function closeRegenerateIconSettings() {
    const modal = document.getElementById('regenerateIconModal');
    modal.classList.remove('active');
}

// 上传重新生成图标
function uploadRegenerateIcon(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('regenerateIconUrl').value = e.target.result;
        document.getElementById('regenerateIconPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 保存重新生成图标
function saveRegenerateIcon() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const iconUrl = document.getElementById('regenerateIconUrl').value.trim();
    if (!iconUrl) {
        alert('请输入图标 URL 或上传图片');
        return;
    }
    
    if (!contact.customIcons) {
        contact.customIcons = {};
    }
    contact.customIcons.regenerate = iconUrl;
    
    saveContacts();
    
    // 更新聊天页面的图标
    const iconImg = document.getElementById('regenerateIcon');
    if (iconImg) {
        iconImg.src = iconUrl;
    }
    
    closeRegenerateIconSettings();
    alert('图标已保存');
}

// 打开语音功能图标设置
function openVoiceIconSettings() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const modal = document.getElementById('voiceIconModal');
    modal.classList.add('active');
    
    // 加载当前图标
    const iconUrl = (contact.customIcons && contact.customIcons.voice) || 'https://i.ibb.co/yFDN2pB/image.png';
    document.getElementById('voiceIconUrl').value = iconUrl;
    document.getElementById('voiceIconPreview').src = iconUrl;
}

// 关闭语音功能图标设置
function closeVoiceIconSettings() {
    const modal = document.getElementById('voiceIconModal');
    modal.classList.remove('active');
}

// 上传语音功能图标
function uploadVoiceIcon(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('voiceIconUrl').value = e.target.result;
        document.getElementById('voiceIconPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 保存语音功能图标
function saveVoiceIcon() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const iconUrl = document.getElementById('voiceIconUrl').value.trim();
    if (!iconUrl) {
        alert('请输入图标 URL 或上传图片');
        return;
    }
    
    if (!contact.customIcons) {
        contact.customIcons = {};
    }
    contact.customIcons.voice = iconUrl;
    
    saveContacts();
    
    // 更新聊天页面的图标
    const iconImg = document.getElementById('voiceFunctionIcon');
    if (iconImg) {
        iconImg.src = iconUrl;
    }
    
    closeVoiceIconSettings();
    alert('图标已保存');
}

// ==================== 消息编辑模式 ====================

let isEditMode = false;
let selectedMessages = new Set();

// 切换消息编辑模式
function toggleMessageEditMode() {
    console.log('toggleMessageEditMode 被调用，当前 isEditMode:', isEditMode);
    isEditMode = !isEditMode;
    const container = document.getElementById('chatMessages');
    console.log('chatMessages 容器:', container);
    const toolbar = getOrCreateEditToolbar();
    console.log('工具栏:', toolbar);
    
    if (isEditMode) {
        console.log('进入编辑模式');
        container.classList.add('message-edit-mode');
        toolbar.classList.add('active');
        console.log('工具栏 active 类已添加，display 应该变为 flex');
        updateEditToolbar();
    } else {
        console.log('退出编辑模式');
        container.classList.remove('message-edit-mode');
        toolbar.classList.remove('active');
        selectedMessages.clear();
        
        // 移除所有选中状态
        document.querySelectorAll('.message-bubble.selected').forEach(bubble => {
            bubble.classList.remove('selected');
        });
    }
}

// 获取或创建编辑工具栏
function getOrCreateEditToolbar() {
    let toolbar = document.getElementById('editModeToolbar');
    console.log('查找现有工具栏:', toolbar);
    if (!toolbar) {
        console.log('创建新工具栏');
        toolbar = document.createElement('div');
        toolbar.id = 'editModeToolbar';
        toolbar.className = 'edit-mode-toolbar';
        toolbar.innerHTML = `
            <span class="selection-count">已选择 0 条</span>
            <button class="btn-edit" onclick="editSelectedMessage()">编辑</button>
            <button class="btn-delete" onclick="deleteSelectedMessages()">删除</button>
            <button class="btn-icon-settings" onclick="openMessageEditIconSettings()">图标</button>
            <button class="btn-cancel" onclick="toggleMessageEditMode()">取消</button>
        `;
        const pageChat = document.getElementById('page-chat');
        console.log('page-chat 元素:', pageChat);
        if (pageChat) {
            pageChat.appendChild(toolbar);
            console.log('工具栏已添加到 page-chat');
        } else {
            console.error('找不到 page-chat 元素！');
        }
    }
    return toolbar;
}

// 更新编辑工具栏
function updateEditToolbar() {
    const toolbar = document.getElementById('editModeToolbar');
    if (toolbar) {
        const count = selectedMessages.size;
        toolbar.querySelector('.selection-count').textContent = `已选择 ${count} 条`;
    }
}

// 切换消息选中状态
function toggleMessageSelection(msgId) {
    if (!isEditMode) return;
    
    if (selectedMessages.has(msgId)) {
        selectedMessages.delete(msgId);
    } else {
        selectedMessages.add(msgId);
    }
    
    updateEditToolbar();
}

// 删除选中的消息
function deleteSelectedMessages() {
    if (selectedMessages.size === 0) {
        alert('请先选择要删除的消息');
        return;
    }
    
    if (!confirm(`确定要删除选中的 ${selectedMessages.size} 条消息吗？\n\n注意：\n- 已总结的记忆不会受影响\n- 未总结的消息将不会被读取`)) {
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 删除选中的消息
    contact.chat_history = contact.chat_history.filter(msg => !selectedMessages.has(msg.id));
    
    saveContacts();
    selectedMessages.clear();
    
    // 重新渲染消息
    renderChatMessages();
    
    // 退出编辑模式
    toggleMessageEditMode();
    
    alert('消息已删除');
}

// 编辑选中的消息
function editSelectedMessage() {
    if (selectedMessages.size === 0) {
        alert('请先选择要编辑的消息');
        return;
    }
    
    if (selectedMessages.size > 1) {
        alert('一次只能编辑一条消息');
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const msgId = Array.from(selectedMessages)[0];
    const msg = contact.chat_history.find(m => m.id === msgId);
    
    if (!msg) return;
    
    // 获取原始文本
    let originalText = '';
    if (msg.role === 'system_call') {
        // 通话记录：显示完整内容（AI视角）
        originalText = msg.message || msg.hidden_content || '';
        console.log('📝 [编辑] 通话记录完整内容:', originalText.substring(0, 100) + '...');
    } else if (msg.type === 'voice') {
        originalText = `[VOICE:${msg.tone}]${msg.message}`;
    } else if (msg.type === 'image') {
        originalText = `[IMAGE]${msg.description || ''}`;
    } else if (msg.type === 'video') {
        originalText = `[VIDEO]${msg.description || ''}`;
    } else if (msg.type === 'sticker') {
        originalText = `[STICKER:${msg.stickerName}]`;
    } else {
        originalText = msg.message;
    }
    
    // 显示编辑对话框
    const promptText = msg.role === 'system_call' 
        ? '编辑通话记录内容：\n\n注意：这是AI视角的完整通话内容\n格式：[User]: xxx\n[CHAR]: xxx'
        : '编辑消息内容：\n\n注意：\n- 已总结的记忆不会受影响\n- 未总结的消息将以修改后的内容进行总结';
    
    const newText = prompt(promptText, originalText);
    
    if (newText === null || newText.trim() === '') {
        return;
    }
    
    // 如果是通话记录，直接更新message字段
    if (msg.role === 'system_call') {
        msg.message = newText.trim();
        console.log('✅ [编辑] 通话记录已更新');
    } else {
        // 解析新的消息格式
        const messageData = parseAIMessageFormat(newText.trim(), contact);
        
        // 更新消息
        msg.type = messageData.type;
        msg.message = messageData.message;
        msg.tone = messageData.tone;
        msg.imageUrl = messageData.imageUrl;
        msg.videoUrl = messageData.videoUrl;
        msg.description = messageData.description;
        msg.stickerName = messageData.stickerName;
        msg.stickerUrl = messageData.stickerUrl;
        
        // 如果是语音消息，清除 TTS 缓存
        if (msg.type === 'voice' && msg.ttsAudioUrl) {
            delete msg.ttsAudioUrl;
        }
    }
    
    saveContacts();
    selectedMessages.clear();
    
    // 重新渲染消息
    renderChatMessages();
    
    // 退出编辑模式
    toggleMessageEditMode();
    
    alert('消息已更新');
}


// 打开消息编辑图标设置
function openMessageEditIconSettings() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const modal = document.getElementById('messageEditIconModal');
    modal.classList.add('active');
    
    // 加载当前图标
    const iconUrl = (contact.customIcons && contact.customIcons.messageEdit) || 'https://i.ibb.co/YFhP77Sz/format-icon.jpg';
    document.getElementById('messageEditIconUrl').value = iconUrl;
    document.getElementById('messageEditIconPreview').src = iconUrl;
}

// 关闭消息编辑图标设置
function closeMessageEditIconSettings() {
    const modal = document.getElementById('messageEditIconModal');
    modal.classList.remove('active');
}

// 上传消息编辑图标
function uploadMessageEditIcon(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('messageEditIconUrl').value = e.target.result;
        document.getElementById('messageEditIconPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 保存消息编辑图标
function saveMessageEditIcon() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const iconUrl = document.getElementById('messageEditIconUrl').value.trim();
    if (!iconUrl) {
        alert('请输入图标 URL 或上传图片');
        return;
    }
    
    if (!contact.customIcons) {
        contact.customIcons = {};
    }
    contact.customIcons.messageEdit = iconUrl;
    
    saveContacts();
    
    // 更新聊天页面的图标
    const iconImg = document.getElementById('messageEditIcon');
    if (iconImg) {
        iconImg.src = iconUrl;
    }
    
    closeMessageEditIconSettings();
    alert('图标已保存');
}

// ==================== 收藏消息功能 ====================

// 添加到收藏
function addToFavorites(msg, contact) {
    if (!contact.favorites) {
        contact.favorites = [];
    }
    
    // 检查是否已收藏
    const exists = contact.favorites.some(fav => fav.originalMsgId === msg.id);
    if (exists) {
        alert('该消息已收藏');
        return;
    }
    
    // 创建收藏项
    const favorite = {
        id: Date.now(),
        originalMsgId: msg.id,
        type: msg.type,
        sender: msg.sender,
        timestamp: msg.timestamp,
        // 复制消息内容
        message: msg.message,
        tone: msg.tone,
        imageUrl: msg.imageUrl,
        videoUrl: msg.videoUrl,
        description: msg.description,
        stickerName: msg.stickerName,
        stickerUrl: msg.stickerUrl,
        ttsAudioUrl: msg.ttsAudioUrl
    };
    
    contact.favorites.push(favorite);
    saveContacts();
    
    // 显示收藏成功动画
    const bubbleDiv = document.querySelector(`[data-msg-id="${msg.id}"]`);
    if (bubbleDiv) {
        bubbleDiv.classList.add('favorite-added');
        setTimeout(() => {
            bubbleDiv.classList.remove('favorite-added');
        }, 300);
    }
    
    // 显示提示
    showToast('已收藏');
}

// 显示简单提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 10000;
        pointer-events: none;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 1500);
}

// 打开收藏列表
function openFavorites() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const modal = document.getElementById('favoritesModal');
    modal.classList.add('active');
    
    renderFavoritesList(contact);
}

// 关闭收藏列表
function closeFavorites() {
    const modal = document.getElementById('favoritesModal');
    modal.classList.remove('active');
}

// 渲染收藏列表
function renderFavoritesList(contact) {
    const container = document.getElementById('favoritesList');
    const emptyDiv = document.getElementById('favoritesEmpty');
    
    if (!contact.favorites || contact.favorites.length === 0) {
        container.style.display = 'none';
        emptyDiv.style.display = 'flex';
        return;
    }
    
    container.style.display = 'flex';
    emptyDiv.style.display = 'none';
    container.innerHTML = '';
    
    // 按时间倒序排列
    const sortedFavorites = [...contact.favorites].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    sortedFavorites.forEach(favorite => {
        const item = createFavoriteItem(favorite, contact);
        container.appendChild(item);
    });
}

// 创建收藏项元素
function createFavoriteItem(favorite, contact) {
    const div = document.createElement('div');
    div.className = 'favorite-item';
    
    // 格式化时间
    const time = new Date(favorite.timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // 获取头像
    const profile = getCurrentProfile();
    const avatar = favorite.sender === 'user' ? profile.avatarUrl : contact.avatarUrl;
    const senderName = favorite.sender === 'user' ? profile.name : contact.name;
    
    // 类型图标
    const typeIcons = {
        text: '💬',
        voice: '🎤',
        image: '🖼️',
        video: '🎬',
        sticker: '😊'
    };
    
    // 构建内容
    let contentHTML = '';
    
    if (favorite.type === 'text') {
        contentHTML = favorite.message;
    } else if (favorite.type === 'voice') {
        contentHTML = `<strong>语气：</strong>${favorite.tone}<br><strong>内容：</strong>${favorite.message}`;
    } else if (favorite.type === 'image') {
        contentHTML = `<img src="${favorite.imageUrl}" alt="图片" style="max-width: 100%; border-radius: 8px; margin-top: 8px;">`;
        if (favorite.description) contentHTML += `<br>${favorite.description}`;
    } else if (favorite.type === 'video') {
        contentHTML = `<img src="${favorite.videoUrl}" alt="视频" style="max-width: 100%; border-radius: 8px; margin-top: 8px;">`;
        if (favorite.description) contentHTML += `<br>${favorite.description}`;
    } else if (favorite.type === 'sticker') {
        contentHTML = `<img src="${favorite.stickerUrl}" alt="${favorite.stickerName}" style="max-width: 200px; border-radius: 8px; margin-top: 8px;"><br>${favorite.stickerName}`;
    }
    
    // 操作按钮
    let actionsHTML = '';
    if (favorite.type === 'voice' && favorite.ttsAudioUrl) {
        actionsHTML += `<button onclick="playFavoriteAudio('${favorite.id}')" title="播放">▶ 播放</button>`;
    }
    actionsHTML += `<button onclick="deleteFavorite('${favorite.id}')" title="删除">🗑️ 删除</button>`;
    
    div.innerHTML = `
        <div class="favorite-item-header">
            <div class="favorite-item-info">
                <img src="${avatar}" class="favorite-item-avatar" onerror="this.style.display='none'">
                <div class="favorite-item-meta">
                    <div class="favorite-item-name">${typeIcons[favorite.type]} ${senderName}</div>
                    <div class="favorite-item-time">${time}</div>
                </div>
            </div>
            <div class="favorite-item-actions">
                ${actionsHTML}
            </div>
        </div>
        <div class="favorite-item-content">
            ${contentHTML}
        </div>
    `;
    
    return div;
}

// 播放收藏的语音
function playFavoriteAudio(favoriteId) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const favorite = contact.favorites.find(f => f.id == favoriteId);
    if (!favorite || !favorite.ttsAudioUrl) return;
    
    // 停止当前播放的音频
    if (currentPlayingAudio && !currentPlayingAudio.paused) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
    }
    
    // 播放收藏的音频
    const audio = new Audio(favorite.ttsAudioUrl);
    currentPlayingAudio = audio;
    
    audio.onended = () => {
        if (currentPlayingAudio === audio) {
            currentPlayingAudio = null;
        }
    };
    
    audio.play();
}

// 删除收藏
function deleteFavorite(favoriteId) {
    if (!confirm('确定要删除这条收藏吗？')) {
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    contact.favorites = contact.favorites.filter(f => f.id != favoriteId);
    saveContacts();
    
    renderFavoritesList(contact);
    showToast('已删除');
}


// 显示重新生成确认对话框
function showRegenerateConfirmDialog(contact, messageIndex) {
    const dialog = document.createElement('div');
    dialog.className = 'summary-confirm-dialog';
    dialog.innerHTML = `
        <div class="summary-confirm-content">
            <div class="summary-confirm-header">
                <h3>🔄 重新生成回复</h3>
            </div>
            <div class="summary-confirm-body">
                <p>确定要重新生成 <strong>${contact.name}</strong> 的最后一条回复吗？</p>
                <div class="summary-confirm-note">
                    💡 当前回复将被删除，AI 会基于之前的对话重新生成回复
                </div>
            </div>
            <div class="summary-confirm-actions">
                <button class="btn-secondary" onclick="cancelRegenerate()">取消</button>
                <button class="btn-primary" onclick="confirmRegenerate()">确认重新生成</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 添加淡入动画
    setTimeout(() => {
        dialog.classList.add('active');
    }, 10);
    
    // 保存当前重新生成信息到全局变量
    window.currentRegenerateRequest = {
        contact: contact,
        messageIndex: messageIndex
    };
}

// 确认重新生成
async function confirmRegenerate() {
    const dialog = document.querySelector('.summary-confirm-dialog');
    if (dialog) {
        dialog.classList.remove('active');
        setTimeout(() => dialog.remove(), 300);
    }
    
    if (!window.currentRegenerateRequest) return;
    
    const { contact, messageIndex } = window.currentRegenerateRequest;
    
    console.log('=== 开始重新生成 ===');
    console.log('点击的消息索引:', messageIndex);
    console.log('当前聊天历史长度:', contact.chat_history.length);
    
    // 找到最后一条用户消息
    let lastUserMessage = '';
    let lastUserMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
        if (contact.chat_history[i].sender === 'user') {
            lastUserMessage = contact.chat_history[i].message;
            lastUserMessageIndex = i;
            console.log('找到最后一条用户消息 (索引 ' + i + '):', lastUserMessage);
            break;
        }
    }
    
    // 删除从最后一条用户消息之后的所有 AI 消息
    // 这样可以确保删除所有连续的 AI 回复
    const messagesToDelete = [];
    for (let i = lastUserMessageIndex + 1; i < contact.chat_history.length; i++) {
        if (contact.chat_history[i].sender === 'contact') {
            messagesToDelete.push(i);
            console.log('标记删除 AI 消息 (索引 ' + i + '):', contact.chat_history[i].message.substring(0, 50));
        }
    }
    
    console.log('总共需要删除', messagesToDelete.length, '条 AI 消息');
    
    // 从后往前删除，避免索引变化
    for (let i = messagesToDelete.length - 1; i >= 0; i--) {
        contact.chat_history.splice(messagesToDelete[i], 1);
    }
    
    saveContacts();
    
    console.log('删除完成，剩余消息数:', contact.chat_history.length);
    console.log('=== 准备重新调用 AI ===');
    
    // 重新渲染聊天消息
    renderChatMessages();
    
    // 显示重新生成动画
    startRegeneratingAnimation();
    
    // 显示"正在输入中"状态
    showTypingIndicator(contact);
    
    // 重新调用 AI 生成回复
    await getAIResponse(contact, lastUserMessage);
    
    // 隐藏"正在输入中"状态
    hideTypingIndicator(contact);
    
    // 停止重新生成动画
    stopRegeneratingAnimation();
    
    // 清除全局变量
    window.currentRegenerateRequest = null;
}

// 取消重新生成
function cancelRegenerate() {
    const dialog = document.querySelector('.summary-confirm-dialog');
    if (dialog) {
        dialog.classList.remove('active');
        setTimeout(() => dialog.remove(), 300);
    }
    
    // 清除全局变量
    window.currentRegenerateRequest = null;
}

// ==================== 消息格式设置功能 ====================

// 打开消息格式设置
// 打开消息格式设置 - 已移至后面统一定义

// 关闭消息格式设置 - 已移至后面统一定义

// 加载消息格式设置
function loadMessageFormatSettings(contact) {
    const settings = contact.messageFormatSettings || {
        defaultImageUrl: 'https://files.catbox.moe/gd7ol9.jpg',
        defaultVideoUrl: 'https://i.ibb.co/prxBykPd/video-default.jpg',
        formatInstructions: ''
    };
    
    document.getElementById('defaultImageUrl').value = settings.defaultImageUrl;
    document.getElementById('defaultImagePreview').src = settings.defaultImageUrl;
    
    document.getElementById('defaultVideoUrl').value = settings.defaultVideoUrl;
    document.getElementById('defaultVideoPreview').src = settings.defaultVideoUrl;
    
    // 不再加载格式说明到 DOM，使用统一管理系统
    // if (settings.formatInstructions) {
    //     document.getElementById('messageFormatInstructions').value = settings.formatInstructions;
    // }
    
    // 加载联系人表情包
    renderContactStickerList(contact);
}

// 上传默认图片 - 已移至后面统一定义

// 上传默认视频图 - 已移至后面统一定义

// 保存消息格式设置 - 已移至后面统一定义

// 渲染联系人表情包列表
function renderContactStickerList(contact) {
    const container = document.getElementById('contactStickerList');
    container.innerHTML = '';
    
    if (!contact.stickers || contact.stickers.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #95a5a6;">暂无表情包</div>';
        return;
    }
    
    contact.stickers.forEach((sticker, index) => {
        const item = document.createElement('div');
        item.style.cssText = 'position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; cursor: pointer;';
        item.innerHTML = `
            <img src="${sticker.url}" alt="${sticker.name}" title="${sticker.name}" style="width: 100%; height: 100%; object-fit: cover;">
            <button onclick="deleteContactSticker(${index})" style="position: absolute; top: 4px; right: 4px; background: rgba(231, 76, 60, 0.9); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;">×</button>
        `;
        container.appendChild(item);
    });
}

// 添加联系人表情包
function addContactStickers() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const input = document.getElementById('contactStickerInput').value.trim();
    
    if (!input) {
        alert('请输入表情包数据');
        return;
    }
    
    if (!contact.stickers) {
        contact.stickers = [];
    }
    
    const lines = input.split('\n');
    let added = 0;
    
    lines.forEach(line => {
        const parts = line.trim().split('|');
        if (parts.length === 2) {
            const name = parts[0].trim();
            const url = parts[1].trim();
            
            if (name && url) {
                contact.stickers.push({ name, url });
                added++;
            }
        }
    });
    
    if (added > 0) {
        alert(`成功添加 ${added} 个表情包`);
        document.getElementById('contactStickerInput').value = '';
        renderContactStickerList(contact);
        saveContacts();
    } else {
        alert('没有有效的表情包数据');
    }
}

// 删除联系人表情包
function deleteContactSticker(index) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact || !contact.stickers) return;
    
    if (!confirm('确定删除这个表情包？')) {
        return;
    }
    
    contact.stickers.splice(index, 1);
    renderContactStickerList(contact);
    saveContacts();
}


// 监听 URL 输入框变化，实时更新预览
document.addEventListener('DOMContentLoaded', () => {
    const defaultImageInput = document.getElementById('defaultImageUrl');
    const defaultVideoInput = document.getElementById('defaultVideoUrl');
    
    if (defaultImageInput) {
        defaultImageInput.addEventListener('input', function() {
            const preview = document.getElementById('defaultImagePreview');
            if (this.value.trim()) {
                preview.src = this.value.trim();
            }
        });
    }
    
    if (defaultVideoInput) {
        defaultVideoInput.addEventListener('input', function() {
            const preview = document.getElementById('defaultVideoPreview');
            if (this.value.trim()) {
                preview.src = this.value.trim();
            }
        });
    }
});

// ==================== 消息类型菜单功能 ====================

// 显示消息类型菜单
function showMessageTypeMenu() {
    const menu = document.getElementById('messageTypeMenu');
    menu.classList.toggle('active');
    
    // 点击外部关闭
    if (menu.classList.contains('active')) {
        setTimeout(() => {
            document.addEventListener('click', closeMessageTypeMenuOutside);
        }, 100);
    }
}

function closeMessageTypeMenuOutside(e) {
    const menu = document.getElementById('messageTypeMenu');
    const btn = document.querySelector('button[onclick="showMessageTypeMenu()"]');
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('active');
        document.removeEventListener('click', closeMessageTypeMenuOutside);
    }
}

// 显示输入菜单（+ 按钮）- 打开底部面板
function showInputMenu() {
    const overlay = document.getElementById('bottomSheetOverlay');
    const sheet = document.getElementById('bottomSheet');
    
    const isActive = sheet.classList.contains('active');
    
    // 关闭其他菜单
    document.getElementById('stickerMenu').classList.remove('active');
    document.getElementById('messageTypeMenu').classList.remove('active');
    
    if (isActive) {
        closeBottomSheet();
    } else {
        overlay.classList.add('active');
        sheet.classList.add('active');
    }
}

// 关闭底部面板
function closeBottomSheet() {
    const overlay = document.getElementById('bottomSheetOverlay');
    const sheet = document.getElementById('bottomSheet');
    
    overlay.classList.remove('active');
    sheet.classList.remove('active');
}

// 处理底部面板操作
function handleBottomSheetAction(action) {
    closeBottomSheet();
    
    switch(action) {
        case 'video':
            startVideoCall();
            break;
        case 'call':
            startVoiceCall();
            break;
        case 'image':
            openImageSendDialog();
            break;
        case 'location':
            alert('定位功能开发中');
            break;
        case 'manage':
            // 打开联系人管理面板
            openContactManagement();
            break;
    }
}

// ==================== 视频通话功能 ====================

// 视频通话状态
let videoCallState = {
    active: false,
    contactId: null,
    startTime: null,
    messages: [],
    durationInterval: null
};

// 开始视频通话
function startVideoCall() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 初始化视频通话状态
    videoCallState = {
        active: true,
        contactId: contact.id,
        startTime: Date.now(),
        messages: [],
        durationInterval: null
    };
    
    // 初始化视频通话设置（如果不存在）
    if (!contact.videoCallSettings) {
        contact.videoCallSettings = {
            characterImages: [],
            currentImageId: null,
            enableTTS: true,
            // 不再使用 videoCallPrompt 字段，使用统一管理系统
            // videoCallPrompt: getDefaultVideoCallPrompt(),
            bubbleCSS: '',
            cssSchemes: [],
            uiCSS: '',
            uiCSSSchemes: [],
            icons: {}
        };
    }
    
    // 设置 CHAR 形象
    const characterImage = document.getElementById('videoCallCharacterImage');
    if (contact.videoCallSettings.currentImageId) {
        const selectedImage = contact.videoCallSettings.characterImages.find(
            img => img.id === contact.videoCallSettings.currentImageId
        );
        if (selectedImage) {
            characterImage.src = selectedImage.url;
        } else if (contact.avatarUrl) {
            characterImage.src = contact.avatarUrl;
        } else {
            characterImage.src = 'https://via.placeholder.com/400x600?text=CHAR';
        }
    } else if (contact.avatarUrl) {
        characterImage.src = contact.avatarUrl;
    } else {
        characterImage.src = 'https://via.placeholder.com/400x600?text=CHAR';
    }
    
    // 应用整体 UI CSS
    const videoCallPage = document.getElementById('page-video-call');
    if (contact.videoCallSettings.uiCSS) {
        videoCallPage.style.cssText = contact.videoCallSettings.uiCSS;
    }
    
    // 应用自定义图标
    if (contact.videoCallSettings.icons) {
        const backBtn = document.querySelector('.video-call-back-btn');
        const settingsBtn = document.querySelector('.video-call-settings-btn');
        const hangupBtn = document.querySelector('.video-call-hangup-btn');
        
        if (contact.videoCallSettings.icons.back && backBtn) {
            const icon = contact.videoCallSettings.icons.back;
            if (icon.type === 'text') {
                backBtn.textContent = icon.value;
            } else {
                backBtn.innerHTML = `<img src="${icon.value}" style="width: 24px; height: 24px; object-fit: contain;">`;
            }
        }
        
        if (contact.videoCallSettings.icons.settings && settingsBtn) {
            const icon = contact.videoCallSettings.icons.settings;
            if (icon.type === 'text') {
                settingsBtn.textContent = icon.value;
            } else {
                settingsBtn.innerHTML = `<img src="${icon.value}" style="width: 24px; height: 24px; object-fit: contain;">`;
            }
        }
        
        if (contact.videoCallSettings.icons.hangup && hangupBtn) {
            const icon = contact.videoCallSettings.icons.hangup;
            if (icon.type === 'text') {
                hangupBtn.textContent = icon.value;
            } else {
                hangupBtn.innerHTML = `<img src="${icon.value}" style="width: 24px; height: 24px; object-fit: contain;">`;
            }
        }
    }
    
    // 清空消息区域
    document.getElementById('videoCallMessages').innerHTML = '';
    
    // 打开视频通话页面
    openPage('page-video-call');
    
    // 开始计时
    startDurationTimer();
    
    // 添加欢迎消息
    addVideoCallMessage({
        sender: 'contact',
        message: '视频通话已接通',
        timestamp: new Date().toISOString()
    });
}

// 开始计时
function startDurationTimer() {
    // 清除之前的计时器
    if (videoCallState.durationInterval) {
        clearInterval(videoCallState.durationInterval);
    }
    
    // 更新时长显示
    videoCallState.durationInterval = setInterval(() => {
        const duration = Math.floor((Date.now() - videoCallState.startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        document.getElementById('videoCallDuration').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// 确认结束视频通话
function confirmEndVideoCall() {
    if (confirm('确定要结束视频通话吗？')) {
        endVideoCall();
    }
}

// 结束视频通话
function endVideoCall() {
    if (!videoCallState.active) return;
    
    // 停止计时
    if (videoCallState.durationInterval) {
        clearInterval(videoCallState.durationInterval);
        videoCallState.durationInterval = null;
    }
    
    // 计算通话时长
    const duration = Math.floor((Date.now() - videoCallState.startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const durationText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // 保存通话记录到聊天历史
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (contact) {
        // 检查是否启用双语模式
        const isBilingual = contact?.bilingualSettings?.enabled;
        
        // 构建完整的通话内容（AI视角）
        const fullContent = videoCallState.messages.map(msg => {
            const role = msg.sender === 'user' ? 'User' : (contact.nickname || contact.name);
            let messageText = msg.message;
            
            // 双语模式：只保存母语部分（去除<translate>标签）
            if (isBilingual && messageText.includes('<translate>')) {
                // 提取母语部分（<translate>之前的内容）
                const parts = messageText.split('<translate>');
                messageText = parts[0].trim();
            }
            
            return `[${role}]: ${messageText}`;
        }).join('\n');
        
        // 用户视角：只显示"通话结束 时间"
        const displayText = `通话结束 ${durationText}`;
        
        const callRecord = {
            id: Date.now(),
            role: 'system_call',
            sender: 'system',
            message: fullContent,  // AI视角：完整通话内容（双语模式下只有母语）
            display_text: displayText,  // 用户视角：简短显示
            timestamp: new Date().toISOString(),
            duration: duration,
            type: 'video_call',  // 标记为视频通话记录
            messages: videoCallState.messages  // 保留原始消息用于详情查看
        };
        
        if (!contact.chat_history) {
            contact.chat_history = [];
        }
        contact.chat_history.push(callRecord);
        saveContacts();
        
        console.log('✅ [视频通话] 通话记录已保存:', {
            显示文本: displayText,
            完整内容长度: fullContent.length,
            消息数量: videoCallState.messages.length,
            双语模式: isBilingual
        });
    }
    
    // 重置状态
    videoCallState.active = false;
    
    // 返回聊天页面
    const videoCallPage = document.getElementById('page-video-call');
    if (videoCallPage) {
        videoCallPage.classList.remove('active');
        videoCallPage.style.display = 'none';
    }
    
    const chatPage = document.getElementById('page-chat');
    if (chatPage) {
        chatPage.classList.add('active');
        chatPage.style.display = 'block';
    }
    
    // 重新渲染聊天消息
    renderChatMessages();
}

// 添加视频通话消息
function addVideoCallMessage(msg) {
    videoCallState.messages.push(msg);
    
    const container = document.getElementById('videoCallMessages');
    const messageEl = createVideoCallMessageElement(msg);
    container.appendChild(messageEl);
    
    // 滚动到底部
    container.scrollTop = container.scrollHeight;
}

// 创建视频通话消息元素
function createVideoCallMessageElement(msg) {
    const div = document.createElement('div');
    div.className = `video-call-message ${msg.sender === 'user' ? 'sent' : 'received'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'video-call-message-bubble';
    
    // 检查是否启用双语模式（仅对 AI 回复）
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    const isBilingual = contact?.bilingualSettings?.enabled && msg.sender === 'contact';
    
    if (isBilingual && msg.message.includes('<translate>')) {
        // 双语模式：完整显示原文，点击显示翻译
        // 原文包含：（动作）"语言" 等所有内容
        const fullText = msg.message;
        
        // 提取母语部分（<translate>之前的所有内容，包括括号）
        const parts = fullText.split('<translate>');
        const nativeText = parts[0].trim();
        
        // 提取翻译部分（<translate>标签内的内容）
        const translateMatch = parts[1]?.match(/^(.*?)<\/translate>/s);
        const translation = translateMatch ? translateMatch[1].trim() : '';
        
        // 创建母语文本容器（显示完整内容，包括括号）
        const originalText = document.createElement('div');
        originalText.className = 'video-call-bilingual-original';
        originalText.textContent = nativeText;
        
        // 创建翻译文本容器（默认隐藏）
        const translationText = document.createElement('div');
        translationText.className = 'video-call-bilingual-translation';
        translationText.textContent = translation;
        translationText.style.display = 'none';
        
        bubble.appendChild(originalText);
        bubble.appendChild(translationText);
        
        // 添加双语标识
        bubble.classList.add('bilingual-message');
        
        // 添加点击切换功能
        bubble.style.cursor = 'pointer';
        bubble.title = '点击查看中文翻译';
        bubble.onclick = function(e) {
            // 阻止事件冒泡到播放按钮
            if (e.target.classList.contains('video-call-play-btn')) {
                return;
            }
            
            if (translationText.style.display === 'none') {
                translationText.style.display = 'block';
                bubble.title = '点击隐藏翻译';
            } else {
                translationText.style.display = 'none';
                bubble.title = '点击查看中文翻译';
            }
        };
        
        console.log('🌐 [视频通话] 双语消息:', { 
            原文: nativeText.substring(0, 50) + '...', 
            翻译: translation.substring(0, 50) + '...' 
        });
    } else {
        // 普通模式 - 直接显示完整内容
        bubble.textContent = msg.message;
    }
    
    // 应用自定义 CSS（如果有）
    if (contact && contact.videoCallSettings && contact.videoCallSettings.bubbleCSS) {
        bubble.style.cssText += contact.videoCallSettings.bubbleCSS;
    }
    
    // 为 AI 消息添加播放按钮
    if (msg.sender === 'contact') {
        const playBtn = document.createElement('div');
        playBtn.className = 'video-call-play-btn';
        playBtn.onclick = (e) => {
            e.stopPropagation();
            playVideoCallAudio(msg);
        };
        
        // 长按重新生成
        let longPressTimer;
        playBtn.onmousedown = playBtn.ontouchstart = (e) => {
            e.stopPropagation();
            longPressTimer = setTimeout(() => {
                regenerateVideoCallAudio(msg);
            }, 800);
        };
        playBtn.onmouseup = playBtn.onmouseleave = playBtn.ontouchend = (e) => {
            clearTimeout(longPressTimer);
        };
        
        bubble.appendChild(playBtn);
    }
    
    // 双击收藏
    bubble.ondblclick = (e) => {
        e.stopPropagation();
        const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
        if (contact) {
            addToFavorites(msg, contact);
        }
    };
    
    div.appendChild(bubble);
    
    return div;
}

// 播放视频通话音频
async function playVideoCallAudio(msg) {
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact) return;
    
    // 检查是否已有缓存的音频
    if (msg.ttsAudioUrl) {
        playAudioFromUrl(msg.ttsAudioUrl);
        return;
    }
    
    // 生成 TTS 音频
    const minimaxConfig = getStorageJSON('minimax_config', {});
    
    if (!minimaxConfig.enabled || !minimaxConfig.apiKey) {
        alert('MiniMax 未配置');
        return;
    }
    
    if (!contact.ttsSettings || !contact.ttsSettings.voiceId) {
        alert('未设置语音 ID');
        return;
    }
    
    try {
        // 获取要朗读的文本
        let textToSpeak = msg.message;
        
        // 如果启用了双语模式，只提取母语部分（<translate>之前）
        const isBilingual = contact?.bilingualSettings?.enabled;
        if (isBilingual && msg.message.includes('<translate>')) {
            const parts = msg.message.split('<translate>');
            textToSpeak = parts[0].trim();
            console.log('🌐 [视频通话TTS] 双语模式，提取母语部分');
        }
        
        // 提取双引号内的文本（语言描写）
        const quotedText = extractQuotedText(textToSpeak);
        if (quotedText && quotedText.trim()) {
            textToSpeak = quotedText;
            console.log('📝 [视频通话TTS] 提取引号内文本:', textToSpeak.substring(0, 50) + '...');
        } else {
            console.log('⚠️ [视频通话TTS] 未找到引号内文本，使用完整文本');
        }
        
        // 如果没有文本可朗读，提示用户
        if (!textToSpeak.trim()) {
            alert('没有可朗读的文本');
            return;
        }
        
        const audioUrl = await generateTtsAudio(
            textToSpeak,
            '',
            contact.ttsSettings.voiceId,
            contact.ttsSettings.language,
            contact.ttsSettings.speed,
            minimaxConfig
        );
        
        msg.ttsAudioUrl = audioUrl;
        playAudioFromUrl(audioUrl);
    } catch (error) {
        console.error('TTS 生成失败:', error);
        alert('语音合成失败: ' + error.message);
    }
}

// 播放音频
function playAudioFromUrl(url) {
    // 停止当前播放的音频
    if (currentPlayingAudio && !currentPlayingAudio.paused) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
    }
    
    const audio = new Audio(url);
    currentPlayingAudio = audio;
    
    audio.onended = () => {
        if (currentPlayingAudio === audio) {
            currentPlayingAudio = null;
        }
    };
    
    audio.play();
}

// 重新生成视频通话音频
async function regenerateVideoCallAudio(msg) {
    if (!confirm('确定要重新生成语音吗？')) {
        return;
    }
    
    // 清除缓存
    delete msg.ttsAudioUrl;
    
    // 重新生成
    await playVideoCallAudio(msg);
}

// 发送视频通话消息
async function sendVideoCallMessage() {
    const input = document.getElementById('videoCallInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addVideoCallMessage({
        sender: 'user',
        message: message,
        timestamp: new Date().toISOString()
    });
    
    input.value = '';
    
    // 调用 AI
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (contact) {
        await sendToAIForVideoCall(contact, message);
    }
}

// 处理视频通话输入框回车
function handleVideoCallKeyPress(event) {
    if (event.key === 'Enter') {
        sendVideoCallMessage();
    }
}

// 发送消息给 AI（视频通话模式）
async function sendToAIForVideoCall(contact, userMessage) {
    try {
        // 显示"正在输入中"指示器
        showVideoCallTypingIndicator();
        
        // 构建系统提示（视频通话专用，包含时区和记忆库）
        const systemPrompt = buildVideoCallPrompt(contact);
        
        console.log('📝 [视频通话] 完整系统提示词:', systemPrompt);
        
        // 添加结构化记忆内容
        let memoryContext = '';
        const smVideoText = formatStructuredMemory(contact);
        if (smVideoText) {
            memoryContext = '\n\n' + smVideoText;
        }
        
        // 获取上下文窗口大小（从Token分析设置中读取）
        const contextWindowSize =
            (contact.summarySettings && contact.summarySettings.contextWindowSize) ||
            10;
        
        // 构建消息历史
        const messages = [
            { role: 'system', content: systemPrompt + memoryContext }
        ];
        
        // 添加普通聊天的最近上下文（根据设置的条数）
        const chatContextSize = (contact.videoCallSettings && contact.videoCallSettings.chatContextSize !== undefined) 
            ? contact.videoCallSettings.chatContextSize 
            : 5;
        
        if (chatContextSize > 0 && contact.chat_history && contact.chat_history.length > 0) {
            const recentChatHistory = contact.chat_history.slice(-chatContextSize);
            recentChatHistory.forEach(msg => {
                let content = msg.message;
                // 如果是特殊类型消息，添加类型标记
                if (msg.type === 'voice') {
                    content = `[VOICE:${msg.tone}]${msg.message}`;
                } else if (msg.type === 'image') {
                    content = `[IMAGE]${msg.description || msg.message}`;
                } else if (msg.type === 'video') {
                    content = `[VIDEO]${msg.description || msg.message}`;
                } else if (msg.type === 'sticker') {
                    content = `[STICKER:${msg.stickerName}]`;
                }
                
                messages.push({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: content
                });
            });
        }
        
        // 添加视频通话历史（限制上下文窗口）
        const recentMessages = videoCallState.messages.slice(-contextWindowSize);
        recentMessages.forEach(msg => {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.message
            });
        });
        
        // 添加当前消息
        messages.push({
            role: 'user',
            content: userMessage
        });
        
        // 获取 API 配置（与普通聊天相同的逻辑）
        let apiUrl, apiKey, model, temperature = null;
        
        console.log('🔍 [视频通话] 当前联系人:', contact.name, 'API方案ID:', contact.apiScheme);
        
        // 优先使用联系人的 API 方案
        if (contact.apiScheme) {
            const schemes = getStorageJSON('vibe_api_schemes', []);
            console.log('📋 [视频通话] 所有API方案:', schemes);
            
            const scheme = schemes.find(s => s.id === contact.apiScheme);
            if (scheme) {
                apiUrl = scheme.apiUrl;
                apiKey = scheme.apiKey;
                model = scheme.model;
                if (typeof scheme.temperature === 'number') {
                    temperature = scheme.temperature;
                }
                console.log('✅ [视频通话] 使用联系人API方案:', scheme.name, '模型:', model);
            } else {
                console.warn('⚠️ [视频通话] 联系人API方案不存在(ID:' + contact.apiScheme + ')');
            }
        }
        
        // 如果没有方案，使用全局配置
        if (!apiUrl) {
            apiUrl = localStorage.getItem('apiUrl');
            apiKey = localStorage.getItem('apiKey');
            model = contact.model || localStorage.getItem('selectedModel');
            console.log('🌐 [视频通话] 使用全局API配置');
        }

        // 读取全局温度（如果方案中未设置）
        if (temperature === null) {
            const storedTemp = localStorage.getItem('apiTemperature');
            const tempNum = storedTemp ? parseFloat(storedTemp) : NaN;
            if (!isNaN(tempNum)) {
                temperature = tempNum;
            }
        }
        
        // 检查 API 配置
        if (!apiUrl || !apiKey) {
            hideVideoCallTypingIndicator();
            console.warn('⚠️ [视频通话] 无API配置');
            alert('请先在设置中配置 API\n\n路径：设置 → API 配置');
            return;
        }
        
        console.log('📤 [视频通话] 发送API请求:', apiUrl, '模型:', model, '温度:', temperature ?? 0.8);
        
        // 调用 API
        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'gpt-3.5-turbo',
                messages: messages,
                temperature: (typeof temperature === 'number') ? temperature : 0.8
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [视频通话] API请求失败:', response.status, errorText);
            throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📥 [视频通话] API返回数据:', data);
        
        // 尝试从不同的API格式中提取回复
        let aiReply = null;
        
        // OpenAI格式
        if (data.choices && data.choices[0] && data.choices[0].message) {
            aiReply = data.choices[0].message.content;
            console.log('✅ [视频通话] 使用OpenAI格式');
        }
        // Gemini格式
        else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            if (parts && parts[0] && parts[0].text) {
                aiReply = parts[0].text;
                console.log('✅ [视频通话] 使用Gemini格式');
            }
        }
        // Claude格式
        else if (data.content && data.content[0] && data.content[0].text) {
            aiReply = data.content[0].text;
            console.log('✅ [视频通话] 使用Claude格式');
        }
        // 简单文本格式
        else if (data.text) {
            aiReply = data.text;
            console.log('✅ [视频通话] 使用简单文本格式 (text)');
        }
        else if (data.response) {
            aiReply = data.response;
            console.log('✅ [视频通话] 使用简单文本格式 (response)');
        }
        
        // 如果所有格式都不匹配
        if (!aiReply) {
            console.error('❌ [视频通话] 无法识别的API返回格式:', JSON.stringify(data, null, 2));
            throw new Error('API 返回数据格式不支持\n\n请检查：\n1. API端点是否正确\n2. 模型名称是否正确\n3. 查看控制台了解详细的返回数据');
        }
        
        // 隐藏"正在输入中"指示器
        hideVideoCallTypingIndicator();
        
        // 添加 AI 回复
        addVideoCallMessage({
            sender: 'contact',
            message: aiReply,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ [视频通话] AI 调用失败:', error);
        hideVideoCallTypingIndicator();
        alert('AI 调用失败: ' + error.message);
    }
}

// 显示视频通话"正在输入中"指示器
function showVideoCallTypingIndicator() {
    const indicator = document.getElementById('videoCallTypingIndicator');
    if (indicator) {
        indicator.classList.add('active');
        // 滚动到底部
        const container = document.getElementById('videoCallMessages');
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// 隐藏视频通话"正在输入中"指示器
function hideVideoCallTypingIndicator() {
    const indicator = document.getElementById('videoCallTypingIndicator');
    if (indicator) {
        indicator.classList.remove('active');
    }
}

// 重新生成最新的视频通话消息
async function regenerateLastVideoCallMessage() {
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact) return;
    
    // 找到最后一条用户消息
    let lastUserMessageIndex = -1;
    for (let i = videoCallState.messages.length - 1; i >= 0; i--) {
        if (videoCallState.messages[i].sender === 'user') {
            lastUserMessageIndex = i;
            break;
        }
    }
    
    if (lastUserMessageIndex === -1) {
        alert('没有找到用户消息');
        return;
    }
    
    const lastUserMessage = videoCallState.messages[lastUserMessageIndex].message;
    
    // 删除该用户消息之后的所有 AI 回复
    const messagesToRemove = videoCallState.messages.length - lastUserMessageIndex - 1;
    if (messagesToRemove > 0) {
        videoCallState.messages.splice(lastUserMessageIndex + 1, messagesToRemove);
        
        // 重新渲染消息列表
        const container = document.getElementById('videoCallMessages');
        container.innerHTML = '';
        videoCallState.messages.forEach(msg => {
            const messageEl = createVideoCallMessageElement(msg);
            container.appendChild(messageEl);
        });
    }
    
    // 重新调用 AI
    await sendToAIForVideoCall(contact, lastUserMessage);
}

// 构建视频通话提示词
function buildVideoCallPrompt(contact) {
    // 构建时区感知的系统提示（与普通聊天相同）
    const basePrompt = buildTimezoneAwarePrompt(contact, '');
    
    // 使用统一提示词管理系统
    const videoCallPrompt = getCurrentPrompt('videoCall');
    console.log('📝 [视频通话] 使用提示词方案:', promptSchemes[currentPromptSchemeId].name);
    
    return basePrompt + '\n\n' + videoCallPrompt;
}

// 打开视频通话设置
function openVideoCallSettings() {
    const modal = document.getElementById('videoCallSettingsModal');
    modal.classList.add('active');
    
    // 加载当前联系人的设置
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (contact) {
        loadVideoCallSettingsForContact(contact);
    }
}

// 关闭视频通话设置
function closeVideoCallSettings() {
    const modal = document.getElementById('videoCallSettingsModal');
    modal.classList.remove('active');
}

// 加载联系人的视频通话设置
function loadVideoCallSettingsForContact(contact) {
    // 初始化设置对象
    if (!contact.videoCallSettings) {
        contact.videoCallSettings = {
            characterImages: [],
            currentImageId: null,
            enableTTS: true,
            // 不再使用 videoCallPrompt 字段，使用统一管理系统
            // videoCallPrompt: getDefaultVideoCallPrompt(),
            bubbleCSS: '',
            cssSchemes: [],
            uiCSS: '',
            uiCSSSchemes: [],
            icons: {},
            chatContextSize: 5 // 默认读取5条
        };
    }
    
    const settings = contact.videoCallSettings;
    
    // 加载形象图库
    renderCharacterImageGallery(settings.characterImages, settings.currentImageId);
    
    // 加载气泡 CSS
    const defaultBubbleCSS = `/* 视频通话消息气泡样式 */

/* 基础样式 */
background: rgba(255, 255, 255, 0.95);  /* 背景颜色（白色半透明） */
color: #333333;                          /* 文字颜色（深灰色） */
padding: 12px 16px;                      /* 内边距（上下12px，左右16px） */
border-radius: 18px;                     /* 圆角大小 */
max-width: 70%;                          /* 最大宽度（屏幕的70%） */
word-wrap: break-word;                   /* 文字换行 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */

/* 可以修改的属性示例：
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 渐变背景 */
border: 2px solid #000000;              /* 边框（2px 实线 黑色） */
font-size: 16px;                        /* 字体大小 */
font-weight: bold;                      /* 字体粗细 */
text-align: center;                     /* 文字对齐方式 */
*/`;
    
    document.getElementById('videoBubbleCSS').value = settings.bubbleCSS || defaultBubbleCSS;
    
    // 加载气泡 CSS 方案
    renderCSSSchemes(settings.cssSchemes);
    
    // 加载整体 UI CSS
    const defaultUICSS = `/* 视频通话页面整体样式 */

/* 基础布局 */
display: flex;                           /* 弹性布局 */
flex-direction: column;                  /* 垂直排列 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 渐变背景 */

/* 可以修改的属性示例：

1. 纯色背景：
background: #FFB6C1;                     /* 粉色背景 */

2. 渐变背景：
background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); /* 红黄渐变 */

3. 图片背景：
background-image: url('图片URL');        /* 背景图片 */
background-size: cover;                  /* 图片填充方式 */
background-position: center;             /* 图片位置 */

4. 圆角和阴影：
border-radius: 20px;                     /* 圆角 */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); /* 阴影 */

5. 其他样式：
padding: 20px;                           /* 内边距 */
margin: 10px;                            /* 外边距 */
*/`;
    document.getElementById('videoCallUICSS').value = settings.uiCSS || defaultUICSS;
    
    // 加载 UI CSS 方案
    renderUICSSSchemes(settings.uiCSSSchemes);
    
    // 加载图标设置
    if (settings.icons) {
        if (settings.icons.back) {
            const icon = settings.icons.back;
            if (icon.type === 'text') {
                document.getElementById('currentBackIcon').textContent = icon.value;
            } else {
                document.getElementById('currentBackIcon').innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
        if (settings.icons.settings) {
            const icon = settings.icons.settings;
            if (icon.type === 'text') {
                document.getElementById('currentSettingsIcon').textContent = icon.value;
            } else {
                document.getElementById('currentSettingsIcon').innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
        if (settings.icons.hangup) {
            const icon = settings.icons.hangup;
            if (icon.type === 'text') {
                document.getElementById('currentHangupIcon').textContent = icon.value;
            } else {
                document.getElementById('currentHangupIcon').innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
    }
    
    // 加载 TTS 开关
    document.getElementById('enableVideoCallTTS').checked = settings.enableTTS !== false;
    
    // 不再加载提示词到 DOM，使用统一管理系统
    // 提示词现在通过 getCurrentPrompt('videoCall') 获取
    
    // 加载聊天上下文条数
    document.getElementById('chatContextSize').value = settings.chatContextSize || 5;
}

// 获取默认视频通话提示词
function getDefaultVideoCallPrompt() {
    return `你正在与用户进行视频通话，描写规范：
请使用以下三维描写法：
（动作描写）：描述你在视频画面中的表情、手势或背景动作。
"语言描写"：你真正说出口的话。
*心理描写*：你内心的真实想法

重要规则：
1. 每次回复都必须包含"语言描写"（双引号内的内容），这是你说出口的话
2. 动作描写和心理描写是可选的，但语言描写是必须的
3. 如果只有动作没有语言，用户会感到困惑

示例格式：
（微笑着挥手）"你好！很高兴见到你！"*今天心情真好*

输入过滤：
在发送给 AI 的 API 请求中，如果用户输入的文字包含 *心理描写*，
请保留它，因为 AI 需要根据用户的心理来调整回复。`;
}

// 渲染形象图库
function renderCharacterImageGallery(images, currentImageId) {
    const gallery = document.getElementById('characterImageGallery');
    if (!gallery) return; // 防止元素不存在
    
    gallery.innerHTML = '';
    
    if (!images || images.length === 0) {
        gallery.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">暂无图片</p>';
        return;
    }
    
    images.forEach(img => {
        // 跳过空URL
        if (!img.url || img.url.trim() === '') return;
        
        const item = document.createElement('div');
        item.className = 'character-image-item';
        if (img.id === currentImageId) {
            item.classList.add('active');
        }
        
        item.onclick = () => selectCharacterImage(img.id);
        
        const imgEl = document.createElement('img');
        imgEl.src = img.url;
        imgEl.alt = img.name || 'CHAR';
        // 添加错误处理
        imgEl.onerror = function() {
            this.style.display = 'none';
            item.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">加载失败</div>';
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn'; // 修正class名称
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteCharacterImage(img.id);
        };
        
        item.appendChild(imgEl);
        item.appendChild(deleteBtn);
        gallery.appendChild(item);
    });
}

// 添加形象图片
function addCharacterImage() {
    const url = document.getElementById('characterImageUrl').value.trim();
    if (!url) {
        alert('请输入图片 URL');
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact) return;
    
    if (!contact.videoCallSettings) {
        contact.videoCallSettings = {
            characterImages: [],
            currentImageId: null,
            enableTTS: true,
            // 不再使用 videoCallPrompt 字段，使用统一管理系统
            // videoCallPrompt: getDefaultVideoCallPrompt(),
            bubbleCSS: '',
            cssSchemes: []
        };
    }
    
    const newImage = {
        id: Date.now(),
        url: url,
        name: `图片 ${contact.videoCallSettings.characterImages.length + 1}`
    };
    
    contact.videoCallSettings.characterImages.push(newImage);
    
    // 如果是第一张图片，自动设为当前图片
    if (contact.videoCallSettings.characterImages.length === 1) {
        contact.videoCallSettings.currentImageId = newImage.id;
    }
    
    saveContacts();
    renderCharacterImageGallery(contact.videoCallSettings.characterImages, contact.videoCallSettings.currentImageId);
    
    document.getElementById('characterImageUrl').value = '';
}

// 上传形象图片
function uploadCharacterImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
        if (!contact) return;
        
        if (!contact.videoCallSettings) {
            contact.videoCallSettings = {
                characterImages: [],
                currentImageId: null,
                enableTTS: true,
                // 不再使用 videoCallPrompt 字段，使用统一管理系统
                // videoCallPrompt: getDefaultVideoCallPrompt(),
                bubbleCSS: '',
                cssSchemes: []
            };
        }
        
        const newImage = {
            id: Date.now(),
            url: e.target.result,
            name: file.name
        };
        
        contact.videoCallSettings.characterImages.push(newImage);
        
        // 如果是第一张图片，自动设为当前图片
        if (contact.videoCallSettings.characterImages.length === 1) {
            contact.videoCallSettings.currentImageId = newImage.id;
        }
        
        saveContacts();
        renderCharacterImageGallery(contact.videoCallSettings.characterImages, contact.videoCallSettings.currentImageId);
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 选择形象图片
function selectCharacterImage(imageId) {
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    contact.videoCallSettings.currentImageId = imageId;
    saveContacts();
    
    // 更新显示
    renderCharacterImageGallery(contact.videoCallSettings.characterImages, imageId);
    
    // 如果在视频通话中，立即更新显示的图片
    if (videoCallState.active) {
        const selectedImage = contact.videoCallSettings.characterImages.find(img => img.id === imageId);
        if (selectedImage) {
            document.getElementById('videoCallCharacterImage').src = selectedImage.url;
        }
    }
}

// 删除形象图片
function deleteCharacterImage(imageId) {
    if (!confirm('确定要删除这张图片吗？')) return;
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    contact.videoCallSettings.characterImages = contact.videoCallSettings.characterImages.filter(img => img.id !== imageId);
    
    // 如果删除的是当前图片，重置为第一张
    if (contact.videoCallSettings.currentImageId === imageId) {
        contact.videoCallSettings.currentImageId = contact.videoCallSettings.characterImages.length > 0 
            ? contact.videoCallSettings.characterImages[0].id 
            : null;
    }
    
    saveContacts();
    renderCharacterImageGallery(contact.videoCallSettings.characterImages, contact.videoCallSettings.currentImageId);
}

// 保存 CSS 方案
function saveCSSScheme() {
    const name = document.getElementById('cssSchemeNameInput').value.trim();
    if (!name) {
        alert('请输入方案名称');
        return;
    }
    
    const css = document.getElementById('videoBubbleCSS').value.trim();
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    if (!contact.videoCallSettings.cssSchemes) {
        contact.videoCallSettings.cssSchemes = [];
    }
    
    // 检查是否已存在同名方案
    const existingIndex = contact.videoCallSettings.cssSchemes.findIndex(s => s.name === name);
    if (existingIndex >= 0) {
        if (!confirm('已存在同名方案，是否覆盖？')) return;
        contact.videoCallSettings.cssSchemes[existingIndex].css = css;
    } else {
        contact.videoCallSettings.cssSchemes.push({ name, css });
    }
    
    saveContacts();
    renderCSSSchemes(contact.videoCallSettings.cssSchemes);
    
    document.getElementById('cssSchemeNameInput').value = '';
    alert('方案已保存');
}

// 渲染 CSS 方案列表
function renderCSSSchemes(schemes) {
    const select = document.getElementById('cssSchemesSelect');
    select.innerHTML = '<option value="">选择方案...</option>';
    
    if (!schemes || schemes.length === 0) return;
    
    schemes.forEach((scheme, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = scheme.name;
        select.appendChild(option);
    });
}

// 加载 CSS 方案
function loadCSSScheme() {
    const select = document.getElementById('cssSchemesSelect');
    const index = parseInt(select.value);
    
    if (isNaN(index)) return;
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings || !contact.videoCallSettings.cssSchemes) return;
    
    const scheme = contact.videoCallSettings.cssSchemes[index];
    if (scheme) {
        document.getElementById('videoBubbleCSS').value = scheme.css;
    }
}

// 应用 CSS 到视频气泡
function applyCSSToVideoBubbles() {
    const css = document.getElementById('videoBubbleCSS').value.trim();
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    contact.videoCallSettings.bubbleCSS = css;
    saveContacts();
    
    // 应用到当前视频通话的气泡
    if (videoCallState.active) {
        const bubbles = document.querySelectorAll('.video-call-message-bubble');
        bubbles.forEach(bubble => {
            bubble.style.cssText = css;
        });
    }
    
    alert('样式已应用');
}

// 切换视频通话 TTS
function toggleVideoCallTTS() {
    const enabled = document.getElementById('enableVideoCallTTS').checked;
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    contact.videoCallSettings.enableTTS = enabled;
    saveContacts();
}

// 重置视频通话提示词（已废弃，使用统一提示词管理系统）
function resetVideoCallPrompt() {
    alert('提示词管理已迁移到统一管理系统。\n请前往"我"页面 → "AI提示词管理"进行设置。');
}

// 保存视频通话设置
function saveVideoCallSettings() {
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    // 保存气泡 CSS
    contact.videoCallSettings.bubbleCSS = document.getElementById('videoBubbleCSS').value.trim();
    
    // 保存整体 UI CSS
    contact.videoCallSettings.uiCSS = document.getElementById('videoCallUICSS').value.trim();
    
    // 保存 TTS 开关
    contact.videoCallSettings.enableTTS = document.getElementById('enableVideoCallTTS').checked;
    
    // 不再保存提示词，使用统一管理系统
    // contact.videoCallSettings.videoCallPrompt = document.getElementById('videoCallPromptInput').value.trim();
    
    // 保存聊天上下文条数
    const chatContextSize = parseInt(document.getElementById('chatContextSize').value) || 5;
    contact.videoCallSettings.chatContextSize = Math.max(0, Math.min(20, chatContextSize)); // 限制在0-20之间
    
    saveContacts();
    closeVideoCallSettings();
    
    alert('设置已保存');
}

// 保存 UI CSS 方案
function saveUICSSScheme() {
    const name = document.getElementById('uiCSSSchemeNameInput').value.trim();
    if (!name) {
        alert('请输入方案名称');
        return;
    }
    
    const css = document.getElementById('videoCallUICSS').value.trim();
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    if (!contact.videoCallSettings.uiCSSSchemes) {
        contact.videoCallSettings.uiCSSSchemes = [];
    }
    
    // 检查是否已存在同名方案
    const existingIndex = contact.videoCallSettings.uiCSSSchemes.findIndex(s => s.name === name);
    if (existingIndex >= 0) {
        if (!confirm('已存在同名方案，是否覆盖？')) return;
        contact.videoCallSettings.uiCSSSchemes[existingIndex].css = css;
    } else {
        contact.videoCallSettings.uiCSSSchemes.push({ name, css });
    }
    
    saveContacts();
    renderUICSSSchemes(contact.videoCallSettings.uiCSSSchemes);
    
    document.getElementById('uiCSSSchemeNameInput').value = '';
    alert('方案已保存');
}

// 渲染 UI CSS 方案列表
function renderUICSSSchemes(schemes) {
    const select = document.getElementById('uiCSSSchemesSelect');
    select.innerHTML = '<option value="">选择方案...</option>';
    
    if (!schemes || schemes.length === 0) return;
    
    schemes.forEach((scheme, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = scheme.name;
        select.appendChild(option);
    });
}

// 加载 UI CSS 方案
function loadUICSSScheme() {
    const select = document.getElementById('uiCSSSchemesSelect');
    const index = parseInt(select.value);
    
    if (isNaN(index)) return;
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings || !contact.videoCallSettings.uiCSSSchemes) return;
    
    const scheme = contact.videoCallSettings.uiCSSSchemes[index];
    if (scheme) {
        document.getElementById('videoCallUICSS').value = scheme.css;
    }
}

// 应用视频通话 UI CSS
function applyVideoCallUICSS() {
    const css = document.getElementById('videoCallUICSS').value.trim();
    
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    contact.videoCallSettings.uiCSS = css;
    saveContacts();
    
    // 应用到当前视频通话页面
    if (videoCallState.active) {
        const videoCallPage = document.getElementById('page-video-call');
        if (videoCallPage) {
            videoCallPage.style.cssText = css;
        }
    }
    
    alert('UI 样式已应用');
}

// 更新视频通话图标
function updateVideoCallIcon(iconType) {
    const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
    if (!contact || !contact.videoCallSettings) return;
    
    if (!contact.videoCallSettings.icons) {
        contact.videoCallSettings.icons = {};
    }
    
    let inputId, currentId, btnClass;
    
    switch(iconType) {
        case 'back':
            inputId = 'backIconInput';
            currentId = 'currentBackIcon';
            btnClass = '.video-call-back-btn';
            break;
        case 'settings':
            inputId = 'settingsIconInput';
            currentId = 'currentSettingsIcon';
            btnClass = '.video-call-settings-btn';
            break;
        case 'hangup':
            inputId = 'hangupIconInput';
            currentId = 'currentHangupIcon';
            btnClass = '.video-call-hangup-btn';
            break;
    }
    
    const iconText = document.getElementById(inputId).value.trim();
    if (!iconText) {
        alert('请输入图标文本或 Emoji');
        return;
    }
    
    // 保存图标
    contact.videoCallSettings.icons[iconType] = { type: 'text', value: iconText };
    saveContacts();
    
    // 更新显示
    document.getElementById(currentId).textContent = iconText;
    
    // 如果在视频通话中，立即更新按钮
    if (videoCallState.active) {
        const btn = document.querySelector(btnClass);
        if (btn) {
            btn.textContent = iconText;
        }
    }
    
    document.getElementById(inputId).value = '';
    alert('图标已更新');
}

// 上传视频通话图标
function uploadVideoCallIcon(event, iconType) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const contact = vibeContacts.find(c => c.id === videoCallState.contactId);
        if (!contact || !contact.videoCallSettings) return;
        
        if (!contact.videoCallSettings.icons) {
            contact.videoCallSettings.icons = {};
        }
        
        const imageUrl = e.target.result;
        
        // 保存图标
        contact.videoCallSettings.icons[iconType] = { type: 'image', value: imageUrl };
        saveContacts();
        
        // 更新显示
        let currentId, btnClass;
        
        switch(iconType) {
            case 'back':
                currentId = 'currentBackIcon';
                btnClass = '.video-call-back-btn';
                break;
            case 'settings':
                currentId = 'currentSettingsIcon';
                btnClass = '.video-call-settings-btn';
                break;
            case 'hangup':
                currentId = 'currentHangupIcon';
                btnClass = '.video-call-hangup-btn';
                break;
        }
        
        document.getElementById(currentId).innerHTML = `<img src="${imageUrl}" style="width: 20px; height: 20px; object-fit: contain;">`;
        
        // 如果在视频通话中，立即更新按钮
        if (videoCallState.active) {
            const btn = document.querySelector(btnClass);
            if (btn) {
                btn.innerHTML = `<img src="${imageUrl}" style="width: 24px; height: 24px; object-fit: contain;">`;
            }
        }
        
        alert('图标已更新');
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 提取双引号内的文本（用于 TTS）
function extractQuotedText(text) {
    // 提取所有双引号内的文本
    const regex = /"([^"]*)"/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    
    return matches.join(' ');
}

// ==================== 联系人管理 ====================

// 打开联系人管理面板
function openContactManagement() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    console.log('打开联系人管理，当前联系人:', contact.name, '图标库:', contact.customIcons);
    
    const modal = document.getElementById('contactManagementModal');
    modal.classList.add('active');
    
    // 加载视频通话记录
    loadVideoHistory(contact);
}

// 关闭联系人管理面板
function closeContactManagement() {
    const modal = document.getElementById('contactManagementModal');
    modal.classList.remove('active');
}

// 加载视频通话记录
function loadVideoHistory(contact) {
    loadVideoCallHistory();
}

// 打开图标管理页面（第二页）
function openIconManagementPage() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    console.log('打开图标管理页面，联系人:', contact.name);
    
    // 隐藏第一页
    document.getElementById('contactManagementModal').classList.remove('active');
    
    // 显示第二页
    const iconModal = document.getElementById('iconManagementModal');
    iconModal.classList.add('active');
    
    // 加载该联系人的图标设置
    loadChatIconsToManagement(contact);
}

// 关闭图标管理页面
function closeIconManagementPage() {
    const iconModal = document.getElementById('iconManagementModal');
    iconModal.classList.remove('active');
    
    // 返回第一页
    document.getElementById('contactManagementModal').classList.add('active');
}

// 切换管理标签页（已废弃，改用分页）
function switchManagementTab(tabName) {
    // 兼容旧代码，重定向到新的分页系统
    if (tabName === 'icon-settings') {
        openIconManagementPage();
    }
}

// 加载视频通话历史
function loadVideoCallHistory() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const container = document.getElementById('videoHistoryList');
    container.innerHTML = '';
    
    // 从聊天记录中筛选出视频和语音通话记录
    const callRecords = contact.chat_history.filter(msg => 
        msg.type === 'video_call' || msg.type === 'voice_call'
    );
    
    if (callRecords.length === 0) {
        container.innerHTML = `
            <div class="video-history-empty">
                <div class="video-history-empty-icon">📞</div>
                <p>暂无通话记录</p>
            </div>
        `;
        return;
    }
    
    // 按时间倒序排列（最新的在前）
    const sortedRecords = [...callRecords].reverse();
    sortedRecords.forEach(record => {
        const item = createCallHistoryItem(record, contact);
        container.appendChild(item);
    });
}

// 创建视频通话历史项
function createVideoHistoryItem(record, contact) {
    const div = document.createElement('div');
    div.className = 'video-history-item pixel-item';
    
    const startTime = new Date(record.startTime);
    const dateStr = startTime.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const messageCount = record.messages ? record.messages.length : 0;
    
    div.innerHTML = `
        <div class="video-history-header">
            <div class="video-history-title">
                📞 视频通话
            </div>
            <div class="video-history-actions">
                <button class="video-history-btn view" onclick="viewVideoCallHistory(${record.id})">查看</button>
                <button class="video-history-btn delete" onclick="deleteVideoCallHistory(${record.id})">删除</button>
            </div>
        </div>
        <div class="video-history-info">
            <div>⏰ 时间: ${dateStr}</div>
            <div>⏱️ 时长: ${record.durationText || '00:00'}</div>
            <div>💬 消息数: ${messageCount} 条</div>
        </div>
    `;
    
    return div;
}

// 创建通话记录项（统一处理视频和语音通话）
function createCallHistoryItem(record, contact) {
    const div = document.createElement('div');
    div.className = 'video-history-item pixel-item';
    
    const isVoiceCall = record.type === 'voice_call';
    const icon = isVoiceCall ? '🎤' : '📹';
    const title = isVoiceCall ? '语音通话' : '视频通话';
    
    // 使用timestamp字段
    const timestamp = record.timestamp || record.startTime;
    let dateStr = 'Invalid Date';
    
    if (timestamp) {
        try {
            const startTime = new Date(timestamp);
            if (!isNaN(startTime.getTime())) {
                dateStr = startTime.toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch (e) {
            console.error('❌ [通话记录] 时间戳解析失败:', timestamp, e);
        }
    }
    
    // 从duration字段计算时长文本
    let durationText = '00:00';
    if (record.duration !== undefined) {
        const minutes = Math.floor(record.duration / 60);
        const seconds = record.duration % 60;
        durationText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    const messageCount = record.messages ? record.messages.length : 0;
    
    div.innerHTML = `
        <div class="video-history-header">
            <div class="video-history-title">
                ${icon} ${title}
            </div>
            <div class="video-history-actions">
                <button class="video-history-btn view" onclick="viewCallHistory(${record.id}, '${record.type}')">查看</button>
                <button class="video-history-btn delete" onclick="deleteCallHistory(${record.id}, '${record.type}')">删除</button>
            </div>
        </div>
        <div class="video-history-info">
            <div>⏰ 开始时间: ${dateStr}</div>
            <div>⏱️ 结束时间: ${durationText}</div>
            <div>💬 通话时长: ${messageCount} 条</div>
        </div>
    `;
    
    return div;
}

// 查看视频通话历史详情
function viewVideoCallHistory(recordId) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const record = contact.chat_history.find(msg => msg.id === recordId && msg.type === 'video_call');
    if (!record) return;
    
    // 先关闭联系人管理弹窗
    closeContactManagement();
    
    // 使用现有的详情弹窗
    showVideoCallRecordDetails(record, contact);
}

// 查看通话历史详情（统一处理视频和语音）
function viewCallHistory(recordId, callType) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const record = contact.chat_history.find(msg => msg.id === recordId && msg.type === callType);
    if (!record) return;
    
    // 先关闭联系人管理弹窗
    closeContactManagement();
    
    // 根据类型显示详情
    if (callType === 'video_call') {
        showVideoCallRecordDetails(record, contact);
    } else if (callType === 'voice_call') {
        showVoiceCallRecordDetails(record, contact);
    }
}

// 删除视频通话历史
function deleteVideoCallHistory(recordId) {
    if (!confirm('确定要删除这条通话记录吗？\n\n注意：收藏的消息不会被删除。')) {
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 从聊天记录中删除
    const index = contact.chat_history.findIndex(msg => msg.id === recordId && msg.type === 'video_call');
    if (index >= 0) {
        contact.chat_history.splice(index, 1);
        saveContacts();
        
        // 重新加载列表
        loadVideoCallHistory();
        
        // 重新渲染聊天消息
        renderChatMessages();
        
        alert('通话记录已删除');
    }
}

// 删除通话历史（统一处理视频和语音）
function deleteCallHistory(recordId, callType) {
    const typeText = callType === 'video_call' ? '视频' : '语音';
    if (!confirm(`确定要删除这条${typeText}通话记录吗？\n\n注意：收藏的消息不会被删除。`)) {
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 从聊天记录中删除
    const index = contact.chat_history.findIndex(msg => msg.id === recordId && msg.type === callType);
    if (index >= 0) {
        contact.chat_history.splice(index, 1);
        saveContacts();
        
        // 重新加载列表
        loadVideoCallHistory();
        
        // 重新渲染聊天消息
        renderChatMessages();
        
        alert('通话记录已删除');
    }
}

// 更新编辑图标
// 更新管理图标
function updateManagementIcon(iconType) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    if (!contact.managementIcons) {
        contact.managementIcons = {};
    }
    
    let inputId, currentId, btnSelector;
    
    switch(iconType) {
        case 'favorites':
            inputId = 'favoritesIconInput';
            currentId = 'currentFavoritesIcon';
            btnSelector = '#favoritesIcon'; // 顶部收藏按钮（img元素）
            break;
        case 'sticker':
            inputId = 'stickerIconInput';
            currentId = 'currentStickerIcon';
            btnSelector = '.chat-action-btn[onclick="showStickerMenu()"]'; // 底部表情按钮（button元素）
            break;
        case 'voice':
            inputId = 'voiceIconInput';
            currentId = null;
            btnSelector = '#voiceFunctionIcon'; // 底部语音按钮（img元素）
            break;
    }
    
    const iconValue = document.getElementById(inputId).value.trim();
    if (!iconValue) {
        alert('请输入图标文本、Emoji 或 URL');
        return;
    }
    
    // 保存图标
    if (iconType === 'sticker') {
        // 表情包可以是文本/Emoji或URL
        if (iconValue.startsWith('http://') || iconValue.startsWith('https://') || iconValue.startsWith('data:')) {
            contact.managementIcons[iconType] = { type: 'url', value: iconValue };
        } else {
            contact.managementIcons[iconType] = { type: 'text', value: iconValue };
        }
    } else {
        // 收藏和语音使用图片URL
        contact.managementIcons[iconType] = { type: 'url', value: iconValue };
    }
    
    saveContacts();
    
    // 更新显示
    if (currentId) {
        const currentEl = document.getElementById(currentId);
        if (iconType === 'sticker' && contact.managementIcons[iconType].type === 'text') {
            currentEl.textContent = iconValue;
        } else {
            currentEl.innerHTML = `<img src="${iconValue}" style="width: 20px; height: 20px; object-fit: contain;">`;
        }
    }
    
    // 立即更新页面上的按钮
    const btn = document.querySelector(btnSelector);
    if (btn) {
        if (iconType === 'favorites' || iconType === 'voice') {
            // 收藏和语音按钮是 img 元素
            btn.src = iconValue;
        } else if (iconType === 'sticker') {
            // 表情包按钮是 button 元素
            if (contact.managementIcons[iconType].type === 'text') {
                btn.textContent = iconValue;
            } else {
                btn.innerHTML = `<img src="${iconValue}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
    }
    
    document.getElementById(inputId).value = '';
    alert('图标已更新');
}

// 上传管理图标
function uploadManagementIcon(event, iconType) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const contact = vibeContacts.find(c => c.id === currentChatContactId);
        if (!contact) return;
        
        if (!contact.managementIcons) {
            contact.managementIcons = {};
        }
        
        const imageUrl = e.target.result;
        
        let currentId, btnSelector;
        
        switch(iconType) {
            case 'favorites':
                currentId = 'currentFavoritesIcon';
                btnSelector = '#favoritesIcon';
                break;
            case 'sticker':
                currentId = 'currentStickerIcon';
                btnSelector = '.chat-action-btn[onclick="showStickerMenu()"]';
                break;
            case 'voice':
                currentId = null;
                btnSelector = '#voiceFunctionIcon';
                break;
        }
        
        // 保存图标（上传的都是图片）
        contact.managementIcons[iconType] = { type: 'image', value: imageUrl };
        saveContacts();
        
        // 更新显示
        if (currentId) {
            document.getElementById(currentId).innerHTML = `<img src="${imageUrl}" style="width: 20px; height: 20px; object-fit: contain;">`;
        }
        
        // 立即更新页面上的按钮
        const btn = document.querySelector(btnSelector);
        if (btn) {
            if (iconType === 'favorites' || iconType === 'voice') {
                // 收藏和语音按钮是 img 元素
                btn.src = imageUrl;
            } else if (iconType === 'sticker') {
                // 表情包按钮是 button 元素，需要替换内容
                btn.innerHTML = `<img src="${imageUrl}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
        
        alert('图标已更新');
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 加载管理图标设置
function loadManagementIcons(contact) {
    if (!contact.managementIcons) return;
    
    const icons = contact.managementIcons;
    
    // 加载收藏图标（图片）
    if (icons.favorites) {
        const icon = icons.favorites;
        const iconValue = icon.value;
        
        // 更新当前显示
        const currentEl = document.getElementById('currentFavoritesIcon');
        if (currentEl) {
            currentEl.innerHTML = `<img src="${iconValue}" style="width: 20px; height: 20px; object-fit: contain;">`;
        }
        
        // 更新页面按钮
        const btn = document.querySelector('#favoritesIcon');
        if (btn) {
            btn.src = iconValue;
        }
    }
    
    // 加载表情包图标（文本/Emoji）
    if (icons.sticker) {
        const icon = icons.sticker;
        const iconValue = icon.value;
        
        // 更新当前显示
        const currentEl = document.getElementById('currentStickerIcon');
        if (currentEl) {
            if (icon.type === 'text') {
                currentEl.textContent = iconValue;
            } else {
                currentEl.innerHTML = `<img src="${iconValue}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
        
        // 更新页面按钮
        const btn = document.querySelector('.chat-action-btn[onclick="showStickerMenu()"]');
        if (btn) {
            if (icon.type === 'text') {
                btn.textContent = iconValue;
            } else {
                btn.innerHTML = `<img src="${iconValue}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
    }
    
    // 加载语音图标（图片）
    if (icons.voice) {
        const icon = icons.voice;
        const iconValue = icon.value;
        
        // 更新页面按钮
        const btn = document.querySelector('#voiceFunctionIcon');
        if (btn) {
            btn.src = iconValue;
        }
    }
}

// ==================== 聊天图标管理（统一管理） ====================

// 更新聊天图标
function updateChatIcon(iconType) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 表情包图标走 managementIcons 系统
    if (iconType === 'sticker') {
        updateManagementIcon('sticker');
        return;
    }
    
    if (!contact.customIcons) {
        contact.customIcons = {};
    }
    
    const inputId = `${iconType}IconInput`;
    const iconUrl = document.getElementById(inputId).value.trim();
    
    if (!iconUrl) {
        alert('请输入图标 URL');
        return;
    }
    
    // 保存图标
    contact.customIcons[iconType] = iconUrl;
    saveContacts();
    
    // 更新预览
    const previewId = `${iconType}IconPreviewMini`;
    const preview = document.getElementById(previewId);
    if (preview && preview.tagName === 'IMG') {
        preview.src = iconUrl;
    }
    
    // 更新聊天页面的图标
    updateChatPageIcon(iconType, iconUrl);
    
    alert('图标已更新');
}

// 上传聊天图标
function uploadChatIcon(event, iconType) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageUrl = e.target.result;
        const inputId = `${iconType}IconInput`;
        document.getElementById(inputId).value = imageUrl;
        
        // 更新预览
        const previewId = `${iconType}IconPreviewMini`;
        const preview = document.getElementById(previewId);
        if (preview && preview.tagName === 'IMG') {
            preview.src = imageUrl;
        }
        
        // 自动保存
        updateChatIcon(iconType);
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
}

// 更新聊天页面的图标
function updateChatPageIcon(iconType, iconUrl) {
    let selector;
    
    switch(iconType) {
        case 'tokenAnalysis':
            selector = 'button[onclick="openTokenAnalysis()"] img';
            break;
        case 'memoryBank':
            selector = 'button[onclick="openMemoryBank()"] img';
            break;
        case 'regenerate':
            selector = 'button[onclick="showRegenerateMenu()"] img';
            break;
        case 'messageEdit':
            selector = '#messageEditIcon';
            break;
        case 'favorites':
            selector = '#favoritesIcon';
            break;
        case 'voice':
            selector = '#voiceFunctionIcon';
            break;
    }
    
    if (selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.src = iconUrl;
        }
    }
}

// 加载聊天图标到管理界面（绑定到当前联系人）
function loadChatIconsToManagement(contact) {
    console.log('加载图标设置，联系人:', contact.name, '图标数据:', contact.customIcons);
    
    // 确保 customIcons 对象存在
    if (!contact.customIcons) {
        contact.customIcons = {};
        console.log('初始化 customIcons 对象');
    }
    
    const icons = contact.customIcons;
    
    // 加载各个图标
    const iconTypes = ['tokenAnalysis', 'memoryBank', 'regenerate', 'messageEdit', 'favorites', 'voice', 'sticker'];
    
    iconTypes.forEach(type => {
        const inputId = `${type}IconInput`;
        const previewId = `${type}IconPreviewMini`;
        
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        if (icons[type]) {
            console.log(`加载 ${type} 图标:`, icons[type]);
            if (input) input.value = icons[type];
            
            if (preview) {
                if (preview.tagName === 'IMG') {
                    preview.src = icons[type];
                } else if (preview.tagName === 'SPAN') {
                    // 表情包图标
                    preview.textContent = icons[type];
                }
            }
        } else {
            console.log(`${type} 图标未设置，使用默认值`);
            if (input) input.value = '';
            if (preview && preview.tagName === 'IMG') preview.src = '';
        }
    });
}


// ==================== 表情包系统 ====================

// 全局表情包数据
let globalStickers = {
    categories: ['常用', '开心', '难过', '生气'],
    stickers: [
        // 示例数据
        { name: '开心', url: 'https://i.ibb.co/yFDN2pB/image.png', category: '常用' }
    ]
};

// 当前选中的分类
let currentStickerCategory = '常用';

// 显示表情包菜单
function showStickerMenu() {
    const menu = document.getElementById('stickerMenu');
    const isActive = menu.classList.contains('active');
    
    // 关闭其他菜单
    document.getElementById('messageTypeMenu').classList.remove('active');
    document.removeEventListener('click', closeStickerMenuOutside);
    
    if (isActive) {
        menu.classList.remove('active');
    } else {
        menu.classList.add('active');
        renderStickerCategories();
        renderStickerGrid();
        // 延迟添加监听器，避免立即触发
        setTimeout(() => {
            document.addEventListener('click', closeStickerMenuOutside);
        }, 100);
    }
}

// 点击外部关闭表情包菜单
function closeStickerMenuOutside(e) {
    const menu = document.getElementById('stickerMenu');
    const btn = document.querySelector('.chat-action-btn[onclick="showStickerMenu()"]');
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('active');
        document.removeEventListener('click', closeStickerMenuOutside);
    }
}

// 渲染表情包分类标签
function renderStickerCategories() {
    const container = document.getElementById('stickerCategories');
    container.innerHTML = '';
    
    globalStickers.categories.forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'sticker-category-tab';
        tab.textContent = category;
        if (category === currentStickerCategory) {
            tab.classList.add('active');
        }
        tab.onclick = () => {
            currentStickerCategory = category;
            renderStickerCategories();
            renderStickerGrid();
        };
        container.appendChild(tab);
    });
}

// 渲染表情包网格
function renderStickerGrid() {
    const grid = document.getElementById('stickerGrid');
    grid.innerHTML = '';
    
    const stickers = globalStickers.stickers.filter(s => s.category === currentStickerCategory);
    
    if (stickers.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: #95a5a6;">暂无表情包</div>';
        return;
    }
    
    stickers.forEach(sticker => {
        const item = document.createElement('div');
        item.className = 'sticker-item';
        item.innerHTML = `<img src="${sticker.url}" alt="${sticker.name}" title="${sticker.name}">`;
        item.onclick = () => sendSticker(sticker);
        grid.appendChild(item);
    });
}

// 发送表情包
function sendSticker(sticker) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 创建表情包消息
    const userMsg = {
        id: Date.now(),
        sender: 'user',
        type: 'sticker',
        stickerName: sticker.name,
        stickerUrl: sticker.url,
        timestamp: new Date().toISOString()
    };
    
    contact.messages.push(userMsg);
    saveContacts();
    
    // 渲染消息
    renderChatMessages();
    
    // 关闭表情包菜单
    document.getElementById('stickerMenu').classList.remove('active');
    
    // 发送给 AI（包含表情包名称）
    sendToAI(contact, `[STICKER:${sticker.name}]`);
}

// 打开表情包管理器
function openStickerManager() {
    document.getElementById('stickerMenu').classList.remove('active');
    const modal = document.getElementById('stickerManagerModal');
    modal.classList.add('active');
    
    renderStickerCategorySelect();
    renderCategoryList();
    renderStickerManagerList();
}

// 关闭表情包管理器
function closeStickerManager() {
    const modal = document.getElementById('stickerManagerModal');
    modal.classList.remove('active');
    saveStickersToStorage();
}

// 渲染分类选择器
function renderStickerCategorySelect() {
    const select = document.getElementById('stickerCategorySelect');
    select.innerHTML = '<option value="">选择分类</option>';
    
    globalStickers.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// 渲染分类列表
function renderCategoryList() {
    const container = document.getElementById('categoryList');
    container.innerHTML = '';
    
    globalStickers.categories.forEach(category => {
        const tag = document.createElement('div');
        tag.className = 'category-tag';
        tag.innerHTML = `
            <span>${category}</span>
            <button onclick="deleteStickerCategory('${category}')">×</button>
        `;
        container.appendChild(tag);
    });
}

// 添加分类
function addStickerCategory() {
    const input = document.getElementById('newCategoryName');
    const name = input.value.trim();
    
    if (!name) {
        alert('请输入分类名称');
        return;
    }
    
    if (globalStickers.categories.includes(name)) {
        alert('分类已存在');
        return;
    }
    
    globalStickers.categories.push(name);
    input.value = '';
    
    renderStickerCategorySelect();
    renderCategoryList();
    saveStickersToStorage();
}

// 删除分类
function deleteStickerCategory(category) {
    if (!confirm(`确定删除分类"${category}"？该分类下的所有表情包也会被删除。`)) {
        return;
    }
    
    globalStickers.categories = globalStickers.categories.filter(c => c !== category);
    globalStickers.stickers = globalStickers.stickers.filter(s => s.category !== category);
    
    if (currentStickerCategory === category) {
        currentStickerCategory = globalStickers.categories[0] || '常用';
    }
    
    renderStickerCategorySelect();
    renderCategoryList();
    renderStickerManagerList();
    saveStickersToStorage();
}

// 批量添加表情包
function addBulkStickers() {
    const category = document.getElementById('stickerCategorySelect').value;
    const input = document.getElementById('bulkStickerInput').value.trim();
    
    if (!category) {
        alert('请选择分类');
        return;
    }
    
    if (!input) {
        alert('请输入表情包数据');
        return;
    }
    
    const lines = input.split('\n');
    let added = 0;
    
    lines.forEach(line => {
        const parts = line.trim().split('|');
        if (parts.length === 2) {
            const name = parts[0].trim();
            const url = parts[1].trim();
            
            if (name && url) {
                globalStickers.stickers.push({ name, url, category });
                added++;
            }
        }
    });
    
    if (added > 0) {
        alert(`成功添加 ${added} 个表情包`);
        document.getElementById('bulkStickerInput').value = '';
        renderStickerManagerList();
        saveStickersToStorage();
    } else {
        alert('没有有效的表情包数据');
    }
}

// 渲染表情包管理列表
function renderStickerManagerList() {
    const container = document.getElementById('stickerManagerList');
    container.innerHTML = '';
    
    if (globalStickers.stickers.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #95a5a6;">暂无表情包</div>';
        return;
    }
    
    globalStickers.stickers.forEach((sticker, index) => {
        const item = document.createElement('div');
        item.className = 'sticker-manager-item';
        item.innerHTML = `
            <img src="${sticker.url}" alt="${sticker.name}">
            <div class="sticker-manager-item-info">
                <div class="sticker-manager-item-name">${sticker.name}</div>
                <div class="sticker-manager-item-category">${sticker.category}</div>
            </div>
            <div class="sticker-manager-item-actions">
                <button class="sticker-delete-btn" onclick="deleteSticker(${index})">删除</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// 删除表情包
function deleteSticker(index) {
    if (!confirm('确定删除这个表情包？')) {
        return;
    }
    
    globalStickers.stickers.splice(index, 1);
    renderStickerManagerList();
    saveStickersToStorage();
}

// 保存表情包数据到 localStorage
function saveStickersToStorage() {
    setStorageJSON('globalStickers', globalStickers);
}

// 从 localStorage 加载表情包数据
function loadStickersFromStorage() {
    const saved = getStorageJSON('globalStickers', null);
    if (saved && saved.categories && saved.stickers) {
        globalStickers = saved;
    }
    // 如果没有保存的数据或数据格式不对，保留默认的 globalStickers
}

// 页面加载时初始化表情包数据
document.addEventListener('DOMContentLoaded', () => {
    loadStickersFromStorage();
});


// ==================== 文字语音功能 ====================

// 打开文字语音对话框
function openMockVoiceDialog() {
    // 关闭消息类型菜单
    document.getElementById('messageTypeMenu').classList.remove('active');
    
    const modal = document.getElementById('mockVoiceDialog');
    modal.classList.add('active');
    
    // 清空输入
    document.getElementById('mockVoiceText').value = '';
    document.getElementById('mockVoiceTone').value = '平静';
}

// 关闭文字语音对话框
function closeMockVoiceDialog() {
    const modal = document.getElementById('mockVoiceDialog');
    modal.classList.remove('active');
}

// 发送文字语音
function sendMockVoice() {
    const text = document.getElementById('mockVoiceText').value.trim();
    const tone = document.getElementById('mockVoiceTone').value.trim();
    
    if (!text) {
        alert('请输入语音内容');
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 创建语音消息
    const voiceMsg = {
        id: Date.now(),
        sender: 'user',
        type: 'voice',
        message: text,
        tone: tone || '平静',
        timestamp: new Date().toISOString()
    };
    
    contact.chat_history.push(voiceMsg);
    
    // 添加到待发送队列（用于合并发送）
    pendingMessages.push(text);
    
    saveContacts();
    
    // 渲染消息
    const container = document.getElementById('chatMessages');
    container.appendChild(createMessageElement(voiceMsg, contact));
    
    // 使用 requestAnimationFrame 优化滚动，防止抖动
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
    
    // 更新合并发送按钮状态
    updateMergeSendButton();
    
    // 关闭对话框
    closeMockVoiceDialog();
}

// ==================== 语音识别功能 ====================

let recognition = null;
let voiceRecognitionGranted = false; // 记录是否已授权

// 开始语音识别
function startVoiceRecognition() {
    // 关闭消息类型菜单
    document.getElementById('messageTypeMenu').classList.remove('active');
    
    // 检查浏览器支持
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('您的浏览器不支持语音识别功能');
        return;
    }
    
    const modal = document.getElementById('voiceRecognitionDialog');
    modal.classList.add('active');
    
    // 清空识别结果
    document.getElementById('recognizedText').value = '';
    
    // 如果已经授权过，直接开始识别
    if (voiceRecognitionGranted) {
        startRecognitionProcess();
    } else {
        // 第一次使用，需要授权
        startRecognitionProcess();
    }
}

// 开始识别过程
function startRecognitionProcess() {
    // 创建识别实例
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = function() {
        voiceRecognitionGranted = true; // 标记已授权
        console.log('语音识别已启动');
    };
    
    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        const textarea = document.getElementById('recognizedText');
        if (finalTranscript) {
            textarea.value += finalTranscript;
        }
    };
    
    recognition.onerror = function(event) {
        console.error('语音识别错误:', event.error);
        if (event.error === 'not-allowed') {
            alert('语音识别权限被拒绝，请在浏览器设置中允许麦克风访问');
            voiceRecognitionGranted = false;
        } else {
            alert('语音识别出错: ' + event.error);
        }
    };
    
    recognition.start();
}

// 停止语音识别
function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    closeVoiceRecognitionDialog();
}

// 关闭语音识别对话框
function closeVoiceRecognitionDialog() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    const modal = document.getElementById('voiceRecognitionDialog');
    modal.classList.remove('active');
}

// 发送识别的语音
function sendRecognizedVoice() {
    const text = document.getElementById('recognizedText').value.trim();
    
    if (!text) {
        alert('请先识别语音内容');
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 创建语音消息
    const voiceMsg = {
        id: Date.now(),
        sender: 'user',
        type: 'voice',
        message: text,
        tone: '语音识别',
        timestamp: new Date().toISOString()
    };
    
    contact.chat_history.push(voiceMsg);
    
    // 添加到待发送队列（用于合并发送）
    pendingMessages.push(text);
    
    saveContacts();
    
    // 渲染消息
    const container = document.getElementById('chatMessages');
    container.appendChild(createMessageElement(voiceMsg, contact));
    
    // 使用 requestAnimationFrame 优化滚动，防止抖动
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
    
    // 更新合并发送按钮状态
    updateMergeSendButton();
    
    // 关闭对话框
    stopVoiceRecognition();
}


// ==================== 消息格式设置功能 ====================

// 默认格式说明
const defaultFormatInstructions = `你可以使用以下格式发送不同类型的消息：

1. 语音消息：当你想表达强烈情绪或使用语气词时使用
   格式：[VOICE:语气描述]"实际朗读的内容"
   
   支持的语气词标签（放在引号内的文本中）：
   - 笑声：(laughs) 或 (chuckle)
   - 呼吸：(breath)、(pant)、(inhale)、(exhale)、(gasps)
   - 声音：(coughs)、(clear-throat)、(sniffs)、(sighs)、(snorts)
   - 其他：(groans)、(burps)、(lip-smacking)、(humming)、(emm)、(sneezes)
   
   例如：
   - [VOICE:轻笑着，有些开心]"今天天气真好(laughs)，我们去公园玩吧！"
   - [VOICE:温柔地]"（温柔地）别担心，一切都会好起来的。"
   - [VOICE:兴奋]"太棒了(laughs)！我通过考试了(chuckle)！"
   
   注意：
   - 只有引号""内的文字会被朗读
   - 语气词标签要放在引号内
   - 可以混合使用多个语气词标签
   - 中文语气词用（）括起来，如（开心地）
   - 英文标签用()括起来，如(laughs)
   
   渲染效果：显示为语音条，秒数在左侧，点击展开查看内容

2. 图片消息：当你想分享视觉内容时使用
   格式：[IMAGE]描述内容
   例如：[IMAGE]这是一张美丽的日落照片，天空被染成了橙红色
   渲染效果：显示用户设置的默认图片，点击查看你的描述

3. 视频消息：当你想分享动态内容时使用
   格式：[VIDEO]描述内容
   例如：[VIDEO]我录制了一段在公园散步的视频，天气很好
   渲染效果：显示用户设置的默认视频缩略图，点击查看你的描述

根据对话情境自然地选择合适的消息格式。使用语音消息时，可以灵活运用语气词标签让表达更生动。`;


// 打开消息格式设置
function openMessageFormatSettings() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const modal = document.getElementById('messageFormatModal');
    modal.classList.add('active');
    
    // 加载当前设置
    const settings = contact.messageFormatSettings || {
        defaultImageUrl: 'https://files.catbox.moe/gd7ol9.jpg',
        defaultVideoUrl: 'https://i.ibb.co/prxBykPd/video-default.jpg',
        formatInstructions: ''
    };
    
    // 不再加载格式说明到 DOM，使用统一管理系统
    // document.getElementById('messageFormatInstructions').value = settings.formatInstructions || defaultFormatInstructions;
    document.getElementById('defaultImageUrl').value = settings.defaultImageUrl;
    document.getElementById('defaultImagePreview').src = settings.defaultImageUrl;
    document.getElementById('defaultVideoUrl').value = settings.defaultVideoUrl;
    document.getElementById('defaultVideoPreview').src = settings.defaultVideoUrl;
}

// 关闭消息格式设置
function closeMessageFormatSettings() {
    const modal = document.getElementById('messageFormatModal');
    modal.classList.remove('active');
}

// 上传默认图片
function uploadDefaultImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('defaultImageUrl').value = e.target.result;
        document.getElementById('defaultImagePreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 上传默认视频图
function uploadDefaultVideo(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('defaultVideoUrl').value = e.target.result;
        document.getElementById('defaultVideoPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 保存消息格式设置
function saveMessageFormatSettings() {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    contact.messageFormatSettings = {
        defaultImageUrl: document.getElementById('defaultImageUrl').value.trim(),
        defaultVideoUrl: document.getElementById('defaultVideoUrl').value.trim(),
        // 不再保存 formatInstructions，使用统一管理系统
        // formatInstructions: document.getElementById('messageFormatInstructions').value.trim()
    };
    
    saveContacts();
    closeMessageFormatSettings();
    alert('消息格式设置已保存');
}


// ==================== MiniMax TTS 功能 ====================

// 全局音频播放器（防止重复播放）
let currentPlayingAudio = null;

// 播放 TTS 音频
async function playTtsAudio(msg, contact, bubbleDiv) {
    // 如果有正在播放的音频，先停止
    if (currentPlayingAudio && !currentPlayingAudio.paused) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
        currentPlayingAudio = null;
    }
    
    // 检查是否已有缓存的音频
    if (msg.ttsAudioUrl) {
        // 播放缓存的音频
        const audio = new Audio(msg.ttsAudioUrl);
        currentPlayingAudio = audio;
        
        // 播放结束后清除引用
        audio.onended = () => {
            if (currentPlayingAudio === audio) {
                currentPlayingAudio = null;
            }
        };
        
        audio.play();
        return;
    }
    
    // 首次点击，调用 MiniMax TTS API
    const minimaxConfig = getStorageJSON('minimax_config', {});
    
    if (!minimaxConfig.enabled) {
        alert('MiniMax 功能未启用，请在设置中启用');
        return;
    }
    
    if (!minimaxConfig.apiKey) {
        alert('MiniMax 未配置，请在设置中配置 API Key');
        return;
    }
    
    if (!contact.ttsSettings.voiceId) {
        alert('未设置语音 ID，请在联系人设置中配置');
        return;
    }
    
    // 显示加载状态
    bubbleDiv.style.opacity = '0.6';
    
    try {
        // 提取情绪和内容
        const emotion = msg.tone || '平静';
        const text = msg.message;
        
        // 调用 MiniMax TTS API
        const audioUrl = await generateTtsAudio(
            text,
            emotion,
            contact.ttsSettings.voiceId,
            contact.ttsSettings.language,
            contact.ttsSettings.speed,
            minimaxConfig
        );
        
        // 缓存音频 URL
        msg.ttsAudioUrl = audioUrl;
        saveContacts();
        
        // 播放音频
        const audio = new Audio(audioUrl);
        currentPlayingAudio = audio;
        
        // 播放结束后清除引用
        audio.onended = () => {
            if (currentPlayingAudio === audio) {
                currentPlayingAudio = null;
            }
        };
        
        audio.play();
        
        bubbleDiv.style.opacity = '1';
    } catch (error) {
        console.error('TTS 生成失败:', error);
        alert('语音合成失败: ' + error.message);
        bubbleDiv.style.opacity = '1';
    }
}

// 调用 MiniMax TTS API
async function generateTtsAudio(text, emotion, voiceId, language, speed, minimaxConfig) {
    const baseUrl = minimaxConfig.baseUrl || 'https://api.minimax.chat';
    const model = minimaxConfig.model || 'speech-01-turbo';
    
    try {
        // 移除中文括号（）内的内容，避免被朗读
        // 保留英文括号()内的内容（如 (laughs)），因为这些是语气词标签
        let cleanedText = text.replace(/（[^）]*）/g, '');
        
        // 移除颜文字和特殊符号（保留基本标点和语气词标签）
        // 移除常见颜文字符号：^_^ >_< T_T ಠ_ಠ (╯°□°）╯ ┻━┻ 等
        cleanedText = cleanedText.replace(/[\^_><TಠOoΩ╯°□┻━┳彡ノ┬─┴∀•́•̀ʘ‿ಥ⊙◕ω✧≧≦∩∪⌒´`～〜ー]/g, '');
        
        // 移除表情符号 emoji（保留文字内容）
        cleanedText = cleanedText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
        
        // 移除多余的空格和换行
        cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
        
        console.log('MiniMax TTS 原始文本:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
        console.log('MiniMax TTS 清理后文本:', cleanedText.substring(0, 100) + (cleanedText.length > 100 ? '...' : ''));
        
        // 根据官方文档构建请求体
        const requestBody = {
            model: model,
            text: cleanedText,  // 使用清理后的文本
            stream: false,
            voice_setting: {
                voice_id: voiceId,
                speed: speed,
                vol: 1.0,
                pitch: 0
                // 注意：V2 接口不支持 emotion 参数，通过文本中的语气词来表达情感
            },
            audio_setting: {
                sample_rate: 32000,
                format: 'mp3',
                channel: 1
                // 注意：V2 接口不支持 bitrate 参数
            }
        };
        
        console.log('MiniMax TTS 请求:', { 
            baseUrl, 
            model, 
            voiceId, 
            textLength: cleanedText.length,
            speed,
            hasEmotionTags: cleanedText.includes('(') || cleanedText.includes('（')
        });
        
        const response = await fetch(`${baseUrl}/v1/t2a_v2`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${minimaxConfig.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.base_resp?.status_msg || errorData.message || errorData.error || response.statusText;
            const statusCode = errorData.base_resp?.status_code || response.status;
            
            console.error('MiniMax TTS API 错误:', { status: response.status, errorData });
            
            throw new Error(`TTS API 调用失败 (${statusCode}): ${errorMsg}\n\n请检查:\n1. API Key 是否正确\n2. 区域设置是否匹配 (${baseUrl})\n3. 账户余额是否充足\n4. 模型 ${model} 是否可用\n5. 音色 ID ${voiceId} 是否正确`);
        }
        
        const data = await response.json();
        console.log('MiniMax TTS 完整响应:', data);
        console.log('MiniMax TTS 响应详情:', { 
            hasData: !!data.data,
            status: data.data?.status, 
            hasAudio: !!data.data?.audio,
            audioLength: data.data?.audio?.length,
            statusCode: data.base_resp?.status_code,
            statusMsg: data.base_resp?.status_msg,
            extraInfo: data.data?.extra_info
        });
        
        // 检查 API 是否返回成功状态
        if (data.base_resp?.status_code !== 0) {
            const errorMsg = data.base_resp?.status_msg || '未知错误';
            console.error('API 返回错误状态:', data.base_resp);
            throw new Error(`API 返回错误 (${data.base_resp?.status_code}): ${errorMsg}`);
        }
        
        // MiniMax 返回 hex 编码的音频（不是 base64）
        if (data.data && data.data.audio) {
            console.log('开始转换音频数据，长度:', data.data.audio.length);
            
            // 检查音频数据是否为空
            if (!data.data.audio || data.data.audio.length === 0) {
                throw new Error('API 返回的音频数据为空');
            }
            
            // 将 hex 转换为 Blob
            const audioBlob = hexToBlob(data.data.audio, 'audio/mp3');
            console.log('音频转换成功，Blob 大小:', audioBlob.size, 'bytes');
            
            // 将 Blob 转换为 base64 Data URL（永久保存）
            const audioDataUrl = await blobToDataUrl(audioBlob);
            console.log('音频已转换为 Data URL，可永久保存');
            
            return audioDataUrl;
        } else {
            console.error('响应中没有音频数据，完整响应:', JSON.stringify(data, null, 2));
            throw new Error(`API 未返回音频数据\n\n响应状态: ${data.base_resp?.status_msg || '未知'}\n请检查:\n1. 音色 ID 是否正确: ${voiceId}\n2. 模型是否支持该音色\n3. 查看浏览器控制台的完整响应`);
        }
    } catch (error) {
        console.error('MiniMax TTS 错误:', error);
        throw error;
    }
}

// Blob 转 Data URL（用于永久保存）
function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Hex 转 Blob（官方文档说明音频是 hex 编码）
function hexToBlob(hexString, mimeType) {
    // 移除可能的空格和换行
    hexString = hexString.replace(/\s/g, '');
    
    // 将 hex 字符串转换为字节数组
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    
    return new Blob([bytes], { type: mimeType });
}

// Base64 转 Blob（保留用于兼容性）
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

// 显示重新生成 TTS 对话框
function showRegenerateTtsDialog(msg, contact, bubbleDiv) {
    const dialog = document.createElement('div');
    dialog.className = 'summary-confirm-dialog active';
    dialog.innerHTML = `
        <div class="summary-confirm-content">
            <div class="summary-confirm-header">
                <h3>🔊 重新生成语音</h3>
            </div>
            <div class="summary-confirm-body">
                <p style="font-size: 15px; line-height: 1.6; color: #2c3e50;">
                    确定要重新生成这条语音吗？<br>
                    新的语音将覆盖之前的缓存。
                </p>
            </div>
            <div class="summary-confirm-actions">
                <button class="btn-secondary" onclick="this.closest('.summary-confirm-dialog').remove()">取消</button>
                <button class="btn-primary" onclick="confirmRegenerateTts(this)">重新生成</button>
            </div>
        </div>
    `;
    
    // 存储消息和联系人信息
    dialog.dataset.msgId = msg.id;
    dialog.dataset.contactId = contact.id;
    
    document.body.appendChild(dialog);
}

// 确认重新生成 TTS
async function confirmRegenerateTts(button) {
    const dialog = button.closest('.summary-confirm-dialog');
    const msgId = dialog.dataset.msgId;
    const contactId = parseInt(dialog.dataset.contactId);
    
    dialog.remove();
    
    const contact = vibeContacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const msg = contact.chat_history.find(m => m.id == msgId);
    if (!msg) return;
    
    // 清除缓存的音频
    if (msg.ttsAudioUrl) {
        URL.revokeObjectURL(msg.ttsAudioUrl);
        delete msg.ttsAudioUrl;
    }
    
    // 重新渲染聊天消息
    renderChatMessages();
    
    alert('已清除缓存，点击语音气泡将重新生成');
}


// ==================== NPC关系图功能 ====================

let selectedRelationNodes = [];

// 打开NPC关系图
function openNPCRelations(contactId) {
    const contact = vibeContacts.find(c => c.id == contactId);
    if (!contact) return;
    
    selectedRelationNodes = [];
    document.getElementById('npcRelationsModal').classList.add('active');
    // 延迟渲染以确保容器尺寸正确
    setTimeout(() => renderNPCRelationsGraph(contact), 50);
}

// 关闭NPC关系图
function closeNPCRelations() {
    document.getElementById('npcRelationsModal').classList.remove('active');
    selectedRelationNodes = [];
}

// 获取同分组的其他CHAR
function getSameGroupChars(contact) {
    const group = contact.group || '默认分组';
    return vibeContacts.filter(c => c.id !== contact.id && (c.group || '默认分组') === group);
}

// 标准化关系数据（兼容旧的字符串格式和新的对象格式）
// 旧格式: 'known' / 'unknown' → { label: '', visibility: 'known'/'unknown' }
// 新格式: { label: '姐妹', visibility: 'known' }
function normalizeRelation(rel) {
    if (!rel) return null;
    if (typeof rel === 'string') {
        return { label: '', visibility: rel };
    }
    return { label: rel.label || '', visibility: rel.visibility || 'known' };
}

// 获取关系的显示文本
function getRelationDisplayText(rel) {
    const r = normalizeRelation(rel);
    if (!r) return '';
    const vis = r.visibility === 'known' ? '可知' : '不知';
    return r.label ? `${r.label}（${vis}）` : vis;
}

// 获取两个CHAR之间的关系（从当前contact的charRelations中查找）
function getCharRelation(contact, id1, id2) {
    if (!contact.charRelations) return null;
    const key1 = id1 + '_' + id2;
    const key2 = id2 + '_' + id1;
    return contact.charRelations[key1] || contact.charRelations[key2] || null;
}

// 设置两个CHAR之间的关系
function setCharRelation(contact, id1, id2, relation) {
    if (!contact.charRelations) contact.charRelations = {};
    const key = String(id1) < String(id2) ? id1 + '_' + id2 : id2 + '_' + id1;
    contact.charRelations[key] = relation;
}

// 渲染NPC关系图（SVG版本）
function renderNPCRelationsGraph(contact) {
    const container = document.getElementById('relationsGraphContainer');
    container.innerHTML = '';
    
    const npcs = contact.npcs || [];
    const sameGroupChars = getSameGroupChars(contact);
    
    if (npcs.length === 0 && sameGroupChars.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #95a5a6;">
                <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                <div style="font-size: 16px;">该CHAR还没有NPC，同分组也没有其他CHAR</div>
            </div>
        `;
        return;
    }
    
    const width = container.offsetWidth || 600;
    const height = Math.max(450, container.offsetHeight || 450);
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 创建SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    container.style.position = 'relative';
    container.style.minHeight = height + 'px';
    container.appendChild(svg);
    
    // 所有节点（NPC + 同组CHAR）围绕中心CHAR
    const allNodes = [];
    npcs.forEach(npc => allNodes.push({ type: 'npc', data: npc, id: npc.id }));
    sameGroupChars.forEach(c => allNodes.push({ type: 'char', data: c, id: 'char_' + c.id }));
    
    const totalNodes = allNodes.length;
    const radius = Math.min(width, height) * 0.32;
    const angleStep = (2 * Math.PI) / totalNodes;
    const nodeSize = 60;
    
    // 计算节点位置
    const positions = {};
    positions['center'] = { x: centerX, y: centerY };
    
    allNodes.forEach((node, i) => {
        const angle = i * angleStep - Math.PI / 2; // 从顶部开始
        positions[node.id] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });
    
    // 绘制连线
    // 1. 中心CHAR到每个NPC的连线
    npcs.forEach(npc => {
        const pos = positions[npc.id];
        const rel = normalizeRelation(npc.relation);
        drawSVGLine(svg, centerX, centerY, pos.x, pos.y, rel);
    });
    
    // 2. 中心CHAR到同组CHAR的连线
    if (!contact.charRelations) contact.charRelations = {};
    sameGroupChars.forEach(c => {
        const pos = positions['char_' + c.id];
        const rel = getCharRelation(contact, contact.id, c.id);
        drawSVGLine(svg, centerX, centerY, pos.x, pos.y, rel ? normalizeRelation(rel) : null);
    });
    
    // 2.5 同组CHAR之间的连线
    for (let i = 0; i < sameGroupChars.length; i++) {
        for (let j = i + 1; j < sameGroupChars.length; j++) {
            const c1 = sameGroupChars[i];
            const c2 = sameGroupChars[j];
            const rel = getCharRelation(contact, c1.id, c2.id);
            if (rel) {
                const p1 = positions['char_' + c1.id];
                const p2 = positions['char_' + c2.id];
                drawSVGLine(svg, p1.x, p1.y, p2.x, p2.y, normalizeRelation(rel));
            }
        }
    }
    
    // 3. NPC之间的连线
    for (let i = 0; i < npcs.length; i++) {
        for (let j = i + 1; j < npcs.length; j++) {
            const npc1 = npcs[i];
            const npc2 = npcs[j];
            if (npc1.relations && npc1.relations[npc2.id]) {
                const p1 = positions[npc1.id];
                const p2 = positions[npc2.id];
                drawSVGLine(svg, p1.x, p1.y, p2.x, p2.y, normalizeRelation(npc1.relations[npc2.id]));
            }
        }
    }
    
    // 4. NPC与同组CHAR之间的连线
    npcs.forEach(npc => {
        if (npc.charRelations) {
            Object.keys(npc.charRelations).forEach(charId => {
                const pos1 = positions[npc.id];
                const pos2 = positions['char_' + charId];
                if (pos1 && pos2) {
                    drawSVGLine(svg, pos1.x, pos1.y, pos2.x, pos2.y, normalizeRelation(npc.charRelations[charId]));
                }
            });
        }
    });
    
    // 创建中心CHAR节点
    createGraphNode(container, centerX, centerY, nodeSize, {
        type: 'center-char',
        name: contact.name,
        avatar: contact.avatarUrl,
        id: contact.id,
        isCenter: true
    }, contact);
    
    // 创建周围节点
    allNodes.forEach(node => {
        const pos = positions[node.id];
        createGraphNode(container, pos.x, pos.y, nodeSize, {
            type: node.type,
            name: node.data.name || node.data.nickname || '',
            avatar: node.type === 'npc' ? node.data.avatar : node.data.avatarUrl,
            id: node.id,
            rawId: node.type === 'npc' ? node.data.id : node.data.id,
            isCenter: false
        }, contact);
    });
    
    // 添加图例
    const legend = document.createElement('div');
    legend.className = 'graph-legend';
    legend.innerHTML = `
        <div class="legend-item"><span class="legend-line known"></span> CHAR可知</div>
        <div class="legend-item"><span class="legend-line unknown"></span> CHAR不知</div>
        <div class="legend-item"><span class="legend-line unset"></span> 未设置</div>
        <div class="legend-tip">点击两个头像设置关系（名称+可知性）</div>
    `;
    container.appendChild(legend);
}

// 绘制SVG连线（rel 为 { label, visibility } 对象或 null）
function drawSVGLine(svg, x1, y1, x2, y2, rel) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke-width', '3');
    
    if (!rel) {
        // 未设置关系
        line.setAttribute('stroke', '#ccc');
        line.setAttribute('stroke-dasharray', '4,4');
        line.setAttribute('stroke-width', '1.5');
    } else if (rel.visibility === 'known') {
        line.setAttribute('stroke', '#4CAF50'); // 绿色 = CHAR可知
        line.setAttribute('stroke-dasharray', 'none');
    } else {
        line.setAttribute('stroke', '#9C27B0'); // 紫色 = CHAR不知
        line.setAttribute('stroke-dasharray', '8,4');
    }
    
    svg.appendChild(line);
    
    // 关系标签（显示自定义关系名称 + 可知/不知）
    if (rel) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const labelText = rel.label || (rel.visibility === 'known' ? '可知' : '不知');
        
        // 背景
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 6);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', rel.visibility === 'known' ? '#4CAF50' : '#9C27B0');
        text.setAttribute('paint-order', 'stroke');
        text.setAttribute('stroke', '#fff');
        text.setAttribute('stroke-width', '3');
        text.textContent = labelText;
        svg.appendChild(text);
    }
}

// 创建关系图节点
function createGraphNode(container, x, y, size, info, contact) {
    const node = document.createElement('div');
    node.className = 'relation-node' + (info.isCenter ? ' center-node' : '') + (info.type === 'char' ? ' char-type' : '');
    node.dataset.type = info.type;
    node.dataset.id = info.id;
    node.style.left = (x - size / 2) + 'px';
    node.style.top = (y - size / 2) + 'px';
    node.style.width = size + 'px';
    node.style.height = size + 'px';
    
    if (!info.isCenter) {
        node.onclick = () => selectRelationNode(node, contact);
    } else {
        // 中心CHAR也可以被选中来设置与其他节点的关系
        node.onclick = () => selectRelationNode(node, contact);
        node.style.cursor = 'pointer';
    }
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'relation-node-avatar';
    avatarDiv.style.width = size + 'px';
    avatarDiv.style.height = size + 'px';
    if (info.avatar) {
        const img = document.createElement('img');
        img.className = 'avatar-img';
        img.src = info.avatar;
        img.alt = info.name;
        avatarDiv.appendChild(img);
    } else {
        avatarDiv.textContent = (info.name || '?').charAt(0);
    }
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'relation-node-name';
    nameDiv.textContent = info.name;
    
    // 类型标签
    if (info.type === 'char') {
        const badge = document.createElement('div');
        badge.className = 'relation-node-badge char-badge';
        badge.textContent = 'CHAR';
        node.appendChild(badge);
    } else if (info.isCenter) {
        const badge = document.createElement('div');
        badge.className = 'relation-node-badge center-badge';
        badge.textContent = '★';
        node.appendChild(badge);
    }
    
    node.appendChild(avatarDiv);
    node.appendChild(nameDiv);
    container.appendChild(node);
}

// 选择关系节点
function selectRelationNode(node, contact) {
    if (node.classList.contains('selected')) {
        node.classList.remove('selected');
        selectedRelationNodes = selectedRelationNodes.filter(n => n !== node);
    } else {
        node.classList.add('selected');
        selectedRelationNodes.push(node);
    }
    
    // 如果选择了两个节点，设置关系
    if (selectedRelationNodes.length === 2) {
        setNodeRelation(contact, selectedRelationNodes[0], selectedRelationNodes[1]);
    }
}

// 设置两个节点之间的关系（支持NPC-NPC、NPC-CHAR、CHAR-CHAR）
function setNodeRelation(contact, node1, node2) {
    // 标准化类型：center-char 视为 char
    const rawType1 = node1.dataset.type;
    const rawType2 = node2.dataset.type;
    const type1 = rawType1 === 'center-char' ? 'char' : rawType1;
    const type2 = rawType2 === 'center-char' ? 'char' : rawType2;
    const id1 = node1.dataset.id;
    const id2 = node2.dataset.id;
    
    // 获取名称
    let name1 = '', name2 = '';
    if (type1 === 'npc') {
        const npc = contact.npcs.find(n => n.id === id1);
        name1 = npc ? npc.name : id1;
    } else if (rawType1 === 'center-char') {
        name1 = contact.name;
    } else {
        const c = vibeContacts.find(c => 'char_' + c.id === id1);
        name1 = c ? c.name : id1;
    }
    if (type2 === 'npc') {
        const npc = contact.npcs.find(n => n.id === id2);
        name2 = npc ? npc.name : id2;
    } else if (rawType2 === 'center-char') {
        name2 = contact.name;
    } else {
        const c = vibeContacts.find(c => 'char_' + c.id === id2);
        name2 = c ? c.name : id2;
    }
    
    const relationLabel = prompt(`设置 ${name1} 和 ${name2} 的关系：\n\n请输入关系名称（如：姐妹、兄弟、朋友、恋人、同事等）`);
    if (relationLabel === null) {
        // 用户取消
        selectedRelationNodes.forEach(n => n.classList.remove('selected'));
        selectedRelationNodes = [];
        return;
    }
    
    const visibility = confirm(`${name1} 和 ${name2} 的关系「${relationLabel || '未命名'}」：\n\n确定 = CHAR可知（绿线）\n取消 = CHAR不知（紫线）`) ? 'known' : 'unknown';
    
    const relation = { label: relationLabel.trim(), visibility: visibility };
    
    // 根据节点类型保存关系
    if (type1 === 'npc' && type2 === 'npc') {
        // NPC-NPC关系
        const npc1 = contact.npcs.find(n => n.id === id1);
        const npc2 = contact.npcs.find(n => n.id === id2);
        if (npc1 && npc2) {
            if (!npc1.relations) npc1.relations = {};
            if (!npc2.relations) npc2.relations = {};
            npc1.relations[id2] = relation;
            npc2.relations[id1] = relation;
        }
    } else if (type1 === 'npc' && type2 === 'char') {
        // NPC-CHAR关系（同组CHAR或中心CHAR）
        const npc = contact.npcs.find(n => n.id === id1);
        const charId = rawType2 === 'center-char' ? String(contact.id) : id2.replace('char_', '');
        if (npc) {
            if (!npc.charRelations) npc.charRelations = {};
            npc.charRelations[charId] = relation;
        }
    } else if (type1 === 'char' && type2 === 'npc') {
        // CHAR-NPC关系
        const npc = contact.npcs.find(n => n.id === id2);
        const charId = rawType1 === 'center-char' ? String(contact.id) : id1.replace('char_', '');
        if (npc) {
            if (!npc.charRelations) npc.charRelations = {};
            npc.charRelations[charId] = relation;
        }
    } else if (type1 === 'char' && type2 === 'char') {
        // CHAR之间的关系
        const charId1 = rawType1 === 'center-char' ? String(contact.id) : id1.replace('char_', '');
        const charId2 = rawType2 === 'center-char' ? String(contact.id) : id2.replace('char_', '');
        setCharRelation(contact, charId1, charId2, relation);
    }
    
    generateNPCRelationsDocument(contact);
    saveContacts();
    
    selectedRelationNodes.forEach(n => n.classList.remove('selected'));
    selectedRelationNodes = [];
    renderNPCRelationsGraph(contact);
}

// 设置NPC之间的关系（保留兼容）
function setNPCRelation(contact, node1, node2) {
    setNodeRelation(contact, node1, node2);
}


// ==================== CSS主题管理功能 ====================

// 内置预设主题（不可删除）
const builtinCSSThemes = {
    'builtin-cyber': {
        id: 'builtin-cyber',
        name: '⭐ 赛博朋克',
        css: `/* ===== 赛博朋克主题 - 霓虹紫青暗色风格 ===== */
:root {
    /* 页面背景 */
    --chat-page-bg: #0a0a12;
    --chat-page-bg-image: none;
    --chat-window-bg: #0a0a12;
    --chat-window-border: #00ffff;
    --chat-window-shadow: rgba(0, 255, 255, 0.2);
    
    /* 通用主题色 */
    --theme-primary: #ff00ff;
    --theme-primary-dark: #cc00cc;
    --theme-primary-light: #ff66ff;
    --theme-secondary: rgba(0, 255, 255, 0.2);
    --theme-bg-light: #0a0a12;
    --theme-text-primary: #00ffff;
    --theme-text-secondary: #888899;
    --theme-border: #00ffff;
    --theme-shadow: rgba(0, 255, 255, 0.3);
    
    /* 卡片和面板 */
    --card-bg: rgba(18, 18, 26, 0.95);
    --card-border: #00ffff;
    --card-shadow: rgba(0, 255, 255, 0.3);
    --card-hover-bg: rgba(255, 0, 255, 0.2);
    
    /* 按钮 */
    --btn-primary-bg: #ff00ff;
    --btn-primary-color: #000000;
    --btn-primary-border: #00ffff;
    --btn-primary-shadow: rgba(0, 255, 255, 0.3);
    --btn-primary-hover-bg: #cc00cc;
    
    /* 头像 */
    --avatar-bg: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
    --avatar-border: #00ffff;
    --avatar-shadow: rgba(0, 255, 255, 0.3);
    
    /* 模态框 */
    --modal-bg: #12121a;
    --modal-header-bg: linear-gradient(90deg, #ff00ff 0%, #00ffff 100%);
    --modal-header-color: #000000;
    --modal-border: #00ffff;
    --modal-shadow: rgba(0, 255, 255, 0.3);
    
    /* 表单 */
    --form-label-color: #00ffff;
    --form-input-bg: #0a0a12;
    --form-input-border: #00ffff;
    --form-input-focus-border: #ff00ff;
    --form-input-focus-shadow: rgba(255, 0, 255, 0.3);
    
    /* 分组 */
    --group-header-bg: rgba(18, 18, 26, 0.95);
    --group-header-hover-bg: rgba(255, 0, 255, 0.2);
    --group-title-color: #00ffff;
    --group-count-bg: #ff00ff;
    --group-border: #00ffff;
    
    /* NPC */
    --npc-info-bg: rgba(255, 0, 255, 0.15);
    --npc-info-border: #ff00ff;
    --npc-char-header-bg: linear-gradient(135deg, #12121a 0%, rgba(255, 0, 255, 0.2) 100%);
    
    /* 关系图 */
    --graph-bg: linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0a0a12 100%);
    --graph-node-bg: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
    
    /* 页面头部 */
    --page-header-bg: linear-gradient(90deg, #ff00ff 0%, #00ffff 100%);
    --page-header-color: #000000;
    --page-header-border: #00ffff;
    
    /* 侧边栏 */
    --sidebar-bg: #12121a;
    --sidebar-border: #ff00ff;
    --sidebar-nav-item-color: #00ffff;
    --sidebar-nav-item-bg: transparent;
    --sidebar-nav-item-hover-bg: rgba(255, 0, 255, 0.2);
    --sidebar-nav-item-active-bg: #ff00ff;
    --sidebar-nav-item-active-color: #000000;
    --sidebar-nav-item-active-border: #00ffff;
    
    /* 聊天头部 */
    --chat-header-bg: linear-gradient(90deg, #ff00ff 0%, #00ffff 100%);
    --chat-header-border: #00ffff;
    --chat-header-text-color: #000000;
    --chat-header-avatar-border: #00ffff;
    --chat-header-avatar-bg: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
    --chat-header-btn-bg: rgba(0, 0, 0, 0.3);
    --chat-header-btn-color: #000000;
    
    /* 消息区域 */
    --chat-messages-bg: #0a0a12;
    --received-bubble-bg: rgba(18, 18, 26, 0.95);
    --received-bubble-border: #00ffff;
    --received-bubble-shadow: rgba(0, 255, 255, 0.3);
    --received-bubble-color: #00ffff;
    --sent-bubble-bg: linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%);
    --sent-bubble-border: #ff00ff;
    --sent-bubble-shadow: rgba(255, 0, 255, 0.3);
    --sent-bubble-color: #ffffff;
    
    /* 输入区域 */
    --chat-input-container-bg: #12121a;
    --chat-input-container-border: #ff00ff;
    --chat-input-bg: #0a0a12;
    --chat-input-border: #00ffff;
    --chat-input-color: #00ffff;
    --chat-input-focus-border: #ff00ff;
    --chat-send-btn-bg: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
    --chat-send-btn-border: #00ffff;
    --chat-send-btn-color: #000000;
    --chat-send-btn-shadow: rgba(0, 255, 255, 0.3);
    --chat-send-btn-hover-bg: #cc00cc;
    --chat-action-btn-bg: #ff00ff;
    --chat-action-btn-border: #00ffff;
    --chat-action-btn-color: #000000;
    --chat-action-btn-shadow: rgba(0, 255, 255, 0.3);
    --chat-action-btn-hover-bg: #cc00cc;
    
    /* 菜单 */
    --chat-menu-bg: #12121a;
    --chat-menu-border: #00ffff;
    --chat-menu-shadow: rgba(0, 255, 255, 0.3);
    --chat-menu-item-color: #00ffff;
    --chat-menu-item-hover-bg: rgba(255, 0, 255, 0.2);
    --chat-menu-item-border: #333355;
    
    /* 通知 */
    --notification-banner-bg: rgba(18, 18, 26, 0.95);
    --notification-banner-border: #00ffff;
    --notification-banner-shadow: rgba(0, 255, 255, 0.3);
    --notification-title-color: #ff00ff;
    --notification-message-color: #00ffff;
    --notification-avatar-border: #00ffff;
    --notification-avatar-shadow: rgba(0, 255, 255, 0.3);
    
    /* 打字指示器 */
    --typing-indicator-color: rgba(0, 255, 255, 0.3);
}`
    },
    'builtin-nature': {
        id: 'builtin-nature',
        name: '⭐ 清新自然',
        css: `/* ===== 清新自然主题 - 绿色森林风格 ===== */
:root {
    /* 页面背景 */
    --chat-page-bg: #f0f7f0;
    --chat-page-bg-image: none;
    --chat-window-bg: #f0f7f0;
    --chat-window-border: #2d5a2d;
    --chat-window-shadow: rgba(45, 90, 45, 0.15);
    
    /* 通用主题色 */
    --theme-primary: #4caf50;
    --theme-primary-dark: #2e7d32;
    --theme-primary-light: #a5d6a7;
    --theme-secondary: #e8f5e8;
    --theme-bg-light: #f0f7f0;
    --theme-text-primary: #2d5a2d;
    --theme-text-secondary: #689f68;
    --theme-border: #2d5a2d;
    --theme-shadow: #a5d6a7;
    
    /* 卡片和面板 */
    --card-bg: #ffffff;
    --card-border: #2d5a2d;
    --card-shadow: #a5d6a7;
    --card-hover-bg: #e8f5e8;
    
    /* 按钮 */
    --btn-primary-bg: #4caf50;
    --btn-primary-color: #ffffff;
    --btn-primary-border: #2d5a2d;
    --btn-primary-shadow: #a5d6a7;
    --btn-primary-hover-bg: #2e7d32;
    
    /* 头像 */
    --avatar-bg: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
    --avatar-border: #2d5a2d;
    --avatar-shadow: #a5d6a7;
    
    /* 模态框 */
    --modal-bg: #ffffff;
    --modal-header-bg: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
    --modal-header-color: #ffffff;
    --modal-border: #2d5a2d;
    --modal-shadow: #a5d6a7;
    
    /* 表单 */
    --form-label-color: #2e7d32;
    --form-input-bg: #ffffff;
    --form-input-border: #2d5a2d;
    --form-input-focus-border: #4caf50;
    --form-input-focus-shadow: #a5d6a7;
    
    /* 分组 */
    --group-header-bg: #ffffff;
    --group-header-hover-bg: #e8f5e8;
    --group-title-color: #2e7d32;
    --group-count-bg: #a5d6a7;
    --group-border: #a5d6a7;
    
    /* NPC */
    --npc-info-bg: #e8f5e8;
    --npc-info-border: #4caf50;
    --npc-char-header-bg: linear-gradient(135deg, #f0f7f0 0%, #e8f5e8 100%);
    
    /* 关系图 */
    --graph-bg: linear-gradient(135deg, #f0f7f0 0%, #e8f5e8 50%, #f0f7f0 100%);
    --graph-node-bg: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
    
    /* 页面头部 */
    --page-header-bg: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
    --page-header-color: #ffffff;
    --page-header-border: #2e7d32;
    
    /* 侧边栏 */
    --sidebar-bg: #e8f5e8;
    --sidebar-border: #4a7c4a;
    --sidebar-nav-item-color: #2d5a2d;
    --sidebar-nav-item-bg: transparent;
    --sidebar-nav-item-hover-bg: rgba(76, 175, 80, 0.15);
    --sidebar-nav-item-active-bg: #4caf50;
    --sidebar-nav-item-active-color: #ffffff;
    --sidebar-nav-item-active-border: #2e7d32;
    
    /* 聊天头部 */
    --chat-header-bg: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
    --chat-header-border: #2e7d32;
    --chat-header-text-color: #ffffff;
    --chat-header-avatar-border: #ffffff;
    --chat-header-avatar-bg: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
    --chat-header-btn-bg: rgba(255, 255, 255, 0.25);
    --chat-header-btn-color: #ffffff;
    
    /* 消息区域 */
    --chat-messages-bg: #f5faf5;
    --received-bubble-bg: #ffffff;
    --received-bubble-border: #a5d6a7;
    --received-bubble-shadow: #c8e6c9;
    --received-bubble-color: #2d5a2d;
    --sent-bubble-bg: linear-gradient(135deg, #81c784 0%, #66bb6a 100%);
    --sent-bubble-border: #4caf50;
    --sent-bubble-shadow: #a5d6a7;
    --sent-bubble-color: #ffffff;
    
    /* 输入区域 */
    --chat-input-container-bg: #e8f5e8;
    --chat-input-container-border: #a5d6a7;
    --chat-input-bg: #ffffff;
    --chat-input-border: #81c784;
    --chat-input-color: #2d5a2d;
    --chat-input-focus-border: #4caf50;
    --chat-send-btn-bg: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
    --chat-send-btn-border: #2e7d32;
    --chat-send-btn-color: #ffffff;
    --chat-send-btn-shadow: #a5d6a7;
    --chat-send-btn-hover-bg: #2e7d32;
    --chat-action-btn-bg: #4caf50;
    --chat-action-btn-border: #2d5a2d;
    --chat-action-btn-color: #ffffff;
    --chat-action-btn-shadow: #a5d6a7;
    --chat-action-btn-hover-bg: #2e7d32;
    
    /* 菜单 */
    --chat-menu-bg: #ffffff;
    --chat-menu-border: #2d5a2d;
    --chat-menu-shadow: #a5d6a7;
    --chat-menu-item-color: #2d5a2d;
    --chat-menu-item-hover-bg: #e8f5e8;
    --chat-menu-item-border: #c8e6c9;
    
    /* 通知 */
    --notification-banner-bg: rgba(255, 255, 255, 0.95);
    --notification-banner-border: #2d5a2d;
    --notification-banner-shadow: #a5d6a7;
    --notification-title-color: #2e7d32;
    --notification-message-color: #2d5a2d;
    --notification-avatar-border: #2d5a2d;
    --notification-avatar-shadow: #a5d6a7;
    
    /* 打字指示器 */
    --typing-indicator-color: #c8e6c9;
}`
    },
    'builtin-sunset': {
        id: 'builtin-sunset',
        name: '⭐ 温暖日落',
        css: `/* ===== 温暖日落主题 - 橙黄暖色风格 ===== */
:root {
    /* 页面背景 */
    --chat-page-bg: #fff8f0;
    --chat-page-bg-image: none;
    --chat-window-bg: #fff8f0;
    --chat-window-border: #d84315;
    --chat-window-shadow: rgba(216, 67, 21, 0.15);
    
    /* 通用主题色 */
    --theme-primary: #ff7043;
    --theme-primary-dark: #d84315;
    --theme-primary-light: #ffcc80;
    --theme-secondary: #fff3e0;
    --theme-bg-light: #fff8f0;
    --theme-text-primary: #5d4037;
    --theme-text-secondary: #a1887f;
    --theme-border: #d84315;
    --theme-shadow: #ffcc80;
    
    /* 卡片和面板 */
    --card-bg: #ffffff;
    --card-border: #d84315;
    --card-shadow: #ffcc80;
    --card-hover-bg: #fff3e0;
    
    /* 按钮 */
    --btn-primary-bg: #ff7043;
    --btn-primary-color: #ffffff;
    --btn-primary-border: #d84315;
    --btn-primary-shadow: #ffcc80;
    --btn-primary-hover-bg: #d84315;
    
    /* 头像 */
    --avatar-bg: linear-gradient(135deg, #ffcc80 0%, #ff9800 100%);
    --avatar-border: #d84315;
    --avatar-shadow: #ffcc80;
    
    /* 模态框 */
    --modal-bg: #ffffff;
    --modal-header-bg: linear-gradient(135deg, #ffab91 0%, #ff7043 100%);
    --modal-header-color: #ffffff;
    --modal-border: #d84315;
    --modal-shadow: #ffcc80;
    
    /* 表单 */
    --form-label-color: #d84315;
    --form-input-bg: #ffffff;
    --form-input-border: #d84315;
    --form-input-focus-border: #ff7043;
    --form-input-focus-shadow: #ffcc80;
    
    /* 分组 */
    --group-header-bg: #ffffff;
    --group-header-hover-bg: #fff3e0;
    --group-title-color: #d84315;
    --group-count-bg: #ffcc80;
    --group-border: #ffcc80;
    
    /* NPC */
    --npc-info-bg: #fff3e0;
    --npc-info-border: #ff7043;
    --npc-char-header-bg: linear-gradient(135deg, #fff8f0 0%, #fff3e0 100%);
    
    /* 关系图 */
    --graph-bg: linear-gradient(135deg, #fff8f0 0%, #fff3e0 50%, #fff8f0 100%);
    --graph-node-bg: linear-gradient(135deg, #ffcc80 0%, #ff9800 100%);
    
    /* 页面头部 */
    --page-header-bg: linear-gradient(135deg, #ffab91 0%, #ff7043 100%);
    --page-header-color: #ffffff;
    --page-header-border: #d84315;
    
    /* 侧边栏 */
    --sidebar-bg: #fff3e0;
    --sidebar-border: #ff8a65;
    --sidebar-nav-item-color: #bf360c;
    --sidebar-nav-item-bg: transparent;
    --sidebar-nav-item-hover-bg: rgba(255, 138, 101, 0.2);
    --sidebar-nav-item-active-bg: #ff7043;
    --sidebar-nav-item-active-color: #ffffff;
    --sidebar-nav-item-active-border: #d84315;
    
    /* 聊天头部 */
    --chat-header-bg: linear-gradient(135deg, #ffab91 0%, #ff7043 100%);
    --chat-header-border: #d84315;
    --chat-header-text-color: #ffffff;
    --chat-header-avatar-border: #ffffff;
    --chat-header-avatar-bg: linear-gradient(135deg, #ffcc80 0%, #ff9800 100%);
    --chat-header-btn-bg: rgba(255, 255, 255, 0.3);
    --chat-header-btn-color: #ffffff;
    
    /* 消息区域 */
    --chat-messages-bg: #fffaf5;
    --received-bubble-bg: #ffffff;
    --received-bubble-border: #ffcc80;
    --received-bubble-shadow: #ffe0b2;
    --received-bubble-color: #5d4037;
    --sent-bubble-bg: linear-gradient(135deg, #ffab91 0%, #ff8a65 100%);
    --sent-bubble-border: #ff7043;
    --sent-bubble-shadow: #ffcc80;
    --sent-bubble-color: #ffffff;
    
    /* 输入区域 */
    --chat-input-container-bg: #fff3e0;
    --chat-input-container-border: #ffcc80;
    --chat-input-bg: #ffffff;
    --chat-input-border: #ffab91;
    --chat-input-color: #5d4037;
    --chat-input-focus-border: #ff7043;
    --chat-send-btn-bg: linear-gradient(135deg, #ff9800 0%, #ff7043 100%);
    --chat-send-btn-border: #d84315;
    --chat-send-btn-color: #ffffff;
    --chat-send-btn-shadow: #ffcc80;
    --chat-send-btn-hover-bg: #d84315;
    --chat-action-btn-bg: #ff7043;
    --chat-action-btn-border: #d84315;
    --chat-action-btn-color: #ffffff;
    --chat-action-btn-shadow: #ffcc80;
    --chat-action-btn-hover-bg: #d84315;
    
    /* 菜单 */
    --chat-menu-bg: #ffffff;
    --chat-menu-border: #d84315;
    --chat-menu-shadow: #ffcc80;
    --chat-menu-item-color: #5d4037;
    --chat-menu-item-hover-bg: #fff3e0;
    --chat-menu-item-border: #ffe0b2;
    
    /* 通知 */
    --notification-banner-bg: rgba(255, 255, 255, 0.95);
    --notification-banner-border: #d84315;
    --notification-banner-shadow: #ffcc80;
    --notification-title-color: #d84315;
    --notification-message-color: #5d4037;
    --notification-avatar-border: #d84315;
    --notification-avatar-shadow: #ffcc80;
    
    /* 打字指示器 */
    --typing-indicator-color: #ffe0b2;
}`
    },
    'builtin-minimal': {
        id: 'builtin-minimal',
        name: '⭐ 极简黑白',
        css: `/* ===== 极简黑白主题 - 纯净简约风格 ===== */
:root {
    /* 页面背景 */
    --chat-page-bg: #ffffff;
    --chat-page-bg-image: none;
    --chat-window-bg: #ffffff;
    --chat-window-border: #e0e0e0;
    --chat-window-shadow: rgba(0, 0, 0, 0.08);
    
    /* 通用主题色 */
    --theme-primary: #333333;
    --theme-primary-dark: #000000;
    --theme-primary-light: #cccccc;
    --theme-secondary: #f5f5f5;
    --theme-bg-light: #ffffff;
    --theme-text-primary: #333333;
    --theme-text-secondary: #888888;
    --theme-border: #e0e0e0;
    --theme-shadow: #cccccc;
    
    /* 卡片和面板 */
    --card-bg: #ffffff;
    --card-border: #e0e0e0;
    --card-shadow: #cccccc;
    --card-hover-bg: #f5f5f5;
    
    /* 按钮 */
    --btn-primary-bg: #333333;
    --btn-primary-color: #ffffff;
    --btn-primary-border: #000000;
    --btn-primary-shadow: #cccccc;
    --btn-primary-hover-bg: #000000;
    
    /* 头像 */
    --avatar-bg: linear-gradient(135deg, #666666 0%, #333333 100%);
    --avatar-border: #000000;
    --avatar-shadow: #cccccc;
    
    /* 模态框 */
    --modal-bg: #ffffff;
    --modal-header-bg: #333333;
    --modal-header-color: #ffffff;
    --modal-border: #000000;
    --modal-shadow: #cccccc;
    
    /* 表单 */
    --form-label-color: #333333;
    --form-input-bg: #ffffff;
    --form-input-border: #cccccc;
    --form-input-focus-border: #333333;
    --form-input-focus-shadow: #e0e0e0;
    
    /* 分组 */
    --group-header-bg: #ffffff;
    --group-header-hover-bg: #f5f5f5;
    --group-title-color: #333333;
    --group-count-bg: #e0e0e0;
    --group-border: #e0e0e0;
    
    /* NPC */
    --npc-info-bg: #f5f5f5;
    --npc-info-border: #333333;
    --npc-char-header-bg: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
    
    /* 关系图 */
    --graph-bg: linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #ffffff 100%);
    --graph-node-bg: linear-gradient(135deg, #666666 0%, #333333 100%);
    
    /* 页面头部 */
    --page-header-bg: #333333;
    --page-header-color: #ffffff;
    --page-header-border: #000000;
    
    /* 侧边栏 */
    --sidebar-bg: #fafafa;
    --sidebar-border: #e0e0e0;
    --sidebar-nav-item-color: #333333;
    --sidebar-nav-item-bg: transparent;
    --sidebar-nav-item-hover-bg: #f0f0f0;
    --sidebar-nav-item-active-bg: #333333;
    --sidebar-nav-item-active-color: #ffffff;
    --sidebar-nav-item-active-border: #000000;
    
    /* 聊天头部 */
    --chat-header-bg: #333333;
    --chat-header-border: #000000;
    --chat-header-text-color: #ffffff;
    --chat-header-avatar-border: #ffffff;
    --chat-header-avatar-bg: linear-gradient(135deg, #666666 0%, #333333 100%);
    --chat-header-btn-bg: rgba(255, 255, 255, 0.15);
    --chat-header-btn-color: #ffffff;
    
    /* 消息区域 */
    --chat-messages-bg: #ffffff;
    --received-bubble-bg: #f5f5f5;
    --received-bubble-border: #e0e0e0;
    --received-bubble-shadow: #cccccc;
    --received-bubble-color: #333333;
    --sent-bubble-bg: #333333;
    --sent-bubble-border: #000000;
    --sent-bubble-shadow: #cccccc;
    --sent-bubble-color: #ffffff;
    
    /* 输入区域 */
    --chat-input-container-bg: #fafafa;
    --chat-input-container-border: #e0e0e0;
    --chat-input-bg: #ffffff;
    --chat-input-border: #cccccc;
    --chat-input-color: #333333;
    --chat-input-focus-border: #333333;
    --chat-send-btn-bg: #333333;
    --chat-send-btn-border: #000000;
    --chat-send-btn-color: #ffffff;
    --chat-send-btn-shadow: #cccccc;
    --chat-send-btn-hover-bg: #000000;
    --chat-action-btn-bg: #333333;
    --chat-action-btn-border: #000000;
    --chat-action-btn-color: #ffffff;
    --chat-action-btn-shadow: #cccccc;
    --chat-action-btn-hover-bg: #000000;
    
    /* 菜单 */
    --chat-menu-bg: #ffffff;
    --chat-menu-border: #e0e0e0;
    --chat-menu-shadow: #cccccc;
    --chat-menu-item-color: #333333;
    --chat-menu-item-hover-bg: #f5f5f5;
    --chat-menu-item-border: #eeeeee;
    
    /* 通知 */
    --notification-banner-bg: rgba(255, 255, 255, 0.95);
    --notification-banner-border: #000000;
    --notification-banner-shadow: #cccccc;
    --notification-title-color: #333333;
    --notification-message-color: #333333;
    --notification-avatar-border: #000000;
    --notification-avatar-shadow: #cccccc;
    
    /* 打字指示器 */
    --typing-indicator-color: #e0e0e0;
}`
    },
    'builtin-ocean': {
        id: 'builtin-ocean',
        name: '⭐ 深海蓝调',
        css: `/* ===== 深海蓝调主题 - 海洋深邃风格 ===== */
:root {
    /* 页面背景 */
    --chat-page-bg: #0d1b2a;
    --chat-page-bg-image: none;
    --chat-window-bg: #0d1b2a;
    --chat-window-border: #1b4965;
    --chat-window-shadow: rgba(27, 73, 101, 0.3);
    
    /* 通用主题色 */
    --theme-primary: #5bc0eb;
    --theme-primary-dark: #1b4965;
    --theme-primary-light: #9dd9f3;
    --theme-secondary: rgba(91, 192, 235, 0.15);
    --theme-bg-light: #0d1b2a;
    --theme-text-primary: #e0e1dd;
    --theme-text-secondary: #778da9;
    --theme-border: #415a77;
    --theme-shadow: rgba(91, 192, 235, 0.3);
    
    /* 卡片和面板 */
    --card-bg: rgba(27, 38, 59, 0.95);
    --card-border: #415a77;
    --card-shadow: rgba(91, 192, 235, 0.3);
    --card-hover-bg: rgba(91, 192, 235, 0.15);
    
    /* 按钮 */
    --btn-primary-bg: #5bc0eb;
    --btn-primary-color: #0d1b2a;
    --btn-primary-border: #1b4965;
    --btn-primary-shadow: rgba(91, 192, 235, 0.3);
    --btn-primary-hover-bg: #1b4965;
    
    /* 头像 */
    --avatar-bg: linear-gradient(135deg, #5bc0eb 0%, #1b4965 100%);
    --avatar-border: #5bc0eb;
    --avatar-shadow: rgba(91, 192, 235, 0.3);
    
    /* 模态框 */
    --modal-bg: #1b263b;
    --modal-header-bg: linear-gradient(135deg, #1b4965 0%, #5bc0eb 100%);
    --modal-header-color: #ffffff;
    --modal-border: #5bc0eb;
    --modal-shadow: rgba(91, 192, 235, 0.3);
    
    /* 表单 */
    --form-label-color: #5bc0eb;
    --form-input-bg: #0d1b2a;
    --form-input-border: #415a77;
    --form-input-focus-border: #5bc0eb;
    --form-input-focus-shadow: rgba(91, 192, 235, 0.3);
    
    /* 分组 */
    --group-header-bg: rgba(27, 38, 59, 0.95);
    --group-header-hover-bg: rgba(91, 192, 235, 0.15);
    --group-title-color: #5bc0eb;
    --group-count-bg: #5bc0eb;
    --group-border: #415a77;
    
    /* NPC */
    --npc-info-bg: rgba(91, 192, 235, 0.1);
    --npc-info-border: #5bc0eb;
    --npc-char-header-bg: linear-gradient(135deg, #1b263b 0%, rgba(91, 192, 235, 0.15) 100%);
    
    /* 关系图 */
    --graph-bg: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%);
    --graph-node-bg: linear-gradient(135deg, #5bc0eb 0%, #1b4965 100%);
    
    /* 页面头部 */
    --page-header-bg: linear-gradient(135deg, #1b4965 0%, #5bc0eb 100%);
    --page-header-color: #ffffff;
    --page-header-border: #5bc0eb;
    
    /* 侧边栏 */
    --sidebar-bg: #1b263b;
    --sidebar-border: #415a77;
    --sidebar-nav-item-color: #5bc0eb;
    --sidebar-nav-item-bg: transparent;
    --sidebar-nav-item-hover-bg: rgba(91, 192, 235, 0.15);
    --sidebar-nav-item-active-bg: #5bc0eb;
    --sidebar-nav-item-active-color: #0d1b2a;
    --sidebar-nav-item-active-border: #9dd9f3;
    
    /* 聊天头部 */
    --chat-header-bg: linear-gradient(135deg, #1b4965 0%, #5bc0eb 100%);
    --chat-header-border: #5bc0eb;
    --chat-header-text-color: #ffffff;
    --chat-header-avatar-border: #9dd9f3;
    --chat-header-avatar-bg: linear-gradient(135deg, #5bc0eb 0%, #1b4965 100%);
    --chat-header-btn-bg: rgba(255, 255, 255, 0.2);
    --chat-header-btn-color: #ffffff;
    
    /* 消息区域 */
    --chat-messages-bg: #0d1b2a;
    --received-bubble-bg: rgba(27, 38, 59, 0.95);
    --received-bubble-border: #415a77;
    --received-bubble-shadow: rgba(91, 192, 235, 0.2);
    --received-bubble-color: #e0e1dd;
    --sent-bubble-bg: linear-gradient(135deg, #1b4965 0%, #5bc0eb 100%);
    --sent-bubble-border: #5bc0eb;
    --sent-bubble-shadow: rgba(91, 192, 235, 0.3);
    --sent-bubble-color: #ffffff;
    
    /* 输入区域 */
    --chat-input-container-bg: #1b263b;
    --chat-input-container-border: #415a77;
    --chat-input-bg: #0d1b2a;
    --chat-input-border: #5bc0eb;
    --chat-input-color: #e0e1dd;
    --chat-input-focus-border: #9dd9f3;
    --chat-send-btn-bg: linear-gradient(135deg, #5bc0eb 0%, #1b4965 100%);
    --chat-send-btn-border: #5bc0eb;
    --chat-send-btn-color: #ffffff;
    --chat-send-btn-shadow: rgba(91, 192, 235, 0.3);
    --chat-send-btn-hover-bg: #1b4965;
    --chat-action-btn-bg: #5bc0eb;
    --chat-action-btn-border: #1b4965;
    --chat-action-btn-color: #0d1b2a;
    --chat-action-btn-shadow: rgba(91, 192, 235, 0.3);
    --chat-action-btn-hover-bg: #1b4965;
    
    /* 菜单 */
    --chat-menu-bg: #1b263b;
    --chat-menu-border: #415a77;
    --chat-menu-shadow: rgba(91, 192, 235, 0.3);
    --chat-menu-item-color: #e0e1dd;
    --chat-menu-item-hover-bg: rgba(91, 192, 235, 0.15);
    --chat-menu-item-border: #415a77;
    
    /* 通知 */
    --notification-banner-bg: rgba(27, 38, 59, 0.95);
    --notification-banner-border: #5bc0eb;
    --notification-banner-shadow: rgba(91, 192, 235, 0.3);
    --notification-title-color: #5bc0eb;
    --notification-message-color: #e0e1dd;
    --notification-avatar-border: #5bc0eb;
    --notification-avatar-shadow: rgba(91, 192, 235, 0.3);
    
    /* 打字指示器 */
    --typing-indicator-color: rgba(91, 192, 235, 0.3);
}`
    }
};

let cssThemes = [];
let currentCSSThemeId = 'default';

// 加载CSS主题列表
function loadCSSThemes() {
    let loadedThemes = getStorageJSON('vibe_css_themes', []);
    console.log('加载CSS主题，loadedThemes:', loadedThemes, '类型:', typeof loadedThemes);
    
    // 确保cssThemes是数组
    if (!Array.isArray(loadedThemes)) {
        console.error('vibe_css_themes不是数组，重置为数组');
        if (loadedThemes && typeof loadedThemes === 'object' && loadedThemes !== null) {
            // 如果是对象，尝试转换为数组
            // 检查对象是否有length属性（可能是类数组对象）
            if (Array.isArray(loadedThemes)) {
                // 这不应该发生，因为我们已经检查了!Array.isArray(loadedThemes)
                cssThemes = loadedThemes;
            } else if (loadedThemes.length !== undefined) {
                // 类数组对象，使用Array.from
                cssThemes = Array.from(loadedThemes);
            } else {
                // 普通对象，使用Object.values
                cssThemes = Object.values(loadedThemes);
            }
        } else {
            cssThemes = [];
        }
    } else {
        cssThemes = loadedThemes;
    }
    
    console.log('处理后的cssThemes:', cssThemes);
    
    const savedCurrentId = localStorage.getItem('current_css_theme_id'); // 这是字符串，不是JSON
    console.log('从localStorage加载current_css_theme_id:', savedCurrentId);
    
    // 处理undefined和null值
    if (savedCurrentId === 'undefined' || savedCurrentId === 'null' || savedCurrentId === null || savedCurrentId === undefined || savedCurrentId === '') {
        currentCSSThemeId = 'default';
        console.log('savedCurrentId无效，设置currentCSSThemeId为default');
    } else {
        currentCSSThemeId = savedCurrentId;
        console.log('设置currentCSSThemeId为:', currentCSSThemeId);
    }
}

// 保存CSS主题列表
function saveCSSThemes() {
    console.log('保存CSS主题，cssThemes:', cssThemes, 'currentCSSThemeId:', currentCSSThemeId);
    setStorageJSON('vibe_css_themes', cssThemes);
    // 确保currentCSSThemeId不是undefined或null
    if (currentCSSThemeId !== undefined && currentCSSThemeId !== null) {
        localStorage.setItem('current_css_theme_id', currentCSSThemeId);
        console.log('保存current_css_theme_id为:', currentCSSThemeId);
    } else {
        localStorage.setItem('current_css_theme_id', 'default');
        console.log('currentCSSThemeId无效，保存current_css_theme_id为default');
    }
}

// 重置CSS主题数据（用于修复损坏的数据）
function resetCSSThemes() {
    if (confirm('确定要重置所有CSS主题数据吗？这将删除所有自定义主题。')) {
        cssThemes = [];
        currentCSSThemeId = 'default';
        localStorage.removeItem('vibe_css_themes');
        localStorage.removeItem('current_css_theme_id');
        alert('CSS主题数据已重置');
        
        // 重新加载页面以应用更改
        location.reload();
    }
}

// 获取默认CSS - 嵌入的Y2K粉色像素风CSS
function getDefaultCSS() {
    return `/* ==================== 聊天页面完整CSS变量系统 ==================== */
:root {
    /* ========== 页面整体背景 ========== */
    --chat-page-bg: #FFF0F5;                    /* 聊天页面主背景色 */
    --chat-page-bg-image: none;                 /* 聊天页面背景图片 */
    
    /* ========== 聊天窗口整体 ========== */
    --chat-window-bg: #FFF0F5;                  /* 聊天窗口背景色 */
    --chat-window-border: #000000;              /* 聊天窗口边框色 */
    --chat-window-shadow: rgba(0, 0, 0, 0.1);   /* 聊天窗口阴影色 */
    
    /* ========== 左侧导航栏 ========== */
    --sidebar-bg: #FFFFFF;                      /* 侧边栏背景色 */
    --sidebar-border: #000000;                  /* 侧边栏边框色 */
    --sidebar-width: 100px;                     /* 侧边栏宽度 */
    --sidebar-padding: 20px 0;                  /* 侧边栏内边距 */
    
    /* 导航项 */
    --sidebar-nav-item-color: #000000;          /* 导航项文字颜色 */
    --sidebar-nav-item-bg: transparent;         /* 导航项背景色 */
    --sidebar-nav-item-hover-bg: #FFE4E1;       /* 导航项悬停背景色 */
    --sidebar-nav-item-active-bg: #FF69B4;      /* 导航项激活背景色 */
    --sidebar-nav-item-active-color: #FFFFFF;   /* 导航项激活文字颜色 */
    --sidebar-nav-item-active-border: #FF1493;  /* 导航项激活左边框色 */
    --sidebar-nav-item-padding: 20px 10px;      /* 导航项内边距 */
    --sidebar-nav-item-font-size: 14px;         /* 导航项字体大小 */
    --sidebar-nav-item-font-weight: bold;       /* 导航项字体粗细 */
    --sidebar-nav-item-border-width: 4px;       /* 导航项左边框宽度 */
    
    /* 响应式 */
    --sidebar-mobile-width: 80px;               /* 移动端侧边栏宽度 */
    --sidebar-mobile-nav-padding: 15px 5px;     /* 移动端导航项内边距 */
    --sidebar-mobile-nav-font-size: 12px;       /* 移动端导航项字体大小 */
    
    /* ========== 聊天头部区域 ========== */
    --chat-header-bg: #FF69B4;                  /* 聊天头部背景色 */
    --chat-header-border: #000000;              /* 聊天头部边框色 */
    --chat-header-text-color: #FFFFFF;          /* 聊天头部文字颜色 */
    --chat-header-shadow: rgba(0, 0, 0, 0.2);   /* 聊天头部阴影 */
    
    /* 头部头像 */
    --chat-header-avatar-border: #FFFFFF;       /* 头部头像边框色 */
    --chat-header-avatar-shadow: rgba(0, 0, 0, 0.2); /* 头部头像阴影 */
    --chat-header-avatar-bg: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%); /* 头像默认背景 */
    
    /* 头部按钮 */
    --chat-header-btn-bg: rgba(255, 255, 255, 0.3);     /* 头部按钮背景 */
    --chat-header-btn-border: rgba(255, 255, 255, 0.5); /* 头部按钮边框 */
    --chat-header-btn-color: #FFFFFF;                    /* 头部按钮文字色 */
    --chat-header-btn-hover-bg: rgba(255, 255, 255, 0.4); /* 头部按钮悬停背景 */
    
    /* 头部状态文字 */
    --chat-header-name-color: #FFFFFF;           /* 联系人姓名颜色 */
    --chat-header-status-color: rgba(255, 255, 255, 0.8); /* 状态文字颜色 */
    
    /* ========== 消息区域 ========== */
    --chat-messages-bg: #FAFAFA;                /* 消息区域背景色 */
    --chat-messages-padding: 20px;              /* 消息区域内边距 */
    
    /* ========== 接收消息气泡 ========== */
    --received-bubble-bg: rgba(255, 255, 255, 0.85);    /* 接收气泡背景色 */
    --received-bubble-border: #000000;                   /* 接收气泡边框色 */
    --received-bubble-shadow: #FFB6C1;                   /* 接收气泡阴影色 */
    --received-bubble-color: #000000;                    /* 接收气泡文字色 */
    --received-bubble-radius: 18px;                      /* 接收气泡圆角 */
    --received-bubble-padding: 12px 16px;                /* 接收气泡内边距 */
    --received-bubble-max-width: 70%;                    /* 接收气泡最大宽度 */
    --received-bubble-margin: 0 auto 12px 0;             /* 接收气泡外边距 */
    
    /* ========== 发送消息气泡 ========== */
    --sent-bubble-bg: rgba(255, 105, 180, 0.85);        /* 发送气泡背景色 */
    --sent-bubble-border: #000000;                       /* 发送气泡边框色 */
    --sent-bubble-shadow: #FFB6C1;                       /* 发送气泡阴影色 */
    --sent-bubble-color: #FFFFFF;                        /* 发送气泡文字色 */
    --sent-bubble-radius: 18px;                          /* 发送气泡圆角 */
    --sent-bubble-padding: 12px 16px;                    /* 发送气泡内边距 */
    --sent-bubble-max-width: 70%;                        /* 发送气泡最大宽度 */
    --sent-bubble-margin: 0 0 12px auto;                 /* 发送气泡外边距 */
    
    /* ========== 消息头像 ========== */
    --chat-message-avatar-size: 40px;           /* 消息头像尺寸 */
    --chat-message-avatar-border: #000000;      /* 消息头像边框色 */
    --chat-message-avatar-shadow: #FFB6C1;      /* 消息头像阴影色 */
    --chat-message-avatar-bg: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%); /* 消息头像默认背景 */
    
    /* ========== 消息时间戳 ========== */
    --chat-message-time-color: #999999;         /* 时间戳文字颜色 */
    --chat-message-time-size: 11px;             /* 时间戳字体大小 */
    
    /* ========== 输入区域 ========== */
    --chat-input-container-bg: #FFFFFF;         /* 输入容器背景色 */
    --chat-input-container-border: #000000;     /* 输入容器边框色 */
    --chat-input-container-shadow: rgba(0, 0, 0, 0.1); /* 输入容器阴影 */
    --chat-input-container-padding: 12px;       /* 输入容器内边距 */
    
    /* 输入框 */
    --chat-input-bg: #FFFFFF;                   /* 输入框背景色 */
    --chat-input-border: #000000;               /* 输入框边框色 */
    --chat-input-color: #000000;                /* 输入框文字色 */
    --chat-input-placeholder-color: #999999;    /* 输入框占位符颜色 */
    --chat-input-focus-border: #FF1493;         /* 输入框聚焦边框色 */
    --chat-input-focus-shadow: rgba(255, 20, 147, 0.3); /* 输入框聚焦阴影 */
    --chat-input-radius: 8px;                   /* 输入框圆角 */
    --chat-input-padding: 10px;                 /* 输入框内边距 */
    
    /* 发送按钮 */
    --chat-send-btn-bg: #FF69B4;                /* 发送按钮背景色 */
    --chat-send-btn-border: #000000;            /* 发送按钮边框色 */
    --chat-send-btn-color: #FFFFFF;             /* 发送按钮文字色 */
    --chat-send-btn-shadow: #FFB6C1;            /* 发送按钮阴影色 */
    --chat-send-btn-hover-bg: #FF1493;          /* 发送按钮悬停背景色 */
    --chat-send-btn-radius: 8px;                /* 发送按钮圆角 */
    --chat-send-btn-padding: 10px 20px;         /* 发送按钮内边距 */
    
    /* 功能按钮 */
    --chat-action-btn-bg: #FF69B4;              /* 功能按钮背景色 */
    --chat-action-btn-border: #000000;          /* 功能按钮边框色 */
    --chat-action-btn-color: #FFFFFF;           /* 功能按钮文字色 */
    --chat-action-btn-shadow: #FFB6C1;          /* 功能按钮阴影色 */
    --chat-action-btn-hover-bg: #FF1493;        /* 功能按钮悬停背景色 */
    --chat-action-btn-size: 40px;               /* 功能按钮尺寸 */
    
    /* ========== 通话记录气泡专用变量 ========== */
    --video-call-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 视频通话气泡背景 */
    --voice-call-bg: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); /* 语音通话气泡背景 */
    --call-bubble-color: #FFFFFF;               /* 通话气泡文字颜色 */
    --call-bubble-border: #000000;              /* 通话气泡边框颜色 */
    --call-bubble-shadow: rgba(0, 0, 0, 0.2);   /* 通话气泡阴影颜色 */
    --call-bubble-radius: 12px;                 /* 通话气泡圆角 */
    --call-bubble-padding: 12px;                /* 通话气泡内边距 */
    
    /* ========== 特殊消息类型 ========== */
    /* 语音消息 */
    --voice-bubble-bg: inherit;                 /* 语音气泡背景（继承父级） */
    --voice-bubble-wave-color: currentColor;    /* 语音波形颜色 */
    --voice-bubble-duration-color: currentColor; /* 语音时长颜色 */
    --voice-bubble-min-width: 150px;            /* 语音气泡最小宽度 */
    --voice-bubble-max-width: 250px;            /* 语音气泡最大宽度 */
    
    /* 图片消息 */
    --image-bubble-size: 200px;                 /* 图片气泡尺寸 */
    --image-bubble-shadow: rgba(0, 0, 0, 0.2);  /* 图片气泡阴影 */
    --image-bubble-radius: 12px;                /* 图片气泡圆角 */
    
    /* 视频消息 */
    --video-bubble-width: 200px;                /* 视频气泡宽度 */
    --video-bubble-height: 150px;               /* 视频气泡高度 */
    --video-bubble-shadow: rgba(0, 0, 0, 0.2);  /* 视频气泡阴影 */
    --video-bubble-radius: 12px;                /* 视频气泡圆角 */
    --video-play-icon-bg: rgba(0, 0, 0, 0.7);   /* 视频播放图标背景 */
    --video-play-icon-color: #FFFFFF;           /* 视频播放图标颜色 */
    
    /* 表情包消息 */
    --sticker-bubble-size: 120px;               /* 表情包气泡尺寸 */
    
    /* ========== 双语消息 ========== */
    --bilingual-original-color: inherit;        /* 原文颜色 */
    --bilingual-translation-color: #666666;     /* 翻译文字颜色 */
    --bilingual-border-color: rgba(0, 0, 0, 0.1); /* 双语分隔线颜色 */
    --bilingual-sent-translation-color: rgba(255, 255, 255, 0.9); /* 发送消息翻译颜色 */
    --bilingual-sent-border-color: rgba(255, 255, 255, 0.2); /* 发送消息分隔线颜色 */
    
    /* ========== 消息编辑模式 ========== */
    --edit-mode-toolbar-bg: #FFFFFF;            /* 编辑工具栏背景 */
    --edit-mode-toolbar-border: #000000;        /* 编辑工具栏边框 */
    --edit-mode-toolbar-shadow: rgba(0, 0, 0, 0.1); /* 编辑工具栏阴影 */
    --edit-mode-selected-border: #FF1493;       /* 选中消息边框色 */
    --edit-mode-selected-shadow: rgba(255, 20, 147, 0.3); /* 选中消息阴影 */
    
    /* 编辑按钮 */
    --edit-btn-bg: #4CAF50;                     /* 编辑按钮背景 */
    --edit-btn-color: #FFFFFF;                  /* 编辑按钮文字 */
    --delete-btn-bg: #f44336;                   /* 删除按钮背景 */
    --delete-btn-color: #FFFFFF;                /* 删除按钮文字 */
    --settings-btn-bg: #FF69B4;                 /* 设置按钮背景 */
    --settings-btn-color: #FFFFFF;              /* 设置按钮文字 */
    --cancel-btn-bg: #9E9E9E;                   /* 取消按钮背景 */
    --cancel-btn-color: #FFFFFF;                /* 取消按钮文字 */
    
    /* ========== 聊天菜单 ========== */
    --chat-menu-bg: #FFFFFF;                    /* 聊天菜单背景 */
    --chat-menu-border: #000000;                /* 聊天菜单边框 */
    --chat-menu-shadow: #FFB6C1;                /* 聊天菜单阴影 */
    --chat-menu-item-color: #000000;            /* 菜单项文字色 */
    --chat-menu-item-hover-bg: #FFE4E1;         /* 菜单项悬停背景 */
    --chat-menu-item-border: #FFB6C1;           /* 菜单项分隔线 */
    
    /* ========== 打字指示器 ========== */
    --typing-indicator-color: #FFE4E1;          /* 打字指示器颜色 */
    --typing-dot-size: 6px;                     /* 打字点尺寸 */
    
    /* ========== 通知横幅 ========== */
    --notification-banner-bg: rgba(255, 255, 255, 0.95); /* 通知横幅背景 */
    --notification-banner-border: #000000;      /* 通知横幅边框 */
    --notification-banner-shadow: #FFB6C1;      /* 通知横幅阴影 */
    --notification-title-color: #FF1493;        /* 通知标题颜色 */
    --notification-message-color: #000000;      /* 通知消息颜色 */
    --notification-avatar-border: #000000;      /* 通知头像边框 */
    --notification-avatar-shadow: #FFB6C1;      /* 通知头像阴影 */
    
    /* ========== 消息类型菜单 ========== */
    --message-type-menu-bg: #FFFFFF;            /* 消息类型菜单背景 */
    --message-type-menu-border: #000000;        /* 消息类型菜单边框 */
    --message-type-menu-shadow: #FFB6C1;        /* 消息类型菜单阴影 */
    --message-type-item-color: #000000;         /* 菜单项文字色 */
    --message-type-item-hover-bg: #FFE4E1;      /* 菜单项悬停背景 */
    --message-type-item-border: #FFB6C1;        /* 菜单项分隔线 */
    
    /* ========== 表情包菜单 ========== */
    --sticker-menu-bg: #FFFFFF;                 /* 表情包菜单背景 */
    --sticker-menu-border: #000000;             /* 表情包菜单边框 */
    --sticker-menu-shadow: #FFB6C1;             /* 表情包菜单阴影 */
    --sticker-menu-header-border: #FFB6C1;      /* 表情包菜单头部边框 */
    
    /* ========== 已总结消息标记 ========== */
    --summarized-mark-bg: #FFFFFF;              /* 总结标记背景 */
    --summarized-mark-border: #FFB6C1;          /* 总结标记边框 */
    --summarized-mark-color: #FFB6C1;           /* 总结标记颜色 */
    --summarized-mark-shadow: rgba(0, 0, 0, 0.1); /* 总结标记阴影 */
    
    /* ========== 响应式断点 ========== */
    --mobile-breakpoint: 768px;                 /* 移动端断点 */
    --tablet-breakpoint: 1024px;                /* 平板端断点 */
}

/* ==================== Y2K 像素风基础样式 ==================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: 'Courier New', 'MS Gothic', monospace;
    background: var(--chat-page-bg);
    background-image: var(--chat-page-bg-image);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: var(--app-height, 100vh);
    overflow: hidden;
}

/* ==================== Y2K 像素风横屏三栏布局 ==================== */
.main-container {
    display: flex;
    width: 100vw;
    height: var(--app-height, 100vh);
    overflow: hidden;
}

/* 左侧导航栏 - 100px 固定宽度 */
.left-sidebar {
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    background: var(--sidebar-bg);
    border-right: 2px solid var(--sidebar-border);
    display: flex;
    flex-direction: column;
    padding: var(--sidebar-padding);
    z-index: 100;
    flex-shrink: 0;
}

.sidebar-nav-item {
    padding: var(--sidebar-nav-item-padding);
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: var(--sidebar-nav-item-font-size);
    font-weight: var(--sidebar-nav-item-font-weight);
    color: var(--sidebar-nav-item-color);
    background: var(--sidebar-nav-item-bg);
    border-left: var(--sidebar-nav-item-border-width) solid transparent;
}

.sidebar-nav-item:hover {
    background: var(--sidebar-nav-item-hover-bg);
}

.sidebar-nav-item.active {
    background: var(--sidebar-nav-item-active-bg);
    color: var(--sidebar-nav-item-active-color);
    border-left-color: var(--sidebar-nav-item-active-border);
}

/* 右侧主内容区 */
.main-content {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #FFF0F5;
}

.content-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #FFF0F5;
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    padding: 20px;
}

.content-panel.active {
    opacity: 1;
    visibility: visible;
}

/* ==================== Y2K 像素风格组件 ==================== */

/* 像素边框容器 */
.pixel-box {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #FFB6C1;
    border-radius: 0;
    padding: 16px;
    margin-bottom: 16px;
}

/* 头像样式 - 通过CSS类控制 */
.avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-container-base {
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    border: 3px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
}

/* ==================== 我的页面 ==================== */
.top-avatar-circle {
    text-align: center;
    margin: 80px 0 40px 0; /* 增加顶部边距避免与返回按钮重叠 */
}

.avatar-circle-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 16px;
}

.circle-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #000000;
    box-shadow: 5px 5px 0px #FFB6C1;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
}

.avatar-label {
    font-size: 18px;
    font-weight: bold;
    color: #FF1493;
    text-shadow: 2px 2px 0px #FFB6C1;
}

.me-content {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 20px;
}

.me-section {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #FFB6C1;
    padding: 20px;
    margin-bottom: 20px;
}

.me-section h3 {
    font-size: 18px;
    font-weight: bold;
    color: #FF1493;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px dashed #FFB6C1;
}

.me-info-box p {
    font-size: 14px;
    line-height: 1.8;
    color: #000000;
    margin-bottom: 8px;
}

.me-info-box button {
    background: #FF69B4;
    color: #FFFFFF;
    border: 2px solid #000000;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 3px 3px 0px #FFB6C1;
    transition: all 0.2s;
    margin-top: 8px;
}

.me-info-box button:hover {
    background: #FF1493;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #FFB6C1;
}

.me-info-box button:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px #FFB6C1;
}

/* ==================== 面板头部 ==================== */
.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #FFB6C1;
    margin-bottom: 20px;
}

.panel-title-area {
    flex: 1;
}

.panel-note {
    font-size: 14px;
    color: #FF1493;
    font-weight: bold;
}

.panel-actions {
    display: flex;
    gap: 10px;
}

.action-icon-btn {
    background: #FF69B4;
    color: #FFFFFF;
    border: 2px solid #000000;
    width: 40px;
    height: 40px;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 3px 3px 0px #FFB6C1;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-icon-btn:hover {
    background: #FF1493;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #FFB6C1;
}

.action-icon-btn:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px #FFB6C1;
}

/* ==================== 联系人分组 ==================== */
.contacts-groups-container {
    overflow-y: auto;
    height: calc(var(--app-height, 100vh) - 120px);
}

.contact-group {
    margin-bottom: 20px;
}

.group-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 12px;
}

.group-header:hover {
    background: #FFE4E1;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #FFB6C1;
}

.group-toggle {
    font-size: 14px;
    font-weight: bold;
    transition: transform 0.3s;
}

.group-toggle.collapsed {
    transform: rotate(-90deg);
}

.group-name {
    font-size: 16px;
    font-weight: bold;
    color: #FF1493;
    flex: 1;
}

.group-count {
    font-size: 12px;
    color: #000000;
    background: #FFB6C1;
    padding: 2px 8px;
    border: 1px solid #000000;
}

.group-contacts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    padding: 0 8px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.group-contacts.expanded {
    max-height: 2000px;
}

.contact-card {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
    padding: 0;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
    position: relative;
}

.contact-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #FFB6C1;
}

.contact-card:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px #FFB6C1;
}

.contact-card-cover {
    width: 100%;
    height: 120px;
    position: relative;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
}

.contact-card-cover img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.contact-card-avatar {
    width: 60px !important;
    height: 60px !important;
    border-radius: 50%;
    margin: 0 auto 8px;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    border: 2px solid #000000;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    position: relative;
    z-index: 1;
}

.contact-card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    font-size: 0;
}

.contact-card.has-cover .contact-card-avatar {
    background: rgba(255, 255, 255, 0.9);
}

.contact-card-name {
    padding: 12px 16px;
    background: #fff;
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ==================== 动态页面 ==================== */
.moments-list {
    overflow-y: auto;
    height: calc(var(--app-height, 100vh) - 120px);
}

.moment-item {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #FFB6C1;
    padding: 16px;
    margin-bottom: 16px;
}

.moment-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.moment-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border: 2px solid #000000;
    box-shadow: 2px 2px 0px #FFB6C1;
    overflow: hidden;
}

.moment-info {
    flex: 1;
}

.moment-name {
    font-size: 16px;
    font-weight: bold;
    color: #FF1493;
    margin-bottom: 4px;
}

.moment-time {
    font-size: 12px;
    color: #000000;
}

.moment-content {
    background: #FFF0F5;
    border: 2px dashed #FFB6C1;
    padding: 16px;
    min-height: 80px;
    font-size: 14px;
    line-height: 1.6;
    color: #000000;
}

.add-moment-btn {
    position: fixed;
    bottom: 40px;
    right: 40px;
    background: #FF69B4;
    color: #FFFFFF;
    border: 2px solid #000000;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 4px 4px 0px #FFB6C1;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 50;
}

.add-moment-btn:hover {
    background: #FF1493;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #FFB6C1;
}

.add-moment-btn:active {
    transform: translate(0, 0);
    box-shadow: 3px 3px 0px #FFB6C1;
}

/* ==================== NPC页面 ==================== */
.npc-info-box {
    margin-bottom: 20px;
    padding: 16px;
    background: #FFE4E1;
    border: 2px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
    border-left: 6px solid #FF1493;
}

.npc-info-box p {
    font-size: 13px;
    line-height: 1.6;
    color: #000000;
    margin-bottom: 8px;
}

.npc-info-box p:last-child {
    margin-bottom: 0;
}

.npc-list {
    overflow-y: auto;
    height: calc(var(--app-height, 100vh) - 240px);
}

.npc-item {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #000000;
    box-shadow: 4px 4px 0px #FFB6C1;
    padding: 16px;
    margin-bottom: 16px;
}

.npc-item-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.npc-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border: 2px solid #000000;
    box-shadow: 2px 2px 0px #FFB6C1;
    overflow: hidden;
}

.npc-info {
    flex: 1;
}

.npc-name {
    font-size: 16px;
    font-weight: bold;
    color: #FF1493;
    margin-bottom: 4px;
}

.npc-relation {
    font-size: 12px;
    color: #000000;
}

.npc-actions {
    display: flex;
    gap: 8px;
}

.npc-action-btn {
    background: #FF69B4;
    color: #FFFFFF;
    border: 2px solid #000000;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 2px 2px 0px #FFB6C1;
    transition: all 0.2s;
}

.npc-action-btn:hover {
    background: #FF1493;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #FFB6C1;
}

.npc-action-btn:active {
    transform: translate(0, 0);
    box-shadow: 1px 1px 0px #FFB6C1;
}

.npc-relations-graph {
    background: #FFF0F5;
    border: 2px dashed #FFB6C1;
    padding: 12px;
    text-align: center;
}

/* ==================== 模态框 ==================== */
.npc-management-modal,
.npc-relations-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 3000;
    align-items: center;
    justify-content: center;
}

.npc-management-modal.active,
.npc-relations-modal.active {
    display: flex;
}

.npc-management-content,
.npc-relations-content {
    background: #FFFFFF;
    border: 3px solid #000000;
    box-shadow: 6px 6px 0px #FFB6C1;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.npc-relations-content {
    max-width: 800px;
}

.npc-management-header,
.npc-relations-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #FF69B4;
    border-bottom: 2px solid #000000;
}

.npc-management-header h3,
.npc-relations-header h3 {
    font-size: 18px;
    font-weight: bold;
    color: #FFFFFF;
}

.close-modal-btn {
    background: #FFFFFF;
    color: #FF1493;
    border: 2px solid #000000;
    width: 32px;
    height: 32px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.close-modal-btn:hover {
    background: #FFE4E1;
}

.npc-management-body,
.npc-relations-body {
    padding: 20px;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    color: #FF1493;
    margin-bottom: 8px;
}

.form-group input[type="text"],
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 2px solid #000000;
    background: #FFFFFF;
    font-size: 14px;
    font-family: inherit;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #FF1493;
    box-shadow: 2px 2px 0px #FFB6C1;
}

.npc-avatar-preview {
    display: flex;
    justify-content: center;
    margin: 16px 0;
}

.npc-avatar-display {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    border: 3px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
    overflow: hidden;
}

.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.btn-cancel {
    flex: 1;
    padding: 12px;
    border: 2px solid #000000;
    background: #FFFFFF;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 3px 3px 0px #FFB6C1;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background: #FFE4E1;
}

.btn-primary {
    flex: 1;
    padding: 12px;
    border: 2px solid #000000;
    background: #FF69B4;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 3px 3px 0px #FFB6C1;
    transition: all 0.2s;
}

.btn-primary:hover {
    background: #FF1493;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #FFB6C1;
}

.btn-primary:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px #FFB6C1;
}

.btn-small {
    padding: 6px 12px;
    border: 2px solid #000000;
    background: #FF69B4;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 2px 2px 0px #FFB6C1;
    transition: all 0.2s;
}

.btn-small:hover {
    background: #FF1493;
}

/* ==================== NPC关系图 ==================== */
.relations-info-box {
    background: #FFE4E1;
    border: 2px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
    padding: 12px;
    margin-bottom: 20px;
    border-left: 6px solid #FF1493;
}

.relations-info-box p {
    font-size: 13px;
    line-height: 1.6;
    color: #000000;
    margin-bottom: 4px;
}

.relations-graph-container {
    position: relative;
    min-height: 400px;
    background: #FFF0F5;
    border: 2px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
    padding: 20px;
}

.relation-node {
    position: absolute;
    cursor: pointer;
    transition: all 0.3s;
}

.relation-node:hover {
    transform: scale(1.1);
}

.relation-node.selected {
    transform: scale(1.15);
    filter: drop-shadow(0 0 8px #FF1493);
}

.relation-node-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    border: 3px solid #000000;
    box-shadow: 3px 3px 0px #FFB6C1;
    overflow: hidden;
}

.relation-node-name {
    text-align: center;
    margin-top: 4px;
    font-size: 12px;
    font-weight: bold;
    color: #000000;
}

.relation-line {
    position: absolute;
    height: 3px;
    background: #000000;
    transform-origin: left center;
    pointer-events: none;
}

.relation-line.known {
    background: #000000;
}

.relation-line.unknown {
    background: #FF1493;
    border-top: 3px dashed #FF1493;
    background: transparent;
}

.relation-label {
    position: absolute;
    background: #FFFFFF;
    padding: 4px 8px;
    border: 2px solid #000000;
    font-size: 11px;
    font-weight: bold;
    color: #FF1493;
    box-shadow: 2px 2px 0px #FFB6C1;
    pointer-events: none;
}

/* ==================== 其他页面样式 ==================== */
.page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--app-height, 100vh);
    background: #FFF0F5;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    z-index: 5000; /* 确保在主容器之上 */
}

.page.active {
    transform: translateX(0);
}

#page-chat {
    overflow: hidden;
}

.back-to-desktop-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    background: #FF69B4;
    color: #FFFFFF;
    border: 2px solid #000000;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 3px 3px 0px #FFB6C1;
    transition: all 0.2s;
    z-index: 100;
}

.back-to-desktop-btn:hover {
    background: #FF1493;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #FFB6C1;
}

/* panel-me中的返回按钮特殊处理 */
#panel-me .back-to-desktop-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 20;
}

/* ==================== 统一的Y2K像素风格表单元素 ==================== */

/* 像素风格文本区域 - 用于所有代码编辑器和长文本输入 */
.pixel-textarea {
    width: 100%;
    min-height: 150px;
    padding: 12px;
    border: 2px solid #000000;
    background: #FFFFFF;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
    box-shadow: 3px 3px 0px #FFB6C1;
    transition: all 0.2s;
}

.pixel-textarea:focus {
    outline: none;
    border-color: #FF1493;
    box-shadow: 4px 4px 0px #FFB6C1;
    transform: translate(-1px, -1px);
}

/* 代码编辑器专用样式 */
.code-editor {
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.4;
    background: #f8f9fa;
    border-left: 4px solid #FF1493;
}

/* 提示词编辑器专用样式 */
.prompt-editor-section textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid #000000;
    background: #FFFFFF;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
    box-shadow: 2px 2px 0px #FFB6C1;
    transition: all 0.2s;
}

.prompt-editor-section textarea:focus {
    outline: none;
    border-color: #000;
    box-shadow: 3px 3px 0px #FFB6C1;
}

/* 批量输入框样式 */
.bulk-input {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    background: #FFF0F5;
    border: 2px dashed #FFB6C1;
}

/* 语音识别结果框 */
.recognition-result {
    background: #FFE4E1;
    border: 2px solid #FF1493;
    font-size: 14px;
    line-height: 1.6;
}

/* 确保所有表单元素都有统一的Y2K像素风格 */
input[type="text"],
input[type="password"],
input[type="email"],
input[type="number"],
input[type="url"],
textarea,
select {
    font-family: 'Courier New', 'MS Gothic', monospace;
    border: 2px solid #000000;
    background: #FFFFFF;
    padding: 8px 12px;
    box-shadow: 2px 2px 0px #FFB6C1;
    transition: all 0.2s;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
input[type="url"]:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: #FF1493;
    box-shadow: 3px 3px 0px #FFB6C1;
    transform: translate(-1px, -1px);
}

/* ==================== 行程卡系统CSS变量 ==================== */
/* 以下变量用于自定义行程卡系统的主题样式 */
/* 可以在此处修改这些变量的值来改变行程卡的外观 */

:root {
    /* 行程卡主题色 */
    --travel-card-bg-color: rgba(255, 255, 255, 0.9);           /* 卡片背景色 */
    --travel-card-border-color: #000000;                         /* 卡片边框色 */
    --travel-card-text-color: #000000;                           /* 文字颜色 */
    --travel-card-time-color: #FF1493;                           /* 时间标签颜色 */
    --travel-card-activity-color: #FF69B4;                       /* 活动标题颜色 */
    --travel-card-shadow-color: #FFB6C1;                         /* 阴影颜色 */
    --travel-card-accent-color: #FF69B4;                         /* 强调色（按钮等） */
    --travel-card-locked-color: #CCCCCC;                         /* 锁定状态颜色 */
}

/* 响应式调整 */
@media (max-width: 768px) {
    .left-sidebar {
        width: var(--sidebar-mobile-width);
        min-width: var(--sidebar-mobile-width);
    }
    
    .sidebar-nav-item {
        padding: var(--sidebar-mobile-nav-padding);
        font-size: var(--sidebar-mobile-nav-font-size);
    }
    
    .group-contacts {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
    
    .pixel-textarea {
        font-size: 12px;
        padding: 10px;
    }
    
    .prompt-editor-section textarea {
        font-size: 12px;
        padding: 8px;
    }
}`;
}

// 打开CSS主题管理器
function openCSSThemeManager() {
    try {
        loadCSSThemes();
        
        // 加载主题列表
        const select = document.getElementById('cssThemeSelect');
        if (!select) {
            console.error('找不到cssThemeSelect元素');
            return;
        }
        
        select.innerHTML = '<option value="default">默认主题（Y2K粉色像素风）</option>';
        
        // 添加内置预设主题
        Object.values(builtinCSSThemes).forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.name;
            select.appendChild(option);
        });
        
        // 确保cssThemes是数组
        if (!Array.isArray(cssThemes)) {
            console.error('cssThemes不是数组，重置为数组');
            cssThemes = [];
        }
        
        // 添加用户自定义主题
        cssThemes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.name;
            select.appendChild(option);
        });
        
        select.value = currentCSSThemeId;
        
        // 加载当前主题的CSS
        loadCSSTheme();
    } catch (e) {
        console.error('打开CSS主题管理器出错', e);
    } finally {
        // 确保无论如何都打开弹窗
        const modal = document.getElementById('cssThemeModal');
        if (modal) {
            modal.classList.add('active');
        }
    }
}

// 关闭CSS主题管理器
function closeCSSThemeManager() {
    document.getElementById('cssThemeModal').classList.remove('active');
}

// 加载CSS主题
function loadCSSTheme() {
    const select = document.getElementById('cssThemeSelect');
    const themeId = select.value;
    const editor = document.getElementById('cssThemeEditor');
    
    if (themeId === 'default') {
        // 加载默认CSS
        const defaultCSS = getDefaultCSS();
        editor.value = defaultCSS;
    } else if (builtinCSSThemes[themeId]) {
        // 加载内置预设主题
        editor.value = builtinCSSThemes[themeId].css;
    } else {
        // 确保cssThemes是数组
        if (!Array.isArray(cssThemes)) {
            console.error('cssThemes不是数组，重置为空数组');
            cssThemes = [];
        }
        
        // 加载自定义主题
        const theme = cssThemes.find(t => t.id === themeId);
        if (theme) {
            editor.value = theme.css;
        }
    }
}

// 创建新CSS主题
function createNewCSSTheme() {
    const name = prompt('请输入新主题的名称：');
    if (!name || !name.trim()) return;
    
    // 获取当前编辑器中的CSS作为基础
    const editor = document.getElementById('cssThemeEditor');
    const baseCSS = editor.value || getDefaultCSS();
    
    const newTheme = {
        id: Date.now().toString(),
        name: name.trim(),
        css: baseCSS,
        createdAt: new Date().toISOString()
    };
    
    // 确保cssThemes是数组
    if (!Array.isArray(cssThemes)) {
        console.error('cssThemes不是数组，重置为数组');
        cssThemes = [];
    }
    
    cssThemes.push(newTheme);
    saveCSSThemes();
    
    // 刷新主题列表
    const select = document.getElementById('cssThemeSelect');
    const option = document.createElement('option');
    option.value = newTheme.id;
    option.textContent = newTheme.name;
    select.appendChild(option);
    select.value = newTheme.id;
    
    alert('新主题已创建');
}

// 删除CSS主题
function deleteCSSTheme() {
    const select = document.getElementById('cssThemeSelect');
    const themeId = select.value;
    
    if (themeId === 'default') {
        alert('无法删除默认主题');
        return;
    }
    
    // 检查是否是内置预设主题
    if (builtinCSSThemes[themeId]) {
        alert('无法删除内置预设主题');
        return;
    }
    
    // 确保cssThemes是数组
    if (!Array.isArray(cssThemes)) {
        console.error('cssThemes不是数组，重置为空数组');
        cssThemes = [];
    }
    
    const theme = cssThemes.find(t => t.id === themeId);
    if (!theme) return;
    
    if (!confirm(`确定要删除主题"${theme.name}"吗？`)) return;
    
    cssThemes = cssThemes.filter(t => t.id !== themeId);
    
    // 如果删除的是当前主题，切换到默认主题
    if (themeId === currentCSSThemeId) {
        currentCSSThemeId = 'default';
        applyCSSTheme('default');
    }
    
    saveCSSThemes();
    
    // 刷新主题列表
    select.value = 'default';
    select.querySelector(`option[value="${themeId}"]`).remove();
    loadCSSTheme();
    
    alert('主题已删除');
}

// 保存CSS主题
function saveCSSTheme() {
    const select = document.getElementById('cssThemeSelect');
    const themeId = select.value;
    const editor = document.getElementById('cssThemeEditor');
    const css = editor.value;
    
    console.log('保存CSS主题，themeId:', themeId, 'currentCSSThemeId:', currentCSSThemeId);
    
    // 确保cssThemes是数组
    if (!Array.isArray(cssThemes)) {
        console.log('cssThemes不是数组，重置为空数组');
        cssThemes = [];
    }
    
    if (themeId === 'default') {
        // 如果是默认主题，创建一个新的自定义主题
        const name = prompt('请为这个自定义主题命名：', '我的主题');
        if (!name || !name.trim()) return;
        
        const newTheme = {
            id: Date.now().toString(),
            name: name.trim(),
            css: css,
            createdAt: new Date().toISOString()
        };
        
        console.log('创建新主题:', newTheme);
        
        // 确保cssThemes是数组
        if (!Array.isArray(cssThemes)) {
            cssThemes = [];
        }
        
        cssThemes.push(newTheme);
        currentCSSThemeId = newTheme.id;
        console.log('设置currentCSSThemeId为:', currentCSSThemeId);
        
        // 添加到选择列表
        const option = document.createElement('option');
        option.value = newTheme.id;
        option.textContent = newTheme.name;
        select.appendChild(option);
        select.value = newTheme.id;
    } else {
        // 更新现有主题
        // 确保cssThemes是数组
        if (!Array.isArray(cssThemes)) {
            cssThemes = [];
        }
        
        const theme = cssThemes.find(t => t.id === themeId);
        if (theme) {
            theme.css = css;
            theme.updatedAt = new Date().toISOString();
            console.log('更新现有主题:', theme);
        }
        currentCSSThemeId = themeId;
        console.log('设置currentCSSThemeId为:', currentCSSThemeId);
    }
    
    saveCSSThemes();
    console.log('调用applyCSSTheme，参数:', currentCSSThemeId);
    applyCSSTheme(currentCSSThemeId);
    closeCSSThemeManager();
    
    alert('主题已保存并应用');
}

// 应用选中的CSS主题
function applySelectedCSSTheme() {
    const select = document.getElementById('cssThemeSelect');
    if (!select) return;
    
    const themeId = select.value;
    currentCSSThemeId = themeId;
    saveCSSThemes();
    applyCSSTheme(themeId);
    
    alert('主题已应用');
}

// 从编辑器应用CSS样式（不保存为主题）
function applyCSSThemeFromEditor() {
    const editor = document.getElementById('cssThemeEditor');
    if (!editor) return;
    
    const css = editor.value.trim();
    if (!css) {
        alert('请输入CSS代码');
        return;
    }
    
    // 移除旧的自定义样式
    const oldStyle = document.getElementById('custom-css-theme');
    if (oldStyle) {
        oldStyle.remove();
    }
    
    // 应用编辑器中的CSS
    const style = document.createElement('style');
    style.id = 'custom-css-theme';
    style.textContent = css;
    document.head.appendChild(style);
    
    alert('样式已临时应用（未保存为主题）');
}

// 应用CSS主题
function applyCSSTheme(themeId) {
    console.log('应用CSS主题，themeId:', themeId);
    // 移除旧的自定义样式
    const oldStyle = document.getElementById('custom-css-theme');
    if (oldStyle) {
        oldStyle.remove();
    }
    
    if (themeId === 'default') {
        console.log('应用默认主题');
        // 使用默认CSS（已经通过link标签加载）
        return;
    }
    
    // 检查是否是内置预设主题
    if (builtinCSSThemes[themeId]) {
        console.log('应用内置预设主题:', builtinCSSThemes[themeId].name);
        const style = document.createElement('style');
        style.id = 'custom-css-theme';
        style.textContent = builtinCSSThemes[themeId].css;
        document.head.appendChild(style);
        return;
    }
    
    // 确保cssThemes是数组
    if (!Array.isArray(cssThemes)) {
        console.error('cssThemes不是数组，重置为空数组');
        cssThemes = [];
    }
    
    // 应用自定义主题
    const theme = cssThemes.find(t => t.id === themeId);
    if (!theme) {
        console.log('未找到主题:', themeId);
        return;
    }
    
    console.log('找到主题，应用CSS');
    const style = document.createElement('style');
    style.id = 'custom-css-theme';
    style.textContent = theme.css;
    document.head.appendChild(style);
}

// 页面加载时应用保存的主题
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded，加载CSS主题');
    loadCSSThemes();
    console.log('currentCSSThemeId:', currentCSSThemeId);
    if (currentCSSThemeId !== 'default') {
        console.log('应用自定义主题');
        applyCSSTheme(currentCSSThemeId);
    } else {
        console.log('使用默认主题');
    }
});


// ==================== ����ͨ������ ====================


// ����ͨ��ȫ�ֱ���
let voiceCallActive = false;
let voiceCallStartTime = null;
let voiceCallDurationInterval = null;
let voiceCallMessages = [];
let voiceCallAudioContext = null;
let voiceCallAnalyser = null;
let voiceCallAnimationFrame = null;
let voiceCallRecognition = null;
let voiceCallIdleTimer = null;
let currentVoiceAudio = null;

// ����ͨ������
let voiceCallSettings = {
    background: '',
    enableMinimax: true,
    enableContinuousRead: false,
    chatHistoryCount: 10,
    activeMessageInterval: 30000,
    customCSS: '',
    // 不再使用 voiceCallPrompt 字段，使用统一管理系统
    // voiceCallPrompt: '', // 自定义提示词
    icons: {} // 图标设置
};

// 获取默认语音通话提示词
function getDefaultVoiceCallPrompt() {
    return `[语音通话模式]
你现在正在进行语音通话。请注意：
1. 这是语音通话，不是面对面交流，你看不到对方
2. 你的回复会被朗读出来，所以要口语化、简洁
3. 严禁使用颜文字、Emoji或视觉描述
4. 可以使用语气词（嗯、啊、那个...）让对话更自然
5. 保持自然对话风格，避免过长的回复`;
}

// ��������ͨ��
function startVoiceCall() {
    if (!currentChatContactId) {
        alert('请先选择一个联系人');
        return;
    }

    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;

    // 加载联系人的语音通话设置
    loadVoiceCallSettings(contact);

    voiceCallActive = true;
    voiceCallStartTime = Date.now();
    voiceCallMessages = [];

    const voiceCallPage = document.getElementById('page-voice-call');
    const voiceCallAvatar = document.getElementById('voiceCallAvatar');
    const voiceCallName = document.getElementById('voiceCallName');

    if (contact.avatarUrl) {
        voiceCallAvatar.src = contact.avatarUrl;
    }

    voiceCallName.textContent = contact.nickname || contact.name;

    // 应用自定义图标
    applyVoiceCallIcons();

    openPage('page-voice-call');
    startVoiceCallDuration();
    initVoiceCallVisualizer();

    console.log('语音通话已启动');
}



// ��������ͨ��
function endVoiceCall() {
    if (!voiceCallActive) return;

    // 停止当前播放的音频
    if (currentVoiceAudio) {
        currentVoiceAudio.pause();
        currentVoiceAudio = null;
    }

    // 停止并清理语音识别实例
    if (voiceCallRecognition) {
        try {
            voiceCallRecognition.stop();
        } catch (e) {
            console.log('⚠️ [语音识别] 停止识别时出错:', e);
        }
    }

    // 清除计时器
    if (voiceCallDurationInterval) {
        clearInterval(voiceCallDurationInterval);
        voiceCallDurationInterval = null;
    }

    const voiceCallPage = document.getElementById('page-voice-call');
    voiceCallPage.classList.add('voice-call-ending');

    setTimeout(() => {
        saveVoiceCallRecord();

        // 清空消息容器
        const messagesContainer = document.getElementById('voiceCallMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }

        voiceCallPage.classList.remove('voice-call-ending');
        voiceCallActive = false;

        // 返回聊天页面
        voiceCallPage.classList.remove('active');
        voiceCallPage.style.display = 'none';

        const chatPage = document.getElementById('page-chat');
        if (chatPage) {
            chatPage.classList.add('active');
            chatPage.style.display = 'block';
            // 刷新聊天消息以显示通话记录
            renderChatMessages();
        }
        
        console.log('✅ [语音通话] 通话已结束');
    }, 500);
}

// 加载语音通话设置
function loadVoiceCallSettings(contact) {
    if (contact.voiceCallSettings) {
        voiceCallSettings = { ...voiceCallSettings, ...contact.voiceCallSettings };
        console.log('✅ [语音通话] 已加载联系人设置:', voiceCallSettings);
    } else {
        // 初始化默认设置
        contact.voiceCallSettings = { ...voiceCallSettings };
        saveContacts();
        console.log('📝 [语音通话] 初始化默认设置');
    }
}

// 应用语音通话图标
function applyVoiceCallIcons() {
    if (!voiceCallSettings.icons) return;

    // 返回按钮
    const backBtn = document.querySelector('#page-voice-call .voice-call-back-btn');
    if (backBtn && voiceCallSettings.icons.back) {
        const icon = voiceCallSettings.icons.back;
        if (icon.type === 'text') {
            backBtn.textContent = icon.value;
        } else {
            backBtn.innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
        }
    }

    // 设置按钮
    const settingsBtn = document.querySelector('#page-voice-call .voice-call-settings-btn');
    if (settingsBtn && voiceCallSettings.icons.settings) {
        const icon = voiceCallSettings.icons.settings;
        if (icon.type === 'text') {
            settingsBtn.textContent = icon.value;
        } else {
            settingsBtn.innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
        }
    }

    // 挂断按钮
    const hangupBtn = document.querySelector('#page-voice-call .voice-call-hangup-btn');
    if (hangupBtn && voiceCallSettings.icons.hangup) {
        const icon = voiceCallSettings.icons.hangup;
        if (icon.type === 'text') {
            hangupBtn.textContent = icon.value;
        } else {
            hangupBtn.innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
        }
    }
}


// ����ͨ����¼
function saveVoiceCallRecord() {
    if (!currentChatContactId || voiceCallMessages.length === 0) return;
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    const duration = Math.floor((Date.now() - voiceCallStartTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const durationText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // 检查是否启用双语模式
    const isBilingual = contact?.bilingualSettings?.enabled;
    
    // 构建完整的通话内容（AI视角）
    const fullContent = voiceCallMessages.map(msg => {
        const role = msg.role === 'user' ? 'User' : (contact.nickname || contact.name);
        let messageText = msg.message;
        
        // 双语模式：只保存母语部分（去除<translate>标签）
        if (isBilingual && messageText.includes('<translate>')) {
            // 提取母语部分（<translate>之前的内容）
            const parts = messageText.split('<translate>');
            messageText = parts[0].trim();
        }
        
        return `[${role}]: ${messageText}`;
    }).join('\n');
    
    // 用户视角：只显示"通话结束 时间"
    const displayText = `通话结束 ${durationText}`;
    
    const callRecord = {
        id: Date.now(),
        role: 'system_call',
        sender: 'system',
        message: fullContent,  // AI视角：完整通话内容（双语模式下只有母语）
        display_text: displayText,  // 用户视角：简短显示
        timestamp: new Date().toISOString(),
        duration: duration,
        type: 'voice_call',  // 标记为语音通话记录
        messages: voiceCallMessages  // 保留原始消息用于详情查看
    };
    
    if (!contact.chat_history) {
        contact.chat_history = [];
    }
    contact.chat_history.push(callRecord);
    
    saveContacts();
    
    console.log('✅ [语音通话] 通话记录已保存:', {
        显示文本: displayText,
        完整内容长度: fullContent.length,
        消息数量: voiceCallMessages.length,
        双语模式: isBilingual
    });
}

// 通话计时
function startVoiceCallDuration() {
    const durationEl = document.getElementById('voiceCallDuration');
    
    voiceCallDurationInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - voiceCallStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        durationEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// ��ʼ���������ӻ�
function initVoiceCallVisualizer() {
    const canvas = document.getElementById('voiceCallWaveform');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 800;
    canvas.height = 200;

    const barCount = 80;
    const barWidth = 4;
    const barGap = 2;
    const bars = [];

    // 初始化条形数据
    for (let i = 0; i < barCount; i++) {
        bars.push({
            height: Math.random() * 0.3 + 0.1,
            speed: Math.random() * 0.02 + 0.01,
            phase: Math.random() * Math.PI * 2
        });
    }

    function draw() {
        if (!voiceCallActive) return;

        requestAnimationFrame(draw);

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 计算起始位置使波形居中
        const totalWidth = barCount * (barWidth + barGap);
        const startX = (canvas.width - totalWidth) / 2;

        // 绘制每个条形
        for (let i = 0; i < barCount; i++) {
            const bar = bars[i];

            // 更新高度（正弦波动画）
            bar.phase += bar.speed;
            const heightMultiplier = Math.sin(bar.phase) * 0.3 + 0.7;
            const barHeight = bar.height * canvas.height * heightMultiplier;

            const x = startX + i * (barWidth + barGap);
            const y = (canvas.height - barHeight) / 2;

            // 创建渐变
            const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
        }
    }

    draw();
}


// ��������ͨ����Ϣ
function sendVoiceCallMessage() {
    const input = document.getElementById('voiceCallInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const userMsg = {
        id: Date.now(),
        role: 'user',
        message: message,
        timestamp: Date.now()
    };
    
    voiceCallMessages.push(userMsg);
    renderVoiceCallMessage(userMsg);
    
    input.value = '';
    
    getVoiceCallAIResponse(message);
}

// ���������¼�
function handleVoiceCallKeyPress(event) {
    if (event.key === 'Enter') {
        sendVoiceCallMessage();
    }
}

// ��Ⱦ��Ϣ
function renderVoiceCallMessage(msg) {
    const container = document.getElementById('voiceCallMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `voice-call-message ${msg.role === 'user' ? 'sent' : 'received'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'voice-call-bubble';
    
    // 检查是否启用双语模式
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    const isBilingual = contact?.bilingualSettings?.enabled && msg.role !== 'user';
    
    if (isBilingual && msg.message.includes('<translate>')) {
        // 双语模式：提取母语和中文翻译
        const parts = msg.message.split('<translate>');
        let nativeText = parts[0].trim();  // 母语（标签外）
        const translateMatch = parts[1]?.match(/^(.*?)<\/translate>/);
        const translation = translateMatch ? translateMatch[1].trim() : '';  // 中文翻译（标签内）
        
        // 移除 [VOICE:xxx] 标签（如果存在）
        nativeText = nativeText.replace(/^\[VOICE:[^\]]+\]\s*/i, '');
        
        // 默认显示母语
        bubble.textContent = nativeText;
        bubble.classList.add('bilingual-message');
        
        // 添加点击事件切换显示翻译
        bubble.style.cursor = 'pointer';
        bubble.title = '点击查看中文翻译';
        bubble.onclick = () => {
            if (bubble.classList.contains('show-translation')) {
                // 当前显示翻译，切换回母语
                bubble.textContent = nativeText;
                bubble.classList.remove('show-translation');
                bubble.title = '点击查看中文翻译';
            } else {
                // 当前显示母语，切换到翻译
                bubble.textContent = translation;
                bubble.classList.add('show-translation');
                bubble.title = '点击查看原文';
            }
        };
        
        console.log('🌐 [语音通话] 双语消息:', { 母语: nativeText, 中文翻译: translation });
    } else {
        // 普通模式 - 移除 [VOICE:xxx] 标签
        let displayText = msg.message;
        displayText = displayText.replace(/^\[VOICE:[^\]]+\]\s*/i, '');
        bubble.textContent = displayText;
    }
    
    messageDiv.appendChild(bubble);
    
    if (msg.role !== 'user' && voiceCallSettings.enableMinimax) {
        const playBtn = document.createElement('button');
        playBtn.className = 'voice-play-btn';
        playBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        playBtn.onclick = () => playVoiceMessage(msg);
        messageDiv.appendChild(playBtn);
    }
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// 获取AI回复
async function getVoiceCallAIResponse(userMessage) {
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;

    document.getElementById('voiceCallStatus').textContent = '正在回复...';

    // 开始头像闪烁
    const avatar = document.getElementById('voiceCallAvatar');
    avatar.classList.add('voice-call-thinking');

    try {
        // 优先使用联系人的API配置，否则使用全局配置
        let apiUrl, apiKey, model;
        
        console.log('🔍 [语音通话] 当前联系人:', contact.name, 'API方案ID:', contact.apiScheme);
        
        if (contact.apiScheme) {
            // 使用联系人的API方案
            const schemes = getStorageJSON('vibe_api_schemes', []);
            console.log('📋 [语音通话] 所有API方案:', schemes);
            
            const scheme = schemes.find(s => s.id === contact.apiScheme);
            
            if (scheme) {
                apiUrl = scheme.apiUrl;
                apiKey = scheme.apiKey;
                model = scheme.model;
                console.log('✅ [语音通话] 使用联系人API方案:', scheme.name, '模型:', model);
            } else {
                console.warn('⚠️ [语音通话] 联系人API方案不存在(ID:' + contact.apiScheme + ')');
            }
        }
        
        // 如果没有方案，使用全局配置
        if (!apiUrl) {
            apiUrl = localStorage.getItem('apiUrl');
            apiKey = localStorage.getItem('apiKey');
            model = contact.model || localStorage.getItem('selectedModel');
            console.log('🌐 [语音通话] 使用全局API配置');
        }
        
        // 检查API配置
        if (!apiUrl || !apiKey) {
            throw new Error('请先在设置中配置API，或为该联系人配置专属API方案');
        }

        // 构建系统提示词（使用与聊天页面相同的逻辑，但添加语音通话特殊规则）
        let systemPrompt = buildTimezoneAwarePrompt(contact, userMessage);
        
        // 使用统一提示词管理系统
        const voiceCallRules = getCurrentPrompt('voiceCall');
        console.log('📝 [语音通话] 使用提示词方案:', promptSchemes[currentPromptSchemeId].name);
        
        systemPrompt = voiceCallRules + '\n\n' + systemPrompt;
        
        // 添加结构化记忆内容
        const smVoiceText = formatStructuredMemory(contact);
        if (smVoiceText) {
            systemPrompt += '\n\n' + smVoiceText;
        }

        console.log('📝 [语音通话] 系统提示词:', systemPrompt.substring(0, 300) + '...');
        console.log('📝 [语音通话] 完整系统提示词:', systemPrompt);

        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...voiceCallMessages.slice(-10).map(m => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.message
            })),
            {
                role: 'user',
                content: userMessage
            }
        ];

        // 读取温度配置
        let temperature = null;
        const schemes = getStorageJSON('vibe_api_schemes', []);
        if (contact.apiScheme) {
            const scheme = schemes.find(s => s.id === contact.apiScheme);
            if (scheme && typeof scheme.temperature === 'number') {
                temperature = scheme.temperature;
            }
        }
        if (temperature === null) {
            const storedTemp = localStorage.getItem('apiTemperature');
            const tempNum = storedTemp ? parseFloat(storedTemp) : NaN;
            if (!isNaN(tempNum)) {
                temperature = tempNum;
            }
        }

        console.log('📤 [语音通话] 发送API请求:', apiUrl, '模型:', model, '温度:', temperature ?? 0.8);

        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'gpt-3.5-turbo',
                messages: messages,
                temperature: (typeof temperature === 'number') ? temperature : 0.8
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败 (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('📥 [语音通话] API返回数据:', data);
        
        // 尝试从不同的API格式中提取回复
        let aiReply = null;
        
        // OpenAI格式
        if (data.choices && data.choices[0] && data.choices[0].message) {
            aiReply = data.choices[0].message.content;
            console.log('✅ [语音通话] 使用OpenAI格式');
        }
        // Gemini格式
        else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            if (parts && parts[0] && parts[0].text) {
                aiReply = parts[0].text;
                console.log('✅ [语音通话] 使用Gemini格式');
            }
        }
        // Claude格式
        else if (data.content && data.content[0] && data.content[0].text) {
            aiReply = data.content[0].text;
            console.log('✅ [语音通话] 使用Claude格式');
        }
        // 简单文本格式
        else if (data.text) {
            aiReply = data.text;
            console.log('✅ [语音通话] 使用简单文本格式 (text)');
        }
        else if (data.response) {
            aiReply = data.response;
            console.log('✅ [语音通话] 使用简单文本格式 (response)');
        }
        
        // 如果所有格式都不匹配
        if (!aiReply) {
            console.error('❌ [语音通话] 无法识别的API返回格式:', JSON.stringify(data, null, 2));
            throw new Error('API返回数据格式不支持\n\n请检查：\n1. API端点是否正确\n2. 模型名称是否正确\n3. 查看控制台了解详细的返回数据');
        }

        const aiMsg = {
            id: Date.now(),
            role: 'assistant',
            message: aiReply,
            timestamp: Date.now()
        };

        voiceCallMessages.push(aiMsg);
        renderVoiceCallMessage(aiMsg);

        document.getElementById('voiceCallStatus').textContent = '通话中...';

        // 停止头像闪烁
        avatar.classList.remove('voice-call-thinking');

        if (voiceCallSettings.enableContinuousRead) {
            playVoiceMessage(aiMsg);
        }

    } catch (error) {
        console.error('❌ [语音通话] AI回复失败:', error);
        document.getElementById('voiceCallStatus').textContent = '回复失败: ' + error.message;
        
        // 显示错误提示
        alert('AI回复失败：\n' + error.message + '\n\n请检查：\n1. API配置是否正确\n2. 网络连接是否正常\n3. API余额是否充足');

        // 停止头像闪烁
        avatar.classList.remove('voice-call-thinking');
    }
}


// ����������Ϣ
async function playVoiceMessage(msg) {
    if (!voiceCallSettings.enableMinimax) return;
    
    // 如果消息已有缓存的音频，直接播放
    if (msg.audioDataUrl) {
        console.log('🔊 [语音通话] 使用缓存的音频');
        if (currentVoiceAudio) {
            currentVoiceAudio.pause();
            currentVoiceAudio = null;
        }
        
        const audio = new Audio(msg.audioDataUrl);
        currentVoiceAudio = audio;
        audio.play();
        
        audio.onended = () => {
            currentVoiceAudio = null;
        };
        return;
    }
    
    if (currentVoiceAudio) {
        currentVoiceAudio.pause();
        currentVoiceAudio = null;
    }
    
    try {
        const contact = vibeContacts.find(c => c.id === currentChatContactId);
        
        // 读取MiniMax配置（全局设置）
        const minimaxConfig = getStorageJSON('minimax_config', {});
        
        console.log('🔊 [语音通话] MiniMax配置:', {
            enabled: minimaxConfig.enabled,
            hasApiKey: !!minimaxConfig.apiKey,
            baseUrl: minimaxConfig.baseUrl,
            model: minimaxConfig.model
        });
        
        // 读取联系人的TTS设置
        const ttsSettings = contact?.ttsSettings || {};
        const voiceId = ttsSettings.voiceId || 'female-shaonv';
        const language = ttsSettings.language || 'zh';
        const speed = ttsSettings.speed || 1.0;
        
        console.log('🔊 [语音通话] 联系人TTS设置:', {
            voiceId,
            language,
            speed,
            ttsEnabled: ttsSettings.enabled
        });
        
        // 处理双语模式：只朗读母语部分（<translate>标签外的内容）
        let textToSpeak = msg.message;
        const isBilingual = contact?.bilingualSettings?.enabled;
        
        if (isBilingual && msg.message.includes('<translate>')) {
            // 提取母语部分（<translate>标签之前的内容）
            // 例如：「こんにちは<translate>你好</translate>」 → 只读「こんにちは」
            const parts = msg.message.split('<translate>');
            if (parts.length > 0) {
                textToSpeak = parts[0].trim();
                console.log('🌐 [语音通话] 双语模式：只朗读母语（非中文）', {
                    完整消息: msg.message.substring(0, 80) + '...',
                    朗读内容: textToSpeak
                });
            }
        }
        
        // 移除 [VOICE:xxx] 标签，避免被朗读出来
        textToSpeak = textToSpeak.replace(/^\[VOICE:[^\]]+\]\s*/i, '');
        
        console.log('🔊 [语音通话] 最终朗读文本:', textToSpeak);
        
        // 生成音频
        const audioDataUrl = await generateTtsAudio(
            textToSpeak,  // 使用处理后的文本
            'happy',
            voiceId,
            language,
            speed,
            minimaxConfig
        );
        
        // 缓存音频到消息对象
        msg.audioDataUrl = audioDataUrl;
        console.log('✅ [语音通话] 音频已缓存到消息对象');
        
        const audio = new Audio(audioDataUrl);
        currentVoiceAudio = audio;
        
        audio.play();
        
        audio.onended = () => {
            currentVoiceAudio = null;
        };
        
    } catch (error) {
        console.error('❌ [语音通话] 播放语音失败:', error);
        alert('播放语音失败：' + error.message);
    }
}

// ��������
function startVoiceInput() {
    const indicator = document.getElementById('voiceRecognitionIndicator');
    indicator.classList.add('active');
    
    try {
        // 如果实例不存在，创建新实例
        if (!voiceCallRecognition) {
            console.log('🎤 [语音识别] 创建新的识别实例');
            
            voiceCallRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            voiceCallRecognition.lang = 'zh-CN';
            voiceCallRecognition.continuous = false;
            voiceCallRecognition.interimResults = false;
            
            voiceCallRecognition.onstart = () => {
                console.log('✅ [语音识别] 已启动');
            };
            
            voiceCallRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('voiceCallInput').value = transcript;
                console.log('✅ [语音识别] 识别结果:', transcript);
            };
            
            voiceCallRecognition.onerror = (event) => {
                console.error('❌ [语音识别] 错误:', event.error);
                indicator.classList.remove('active');
                
                // 如果是权限错误，提示用户
                if (event.error === 'not-allowed') {
                    alert('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问');
                    // 清除实例，下次重新创建
                    voiceCallRecognition = null;
                } else if (event.error === 'no-speech') {
                    console.log('⚠️ [语音识别] 未检测到语音');
                } else if (event.error === 'aborted') {
                    console.log('⚠️ [语音识别] 识别被中止');
                }
            };
            
            voiceCallRecognition.onend = () => {
                console.log('🔚 [语音识别] 已结束');
                indicator.classList.remove('active');
            };
        }
        
        // 启动识别（复用现有实例）
        console.log('🎤 [语音识别] 启动识别');
        voiceCallRecognition.start();
        
    } catch (error) {
        console.error('❌ [语音识别] 启动失败:', error);
        indicator.classList.remove('active');
        
        // 如果启动失败，可能是实例状态问题，清除并重试
        if (error.name === 'InvalidStateError') {
            console.log('⚠️ [语音识别] 实例状态错误，清除实例');
            voiceCallRecognition = null;
            // 不自动重试，让用户再次按下按钮
        } else {
            alert('启动语音识别失败：' + error.message);
        }
    }
}

function stopVoiceInput() {
    const indicator = document.getElementById('voiceRecognitionIndicator');
    indicator.classList.remove('active');

    if (voiceCallRecognition) {
        try {
            voiceCallRecognition.stop();
            console.log('🛑 [语音识别] 手动停止');
        } catch (e) {
            console.error('停止语音识别失败:', e);
        }
    }
}


// ���ù���
function openVoiceCallSettings() {
    document.getElementById('voiceCallSettingsModal').classList.add('active');
}

function closeVoiceCallSettings() {
    document.getElementById('voiceCallSettingsModal').classList.remove('active');
}

// 重置语音通话提示词（已废弃，使用统一提示词管理系统）
function resetVoiceCallPrompt() {
    alert('提示词管理已迁移到统一管理系统。\n请前往"我"页面 → "AI提示词管理"进行设置。');
}

function saveVoiceCallSettings() {
    voiceCallSettings.background = document.getElementById('voiceCallBackground').value;
    voiceCallSettings.enableMinimax = document.getElementById('voiceCallEnableMinimax').checked;
    voiceCallSettings.enableContinuousRead = document.getElementById('voiceCallContinuousRead').checked;
    voiceCallSettings.chatHistoryCount = parseInt(document.getElementById('voiceCallHistoryCount').value);
    voiceCallSettings.activeMessageInterval = parseInt(document.getElementById('voiceCallActiveInterval').value) * 1000;
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (contact) {
        contact.voiceCallSettings = voiceCallSettings;
        saveContacts();
    }
    
    closeVoiceCallSettings();
    alert('设置已保存');
}

// 打开外观设置
function openVoiceCallAppearance() {
    const modal = document.getElementById('voiceCallAppearanceModal');
    const textarea = document.getElementById('voiceCallCustomCSS');
    
    // 加载当前自定义CSS
    textarea.value = voiceCallSettings.customCSS || '';
    
    // 显示默认CSS参考（包含完整的语音通话样式）
    const defaultCSS = `/* 语音通话完整样式参考 */
/* 这里列出了所有可以自定义的样式，每个属性都有详细说明 */

/* ========== 1. 语音通话页面整体背景 ========== */
#page-voice-call {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 渐变背景（紫色） */
    /* 可以改成：
    background: #FFB6C1;                    纯色背景（粉色）
    background-image: url('图片URL');       背景图片
    background-size: cover;                 图片填充方式
    */
}

/* ========== 2. 语音通话头部区域 ========== */
.voice-call-header {
    padding: 20px;                          /* 内边距 */
    display: flex;                          /* 弹性布局 */
    align-items: center;                    /* 垂直居中 */
    justify-content: space-between;         /* 两端对齐 */
    /* 可以改成：
    background: rgba(0, 0, 0, 0.3);         半透明黑色背景
    border-bottom: 2px solid #FFFFFF;       底部边框
    */
}

/* ========== 3. 头像样式 ========== */
.voice-call-avatar {
    width: 80px;                            /* 宽度 */
    height: 80px;                           /* 高度 */
    border-radius: 50%;                     /* 圆形（50%） */
    border: 3px solid rgba(255, 255, 255, 0.8); /* 白色边框 */
    /* 可以改成：
    border: 5px solid #FFB6C1;              粉色边框
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);  阴影效果
    */
}

/* ========== 4. 姓名和时长文字 ========== */
.voice-call-name {
    font-size: 20px;                        /* 字体大小 */
    font-weight: 600;                       /* 字体粗细（600=半粗体） */
    color: #FFFFFF;                         /* 文字颜色（白色） */
}

.voice-call-duration {
    font-size: 14px;                        /* 字体大小 */
    color: rgba(255, 255, 255, 0.9);        /* 文字颜色（半透明白色） */
}

/* ========== 5. 声波可视化区域 ========== */
.voice-call-visualizer {
    flex: 1;                                /* 占据剩余空间 */
    display: flex;                          /* 弹性布局 */
    align-items: center;                    /* 垂直居中 */
    justify-content: center;                /* 水平居中 */
}

/* ========== 6. 消息气泡样式 ========== */
/* 接收的消息（对方发的） */
.voice-call-message.received .voice-call-bubble {
    background: rgba(255, 255, 255, 0.9);   /* 背景颜色（白色半透明） */
    color: #333;                            /* 文字颜色（深灰色） */
    border-bottom-left-radius: 4px;         /* 左下角小圆角 */
    /* 可以改成：
    background: #FFE4E9;                    粉色背景
    border: 2px solid #FFB6C1;              粉色边框
    */
}

/* 发送的消息（自己发的） */
.voice-call-message.sent .voice-call-bubble {
    background: rgba(102, 126, 234, 0.9);   /* 背景颜色（蓝紫色半透明） */
    color: #FFFFFF;                         /* 文字颜色（白色） */
    border-bottom-right-radius: 4px;        /* 右下角小圆角 */
}

/* ========== 7. 双语气泡特殊样式 ========== */
.voice-call-bubble.bilingual-message {
    border: 2px solid rgba(102, 126, 234, 0.3); /* 边框（蓝紫色半透明） */
}

/* ========== 8. 播放按钮样式 ========== */
.voice-play-btn {
    width: 24px;                            /* 宽度 */
    height: 24px;                           /* 高度 */
    background: transparent;                /* 透明背景 */
    border: 2px solid rgba(255, 255, 255, 0.6); /* 白色边框 */
    border-radius: 50%;                     /* 圆形 */
    color: rgba(255, 255, 255, 0.9);        /* 图标颜色 */
}

/* ========== 9. 挂断按钮样式 ========== */
.voice-call-hangup-btn {
    width: 56px;                            /* 宽度 */
    height: 56px;                           /* 高度 */
    background: linear-gradient(135deg, #ff6b6b, #ee5a6f); /* 渐变背景（红色） */
    border-radius: 50%;                     /* 圆形 */
    /* 可以改成：
    background: #FF0000;                    纯红色
    box-shadow: 0 4px 12px rgba(255,0,0,0.4); 红色阴影
    */
}
    color: #FFFFFF;
}`;
    
    document.getElementById('voiceCallDefaultCSS').textContent = defaultCSS;
    
    modal.classList.add('active');
}

function closeVoiceCallAppearance() {
    document.getElementById('voiceCallAppearanceModal').classList.remove('active');
}

function saveVoiceCallAppearance() {
    voiceCallSettings.customCSS = document.getElementById('voiceCallCustomCSS').value;
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (contact) {
        contact.voiceCallSettings = voiceCallSettings;
        saveContacts();
    }
    
    applyVoiceCallCustomCSS(voiceCallSettings.customCSS);
    closeVoiceCallAppearance();
    alert('外观已保存');
}

function applyVoiceCallCustomCSS(css) {
    let styleEl = document.getElementById('voiceCallCustomStyle');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'voiceCallCustomStyle';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
}

// 重新生成回复
function regenerateLastVoiceReply() {
    if (voiceCallMessages.length < 2) return;
    
    const lastUserMsg = [...voiceCallMessages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    
    const lastAIIndex = voiceCallMessages.findLastIndex(m => m.role === 'assistant');
    if (lastAIIndex !== -1) {
        voiceCallMessages.splice(lastAIIndex, 1);
        const container = document.getElementById('voiceCallMessages');
        container.removeChild(container.lastChild);
    }
    
    getVoiceCallAIResponse(lastUserMsg.message);
}



// ==================== 语音通话图标设置函数 ====================

// 返回按钮图标设置
function setVoiceBackIconText() {
    const text = document.getElementById('voiceBackIconText').value.trim();
    if (!text) return;
    
    if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
    voiceCallSettings.icons.back = { type: 'text', value: text };
    document.getElementById('currentVoiceBackIcon').textContent = text;
}

function setVoiceBackIconUrl() {
    const url = document.getElementById('voiceBackIconUrl').value.trim();
    if (!url) return;
    
    if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
    voiceCallSettings.icons.back = { type: 'image', value: url };
    document.getElementById('currentVoiceBackIcon').innerHTML = `<img src="${url}" style="width: 20px; height: 20px; object-fit: contain;">`;
}

function uploadVoiceBackIcon() {
    document.getElementById('voiceBackIconFile').click();
}

function handleVoiceBackIconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const url = e.target.result;
        if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
        voiceCallSettings.icons.back = { type: 'image', value: url };
        document.getElementById('currentVoiceBackIcon').innerHTML = `<img src="${url}" style="width: 20px; height: 20px; object-fit: contain;">`;
    };
    reader.readAsDataURL(file);
}

// 设置按钮图标设置
function setVoiceSettingsIconText() {
    const text = document.getElementById('voiceSettingsIconText').value.trim();
    if (!text) return;
    
    if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
    voiceCallSettings.icons.settings = { type: 'text', value: text };
    document.getElementById('currentVoiceSettingsIcon').textContent = text;
}

function setVoiceSettingsIconUrl() {
    const url = document.getElementById('voiceSettingsIconUrl').value.trim();
    if (!url) return;
    
    if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
    voiceCallSettings.icons.settings = { type: 'image', value: url };
    document.getElementById('currentVoiceSettingsIcon').innerHTML = `<img src="${url}" style="width: 20px; height: 20px; object-fit: contain;">`;
}

function uploadVoiceSettingsIcon() {
    document.getElementById('voiceSettingsIconFile').click();
}

function handleVoiceSettingsIconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const url = e.target.result;
        if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
        voiceCallSettings.icons.settings = { type: 'image', value: url };
        document.getElementById('currentVoiceSettingsIcon').innerHTML = `<img src="${url}" style="width: 20px; height: 20px; object-fit: contain;">`;
    };
    reader.readAsDataURL(file);
}

// 挂断按钮图标设置
function setVoiceHangupIconText() {
    const text = document.getElementById('voiceHangupIconText').value.trim();
    if (!text) return;
    
    if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
    voiceCallSettings.icons.hangup = { type: 'text', value: text };
    document.getElementById('currentVoiceHangupIcon').textContent = text;
}

function setVoiceHangupIconUrl() {
    const url = document.getElementById('voiceHangupIconUrl').value.trim();
    if (!url) return;
    
    if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
    voiceCallSettings.icons.hangup = { type: 'image', value: url };
    document.getElementById('currentVoiceHangupIcon').innerHTML = `<img src="${url}" style="width: 20px; height: 20px; object-fit: contain;">`;
}

function uploadVoiceHangupIcon() {
    document.getElementById('voiceHangupIconFile').click();
}

function handleVoiceHangupIconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const url = e.target.result;
        if (!voiceCallSettings.icons) voiceCallSettings.icons = {};
        voiceCallSettings.icons.hangup = { type: 'image', value: url };
        document.getElementById('currentVoiceHangupIcon').innerHTML = `<img src="${url}" style="width: 20px; height: 20px; object-fit: contain;">`;
    };
    reader.readAsDataURL(file);
}


// ==================== 语音通话设置函数（新版本，替换旧版本） ====================

// 打开语音通话设置（新版本）
function openVoiceCallSettingsNew() {
    const modal = document.getElementById('voiceCallSettingsModal');
    modal.classList.add('active');
    
    // 加载当前设置到表单
    document.getElementById('voiceCallBackground').value = voiceCallSettings.background || '';
    document.getElementById('voiceCallEnableMinimax').checked = voiceCallSettings.enableMinimax !== false;
    document.getElementById('voiceCallContinuousRead').checked = voiceCallSettings.enableContinuousRead || false;
    document.getElementById('voiceCallHistoryCount').value = voiceCallSettings.chatHistoryCount || 10;
    document.getElementById('voiceCallActiveInterval').value = (voiceCallSettings.activeMessageInterval || 30000) / 1000;
    
    // 不再加载提示词到 DOM，使用统一管理系统
    // 提示词现在通过 getCurrentPrompt('voiceCall') 获取
    
    console.log('📝 [语音通话] 打开设置，使用提示词方案:', promptSchemes[currentPromptSchemeId].name);
}

// 保存语音通话设置（新版本）
function saveVoiceCallSettingsNew() {
    voiceCallSettings.background = document.getElementById('voiceCallBackground').value;
    voiceCallSettings.enableMinimax = document.getElementById('voiceCallEnableMinimax').checked;
    voiceCallSettings.enableContinuousRead = document.getElementById('voiceCallContinuousRead').checked;
    voiceCallSettings.chatHistoryCount = parseInt(document.getElementById('voiceCallHistoryCount').value);
    voiceCallSettings.activeMessageInterval = parseInt(document.getElementById('voiceCallActiveInterval').value) * 1000;
    // 不再保存提示词，使用统一管理系统
    // voiceCallSettings.voiceCallPrompt = document.getElementById('voiceCallPromptInput').value.trim();
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (contact) {
        contact.voiceCallSettings = { ...voiceCallSettings };
        saveContacts();
        console.log('✅ [语音通话] 设置已保存:', voiceCallSettings);
    }
    
    closeVoiceCallSettings();
    alert('设置已保存');
}

// 打开语音通话外观设置（新版本）
function openVoiceCallAppearanceNew() {
    const modal = document.getElementById('voiceCallAppearanceModal');
    const textarea = document.getElementById('voiceCallCustomCSS');
    
    // 加载当前自定义CSS
    textarea.value = voiceCallSettings.customCSS || '';
    
    // 加载图标设置
    if (voiceCallSettings.icons) {
        if (voiceCallSettings.icons.back) {
            const icon = voiceCallSettings.icons.back;
            if (icon.type === 'text') {
                document.getElementById('currentVoiceBackIcon').textContent = icon.value;
            } else {
                document.getElementById('currentVoiceBackIcon').innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
        if (voiceCallSettings.icons.settings) {
            const icon = voiceCallSettings.icons.settings;
            if (icon.type === 'text') {
                document.getElementById('currentVoiceSettingsIcon').textContent = icon.value;
            } else {
                document.getElementById('currentVoiceSettingsIcon').innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
        if (voiceCallSettings.icons.hangup) {
            const icon = voiceCallSettings.icons.hangup;
            if (icon.type === 'text') {
                document.getElementById('currentVoiceHangupIcon').textContent = icon.value;
            } else {
                document.getElementById('currentVoiceHangupIcon').innerHTML = `<img src="${icon.value}" style="width: 20px; height: 20px; object-fit: contain;">`;
            }
        }
    }
    
    // 显示默认CSS参考（更新为最新的语音通话样式）
    const defaultCSS = `/* 语音通话完整样式参考 */
/* 这里列出了所有可以自定义的样式，每个属性都有详细说明 */

/* ========== 1. 语音通话页面整体背景 ========== */
#page-voice-call {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 渐变背景（紫色） */
    display: flex;                          /* 弹性布局 */
    flex-direction: column;                 /* 垂直排列 */
    /* 可以改成：
    background: #FFB6C1;                    纯色背景（粉色）
    background-image: url('图片URL');       背景图片
    background-size: cover;                 图片填充方式
    */
}

/* ========== 2. 语音通话头部区域 ========== */
.voice-call-header {
    padding: 20px;                          /* 内边距 */
    display: flex;                          /* 弹性布局 */
    align-items: center;                    /* 垂直居中 */
    justify-content: space-between;         /* 两端对齐 */
    background: rgba(255, 255, 255, 0.1);   /* 半透明白色背景 */
    /* 可以改成：
    background: rgba(0, 0, 0, 0.3);         半透明黑色背景
    border-bottom: 2px solid #FFFFFF;       底部边框
    */
}

/* ========== 3. 头像样式 ========== */
.voice-call-avatar {
    width: 80px;                            /* 宽度 */
    height: 80px;                           /* 高度 */
    border-radius: 50%;                     /* 圆形（50%） */
    border: 3px solid rgba(255, 255, 255, 0.8); /* 白色边框 */
    object-fit: cover;                      /* 图片填充方式 */
    /* 可以改成：
    border: 5px solid #FFB6C1;              粉色边框
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);  阴影效果
    */
}

/* ========== 4. 姓名和时长文字 ========== */
.voice-call-name {
    font-size: 20px;                        /* 字体大小 */
    font-weight: 600;                       /* 字体粗细（600=半粗体） */
    color: #FFFFFF;                         /* 文字颜色（白色） */
}

.voice-call-duration {
    font-size: 14px;                        /* 字体大小 */
    color: rgba(255, 255, 255, 0.8);        /* 文字颜色（半透明白色） */
}

/* ========== 5. 消息容器 ========== */
.voice-call-messages {
    flex: 1;                                /* 占据剩余空间 */
    overflow-y: auto;                       /* 垂直滚动 */
    padding: 20px;                          /* 内边距 */
}

/* ========== 6. 消息气泡样式 ========== */
.voice-call-message {
    display: flex;                          /* 弹性布局 */
    margin-bottom: 15px;                    /* 底部间距 */
    align-items: flex-end;                  /* 底部对齐 */
}

.voice-call-message.sent {
    justify-content: flex-end;              /* 右对齐（发送的消息） */
}

.voice-call-bubble {
    max-width: 70%;                         /* 最大宽度 */
    padding: 12px 16px;                     /* 内边距 */
    border-radius: 18px;                    /* 圆角 */
    background: rgba(255, 255, 255, 0.95);  /* 背景颜色（白色） */
    color: #333;                            /* 文字颜色（深灰色） */
    word-wrap: break-word;                  /* 文字换行 */
}

.voice-call-message.sent .voice-call-bubble {
    background: rgba(102, 126, 234, 0.9);   /* 背景颜色（蓝紫色） */
    color: #FFFFFF;                         /* 文字颜色（白色） */
}

/* ========== 7. 输入区域 ========== */
.voice-call-input-container {
    padding: 15px;                          /* 内边距 */
    background: rgba(255, 255, 255, 0.95);  /* 背景颜色 */
    display: flex;                          /* 弹性布局 */
    gap: 10px;                              /* 元素间距 */
    align-items: center;                    /* 垂直居中 */
}

/* ========== 8. 按钮样式 ========== */
.voice-call-btn {
    padding: 10px 20px;                     /* 内边距 */
    border: none;                           /* 无边框 */
    border-radius: 20px;                    /* 圆角 */
    background: rgba(102, 126, 234, 0.9);   /* 背景颜色（蓝紫色） */
    color: #FFFFFF;                         /* 文字颜色（白色） */
    cursor: pointer;                        /* 鼠标指针 */
    transition: all 0.3s;                   /* 过渡动画 */
}

.voice-call-btn:hover {
    background: rgba(102, 126, 234, 1);     /* 悬停时背景颜色 */
    transform: scale(1.05);                 /* 悬停时放大 */
}`;
    
    document.getElementById('voiceCallDefaultCSS').textContent = defaultCSS;
    
    modal.classList.add('active');
}

// 保存语音通话外观设置（新版本）
function saveVoiceCallAppearanceNew() {
    voiceCallSettings.customCSS = document.getElementById('voiceCallCustomCSS').value;
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (contact) {
        contact.voiceCallSettings = { ...voiceCallSettings };
        saveContacts();
        console.log('✅ [语音通话] 外观设置已保存');
    }
    
    closeVoiceCallAppearance();
    alert('外观设置已保存');
}

// ==================== 行程卡功能 ====================

// 打开行程卡页面
function openTravelCard() {
    window.location.href = 'travel-card.html';
}


// ==================== 行程卡集成函数 ====================

// 清理联系人的行程卡数据（删除联系人时调用）
function cleanupTravelCardData(contactId) {
    try {
        // 删除行程卡数据
        const travelCardsKey = `travelCards_${contactId}`;
        localStorage.removeItem(travelCardsKey);
        console.log('🗑️ [行程卡] 已删除行程卡数据:', travelCardsKey);
        
        // 删除固化记忆数据
        const memoriesKey = `travelCardMemories_${contactId}`;
        localStorage.removeItem(memoriesKey);
        console.log('🗑️ [行程卡] 已删除固化记忆数据:', memoriesKey);
    } catch (e) {
        console.error('清理行程卡数据失败:', e);
    }
}

// 获取指定时区的日期字符串
function getDateInTimezone(timezone) {
    try {
        const now = new Date();
        const dateStr = now.toLocaleString('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (e) {
        console.error('时区转换失败:', e);
        return new Date().toISOString().split('T')[0];
    }
}

// 获取行程卡数据
function getTravelCardData(contactId, date) {
    try {
        const key = `travelCards_${contactId}`;
        const allCards = JSON.parse(localStorage.getItem(key) || '{}');
        return allCards[date] || null;
    } catch (e) {
        console.error('获取行程卡数据失败:', e);
        return null;
    }
}

// 判断行程是否可见（用于聊天注入）
function isScheduleVisibleForChat(schedule, currentTime, contactTimezone) {
    if (!contactTimezone) {
        const scheduleTime = new Date();
        const [hours, minutes] = schedule.time.split(':');
        scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return scheduleTime <= currentTime;
    }
    
    try {
        const userNow = new Date();
        const contactNow = new Date(userNow.toLocaleString('en-US', { timeZone: contactTimezone }));
        const [hours, minutes] = schedule.time.split(':');
        const scheduleTime = new Date(contactNow);
        scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return contactNow >= scheduleTime;
    } catch (error) {
        console.error('时区转换失败:', error);
        const scheduleTime = new Date();
        const [hours, minutes] = schedule.time.split(':');
        scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return scheduleTime <= currentTime;
    }
}

// 获取固化记忆
function getTravelCardMemories(contactId) {
    try {
        const key = `travelCardMemories_${contactId}`;
        const memories = JSON.parse(localStorage.getItem(key) || '[]');
        return memories;
    } catch (e) {
        console.error('获取固化记忆失败:', e);
        return [];
    }
}

// 获取行程卡设置
function getTravelCardSettings() {
    try {
        return JSON.parse(localStorage.getItem('travelCardSettings') || '{}');
    } catch (e) {
        console.error('获取行程卡设置失败:', e);
        return {};
    }
}

// ==================== 图片识图中转发送 ====================

function openImageSendDialog() {
    // 创建隐藏的文件输入
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleImageFileSelected(e);
    input.click();
}

async function handleImageFileSelected(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;

    // 检查 VisionRelay 是否已配置
    if (!window.VisionRelay || !VisionRelay.isConfigured()) {
        alert('请先在应用总设置（设置 → 识图中转API）中配置识图中转API，才能发送图片');
        return;
    }

    // 读取文件为 base64
    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Image = e.target.result;
        await sendImageViaVisionRelay(contact, base64Image);
    };
    reader.readAsDataURL(file);
}

async function sendImageViaVisionRelay(contact, base64Image) {
    // 显示加载状态
    const loadingMsg = {
        id: Date.now(),
        sender: 'system',
        message: '正在识别图片...',
        timestamp: new Date().toISOString()
    };
    const container = document.getElementById('chatMessages');
    const loadingEl = document.createElement('div');
    loadingEl.className = 'message-bubble system';
    loadingEl.id = 'vision-loading';
    loadingEl.innerHTML = '<div class="bubble-content"><span class="typing-indicator">正在识别图片...</span></div>';
    container.appendChild(loadingEl);
    container.scrollTop = container.scrollHeight;

    try {
        const result = await VisionRelay.describeImage(base64Image);

        // 移除加载状态
        const loadEl = document.getElementById('vision-loading');
        if (loadEl) loadEl.remove();

        if (!result.success) {
            // 显示错误，允许重试
            alert('图片识别失败: ' + result.error + '\n请重试');
            return;
        }

        // 将描述作为用户消息发送
        const userMessage = '[图片描述] ' + result.description;
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        };
        contact.chat_history.push(userMsg);
        saveContacts();

        // 渲染用户消息
        container.appendChild(createMessageElement(userMsg, contact));
        requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });

        // 调用 AI 获取回复
        showTypingIndicator(contact);
        await getAIResponse(contact, userMessage);

    } catch (e) {
        const loadEl = document.getElementById('vision-loading');
        if (loadEl) loadEl.remove();
        alert('图片识别失败: ' + e.message + '\n请重试');
    }
}
