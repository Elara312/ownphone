
// ==================== 语音通话功能 ====================

// 全局变量
let voiceCallActive = false;
let voiceCallStartTime = null;
let voiceCallDurationInterval = null;
let voiceCallHistory = [];
let voiceCallAudioContext = null;
let voiceCallAnalyser = null;
let voiceCallWaveformAnimation = null;
let currentVoiceAudio = null;
let voiceRecognition = null;
let voiceCallSettings = {
    background: '',
    enableMinimax: true,
    enableContinuousRead: false,
    chatHistoryCount: 10,
    activeMessageInterval: 30000,
    customCSS: ''
};
let lastUserMessageTime = Date.now();
let activeMessageTimer = null;

// IndexedDB 初始化
let voiceAudioDB = null;
function initVoiceAudioDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('VoiceCallAudioDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            voiceAudioDB = request.result;
            resolve(voiceAudioDB);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('audioCache')) {
                db.createObjectStore('audioCache', { keyPath: 'messageId' });
            }
        };
    });
}

// 启动语音通话
async function startVoiceCall() {
    if (!currentChatContactId) {
        alert('请先选择一个联系人');
        return;
    }
    
    const contact = vibeContacts.find(c => c.id === currentChatContactId);
    if (!contact) return;
    
    // 初始化IndexedDB
    try {
        await initVoiceAudioDB();
    } catch (error) {
        console.error('初始化音频数据库失败:', error);
    }
    
    // 加载语音通话设置
    loadVoiceCallSettings(contact);
    
    // 设置通话状态
    voiceCallActive = true;
    voiceCallStartTime = Date.now();
    voiceCallHistory = [];
    
    // 更新UI
    const voiceCallPage = document.getElementById('page-voice-call');
    const voiceCallAvatar = document.getElementById('voiceCallAvatar');
    const voiceCallName = document.getElementById('voiceCallName');
    
    if (contact.avatarUrl) {
        voiceCallAvatar.src = contact.avatarUrl;
    } else {
        voiceCallAvatar.textContent = '👤';
    }
    
    voiceCallName.textContent = contact.nickname || contact.name;
    
    // 应用自定义背景
    if (voiceCallSettings.background) {
        voiceCallPage.style.backgroundImage = \url(\)\;
    }
    
    // 应用自定义CSS
    if (voiceCallSettings.customCSS) {
        let styleEl = document.getElementById('voiceCallCustomStyle');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'voiceCallCustomStyle';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = voiceCallSettings.customCSS;
    }
    
    // 读取聊天记录
    loadChatHistoryForVoiceCall(contact);
    
    // 初始化声波可视化
    initWaveformVisualizer();
    
    // 开始计时
    startVoiceCallDuration();
    
    // 开始主动消息计时器
    startActiveMessageTimer();
    
    // 打开语音通话页面
    openPage('page-voice-call');
    
    // 播放接通音效
    playCallConnectSound();
}

