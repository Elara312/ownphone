// ==================== AI自动状态管理和自动回复系统 ====================

/**
 * AI自动状态管理和自动回复系统
 * 让CHAR角色感觉更加"活着"，通过智能分析travel card中的行程安排，
 * 自动更新角色状态，并根据当前活动类型智能判定回复策略
 */

const AIAutoStatus = {
    // 系统状态
    isInitialized: false,
    isRunning: false,
    
    // 核心组件
    statusManager: null,
    replyAnalyzer: null,
    priorityOverrideManager: null,
    
    // 配置
    config: {
        checkInterval: 60000, // 1分钟检查一次
        maxErrors: 5,         // 最大错误次数
        safeModeCooldown: 5 * 60 * 1000, // 5分钟冷却时间
        cacheTimeout: 5 * 60 * 1000,     // 5分钟缓存超时
        replyTimeout: 200     // 200ms回复判定超时
    },
    
    // 系统状态
    errorCount: 0,
    isInSafeMode: false,
    
    /**
     * 初始化AI自动状态系统
     */
    async init() {
        if (this.isInitialized) {
            console.log('🤖 [AI状态] 系统已初始化');
            return true;
        }
        
        try {
            console.log('🤖 [AI状态] 开始初始化系统...');
            
            // 检查依赖
            if (typeof TravelCard === 'undefined') {
                console.warn('⚠️ [AI状态] TravelCard 未加载，部分功能可能不可用');
            }
            
            // 初始化核心组件
            this.statusManager = new StatusManager();
            this.replyAnalyzer = new ReplyAnalyzer();
            this.priorityOverrideManager = new PriorityOverrideManager();
            
            // 初始化各组件
            await this.statusManager.init();
            await this.replyAnalyzer.init();
            await this.priorityOverrideManager.init();
            
            // 恢复系统状态（使用try-catch避免阻塞初始化）
            try {
                await this.restoreSystemState();
            } catch (error) {
                console.warn('⚠️ [AI状态] 系统状态恢复失败，但系统可以继续运行:', error);
            }
            
            this.isInitialized = true;
            console.log('✅ [AI状态] 系统初始化完成');
            
            // 启动系统
            this.start();
            
            return true;
            
        } catch (error) {
            console.error('❌ [AI状态] 系统初始化失败:', error);
            this.handleError('init', error);
            return false;
        }
    },
    
    /**
     * 启动系统
     */
    start() {
        if (this.isRunning) {
            console.log('🤖 [AI状态] 系统已在运行');
            return;
        }
        
        if (this.isInSafeMode) {
            console.log('🛡️ [AI状态] 系统处于安全模式，无法启动');
            return;
        }
        
        try {
            console.log('🚀 [AI状态] 启动系统...');
            
            // 启动状态管理器
            this.statusManager.startAutoCheck();
            
            this.isRunning = true;
            console.log('✅ [AI状态] 系统启动成功');
            
        } catch (error) {
            console.error('❌ [AI状态] 系统启动失败:', error);
            this.handleError('start', error);
        }
    },
    
    /**
     * 停止系统
     */
    stop() {
        if (!this.isRunning) {
            console.log('🤖 [AI状态] 系统未在运行');
            return;
        }
        
        try {
            console.log('🛑 [AI状态] 停止系统...');
            
            // 停止状态管理器
            this.statusManager.stopAutoCheck();
            
            this.isRunning = false;
            console.log('✅ [AI状态] 系统已停止');
            
        } catch (error) {
            console.error('❌ [AI状态] 系统停止失败:', error);
        }
    },
    
    /**
     * 恢复系统状态
     */
    async restoreSystemState() {
        try {
            console.log('🔄 [AI状态] 开始恢复系统状态...');
            
            // 恢复状态管理器状态
            try {
                await this.statusManager.restoreState();
                console.log('✅ [AI状态] 状态管理器状态恢复完成');
            } catch (error) {
                console.warn('⚠️ [AI状态] 状态管理器状态恢复失败:', error);
            }
            
            // 恢复优先级覆盖状态
            try {
                await this.priorityOverrideManager.restoreState();
                console.log('✅ [AI状态] 优先级覆盖状态恢复完成');
            } catch (error) {
                console.warn('⚠️ [AI状态] 优先级覆盖状态恢复失败:', error);
            }
            
            // 立即执行一次状态检查（非阻塞）
            try {
                const contacts = this.statusManager.getActiveContacts();
                console.log(`📊 [AI状态] 找到 ${contacts.length} 个联系人`);
                
                if (contacts.length > 0) {
                    // 异步执行状态检查，不阻塞初始化
                    setTimeout(async () => {
                        try {
                            await this.statusManager.checkAllContacts();
                            console.log('✅ [AI状态] 初始状态检查完成');
                        } catch (error) {
                            console.warn('⚠️ [AI状态] 初始状态检查失败:', error);
                        }
                    }, 1000);
                }
            } catch (error) {
                console.warn('⚠️ [AI状态] 获取联系人列表失败:', error);
            }
            
            console.log('✅ [AI状态] 系统状态恢复完成');
            
        } catch (error) {
            console.error('❌ [AI状态] 系统状态恢复失败:', error);
            throw error; // 重新抛出错误，让调用者处理
        }
    },
    
    /**
     * 错误处理
     */
    handleError(source, error) {
        this.errorCount++;
        console.error(`❌ [AI状态] 错误 [${source}]:`, error);
        
        // 记录错误日志
        this.logError(source, error);
        
        // 检查是否需要进入安全模式
        if (this.errorCount >= this.config.maxErrors && !this.isInSafeMode) {
            this.enterSafeMode();
        }
    },
    
    /**
     * 进入安全模式
     */
    enterSafeMode() {
        this.isInSafeMode = true;
        console.warn('🛡️ [AI状态] 进入安全模式，停止自动状态更新');
        
        // 停止所有自动任务
        this.stop();
        
        // 设置冷却时间后自动恢复
        setTimeout(() => {
            this.exitSafeMode();
        }, this.config.safeModeCooldown);
    },
    
    /**
     * 退出安全模式
     */
    exitSafeMode() {
        this.isInSafeMode = false;
        this.errorCount = 0;
        console.log('✅ [AI状态] 退出安全模式，恢复正常运行');
        
        // 重启系统
        this.start();
    },
    
    /**
     * 记录错误日志
     */
    logError(source, error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            source: source,
            message: error.message,
            stack: error.stack
        };
        
        // 保存到localStorage（保留最近50条错误）
        const logs = JSON.parse(localStorage.getItem('aiAutoStatus_errorLogs') || '[]');
        logs.unshift(errorLog);
        if (logs.length > 50) {
            logs.splice(50);
        }
        localStorage.setItem('aiAutoStatus_errorLogs', JSON.stringify(logs));
    },
    
    /**
     * 获取系统状态
     */
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            isRunning: this.isRunning,
            isInSafeMode: this.isInSafeMode,
            errorCount: this.errorCount,
            components: {
                statusManager: this.statusManager ? this.statusManager.getStatus() : null,
                replyAnalyzer: this.replyAnalyzer ? this.replyAnalyzer.getStatus() : null,
                priorityOverrideManager: this.priorityOverrideManager ? this.priorityOverrideManager.getStatus() : null
            }
        };
    }
};

