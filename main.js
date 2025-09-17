// Game State
let CONFIG = {};
let playerPos, gameState = 'waiting', startTime = 0, gameTimer = 0;
let damageManager, uiManager;
let rowLaserSurf, colLaserSurf, areaSurfaces = [], radialLaserSurf;
let lasers = [], damageAreas = [];
let laserCount = 0, dodgeCount = 0, isFirstLaser = true, targetPos = null;
let lastLaserPosition = null, lastLaserAxis = null, secondLastLaserPosition = null, secondLastLaserAxis = null;
let consecutiveColumns = 0;
let waveCount = 0, currentWave = 0, lastWaveTime = 0, lastLaserTime = 0;
let crossRoadStep = 0, crossRoadTimer = 0;
let bossAngle = 0;
let skillActive = false;
let skillStartPos = null;

const MODES = {
    pizza: pizzaMode,
    laser: laserMode,
    cross_road: crossRoadMode
};

function updateGraphicsBuffers() {
    const segmentSize = CONFIG.game_mode === 'laser' ? (CONFIG.laser?.laser_width || DEFAULTS.laser.laser_width) : 
                       CONFIG.game_mode === 'cross_road' ? (CONFIG.cross_road?.cross_road_laser_width || DEFAULTS.cross_road.cross_road_laser_width) : 
                       CONFIG.circle_radius * 2 / 3;
    rowLaserSurf = createGraphics(CONFIG.circle_radius * 2, segmentSize);
    colLaserSurf = createGraphics(segmentSize, CONFIG.circle_radius * 2);
    radialLaserSurf = createGraphics(CONFIG.circle_radius + (CONFIG.cross_road?.cross_road_laser_width || DEFAULTS.cross_road.cross_road_laser_width), segmentSize);
    areaSurfaces = Array(8).fill().map(() => createGraphics(CONFIG.circle_radius * 2, CONFIG.circle_radius * 2));
}

function setup() {
	
    loadConfig();
    createCanvas(windowWidth, windowHeight);
    CONFIG.window_width = windowWidth;
    CONFIG.window_height = windowHeight;
    CONFIG.circle_radius = CONFIG.game_mode === 'cross_road' ? 550 : 300;
    playerPos = createVector(windowWidth / 2, windowHeight / 2);
    updateGraphicsBuffers();
    textSize(24);
    textAlign(LEFT, TOP);
    damageManager = new DamageManager();
    uiManager = new UIManager();
    uiManager.updateUI();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    CONFIG.window_width = windowWidth;
    CONFIG.window_height = windowHeight;
    CONFIG.circle_radius = CONFIG.game_mode === 'cross_road' ? 550 : 300;
    playerPos = createVector(windowWidth / 2, windowHeight / 2);
    loadConfig();
    updateGraphicsBuffers();
    resetGameState();
    uiManager.updateUI();
}

function resetGameState() {
    gameState = 'waiting';
    lasers = [];
    damageAreas = [];
    damageManager.reset();
    laserCount = 0;
    dodgeCount = 0;
    isFirstLaser = true;
    waveCount = 0;
    currentWave = 0;
    targetPos = null;
    skillStartPos = null;
    lastLaserPosition = null;
    lastLaserAxis = null;
    secondLastLaserPosition = null;
    secondLastLaserAxis = null;
    consecutiveColumns = 0;
    crossRoadStep = 0;
    crossRoadTimer = 0;
    lastWaveTime = 0;
    lastLaserTime = 0;
    gameTimer = 0;
    bossAngle = 0;
    skillActive = false;
    playerPos = createVector(windowWidth / 2, windowHeight / 2);
	
}

function isPlayerInCircle(pos) {
    const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
    return pos.dist(center) <= CONFIG.circle_radius;
}

function getPlayerArea() {
    const centerX = CONFIG.window_width / 2;
    const centerY = CONFIG.window_height / 2;
    const dx = playerPos.x - centerX;
    const dy = playerPos.y - centerY;
    const rawAngle = Math.atan2(dy, dx) * 180 / Math.PI;
    let angle = (rawAngle + 90 + 360) % 360;
    return Math.floor((angle + 22.5) / 45) % 8;
}

function keyPressed() {
    if (gameState === 'active' && key === CONFIG.global.skill_key) {
        skillActive = !skillActive;
        targetPos = null; 
        skillStartPos = skillActive ? playerPos.copy() : null;
    }
}

