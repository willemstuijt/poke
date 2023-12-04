
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
        enemy.frameIndex = 0;
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

function floatEq(a, b) {
    return Math.abs(a - b) <= 1.5;
}

// Check for enemy encounters
function checkForEncounters(character, enemies) {
    var triggered = null;
    enemies.forEach(enemy => {
        if (!enemy.triggered && enemy.autoActivate) {
            // Check if the player is in front of the enemy based on enemy's direction
            let inFront = false;
            switch (enemy.direction) {
                case 'up':
                    inFront = floatEq(character.x, enemy.x) && character.y < enemy.y;
                    enemy.triggerDist = character.y - enemy.y;
                    break;
                case 'down':
                    inFront = floatEq(character.x, enemy.x) && character.y > enemy.y;
                    enemy.triggerDist = character.y - enemy.y;
                    break;
                case 'left':
                    inFront = floatEq(character.y, enemy.y) && character.x < enemy.x;
                    enemy.triggerDist = character.x - enemy.x;
                    break;
                case 'right':
                    inFront = floatEq(character.y, enemy.y) && character.x > enemy.x;
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
    if (enemy.triggered || enemy.returning) {

        // Draw the animated enemy sprite
        ctx.drawImage(
            enemySprite,

            getDirectionCol(enemy.direction, enemy.frameW),
            enemy.frameIndex * enemy.frameH,

            enemy.frameW,
            enemy.frameH,
            enemy.x + viewPortX - character.x,
            enemy.y + viewPortY - character.y,
            enemy.width,
            enemy.height
        );
    } else {
        // Draw the static enemy sprite
        ctx.drawImage(
            enemySprite,

            getDirectionCol(enemy.direction, enemy.frameW),
            0 * enemy.frameH,

            enemy.frameW,
            enemy.frameH,
            enemy.x + viewPortX - character.x,
            enemy.y + viewPortY - character.y,
            enemy.width,
            enemy.height
        );
    }
}