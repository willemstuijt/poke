// Si es que se dibujan o no en el mapa
const drawCollidables = false;

// collidables contiene las weas donde uno no se puede mover
// necesitan x, y, width y height.
// pueden tener un spaceDialog que es un dialogo que ocurre
// al apretar espacio estando al frente del collidable
// hay un ejemplo lo mas abajo para el libro

const collidables = [];
// left pillars
collidables.push({
    x: worldWidth * 0.2,
    y: worldHeight * 0.35,
    width: worldWidth * 0.1,
    height: worldHeight * 0.65,
});
// right pillars
collidables.push({
    x: worldWidth * 0.7,
    y: worldHeight * 0.35,
    width: worldWidth * 0.1,
    height: worldHeight * 0.65,
});

// boss room top wall
collidables.push({
    x: 0,
    y: worldHeight * 0.06,
    width: worldWidth,
    height: worldHeight * 0.075,
});
// boss room left wall
collidables.push({
    x: worldWidth * 0.1,
    y: worldHeight * 0.07,
    width: worldWidth * 0.11,
    height: worldHeight * 0.2,
});
// boss room right wall
collidables.push({
    x: worldWidth * 0.795,
    y: worldHeight * 0.07,
    width: worldWidth * 0.11,
    height: worldHeight * 0.2,
});
// boss room bottom left wall
collidables.push({
    x: worldWidth * 0.1,
    y: worldHeight * 0.262,
    width: worldWidth * 0.275,
    height: worldHeight * 0.105,
});
// boss room bottom right wall
collidables.push({
    x: worldWidth * 0.63,
    y: worldHeight * 0.262,
    width: worldWidth * 0.275,
    height: worldHeight * 0.105,
});

const tableYOffset = [0, 0, 0, worldHeight * 0.01, worldHeight * 0.02]
for (let i = 0; i < 5; i++) {
    const leftTable = { x: worldWidth * 0.30, y: worldHeight * (0.77 - i * 0.096) + tableYOffset[i], width: worldWidth * 0.13, height: worldHeight * 0.04 };
    const riteTable = { x: worldWidth * 0.575, y: worldHeight * (0.77 - i * 0.096) + tableYOffset[i], width: worldWidth * 0.13, height: worldHeight * 0.04 };
    collidables.push(leftTable);
    collidables.push(riteTable);
}

// libros abajo
collidables.push({
    x: worldWidth * 0.42,
    y: worldHeight * 0.86,
    width: worldWidth * 0.18,
    height: worldHeight * 0.06,
    spaceDialog: [
        "Interesante libro",
    ],
});
