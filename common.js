// Configuration Definitions
const CONSTRAINTS = {
    player_size: { min: 5, max: 20, step: 1 },
    player_speed: { min: 100, max: 500, step: 10 },
    laser_width: { min: 50, max: 300, step: 10 },
    laser_fade_duration: { min: 0.5, max: 2.0, step: 0.1 },
    damage_duration: { min: 0.05, max: 0.5, step: 0.01 },
    initial_laser_interval: { min: 0.3, max: 2.0, step: 0.1 },
    interval_decrease: { min: 0.0, max: 0.05, step: 0.001 },
    min_laser_interval: { min: 0.2, max: 1.0, step: 0.1 },
    wave_duration: { min: 0.5, max: 2.0, step: 0.1 },
    wave_interval: { min: 0.5, max: 2.0, step: 0.1 },
    start_delay: { min: 0.5, max: 5.0, step: 0.1 },
    difficulty: { min: 0, max: 1, step: 1 },
    aim_time: { min: 0.0, max: 1.0, step: 0.1 },
    small_circle_size: { min: 100, max: 200, step: 1 },
    arc_degree: { min: 30, max: 90, step: 5 },
    cross_road_laser_width: { min: 100, max: 200, step: 1 },
    laser_interval: { min: 0.2, max: 2.0, step: 0.1 },
    small_circle_interval: { min: 0.0, max: 2.0, step: 0.1 },
    arc_fade_duration: { min: 0.5, max: 2.0, step: 0.1 },
    damage_max_alpha: { min: 50, max: 255, step: 1 },
    zoom: { min: 1.0, max: 3.0, step: 0.1 },
    skill_speed: { min: 100, max: 1000, step: 10 },
    skill_radius: { min: 50, max: 200, step: 10 },
    skill_key: { maxLength: 1 }
};

const DEFAULTS = {
    global: {
        start_delay: 2.0,
        background_color: [77, 77, 77],
        player_color: [255, 255, 255],
        laser_color: [255, 0, 0],
        damage_color: [120, 255, 125],
        circle_color: [100, 100, 100],
        safe_color: [0, 255, 0],
        player_size: 10,
        player_speed: 280,
        ui_width: 320,
        win_condition: 8,
        damage_max_alpha: 150,
        skill_speed: 800,
        skill_radius: 100,
        skill_key: '1',
        zoom: 1.0
    },
    pizza: {
        difficulty: 0,
        wave_duration: 1.5,
        wave_interval: 1.0,
        damage_duration: 0.08
    },
    laser: {
        difficulty: 0,
        laser_width: 200,
        laser_fade_duration: 1.0,
        damage_duration: 0.08,
        initial_laser_interval: 0.6,
        interval_decrease: 0.016,
        min_laser_interval: 0.4
    },
    cross_road: {
        difficulty: 0,
        aim_time: 0.1,
        small_circle_size: 200,
        arc_degree: 45,
        cross_road_laser_width: 120,
        laser_fade_duration: 1.0,
        laser_interval: 1.5,
        small_circle_interval: 0,
        damage_duration: 0.08,
        arc_fade_duration: 1.0
    },
    game_mode: 'pizza',
    ui_collapsed: false,
    debug_mode: false
};

const TOOLTIPS = {
    player_size: '玩家圓圈的大小',
    player_speed: '移動速度（每秒像素）',
    laser_width: '雷射光束的寬度',
    laser_fade_duration: '雷射/小圓圈淡入時間',
    damage_duration: '傷害持續時間',
    initial_laser_interval: '初始雷射間隔',
    interval_decrease: '間隔減少速率',
    min_laser_interval: '最小雷射間隔',
    wave_duration: '波次持續時間',
    wave_interval: '波次間隔',
    start_delay: '開始延遲',
    difficulty: '0: 簡單, 1: 困難',
    background_color: '遊戲背景顏色',
    player_color: '玩家顏色',
    laser_color: '雷射顏色',
    damage_color: '披薩/小圓圈/吐息顏色',
    circle_color: '圓圈顏色',
    safe_color: '隊友顏色',
    aim_time: '瞄準時間',
    small_circle_size: '小圓圈大小',
    arc_degree: '吐息角度',
    cross_road_laser_width: '過馬路雷射寬度',
    laser_interval: '雷射發射間隔',
    small_circle_interval: '小圓圈放置間隔',
    arc_fade_duration: '吐息淡入時間',
    damage_max_alpha: '傷害最大透明度',
    zoom: '縮放比例',
    skill_speed: '技能移動速度',
    skill_radius: '技能範圍半徑',
    skill_key: '技能鍵'
};

