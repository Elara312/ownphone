// 待办清单管理
let currentTodoDate = new Date().toISOString().split('T')[0];

// 打开待办弹窗
function openTodoModal() {
    const modal = document.getElementById('todoModal');
    modal.classList.add('active');
    document.getElementById('todoDate').value = currentTodoDate;
    loadTodos();
}

// 关闭待办弹窗
function closeTodoModal() {
    const modal = document.getElementById('todoModal');
    modal.classList.remove('active');
}

// 加载待办事项
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '{}');
    const dateTodos = todos[currentTodoDate] || [];
    
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    dateTodos.forEach((todo, index) => {
        const item = document.createElement('div');
        item.className = `todo-list-item ${todo.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${index})">
            <span>${todo.text}</span>
            <button onclick="deleteTodo(${index})">删除</button>
        `;
        todoList.appendChild(item);
    });
}

// 添加待办
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const todos = JSON.parse(localStorage.getItem('todos') || '{}');
    if (!todos[currentTodoDate]) {
        todos[currentTodoDate] = [];
    }
    
    todos[currentTodoDate].push({
        text: text,
        completed: false
    });
    
    localStorage.setItem('todos', JSON.stringify(todos));
    input.value = '';
    loadTodos();
    updateAllWidgets();
}

// 切换待办状态
function toggleTodo(index) {
    const todos = JSON.parse(localStorage.getItem('todos') || '{}');
    if (todos[currentTodoDate] && todos[currentTodoDate][index]) {
        todos[currentTodoDate][index].completed = !todos[currentTodoDate][index].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
        updateAllWidgets();
    }
}

// 删除待办
function deleteTodo(index) {
    const todos = JSON.parse(localStorage.getItem('todos') || '{}');
    if (todos[currentTodoDate]) {
        todos[currentTodoDate].splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
        updateAllWidgets();
    }
}

// 日期选择器变化
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('todoDate');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            currentTodoDate = e.target.value;
            loadTodos();
        });
    }
});

// 创建时钟小组件
function createClockWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget clock-widget';
    
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    
    widget.innerHTML = `
        <button class="widget-close" onclick="removeWidget(this)">×</button>
        <div class="clock-time">${time}</div>
        <div class="clock-date">${date}</div>
    `;
    
    return widget;
}

// 创建待办小组件
function createTodoWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget todo-widget';
    widget.style.cursor = 'pointer';
    
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('zh-CN', { month: 'short' });
    
    const todos = JSON.parse(localStorage.getItem('todos') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const todayTodos = todos[today] || [];
    const displayTodos = todayTodos.slice(0, 4);
    
    const todoItems = displayTodos.map(todo => 
        `<div class="todo-item ${todo.completed ? 'completed' : ''}">${todo.text}</div>`
    ).join('');
    
    widget.innerHTML = `
        <button class="widget-close" onclick="event.stopPropagation(); removeWidget(this)">×</button>
        <div class="todo-left">
            <div class="todo-day">${day}</div>
            <div class="todo-month">${month}</div>
        </div>
        <div class="todo-right">
            ${todoItems || '<div class="todo-item" style="color: #999;">暂无任务</div>'}
        </div>
    `;
    
    // 添加点击事件
    widget.addEventListener('click', (e) => {
        if (!e.target.classList.contains('widget-close')) {
            openTodoModal();
        }
    });
    
    return widget;
}

// 创建日历小组件
function createCalendarWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget calendar-widget';
    
    const now = new Date();
    const weekday = now.toLocaleDateString('zh-CN', { weekday: 'short' });
    const day = now.getDate();
    const monthName = now.toLocaleDateString('zh-CN', { month: 'long' });
    
    // 获取当月日历
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    let calendarDays = '';
    
    // 上个月的日期
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays += `<span class="other-month">${daysInPrevMonth - i}</span>`;
    }
    
    // 当月日期
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === day ? 'today' : '';
        calendarDays += `<span class="${isToday}">${i}</span>`;
    }
    
    // 下个月的日期（补齐）
    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays += `<span class="other-month">${i}</span>`;
    }
    
    widget.innerHTML = `
        <button class="widget-close" onclick="removeWidget(this)">×</button>
        <div class="calendar-left">
            <div class="calendar-weekday">${weekday}</div>
            <div class="calendar-day">${day}</div>
        </div>
        <div class="calendar-right">
            <div class="calendar-header">${monthName}</div>
            <div class="calendar-weekdays">
                <span>日</span><span>一</span><span>二</span><span>三</span>
                <span>四</span><span>五</span><span>六</span>
            </div>
            <div class="calendar-days">
                ${calendarDays}
            </div>
        </div>
    `;
    
    return widget;
}

// 移除小组件
function removeWidget(btn) {
    const slot = btn.closest('.icon-slot');
    if (!slot) return;
    
    const location = slot.dataset.location;
    const position = parseInt(slot.dataset.position);
    
    const widgets = JSON.parse(localStorage.getItem('widgets') || '[]');
    const index = widgets.findIndex(w => w.location === location && w.position === position);
    
    if (index !== -1) {
        widgets.splice(index, 1);
        localStorage.setItem('widgets', JSON.stringify(widgets));
        
        // 重新渲染
        if (window.renderApps) {
            window.renderApps();
        }
    }
}

// 更新所有小组件
function updateAllWidgets() {
    document.querySelectorAll('.todo-widget').forEach(widget => {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleDateString('zh-CN', { month: 'short' });
        
        const todos = JSON.parse(localStorage.getItem('todos') || '{}');
        const today = new Date().toISOString().split('T')[0];
        const todayTodos = todos[today] || [];
        const displayTodos = todayTodos.slice(0, 4);
        
        const todoItems = displayTodos.map(todo => 
            `<div class="todo-item ${todo.completed ? 'completed' : ''}">${todo.text}</div>`
        ).join('');
        
        const closeBtn = widget.querySelector('.widget-close');
        widget.innerHTML = `
            <div class="todo-left">
                <div class="todo-day">${day}</div>
                <div class="todo-month">${month}</div>
            </div>
            <div class="todo-right">
                ${todoItems || '<div class="todo-item" style="color: #999;">暂无任务</div>'}
            </div>
        `;
        widget.appendChild(closeBtn);
        
        // 重新添加点击事件
        widget.addEventListener('click', (e) => {
            if (!e.target.classList.contains('widget-close')) {
                openTodoModal();
            }
        });
    });
}

// 内置预设小组件方案（供 app.js 和 appearance.js 共用）
const builtinWidgetSchemes = {
    clock: {
        '透明居中': `/* 透明居中时钟样式 */
.clock-widget {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 10px 20px;
    background: transparent;
    border: none;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
}

.clock-time {
    font-size: 52px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    letter-spacing: -1px;
}

.clock-date {
    font-size: 13px;
    color: rgba(255,255,255,0.85);
    margin-top: 6px;
    font-weight: 500;
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}`
    }
};

// 每分钟更新时钟
setInterval(() => {
    document.querySelectorAll('.clock-widget').forEach(widget => {
        const now = new Date();
        const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
        
        const timeEl = widget.querySelector('.clock-time');
        const dateEl = widget.querySelector('.clock-date');
        
        if (timeEl) timeEl.textContent = time;
        if (dateEl) dateEl.textContent = date;
    });
}, 60000);
