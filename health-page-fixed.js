// 健康页面功能
class HealthPage {
    constructor() {
        this.currentDate = new Date();
        this.sleepCalendarDate = new Date();
        this.skincareCalendarDate = new Date();
        this.periodCalendarDate = new Date();
        this.bowelCalendarDate = new Date();
        this.mealDate = new Date();
        this.selectedSleepDate = null;
        this.selectedSkincareDate = null;
        this.selectedSkincareType = 'skincare';
        this.selectedPeriodDate = null;
        this.selectedExerciseDay = null;
        this.selectedMealType = null;
        this.selectedMealRating = 0;
        this.currentExerciseWeek = new Date();
        this.healthData = this.loadHealthData();
        
        this.init();
    }

    init() {
        try {
            // 先初始化所有数据结构
            this.initializeAllData();
            
            // 然后渲染日历
            this.renderSleepCalendar();
            this.renderSkincareCalendars();
            this.renderPeriodCalendar();
            this.renderExerciseWeek();
            this.generateBowelCalendar();
            this.renderMealRecords();
            
            // 最后绑定事件和加载数据
            this.bindEvents();
            this.loadTodayData();
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 初始化所有数据结构
    initializeAllData() {
        // 确保所有数据结构都存在
        if (!this.healthData.sleep) {
            this.healthData.sleep = {};
        }
        
        if (!this.healthData.skincare) {
            this.healthData.skincare = {};
        }
        
        if (!this.healthData.skinStatus) {
            this.healthData.skinStatus = {};
        }
        
        if (!this.healthData.period) {
            this.healthData.period = {
                records: {}, // 存储每日的生理期状态
                cycles: [], // 存储月经周期记录 [{start: '2026-01-15', end: '2026-01-20', length: 28}]
                settings: {
                    averageCycle: 28, // 平均周期长度
                    averagePeriod: 5  // 平均月经天数
                }
            };
        }
        
        if (!this.healthData.periodHistory) {
            this.healthData.periodHistory = [];
        }
        
        if (!this.healthData.periodColors) {
            this.healthData.periodColors = {
                menstrual: '#ff6b6b',
                follicular: '#4ecdc4',
                ovulation: '#45b7d1',
                luteal: '#f9ca24',
                safe: '#6c5ce7'
            };
        }
        
        if (!this.healthData.bowel) {
            this.healthData.bowel = {};
        }
        
        if (!this.healthData.meals) {
            this.healthData.meals = {};
        }
        
        if (!this.healthData.bowelSettings) {
            this.healthData.bowelSettings = {
                icon: '💩'
            };
        }
        
        // 初始化护肤类型
        this.initializeSkincareTypes();
    }

    // 加载健康数据
    loadHealthData() {
        const saved = localStorage.getItem('health-page-data');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            sleep: {},
            skincare: {},
            skinStatus: {},
            period: {},
            exercise: {},
            bowel: {},
            meals: {},
            skincareTypes: [
                { id: 1, name: '基础护肤', color: '#c9e4c9' },
                { id: 2, name: '面膜', color: '#e4c9f5' },
                { id: 3, name: '精华', color: '#f5e4c9' }
            ],
            skinStatusTypes: [
                { id: 1, name: '状态良好', color: '#c9f5c9' },
                { id: 2, name: '干燥', color: '#f5d4c9' },
                { id: 3, name: '出油', color: '#c9d4f5' }
            ],
            colorPalette: ['#c9e4c9', '#e4c9f5', '#f5e4c9', '#c9f5c9', '#f5d4c9', '#c9d4f5', '#f5c9c9', '#c9f5f5']
        };
    }

    // 保存健康数据
    saveHealthData() {
        localStorage.setItem('health-page-data', JSON.stringify(this.healthData));
    }

    // 渲染护肤日历
    renderSkincareCalendars() {
        this.renderSkincareCalendar();
        this.renderSkinStatusCalendar();
        this.updateSkincareMonthDisplay();
    }

    // 更新护肤月份显示
    updateSkincareMonthDisplay() {
        const monthDisplay = document.getElementById('skincareCalendarMonth');
        if (monthDisplay) {
            const year = this.skincareCalendarDate.getFullYear();
            const month = this.skincareCalendarDate.getMonth() + 1;
            monthDisplay.textContent = `${year}年${month}月护肤记录`;
        }
    }

    // 渲染护肤记录日历
    renderSkincareCalendar() {
        const calendar = document.getElementById('skincareCalendar');
        if (calendar) {
            this.renderCalendarGrid(calendar, 'skincare');
        }
    }

    // 渲染皮肤状态日历
    renderSkinStatusCalendar() {
        const calendar = document.getElementById('skinStatusCalendar');
        if (calendar) {
            this.renderCalendarGrid(calendar, 'skinStatus');
        }
    }

    // 通用日历网格渲染
    renderCalendarGrid(calendar, dataType) {
        const year = this.skincareCalendarDate.getFullYear();
        const month = this.skincareCalendarDate.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        
        calendar.innerHTML = '';
        
        // 确保数据类型存在
        if (!this.healthData[dataType]) {
            this.healthData[dataType] = {};
        }
        
        // 添加星期标题
        const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
        weekdays.forEach(day => {
            const weekdayCell = document.createElement('div');
            weekdayCell.className = 'weekday-header';
            weekdayCell.textContent = day;
            calendar.appendChild(weekdayCell);
        });
        
        // 添加空白格子
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendar.appendChild(emptyCell);
        }
        
        // 添加当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = this.healthData[dataType][dateKey];
            
            dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            
            if (record) {
                dayElement.style.backgroundColor = record.color;
                dayElement.classList.add('has-record');
            }
            
            // 标记今天
            const today = new Date();
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // 添加点击事件
            dayElement.addEventListener('click', () => {
                this.openSkincareSelectModal(dateKey, day, month + 1, year, dataType);
            });
            
            calendar.appendChild(dayElement);
        }
    }

    // 初始化护肤类型
    initializeSkincareTypes() {
        // 确保有默认的护肤类型
        if (!this.healthData.skincareTypes || this.healthData.skincareTypes.length === 0) {
            this.healthData.skincareTypes = [
                { id: 1, name: '基础护肤', color: '#c9e4c9' },
                { id: 2, name: '面膜', color: '#e4c9f5' },
                { id: 3, name: '精华', color: '#f5e4c9' }
            ];
        }
        
        if (!this.healthData.skinStatusTypes || this.healthData.skinStatusTypes.length === 0) {
            this.healthData.skinStatusTypes = [
                { id: 1, name: '状态良好', color: '#c9f5c9' },
                { id: 2, name: '干燥', color: '#f5d4c9' },
                { id: 3, name: '出油', color: '#c9d4f5' }
            ];
        }
        
        if (!this.healthData.colorPalette || this.healthData.colorPalette.length === 0) {
            this.healthData.colorPalette = ['#c9e4c9', '#e4c9f5', '#f5e4c9', '#c9f5c9', '#f5d4c9', '#c9d4f5', '#f5c9c9', '#c9f5f5'];
        }
        
        this.saveHealthData();
    }

    // 切换护肤日历月份
    changeSkincareMonth(delta) {
        this.skincareCalendarDate.setMonth(this.skincareCalendarDate.getMonth() + delta);
        this.renderSkincareCalendars();
    }

    // 打开护肤类型管理弹窗
    openSkincareTypeModal() {
        this.renderSkincareTypeList();
        this.renderColorPalette('skincarePalette');
        document.getElementById('skincareTypeModal').classList.add('active');
    }

    // 打开皮肤状态类型管理弹窗
    openSkinStatusTypeModal() {
        this.renderSkinStatusTypeList();
        this.renderColorPalette('skinStatusPalette');
        document.getElementById('skinStatusTypeModal').classList.add('active');
    }

    // 渲染护肤类型列表
    renderSkincareTypeList() {
        const list = document.getElementById('skincareTypeList');
        if (!list) return;
        
        list.innerHTML = '';
        
        this.healthData.skincareTypes.forEach(type => {
            const item = document.createElement('div');
            item.className = 'type-item';
            item.innerHTML = `
                <div class="type-info">
                    <div class="type-color" style="background-color: ${type.color}"></div>
                    <span class="type-name">${type.name}</span>
                </div>
                <div class="type-actions">
                    <button class="delete-type-btn" onclick="deleteSkincareType(${type.id})">删除</button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    // 渲染皮肤状态类型列表
    renderSkinStatusTypeList() {
        const list = document.getElementById('skinStatusTypeList');
        if (!list) return;
        
        list.innerHTML = '';
        
        this.healthData.skinStatusTypes.forEach(type => {
            const item = document.createElement('div');
            item.className = 'type-item';
            item.innerHTML = `
                <div class="type-info">
                    <div class="type-color" style="background-color: ${type.color}"></div>
                    <span class="type-name">${type.name}</span>
                </div>
                <div class="type-actions">
                    <button class="delete-type-btn" onclick="deleteSkinStatusType(${type.id})">删除</button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    // 渲染颜色调色板
    renderColorPalette(paletteId) {
        const palette = document.getElementById(paletteId);
        if (!palette) return;
        
        palette.innerHTML = '';
        
        this.healthData.colorPalette.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', () => {
                if (paletteId === 'skincarePalette') {
                    const colorInput = document.getElementById('newSkincareTypeColor');
                    if (colorInput) colorInput.value = color;
                } else {
                    const colorInput = document.getElementById('newSkinStatusTypeColor');
                    if (colorInput) colorInput.value = color;
                }
            });
            palette.appendChild(colorDiv);
        });
    }

    // 其他必要的方法（完整版本）
    renderSleepCalendar() {
        const calendar = document.getElementById('sleepCalendar');
        const monthDisplay = document.getElementById('sleepCalendarMonth');
        
        if (!calendar) {
            console.log('睡眠日历元素不存在');
            return;
        }
        
        const year = this.sleepCalendarDate.getFullYear();
        const month = this.sleepCalendarDate.getMonth();
        
        // 更新月份显示
        if (monthDisplay) {
            monthDisplay.textContent = `${year}年${month + 1}月睡眠记录`;
        }
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1; // 周一为第一天
        
        calendar.innerHTML = '';
        
        // 确保睡眠数据存在
        if (!this.healthData.sleep) {
            this.healthData.sleep = {};
        }
        
        // 添加星期标题
        const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
        weekdays.forEach(day => {
            const weekdayCell = document.createElement('div');
            weekdayCell.className = 'weekday-header';
            weekdayCell.textContent = day;
            calendar.appendChild(weekdayCell);
        });
        
        // 添加空白格子（上个月的日期）
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendar.appendChild(emptyCell);
        }
        
        // 添加当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const sleepRecord = this.healthData.sleep[dateKey];
            
            if (sleepRecord && sleepRecord.duration) {
                // 显示睡眠时长
                dayElement.innerHTML = `
                    <div class="day-number">${day}</div>
                    <div class="sleep-duration">${sleepRecord.duration}</div>
                `;
                dayElement.classList.add('has-sleep-record');
            } else {
                dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            }
            
            // 标记今天
            const today = new Date();
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // 添加点击事件
            dayElement.addEventListener('click', () => {
                this.openSleepEditModal(dateKey, day, month + 1, year);
            });
            
            calendar.appendChild(dayElement);
        }
    }

    // 睡眠相关功能
    calculateSleepDuration(sleepHour, sleepMinute, wakeHour, wakeMinute) {
        let sleepTime = sleepHour * 60 + sleepMinute;
        let wakeTime = wakeHour * 60 + wakeMinute;
        
        // 如果起床时间小于睡觉时间，说明跨夜了
        if (wakeTime < sleepTime) {
            wakeTime += 24 * 60; // 加一天的分钟数
        }
        
        const durationMinutes = wakeTime - sleepTime;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        return `${hours}H${String(minutes).padStart(2, '0')}M`;
    }

    // 保存睡眠记录
    saveSleepRecord() {
        const sleepHour = parseInt(document.getElementById('sleepHour').value);
        const sleepMinute = parseInt(document.getElementById('sleepMinute').value);
        const wakeHour = parseInt(document.getElementById('wakeHour').value);
        const wakeMinute = parseInt(document.getElementById('wakeMinute').value);
        
        // 验证输入
        if (isNaN(sleepHour) || isNaN(sleepMinute) || isNaN(wakeHour) || isNaN(wakeMinute)) {
            alert('请填写完整的睡眠时间');
            return;
        }
        
        if (sleepHour < 0 || sleepHour > 23 || wakeHour < 0 || wakeHour > 23 ||
            sleepMinute < 0 || sleepMinute > 59 || wakeMinute < 0 || wakeMinute > 59) {
            alert('请输入有效的时间（小时：0-23，分钟：0-59）');
            return;
        }
        
        // 计算睡眠时长
        const duration = this.calculateSleepDuration(sleepHour, sleepMinute, wakeHour, wakeMinute);
        
        // 确定保存日期（起床日期）
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        // 保存睡眠记录
        this.healthData.sleep[dateKey] = {
            sleepTime: `${String(sleepHour).padStart(2, '0')}:${String(sleepMinute).padStart(2, '0')}`,
            wakeTime: `${String(wakeHour).padStart(2, '0')}:${String(wakeMinute).padStart(2, '0')}`,
            duration: duration,
            date: dateKey
        };
        
        this.saveHealthData();
        
        // 强制重新渲染睡眠日历
        setTimeout(() => {
            this.renderSleepCalendar();
        }, 100);
        
        // 清空输入框
        const inputs = ['sleepHour', 'sleepMinute', 'wakeHour', 'wakeMinute'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        
        alert(`睡眠记录已保存！睡眠时长：${duration}`);
    }

    // 切换睡眠日历月份
    changeSleepMonth(delta) {
        this.sleepCalendarDate.setMonth(this.sleepCalendarDate.getMonth() + delta);
        this.renderSleepCalendar();
    }

    // 打开睡眠编辑弹窗
    openSleepEditModal(dateKey, day, month, year) {
        this.selectedSleepDate = dateKey;
        
        // 设置弹窗标题和日期
        const titleElement = document.getElementById('sleepEditTitle');
        const dateElement = document.getElementById('sleepEditDate');
        
        if (titleElement) titleElement.textContent = '编辑睡眠记录';
        if (dateElement) dateElement.textContent = `${year}年${month}月${day}日`;
        
        // 检查是否已有记录
        const existingRecord = this.healthData.sleep[dateKey];
        const deleteBtn = document.getElementById('deleteSleepBtn');
        
        if (existingRecord) {
            // 填充现有数据
            const sleepTime = existingRecord.sleepTime.split(':');
            const wakeTime = existingRecord.wakeTime.split(':');
            
            const editSleepHour = document.getElementById('editSleepHour');
            const editSleepMinute = document.getElementById('editSleepMinute');
            const editWakeHour = document.getElementById('editWakeHour');
            const editWakeMinute = document.getElementById('editWakeMinute');
            
            if (editSleepHour) editSleepHour.value = parseInt(sleepTime[0]);
            if (editSleepMinute) editSleepMinute.value = parseInt(sleepTime[1]);
            if (editWakeHour) editWakeHour.value = parseInt(wakeTime[0]);
            if (editWakeMinute) editWakeMinute.value = parseInt(wakeTime[1]);
            
            if (deleteBtn) deleteBtn.style.display = 'block';
        } else {
            // 清空输入框
            const inputs = ['editSleepHour', 'editSleepMinute', 'editWakeHour', 'editWakeMinute'];
            inputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.value = '';
            });
            
            if (deleteBtn) deleteBtn.style.display = 'none';
        }
        
        // 显示弹窗
        const modal = document.getElementById('sleepEditModal');
        if (modal) modal.classList.add('active');
    }

    // 关闭睡眠编辑弹窗
    closeSleepEditModal() {
        const modal = document.getElementById('sleepEditModal');
        if (modal) modal.classList.remove('active');
        this.selectedSleepDate = null;
    }

    // 保存编辑的睡眠记录
    saveEditedSleepRecord() {
        const sleepHour = parseInt(document.getElementById('editSleepHour').value);
        const sleepMinute = parseInt(document.getElementById('editSleepMinute').value);
        const wakeHour = parseInt(document.getElementById('editWakeHour').value);
        const wakeMinute = parseInt(document.getElementById('editWakeMinute').value);
        
        // 验证输入
        if (isNaN(sleepHour) || isNaN(sleepMinute) || isNaN(wakeHour) || isNaN(wakeMinute)) {
            alert('请填写完整的睡眠时间');
            return;
        }
        
        if (sleepHour < 0 || sleepHour > 23 || wakeHour < 0 || wakeHour > 23 ||
            sleepMinute < 0 || sleepMinute > 59 || wakeMinute < 0 || wakeMinute > 59) {
            alert('请输入有效的时间（小时：0-23，分钟：0-59）');
            return;
        }
        
        // 计算睡眠时长
        const duration = this.calculateSleepDuration(sleepHour, sleepMinute, wakeHour, wakeMinute);
        
        // 保存睡眠记录
        this.healthData.sleep[this.selectedSleepDate] = {
            sleepTime: `${String(sleepHour).padStart(2, '0')}:${String(sleepMinute).padStart(2, '0')}`,
            wakeTime: `${String(wakeHour).padStart(2, '0')}:${String(wakeMinute).padStart(2, '0')}`,
            duration: duration,
            date: this.selectedSleepDate
        };
        
        this.saveHealthData();
        this.renderSleepCalendar();
        this.closeSleepEditModal();
        
        alert(`睡眠记录已保存！睡眠时长：${duration}`);
    }

    // 删除选中的睡眠记录
    deleteSelectedSleepRecord() {
        if (confirm('确定删除这条睡眠记录吗？')) {
            delete this.healthData.sleep[this.selectedSleepDate];
            this.saveHealthData();
            this.renderSleepCalendar();
            this.closeSleepEditModal();
            alert('睡眠记录已删除');
        }
    }

    generateBowelCalendar() {
        const calendar = document.getElementById('bowelCalendar');
        const monthDisplay = document.getElementById('bowelCalendarMonth');
        
        if (!calendar) {
            console.log('排便日历元素不存在');
            return;
        }
        
        const year = this.bowelCalendarDate.getFullYear();
        const month = this.bowelCalendarDate.getMonth();
        
        // 更新月份显示
        if (monthDisplay) {
            monthDisplay.textContent = `${year}年${month + 1}月排便记录`;
        }
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1; // 周一为第一天
        
        calendar.innerHTML = '';
        
        // 确保排便数据存在
        if (!this.healthData.bowel) {
            this.healthData.bowel = {};
        }
        
        // 添加星期标题
        const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
        weekdays.forEach(day => {
            const weekdayCell = document.createElement('div');
            weekdayCell.className = 'weekday-header';
            weekdayCell.textContent = day;
            calendar.appendChild(weekdayCell);
        });
        
        // 添加空白格子（上个月的日期）
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendar.appendChild(emptyCell);
        }
        
        // 添加当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const bowelRecord = this.healthData.bowel[dateKey];
            
            dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            
            if (bowelRecord) {
                dayElement.classList.add('has-bowel-record');
                // 添加自定义图标
                const iconElement = document.createElement('div');
                iconElement.className = 'bowel-icon';
                iconElement.textContent = this.healthData.bowelSettings.icon || '💩';
                dayElement.appendChild(iconElement);
            }
            
            // 标记今天
            const today = new Date();
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // 添加点击事件
            dayElement.addEventListener('click', () => {
                this.toggleBowelRecord(dateKey, dayElement);
            });
            
            calendar.appendChild(dayElement);
        }
    }

    // 切换排便记录
    toggleBowelRecord(dateKey, element) {
        if (this.healthData.bowel[dateKey]) {
            // 删除记录
            delete this.healthData.bowel[dateKey];
            element.classList.remove('has-bowel-record');
            
            // 移除图标
            const iconElement = element.querySelector('.bowel-icon');
            if (iconElement) {
                iconElement.remove();
            }
        } else {
            // 添加记录
            this.healthData.bowel[dateKey] = {
                date: dateKey,
                time: new Date().toTimeString().slice(0, 5),
                recorded: true
            };
            element.classList.add('has-bowel-record');
            
            // 添加图标
            const iconElement = document.createElement('div');
            iconElement.className = 'bowel-icon';
            iconElement.textContent = this.healthData.bowelSettings.icon || '💩';
            element.appendChild(iconElement);
        }
        
        this.saveHealthData();
    }

    // 切换排便日历月份
    changeBowelMonth(delta) {
        this.bowelCalendarDate.setMonth(this.bowelCalendarDate.getMonth() + delta);
        this.generateBowelCalendar();
    }

    // 打开排便设置弹窗
    openBowelSettingsModal() {
        this.loadBowelSettings();
        document.getElementById('bowelSettingsModal').classList.add('active');
    }

    // 加载排便设置
    loadBowelSettings() {
        const iconInput = document.getElementById('bowelIconInput');
        const iconPreview = document.getElementById('bowelIconPreview');
        
        const currentIcon = this.healthData.bowelSettings.icon || '💩';
        if (iconInput) iconInput.value = currentIcon;
        if (iconPreview) iconPreview.textContent = currentIcon;
        
        // 更新选中状态
        document.querySelectorAll('.icon-option').forEach(option => {
            option.classList.remove('selected');
            if (option.textContent === currentIcon) {
                option.classList.add('selected');
            }
        });
    }

    // 预览排便图标
    previewBowelIcon() {
        const iconInput = document.getElementById('bowelIconInput');
        const iconPreview = document.getElementById('bowelIconPreview');
        
        if (iconInput && iconPreview) {
            const newIcon = iconInput.value.trim() || '💩';
            iconPreview.textContent = newIcon;
        }
    }

    // 选择排便图标
    selectBowelIcon(icon) {
        const iconInput = document.getElementById('bowelIconInput');
        const iconPreview = document.getElementById('bowelIconPreview');
        
        if (iconInput) iconInput.value = icon;
        if (iconPreview) iconPreview.textContent = icon;
        
        // 更新选中状态
        document.querySelectorAll('.icon-option').forEach(option => {
            option.classList.remove('selected');
            if (option.textContent === icon) {
                option.classList.add('selected');
            }
        });
    }

    // 保存排便设置
    saveBowelSettings() {
        const iconInput = document.getElementById('bowelIconInput');
        
        if (iconInput) {
            const newIcon = iconInput.value.trim() || '💩';
            this.healthData.bowelSettings.icon = newIcon;
            this.saveHealthData();
            this.generateBowelCalendar(); // 重新渲染日历以显示新图标
            this.closeBowelSettingsModal();
            alert('排便图标设置已保存！');
        }
    }

    // 重置排便图标
    resetBowelIcon() {
        this.healthData.bowelSettings.icon = '💩';
        this.loadBowelSettings();
        this.saveHealthData();
        this.generateBowelCalendar();
    }

    // 关闭排便设置弹窗
    closeBowelSettingsModal() {
        const modal = document.getElementById('bowelSettingsModal');
        if (modal) modal.classList.remove('active');
    }

    // 餐饮记录相关功能
    renderMealRecords() {
        this.updateMealDateTitle();
        this.loadMealData();
        this.renderOtherItems(); // 添加渲染其他条目
    }

    // 更新餐饮日期标题
    updateMealDateTitle() {
        const titleElement = document.getElementById('mealDateTitle');
        if (titleElement) {
            const year = this.mealDate.getFullYear();
            const month = this.mealDate.getMonth() + 1;
            const day = this.mealDate.getDate();
            titleElement.textContent = `${year}年${month}月${day}日餐饮记录`;
        }
    }

    // 加载餐饮数据
    loadMealData() {
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const mealData = this.healthData.meals[dateKey];
        
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'other'];
        mealTypes.forEach(type => {
            const input = document.getElementById(`${type}Input`);
            const imagesContainer = document.getElementById(`${type}Images`);
            
            if (input) {
                input.value = mealData && mealData[type] ? mealData[type].description || '' : '';
            }
            
            if (imagesContainer) {
                this.renderMealImages(type, mealData && mealData[type] ? mealData[type].details || [] : []);
            }
        });
        
        // 绑定输入事件
        this.bindMealInputEvents();
    }

    // 绑定餐饮输入事件
    bindMealInputEvents() {
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'other'];
        mealTypes.forEach(type => {
            const input = document.getElementById(`${type}Input`);
            if (input) {
                input.addEventListener('input', () => {
                    this.saveMealDescription(type, input.value);
                });
            }
        });
    }

    // 保存餐饮描述
    saveMealDescription(mealType, description) {
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        if (!this.healthData.meals[dateKey]) {
            this.healthData.meals[dateKey] = {};
        }
        
        if (!this.healthData.meals[dateKey][mealType]) {
            this.healthData.meals[dateKey][mealType] = {
                description: '',
                details: []
            };
        }
        
        this.healthData.meals[dateKey][mealType].description = description;
        this.saveHealthData();
    }

    // 渲染餐饮图片
    renderMealImages(mealType, details) {
        const container = document.getElementById(`${mealType}Images`);
        if (!container) return;
        
        container.innerHTML = '';
        
        details.forEach((detail, index) => {
            if (detail.imageUrl) {
                const imageItem = document.createElement('div');
                imageItem.className = 'meal-image-item';
                imageItem.innerHTML = `
                    <img src="${detail.imageUrl}" alt="食物图片" onerror="this.parentElement.style.display='none'">
                    ${detail.rating ? `<div class="meal-rating">${detail.rating}⭐</div>` : ''}
                `;
                
                // 添加点击查看详情
                imageItem.addEventListener('click', () => {
                    this.viewMealDetail(mealType, index);
                });
                
                container.appendChild(imageItem);
            }
        });
    }

    // 切换餐饮日期
    changeMealDate(delta) {
        this.mealDate.setDate(this.mealDate.getDate() + delta);
        this.renderMealRecords();
    }

    // 打开餐饮详情弹窗
    openMealDetailModal(mealType) {
        this.selectedMealType = mealType;
        
        const titleElement = document.getElementById('mealDetailTitle');
        const dateElement = document.getElementById('mealDetailDate');
        
        const mealNames = {
            breakfast: '早餐',
            lunch: '午餐', 
            dinner: '晚餐',
            other: '其他'
        };
        
        if (titleElement) titleElement.textContent = `添加${mealNames[mealType]}详情`;
        if (dateElement) {
            const year = this.mealDate.getFullYear();
            const month = this.mealDate.getMonth() + 1;
            const day = this.mealDate.getDate();
            dateElement.textContent = `${year}年${month}月${day}日`;
        }
        
        // 清空表单
        this.clearMealDetailForm();
        
        // 显示弹窗
        const modal = document.getElementById('mealDetailModal');
        if (modal) modal.classList.add('active');
    }

    // 清空餐饮详情表单
    clearMealDetailForm() {
        const descriptionInput = document.getElementById('mealDescription');
        const imageUrlInput = document.getElementById('mealImageUrl');
        const reviewInput = document.getElementById('mealReview');
        const imagePreview = document.getElementById('mealImagePreview');
        
        if (descriptionInput) descriptionInput.value = '';
        if (imageUrlInput) imageUrlInput.value = '';
        if (reviewInput) reviewInput.value = '';
        if (imagePreview) imagePreview.style.display = 'none';
        
        // 重置星级评分
        this.selectedMealRating = 0;
        this.updateStarRating();
        
        // 隐藏清除按钮
        const clearBtn = document.getElementById('clearMealDetailBtn');
        if (clearBtn) clearBtn.style.display = 'none';
    }

    // 预览餐饮图片
    previewMealImage() {
        const imageUrlInput = document.getElementById('mealImageUrl');
        const imagePreview = document.getElementById('mealImagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (imageUrlInput && imagePreview && previewImg) {
            const url = imageUrlInput.value.trim();
            if (url) {
                previewImg.src = url;
                imagePreview.style.display = 'block';
                
                previewImg.onerror = () => {
                    alert('图片加载失败，请检查URL是否正确');
                    imagePreview.style.display = 'none';
                };
            } else {
                imagePreview.style.display = 'none';
            }
        }
    }

    // 更新星级评分显示
    updateStarRating() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < this.selectedMealRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // 保存餐饮详情
    saveMealDetail() {
        const descriptionInput = document.getElementById('mealDescription');
        const imageUrlInput = document.getElementById('mealImageUrl');
        const reviewInput = document.getElementById('mealReview');
        
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const imageUrl = imageUrlInput ? imageUrlInput.value.trim() : '';
        const review = reviewInput ? reviewInput.value.trim() : '';
        
        if (!description && !imageUrl && !review && this.selectedMealRating === 0) {
            alert('请至少填写一项内容');
            return;
        }
        
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        if (!this.healthData.meals[dateKey]) {
            this.healthData.meals[dateKey] = {};
        }
        
        // 处理其他餐饮条目
        if (this.selectedMealType === 'other' && this.selectedOtherItemId) {
            if (!this.healthData.meals[dateKey].other) {
                this.healthData.meals[dateKey].other = {
                    description: '',
                    details: [],
                    items: {}
                };
            }
            if (!this.healthData.meals[dateKey].other.items) {
                this.healthData.meals[dateKey].other.items = {};
            }
            if (!this.healthData.meals[dateKey].other.items[this.selectedOtherItemId]) {
                this.healthData.meals[dateKey].other.items[this.selectedOtherItemId] = {
                    id: this.selectedOtherItemId,
                    description: '',
                    details: []
                };
            }
            
            // 添加详情记录到特定的其他条目
            const detail = {
                description,
                imageUrl,
                review,
                rating: this.selectedMealRating,
                timestamp: new Date().toISOString()
            };
            
            this.healthData.meals[dateKey].other.items[this.selectedOtherItemId].details.push(detail);
            
            // 如果有描述，更新条目描述
            if (description) {
                const currentDesc = this.healthData.meals[dateKey].other.items[this.selectedOtherItemId].description;
                const newDesc = currentDesc ? `${currentDesc}, ${description}` : description;
                this.healthData.meals[dateKey].other.items[this.selectedOtherItemId].description = newDesc;
            }
        } else {
            // 处理普通餐饮类型
            if (!this.healthData.meals[dateKey][this.selectedMealType]) {
                this.healthData.meals[dateKey][this.selectedMealType] = {
                    description: '',
                    details: []
                };
            }
            
            // 添加详情记录
            const detail = {
                description,
                imageUrl,
                review,
                rating: this.selectedMealRating,
                timestamp: new Date().toISOString()
            };
            
            this.healthData.meals[dateKey][this.selectedMealType].details.push(detail);
            
            // 如果有描述，更新主描述
            if (description) {
                const currentDesc = this.healthData.meals[dateKey][this.selectedMealType].description;
                const newDesc = currentDesc ? `${currentDesc}, ${description}` : description;
                this.healthData.meals[dateKey][this.selectedMealType].description = newDesc;
            }
        }
        
        this.saveHealthData();
        
        // 强制重新渲染餐饮记录
        setTimeout(() => {
            this.renderMealRecords();
        }, 100);
        
        this.closeMealDetailModal();
        
        alert('餐饮详情已保存！');
    }

    // 查看餐饮详情
    viewMealDetail(mealType, detailIndex) {
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const mealData = this.healthData.meals[dateKey];
        
        if (mealData && mealData[mealType] && mealData[mealType].details[detailIndex]) {
            const detail = mealData[mealType].details[detailIndex];
            
            this.selectedMealType = mealType;
            
            // 填充表单
            const descriptionInput = document.getElementById('mealDescription');
            const imageUrlInput = document.getElementById('mealImageUrl');
            const reviewInput = document.getElementById('mealReview');
            
            if (descriptionInput) descriptionInput.value = detail.description || '';
            if (imageUrlInput) imageUrlInput.value = detail.imageUrl || '';
            if (reviewInput) reviewInput.value = detail.review || '';
            
            this.selectedMealRating = detail.rating || 0;
            this.updateStarRating();
            
            // 预览图片
            if (detail.imageUrl) {
                this.previewMealImage();
            }
            
            // 显示清除按钮
            const clearBtn = document.getElementById('clearMealDetailBtn');
            if (clearBtn) {
                clearBtn.style.display = 'block';
                clearBtn.onclick = () => this.clearMealDetailRecord(detailIndex);
            }
            
            // 打开弹窗
            this.openMealDetailModal(mealType);
        }
    }

    // 清除餐饮详情记录
    clearMealDetailRecord(detailIndex) {
        if (confirm('确定删除这条餐饮记录吗？')) {
            // 使用本地日期而不是UTC日期
            const year = this.mealDate.getFullYear();
            const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
            const day = String(this.mealDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            const mealData = this.healthData.meals[dateKey];
            
            if (mealData && mealData[this.selectedMealType] && mealData[this.selectedMealType].details) {
                mealData[this.selectedMealType].details.splice(detailIndex, 1);
                this.saveHealthData();
                this.renderMealRecords();
                this.closeMealDetailModal();
            }
        }
    }

    // 清除当前餐饮详情
    clearMealDetail() {
        this.clearMealDetailForm();
    }

    // 关闭餐饮详情弹窗
    closeMealDetailModal() {
        const modal = document.getElementById('mealDetailModal');
        if (modal) modal.classList.remove('active');
        this.selectedMealType = null;
        this.selectedMealRating = 0;
        this.selectedOtherItemId = null;
        this.selectedOtherDetailIndex = null;
    }

    // 餐饮分析功能
    openMealAnalysisModal() {
        this.generateMealAnalysis();
        const modal = document.getElementById('mealAnalysisModal');
        if (modal) modal.classList.add('active');
    }

    // 生成餐饮分析报告
    generateMealAnalysis() {
        const currentDate = this.mealDate;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // 设置分析日期范围
        const dateRangeElement = document.getElementById('analysisDateRange');
        if (dateRangeElement) {
            dateRangeElement.textContent = `${year}年${month + 1}月餐饮分析报告`;
        }
        
        // 收集本月所有餐饮数据
        const monthData = this.collectMonthMealData(year, month);
        
        // 分析数据
        const analysis = this.analyzeMealData(monthData);
        
        // 渲染分析结果
        this.renderMealAnalysis(analysis);
    }

    // 收集本月餐饮数据
    collectMonthMealData(year, month) {
        const monthData = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayMeals = this.healthData.meals[dateKey];
            
            if (dayMeals) {
                Object.keys(dayMeals).forEach(mealType => {
                    const meal = dayMeals[mealType];
                    
                    if (mealType === 'other' && meal.items) {
                        // 处理其他餐饮条目
                        Object.values(meal.items).forEach(item => {
                            if (item.details && item.details.length > 0) {
                                item.details.forEach(detail => {
                                    if (detail.description) {
                                        monthData.push({
                                            date: dateKey,
                                            mealType: 'other',
                                            description: detail.description,
                                            rating: detail.rating || 0,
                                            imageUrl: detail.imageUrl || '',
                                            review: detail.review || '',
                                            timestamp: detail.timestamp
                                        });
                                    }
                                });
                            }
                            
                            // 也包含条目主描述
                            if (item.description) {
                                monthData.push({
                                    date: dateKey,
                                    mealType: 'other',
                                    description: item.description,
                                    rating: 0,
                                    imageUrl: '',
                                    review: '',
                                    timestamp: dateKey
                                });
                            }
                        });
                    } else if (meal && meal.details && meal.details.length > 0) {
                        // 处理普通餐饮类型
                        meal.details.forEach(detail => {
                            if (detail.description) {
                                monthData.push({
                                    date: dateKey,
                                    mealType: mealType,
                                    description: detail.description,
                                    rating: detail.rating || 0,
                                    imageUrl: detail.imageUrl || '',
                                    review: detail.review || '',
                                    timestamp: detail.timestamp
                                });
                            }
                        });
                    }
                    
                    // 也包含主描述
                    if (meal && meal.description && mealType !== 'other') {
                        monthData.push({
                            date: dateKey,
                            mealType: mealType,
                            description: meal.description,
                            rating: 0,
                            imageUrl: '',
                            review: '',
                            timestamp: dateKey
                        });
                    }
                });
            }
        }
        
        return monthData;
    }

    // 分析餐饮数据
    analyzeMealData(monthData) {
        // 统计菜品频率
        const dishFrequency = {};
        const dishRatings = {};
        const dishDetails = {};
        
        monthData.forEach(item => {
            const dishName = item.description.toLowerCase().trim();
            
            // 统计频率
            dishFrequency[dishName] = (dishFrequency[dishName] || 0) + 1;
            
            // 收集评分
            if (item.rating > 0) {
                if (!dishRatings[dishName]) {
                    dishRatings[dishName] = [];
                }
                dishRatings[dishName].push(item.rating);
            }
            
            // 收集详情
            if (!dishDetails[dishName]) {
                dishDetails[dishName] = [];
            }
            dishDetails[dishName].push(item);
        });
        
        // 计算平均评分
        const dishAverageRatings = {};
        Object.keys(dishRatings).forEach(dish => {
            const ratings = dishRatings[dish];
            dishAverageRatings[dish] = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        });
        
        // 找出最常吃的菜品（前5名）
        const mostFrequent = Object.entries(dishFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([dish, count]) => ({
                name: dish,
                frequency: count,
                rating: dishAverageRatings[dish] || 0,
                details: dishDetails[dish]
            }));
        
        // 找出评分最高的菜品
        const highestRated = Object.entries(dishAverageRatings)
            .filter(([,rating]) => rating >= 4)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([dish, rating]) => ({
                name: dish,
                frequency: dishFrequency[dish] || 0,
                rating: rating,
                details: dishDetails[dish]
            }));
        
        // 找出评分最低的菜品
        const lowestRated = Object.entries(dishAverageRatings)
            .filter(([,rating]) => rating <= 2)
            .sort(([,a], [,b]) => a - b)
            .slice(0, 10)
            .map(([dish, rating]) => ({
                name: dish,
                frequency: dishFrequency[dish] || 0,
                rating: rating,
                details: dishDetails[dish]
            }));
        
        // 统计信息
        const stats = {
            recordDays: new Set(monthData.map(item => item.date)).size,
            totalDishes: Object.keys(dishFrequency).length,
            averageRating: Object.values(dishAverageRatings).length > 0 
                ? (Object.values(dishAverageRatings).reduce((sum, rating) => sum + rating, 0) / Object.values(dishAverageRatings).length).toFixed(1)
                : 0,
            withImages: monthData.filter(item => item.imageUrl).length
        };
        
        return {
            mostFrequent,
            highestRated,
            lowestRated,
            stats
        };
    }

    // 渲染分析结果
    renderMealAnalysis(analysis) {
        // 渲染最常吃的菜品
        this.renderDishList('mostFrequentDishes', analysis.mostFrequent, 'frequency');
        
        // 渲染评分最高的菜品
        this.renderDishList('highestRatedDishes', analysis.highestRated, 'rating');
        
        // 渲染评分最低的菜品
        this.renderDishList('lowestRatedDishes', analysis.lowestRated, 'rating');
        
        // 渲染统计信息
        this.renderStats(analysis.stats);
    }

    // 渲染菜品列表
    renderDishList(containerId, dishes, sortType) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (dishes.length === 0) {
            container.innerHTML = '<div class="no-data">暂无数据</div>';
            return;
        }
        
        container.innerHTML = '';
        
        dishes.forEach(dish => {
            const dishElement = document.createElement('div');
            dishElement.className = 'dish-item';
            
            const hasImage = dish.details.some(detail => detail.imageUrl);
            const hasReview = dish.details.some(detail => detail.review);
            
            dishElement.innerHTML = `
                <div class="dish-info-left">
                    <div class="dish-name">${dish.name}</div>
                    <div class="dish-meta">
                        ${dish.rating > 0 ? `<div class="dish-rating-display">⭐ ${dish.rating.toFixed(1)}</div>` : ''}
                        <div class="dish-frequency-display">食用 ${dish.frequency} 次</div>
                    </div>
                </div>
                <div class="dish-info-right">
                    ${hasImage ? '<div class="dish-has-image">📸 有图片</div>' : ''}
                    ${hasReview ? '<div class="dish-has-image">💭 有评价</div>' : ''}
                </div>
            `;
            
            // 添加点击事件
            dishElement.addEventListener('click', () => {
                this.showDishDetail(dish);
            });
            
            container.appendChild(dishElement);
        });
    }

    // 渲染统计信息
    renderStats(stats) {
        const elements = {
            recordDays: document.getElementById('recordDays'),
            totalDishes: document.getElementById('totalDishes'),
            averageRating: document.getElementById('averageRating'),
            withImages: document.getElementById('withImages')
        };
        
        if (elements.recordDays) elements.recordDays.textContent = stats.recordDays;
        if (elements.totalDishes) elements.totalDishes.textContent = stats.totalDishes;
        if (elements.averageRating) elements.averageRating.textContent = stats.averageRating;
        if (elements.withImages) elements.withImages.textContent = stats.withImages;
    }

    // 显示菜品详情
    showDishDetail(dish) {
        const titleElement = document.getElementById('dishDetailTitle');
        const nameElement = document.getElementById('dishDetailName');
        const ratingElement = document.getElementById('dishDetailRating');
        const frequencyElement = document.getElementById('dishDetailFrequency');
        const imageSection = document.getElementById('dishImageSection');
        const imageElement = document.getElementById('dishDetailImage');
        const reviewSection = document.getElementById('dishReviewSection');
        const reviewElement = document.getElementById('dishDetailReview');
        const recordsList = document.getElementById('dishRecordsList');
        
        if (titleElement) titleElement.textContent = '菜品详情';
        if (nameElement) nameElement.textContent = dish.name;
        if (ratingElement) {
            ratingElement.textContent = dish.rating > 0 ? `⭐ 平均评分：${dish.rating.toFixed(1)}` : '暂无评分';
        }
        if (frequencyElement) frequencyElement.textContent = `本月食用：${dish.frequency} 次`;
        
        // 显示图片（取第一张有图片的记录）
        const imageDetail = dish.details.find(detail => detail.imageUrl);
        if (imageDetail && imageSection && imageElement) {
            imageElement.src = imageDetail.imageUrl;
            imageSection.style.display = 'block';
        } else if (imageSection) {
            imageSection.style.display = 'none';
        }
        
        // 显示评价（取第一条有评价的记录）
        const reviewDetail = dish.details.find(detail => detail.review);
        if (reviewDetail && reviewSection && reviewElement) {
            reviewElement.textContent = reviewDetail.review;
            reviewSection.style.display = 'block';
        } else if (reviewSection) {
            reviewSection.style.display = 'none';
        }
        
        // 显示食用记录
        if (recordsList) {
            recordsList.innerHTML = '';
            
            dish.details.forEach(detail => {
                const recordElement = document.createElement('div');
                recordElement.className = 'dish-record-item';
                
                const date = new Date(detail.date);
                const mealTypeNames = {
                    breakfast: '早餐',
                    lunch: '午餐',
                    dinner: '晚餐',
                    other: '其他'
                };
                
                recordElement.innerHTML = `
                    <span class="record-date">${date.getMonth() + 1}月${date.getDate()}日</span>
                    <span class="record-meal-type">${mealTypeNames[detail.mealType] || detail.mealType}</span>
                `;
                
                recordsList.appendChild(recordElement);
            });
        }
        
        // 显示弹窗
        const modal = document.getElementById('dishDetailModal');
        if (modal) modal.classList.add('active');
    }

    // 关闭分析弹窗
    closeMealAnalysisModal() {
        const modal = document.getElementById('mealAnalysisModal');
        if (modal) modal.classList.remove('active');
    }

    // 关闭菜品详情弹窗
    closeDishDetailModal() {
        const modal = document.getElementById('dishDetailModal');
        if (modal) modal.classList.remove('active');
    }

    bindEvents() {
        // 事件绑定逻辑
        console.log('绑定事件');
    }

    loadTodayData() {
        // 加载今日数据逻辑
        console.log('加载今日数据');
    }

    // 关闭弹窗
    closeSkincareTypeModal() {
        const modal = document.getElementById('skincareTypeModal');
        if (modal) modal.classList.remove('active');
    }

    closeSkinStatusTypeModal() {
        const modal = document.getElementById('skinStatusTypeModal');
        if (modal) modal.classList.remove('active');
    }

    closeSkincareSelectModal() {
        const modal = document.getElementById('skincareSelectModal');
        if (modal) modal.classList.remove('active');
        this.selectedSkincareDate = null;
        this.selectedSkincareType = null;
    }

    // 打开护肤记录选择弹窗
    openSkincareSelectModal(dateKey, day, month, year, dataType) {
        this.selectedSkincareDate = dateKey;
        this.selectedSkincareType = dataType;
        
        const title = dataType === 'skincare' ? '选择护肤类型' : '选择皮肤状态';
        const titleElement = document.getElementById('skincareSelectTitle');
        const dateElement = document.getElementById('skincareSelectDate');
        
        if (titleElement) titleElement.textContent = title;
        if (dateElement) dateElement.textContent = `${year}年${month}月${day}日`;
        
        // 渲染类型选项
        this.renderTypeOptions(dataType);
        
        // 检查是否已有记录
        const existingRecord = this.healthData[dataType][dateKey];
        const clearBtn = document.getElementById('clearSkincareBtn');
        if (clearBtn) clearBtn.style.display = existingRecord ? 'block' : 'none';
        
        const modal = document.getElementById('skincareSelectModal');
        if (modal) modal.classList.add('active');
    }

    // 渲染类型选项
    renderTypeOptions(dataType) {
        const options = document.getElementById('skincareTypeOptions');
        if (!options) return;
        
        const types = dataType === 'skincare' ? this.healthData.skincareTypes : this.healthData.skinStatusTypes;
        
        options.innerHTML = '';
        
        types.forEach(type => {
            const option = document.createElement('div');
            option.className = 'type-option';
            option.innerHTML = `
                <div class="type-color" style="background-color: ${type.color}"></div>
                <span class="type-name">${type.name}</span>
            `;
            
            option.addEventListener('click', () => {
                this.selectSkincareType(type);
            });
            
            options.appendChild(option);
        });
    }

    // 选择护肤类型
    selectSkincareType(type) {
        this.healthData[this.selectedSkincareType][this.selectedSkincareDate] = {
            typeId: type.id,
            typeName: type.name,
            color: type.color,
            date: this.selectedSkincareDate
        };
        
        this.saveHealthData();
        this.renderSkincareCalendars();
        this.closeSkincareSelectModal();
    }

    // 添加护肤类型
    addSkincareType() {
        const nameInput = document.getElementById('newSkincareTypeName');
        const colorInput = document.getElementById('newSkincareTypeColor');
        
        if (!nameInput || !colorInput) return;
        
        const name = nameInput.value.trim();
        const color = colorInput.value;
        
        if (!name) {
            alert('请输入护肤类型名称');
            return;
        }
        
        const newId = Math.max(...this.healthData.skincareTypes.map(t => t.id), 0) + 1;
        this.healthData.skincareTypes.push({ id: newId, name, color });
        
        // 添加到调色板
        if (!this.healthData.colorPalette.includes(color)) {
            this.healthData.colorPalette.push(color);
        }
        
        this.saveHealthData();
        this.renderSkincareTypeList();
        this.renderColorPalette('skincarePalette');
        
        // 清空输入
        nameInput.value = '';
        colorInput.value = '#c9a87c';
    }

    // 添加皮肤状态类型
    addSkinStatusType() {
        const nameInput = document.getElementById('newSkinStatusTypeName');
        const colorInput = document.getElementById('newSkinStatusTypeColor');
        
        if (!nameInput || !colorInput) return;
        
        const name = nameInput.value.trim();
        const color = colorInput.value;
        
        if (!name) {
            alert('请输入皮肤状态名称');
            return;
        }
        
        const newId = Math.max(...this.healthData.skinStatusTypes.map(t => t.id), 0) + 1;
        this.healthData.skinStatusTypes.push({ id: newId, name, color });
        
        // 添加到调色板
        if (!this.healthData.colorPalette.includes(color)) {
            this.healthData.colorPalette.push(color);
        }
        
        this.saveHealthData();
        this.renderSkinStatusTypeList();
        this.renderColorPalette('skinStatusPalette');
        
        // 清空输入
        nameInput.value = '';
        colorInput.value = '#c9a87c';
    }

    // 删除护肤类型
    deleteSkincareType(typeId) {
        if (confirm('确定删除这个护肤类型吗？')) {
            this.healthData.skincareTypes = this.healthData.skincareTypes.filter(t => t.id !== typeId);
            this.saveHealthData();
            this.renderSkincareTypeList();
            this.renderSkincareCalendars();
        }
    }

    // 删除皮肤状态类型
    deleteSkinStatusType(typeId) {
        if (confirm('确定删除这个皮肤状态类型吗？')) {
            this.healthData.skinStatusTypes = this.healthData.skinStatusTypes.filter(t => t.id !== typeId);
            this.saveHealthData();
            this.renderSkinStatusTypeList();
            this.renderSkincareCalendars();
        }
    }

    // 清除护肤记录
    clearSkincareRecord() {
        if (confirm('确定清除这条记录吗？')) {
            delete this.healthData[this.selectedSkincareType][this.selectedSkincareDate];
            this.saveHealthData();
            this.renderSkincareCalendars();
            this.closeSkincareSelectModal();
        }
    }

    // 生理期相关功能
    renderPeriodCalendar() {
        const calendar = document.getElementById('periodCalendar');
        const monthDisplay = document.getElementById('periodCalendarMonth');
        
        if (!calendar) {
            console.log('生理期日历元素不存在');
            return;
        }
        
        const year = this.periodCalendarDate.getFullYear();
        const month = this.periodCalendarDate.getMonth();
        
        // 更新月份显示
        if (monthDisplay) {
            monthDisplay.textContent = `${year}年${month + 1}月生理期记录`;
        }
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        
        calendar.innerHTML = '';
        
        // 确保生理期数据存在
        if (!this.healthData.period) {
            this.healthData.period = {};
        }
        
        // 添加星期标题
        const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
        weekdays.forEach(day => {
            const weekdayCell = document.createElement('div');
            weekdayCell.className = 'weekday-header';
            weekdayCell.textContent = day;
            calendar.appendChild(weekdayCell);
        });
        
        // 添加空白格子
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendar.appendChild(emptyCell);
        }
        
        // 计算当月的生理期状态
        const monthPeriodData = this.calculateMonthPeriodData(year, month);
        
        // 添加当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const periodStatus = monthPeriodData[dateKey];
            
            dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            
            if (periodStatus) {
                dayElement.classList.add(periodStatus.type);
                if (periodStatus.predicted) {
                    dayElement.classList.add('predicted');
                }
            }
            
            // 标记今天
            const today = new Date();
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // 添加点击事件
            dayElement.addEventListener('click', () => {
                this.openPeriodSelectModal(dateKey, day, month + 1, year);
            });
            
            calendar.appendChild(dayElement);
        }
        
        // 更新图例颜色
        this.updatePeriodLegendColors();
    }

    // 计算月经周期
    calculateCycle(startDateStr, cycleLength = 28) {
        const start = new Date(startDateStr);
        
        // 1. 下次月经日期 = 本次开始 + 周期天数
        const nextPeriod = new Date(start);
        nextPeriod.setDate(start.getDate() + cycleLength);
        
        // 2. 排卵日 = 下次月经 - 14天
        const ovulationDay = new Date(nextPeriod);
        ovulationDay.setDate(nextPeriod.getDate() - 14);
        
        // 3. 排卵期范围 (排卵日前5后4)
        const ovulationStart = new Date(ovulationDay);
        ovulationStart.setDate(ovulationDay.getDate() - 5);
        const ovulationEnd = new Date(ovulationDay);
        ovulationEnd.setDate(ovulationDay.getDate() + 4);
        
        return {
            nextPeriod,
            ovulationDay,
            ovulationRange: [ovulationStart, ovulationEnd]
        };
    }

    // 预测周期长度（加权平均）
    getPredictCycle(history) {
        if (history.length === 0) return 28; // 默认值
        
        // 给最近的记录更高的权重
        const weights = [0.1, 0.1, 0.3, 0.5];
        let weightedSum = 0;
        const recentHistory = history.slice(-4);
        
        recentHistory.forEach((days, index) => {
            const weight = weights[index] || 0.1;
            weightedSum += days * weight;
        });
        
        return Math.round(weightedSum);
    }

    // 计算当月生理期数据
    calculateMonthPeriodData(year, month) {
        const monthData = {};
        
        // 首先加载已有的手动记录
        Object.keys(this.healthData.period.records || {}).forEach(dateKey => {
            const record = this.healthData.period.records[dateKey];
            const date = new Date(dateKey);
            if (date.getFullYear() === year && date.getMonth() === month) {
                monthData[dateKey] = {
                    type: record.phase,
                    predicted: false
                };
            }
        });
        
        // 基于月经周期自动计算
        const cycles = this.healthData.period.cycles || [];
        if (cycles.length > 0) {
            cycles.forEach(cycle => {
                this.calculateCyclePhases(cycle, monthData, year, month);
            });
            
            // 预测下一个周期
            const lastCycle = cycles[cycles.length - 1];
            if (lastCycle) {
                const predictedNextStart = new Date(lastCycle.start);
                predictedNextStart.setDate(predictedNextStart.getDate() + (lastCycle.length || this.healthData.period.settings.averageCycle));
                
                if (predictedNextStart.getFullYear() === year && predictedNextStart.getMonth() === month) {
                    const predictedCycle = {
                        start: predictedNextStart.toISOString().split('T')[0],
                        length: this.healthData.period.settings.averageCycle,
                        predicted: true
                    };
                    this.calculateCyclePhases(predictedCycle, monthData, year, month);
                }
            }
        }
        
        return monthData;
    }

    // 计算单个周期的各个阶段
    calculateCyclePhases(cycle, monthData, targetYear, targetMonth, isPredicted = false) {
        const startDate = new Date(cycle.start);
        const cycleLength = cycle.length || this.healthData.period.settings.averageCycle;
        const periodLength = this.healthData.period.settings.averagePeriod;
        
        // 月经期
        for (let i = 0; i < periodLength; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
                const dateKey = date.toISOString().split('T')[0];
                if (!monthData[dateKey] || monthData[dateKey].predicted) {
                    monthData[dateKey] = { type: 'menstrual', predicted: isPredicted || cycle.predicted };
                }
            }
        }
        
        // 卵泡期 (月经结束后到排卵前)
        const follicularStart = new Date(startDate);
        follicularStart.setDate(startDate.getDate() + periodLength);
        const ovulationDay = cycleLength - 14; // 排卵通常在下次月经前14天
        
        for (let i = 0; i < ovulationDay - periodLength - 5; i++) {
            const date = new Date(follicularStart);
            date.setDate(follicularStart.getDate() + i);
            
            if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
                const dateKey = date.toISOString().split('T')[0];
                if (!monthData[dateKey] || monthData[dateKey].predicted) {
                    monthData[dateKey] = { type: 'follicular', predicted: isPredicted || cycle.predicted };
                }
            }
        }
        
        // 排卵期 (排卵日前5天到后4天)
        const ovulationStart = new Date(startDate);
        ovulationStart.setDate(startDate.getDate() + ovulationDay - 5);
        
        for (let i = 0; i < 10; i++) {
            const date = new Date(ovulationStart);
            date.setDate(ovulationStart.getDate() + i);
            
            if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
                const dateKey = date.toISOString().split('T')[0];
                if (!monthData[dateKey] || monthData[dateKey].predicted) {
                    monthData[dateKey] = { type: 'ovulation', predicted: isPredicted || cycle.predicted };
                }
            }
        }
        
        // 黄体期 (排卵期结束到下次月经前)
        const lutealStart = new Date(startDate);
        lutealStart.setDate(startDate.getDate() + ovulationDay + 5);
        
        const lutealLength = cycleLength - ovulationDay - 5;
        for (let i = 0; i < lutealLength; i++) {
            const date = new Date(lutealStart);
            date.setDate(lutealStart.getDate() + i);
            
            if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
                const dateKey = date.toISOString().split('T')[0];
                if (!monthData[dateKey] || monthData[dateKey].predicted) {
                    monthData[dateKey] = { type: 'luteal', predicted: isPredicted || cycle.predicted };
                }
            }
        }
    }

    // 计算生理期各阶段
    calculatePeriodPhases(startDate, cycleLength, monthData, targetYear, targetMonth, isPredicted) {
        const cycleData = this.calculateCycle(startDate.toISOString().split('T')[0], cycleLength);
        
        // 月经期 (通常5天)
        for (let i = 0; i < 5; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            if (date.getFullYear() === targetYear && date.getMonth() === targetMonth) {
                const dateKey = date.toISOString().split('T')[0];
                monthData[dateKey] = { type: 'menstrual', predicted: isPredicted };
            }
        }
        
        // 卵泡期 (月经结束到排卵前)
        const follicularStart = new Date(startDate);
        follicularStart.setDate(startDate.getDate() + 5);
        const follicularEnd = new Date(cycleData.ovulationRange[0]);
        
        let current = new Date(follicularStart);
        while (current < follicularEnd) {
            if (current.getFullYear() === targetYear && current.getMonth() === targetMonth) {
                const dateKey = current.toISOString().split('T')[0];
                if (!monthData[dateKey]) {
                    monthData[dateKey] = { type: 'follicular', predicted: isPredicted };
                }
            }
            current.setDate(current.getDate() + 1);
        }
        
        // 排卵期
        current = new Date(cycleData.ovulationRange[0]);
        const ovulationEnd = new Date(cycleData.ovulationRange[1]);
        while (current <= ovulationEnd) {
            if (current.getFullYear() === targetYear && current.getMonth() === targetMonth) {
                const dateKey = current.toISOString().split('T')[0];
                monthData[dateKey] = { type: 'ovulation', predicted: isPredicted };
            }
            current.setDate(current.getDate() + 1);
        }
        
        // 黄体期 (排卵后到下次月经前)
        current = new Date(cycleData.ovulationRange[1]);
        current.setDate(current.getDate() + 1);
        const lutealEnd = new Date(cycleData.nextPeriod);
        
        while (current < lutealEnd) {
            if (current.getFullYear() === targetYear && current.getMonth() === targetMonth) {
                const dateKey = current.toISOString().split('T')[0];
                if (!monthData[dateKey]) {
                    monthData[dateKey] = { type: 'luteal', predicted: isPredicted };
                }
            }
            current.setDate(current.getDate() + 1);
        }
        
        // 安全期计算 (简化版本，实际应用中需要更复杂的计算)
        // 这里暂时不实现，因为安全期的计算需要更多的历史数据和医学知识
    }

    // 切换生理期日历月份
    changePeriodMonth(delta) {
        this.periodCalendarDate.setMonth(this.periodCalendarDate.getMonth() + delta);
        this.renderPeriodCalendar();
    }

    // 打开生理期选择弹窗
    openPeriodSelectModal(dateKey, day, month, year) {
        this.selectedPeriodDate = dateKey;
        
        const titleElement = document.getElementById('periodSelectTitle');
        const dateElement = document.getElementById('periodSelectDate');
        
        if (titleElement) titleElement.textContent = '生理期记录';
        if (dateElement) dateElement.textContent = `${year}年${month}月${day}日`;
        
        // 检查是否已有记录
        const existingRecord = this.healthData.period.records && this.healthData.period.records[dateKey];
        const clearBtn = document.getElementById('clearPeriodBtn');
        if (clearBtn) clearBtn.style.display = existingRecord ? 'block' : 'none';
        
        const modal = document.getElementById('periodSelectModal');
        if (modal) modal.classList.add('active');
    }

    // 开始月经
    startPeriod() {
        const dateKey = this.selectedPeriodDate;
        
        // 记录月经开始
        if (!this.healthData.period.records) {
            this.healthData.period.records = {};
        }
        
        this.healthData.period.records[dateKey] = {
            phase: 'menstrual',
            type: 'start',
            date: dateKey
        };
        
        this.saveHealthData();
        this.renderPeriodCalendar();
        this.closePeriodSelectModal();
        
        alert('月经开始记录已保存！');
    }

    // 结束月经
    endPeriod() {
        const dateKey = this.selectedPeriodDate;
        
        // 查找最近的月经开始日期
        const startDates = Object.keys(this.healthData.period.records || {})
            .filter(key => {
                const record = this.healthData.period.records[key];
                return record.type === 'start' && record.phase === 'menstrual';
            })
            .sort()
            .reverse();
        
        if (startDates.length === 0) {
            alert('请先记录月经开始日期！');
            return;
        }
        
        const startDate = startDates[0];
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(dateKey);
        
        if (endDateObj <= startDateObj) {
            alert('结束日期不能早于或等于开始日期！');
            return;
        }
        
        // 记录月经结束
        this.healthData.period.records[dateKey] = {
            phase: 'menstrual',
            type: 'end',
            date: dateKey
        };
        
        // 创建完整的月经周期记录
        const cycleLength = Math.round((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
        const periodLength = cycleLength;
        
        // 更新周期记录
        if (!this.healthData.period.cycles) {
            this.healthData.period.cycles = [];
        }
        
        this.healthData.period.cycles.push({
            start: startDate,
            end: dateKey,
            length: this.calculateCycleLength(startDate),
            periodLength: periodLength
        });
        
        // 填充月经期间的所有日期
        this.fillPeriodDays(startDate, dateKey);
        
        this.saveHealthData();
        this.renderPeriodCalendar();
        this.closePeriodSelectModal();
        
        alert(`月经周期记录完成！月经持续${periodLength}天`);
    }

    // 手动设置生理期阶段
    setPeriodPhase(phase) {
        const dateKey = this.selectedPeriodDate;
        
        if (!this.healthData.period.records) {
            this.healthData.period.records = {};
        }
        
        this.healthData.period.records[dateKey] = {
            phase: phase,
            type: 'manual',
            date: dateKey
        };
        
        this.saveHealthData();
        this.renderPeriodCalendar();
        this.closePeriodSelectModal();
        
        const phaseNames = {
            menstrual: '月经期',
            follicular: '卵泡期',
            ovulation: '排卵期',
            luteal: '黄体期',
            safe: '安全期'
        };
        
        alert(`已设置为${phaseNames[phase]}！`);
    }

    // 填充月经期间的所有日期
    fillPeriodDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        let current = new Date(start);
        while (current <= end) {
            const dateKey = current.toISOString().split('T')[0];
            
            if (!this.healthData.period.records[dateKey]) {
                this.healthData.period.records[dateKey] = {
                    phase: 'menstrual',
                    type: 'auto',
                    date: dateKey
                };
            }
            
            current.setDate(current.getDate() + 1);
        }
    }

    // 计算周期长度
    calculateCycleLength(currentStart) {
        const cycles = this.healthData.period.cycles || [];
        if (cycles.length === 0) {
            return this.healthData.period.settings.averageCycle;
        }
        
        // 找到上一个周期的开始日期
        const lastCycle = cycles[cycles.length - 1];
        if (lastCycle) {
            const lastStart = new Date(lastCycle.start);
            const currentStartDate = new Date(currentStart);
            const daysDiff = Math.round((currentStartDate - lastStart) / (1000 * 60 * 60 * 24));
            return daysDiff > 0 ? daysDiff : this.healthData.period.settings.averageCycle;
        }
        
        return this.healthData.period.settings.averageCycle;
    }

    // 清除生理期记录
    clearPeriodRecord() {
        if (confirm('确定清除这条记录吗？')) {
            if (this.healthData.period.records && this.healthData.period.records[this.selectedPeriodDate]) {
                delete this.healthData.period.records[this.selectedPeriodDate];
            }
            this.saveHealthData();
            this.renderPeriodCalendar();
            this.closePeriodSelectModal();
            this.updatePeriodHistory();
        }
    }

    // 更新周期历史
    updatePeriodHistory() {
        const records = this.healthData.period.records || {};
        const periodStarts = Object.keys(records)
            .filter(key => records[key].type === 'start')
            .map(key => new Date(key))
            .sort((a, b) => a - b);
        
        const cycleLengths = [];
        for (let i = 1; i < periodStarts.length; i++) {
            const cycleLength = Math.round((periodStarts[i] - periodStarts[i - 1]) / (1000 * 60 * 60 * 24));
            cycleLengths.push(cycleLength);
        }
        
        this.healthData.periodHistory = cycleLengths;
        this.saveHealthData();
    }

    // 打开生理期设置弹窗
    openPeriodSettingsModal() {
        this.loadPeriodColorSettings();
        this.renderColorPalette('periodPalette');
        document.getElementById('periodSettingsModal').classList.add('active');
    }

    // 加载生理期颜色设置
    loadPeriodColorSettings() {
        const colors = this.healthData.periodColors;
        document.getElementById('menstrualColor').value = colors.menstrual;
        document.getElementById('follicularColor').value = colors.follicular;
        document.getElementById('ovulationColor').value = colors.ovulation;
        document.getElementById('lutealColor').value = colors.luteal;
        document.getElementById('safeColor').value = colors.safe;
    }

    // 保存生理期设置
    savePeriodSettings() {
        this.healthData.periodColors = {
            menstrual: document.getElementById('menstrualColor').value,
            follicular: document.getElementById('follicularColor').value,
            ovulation: document.getElementById('ovulationColor').value,
            luteal: document.getElementById('lutealColor').value,
            safe: document.getElementById('safeColor').value
        };
        
        this.saveHealthData();
        this.updatePeriodLegendColors();
        this.renderPeriodCalendar();
        this.closePeriodSettingsModal();
        
        alert('生理期设置已保存！');
    }

    // 重置生理期颜色
    resetPeriodColors() {
        this.healthData.periodColors = {
            menstrual: '#ff6b6b',
            follicular: '#4ecdc4',
            ovulation: '#45b7d1',
            luteal: '#f9ca24',
            safe: '#6c5ce7'
        };
        
        this.loadPeriodColorSettings();
        this.saveHealthData();
        this.updatePeriodLegendColors();
        this.renderPeriodCalendar();
    }

    // 更新生理期图例颜色
    updatePeriodLegendColors() {
        const colors = this.healthData.periodColors;
        
        const legendColors = document.querySelectorAll('.legend-color');
        if (legendColors[0]) legendColors[0].style.backgroundColor = colors.menstrual;
        if (legendColors[1]) legendColors[1].style.backgroundColor = colors.follicular;
        if (legendColors[2]) legendColors[2].style.backgroundColor = colors.ovulation;
        if (legendColors[3]) legendColors[3].style.backgroundColor = colors.luteal;
        if (legendColors[4]) legendColors[4].style.backgroundColor = colors.safe;
        
        // 更新CSS变量
        document.documentElement.style.setProperty('--menstrual-color', colors.menstrual);
        document.documentElement.style.setProperty('--follicular-color', colors.follicular);
        document.documentElement.style.setProperty('--ovulation-color', colors.ovulation);
        document.documentElement.style.setProperty('--luteal-color', colors.luteal);
        document.documentElement.style.setProperty('--safe-color', colors.safe);
    }

    // 关闭生理期弹窗
    closePeriodSettingsModal() {
        const modal = document.getElementById('periodSettingsModal');
        if (modal) modal.classList.remove('active');
    }

    closePeriodSelectModal() {
        const modal = document.getElementById('periodSelectModal');
        if (modal) modal.classList.remove('active');
        this.selectedPeriodDate = null;
    }

    // 运动记录相关功能
    renderExerciseWeek() {
        const weekTitle = document.getElementById('exerciseWeekTitle');
        if (!weekTitle) return;
        
        // 计算当前周
        const weekInfo = this.getWeekInfo(this.currentExerciseWeek);
        weekTitle.textContent = `${weekInfo.year}年${weekInfo.month}月第${weekInfo.weekNumber}周运动记录`;
        
        // 渲染每一天的数据
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach((day, index) => {
            this.renderExerciseDay(day, weekInfo.dates[index]);
        });
        
        // 更新本周总结
        this.updateWeekSummary(weekInfo.dates);
    }

    getWeekInfo(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        // 获取这一周的开始日期（周一）
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(currentDate);
        monday.setDate(currentDate.getDate() + mondayOffset);
        
        // 计算是第几周
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const firstMonday = new Date(firstDayOfMonth);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const firstMondayOffset = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
        firstMonday.setDate(firstDayOfMonth.getDate() + firstMondayOffset);
        
        let weekNumber = Math.floor((monday - firstMonday) / (7 * 24 * 60 * 60 * 1000)) + 1;
        if (weekNumber <= 0) {
            weekNumber = 1;
        }
        
        // 生成这一周的所有日期
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(monday);
            dayDate.setDate(monday.getDate() + i);
            dates.push(dayDate);
        }
        
        return { year, month, weekNumber, dates };
    }

    renderExerciseDay(dayName, date) {
        const dayElement = document.getElementById(`${dayName}-content`);
        if (!dayElement) return;
        
        const dateKey = date.toISOString().split('T')[0];
        const exerciseData = this.healthData.exercise[dateKey];
        
        const stepsDisplay = dayElement.querySelector('.steps-display');
        const statusDisplay = dayElement.querySelector('.exercise-status');
        
        if (exerciseData) {
            stepsDisplay.textContent = `${exerciseData.steps || 0}步`;
            if (exerciseData.hasExercise) {
                statusDisplay.textContent = '已运动';
                statusDisplay.classList.add('exercised');
                dayElement.parentElement.classList.add('has-exercise');
            } else {
                statusDisplay.textContent = '未运动';
                statusDisplay.classList.remove('exercised');
                dayElement.parentElement.classList.remove('has-exercise');
            }
        } else {
            stepsDisplay.textContent = '0步';
            statusDisplay.textContent = '未运动';
            statusDisplay.classList.remove('exercised');
            dayElement.parentElement.classList.remove('has-exercise');
        }
        
        // 标记今天
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.parentElement.classList.add('today');
        } else {
            dayElement.parentElement.classList.remove('today');
        }
    }

    updateWeekSummary(dates) {
        const totalStepsElement = document.getElementById('weekTotalSteps');
        const totalExercisesElement = document.getElementById('weekTotalExercises');
        
        if (!totalStepsElement || !totalExercisesElement) return;
        
        let totalSteps = 0;
        let totalExercises = 0;
        
        dates.forEach(date => {
            const dateKey = date.toISOString().split('T')[0];
            const exerciseData = this.healthData.exercise[dateKey];
            
            if (exerciseData) {
                totalSteps += exerciseData.steps || 0;
                if (exerciseData.hasExercise) {
                    totalExercises++;
                }
            }
        });
        
        totalStepsElement.textContent = totalSteps;
        totalExercisesElement.textContent = totalExercises;
    }

    changeExerciseWeek(delta) {
        this.currentExerciseWeek.setDate(this.currentExerciseWeek.getDate() + (delta * 7));
        this.renderExerciseWeek();
    }

    openExerciseModal(dayName) {
        const weekInfo = this.getWeekInfo(this.currentExerciseWeek);
        const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(dayName);
        const selectedDate = weekInfo.dates[dayIndex];
        
        this.selectedExerciseDay = {
            dayName,
            date: selectedDate,
            dateKey: selectedDate.toISOString().split('T')[0]
        };
        
        // 设置弹窗标题和日期
        const titleElement = document.getElementById('exerciseModalTitle');
        const dateElement = document.getElementById('exerciseModalDate');
        
        if (titleElement) titleElement.textContent = '运动记录';
        if (dateElement) {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const day = selectedDate.getDate();
            const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const dayName = dayNames[selectedDate.getDay()];
            dateElement.textContent = `${year}年${month}月${day}日 ${dayName}`;
        }
        
        // 加载现有数据
        const existingData = this.healthData.exercise[this.selectedExerciseDay.dateKey];
        
        const stepsInput = document.getElementById('exerciseSteps');
        const hasExerciseRadios = document.querySelectorAll('input[name="hasExercise"]');
        const notesInput = document.getElementById('exerciseNotes');
        const clearBtn = document.getElementById('clearExerciseBtn');
        
        if (existingData) {
            if (stepsInput) stepsInput.value = existingData.steps || '';
            
            hasExerciseRadios.forEach(radio => {
                radio.checked = radio.value === (existingData.hasExercise ? 'yes' : 'no');
            });
            
            if (notesInput) notesInput.value = existingData.notes || '';
            if (clearBtn) clearBtn.style.display = 'block';
        } else {
            if (stepsInput) stepsInput.value = '';
            
            hasExerciseRadios.forEach(radio => {
                radio.checked = radio.value === 'no';
            });
            
            if (notesInput) notesInput.value = '';
            if (clearBtn) clearBtn.style.display = 'none';
        }
        
        // 切换运动输入框显示
        this.toggleExerciseInput();
        
        // 显示弹窗
        const modal = document.getElementById('exerciseModal');
        if (modal) modal.classList.add('active');
    }

    toggleExerciseInput() {
        const hasExerciseYes = document.querySelector('input[name="hasExercise"][value="yes"]');
        const notesGroup = document.getElementById('exerciseNotesGroup');
        
        if (hasExerciseYes && notesGroup) {
            notesGroup.style.display = hasExerciseYes.checked ? 'block' : 'none';
        }
    }

    saveExerciseRecord() {
        const stepsInput = document.getElementById('exerciseSteps');
        const hasExerciseYes = document.querySelector('input[name="hasExercise"][value="yes"]');
        const notesInput = document.getElementById('exerciseNotes');
        
        const steps = parseInt(stepsInput.value) || 0;
        const hasExercise = hasExerciseYes.checked;
        const notes = notesInput.value.trim();
        
        // 保存数据
        this.healthData.exercise[this.selectedExerciseDay.dateKey] = {
            steps,
            hasExercise,
            notes,
            date: this.selectedExerciseDay.dateKey
        };
        
        this.saveHealthData();
        this.renderExerciseWeek();
        this.closeExerciseModal();
        
        alert('运动记录已保存！');
    }

    clearExerciseRecord() {
        if (confirm('确定清除这条运动记录吗？')) {
            delete this.healthData.exercise[this.selectedExerciseDay.dateKey];
            this.saveHealthData();
            this.renderExerciseWeek();
            this.closeExerciseModal();
        }
    }

    closeExerciseModal() {
        const modal = document.getElementById('exerciseModal');
        if (modal) modal.classList.remove('active');
        this.selectedExerciseDay = null;
    }

    // 其他餐饮条目管理功能
    addOtherMealItem() {
        const container = document.getElementById('otherItemsContainer');
        if (!container) return;

        const itemId = Date.now(); // 使用时间戳作为唯一ID

        const itemElement = document.createElement('div');
        itemElement.className = 'other-item';
        itemElement.setAttribute('data-item-id', itemId);
        itemElement.innerHTML = `
            <input type="text" class="other-item-input" placeholder="水果、零食等..."
                   onchange="saveOtherItemDescription(${itemId}, this.value)">
            <button class="other-item-detail-btn" onclick="openOtherItemDetailModal(${itemId})">+</button>
            <button class="other-item-remove-btn" onclick="removeOtherMealItem(${itemId})">×</button>
        `;

        container.appendChild(itemElement);

        // 初始化数据结构
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        if (!this.healthData.meals[dateKey]) {
            this.healthData.meals[dateKey] = {};
        }
        if (!this.healthData.meals[dateKey].other) {
            this.healthData.meals[dateKey].other = {
                description: '',
                details: [],
                items: {}
            };
        }
        if (!this.healthData.meals[dateKey].other.items) {
            this.healthData.meals[dateKey].other.items = {};
        }

        // 添加新条目
        this.healthData.meals[dateKey].other.items[itemId] = {
            id: itemId,
            description: '',
            details: []
        };

        this.saveHealthData();

        // 聚焦到新输入框
        const newInput = itemElement.querySelector('.other-item-input');
        if (newInput) newInput.focus();
    }

    // 移除其他餐饮条目
    removeOtherMealItem(itemId) {
        if (confirm('确定删除这个条目吗？')) {
            const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
            if (itemElement) {
                itemElement.remove();
            }

            // 从数据中删除
            // 使用本地日期而不是UTC日期
            const year = this.mealDate.getFullYear();
            const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
            const day = String(this.mealDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            if (this.healthData.meals[dateKey] &&
                this.healthData.meals[dateKey].other &&
                this.healthData.meals[dateKey].other.items) {
                delete this.healthData.meals[dateKey].other.items[itemId];
            }

            this.saveHealthData();
            this.renderOtherItemsImages();
        }
    }

    // 渲染其他餐饮条目
    renderOtherItems() {
        const container = document.getElementById('otherItemsContainer');
        if (!container) return;

        container.innerHTML = '';

        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const mealData = this.healthData.meals[dateKey];

        if (mealData && mealData.other && mealData.other.items) {
            Object.values(mealData.other.items).forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'other-item';
                itemElement.setAttribute('data-item-id', item.id);
                itemElement.innerHTML = `
                    <input type="text" class="other-item-input" placeholder="水果、零食等..."
                           value="${item.description || ''}"
                           onchange="saveOtherItemDescription(${item.id}, this.value)">
                    <button class="other-item-detail-btn" onclick="openOtherItemDetailModal(${item.id})">+</button>
                    <button class="other-item-remove-btn" onclick="removeOtherMealItem(${item.id})">×</button>
                `;

                container.appendChild(itemElement);
            });
        }

        // 渲染其他条目的图片
        this.renderOtherItemsImages();
    }

    // 保存其他条目描述
    saveOtherItemDescription(itemId, description) {
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        if (!this.healthData.meals[dateKey]) {
            this.healthData.meals[dateKey] = {};
        }
        if (!this.healthData.meals[dateKey].other) {
            this.healthData.meals[dateKey].other = {
                description: '',
                details: [],
                items: {}
            };
        }
        if (!this.healthData.meals[dateKey].other.items) {
            this.healthData.meals[dateKey].other.items = {};
        }
        if (!this.healthData.meals[dateKey].other.items[itemId]) {
            this.healthData.meals[dateKey].other.items[itemId] = {
                id: itemId,
                description: '',
                details: []
            };
        }

        this.healthData.meals[dateKey].other.items[itemId].description = description;
        this.saveHealthData();
    }

    // 打开其他条目详情弹窗
    openOtherItemDetailModal(itemId) {
        this.selectedMealType = 'other';
        this.selectedOtherItemId = itemId;

        const titleElement = document.getElementById('mealDetailTitle');
        const dateElement = document.getElementById('mealDetailDate');

        if (titleElement) titleElement.textContent = '添加其他食物详情';
        if (dateElement) {
            const year = this.mealDate.getFullYear();
            const month = this.mealDate.getMonth() + 1;
            const day = this.mealDate.getDate();
            dateElement.textContent = `${year}年${month}月${day}日`;
        }

        // 加载现有数据
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const mealData = this.healthData.meals[dateKey];
        const itemData = mealData && mealData.other && mealData.other.items && mealData.other.items[itemId];

        if (itemData && itemData.details && itemData.details.length > 0) {
            // 加载第一个详情记录
            const detail = itemData.details[0];

            const descriptionInput = document.getElementById('mealDescription');
            const imageUrlInput = document.getElementById('mealImageUrl');
            const reviewInput = document.getElementById('mealReview');

            if (descriptionInput) descriptionInput.value = detail.description || '';
            if (imageUrlInput) imageUrlInput.value = detail.imageUrl || '';
            if (reviewInput) reviewInput.value = detail.review || '';

            this.selectedMealRating = detail.rating || 0;
            this.updateStarRating();

            // 预览图片
            if (detail.imageUrl) {
                this.previewMealImage();
            }

            // 显示清除按钮
            const clearBtn = document.getElementById('clearMealDetailBtn');
            if (clearBtn) {
                clearBtn.style.display = 'block';
            }
        } else {
            // 清空表单
            this.clearMealDetailForm();
        }

        // 显示弹窗
        const modal = document.getElementById('mealDetailModal');
        if (modal) modal.classList.add('active');
    }

    // 渲染其他条目的图片
    renderOtherItemsImages() {
        const container = document.getElementById('otherImages');
        if (!container) return;

        container.innerHTML = '';

        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const mealData = this.healthData.meals[dateKey];

        if (mealData && mealData.other && mealData.other.items) {
            Object.values(mealData.other.items).forEach(item => {
                if (item.details && item.details.length > 0) {
                    item.details.forEach((detail, detailIndex) => {
                        if (detail.imageUrl) {
                            const imageItem = document.createElement('div');
                            imageItem.className = 'meal-image-item';
                            imageItem.innerHTML = `
                                <img src="${detail.imageUrl}" alt="食物图片" onerror="this.parentElement.style.display='none'">
                                ${detail.rating ? `<div class="meal-rating">${detail.rating}⭐</div>` : ''}
                            `;

                            // 添加点击查看详情
                            imageItem.addEventListener('click', () => {
                                this.viewOtherItemDetail(item.id, detailIndex);
                            });

                            container.appendChild(imageItem);
                        }
                    });
                }
            });
        }
    }

    // 查看其他条目详情
    viewOtherItemDetail(itemId, detailIndex) {
        // 使用本地日期而不是UTC日期
        const year = this.mealDate.getFullYear();
        const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
        const day = String(this.mealDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const mealData = this.healthData.meals[dateKey];
        const itemData = mealData && mealData.other && mealData.other.items && mealData.other.items[itemId];

        if (itemData && itemData.details && itemData.details[detailIndex]) {
            const detail = itemData.details[detailIndex];

            this.selectedMealType = 'other';
            this.selectedOtherItemId = itemId;
            this.selectedOtherDetailIndex = detailIndex;

            // 填充表单
            const descriptionInput = document.getElementById('mealDescription');
            const imageUrlInput = document.getElementById('mealImageUrl');
            const reviewInput = document.getElementById('mealReview');

            if (descriptionInput) descriptionInput.value = detail.description || '';
            if (imageUrlInput) imageUrlInput.value = detail.imageUrl || '';
            if (reviewInput) reviewInput.value = detail.review || '';

            this.selectedMealRating = detail.rating || 0;
            this.updateStarRating();

            // 预览图片
            if (detail.imageUrl) {
                this.previewMealImage();
            }

            // 显示清除按钮
            const clearBtn = document.getElementById('clearMealDetailBtn');
            if (clearBtn) {
                clearBtn.style.display = 'block';
                clearBtn.onclick = () => this.clearOtherItemDetailRecord(itemId, detailIndex);
            }

            // 打开弹窗
            this.openMealDetailModal('other');
        }
    }

    // 清除其他条目详情记录
    clearOtherItemDetailRecord(itemId, detailIndex) {
        if (confirm('确定删除这条记录吗？')) {
            // 使用本地日期而不是UTC日期
            const year = this.mealDate.getFullYear();
            const month = String(this.mealDate.getMonth() + 1).padStart(2, '0');
            const day = String(this.mealDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            const mealData = this.healthData.meals[dateKey];
            const itemData = mealData && mealData.other && mealData.other.items && mealData.other.items[itemId];

            if (itemData && itemData.details) {
                itemData.details.splice(detailIndex, 1);
                this.saveHealthData();
                this.renderOtherItems();
                this.closeMealDetailModal();
            }
        }
    }
}

// 页面设置管理类
class PageSettings {
    constructor() {
        this.settings = this.loadSettings();
        this.cssSchemes = this.loadCSSSchemes();
        this.init();
    }

    init() {
        this.applyStoredSettings();
        this.bindEvents();
    }

    // 加载设置
    loadSettings() {
        const saved = localStorage.getItem('health-page-settings');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            background: {
                url: '',
                mode: 'cover',
                opacity: 100
            },
            activeScheme: 'default'
        };
    }

    // 加载CSS方案
    loadCSSSchemes() {
        const saved = localStorage.getItem('health-page-css-schemes');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            default: this.getDefaultCSS(),
            spring: this.getSpringCSS(),
            summer: this.getSummerCSS(),
            autumn: this.getAutumnCSS(),
            winter: this.getWinterCSS(),
            dark: this.getDarkCSS()
        };
    }

    // 保存设置
    saveSettings() {
        localStorage.setItem('health-page-settings', JSON.stringify(this.settings));
    }

    // 保存设置
    saveSettings() {
        localStorage.setItem('health-page-settings', JSON.stringify(this.settings));
    }

    // 保存CSS方案
    saveCSSSchemes() {
        localStorage.setItem('health-page-css-schemes', JSON.stringify(this.cssSchemes));
    }

    // 获取默认CSS
    getDefaultCSS() {
        return `/* 健康页面默认样式 - 完整的CSS变量系统 */
:root {
    /* 主要颜色变量 */
    --primary-color: #c9a87c;
    --secondary-color: #e8dcc8;
    --background-color: #f5f1e8;
    --text-color: #5a4a3a;
    --card-color: #ffffff;
    
    /* 扩展颜色变量 */
    --accent-color: #d4c4a8;
    --muted-color: #8b7355;
    --success-color: #7fb069;
    --warning-color: #ff6b6b;
    --info-color: #4682b4;
    --light-bg: #fdfbf7;
    --hover-bg: #f5ede0;
    --border-light: #e8dcc8;
    --border-dark: #d4c4a8;
    
    /* 按钮颜色 */
    --btn-primary-bg: var(--primary-color);
    --btn-primary-hover: #b89968;
    --btn-secondary-bg: var(--accent-color);
    --btn-secondary-hover: #c09460;
    --btn-danger-bg: #d4a574;
    --btn-danger-hover: #c09460;
    
    /* 输入框颜色 */
    --input-bg: var(--card-color);
    --input-border: var(--border-light);
    --input-focus-border: var(--primary-color);
    --input-placeholder: #a89580;
    
    /* 模态框颜色 */
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-bg: var(--card-color);
    --modal-border: var(--border-light);
    --modal-shadow: rgba(0, 0, 0, 0.2);
    
    /* 卡片颜色 */
    --card-border: var(--secondary-color);
    --card-hover-border: var(--primary-color);
    --card-shadow: rgba(0, 0, 0, 0.1);
    --card-hover-shadow: rgba(169, 124, 82, 0.15);
    --card-title-border: var(--border-light);
    --card-title-text: var(--text-color);
    
    /* 导航颜色 */
    --nav-bg: var(--card-color);
    --nav-border: var(--border-light);
    --nav-text: var(--muted-color);
    --nav-hover-bg: #faf8f3;
    --nav-active-bg: var(--hover-bg);
    --nav-active-text: var(--text-color);
    
    /* 日历颜色 */
    --calendar-bg: var(--light-bg);
    --calendar-border: var(--border-light);
    --calendar-day-bg: var(--light-bg);
    --calendar-day-border: var(--border-light);
    --calendar-day-hover-bg: var(--hover-bg);
    --calendar-day-hover-border: var(--primary-color);
    --calendar-today-bg: var(--hover-bg);
    --calendar-today-border: var(--primary-color);
    --calendar-header-bg: var(--hover-bg);
    --calendar-header-text: var(--muted-color);
    --calendar-nav-btn-bg: var(--secondary-color);
    --calendar-nav-btn-hover: var(--accent-color);
    --calendar-nav-btn-text: var(--text-color);
    --calendar-title-text: var(--text-color);
    
    /* 表单元素颜色 */
    --form-bg: var(--light-bg);
    --form-border: var(--border-light);
    --form-label-text: var(--text-color);
    --time-input-bg: var(--card-color);
    --time-input-border: var(--border-light);
    --time-input-focus: var(--primary-color);
    --time-input-text: var(--text-color);
    --time-input-placeholder: var(--input-placeholder);
    
    /* 特殊记录颜色 */
    --sleep-record-bg: #e8f5e8;
    --sleep-record-border: #a8c9a8;
    --sleep-record-hover-bg: #d4f0d4;
    --sleep-duration-text: #6b9b6b;
    --sleep-recorded-bg: var(--primary-color);
    --sleep-recorded-text: white;
    --sleep-recorded-border: #a67c52;
    --sleep-recorded-hover: var(--btn-primary-hover);
    
    /* 生理期颜色 */
    --menstrual-color: #ff6b6b;
    --follicular-color: #4ecdc4;
    --ovulation-color: #45b7d1;
    --luteal-color: #f9ca24;
    --safe-color: #6c5ce7;
    
    /* 运动记录颜色 */
    --exercise-day-border: var(--border-light);
    --exercise-day-hover-border: var(--primary-color);
    --exercise-day-hover-bg: var(--hover-bg);
    --exercise-day-today-border: var(--primary-color);
    --exercise-day-today-bg: var(--hover-bg);
    --exercise-day-has-bg: #eef7ee;
    --exercise-day-has-border: #a8c9a8;
    --exercise-label-text: var(--muted-color);
    --exercise-steps-text: var(--text-color);
    --exercise-status-bg: var(--hover-bg);
    --exercise-status-text: var(--muted-color);
    --exercise-status-exercised-text: #6b9b6b;
    --exercise-status-exercised-bg: #d4f0d4;
    --exercise-total-text: var(--text-color);
    --exercise-total-highlight: var(--primary-color);
    
    /* 排便记录颜色 */
    --bowel-record-bg: #f0e6d2;
    --bowel-record-border: var(--primary-color);
    --bowel-record-hover-bg: var(--secondary-color);
    
    /* 餐饮票据颜色 */
    --meal-ticket-shadow: rgba(212, 196, 168, 0.2);
    --meal-ticket-hover-shadow: rgba(212, 196, 168, 0.3);
    --meal-item-bg: rgba(255, 255, 255, 0.7);
    --meal-item-hover-bg: rgba(255, 255, 255, 0.9);
    
    /* 通用文本和选项颜色 */
    --section-title-text: var(--text-color);
    --label-text: var(--text-color);
    --input-text: var(--text-color);
    --preview-text: var(--text-color);
    --option-hover-bg: var(--hover-bg);
    --option-hover-border: var(--primary-color);
    --option-selected-bg: var(--hover-bg);
    --option-selected-border: #a67c52;
    
    /* 状态指示器颜色 */
    --status-dot-bg: var(--primary-color);
    --status-dot-border: var(--primary-color);
    
    /* 各板块导航按钮颜色 */
    --skincare-nav-btn-bg: var(--secondary-color);
    --skincare-nav-btn-hover: var(--accent-color);
    --period-nav-btn-bg: var(--secondary-color);
    --period-nav-btn-hover: var(--accent-color);
    --bowel-nav-btn-bg: var(--secondary-color);
    --bowel-nav-btn-hover: var(--accent-color);
    --meal-nav-btn-bg: var(--secondary-color);
    --meal-nav-btn-hover: var(--accent-color);
    --exercise-nav-btn-bg: var(--secondary-color);
    --exercise-nav-btn-hover: var(--accent-color);
    
    /* 餐饮分析按钮颜色 */
    --meal-analysis-btn-bg: var(--primary-color);
    --meal-analysis-btn-hover: var(--btn-primary-hover);
    --meal-analysis-modal-bg: var(--card-color);
    --meal-analysis-header-text: var(--text-color);
    
    /* 运动记录卡片颜色 */
    --exercise-card-bg: var(--light-bg);
    --exercise-card-border: var(--border-light);
    
    /* 布局变量 */
    --border-radius: 16px;
    --shadow-intensity: 0.5;
    --animation-speed: 0.3s;
}

/* 应用CSS变量到所有元素 */
body {
    background-color: var(--background-color);
    color: var(--text-color);
}

.health-container {
    background-color: var(--background-color);
    color: var(--text-color);
}

/* 卡片样式 */
.health-card {
    background: var(--card-color);
    border: 2px solid var(--card-border);
    border-radius: var(--border-radius);
    box-shadow: 0 2px 10px var(--card-shadow);
    transition: all var(--animation-speed);
}

.health-card:hover {
    border-color: var(--card-hover-border);
    box-shadow: 0 4px 12px var(--card-hover-shadow);
}

.card-title, .card-header h3 {
    color: var(--card-title-text);
    border-bottom-color: var(--card-title-border);
}

/* 按钮样式 */
.btn-primary, .save-sleep-btn, .add-meal-btn {
    background: var(--btn-primary-bg);
    color: white;
    border: none;
    border-radius: 8px;
    transition: all var(--animation-speed);
}

.btn-primary:hover, .save-sleep-btn:hover, .add-meal-btn:hover {
    background: var(--btn-primary-hover);
}

/* 输入框样式 */
.time-input, input[type="text"], input[type="url"], select, textarea {
    background: var(--input-bg);
    border: 2px solid var(--input-border);
    color: var(--input-text);
}

.time-input:focus, input:focus, select:focus, textarea:focus {
    border-color: var(--input-focus-border);
}

.time-input::placeholder, input::placeholder, textarea::placeholder {
    color: var(--input-placeholder);
}

/* 表单样式 */
.time-input-section, .sleep-form {
    background: var(--form-bg);
    border: 1px solid var(--form-border);
}

.time-input-row label, .form-group label {
    color: var(--form-label-text);
}

/* 导航样式 */
.sidebar {
    background: var(--nav-bg);
    border-right: 2px solid var(--nav-border);
}

.nav-item {
    color: var(--nav-text);
}

.nav-item:hover {
    background: var(--nav-hover-bg);
    border-left-color: var(--primary-color);
}

.nav-item.active {
    background: var(--nav-active-bg);
    color: var(--nav-active-text);
    border-left-color: var(--primary-color);
}

/* 日历样式 */
.calendar-day {
    background: var(--calendar-day-bg);
    border: 1px solid var(--calendar-day-border);
    color: var(--text-color);
}

.calendar-day:hover {
    background: var(--calendar-day-hover-bg);
    border-color: var(--calendar-day-hover-border);
}

.calendar-day.today {
    background: var(--calendar-today-bg);
    border-color: var(--calendar-today-border);
}

.weekday-header {
    background: var(--calendar-header-bg);
    color: var(--calendar-header-text);
}

.calendar-nav button {
    background: var(--calendar-nav-btn-bg);
    color: var(--calendar-nav-btn-text);
}

.calendar-nav button:hover {
    background: var(--calendar-nav-btn-hover);
}

.month-title, #sleepCalendarMonth {
    color: var(--calendar-title-text);
}

/* 特殊记录样式 */
.calendar-day.has-sleep-record {
    background: var(--sleep-record-bg);
    border-color: var(--sleep-record-border);
}

.calendar-day.has-sleep-record:hover {
    background: var(--sleep-record-hover-bg);
}

.sleep-duration {
    color: var(--sleep-duration-text);
}

.calendar-day.recorded {
    background: var(--sleep-recorded-bg);
    color: var(--sleep-recorded-text);
    border-color: var(--sleep-recorded-border);
}

.calendar-day.recorded:hover {
    background: var(--sleep-recorded-hover);
}

/* 生理期颜色 */
.menstrual-color { background-color: var(--menstrual-color); }
.follicular-color { background-color: var(--follicular-color); }
.ovulation-color { background-color: var(--ovulation-color); }
.luteal-color { background-color: var(--luteal-color); }
.safe-color { background-color: var(--safe-color); }

/* 运动记录样式 */
.exercise-day {
    border-color: var(--exercise-day-border);
}

.exercise-day:hover {
    border-color: var(--exercise-day-hover-border);
    background: var(--exercise-day-hover-bg);
}

.exercise-day.today {
    border-color: var(--exercise-day-today-border);
    background: var(--exercise-day-today-bg);
}

.exercise-day.has-exercise {
    background: var(--exercise-day-has-bg);
    border-color: var(--exercise-day-has-border);
}

.day-label {
    color: var(--exercise-label-text);
}

.steps-display {
    color: var(--exercise-steps-text);
}

.exercise-status {
    background: var(--exercise-status-bg);
    color: var(--exercise-status-text);
}

.exercise-status.exercised {
    color: var(--exercise-status-exercised-text);
    background: var(--exercise-status-exercised-bg);
}

.total-steps, .total-exercises {
    color: var(--exercise-total-text);
}

.total-steps span, .total-exercises span {
    color: var(--exercise-total-highlight);
}

/* 排便记录样式 */
.calendar-day.has-bowel-record {
    background: var(--bowel-record-bg);
    border-color: var(--bowel-record-border);
}

.calendar-day.has-bowel-record:hover {
    background: var(--bowel-record-hover-bg);
}

/* 模态框样式 */
.modal, .page-settings-modal {
    background: var(--modal-overlay);
}

.modal-content, .page-settings-content {
    background: var(--modal-bg);
    border: 2px solid var(--modal-border);
    box-shadow: 0 8px 32px var(--modal-shadow);
}

/* 餐饮票据样式 */
.meal-ticket {
    box-shadow: 0 2px 8px var(--meal-ticket-shadow);
}

.meal-ticket:hover {
    box-shadow: 0 4px 12px var(--meal-ticket-hover-shadow);
}

.other-item {
    background: var(--meal-item-bg);
    border: 1px solid var(--border-light);
}

.other-item:hover {
    background: var(--meal-item-hover-bg);
    border-color: var(--primary-color);
}

/* 通用文本和选项样式 */
.section-title h4, .bowel-settings-header h3, .bowel-icon-section h4 {
    color: var(--section-title-text);
}

.icon-input-section label, .preset-icons h5 {
    color: var(--label-text);
}

.icon-option:hover {
    background: var(--option-hover-bg);
    border-color: var(--option-hover-border);
}

.icon-option.selected {
    background: var(--option-selected-bg);
    border-color: var(--option-selected-border);
}

/* 设置按钮 */
.settings-btn {
    background: var(--nav-bg);
    border: 2px solid var(--border-dark);
    color: var(--text-color);
}

.settings-btn:hover {
    background: var(--card-color);
    box-shadow: 0 2px 8px var(--modal-shadow);
}`;
    }

    // 获取春日主题CSS
    getSpringCSS() {
        return `/* 春日清新主题 - 完整变量系统 */
:root {
    /* 主要颜色变量 */
    --primary-color: #7fb069;
    --secondary-color: #d6eadf;
    --background-color: #f0f8f0;
    --text-color: #2d5016;
    --card-color: #ffffff;
    
    /* 扩展颜色变量 */
    --accent-color: #a8d4a8;
    --muted-color: #5a7a5a;
    --success-color: #8bc34a;
    --warning-color: #ff9800;
    --info-color: #4caf50;
    --light-bg: #f8fff8;
    --hover-bg: #e8f5e8;
    --border-light: #d6eadf;
    --border-dark: #a8d4a8;
    
    /* 按钮颜色 */
    --btn-primary-bg: linear-gradient(45deg, var(--primary-color), #8bc34a);
    --btn-primary-hover: #6fa055;
    --btn-secondary-bg: var(--accent-color);
    --btn-secondary-hover: #90c490;
    --btn-danger-bg: #a8d4a8;
    --btn-danger-hover: #90c490;
    
    /* 输入框颜色 */
    --input-bg: var(--card-color);
    --input-border: var(--border-light);
    --input-focus-border: var(--primary-color);
    --input-placeholder: #7a9a7a;
    
    /* 模态框颜色 */
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-bg: var(--card-color);
    --modal-border: var(--border-light);
    --modal-shadow: rgba(127, 176, 105, 0.2);
    
    /* 卡片颜色 */
    --card-border: var(--secondary-color);
    --card-hover-border: var(--primary-color);
    --card-shadow: rgba(127, 176, 105, 0.2);
    --card-hover-shadow: rgba(127, 176, 105, 0.3);
    
    /* 导航颜色 */
    --nav-bg: var(--card-color);
    --nav-border: var(--border-light);
    --nav-text: var(--muted-color);
    --nav-hover-bg: var(--light-bg);
    --nav-active-bg: var(--hover-bg);
    --nav-active-text: var(--text-color);
    
    /* 日历颜色 */
    --calendar-bg: var(--light-bg);
    --calendar-border: var(--border-light);
    --calendar-day-bg: var(--light-bg);
    --calendar-day-border: var(--border-light);
    --calendar-day-hover-bg: var(--hover-bg);
    --calendar-day-hover-border: var(--primary-color);
    --calendar-today-bg: var(--hover-bg);
    --calendar-today-border: var(--primary-color);
    --calendar-header-bg: var(--hover-bg);
    --calendar-header-text: var(--muted-color);
    
    /* 特殊记录颜色 */
    --sleep-record-bg: #e8f5e8;
    --sleep-record-border: #a8d4a8;
    --sleep-record-hover-bg: #d4f0d4;
    --period-record-shadow: rgba(127, 176, 105, 0.3);
    
    /* 餐饮票据颜色 */
    --meal-ticket-shadow: rgba(127, 176, 105, 0.2);
    --meal-ticket-hover-shadow: rgba(127, 176, 105, 0.3);
    --meal-item-bg: rgba(240, 248, 240, 0.8);
    --meal-item-hover-bg: rgba(240, 248, 240, 0.95);
    
    /* 布局变量 */
    --border-radius: 20px;
    --shadow-intensity: 0.6;
    --animation-speed: 0.4s;
}

/* 春日主题特殊样式 */
.health-container {
    background: linear-gradient(135deg, var(--background-color) 0%, #e8f5e8 100%);
}

.health-card {
    border: 2px solid rgba(127,176,105,0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.health-card:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: var(--primary-color);
}

.card-title {
    font-size: 20px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(127,176,105,0.1);
}

.btn-primary {
    background: var(--btn-primary-bg);
    font-weight: 600;
    border-radius: 12px;
    padding: 12px 20px;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(127,176,105,0.4);
}`;
    }

    // 获取夏日主题CSS
    getSummerCSS() {
        return `/* 夏日活力主题 - 完整变量系统 */
:root {
    /* 主要颜色变量 */
    --primary-color: #ff6b6b;
    --secondary-color: #ffe0e0;
    --background-color: #fff5f5;
    --text-color: #8b0000;
    --card-color: #ffffff;
    
    /* 扩展颜色变量 */
    --accent-color: #ffb3b3;
    --muted-color: #cc5555;
    --success-color: #ff8a80;
    --warning-color: #ff9800;
    --info-color: #ff5722;
    --light-bg: #fffafa;
    --hover-bg: #ffe8e8;
    --border-light: #ffe0e0;
    --border-dark: #ffb3b3;
    
    /* 按钮颜色 */
    --btn-primary-bg: linear-gradient(135deg, var(--primary-color), #ff5722);
    --btn-primary-hover: #ff5252;
    --btn-secondary-bg: var(--accent-color);
    --btn-secondary-hover: #ff9999;
    --btn-danger-bg: #ffb3b3;
    --btn-danger-hover: #ff9999;
    
    /* 输入框颜色 */
    --input-bg: var(--card-color);
    --input-border: var(--border-light);
    --input-focus-border: var(--primary-color);
    --input-placeholder: #cc8888;
    
    /* 模态框颜色 */
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-bg: var(--card-color);
    --modal-border: var(--border-light);
    --modal-shadow: rgba(255, 107, 107, 0.2);
    
    /* 卡片颜色 */
    --card-border: var(--secondary-color);
    --card-hover-border: var(--primary-color);
    --card-shadow: rgba(255, 107, 107, 0.2);
    --card-hover-shadow: rgba(255, 107, 107, 0.3);
    
    /* 导航颜色 */
    --nav-bg: var(--card-color);
    --nav-border: var(--border-light);
    --nav-text: var(--muted-color);
    --nav-hover-bg: var(--light-bg);
    --nav-active-bg: var(--hover-bg);
    --nav-active-text: var(--text-color);
    
    /* 日历颜色 */
    --calendar-bg: var(--light-bg);
    --calendar-border: var(--border-light);
    --calendar-day-bg: var(--light-bg);
    --calendar-day-border: var(--border-light);
    --calendar-day-hover-bg: var(--hover-bg);
    --calendar-day-hover-border: var(--primary-color);
    --calendar-today-bg: var(--hover-bg);
    --calendar-today-border: var(--primary-color);
    --calendar-header-bg: var(--hover-bg);
    --calendar-header-text: var(--muted-color);
    
    /* 特殊记录颜色 */
    --sleep-record-bg: #ffe8e8;
    --sleep-record-border: #ffb3b3;
    --sleep-record-hover-bg: #ffd0d0;
    --period-record-shadow: rgba(255, 107, 107, 0.3);
    
    /* 餐饮票据颜色 */
    --meal-ticket-shadow: rgba(255, 107, 107, 0.2);
    --meal-ticket-hover-shadow: rgba(255, 107, 107, 0.3);
    --meal-item-bg: rgba(255, 245, 245, 0.8);
    --meal-item-hover-bg: rgba(255, 245, 245, 0.95);
    
    /* 布局变量 */
    --border-radius: 24px;
    --shadow-intensity: 0.7;
    --animation-speed: 0.3s;
}

/* 夏日主题特殊样式 */
.health-container {
    background: radial-gradient(circle at top right, var(--background-color) 0%, #ffe8e8 50%, #ffd0d0 100%);
}

.health-card {
    position: relative;
    overflow: hidden;
    padding: 28px;
}

.health-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), #ff8a80);
}

.health-card:hover {
    transform: translateY(-6px) rotate(1deg);
}

.card-title {
    font-size: 22px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-primary {
    background: var(--btn-primary-bg);
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 16px;
    padding: 14px 24px;
}

.btn-primary:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 28px rgba(255,107,107,0.5);
}`;
    }

    // 获取秋日主题CSS
    getAutumnCSS() {
        return `/* 秋日温暖主题 - 完整变量系统 */
:root {
    /* 主要颜色变量 */
    --primary-color: #d2691e;
    --secondary-color: #f4e4bc;
    --background-color: #faf0e6;
    --text-color: #8b4513;
    --card-color: #ffffff;
    
    /* 扩展颜色变量 */
    --accent-color: #deb887;
    --muted-color: #a0522d;
    --success-color: #cd853f;
    --warning-color: #ff8c00;
    --info-color: #d2691e;
    --light-bg: #fdf8f0;
    --hover-bg: #f5e6d3;
    --border-light: #f4e4bc;
    --border-dark: #deb887;
    
    /* 按钮颜色 */
    --btn-primary-bg: linear-gradient(120deg, var(--primary-color), #cd853f);
    --btn-primary-hover: #b8651a;
    --btn-secondary-bg: var(--accent-color);
    --btn-secondary-hover: #d2b48c;
    --btn-danger-bg: #deb887;
    --btn-danger-hover: #d2b48c;
    
    /* 输入框颜色 */
    --input-bg: var(--card-color);
    --input-border: var(--border-light);
    --input-focus-border: var(--primary-color);
    --input-placeholder: #b8956f;
    
    /* 模态框颜色 */
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-bg: var(--card-color);
    --modal-border: var(--border-light);
    --modal-shadow: rgba(210, 105, 30, 0.15);
    
    /* 卡片颜色 */
    --card-border: var(--secondary-color);
    --card-hover-border: var(--primary-color);
    --card-shadow: rgba(210, 105, 30, 0.15);
    --card-hover-shadow: rgba(210, 105, 30, 0.25);
    
    /* 导航颜色 */
    --nav-bg: var(--card-color);
    --nav-border: var(--border-light);
    --nav-text: var(--muted-color);
    --nav-hover-bg: var(--light-bg);
    --nav-active-bg: var(--hover-bg);
    --nav-active-text: var(--text-color);
    
    /* 日历颜色 */
    --calendar-bg: var(--light-bg);
    --calendar-border: var(--border-light);
    --calendar-day-bg: var(--light-bg);
    --calendar-day-border: var(--border-light);
    --calendar-day-hover-bg: var(--hover-bg);
    --calendar-day-hover-border: var(--primary-color);
    --calendar-today-bg: var(--hover-bg);
    --calendar-today-border: var(--primary-color);
    --calendar-header-bg: var(--hover-bg);
    --calendar-header-text: var(--muted-color);
    
    /* 特殊记录颜色 */
    --sleep-record-bg: #f5e6d3;
    --sleep-record-border: #deb887;
    --sleep-record-hover-bg: #ede0c8;
    --period-record-shadow: rgba(210, 105, 30, 0.3);
    
    /* 餐饮票据颜色 */
    --meal-ticket-shadow: rgba(210, 105, 30, 0.15);
    --meal-ticket-hover-shadow: rgba(210, 105, 30, 0.25);
    --meal-item-bg: rgba(250, 240, 230, 0.8);
    --meal-item-hover-bg: rgba(250, 240, 230, 0.95);
    
    /* 布局变量 */
    --border-radius: 18px;
    --shadow-intensity: 0.6;
    --animation-speed: 0.35s;
}

/* 秋日主题特殊样式 */
.health-container {
    background: linear-gradient(45deg, var(--background-color) 0%, #f5e6d3 50%, #ede0c8 100%);
}

.health-card {
    border-left: 6px solid var(--primary-color);
    padding: 26px;
}

.health-card:hover {
    transform: translateX(8px) translateY(-3px);
    border-left-width: 8px;
}

.card-title {
    font-size: 19px;
    font-weight: 650;
    font-family: 'Georgia', serif;
}

.btn-primary {
    background: var(--btn-primary-bg);
    font-weight: 600;
    border-radius: 10px;
    padding: 11px 18px;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.2);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(210,105,30,0.3), inset 0 2px 4px rgba(255,255,255,0.3);
}`;
    }

    // 获取冬日主题CSS
    getWinterCSS() {
        return `/* 冬日雅致主题 - 完整变量系统 */
:root {
    /* 主要颜色变量 */
    --primary-color: #4682b4;
    --secondary-color: #e6f3ff;
    --background-color: #f0f8ff;
    --text-color: #2f4f4f;
    --card-color: #ffffff;
    
    /* 扩展颜色变量 */
    --accent-color: #b0d4f1;
    --muted-color: #708090;
    --success-color: #5a9bd4;
    --warning-color: #4169e1;
    --info-color: #6495ed;
    --light-bg: #f8fcff;
    --hover-bg: #e6f3ff;
    --border-light: #e6f3ff;
    --border-dark: #b0d4f1;
    
    /* 按钮颜色 */
    --btn-primary-bg: var(--primary-color);
    --btn-primary-hover: #5a9bd4;
    --btn-secondary-bg: var(--accent-color);
    --btn-secondary-hover: #9bc7e8;
    --btn-danger-bg: #b0d4f1;
    --btn-danger-hover: #9bc7e8;
    
    /* 输入框颜色 */
    --input-bg: var(--card-color);
    --input-border: var(--border-light);
    --input-focus-border: var(--primary-color);
    --input-placeholder: #8fa8c4;
    
    /* 模态框颜色 */
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-bg: var(--card-color);
    --modal-border: var(--border-light);
    --modal-shadow: rgba(70, 130, 180, 0.12);
    
    /* 卡片颜色 */
    --card-border: var(--secondary-color);
    --card-hover-border: var(--primary-color);
    --card-shadow: rgba(70, 130, 180, 0.12);
    --card-hover-shadow: rgba(70, 130, 180, 0.2);
    
    /* 导航颜色 */
    --nav-bg: var(--card-color);
    --nav-border: var(--border-light);
    --nav-text: var(--muted-color);
    --nav-hover-bg: var(--light-bg);
    --nav-active-bg: var(--hover-bg);
    --nav-active-text: var(--text-color);
    
    /* 日历颜色 */
    --calendar-bg: var(--light-bg);
    --calendar-border: var(--border-light);
    --calendar-day-bg: var(--light-bg);
    --calendar-day-border: var(--border-light);
    --calendar-day-hover-bg: var(--hover-bg);
    --calendar-day-hover-border: var(--primary-color);
    --calendar-today-bg: var(--hover-bg);
    --calendar-today-border: var(--primary-color);
    --calendar-header-bg: var(--hover-bg);
    --calendar-header-text: var(--muted-color);
    
    /* 特殊记录颜色 */
    --sleep-record-bg: #e6f3ff;
    --sleep-record-border: #b0d4f1;
    --sleep-record-hover-bg: #d0e8ff;
    --period-record-shadow: rgba(70, 130, 180, 0.3);
    
    /* 餐饮票据颜色 */
    --meal-ticket-shadow: rgba(70, 130, 180, 0.12);
    --meal-ticket-hover-shadow: rgba(70, 130, 180, 0.2);
    --meal-item-bg: rgba(240, 248, 255, 0.8);
    --meal-item-hover-bg: rgba(240, 248, 255, 0.95);
    
    /* 布局变量 */
    --border-radius: 12px;
    --shadow-intensity: 0.4;
    --animation-speed: 0.25s;
}

/* 冬日主题特殊样式 */
.health-container {
    background: linear-gradient(180deg, var(--background-color) 0%, #e6f3ff 100%);
}

.health-card {
    border: 1px solid rgba(70,130,180,0.1);
    padding: 22px;
}

.health-card:hover {
    transform: translateY(-2px);
    border-color: var(--primary-color);
}

.card-title {
    font-size: 17px;
    font-weight: 600;
    text-transform: capitalize;
}

.btn-primary {
    background: var(--btn-primary-bg);
    font-weight: 500;
    border-radius: 6px;
    padding: 10px 16px;
}

.btn-primary:hover {
    background: var(--btn-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(70,130,180,0.3);
}`;
    }

    // 获取深色主题CSS
    getDarkCSS() {
        return `/* 深色模式主题 - 完整变量系统 */
:root {
    /* 主要颜色变量 */
    --primary-color: #bb86fc;
    --secondary-color: #3c3c3c;
    --background-color: #121212;
    --text-color: #ffffff;
    --card-color: #1e1e1e;
    
    /* 扩展颜色变量 */
    --accent-color: #6200ea;
    --muted-color: #b0b0b0;
    --success-color: #03dac6;
    --warning-color: #cf6679;
    --info-color: #9c27b0;
    --light-bg: #2a2a2a;
    --hover-bg: #333333;
    --border-light: #333333;
    --border-dark: #555555;
    
    /* 按钮颜色 */
    --btn-primary-bg: linear-gradient(45deg, var(--primary-color), #9c27b0);
    --btn-primary-hover: #a370f7;
    --btn-secondary-bg: var(--accent-color);
    --btn-secondary-hover: #7c4dff;
    --btn-danger-bg: #6200ea;
    --btn-danger-hover: #7c4dff;
    
    /* 输入框颜色 */
    --input-bg: var(--card-color);
    --input-border: var(--border-light);
    --input-focus-border: var(--primary-color);
    --input-placeholder: #888888;
    
    /* 模态框颜色 */
    --modal-overlay: rgba(0, 0, 0, 0.8);
    --modal-bg: var(--card-color);
    --modal-border: var(--border-light);
    --modal-shadow: rgba(0, 0, 0, 0.6);
    
    /* 卡片颜色 */
    --card-border: var(--secondary-color);
    --card-hover-border: var(--primary-color);
    --card-shadow: rgba(0, 0, 0, 0.6);
    --card-hover-shadow: rgba(187, 134, 252, 0.2);
    
    /* 导航颜色 */
    --nav-bg: var(--card-color);
    --nav-border: var(--border-light);
    --nav-text: var(--muted-color);
    --nav-hover-bg: var(--light-bg);
    --nav-active-bg: var(--hover-bg);
    --nav-active-text: var(--text-color);
    
    /* 日历颜色 */
    --calendar-bg: var(--light-bg);
    --calendar-border: var(--border-light);
    --calendar-day-bg: var(--light-bg);
    --calendar-day-border: var(--border-light);
    --calendar-day-hover-bg: var(--hover-bg);
    --calendar-day-hover-border: var(--primary-color);
    --calendar-today-bg: var(--hover-bg);
    --calendar-today-border: var(--primary-color);
    --calendar-header-bg: var(--hover-bg);
    --calendar-header-text: var(--muted-color);
    
    /* 特殊记录颜色 */
    --sleep-record-bg: #2a2a2a;
    --sleep-record-border: #555555;
    --sleep-record-hover-bg: #333333;
    --period-record-shadow: rgba(187, 134, 252, 0.3);
    
    /* 餐饮票据颜色 */
    --meal-ticket-shadow: rgba(0, 0, 0, 0.6);
    --meal-ticket-hover-shadow: rgba(187, 134, 252, 0.2);
    --meal-item-bg: rgba(30, 30, 30, 0.8);
    --meal-item-hover-bg: rgba(30, 30, 30, 0.95);
    
    /* 布局变量 */
    --border-radius: 16px;
    --shadow-intensity: 0.8;
    --animation-speed: 0.3s;
}

/* 深色主题特殊样式 */
.health-container {
    background: linear-gradient(135deg, var(--background-color) 0%, #1a1a1a 100%);
}

.health-card {
    border: 1px solid var(--border-light);
    padding: 24px;
}

.health-card:hover {
    transform: translateY(-4px);
    border-color: var(--primary-color);
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(187,134,252,0.3);
}

.btn-primary {
    background: var(--btn-primary-bg);
    font-weight: 600;
    border-radius: 12px;
    padding: 12px 20px;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(187,134,252,0.4);
    filter: brightness(1.1);
}

/* 深色主题输入框 */
input, select, textarea {
    background: var(--input-bg);
    color: var(--text-color);
    border-color: var(--input-border);
}

input:focus, select:focus, textarea:focus {
    border-color: var(--input-focus-border);
}

/* 深色主题滚动条 */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--light-bg);
}

::-webkit-scrollbar-thumb {
    background: var(--border-dark);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
}`;
    }

    // 应用存储的设置
    applyStoredSettings() {
        // 应用背景
        if (this.settings.background.url) {
            this.applyBackgroundImage(this.settings.background.url, this.settings.background.mode, this.settings.background.opacity);
        }
        
        // 应用CSS方案
        const activeScheme = this.settings.activeScheme || 'default';
        this.applyCSSScheme(activeScheme);
    }

    // 绑定事件
    bindEvents() {
        setTimeout(() => {
            // 背景透明度
            const opacityRange = document.getElementById('backgroundOpacityRange');
            const opacityValue = document.getElementById('backgroundOpacityValue');
            if (opacityRange && opacityValue) {
                opacityRange.addEventListener('input', () => {
                    opacityValue.textContent = opacityRange.value + '%';
                });
            }

            // CSS编辑器实时预览
            const cssEditor = document.getElementById('cssEditor');
            if (cssEditor) {
                cssEditor.addEventListener('input', () => {
                    this.updateCSSPreview();
                });
            }
        }, 500);
    }

    // 加载CSS方案列表
    loadCSSSchemesList() {
        const schemeSelect = document.getElementById('cssSchemeSelect');
        if (!schemeSelect) return;
        
        schemeSelect.innerHTML = '';
        
        // 添加内置方案
        const builtInSchemes = {
            'default': '默认样式',
            'spring': '春日清新',
            'summer': '夏日活力', 
            'autumn': '秋日温暖',
            'winter': '冬日雅致',
            'dark': '深色模式'
        };
        
        Object.keys(builtInSchemes).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = builtInSchemes[key];
            schemeSelect.appendChild(option);
        });
        
        // 添加自定义方案
        Object.keys(this.cssSchemes).forEach(schemeName => {
            if (!builtInSchemes[schemeName]) {
                const option = document.createElement('option');
                option.value = schemeName;
                option.textContent = schemeName;
                schemeSelect.appendChild(option);
            }
        });
        
        // 设置当前选中的方案
        schemeSelect.value = this.settings.activeScheme || 'default';
    }

    // 切换CSS方案
    switchCSSScheme() {
        const schemeSelect = document.getElementById('cssSchemeSelect');
        if (!schemeSelect) return;
        
        const selectedScheme = schemeSelect.value;
        this.loadCSSToEditor(selectedScheme);
    }

    // 加载CSS到编辑器
    loadCSSToEditor(schemeName) {
        const cssEditor = document.getElementById('cssEditor');
        if (!cssEditor) return;
        
        let css = this.cssSchemes[schemeName];
        if (!css) {
            // 如果方案不存在，使用默认CSS
            css = this.getDefaultCSS();
        }
        
        cssEditor.value = css;
        this.updateCSSPreview();
    }

    // 更新CSS预览
    updateCSSPreview() {
        const cssEditor = document.getElementById('cssEditor');
        if (!cssEditor) return;
        
        const css = cssEditor.value;
        
        // 应用自定义样式
        let styleElement = document.getElementById('healthPageCustomStyle');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'healthPageCustomStyle';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = css;
    }

    // 应用CSS方案
    applyCSSScheme(schemeName) {
        const css = this.cssSchemes[schemeName] || this.getDefaultCSS();
        
        let styleElement = document.getElementById('healthPageCustomStyle');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'healthPageCustomStyle';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = css;
        
        this.settings.activeScheme = schemeName;
        this.saveSettings();
    }

    // 保存CSS方案
    saveCSSScheme() {
        const schemeNameInput = document.getElementById('newSchemeNameInput');
        const cssEditor = document.getElementById('cssEditor');
        
        if (!schemeNameInput || !cssEditor) return;
        
        const schemeName = schemeNameInput.value.trim();
        const css = cssEditor.value;
        
        if (!schemeName) {
            alert('请输入方案名称');
            return;
        }
        
        if (!css.trim()) {
            alert('CSS内容不能为空');
            return;
        }
        
        this.cssSchemes[schemeName] = css;
        this.saveCSSSchemes();
        this.settings.activeScheme = schemeName;
        this.saveSettings();
        
        schemeNameInput.value = '';
        this.loadCSSSchemesList();
        alert(`CSS方案 "${schemeName}" 已保存并应用！`);
    }

    // 删除CSS方案
    deleteCSSScheme() {
        const schemeSelect = document.getElementById('cssSchemeSelect');
        if (!schemeSelect) return;
        
        const selectedScheme = schemeSelect.value;
        
        // 不能删除内置方案
        const builtInSchemes = ['default', 'spring', 'summer', 'autumn', 'winter', 'dark'];
        if (builtInSchemes.includes(selectedScheme)) {
            alert('不能删除内置方案');
            return;
        }
        
        if (confirm(`确定删除方案 "${selectedScheme}" 吗？`)) {
            delete this.cssSchemes[selectedScheme];
            this.saveCSSSchemes();
            
            // 如果删除的是当前激活的方案，切换到默认方案
            if (this.settings.activeScheme === selectedScheme) {
                this.settings.activeScheme = 'default';
                this.saveSettings();
                this.applyCSSScheme('default');
            }
            
            this.loadCSSSchemesList();
            this.loadCSSToEditor(this.settings.activeScheme || 'default');
            alert(`方案 "${selectedScheme}" 已删除！`);
        }
    }

    // 应用当前CSS
    applyCurrentCSS() {
        const cssEditor = document.getElementById('cssEditor');
        const schemeSelect = document.getElementById('cssSchemeSelect');
        
        if (!cssEditor || !schemeSelect) return;
        
        const css = cssEditor.value;
        const selectedScheme = schemeSelect.value;
        
        if (!css.trim()) {
            alert('CSS内容不能为空');
            return;
        }
        
        // 更新方案内容
        this.cssSchemes[selectedScheme] = css;
        this.saveCSSSchemes();
        
        // 应用CSS
        this.applyCSSScheme(selectedScheme);
        
        alert('CSS样式已应用！');
    }

    // 重置CSS
    resetCSS() {
        if (confirm('确定重置为默认样式吗？')) {
            this.applyCSSScheme('default');
            this.loadCSSToEditor('default');
            
            const schemeSelect = document.getElementById('cssSchemeSelect');
            if (schemeSelect) {
                schemeSelect.value = 'default';
            }
            
            alert('已重置为默认样式！');
        }
    }

    // 预览背景
    previewBackground() {
        const urlInput = document.getElementById('backgroundUrlInput');
        const modeSelect = document.getElementById('backgroundModeSelect');
        const opacityRange = document.getElementById('backgroundOpacityRange');
        
        if (urlInput && modeSelect && opacityRange) {
            const url = urlInput.value.trim();
            const mode = modeSelect.value;
            const opacity = opacityRange.value;
            
            if (url) {
                this.applyBackgroundImage(url, mode, opacity);
            }
        }
    }

    // 应用背景
    applyBackground() {
        const urlInput = document.getElementById('backgroundUrlInput');
        const modeSelect = document.getElementById('backgroundModeSelect');
        const opacityRange = document.getElementById('backgroundOpacityRange');
        
        if (urlInput && modeSelect && opacityRange) {
            const url = urlInput.value.trim();
            const mode = modeSelect.value;
            const opacity = opacityRange.value;
            
            if (url) {
                this.settings.background = { url, mode, opacity };
                this.saveSettings();
                this.applyBackgroundImage(url, mode, opacity);
                alert('背景已应用并保存！');
            } else {
                alert('请输入背景图片URL');
            }
        }
    }

    // 移除背景
    removeBackground() {
        const container = document.querySelector('.health-container');
        if (container) {
            container.style.backgroundImage = '';
            container.style.backgroundSize = '';
            container.style.backgroundRepeat = '';
            container.style.backgroundPosition = '';
            container.style.backgroundAttachment = '';
            
            const overlay = container.querySelector('.background-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
        
        this.settings.background = { url: '', mode: 'cover', opacity: 100 };
        this.saveSettings();
        
        const urlInput = document.getElementById('backgroundUrlInput');
        if (urlInput) urlInput.value = '';
        
        alert('背景已移除！');
    }

    // 应用背景图片
    applyBackgroundImage(url, mode, opacity) {
        const container = document.querySelector('.health-container');
        if (container) {
            container.style.backgroundImage = `url(${url})`;
            container.style.backgroundSize = mode;
            container.style.backgroundRepeat = mode === 'repeat' ? 'repeat' : 'no-repeat';
            container.style.backgroundPosition = 'center';
            container.style.backgroundAttachment = 'fixed';
            
            // 添加半透明遮罩
            const overlay = container.querySelector('.background-overlay');
            if (overlay) {
                overlay.remove();
            }
            
            const newOverlay = document.createElement('div');
            newOverlay.className = 'background-overlay';
            newOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, ${(100 - opacity) / 100});
                pointer-events: none;
                z-index: 1;
            `;
            container.appendChild(newOverlay);
        }
    }

    // 导出设置
    exportSettings() {
        const exportData = {
            settings: this.settings,
            cssSchemes: this.cssSchemes,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `health-page-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        alert('设置已导出！');
    }

    // 导入设置
    importSettings() {
        const fileInput = document.getElementById('importFileInput');
        const file = fileInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (importData.settings && importData.cssSchemes) {
                        if (confirm('确定导入设置吗？这将覆盖当前设置。')) {
                            this.settings = importData.settings;
                            this.cssSchemes = importData.cssSchemes;
                            
                            this.saveSettings();
                            this.saveCSSSchemes();
                            this.applyStoredSettings();
                            this.loadCSSSchemesList();
                            this.loadCSSToEditor(this.settings.activeScheme || 'default');
                            
                            alert('设置导入成功！');
                            this.closeSettingsModal();
                        }
                    } else {
                        alert('无效的设置文件格式！');
                    }
                } catch (error) {
                    alert('设置文件解析失败！');
                }
            };
            reader.readAsText(file);
        }
    }

    // 打开设置弹窗
    openSettingsModal() {
        // 加载当前设置到表单
        this.loadSettingsToForm();
        this.loadCSSSchemesList();
        this.loadCSSToEditor(this.settings.activeScheme || 'default');
        
        const modal = document.getElementById('pageSettingsModal');
        if (modal) modal.classList.add('active');
    }

    // 关闭设置弹窗
    closeSettingsModal() {
        const modal = document.getElementById('pageSettingsModal');
        if (modal) modal.classList.remove('active');
    }

    // 加载设置到表单
    loadSettingsToForm() {
        // 背景设置
        const urlInput = document.getElementById('backgroundUrlInput');
        const modeSelect = document.getElementById('backgroundModeSelect');
        const opacityRange = document.getElementById('backgroundOpacityRange');
        const opacityValue = document.getElementById('backgroundOpacityValue');
        
        if (urlInput) urlInput.value = this.settings.background.url || '';
        if (modeSelect) modeSelect.value = this.settings.background.mode || 'cover';
        if (opacityRange) {
            opacityRange.value = this.settings.background.opacity || 100;
            if (opacityValue) opacityValue.textContent = (this.settings.background.opacity || 100) + '%';
        }
    }
}

