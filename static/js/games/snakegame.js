// ============================================
// SNAKE GAME - RECREADO DESDE CERO
// ============================================

// Variables del juego
let canvas = null;
let ctx = null;

// Configuración del Tablero
const TILE_SIZE = 25; 
let TILE_COUNT = 20; 
const GAME_SPEED = 250; 

// Variables de Juego
let snake = [];
let dx = 1; 
let dy = 0; 
let lives = 4;
let level = 1;
let score = 0;
let maxScore = 15;
let questionsSolved = 0;
let maxQuestions = 5;
let currentResult = 0; 
let foodOptions = []; 
let changingDirection = false;
let gameRunning = false;
let gameOverShown = false;
let gameCompleted = false;
let gameLoopId = null;

// Variables de audio
let backgroundMusic = null;
let correctSound = null;
let incorrectSound = null;
let victorySound = null;
let musicVolume = 0.5;

// Variable para animación
let animationFrame = 0;

// ============================================
// INICIALIZACIÓN
// ============================================

function initGame() {
  console.log('Inicializando juego...');
  createGameInterface();
  setTimeout(() => {
    startGame();
  }, 100);
}

function createGameInterface() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) {
    console.error('game-container no encontrado');
    return;
  }
  
  // Debug: Verificar gameConfig
  console.log('gameConfig completo:', window.gameConfig);
  console.log('lifeImageUrl:', window.gameConfig?.lifeImageUrl);
  console.log('musicUrl:', window.gameConfig?.musicUrl);
  
  gameContainer.innerHTML = `
    <div class="game-wrapper">
      <div class="game-header">
        <h2 class="game-title"><i class="bx bx-game"></i> Snake Matemático</h2>
        <div class="game-info">
          <div class="info-row">
            <div class="level-display" id="levelDisplay"><i class="bx bx-trophy"></i> Nivel: 1 (Sumas)</div>
            <div class="score-display">
              <i class="bx bx-star"></i>
              <span>Puntos: <strong id="current-score">${score}</strong>/<strong>${maxScore}</strong></span>
            </div>
            <div class="lives-display" id="livesDisplay"></div>
          </div>
        </div>
      </div>
      
      <div class="game-content">
        <div class="question-display" id="questionDisplay">Pregunta: Calculando...</div>
        <canvas id="gameCanvas" width="500" height="500"></canvas>
      </div>
      
      <div class="game-controls">
        <i class="fullscreen-icon" id="fullscreen-btn" title="Pantalla completa">
          <i class="fas fa-expand" id="fullscreen-icon-inner"></i>
        </i>
        <div class="music-control" id="music-control" title="Control de música">
          <i class="bx bx-volume-full" id="music-icon"></i>
          <input type="range" id="volume-slider" min="0" max="100" value="${musicVolume * 100}" class="volume-slider">
        </div>
      </div>
    </div>
  `;

  // Inicializar canvas
  canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    console.error('Canvas no encontrado');
    return;
  }
  ctx = canvas.getContext("2d");
  
  // Asegurar visibilidad
  canvas.style.display = 'block';
  canvas.style.visibility = 'visible';
  canvas.style.opacity = '1';
  
  const gameWrapper = document.querySelector('.game-wrapper');
  if (gameWrapper) {
    gameWrapper.style.display = 'flex';
    gameWrapper.style.visibility = 'visible';
    gameWrapper.style.opacity = '1';
  }
  
  // Ajustar tamaño del canvas
  setTimeout(() => {
    adjustCanvasSize();
  }, 200);
  
  // Calcular TILE_COUNT
  TILE_COUNT = Math.floor(canvas.width / TILE_SIZE);
  if (TILE_COUNT < 10) TILE_COUNT = 10;
  if (TILE_COUNT > 30) TILE_COUNT = 30;

  // Configurar componentes
  setupFullscreenButton();
  initAudio();
  setupVolumeControl();
  
  // Esperar un momento para asegurar que gameConfig esté disponible
  setTimeout(() => {
    updateLivesDisplay();
  }, 100);
}

