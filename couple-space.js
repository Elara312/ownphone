// Couple Space Core & UI - Phase 0, 1, 2
// Phase 0: Data Structure & Utils
// Phase 1: UI Framework
// Phase 2: Refresh Logic & Mock Data

(function (global) {
    // ==================== Constants & Keys ====================
    const KEYS = {
        COUPLE_SPACE: 'vibe_couple_space',
        COUPLE_MEMORY: 'vibe_couple_memory_bank',
        CONTACTS: 'vibe_contacts',
        TRAVEL_CARDS_PREFIX: 'travelCards_'
    };

    // ==================== Storage Helpers ====================
    function safeParse(raw, fallback) {
        if (!raw) return fallback;
        try {
            const data = JSON.parse(raw);
            return data == null ? fallback : data;
        } catch (e) {
            console.error('JSON parse error:', e);
            return fallback;
        }
    }

    function getStorage(key, fallback = {}) {
        return safeParse(localStorage.getItem(key), fallback);
    }

    function setStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // ==================== Core Data Logic (Phase 0) ====================
    const CoupleSpace = {
        
        // --- Data Access ---

        loadCoupleSpace: function(contactId) {
            const store = getStorage(KEYS.COUPLE_SPACE);
            const key = String(contactId);
            
            if (!store[key]) {
                store[key] = {
                    settings: this._getDefaultSpaceSettings(),
                    days: {}
                };
                setStorage(KEYS.COUPLE_SPACE, store);
            } else {
                store[key].settings = { ...this._getDefaultSpaceSettings(), ...store[key].settings };
            }
            
            return store[key];
        },

        saveCoupleSpace: function(contactId, data) {
            const store = getStorage(KEYS.COUPLE_SPACE);
            store[String(contactId)] = data;
            setStorage(KEYS.COUPLE_SPACE, store);
        },

        _getDefaultSpaceSettings: function() {
            return {
                timeBlocks: {
                    morning: { time: '08:00', modules: ['sleep', 'bowel', 'meals_breakfast'] },
                    noon: { time: '13:00', modules: ['meals_lunch', 'mood_am'] },
                    evening: { time: '19:00', modules: ['meals_dinner', 'exercise'] },
                    night: { time: '22:00', modules: ['finance', 'diary', 'summary', 'mood_pm'] }
                },
                autoBackfillDays: 0,
                moodEmojiScheme: {
                    "开心": "😄",
                    "平淡": "😐",
                    "难过": "😢",
                    "生气": "😠",
                    "兴奋": "🤩"
                }
            };
        },

        loadCoupleMemoryBank: function(contactId) {
            const store = getStorage(KEYS.COUPLE_MEMORY);
            const key = String(contactId);

            if (!store[key]) {
                store[key] = {
                    daily: [],
                    weekly: [],
                    monthly: [],
                    yearly: [],
                    settings: {
                        injectDaily: 3,
                        injectWeekly: 1,
                        injectMonthly: 1,
                        injectYearly: 1
                    }
                };
                setStorage(KEYS.COUPLE_MEMORY, store);
            }
            
            return store[key];
        },

        saveCoupleMemoryBank: function(contactId, data) {
            const store = getStorage(KEYS.COUPLE_MEMORY);
            store[String(contactId)] = data;
            setStorage(KEYS.COUPLE_MEMORY, store);
        },

        getContactInfo: function(contactId) {
            const contacts = getStorage(KEYS.CONTACTS, []);
            // Use loose comparison for ID as it might be number or string
            return contacts.find(c => String(c.id) === String(contactId)) || null;
        },

        getAllContacts: function() {
             return getStorage(KEYS.CONTACTS, []);
        },

        getTravelData: function(contactId, dateStr) {
            const key = `${KEYS.TRAVEL_CARDS_PREFIX}${contactId}`;
            const cards = getStorage(key, {});
            return cards[dateStr] || null;
        },

        // --- Timezone Utilities ---

        getCharNow: function(contact) {
            if (!contact) return new Date();

            let timezone = 'Asia/Shanghai';
            if (contact.timezoneSettings) {
                if (contact.timezoneSettings.mode === 'different' && contact.timezoneSettings.aiTimezone) {
                    timezone = contact.timezoneSettings.aiTimezone;
                } else if (contact.timezoneSettings.mode === 'same' && contact.timezoneSettings.sharedTimezone) {
                    timezone = contact.timezoneSettings.sharedTimezone;
                }
            }

            const now = new Date();
            const fmt = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            
            const parts = fmt.formatToParts(now);
            const partMap = {};
            parts.forEach(p => partMap[p.type] = p.value);
            
            return new Date(
                parseInt(partMap.year),
                parseInt(partMap.month) - 1,
                parseInt(partMap.day),
                parseInt(partMap.hour),
                parseInt(partMap.minute),
                parseInt(partMap.second)
            );
        },

        getCharDateStr: function(contact, now = new Date()) {
            if (!contact) {
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }

            let timezone = 'Asia/Shanghai';
            if (contact.timezoneSettings) {
                if (contact.timezoneSettings.mode === 'different' && contact.timezoneSettings.aiTimezone) {
                    timezone = contact.timezoneSettings.aiTimezone;
                } else if (contact.timezoneSettings.mode === 'same' && contact.timezoneSettings.sharedTimezone) {
                    timezone = contact.timezoneSettings.sharedTimezone;
                }
            }

            const fmt = new Intl.DateTimeFormat('en-CA', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            
            return fmt.format(now);
        },

        // --- Memory Bank Logic ---
        
        // Add memory to bank
        addMemory: function(contactId, type, content, dateStr) {
            const bank = this.loadCoupleMemoryBank(contactId);
            const list = bank[type] || [];
            
            // Check if already exists for this date/id to avoid dupes?
            // For daily, key is date. For others, maybe ID or range.
            // Let's just append for now, or check date.
            
            const existingIndex = list.findIndex(m => m.date === dateStr);
            if (existingIndex >= 0) {
                list[existingIndex].content = content;
                list[existingIndex].updatedAt = new Date().toISOString();
            } else {
                list.push({
                    id: Date.now().toString(),
                    date: dateStr,
                    content: content,
                    active: true, // Default active
                    createdAt: new Date().toISOString()
                });
            }
            
            // Sort by date desc
            list.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            this.saveCoupleMemoryBank(contactId, bank);
        },
        
        getMemories: function(contactId, type) {
            const bank = this.loadCoupleMemoryBank(contactId);
            return bank[type] || [];
        },
        
        upgradeMemories: async function(contactId, fromType, selectedIds) {
            const bank = this.loadCoupleMemoryBank(contactId);
            const sourceList = bank[fromType] || [];
            const selectedItems = sourceList.filter(m => selectedIds.includes(m.id));
            
            if (selectedItems.length === 0) return null;
            
            const contact = this.getContactInfo(contactId);
            
            // Call AI to summarize
            const content = selectedItems.map(m => `[${m.date}] ${m.content}`).join('\n');
            const prompt = `Summarize these ${fromType} memories into a single ${this._getNextLevel(fromType)} summary. Keep it concise (under 100 words). Focus on key events and emotional shifts.\n\n${content}`;
            
            // Use callAI generic or raw fetch? callAI expects module. Let's add a 'memory_upgrade' module or just raw fetch here.
            // I'll reuse callAI with a special module name or just do raw fetch to keep it simple within CoupleSpace object?
            // Let's extend callAI to handle custom prompts if needed, or just add 'memory_upgrade' case.
            
            const summary = await this.callAI('memory_upgrade', contact, new Date().toISOString().split('T')[0], prompt);
            
            if (summary && summary.content) {
                const nextLevel = this._getNextLevel(fromType);
                const dateStr = new Date().toISOString().split('T')[0]; // Use current date for the upgrade action
                this.addMemory(contactId, nextLevel, summary.content, dateStr);
                
                // Deactivate source memories? User requirement: "Generated: daily active=false, weekly active=true".
                selectedItems.forEach(m => m.active = false);
                this.saveCoupleMemoryBank(contactId, bank);
                
                return true;
            }
            return false;
        },
        
        _getNextLevel: function(level) {
            if (level === 'daily') return 'weekly';
            if (level === 'weekly') return 'monthly';
            if (level === 'monthly') return 'yearly';
            return 'yearly';
        },

        // --- Mock Data Generators (Phase 2) ---
        
        generateMockData: function(module, contact) {
            // Keep original mock data logic as fallback
            switch(module) {
                case 'sleep':
                    const sleepHours = 6 + Math.random() * 3; // 6-9 hours
                    return {
                        duration: sleepHours.toFixed(1),
                        quality: ['Deep', 'Light', 'Restless'][Math.floor(Math.random() * 3)],
                        bedtime: '23:30',
                        wakeup: '07:30',
                        summary: 'Sleep was okay.'
                    };
                case 'bowel':
                    const hasPoop = Math.random() > 0.3;
                    return {
                        count: hasPoop ? 1 : 0,
                        type: hasPoop ? ['Normal', 'Hard', 'Soft'][Math.floor(Math.random() * 3)] : null,
                        time: hasPoop ? '08:30' : null
                    };
                case 'exercise':
                    const steps = Math.floor(Math.random() * 10000);
                    const hasExercise = Math.random() > 0.5;
                    return {
                        steps: steps,
                        workout: hasExercise ? 'Running 30min' : 'None',
                        calories: hasExercise ? 300 : 0
                    };
                case 'meals':
                    return {
                        breakfast: 'Toast & Coffee',
                        lunch: 'Salad',
                        dinner: 'Steak',
                        score: Math.floor(Math.random() * 5) + 1
                    };
                case 'finance':
                    return {
                        spent: (Math.random() * 200).toFixed(2),
                        items: [{ item: 'Coffee', cost: 5.5 }, { item: 'Lunch', cost: 15 }]
                    };
                case 'mood':
                    const moods = ['开心', '平淡', '难过', '生气', '兴奋'];
                    return {
                        mood: moods[Math.floor(Math.random() * moods.length)],
                        reason: 'Nothing special.'
                    };
                case 'diary':
                    return {
                        title: 'A regular day',
                        content: 'Today was just a normal day. Worked a bit, ate some food.',
                        style: 'Casual'
                    };
                default:
                    return {};
            }
        },

        // --- AI Integration (Phase 3) ---

        callAI: async function(module, contact, dateStr, customPrompt) {
            console.log(`[AI] Generating ${module} for ${contact && contact.name} on ${dateStr}...`);
            console.log('[AI] contact info (id, apiScheme, model):', contact && { id: contact.id, apiScheme: contact.apiScheme, model: contact.model });
            // Get API Config
            let apiUrl = localStorage.getItem('apiUrl');
            let apiKey = localStorage.getItem('apiKey');
            let model = contact.model || localStorage.getItem('selectedModel');
            
            // Use contact's API scheme if available (Primary Source)
            let selectedScheme = null;
            
            // Explicitly load contacts again to ensure we have the latest apiScheme
            const contacts = CoupleSpace.getAllContacts();
            const freshContact = contacts.find(c => String(c.id) === String(contact.id));
            const contactApiSchemeId = freshContact ? freshContact.apiScheme : (contact ? contact.apiScheme : null);

            if (contactApiSchemeId) {
                const schemes = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
                console.log('[AI] Looking for scheme ID:', contactApiSchemeId); 
                // Try loose matching by id or name
                selectedScheme = schemes.find(s => String(s.id) === String(contactApiSchemeId) || s.name === contactApiSchemeId);
                if (selectedScheme) {
                    apiUrl = selectedScheme.apiUrl || apiUrl;
                    apiKey = selectedScheme.apiKey || apiKey;
                    model = selectedScheme.model || model;
                    console.log('[AI] Using contact API scheme:', { id: selectedScheme.id, name: selectedScheme.name });
                } else {
                    console.warn('[AI] Contact has apiScheme ID but scheme not found in storage:', contactApiSchemeId);
                }
            } else {
                console.log('[AI] Contact has no API scheme assigned.');
            }

            // If still no API config, try to pick a default saved scheme (first valid) as a fallback
            if ((!apiUrl || !apiKey)) {
                try {
                    const schemesAll = JSON.parse(localStorage.getItem('vibe_api_schemes') || '[]');
                    const firstValid = schemesAll.find(s => s.apiUrl && s.apiKey) || schemesAll[0];
                    if (firstValid) {
                        selectedScheme = selectedScheme || firstValid;
                        apiUrl = firstValid.apiUrl || apiUrl;
                        apiKey = firstValid.apiKey || apiKey;
                        model = firstValid.model || model;
                        console.log('[AI] picked default saved scheme as fallback:', { id: firstValid.id, name: firstValid.name });
                    }
                } catch (e) {
                    console.warn('[AI] Failed to parse saved schemes for fallback', e);
                }
            }

            console.log('[AI] resolved API config:', { apiUrl, hasKey: !!apiKey, model, selectedScheme });

            if (!apiUrl || !apiKey) {
                console.warn('[AI] No API configured, falling back to mock.');
                return this.generateMockData(module, contact);
            }

            // Build enriched context (CHAR/USER/memory/travel/couple data)
            const aiContext = this.buildAIContext(contact, dateStr, module);

            // Determine target language based on bilingual settings
            const isBilingual = contact.bilingualSettings?.enabled || false;
            const targetLanguage = isBilingual ? 'English' : '简体中文';

            // Construct Prompt based on module
            let systemPrompt = `你是角色"${contact.name || '未知'}"。请根据角色人设和行程生成今天的生活记录数据。回复纯JSON，不要包含任何其他文字。
【语言要求】：所有文本字段（summary、reason、content、note、title、workout、item名称等）必须使用${targetLanguage}来填写。
【语气要求】：所有心得、感想、日记类字段（summary、reason、content、note）必须使用第一人称"我"来写，语气自然随意，像在自己的备忘录里记录一样。感想类字段请写2-5句话，不要太简短，要有细节和情绪。
【人设参考】：${contact.personality || contact.persona || '默认角色'}`;
            let userPrompt = customPrompt || `为角色"${contact.name}"生成${dateStr}的${module}数据。`;

            // Prepend context to user prompt to help the model only fill missing fields
            try {
                const ctxText = JSON.stringify(aiContext, null, 2);
                userPrompt = `Context:\n${ctxText}\n\nInstructions:\n${userPrompt}`;
            } catch (e) {
                console.warn('[AI] Failed to stringify context', e);
            }
            
            if (module === 'mood') {
                const moods = ["开心", "平淡", "难过", "生气", "兴奋"];
                userPrompt += `
返回JSON对象：
- mood: 从 ${JSON.stringify(moods)} 中选一个
- reason: 用${targetLanguage}写一句话解释原因（第一人称，符合角色人设）
示例: {"mood": "开心", "reason": "今天吃到了好吃的蛋糕，心情超好~"}
`;
            } else if (module === 'exercise') {
                userPrompt += `
返回JSON对象：
- steps: 整数 (0-20000)
- workout: 用${targetLanguage}描述运动内容（如"跑步5公里"、"没运动"、"瑜伽"）
- calories: 整数（估算消耗卡路里）
- summary: 用${targetLanguage}写2-5句第一人称运动感想（如"今天跑了五公里，腿有点酸但是心情很好。回来的路上买了杯冰美式犒劳自己。"）
`;
            } else if (module === 'meals') {
                userPrompt += `
返回JSON对象：
- breakfast: 用${targetLanguage}描述早餐内容
- lunch: 用${targetLanguage}描述午餐内容
- dinner: 用${targetLanguage}描述晚餐内容（如果时间还没到可以为null）
- score: 整数 1-5（这是角色今天吃得健不健康的评分，5分满分）
- summary: 用${targetLanguage}写2-5句第一人称饮食感想（如"早上吃了个全麦三明治，感觉还挺健康的。中午没忍住点了炸鸡，罪恶感满满但是真的好吃啊。"）
`;
            } else if (module === 'finance') {
                 const fSettings = (CoupleSpace.loadCoupleSpace(contact.id).settings.financeSettings) || {};
                 userPrompt += `
财务设定：
- 收入模式: ${fSettings.incomePattern || 'stable'}
- 收入水平: ${fSettings.incomeLevel || 'medium'}
- 消费风格: ${fSettings.spendingStyle || 'moderate'}

返回JSON对象：
- items: 数组 [{item: "用${targetLanguage}写物品名", cost: 数字, category: "分类", note: "用${targetLanguage}写一句第一人称购物感想"}]
- spent: 总花费（数字）
- summary: 用${targetLanguage}写2-5句第一人称今日消费总结感想
生成1-3个消费项目，符合消费风格。每个item都要有note感想。
`;
            } else if (module === 'diary') {
                userPrompt += `
返回JSON对象：
- title: 用${targetLanguage}写日记标题
- content: 用${targetLanguage}写500-800字的第一人称日记，语气自然随意，像真的在写日记一样。可以适当加入一些手写日记的效果，比如用~~划掉的文字~~表示涂改、用（括号吐槽）表示内心OS、用"……"表示欲言又止、用大写或感叹号表示激动情绪，让日记有真实感和生活气息。
- style: 日记风格（如"感性"、"记录"、"吐槽"、"碎碎念"）
`;
            } else if (module === 'summary') {
                 userPrompt += `
返回JSON对象：
- content: 用${targetLanguage}写一句话总结今天。
`;
            } else if (module === 'memory_upgrade') {
                 userPrompt = customPrompt || '总结记忆。';
                 userPrompt += `\n返回JSON对象：\n- content: 用${targetLanguage}写总结文本。`;
            } else if (module === 'sleep') {
                userPrompt += `
返回JSON对象：
- duration: 数字 (6-9)
- quality: "Deep" / "Light" / "Restless"
- bedtime: "HH:MM"（如 23:30）
- wakeup: "HH:MM"（如 07:30）
- summary: 用${targetLanguage}写2-5句第一人称的睡眠感想（如"昨晚睡得还不错，一觉到天亮。就是半夜被猫踩醒了一次，迷迷糊糊又睡过去了。早上闹钟响了三次才起来，周末就该这样赖床。"）
`;
            } else if (module === 'bowel') {
                userPrompt += `
返回JSON对象：
- count: 数字 (0 或 1)
- type: "Normal" / "Hard" / "Soft"（count > 0 时填写，否则 null）
- time: "HH:MM"（count > 0 时填写，否则 null）
- summary: 用${targetLanguage}写2-5句第一人称的排便感想，语气轻松搞笑（如"终于拉出来了，感觉整个人都轻松了。蹲了十分钟刷了半个小时手机，腿都麻了。"）。如果count为0，就写没拉出来的感想（如"今天肚子咕噜咕噜的但就是没动静，明天多喝点水吧。"）
`;
            } else if (module === 'time_slice' || module === 'full_day') {
                // Combined handler for bulk generation
                const isFullDay = (module === 'full_day');
                const targets = isFullDay 
                    ? ['sleep', 'bowel', 'exercise', 'meals', 'finance', 'mood', 'diary', 'summary']
                    : JSON.parse(customPrompt || '[]');

                userPrompt = `为以下模块生成数据: ${JSON.stringify(targets)}。\n`;
                userPrompt += `返回一个JSON对象，key是模块名（如 "sleep", "meals"），value是对应的数据对象。\n`;
                userPrompt += `
                所有文本字段必须使用${targetLanguage}，心得/感想类字段用第一人称"我"来写，每个感想写2-5句话，要有细节和情绪。
                数据格式说明：
                - sleep: { duration: 数字6-9, quality: "Deep/Light/Restless", bedtime: "HH:MM", wakeup: "HH:MM", summary: "2-5句第一人称睡眠感想" }
                - bowel: { count: 数字, type: "Normal/Hard/Soft", time: "HH:MM", summary: "2-5句第一人称排便感想，轻松搞笑风格" } (count为0也要写感想)
                - exercise: { steps: 数字, workout: "运动描述", calories: 数字, summary: "2-5句第一人称运动感想" }
                - meals: { breakfast: "早餐描述", lunch: "午餐描述", dinner: "晚餐描述", score: 1-5(健康评分5分满分), summary: "2-5句第一人称饮食感想" }
                - finance: { spent: 数字, items: [{item: "物品名", cost: 数字, note: "一句购物感想"}], summary: "2-5句第一人称消费总结" } (收入: ${contact.settings?.financeSettings?.incomeLevel || 'medium'}, 消费: ${contact.settings?.financeSettings?.spendingStyle || 'moderate'})
                - mood: { mood: "开心/平淡/难过/生气/兴奋", reason: "2-5句第一人称原因" }
                - diary: { title: "标题", content: "500-800字第一人称日记，可用~~划线~~、（括号吐槽）等手写效果", style: "风格" }
                - summary: { content: "一句话总结" }
                
                确保数据与角色人设和行程上下文一致。
                `;
            } else {
                 // For other modules (sleep, bowel) in Phase 3/4, we can stick to mock or implement simple prompts
                 console.log(`[AI] Using mock for ${module} as fallback.`);
                 return this.generateMockData(module, contact);
            }

            try {
                const endpoint = `${apiUrl}/chat/completions`.replace(/([^:]\/)\/+/g, '$1');
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ],
                        temperature: 0.7
                    })
                });

                if (!response.ok) throw new Error('API Error');
                const data = await response.json();
                const content = data.choices[0].message.content;
                
                // 健壮的 JSON 解析：处理 AI 返回的各种非标准格式
                let jsonStr = content
                    .replace(/```json\s*/gi, '')  // 去掉 ```json
                    .replace(/```\s*/g, '')        // 去掉 ```
                    .trim();
                
                // 尝试直接解析
                try {
                    return JSON.parse(jsonStr);
                } catch (e1) {
                    console.warn('[AI] Direct JSON.parse failed, attempting cleanup...', e1.message);
                    
                    // 提取第一个 { ... } 或 [ ... ] 块
                    const braceMatch = jsonStr.match(/(\{[\s\S]*\})/);
                    const bracketMatch = jsonStr.match(/(\[[\s\S]*\])/);
                    let extracted = (braceMatch && braceMatch[1]) || (bracketMatch && bracketMatch[1]) || jsonStr;
                    
                    // 清理常见问题：
                    // 1. 去掉行尾注释 // ...
                    extracted = extracted.replace(/\/\/[^\n]*/g, '');
                    // 2. 去掉块注释 /* ... */
                    extracted = extracted.replace(/\/\*[\s\S]*?\*\//g, '');
                    // 3. 去掉尾逗号 (,} 或 ,])
                    extracted = extracted.replace(/,\s*([\]}])/g, '$1');
                    // 4. 把单引号键值换成双引号（简单处理）
                    // 匹配 'key': 或 'value' 但不破坏字符串内的撇号
                    extracted = extracted.replace(/(?<=[\{,\[]\s*)'([^']+)'\s*:/g, '"$1":');
                    // 5. 值中的单引号 → 双引号（仅对简单值）
                    extracted = extracted.replace(/:\s*'([^']*)'/g, ': "$1"');
                    
                    try {
                        return JSON.parse(extracted);
                    } catch (e2) {
                        console.warn('[AI] Cleanup JSON.parse also failed, trying eval fallback...', e2.message);
                        // 最后手段：用 Function 构造器（比 eval 安全一点）
                        try {
                            return (new Function('return (' + extracted + ')'))();
                        } catch (e3) {
                            console.error('[AI] All JSON parse attempts failed. Raw content:', content);
                            throw e3;
                        }
                    }
                }

            } catch (e) {
                console.error('[AI] Generation failed:', e);
                return this.generateMockData(module, contact);
            }
        }

        // Build AI context payload combining CHAR, USER, travel, couple space and couple memory
        ,buildAIContext: function(contact, dateStr, module) {
            const ctx = { CHAR: {}, USER: {}, TRAVEL: null, COUPLE_SPACE_DAY: null, COUPLE_SETTINGS: {}, COUPLE_MEMORY: {} };

            if (!contact) return ctx;

            // CHAR related
            ctx.CHAR.personality = contact.personality || contact.persona || contact.personaDescription || null;
            ctx.CHAR.timezoneSettings = contact.timezoneSettings || null;
            ctx.CHAR.contextWindowSize = (contact.summarySettings && contact.summarySettings.contextWindowSize) || null;

            // USER related
            ctx.USER.name = contact.userPersonaName || contact.userPersona || contact.name || null;
            ctx.USER.bio = contact.userBio || (contact.profile && contact.profile.bio) || null;

            // Chat memory bank (Personal Long-term Memory)
            try {
                // contact.memoryBank might be an array or object depending on implementation
                // usually it's an array of summaries or key-value pairs
                ctx.CHAT_MEMORY = contact.memoryBank || [];
            } catch (e) {
                ctx.CHAT_MEMORY = [];
            }

            // Travel cards / timeline for date
            try {
                ctx.TRAVEL = this.getTravelData(contact.id, dateStr) || null;
            } catch (e) {
                ctx.TRAVEL = null;
            }

            // Couple space today's data & settings
            try {
                const space = this.loadCoupleSpace(contact.id);
                ctx.COUPLE_SETTINGS = space.settings || {};
                // Clone data to avoid mutation and allow masking
                ctx.COUPLE_SPACE_DAY = (space.days && space.days[dateStr]) ? { ...space.days[dateStr] } : {};
                
                // If generating a specific module, mask its current value in context 
                // so AI generates fresh data instead of repeating existing data.
                if (module && ctx.COUPLE_SPACE_DAY[module]) {
                    // For bulk modules like 'time_slice', we might need to parse the module string?
                    // But 'module' here is usually a simple key like 'sleep'. 
                    // If module is 'time_slice', it's a special case handled in callAI prompts usually, 
                    // but masking 'time_slice' key doesn't make sense as it's not a data key.
                    // The data keys are sleep, meals, etc. 
                    // For single module refresh (e.g. 'sleep'), this works perfectly.
                    delete ctx.COUPLE_SPACE_DAY[module];
                }
            } catch (e) {
                ctx.COUPLE_SPACE_DAY = {};
                ctx.COUPLE_SETTINGS = {};
            }

            // Couple memory bank: pick recent active items per settings
            try {
                const mem = this.loadCoupleMemoryBank(contact.id);
                const settings = (mem && mem.settings) ? mem.settings : { injectDaily: 3, injectWeekly: 1, injectMonthly: 1, injectYearly: 1 };

                function pickActive(list, n) {
                    if (!Array.isArray(list) || n <= 0) return [];
                    const sorted = [...list].sort((a, b) => new Date((b.date || b.week || b.month || b.year) || 0) - new Date((a.date || a.week || a.month || a.year) || 0));
                    const active = sorted.filter(m => m && (m.active !== false));
                    return active.slice(0, n);
                }

                ctx.COUPLE_MEMORY.daily = pickActive(mem.daily, settings.injectDaily || 0);
                ctx.COUPLE_MEMORY.weekly = pickActive(mem.weekly, settings.injectWeekly || 0);
                ctx.COUPLE_MEMORY.monthly = pickActive(mem.monthly, settings.injectMonthly || 0);
                ctx.COUPLE_MEMORY.yearly = pickActive(mem.yearly, settings.injectYearly || 0);
                ctx.COUPLE_MEMORY.settings = settings;
            } catch (e) {
                ctx.COUPLE_MEMORY = { daily: [], weekly: [], monthly: [], yearly: [], settings: {} };
            }

            return ctx;
        }
    };

    // ==================== UI Logic (Phase 1 & 2 & 3) ====================
    
    const CoupleSpaceUI = {
        currentContactId: null,
        currentMonthOffset: 0, // 0 = current month, -1 = prev month
        _refreshInProgress: false, // 防止并发刷新导致数据串台

        init: function() {
            // 防止被重复初始化（页面中多处可能调用 init）
            if (this._inited) return;
            this._inited = true;
            console.log('CoupleSpaceUI initializing...');
            this.bindEvents();
            this.renderAvatarStrip();
            this.initCssScheme();
        },

        bindEvents: function() {
            // Refresh Button
            const refreshBtn = document.getElementById('coupleRefreshButton');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.handleRefreshAll());
            }

            // Settings Button
            const settingsBtn = document.getElementById('coupleSettingsButton');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => this.openSettings());
            }

            // Settings Modal Close
            const settingsClose = document.getElementById('coupleSettingsClose');
            if (settingsClose) {
                settingsClose.addEventListener('click', () => {
                    document.getElementById('coupleSettingsModal').style.display = 'none';
                });
            }

            // Save Settings
            const saveSettingsBtn = document.getElementById('coupleSettingsSave');
            if (saveSettingsBtn) {
                saveSettingsBtn.addEventListener('click', () => this.saveSettings());
            }
            
            // Clear Data
            const clearDataBtn = document.getElementById('coupleClearData');
            if (clearDataBtn) {
                clearDataBtn.addEventListener('click', () => this.clearCurrentContactData());
            }
            
            // Module Refresh Buttons
            document.querySelectorAll('.couple-card-refresh').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const module = e.target.getAttribute('data-module');
                    this.handleRefreshModule(module);
                });
            });
            
            // Details Modal Close
            const detailsClose = document.getElementById('coupleDetailsClose');
            if (detailsClose) {
                detailsClose.addEventListener('click', () => {
                    document.getElementById('coupleDetailsModal').style.display = 'none';
                });
            }
            
            // Memory Bank Buttons
            const memoryBtn = document.getElementById('coupleMemoryButton');
            if (memoryBtn) {
                memoryBtn.addEventListener('click', () => this.openMemoryBank());
            }
            
            const memoryClose = document.getElementById('coupleMemoryClose');
            if (memoryClose) {
                memoryClose.addEventListener('click', () => {
                    document.getElementById('coupleMemoryModal').style.display = 'none';
                });
            }
            
            const memoryUpgrade = document.getElementById('coupleMemoryUpgrade');
            if (memoryUpgrade) {
                memoryUpgrade.addEventListener('click', () => this.handleUpgradeMemories());
            }
            
            document.querySelectorAll('.memory-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    document.querySelectorAll('.memory-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    this.renderMemoryList(e.target.dataset.tab);
                });
            });
        },

        // --- Memory Bank UI ---
        
        currentMemoryTab: 'daily',
        
        openMemoryBank: function() {
            if (!this.currentContactId) return;
            document.getElementById('coupleMemoryModal').style.display = 'flex';
            this.renderMemoryList('daily');
        },
        
        renderMemoryList: function(type) {
            this.currentMemoryTab = type;
            const container = document.getElementById('coupleMemoryList');
            const memories = CoupleSpace.getMemories(this.currentContactId, type);
            
            if (memories.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding: 20px; color:#999;">暂无记忆</div>';
                return;
            }
            
            container.innerHTML = memories.map(m => `
                <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; align-items: flex-start; gap: 10px; background: ${m.active ? '#fff' : '#f9f9f9'}; opacity: ${m.active ? 1 : 0.6};">
                    <input type="checkbox" class="memory-select" value="${m.id}" style="margin-top: 5px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12px; color: #888; margin-bottom: 4px;">${m.date} <span style="float:right;">${m.active ? '🟢 Active' : '⚪ Archived'}</span></div>
                        <div style="font-size: 13px; line-height: 1.4;">${m.content}</div>
                    </div>
                </div>
            `).join('');
        },
        
        handleUpgradeMemories: async function() {
            const selected = Array.from(document.querySelectorAll('.memory-select:checked')).map(cb => cb.value);
            if (selected.length === 0) {
                alert('请先选择要总结的记忆条目');
                return;
            }
            
            // 🔒 锁定当前角色ID
            const lockedContactId = String(this.currentContactId);
            
            const btn = document.getElementById('coupleMemoryUpgrade');
            btn.textContent = '生成中...';
            btn.disabled = true;
            
            try {
                const result = await CoupleSpace.upgradeMemories(lockedContactId, this.currentMemoryTab, selected);
                if (result) {
                    alert('总结生成成功！已存入上一级记忆库。');
                    this.renderMemoryList(this.currentMemoryTab);
                } else {
                    alert('生成失败');
                }
            } catch (e) {
                console.error(e);
                alert('发生错误');
            }
            
            btn.textContent = '生成上级总结';
            btn.disabled = false;
        },

        renderAvatarStrip: function() {
            const container = document.getElementById('coupleAvatarStrip');
            if (!container) return;

            const contacts = CoupleSpace.getAllContacts();
            
            container.innerHTML = contacts.map(c => `
                <div class="couple-avatar-item ${this.currentContactId === String(c.id) ? 'active' : ''}" 
                     onclick="CoupleSpaceUI.switchContact('${c.id}')">
                    <div class="couple-avatar-circle">
                        ${c.avatarUrl ? `<img src="${c.avatarUrl}">` : (c.name[0] || '?')}
                    </div>
                    <div class="couple-avatar-label">${c.nickname || c.name}</div>
                </div>
            `).join('');

            // Auto-select first if none selected
            if (!this.currentContactId && contacts.length > 0) {
                this.switchContact(contacts[0].id);
            }
        },

        switchContact: function(contactId) {
            this.currentContactId = String(contactId);
            
            // Update Avatar UI
            document.querySelectorAll('.couple-avatar-item').forEach(el => el.classList.remove('active'));
            // Re-render strip to set active class
            this.renderAvatarStrip();

            const contact = CoupleSpace.getContactInfo(contactId);
            if (contact) {
                document.getElementById('coupleActiveName').textContent = contact.nickname || contact.name;
            }

            this.renderDashboard();
        },

        renderDashboard: function() {
            if (!this.currentContactId) return;

            const space = CoupleSpace.loadCoupleSpace(this.currentContactId);
            const contact = CoupleSpace.getContactInfo(this.currentContactId);
            
            // Use today (char time)
            const dateStr = CoupleSpace.getCharDateStr(contact);
            const todayData = space.days[dateStr] || {};

            console.log(`Rendering dashboard for ${contact.name} on ${dateStr}`, todayData);

            // Phase 3: Render Calendars for specific modules
            this.renderCalendarModule('sleep', space.days, contact);
            this.renderCalendarModule('bowel', space.days, contact);
            this.renderCalendarModule('mood', space.days, contact);
            
            // Render others as simple view for now (Phase 4 will update these)
            this.renderSimpleModule('exercise', todayData.exercise);
            this.renderSimpleModule('meals', todayData.meals);
            this.renderSimpleModule('finance', todayData.finance);
            this.renderSimpleModule('diary', todayData.diary);
            this.renderSimpleModule('summary', todayData.summary);
            
            // Update refresh buttons text based on data existence
            document.querySelectorAll('.couple-card-refresh').forEach(btn => {
                const module = btn.getAttribute('data-module');
                if (todayData && todayData[module] && (Object.keys(todayData[module]).length > 0)) {
                    btn.textContent = '重新生成';
                } else {
                    btn.textContent = '生成';
                }
            });
        },

        renderSimpleModule: function(module, data) {
            const container = document.getElementById(`couple${module.charAt(0).toUpperCase() + module.slice(1)}Body`);
            if (!container) return;

            if (!data) {
                container.innerHTML = '<div style="text-align:center; padding: 20px; color: #ccc;">暂无数据</div>';
                return;
            }
            
            let html = '';
            
            if (module === 'exercise') {
                html = `
                    <div style="font-size: 12px; color: #555; margin-bottom: 5px; line-height: 1.4;">${data.summary || ''}</div>
                    <div style="font-size: 11px; color: #999;">👣 ${data.steps || 0} 步 · 🏋️ ${data.workout || '无运动'} · 🔥 ${data.calories || 0} kcal</div>
                `;
            } else if (module === 'meals') {
                // Helper to extract string from potential object
                const formatMeal = (m) => {
                    if (!m) return '-';
                    if (typeof m === 'string') {
                        // Try parsing string as JSON
                        if (m.trim().startsWith('{')) {
                            try {
                                const parsed = JSON.parse(m);
                                return parsed.text || parsed.food || parsed.description || m;
                            } catch (e) {
                                return m;
                            }
                        }
                        return m;
                    }
                    if (typeof m === 'object') return m.text || m.food || m.description || JSON.stringify(m);
                    return String(m);
                };
                
                html = `
                    <div style="font-size: 12px; margin-bottom: 4px; word-break: break-all;">🥣 <b>早:</b> ${formatMeal(data.breakfast)}</div>
                    <div style="font-size: 12px; margin-bottom: 4px; word-break: break-all;">🍱 <b>午:</b> ${formatMeal(data.lunch)}</div>
                    <div style="font-size: 12px; margin-bottom: 4px; word-break: break-all;">🍲 <b>晚:</b> ${formatMeal(data.dinner)}</div>
                    <div style="font-size: 12px; color: #888; margin-top: 5px;">⭐ 健康分: ${data.score || 0}/5</div>
                `;
            } else if (module === 'finance') {
                const items = Array.isArray(data.items) ? data.items : [];
                const list = items.map(i => {
                    // Safe access to item properties
                    const name = i && (i.item || i.name || '未知项');
                    let cost = i && (i.cost !== undefined ? i.cost : i.amount !== undefined ? i.amount : 0);
                    // Ensure cost is positive for display if it's meant to be spent amount
                    if (cost < 0) cost = Math.abs(cost);
                    
                    return `<div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
                        <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:8px;">${name}</span>
                        <span style="flex-shrink:0;">¥${cost}</span>
                    </div>${i.note ? `<div style="font-size:10px;color:#aaa;margin-bottom:4px;padding-left:4px;">💬 ${i.note}</div>` : ''}`;
                }).join('');
                
                // Fix total spent display
                let totalSpent = data.spent || 0;
                if (totalSpent < 0) totalSpent = Math.abs(totalSpent);

                html = `
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px; color: #d4a574;">💸 总计: ¥${totalSpent}</div>
                    <div style="font-size: 11px; color: #666; max-height: 120px; overflow-y: auto;">
                        ${list || '无消费记录'}
                    </div>
                `;
            } else if (module === 'diary') {
                html = `
                    <div style="font-weight: bold; font-size: 13px; margin-bottom: 5px;">${data.title || '无题'}</div>
                    <div style="font-size: 11px; line-height: 1.4; max-height: 80px; overflow-y: auto; color: #555;">${data.content || '...'}</div>
                    <div style="font-size: 10px; color: #999; margin-top: 5px; text-align: right;">${data.style || ''}</div>
                `;
            } else if (module === 'summary') {
                html = `<div style="font-size: 12px; color: #555; line-height: 1.5;">${data.content || '暂无总结'}</div>`;
            } else if (module === 'sleep') {
                const qualityMap = { Deep: '深度', Light: '浅睡', Restless: '辗转' };
                html = `
                    <div style="font-size: 12px; color: #555; line-height: 1.5;">${data.summary || ''}</div>
                    <div style="font-size: 11px; color: #999; margin-top: 4px;">⏱️ ${data.duration || '?'}h · ${qualityMap[data.quality] || data.quality || ''}</div>
                `;
            } else if (module === 'bowel') {
                if (!data.count || data.count === 0) {
                    html = `<div style="font-size: 12px; color: #555; line-height: 1.4;">${data.summary || '无记录'}</div>`;
                } else {
                    const typeMap = { Normal: '正常', Hard: '偏硬', Soft: '偏软' };
                    html = `
                        <div style="font-size: 12px; color: #555; margin-bottom: 4px; line-height: 1.4;">${data.summary || ''}</div>
                        <div style="font-size: 11px; color: #999;">� ${data.count}次 · ${typeMap[data.type] || data.type || ''} · � ${data.time || ''}</div>
                    `;
                }
            } else if (module === 'mood') {
                const emojiMap = { "开心": "😄", "平淡": "😐", "难过": "😢", "生气": "😠", "兴奋": "🤩" };
                html = `
                    <div style="font-size: 18px; margin-bottom: 4px;">${emojiMap[data.mood] || ''} ${data.mood || ''}</div>
                    <div style="font-size: 11px; color: #666;">${data.reason || ''}</div>
                `;
            } else {
                 html = `<pre style="white-space: pre-wrap; font-family: inherit; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>`;
            }

            container.innerHTML = html;
        },

        renderCalendarModule: function(module, allDaysData, contact) {
            const container = document.getElementById(`couple${module.charAt(0).toUpperCase() + module.slice(1)}Body`);
            if (!container) return;
            
            // Calculate month based on char time + offset
            const charNow = CoupleSpace.getCharNow(contact);
            const targetDate = new Date(charNow.getFullYear(), charNow.getMonth() + this.currentMonthOffset, 1);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth(); // 0-11
            
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
            const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon start

            let html = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; font-weight: bold;">
                    <span>${year}年${month+1}月</span>
                    <div>
                        <button onclick="CoupleSpaceUI.changeMonth(-1)" style="border:none; bg:none; cursor:pointer;">◀</button>
                        <button onclick="CoupleSpaceUI.changeMonth(1)" style="border:none; bg:none; cursor:pointer;">▶</button>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; font-size: 10px;">
                    <div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div><div>日</div>
            `;

            // Empty slots
            for (let i = 0; i < startOffset; i++) {
                html += `<div></div>`;
            }

            // Days
            for (let d = 1; d <= daysInMonth; d++) {
                const dateKey = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dayData = allDaysData[dateKey] ? allDaysData[dateKey][module] : null;
                
                let content = d;
                let bg = '#f5f5f5';
                let clickHandler = '';

                if (dayData) {
                    if (module === 'sleep') {
                        content = dayData.duration || d;
                        bg = '#e3f2fd'; // Light Blue
                        clickHandler = `CoupleSpaceUI.showDetails('${module}', '${dateKey}')`;
                    } else if (module === 'bowel') {
                        content = dayData.count > 0 ? '💩' : d;
                        bg = dayData.count > 0 ? '#fff3e0' : '#f5f5f5';
                        clickHandler = `CoupleSpaceUI.showDetails('${module}', '${dateKey}')`;
                    } else if (module === 'mood') {
                        const emojiMap = { "开心": "😄", "平淡": "😐", "难过": "😢", "生气": "😠", "兴奋": "🤩" };
                        content = emojiMap[dayData.mood] || dayData.mood || d;
                        bg = '#fce4ec'; // Light Pink
                        clickHandler = `CoupleSpaceUI.showDetails('${module}', '${dateKey}')`;
                    }
                }

                html += `<div style="background:${bg}; padding: 4px 0; border-radius: 4px; cursor: pointer;" 
                              onclick="${clickHandler}">${content}</div>`;
            }

            html += `</div>`;
            container.innerHTML = html;
        },

        changeMonth: function(delta) {
            this.currentMonthOffset += delta;
            this.renderDashboard();
        },

        showDetails: function(module, dateKey) {
            const space = CoupleSpace.loadCoupleSpace(this.currentContactId);
            const data = space.days[dateKey] ? space.days[dateKey][module] : null;
            
            if (!data) return;

            const modalBody = document.getElementById('coupleDetailsBody');
            const modalTitle = document.getElementById('coupleDetailsTitle');
            
            const moduleNames = { sleep: '睡眠', bowel: '排便', exercise: '运动', meals: '饮食', finance: '消费', mood: '心情', diary: '日记', summary: '总结' };
            modalTitle.textContent = `${dateKey}  ${moduleNames[module] || module}`;
            modalBody.innerHTML = this.formatDetailContent(module, data);
            
            document.getElementById('coupleDetailsModal').style.display = 'flex';
        },

        formatDetailContent: function(module, data) {
            if (!data) return '<div class="diary-card note-text" style="padding:16px;color:#999;">暂无数据</div>';

            const wrap = (html) => `<div style="padding: 12px 16px; line-height: 1.8; font-size: 14px; color: #444;">${html}</div>`;

            if (module === 'sleep') {
                const qualityMap = { Deep: '深度睡眠', Light: '浅睡', Restless: '辗转难眠' };
                return wrap(`
                    <div style="margin-bottom:10px; font-size:15px;">${data.summary || '没有留下什么感想。'}</div>
                    <div style="color:#888; font-size:12px;">
                        🛏️ ${data.bedtime || '?'} 入睡 → ☀️ ${data.wakeup || '?'} 起床<br>
                        ⏱️ 时长 ${data.duration || '?'} 小时 · ${qualityMap[data.quality] || data.quality || ''}
                    </div>
                `);
            } else if (module === 'bowel') {
                if (!data.count || data.count === 0) {
                    return wrap(`<div style="margin-bottom:8px;">${data.summary || '今天没有排便记录。'}</div>`);
                }
                const typeMap = { Normal: '正常', Hard: '偏硬', Soft: '偏软' };
                return wrap(`
                    <div style="margin-bottom:10px; font-size:15px;">${data.summary || ''}</div>
                    <div style="color:#888; font-size:12px;">
                        💩 ${data.count} 次 · ${typeMap[data.type] || data.type || ''} · 🕐 ${data.time || '?'}
                    </div>
                `);
            } else if (module === 'mood') {
                const emojiMap = { "开心": "😄", "平淡": "😐", "难过": "😢", "生气": "😠", "兴奋": "🤩" };
                return wrap(`
                    <div style="font-size:24px; margin-bottom:8px;">${emojiMap[data.mood] || ''} ${data.mood || ''}</div>
                    <div>${data.reason || ''}</div>
                `);
            } else if (module === 'exercise') {
                return wrap(`
                    <div style="margin-bottom:10px; font-size:15px;">${data.summary || ''}</div>
                    <div style="color:#888; font-size:12px;">
                        👣 ${data.steps || 0} 步 · 🏋️ ${data.workout || '无运动'} · 🔥 ${data.calories || 0} kcal
                    </div>
                `);
            } else if (module === 'meals') {
                const fmt = (m) => {
                    if (!m) return '-';
                    if (typeof m === 'string') return m;
                    if (typeof m === 'object') return m.text || m.food || m.description || '-';
                    return String(m);
                };
                return wrap(`
                    <div style="margin-bottom:10px; font-size:15px;">${data.summary || ''}</div>
                    <div style="color:#666; font-size:12px;">
                        🥣 早餐：${fmt(data.breakfast)}<br>
                        🍱 午餐：${fmt(data.lunch)}<br>
                        🍲 晚餐：${fmt(data.dinner)}
                    </div>
                    <div style="color:#888; font-size:12px; margin-top:6px;">⭐ 健康分 ${data.score || '?'}/5</div>
                `);
            } else if (module === 'finance') {
                const items = Array.isArray(data.items) ? data.items : [];
                const list = items.map(i => `<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>${i.item || i.name || '?'}</span><span>¥${Math.abs(i.cost || i.amount || 0)}</span></div>${i.note ? `<div style="font-size:11px;color:#999;margin-bottom:6px;padding-left:8px;">💬 ${i.note}</div>` : ''}`).join('');
                return wrap(`
                    <div style="margin-bottom:10px; font-size:15px;">${data.summary || ''}</div>
                    <div style="font-weight:bold; margin-bottom:8px;">💸 总计 ¥${Math.abs(data.spent || 0)}</div>
                    <div style="font-size:12px;">${list || '无消费记录'}</div>
                `);
            } else if (module === 'diary') {
                // Render simple markdown-like effects: ~~strikethrough~~
                let content = (data.content || '...').replace(/~~(.+?)~~/g, '<del style="color:#bbb;">$1</del>');
                return wrap(`
                    <div style="font-weight:bold; margin-bottom:8px;">${data.title || '无题'}</div>
                    <div style="line-height:1.8; white-space:pre-wrap;">${content}</div>
                    <div style="color:#999; font-size:11px; text-align:right; margin-top:8px;">${data.style || ''}</div>
                `);
            } else if (module === 'summary') {
                return wrap(`<div>${data.content || '暂无总结'}</div>`);
            }
            // fallback: still show structured data but nicely
            return wrap(`<pre style="white-space:pre-wrap; font-family:inherit; font-size:13px;">${JSON.stringify(data, null, 2)}</pre>`);
        },

        // --- Logic Phase 2 & 3: Refresh (Optimized: Time Blocks & Bulk Gen) ---

        handleRefreshAll: async function() {
            if (!this.currentContactId) {
                console.warn('[CoupleSpaceUI] 无当前角色，生成操作已中止。');
                alert('请先选择一个角色（点击顶部头像）');
                return;
            }
            if (this._refreshInProgress) {
                alert('正在生成中，请等待完成后再操作');
                return;
            }
            this._refreshInProgress = true;
            // 🔒 锁定当前角色ID，防止异步过程中用户切换角色导致数据串台
            const lockedContactId = String(this.currentContactId);
            console.log('[CoupleSpaceUI] handleRefreshAll called for', lockedContactId);
            
            const contact = CoupleSpace.getContactInfo(lockedContactId);
            const space = CoupleSpace.loadCoupleSpace(lockedContactId);
            const settings = space.settings;
            
            // Check for API scheme
            if (contact && contact.apiScheme) {
                console.log('[CoupleSpaceUI] Contact has assigned API Scheme ID:', contact.apiScheme);
            } else {
                console.warn('[CoupleSpaceUI] Contact has NO assigned API Scheme. Will fallback to global default if available.');
            }

            // Determine range: [today - N, ..., today - 1, today]
            const todayStr = CoupleSpace.getCharDateStr(contact);
            const daysToProcess = [];
            
            if (settings.autoBackfillDays > 0) {
                const charNow = CoupleSpace.getCharNow(contact);
                for (let i = settings.autoBackfillDays; i >= 1; i--) {
                    const d = new Date(charNow);
                    d.setDate(d.getDate() - i);
                    daysToProcess.push(CoupleSpace.getCharDateStr(contact, d));
                }
            }
            // Always add today at the end
            if (!daysToProcess.includes(todayStr)) daysToProcess.push(todayStr);

            console.log('Refreshing days:', daysToProcess);
            
            // Show loading state
            const refreshBtn = document.getElementById('coupleRefreshButton');
            if (refreshBtn) {
                refreshBtn.textContent = '生成中...';
                refreshBtn.disabled = true;
            }

            let updated = false;
            let skippedCount = 0;
            
            // Process each day
            for (const dateStr of daysToProcess) {
                if (!space.days[dateStr]) space.days[dateStr] = {};
                const dayData = space.days[dateStr];
                
                // 1. Check Travel Card
                const travel = CoupleSpace.getTravelData(contact.id, dateStr);
                console.log(`[CoupleSpaceUI] Checking travel card for ${dateStr}:`, travel ? 'FOUND' : 'MISSING');

                if (!travel) {
                    console.log('[CoupleSpaceUI] Skipping date (no travel card):', dateStr);
                    skippedCount++;
                    continue; 
                }

                const isToday = (dateStr === todayStr);
                const modulesToGen = [];

                if (!isToday) {
                    // --- Past Date: Bulk Generation (One Shot) ---
                    // Check which modules are missing
                    // We assume 'full day' means all modules. But let's check basic ones.
                    // If any core module is missing, we trigger a full day regen (or smart merge).
                    // For simplicity, let's just ask AI to fill missing fields for the whole day.
                    const coreModules = ['sleep', 'bowel', 'exercise', 'meals', 'finance', 'mood', 'diary', 'summary'];
                    const missing = coreModules.filter(m => !dayData[m] || Object.keys(dayData[m]).length === 0);
                    
                    if (missing.length > 0) {
                        console.log(`[CoupleSpaceUI] Past date ${dateStr} missing modules:`, missing);
                        // Call AI with 'full_day' module type
                        // The AI handler should understand 'full_day' and return a big JSON
                        const generatedDay = await CoupleSpace.callAI('full_day', contact, dateStr);
                        
                        // Merge result into dayData
                        if (generatedDay) {
                            coreModules.forEach(m => {
                                if (generatedDay[m]) dayData[m] = generatedDay[m];
                            });
                            updated = true;
                        }
                    } else {
                        console.log(`[CoupleSpaceUI] Past date ${dateStr} is complete. Skipping.`);
                    }

                } else {
                    // --- Today: Time Block Slicing ---
                    const charNow = CoupleSpace.getCharNow(contact);
                    const nowMinutes = charNow.getHours() * 60 + charNow.getMinutes();
                    
                    // Iterate Time Blocks
                    const blocks = settings.timeBlocks || {}; // { morning: {time:'08:00', modules:[]}, ... }
                    
                    for (const [blockName, blockConfig] of Object.entries(blocks)) {
                        if (!blockConfig.time) continue;
                        
                        const parts = blockConfig.time.split(':');
                        const blockMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                        
                        // Check if block is unlocked
                        if (nowMinutes >= blockMinutes) {
                            // Check modules in this block
                            const blockModules = blockConfig.modules || [];
                            const needed = blockModules.filter(m => {
                                // Map complex keys like 'meals_breakfast' to 'meals' check
                                const realModule = m.split('_')[0]; 
                                // Check if data exists
                                if (!dayData[realModule]) return true;
                                // If it's a sub-field (e.g. meals_breakfast), check that specific field?
                                // For now, keep it simple: if 'meals' object exists, we assume it's handled or we merge.
                                // Actually, 'meals' object might be partial. 
                                // Let's simplify: if we call AI for a block, we pass the block name.
                                // AI returns the relevant partial data.
                                // We only call if at least one module in this block is fully missing or incomplete?
                                // Let's just collect all needed modules for this block.
                                return true; // logic refined below
                            });

                            if (needed.length > 0) {
                                // We construct a 'block_gen' request
                                // But we need to know WHICH specific sub-fields are missing to avoid overwriting?
                                // Or we just pass the current dayData to AI and ask it to "update/fill" the unlocked block.
                                // Let's collect ALL unlocked blocks that have missing data and do ONE call?
                                // Or one call per block? One call per block is safer for context.
                                
                                // Let's refine: Check if this block has already been generated?
                                // We can check if the *last* module in the list exists.
                                // Or we can rely on dayData state.
                                
                                // Let's try to determine "missingness" more granularly
                                const missingInBlock = blockModules.filter(m => {
                                    const [mod, sub] = m.split('_');
                                    if (!dayData[mod]) return true;
                                    if (sub && !dayData[mod][sub]) return true;
                                    return false;
                                });

                                if (missingInBlock.length > 0) {
                                    modulesToGen.push(...missingInBlock);
                                }
                            }
                        }
                    }
                    
                    if (modulesToGen.length > 0) {
                        console.log(`[CoupleSpaceUI] Today ${dateStr} generating unlocked slices:`, modulesToGen);
                        // Call AI with a special 'time_slice' request
                        // We pass the list of fields to generate
                        const generatedSlice = await CoupleSpace.callAI('time_slice', contact, dateStr, JSON.stringify(modulesToGen));
                        
                        // Merge result
                        if (generatedSlice) {
                            // generatedSlice should be like { sleep: {...}, meals: { breakfast: "..." } }
                            for (const [key, val] of Object.entries(generatedSlice)) {
                                if (!dayData[key]) dayData[key] = {};
                                // Deep merge or shallow?
                                if (typeof val === 'object' && val !== null) {
                                    dayData[key] = { ...dayData[key], ...val };
                                } else {
                                    dayData[key] = val;
                                }
                            }
                            updated = true;
                        }
                    } else {
                        console.log(`[CoupleSpaceUI] Today ${dateStr}: No new unlocked blocks to generate.`);
                    }
                }
                
                // If summary was generated/updated, sync to memory bank
                if (updated && dayData.summary && (dayData.summary.content || dayData.summary.text)) {
                    const content = dayData.summary.content || dayData.summary.text;
                    // Only add if not exists? addMemory handles push.
                    // Ideally we only add ONCE per day.
                    // Let's check if memory already exists for this date.
                    const existingMems = CoupleSpace.getMemories(contact.id, 'daily');
                    if (!existingMems.find(m => m.date === dateStr)) {
                         CoupleSpace.addMemory(contact.id, 'daily', content, dateStr);
                    }
                }
            }

            if (updated) {
                CoupleSpace.saveCoupleSpace(lockedContactId, space);
                // 只有当用户仍在查看同一角色时才刷新UI
                if (this.currentContactId === lockedContactId) {
                    this.renderDashboard();
                }
                alert('生成完成！');
            } else {
                if (skippedCount === daysToProcess.length) {
                    alert('未生成数据：所选日期均无行程卡记录。');
                } else {
                    alert('数据已是最新，或未到生成时间。');
                }
            }
            
            if (refreshBtn) {
                refreshBtn.textContent = '生成';
                refreshBtn.disabled = false;
            }
            this._refreshInProgress = false;
        },

        handleRefreshModule: async function(module) {
            if (!this.currentContactId) {
                console.warn('[CoupleSpaceUI] 无当前角色，模块生成已中止:', module);
                alert('请先选择一个角色（点击顶部头像）');
                return;
            }
            if (this._refreshInProgress) {
                alert('正在生成中，请等待完成后再操作');
                return;
            }
            this._refreshInProgress = true;
            // 🔒 锁定当前角色ID，防止异步过程中用户切换角色导致数据串台
            const lockedContactId = String(this.currentContactId);
            console.log('[CoupleSpaceUI] handleRefreshModule called for', module, 'contact', lockedContactId);
            console.log('[CoupleSpaceUI] API config:', { apiUrl: localStorage.getItem('apiUrl'), apiKey: !!localStorage.getItem('apiKey') });
            
            const btn = document.querySelector(`.couple-card-refresh[data-module="${module}"]`);
            if (btn) btn.textContent = '...';

            const contact = CoupleSpace.getContactInfo(lockedContactId);
            const space = CoupleSpace.loadCoupleSpace(lockedContactId);
            const dateStr = CoupleSpace.getCharDateStr(contact);
            
            if (!space.days[dateStr]) space.days[dateStr] = {};
            
            // Force regen for single module
            space.days[dateStr][module] = await CoupleSpace.callAI(module, contact, dateStr);
            
            // If summary, also add to memory bank
            if (module === 'summary' && space.days[dateStr][module] && space.days[dateStr][module].content) {
                CoupleSpace.addMemory(lockedContactId, 'daily', space.days[dateStr][module].content, dateStr);
            }
            
            CoupleSpace.saveCoupleSpace(lockedContactId, space);
            // 只有当用户仍在查看同一角色时才刷新UI
            if (this.currentContactId === lockedContactId) {
                this.renderDashboard();
            }
            
            if (btn) btn.textContent = '生成';
            this._refreshInProgress = false;
        },

        // --- Settings UI ---
        
        openSettings: function() {
             if (!this.currentContactId) return;
             const space = CoupleSpace.loadCoupleSpace(this.currentContactId);
             
             // --- Initialization Safety Check ---
             if (!space.settings) space.settings = CoupleSpace._getDefaultSpaceSettings();
             if (!space.settings.timeBlocks) {
                 // Migrate or reset to defaults if missing
                 space.settings.timeBlocks = CoupleSpace._getDefaultSpaceSettings().timeBlocks;
             }
             
             const s = space.settings;
             const f = s.financeSettings || {};

             // Populate Time Blocks
             document.getElementById('csBlockMorningTime').value = s.timeBlocks.morning?.time || '08:00';
             document.getElementById('csBlockMorningModules').value = (s.timeBlocks.morning?.modules || []).join(', ');
             
             document.getElementById('csBlockNoonTime').value = s.timeBlocks.noon?.time || '13:00';
             document.getElementById('csBlockNoonModules').value = (s.timeBlocks.noon?.modules || []).join(', ');

             document.getElementById('csBlockEveningTime').value = s.timeBlocks.evening?.time || '19:00';
             document.getElementById('csBlockEveningModules').value = (s.timeBlocks.evening?.modules || []).join(', ');

             document.getElementById('csBlockNightTime').value = s.timeBlocks.night?.time || '22:00';
             document.getElementById('csBlockNightModules').value = (s.timeBlocks.night?.modules || []).join(', ');
             
             document.getElementById('csBackfillDays').value = s.autoBackfillDays;
             
             // Couple memory bank injection settings
             try {
                 const mem = CoupleSpace.loadCoupleMemoryBank(this.currentContactId);
                 const ms = mem.settings || {};
                 document.getElementById('csInjectDaily').value = ms.injectDaily || 0;
                 document.getElementById('csInjectWeekly').value = ms.injectWeekly || 0;
                 document.getElementById('csInjectMonthly').value = ms.injectMonthly || 0;
                 document.getElementById('csInjectYearly').value = ms.injectYearly || 0;
             } catch (e) {
                 console.warn('[CoupleSpaceUI] Failed to load memory bank settings', e);
             }
             // Finance settings
             document.getElementById('csIncomePattern').value = f.incomePattern || 'stable';
             document.getElementById('csIncomeLevel').value = f.incomeLevel || 'medium';
             document.getElementById('csSpendingStyle').value = f.spendingStyle || 'moderate';
             
             document.getElementById('coupleSettingsModal').style.display = 'flex';
             this.renderCssSchemeSelect();
        },

        saveSettings: function() {
            if (!this.currentContactId) return;
            const space = CoupleSpace.loadCoupleSpace(this.currentContactId);
            
            // Ensure structure
            if (!space.settings) space.settings = {};
            if (!space.settings.timeBlocks) space.settings.timeBlocks = {};
            
            const tb = space.settings.timeBlocks;
            const parseMods = (str) => str.split(/[,，]/).map(s => s.trim()).filter(s => s);
            
            tb.morning = {
                time: document.getElementById('csBlockMorningTime').value,
                modules: parseMods(document.getElementById('csBlockMorningModules').value)
            };
            tb.noon = {
                time: document.getElementById('csBlockNoonTime').value,
                modules: parseMods(document.getElementById('csBlockNoonModules').value)
            };
            tb.evening = {
                time: document.getElementById('csBlockEveningTime').value,
                modules: parseMods(document.getElementById('csBlockEveningModules').value)
            };
            tb.night = {
                time: document.getElementById('csBlockNightTime').value,
                modules: parseMods(document.getElementById('csBlockNightModules').value)
            };
            
            space.settings.autoBackfillDays = parseInt(document.getElementById('csBackfillDays').value) || 0;
            
            // Save finance settings
            space.settings.financeSettings = {
                incomePattern: document.getElementById('csIncomePattern').value,
                incomeLevel: document.getElementById('csIncomeLevel').value,
                spendingStyle: document.getElementById('csSpendingStyle').value
            };
            
            CoupleSpace.saveCoupleSpace(this.currentContactId, space);
            // Save couple memory bank injection settings
            try {
                const mem = CoupleSpace.loadCoupleMemoryBank(this.currentContactId);
                mem.settings = mem.settings || {};
                mem.settings.injectDaily = parseInt(document.getElementById('csInjectDaily').value) || 0;
                mem.settings.injectWeekly = parseInt(document.getElementById('csInjectWeekly').value) || 0;
                mem.settings.injectMonthly = parseInt(document.getElementById('csInjectMonthly').value) || 0;
                mem.settings.injectYearly = parseInt(document.getElementById('csInjectYearly').value) || 0;
                CoupleSpace.saveCoupleMemoryBank(this.currentContactId, mem);
            } catch (e) {
                console.error('[CoupleSpaceUI] Failed to save memory bank settings', e);
            }
            // 立即从存储中重新读取以确认持久化成功（若失败可在控制台查看）
            try {
                const reloaded = CoupleSpace.loadCoupleSpace(this.currentContactId);
                const before = JSON.stringify(space.settings || {});
                const after = JSON.stringify(reloaded.settings || {});
                if (before !== after) {
                    console.warn('[CoupleSpaceUI] Settings persistence mismatch:', { before, after });
                }
            } catch (e) {
                console.error('[CoupleSpaceUI] Error verifying saved settings', e);
            }

            document.getElementById('coupleSettingsModal').style.display = 'none';
            alert('设置已保存');
        },
        
        // ==================== CSS Scheme Management ====================
        
        CSS_SCHEMES_KEY: 'vibe_couple_space_css_schemes',
        CSS_ACTIVE_KEY: 'vibe_couple_space_css_active',

        getDefaultCssScheme: function() {
            return `/* ===== 情侣空间 CSS 样式 ===== */
/* 提示：修改这些样式可以自定义情侣空间页面的外观 */
/* 所有颜色都使用 CSS 变量，方便统一调整 */

/* --- 整体面板容器 --- */
.couple-space-dashboard {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    flex: 1 1 auto;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) transparent;
}

