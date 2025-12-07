// ============================================
// RACE GAME - JUEGO DE CARRERAS MATEMÁTICAS
// ============================================

// Variables del juego
let canvas = null;
let ctx = null;

// Configuración
const CAR_WIDTH = 80;
const CAR_HEIGHT = 100;
const OBSTACLE_WIDTH = 70;
const OBSTACLE_HEIGHT = 70;
const ROAD_WIDTH = 320;
const LANES = 3;
const LANE_WIDTH = ROAD_WIDTH / LANES;

// Variables de Juego
let carX = 0; // Posición X del coche (0 = izquierda, 1 = centro, 2 = derecha)
let carY = 0; // Posición Y del coche (en píxeles)
let obstacles = [];
let lives = 3;
let level = 1;
let score = 0;
let maxScore = 15;
let questionsSolved = 0;
let maxQuestions = 5;
let currentResult = 0;
let gameRunning = false;
let gameOverShown = false;
let gameCompleted = false;
let gameLoopId = null;
let gameSpeed = 3.5;
let obstacleSpawnTimer = 0;
let obstacleSpawnInterval = 90; // Frames entre obstáculos

// Variables de audio
let backgroundMusic = null;
let correctSound = null;
let incorrectSound = null;
let victorySound = null;
let musicVolume = 0.5;

// Variables de animación
let roadOffset = 0;
let animationFrame = 0;

// Imagen del auto
let carImage = null;

// ============================================
// INICIALIZACIÓN
// ============================================

