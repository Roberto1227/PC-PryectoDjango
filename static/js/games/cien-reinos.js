// Configuración del juego
const TOTAL_ROUNDS = 20;
const TIME_PER_QUESTION = 20; // segundos
const MIN_SCORE_TO_WIN = 15;

// Reinos disponibles
const REINOS = {
  ANIMAL: 'Animal',
  PLANTA: 'Planta',
  FUNGICO: 'Fúngico',
  EUCARIOTA: 'Eucariota'
};

// Función helper para obtener la ruta base de assets
function getAssetsBasePath() {
  // Intentar obtener desde gameConfig (generado por Django)
  if (window.gameConfig?.musicUrl) {
    const musicUrl = window.gameConfig.musicUrl;
    // Extraer la ruta base (ej: /static/assets/ciencias/ciensmusic.mp3 -> /static/assets/ciencias/)
    const basePath = musicUrl.substring(0, musicUrl.lastIndexOf('/') + 1);
    return basePath;
  }
  // Fallback
  return '/static/assets/ciencias/';
}

// Función para obtener la ruta base de reinos
function getReinosBasePath() {
  // Usar la URL del config si está disponible (generada por Django)
  let basePath = window.gameConfig?.reinosBaseUrl;
  
  if (basePath) {
    // Asegurar que la ruta sea absoluta y termine con /
    if (!basePath.startsWith('/static/') && !basePath.startsWith('http')) {
      if (basePath.startsWith('/')) {
        basePath = '/static' + basePath;
      } else {
        basePath = '/static/' + basePath;
      }
    }
    if (!basePath.endsWith('/')) {
      basePath += '/';
    }
    console.log('Ruta base desde config:', basePath);
    return basePath;
  }
  
  // Fallback - siempre absoluta
  const fallback = '/static/assets/ciencias/reinos/';
  console.log('Usando ruta base fallback:', fallback);
  return fallback;
}

// Base de datos de imágenes por reino - Todas en la carpeta reinos
function getImagesByReino() {
  const basePath = getReinosBasePath();
  console.log('Ruta base de reinos:', basePath);
  
  return {
    [REINOS.ANIMAL]: [
      basePath + 'animal1.png',
      basePath + 'animal2.png',
      basePath + 'animal3.png',
      basePath + 'animal4.png',
      basePath + 'animal5.png'
    ],
    [REINOS.PLANTA]: [
      basePath + 'planta1.png',
      basePath + 'planta2.png',
      basePath + 'planta3.png',
      basePath + 'planta4.png',
      basePath + 'planta5.png'
    ],
    [REINOS.FUNGICO]: [
      basePath + 'fungico1.png',
      basePath + 'fungico2.png',
      basePath + 'fungico3.png',
      basePath + 'fungico4.png',
      basePath + 'fungico5.png'
    ],
    [REINOS.EUCARIOTA]: [
      basePath + 'eucariota1.png',
      basePath + 'eucariota2.png',
      basePath + 'eucariota3.png',
      basePath + 'eucariota4.png',
      basePath + 'eucariota5.png'
    ]
  };
}

// Variable global que se inicializará cuando gameConfig esté disponible
let imagesByReino = null;

// Variables del juego
let currentRound = 0;
let score = 0;
let shuffledQuestions = [];
let currentQuestion = null;
let timerInterval = null;
let timeRemaining = TIME_PER_QUESTION;
let startTime = null;
let timeElapsed = 0;

// Variables de audio
let backgroundMusic = null;
let correctSound = null;
let incorrectSound = null;
let victorySound = null;
let musicVolume = 0.5;

// Generar todas las preguntas
function generateQuestions() {
  const questions = [];
  
  // Inicializar imagesByReino si no está inicializado
  if (!imagesByReino) {
    imagesByReino = getImagesByReino();
  }
  
  // Crear 5 preguntas por cada reino (5 x 4 = 20)
  Object.keys(REINOS).forEach(reinoKey => {
    const reino = REINOS[reinoKey];
    const images = imagesByReino[reino];
    
    images.forEach(image => {
      questions.push({
        image: image,
        correctReino: reino
      });
    });
  });
  
  // Mezclar las preguntas
  return shuffleArray(questions);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initGame() {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay && modalOverlay.classList.contains('modal-hidden')) {
    createGameInterface();
    startGame();
  }
}

