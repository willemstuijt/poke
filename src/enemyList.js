
const allEnemies = [
    {
        name: "PITOMAN",
        sprite: 'pitoman',

        x: 300,
        y: 500,
        direction: 'right',

        totalHp: 100,
        moves: [
            { name: "Pito", dmg: 25 },
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

        playerName: "Faqomero",
        playerHp: 100,
        playerMoves: [
            [{ name: "Pichulazo", dmg: 10 }, { name: "Pito en el ojo", dmg: 20 }],
            [{ name: "Sec", dmg: 30 }, { name: "Pitopas", dmg: 40 }],
        ],
        playerMoveOrder: ["Pichulazo", "Pito en el ojo", "Sec", "Pitopas"],
    },
];