.couple-space-dashboard::-webkit-scrollbar { width: 6px; }
.couple-space-dashboard::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 10px;
}

/* --- 卡片网格布局 --- */
.couple-sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    width: 100%;
}

/* --- 顶部头像栏 --- */
.couple-space-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: var(--card-color);
    border-radius: var(--border-radius);
    border: 2px solid var(--card-border);
    box-shadow: 0 4px 12px var(--card-shadow);
    gap: 12px;
    flex-wrap: wrap;
}

/* --- 头像滚动条 --- */
.couple-avatar-strip {
    display: flex;
    align-items: center;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
    flex: 1;
    min-width: 0;
}

.couple-avatar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}

.couple-avatar-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--avatar-bg);
    border: 2px solid var(--avatar-border);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 24px;
}

.couple-avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.couple-avatar-label {
    font-size: 11px;
    color: var(--avatar-label-text);
    max-width: 64px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.couple-avatar-item.active .couple-avatar-circle {
    border-color: var(--primary-color);
}

/* --- 操作按钮区 --- */
.couple-space-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.couple-space-actions .add-btn,
.couple-space-actions .stats-btn {
    width: auto;
    padding: 6px 14px;
    font-size: 12px;
    white-space: nowrap;
    flex-shrink: 0;
}

.couple-space-actions .stats-btn {
    width: 32px;
    height: 32px;
    padding: 0;
}

.couple-active-name {
    font-size: 13px;
    color: var(--text-color);
    margin-right: 4px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
}

/* --- 卡片样式 --- */
.couple-card {
    background: var(--card-color);
    border-radius: var(--border-radius);
    border: 2px solid var(--card-border);
    box-shadow: 0 4px 12px var(--card-shadow);
    padding: 16px;
    min-height: 100px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.couple-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px var(--card-shadow);
}

.couple-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}