function adjustCanvasSize() {
  const gameContent = document.querySelector('.game-content');
  const gameWrapper = document.querySelector('.game-wrapper');
  if (!gameContent || !gameWrapper) return;
  
  const header = gameWrapper.querySelector('.game-header');
  const controls = gameWrapper.querySelector('.game-controls');
  const questionDisplay = gameContent.querySelector('.question-display');
  
  const headerHeight = header ? header.offsetHeight : 120;
  const controlsHeight = controls ? controls.offsetHeight : 50;
  const questionHeight = questionDisplay ? questionDisplay.offsetHeight : 50;
  const wrapperPadding = 24;
  const contentGap = 20;
  
  const availableHeight = gameWrapper.offsetHeight - headerHeight - controlsHeight - questionHeight - wrapperPadding - contentGap - 10;
  const availableWidth = gameContent.offsetWidth - 20;
  
  const maxSize = Math.min(availableHeight, availableWidth, 520);
  
  if (maxSize > 300 && canvas) {
    canvas.width = maxSize;
    canvas.height = maxSize;
    TILE_COUNT = Math.floor(canvas.width / TILE_SIZE);
    if (TILE_COUNT < 10) TILE_COUNT = 10;
    if (TILE_COUNT > 30) TILE_COUNT = 30;
    
    if (gameRunning && snake.length > 0) {
      spawnFoods(currentResult);
    }
  }
}

// Ajustar canvas cuando cambia el tamaño de la ventana
window.addEventListener('resize', adjustCanvasSize);

// ============================================
// CONTROL DEL JUEGO
// ============================================

function startGame() {
  console.log('Iniciando juego...');
  
  // Detener cualquier juego anterior
  stopGame();
  
  // Asegurar visibilidad
  if (canvas) {
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
  }
  
  const gameWrapper = document.querySelector('.game-wrapper');
  if (gameWrapper) {
    gameWrapper.style.display = 'flex';
    gameWrapper.style.visibility = 'visible';
    gameWrapper.style.opacity = '1';
  }
  
  // Resetear variables
  gameRunning = true;
  gameOverShown = false;
  gameCompleted = false;
  score = 0;
  lives = 4;
  level = 1;
  questionsSolved = 0;
  
  // Iniciar música
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
  
  updateScore();
  resetSnake();
  generateMathProblem();
  
  // Iniciar bucle del juego
  gameLoop();
  
  // Agregar listener de teclado
  document.addEventListener("keydown", changeDirection);
}

