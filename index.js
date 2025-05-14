const qwertyKeys = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "↵", "Z", "X", "C", "V", "B", "N", "M", "⌫"
];
let currentRow = 0;
let currentColumn = 0;
let currentWord = "";
const maxRows = 6;
const maxColumns = 5;
// "↵"
// "⌫"
function createTiles() {
    let gameBoard = document.getElementById('game-board');

    for (let i = 0; i < 6; i++) {
        let column = document.createElement('div');
        column.classList.add('column');
        for (let j = 0; j < 5; j++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = "r" + i + "c" + j;
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
            let button = document.createElement('button');

            key.classList.add('key');
            button.classList.add('key-btn');
            button.id = qwertyKeys[index];
            button.textContent = qwertyKeys[index++];

            key.appendChild(button);
            keyColumn.appendChild(key);
        }
        keyboard.appendChild(keyColumn);
    }

    let enter = document.getElementById(qwertyKeys[19]);
    let wrapper = enter.closest(".key");
    wrapper.classList.add('bigger-key');
    enter.id = "enter";
    let backspace = document.getElementById(qwertyKeys[27]);
    let wrapper1 = backspace.closest(".key");
    wrapper1.classList.add('bigger-key');
    backspace.id = "backspace";

    enter.disabled = true;
}

function GameLogic() {

    function handleLetterInput(letter) {
        const tileId = `r${currentRow}c${currentColumn}`;
        const tile = document.getElementById(tileId);
        const enterKey = document.getElementById("enter");

        tile.textContent = letter;
        currentColumn++;
        currentWord += letter;

        console.log(currentColumn);

        if (currentWord.length != 5) {
            enterKey.disabled = true;
        }
        else {
            enterKey.disabled = false;
        }
        console.log(tileId + " " + letter + " / " + currentWord);
    }


    // input for keyboard
    document.addEventListener("keydown", function (e) {
        if (/^[a-zA-Z]$/.test(e.key)) {
            if (currentRow < maxRows && currentColumn < maxColumns) {
                handleLetterInput(e.key.toUpperCase());
            }
        }
    });


    // input for on screen keyboard
    document.querySelectorAll(".key").forEach(button => {
        button.addEventListener("click", keyClickHandler)
    });
    function keyClickHandler(event) {
        if (currentRow < maxRows && currentColumn < maxColumns) {
            handleLetterInput(event.target.textContent.toUpperCase());
        }
    }
    document.querySelectorAll(".bigger-key").forEach(button => {
        button.removeEventListener("click", keyClickHandler)
    });


    // input for enter
    let enter = document.getElementById("enter");
    enter.addEventListener("click", EnterPressed);
    
    function EnterPressed() {
        currentColumn = 0;
        currentRow++;
        currentWord = "";
        let enterKey = document.getElementById("enter").disabled = true;
    }
    
    function BackspacePressed() {
        
    }
}




function Game() {
    createTiles();
    createKeyboard();
    
    GameLogic();


}

Game();
