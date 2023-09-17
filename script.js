const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const EMPTY = "white";

// Create an empty game board
const boardArray = Array.from({ length: ROWS }, () =>
  Array(COLUMNS).fill(EMPTY)
);

function drawBoard() {
  board.innerHTML = "";
  boardArray.forEach((row) => {
    row.forEach((cell) => {
      const block = document.createElement("div");
      block.style.width = BLOCK_SIZE + "px";
      block.style.height = BLOCK_SIZE + "px";
      block.style.backgroundColor = cell;
      board.appendChild(block);
    });
  });
}

drawBoard();

// Define Tetrominoes
const tetrominoes = {
  I: [
    [1, 1, 1, 1],
  ],
  J: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  L: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

// Function to generate a random tetromino
function randomTetromino() {
  const tetrominoNames = Object.keys(tetrominoes);
  const randomIndex = Math.floor(Math.random() * tetrominoNames.length);
  const tetrominoName = tetrominoNames[randomIndex];
  return tetrominoes[tetrominoName];
}

// Create the current tetromino
let currentTetromino = randomTetromino();
let currentX = 3;
let currentY = 0;

// Draw the current tetromino on the board
function drawTetromino() {
  currentTetromino.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const block = document.createElement("div");
        block.style.width = BLOCK_SIZE + "px";
        block.style.height = BLOCK_SIZE + "px";
        block.style.backgroundColor = "blue";
        block.style.position = "absolute";
        block.style.top = (currentY + y) * BLOCK_SIZE + "px";
        block.style.left = (currentX + x) * BLOCK_SIZE + "px";
        board.appendChild(block);
      }
    });
  });
}

// Clear the current tetromino from the board
function clearTetromino() {
  Array.from(board.children).forEach((child) => {
    child.remove();
  });
}

// Move the current tetromino down
function moveDown() {
  currentY++;
  if (checkCollision()) {
    currentY--;
    placeTetromino();
    clearLines();
    currentTetromino = randomTetromino();
    currentX = 3;
    currentY = 0;
    if (checkCollision()) {
      // Game over
      alert("Game Over");
      boardArray.forEach((row) => row.fill(EMPTY));
      drawBoard();
    }
  }
  clearTetromino();
  drawTetromino();
}

// Place the current tetromino on the board
function placeTetromino() {
  currentTetromino.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        boardArray[currentY + y][currentX + x] = "blue";
      }
    });
  });
  drawBoard();
}

// Check for collisions (boundary or other blocks)
function checkCollision() {
  for (let y = 0; y < currentTetromino.length; y++) {
    for (let x = 0; x < currentTetromino[y].length; x++) {
      if (
        currentTetromino[y][x] &&
        (boardArray[currentY + y] && boardArray[currentY + y][currentX + x]) !== EMPTY
      ) {
        return true;
      }
    }
  }
  return false;
}

// Move the current tetromino left
function moveLeft() {
  currentX--;
  if (checkCollision()) {
    currentX++;
  }
  clearTetromino();
  drawTetromino();
}

// Move the current tetromino right
function moveRight() {
  currentX++;
  if (checkCollision()) {
    currentX--;
  }
  clearTetromino();
  drawTetromino();
}

// Rotate the current tetromino
function rotate() {
  const rotatedTetromino = currentTetromino[0].map((_, index) =>
    currentTetromino.map((row) => row[index]).reverse()
  );
  if (
    currentX < 0 ||
    currentX + rotatedTetromino[0].length > COLUMNS ||
    currentY + rotatedTetromino.length > ROWS ||
    checkCollision(rotatedTetromino)
  ) {
    return;
  }
  currentTetromino = rotatedTetromino;
  clearTetromino();
  drawTetromino();
}

// Event listeners for keyboard controls
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    moveDown();
  } else if (event.key === "ArrowLeft") {
    moveLeft();
  } else if (event.key === "ArrowRight") {
    moveRight();
  } else if (event.key === "ArrowUp") {
    rotate();
  }
});

// Game loop
function gameLoop() {
  moveDown();
  setTimeout(gameLoop, 1000);
}

gameLoop();
