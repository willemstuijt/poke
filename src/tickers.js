
function processTickers(tickers) {
    for (let i = tickers.length - 1; i >= 0; i--) {
        const closure = tickers[i];
        if (closure()) { // If the closure returns true
            tickers.splice(i, 1); // Remove the closure from the array
        }
    }
}

function newPositionTicker(tickers, object, x, y, seconds, onFinish) {
    const startX = object.x;
    const startY = object.y;
    const distanceX = x - startX;
    const distanceY = y - startY;
    const startTime = Date.now();

    function updatePosition() {
        // Calculate how much time has passed
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

        // Check if the animation is complete
        if (elapsedTime >= seconds) {
            object.x = x;
            object.y = y;
            if (onFinish !== null) {
                onFinish();
            }
            return true; // Stop the animation
        }

        // Calculate the new position
        const fraction = elapsedTime / seconds;
        object.x = startX + distanceX * fraction;
        object.y = startY + distanceY * fraction;
        return false;
    }
    tickers.push(updatePosition);
}

function newPositionHeightTicker(tickers, object, y, h, seconds, onFinish) {
    const startY = object.y;
    const startH = object.height;
    const distanceY = y - startY;
    const distanceH = h - startH;
    const startTime = Date.now();

    function updatePosition() {
        // Calculate how much time has passed
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

        // Check if the animation is complete
        if (elapsedTime >= seconds) {
            object.y = y;
            object.height = h;
            if (onFinish !== null) {
                onFinish();
            }
            return true; // Stop the animation
        }

        // Calculate the new position
        const fraction = elapsedTime / seconds;
        object.y = startY + distanceY * fraction;
        object.height = startH + distanceH * fraction;
        return false;
    }
    tickers.push(updatePosition);
}

function newMessageTicker(tickers, object, targetString, seconds, onFinish) {
    const startTime = Date.now();

    function updateMessage() {
        // Calculate how much time has passed
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

        // Check if the animation is complete
        if (elapsedTime >= seconds) {
            object.message = targetString;
            if (onFinish !== null) {
                onFinish();
            }
            return true; // Stop the animation
        }

        const fraction = elapsedTime / seconds;
        const charIndex = Math.floor(fraction * targetString.length);
        object.message = targetString.substring(0, charIndex);
        return false;
    }
    tickers.push(updateMessage);
}

function newTimeTicker(tickers, seconds, onFinish) {
    const startTime = Date.now();

    function updatePosition() {
        // Calculate how much time has passed
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

        // Check if the animation is complete
        if (elapsedTime >= seconds) {
            if (onFinish !== null) {
                onFinish();
            }
            return true; // Stop the animation
        }

        return false;
    }
    tickers.push(updatePosition);
}

function newHpTicker(tickers, object, hp, seconds, onFinish) {
    const startHp = object.hp;
    const distanceHp = hp - startHp;
    const startTime = Date.now();

    function updatePosition() {
        // Calculate how much time has passed
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

        // Check if the animation is complete
        if (elapsedTime >= seconds) {
            object.hp = hp;
            if (onFinish !== null) {
                onFinish();
            }
            return true; // Stop the animation
        }

        // Calculate the new position
        const fraction = elapsedTime / seconds;
        object.hp = startHp + distanceHp * fraction;
        return false;
    }
    tickers.push(updatePosition);
}

function newVisibilityTicker(tickers, object, seconds, flickerInterval, onFinish) {
    const startTime = Date.now();

    let counter = 0;
    function updateVisibility() {
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

        // Check if the animation is complete
        if (elapsedTime >= seconds) {
            object.visible = true; // Ensure the object is visible at the end
            if (onFinish !== null) {
                onFinish();
            }
            return true; // Stop the animation
        }

        const currentTime = (Date.now() - startTime) / 1000;
        if (currentTime % flickerInterval < flickerInterval / 2) {
            // Turn visibility on for the first half of the interval
            object.visible = true;
        } else {
            // Turn visibility off for the second half of the interval
            object.visible = false;
        }

        return false;
    }

    tickers.push(updateVisibility);
}

function newColorTicker(tickers, object, seconds, flickerInterval, onFinish) {
    const startTime = Date.now();

    let counter = 0;
    function updateVisibility() {
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds

        // Check if the animation is complete
        if (elapsedTime >= seconds) {
            object.color = 'transparent'; // Ensure the object is visible at the end
            if (onFinish !== null) {
                onFinish();
            }
            return true; // Stop the animation
        }

        const currentTime = (Date.now() - startTime) / 1000;
        const colors = ['black', 'black', 'white', 'black', 'black', 'transparent', 'black', 'black'];
        for (let i = 0; i < colors.length; i++) {
            const element = colors[i];
            if (currentTime % flickerInterval < flickerInterval * ((i + 1) / colors.length)) {
                object.color = element;
                break;
            }
        }

        return false;
    }

    tickers.push(updateVisibility);
}
