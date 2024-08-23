const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const exitBtn = document.getElementById('exitBtn');

const box = 20;
let snake = [];
snake[0] = {x: 9 * box, y: 10 * box};

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let obstacle = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let lives = 4;
let d;

document.addEventListener('keydown', direction);
restartBtn.addEventListener('click', restartGame);
exitBtn.addEventListener('click', exitGame);

function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode === 38 && d !== 'DOWN') {
        d = 'UP';
    } else if (event.keyCode === 39 && d !== 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode === 40 && d !== 'UP') {
        d = 'DOWN';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'black';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = 'gray';
    ctx.fillRect(obstacle.x, obstacle.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score += 5;
        scoreElement.textContent = 'Score: ' + score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake) || (snakeX === obstacle.x && snakeY === obstacle.y)) {
        lives--;
        livesElement.textContent = 'Lives: ' + lives;
        if (lives === 0) {
            clearInterval(game);
            gameOverElement.classList.remove('hidden');
            return;
        }
        snake = [{x: 9 * box, y: 10 * box}];
        d = undefined;
    }

    snake.unshift(newHead);

    if (score % 50 === 0 && score !== 0) {
        clearInterval(game);
        game = setInterval(draw, 100 - Math.min(score, 90));
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    gameOverElement.classList.add('hidden');
    score = 0;
    lives = 4;
    scoreElement.textContent = 'Score: ' + score;
    livesElement.textContent = 'Lives: ' + lives;
    snake = [{x: 9 * box, y: 10 * box}];
    d = undefined;
    game = setInterval(draw, 100);
}

function exitGame() {
    window.close();
}

let game = setInterval(draw, 100);