const WAVE_PATTERNS = {
    '55': [
        [1, 3, 5, 7], [0, 1, 2, 6, 7], [0, 1, 3, 4, 5, 7], [1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 7], [0, 1, 2, 3, 5, 6, 7], [0, 1, 3, 4, 5, 6, 7],
        [0, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7]
    ],
    '15': [
        [1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 6, 7], [0, 1, 2, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 5, 6, 7], [0, 1, 3, 4, 5, 6, 7]
    ]
};

// Utility Functions
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : DEFAULTS.global.player_color;
}

function SetBossAngle() {
    return Math.atan2(playerPos.y - CONFIG.window_height / 2, playerPos.x - CONFIG.window_width / 2) + Math.PI / 2;
}

// Configuration Management
function loadConfig() {
    const savedConfig = localStorage.getItem('boss_dodging_config');
    if (savedConfig) {
        try {
            CONFIG = JSON.parse(savedConfig);
            ['background_color', 'player_color', 'laser_color', 'damage_color', 'circle_color', 'safe_color'].forEach(key => {
                if (typeof CONFIG.global[key] === 'string') {
                    CONFIG.global[key] = CONFIG.global[key].slice(1, -1).split(',').map(Number);
                }
                if (!Array.isArray(CONFIG.global[key]) || CONFIG.global[key].length !== 3) {
                    CONFIG.global[key] = DEFAULTS.global[key];
                }
            });
            ['pizza', 'laser', 'cross_road'].forEach(mode => {
                if (!CONFIG[mode]) CONFIG[mode] = {};
                Object.keys(DEFAULTS[mode]).forEach(key => {
                    if (CONFIG[mode][key] === undefined) {
                        CONFIG[mode][key] = DEFAULTS[mode][key];
                    }
                });
            });
            ['game_mode', 'ui_collapsed', 'debug_mode'].forEach(key => {
                if (CONFIG[key] === undefined) CONFIG[key] = DEFAULTS[key];
            });
            if (CONFIG.global.damage_max_alpha === undefined) {
                CONFIG.global.damage_max_alpha = DEFAULTS.global.damage_max_alpha;
            }
            ['skill_speed', 'skill_radius', 'skill_key', 'zoom'].forEach(key => {
                if (CONFIG.global[key] === undefined) {
                    CONFIG.global[key] = DEFAULTS.global[key];
                }
            });
        } catch (e) {
            CONFIG = JSON.parse(JSON.stringify(DEFAULTS));
        }
    } else {
        CONFIG = JSON.parse(JSON.stringify(DEFAULTS));
    }
    saveConfig();
}

function saveConfig() {
    localStorage.setItem('boss_dodging_config', JSON.stringify(CONFIG));
}

