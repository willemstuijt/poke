// Set up canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const assets = allImages();
initAudio(assets.audio);
let world = newWorld(assets);

let onLoadingScreen;
let onMainMenu;
let onWorld;
let onBattle;
let onEndMenu;

onLoadingScreen = () => {
    loadingScreen(canvas, ctx, assets.onLoad, onMainMenu);
}

onMainMenu = () => {
    mainMenu(canvas, ctx, () => onWorld(null));
}

onWorld = (lostAgainst) => {
    playWorld(canvas, ctx, world, onBattle, lostAgainst);
}

onBattle = (enemy) => {
    const battle = newBattle(enemy);
    playBattle(canvas, ctx, assets, battle, onWorld, onEndMenu);
}

onEndMenu = (lost) => {
    world = newWorld(assets);
    endMenu(canvas, ctx, !lost, onMainMenu);
}

// playBattle(canvas, ctx, assets, newBattle(null, null), onWorld);
document.fonts.load('20px "PressStart"').then(function () {
    onWorld(null);
    //disclaimer(canvas, ctx, onLoadingScreen);
});

// // New function to start a battle
// function startBattle(enemy) {
//     console.log('Battle started with enemy at position:', enemy.x, enemy.y);
//     // Here you would switch to your battle scene, for now we just log to the console
//     // You can set up the battleCanvas here and switch the display when needed
// }




// gameWorld.onload = function () {
//     // Start the game loop once the game world has loaded
//     requestAnimationFrame(gameLoop);
// };