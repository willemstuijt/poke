function endMenu(canvas, ctx, won, onFinish) {
    // Game logo text
    let logoText;
    if (won) {
        logoText = "Victory";
    } else {
        logoText = "Game Over";
    }

    // Menu options
    const menuOptions = ["Main Menu"];
    let selectedOption = 0;

    function drawMenu() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Draw game logo
        ctx.font = "48px PressStart";
        ctx.fillText(logoText, canvas.width / 2 - ctx.measureText(logoText).width / 2, 150);

        // Draw menu options
        ctx.font = "18px PressStart";
        menuOptions.forEach((option, index) => {
            let yPosition = 300 + index * 50;
            if (index === selectedOption) {
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillText(option, canvas.width / 2 - ctx.measureText(option).width / 2, yPosition);
        });
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            window.removeEventListener('keydown', handleKeyPress);
            onFinish();
        }
    }
    // Initial draw
    drawMenu();

    // Event listener for keyboard input
    window.addEventListener('keydown', handleKeyPress);
}