// Damage System
class DamageManager {
    constructor() {
        this.types = {
            laser: {
                create: (data) => ({
                    ...data,
                    time: 0,
                    alpha: 0,
                    reached_full_alpha: false,
                    damage_start_time: null,
                    damage_end_time: null,
                    post_damage: false,
                    caused_damage: false,
                    caused_dodge: false,
                    persistent: data.persistent || false
                }),
                update: (damage, dt, config) => {
                    damage.time += dt;
                    if (damage.time < config.laser_fade_duration) {
                        damage.alpha = map(damage.time, 0, config.laser_fade_duration, 0, config.damage_max_alpha);
                    } else {
                        damage.alpha = config.damage_max_alpha;
                        if (!damage.reached_full_alpha) {
                            damage.reached_full_alpha = true;
                            damage.damage_start_time = damage.time;
                            if (!damage.persistent) {
                                damage.damage_end_time = damage.time + config.damage_duration;
                            }
                        }
                    }
                    if (damage.damage_end_time && damage.time >= damage.damage_end_time && !damage.post_damage) {
                        damage.post_damage = true;

                        if (CONFIG.game_mode === 'laser' && gameState !== 'dead' && !damage.caused_dodge) {
                            dodgeCount++;
                            damage.caused_dodge = true;
                        }
                    }
                    return damage;
                },
                isColliding: (damage, playerPos, config) => {
                    if (!damage.reached_full_alpha) return false;
                    if (damage.axis === 'row') {
                        return damage.segment_start <= playerPos.y && playerPos.y <= damage.segment_end;
                    } else if (damage.axis === 'column') {
                        return damage.segment_start <= playerPos.x && playerPos.x <= damage.segment_end;
                    } else if (damage.axis === 'radial') {
                        const a = damage.start;
                        const b = damage.end;
                        const p = playerPos;
                        const pa = p5.Vector.sub(p, a);
                        const ba = p5.Vector.sub(b, a);
                        const h = constrain(pa.dot(ba) / ba.dot(ba), 0, 1);
                        const dist = p5.Vector.sub(pa, ba.mult(h)).mag();
                        return dist < config.cross_road_laser_width / 2 + config.player_size;
                    }
                    return false;
                },
                draw: (damage, config) => {
                    const alpha = damage.alpha;
                    const color = [...config.laser_color, alpha];
                    if (damage.axis === 'row') {
                        rowLaserSurf.clear();
                        rowLaserSurf.fill(...color);
                        rowLaserSurf.noStroke();
                        rowLaserSurf.rect(0, 0, rowLaserSurf.width, rowLaserSurf.height);
                        image(rowLaserSurf, CONFIG.window_width / 2 - config.circle_radius, damage.segment_start);
                    } else if (damage.axis === 'column') {
                        colLaserSurf.clear();
                        colLaserSurf.fill(...color);
                        colLaserSurf.noStroke();
                        colLaserSurf.rect(0, 0, colLaserSurf.width, colLaserSurf.height);
                        image(colLaserSurf, damage.segment_start, CONFIG.window_height / 2 - config.circle_radius);
                    } else if (damage.axis === 'radial') {
                        radialLaserSurf.clear();
                        radialLaserSurf.fill(...color);
                        radialLaserSurf.noStroke();
                        radialLaserSurf.rect(0, 0, radialLaserSurf.width, radialLaserSurf.height);
                        push();
                        translate(damage.start.x, damage.start.y);
                        rotate(p5.Vector.sub(damage.end, damage.start).heading());
                        image(radialLaserSurf, 0, -config.cross_road_laser_width / 2);
                        pop();
                    }
                }
            },
            small_circle: {
                create: (data) => ({
                    ...data,
                    time: 0,
                    alpha: 0,
                    reached_full_alpha: false,
                    damage_start_time: null,
                    damage_end_time: null,
                    post_damage: false,
                    caused_damage: false
                }),
                update: (damage, dt, config) => {
                    damage.time += dt;
                    if (damage.time < config.laser_fade_duration) {
                        damage.alpha = map(damage.time, 0, config.laser_fade_duration, 0, config.damage_max_alpha);
                    } else {
                        damage.alpha = config.damage_max_alpha;
                        if (!damage.reached_full_alpha) {
                            damage.reached_full_alpha = true;
                            damage.damage_start_time = damage.time;
                            if (!damage.persistent) {
                                damage.damage_end_time = damage.time + config.damage_duration;
                            }
                        }
                    }
                    if (damage.damage_end_time && damage.time >= damage.damage_end_time && !damage.post_damage) {
                        damage.post_damage = true;
                    }
                    return damage;
                },
                isColliding: (damage, playerPos, config) => {
                    //if (!damage.reached_full_alpha)
                    return false;
                    //return playerPos.dist(damage.position) < (damage.size / 2) + config.player_size;
                },
                draw: (damage, config) => {
                    const alpha = damage.alpha;
                    fill(...config.damage_color, alpha);
                    noStroke();
                    circle(damage.position.x, damage.position.y, damage.size);
                }
            },
            arc: {
                create: (data) => ({
                    ...data,
                    time: 0,
                    alpha: 0,
                    reached_full_alpha: false,
                    damage_start_time: null,
                    damage_end_time: null,
                    post_damage: false,
                    caused_damage: false,
                    persistent: data.persistent || false
                }),
                update: (damage, dt, config) => {
                    damage.time += dt;
                    if (damage.time < config.arc_fade_duration) {
                        damage.alpha = map(damage.time, 0, config.arc_fade_duration, 0, config.damage_max_alpha);
                    } else {
                        damage.alpha = config.damage_max_alpha;
                        if (!damage.reached_full_alpha) {
                            damage.reached_full_alpha = true;
                            damage.damage_start_time = damage.time;
                            if (!damage.persistent) {
                                damage.damage_end_time = damage.time + config.damage_duration;
                            }
                        }
                    }
                    if (damage.damage_end_time && damage.time >= damage.damage_end_time && !damage.post_damage) {
                        damage.post_damage = true;
                    }
                    return damage;
                },
                isColliding: (damage, playerPos, config) => {
                    if (!damage.reached_full_alpha) return false;
                    const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                    const dx = playerPos.x - center.x;
                    const dy = playerPos.y - center.y;
                    let playerAngle = Math.atan2(dy, dx);
                    if (playerAngle < 0) playerAngle += 2 * Math.PI;
                    let start = damage.startAngle;
                    let end = damage.endAngle;
                    if (start < 0) start += 2 * Math.PI;
                    if (end < 0) end += 2 * Math.PI;
                    const dist = playerPos.dist(center);
                    if (end < start) end += 2 * Math.PI;
                    if (playerAngle < start) playerAngle += 2 * Math.PI;
                    return playerAngle >= start && playerAngle <= end && dist <= config.circle_radius;
                },
                draw: (damage, config) => {
                    const alpha = damage.alpha;
                    fill(...config.damage_color, alpha);
                    noStroke();
                    const centerX = CONFIG.window_width / 2;
                    const centerY = CONFIG.window_height / 2;
                    arc(centerX, centerY, config.circle_radius * 2, config.circle_radius * 2, damage.startAngle, damage.endAngle);
                }
            }
        };
        this.damages = { laser: [], small_circle: [], arc: [] };
    }