// 全局函数
function changeSkincareMonth(delta) {
    if (window.healthPage) {
        window.healthPage.changeSkincareMonth(delta);
    }
}

function openSkincareTypeModal() {
    if (window.healthPage) {
        window.healthPage.openSkincareTypeModal();
    }
}

function openSkinStatusTypeModal() {
    if (window.healthPage) {
        window.healthPage.openSkinStatusTypeModal();
    }
}

function closeSkincareTypeModal() {
    if (window.healthPage) {
        window.healthPage.closeSkincareTypeModal();
    }
}

function closeSkinStatusTypeModal() {
    if (window.healthPage) {
        window.healthPage.closeSkinStatusTypeModal();
    }
}

function closeSkincareSelectModal() {
    if (window.healthPage) {
        window.healthPage.closeSkincareSelectModal();
    }
}

function addSkincareType() {
    if (window.healthPage) {
        window.healthPage.addSkincareType();
    }
}

function addSkinStatusType() {
    if (window.healthPage) {
        window.healthPage.addSkinStatusType();
    }
}

function deleteSkincareType(typeId) {
    if (window.healthPage) {
        window.healthPage.deleteSkincareType(typeId);
    }
}

function deleteSkinStatusType(typeId) {
    if (window.healthPage) {
        window.healthPage.deleteSkinStatusType(typeId);
    }
}

