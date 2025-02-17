const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 27;
const rows = 27;
const cols = 27;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let gameOver = false;
let gameStarted = false; // NEW: Controls whether the game starts

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
    const key = event.key;

    if (!gameStarted && key === " ") {
        gameStarted = true;
        gameLoop(); // Start the game loop when space bar is pressed
    } 

    if (gameStarted) {
        if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    }
}

function update() {
    if (!gameStarted || gameOver) return; // Don't update if game hasn't started

    let head = { ...snake[0] };
    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;

    // Check for collisions
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
    }

    snake.unshift(head);

    // Check if snake eats food
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
        // Show start screen message
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Press SPACE to Start", canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Game Over! Press SPACE to Restart", canvas.width / 2 - 120, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, 100);
    } else {
        // Restart game when space bar is pressed after game over
        document.addEventListener("keydown", function(event) {
            if (event.key === " ") {
                resetGame();
            }
        });
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

// Initial draw to show the start screen before the game begins
draw();