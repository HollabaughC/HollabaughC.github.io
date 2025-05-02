window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const gameOverDiv = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
  
    const snakeSize = 20;
    let snake = [{ x: 160, y: 160 }];
    let direction = 'RIGHT';
    let food = spawnFood();
    let gameInterval;
    let isGamePaused = false;
    let currentScore = 0;
    let highScore = getHighScore();
  
    // Update high score display
    highScoreDisplay.innerHTML = `High Score: ${highScore}`;
  
    // Snake movement control
    const directions = {
      'UP': { x: 0, y: -snakeSize },
      'DOWN': { x: 0, y: snakeSize },
      'LEFT': { x: -snakeSize, y: 0 },
      'RIGHT': { x: snakeSize, y: 0 }
    };
  
    // Game functions
    function updateGame() {
      if (isGamePaused) return;
  
      const head = { ...snake[0] };
      head.x += directions[direction].x;
      head.y += directions[direction].y;
  
      // Collision with walls or itself
      if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        gameOver();
        return;
      }
  
      snake.unshift(head);
  
      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        scoreDisplay.innerHTML = `Score: ${currentScore}`;
        food = spawnFood();
        if (currentScore > highScore) {
          highScore = currentScore;
          setHighScore(highScore);
        }
      } else {
        snake.pop();
      }
  
      drawGame();
    }
  
    function drawGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw snake
      snake.forEach(segment => {
        ctx.fillStyle = '#8A6FC9';
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
      });
  
      // Draw food
      ctx.fillStyle = '#FF6347';
      ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    }
  
    function collision(head) {
      return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
    }
  
    function gameOver() {
      clearInterval(gameInterval);
      finalScoreDisplay.innerHTML = currentScore;
      gameOverDiv.style.display = 'block';
      document.body.style.overflow = 'auto'; // Allow scrolling when game over
    }
  
    function spawnFood() {
      const x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
      const y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
      return { x, y };
    }
  
    // High score functions (cookies)
    function getHighScore() {
      return parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)highscore\s*\=\s*([^;]*).*$)|^.*$/, "$1")) || 0;
    }
  
    function setHighScore(score) {
      document.cookie = `highscore=${score};path=/;max-age=31536000`; // Store for one year
      highScoreDisplay.innerHTML = `High Score: ${score}`;
    }
  
    // Event listeners
    startBtn.addEventListener('click', () => {
      resetGame();
      gameInterval = setInterval(updateGame, 150); // Set slower game speed
      startBtn.disabled = true; // Disable start button during the game
      document.body.style.overflow = 'hidden'; // Disable scrolling when game starts
      gameOverDiv.style.display = 'none'; // Hide the game over message
    });
  
    pauseBtn.addEventListener('click', () => {
      isGamePaused = !isGamePaused;
      pauseBtn.innerText = isGamePaused ? 'Resume' : 'Pause';
    });
  
    resetBtn.addEventListener('click', () => {
      resetGame();
      gameOverDiv.style.display = 'none'; // Hide the game over message when reset
      startBtn.disabled = false; // Enable start button again
      document.body.style.overflow = 'auto'; // Allow scrolling when game is reset
    });
  
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
      if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
      if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  
      // Prevent default scrolling behavior while the game is active
      if (document.body.style.overflow === 'hidden') {
        e.preventDefault();
      }
    });
  
    // Reset the game state
    function resetGame() {
      snake = [{ x: 160, y: 160 }];
      direction = 'RIGHT';
      food = spawnFood();
      currentScore = 0;
      scoreDisplay.innerHTML = `Score: ${currentScore}`;
      drawGame();
    }
  
    drawGame(); // Initial drawing of the game
  });
  