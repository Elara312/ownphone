// vision-relay.js - 全局识图中转API服务模块
// 挂载到 window.VisionRelay，供所有页面调用

window.VisionRelay = {
    /**
     * 获取当前配置
     * @returns {{ apiUrl: string, apiKey: string, model: string } | null}
     */
    getConfig() {
        try {
            const raw = localStorage.getItem('vibe_vision_api_config');
            if (!raw) return null;
            const config = JSON.parse(raw);
            if (config && config.apiUrl && config.apiKey && config.model) {
                return config;
            }
            return null;
        } catch (e) {
            console.warn('⚠️ [VisionRelay] 读取配置失败:', e);
            return null;
        }
    },

    /**
     * 检查是否已配置
     * @returns {boolean}
     */
    isConfigured() {
        const config = this.getConfig();
        return config !== null;
    },

    /**
     * 将图片（base64）发送给 vision API，获取文字描述
     * @param {string} base64Image - base64 编码的图片数据（含 data:image/... 前缀）
     * @param {string} [customPrompt] - 可选的自定义 system prompt
     * @returns {Promise<{ success: boolean, description?: string, error?: string }>}
     */
    async describeImage(base64Image, customPrompt) {
        const config = this.getConfig();
        if (!config) {
            return { success: false, error: '识图中转API未配置，请前往应用总设置配置' };
        }

        const systemPrompt = customPrompt || 
            '你是一个图片描述助手。请详细描述图片中的以下内容：\n' +
            '1. 文字内容：图片中出现的所有文字，按位置和层次逐一列出\n' +
            '2. 图画内容：图片中的图形、插画、照片等视觉元素\n' +
            '3. 整体布局：图片的排版结构、颜色搭配和整体风格\n' +
            '请尽可能详细和准确地描述。';

        try {
            const url = config.apiUrl.replace(/\/+$/, '') + '/chat/completions';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: '请描述这张图片。' },
                                { type: 'image_url', image_url: { url: base64Image } }
                            ]
                        }
                    ],
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                return { success: false, error: `API请求失败 (${response.status}): ${errText}` };
            }

            const data = await response.json();
            const description = data.choices?.[0]?.message?.content;
            if (description) {
                return { success: true, description: description.trim() };
            } else {
                return { success: false, error: 'API返回数据格式异常，未获取到描述' };
            }
        } catch (e) {
            console.error('❌ [VisionRelay] 调用失败:', e);
            return { success: false, error: `识图API调用失败: ${e.message}` };
        }
    }
};
