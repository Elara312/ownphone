// 应用数据
const apps = [
    { id: 1, icon: '💬', name: '消息', location: 'desktop', position: 0, url: 'message.html' },
    { id: 2, icon: '💬', name: '论坛', location: 'desktop', position: 1, url: 'forum.html' },
    { id: 3, icon: '🌐', name: '世界微博', location: 'desktop', position: 2, url: 'couple-twitter.html' },
    { id: 4, icon: '📖', name: '共读', location: 'desktop', position: 3, url: 'reading.html' },
    { id: 5, icon: '❤️', name: '健康', location: 'desktop', position: 4, url: 'health.html' },
    { id: 6, icon: '📝', name: '备忘录', location: 'desktop', position: 5, url: 'memo.html' },
    { id: 7, icon: '💳', name: '支付宝', location: 'dock', position: 0, url: 'alipay.html' },
    { id: 8, icon: '🛍️', name: '商店', location: 'dock', position: 1, url: 'shop.html' },
    { id: 9, icon: '🎵', name: '网易云音乐', location: 'dock', position: 2, url: 'music.html' },
    { id: 10, icon: '📦', name: '物流', location: 'dock', position: 3, url: 'logistics.html' },
    { id: 11, icon: '⚙️', name: '设置', location: 'dock', position: 4, url: 'settings.html' },
    { id: 12, icon: '🎨', name: '外观', location: 'dock', position: 5, url: 'appearance.html' },
    { id: 13, icon: '🐾', name: '魔法生物', location: 'desktop', position: 6, url: 'pet.html' }
];

let draggedApp = null;
let draggedElement = null;
let longPressTimer = null;
let isDragging = false;

// 辅助函数：从localStorage获取并解析JSON
function getStorageJSON(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error(`解析 ${key} 失败:`, e);
        return defaultValue;
    }
}

// 辅助函数：保存JSON到localStorage
function setStorageJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error(`保存 ${key} 失败:`, e);
        return false;
    }
}

// 初始化
async function init() {
    loadLayout();
    applyWallpaper();
    await applyCustomFont();
    renderApps();
    updateTime();
    setInterval(updateTime, 60000);
}

// 应用壁纸
function applyWallpaper() {
    const wallpaper = localStorage.getItem('wallpaper');
    if (wallpaper) {
        const screen = document.querySelector('.ipad-screen');
        const mode = localStorage.getItem('wallpaperMode') || 'cover';
        screen.style.backgroundImage = wallpaper;
        if (mode === 'repeat') {
            screen.style.backgroundSize = 'auto';
            screen.style.backgroundRepeat = 'repeat';
        } else {
            screen.style.backgroundSize = mode;
            screen.style.backgroundRepeat = 'no-repeat';
        }
        screen.style.backgroundPosition = 'center';
    }
}

// 应用自定义字体
async function applyCustomFont() {
    // 初始化 IndexedDB
    const fontDB = await initFontDB();
    
    // 加载字体方案元数据
    const fontSchemes = getStorageJSON('fontSchemes', {});
    const activeFontScheme = localStorage.getItem('activeFontScheme'); // 这是字符串，不是JSON
    
    if (activeFontScheme && fontSchemes[activeFontScheme]) {
        const scheme = fontSchemes[activeFontScheme];
        
        // 从 IndexedDB 加载完整数据
        let fontData;
        if (scheme.type === 'file') {
            try {
                const dbData = await loadFontFromDB(fontDB, activeFontScheme);
                if (dbData && dbData.data) {
                    fontData = dbData.data;
                }
            } catch (error) {
                console.error('从 IndexedDB 加载字体失败:', error);
            }
        } else if (scheme.type === 'url') {
            // URL 类型需要重新构建 fontFace
            let format = scheme.format || 'woff2';
            fontData = {
                fontFace: `@font-face { 
                    font-family: 'CustomFont_${activeFontScheme}'; 
                    src: url('${fontSchemes[activeFontScheme].source}') format('${format}');
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap;
                }`
            };
        }
        
        if (fontData) {
            let style = document.getElementById('customFontStyle');
            if (!style) {
                style = document.createElement('style');
                style.id = 'customFontStyle';
                document.head.appendChild(style);
            }
            style.textContent = fontData.fontFace;
            
            // 应用字体到所有元素
            applyFontToAllElements(scheme.fontFamily);
        }
    } else {
        const systemFont = localStorage.getItem('systemFont');
        if (systemFont) {
            applyFontToAllElements(systemFont);
        }
    }
}