function createGameInterface() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer || gameContainer.querySelector('.game-wrapper')) {
    return;
  }

  gameContainer.innerHTML = `
    <div class="game-wrapper">
      <div class="game-header">
        <div class="header-top">
          <h2 class="game-title">
            <i class="bx bx-leaf"></i>
            Identifica el Reino
          </h2>
          <div class="header-actions">
            <button class="fullscreen-icon" id="fullscreen-btn" title="Pantalla completa">
              <i class="fas fa-expand" id="fullscreen-icon-inner"></i>
            </button>
            <div class="music-control" id="music-control" title="Control de música">
              <i class="bx bx-volume-full" id="music-icon"></i>
              <input type="range" id="volume-slider" min="0" max="100" value="${musicVolume * 100}" class="volume-slider" />
            </div>
          </div>
        </div>
        <div class="game-info">
          <div class="level-display" id="round-display">
            <i class="bx bx-target-lock"></i>
            Ronda 1 de ${TOTAL_ROUNDS}
          </div>
          <div class="score-display">
            <i class="bx bx-star"></i>
            Puntos: <strong id="score-value">0</strong>
          </div>
          <div class="timer-display">
            <i class="bx bx-time-five"></i>
            Tiempo: <strong id="timer">00:00</strong>
          </div>
        </div>
      </div>
      
      <h3 class="game-question" id="game-question">¿A qué reino pertenece?</h3>
      
      <div class="timer-bar-container">
        <div class="timer-bar" id="timer-bar"></div>
      </div>
      
      <div class="game-content">
        <div class="image-container">
          <img id="organism-image" class="organism-image" src="" alt="Organismo" />
        </div>
        
        <div class="options-container" id="options-container">
          <!-- Las opciones se generarán dinámicamente -->
        </div>
      </div>
      
      <div class="feedback-message" id="feedback-message"></div>
    </div>
  `;

  setupFullscreenButton();
  initAudio();
  setupVolumeControl();
}

function startGame() {
  shuffledQuestions = generateQuestions();
  currentRound = 0;
  score = 0;
  timeElapsed = 0;
  startTime = Date.now();
  
  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
  
  updateScore();
  showQuestion();
}

