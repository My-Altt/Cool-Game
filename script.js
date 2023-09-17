// game.js
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Game variables
let playerX = 50;
const playerY = canvas.height - 30;
const playerWidth = 20;
const playerHeight = 20;
const playerSpeed = 2;

// Obstacle variables
const obstacleWidth = 30;
const obstacleHeight = 30;
let obstacles = [];

// High score variable
let highScore = 0;

// Load the high score from storage if available
chrome.storage.sync.get(["highScore"], (result) => {
  if (result.highScore) {
    highScore = result.highScore;
  }
});

function updateGameArea() {
  clearCanvas();
  movePlayer();
  updateObstacles();
  drawPlayer();
  drawObstacles();
  checkCollision();
  updateHighScore();
  requestAnimationFrame(updateGameArea);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function movePlayer() {
  if (playerX + playerWidth < canvas.width) {
    playerX += playerSpeed;
  } else {
    playerX = -playerWidth;
  }
}

function updateObstacles() {
  // Create new obstacles at random intervals
  if (Math.random() < 0.02) {
    const obstacleX = canvas.width;
    const obstacleY = canvas.height - obstacleHeight;
    obstacles.push({ x: obstacleX, y: obstacleY });
  }

  // Move obstacles to the left
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= playerSpeed;
  }

  // Remove obstacles that are out of the canvas
  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacleWidth > 0);
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawObstacles() {
  ctx.fillStyle = "red";
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
  }
}

function checkCollision() {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    if (
      playerX < obstacle.x + obstacleWidth &&
      playerX + playerWidth > obstacle.x &&
      playerY < obstacle.y + obstacleHeight &&
      playerY + playerHeight > obstacle.y
    ) {
      // Collision detected, reset game or perform any other actions
      resetGame();
      break;
    }
  }
}

function resetGame() {
  if (playerX > highScore) {
    highScore = playerX;
    // Save the new high score to storage
    chrome.storage.sync.set({ highScore: highScore });
  }
  playerX = 50;
  obstacles = [];
}

function updateHighScore() {
  // Display the high score on the screen
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("High Score: " + highScore, 10, 30);
}

// Start the game loop
updateGameArea();
