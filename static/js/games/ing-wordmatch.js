const WORDMATCH_MUSIC_PATH = '/static/assets/english/ingmusic.mp3';
const WORDMATCH_SUCCESS_SOUND = '/static/assets/math/acierto.mp3';
const WORDMATCH_ERROR_SOUND = '/static/assets/math/error.mp3';

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

const wordEmojis = {
  // Animals
  'CAT': '🐱',
  'DOG': '🐶',
  'BIRD': '🐦',
  'FISH': '🐟',
  'LION': '🦁',
  'TIGER': '🐯',
  'ELEPHANT': '🐘',
  'HORSE': '🐴',
  'COW': '🐄',
  'PIG': '🐷',
  // Objects
  'BOOK': '📚',
  'CHAIR': '🪑',
  'TABLE': '🪑',
  'PEN': '✏️',
  'PHONE': '📱',
  'CAR': '🚗',
  'BALL': '⚽',
  'TOY': '🧸',
  'LAMP': '💡',
  'CLOCK': '🕐',
  // Professions
  'TEACHER': '👨‍🏫',
  'DOCTOR': '👨‍⚕️',
  'NURSE': '👩‍⚕️',
  'COOK': '👨‍🍳',
  'POLICE': '👮',
  'FIREFIGHTER': '👨‍🚒',
  'PILOT': '✈️',
  'ARTIST': '🎨',
  'MUSICIAN': '🎵',
  'ENGINEER': '👷',
  // Animals (additional)
  'RABBIT': '🐰',
  'DUCK': '🦆',
  // Objects (additional)
  'DOOR': '🚪',
  'WINDOW': '🪟',
  // Professions (additional)
  'FARMER': '👨‍🌾',
  'DRIVER': '🚗',
  // Nature (additional)
  'GRASS': '🌱',
  'ROCK': '🪨',
  // Nature
  'SUN': '☀️',
  'MOON': '🌙',
  'STAR': '⭐',
  'TREE': '🌳',
  'FLOWER': '🌸',
  'WATER': '💧',
  'CLOUD': '☁️',
  'RAIN': '🌧️',
  'WIND': '💨',
  'LEAF': '🍃',
  // Mixed
  'HOUSE': '🏠',
  'APPLE': '🍎',
  'HEART': '❤️',
  'SMILE': '😊',
  'SCHOOL': '🏫',
  'FRIEND': '👫',
  'MUSIC': '🎵',
  'COLOR': '🎨',
  'DANCE': '💃',
  'LEARN': '📖',
  // Mixed (additional)
  'GAME': '🎮',
  'PARTY': '🎉'
};

const wordCategories = {
  animals: [
    { english: 'CAT', spanish: 'gato' },
    { english: 'DOG', spanish: 'perro' },
    { english: 'BIRD', spanish: 'pájaro' },
    { english: 'FISH', spanish: 'pez' },
    { english: 'LION', spanish: 'león' },
    { english: 'TIGER', spanish: 'tigre' },
    { english: 'ELEPHANT', spanish: 'elefante' },
    { english: 'HORSE', spanish: 'caballo' },
    { english: 'COW', spanish: 'vaca' },
    { english: 'PIG', spanish: 'cerdo' },
    { english: 'RABBIT', spanish: 'conejo' },
    { english: 'DUCK', spanish: 'pato' }
  ],
  objects: [
    { english: 'BOOK', spanish: 'libro' },
    { english: 'CHAIR', spanish: 'silla' },
    { english: 'TABLE', spanish: 'mesa' },
    { english: 'PEN', spanish: 'bolígrafo' },
    { english: 'PHONE', spanish: 'teléfono' },
    { english: 'CAR', spanish: 'carro' },
    { english: 'BALL', spanish: 'pelota' },
    { english: 'TOY', spanish: 'juguete' },
    { english: 'LAMP', spanish: 'lámpara' },
    { english: 'CLOCK', spanish: 'reloj' },
    { english: 'DOOR', spanish: 'puerta' },
    { english: 'WINDOW', spanish: 'ventana' }
  ],
  professions: [
    { english: 'TEACHER', spanish: 'maestro' },
    { english: 'DOCTOR', spanish: 'doctor' },
    { english: 'NURSE', spanish: 'enfermera' },
    { english: 'COOK', spanish: 'cocinero' },
    { english: 'POLICE', spanish: 'policía' },
    { english: 'FIREFIGHTER', spanish: 'bombero' },
    { english: 'PILOT', spanish: 'piloto' },
    { english: 'ARTIST', spanish: 'artista' },
    { english: 'MUSICIAN', spanish: 'músico' },
    { english: 'ENGINEER', spanish: 'ingeniero' },
    { english: 'FARMER', spanish: 'granjero' },
    { english: 'DRIVER', spanish: 'conductor' }
  ],
  nature: [
    { english: 'SUN', spanish: 'sol' },
    { english: 'MOON', spanish: 'luna' },
    { english: 'STAR', spanish: 'estrella' },
    { english: 'TREE', spanish: 'árbol' },
    { english: 'FLOWER', spanish: 'flor' },
    { english: 'WATER', spanish: 'agua' },
    { english: 'CLOUD', spanish: 'nube' },
    { english: 'RAIN', spanish: 'lluvia' },
    { english: 'WIND', spanish: 'viento' },
    { english: 'LEAF', spanish: 'hoja' },
    { english: 'GRASS', spanish: 'césped' },
    { english: 'ROCK', spanish: 'roca' }
  ],
  mixed: [
    { english: 'HOUSE', spanish: 'casa' },
    { english: 'APPLE', spanish: 'manzana' },
    { english: 'HEART', spanish: 'corazón' },
    { english: 'SMILE', spanish: 'sonrisa' },
    { english: 'SCHOOL', spanish: 'escuela' },
    { english: 'FRIEND', spanish: 'amigo' },
    { english: 'MUSIC', spanish: 'música' },
    { english: 'COLOR', spanish: 'color' },
    { english: 'DANCE', spanish: 'bailar' },
    { english: 'LEARN', spanish: 'aprender' },
    { english: 'GAME', spanish: 'juego' },
    { english: 'PARTY', spanish: 'fiesta' }
  ]
};

