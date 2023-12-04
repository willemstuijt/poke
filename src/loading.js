function loadingScreen(canvas, ctx, onLoad, onDone) {
    onLoad.then(_ => doneLoading());

    function doneLoading() {
        cancelAnimationFrame(lastFrame);
        running = false;
        onDone();
    }

    var startAngle = 0.0;
    const radius = 60;

    var lastFrame;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, startAngle, startAngle + Math.PI * 1.5);
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 10;
        ctx.stroke();

        startAngle += 0.0005;

        lastFrame = requestAnimationFrame(draw);
    }

    var running = true;
    function gameLoop() {
        if (running) {
            draw();   // Draw the game objects
            requestAnimationFrame(gameLoop);
        }
    }

    gameLoop();
}