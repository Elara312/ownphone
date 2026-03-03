// 加载应用列表用于图标自定义
function loadIconCustomList() {
    const apps = JSON.parse(localStorage.getItem('ipadLayout') || '[]');
    const customIcons = JSON.parse(localStorage.getItem('customIcons') || '{}');
    
    const container = document.getElementById('iconCustomList');
    container.innerHTML = '';
    
    // 默认应用列表
    const defaultApps = [
        { id: 1, icon: '💬', name: '消息' },
        { id: 2, icon: '💬', name: '论坛' },
        { id: 3, icon: '🐦', name: '推特' },
        { id: 4, icon: '▶️', name: 'Youtube' },
        { id: 5, icon: '❤️', name: '健康' },
        { id: 6, icon: '📝', name: '备忘录' },
        { id: 7, icon: '💳', name: '支付宝' },
        { id: 8, icon: '🛍️', name: '商店' },
        { id: 9, icon: '🎵', name: '网易云音乐' },
        { id: 10, icon: '📦', name: '物流' },
        { id: 11, icon: '⚙️', name: '设置' },
        { id: 12, icon: '🎨', name: '外观' }
    ];
    
    defaultApps.forEach(app => {
        const customIcon = customIcons[app.id];
        const displayIcon = customIcon || app.icon;
        
        const item = document.createElement('div');
        item.className = 'icon-custom-item';
        item.innerHTML = `
            <div class="icon-preview" id="preview-${app.id}">${displayIcon}</div>
            <div class="icon-info">
                <div class="icon-name">${app.name}</div>
                <input type="text" placeholder="图标 URL 或 Emoji" 
                       value="${customIcon || ''}" 
                       onchange="updateIcon(${app.id}, this.value)">
                <input type="file" accept="image/*" 
                       onchange="updateIconFromFile(${app.id}, event)" 
                       style="margin-top: 5px;">
            </div>
            <button class="btn-small" onclick="resetIcon(${app.id}, '${app.icon}')">重置</button>
        `;
        container.appendChild(item);
    });
}

