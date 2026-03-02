/* ==================== 共读 - reading.js ==================== */

// localStorage helpers (same pattern as couple-twitter.js)
function getS(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } }
function setS(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

// API config (same pattern as couple-twitter.js)
function getApiConfig() {
  // 优先读全局 key
  let apiUrl = localStorage.getItem('apiUrl');
  let apiKey = localStorage.getItem('apiKey');
  let model = localStorage.getItem('selectedModel');
  if (apiUrl && apiKey) return { apiUrl, apiKey, model };
  // fallback: 从 vibe_api_schemes 取第一个可用方案
  try {
    const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
    if (Array.isArray(schemes)) {
      const s = schemes.find(sc => sc.apiUrl && sc.apiKey);
      if (s) return { apiUrl: s.apiUrl, apiKey: s.apiKey, model: s.model || model };
    }
  } catch(e) {}
  return { apiUrl, apiKey, model };
}

// LLM call (same pattern as couple-twitter.js)
async function callLLM(prompt, temperature = 0.7, systemPrompt = '') {
  const { apiUrl, apiKey, model } = getApiConfig();
  if (!apiUrl || !apiKey) throw new Error('请先配置API');
  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });
  let base = apiUrl.replace(/\/+$/, '');
  const url = base + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || 'gpt-4o-mini', messages, temperature, max_tokens: 4000 })
  });
  if (!res.ok) throw new Error(`API错误: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Global variables
let currentBookId = null;
let currentPage = 1;

// View switching
function showView(viewName) {
  const views = ['shelf', 'reader', 'table', 'upload', 'settings'];
  views.forEach(v => {
    const el = document.getElementById(v + 'View');
    if (el) el.style.display = (v === viewName) ? 'block' : 'none';
  });
  if (viewName === 'settings') loadSettingsPage();
}

// Toast notification
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// Loading overlay
// Loading - show bubble near mascot instead of full-screen overlay
function showLoading(show) {
  const bubble = document.getElementById('mascotBubble');
  if (bubble) bubble.style.display = show ? 'flex' : 'none';
  // Also keep the full overlay for non-reader views (upload parsing etc)
  const el = document.getElementById('loadingOverlay');
  const readerView = document.getElementById('readerView');
  if (el) {
    if (readerView && readerView.style.display !== 'none') {
      // In reader view, only use bubble
      el.style.display = 'none';
    } else {
      el.style.display = show ? 'flex' : 'none';
    }
  }
}

// Close modal
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.style.display = 'none';
}

// ==================== 文件解析器 ====================

// PDF解析 - 使用pdf.js CDN (pdfjsLib全局可用)
async function parsePDF(file) {
  try {
    const progressEl = document.getElementById('uploadProgress');
    const progressLabel = document.getElementById('progressLabel');
    const progressFill = document.getElementById('progressFill');
    if (progressEl) progressEl.style.display = 'block';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (progressLabel) progressLabel.textContent = `已解析 ${i}/${totalPages} 页`;
      if (progressFill) progressFill.style.width = `${Math.round((i / totalPages) * 100)}%`;

      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str).join(' ');
      pages.push({ pageNum: i, text });
    }

    if (progressEl) progressEl.style.display = 'none';
    return { pages, title: file.name };
  } catch (e) {
    const progressEl = document.getElementById('uploadProgress');
    if (progressEl) progressEl.style.display = 'none';
    showToast('文件格式无效或已损坏');
    throw e;
  }
}

// TXT分页 - 自然段落边界断页
function parseTXT(text, charsPerPage = 1500) {
  if (!text || text.length === 0) return { pages: [] };

  const pages = [];
  let offset = 0;

  while (offset < text.length) {
    const remaining = text.length - offset;

    // Last chunk fits in one page
    if (remaining <= charsPerPage) {
      pages.push({ pageNum: pages.length + 1, text: text.slice(offset) });
      break;
    }

    const chunk = text.slice(offset, offset + charsPerPage);

    // Try to find paragraph boundary (\n\n) within chunk
    let breakIdx = chunk.lastIndexOf('\n\n');
    if (breakIdx > 0) {
      // Include the \n\n in this page
      breakIdx += 2;
    } else {
      // Try single newline
      breakIdx = chunk.lastIndexOf('\n');
      if (breakIdx > 0) {
        breakIdx += 1;
      } else {
        // Hard cut at charsPerPage
        breakIdx = charsPerPage;
      }
    }

    pages.push({ pageNum: pages.length + 1, text: text.slice(offset, offset + breakIdx) });
    offset += breakIdx;
  }

  return { pages };
}

// 格式化页面文本（保留段落结构）
function formatPageText(rawText) {
  if (!rawText) return '';
  // Split into paragraphs, trim each, filter empty, rejoin with double newline
  const paragraphs = rawText.split(/\n\s*\n/);
  return paragraphs
    .map(p => p.replace(/[ \t]+/g, ' ').trim())
    .filter(p => p.length > 0)
    .join('\n\n');
}

// API Settings (inline in settings view)
function showApiSettings() {
  showView('settings');
  loadSettingsPage();
}
function loadSettingsPage() {
  document.getElementById('readingApiUrl').value = localStorage.getItem('apiUrl') || '';
  document.getElementById('readingApiKey').value = localStorage.getItem('apiKey') || '';
  document.getElementById('readingModel').value = localStorage.getItem('selectedModel') || '';
  const sel = document.getElementById('readingModelSelect');
  if (sel && sel.options.length > 1) {
    sel.value = localStorage.getItem('selectedModel') || '';
  }
  loadMascotSettings();
  loadCssSchemeList();
}
function saveApiSettings() {
  const url = document.getElementById('readingApiUrl').value.trim();
  const key = document.getElementById('readingApiKey').value.trim();
  const selVal = document.getElementById('readingModelSelect').value;
  const txt = document.getElementById('readingModel').value.trim();
  const model = selVal || txt;
  if (url) localStorage.setItem('apiUrl', url);
  if (key) localStorage.setItem('apiKey', key);
  if (model) localStorage.setItem('selectedModel', model);
  showToast('API 配置已保存');
}

// Select change syncs to text input
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('readingModelSelect');
  if (sel) sel.addEventListener('change', () => {
    if (sel.value) document.getElementById('readingModel').value = sel.value;
  });
});

async function fetchModels() {
  const url = document.getElementById('readingApiUrl').value.trim();
  const key = document.getElementById('readingApiKey').value.trim();
  if (!url || !key) { showToast('请先填写 API 地址和 Key'); return; }
  const btn = document.getElementById('fetchModelsBtn');
  btn.textContent = '⏳ 拉取中…';
  btn.disabled = true;
  try {
    const base = url.replace(/\/+$/, '');
    const res = await fetch(base + '/models', {
      headers: { 'Authorization': 'Bearer ' + key }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const models = (data.data || []).map(m => m.id).sort();
    const sel = document.getElementById('readingModelSelect');
    sel.innerHTML = '<option value="">-- 选择模型 --</option>';
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      sel.appendChild(opt);
    });
    const cur = document.getElementById('readingModel').value;
    if (cur && models.includes(cur)) sel.value = cur;
    showToast('拉取到 ' + models.length + ' 个模型');
  } catch(e) {
    console.error('拉取模型失败:', e);
    showToast('拉取失败: ' + e.message);
  } finally {
    btn.textContent = '🔄 拉取';
    btn.disabled = false;
  }
}

// ==================== AI 小助手形象管理 ====================

function getMascotConfig() {
  try { return JSON.parse(localStorage.getItem('vibe_reading_mascot') || '{}'); } catch(e) { return {}; }
}
function saveMascotConfig(cfg) {
  localStorage.setItem('vibe_reading_mascot', JSON.stringify(cfg));
}

function loadMascot() {
  const cfg = getMascotConfig();
  const img = document.getElementById('mascotImg');
  if (!img) return;
  const size = cfg.size || 60;
  document.documentElement.style.setProperty('--mascot-size', size + 'px');
  if (cfg.imageData || cfg.imageUrl) {
    img.src = cfg.imageData || cfg.imageUrl;
  } else {
    img.src = '';
  }
  // Restore saved position
  const mascot = document.getElementById('aiMascot');
  if (mascot && cfg.posX !== undefined && cfg.posY !== undefined) {
    mascot.style.right = 'auto';
    mascot.style.bottom = 'auto';
    mascot.style.left = cfg.posX + 'px';
    mascot.style.top = cfg.posY + 'px';
  }
}

// Draggable mascot - touch & mouse
function initMascotDrag() {
  const el = document.getElementById('aiMascot');
  if (!el) return;
  let startX, startY, origX, origY, dragged = false;
  const DRAG_THRESHOLD = 8;

  function onStart(cx, cy) {
    const rect = el.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    startX = cx;
    startY = cy;
    dragged = false;
    el.classList.add('dragging');
  }
  function onMove(cx, cy) {
    const dx = cx - startX;
    const dy = cy - startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragged = true;
    }
    if (dragged) {
      let newX = origX + dx;
      let newY = origY + dy;
      // Clamp to viewport
      newX = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, newY));
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
    }
  }
  function onEnd() {
    el.classList.remove('dragging');
    if (dragged) {
      // Save position
      const cfg = getMascotConfig();
      cfg.posX = parseInt(el.style.left);
      cfg.posY = parseInt(el.style.top);
      saveMascotConfig(cfg);
    } else {
      // Short tap = open analyze modal
      showAnalyzeModal();
    }
  }

  // Mouse events
  el.addEventListener('mousedown', e => {
    e.preventDefault();
    onStart(e.clientX, e.clientY);
    const moveH = ev => onMove(ev.clientX, ev.clientY);
    const upH = () => { onEnd(); document.removeEventListener('mousemove', moveH); document.removeEventListener('mouseup', upH); };
    document.addEventListener('mousemove', moveH);
    document.addEventListener('mouseup', upH);
  });
  // Touch events
  el.addEventListener('touchstart', e => {
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
    if (dragged) e.preventDefault();
  }, { passive: false });
  el.addEventListener('touchend', () => onEnd());
  // Prevent default click (we handle tap in onEnd)
  el.onclick = e => e.preventDefault();
}

function uploadMascotImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const cfg = getMascotConfig();
    cfg.imageData = ev.target.result;
    delete cfg.imageUrl;
    saveMascotConfig(cfg);
    loadMascot();
    // Update preview
    const preview = document.getElementById('mascotPreview');
    if (preview) preview.src = ev.target.result;
    showToast('小助手形象已更新');
  };
  reader.readAsDataURL(file);
}

function setMascotUrl() {
  const url = document.getElementById('mascotUrlInput').value.trim();
  if (!url) { showToast('请输入图片URL'); return; }
  const cfg = getMascotConfig();
  cfg.imageUrl = url;
  delete cfg.imageData;
  saveMascotConfig(cfg);
  loadMascot();
  const preview = document.getElementById('mascotPreview');
  if (preview) preview.src = url;
  showToast('小助手形象已更新');
}

function updateMascotSize(val) {
  const cfg = getMascotConfig();
  cfg.size = parseInt(val);
  saveMascotConfig(cfg);
  document.documentElement.style.setProperty('--mascot-size', val + 'px');
  const label = document.getElementById('mascotSizeLabel');
  if (label) label.textContent = val;
}

function loadMascotSettings() {
  const cfg = getMascotConfig();
  const size = cfg.size || 60;
  const range = document.getElementById('mascotSizeRange');
  if (range) range.value = size;
  const label = document.getElementById('mascotSizeLabel');
  if (label) label.textContent = size;
  const preview = document.getElementById('mascotPreview');
  if (preview) preview.src = cfg.imageData || cfg.imageUrl || '';
  const urlInput = document.getElementById('mascotUrlInput');
  if (urlInput) urlInput.value = cfg.imageUrl || '';
}

// ==================== CSS 主题方案管理 ====================

const DEFAULT_CSS_SCHEME_NAME = '默认暗色';
const DEFAULT_CSS = `/* ===== 共读 - 默认暗色主题 =====
 * 修改这里的CSS可以自定义整个共读页面的外观
 * 保存后立即生效，可随时切换回默认方案
 * ===== */

/* --- 全局背景和文字颜色 --- */
body {
  background: #0a0a0a;  /* 页面背景色 */
  color: #e5e5e5;       /* 默认文字颜色 */
}
/* 滚动条 */
::-webkit-scrollbar-thumb { background: #333; }

/* --- 顶部导航栏 --- */
.top-bar {
  background: #0a0a0a;           /* 导航栏背景 */
  border-bottom-color: #1a1a1a;  /* 导航栏底部边框 */
}
.top-title { color: #e5e5e5; }   /* 导航栏标题 */
.btn-back { color: #e5e5e5; }    /* 返回按钮 */
.btn-icon { color: #fff; }       /* 图标按钮 */

/* --- 书架 --- */
.shelf-header {
  background: #0a0a0a;           /* 书架头部背景 */
  border-bottom-color: #1a1a1a;  /* 书架头部底边框 */
}
.shelf-title { color: #e5e5e5; } /* 书架标题 */
.book-card {
  background: #141414;           /* 书籍卡片背景 */
  border-radius: 12px;           /* 卡片圆角 */
}
.book-card .book-title { color: #e5e5e5; }  /* 书名 */
.book-card .book-type { color: #777; }       /* 类型标签 */
.book-card .book-progress { color: #555; }   /* 进度文字 */
.book-card-actions button { color: #999; border-color: #333; }  /* 操作按钮 */
.book-card-actions .del { color: #ff6b6b; border-color: #4a2020; }  /* 删除按钮 */
.book-status-label.reading { background: #1a2e1a; color: #7ee787; }   /* 在读标签 */
.book-status-label.finished { background: #1a1a2e; color: #79c0ff; }  /* 已读完标签 */
.book-status-label.paused { background: #2a2a1a; color: #f0c674; }    /* 搁置标签 */
.empty-state { color: #555; }    /* 空状态提示 */

/* --- 阅读器 --- */
.reader-header {
  background: #0a0a0a;           /* 阅读器头部背景 */
  border-bottom-color: #1a1a1a;  /* 阅读器头部底边框 */
}
.reader-book-title { color: #e5e5e5; }  /* 书名 */
.page-panel {
  background: #141414;           /* 页面面板背景 */
  color: #d4d4d4;                /* 页面文字颜色 */
  font-size: 14px;               /* 页面字号 */
  line-height: 1.8;              /* 行高 */
  border-radius: 10px;           /* 面板圆角 */
}
.page-panel .page-num { color: #555; }  /* 页码标注 */
.reader-footer {
  background: #0a0a0a;           /* 底部翻页栏背景 */
  border-top-color: #1a1a1a;     /* 底部翻页栏顶边框 */
}
.nav-btn {
  background: #1a1a1a;           /* 翻页按钮背景 */
  color: #e5e5e5;                /* 翻页按钮文字 */
  border-color: #2a2a2a;         /* 翻页按钮边框 */
}
.page-info { color: #777; }      /* 页码信息 */

/* --- 记忆表格 --- */
.table-header {
  background: #0a0a0a;           /* 表格头部背景 */
  border-bottom-color: #1a1a1a;  /* 表格头部底边框 */
}
.table-title { color: #e5e5e5; } /* 表格标题 */
.table-content table { border-collapse: collapse; }
.table-content th {
  background: #1a1a1a;           /* 表头背景 */
  color: #999;                   /* 表头文字 */
  border-bottom-color: #2a2a2a;  /* 表头底边框 */
}
.table-content td {
  color: #d4d4d4;                /* 表格内容文字 */
  border-bottom-color: #1a1a1a;  /* 行底边框 */
}
.table-content tr:hover td { background: #111; }  /* 行悬停 */
.table-token-info { color: #666; }  /* Token统计 */

/* --- 快照 --- */
.snapshot-section { border-top-color: #1a1a1a; }
.snapshot-title { color: #999; }
.snapshot-item {
  background: #141414;           /* 快照条目背景 */
}
.snapshot-time { color: #888; }
.snapshot-page { color: #555; }
.snapshot-restore { color: #999; border-color: #333; }

/* --- 上传 --- */
.upload-header {
  background: #0a0a0a;           /* 上传头部背景 */
  border-bottom-color: #1a1a1a;
}
.file-label {
  background: #141414;           /* 文件选择区背景 */
  border-color: #2a2a2a;         /* 文件选择区边框 */
  color: #999;                   /* 文件选择区文字 */
}
.file-name { color: #555; }
.type-title { color: #e5e5e5; }
.type-card {
  background: #141414;           /* 类型卡片背景 */
  border-color: #2a2a2a;         /* 类型卡片边框 */
}
.type-card.selected {
  border-color: #e5e5e5;         /* 选中类型卡片边框 */
  background: #1a1a1a;           /* 选中类型卡片背景 */
}
.type-name { color: #e5e5e5; }
.type-desc { color: #777; }

/* --- 设置页面 --- */
.settings-header {
  background: #0a0a0a;           /* 设置头部背景 */
  border-bottom-color: #1a1a1a;
}
.settings-section {
  background: #141414;           /* 设置区块背景 */
  border-radius: 12px;
}
.settings-section-title {
  color: #e5e5e5;                /* 区块标题 */
  border-bottom-color: #222;
}
.settings-field label { color: #aaa; }
.settings-field input,
.settings-field select,
.settings-field textarea {
  background: #0a0a0a;           /* 输入框背景 */
  color: #e5e5e5;                /* 输入框文字 */
  border-color: #333;            /* 输入框边框 */
}
.settings-hint { color: #666; }
.settings-btn-sm { background: #222; color: #aaa; border-color: #333; }
.settings-btn-primary { background: #5856d6; color: #fff; }

/* --- 弹窗（分析/编辑字段等） --- */
#analyzeModal > div,
#editFieldsModal > div {
  background: #1a1a1a;           /* 弹窗背景 */
  color: #e5e5e5;                /* 弹窗文字 */
}

/* --- AI 小助手 --- */
.mascot-fallback {
  background: #222;              /* 默认头像背景（无图片时） */
}
.mascot-bubble {
  background: #222;              /* 分析气泡背景 */
  color: #ccc;                   /* 分析气泡文字 */
}

/* --- 加载和Toast --- */
.loading-overlay { background: rgba(0,0,0,.7); }
.loading-text { color: #999; }
.toast { background: #222; color: #e5e5e5; }`;

function getCssSchemes() {
  try { return JSON.parse(localStorage.getItem('vibe_reading_css_schemes') || '{}'); } catch(e) { return {}; }
}
function saveCssSchemes(schemes) {
  localStorage.setItem('vibe_reading_css_schemes', JSON.stringify(schemes));
}
function getActiveCssSchemeName() {
  return localStorage.getItem('vibe_reading_active_css') || DEFAULT_CSS_SCHEME_NAME;
}

function loadCssSchemeList() {
  const schemes = getCssSchemes();
  const active = getActiveCssSchemeName();
  const sel = document.getElementById('cssSchemeSelect');
  if (!sel) return;
  sel.innerHTML = '';
  // Always include default
  const opt0 = document.createElement('option');
  opt0.value = DEFAULT_CSS_SCHEME_NAME;
  opt0.textContent = DEFAULT_CSS_SCHEME_NAME;
  sel.appendChild(opt0);
  Object.keys(schemes).forEach(name => {
    if (name === DEFAULT_CSS_SCHEME_NAME) return;
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  });
  sel.value = active;
  // Load CSS into editor
  const editor = document.getElementById('cssEditor');
  if (editor) {
    editor.value = (active === DEFAULT_CSS_SCHEME_NAME && !schemes[DEFAULT_CSS_SCHEME_NAME])
      ? DEFAULT_CSS
      : (schemes[active] || DEFAULT_CSS);
  }
}

function switchCssScheme() {
  const sel = document.getElementById('cssSchemeSelect');
  const name = sel.value;
  localStorage.setItem('vibe_reading_active_css', name);
  const schemes = getCssSchemes();
  const editor = document.getElementById('cssEditor');
  editor.value = (name === DEFAULT_CSS_SCHEME_NAME && !schemes[DEFAULT_CSS_SCHEME_NAME])
    ? DEFAULT_CSS
    : (schemes[name] || DEFAULT_CSS);
  applyCssScheme();
}

function createCssScheme() {
  const nameInput = document.getElementById('newSchemeName');
  const name = nameInput.value.trim();
  if (!name) { showToast('请输入方案名称'); return; }
  const schemes = getCssSchemes();
  if (schemes[name]) { showToast('方案已存在'); return; }
  // Copy current editor content as starting point
  schemes[name] = document.getElementById('cssEditor').value || DEFAULT_CSS;
  saveCssSchemes(schemes);
  localStorage.setItem('vibe_reading_active_css', name);
  nameInput.value = '';
  loadCssSchemeList();
  showToast('方案「' + name + '」已创建');
}

function deleteCssScheme() {
  const name = getActiveCssSchemeName();
  if (name === DEFAULT_CSS_SCHEME_NAME) { showToast('默认方案不能删除'); return; }
  if (!confirm('确定删除方案「' + name + '」？')) return;
  const schemes = getCssSchemes();
  delete schemes[name];
  saveCssSchemes(schemes);
  localStorage.setItem('vibe_reading_active_css', DEFAULT_CSS_SCHEME_NAME);
  loadCssSchemeList();
  applyCssScheme();
  showToast('已删除');
}

function saveCssScheme() {
  const name = getActiveCssSchemeName();
  const css = document.getElementById('cssEditor').value;
  const schemes = getCssSchemes();
  schemes[name] = css;
  saveCssSchemes(schemes);
  applyCssScheme();
  showToast('主题已保存并应用');
}

function applyCssScheme() {
  let style = document.getElementById('customCssScheme');
  if (!style) {
    style = document.createElement('style');
    style.id = 'customCssScheme';
    document.head.appendChild(style);
  }
  const name = getActiveCssSchemeName();
  const schemes = getCssSchemes();
  const css = schemes[name] || '';
  // Only apply non-default schemes (default is already in reading.css)
  style.textContent = (name === DEFAULT_CSS_SCHEME_NAME && !schemes[DEFAULT_CSS_SCHEME_NAME]) ? '' : css;
}

// Init app
function initApp() {
  showView('shelf');
  renderShelf();
  applyCssScheme();
  loadMascot();
  initMascotDrag();
}

initApp();


// ==================== Task 3: 书籍类型选择与模板 ====================

// 模板获取
function getTemplate(bookType) {
  const templates = {
    novel: ['角色名','特征','身份','性格','职业','出场章节','爱好','关系','情节'],
    academic: ['核心论点','研究方法','关键数据','实验设计','结论','引用来源'],
    lab: ['实验名称','材料清单','步骤','注意事项','预期结果']
  };
  // Check for saved custom templates
  try {
    const customs = JSON.parse(localStorage.getItem('vibe_reading_custom_templates') || '{}');
    if (customs[bookType]) return customs[bookType];
  } catch(e) {}
  return templates[bookType] || templates.novel;
}

function getTypeLabel(bookType) {
  const labels = { novel: '小说', academic: '学术论文', lab: '实验指南' };
  if (labels[bookType]) return labels[bookType];
  if (bookType && bookType.startsWith('custom_')) return bookType.replace('custom_', '');
  return bookType || '未知';
}

// 文件选择处理
let pendingFile = null;
let selectedBookType = null;

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext !== 'pdf' && ext !== 'txt') {
    showToast('仅支持 PDF 和 TXT 文件');
    return;
  }
  pendingFile = file;
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('typeSelect').style.display = 'block';
  selectedBookType = null;
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
}

function selectBookType(type) {
  selectedBookType = type;
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  document.getElementById('customTypeArea').style.display = 'none';
  // Auto-start upload after type selection
  setTimeout(() => addBook(), 300);
}

function showCustomType() {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  document.getElementById('customTypeArea').style.display = 'block';
  selectedBookType = null;
}

let customFields = null;

function confirmCustomType() {
  const name = document.getElementById('customTypeName').value.trim();
  const fieldsRaw = document.getElementById('customTypeFields').value.trim();
  if (!name) { showToast('请输入类型名称'); return; }
  if (!fieldsRaw) { showToast('请输入表格字段'); return; }
  const fields = fieldsRaw.split(/[,，、]/).map(f => f.trim()).filter(f => f);
  if (fields.length === 0) { showToast('至少需要一个字段'); return; }
  selectedBookType = 'custom_' + name;
  customFields = fields;
  addBook();
}

// 完整上传流程
async function addBook() {
  if (!pendingFile || !selectedBookType) {
    showToast('请先选择文件和类型');
    return;
  }
  try {
    showLoading(true);
    const ext = pendingFile.name.split('.').pop().toLowerCase();
    let result;
    if (ext === 'pdf') {
      result = await parsePDF(pendingFile);
    } else {
      const text = await pendingFile.text();
      if (!text.trim()) {
        showLoading(false);
        showToast('文件内容为空');
        return;
      }
      result = parseTXT(text);
      result.title = pendingFile.name;
    }
    if (!result.pages || result.pages.length === 0) {
      showLoading(false);
      showToast('未能解析出任何内容');
      return;
    }
    const bookId = 'book_' + Date.now();
    const book = {
      id: bookId,
      title: result.title.replace(/\.(pdf|txt)$/i, ''),
      type: selectedBookType,
      totalPages: result.pages.length,
      currentPage: 1,
      status: '在读',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    // Save pages separately
    setS('vibe_reading_pages_' + bookId, result.pages);
    // Save book metadata
    const books = getBooks();
    books.push(book);
    saveBooks(books);
    // Init empty memory table
    const fields = customFields || getTemplate(selectedBookType);
    // Save custom template for reuse
    if (customFields && selectedBookType) {
      try {
        const customs = JSON.parse(localStorage.getItem('vibe_reading_custom_templates') || '{}');
        customs[selectedBookType] = customFields;
        localStorage.setItem('vibe_reading_custom_templates', JSON.stringify(customs));
      } catch(e) {}
    }
    saveMemoryTable(bookId, { bookId, type: selectedBookType, fields: fields, rows: [], updatedAt: Date.now() });
    showLoading(false);
    showToast('上传成功！共 ' + result.pages.length + ' 页');
    pendingFile = null;
    selectedBookType = null;
    customFields = null;
    document.getElementById('fileInput').value = '';
    showView('shelf');
    renderShelf();
  } catch (e) {
    showLoading(false);
    console.error('上传失败:', e);
    showToast('上传失败: ' + e.message);
  }
}


// ==================== Task 4: 书架管理 ====================

function getBooks() { return getS('vibe_reading_books', []); }
function saveBooks(books) { setS('vibe_reading_books', books); }

function deleteBook(bookId) {
  let books = getBooks();
  books = books.filter(b => b.id !== bookId);
  saveBooks(books);
  localStorage.removeItem('vibe_reading_pages_' + bookId);
  localStorage.removeItem('vibe_reading_table_' + bookId);
  localStorage.removeItem('vibe_reading_snapshots_' + bookId);
  showToast('已删除');
  renderShelf();
}

function updateReadingStatus(bookId, status) {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.status = status;
    book.updatedAt = Date.now();
    saveBooks(books);
    renderShelf();
  }
}

function renderShelf() {
  const books = getBooks();
  const grid = document.getElementById('bookGrid');
  const empty = document.getElementById('shelfEmpty');
  if (!grid) return;
  if (books.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = books.map(b => {
    const icon = { novel: '📖', academic: '📄', lab: '🔬' }[b.type] || '📚';
    const statusCls = { '在读': 'reading', '已读完': 'finished', '搁置': 'paused' }[b.status] || 'reading';
    const pct = b.totalPages > 0 ? Math.round((b.currentPage / b.totalPages) * 100) : 0;
    return `<div class="book-card" onclick="openReader('${b.id}')">
      <div class="book-status-label ${statusCls}">${b.status}</div>
      <div class="book-icon">${icon}</div>
      <div class="book-title">${b.title}</div>
      <div class="book-type">${getTypeLabel(b.type)}</div>
      <div class="book-progress">${b.currentPage}/${b.totalPages} 页 (${pct}%)</div>
      <div class="book-card-actions" onclick="event.stopPropagation()">
        <button onclick="cycleStatus('${b.id}')">${b.status}</button>
        <button class="del" onclick="if(confirm('确定删除？'))deleteBook('${b.id}')">删除</button>
      </div>
    </div>`;
  }).join('');
}

function cycleStatus(bookId) {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  const cycle = ['在读', '已读完', '搁置'];
  const idx = cycle.indexOf(book.status);
  book.status = cycle[(idx + 1) % cycle.length];
  book.updatedAt = Date.now();
  saveBooks(books);
  renderShelf();
}


// ==================== Task 6: 双页阅读器 ====================

let currentPages = []; // loaded pages for current book

function openReader(bookId) {
  currentBookId = bookId;
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book) { showToast('书籍不存在'); return; }
  // Load pages from separate storage
  currentPages = getS('vibe_reading_pages_' + bookId, []);
  if (!currentPages || currentPages.length === 0) {
    showToast('页面数据丢失，请重新上传');
    return;
  }
  currentPage = book.currentPage || 1;
  // Ensure odd start for left page
  if (currentPage % 2 === 0) currentPage = Math.max(1, currentPage - 1);
  document.getElementById('readerTitle').textContent = book.title;
  showView('reader');
  renderPages();
}

function renderPages() {
  const total = currentPages.length;
  const leftNum = currentPage;
  const rightNum = currentPage + 1;
  const leftPage = currentPages.find(p => p.pageNum === leftNum);
  const rightPage = currentPages.find(p => p.pageNum === rightNum);
  const leftEl = document.getElementById('leftPage');
  const rightEl = document.getElementById('rightPage');
  if (leftEl) {
    leftEl.innerHTML = leftPage
      ? `<div class="page-num">— 第 ${leftNum} 页 —</div>${formatPageText(leftPage.text)}`
      : '<div class="page-num">无内容</div>';
  }
  if (rightEl) {
    rightEl.innerHTML = rightPage
      ? `<div class="page-num">— 第 ${rightNum} 页 —</div>${formatPageText(rightPage.text)}`
      : (leftNum < total ? `<div class="page-num">— 第 ${rightNum} 页 —</div><div class="empty-state">无内容</div>` : '');
  }
  // Update page info
  const info = document.getElementById('pageInfo');
  if (info) info.textContent = `${leftNum}${rightNum <= total ? '-' + rightNum : ''} / ${total}`;
  // Update nav buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = (currentPage <= 1);
  if (nextBtn) nextBtn.disabled = (currentPage >= total - 1);
  // Save progress
  saveProgress(currentBookId, currentPage);
}

function nextPage() {
  const total = currentPages.length;
  if (currentPage < total - 1) {
    currentPage = Math.min(currentPage + 2, total);
    if (currentPage % 2 === 0) currentPage = Math.max(1, currentPage - 1);
    renderPages();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage = Math.max(1, currentPage - 2);
    if (currentPage % 2 === 0) currentPage = Math.max(1, currentPage - 1);
    renderPages();
  }
}

function saveProgress(bookId, page) {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.currentPage = page;
    book.updatedAt = Date.now();
    // Auto-mark as finished when reaching last page
    if (book.status === '在读' && page >= (book.totalPages || currentPages.length)) {
      book.status = '已读完';
      showToast('🎉 恭喜读完了！已自动标记为「已读完」');
    }
    saveBooks(books);
  }
}


// ==================== Task 7: LLM记忆表格更新 ====================

// 7.1 记忆表格数据层
function getMemoryTable(bookId) {
  return getS('vibe_reading_table_' + bookId, null);
}
function saveMemoryTable(bookId, table) {
  table.updatedAt = Date.now();
  setS('vibe_reading_table_' + bookId, table);
}

// 7.2 LLM分析引擎
function buildTableUpdatePrompt(pagesText, existingTable, template) {
  const fieldsStr = template.join('、');
  const existingJSON = existingTable.rows.length > 0
    ? JSON.stringify({ fields: existingTable.fields, rows: existingTable.rows })
    : '（空表格，尚无数据）';
  return `你是一个阅读分析助手。请根据以下两页书籍内容，更新或补充现有的记忆表格。

【重要规则】
1. 你的任务是"维护表格"，不是"填表"。如果信息没变，不要重复记录。
2. 仅在出现新信息时增加行，已有信息只需更新对应行。
3. 返回完整的更新后表格（包含旧行和新行）。
4. 严格使用以下字段：${fieldsStr}
5. 返回格式必须是纯JSON，不要包含markdown代码块标记。

【现有表格】
${existingJSON}

【当前页面内容】
${pagesText}

请返回更新后的完整表格，格式：
{"fields":[${template.map(f => '"' + f + '"').join(',')}],"rows":[["值1","值2",...],["值1","值2",...]]}`;
}

function parseTableResponse(response) {
  // Try direct JSON parse first
  try {
    const data = JSON.parse(response);
    if (data.fields && Array.isArray(data.rows)) return data;
  } catch {}
  // Try regex extraction
  const match = response.match(/\{[\s\S]*"fields"[\s\S]*"rows"[\s\S]*\}/);
  if (match) {
    try {
      const data = JSON.parse(match[0]);
      if (data.fields && Array.isArray(data.rows)) return data;
    } catch {}
  }
  return null;
}

async function analyzeCurrentPages(bookId, fromPage, toPage) {
  bookId = bookId || currentBookId;
  if (!bookId) { showToast('请先打开一本书'); return; }
  const { apiUrl, apiKey } = getApiConfig();
  if (!apiUrl || !apiKey) { showToast('请先在设置中配置API'); return; }
  const table = getMemoryTable(bookId);
  if (!table) { showToast('表格数据异常'); return; }
  // Get pages in range
  const from = fromPage || currentPage;
  const to = toPage || (currentPage + 1);
  const pagesToAnalyze = [];
  for (let i = from; i <= to; i++) {
    const p = currentPages.find(pg => pg.pageNum === i);
    if (p) pagesToAnalyze.push(p);
  }
  const pagesText = pagesToAnalyze.map(p => `【第${p.pageNum}页】\n${p.text}`).join('\n\n');
  if (!pagesText.trim()) { showToast('选定页面无内容'); return; }
  try {
    showLoading(true);
    createSnapshot(bookId, table, from, to);
    const prompt = buildTableUpdatePrompt(pagesText, table, table.fields);
    const response = await callLLM(prompt, 0.3, '你是一个精确的阅读分析助手，只返回JSON格式数据。');
    const parsed = parseTableResponse(response);
    if (!parsed) {
      showLoading(false);
      showToast('AI返回格式异常，表格未更新');
      return;
    }
    const merged = mergeTableUpdate(table, parsed);
    saveMemoryTable(bookId, merged);
    showLoading(false);
    showToast('记忆表格已更新（第' + from + '-' + to + '页）');
  } catch (e) {
    showLoading(false);
    console.error('AI分析失败:', e);
    showToast('AI分析失败: ' + e.message);
  }
}

function showAnalyzeModal() {
  if (!currentBookId) { showToast('请先打开一本书'); return; }
  const modal = document.getElementById('analyzeModal');
  modal.style.display = 'flex';
  const total = currentPages.length;
  document.getElementById('analyzeFrom').value = currentPage;
  document.getElementById('analyzeTo').value = Math.min(currentPage + 1, total);
  document.getElementById('analyzeFrom').max = total;
  document.getElementById('analyzeTo').max = total;
  document.getElementById('analyzePageHint').textContent = '当前第 ' + currentPage + ' 页，共 ' + total + ' 页';
}
function closeAnalyzeModal() {
  document.getElementById('analyzeModal').style.display = 'none';
}
function runAnalyzeRange() {
  const from = parseInt(document.getElementById('analyzeFrom').value) || 1;
  const to = parseInt(document.getElementById('analyzeTo').value) || from;
  if (from > to) { showToast('起始页不能大于结束页'); return; }
  if (to - from > 20) { showToast('一次最多分析20页，请缩小范围'); return; }
  closeAnalyzeModal();
  analyzeCurrentPages(currentBookId, from, to);
}

// 7.3 表格合并
function mergeTableUpdate(existing, update) {
  // Use existing fields as canonical
  const fields = existing.fields;
  const existingRows = existing.rows || [];
  const updateRows = update.rows || [];
  // Simple merge: keep all existing rows, add new rows that don't duplicate
  // Dedup by first column (primary key like character name, experiment name, etc.)
  const existingKeys = new Set(existingRows.map(r => String(r[0] || '').trim().toLowerCase()));
  const newRows = [];
  for (const row of updateRows) {
    const key = String(row[0] || '').trim().toLowerCase();
    if (!key) continue;
    if (existingKeys.has(key)) {
      // Update existing row - find and replace
      const idx = existingRows.findIndex(r => String(r[0] || '').trim().toLowerCase() === key);
      if (idx >= 0) {
        // Merge: prefer non-empty update values
        existingRows[idx] = existingRows[idx].map((v, i) => {
          const newVal = row[i] || '';
          return newVal.trim() ? newVal : v;
        });
      }
    } else {
      newRows.push(row);
      existingKeys.add(key);
    }
  }
  return {
    ...existing,
    fields,
    rows: [...existingRows, ...newRows],
    updatedAt: Date.now()
  };
}


// ==================== Task 8: 记忆表格查看与快照管理 ====================

// 8.1 表格HTML渲染
function renderTableHTML(table) {
  if (!table || !table.fields || table.rows.length === 0) {
    return '<div class="table-empty">📋 表格为空，阅读时点击小助手来填充</div>';
  }
  // Token estimate: ~1.5 tokens per Chinese char, ~1 per English word
  const jsonStr = JSON.stringify({ fields: table.fields, rows: table.rows });
  const tokenEst = Math.round(jsonStr.length * 0.8);
  let html = `<div class="table-token-info" style="text-align:right;font-size:12px;margin-bottom:8px;color:#666;">📊 ${table.rows.length} 行 · 约 ${tokenEst} tokens</div>`;
  html += '<table><thead><tr>';
  table.fields.forEach((f, fi) => { html += `<th>${f}</th>`; });
  html += '<th style="width:40px;"></th>';
  html += '</tr></thead><tbody>';
  table.rows.forEach((row, ri) => {
    html += '<tr>';
    table.fields.forEach((_, ci) => {
      html += `<td contenteditable="true" data-row="${ri}" data-col="${ci}" class="editable-cell">${row[ci] || ''}</td>`;
    });
    html += `<td><button class="snapshot-restore" onclick="deleteTableRow(${ri})" style="color:#ff6b6b;border-color:#4a2020;font-size:10px;">✕</button></td>`;
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function setupTableEditing() {
  const tableContent = document.getElementById('tableContent');
  if (!tableContent) return;
  tableContent.addEventListener('blur', function(e) {
    if (e.target.classList.contains('editable-cell')) {
      const ri = parseInt(e.target.dataset.row);
      const ci = parseInt(e.target.dataset.col);
      const table = getMemoryTable(currentBookId);
      if (table && table.rows[ri]) {
        table.rows[ri][ci] = e.target.textContent.trim();
        saveMemoryTable(currentBookId, table);
      }
    }
  }, true);
}

function deleteTableRow(rowIndex) {
  if (!currentBookId) return;
  const table = getMemoryTable(currentBookId);
  if (!table || !table.rows[rowIndex]) return;
  table.rows.splice(rowIndex, 1);
  saveMemoryTable(currentBookId, table);
  showTableView();
  showToast('已删除该行');
}

function showTableView() {
  if (!currentBookId) { showToast('请先打开一本书'); return; }
  const table = getMemoryTable(currentBookId);
  const tableContent = document.getElementById('tableContent');
  if (tableContent) {
    tableContent.innerHTML = table ? renderTableHTML(table) : '<div class="table-empty">无表格数据</div>';
    setupTableEditing();
  }
  renderSnapshotList(currentBookId);
  showView('table');
}

function showEditFields() {
  if (!currentBookId) return;
  const table = getMemoryTable(currentBookId);
  if (!table) return;
  document.getElementById('editFieldsInput').value = (table.fields || []).join('，');
  document.getElementById('editFieldsModal').style.display = 'flex';
}
function closeEditFields() {
  document.getElementById('editFieldsModal').style.display = 'none';
}
function saveEditFields() {
  const raw = document.getElementById('editFieldsInput').value.trim();
  if (!raw) { showToast('请输入至少一个字段'); return; }
  const fields = raw.split(/[,，、]/).map(f => f.trim()).filter(f => f);
  if (fields.length === 0) { showToast('请输入至少一个字段'); return; }
  const table = getMemoryTable(currentBookId);
  if (!table) return;
  table.fields = fields;
  table.updatedAt = Date.now();
  saveMemoryTable(currentBookId, table);
  closeEditFields();
  showTableView();
  showToast('字段已更新');
}

// 8.2 快照管理
function getSnapshots(bookId) {
  return getS('vibe_reading_snapshots_' + bookId, []);
}

function createSnapshot(bookId, table, fromPage, toPage) {
  const snapshots = getSnapshots(bookId);
  snapshots.push({
    id: 'snap_' + Date.now(),
    bookId,
    pageNum: fromPage,
    toPage: toPage || fromPage,
    table: JSON.parse(JSON.stringify({ fields: table.fields, rows: table.rows })),
    createdAt: Date.now()
  });
  pruneSnapshots(bookId, snapshots);
}

function pruneSnapshots(bookId, snapshots) {
  // Keep max 10, remove oldest
  while (snapshots.length > 10) snapshots.shift();
  setS('vibe_reading_snapshots_' + bookId, snapshots);
}

function restoreSnapshot(bookId, snapshotId) {
  const snapshots = getSnapshots(bookId);
  const snap = snapshots.find(s => s.id === snapshotId);
  if (!snap) { showToast('快照不存在'); return; }
  const table = getMemoryTable(bookId);
  if (table) {
    table.fields = snap.table.fields;
    table.rows = snap.table.rows;
    saveMemoryTable(bookId, table);
    showToast('已恢复到快照');
    showTableView();
  }
}

function renderSnapshotList(bookId) {
  const list = document.getElementById('snapshotList');
  if (!list) return;
  const snapshots = getSnapshots(bookId);
  if (snapshots.length === 0) {
    list.innerHTML = '<div class="empty-state" style="padding:20px">暂无快照</div>';
    return;
  }
  list.innerHTML = snapshots.slice().reverse().map(s => {
    const time = new Date(s.createdAt).toLocaleString('zh-CN');
    const pageRange = s.toPage && s.toPage !== s.pageNum
      ? `第 ${s.pageNum}-${s.toPage} 页`
      : `第 ${s.pageNum} 页`;
    return `<div class="snapshot-item">
      <div>
        <div class="snapshot-time">${time}</div>
        <div class="snapshot-page">分析 ${pageRange} 时保存</div>
      </div>
      <button class="snapshot-restore" onclick="restoreSnapshot('${bookId}','${s.id}')">恢复</button>
    </div>`;
  }).join('');
}
