// 健康管理应用
class HealthApp {
    constructor() {
        this.habitDate = new Date();
        this.calendarDate = new Date();
        this.weekDate = new Date();
        this.moodWeekDate = new Date();
        this.statsDate = new Date();
        this.activityDate = new Date();
        this.habitTrackers = this.loadHabitTrackers();
        this.activities = this.loadActivities();
        this.calendarCovers = this.loadCalendarCovers();
        this.accountingRecords = this.loadAccountingRecords();
        this.accountingCategories = this.loadAccountingCategories();
        this.moodRecords = this.loadMoodRecords();
        this.moodSchemes = this.loadMoodSchemes();
        this.currentMoodScheme = this.loadCurrentMoodScheme();
        this.savedColors = this.loadSavedColors();
        this.cssSchemes = this.loadCssSchemes();
        this.currentCssScheme = this.loadCurrentCssScheme();
        // CSS方案版本检查 - 如果版本过旧则强制更新默认方案
        const cssVer = localStorage.getItem('health-css-scheme-version');
        if (cssVer !== '3') {
            localStorage.removeItem('health-plan-css-schemes');
            localStorage.removeItem('health-plan-current-css-scheme');
            this.cssSchemes = this.loadCssSchemes();
            this.currentCssScheme = this.loadCurrentCssScheme();
            this.saveCssSchemes();
            localStorage.setItem('health-css-scheme-version', '3');
        }
        this.backgroundSettings = this.loadBackgroundSettings();
        this.fontSettings = this.loadFontSettings();
        this.selectedDate = null;
        this.selectedTodoDate = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.renderHabitTracker();
        this.renderStatistics();
        this.renderCalendar();
        this.renderWeeklyTodo();
        this.renderAccountingList();
        this.renderMoodCalendar();
        this.renderActivityList();
        this.loadAvatar();
        this.applyStoredSettings();
        this.handleInitialRoute();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const healthView = document.getElementById('health-view-container');
        const diaryContainer = document.getElementById('diary-container');
        const coupleSpaceContainer = document.getElementById('couple-space-container');
        const shareContainer = document.getElementById('share-container');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.getAttribute('data-page');
                
                // 如果点击的是健康导航项，跳转到健康页面
                if (page === 'health') {
                    window.location.href = 'health-page.html';
                    return;
                }
                
                // 更新导航状态
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                if (page === 'diary') {
                    if (healthView) healthView.style.display = 'none';
                    if (coupleSpaceContainer) coupleSpaceContainer.style.display = 'none';
                    if (shareContainer) shareContainer.style.display = 'none';
                    if (diaryContainer) diaryContainer.classList.add('active');
                    document.getElementById('mainSettingsBtn').style.display = 'none';
                    document.getElementById('diarySettingsBtn').style.display = 'flex';
                } else if (page === 'mood') {
                    if (healthView) healthView.style.display = 'none';
                    if (diaryContainer) diaryContainer.classList.remove('active');
                    if (shareContainer) shareContainer.style.display = 'none';
                    if (coupleSpaceContainer) coupleSpaceContainer.style.display = 'flex';
                    document.getElementById('mainSettingsBtn').style.display = 'none';
                    document.getElementById('diarySettingsBtn').style.display = 'none';
                } else if (page === 'share') {
                    if (healthView) healthView.style.display = 'none';
                    if (diaryContainer) diaryContainer.classList.remove('active');
                    if (coupleSpaceContainer) coupleSpaceContainer.style.display = 'none';
                    if (shareContainer) shareContainer.style.display = 'flex';
                    document.getElementById('mainSettingsBtn').style.display = 'none';
                    document.getElementById('diarySettingsBtn').style.display = 'none';
                    initSharePage();
                } else {
                    if (healthView) healthView.style.display = 'flex';
                    if (diaryContainer) diaryContainer.classList.remove('active');
                    if (coupleSpaceContainer) coupleSpaceContainer.style.display = 'none';
                    if (shareContainer) shareContainer.style.display = 'none';
                    document.getElementById('mainSettingsBtn').style.display = 'flex';
                    document.getElementById('diarySettingsBtn').style.display = 'none';
                }
            });
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'diary') {
            const diaryNav = document.querySelector('.nav-item[data-page="diary"]');
            if (diaryNav) {
                diaryNav.click();
            }
        } else if (hash === 'mood') {
            const moodNav = document.querySelector('.nav-item[data-page="mood"]');
            if (moodNav) {
                moodNav.click();
            }
        } else if (hash === 'share') {
            const shareNav = document.querySelector('.nav-item[data-page="share"]');
            if (shareNav) {
                shareNav.click();
            }
        }
    }

    loadAvatar() {
        const avatar = localStorage.getItem('health-avatar');
        if (avatar) {
            const display = document.getElementById('avatarDisplay');
            if (avatar.startsWith('http') || avatar.startsWith('data:')) {
                display.innerHTML = `<img src="${avatar}" alt="头像">`;
            } else {
                display.textContent = avatar;
            }
        }
    }

    // 习惯追踪器
    renderHabitTracker() {
        const habitMonth = document.getElementById('habitMonth');
        const habitGrid = document.getElementById('habitGrid');
        const habitProgress = document.getElementById('habitProgress');
        
        const year = this.habitDate.getFullYear();
        const month = this.habitDate.getMonth() + 1;
        habitMonth.textContent = `${year}年${month}月`;

        const daysInMonth = new Date(year, month, 0).getDate();
        
        habitGrid.innerHTML = '';
        
        let completed = 0;
        let total = 0;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'habit-cell';
            cell.textContent = day;
            
            const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (this.habits[dateKey] !== undefined) {
                total++;
                if (this.habits[dateKey]) {
                    cell.classList.add('completed');
                    completed++;
                } else {
                    cell.classList.add('incomplete');
                }
            }
            
            cell.addEventListener('click', () => this.toggleHabit(dateKey, cell));
            habitGrid.appendChild(cell);
        }

        // 更新进度条
        const progress = total > 0 ? (completed / total) * 100 : 0;
        habitProgress.style.width = progress + '%';

        document.getElementById('prevHabitMonth').onclick = () => this.changeHabitMonth(-1);
        document.getElementById('nextHabitMonth').onclick = () => this.changeHabitMonth(1);
    }

    toggleHabit(dateKey, element) {
        if (!this.habits[dateKey]) {
            this.habits[dateKey] = true;
            element.classList.add('completed');
            element.classList.remove('incomplete');
        } else if (this.habits[dateKey] === true) {
            this.habits[dateKey] = false;
            element.classList.add('incomplete');
            element.classList.remove('completed');
        } else {
            delete this.habits[dateKey];
            element.classList.remove('completed', 'incomplete');
        }
        
        this.saveHabits();
        this.renderStatistics();
        this.renderHabitTracker();
    }

    changeHabitMonth(delta) {
        this.habitDate.setMonth(this.habitDate.getMonth() + delta);
        this.renderHabitTracker();
        this.renderStatistics();
    }

    // 习惯追踪器
    renderHabitTracker() {
        const habitMonth = document.getElementById('habitMonth');
        const habitDaysHeader = document.getElementById('habitDaysHeader');
        const habitList = document.getElementById('habitList');
        
        const year = this.habitDate.getFullYear();
        const month = this.habitDate.getMonth() + 1;
        habitMonth.textContent = `${year}年${month}月`;

        const daysInMonth = new Date(year, month, 0).getDate();
        
        // 渲染日期标注行
        habitDaysHeader.innerHTML = '';
        for (let day = 1; day <= daysInMonth; day++) {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.textContent = day;
            habitDaysHeader.appendChild(dayLabel);
        }
        
        // 渲染习惯列表
        habitList.innerHTML = '';
        
        // 过滤出应该显示的习惯（创建月份 <= 当前查看月份）
        const currentYearMonth = `${year}-${String(month).padStart(2, '0')}`;
        const visibleHabits = this.habitTrackers.filter(habit => {
            // 如果没有createdAt字段（旧数据），默认显示
            if (!habit.createdAt) return true;
            // 比较年月字符串
            return habit.createdAt <= currentYearMonth;
        });
        
        if (visibleHabits.length === 0) {
            habitList.innerHTML = '<div style="text-align: center; color: #a89580; padding: 30px;">点击右上角 + 添加习惯</div>';
        } else {
            visibleHabits.forEach((habit) => {
                // 找到原始索引
                const habitIndex = this.habitTrackers.indexOf(habit);
                const habitRow = document.createElement('div');
                habitRow.className = 'habit-row';
                
                const habitName = document.createElement('div');
                habitName.className = 'habit-name';
                habitName.textContent = habit.name;
                habitName.title = habit.name;
                
                const habitDays = document.createElement('div');
                habitDays.className = 'habit-days';
                
                for (let day = 1; day <= daysInMonth; day++) {
                    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayCell = document.createElement('div');
                    dayCell.className = 'habit-day-cell';
                    
                    const status = habit.records[dateKey];
                    if (status === 'completed') {
                        dayCell.classList.add('completed');
                    } else if (status === 'incomplete') {
                        dayCell.classList.add('incomplete');
                    }
                    
                    dayCell.addEventListener('click', () => this.toggleHabitDay(habitIndex, dateKey));
                    habitDays.appendChild(dayCell);
                }
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'habit-delete';
                deleteBtn.textContent = '删除';
                deleteBtn.onclick = () => this.deleteHabit(habitIndex);
                
                habitRow.appendChild(habitName);
                habitRow.appendChild(habitDays);
                habitRow.appendChild(deleteBtn);
                habitList.appendChild(habitRow);
            });
        }

        document.getElementById('prevHabitMonth').onclick = () => this.changeHabitMonth(-1);
        document.getElementById('nextHabitMonth').onclick = () => this.changeHabitMonth(1);
    }

    toggleHabitDay(habitIndex, dateKey) {
        const habit = this.habitTrackers[habitIndex];
        const currentStatus = habit.records[dateKey];
        
        if (!currentStatus) {
            // 第一次点击：打卡成功
            habit.records[dateKey] = 'completed';
        } else if (currentStatus === 'completed') {
            // 第二次点击：今日未做
            habit.records[dateKey] = 'incomplete';
        } else {
            // 第三次点击：取消打卡
            delete habit.records[dateKey];
        }
        
        this.saveHabitTrackers();
        this.renderHabitTracker();
        this.renderStatistics();
    }

    deleteHabit(habitIndex) {
        if (confirm('确定删除这个习惯吗？')) {
            this.habitTrackers.splice(habitIndex, 1);
            this.saveHabitTrackers();
            this.renderHabitTracker();
            this.renderStatistics();
        }
    }

    changeHabitMonth(delta) {
        this.habitDate.setMonth(this.habitDate.getMonth() + delta);
        this.renderHabitTracker();
        this.renderStatistics();
    }

    // 统计看板
    renderStatistics() {
        const statsContent = document.getElementById('statsContent');
        const statsMonth = document.getElementById('statsMonth');
        const year = this.statsDate.getFullYear();
        const month = this.statsDate.getMonth() + 1;
        
        // 更新月份显示
        statsMonth.textContent = `${year}年${month}月`;
        
        // 获取该月的所有待办数据
        const todos = JSON.parse(localStorage.getItem('todos') || '{}');
        let completed = 0;
        let incomplete = 0;
        let total = 0;
        
        // 统计该月的待办事项
        Object.keys(todos).forEach(dateKey => {
            if (dateKey.startsWith(`${year}-${String(month).padStart(2, '0')}-`)) {
                const dayTodos = todos[dateKey] || [];
                dayTodos.forEach(todo => {
                    total++;
                    if (todo.completed) {
                        completed++;
                    } else {
                        incomplete++;
                    }
                });
            }
        });
        
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        statsContent.innerHTML = `
            <svg class="progress-circle" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f5ede0" stroke-width="8"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#c9a87c" stroke-width="8"
                    stroke-dasharray="${completionRate * 2.51} 251.2"
                    transform="rotate(-90 50 50)"/>
                <text x="50" y="55" text-anchor="middle" font-size="16" fill="#5a4a3a">${completionRate}%</text>
            </svg>
            <div class="stat-row">
                <span class="stat-label">完成率</span>
                <span class="stat-value">${completionRate}%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">已完成</span>
                <span class="stat-value" style="color: #6b9b6b;">${completed}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">未完成</span>
                <span class="stat-value" style="color: #b87c7c;">${incomplete}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">总量</span>
                <span class="stat-value">${total}</span>
            </div>
        `;
        
        // 设置月份导航按钮
        document.getElementById('prevStatsMonth').onclick = () => this.changeStatsMonth(-1);
        document.getElementById('nextStatsMonth').onclick = () => this.changeStatsMonth(1);
    }

    // 切换统计月份
    changeStatsMonth(delta) {
        this.statsDate.setMonth(this.statsDate.getMonth() + delta);
        this.renderStatistics();
    }

    // 日历
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const calendarMonth = document.getElementById('calendarMonth');
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();
        
        // 动态注入日记回顾按钮（确保不受缓存影响）
        if (!document.getElementById('diaryReviewBtnDynamic')) {
            const calSection = document.querySelector('.calendar-section');
            if (calSection) {
                const h3 = calSection.querySelector('h3');
                if (h3 && !h3.parentElement.querySelector('.diary-review-btn')) {
                    const btn = document.createElement('button');
                    btn.id = 'diaryReviewBtnDynamic';
                    btn.className = 'diary-review-btn';
                    btn.onclick = openDiaryReview;
                    btn.title = '日记回顾';
                    btn.textContent = '📖 回顾';
                    btn.style.cssText = 'background:#fff0f5;border:1.5px solid #e8b4b8;border-radius:8px;padding:4px 12px;font-size:13px;cursor:pointer;color:#8b5e6b;';
                    h3.parentElement.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
                    h3.parentElement.appendChild(btn);
                }
            }
        }
        
        calendarMonth.textContent = `${year}年${month + 1}月`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const today = new Date();
        
        const todos = JSON.parse(localStorage.getItem('todos') || '{}');
        
        calendarGrid.innerHTML = '';
        
        // 上个月的日期
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = startDay - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell other-month';
            cell.textContent = daysInPrevMonth - i;
            calendarGrid.appendChild(cell);
        }
        
        // 当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell';
            cell.textContent = day;
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                cell.classList.add('today');
            }
            
            if (todos[dateKey] && todos[dateKey].length > 0) {
                cell.classList.add('has-todo');
            }
            
            // 检查是否有封面图
            if (this.calendarCovers[dateKey]) {
                cell.classList.add('has-cover');
                cell.style.backgroundImage = `url('${this.calendarCovers[dateKey]}')`;
            }
            
            // 检查是否有日记
            const diaries = JSON.parse(localStorage.getItem('health-diaries') || '{}');
            if (diaries[dateKey]) {
                cell.classList.add('has-diary');
            }
            
            // 双击事件
            cell.addEventListener('dblclick', () => {
                if (year === this.calendarDate.getFullYear() && month === this.calendarDate.getMonth()) {
                    this.openCalendarModal(dateKey, day);
                }
            });
            
            calendarGrid.appendChild(cell);
        }
        
        // 下个月的日期
        const totalCells = startDay + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remainingCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell other-month';
            cell.textContent = i;
            calendarGrid.appendChild(cell);
        }
        
        document.getElementById('prevCalMonth').onclick = () => this.changeCalendarMonth(-1);
        document.getElementById('nextCalMonth').onclick = () => this.changeCalendarMonth(1);
    }

    changeCalendarMonth(delta) {
        this.calendarDate.setMonth(this.calendarDate.getMonth() + delta);
        this.renderCalendar();
    }

    openCalendarModal(dateKey, day) {
        this.selectedDate = dateKey;
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth() + 1;
        document.getElementById('modalDateTitle').textContent = `${year}年${month}月${day}日`;
        document.getElementById('calendarModal').classList.add('active');
    }

    setCoverImage(imageUrl) {
        if (this.selectedDate && imageUrl) {
            this.calendarCovers[this.selectedDate] = imageUrl;
            this.saveCalendarCovers();
            this.renderCalendar();
        }
    }

    loadCalendarCovers() {
        return JSON.parse(localStorage.getItem('health-calendar-covers') || '{}');
    }

    saveCalendarCovers() {
        localStorage.setItem('health-calendar-covers', JSON.stringify(this.calendarCovers));
    }

    // 周待办清单（联动桌面TODO小组件）
    renderWeeklyTodo() {
        const weeklyTodo = document.getElementById('weeklyTodo');
        const weekDisplay = document.getElementById('weekDisplay');
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // 使用 this.weekDate 而不是当前日期
        const currentDay = this.weekDate.getDay();
        const monday = new Date(this.weekDate);
        monday.setDate(this.weekDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        
        // 计算周数和所属月份
        const { year, month, weekNumber } = this.calculateWeekInfo(monday);
        weekDisplay.textContent = `${year}年${month}月第${weekNumber}周`;
        
        weeklyTodo.innerHTML = '';
        
        const todos = JSON.parse(localStorage.getItem('todos') || '{}');
        const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
        
        // 第一行：周一到周四
        days.slice(0, 4).forEach((day, index) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + index);
            // 使用本地日期而不是UTC日期
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dayNum = String(date.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${dayNum}`;
            
            const dayCard = this.createDayCard(day, date, dateKey, todos);
            weeklyTodo.appendChild(dayCard);
        });
        
        // 第二行：周五到周日 + 代办计划
        days.slice(4, 7).forEach((day, index) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + index + 4);
            // 使用本地日期而不是UTC日期
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dayNum = String(date.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${dayNum}`;
            
            const dayCard = this.createDayCard(day, date, dateKey, todos);
            weeklyTodo.appendChild(dayCard);
        });
        
        // 代办计划格子
        const weeklyCard = document.createElement('div');
        weeklyCard.className = 'todo-day weekly-todo';
        
        const sortedWeeklyTodos = weeklyTodos.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });
        
        const weeklyTodoItems = sortedWeeklyTodos.map((todo, index) => 
            `<div class="todo-task ${todo.completed ? 'completed' : ''}" 
                  style="background-color: ${todo.color || '#f5ede0'}"
                  onclick="toggleWeeklyTodo(${index})"
                  oncontextmenu="event.preventDefault(); deleteWeeklyTodoInWeekly(${index})"
                  ontouchstart="startWeeklyLongPress(event, ${index})"
                  ontouchend="endLongPress()"
                  ontouchmove="cancelLongPress()">${todo.text}</div>`
        ).join('');
        
        weeklyCard.innerHTML = `
            <div class="todo-day-title">代办计划<br>本周</div>
            <div class="todo-list">
                ${weeklyTodoItems || '<div style="text-align: center; color: #d4c4a8; font-size: 9px; padding: 10px;">无计划</div>'}
            </div>
        `;
        
        weeklyCard.addEventListener('dblclick', () => {
            this.openWeeklyTodoModal();
        });
        
        weeklyTodo.appendChild(weeklyCard);
        
        // 设置周导航按钮事件
        document.getElementById('prevWeek').onclick = () => this.changeWeek(-1);
        document.getElementById('nextWeek').onclick = () => this.changeWeek(1);
    }

    // 计算周信息（年、月、周数）
    calculateWeekInfo(monday) {
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        // 计算这一周在哪个月的天数更多
        const mondayMonth = monday.getMonth() + 1;
        const sundayMonth = sunday.getMonth() + 1;
        
        let targetMonth, targetYear;
        
        if (mondayMonth === sundayMonth) {
            // 同一个月
            targetMonth = mondayMonth;
            targetYear = monday.getFullYear();
        } else {
            // 跨月，计算哪个月的天数更多
            const mondayDaysInWeek = this.getDaysInMonth(monday) - monday.getDate() + 1;
            const sundayDaysInWeek = sunday.getDate();
            
            if (mondayDaysInWeek >= sundayDaysInWeek) {
                targetMonth = mondayMonth;
                targetYear = monday.getFullYear();
            } else {
                targetMonth = sundayMonth;
                targetYear = sunday.getFullYear();
            }
        }
        
        // 计算是该月的第几周
        const firstDayOfMonth = new Date(targetYear, targetMonth - 1, 1);
        const firstMonday = new Date(firstDayOfMonth);
        const firstDayWeekday = firstDayOfMonth.getDay();
        const daysToFirstMonday = firstDayWeekday === 0 ? 1 : 8 - firstDayWeekday;
        firstMonday.setDate(firstDayOfMonth.getDate() + daysToFirstMonday);
        
        const weekNumber = Math.floor((monday.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
        
        return {
            year: targetYear,
            month: targetMonth,
            weekNumber: Math.max(1, weekNumber)
        };
    }

    // 获取某个月的天数
    getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    // 切换周
    changeWeek(delta) {
        this.weekDate.setDate(this.weekDate.getDate() + (delta * 7));
        this.renderWeeklyTodo();
    }

    createDayCard(day, date, dateKey, todos) {
        const dayCard = document.createElement('div');
        dayCard.className = 'todo-day';
        
        const dayTodos = todos[dateKey] || [];
        
        // 排序：未完成的在前，已完成的在后
        const sortedTodos = dayTodos.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });
        
        const todoItems = sortedTodos.map(todo => 
            `<div class="todo-task ${todo.completed ? 'completed' : ''}" 
                  style="background-color: ${todo.color || '#f5ede0'}"
                  onclick="toggleTodoInWeekly('${dateKey}', '${todo.text}')"
                  oncontextmenu="event.preventDefault(); deleteTodoInWeekly('${dateKey}', '${todo.text}')"
                  ontouchstart="startLongPress(event, '${dateKey}', '${todo.text}')"
                  ontouchend="endLongPress()"
                  ontouchmove="cancelLongPress()">${todo.text}</div>`
        ).join('');
        
        dayCard.innerHTML = `
            <div class="todo-day-title">${day}<br>${date.getDate()}</div>
            <div class="todo-list">
                ${todoItems || '<div style="text-align: center; color: #d4c4a8; font-size: 9px; padding: 10px;">无任务</div>'}
            </div>
        `;
        
        dayCard.addEventListener('dblclick', () => {
            this.openTodoModal(dateKey, `${day} ${date.getDate()}日`);
        });
        
        return dayCard;
    }

    openWeeklyTodoModal() {
        this.selectedTodoDate = 'weekly';
        document.getElementById('todoModalTitle').textContent = '代办计划 - 本周任务';
        document.getElementById('todoModal').classList.add('active');
        this.renderTodoModal();
        this.renderSavedColors();
    }

    openTodoModal(dateKey, dayTitle) {
        this.selectedTodoDate = dateKey;
        document.getElementById('todoModalTitle').textContent = `${dayTitle} - 任务管理`;
        document.getElementById('todoModal').classList.add('active');
        this.renderTodoModal();
        this.renderSavedColors();
    }

    renderTodoModal() {
        const todoListModal = document.getElementById('todoListModal');
        
        if (this.selectedTodoDate === 'weekly') {
            // 代办计划模式
            const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
            const sortedTodos = weeklyTodos.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            });
            
            todoListModal.innerHTML = '';
            
            sortedTodos.forEach((todo, index) => {
                const item = document.createElement('div');
                item.className = `todo-item-modal ${todo.completed ? 'completed' : ''}`;
                item.style.backgroundColor = todo.color || '#f5ede0';
                item.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           onchange="toggleWeeklyTodoFromModal(${index})">
                    <span>${todo.text}</span>
                    <button onclick="deleteWeeklyTodoFromModal(${index})">删除</button>
                `;
                todoListModal.appendChild(item);
            });
        } else {
            // 日常任务模式
            const todos = JSON.parse(localStorage.getItem('todos') || '{}');
            const dayTodos = todos[this.selectedTodoDate] || [];
            
            const sortedTodos = dayTodos.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            });
            
            todoListModal.innerHTML = '';
            
            sortedTodos.forEach((todo, index) => {
                const item = document.createElement('div');
                item.className = `todo-item-modal ${todo.completed ? 'completed' : ''}`;
                item.style.backgroundColor = todo.color || '#f5ede0';
                item.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodoFromModal(${index})">
                    <span>${todo.text}</span>
                    <button onclick="deleteTodoFromModal(${index})">删除</button>
                `;
                todoListModal.appendChild(item);
            });
        }
    }

    // 本月活动
    renderActivityList() {
        const activityList = document.getElementById('activityList');
        const activityMonth = document.getElementById('activityMonth');
        const year = this.activityDate.getFullYear();
        const month = this.activityDate.getMonth() + 1;
        
        // 更新月份显示
        activityMonth.textContent = `${year}年${month}月`;
        
        // 过滤当前月份的活动
        const currentMonthActivities = this.activities.filter(activity => {
            // 假设活动日期格式为 MM-DD 或 YYYY-MM-DD
            if (activity.date.includes('-')) {
                const dateParts = activity.date.split('-');
                if (dateParts.length === 2) {
                    // MM-DD 格式，假设是当前年份
                    const activityMonth = parseInt(dateParts[0]);
                    return activityMonth === month;
                } else if (dateParts.length === 3) {
                    // YYYY-MM-DD 格式
                    const activityYear = parseInt(dateParts[0]);
                    const activityMonth = parseInt(dateParts[1]);
                    return activityYear === year && activityMonth === month;
                }
            }
            return false;
        });
        
        activityList.innerHTML = '';
        
        if (currentMonthActivities.length === 0) {
            activityList.innerHTML = '<div style="text-align: center; color: #a89580; padding: 15px; font-size: 10px;">本月暂无活动</div>';
        } else {
            currentMonthActivities.forEach((activity, index) => {
                // 找到原始索引
                const originalIndex = this.activities.indexOf(activity);
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <span class="activity-date">${activity.date}</span>
                    <span class="activity-title">${activity.title}</span>
                    <button class="activity-delete" onclick="healthApp.deleteActivity(${originalIndex})">×</button>
                `;
                activityList.appendChild(item);
            });
        }
        
        // 设置月份导航按钮
        document.getElementById('prevActivityMonth').onclick = () => this.changeActivityMonth(-1);
        document.getElementById('nextActivityMonth').onclick = () => this.changeActivityMonth(1);
    }

    // 切换活动月份
    changeActivityMonth(delta) {
        this.activityDate.setMonth(this.activityDate.getMonth() + delta);
        this.renderActivityList();
    }

    deleteActivity(index) {
        if (confirm('确定删除这个活动吗？')) {
            this.activities.splice(index, 1);
            this.saveActivities();
            this.renderActivityList();
        }
    }

    loadHabitTrackers() {
        return JSON.parse(localStorage.getItem('health-habit-trackers') || '[]');
    }

    saveHabitTrackers() {
        localStorage.setItem('health-habit-trackers', JSON.stringify(this.habitTrackers));
    }

    loadActivities() {
        return JSON.parse(localStorage.getItem('health-activities') || '[]');
    }

    saveActivities() {
        localStorage.setItem('health-activities', JSON.stringify(this.activities));
    }

    // 记账功能
    loadAccountingRecords() {
        return JSON.parse(localStorage.getItem('health-accounting-records') || '[]');
    }

    saveAccountingRecords() {
        localStorage.setItem('health-accounting-records', JSON.stringify(this.accountingRecords));
    }

    loadAccountingCategories() {
        const defaultCategories = {
            expense: ['餐饮', '交通', '购物', '娱乐', '医疗', '其他'],
            income: ['工资', '奖金', '投资', '兼职', '其他']
        };
        return JSON.parse(localStorage.getItem('health-accounting-categories') || JSON.stringify(defaultCategories));
    }

    saveAccountingCategories() {
        localStorage.setItem('health-accounting-categories', JSON.stringify(this.accountingCategories));
    }

    renderAccountingList() {
        const accountingList = document.getElementById('accountingList');
        // 使用本地日期而不是UTC日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayKey = `${year}-${month}-${day}`;
        
        // 获取今日记录
        const todayRecords = this.accountingRecords.filter(record => record.date === today);
        
        if (todayRecords.length === 0) {
            accountingList.innerHTML = '<div style="text-align: center; color: #a89580; padding: 20px; font-size: 12px;">今日暂无记账记录</div>';
            return;
        }

        accountingList.innerHTML = '';
        todayRecords.forEach((record, index) => {
            const item = document.createElement('div');
            item.className = `accounting-item ${record.type}`;
            item.innerHTML = `
                <div class="accounting-details">
                    <div>${record.note || record.category}</div>
                    <div class="accounting-category">${record.category}</div>
                </div>
                <div class="accounting-amount ${record.type}">
                    ${record.type === 'income' ? '+' : '-'}¥${record.amount.toFixed(2)}
                </div>
            `;
            
            // 添加长按删除功能
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.deleteAccountingRecord(record.id);
            });
            
            accountingList.appendChild(item);
        });
    }

    deleteAccountingRecord(recordId) {
        if (confirm('确定删除这条记账记录吗？')) {
            this.accountingRecords = this.accountingRecords.filter(record => record.id !== recordId);
            this.saveAccountingRecords();
            this.renderAccountingList();
        }
    }

    // 心情日历功能
    loadMoodRecords() {
        return JSON.parse(localStorage.getItem('health-mood-records') || '{}');
    }

    saveMoodRecords() {
        localStorage.setItem('health-mood-records', JSON.stringify(this.moodRecords));
    }

    loadMoodSchemes() {
        const defaultScheme = {
            id: 'default',
            name: '默认猫咪',
            moods: [
                { name: '开心', emoji: '😸' },
                { name: '平静', emoji: '😺' },
                { name: '疲惫', emoji: '😿' },
                { name: '生气', emoji: '😾' },
                { name: '难过', emoji: '😹' }
            ]
        };
        const schemes = JSON.parse(localStorage.getItem('health-mood-schemes') || '[]');
        if (schemes.length === 0) {
            schemes.push(defaultScheme);
        }
        return schemes;
    }

    saveMoodSchemes() {
        localStorage.setItem('health-mood-schemes', JSON.stringify(this.moodSchemes));
    }

    loadCurrentMoodScheme() {
        const schemeId = localStorage.getItem('health-current-mood-scheme') || 'default';
        return this.moodSchemes.find(scheme => scheme.id === schemeId) || this.moodSchemes[0];
    }

    saveCurrentMoodScheme() {
        localStorage.setItem('health-current-mood-scheme', this.currentMoodScheme.id);
    }

    renderMoodCalendar() {
        const moodGrid = document.getElementById('moodGrid');
        const moodWeekDisplay = document.getElementById('moodWeekDisplay');
        
        // 计算当前周
        const currentDay = this.moodWeekDate.getDay();
        const monday = new Date(this.moodWeekDate);
        monday.setDate(this.moodWeekDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        
        // 显示周信息
        const { year, month, weekNumber } = this.calculateWeekInfo(monday);
        moodWeekDisplay.textContent = `${year}年${month}月第${weekNumber}周`;
        
        moodGrid.innerHTML = '';
        
        // 渲染7天
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            // 使用本地日期而不是UTC日期
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dayNum = String(date.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${dayNum}`;
            
            const cell = document.createElement('div');
            cell.className = 'mood-cell';
            
            // 检查是否有心情记录
            const moodRecord = this.moodRecords[dateKey];
            if (moodRecord) {
                const moodItem = this.currentMoodScheme.moods.find(m => m.name === moodRecord);
                if (moodItem) {
                    cell.textContent = moodItem.emoji;
                    cell.classList.add('selected');
                }
            }
            
            cell.addEventListener('click', () => {
                this.openMoodSelector(dateKey, cell);
            });
            
            moodGrid.appendChild(cell);
        }
        
        // 设置导航按钮
        document.getElementById('prevMoodWeek').onclick = () => this.changeMoodWeek(-1);
        document.getElementById('nextMoodWeek').onclick = () => this.changeMoodWeek(1);
    }

    changeMoodWeek(delta) {
        this.moodWeekDate.setDate(this.moodWeekDate.getDate() + (delta * 7));
        this.renderMoodCalendar();
    }

    openMoodSelector(dateKey, cellElement) {
        const moods = this.currentMoodScheme.moods;
        const moodOptions = moods.map(mood => 
            `<div class="mood-option" onclick="selectMood('${dateKey}', '${mood.name}', '${mood.emoji}')">${mood.emoji} ${mood.name}</div>`
        ).join('');
        
        const popup = document.createElement('div');
        popup.className = 'mood-selector-popup';
        popup.innerHTML = `
            <div class="mood-selector-content">
                <h4>选择心情</h4>
                ${moodOptions}
                <button onclick="clearMood('${dateKey}')">清除</button>
                <button onclick="closeMoodSelector()">取消</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        popup.style.display = 'flex';
        
        // 存储当前选择的元素
        window.currentMoodCell = cellElement;
        window.currentMoodDateKey = dateKey;
    }

    // 保存颜色功能
    loadSavedColors() {
        const defaultColors = ['#f5ede0', '#e8dcc8', '#c9a87c', '#d4a574', '#f5d4d4', '#c9e4c9'];
        return JSON.parse(localStorage.getItem('health-saved-colors') || JSON.stringify(defaultColors));
    }

    saveSavedColors() {
        localStorage.setItem('health-saved-colors', JSON.stringify(this.savedColors));
    }

    renderSavedColors() {
        const savedColorsList = document.getElementById('savedColorsList');
        if (!savedColorsList) return;

        savedColorsList.innerHTML = '';

        if (this.savedColors.length === 0) {
            savedColorsList.innerHTML = '<div class="no-saved-colors">暂无保存的颜色</div>';
            return;
        }

        this.savedColors.forEach((color, index) => {
            const colorItem = document.createElement('div');
            colorItem.className = 'saved-color-item';
            colorItem.style.backgroundColor = color;
            colorItem.title = color;
            
            colorItem.innerHTML = `
                <button class="delete-color" onclick="deleteSavedColor(${index})" title="删除颜色">×</button>
            `;
            
            colorItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-color')) {
                    selectSavedColor(color);
                }
            });
            
            savedColorsList.appendChild(colorItem);
        });
    }

    // 设置功能
    loadCssSchemes() {
        const defaultCss = this.getDefaultCss();
        const defaultScheme = {
            id: 'default',
            name: '默认样式',
            css: defaultCss
        };
        const schemes = JSON.parse(localStorage.getItem('health-plan-css-schemes') || '[]');
        if (schemes.length === 0) {
            schemes.push(defaultScheme);
        } else {
            // 始终用最新的默认CSS更新default方案
            const def = schemes.find(s => s.id === 'default');
            if (def) def.css = defaultCss;
            // 修复自定义方案中的 vertical-rl 镜像问题
            schemes.forEach(s => {
                if (s.id !== 'default' && s.css && s.css.includes('vertical-rl')) {
                    s.css = s.css.replace(/vertical-rl/g, 'vertical-lr');
                }
            });
        }
        return schemes;
    }

    saveCssSchemes() {
        localStorage.setItem('health-plan-css-schemes', JSON.stringify(this.cssSchemes));
    }

    loadCurrentCssScheme() {
        const schemeId = localStorage.getItem('health-plan-current-css-scheme') || 'default';
        // 确保cssSchemes已经加载
        if (!this.cssSchemes || this.cssSchemes.length === 0) {
            this.cssSchemes = this.loadCssSchemes();
        }
        const scheme = this.cssSchemes.find(scheme => scheme.id === schemeId);
        return scheme || this.cssSchemes[0];
    }

    saveCurrentCssScheme() {
        localStorage.setItem('health-plan-current-css-scheme', this.currentCssScheme.id);
    }

    loadBackgroundSettings() {
        return JSON.parse(localStorage.getItem('health-plan-background-settings') || '{}');
    }

    saveBackgroundSettings() {
        localStorage.setItem('health-plan-background-settings', JSON.stringify(this.backgroundSettings));
    }

    loadFontSettings() {
        return JSON.parse(localStorage.getItem('health-plan-font-settings') || '{}');
    }

    saveFontSettings() {
        localStorage.setItem('health-plan-font-settings', JSON.stringify(this.fontSettings));
    }

    applyStoredSettings() {
        // 应用CSS方案
        if (this.currentCssScheme && this.currentCssScheme.css) {
            this.applyCssToPage(this.currentCssScheme.css);
        }
        
        // 应用背景设置
        if (this.backgroundSettings.url) {
            this.applyBackgroundToPage(this.backgroundSettings);
        }
        
        // 应用字体设置
        if (this.fontSettings.fontFamily) {
            this.applyFontToPage(this.fontSettings);
        }
    }

    applyCssToPage(css) {
        let styleElement = document.getElementById('health-plan-custom-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'health-plan-custom-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = css;
        
        // 强制重新渲染页面样式
        document.body.style.display = 'none';
        document.body.offsetHeight; // 触发重排
        document.body.style.display = '';
        
        console.log('CSS已应用到页面');
    }

    applyBackgroundToPage(settings) {
        const container = document.querySelector('.health-container');
        if (container && settings.url) {
            container.style.backgroundImage = `url('${settings.url}')`;
            container.style.backgroundSize = settings.mode || 'cover';
            container.style.backgroundPosition = settings.position || 'center';
            container.style.backgroundRepeat = settings.mode === 'repeat' ? 'repeat' : 'no-repeat';
        }
    }

    applyFontToPage(settings) {
        const container = document.querySelector('.health-container');
        if (container) {
            if (settings.fontFamily) container.style.fontFamily = settings.fontFamily;
            if (settings.fontSize) container.style.fontSize = settings.fontSize + 'px';
            if (settings.fontWeight) container.style.fontWeight = settings.fontWeight;
        }
    }

    getDefaultCss() {
        return `/* 健康管理应用 - 计划页面默认样式 */
/* 注意：此CSS仅应用于计划页面，不影响健康、日记等其他页面 */

/* CSS变量定义 - 计划页面完整的自定义变量系统 */
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
    --success-color: #6b9b6b;
    --warning-color: #b87c7c;
    --danger-color: #d4a574;
    --light-bg: #fdfbf7;
    --hover-bg: #f5ede0;
    --nav-hover-bg: #faf8f3;
    --border-light: #e8dcc8;
    --border-dark: #d4c4a8;
    --border-accent: #a67c52;
    
    /* 按钮颜色 */
    --btn-primary-bg: var(--primary-color);
    --btn-primary-hover: #b89968;
    --btn-primary-text: #ffffff;
    --btn-secondary-bg: var(--accent-color);
    --btn-secondary-hover: var(--accent-color);
    --btn-secondary-text: #ffffff;
    --btn-danger-bg: var(--danger-color);
    --btn-danger-hover: #c09460;
    --btn-danger-text: #ffffff;
    
    /* 输入框颜色 */
    --input-bg: var(--card-color);
    --input-border: var(--border-light);
    --input-focus-border: var(--primary-color);
    --input-text: var(--text-color);
    
    /* 模态框颜色 */
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-bg: var(--card-color);
    --modal-border: var(--border-light);
    --modal-shadow: rgba(0, 0, 0, 0.2);
    
    /* 卡片颜色 */
    --card-border: var(--border-light);
    --card-hover-border: var(--primary-color);
    --card-shadow: rgba(0, 0, 0, 0.1);
    
    /* 导航颜色 */
    --nav-bg: var(--card-color);
    --nav-border: var(--border-light);
    --nav-text: var(--muted-color);
    --nav-hover-bg: var(--nav-hover-bg);
    --nav-active-bg: var(--hover-bg);
    --nav-active-text: var(--text-color);
    --nav-active-border: var(--border-accent);
    
    /* 统计和活动颜色 */
    --stats-bg: var(--card-color);
    --stats-border: var(--border-light);
    --stats-item-bg: var(--nav-hover-bg);
    --stats-label-text: var(--muted-color);
    --stats-value-text: var(--text-color);
    
    /* 头像颜色 */
    --avatar-bg: linear-gradient(135deg, #f5e6d3 0%, #e8d4b8 100%);
    --avatar-border: var(--accent-color);
    --avatar-label-text: var(--muted-color);
    
    /* 习惯追踪器颜色 */
    --habit-tracker-bg: var(--card-color);
    --habit-tracker-border: var(--border-light);
    --habit-row-bg: var(--light-bg);
    --habit-row-border: var(--border-light);
    --habit-name-text: var(--text-color);
    --habit-day-bg: var(--card-color);
    --habit-day-border: var(--border-light);
    --habit-day-hover-border: var(--primary-color);
    --habit-completed-bg: #c9e4c9;
    --habit-completed-border: #a8c9a8;
    --habit-incomplete-bg: #f5d4d4;
    --habit-incomplete-border: #d4a8a8;
    --day-label-text: #a89580;
    
    /* 日历颜色 */
    --calendar-bg: var(--card-color);
    --calendar-border: var(--border-light);
    --calendar-cell-bg: var(--light-bg);
    --calendar-cell-border: var(--border-light);
    --calendar-cell-hover-bg: var(--hover-bg);
    --calendar-today-bg: var(--primary-color);
    --calendar-today-text: var(--btn-primary-text);
    --calendar-today-border: var(--border-accent);
    --calendar-other-month-text: var(--accent-color);
    --calendar-weekday-text: #a89580;
    --calendar-todo-dot: var(--danger-color);
    
    /* 心情日历颜色 */
    --mood-cell-bg: var(--light-bg);
    --mood-cell-border: var(--border-light);
    --mood-cell-hover-border: var(--primary-color);
    --mood-cell-selected-bg: var(--hover-bg);
    --mood-cell-selected-border: var(--border-accent);
    
    /* 记账颜色 */
    --accounting-item-bg: var(--light-bg);
    --accounting-item-border: var(--border-light);
    --accounting-income-border: var(--success-color);
    --accounting-expense-border: var(--warning-color);
    --accounting-income-text: var(--success-color);
    --accounting-expense-text: var(--warning-color);
    --accounting-category-text: #a89580;
    
    /* TODO颜色 */
    --todo-day-bg: var(--light-bg);
    --todo-day-border: var(--border-light);
    --todo-day-hover-border: var(--primary-color);
    --todo-day-hover-shadow: rgba(169, 124, 82, 0.15);
    --todo-weekly-bg: var(--hover-bg);
    --todo-weekly-border: var(--accent-color);
    --todo-title-text: var(--border-accent);
    --todo-title-border: var(--border-light);
    --todo-task-text: var(--text-color);
    --todo-weekly-title-text: var(--muted-color);
    
    /* 表单颜色 */
    --form-bg: var(--light-bg);
    --form-border: var(--border-light);
    --form-label-text: var(--text-color);
    --form-input-bg: var(--card-color);
    --form-input-border: var(--border-light);
    --form-input-focus-border: var(--primary-color);
    --form-input-text: var(--text-color);
    
    /* 设置弹窗颜色 */
    --settings-tab-text: #a89580;
    --settings-tab-active-text: var(--text-color);
    --settings-tab-active-border: var(--primary-color);
    --settings-section-bg: var(--light-bg);
    --settings-section-border: var(--border-light);
    --settings-scheme-bg: var(--card-color);
    --settings-scheme-border: var(--border-light);
    --settings-scheme-active-bg: var(--hover-bg);
    --settings-scheme-active-border: var(--primary-color);
    --settings-scheme-hover-border: var(--accent-color);
    
    /* 保存颜色功能 */
    --saved-color-border: var(--border-light);
    --saved-color-hover-border: var(--primary-color);
    --saved-color-selected-border: var(--border-accent);
    --saved-color-selected-shadow: rgba(166, 124, 82, 0.3);
    --saved-color-delete-bg: var(--danger-color);
    --no-saved-colors-text: #a89580;
    
    /* 预览区域颜色 */
    --preview-bg: var(--background-color);
    --preview-text: var(--text-color);
    --preview-border: var(--border-light);
    
    /* 滚动条颜色 */
    --scrollbar-track: var(--hover-bg);
    --scrollbar-thumb: var(--accent-color);
    --scrollbar-thumb-hover: var(--primary-color);
    
    /* 布局变量 */
    --border-radius: 16px;
    --shadow-intensity: 0.5;
    --animation-speed: 0.3s;
}

/* 基础重置和全局样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Georgia', 'Times New Roman', serif;
    background: var(--background-color);
    color: var(--text-color);
    overflow: hidden;
}

/* 主容器 - 全屏布局 */
.health-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    position: relative;
}

/* 返回按钮 */
.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid var(--border-dark);
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-color);
    z-index: 100;
    transition: all 0.3s;
}