function movePlayer(dt) {
    let direction = createVector(0, 0);
    let speed = skillActive ? CONFIG.global.skill_speed : CONFIG.global.player_speed;
    if (!skillActive) {
        if (keyIsDown(87)) direction.y -= 1; // W
        if (keyIsDown(83)) direction.y += 1; // S
        if (keyIsDown(65)) direction.x -= 1; // A
        if (keyIsDown(68)) direction.x += 1; // D
    }
    if (targetPos && (skillActive ? skillStartPos : true)) {
        let mouseTarget = targetPos.copy();
        if (skillActive && skillStartPos) {
            let dirToTarget = p5.Vector.sub(mouseTarget, skillStartPos);
            if (dirToTarget.mag() > CONFIG.global.skill_radius) {
                mouseTarget = skillStartPos.copy().add(dirToTarget.normalize().mult(CONFIG.global.skill_radius));
            }
        }
        if (!isPlayerInCircle(mouseTarget)) {
            const center = createVector(CONFIG.window_width / 2, CONFIG.window_height / 2);
            const dirToTarget = p5.Vector.sub(mouseTarget, center);
            mouseTarget = p5.Vector.add(center, dirToTarget.normalize().mult(CONFIG.circle_radius));
        }
        const directionToTarget = p5.Vector.sub(mouseTarget, playerPos);
        const distanceToTarget = directionToTarget.mag();
        if (distanceToTarget > 5) {
            direction.add(directionToTarget.normalize());
        } else {
            targetPos = null;
            if (skillActive) {
                skillActive = false;
                skillStartPos = null;
            }
        }
    }
    if (direction.mag() > 0) {
        direction = direction.normalize();
        const newPos = p5.Vector.add(playerPos, direction.mult(speed * dt));
        if (isPlayerInCircle(newPos)) {
            playerPos = newPos;
        }
    }
}

function drawGame(zoom) {
    const gameCenterX = CONFIG.window_width / 2;
    const gameCenterY = CONFIG.window_height / 2;

    stroke(CONFIG.game_mode === 'cross_road' ? [255, 255, 255] : CONFIG.global.circle_color);
    strokeWeight((CONFIG.game_mode === 'cross_road' ? 4 : 2) / zoom);
    noFill();
    circle(gameCenterX, gameCenterY, CONFIG.circle_radius * 2);

    if (CONFIG.game_mode === 'pizza') {
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45 - 22.5 - 90) * Math.PI / 180;
            const x = gameCenterX + CONFIG.circle_radius * Math.cos(angle);
            const y = gameCenterY + CONFIG.circle_radius * Math.sin(angle);
            line(gameCenterX, gameCenterY, x, y);
        }
        for (let area of damageAreas) {
            const alpha = area.alpha;
            for (let pos of area.positions) {
                const drawIndex = pos;
                const startAngle = (drawIndex * 45 - 22.5 - 90) * Math.PI / 180;
                const endAngle = ((drawIndex + 1) * 45 - 22.5 - 90) * Math.PI / 180;
                const surface = areaSurfaces[drawIndex];
                surface.clear();
                surface.fill(...CONFIG.global.damage_color, alpha);
                surface.noStroke();
                surface.arc(CONFIG.circle_radius, CONFIG.circle_radius, CONFIG.circle_radius * 2, CONFIG.circle_radius * 2, startAngle, endAngle);
                image(surface, gameCenterX - CONFIG.circle_radius, gameCenterY - CONFIG.circle_radius);
            }
        }
        fill(CONFIG.global.safe_color);
        noStroke();
        const northAngle = -90 * Math.PI / 180;
        const northX = gameCenterX + (CONFIG.circle_radius - 20) * Math.cos(northAngle);
        const northY = gameCenterY + (CONFIG.circle_radius - 20) * Math.sin(northAngle);
        circle(northX, northY, 10);
    } else if (CONFIG.game_mode === 'laser') {
        damageManager.draw({ ...CONFIG.global, ...CONFIG.laser, circle_radius: CONFIG.circle_radius });
    } else if (CONFIG.game_mode === 'cross_road') {
        if (CONFIG.debug_mode) {
            stroke(255, 0, 0);
            strokeWeight(2 / zoom);
            line(gameCenterX, gameCenterY, playerPos.x, playerPos.y);
        }
        fill(255, 0, 0);
        noStroke();
        circle(gameCenterX, gameCenterY, 20);
        push();
        translate(gameCenterX, gameCenterY);
        rotate(bossAngle);
        fill(255, 255, 0);
        triangle(0, -25, -15, -5, 15, -5);
        pop();
        damageManager.draw({ ...CONFIG.global, ...CONFIG.cross_road, circle_radius: CONFIG.circle_radius });
    }

    if (skillActive) {
        stroke(255, 255, 0);
        strokeWeight(2 / zoom);
        noFill();
        circle(playerPos.x, playerPos.y, CONFIG.global.skill_radius * 2);
    }

    if (gameState === 'waiting') {
        drawingContext.shadowBlur = 5 / zoom;
        drawingContext.shadowColor = 'black';
        fill(255);
        textAlign(CENTER, CENTER);
        text('點擊開始', gameCenterX, gameCenterY);
        drawingContext.shadowBlur = 0;
    }
}

