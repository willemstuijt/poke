
function drawMessageBackground(ctx, width, height) {
    const msgX = 0;
    const msgY = height - 150;
    const msgWidth = width;
    const msgHeight = 150;
    const borderRadius = 20;

    // Black background
    ctx.fillStyle = 'black';
    ctx.fillRect(msgX, msgY, msgWidth, msgHeight);

    // Brownish rectangle with rounded corners
    drawRoundedRect(ctx, msgX + 10, msgY + 10, msgWidth - 20, msgHeight - 20, borderRadius, 'brown', null);

    // Dark rectangle with white outline
    drawRoundedRect(ctx, msgX + 15, msgY + 15, msgWidth - 30, msgHeight - 30, borderRadius - 5, 'darkslategray', 'white', 3);
}

function drawMessageText(ctx, msg, width, height, next) {
    drawMessageBackground(ctx, width, height);
    const msgX = 0;
    const msgY = height - 150;

    var last = 'white';
    if (next) {
        last = 'red';
    }
    renderTextWithLastCharDifferent(ctx, msg, msgX + 30, msgY + 50, width - 30, 'white', last);
}

const msgBox = {
    visible: false,
    next: false, // if player can press enter for next
    message: "",
};

function renderDialogBox(canvas, ctx) {
    if (msgBox.visible) {
        drawMessageText(ctx, msgBox.message, canvas.width, canvas.height, msgBox.next);
    }
}

function showFixedDialog(tickers, dialog, wait, onDone) {
    msgBox.visible = true;
    msgBox.next = false;
    let afterWait = onDone;
    if (wait > 0 && onDone !== null) {
        afterWait = () => {
            newTimeTicker(tickers, wait, onDone);
        }
    }
    newMessageTicker(tickers, msgBox, dialog, dialog.length * 0.04, afterWait);
}

function hideDialog() {
    msgBox.message = "";
    msgBox.visible = false;
}

function showMultiTextDialog(tickers, dialogs, onDone) {
    msgBox.visible = true;

    var idx = -1;

    var listener;

    function onFinishMsg(msg) {
        msgBox.message = msgBox.message + " ▼";
        msgBox.next = true;
    }

    function next() {
        msgBox.next = false;

        idx += 1;
        if (idx == dialogs.length) {
            window.removeEventListener('keydown', listener);
            msgBox.visible = false;
            onDone();
            return;
        }
        newMessageTicker(tickers, msgBox, dialogs[idx], dialogs[idx].length * 0.04, () => onFinishMsg(dialogs[idx]));
    }

    listener = (event) => {
        if (event.key === "Enter" && msgBox.next) {
            next();
        }
    };

    window.addEventListener('keydown', listener);
    next();
}