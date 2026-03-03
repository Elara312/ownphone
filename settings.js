// 切换面板
function showPanel(panelName) {
    // 更新侧边栏
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.sidebar-item').classList.add('active');
    
    // 更新面板
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`panel-${panelName}`).classList.add('active');
}

// 加载配置
function loadConfig() {
    const apiUrl = localStorage.getItem('apiUrl') || '';
    const apiKey = localStorage.getItem('apiKey') || '';
    
    document.getElementById('apiUrl').value = apiUrl;
    document.getElementById('apiKey').value = apiKey;
    const tempInput = document.getElementById('apiTemperature');
    if (tempInput) {
        const storedTemp = localStorage.getItem('apiTemperature');
        tempInput.value = storedTemp !== null ? storedTemp : '0.8';
    }
    
    loadSchemeList();
}

// 加载方案列表
function loadSchemeList() {
    const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
    const list = document.getElementById('schemeList');
    
    if (schemes.length === 0) {
        list.innerHTML = '<p style="color: #95a5a6; text-align: center; padding: 20px;">暂无保存的方案</p>';
        return;
    }
    
    list.innerHTML = '<h3 style="margin: 30px 0 15px; font-size: 18px; color: #2c3e50;">已保存的方案</h3>';
    
    schemes.forEach(scheme => {
        const item = document.createElement('div');
        item.className = 'scheme-item';
        
        item.innerHTML = `
            <div class="scheme-item-info">
                <div class="scheme-item-name">${scheme.name}</div>
                <div class="scheme-item-model">${scheme.model || '未选择模型'}</div>
            </div>
            <div class="scheme-item-actions">
                <button class="btn-small" onclick="useScheme('${scheme.id}')">使用</button>
                <button class="btn-small" onclick="deleteScheme('${scheme.id}')" style="background: #ff4444; color: white;">删除</button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

// 获取模型列表
async function fetchModels() {
    const apiUrl = document.getElementById('apiUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    
    if (!apiUrl || !apiKey) {
        alert('请先填写反代地址和 API Key');
        return;
    }
    
    try {
        // 修复URL双斜杠问题
        const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        
        const response = await fetch(`${cleanApiUrl}/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error('获取模型列表失败');
        }
        
        const data = await response.json();
        const models = data.data || [];
        
        const modelSelect = document.getElementById('modelSelect');
        modelSelect.innerHTML = '';
        
        const modelNames = [];
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.id;
            modelSelect.appendChild(option);
            modelNames.push(model.id);
        });
        
        // 保存模型列表供联系人使用
        localStorage.setItem('availableModels', JSON.stringify(modelNames));
        
        document.getElementById('modelSelectGroup').style.display = 'block';
        alert(`成功获取 ${models.length} 个模型`);
    } catch (error) {
        alert('获取模型列表失败: ' + error.message);
    }
}

// 保存 API 方案
function saveApiScheme() {
    const name = document.getElementById('schemeName').value.trim();
    const apiUrl = document.getElementById('apiUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const model = document.getElementById('modelSelect').value;
    const tempInput = document.getElementById('apiTemperature');
    const tempValue = tempInput ? parseFloat(tempInput.value) : NaN;
    
    if (!name) {
        alert('请输入方案名称');
        return;
    }
    
    if (!apiUrl || !apiKey) {
        alert('请填写反代地址和 API Key');
        return;
    }
    
    if (!model) {
        alert('请先获取模型列表并选择一个模型');
        return;
    }
    
    const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
    
    const newScheme = {
        id: Date.now().toString(),
        name: name,
        apiUrl: apiUrl,
        apiKey: apiKey,
        model: model,
        temperature: !isNaN(tempValue) ? tempValue : 0.8,
        createdAt: new Date().toISOString()
    };
    
    schemes.push(newScheme);
    localStorage.setItem('vibe_api_schemes', JSON.stringify(schemes));
    
    // 清空表单
    document.getElementById('schemeName').value = '';
    document.getElementById('modelSelectGroup').style.display = 'none';
    
    loadSchemeList();
    alert(`方案 "${name}" 已保存`);
}

// 设为默认配置
function setAsDefault() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const model = document.getElementById('modelSelect').value;
     const tempInput = document.getElementById('apiTemperature');
     const tempValue = tempInput ? tempInput.value.trim() : '';
    
    if (!apiUrl || !apiKey) {
        alert('请填写反代地址和 API Key');
        return;
    }
    
    localStorage.setItem('apiUrl', apiUrl);
    localStorage.setItem('apiKey', apiKey);
    if (model) {
        localStorage.setItem('selectedModel', model);
    }
    if (tempValue) {
        localStorage.setItem('apiTemperature', tempValue);
    }
    
    alert('已设为默认配置');
}