function clearSkincareRecord() {
    if (window.healthPage) {
        window.healthPage.clearSkincareRecord();
    }
}

// 睡眠相关全局函数
function saveSleepRecord() {
    if (window.healthPage) {
        window.healthPage.saveSleepRecord();
    }
}

function changeSleepMonth(delta) {
    if (window.healthPage) {
        window.healthPage.changeSleepMonth(delta);
    }
}

function closeSleepEditModal() {
    if (window.healthPage) {
        window.healthPage.closeSleepEditModal();
    }
}

function saveEditedSleepRecord() {
    if (window.healthPage) {
        window.healthPage.saveEditedSleepRecord();
    }
}

function deleteSelectedSleepRecord() {
    if (window.healthPage) {
        window.healthPage.deleteSelectedSleepRecord();
    }
}

// 生理期相关全局函数
function changePeriodMonth(delta) {
    if (window.healthPage) {
        window.healthPage.changePeriodMonth(delta);
    }
}

function openPeriodSettingsModal() {
    if (window.healthPage) {
        window.healthPage.openPeriodSettingsModal();
    }
}

function closePeriodSettingsModal() {
    if (window.healthPage) {
        window.healthPage.closePeriodSettingsModal();
    }
}

function closePeriodSelectModal() {
    if (window.healthPage) {
        window.healthPage.closePeriodSelectModal();
    }
}

