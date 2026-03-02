// ========== 魔法生物宠物养成系统 - 核心数据管理与存储层 ==========

// ===== 全局状态 =====
let currentCharId = '';
let currentCreature = null;

// ===== localStorage 辅助函数 =====
function getStorageJSON(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; }
}

function setStorageJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

// ===== pet_{charId}_ 前缀存储封装 =====
function petKey(charId, suffix) {
    return 'pet_' + charId + '_' + suffix;
}

function getPetData(charId, suffix, def) {
    return getStorageJSON(petKey(charId, suffix), def);
}

function setPetData(charId, suffix, val) {
    setStorageJSON(petKey(charId, suffix), val);
}

// ===== Creature 核心数据管理 =====

/**
 * 加载指定 CHAR 的 Creature 数据
 * @param {string} charId
 * @returns {object|null} CreatureData 或 null
 */
function loadCreature(charId) {
    return getPetData(charId, 'creature', null);
}

/**
 * 保存 Creature 数据到 localStorage
 * @param {string} charId
 * @param {object} data - CreatureData
 */
function saveCreature(charId, data) {
    setPetData(charId, 'creature', data);
}

/**
 * 创建新 Creature（蛋阶段），绑定到指定 CHAR
 * @param {string} charId
 * @returns {object} 新创建的 CreatureData
 */
function createCreature(charId) {
    var now = Date.now();
    var creature = {
        id: 'creature_' + now + '_' + Math.random().toString(36).substr(2, 6),
        charId: charId,
        name: '',
        createdAt: now,
        growthStage: 'egg',
        alive: true,
        satiety: 100,
        mood: 70,
        hp: 100,
        attributes: {
            intelligence: 10,
            stamina: 10,
            charisma: 10,
            creativity: 10
        },
        equippedAccessories: {
            head: null,
            body: null,
            hand: null,
            back: null,
            effect: null
        },
        lastSatietyUpdate: now,
        lastMoodUpdate: now,
        lastHpUpdate: now,
        lastEventCheck: now,
        satietyZeroSince: null
    };
    saveCreature(charId, creature);
    // 记录最后活跃时间
    setPetData(charId, 'last_active', now);
    currentCreature = creature;
    return creature;
}

// ===== Creature 状态查询函数 =====

/**
 * 检查 Creature 是否存活
 * @param {object} creatureData
 * @returns {boolean}
 */
function isCreatureAlive(creatureData) {
    if (!creatureData) return false;
    return creatureData.alive === true;
}

/**
 * 获取 Creature 当前年龄（天数）
 * @param {object} creatureData
 * @returns {number} 年龄天数
 */
function getCreatureAge(creatureData) {
    if (!creatureData || !creatureData.createdAt) return 0;
    var elapsed = Date.now() - creatureData.createdAt;
    return Math.floor(elapsed / (24 * 60 * 60 * 1000));
}

// ========== 初始化与 CHAR 切换逻辑 ==========

// ===== 阶段名称映射 =====
var STAGE_LABELS = {
    egg: '蛋',
    baby: '婴儿',
    child: '幼年',
    teen: '少年',
    adult: '成年'
};

// ===== 心情表情映射 =====
function getMoodEmoji(mood) {
    if (mood >= 80) return '😊';
    if (mood >= 40) return '😐';
    if (mood >= 20) return '😢';
    return '😡';
}

// ===== 加载 CHAR 列表到选择器 =====
function loadCharList() {
    var contacts = getStorageJSON('vibe_contacts', []);
    var select = document.getElementById('charSelect');
    select.innerHTML = '<option value="">选择CHAR</option>';
    contacts.forEach(function(c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nickname || c.name;
        select.appendChild(opt);
    });
}

// ===== 加载积分余额显示 =====
function loadPoints() {
    var data = getStorageJSON('alipay_points', {});
    var charPoints = currentCharId ? (data[currentCharId] || 0) : 0;
    document.getElementById('walletAmount').textContent = charPoints;
}

// ===== 视图切换 =====
function switchView(viewId) {
    var views = document.querySelectorAll('.pet-view');
    for (var i = 0; i < views.length; i++) {
        views[i].style.display = 'none';
    }
    var target = document.getElementById('view-' + viewId);
    if (target) {
        target.style.display = '';
    }
}

// ===== 渲染主页（增强版 - Task 2.3） =====
function renderHome() {
    if (!currentCreature) return;
    var c = currentCreature;

    // 先检查阶段进化
    var stageConfig = getStageConfig(c.charId);
    var evolveResult = checkAndEvolve(c, stageConfig);
    if (evolveResult.evolved) {
        // 阶段进化时所有属性 +5 成长奖励（需求 17.7）
        applyGrowthBonus(c);
        saveCreature(c.charId, c);
        showEvolutionAnimation(evolveResult.oldStage, evolveResult.newStage);
        // 如果从蛋进化到婴儿，弹出命名对话框
        if (evolveResult.oldStage === 'egg' && evolveResult.newStage === 'baby') {
            showNamingModal();
        }
    }

    // 渲染形象
    renderCreatureImage(c);

    // 名称
    document.getElementById('creatureName').textContent = c.name || (STAGE_LABELS[c.growthStage] || '魔法生物');

    // 年龄
    var age = getCreatureAge(c);
    document.getElementById('creatureAge').textContent = age + '天';

    // 阶段标签
    document.getElementById('creatureStageLabel').textContent = STAGE_LABELS[c.growthStage] || c.growthStage;

    // 饱食度
    var satiety = Math.max(0, Math.min(100, Math.round(c.satiety)));
    document.getElementById('satietyBar').style.width = satiety + '%';
    document.getElementById('satietyValue').textContent = satiety;

    // 心情
    var moodEmoji = getMoodEmoji(c.mood);
    document.getElementById('moodEmoji').textContent = moodEmoji + ' 心情';
    var mood = Math.max(0, Math.min(100, Math.round(c.mood)));
    document.getElementById('moodBar').style.width = mood + '%';
    document.getElementById('moodValue').textContent = mood;

    // 生命值
    var hp = Math.max(0, Math.min(100, Math.round(c.hp)));
    document.getElementById('hpBar').style.width = hp + '%';
    document.getElementById('hpValue').textContent = hp;

    // HP 危险警告和虚弱状态（调用 updateHPWarning）
    updateHPWarning(c);

    // 检查饱食度持续为 0 的额外 HP 扣减
    if (c.alive && c.satiety <= 0 && c.satietyZeroSince) {
        var starvDmg = calculateStarvationDamage(c);
        if (starvDmg > 0) {
            // 计算上次已扣减的量，只扣增量
            var lastStarvDmg = c._lastStarvDmg || 0;
            var newDmg = starvDmg - lastStarvDmg;
            if (newDmg > 0) {
                updateHP(c, -newDmg);
                c._lastStarvDmg = starvDmg;
                saveCreature(c.charId, c);
                // 重新渲染 HP 条
                var hpAfter = Math.max(0, Math.min(100, Math.round(c.hp)));
                document.getElementById('hpBar').style.width = hpAfter + '%';
                document.getElementById('hpValue').textContent = hpAfter;
                updateHPWarning(c);
            }
        }
    } else {
        c._lastStarvDmg = 0;
    }

    // 检查死亡
    if (checkDeath(c)) {
        triggerDeath(c.charId, c);
        return;
    }

    // 进化进度条
    var timeInfo = getTimeToNextStage(c, stageConfig);
    var evolutionBar = document.getElementById('evolutionBar');
    var evolutionValue = document.getElementById('evolutionValue');
    if (c.growthStage === 'adult') {
        evolutionBar.style.width = '100%';
        evolutionValue.textContent = '已成年';
    } else {
        var progressPct = Math.round(timeInfo.progress * 100);
        evolutionBar.style.width = progressPct + '%';
        // 显示剩余时间
        var remainHours = Math.ceil(timeInfo.remainingMs / (60 * 60 * 1000));
        if (remainHours >= 24) {
            var remainDays = Math.floor(remainHours / 24);
            var remainH = remainHours % 24;
            evolutionValue.textContent = remainDays + '天' + (remainH > 0 ? remainH + '时' : '');
        } else {
            evolutionValue.textContent = remainHours + '小时';
        }
    }

    // 渲染属性面板
    renderAttributes(c.attributes);

    // 饥饿状态
    var stageEl = document.getElementById('creatureStage');
    if (stageEl) {
        if (c.satiety <= 0 && c.alive) {
            stageEl.classList.add('hungry-state');
        } else {
            stageEl.classList.remove('hungry-state');
        }
        // 死亡状态
        if (!c.alive) {
            stageEl.classList.add('dead-state');
        } else {
            stageEl.classList.remove('dead-state');
        }
    }
}

/**
 * 渲染属性面板（数值列表形式）
 * @param {object} attributes - { intelligence, stamina, charisma, creativity }
 */
function renderAttributes(attributes) {
    if (!attributes) return;
    var attrKeys = ['intelligence', 'stamina', 'charisma', 'creativity'];
    var attrIds = ['attrIntelligence', 'attrStamina', 'attrCharisma', 'attrCreativity'];
    for (var i = 0; i < attrKeys.length; i++) {
        var el = document.getElementById(attrIds[i]);
        if (!el) continue;
        var val = Math.max(0, Math.min(100, attributes[attrKeys[i]] || 0));
        var level = getAttrLevel(val);
        el.innerHTML = val + ' <span class="attr-level" style="color:' + level.color + '">' + level.label + '</span>';
    }
}

// ===== CHAR 切换回调 =====
function onCharChange() {
    var select = document.getElementById('charSelect');
    var charId = select.value;
    currentCharId = charId;

    var noCharEl = document.getElementById('noCharPlaceholder');
    var contentEl = document.getElementById('petContent');
    var hatchEl = document.getElementById('hatchEntry');
    var homeEl = document.getElementById('view-home');

    if (!charId) {
        // 未选择 CHAR：显示占位，隐藏内容
        noCharEl.style.display = '';
        contentEl.style.display = 'none';
        currentCreature = null;
        return;
    }

    // 已选择 CHAR：隐藏占位，显示内容
    noCharEl.style.display = 'none';
    contentEl.style.display = '';

    // 加载 Creature 数据
    var creature = loadCreature(charId);

    if (creature && isCreatureAlive(creature)) {
        // 有活着的 Creature：隐藏孵化入口，显示主页
        currentCreature = creature;
        hatchEl.style.display = 'none';
        homeEl.style.display = '';
        switchView('home');

        // 离线补算：计算离线时长并补算属性衰减（需求 15.1, 15.4, 15.5, 15.6）
        var lastActive = getLastActive(charId);
        if (lastActive) {
            processOfflineTime(creature, lastActive).then(function(offlineResult) {
                // 补算完成后重新渲染（可能触发了死亡）
                currentCreature = creature;
                renderHome();

                // 离线事件补算：离线超过 4 小时时生成离线事件（需求 15.2, 15.3）
                if (offlineResult.offlineHours >= 4 && creature.alive) {
                    processOfflineEvents(creature, offlineResult.offlineHours).then(function(offlineEvents) {
                        if (offlineEvents && offlineEvents.length > 0) {
                            showOfflineSummary(offlineEvents);
                        }
                    });
                }
            });
        } else {
            renderHome();
        }
        // 记录当前时间为最后活跃时间
        recordLastActive(charId);
    } else if (creature && !isCreatureAlive(creature)) {
        // Creature 已死亡：显示主页（死亡状态）
        currentCreature = creature;
        hatchEl.style.display = 'none';
        homeEl.style.display = '';
        switchView('home');
        renderHome();
    } else {
        // 无 Creature：显示孵化入口，隐藏主页
        currentCreature = null;
        hatchEl.style.display = '';
        homeEl.style.display = 'none';
        // 隐藏所有视图
        var views = document.querySelectorAll('.pet-view');
        for (var i = 0; i < views.length; i++) {
            views[i].style.display = 'none';
        }
    }

    // 加载积分显示
    loadPoints();
}

// ===== 覆盖 createCreature 以更新 UI =====
var _originalCreateCreature = createCreature;
createCreature = function(charId) {
    var creature = _originalCreateCreature(charId);
    currentCharId = charId;
    currentCreature = creature;

    // 更新 UI：隐藏孵化入口，显示主页
    var hatchEl = document.getElementById('hatchEntry');
    var homeEl = document.getElementById('view-home');
    if (hatchEl) hatchEl.style.display = 'none';
    if (homeEl) homeEl.style.display = '';
    switchView('home');
    renderHome();

    return creature;
};

// ===== 页面加载入口 =====
function initPet() {
    loadCharList();
    var select = document.getElementById('charSelect');
    if (select) {
        select.onchange = onCharChange;
    }
}

// DOMContentLoaded 触发初始化
document.addEventListener('DOMContentLoaded', initPet);

// ========== 成长阶段引擎 ==========

// ===== 成长阶段顺序 =====
var GROWTH_STAGES = ['egg', 'baby', 'child', 'teen', 'adult'];

// ===== 默认阶段天数配置 =====
var DEFAULT_STAGE_CONFIG = {
    egg: 1,
    baby: 2,
    child: 4,
    teen: 7,
    adult: Infinity
};

/**
 * 获取阶段天数配置
 * @param {string} charId
 * @returns {object} StageConfig
 */
function getStageConfig(charId) {
    var config = getPetData(charId, 'stage_config', null);
    if (!config) return Object.assign({}, DEFAULT_STAGE_CONFIG);
    // Ensure adult is always Infinity (JSON serializes Infinity as null)
    var merged = Object.assign({}, DEFAULT_STAGE_CONFIG, config);
    merged.adult = Infinity;
    return merged;
}

/**
 * 保存阶段天数配置
 * @param {string} charId
 * @param {object} config - StageConfig
 */
function saveStageConfig(charId, config) {
    // Store a copy; adult will become null in JSON but getStageConfig handles it
    setPetData(charId, 'stage_config', config);
}

/**
 * 根据创建时间戳和配置计算当前成长阶段
 * 阶段按天数累加：egg占 [0, egg), baby占 [egg, egg+baby), child占 [egg+baby, egg+baby+child), ...
 * @param {object} creatureData
 * @param {object} stageConfig
 * @returns {string} 当前阶段名称
 */
function calculateGrowthStage(creatureData, stageConfig) {
    if (!creatureData || !creatureData.createdAt) return 'egg';
    var ageMs = Date.now() - creatureData.createdAt;
    var ageDays = ageMs / (24 * 60 * 60 * 1000); // fractional days

    var cumulative = 0;
    for (var i = 0; i < GROWTH_STAGES.length; i++) {
        var stage = GROWTH_STAGES[i];
        var duration = stageConfig[stage];
        // adult (or Infinity) means no upper bound
        if (duration === Infinity || duration === null || duration === undefined) {
            return stage;
        }
        cumulative += duration;
        if (ageDays < cumulative) {
            return stage;
        }
    }
    // Fallback: if somehow past all stages, return adult
    return 'adult';
}

/**
 * 检查并执行阶段进化
 * 比较当前 creature 的 growthStage 与根据年龄计算出的期望阶段，
 * 如果不同则更新 creature 数据并保存。
 * @param {object} creatureData
 * @param {object} stageConfig
 * @returns {object} { evolved: boolean, oldStage: string, newStage: string }
 */
function checkAndEvolve(creatureData, stageConfig) {
    var oldStage = creatureData.growthStage || 'egg';
    var newStage = calculateGrowthStage(creatureData, stageConfig);

    if (newStage !== oldStage) {
        creatureData.growthStage = newStage;
        saveCreature(creatureData.charId, creatureData);
        return { evolved: true, oldStage: oldStage, newStage: newStage };
    }
    return { evolved: false, oldStage: oldStage, newStage: newStage };
}

/**
 * 计算到下一阶段的剩余时间
 * @param {object} creatureData
 * @param {object} stageConfig
 * @returns {object} { remainingMs: number, totalMs: number, progress: number }
 *   - remainingMs: 距离下一阶段的剩余毫秒数（adult阶段返回0）
 *   - totalMs: 当前阶段的总毫秒数（adult阶段返回0）
 *   - progress: 当前阶段进度 0-1（adult阶段返回1）
 */
function getTimeToNextStage(creatureData, stageConfig) {
    if (!creatureData || !creatureData.createdAt) {
        return { remainingMs: 0, totalMs: 0, progress: 0 };
    }

    var now = Date.now();
    var ageMs = now - creatureData.createdAt;
    var msPerDay = 24 * 60 * 60 * 1000;

    // Calculate the start time (in ms from creation) of each stage
    var cumulative = 0;
    var currentStage = creatureData.growthStage || calculateGrowthStage(creatureData, stageConfig);

    for (var i = 0; i < GROWTH_STAGES.length; i++) {
        var stage = GROWTH_STAGES[i];
        var duration = stageConfig[stage];

        if (stage === currentStage) {
            // adult or infinite duration: already at final stage
            if (duration === Infinity || duration === null || duration === undefined) {
                return { remainingMs: 0, totalMs: 0, progress: 1 };
            }

            var stageStartMs = cumulative * msPerDay;
            var stageTotalMs = duration * msPerDay;
            var elapsedInStage = ageMs - stageStartMs;
            var remaining = stageTotalMs - elapsedInStage;

            if (remaining < 0) remaining = 0;
            var progress = stageTotalMs > 0 ? Math.min(elapsedInStage / stageTotalMs, 1) : 1;

            return {
                remainingMs: remaining,
                totalMs: stageTotalMs,
                progress: progress
            };
        }

        if (duration !== Infinity && duration !== null && duration !== undefined) {
            cumulative += duration;
        }
    }

    // Fallback
    return { remainingMs: 0, totalMs: 0, progress: 1 };
}

// ========== 默认像素风形象与形象渲染 (Task 2.2) ==========

// ===== 默认像素风 SVG 形象 =====
var DEFAULT_IMAGES = {
    // 蛋：椭圆形蛋，带裂纹装饰
    egg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='80' viewBox='0 0 64 80'%3E%3Cellipse cx='32' cy='44' rx='24' ry='32' fill='%23f5e6c8' stroke='%23c9a96e' stroke-width='2'/%3E%3Cellipse cx='32' cy='44' rx='20' ry='28' fill='%23faf0dc'/%3E%3Cpath d='M22 36 L28 42 L24 48' stroke='%23c9a96e' stroke-width='1.5' fill='none'/%3E%3Cpath d='M38 30 L42 38 L36 40' stroke='%23c9a96e' stroke-width='1.5' fill='none'/%3E%3Cellipse cx='26' cy='34' rx='3' ry='2' fill='%23fce4b8' opacity='0.6'/%3E%3Cellipse cx='40' cy='50' rx='4' ry='2' fill='%23fce4b8' opacity='0.5'/%3E%3C/svg%3E",

    // 婴儿：小型圆润可爱生物
    baby: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='34' r='22' fill='%23a78bfa'/%3E%3Ccircle cx='32' cy='34' r='18' fill='%23c4b5fd'/%3E%3Ccircle cx='24' cy='30' r='4' fill='white'/%3E%3Ccircle cx='40' cy='30' r='4' fill='white'/%3E%3Ccircle cx='25' cy='31' r='2' fill='%231a1a2e'/%3E%3Ccircle cx='41' cy='31' r='2' fill='%231a1a2e'/%3E%3Cellipse cx='32' cy='40' rx='3' ry='2' fill='%23e94560'/%3E%3Ccircle cx='20' cy='36' r='3' fill='%23f9a8d4' opacity='0.5'/%3E%3Ccircle cx='44' cy='36' r='3' fill='%23f9a8d4' opacity='0.5'/%3E%3Cellipse cx='24' cy='56' rx='6' ry='4' fill='%23a78bfa'/%3E%3Cellipse cx='40' cy='56' rx='6' ry='4' fill='%23a78bfa'/%3E%3C/svg%3E",

    // 幼年：中型活泼生物，有小耳朵
    child: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cellipse cx='22' cy='16' rx='8' ry='12' fill='%237c3aed' transform='rotate(-15 22 16)'/%3E%3Cellipse cx='58' cy='16' rx='8' ry='12' fill='%237c3aed' transform='rotate(15 58 16)'/%3E%3Cellipse cx='40' cy='42' rx='26' ry='28' fill='%238b5cf6'/%3E%3Cellipse cx='40' cy='42' rx='22' ry='24' fill='%23a78bfa'/%3E%3Ccircle cx='30' cy='36' r='5' fill='white'/%3E%3Ccircle cx='50' cy='36' r='5' fill='white'/%3E%3Ccircle cx='31' cy='37' r='2.5' fill='%231a1a2e'/%3E%3Ccircle cx='51' cy='37' r='2.5' fill='%231a1a2e'/%3E%3Ccircle cx='32' cy='36' r='1' fill='white'/%3E%3Ccircle cx='52' cy='36' r='1' fill='white'/%3E%3Cpath d='M36 46 Q40 50 44 46' stroke='%23e94560' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='22' cy='42' r='4' fill='%23f9a8d4' opacity='0.4'/%3E%3Ccircle cx='58' cy='42' r='4' fill='%23f9a8d4' opacity='0.4'/%3E%3Cellipse cx='28' cy='68' rx='8' ry='5' fill='%238b5cf6'/%3E%3Cellipse cx='52' cy='68' rx='8' ry='5' fill='%238b5cf6'/%3E%3C/svg%3E",

    // 少年：较大的少年形态，有翅膀轮廓
    teen: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cpath d='M12 40 Q4 28 16 20 Q24 16 28 28' fill='%236d28d9' opacity='0.7'/%3E%3Cpath d='M84 40 Q92 28 80 20 Q72 16 68 28' fill='%236d28d9' opacity='0.7'/%3E%3Cellipse cx='28' cy='14' rx='9' ry='14' fill='%237c3aed' transform='rotate(-10 28 14)'/%3E%3Cellipse cx='68' cy='14' rx='9' ry='14' fill='%237c3aed' transform='rotate(10 68 14)'/%3E%3Cellipse cx='48' cy='48' rx='28' ry='32' fill='%237c3aed'/%3E%3Cellipse cx='48' cy='48' rx='24' ry='28' fill='%238b5cf6'/%3E%3Ccircle cx='38' cy='42' r='5' fill='white'/%3E%3Ccircle cx='58' cy='42' r='5' fill='white'/%3E%3Ccircle cx='39' cy='43' r='2.5' fill='%231a1a2e'/%3E%3Ccircle cx='59' cy='43' r='2.5' fill='%231a1a2e'/%3E%3Ccircle cx='40' cy='42' r='1' fill='white'/%3E%3Ccircle cx='60' cy='42' r='1' fill='white'/%3E%3Cpath d='M43 54 Q48 58 53 54' stroke='%23e94560' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='30' cy='48' r='4' fill='%23f9a8d4' opacity='0.35'/%3E%3Ccircle cx='66' cy='48' r='4' fill='%23f9a8d4' opacity='0.35'/%3E%3Cellipse cx='34' cy='78' rx='10' ry='6' fill='%237c3aed'/%3E%3Cellipse cx='62' cy='78' rx='10' ry='6' fill='%237c3aed'/%3E%3C/svg%3E",

    // 成年：完整成年形态，有翅膀和光环
    adult: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 112 112'%3E%3Cellipse cx='56' cy='10' rx='20' ry='4' fill='none' stroke='%23fbbf24' stroke-width='2' opacity='0.6'/%3E%3Cpath d='M10 48 Q0 30 14 18 Q26 10 32 30' fill='%235b21b6' opacity='0.8'/%3E%3Cpath d='M102 48 Q112 30 98 18 Q86 10 80 30' fill='%235b21b6' opacity='0.8'/%3E%3Cpath d='M14 52 Q6 40 18 32 Q26 28 30 38' fill='%236d28d9' opacity='0.5'/%3E%3Cpath d='M98 52 Q106 40 94 32 Q86 28 82 38' fill='%236d28d9' opacity='0.5'/%3E%3Cellipse cx='32' cy='16' rx='10' ry='16' fill='%236d28d9' transform='rotate(-8 32 16)'/%3E%3Cellipse cx='80' cy='16' rx='10' ry='16' fill='%236d28d9' transform='rotate(8 80 16)'/%3E%3Cellipse cx='56' cy='54' rx='32' ry='36' fill='%236d28d9'/%3E%3Cellipse cx='56' cy='54' rx='28' ry='32' fill='%237c3aed'/%3E%3Ccircle cx='44' cy='46' r='6' fill='white'/%3E%3Ccircle cx='68' cy='46' r='6' fill='white'/%3E%3Ccircle cx='45' cy='47' r='3' fill='%231a1a2e'/%3E%3Ccircle cx='69' cy='47' r='3' fill='%231a1a2e'/%3E%3Ccircle cx='46' cy='46' r='1.2' fill='white'/%3E%3Ccircle cx='70' cy='46' r='1.2' fill='white'/%3E%3Cpath d='M50 60 Q56 66 62 60' stroke='%23e94560' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='34' cy='54' r='5' fill='%23f9a8d4' opacity='0.3'/%3E%3Ccircle cx='78' cy='54' r='5' fill='%23f9a8d4' opacity='0.3'/%3E%3Cellipse cx='40' cy='88' rx='12' ry='7' fill='%236d28d9'/%3E%3Cellipse cx='72' cy='88' rx='12' ry='7' fill='%236d28d9'/%3E%3C/svg%3E"
};

