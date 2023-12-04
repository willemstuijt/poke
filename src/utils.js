
// Helper function to get the y position of the direction row in the sprite sheet
function getDirectionRow(direction, height) {
    const directionRows = {
        'down': 0,
        'left': 1,
        'right': 2,
        'up': 3
    };
    return directionRows[direction] * height;
}
function getDirectionCol(direction, width) {
    const directionRows = {
        'down': 0,
        'right': 1,
        'up': 2,
        'left': 3
    };
    return directionRows[direction] * width;
}
function oppositeDirection(direction) {
    switch (direction) {
        case 'up': return 'down';
        case 'down': return 'up';
        case 'left': return 'right';
        case 'right': return 'left';
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();

    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth || 1;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

function renderTextWithLastCharDifferent(ctx, text, x, y, maxWidth, primaryColor, lastCharColor) {
    ctx.font = '20px PressStart'; // Set your desired font
    const lineHeight = 28; // Adjust line height as needed
    const lines = wrapText(ctx, text, maxWidth);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isLastLine = i === lines.length - 1;
        let lineToRender = line;

        // If it's the last line, render all but the last character in primary color
        if (isLastLine && line.length > 1) {
            lineToRender = line.slice(0, -1);
            ctx.fillStyle = primaryColor;
            ctx.fillText(lineToRender, x, y + i * lineHeight);

            // Render the last character in a different color
            const lastCharX = x + ctx.measureText(lineToRender).width;
            ctx.fillStyle = lastCharColor;
            ctx.fillText(line.slice(-1), lastCharX, y + i * lineHeight);
        } else {
            // Render normal lines
            ctx.fillStyle = primaryColor;
            ctx.fillText(line, x, y + i * lineHeight);
        }
    }
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine); // Push the last line into the array
    return lines;
}

function drawObject(ctx, obj) {
    if (Object.hasOwn(obj, 'visible') && !obj.visible) {
        return;
    }
    ctx.drawImage(obj.sprite, obj.x, obj.y, obj.width, obj.height);
}

function drawRelObject(ctx, character, viewPortX, viewPortY, obj) {
    ctx.drawImage(obj.sprite, obj.x + viewPortX - character.x, obj.y + viewPortY - character.y, obj.width, obj.height);
}

function arrSuffixMatch(arr, suffix) {
    if (arr.length < suffix.length) {
        return false;
    }
    for (let i = 0; i < suffix.length; i++) {
        const a = arr[arr.length - suffix.length + i];
        const b = suffix[i];
        if (a !== b) {
            return false;
        }
    }
    return true;
}