.back-btn:hover {
    background: var(--card-color);
    box-shadow: 0 2px 8px var(--modal-shadow);
}

/* 设置按钮 */
.settings-btn-main {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid var(--accent-color);
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    color: var(--text-color);
    z-index: 100;
    transition: all 0.3s;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.settings-btn-main:hover {
    background: var(--card-color);
    box-shadow: 0 2px 8px var(--card-shadow);
    transform: rotate(90deg);
}

/* 左侧导航栏 */
.sidebar {
    width: 80px;
    background: var(--nav-bg);
    border-right: 2px solid var(--nav-border);
    display: flex;
    flex-direction: column;
    padding: 80px 0 20px;
    gap: 5px;
}

.nav-item {
    padding: 20px 10px;
    text-align: center;
    color: var(--nav-text);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 13px;
    writing-mode: vertical-lr;
    text-orientation: upright;
    letter-spacing: 2px;
    border-left: 3px solid transparent;
}

.nav-item:hover {
    background: var(--nav-hover-bg);
    border-left-color: var(--primary-color);
}

.nav-item.active {
    background: var(--nav-active-bg);
    color: var(--nav-active-text);
    border-left-color: var(--nav-active-border);
    font-weight: bold;
}

/* 中间区域 */
.middle-section {
    width: 200px;
    background: var(--light-bg);
    border-right: 2px solid var(--border-light);
    padding: 80px 15px 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
}

/* 头像区 */
.avatar-box {
    background: var(--card-color);
    border: 2px solid var(--border-light);
    border-radius: 12px;
    padding: 15px;
    text-align: center;
}

.avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--avatar-bg);
    border: 3px solid var(--avatar-border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    cursor: pointer;
    transition: transform 0.3s;
    overflow: hidden;
}

