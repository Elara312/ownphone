let worldBooks = [];

function loadWorldBooks() {
    try {
        worldBooks = JSON.parse(localStorage.getItem('vibe_world_books') || '[]');
    } catch (e) {
        worldBooks = [];
    }
    if (!Array.isArray(worldBooks)) {
        worldBooks = [];
    }
}

function saveWorldBooks() {
    localStorage.setItem('vibe_world_books', JSON.stringify(worldBooks || []));
}

function initMemoApp() {
    loadWorldBooks();
    if (worldBooks.length === 0) {
        const id = 'world_' + Date.now();
        worldBooks.push({
            id: id,
            name: '默认世界书',
            entries: [],
            createdAt: Date.now()
        });
        saveWorldBooks();
    }
    loadWorldBookManagerUI();
}

function loadWorldBookManagerUI() {
    const select = document.getElementById('worldBookSelect');
    if (!select) return;
    select.innerHTML = '';
    worldBooks.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = book.name || '未命名世界书';
        select.appendChild(option);
    });
    if (!select.value && worldBooks[0]) {
        select.value = worldBooks[0].id;
    }
    renderWorldBookEntries(select.value);
}

function switchWorldBookUI() {
    const select = document.getElementById('worldBookSelect');
    if (!select) return;
    renderWorldBookEntries(select.value);
}

function createWorldBook() {
    const name = prompt('输入世界书名称：', '');
    if (!name || !name.trim()) return;
    const id = 'world_' + Date.now();
    worldBooks.push({
        id: id,
        name: name.trim(),
        entries: [],
        createdAt: Date.now()
    });
    saveWorldBooks();
    loadWorldBookManagerUI();
    const select = document.getElementById('worldBookSelect');
    if (select) {
        select.value = id;
        renderWorldBookEntries(id);
    }
}

function deleteCurrentWorldBook() {
    const select = document.getElementById('worldBookSelect');
    if (!select || !select.value) return;
    if (!confirm('确定要删除当前世界书吗？此操作不可恢复。')) return;
    const id = select.value;
    worldBooks = worldBooks.filter(b => b.id !== id);
    saveWorldBooks();
    loadWorldBookManagerUI();
}

function renderWorldBookEntries(bookId) {
    const container = document.getElementById('worldBookEntries');
    if (!container) return;
    container.innerHTML = '';
    const book = worldBooks.find(b => b.id === bookId);
    if (!book) return;
    if (!Array.isArray(book.entries)) {
        book.entries = [];
    }
    book.entries.forEach(entry => {
        const wrapper = document.createElement('div');
        wrapper.className = 'prompt-editor-section';
        wrapper.setAttribute('data-entry-id', entry.id);
        wrapper.innerHTML =
            '<h4>' +
            '<input type="text" value="' + (entry.title || '') + '" placeholder="条目标题" style="width: 60%; padding: 4px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;">' +
            '<span style="margin-left: 8px; font-size: 12px;">位置：</span>' +
            '<select>' +
            '<option value="before_all">整体最前</option>' +
            '<option value="after_personality">人设之后</option>' +
            '<option value="after_time">时间信息之后</option>' +
            '<option value="before_memory">记忆库之前</option>' +
            '<option value="after_all">整体最后</option>' +
            '</select>' +
            '<label style="margin-left: 8px; font-size: 12px;">' +
            '<input type="checkbox" style="margin-right: 4px;">启用' +
            '</label>' +
            '</h4>' +
            '<p class="prompt-desc">关键词触发（可选，多条用 | 分隔）：</p>' +
            '<input type="text" value="' + (entry.keywords || '') + '" placeholder="例如：学校|魔法|家族" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; margin-bottom: 8px;">' +
            '<textarea rows="4" class="pixel-textarea" placeholder="世界书条目内容...">' + (entry.content || '') + '</textarea>' +
            '<div style="text-align: right; margin-top: 8px;">' +
            '<button class="btn-small">删除条目</button>' +
            '</div>';
        const selects = wrapper.getElementsByTagName('select');
        if (selects[0]) {
            selects[0].value = entry.position || 'after_personality';
        }
        const inputs = wrapper.getElementsByTagName('input');
        if (inputs[1]) {
            inputs[1].checked = entry.enabled !== false;
        }
        const deleteBtn = wrapper.querySelector('button.btn-small');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => removeWorldBookEntry(entry.id));
        }
        container.appendChild(wrapper);
    });
}