function startPeriod() {
    if (window.healthPage) {
        window.healthPage.startPeriod();
    }
}

function endPeriod() {
    if (window.healthPage) {
        window.healthPage.endPeriod();
    }
}

function clearPeriodRecord() {
    if (window.healthPage) {
        window.healthPage.clearPeriodRecord();
    }
}

function savePeriodSettings() {
    if (window.healthPage) {
        window.healthPage.savePeriodSettings();
    }
}

function resetPeriodColors() {
    if (window.healthPage) {
        window.healthPage.resetPeriodColors();
    }
}

function setPeriodPhase(phase) {
    if (window.healthPage) {
        window.healthPage.setPeriodPhase(phase);
    }
}

// 运动记录相关全局函数
function changeExerciseWeek(delta) {
    if (window.healthPage) {
        window.healthPage.changeExerciseWeek(delta);
    }
}

function openExerciseModal(dayName) {
    if (window.healthPage) {
        window.healthPage.openExerciseModal(dayName);
    }
}

function closeExerciseModal() {
    if (window.healthPage) {
        window.healthPage.closeExerciseModal();
    }
}

function toggleExerciseInput() {
    if (window.healthPage) {
        window.healthPage.toggleExerciseInput();
    }
}

function saveExerciseRecord() {
    if (window.healthPage) {
        window.healthPage.saveExerciseRecord();
    }
}