// 使用方案
function useScheme(schemeId) {
    const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
    const scheme = schemes.find(s => s.id === schemeId);
    
    if (!scheme) return;
    
    document.getElementById('apiUrl').value = scheme.apiUrl;
    document.getElementById('apiKey').value = scheme.apiKey;
    const tempInput = document.getElementById('apiTemperature');
    if (tempInput) {
        if (scheme.temperature !== undefined) {
            tempInput.value = scheme.temperature;
        } else {
            const storedTemp = localStorage.getItem('apiTemperature');
            tempInput.value = storedTemp !== null ? storedTemp : '0.8';
        }
    }
    
    // 显示模型选择
    const modelSelect = document.getElementById('modelSelect');
    modelSelect.innerHTML = `<option value="${scheme.model}">${scheme.model}</option>`;
    document.getElementById('modelSelectGroup').style.display = 'block';
    
    alert(`已加载方案 "${scheme.name}"`);
}

// 删除方案
function deleteScheme(schemeId) {
    if (!confirm('确定要删除这个方案吗？')) return;
    
    let schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
    schemes = schemes.filter(s => s.id !== schemeId);
    localStorage.setItem('vibe_api_schemes', JSON.stringify(schemes));
    
    loadSchemeList();
    alert('方案已删除');
}

// 导出所有数据
function exportAllData() {
    const data = {};
    
    // 导出所有 localStorage 数据（不再过滤，全部备份）
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ipad-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('所有数据已导出（共 ' + Object.keys(data).length + ' 项）');
}