// 初始化 IndexedDB
function initFontDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FontStorage', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('fonts')) {
                db.createObjectStore('fonts', { keyPath: 'name' });
            }
        };
    });
}

// 从 IndexedDB 加载字体
function loadFontFromDB(db, schemeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['fonts'], 'readonly');
        const store = transaction.objectStore('fonts');
        const request = store.get(schemeName);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 应用字体到所有元素
function applyFontToAllElements(fontFamily) {
    document.body.style.fontFamily = fontFamily;
    
    // 应用到所有表单元素
    const elements = document.querySelectorAll('input, textarea, select, button, option');
    elements.forEach(el => {
        el.style.fontFamily = fontFamily;
    });
}

// 加载布局
function loadLayout() {
    const savedApps = getStorageJSON('ipadLayout', []);
    savedApps.forEach(savedApp => {
        const app = apps.find(a => a.id === savedApp.id);
        if (app) {
            app.location = savedApp.location;
            app.position = savedApp.position;
        }
    });
    
    // 修复可能的重叠问题
    fixOverlaps();
}

// 修复重叠问题
function fixOverlaps() {
    const widgets = getStorageJSON('widgets', []);
    const occupiedSlots = new Set();
    let needsSave = false;
    
    // 标记小组件占用的槽位
    widgets.forEach(widget => {
        occupiedSlots.add(`${widget.location}-${widget.position}`);
        occupiedSlots.add(`${widget.location}-${widget.position + 1}`);
    });
    
    // 检查应用是否与小组件重叠
    apps.forEach(app => {
        const slotKey = `${app.location}-${app.position}`;
        if (occupiedSlots.has(slotKey)) {
            // 找到新的空位
            const newPos = findEmptySlot(app.location, occupiedSlots, apps);
            if (newPos !== null) {
                app.position = newPos;
                occupiedSlots.add(`${app.location}-${newPos}`);
                needsSave = true;
            }
        } else {
            occupiedSlots.add(slotKey);
        }
    });
    
    if (needsSave) {
        saveLayout();
    }
}

// 查找空槽位
function findEmptySlot(location, occupiedSlots, apps) {
    const maxSlots = location === 'desktop' ? 24 : 12;
    
    for (let i = 0; i < maxSlots; i++) {
        const slotKey = `${location}-${i}`;
        if (!occupiedSlots.has(slotKey)) {
            return i;
        }
    }
    
    return null;
}

// 保存布局
function saveLayout() {
    setStorageJSON('ipadLayout', apps);
}

