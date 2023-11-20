function newWorld(assets) {
    // Define collidable areas
    const collidables = [
        { x: 362, y: 448, width: 60, height: 52 },
        // Add more rectangles here
    ];

    // Define the character
    const character = {
        sprite: assets.world.character,
        width: 31, // Width of one frame
        height: 32, // Height of one frame
        x: 512, // Starting x position
        y: 576, // Starting y position
        speed: 2, // Movement speed
        direction: 'down', // Initial direction
        frameIndex: 1, // Current frame index in the sprite sheet
        tickCount: 0, // Counts the number of updates since the last frame change
        ticksPerFrame: 10, // Number of updates required to change the frame
        numberOfFrames: 3, // Number of frames for the animation
    };

    // Define the enemies
    const enemies = allEnemies;
    // Additional properties for the enemies for animation
    enemies.forEach(enemy => {
        enemy.hp = enemy.totalHp;
        enemy.width = character.width;
        enemy.height = character.height;
        enemy.triggerDist = 0;
        enemy.triggered = false;
        enemy.surprised = false;
        enemy.readyToFight = false;
        enemy.fought = false;
        enemy.speed = 2; // Movement speed
        enemy.frameIndex = 1; // Frame index for walking animation
        enemy.tickCount = 0; // Counter for updating frames
        enemy.ticksPerFrame = 10; // Number of ticks before changing frames
        enemy.numberOfFrames = 3; // Number of frames for the animation
    });

    // Tickers, closures that run once on each game update returning true when they are done
    const tickers = [];

    // Handle keyboard input
    const keys = {
        right: false,
        left: false,
        up: false,
        down: false,
    };

    return {
        debug: true, // Enable or disable debug mode
        gamePaused: false, // A flag to pause the game for the encounter
        gameWorld: assets.world.background,
        collidables: collidables,
        character: character,
        enemies: enemies,
        exclamationSprite: assets.world.exclamation,
        tickers: tickers,

        keys: keys,
        keydownListener: (e) => {
            if (e.key === 'ArrowRight') { keys.right = true; character.direction = 'right'; }
            if (e.key === 'ArrowLeft') { keys.left = true; character.direction = 'left'; }
            if (e.key === 'ArrowUp') { keys.up = true; character.direction = 'up'; }
            if (e.key === 'ArrowDown') { keys.down = true; character.direction = 'down'; }
        },
        keyupListener: (e) => {
            if (e.key === 'ArrowRight') { keys.right = false; character.frameIndex = 1; }
            if (e.key === 'ArrowLeft') { keys.left = false; character.frameIndex = 1; }
            if (e.key === 'ArrowUp') { keys.up = false; character.frameIndex = 1; }
            if (e.key === 'ArrowDown') { keys.down = false; character.frameIndex = 1; }
        },
    };
}

// Plays the world, returning when there is a battle
function playWorld(canvas, ctx, world, onBattle) {
    const debug = world.debug;
    const gameWorld = world.gameWorld;
    const character = world.character;
    const collidables = world.collidables;
    const enemies = world.enemies;
    const keys = world.keys;

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

    // Update game objects
    function update() {
        processTickers(world.tickers);

        if (!world.gamePaused) {
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

            // Only update the character's position if they are not colliding
            if (canMove([collidables, enemies], character, newX, newY)) {
                character.x = newX;
                character.y = newY;
            }

            const triggered = checkForEncounters(character, enemies);
            if (triggered !== null) {
                // exclamation trigger
                setSong(null);
                playEffect(audio.exclamation);

                world.gamePaused = true;
                exclamation.x = triggered.x;
                exclamation.y = triggered.y - triggered.height * 1.6;
                exclamation.show = true;
                exclamation.height = character.height * 0.3;
                newPositionHeightTicker(world.tickers, exclamation, triggered.y - triggered.height * 1.2, character.height, 0.1, () => {
                    newTimeTicker(world.tickers, 0.9, () => {
                        // after exclamation
                        setSong(audio.battle);
                        exclamation.show = false;
                        triggered.surprised = true;
                    });
                });
                // show dialog and then set surprised to true
            }
        }
        // Update the position of an approaching enemy
        enemies.forEach(enemy => {
            if (enemy.triggered && enemy.surprised) {
                approachPlayer(character, enemy);
            }
            if (enemy.surprised && enemy.readyToFight && !enemy.fought) {
                enemy.fought = true;
                showMultiTextDialog(world.tickers, enemy.encounterDialog, () => {
                    hideDialog();
                    startBattle(enemy);
                });
            }
        });
    }

    // Draw game objects
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the centered position
        const viewPortX = canvas.width / 2 - character.width / 2;
        const viewPortY = canvas.height / 2 - character.height / 2;

        // Draw game world centered on the character
        ctx.drawImage(
            gameWorld,
            viewPortX - character.x, // Adjusted x position
            viewPortY - character.y  // Adjusted y position
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
            character.frameIndex * character.width,
            getDirectionRow(character.direction, character.height),
            character.width,
            character.height,
            viewPortX, // Centered x position
            viewPortY, // Centered y position
            character.width,
            character.height
        );

        // Draw enemies with animation
        enemies.forEach(enemy => enemyDraw(enemy.worldSprite, character, viewPortX, viewPortY, ctx, enemy));

        if (exclamation.show) {
            drawRelObject(ctx, character, viewPortX, viewPortY, exclamation);
        }

        renderDialogBox(canvas, ctx);
    }

    function startBattle(enemy) {
        stopGameLoop();
        onBattle(enemy)
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