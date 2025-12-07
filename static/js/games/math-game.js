// Variables del juego
let currentLevel = 1;
let score = 0;
let currentQuestionIndex = 0;
let startTime = null;
let timerInterval = null;
let timeElapsed = 0;

// Variables de audio
let backgroundMusic = null;
let correctSound = null;
let incorrectSound = null;
let victorySound = null;
let musicVolume = 0.5; // Volumen por defecto (0-1)

// Preguntas por nivel
const questions = {
  1: [
    {
      question: "¿Qué número sigue en la secuencia?",
      sequence: [2, 5, 8, 11, "___"],
      options: ["13", "14", "15"],
      correct: 1, // 14
      type: "completar"
    },
    {
      question: "¿Qué número sigue en la secuencia?",
      sequence: [40, 35, 30, 25, "___"],
      options: ["20", "15", "24"],
      correct: 0, // 20
      type: "completar"
    },
    {
      question: "¿Qué número sigue en la secuencia?",
      sequence: [10, 11, 12, 13, "___"],
      options: ["14", "15", "16"],
      correct: 0, // 14
      type: "completar"
    },
    {
      question: "¿Qué número sigue en la secuencia?",
      sequence: [3, 6, 12, 24, "___"],
      options: ["30", "36", "48"],
      correct: 2, // 48
      type: "completar"
    },
    {
      question: "¿Qué número sigue en la secuencia?",
      sequence: [1, 4, 9, 16, "___"],
      options: ["20", "25", "32"],
      correct: 1, // 25
      type: "completar"
    }
  ],
  2: [
    {
      question: "¿De cuánto es la secuencia?",
      sequence: [5, 10, 15, 20],
      options: ["Se suma 3", "Se suma 5", "Se suma 10"],
      correct: 1, // Se suma 5
      type: "patron"
    },
    {
      question: "¿De cuánto es la secuencia?",
      sequence: [18, 16, 14, 12],
      options: ["Se resta 2", "Se suma 2", "Se resta 4"],
      correct: 0, // Se resta 2
      type: "patron"
    },
    {
      question: "¿De cuánto es la secuencia?",
      sequence: [10, 20, 30, 40],
      options: ["Se suma 10", "Se suma 5", "Se suma 20"],
      correct: 0, // Se suma 10
      type: "patron"
    },
    {
      question: "¿De cuánto es la secuencia?",
      sequence: [2, 4, 8, 16],
      options: ["Se suma 2", "Se multiplica por 2", "Se multiplica por 4"],
      correct: 1, // Se multiplica por 2
      type: "patron"
    },
    {
      question: "¿De cuánto es la secuencia?",
      sequence: [50, 52, 54, 56],
      options: ["Se suma 1", "Se suma 4", "Se suma 2"],
      correct: 2, // Se suma 2
      type: "patron"
    }
  ],
  3: [
    {
      question: "¿Cuál es la secuencia que suma 3 en 3?",
      sequence: null,
      options: ["1, 2, 3, 4", "3, 6, 9, 12", "5, 10, 15, 20"],
      correct: 1, // 3, 6, 9, 12
      type: "elegir"
    },
    {
      question: "¿Qué secuencia disminuye de 7 en 7?",
      sequence: null,
      options: ["50, 40, 30, 20", "21, 14, 7, 0", "30, 25, 20, 15"],
      correct: 1, // 21, 14, 7, 0
      type: "elegir"
    },
    {
      question: "¿Qué secuencia muestra el doble del número anterior?",
      sequence: null,
      options: ["2, 4, 6, 8", "5, 15, 25, 35", "2, 4, 8, 16"],
      correct: 2, // 2, 4, 8, 16
      type: "elegir"
    },
    {
      question: "¿Cuál es la secuencia que suma 10 en 10?",
      sequence: null,
      options: ["1, 10, 100, 1000", "50, 60, 70, 80", "10, 20, 35, 40"],
      correct: 1, // 50, 60, 70, 80
      type: "elegir"
    },
    {
      question: "¿Qué secuencia disminuye de 5 en 5?",
      sequence: null,
      options: ["10, 9, 8, 7", "30, 25, 20, 15", "15, 12, 9, 6"],
      correct: 1, // 30, 25, 20, 15
      type: "elegir"
    }
  ]
};