function showQuestion() {
  if (currentRound >= TOTAL_ROUNDS) {
    completeGame();
    return;
  }

  currentQuestion = shuffledQuestions[currentRound];
  timeRemaining = TIME_PER_QUESTION;
  
  // Mostrar imagen
  const imageElement = document.getElementById('organism-image');
  if (imageElement) {
    // Asegurar que la ruta sea absoluta y correcta
    let imageSrc = currentQuestion.image;
    
    console.log('Imagen original del currentQuestion:', imageSrc);
    
    // Normalizar la ruta - asegurar que siempre sea absoluta
    if (!imageSrc) {
      console.error('imageSrc está vacío o undefined');
      return;
    }
    
    // Si la ruta es relativa (no empieza con / o http), construirla
    if (!imageSrc.startsWith('http') && !imageSrc.startsWith('/')) {
      // Extraer solo el nombre del archivo
      const fileName = imageSrc.split('/').pop() || imageSrc;
      // Usar la ruta base del config o fallback
      const basePath = getReinosBasePath();
      imageSrc = basePath + fileName;
      console.log('Ruta relativa detectada, construyendo absoluta:', imageSrc);
    } else if (imageSrc.startsWith('/static/assets/ciencias/')) {
      // Si ya tiene la ruta pero no incluye 'reinos', corregirla
      if (!imageSrc.includes('/reinos/')) {
        const fileName = imageSrc.split('/').pop();
        const basePath = getReinosBasePath();
        imageSrc = basePath + fileName;
        console.log('Ruta sin /reinos/, corrigiendo:', imageSrc);
      }
    } else if (imageSrc.includes('assets/ciencias/animal/') || 
               imageSrc.includes('assets/ciencias/eucariota/') || 
               imageSrc.includes('assets/ciencias/fungico/') || 
               imageSrc.includes('assets/ciencias/planta/') ||
               imageSrc.includes('/animal/') ||
               imageSrc.includes('/eucariota/') ||
               imageSrc.includes('/fungico/') ||
               imageSrc.includes('/planta/')) {
      // Si tiene la ruta antigua (con o sin /static/), corregirla
      const fileName = imageSrc.split('/').pop();
      const basePath = getReinosBasePath();
      imageSrc = basePath + fileName;
      console.log('Ruta antigua detectada, corrigiendo a:', imageSrc);
    }
    
    // Asegurar que empiece con /static/
    if (!imageSrc.startsWith('/static/') && !imageSrc.startsWith('http')) {
      if (imageSrc.startsWith('/')) {
        imageSrc = '/static' + imageSrc;
      } else {
        imageSrc = '/static/' + imageSrc;
      }
      console.log('Ruta sin /static/, agregando:', imageSrc);
    }
    
    console.log('Cargando imagen desde (final):', imageSrc);
    
    imageElement.src = imageSrc;
    imageElement.alt = `Organismo del reino ${currentQuestion.correctReino}`;
    
    // Agregar manejo de errores con múltiples intentos
    let loadAttempts = 0;
    const maxAttempts = 3;
    
    imageElement.onerror = function() {
      loadAttempts++;
      console.error(`✗ Error al cargar imagen (intento ${loadAttempts}/${maxAttempts}):`, this.src);
      
      if (loadAttempts < maxAttempts) {
        // Intentar diferentes rutas
        const fileName = this.src.split('/').pop();
        const alternatives = [
          '/static/assets/ciencias/reinos/' + fileName,
          window.location.origin + '/static/assets/ciencias/reinos/' + fileName,
          'static/assets/ciencias/reinos/' + fileName
        ];
        
        if (loadAttempts <= alternatives.length) {
          this.src = alternatives[loadAttempts - 1];
          console.log('Intentando ruta alternativa:', this.src);
        }
      } else {
        console.error('No se pudo cargar la imagen después de', maxAttempts, 'intentos');
        // Mostrar un placeholder
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.width = '200px';
        placeholder.style.height = '200px';
        placeholder.style.backgroundColor = '#f0f0f0';
        placeholder.style.border = '2px dashed #ccc';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.textContent = 'Imagen no disponible';
        if (this.parentNode) {
          this.parentNode.insertBefore(placeholder, this);
        }
      }
    };
    
    imageElement.onload = function() {
      console.log('✓ Imagen cargada correctamente:', this.src);
      loadAttempts = 0; // Reset contador si carga correctamente
    };
  }
  
  // Generar opciones (correcta + 3 incorrectas aleatorias)
  const allReinos = Object.values(REINOS);
  const wrongReinos = allReinos.filter(r => r !== currentQuestion.correctReino);
  const shuffledWrong = shuffleArray([...wrongReinos]).slice(0, 3);
  const options = shuffleArray([currentQuestion.correctReino, ...shuffledWrong]);
  
  // Renderizar opciones
  renderOptions(options);
  
  // Actualizar display
  updateRoundDisplay();
  updateTimerBar();
  
  // Iniciar temporizador
  startTimer();
}

function renderOptions(options) {
  const container = document.getElementById('options-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  options.forEach((reino, index) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = `Reino ${reino}`;
    button.dataset.reino = reino;
    button.addEventListener('click', () => handleAnswer(reino, button));
    
    // Animación de entrada
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    setTimeout(() => {
      button.style.transition = 'all 0.3s ease';
      button.style.opacity = '1';
      button.style.transform = 'translateY(0)';
    }, index * 100);
    
    container.appendChild(button);
  });
}