function draw() {
    const dt = deltaTime / 1000.0;
    background(CONFIG.global.background_color);
    if (gameState === 'active') {
        movePlayer(dt);
        if (CONFIG.game_mode === 'pizza') {
            MODES.pizza.update(dt, { ...CONFIG.global, ...CONFIG.pizza, circle_radius: CONFIG.circle_radius });
        } else if (CONFIG.game_mode === 'laser') {
            MODES.laser.update(dt, { ...CONFIG.global, ...CONFIG.laser, circle_radius: CONFIG.circle_radius }, damageManager);
            damageManager.update(dt, { ...CONFIG.global, ...CONFIG.laser, circle_radius: CONFIG.circle_radius }, playerPos);
            if (damageManager.checkCollisions(playerPos, { ...CONFIG.global, ...CONFIG.laser, circle_radius: CONFIG.circle_radius })) {
                gameState = 'dead';
            }
        } else if (CONFIG.game_mode === 'cross_road') {
            MODES.cross_road.update(dt, { ...CONFIG.global, ...CONFIG.cross_road, circle_radius: CONFIG.circle_radius }, damageManager);
            damageManager.update(dt, { ...CONFIG.global, ...CONFIG.cross_road, circle_radius: CONFIG.circle_radius }, playerPos);
            if (damageManager.checkCollisions(playerPos, { ...CONFIG.global, ...CONFIG.cross_road, circle_radius: CONFIG.circle_radius })) {
                gameState = 'dead';
            }
        }
    }

    let zoom = CONFIG.global.zoom;
    push();
    translate(windowWidth / 2, windowHeight / 2);
    scale(zoom);
    translate(-playerPos.x, -playerPos.y);
    drawGame(zoom);
    pop();

    fill(CONFIG.global.player_color);
    noStroke();
    circle(windowWidth / 2, windowHeight / 2, CONFIG.global.player_size * 2);

    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = 'black';
    fill(255);
    textAlign(CENTER, CENTER);
    if (gameState === 'dead') {
        text('遊戲結束 - 點擊重新開始', windowWidth / 2, windowHeight / 2);
    } else if (gameState === 'win') {
        text('你贏了！ - 點擊重新開始', windowWidth / 2, windowHeight / 2);
    }

    textAlign(LEFT, TOP);
    if (CONFIG.game_mode === 'laser' && ['active', 'dead', 'win'].includes(gameState)) {
        //text(`閃避雷射數: ${dodgeCount}`, CONFIG.global.ui_width + 20, 20);
        text(`時間: ${gameTimer.toFixed(2)}秒`, CONFIG.global.ui_width + 20, 50);
    } else if (CONFIG.game_mode === 'pizza' && ['active', 'dead', 'win'].includes(gameState)) {
        text(`波次: ${Math.min(waveCount, 9)}/9`, CONFIG.global.ui_width + 20, 20);
        text(`區域: ${['12', '1', '3', '5', '6', '7', '9', '11'][getPlayerArea()]}`, CONFIG.global.ui_width + 20, 50);
    } else if (CONFIG.game_mode === 'cross_road' && ['active', 'dead', 'win'].includes(gameState)) {
        text(`時間: ${gameTimer.toFixed(2)}秒`, CONFIG.global.ui_width + 20, 20);
    }
    drawingContext.shadowBlur = 0;
}

function mousePressed() {
    const zoom = CONFIG.global.zoom;
    const zoomedMouseX = (mouseX - windowWidth / 2) / zoom + playerPos.x;
    const zoomedMouseY = (mouseY - windowHeight / 2) / zoom + playerPos.y;
    const worldMousePos = createVector(zoomedMouseX, zoomedMouseY);
    if (gameState === 'waiting') {
        if (isPlayerInCircle(worldMousePos)) {
            gameState = 'active';
            startTime = millis() / 1000.0;
            gameTimer = 0;
            if (CONFIG.game_mode === 'laser') {
                lastLaserTime = startTime;
                lastLaserPosition = null;
                lastLaserAxis = null;
                secondLastLaserPosition = null;
                secondLastLaserAxis = null;
                consecutiveColumns = 0;
                dodgeCount = 0;
                laserCount = 0;
                isFirstLaser = true;
                damageManager.reset();
            } else if (CONFIG.game_mode === 'pizza') {
                waveCount = 0;
                currentWave = 0;
                damageAreas = [];
                lastWaveTime = startTime;
            } else if (CONFIG.game_mode === 'cross_road') {
                crossRoadStep = 0;
                crossRoadTimer = 0;
                damageManager.reset();
                laserCount = 0;
                dodgeCount = 0;
                bossAngle = 0;
            }
        }
    } else if (gameState === 'dead' || gameState === 'win') {
        if (isPlayerInCircle(worldMousePos)) {
            resetGameState();
            updateGraphicsBuffers();
        }
    } else if (gameState === 'active') {
        targetPos = worldMousePos;
        if (skillActive && !skillStartPos) {
            skillStartPos = playerPos.copy();
        }
    }
}

function mouseWheel(event) {
    const uiWidth = CONFIG.ui_collapsed ? 40 : 300;
    if (mouseX > uiWidth) {
        CONFIG.global.zoom += event.delta > 0 ? -0.1 : 0.1;
        CONFIG.global.zoom = constrain(CONFIG.global.zoom, CONSTRAINTS.zoom.min, CONSTRAINTS.zoom.max);
        saveConfig();
        const zoomSlider = document.getElementById('slider-zoom');
        const zoomLabel = document.getElementById('label-zoom');
        if (zoomSlider && zoomLabel) {
            zoomSlider.value = CONFIG.global.zoom;
            zoomLabel.innerHTML = `<span>${uiManager.formatLabel('zoom', CONFIG.global.zoom)}</span>`;
        }
    }
}