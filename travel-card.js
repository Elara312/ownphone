// ==================== 行程卡系统 - 核心逻辑 ====================

const TravelCard = {
    // 当前状态
    currentContactId: null,
    currentDate: null,
    refreshTimer: null,  // 定时刷新计时器
    cssSchemes: {},  // CSS美化方案
    currentCSSSchemeId: 'default',  // 当前使用的方案ID
    
    // 初始化
    init() {
        console.log('行程卡系统初始化...');
        this.loadCSSSchemes();  // 加载CSS方案
        this.applyCSSScheme();  // 应用CSS方案
        this.applyBackgrounds();  // 应用背景
        this.loadCustomFont();  // 加载自定义字体
        this.loadAllCards();
        this.initEventListeners();
        this.startAutoRefresh();  // 启动自动刷新
    },
    
    // 初始化事件监听
    initEventListeners() {
        // 点击模态框背景关闭
        document.getElementById('travelCardModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'travelCardModal') {
                this.closeCardModal();
            }
        });
        
        document.getElementById('settingsModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });
    },
    
    // 加载所有行程卡
    loadAllCards() {
        const contacts = this.getAllContacts();
        const cardBox = document.getElementById('travelCardBox');
        const emptyState = document.getElementById('emptyState');
        
        // 如果不在行程卡页面，不执行
        if (!cardBox || !emptyState) {
            console.log('⚠️ [行程卡] 不在行程卡页面，跳过加载');
            return;
        }
        
        if (!contacts || contacts.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        cardBox.innerHTML = '';
        
        contacts.forEach(contact => {
            const cardElement = this.createCardElement(contact);
            cardBox.appendChild(cardElement);
        });
    },
    
    // 创建卡片元素
    createCardElement(contact) {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.onclick = () => this.openCardModal(contact.id);
        
        // 使用本地日期而不是UTC日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayKey = `${year}-${month}-${day}`;
        
        const travelCardData = this.getTravelCardData(contact.id, todayKey);
        
        // 获取显示名称（备注优先，否则真实姓名）
        const displayName = contact.nickname || contact.name;
        
        // 检查是否为陈旧卡片（超过7天）
        const isOld = this.isCardOld(today);
        if (isOld) {
            card.classList.add('card-old');
        }
        
        card.innerHTML = `
            <div class="card-header">
                <img src="${contact.avatarUrl || ''}" alt="${displayName}" class="card-avatar" 
                     onerror="this.style.display='none'">
                <div class="card-info">
                    <div class="card-name">${displayName}</div>
                    <div class="card-date">${today}</div>
                </div>
            </div>
            <div class="card-preview">
                ${this.generatePreview(travelCardData)}
            </div>
            <div class="card-footer">
                <span class="card-status">${travelCardData ? '已生成' : '未生成'}</span>
                <button class="card-action-btn" onclick="event.stopPropagation(); TravelCard.generateNewCard('${contact.id}')">
                    ${travelCardData ? '刷新' : '新增'}
                </button>
            </div>
        `;
        
        return card;
    },
    
    // 生成预览内容
    generatePreview(travelCardData) {
        if (!travelCardData || !travelCardData.schedules) {
            return '<p class="preview-locked">暂无行程数据</p>';
        }
        
        const now = new Date();
        const timezone = travelCardData.timezone;
        const visibleSchedules = travelCardData.schedules
            .filter(s => this.isScheduleVisible(s, now, timezone))
            .slice(0, 3);
        
        if (visibleSchedules.length === 0) {
            return '<p class="preview-locked">今日行程尚未解锁</p>';
        }
        
        return visibleSchedules.map(schedule => `
            <div class="preview-item">
                <span class="preview-time">${schedule.time}</span>
                <span class="preview-activity">${schedule.activity}</span>
            </div>
        `).join('');
    },
    
    // 判断行程是否可见（支持跨时区）
    isScheduleVisible(schedule, currentTime, contactTimezone) {
        // 1. 数据可见性检查
        if (!schedule.isVisible) return false;

        // 如果没有时区，使用本地时区简单比较
        if (!contactTimezone) {
            const scheduleTime = new Date();
            const [hours, minutes] = schedule.time.split(':');
            scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return scheduleTime <= currentTime;
        }

        try {
            // 2. 使用 Intl 获取联系人时区的当前日期和时间
            const userNow = currentTime; // 当前用户本地时间（由外部传入）

            // 获取联系人时区的当前日期（格式：YYYY-MM-DD）
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: contactTimezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            const dateParts = dateFormatter.formatToParts(userNow);
            let contactYear, contactMonth, contactDay;
            dateParts.forEach(part => {
                if (part.type === 'year') contactYear = part.value;
                if (part.type === 'month') contactMonth = part.value;
                if (part.type === 'day') contactDay = part.value;
            });
            const contactDateStr = `${contactYear}-${contactMonth}-${contactDay}`; // 联系人的当前日期

            // 获取联系人时区的当前时间（小时:分钟）
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: contactTimezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const timeParts = timeFormatter.formatToParts(userNow);
            let contactHour, contactMinute;
            timeParts.forEach(part => {
                if (part.type === 'hour') contactHour = part.value;
                if (part.type === 'minute') contactMinute = part.value;
            });
            const contactTimeStr = `${contactHour}:${contactMinute}`;

            // 3. 比较日期
            const cardDate = this.currentDate; // 行程卡日期，格式 YYYY-MM-DD
            if (contactDateStr > cardDate) {
                // 联系人时区已经过了今天 → 所有行程可见
                console.log(`[时区] 联系人日期 ${contactDateStr} > 行程卡日期 ${cardDate} → 所有行程可见`);
                return true;
            }
            if (contactDateStr < cardDate) {
                // 联系人时区还没到这一天 → 所有行程不可见
                console.log(`[时区] 联系人日期 ${contactDateStr} < 行程卡日期 ${cardDate} → 所有行程不可见`);
                return false;
            }

            // 4. 同一天，比较时间
            const [scheduleHour, scheduleMinute] = schedule.time.split(':').map(Number);
            const contactTotal = parseInt(contactHour) * 60 + parseInt(contactMinute);
            const scheduleTotal = scheduleHour * 60 + scheduleMinute;
            const isVisible = contactTotal >= scheduleTotal;

            console.log(`[时区] 联系人时间: ${contactTimeStr}, 行程时间: ${schedule.time}, 可见: ${isVisible}`);
            return isVisible;

        } catch (error) {
            console.error('时区转换失败:', error);
            // 降级：使用本地时区比较（仅当天时间）
            const scheduleTime = new Date();
            const [hours, minutes] = schedule.time.split(':');
            scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return scheduleTime <= currentTime;
        }
    },
    
    // 打开行程卡模态框
    openCardModal(contactId) {
        this.currentContactId = contactId;
        // 使用本地日期而不是UTC日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.currentDate = `${year}-${month}-${day}`;
        
        const contact = this.getContact(contactId);
        if (!contact) return;
        
        const modal = document.getElementById('travelCardModal');
        const displayName = contact.nickname || contact.name;
        
        document.getElementById('modalAvatar').src = contact.avatarUrl || '';
        document.getElementById('modalContactName').textContent = displayName;
        document.getElementById('modalCurrentDate').textContent = this.currentDate;
        
        // 应用陈旧化效果
        const modalContent = modal.querySelector('.modal-content');
        if (this.isCardOld(this.currentDate)) {
            modalContent.classList.add('card-old');
        } else {
            modalContent.classList.remove('card-old');
        }
        
        modal.classList.add('active');
        this.loadTimeline();
    },
    
    // 关闭行程卡模态框
    closeCardModal() {
        document.getElementById('travelCardModal').classList.remove('active');
        this.currentContactId = null;
        this.currentDate = null;
        this.stopAutoRefresh();  // 停止自动刷新
    },
    
    // 启动自动刷新（每分钟）
    startAutoRefresh() {
        // 清除旧的计时器
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        // 每分钟刷新一次时间轴（解锁新的行程项）
        this.refreshTimer = setInterval(() => {
            if (this.currentContactId && this.currentDate) {
                console.log('🔄 [行程卡] 自动刷新时间轴');
                this.loadTimeline();
            }
        }, 60000);  // 60秒
        
        console.log('✅ [行程卡] 自动刷新已启动');
    },
    
    // 停止自动刷新
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
            console.log('⏹️ [行程卡] 自动刷新已停止');
        }
    },
    
    // 加载时间轴
    loadTimeline() {
        const container = document.getElementById('timelineContainer');
        const loadingState = document.getElementById('loadingState');
        
        const travelCardData = this.getTravelCardData(this.currentContactId, this.currentDate);
        
        if (!travelCardData) {
            // 显示加载状态，提示用户生成
            container.innerHTML = `
                <div class="loading-state">
                    <div class="empty-icon">📭</div>
                    <p>该日期暂无行程卡</p>
                    <button class="footer-btn" onclick="TravelCard.generateNewCard('${this.currentContactId}', '${this.currentDate}')" style="margin: 20px auto; max-width: 200px;">
                        <span>➕</span>
                        <span>生成行程卡</span>
                    </button>
                </div>
            `;
            return;
        }
        
        const now = new Date();
        const timezone = travelCardData.timezone;
        
        container.innerHTML = travelCardData.schedules.map((schedule, index) => {
            const isTimeVisible = this.isScheduleVisible(schedule, now, timezone);
            const isDataVisible = schedule.isVisible !== false; // 行程数据中的可见性设置
            const isVisible = isTimeVisible && isDataVisible; // 两个条件都要满足
            const isLocked = !isVisible;
            const hasLie = schedule.isLiar && isVisible;  // 只有可见且撒谎的才显示发光
            
            // 兼容旧数据：如果没有reported字段，使用activity
            const reportedTitle = schedule.reported?.title || schedule.activity;
            const reportedDetail = schedule.reported?.detail || schedule.description;
            const truthActivity = schedule.truth?.activity || schedule.actualActivity || schedule.activity;
            const truthLocation = schedule.truth?.location || schedule.location;
            const truthDetail = schedule.truth?.detail || schedule.description;
            const truthReason = schedule.truth?.reason || '未知原因';
            
            return `
                <div class="timeline-item ${hasLie ? 'has-secret' : ''}" data-schedule-index="${index}">
                    <div class="timeline-time">
                        <div class="time-label">${schedule.time}</div>
                        ${schedule.endTime ? `<div class="time-range">- ${schedule.endTime}</div>` : ''}
                        ${hasLie ? '<div class="secret-indicator">✨</div>' : ''}
                    </div>
                    <div class="timeline-dot ${isLocked ? 'locked' : ''} ${hasLie ? 'glowing' : ''}"></div>
                    <div class="timeline-content ${isLocked ? 'locked' : ''}" onclick="TravelCard.toggleCardFace(${index})">
                        ${isLocked ? `
                            <div class="locked-placeholder">🔒</div>
                        ` : `
                            <!-- 正面：报备的行程 -->
                            <div class="card-face card-front ${hasLie ? '' : 'active'}">
                                <div class="activity-title">${reportedTitle}</div>
                                ${schedule.location ? `<div class="activity-location">📍 ${schedule.location}</div>` : ''}
                                ${reportedDetail ? `<div class="activity-description">${reportedDetail}</div>` : ''}
                            </div>
                            
                            <!-- 背面：真实活动（只有撒谎时才显示） -->
                            ${hasLie ? `
                                <div class="card-face card-back">
                                    <div class="truth-badge">🔍 真相</div>
                                    <div class="activity-title truth-title">${truthActivity}</div>
                                    ${truthLocation ? `<div class="activity-location">📍 ${truthLocation}</div>` : ''}
                                    ${truthDetail ? `<div class="activity-description">${truthDetail}</div>` : ''}
                                    <div class="lie-reason">
                                        <span class="reason-label">💭 隐瞒原因：</span>
                                        <span class="reason-text">${truthReason}</span>
                                    </div>
                                </div>
                            ` : ''}
                        `}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // 翻转卡片
    toggleCardFace(index) {
        const item = document.querySelector(`.timeline-item[data-schedule-index="${index}"]`);
        if (!item || !item.classList.contains('has-secret')) return;
        
        const front = item.querySelector('.card-front');
        const back = item.querySelector('.card-back');
        
        if (front && back) {
            front.classList.toggle('active');
            back.classList.toggle('active');
            item.classList.toggle('flipped');
        }
    },
    
    // 生成新行程卡
    async generateNewCard(contactId, date) {
        // 使用本地日期而不是UTC日期
        const targetDate = date || (() => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        })();
        
        const contact = this.getContact(contactId);
        
        if (!contact) {
            alert('联系人不存在');
            return;
        }
        
        // 检查当天是否已经有行程卡
        const existingCard = this.getTravelCardData(contactId, targetDate);
        if (existingCard) {
            const confirm = window.confirm('该日期已有行程卡，是否重新生成？');
            if (!confirm) return;
        }
        
        // 显示加载状态
        const container = document.getElementById('timelineContainer');
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>正在生成行程卡...</p>
                    <p class="loading-tip">请稍候，AI正在为您创建个性化行程</p>
                </div>
            `;
        }
        
        // 禁用生成按钮，防止重复点击
        const generateButtons = document.querySelectorAll('button[onclick*="generateNewCard"]');
        generateButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        });
        
        try {
            // 调用AI生成行程卡
            const schedule = await this.callAIForSchedule(contact, targetDate);
            
            if (schedule && schedule.schedules) {
                this.saveTravelCardData(contactId, targetDate, schedule);
                
                if (window.AIAutoStatus && AIAutoStatus.statusManager) {
                    try {
                        AIAutoStatus.statusManager.checkAndUpdateStatus(contactId);
                    } catch (e) {
                        console.warn('生成行程卡后刷新AI状态失败:', e);
                    }
                }
                
                // 显示成功状态
                if (container) {
                    container.innerHTML = `
                        <div class="loading-state success">
                            <div class="success-icon">✅</div>
                            <p>行程卡生成成功！</p>
                            <p class="loading-tip">正在加载内容...</p>
                        </div>
                    `;
                }
                
                // 延迟一下再加载，让用户看到成功提示
                setTimeout(() => {
                    this.loadAllCards();
                    
                    if (this.currentContactId === contactId) {
                        this.loadTimeline();
                    }
                }, 800);
                
            } else {
                throw new Error('AI返回的数据格式不正确');
            }
        } catch (error) {
            console.error('生成行程卡失败:', error);
            
            // 失败后显示重试按钮
            if (container) {
                container.innerHTML = `
                    <div class="loading-state error">
                        <div class="error-icon">❌</div>
                        <p>生成失败: ${error.message}</p>
                        <button class="footer-btn retry-btn" onclick="TravelCard.generateNewCard('${contactId}', '${targetDate}')" style="margin: 20px auto; max-width: 200px;">
                            <span>🔄</span>
                            <span>重试</span>
                        </button>
                    </div>
                `;
            }
        } finally {
            // 恢复生成按钮
            setTimeout(() => {
                generateButtons.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                });
            }, 1000);
        }
    },
    
    // 调用AI生成行程卡
    async callAIForSchedule(contact, date) {
        let apiUrl, apiKey, model, temperature = null;
        
        console.log('🔍 [行程卡] 当前联系人:', contact.name, 'API方案ID:', contact.apiScheme);
        
        // 优先使用联系人的 API 方案
        if (contact.apiScheme) {
            const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
            console.log('📋 [行程卡] 所有API方案:', schemes);
            
            const scheme = schemes.find(s => s.id === contact.apiScheme);
            if (scheme) {
                apiUrl = scheme.apiUrl;
                apiKey = scheme.apiKey;
                model = scheme.model;
                if (typeof scheme.temperature === 'number') {
                    temperature = scheme.temperature;
                }
                console.log('✅ [行程卡] 使用联系人API方案:', scheme.name, '模型:', model);
            } else {
                console.warn('⚠️ [行程卡] 联系人API方案不存在(ID:' + contact.apiScheme + ')');
            }
        }
        
        // 如果没有方案，使用全局配置
        if (!apiUrl) {
            apiUrl = localStorage.getItem('apiUrl');
            apiKey = localStorage.getItem('apiKey');
            model = contact.model || localStorage.getItem('selectedModel');
            console.log('🌐 [行程卡] 使用全局API配置');
        }

        if (temperature === null) {
            const storedTemp = localStorage.getItem('apiTemperature');
            const tempNum = storedTemp ? parseFloat(storedTemp) : NaN;
            if (!isNaN(tempNum)) {
                temperature = tempNum;
            }
        }
        
        if (!apiUrl || !apiKey) {
            throw new Error('未配置API，请先在设置中配置API或为联系人指定API方案');
        }
        
        // 构建提示词
        const prompt = this.buildSchedulePrompt(contact, date);
        
        console.log('📤 [行程卡] 发送API请求:', apiUrl, '模型:', model, '温度:', temperature ?? 0.8);
        console.log('📝 [行程卡] 提示词:', prompt);
        
        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的日程规划助手，请根据角色设定生成合理的一天行程安排。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: (typeof temperature === 'number') ? temperature : 0.8
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [行程卡] API请求失败:', response.status, errorText);
            throw new Error(`API 请求失败 (${response.status}): ${errorText.substring(0, 200)}`);
        }
        
        const data = await response.json();
        console.log('📥 [行程卡] API返回数据:', data);
        
        // 检查是否是错误响应
        if (data.error) {
            console.error('❌ [行程卡] API返回错误:', data.error);
            throw new Error(`API错误: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        // 提取回复内容（支持多种API格式）
        let reply = null;
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            reply = data.choices[0].message.content;
        } else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            if (parts && parts[0] && parts[0].text) {
                reply = parts[0].text;
            }
        } else if (data.content && data.content[0] && data.content[0].text) {
            reply = data.content[0].text;
        } else if (data.text) {
            reply = data.text;
        } else if (data.response) {
            reply = data.response;
        }
        
        if (!reply) {
            console.error('❌ [行程卡] 无法识别的API返回格式:', JSON.stringify(data, null, 2));
            throw new Error('API返回数据格式不支持');
        }
        
        console.log('✅ [行程卡] AI原始回复:', reply);
        
        // 解析JSON
        const schedule = this.parseScheduleFromAI(reply, contact, date);
        return schedule;
    },
    
    // 构建行程卡生成提示词
    buildSchedulePrompt(contact, date) {
        const settings = this.getSettings();
        const defaultPrompt = settings.defaultPrompt;
        
        // 如果有自定义提示词，使用自定义提示词
        if (defaultPrompt && defaultPrompt.trim()) {
            return defaultPrompt
                .replace(/{charName}/g, contact.name)
                .replace(/{date}/g, date)
                .replace(/{timezone}/g, contact.timezone || 'Asia/Shanghai');
        }
        
        // 默认提示词
        const displayName = contact.nickname || contact.name;
        
        // 获取联系人的时区（从timezoneSettings中）
        const timezoneSettings = contact.timezoneSettings || { mode: 'same', sharedTimezone: 'Asia/Shanghai' };
        const timezone = timezoneSettings.mode === 'same' 
            ? timezoneSettings.sharedTimezone 
            : timezoneSettings.aiTimezone;
        
        // 获取睡眠时间设置
        const sleepSettings = contact.sleepSettings || {
            bedtime: '23:30',
            wakeupTime: '08:00'
        };
        
        const bilingualMode = contact.bilingualSettings?.enabled ? `（${contact.bilingualSettings.mode}双语模式）` : '';
        
        return `请为角色"${contact.name}"${bilingualMode}生成${date}这一天的详细行程安排。

角色信息：
- 真实姓名：${contact.name}
- 备注名称：${displayName}
- 性别：${contact.gender || '未设置'}
- 初次见面语：${contact.greeting || '无'}
- 当前状态：${contact.status || '无'}
- 时区：${timezone}
- 睡觉时间：${sleepSettings.bedtime}
- 起床时间：${sleepSettings.wakeupTime}
${contact.persona ? `- 人设：${contact.persona}` : ''}
        
        要求：
        1. 生成一天的完整行程（从${sleepSettings.wakeupTime}起床到${sleepSettings.bedtime}睡觉）
        2. 每个行程项必须包含：
           - time: 开始时间
           - endTime: 结束时间
           - activity: 「大类标题」，用简短的中文/英文类别词，例如：起床、睡觉、工作、学习、用餐、会议、通勤、运动、休息、娱乐等
           - location: 地点（可以简写）
           - description: 「小类与细节」，用1-2句话具体描述这个时间段在做什么、氛围如何、有什么情绪或小动作
        3. 行程要符合角色的性格和职业特点，可以在description里体现他/她的习惯和小细节
        4. 所有时间统一使用 HH:mm（24小时制）
        5. 必须返回有效的JSON格式，不能有注释或多余文本
        6. 第一个行程应该是${sleepSettings.wakeupTime}起床，最后一个行程应该是${sleepSettings.bedtime}睡觉
        7. 如果角色是夜猫子类型，可以在description里体现熬夜习惯，并适当增加夜间活动
        
        返回格式示例：
        \`\`\`json
        {
          "contactId": "${contact.id}",
          "date": "${date}",
          "timezone": "${timezone}",
          "schedules": [
            {
              "id": "1",
              "time": "${sleepSettings.wakeupTime}",
              "endTime": "${this.addMinutes(sleepSettings.wakeupTime, 30)}",
              "activity": "起床",
              "location": "家",
              "description": "迷迷糊糊醒来，在床上赖了几分钟才去洗漱。"
            },
            {
              "id": "2",
              "time": "09:00",
              "endTime": "12:00",
              "activity": "工作",
              "location": "办公室",
              "description": "处理邮件和需求评审，一边喝咖啡一边和同事小声吐槽今天的会议安排。"
            },
            {
              "id": "last",
              "time": "${sleepSettings.bedtime}",
              "endTime": "${this.addMinutes(sleepSettings.bedtime, 30)}",
              "activity": "睡觉",
              "location": "家",
              "description": "洗完澡上床刷了会儿手机，放下之后戴上眼罩慢慢入睡。"
            }
          ]
        }
        \`\`\`
        
        请直接返回JSON，不要添加任何其他说明文字。`;
    },
    
    // 从AI回复中解析行程JSON
    parseScheduleFromAI(reply, contact, date) {
        try {
            // 尝试提取JSON（可能被包裹在```json```中）
            let jsonStr = reply.trim();
            
            // 移除markdown代码块标记
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.substring(7);
            } else if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.substring(3);
            }
            
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.substring(0, jsonStr.length - 3);
            }
            
            jsonStr = jsonStr.trim();
            
            // 解析JSON
            const schedule = JSON.parse(jsonStr);
            
            // 验证数据结构
            if (!schedule.schedules || !Array.isArray(schedule.schedules)) {
                throw new Error('返回的JSON缺少schedules数组');
            }
            
            // 获取联系人的正确时区
            const timezoneSettings = contact.timezoneSettings || { mode: 'same', sharedTimezone: 'Asia/Shanghai' };
            const contactTimezone = timezoneSettings.mode === 'same' 
                ? timezoneSettings.sharedTimezone 
                : timezoneSettings.aiTimezone;
            
            // 确保必要字段存在
            schedule.contactId = contact.id;
            schedule.date = date;
            schedule.timezone = contactTimezone;  // 使用联系人的时区
            
            console.log('🌍 [行程卡] 联系人时区:', contactTimezone, '时区设置:', timezoneSettings);
            
            // 为每个schedule项添加默认值
            schedule.schedules = schedule.schedules.map((item, index) => ({
                id: item.id || String(index + 1),
                time: item.time,
                endTime: item.endTime || '',
                activity: item.activity,
                location: item.location || '',
                description: item.description || '',
                isVisible: item.isVisible !== false,
                isTruthful: item.isTruthful !== false,
                actualActivity: item.actualActivity || item.activity
            }));
            
            // 应用撒谎机制
            schedule.schedules = this.applyLieMechanism(schedule.schedules, contact);
            
            console.log('✅ [行程卡] 解析成功:', schedule);
            return schedule;
            
        } catch (error) {
            console.error('❌ [行程卡] JSON解析失败:', error);
            console.error('原始回复:', reply);
            throw new Error('AI返回的内容不是有效的JSON格式，请重试');
        }
    },
    
    // 应用撒谎机制
    // 应用撒谎机制（优化版：控制频率和质量）
        applyLieMechanism(schedules, contact) {
            // 撒谎频率：0个（60%）、1个（30%）、2个（10%）
            const rand = Math.random();
            let lieCount = 0;
            if (rand < 0.6) {
                lieCount = 0;  // 60%概率不撒谎
            } else if (rand < 0.9) {
                lieCount = 1;  // 30%概率撒1个谎
            } else {
                lieCount = 2;  // 10%概率撒2个谎
            }

            console.log(`🎲 [撒谎机制] 今日撒谎次数: ${lieCount}`);

            if (lieCount === 0) {
                // 不撒谎，所有行程都是真实的
                return schedules.map(s => ({
                    ...s,
                    isLiar: false,
                    reported: {
                        title: s.activity,
                        detail: s.description
                    },
                    truth: null
                }));
            }

            // 随机选择要撒谎的行程（避开早晨和深夜）
            const candidateIndices = schedules
                .map((s, i) => ({ schedule: s, index: i }))
                .filter(({ schedule }) => {
                    const hour = parseInt(schedule.time.split(':')[0]);
                    return hour >= 10 && hour <= 22;  // 只在10:00-22:00之间撒谎
                })
                .map(({ index }) => index);

            // 随机选择要撒谎的索引
            const lieIndices = [];
            while (lieIndices.length < Math.min(lieCount, candidateIndices.length)) {
                const randomIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
                if (!lieIndices.includes(randomIndex)) {
                    lieIndices.push(randomIndex);
                }
            }

            console.log(`🤥 [撒谎机制] 撒谎的行程索引:`, lieIndices);

            // 生成掩饰故事
            const coverStories = [
                { activity: '在图书馆学习', reason: '想给你个惊喜' },
                { activity: '在实验室做实验', reason: '不想让你担心' },
                { activity: '在咖啡厅工作', reason: '想独自处理一些事' },
                { activity: '在家休息', reason: '需要一些私人空间' },
                { activity: '外出办事', reason: '想给你准备礼物' },
                { activity: '整理房间', reason: '计划给你一个惊喜' },
                { activity: '散步', reason: '想一个人静静' },
                { activity: '看书', reason: '在准备给你的惊喜' }
            ];

            return schedules.map((schedule, index) => {
                if (lieIndices.includes(index)) {
                    const cover = coverStories[Math.floor(Math.random() * coverStories.length)];
                    console.log(`🤥 [撒谎机制] ${schedule.time} - 真实: ${schedule.activity}, 报备: ${cover.activity}`);

                    return {
                        ...schedule,
                        isLiar: true,
                        reported: {
                            title: cover.activity,
                            detail: `${cover.activity}，稍后联系你`
                        },
                        truth: {
                            activity: schedule.activity,
                            location: schedule.location,
                            detail: schedule.description,
                            reason: cover.reason
                        }
                    };
                } else {
                    return {
                        ...schedule,
                        isLiar: false,
                        reported: {
                            title: schedule.activity,
                            detail: schedule.description
                        },
                        truth: null
                    };
                }
            });
        }