function clearExerciseRecord() {
    if (window.healthPage) {
        window.healthPage.clearExerciseRecord();
    }
}

// 排便记录相关全局函数
function changeBowelMonth(delta) {
    if (window.healthPage) {
        window.healthPage.changeBowelMonth(delta);
    }
}

function openBowelSettingsModal() {
    if (window.healthPage) {
        window.healthPage.openBowelSettingsModal();
    }
}

function closeBowelSettingsModal() {
    if (window.healthPage) {
        window.healthPage.closeBowelSettingsModal();
    }
}

function previewBowelIcon() {
    if (window.healthPage) {
        window.healthPage.previewBowelIcon();
    }
}

function selectBowelIcon(icon) {
    if (window.healthPage) {
        window.healthPage.selectBowelIcon(icon);
    }
}

function saveBowelSettings() {
    if (window.healthPage) {
        window.healthPage.saveBowelSettings();
    }
}

function resetBowelIcon() {
    if (window.healthPage) {
        window.healthPage.resetBowelIcon();
    }
}

// 餐饮记录相关全局函数
function changeMealDate(delta) {
    if (window.healthPage) {
        window.healthPage.changeMealDate(delta);
    }
}

function openMealDetailModal(mealType) {
    if (window.healthPage) {
        window.healthPage.openMealDetailModal(mealType);
    }
}

