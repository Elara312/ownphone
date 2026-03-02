// 修复 Chrome 更新导致的 Fabric.js 5.x 报错补丁 (放在文件最顶部)
const originalTextBaseline = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'textBaseline');
if (originalTextBaseline) {
    Object.defineProperty(CanvasRenderingContext2D.prototype, 'textBaseline', {
        get: function() {
            return originalTextBaseline.get.call(this);
        },
        set: function(value) {
            // 只要 Fabric 试图使用错的 'alphabetical'，我们就强行改成对的 'alphabetic'
            if (value === 'alphabetical') {
                value = 'alphabetic';
            }
            originalTextBaseline.set.call(this, value);
        }
    });
}

// 日记核心逻辑 - 本子列表管理 + Fabric.js 画布操作 + 素材抽屉 + 图层管理 + 撤销重做 + 多页面管理 + 网格预览

class DiaryApp {
    constructor() {
        this.books = this.loadBooks();
        this.currentBookId = null;
        this.canvas = null;
        this.currentPage = 1;
        this.totalPages = 1; // 默认至少有一页
        
        // 自动保存防抖计时器
        this.autoSaveTimer = null;
        
        // 撤销/重做栈
        this.historyStack = [];
        this.redoStack = [];
        this.isUndoing = false;
        this.isRedoing = false;
        this.maxHistory = 50;

        // 素材数据 (Mock + Custom)
        this.assets = {
            stickers: [
                'https://cdn-icons-png.flaticon.com/512/4193/4193245.png', // Heart
                'https://cdn-icons-png.flaticon.com/512/4193/4193297.png', // Star
                'https://cdn-icons-png.flaticon.com/512/4193/4193359.png', // Flower
                'https://cdn-icons-png.flaticon.com/512/4193/4193278.png', // Cat
                'https://cdn-icons-png.flaticon.com/512/4193/4193433.png', // Ribbon
                'https://cdn-icons-png.flaticon.com/512/4193/4193233.png', // Sparkle
                'https://cdn-icons-png.flaticon.com/512/4193/4193263.png', // Cake
                'https://cdn-icons-png.flaticon.com/512/4193/4193290.png', // Music
                'https://cdn-icons-png.flaticon.com/512/4193/4193257.png', // Camera
                'https://cdn-icons-png.flaticon.com/512/4193/4193307.png'  // Coffee
            ],
            backgrounds: [
                'https://img.freepik.com/free-vector/hand-drawn-grid-background_23-2150418370.jpg',
                'https://img.freepik.com/free-vector/hand-drawn-pastel-pattern-background_23-2149723226.jpg',
                'https://img.freepik.com/free-vector/hand-drawn-minimal-background_23-2149998295.jpg',
                'https://img.freepik.com/free-photo/crumpled-paper-texture_1194-6869.jpg'
            ]
        };
        this.customAssets = this.loadCustomAssets();
        this.currentAssetTab = 'stickers';
        
        // 背景模式状态
        this.backgroundMode = 'cover';
        this.currentBackgroundUrl = null;

        this.init();
    }
    
    loadCustomAssets() {
        try {
            const stored = localStorage.getItem('vibe_diary_custom_assets');
            return stored ? JSON.parse(stored) : { stickers: [], backgrounds: [] };
        } catch (e) {
            console.error('Failed to load custom assets', e);
            return { stickers: [], backgrounds: [] };
        }
    }
    
    saveCustomAssets() {
        localStorage.setItem('vibe_diary_custom_assets', JSON.stringify(this.customAssets));
    }