// 导入数据
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            Object.keys(data).forEach(key => {
                if (data[key]) {
                    localStorage.setItem(key, data[key]);
                }
            });
            
            alert('配置导入成功，页面将刷新');
            window.location.reload();
        } catch (error) {
            alert('导入失败: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// 初始化
loadConfig();


// 应用全局自定义字体
async function applyGlobalCustomFont() {
    // 初始化 IndexedDB
    const fontDB = await initFontDB();
    
    // 加载字体方案元数据
    const fontSchemes = JSON.parse(localStorage.getItem('fontSchemes') || '{}');
    const activeFontScheme = localStorage.getItem('activeFontScheme');
    
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

// 页面加载时应用字体
applyGlobalCustomFont();

// ==================== MiniMax 配置功能 ====================

// 加载 MiniMax 配置
function loadMinimaxConfig() {
    const config = JSON.parse(localStorage.getItem('minimax_config') || '{}');
    
    if (config.enabled !== undefined) document.getElementById('minimaxEnabled').checked = config.enabled;
    if (config.region) {
        document.getElementById('minimaxRegion').value = config.region;
        toggleCustomProxy(); // 显示/隐藏自定义代理输入框
    }
    if (config.apiKey) document.getElementById('minimaxApiKey').value = config.apiKey;
    if (config.model) document.getElementById('minimaxModelSelect').value = config.model;
    if (config.customProxy) document.getElementById('minimaxCustomProxy').value = config.customProxy;
    
    if (config.apiKey) {
        document.getElementById('minimaxStatus').style.display = 'block';
        document.getElementById('minimaxStatusText').textContent = `已配置 - 状态: ${config.enabled ? '已启用' : '已禁用'} - TTS 模型: ${config.model || 'speech-01-turbo'}`;
    }
}

// 切换自定义代理输入框的显示/隐藏
function toggleCustomProxy() {
    const region = document.getElementById('minimaxRegion').value;
    const customProxyGroup = document.getElementById('customProxyGroup');
    
    if (region === 'custom') {
        customProxyGroup.style.display = 'block';
    } else {
        customProxyGroup.style.display = 'none';
    }
}

// 测试 MiniMax TTS 连接（可选）
async function testMinimaxConnection() {
    const region = document.getElementById('minimaxRegion').value;
    const apiKey = document.getElementById('minimaxApiKey').value.trim();
    const model = document.getElementById('minimaxModelSelect').value;
    
    if (!apiKey) {
        alert('❌ 请先填写 API Key');
        return;
    }
    
    // 根据区域选择设置 baseUrl
    let baseUrl;
    if (region === 'cn') {
        baseUrl = 'https://api.minimax.chat';
    } else if (region === 'cn-bj') {
        baseUrl = 'https://api-bj.minimaxi.com';
    } else {
        baseUrl = 'https://api.minimaxi.com';
    }
    
    const testBtn = event.target;
    const originalText = testBtn.textContent;
    
    testBtn.textContent = '测试中...';
    testBtn.disabled = true;
    
    try {
        // 根据官方文档构建请求体 - 使用 V2 接口的新音色 ID
        const requestBody = {
            model: model,
            text: '测试',
            stream: false,
            voice_setting: {
                voice_id: 'Chinese (Mandarin)_Lyrical_Voice',  // 使用 V2 接口的音色 ID
                speed: 1.0,
                vol: 1.0,
                pitch: 0
            },
            audio_setting: {
                sample_rate: 32000,
                format: 'mp3',
                channel: 1
                // 注意：V2 接口不支持 bitrate 参数
            }
        };
        
        console.log('MiniMax 测试请求:', { baseUrl, model, requestBody });
        
        const testResponse = await fetch(`${baseUrl}/v1/t2a_v2`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const regionName = region === 'cn' ? '国内主域名 (api.minimax.chat)' : 
                           region === 'cn-bj' ? '国内备用 - 北京 (api-bj.minimaxi.com)' : 
                           '国际 (api.minimaxi.com)';
        
        if (testResponse.ok) {
            const data = await testResponse.json();
            console.log('MiniMax 测试成功:', data);
            alert(`✅ 连接测试成功！\n\nTTS 模型: ${model}\n区域: ${regionName}\n\n可以保存配置并使用 TTS 功能了。`);
        } else {
            const errorData = await testResponse.json().catch(() => ({}));
            console.error('MiniMax API 测试失败:', { status: testResponse.status, errorData });
            
            const errorMsg = errorData.base_resp?.status_msg || errorData.message || testResponse.statusText;
            const statusCode = errorData.base_resp?.status_code || testResponse.status;
            
            let alertMsg = `❌ 连接测试失败 (${statusCode})\n\n`;
            alertMsg += `区域: ${regionName}\n`;
            alertMsg += `错误信息: ${errorMsg}\n\n`;
            alertMsg += `请检查:\n`;
            alertMsg += `1. API Key 是否正确（无多余空格）\n`;
            alertMsg += `2. 区域选择是否匹配您的账户\n`;
            alertMsg += `3. 账户余额是否充足\n`;
            alertMsg += `4. API Key 是否有 TTS 权限\n\n`;
            alertMsg += `提示: 如果主域名失败，可以尝试备用域名\n\n`;
            alertMsg += `详细错误已输出到浏览器控制台（F12）`;
            
            alert(alertMsg);
        }
    } catch (error) {
        console.error('MiniMax 连接测试错误:', error);
        
        const regionName = region === 'cn' ? '国内主域名' : 
                           region === 'cn-bj' ? '国内备用 - 北京' : 
                           '国际';
        
        let errorMsg = `⚠️ 连接测试失败\n\n`;
        errorMsg += `区域: ${regionName}\n`;
        errorMsg += `错误: ${error.message}\n\n`;
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg += `这可能是网络问题或 CORS 限制（浏览器安全限制）。\n\n`;
            errorMsg += `CORS 说明:\n`;
            errorMsg += `- 浏览器会先发送 OPTIONS 预检请求\n`;
            errorMsg += `- 如果服务器不支持跨域，测试会失败\n`;
            errorMsg += `- 但实际使用时可能仍然可以工作\n\n`;
            errorMsg += `建议:\n`;
            errorMsg += `1. 直接保存配置，在实际使用中测试 TTS 功能\n`;
            errorMsg += `2. 如果主域名失败，尝试切换到备用域名\n`;
            errorMsg += `3. 查看浏览器控制台（F12）获取详细错误信息`;
        } else {
            errorMsg += `请检查配置是否正确。`;
        }
        
        alert(errorMsg);
    } finally {
        testBtn.textContent = originalText;
        testBtn.disabled = false;
    }
}

// 保存 MiniMax 设置
function saveMinimaxSettings() {
    const enabled = document.getElementById('minimaxEnabled').checked;
    const region = document.getElementById('minimaxRegion').value;
    const apiKey = document.getElementById('minimaxApiKey').value.trim();
    const model = document.getElementById('minimaxModelSelect').value;
    const customProxy = document.getElementById('minimaxCustomProxy').value.trim();
    
    if (!apiKey) {
        alert('❌ 请填写 API Key');
        return;
    }
    
    if (region === 'custom' && !customProxy) {
        alert('❌ 请填写自定义代理地址');
        return;
    }
    
    if (!enabled) {
        const confirmSave = confirm('⚠️ 注意：您没有勾选"启用 MiniMax 功能"\n\n保存后将无法使用 TTS 功能。\n\n是否继续保存？');
        if (!confirmSave) {
            return;
        }
    }
    
    // 根据区域选择设置 baseUrl
    let baseUrl;
    if (region === 'custom') {
        baseUrl = customProxy;
    } else if (region === 'cn') {
        baseUrl = 'https://api.minimax.chat';
    } else if (region === 'cn-bj') {
        baseUrl = 'https://api-bj.minimaxi.com';
    } else {
        baseUrl = 'https://api.minimaxi.com';
    }
    
    const config = {
        enabled: enabled,
        region: region,
        apiKey: apiKey,
        model: model,
        baseUrl: baseUrl,
        customProxy: customProxy
    };
    
    localStorage.setItem('minimax_config', JSON.stringify(config));
    
    document.getElementById('minimaxStatus').style.display = 'block';
    document.getElementById('minimaxStatusText').textContent = `✅ 已保存 - 状态: ${enabled ? '已启用' : '已禁用'} - TTS 模型: ${model}`;
    
    const regionName = region === 'custom' ? `自定义代理 (${customProxy})` :
                       region === 'cn' ? '国内主域名 (api.minimax.chat)' : 
                       region === 'cn-bj' ? '国内备用 - 北京 (api-bj.minimaxi.com)' : 
                       '国际 (api.minimaxi.com)';
    
    if (enabled) {
        alert(`✅ MiniMax TTS 配置已保存并启用\n\n区域: ${regionName}\nTTS 模型: ${model}\n\n现在可以在消息页面使用 TTS 功能了！`);
    } else {
        alert(`⚠️ MiniMax TTS 配置已保存但未启用\n\n如需使用 TTS 功能，请勾选"启用 MiniMax 功能"后重新保存。`);
    }
}

// ==================== NAI 生图配置功能 ====================

// 切换 NAI 高级设置
function toggleNaiAdvanced() {
    const advanced = document.getElementById('naiAdvancedSettings');
    advanced.style.display = advanced.style.display === 'none' ? 'block' : 'none';
}

// 加载 NAI 配置
function loadNaiConfig() {
    const config = JSON.parse(localStorage.getItem('nai_config') || '{}');
    
    if (config.enabled !== undefined) document.getElementById('naiEnabled').checked = config.enabled;
    if (config.model) document.getElementById('naiModel').value = config.model;
    if (config.apiKey) document.getElementById('naiApiKey').value = config.apiKey;
    if (config.imageSize) document.getElementById('naiImageSize').value = config.imageSize;
    if (config.steps) document.getElementById('naiSteps').value = config.steps;
    if (config.cfgScale) document.getElementById('naiCfgScale').value = config.cfgScale;
    if (config.sampler) document.getElementById('naiSampler').value = config.sampler;
    if (config.seed !== undefined) document.getElementById('naiSeed').value = config.seed;
    if (config.ucPreset) document.getElementById('naiUcPreset').value = config.ucPreset;
    if (config.qualityToggle !== undefined) document.getElementById('naiQualityToggle').checked = config.qualityToggle;
    if (config.smea !== undefined) document.getElementById('naismea').checked = config.smea;
    if (config.smea_dyn !== undefined) document.getElementById('naismea_dyn').checked = config.smea_dyn;
    if (config.undesiredContent) document.getElementById('naiUndesiredContent').value = config.undesiredContent;
    if (config.ucStrength) document.getElementById('naiUcStrength').value = config.ucStrength;
    if (config.defaultPrompt) document.getElementById('naiDefaultPrompt').value = config.defaultPrompt;
    if (config.defaultNegative) document.getElementById('naiDefaultNegative').value = config.defaultNegative;
    
    if (config.apiKey) {
        document.getElementById('naiStatus').style.display = 'block';
        document.getElementById('naiStatusText').textContent = `已配置 - 状态: ${config.enabled ? '已启用' : '已禁用'} - 模型: ${config.model || 'nai-diffusion-3'}`;
    }
}

// 保存 NAI 配置
function saveNaiSettings() {
    const enabled = document.getElementById('naiEnabled').checked;
    const apiKey = document.getElementById('naiApiKey').value.trim();
    
    if (!apiKey) {
        alert('请填写 API Key');
        return;
    }
    
    const config = {
        enabled: enabled,
        model: document.getElementById('naiModel').value,
        apiKey: apiKey,
        imageSize: document.getElementById('naiImageSize').value,
        steps: parseInt(document.getElementById('naiSteps').value),
        cfgScale: parseFloat(document.getElementById('naiCfgScale').value),
        sampler: document.getElementById('naiSampler').value,
        seed: parseInt(document.getElementById('naiSeed').value),
        ucPreset: document.getElementById('naiUcPreset').value,
        qualityToggle: document.getElementById('naiQualityToggle').checked,
        smea: document.getElementById('naismea').checked,
        smea_dyn: document.getElementById('naismea_dyn').checked,
        undesiredContent: document.getElementById('naiUndesiredContent').value.trim(),
        ucStrength: parseFloat(document.getElementById('naiUcStrength').value),
        defaultPrompt: document.getElementById('naiDefaultPrompt').value.trim(),
        defaultNegative: document.getElementById('naiDefaultNegative').value.trim()
    };
    
    localStorage.setItem('nai_config', JSON.stringify(config));
    
    document.getElementById('naiStatus').style.display = 'block';
    document.getElementById('naiStatusText').textContent = `已保存 - 状态: ${enabled ? '已启用' : '已禁用'} - 模型: ${config.model}`;
    
    alert('NovelAI 配置已保存');
}

// 测试 NAI 连接
async function testNaiConnection() {
    const apiKey = document.getElementById('naiApiKey').value.trim();
    
    if (!apiKey) {
        alert('请先填写 API Key');
        return;
    }
    
    try {
        // 测试连接（使用最小参数）
        const response = await fetch('https://api.novelai.net/ai/generate-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: 'test',
                model: 'nai-diffusion-3',
                action: 'generate',
                parameters: {
                    width: 512,
                    height: 512,
                    scale: 5,
                    sampler: 'k_euler_ancestral',
                    steps: 28,
                    seed: 0,
                    n_samples: 1,
                    ucPreset: 0
                }
            })
        });
        
        if (response.ok) {
            alert('✅ 连接成功！API Key 有效');
        } else {
            alert('❌ 连接失败：' + response.status + ' ' + response.statusText);
        }
    } catch (error) {
        alert('❌ 连接失败：' + error.message);
    }
}

