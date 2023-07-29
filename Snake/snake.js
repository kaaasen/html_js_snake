// Constants
const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const cellSize = 20;
const gridSize = 20;
const appleScore = 10;
const chompSound = new Audio('sounds/music.mp3');
const music = new Audio('sounds/music.mp3');

// Variables
let snake = [{x: 10, y: 10}];
let direction = 'right';
let apple = null;
let score = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;
let snakeSpeed = 100;

// Initialize game board
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.style.gridColumn = col + 1;
        cell.style.gridRow = row + 1;
        board.appendChild(cell);
    }
}

// Set up keyboard controls
document.addEventListener('keydown', event => {
    if (!gameStarted) {
        gameStarted = true;
        gameLoop();
    }
    if (event.code === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    }
    if (event.code === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
    if (event.code === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
    if (event.code === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    }
});

// Main game loop
function gameLoop() {
    // Move the snake
    const head = {x: snake[0].x, y: snake[0].y};
    if (direction === 'up') {
        head.y--;
    }
    if (direction === 'right') {
        head.x++;
    }
    if (direction === 'down') {
        head.y++;
    }
    if (direction === 'left') {
        head.x--;
    }
    snake.unshift(head);
    snake.pop();

    // Check for collisions with walls
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }

    // Check for collisions with snake's body
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Check for collision with apple
    if (apple && head.x === apple.x && head.y === apple.y) {
        score += appleScore;
        scoreEl.textContent = 'Score: ' + score;
        spawnApple();
        snake.push(snake[snake.length - 1]); // Grow snake
        chompSound.play();
    }

    // Update game board
    const cells = board.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('snake', 'apple'));
    snake.forEach(segment => {
        const index = segment.y * gridSize + segment.x;
        const cell = cells[index];
        cell.classList.add('snake');
    });
    if (apple) {
        const index = apple.y * gridSize + apple.x;
        const cell = cells[index];
        cell.classList.add('apple');
    }

    // Update timer
    timer++;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerEl.textContent = padZero(minutes) + ':' + padZero(seconds);

    // Schedule next game loop iteration
    setTimeout(gameLoop, snakeSpeed);
}

// Helper function to pad a number with leading zeros
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Helper function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Spawn a new apple at a random location
function spawnApple() {
    do {
      apple = {
        x: getRandomInt(0, gridSize - 1),
        y: getRandomInt(0, gridSize - 1),
      };
    } while (snake.some(segment => segment.x === apple.x && segment.y === apple.y));
  }  

// Start a new game
function startGame() {
    // Reset variables
    snake = [{x: 10, y: 10}];
    direction = 'up';
    apple = null;
    score = 0;
    timer = 0;
    scoreEl.textContent = 'Score: 0';
    timerEl.textContent = '00:00';
  
    // Spawn initial apple
    spawnApple();
  
    // Add initial snake
    const cells = board.querySelectorAll('.cell');
    const initialSnakeCellIndex = snake[0].y * gridSize + snake[0].x;
    const initialSnakeCell = cells[initialSnakeCellIndex];
    initialSnakeCell.classList.add('snake');
  
    // Start timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
      timer++;
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      timerEl.textContent = padZero(minutes) + ':' + padZero(seconds);
    }, 1000);
  
    // Start game loop
    //gameLoop();
  
    // Add event listener to music object
    music.addEventListener('canplaythrough', function() {
      music.play();
    });
  }
  

// End the game and display the game over message
function gameOver() {
  clearInterval(timerInterval);

  // Create game over message element
  const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = 'Game over! Your score is ' + score;
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.zIndex = '9999';
    gameOverMessage.style.fontSize = '3rem';
    gameOverMessage.style.color = '#d10000';
    gameOverMessage.style.backgroundColor = '#000118';
    gameOverMessage.style.padding = '30px';
    gameOverMessage.style.borderRadius = '20px';
    gameOverMessage.style.border = '5px solid #e95d00';

  // Create Set difficulty button element - easier
  const easierButton = document.createElement('button');
  easierButton.textContent = 'Difficulty: Easier';
  easierButton.addEventListener('click', () => {
    snakeSpeed = snakeSpeed * 2;
  });

  // Create Set difficulty button element - easier
  const harderButton = document.createElement('button');
  harderButton.textContent = 'Difficulty: Harder';
  harderButton.addEventListener('click', () => {
    snakeSpeed = snakeSpeed / 2;
  });

  // Create Start over button element
  const startOverButton = document.createElement('button');
  startOverButton.textContent = 'Start over';
  startOverButton.addEventListener('click', () => {
    // Remove game over message and Start over button elements
    gameOverMessage.remove();
    startOverButton.remove();
    // Start a new game
    gameStarted = false;
    startGame();
  });

  // Add event listeners for arrow keys
  document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      startOver();
    }
  });

  // Append Start over button element to game over message element
  gameOverMessage.appendChild(easierButton);
  gameOverMessage.appendChild(startOverButton);
  gameOverMessage.appendChild(harderButton);

  // Append game over message element to board element
  board.appendChild(gameOverMessage);
}

// Start the game when the page loads
window.addEventListener('load', startGame);

// Restart the game when the "Start over" button is clicked
/*const startOverButton = document.createElement('button');
startOverButton.textContent = 'Start over';
startOverButton.style.display = 'block';
startOverButton.style.margin = '0 auto';
startOverButton.addEventListener('click', startGame);
document.body.appendChild(startOverButton);*/

// Get all the snake elements
const snakeElements = document.querySelectorAll('.snake');