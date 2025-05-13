const qwertyKeys = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
     "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "↵", "Z", "X", "C", "V", "B", "N", "M", "⌫"
];

function createTiles() {
    let gameBoard = document.getElementById('game-board');

    for (let i = 0; i < 6; i++) {
        let column = document.createElement('div');
        column.classList.add('column');
        for (let j = 0; j < 5; j++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.i = i;
            tile.dataset.j = j;
            column.appendChild(tile);
        }
        gameBoard.appendChild(column);
    }
    console.log(`GG ez`);
}

function createKeyboard() {
    let index = 0;
    let num = 10;
    let keyboard = document.getElementById('keyboard');
    for (let i = 0; i < 3; i++) {
        if (i == 1) { num--; }
        let keyColumn = document.createElement('div');
        keyColumn.classList.add('key-row');

        for (let j = 0; j < num; j++) {
                let key = document.createElement('div');
                key.classList.add('key');
                let button = document.createElement('button');
                button.classList.add('key-btn');
                button.innerText = qwertyKeys[index++];
                key.appendChild(button);
                keyColumn.appendChild(key);
            if ((i == 2 && j == 0) || (i == 2 && j == 8))
            {
                key.classList.add('bigger-key');
            }
        }
        keyboard.appendChild(keyColumn);
    }

    
    
}
createTiles();
createKeyboard();