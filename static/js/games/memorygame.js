// ============================================
// MEMORY GAME - JUEGO DE MEMORIA MATEMÁTICA
// ============================================

// Variables del juego
let cards = [];
let selectedCards = [];
let matchedPairs = [];
let currentRound = 1;
let score = 0;
let gameRunning = false;
let gameCompleted = false;
let startTime = null;
let currentOperation = 'suma';
let targetResult = 0;
let canFlip = true;

// Variables de audio
let backgroundMusic = null;
let correctSound = null;
let incorrectSound = null;
let victorySound = null;
let flipSound = null;
let musicVolume = 0.5;

// Operaciones por ronda
const operations = {
  1: { name: 'Suma', symbol: '+', operation: (a, b) => a + b },
  2: { name: 'Resta', symbol: '-', operation: (a, b) => a - b },
  3: { name: 'Multiplicación', symbol: '×', operation: (a, b) => a * b },
  4: { name: 'División', symbol: '÷', operation: (a, b) => a / b }
};

// Preguntas predefinidas para cada ronda
const predefinedQuestions = {
  1: [ // Suma - 6 parejas
    { target: 10, pairs: [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [6, 4]] },
    { target: 15, pairs: [[5, 10], [6, 9], [7, 8], [8, 7], [9, 6], [10, 5]] },
    { target: 20, pairs: [[8, 12], [9, 11], [10, 10], [11, 9], [12, 8], [13, 7]] },
    { target: 12, pairs: [[3, 9], [4, 8], [5, 7], [6, 6], [7, 5], [8, 4]] },
    { target: 18, pairs: [[6, 12], [7, 11], [8, 10], [9, 9], [10, 8], [11, 7]] }
  ],
  2: [ // Resta - 6 parejas
    { target: 5, pairs: [[10, 5], [12, 7], [15, 10], [18, 13], [20, 15], [22, 17]] },
    { target: 7, pairs: [[12, 5], [15, 8], [18, 11], [20, 13], [22, 15], [25, 18]] },
    { target: 10, pairs: [[15, 5], [18, 8], [20, 10], [22, 12], [25, 15], [28, 18]] },
    { target: 8, pairs: [[13, 5], [15, 7], [18, 10], [20, 12], [22, 14], [25, 17]] },
    { target: 12, pairs: [[18, 6], [20, 8], [22, 10], [25, 13], [28, 16], [30, 18]] }
  ],
  3: [ // Multiplicación - 6 parejas
    { target: 12, pairs: [[2, 6], [3, 4], [4, 3], [6, 2], [1, 12], [12, 1]] },
    { target: 24, pairs: [[3, 8], [4, 6], [6, 4], [8, 3], [2, 12], [12, 2]] },
    { target: 18, pairs: [[2, 9], [3, 6], [6, 3], [9, 2], [1, 18], [18, 1]] },
    { target: 20, pairs: [[2, 10], [4, 5], [5, 4], [10, 2], [1, 20], [20, 1]] },
    { target: 30, pairs: [[3, 10], [5, 6], [6, 5], [10, 3], [2, 15], [15, 2]] }
  ],
  4: [ // División - 6 parejas
    { target: 3, pairs: [[6, 2], [9, 3], [12, 4], [15, 5], [18, 6], [21, 7]] },
    { target: 4, pairs: [[8, 2], [12, 3], [16, 4], [20, 5], [24, 6], [28, 7]] },
    { target: 5, pairs: [[10, 2], [15, 3], [20, 4], [25, 5], [30, 6], [35, 7]] },
    { target: 6, pairs: [[12, 2], [18, 3], [24, 4], [30, 5], [36, 6], [42, 7]] },
    { target: 7, pairs: [[14, 2], [21, 3], [28, 4], [35, 5], [42, 6], [49, 7]] }
  ]
};

let currentQuestionIndex = 0;

// ============================================
// INICIALIZACIÓN
// ============================================

function initGame() {
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
        <h2 class="game-title"><i class="bx bx-brain"></i> Memoria Matemática</h2>
        <div class="game-info">
          <div class="info-row">
            <div class="level-display" id="levelDisplay"><i class="bx bx-trophy"></i> Ronda: 1 (Suma)</div>
            <div class="score-display">
              <i class="bx bx-star"></i>
              <span>Puntos: <strong id="current-score">${score}</strong></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="game-content">
        <div class="question-display" id="questionDisplay">
          Encuentra dos números que <span class="operation-target" id="operationTarget">sumen 10</span>
        </div>
        <div class="cards-container" id="cardsContainer"></div>
        <div class="feedback-message" id="feedbackMessage"></div>
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

  // Configurar componentes
  setupFullscreenButton();
  initAudio();
  setupVolumeControl();
}

