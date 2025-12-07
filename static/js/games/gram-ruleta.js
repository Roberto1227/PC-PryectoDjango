const ruletaConfig = {
  totalRounds: 10,
  pointsPerValidSentence: 2,
  streakBonus: 0,
  dictionary: [
    'amigo', 'bosque', 'caminar', 'descubrir', 'escribir',
    'felicidad', 'guitarra', 'honesto', 'imaginación', 'jardín',
    'kilo', 'luminosa', 'mariposa', 'navegar', 'obedecer',
    'pintar', 'querido', 'risas', 'sabio', 'trabajar',
    'universo', 'valiente', 'whisky', 'xilófono', 'yoyo', 'zorro'
  ]
};

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentRound = 1;
  let currentWords = [];
  let selectedWord = '';
  let score = 0;
  let streak = 0;
  let canvas, ctx;
  let spinning = false;
  let currentRotation = 0;
let wheelWords = ruletaConfig.dictionary.slice(0, 10);
const bgMusic = new Audio('/static/assets/gramatic/gramusic.mp3');
bgMusic.loop = true;
let currentVolume = 0.4;
bgMusic.volume = currentVolume;
const successSound = new Audio('/static/assets/gramatic/success.mp3');
const errorSound = new Audio('/static/assets/gramatic/error.mp3');
successSound.volume = currentVolume;
errorSound.volume = currentVolume;
let isMuted = false;

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
    let numeroJuego = 5;
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

  renderLayout();
  setupCanvas();
  updateStats();
  startBackgroundMusic();

  function renderLayout() {
    container.innerHTML = `
      <div class="ruleta-header">
        <div>
          <p class="round-progress">Ronda ${currentRound} de ${ruletaConfig.totalRounds}</p>
          <h2>Ruleta Gramatical</h2>
        </div>
        <div class="ruleta-info">
          <div class="stat-card">
            <span>PUNTOS</span>
            <strong id="stat-score">0</strong>
          </div>
          <div class="stat-card">
            <span>RACHA</span>
            <strong id="stat-streak">0</strong>
          </div>
          <div class="volume-control">
            <button class="volume-toggle" id="volume-toggle" title="Silenciar/activar sonido">
              <i class='bx bx-volume-full'></i>
            </button>
            <input type="range" id="volume-range" min="0" max="100" value="${currentVolume * 100}" />
          </div>
        </div>
      </div>
      <div class="ruleta-body">
        <div class="ruleta-canvas">
          <div class="ruleta-pointer" id="ruleta-pointer">
            <span>Usa esta palabra</span>
          </div>
          <canvas id="ruleta-canvas" width="360" height="360"></canvas>
          <div class="ruleta-controls">
            <button class="ruleta-btn spin" id="btn-spin">
              <i class='bx bx-refresh'></i> Girar Ruleta
            </button>
            <button class="ruleta-btn secondary" id="btn-clear">
              <i class='bx bx-eraser'></i> Limpiar Oración
            </button>
          </div>
        </div>
        <div class="ruleta-panel">
          <h3>Palabra seleccionada</h3>
          <div class="palabras-lista" id="palabras-lista"></div>
          <h3>Tu oración</h3>
          <textarea class="textarea-ruleta" id="textarea-oracion" placeholder="Escribe aquí tu oración..."></textarea>
          <div class="ruleta-controls">
            <button class="ruleta-btn spin" id="btn-validar">
              <i class='bx bx-check'></i> Validar oración
            </button>
          </div>
          <div class="ruleta-feedback" id="ruleta-feedback">
            Gira la ruleta para recibir palabras.
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-spin').addEventListener('click', handleSpin);
    document.getElementById('btn-clear').addEventListener('click', () => {
      document.getElementById('textarea-oracion').value = '';
      setFeedback('Escribe tu nueva oración.', '');
    });
    document.getElementById('btn-validar').addEventListener('click', validateSentence);
    document.getElementById('volume-toggle').addEventListener('click', toggleVolume);
    document.getElementById('volume-range').addEventListener('input', handleVolumeChange);
  }

  function setupCanvas() {
    canvas = document.getElementById('ruleta-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    currentRotation = 0;
    drawWheel(wheelWords, currentRotation);
  }

  function drawWheel(words, rotation = 0) {
    if (!ctx) return;
    const segments = words.length;
    const angle = (2 * Math.PI) / segments;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);

    words.forEach((word, index) => {
      const startAngle = index * angle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle);
      ctx.fillStyle = index % 2 === 0 ? '#ffb347' : '#ff9100';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.translate(
        centerX + Math.cos(startAngle + angle / 2) * (radius * 0.65),
        centerY + Math.sin(startAngle + angle / 2) * (radius * 0.65)
      );
      ctx.rotate(startAngle + angle / 2);
      ctx.fillStyle = '#3b1f00';
      ctx.font = 'bold 16px "Poppins"';
      ctx.textAlign = 'center';
      ctx.fillText(word.toUpperCase(), 0, 5);
      ctx.restore();
    });

    ctx.restore();
  }

  function handleSpin() {
    if (spinning) return;
    spinning = true;
    wheelWords = shuffleArray(ruletaConfig.dictionary).slice(0, 10);
    const segments = wheelWords.length;
    const angle = (2 * Math.PI) / segments;
    const targetIndex = Math.floor(Math.random() * segments);
    selectedWord = wheelWords[targetIndex];

    const pointerAngle = -Math.PI / 2;
    const segmentCenter = targetIndex * angle + angle / 2;
    const desiredRotation = pointerAngle - segmentCenter;
    const fullTurns = Math.floor(Math.random() * 3) + 5; // 5-7 vueltas completas
    const finalRotation = desiredRotation + 2 * Math.PI * fullTurns;
    const startRotation = 0;
    const animationDuration = 3200;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      currentRotation = startRotation + (finalRotation - startRotation) * eased;
      drawWheel(wheelWords, currentRotation);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        currentWords = wheelWords;
        showWords();
        setFeedback(`Tu palabra es "${selectedWord}". Escríbela en una oración completa.`, '');
      }
    };

    requestAnimationFrame(animate);
  }

  function showWords() {
    const containerWords = document.getElementById('palabras-lista');
    if (!selectedWord) {
      containerWords.innerHTML = '<p class="palabra-diana">Gira la ruleta para obtener tu palabra.</p>';
      setPointerWord('');
      return;
    }
    containerWords.innerHTML = `<p class="palabra-diana">Debes usar la palabra <strong>${selectedWord}</strong> en tu oración.</p>`;
    setPointerWord(selectedWord);
  }

  function setPointerWord(word) {
    const pointer = document.getElementById('ruleta-pointer');
    if (!pointer) return;
    pointer.querySelector('span').textContent = word ? word.toUpperCase() : 'GIRA LA RULETA';
  }

  function validateSentence() {
    if (!selectedWord) {
      setFeedback('Gira la ruleta para obtener tu palabra.', 'error');
      return;
    }
    const textarea = document.getElementById('textarea-oracion');
    const sentence = textarea.value.trim();
    if (!sentence) {
      setFeedback('Escribe tu oración antes de validar.', 'error');
      return;
    }
    const errors = [];
    if (!/^[A-ZÁÉÍÓÚÜÑ]/.test(sentence)) {
      errors.push('La oración debe iniciar con mayúscula.');
    }
    if (!/[.!?]$/.test(sentence)) {
      errors.push('La oración debe terminar con un signo de puntuación (., !, ?).');
    }
    if (!sentence.toLowerCase().includes(selectedWord.toLowerCase())) {
      errors.push(`La oración debe incluir la palabra "${selectedWord}".`);
    }

    if (errors.length) {
      streak = 0;
      updateStats();
      setFeedback(errors.join(' '), 'error');
      playSound(errorSound);
      nextRound(false);
      return;
    }

    const points = ruletaConfig.pointsPerValidSentence;
    score += points;
    streak += 1;
    updateStats();
    setFeedback(`¡Excelente! Sumaste ${points} puntos y llevas ${streak} de racha.`, 'success');
    playSound(successSound);
    nextRound(true);
  }
  function startBackgroundMusic() {
    bgMusic.play().catch(() => {});
  }

  function playSound(audio) {
    if (isMuted) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function toggleVolume() {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    successSound.muted = isMuted;
    errorSound.muted = isMuted;
    const icon = isMuted ? 'bx-volume-mute' : 'bx-volume-full';
    const toggle = document.getElementById('volume-toggle');
    if (toggle) {
      toggle.innerHTML = `<i class='bx ${icon}'></i>`;
    }
  }

  function handleVolumeChange(e) {
    currentVolume = Number(e.target.value) / 100;
    bgMusic.volume = currentVolume;
    successSound.volume = currentVolume;
    errorSound.volume = currentVolume;
  }

  function nextRound(success) {
    document.getElementById('textarea-oracion').value = '';
    selectedWord = '';
    showWords();
    if (currentRound >= ruletaConfig.totalRounds) {
      showFinalScreen();
      return;
    }
    currentRound += 1;
    document.querySelector('.round-progress').textContent =
      `Ronda ${currentRound} de ${ruletaConfig.totalRounds}`;
  }

  function updateStats() {
    document.getElementById('stat-score').textContent = score;
    document.getElementById('stat-streak').textContent = streak;
  }

  function setFeedback(message, type) {
    const feedback = document.getElementById('ruleta-feedback');
    feedback.textContent = message;
    feedback.classList.remove('success', 'error');
    if (type) feedback.classList.add(type);
  }

  async function showFinalScreen() {
    // Detener música de fondo
    if (bgMusic) {
      bgMusic.pause();
    }
    
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
      completionData = await reportGameCompletion(score, 0);
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
          const result = await reportGameCompletion(score, 0);
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
              Rondas completadas: <span style="color: #ff9800;">${ruletaConfig.totalRounds}</span>
            </p>
            <p class="complete-time" style="font-size: 16px;">
              <i class="bx bx-trending-up" style="color: #ff9800;"></i>
              Mejor racha: <span style="color: #ff9800;">${streak}</span>
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
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

