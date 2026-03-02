// 健康页面功能
class HealthPage {
    constructor() {
        this.currentDate = new Date();
        this.sleepCalendarDate = new Date(); // 睡眠日历的当前查看日期
        this.skincareCalendarDate = new Date(); // 护肤日历的当前查看日期
        this.selectedSleepDate = null; // 当前选中编辑的睡眠日期
        this.selectedSkincareDate = null; // 当前选中编辑的护肤日期
        this.selectedSkincareType = 'skincare'; // 当前选择的护肤类型（skincare或skinStatus）
        this.healthData = this.loadHealthData();
        
        this.init();
    }

    init() {
        // 先初始化护肤类型数据
        this.initializeSkincareTypes();
        
        // 然后渲染日历
        this.renderSleepCalendar();
        this.renderSkincareCalendars();
        this.generateBowelCalendar();
        
        // 最后绑定事件和加载数据
        this.bindEvents();
        this.loadTodayData();
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

    // 生成日历
    generateCalendars() {
        this.generateBowelCalendar();
        this.renderSleepCalendar();
        this.renderSkincareCalendars();
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
        const year = this.skincareCalendarDate.getFullYear();
        const month = this.skincareCalendarDate.getMonth() + 1;
        monthDisplay.textContent = `${year}年${month}月护肤记录`;
    }

    // 渲染护肤记录日历
    renderSkincareCalendar() {
        const calendar = document.getElementById('skincareCalendar');
        this.renderCalendarGrid(calendar, 'skincare');
    }

    // 渲染皮肤状态日历
    renderSkinStatusCalendar() {
        const calendar = document.getElementById('skinStatusCalendar');
        this.renderCalendarGrid(calendar, 'skinStatus');
    }

    // 通用日历网格渲染
    renderCalendarGrid(calendar, dataType) {
        const year = this.skincareCalendarDate.getFullYear();
        const month = this.skincareCalendarDate.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        
        calendar.innerHTML = '';
        
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

    // 生成睡眠日历
    renderSleepCalendar() {
        const calendar = document.getElementById('sleepCalendar');
        const monthDisplay = document.getElementById('sleepCalendarMonth');
        
        const year = this.sleepCalendarDate.getFullYear();
        const month = this.sleepCalendarDate.getMonth();
        
        // 更新月份显示
        monthDisplay.textContent = `${year}年${month + 1}月睡眠记录`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1; // 周一为第一天
        
        calendar.innerHTML = '';
        
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

    // 生成排便日历
    generateBowelCalendar() {
        const calendar = document.getElementById('bowelCalendar');
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        calendar.innerHTML = '';
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (this.healthData.bowel[dateKey]) {
                dayElement.classList.add('recorded');
            }
            
            dayElement.addEventListener('click', () => {
                this.toggleBowelRecord(dateKey, dayElement);
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
        palette.innerHTML = '';
        
        this.healthData.colorPalette.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'palette-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', () => {
                if (paletteId === 'skincarePalette') {
                    document.getElementById('newSkincareTypeColor').value = color;
                } else {
                    document.getElementById('newSkinStatusTypeColor').value = color;
                }
            });
            palette.appendChild(colorDiv);
        });
    }

    // 计算睡眠时长
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
        const wakeDate = new Date(today);
        
        // 如果起床时间早于睡觉时间，说明是第二天起床
        if (wakeHour < sleepHour || (wakeHour === sleepHour && wakeMinute < sleepMinute)) {
            // 不需要调整日期，因为我们记录的是起床那天的睡眠
        }
        
        const dateKey = wakeDate.toISOString().split('T')[0];
        
        // 保存睡眠记录
        this.healthData.sleep[dateKey] = {
            sleepTime: `${String(sleepHour).padStart(2, '0')}:${String(sleepMinute).padStart(2, '0')}`,
            wakeTime: `${String(wakeHour).padStart(2, '0')}:${String(wakeMinute).padStart(2, '0')}`,
            duration: duration,
            date: dateKey
        };
        
        this.saveHealthData();
        this.renderSleepCalendar();
        
        // 清空输入框
        document.getElementById('sleepHour').value = '';
        document.getElementById('sleepMinute').value = '';
        document.getElementById('wakeHour').value = '';
        document.getElementById('wakeMinute').value = '';
        
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
        document.getElementById('sleepEditTitle').textContent = '编辑睡眠记录';
        document.getElementById('sleepEditDate').textContent = `${year}年${month}月${day}日`;
        
        // 检查是否已有记录
        const existingRecord = this.healthData.sleep[dateKey];
        const deleteBtn = document.getElementById('deleteSleepBtn');
        
        if (existingRecord) {
            // 填充现有数据
            const sleepTime = existingRecord.sleepTime.split(':');
            const wakeTime = existingRecord.wakeTime.split(':');
            
            document.getElementById('editSleepHour').value = parseInt(sleepTime[0]);
            document.getElementById('editSleepMinute').value = parseInt(sleepTime[1]);
            document.getElementById('editWakeHour').value = parseInt(wakeTime[0]);
            document.getElementById('editWakeMinute').value = parseInt(wakeTime[1]);
            
            deleteBtn.style.display = 'block';
        } else {
            // 清空输入框
            document.getElementById('editSleepHour').value = '';
            document.getElementById('editSleepMinute').value = '';
            document.getElementById('editWakeHour').value = '';
            document.getElementById('editWakeMinute').value = '';
            
            deleteBtn.style.display = 'none';
        }
        
        // 显示弹窗
        document.getElementById('sleepEditModal').classList.add('active');
    }

    // 关闭睡眠编辑弹窗
    closeSleepEditModal() {
        document.getElementById('sleepEditModal').classList.remove('active');
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

    // 添加护肤类型
    addSkincareType() {
        const name = document.getElementById('newSkincareTypeName').value.trim();
        const color = document.getElementById('newSkincareTypeColor').value;
        
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
        document.getElementById('newSkincareTypeName').value = '';
        document.getElementById('newSkincareTypeColor').value = '#c9a87c';
    }

    // 添加皮肤状态类型
    addSkinStatusType() {
        const name = document.getElementById('newSkinStatusTypeName').value.trim();
        const color = document.getElementById('newSkinStatusTypeColor').value;
        
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
        document.getElementById('newSkinStatusTypeName').value = '';
        document.getElementById('newSkinStatusTypeColor').value = '#c9a87c';
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

    // 打开护肤记录选择弹窗
    openSkincareSelectModal(dateKey, day, month, year, dataType) {
        this.selectedSkincareDate = dateKey;
        this.selectedSkincareType = dataType;
        
        const title = dataType === 'skincare' ? '选择护肤类型' : '选择皮肤状态';
        document.getElementById('skincareSelectTitle').textContent = title;
        document.getElementById('skincareSelectDate').textContent = `${year}年${month}月${day}日`;
        
        // 渲染类型选项
        this.renderTypeOptions(dataType);
        
        // 检查是否已有记录
        const existingRecord = this.healthData[dataType][dateKey];
        const clearBtn = document.getElementById('clearSkincareBtn');
        clearBtn.style.display = existingRecord ? 'block' : 'none';
        
        document.getElementById('skincareSelectModal').classList.add('active');
    }

    // 渲染类型选项
    renderTypeOptions(dataType) {
        const options = document.getElementById('skincareTypeOptions');
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

    // 清除护肤记录
    clearSkincareRecord() {
        if (confirm('确定清除这条记录吗？')) {
            delete this.healthData[this.selectedSkincareType][this.selectedSkincareDate];
            this.saveHealthData();
            this.renderSkincareCalendars();
            this.closeSkincareSelectModal();
        }
    }

    // 关闭弹窗
    closeSkincareTypeModal() {
        document.getElementById('skincareTypeModal').classList.remove('active');
    }

    closeSkinStatusTypeModal() {
        document.getElementById('skinStatusTypeModal').classList.remove('active');
    }

    closeSkincareSelectModal() {
        document.getElementById('skincareSelectModal').classList.remove('active');
        this.selectedSkincareDate = null;
        this.selectedSkincareType = null;
    }

    // 切换排便记录
    toggleBowelRecord(dateKey, element) {
        if (this.healthData.bowel[dateKey]) {
            delete this.healthData.bowel[dateKey];
            element.classList.remove('recorded');
        } else {
            this.healthData.bowel[dateKey] = {
                time: new Date().toTimeString().slice(0, 5),
                type: 'normal'
            };
            element.classList.add('recorded');
        }
        this.saveHealthData();
    }

    // 绑定事件
    bindEvents() {
        // 生理期按钮
        const periodButtons = document.querySelectorAll('.period-btn');
        periodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handlePeriodButton(btn);
            });
        });

        // 运动按钮
        const exerciseBtn = document.querySelector('.exercise-btn');
        if (exerciseBtn) {
            exerciseBtn.addEventListener('click', () => {
                this.handleExerciseButton();
            });
        }

        // 餐饮输入
        const mealInputs = document.querySelectorAll('.meal-item input');
        mealInputs.forEach((input, index) => {
            const mealTypes = ['breakfast', 'lunch', 'dinner', 'other'];
            input.addEventListener('change', () => {
                this.saveMealData(mealTypes[index], input.value);
            });
        });

        // 自定义运动输入
        const customExerciseInput = document.querySelector('.exercise-input input');
        if (customExerciseInput) {
            customExerciseInput.addEventListener('change', () => {
                this.saveExerciseData(customExerciseInput.value);
            });
        }
    }