// Títulos de niveles
const levelTitles = {
  1: "Nivel 1: Completar la Secuencia",
  2: "Nivel 2: Identificar el Patrón",
  3: "Nivel 3: Elegir la Secuencia Correcta"
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
        <h2 class="game-title"><i class="bx bx-math"></i> Juego de Secuencias Numéricas</h2>
        <div class="game-info">
          <div class="level-display" id="level-title"><i class="bx bx-trophy"></i> ${levelTitles[currentLevel]}</div>
          <div class="info-row">
            <div class="score-display">
              <i class="bx bx-star"></i>
              <span>Puntos: <strong id="current-score">${score}</strong></span>
            </div>
            <div class="timer-display">
              <i class="bx bx-time-five"></i>
              <span>Tiempo: <strong id="timer">00:00</strong></span>
            </div>
          </div>
        </div>
        <p class="game-instruction" id="game-instruction"><i class="bx bx-info-circle"></i> Encuentra el siguiente número en la secuencia</p>
      </div>
      
      <div class="game-content">
        <div class="question-display" id="question-display"></div>
        <div class="sequence-display" id="sequence-display"></div>
        <div class="options-container" id="options-container"></div>
        <div class="feedback-message" id="feedback-message"></div>
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

  // Configurar botón de pantalla completa
  setupFullscreenButton();
  
  // Inicializar audio
  initAudio();
  
  // Configurar control de volumen
  setupVolumeControl();
}

// Iniciar el juego
function startGame() {
  currentLevel = 1;
  currentQuestionIndex = 0;
  score = 0;
  timeElapsed = 0;
  startTime = Date.now();
  
  // Iniciar música de fondo si no está reproduciéndose
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(err => {
      console.log('No se pudo reproducir música:', err);
    });
  }
  
  updateScore();
  startTimer();
  showQuestion();
}

// Iniciar temporizador
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, 1000);
}

// Detener temporizador
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Mostrar pregunta
function showQuestion() {
  const levelQuestions = questions[currentLevel];
  if (!levelQuestions || currentQuestionIndex >= levelQuestions.length) {
    // Nivel completado
    completeLevel();
    return;
  }

  const question = levelQuestions[currentQuestionIndex];
  const questionDisplay = document.getElementById('question-display');
  const optionsContainer = document.getElementById('options-container');
  const feedbackMessage = document.getElementById('feedback-message');
  const levelTitle = document.getElementById('level-title');
  const instruction = document.getElementById('game-instruction');

  // Actualizar título del nivel e instrucción
  if (levelTitle) {
    levelTitle.textContent = levelTitles[currentLevel];
  }
  
  if (instruction) {
    if (currentLevel === 1) {
      instruction.textContent = "Encuentra el siguiente número en la secuencia";
    } else if (currentLevel === 2) {
      instruction.textContent = "Identifica el patrón de la secuencia";
    } else {
      instruction.textContent = "Elige la secuencia que cumple la regla";
    }
  }

  // Mostrar pregunta
  if (questionDisplay) {
    questionDisplay.textContent = question.question;
  }

  // Mostrar secuencia de forma visual
  const sequenceDisplay = document.getElementById('sequence-display');
  if (sequenceDisplay) {
    if (question.sequence) {
      sequenceDisplay.innerHTML = '';
      question.sequence.forEach((num, index) => {
        const numElement = document.createElement('span');
        numElement.className = 'sequence-number';
        if (num === "___") {
          numElement.className += ' sequence-blank';
          numElement.textContent = "?";
        } else {
          numElement.textContent = num;
        }
        
        // Animación de entrada escalonada
        numElement.style.opacity = '0';
        numElement.style.transform = 'scale(0) rotate(180deg)';
        setTimeout(() => {
          numElement.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          numElement.style.opacity = '1';
          numElement.style.transform = 'scale(1) rotate(0deg)';
        }, index * 100);
        
        sequenceDisplay.appendChild(numElement);
        
        // Agregar flecha entre números (excepto después del último)
        if (index < question.sequence.length - 1) {
          const arrow = document.createElement('span');
          arrow.className = 'sequence-arrow';
          arrow.textContent = '→';
          arrow.style.opacity = '0';
          setTimeout(() => {
            arrow.style.transition = 'all 0.3s ease';
            arrow.style.opacity = '1';
          }, index * 100 + 50);
          sequenceDisplay.appendChild(arrow);
        }
      });
      sequenceDisplay.style.display = 'flex';
    } else {
      sequenceDisplay.style.display = 'none';
    }
  }

  // Limpiar opciones
  if (optionsContainer) {
    optionsContainer.innerHTML = '';
  }

  // Mostrar opciones
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = option;
    button.dataset.index = index;

    // Animación de entrada
    button.style.opacity = '0';
    button.style.transform = 'scale(0)';
    setTimeout(() => {
      button.style.transition = 'all 0.3s ease';
      button.style.opacity = '1';
      button.style.transform = 'scale(1)';
    }, index * 50);

    button.addEventListener('click', () => checkAnswer(index, button));
    optionsContainer.appendChild(button);
  });

  // Limpiar feedback
  if (feedbackMessage) {
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';
  }
}