// 渲染应用
function renderApps() {
    const desktopGrid = document.getElementById('desktopGrid');
    const dock = document.getElementById('dock');
    const customIcons = getStorageJSON('customIcons', {});
    
    desktopGrid.innerHTML = '';
    dock.innerHTML = '';
    
    // 创建桌面槽位 (4行 x 6列 = 24)
    for (let i = 0; i < 24; i++) {
        const slot = createSlot('desktop', i);
        desktopGrid.appendChild(slot);
    }
    
    // 创建 Dock 槽位 (12个)
    for (let i = 0; i < 12; i++) {
        const slot = createSlot('dock', i);
        dock.appendChild(slot);
    }
    
    // 标记被占用的槽位
    const occupiedSlots = new Set();
    
    // 先放置小组件（因为它们占2格）
    const widgets = getStorageJSON('widgets', []);
    widgets.forEach(widget => {
        const container = widget.location === 'desktop' ? desktopGrid : dock;
        const maxSlots = widget.location === 'desktop' ? 24 : 12;
        const slot = container.children[widget.position];
        const nextSlot = widget.position + 1 < maxSlots ? container.children[widget.position + 1] : null;
        
        if (slot && nextSlot) {
            slot.classList.remove('empty');
            slot.classList.add('widget-slot');
            
            // 标记占用的槽位
            occupiedSlots.add(`${widget.location}-${widget.position}`);
            occupiedSlots.add(`${widget.location}-${widget.position + 1}`);
            
            // 隐藏下一个槽位（因为小组件占2格）
            nextSlot.style.display = 'none';
            nextSlot.classList.add('occupied-by-widget');
            
            let widgetElement;
            
            if (widget.type === 'clock') {
                widgetElement = createClockWidget();
            } else if (widget.type === 'todo') {
                widgetElement = createTodoWidget();
            } else if (widget.type === 'calendar') {
                widgetElement = createCalendarWidget();
            }
            
            if (widgetElement) {
                // 应用自定义样式
                applyWidgetCustomStyle(widgetElement, widget.type);
                
                slot.innerHTML = '';
                slot.appendChild(widgetElement);
                attachWidgetDragEvents(slot, widget);
            }
        }
    });
    
    // 再放置应用图标
    apps.forEach(app => {
        const slotKey = `${app.location}-${app.position}`;
        
        // 检查槽位是否被占用
        if (occupiedSlots.has(slotKey)) {
            return; // 跳过被占用的槽位
        }
        
        const container = app.location === 'desktop' ? desktopGrid : dock;
        const slot = container.children[app.position];
        
        if (slot && !slot.classList.contains('occupied-by-widget')) {
            slot.classList.remove('empty');
            occupiedSlots.add(slotKey);
            
            const displayIcon = customIcons[app.id] || app.icon;
            slot.innerHTML = `
                <div class="app-icon" data-id="${app.id}" onclick="openApp(${app.id})">
                    ${displayIcon}
                </div>
                <div class="app-name">${app.name}</div>
            `;
            attachDragEvents(slot, app);
        }
    });
}