function stopGame() {
  gameRunning = false;
  gameCompleted = true;
  
  if (gameLoopId) {
    clearTimeout(gameLoopId);
    gameLoopId = null;
  }
  
  document.removeEventListener("keydown", changeDirection);
  
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

function gameLoop() {
  if (!gameRunning || gameCompleted || !ctx || !canvas) {
    return;
  }

  // Verificar condiciones de fin
  if (lives <= 0 && !gameOverShown) {
    gameOverShown = true;
    stopGame();
    setTimeout(() => {
      showGameOver();
    }, 100);
    return;
  }

  if (score >= maxScore && !gameCompleted) {
    gameCompleted = true;
    stopGame();
    setTimeout(() => {
      completeGame();
    }, 100);
    return;
  }

  // Actualizar juego
  changingDirection = false;
  clearCanvas();
  moveSnake();
  checkCollisions();
  drawSnake();
  drawFood();
  
  // Continuar bucle
  if (gameRunning && !gameCompleted) {
    gameLoopId = setTimeout(gameLoop, GAME_SPEED);
  }
}

// ============================================
// LÓGICA DEL JUEGO
// ============================================

function resetSnake() {
  const centerX = Math.floor(TILE_COUNT / 2);
  const centerY = Math.floor(TILE_COUNT / 2);
  snake = [
    {x: centerX, y: centerY}, 
    {x: centerX - 1, y: centerY}, 
    {x: centerX - 2, y: centerY}
  ];
  dx = 1;
  dy = 0;
}

function generateMathProblem() {
  let num1, num2, operatorSymbol;

  if (level === 1) {
    num1 = Math.floor(Math.random() * 10) + 1; 
    num2 = Math.floor(Math.random() * 10) + 1;
    currentResult = num1 + num2;
    operatorSymbol = "+";
    document.getElementById('levelDisplay').innerHTML = '<i class="bx bx-trophy"></i> Nivel: 1 (Sumas)';
  }
  else if (level === 2) {
    num1 = Math.floor(Math.random() * 15) + 5; 
    num2 = Math.floor(Math.random() * num1); 
    currentResult = num1 - num2;
    operatorSymbol = "-";
    document.getElementById('levelDisplay').innerHTML = '<i class="bx bx-trophy"></i> Nivel: 2 (Restas)';
  }
  else {
    num1 = Math.floor(Math.random() * 9) + 1;
    num2 = Math.floor(Math.random() * 9) + 1;
    currentResult = num1 * num2;
    operatorSymbol = "x";
    document.getElementById('levelDisplay').innerHTML = '<i class="bx bx-trophy"></i> Nivel: 3 (Multiplicación)';
  }

  const questionDisplay = document.getElementById('questionDisplay');
  if (questionDisplay) {
    questionDisplay.innerText = `¿Cuánto es ${num1} ${operatorSymbol} ${num2}?`;
  }
  spawnFoods(currentResult);
}

function spawnFoods(correctAnswer) {
  foodOptions = [];
  
  let correctFood = createRandomFood();
  correctFood.value = correctAnswer;
  correctFood.isCorrect = true;
  foodOptions.push(correctFood);

  while (foodOptions.length < 3) {
    let fakeFood = createRandomFood();
    let offset = Math.floor(Math.random() * 5) + 1;
    let fakeValue = (Math.random() > 0.5) ? correctAnswer + offset : correctAnswer - offset;
    if (fakeValue < 0) fakeValue = 1;
    if (fakeValue === correctAnswer) fakeValue = correctAnswer + 1;

    fakeFood.value = fakeValue;
    fakeFood.isCorrect = false;

    let collision = false;
    for(let f of foodOptions) {
      if (f.x === fakeFood.x && f.y === fakeFood.y) collision = true;
    }
    if (!collision) foodOptions.push(fakeFood);
  }
}

function createRandomFood() {
  let newX, newY;
  let isOnSnake = true;
  let attempts = 0;
  while(isOnSnake && attempts < 100) {
    newX = Math.floor(Math.random() * TILE_COUNT);
    newY = Math.floor(Math.random() * TILE_COUNT);
    
    if (newX < 0) newX = 0;
    if (newX >= TILE_COUNT) newX = TILE_COUNT - 1;
    if (newY < 0) newY = 0;
    if (newY >= TILE_COUNT) newY = TILE_COUNT - 1;
    
    isOnSnake = false;
    for(let part of snake) {
      if (part.x === newX && part.y === newY) {
        isOnSnake = true;
        break;
      }
    }
    attempts++;
  }
  return { x: newX, y: newY };
}

function moveSnake() {
  if (!snake || snake.length === 0) return;
  
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  // Bordes toroidales
  if (head.x < 0) head.x = TILE_COUNT - 1;
  if (head.x >= TILE_COUNT) head.x = 0;
  if (head.y < 0) head.y = TILE_COUNT - 1;
  if (head.y >= TILE_COUNT) head.y = 0;

  snake.unshift(head);

  let ateFood = false;
  if (foodOptions && foodOptions.length > 0) {
    for (let i = 0; i < foodOptions.length; i++) {
      if (foodOptions[i] && head.x === foodOptions[i].x && head.y === foodOptions[i].y) {
        handleEat(foodOptions[i]);
        ateFood = true;
        break;
      }
    }
  }

  if (!ateFood) {
    snake.pop(); 
  }
}

function handleEat(foodItem) {
  if (!foodItem) return;
  
  createEatEffect(foodItem.x * TILE_SIZE + TILE_SIZE/2, foodItem.y * TILE_SIZE + TILE_SIZE/2, foodItem.isCorrect);
  
  const foodIndex = foodOptions.findIndex(f => f.x === foodItem.x && f.y === foodItem.y);
  if (foodIndex !== -1) {
    foodOptions.splice(foodIndex, 1);
  }
  
  if (foodItem.isCorrect) {
    playCorrectSound();
    score++;
    questionsSolved++;
    updateScore();
    
    if (score >= maxScore) {
      return; // El gameLoop detectará esto
    }
    
    if (questionsSolved >= maxQuestions) {
      levelUp();
    } else {
      generateMathProblem();
    }
  } else {
    playIncorrectSound();
    loseLife();
    resetSnake();
    spawnFoods(currentResult);
  }
}

function createEatEffect(x, y, isCorrect) {
  const particles = 15;
  for (let i = 0; i < particles; i++) {
    setTimeout(() => {
      if (!ctx) return;
      const angle = (Math.PI * 2 * i) / particles;
      const distance = 30;
      const px = x + Math.cos(angle) * distance;
      const py = y + Math.sin(angle) * distance;
      
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = isCorrect ? "#4ade80" : "#f87171";
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }, i * 10);
  }
}

function checkCollisions() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      loseLife();
      resetSnake();
      break; 
    }
  }
}