function handleAnswer(selectedReino, button) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  const allButtons = document.querySelectorAll('.option-button');
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
  });
  
  const isCorrect = selectedReino === currentQuestion.correctReino;
  const feedbackMessage = document.getElementById('feedback-message');
  
  if (isCorrect) {
    button.classList.add('correct');
    playCorrectSound();
    score += 1;
    updateScore();
    
    if (feedbackMessage) {
      feedbackMessage.innerHTML = '<i class="bx bx-check-circle"></i> ¡Correcto! +1 punto';
      feedbackMessage.className = 'feedback-message success';
    }
    
    createParticleEffect(button);
    
    setTimeout(() => {
      currentRound++;
      if (currentRound >= TOTAL_ROUNDS) {
        completeGame();
      } else {
        showQuestion();
      }
    }, 1500);
  } else {
    button.classList.add('incorrect');
    playIncorrectSound();
    
    // Resaltar la respuesta correcta
    allButtons.forEach(btn => {
      if (btn.dataset.reino === currentQuestion.correctReino) {
        btn.classList.add('correct');
      }
    });
    
    if (feedbackMessage) {
      feedbackMessage.innerHTML = `<i class="bx bx-x-circle"></i> Incorrecto. La respuesta correcta es: <strong>Reino ${currentQuestion.correctReino}</strong>`;
      feedbackMessage.className = 'feedback-message error';
    }
    
    setTimeout(() => {
      currentRound++;
      if (currentRound >= TOTAL_ROUNDS) {
        completeGame();
      } else {
        showQuestion();
      }
    }, 2000);
  }
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  updateTimerBar();
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerBar();
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      
      // Tiempo agotado - tratar como incorrecto
      const allButtons = document.querySelectorAll('.option-button');
      allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.reino === currentQuestion.correctReino) {
          btn.classList.add('correct');
        }
      });
      
      const feedbackMessage = document.getElementById('feedback-message');
      if (feedbackMessage) {
        feedbackMessage.innerHTML = `<i class="bx bx-time"></i> Tiempo agotado. La respuesta correcta es: <strong>Reino ${currentQuestion.correctReino}</strong>`;
        feedbackMessage.className = 'feedback-message error';
      }
      
      setTimeout(() => {
        currentRound++;
        if (currentRound >= TOTAL_ROUNDS) {
          completeGame();
        } else {
          showQuestion();
        }
      }, 2000);
    }
  }, 1000);
}

