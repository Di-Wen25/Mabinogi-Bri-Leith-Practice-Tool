const laserMode = {
    label: '雷射',
    settings: ['laser_width', 'laser_fade_duration', 'damage_duration', 'initial_laser_interval', 'interval_decrease', 'min_laser_interval', 'difficulty'],
    ui_settings: () => ['laser_width', 'laser_fade_duration', ...(CONFIG.debug_mode ? ['damage_duration'] : []), 'initial_laser_interval', 'interval_decrease', 'min_laser_interval'],
    update: (dt, config, damageManager) => {
        const currentTime = millis() / 1000.0;
        gameTimer = currentTime - startTime;
        const currentInterval = Math.max(config.min_laser_interval, config.initial_laser_interval - laserCount * config.interval_decrease);
        if (gameState === 'active' && currentTime - lastLaserTime >= currentInterval && currentTime - startTime >= config.start_delay) {
            const xCenter = CONFIG.window_width / 2;
            const yCenter = CONFIG.window_height / 2;
            const radius = CONFIG.circle_radius;
            const segmentSize = config.laser_width;
            const rowGridPositions = [yCenter - radius, yCenter - radius + segmentSize, yCenter - radius + 2 * segmentSize];
            const columnGridPositions = [xCenter - radius, xCenter - radius + segmentSize, xCenter - radius + 2 * segmentSize];
            const axisSequence = ['column', 'column', 'column', 'row', 'column', 'row', 'column', 'row'];
            let axis = laserCount < 8 ? axisSequence[laserCount] : random(['row', 'column']);
            if (consecutiveColumns >= 3) {
                axis = 'row';
                consecutiveColumns = 0;
            }
            if (axis === 'column') consecutiveColumns++;
            else consecutiveColumns = 0;
            const gridPositions = axis === 'row' ? rowGridPositions : columnGridPositions;
            const playerCoord = axis === 'row' ? playerPos.y : playerPos.x;
            let position = gridPositions.find(p => p <= playerCoord && playerCoord <= p + segmentSize + 0.001) ||
                gridPositions.reduce((prev, curr) => {
                    const prevMid = prev + segmentSize / 2;
                    const currMid = curr + segmentSize / 2;
                    return Math.abs(currMid - playerCoord) < Math.abs(prevMid - playerCoord) ? curr : prev;
                });
            const availablePositions = gridPositions.filter(p => !(p === lastLaserPosition && axis === lastLaserAxis) && !(p === secondLastLaserPosition && axis === secondLastLaserAxis));
            if (availablePositions.length > 0) {
                position = availablePositions.reduce((prev, curr) => {
                    const prevMid = prev + segmentSize / 2;
                    const currMid = curr + segmentSize / 2;
                    return Math.abs(currMid - playerCoord) < Math.abs(prevMid - playerCoord) ? curr : prev;
                });
            }
            secondLastLaserPosition = lastLaserPosition;
            secondLastLaserAxis = lastLaserAxis;
            lastLaserPosition = position;
            lastLaserAxis = axis;
            damageManager.addDamage('laser', {
                axis,
                position,
                segment_start: position,
                segment_end: position + segmentSize
            });
            laserCount++;
            lastLaserTime = currentTime;
            isFirstLaser = false;
        }
        if (laserCount >= config.win_condition && damageManager.damages.laser.length === 0) {
            gameState = 'win';
        }
    }
};