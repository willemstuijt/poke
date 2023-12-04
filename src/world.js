let origPos = [];
allEnemies.forEach(e => {
    origPos.push({ x: e.x, y: e.y, direction: e.direction })
});

function newWorld(assets) {
    // Define the character
    const character = {
        sprite: assets.world.character,
        width: charWidth, // Width of one frame
        height: charHeight, // Height of one frame
        frameW: 16,
        frameH: 17,
        x: worldWidth / 2 - charWidth / 2, // Starting x position
        y: worldHeight * 0.55, // Starting y position
        speed: 2, // Movement speed
        direction: 'down', // Initial direction
        frameIndex: 0, // Current frame index in the sprite sheet
        tickCount: 0, // Counts the number of updates since the last frame change
        ticksPerFrame: 10, // Number of updates required to change the frame
        numberOfFrames: 3, // Number of frames for the animation
    };

    // Define the enemies
    const enemies = allEnemies;
    // Additional properties for the enemies for animation
    for (let i = 0; i < allEnemies.length; i++) {
        const e = allEnemies[i];
        e.x = origPos[i].x;
        e.y = origPos[i].y;
        e.direction = origPos[i].direction;
    }
    enemies.forEach(enemy => {
        if (!Object.hasOwn(enemy, 'boss')) {
            enemy.boss = false;
        }
        enemy.hp = enemy.totalHp;
        enemy.origX = enemy.x;
        enemy.origY = enemy.y;
        enemy.origDir = enemy.direction;
        enemy.width = character.width;
        enemy.height = character.height;
        enemy.frameW = character.frameW;
        enemy.frameH = character.frameH;
        enemy.triggerDist = 0;
        enemy.triggered = false;
        enemy.surprised = false;
        enemy.readyToFight = false;
        enemy.fought = false;
        enemy.returning = false;
        enemy.talked = false;
        enemy.rematch = false;
        enemy.speed = 2; // Movement speed
        enemy.frameIndex = 0; // Frame index for walking animation
        enemy.tickCount = 0; // Counter for updating frames
        enemy.ticksPerFrame = 10; // Number of ticks before changing frames
        enemy.numberOfFrames = 3; // Number of frames for the animation
    });

    // Tickers, closures that run once on each game update returning true when they are done
    const tickers = [];

    // Handle keyboard input
    const keys = {
        disabled: false,
        right: false,
        left: false,
        up: false,
        down: false,
        space: false,
    };

    return {
        frameCount: 0,
        elapsedTime: 0,
        debug: drawCollidables, // Enable or disable debug mode
        gamePaused: false, // A flag to pause the game for the encounter
        gameWorld: assets.world.background,
        collidables: collidables,
        character: character,
        enemies: enemies,
        exclamationSprite: assets.world.exclamation,
        tickers: tickers,

        keys: keys,
        keydownListener: (e) => {
            if (!keys.disabled) {
                if (e.key === 'ArrowRight') { keys.right = true; character.direction = 'right'; }
                if (e.key === 'ArrowLeft') { keys.left = true; character.direction = 'left'; }
                if (e.key === 'ArrowUp') { keys.up = true; character.direction = 'up'; }
                if (e.key === 'ArrowDown') { keys.down = true; character.direction = 'down'; }
                if (e.key === ' ' || e.key == 'Enter') { keys.space = true; }
            }
        },
        keyupListener: (e) => {
            if (e.key === 'ArrowRight') { keys.right = false; character.frameIndex = 0; }
            if (e.key === 'ArrowLeft') { keys.left = false; character.frameIndex = 0; }
            if (e.key === 'ArrowUp') { keys.up = false; character.frameIndex = 0; }
            if (e.key === 'ArrowDown') { keys.down = false; character.frameIndex = 0; }
            if (e.key === ' ' || e.key == 'Enter') { keys.space = false; }
        },
    };
}


