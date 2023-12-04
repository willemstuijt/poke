function allImages() {
    // Load the game world
    const imagePath = assetsPath + "images/";
    const gameWorld = new Image();
    gameWorld.src = imagePath + 'background.png';
    const worldCharacter = new Image();
    worldCharacter.src = imagePath + 'worldPlayer.png';
    const backgroundSprite = new Image();
    backgroundSprite.src = imagePath + 'battleground.png';
    const exclamationSprite = new Image();
    exclamationSprite.src = imagePath + 'exclamation.png';

    const audioPath = assetsPath + "audio/";
    const openingSong = new Audio();
    openingSong.src = audioPath + 'opening.ogg';
    const worldSong = new Audio();
    worldSong.src = audioPath + 'world.ogg';
    const battleSong = new Audio();
    battleSong.src = audioPath + 'battle.ogg';
    const encounterSong = new Audio();
    encounterSong.src = audioPath + 'encounter.ogg';
    const victorySong = new Audio();
    victorySong.src = audioPath + 'victory.ogg';
    const defeatSong = new Audio();
    defeatSong.src = audioPath + 'defeat.ogg';
    const bossBattleSong = new Audio();
    bossBattleSong.src = audioPath + 'bossBattle.ogg';
    const bossWorldSong = new Audio();
    bossWorldSong.src = audioPath + 'bossWorld.ogg';
    const bossVictorySong = new Audio();
    bossVictorySong.src = audioPath + 'bossVictory.ogg';

    const exclamationEffect = new Audio();
    exclamationEffect.src = audioPath + 'exclamation.wav';
    const attackEffect = new Audio();
    attackEffect.src = audioPath + 'attack.wav';
    const superEffective = new Audio();
    superEffective.src = audioPath + 'superEffective.wav';
    const clickEffect = new Audio();
    clickEffect.src = audioPath + 'click.wav';

    obj = {
        audio: {
            opening: openingSong,
            world: worldSong,
            battle: battleSong,
            encounter: encounterSong,
            victory: victorySong,
            defeat: defeatSong,
            bossBattle: bossBattleSong,
            bossWorld: bossWorldSong,
            bossVictory: bossVictorySong,

            exclamation: exclamationEffect,
            attack: attackEffect,
            superEffective: superEffective,
            click: clickEffect,
        },
        world: {
            background: gameWorld,
            character: worldCharacter,
            exclamation: exclamationSprite,
        },
        battles: {
            background: backgroundSprite,
        },
    };
    const allImages = findAllImages(obj, images = []);

    allEnemies.forEach(enemy => {
        enemy.battleSprite = new Image();
        enemy.battleSprite.src = imagePath + "battleEnemy/" + enemy.sprite + '.png';
        allImages.push(enemy.battleSprite);
        enemy.worldSprite = new Image();
        enemy.worldSprite.src = imagePath + "worldEnemy/" + enemy.sprite + '.png';
        allImages.push(enemy.worldSprite);
        enemy.playerSprite = new Image();
        enemy.playerSprite.src = imagePath + "battlePlayer/" + enemy.sprite + '.png';
        allImages.push(enemy.playerSprite);
    });

    obj.onLoad = waitForImages(allImages);
    return obj;
}

function findAllImages(obj, images = []) {
    // Iterate through each property in the object
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let value = obj[key];

            // Check if the property is of type Image
            if (value instanceof Image) {
                images.push(value);
            }
            // If the property is an object, recursively search it
            else if (typeof value === 'object' && value !== null) {
                findAllImages(value, images);
            }
        }
    }

    return images;
}

function waitForImages(imageObjects) {
    const promises = imageObjects.map(img => {
        return new Promise((resolve, reject) => {
            if (img.complete && img.naturalHeight !== 0) {
                // Image is already loaded
                resolve(img);
            } else {
                img.onload = () => resolve(img);
                img.onerror = reject;
            }
        });
    });

    return Promise.all(promises);
};
