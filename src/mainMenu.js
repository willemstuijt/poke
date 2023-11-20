function mainMenu(canvas, ctx, onPlay) {
    setSong(audio.opening);

    // Game logo text
    const logoText = "Pokepot";

    // Menu options
    const menuOptions = ["Play Game"];
    let selectedOption = 0;

    function drawMenu() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Draw game logo
        ctx.font = "48px Arial";
        ctx.fillText(logoText, canvas.width / 2 - ctx.measureText(logoText).width / 2, 150);

        // Draw menu options
        ctx.font = "36px Arial";
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
            onPlay();
        }
    }
    // Initial draw
    drawMenu();

    // Event listener for keyboard input
    window.addEventListener('keydown', handleKeyPress);
}