    addDamage(type, data) {
        if (this.types[type]) {
            const damage = this.types[type].create(data);
            this.damages[type].push(damage);
            return damage;
        }
        return null;
    }

    update(dt, config, playerPos) {
        Object.keys(this.damages).forEach(type => {
            if (!this.types[type]) return;
            this.damages[type] = this.damages[type].filter(damage => {
                this.types[type].update(damage, dt, config);
                return damage.time < (damage.persistent ? Infinity : config.laser_fade_duration + config.damage_duration);
            });
        });
    }

    checkCollisions(playerPos, config) {
        return Object.keys(this.damages).some(type => {
            if (!this.types[type]) return false;
            return this.damages[type].some(damage => {
                if (damage.damage_start_time && damage.time >= damage.damage_start_time && (damage.damage_end_time == null || damage.time <= damage.damage_end_time) && !damage.caused_damage) {
                    if (this.types[type].isColliding(damage, playerPos, config)) {
                        damage.caused_damage = true;
                        return true;
                    }
                }
                return false;
            });
        });
    }

    draw(config) {
        Object.keys(this.damages).forEach(type => {
            if (!this.types[type]) return;
            this.damages[type].forEach(damage => this.types[type].draw(damage, config));
        });
    }

    reset() {
        this.damages = { laser: [], small_circle: [], arc: [] };
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.sliders = [];
        this.sliderElements = [];
        this.heartClickCount = 0;
    }