.avatar-circle:hover {
    transform: scale(1.05);
}

.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

#avatarDisplay {
    font-size: 45px;
}

/* 统计看板 */
.stats-box {
    background: var(--stats-bg);
    border: 2px solid var(--stats-border);
    border-radius: 12px;
    padding: 15px;
    flex: 1;
}

/* 本月活动 */
.activity-box {
    background: var(--card-color);
    border: 2px solid var(--card-border);
    border-radius: 12px;
    padding: 15px;
    max-height: 280px;
    display: flex;
    flex-direction: column;
}

/* 右侧主内容区 */
.main-content {
    flex: 1;
    padding: 80px 30px 30px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 习惯追踪器 */
.habit-tracker {
    background: var(--habit-tracker-bg);
    border: 2px solid var(--habit-tracker-border);
    border-radius: 16px;
    padding: 25px;
    overflow-x: auto;
    min-height: 200px;
}

/* 日历和新功能区域 */
.calendar-and-features {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.calendar-section {
    background: var(--calendar-bg);
    border: 2px solid var(--calendar-border);
    border-radius: 16px;
    padding: 15px;
    width: 400px;
    flex-shrink: 0;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
    text-align: center;
    font-weight: bold;
    font-size: 10px;
}

.habit-days-header {
    display: flex;
    gap: 3px;
    margin-bottom: 5px;
    margin-left: 63px;
}

.habit-days {
    display: flex;
    gap: 3px;
    flex-wrap: nowrap;
    margin-left: -63px;
}

.habit-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 10px;
}

/* 周计划 */
.todo-section {
    background: var(--card-color);
    border: 2px solid var(--card-border);
    border-radius: 16px;
    padding: 25px;
}

/* 更多样式... */
/* 注释：这里包含了计划页面的所有基础样式，用户可以根据需要修改 */
/* 注释：修改这些样式只会影响计划页面，不会影响健康、日记等其他页面 */`;
    }
}

// 全局函数
function addHabit() {
    const name = prompt('请输入习惯名称：');
    if (!name || !name.trim()) return;
    
    const habitTrackers = JSON.parse(localStorage.getItem('health-habit-trackers') || '[]');
    const now = new Date();
    habitTrackers.push({
        name: name.trim(),
        records: {},
        createdAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    });
    localStorage.setItem('health-habit-trackers', JSON.stringify(habitTrackers));
    
    healthApp.habitTrackers = habitTrackers;
    healthApp.renderHabitTracker();
}

function changeAvatar() {
    const choice = prompt('选择方式：\n1. 输入URL\n2. 输入emoji\n3. 上传文件（输入"upload"）');
    
    if (choice === '1') {
        const url = prompt('请输入图片URL：');
        if (url) {
            localStorage.setItem('health-avatar', url);
            document.getElementById('avatarDisplay').innerHTML = `<img src="${url}" alt="头像">`;
        }
    } else if (choice === '2') {
        const emoji = prompt('请输入emoji：');
        if (emoji) {
            localStorage.setItem('health-avatar', emoji);
            document.getElementById('avatarDisplay').textContent = emoji;
        }
    } else if (choice === 'upload') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    localStorage.setItem('health-avatar', dataUrl);
                    document.getElementById('avatarDisplay').innerHTML = `<img src="${dataUrl}" alt="头像">`;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
}

function addActivity() {
    const year = healthApp.activityDate.getFullYear();
    const month = healthApp.activityDate.getMonth() + 1;
    
    const date = prompt(`请输入日期（格式：DD 或 YYYY-MM-DD）\n当前查看月份：${year}年${month}月`);
    if (!date) return;
    
    let formattedDate;
    if (date.includes('-')) {
        // 用户输入了完整日期格式
        formattedDate = date;
    } else {
        // 用户只输入了日期，自动补充年月
        const day = date.padStart(2, '0');
        formattedDate = `${year}-${String(month).padStart(2, '0')}-${day}`;
    }
    
    const title = prompt('请输入活动标题：');
    if (!title) return;
    
    const activities = JSON.parse(localStorage.getItem('health-activities') || '[]');
    activities.push({ date: formattedDate, title });
    localStorage.setItem('health-activities', JSON.stringify(activities));
    
    healthApp.activities = activities;
    healthApp.renderActivityList();
}

// 日历弹窗功能
function closeCalendarModal() {
    document.getElementById('calendarModal').classList.remove('active');
    healthApp.selectedDate = null;
}

function ensureDiaryModals() {
    if (!document.getElementById('diaryModal')) {
        const d = document.createElement('div');
        d.className = 'diary-modal';
        d.id = 'diaryModal';
        d.innerHTML = `<div class="diary-modal-content">
            <div class="diary-modal-header">
                <h3 id="diaryModalTitle">\u{1f4dd} 记日记</h3>
                <button class="modal-close" onclick="closeDiaryModal()">\u00d7</button>
            </div>
            <div class="diary-modal-body">
                <div class="diary-mood-select">
                    <span>今日心情：</span>
                    <div class="diary-mood-options" id="diaryMoodOptions">
                        <span class="diary-mood-item" data-mood="\u{1f60a}" onclick="selectDiaryMood(this)">\u{1f60a}</span>
                        <span class="diary-mood-item" data-mood="\u{1f622}" onclick="selectDiaryMood(this)">\u{1f622}</span>
                        <span class="diary-mood-item" data-mood="\u{1f621}" onclick="selectDiaryMood(this)">\u{1f621}</span>
                        <span class="diary-mood-item" data-mood="\u{1f970}" onclick="selectDiaryMood(this)">\u{1f970}</span>
                        <span class="diary-mood-item" data-mood="\u{1f634}" onclick="selectDiaryMood(this)">\u{1f634}</span>
                        <span class="diary-mood-item" data-mood="\u{1f914}" onclick="selectDiaryMood(this)">\u{1f914}</span>
                        <span class="diary-mood-item" data-mood="\u2728" onclick="selectDiaryMood(this)">\u2728</span>
                    </div>
                </div>
                <textarea id="diaryContent" placeholder="今天发生了什么..." rows="6"></textarea>
                <div class="diary-actions">
                    <button class="diary-save-btn" onclick="saveDiary()">保存</button>
                </div>
            </div>
        </div>`;
        document.body.appendChild(d);
    }
    if (!document.getElementById('diaryReviewModal')) {
        const r = document.createElement('div');
        r.className = 'diary-review-modal';
        r.id = 'diaryReviewModal';
        r.innerHTML = `<div class="diary-review-content">
            <div class="diary-review-header">
                <h3>\u{1f4d6} 日记回顾</h3>
                <div class="diary-review-actions">
                    <button class="diary-export-btn" onclick="exportDiaries()">\u{1f4e4} 导出</button>
                    <button class="modal-close" onclick="closeDiaryReview()">\u00d7</button>
                </div>
            </div>
            <div class="diary-review-list" id="diaryReviewList"></div>
        </div>`;
        document.body.appendChild(r);
    }
}

function goToDiary() {
    ensureDiaryModals();
    const app = window.healthApp || healthApp;
    const dateKey = app.selectedDate;
    closeCalendarModal();
    if (!dateKey) return;
    
    // 解析日期显示
    const [y, m, d] = dateKey.split('-');
    document.getElementById('diaryModalTitle').textContent = `📝 ${y}年${parseInt(m)}月${parseInt(d)}日 日记`;
    
    // 加载已有日记
    const diaries = JSON.parse(localStorage.getItem('health-diaries') || '{}');
    const existing = diaries[dateKey];
    
    document.getElementById('diaryContent').value = existing ? existing.text : '';
    
    // 重置心情选择
    document.querySelectorAll('.diary-mood-item').forEach(el => el.classList.remove('selected'));
    if (existing && existing.mood) {
        const moodEl = document.querySelector(`.diary-mood-item[data-mood="${existing.mood}"]`);
        if (moodEl) moodEl.classList.add('selected');
    }
    
    document.getElementById('diaryModal').classList.add('active');
    document.getElementById('diaryModal').dataset.dateKey = dateKey;
}

function selectDiaryMood(el) {
    document.querySelectorAll('.diary-mood-item').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
}

function closeDiaryModal() {
    document.getElementById('diaryModal').classList.remove('active');
}

function saveDiary() {
    const modal = document.getElementById('diaryModal');
    const dateKey = modal.dataset.dateKey;
    const text = document.getElementById('diaryContent').value.trim();
    const moodEl = document.querySelector('.diary-mood-item.selected');
    const mood = moodEl ? moodEl.dataset.mood : '';
    
    if (!text) { alert('请写点什么吧~'); return; }
    
    const diaries = JSON.parse(localStorage.getItem('health-diaries') || '{}');
    diaries[dateKey] = { text, mood, timestamp: Date.now() };
    localStorage.setItem('health-diaries', JSON.stringify(diaries));
    
    closeDiaryModal();
    // 刷新日历显示（日记日期可以有标记）
    if (window.healthApp) window.healthApp.renderCalendar();
}

function openDiaryReview() {
    ensureDiaryModals();
    const diaries = JSON.parse(localStorage.getItem('health-diaries') || '{}');
    const reviewList = document.getElementById('diaryReviewList');
    
    const entries = Object.entries(diaries).sort((a, b) => b[0].localeCompare(a[0]));
    
    if (entries.length === 0) {
        reviewList.innerHTML = '<div class="diary-empty">还没有日记哦，双击日历日期开始记录吧~ ✨</div>';
    } else {
        reviewList.innerHTML = entries.map(([dateKey, entry]) => {
            const [y, m, d] = dateKey.split('-');
            return `<div class="diary-entry-card">
                <div class="diary-entry-header">
                    <span class="diary-entry-date">${y}年${parseInt(m)}月${parseInt(d)}日</span>
                    <span class="diary-entry-mood">${entry.mood || ''}</span>
                </div>
                <div class="diary-entry-text">${escapeHtml(entry.text)}</div>
                <div class="diary-entry-actions">
                    <button class="diary-share-btn" onclick="shareDiaryToChat('${dateKey}')">💬 分享给TA</button>
                    <button class="diary-delete-btn" onclick="deleteDiary('${dateKey}')">🗑️ 删除</button>
                </div>
            </div>`;
        }).join('');
    }
    
    document.getElementById('diaryReviewModal').classList.add('active');
}

function closeDiaryReview() {
    document.getElementById('diaryReviewModal').classList.remove('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function deleteDiary(dateKey) {
    if (!confirm('确定删除这篇日记吗？')) return;
    const diaries = JSON.parse(localStorage.getItem('health-diaries') || '{}');
    delete diaries[dateKey];
    localStorage.setItem('health-diaries', JSON.stringify(diaries));
    openDiaryReview(); // 刷新列表
    if (window.healthApp) window.healthApp.renderCalendar();
}

function exportDiaries() {
    const diaries = JSON.parse(localStorage.getItem('health-diaries') || '{}');
    const entries = Object.entries(diaries).sort((a, b) => a[0].localeCompare(b[0]));
    
    if (entries.length === 0) { alert('没有日记可以导出~'); return; }
    
    let text = '📖 我的日记\n' + '='.repeat(30) + '\n\n';
    entries.forEach(([dateKey, entry]) => {
        const [y, m, d] = dateKey.split('-');
        text += `📅 ${y}年${parseInt(m)}月${parseInt(d)}日 ${entry.mood || ''}\n`;
        text += '-'.repeat(20) + '\n';
        text += entry.text + '\n\n';
    });
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `日记导出_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function shareDiaryToChat(dateKey) {
    const diaries = JSON.parse(localStorage.getItem('health-diaries') || '{}');
    const entry = diaries[dateKey];
    if (!entry) return;
    
    const [y, m, d] = dateKey.split('-');
    const dateStr = `${y}年${parseInt(m)}月${parseInt(d)}日`;
    
    // 构造分享消息
    const shareText = `[日记分享] ${dateStr} ${entry.mood || ''}\n${entry.text}`;
    
    // 存储到待发送消息
    localStorage.setItem('pending-diary-share', JSON.stringify({
        date: dateStr,
        mood: entry.mood || '',
        text: entry.text,
        message: shareText
    }));
    
    closeDiaryReview();
    // 跳转到消息页面
    window.location.href = 'message.html#diary-share';
}

function uploadCoverImage() {
    const imageUrl = prompt('请输入封面图URL：');
    if (imageUrl && imageUrl.trim()) {
        healthApp.setCoverImage(imageUrl.trim());
        closeCalendarModal();
    }
}

// TODO弹窗功能
function closeTodoModal() {
    document.getElementById('todoModal').classList.remove('active');
    healthApp.selectedTodoDate = null;
    document.getElementById('todoInput').value = '';
    document.getElementById('todoColor').value = '#f0f0f0';
}

function addTodoFromModal() {
    const input = document.getElementById('todoInput');
    const colorInput = document.getElementById('todoColor');
    const text = input.value.trim();
    
    if (!text || !healthApp.selectedTodoDate) return;
    
    if (healthApp.selectedTodoDate === 'weekly') {
        // 添加到代办计划
        const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
        weeklyTodos.push({
            text: text,
            completed: false,
            color: colorInput.value
        });
        localStorage.setItem('weekly-todos', JSON.stringify(weeklyTodos));
    } else {
        // 添加到日常任务
        const todos = JSON.parse(localStorage.getItem('todos') || '{}');
        if (!todos[healthApp.selectedTodoDate]) {
            todos[healthApp.selectedTodoDate] = [];
        }
        
        todos[healthApp.selectedTodoDate].push({
            text: text,
            completed: false,
            color: colorInput.value
        });
        
        localStorage.setItem('todos', JSON.stringify(todos));
        
        // 更新桌面小组件
        if (window.updateAllWidgets) {
            window.updateAllWidgets();
        }
    }
    
    input.value = '';
    colorInput.value = '#f0f0f0';
    
    healthApp.renderTodoModal();
    healthApp.renderWeeklyTodo();
    healthApp.renderCalendar();
    healthApp.renderStatistics();
}

function toggleWeeklyTodo(index) {
    const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
    if (weeklyTodos[index]) {
        weeklyTodos[index].completed = !weeklyTodos[index].completed;
        localStorage.setItem('weekly-todos', JSON.stringify(weeklyTodos));
        healthApp.renderWeeklyTodo();
    }
}

function toggleWeeklyTodoFromModal(index) {
    const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
    if (weeklyTodos[index]) {
        weeklyTodos[index].completed = !weeklyTodos[index].completed;
        localStorage.setItem('weekly-todos', JSON.stringify(weeklyTodos));
        healthApp.renderTodoModal();
        healthApp.renderWeeklyTodo();
    }
}

function deleteWeeklyTodoFromModal(index) {
    if (confirm('确定删除这个计划吗？')) {
        const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
        weeklyTodos.splice(index, 1);
        localStorage.setItem('weekly-todos', JSON.stringify(weeklyTodos));
        healthApp.renderTodoModal();
        healthApp.renderWeeklyTodo();
    }
}

function toggleTodoFromModal(index) {
    const todos = JSON.parse(localStorage.getItem('todos') || '{}');
    if (todos[healthApp.selectedTodoDate] && todos[healthApp.selectedTodoDate][index]) {
        todos[healthApp.selectedTodoDate][index].completed = !todos[healthApp.selectedTodoDate][index].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        
        healthApp.renderTodoModal();
        healthApp.renderWeeklyTodo();
        healthApp.renderStatistics();
        
        // 更新桌面小组件
        if (window.updateAllWidgets) {
            window.updateAllWidgets();
        }
    }
}

function deleteTodoFromModal(index) {
    if (confirm('确定删除这个任务吗？')) {
        const todos = JSON.parse(localStorage.getItem('todos') || '{}');
        if (todos[healthApp.selectedTodoDate]) {
            todos[healthApp.selectedTodoDate].splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            
            healthApp.renderTodoModal();
            healthApp.renderWeeklyTodo();
            healthApp.renderCalendar();
            healthApp.renderStatistics();
            
            // 更新桌面小组件
            if (window.updateAllWidgets) {
                window.updateAllWidgets();
            }
        }
    }
}

function toggleTodoInWeekly(dateKey, todoText) {
    const todos = JSON.parse(localStorage.getItem('todos') || '{}');
    const dayTodos = todos[dateKey] || [];
    
    const todoIndex = dayTodos.findIndex(todo => todo.text === todoText);
    if (todoIndex !== -1) {
        dayTodos[todoIndex].completed = !dayTodos[todoIndex].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        
        healthApp.renderWeeklyTodo();
        healthApp.renderStatistics();
        
        // 更新桌面小组件
        if (window.updateAllWidgets) {
            window.updateAllWidgets();
        }
    }
}

// 初始化应用
let healthApp;
document.addEventListener('DOMContentLoaded', () => {
    if (window.CoupleSpaceUI && typeof window.CoupleSpaceUI.init === 'function') {
        window.CoupleSpaceUI.init();
    }
    healthApp = new HealthApp();
    
    // 监听待办事项变化
    window.addEventListener('storage', (e) => {
        if (e.key === 'todos') {
            healthApp.renderWeeklyTodo();
            healthApp.renderCalendar();
            healthApp.renderStatistics();
        }
    });
});

// 长按删除功能
let longPressTimer = null;
let longPressData = null;

function startLongPress(event, dateKey, todoText) {
    longPressData = { type: 'daily', dateKey, todoText };
    longPressTimer = setTimeout(() => {
        deleteTodoInWeekly(dateKey, todoText);
    }, 800); // 800ms长按
}

function startWeeklyLongPress(event, index) {
    longPressData = { type: 'weekly', index };
    longPressTimer = setTimeout(() => {
        deleteWeeklyTodoInWeekly(index);
    }, 800); // 800ms长按
}

function endLongPress() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressData = null;
    }
}