/**
 * 获取当前阶段形象（自定义优先，否则默认）
 * @param {object} creatureData
 * @returns {string} 图片 URL（data URI 或 base64）
 */
function getCreatureImage(creatureData) {
    if (!creatureData) return DEFAULT_IMAGES.egg;
    var stage = creatureData.growthStage || 'egg';

    // 检查是否有自定义形象
    var customImages = getPetData(creatureData.charId, 'custom_images', {});
    if (customImages[stage]) {
        return customImages[stage];
    }

    return DEFAULT_IMAGES[stage] || DEFAULT_IMAGES.egg;
}

/**
 * 渲染形象（基础 + 饰品贴纸叠加）
 * @param {object} creatureData
 */
function renderCreatureImage(creatureData) {
    if (!creatureData) return;

    // 设置基础形象
    var imgEl = document.getElementById('creatureImg');
    if (imgEl) {
        imgEl.src = getCreatureImage(creatureData);
        imgEl.alt = creatureData.name || STAGE_LABELS[creatureData.growthStage] || '魔法生物';
    }

    // 渲染饰品贴纸叠加层
    var accessoryLayer = document.getElementById('accessoryLayer');
    if (!accessoryLayer) return;
    accessoryLayer.innerHTML = '';

    var slotImages = getPetData(creatureData.charId, 'slot_images', {});
    var slotPositions = getPetData(creatureData.charId, 'slot_positions', {});
    var slotOrder = ['back', 'body', 'head', 'hand', 'effect'];

    for (var i = 0; i < slotOrder.length; i++) {
        var slot = slotOrder[i];
        var url = slotImages[slot];
        if (!url) continue;

        var pos = slotPositions[slot] || { x: 50, y: 50, scale: 50, rotate: 0 };
        var accImg = document.createElement('img');
        accImg.src = url;
        accImg.className = 'accessory-sticker';
        accImg.style.left = pos.x + '%';
        accImg.style.top = pos.y + '%';
        accImg.style.transform = 'translate(-50%,-50%) scale(' + (pos.scale / 50) + ') rotate(' + (pos.rotate || 0) + 'deg)';
        accImg.style.zIndex = (i + 1) * 10;
        accImg.onerror = function() { this.style.display = 'none'; };

        accessoryLayer.appendChild(accImg);
    }
}

// ========== 阶段进化动画与命名流程 (Task 2.4) ==========

// ===== 阶段进化 emoji 映射 =====
var STAGE_EMOJIS = {
    egg: '🥚',
    baby: '👶',
    child: '🧒',
    teen: '🧑',
    adult: '🧙'
};

/**
 * 显示阶段进化动画提示
 * @param {string} oldStage - 旧阶段
 * @param {string} newStage - 新阶段
 */
function showEvolutionAnimation(oldStage, newStage) {
    var modal = document.getElementById('evolutionModal');
    var animEl = document.getElementById('evolutionAnim');
    var textEl = document.getElementById('evolutionText');
    if (!modal || !animEl || !textEl) return;

    var oldEmoji = STAGE_EMOJIS[oldStage] || '❓';
    var newEmoji = STAGE_EMOJIS[newStage] || '✨';
    var oldLabel = STAGE_LABELS[oldStage] || oldStage;
    var newLabel = STAGE_LABELS[newStage] || newStage;

    animEl.innerHTML = oldEmoji + ' → ' + newEmoji;
    textEl.innerHTML = '🎉 恭喜！你的魔法生物从<strong>' + oldLabel + '</strong>进化为<strong>' + newLabel + '</strong>了！';

    modal.style.display = '';

    // 重新触发动画
    animEl.style.animation = 'none';
    animEl.offsetHeight; // force reflow
    animEl.style.animation = '';
}

/**
 * 显示命名对话框
 */
function showNamingModal() {
    var modal = document.getElementById('namingModal');
    var input = document.getElementById('namingInput');
    if (!modal) return;
    if (input) {
        input.value = '';
        input.placeholder = '1-12个字符';
    }
    modal.style.display = '';
    if (input) input.focus();
}

/**
 * 确认命名（从 pet.html 的命名对话框调用）
 */
function confirmNaming() {
    var input = document.getElementById('namingInput');
    if (!input) return;

    var name = input.value.trim();
    if (!name || name.length < 1) {
        input.placeholder = '请输入名称（1-12个字符）';
        input.classList.add('input-error');
        setTimeout(function() { input.classList.remove('input-error'); }, 1000);
        return;
    }
    if (name.length > 12) {
        name = name.substring(0, 12);
    }

    // 保存名称
    if (currentCreature) {
        currentCreature.name = name;
        saveCreature(currentCharId, currentCreature);
    }

    // 关闭对话框
    var modal = document.getElementById('namingModal');
    if (modal) modal.style.display = 'none';

    // 刷新主页显示
    renderHome();
}

/**
 * 显示改名对话框（设置中使用）
 */
function showRenameDialog() {
    var modal = document.getElementById('namingModal');
    var input = document.getElementById('namingInput');
    if (!modal) return;
    if (input) {
        input.value = currentCreature ? (currentCreature.name || '') : '';
        input.placeholder = '输入新名称（1-12个字符）';
    }
    modal.style.display = '';
    if (input) input.focus();
}

// ========== LLM 统一调用层 ==========

/**
 * 获取当前 CHAR 的 API 配置
 * 复用项目中 vibe_contacts + vibe_api_schemes 的配置模式
 * @param {string} charId - CHAR ID（可选，默认使用 currentCharId）
 * @returns {{ apiUrl: string, apiKey: string, model: string }}
 */
function getPetApiConfig(charId) {
    var cid = charId || currentCharId;
    var contact = getStorageJSON('vibe_contacts', []).find(function(c) {
        return String(c.id) === String(cid);
    });
    var apiUrl, apiKey, model;
    if (contact && contact.apiScheme) {
        var schemes = getStorageJSON('vibe_api_schemes', []);
        var scheme = schemes.find(function(s) { return s.id === contact.apiScheme; });
        if (scheme) {
            apiUrl = scheme.apiUrl;
            apiKey = scheme.apiKey;
            model = scheme.model;
        }
    }
    if (!apiUrl) {
        apiUrl = localStorage.getItem('apiUrl');
        apiKey = localStorage.getItem('apiKey');
        model = (contact && contact.model) || localStorage.getItem('selectedModel');
    }
    return { apiUrl: apiUrl, apiKey: apiKey, model: model };
}

/**
 * 统一 LLM 调用函数
 * 复用 OpenAI 兼容 API 调用模式，包含完整错误处理和降级逻辑
 * @param {string} prompt - 用户提示词
 * @param {string} [systemPrompt] - 系统提示词（可选）
 * @param {number} [temperature] - 温度参数（可选，默认 0.7）
 * @returns {Promise<string>} LLM 回复文本
 */
async function callPetLLM(prompt, systemPrompt, temperature) {
    var config = getPetApiConfig();

    // 检查 API 配置是否完整
    if (!config.apiUrl || !config.apiKey || !config.model) {
        throw new Error('API 配置不完整，请在设置中配置 API 地址、密钥和模型');
    }

    // 构建消息数组
    var messages = [];
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    // 构建请求 URL，处理双斜杠问题
    var url = (config.apiUrl + '/chat/completions').replace(/([^:]\/)\/+/g, '$1');

    var resp;
    try {
        resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.apiKey
            },
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                temperature: temperature || 0.7
            })
        });
    } catch (e) {
        throw new Error('网络连接失败，请检查网络或API地址是否可用');
    }

    // HTTP 错误处理
    if (!resp.ok) {
        var detail = '';
        try { detail = await resp.text(); } catch (_) {}
        throw new Error('API请求失败(' + resp.status + '): ' + (detail || '未知错误'));
    }

    // 验证响应格式为 JSON
    var contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        var text = await resp.text();
        throw new Error('API返回了非JSON格式: ' + text.slice(0, 200));
    }

    // 解析响应数据
    var data = await resp.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API返回格式异常: ' + JSON.stringify(data).slice(0, 200));
    }

    return data.choices[0].message.content.trim();
}

// ===== 积分系统读写联动 =====
// 直接读写 alipay_points localStorage 键，与支付宝积分系统共享积分池

// 检查积分余额是否足够支付 cost
function checkPoints(charId, cost) {
    var data = getStorageJSON('alipay_points', {});
    var balance = data[charId] || 0;
    return balance >= cost;
}

// 扣除积分并更新钱包显示
function deductPoints(charId, amount) {
    var data = getStorageJSON('alipay_points', {});
    var balance = data[charId] || 0;
    data[charId] = Math.max(0, balance - amount);
    setStorageJSON('alipay_points', data);
    // 更新页面上的钱包余额显示
    var walletEl = document.getElementById('walletAmount');
    if (walletEl) {
        walletEl.textContent = data[charId];
    }
}

// ===== 喂养系统与饱食度机制 =====

// 默认食物列表（不需要从背包获取，直接用积分购买）
var DEFAULT_FOODS = [
    { id: 'food_bread', name: '魔法面包', satiety: 10, cost: 5, type: 'food' },
    { id: 'food_milk', name: '星光牛奶', satiety: 15, cost: 8, type: 'food' },
    { id: 'food_fruit', name: '彩虹水果', satiety: 20, cost: 10, type: 'food' },
    { id: 'food_cake', name: '月光蛋糕', satiety: 30, cost: 15, type: 'food' },
    { id: 'food_feast', name: '精灵大餐', satiety: 50, cost: 20, type: 'food' }
];

/**
 * 获取可用食物列表（默认食物 + 背包中的食物）
 * @param {string} charId
 * @returns {Array} 食物列表，每项含 { id, name, satiety, cost, type, source }
 */
function getAvailableFoods(charId) {
    var foods = [];
    // 添加默认食物（标记来源为 default）
    for (var i = 0; i < DEFAULT_FOODS.length; i++) {
        var f = DEFAULT_FOODS[i];
        foods.push({
            id: f.id,
            name: f.name,
            satiety: f.satiety,
            cost: f.cost,
            type: f.type,
            source: 'default'
        });
    }
    // 添加背包中的食物（标记来源为 inventory）
    var inventory = getPetData(charId, 'inventory', []);
    for (var j = 0; j < inventory.length; j++) {
        var item = inventory[j];
        if (item && item.type === 'food') {
            foods.push({
                id: item.id,
                name: item.name,
                satiety: item.satiety || 10,
                cost: 0, // 背包食物已购买，无需再扣积分
                type: item.type,
                source: 'inventory',
                inventoryIndex: j
            });
        }
    }
    return foods;
}

/**
 * 计算饱食度衰减量（基础每小时 -5，体力越高衰减越慢）
 * @param {number} lastUpdateTime - 上次更新饱食度的时间戳（毫秒）
 * @returns {number} 应衰减的饱食度值（正数）
 */
function calculateHungerDecay(lastUpdateTime) {
    if (!lastUpdateTime) return 0;
    var now = Date.now();
    var elapsed = now - lastUpdateTime;
    if (elapsed <= 0) return 0;
    var hours = elapsed / (60 * 60 * 1000);
    // 体力减缓饥饿：每10点体力减少5%衰减，最多减50%
    var staminaReduction = 1;
    if (currentCreature && currentCreature.attributes) {
        var stamina = currentCreature.attributes.stamina || 10;
        staminaReduction = Math.max(0.5, 1 - (stamina / 100) * 0.5);
    }
    return Math.floor(hours * 5 * staminaReduction);
}

/**
 * 更新饱食度（限制 0-100），同时追踪 satietyZeroSince
 * @param {object} creatureData
 * @param {number} delta - 变化量（正数增加，负数减少）
 */
function updateSatiety(creatureData, delta) {
    if (!creatureData) return;
    var oldSatiety = creatureData.satiety || 0;
    var newSatiety = oldSatiety + delta;
    // 限制在 0-100 范围
    newSatiety = Math.max(0, Math.min(100, newSatiety));
    creatureData.satiety = newSatiety;
    creatureData.lastSatietyUpdate = Date.now();

    // 追踪饱食度归零时间（用于死亡机制）
    if (newSatiety <= 0 && oldSatiety > 0) {
        // 刚降到0，记录时间
        creatureData.satietyZeroSince = Date.now();
    } else if (newSatiety > 0) {
        // 恢复了，清除记录
        creatureData.satietyZeroSince = null;
    }
}

/**
 * 执行喂食操作
 * 检查存活→检查积分/背包→扣除积分/移除背包物品→增加饱食度→心情+3→HP+2→保存→更新UI
 * @param {string} charId
 * @param {object} foodItem - 食物对象 { id, name, satiety, cost, source, inventoryIndex? }
 * @returns {object} { success: boolean, message: string }
 */
function feedCreature(charId, foodItem) {
    // 检查 Creature 是否存活
    var creature = currentCreature || loadCreature(charId);
    if (!creature || !isCreatureAlive(creature)) {
        return { success: false, message: '魔法生物已经不在了…' };
    }

    // 根据食物来源检查并扣除
    if (foodItem.source === 'default') {
        // 默认食物：需要扣积分
        if (!checkPoints(charId, foodItem.cost)) {
            return { success: false, message: '积分不足，无法购买' + foodItem.name + '（需要' + foodItem.cost + '积分）' };
        }
        deductPoints(charId, foodItem.cost);
    } else if (foodItem.source === 'inventory') {
        // 背包食物：从背包中移除
        var inventory = getPetData(charId, 'inventory', []);
        var idx = -1;
        // 优先使用 inventoryIndex，否则按 id 查找
        if (typeof foodItem.inventoryIndex === 'number' && foodItem.inventoryIndex >= 0 && foodItem.inventoryIndex < inventory.length) {
            idx = foodItem.inventoryIndex;
        } else {
            for (var i = 0; i < inventory.length; i++) {
                if (inventory[i] && inventory[i].id === foodItem.id) {
                    idx = i;
                    break;
                }
            }
        }
        if (idx < 0) {
            return { success: false, message: '背包中没有找到' + foodItem.name };
        }
        inventory.splice(idx, 1);
        setPetData(charId, 'inventory', inventory);
    }

    // 增加饱食度（创造力加成）
    var satietyGain = foodItem.satiety || 10;
    var feedBonus = getAttrFeedBonus(creature);
    satietyGain = Math.round(satietyGain * feedBonus.satietyMult);
    updateSatiety(creature, satietyGain);

    // 心情值 +3（魅力加成）
    var moodGain = Math.round(3 * feedBonus.moodMult);
    updateMood(creature, moodGain);

    // 生命值 +2（需求 19.10）
    creature.hp = Math.max(0, Math.min(100, (creature.hp || 0) + 2));

    // 记录喂食时间
    creature.lastFeedTime = Date.now();

    // 保存数据
    saveCreature(charId, creature);
    currentCreature = creature;

    // 记录喂食日志（需求 3.5）
    var feedLog = getPetData(charId, 'feed_log', []);
    feedLog.push({
        timestamp: Date.now(),
        foodId: foodItem.id,
        foodName: foodItem.name,
        satietyGain: satietyGain,
        cost: foodItem.cost || 0,
        source: foodItem.source
    });
    // 只保留最近 50 条喂食记录
    if (feedLog.length > 50) {
        feedLog = feedLog.slice(feedLog.length - 50);
    }
    setPetData(charId, 'feed_log', feedLog);

    // 更新 UI
    renderHome();

    return { success: true, message: '成功喂食' + foodItem.name + '！饱食度 +' + satietyGain };
}

// ===== 喂食 UI 面板 (Task 5.2) =====

/**
 * 显示喂食面板内容
 * 渲染积分余额、饥饿警告、食物列表到 feedPanel
 */
function showFeedPanel() {
    var panel = document.getElementById('feedPanel');
    if (!panel) return;

    var creature = currentCreature;
    if (!creature || !isCreatureAlive(creature)) {
        panel.innerHTML = '<div class="pet-empty"><div class="pet-empty-icon">🚫</div><p>当前没有可喂食的魔法生物</p></div>';
        return;
    }

    var html = '';

    // 积分余额显示
    var pointsData = getStorageJSON('alipay_points', {});
    var balance = currentCharId ? (pointsData[currentCharId] || 0) : 0;
    html += '<div class="feed-balance">';
    html += '<span class="feed-balance-icon">💰</span>';
    html += '<span class="feed-balance-label">当前积分：</span>';
    html += '<span class="feed-balance-value">' + balance + '</span>';
    html += '</div>';

    // 当前饱食度显示
    var satiety = Math.max(0, Math.min(100, Math.round(creature.satiety)));
    html += '<div class="feed-satiety-info">';
    html += '<span>🍖 当前饱食度：</span>';
    html += '<span class="feed-satiety-value' + (satiety <= 20 ? ' low' : '') + '">' + satiety + '/100</span>';
    html += '</div>';

    // 饥饿警告
    if (creature.satiety <= 0) {
        html += '<div class="feed-warning hunger-warning">';
        html += '<span class="feed-warning-icon">⚠️</span>';
        html += '<span>宝宝已经饿坏了！请立即喂食！</span>';
        html += '</div>';
    } else if (creature.satiety <= 20) {
        html += '<div class="feed-warning hunger-low">';
        html += '<span class="feed-warning-icon">⚠️</span>';
        html += '<span>宝宝快饿了，记得喂食哦~</span>';
        html += '</div>';
    }

    // 获取食物列表
    var foods = getAvailableFoods(currentCharId);

    if (foods.length === 0) {
        html += '<div class="pet-empty"><div class="pet-empty-icon">🍽️</div><p>暂无可用食物</p></div>';
    } else {
        html += '<div class="feed-section-title">🍽️ 可选食物</div>';
        html += '<div class="feed-list">';
        for (var i = 0; i < foods.length; i++) {
            var food = foods[i];
            var canAfford = food.source === 'inventory' || checkPoints(currentCharId, food.cost);
            html += '<div class="feed-item' + (canAfford ? '' : ' disabled') + '">';
            html += '<div class="feed-item-info">';
            html += '<div class="feed-item-name">' + food.name + '</div>';
            html += '<div class="feed-item-details">';
            html += '<span class="feed-item-satiety">🍖 +' + food.satiety + '</span>';
            if (food.source === 'inventory') {
                html += '<span class="feed-item-cost inventory">📦 背包</span>';
            } else {
                html += '<span class="feed-item-cost">💰 ' + food.cost + '</span>';
            }
            html += '</div>';
            html += '</div>';
            html += '<button class="feed-item-btn' + (canAfford ? '' : ' disabled') + '" onclick="doFeed(' + i + ')"' + (canAfford ? '' : ' disabled') + '>喂食</button>';
            html += '</div>';
        }
        html += '</div>';
    }

    // 喂食结果消息区
    html += '<div id="feedMessage" class="feed-message"></div>';

    panel.innerHTML = html;
}

/**
 * 执行喂食操作（由食物列表按钮调用）
 * @param {number} foodIndex - 食物在 getAvailableFoods 返回列表中的索引
 */
function doFeed(foodIndex) {
    var foods = getAvailableFoods(currentCharId);
    if (foodIndex < 0 || foodIndex >= foods.length) return;

    var food = foods[foodIndex];
    var result = feedCreature(currentCharId, food);

    // 显示结果消息
    var msgEl = document.getElementById('feedMessage');
    if (msgEl) {
        msgEl.textContent = result.message;
        msgEl.className = 'feed-message ' + (result.success ? 'success' : 'error');
        // 3秒后清除消息
        setTimeout(function() {
            if (msgEl) {
                msgEl.textContent = '';
                msgEl.className = 'feed-message';
            }
        }, 3000);
    }

    // 刷新喂食面板（更新积分余额和食物列表）
    if (result.success) {
        showFeedPanel();
    }
}

// ===== 心情值系统 (Task 6.1) =====

/**
 * 更新心情值（限制 0-100）
 * 更新 lastMoodUpdate 时间戳
 * @param {object} creatureData - Creature 数据对象
 * @param {number} delta - 心情值变化量（正数增加，负数减少）
 * 需求: 12.1, 12.8
 */
