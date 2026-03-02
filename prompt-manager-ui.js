// ==================== 提示词管理 UI 函数 ====================

// 打开提示词管理器
function openPromptManager() {
    // 确保提示词方案已加载
    if (!promptSchemes || Object.keys(promptSchemes).length === 0) {
        console.warn('⚠️ 提示词方案未加载，正在重新加载...');
        loadPromptSchemes();
    }
    
    openPage('page-prompt-manager');
    loadPromptManagerUI();
}

// 加载提示词管理器 UI
function loadPromptManagerUI() {
    // 加载方案列表到下拉框
    const select = document.getElementById('promptSchemeSelect');
    select.innerHTML = '';
    
    Object.values(promptSchemes).forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme.id;
        option.textContent = scheme.name + (scheme.isDefault ? ' (默认)' : '');
        if (scheme.id === currentPromptSchemeId) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    // 加载当前方案的提示词
    loadCurrentPromptToUI();
}

// 加载当前方案的提示词到 UI
function loadCurrentPromptToUI() {
    const scheme = promptSchemes[currentPromptSchemeId];
    if (!scheme || !scheme.prompts) {
        console.error('❌ 当前方案不存在');
        return;
    }
    
    document.getElementById('promptPersonality').value = scheme.prompts.personality || '';
    document.getElementById('promptVideoCall').value = scheme.prompts.videoCall || '';
    document.getElementById('promptVoiceCall').value = scheme.prompts.voiceCall || '';
    document.getElementById('promptSummary').value = scheme.prompts.summary || '';
    document.getElementById('promptMessageFormat').value = scheme.prompts.messageFormat || '';
    
    console.log('✅ 已加载方案:', scheme.name);
}

// 切换提示词方案（UI）
function switchPromptSchemeUI() {
    const select = document.getElementById('promptSchemeSelect');
    const newSchemeId = select.value;
    
    if (switchPromptScheme(newSchemeId)) {
        loadCurrentPromptToUI();
        alert('已切换到方案: ' + promptSchemes[newSchemeId].name);
    }
}

// 保存提示词更改
function savePromptChanges() {
    const scheme = promptSchemes[currentPromptSchemeId];
    if (!scheme) {
        alert('当前方案不存在');
        return;
    }
    
    // 从 UI 读取并保存
    scheme.prompts.personality = document.getElementById('promptPersonality').value;
    scheme.prompts.videoCall = document.getElementById('promptVideoCall').value;
    scheme.prompts.voiceCall = document.getElementById('promptVoiceCall').value;
    scheme.prompts.summary = document.getElementById('promptSummary').value;
    scheme.prompts.messageFormat = document.getElementById('promptMessageFormat').value;
    
    savePromptSchemes();
    
    // 更好的用户反馈
    const saveBtn = document.querySelector('#page-prompt-manager .save-btn');
    if (saveBtn) {
        const originalText = saveBtn.textContent;
        const originalBg = saveBtn.style.background;
        saveBtn.textContent = '✅ 已保存';
        saveBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = originalBg;
        }, 2000);
    } else {
        alert('提示词已保存');
    }
}

// 创建新的提示词方案
function createNewPromptScheme() {
    const name = prompt('请输入新方案名称:');
    if (!name || !name.trim()) {
        alert('方案名称不能为空');
        return;
    }
    
    // 检查名称是否重复
    const existingNames = Object.values(promptSchemes).map(s => s.name);
    if (existingNames.includes(name.trim())) {
        alert('方案名称已存在，请使用其他名称');
        return;
    }
    
    const newId = createPromptScheme(name.trim());
    loadPromptManagerUI();
    
    // 切换到新方案
    document.getElementById('promptSchemeSelect').value = newId;
    switchPromptSchemeUI();
}

// 删除当前提示词方案
function deleteCurrentPromptScheme() {
    if (currentPromptSchemeId === 'default') {
        alert('默认方案不能删除');
        return;
    }
    
    const scheme = promptSchemes[currentPromptSchemeId];
    if (!confirm(`确定要删除方案「${scheme.name}」吗？`)) {
        return;
    }
    
    if (deletePromptScheme(currentPromptSchemeId)) {
        loadPromptManagerUI();
        alert('方案已删除');
    }
}

// 重置提示词为默认值
function resetPromptToDefault(type) {
    const defaultPrompt = defaultPromptSchemes.default.prompts[type];
    
    if (!confirm('确定要恢复为默认提示词吗？')) {
        return;
    }
    
    switch(type) {
        case 'videoCall':
            document.getElementById('promptVideoCall').value = defaultPrompt;
            break;
        case 'voiceCall':
            document.getElementById('promptVoiceCall').value = defaultPrompt;
            break;
        case 'summary':
            document.getElementById('promptSummary').value = defaultPrompt;
            break;
    }
    
    alert('已恢复为默认提示词');
}