function cancelLongPress() {
    endLongPress();
}

// 删除日常todo（周计划中）
function deleteTodoInWeekly(dateKey, todoText) {
    if (confirm('确定删除这个任务吗？')) {
        const todos = JSON.parse(localStorage.getItem('todos') || '{}');
        if (todos[dateKey]) {
            const todoIndex = todos[dateKey].findIndex(todo => todo.text === todoText);
            if (todoIndex !== -1) {
                todos[dateKey].splice(todoIndex, 1);
                localStorage.setItem('todos', JSON.stringify(todos));
                
                healthApp.renderWeeklyTodo();
                healthApp.renderCalendar();
                healthApp.renderStatistics();
                
                // 更新桌面小组件
                if (window.updateAllWidgets) {
                    window.updateAllWidgets();
                }
            }
        }
    }
}

// 删除周计划todo（代办计划中）
function deleteWeeklyTodoInWeekly(index) {
    if (confirm('确定删除这个计划吗？')) {
        const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
        if (weeklyTodos[index]) {
            weeklyTodos.splice(index, 1);
            localStorage.setItem('weekly-todos', JSON.stringify(weeklyTodos));
            healthApp.renderWeeklyTodo();
        }
    }
}

// 记账功能
function openAccountingModal() {
    document.getElementById('accountingModal').classList.add('active');
    loadAccountingCategories();
}

