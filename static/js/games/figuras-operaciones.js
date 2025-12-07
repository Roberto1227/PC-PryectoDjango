// Variables del juego
let currentLevel = 1;
let score = 0;
let lives = 4;
let currentExerciseIndex = 0;
let startTime = null;
let timerInterval = null;
let timeElapsed = 0;
let gamePhase = 'explanation'; // 'explanation' o 'operations'

// Variables de audio
let backgroundMusic = null;
let correctSound = null;
let incorrectSound = null;
let victorySound = null;
let musicVolume = 0.5;

// Mapa de figuras con sus valores (lados)
const figuresMap = {
  'circulo.png': { name: 'Círculo', sides: 1 },
  'semicirculo.png': { name: 'Semicírculo', sides: 2 },
  'triangulo.png': { name: 'Triángulo', sides: 3 },
  'cuadrado.png': { name: 'Cuadrado', sides: 4 },
  'pentagono.png': { name: 'Pentágono', sides: 5 },
  'hexagono.png': { name: 'Hexágono', sides: 6 },
  'heptagono.png': { name: 'Heptágono', sides: 7 },
  'octagono.png': { name: 'Octágono', sides: 8 },
  'estrella.png': { name: 'Estrella', sides: 9 }
};

// Lista de todas las figuras
const allFigures = Object.keys(figuresMap);

// Generar ejercicios para cada nivel
function generateExercises() {
  const exercises = {
    1: [], // Sumas
    2: [], // Restas
    3: []  // Multiplicaciones
  };

  // Generar 5 ejercicios por nivel
  for (let level = 1; level <= 3; level++) {
    for (let i = 0; i < 5; i++) {
      let figure1, figure2, answer;
      
      do {
        figure1 = allFigures[Math.floor(Math.random() * allFigures.length)];
        figure2 = allFigures[Math.floor(Math.random() * allFigures.length)];
        
        const sides1 = figuresMap[figure1].sides;
        const sides2 = figuresMap[figure2].sides;
        
        if (level === 1) {
          // Suma
          answer = sides1 + sides2;
        } else if (level === 2) {
          // Resta (asegurar resultado positivo)
          if (sides1 < sides2) {
            [figure1, figure2] = [figure2, figure1];
          }
          answer = figuresMap[figure1].sides - figuresMap[figure2].sides;
        } else {
          // Multiplicación
          answer = sides1 * sides2;
        }
      } while (answer <= 0 || answer > 100); // Evitar respuestas inválidas
      
      exercises[level].push({
        figure1: figure1,
        figure2: figure2,
        answer: answer,
        operation: level === 1 ? 'suma' : level === 2 ? 'resta' : 'multiplicación'
      });
    }
  }
  
  return exercises;
}

let exercises = generateExercises();

// Títulos de niveles
const levelTitles = {
  1: "Nivel 1: Sumas",
  2: "Nivel 2: Restas",
  3: "Nivel 3: Multiplicaciones"
};

// Inicializar el juego cuando el modal se cierre
function initGame() {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay && modalOverlay.classList.contains('modal-hidden')) {
    createGameInterface();
    startGame();
  }
}

// Crear la interfaz del juego
function createGameInterface() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer || gameContainer.querySelector('.game-wrapper')) {
    return; // Ya está creado
  }

  gameContainer.innerHTML = `
    <div class="game-wrapper">
      <div class="game-header">
        <h2 class="game-title"><i class="bx bx-shape-polygon"></i> Operaciones con Figuras</h2>
        <div class="game-info-panel">
          <div class="level-display" id="level-title">
            <span class="info-label">Nivel</span>
            <span class="info-value">Explicación</span>
          </div>
          <div class="info-item">
            <span class="info-label">Puntos</span>
            <span class="info-value" id="current-score">${score}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Vidas</span>
            <span class="info-value" id="current-lives">${lives}</span>
          </div>
        </div>
      </div>
      
      <div class="game-content" id="game-content">
        <!-- Contenido dinámico -->
      </div>
    </div>
  `;

  // Inicializar audio
  initAudio();
}