// Verificar respuesta
function checkAnswer(selectedIndex, button) {
  const levelQuestions = questions[currentLevel];
  const question = levelQuestions[currentQuestionIndex];
  const allButtons = document.querySelectorAll('.option-button');
  const feedbackMessage = document.getElementById('feedback-message');

  // Deshabilitar todos los botones
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
  });

  if (selectedIndex === question.correct) {
    // Respuesta correcta
    button.classList.add('correct');
    playCorrectSound();
    score += 1; // 1 punto por respuesta correcta
    updateScore();

    if (feedbackMessage) {
      feedbackMessage.innerHTML = '<i class="bx bx-check-circle"></i> ¡Correcto! +1 punto';
      feedbackMessage.className = 'feedback-message correct-feedback';
      feedbackMessage.style.animation = 'bounceIn 0.5s ease';
    }

    // Animación de éxito mejorada
    button.style.animation = 'correctPulse 0.6s ease';
    
    // Efecto de confeti/partículas
    createParticleEffect(button);

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex >= levelQuestions.length) {
        completeLevel();
      } else {
        showQuestion();
      }
    }, 1500);
  } else {
    // Respuesta incorrecta
    button.classList.add('incorrect');
    playIncorrectSound();

    // Resaltar la respuesta correcta
    allButtons.forEach(btn => {
      if (parseInt(btn.dataset.index) === question.correct) {
        btn.classList.add('correct');
        btn.style.animation = 'correctPulse 0.6s ease';
      }
    });

    if (feedbackMessage) {
      feedbackMessage.innerHTML = `<i class="bx bx-x-circle"></i> Incorrecto. La respuesta correcta es: <strong>${question.options[question.correct]}</strong>`;
      feedbackMessage.className = 'feedback-message incorrect-feedback';
      feedbackMessage.style.animation = 'shake 0.5s ease';
    }

    // Animación de error
    button.style.animation = 'shake 0.5s ease';

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex >= levelQuestions.length) {
        completeLevel();
      } else {
        showQuestion();
      }
    }, 2000);
  }
}

// Completar nivel
function completeLevel() {
  if (currentLevel < 3) {
    // Pasar al siguiente nivel
    currentLevel++;
    currentQuestionIndex = 0;
    showQuestion();
  } else {
    // Juego completado
    completeGame();
  }
}