// 更新图标
function updateIcon(appId, value) {
    const customIcons = JSON.parse(localStorage.getItem('customIcons') || '{}');
    
    // 如果是 URL，自动包装成 img 标签
    let iconValue = value;
    if (value && (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image'))) {
        iconValue = `<img src="${value}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    }
    
    customIcons[appId] = iconValue;
    localStorage.setItem('customIcons', JSON.stringify(customIcons));
    
    document.getElementById(`preview-${appId}`).innerHTML = iconValue;
}

// 从文件更新图标
function updateIconFromFile(appId, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        updateIcon(appId, img);
    };
    reader.readAsDataURL(file);
}

// 重置图标
function resetIcon(appId, defaultIcon) {
    const customIcons = JSON.parse(localStorage.getItem('customIcons') || '{}');
    delete customIcons[appId];
    localStorage.setItem('customIcons', JSON.stringify(customIcons));
    
    document.getElementById(`preview-${appId}`).innerHTML = defaultIcon;
    event.target.parentElement.querySelector('input[type="text"]').value = '';
}

// 设置壁纸（URL）
function setWallpaperFromUrl() {
    const url = document.getElementById('wallpaperUrl').value;
    if (!url) {
        alert('请输入壁纸 URL');
        return;
    }
    
    localStorage.setItem('wallpaper', `url(${url})`);
    alert('壁纸已设置，返回主页查看效果');
}

// 设置壁纸（文件）
function setWallpaperFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem('wallpaper', `url(${e.target.result})`);
        alert('壁纸已设置，返回主页查看效果');
    };
    reader.readAsDataURL(file);
}


// 设置壁纸显示模式
function setWallpaperMode(mode) {
    localStorage.setItem('wallpaperMode', mode);
}

// 加载壁纸显示模式到下拉框
function loadWallpaperMode() {
    const mode = localStorage.getItem('wallpaperMode') || 'cover';
    const sel = document.getElementById('wallpaperMode');
    if (sel) sel.value = mode;
}

// 重置壁纸
function resetWallpaper() {
    localStorage.removeItem('wallpaper');
    localStorage.removeItem('wallpaperMode');
    alert('已恢复默认壁纸');
}


// 字体方案管理
let fontSchemes = {};
let fontDB = null;

// 初始化 IndexedDB
function initFontDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FontStorage', 1);
        
        request.onerror = () => {
            console.error('IndexedDB 打开失败');
            reject(request.error);
        };
        
        request.onsuccess = () => {
            fontDB = request.result;
            console.log('IndexedDB 初始化成功');
            resolve(fontDB);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('fonts')) {
                db.createObjectStore('fonts', { keyPath: 'name' });
                console.log('创建 fonts 对象存储');
            }
        };
    });
}

// 从 IndexedDB 加载字体方案
async function loadFontFromDB(schemeName) {
    if (!fontDB) await initFontDB();
    
    return new Promise((resolve, reject) => {
        const transaction = fontDB.transaction(['fonts'], 'readonly');
        const store = transaction.objectStore('fonts');
        const request = store.get(schemeName);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// 保存字体方案到 IndexedDB
async function saveFontToDB(schemeName, fontData) {
    if (!fontDB) await initFontDB();
    
    return new Promise((resolve, reject) => {
        const transaction = fontDB.transaction(['fonts'], 'readwrite');
        const store = transaction.objectStore('fonts');
        const request = store.put({
            name: schemeName,
            data: fontData
        });
        
        request.onsuccess = () => {
            console.log('字体已保存到 IndexedDB:', schemeName);
            resolve();
        };
        
        request.onerror = () => {
            console.error('保存字体到 IndexedDB 失败:', request.error);
            reject(request.error);
        };
    });
}

// 从 IndexedDB 删除字体方案
async function deleteFontFromDB(schemeName) {
    if (!fontDB) await initFontDB();
    
    return new Promise((resolve, reject) => {
        const transaction = fontDB.transaction(['fonts'], 'readwrite');
        const store = transaction.objectStore('fonts');
        const request = store.delete(schemeName);
        
        request.onsuccess = () => {
            console.log('字体已从 IndexedDB 删除:', schemeName);
            resolve();
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// 加载字体方案
async function loadFontSchemes() {
    // 先初始化 IndexedDB
    await initFontDB();
    
    // 从 localStorage 加载方案元数据（不包含大文件数据）
    const saved = localStorage.getItem('fontSchemes');
    if (saved) {
        try {
            fontSchemes = JSON.parse(saved);
            console.log('已加载字体方案元数据:', Object.keys(fontSchemes));
        } catch (e) {
            console.error('加载字体方案失败:', e);
            fontSchemes = {};
        }
    }
    updateFontSchemesList();
}

// 保存字体方案元数据
function saveFontSchemes() {
    // 只保存元数据到 localStorage，不包含大文件数据
    const metadata = {};
    Object.keys(fontSchemes).forEach(key => {
        metadata[key] = {
            type: fontSchemes[key].type,
            fontFamily: fontSchemes[key].fontFamily,
            format: fontSchemes[key].format,
            // 不保存 source 和 fontFace（太大）
        };
    });
    
    localStorage.setItem('fontSchemes', JSON.stringify(metadata));
    console.log('已保存字体方案元数据:', Object.keys(metadata));
    updateFontSchemesList();
}

// 更新字体方案列表
function updateFontSchemesList() {
    console.log('=== 更新字体方案列表 ===');
    console.log('fontSchemes 对象:', fontSchemes);
    console.log('fontSchemes 键:', Object.keys(fontSchemes));
    
    const select = document.getElementById('fontSchemeSelect');
    if (!select) {
        console.error('未找到 fontSchemeSelect 元素');
        return;
    }
    
    const currentScheme = localStorage.getItem('activeFontScheme') || '';
    console.log('当前激活方案:', currentScheme);
    
    select.innerHTML = '<option value="">系统默认字体</option>';
    
    Object.keys(fontSchemes).forEach(schemeName => {
        console.log('添加方案到下拉框:', schemeName);
        const option = document.createElement('option');
        option.value = schemeName;
        option.textContent = schemeName;
        if (schemeName === currentScheme) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    console.log('下拉框选项数量:', select.options.length);
}

// 设置字体（URL）
async function setFontFromUrl() {
    const url = document.getElementById('fontUrl').value;
    const schemeName = prompt('请输入字体方案名称：');
    
    if (!url) {
        alert('请输入字体 URL');
        return;
    }
    
    if (!schemeName || !schemeName.trim()) {
        alert('请输入方案名称');
        return;
    }
    
    const trimmedName = schemeName.trim();
    console.log('URL 字体方案名称:', trimmedName);
    
    // 检测字体格式
    let format = 'woff2';
    if (url.includes('.woff2')) format = 'woff2';
    else if (url.includes('.woff')) format = 'woff';
    else if (url.includes('.ttf')) format = 'truetype';
    
    const fontFace = `@font-face { 
        font-family: 'CustomFont_${trimmedName}'; 
        src: url('${url}') format('${format}');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }`;
    
    // URL 类型的字体数据较小，可以直接保存
    fontSchemes[trimmedName] = {
        type: 'url',
        source: url,
        fontFace: fontFace,
        fontFamily: `'CustomFont_${trimmedName}', -apple-system, BlinkMacSystemFont, sans-serif`,
        format: format
    };
    
    console.log('保存 URL 字体方案:', trimmedName);
    
    saveFontSchemes();
    localStorage.setItem('activeFontScheme', trimmedName);
    
    // 立即应用字体
    setTimeout(async () => {
        await applyFontScheme(trimmedName);
    }, 100);
    
    document.getElementById('fontUrl').value = '';
    alert(`字体方案 "${trimmedName}" 已保存并应用`);
}

// 设置字体（文件）
async function setFontFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('选择的文件:', file.name, file.type, file.size, 'bytes');
    
    // 检查文件类型
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!['ttf', 'woff', 'woff2'].includes(fileExtension)) {
        alert('请选择有效的字体文件（.ttf, .woff, .woff2）');
        event.target.value = '';
        return;
    }
    
    // 检查文件大小
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log('文件大小:', fileSizeMB, 'MB');
    
    const schemeName = prompt('请输入字体方案名称：');
    
    if (!schemeName || !schemeName.trim()) {
        alert('请输入方案名称');
        event.target.value = '';
        return;
    }
    
    const trimmedName = schemeName.trim();
    console.log('方案名称:', trimmedName);
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        const dataUrl = e.target.result;
        const dataUrlSizeMB = (dataUrl.length / 1024 / 1024).toFixed(2);
        console.log('Base64 大小:', dataUrlSizeMB, 'MB');
        
        // 根据文件扩展名设置正确的格式
        let format = 'truetype';
        if (fileExtension === 'woff') format = 'woff';
        if (fileExtension === 'woff2') format = 'woff2';
        
        const fontFace = `@font-face { 
            font-family: 'CustomFont_${trimmedName}'; 
            src: url('${dataUrl}') format('${format}');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }`;
        
        // 保存到 IndexedDB
        try {
            await saveFontToDB(trimmedName, {
                source: dataUrl,
                fontFace: fontFace
            });
            
            // 只保存元数据到内存和 localStorage
            fontSchemes[trimmedName] = {
                type: 'file',
                fontFamily: `'CustomFont_${trimmedName}', -apple-system, BlinkMacSystemFont, sans-serif`,
                format: format
            };
            
            console.log('保存字体方案元数据:', trimmedName);
            
            saveFontSchemes();
            localStorage.setItem('activeFontScheme', trimmedName);
            
            console.log('开始应用字体...');
            
            // 立即应用字体（从 IndexedDB 加载）
            setTimeout(async () => {
                await applyFontScheme(trimmedName);
            }, 100);
            
            event.target.value = '';
            alert(`字体方案 "${trimmedName}" 已保存并应用\n文件大小: ${fileSizeMB}MB`);
        } catch (error) {
            console.error('保存字体失败:', error);
            alert('保存字体失败: ' + error.message);
            event.target.value = '';
        }
    };
    
    reader.onerror = function(error) {
        console.error('字体文件读取失败:', error);
        alert('字体文件读取失败，请重试');
        event.target.value = '';
    };
    
    reader.readAsDataURL(file);
}

// 切换字体方案
function switchFontScheme() {
    const select = document.getElementById('fontSchemeSelect');
    const schemeName = select.value;
    
    if (!schemeName) {
        // 恢复系统默认字体
        localStorage.removeItem('activeFontScheme');
        const style = document.getElementById('customFontStyle');
        if (style) {
            style.remove();
        }
        document.body.style.fontFamily = '';
        const preview = document.querySelector('.font-preview p');
        if (preview) {
            preview.style.fontFamily = '';
        }
        alert('已恢复系统默认字体');
        return;
    }
    
    localStorage.setItem('activeFontScheme', schemeName);
    applyFontScheme(schemeName);
    alert(`已切换到字体方案 "${schemeName}"`);
}

// 删除字体方案
async function deleteFontScheme() {
    const select = document.getElementById('fontSchemeSelect');
    const schemeName = select.value;
    
    if (!schemeName) {
        alert('请先选择一个字体方案');
        return;
    }
    
    if (!confirm(`确定要删除字体方案 "${schemeName}" 吗？`)) {
        return;
    }
    
    // 从 IndexedDB 删除（如果是文件类型）
    const scheme = fontSchemes[schemeName];
    if (scheme && scheme.type === 'file') {
        try {
            await deleteFontFromDB(schemeName);
        } catch (error) {
            console.error('从 IndexedDB 删除字体失败:', error);
        }
    }
    
    delete fontSchemes[schemeName];
    saveFontSchemes();
    
    const activeFontScheme = localStorage.getItem('activeFontScheme');
    if (activeFontScheme === schemeName) {
        localStorage.removeItem('activeFontScheme');
        const style = document.getElementById('customFontStyle');
        if (style) {
            style.remove();
        }
        document.body.style.fontFamily = '';
    }
    
    alert(`字体方案 "${schemeName}" 已删除`);
}

// 应用字体方案
async function applyFontScheme(schemeName) {
    console.log('开始应用字体方案:', schemeName);
    
    const scheme = fontSchemes[schemeName];
    if (!scheme) {
        console.error('字体方案不存在:', schemeName);
        console.log('可用方案:', Object.keys(fontSchemes));
        return;
    }
    
    console.log('字体方案元数据:', scheme);
    
    // 从 IndexedDB 加载完整数据
    let fontData;
    if (scheme.type === 'file') {
        try {
            const dbData = await loadFontFromDB(schemeName);
            if (dbData && dbData.data) {
                fontData = dbData.data;
                console.log('从 IndexedDB 加载字体数据成功');
            } else {
                console.error('IndexedDB 中没有找到字体数据');
                return;
            }
        } catch (error) {
            console.error('从 IndexedDB 加载字体失败:', error);
            return;
        }
    } else if (scheme.type === 'url') {
        // URL 类型直接从 scheme 中获取
        fontData = {
            source: scheme.source,
            fontFace: scheme.fontFace
        };
    }
    
    if (!fontData) {
        console.error('无法获取字体数据');
        return;
    }
    
    let style = document.getElementById('customFontStyle');
    if (!style) {
        style = document.createElement('style');
        style.id = 'customFontStyle';
        document.head.appendChild(style);
        console.log('创建了新的 style 元素');
    }
    
    style.textContent = fontData.fontFace;
    console.log('已设置 @font-face CSS');
    
    // 立即应用字体到元素
    applyFontToElements(scheme.fontFamily);
    
    // 等待字体加载
    const fontFamily = `CustomFont_${schemeName}`;
    
    if (document.fonts && document.fonts.load) {
        // 使用 Font Loading API
        document.fonts.load(`16px "${fontFamily}"`).then(() => {
            console.log('字体加载成功:', fontFamily);
            // 再次应用以确保生效
            applyFontToElements(scheme.fontFamily);
        }).catch(err => {
            console.warn('字体加载失败，但已应用:', err);
        });
    } else {
        // 降级方案：延迟应用
        console.log('浏览器不支持 Font Loading API，使用延迟应用');
        setTimeout(() => {
            applyFontToElements(scheme.fontFamily);
        }, 500);
    }
}

// 应用字体到元素
function applyFontToElements(fontFamily) {
    console.log('应用字体到所有元素:', fontFamily);
    
    // 应用到 body（会继承到大部分子元素）
    document.body.style.fontFamily = fontFamily;
    
    // 应用到所有输入元素（input, textarea, select, button 默认不继承 body 字体）
    const elements = document.querySelectorAll('input, textarea, select, button, option');
    elements.forEach(el => {
        el.style.fontFamily = fontFamily;
    });
    
    // 应用到预览区域
    const preview = document.querySelector('.font-preview p');
    if (preview) {
        preview.style.fontFamily = fontFamily;
        console.log('已应用到预览区域');
    } else {
        console.warn('未找到预览区域元素');
    }
    
    // 强制重新渲染
    void document.body.offsetHeight;
    
    console.log('字体应用完成，已应用到', elements.length, '个表单元素');
}

// 设置系统字体
function setSystemFont() {
    const font = document.getElementById('systemFont').value;
    localStorage.setItem('systemFont', font);
    localStorage.removeItem('activeFontScheme');
    
    const style = document.getElementById('customFontStyle');
    if (style) {
        style.remove();
    }
    
    document.body.style.fontFamily = font;
    const preview = document.querySelector('.font-preview p');
    if (preview) {
        preview.style.fontFamily = font;
    }
}

// 应用自定义字体（页面加载时调用）
async function applyCustomFont() {
    const activeFontScheme = localStorage.getItem('activeFontScheme');
    
    if (activeFontScheme && fontSchemes[activeFontScheme]) {
        await applyFontScheme(activeFontScheme);
    } else {
        const systemFont = localStorage.getItem('systemFont');
        if (systemFont) {
            document.body.style.fontFamily = systemFont;
            const preview = document.querySelector('.font-preview p');
            if (preview) {
                preview.style.fontFamily = systemFont;
            }
        }
    }
}

// 添加小组件
function addWidget(type) {
    const widgets = JSON.parse(localStorage.getItem('widgets') || '[]');
    const apps = JSON.parse(localStorage.getItem('ipadLayout') || '[]');
    
    // 查找第一个可用的位置（需要连续2个空槽位）
    let foundPosition = null;
    let foundLocation = null;
    
    // 先尝试桌面
    for (let i = 0; i < 23; i++) { // 23 因为需要2个槽位
        const occupied = widgets.some(w => 
            w.location === 'desktop' && 
            (w.position === i || w.position === i + 1 || w.position === i - 1)
        );
        
        const hasApp = apps.some(a => 
            a.location === 'desktop' && 
            (a.position === i || a.position === i + 1)
        );
        
        if (!occupied && !hasApp) {
            foundPosition = i;
            foundLocation = 'desktop';
            break;
        }
    }
    
    // 如果桌面没有空位，尝试 Dock
    if (foundPosition === null) {
        for (let i = 0; i < 11; i++) { // 11 因为需要2个槽位
            const occupied = widgets.some(w => 
                w.location === 'dock' && 
                (w.position === i || w.position === i + 1 || w.position === i - 1)
            );
            
            const hasApp = apps.some(a => 
                a.location === 'dock' && 
                (a.position === i || a.position === i + 1)
            );
            
            if (!occupied && !hasApp) {
                foundPosition = i;
                foundLocation = 'dock';
                break;
            }
        }
    }
    
    if (foundPosition === null) {
        alert('没有足够的空间添加小组件（需要连续2个空槽位）');
        return;
    }
    
    const newWidget = {
        id: Date.now(),
        type: type,
        location: foundLocation,
        position: foundPosition
    };
    
    widgets.push(newWidget);
    localStorage.setItem('widgets', JSON.stringify(widgets));
    
    alert(`${type === 'clock' ? '时钟' : type === 'todo' ? '待办清单' : '日历'}小组件已添加到${foundLocation === 'desktop' ? '桌面' : 'Dock'}，返回主页查看`);
}

// 初始化
console.log('=== 开始初始化 appearance.js ===');
loadIconCustomList();
loadWallpaperMode();

// 异步初始化字体系统
(async () => {
    await loadFontSchemes();
    
    // 测试：显示当前保存的字体方案
    console.log('localStorage 中的 fontSchemes:', localStorage.getItem('fontSchemes'));
    console.log('当前 fontSchemes 对象:', fontSchemes);
    console.log('当前激活的字体方案:', localStorage.getItem('activeFontScheme'));
    
    // 加载已保存的字体设置
    const systemFont = localStorage.getItem('systemFont');
    if (systemFont) {
        const systemFontSelect = document.getElementById('systemFont');
        if (systemFontSelect) {
            systemFontSelect.value = systemFont;
        }
    }
    
    await applyCustomFont();
})();


// 默认小组件样式
const defaultWidgetStyles = {
    clock: `/* 时钟小组件默认样式 */
.clock-widget {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 18px;
}

.clock-time {
    font-size: 36px;
    font-weight: 700;
    color: #333;
    line-height: 1;
}

.clock-date {
    font-size: 16px;
    color: #666;
}`,
    
    todo: `/* 待办清单小组件默认样式 */
.todo-widget {
    display: flex;
    height: 100%;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 18px;
}

.todo-left {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #e0e0e0;
    padding-right: 15px;
}

.todo-day {
    font-size: 40px;
    font-weight: 700;
    color: #333;
    line-height: 1;
}

.todo-month {
    font-size: 13px;
    color: #666;
    margin-top: 5px;
}

.todo-right {
    flex: 1;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
}

.todo-item {
    font-size: 13px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.todo-item.completed {
    text-decoration: line-through;
    color: #999;
}`,
    
    calendar: `/* 日历小组件默认样式 */
.calendar-widget {
    display: flex;
    height: 100%;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 18px;
}

.calendar-left {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #e0e0e0;
    padding-right: 15px;
}

.calendar-weekday {
    font-size: 14px;
    color: #666;
    text-transform: uppercase;
}

.calendar-day {
    font-size: 50px;
    font-weight: 700;
    color: #333;
    line-height: 1;
    margin: 5px 0;
}

.calendar-right {
    flex: 1;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.calendar-header {
    font-size: 12px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 8px;
}

.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
    margin-bottom: 5px;
}

.calendar-weekdays span {
    font-size: 10px;
    color: #999;
    text-align: center;
}

.calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
}

.calendar-days span {
    font-size: 10px;
    color: #333;
    text-align: center;
    padding: 3px;
}

.calendar-days span.today {
    background: #333;
    color: white;
    border-radius: 50%;
    font-weight: 600;
}

.calendar-days span.other-month {
    color: #ccc;
}`
};

// 内置预设方案（不可删除）
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

// 加载小组件样式
function loadWidgetStyles() {
    const widgetType = document.getElementById('widgetTypeSelect').value;
    const customStyles = JSON.parse(localStorage.getItem('widgetCustomStyles') || '{}');
    const activeScheme = localStorage.getItem(`widget_${widgetType}_activeScheme`) || 'default';
    
    // 加载方案列表
    const schemeSelect = document.getElementById('widgetSchemeSelect');
    schemeSelect.innerHTML = '<option value="default">默认样式</option>';
    
    // 添加内置预设方案
    if (builtinWidgetSchemes[widgetType]) {
        Object.keys(builtinWidgetSchemes[widgetType]).forEach(schemeName => {
            const option = document.createElement('option');
            option.value = schemeName;
            option.textContent = '⭐ ' + schemeName;
            schemeSelect.appendChild(option);
        });
    }
    
    // 添加用户自定义方案
    if (customStyles[widgetType]) {
        Object.keys(customStyles[widgetType]).forEach(schemeName => {
            if (schemeName !== 'default') {
                const option = document.createElement('option');
                option.value = schemeName;
                option.textContent = schemeName;
                schemeSelect.appendChild(option);
            }
        });
    }
    
    schemeSelect.value = activeScheme;
    
    // 加载CSS
    let css = defaultWidgetStyles[widgetType];
    if (builtinWidgetSchemes[widgetType] && builtinWidgetSchemes[widgetType][activeScheme]) {
        css = builtinWidgetSchemes[widgetType][activeScheme];
    }
    if (customStyles[widgetType] && customStyles[widgetType][activeScheme]) {
        css = customStyles[widgetType][activeScheme];
    }
    
    document.getElementById('widgetCustomCSS').value = css;
    updateWidgetPreview();
}

// 切换小组件方案
function switchWidgetScheme() {
    const widgetType = document.getElementById('widgetTypeSelect').value;
    const scheme = document.getElementById('widgetSchemeSelect').value;
    
    localStorage.setItem(`widget_${widgetType}_activeScheme`, scheme);
    loadWidgetStyles();
}

// 保存小组件方案
function saveWidgetScheme() {
    const widgetType = document.getElementById('widgetTypeSelect').value;
    const schemeName = document.getElementById('newSchemeName').value.trim();
    const css = document.getElementById('widgetCustomCSS').value;
    
    if (!schemeName) {
        alert('请输入方案名称');
        return;
    }
    
    const customStyles = JSON.parse(localStorage.getItem('widgetCustomStyles') || '{}');
    
    if (!customStyles[widgetType]) {
        customStyles[widgetType] = {};
    }
    
    customStyles[widgetType][schemeName] = css;
    localStorage.setItem('widgetCustomStyles', JSON.stringify(customStyles));
    localStorage.setItem(`widget_${widgetType}_activeScheme`, schemeName);
    
    document.getElementById('newSchemeName').value = '';
    alert(`方案 "${schemeName}" 已保存`);
    loadWidgetStyles();
}

// 删除小组件方案
function deleteWidgetScheme() {
    const widgetType = document.getElementById('widgetTypeSelect').value;
    const scheme = document.getElementById('widgetSchemeSelect').value;
    
    if (scheme === 'default') {
        alert('无法删除默认样式');
        return;
    }
    
    if (builtinWidgetSchemes[widgetType] && builtinWidgetSchemes[widgetType][scheme]) {
        alert('无法删除内置预设方案');
        return;
    }
    
    if (!confirm(`确定要删除方案 "${scheme}" 吗？`)) {
        return;
    }
    
    const customStyles = JSON.parse(localStorage.getItem('widgetCustomStyles') || '{}');
    
    if (customStyles[widgetType] && customStyles[widgetType][scheme]) {
        delete customStyles[widgetType][scheme];
        localStorage.setItem('widgetCustomStyles', JSON.stringify(customStyles));
        localStorage.setItem(`widget_${widgetType}_activeScheme`, 'default');
        
        alert('方案已删除');
        loadWidgetStyles();
    }
}

// 应用小组件样式
function applyWidgetStyle() {
    const widgetType = document.getElementById('widgetTypeSelect').value;
    const scheme = document.getElementById('widgetSchemeSelect').value;
    const css = document.getElementById('widgetCustomCSS').value;
    
    const customStyles = JSON.parse(localStorage.getItem('widgetCustomStyles') || '{}');
    
    if (!customStyles[widgetType]) {
        customStyles[widgetType] = {};
    }
    
    customStyles[widgetType][scheme] = css;
    localStorage.setItem('widgetCustomStyles', JSON.stringify(customStyles));
    
    updateWidgetPreview();
    alert('样式已应用，返回主页查看效果');
}

// 重置小组件样式
function resetWidgetStyle() {
    const widgetType = document.getElementById('widgetTypeSelect').value;
    document.getElementById('widgetCustomCSS').value = defaultWidgetStyles[widgetType];
    updateWidgetPreview();
}

// 更新小组件预览
function updateWidgetPreview() {
    const widgetType = document.getElementById('widgetTypeSelect').value;
    const css = document.getElementById('widgetCustomCSS').value;
    const previewContent = document.getElementById('widgetPreviewContent');
    
    // 应用自定义样式
    let styleElement = document.getElementById('widgetPreviewStyle');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'widgetPreviewStyle';
        document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
    
    // 生成预览内容
    const now = new Date();
    
    if (widgetType === 'clock') {
        const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
        
        previewContent.innerHTML = `
            <div class="widget clock-widget" style="max-width: 400px; height: 80px;">
                <div class="clock-time">${time}</div>
                <div class="clock-date">${date}</div>
            </div>
        `;
    } else if (widgetType === 'todo') {
        const day = now.getDate();
        const month = now.toLocaleDateString('zh-CN', { month: 'short' });
        
        previewContent.innerHTML = `
            <div class="widget todo-widget" style="max-width: 400px; height: 80px;">
                <div class="todo-left">
                    <div class="todo-day">${day}</div>
                    <div class="todo-month">${month}</div>
                </div>
                <div class="todo-right">
                    <div class="todo-item">完成项目报告</div>
                    <div class="todo-item completed">购买日用品</div>
                    <div class="todo-item">健身打卡</div>
                </div>
            </div>
        `;
    } else if (widgetType === 'calendar') {
        const weekday = now.toLocaleDateString('zh-CN', { weekday: 'short' });
        const day = now.getDate();
        const monthName = now.toLocaleDateString('zh-CN', { month: 'long' });
        
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let calendarDays = '';
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === day ? 'today' : '';
            calendarDays += `<span class="${isToday}">${i}</span>`;
        }
        
        previewContent.innerHTML = `
            <div class="widget calendar-widget" style="max-width: 400px; height: 80px;">
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
            </div>
        `;
    }
}

// 初始化小组件样式编辑器
if (document.getElementById('widgetTypeSelect')) {
    loadWidgetStyles();
    
    // 监听CSS输入变化，实时预览
    document.getElementById('widgetCustomCSS').addEventListener('input', updateWidgetPreview);
}