function updateTimerBar() {
  const timerBar = document.getElementById('timer-bar');
  if (!timerBar) return;
  
  const percentage = (timeRemaining / TIME_PER_QUESTION) * 100;
  timerBar.style.width = `${percentage}%`;
  
  // Cambiar color según el tiempo restante
  timerBar.classList.remove('warning', 'danger');
  if (percentage <= 30) {
    timerBar.classList.add('danger');
  } else if (percentage <= 50) {
    timerBar.classList.add('warning');
  }
  
  // Actualizar tiempo total
  timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

function updateRoundDisplay() {
  const roundDisplay = document.getElementById('round-display');
  if (roundDisplay) {
    roundDisplay.innerHTML = `<i class="bx bx-target-lock"></i> Ronda ${currentRound + 1} de ${TOTAL_ROUNDS}`;
  }
}

function updateScore() {
  const scoreElement = document.getElementById('score-value');
  if (scoreElement) {
    scoreElement.textContent = score;
    scoreElement.parentElement.style.animation = 'scoreUpdate 0.5s ease';
    setTimeout(() => {
      scoreElement.parentElement.style.animation = '';
    }, 500);
  }
}

async function completeGame() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
  
  if (victorySound && score >= MIN_SCORE_TO_WIN) {
    victorySound.currentTime = 0;
    victorySound.play().catch(() => {});
  }
  
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;
  
  const isWin = score >= MIN_SCORE_TO_WIN;
  const backUrl = window.gameConfig?.backUrl || '../ciencia.html';
  const isAuthenticated = window.gameConfig?.isAuthenticated || false;
  
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  if (isWin) {
    createVictoryParticles(gameContainer);
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  gameContainer.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx ${isWin ? 'bx-trophy' : 'bx-x-circle'}" style="font-size: 40px; color: ${isWin ? '#ffd700' : '#ff6b6b'};"></i>
        </div>
        <h2 class="complete-title title-animation">${isWin ? '¡Felicidades!' : 'Game Over'}</h2>
        <p class="complete-message message-animation">${isWin ? 'Has identificado correctamente los reinos' : `No alcanzaste el mínimo de ${MIN_SCORE_TO_WIN} puntos`}</p>
        <div style="background: rgba(180, 255, 26, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(180, 255, 26, 0.3);" class="stats-animation">
          <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación: <span style="color: #b4ff1a;">${score}</span>/${TOTAL_ROUNDS} puntos
          </p>
          <p class="complete-time" style="font-size: 16px;">
            <i class="bx bx-time-five" style="color: #b4ff1a;"></i>
            Tiempo: <span style="color: #b4ff1a;">${timeString}</span>
          </p>
          <p style="font-size: 14px; margin-top: 0.4rem;">
            Precisión: <span style="color: #b4ff1a;">${Math.round((score / TOTAL_ROUNDS) * 100)}%</span>
          </p>
        </div>
        ${!isWin ? `<p style="color: #ff6b6b; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(255, 107, 107, 0.1); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);" class="message-animation"><i class="bx bx-info-circle"></i> Necesitas al menos ${MIN_SCORE_TO_WIN} puntos para ganar. ¡Sigue intentando!</p>` : ''}
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Volver a Jugar
          </button>
          ${isWin ? `<a href="${backUrl}" class="restart-button back-button" style="flex: 1; cursor: pointer;">
            <i class="bx bx-arrow-back"></i>
            Volver
          </a>` : `<button class="restart-button back-button" style="flex: 1; opacity: 0.5; cursor: not-allowed;" disabled title="Necesitas al menos ${MIN_SCORE_TO_WIN} puntos para avanzar">
            <i class="bx bx-lock"></i>
            Bloqueado
          </button>`}
        </div>
      </div>
    </div>
  `;
}

function restartGame() {
  createGameInterface();
  startGame();
}

function initAudio() {
  const musicUrl = window.gameConfig?.musicUrl || '/static/assets/ciencias/ciensmusic.mp3';
  backgroundMusic = new Audio(musicUrl);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;
  
  victorySound = new Audio('/static/assets/exam.mp3');
  victorySound.volume = 0.7;
  
  backgroundMusic.play().catch(() => {});
}

function setupVolumeControl() {
  const volumeSlider = document.getElementById('volume-slider');
  const musicIcon = document.getElementById('music-icon');
  if (!volumeSlider || !musicIcon) return;
  
  volumeSlider.addEventListener('input', (event) => {
    musicVolume = event.target.value / 100;
    if (backgroundMusic) backgroundMusic.volume = musicVolume;
    updateMusicIcon(musicIcon, musicVolume);
  });
  
  musicIcon.addEventListener('click', () => {
    if (!backgroundMusic) return;
    if (backgroundMusic.paused) {
      backgroundMusic.play().catch(() => {});
      volumeSlider.value = musicVolume * 100;
    } else {
      backgroundMusic.pause();
      volumeSlider.value = 0;
      updateMusicIcon(musicIcon, 0);
    }
  });
}

function updateMusicIcon(icon, volume) {
  if (volume === 0) {
    icon.className = 'bx bx-volume-mute';
  } else if (volume < 0.5) {
    icon.className = 'bx bx-volume-low';
  } else {
    icon.className = 'bx bx-volume-full';
  }
}

function setupFullscreenButton() {
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const fullscreenIcon = document.getElementById('fullscreen-icon-inner');
  const gameWrapper = document.querySelector('.game-wrapper');
  if (!fullscreenBtn || !fullscreenIcon || !gameWrapper) return;
  
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      gameWrapper.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });
  
  function updateIcon() {
    if (document.fullscreenElement) {
      fullscreenIcon.className = 'fas fa-compress';
    } else {
      fullscreenIcon.className = 'fas fa-expand';
    }
  }
  
  document.addEventListener('fullscreenchange', updateIcon);
}

function playCorrectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(780, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.25);
  } catch (err) {
    console.log('Error al reproducir sonido:', err);
  }
}

function playIncorrectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (err) {
    console.log('Error al reproducir sonido:', err);
  }
}

function createParticleEffect(element, color = '#b4ff1a') {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = `0 0 10px ${color}`;
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 10;
    const velocity = 80;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    particle.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
      ],
      { duration: 600, easing: 'ease-out' }
    ).onfinish = () => particle.remove();
  }
}

function createVictoryParticles(container) {
  const colors = ['#b4ff1a', '#8cffda', '#f9ff90', '#78f7ff'];
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.width = `${Math.random() * 8 + 4}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 40 + Math.random();
    const velocity = 120 + Math.random() * 80;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    particle.animate(
      [
        { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0) rotate(360deg)`, opacity: 0 }
      ],
      { duration: 900, easing: 'ease-out' }
    ).onfinish = () => particle.remove();
  }
}

// Esperar a que el modal se cierre
document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay && modalOverlay.classList.contains('modal-hidden')) {
    initGame();
  } else if (modalOverlay) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.classList.contains('modal-hidden')) {
          initGame();
        }
      });
    });
    observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
  } else {
    initGame();
  }
});

