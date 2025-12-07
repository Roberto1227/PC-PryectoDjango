const COLORS_MUSIC_PATH = '/static/assets/english/ingmusic.mp3';
const COLORS_SUCCESS_SOUND = '/static/assets/math/acierto.mp3';
const COLORS_ERROR_SOUND = '/static/assets/math/error.mp3';

const colorTranslations = {
  'light blue': 'azul claro',
  'dark green': 'verde oscuro',
  'bright red': 'rojo brillante',
  'pale yellow': 'amarillo pálido',
  'deep purple': 'morado intenso',
  'light pink': 'rosa claro',
  'dark orange': 'naranja oscuro',
  'bright yellow': 'amarillo brillante',
  'pale green': 'verde pálido',
  'deep blue': 'azul intenso',
  'soft blue': 'azul suave',
  'vivid green': 'verde vívido',
  'neon pink': 'rosa neón',
  'dark red': 'rojo oscuro',
  'light green': 'verde claro'
};

const colorQuestions = [
  {
    question: 'azul claro',
    prefix: 'light',
    color: 'blue',
    correctAnswer: 'light blue',
    explanation: 'Light blue es "azul claro" en inglés.'
  },
  {
    question: 'verde oscuro',
    prefix: 'dark',
    color: 'green',
    correctAnswer: 'dark green',
    explanation: 'Dark green es "verde oscuro" en inglés.'
  },
  {
    question: 'rojo brillante',
    prefix: 'bright',
    color: 'red',
    correctAnswer: 'bright red',
    explanation: 'Bright red es "rojo brillante" en inglés.'
  },
  {
    question: 'amarillo pálido',
    prefix: 'pale',
    color: 'yellow',
    correctAnswer: 'pale yellow',
    explanation: 'Pale yellow es "amarillo pálido" en inglés.'
  },
  {
    question: 'morado intenso',
    prefix: 'deep',
    color: 'purple',
    correctAnswer: 'deep purple',
    explanation: 'Deep purple es "morado intenso" en inglés.'
  },
  {
    question: 'rosa claro',
    prefix: 'light',
    color: 'pink',
    correctAnswer: 'light pink',
    explanation: 'Light pink es "rosa claro" en inglés.'
  },
  {
    question: 'naranja oscuro',
    prefix: 'dark',
    color: 'orange',
    correctAnswer: 'dark orange',
    explanation: 'Dark orange es "naranja oscuro" en inglés.'
  },
  {
    question: 'amarillo brillante',
    prefix: 'bright',
    color: 'yellow',
    correctAnswer: 'bright yellow',
    explanation: 'Bright yellow es "amarillo brillante" en inglés.'
  },
  {
    question: 'verde pálido',
    prefix: 'pale',
    color: 'green',
    correctAnswer: 'pale green',
    explanation: 'Pale green es "verde pálido" en inglés.'
  },
  {
    question: 'azul intenso',
    prefix: 'deep',
    color: 'blue',
    correctAnswer: 'deep blue',
    explanation: 'Deep blue es "azul intenso" en inglés.'
  }
];