// Iniciar el juego
function startGame() {
  currentLevel = 1;
  currentExerciseIndex = 0;
  score = 0;
  lives = 4;
  timeElapsed = 0;
  gamePhase = 'explanation';
  startTime = Date.now();
  
  // Regenerar ejercicios
  exercises = generateExercises();
  
  // Iniciar música de fondo si no está reproduciéndose
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(err => {
      console.log('No se pudo reproducir música:', err);
    });
  }
  
  updateScore();
  updateLives();
  showExplanationPhase();
}

// Mostrar fase de explicación
function showExplanationPhase() {
  const gameContent = document.getElementById('game-content');
  if (!gameContent) return;

  gameContent.innerHTML = `
    <div class="explanation-phase">
      <h3 class="explanation-title">Aprende los lados de cada figura:</h3>
      <div class="figures-grid">
        ${allFigures.map(figure => {
          const fig = figuresMap[figure];
          return `
            <div class="figure-item">
              <img src="/static/assets/math/figuras/${figure}" alt="${fig.name}">
              <div class="figure-name">${fig.name}</div>
              <div class="figure-sides">${fig.sides} ${fig.sides === 1 ? 'lado' : 'lados'}</div>
            </div>
          `;
        }).join('')}
      </div>
      <button class="submit-button" id="continue-button" style="margin-top: 0.75rem; position: sticky; bottom: 0; z-index: 10;">
        <i class="bx bx-right-arrow-circle"></i>
        Continuar a las Operaciones
      </button>
    </div>
  `;

  const continueButton = document.getElementById('continue-button');
  if (continueButton) {
    continueButton.addEventListener('click', () => {
      gamePhase = 'operations';
      showOperation();
    });
  }
}

// Mostrar operación
function showOperation() {
  const levelExercises = exercises[currentLevel];
  if (!levelExercises || currentExerciseIndex >= levelExercises.length) {
    // Nivel completado
    completeLevel();
    return;
  }

  const exercise = levelExercises[currentExerciseIndex];
  const gameContent = document.getElementById('game-content');
  const levelTitle = document.getElementById('level-title');

  if (levelTitle) {
    levelTitle.innerHTML = `
      <span class="info-label">${levelTitles[currentLevel]}</span>
      <span class="info-value">Ejercicio ${currentExerciseIndex + 1}/5</span>
    `;
  }

  const operationSymbol = exercise.operation === 'suma' ? '+' : exercise.operation === 'resta' ? '−' : '×';
  const operationName = exercise.operation === 'suma' ? 'Suma' : exercise.operation === 'resta' ? 'Resta' : 'Multiplicación';

  if (gameContent) {
    gameContent.innerHTML = `
      <div class="operation-phase">
        <div class="operation-display">
          <div class="figure-display">
            <img src="/static/assets/math/figuras/${exercise.figure1}" alt="${figuresMap[exercise.figure1].name}">
          </div>
          <div class="operation-symbol">${operationSymbol}</div>
          <div class="figure-display">
            <img src="/static/assets/math/figuras/${exercise.figure2}" alt="${figuresMap[exercise.figure2].name}">
          </div>
        </div>
        <div class="operation-type">${operationName}</div>
        <div class="answer-input-container">
          <label class="answer-input-label">Escribe tu respuesta:</label>
          <input type="text" class="answer-input" id="answer-input" placeholder="?" pattern="[0-9]*" inputmode="numeric" autocomplete="off">
          <button class="submit-button" id="submit-button">
            <i class="bx bx-check"></i>
            Verificar
          </button>
        </div>
        <div class="feedback-message" id="feedback-message"></div>
      </div>
    `;

    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');

    // Solo permitir números
    if (answerInput) {
      answerInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });

      answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          }
        }
      });

      // Focus en el input
      setTimeout(() => answerInput.focus(), 100);
    }

    if (submitButton) {
      submitButton.addEventListener('click', () => checkAnswer(exercise));
    }
  }
}