// ============================================
// AUDIO
// ============================================

function initAudio() {
  // Música de fondo - usar la URL del config o la ruta absoluta como fallback
  let musicUrl = window.gameConfig?.musicUrl;
  
  if (!musicUrl) {
    musicUrl = '/static/assets/math/matmusic.mp3';
  }
  
  console.log('Cargando música desde:', musicUrl);
  backgroundMusic = new Audio(musicUrl);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;
  
  // Manejar errores de carga
  backgroundMusic.addEventListener('error', function(e) {
    console.error('Error al cargar la música:', e);
    console.error('URL intentada:', musicUrl);
    // Intentar con ruta absoluta como último recurso
    if (musicUrl !== '/static/assets/math/matmusic.mp3') {
      console.log('Intentando con ruta alternativa...');
      backgroundMusic = new Audio('/static/assets/math/matmusic.mp3');
      backgroundMusic.loop = true;
      backgroundMusic.volume = musicVolume;
    }
  });
  
  // Intentar reproducir música (requiere interacción del usuario)
  backgroundMusic.play().catch(err => {
    console.log('No se pudo reproducir música automáticamente (esto es normal, requiere interacción del usuario):', err);
  });

  // Sonidos de efectos
  correctSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
  incorrectSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
  flipSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
  victorySound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');

  // Configurar volumen de efectos
  [correctSound, incorrectSound, flipSound, victorySound].forEach(sound => {
    if (sound) {
      sound.volume = 0.3;
    }
  });
}

function setupVolumeControl() {
  const musicIcon = document.getElementById('music-icon');
  const volumeSlider = document.getElementById('volume-slider');
  
  if (!musicIcon || !volumeSlider) return;

  musicIcon.addEventListener('click', function() {
    if (backgroundMusic) {
      if (backgroundMusic.paused) {
        backgroundMusic.play().catch(() => {});
        musicIcon.className = 'bx bx-volume-full';
      } else {
        backgroundMusic.pause();
        musicIcon.className = 'bx bx-volume-mute';
      }
    }
  });

  volumeSlider.addEventListener('input', function(e) {
    musicVolume = e.target.value / 100;
    if (backgroundMusic) {
      backgroundMusic.volume = musicVolume;
    }
  });
}

// ============================================
// INICIO DEL JUEGO
// ============================================

function startGame() {
  const gameWrapper = document.querySelector('.game-wrapper');
  if (gameWrapper) {
    gameWrapper.style.display = 'flex';
    gameWrapper.style.visibility = 'visible';
    gameWrapper.style.opacity = '1';
  }
  
  // Resetear variables
  gameRunning = true;
  gameCompleted = false;
  score = 0;
  currentRound = 1;
  matchedPairs = [];
  selectedCards = [];
  canFlip = true;
  startTime = Date.now();
  
  // Iniciar música
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
  
  updateScore();
  startNewRound();
}

function startNewRound() {
  if (currentRound > 4) {
    gameCompleted = true;
    stopGame();
    setTimeout(() => {
      completeGame();
    }, 100);
    return;
  }

  // Configurar operación actual
  currentOperation = operations[currentRound];
  const operationName = currentOperation.name;
  const operationSymbol = currentOperation.symbol;
  
  // Resetear índice de pregunta al inicio de cada ronda
  currentQuestionIndex = 0;
  
  // Actualizar display
  const levelDisplay = document.getElementById('levelDisplay');
  if (levelDisplay) {
    levelDisplay.innerHTML = `<i class="bx bx-trophy"></i> Ronda: ${currentRound} (${operationName})`;
  }
  
  // Generar números y objetivo
  generateCards();
  
  // Actualizar pregunta después de generar las cartas (para tener targetResult)
  setTimeout(() => {
    updateQuestion();
  }, 50);
  
  // Limpiar selección
  selectedCards = [];
  matchedPairs = [];
  canFlip = true;
  
  // Mostrar feedback
  showFeedback(`Ronda ${currentRound}: ${operationName}`, 'info');
}

