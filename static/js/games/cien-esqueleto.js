const TOTAL_TIME_SECONDS = 170; // 2:50 min

const bonesData = [
  { id: 'craneo', label: 'Cráneo', x: 50, y: 6 },
  { id: 'mandibula', label: 'Mandíbula', x: 50, y: 12 },
  { id: 'clavicula', label: 'Clavícula', x: 58, y: 18 },
  { id: 'omoplato', label: 'Omóplato', x: 40, y: 24 },
  { id: 'esternon', label: 'Esternón', x: 50, y: 28 },
  { id: 'costillas', label: 'Costillas', x: 56, y: 34 },
  { id: 'columna', label: 'Columna', x: 50, y: 40 },
  { id: 'humero', label: 'Húmero', x: 32, y: 30 },
  { id: 'radio', label: 'Radio', x: 28, y: 46 },
  { id: 'cubito', label: 'Cúbito', x: 26, y: 52 },
  { id: 'pelvis', label: 'Pelvis', x: 50, y: 55 },
  { id: 'femur', label: 'Fémur', x: 50, y: 70 },
  { id: 'rotula', label: 'Rótula', x: 50, y: 78 },
  { id: 'tibia', label: 'Tibia', x: 50, y: 85 },
  { id: 'perone', label: 'Peroné', x: 44, y: 83 }
];

// Estado del juego
let gameState = {
  score: 0,
  remainingTime: TOTAL_TIME_SECONDS,
  countdownInterval: null,
  backgroundMusic: null,
  victorySound: null,
  musicVolume: 0.5,
  gameCompleted: false,
  draggedBoneId: null
};

function initGame() {
  // Esperar un momento para asegurar que gameConfig esté disponible
  if (!window.gameConfig) {
    console.warn('gameConfig no disponible aún, esperando...');
    setTimeout(initGame, 100);
    return;
  }
  console.log('Inicializando juego de esqueleto con config:', window.gameConfig);
  renderLayout();
}

function startGameSession() {
  const callout = document.querySelector('.memorize-callout');
  if (callout) callout.style.display = 'none';
  
  const overlay = document.getElementById('skeleton-overlay');
  if (overlay) overlay.classList.add('hidden');
  
  const bonesList = document.getElementById('bones-list');
  if (bonesList) {
    bonesList.classList.remove('disabled');
    bonesList.classList.remove('blurred');
  }
  
  gameState.score = 0;
  gameState.remainingTime = TOTAL_TIME_SECONDS;
  gameState.gameCompleted = false;
  updateScore();
  updateBombTimer();
  startCountdown();
}

function renderLayout() {
  const container = document.getElementById('game-container');
  if (!container) return;

  container.innerHTML = `
    <div class="game-wrapper">
      <div class="game-header">
        <div class="header-top">
          <h2 class="game-title">
            <i class="bx bx-body"></i>
            Esqueleto Humano
          </h2>
          <div class="header-actions">
            <button class="fullscreen-icon" id="fullscreen-btn" title="Pantalla completa">
              <i class="fas fa-expand" id="fullscreen-icon-inner"></i>
            </button>
            <div class="music-control" id="music-control" title="Control de música">
              <i class="bx bx-volume-full" id="music-icon"></i>
              <input type="range" id="volume-slider" min="0" max="100" value="${gameState.musicVolume * 100}" class="volume-slider" />
            </div>
          </div>
        </div>
        <div class="game-info">
          <div class="level-display" id="level-display">
            <i class="bx bx-target-lock"></i>
            Coloca los 15 huesos
          </div>
          <div class="score-display">
            <i class="bx bx-star"></i>
            Puntos: <strong id="score-value">0</strong>
          </div>
          <div class="bomb-display" id="bomb-display">
            <i class="bx bx-bomb"></i>
            <span id="bomb-timer">02:50</span>
          </div>
        </div>
      </div>

      <div class="game-layout">
        <div class="bones-panel">
          <h3>Memoriza las partes</h3>
          <div class="memorize-callout">
            <p style="margin-bottom:0.5rem;">Observa la imagen y memoriza los nombres. Cuando estés listo, presiona el botón.</p>
            <img src="/static/assets/ciencias/nombres.png" alt="Nombres del esqueleto">
            <button class="story-button" id="btn-start-esqueleto">
              <i class="bx bx-play-circle"></i> ¡Listo!
            </button>
          </div>
          <h3 style="margin-top:1.2rem;">Arrastra las etiquetas</h3>
          <div class="bones-list blurred" id="bones-list"></div>
          <div class="bomb-warning" id="bomb-warning">
            <i class="bx bx-bullseye"></i> Si el tiempo llega a cero, la bomba reiniciará el juego.
          </div>
        </div>
        <div class="skeleton-panel">
          <div class="skeleton-stage" id="skeleton-stage">
            <img src="/static/assets/ciencias/esqueleto.png" alt="Esqueleto humano">
          </div>
          <div class="skeleton-overlay" id="skeleton-overlay">
            <p>Primero memoriza los nombres. Presiona "¡Listo!" para mostrar el esqueleto.</p>
          </div>
        </div>
      </div>

      <div class="feedback-message info" id="feedback-message"></div>
    </div>
  `;

  renderBoneList();
  renderDropMarkers();
  setupDragAndDrop();
  setupMemorizeButton();
  setupFullscreenButton();
  setupVolumeControl();
  initAudio();
  updateScore();
  updateBombTimer();
}