// 应用小组件自定义样式
function applyWidgetCustomStyle(widgetElement, type) {
    const customStyles = getStorageJSON('widgetCustomStyles', {});
    const activeScheme = localStorage.getItem(`widget_${type}_activeScheme`) || 'default'; // 这是字符串，不是JSON
    
    if (customStyles[type] && customStyles[type][activeScheme]) {
        const styleId = `widget-custom-${type}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = customStyles[type][activeScheme];
    }
}

// 打开应用
function openApp(appId) {
    if (isDragging) return;
    
    const app = apps.find(a => a.id === appId);
    if (app && app.url) {
        window.location.href = app.url;
    }
}

// 创建槽位
function createSlot(location, position) {
    const slot = document.createElement('div');
    slot.className = 'icon-slot empty';
    slot.dataset.location = location;
    slot.dataset.position = position;
    return slot;
}

// 附加拖拽事件
function attachDragEvents(slot, app) {
    const icon = slot.querySelector('.app-icon');
    
    // 鼠标事件
    icon.addEventListener('mousedown', (e) => startDrag(e, app, slot));
    
    // 触摸事件
    icon.addEventListener('touchstart', (e) => startDrag(e, app, slot), { passive: false });
}

// 开始拖拽
function startDrag(e, app, slot) {
    e.preventDefault();
    
    longPressTimer = setTimeout(() => {
        isDragging = true;
        draggedApp = app;
        
        // 创建拖拽元素
        draggedElement = document.createElement('div');
        draggedElement.className = 'app-icon dragging-icon';
        draggedElement.innerHTML = app.icon;
        draggedElement.style.width = '80px';
        draggedElement.style.height = '80px';
        document.body.appendChild(draggedElement);
        
        slot.classList.add('dragging');
        
        // 移动事件
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        
        // 结束事件
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchend', onDragEnd);
        
        // 初始位置
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        updateDragPosition(clientX, clientY);
    }, 300);
    
    // 如果提前释放，取消长按
    const cancelLongPress = () => {
        clearTimeout(longPressTimer);
        document.removeEventListener('mouseup', cancelLongPress);
        document.removeEventListener('touchend', cancelLongPress);
    };
    
    document.addEventListener('mouseup', cancelLongPress);
    document.addEventListener('touchend', cancelLongPress);
}

// 拖拽移动
function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    updateDragPosition(clientX, clientY);
    
    // 检测悬停的槽位
    const target = document.elementFromPoint(clientX, clientY);
    const slot = target?.closest('.icon-slot');
    
    document.querySelectorAll('.icon-slot').forEach(s => {
        s.classList.remove('drag-over', 'drag-invalid');
    });
    
    if (slot) {
        const location = slot.dataset.location;
        const position = parseInt(slot.dataset.position);
        
        // 检查是否是有效的放置位置
        const widgets = getStorageJSON('widgets', []);
        const isOccupiedByWidget = widgets.some(w => 
            w.location === location && 
            (w.position === position || w.position === position - 1)
        );
        
        if (isOccupiedByWidget || slot.classList.contains('occupied-by-widget')) {
            slot.classList.add('drag-invalid');
        } else {
            slot.classList.add('drag-over');
        }
    }
}

// 更新拖拽位置
function updateDragPosition(x, y) {
    if (draggedElement) {
        draggedElement.style.left = (x - 40) + 'px';
        draggedElement.style.top = (y - 40) + 'px';
    }
}

// 结束拖拽
function onDragEnd(e) {
    if (!isDragging) return;
    
    clearTimeout(longPressTimer);
    
    const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
    
    const target = document.elementFromPoint(clientX, clientY);
    const targetSlot = target?.closest('.icon-slot');
    
    if (targetSlot && draggedApp && !targetSlot.classList.contains('occupied-by-widget')) {
        const newLocation = targetSlot.dataset.location;
        const newPosition = parseInt(targetSlot.dataset.position);
        
        // 检查目标位置是否被小组件占用
        const widgets = getStorageJSON('widgets', []);
        const isOccupiedByWidget = widgets.some(w => 
            w.location === newLocation && 
            (w.position === newPosition || w.position === newPosition - 1)
        );
        
        if (isOccupiedByWidget) {
            // 不允许放置到小组件占用的位置
            alert('该位置被小组件占用');
        } else {
            // 检查目标位置是否有应用
            const targetApp = apps.find(a => 
                a.location === newLocation && 
                a.position === newPosition && 
                a.id !== draggedApp.id
            );
            
            if (targetApp) {
                // 交换位置
                targetApp.location = draggedApp.location;
                targetApp.position = draggedApp.position;
            }
            
            // 更新拖拽应用位置
            draggedApp.location = newLocation;
            draggedApp.position = newPosition;
            
            saveLayout();
        }
    }
    
    // 清理
    if (draggedElement) {
        draggedElement.remove();
        draggedElement = null;
    }
    
    document.querySelectorAll('.icon-slot').forEach(s => {
        s.classList.remove('dragging', 'drag-over');
    });
    
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchend', onDragEnd);
    
    isDragging = false;
    draggedApp = null;
    
    renderApps();
}

// 更新时间
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}`;
}

// 启动
init();

// 附加小组件拖拽事件
function attachWidgetDragEvents(slot, widget) {
    const widgetElement = slot.querySelector('.widget');
    if (!widgetElement) return;
    
    widgetElement.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('widget-close')) return;
        startWidgetDrag(e, widget, slot);
    });
    
    widgetElement.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('widget-close')) return;
        startWidgetDrag(e, widget, slot);
    }, { passive: false });
}

