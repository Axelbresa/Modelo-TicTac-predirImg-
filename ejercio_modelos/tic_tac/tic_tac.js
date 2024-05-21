const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let g = tf.tensor([0, 0, 0, 0, 0, 0, 0, 0, 0]);
g.print()

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    // X o O
    const cell = e.target;
    // posicion
    const index = parseInt(cell.getAttribute('data-index'));
    const position = index + 1;
    modificar_lista(currentPlayer, position)
   
    if (board[index] === '') {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        console.log(`Jugador ${currentPlayer} ha jugado en la posición ${position}`);

        if (checkWin(currentPlayer)) {
            alert(`Jugador ${currentPlayer} gana!`);
            resetGame();
        } else if (board.every(cell => cell !== '')) {
            alert('Es un empate!');
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
    });
    console.clear()
    currentPlayer = 'X';
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);

//modelo
function modificar_lista(valor, posicion) {
    tf.ready().then(() => {
        console.log(posicion, valor)

        const modelPath = './ttt_model.json'
        tf.tidy(() => {
            tf.loadLayersModel(modelPath).then((model) => {
                let nuevoValor;

                if (valor === "X") {
                    nuevoValor = -1;
                } else if (valor === "O") {
                    nuevoValor = 1;
                } else {
                    console.log("Ocurrio un error")
                    return;
                }

                const nuevoG = g.arraySync(); // Obtenemos una copia del tensor como un array
                nuevoG[posicion-1] = nuevoValor; // Actualizamos el valor en el array según la posición

                g = tf.tensor(nuevoG); // Convertimos el array actualizado de nuevo a un tensor
                console.log('Nuevo valor de g:', g.arraySync());

                const matches = tf.stack([g])
                const result = model.predict(matches)
                // El resultado final del juego
                result.reshape([9]).print()
            })
        })
    })
}
