const pizzaMode = {
    label: '波次',
    settings: ['wave_duration', 'wave_interval', 'damage_duration', 'difficulty'],
    ui_settings: () => ['wave_duration', 'wave_interval', ...(CONFIG.debug_mode ? ['damage_duration'] : []), 'difficulty'],
    update: (dt, config) => {
        const currentTime = millis() / 1000.0;
        gameTimer = currentTime - startTime;
        if (gameState === 'active' && currentTime - startTime >= config.start_delay && waveCount < 9 && damageAreas.length === 0 && currentTime - lastWaveTime >= config.wave_interval) {
            const playerArea = getPlayerArea();
            const difficultyKey = config.difficulty === 0 ? '55' : '15';
            const wavePattern = WAVE_PATTERNS[difficultyKey][currentWave] || WAVE_PATTERNS[difficultyKey][0];
            const positions = wavePattern.map(offset => (playerArea + offset) % 8);
            damageAreas.push({
                positions,
                time: 0,
                alpha: 0,
                reached_full_alpha: false,
                damage_start_time: null,
                caused_damage: false,
                is_north_damaged: positions.includes(0)
            });
            waveCount++;
            currentWave = (currentWave + 1) % WAVE_PATTERNS[difficultyKey].length;
            lastWaveTime = currentTime;
        }
        for (let i = damageAreas.length - 1; i >= 0; i--) {
            const area = damageAreas[i];
            area.time += dt;
            if (area.time < config.wave_duration) {
                area.alpha = map(area.time, 0, config.wave_duration, 0, config.damage_max_alpha);
            } else if (!area.reached_full_alpha) {
                area.alpha = config.damage_max_alpha;
                area.reached_full_alpha = true;
                area.damage_start_time = area.time;
                if (area.is_north_damaged) {
                    gameState = 'dead';
                }
            }
            if (area.time >= config.wave_duration + config.damage_duration && area.reached_full_alpha) {
                damageAreas.splice(i, 1);
            }
        }
        if (waveCount >= 9 && damageAreas.length === 0) {
            gameState = 'win';
        }
    }
};