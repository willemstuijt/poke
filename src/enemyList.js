
const allEnemies = [
    {
        name: "Huevo", // nombre en la pelea
        sprite: 'pitoman', // que imagenes usar de las que estan en images/battleEnemy, battlePlayer y worldEnemy

        boss: true, // true si despues de ganarle se acaba, se puede omitir y se asume false

        x: worldWidth * 0.5 - charWidth * 0.5, // posicion x
        y: worldHeight * 0.14, // posicion y
        direction: 'down', // direccion inicial, puede set: up, down, left, right
        autoActivate: false, // true si es que al pasar por al frente se activa solo, obligatorio

        totalHp: 100, // vida total
        moves: [ // lista de moves del enemigo, se ocupan en orden, al acabarse la lista se vuelve a repetir
            { name: "Potaso", dmg: 100 },
        ],
        encounterDialog: [ // dialogo al empezar a pelear
            "Hola!",
            "Soy un huevo!",
        ],
        rematchDialog: [ // dialogo al empezar a pelear si es que es un rematch
            "Soy un huevo!",
            "Y te aplastare de nuevo!",
        ],
        victoryDialog: [ // dialogo al ganar
            "Veo que te encanta la pichula, felicidades!",
        ],
        defeatDialog: [ // dialogo al perder
            "Chupa la corneta!",
        ],
        spaceDialog: [ // dialogo al hablarle despues de haberle ganado
            "Soy un huevo marac!",
        ],

        playerName: "Faqomero", // nombre del jugador en la pelea
        playerHp: 100, // vida del jugador en la pelea
        playerMoves: [ // poderes del jugador, se muestran en el orden que aparece
            [{ name: "Pichulazo", dmg: 100 }, { name: "Pito en el ojo", dmg: 20 }],
            [{ name: "Sec", dmg: 30 }, { name: "Pitopas", dmg: 40 }],
        ], // este es el orden de moves que hace que los ataques sean super effective, un super effective duplica el damage
        playerMoveOrder: ["Pichulazo", "Pito en el ojo", "Sec", "Pitopas"],
    },

    {
        name: "PITOMAN",
        sprite: 'group',

        x: worldWidth * 0.36,
        y: worldHeight * 0.73,
        direction: 'right',
        autoActivate: true,

        totalHp: 100,
        moves: [
            { name: "Pito", dmg: 250 },
        ],
        encounterDialog: [
            "Hola!",
            "Lindo pene!",
        ],
        victoryDialog: [
            "Veo que te encanta la pichula, felicidades!",
        ],
        defeatDialog: [
            "Chupa la corneta!",
        ],
        spaceDialog: [
            "Soy un huevo marac!",
        ],

        playerName: "Faqomero",
        playerHp: 100,
        playerMoves: [
            [{ name: "Pichulazo", dmg: 100 }, { name: "Pito en el ojo", dmg: 20 }],
            [{ name: "Sec", dmg: 30 }, { name: "Pitopas", dmg: 40 }],
        ],
        playerMoveOrder: ["Pichulazo", "Pito en el ojo", "Sec", "Pitopas"],
    },

    {
        name: "PITOMAN",
        sprite: 'pitoman',

        x: worldWidth * 0.60,
        y: worldHeight * 0.71,
        direction: 'left',
        autoActivate: true,

        totalHp: 100,
        moves: [
            { name: "Pito", dmg: 250 },
        ],
        encounterDialog: [
            "Hola!",
            "Lindo pene!",
        ],
        victoryDialog: [
            "Veo que te encanta la pichula, felicidades!",
        ],
        defeatDialog: [
            "Chupa la corneta!",
        ],
        spaceDialog: [
            "Soy un huevo marac!",
        ],

        playerName: "Faqomero",
        playerHp: 100,
        playerMoves: [
            [{ name: "Pichulazo", dmg: 100 }, { name: "Pito en el ojo", dmg: 20 }],
            [{ name: "Sec", dmg: 30 }, { name: "Pitopas", dmg: 40 }],
        ],
        playerMoveOrder: ["Pichulazo", "Pito en el ojo", "Sec", "Pitopas"],
    },

    {
        name: "PITOMAN",
        sprite: 'pitoman',

        x: worldWidth * 0.60,
        y: worldHeight * 0.59,
        direction: 'left',
        autoActivate: true,

        totalHp: 100,
        moves: [
            { name: "Pito", dmg: 250 },
        ],
        encounterDialog: [
            "Hola!",
            "Lindo pene!",
        ],
        victoryDialog: [
            "Veo que te encanta la pichula, felicidades!",
        ],
        defeatDialog: [
            "Chupa la corneta!",
        ],
        spaceDialog: [
            "Soy un huevo marac!",
        ],

        playerName: "Faqomero",
        playerHp: 100,
        playerMoves: [
            [{ name: "Pichulazo", dmg: 100 }, { name: "Pito en el ojo", dmg: 20 }],
            [{ name: "Sec", dmg: 30 }, { name: "Pitopas", dmg: 40 }],
        ],
        playerMoveOrder: ["Pichulazo", "Pito en el ojo", "Sec", "Pitopas"],
    },
];