function loseLife() {
  lives--;
  updateLivesDisplay();
  
  if (lives <= 0 && !gameOverShown) {
    return; // El gameLoop detectará esto
  }
}

function updateLivesDisplay() {
  const livesDisplay = document.getElementById("livesDisplay");
  if (!livesDisplay) {
    console.warn('livesDisplay no encontrado');
    return;
  }
  
  livesDisplay.innerHTML = '';
  
  // Usar la URL del config (generada por Django con {% static %})
  let lifeImageUrl = window.gameConfig?.lifeImageUrl;
  
  // Si no hay URL en el config, intentar construirla desde la URL de música
  if (!lifeImageUrl && window.gameConfig?.musicUrl) {
    const musicUrl = window.gameConfig.musicUrl;
    // Extraer la ruta base (ej: /static/assets/math/matmusic.mp3 -> /static/assets/math/)
    const basePath = musicUrl.substring(0, musicUrl.lastIndexOf('/') + 1);
    lifeImageUrl = basePath + 'life.png';
    console.log('Construyendo ruta de vida desde música:', lifeImageUrl);
  }
  
  // Fallback final
  if (!lifeImageUrl) {
    lifeImageUrl = '/static/assets/math/life.png';
  }
  
  console.log('Cargando imágenes de vida desde:', lifeImageUrl);
  console.log('gameConfig disponible:', !!window.gameConfig);
  console.log('lifeImageUrl en config:', window.gameConfig?.lifeImageUrl);
  
  for(let i = 0; i < lives; i++) {
    const img = document.createElement('img');
    
    // Configurar atributos antes de establecer src para evitar problemas de CORS
    img.setAttribute('alt', 'Vida');
    img.setAttribute('crossOrigin', 'anonymous');
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.marginRight = '3px';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.verticalAlign = 'middle';
    
    // Agregar handlers ANTES de establecer src
    let loadAttempts = 0;
    const maxAttempts = 3;
    const alternatives = [
      lifeImageUrl,
      window.location.origin + '/static/assets/math/life.png',
      '/static/assets/math/life.png'
    ];
    
    const tryLoadImage = (urlIndex) => {
      if (urlIndex >= alternatives.length) {
        // Si todas las rutas fallan, usar emoji
        console.warn(`Todas las rutas fallaron para vida ${i + 1}, usando emoji`);
        img.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.textContent = '❤️';
        fallback.style.fontSize = '18px';
        fallback.style.marginRight = '3px';
        fallback.style.display = 'inline-block';
        fallback.style.verticalAlign = 'middle';
        if (img.parentNode) {
          img.parentNode.replaceChild(fallback, img);
        }
        return;
      }
      
      const url = alternatives[urlIndex];
      img.src = url;
      loadAttempts++;
      
      console.log(`Intento ${loadAttempts}/${maxAttempts} cargando vida ${i + 1} desde:`, url);
    };
    
    img.onload = function() {
      console.log(`✓ Imagen de vida ${i + 1} cargada correctamente desde:`, this.src);
    };
    
    img.onerror = function() {
      console.error(`✗ Error al cargar imagen de vida ${i + 1} desde:`, this.src);
      
      // Intentar siguiente alternativa
      if (loadAttempts < maxAttempts) {
        setTimeout(() => tryLoadImage(loadAttempts), 300);
      } else {
        // Usar emoji como fallback final
        this.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.textContent = '❤️';
        fallback.style.fontSize = '18px';
        fallback.style.marginRight = '3px';
        fallback.style.display = 'inline-block';
        fallback.style.verticalAlign = 'middle';
        if (this.parentNode) {
          this.parentNode.replaceChild(fallback, this);
        }
      }
    };
    
    // Iniciar carga de imagen
    tryLoadImage(0);
    
    livesDisplay.appendChild(img);
  }
}