    updateUI() {
        document.querySelectorAll('.ui-panel, .slider-container').forEach(el => el.remove());
        this.sliders = [];
        this.sliderElements = [];

        const uiPanel = document.createElement('div');
        uiPanel.className = `ui-panel ${CONFIG.ui_collapsed ? 'collapsed' : ''}`;
        uiPanel.onclick = (event) => event.stopPropagation();
        document.body.appendChild(uiPanel);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = CONFIG.ui_collapsed ? '▶' : '◀';
        toggleButton.title = CONFIG.ui_collapsed ? '展開面板' : '收起面板';
        toggleButton.onclick = (event) => {
            event.stopPropagation();
            CONFIG.ui_collapsed = !CONFIG.ui_collapsed;
            uiPanel.className = `ui-panel ${CONFIG.ui_collapsed ? 'collapsed' : ''}`;
            toggleButton.textContent = CONFIG.ui_collapsed ? '▶' : '◀';
            toggleButton.title = CONFIG.ui_collapsed ? '展開面板' : '收起面板';
            saveConfig();
        };
        uiPanel.appendChild(toggleButton);

        const panelContent = document.createElement('div');
        panelContent.className = 'panel-content';
        uiPanel.appendChild(panelContent);


        const heartButton = document.createElement('div');
        heartButton.className = `heart-button ${CONFIG.debug_mode ? 'active' : ''}`;
        heartButton.title = '';
        heartButton.onclick = (event) => {
            event.stopPropagation();
            this.heartClickCount++;
            if (this.heartClickCount >= 20) {
                CONFIG.debug_mode = !CONFIG.debug_mode;
                this.heartClickCount = 0;
                heartButton.className = `heart-button ${CONFIG.debug_mode ? 'active' : ''}`;
                saveConfig();
                this.updateUI();
            }
        };
        panelContent.appendChild(heartButton);



        this.sliderElements.push({ button: heartButton, key: 'heart-debug' });




        const modeTabs = document.createElement('div');
        modeTabs.className = 'mode-tabs';
        const modes = ['pizza', 'laser', 'cross_road'];
        const modeLabels = { pizza: '一王披薩', laser: '二王50%', cross_road: '過馬路' };
        modes.forEach(mode => {
            const btn = document.createElement('button');
            btn.className = `mode-button ${CONFIG.game_mode === mode ? 'active' : ''}`;
            btn.textContent = modeLabels[mode];
            btn.onclick = (event) => {
                event.stopPropagation();
                if (CONFIG.game_mode !== mode) {
                    CONFIG.game_mode = mode;
                    CONFIG.circle_radius = mode === 'cross_road' ? 550 : 300;
                    CONFIG.global.zoom = mode === 'cross_road' ? 1.5 : 1.0;
                    saveConfig();
                    updateGraphicsBuffers();
                    resetGameState();
                    this.updateUI();
                }
            };
            modeTabs.appendChild(btn);
            this.sliderElements.push({ button: btn, key: `mode-${mode}` });
        });
        panelContent.appendChild(modeTabs);

        const texttip = document.createElement('div');
        texttip.className = 'section-header';
        texttip.innerHTML = `<span>按 [${CONFIG.global.skill_key}] 鎖鏈跳  滑鼠滾輪縮放 </span>`;
        panelContent.appendChild(texttip);



        const sections = {
            '玩家': ['player_size', 'player_speed', 'skill_speed', 'skill_radius', ...(CONFIG.debug_mode ? ['skill_key'] : [])],
            [CONFIG.game_mode]: MODES[CONFIG.game_mode].ui_settings(),
            '通用': ['start_delay', 'damage_max_alpha', 'zoom'],
            '顏色': ['background_color', 'player_color', 'laser_color', 'damage_color', 'circle_color', 'safe_color']
        };

        Object.entries(sections).forEach(([header, keys]) => {
            if (!Array.isArray(keys)) return;
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'section-header';
            sectionHeader.textContent = header === CONFIG.game_mode ? MODES[header].label : header;
            panelContent.appendChild(sectionHeader);

            keys.forEach(key => {
                const label = document.createElement('div');
                label.className = 'slider-label';
                label.id = `label-${key}`;
                const colorKeys = ['background_color', 'player_color', 'laser_color', 'damage_color', 'circle_color', 'safe_color'];
                const stringKeys = ['skill_key'];
                const value = colorKeys.includes(key) ? CONFIG.global[key] : (stringKeys.includes(key) ? CONFIG.global[key] : (MODES[CONFIG.game_mode].settings.includes(key) ? CONFIG[CONFIG.game_mode][key] : CONFIG.global[key]));
                label.innerHTML = `<span>${colorKeys.includes(key) ? this.formatLabel(key) : this.formatLabel(key, value)}</span>`;
                label.title = TOOLTIPS[key] || '';
                if (key === 'skill_key') {
                    label.title += '。鎖鏈跳';
                } else if (key === 'zoom') {
                    label.title += '。滑鼠滾輪縮放。';
                }
                panelContent.appendChild(label);

                const slider = document.createElement('input');
                slider.type = colorKeys.includes(key) ? 'color' : (stringKeys.includes(key) ? 'text' : 'range');
                if (stringKeys.includes(key)) {
                    slider.maxLength = CONSTRAINTS[key].maxLength;
                } else {
                    slider.min = CONSTRAINTS[key]?.min;
                    slider.max = CONSTRAINTS[key]?.max;
                    slider.step = CONSTRAINTS[key]?.step;
                }
                slider.value = colorKeys.includes(key) ? rgbToHex(...CONFIG.global[key]) : value;
                slider.className = colorKeys.includes(key) ? 'color-picker' : 'slider';
                slider.id = `slider-${key}`;
                slider.oninput = (event) => {
                    event.stopPropagation();
                    if (colorKeys.includes(key)) {
                        CONFIG.global[key] = hexToRgb(slider.value);
                    } else if (stringKeys.includes(key)) {
                        if (slider.value.length <= CONSTRAINTS[key].maxLength) {
                            CONFIG.global[key] = slider.value;
                        }
                    } else {
                        let value = parseFloat(slider.value);
                        value = Math.max(CONSTRAINTS[key].min, Math.min(value, CONSTRAINTS[key].max));
                        if (MODES[CONFIG.game_mode].settings.includes(key) && CONFIG[CONFIG.game_mode]) {
                            CONFIG[CONFIG.game_mode][key] = value;
                        } else {
                            CONFIG.global[key] = value;
                        }
                        label.innerHTML = `<span>${this.formatLabel(key, value)}</span>`;
                        if (key === 'laser_width' && CONFIG.game_mode === 'laser') {
                            updateGraphicsBuffers();
                        }
                        if (key === 'cross_road_laser_width' && CONFIG.game_mode === 'cross_road') {
                            updateGraphicsBuffers();
                        }
                    }
                    saveConfig();
                };
                panelContent.appendChild(slider);
                this.sliders.push({ key, value, dragging: false });
                this.sliderElements.push({ label, slider, key });
            });
        });

        const resetButton = document.createElement('button');
        resetButton.className = 'button';
        resetButton.textContent = '重置為預設值';
        resetButton.onclick = (event) => {
            event.stopPropagation();
            CONFIG = JSON.parse(JSON.stringify(DEFAULTS));
            CONFIG.window_width = windowWidth;
            CONFIG.window_height = windowHeight;
            CONFIG.circle_radius = CONFIG.game_mode === 'cross_road' ? 550 : 300;
            saveConfig();
            updateGraphicsBuffers();
            resetGameState();
            this.updateUI();
        };
        panelContent.appendChild(resetButton);
        this.sliderElements.push({ button: resetButton, key: 'reset' });

        const saveButton = document.createElement('button');
        saveButton.className = 'button';
        saveButton.textContent = '保存設定';
        saveButton.onclick = (event) => {
            event.stopPropagation();
            saveConfig();
        };
        panelContent.appendChild(saveButton);
        this.sliderElements.push({ button: saveButton, key: 'save' });
    }

