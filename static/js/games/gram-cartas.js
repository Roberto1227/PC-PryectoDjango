const CARTAS_MUSIC_PATH = '/static/assets/gramatic/gramusic.mp3';
const CARTAS_SUCCESS_SOUND = '/static/assets/gramatic/success.mp3';
const CARTAS_ERROR_SOUND = '/static/assets/gramatic/error.mp3';
const MAX_ERRORS = 8;

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
    let numeroJuego = 4;
    const match = path.match(/gramjuego(\d+)/);
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
        modulo: 'gramatica',
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

const cartasData = [
  { word: 'montaña', type: 'sustantivo' },
  { word: 'azul', type: 'adjetivo' },
  { word: 'correr', type: 'verbo' },
  { word: 'amistad', type: 'sustantivo' },
  { word: 'brillante', type: 'adjetivo' },
  { word: 'saltar', type: 'verbo' },
  { word: 'libro', type: 'sustantivo' },
  { word: 'dulce', type: 'adjetivo' },
  { word: 'cantar', type: 'verbo' },
  { word: 'maestro', type: 'sustantivo' },
  { word: 'valiente', type: 'adjetivo' },
  { word: 'escribir', type: 'verbo' },
  { word: 'ciudad', type: 'sustantivo' },
  { word: 'suave', type: 'adjetivo' },
  { word: 'jugar', type: 'verbo' },
  { word: 'lluvia', type: 'sustantivo' },
  { word: 'rápido', type: 'adjetivo' },
  { word: 'nadar', type: 'verbo' },
  { word: 'sonrisa', type: 'sustantivo' },
  { word: 'frío', type: 'adjetivo' },
  { word: 'pensar', type: 'verbo' },
  { word: 'aventura', type: 'sustantivo' },
  { word: 'generoso', type: 'adjetivo' },
  { word: 'hablar', type: 'verbo' },
  { word: 'planeta', type: 'sustantivo' },
  { word: 'luminoso', type: 'adjetivo' },
  { word: 'construir', type: 'verbo' },
  { word: 'familia', type: 'sustantivo' }
];

const TOTAL_CARTAS = cartasData.length;
let cartasBgMusic = null;
let cartasSuccessSound = null;
let cartasErrorSound = null;
let cartasAudioReady = false;
let cartasMuted = false;
let cartasVolume = 0.5;

function ensureCartasAudio() {
  if (cartasAudioReady) return;
  cartasBgMusic = new Audio(CARTAS_MUSIC_PATH);
  cartasBgMusic.loop = true;
  cartasSuccessSound = new Audio(CARTAS_SUCCESS_SOUND);
  cartasErrorSound = new Audio(CARTAS_ERROR_SOUND);
  cartasAudioReady = true;
  setCartasAudioVolume(cartasVolume);
}

function startCartasMusic() {
  ensureCartasAudio();
  if (!cartasMuted) {
    cartasBgMusic.play().catch(() => {});
  }
}

function setCartasAudioVolume(volume) {
  cartasVolume = Math.min(1, Math.max(0, volume));
  if (!cartasAudioReady) return;
  cartasBgMusic.volume = cartasVolume;
  cartasSuccessSound.volume = cartasVolume;
  cartasErrorSound.volume = cartasVolume;
}

