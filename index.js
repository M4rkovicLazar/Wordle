const qwertyKeys = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"
];

let currentRow = 0;
let currentColumn = 0;
let currentWord = "";
let gameOver = false;
let wordForGuess = "";
const maxRows = 6;
const maxColumns = 5;
// "↵"
// "⌫"

function createTiles() {
    let gameBoard = document.getElementById('game-board');

    for (let i = 0; i < 6; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.id = "r" + i;
        for (let j = 0; j < 5; j++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = "r" + i + "c" + j;
            row.appendChild(tile);
        }
        gameBoard.appendChild(row);
    }
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

function ResetGame() {
    getWord();

    gameOver = false;
    currentColumn = 0;
    currentRow = 0;
    currentWord = "";
    wordForGuess = "";

    for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < maxColumns; col++) {
            const tile = document.getElementById(`r${row}c${col}`);
            tile.textContent = "";
            tile.className = "tile";
        }
    }
}

function GameLogic() {
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

    document.querySelectorAll(".bigger-key").forEach(button => {
        button.removeEventListener("click", keyClickHandler)
    });

    // input for enter
    let enter = document.getElementById("enter");
    enter.addEventListener("click", EnterPressed);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            EnterPressed();
        }
    });

    // input for backspace
    let backspace = document.getElementById("backspace");
    backspace.addEventListener("click", BackspacePressed);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace') {
            BackspacePressed();
        }
    });

    //game finished alert
    const tryAgainButton = document.getElementById("alert-ok");
    tryAgainButton.addEventListener("click", handleTryAgainClick);
}

async function EnterPressed() {
    const tryAgainButton = document.getElementById("alert-ok");
    tryAgainButton.addEventListener("click", handleTryAgainClick);
    if (currentWord.length == 5) {
        const valid = await isValidWord(currentWord);
        if (!valid) {
            console.log("This is not a valid word!", "Try again");
            ShakeRow();
            return;
        }
        else {
            console.log("Word is valid!");
            let colors = checkGuess(currentWord, wordForGuess);

            for (let i = 0; i < currentWord.length; i++) {
                const tile = document.getElementById(`r${currentRow}c${i}`);
                tile.classList.add(colors[i]); // "green", "yellow", or "gray"
            }
        }

        if ((currentWord.toUpperCase()) === (wordForGuess.toUpperCase())) {
            gameOver = true;
            showCustomAlert("Well done!!!", "Try again");
            return;
        }
        else if (currentRow === maxRows - 1) {
            gameOver = true;
            showCustomAlert("Good luck next time", "Try again");
            return;
        }

        if (gameOver) {
            showCustomAlert("Well done!!!", "Try again");
            return;
        }

        currentColumn = 0;
        currentRow++;
        currentWord = "";
    }
    document.getElementById("enter").disabled = true;
}

function BackspacePressed() {
    if (currentColumn > 0) {
        currentColumn--;
    }
    if (currentWord.length > 0) {
        currentWord = currentWord.slice(0, -1);
    }
    const tileId = `r${currentRow}c${currentColumn}`;
    const tile = document.getElementById(tileId);
    tile.textContent = "";

    tile.classList.remove('active');
    if (currentWord.length < 5) {
        enter.disabled = true;
    }
}

function keyClickHandler(event) {
    if (currentRow < maxRows && currentColumn < maxColumns) {
        handleLetterInput(event.target.textContent.toUpperCase());
    }
}

function handleLetterInput(letter) {
    const tileId = `r${currentRow}c${currentColumn}`;
    const tile = document.getElementById(tileId);
    const enterKey = document.getElementById("enter");
    tile.classList.add("focused-tile");
    tile.classList.add('active');

    tile.textContent = letter;
    currentColumn++;
    currentWord += letter;

    enterKey.disabled = currentWord.length != 5;
    if (currentColumn == maxColumns) {
        console.log(currentWord);
    }
}

function ShakeRow() {
    const row = document.getElementById("r" + currentRow);
    row.classList.add("shake");
    row.addEventListener("animationend", () => {
        row.classList.remove("shake");
    });
}

function showCustomAlert(message, btntxt) {
    const alertBox = document.getElementById("alert-container");
    const alertMessage = document.getElementById("alert-message");
    const alertBtn = document.getElementById("alert-ok");
    alertBtn.textContent = btntxt;
    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");
}

function handleTryAgainClick() {
    hideCustomAlert();
    ResetGame();
}

function hideCustomAlert() {
    document.getElementById("alert-container").classList.add("hidden");
}
//APIs
async function isValidWord(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toUpperCase()}`);
    return response.ok;
}

async function getWord() {
    const response = await fetch('https://random-word-api.vercel.app/api?words=1&length=5');
    const data = await response.json(); // data je niz, npr. ["APPLE"]
    wordForGuess = data[0].toUpperCase();
    console.log("Random word:", wordForGuess);
    return wordForGuess;
}

function checkGuess(guess, target) {
    const result = Array(guess.length).fill("gray");
    const targetLetters = target.split("");
    const guessLetters = guess.split("");

    // First pass: check for correct letters in correct place (green)
    for (let i = 0; i < guessLetters.length; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = "green";
            targetLetters[i] = null; // prevent duplicate match
            guessLetters[i] = null;
        }
    }

    // Second pass: check for correct letters in wrong place (yellow)
    for (let i = 0; i < guessLetters.length; i++) {
        if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
            result[i] = "yellow";
            const index = targetLetters.indexOf(guessLetters[i]);
            targetLetters[index] = null; // prevent reuse
        }
    }

    return result;
}
// GAME
function Game() {
    createTiles();
    createKeyboard();
    getWord();

    GameLogic();
}

let hintBtn = document.getElementById("hint-btn");
hintBtn.addEventListener("click", getDefinition);

async function getDefinition() {
    const tryAgainButton = document.getElementById("alert-ok");
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordForGuess}`);
        const data = await response.json();
        const firstDefinition = data[0]?.meanings[0]?.definitions[0]?.definition;

        tryAgainButton.removeEventListener("click", handleTryAgainClick);
        showCustomAlert(firstDefinition, "OK");
        tryAgainButton.addEventListener("click", hideCustomAlert);

    } catch (error) {
        showCustomAlert("Error fetching definition.", "OK");;
        console.error(error);
    }
}
let slider = document.getElementById("slider");

slider.addEventListener("click", () => {
    if (slider.classList.contains("settings-Night")) {
        slider.classList.remove("settings-Night");
        slider.classList.add("settings-Day");
    } else {
        slider.classList.remove("settings-Day");
        slider.classList.add("settings-Night");
    }
});

Game();



