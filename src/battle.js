
function newBattle(enemy) {
    return {
        worldEnemy: enemy,
        player: {
            sprite: enemy.playerSprite,
            name: enemy.playerName,
            totalHp: enemy.playerHp,
            hp: enemy.playerHp,
            superEffective: enemy.playerMoveOrder,
            moves: enemy.playerMoves,
            visible: true,
        },
        enemy: {
            sprite: enemy.battleSprite,
            name: enemy.name,
            totalHp: enemy.totalHp,
            hp: enemy.totalHp,
            moves: enemy.moves,
            victoryDialog: enemy.victoryDialog,
            defeatDialog: enemy.defeatDialog,
            visible: true,
        },
        lastMoves: [],
        tickers: [],
    }
}

function playBattle(canvas, ctx, sprites, battle, onBattleOver, onEndMenu) {
    sprites = sprites.battles;

    const tickers = battle.tickers;

    const playerW = 150;
    const playerH = 150;
    const playerPos = { visible: true, sprite: battle.player.sprite, width: playerW, height: playerH, x: canvas.width + playerW, y: canvas.height - playerH * 2 };

    const s = 1.4
    const enemyW = 100 * s;
    const enemyH = 150 * s;
    const enemyPos = { visible: true, sprite: battle.enemy.sprite, width: enemyW, height: enemyH, x: - enemyW, y: 50 };

    const player = battle.player;
    const enemy = battle.enemy;
    const moves = player.moves;

    newPositionTicker(tickers, playerPos, 150, canvas.height - playerH * 2, 1, onFinishIntro);
    newPositionTicker(tickers, enemyPos, canvas.width - 300, 50, 1, null);

    showHUD = false;

    function onFinishIntro() {
        showMultiTextDialog(tickers, [enemy.name + " would like to argue", "It is your turn"], startPlayerTurn);
    }

    var playerTurn = false;
    let selectedRow = 0;
    let selectedCol = 0;

    function startPlayerTurn() {
        showHUD = true;
        playerTurn = true;
    }

    // Update game state
    function update() {
        processTickers(tickers);
    }

    function drawMoves(moves) {
        ctx.font = '20px PressStart'; // Set your desired font
        for (let row = 0; row < moves.length; row++) {
            for (let col = 0; col < moves[row].length; col++) {
                if (row === selectedRow && col === selectedCol) {
                    ctx.fillStyle = 'yellow';
                } else {
                    ctx.fillStyle = 'white';
                }
                ctx.fillText(moves[row][col].name, 30 + col * (canvas.width - 30) / 2, canvas.height - 95 + row * 50);
            }
        }
    }

    function battleOver(lost) {
        running = false;
        window.removeEventListener('keydown', movesListener);

        if (!lost && battle.worldEnemy.boss) {
            onEndMenu(lost);
            return;
        }

        if (lost) {
            onBattleOver(battle.worldEnemy);
        } else {
            onBattleOver(null);
        }
    }

    function animateAttack(player, superEffective) {
        if (superEffective) {
            playEffect(audio.superEffective);
        } else {
            playEffect(audio.attack);
        }
        newVisibilityTicker(tickers, player, 0.8, 0.25, null);
    }

    function inflictDamage(player, dmg, onDone) {
        let final = player.hp - dmg;
        if (final <= 0) {
            final = 0;
            let dialog;
            let song;
            let lost = player !== enemy;
            if (!lost) {
                // Ganar
                song = audio.victory;
                if (battle.worldEnemy.boss) {
                    song = audio.bossVictory;
                }
                dialog = enemy.victoryDialog;
            } else {
                // Perder
                song = audio.defeat;
                dialog = enemy.defeatDialog;
            }
            onDone = () => {
                setSong(song);
                showMultiTextDialog(tickers, dialog, () => battleOver(lost));
            }
        }
        newHpTicker(tickers, player, final, 1, onDone);
    }

    let currentOpponentMove = -1
    function opponentTurn() {
        hideDialog();

        currentOpponentMove = (currentOpponentMove + 1) % enemy.moves.length;
        const move = enemy.moves[currentOpponentMove];
        showFixedDialog(tickers, enemy.name + " uses '" + move.name + "'", 0.4, () => {
            animateAttack(player, false);
            inflictDamage(player, move.dmg, () => {
                hideDialog();
                startPlayerTurn();
            });
        });
    }

    function attackOpponent(move) {
        let i = 0;
        for (; i < player.superEffective.length; i++) {
            const elem = player.superEffective[i];
            if (elem === move.name) {
                break;
            }
        }
        const suffix = player.superEffective.slice(0, i);
        // checkear si es super effective
        const superEffective = arrSuffixMatch(battle.lastMoves, suffix);

        playerTurn = false;
        showFixedDialog(tickers, player.name + " uses '" + move.name + "'", 0.8, () => {
            animateAttack(enemy, superEffective);

            let dmg = move.dmg;
            if (superEffective) {
                dmg *= 2;
            }
            let performDmg = () => {
                inflictDamage(enemy, dmg, () => {
                    opponentTurn();
                });
            };
            battle.lastMoves.push(move.name);
            if (superEffective) {
                showFixedDialog(tickers, "Its super effective!", 0, performDmg);
            } else {
                showFixedDialog(tickers, "Its not very effective.", 0, performDmg);
            }
        });
    }

    movesListener = (event) => {
        if (playerTurn) {
            switch (event.key) {
                case 'ArrowDown':
                    if (selectedRow < moves.length - 1) { selectedRow++; playEffect(audio.click); }
                    break;
                case 'ArrowUp':
                    if (selectedRow > 0) { selectedRow--; playEffect(audio.click); }
                    break;
                case 'ArrowRight':
                    if (selectedCol < moves[selectedRow].length - 1) { selectedCol++; playEffect(audio.click); }
                    break;
                case 'ArrowLeft':
                    if (selectedCol > 0) { selectedCol--; playEffect(audio.click); }
                    break;
                case 'Enter':
                case ' ':
                    attackOpponent(moves[selectedRow][selectedCol])
                    playEffect(audio.click);
                    break;
            }
        }
    };
    window.addEventListener('keydown', movesListener);

    // Render game
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.drawImage(sprites.background, 0, -100, canvas.width, canvas.height);

        playerPos.visible = player.visible;
        enemyPos.visible = enemy.visible;
        drawObject(ctx, playerPos);
        drawObject(ctx, enemyPos);

        drawMessageBackground(ctx, canvas.width, canvas.height);
        if (showHUD) {
            drawMoves(player.moves);
            drawPlayerStatus(canvas, player.name, player.totalHp, player.hp, 480, 330);
            drawPlayerStatus(canvas, enemy.name, enemy.totalHp, enemy.hp, 60, 60);
        }
        renderDialogBox(canvas, ctx);
    }

    // The main game loop
    let running = true;
    function gameLoop() {
        if (running) {
            update(); // Update the game objects
            draw();   // Draw the game objects
            requestAnimationFrame(gameLoop);
        }
    }
    gameLoop();
}

