// ==================== AI自动状态系统 - UI集成 ====================

/**
 * AI自动状态系统的用户界面集成模块
 * 负责在现有界面中添加状态显示和手动设置功能
 */

const AIStatusUI = {
    // UI状态
    isInitialized: false,
    statusModal: null,
    statusHistoryModal: null,
    
    // UI元素引用
    elements: {
        statusIndicator: null,
        statusButton: null,
        statusModal: null,
        historyModal: null
    },
    
    /**
     * 初始化UI集成
     */
    init() {
        if (this.isInitialized) {
            console.log('🎨 [状态UI] UI已初始化');
            return;
        }
        
        try {
            console.log('🎨 [状态UI] 开始初始化状态UI...');
            
            // 检查依赖
            if (!window.AIAutoStatus || !window.AIAutoStatus.isInitialized) {
                console.error('❌ [状态UI] AI自动状态系统未初始化');
                return false;
            }
            
            // 创建UI组件
            this.createStatusIndicator();
            this.createStatusModal();
            this.createStatusHistoryModal();
            
            // 绑定事件
            this.bindEvents();
            
            // 启动状态更新
            this.startStatusUpdates();
            
            this.isInitialized = true;
            console.log('✅ [状态UI] 状态UI初始化完成');
            return true;
            
        } catch (error) {
            console.error('❌ [状态UI] 初始化UI失败:', error);
            return false;
        }
    },
    
    /**
     * 创建状态指示器
     */
    createStatusIndicator() {
        // 查找聊天状态元素
        const chatStatus = document.getElementById('chatStatus');
        if (!chatStatus) {
            console.warn('⚠️ [状态UI] 未找到chatStatus元素，跳过状态指示器创建');
            return;
        }
        
        // 添加点击事件和样式
        chatStatus.style.cursor = 'pointer';
        chatStatus.title = '点击查看状态详情和手动设置';
        
        // 添加状态来源指示器
        const sourceIndicator = document.createElement('span');
        sourceIndicator.id = 'statusSourceIndicator';
        sourceIndicator.className = 'status-source-indicator';
        sourceIndicator.style.cssText = `
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4CAF50;
            margin-left: 6px;
            vertical-align: middle;
        `;
        
        chatStatus.appendChild(sourceIndicator);
        this.elements.statusIndicator = sourceIndicator;
        
        console.log('✅ [状态UI] 状态指示器已创建');
    },
    
    /**
     * 创建状态设置模态框
     */
    createStatusModal() {
        const modal = document.createElement('div');
        modal.id = 'aiStatusModal';
        modal.className = 'ai-status-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div class="ai-status-modal-content" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            ">
                <div class="ai-status-modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #eee;
                ">
                    <h3 style="margin: 0; color: #333;">状态管理</h3>
                    <button class="ai-status-close-btn" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">&times;</button>
                </div>
                
                <div class="ai-status-current" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #555;">当前状态</h4>
                    <div class="ai-status-display" style="
                        padding: 12px;
                        background: #f5f5f5;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <span class="ai-status-text" style="flex: 1; font-weight: 500;">在线</span>
                        <span class="ai-status-source" style="
                            font-size: 12px;
                            color: #666;
                            background: #e0e0e0;
                            padding: 2px 8px;
                            border-radius: 12px;
                        ">自动</span>
                    </div>
                </div>
                
                <div class="ai-status-manual" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #555;">手动设置</h4>
                    <div style="margin-bottom: 12px;">
                        <select class="ai-status-select" style="
                            width: 100%;
                            padding: 8px 12px;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                            <option value="">选择状态...</option>
                            <option value="online">在线</option>
                            <option value="busy">忙碌中</option>
                            <option value="away">离开</option>
                            <option value="offline">离线</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="ai-status-set-btn" style="
                            flex: 1;
                            padding: 8px 16px;
                            background: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">设置状态</button>
                        <button class="ai-status-clear-btn" style="
                            flex: 1;
                            padding: 8px 16px;
                            background: #f44336;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">清除手动设置</button>
                    </div>
                </div>
                
                <div class="ai-status-actions" style="
                    display: flex;
                    gap: 8px;
                    padding-top: 12px;
                    border-top: 1px solid #eee;
                ">
                    <button class="ai-status-history-btn" style="
                        flex: 1;
                        padding: 8px 16px;
                        background: #2196F3;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    ">查看历史</button>
                    <button class="ai-status-config-btn" style="
                        flex: 1;
                        padding: 8px 16px;
                        background: #FF9800;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    ">配置管理</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.elements.statusModal = modal;
        
        console.log('✅ [状态UI] 状态设置模态框已创建');
    },
    
    /**
     * 创建状态历史模态框
     */
    createStatusHistoryModal() {
        const modal = document.createElement('div');
        modal.id = 'aiStatusHistoryModal';
        modal.className = 'ai-status-history-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div class="ai-status-history-content" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            ">
                <div class="ai-status-history-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #eee;
                ">
                    <h3 style="margin: 0; color: #333;">状态历史记录</h3>
                    <button class="ai-status-history-close-btn" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">&times;</button>
                </div>
                
                <div class="ai-status-history-list" style="
                    max-height: 400px;
                    overflow-y: auto;
                ">
                    <!-- 历史记录将动态生成 -->
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.elements.historyModal = modal;
        
        console.log('✅ [状态UI] 状态历史模态框已创建');
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 状态点击事件
        const chatStatus = document.getElementById('chatStatus');
        if (chatStatus) {
            chatStatus.addEventListener('click', () => {
                this.showStatusModal();
            });
        }
        
        // 状态模态框事件
        if (this.elements.statusModal) {
            const modal = this.elements.statusModal;
            
            // 关闭按钮
            modal.querySelector('.ai-status-close-btn').addEventListener('click', () => {
                this.hideStatusModal();
            });
            
            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideStatusModal();
                }
            });
            
            // 设置状态按钮
            modal.querySelector('.ai-status-set-btn').addEventListener('click', () => {
                this.setManualStatus();
            });
            
            // 清除手动设置按钮
            modal.querySelector('.ai-status-clear-btn').addEventListener('click', () => {
                this.clearManualStatus();
            });
            
            // 查看历史按钮
            modal.querySelector('.ai-status-history-btn').addEventListener('click', () => {
                this.showStatusHistory();
            });
            
            // 配置管理按钮
            modal.querySelector('.ai-status-config-btn').addEventListener('click', () => {
                this.showConfigManager();
            });
        }
        
        // 历史模态框事件
        if (this.elements.historyModal) {
            const modal = this.elements.historyModal;
            
            // 关闭按钮
            modal.querySelector('.ai-status-history-close-btn').addEventListener('click', () => {
                this.hideStatusHistory();
            });
            
            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideStatusHistory();
                }
            });
        }
        
        console.log('✅ [状态UI] 事件绑定完成');
    },
    
    /**
     * 启动状态更新
     */
    startStatusUpdates() {
        // 立即更新一次
        this.updateStatusDisplay();
        
        // 每30秒更新一次UI
        setInterval(() => {
            this.updateStatusDisplay();
        }, 30000);
        
        console.log('✅ [状态UI] 状态更新已启动');
    },
    
    /**
     * 更新状态显示
     */
    updateStatusDisplay() {
        try {
            // 获取当前聊天联系人
            const contactId = this.getCurrentContactId();
            if (!contactId) return;
            
            // 获取状态信息
            let statusInfo = null;
            let source = 'auto';
            
            // 检查手动覆盖
            if (AIAutoStatus.priorityOverrideManager.hasManualOverride(contactId)) {
                statusInfo = AIAutoStatus.priorityOverrideManager.getManualStatus(contactId);
                source = 'manual';
            } else {
                statusInfo = AIAutoStatus.statusManager.getCurrentStatus(contactId);
                source = 'auto';
            }
            
            // 更新状态文本
            const chatStatus = document.getElementById('chatStatus');
            if (chatStatus && statusInfo) {
                chatStatus.textContent = statusInfo.currentStatus || '在线';
            }
            
            // 更新来源指示器
            if (this.elements.statusIndicator) {
                const color = source === 'manual' ? '#FF9800' : '#4CAF50';
                this.elements.statusIndicator.style.background = color;
                this.elements.statusIndicator.title = source === 'manual' ? '手动设置' : '自动更新';
            }
            
        } catch (error) {
            console.error('❌ [状态UI] 更新状态显示失败:', error);
        }
    },
    
    /**
     * 显示状态模态框
     */
    showStatusModal() {
        if (!this.elements.statusModal) return;
        
        // 更新模态框内容
        this.updateStatusModalContent();
        
        // 显示模态框
        this.elements.statusModal.style.display = 'flex';
    },
    
    /**
     * 隐藏状态模态框
     */
    hideStatusModal() {
        if (this.elements.statusModal) {
            this.elements.statusModal.style.display = 'none';
        }
    },
    
    /**
     * 更新状态模态框内容
     */
    updateStatusModalContent() {
        const contactId = this.getCurrentContactId();
        if (!contactId) return;
        
        const modal = this.elements.statusModal;
        
        // 获取当前状态
        let statusInfo = null;
        let source = 'auto';
        
        if (AIAutoStatus.priorityOverrideManager.hasManualOverride(contactId)) {
            statusInfo = AIAutoStatus.priorityOverrideManager.getManualStatus(contactId);
            source = 'manual';
        } else {
            statusInfo = AIAutoStatus.statusManager.getCurrentStatus(contactId);
            source = 'auto';
        }
        
        // 更新状态显示
        const statusText = modal.querySelector('.ai-status-text');
        const statusSource = modal.querySelector('.ai-status-source');
        
        if (statusText && statusInfo) {
            statusText.textContent = statusInfo.currentStatus || '在线';
        }
        
        if (statusSource) {
            statusSource.textContent = source === 'manual' ? '手动' : '自动';
            statusSource.style.background = source === 'manual' ? '#FF9800' : '#4CAF50';
            statusSource.style.color = 'white';
        }
    },
    
    /**
     * 设置手动状态
     */
    setManualStatus() {
        const contactId = this.getCurrentContactId();
        if (!contactId) return;
        
        const modal = this.elements.statusModal;
        const select = modal.querySelector('.ai-status-select');
        const selectedValue = select.value;
        
        if (!selectedValue) {
            alert('请选择一个状态');
            return;
        }
        
        // 状态映射
        const statusMap = {
            'online': { currentStatus: '在线', activityType: 'free', statusType: 'online' },
            'busy': { currentStatus: '忙碌中', activityType: 'work', statusType: 'busy' },
            'away': { currentStatus: '离开', activityType: 'rest', statusType: 'away' },
            'offline': { currentStatus: '离线', activityType: 'sleep', statusType: 'offline' }
        };
        
        const status = statusMap[selectedValue];
        if (!status) return;
        
        // 设置手动状态
        const success = AIAutoStatus.priorityOverrideManager.setManualStatus(contactId, status);
        
        if (success) {
            alert('手动状态设置成功！将在24小时后自动失效。');
            this.updateStatusModalContent();
            this.updateStatusDisplay();
        } else {
            alert('设置手动状态失败，请重试。');
        }
    },
    
    /**
     * 清除手动状态
     */
    clearManualStatus() {
        const contactId = this.getCurrentContactId();
        if (!contactId) return;
        
        const success = AIAutoStatus.priorityOverrideManager.clearManualStatus(contactId);
        
        if (success) {
            alert('手动状态已清除，恢复自动管理。');
            this.updateStatusModalContent();
            this.updateStatusDisplay();
        } else {
            alert('清除手动状态失败，可能没有设置手动状态。');
        }
    },
    
    /**
     * 显示状态历史
     */
    showStatusHistory() {
        if (!this.elements.historyModal) return;
        
        const contactId = this.getCurrentContactId();
        if (!contactId) return;
        
        // 获取状态历史
        const history = AIAutoStatus.statusManager.getStatusHistory(contactId);
        
        // 更新历史列表
        const historyList = this.elements.historyModal.querySelector('.ai-status-history-list');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无状态历史记录</p>';
        } else {
            historyList.innerHTML = history.map(item => `
                <div style="
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <div style="font-weight: 500; margin-bottom: 4px;">${item.reason}</div>
                        <div style="font-size: 12px; color: #666;">
                            ${new Date(item.timestamp).toLocaleString()}
                        </div>
                    </div>
                    <span style="
                        font-size: 12px;
                        color: white;
                        background: ${item.source === 'manual' ? '#FF9800' : '#4CAF50'};
                        padding: 2px 8px;
                        border-radius: 12px;
                    ">${item.source === 'manual' ? '手动' : '自动'}</span>
                </div>
            `).join('');
        }
        
        // 显示历史模态框
        this.elements.historyModal.style.display = 'flex';
    },
    
    /**
     * 隐藏状态历史
     */
    hideStatusHistory() {
        if (this.elements.historyModal) {
            this.elements.historyModal.style.display = 'none';
        }
    },
    
    /**
     * 显示配置管理器
     */
    showConfigManager() {
        // 这里可以实现配置管理界面
        alert('配置管理功能开发中...');
    },
    
    /**
     * 获取当前联系人ID
     */
    getCurrentContactId() {
        // 尝试从全局变量获取
        if (typeof currentChatContactId !== 'undefined') {
            return currentChatContactId;
        }
        
        // 备用方法：从URL或其他地方获取
        return null;
    },
    
    /**
     * 获取UI状态
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasStatusModal: !!this.elements.statusModal,
            hasHistoryModal: !!this.elements.historyModal,
            hasStatusIndicator: !!this.elements.statusIndicator
        };
    }
};

// 导出到全局作用域
window.AIStatusUI = AIStatusUI;

console.log('✅ [状态UI] AI状态系统UI模块已加载');