// Completar juego
async function completeGame() {
  stopTimer();
  
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
  
  // Calcular bonus de tiempo
  let bonusPoints = 0;
  if (timeElapsed < 60) {
    bonusPoints = 5;
    score += bonusPoints;
  }

  const gameContainer = document.getElementById('game-container');
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Animación de confeti/partículas antes de mostrar la pantalla
  createVictoryParticles(gameContainer);

  // Esperar un momento para la animación
  await new Promise(resolve => setTimeout(resolve, 500));

  // Ocultar el juego antes de mostrar la pantalla de carga
  const gameWrapper = gameContainer.querySelector('.game-wrapper');
  if (gameWrapper) {
    gameWrapper.style.display = 'none';
    gameWrapper.style.visibility = 'hidden';
    gameWrapper.style.opacity = '0';
    gameWrapper.style.position = 'absolute';
    gameWrapper.style.zIndex = '-1';
  }
  
  // Aplicar el fondo del sitio a los contenedores padre
  const pageContent = document.querySelector('.page-content');
  const section = document.querySelector('.section');
  const container = document.querySelector('.container');
  const main = document.querySelector('.main');
  const body = document.querySelector('body');
  const gradient = 'linear-gradient(90deg, #2c3c5c 0%, #0d82a3 50%)';
  if (pageContent) {
    pageContent.style.background = gradient;
  }
  if (section) {
    section.style.background = gradient;
  }
  if (container) {
    container.style.background = gradient;
  }
  if (main) {
    main.style.background = gradient;
  }
  if (body) {
    body.style.background = gradient;
  }

  // Mostrar pantalla de carga mientras se guarda el progreso
  gameContainer.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content">
        <div style="text-align: center; padding: 2rem;">
          <i class="bx bx-loader-alt" style="font-size: 48px; color: #54f6c3; animation: rotate 2s linear infinite;"></i>
          <p style="color: #fff; margin-top: 1rem;">Guardando progreso...</p>
        </div>
      </div>
    </div>
  `;

  // Reportar completación y esperar respuesta
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

  // Esperar un momento antes de mostrar la pantalla final
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mostrar pantalla de finalización con animación
  const backUrl = window.gameConfig?.backUrl || '/matematica/';
  const isAuthenticated = window.gameConfig?.isAuthenticated || false;
  const loginUrl = '/login/';

  const finalScore = completionData?.best_score || score;
  const bestTime = completionData?.best_time_seconds || timeElapsed;
  const bestTimeMinutes = Math.floor(bestTime / 60);
  const bestTimeSeconds = bestTime % 60;
  const bestTimeString = `${String(bestTimeMinutes).padStart(2, '0')}:${String(bestTimeSeconds).padStart(2, '0')}`;

  // Función para manejar el botón "Volver"
  const handleBackButton = async (e) => {
    e.preventDefault();
    
    // Si el progreso no se ha guardado, intentar guardarlo de nuevo
    if (!progressSaved && isAuthenticated) {
      const saveButton = e.target.closest('.back-button');
      const originalText = saveButton.innerHTML;
      saveButton.innerHTML = '<i class="bx bx-loader-alt" style="animation: rotate 1s linear infinite;"></i> Guardando...';
      saveButton.disabled = true;
      
      try {
        const result = await reportGameCompletion(score, timeElapsed);
        if (result && result.completed) {
          progressSaved = true;
          console.log('✅ Progreso guardado antes de redirigir');
          // Esperar un momento para asegurar que se guardó
          await new Promise(resolve => setTimeout(resolve, 500));
          window.location.href = backUrl;
        } else {
          alert('No se pudo guardar el progreso. Intenta de nuevo.');
          saveButton.innerHTML = originalText;
          saveButton.disabled = false;
        }
      } catch (error) {
        console.error('❌ Error al guardar progreso:', error);
        const errorMessage = error.message || 'Error desconocido al guardar el progreso';
        alert(`Error al guardar el progreso: ${errorMessage}\n\nPor favor, verifica que estés autenticado e intenta de nuevo.`);
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
      }
    } else {
      // Si ya se guardó o no está autenticado, redirigir directamente
      window.location.href = backUrl;
    }
  };

  // Verificar si cumple con el mínimo de 10 puntos
  const minScoreRequired = 10;
  const canAdvance = score >= minScoreRequired;
  
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
            Puntuación: <span style="color: #54f6c3;">${score}</span> puntos
          </p>
          <p class="complete-time" style="font-size: 16px;">
            <i class="bx bx-time-five" style="color: #54f6c3;"></i>
            Tiempo: <span style="color: #54f6c3;">${bestTimeString}</span>
          </p>
          ${bonusPoints > 0 ? `<p class="complete-bonus" style="margin-top: 0.4rem; font-size: 14px;">Bonus por velocidad: +${bonusPoints} puntos</p>` : ''}
        </div>
        ${!canAdvance ? `<p style="color: #ff6b6b; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(255, 107, 107, 0.1); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);" class="message-animation"><i class="bx bx-info-circle"></i> Necesitas al menos ${minScoreRequired} puntos para avanzar. ¡Sigue intentando!</p>` : ''}
        ${!isAuthenticated && canAdvance ? `<p style="color: #54f6c3; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(84, 246, 195, 0.1); border-radius: 10px;" class="message-animation">¡Regístrate gratis para guardar tu progreso y desbloquear más juegos!</p>` : ''}
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Volver a Jugar
          </button>
          ${canAdvance ? `<a href="${backUrl}" class="restart-button back-button" style="flex: 1; cursor: pointer;" onclick="event.preventDefault(); handleBackButton(event);">
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
  
  // Hacer la función handleBackButton disponible globalmente
  window.handleBackButton = handleBackButton;
}