function drawPlayerStatus(canvas, name, totalHp, currentHp, x, y) {
    drawRoundedRect(ctx, x, y, 310, 110, 15, 'brown', null);
    drawRoundedRect(ctx, x + 5, y + 5, 300, 100, 10, 'darkslategray', 'white', 2);
    renderTextWithLastCharDifferent(ctx, name, x + 25, y + 45, 250, 'white', 'white');
    drawHealthBar(canvas, totalHp, currentHp, x + 25, y + 65, 250, 10);
}

function drawHealthBar(canvas, totalHp, currentHp, x, y, width, height) {
    var ctx = canvas.getContext('2d');

    // Calculate the width of the current HP bar
    var currentHpWidth = (currentHp / totalHp) * width;

    // Draw the black background with white border
    drawRoundedRect(ctx, x, y, width, height, 10, 'black', 'white', 3);

    // Draw the HP bar
    let hpColor;
    if (currentHp > totalHp * 0.5) {
        hpColor = '#00FF00'; // green
    } else if (currentHp > totalHp * 0.2) {
        hpColor = '#FFFF00'; // yellow
    } else {
        hpColor = '#FF0000'; // red
    }

    drawRoundedRect(ctx, x, y, currentHpWidth, height, 10, hpColor, null, 0);

    // Add a subtle shading to the HP bar for a nicer look
    var gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    //ctx.fillRect(x, y, currentHpWidth, height);
}