// Verificar respuesta
function checkAnswer(exercise) {
  const answerInput = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-button');
  const feedbackMessage = document.getElementById('feedback-message');

  if (!answerInput || !submitButton || !feedbackMessage) return;

  const userAnswer = parseInt(answerInput.value);
  
  if (isNaN(userAnswer)) {
    feedbackMessage.innerHTML = '<i class="bx bx-error-circle"></i> Por favor, escribe un número';
    feedbackMessage.className = 'feedback-message incorrect-feedback';
    return;
  }

  // Deshabilitar input y botón
  answerInput.disabled = true;
  submitButton.disabled = true;

  if (userAnswer === exercise.answer) {
    // Respuesta correcta
    playCorrectSound();
    score += 1;
    updateScore();

    feedbackMessage.innerHTML = '<i class="bx bx-check-circle"></i> ¡Correcto! +1 punto';
    feedbackMessage.className = 'feedback-message correct-feedback';
    feedbackMessage.style.animation = 'correctPulse 0.6s ease';

    // Efecto visual
    createParticleEffect(submitButton);

    setTimeout(() => {
      currentExerciseIndex++;
      if (currentExerciseIndex >= exercises[currentLevel].length) {
        completeLevel();
      } else {
        showOperation();
      }
    }, 2000);
  } else {
    // Respuesta incorrecta
    playIncorrectSound();
    lives--;
    updateLives();

    feedbackMessage.innerHTML = `<i class="bx bx-x-circle"></i> Incorrecto. La respuesta correcta es: <strong>${exercise.answer}</strong>`;
    feedbackMessage.className = 'feedback-message incorrect-feedback';
    feedbackMessage.style.animation = 'shake 0.5s ease';

    if (lives <= 0) {
      // Game Over
      setTimeout(() => {
        showGameOver();
      }, 2000);
    } else {
      setTimeout(() => {
        currentExerciseIndex++;
        if (currentExerciseIndex >= exercises[currentLevel].length) {
          completeLevel();
        } else {
          showOperation();
        }
      }, 2000);
    }
  }
}

// Completar nivel
function completeLevel() {
  if (currentLevel < 3) {
    // Pasar al siguiente nivel
    currentLevel++;
    currentExerciseIndex = 0;
    showOperation();
  } else {
    // Juego completado
    completeGame();
  }
}