function closeMealDetailModal() {
    if (window.healthPage) {
        window.healthPage.closeMealDetailModal();
    }
}

function previewMealImage() {
    if (window.healthPage) {
        window.healthPage.previewMealImage();
    }
}

function saveMealDetail() {
    if (window.healthPage) {
        window.healthPage.saveMealDetail();
    }
}

function clearMealDetail() {
    if (window.healthPage) {
        window.healthPage.clearMealDetail();
    }
}

function openMealAnalysisModal() {
    if (window.healthPage) {
        window.healthPage.openMealAnalysisModal();
    }
}

function closeMealAnalysisModal() {
    if (window.healthPage) {
        window.healthPage.closeMealAnalysisModal();
    }
}

function closeDishDetailModal() {
    if (window.healthPage) {
        window.healthPage.closeDishDetailModal();
    }
}

// 其他餐饮条目相关全局函数
function addOtherMealItem() {
    if (window.healthPage) {
        window.healthPage.addOtherMealItem();
    }
}

function removeOtherMealItem(itemId) {
    if (window.healthPage) {
        window.healthPage.removeOtherMealItem(itemId);
    }
}

function saveOtherItemDescription(itemId, description) {
    if (window.healthPage) {
        window.healthPage.saveOtherItemDescription(itemId, description);
    }
}