// 页面加载时加载配置
loadMinimaxConfig();
loadNaiConfig();
loadVisionRelayConfig();

// ==================== 识图中转API配置 ====================

function loadVisionRelayConfig() {
    try {
        const raw = localStorage.getItem('vibe_vision_api_config');
        if (raw) {
            const config = JSON.parse(raw);
            document.getElementById('visionApiUrl').value = config.apiUrl || '';
            document.getElementById('visionApiKey').value = config.apiKey || '';
            document.getElementById('visionModel').value = config.model || 'gpt-4o';
        }
    } catch (e) {
        console.warn('加载识图中转API配置失败:', e);
    }
}

function saveVisionRelayConfig() {
    const apiUrl = document.getElementById('visionApiUrl').value.trim();
    const apiKey = document.getElementById('visionApiKey').value.trim();
    const model = document.getElementById('visionModel').value.trim();

    if (!apiUrl || !apiKey || !model) {
        alert('请填写完整的API地址、API Key和模型名称');
        return;
    }

    const config = { apiUrl, apiKey, model };
    localStorage.setItem('vibe_vision_api_config', JSON.stringify(config));

    const statusDiv = document.getElementById('visionStatus');
    const statusText = document.getElementById('visionStatusText');
    statusDiv.style.display = 'block';
    statusText.innerHTML = `✅ 配置已保存<br>API地址: ${apiUrl}<br>模型: ${model}`;
    alert('✅ 识图中转API配置已保存');
}

async function testVisionRelayConnection() {
    const apiUrl = document.getElementById('visionApiUrl').value.trim();
    const apiKey = document.getElementById('visionApiKey').value.trim();
    const model = document.getElementById('visionModel').value.trim();

    if (!apiUrl || !apiKey || !model) {
        alert('请先填写完整配置');
        return;
    }

    const statusDiv = document.getElementById('visionStatus');
    const statusText = document.getElementById('visionStatusText');
    statusDiv.style.display = 'block';
    statusText.textContent = '⏳ 正在测试连接...';

    try {
        const url = apiUrl.replace(/\/+$/, '') + '/chat/completions';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'user', content: '你好，这是一条测试消息。请回复"连接成功"。' }
                ],
                max_tokens: 50
            })
        });

        if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || '(无回复内容)';
            statusText.innerHTML = `✅ 连接成功<br>模型回复: ${reply}`;
        } else {
            const errText = await response.text();
            statusText.innerHTML = `❌ 连接失败 (${response.status})<br>${errText}`;
        }
    } catch (e) {
        statusText.innerHTML = `❌ 连接失败: ${e.message}`;
    }
}