function updateScore() {
  const scoreElement = document.getElementById('current-score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

function levelUp() {
  level++;
  questionsSolved = 0;
  resetSnake();
  if (level > 3) level = 3;
  generateMathProblem();
}

function changeDirection(event) {
  if (changingDirection || !gameRunning) return;
  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (keyPressed === 37 && !goingRight) { dx = -1; dy = 0; }
  if (keyPressed === 38 && !goingDown) { dx = 0; dy = -1; }
  if (keyPressed === 39 && !goingLeft) { dx = 1; dy = 0; }
  if (keyPressed === 40 && !goingUp) { dx = 0; dy = 1; }
}

// ============================================
// RENDERIZADO
// ============================================

function clearCanvas() {
  if (!ctx || !canvas) return;
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#1a1a2e");
  gradient.addColorStop(0.5, "#16213e");
  gradient.addColorStop(1, "#0f3460");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = "rgba(84, 246, 195, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= TILE_COUNT; i++) {
    ctx.beginPath();
    ctx.moveTo(i * TILE_SIZE, 0);
    ctx.lineTo(i * TILE_SIZE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * TILE_SIZE);
    ctx.lineTo(canvas.width, i * TILE_SIZE);
    ctx.stroke();
  }
}

function drawSnake() {
  if (!ctx) return;
  
  snake.forEach((part, index) => {
    const x = part.x * TILE_SIZE;
    const y = part.y * TILE_SIZE;
    
    if (index === 0) {
      const headGradient = ctx.createRadialGradient(
        x + TILE_SIZE/2, y + TILE_SIZE/2, 0,
        x + TILE_SIZE/2, y + TILE_SIZE/2, TILE_SIZE/2
      );
      headGradient.addColorStop(0, "#ff6b6b");
      headGradient.addColorStop(0.7, "#ee5a6f");
      headGradient.addColorStop(1, "#c44569");
      ctx.fillStyle = headGradient;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#fff";
      ctx.fillRect(x + 4, y + 4, 4, 4);
      ctx.fillRect(x + TILE_SIZE - 8, y + 4, 4, 4);
    } else {
      const bodyGradient = ctx.createLinearGradient(x, y, x + TILE_SIZE, y + TILE_SIZE);
      const intensity = 1 - (index / snake.length) * 0.3;
      bodyGradient.addColorStop(0, `rgba(255, 107, 107, ${intensity})`);
      bodyGradient.addColorStop(1, `rgba(238, 90, 111, ${intensity})`);
      ctx.fillStyle = bodyGradient;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  });
}

function drawFood() {
  if (!ctx) return;
  
  animationFrame++;
  ctx.font = "bold 18px 'Comic Sans MS', cursive";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  foodOptions.forEach((food, index) => {
    const x = food.x * TILE_SIZE;
    const y = food.y * TILE_SIZE;
    const centerX = x + TILE_SIZE/2;
    const centerY = y + TILE_SIZE/2;
    
    const pulse = Math.sin(animationFrame * 0.1 + index) * 0.1 + 1;
    const size = TILE_SIZE * pulse;
    const offset = (TILE_SIZE - size) / 2;
    
    const foodGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, TILE_SIZE/2
    );
    foodGradient.addColorStop(0, "#ffd93d");
    foodGradient.addColorStop(0.5, "#ffb347");
    foodGradient.addColorStop(1, "#ff8c42");
    
    ctx.fillStyle = foodGradient;
    ctx.shadowColor = "rgba(255, 140, 66, 0.5)";
    ctx.shadowBlur = 10;
    
    const radius = 5;
    ctx.beginPath();
    ctx.moveTo(x + offset + radius, y + offset);
    ctx.lineTo(x + offset + size - radius, y + offset);
    ctx.quadraticCurveTo(x + offset + size, y + offset, x + offset + size, y + offset + radius);
    ctx.lineTo(x + offset + size, y + offset + size - radius);
    ctx.quadraticCurveTo(x + offset + size, y + offset + size, x + offset + size - radius, y + offset + size);
    ctx.lineTo(x + offset + radius, y + offset + size);
    ctx.quadraticCurveTo(x + offset, y + offset + size, x + offset, y + offset + size - radius);
    ctx.lineTo(x + offset, y + offset + radius);
    ctx.quadraticCurveTo(x + offset, y + offset, x + offset + radius, y + offset);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 3;
    ctx.fillText(food.value, centerX, centerY);
    ctx.shadowBlur = 0;
  });
}

// ============================================
// PANTALLAS DE FINALIZACIÓN
// ============================================

function showGameOver() {
  stopGame();
  
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;
  
  const gameWrapper = gameContainer.querySelector('.game-wrapper');
  if (gameWrapper) {
    gameWrapper.style.display = 'none';
  }
  
  applyBackgroundGradient();
  
  const backUrl = window.gameConfig?.backUrl || '../matematica.html';
  
  gameContainer.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx bx-x-circle" style="font-size: 48px; color: #e74c3c;"></i>
        </div>
        <h2 class="complete-title title-animation" style="color: #e74c3c;">¡Game Over!</h2>
        <p class="complete-message message-animation">Has perdido todas tus vidas. ¡No te rindas, inténtalo de nuevo!</p>
        <div style="background: rgba(231, 76, 60, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(231, 76, 60, 0.3);" class="stats-animation">
          <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación Final: <span style="color: #54f6c3;">${score}</span> puntos
          </p>
        </div>
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Reintentar
          </button>
          <a href="${backUrl}" class="restart-button back-button" style="flex: 1;">
            <i class="bx bx-arrow-back"></i>
            Volver
          </a>
        </div>
      </div>
    </div>
  `;
}

async function completeGame() {
  stopGame();
  
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;
  
  const gameWrapper = gameContainer.querySelector('.game-wrapper');
  if (gameWrapper) {
    gameWrapper.style.display = 'none';
  }
  
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
  
  if (victorySound) {
    victorySound.currentTime = 0;
    victorySound.play().catch(() => {});
  }
  
  createVictoryParticles(gameContainer);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  applyBackgroundGradient();
  
  // Reportar en segundo plano
  reportGameCompletion(score, lives).catch(() => {});
  
  const backUrl = window.gameConfig?.backUrl || '../matematica.html';
  const isAuthenticated = window.gameConfig?.isAuthenticated || false;
  
  const finalLives = lives;
  const livesText = finalLives === 1 ? '1 vida' : `${finalLives} vidas`;
  
  let bonusPoints = 0;
  if (finalLives >= 3) {
    bonusPoints = 5;
  } else if (finalLives === 2) {
    bonusPoints = 3;
  } else if (finalLives === 1) {
    bonusPoints = 1;
  }
  
  gameContainer.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx bx-trophy" style="font-size: 40px; color: #ffd700;"></i>
        </div>
        <h2 class="complete-title title-animation">¡Felicidades!</h2>
        <p class="complete-message message-animation">Has completado todos los niveles</p>
        <div style="background: rgba(84, 246, 195, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(84, 246, 195, 0.3);" class="stats-animation">
          <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación: <span style="color: #54f6c3;">${score}</span> puntos
          </p>
          <p class="complete-lives" style="font-size: 16px;">
            <i class="bx bx-heart" style="color: #54f6c3;"></i>
            Completado con: <span style="color: #54f6c3;">${livesText}</span>
          </p>
          ${bonusPoints > 0 ? `<p class="complete-bonus" style="margin-top: 0.4rem; font-size: 14px; color: #00ff00;">Bonus por vidas: +${bonusPoints} puntos</p>` : ''}
        </div>
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Volver a Jugar
          </button>
          <a href="${backUrl}" class="restart-button back-button" style="flex: 1;">
            <i class="bx bx-arrow-back"></i>
            Volver
          </a>
        </div>
      </div>
    </div>
  `;
}

function applyBackgroundGradient() {
  const gradient = 'linear-gradient(90deg, #2c3c5c 0%, #0d82a3 50%)';
  const elements = [
    document.querySelector('.page-content'),
    document.querySelector('.section'),
    document.querySelector('.container'),
    document.querySelector('.main'),
    document.querySelector('body')
  ];
  
  elements.forEach(el => {
    if (el) el.style.background = gradient;
  });
}

function restartGame() {
  stopGame();
  createGameInterface();
  setTimeout(() => {
    startGame();
  }, 100);
}

window.restartGame = restartGame;

// ============================================
// AUDIO
// ============================================

function initAudio() {
  let musicUrl = window.gameConfig?.musicUrl || '/static/assets/math/matmusic.mp3';
  backgroundMusic = new Audio(musicUrl);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;
  backgroundMusic.play().catch(() => {});
  
  // Usar las URLs del config si están disponibles
  const correctSoundUrl = window.gameConfig?.correctSoundUrl || '/static/assets/math/acierto.mp3';
  const incorrectSoundUrl = window.gameConfig?.incorrectSoundUrl || '/static/assets/math/error.mp3';
  const victorySoundUrl = window.gameConfig?.victorySoundUrl || '/static/assets/math/acierto.mp3';
  
  console.log('Cargando sonidos desde:', { correctSoundUrl, incorrectSoundUrl, victorySoundUrl });
  
  correctSound = new Audio(correctSoundUrl);
  correctSound.volume = 0.7;
  correctSound.onerror = function() {
    console.error('Error al cargar correctSound desde:', correctSoundUrl);
  };
  
  incorrectSound = new Audio(incorrectSoundUrl);
  incorrectSound.volume = 0.7;
  incorrectSound.onerror = function() {
    console.error('Error al cargar incorrectSound desde:', incorrectSoundUrl);
  };
  
  victorySound = new Audio(victorySoundUrl);
  victorySound.volume = 0.7;
  victorySound.onerror = function() {
    console.error('Error al cargar victorySound desde:', victorySoundUrl);
  };
}

function playCorrectSound() {
  if (correctSound) {
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {
      playGeneratedCorrectSound();
    });
  } else {
    playGeneratedCorrectSound();
  }
}