    // 处理生理期按钮
    handlePeriodButton(button) {
        const buttons = document.querySelectorAll('.period-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const today = new Date().toISOString().split('T')[0];
        const action = button.textContent;
        
        this.healthData.period[today] = {
            action: action,
            timestamp: new Date().toISOString()
        };
        
        this.saveHealthData();
    }

    // 处理运动按钮
    handleExerciseButton() {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.healthData.exercise[today]) {
            this.healthData.exercise[today] = {};
        }
        
        // 模拟步数记录
        const steps = Math.floor(Math.random() * 5000) + 3000;
        this.healthData.exercise[today].steps = steps;
        
        this.saveHealthData();
        this.updateStepsDisplay(steps);
    }

    // 更新步数显示
    updateStepsDisplay(steps) {
        const stepsSection = document.querySelector('.steps-section');
        stepsSection.innerHTML = `<label>步数: ${steps}</label>`;
    }

    // 保存餐饮数据
    saveMealData(mealType, value) {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.healthData.meals[today]) {
            this.healthData.meals[today] = {};
        }
        
        this.healthData.meals[today][mealType] = value;
        this.saveHealthData();
    }

    // 保存运动数据
    saveExerciseData(value) {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.healthData.exercise[today]) {
            this.healthData.exercise[today] = {};
        }
        
        this.healthData.exercise[today].custom = value;
        this.saveHealthData();
    }

    // 加载今日数据
    loadTodayData() {
        const today = new Date().toISOString().split('T')[0];
        
        // 加载餐饮数据
        if (this.healthData.meals[today]) {
            const mealInputs = document.querySelectorAll('.meal-item input');
            const mealTypes = ['breakfast', 'lunch', 'dinner', 'other'];
            
            mealInputs.forEach((input, index) => {
                const mealType = mealTypes[index];
                if (this.healthData.meals[today][mealType]) {
                    input.value = this.healthData.meals[today][mealType];
                }
            });
        }
        
        // 加载运动数据
        if (this.healthData.exercise[today]) {
            if (this.healthData.exercise[today].steps) {
                this.updateStepsDisplay(this.healthData.exercise[today].steps);
            }
            
            if (this.healthData.exercise[today].custom) {
                const customInput = document.querySelector('.exercise-input input');
                if (customInput) {
                    customInput.value = this.healthData.exercise[today].custom;
                }
            }
        }
        
        // 加载生理期状态
        if (this.healthData.period[today]) {
            const action = this.healthData.period[today].action;
            const buttons = document.querySelectorAll('.period-btn');
            buttons.forEach(btn => {
                if (btn.textContent === action) {
                    btn.classList.add('active');
                }
            });
        }
    }

    // 获取健康统计
    getHealthStats() {
        const stats = {
            sleepDays: Object.keys(this.healthData.sleep).length,
            skincareDays: Object.keys(this.healthData.skincare).length,
            exerciseDays: Object.keys(this.healthData.exercise).length,
            bowelDays: Object.keys(this.healthData.bowel).length,
            mealDays: Object.keys(this.healthData.meals).length
        };
        
        return stats;
    }
}

// 全局函数供HTML调用
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

// 护肤记录相关函数
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

// 返回功能
function goBack() {
    // 返回到健康app
    window.location.href = 'health.html';
}

// 导航功能
function navigateToPage(page) {
    switch(page) {
        case 'plan':
            window.location.href = 'health.html';
            break;
        case 'health':
            // 已经在健康记录页面
            break;
        case 'diary':
            window.location.href = 'health.html#diary';
            break;
        case 'mood':
            window.location.href = 'health.html#mood';
            break;
        case 'monthly':
        case 'share':
            window.location.href = 'health.html#share';
            break;
        default:
            console.log('未知页面:', page);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const healthPage = new HealthPage();
    
    // 将实例挂载到全局，方便调试
    window.healthPage = healthPage;
});

// 导出功能（如果需要在其他文件中使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealthPage;
}
