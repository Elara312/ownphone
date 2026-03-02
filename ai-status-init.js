// ==================== AI自动状态系统 - 系统初始化 ====================

/**
 * AI自动状态系统的主初始化模块
 * 负责系统的启动、集成和管理
 */

const AIStatusInit = {
    // 初始化状态
    isInitialized: false,
    initPromise: null,
    
    // 依赖检查
    dependencies: [
        'AIAutoStatus',
        'StatusConfig', 
        'AIStatusIntegration',
        'AIStatusUI'
    ],
    
    /**
     * 初始化整个AI自动状态系统
     */
    async init() {
        if (this.isInitialized) {
            console.log('🚀 [系统初始化] AI自动状态系统已初始化');
            return true;
        }
        
        // 如果正在初始化，返回现有的Promise
        if (this.initPromise) {
            return await this.initPromise;
        }
        
        // 创建初始化Promise
        this.initPromise = this.performInit();
        
        try {
            const result = await this.initPromise;
            this.isInitialized = result;
            return result;
        } catch (error) {
            console.error('❌ [系统初始化] 初始化失败:', error);
            this.initPromise = null;
            return false;
        }
    },
    
    /**
     * 执行初始化
     */
    async performInit() {
        try {
            console.log('🚀 [系统初始化] 开始初始化AI自动状态系统...');
            
            // 1. 检查依赖
            if (!this.checkDependencies()) {
                throw new Error('依赖检查失败');
            }
            
            // 2. 初始化核心系统
            console.log('📦 [系统初始化] 初始化核心系统...');
            const coreInitSuccess = await AIAutoStatus.init();
            if (!coreInitSuccess) {
                throw new Error('核心系统初始化失败');
            }
            
            // 3. 初始化聊天系统集成
            console.log('🔗 [系统初始化] 初始化聊天系统集成...');
            const integrationInitSuccess = AIStatusIntegration.init();
            if (!integrationInitSuccess) {
                console.warn('⚠️ [系统初始化] 聊天系统集成初始化失败，但系统可以继续运行');
            }
            
            // 4. 初始化UI系统
            console.log('🎨 [系统初始化] 初始化UI系统...');
            const uiInitSuccess = AIStatusUI.init();
            if (!uiInitSuccess) {
                console.warn('⚠️ [系统初始化] UI系统初始化失败，但系统可以继续运行');
            }
            
            // 5. 设置系统监控
            this.setupSystemMonitoring();
            
            // 6. 注册清理函数
            this.registerCleanupHandlers();
            
            console.log('✅ [系统初始化] AI自动状态系统初始化完成');
            
            // 7. 显示系统状态
            this.logSystemStatus();
            
            return true;
            
        } catch (error) {
            console.error('❌ [系统初始化] 初始化过程中发生错误:', error);
            
            // 尝试清理已初始化的组件
            this.cleanup();
            
            return false;
        }
    },
    
    /**
     * 检查依赖
     */
    checkDependencies() {
        console.log('🔍 [系统初始化] 检查依赖...');
        
        const missingDeps = [];
        
        for (const dep of this.dependencies) {
            if (!window[dep]) {
                missingDeps.push(dep);
            }
        }
        
        if (missingDeps.length > 0) {
            console.error('❌ [系统初始化] 缺少依赖:', missingDeps);
            return false;
        }
        
        console.log('✅ [系统初始化] 依赖检查通过');
        return true;
    },
    
    /**
     * 设置系统监控
     */
    setupSystemMonitoring() {
        console.log('📊 [系统初始化] 设置系统监控...');
        
        // 每5分钟检查一次系统健康状态
        setInterval(() => {
            this.checkSystemHealth();
        }, 5 * 60 * 1000);
        
        // 监听页面卸载事件
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        console.log('✅ [系统初始化] 系统监控已设置');
    },
    
    /**
     * 检查系统健康状态
     */
    checkSystemHealth() {
        try {
            const status = this.getSystemStatus();
            
            // 检查核心组件是否正常运行
            if (!status.core.isRunning) {
                console.warn('⚠️ [系统监控] 核心系统未运行，尝试重启...');
                AIAutoStatus.start();
            }
            
            // 检查错误率
            if (status.core.errorCount > 10) {
                console.warn('⚠️ [系统监控] 错误率过高，系统可能存在问题');
            }
            
            // 记录健康检查日志
            console.log('💚 [系统监控] 系统健康检查完成:', {
                timestamp: new Date().toISOString(),
                status: status
            });
            
        } catch (error) {
            console.error('❌ [系统监控] 健康检查失败:', error);
        }
    },
    
    /**
     * 注册清理函数
     */
    registerCleanupHandlers() {
        console.log('🧹 [系统初始化] 注册清理函数...');
        
        // 页面隐藏时暂停系统
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('⏸️ [系统监控] 页面隐藏，暂停系统');
                this.pause();
            } else {
                console.log('▶️ [系统监控] 页面显示，恢复系统');
                this.resume();
            }
        });
        
        console.log('✅ [系统初始化] 清理函数已注册');
    },
    
    /**
     * 暂停系统
     */
    pause() {
        try {
            if (AIAutoStatus && AIAutoStatus.isRunning) {
                AIAutoStatus.stop();
                console.log('⏸️ [系统控制] 系统已暂停');
            }
        } catch (error) {
            console.error('❌ [系统控制] 暂停系统失败:', error);
        }
    },
    
    /**
     * 恢复系统
     */
    resume() {
        try {
            if (AIAutoStatus && !AIAutoStatus.isRunning && !AIAutoStatus.isInSafeMode) {
                AIAutoStatus.start();
                console.log('▶️ [系统控制] 系统已恢复');
            }
        } catch (error) {
            console.error('❌ [系统控制] 恢复系统失败:', error);
        }
    },
    
    /**
     * 清理系统
     */
    cleanup() {
        try {
            console.log('🧹 [系统清理] 开始清理系统...');
            
            // 停止核心系统
            if (AIAutoStatus && AIAutoStatus.isRunning) {
                AIAutoStatus.stop();
            }
            
            // 恢复聊天系统集成
            if (AIStatusIntegration && AIStatusIntegration.isIntegrated) {
                AIStatusIntegration.restore();
            }
            
            console.log('✅ [系统清理] 系统清理完成');
            
        } catch (error) {
            console.error('❌ [系统清理] 清理系统失败:', error);
        }
    },
    
    /**
     * 获取系统状态
     */
    getSystemStatus() {
        const status = {
            initialized: this.isInitialized,
            timestamp: new Date().toISOString(),
            core: AIAutoStatus ? AIAutoStatus.getSystemStatus() : null,
            integration: AIStatusIntegration ? AIStatusIntegration.getStatus() : null,
            ui: AIStatusUI ? AIStatusUI.getStatus() : null,
            performance: PerformanceMonitor ? PerformanceMonitor.getPerformanceReport() : null
        };
        
        return status;
    },
    
    /**
     * 记录系统状态
     */
    logSystemStatus() {
        const status = this.getSystemStatus();
        
        console.log('📊 [系统状态] AI自动状态系统状态报告:');
        console.log('  🤖 核心系统:', status.core ? '✅ 正常' : '❌ 异常');
        console.log('  🔗 聊天集成:', status.integration?.isIntegrated ? '✅ 已集成' : '⚠️ 未集成');
        console.log('  🎨 UI系统:', status.ui?.isInitialized ? '✅ 已初始化' : '⚠️ 未初始化');
        console.log('  ⚡ 性能监控:', status.performance ? '✅ 正常' : '⚠️ 未启用');
        
        if (status.core) {
            console.log('  📈 运行状态:', status.core.isRunning ? '运行中' : '已停止');
            console.log('  🛡️ 安全模式:', status.core.isInSafeMode ? '已激活' : '未激活');
            console.log('  ❌ 错误计数:', status.core.errorCount);
        }
    },
    
    /**
     * 重启系统
     */
    async restart() {
        try {
            console.log('🔄 [系统控制] 重启系统...');
            
            // 清理现有系统
            this.cleanup();
            
            // 重置状态
            this.isInitialized = false;
            this.initPromise = null;
            
            // 重新初始化
            const success = await this.init();
            
            if (success) {
                console.log('✅ [系统控制] 系统重启成功');
            } else {
                console.error('❌ [系统控制] 系统重启失败');
            }
            
            return success;
            
        } catch (error) {
            console.error('❌ [系统控制] 重启系统失败:', error);
            return false;
        }
    },
    
    /**
     * 获取系统诊断信息
     */
    getDiagnostics() {
        const diagnostics = {
            timestamp: new Date().toISOString(),
            system: this.getSystemStatus(),
            dependencies: {},
            errors: []
        };
        
        // 检查依赖状态
        for (const dep of this.dependencies) {
            diagnostics.dependencies[dep] = {
                available: !!window[dep],
                type: typeof window[dep]
            };
        }
        
        // 获取错误日志
        try {
            const errorLogs = localStorage.getItem('aiAutoStatus_errorLogs');
            if (errorLogs) {
                diagnostics.errors = JSON.parse(errorLogs).slice(0, 10); // 最近10个错误
            }
        } catch (error) {
            diagnostics.errors.push({
                message: '无法读取错误日志',
                error: error.message
            });
        }
        
        return diagnostics;
    }
};

// 导出到全局作用域
window.AIStatusInit = AIStatusInit;

// 自动初始化（延迟执行，确保所有依赖都已加载）
setTimeout(() => {
    if (document.readyState === 'complete') {
        AIStatusInit.init();
    } else {
        window.addEventListener('load', () => {
            AIStatusInit.init();
        });
    }
}, 1000);

console.log('✅ [系统初始化] AI自动状态系统初始化模块已加载');