// ==================== 提示词管理 UI 函数结束 ====================
// 测试提示词覆盖功能
function testPromptOverride() {
    console.log('🧪 开始测试提示词覆盖功能...');
    
    // 测试1：检查getCurrentPrompt函数
    console.log('1. 测试 getCurrentPrompt 函数:');
    const videoPrompt = getCurrentPrompt('videoCall');
    const voicePrompt = getCurrentPrompt('voiceCall');
    const summaryPrompt = getCurrentPrompt('summary');
    const personalityPrompt = getCurrentPrompt('personality');
    const messageFormatPrompt = getCurrentPrompt('messageFormat');
    
    console.log('   - 视频通话提示词:', videoPrompt.substring(0, 50) + '...');
    console.log('   - 语音通话提示词:', voicePrompt.substring(0, 50) + '...');
    console.log('   - 总结提示词:', summaryPrompt);
    console.log('   - 人设提示词:', personalityPrompt || '(空)');
    console.log('   - 消息格式提示词:', messageFormatPrompt || '(空)');
    
    // 测试2：创建测试方案
    console.log('\n2. 创建测试方案:');
    const testSchemeId = createPromptScheme('测试方案');
    console.log('   - 创建方案ID:', testSchemeId);
    
    // 测试3：更新提示词
    console.log('\n3. 更新测试方案的提示词:');
    const testVideoPrompt = '测试视频通话提示词 - 这是自定义的';
    const testVoicePrompt = '测试语音通话提示词 - 这是自定义的';
    const testSummaryPrompt = '测试总结提示词 - 这是自定义的';
    const testPersonalityPrompt = '测试人设提示词 - 这是自定义的';
    const testMessageFormatPrompt = '测试消息格式提示词 - 这是自定义的';
    
    updatePromptScheme(testSchemeId, 'videoCall', testVideoPrompt);
    updatePromptScheme(testSchemeId, 'voiceCall', testVoicePrompt);
    updatePromptScheme(testSchemeId, 'summary', testSummaryPrompt);
    updatePromptScheme(testSchemeId, 'personality', testPersonalityPrompt);
    updatePromptScheme(testSchemeId, 'messageFormat', testMessageFormatPrompt);
    
    console.log('   - 所有提示词已更新');
    
    // 测试4：切换到测试方案
    console.log('\n4. 切换到测试方案:');
    const oldSchemeId = currentPromptSchemeId;
    switchPromptScheme(testSchemeId);
    console.log('   - 从方案', oldSchemeId, '切换到', testSchemeId);
    
    // 测试5：验证新提示词
    console.log('\n5. 验证新提示词:');
    const newVideoPrompt = getCurrentPrompt('videoCall');
    const newVoicePrompt = getCurrentPrompt('voiceCall');
    const newSummaryPrompt = getCurrentPrompt('summary');
    const newPersonalityPrompt = getCurrentPrompt('personality');
    const newMessageFormatPrompt = getCurrentPrompt('messageFormat');
    
    console.log('   - 视频通话提示词匹配:', newVideoPrompt === testVideoPrompt ? '✅' : '❌');
    console.log('   - 语音通话提示词匹配:', newVoicePrompt === testVoicePrompt ? '✅' : '❌');
    console.log('   - 总结提示词匹配:', newSummaryPrompt === testSummaryPrompt ? '✅' : '❌');
    console.log('   - 人设提示词匹配:', newPersonalityPrompt === testPersonalityPrompt ? '✅' : '❌');
    console.log('   - 消息格式提示词匹配:', newMessageFormatPrompt === testMessageFormatPrompt ? '✅' : '❌');
    
    // 测试6：切换回原方案
    console.log('\n6. 切换回原方案:');
    switchPromptScheme(oldSchemeId);
    console.log('   - 从方案', testSchemeId, '切换回', oldSchemeId);
    
    // 测试7：删除测试方案
    console.log('\n7. 清理测试方案:');
    deletePromptScheme(testSchemeId);
    console.log('   - 测试方案已删除');
    
    console.log('\n🎉 提示词覆盖功能测试完成！');
    alert('提示词覆盖功能测试完成！请查看控制台输出。');
}

// 在页面加载后自动运行测试（可选）
// window.addEventListener('load', function() {
//     // 可以在这里调用 testPromptOverride() 进行自动测试
// });