function generateCards() {
  cards = [];
  const cardValues = [];
  
  // Obtener pregunta predefinida para la ronda actual
  const roundQuestions = predefinedQuestions[currentRound];
  if (!roundQuestions || roundQuestions.length === 0) {
    console.error('No hay preguntas predefinidas para la ronda', currentRound);
    return;
  }
  
  // Usar la primera pregunta de la ronda (o rotar si quieres variedad)
  const question = roundQuestions[currentQuestionIndex % roundQuestions.length];
  targetResult = question.target;
  
  // Usar las parejas predefinidas
  question.pairs.forEach(pair => {
    cardValues.push(pair[0], pair[1]);
  });
  
  // Mezclar las cartas
  shuffleArray(cardValues);
  
  // Crear objetos de cartas
  cardValues.forEach((value, index) => {
    cards.push({
      id: index,
      value: value,
      flipped: false,
      matched: false
    });
  });
  
  renderCards();
}

function getFactors(num) {
  const factors = [];
  // Buscar todos los factores posibles
  for (let i = 2; i <= Math.floor(num / 2); i++) {
    if (num % i === 0) {
      const quotient = num / i;
      factors.push([i, quotient]);
      if (i !== quotient) {
        factors.push([quotient, i]);
      }
    }
  }
  // Si no hay factores (número primo o muy pequeño), usar 1 y el número mismo
  if (factors.length === 0) {
    factors.push([1, num], [num, 1]);
  }
  return factors;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderCards() {
  const container = document.getElementById('cardsContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'memory-card';
    if (card.matched) {
      cardElement.classList.add('matched');
    }
    if (card.flipped) {
      cardElement.classList.add('flipped');
    }
    
    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="card-value">${card.value}</div>
        </div>
        <div class="card-back"></div>
      </div>
    `;
    
    cardElement.addEventListener('click', () => handleCardClick(card.id));
    container.appendChild(cardElement);
  });
}

// ============================================
// LÓGICA DEL JUEGO
// ============================================

function handleCardClick(cardId) {
  if (!canFlip || !gameRunning) return;
  
  const card = cards.find(c => c.id === cardId);
  if (!card || card.flipped || card.matched) return;
  
  // Voltear carta
  card.flipped = true;
  selectedCards.push(card);
  
  // Sonido de volteo
  if (flipSound) {
    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});
  }
  
  renderCards();
  
  // Si hay dos cartas seleccionadas, verificar
  if (selectedCards.length === 2) {
    canFlip = false;
    setTimeout(() => {
      checkMatch();
    }, 500);
  }
}

function checkMatch() {
  if (selectedCards.length !== 2) return;
  
  const [card1, card2] = selectedCards;
  
  // Verificar la operación según la ronda
  let result;
  let num1 = Math.max(card1.value, card2.value);
  let num2 = Math.min(card1.value, card2.value);
  
  switch (currentRound) {
    case 1: // Suma
      result = card1.value + card2.value;
      break;
    case 2: // Resta
      result = num1 - num2;
      break;
    case 3: // Multiplicación
      result = card1.value * card2.value;
      break;
    case 4: // División
      result = num1 / num2;
      break;
  }
  
  if (result === targetResult) {
    // Pareja correcta
    card1.matched = true;
    card2.matched = true;
    matchedPairs.push([card1, card2]);
    score += 1;
    
    if (correctSound) {
      correctSound.currentTime = 0;
      correctSound.play().catch(() => {});
    }
    
    const displayNum1 = currentRound === 2 || currentRound === 4 ? num1 : card1.value;
    const displayNum2 = currentRound === 2 || currentRound === 4 ? num2 : card2.value;
    showFeedback(`¡Correcto! ${displayNum1} ${currentOperation.symbol} ${displayNum2} = ${targetResult}`, 'correct');
    updateScore();
    
    // Verificar si se completó la ronda
    if (matchedPairs.length === 6) {
      setTimeout(() => {
        currentRound++;
        startNewRound();
      }, 1500);
    } else {
      // Actualizar la pregunta después de cada pareja correcta
      updateQuestion();
    }
  } else {
    // Pareja incorrecta
    card1.flipped = false;
    card2.flipped = false;
    
    // Mostrar animación de error
    const cardElements = document.querySelectorAll('.memory-card');
    const card1Element = Array.from(cardElements).find(el => {
      const cardId = parseInt(el.querySelector('.card-value')?.textContent === card1.value.toString() ? 
        cards.findIndex(c => c.id === card1.id) : -1);
      return cardId >= 0;
    });
    const card2Element = Array.from(cardElements).find(el => {
      const cardId = parseInt(el.querySelector('.card-value')?.textContent === card2.value.toString() ? 
        cards.findIndex(c => c.id === card2.id) : -1);
      return cardId >= 0;
    });
    
    // Encontrar elementos por índice
    const card1Index = cards.findIndex(c => c.id === card1.id);
    const card2Index = cards.findIndex(c => c.id === card2.id);
    
    if (cardElements[card1Index]) {
      cardElements[card1Index].classList.add('wrong');
    }
    if (cardElements[card2Index]) {
      cardElements[card2Index].classList.add('wrong');
    }
    
    setTimeout(() => {
      if (cardElements[card1Index]) {
        cardElements[card1Index].classList.remove('wrong');
      }
      if (cardElements[card2Index]) {
        cardElements[card2Index].classList.remove('wrong');
      }
    }, 500);
    
    if (incorrectSound) {
      incorrectSound.currentTime = 0;
      incorrectSound.play().catch(() => {});
    }
    
    showFeedback(`Incorrecto. Intenta de nuevo.`, 'incorrect');
  }
  
  selectedCards = [];
  canFlip = true;
  renderCards();
}

function updateQuestion() {
  const questionDisplay = document.getElementById('questionDisplay');
  
  if (!questionDisplay) return;
  
  let text = '';
  switch (currentRound) {
    case 1: // Suma
      text = `Encuentra dos números que <span class="operation-target">sumen ${targetResult}</span>`;
      break;
    case 2: // Resta
      text = `Encuentra dos números que <span class="operation-target">restando el menor del mayor den ${targetResult}</span>`;
      break;
    case 3: // Multiplicación
      text = `Encuentra dos números que <span class="operation-target">multiplicados den ${targetResult}</span>`;
      break;
    case 4: // División
      text = `Encuentra dos números que <span class="operation-target">dividiendo el mayor entre el menor den ${targetResult}</span>`;
      break;
    default:
      text = `Encuentra dos números que <span class="operation-target">sumen ${targetResult}</span>`;
      break;
  }
  
  // Actualizar el texto completo de la pregunta
  questionDisplay.innerHTML = text;
}

function showFeedback(message, type) {
  const feedback = document.getElementById('feedbackMessage');
  if (!feedback) return;
  
  feedback.textContent = message;
  feedback.className = `feedback-message ${type}`;
  
  if (type === 'info') {
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className = 'feedback-message';
    }, 2000);
  } else {
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className = 'feedback-message';
    }, 2000);
  }
}

function updateScore() {
  const scoreDisplay = document.getElementById('current-score');
  if (scoreDisplay) {
    scoreDisplay.textContent = score;
  }
}

// ============================================
// FIN DEL JUEGO
// ============================================

function stopGame() {
  gameRunning = false;
  gameCompleted = true;
  
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

async function completeGame() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;
  
  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Reproducir sonido de victoria
  if (victorySound) {
    victorySound.play().catch(() => {});
  }
  
  // Reportar completación
  try {
    const result = await reportGameCompletion(score, 0);
    console.log('Juego completado:', result);
  } catch (error) {
    console.error('Error al reportar completación:', error);
  }
  
  gameContainer.innerHTML = `
    <div class="game-complete">
      <div class="complete-content">
        <div class="trophy-animation">
          <i class="bx bx-trophy" style="font-size: 64px; color: #ffd700;"></i>
        </div>
        <h2 class="complete-title title-animation">¡Felicidades!</h2>
        <p class="complete-message message-animation">Completaste todas las rondas</p>
        <div class="complete-stats stats-animation">
          <p class="complete-score">Puntos: <span>${score}</span></p>
          <p class="complete-time">Tiempo: <span>${timeString}</span></p>
        </div>
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="location.reload()">
            <i class="bx bx-refresh"></i>
            Jugar de Nuevo
          </button>
          <a href="${window.gameConfig?.backUrl || '../matematica.html'}" class="restart-button back-button">
            <i class="bx bx-arrow-back"></i>
            Volver
          </a>
        </div>
      </div>
    </div>
  `;
  
  createVictoryParticles(gameContainer);
}

// ============================================
// PANTALLA COMPLETA
// ============================================

function setupFullscreenButton() {
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const fullscreenIcon = document.getElementById('fullscreen-icon-inner');
  
  if (!fullscreenBtn || !fullscreenIcon) return;
  
  fullscreenBtn.addEventListener('click', function() {
    const gameWrapper = document.querySelector('.game-wrapper');
    if (!gameWrapper) return;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
      if (gameWrapper.requestFullscreen) {
        gameWrapper.requestFullscreen();
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