// Mostrar Game Over
function showGameOver() {
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

// Completar juego
async function completeGame() {
  // Detener música de fondo
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
  
  // Reproducir sonido de victoria
  if (victorySound) {
    victorySound.currentTime = 0;
    victorySound.play().catch(err => {
      console.log('No se pudo reproducir sonido de victoria:', err);
    });
  }

  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  const gameWrapper = gameContainer.querySelector('.game-wrapper');
  if (gameWrapper) {
    gameWrapper.style.display = 'none';
  }

  applyBackgroundGradient();

  // Reportar completación
  let completionData = null;
  let progressSaved = false;
  
  try {
    completionData = await reportGameCompletion(score, timeElapsed);
    progressSaved = true;
    console.log('✅ Progreso guardado exitosamente:', completionData);
  } catch (error) {
    console.error('❌ Error al guardar progreso:', error);
    progressSaved = false;
  }

  const backUrl = window.gameConfig?.backUrl || '../matematica.html';
  const isAuthenticated = window.gameConfig?.isAuthenticated || false;

  const finalScore = completionData?.best_score || score;
  const minScoreRequired = 10;
  const canAdvance = finalScore >= minScoreRequired;

  gameContainer.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx bx-trophy" style="font-size: 40px; color: #ffd700;"></i>
        </div>
        <h2 class="complete-title title-animation">¡Felicidades!</h2>
        <p class="complete-message message-animation">Has completado todos los niveles</p>
        ${progressSaved && isAuthenticated ? '<p style="color: #00ff00; font-size: 13px; margin-bottom: 0.5rem;">✅ Progreso guardado correctamente</p>' : ''}
        <div style="background: rgba(84, 246, 195, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(84, 246, 195, 0.3);" class="stats-animation">
          <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación: <span style="color: #54f6c3;">${finalScore}</span> puntos
          </p>
        </div>
        ${!canAdvance ? `<p style="color: #ff6b6b; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(255, 107, 107, 0.1); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);" class="message-animation"><i class="bx bx-info-circle"></i> Necesitas al menos ${minScoreRequired} puntos para avanzar. ¡Sigue intentando!</p>` : ''}
        ${!isAuthenticated && canAdvance ? `<p style="color: #54f6c3; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(84, 246, 195, 0.1); border-radius: 10px;" class="message-animation">¡Regístrate gratis para guardar tu progreso y desbloquear más juegos!</p>` : ''}
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Volver a Jugar
          </button>
          ${canAdvance ? `<a href="${backUrl}" class="restart-button back-button" style="flex: 1;">
            <i class="bx bx-arrow-back"></i>
            Volver
          </a>` : `<button class="restart-button back-button" style="flex: 1; opacity: 0.5; cursor: not-allowed;" disabled title="Necesitas al menos ${minScoreRequired} puntos para avanzar">
            <i class="bx bx-lock"></i>
            Bloqueado
          </button>`}
        </div>
      </div>
    </div>
  `;
}

// Reiniciar juego
function restartGame() {
  currentLevel = 1;
  currentExerciseIndex = 0;
  score = 0;
  lives = 4;
  timeElapsed = 0;
  gamePhase = 'explanation';
  startTime = Date.now();
  exercises = generateExercises();
  createGameInterface();
  startGame();
}

// Actualizar puntuación
function updateScore() {
  const scoreElement = document.getElementById('current-score');
  if (scoreElement) {
    scoreElement.textContent = score;
    scoreElement.style.animation = 'pulseValue 0.5s ease';
    setTimeout(() => {
      scoreElement.style.animation = '';
    }, 500);
  }
}

// Actualizar vidas
function updateLives() {
  const livesElement = document.getElementById('current-lives');
  if (livesElement) {
    livesElement.textContent = lives;
    livesElement.style.animation = 'pulseValue 0.5s ease';
    setTimeout(() => {
      livesElement.style.animation = '';
    }, 500);
  }
}

// Aplicar fondo degradado
function applyBackgroundGradient() {
  const gradient = 'linear-gradient(90deg, #2c3c5c 0%, #0d82a3 50%)';
  const pageContent = document.querySelector('.page-content');
  const section = document.querySelector('.section');
  const container = document.querySelector('.container');
  const main = document.querySelector('.main');
  const body = document.querySelector('body');
  
  if (pageContent) pageContent.style.background = gradient;
  if (section) section.style.background = gradient;
  if (container) container.style.background = gradient;
  if (main) main.style.background = gradient;
  if (body) body.style.background = gradient;
}

// Inicializar audio
function initAudio() {
  let musicUrl = window.gameConfig?.musicUrl;
  
  if (!musicUrl) {
    musicUrl = '/static/assets/math/matmusic.mp3';
  }
  
  console.log('Cargando música desde:', musicUrl);
  backgroundMusic = new Audio(musicUrl);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;
  
  // Cargar sonido de victoria
  victorySound = new Audio('/static/assets/math/acierto.mp3');
  victorySound.volume = 0.7;
  
  backgroundMusic.addEventListener('error', function(e) {
    console.error('Error al cargar la música:', e);
    if (musicUrl !== '/static/assets/math/matmusic.mp3') {
      backgroundMusic = new Audio('/static/assets/math/matmusic.mp3');
      backgroundMusic.loop = true;
      backgroundMusic.volume = musicVolume;
    }
  });
  
  backgroundMusic.play().catch(err => {
    console.log('No se pudo reproducir música automáticamente:', err);
  });
}

// Reproducir sonido de acierto
function playCorrectSound() {
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

// Reproducir sonido de fallo
function playIncorrectSound() {
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

// Crear efecto de partículas
function createParticleEffect(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.position = 'fixed';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.backgroundColor = '#00ff00';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 10;
    const velocity = 100;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    }).onfinish = () => {
      particle.remove();
    };
  }
}

// Reportar completación del juego
async function reportGameCompletion(score, timeElapsed) {
  console.log('Modo estático: Progreso no se guarda (sin backend Django)');
  
  return {
    completed: true,
    best_score: score,
    best_time_seconds: timeElapsed,
    demo_mode: true,
    message: 'Modo demo - regístrate para guardar tu progreso'
  };
}

// Esperar a que el modal se cierre
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

