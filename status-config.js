// ==================== AI自动状态系统 - 配置管理 ====================

/**
 * 状态配置管理
 * 管理不同活动类型的回复策略配置
 */

const StatusConfig = {
    // 默认活动配置
    defaultConfigs: {
        // 睡眠 - 最高优先级，完全自动回复
        'sleep': {
            activityType: 'sleep',
            replyStrategy: 'auto',
            statusText: '睡觉中',
            autoReplyTemplate: '我在睡觉，明天再聊吧~',
            priority: 10,
            isEnabled: true
        },
        
        // 会议 - 高优先级，完全自动回复
        'meeting': {
            activityType: 'meeting',
            replyStrategy: 'auto',
            statusText: '会议中',
            autoReplyTemplate: '我现在在开会，稍后回复你',
            priority: 9,
            isEnabled: true
        },
        
        // 重要工作 - 高优先级，完全自动回复
        'important_work': {
            activityType: 'important_work',
            replyStrategy: 'auto',
            statusText: '重要工作中',
            autoReplyTemplate: '我在处理重要工作，稍后联系',
            priority: 8,
            isEnabled: true
        },
        
        // 学习 - 中高优先级，完全自动回复
        'study': {
            activityType: 'study',
            replyStrategy: 'auto',
            statusText: '学习中',
            autoReplyTemplate: '我在学习，请稍后联系',
            priority: 7,
            isEnabled: true
        },
        
        // 工作 - 中等优先级，忙里偷闲回复
        'work': {
            activityType: 'work',
            replyStrategy: 'busy',
            statusText: '工作中',
            autoReplyTemplate: '',
            priority: 6,
            isEnabled: true
        },
        
        // 用餐 - 中等优先级，忙里偷闲回复
        'meal': {
            activityType: 'meal',
            replyStrategy: 'busy',
            statusText: '用餐中',
            autoReplyTemplate: '',
            priority: 5,
            isEnabled: true
        },
        
        // 运动 - 中等优先级，忙里偷闲回复
        'exercise': {
            activityType: 'exercise',
            replyStrategy: 'busy',
            statusText: '运动中',
            autoReplyTemplate: '',
            priority: 4,
            isEnabled: true
        },
        
        // 休息 - 低优先级，忙里偷闲回复
        'rest': {
            activityType: 'rest',
            replyStrategy: 'busy',
            statusText: '休息中',
            autoReplyTemplate: '',
            priority: 3,
            isEnabled: true
        },
        
        // 娱乐 - 低优先级，正常回复
        'entertainment': {
            activityType: 'entertainment',
            replyStrategy: 'normal',
            statusText: '娱乐中',
            autoReplyTemplate: '',
            priority: 2,
            isEnabled: true
        },
        
        // 空闲 - 最低优先级，正常回复
        'free': {
            activityType: 'free',
            replyStrategy: 'normal',
            statusText: '在线',
            autoReplyTemplate: '',
            priority: 1,
            isEnabled: true
        },
        
        // 未知活动 - 默认配置
        'unknown': {
            activityType: 'unknown',
            replyStrategy: 'normal',
            statusText: '忙碌中',
            autoReplyTemplate: '',
            priority: 0,
            isEnabled: true
        }
    },
    
    // 回复策略类型说明
    replyStrategies: {
        'auto': {
            name: '完全自动回复',
            description: '返回预设消息，不调用AI模型',
            behavior: 'auto_reply'
        },
        'busy': {
            name: '忙里偷闲回复',
            description: '调用AI模型但添加简短回复指令',
            behavior: 'busy_reply'
        },
        'normal': {
            name: '正常回复',
            description: '正常的AI对话流程',
            behavior: 'normal_reply'
        }
    },
    
    /**
     * 初始化配置系统
     */
    init() {
        console.log('⚙️ [状态配置] 初始化配置系统...');
        
        // 加载用户自定义配置
        this.loadUserConfigs();
        
        console.log('✅ [状态配置] 配置系统初始化完成');
    },
    
    /**
     * 获取活动类型配置
     */
    getActivityConfig(activityType) {
        // 先尝试获取用户自定义配置
        const userConfigs = this.getUserConfigs();
        if (userConfigs[activityType]) {
            return userConfigs[activityType];
        }
        
        // 回退到默认配置
        if (this.defaultConfigs[activityType]) {
            return this.defaultConfigs[activityType];
        }
        
        // 如果都没有，返回未知活动配置
        return this.defaultConfigs['unknown'];
    },
    
    /**
     * 获取所有配置
     */
    getAllConfigs() {
        const userConfigs = this.getUserConfigs();
        const allConfigs = { ...this.defaultConfigs };
        
        // 用户配置覆盖默认配置
        Object.keys(userConfigs).forEach(key => {
            allConfigs[key] = userConfigs[key];
        });
        
        return allConfigs;
    },
    
    /**
     * 更新活动类型配置
     */
    updateActivityConfig(activityType, config) {
        try {
            const userConfigs = this.getUserConfigs();
            
            // 验证配置
            const validatedConfig = this.validateConfig(config);
            if (!validatedConfig) {
                throw new Error('配置验证失败');
            }
            
            // 更新配置
            userConfigs[activityType] = {
                ...validatedConfig,
                activityType: activityType,
                lastUpdated: new Date().toISOString()
            };
            
            // 保存到localStorage
            localStorage.setItem('aiAutoStatus_userConfigs', JSON.stringify(userConfigs));
            
            console.log(`✅ [状态配置] 活动类型 ${activityType} 配置已更新`);
            return true;
            
        } catch (error) {
            console.error(`❌ [状态配置] 更新活动类型 ${activityType} 配置失败:`, error);
            return false;
        }
    },
    
    /**
     * 删除活动类型配置（恢复默认）
     */
    deleteActivityConfig(activityType) {
        try {
            const userConfigs = this.getUserConfigs();
            
            if (userConfigs[activityType]) {
                delete userConfigs[activityType];
                localStorage.setItem('aiAutoStatus_userConfigs', JSON.stringify(userConfigs));
                console.log(`✅ [状态配置] 活动类型 ${activityType} 配置已删除，恢复默认`);
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error(`❌ [状态配置] 删除活动类型 ${activityType} 配置失败:`, error);
            return false;
        }
    },
    
    /**
     * 获取用户自定义配置
     */
    getUserConfigs() {
        try {
            const configs = localStorage.getItem('aiAutoStatus_userConfigs');
            return configs ? JSON.parse(configs) : {};
        } catch (error) {
            console.error('❌ [状态配置] 获取用户配置失败:', error);
            return {};
        }
    },
    
    /**
     * 加载用户自定义配置
     */
    loadUserConfigs() {
        try {
            const userConfigs = this.getUserConfigs();
            console.log(`📋 [状态配置] 加载了 ${Object.keys(userConfigs).length} 个用户自定义配置`);
        } catch (error) {
            console.error('❌ [状态配置] 加载用户配置失败:', error);
        }
    },
    
    /**
     * 验证配置
     */
    validateConfig(config) {
        if (!config || typeof config !== 'object') {
            return null;
        }
        
        // 必需字段
        const requiredFields = ['replyStrategy', 'statusText', 'priority'];
        for (const field of requiredFields) {
            if (!(field in config)) {
                console.error(`❌ [状态配置] 配置缺少必需字段: ${field}`);
                return null;
            }
        }
        
        // 验证回复策略
        if (!this.replyStrategies[config.replyStrategy]) {
            console.error(`❌ [状态配置] 无效的回复策略: ${config.replyStrategy}`);
            return null;
        }
        
        // 验证优先级
        if (typeof config.priority !== 'number' || config.priority < 0 || config.priority > 10) {
            console.error(`❌ [状态配置] 无效的优先级: ${config.priority}`);
            return null;
        }
        
        // 返回验证后的配置
        return {
            replyStrategy: config.replyStrategy,
            statusText: config.statusText,
            autoReplyTemplate: config.autoReplyTemplate || '',
            priority: config.priority,
            isEnabled: config.isEnabled !== false // 默认启用
        };
    },
    
    /**
     * 获取回复策略信息
     */
    getReplyStrategyInfo(strategy) {
        return this.replyStrategies[strategy] || null;
    },
    
    /**
     * 获取所有回复策略
     */
    getAllReplyStrategies() {
        return this.replyStrategies;
    },
    
    /**
     * 根据优先级排序配置
     */
    getConfigsByPriority() {
        const allConfigs = this.getAllConfigs();
        const configArray = Object.values(allConfigs);
        
        return configArray.sort((a, b) => b.priority - a.priority);
    },
    
    /**
     * 获取启用的配置
     */
    getEnabledConfigs() {
        const allConfigs = this.getAllConfigs();
        const enabledConfigs = {};
        
        Object.keys(allConfigs).forEach(key => {
            if (allConfigs[key].isEnabled) {
                enabledConfigs[key] = allConfigs[key];
            }
        });
        
        return enabledConfigs;
    },
    
    /**
     * 重置所有配置到默认值
     */
    resetToDefaults() {
        try {
            localStorage.removeItem('aiAutoStatus_userConfigs');
            console.log('✅ [状态配置] 所有配置已重置为默认值');
            return true;
        } catch (error) {
            console.error('❌ [状态配置] 重置配置失败:', error);
            return false;
        }
    },
    
    /**
     * 导出配置
     */
    exportConfigs() {
        const allConfigs = this.getAllConfigs();
        const exportData = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            configs: allConfigs
        };
        
        return JSON.stringify(exportData, null, 2);
    },
    
    /**
     * 导入配置
     */
    importConfigs(configData) {
        try {
            const data = typeof configData === 'string' ? JSON.parse(configData) : configData;
            
            if (!data.configs || typeof data.configs !== 'object') {
                throw new Error('无效的配置数据格式');
            }
            
            // 验证每个配置
            const validConfigs = {};
            Object.keys(data.configs).forEach(key => {
                const validatedConfig = this.validateConfig(data.configs[key]);
                if (validatedConfig) {
                    validConfigs[key] = {
                        ...validatedConfig,
                        activityType: key
                    };
                }
            });
            
            // 保存配置
            localStorage.setItem('aiAutoStatus_userConfigs', JSON.stringify(validConfigs));
            
            console.log(`✅ [状态配置] 成功导入 ${Object.keys(validConfigs).length} 个配置`);
            return true;
            
        } catch (error) {
            console.error('❌ [状态配置] 导入配置失败:', error);
            return false;
        }
    },
    
    /**
     * 获取配置统计信息
     */
    getConfigStats() {
        const allConfigs = this.getAllConfigs();
        const userConfigs = this.getUserConfigs();
        
        const stats = {
            total: Object.keys(allConfigs).length,
            default: Object.keys(this.defaultConfigs).length,
            custom: Object.keys(userConfigs).length,
            enabled: Object.values(allConfigs).filter(c => c.isEnabled).length,
            byStrategy: {}
        };
        
        // 按策略统计
        Object.values(allConfigs).forEach(config => {
            const strategy = config.replyStrategy;
            if (!stats.byStrategy[strategy]) {
                stats.byStrategy[strategy] = 0;
            }
            stats.byStrategy[strategy]++;
        });
        
        return stats;
    }
};

// 导出到全局作用域
window.StatusConfig = StatusConfig;

console.log('✅ [状态配置] 状态配置管理已加载');