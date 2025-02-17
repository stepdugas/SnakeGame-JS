const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 25;
const rows = 25;
const cols = 25;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let gameOver = false;
let gameStarted = false;

document.addEventListener("keydown", function(event) {
    if (!gameStarted && event.key === " ") {
        gameStarted = true;
        gameLoop();
    }

    if (gameStarted) {
        if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    }

    // Restart game when space is pressed after game over
    if (gameOver && event.key === " ") {
        resetGame();
    }
});

function update() {
    if (!gameStarted || gameOver) return;
    
    let head = { ...snake[0] };
    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;

    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE to Start", canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over! Press SPACE to Restart", canvas.width / 2, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, 100);
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "RIGHT";
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    gameOver = false;
    gameStarted = false;
    draw();
}

// Draw initial start screen
draw();