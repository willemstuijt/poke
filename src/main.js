// Set up canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const assets = allImages();
initAudio(assets.audio);
const world = newWorld(assets);

let onLoadingScreen;
let onMainMenu;
let onWorld;
let onBattle;

onLoadingScreen = () => {
    loadingScreen(canvas, ctx, assets.onLoad, onMainMenu);
}

onMainMenu = () => {
    mainMenu(canvas, ctx, onWorld);
}

onWorld = () => {
    playWorld(canvas, ctx, world, onBattle);
}

onBattle = (enemy) => {
    const battle = newBattle(enemy);
    playBattle(canvas, ctx, assets, battle, onWorld);
}

// playBattle(canvas, ctx, assets, newBattle(null, null), onWorld);
disclaimer(canvas, ctx, onLoadingScreen);

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