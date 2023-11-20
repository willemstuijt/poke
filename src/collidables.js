

// Check for collision
function isColliding(player, rect, x, y) {
    return (
        x < rect.x + rect.width &&
        x + player.width > rect.x &&
        y < rect.y + rect.height &&
        y + player.height > rect.y
    );
}

function canMove(collidables, player, x, y) {
    for (let i = 0; i < collidables.length; i++) {
        const ls = collidables[i];
        for (let j = 0; j < ls.length; j++) {
            if (isColliding(player, ls[j], x, y)) {
                return false;
            }
        }
    }
    return true;
}