function updateMood(creatureData, delta) {
    if (!creatureData) return;
    var current = typeof creatureData.mood === 'number' ? creatureData.mood : 70;
    var newMood = current + delta;
    // 限制在 0-100 范围内
    if (newMood < 0) newMood = 0;
    if (newMood > 100) newMood = 100;
    creatureData.mood = newMood;
    creatureData.lastMoodUpdate = Date.now();
}

/**
 * 计算心情衰减值（基础每 2 小时 -3，魅力越高衰减越慢）
 * 返回一个正数，表示应该减少的心情值
 * @param {number} lastUpdateTime - 上次心情更新的时间戳（毫秒）
 * @returns {number} 应减少的心情值（正数）
 * 需求: 12.5
 */
function calculateMoodDecay(lastUpdateTime) {
    if (!lastUpdateTime) return 0;
    var now = Date.now();
    var elapsed = now - lastUpdateTime;
    if (elapsed <= 0) return 0;
    var twoHoursMs = 2 * 60 * 60 * 1000;
    var periods = Math.floor(elapsed / twoHoursMs);
    // 魅力减缓心情衰减：每10点魅力减少5%，最多减40%
    var charismaReduction = 1;
    if (currentCreature && currentCreature.attributes) {
        var charisma = currentCreature.attributes.charisma || 10;
        charismaReduction = Math.max(0.6, 1 - (charisma / 100) * 0.4);
    }
    return Math.floor(periods * 3 * charismaReduction);
}

/**
 * 获取心情状态标签、表情图标和颜色
 * 开心(80-100)、普通(40-79)、难过(20-39)、生气(0-19)
 * @param {number} moodValue - 心情值 0-100
 * @returns {{ label: string, emoji: string, color: string }}
 * 需求: 12.2
 */
function getMoodLabel(moodValue) {
    var mood = typeof moodValue === 'number' ? moodValue : 70;
    if (mood >= 80) {
        return { label: '开心', emoji: '😊', color: '#4ade80' };
    }
    if (mood >= 40) {
        return { label: '普通', emoji: '😐', color: '#facc15' };
    }
    if (mood >= 20) {
        return { label: '难过', emoji: '😢', color: '#60a5fa' };
    }
    return { label: '生气', emoji: '😡', color: '#f87171' };
}

// ===== 生命值与死亡机制 (Task 6.2) =====

/**
 * 更新生命值（限制 0-100，初始值 100）
 * 更新 lastHpUpdate 时间戳
 * @param {object} creatureData - Creature 数据对象
 * @param {number} delta - HP 变化量（正数增加，负数减少）
 * 需求: 19.1
 */
function updateHP(creatureData, delta) {
    if (!creatureData) return;
    var current = typeof creatureData.hp === 'number' ? creatureData.hp : 100;
    var newHP = current + delta;
    if (newHP < 0) newHP = 0;
    if (newHP > 100) newHP = 100;
    creatureData.hp = newHP;
    creatureData.lastHpUpdate = Date.now();
}

/**
 * 检查死亡条件（HP <= 0 且仍存活）
 * @param {object} creatureData - Creature 数据对象
 * @returns {boolean} 是否应触发死亡
 * 需求: 19.7
 */
function checkDeath(creatureData) {
    if (!creatureData) return false;
    if (!creatureData.alive) return false;
    return creatureData.hp <= 0;
}

/**
 * 执行死亡流程：调用 LLM 生成告别信、锁定养育操作、显示死亡动画
 * @param {string} charId - CHAR ID
 * @param {object} creatureData - Creature 数据对象
 * 需求: 19.7, 19.8
 */
async function triggerDeath(charId, creatureData) {
    if (!creatureData) return;

    // 标记死亡
    creatureData.alive = false;
    creatureData.hp = 0;
    var deathTime = Date.now();

    // 生成告别信（通过 LLM）
    var farewellLetter = '';
    var creatureName = creatureData.name || '魔法生物';
    var age = getCreatureAge(creatureData);
    var stageLabel = STAGE_LABELS[creatureData.growthStage] || creatureData.growthStage;

    try {
        var prompt = '你是一只名叫「' + creatureName + '」的魔法生物，你已经' + age + '天大了，处于' + stageLabel + '阶段。' +
            '你即将离开这个世界，请以你的口吻写一封简短的告别信给养育你的主人，' +
            '表达感谢和不舍。字数控制在100字以内，语气温暖感人。';
        var systemPrompt = '你是一只可爱的魔法生物，正在写最后的告别信。请用中文回复，语气温暖、感人但不过于悲伤。';
        farewellLetter = await callPetLLM(prompt, systemPrompt, 0.8);
    } catch (e) {
        farewellLetter = '亲爱的主人，谢谢你一直以来的陪伴和照顾。虽然我要离开了，但和你在一起的每一天都是我最珍贵的回忆。再见了，我会永远记得你的温暖。——' + creatureName;
    }

    // 保存死亡信息
    creatureData.deathInfo = {
        deathTime: deathTime,
        farewellLetter: farewellLetter
    };
    saveCreature(charId, creatureData);

    // 显示死亡动画和告别信
    showDeathAnimation();
    var deathTextEl = document.getElementById('deathText');
    if (deathTextEl) {
        deathTextEl.textContent = '💔 ' + creatureName + ' 已经离开了这个世界...';
    }
    var farewellEl = document.getElementById('deathFarewell');
    if (farewellEl) {
        farewellEl.textContent = farewellLetter;
    }

    // 更新主页渲染（锁定操作按钮、显示死亡状态）
    renderHome();
}

/**
 * 显示死亡动画弹窗
 * 需求: 19.7
 */
function showDeathAnimation() {
    var modal = document.getElementById('deathModal');
    if (!modal) return;
    var animEl = document.getElementById('deathAnim');
    if (animEl) {
        animEl.textContent = '💀';
        animEl.style.animation = 'none';
        // 触发 reflow 以重新播放动画
        void animEl.offsetWidth;
        animEl.style.animation = 'death-fade 2s ease-in-out';
    }
    modal.style.display = 'flex';
}

/**
 * 重新孵化功能：归档死亡 Creature 数据，创建新 Creature
 * @param {string} charId - CHAR ID
 * 需求: 19.9
 */
function rehatch(charId) {
    if (!charId) return;

    // 归档当前死亡 Creature 的历史数据
    var deadCreature = loadCreature(charId);
    if (deadCreature) {
        var archives = getPetData(charId, 'archives', []);
        archives.push({
            creature: deadCreature,
            archivedAt: Date.now(),
            eventLog: getPetData(charId, 'event_log', []),
            diary: getPetData(charId, 'diary', []),
            chatHistory: getPetData(charId, 'chat_history', [])
        });
        setPetData(charId, 'archives', archives);
    }

    // 关闭死亡弹窗
    var modal = document.getElementById('deathModal');
    if (modal) modal.style.display = 'none';

    // 隐藏危险警告
    var dangerOverlay = document.getElementById('hpDangerOverlay');
    if (dangerOverlay) dangerOverlay.style.display = 'none';

    // 创建新 Creature（createCreature 已处理 UI 更新）
    createCreature(charId);
    renderHome();
    switchView('home');
}

/**
 * 计算饱食度持续为 0 导致的额外 HP 扣减
 * 饱食度为 0 超过 2 小时后，每小时额外扣减 HP 3 点
 * @param {object} creatureData - Creature 数据对象
 * @returns {number} 应扣减的 HP 值（正数）
 * 需求: 19.4
 */
function calculateStarvationDamage(creatureData) {
    if (!creatureData) return 0;
    if (!creatureData.satietyZeroSince) return 0;
    if (creatureData.satiety > 0) return 0;

    var now = Date.now();
    var zeroSince = creatureData.satietyZeroSince;
    var elapsed = now - zeroSince;
    if (elapsed <= 0) return 0;

    var twoHoursMs = 2 * 60 * 60 * 1000;
    var oneHourMs = 60 * 60 * 1000;

    // 只有超过 2 小时才开始扣减
    if (elapsed <= twoHoursMs) return 0;

    // 超过 2 小时后的时间，每小时扣 3 点
    var damageTime = elapsed - twoHoursMs;
    var damageHours = Math.floor(damageTime / oneHourMs);
    return damageHours * 3;
}

/**
 * 更新 HP 危险警告和虚弱状态显示
 * HP < 20 时显示红色危险警告和虚弱状态
 * @param {object} creatureData - Creature 数据对象
 * 需求: 19.6
 */
function updateHPWarning(creatureData) {
    if (!creatureData) return;

    var dangerOverlay = document.getElementById('hpDangerOverlay');
    var stageEl = document.getElementById('creatureStage');
    var hpBar = document.getElementById('hpBar');

    if (creatureData.alive && creatureData.hp < 20 && creatureData.hp > 0) {
        // 显示危险警告浮层
        if (dangerOverlay) dangerOverlay.style.display = 'block';
        // 添加虚弱状态样式
        if (stageEl) stageEl.classList.add('weak-state');
        // HP 进度条危险样式
        if (hpBar) {
            hpBar.classList.add('danger');
            hpBar.classList.add('danger-warning');
        }
    } else {
        // 隐藏危险警告
        if (dangerOverlay) dangerOverlay.style.display = 'none';
        // 移除虚弱状态
        if (stageEl) stageEl.classList.remove('weak-state');
        // 移除危险样式（非死亡状态）
        if (hpBar && (creatureData.hp >= 20 || !creatureData.alive)) {
            hpBar.classList.remove('danger');
            hpBar.classList.remove('danger-warning');
        }
    }
}

// ===== 属性系统 (Attributes) =====
// 需求: 17.1, 17.2, 17.4, 17.6, 17.7

/**
 * 限制属性值在 0-100 范围内
 * @param {number} value - 原始属性值
 * @returns {number} 限制后的属性值
 * 需求: 17.2
 */
function clampAttribute(value) {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    if (value < 0) return 0;
    if (value > 100) return 100;
    return Math.round(value);
}

/**
 * 更新单项属性值
 * @param {object} creatureData - Creature 数据对象
 * @param {string} attrName - 属性名称: intelligence | stamina | charisma | creativity
 * @param {number} delta - 变化量（正数增加，负数减少）
 * 需求: 17.4, 17.6
 */
function updateAttribute(creatureData, attrName, delta) {
    if (!creatureData || !creatureData.attributes) return;
    var validAttrs = ['intelligence', 'stamina', 'charisma', 'creativity'];
    if (validAttrs.indexOf(attrName) === -1) return;
    var current = creatureData.attributes[attrName] || 0;
    creatureData.attributes[attrName] = clampAttribute(current + delta);
}

/**
 * 获取所有属性值（返回副本，缺失属性使用默认值 10）
 * @param {object} creatureData - Creature 数据对象
 * @returns {object} { intelligence, stamina, charisma, creativity }
 * 需求: 17.1
 */
function getAttributes(creatureData) {
    var defaults = { intelligence: 10, stamina: 10, charisma: 10, creativity: 10 };
    if (!creatureData || !creatureData.attributes) {
        return { intelligence: defaults.intelligence, stamina: defaults.stamina, charisma: defaults.charisma, creativity: defaults.creativity };
    }
    var attrs = creatureData.attributes;
    return {
        intelligence: clampAttribute(typeof attrs.intelligence === 'number' ? attrs.intelligence : defaults.intelligence),
        stamina: clampAttribute(typeof attrs.stamina === 'number' ? attrs.stamina : defaults.stamina),
        charisma: clampAttribute(typeof attrs.charisma === 'number' ? attrs.charisma : defaults.charisma),
        creativity: clampAttribute(typeof attrs.creativity === 'number' ? attrs.creativity : defaults.creativity)
    };
}

/**
 * 阶段变化时为所有属性增加 5 点成长奖励
 * @param {object} creatureData - Creature 数据对象
 * 需求: 17.7
 */
function applyGrowthBonus(creatureData) {
    if (!creatureData) return;
    if (!creatureData.attributes) {
        creatureData.attributes = { intelligence: 10, stamina: 10, charisma: 10, creativity: 10 };
    }
    var attrNames = ['intelligence', 'stamina', 'charisma', 'creativity'];
    for (var i = 0; i < attrNames.length; i++) {
        updateAttribute(creatureData, attrNames[i], 5);
    }
}

// ===== 属性等级标签 =====
function getAttrLevel(value) {
    if (value >= 90) return { label: '传说', color: '#f59e0b' };
    if (value >= 70) return { label: '优秀', color: '#a78bfa' };
    if (value >= 50) return { label: '良好', color: '#4ade80' };
    if (value >= 30) return { label: '普通', color: '#60a5fa' };
    if (value >= 15) return { label: '稚嫩', color: '#94a3b8' };
    return { label: '萌新', color: '#6b7280' };
}

// ===== 属性对场景的准入检查 =====
function checkLocationAccess(creatureData, location) {
    if (!location || !location.requires) return { allowed: true, missing: [] };
    var attrs = getAttributes(creatureData);
    var missing = [];
    for (var attr in location.requires) {
        if (location.requires.hasOwnProperty(attr)) {
            var required = location.requires[attr];
            var current = attrs[attr] || 0;
            if (current < required) {
                var ATTR_NAMES = { intelligence: '智力', stamina: '体力', charisma: '魅力', creativity: '创造力' };
                missing.push((ATTR_NAMES[attr] || attr) + '需要' + required + '（当前' + current + '）');
            }
        }
    }
    return { allowed: missing.length === 0, missing: missing };
}

// ===== 属性对喂食的加成 =====
function getAttrFeedBonus(creatureData) {
    var attrs = getAttributes(creatureData);
    // 创造力影响食物效果：每10点创造力+10%饱食度加成
    var creativityBonus = 1 + (attrs.creativity / 100) * 0.5;
    // 魅力影响心情加成：每10点魅力+5%心情加成
    var charismaBonus = 1 + (attrs.charisma / 100) * 0.3;
    return { satietyMult: creativityBonus, moodMult: charismaBonus };
}

// ===== 属性对烹饪的影响 =====
function getCookSuccessRate(creatureData) {
    var attrs = getAttributes(creatureData);
    // 基础成功率70%，智力每10点+3%
    var rate = 0.7 + (attrs.intelligence / 100) * 0.3;
    return Math.min(1, rate);
}

// ===== 属性对CHAR互动频率的影响 =====
function getCharActionInterval(creatureData) {
    var attrs = getAttributes(creatureData);
    // 基础8小时，魅力每10点减少10分钟，最低4小时
    var baseMs = 8 * 60 * 60 * 1000;
    var reduction = (attrs.charisma / 10) * 10 * 60 * 1000;
    return Math.max(4 * 60 * 60 * 1000, baseMs - reduction);
}

// ===== 属性对事件成功率的影响 =====
function getEventSuccessBonus(creatureData) {
    var attrs = getAttributes(creatureData);
    // 综合属性越高，事件结果越好的概率越大
    var avg = (attrs.intelligence + attrs.stamina + attrs.charisma + attrs.creativity) / 4;
    // 返回 0~0.3 的加成
    return (avg / 100) * 0.3;
}

// ========== 离线补算系统 (Task 7.1) ==========
// 需求: 15.1, 15.4, 15.5, 15.6

/**
 * 记录最后活跃时间戳到 localStorage
 * @param {string} charId - CHAR ID
 * 需求: 15.5
 */
function recordLastActive(charId) {
    if (!charId) return;
    setPetData(charId, 'last_active', Date.now().toString());
}

/**
 * 获取最后活跃时间戳
 * @param {string} charId - CHAR ID
 * @returns {number|null} 时间戳（毫秒）或 null
 */
function getLastActive(charId) {
    if (!charId) return null;
    var val = getPetData(charId, 'last_active', null);
    if (!val) return null;
    var ts = parseInt(val, 10);
    return isNaN(ts) ? null : ts;
}

/**
 * 计算错过餐食的 HP 扣减
 * 检查离线期间是否错过了早餐(7-9)、午餐(11:30-13:30)、晚餐(17:30-19:30)
 * 每错过一顿正餐扣减 HP 5 点
 * @param {object} creatureData - Creature 数据对象
 * @param {number} lastActiveTime - 上次活跃时间戳（毫秒）
 * @returns {number} 应扣减的 HP 总量（正数）
 * 需求: 15.4, 18.6
 */
function calculateMissedMealPenalty(creatureData, lastActiveTime) {
    if (!creatureData || !lastActiveTime) return 0;
    var now = Date.now();
    if (lastActiveTime >= now) return 0;

    // 默认供餐时间窗口
    var mealWindows = [
        { name: 'breakfast', startH: 7, startM: 0, endH: 9, endM: 0 },
        { name: 'lunch', startH: 11, startM: 30, endH: 13, endM: 30 },
        { name: 'dinner', startH: 17, startM: 30, endH: 19, endM: 30 }
    ];

    // 获取餐食记录
    var charId = creatureData.charId;
    var mealLog = charId ? getPetData(charId, 'meal_log', []) : [];

    var penalty = 0;
    var offlineStart = new Date(lastActiveTime);
    var offlineEnd = new Date(now);

    // 遍历离线期间的每一天
    var dayStart = new Date(offlineStart);
    dayStart.setHours(0, 0, 0, 0);

    var dayEnd = new Date(offlineEnd);
    dayEnd.setHours(23, 59, 59, 999);

    var currentDay = new Date(dayStart);

    while (currentDay <= dayEnd) {
        var nextDay = new Date(currentDay);
        nextDay.setDate(nextDay.getDate() + 1);

        for (var m = 0; m < mealWindows.length; m++) {
            var meal = mealWindows[m];

            // 计算该餐的结束时间
            var mealEndTime = new Date(currentDay);
            mealEndTime.setHours(meal.endH, meal.endM, 0, 0);
            var mealEndTs = mealEndTime.getTime();

            // 计算该餐的开始时间
            var mealStartTime = new Date(currentDay);
            mealStartTime.setHours(meal.startH, meal.startM, 0, 0);
            var mealStartTs = mealStartTime.getTime();

            // 只检查完全在离线期间内结束的餐食窗口
            // 即：餐食窗口结束时间在离线开始之后，且在当前时间之前
            if (mealEndTs <= lastActiveTime || mealEndTs > now) continue;

            // 检查该餐是否已被喂食（在该天的餐食窗口内有记录）
            var wasFed = false;
            for (var l = 0; l < mealLog.length; l++) {
                var log = mealLog[l];
                if (log && log.timestamp >= mealStartTs && log.timestamp <= mealEndTs) {
                    wasFed = true;
                    break;
                }
            }

            if (!wasFed) {
                penalty += 5; // 每错过一顿正餐扣 HP 5 点
            }
        }

        currentDay = nextDay;
    }

    return penalty;
}

/**
 * 计算离线时长并补算饱食度衰减、心情值衰减、HP 衰减
 * 在页面加载时调用，处理离线期间的所有属性变化
 * @param {object} creatureData - Creature 数据对象
 * @param {number} lastActiveTime - 上次活跃时间戳（毫秒）
 * @returns {Promise<object>} 补算结果 { offlineHours, satietyDecay, moodDecay, hpDamage, missedMealPenalty, died }
 * 需求: 15.1, 15.4, 15.6
 */
async function processOfflineTime(creatureData, lastActiveTime) {
    var result = {
        offlineHours: 0,
        satietyDecay: 0,
        moodDecay: 0,
        hpDamage: 0,
        missedMealPenalty: 0,
        died: false
    };

    if (!creatureData || !lastActiveTime) return result;
    if (!creatureData.alive) return result;

    var now = Date.now();
    var elapsed = now - lastActiveTime;
    if (elapsed <= 0) return result;

    var offlineHours = elapsed / (60 * 60 * 1000);
    result.offlineHours = offlineHours;

    // 1. 补算饱食度衰减（每小时 -5）
    var satietyDecay = Math.floor(offlineHours * 5);
    if (satietyDecay > 0) {
        result.satietyDecay = satietyDecay;
        updateSatiety(creatureData, -satietyDecay);
    }

    // 2. 补算心情值衰减（每 2 小时 -3）
    var moodPeriods = Math.floor(offlineHours / 2);
    var moodDecay = moodPeriods * 3;
    if (moodDecay > 0) {
        result.moodDecay = moodDecay;
        updateMood(creatureData, -moodDecay);
    }

    // 3. 补算饥饿导致的 HP 衰减
    // 如果离线前饱食度已经为 0，计算额外的饥饿 HP 扣减
    if (creatureData.satietyZeroSince) {
        var starvDmg = calculateStarvationDamage(creatureData);
        var lastStarvDmg = creatureData._lastStarvDmg || 0;
        var newStarvDmg = starvDmg - lastStarvDmg;
        if (newStarvDmg > 0) {
            result.hpDamage += newStarvDmg;
            updateHP(creatureData, -newStarvDmg);
            creatureData._lastStarvDmg = starvDmg;
        }
    }

    // 4. 补算错过餐食的 HP 扣减
    var missedPenalty = calculateMissedMealPenalty(creatureData, lastActiveTime);
    if (missedPenalty > 0) {
        result.missedMealPenalty = missedPenalty;
        result.hpDamage += missedPenalty;
        updateHP(creatureData, -missedPenalty);
    }

    // 5. 保存补算后的数据
    var charId = creatureData.charId;
    saveCreature(charId, creatureData);

    // 6. 检查死亡：离线期间 HP 降至 0 时触发死亡流程
    if (checkDeath(creatureData)) {
        result.died = true;
        await triggerDeath(charId, creatureData);
    }

    // 7. 记录当前时间为最后活跃时间
    recordLastActive(charId);

    return result;
}

// ========== 离线事件补算系统 ==========

/**
 * 补算离线期间的生活事件
 * 每 4 小时生成一个事件，最多补算 3 个
 * 调用 LLM 生成事件摘要，失败时使用降级方案
 * @param {object} creatureData - Creature 数据对象
 * @param {number} offlineHours - 离线时长（小时）
 * @returns {Promise<Array>} 生成的离线事件数组
 * 需求: 15.2, 15.3
 */