function playIncorrectSound() {
  if (incorrectSound) {
    incorrectSound.currentTime = 0;
    incorrectSound.play().catch(() => {
      playGeneratedIncorrectSound();
    });
  } else {
    playGeneratedIncorrectSound();
  }
}

function playGeneratedCorrectSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (err) {
    console.log('Error al reproducir sonido:', err);
  }
}

function playGeneratedIncorrectSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (err) {
    console.log('Error al reproducir sonido:', err);
  }
}

function setupVolumeControl() {
  const volumeSlider = document.getElementById('volume-slider');
  const musicIcon = document.getElementById('music-icon');
  if (!volumeSlider || !musicIcon) return;
  
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    musicVolume = volume;
    if (backgroundMusic) backgroundMusic.volume = volume;
    if (volume === 0) {
      musicIcon.className = 'bx bx-volume-mute';
    } else if (volume < 0.5) {
      musicIcon.className = 'bx bx-volume-low';
    } else {
      musicIcon.className = 'bx bx-volume-full';
    }
  });
  
  musicIcon.addEventListener('click', () => {
    if (backgroundMusic) {
      if (backgroundMusic.paused) {
        backgroundMusic.play();
        volumeSlider.value = musicVolume * 100;
      } else {
        backgroundMusic.pause();
        volumeSlider.value = 0;
        musicIcon.className = 'bx bx-volume-mute';
      }
    }
  });
}

