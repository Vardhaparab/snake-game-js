let board = document.querySelector(".board");
let startBtn = document.querySelector(".btn-start");
let modal = document.querySelector(".modal");
let startgame = document.querySelector(".start-game");
let endgame = document.querySelector(".game-over");
let resbtn = document.querySelector(".btn-end");
let highscoreElem = document.querySelector("#high-score");
let scoreElem = document.querySelector("#score");
let timeElem = document.querySelector("#time");

let cellWidth = 25;
let cellHeight = 25;
let gameInterval = null;
let timeInterval = null;
let isGameOver = false;
let highScore = parseInt(localStorage.getItem("highScore:")) || 0;
highscoreElem.textContent = highScore;
let score = 0;
let time ="00:00";
// console.log(board.clientHeight);

let columns = Math.floor(board.clientWidth / cellWidth);
let rows = Math.floor(board.clientHeight / cellHeight);
let blocks = {};

let snake = [
    { x: 1, y: 4 },
]

let direction = { x: 0, y: 1 };

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * columns)
}

for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
        let block = document.createElement("div");
        board.appendChild(block);
        block.classList.add("block");
        blocks[`${row}-${column}`] = block;
    }
}

function render() {
    Object.values(blocks).forEach(block => {
        block.classList.remove("fill");
        block.classList.remove("food");
    })
    snake.forEach((cell) => {
        blocks[`${cell.x}-${cell.y}`].classList.add("fill");
    })

    blocks[`${food.x}-${food.y}`].classList.add("food");
}

function moveSnake() {
    if (isGameOver) return;
    let newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    }
    // console.log(newHead);
    // console.log(snake);

    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        do {
            food = {
                x: Math.floor(Math.random() * rows),
                y: Math.floor(Math.random() * columns)
            }
        } while (snake.some(cell => cell.x === food.x && cell.y === food.y));
        score+=10;
        scoreElem.textContent = score;
        console.log(score);
        if(score >highScore){
            highScore = score;
            highscoreElem.textContent = highScore;
            localStorage.setItem("highScore:",highScore);
        }
    }
    else {
        snake.pop();
    }

    if (newHead.x < 0 || newHead.x >= rows || newHead.y < 0 || newHead.y >= columns ||
        snake.some((cell, index) => index !== 0 && cell.x === newHead.x && cell.y === newHead.y)) {
        isGameOver = true;
        clearInterval(gameInterval);
        modal.style.display = "flex";
        startgame.style.display = "none";
        endgame.style.display = "flex";
        return;
    }
}


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && direction.x !== -1) {
        direction = {
            x: 1,
            y: 0
        }
    }
    else if (e.key === "ArrowUp" && direction.x !== 1) {
        direction = {
            x: -1,
            y: 0
        }
    }
    else if (e.key === "ArrowLeft" && direction.y !== 1) {
        direction = {
            x: 0,
            y: -1
        }
    }
    else if (e.key === "ArrowRight" && direction.y !== -1) {
        direction = {
            x: 0,
            y: 1
        }
    }
})

resbtn.addEventListener("click", restartGame);

function restartGame() {
    modal.style.display = "none";
    startgame.style.display = "none";
    endgame.style.display = "none";
    snake = [
        { x: 1, y: 4 },
    ];
    direction = { x: 0, y: 1 };
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * columns)
    };
    score =0;
    time = "00-00";
    scoreElem.textContent = score;
    highscoreElem.textContent = highScore;

    startGame();
}

function startGame() {
    clearInterval(gameInterval);
    isGameOver = false;
    gameInterval = setInterval(() => {
        moveSnake();
        render();
    }, 300);
    timeInterval = setInterval(()=>{
        let [min,sec] = time.split(":").map(Number);
        if(sec == 59){
            min+=1;
            sec=0;
        }
        else{
            sec++;
        }

        time =`${min}:${sec}`;
        timeElem.textContent = time;
    },1000);
}

startBtn.addEventListener("click", () => {
    modal.style.display = "none";
    startGame();
});