,
    
    // 生成掩饰故事
    generateCoverStory(actualActivity, contact) {
        // 简单的掩饰故事生成逻辑
        const coverStories = [
            '在家休息',
            '处理一些私人事务',
            '外出办事',
            '和朋友见面',
            '在图书馆学习',
            '去咖啡厅放松',
            '整理房间',
            '看书',
            '散步',
            '购物'
        ];
        
        // 随机选择一个掩饰故事
        const randomIndex = Math.floor(Math.random() * coverStories.length);
        return coverStories[randomIndex];
    },
    
    // 上一天
    previousDate() {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() - 1);
        // 使用本地日期而不是UTC日期
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.currentDate = `${year}-${month}-${day}`;
        
        document.getElementById('modalCurrentDate').textContent = this.currentDate;
        
        // 更新陈旧化效果
        const modal = document.getElementById('travelCardModal');
        const modalContent = modal.querySelector('.modal-content');
        if (this.isCardOld(this.currentDate)) {
            modalContent.classList.add('card-old');
        } else {
            modalContent.classList.remove('card-old');
        }
        
        this.loadTimeline();
    },
    
    // 下一天
    nextDate() {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() + 1);
        // 使用本地日期而不是UTC日期
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.currentDate = `${year}-${month}-${day}`;
        
        document.getElementById('modalCurrentDate').textContent = this.currentDate;
        
        // 更新陈旧化效果
        const modal = document.getElementById('travelCardModal');
        const modalContent = modal.querySelector('.modal-content');
        if (this.isCardOld(this.currentDate)) {
            modalContent.classList.add('card-old');
        } else {
            modalContent.classList.remove('card-old');
        }
        
        this.loadTimeline();
    },
    
    // 重新生成行程卡
    regenerateCard() {
        if (!this.currentContactId || !this.currentDate) return;
        this.generateNewCard(this.currentContactId, this.currentDate);
    },
    
    // 固化记忆
    async consolidateMemory(event) {
        if (!this.currentContactId || !this.currentDate) {
            alert('请先打开一个行程卡');
            return;
        }
        
        const contact = this.getContact(this.currentContactId);
        if (!contact) {
            alert('联系人不存在');
            return;
        }
        
        // 检查是否已经固化过
        const existingMemory = this.getMemory(this.currentContactId, this.currentDate);
        if (existingMemory) {
            const confirm = window.confirm('该日期已有固化记忆，是否重新生成？');
            if (!confirm) return;
        }
        
        // 获取行程卡数据
        const travelCardData = this.getTravelCardData(this.currentContactId, this.currentDate);
        if (!travelCardData) {
            alert('该日期没有行程卡数据');
            return;
        }
        
        // 创建全屏加载遮罩
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'memory-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="memory-loading-content">
                <div class="loading-spinner"></div>
                <h3>正在固化记忆</h3>
                <p>AI正在分析行程数据并生成记忆摘要...</p>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <p class="progress-text">请稍候，这可能需要几秒钟</p>
                </div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
        
        // 启动进度条动画
        setTimeout(() => {
            const progressFill = loadingOverlay.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '100%';
            }
        }, 100);
        
        try {
            // 显示按钮加载状态（如果有按钮）
            let originalText;
            if (event && event.target) {
                originalText = event.target.textContent;
                event.target.textContent = '固化中...';
                event.target.disabled = true;
            }
            
            // 调用AI进行脱水处理
            const memory = await this.dehydrateMemory(contact, this.currentDate, travelCardData);
            
            // 保存记忆
            this.saveMemory(this.currentContactId, this.currentDate, memory);
            
            console.log('✅ [记忆固化] 记忆已保存到localStorage');
            
            // 显示成功状态
            loadingOverlay.querySelector('.memory-loading-content').innerHTML = `
                <div class="success-icon">✅</div>
                <h3>记忆固化成功！</h3>
                <p>已成功生成并保存记忆摘要</p>
                <div class="success-actions">
                    <button class="success-btn" onclick="this.parentElement.parentElement.parentElement.remove()">确定</button>
                </div>
            `;
            
            // 如果记忆库模态框是打开的，刷新显示
            const memoryBankModal = document.getElementById('memoryBankModal');
            if (memoryBankModal && memoryBankModal.classList.contains('active')) {
                this.loadMemoryBank();
                console.log('✅ [记忆固化] 已刷新记忆库显示');
            }
            
            // 恢复按钮（如果有按钮）
            if (event && event.target) {
                event.target.textContent = originalText;
                event.target.disabled = false;
            }
            
            // 3秒后自动关闭成功提示
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.remove();
                }
            }, 3000);
            
        } catch (error) {
            console.error('记忆固化失败:', error);
            
            // 显示错误状态
            loadingOverlay.querySelector('.memory-loading-content').innerHTML = `
                <div class="error-icon">❌</div>
                <h3>记忆固化失败</h3>
                <p>${error.message}</p>
                <div class="error-actions">
                    <button class="retry-btn" onclick="TravelCard.consolidateMemory(); this.parentElement.parentElement.parentElement.remove();">重试</button>
                    <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.remove()">取消</button>
                </div>
            `;
            
            // 恢复按钮（如果有按钮）
            if (event && event.target) {
                event.target.textContent = '💾 固化记忆';
                event.target.disabled = false;
            }
        }
    },
    
    // 脱水处理（调用AI总结）
    async dehydrateMemory(contact, date, travelCardData) {
        let apiUrl, apiKey, model, temperature = null;
        
        console.log('🧠 [记忆固化] 开始处理:', contact.name, date);
        
        // 优先使用联系人的 API 方案
        if (contact.apiScheme) {
            const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
            const scheme = schemes.find(s => s.id === contact.apiScheme);
            if (scheme) {
                apiUrl = scheme.apiUrl;
                apiKey = scheme.apiKey;
                model = scheme.model;
                if (typeof scheme.temperature === 'number') {
                    temperature = scheme.temperature;
                }
            }
        }
        
        // 如果没有方案，使用全局配置
        if (!apiUrl) {
            apiUrl = localStorage.getItem('apiUrl');
            apiKey = localStorage.getItem('apiKey');
            model = contact.model || localStorage.getItem('selectedModel');
        }

        if (temperature === null) {
            const storedTemp = localStorage.getItem('apiTemperature');
            const tempNum = storedTemp ? parseFloat(storedTemp) : NaN;
            if (!isNaN(tempNum)) {
                temperature = tempNum;
            }
        }
        
        if (!apiUrl || !apiKey) {
            throw new Error('未配置API，请先在设置中配置API或为联系人指定API方案');
        }
        
        // 构建提示词
        const prompt = this.buildMemoryPrompt(contact, date, travelCardData);
        
        console.log('📤 [记忆固化] 发送API请求 温度:', temperature ?? 0.7);
        
        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的记忆整理助手，请以第一人称总结角色的一天。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: (typeof temperature === 'number') ? temperature : 0.7
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API 请求失败 (${response.status})`);
        }
        
        const data = await response.json();
        
        // 提取回复
        let reply = null;
        if (data.choices && data.choices[0] && data.choices[0].message) {
            reply = data.choices[0].message.content;
        } else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            if (parts && parts[0] && parts[0].text) {
                reply = parts[0].text;
            }
        } else if (data.content && data.content[0] && data.content[0].text) {
            reply = data.content[0].text;
        } else if (data.text) {
            reply = data.text;
        } else if (data.response) {
            reply = data.response;
        }
        
        if (!reply) {
            throw new Error('API返回数据格式不支持');
        }
        
        console.log('✅ [记忆固化] AI回复:', reply);
        
        // 构建记忆对象
        const memory = {
            contactId: contact.id,
            date: date,
            summary: reply.trim(),
            createdAt: new Date().toISOString()
        };
        
        return memory;
    },
    
    // 构建记忆固化提示词
    buildMemoryPrompt(contact, date, travelCardData) {
        const displayName = contact.nickname || contact.name;
        
        // 整理行程列表
        const scheduleList = travelCardData.schedules.map(s => 
            `${s.time} - ${s.activity}${s.location ? ` (${s.location})` : ''}${s.description ? `: ${s.description}` : ''}`
        ).join('\n');
        
        return `请以第一人称（我）总结${displayName}在${date}这一天的经历。

今日行程：
${scheduleList}

要求：
1. 用第一人称（我）进行总结
2. 提取3-5个最重要的事件
3. 保持简洁，每个事件1-2句话
4. 可以加入情感描述
5. 如果没有特别重要的事，可以模糊处理

示例格式：
"今天进行了关键的谷胱甘肽合成实验，结果比预期好。午餐很难吃，下次不点了。晚上读了几篇文献，对课题有了新想法。"

请直接返回总结文字，不要添加其他说明。`;
    },
    
    // 刷新所有卡片
    refreshAllCards() {
        this.loadAllCards();
        alert('已刷新所有行程卡');
    },
    
    // 批量刷新（为所有联系人生成今日行程卡）
    async batchRefresh() {
        const contacts = this.getAllContacts();
        if (!contacts || contacts.length === 0) {
            alert('没有联系人');
            return;
        }
        
        if (!confirm(`确定要为所有 ${contacts.length} 个联系人生成今日行程卡吗？`)) {
            return;
        }
        
        // 使用本地日期而不是UTC日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayKey = `${year}-${month}-${day}`;
        
        let successCount = 0;
        let failCount = 0;
        
        for (const contact of contacts) {
            try {
                await this.generateNewCard(contact.id, todayKey);
                successCount++;
            } catch (error) {
                console.error(`生成 ${contact.name} 的行程卡失败:`, error);
                failCount++;
            }
        }
        
        alert(`批量生成完成！\n成功: ${successCount}\n失败: ${failCount}`);
        this.loadAllCards();
    },
    
    // 批量固化记忆
    async batchConsolidate() {
        const contacts = this.getAllContacts();
        if (!contacts || contacts.length === 0) {
            alert('没有联系人');
            return;
        }
        
        if (!confirm(`确定要为所有联系人固化今日记忆吗？`)) {
            return;
        }
        
        // 使用本地日期而不是UTC日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayKey = `${year}-${month}-${day}`;
        
        let successCount = 0;
        let failCount = 0;
        
        for (const contact of contacts) {
            try {
                const travelCardData = this.getTravelCardData(contact.id, todayKey);
                if (travelCardData) {
                    const memory = await this.dehydrateMemory(contact, todayKey, travelCardData);
                    this.saveMemory(contact.id, todayKey, memory);
                    successCount++;
                }
            } catch (error) {
                console.error(`固化 ${contact.name} 的记忆失败:`, error);
                failCount++;
            }
        }
        
        alert(`批量固化完成！\n成功: ${successCount}\n失败: ${failCount}`);
    },
    
    // 打开记忆库
    openMemoryBank() {
        if (!this.currentContactId) {
            alert('请先打开一个行程卡');
            return;
        }
        
        const modal = document.getElementById('memoryBankModal');
        this.loadMemoryBank();
        modal.classList.add('active');
    },
    
    // 关闭记忆库
    closeMemoryBank() {
        document.getElementById('memoryBankModal').classList.remove('active');
    },
    
    // 加载记忆库
    loadMemoryBank() {
        const listContainer = document.getElementById('memoryBankList');
        const memories = this.getAllMemories(this.currentContactId);
        
        console.log('🔍 [记忆库] 当前联系人ID:', this.currentContactId);
        console.log('🔍 [记忆库] 获取到的记忆:', memories);
        console.log('🔍 [记忆库] 记忆数量:', Object.keys(memories).length);
        
        if (!memories || Object.keys(memories).length === 0) {
            listContainer.innerHTML = '<div class="memory-empty">暂无固化记忆</div>';
            return;
        }
        
        // 按日期排序（最新的在前）
        const sortedDates = Object.keys(memories).sort((a, b) => new Date(b) - new Date(a));
        
        // 判断记忆是否陈旧（超过7天）
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        listContainer.innerHTML = sortedDates.map(date => {
            const memory = memories[date];
            const memoryDate = new Date(date);
            const isOld = memoryDate < sevenDaysAgo;
            
            return `
                <div class="memory-item ${isOld ? 'old' : ''}" data-date="${date}">
                    <div class="memory-date">📅 ${date} ${isOld ? '(陈旧)' : ''}</div>
                    <div class="memory-summary">${memory.summary}</div>
                    <div class="memory-actions">
                        <button class="btn-edit" onclick="TravelCard.editMemory('${date}')">编辑</button>
                        <button class="btn-delete" onclick="TravelCard.deleteMemory('${date}')">删除</button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // 搜索记忆
    searchMemories() {
        const searchTerm = document.getElementById('memorySearch').value.toLowerCase();
        const memoryItems = document.querySelectorAll('.memory-item');
        
        memoryItems.forEach(item => {
            const summary = item.querySelector('.memory-summary').textContent.toLowerCase();
            const date = item.querySelector('.memory-date').textContent.toLowerCase();
            
            if (summary.includes(searchTerm) || date.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    },
    
    // 编辑记忆
    editMemory(date) {
        const memory = this.getMemory(this.currentContactId, date);
        if (!memory) return;
        
        const newSummary = prompt('编辑记忆内容：', memory.summary);
        if (newSummary && newSummary.trim()) {
            memory.summary = newSummary.trim();
            this.saveMemory(this.currentContactId, date, memory);
            this.loadMemoryBank();
        }
    },
    
    // 删除记忆
    deleteMemory(date) {
        if (!confirm(`确定要删除 ${date} 的记忆吗？`)) return;
        
        const key = `travelCardMemories_${this.currentContactId}`;
        const memories = JSON.parse(localStorage.getItem(key) || '{}');
        delete memories[date];
        localStorage.setItem(key, JSON.stringify(memories));
        
        this.loadMemoryBank();
    },
    
    // 清空所有记忆
    clearAllMemories() {
        if (!confirm('确定要清空该联系人的所有记忆吗？此操作不可恢复！')) return;
        
        const key = `travelCardMemories_${this.currentContactId}`;
        localStorage.removeItem(key);
        
        this.loadMemoryBank();
        alert('已清空所有记忆');
    },
    
    // 打开设置（加载CSS方案列表）
    openSettings() {
        const modal = document.getElementById('settingsModal');
        
        // 加载现有设置
        const settings = this.getSettings();
        document.getElementById('maxMemoryCount').value = settings.maxMemoryCount || 100;
        document.getElementById('autoDehydrate').checked = settings.autoDehydrate !== false;
        document.getElementById('defaultPrompt').value = settings.defaultPrompt || '';
        
        // 加载背景设置
        document.getElementById('pageBackgroundUrl').value = settings.pageBackground || '';
        document.getElementById('cardBackgroundUrl').value = settings.cardBackground || '';
        
        // 加载CSS方案列表
        this.loadCSSSchemeSelector();
        
        modal.classList.add('active');
    },
    
    // 关闭设置
    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    },
    
    // 保存设置
    saveSettings() {
        const settings = {
            maxMemoryCount: parseInt(document.getElementById('maxMemoryCount').value),
            autoDehydrate: document.getElementById('autoDehydrate').checked,
            defaultPrompt: document.getElementById('defaultPrompt').value,
            pageBackground: document.getElementById('pageBackgroundUrl').value.trim(),
            cardBackground: document.getElementById('cardBackgroundUrl').value.trim()
        };
        
        localStorage.setItem('travelCardSettings', JSON.stringify(settings));
        
        // 应用背景
        this.applyBackgrounds(settings);
        
        alert('设置已保存');
        this.closeSettings();
    },
    
    // ==================== 数据存储函数 ====================
    
    // 检查卡片是否陈旧（超过7天）
    isCardOld(dateString) {
        const cardDate = new Date(dateString);
        const today = new Date();
        const diffTime = today - cardDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 7;
    },
    
    // 获取所有联系人
    getAllContacts() {
        try {
            const contacts = JSON.parse(localStorage.getItem('vibe_contacts') || '[]');
            return contacts;
        } catch (e) {
            console.error('获取联系人失败:', e);
            return [];
        }
    },
    
    // 获取单个联系人
    getContact(contactId) {
        const contacts = this.getAllContacts();
        // 使用宽松比较（==）而不是严格比较（===），因为HTML onclick传递的是字符串
        return contacts.find(c => c.id == contactId);
    },
    
    // 保存行程卡数据
    saveTravelCardData(contactId, date, data) {
        const key = `travelCards_${contactId}`;
        let cards = JSON.parse(localStorage.getItem(key) || '{}');
        cards[date] = data;
        localStorage.setItem(key, JSON.stringify(cards));
        
        if (window.AIAutoStatus && AIAutoStatus.statusManager) {
            try {
                const cacheKey = `schedule_${contactId}`;
                if (AIAutoStatus.statusManager.cache) {
                    AIAutoStatus.statusManager.cache.delete(cacheKey);
                }
            } catch (e) {
                console.warn('清理AI状态缓存失败:', e);
            }
        }
    },
    
    // 获取行程卡数据
    getTravelCardData(contactId, date) {
        const key = `travelCards_${contactId}`;
        const cards = JSON.parse(localStorage.getItem(key) || '{}');
        return cards[date];
    },
    
    // 获取设置
    getSettings() {
        try {
            return JSON.parse(localStorage.getItem('travelCardSettings') || '{}');
        } catch (e) {
            return {};
        }
    },
    
    // 保存记忆数据
    saveMemory(contactId, date, memoryData) {
        const key = `travelCardMemories_${contactId}`;
        let memories = JSON.parse(localStorage.getItem(key) || '{}');
        memories[date] = memoryData;
        
        console.log('💾 [记忆保存] 联系人ID:', contactId);
        console.log('💾 [记忆保存] 日期:', date);
        console.log('💾 [记忆保存] 记忆内容:', memoryData);
        console.log('💾 [记忆保存] localStorage key:', key);
        console.log('💾 [记忆保存] 保存前的所有记忆:', memories);
        
        // 应用数据清理策略
        this.cleanOldMemories(contactId, memories);
        
        localStorage.setItem(key, JSON.stringify(memories));
        
        console.log('✅ [记忆保存] 已保存到localStorage');
        console.log('✅ [记忆保存] 验证读取:', JSON.parse(localStorage.getItem(key) || '{}'));
    },
    
    // 获取记忆数据
    getMemory(contactId, date) {
        const key = `travelCardMemories_${contactId}`;
        const memories = JSON.parse(localStorage.getItem(key) || '{}');
        return memories[date];
    },
    
    // 获取所有记忆
    getAllMemories(contactId) {
        const key = `travelCardMemories_${contactId}`;
        return JSON.parse(localStorage.getItem(key) || '{}');
    },
    
    // 时间计算辅助函数
    addMinutes(timeStr, minutes) {
        const [hours, mins] = timeStr.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMins = totalMinutes % 60;
        return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
    },
    
    // 计算睡眠时长
    calculateSleepDuration(bedtime, wakeupTime) {
        const [bedHour, bedMin] = bedtime.split(':').map(Number);
        const [wakeHour, wakeMin] = wakeupTime.split(':').map(Number);
        
        let bedMinutes = bedHour * 60 + bedMin;
        let wakeMinutes = wakeHour * 60 + wakeMin;
        
        // 如果起床时间小于睡觉时间，说明跨夜了
        if (wakeMinutes < bedMinutes) {
            wakeMinutes += 24 * 60; // 加一天的分钟数
        }
        
        const durationMinutes = wakeMinutes - bedMinutes;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        return { hours, minutes, total: durationMinutes };
    },
    
    // 打开睡眠时间设置
    openSleepSettings() {
        if (!this.currentContactId) {
            alert('请先选择一个联系人');
            return;
        }
        
        const contact = this.getContact(this.currentContactId);
        if (!contact) {
            alert('联系人不存在');
            return;
        }
        
        // 设置联系人名称
        document.getElementById('sleepSettingsContactName').textContent = contact.nickname || contact.name;
        
        // 加载当前睡眠设置
        const sleepSettings = contact.sleepSettings || {
            bedtime: '23:30',
            wakeupTime: '08:00'
        };
        
        document.getElementById('bedtimeInput').value = sleepSettings.bedtime;
        document.getElementById('wakeupTimeInput').value = sleepSettings.wakeupTime;
        
        // 更新预览
        this.updateSleepPreview();
        
        // 绑定实时更新事件
        document.getElementById('bedtimeInput').addEventListener('input', () => this.updateSleepPreview());
        document.getElementById('wakeupTimeInput').addEventListener('input', () => this.updateSleepPreview());
        
        // 显示弹窗
        document.getElementById('sleepSettingsModal').classList.add('active');
    },
    
    // 关闭睡眠时间设置
    closeSleepSettings() {
        document.getElementById('sleepSettingsModal').classList.remove('active');
    },
    
    // 更新睡眠预览
    updateSleepPreview() {
        const bedtime = document.getElementById('bedtimeInput').value;
        const wakeupTime = document.getElementById('wakeupTimeInput').value;
        
        if (!bedtime || !wakeupTime) return;
        
        // 计算睡眠时长
        const duration = this.calculateSleepDuration(bedtime, wakeupTime);
        
        // 更新显示
        document.getElementById('sleepDurationDisplay').textContent = 
            `睡眠时长：约 ${duration.hours}.${Math.round(duration.minutes / 60 * 10)} 小时`;
        document.getElementById('previewBedtime').textContent = bedtime;
        document.getElementById('previewWakeup').textContent = wakeupTime;
    },
    
    // 保存睡眠设置
    saveSleepSettings() {
        if (!this.currentContactId) {
            alert('联系人不存在');
            return;
        }
        
        const bedtime = document.getElementById('bedtimeInput').value;
        const wakeupTime = document.getElementById('wakeupTimeInput').value;
        
        if (!bedtime || !wakeupTime) {
            alert('请设置完整的睡眠时间');
            return;
        }
        
        // 获取联系人数据
        const contacts = this.getAllContacts();
        const contactIndex = contacts.findIndex(c => c.id == this.currentContactId);
        
        if (contactIndex === -1) {
            alert('联系人不存在');
            return;
        }
        
        // 更新睡眠设置
        contacts[contactIndex].sleepSettings = {
            bedtime: bedtime,
            wakeupTime: wakeupTime
        };
        
        // 保存到localStorage
        localStorage.setItem('vibe_contacts', JSON.stringify(contacts));
        
        // 关闭弹窗
        this.closeSleepSettings();
        
        // 显示成功消息
        const duration = this.calculateSleepDuration(bedtime, wakeupTime);
        alert(`睡眠时间设置已保存！\n睡觉：${bedtime}\n起床：${wakeupTime}\n睡眠时长：约${duration.hours}.${Math.round(duration.minutes / 60 * 10)}小时`);
        
        console.log('💤 [睡眠设置] 已保存:', { bedtime, wakeupTime, duration });
    },
    
    // 清理旧记忆（超过maxMemoryCount）
    cleanOldMemories(contactId, memories) {
        const settings = this.getSettings();
        const maxCount = settings.maxMemoryCount || 100;
        
        const dates = Object.keys(memories).sort((a, b) => new Date(b) - new Date(a));
        
        if (dates.length > maxCount) {
            // 删除最旧的记忆
            const toDelete = dates.slice(maxCount);
            toDelete.forEach(date => {
                delete memories[date];
            });
            
            console.log(`已清理 ${toDelete.length} 条旧记忆`);
        }
    },
    
    // 手动清理所有数据
    clearAllData(contactId) {
        if (!confirm('确定要清除该联系人的所有行程卡和记忆数据吗？此操作不可恢复！')) {
            return;
        }
        
        localStorage.removeItem(`travelCards_${contactId}`);
        localStorage.removeItem(`travelCardMemories_${contactId}`);
        localStorage.removeItem(`travelCardSettings_${contactId}`);
        
        alert('数据已清除');
        this.loadAllCards();
    },

    // ==================== CSS美化方案管理 ====================
    // ==================== CSS美化方案管理 ====================
    
    // 加载CSS方案
    loadCSSSchemes() {
        this.cssSchemes = JSON.parse(localStorage.getItem('travelCardCSSSchemes') || '{}');
        this.currentCSSSchemeId = localStorage.getItem('currentTravelCardCSSScheme') || 'default';
        
        // 如果没有方案，初始化默认方案
        if (Object.keys(this.cssSchemes).length === 0) {
            this.cssSchemes = {
                default: {
                    id: 'default',
                    name: '默认 - Y2K少女心',
                    css: `/* Y2K少女心像素风格 - 默认主题 */
:root {
    /* 主题色 */
    --travel-card-bg-color: rgba(255, 255, 255, 0.9);
    --travel-card-border-color: #000000;
    --travel-card-text-color: #000000;
    --travel-card-time-color: #FF1493;
    --travel-card-activity-color: #FF69B4;
    --travel-card-shadow-color: #FFB6C1;
    --travel-card-accent-color: #FF69B4;
    --travel-card-locked-color: #CCCCCC;
    
    /* 交互效果色 */
    --travel-card-hover-bg: #FF1493;  /* 按钮hover背景色 */
    --travel-card-hover-overlay: rgba(255, 255, 255, 0.5);  /* 半透明hover效果 */
    
    /* 背景设置 */
    --travel-card-page-bg: #FFF0F5;  /* 页面背景色 */
    --travel-card-page-bg-image: none;  /* 页面背景图片，例如: url(图片地址) */
    --travel-card-container-bg: #FFF0F5;  /* 容器背景色 */
    --travel-card-card-bg-image: none;  /* 卡片背景图片，例如: url(图片地址) */
}

/* 页面背景 */
body {
    background: var(--travel-card-page-bg);
    background-image: var(--travel-card-page-bg-image);
}`,
                    createdAt: Date.now(),
                    isDefault: true
                }
            };
            this.saveCSSSchemes();
        }
        
        console.log('✅ [CSS方案] 已加载:', Object.keys(this.cssSchemes).length, '个方案');
    },
    
    // 保存CSS方案
    saveCSSSchemes() {
        localStorage.setItem('travelCardCSSSchemes', JSON.stringify(this.cssSchemes));
        localStorage.setItem('currentTravelCardCSSScheme', this.currentCSSSchemeId);
        console.log('💾 [CSS方案] 已保存');
    },
    
    // 应用CSS方案
    applyCSSScheme() {
        const scheme = this.cssSchemes[this.currentCSSSchemeId];
        if (!scheme) {
            console.warn('⚠️ [CSS方案] 方案不存在:', this.currentCSSSchemeId);
            return;
        }
        
        // 移除旧的style标签
        const oldStyle = document.getElementById('travel-card-custom-css');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        // 添加新的style标签
        const style = document.createElement('style');
        style.id = 'travel-card-custom-css';
        style.textContent = scheme.css;
        document.head.appendChild(style);
        
        console.log('🎨 [CSS方案] 已应用:', scheme.name);
    },
    
    // 加载CSS方案选择器
    loadCSSSchemeSelector() {
        const select = document.getElementById('cssSchemeSelect');
        if (!select) return;
        
        select.innerHTML = '';
        
        Object.values(this.cssSchemes).forEach(scheme => {
            const option = document.createElement('option');
            option.value = scheme.id;
            option.textContent = scheme.name;
            if (scheme.id === this.currentCSSSchemeId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    },
    
    // 切换CSS方案
    switchCSSScheme(schemeId) {
        if (!this.cssSchemes[schemeId]) {
            alert('方案不存在');
            return;
        }
        
        this.currentCSSSchemeId = schemeId;
        this.saveCSSSchemes();
        this.applyCSSScheme();
        
        console.log('✅ [CSS方案] 已切换到:', this.cssSchemes[schemeId].name);
    },
    
    // 打开CSS编辑器
    openCSSEditor() {
        const currentScheme = this.cssSchemes[this.currentCSSSchemeId];
        if (!currentScheme) return;
        
        document.getElementById('cssSchemeName').value = currentScheme.name;
        document.getElementById('cssSchemeCode').value = currentScheme.css;
        
        document.getElementById('cssEditorModal').classList.add('active');
    },
    
    // 关闭CSS编辑器
    closeCSSEditor() {
        document.getElementById('cssEditorModal').classList.remove('active');
    },
    
    // 保存CSS方案
    saveCSSScheme() {
        const name = document.getElementById('cssSchemeName').value.trim();
        const css = document.getElementById('cssSchemeCode').value.trim();
        
        if (!name) {
            alert('请输入方案名称');
            return;
        }
        
        if (!css) {
            alert('请输入CSS代码');
            return;
        }
        
        // 更新当前方案
        const currentScheme = this.cssSchemes[this.currentCSSSchemeId];
        currentScheme.name = name;
        currentScheme.css = css;
        currentScheme.updatedAt = Date.now();
        
        this.saveCSSSchemes();
        this.applyCSSScheme();
        this.loadCSSSchemeSelector();
        this.closeCSSEditor();
        
        alert('CSS方案已保存！');
    },
    
    // 创建新CSS方案
    createNewCSSScheme() {
        const name = prompt('请输入新方案名称：', '我的方案');
        if (!name) return;
        
        const newId = 'scheme_' + Date.now();
        
        this.cssSchemes[newId] = {
            id: newId,
            name: name,
            css: `/* ${name} */
:root {
    /* 主题色 */
    --travel-card-bg-color: rgba(255, 255, 255, 0.9);
    --travel-card-border-color: #000000;
    --travel-card-text-color: #000000;
    --travel-card-time-color: #FF1493;
    --travel-card-activity-color: #FF69B4;
    --travel-card-shadow-color: #FFB6C1;
    --travel-card-accent-color: #FF69B4;
    --travel-card-locked-color: #CCCCCC;
}`,
            createdAt: Date.now(),
            isDefault: false
        };
        
        this.currentCSSSchemeId = newId;
        this.saveCSSSchemes();
        this.applyCSSScheme();
        this.loadCSSSchemeSelector();
        
        alert('新方案已创建！');
    },
    
    // 删除CSS方案
    deleteCSSScheme() {
        const currentScheme = this.cssSchemes[this.currentCSSSchemeId];
        
        if (currentScheme.isDefault) {
            alert('默认方案不能删除');
            return;
        }
        
        if (!confirm(`确定要删除方案「${currentScheme.name}」吗？`)) {
            return;
        }
        
        delete this.cssSchemes[this.currentCSSSchemeId];
        this.currentCSSSchemeId = 'default';
        this.saveCSSSchemes();
        this.applyCSSScheme();
        this.loadCSSSchemeSelector();
        
        alert('方案已删除');
    },
    
    // ==================== 背景管理 ====================
    
    // 应用背景
    applyBackgrounds(settings) {
        if (!settings) {
            settings = this.getSettings();
        }
        
        // 应用页面背景
        if (settings.pageBackground) {
            document.documentElement.style.setProperty('--travel-card-page-bg-image', `url(${settings.pageBackground})`);
            console.log('🖼️ [背景] 已应用页面背景');
        } else {
            document.documentElement.style.setProperty('--travel-card-page-bg-image', 'none');
        }
        
        // 应用卡片背景
        if (settings.cardBackground) {
            document.documentElement.style.setProperty('--travel-card-card-bg-image', `url(${settings.cardBackground})`);
            console.log('🎴 [背景] 已应用卡片背景');
        } else {
            document.documentElement.style.setProperty('--travel-card-card-bg-image', 'none');
        }
    },
    
    // 处理背景上传
    handleBackgroundUpload(input, type) {
        const file = input.files[0];
        if (!file) return;
        
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        
        // 检查文件大小（限制5MB）
        if (file.size > 5 * 1024 * 1024) {
            alert('图片文件不能超过5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            
            // 更新输入框
            if (type === 'page') {
                document.getElementById('pageBackgroundUrl').value = dataUrl;
                // 立即预览
                document.documentElement.style.setProperty('--travel-card-page-bg-image', `url(${dataUrl})`);
            } else if (type === 'card') {
                document.getElementById('cardBackgroundUrl').value = dataUrl;
                // 立即预览
                document.documentElement.style.setProperty('--travel-card-card-bg-image', `url(${dataUrl})`);
            }
            
            console.log('✅ [背景] 图片已上传并预览:', type);
        };
        
        reader.onerror = () => {
            alert('图片读取失败，请重试');
        };
        
        reader.readAsDataURL(file);
    },
    
    // 清除背景
    clearBackground(type) {
        if (type === 'page') {
            document.getElementById('pageBackgroundUrl').value = '';
            document.documentElement.style.setProperty('--travel-card-page-bg-image', 'none');
        } else if (type === 'card') {
            document.getElementById('cardBackgroundUrl').value = '';
            document.documentElement.style.setProperty('--travel-card-card-bg-image', 'none');
        }
        
        console.log('🗑️ [背景] 已清除:', type);
    },
    
    // ==================== 字体联动 ====================
    
    // 应用全局字体（从外观设置中读取）
    async applyGlobalFont() {
        try {
            // 读取外观设置中的字体方案
            const activeFontScheme = localStorage.getItem('activeFontScheme');
            const fontSchemes = JSON.parse(localStorage.getItem('fontSchemes') || '{}');
            
            console.log('🔍 [字体调试] activeFontScheme:', activeFontScheme);
            console.log('🔍 [字体调试] fontSchemes:', fontSchemes);
            
            if (activeFontScheme && fontSchemes[activeFontScheme]) {
                const scheme = fontSchemes[activeFontScheme];
                console.log('🔍 [字体调试] 当前方案:', scheme);
                
                // 如果有fontFace，先添加到页面
                if (scheme.fontFace) {
                    let style = document.getElementById('travel-card-font-style');
                    if (!style) {
                        style = document.createElement('style');
                        style.id = 'travel-card-font-style';
                        document.head.appendChild(style);
                    }
                    style.textContent = scheme.fontFace;
                    console.log('🔤 [字体] 已添加@font-face:', scheme.fontFace);
                }
                
                // 立即应用字体到所有元素
                if (scheme.fontFamily) {
                    this.applyFontToElements(scheme.fontFamily);
                    console.log('🔤 [字体] 已应用字体方案:', activeFontScheme, scheme.fontFamily);
                }
                
                // 等待字体加载后再次应用
                if (document.fonts && document.fonts.load && scheme.fontFace) {
                    try {
                        const fontFamily = `CustomFont_${activeFontScheme}`;
                        await document.fonts.load(`16px "${fontFamily}"`);
                        console.log('✅ [字体] 字体已加载:', fontFamily);
                        // 再次应用以确保生效
                        this.applyFontToElements(scheme.fontFamily);
                    } catch (e) {
                        console.warn('⚠️ [字体] 字体加载失败，但已应用:', e);
                    }
                } else if (scheme.fontFace) {
                    // 降级方案：延迟应用
                    console.log('🔤 [字体] 浏览器不支持 Font Loading API，使用延迟应用');
                    setTimeout(() => {
                        this.applyFontToElements(scheme.fontFamily);
                    }, 500);
                }
            } else {
                // 使用系统字体
                const systemFont = localStorage.getItem('systemFont');
                if (systemFont) {
                    this.applyFontToElements(systemFont);
                    console.log('🔤 [字体] 已应用系统字体:', systemFont);
                } else {
                    // 使用默认字体
                    const defaultFont = "'Courier New', 'MS Gothic', monospace";
                    this.applyFontToElements(defaultFont);
                    console.log('🔤 [字体] 使用默认字体');
                }
            }
        } catch (e) {
            console.error('❌ [字体] 应用字体失败:', e);
            // 降级到默认字体
            const defaultFont = "'Courier New', 'MS Gothic', monospace";
            this.applyFontToElements(defaultFont);
        }
    },
    
    // 应用字体到所有元素（包括不继承body字体的表单元素）
    applyFontToElements(fontFamily) {
        console.log('🔤 [字体] 应用字体到所有元素:', fontFamily);
        
        // 应用到 html 和 body（会继承到大部分子元素）
        document.documentElement.style.fontFamily = fontFamily;
        document.body.style.fontFamily = fontFamily;
        
        // 应用到所有输入元素（input, textarea, select, button 默认不继承 body 字体）
        const elements = document.querySelectorAll('input, textarea, select, button, option');
        elements.forEach(el => {
            el.style.fontFamily = fontFamily;
        });
        
        // 强制重新渲染
        void document.body.offsetHeight;
        
        console.log('✅ [字体] 字体应用完成，已应用到', elements.length, '个表单元素');
    },
    
    // ==================== 自定义字体功能 ====================
    
    // 应用自定义字体（从设置中的URL）
    applyCustomFont() {
        const fontUrl = document.getElementById('customFontUrl').value.trim();
        
        if (!fontUrl) {
            alert('请输入字体文件URL');
            return;
        }
        
        // 保存字体URL到localStorage
        localStorage.setItem('travelCardCustomFont', fontUrl);
        
        // 创建@font-face规则
        const fontFace = `
@font-face {
    font-family: 'TravelCardCustomFont';
    src: url('${fontUrl}');
}`;
        
        // 移除旧的字体样式
        let style = document.getElementById('travel-card-custom-font-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'travel-card-custom-font-style';
            document.head.appendChild(style);
        }
        
        style.textContent = fontFace;
        
        // 应用字体
        const fontFamily = "'TravelCardCustomFont', -apple-system, BlinkMacSystemFont, sans-serif";
        this.applyFontToElements(fontFamily);
        
        console.log('✅ [自定义字体] 已应用字体:', fontUrl);
        alert('字体已应用！');
    },
    
    // 清除自定义字体
    clearCustomFont() {
        // 移除localStorage中的字体URL
        localStorage.removeItem('travelCardCustomFont');
        
        // 移除字体样式
        const style = document.getElementById('travel-card-custom-font-style');
        if (style) {
            style.remove();
        }
        
        // 清空输入框
        document.getElementById('customFontUrl').value = '';
        
        // 恢复默认字体
        const defaultFont = "'Courier New', 'MS Gothic', monospace";
        this.applyFontToElements(defaultFont);
        
        console.log('✅ [自定义字体] 已清除自定义字体');
        alert('已恢复默认字体！');
    },
    
    // 加载自定义字体（页面初始化时调用）
    loadCustomFont() {
        const fontUrl = localStorage.getItem('travelCardCustomFont');
        
        if (fontUrl) {
            // 设置输入框的值
            const input = document.getElementById('customFontUrl');
            if (input) {
                input.value = fontUrl;
            }
            
            // 创建@font-face规则
            const fontFace = `
@font-face {
    font-family: 'TravelCardCustomFont';
    src: url('${fontUrl}');
}`;
            
            // 添加字体样式
            let style = document.getElementById('travel-card-custom-font-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'travel-card-custom-font-style';
                document.head.appendChild(style);
            }
            
            style.textContent = fontFace;
            
            // 应用字体
            const fontFamily = "'TravelCardCustomFont', -apple-system, BlinkMacSystemFont, sans-serif";
            this.applyFontToElements(fontFamily);
            
            console.log('✅ [自定义字体] 已加载保存的字体:', fontUrl);
        }
    }

};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    TravelCard.init();
});