async function processOfflineEvents(creatureData, offlineHours) {
    if (!creatureData || !creatureData.alive) return [];
    if (offlineHours < 4) return [];

    var eventCount = Math.min(3, Math.floor(offlineHours / 4));
    if (eventCount <= 0) return [];

    var charId = creatureData.charId;
    var stageName = STAGE_LABELS[creatureData.growthStage] || creatureData.growthStage;
    var attrs = getAttributes(creatureData);
    var creatureName = creatureData.name || stageName;

    // 读取世界观设定
    var worldview = getPetData(charId, 'worldview', null);
    var worldviewText = (worldview && worldview.customText) ? worldview.customText : '一个充满魔法和奇幻的世界';

    var events = [];

    for (var i = 0; i < eventCount; i++) {
        var eventTime = Date.now() - Math.round((offlineHours - (i + 1) * 4) * 60 * 60 * 1000);
        var event = null;

        try {
            var prompt = '你是一个养成游戏的事件生成器。请为魔法生物生成一个简短的生活事件。\n\n' +
                '魔法生物信息：\n' +
                '- 名字：' + creatureName + '\n' +
                '- 成长阶段：' + stageName + '\n' +
                '- 世界观：' + worldviewText + '\n' +
                '- 智力：' + attrs.intelligence + '，体力：' + attrs.stamina +
                '，魅力：' + attrs.charisma + '，创造力：' + attrs.creativity + '\n\n' +
                '请生成第 ' + (i + 1) + ' 个离线期间发生的事件。' +
                '用 JSON 格式返回，包含 title（标题，10字以内）和 description（描述，30字以内）两个字段。' +
                '只返回 JSON，不要其他内容。';

            var systemPrompt = '你是一个可爱的养成游戏事件生成器，生成的事件要符合魔法生物当前的成长阶段和世界观设定。' +
                '事件内容要温馨有趣，适合全年龄段。请只返回纯 JSON 格式。';

            var llmResult = await callPetLLM(prompt, systemPrompt, 0.8);

            // 解析 LLM 返回的 JSON
            var parsed = null;
            try {
                // 尝试提取 JSON 部分（LLM 可能返回 markdown 代码块）
                var jsonMatch = llmResult.match(/\{[\s\S]*?\}/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]);
                }
            } catch (parseErr) {
                parsed = null;
            }

            if (parsed && parsed.title && parsed.description) {
                event = {
                    id: 'offline_' + eventTime + '_' + i,
                    timestamp: eventTime,
                    type: 'life_event',
                    title: String(parsed.title).slice(0, 20),
                    description: String(parsed.description).slice(0, 100),
                    source: 'offline',
                    choices: null,
                    chosenIndex: null,
                    result: null,
                    resultType: 'neutral',
                    attributeChanges: null,
                    hpChange: null,
                    pointsCost: null,
                    charComment: null,
                    locationId: 'home'
                };
            }
        } catch (err) {
            // LLM 调用失败，使用降级方案
            event = null;
        }

        // 降级：LLM 失败时生成简单的默认事件
        if (!event) {
            var fallbackEvents = [
                { title: '安静休息', description: creatureName + '在家里安静地休息了一会儿。' },
                { title: '独自玩耍', description: creatureName + '找到了一个有趣的小玩具，开心地玩了起来。' },
                { title: '窗边发呆', description: creatureName + '趴在窗边看着外面的风景，若有所思。' },
                { title: '小睡一觉', description: creatureName + '打了个哈欠，蜷缩起来睡了一小觉。' },
                { title: '翻找零食', description: creatureName + '在角落里翻找零食，结果什么也没找到。' },
                { title: '练习技能', description: creatureName + '认真地练习了一会儿自己的小技能。' }
            ];
            var fallback = fallbackEvents[(i + Math.floor(Math.random() * fallbackEvents.length)) % fallbackEvents.length];
            event = {
                id: 'offline_' + eventTime + '_' + i,
                timestamp: eventTime,
                type: 'life_event',
                title: fallback.title,
                description: fallback.description,
                source: 'offline',
                choices: null,
                chosenIndex: null,
                result: null,
                resultType: 'neutral',
                attributeChanges: null,
                hpChange: null,
                pointsCost: null,
                charComment: null,
                locationId: 'home'
            };
        }

        events.push(event);
    }

    // 保存事件到事件日志
    if (events.length > 0) {
        var eventLog = getPetData(charId, 'event_log', []);
        for (var j = 0; j < events.length; j++) {
            eventLog.unshift(events[j]);
        }
        setPetData(charId, 'event_log', eventLog);
    }

    return events;
}

/**
 * 显示「离线期间发生的事」摘要卡片
 * 在宠物主页上以卡片形式展示离线期间生成的事件摘要
 * @param {Array} events - 离线事件数组
 */
function showOfflineSummary(events) {
    if (!events || events.length === 0) return;

    // 移除已有的离线摘要卡片
    var existing = document.getElementById('offlineSummaryCard');
    if (existing) existing.remove();

    // 构建摘要内容
    var summaryHtml = '<div class="offline-summary-card" id="offlineSummaryCard">' +
        '<div class="offline-summary-header">' +
        '<span class="offline-summary-icon">📋</span>' +
        '<span class="offline-summary-title">离线期间发生的事</span>' +
        '<button class="offline-summary-close" onclick="closeOfflineSummary()">✕</button>' +
        '</div>' +
        '<div class="offline-summary-body">';

    for (var i = 0; i < events.length; i++) {
        var evt = events[i];
        var timeStr = new Date(evt.timestamp).toLocaleString('zh-CN', {
            month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        summaryHtml += '<div class="offline-event-item">' +
            '<span class="offline-event-time">' + timeStr + '</span>' +
            '<span class="offline-event-title">' + (evt.title || '未知事件') + '</span>' +
            '<p class="offline-event-desc">' + (evt.description || '') + '</p>' +
            '</div>';
    }

    summaryHtml += '</div></div>';

    // 插入到主页事件通知区域之前
    var homeView = document.getElementById('view-home');
    if (homeView) {
        var eventNotif = document.getElementById('eventNotification');
        if (eventNotif) {
            eventNotif.insertAdjacentHTML('beforebegin', summaryHtml);
        } else {
            // 如果没有事件通知区域，插入到操作按钮区之前
            var actionBtns = homeView.querySelector('.action-buttons');
            if (actionBtns) {
                actionBtns.insertAdjacentHTML('beforebegin', summaryHtml);
            } else {
                homeView.insertAdjacentHTML('beforeend', summaryHtml);
            }
        }
    }
}

/**
 * 关闭离线摘要卡片
 */
function closeOfflineSummary() {
    var card = document.getElementById('offlineSummaryCard');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px)';
        setTimeout(function() { card.remove(); }, 300);
    }
}

// ===== 页面加载和卸载时记录最后活跃时间 =====

// beforeunload 事件：页面关闭/刷新时记录最后活跃时间
window.addEventListener('beforeunload', function() {
    if (currentCharId) {
        recordLastActive(currentCharId);
    }
});

// ========== Task 9: 生活事件系统 ==========

/**
 * 检查是否应触发事件（每 4 小时检查，60% 概率）
 */
function shouldTriggerEvent(creatureData) {
    if (!creatureData || !creatureData.alive) return false;
    if (creatureData.growthStage === 'egg') return false;
    var lastCheck = creatureData.lastEventCheck || 0;
    var elapsed = Date.now() - lastCheck;
    if (elapsed < 4 * 60 * 60 * 1000) return false;
    return Math.random() < 0.6;
}

/**
 * 调用 LLM 生成事件
 */