/**
 * 状态管理器
 * 负责管理CHAR的状态生命周期
 */
class StatusManager {
    constructor() {
        this.checkTimer = null;
        this.cache = new Map();
        this.statusHistory = [];
        this.isRunning = false;
    }
    
    /**
     * 初始化状态管理器
     */
    async init() {
        console.log('📊 [状态管理] 初始化状态管理器...');
        
        // 加载状态历史
        this.loadStatusHistory();
        
        console.log('✅ [状态管理] 状态管理器初始化完成');
    }
    
    /**
     * 开始自动检查
     */
    startAutoCheck() {
        if (this.isRunning) {
            console.log('📊 [状态管理] 自动检查已在运行');
            return;
        }
        
        console.log('🔄 [状态管理] 开始自动检查...');
        
        // 立即执行一次检查
        this.checkAllContacts();
        
        // 设置定时检查
        this.checkTimer = setInterval(() => {
            this.checkAllContacts();
        }, AIAutoStatus.config.checkInterval);
        
        this.isRunning = true;
        console.log('✅ [状态管理] 自动检查已启动');
    }
    
    /**
     * 停止自动检查
     */
    stopAutoCheck() {
        if (!this.isRunning) {
            console.log('📊 [状态管理] 自动检查未在运行');
            return;
        }
        
        console.log('🛑 [状态管理] 停止自动检查...');
        
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
        
        this.isRunning = false;
        console.log('✅ [状态管理] 自动检查已停止');
    }
    