// 开始拖拽小组件
function startWidgetDrag(e, widget, slot) {
    e.preventDefault();
    
    longPressTimer = setTimeout(() => {
        isDragging = true;
        draggedApp = widget;
        
        // 创建拖拽元素
        draggedElement = document.createElement('div');
        draggedElement.className = 'widget dragging-icon';
        draggedElement.style.width = '80px';
        draggedElement.style.height = '80px';
        draggedElement.innerHTML = widget.type === 'clock' ? '🕐' : widget.type === 'todo' ? '✅' : '📅';
        document.body.appendChild(draggedElement);
        
        slot.classList.add('dragging');
        
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('mouseup', onWidgetDragEnd);
        document.addEventListener('touchend', onWidgetDragEnd);
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        updateDragPosition(clientX, clientY);
    }, 300);
    
    const cancelLongPress = () => {
        clearTimeout(longPressTimer);
        document.removeEventListener('mouseup', cancelLongPress);
        document.removeEventListener('touchend', cancelLongPress);
    };
    
    document.addEventListener('mouseup', cancelLongPress);
    document.addEventListener('touchend', cancelLongPress);
}

// 结束小组件拖拽
function onWidgetDragEnd(e) {
    if (!isDragging) return;
    
    clearTimeout(longPressTimer);
    
    const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
    
    const target = document.elementFromPoint(clientX, clientY);
    const targetSlot = target?.closest('.icon-slot');
    
    if (targetSlot && draggedApp && !targetSlot.classList.contains('occupied-by-widget')) {
        const newLocation = targetSlot.dataset.location;
        const newPosition = parseInt(targetSlot.dataset.position);
        const maxSlots = newLocation === 'desktop' ? 24 : 12;
        
        // 检查小组件是否会超出边界（需要2个槽位）
        if (newPosition + 1 >= maxSlots) {
            alert('小组件需要2个槽位，无法放置在最后一个位置');
        } else {
            // 更新小组件位置
            const widgets = getStorageJSON('widgets', []);
            const widgetIndex = widgets.findIndex(w => 
                w.location === draggedApp.location && 
                w.position === draggedApp.position
            );
            
            if (widgetIndex !== -1) {
                // 检查目标位置和下一个位置是否被占用
                const targetOccupied = widgets.some((w, idx) => 
                    idx !== widgetIndex &&
                    w.location === newLocation && 
                    (w.position === newPosition || w.position === newPosition + 1 ||
                     w.position === newPosition - 1)
                );
                
                const targetHasApp = apps.find(a => 
                    a.location === newLocation && 
                    (a.position === newPosition || a.position === newPosition + 1)
                );
                
                if (targetOccupied) {
                    alert('目标位置被其他小组件占用');
                } else if (targetHasApp) {
                    // 将应用移动到小组件原来的位置
                    targetHasApp.location = draggedApp.location;
                    targetHasApp.position = draggedApp.position;
                    saveLayout();
                    
                    widgets[widgetIndex].location = newLocation;
                    widgets[widgetIndex].position = newPosition;
                    setStorageJSON('widgets', widgets);
                } else {
                    // 目标位置为空，直接移动
                    widgets[widgetIndex].location = newLocation;
                    widgets[widgetIndex].position = newPosition;
                    setStorageJSON('widgets', widgets);
                }
            }
        }
    }
    
    if (draggedElement) {
        draggedElement.remove();
        draggedElement = null;
    }
    
    document.querySelectorAll('.icon-slot').forEach(s => {
        s.classList.remove('dragging', 'drag-over');
    });
    
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('mouseup', onWidgetDragEnd);
    document.removeEventListener('touchend', onWidgetDragEnd);
    
    isDragging = false;
    draggedApp = null;
    
    renderApps();
}