const levelOrder = ['animals', 'objects', 'professions', 'nature', 'mixed'];
const levelNames = {
  animals: 'Animales',
  objects: 'Objetos',
  professions: 'Profesiones',
  nature: 'Naturaleza',
  mixed: 'Mixto'
};

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentLevelIndex = 0;
  let currentLevel = null;
  let gameCards = [];
  let selectedCards = [];
  let matchedPairs = 0;
  let attempts = 0;
  let score = 0;
  let startTime = null;
  let timerInterval = null;
  let elapsedTime = 0;
  let totalElapsedTime = 0;
  let bgMusic = null;
  let successSound = null;
  let errorSound = null;
  let audioReady = false;
  let isMuted = false;
  let currentVolume = 0.5;
  let isLocked = false;
  let totalMatchedPairs = 0;
  let totalAttempts = 0;

  renderLayout();
  startFirstLevel();

  function renderLayout() {
    container.innerHTML = `
      <div class="wordmatch-header">
        <div>
          <p class="round-progress" id="game-status">Selecciona un nivel</p>
          <h2>Word Match</h2>
        </div>
        <div class="wordmatch-stats">
          <div class="stat-pill">
            <span>Puntuación</span>
            <strong id="wordmatch-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>Intentos</span>
            <strong id="wordmatch-attempts">0</strong>
          </div>
          <div class="stat-pill">
            <span>Tiempo</span>
            <strong id="wordmatch-time">00:00</strong>
          </div>
          <div class="volume-control">
            <button class="volume-toggle" id="volume-toggle" title="Silenciar/activar sonido">
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
      <div class="wordmatch-body">
        <div class="cards-container" id="cards-container"></div>
        <div class="feedback-message hidden" id="feedback-message"></div>
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
  }

  function startFirstLevel() {
    currentLevelIndex = 0;
    currentLevel = levelOrder[0];
    startGame();
  }

  function startGame() {
    matchedPairs = 0;
    attempts = 0;
    elapsedTime = 0;
    selectedCards = [];
    isLocked = false;
    startTime = Date.now();

    const selectedPairs = shuffleArray([...wordCategories[currentLevel]]).slice(0, 12);
    
    // Create cards array with both English and Spanish (all visible)
    gameCards = [];
    selectedPairs.forEach(pair => {
      gameCards.push({ type: 'english', content: pair.english, pairId: pair.english, emoji: wordEmojis[pair.english] || '❓' });
      gameCards.push({ type: 'spanish', content: pair.spanish, pairId: pair.english });
    });
    gameCards = shuffleArray(gameCards);

    renderCards();
    startTimer();
    updateStats();
  }

  function renderCards() {
    const container = document.getElementById('cards-container');
    container.className = 'cards-container grid-layout';
    container.innerHTML = '';

    // Shuffle all cards together (English and Spanish mixed)
    const shuffledCards = shuffleArray([...gameCards]);

    shuffledCards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = `match-card ${card.type}-card`;
      cardEl.dataset.index = index;
      cardEl.dataset.type = card.type;
      cardEl.dataset.pairId = card.pairId;
      
      if (card.type === 'english') {
        // Add emoji and text for English cards
        const emoji = document.createElement('span');
        emoji.textContent = card.emoji || '❓';
        emoji.style.cssText = 'font-size: 2rem; margin-bottom: 0.3rem; display: block; line-height: 1;';
        cardEl.appendChild(emoji);
        
        const text = document.createElement('span');
        text.textContent = card.content;
        text.style.cssText = 'font-size: 0.85rem; font-weight: 600;';
        cardEl.appendChild(text);
      } else {
        // Just text for Spanish cards
        cardEl.textContent = card.content;
      }
      
      cardEl.addEventListener('click', () => handleCardClick(cardEl, card));
      container.appendChild(cardEl);
    });

    document.getElementById('game-status').textContent = 
      `Nivel ${currentLevelIndex + 1}/5: ${levelNames[currentLevel]} - Empareja las palabras con sus traducciones`;
  }

  function handleCardClick(cardEl, cardData) {
    if (isLocked) return;
    if (cardEl.classList.contains('matched') || cardEl.classList.contains('selected')) return;

    // Select card
    cardEl.classList.add('selected');
    selectedCards.push({ element: cardEl, data: cardData });

    if (selectedCards.length === 2) {
      isLocked = true;
      attempts++;
      updateStats();
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = selectedCards;
    const isMatch = card1.data.pairId === card2.data.pairId && 
                    card1.data.type !== card2.data.type;

    if (isMatch) {
      playFeedbackSound(true);
      card1.element.classList.remove('selected');
      card1.element.classList.add('matched');
      card2.element.classList.remove('selected');
      card2.element.classList.add('matched');
      matchedPairs++;
      score += 50;
      updateStats();

      const feedback = document.getElementById('feedback-message');
      feedback.classList.remove('hidden');
      feedback.classList.add('success');
      feedback.classList.remove('error');
      feedback.textContent = `✓ ¡Pareja encontrada! "${card1.data.content}" = "${card2.data.content}"`;

      selectedCards = [];
      isLocked = false;

      if (matchedPairs === 12) {
        totalMatchedPairs += matchedPairs;
        setTimeout(() => {
          stopTimer();
          if (currentLevelIndex < levelOrder.length - 1) {
            showLevelComplete();
          } else {
            showFinalScreen();
          }
        }, 1000);
      }
    } else {
      playFeedbackSound(false);
      card1.element.classList.add('mismatch');
      card2.element.classList.add('mismatch');

      const feedback = document.getElementById('feedback-message');
      feedback.classList.remove('hidden');
      feedback.classList.add('error');
      feedback.classList.remove('success');
      feedback.textContent = '✗ No es una pareja correcta. Intenta de nuevo.';

      setTimeout(() => {
        card1.element.classList.remove('selected', 'mismatch');
        card2.element.classList.remove('selected', 'mismatch');
        selectedCards = [];
        isLocked = false;
        feedback.classList.add('hidden');
      }, 1500);
    }
  }

  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      document.getElementById('wordmatch-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateStats() {
    document.getElementById('wordmatch-score').textContent = score;
    document.getElementById('wordmatch-attempts').textContent = attempts;
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
    bgMusic = new Audio(WORDMATCH_MUSIC_PATH);
    bgMusic.loop = true;
    successSound = new Audio(WORDMATCH_SUCCESS_SOUND);
    errorSound = new Audio(WORDMATCH_ERROR_SOUND);
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

  function showLevelComplete() {
    totalElapsedTime += elapsedTime;
    totalMatchedPairs += matchedPairs;
    totalAttempts += attempts;
    
    const feedback = document.getElementById('feedback-message');
    feedback.classList.remove('hidden');
    feedback.classList.add('success');
    feedback.classList.remove('error');
    feedback.textContent = `✓ ¡Nivel completado! Pasando al siguiente nivel...`;

    setTimeout(() => {
      currentLevelIndex++;
      currentLevel = levelOrder[currentLevelIndex];
      startGame();
    }, 2000);
  }

  async function showFinalScreen() {
    stopTimer();
    if (bgMusic) bgMusic.pause();
    
    totalElapsedTime += elapsedTime;
    totalMatchedPairs += matchedPairs;
    totalAttempts += attempts;
    
    const totalMinutes = Math.floor(totalElapsedTime / 60);
    const totalSeconds = totalElapsedTime % 60;
    const timeString = `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    
    // Calculate bonus points based on attempts and time
    const maxPairs = 60; // 12 pairs per level * 5 levels
    const perfectAttempts = maxPairs;
    const attemptBonus = Math.max(0, (perfectAttempts - totalAttempts) * 5);
    const timeBonus = Math.max(0, Math.floor((1800 - totalElapsedTime) / 10));
    const finalScore = score + attemptBonus + timeBonus;
    
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
      completionData = await reportGameCompletion(finalScore, totalElapsedTime);
      progressSaved = true;
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error);
      progressSaved = false;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const backUrl = window.gameConfig?.backUrl || '/ingles/';
    const isAuthenticated = true;
    const savedScore = completionData?.best_score || finalScore;
    const minScoreRequired = 10;
    const canAdvance = savedScore >= minScoreRequired;
    
    const handleBackButton = async (e) => {
      e.preventDefault();
      if (!progressSaved && isAuthenticated) {
        const saveButton = e.target.closest('.back-button');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="bx bx-loader-alt" style="animation: rotate 1s linear infinite;"></i> Guardando...';
        saveButton.disabled = true;
        try {
          const result = await reportGameCompletion(finalScore, totalElapsedTime);
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
              Puntuación: <span style="color: #9c27b0;">${savedScore}</span> puntos
            </p>
            <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
              <i class="bx bx-check-circle" style="color: #9c27b0;"></i>
              Parejas encontradas: <span style="color: #9c27b0;">${totalMatchedPairs + matchedPairs}/60</span>
            </p>
            <p class="complete-time" style="font-size: 16px;">
              <i class="bx bx-time-five" style="color: #9c27b0;"></i>
              Tiempo total: <span style="color: #9c27b0;">${timeString}</span>
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