    init() {
        this.renderBookList();
        this.setupEventListeners();
        
        // 监听键盘删除键，删除选中元素
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && this.canvas) {
                // 如果当前焦点不在输入框中
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    const activeObjects = this.canvas.getActiveObjects();
                    if (activeObjects.length) {
                        this.canvas.discardActiveObject();
                        activeObjects.forEach(obj => {
                            this.canvas.remove(obj);
                        });
                        this.saveCurrentPage();
                    }
                }
            }
            // 撤销/重做快捷键
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.redo();
                } else {
                    this.undo();
                }
            }
        });

        // 监听窗口大小变化，调整画布尺寸
        window.addEventListener('resize', () => {
            if (this.canvas && this.currentBookId) {
                this.resizeCanvas();
            }
        });
    }

    // --- 数据存储 ---

    loadBooks() {
        const data = localStorage.getItem('vibe_diary_books');
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to parse diary books:', e);
            return [];
        }
    }

    saveBooks() {
        localStorage.setItem('vibe_diary_books', JSON.stringify(this.books));
    }

    // --- DOM 操作 ---

    renderBookList() {
        const listContainer = document.getElementById('diaryBookList');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        if (this.books.length === 0) {
            listContainer.innerHTML = `
                <div class="diary-empty-state" style="padding: 20px;">
                    <div class="diary-empty-icon">📔</div>
                    <div class="diary-empty-text">点击右上角 + 创建第一个手账本</div>
                </div>
            `;
            return;
        }

        this.books.forEach(book => {
            const item = document.createElement('div');
            item.className = `diary-book-item ${this.currentBookId === book.id ? 'active' : ''}`;
            item.dataset.id = book.id;
            
            // 格式化日期
            const date = new Date(book.createdAt).toLocaleDateString();
            const firstChar = book.name ? book.name[0] : '📔';

            item.innerHTML = `
                <div class="diary-book-cover" style="${book.cover ? `background-image: url('${book.cover}')` : ''}">
                    ${book.cover ? '' : firstChar}
                </div>
                <div class="diary-book-info">
                    <div class="diary-book-title">${book.name}</div>
                    <div class="diary-book-date">创建于 ${date}</div>
                </div>
                <div class="diary-book-actions">
                    <button class="diary-action-btn edit" title="重命名" onclick="window.diaryApp.renameBook('${book.id}', event)">✎</button>
                    <button class="diary-action-btn delete" title="删除" onclick="window.diaryApp.deleteBook('${book.id}', event)">🗑️</button>
                </div>
            `;

            item.addEventListener('click', () => this.selectBook(book.id));
            listContainer.appendChild(item);
        });
    }

    setupEventListeners() {
        // 新建本子按钮
        const addBookBtn = document.getElementById('addBookBtn');
        if (addBookBtn) {
            addBookBtn.addEventListener('click', () => this.createNewBook());
        }

        // 工具栏按钮
        const addTextBtn = document.getElementById('diaryAddTextBtn');
        if (addTextBtn) {
            addTextBtn.addEventListener('click', () => this.addText());
        }

        const addImageBtn = document.getElementById('diaryAddImageBtn');
        if (addImageBtn) {
            addImageBtn.addEventListener('click', () => this.triggerImageUpload()); // 注意：这里需要改为 URL 逻辑
        }
        
        const deleteBtn = document.getElementById('diaryDeleteBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteActiveObject());
        }

        const addStickerBtn = document.getElementById('diaryAddStickerBtn');
        if (addStickerBtn) {
            addStickerBtn.addEventListener('click', () => this.toggleAssetsDrawer());
        }
        
        // 素材 URL 添加按钮
        const addAssetUrlBtn = document.getElementById('addAssetUrlBtn');
        if (addAssetUrlBtn) {
            addAssetUrlBtn.addEventListener('click', () => this.addAssetFromUrl());
        }
        
        // 文本工具栏按钮
        this.setupTextToolbarListeners();

        const undoBtn = document.getElementById('diaryUndoBtn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undo());
        }

        const redoBtn = document.getElementById('diaryRedoBtn');
        if (redoBtn) {
            redoBtn.addEventListener('click', () => this.redo());
        }

        // 翻页按钮
        const prevPageBtn = document.getElementById('diaryPrevPageBtn');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.changePage(-1));
        }

        const nextPageBtn = document.getElementById('diaryNextPageBtn');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.changePage(1));
        }
        
        const addPageBtn = document.getElementById('diaryAddPageBtn');
        if (addPageBtn) {
            addPageBtn.addEventListener('click', () => this.addNewPage());
        }
    }

    // --- 富文本编辑工具栏 ---
    
    setupTextToolbarListeners() {
        const toolbar = document.getElementById('diaryTextToolbar');
        if (!toolbar) return;
        
        const btns = toolbar.querySelectorAll('.text-tool-btn[data-action]');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.formatText(action);
                e.target.classList.toggle('active'); // 简单视觉反馈
            });
        });
        
        const colorPicker = document.getElementById('textColorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('change', (e) => {
                this.formatText('color', e.target.value);
            });
        }
        
        const sizeSelect = document.getElementById('textSizeSelect');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', (e) => {
                this.formatText('size', parseInt(e.target.value));
            });
        }

        const fontSelect = document.getElementById('textFontSelect');
        if (fontSelect) {
            this.refreshFontSelect();
            fontSelect.addEventListener('change', async (e) => {
                const value = e.target.value;
                if (value === '__add_url__') {
                    await this.promptAddFontFromUrl();
                } else {
                    this.formatText('fontFamily', value);
                }
            });
        }

        const addColorBtn = document.getElementById('addColorToPaletteBtn');
        if (addColorBtn && colorPicker) {
            addColorBtn.addEventListener('click', () => {
                const color = colorPicker.value;
                this.addColorToPalette(color);
            });
        }

        this.renderColorPalette();
    }
    
    showTextToolbar(e) {
        const obj = e.selected[0];
        if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
            const toolbar = document.getElementById('diaryTextToolbar');
            if (toolbar) {
                toolbar.classList.add('active');
                
                // 更新工具栏状态以匹配当前选中文字
                const isBold = obj.fontWeight === 'bold';
                const isItalic = obj.fontStyle === 'italic';
                const isUnderline = obj.underline;
                const isLinethrough = obj.linethrough;
                
                const btns = toolbar.querySelectorAll('.text-tool-btn');
                btns.forEach(btn => {
                    const action = btn.dataset.action;
                    if (action === 'bold' && isBold) btn.classList.add('active');
                    else if (action === 'bold') btn.classList.remove('active');
                    
                    if (action === 'italic' && isItalic) btn.classList.add('active');
                    else if (action === 'italic') btn.classList.remove('active');
                    
                    if (action === 'underline' && isUnderline) btn.classList.add('active');
                    else if (action === 'underline') btn.classList.remove('active');
                    
                    if (action === 'linethrough' && isLinethrough) btn.classList.add('active');
                    else if (action === 'linethrough') btn.classList.remove('active');
                });
                
                // 更新颜色和字号显示
                const colorPicker = document.getElementById('textColorPicker');
                if (colorPicker) colorPicker.value = obj.fill;
                
                const sizeSelect = document.getElementById('textSizeSelect');
                if (sizeSelect) sizeSelect.value = obj.fontSize;
            }
        } else {
            this.hideTextToolbar();
        }
    }
    
    hideTextToolbar() {
        const toolbar = document.getElementById('diaryTextToolbar');
        if (toolbar) {
            toolbar.classList.remove('active');
        }
    }
    
    formatText(action, value) {
        const obj = this.canvas.getActiveObject();
        if (!obj || (obj.type !== 'i-text' && obj.type !== 'text')) return;
        
        switch (action) {
            case 'bold':
                obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
                break;
            case 'italic':
                obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
                break;
            case 'underline':
                obj.set('underline', !obj.underline);
                break;
            case 'linethrough':
                obj.set('linethrough', !obj.linethrough);
                break;
            case 'color':
                obj.set('fill', value);
                break;
            case 'size':
                obj.set('fontSize', value);
                break;
            case 'fontFamily':
                obj.set('fontFamily', value);
                break;
        }
        
        this.canvas.requestRenderAll();
        this.saveCurrentPage();
    }

    loadCustomFonts() {
        try {
            const raw = localStorage.getItem('vibe_diary_fonts');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveCustomFonts() {
        localStorage.setItem('vibe_diary_fonts', JSON.stringify(this.customFonts || []));
    }

    async promptAddFontFromUrl() {
        const name = prompt('输入字体名称：');
        if (!name || !name.trim()) return;
        const url = prompt('输入字体文件 URL（ttf/woff）：');
        if (!url || !url.trim()) return;

        const fontName = name.trim();
        try {
            const font = new FontFace(fontName, `url(${url.trim()})`);
            await font.load();
            document.fonts.add(font);

            if (!this.customFonts) this.customFonts = this.loadCustomFonts();
            this.customFonts.push({ name: fontName, url: url.trim() });
            this.saveCustomFonts();
            this.refreshFontSelect(fontName);
            this.formatText('fontFamily', fontName);
        } catch (e) {
            alert('字体加载失败，请检查 URL 是否有效');
        }
    }

    refreshFontSelect(selectedFont) {
        const fontSelect = document.getElementById('textFontSelect');
        if (!fontSelect) return;

        const currentValue = selectedFont || fontSelect.value;
        const customFonts = this.customFonts || this.loadCustomFonts();
        this.customFonts = customFonts;

        const options = [
            { value: 'Comic Neue', label: 'Comic Neue' },
            { value: 'Quicksand', label: 'Quicksand' }
        ];

        customFonts.forEach(f => {
            options.push({ value: f.name, label: f.name });
        });

        options.push({ value: '__add_url__', label: '+ 通过 URL 添加字体' });

        fontSelect.innerHTML = '';
        options.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.label;
            fontSelect.appendChild(o);
        });

        if (currentValue && options.find(o => o.value === currentValue)) {
            fontSelect.value = currentValue;
        } else {
            fontSelect.value = 'Comic Neue';
        }
    }

    loadCustomColors() {
        try {
            const raw = localStorage.getItem('vibe_diary_colors');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveCustomColors() {
        localStorage.setItem('vibe_diary_colors', JSON.stringify(this.customColors || []));
    }

    addColorToPalette(color) {
        if (!color) return;
        if (!this.customColors) this.customColors = this.loadCustomColors();
        if (!this.customColors.includes(color)) {
            this.customColors.push(color);
            this.saveCustomColors();
            this.renderColorPalette();
        }
    }

    removeColorFromPalette(color) {
        if (!this.customColors) this.customColors = this.loadCustomColors();
        this.customColors = this.customColors.filter(c => c !== color);
        this.saveCustomColors();
        this.renderColorPalette();
    }

    renderColorPalette() {
        const palette = document.getElementById('textColorPalette');
        if (!palette) return;

        const preset = ['#5c4b4b', '#ffcadd', '#c4e4c4', '#f5f1e8', '#a67c52'];
        const custom = this.customColors || this.loadCustomColors();
        this.customColors = custom;

        palette.innerHTML = '';

        const makeSwatch = (color, isCustom) => {
            const div = document.createElement('div');
            div.className = 'color-swatch' + (isCustom ? ' custom' : '');
            div.style.backgroundColor = color;
            div.addEventListener('click', (e) => {
                this.formatText('color', color);
                const picker = document.getElementById('textColorPicker');
                if (picker) picker.value = color;
                if (isCustom && e.offsetX > div.clientWidth - 10 && e.offsetY < 10) {
                    e.stopPropagation();
                    this.removeColorFromPalette(color);
                }
            });
            palette.appendChild(div);
        };

        preset.forEach(c => makeSwatch(c, false));
        custom.forEach(c => makeSwatch(c, true));
    }
    
    deleteActiveObject() {
        if (!this.canvas) return;
        const activeObjects = this.canvas.getActiveObjects();
        if (activeObjects.length) {
            this.canvas.discardActiveObject();
            activeObjects.forEach(obj => {
                this.canvas.remove(obj);
            });
            this.saveCurrentPage();
            this.hideLayerControls();
            this.hideTextToolbar();
        }
    }

    // --- 业务逻辑 ---

    createNewBook() {
        const name = prompt('给新手账本起个名字吧：', '我的手账');
        if (!name) return;

        const newBook = {
            id: 'book_' + Date.now(),
            name: name.trim(),
            cover: '', // 暂时留空，后续支持设置封面
            createdAt: Date.now(),
            updatedAt: Date.now(),
            pageCount: 1 // 初始只有一页
        };

        this.books.unshift(newBook); // 新建的排最前
        this.saveBooks();
        this.renderBookList();
        this.selectBook(newBook.id);
    }

    deleteBook(bookId, event) {
        if (event) event.stopPropagation();

        if (!confirm('确定要删除这个手账本吗？里面的所有页面都会消失哦！')) {
            return;
        }

        this.books = this.books.filter(b => b.id !== bookId);
        this.saveBooks();

        // 如果删除的是当前选中的，清空选中状态
        if (this.currentBookId === bookId) {
            this.currentBookId = null;
            this.canvas = null;
            this.clearWorkspace();
        }

        // 清理该本子的页面数据
        // 简单处理：遍历可能存在的页面key并删除
        // 实际 key 格式: vibe_diary_page_${bookId}_${pageIndex}
        // 由于不知道有多少页，这里先不做深度清理，或者以后优化存储结构
        
        this.renderBookList();
    }

    renameBook(bookId, event) {
        if (event) event.stopPropagation();

        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        const newName = prompt('重命名手账本：', book.name);
        if (newName && newName.trim()) {
            book.name = newName.trim();
            book.updatedAt = Date.now();
            this.saveBooks();
            this.renderBookList();
            
            // 如果是当前选中的，更新标题
            if (this.currentBookId === bookId) {
                const workspaceTitle = document.getElementById('diaryWorkspaceTitle');
                if (workspaceTitle) workspaceTitle.textContent = book.name;
            }
        }
    }

    selectBook(bookId) {
        // 如果之前有选中的本子，先保存当前页
        if (this.currentBookId && this.canvas) {
            this.saveCurrentPage();
        }

        this.currentBookId = bookId;
        this.currentPage = 1;
        
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            this.totalPages = book.pageCount || 1;
        } else {
            this.totalPages = 1;
        }

        this.renderBookList(); // 更新高亮状态
        
        // 更新工作区标题
        const workspaceTitle = document.getElementById('diaryWorkspaceTitle');
        if (workspaceTitle && book) {
            workspaceTitle.textContent = book.name;
        }

        // 初始化画布并加载第一页
        this.initCanvas();
        this.loadPage(this.currentPage);
        this.updatePagination();
        
        // 重置历史记录栈
        this.historyStack = [];
        this.redoStack = [];
    }

    clearWorkspace() {
        const workspaceTitle = document.getElementById('diaryWorkspaceTitle');
        if (workspaceTitle) workspaceTitle.textContent = '未选择手账本';
        
        const canvasContainer = document.getElementById('diaryCanvasContainer');
        if (canvasContainer) {
            canvasContainer.innerHTML = `
                <div class="diary-empty-state">
                    <div class="diary-empty-icon">📖</div>
                    <div class="diary-empty-text">请在左侧选择或创建一个手账本</div>
                </div>
            `;
        }
        
        const pageIndicator = document.getElementById('diaryPageIndicator');
        if (pageIndicator) pageIndicator.textContent = '';
    }

    // --- 画布逻辑 (Fabric.js) ---

    initCanvas() {
        const container = document.getElementById('diaryCanvasContainer');
        if (!container) return;

        // 获取容器的实时尺寸
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // 清空容器
        container.innerHTML = '<canvas id="diary-canvas"></canvas>';

        // 创建 Fabric 画布
        if (typeof fabric === 'undefined') {
            container.innerHTML = '<div style="color:red;padding:20px;">Fabric.js library not loaded! Please check network connection.</div>';
            return;
        }

        // 自定义全局默认样式
        this.customizeFabricDefaults();

        this.canvas = new fabric.Canvas('diary-canvas', {
            width: containerWidth,
            height: containerHeight,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true // 保持选中对象层级不变
        });

        // 监听修改事件，自动保存 和 历史记录
        this.canvas.on('object:modified', () => {
            this.scheduleAutoSave();
            this.saveHistory();
        });
        this.canvas.on('object:added', () => {
            this.scheduleAutoSave();
            this.saveHistory();
        });
        this.canvas.on('object:removed', () => {
            this.scheduleAutoSave();
            this.saveHistory();
        });
        
        // 双击空白处添加文本
        this.canvas.on('mouse:dblclick', (options) => {
            if (!options.target) {
                const pointer = this.canvas.getPointer(options.e);
                this.addTextAt(pointer.x, pointer.y);
            }
        });
        
        // 图层控制菜单显示/隐藏
        this.canvas.on('selection:created', (e) => {
            this.showLayerControls(e);
            this.showTextToolbar(e);
        });
        this.canvas.on('selection:updated', (e) => {
            this.showLayerControls(e);
            this.showTextToolbar(e);
        });
        this.canvas.on('selection:cleared', () => {
            this.hideLayerControls();
            this.hideTextToolbar();
        });

        // 调整画布容器样式
        const canvasEl = this.canvas.getElement();
        canvasEl.style.border = 'none'; // 移除边框，因为已经全屏
    }

    customizeFabricDefaults() {
        fabric.Object.prototype.set({
            borderColor: '#5c4b4b',
            cornerColor: '#ffcadd',
            cornerStyle: 'circle',
            cornerStrokeColor: '#5c4b4b',
            cornerSize: 12,
            borderScaleFactor: 2,
            transparentCorners: false,
            padding: 5
        });
        
        // Fix for "alphabetical" warning in newer browsers
        // 强制修正 textBaseline 为标准值 'alphabetic'
        if (fabric.Text) {
            fabric.Text.prototype.set({
                textBaseline: 'alphabetic'
            });
        }
        if (fabric.IText) {
            fabric.IText.prototype.set({
                textBaseline: 'alphabetic'
            });
        }
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = document.getElementById('diaryCanvasContainer');
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        this.canvas.requestRenderAll();
    }

    scheduleAutoSave() {
        if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveCurrentPage();
        }, 800); // 800ms后自动保存
    }

    loadPage(pageIndex) {
        if (!this.currentBookId || !this.canvas) return;

        const key = `vibe_diary_page_${this.currentBookId}_${pageIndex}`;
        let jsonStr = localStorage.getItem(key);

        this.canvas.clear();
        this.canvas.backgroundColor = '#ffffff';

        if (jsonStr) {
            // 修复：替换旧数据中可能存在的无效枚举值 "alphabetical" 为标准值 "alphabetic"
            if (jsonStr.indexOf('"textBaseline":"alphabetical"') !== -1) {
                jsonStr = jsonStr.replace(/"textBaseline":"alphabetical"/g, '"textBaseline":"alphabetic"');
            }

            this.canvas.loadFromJSON(jsonStr, () => {
                this.canvas.renderAll();
                console.log(`Page ${pageIndex} loaded.`);
                
                // 恢复背景图（如果有）
                if (this.canvas.backgroundImage) {
                    this.adjustBackgroundImage();
                }
                
                // 初始状态推入历史栈
                this.saveHistory();
            });
        } else {
            console.log(`Page ${pageIndex} is empty.`);
            this.saveHistory();
        }
    }

    saveCurrentPage() {
        if (!this.currentBookId || !this.canvas) return;

        const key = `vibe_diary_page_${this.currentBookId}_${this.currentPage}`;
        const json = this.canvas.toJSON();
        localStorage.setItem(key, JSON.stringify(json));
        console.log(`Page ${this.currentPage} saved.`);
        
        // 生成并保存缩略图
        this.savePageThumbnail(this.currentPage);
        
        // 更新封面预览 (如果是第一页)
        if (this.currentPage === 1) {
            const thumbnailKey = `vibe_diary_thumb_${this.currentBookId}_1`;
            const thumbnail = localStorage.getItem(thumbnailKey);
            
            const book = this.books.find(b => b.id === this.currentBookId);
            if (book && thumbnail) {
                book.cover = thumbnail;
                this.saveBooks();
            }
        }
    }
    
    savePageThumbnail(pageIndex) {
        if (!this.currentBookId || !this.canvas) return;
        
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            quality: 0.5, // 降低质量以节省空间
            multiplier: 0.2 // 缩小尺寸
        });
        
        const key = `vibe_diary_thumb_${this.currentBookId}_${pageIndex}`;
        localStorage.setItem(key, dataURL);
    }

    changePage(delta) {
        if (!this.currentBookId) return;

        // 保存当前页
        this.saveCurrentPage();

        const newPage = this.currentPage + delta;
        
        if (newPage < 1) return;
        
        if (newPage > this.totalPages) {
            this.totalPages = newPage;
            const book = this.books.find(b => b.id === this.currentBookId);
            if (book) {
                book.pageCount = this.totalPages;
                this.saveBooks();
            }
        }

        this.currentPage = newPage;
        this.loadPage(this.currentPage);
        this.updatePagination();
        
        // 切换页面时重置历史记录
        this.historyStack = [];
        this.redoStack = [];
    }

    updatePagination() {
        const indicator = document.getElementById('diaryPageIndicator');
        if (indicator) {
            indicator.textContent = `第 ${this.currentPage} 页`;
        }
        
        const prevBtn = document.getElementById('diaryPrevPageBtn');
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
            prevBtn.style.opacity = this.currentPage <= 1 ? '0.5' : '1';
        }

        const nextPageBtn = document.getElementById('diaryNextPageBtn');
        if (nextPageBtn) {
            nextPageBtn.disabled = this.currentPage >= this.totalPages;
            nextPageBtn.style.opacity = this.currentPage >= this.totalPages ? '0.5' : '1';
        }
    }

    addNewPage() {
        if (!this.currentBookId) return;
        this.saveCurrentPage();
        
        this.totalPages++;
        const book = this.books.find(b => b.id === this.currentBookId);
        if (book) {
            book.pageCount = this.totalPages;
            this.saveBooks();
        }
        
        this.currentPage = this.totalPages;
        this.loadPage(this.currentPage);
        this.updatePagination();
        this.historyStack = [];
        this.redoStack = [];
    }

    // --- 撤销/重做系统 ---
    
    saveHistory() {
        if (this.isUndoing || this.isRedoing) return;
        
        // 防抖
        if (this.historyTimer) clearTimeout(this.historyTimer);
        this.historyTimer = setTimeout(() => {
            if (!this.canvas) return;
            const json = JSON.stringify(this.canvas.toJSON());
            
            // 如果栈顶状态和当前一样，不重复保存
            if (this.historyStack.length > 0 && this.historyStack[this.historyStack.length - 1] === json) {
                return;
            }

            this.historyStack.push(json);
            if (this.historyStack.length > this.maxHistory) {
                this.historyStack.shift();
            }
            this.redoStack = []; // 清空重做栈
        }, 200);
    }

    undo() {
        if (this.historyStack.length <= 1) return; // 至少保留初始状态
        
        this.isUndoing = true;
        this.redoStack.push(this.historyStack.pop()); // 当前状态入重做栈
        const state = this.historyStack[this.historyStack.length - 1]; // 取上一个状态
        
        this.canvas.loadFromJSON(state, () => {
            this.canvas.renderAll();
            this.isUndoing = false;
        });
    }

    redo() {
        if (this.redoStack.length === 0) return;
        
        this.isRedoing = true;
        const state = this.redoStack.pop();
        this.historyStack.push(state);
        
        this.canvas.loadFromJSON(state, () => {
            this.canvas.renderAll();
            this.isRedoing = false;
        });
    }

    // --- 图层管理 ---

    showLayerControls(e) {
        const controls = document.getElementById('diaryLayerControls');
        if (controls) {
            // 计算选中对象的位置
            const obj = e.selected[0];
            if (obj) {
                controls.classList.add('active');
            }
        }
    }

    hideLayerControls() {
        const controls = document.getElementById('diaryLayerControls');
        if (controls) {
            controls.classList.remove('active');
        }
    }

    bringForward() {
        const obj = this.canvas.getActiveObject();
        if (obj) {
            this.canvas.bringForward(obj);
            this.saveHistory();
        }
    }

    sendBackwards() {
        const obj = this.canvas.getActiveObject();
        if (obj) {
            this.canvas.sendBackwards(obj);
            this.saveHistory();
        }
    }

    bringToFront() {
        const obj = this.canvas.getActiveObject();
        if (obj) {
            this.canvas.bringToFront(obj);
            this.saveHistory();
        }
    }

    sendToBack() {
        const obj = this.canvas.getActiveObject();
        if (obj) {
            this.canvas.sendToBack(obj);
            this.saveHistory();
        }
    }

    // --- 素材抽屉 (Assets Drawer) ---

    toggleAssetsDrawer() {
        const drawer = document.getElementById('diaryAssetsDrawer');
        if (drawer) {
            drawer.classList.toggle('open');
            if (drawer.classList.contains('open')) {
                this.renderAssets();
            }
        }
    }

    switchAssetTab(tab) {
        this.currentAssetTab = tab;
        
        // 更新 Tab 样式
        const tabs = document.querySelectorAll('.diary-assets-tab');
        tabs.forEach(t => t.classList.remove('active'));
        // 简单处理：根据点击的文字判断，或者直接重新绑定
        // 更好的方式是直接 renderAssets
        
        // 手动更新 active class
        const tabBtns = document.querySelectorAll('.diary-assets-tab');
        if (tab === 'stickers') tabBtns[0].classList.add('active');
        else tabBtns[1].classList.add('active');
        
        this.renderAssets();
    }

    renderAssets() {
        const container = document.getElementById('diaryAssetsContent');
        if (!container) return;
        
        container.innerHTML = '';
        
        const baseItems = this.assets[this.currentAssetTab] || [];
        const customItems = (this.customAssets && this.customAssets[this.currentAssetTab]) || [];

        // 系统预设素材（不可删除）
        baseItems.forEach((url) => {
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.draggable = true;
            item.innerHTML = `<img src="${url}" alt="asset">`;

            item.onclick = () => {
                if (this.currentAssetTab === 'stickers') {
                    this.addImageToCanvas(url);
                } else {
                    this.setCanvasBackground(url);
                }
            };

            item.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: this.currentAssetTab,
                    url: url
                }));
            };

            container.appendChild(item);
        });

        // 自定义素材（可删除）
        customItems.forEach((url, index) => {
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.draggable = true;
            item.innerHTML = `
                <img src="${url}" alt="asset">
                <div class="asset-delete-btn" title="删除">×</div>
            `;

            item.onclick = () => {
                if (this.currentAssetTab === 'stickers') {
                    this.addImageToCanvas(url);
                } else {
                    this.setCanvasBackground(url);
                }
            };

            item.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: this.currentAssetTab,
                    url: url
                }));
            };

            const deleteBtn = item.querySelector('.asset-delete-btn');
            if (deleteBtn) {
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.removeCustomAsset(this.currentAssetTab, index);
                };
            }

            container.appendChild(item);
        });
        
        // 绑定画布的 drop 事件
        this.setupDragAndDrop();
    }
    
    removeCustomAsset(type, index) {
        if (!this.customAssets || !this.customAssets[type]) return;
        this.customAssets[type].splice(index, 1);
        this.saveCustomAssets();
        this.renderAssets();
    }
    
    setupDragAndDrop() {
        const canvasContainer = document.getElementById('diaryCanvasContainer');
        if (!canvasContainer || canvasContainer.hasDragListeners) return;
        
        canvasContainer.addEventListener('dragover', (e) => e.preventDefault());
        
        canvasContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            if (data) {
                try {
                    const asset = JSON.parse(data);
                    if (asset.type === 'stickers') {
                        // 计算落点坐标
                        const rect = canvasContainer.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        this.addImageToCanvas(asset.url, x, y);
                    } else if (asset.type === 'backgrounds') {
                        this.setCanvasBackground(asset.url);
                    }
                } catch (err) {
                    console.error('Drop error:', err);
                }
            }
        });
        
        canvasContainer.hasDragListeners = true;
    }

    // --- 网格预览 (Grid Preview) ---

    openGridPreview() {
        if (!this.currentBookId) {
            alert('请先选择一个手账本');
            return;
        }
        
        // 先保存当前页
        if (this.canvas) {
            this.saveCurrentPage();
        }
        
        const modal = document.getElementById('diaryGridModal');
        const gridContent = document.getElementById('diaryGridContent');
        if (!modal || !gridContent) return;
        
        gridContent.innerHTML = '';
        
        // 遍历所有页面
        for (let i = 1; i <= this.totalPages; i++) {
            const thumbKey = `vibe_diary_thumb_${this.currentBookId}_${i}`;
            const thumbData = localStorage.getItem(thumbKey);
            
            const item = document.createElement('div');
            item.className = `grid-page-item ${i === this.currentPage ? 'active' : ''}`;
            
            item.innerHTML = `
                <div class="grid-page-preview" style="${thumbData ? `background-image: url('${thumbData}')` : ''}">
                    ${thumbData ? '' : '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#ccc;">空白页</div>'}
                </div>
                <div class="grid-page-footer">第 ${i} 页</div>
                <div class="grid-page-toolbar">
                    <button class="grid-page-btn-dup" title="复制">⧉</button>
                    <button class="grid-page-btn-del" title="删除">🗑️</button>
                </div>
            `;
            
            item.onclick = () => {
                this.currentPage = i;
                this.loadPage(this.currentPage);
                this.updatePagination();
                this.closeGridPreview();
            };

            const dupBtn = item.querySelector('.grid-page-btn-dup');
            const delBtn = item.querySelector('.grid-page-btn-del');

            if (dupBtn) {
                dupBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.duplicatePageAt(i);
                    this.openGridPreview();
                };
            }
            if (delBtn) {
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.deletePageAt(i);
                    this.openGridPreview();
                };
            }
            
            gridContent.appendChild(item);
        }
        
        modal.classList.add('active');
    }

    closeGridPreview() {
        const modal = document.getElementById('diaryGridModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    getPageKey(index) {
        return `vibe_diary_page_${this.currentBookId}_${index}`;
    }

    getThumbKey(index) {
        return `vibe_diary_thumb_${this.currentBookId}_${index}`;
    }

    duplicatePageAt(index) {
        if (!this.currentBookId) return;
        const oldTotal = this.totalPages;

        for (let k = oldTotal; k >= index + 1; k--) {
            const srcPage = localStorage.getItem(this.getPageKey(k));
            const srcThumb = localStorage.getItem(this.getThumbKey(k));
            if (srcPage) localStorage.setItem(this.getPageKey(k + 1), srcPage);
            else localStorage.removeItem(this.getPageKey(k + 1));
            if (srcThumb) localStorage.setItem(this.getThumbKey(k + 1), srcThumb);
            else localStorage.removeItem(this.getThumbKey(k + 1));
        }

        const srcPage = localStorage.getItem(this.getPageKey(index));
        const srcThumb = localStorage.getItem(this.getThumbKey(index));
        if (srcPage) localStorage.setItem(this.getPageKey(index + 1), srcPage);
        if (srcThumb) localStorage.setItem(this.getThumbKey(index + 1), srcThumb);

        this.totalPages = oldTotal + 1;
        const book = this.books.find(b => b.id === this.currentBookId);
        if (book) {
            book.pageCount = this.totalPages;
            this.saveBooks();
        }
        this.updatePagination();
    }

    deletePageAt(index) {
        if (!this.currentBookId) return;
        if (this.totalPages === 1) {
            localStorage.removeItem(this.getPageKey(1));
            localStorage.removeItem(this.getThumbKey(1));
            this.loadPage(1);
            this.updatePagination();
            return;
        }

        for (let k = index; k < this.totalPages; k++) {
            const srcPage = localStorage.getItem(this.getPageKey(k + 1));
            const srcThumb = localStorage.getItem(this.getThumbKey(k + 1));
            if (srcPage) localStorage.setItem(this.getPageKey(k), srcPage);
            else localStorage.removeItem(this.getPageKey(k));
            if (srcThumb) localStorage.setItem(this.getThumbKey(k), srcThumb);
            else localStorage.removeItem(this.getThumbKey(k));
        }

        localStorage.removeItem(this.getPageKey(this.totalPages));
        localStorage.removeItem(this.getThumbKey(this.totalPages));

        this.totalPages -= 1;
        const book = this.books.find(b => b.id === this.currentBookId);
        if (book) {
            book.pageCount = this.totalPages;
            this.saveBooks();
        }

        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
            this.loadPage(this.currentPage);
        }
        this.updatePagination();
    }

    // --- 背景纹理功能 ---

    setCanvasBackground(url) {
        if (!this.canvas) return;
        
        this.currentBackgroundUrl = url; // 记录当前背景 URL

        fabric.Image.fromURL(url, (img) => {
            // 如果是重复模式，使用 Pattern
            if (this.backgroundMode === 'repeat') {
                 this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
                 this.canvas.setBackgroundColor({
                    source: img.getElement(),
                    repeat: 'repeat'
                 }, this.canvas.renderAll.bind(this.canvas));
            } else {
                // Cover 或 Contain 模式，使用 BackgroundImage
                this.canvas.setBackgroundColor(null, this.canvas.renderAll.bind(this.canvas)); // 清除 Pattern
                this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
                    originX: 'left',
                    originY: 'top'
                });
                // 图片加载完后调整大小
                // 注意：这里需要稍微延迟一下确保 image loaded，或者直接在 callback 里调
                this.adjustBackgroundImage(img); 
            }
            this.saveHistory();
        }, { crossOrigin: 'anonymous' }); // 添加 crossOrigin 防止污染画布导致无法 toDataURL
    }

    updateBackgroundMode(mode) {
        this.backgroundMode = mode;
        if (this.currentBackgroundUrl) {
            this.setCanvasBackground(this.currentBackgroundUrl);
        }
        this.saveCurrentPage(); 
    }

    adjustBackgroundImage(loadedImg) {
        // 如果传入了 img 对象直接使用，否则尝试获取
        const img = loadedImg || this.canvas.backgroundImage;
        if (!this.canvas || !img || this.backgroundMode === 'repeat') return;

        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // 重置变换
        img.scaleX = 1;
        img.scaleY = 1;
        img.left = 0;
        img.top = 0;

        if (this.backgroundMode === 'cover') {
            const scaleX = canvasWidth / img.width;
            const scaleY = canvasHeight / img.height;
            const scale = Math.max(scaleX, scaleY);
            
            img.scaleX = scale;
            img.scaleY = scale;
            img.left = (canvasWidth - img.width * scale) / 2;
            img.top = (canvasHeight - img.height * scale) / 2;
        } else if (this.backgroundMode === 'contain') {
            const scaleX = canvasWidth / img.width;
            const scaleY = canvasHeight / img.height;
            const scale = Math.min(scaleX, scaleY);
            
            img.scaleX = scale;
            img.scaleY = scale;
            img.left = (canvasWidth - img.width * scale) / 2;
            img.top = (canvasHeight - img.height * scale) / 2;
        }
        
        this.canvas.renderAll();
    }

    // --- 编辑功能 ---

    addText() {
        if (!this.canvas) return;
        this.addTextAt(this.canvas.width / 2 - 50, this.canvas.height / 2);
    }

    addTextAt(x, y) {
        const text = new fabric.IText('点击编辑文本', {
            left: x,
            top: y,
            fontFamily: 'Comic Neue', // 优先使用 Comic Neue
            fontSize: 24,
            fill: '#5c4b4b',
            textBaseline: 'alphabetic'
        });
        
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        
        // 自动进入编辑模式
        text.enterEditing();
        text.selectAll();
        
        this.canvas.requestRenderAll();
        this.saveCurrentPage();
    }

    triggerImageUpload() {
        if (!this.canvas) return;
        
        const url = prompt('请输入图片 URL:', 'https://');
        if (url && url.startsWith('http')) {
            this.addImageToCanvas(url);
        } else if (url) {
            alert('请输入有效的 HTTP/HTTPS 图片链接');
        }
    }

    addImageToCanvas(url, left, top) {
        if (!this.canvas) return;

        fabric.Image.fromURL(
            url,
            (img) => {
                // 缩放图片以适应画布，但不要太小
                const maxDimension = 300;
                let scale = 1;
                
                if (img.width > maxDimension || img.height > maxDimension) {
                    scale = Math.min(maxDimension / img.width, maxDimension / img.height);
                }

                img.set({
                    left: left !== undefined
                        ? left - (img.width * scale / 2)
                        : (this.canvas.width - img.width * scale) / 2,
                    top: top !== undefined
                        ? top - (img.height * scale / 2)
                        : (this.canvas.height - img.height * scale) / 2,
                    scaleX: scale,
                    scaleY: scale
                });
                
                this.canvas.add(img);
                this.canvas.setActiveObject(img);
                this.saveCurrentPage();
            },
            { crossOrigin: 'anonymous' }
        );
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟一点初始化，确保 external scripts loaded
    setTimeout(() => {
        window.diaryApp = new DiaryApp();
    }, 100);
});