async function generateEvent(creatureData, worldview) {
    var charId = creatureData.charId;
    var stageName = STAGE_LABELS[creatureData.growthStage] || creatureData.growthStage;
    var attrs = getAttributes(creatureData);
    var creatureName = creatureData.name || stageName;
    var wvText = (worldview && worldview.customText) ? worldview.customText : '充满魔法的奇幻世界';
    var recentEvents = getPetData(charId, 'event_log', []).slice(0, 5);
    var recentStr = recentEvents.map(function(e) { return e.title; }).join('、') || '无';

    var prompt = '你是养成游戏事件生成器。为魔法生物生成一个生活事件。\n' +
        '名字：' + creatureName + '，阶段：' + stageName + '，世界观：' + wvText + '\n';
    var persona = getPersona(charId);
    if (persona) prompt += '人设：' + persona + '\n';
    prompt += '属性：智力' + attrs.intelligence + ' 体力' + attrs.stamina + ' 魅力' + attrs.charisma + ' 创造力' + attrs.creativity + '\n' +
        '最近事件：' + recentStr + '\n\n' +
        '请用JSON返回：{"title":"标题10字内","description":"描述50字内","choices":["选项A","选项B","选项C"]}\n只返回JSON。';

    try {
        var result = await callPetLLM(prompt, '你是可爱的养成游戏事件生成器，生成符合世界观和成长阶段的温馨有趣事件。只返回纯JSON。', 0.85);
        var match = result.match(/\{[\s\S]*?\}/);
        if (match) {
            var parsed = JSON.parse(match[0]);
            if (parsed.title && parsed.choices) return parsed;
        }
    } catch (e) {}

    // 降级
    var fallbacks = [
        { title: '神秘访客', description: '一个神秘的小精灵来拜访了！', choices: ['热情招待', '谨慎观察', '躲起来'] },
        { title: '发现宝箱', description: '在角落发现了一个闪闪发光的小箱子！', choices: ['打开看看', '交给主人', '留着以后再说'] },
        { title: '天气变化', description: '外面突然下起了彩虹雨！', choices: ['出去玩', '在窗边看', '继续睡觉'] }
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

/**
 * 处理用户选择事件选项
 */
async function handleEventChoice(creatureData, event, choiceIndex) {
    var charId = creatureData.charId;
    var choice = event.choices[choiceIndex];
    var creatureName = creatureData.name || '魔法生物';

    var resultData = { description: '', attrChanges: {}, moodChange: 0, hpChange: 0 };

    try {
        var attrs = getAttributes(creatureData);
        var successBonus = getEventSuccessBonus(creatureData);
        var attrHint = '（属性：智力' + attrs.intelligence + ' 体力' + attrs.stamina + ' 魅力' + attrs.charisma + ' 创造力' + attrs.creativity + '，综合能力' + (successBonus > 0.15 ? '较强' : '一般') + '）';
        var prompt = '魔法生物「' + creatureName + '」' + attrHint + '遇到了事件「' + event.title + '」：' + event.description +
            '\n选择了：' + choice + '\n请根据属性高低决定结果好坏（属性高则结果更好）。用JSON返回：{"description":"结果描述30字内","attrChanges":{"intelligence":0,"stamina":0,"charisma":0,"creativity":0},"moodChange":0,"hpChange":0}\n数值范围-5到+5。只返回JSON。';
        var result = await callPetLLM(prompt, '你是养成游戏结果生成器。属性越高的生物越容易获得好结果。只返回纯JSON。', 0.7);
        var match = result.match(/\{[\s\S]*?\}/);
        if (match) {
            var parsed = JSON.parse(match[0]);
            if (parsed.description) resultData = parsed;
        }
    } catch (e) {
        resultData = { description: creatureName + '做出了选择，一切顺利！', attrChanges: {}, moodChange: 2, hpChange: 0 };
    }

    // 应用属性变化
    if (resultData.attrChanges) {
        var attrNames = ['intelligence', 'stamina', 'charisma', 'creativity'];
        for (var i = 0; i < attrNames.length; i++) {
            var delta = resultData.attrChanges[attrNames[i]] || 0;
            if (delta) updateAttribute(creatureData, attrNames[i], delta);
        }
    }
    if (resultData.moodChange) updateMood(creatureData, resultData.moodChange);
    if (resultData.hpChange) updateHP(creatureData, resultData.hpChange);

    creatureData.lastEventCheck = Date.now();
    saveCreature(charId, creatureData);

    // 更新事件日志
    var eventLog = getPetData(charId, 'event_log', []);
    var logEntry = {
        id: 'evt_' + Date.now(),
        timestamp: Date.now(),
        type: 'life_event',
        title: event.title,
        description: event.description,
        source: 'generated',
        choices: event.choices,
        chosenIndex: choiceIndex,
        result: resultData.description,
        resultType: (resultData.moodChange >= 0 && resultData.hpChange >= 0) ? 'positive' : 'negative',
        attributeChanges: resultData.attrChanges || null
    };
    eventLog.unshift(logEntry);
    if (eventLog.length > 100) eventLog = eventLog.slice(0, 100);
    setPetData(charId, 'event_log', eventLog);

    return { logEntry: logEntry, resultData: resultData };
}

// ===== 事件日志 UI (Task 9.2) =====

function getEventLog(charId) {
    return getPetData(charId, 'event_log', []);
}

function saveEventToLog(charId, event) {
    var log = getEventLog(charId);
    log.unshift(event);
    if (log.length > 100) log = log.slice(0, 100);
    setPetData(charId, 'event_log', log);
}

/** 显示事件通知卡片 */
function showEventNotification(event) {
    var notif = document.getElementById('eventNotification');
    if (!notif) return;
    document.getElementById('eventTitle').textContent = event.title || '';
    document.getElementById('eventDesc').textContent = event.description || '';

    // 渲染选项按钮
    var choicesHtml = '';
    if (event.choices && event.choices.length > 0) {
        for (var i = 0; i < event.choices.length; i++) {
            choicesHtml += '<button class="event-choice-btn" onclick="onEventChoice(' + i + ')">' + event.choices[i] + '</button>';
        }
    }
    var choicesEl = document.getElementById('eventChoices');
    if (!choicesEl) {
        var card = notif.querySelector('.event-card');
        if (card) {
            var div = document.createElement('div');
            div.id = 'eventChoices';
            div.className = 'event-choices';
            div.innerHTML = choicesHtml;
            card.appendChild(div);
        }
    } else {
        choicesEl.innerHTML = choicesHtml;
    }
    notif.style.display = '';
    window._pendingEvent = event;
}

/** 处理事件选择 */
async function onEventChoice(idx) {
    if (!window._pendingEvent || !currentCreature) return;
    var event = window._pendingEvent;
    var notif = document.getElementById('eventNotification');

    // 显示加载状态
    var choicesEl = document.getElementById('eventChoices');
    if (choicesEl) choicesEl.innerHTML = '<span style="color:var(--pet-text-muted)">处理中...</span>';

    var result = await handleEventChoice(currentCreature, event, idx);

    // 显示结果
    if (choicesEl) {
        choicesEl.innerHTML = '<div class="event-result">' +
            '<p>' + (result.resultData.description || '完成！') + '</p>' +
            '<button class="event-choice-btn" onclick="hideEventNotification()">知道了</button></div>';
    }
    window._pendingEvent = null;
    renderHome();
}

function hideEventNotification() {
    var notif = document.getElementById('eventNotification');
    if (notif) notif.style.display = 'none';
}

/** 渲染事件日志视图 */
function renderEventLog() {
    var panel = document.getElementById('eventLogPanel');
    if (!panel) return;
    var log = getEventLog(currentCharId);
    // 只显示生活事件（排除趣闻）
    var events = [];
    for (var i = 0; i < log.length; i++) {
        if (log[i].type !== 'anecdote') events.push(log[i]);
    }

    var html = '';

    // 手动触发按钮
    var canTrigger = currentCreature && currentCreature.growthStage !== 'egg';
    html += '<div class="diary-gen-bar">' +
        '<button class="action-btn" id="eventGenBtn" onclick="manualGenerateEvent()"' + (canTrigger ? '' : ' disabled') + '>' +
        '<span class="action-label">🎲 刷新事件</span></button>' +
        '</div>';

    if (events.length === 0) {
        html += '<div class="pet-empty"><div class="pet-empty-icon">📜</div><p>暂无事件记录<br>点击上方按钮触发新事件</p></div>';
        panel.innerHTML = html;
        return;
    }
    for (var i = 0; i < events.length; i++) {
        var e = events[i];
        var timeStr = new Date(e.timestamp).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        var typeIcon = e.source === 'char' ? '💕' : '⚡';
        html += '<div class="event-log-item ' + (e.resultType || 'neutral') + '">' +
            '<div class="event-log-header"><span>' + typeIcon + ' ' + (e.title || '事件') + '</span><span class="event-log-time">' + timeStr + '</span></div>' +
            '<p class="event-log-desc">' + (e.description || '') + '</p>';
        if (e.choices && e.choices.length > 0) {
            html += '<p class="event-log-choice">选择：' + (e.choices[e.chosenIndex] || '') + '</p>';
        }
        if (e.result) html += '<p class="event-log-result">→ ' + e.result + '</p>';
        if (e.attributeChanges) {
            var changes = [];
            var names = { intelligence: '🧠', stamina: '💪', charisma: '✨', creativity: '🎨' };
            for (var k in e.attributeChanges) {
                if (e.attributeChanges[k]) changes.push(names[k] + (e.attributeChanges[k] > 0 ? '+' : '') + e.attributeChanges[k]);
            }
            if (changes.length > 0) html += '<p class="event-log-attrs">' + changes.join(' ') + '</p>';
        }
        html += '</div>';
    }
    panel.innerHTML = html;
}

/** 手动触发生活事件 */
async function manualGenerateEvent() {
    if (!currentCreature || !currentCreature.alive) return;
    if (currentCreature.growthStage === 'egg') return;

    var btn = document.getElementById('eventGenBtn');
    if (btn) { btn.disabled = true; btn.querySelector('.action-label').textContent = '🎲 生成中...'; }

    try {
        var worldview = getWorldview(currentCharId);
        var event = await generateEvent(currentCreature, worldview);
        if (event) {
            showEventNotification(event);
        }
    } catch (e) {
        alert('事件生成失败：' + (e.message || '未知错误'));
    }

    if (btn) { btn.disabled = false; btn.querySelector('.action-label').textContent = '🎲 刷新事件'; }
}

/** 渲染趣闻集 */
function renderAnecdotes() {
    var panel = document.getElementById('anecdotePanel');
    if (!panel) return;
    var log = getEventLog(currentCharId);
    // 只显示趣闻
    var anecdotes = [];
    for (var i = 0; i < log.length; i++) {
        if (log[i].type === 'anecdote') anecdotes.push(log[i]);
    }

    var html = '';

    // 手动触发按钮
    var canTrigger = currentCreature && currentCreature.growthStage !== 'egg';
    html += '<div class="diary-gen-bar">' +
        '<button class="action-btn" id="anecdoteGenBtn" onclick="manualGenerateAnecdote()"' + (canTrigger ? '' : ' disabled') + '>' +
        '<span class="action-label">🔮 生成趣闻</span></button>' +
        '</div>';

    if (anecdotes.length === 0) {
        html += '<div class="pet-empty"><div class="pet-empty-icon">📖</div><p>趣闻集还是空的~<br>点击上方按钮生成趣闻吧</p></div>';
        panel.innerHTML = html;
        return;
    }
    for (var i = 0; i < anecdotes.length; i++) {
        var a = anecdotes[i];
        var timeStr = new Date(a.timestamp).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        var locName = '';
        if (a.locationId) {
            var locs = getAllLocations(currentCharId);
            for (var j = 0; j < locs.length; j++) {
                if (locs[j].id === a.locationId) { locName = ' · 📍' + locs[j].name; break; }
            }
        }
        html += '<div class="anecdote-item">' +
            '<div class="anecdote-header"><span>📖 趣闻</span><span class="event-log-time">' + timeStr + locName + '</span></div>' +
            '<p class="anecdote-text">' + (a.description || '') + '</p>' +
            '</div>';
    }
    panel.innerHTML = html;
}

/** 手动触发趣闻生成 */
async function manualGenerateAnecdote() {
    if (!currentCreature || !currentCreature.alive) return;
    if (currentCreature.growthStage === 'egg') return;

    var btn = document.getElementById('anecdoteGenBtn');
    if (btn) { btn.disabled = true; btn.querySelector('.action-label').textContent = '🔮 生成中...'; }

    try {
        var text = await generateAnecdote(currentCreature);
        if (text) {
            showAnecdoteBubble(text);
            renderAnecdotes();
        } else {
            alert('趣闻冷却中，请稍后再试~（10分钟间隔）');
        }
    } catch (e) {
        alert('趣闻生成失败：' + (e.message || '未知错误'));
    }

    if (btn) { btn.disabled = false; btn.querySelector('.action-label').textContent = '🔮 生成趣闻'; }
}


// ========== Task 10: 对话系统 ==========

/**
 * 构建对话上下文提示词
 */
function buildChatPrompt(creatureData, recentMessages) {
    var stageName = STAGE_LABELS[creatureData.growthStage] || creatureData.growthStage;
    var attrs = getAttributes(creatureData);
    var charId = creatureData.charId;
    var titles = getPetData(charId, 'titles', { forUser: '主人', forChar: '爸爸/妈妈' });
    var worldview = getPetData(charId, 'worldview', null);
    var wvText = (worldview && worldview.customText) ? worldview.customText : '充满魔法的奇幻世界';
    var recentEvents = getPetData(charId, 'event_log', []).slice(0, 3);
    var evtStr = recentEvents.map(function(e) { return e.title; }).join('、') || '无';

    var styleGuide = '';
    switch (creatureData.growthStage) {
        case 'egg': styleGuide = '你还在蛋里，无法说话，只能发出微弱的振动。'; break;
        case 'baby': styleGuide = '你是婴儿，只会发出简单的拟声词如"咕咕""呀呀""嘤嘤"，偶尔蹦出一两个字。'; break;
        case 'child': styleGuide = '你是幼年期，说话像小孩子，用叠词和童言童语，天真可爱，好奇心强。'; break;
        case 'teen': styleGuide = '你是少年期，有自己的想法，偶尔会叛逆顶嘴，但内心还是很依赖' + titles.forUser + '。语气有时酷酷的。'; break;
        case 'adult': styleGuide = '你是成年期，说话成熟稳重，有自己的见解，温柔体贴，会关心' + titles.forUser + '。'; break;
        default: styleGuide = '用可爱的语气说话。';
    }

    var systemPrompt = '你是一只名叫「' + (creatureData.name || '魔法生物') + '」的魔法生物。\n' +
        '成长阶段：' + stageName + '\n' +
        '世界观：' + wvText + '\n';
    var persona = getPersona(charId);
    if (persona) systemPrompt += '人设：' + persona + '\n';
    var appearance = getAppearanceDescription(charId);
    if (appearance) systemPrompt += '外观：' + appearance + '\n';
    systemPrompt += '你称呼用户为「' + titles.forUser + '」\n' +
        '属性：智力' + attrs.intelligence + ' 体力' + attrs.stamina + ' 魅力' + attrs.charisma + ' 创造力' + attrs.creativity + '\n' +
        '最近发生的事：' + evtStr + '\n' +
        '说话风格：' + styleGuide + '\n' +
        '请用中文回复，保持角色扮演，回复简短（50字以内）。';

    return systemPrompt;
}

/**
 * 发送消息并获取 LLM 回复
 */
async function sendPetMessage(charId, userMessage) {
    if (!userMessage || !userMessage.trim()) return;
    userMessage = userMessage.trim();
    var inputEl = document.getElementById('chatInput');
    if (inputEl) inputEl.value = '';

    var creature = currentCreature;
    if (!creature || !isCreatureAlive(creature)) {
        appendChatMessage('system', '魔法生物已经不在了…');
        return;
    }
    if (creature.growthStage === 'egg') {
        appendChatMessage('system', '🥚 宝宝还在蛋里，再等等吧~');
        return;
    }

    // 显示用户消息
    appendChatMessage('user', userMessage);

    // 保存用户消息
    saveChatMessage(charId, { role: 'user', content: userMessage, timestamp: Date.now() });

    // 构建提示词
    var recentMsgs = loadChatHistory(charId).slice(-10);
    var systemPrompt = buildChatPrompt(creature, recentMsgs);

    // 构建对话历史
    var historyStr = '';
    for (var i = 0; i < recentMsgs.length; i++) {
        var m = recentMsgs[i];
        historyStr += (m.role === 'user' ? '用户' : '魔法生物') + '：' + m.content + '\n';
    }

    var prompt = historyStr + '用户：' + userMessage + '\n请以魔法生物的身份回复：';

    appendChatMessage('creature', '...');

    try {
        var reply = await callPetLLM(prompt, systemPrompt, 0.8);
        // 移除加载消息，显示回复
        removeLastChatMessage();
        appendChatMessage('creature', reply);
        saveChatMessage(charId, { role: 'creature', content: reply, timestamp: Date.now() });

        // 对话时心情 +5, HP +1
        updateMood(creature, 5);
        updateHP(creature, 1);
        saveCreature(charId, creature);
    } catch (e) {
        removeLastChatMessage();
        appendChatMessage('system', '⚠️ 通信失败：' + (e.message || '未知错误'));
    }
}

function appendChatMessage(role, content) {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.textContent = content;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeLastChatMessage() {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    var last = container.lastElementChild;
    if (last) last.remove();
}

function loadChatHistory(charId) {
    return getPetData(charId, 'chat_history', []);
}

function saveChatMessage(charId, message) {
    var history = loadChatHistory(charId);
    history.push(message);
    if (history.length > 50) history = history.slice(history.length - 50);
    setPetData(charId, 'chat_history', history);
}

/** 渲染对话视图（加载历史消息） */
function renderChat() {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = '';
    if (!currentCreature) return;
    if (currentCreature.growthStage === 'egg') {
        appendChatMessage('system', '🥚 宝宝还在蛋里，再等等吧~');
        return;
    }
    var history = loadChatHistory(currentCharId);
    for (var i = 0; i < history.length; i++) {
        appendChatMessage(history[i].role, history[i].content);
    }
}


// ========== Task 11: 日程、饮食与厨房系统 ==========

// ===== 11.1 日程管理 =====

var DEFAULT_SCHEDULE = [
    { id: 's1', name: '早餐', startH: 7, startM: 0, endH: 9, endM: 0, locationId: 'home' },
    { id: 's2', name: '上午学习', startH: 9, startM: 0, endH: 11, endM: 30, locationId: 'school' },
    { id: 's3', name: '午餐', startH: 11, startM: 30, endH: 13, endM: 30, locationId: 'home' },
    { id: 's4', name: '下午活动', startH: 13, startM: 30, endH: 17, endM: 30, locationId: 'park' },
    { id: 's5', name: '晚餐', startH: 17, startM: 30, endH: 19, endM: 30, locationId: 'home' },
    { id: 's6', name: '自由时间', startH: 19, startM: 30, endH: 22, endM: 0, locationId: 'home' }
];

function getSchedule(charId) {
    return getPetData(charId, 'schedule', DEFAULT_SCHEDULE);
}

function saveSchedule(charId, config) {
    setPetData(charId, 'schedule', config);
}

function getCurrentActivity(schedule) {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var nowMin = h * 60 + m;
    for (var i = 0; i < schedule.length; i++) {
        var s = schedule[i];
        var startMin = s.startH * 60 + s.startM;
        var endMin = s.endH * 60 + s.endM;
        if (nowMin >= startMin && nowMin < endMin) return s;
    }
    return null;
}

/** 渲染日程管理面板 */
function renderSchedule() {
    var panel = document.getElementById('schedulePanel');
    if (!panel) return;
    var schedule = getSchedule(currentCharId);
    var locations = getAllLocations(currentCharId);

    var html = '<div class="schedule-hint">⏰ 所有时间均为你的本地时间（' + Intl.DateTimeFormat().resolvedOptions().timeZone + '）</div>';
    html += '<div class="schedule-list">';
    for (var i = 0; i < schedule.length; i++) {
        var s = schedule[i];
        var startStr = String(s.startH).padStart(2, '0') + ':' + String(s.startM).padStart(2, '0');
        var endStr = String(s.endH).padStart(2, '0') + ':' + String(s.endM).padStart(2, '0');
        var locName = '家';
        for (var j = 0; j < locations.length; j++) {
            if (locations[j].id === s.locationId) { locName = locations[j].name; break; }
        }
        html += '<div class="schedule-item">' +
            '<div class="schedule-time">' + startStr + ' - ' + endStr + '</div>' +
            '<div class="schedule-name">' + s.name + '</div>' +
            '<div class="schedule-loc">📍 ' + locName + '</div>' +
            '<button class="schedule-del-btn" onclick="deleteScheduleItem(' + i + ')">✕</button>' +
            '</div>';
    }
    html += '</div>';

    // 添加新活动表单
    html += '<div class="schedule-add">' +
        '<div class="schedule-add-title">➕ 添加活动</div>' +
        '<input type="text" id="schedAddName" placeholder="活动名称" class="schedule-input">' +
        '<div class="schedule-time-row">' +
        '<input type="time" id="schedAddStart" class="schedule-input">' +
        '<span>至</span>' +
        '<input type="time" id="schedAddEnd" class="schedule-input">' +
        '</div>' +
        '<select id="schedAddLoc" class="schedule-input">';
    for (var k = 0; k < locations.length; k++) {
        var locAccess = currentCreature ? checkLocationAccess(currentCreature, locations[k]) : { allowed: true };
        var lockIcon = locAccess.allowed ? '' : '🔒 ';
        var reqText = '';
        if (locations[k].requires) {
            var reqParts = [];
            var ATTR_SHORT = { intelligence: '智', stamina: '体', charisma: '魅', creativity: '创' };
            for (var rk in locations[k].requires) {
                if (locations[k].requires.hasOwnProperty(rk)) {
                    reqParts.push(ATTR_SHORT[rk] + locations[k].requires[rk]);
                }
            }
            reqText = reqParts.length > 0 ? '（' + reqParts.join('/') + '）' : '';
        }
        html += '<option value="' + locations[k].id + '"' + (locAccess.allowed ? '' : ' style="color:#666"') + '>' + lockIcon + locations[k].name + reqText + '</option>';
    }
    html += '</select>' +
        '<button class="action-btn" onclick="addScheduleItem()" style="width:100%;margin-top:8px"><span class="action-label">添加</span></button>' +
        '</div>';

    panel.innerHTML = html;
}

function addScheduleItem() {
    var name = document.getElementById('schedAddName').value.trim();
    var start = document.getElementById('schedAddStart').value;
    var end = document.getElementById('schedAddEnd').value;
    var loc = document.getElementById('schedAddLoc').value;
    if (!name || !start || !end) return;

    // 检查场景属性准入
    if (currentCreature && loc) {
        var locations = getAllLocations(currentCharId);
        for (var c = 0; c < locations.length; c++) {
            if (locations[c].id === loc) {
                var access = checkLocationAccess(currentCreature, locations[c]);
                if (!access.allowed) {
                    alert('⚠️ 属性不足，无法前往该场景！\n' + access.missing.join('\n'));
                    return;
                }
                break;
            }
        }
    }

    var sp = start.split(':'), ep = end.split(':');
    var schedule = getSchedule(currentCharId);
    schedule.push({
        id: 's_' + Date.now(),
        name: name,
        startH: parseInt(sp[0]), startM: parseInt(sp[1]),
        endH: parseInt(ep[0]), endM: parseInt(ep[1]),
        locationId: loc || 'home'
    });
    saveSchedule(currentCharId, schedule);
    renderSchedule();
}

function deleteScheduleItem(idx) {
    var schedule = getSchedule(currentCharId);
    schedule.splice(idx, 1);
    saveSchedule(currentCharId, schedule);
    renderSchedule();
}

// ===== 11.2 供餐时间窗口与餐食机制 =====

var DEFAULT_MEAL_TIMES = {
    breakfast: { startH: 7, startM: 0, endH: 9, endM: 0 },
    lunch: { startH: 11, startM: 30, endH: 13, endM: 30 },
    dinner: { startH: 17, startM: 30, endH: 19, endM: 30 }
};

var MEAL_LABELS = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };

function getMealTimeConfig(charId) {
    return getPetData(charId, 'meal_times', DEFAULT_MEAL_TIMES);
}

function isMealTime(mealType) {
    var config = getMealTimeConfig(currentCharId);
    var meal = config[mealType];
    if (!meal) return false;
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var startMin = meal.startH * 60 + meal.startM;
    var endMin = meal.endH * 60 + meal.endM;
    return nowMin >= startMin && nowMin < endMin;
}

function recordMeal(charId, mealType, mealItem) {
    var log = getPetData(charId, 'meal_log', []);
    log.push({ timestamp: Date.now(), mealType: mealType, item: mealItem });
    if (log.length > 100) log = log.slice(log.length - 100);
    setPetData(charId, 'meal_log', log);
}

function checkMissedMeals(creatureData, currentTime) {
    // Already handled in calculateMissedMealPenalty for offline
    // This is for real-time check
    var charId = creatureData.charId;
    var config = getMealTimeConfig(charId);
    var mealLog = getPetData(charId, 'meal_log', []);
    var today = new Date(currentTime);
    today.setHours(0, 0, 0, 0);
    var todayTs = today.getTime();
    var missed = [];

    var types = ['breakfast', 'lunch', 'dinner'];
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var meal = config[type];
        var endMin = meal.endH * 60 + meal.endM;
        var nowMin = new Date(currentTime).getHours() * 60 + new Date(currentTime).getMinutes();
        if (nowMin <= endMin) continue; // 还没过用餐时间

        var startTs = todayTs + (meal.startH * 60 + meal.startM) * 60000;
        var endTs = todayTs + endMin * 60000;
        var wasFed = false;
        for (var j = 0; j < mealLog.length; j++) {
            if (mealLog[j].timestamp >= startTs && mealLog[j].timestamp <= endTs && mealLog[j].mealType === type) {
                wasFed = true; break;
            }
        }
        if (!wasFed) missed.push(type);
    }
    return missed;
}

// ===== 11.3 厨房模块 =====

var DEFAULT_INGREDIENTS = [
    { id: 'ing_flour', name: '魔法面粉', cost: 3 },
    { id: 'ing_egg', name: '凤凰蛋', cost: 5 },
    { id: 'ing_milk', name: '月光牛奶', cost: 4 },
    { id: 'ing_fruit', name: '星辰果', cost: 6 },
    { id: 'ing_meat', name: '幻兽肉', cost: 8 },
    { id: 'ing_herb', name: '智慧草', cost: 5 }
];

var RECIPES = [
    { name: '魔法饼干', ingredients: ['ing_flour', 'ing_egg'], satiety: 25, attrs: { intelligence: 2 } },
    { name: '星光奶昔', ingredients: ['ing_milk', 'ing_fruit'], satiety: 20, attrs: { charisma: 2 } },
    { name: '力量肉排', ingredients: ['ing_meat', 'ing_herb'], satiety: 35, attrs: { stamina: 3 } },
    { name: '创意沙拉', ingredients: ['ing_fruit', 'ing_herb'], satiety: 15, attrs: { creativity: 3 } },
    { name: '全能大餐', ingredients: ['ing_flour', 'ing_egg', 'ing_meat', 'ing_fruit'], satiety: 50, attrs: { intelligence: 1, stamina: 1, charisma: 1, creativity: 1 } }
];

function craftMeal(charId, recipeIndex) {
    if (recipeIndex < 0 || recipeIndex >= RECIPES.length) return { success: false, message: '无效食谱' };
    var recipe = RECIPES[recipeIndex];
    var inventory = getPetData(charId, 'kitchen_inventory', []);

    // 检查食材
    var needed = recipe.ingredients.slice();
    for (var i = 0; i < needed.length; i++) {
        var found = false;
        for (var j = 0; j < inventory.length; j++) {
            if (inventory[j] && inventory[j].id === needed[i]) { found = true; break; }
        }
        if (!found) return { success: false, message: '缺少食材：' + needed[i] };
    }

    // 消耗食材
    for (var k = 0; k < needed.length; k++) {
        for (var l = 0; l < inventory.length; l++) {
            if (inventory[l] && inventory[l].id === needed[k]) {
                inventory.splice(l, 1);
                break;
            }
        }
    }
    setPetData(charId, 'kitchen_inventory', inventory);

    // 智力影响烹饪成功率
    var creature = currentCreature || loadCreature(charId);
    var successRate = creature ? getCookSuccessRate(creature) : 0.7;
    if (Math.random() > successRate) {
        // 烹饪失败 — 食材浪费但返还一个随机食材
        var refund = needed[Math.floor(Math.random() * needed.length)];
        var kitchenInv = getPetData(charId, 'kitchen_inventory', []);
        kitchenInv.push({ id: refund, name: refund });
        setPetData(charId, 'kitchen_inventory', kitchenInv);
        var pct = Math.round(successRate * 100);
        return { success: false, message: '烹饪失败了…（成功率' + pct + '%）退还了一份食材。提升智力可以提高成功率哦！' };
    }

    // 生成餐食物品到背包
    var mealItem = {
        id: 'meal_' + Date.now(),
        name: recipe.name,
        satiety: recipe.satiety,
        type: 'food',
        attrs: recipe.attrs,
        source: 'kitchen'
    };
    var petInventory = getPetData(charId, 'inventory', []);
    petInventory.push(mealItem);
    setPetData(charId, 'inventory', petInventory);

    var successPct = Math.round(successRate * 100);
    return { success: true, message: '成功制作了' + recipe.name + '！（成功率' + successPct + '%）已放入背包。', item: mealItem };
}

function buyIngredient(charId, ingredientId) {
    var ing = null;
    for (var i = 0; i < DEFAULT_INGREDIENTS.length; i++) {
        if (DEFAULT_INGREDIENTS[i].id === ingredientId) { ing = DEFAULT_INGREDIENTS[i]; break; }
    }
    if (!ing) return { success: false, message: '未知食材' };
    if (!checkPoints(charId, ing.cost)) return { success: false, message: '积分不足' };
    deductPoints(charId, ing.cost);
    var inventory = getPetData(charId, 'kitchen_inventory', []);
    inventory.push({ id: ing.id, name: ing.name });
    setPetData(charId, 'kitchen_inventory', inventory);
    return { success: true, message: '购买了' + ing.name };
}

/** 渲染厨房面板 */
function renderKitchen() {
    var panel = document.getElementById('kitchenPanel');
    if (!panel) return;
    var inventory = getPetData(currentCharId, 'kitchen_inventory', []);

    var html = '<div class="kitchen-section"><div class="kitchen-title">🧊 食材库存</div>';
    if (inventory.length === 0) {
        html += '<p class="kitchen-empty">暂无食材，去下方购买吧~</p>';
    } else {
        var counts = {};
        for (var i = 0; i < inventory.length; i++) {
            var id = inventory[i].id;
            counts[id] = (counts[id] || 0) + 1;
        }
        html += '<div class="ingredient-list">';
        for (var cid in counts) {
            var ingName = cid;
            for (var j = 0; j < DEFAULT_INGREDIENTS.length; j++) {
                if (DEFAULT_INGREDIENTS[j].id === cid) { ingName = DEFAULT_INGREDIENTS[j].name; break; }
            }
            html += '<span class="ingredient-tag">' + ingName + ' ×' + counts[cid] + '</span>';
        }
        html += '</div>';
    }
    html += '</div>';

    // 购买食材
    html += '<div class="kitchen-section"><div class="kitchen-title">🛒 购买食材</div><div class="ingredient-shop">';
    for (var k = 0; k < DEFAULT_INGREDIENTS.length; k++) {
        var ing = DEFAULT_INGREDIENTS[k];
        html += '<button class="ingredient-buy-btn" onclick="doBuyIngredient(\'' + ing.id + '\')">' +
            ing.name + ' <span class="ing-cost">💰' + ing.cost + '</span></button>';
    }
    html += '</div></div>';

    // 食谱
    html += '<div class="kitchen-section"><div class="kitchen-title">📖 食谱</div><div class="recipe-list">';
    for (var r = 0; r < RECIPES.length; r++) {
        var recipe = RECIPES[r];
        var ingNames = recipe.ingredients.map(function(id) {
            for (var x = 0; x < DEFAULT_INGREDIENTS.length; x++) {
                if (DEFAULT_INGREDIENTS[x].id === id) return DEFAULT_INGREDIENTS[x].name;
            }
            return id;
        }).join(' + ');
        var attrStr = '';
        if (recipe.attrs) {
            var attrLabels = { intelligence: '🧠', stamina: '💪', charisma: '✨', creativity: '🎨' };
            for (var a in recipe.attrs) {
                if (recipe.attrs[a]) attrStr += attrLabels[a] + '+' + recipe.attrs[a] + ' ';
            }
        }
        html += '<div class="recipe-item">' +
            '<div class="recipe-name">' + recipe.name + '</div>' +
            '<div class="recipe-info">🍖+' + recipe.satiety + ' ' + attrStr + '</div>' +
            '<div class="recipe-ingredients">需要：' + ingNames + '</div>' +
            '<button class="recipe-craft-btn" onclick="doCraft(' + r + ')">制作</button>' +
            '</div>';
    }
    html += '</div></div>';

    html += '<div id="kitchenMessage" class="feed-message"></div>';
    panel.innerHTML = html;
}

function doBuyIngredient(ingId) {
    var result = buyIngredient(currentCharId, ingId);
    showKitchenMessage(result.message, result.success);
    if (result.success) renderKitchen();
}

function doCraft(recipeIdx) {
    var result = craftMeal(currentCharId, recipeIdx);
    showKitchenMessage(result.message, result.success);
    if (result.success) renderKitchen();
}

function showKitchenMessage(msg, success) {
    var el = document.getElementById('kitchenMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = 'feed-message ' + (success ? 'success' : 'error');
    setTimeout(function() { if (el) { el.textContent = ''; el.className = 'feed-message'; } }, 3000);
}


// ========== Task 12: 场景地点与世界观系统 ==========

// ===== 12.1 场景地点管理 =====

var DEFAULT_LOCATIONS = [
    { id: 'home', name: '家', description: '温馨的小窝', icon: '🏠', background: '', requires: null },
    { id: 'school', name: '学校', description: '学习知识的地方', icon: '🏫', background: '', requires: { intelligence: 15 } },
    { id: 'park', name: '公园', description: '散步和玩耍', icon: '🌳', background: '', requires: null },
    { id: 'shop', name: '商店', description: '购物的好去处', icon: '🏪', background: '', requires: { charisma: 20 } },
    { id: 'library', name: '图书馆', description: '安静阅读', icon: '📚', background: '', requires: { intelligence: 30 } },
    { id: 'adventure', name: '冒险区域', description: '充满未知的地方', icon: '⚔️', background: '', requires: { stamina: 40, intelligence: 25 } }
];

function getAllLocations(charId) {
    var custom = getPetData(charId, 'custom_locations', []);
    var locReqs = getPetData(charId, 'location_requires', {});
    // 合并默认场景，应用用户自定义的属性要求覆盖
    var defaults = [];
    for (var i = 0; i < DEFAULT_LOCATIONS.length; i++) {
        var loc = Object.assign({}, DEFAULT_LOCATIONS[i]);
        if (locReqs[loc.id]) {
            loc.requires = locReqs[loc.id];
        }
        defaults.push(loc);
    }
    return defaults.concat(custom);
}

function addLocation(charId, locationData) {
    var custom = getPetData(charId, 'custom_locations', []);
    locationData.id = 'loc_' + Date.now();
    custom.push(locationData);
    setPetData(charId, 'custom_locations', custom);
}

function editLocation(charId, locationId, locationData) {
    var custom = getPetData(charId, 'custom_locations', []);
    for (var i = 0; i < custom.length; i++) {
        if (custom[i].id === locationId) {
            Object.assign(custom[i], locationData);
            break;
        }
    }
    setPetData(charId, 'custom_locations', custom);
}

function deleteLocation(charId, locationId) {
    var custom = getPetData(charId, 'custom_locations', []);
    custom = custom.filter(function(l) { return l.id !== locationId; });
    setPetData(charId, 'custom_locations', custom);
}

function getCurrentLocation(creatureData, schedule) {
    var activity = getCurrentActivity(schedule || getSchedule(creatureData.charId));
    if (activity && activity.locationId) {
        var locations = getAllLocations(creatureData.charId);
        for (var i = 0; i < locations.length; i++) {
            if (locations[i].id === activity.locationId) return locations[i];
        }
    }
    return DEFAULT_LOCATIONS[0]; // 默认：家
}

// ===== 12.2 世界观自定义 =====

var WORLDVIEW_TEMPLATES = [
    { id: 'medieval', name: '🏰 中世纪魔法世界', text: '这是一个充满魔法和骑士的中世纪世界，有龙、精灵和古老的城堡。魔法生物在魔法学院学习咒语，在森林中冒险。',
      locations: [
        { name: '魔法城堡', description: '古老的石砌城堡，充满魔法气息', icon: '🏰' },
        { name: '精灵森林', description: '神秘的古老森林，精灵出没', icon: '🌲' },
        { name: '魔法学院', description: '学习咒语和魔法知识', icon: '🧙' },
        { name: '龙之巢穴', description: '危险但充满宝藏', icon: '🐉' }
      ]
    },
    { id: 'modern', name: '🏙️ 现代都市', text: '这是一个现代都市世界，魔法生物隐藏在人类社会中，白天上学工作，晚上在秘密的魔法社区活动。',
      locations: [
        { name: '秘密魔法咖啡馆', description: '隐藏在都市中的魔法据点', icon: '☕' },
        { name: '屋顶花园', description: '城市高楼上的秘密花园', icon: '🌿' },
        { name: '地下魔法市集', description: '只有魔法生物知道的夜市', icon: '🌙' },
        { name: '都市学校', description: '白天伪装成普通学生', icon: '🏫' }
      ]
    },
    { id: 'scifi', name: '🚀 未来科幻', text: '这是一个未来科幻世界，魔法与科技融合，魔法生物在太空站和虚拟现实中生活学习。',
      locations: [
        { name: '太空站', description: '漂浮在星际间的生活基地', icon: '🛸' },
        { name: '虚拟现实教室', description: '全息投影的学习空间', icon: '💻' },
        { name: '星际花园', description: '种满外星植物的温室', icon: '🪐' },
        { name: '量子实验室', description: '魔法与科技融合的研究所', icon: '⚗️' }
      ]
    },
    { id: 'pastoral', name: '🌾 田园牧歌', text: '这是一个宁静的田园世界，魔法生物在花田和小溪边生活，与自然和谐共处，过着悠闲的日子。',
      locations: [
        { name: '向日葵花田', description: '金色的花海，阳光灿烂', icon: '🌻' },
        { name: '小溪边', description: '清澈的溪水潺潺流过', icon: '🏞️' },
        { name: '蘑菇小屋', description: '可爱的蘑菇形状小房子', icon: '🍄' },
        { name: '果园', description: '四季都有水果的魔法果园', icon: '🍎' }
      ]
    }
];

function getWorldview(charId) {
    return getPetData(charId, 'worldview', null);
}

function saveWorldview(charId, data) {
    setPetData(charId, 'worldview', data);
}

function getWorldviewTemplates() {
    return WORLDVIEW_TEMPLATES;
}

function applyWorldviewTemplate(charId, templateId) {
    for (var i = 0; i < WORLDVIEW_TEMPLATES.length; i++) {
        if (WORLDVIEW_TEMPLATES[i].id === templateId) {
            var tmpl = WORLDVIEW_TEMPLATES[i];
            saveWorldview(charId, { templateId: templateId, customText: tmpl.text });
            // 自动生成配套场景（清除旧的模板场景，保留手动添加的）
            var custom = getPetData(charId, 'custom_locations', []);
            custom = custom.filter(function(l) { return !l.fromTemplate; });
            if (tmpl.locations) {
                for (var j = 0; j < tmpl.locations.length; j++) {
                    var loc = tmpl.locations[j];
                    custom.push({
                        id: 'loc_tmpl_' + templateId + '_' + j,
                        name: loc.name,
                        description: loc.description,
                        icon: loc.icon || '📍',
                        background: '',
                        fromTemplate: templateId
                    });
                }
            }
            setPetData(charId, 'custom_locations', custom);
            return true;
        }
    }
    return false;
}


// ========== Task 14: 商店联动与饰品换装系统 ==========

// ===== 14.2 饰品栏解锁与换装 =====

function getUnlockedSlots(growthStage) {
    var slots = [];
    var stageIdx = GROWTH_STAGES.indexOf(growthStage);
    if (stageIdx >= 2) { slots.push('head'); slots.push('body'); } // 幼年
    if (stageIdx >= 3) { slots.push('hand'); slots.push('back'); } // 少年
    if (stageIdx >= 4) { slots.push('effect'); } // 成年
    return slots;
}

var SLOT_LABELS = { head: '👒 头部', body: '👕 身体', hand: '🖐️ 手持', back: '🎒 背部', effect: '✨ 特效' };
var SLOT_UNLOCK_STAGE = { head: 'child', body: 'child', hand: 'teen', back: 'teen', effect: 'adult' };

function equipAccessory(charId, slotType, itemId) {
    var creature = loadCreature(charId);
    if (!creature) return;
    if (!creature.equippedAccessories) creature.equippedAccessories = {};
    creature.equippedAccessories[slotType] = itemId;
    saveCreature(charId, creature);
    if (currentCreature && currentCreature.charId === charId) {
        currentCreature = creature;
    }
}

/** 渲染换装面板 */
function renderWardrobe() {
    var panel = document.getElementById('wardrobePanel');
    if (!panel || !currentCreature) return;
    var creature = currentCreature;
    var unlocked = getUnlockedSlots(creature.growthStage);

    var html = '<div class="wardrobe-preview">';
    html += '<div class="wardrobe-preview-wrap">';
    html += '<img class="wardrobe-creature-img" src="' + getCreatureImage(creature) + '" alt="预览">';
    // 在预览中也显示已装备的贴纸
    var previewSlotImages = getPetData(currentCharId, 'slot_images', {});
    var previewSlotPositions = getPetData(currentCharId, 'slot_positions', {});
    var previewOrder = ['back', 'body', 'head', 'hand', 'effect'];
    for (var p = 0; p < previewOrder.length; p++) {
        var ps = previewOrder[p];
        if (!previewSlotImages[ps]) continue;
        var pp = previewSlotPositions[ps] || { x: 50, y: 50, scale: 50, rotate: 0 };
        html += '<img class="accessory-sticker" src="' + previewSlotImages[ps] + '" style="left:' + pp.x + '%;top:' + pp.y + '%;transform:translate(-50%,-50%) scale(' + (pp.scale / 50) + ') rotate(' + (pp.rotate || 0) + 'deg);z-index:' + ((p + 1) * 10) + '">';
    }
    html += '</div>';
    html += '</div>';

    // 饰品栏位 - 每个栏位可上传自定义URL图片，支持贴纸换装
    html += '<div class="wardrobe-section"><div class="kitchen-title">👗 饰品栏位</div>';
    html += '<p class="wardrobe-hint">解锁后可为每个栏位设置图片URL，像贴纸一样贴到形象上</p>';
    html += '<div class="wardrobe-slots">';
    var allSlots = ['head', 'body', 'hand', 'back', 'effect'];
    var slotImages = getPetData(currentCharId, 'slot_images', {});
    for (var i = 0; i < allSlots.length; i++) {
        var slot = allSlots[i];
        var isUnlocked = unlocked.indexOf(slot) >= 0;
        var currentUrl = slotImages[slot] || '';

        html += '<div class="wardrobe-slot ' + (isUnlocked ? '' : 'locked') + '">' +
            '<div class="slot-label">' + SLOT_LABELS[slot] + '</div>';
        if (!isUnlocked) {
            html += '<div class="slot-locked">🔒 ' + STAGE_LABELS[SLOT_UNLOCK_STAGE[slot]] + '期解锁</div>';
        } else if (currentUrl) {
            // 已有贴纸 — 显示预览 + 调整/替换/移除
            html += '<div class="slot-preview"><img src="' + currentUrl + '" alt="' + slot + '" style="max-width:60px;max-height:60px;border-radius:4px"></div>' +
                '<div class="slot-actions">' +
                '<button class="slot-item-btn" onclick="openStickerEditor(\'' + slot + '\')">📐 调整位置</button>' +
                '<button class="slot-item-btn unequip" onclick="clearSlotImage(\'' + slot + '\')">🗑️ 移除</button>' +
                '</div>' +
                '<details class="slot-replace"><summary>替换图片</summary>' +
                '<input type="text" id="slotUrl_' + slot + '" value="' + currentUrl + '" placeholder="https://..." class="schedule-input" style="width:100%">' +
                '<button class="slot-item-btn" onclick="saveSlotImage(\'' + slot + '\')" style="margin-top:4px">保存</button>' +
                '</details>';
        } else {
            // 空栏位 — 输入URL
            html += '<input type="text" id="slotUrl_' + slot + '" value="" placeholder="输入图片URL https://..." class="schedule-input" style="width:100%">' +
                '<button class="slot-item-btn" onclick="saveSlotImage(\'' + slot + '\')" style="margin-top:4px">添加贴纸</button>';
        }
        html += '</div>';
    }
    html += '</div></div>';

    // 自定义形象（URL方式）
    html += '<div class="wardrobe-section"><div class="kitchen-title">🎨 自定义形象</div>';
    html += '<p class="wardrobe-hint">输入图片URL来替换各阶段的形象</p>';
    html += '<div class="custom-image-list">';
    var customImages = getPetData(currentCharId, 'custom_images', {});
    for (var s = 0; s < GROWTH_STAGES.length; s++) {
        var stage = GROWTH_STAGES[s];
        var hasCustom = !!customImages[stage];
        html += '<div class="custom-image-item">' +
            '<span>' + STAGE_LABELS[stage] + ' ' + (hasCustom ? '✅' : '') + '</span>' +
            '<input type="text" id="imgUrl_' + stage + '" value="' + (customImages[stage] || '') + '" placeholder="https://..." class="schedule-input" style="flex:1">' +
            '<button class="slot-item-btn" onclick="setStageImageUrl(\'' + stage + '\', document.getElementById(\'imgUrl_' + stage + '\').value)">保存</button>';
        if (hasCustom) {
            html += '<button class="slot-item-btn unequip" onclick="clearStageImage(\'' + stage + '\')">清除</button>';
        }
        html += '</div>';
    }
    html += '</div></div>';

    panel.innerHTML = html;
}

function doEquip(slot, itemId) {
    equipAccessory(currentCharId, slot, itemId);
    renderWardrobe();
    renderHome();
}

function saveSlotImage(slot) {
    var input = document.getElementById('slotUrl_' + slot);
    if (!input) return;
    var url = input.value.trim();
    if (!url) return;
    var slotImages = getPetData(currentCharId, 'slot_images', {});
    var isNew = !slotImages[slot];
    slotImages[slot] = url;
    setPetData(currentCharId, 'slot_images', slotImages);
    // 新贴纸设置默认居中位置
    if (isNew) {
        var slotPositions = getPetData(currentCharId, 'slot_positions', {});
        if (!slotPositions[slot]) {
            var defaults = { head: {x:50,y:15}, body: {x:50,y:50}, hand: {x:80,y:55}, back: {x:20,y:45}, effect: {x:50,y:50} };
            var d = defaults[slot] || {x:50,y:50};
            slotPositions[slot] = { x: d.x, y: d.y, scale: 50, rotate: 0 };
            setPetData(currentCharId, 'slot_positions', slotPositions);
        }
    }
    renderWardrobe();
    renderHome();
    // 新贴纸自动打开编辑器
    if (isNew) {
        setTimeout(function() { openStickerEditor(slot); }, 100);
    }
}

function clearSlotImage(slot) {
    var slotImages = getPetData(currentCharId, 'slot_images', {});
    delete slotImages[slot];
    setPetData(currentCharId, 'slot_images', slotImages);
    // 也清除位置数据
    var slotPositions = getPetData(currentCharId, 'slot_positions', {});
    delete slotPositions[slot];
    setPetData(currentCharId, 'slot_positions', slotPositions);
    renderWardrobe();
    renderHome();
}

// ===== 贴纸位置编辑器 =====

var _stickerEditorSlot = null;
var _stickerDragging = false;
var _stickerStartX = 0;
var _stickerStartY = 0;
var _stickerStartLeft = 0;
var _stickerStartTop = 0;

function openStickerEditor(slot) {
    _stickerEditorSlot = slot;
    var slotImages = getPetData(currentCharId, 'slot_images', {});
    var slotPositions = getPetData(currentCharId, 'slot_positions', {});
    var url = slotImages[slot];
    if (!url) return;

    var pos = slotPositions[slot] || { x: 50, y: 50, scale: 50, rotate: 0 };

    // 创建编辑器弹窗
    var overlay = document.getElementById('stickerEditorModal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'stickerEditorModal';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
    }

    var creatureImgSrc = getCreatureImage(currentCreature);

    overlay.innerHTML = '<div class="sticker-editor-card">' +
        '<div class="sticker-editor-title">' + SLOT_LABELS[slot] + ' — 拖拽贴纸调整位置</div>' +
        '<div class="sticker-canvas" id="stickerCanvas">' +
            '<img class="sticker-base-img" src="' + creatureImgSrc + '" alt="base">' +
            '<img class="sticker-draggable" id="stickerDraggable" src="' + url + '" ' +
                'style="left:' + pos.x + '%;top:' + pos.y + '%;transform:translate(-50%,-50%) scale(' + (pos.scale / 50) + ') rotate(' + (pos.rotate || 0) + 'deg)">' +
        '</div>' +
        '<div class="sticker-controls">' +
            '<div class="sticker-control-row">' +
                '<label>📏 大小</label>' +
                '<input type="range" id="stickerScale" min="10" max="150" value="' + pos.scale + '" oninput="onStickerSlider()">' +
                '<span id="stickerScaleVal">' + pos.scale + '</span>' +
            '</div>' +
            '<div class="sticker-control-row">' +
                '<label>🔄 旋转</label>' +
                '<input type="range" id="stickerRotate" min="-180" max="180" value="' + (pos.rotate || 0) + '" oninput="onStickerSlider()">' +
                '<span id="stickerRotateVal">' + (pos.rotate || 0) + '°</span>' +
            '</div>' +
        '</div>' +
        '<div class="sticker-editor-actions">' +
            '<button class="modal-btn confirm" onclick="saveStickerPosition()">✅ 保存</button>' +
            '<button class="modal-btn" onclick="closeStickerEditor()">取消</button>' +
        '</div>' +
    '</div>';

    overlay.style.display = 'flex';

    // 绑定拖拽事件
    setTimeout(function() {
        var draggable = document.getElementById('stickerDraggable');
        if (!draggable) return;
        draggable.addEventListener('mousedown', onStickerDragStart);
        draggable.addEventListener('touchstart', onStickerDragStart, { passive: false });
        document.addEventListener('mousemove', onStickerDragMove);
        document.addEventListener('touchmove', onStickerDragMove, { passive: false });
        document.addEventListener('mouseup', onStickerDragEnd);
        document.addEventListener('touchend', onStickerDragEnd);
    }, 50);
}

function closeStickerEditor() {
    var overlay = document.getElementById('stickerEditorModal');
    if (overlay) overlay.style.display = 'none';
    _stickerEditorSlot = null;
    _stickerDragging = false;
    // 清理事件
    document.removeEventListener('mousemove', onStickerDragMove);
    document.removeEventListener('touchmove', onStickerDragMove);
    document.removeEventListener('mouseup', onStickerDragEnd);
    document.removeEventListener('touchend', onStickerDragEnd);
}

function onStickerDragStart(e) {
    e.preventDefault();
    _stickerDragging = true;
    var touch = e.touches ? e.touches[0] : e;
    _stickerStartX = touch.clientX;
    _stickerStartY = touch.clientY;
    var el = document.getElementById('stickerDraggable');
    _stickerStartLeft = parseFloat(el.style.left);
    _stickerStartTop = parseFloat(el.style.top);
}

function onStickerDragMove(e) {
    if (!_stickerDragging) return;
    e.preventDefault();
    var touch = e.touches ? e.touches[0] : e;
    var canvas = document.getElementById('stickerCanvas');
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var dx = ((touch.clientX - _stickerStartX) / rect.width) * 100;
    var dy = ((touch.clientY - _stickerStartY) / rect.height) * 100;
    var newX = Math.max(0, Math.min(100, _stickerStartLeft + dx));
    var newY = Math.max(0, Math.min(100, _stickerStartTop + dy));

    var el = document.getElementById('stickerDraggable');
    el.style.left = newX + '%';
    el.style.top = newY + '%';
    updateStickerTransform();
}

function onStickerDragEnd() {
    _stickerDragging = false;
}

function onStickerSlider() {
    var scaleVal = document.getElementById('stickerScale').value;
    var rotateVal = document.getElementById('stickerRotate').value;
    document.getElementById('stickerScaleVal').textContent = scaleVal;
    document.getElementById('stickerRotateVal').textContent = rotateVal + '°';
    updateStickerTransform();
}

function updateStickerTransform() {
    var el = document.getElementById('stickerDraggable');
    if (!el) return;
    var scale = document.getElementById('stickerScale').value / 50;
    var rotate = document.getElementById('stickerRotate').value;
    el.style.transform = 'translate(-50%,-50%) scale(' + scale + ') rotate(' + rotate + 'deg)';
}

function saveStickerPosition() {
    var slot = _stickerEditorSlot;
    if (!slot) return;
    var el = document.getElementById('stickerDraggable');
    if (!el) return;

    var pos = {
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
        scale: parseInt(document.getElementById('stickerScale').value),
        rotate: parseInt(document.getElementById('stickerRotate').value)
    };

    var slotPositions = getPetData(currentCharId, 'slot_positions', {});
    slotPositions[slot] = pos;
    setPetData(currentCharId, 'slot_positions', slotPositions);

    closeStickerEditor();
    renderHome();
    renderWardrobe();
}

function getAppearanceDescription(charId) {
    var slotImages = getPetData(charId, 'slot_images', {});
    var parts = [];
    if (slotImages.head) parts.push('头部饰品');
    if (slotImages.body) parts.push('身体饰品');
    if (slotImages.hand) parts.push('手持物品');
    if (slotImages.back) parts.push('背部饰品');
    if (slotImages.effect) parts.push('特效装饰');
    return parts.length > 0 ? '佩戴了：' + parts.join('、') : '';
}

// ===== 魔法生物人设 =====

function getPersona(charId) {
    return getPetData(charId, 'persona', '');
}

function savePersona(charId, text) {
    setPetData(charId, 'persona', text);
}

// ===== 14.3 自定义形象（URL方式） =====

function setStageImageUrl(stage, url) {
    if (!url || !url.trim()) return;
    url = url.trim();
    var customImages = getPetData(currentCharId, 'custom_images', {});
    customImages[stage] = url;
    setPetData(currentCharId, 'custom_images', customImages);
    renderWardrobe();
    renderHome();
}

function clearStageImage(stage) {
    var customImages = getPetData(currentCharId, 'custom_images', {});
    delete customImages[stage];
    setPetData(currentCharId, 'custom_images', customImages);
    renderWardrobe();
    renderHome();
}


// ========== Task 15: 趣闻生成与日记系统 ==========

// ===== 15.1 实时趣闻生成 =====

function canGenerateAnecdote(charId) {
    var lastTime = getPetData(charId, 'last_anecdote_time', 0);
    return (Date.now() - lastTime) >= 10 * 60 * 1000; // 10分钟
}

async function generateAnecdote(creatureData) {
    var charId = creatureData.charId;
    if (!canGenerateAnecdote(charId)) return null;

    var stageName = STAGE_LABELS[creatureData.growthStage] || creatureData.growthStage;
    var attrs = getAttributes(creatureData);
    var schedule = getSchedule(charId);
    var activity = getCurrentActivity(schedule);
    var location = getCurrentLocation(creatureData, schedule);
    var worldview = getWorldview(charId);
    var wvText = (worldview && worldview.customText) ? worldview.customText : '充满魔法的奇幻世界';

    var prompt = '为魔法生物生成一条趣闻（50字以内）。\n' +
        '名字：' + (creatureData.name || '魔法生物') + '，阶段：' + stageName + '\n' +
        '当前地点：' + location.name + '，活动：' + (activity ? activity.name : '自由活动') + '\n' +
        '世界观：' + wvText + '\n';
    var persona = getPersona(charId);
    if (persona) prompt += '人设：' + persona + '\n';
    prompt += '属性：智力' + attrs.intelligence + ' 体力' + attrs.stamina + ' 魅力' + attrs.charisma + ' 创造力' + attrs.creativity + '\n' +
        '请直接返回趣闻文字，不要JSON格式。';

    var text = '';
    try {
        text = await callPetLLM(prompt, '你是养成游戏趣闻生成器，生成温馨有趣的短趣闻。直接返回文字。', 0.9);
    } catch (e) {
        text = (creatureData.name || '宝宝') + '正在专心活动中~';
    }

    setPetData(charId, 'last_anecdote_time', Date.now());

    // 记录到事件日志
    var logEntry = {
        id: 'anec_' + Date.now(),
        timestamp: Date.now(),
        type: 'anecdote',
        title: '趣闻',
        description: text,
        source: 'anecdote',
        locationId: location.id
    };
    saveEventToLog(charId, logEntry);

    return text;
}

/** 显示趣闻气泡 */
function showAnecdoteBubble(text) {
    var bubble = document.getElementById('charBubble');
    var bubbleText = document.getElementById('charBubbleText');
    if (!bubble || !bubbleText) return;
    bubbleText.textContent = '📖 ' + text;
    bubble.style.display = '';
    setTimeout(function() { bubble.style.display = 'none'; }, 8000);
}

async function onViewAnecdote() {
    if (!currentCreature || !isCreatureAlive(currentCreature)) return;
    var text = await generateAnecdote(currentCreature);
    if (text) showAnecdoteBubble(text);
}

// ===== 15.2 日记系统 =====

async function generateDailyDiary(charId, creatureData) {
    var stageName = STAGE_LABELS[creatureData.growthStage] || creatureData.growthStage;
    var creatureName = creatureData.name || '魔法生物';
    var titles = getPetData(charId, 'titles', { forUser: '主人', forChar: '爸爸/妈妈' });
    var attrs = getAttributes(creatureData);

    // 收集当日上下文
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var todayTs = today.getTime();
    var eventLog = getPetData(charId, 'event_log', []);
    var todayEvents = eventLog.filter(function(e) { return e.timestamp >= todayTs; });
    var mealLog = getPetData(charId, 'meal_log', []);
    var todayMeals = mealLog.filter(function(m) { return m.timestamp >= todayTs; });
    var chatHistory = loadChatHistory(charId);
    var todayChats = chatHistory.filter(function(c) { return c.timestamp >= todayTs; });

    var evtStr = todayEvents.map(function(e) { return e.title; }).join('、') || '没什么特别的事';
    var mealStr = todayMeals.map(function(m) { return m.item || m.mealType; }).join('、') || '没怎么吃东西';
    var chatCount = todayChats.length;

    var styleGuide = '';
    switch (creatureData.growthStage) {
        case 'baby': styleGuide = '用非常简单的词汇，像婴儿一样。'; break;
        case 'child': styleGuide = '用童趣的语言，像小孩子写日记。'; break;
        case 'teen': styleGuide = '用青春期少年的口吻，有时酷酷的有时感性。'; break;
        case 'adult': styleGuide = '用成熟温柔的叙述方式。'; break;
        default: styleGuide = '用可爱的语气。';
    }

    var prompt = '你是魔法生物「' + creatureName + '」，请以第一人称写一篇今天的日记（100字以内）。\n' +
        '阶段：' + stageName + '\n';
    var persona = getPersona(charId);
    if (persona) prompt += '人设：' + persona + '\n';
    prompt += '今天发生的事：' + evtStr + '\n' +
        '今天吃了：' + mealStr + '\n' +
        '和' + titles.forUser + '聊了' + chatCount + '次天\n' +
        '属性：智力' + attrs.intelligence + ' 体力' + attrs.stamina + '\n' +
        '称呼用户为「' + titles.forUser + '」，称呼CHAR为「' + titles.forChar + '」\n' +
        '写作风格：' + styleGuide + '\n直接返回日记内容。';

    try {
        return await callPetLLM(prompt, '你是一只可爱的魔法生物在写日记。用中文，保持角色扮演。', 0.8);
    } catch (e) {
        return '今天是平静的一天。' + titles.forUser + '陪着我，我很开心。';
    }
}

async function generateWeeklySummary(charId, creatureData) {
    var diaries = getPetData(charId, 'diary', []);
    var weekDiaries = diaries.filter(function(d) {
        return (Date.now() - d.timestamp) < 7 * 24 * 60 * 60 * 1000;
    });
    var summaryText = weekDiaries.map(function(d) { return d.content.slice(0, 30); }).join('；');

    try {
        return await callPetLLM(
            '请根据以下日记摘要，以魔法生物的口吻写一段周总结（80字以内）：\n' + summaryText,
            '你是一只魔法生物在写周总结。用中文。', 0.7
        );
    } catch (e) {
        return '这一周过得很充实呢~';
    }
}

async function checkDiaryGeneration(charId, creatureData) {
    // 不再自动生成，改为用户手动触发
    // 保留此函数以兼容轮询调用，但不做任何事
    return;
}

// 用户手动生成日记
async function manualGenerateDiary() {
    if (!currentCreature || !currentCreature.alive) return;
    if (currentCreature.growthStage === 'egg') return;

    var charId = currentCharId;
    var todayStr = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    var lastDiary = getPetData(charId, 'last_diary_date', '');
    if (lastDiary === todayStr) {
        alert('今天已经写过日记/周总结了哦~');
        return;
    }

    var age = getCreatureAge(currentCreature);
    var isWeeklyDay = age > 0 && age % 7 === 0;
    var diaries = getPetData(charId, 'diary', []);

    // 显示加载状态
    var btn = document.getElementById('diaryGenBtn');
    if (btn) { btn.disabled = true; btn.textContent = '✍️ 生成中...'; }

    try {
        if (isWeeklyDay) {
            // 周总结日：只生成周总结，不生成日记（省token）
            var weekly = await generateWeeklySummary(charId, currentCreature);
            diaries.unshift({
                id: 'weekly_' + Date.now(),
                timestamp: Date.now(),
                type: 'weekly',
                content: weekly,
                stage: currentCreature.growthStage
            });
        } else {
            // 普通日：生成日记
            var content = await generateDailyDiary(charId, currentCreature);
            diaries.unshift({
                id: 'diary_' + Date.now(),
                timestamp: Date.now(),
                type: 'daily',
                content: content,
                stage: currentCreature.growthStage
            });
        }

        if (diaries.length > 200) diaries = diaries.slice(0, 200);
        setPetData(charId, 'diary', diaries);
        setPetData(charId, 'last_diary_date', todayStr);
        renderDiary();
    } catch (e) {
        alert('生成失败：' + (e.message || '未知错误'));
    }

    if (btn) { btn.disabled = false; btn.textContent = isWeeklyDay ? '📋 生成周总结' : '✍️ 写今天的日记'; }
}

// ===== 15.3 日记本 UI =====

function getDiaryEntries(charId) {
    return getPetData(charId, 'diary', []);
}

function renderDiary() {
    var panel = document.getElementById('diaryPanel');
    if (!panel) return;
    var entries = getDiaryEntries(currentCharId);

    var html = '';

    // 手动生成按钮
    if (currentCreature && currentCreature.alive && currentCreature.growthStage !== 'egg') {
        var todayStr = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        var lastDiary = getPetData(currentCharId, 'last_diary_date', '');
        var alreadyDone = lastDiary === todayStr;
        var age = getCreatureAge(currentCreature);
        var isWeeklyDay = age > 0 && age % 7 === 0;
        var btnLabel = alreadyDone ? '✅ 今天已写过' : (isWeeklyDay ? '📋 生成周总结' : '✍️ 写今天的日记');

        html += '<div class="diary-gen-bar">' +
            '<button class="action-btn" id="diaryGenBtn" onclick="manualGenerateDiary()"' + (alreadyDone ? ' disabled' : '') + '>' +
            '<span class="action-label">' + btnLabel + '</span></button>';
        if (isWeeklyDay && !alreadyDone) {
            html += '<span class="diary-gen-hint">🎉 第' + age + '天，今天是周总结日！</span>';
        }
        html += '</div>';
    }

    if (!entries || entries.length === 0) {
        html += '<div class="pet-empty"><div class="pet-empty-icon">📔</div><p>日记本还是空的~<br>点击上方按钮让宝宝写日记吧</p></div>';
        panel.innerHTML = html;
        return;
    }
    html += '<div class="diary-timeline">';
    for (var i = 0; i < entries.length; i++) {
        var d = entries[i];
        var dateStr = new Date(d.timestamp).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
        var typeLabel = d.type === 'weekly' ? '📋 周总结' : (d.type === 'monthly' ? '📊 月度回忆' : '📝 日记');
        var stageLabel = STAGE_LABELS[d.stage] || '';
        html += '<div class="diary-entry ' + (d.type || 'daily') + '">' +
            '<div class="diary-date">' + dateStr + ' <span class="diary-type">' + typeLabel + '</span> <span class="diary-stage">' + stageLabel + '</span></div>' +
            '<div class="diary-content">' + (d.content || '') + '</div>' +
            '</div>';
    }
    html += '</div>';
    panel.innerHTML = html;
}


// ========== Task 16: 称呼自定义与 CHAR 共同养育 ==========

// ===== 16.1 称呼自定义 =====

function getTitles(charId) {
    return getPetData(charId, 'titles', { forUser: '主人', forChar: '爸爸/妈妈' });
}

function saveTitles(charId, titles) {
    if (titles.forUser && titles.forUser.length > 10) titles.forUser = titles.forUser.slice(0, 10);
    if (titles.forChar && titles.forChar.length > 10) titles.forChar = titles.forChar.slice(0, 10);
    setPetData(charId, 'titles', titles);
}

// ===== 16.2 CHAR 共同养育系统 =====

/**
 * CHAR 每日自动执行 1-2 次养育动作
 */
async function executeCharAction(charId, creatureData) {
    if (!creatureData || !creatureData.alive) return;
    if (creatureData.growthStage === 'egg') return;

    var lastCharAction = getPetData(charId, 'last_char_action', 0);
    var elapsed = Date.now() - lastCharAction;
    var charInterval = getCharActionInterval(creatureData);
    if (elapsed < charInterval) return; // 魅力影响频率

    var actions = ['feed', 'chat', 'companion'];
    var action = actions[Math.floor(Math.random() * actions.length)];
    var charName = '';
    var contacts = getStorageJSON('vibe_contacts', []);
    for (var i = 0; i < contacts.length; i++) {
        if (String(contacts[i].id) === String(charId)) {
            charName = contacts[i].nickname || contacts[i].name;
            break;
        }
    }
    if (!charName) charName = 'CHAR';
    var titles = getTitles(charId);
    var creatureName = creatureData.name || '魔法生物';
    var description = '';

    if (action === 'feed') {
        // CHAR 自动喂食
        if (checkPoints(charId, 5)) {
            deductPoints(charId, 5);
            updateSatiety(creatureData, 15);
            updateMood(creatureData, 2);
            description = titles.forChar + '给' + creatureName + '喂了一份爱心小食~';
        } else {
            description = titles.forChar + '想喂' + creatureName + '，但积分不够了...';
        }
    } else if (action === 'chat') {
        // CHAR 自动对话
        try {
            var persona = getPersona(charId);
            var personaHint = persona ? '（这只魔法生物的人设：' + persona + '）' : '';
            var prompt = '你是' + charName + '，一个温柔的养育者。请对你养育的魔法生物「' + creatureName + '」说一句温暖的话（30字以内）。' + personaHint;
            var reply = await callPetLLM(prompt, '你是一个温柔的养育者，用中文说一句简短温暖的话。', 0.8);
            description = titles.forChar + '对' + creatureName + '说：「' + reply + '」';
            saveChatMessage(charId, { role: 'char', content: reply, timestamp: Date.now() });
        } catch (e) {
            description = titles.forChar + '温柔地和' + creatureName + '聊了会天~';
        }
        updateMood(creatureData, 3);
    } else {
        // CHAR 陪伴
        updateMood(creatureData, 5);
        updateHP(creatureData, 1);
        description = titles.forChar + '陪' + creatureName + '玩了一会儿，' + creatureName + '很开心！';
    }

    saveCreature(charId, creatureData);
    setPetData(charId, 'last_char_action', Date.now());

    // 记录到事件日志
    saveEventToLog(charId, {
        id: 'char_' + Date.now(),
        timestamp: Date.now(),
        type: 'char_action',
        title: titles.forChar + '的养育',
        description: description,
        source: 'char'
    });

    // 显示 CHAR 评论气泡
    showCharBubble(description);
}

function showCharBubble(text) {
    var bubble = document.getElementById('charBubble');
    var bubbleText = document.getElementById('charBubbleText');
    if (!bubble || !bubbleText) return;
    bubbleText.textContent = '💕 ' + text;
    bubble.style.display = '';
    setTimeout(function() { bubble.style.display = 'none'; }, 5000);
}

/**
 * 用户操作后 30% 概率生成 CHAR 反应
 */
async function maybeGenerateCharReaction(charId, actionType) {
    if (Math.random() > 0.3) return;
    var titles = getTitles(charId);
    var creatureName = currentCreature ? (currentCreature.name || '魔法生物') : '魔法生物';

    var reactions = {
        feed: [titles.forChar + '：「吃饱了吗？要多吃点哦~」', titles.forChar + '：「' + creatureName + '好乖，好好吃饭~」'],
        chat: [titles.forChar + '：「你们聊什么呢？」', titles.forChar + '：「' + creatureName + '今天话好多呀~」'],
        play: [titles.forChar + '：「玩得开心吗？」', titles.forChar + '：「注意安全哦~」']
    };
    var pool = reactions[actionType] || reactions.play;
    var text = pool[Math.floor(Math.random() * pool.length)];
    showCharBubble(text);
}


// ========== Task 18: 设置面板 ==========

function renderSettings() {
    var panel = document.getElementById('settingsPanel');
    if (!panel) return;
    var charId = currentCharId;
    var creature = currentCreature;

    var html = '';

    // 改名
    if (creature && creature.alive) {
        html += '<div class="settings-section">' +
            '<div class="settings-title">✏️ 改名</div>' +
            '<div class="settings-row"><input type="text" id="settRename" value="' + (creature.name || '') + '" maxlength="12" class="schedule-input" placeholder="1-12个字符">' +
            '<button class="action-btn" onclick="doRename()" style="flex-shrink:0"><span class="action-label">确认</span></button></div>' +
            '</div>';
    }

    // 称呼配置
    var titles = getTitles(charId);
    html += '<div class="settings-section">' +
        '<div class="settings-title">💬 称呼配置</div>' +
        '<div class="settings-row"><label>生物对 USER 的称呼</label><input type="text" id="settTitleUser" value="' + (titles.forUser || '主人') + '" maxlength="10" class="schedule-input"></div>' +
        '<div class="settings-row"><label>生物对 CHAR 的称呼</label><input type="text" id="settTitleChar" value="' + (titles.forChar || '爸爸/妈妈') + '" maxlength="10" class="schedule-input"></div>' +
        '<button class="action-btn" onclick="doSaveTitles()" style="width:100%;margin-top:8px"><span class="action-label">保存称呼</span></button>' +
        '</div>';

    // 魔法生物人设
    var persona = getPersona(charId);
    html += '<div class="settings-section">' +
        '<div class="settings-title">🧬 魔法生物人设</div>' +
        '<p class="settings-hint">定义你的魔法生物是什么物种、性格、特点等，会影响所有对话和事件生成</p>' +
        '<textarea id="settPersona" class="schedule-input" rows="4" placeholder="例：一只粉色的小龙，性格胆小但好奇心很强，喜欢收集闪闪发光的东西，害怕打雷...">' + (persona || '') + '</textarea>' +
        '<button class="action-btn" onclick="doSavePersona()" style="width:100%;margin-top:8px"><span class="action-label">保存人设</span></button>' +
        '</div>';

    // 成长阶段天数配置
    var stageConfig = getStageConfig(charId);
    html += '<div class="settings-section">' +
        '<div class="settings-title">⏳ 成长阶段天数</div>';
    var editableStages = ['egg', 'baby', 'child', 'teen'];
    for (var i = 0; i < editableStages.length; i++) {
        var st = editableStages[i];
        html += '<div class="settings-row"><label>' + STAGE_LABELS[st] + '</label>' +
            '<input type="number" id="settStage_' + st + '" value="' + (stageConfig[st] || 1) + '" min="1" max="365" class="schedule-input" style="width:80px"> 天</div>';
    }
    html += '<button class="action-btn" onclick="doSaveStageConfig()" style="width:100%;margin-top:8px"><span class="action-label">保存阶段配置</span></button>' +
        '</div>';

    // 供餐时间配置
    var mealConfig = getMealTimeConfig(charId);
    html += '<div class="settings-section">' +
        '<div class="settings-title">🍽️ 供餐时间窗口</div>';
    var mealTypes = ['breakfast', 'lunch', 'dinner'];
    for (var j = 0; j < mealTypes.length; j++) {
        var mt = mealTypes[j];
        var mc = mealConfig[mt] || DEFAULT_MEAL_TIMES[mt];
        var startVal = String(mc.startH).padStart(2, '0') + ':' + String(mc.startM).padStart(2, '0');
        var endVal = String(mc.endH).padStart(2, '0') + ':' + String(mc.endM).padStart(2, '0');
        html += '<div class="settings-row"><label>' + MEAL_LABELS[mt] + '</label>' +
            '<input type="time" id="settMeal_' + mt + '_start" value="' + startVal + '" class="schedule-input" style="width:100px">' +
            '<span>至</span>' +
            '<input type="time" id="settMeal_' + mt + '_end" value="' + endVal + '" class="schedule-input" style="width:100px"></div>';
    }
    html += '<button class="action-btn" onclick="doSaveMealConfig()" style="width:100%;margin-top:8px"><span class="action-label">保存餐食配置</span></button>' +
        '</div>';

    // 世界观编辑 + 配套场景（合并显示）
    var worldview = getWorldview(charId);
    var templates = getWorldviewTemplates();
    html += '<div class="settings-section">' +
        '<div class="settings-title">🌍 世界观与场景</div>' +
        '<div class="worldview-templates">';
    for (var t = 0; t < templates.length; t++) {
        var tmpl = templates[t];
        var isActive = worldview && worldview.templateId === tmpl.id;
        html += '<button class="worldview-tmpl-btn ' + (isActive ? 'active' : '') + '" onclick="doApplyWorldview(\'' + tmpl.id + '\')">' + tmpl.name + '</button>';
    }
    html += '</div>' +
        '<textarea id="settWorldview" class="schedule-input" rows="3" placeholder="自定义世界观描述...">' + ((worldview && worldview.customText) || '') + '</textarea>' +
        '<button class="action-btn" onclick="doSaveWorldview()" style="width:100%;margin-top:8px"><span class="action-label">保存世界观</span></button>';

    // 场景列表（在世界观下方）
    var locations = getAllLocations(charId);
    html += '<div class="settings-subtitle">📍 配套场景</div>' +
        '<div class="location-list">';
    for (var l = 0; l < locations.length; l++) {
        var loc = locations[l];
        var isDefault = loc.id.indexOf('loc_') !== 0;
        var isTemplate = loc.fromTemplate;
        var canDelete = !isDefault || isTemplate; // 模板场景和自定义场景都可删除，只有硬编码默认场景不能删
        var locAccess = creature ? checkLocationAccess(creature, loc) : { allowed: true };
        var reqStr = '';
        if (loc.requires) {
            var rp = [];
            var AS = { intelligence: '智力', stamina: '体力', charisma: '魅力', creativity: '创造力' };
            for (var rk2 in loc.requires) {
                if (loc.requires.hasOwnProperty(rk2)) rp.push(AS[rk2] + '≥' + loc.requires[rk2]);
            }
            reqStr = rp.join('、');
        }
        var statusIcon = locAccess.allowed ? '✅' : '🔒';

        html += '<details class="location-detail">' +
            '<summary class="location-summary">' +
                '<span>' + (loc.icon || '📍') + ' ' + loc.name + ' ' + statusIcon + '</span>';
        if (canDelete) {
            // 用 stopPropagation 防止点删除时展开details
            html += '<button class="schedule-del-btn" onclick="event.stopPropagation();doDeleteLocation(\'' + loc.id + '\')">✕</button>';
        }
        html += '</summary>' +
            '<div class="location-detail-body">' +
                '<div class="loc-detail-row">📝 ' + (loc.description || '无描述') + '</div>';
        if (isTemplate) html += '<div class="loc-detail-row" style="opacity:0.5">来源：世界观模板</div>';
        if (reqStr) {
            html += '<div class="loc-detail-row">🎯 准入要求：' + reqStr + '</div>';
        } else {
            html += '<div class="loc-detail-row" style="opacity:0.5">无属性要求（自由进入）</div>';
        }
        if (loc.background) {
            html += '<div class="loc-detail-row">🖼️ <a href="' + loc.background + '" target="_blank" style="color:var(--pet-accent)">查看背景图</a></div>';
        }
        // 属性阈值编辑（所有场景都可以编辑，包括默认场景）
        html += '<div class="loc-detail-row loc-req-edit">' +
            '<span style="font-size:11px;color:var(--pet-text-muted)">设置属性阈值：</span>' +
            '<div class="loc-req-inputs">' +
                '<label>🧠<input type="number" min="0" max="100" value="' + ((loc.requires && loc.requires.intelligence) || 0) + '" id="locReq_' + loc.id + '_intelligence" class="loc-req-input"></label>' +
                '<label>💪<input type="number" min="0" max="100" value="' + ((loc.requires && loc.requires.stamina) || 0) + '" id="locReq_' + loc.id + '_stamina" class="loc-req-input"></label>' +
                '<label>✨<input type="number" min="0" max="100" value="' + ((loc.requires && loc.requires.charisma) || 0) + '" id="locReq_' + loc.id + '_charisma" class="loc-req-input"></label>' +
                '<label>🎨<input type="number" min="0" max="100" value="' + ((loc.requires && loc.requires.creativity) || 0) + '" id="locReq_' + loc.id + '_creativity" class="loc-req-input"></label>' +
            '</div>' +
            '<button class="slot-item-btn" onclick="doSaveLocReq(\'' + loc.id + '\')">保存</button>' +
        '</div>';
        html += '</div></details>';
    }
    html += '</div>' +
        '<div class="settings-row">' +
        '<input type="text" id="settLocName" placeholder="新场景名称" class="schedule-input">' +
        '<input type="text" id="settLocDesc" placeholder="描述" class="schedule-input">' +
        '</div>' +
        '<div class="settings-row"><input type="text" id="settLocBg" placeholder="背景图URL（可选）https://..." class="schedule-input" style="flex:1"></div>' +
        '<button class="action-btn" onclick="doAddLocation()" style="width:100%;margin-top:8px"><span class="action-label">添加场景</span></button>' +
        '</div>';

    html += '<div id="settingsMessage" class="feed-message"></div>';

    // ===== 自定义CSS美化 =====
    var schemes = getPetData(charId, 'css_schemes', []);
    var activeSchemeId = getPetData(charId, 'active_css_scheme', '');
    html += '<div class="settings-section">' +
        '<div class="settings-title">🎨 自定义CSS美化</div>' +
        '<p class="settings-hint">编辑CSS变量和样式来自定义页面外观。默认方案包含所有可修改的变量和注释说明。</p>';

    // 方案选择
    html += '<div class="settings-row" style="gap:6px;flex-wrap:wrap">' +
        '<select id="cssSchemeSelect" class="schedule-input" style="flex:1;min-width:120px" onchange="onCssSchemeChange()">' +
        '<option value="">默认主题</option>';
    for (var si = 0; si < schemes.length; si++) {
        html += '<option value="' + schemes[si].id + '"' + (schemes[si].id === activeSchemeId ? ' selected' : '') + '>' + (schemes[si].name || '未命名') + '</option>';
    }
    html += '</select>' +
        '<button class="slot-item-btn" onclick="doNewCssScheme()">＋新建</button>' +
        '<button class="slot-item-btn" onclick="doDeleteCssScheme()" style="background:rgba(239,68,68,0.2);border-color:var(--pet-hp)">删除</button>' +
        '</div>';

    // CSS编辑器
    var activeCSS = '';
    if (activeSchemeId) {
        for (var sj = 0; sj < schemes.length; sj++) {
            if (schemes[sj].id === activeSchemeId) { activeCSS = schemes[sj].css || ''; break; }
        }
    }
    html += '<textarea id="cssEditor" class="schedule-input css-editor" rows="14" placeholder="在此输入自定义CSS...">' + escapeHtml(activeCSS) + '</textarea>' +
        '<div class="settings-row" style="gap:6px;margin-top:8px">' +
        '<button class="action-btn" onclick="doPreviewCss()" style="flex:1"><span class="action-label">👁️ 预览</span></button>' +
        '<button class="action-btn" onclick="doSaveCssScheme()" style="flex:1"><span class="action-label">💾 保存</span></button>' +
        '<button class="action-btn" onclick="doResetCss()" style="flex:1"><span class="action-label">↩️ 恢复默认</span></button>' +
        '<button class="action-btn" onclick="doLoadDefaultCssTemplate()" style="flex:1"><span class="action-label">📋 加载模板</span></button>' +
        '</div>' +
        '</div>';

    panel.innerHTML = html;
}

function doRename() {
    var name = document.getElementById('settRename').value.trim();
    if (!name || name.length < 1 || name.length > 12) { showSettingsMsg('名称需要1-12个字符', false); return; }
    if (currentCreature) {
        currentCreature.name = name;
        saveCreature(currentCharId, currentCreature);
        renderHome();
        showSettingsMsg('改名成功！', true);
    }
}

function doSaveTitles() {
    var forUser = document.getElementById('settTitleUser').value.trim() || '主人';
    var forChar = document.getElementById('settTitleChar').value.trim() || '爸爸/妈妈';
    saveTitles(currentCharId, { forUser: forUser, forChar: forChar });
    showSettingsMsg('称呼已保存', true);
}

function doSavePersona() {
    var text = document.getElementById('settPersona').value.trim();
    savePersona(currentCharId, text);
    showSettingsMsg(text ? '人设已保存' : '人设已清除', true);
}

function doSaveStageConfig() {
    var config = {};
    var stages = ['egg', 'baby', 'child', 'teen'];
    for (var i = 0; i < stages.length; i++) {
        var val = parseInt(document.getElementById('settStage_' + stages[i]).value);
        config[stages[i]] = (val > 0) ? val : 1;
    }
    config.adult = Infinity;
    saveStageConfig(currentCharId, config);
    showSettingsMsg('阶段配置已保存', true);
}

function doSaveMealConfig() {
    var config = {};
    var types = ['breakfast', 'lunch', 'dinner'];
    for (var i = 0; i < types.length; i++) {
        var startVal = document.getElementById('settMeal_' + types[i] + '_start').value;
        var endVal = document.getElementById('settMeal_' + types[i] + '_end').value;
        if (!startVal || !endVal) continue;
        var sp = startVal.split(':'), ep = endVal.split(':');
        config[types[i]] = { startH: parseInt(sp[0]), startM: parseInt(sp[1]), endH: parseInt(ep[0]), endM: parseInt(ep[1]) };
    }
    setPetData(currentCharId, 'meal_times', config);
    showSettingsMsg('餐食时间已保存', true);
}

function doApplyWorldview(templateId) {
    applyWorldviewTemplate(currentCharId, templateId);
    renderSettings();
    showSettingsMsg('世界观已应用', true);
}

function doSaveWorldview() {
    var text = document.getElementById('settWorldview').value.trim();
    if (!text) { showSettingsMsg('请输入世界观描述', false); return; }
    saveWorldview(currentCharId, { templateId: null, customText: text });
    showSettingsMsg('世界观已保存', true);
}

function doAddLocation() {
    var name = document.getElementById('settLocName').value.trim();
    var desc = document.getElementById('settLocDesc').value.trim();
    var bg = document.getElementById('settLocBg') ? document.getElementById('settLocBg').value.trim() : '';
    if (!name) { showSettingsMsg('请输入场景名称', false); return; }
    addLocation(currentCharId, { name: name, description: desc || '', icon: '📍', background: bg });
    renderSettings();
    showSettingsMsg('场景已添加', true);
}

function doDeleteLocation(locId) {
    // 模板场景也存在 custom_locations 里，deleteLocation 可以处理
    deleteLocation(currentCharId, locId);
    // 也清除该场景的自定义属性要求
    var locReqs = getPetData(currentCharId, 'location_requires', {});
    delete locReqs[locId];
    setPetData(currentCharId, 'location_requires', locReqs);
    renderSettings();
}

function doSaveLocReq(locId) {
    var attrNames = ['intelligence', 'stamina', 'charisma', 'creativity'];
    var requires = {};
    var hasAny = false;
    for (var i = 0; i < attrNames.length; i++) {
        var el = document.getElementById('locReq_' + locId + '_' + attrNames[i]);
        if (!el) continue;
        var val = parseInt(el.value) || 0;
        if (val > 0) {
            requires[attrNames[i]] = val;
            hasAny = true;
        }
    }

    // 对于默认场景，存到单独的 location_requires 覆盖表
    // 对于自定义/模板场景，直接修改 custom_locations 里的 requires
    var isDefaultLoc = locId.indexOf('loc_') !== 0;
    if (isDefaultLoc) {
        // 默认场景 — 存到覆盖表
        var locReqs = getPetData(currentCharId, 'location_requires', {});
        if (hasAny) {
            locReqs[locId] = requires;
        } else {
            delete locReqs[locId];
        }
        setPetData(currentCharId, 'location_requires', locReqs);
        // 同时更新 DEFAULT_LOCATIONS 运行时引用（当前会话内生效）
        for (var d = 0; d < DEFAULT_LOCATIONS.length; d++) {
            if (DEFAULT_LOCATIONS[d].id === locId) {
                DEFAULT_LOCATIONS[d].requires = hasAny ? requires : null;
                break;
            }
        }
    } else {
        // 自定义/模板场景 — 直接修改
        var custom = getPetData(currentCharId, 'custom_locations', []);
        for (var c = 0; c < custom.length; c++) {
            if (custom[c].id === locId) {
                custom[c].requires = hasAny ? requires : null;
                break;
            }
        }
        setPetData(currentCharId, 'custom_locations', custom);
    }
    renderSettings();
    showSettingsMsg('场景属性要求已保存', true);
}

function showSettingsMsg(msg, success) {
    var el = document.getElementById('settingsMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = 'feed-message ' + (success ? 'success' : 'error');
    setTimeout(function() { if (el) { el.textContent = ''; el.className = 'feed-message'; } }, 3000);
}

// ===== HTML转义 =====
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== 自定义CSS美化系统 =====

var PET_DEFAULT_CSS_TEMPLATE = '/* ====== 魔法生物宠物 - 自定义CSS模板 ====== */\n' +
'/* 修改下方变量值即可自定义外观，删除不需要的行即可 */\n\n' +
'/* --- 页面背景 --- */\n' +
'/* --pet-bg-primary: 主背景色（整个页面底色） */\n' +
'/* --pet-bg-secondary: 次要背景色（顶部栏、视图头部） */\n' +
'/* --pet-bg-card: 卡片背景色（按钮、输入框、事件卡片等） */\n' +
'/* --pet-bg-input: 输入框背景色 */\n' +
':root {\n' +
'  --pet-bg-primary: #1a1a2e;\n' +
'  --pet-bg-secondary: #16213e;\n' +
'  --pet-bg-card: #0f3460;\n' +
'  --pet-bg-input: #1a1a3e;\n' +
'}\n\n' +
'/* --- 强调色 --- */\n' +
'/* --pet-accent: 主强调色（按钮高亮、链接、选中态） */\n' +
'/* --pet-accent-hover: 强调色悬停态 */\n' +
':root {\n' +
'  --pet-accent: #e94560;\n' +
'  --pet-accent-hover: #ff6b81;\n' +
'}\n\n' +
'/* --- 文字颜色 --- */\n' +
'/* --pet-text: 主文字色（名称、内容） */\n' +
'/* --pet-text-secondary: 次要文字色（标签、描述） */\n' +
'/* --pet-text-muted: 弱化文字色（提示、时间戳） */\n' +
':root {\n' +
'  --pet-text: #e0e0e0;\n' +
'  --pet-text-secondary: #8892b0;\n' +
'  --pet-text-muted: #5a6380;\n' +
'}\n\n' +
'/* --- 边框 --- */\n' +
'/* --pet-border: 主边框色（卡片、分割线） */\n' +
'/* --pet-border-light: 浅边框色（输入框、按钮） */\n' +
':root {\n' +
'  --pet-border: #2a2a4a;\n' +
'  --pet-border-light: #3a3a5a;\n' +
'}\n\n' +
'/* --- 状态条颜色 --- */\n' +
'/* --pet-satiety: 饱食度进度条颜色（绿色） */\n' +
'/* --pet-satiety-bg: 饱食度进度条背景 */\n' +
'/* --pet-mood: 心情进度条颜色（黄色） */\n' +
'/* --pet-mood-bg: 心情进度条背景 */\n' +
'/* --pet-hp: 生命值进度条颜色（红色） */\n' +
'/* --pet-hp-bg: 生命值进度条背景 */\n' +
'/* --pet-evolution: 进化进度条颜色（紫色） */\n' +
'/* --pet-evolution-bg: 进化进度条背景 */\n' +
':root {\n' +
'  --pet-satiety: #4ade80;\n' +
'  --pet-satiety-bg: #1a3a2a;\n' +
'  --pet-mood: #facc15;\n' +
'  --pet-mood-bg: #3a3a1a;\n' +
'  --pet-hp: #ef4444;\n' +
'  --pet-hp-bg: #3a1a1a;\n' +
'  --pet-evolution: #a78bfa;\n' +
'  --pet-evolution-bg: #2a1a3a;\n' +
'}\n\n' +
'/* --- 金币/积分颜色 --- */\n' +
'/* --pet-gold: 金币图标和数字颜色 */\n' +
':root {\n' +
'  --pet-gold: #fbbf24;\n' +
'}\n\n' +
'/* --- 圆角和阴影 --- */\n' +
'/* --pet-radius: 小圆角（按钮、输入框） */\n' +
'/* --pet-radius-lg: 大圆角（弹窗、卡片） */\n' +
'/* --pet-shadow: 全局阴影 */\n' +
':root {\n' +
'  --pet-radius: 8px;\n' +
'  --pet-radius-lg: 12px;\n' +
'  --pet-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);\n' +
'}\n\n' +
'/* --- 字体 --- */\n' +
'/* --pet-pixel-font: 像素风字体（积分数字等） */\n' +
'/* --pet-font: 主字体 */\n' +
':root {\n' +
'  --pet-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;\n' +
'}\n\n' +
'/* ====== 以下为组件级自定义（可选） ====== */\n\n' +
'/* --- 顶部栏 --- */\n' +
'/* .pet-header { background: ...; border-bottom: ...; } */\n\n' +
'/* --- 积分钱包 --- */\n' +
'/* .pet-wallet { background: ...; border-color: ...; } */\n\n' +
'/* --- 生物形象展示区 --- */\n' +
'/* .creature-stage { background: ...; } */\n' +
'/* .creature-img { border-radius: ...; filter: ...; } */\n\n' +
'/* --- 状态信息区 --- */\n' +
'/* .creature-name { color: ...; font-size: ...; } */\n' +
'/* .creature-meta { color: ...; } */\n\n' +
'/* --- 进度条 --- */\n' +
'/* .stat-bar { background: ...; height: ...; border-radius: ...; } */\n' +
'/* .stat-fill { border-radius: ...; } */\n\n' +
'/* --- 属性面板 --- */\n' +
'/* .attributes-panel { background: ...; } */\n' +
'/* .attr-item { background: ...; border-color: ...; } */\n\n' +
'/* --- 操作按钮 --- */\n' +
'/* .action-btn { background: ...; border-color: ...; border-radius: ...; } */\n' +
'/* .action-btn:hover { background: ...; border-color: ...; } */\n' +
'/* .action-icon { font-size: ...; } */\n' +
'/* .action-label { font-size: ...; color: ...; } */\n\n' +
'/* --- 事件通知卡片 --- */\n' +
'/* .event-card { background: ...; border-color: ...; } */\n' +
'/* .event-choice-btn { background: ...; color: ...; } */\n\n' +
'/* --- CHAR评论气泡 --- */\n' +
'/* .char-bubble { background: ...; border-color: ...; } */\n\n' +
'/* --- 对话视图 --- */\n' +
'/* .chat-messages { background: ...; } */\n' +
'/* .chat-msg.user .chat-bubble { background: ...; } */\n' +
'/* .chat-msg.creature .chat-bubble { background: ...; } */\n' +
'/* .chat-input-bar { background: ...; } */\n' +
'/* .chat-send-btn { background: ...; } */\n\n' +
'/* --- 喂食面板 --- */\n' +
'/* .feed-item { background: ...; border-color: ...; } */\n' +
'/* .feed-item:hover { border-color: ...; } */\n\n' +
'/* --- 日程管理 --- */\n' +
'/* .schedule-item { background: ...; border-color: ...; } */\n\n' +
'/* --- 厨房 --- */\n' +
'/* .kitchen-section { background: ...; } */\n' +
'/* .recipe-card { background: ...; border-color: ...; } */\n\n' +
'/* --- 日记本 --- */\n' +
'/* .diary-entry { background: ...; border-color: ...; } */\n' +
'/* .diary-content { color: ...; font-size: ...; } */\n\n' +
'/* --- 事件日志 --- */\n' +
'/* .event-log-item { background: ...; border-color: ...; } */\n' +
'/* .event-log-item.positive { border-left-color: ...; } */\n' +
'/* .event-log-item.negative { border-left-color: ...; } */\n\n' +
'/* --- 趣闻集 --- */\n' +
'/* .anecdote-item { background: ...; border-color: ...; } */\n\n' +
'/* --- 换装面板 --- */\n' +
'/* .wardrobe-preview { background: ...; } */\n' +
'/* .slot-item { background: ...; border-color: ...; } */\n\n' +
'/* --- 设置面板 --- */\n' +
'/* .settings-section { background: ...; border-color: ...; } */\n' +
'/* .settings-title { color: ...; } */\n\n' +
'/* --- 弹窗/Modal --- */\n' +
'/* .modal-overlay { background: ...; } */\n' +
'/* .modal-card { background: ...; border-color: ...; } */\n' +
'/* .modal-btn.confirm { background: ...; } */\n\n' +
'/* --- 视图头部（子页面返回栏） --- */\n' +
'/* .view-header { background: ...; border-bottom: ...; } */\n' +
'/* .view-back { background: ...; color: ...; } */\n' +
'/* .view-title { color: ...; } */\n\n' +
'/* --- 离线摘要 --- */\n' +
'/* .offline-summary-card { background: ...; border-color: ...; } */\n\n' +
'/* --- 贴纸换装编辑器 --- */\n' +
'/* .sticker-editor-modal { background: ...; } */\n\n' +
'/* --- 场景详情 --- */\n' +
'/* .location-detail { border-color: ...; } */\n' +
'/* .location-summary { background: ...; color: ...; } */\n';

/** 应用自定义CSS到页面 */
function applyPetCustomCSS(cssText) {
    var styleEl = document.getElementById('petCustomStyle');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'petCustomStyle';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = cssText || '';
}

/** 页面加载时恢复已保存的CSS方案 */
function restorePetCSS() {
    if (!currentCharId) return;
    var activeId = getPetData(currentCharId, 'active_css_scheme', '');
    if (!activeId) { applyPetCustomCSS(''); return; }
    var schemes = getPetData(currentCharId, 'css_schemes', []);
    for (var i = 0; i < schemes.length; i++) {
        if (schemes[i].id === activeId) {
            applyPetCustomCSS(schemes[i].css || '');
            return;
        }
    }
    applyPetCustomCSS('');
}

/** 切换CSS方案 */
function onCssSchemeChange() {
    var select = document.getElementById('cssSchemeSelect');
    if (!select) return;
    var schemeId = select.value;
    setPetData(currentCharId, 'active_css_scheme', schemeId);

    if (!schemeId) {
        applyPetCustomCSS('');
        var editor = document.getElementById('cssEditor');
        if (editor) editor.value = '';
        return;
    }
    var schemes = getPetData(currentCharId, 'css_schemes', []);
    for (var i = 0; i < schemes.length; i++) {
        if (schemes[i].id === schemeId) {
            applyPetCustomCSS(schemes[i].css || '');
            var editor = document.getElementById('cssEditor');
            if (editor) editor.value = schemes[i].css || '';
            return;
        }
    }
}

/** 新建CSS方案 */
function doNewCssScheme() {
    var name = prompt('请输入新方案名称：');
    if (!name || !name.trim()) return;
    name = name.trim();
    var schemes = getPetData(currentCharId, 'css_schemes', []);
    var newScheme = { id: 'css_' + Date.now(), name: name, css: '' };
    schemes.push(newScheme);
    setPetData(currentCharId, 'css_schemes', schemes);
    setPetData(currentCharId, 'active_css_scheme', newScheme.id);
    applyPetCustomCSS('');
    renderSettings();
    showSettingsMsg('方案「' + name + '」已创建', true);
}

/** 删除当前CSS方案 */
function doDeleteCssScheme() {
    var activeId = getPetData(currentCharId, 'active_css_scheme', '');
    if (!activeId) { showSettingsMsg('当前是默认主题，无法删除', false); return; }
    var schemes = getPetData(currentCharId, 'css_schemes', []);
    var name = '';
    var newSchemes = [];
    for (var i = 0; i < schemes.length; i++) {
        if (schemes[i].id === activeId) { name = schemes[i].name; }
        else { newSchemes.push(schemes[i]); }
    }
    if (!confirm('确定删除方案「' + name + '」？')) return;
    setPetData(currentCharId, 'css_schemes', newSchemes);
    setPetData(currentCharId, 'active_css_scheme', '');
    applyPetCustomCSS('');
    renderSettings();
    showSettingsMsg('方案已删除', true);
}

/** 预览CSS（不保存） */
function doPreviewCss() {
    var editor = document.getElementById('cssEditor');
    if (!editor) return;
    applyPetCustomCSS(editor.value);
    showSettingsMsg('预览已应用（未保存）', true);
}

/** 保存当前CSS到方案 */
function doSaveCssScheme() {
    var activeId = getPetData(currentCharId, 'active_css_scheme', '');
    if (!activeId) {
        // 没有选中方案，自动创建一个
        var name = prompt('请输入方案名称：');
        if (!name || !name.trim()) return;
        activeId = 'css_' + Date.now();
        var schemes = getPetData(currentCharId, 'css_schemes', []);
        schemes.push({ id: activeId, name: name.trim(), css: '' });
        setPetData(currentCharId, 'css_schemes', schemes);
        setPetData(currentCharId, 'active_css_scheme', activeId);
    }
    var editor = document.getElementById('cssEditor');
    if (!editor) return;
    var css = editor.value;
    var schemes = getPetData(currentCharId, 'css_schemes', []);
    for (var i = 0; i < schemes.length; i++) {
        if (schemes[i].id === activeId) {
            schemes[i].css = css;
            break;
        }
    }
    setPetData(currentCharId, 'css_schemes', schemes);
    applyPetCustomCSS(css);
    renderSettings();
    showSettingsMsg('CSS方案已保存', true);
}

/** 恢复默认（清除自定义CSS） */
function doResetCss() {
    applyPetCustomCSS('');
    setPetData(currentCharId, 'active_css_scheme', '');
    var editor = document.getElementById('cssEditor');
    if (editor) editor.value = '';
    renderSettings();
    showSettingsMsg('已恢复默认主题', true);
}

/** 加载默认CSS模板到编辑器 */
function doLoadDefaultCssTemplate() {
    var editor = document.getElementById('cssEditor');
    if (!editor) return;
    editor.value = PET_DEFAULT_CSS_TEMPLATE;
    showSettingsMsg('模板已加载到编辑器，可修改后保存', true);
}


// ========== Task 19: 全局集成与事件驱动轮询 ==========

// ===== 19.1 事件轮询 =====

var _petPollTimer = null;

function startEventPolling() {
    if (_petPollTimer) clearInterval(_petPollTimer);
    // 事件和趣闻改为手动触发，轮询只保留衰减计算和CHAR养育
    _petPollTimer = setInterval(async function() {
        if (!currentCreature || !isCreatureAlive(currentCreature)) return;

        // 应用实时衰减
        applyRealtimeDecay();

        // 检查 CHAR 养育
        await executeCharAction(currentCharId, currentCreature);

        // 更新主页
        renderHome();
    }, 15 * 60 * 1000); // 15分钟
}


function stopEventPolling() {
    if (_petPollTimer) { clearInterval(_petPollTimer); _petPollTimer = null; }
}

/** 应用实时衰减（饱食度、心情、HP） */
function applyRealtimeDecay() {
    if (!currentCreature || !isCreatureAlive(currentCreature)) return;
    var c = currentCreature;

    // 饱食度衰减
    var hungerDecay = calculateHungerDecay(c.lastSatietyUpdate);
    if (hungerDecay > 0) updateSatiety(c, -hungerDecay);

    // 心情衰减
    var moodDecay = calculateMoodDecay(c.lastMoodUpdate);
    if (moodDecay > 0) updateMood(c, -moodDecay);

    // 饥饿 HP 扣减
    var starvDmg = calculateStarvationDamage(c);
    if (starvDmg > 0) {
        var lastDmg = c._lastStarvDmg || 0;
        var newDmg = starvDmg - lastDmg;
        if (newDmg > 0) {
            updateHP(c, -newDmg);
            c._lastStarvDmg = starvDmg;
        }
    }

    saveCreature(currentCharId, c);

    // 检查死亡
    if (checkDeath(c)) {
        triggerDeath(currentCharId, c);
    }

    // 更新 HP 警告
    updateHPWarning(c);
}

// ===== 19.2 属性面板详情页 =====
// (Already integrated into renderHome via renderAttributes)

// ===== 增强 switchView 以渲染各面板 =====
var _originalSwitchView = switchView;
switchView = function(viewId) {
    _originalSwitchView(viewId);
    switch (viewId) {
        case 'feed': showFeedPanel(); break;
        case 'chat': renderChat(); break;
        case 'wardrobe': renderWardrobe(); break;
        case 'schedule': renderSchedule(); break;
        case 'diary': renderDiary(); break;
        case 'kitchen': renderKitchen(); break;
        case 'event-log': renderEventLog(); break;
        case 'anecdotes': renderAnecdotes(); break;
        case 'settings': renderSettings(); break;
        case 'home': renderHome(); break;
    }
};

// ===== 增强 onCharChange 以集成离线补算和轮询 =====
var _originalOnCharChange = onCharChange;
onCharChange = async function() {
    var select = document.getElementById('charSelect');
    var charId = select.value;
    currentCharId = charId;

    var noCharEl = document.getElementById('noCharPlaceholder');
    var contentEl = document.getElementById('petContent');
    var hatchEl = document.getElementById('hatchEntry');
    var homeEl = document.getElementById('view-home');

    stopEventPolling();

    if (!charId) {
        noCharEl.style.display = '';
        contentEl.style.display = 'none';
        currentCreature = null;
        return;
    }

    noCharEl.style.display = 'none';
    contentEl.style.display = '';

    var creature = loadCreature(charId);

    if (creature) {
        currentCreature = creature;
        hatchEl.style.display = 'none';
        homeEl.style.display = '';

        // 离线补算
        var lastActive = getLastActive(charId);
        if (lastActive && creature.alive) {
            var offlineResult = await processOfflineTime(creature, lastActive);
            if (offlineResult.offlineHours >= 4 && !offlineResult.died) {
                var offlineEvents = await processOfflineEvents(creature, offlineResult.offlineHours);
                if (offlineEvents.length > 0) showOfflineSummary(offlineEvents);
            }
        }

        // 应用实时衰减
        applyRealtimeDecay();

        switchView('home');
        restorePetCSS();
        startEventPolling();
    } else {
        currentCreature = null;
        hatchEl.style.display = '';
        homeEl.style.display = 'none';
        var views = document.querySelectorAll('.pet-view');
        for (var i = 0; i < views.length; i++) views[i].style.display = 'none';
    }

    loadPoints();
    recordLastActive(charId);
};

// ===== 增强 renderHome 以显示当前位置 =====
var _originalRenderHome = renderHome;
renderHome = function() {
    _originalRenderHome();
    if (!currentCreature) return;

    // 更新当前位置显示
    var locEl = document.getElementById('creatureLocation');
    if (locEl) {
        var loc = getCurrentLocation(currentCreature, getSchedule(currentCharId));
        locEl.textContent = (loc.icon || '📍') + ' ' + loc.name;
    }

    // 更新 HP 警告
    updateHPWarning(currentCreature);
};