// ============================================
// PANTALLA COMPLETA
// ============================================

function setupFullscreenButton() {
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const fullscreenIcon = document.getElementById('fullscreen-icon-inner');
  const gameWrapper = document.querySelector('.game-wrapper');
  if (!fullscreenBtn || !gameWrapper) return;

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
      if (gameWrapper.requestFullscreen) {
        gameWrapper.requestFullscreen().catch(() => {});
      } else if (gameWrapper.webkitRequestFullscreen) {
        gameWrapper.webkitRequestFullscreen();
      } else if (gameWrapper.mozRequestFullScreen) {
        gameWrapper.mozRequestFullScreen();
      } else if (gameWrapper.msRequestFullscreen) {
        gameWrapper.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  });

  function updateFullscreenIcon() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                           document.mozFullScreenElement || document.msFullscreenElement);
    if (isFullscreen) {
      fullscreenIcon.className = 'fas fa-compress';
      fullscreenBtn.title = 'Salir de pantalla completa';
    } else {
      fullscreenIcon.className = 'fas fa-expand';
      fullscreenBtn.title = 'Pantalla completa';
    }
  }

  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
  document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
  document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
}

// ============================================
// PARTÍCULAS DE VICTORIA
// ============================================

function createVictoryParticles(container) {
  const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '10000';
      particle.style.animation = 'particleFall 2s ease-out forwards';
      container.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 2000);
    }, i * 30);
  }
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const modalOverlay = document.getElementById('modal-overlay');
  
  if (modalOverlay && modalOverlay.classList.contains('modal-hidden')) {
    initGame();
  } else {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.target.classList.contains('modal-hidden')) {
          setTimeout(initGame, 100);
        }
      });
    });
    
    if (modalOverlay) {
      observer.observe(modalOverlay, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }
});

// ============================================
// API DE COMPLETACIÓN
// ============================================

async function reportGameCompletion(score, finalLives) {
  console.log('Modo estático: Progreso no se guarda (sin backend Django)');
  console.log('Score:', score, 'Lives:', finalLives);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    completed: true,
    best_score: score,
    final_lives: finalLives,
    demo_mode: true,
    message: 'Modo demo - regístrate para guardar tu progreso'
  };
}
