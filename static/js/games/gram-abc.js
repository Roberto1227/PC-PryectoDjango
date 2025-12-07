const ABC_TIMER_SECONDS = 90;
const ABC_MUSIC_PATH = '/static/assets/gramatic/gramusic.mp3';
const abcMusic = new Audio(ABC_MUSIC_PATH);
abcMusic.loop = true;
abcMusic.volume = 0.6;
let musicInitialized = false;
const VOLUME_STEP = 0.1;
let volumeDisplay = null;

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
    let numeroJuego = 2;
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
const alphabetData = [
  { letter: 'A', info: 'A de árbol: representa inicios y aventura.' },
  { letter: 'B', info: 'B de barco: nos invita a viajar con las palabras.' },
  { letter: 'C', info: 'C de casa: un sonido suave que abraza.' },
  { letter: 'D', info: 'D de dado: gira para formar historias.' },
  { letter: 'E', info: 'E de estrella: ilumina cada oración.' },
  { letter: 'F', info: 'F de faro: guía la lectura en la noche.' },
  { letter: 'G', info: 'G de gato: juega y maúlla en los cuentos.' },
  { letter: 'H', info: 'H de huella: silenciosa pero importante.' },
  { letter: 'I', info: 'I de isla: rodeada de ideas.' },
  { letter: 'J', info: 'J de juego: la diversión de las palabras.' },
  { letter: 'K', info: 'K de kayak: navega en historias extranjeras.' },
  { letter: 'L', info: 'L de luna: brilla en los poemas.' },
  { letter: 'M', info: 'M de magia: transforma cualquier narración.' },
  { letter: 'N', info: 'N de nido: refugio de letras.' },
  { letter: 'Ñ', info: 'Ñ única en nuestro idioma, abraza palabras como “niño”.' },
  { letter: 'O', info: 'O de ola: trae ritmos al lenguaje.' },
  { letter: 'P', info: 'P de puente: une sílabas y mundos.' },
  { letter: 'Q', info: 'Q de queso: combina sonidos especiales.' },
  { letter: 'R', info: 'R de río: corre rápido en las rimas.' },
  { letter: 'S', info: 'S de sol: ilumina cada párrafo.' },
  { letter: 'T', info: 'T de tren: avanza con firmeza.' },
  { letter: 'U', info: 'U de universo: abre posibilidades infinitas.' },
  { letter: 'V', info: 'V de vela: empuja historias con el viento.' },
  { letter: 'W', info: 'W de windsurf: llega desde otros idiomas.' },
  { letter: 'X', info: 'X de xilófono: suena misteriosa y musical.' },
  { letter: 'Y', info: 'Y de yo-yo: sube y baja en los relatos.' },
  { letter: 'Z', info: 'Z de zorro: astuta y veloz al final del abecedario.' }
];

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let shuffledLetters = [];
  let expectedIndex = 0;
  let timer = null;
  let timeLeft = ABC_TIMER_SECONDS;
  let hintCooldown = false;
  let hintsUsed = 0;

  renderLayout();
  resetBoard();

  function renderLayout() {
    container.innerHTML = `
      <div class="abc-header">
        <div class="abc-title">
          <p class="round-progress">Reto único</p>
          <h2>Ordena el Abecedario</h2>
          <p>Arrastra las letras a la zona superior siguiendo el orden correcto.</p>
        </div>
        <div class="abc-controls">
          <div class="abc-control-row">
            <div class="timer-box">
              <i class='bx bx-time-five'></i>
              <span id="abc-timer">01:30</span>
            </div>
            <div class="bomb-indicator" id="bomb-indicator">
              <i class='bx bx-bomb'></i>
              <span id="bomb-status">Calma total</span>
            </div>
            <div class="audio-controls">
              <button class="audio-btn" id="volume-down" aria-label="Bajar volumen">
                <i class='bx bx-volume-low'></i>
              </button>
              <span class="volume-level" id="volume-level">60%</span>
              <button class="audio-btn" id="volume-up" aria-label="Subir volumen">
                <i class='bx bx-volume-full'></i>
              </button>
            </div>
          </div>
          <div class="abc-control-row buttons-row">
            <button class="abc-btn" id="hint-btn">
              <i class='bx bx-bulb'></i> Pista
            </button>
            <button class="abc-btn secondary" id="reset-btn">
              <i class='bx bx-refresh'></i> Reiniciar
            </button>
          </div>
        </div>
      </div>
      <div class="abc-body">
        <div class="abc-dropzone" id="ordered-zone" aria-label="Zona donde se ordenan las letras"></div>
        <div class="abc-letter-bank" id="letter-bank" aria-label="Bandeja de letras"></div>
      </div>
      <div class="abc-footer">
        <div class="info-panel">
          <h3>Dato educativo</h3>
          <p id="info-text">Coloca la primera letra para descubrir su curiosidad.</p>
        </div>
        <div class="status-panel">
          <h3>Estado del reto</h3>
          <p id="status-text"><strong>¡Comienza!</strong> Arrastra la letra A.</p>
        </div>
      </div>
    `;

    document.getElementById('hint-btn').addEventListener('click', handleHint);
    document.getElementById('reset-btn').addEventListener('click', () => resetBoard('Tablero reiniciado.'));
    document.getElementById('volume-down').addEventListener('click', () => adjustVolume(-VOLUME_STEP));
    document.getElementById('volume-up').addEventListener('click', () => adjustVolume(VOLUME_STEP));

    volumeDisplay = document.getElementById('volume-level');
    updateVolumeUI();

    const dropZone = document.getElementById('ordered-zone');
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', handleDrop);
  }

  function resetBoard(message, options = {}) {
    const { preserveTime = false } = options;
    expectedIndex = 0;
    shuffledLetters = shuffleArray(alphabetData.map((item) => item.letter));
    if (!preserveTime) {
      timeLeft = ABC_TIMER_SECONDS;
      updateTimerDisplay();
      updateBombIndicator();
      clearInterval(timer);
      timer = setInterval(tick, 1000);
    } else {
      updateTimerDisplay();
      updateBombIndicator();
    }
    hintsUsed = 0;
    hintCooldown = false;

    const letterBank = document.getElementById('letter-bank');
    const orderedZone = document.getElementById('ordered-zone');
    const statusText = document.getElementById('status-text');
    const infoText = document.getElementById('info-text');
    letterBank.innerHTML = '';
    orderedZone.innerHTML = '';
    shuffledLetters.forEach((letter) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'letter-tile';
      tile.textContent = letter;
      tile.dataset.letter = letter;
      tile.draggable = true;
      tile.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', letter);
        e.dataTransfer.effectAllowed = 'move';
        tile.classList.add('dragging');
      });
      tile.addEventListener('dragend', () => tile.classList.remove('dragging'));
      tile.addEventListener('click', () => tryPlaceLetter(letter, tile));
      letterBank.appendChild(tile);
    });
    infoText.textContent = 'Coloca la primera letra para descubrir su curiosidad.';
    statusText.innerHTML = message
      ? `<strong>Atención:</strong> ${message}`
      : '<strong>¡Comienza!</strong> Arrastra la letra A.';
    startBackgroundMusic();
  }

  function tick() {
    timeLeft -= 1;
    updateTimerDisplay();
    updateBombIndicator();
    if (timeLeft <= 0) {
      clearInterval(timer);
      triggerBombExplosion();
    }
  }

  function updateTimerDisplay() {
    const timerDisplay = document.getElementById('abc-timer');
    if (!timerDisplay) return;
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  function updateBombIndicator() {
    const indicator = document.getElementById('bomb-indicator');
    const text = document.getElementById('bomb-status');
    if (!indicator || !text) return;
    indicator.classList.remove('warning', 'critical', 'explode');
    if (timeLeft <= 30) {
      indicator.classList.add('critical');
      text.textContent = '¡A punto de explotar!';
    } else if (timeLeft <= 75) {
      indicator.classList.add('warning');
      text.textContent = 'La mecha está activa';
    } else {
      text.textContent = 'Calma total';
    }
  }

  function triggerBombExplosion() {
    const indicator = document.getElementById('bomb-indicator');
    const text = document.getElementById('bomb-status');
    if (indicator) {
      indicator.classList.add('explode');
    }
    if (text) {
      text.textContent = '¡Kaboom! Reiniciando...';
    }
    setTimeout(() => resetBoard('La bomba explotó. ¡Intenta nuevamente!'), 1200);
  }

  function handleDrop(event) {
    event.preventDefault();
    const letter = event.dataTransfer.getData('text/plain');
    const tile = document.querySelector(`.letter-tile[data-letter="${letter}"]`);
    if (letter && tile) {
      tryPlaceLetter(letter, tile);
    }
  }

  function tryPlaceLetter(letter, tile) {
    const expectedLetter = alphabetData[expectedIndex].letter;
    if (letter !== expectedLetter) {
      resetBoard(`La letra "${letter}" no corresponde. Vuelve a intentarlo desde el inicio.`, { preserveTime: true });
      return;
    }
    tile.remove();
    addLetterToOrdered(letter);
    showInfoFor(letter);
    expectedIndex += 1;
    updateStatus(`Letra ${letter} colocada correctamente.`);
    if (expectedIndex === alphabetData.length) {
      finishGame();
    }
  }

  function addLetterToOrdered(letter) {
    const orderedZone = document.getElementById('ordered-zone');
    const chip = document.createElement('div');
    chip.className = 'ordered-letter';
    chip.textContent = letter;
    orderedZone.appendChild(chip);
  }

  function showInfoFor(letter) {
    const infoText = document.getElementById('info-text');
    const data = alphabetData.find((item) => item.letter === letter);
    if (infoText && data) {
      infoText.innerHTML = `<strong>${letter}:</strong> ${data.info}`;
    }
  }

  function updateStatus(message) {
    const statusText = document.getElementById('status-text');
    if (statusText) {
      statusText.innerHTML = `<strong>Estado:</strong> ${message}`;
    }
  }

  function handleHint() {
    if (hintCooldown) {
      updateStatus('Espera un momento antes de pedir otra pista.');
      return;
    }
    const nextLetter = alphabetData[expectedIndex]?.letter;
    if (!nextLetter) return;
    const tile = document.querySelector(`.letter-tile[data-letter="${nextLetter}"]`);
    if (tile) {
      tile.classList.add('hinted');
      setTimeout(() => tile.classList.remove('hinted'), 2000);
      updateStatus(`La siguiente letra es "${nextLetter}".`);
      hintsUsed += 1;
      hintCooldown = true;
      setTimeout(() => { hintCooldown = false; }, 4000);
    }
  }

  async function finishGame() {
    clearInterval(timer);
    
    // Detener música de fondo
    if (abcMusic) {
      abcMusic.pause();
    }
    
    const totalSeconds = ABC_TIMER_SECONDS - timeLeft;
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const summaryTime = `${minutes}:${seconds}`;
    
    // Calcular puntuación (letras completadas - penalización por pistas)
    const score = Math.max(0, alphabetData.length - hintsUsed);
    
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
      completionData = await reportGameCompletion(score, totalSeconds);
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
          const result = await reportGameCompletion(score, totalSeconds);
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
              <i class="bx bx-time-five" style="color: #ff9800;"></i>
              Tiempo: <span style="color: #ff9800;">${summaryTime}</span>
            </p>
            <p class="complete-time" style="font-size: 16px;">
              <i class="bx bx-bulb" style="color: #ff9800;"></i>
              Pistas usadas: <span style="color: #ff9800;">${hintsUsed}</span>
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
  }

  function startBackgroundMusic() {
    if (musicInitialized && !abcMusic.paused) return;
    musicInitialized = true;
    abcMusic.play().catch(() => {
      // Se requiere interacción; el usuario podrá intentarlo nuevamente.
    });
  }

  function adjustVolume(delta) {
    const newVolume = Math.min(1, Math.max(0, parseFloat((abcMusic.volume + delta).toFixed(2))));
    abcMusic.volume = newVolume;
    updateVolumeUI();
  }

  function updateVolumeUI() {
    if (!volumeDisplay) return;
    volumeDisplay.textContent = `${Math.round(abcMusic.volume * 100)}%`;
  }
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

