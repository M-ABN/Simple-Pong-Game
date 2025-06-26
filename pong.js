const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 10, paddleHeight = 80;
const ballSize = 12;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;

// Game objects
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random()*2-1);
let playerScore = 0, aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Clamp paddle within canvas
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Draw functions
function drawRect(x, y, w, h, color = "#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = "#fff") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random()*2-1);
}

// AI paddle logic (follows ball with some delay)
function moveAI() {
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY) {
        aiY += 3.5;
    } else if (aiCenter > ballY) {
        aiY -= 3.5;
    }
    // Clamp within bounds
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Collision detection
function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom collision
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    } else if (ballY + ballSize > canvas.height) {
        ballY = canvas.height - ballSize;
        ballSpeedY *= -1;
    }

    // Player paddle collision
    if (collision(ballX, ballY, ballSize, ballSize, playerX, playerY, paddleWidth, paddleHeight)) {
        ballX = playerX + paddleWidth;
        ballSpeedX *= -1;
        // Add a bit of "spin" depending on where it hits paddle
        let centerPaddle = playerY + paddleHeight / 2;
        let centerBall = ballY + ballSize / 2;
        let collidePoint = centerBall - centerPaddle;
        ballSpeedY = collidePoint * 0.15;
    }

    // AI paddle collision
    if (collision(ballX, ballY, ballSize, ballSize, aiX, aiY, paddleWidth, paddleHeight)) {
        ballX = aiX - ballSize;
        ballSpeedX *= -1;
        let centerPaddle = aiY + paddleHeight / 2;
        let centerBall = ballY + ballSize / 2;
        let collidePoint = centerBall - centerPaddle;
        ballSpeedY = collidePoint * 0.15;
    }

    // Left/right wall (score)
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + ballSize > canvas.width) {
        playerScore++;
        resetBall();
    }

    moveAI();
}

function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Net
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 1, i, 2, 20, "#444");
    }

    // Paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");

    // Ball
    drawRect(ballX, ballY, ballSize, ballSize, "#fff");

    // Score
    drawText(playerScore, canvas.width/4, 50);
    drawText(aiScore, 3*canvas.width/4, 50);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();