function setupMemorizeButton() {
  const startButton = document.getElementById('btn-start-esqueleto');
  if (!startButton) return;
  startButton.addEventListener('click', () => {
    startButton.disabled = true;
    startGameSession();
  });
}

function renderBoneList() {
  const list = document.getElementById('bones-list');
  if (!list) return;
  const shuffled = shuffleArray([...bonesData]);
  list.innerHTML = shuffled.map(bone => `
    <div class="bone-item" draggable="true" data-bone="${bone.id}">
      ${bone.label}
    </div>
  `).join('');
}

function renderDropMarkers() {
  const stage = document.getElementById('skeleton-stage');
  if (!stage) return;
  bonesData.forEach(bone => {
    const marker = document.createElement('div');
    marker.className = 'drop-marker';
    marker.style.left = `${bone.x}%`;
    marker.style.top = `${bone.y}%`;
    marker.dataset.bone = bone.id;
    marker.textContent = '?';
    marker.addEventListener('dragover', handleDragOver);
    marker.addEventListener('drop', handleDrop);
    stage.appendChild(marker);
  });
}

function setupDragAndDrop() {
  const items = document.querySelectorAll('.bone-item');
  items.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
}

function handleDragStart(e) {
  if (gameState.gameCompleted) return;
  gameState.draggedBoneId = e.target.dataset.bone;
  e.dataTransfer.setData('text/plain', gameState.draggedBoneId);
  e.target.classList.add('dragging');
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  if (!gameState.draggedBoneId || gameState.gameCompleted) return;
  
  const targetBone = e.currentTarget.dataset.bone;
  const draggedElement = document.querySelector(`.bone-item[data-bone="${gameState.draggedBoneId}"]`);
  if (!draggedElement) return;

  const feedback = document.getElementById('feedback-message');

  if (targetBone === gameState.draggedBoneId && !e.currentTarget.classList.contains('filled')) {
    const marker = e.currentTarget;
    marker.classList.add('filled');
    marker.textContent = '?';
    
    const label = document.createElement('span');
    label.className = 'placed-label';
    label.textContent = getBoneLabel(gameState.draggedBoneId);
    
    // Asignar posición de etiqueta según el hueso
    const labelPositions = {
      'costillas': 'label-right',
      'columna': 'label-left',
      'craneo': 'label-left',
      'mandibula': 'label-right',
      'radio': 'label-left',
      'cubito': 'label-right',
      'femur': 'label-left',
      'rotula': 'label-right',
      'tibia': 'label-left',
      'perone': 'label-right',
      'humero': 'label-left',
      'esternon': 'label-right',
      'clavicula': 'label-left',
      'omoplato': 'label-right'
    };
    
    if (labelPositions[targetBone]) {
      label.classList.add(labelPositions[targetBone]);
    }
    
    marker.appendChild(label);
    draggedElement.remove();
    gameState.score++;
    updateScore();
    
    // Verificar si se completó el juego
    if (gameState.score === bonesData.length) {
      handleGameComplete();
    } else {
      if (feedback) {
        feedback.className = 'feedback-message success';
        feedback.innerHTML = '<i class="bx bx-check-circle"></i> ¡Correcto!';
      }
    }
  } else {
    if (feedback && !gameState.gameCompleted) {
      feedback.className = 'feedback-message error';
      feedback.innerHTML = '<i class="bx bx-x-circle"></i> Ese hueso no va en ese punto.';
    }
  }
  
  gameState.draggedBoneId = null;
}