function closeAccountingModal() {
    document.getElementById('accountingModal').classList.remove('active');
    clearAccountingForm();
}

function loadAccountingCategories() {
    const categorySelect = document.getElementById('accountingCategory');
    const typeSelect = document.getElementById('accountingType');
    const type = typeSelect.value;
    
    categorySelect.innerHTML = '<option value="">选择分类</option>';
    
    const categories = healthApp.accountingCategories[type] || [];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function addNewCategory() {
    const newCategory = prompt('请输入新分类名称：');
    if (newCategory && newCategory.trim()) {
        const type = document.getElementById('accountingType').value;
        if (!healthApp.accountingCategories[type].includes(newCategory.trim())) {
            healthApp.accountingCategories[type].push(newCategory.trim());
            healthApp.saveAccountingCategories();
            loadAccountingCategories();
            document.getElementById('accountingCategory').value = newCategory.trim();
        }
    }
}

function addAccountingRecord() {
    const type = document.getElementById('accountingType').value;
    const amount = parseFloat(document.getElementById('accountingAmount').value);
    const category = document.getElementById('accountingCategory').value;
    const note = document.getElementById('accountingNote').value.trim();
    
    if (!amount || amount <= 0) {
        alert('请输入有效金额');
        return;
    }
    
    if (!category) {
        alert('请选择分类');
        return;
    }
    
    const record = {
        id: Date.now(),
        type: type,
        amount: amount,
        category: category,
        note: note,
        // 使用本地日期而不是UTC日期
        date: (() => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        })()
    };
    
    healthApp.accountingRecords.push(record);
    healthApp.saveAccountingRecords();
    healthApp.renderAccountingList();
    closeAccountingModal();
}

function clearAccountingForm() {
    document.getElementById('accountingType').value = 'expense';
    document.getElementById('accountingAmount').value = '';
    document.getElementById('accountingCategory').value = '';
    document.getElementById('accountingNote').value = '';
}

function openAccountingStats() {
    document.getElementById('accountingStatsModal').classList.add('active');
    showStatsTab('week');
}

function closeAccountingStatsModal() {
    document.getElementById('accountingStatsModal').classList.remove('active');
}

function showStatsTab(period) {
    // 更新标签页状态
    document.querySelectorAll('.stats-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    const statsContent = document.getElementById('accountingStatsContent');
    const now = new Date();
    let startDate, endDate;
    
    if (period === 'week') {
        const monday = new Date(now);
        monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
        // 使用本地日期而不是UTC日期
        const startYear = monday.getFullYear();
        const startMonth = String(monday.getMonth() + 1).padStart(2, '0');
        const startDay = String(monday.getDate()).padStart(2, '0');
        startDate = `${startYear}-${startMonth}-${startDay}`;
        
        const endDateObj = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);
        const endYear = endDateObj.getFullYear();
        const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
        const endDay = String(endDateObj.getDate()).padStart(2, '0');
        endDate = `${endYear}-${endMonth}-${endDay}`;
    } else if (period === 'month') {
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        // 使用本地日期而不是UTC日期
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const endYear = lastDayOfMonth.getFullYear();
        const endMonth = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0');
        const endDay = String(lastDayOfMonth.getDate()).padStart(2, '0');
        endDate = `${endYear}-${endMonth}-${endDay}`;
    } else if (period === 'year') {
        startDate = `${now.getFullYear()}-01-01`;
        endDate = `${now.getFullYear()}-12-31`;
    }
    
    const records = healthApp.accountingRecords.filter(record => 
        record.date >= startDate && record.date <= endDate
    );
    
    const income = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const expense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    
    statsContent.innerHTML = `
        <div class="stats-summary">
            <div class="stats-card income">
                <div class="stats-label">收入</div>
                <div class="stats-amount income">¥${income.toFixed(2)}</div>
            </div>
            <div class="stats-card expense">
                <div class="stats-label">支出</div>
                <div class="stats-amount expense">¥${expense.toFixed(2)}</div>
            </div>
        </div>
        <div class="stats-card">
            <div class="stats-label">净收入</div>
            <div class="stats-amount ${income - expense >= 0 ? 'income' : 'expense'}">
                ¥${(income - expense).toFixed(2)}
            </div>
        </div>
    `;
}