function playCartasSound(isCorrect) {
  ensureCartasAudio();
  if (cartasMuted) return;
  const sound = isCorrect ? cartasSuccessSound : cartasErrorSound;
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let cards = [];
  let selectedCard = null;
  let correctCount = 0;
  let errorCount = 0;
  let elapsedSeconds = 0;
  let timerInterval = null;
  let gameFinished = false;

  let gridElement = null;
  let feedbackElement = null;
  let panelWordElement = null;
  let categoryButtons = [];

  setupGame();
  renderLayout();
  renderCards();
  updateStats();
  updateTimerDisplay();
  startTimer();

  function setupGame() {
    cards = cartasData.map((card, index) => ({
      ...card,
      index,
      revealed: false,
      correct: false
    }));
    selectedCard = null;
    correctCount = 0;
    errorCount = 0;
    elapsedSeconds = 0;
    gameFinished = false;
  }

  function renderLayout() {
    container.innerHTML = `
      <div class="cartas-header">
        <div>
          <p class="round-progress">Clasifica las ${TOTAL_CARTAS} palabras</p>
          <h2>Cartas de Gramática</h2>
        </div>
        <div class="cartas-stats">
          <div class="stat-pill">
            <span>Aciertos</span>
            <strong id="stat-correct">0</strong>
          </div>
          <div class="stat-pill">
            <span>Errores (máx ${MAX_ERRORS})</span>
            <strong id="stat-errors">0</strong>
          </div>
          <div class="stat-pill">
            <span>Restantes</span>
            <strong id="stat-remaining">${TOTAL_CARTAS}</strong>
          </div>
          <div class="stat-pill">
            <span>Tiempo</span>
            <strong id="stat-time">00:00</strong>
          </div>
        </div>
      </div>
      <div class="cartas-content">
        <div class="cartas-grid" id="cartas-grid"></div>
        <div class="cartas-panel">
          <h3>Clasifica la palabra</h3>
          <div class="panel-word" id="panel-word">Abre una caja para descubrir la palabra.</div>
          <div class="category-buttons">
            <button class="category-btn" data-type="sustantivo">
              <i class='bx bxs-package'></i> Sustantivo
            </button>
            <button class="category-btn" data-type="adjetivo">
              <i class='bx bxs-star'></i> Adjetivo
            </button>
            <button class="category-btn" data-type="verbo">
              <i class='bx bx-run'></i> Verbo
            </button>
          </div>
          <div class="cartas-feedback" id="cartas-feedback">
            Selecciona una caja numerada para comenzar.
          </div>
          <button class="cartas-reset" id="cartas-reset">
            <i class='bx bx-refresh'></i> Reiniciar juego
          </button>
        </div>
      </div>
    `;

    gridElement = document.getElementById('cartas-grid');
    feedbackElement = document.getElementById('cartas-feedback');
    panelWordElement = document.getElementById('panel-word');
    categoryButtons = Array.from(document.querySelectorAll('.category-btn'));

    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => handleCategoryClick(btn.dataset.type));
    });

    document.getElementById('cartas-reset').addEventListener('click', resetGame);
    setCategoryButtonsDisabled(true);
    startCartasMusic();
  }

  function renderCards() {
    if (!gridElement) return;
    gridElement.innerHTML = cards
      .map((card) => {
        const classes = [
          'carta-box',
          card.revealed ? 'revealed' : '',
          card.correct ? 'correct disabled' : '',
          selectedCard === card.index ? 'active' : ''
        ]
          .filter(Boolean)
          .join(' ');
        return `
          <button class="${classes}" data-card="${card.index}" ${card.correct ? 'disabled' : ''}>
            <span class="box-number">#${card.index + 1}</span>
            <span class="box-word">${card.word}</span>
          </button>
        `;
      })
      .join('');

    gridElement.querySelectorAll('.carta-box').forEach((cardElement) => {
      cardElement.addEventListener('click', () => {
        const index = Number(cardElement.getAttribute('data-card'));
        handleCardClick(index);
      });
    });
  }

  function handleCardClick(index) {
    if (gameFinished) return;
    const card = cards[index];
    if (card.correct) {
      setFeedback(`"${card.word}" ya fue clasificada. Abre otra caja.`, '');
      return;
    }

    cards[index].revealed = true;
    selectedCard = index;
    panelWordElement.textContent = cards[index].word;
    setFeedback('Selecciona la categoría correcta para esta palabra.', '');
    setCategoryButtonsDisabled(false);
    renderCards();
  }

  function handleCategoryClick(selectedType) {
    if (selectedCard === null || gameFinished) {
      setFeedback('Primero abre una caja y observa la palabra.', '');
      return;
    }

    const card = cards[selectedCard];
    if (card.correct) {
      setFeedback('Esta palabra ya fue clasificada. Elige otra caja.', '');
      setCategoryButtonsDisabled(true);
      return;
    }

    if (card.type === selectedType) {
      playCartasSound(true);
      card.correct = true;
      card.revealed = true;
      correctCount += 1;
      setFeedback(`¡Correcto! "${card.word}" es un ${selectedType}.`, 'success');
      flashCardState(card.index, 'correct');
      selectedCard = null;
      panelWordElement.textContent = 'Abre otra caja para continuar.';
      setCategoryButtonsDisabled(true);
      if (correctCount === TOTAL_CARTAS) {
        finishGame();
        return;
      }
    } else {
      errorCount += 1;
      playCartasSound(false);
      setFeedback(`"${card.word}" no es ${selectedType}. Inténtalo nuevamente.`, 'error');
      flashCardState(card.index, 'error');
      if (errorCount >= MAX_ERRORS) {
        setCategoryButtonsDisabled(true);
        finishGame(false);
        return;
      }
    }

    updateStats();
    renderCards();
  }

  function flashCardState(index, state) {
    const cardElement = document.querySelector(`[data-card="${index}"]`);
    if (!cardElement) return;
    cardElement.classList.remove('correct', 'error');
    cardElement.classList.add(state);
    if (state === 'error') {
      setTimeout(() => {
        cardElement.classList.remove('error');
      }, 700);
    }
  }

  function setCategoryButtonsDisabled(disabled) {
    categoryButtons.forEach((btn) => {
      btn.disabled = disabled;
    });
  }

  function updateStats() {
    const remaining = TOTAL_CARTAS - correctCount;
    const correctElement = document.getElementById('stat-correct');
    const errorElement = document.getElementById('stat-errors');
    const remainingElement = document.getElementById('stat-remaining');
    if (correctElement) correctElement.textContent = correctCount;
    if (errorElement) errorElement.textContent = errorCount;
    if (remainingElement) remainingElement.textContent = remaining;
  }

  function setFeedback(message, type) {
    if (!feedbackElement) return;
    feedbackElement.textContent = message;
    feedbackElement.classList.remove('success', 'error');
    if (type) {
      feedbackElement.classList.add(type);
    }
  }

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      elapsedSeconds += 1;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const timeElement = document.getElementById('stat-time');
    if (timeElement) {
      timeElement.textContent = formatTime(elapsedSeconds);
    }
  }

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function resetGame() {
    stopTimer();
    setupGame();
    renderLayout();
    renderCards();
    updateStats();
    updateTimerDisplay();
    startTimer();
  }

  function finishGame(didWin = true) {
    gameFinished = true;
    stopTimer();
    showFinalScreen(didWin);
  }

  async function showFinalScreen(didWin) {
    // Detener música de fondo
    if (cartasBgMusic) {
      cartasBgMusic.pause();
    }
    
    // Calcular puntuación
    const score = didWin ? correctCount : 0;
    
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
    
    // Mostrar pantalla de carga mientras se guarda el progreso (solo si ganó)
    if (didWin) {
      container.innerHTML = `
        <div class="game-complete victory-screen-enter">
          <div class="complete-content">
            <div style="text-align: center; padding: 2rem;">
              <i class="bx bx-loader-alt" style="font-size: 48px; color: #ff9800; animation: rotate 2s linear infinite;"></i>
              <p style="color: #fff; margin-top: 1rem;">Guardando progreso...</p>
            </div>
          </div>
        </div>
      `;
      
      // Reportar completación y esperar respuesta
      let completionData = null;
      let progressSaved = false;
      
      try {
        completionData = await reportGameCompletion(score, elapsedSeconds);
        progressSaved = true;
        console.log('✅ Progreso guardado exitosamente:', completionData);
      } catch (error) {
        console.error('❌ Error al guardar progreso:', error);
        progressSaved = false;
      }
      
      // Esperar un momento antes de mostrar la pantalla final
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const backUrl = window.gameConfig?.backUrl || '/gramatica/';
      const isAuthenticated = true;
      
      const finalScore = completionData?.best_score || score;
      const minScoreRequired = 10;
      const canAdvance = finalScore >= minScoreRequired;
      
      // Función para manejar el botón "Volver"
      const handleBackButton = async (e) => {
        e.preventDefault();
        
        if (!progressSaved && isAuthenticated) {
          const saveButton = e.target.closest('.back-button');
          const originalText = saveButton.innerHTML;
          saveButton.innerHTML = '<i class="bx bx-loader-alt" style="animation: rotate 1s linear infinite;"></i> Guardando...';
          saveButton.disabled = true;
          
          try {
            const result = await reportGameCompletion(score, elapsedSeconds);
            if (result && result.completed) {
              progressSaved = true;
              console.log('✅ Progreso guardado antes de redirigir');
              await new Promise(resolve => setTimeout(resolve, 500));
              window.location.href = backUrl;
            } else {
              alert('No se pudo guardar el progreso. Intenta de nuevo.');
              saveButton.innerHTML = originalText;
              saveButton.disabled = false;
            }
          } catch (error) {
            console.error('❌ Error al guardar progreso:', error);
            alert(`Error al guardar el progreso: ${error.message}\n\nPor favor, verifica que estés autenticado e intenta de nuevo.`);
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
            <div style="background: rgba(255, 152, 0, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(255, 152, 0, 0.3);" class="stats-animation">
              <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
                <i class="bx bx-star" style="color: #ffd700;"></i>
                Puntuación: <span style="color: #ff9800;">${finalScore}</span> puntos
              </p>
              <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
                <i class="bx bx-check-circle" style="color: #ff9800;"></i>
                Aciertos: <span style="color: #ff9800;">${correctCount}</span>
              </p>
              <p class="complete-time" style="font-size: 16px;">
                <i class="bx bx-time-five" style="color: #ff9800;"></i>
                Tiempo: <span style="color: #ff9800;">${formatTime(elapsedSeconds)}</span>
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
      
      // Hacer la función handleBackButton disponible globalmente
      window.handleBackButton = handleBackButton;
    } else {
      // Si perdió, mostrar pantalla de game over sin guardar progreso
      container.innerHTML = `
        <div class="game-complete victory-screen-enter">
          <div class="complete-content victory-content-enter">
            <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
              <i class="bx bx-x-circle" style="font-size: 40px; color: #ff6b6b;"></i>
            </div>
            <h2 class="complete-title title-animation">Game Over</h2>
            <p class="complete-message message-animation">Alcanzaste el máximo de ${MAX_ERRORS} errores. ¡Vuelve a intentarlo!</p>
            <div style="background: rgba(255, 152, 0, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(255, 152, 0, 0.3);" class="stats-animation">
              <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
                <i class="bx bx-check-circle" style="color: #ff9800;"></i>
                Aciertos: <span style="color: #ff9800;">${correctCount}</span>
              </p>
              <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
                <i class="bx bx-x-circle" style="color: #ff9800;"></i>
                Errores: <span style="color: #ff9800;">${errorCount}</span>
              </p>
              <p class="complete-time" style="font-size: 16px;">
                <i class="bx bx-time-five" style="color: #ff9800;"></i>
                Tiempo: <span style="color: #ff9800;">${formatTime(elapsedSeconds)}</span>
              </p>
            </div>
            <div class="complete-buttons buttons-animation">
              <button class="restart-button" onclick="window.location.href='${window.gameConfig?.backUrl || '/gramatica/'}'" style="flex: 1;">
                <i class="bx bx-refresh"></i>
                Volver a Jugar
              </button>
              <a href="${window.gameConfig?.backUrl || '/gramatica/'}" class="restart-button back-button" style="flex: 1;">
                <i class="bx bx-arrow-back"></i>
                Volver
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }
}