// Reiniciar juego
function restartGame() {
  currentLevel = 1;
  currentQuestionIndex = 0;
  score = 0;
  timeElapsed = 0;
  startTime = Date.now();
  createGameInterface();
  startGame();
}

// Actualizar puntuación
function updateScore() {
  const scoreElement = document.getElementById('current-score');
  if (scoreElement) {
    scoreElement.textContent = score;
    // Animación al actualizar puntuación
    scoreElement.parentElement.style.animation = 'scoreUpdate 0.5s ease';
    setTimeout(() => {
      scoreElement.parentElement.style.animation = '';
    }, 500);
  }
}

// Inicializar audio
function initAudio() {
  // Música de fondo - usar la URL del config o la ruta absoluta como fallback
  let musicUrl = window.gameConfig?.musicUrl;
  
  // Si no hay URL en el config, intentar diferentes rutas
  if (!musicUrl) {
    // Intentar ruta absoluta desde static
    musicUrl = '/static/assets/math/matmusic.mp3';
  }
  
  console.log('Cargando música desde:', musicUrl);
  backgroundMusic = new Audio(musicUrl);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;
  
  // Cargar sonido de victoria
  victorySound = new Audio('/static/assets/math/acierto.mp3');
  victorySound.volume = 0.7;
  
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
  
  // Crear sonidos usando Web Audio API
  createSounds();
}

// Crear sonidos de acierto y fallo
function createSounds() {
  // Los sonidos se crearán usando Web Audio API cuando se necesiten
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

// Configurar control de volumen
function setupVolumeControl() {
  const volumeSlider = document.getElementById('volume-slider');
  const musicIcon = document.getElementById('music-icon');
  
  if (!volumeSlider || !musicIcon) return;
  
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    musicVolume = volume;
    
    if (backgroundMusic) {
      backgroundMusic.volume = volume;
    }
    
    // Actualizar icono según el volumen
    if (volume === 0) {
      musicIcon.className = 'bx bx-volume-mute';
    } else if (volume < 0.5) {
      musicIcon.className = 'bx bx-volume-low';
    } else {
      musicIcon.className = 'bx bx-volume-full';
    }
  });
  
  // Click en el icono para silenciar/activar
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

// Crear efecto de partículas para respuesta correcta
function createParticleEffect(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
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

// Crear efecto de partículas de victoria
function createVictoryParticles(container) {
  const colors = ['#ffd700', '#54f6c3', '#ff6b6b', '#4ecdc4', '#ffe66d'];
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.position = 'fixed';
    particle.style.width = Math.random() * 8 + 4 + 'px';
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    particle.style.boxShadow = `0 0 10px ${color}`;
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 50 + Math.random() * 0.5;
    const velocity = 150 + Math.random() * 100;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(0) rotate(360deg)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 500,
      easing: 'ease-out'
    }).onfinish = () => {
      particle.remove();
    };
  }
}

// Configurar botón de pantalla completa
function setupFullscreenButton() {
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const fullscreenIcon = document.getElementById('fullscreen-icon-inner');
  const gameWrapper = document.querySelector('.game-wrapper');

  if (!fullscreenBtn || !gameWrapper) return;

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
      // Entrar en pantalla completa
      if (gameWrapper.requestFullscreen) {
        gameWrapper.requestFullscreen().catch(err => {
          console.log('Error al entrar en pantalla completa:', err);
        });
      } else if (gameWrapper.webkitRequestFullscreen) {
        gameWrapper.webkitRequestFullscreen();
      } else if (gameWrapper.mozRequestFullScreen) {
        gameWrapper.mozRequestFullScreen();
      } else if (gameWrapper.msRequestFullscreen) {
        gameWrapper.msRequestFullscreen();
      }
    } else {
      // Salir de pantalla completa
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

  // Función para actualizar el icono
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

  // Actualizar icono cuando cambia el estado
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
  document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
  document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
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

async function reportGameCompletion(score, timeElapsed) {
  // Modo estático - no hay backend Django, solo retornar datos simulados
  console.log('Modo estático: Progreso no se guarda (sin backend Django)');
  
  // Simular respuesta del servidor
  return {
    completed: true,
    best_score: score,
    best_time_seconds: timeElapsed,
    demo_mode: true,
    message: 'Modo demo - regístrate para guardar tu progreso'
  };
}