// 心情功能
function openMoodSettings() {
    document.getElementById('moodSettingsModal').classList.add('active');
    renderMoodSchemes();
    renderCurrentSchemeEditor();
}

function closeMoodSettingsModal() {
    document.getElementById('moodSettingsModal').classList.remove('active');
}

function renderMoodSchemes() {
    const schemesList = document.getElementById('moodSchemesList');
    schemesList.innerHTML = '';
    
    healthApp.moodSchemes.forEach(scheme => {
        const item = document.createElement('div');
        item.className = `scheme-item ${scheme.id === healthApp.currentMoodScheme.id ? 'active' : ''}`;
        item.innerHTML = `
            <span>${scheme.name}</span>
            <div>
                <button onclick="switchMoodScheme('${scheme.id}')">使用</button>
                ${scheme.id !== 'default' ? `<button onclick="deleteMoodScheme('${scheme.id}')">删除</button>` : ''}
            </div>
        `;
        schemesList.appendChild(item);
    });
}

function renderCurrentSchemeEditor() {
    const moodItemsList = document.getElementById('moodItemsList');
    moodItemsList.innerHTML = '';
    
    healthApp.currentMoodScheme.moods.forEach((mood, index) => {
        const item = document.createElement('div');
        item.className = 'mood-item';
        item.innerHTML = `
            <div class="mood-item-preview">
                <span class="mood-emoji">${mood.emoji}</span>
                <span>${mood.name}</span>
            </div>
            <div class="mood-item-actions">
                <button class="edit-btn" onclick="editMoodItem(${index})">编辑</button>
                <button class="delete-btn" onclick="deleteMoodItem(${index})">删除</button>
            </div>
        `;
        moodItemsList.appendChild(item);
    });
}

function addNewMoodScheme() {
    const name = prompt('请输入方案名称：');
    if (name && name.trim()) {
        const newScheme = {
            id: Date.now().toString(),
            name: name.trim(),
            moods: [
                { name: '开心', emoji: '😊' },
                { name: '平静', emoji: '😌' },
                { name: '难过', emoji: '😢' }
            ]
        };
        healthApp.moodSchemes.push(newScheme);
        healthApp.saveMoodSchemes();
        renderMoodSchemes();
    }
}

function switchMoodScheme(schemeId) {
    healthApp.currentMoodScheme = healthApp.moodSchemes.find(s => s.id === schemeId);
    healthApp.saveCurrentMoodScheme();
    healthApp.renderMoodCalendar();
    renderMoodSchemes();
    renderCurrentSchemeEditor();
}

function deleteMoodScheme(schemeId) {
    if (confirm('确定删除这个心情方案吗？')) {
        healthApp.moodSchemes = healthApp.moodSchemes.filter(s => s.id !== schemeId);
        if (healthApp.currentMoodScheme.id === schemeId) {
            healthApp.currentMoodScheme = healthApp.moodSchemes[0];
            healthApp.saveCurrentMoodScheme();
        }
        healthApp.saveMoodSchemes();
        healthApp.renderMoodCalendar();
        renderMoodSchemes();
        renderCurrentSchemeEditor();
    }
}

function addNewMoodItem() {
    const name = prompt('请输入心情名称：');
    if (!name || !name.trim()) return;
    
    const emoji = prompt('请输入对应的emoji或图片URL：');
    if (!emoji || !emoji.trim()) return;
    
    healthApp.currentMoodScheme.moods.push({
        name: name.trim(),
        emoji: emoji.trim()
    });
    
    healthApp.saveMoodSchemes();
    renderCurrentSchemeEditor();
}

function editMoodItem(index) {
    const mood = healthApp.currentMoodScheme.moods[index];
    const newName = prompt('请输入心情名称：', mood.name);
    if (!newName || !newName.trim()) return;
    
    const newEmoji = prompt('请输入对应的emoji或图片URL：', mood.emoji);
    if (!newEmoji || !newEmoji.trim()) return;
    
    healthApp.currentMoodScheme.moods[index] = {
        name: newName.trim(),
        emoji: newEmoji.trim()
    };
    
    healthApp.saveMoodSchemes();
    healthApp.renderMoodCalendar();
    renderCurrentSchemeEditor();
}

function deleteMoodItem(index) {
    if (confirm('确定删除这个心情吗？')) {
        healthApp.currentMoodScheme.moods.splice(index, 1);
        healthApp.saveMoodSchemes();
        healthApp.renderMoodCalendar();
        renderCurrentSchemeEditor();
    }
}

function selectMood(dateKey, moodName, emoji) {
    healthApp.moodRecords[dateKey] = moodName;
    healthApp.saveMoodRecords();
    healthApp.renderMoodCalendar();
    closeMoodSelector();
}

function clearMood(dateKey) {
    delete healthApp.moodRecords[dateKey];
    healthApp.saveMoodRecords();
    healthApp.renderMoodCalendar();
    closeMoodSelector();
}

function closeMoodSelector() {
    const popup = document.querySelector('.mood-selector-popup');
    if (popup) {
        popup.remove();
    }
}

function openMoodStats() {
    document.getElementById('moodStatsModal').classList.add('active');
    renderYearlyMoodStats();
}

function closeMoodStatsModal() {
    document.getElementById('moodStatsModal').classList.remove('active');
}

function renderYearlyMoodStats() {
    const yearlyStats = document.getElementById('moodYearlyStats');
    const currentYear = new Date().getFullYear();
    
    yearlyStats.innerHTML = '';
    
    for (let month = 1; month <= 12; month++) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-mood-grid';
        
        const daysInMonth = new Date(currentYear, month, 0).getDate();
        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = `${month}月`;
        
        const monthDays = document.createElement('div');
        monthDays.className = 'month-days';
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayDiv = document.createElement('div');
            dayDiv.className = 'month-day';
            
            const moodRecord = healthApp.moodRecords[dateKey];
            if (moodRecord) {
                const moodItem = healthApp.currentMoodScheme.moods.find(m => m.name === moodRecord);
                if (moodItem) {
                    dayDiv.textContent = moodItem.emoji;
                    dayDiv.classList.add('has-mood');
                } else {
                    dayDiv.textContent = day;
                }
            } else {
                dayDiv.textContent = day;
            }
            
            monthDays.appendChild(dayDiv);
        }
        
        monthDiv.appendChild(monthTitle);
        monthDiv.appendChild(monthDays);
        yearlyStats.appendChild(monthDiv);
    }
}

// 监听记账类型变化
document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('accountingType');
    if (typeSelect) {
        typeSelect.addEventListener('change', loadAccountingCategories);
    }
});

// 保存颜色功能
function saveCurrentColor() {
    const colorInput = document.getElementById('todoColor');
    const currentColor = colorInput.value;
    
    // 检查颜色是否已存在
    if (healthApp.savedColors.includes(currentColor)) {
        alert('该颜色已经保存过了！');
        return;
    }
    
    // 限制最多保存12个颜色
    if (healthApp.savedColors.length >= 12) {
        alert('最多只能保存12个颜色，请先删除一些颜色！');
        return;
    }
    
    healthApp.savedColors.push(currentColor);
    healthApp.saveSavedColors();
    healthApp.renderSavedColors();
}

function selectSavedColor(color) {
    const colorInput = document.getElementById('todoColor');
    colorInput.value = color;
    
    // 更新所有保存颜色项的选中状态
    document.querySelectorAll('.saved-color-item').forEach(item => {
        item.classList.remove('selected');
        if (item.style.backgroundColor === color) {
            item.classList.add('selected');
        }
    });
}

function deleteSavedColor(index) {
    if (confirm('确定删除这个颜色吗？')) {
        healthApp.savedColors.splice(index, 1);
        healthApp.saveSavedColors();
        healthApp.renderSavedColors();
    }
}
// 健康app设置功能
function openHealthSettings() {
    document.getElementById('healthSettingsModal').classList.add('active');
    showSettingsTab('css');
    renderCssSchemes();
    loadBackgroundSettings();
    loadFontSettings();
    console.log('健康设置弹窗已打开');
}

function closeHealthSettings() {
    document.getElementById('healthSettingsModal').classList.remove('active');
}

function showSettingsTab(tabName) {
    // 更新标签页状态
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'SettingsTab').classList.add('active');
}

// CSS设置功能
function renderCssSchemes() {
    const schemesList = document.getElementById('cssSchemesList');
    schemesList.innerHTML = '';
    
    healthApp.cssSchemes.forEach(scheme => {
        const item = document.createElement('div');
        item.className = `css-scheme-item ${scheme.id === healthApp.currentCssScheme.id ? 'active' : ''}`;
        item.innerHTML = `
            <span class="css-scheme-name">${scheme.name}</span>
            <div class="css-scheme-actions">
                <button onclick="switchCssScheme('${scheme.id}')">使用</button>
                <button onclick="editCssScheme('${scheme.id}')">编辑</button>
                ${scheme.id !== 'default' ? `<button onclick="deleteCssScheme('${scheme.id}')">删除</button>` : ''}
            </div>
        `;
        schemesList.appendChild(item);
    });
    
    // 只在初始化时加载当前方案到编辑器
    const cssEditor = document.getElementById('cssEditor');
    if (cssEditor && (!cssEditor.value || cssEditor.value.trim() === '')) {
        cssEditor.value = healthApp.currentCssScheme.css || '';
    }
}

function createNewCssScheme() {
    const name = prompt('请输入新方案名称：');
    if (name && name.trim()) {
        const newScheme = {
            id: Date.now().toString(),
            name: name.trim(),
            css: healthApp.getDefaultCss()
        };
        healthApp.cssSchemes.push(newScheme);
        healthApp.saveCssSchemes();
        
        // 自动切换到新创建的方案
        healthApp.currentCssScheme = newScheme;
        healthApp.saveCurrentCssScheme();
        healthApp.applyCssToPage(newScheme.css);
        
        // 更新编辑器内容
        document.getElementById('cssEditor').value = newScheme.css;
        
        // 重新渲染方案列表
        renderCssSchemes();
        
        console.log('新CSS方案已创建:', name);
    }
}

function switchCssScheme(schemeId) {
    const scheme = healthApp.cssSchemes.find(s => s.id === schemeId);
    if (scheme) {
        healthApp.currentCssScheme = scheme;
        healthApp.saveCurrentCssScheme();
        healthApp.applyCssToPage(healthApp.currentCssScheme.css);
        
        // 更新编辑器内容
        document.getElementById('cssEditor').value = healthApp.currentCssScheme.css || '';
        
        // 重新渲染方案列表以更新激活状态
        renderCssSchemes();
        
        console.log('已切换到CSS方案:', scheme.name);
    }
}

function editCssScheme(schemeId) {
    const scheme = healthApp.cssSchemes.find(s => s.id === schemeId);
    if (scheme) {
        document.getElementById('cssEditor').value = scheme.css;
        switchCssScheme(schemeId);
    }
}

function deleteCssScheme(schemeId) {
    if (confirm('确定删除这个CSS方案吗？')) {
        healthApp.cssSchemes = healthApp.cssSchemes.filter(s => s.id !== schemeId);
        if (healthApp.currentCssScheme.id === schemeId) {
            healthApp.currentCssScheme = healthApp.cssSchemes[0];
            healthApp.saveCurrentCssScheme();
            healthApp.applyCssToPage(healthApp.currentCssScheme.css);
        }
        healthApp.saveCssSchemes();
        renderCssSchemes();
    }
}

function applyCssChanges() {
    const css = document.getElementById('cssEditor').value;
    healthApp.applyCssToPage(css);
    console.log('CSS更改已应用');
}

function saveCssScheme() {
    const css = document.getElementById('cssEditor').value;
    if (healthApp.currentCssScheme) {
        healthApp.currentCssScheme.css = css;
        healthApp.saveCssSchemes();
        alert('CSS方案已保存！');
    }
}

function resetToDefaultCss() {
    if (confirm('确定恢复到默认样式吗？这将覆盖当前的自定义样式。')) {
        const defaultCss = healthApp.getDefaultCss();
        document.getElementById('cssEditor').value = defaultCss;
        healthApp.applyCssToPage(defaultCss);
        if (healthApp.currentCssScheme) {
            healthApp.currentCssScheme.css = defaultCss;
            healthApp.saveCssSchemes();
        }
    }
}