function initGame() {
  console.log('Inicializando juego de carreras...');
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
  
  gameContainer.innerHTML = `
    <div class="game-wrapper">
      <div class="game-header">
        <h2 class="game-title"><i class="bx bx-car"></i> Carreras Matemáticas</h2>
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
        <canvas id="raceCanvas" width="500" height="600"></canvas>
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
  canvas = document.getElementById("raceCanvas");
  if (!canvas) {
    console.error('Canvas no encontrado');
    return;
  }
  ctx = canvas.getContext("2d");
  
  // Ajustar tamaño del canvas
  setTimeout(() => {
    adjustCanvasSize();
  }, 200);
  
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

  // Configurar componentes
  setupFullscreenButton();
  initAudio();
  setupVolumeControl();
  
  // Esperar un momento para asegurar que gameConfig esté disponible
  setTimeout(() => {
    updateLivesDisplay();
    loadCarImage();
  }, 100);
}

function loadCarImage() {
  carImage = new Image();
  carImage.onload = function() {
    console.log('Imagen del auto cargada correctamente');
  };
  carImage.onerror = function() {
    console.error('Error al cargar la imagen del auto');
    carImage = null;
  };
  // Usar la URL del config si está disponible, sino usar fallback
  const carImageUrl = window.gameConfig?.carImageUrl || '/static/assets/math/auto.png';
  carImage.src = carImageUrl;
  console.log('Cargando imagen del auto desde:', carImageUrl);
}

function adjustCanvasSize() {
  const gameContent = document.querySelector('.game-content');
  const gameWrapper = document.querySelector('.game-wrapper');
  if (!gameContent || !gameWrapper || !canvas) return;
  
  const header = gameWrapper.querySelector('.game-header');
  const controls = gameWrapper.querySelector('.game-controls');
  const questionDisplay = gameContent.querySelector('.question-display');
  
  const headerHeight = header ? header.offsetHeight : 120;
  const controlsHeight = controls ? controls.offsetHeight : 50;
  const questionHeight = questionDisplay ? questionDisplay.offsetHeight : 50;
  const wrapperPadding = 24;
  const contentGap = 10;
  
  const availableHeight = gameWrapper.offsetHeight - headerHeight - controlsHeight - questionHeight - wrapperPadding - contentGap - 10;
  const availableWidth = gameContent.offsetWidth - 20;
  
  // Hacer el canvas más estrecho
  const maxWidth = Math.min(availableWidth, 550);
  const maxHeight = Math.min(availableHeight, 650);
  
  if (maxWidth > 300 && maxHeight > 300) {
    canvas.width = maxWidth;
    canvas.height = maxHeight;
  }
}

window.addEventListener('resize', adjustCanvasSize);

// ============================================
// CONTROL DEL JUEGO
// ============================================

function startGame() {
  console.log('Iniciando juego de carreras...');
  
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
  lives = 3;
  level = 1;
  questionsSolved = 0;
  gameSpeed = 3.5;
  obstacleSpawnInterval = 90;
  obstacles = [];
  carX = 1; // Centro
  carY = 0;
  roadOffset = 0;
  obstacleSpawnTimer = 0;
  
  // Iniciar música
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
  
  updateScore();
  generateMathProblem();
  
  // Iniciar bucle del juego
  gameLoop();
  
  // Agregar listener de teclado
  document.addEventListener("keydown", handleKeyPress);
}

function stopGame() {
  gameRunning = false;
  gameCompleted = true;
  
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }
  
  document.removeEventListener("keydown", handleKeyPress);
  
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
  update();
  draw();
  
  // Continuar bucle
  if (gameRunning && !gameCompleted) {
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}

// ============================================
// LÓGICA DEL JUEGO
// ============================================

function update() {
  animationFrame++;
  roadOffset += gameSpeed;
  if (roadOffset >= 50) roadOffset = 0;
  
  obstacleSpawnTimer++;
  
  // Generar nuevos obstáculos
  if (obstacleSpawnTimer >= obstacleSpawnInterval) {
    spawnObstacle();
    obstacleSpawnTimer = 0;
  }
  
  // Actualizar obstáculos
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += gameSpeed;
    
    // Actualizar animaciones
    const time = animationFrame * 0.1;
    obstacles[i].scale = 1 + Math.sin(time + obstacles[i].animationOffset) * 0.15;
    obstacles[i].rotation = Math.sin(time * 0.5 + obstacles[i].animationOffset) * 0.1;
    
    // Verificar colisión
    if (checkCollision(obstacles[i])) {
      handleCollision(obstacles[i]);
      obstacles.splice(i, 1);
      continue;
    }
    
    // Eliminar obstáculos que salieron de la pantalla
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
    }
  }
  
  // Calcular posición Y del coche
  carY = canvas.height - CAR_HEIGHT - 20;
}

function spawnObstacle() {
  const actualRoadWidth = Math.min(ROAD_WIDTH, canvas.width - 40);
  const roadX = (canvas.width - actualRoadWidth) / 2;
  const actualLaneWidth = actualRoadWidth / LANES;
  const lane = Math.floor(Math.random() * LANES);
  const obstacle = {
    x: roadX + lane * actualLaneWidth + (actualLaneWidth - OBSTACLE_WIDTH) / 2,
    y: -OBSTACLE_HEIGHT,
    lane: lane,
    value: 0,
    isCorrect: false,
    animationOffset: Math.random() * Math.PI * 2, // Offset aleatorio para animación
    scale: 1,
    rotation: 0
  };
  
  // Asignar valor (correcto o incorrecto)
  if (Math.random() < 0.33) {
    // Una de cada tres es correcta
    obstacle.value = currentResult;
    obstacle.isCorrect = true;
  } else {
    // Generar valor incorrecto
    let offset = Math.floor(Math.random() * 5) + 1;
    obstacle.value = (Math.random() > 0.5) ? currentResult + offset : currentResult - offset;
    if (obstacle.value < 0) obstacle.value = 1;
    if (obstacle.value === currentResult) obstacle.value = currentResult + 1;
    obstacle.isCorrect = false;
  }
  
  obstacles.push(obstacle);
}

function checkCollision(obstacle) {
  if (!canvas) return false;
  
  const actualRoadWidth = Math.min(ROAD_WIDTH, canvas.width - 40);
  const roadX = (canvas.width - actualRoadWidth) / 2;
  const actualLaneWidth = actualRoadWidth / LANES;
  const carCenterX = roadX + carX * actualLaneWidth + actualLaneWidth / 2;
  const carLeft = carCenterX - CAR_WIDTH / 2;
  const carRight = carCenterX + CAR_WIDTH / 2;
  const carTop = carY;
  const carBottom = carY + CAR_HEIGHT;
  
  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + OBSTACLE_WIDTH;
  const obstacleTop = obstacle.y;
  const obstacleBottom = obstacle.y + OBSTACLE_HEIGHT;
  
  return carLeft < obstacleRight &&
         carRight > obstacleLeft &&
         carTop < obstacleBottom &&
         carBottom > obstacleTop;
}

function handleCollision(obstacle) {
  if (obstacle.isCorrect) {
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
    // Pierde vida cuando choca con respuesta incorrecta
    playIncorrectSound();
    loseLife();
    // Regenerar el problema para que pueda intentar de nuevo
    generateMathProblem();
  }
}

function loseLife() {
  lives--;
  updateLivesDisplay();
  
  if (lives <= 0 && !gameOverShown) {
    return; // El gameLoop detectará esto
  }
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
}

function levelUp() {
  level++;
  questionsSolved = 0;
  if (level > 3) level = 3;
  
  // Aumentar velocidad
  gameSpeed += 0.4;
  obstacleSpawnInterval = Math.max(70, obstacleSpawnInterval - 8);
  
  generateMathProblem();
}

function handleKeyPress(event) {
  if (!gameRunning) return;
  
  const keyPressed = event.keyCode;
  
  if (keyPressed === 37 && carX > 0) { // Izquierda
    carX--;
  }
  if (keyPressed === 39 && carX < LANES - 1) { // Derecha
    carX++;
  }
}

function updateLivesDisplay() {
  const livesDisplay = document.getElementById("livesDisplay");
  if (!livesDisplay) return;
  
  livesDisplay.innerHTML = '';
  // Usar la URL del config si está disponible, sino usar fallback
  const lifeImageUrl = window.gameConfig?.lifeImageUrl || '/static/assets/math/life.png';
  
  for(let i = 0; i < lives; i++) {
    const img = document.createElement('img');
    img.src = lifeImageUrl;
    img.alt = 'Vida';
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.marginRight = '3px';
    img.style.objectFit = 'contain';
    img.onerror = function() {
      console.error('Error al cargar imagen de vida desde:', lifeImageUrl);
      this.style.display = 'none';
    };
    img.onload = function() {
      console.log('Imagen de vida cargada correctamente');
    };
    livesDisplay.appendChild(img);
  }
}

function updateScore() {
  const scoreElement = document.getElementById('current-score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

// ============================================
// RENDERIZADO
// ============================================

function draw() {
  if (!ctx || !canvas) return;
  
  // Limpiar canvas
  ctx.fillStyle = '#0a0e27';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar carretera
  drawRoad();
  
  // Dibujar obstáculos
  drawObstacles();
  
  // Dibujar coche
  drawCar();
}

function drawRoad() {
  // Asegurar que ROAD_WIDTH no sea mayor que el ancho del canvas
  const actualRoadWidth = Math.min(ROAD_WIDTH, canvas.width - 40);
  const roadX = (canvas.width - actualRoadWidth) / 2;
  const actualLaneWidth = actualRoadWidth / LANES;
  
  // Fondo de la carretera con gradiente
  const roadGradient = ctx.createLinearGradient(roadX, 0, roadX + actualRoadWidth, 0);
  roadGradient.addColorStop(0, '#1a1a1a');
  roadGradient.addColorStop(0.5, '#2a2a2a');
  roadGradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = roadGradient;
  ctx.fillRect(roadX, 0, actualRoadWidth, canvas.height);
  
  // Efecto de textura en la carretera
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < canvas.height; i += 4) {
    ctx.fillRect(roadX, i, actualRoadWidth, 1);
  }
  
  // Líneas centrales con efecto brillante
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.setLineDash([25, 25]);
  ctx.lineDashOffset = -roadOffset;
  
  for (let i = 0; i < LANES - 1; i++) {
    const x = roadX + (i + 1) * actualLaneWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  
  // Bordes de la carretera con efecto 3D
  const borderGradient = ctx.createLinearGradient(roadX, 0, roadX, canvas.height);
  borderGradient.addColorStop(0, '#ffffff');
  borderGradient.addColorStop(0.5, '#cccccc');
  borderGradient.addColorStop(1, '#ffffff');
  
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 5;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.moveTo(roadX, 0);
  ctx.lineTo(roadX, canvas.height);
  ctx.moveTo(roadX + actualRoadWidth, 0);
  ctx.lineTo(roadX + actualRoadWidth, canvas.height);
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Marcas de borde reflectantes
  ctx.fillStyle = '#ffff00';
  ctx.shadowColor = 'rgba(255, 255, 0, 0.6)';
  ctx.shadowBlur = 4;
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.fillRect(roadX - 3, i + (roadOffset % 30), 6, 15);
    ctx.fillRect(roadX + actualRoadWidth - 3, i + (roadOffset % 30), 6, 15);
  }
  ctx.shadowBlur = 0;
}

function drawCar() {
  const actualRoadWidth = Math.min(ROAD_WIDTH, canvas.width - 40);
  const roadX = (canvas.width - actualRoadWidth) / 2;
  const actualLaneWidth = actualRoadWidth / LANES;
  const carCenterX = roadX + carX * actualLaneWidth + actualLaneWidth / 2;
  const carLeft = carCenterX - CAR_WIDTH / 2;
  
  // Si la imagen del auto está cargada, usarla
  if (carImage && carImage.complete && carImage.naturalWidth > 0) {
    // Mejorar la calidad de renderizado de la imagen
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.save();
    // Dibujar la imagen con mejor calidad
    ctx.drawImage(carImage, carLeft, carY, CAR_WIDTH, CAR_HEIGHT);
    ctx.restore();
  } else {
    // Fallback: dibujar el auto si la imagen no está disponible
    // Cuerpo principal del auto - Verde menta hermoso
    const carBodyGradient = ctx.createLinearGradient(carLeft, carY, carLeft, carY + CAR_HEIGHT);
    carBodyGradient.addColorStop(0, '#54f6c3');
    carBodyGradient.addColorStop(0.15, '#7fffd4');
    carBodyGradient.addColorStop(0.4, '#66ddaa');
    carBodyGradient.addColorStop(0.6, '#4ecdc4');
    carBodyGradient.addColorStop(0.85, '#45b7d1');
    carBodyGradient.addColorStop(1, '#2d9cdb');
    ctx.fillStyle = carBodyGradient;
  
    // Dibujar cuerpo con bordes redondeados más suaves
    ctx.beginPath();
    ctx.moveTo(carLeft + 10, carY);
    ctx.lineTo(carLeft + CAR_WIDTH - 10, carY);
    ctx.quadraticCurveTo(carLeft + CAR_WIDTH, carY, carLeft + CAR_WIDTH, carY + 10);
    ctx.lineTo(carLeft + CAR_WIDTH, carY + CAR_HEIGHT - 10);
    ctx.quadraticCurveTo(carLeft + CAR_WIDTH, carY + CAR_HEIGHT, carLeft + CAR_WIDTH - 10, carY + CAR_HEIGHT);
    ctx.lineTo(carLeft + 10, carY + CAR_HEIGHT);
    ctx.quadraticCurveTo(carLeft, carY + CAR_HEIGHT, carLeft, carY + CAR_HEIGHT - 10);
    ctx.lineTo(carLeft, carY + 10);
    ctx.quadraticCurveTo(carLeft, carY, carLeft + 10, carY);
    ctx.closePath();
    ctx.fill();
  
    // Borde del coche con brillo verde menta
    ctx.strokeStyle = '#54f6c3';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(84, 246, 195, 0.8)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(carLeft + 10, carY);
    ctx.lineTo(carLeft + CAR_WIDTH - 10, carY);
    ctx.quadraticCurveTo(carLeft + CAR_WIDTH, carY, carLeft + CAR_WIDTH, carY + 10);
    ctx.lineTo(carLeft + CAR_WIDTH, carY + CAR_HEIGHT - 10);
    ctx.quadraticCurveTo(carLeft + CAR_WIDTH, carY + CAR_HEIGHT, carLeft + CAR_WIDTH - 10, carY + CAR_HEIGHT);
    ctx.lineTo(carLeft + 10, carY + CAR_HEIGHT);
    ctx.quadraticCurveTo(carLeft, carY + CAR_HEIGHT, carLeft, carY + CAR_HEIGHT - 10);
    ctx.lineTo(carLeft, carY + 10);
    ctx.quadraticCurveTo(carLeft, carY, carLeft + 10, carY);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

// Función auxiliar para dibujar rectángulos redondeados
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    const centerX = obstacle.x + OBSTACLE_WIDTH/2;
    const centerY = obstacle.y + OBSTACLE_HEIGHT/2;
    
    // Guardar el estado del contexto
    ctx.save();
    
    // Aplicar transformaciones para animación
    ctx.translate(centerX, centerY);
    ctx.rotate(obstacle.rotation);
    ctx.scale(obstacle.scale, obstacle.scale);
    
    // Calcular opacidad basada en la posición (efecto de fade in)
    const fadeInDistance = 100;
    const opacity = Math.min(1, (obstacle.y + OBSTACLE_HEIGHT) / fadeInDistance);
    
    // Efecto de pulso con glow
    const pulseIntensity = Math.sin(animationFrame * 0.15 + obstacle.animationOffset) * 0.3 + 0.7;
    const glowSize = 15 + Math.sin(animationFrame * 0.2 + obstacle.animationOffset) * 5;
    
    // Sombra del número con glow animado
    ctx.shadowColor = 'rgba(84, 246, 195, 0.6)';
    ctx.shadowBlur = glowSize * pulseIntensity;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Número principal con gradiente verde menta
    const textGradient = ctx.createLinearGradient(-20, -20, 20, 20);
    textGradient.addColorStop(0, '#54f6c3');
    textGradient.addColorStop(0.5, '#7fffd4');
    textGradient.addColorStop(1, '#4ade80');
    
    ctx.fillStyle = textGradient;
    ctx.globalAlpha = opacity;
    ctx.font = 'bold 48px Poppins, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Sombra negra para contraste
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText(obstacle.value.toString(), 0, 0);
    
    // Resaltado brillante
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText(obstacle.value.toString(), 0, 0);
    
    // Efecto de brillo adicional con múltiples capas
    ctx.globalAlpha = opacity * 0.5;
    ctx.shadowColor = 'rgba(84, 246, 195, 0.9)';
    ctx.shadowBlur = 12;
    ctx.fillText(obstacle.value.toString(), 0, 0);
    
    // Restaurar el estado del contexto
    ctx.restore();
    
    // Partículas flotantes alrededor del número (opcional, efecto sutil)
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const angle = (animationFrame * 0.05 + obstacle.animationOffset + (i * Math.PI * 2 / particleCount));
      const radius = 25 + Math.sin(animationFrame * 0.1 + i) * 5;
      const px = centerX + Math.cos(angle) * radius;
      const py = centerY + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.globalAlpha = opacity * 0.3 * (0.5 + Math.sin(animationFrame * 0.2 + i) * 0.5);
      ctx.fillStyle = '#54f6c3';
      ctx.shadowColor = 'rgba(84, 246, 195, 0.8)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
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
  
  correctSound = new Audio('/static/assets/math/acierto.mp3');
  correctSound.volume = 0.7;
  
  incorrectSound = new Audio('/static/assets/math/error.mp3');
  incorrectSound.volume = 0.7;
  
  victorySound = new Audio('/static/assets/math/acierto.mp3');
  victorySound.volume = 0.7;
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