// Plays the world, returning when there is a battle
function playWorld(canvas, ctx, world, onBattle, lostAgainst) {
    const debug = world.debug;
    const gameWorld = world.gameWorld;
    const character = world.character;
    const collidables = world.collidables;
    const enemies = world.enemies;
    const keys = world.keys;

    let startTime = performance.now();

    world.gamePaused = false;
    setSong(audio.world);

    window.addEventListener('keydown', world.keydownListener);
    window.addEventListener('keyup', world.keyupListener);

    const exclamation = {
        sprite: world.exclamationSprite,
        show: false,
        x: 0,
        y: 0,
        width: character.width,
        height: character.height,
    };

    function returnEnemyToPlace(enemy) {
        enemy.rematch = true;
        enemy.returning = true;
        enemy.triggered = false;
        enemy.surprised = false;
        enemy.fought = false;
        enemy.readyToFight = false;
        enemy.direction = oppositeDirection(enemy.direction);
        if (enemy.talked) {
            enemy.talked = false;
            enemy.direction = enemy.origDir;
            return;
        }

        switch (enemy.direction) {
            case 'up':
                enemy.triggerDist = enemy.origY - character.height * 0.5 - enemy.y;
                break;
            case 'down':
                enemy.triggerDist = enemy.origY + character.height * 0.5 - enemy.y;
                break;
            case 'left':
                enemy.triggerDist = enemy.origX - character.width * 0.5 - enemy.x;
                break;
            case 'right':
                enemy.triggerDist = enemy.origX + character.width * 0.5 - enemy.x;
                break;
        }

        keys.down = true;
        character.direction = 'down';
        newTimeTicker(world.tickers, 0.3, () => {
            keys.down = false;
            character.frameIndex = 0;
        });

        world.gamePaused = true;
        keys.disabled = true;
        exclamation.height = character.height * 0.3;

        let now = performance.now();
        let totalTime = now - startTime + world.elapsedTime;
        let averageFrameTime = (totalTime / world.frameCount) / 1000;

        newTimeTicker(world.tickers, (Math.abs(enemy.triggerDist) / enemy.speed) * averageFrameTime, () => {
            enemy.returning = false;
            enemy.direction = oppositeDirection(enemy.direction);
            world.gamePaused = false;
            keys.disabled = false;
        });
    }
    if (lostAgainst) {
        returnEnemyToPlace(lostAgainst);
    }

    function triggerEnemy(triggered) {

        triggered.triggered = true;
        if (triggered.surprised) {
            return;
        }
        // exclamation trigger
        setSong(null);
        playEffect(audio.exclamation);

        keys.up = false;
        keys.down = false;
        keys.left = false;
        keys.right = false;
        character.frameIndex = 0;

        world.gamePaused = true;
        keys.disabled = true;
        exclamation.x = triggered.x;
        exclamation.y = triggered.y - triggered.height * 1.6;
        exclamation.show = true;
        character.direction = oppositeDirection(triggered.direction);
        exclamation.height = character.height * 0.3;
        newPositionHeightTicker(world.tickers, exclamation, triggered.y - triggered.height * 1.2, character.height, 0.1, () => {
            newTimeTicker(world.tickers, 0.9, () => {
                // after exclamation
                setSong(audio.encounter);
                exclamation.show = false;
                triggered.surprised = true;
            });
        });
        // show dialog and then set surprised to true
    }

    const shroud = {
        color: 'transparent',
    };

    // Update game objects
    function update() {
        processTickers(world.tickers);

        keys.disabled = world.gamePaused;

        character.tickCount += 1;
        if (character.tickCount > character.ticksPerFrame) {
            character.tickCount = 0;
            // If the character is moving, update the frame index
            if (keys.right || keys.left || keys.up || keys.down) {
                character.frameIndex = (character.frameIndex + 1) % character.numberOfFrames;
            }
        }

        let newX = character.x;
        let newY = character.y;

        if (keys.right) newX += character.speed;
        if (keys.left) newX -= character.speed;
        if (keys.up) newY -= character.speed;
        if (keys.down) newY += character.speed;

        if (!world.gamePaused) {
            if (keys.space) {
                let active = canActivate([collidables, enemies], character, newX, newY);
                if (active) {
                    keys.space = false;

                    if (Object.hasOwn(active, 'direction')) {
                        active.direction = oppositeDirection(character.direction);
                    }
                    if (Object.hasOwn(active, 'triggered') && !active.triggered) {
                        active.talked = true;
                        triggerEnemy(active);
                        return;
                    }
                    if (!Object.hasOwn(active, 'spaceDialog')) {
                        return;
                    }

                    world.gamePaused = true;

                    showMultiTextDialog(world.tickers, active.spaceDialog, () => {
                        hideDialog();
                        world.gamePaused = false;
                    });
                }
            }
        }

        // Only update the character's position if they are not colliding
        if (canMove([collidables, enemies], character, newX, newY)) {
            character.x = newX;
            character.y = newY;

            if (character.y < bossSongHeight && songPlaying(audio.world)) {
                setSong(audio.bossWorld);
            } else if (character.y > bossSongHeight && songPlaying(audio.bossWorld)) {
                setSong(audio.world);
            }
        }

        if (!world.gamePaused) {
            const triggered = checkForEncounters(character, enemies);
            if (triggered !== null) {
                triggerEnemy(triggered);
            }
        }

        // Update the position of an approaching enemy
        enemies.forEach(enemy => {
            if ((enemy.triggered && enemy.surprised) || enemy.returning) {
                approachPlayer(character, enemy);
            }
            if (enemy.surprised && enemy.readyToFight && !enemy.fought) {
                enemy.fought = true;

                let dialog = enemy.encounterDialog;
                if (enemy.rematch && Object.hasOwn(enemy, 'rematchDialog')) {
                    dialog = enemy.rematchDialog;
                }

                showMultiTextDialog(world.tickers, dialog, () => {
                    hideDialog();
                    if (enemy.boss) {
                        setSong(audio.bossBattle);
                    } else {
                        setSong(audio.battle);
                    }

                    newColorTicker(world.tickers, shroud, 1.6, 0.20, () => {
                        startBattle(enemy);
                    });
                });
            }
        });
    }

    // Draw game objects
    function draw() {
        world.frameCount++;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the centered position
        const viewPortX = canvas.width / 2 - character.width / 2;
        const viewPortY = canvas.height / 2 - character.height / 2;

        // Draw game world centered on the character
        ctx.drawImage(
            gameWorld,
            viewPortX - character.x, // Adjusted x position
            viewPortY - character.y,  // Adjusted y position
            worldWidth,
            worldHeight,
        );

        // Draw collidables for debugging
        if (debug) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            collidables.forEach(function (rect) {
                ctx.fillRect(
                    rect.x + viewPortX - character.x, // Adjusted x position
                    rect.y + viewPortY - character.y, // Adjusted y position
                    rect.width,
                    rect.height
                );
            });
        }

        // Draw the character at the center of the viewport
        ctx.drawImage(
            character.sprite,

            getDirectionCol(character.direction, character.frameW),
            character.frameIndex * character.frameH,

            character.frameW,
            character.frameH,
            viewPortX, // Centered x position
            viewPortY, // Centered y position
            character.width,
            character.height,
        );

        // Draw enemies with animation
        enemies.forEach(enemy => enemyDraw(enemy.worldSprite, character, viewPortX, viewPortY, ctx, enemy));

        if (exclamation.show) {
            drawRelObject(ctx, character, viewPortX, viewPortY, exclamation);
        }

        renderDialogBox(canvas, ctx);

        if (shroud.color !== 'transparent') {
            ctx.fillStyle = shroud.color;
            ctx.fillRect(
                0, // Adjusted x position
                0, // Adjusted y position
                canvas.width,
                canvas.height
            );
        }
    }

    function startBattle(enemy) {
        stopGameLoop();
        let now = performance.now();
        world.elapsedTime += now - startTime;
        onBattle(enemy);
    }


    // The main game loop
    var running = true;
    function gameLoop() {
        update(); // Update the game objects
        draw();   // Draw the game objects
        if (running) {
            requestAnimationFrame(gameLoop);
        }
    }

    function stopGameLoop() {
        if (running) {
            window.removeEventListener('keydown', world.keydownListener);
            window.removeEventListener('keyup', world.keyupListener);
            running = false;
        }
    }

    gameLoop();
}