function handleGameComplete() {
  // Detener el tiempo inmediatamente
  stopCountdown();
  gameState.gameCompleted = true;
  
  // Mostrar botón de finalizar
  const feedback = document.getElementById('feedback-message');
  if (feedback) {
    feedback.className = 'feedback-message success';
    feedback.style.display = 'block';
    feedback.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 0.5rem;">
        <div style="font-size: 1.1rem;">
          <i class="bx bx-check-circle"></i> ¡Completaste todos los huesos!
        </div>
        <button id="btn-finalizar" class="finish-button">
          <i class="bx bx-check"></i> Finalizar
        </button>
      </div>
    `;
    
    // Agregar evento al botón
    const finishBtn = document.getElementById('btn-finalizar');
    if (finishBtn) {
      finishBtn.addEventListener('click', function() {
        completeGame(true);
      });
    }
  }
}

function getBoneLabel(id) {
  const bone = bonesData.find(b => b.id === id);
  return bone ? bone.label : '';
}

function startCountdown() {
  if (gameState.countdownInterval) {
    clearInterval(gameState.countdownInterval);
  }
  updateBombTimer();
  const bombDisplay = document.querySelector('.bomb-display');
  if (bombDisplay) {
    bombDisplay.classList.add('pulse');
  }
  gameState.countdownInterval = setInterval(() => {
    if (gameState.gameCompleted) {
      stopCountdown();
      return;
    }
    gameState.remainingTime--;
    if (gameState.remainingTime <= 0) {
      gameState.remainingTime = 0;
      stopCountdown();
      triggerBomb();
    } else {
      updateBombTimer();
    }
  }, 1000);
}

function stopCountdown() {
  if (gameState.countdownInterval) {
    clearInterval(gameState.countdownInterval);
    gameState.countdownInterval = null;
  }
  const bombDisplay = document.querySelector('.bomb-display');
  if (bombDisplay) {
    bombDisplay.classList.remove('pulse');
  }
}

function updateBombTimer() {
  const bombTimer = document.getElementById('bomb-timer');
  const bombWarning = document.getElementById('bomb-warning');
  if (bombTimer) {
    const minutes = Math.floor(gameState.remainingTime / 60);
    const seconds = gameState.remainingTime % 60;
    bombTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (gameState.remainingTime <= 20 && bombWarning) {
      bombWarning.classList.add('exploding');
    }
  }
}

function updateScore() {
  const scoreValue = document.getElementById('score-value');
  if (scoreValue) {
    scoreValue.textContent = gameState.score;
  }
}

function triggerBomb() {
  const panel = document.querySelector('.game-wrapper');
  if (!panel) return;
  const overlay = document.createElement('div');
  overlay.className = 'bomb-overlay';
  overlay.innerHTML = `
    <i class="bx bx-bomb"></i>
    <p>¡La bomba explotó!</p>
    <p>El juego se reiniciará...</p>
  `;
  panel.appendChild(overlay);
  setTimeout(() => {
    restartGame();
  }, 2000);
}

function completeGame(won) {
  stopCountdown();
  if (gameState.backgroundMusic) gameState.backgroundMusic.pause();
  if (gameState.victorySound && won) {
    gameState.victorySound.currentTime = 0;
    gameState.victorySound.play().catch(() => {});
  }

  const container = document.getElementById('game-container');
  if (!container) return;

  const elapsed = Math.max(0, TOTAL_TIME_SECONDS - gameState.remainingTime);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const backUrl = window.gameConfig?.backUrl || '../ciencia.html';
  const accuracy = Math.round((gameState.score / bonesData.length) * 100);

  container.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx ${won ? 'bx-trophy' : 'bx-x-circle'}" style="font-size: 40px; color: ${won ? '#ffd700' : '#ff6b6b'};"></i>
        </div>
        <h2 class="complete-title title-animation">${won ? '¡Felicidades!' : 'Game Over'}</h2>
        <p class="complete-message message-animation">${won ? 'Identificaste correctamente todas las partes del esqueleto.' : 'El tiempo terminó antes de completar el reto.'}</p>
        <div style="background: rgba(180, 255, 26, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(180, 255, 26, 0.3);" class="stats-animation">
          <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación: <span style="color: #b4ff1a;">${gameState.score}</span>/${bonesData.length} puntos
          </p>
          <p class="complete-time" style="font-size: 16px;">
            <i class="bx bx-time-five" style="color: #b4ff1a;"></i>
            Tiempo: <span style="color: #b4ff1a;">${timeString}</span>
          </p>
          <p style="font-size: 14px; margin-top: 0.4rem;">
            Precisión: <span style="color: #b4ff1a;">${accuracy}%</span>
          </p>
        </div>
        ${!won ? `<p style="color: #ff6b6b; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(255, 107, 107, 0.1); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);" class="message-animation"><i class="bx bx-info-circle"></i> Necesitas completar todos los huesos para ganar. ¡Sigue intentando!</p>` : ''}
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Volver a Jugar
          </button>
          ${won ? `<a href="${backUrl}" class="restart-button back-button" style="flex: 1; cursor: pointer;">
            <i class="bx bx-arrow-back"></i>
            Volver al menú
          </a>` : `<button class="restart-button back-button" disabled style="flex: 1;">
            <i class="bx bx-lock"></i>
            Bloqueado
          </button>`}
        </div>
      </div>
    </div>
  `;
}

function restartGame() {
  stopCountdown();
  if (gameState.backgroundMusic) {
    gameState.backgroundMusic.pause();
    gameState.backgroundMusic = null;
  }
  gameState.score = 0;
  gameState.remainingTime = TOTAL_TIME_SECONDS;
  gameState.gameCompleted = false;
  gameState.draggedBoneId = null;
  renderLayout();
}

function initAudio() {
  if (gameState.backgroundMusic) {
    gameState.backgroundMusic.pause();
  }
  const musicUrl = window.gameConfig?.musicUrl || '/static/assets/ciencias/ciensmusic.mp3';
  gameState.backgroundMusic = new Audio(musicUrl);
  gameState.backgroundMusic.loop = true;
  gameState.backgroundMusic.volume = gameState.musicVolume;
  gameState.backgroundMusic.play().catch(() => {});

  gameState.victorySound = new Audio('/static/assets/exam.mp3');
  gameState.victorySound.volume = 0.7;
}

function setupVolumeControl() {
  const slider = document.getElementById('volume-slider');
  const icon = document.getElementById('music-icon');
  if (!slider || !icon) return;

  slider.addEventListener('input', e => {
    gameState.musicVolume = e.target.value / 100;
    if (gameState.backgroundMusic) gameState.backgroundMusic.volume = gameState.musicVolume;
    updateMusicIcon(icon, gameState.musicVolume);
  });

  icon.addEventListener('click', () => {
    if (!gameState.backgroundMusic) return;
    if (gameState.backgroundMusic.paused) {
      gameState.backgroundMusic.play().catch(() => {});
      slider.value = gameState.musicVolume * 100;
      updateMusicIcon(icon, gameState.musicVolume);
    } else {
      gameState.backgroundMusic.pause();
      slider.value = 0;
      updateMusicIcon(icon, 0);
    }
  });
}

function updateMusicIcon(icon, volume) {
  if (volume === 0) icon.className = 'bx bx-volume-mute';
  else if (volume < 0.5) icon.className = 'bx bx-volume-low';
  else icon.className = 'bx bx-volume-full';
}

function setupFullscreenButton() {
  const btn = document.getElementById('fullscreen-btn');
  const icon = document.getElementById('fullscreen-icon-inner');
  const wrapper = document.querySelector('.game-wrapper');
  if (!btn || !icon || !wrapper) return;

  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) icon.className = 'fas fa-compress';
    else icon.className = 'fas fa-expand';
  });
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Inicialización
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