function openOtherItemDetailModal(itemId) {
    if (window.healthPage) {
        window.healthPage.openOtherItemDetailModal(itemId);
    }
}

// 页面设置相关全局函数
function openSettingsModal() {
    if (window.pageSettings) {
        window.pageSettings.openSettingsModal();
    }
}

function closeSettingsModal() {
    if (window.pageSettings) {
        window.pageSettings.closeSettingsModal();
    }
}

function previewBackground() {
    if (window.pageSettings) {
        window.pageSettings.previewBackground();
    }
}

function applyBackground() {
    if (window.pageSettings) {
        window.pageSettings.applyBackground();
    }
}

function removeBackground() {
    if (window.pageSettings) {
        window.pageSettings.removeBackground();
    }
}

function previewTheme() {
    // Deprecated - use CSS editor instead
}

function applyTheme() {
    // Deprecated - use CSS editor instead
}

function saveCustomTheme() {
    // Deprecated - use CSS editor instead
}

function saveCurrentTheme() {
    // Deprecated - use CSS editor instead
}

function resetTheme() {
    if (window.pageSettings) {
        window.pageSettings.resetCSS();
    }
}

function applyStoredTheme(themeKey) {
    // Deprecated - use CSS editor instead
}

function deleteStoredTheme(themeKey) {
    // Deprecated - use CSS editor instead
}