    /**
     * 检查所有联系人的状态
     */
    async checkAllContacts() {
        try {
            const contacts = this.getActiveContacts();
            
            for (const contact of contacts) {
                await this.checkAndUpdateStatus(contact.id);
            }
            
            // 清理过期的手动覆盖
            AIAutoStatus.priorityOverrideManager.cleanupExpiredOverrides();
            
        } catch (error) {
            console.error('❌ [状态管理] 检查所有联系人失败:', error);
            AIAutoStatus.handleError('checkAllContacts', error);
        }
    }
    
    /**
     * 检查并更新指定联系人的状态
     */
    async checkAndUpdateStatus(contactId) {
        try {
            // 检查是否有手动覆盖
            if (AIAutoStatus.priorityOverrideManager.hasManualOverride(contactId)) {
                console.log(`🔒 [状态管理] 联系人 ${contactId} 有手动覆盖，跳过自动更新`);
                return;
            }
            
            // 获取当前行程
            const currentSchedule = await this.getCurrentSchedule(contactId);
            
            // 计算新状态
            const newStatus = this.calculateStatus(currentSchedule);
            
            // 获取当前状态
            const currentStatus = this.getCurrentStatus(contactId);
            
            // 如果状态发生变化，更新状态
            if (!currentStatus || currentStatus.currentStatus !== newStatus.currentStatus) {
                await this.updateStatus(contactId, newStatus, 'auto');
                console.log(`📊 [状态管理] 联系人 ${contactId} 状态更新: ${newStatus.currentStatus}`);
            }
            
        } catch (error) {
            console.error(`❌ [状态管理] 检查联系人 ${contactId} 状态失败:`, error);
            AIAutoStatus.handleError('checkAndUpdateStatus', error);
        }
    }
    