// Función para obtener el token CSRF
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Función para reportar completación del juego
async function reportGameCompletion(scoreValue, timeElapsed = 0) {
  try {
    const path = window.location.pathname;
    let numeroJuego = 3;
    const match = path.match(/ingjuego(\d+)/);
    if (match) {
      numeroJuego = parseInt(match[1]);
    }

    const response = await fetch('/api/guardar-progreso-juego/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        modulo: 'ingles',
        numero_juego: numeroJuego,
        puntuacion: scoreValue || 0
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log('✅ Progreso guardado exitosamente');
      return {
        completed: true,
        best_score: scoreValue,
        best_time_seconds: timeElapsed
      };
    } else {
      console.error('Error al guardar progreso:', data.error);
      return {
        completed: false,
        best_score: scoreValue,
        best_time_seconds: timeElapsed,
        error: data.error
      };
    }
  } catch (error) {
    console.error('Error al guardar progreso:', error);
    return {
      completed: false,
      best_score: scoreValue,
      best_time_seconds: timeElapsed,
      error: error.message
    };
  }
}

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentQuestion = 0;
  let score = 0;
  let correctAnswers = 0;
  let lives = 3;
  let draggedElement = null;
  let bgMusic = null;
  let successSound = null;
  let errorSound = null;
  let audioReady = false;
  let isMuted = false;
  let currentVolume = 0.5;
  let currentPrefix = null;
  let currentColor = null;
  let timerInterval = null;
  let timeLeft = 0;
  let questionStartTime = 0;

  renderLayout();
  loadQuestion();

  function renderLayout() {
    container.innerHTML = `
      <div class="colors-header">
        <div>
          <p class="round-progress" id="question-progress">Pregunta 1 de 10</p>
          <h2>English Colors</h2>
        </div>
        <div class="colors-stats">
          <div class="stat-pill">
            <span>Puntuación</span>
            <strong id="colors-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>Correctas</span>
            <strong id="colors-correct">0/10</strong>
          </div>
          <div class="stat-pill">
            <span>Vidas</span>
            <strong id="colors-lives">3</strong>
          </div>
          <div class="stat-pill timer-pill" id="timer-pill">
            <span>Tiempo</span>
            <strong id="timer-display">30</strong>
          </div>
          <div class="volume-control">
            <button class="volume-toggle" id="volume-toggle" title="Mute/unmute sound">
              <i class='bx bx-volume-full'></i>
            </button>
            <input
              type="range"
              class="volume-slider"
              id="volume-range"
              min="0"
              max="100"
              value="${Math.round(currentVolume * 100)}"
            />
          </div>
        </div>
      </div>
      <div class="colors-body">
        <div class="question-container">
          <div class="question-title" id="question-title"></div>
          <div class="question-text" id="question-text"></div>
          
          <div class="drop-zone" id="drop-zone">
            <div class="drop-zone-placeholder">Arrastra un prefijo y un color aquí para formar la respuesta</div>
          </div>
          
          <div class="drag-drop-area">
            <div class="prefixes-container">
              <div class="container-label">Prefijos</div>
              <div id="prefixes-list"></div>
            </div>
            
            <div class="colors-container">
              <div class="container-label">Colores</div>
              <div id="colors-list"></div>
            </div>
          </div>
          
          <div class="feedback-message hidden" id="feedback-message"></div>
        </div>
      </div>
    `;

    const volumeToggle = document.getElementById('volume-toggle');
    const volumeRange = document.getElementById('volume-range');
    if (volumeToggle) {
      volumeToggle.addEventListener('click', toggleMute);
    }
    if (volumeRange) {
      volumeRange.addEventListener('input', handleVolumeChange);
    }
    updateVolumeUI();
    startBackgroundMusic();
    setupDragAndDrop();
  }

  function loadQuestion() {
    if (currentQuestion >= colorQuestions.length) {
      showFinalScreen();
      return;
    }

    const question = colorQuestions[currentQuestion];
    currentPrefix = null;
    currentColor = null;

    document.getElementById('question-progress').textContent = 
      `Pregunta ${currentQuestion + 1} de ${colorQuestions.length}`;
    document.getElementById('question-title').textContent = `Forma el color: "${question.question}"`;
    document.getElementById('question-text').textContent = 
      `Arrastra el prefijo y el color en inglés para formar: "${question.question}"`;
    document.getElementById('colors-score').textContent = score;
    document.getElementById('colors-correct').textContent = `${correctAnswers}/${colorQuestions.length}`;

    // Generate random prefixes and colors (more options for difficulty)
    const allPrefixes = ['light', 'dark', 'bright', 'pale', 'deep', 'soft', 'vivid', 'neon'];
    const allColors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'brown', 'gray', 'black', 'white'];
    
    // Calculate time based on difficulty (less time as questions progress)
    const baseTime = 30;
    const timeReduction = Math.floor(currentQuestion / 3) * 3; // Reduce 3 seconds every 3 questions
    timeLeft = Math.max(15, baseTime - timeReduction); // Minimum 15 seconds
    
    // Start timer
    questionStartTime = Date.now();
    startTimer();

    // Shuffle and select 6 prefixes (including the correct one) - more options = more difficulty
    const shuffledPrefixes = shuffleArray([...allPrefixes]);
    const selectedPrefixes = [question.prefix];
    shuffledPrefixes.forEach(p => {
      if (selectedPrefixes.length < 6 && !selectedPrefixes.includes(p)) {
        selectedPrefixes.push(p);
      }
    });
    const finalPrefixes = shuffleArray(selectedPrefixes);

    // Shuffle and select 6 colors (including the correct one) - more options = more difficulty
    const shuffledColors = shuffleArray([...allColors]);
    const selectedColors = [question.color];
    shuffledColors.forEach(c => {
      if (selectedColors.length < 6 && !selectedColors.includes(c)) {
        selectedColors.push(c);
      }
    });
    const finalColors = shuffleArray(selectedColors);

    // Render prefixes
    const prefixesList = document.getElementById('prefixes-list');
    prefixesList.innerHTML = '';
    finalPrefixes.forEach(prefix => {
      const prefixEl = document.createElement('div');
      prefixEl.className = 'draggable-item';
      prefixEl.textContent = prefix;
      prefixEl.draggable = true;
      prefixEl.dataset.type = 'prefix';
      prefixEl.dataset.value = prefix;
      prefixesList.appendChild(prefixEl);
    });

    // Render colors
    const colorsList = document.getElementById('colors-list');
    colorsList.innerHTML = '';
    finalColors.forEach(color => {
      const colorEl = document.createElement('div');
      colorEl.className = `draggable-item color-${color}`;
      colorEl.textContent = color;
      colorEl.draggable = true;
      colorEl.dataset.type = 'color';
      colorEl.dataset.value = color;
      colorsList.appendChild(colorEl);
    });

    // Reset drop zone
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('filled', 'drag-over');
    dropZone.innerHTML = '<div class="drop-zone-placeholder">Arrastra un prefijo y un color aquí para formar la respuesta</div>';

    // Reset feedback
    const feedback = document.getElementById('feedback-message');
    feedback.classList.add('hidden');
    feedback.classList.remove('success', 'error');

    // Update lives display
    document.getElementById('colors-lives').textContent = lives;
    updateLivesDisplay();

    setupDragAndDrop();
  }

  function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    document.getElementById('timer-display').textContent = timeLeft;
    const timerPill = document.getElementById('timer-pill');
    timerPill.classList.remove('timer-warning', 'timer-danger');

    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('timer-display').textContent = timeLeft;

      // Visual warnings
      if (timeLeft <= 5) {
        timerPill.classList.add('timer-danger');
      } else if (timeLeft <= 10) {
        timerPill.classList.add('timer-warning');
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeUp();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function handleTimeUp() {
    stopTimer();
    playFeedbackSound(false);
    lives--;
    document.getElementById('colors-lives').textContent = lives;
    updateLivesDisplay();

    const feedback = document.getElementById('feedback-message');
    feedback.classList.remove('hidden');
    feedback.classList.add('error');
    feedback.classList.remove('success');
    const question = colorQuestions[currentQuestion];
    feedback.textContent = `⏱️ ¡Tiempo agotado! La respuesta correcta era "${question.correctAnswer}" (${question.question}).`;

    if (lives <= 0) {
      setTimeout(() => {
        showGameOver();
      }, 2000);
    } else {
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }

  function updateLivesDisplay() {
    const livesEl = document.getElementById('colors-lives');
    if (lives <= 1) {
      livesEl.parentElement.classList.add('lives-low');
    } else {
      livesEl.parentElement.classList.remove('lives-low');
    }
  }

  function setupDragAndDrop() {
    const draggableItems = document.querySelectorAll('.draggable-item');
    const dropZone = document.getElementById('drop-zone');

    draggableItems.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
    });

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);
  }

  function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('drag-over');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone.classList.contains('filled')) {
      dropZone.classList.add('drag-over');
    }
  }

  function handleDragLeave(e) {
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('drag-over');
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('drag-over');

    if (!draggedElement) return;

    const type = draggedElement.dataset.type;
    const value = draggedElement.dataset.value;

    // Check if item is already used
    if (draggedElement.classList.contains('used')) {
      return;
    }

    if (type === 'prefix') {
      // Remove previous prefix if exists
      if (currentPrefix) {
        document.querySelectorAll('.draggable-item[data-type="prefix"]').forEach(item => {
          if (item.dataset.value === currentPrefix) {
            item.classList.remove('used');
            item.draggable = true;
          }
        });
      }
      currentPrefix = value;
    } else if (type === 'color') {
      // Remove previous color if exists
      if (currentColor) {
        document.querySelectorAll('.draggable-item[data-type="color"]').forEach(item => {
          if (item.dataset.value === currentColor) {
            item.classList.remove('used');
            item.draggable = true;
          }
        });
      }
      currentColor = value;
    }

    // Mark item as used
    draggedElement.classList.add('used');
    draggedElement.draggable = false;

    // Update drop zone
    updateDropZone();

    // Check if both are selected
    if (currentPrefix && currentColor) {
      setTimeout(() => {
        checkAnswer();
      }, 300);
    }
  }

  function updateDropZone() {
    const dropZone = document.getElementById('drop-zone');
    const answer = currentPrefix && currentColor ? `${currentPrefix} ${currentColor}` : '';
    
    if (answer) {
      dropZone.classList.add('filled');
      dropZone.innerHTML = `
        <div class="drop-zone-content">
          <span>${currentPrefix || '___'}</span>
          <span>${currentColor || '___'}</span>
        </div>
      `;
    } else {
      dropZone.classList.remove('filled');
      dropZone.innerHTML = '<div class="drop-zone-placeholder">Drag a prefix and a color here to form the answer</div>';
    }
  }

  function checkAnswer() {
    const question = colorQuestions[currentQuestion];
    const userAnswer = `${currentPrefix} ${currentColor}`;
    const isCorrect = userAnswer === question.correctAnswer;

    const feedback = document.getElementById('feedback-message');
    feedback.classList.remove('hidden');

    stopTimer();
    const timeTaken = Date.now() - questionStartTime;
    const secondsTaken = Math.floor(timeTaken / 1000);
    const timeBonus = Math.max(0, timeLeft * 2); // Bonus points for remaining time

    if (isCorrect) {
      playFeedbackSound(true);
      // Base points + time bonus + speed bonus
      const basePoints = 10;
      const speedBonus = Math.max(0, Math.floor((timeLeft / 2))); // More points for faster answers
      const pointsEarned = basePoints + timeBonus + speedBonus;
      score += pointsEarned;
      correctAnswers++;
      feedback.classList.add('success');
      feedback.classList.remove('error');
      feedback.textContent = `✓ ¡Correcto! "${question.correctAnswer}" = "${question.question}". ${question.explanation} (+${pointsEarned} puntos - ${secondsTaken}s)`;
      document.getElementById('colors-score').textContent = score;
      document.getElementById('colors-correct').textContent = `${correctAnswers}/${colorQuestions.length}`;
      
      // Auto-advance after 2 seconds
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    } else {
      playFeedbackSound(false);
      lives--;
      document.getElementById('colors-lives').textContent = lives;
      updateLivesDisplay();
      feedback.classList.add('error');
      feedback.classList.remove('success');
      feedback.textContent = `✗ Incorrecto. La respuesta correcta es "${question.correctAnswer}" (${question.question}). ${question.explanation}`;
      
      if (lives <= 0) {
        setTimeout(() => {
          showGameOver();
        }, 2000);
      } else {
        // Allow retry by resetting
        setTimeout(() => {
          resetCurrentQuestion();
        }, 2000);
      }
    }
  }

  function resetCurrentQuestion() {
    currentPrefix = null;
    currentColor = null;
    
    // Reset timer
    const baseTime = 30;
    const timeReduction = Math.floor(currentQuestion / 3) * 3;
    timeLeft = Math.max(15, baseTime - timeReduction);
    questionStartTime = Date.now();
    startTimer();
    
    // Reset all draggable items
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.classList.remove('used');
      item.draggable = true;
    });

    // Reset drop zone
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('filled');
    dropZone.innerHTML = '<div class="drop-zone-placeholder">Arrastra un prefijo y un color aquí para formar la respuesta</div>';

    // Reset feedback
    const feedback = document.getElementById('feedback-message');
    feedback.classList.add('hidden');
    feedback.classList.remove('success', 'error');

    setupDragAndDrop();
  }

  function nextQuestion() {
    stopTimer();
    currentQuestion++;
    loadQuestion();
  }

  async function showGameOver() {
    stopTimer();
    if (bgMusic) bgMusic.pause();
    
    // Aplicar fondo del sitio
    const pageContent = document.querySelector('.page-content');
    const section = document.querySelector('.section');
    const main = document.querySelector('.main');
    const body = document.querySelector('body');
    const gradient = 'linear-gradient(90deg, #2c3c5c 0%, #0d82a3 50%)';
    if (pageContent) pageContent.style.background = gradient;
    if (section) section.style.background = gradient;
    if (main) main.style.background = gradient;
    if (body) body.style.background = gradient;
    
    // Mostrar pantalla de carga mientras se guarda el progreso
    container.innerHTML = `
      <div class="game-complete victory-screen-enter">
        <div class="complete-content">
          <div style="text-align: center; padding: 2rem;">
            <i class="bx bx-loader-alt" style="font-size: 48px; color: #9c27b0; animation: rotate 2s linear infinite;"></i>
            <p style="color: #fff; margin-top: 1rem;">Guardando progreso...</p>
          </div>
        </div>
      </div>
    `;
    
    // Reportar completación
    let completionData = null;
    let progressSaved = false;
    
    try {
      completionData = await reportGameCompletion(score, 0);
      progressSaved = true;
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error);
      progressSaved = false;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const backUrl = window.gameConfig?.backUrl || '/ingles/';
    const isAuthenticated = true;
    const finalScore = completionData?.best_score || score;
    const minScoreRequired = 10;
    const canAdvance = finalScore >= minScoreRequired;
    
    const handleBackButton = async (e) => {
      e.preventDefault();
      if (!progressSaved && isAuthenticated) {
        const saveButton = e.target.closest('.back-button');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="bx bx-loader-alt" style="animation: rotate 1s linear infinite;"></i> Guardando...';
        saveButton.disabled = true;
        try {
          const result = await reportGameCompletion(score, 0);
          if (result && result.completed) {
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = backUrl;
          } else {
            alert('No se pudo guardar el progreso. Intenta de nuevo.');
            saveButton.innerHTML = originalText;
            saveButton.disabled = false;
          }
        } catch (error) {
          alert(`Error al guardar el progreso: ${error.message}`);
          saveButton.innerHTML = originalText;
          saveButton.disabled = false;
        }
      } else {
        window.location.href = backUrl;
      }
    };
    
    container.innerHTML = `
      <div class="game-complete victory-screen-enter">
        <div class="complete-content victory-content-enter">
          <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
            <i class="bx bx-x-circle" style="font-size: 40px; color: #ff6b6b;"></i>
          </div>
          <h2 class="complete-title title-animation">¡Juego terminado!</h2>
          <p class="complete-message message-animation">Se te acabaron las vidas. Completaste ${correctAnswers} de ${colorQuestions.length} preguntas.</p>
          ${progressSaved && isAuthenticated ? '<p style="color: #00ff00; font-size: 13px; margin-bottom: 0.5rem;">✅ Progreso guardado correctamente</p>' : ''}
          <div style="background: rgba(156, 39, 176, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(156, 39, 176, 0.3);" class="stats-animation">
            <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
              <i class="bx bx-star" style="color: #ffd700;"></i>
              Puntuación: <span style="color: #9c27b0;">${finalScore}</span> puntos
            </p>
            <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
              <i class="bx bx-check-circle" style="color: #9c27b0;"></i>
              Respuestas correctas: <span style="color: #9c27b0;">${correctAnswers}/${colorQuestions.length}</span>
            </p>
            <p class="complete-time" style="font-size: 16px;">
              <i class="bx bx-heart" style="color: #9c27b0;"></i>
              Vidas restantes: <span style="color: #9c27b0;">${lives}</span>
            </p>
          </div>
          <div class="complete-buttons buttons-animation">
            <button class="restart-button" onclick="window.location.href='${backUrl}'" style="flex: 1;">
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
    window.handleBackButton = handleBackButton;
  }


  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function ensureAudioInstances() {
    if (audioReady) return;
    bgMusic = new Audio(COLORS_MUSIC_PATH);
    bgMusic.loop = true;
    successSound = new Audio(COLORS_SUCCESS_SOUND);
    errorSound = new Audio(COLORS_ERROR_SOUND);
    audioReady = true;
    setAudioVolume(currentVolume);
    bgMusic.muted = isMuted;
    successSound.muted = isMuted;
    errorSound.muted = isMuted;
  }

  function startBackgroundMusic() {
    ensureAudioInstances();
    if (isMuted) return;
    bgMusic.play().catch(() => {});
  }

  function toggleMute() {
    isMuted = !isMuted;
    ensureAudioInstances();
    bgMusic.muted = isMuted;
    successSound.muted = isMuted;
    errorSound.muted = isMuted;
    if (isMuted) {
      bgMusic.pause();
    } else {
      startBackgroundMusic();
    }
    updateVolumeUI();
  }

  function handleVolumeChange(event) {
    const value = Number(event.target.value) / 100;
    ensureAudioInstances();
    setAudioVolume(value);
    if (value <= 0) {
      isMuted = true;
      bgMusic.pause();
    } else {
      isMuted = false;
      bgMusic.muted = false;
      successSound.muted = false;
      errorSound.muted = false;
      startBackgroundMusic();
    }
    updateVolumeUI();
  }

  function setAudioVolume(volume) {
    currentVolume = Math.min(1, Math.max(0, volume));
    if (!audioReady) return;
    bgMusic.volume = currentVolume;
    successSound.volume = currentVolume;
    errorSound.volume = currentVolume;
  }

  function updateVolumeUI() {
    const icon = document.querySelector('#volume-toggle i');
    const slider = document.getElementById('volume-range');
    if (slider) {
      slider.value = Math.round((isMuted ? 0 : currentVolume) * 100);
    }
    if (icon) {
      let iconClass = 'bx bx-volume-full';
      if (isMuted || currentVolume === 0) {
        iconClass = 'bx bx-volume-mute';
      } else if (currentVolume < 0.4) {
        iconClass = 'bx bx-volume-low';
      }
      icon.className = iconClass;
    }
  }

  function playFeedbackSound(isCorrect) {
    ensureAudioInstances();
    if (isMuted) return;
    const sound = isCorrect ? successSound : errorSound;
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  async function showFinalScreen() {
    stopTimer();
    if (bgMusic) bgMusic.pause();
    
    // Aplicar fondo del sitio
    const pageContent = document.querySelector('.page-content');
    const section = document.querySelector('.section');
    const main = document.querySelector('.main');
    const body = document.querySelector('body');
    const gradient = 'linear-gradient(90deg, #2c3c5c 0%, #0d82a3 50%)';
    if (pageContent) pageContent.style.background = gradient;
    if (section) section.style.background = gradient;
    if (main) main.style.background = gradient;
    if (body) body.style.background = gradient;
    
    // Mostrar pantalla de carga mientras se guarda el progreso
    container.innerHTML = `
      <div class="game-complete victory-screen-enter">
        <div class="complete-content">
          <div style="text-align: center; padding: 2rem;">
            <i class="bx bx-loader-alt" style="font-size: 48px; color: #9c27b0; animation: rotate 2s linear infinite;"></i>
            <p style="color: #fff; margin-top: 1rem;">Guardando progreso...</p>
          </div>
        </div>
      </div>
    `;
    
    // Reportar completación
    let completionData = null;
    let progressSaved = false;
    
    try {
      completionData = await reportGameCompletion(score, 0);
      progressSaved = true;
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error);
      progressSaved = false;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const backUrl = window.gameConfig?.backUrl || '/ingles/';
    const isAuthenticated = true;
    const finalScore = completionData?.best_score || score;
    const minScoreRequired = 10;
    const canAdvance = finalScore >= minScoreRequired;
    
    const handleBackButton = async (e) => {
      e.preventDefault();
      if (!progressSaved && isAuthenticated) {
        const saveButton = e.target.closest('.back-button');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="bx bx-loader-alt" style="animation: rotate 1s linear infinite;"></i> Guardando...';
        saveButton.disabled = true;
        try {
          const result = await reportGameCompletion(score, 0);
          if (result && result.completed) {
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = backUrl;
          } else {
            alert('No se pudo guardar el progreso. Intenta de nuevo.');
            saveButton.innerHTML = originalText;
            saveButton.disabled = false;
          }
        } catch (error) {
          alert(`Error al guardar el progreso: ${error.message}`);
          saveButton.innerHTML = originalText;
          saveButton.disabled = false;
        }
      } else {
        window.location.href = backUrl;
      }
    };
    
    container.innerHTML = `
      <div class="game-complete victory-screen-enter">
        <div class="complete-content victory-content-enter">
          <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
            <i class="bx bx-trophy" style="font-size: 40px; color: #ffd700;"></i>
          </div>
          <h2 class="complete-title title-animation">¡Felicidades!</h2>
          <p class="complete-message message-animation">Has completado todos los niveles</p>
          ${progressSaved && isAuthenticated ? '<p style="color: #00ff00; font-size: 13px; margin-bottom: 0.5rem;">✅ Progreso guardado correctamente</p>' : ''}
          <div style="background: rgba(156, 39, 176, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(156, 39, 176, 0.3);" class="stats-animation">
            <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
              <i class="bx bx-star" style="color: #ffd700;"></i>
              Puntuación: <span style="color: #9c27b0;">${finalScore}</span> puntos
            </p>
            <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
              <i class="bx bx-check-circle" style="color: #9c27b0;"></i>
              Respuestas correctas: <span style="color: #9c27b0;">${correctAnswers}/${colorQuestions.length}</span>
            </p>
            <p class="complete-time" style="font-size: 16px;">
              <i class="bx bx-palette" style="color: #9c27b0;"></i>
              Preguntas: <span style="color: #9c27b0;">${colorQuestions.length}</span>
            </p>
          </div>
          ${!canAdvance ? `<p style="color: #ff6b6b; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(255, 107, 107, 0.1); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);" class="message-animation"><i class="bx bx-info-circle"></i> Necesitas al menos ${minScoreRequired} puntos para avanzar. ¡Sigue intentando!</p>` : ''}
          <div class="complete-buttons buttons-animation">
            <button class="restart-button" onclick="window.location.href='${backUrl}'" style="flex: 1;">
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
    window.handleBackButton = handleBackButton;
  }
}

