// ==================== AI自动状态系统 - 聊天系统集成 ====================

/**
 * AI自动状态系统与聊天系统的集成模块
 * 通过拦截和增强现有的AI回复流程来实现智能回复判定
 */

const AIStatusIntegration = {
    // 集成状态
    isIntegrated: false,
    originalGetAIResponse: null,
    
    /**
     * 初始化集成
     */
    init() {
        if (this.isIntegrated) {
            console.log('🔗 [状态集成] 集成已初始化');
            return;
        }
        
        try {
            console.log('🔗 [状态集成] 开始初始化聊天系统集成...');
            
            // 检查依赖
            if (!window.AIAutoStatus || !window.AIAutoStatus.isInitialized) {
                console.error('❌ [状态集成] AI自动状态系统未初始化');
                return false;
            }
            
            // 拦截原始的getAIResponse函数
            this.interceptGetAIResponse();
            
            this.isIntegrated = true;
            console.log('✅ [状态集成] 聊天系统集成完成');
            return true;
            
        } catch (error) {
            console.error('❌ [状态集成] 初始化集成失败:', error);
            return false;
        }
    },
    
    /**
     * 拦截getAIResponse函数
     */
    interceptGetAIResponse() {
        // 检查getAIResponse函数是否存在
        if (typeof window.getAIResponse !== 'function') {
            console.error('❌ [状态集成] getAIResponse函数不存在');
            return;
        }
        
        // 保存原始函数
        this.originalGetAIResponse = window.getAIResponse;
        
        // 创建增强版本
        window.getAIResponse = async (contact, userMessage) => {
            return await this.enhancedGetAIResponse(contact, userMessage);
        };
        
        console.log('✅ [状态集成] getAIResponse函数已被拦截和增强');
    },
    
    /**
     * 增强版的getAIResponse函数
     */
    async enhancedGetAIResponse(contact, userMessage) {
        try {
            // 1. 调用回复分析器判定策略
            const strategy = await AIAutoStatus.replyAnalyzer.analyzeReplyStrategy(contact.id, userMessage);
            
            console.log(`🧠 [状态集成] 联系人 ${contact.name} 回复策略: ${strategy.type}`);
            
            return await this.handleNormalReply(contact, userMessage, strategy);
            
        } catch (error) {
            console.error('❌ [状态集成] 增强AI回复处理失败:', error);
            
            // 降级处理：调用原始函数
            return await this.originalGetAIResponse(contact, userMessage);
        }
    },
    
    /**
     * 处理自动回复
     */
    async handleAutoReply(contact, userMessage, strategy) {
        try {
            console.log(`🤖 [状态集成] 处理自动回复 - ${contact.name}`);
            
            // 生成自动回复消息
            const autoReply = AIAutoStatus.replyAnalyzer.generateAutoReply(
                contact.id, 
                strategy.activityType, 
                strategy.autoReply
            );
            
            // 模拟AI回复的延迟和格式
            setTimeout(() => {
                this.sendAutoReply(contact, autoReply);
            }, 1000 + Math.random() * 2000); // 1-3秒随机延迟
            
            return; // 不返回值，因为回复是异步发送的
            
        } catch (error) {
            console.error('❌ [状态集成] 处理自动回复失败:', error);
            // 降级到正常回复
            return await this.handleNormalReply(contact, userMessage, strategy);
        }
    },
    
    /**
     * 处理忙碌回复
     */
    async handleBusyReply(contact, userMessage, strategy) {
        try {
            console.log(`⏰ [状态集成] 处理忙碌回复 - ${contact.name}`);
            
            // 构建忙碌回复的提示词
            const busyPrompt = AIAutoStatus.replyAnalyzer.buildBusyReplyPrompt(contact, userMessage, strategy);
            
            // 修改联系人的临时系统提示词
            const originalSystemPrompt = this.getContactSystemPrompt(contact);
            const enhancedSystemPrompt = this.buildEnhancedSystemPrompt(originalSystemPrompt, busyPrompt, strategy);
            
            // 临时修改联系人配置
            const tempContact = {
                ...contact,
                tempSystemPrompt: enhancedSystemPrompt
            };
            
            // 调用原始AI函数，但使用增强的提示词
            return await this.callOriginalAIWithEnhancedPrompt(tempContact, userMessage, busyPrompt);
            
        } catch (error) {
            console.error('❌ [状态集成] 处理忙碌回复失败:', error);
            // 降级到正常回复
            return await this.handleNormalReply(contact, userMessage, strategy);
        }
    },
    
    /**
     * 处理正常回复
     */
    async handleNormalReply(contact, userMessage, strategy) {
        try {
            console.log(`💬 [状态集成] 处理正常回复 - ${contact.name}`);
            
            // 添加状态上下文到系统提示词
            const statusContext = this.buildStatusContext(strategy);
            const enhancedContact = this.addStatusContextToContact(contact, statusContext);
            
            // 调用原始AI函数
            return await this.originalGetAIResponse(enhancedContact, userMessage);
            
        } catch (error) {
            console.error('❌ [状态集成] 处理正常回复失败:', error);
            // 最后的降级：直接调用原始函数
            return await this.originalGetAIResponse(contact, userMessage);
        }
    },
    
    /**
     * 发送自动回复
     */
    sendAutoReply(contact, replyText) {
        try {
            // 模拟AI回复的格式
            const replies = [replyText];
            
            // 检查是否有sendRepliesOneByOne函数
            if (typeof window.sendRepliesOneByOne === 'function') {
                window.sendRepliesOneByOne(contact, replies);
            } else {
                // 备用方法：直接添加消息
                this.addMessageToChat(contact, replyText, 'received');
            }
            
            console.log(`✅ [状态集成] 自动回复已发送: ${replyText}`);
            
        } catch (error) {
            console.error('❌ [状态集成] 发送自动回复失败:', error);
        }
    },
    
    /**
     * 获取联系人的系统提示词
     */
    getContactSystemPrompt(contact) {
        // 尝试从现有系统获取
        if (contact.systemPrompt) {
            return contact.systemPrompt;
        }
        
        // 备用：构建基本提示词
        return `你是${contact.name}，请保持角色一致性。`;
    },
    
    /**
     * 构建增强的系统提示词
     */
    buildEnhancedSystemPrompt(originalPrompt, busyPrompt, strategy) {
        const statusInfo = StatusConfig.getActivityConfig(strategy.activityType);
        
        const enhancement = `
        
[当前状态] 你现在正在${statusInfo.statusText}，比较忙碌。
[回复要求] ${busyPrompt.systemPrompt}
[注意事项] 保持简洁，体现忙碌状态，但要友好。`;
        
        return originalPrompt + enhancement;
    },
    
    /**
     * 构建状态上下文
     */
    buildStatusContext(strategy) {
        const statusInfo = StatusConfig.getActivityConfig(strategy.activityType);
        
        return {
            currentActivity: strategy.activityType,
            statusText: statusInfo.statusText,
            source: strategy.source,
            priority: strategy.priority
        };
    },
    
    /**
     * 为联系人添加状态上下文
     */
    addStatusContextToContact(contact, statusContext) {
        const contextPrompt = `\n\n[状态信息] 当前状态: ${statusContext.statusText}`;
        
        return {
            ...contact,
            statusContext: statusContext,
            enhancedSystemPrompt: (contact.systemPrompt || '') + contextPrompt
        };
    },
    
    /**
     * 使用增强提示词调用原始AI
     */
    async callOriginalAIWithEnhancedPrompt(contact, userMessage, busyPrompt) {
        // 这里需要更深入地集成到AI调用流程中
        // 由于不能修改原始文件，我们通过临时修改contact对象来实现
        
        const originalPrompt = contact.systemPrompt;
        contact.systemPrompt = contact.tempSystemPrompt;
        
        try {
            const result = await this.originalGetAIResponse(contact, userMessage);
            return result;
        } finally {
            // 恢复原始提示词
            contact.systemPrompt = originalPrompt;
        }
    },
    
    /**
     * 添加消息到聊天界面
     */
    addMessageToChat(contact, message, type) {
        try {
            // 检查是否有addMessage函数
            if (typeof window.addMessage === 'function') {
                window.addMessage(contact.id, message, type);
                return;
            }
            
            // 备用方法：直接操作DOM
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                const messageElement = document.createElement('div');
                messageElement.className = `message-bubble ${type}`;
                messageElement.textContent = message;
                messagesContainer.appendChild(messageElement);
                
                // 滚动到底部
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            
        } catch (error) {
            console.error('❌ [状态集成] 添加消息到聊天界面失败:', error);
        }
    },
    
    /**
     * 恢复原始函数
     */
    restore() {
        if (this.originalGetAIResponse && typeof this.originalGetAIResponse === 'function') {
            window.getAIResponse = this.originalGetAIResponse;
            this.originalGetAIResponse = null;
            this.isIntegrated = false;
            console.log('✅ [状态集成] 已恢复原始getAIResponse函数');
        }
    },
    
    /**
     * 获取集成状态
     */
    getStatus() {
        return {
            isIntegrated: this.isIntegrated,
            hasOriginalFunction: !!this.originalGetAIResponse
        };
    }
};

// 导出到全局作用域
window.AIStatusIntegration = AIStatusIntegration;

console.log('✅ [状态集成] AI状态系统聊天集成模块已加载');