    /**
     * 获取当前行程
     */
    async getCurrentSchedule(contactId) {
        try {
            // 检查缓存
            const cacheKey = `schedule_${contactId}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < AIAutoStatus.config.cacheTimeout) {
                return cached.data;
            }
            
            // 获取今天的日期
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayKey = `${year}-${month}-${day}`;
            
            // 从travel card系统获取数据
            const travelCardData = TravelCard.getTravelCardData(contactId, todayKey);
            
            if (!travelCardData || !travelCardData.schedules) {
                // 缓存空结果
                this.cache.set(cacheKey, {
                    data: null,
                    timestamp: Date.now()
                });
                return null;
            }
            
            // 获取当前时间
            const now = new Date();
            const timezone = travelCardData.timezone;
            
            // 找到当前可见的行程
            const currentSchedules = travelCardData.schedules.filter(schedule => {
                return TravelCard.isScheduleVisible(schedule, now, timezone);
            });
            
            // 找到最近的行程（正在进行或即将开始）
            let currentSchedule = null;
            if (currentSchedules.length > 0) {
                // 按时间排序，取最后一个（最近的）
                currentSchedules.sort((a, b) => {
                    const timeA = a.time.split(':').map(Number);
                    const timeB = b.time.split(':').map(Number);
                    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
                });
                currentSchedule = currentSchedules[currentSchedules.length - 1];
            }
            
            // 缓存结果
            this.cache.set(cacheKey, {
                data: currentSchedule,
                timestamp: Date.now()
            });
            
            return currentSchedule;
            
        } catch (error) {
            console.error(`❌ [状态管理] 获取联系人 ${contactId} 当前行程失败:`, error);
            AIAutoStatus.handleError('getCurrentSchedule', error);
            return null;
        }
    }
    
    /**
     * 计算状态
     */
    calculateStatus(schedule) {
        if (!schedule) {
            return {
                currentStatus: '在线',
                statusType: 'online',
                activityType: 'free',
                isVisible: true
            };
        }
        
        // 优先使用行程卡前台展示的标题（报备标题），其次使用旧字段/活动名
        const reportedTitle = (schedule.reported && schedule.reported.title) ? schedule.reported.title : null;
        let displayActivity = schedule.activity;
        if (schedule.isDeceptive && schedule.surfaceActivity) {
            displayActivity = schedule.surfaceActivity;
        }
        const displayTitle = reportedTitle || displayActivity || '忙碌中';

        // 将中文/自由文本标题归类到标准活动类型，便于回复策略与状态类型判断
        const normalizedActivityType = this.normalizeActivityType(displayTitle, displayActivity);

        // 获取对应活动配置（可能是用户自定义），找不到则回退到 unknown
        const activityConfig = StatusConfig.getActivityConfig(normalizedActivityType || 'unknown');

        return {
            currentStatus: displayTitle,
            statusType: this.mapActivityToStatusType(normalizedActivityType),
            activityType: normalizedActivityType || 'unknown',
            scheduleId: schedule.id,
            isVisible: schedule.isVisible !== false
        };
    }
    
    /**
     * 将中文/自由文本标题映射为标准活动类型键
     * 返回值示例：'sleep' | 'meeting' | 'work' | 'meal' | 'rest' | 'exercise' | 'entertainment' | 'free' | 'unknown'
     */
    normalizeActivityType(title, rawActivity) {
        const text = String(title || rawActivity || '').toLowerCase();
        
        // 睡觉类
        if (/[睡眠就寝休息午睡晚睡打盹]/.test(title || '') || text.includes('sleep')) {
            return 'sleep';
        }
        // 会议类
        if ((title && /会议|开会|碰头|sync|站会/.test(title)) || text.includes('meeting')) {
            return 'meeting';
        }
        // 工作/学习（工作优先于学习）
        if ((title && /工作|上班|办公|写代码|处理邮件|review|调试/.test(title)) || text.includes('work')) {
            return 'work';
        }
        if ((title && /学习|自习|备考|听课|阅读|复习/.test(title)) || text.includes('study')) {
            return 'study';
        }
        // 用餐
        if ((title && /早餐|早饭|午餐|午饭|晚餐|晚饭|夜宵|用餐|吃饭|咖啡|下午茶/.test(title)) || text.includes('meal')) {
            return 'meal';
        }
        // 运动
        if ((title && /运动|健身|跑步|瑜伽|骑行|游泳|锻炼/.test(title)) || text.includes('exercise')) {
            return 'exercise';
        }
        // 休息/放松
        if ((title && /休息|放松|小憩|冥想|发呆|散步/.test(title)) || text.includes('rest')) {
            return 'rest';
        }
        // 娱乐
        if ((title && /娱乐|游戏|看剧|电影|追番|音乐|逛街/.test(title)) || text.includes('entertainment')) {
            return 'entertainment';
        }
        // 起床&洗漱、通勤等：默认视为空闲/在线
        if ((title && /起床|洗漱|通勤|出门|回家|抵达/.test(title))) {
            return 'free';
        }
        
        // 保底
        return 'unknown';
    }
    
    /**
     * 映射活动类型到状态类型
     */
    mapActivityToStatusType(activity) {
        const mapping = {
            'sleep': 'offline',
            'meeting': 'busy',
            'work': 'busy',
            'meal': 'away',
            'rest': 'away',
            'exercise': 'away'
        };
        
        return mapping[activity] || 'online';
    }
    
    /**
     * 获取当前状态
     */
    getCurrentStatus(contactId) {
        const key = `aiAutoStatus_${contactId}`;
        const statusData = localStorage.getItem(key);
        if (!statusData) return null;
        
        try {
            return JSON.parse(statusData);
        } catch (error) {
            console.error(`❌ [状态管理] 解析联系人 ${contactId} 状态数据失败:`, error);
            return null;
        }
    }
    
    /**
     * 更新状态
     */
    async updateStatus(contactId, status, source) {
        try {
            const oldStatus = this.getCurrentStatus(contactId);
            
            const newStatusData = {
                ...status,
                contactId: contactId,
                source: source,
                lastUpdated: new Date().toISOString()
            };
            
            // 保存到localStorage
            const key = `aiAutoStatus_${contactId}`;
            localStorage.setItem(key, JSON.stringify(newStatusData));
            
            // 记录状态历史
            this.addStatusHistory(contactId, oldStatus, newStatusData, source);
            
            // 更新UI显示
            this.updateStatusDisplay(contactId, newStatusData);
            
            console.log(`✅ [状态管理] 联系人 ${contactId} 状态已更新:`, newStatusData);
            
        } catch (error) {
            console.error(`❌ [状态管理] 更新联系人 ${contactId} 状态失败:`, error);
            AIAutoStatus.handleError('updateStatus', error);
        }
    }
    
    /**
     * 添加状态历史记录
     */
    addStatusHistory(contactId, oldStatus, newStatus, source) {
        const historyItem = {
            contactId: contactId,
            timestamp: new Date().toISOString(),
            oldStatus: oldStatus ? oldStatus.currentStatus : null,
            newStatus: newStatus.currentStatus,
            source: source,
            reason: `从 ${oldStatus ? oldStatus.currentStatus : '无'} 更新为 ${newStatus.currentStatus}`
        };
        
        this.statusHistory.unshift(historyItem);
        
        // 保留最近100条记录
        if (this.statusHistory.length > 100) {
            this.statusHistory.splice(100);
        }
        
        // 保存到localStorage
        localStorage.setItem('aiAutoStatus_statusHistory', JSON.stringify(this.statusHistory));
    }
    
    /**
     * 更新状态显示
     */
    updateStatusDisplay(contactId, statusData) {
        // 如果当前正在与该联系人聊天，更新聊天界面的状态显示
        if (typeof currentChatContactId !== 'undefined' && currentChatContactId === contactId) {
            const statusElement = document.getElementById('chatStatus');
            if (statusElement) {
                statusElement.textContent = statusData.currentStatus;
                statusElement.className = `chat-header-status ${statusData.source}`;
                
                // 添加状态指示器
                if (statusData.source === 'manual') {
                    statusElement.setAttribute('title', '手动设置');
                } else {
                    statusElement.setAttribute('title', '自动更新');
                }
            }
        }
    }
    
    /**
     * 获取活跃联系人列表
     */
    getActiveContacts() {
        try {
            // 从localStorage获取联系人列表（与message.js保持一致）
            const contacts = JSON.parse(localStorage.getItem('vibe_contacts') || '[]');
            return contacts.filter(contact => contact && contact.id);
            
        } catch (error) {
            console.error('❌ [状态管理] 获取活跃联系人失败:', error);
            return [];
        }
    }
    
    /**
     * 加载状态历史
     */
    loadStatusHistory() {
        try {
            const history = localStorage.getItem('aiAutoStatus_statusHistory');
            if (history) {
                this.statusHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('❌ [状态管理] 加载状态历史失败:', error);
            this.statusHistory = [];
        }
    }
    
    /**
     * 恢复状态
     */
    async restoreState() {
        console.log('📊 [状态管理] 恢复状态...');
        
        // 加载状态历史
        this.loadStatusHistory();
        
        // 清理缓存
        this.cache.clear();
        
        console.log('✅ [状态管理] 状态恢复完成');
    }
    
    /**
     * 获取状态历史
     */
    getStatusHistory(contactId) {
        if (contactId) {
            return this.statusHistory.filter(item => item.contactId === contactId);
        }
        return this.statusHistory;
    }
    
    /**
     * 获取组件状态
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            cacheSize: this.cache.size,
            historyCount: this.statusHistory.length
        };
    }
}

// 导出到全局作用域
window.AIAutoStatus = AIAutoStatus;
window.StatusManager = StatusManager;

console.log('✅ [AI状态] AI自动状态系统已加载');

/**
 * 回复分析器
 * 分析并判定回复策略
 */
class ReplyAnalyzer {
    constructor() {
        this.isInitialized = false;
    }
    
    /**
     * 初始化回复分析器
     */
    async init() {
        console.log('🧠 [回复分析] 初始化回复分析器...');
        
        // 初始化状态配置
        StatusConfig.init();
        
        this.isInitialized = true;
        console.log('✅ [回复分析] 回复分析器初始化完成');
    }
    
    /**
     * 分析回复策略
     */
    async analyzeReplyStrategy(contactId, userMessage) {
        const startTime = Date.now();
        
        try {
            // 检查是否有手动覆盖
            let currentStatus;
            if (AIAutoStatus.priorityOverrideManager.hasManualOverride(contactId)) {
                const manualStatus = AIAutoStatus.priorityOverrideManager.getManualStatus(contactId);
                currentStatus = {
                    activityType: manualStatus.activityType || 'free',
                    source: 'manual'
                };
            } else {
                // 获取自动状态
                const autoStatus = AIAutoStatus.statusManager.getCurrentStatus(contactId);
                currentStatus = {
                    activityType: autoStatus ? autoStatus.activityType : 'free',
                    source: 'auto'
                };
            }
            
            const activityConfig = StatusConfig.getActivityConfig(currentStatus.activityType);
            
            const strategy = {
                type: 'normal',
                activityType: currentStatus.activityType,
                priority: activityConfig.priority,
                source: currentStatus.source,
                autoReply: '',
                processingTime: Date.now() - startTime
            };
            
            // 检查处理时间
            if (strategy.processingTime > AIAutoStatus.config.replyTimeout) {
                console.warn(`⚠️ [回复分析] 处理时间超时: ${strategy.processingTime}ms`);
            }
            
            console.log(`🧠 [回复分析] 联系人 ${contactId} 策略: ${strategy.type} (${strategy.processingTime}ms)`);
            return strategy;
            
        } catch (error) {
            console.error(`❌ [回复分析] 分析联系人 ${contactId} 回复策略失败:`, error);
            AIAutoStatus.handleError('analyzeReplyStrategy', error);
            
            // 降级处理：返回正常回复策略
            return {
                type: 'normal',
                activityType: 'unknown',
                priority: 0,
                source: 'fallback',
                autoReply: '',
                processingTime: Date.now() - startTime,
                error: error.message
            };
        }
    }
    
    /**
     * 生成自动回复
     */
    generateAutoReply(contactId, activityType, template) {
        try {
            if (!template) {
                // 使用默认模板
                const activityConfig = StatusConfig.getActivityConfig(activityType);
                template = activityConfig.autoReplyTemplate;
            }
            
            if (!template) {
                return '我现在有点忙，稍后回复你';
            }
            
            // 可以在这里添加模板变量替换逻辑
            // 例如：替换 {time}、{activity} 等变量
            let reply = template;
            
            // 替换时间变量
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            reply = reply.replace('{time}', timeStr);
            
            // 替换活动变量
            const activityConfig = StatusConfig.getActivityConfig(activityType);
            reply = reply.replace('{activity}', activityConfig.statusText);
            
            return reply;
            
        } catch (error) {
            console.error(`❌ [回复分析] 生成自动回复失败:`, error);
            return '我现在有点忙，稍后回复你';
        }
    }
    
    /**
     * 判断是否需要调用AI
     */
    shouldCallAI(strategy) {
        return strategy.type !== 'auto';
    }
    
    /**
     * 构建忙碌回复提示词
     */
    buildBusyReplyPrompt(contact, userMessage, strategy) {
        const basePrompt = `你现在正在${strategy.activityType}，比较忙碌。请简短回复用户的消息，保持友好但要体现出你在忙碌中。回复应该简洁明了，不要太长。`;
        
        return {
            systemPrompt: basePrompt,
            userMessage: userMessage,
            context: {
                activity: strategy.activityType,
                status: StatusConfig.getActivityConfig(strategy.activityType).statusText
            }
        };
    }
    
    /**
     * 获取组件状态
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized
        };
    }
}

/**
 * 优先级覆盖管理器
 * 管理用户手动状态设置
 */
class PriorityOverrideManager {
    constructor() {
        this.overrides = new Map();
        this.cleanupTimer = null;
        this.isInitialized = false;
    }
    
    /**
     * 初始化优先级覆盖管理器
     */
    async init() {
        console.log('🔒 [优先级覆盖] 初始化优先级覆盖管理器...');
        
        // 加载现有的覆盖设置
        this.loadOverrides();
        
        // 启动清理定时器
        this.startCleanupTimer();
        
        this.isInitialized = true;
        console.log('✅ [优先级覆盖] 优先级覆盖管理器初始化完成');
    }
    
    /**
     * 设置手动状态
     */
    setManualStatus(contactId, status) {
        try {
            const override = {
                contactId: contactId,
                manualStatus: status.currentStatus,
                activityType: status.activityType || 'free',
                statusType: status.statusType || 'online',
                setAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时后过期
                isActive: true
            };
            
            this.overrides.set(contactId, override);
            this.saveOverrides();
            
            // 立即更新状态显示
            AIAutoStatus.statusManager.updateStatusDisplay(contactId, {
                currentStatus: status.currentStatus,
                source: 'manual'
            });
            
            console.log(`🔒 [优先级覆盖] 联系人 ${contactId} 手动状态已设置: ${status.currentStatus}`);
            return true;
            
        } catch (error) {
            console.error(`❌ [优先级覆盖] 设置联系人 ${contactId} 手动状态失败:`, error);
            return false;
        }
    }
    
    /**
     * 清除手动状态
     */
    clearManualStatus(contactId) {
        try {
            if (this.overrides.has(contactId)) {
                this.overrides.delete(contactId);
                this.saveOverrides();
                
                // 恢复自动状态管理
                AIAutoStatus.statusManager.checkAndUpdateStatus(contactId);
                
                console.log(`🔒 [优先级覆盖] 联系人 ${contactId} 手动状态已清除`);
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error(`❌ [优先级覆盖] 清除联系人 ${contactId} 手动状态失败:`, error);
            return false;
        }
    }
    
    /**
     * 检查是否有手动覆盖
     */
    hasManualOverride(contactId) {
        const override = this.overrides.get(contactId);
        if (!override) return false;
        
        // 检查是否过期
        if (new Date(override.expiresAt) <= new Date()) {
            this.overrides.delete(contactId);
            this.saveOverrides();
            return false;
        }
        
        return override.isActive;
    }
    
    /**
     * 获取手动状态
     */
    getManualStatus(contactId) {
        const override = this.overrides.get(contactId);
        if (!override || !this.hasManualOverride(contactId)) {
            return null;
        }
        
        return {
            currentStatus: override.manualStatus,
            activityType: override.activityType,
            statusType: override.statusType,
            setAt: override.setAt,
            expiresAt: override.expiresAt
        };
    }
    
    /**
     * 清理过期的覆盖设置
     */
    cleanupExpiredOverrides() {
        try {
            const now = new Date();
            let cleanedCount = 0;
            
            for (const [contactId, override] of this.overrides.entries()) {
                if (new Date(override.expiresAt) <= now) {
                    this.overrides.delete(contactId);
                    cleanedCount++;
                    
                    // 恢复自动状态管理
                    AIAutoStatus.statusManager.checkAndUpdateStatus(contactId);
                }
            }
            
            if (cleanedCount > 0) {
                this.saveOverrides();
                console.log(`🧹 [优先级覆盖] 清理了 ${cleanedCount} 个过期的手动状态设置`);
            }
            
        } catch (error) {
            console.error('❌ [优先级覆盖] 清理过期覆盖设置失败:', error);
        }
    }
    
    /**
     * 启动清理定时器
     */
    startCleanupTimer() {
        // 每10分钟清理一次过期设置
        this.cleanupTimer = setInterval(() => {
            this.cleanupExpiredOverrides();
        }, 10 * 60 * 1000);
    }
    
    /**
     * 停止清理定时器
     */
    stopCleanupTimer() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }
    
    /**
     * 加载覆盖设置
     */
    loadOverrides() {
        try {
            const data = localStorage.getItem('aiAutoStatus_overrides');
            if (data) {
                const overridesArray = JSON.parse(data);
                this.overrides.clear();
                
                overridesArray.forEach(override => {
                    this.overrides.set(override.contactId, override);
                });
                
                console.log(`🔒 [优先级覆盖] 加载了 ${this.overrides.size} 个手动状态设置`);
            }
        } catch (error) {
            console.error('❌ [优先级覆盖] 加载覆盖设置失败:', error);
            this.overrides.clear();
        }
    }
    
    /**
     * 保存覆盖设置
     */
    saveOverrides() {
        try {
            const overridesArray = Array.from(this.overrides.values());
            localStorage.setItem('aiAutoStatus_overrides', JSON.stringify(overridesArray));
        } catch (error) {
            console.error('❌ [优先级覆盖] 保存覆盖设置失败:', error);
        }
    }
    
    /**
     * 恢复状态
     */
    async restoreState() {
        console.log('🔒 [优先级覆盖] 恢复状态...');
        
        // 重新加载覆盖设置
        this.loadOverrides();
        
        // 清理过期设置
        this.cleanupExpiredOverrides();
        
        console.log('✅ [优先级覆盖] 状态恢复完成');
    }
    
    /**
     * 获取所有活跃的覆盖设置
     */
    getAllActiveOverrides() {
        const activeOverrides = [];
        
        for (const [contactId, override] of this.overrides.entries()) {
            if (this.hasManualOverride(contactId)) {
                activeOverrides.push({
                    contactId: contactId,
                    ...override
                });
            }
        }
        
        return activeOverrides;
    }
    
    /**
     * 获取组件状态
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            activeOverrides: this.overrides.size,
            hasCleanupTimer: !!this.cleanupTimer
        };
    }
}

// 导出新的类到全局作用域
window.ReplyAnalyzer = ReplyAnalyzer;
window.PriorityOverrideManager = PriorityOverrideManager;

/**
 * 性能监控和资源管理
 */
const PerformanceMonitor = {
    // 性能指标
    metrics: {
        cpuUsage: 0,
        memoryUsage: 0,
        lastCheckTime: 0,
        averageCheckTime: 0,
        checkCount: 0
    },
    
    // 资源阈值
    thresholds: {
        highCpuUsage: 80,      // CPU使用率阈值
        highMemoryUsage: 100,   // 内存使用阈值（MB）
        slowCheckTime: 1000     // 检查时间阈值（ms）
    },
    
    /**
     * 监控系统性能
     */
    monitorPerformance() {
        try {
            // 监控内存使用（如果可用）
            if (performance.memory) {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            }
            
            // 检查是否需要调整检查间隔
            this.adjustCheckInterval();
            
        } catch (error) {
            console.error('❌ [性能监控] 监控性能失败:', error);
        }
    },
    
    /**
     * 记录检查时间
     */
    recordCheckTime(checkTime) {
        this.metrics.lastCheckTime = checkTime;
        this.metrics.checkCount++;
        
        // 计算平均检查时间
        if (this.metrics.checkCount === 1) {
            this.metrics.averageCheckTime = checkTime;
        } else {
            this.metrics.averageCheckTime = 
                (this.metrics.averageCheckTime * (this.metrics.checkCount - 1) + checkTime) / this.metrics.checkCount;
        }
    },
    
    /**
     * 调整检查间隔
     */
    adjustCheckInterval() {
        const isHighResource = 
            this.metrics.memoryUsage > this.thresholds.highMemoryUsage ||
            this.metrics.averageCheckTime > this.thresholds.slowCheckTime;
        
        if (isHighResource && AIAutoStatus.config.checkInterval < 5 * 60 * 1000) {
            // 延长检查间隔至5分钟
            AIAutoStatus.config.checkInterval = 5 * 60 * 1000;
            console.log('⚡ [性能监控] 检测到高资源使用，延长检查间隔至5分钟');
            
            // 重启定时器
            if (AIAutoStatus.statusManager && AIAutoStatus.statusManager.isRunning) {
                AIAutoStatus.statusManager.stopAutoCheck();
                AIAutoStatus.statusManager.startAutoCheck();
            }
        } else if (!isHighResource && AIAutoStatus.config.checkInterval > 60000) {
            // 恢复正常检查间隔
            AIAutoStatus.config.checkInterval = 60000;
            console.log('⚡ [性能监控] 资源使用正常，恢复正常检查间隔');
            
            // 重启定时器
            if (AIAutoStatus.statusManager && AIAutoStatus.statusManager.isRunning) {
                AIAutoStatus.statusManager.stopAutoCheck();
                AIAutoStatus.statusManager.startAutoCheck();
            }
        }
    },
    
    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        return {
            ...this.metrics,
            isHighResource: 
                this.metrics.memoryUsage > this.thresholds.highMemoryUsage ||
                this.metrics.averageCheckTime > this.thresholds.slowCheckTime,
            currentInterval: AIAutoStatus.config.checkInterval
        };
    }
};

// 扩展StatusManager以包含性能监控
const originalCheckAllContacts = StatusManager.prototype.checkAllContacts;
StatusManager.prototype.checkAllContacts = async function() {
    const startTime = Date.now();
    
    try {
        await originalCheckAllContacts.call(this);
        
        // 记录检查时间
        const checkTime = Date.now() - startTime;
        PerformanceMonitor.recordCheckTime(checkTime);
        
        // 监控性能
        PerformanceMonitor.monitorPerformance();
        
    } catch (error) {
        const checkTime = Date.now() - startTime;
        PerformanceMonitor.recordCheckTime(checkTime);
        throw error;
    }
};

// 导出性能监控器
window.PerformanceMonitor = PerformanceMonitor;