.couple-card-body {
    font-size: 13px;
    color: var(--muted-color);
    line-height: 1.5;
    word-break: break-word;
    overflow-wrap: break-word;
}

.couple-card-title {
    font-size: 15px;
    font-weight: bold;
    color: var(--text-color);
    margin-bottom: 8px;
}

.couple-card-refresh {
    border: none;
    background: var(--secondary-color);
    color: var(--text-color);
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 10px;
    cursor: pointer;
}

.couple-card-refresh:hover {
    background: var(--accent-color);
}

/* --- 弹窗样式 --- */
.couple-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.couple-modal-content {
    background: var(--card-color);
    border-radius: var(--border-radius);
    border: 2px solid var(--card-border);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
    padding: 16px 18px 14px;
    width: 420px;
    max-width: 90%;
    max-height: 80%;
    display: flex;
    flex-direction: column;
}

.couple-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.couple-modal-title {
    font-size: 14px;
    font-weight: bold;
    color: var(--text-color);
}

.couple-modal-close {
    border: none;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
    color: var(--muted-color);
}

.couple-modal-body {
    font-size: 13px;
    color: var(--text-color);
    line-height: 1.5;
    overflow-y: auto;
    padding-right: 4px;
}

.couple-modal-footer {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}

/* --- 设置行 --- */
.couple-settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
}

