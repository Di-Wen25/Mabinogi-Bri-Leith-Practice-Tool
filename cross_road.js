const crossRoadMode = {
    label: '過馬路',
    settings: ['aim_time', 'cross_road_laser_width', 'laser_fade_duration', 'laser_interval', 'damage_duration', 'small_circle_size', 'small_circle_interval', 'arc_degree', 'arc_fade_duration', 'difficulty'],
    ui_settings: () => ['aim_time', 'cross_road_laser_width', 'laser_fade_duration', 'laser_interval', ...(CONFIG.debug_mode ? ['damage_duration'] : []), 'small_circle_size', 'small_circle_interval', 'arc_degree', 'arc_fade_duration', 'difficulty'],
    update: (dt, config, damageManager) => {
        gameTimer = millis() / 1000.0 - startTime;
        crossRoadTimer += dt;
        const steps = config.difficulty === 0 ? [
            { time: config.start_delay, action: () => {}, next: 1 },
            { time: config.aim_time, action: () => { bossAngle = SetBossAngle(); }, next: 2 },
            { time: config.laser_interval, action: () => {
                bossAngle = SetBossAngle();
                const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                const dir = p5.Vector.sub(playerPos, center).normalize();
                const end = p5.Vector.add(center, dir.mult(CONFIG.circle_radius + config.cross_road_laser_width / 2));
                damageManager.addDamage('laser', { 
                    axis: 'radial', 
                    start: center, 
                    end: end,
                    persistent: true
                });
                laserCount++;
            }, next: 3 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 4 },
            { time: config.small_circle_interval, action: () => {
                bossAngle = SetBossAngle();
                damageManager.addDamage('small_circle', { position: playerPos.copy(), size: config.small_circle_size });
            }, next: 5 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 6 },
            { time: config.aim_time, action: () => { bossAngle = SetBossAngle(); }, next: 7 },
            { time: config.laser_interval, action: () => {
                bossAngle = SetBossAngle();
                const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                const dir = p5.Vector.sub(playerPos, center).normalize();
                const end = p5.Vector.add(center, dir.mult(CONFIG.circle_radius + config.cross_road_laser_width / 2));
                damageManager.addDamage('laser', { 
                    axis: 'radial', 
                    start: center, 
                    end: end,
                    persistent: true
                });
                laserCount++;
            }, next: 8 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 9 },
            { time: config.small_circle_interval, action: () => {
                bossAngle = SetBossAngle();
                damageManager.addDamage('small_circle', { position: playerPos.copy(), size: config.small_circle_size });
            }, next: 10 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 11 },
            { time: config.aim_time, action: () => { bossAngle = SetBossAngle(); }, next: 12 },
            { time: config.laser_interval, action: () => {
                bossAngle = SetBossAngle();
                const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                const dir = p5.Vector.sub(playerPos, center).normalize();
                const end = p5.Vector.add(center, dir.mult(CONFIG.circle_radius + config.cross_road_laser_width / 2));
                damageManager.addDamage('laser', { 
                    axis: 'radial', 
                    start: center, 
                    end: end,
                    persistent: true
                });
                laserCount++;
            }, next: 13 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 14 },
            { time: config.small_circle_interval, action: () => {
                bossAngle = SetBossAngle();
                damageManager.addDamage('small_circle', { position: playerPos.copy(), size: config.small_circle_size });
            }, next: 15 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 16 },
            { time: 2.0, action: () => { if (gameState !== 'dead') gameState = 'win'; }, next: 16 }
        ] : [
            { time: config.start_delay, action: () => {}, next: 1 },
            { time: config.aim_time, action: () => { bossAngle = SetBossAngle(); }, next: 2 },
            { time: config.laser_interval, action: () => {
                bossAngle = SetBossAngle();
                const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                const dir = p5.Vector.sub(playerPos, center).normalize();
                const end = p5.Vector.add(center, dir.mult(CONFIG.circle_radius + config.cross_road_laser_width / 2));
                damageManager.addDamage('laser', { 
                    axis: 'radial', 
                    start: center, 
                    end: end,
                    persistent: true
                });
                laserCount++;
            }, next: 3 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 4 },
            { time: config.laser_interval, action: () => {
                bossAngle = SetBossAngle();
                const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                const dir = p5.Vector.sub(playerPos, center).normalize();
                const end = p5.Vector.add(center, dir.mult(CONFIG.circle_radius + config.cross_road_laser_width / 2));
                damageManager.addDamage('laser', { 
                    axis: 'radial', 
                    start: center, 
                    end: end,
                    persistent: true
                });
                laserCount++;
            }, next: 5 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 6 },
            { time: config.laser_interval, action: () => {
                bossAngle = SetBossAngle();
                const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                const dir = p5.Vector.sub(playerPos, center).normalize();
                const end = p5.Vector.add(center, dir.mult(CONFIG.circle_radius + config.cross_road_laser_width / 2));
                damageManager.addDamage('laser', { 
                    axis: 'radial', 
                    start: center, 
                    end: end,
                    persistent: true
                });
                laserCount++;
            }, next: 7 },
            { time: config.laser_fade_duration + config.damage_duration, action: () => {}, next: 8 },
            { time: config.small_circle_interval, action: () => {}, next: 9 },
            { time: config.aim_time, action: () => {
                bossAngle = SetBossAngle();
                const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
                const dx = playerPos.x - center.x;
                const dy = playerPos.y - center.y;
                let playerAngle = Math.atan2(dy, dx);
                const halfArc = (config.arc_degree / 2) * Math.PI / 180;
                const startAngle = playerAngle - halfArc;
                const endAngle = playerAngle + halfArc;
                damageManager.addDamage('arc', { startAngle, endAngle, persistent: true });
            }, next: 10 },
            { time: 2.0, action: () => { if (gameState !== 'dead') gameState = 'win'; }, next: 10 }
        ];
        if (gameState === 'active' && crossRoadStep < steps.length && crossRoadTimer >= steps[crossRoadStep].time) {
            steps[crossRoadStep].action();
            crossRoadStep = steps[crossRoadStep].next || crossRoadStep + 1;
            crossRoadTimer = 0;
        }
    }
};