    formatLabel(key, value) {
        const labels = {
            player_size: '玩家大小',
            player_speed: '玩家速度',
            laser_width: '雷射寬度',
            laser_fade_duration: '雷射淡入時間',
            damage_duration: '傷害持續時間',
            initial_laser_interval: '初始雷射間隔',
            interval_decrease: '間隔減少速率',
            min_laser_interval: '最小雷射間隔',
            wave_duration: '波次持續時間',
            wave_interval: '波次間隔',
            start_delay: '開始延遲',
            difficulty: '難度',
            background_color: '背景顏色',
            player_color: '玩家顏色',
            laser_color: '雷射顏色',
            damage_color: '披薩/小圓圈/吐息顏色',
            circle_color: '圓圈顏色',
            safe_color: '隊友顏色',
            aim_time: '瞄準時間',
            small_circle_size: '小圓圈大小',
            arc_degree: '吐息角度',
            cross_road_laser_width: '過馬路雷射寬度',
            laser_interval: '雷射發射間隔',
            small_circle_interval: '小圓圈放置間隔',
            arc_fade_duration: '吐息淡入時間',
            damage_max_alpha: '傷害最大透明度',
            zoom: '縮放比例',
            skill_speed: '技能移動速度',
            skill_radius: '技能範圍半徑',
            skill_key: '技能鍵'
        };
        const colorKeys = ['background_color', 'player_color', 'laser_color', 'damage_color', 'circle_color', 'safe_color'];
        if (colorKeys.includes(key)) {
            return labels[key];
        }
        if (key === 'difficulty') {
            return `難度: ${value === 0 ? '簡單' : '困難'}`;
        }
        if (typeof value === 'undefined') {
            return labels[key] || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        return `${labels[key]}: ${Number.isFinite(value) ? Number(value).toFixed(3) : value}`;
    }
};