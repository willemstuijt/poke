function disclaimer(canvas, ctx, onDone) {
    function wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // Disclaimer text
    const disclaimerText = `This game was developed by Wharton Class of 2025 Jozef Stuijt with the help Willem Stuijt (non Wharton) as the final deliverable for Wharton's Negotiation class (LGST 8060/MGMT/OIDD 6910) with Professor Cooney during the Fall of 2023. The primary purpose of this game is purely academic, serving as a demonstration of skills and understanding acquired during the course. No intention of monetization or commercial use is associated with this project.`;
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    const maxWidth = canvas.width - 20; // 20px padding on each side
    const lineHeight = 25; // Line height
    const x = 10; // Start position x
    const y = 50; // Start position y
    wrapText("Important Notice", x, y, maxWidth, lineHeight);
    wrapText(disclaimerText, x, y + lineHeight * 4, maxWidth, lineHeight);
    wrapText("Attributions", x, canvas.height - lineHeight * 7, maxWidth, lineHeight);
    wrapText("Sound by AVGVSTA and commissioned by OpenGameArt.org", x, canvas.height - lineHeight * 6, maxWidth, lineHeight);
    wrapText("Art by Stephen Challener (Redshrike) and commissioned by OpenGameArt.org", x, canvas.height - lineHeight * 5, maxWidth, lineHeight);

    // Blinking "Press ENTER to continue" text
    let blink = true;

    function drawEnterText() {
        if (blink) {
            ctx.fillStyle = 'white';
            ctx.font = '18px Arial';
            ctx.fillText('Press ENTER to continue', canvas.width - 220, canvas.height - 30);
        } else {
            ctx.clearRect(canvas.width - 220, canvas.height - 50, 210, 30);
        }
        blink = !blink;
    }

    var intervalId = setInterval(drawEnterText, 500);

    let listener = function (event) {
        if (event.key === "Enter") {
            window.removeEventListener('keydown', listener);
            clearInterval(intervalId);
            onDone();
        }
    };
    window.addEventListener('keydown', listener);
}
