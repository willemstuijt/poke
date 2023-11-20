
// Function to animate the enemy
function animateEnemy(enemy) {
    enemy.tickCount++;
    if (enemy.tickCount > enemy.ticksPerFrame) {
        enemy.tickCount = 0;
        enemy.frameIndex = (enemy.frameIndex + 1) % enemy.numberOfFrames;
    }
}

// Function to handle the enemy approaching the player
function approachPlayer(player, enemy) {
    // Stop approaching when close
    if (Math.abs(enemy.triggerDist) < player.width) {
        enemy.readyToFight = true;
        enemy.frameIndex = 1;
        return true;
    }

    animateEnemy(enemy); // Call the animate function

    // Calculate the direction vector based on the enemy's facing direction
    let deltaX = 0;
    let deltaY = 0;
    const approachSpeed = enemy.speed;
    switch (enemy.direction) {
        case 'up': deltaY = -approachSpeed; break;
        case 'down': deltaY = approachSpeed; break;
        case 'left': deltaX = -approachSpeed; break;
        case 'right': deltaX = approachSpeed; break;
    }

    enemy.triggerDist -= deltaX + deltaY;

    // Update the enemy's position
    enemy.x += deltaX;
    enemy.y += deltaY;
}

// Check for enemy encounters
function checkForEncounters(character, enemies) {
    var triggered = null;
    enemies.forEach(enemy => {
        if (!enemy.triggered) {
            // Check if the player is in front of the enemy based on enemy's direction
            let inFront = false;
            switch (enemy.direction) {
                case 'up':
                    inFront = character.x === enemy.x && character.y < enemy.y;
                    enemy.triggerDist = character.y - enemy.y;
                    break;
                case 'down':
                    inFront = character.x === enemy.x && character.y > enemy.y;
                    enemy.triggerDist = character.y - enemy.y;
                    break;
                case 'left':
                    inFront = character.y === enemy.y && character.x < enemy.x;
                    enemy.triggerDist = character.x - enemy.x;
                    break;
                case 'right':
                    inFront = character.y === enemy.y && character.x > enemy.x;
                    enemy.triggerDist = character.x - enemy.x;
                    break;
            }

            if (inFront) {
                enemy.triggered = true; // Prevents the enemy from being triggered again
                triggered = enemy;
            }
        }
    });
    return triggered;
}

function enemyDraw(enemySprite, character, viewPortX, viewPortY, ctx, enemy) {
    if (enemy.triggered) {
        // Calculate the row position of the current direction in the sprite sheet
        const directionRow = getDirectionRow(enemy.direction, enemy.height);

        // Draw the animated enemy sprite
        ctx.drawImage(
            enemySprite,
            enemy.frameIndex * enemy.width, // Source x position based on frame index
            directionRow, // Source y position based on direction
            enemy.width,
            enemy.height,
            enemy.x + viewPortX - character.x,
            enemy.y + viewPortY - character.y,
            enemy.width,
            enemy.height
        );
    } else {
        // Draw the static enemy sprite
        ctx.drawImage(
            enemySprite,
            1 * enemy.width, // Source x position for static frame
            getDirectionRow(enemy.direction, enemy.height), // Source y position based on direction
            enemy.width,
            enemy.height,
            enemy.x + viewPortX - character.x,
            enemy.y + viewPortY - character.y,
            enemy.width,
            enemy.height
        );
    }
}