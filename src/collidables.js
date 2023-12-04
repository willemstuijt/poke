

// Check for collision
function isColliding(player, rect, x, y) {
    const pad = 8;
    return (
        x < rect.x + rect.width - pad &&
        x + player.width > rect.x + pad &&
        y < rect.y + rect.height - pad &&
        y + player.height > rect.y + pad
    );
}

function isCollidingInFront(player, rect, x, y) {
    switch (player.direction) {
        case 'up': y -= player.height * 0.7; break;
        case 'down': y += player.height * 0.7; break;
        case 'left': x -= player.width * 0.7; break;
        case 'right': x += player.width * 0.7; break;
    }
    return isColliding(player, rect, x, y);
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

function canActivate(collidables, player, x, y) {
    for (let i = 0; i < collidables.length; i++) {
        const ls = collidables[i];
        for (let j = 0; j < ls.length; j++) {
            if ((Object.hasOwn(ls[j], 'spaceDialog') || Object.hasOwn(ls[j], 'triggered')) && isCollidingInFront(player, ls[j], x, y)) {
                return ls[j];
            }
        }
    }
    return null;
}