function exportCssScheme() {
    const css = document.getElementById('cssEditor').value;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-plan-page-${healthApp.currentCssScheme.name || 'custom'}.css`;
    a.click();
    URL.revokeObjectURL(url);
}

function importCssScheme() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.css';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const css = event.target.result;
                document.getElementById('cssEditor').value = css;
                healthApp.applyCssToPage(css);
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// 背景设置功能
function loadBackgroundSettings() {
    const settings = healthApp.backgroundSettings;
    document.getElementById('backgroundUrl').value = settings.url || '';
    document.getElementById('backgroundMode').value = settings.mode || 'cover';
    document.getElementById('backgroundPosition').value = settings.position || 'center';
    
    if (settings.url) {
        const preview = document.getElementById('backgroundPreview');
        preview.style.backgroundImage = `url('${settings.url}')`;
        preview.style.backgroundSize = settings.mode || 'cover';
        preview.style.backgroundPosition = settings.position || 'center';
    }
}

function applyBackground() {
    const url = document.getElementById('backgroundUrl').value.trim();
    const mode = document.getElementById('backgroundMode').value;
    const position = document.getElementById('backgroundPosition').value;
    
    if (!url) {
        alert('请输入背景图片URL');
        return;
    }
    
    const settings = { url, mode, position };
    healthApp.backgroundSettings = settings;
    healthApp.saveBackgroundSettings();
    healthApp.applyBackgroundToPage(settings);
    
    // 更新预览
    const preview = document.getElementById('backgroundPreview');
    preview.style.backgroundImage = `url('${url}')`;
    preview.style.backgroundSize = mode;
    preview.style.backgroundPosition = position;
}

function removeBackground() {
    healthApp.backgroundSettings = {};
    healthApp.saveBackgroundSettings();
    
    const container = document.querySelector('.health-container');
    if (container) {
        container.style.backgroundImage = '';
    }
    
    const preview = document.getElementById('backgroundPreview');
    preview.style.backgroundImage = '';
    
    document.getElementById('backgroundUrl').value = '';
}

// 字体设置功能
function loadFontSettings() {
    const settings = healthApp.fontSettings;
    document.getElementById('fontFamily').value = settings.fontFamily || "'Georgia', 'Times New Roman', serif";
    document.getElementById('fontSize').value = settings.fontSize || 16;
    document.getElementById('fontSizeValue').textContent = (settings.fontSize || 16) + 'px';
    document.getElementById('fontWeight').value = settings.fontWeight || 'normal';
    
    if (settings.fontFamily === 'custom') {
        document.getElementById('customFontRow').style.display = 'flex';
        document.getElementById('customFont').value = settings.customFontValue || '';
    }
    
    updateFontPreview();
}

function applyFontSettings() {
    let fontFamily = document.getElementById('fontFamily').value;
    const fontSize = document.getElementById('fontSize').value;
    const fontWeight = document.getElementById('fontWeight').value;
    
    if (fontFamily === 'custom') {
        fontFamily = document.getElementById('customFont').value.trim();
        if (!fontFamily) {
            alert('请输入自定义字体');
            return;
        }
    }
    
    const settings = {
        fontFamily: fontFamily,
        fontSize: parseInt(fontSize),
        fontWeight: fontWeight,
        customFontValue: fontFamily === document.getElementById('customFont').value ? fontFamily : ''
    };
    
    healthApp.fontSettings = settings;
    healthApp.saveFontSettings();
    healthApp.applyFontToPage(settings);
    updateFontPreview();
}

function resetFontSettings() {
    healthApp.fontSettings = {};
    healthApp.saveFontSettings();
    
    const container = document.querySelector('.health-container');
    if (container) {
        container.style.fontFamily = '';
        container.style.fontSize = '';
        container.style.fontWeight = '';
    }
    
    loadFontSettings();
}

function updateFontPreview() {
    const preview = document.getElementById('fontPreview');
    const fontFamily = document.getElementById('fontFamily').value;
    const fontSize = document.getElementById('fontSize').value;
    const fontWeight = document.getElementById('fontWeight').value;
    
    let actualFontFamily = fontFamily;
    if (fontFamily === 'custom') {
        actualFontFamily = document.getElementById('customFont').value || "'Georgia', 'Times New Roman', serif";
    }
    
    preview.style.fontFamily = actualFontFamily;
    preview.style.fontSize = fontSize + 'px';
    preview.style.fontWeight = fontWeight;
}

// 扩展DOMContentLoaded监听器
document.addEventListener('DOMContentLoaded', () => {
    // 原有的监听器
    const typeSelect = document.getElementById('accountingType');
    if (typeSelect) {
        typeSelect.addEventListener('change', loadAccountingCategories);
    }
    
    // 新增的字体设置监听器
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontSizeRange = document.getElementById('fontSize');
    const customFontInput = document.getElementById('customFont');
    
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', () => {
            const customRow = document.getElementById('customFontRow');
            if (fontFamilySelect.value === 'custom') {
                customRow.style.display = 'flex';
            } else {
                customRow.style.display = 'none';
            }
            updateFontPreview();
        });
    }
    
    if (fontSizeRange) {
        fontSizeRange.addEventListener('input', () => {
            document.getElementById('fontSizeValue').textContent = fontSizeRange.value + 'px';
            updateFontPreview();
        });
    }
    
    if (customFontInput) {
        customFontInput.addEventListener('input', updateFontPreview);
    }
});

// ==================== 分享报告到CHAR ====================

// 当前选中的报告周期
let currentReportPeriod = 'daily';
// 当前生成的报告文本
let currentReportText = '';
// 当前发送模式: 'report' | 'diary'
let shareSendMode = 'report';
// 当前日记识图文本
let currentDiaryVisionText = '';
// 选中的CHAR联系人ID
let selectedShareCharId = null;

// ==================== ReportGenerator 报告生成器 ====================

const ReportGenerator = {
    getDateRange(period) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate, endDate;

        if (period === 'daily') {
            startDate = new Date(today);
            endDate = new Date(today);
        } else if (period === 'weekly') {
            const day = today.getDay();
            const diff = day === 0 ? 6 : day - 1; // Monday = 0
            startDate = new Date(today);
            startDate.setDate(today.getDate() - diff);
            endDate = new Date(today);
        } else { // monthly
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today);
        }
        return { startDate, endDate };
    },

    formatDateKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },

    isDateInRange(dateStr, startDate, endDate) {
        const d = new Date(dateStr);
        const ds = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const ss = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const es = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        return ds >= ss && ds <= es;
    },

    collectPlanData(startDate, endDate) {
        const sections = [];

        // 习惯追踪
        try {
            const habits = JSON.parse(localStorage.getItem('health-habit-trackers') || '[]');
            if (habits.length > 0) {
                let totalDone = 0, totalPossible = 0;
                const lines = [];
                habits.forEach(h => {
                    const dates = h.dates || {};
                    let done = 0, possible = 0;
                    const d = new Date(startDate);
                    while (d <= endDate) {
                        const key = this.formatDateKey(d);
                        possible++;
                        if (dates[key]) done++;
                        d.setDate(d.getDate() + 1);
                    }
                    totalDone += done;
                    totalPossible += possible;
                    lines.push(`- ${h.name}：${done}/${possible} ${done === possible ? '✓' : '✗'}`);
                });
                const rate = totalPossible > 0 ? Math.round(totalDone / totalPossible * 100) : 0;
                lines.push(`完成率：${rate}%`);
                sections.push({ title: '📋 习惯追踪', content: lines.join('\n') });
            } else {
                sections.push({ title: '📋 习惯追踪', content: '暂无数据' });
            }
        } catch (e) { sections.push({ title: '📋 习惯追踪', content: '暂无数据' }); }

        // 待办事项
        try {
            const todos = JSON.parse(localStorage.getItem('todos') || '{}');
            const weeklyTodos = JSON.parse(localStorage.getItem('weekly-todos') || '[]');
            const lines = [];
            let totalDone = 0, totalCount = 0;

            // 日待办
            Object.keys(todos).forEach(dateKey => {
                if (this.isDateInRange(dateKey, startDate, endDate)) {
                    const dayTodos = todos[dateKey] || [];
                    dayTodos.forEach(t => {
                        totalCount++;
                        if (t.completed) totalDone++;
                        lines.push(`- ${t.text} ${t.completed ? '✓' : '✗'}`);
                    });
                }
            });

            // 周待办
            weeklyTodos.forEach(t => {
                totalCount++;
                if (t.completed) totalDone++;
                lines.push(`- [周] ${t.text} ${t.completed ? '✓' : '✗'}`);
            });

            if (totalCount > 0) {
                const rate = Math.round(totalDone / totalCount * 100);
                lines.push(`完成率：${rate}%`);
                sections.push({ title: '📝 待办事项', content: lines.join('\n') });
            } else {
                sections.push({ title: '📝 待办事项', content: '暂无数据' });
            }
        } catch (e) { sections.push({ title: '📝 待办事项', content: '暂无数据' }); }

        // 活动记录
        try {
            const activities = JSON.parse(localStorage.getItem('health-activities') || '[]');
            const filtered = activities.filter(a => this.isDateInRange(a.date, startDate, endDate));
            if (filtered.length > 0) {
                const lines = filtered.map(a => `- ${a.date} ${a.name}${a.duration ? ' ' + a.duration : ''}`);
                sections.push({ title: '🏃 活动记录', content: lines.join('\n') });
            } else {
                sections.push({ title: '🏃 活动记录', content: '暂无数据' });
            }
        } catch (e) { sections.push({ title: '🏃 活动记录', content: '暂无数据' }); }

        // 记账
        try {
            const records = JSON.parse(localStorage.getItem('health-accounting') || '[]');
            const filtered = records.filter(r => this.isDateInRange(r.date, startDate, endDate));
            if (filtered.length > 0) {
                let income = 0, expense = 0;
                const lines = [];
                filtered.forEach(r => {
                    const amt = parseFloat(r.amount) || 0;
                    if (r.type === 'income') income += amt;
                    else expense += amt;
                    lines.push(`- ${r.type === 'income' ? '收入' : '支出'} ¥${amt} ${r.category || ''} ${r.note || ''}`);
                });
                lines.unshift(`收入：¥${income} | 支出：¥${expense}`);
                sections.push({ title: '💰 收支情况', content: lines.join('\n') });
            } else {
                sections.push({ title: '💰 收支情况', content: '暂无数据' });
            }
        } catch (e) { sections.push({ title: '💰 收支情况', content: '暂无数据' }); }

        // 情绪
        try {
            const moodRecords = JSON.parse(localStorage.getItem('health-mood-records') || '{}');
            const moodSchemes = JSON.parse(localStorage.getItem('health-mood-schemes') || '[]');
            const currentSchemeId = localStorage.getItem('health-current-mood-scheme') || 'default';
            const currentScheme = moodSchemes.find(s => s.id === currentSchemeId) || moodSchemes[0];
            const lines = [];
            const d = new Date(startDate);
            while (d <= endDate) {
                const key = this.formatDateKey(d);
                if (moodRecords[key]) {
                    const moodName = moodRecords[key]; // 存储的是心情名称字符串
                    let emoji = '';
                    if (currentScheme && currentScheme.moods) {
                        const moodItem = currentScheme.moods.find(m => m.name === moodName);
                        if (moodItem) emoji = moodItem.emoji;
                    }
                    lines.push(`- ${key}: ${emoji} ${moodName}`);
                }
                d.setDate(d.getDate() + 1);
            }
            if (lines.length > 0) {
                sections.push({ title: '😊 情绪记录', content: lines.join('\n') });
            } else {
                sections.push({ title: '😊 情绪记录', content: '暂无数据' });
            }
        } catch (e) { sections.push({ title: '😊 情绪记录', content: '暂无数据' }); }

        return sections;
    },

    collectHealthData(startDate, endDate) {
        const sections = [];
        try {
            const data = JSON.parse(localStorage.getItem('health-page-data') || '{}');

            // 睡眠
            const sleepRecords = data.sleep || {};
            const sleepLines = [];
            let totalSleep = 0, sleepCount = 0;
            const d1 = new Date(startDate);
            while (d1 <= endDate) {
                const key = this.formatDateKey(d1);
                if (sleepRecords[key]) {
                    const s = sleepRecords[key];
                    const hours = parseFloat(s.duration || s.hours || 0);
                    if (hours > 0) { totalSleep += hours; sleepCount++; }
                    const timeInfo = (s.sleepTime && s.wakeTime) ? `${s.sleepTime}-${s.wakeTime} ` : '';
                    sleepLines.push(`- ${key}: ${timeInfo}${hours}小时${s.quality ? ' (' + s.quality + ')' : ''}`);
                }
                d1.setDate(d1.getDate() + 1);
            }
            if (sleepCount > 0) {
                sleepLines.unshift(`平均睡眠时长：${(totalSleep / sleepCount).toFixed(1)}小时`);
                sections.push({ title: '💤 睡眠', content: sleepLines.join('\n') });
            } else {
                sections.push({ title: '💤 睡眠', content: '暂无数据' });
            }

            // 护肤
            const skinRecords = data.skincare || {};
            const skinLines = [];
            const d2 = new Date(startDate);
            while (d2 <= endDate) {
                const key = this.formatDateKey(d2);
                if (skinRecords[key]) {
                    const s = skinRecords[key];
                    if (Array.isArray(s)) {
                        const typeNames = s.map(item => item.typeName || item.type || '护肤').join('、');
                        skinLines.push(`- ${key}: ${typeNames}`);
                    } else if (typeof s === 'string') {
                        skinLines.push(`- ${key}: ${s}`);
                    } else {
                        skinLines.push(`- ${key}: 已记录`);
                    }
                }
                d2.setDate(d2.getDate() + 1);
            }
            sections.push({ title: '🧴 护肤', content: skinLines.length > 0 ? skinLines.join('\n') : '暂无数据' });

            // 生理期
            const periodRecords = data.period || {};
            const periodLines = [];
            const d3 = new Date(startDate);
            while (d3 <= endDate) {
                const key = this.formatDateKey(d3);
                if (periodRecords[key]) {
                    const p = periodRecords[key];
                    periodLines.push(`- ${key}: ${p.action || p.status || '有记录'}`);
                }
                d3.setDate(d3.getDate() + 1);
            }
            sections.push({ title: '🩸 生理期', content: periodLines.length > 0 ? periodLines.join('\n') : '暂无数据' });

            // 运动
            const exerciseRecords = data.exercise || {};
            const exerciseLines = [];
            const d4 = new Date(startDate);
            while (d4 <= endDate) {
                const key = this.formatDateKey(d4);
                if (exerciseRecords[key]) {
                    const e = exerciseRecords[key];
                    const parts = [];
                    if (e.steps) parts.push(`${e.steps}步`);
                    if (e.hasExercise) parts.push('已运动');
                    if (e.custom) parts.push(e.custom);
                    if (e.notes) parts.push(e.notes);
                    exerciseLines.push(`- ${key}: ${parts.length > 0 ? parts.join(' | ') : '已记录'}`);
                }
                d4.setDate(d4.getDate() + 1);
            }
            sections.push({ title: '🏋️ 运动', content: exerciseLines.length > 0 ? exerciseLines.join('\n') : '暂无数据' });

            // 排便
            const bowelRecords = data.bowel || {};
            const bowelLines = [];
            let bowelCount = 0;
            const d5 = new Date(startDate);
            while (d5 <= endDate) {
                const key = this.formatDateKey(d5);
                if (bowelRecords[key]) {
                    bowelCount++;
                    const b = bowelRecords[key];
                    const info = b.time ? `${b.time}` : '已记录';
                    bowelLines.push(`- ${key}: ${info}`);
                }
                d5.setDate(d5.getDate() + 1);
            }
            if (bowelCount > 0) {
                bowelLines.unshift(`共${bowelCount}次`);
            }
            sections.push({ title: '🚽 排便', content: bowelLines.length > 0 ? bowelLines.join('\n') : '暂无数据' });

            // 餐饮
            const mealRecords = data.meals || {};
            const mealLines = [];
            const mealTypeNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', other: '其他' };
            const d6 = new Date(startDate);
            while (d6 <= endDate) {
                const key = this.formatDateKey(d6);
                if (mealRecords[key]) {
                    const m = mealRecords[key];
                    if (typeof m === 'object') {
                        Object.keys(m).forEach(mealType => {
                            const meal = m[mealType];
                            const label = mealTypeNames[mealType] || mealType;
                            if (typeof meal === 'string') {
                                if (meal) mealLines.push(`- ${key} ${label}: ${meal}`);
                            } else if (typeof meal === 'object') {
                                if (mealType === 'other' && meal.items) {
                                    // 其他餐饮有子条目
                                    const itemDescs = Object.values(meal.items)
                                        .map(item => item.description)
                                        .filter(d => d);
                                    const desc = meal.description || '';
                                    const allDescs = [desc, ...itemDescs].filter(d => d).join('、');
                                    if (allDescs) mealLines.push(`- ${key} ${label}: ${allDescs}`);
                                } else {
                                    const desc = meal.description || '';
                                    if (desc) mealLines.push(`- ${key} ${label}: ${desc}`);
                                }
                            }
                        });
                    }
                }
                d6.setDate(d6.getDate() + 1);
            }
            sections.push({ title: '🍽️ 餐饮', content: mealLines.length > 0 ? mealLines.join('\n') : '暂无数据' });

        } catch (e) {
            console.warn('收集健康数据失败:', e);
            sections.push({ title: '💤 睡眠', content: '暂无数据' });
            sections.push({ title: '🧴 护肤', content: '暂无数据' });
            sections.push({ title: '🩸 生理期', content: '暂无数据' });
            sections.push({ title: '🏋️ 运动', content: '暂无数据' });
            sections.push({ title: '🚽 排便', content: '暂无数据' });
            sections.push({ title: '🍽️ 餐饮', content: '暂无数据' });
        }
        return sections;
    },

    generate(period) {
        const { startDate, endDate } = this.getDateRange(period);
        const planSections = this.collectPlanData(startDate, endDate);
        const healthSections = this.collectHealthData(startDate, endDate);
        const sections = [...planSections, ...healthSections];

        const typeMap = { daily: '日报', weekly: '周报', monthly: '月报' };
        const dateRange = startDate.getTime() === endDate.getTime()
            ? this.formatDateKey(startDate)
            : `${this.formatDateKey(startDate)} ~ ${this.formatDateKey(endDate)}`;

        const report = {
            type: period,
            dateRange: dateRange,
            sections: sections
        };
        report.rawText = this.formatReport(report);
        return report;
    },

    formatReport(report) {
        const typeMap = { daily: '日报', weekly: '周报', monthly: '月报' };
        let text = `===== ${typeMap[report.type] || report.type} =====\n`;
        text += `日期范围：${report.dateRange}\n`;
        report.sections.forEach(s => {
            text += `\n${s.title}\n${s.content}\n`;
        });
        return text;
    },

    parseReport(text) {
        const lines = text.split('\n');
        let type = 'daily';
        let dateRange = '';
        const sections = [];

        const typeMatch = lines[0]?.match(/=====\s*(.+?)\s*=====/);
        if (typeMatch) {
            const typeMap = { '日报': 'daily', '周报': 'weekly', '月报': 'monthly' };
            type = typeMap[typeMatch[1]] || typeMatch[1];
        }

        const rangeMatch = lines[1]?.match(/日期范围：(.+)/);
        if (rangeMatch) dateRange = rangeMatch[1];

        let currentTitle = null;
        let currentContent = [];
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i];
            // Check if line is a section title (starts with emoji)
            if (/^[📋📝🏃💰😊💤🧴🩸🏋️🚽🍽️]/.test(line.trim()) && !line.trim().startsWith('-')) {
                if (currentTitle !== null) {
                    sections.push({ title: currentTitle, content: currentContent.join('\n') });
                }
                currentTitle = line.trim();
                currentContent = [];
            } else if (line.trim() !== '' || currentTitle !== null) {
                if (currentTitle !== null) {
                    currentContent.push(line);
                }
            }
        }
        if (currentTitle !== null) {
            sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
        }

        return { type, dateRange, sections };
    }
};

// ==================== ChatInjector 聊天注入器 ====================

const ChatInjector = {
    getContacts() {
        try {
            return JSON.parse(localStorage.getItem('vibe_contacts') || '[]');
        } catch (e) { return []; }
    },

    saveContacts(contacts) {
        localStorage.setItem('vibe_contacts', JSON.stringify(contacts));
    },

    getApiConfig(contact) {
        let apiUrl, apiKey, model;
        if (contact.apiScheme) {
            try {
                const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
                const scheme = schemes.find(s => s.id === contact.apiScheme);
                if (scheme) {
                    apiUrl = scheme.apiUrl;
                    apiKey = scheme.apiKey;
                    model = scheme.model;
                }
            } catch (e) {}
        }
        if (!apiUrl) {
            apiUrl = localStorage.getItem('apiUrl');
            apiKey = localStorage.getItem('apiKey');
            model = contact.model || localStorage.getItem('selectedModel');
        }
        return { apiUrl, apiKey, model };
    },

    async sendReport(contactId, reportText) {
        const contacts = this.getContacts();
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return { success: false, error: '联系人不存在' };
        return await this.injectAndGetReply(contact, contacts, reportText);
    },

    async sendDiaryShare(contactId, diaryDescription) {
        const contacts = this.getContacts();
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return { success: false, error: '联系人不存在' };
        const message = '[日记分享] ' + diaryDescription;
        const extraPrompt = '用户分享了一页日记，以下是日记内容的文字描述，请对日记内容进行评论。';
        return await this.injectAndGetReply(contact, contacts, message, extraPrompt);
    },

    async injectAndGetReply(contact, contacts, userMessage, extraSystemPrompt) {
        // 写入用户消息
        if (!contact.chat_history) contact.chat_history = [];
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        };
        contact.chat_history.push(userMsg);
        this.saveContacts(contacts);

        // 获取API配置
        const { apiUrl, apiKey, model } = this.getApiConfig(contact);
        if (!apiUrl || !apiKey) {
            return { success: false, error: 'API未配置，报告已保存到聊天记录，请在聊天页面重试' };
        }

        try {
            // 构建消息
            let systemContent = contact.persona || '你是一个AI助手。';
            if (extraSystemPrompt) {
                systemContent += '\n\n' + extraSystemPrompt;
            }

            const messages = [
                { role: 'system', content: systemContent }
            ];

            // 添加最近的聊天历史（最多20条）
            const recentHistory = contact.chat_history.slice(-21, -1);
            recentHistory.forEach(msg => {
                messages.push({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.message
                });
            });

            // 添加当前消息
            messages.push({ role: 'user', content: userMessage });

            const url = apiUrl.replace(/\/+$/, '') + '/chat/completions';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ model, messages })
            });

            if (!response.ok) {
                return { success: false, error: `AI回复失败 (${response.status})，请在聊天页面重试` };
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
                const aiMsg = {
                    id: Date.now() + 1,
                    sender: contact.name || 'AI',
                    message: reply.trim(),
                    timestamp: new Date().toISOString()
                };
                contact.chat_history.push(aiMsg);
                this.saveContacts(contacts);
                return { success: true, reply: reply.trim() };
            } else {
                return { success: false, error: 'AI返回数据格式异常' };
            }
        } catch (e) {
            console.error('ChatInjector 调用失败:', e);
            return { success: false, error: `AI回复失败: ${e.message}，请在聊天页面重试` };
        }
    }
};

// ==================== Share Page 交互逻辑 ====================

function initSharePage() {
    loadDiaryThumbnails();
}

function selectReportPeriod(period) {
    currentReportPeriod = period;
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-period') === period);
    });
}

function generateReport() {
    const report = ReportGenerator.generate(currentReportPeriod);
    currentReportText = report.rawText;
    document.getElementById('reportPreviewText').textContent = currentReportText;
    document.getElementById('reportPreviewSection').style.display = 'block';
}

function loadDiaryThumbnails() {
    const container = document.getElementById('diaryThumbnails');
    if (!container) return;
    container.innerHTML = '';

    try {
        // 读取日记本列表
        const books = JSON.parse(localStorage.getItem('diary-books') || '[]');
        if (books.length === 0) {
            container.innerHTML = '<p class="share-desc">暂无日记本</p>';
            return;
        }

        books.forEach(book => {
            const pages = book.pages || [];
            pages.forEach((page, idx) => {
                const thumb = document.createElement('div');
                thumb.className = 'diary-thumb';
                thumb.innerHTML = `<span>${book.name} P${idx + 1}</span>`;
                thumb.onclick = () => recognizeDiaryPage(book.id, idx);
                container.appendChild(thumb);
            });
        });

        if (container.children.length === 0) {
            container.innerHTML = '<p class="share-desc">暂无日记页面</p>';
        }
    } catch (e) {
        container.innerHTML = '<p class="share-desc">加载日记失败</p>';
    }
}

async function recognizeDiaryPage(bookId, pageIndex) {
    if (!window.VisionRelay || !VisionRelay.isConfigured()) {
        alert('请先在应用总设置（设置 → 识图中转API）中配置识图中转API');
        return;
    }

    const resultDiv = document.getElementById('diaryVisionResult');
    const textEl = document.getElementById('diaryVisionText');
    resultDiv.style.display = 'block';
    textEl.textContent = '正在识别图片...';

    try {
        const books = JSON.parse(localStorage.getItem('diary-books') || '[]');
        const book = books.find(b => b.id === bookId);
        if (!book || !book.pages[pageIndex]) {
            textEl.textContent = '日记页面不存在';
            return;
        }

        const pageData = book.pages[pageIndex];
        // 尝试从 fabric.js canvas 数据导出图片
        let base64Image = null;
        if (pageData.canvasData || pageData.data) {
            // 创建临时 canvas 来导出
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 800;
            tempCanvas.height = 600;
            const fabricCanvas = new fabric.Canvas(tempCanvas);
            await new Promise((resolve) => {
                fabricCanvas.loadFromJSON(pageData.canvasData || pageData.data, () => {
                    fabricCanvas.renderAll();
                    resolve();
                });
            });
            base64Image = fabricCanvas.toDataURL('image/png');
            fabricCanvas.dispose();
        } else if (pageData.thumbnail) {
            base64Image = pageData.thumbnail;
        }

        if (!base64Image) {
            textEl.textContent = '无法导出日记页面图片';
            return;
        }

        const result = await VisionRelay.describeImage(base64Image);
        if (result.success) {
            currentDiaryVisionText = result.description;
            textEl.textContent = result.description;
        } else {
            textEl.textContent = '识图失败: ' + result.error;
        }
    } catch (e) {
        textEl.textContent = '识图失败: ' + e.message;
    }
}

function showSendReportDialog() {
    if (!currentReportText) {
        alert('请先生成报告');
        return;
    }
    shareSendMode = 'report';
    openShareCharModal();
}

function showSendDiaryDialog() {
    if (!currentDiaryVisionText) {
        alert('请先识别日记页面');
        return;
    }
    shareSendMode = 'diary';
    openShareCharModal();
}

function openShareCharModal() {
    const modal = document.getElementById('shareCharModal');
    const list = document.getElementById('shareCharList');
    modal.style.display = 'flex';

    const contacts = ChatInjector.getContacts();
    list.innerHTML = '';

    if (contacts.length === 0) {
        list.innerHTML = '<p class="share-desc">暂无联系人，请先在聊天页面创建联系人</p>';
        return;
    }

    contacts.forEach(c => {
        const item = document.createElement('div');
        item.className = 'share-char-item' + (selectedShareCharId === c.id ? ' selected' : '');
        item.innerHTML = `<span class="char-avatar">${c.avatar || '👤'}</span><span>${c.name || '未命名'}</span>`;
        item.onclick = () => {
            selectedShareCharId = c.id;
            document.querySelectorAll('.share-char-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
        };
        list.appendChild(item);
    });
}

function closeShareCharModal() {
    document.getElementById('shareCharModal').style.display = 'none';
}

async function confirmSendToChar() {
    if (!selectedShareCharId) {
        alert('请选择一个CHAR');
        return;
    }

    const toast = document.getElementById('shareToast');
    toast.style.display = 'block';
    toast.textContent = '正在发送...';

    let result;
    if (shareSendMode === 'report') {
        result = await ChatInjector.sendReport(selectedShareCharId, currentReportText);
    } else {
        result = await ChatInjector.sendDiaryShare(selectedShareCharId, currentDiaryVisionText);
    }

    closeShareCharModal();

    if (result.success) {
        toast.innerHTML = `✅ 发送成功！<a href="message.html" style="color: #667eea; margin-left: 8px;">前往聊天查看</a>`;
    } else {
        toast.textContent = '❌ ' + result.error;
    }

    setTimeout(() => { toast.style.display = 'none'; }, 5000);
}