function syncWorldBookFromDOM(book) {
    const container = document.getElementById('worldBookEntries');
    if (!container || !book || !Array.isArray(book.entries)) return;
    const byId = {};
    book.entries.forEach(e => {
        if (e && e.id) {
            byId[e.id] = e;
        }
    });
    const nodes = container.querySelectorAll('.prompt-editor-section[data-entry-id]');
    nodes.forEach(node => {
        const id = node.getAttribute('data-entry-id');
        if (!id || !byId[id]) return;
        const inputs = node.getElementsByTagName('input');
        const titleInput = inputs[0];
        const enabledInput = inputs[1];
        const keywordsInput = inputs[2];
        const selectEl = node.getElementsByTagName('select')[0];
        const textarea = node.getElementsByTagName('textarea')[0];
        byId[id].title = titleInput ? titleInput.value.trim() : '';
        byId[id].content = textarea ? textarea.value : '';
        byId[id].position = selectEl ? selectEl.value : 'after_personality';
        byId[id].keywords = keywordsInput ? keywordsInput.value.trim() : '';
        byId[id].enabled = enabledInput ? enabledInput.checked : true;
    });
}

function addWorldBookEntry() {
    const select = document.getElementById('worldBookSelect');
    if (!select || !select.value) return;
    const book = worldBooks.find(b => b.id === select.value);
    if (!book) return;
    if (!Array.isArray(book.entries)) {
        book.entries = [];
    }
    syncWorldBookFromDOM(book);
    const id = 'entry_' + Date.now();
    book.entries.push({
        id: id,
        title: '',
        content: '',
        position: 'after_personality',
        keywords: '',
        enabled: true
    });
    renderWorldBookEntries(book.id);
}

function removeWorldBookEntry(entryId) {
    const select = document.getElementById('worldBookSelect');
    if (!select || !select.value) return;
    const book = worldBooks.find(b => b.id === select.value);
    if (!book || !Array.isArray(book.entries)) return;
    syncWorldBookFromDOM(book);
    book.entries = book.entries.filter(e => e.id !== entryId);
    renderWorldBookEntries(book.id);
}

function saveWorldBookChanges() {
    const select = document.getElementById('worldBookSelect');
    if (!select) return;
    const container = document.getElementById('worldBookEntries');
    if (!container) return;
    const currentId = select.value;
    const book = worldBooks.find(b => b.id === currentId);
    if (!book) return;
    const entries = [];
    const nodes = container.querySelectorAll('.prompt-editor-section[data-entry-id]');
    nodes.forEach(node => {
        const id = node.getAttribute('data-entry-id');
        const inputs = node.getElementsByTagName('input');
        const titleInput = inputs[0];
        const enabledInput = inputs[1];
        const keywordsInput = inputs[2];
        const selectEl = node.getElementsByTagName('select')[0];
        const textarea = node.getElementsByTagName('textarea')[0];
        entries.push({
            id: id,
            title: titleInput ? titleInput.value.trim() : '',
            content: textarea ? textarea.value : '',
            position: selectEl ? selectEl.value : 'after_personality',
            keywords: keywordsInput ? keywordsInput.value.trim() : '',
            enabled: enabledInput ? enabledInput.checked : true
        });
    });
    book.entries = entries;
    saveWorldBooks();
    alert('世界书已保存');
}

document.addEventListener('DOMContentLoaded', initMemoApp);