.couple-settings-row label {
    font-size: 13px;
    color: var(--text-color);
}

.couple-settings-row input[type="time"],
.couple-settings-row input[type="number"] {
    flex: 0 0 140px;
    padding: 4px 6px;
    border-radius: 6px;
    border: 1px solid var(--card-border);
    background: var(--background-color);
    color: var(--text-color);
    font-size: 12px;
}

/* --- 日历组件 --- */
.couple-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}

.couple-cal-header span { font-size: 12px; color: var(--text-color); }

.couple-cal-nav-btn {
    border: none;
    background: var(--secondary-color);
    color: var(--text-color);
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 8px;
    cursor: pointer;
}

.couple-cal-nav-btn:hover { background: var(--accent-color); }

.couple-cal-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    font-size: 10px;
    color: var(--muted-color);
    margin-bottom: 4px;
    gap: 2px;
}

.couple-cal-weekdays span { text-align: center; }

.couple-cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
    font-size: 11px;
}

.couple-cal-cell {
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid var(--card-border);
    background: rgba(255, 255, 255, 0.6);
    display: flex;
    flex-direction: column;
    padding: 2px 3px;
}

.couple-cal-cell-empty {
    border: none;
    background: transparent;
    cursor: default;
}

.couple-cal-cell-number {
    font-size: 9px;
    color: var(--muted-color);
    text-align: right;
}