function switchCSSScheme() {
    if (window.pageSettings) {
        window.pageSettings.switchCSSScheme();
    }
}

function saveCSSScheme() {
    if (window.pageSettings) {
        window.pageSettings.saveCSSScheme();
    }
}

function deleteCSSScheme() {
    if (window.pageSettings) {
        window.pageSettings.deleteCSSScheme();
    }
}

function applyCurrentCSS() {
    if (window.pageSettings) {
        window.pageSettings.applyCurrentCSS();
    }
}

function resetCSS() {
    if (window.pageSettings) {
        window.pageSettings.resetCSS();
    }
}

function exportSettings() {
    if (window.pageSettings) {
        window.pageSettings.exportSettings();
    }
}

function importSettings() {
    if (window.pageSettings) {
        window.pageSettings.importSettings();
    }
}

function navigateToPage(page) {
    // 页面导航功能
    switch(page) {
        case 'plan':
            window.location.href = 'health.html';
            break;
        case 'health':
            // 已经在健康页面，不需要跳转
            break;
        case 'diary':
            window.location.href = 'health.html#diary';
            break;
        case 'mood':
            window.location.href = 'mood.html';
            break;
        case 'monthly':
            window.location.href = 'monthly.html';
            break;
        default:
            console.log('未知页面:', page);
    }
}

function goBack() {
    window.location.href = 'health.html';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.healthPage = new HealthPage();
    window.pageSettings = new PageSettings();
    
    // 绑定星级评分事件
    setTimeout(() => {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                if (window.healthPage) {
                    window.healthPage.selectedMealRating = index + 1;
                    window.healthPage.updateStarRating();
                }
            });
        });
    }, 500);
});