.couple-cal-cell-value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--text-color);
}`;
        },

        loadCssSchemes: function() {
            return safeParse(localStorage.getItem(this.CSS_SCHEMES_KEY), {
                '默认方案': this.getDefaultCssScheme()
            });
        },

        saveCssSchemes: function(schemes) {
            localStorage.setItem(this.CSS_SCHEMES_KEY, JSON.stringify(schemes));
        },

        getActiveSchemeName: function() {
            return localStorage.getItem(this.CSS_ACTIVE_KEY) || '默认方案';
        },

        setActiveSchemeName: function(name) {
            localStorage.setItem(this.CSS_ACTIVE_KEY, name);
        },

        applyCssScheme: function(css) {
            const el = document.getElementById('coupleSpaceCustomCss');
            if (el) el.textContent = css || '';
        },

        initCssScheme: function() {
            const schemes = this.loadCssSchemes();
            const active = this.getActiveSchemeName();
            if (schemes[active]) {
                this.applyCssScheme(schemes[active]);
            }
        },

        renderCssSchemeSelect: function() {
            const sel = document.getElementById('csCssSchemeSelect');
            if (!sel) return;
            const schemes = this.loadCssSchemes();
            const active = this.getActiveSchemeName();
            sel.innerHTML = '';
            Object.keys(schemes).forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                if (name === active) opt.selected = true;
                sel.appendChild(opt);
            });
            // 切换方案时自动应用
            sel.onchange = () => {
                const chosen = sel.value;
                this.setActiveSchemeName(chosen);
                const s = this.loadCssSchemes();
                this.applyCssScheme(s[chosen] || '');
            };
        },

        openCssEditor: function() {
            const schemes = this.loadCssSchemes();
            const active = this.getActiveSchemeName();
            const textarea = document.getElementById('coupleCssEditorTextarea');
            if (textarea) textarea.value = schemes[active] || this.getDefaultCssScheme();
            document.getElementById('coupleCssEditorModal').style.display = 'flex';
        },

        applyCssFromEditor: function() {
            const textarea = document.getElementById('coupleCssEditorTextarea');
            if (textarea) this.applyCssScheme(textarea.value);
        },

        saveCssFromEditor: function() {
            const textarea = document.getElementById('coupleCssEditorTextarea');
            if (!textarea) return;
            const schemes = this.loadCssSchemes();
            const active = this.getActiveSchemeName();
            schemes[active] = textarea.value;
            this.saveCssSchemes(schemes);
            this.applyCssScheme(textarea.value);
            alert('CSS 方案已保存');
        },

        createCssScheme: function() {
            const name = prompt('请输入新方案名称：');
            if (!name || !name.trim()) return;
            const schemes = this.loadCssSchemes();
            if (schemes[name.trim()]) {
                alert('该方案名已存在');
                return;
            }
            // 复制当前方案作为新方案的基础
            const active = this.getActiveSchemeName();
            schemes[name.trim()] = schemes[active] || this.getDefaultCssScheme();
            this.saveCssSchemes(schemes);
            this.setActiveSchemeName(name.trim());
            this.applyCssScheme(schemes[name.trim()]);
            this.renderCssSchemeSelect();
            alert('新方案 "' + name.trim() + '" 已创建');
        },

        deleteCssScheme: function() {
            const active = this.getActiveSchemeName();
            if (active === '默认方案') {
                alert('默认方案不能删除');
                return;
            }
            if (!confirm('确定删除方案 "' + active + '" 吗？')) return;
            const schemes = this.loadCssSchemes();
            delete schemes[active];
            this.saveCssSchemes(schemes);
            this.setActiveSchemeName('默认方案');
            this.applyCssScheme(schemes['默认方案'] || this.getDefaultCssScheme());
            this.renderCssSchemeSelect();
            alert('方案已删除，已切换回默认方案');
        },

        resetCssToDefault: function() {
            if (!confirm('确定恢复默认CSS样式吗？当前方案的修改将丢失。')) return;
            const schemes = this.loadCssSchemes();
            const active = this.getActiveSchemeName();
            schemes[active] = this.getDefaultCssScheme();
            this.saveCssSchemes(schemes);
            this.applyCssScheme(schemes[active]);
            alert('已恢复默认样式');
        },

        exportCss: function() {
            const schemes = this.loadCssSchemes();
            const active = this.getActiveSchemeName();
            const css = schemes[active] || '';
            const blob = new Blob([css], { type: 'text/css' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (active || 'couple-space') + '.css';
            a.click();
            URL.revokeObjectURL(url);
        },

        importCss: function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.css,text/css';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const css = ev.target.result;
                    const textarea = document.getElementById('coupleCssEditorTextarea');
                    if (textarea) textarea.value = css;
                    this.applyCssScheme(css);
                    // 自动保存到当前方案
                    const schemes = this.loadCssSchemes();
                    const active = this.getActiveSchemeName();
                    schemes[active] = css;
                    this.saveCssSchemes(schemes);
                    alert('CSS 已导入并应用');
                };
                reader.readAsText(file);
            };
            input.click();
        },

        clearCurrentContactData: function() {
            if (!this.currentContactId) return;
            if (!confirm('确定要清空该角色的所有情侣空间数据吗？（包括所有日记、记录和记忆库）\n此操作不可恢复！')) return;
            
            // Clear Space Store
            const store = getStorage(KEYS.COUPLE_SPACE);
            if (store[this.currentContactId]) {
                // Keep settings, clear days
                store[this.currentContactId].days = {};
                setStorage(KEYS.COUPLE_SPACE, store);
            }
            
            // Clear Memory Bank
            const memStore = getStorage(KEYS.COUPLE_MEMORY);
            if (memStore[this.currentContactId]) {
                // Keep settings? Or clear all? Let's clear memories but keep settings
                memStore[this.currentContactId].daily = [];
                memStore[this.currentContactId].weekly = [];
                memStore[this.currentContactId].monthly = [];
                memStore[this.currentContactId].yearly = [];
                setStorage(KEYS.COUPLE_MEMORY, memStore);
            }
            
            alert('数据已清空');
            this.renderDashboard();
            document.getElementById('coupleSettingsModal').style.display = 'none';
        }
    };

    // Expose Global
    global.CoupleSpace = CoupleSpace;
    global.CoupleSpaceUI = CoupleSpaceUI;

    // Auto-init if DOM is ready (or call it from health.js)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CoupleSpaceUI.init());
    } else {
        CoupleSpaceUI.init();
    }

})(window);
