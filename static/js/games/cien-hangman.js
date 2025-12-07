// Configuración del juego de ahorcado de ciencias
const scienceWords = [
  {
    word: "PLANETA",
    category: "Astronomía",
    hint: "Cuerpo celeste que gira alrededor del Sol.",
    description: "Los planetas son cuerpos grandes que no producen luz propia y siguen órbitas alrededor de una estrella."
  },
  {
    word: "ECOSISTEMA",
    category: "Ciencias Naturales",
    hint: "Conjunto de seres vivos y el lugar donde viven.",
    description: "En un ecosistema, plantas, animales, agua, aire y suelo interactúan para mantener el equilibrio de la vida."
  },
  {
    word: "FOTOSINTESIS",
    category: "Biología",
    hint: "Proceso con el que las plantas producen su alimento.",
    description: "La fotosíntesis usa luz, dióxido de carbono y agua para crear alimento y oxígeno."
  },
  {
    word: "IMAN",
    category: "Física",
    hint: "Atrae materiales como el hierro sin tocarlos.",
    description: "Un imán tiene polos norte y sur; las fuerzas magnéticas pueden atraer o repeler objetos metálicos."
  },
  {
    word: "ATOMO",
    category: "Química",
    hint: "Partícula más pequeña de la materia.",
    description: "El átomo está formado por protones, neutrones y electrones; todo lo que conocemos está hecho de átomos."
  },
  {
    word: "METEOROLOGO",
    category: "Clima",
    hint: "Persona que estudia y pronostica el clima.",
    description: "Los meteorólogos observan las nubes, el viento y la presión atmosférica para predecir el estado del tiempo."
  },
  {
    word: "CICLODELAGUA",
    category: "Ciencias Naturales",
    hint: "Proceso continuo de evaporación, condensación y lluvia.",
    description: "El agua cambia de estado y viaja del suelo al aire y regresa en forma de lluvia para mantener la vida."
  },
  {
    word: "ESQUELETO",
    category: "Biología",
    hint: "Conjunto de huesos que sostienen el cuerpo.",
    description: "El esqueleto protege órganos como el corazón y permite el movimiento junto con los músculos."
  },
  {
    word: "ENERGIASOLAR",
    category: "Energía",
    hint: "Se obtiene a partir de la luz del sol.",
    description: "La energía solar puede transformarse en electricidad o calor y es una fuente limpia e inagotable."
  },
  {
    word: "MICROSCOPIO",
    category: "Laboratorio",
    hint: "Herramienta para observar objetos muy pequeños.",
    description: "Con un microscopio podemos ver células, microbios y detalles invisibles a simple vista."
  }
];

const LETTERS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const MAX_LIVES = 6;
const TOTAL_ROUNDS = Math.min(8, scienceWords.length);

let shuffledWords = [];
let currentRound = 0;
let currentWordData = null;
let revealedLetters = [];
let wrongLetters = [];
let remainingLives = MAX_LIVES;
let hintUsedThisRound = false;
let score = 0;
let wordsSolved = 0;
let wordsFailed = 0;
let hintsUsed = 0;
let scienceGameInitialized = false;

let backgroundMusic = null;
let victorySound = null;
let musicVolume = 0.5;

let startTime = null;
let timeElapsed = 0;
let timerInterval = null;

function initGame() {
  if (scienceGameInitialized) return;
  scienceGameInitialized = true;
  createGameInterface();
  startGame();
}

function createGameInterface() {
  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;

  gameContainer.innerHTML = `
    <div class="game-wrapper science-theme">
      <div class="floating-molecules">
        <span class="molecule m1"></span>
        <span class="molecule m2"></span>
        <span class="molecule m3"></span>
        <span class="molecule m4"></span>
      </div>
      <div class="game-header">
        <div class="header-top">
          <h2 class="game-title">
            <i class="bx bx-flask"></i>
            Ahorcado de Ciencias
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
            Palabra 1 de ${TOTAL_ROUNDS}
          </div>
          <div class="info-row">
            <div class="score-display">
              <i class="bx bx-star"></i>
              Puntos: <strong id="score-value">0</strong>
            </div>
            <div class="timer-display">
              <i class="bx bx-time-five"></i>
              Tiempo: <strong id="timer">00:00</strong>
            </div>
            <div class="lives-display">
              <i class="bx bx-heart"></i>
              Vidas: <strong id="lives-amount">${MAX_LIVES}</strong>
            </div>
          </div>
        </div>
        <p class="game-instruction" id="game-instruction">
          <i class="bx bx-info-circle"></i>
          Adivina la palabra científica antes de agotar tus intentos. Usa la pista con cuidado, ¡cuesta una vida!
        </p>
        <div class="status-message" id="status-message"></div>
      </div>

      <div class="game-grid">
        <div class="hangman-panel">
          <div class="hangman-visual" id="hangman-visual">
            <div class="hangman-structure">
              <span class="hangman-part part-base"></span>
              <span class="hangman-part part-post"></span>
              <span class="hangman-part part-beam"></span>
              <span class="hangman-part part-rope"></span>
              <span class="hangman-part part-head"></span>
              <span class="hangman-part part-body"></span>
              <span class="hangman-part part-arm-left"></span>
              <span class="hangman-part part-arm-right"></span>
              <span class="hangman-part part-leg-left"></span>
              <span class="hangman-part part-leg-right"></span>
            </div>
          </div>
          <div class="lives-track" id="lives-track"></div>
          <p class="wrong-letters">
            Errores: <span id="wrong-letters">Ninguno</span>
          </p>
        </div>

        <div class="word-panel">
          <div class="category-badge" id="category-badge">Categoría</div>
          <div class="hint-box">
            <h4><i class="bx bx-book"></i> Descripción científica</h4>
            <p id="hint-text"></p>
          </div>
          <div class="word-display" id="word-display"></div>
          <div class="panel-buttons">
            <button class="hint-button" id="btn-hint">
              <i class="bx bx-bulb"></i>
              Usar pista (-1 vida)
            </button>
            <button class="skip-button" id="btn-skip">
              <i class="bx bx-fast-forward"></i>
              Saltar palabra
            </button>
          </div>
          <div class="keyboard" id="keyboard"></div>
        </div>
      </div>
    </div>
  `;

  setupFullscreenButton();
  initAudio();
  setupVolumeControl();

  const hintButton = document.getElementById("btn-hint");
  const skipButton = document.getElementById("btn-skip");
  if (hintButton) {
    hintButton.addEventListener("click", useHint);
  }
  if (skipButton) {
    skipButton.addEventListener("click", skipWord);
  }
}

function startGame() {
  shuffledWords = shuffleArray([...scienceWords]).slice(0, TOTAL_ROUNDS);
  currentRound = 0;
  score = 0;
  wordsSolved = 0;
  wordsFailed = 0;
  hintsUsed = 0;
  timeElapsed = 0;
  startTime = Date.now();

  if (timerInterval) {
    clearInterval(timerInterval);
  }
  startTimer();

  if (backgroundMusic && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }

  loadCurrentWord();
}

function loadCurrentWord() {
  if (currentRound >= TOTAL_ROUNDS) {
    completeGame();
    return;
  }

  currentWordData = shuffledWords[currentRound];
  revealedLetters = currentWordData.word.split("").map(letter => letter === " " ? true : false);
  wrongLetters = [];
  remainingLives = MAX_LIVES;
  hintUsedThisRound = false;

  updateRoundDisplay();
  updateScoreDisplay();
  updateLivesDisplay();
  updateWrongLetters();
  updateCategory();
  updateHint();
  renderWordDisplay();
  renderKeyboard();
  updateStatusMessage("¡Piensa en la palabra científica y comienza a adivinar!", "info");
}

function renderWordDisplay() {
  const wordDisplay = document.getElementById("word-display");
  if (!wordDisplay || !currentWordData) return;

  wordDisplay.innerHTML = "";
  currentWordData.word.split("").forEach((letter, index) => {
    const letterElement = document.createElement("span");
    letterElement.className = "word-letter";

    if (letter === " ") {
      letterElement.classList.add("space");
      letterElement.textContent = "";
    } else if (revealedLetters[index]) {
      letterElement.textContent = letter;
      letterElement.classList.add("revealed");
    } else {
      letterElement.textContent = "_";
    }

    wordDisplay.appendChild(letterElement);
  });
}

function renderKeyboard() {
  const keyboard = document.getElementById("keyboard");
  if (!keyboard) return;
  keyboard.innerHTML = "";

  LETTERS.forEach(letter => {
    const button = document.createElement("button");
    button.className = "key-button";
    button.textContent = letter;
    button.dataset.letter = letter;
    button.addEventListener("click", () => handleLetter(letter, button));
    keyboard.appendChild(button);
  });
}

function handleLetter(letter, button) {
  if (!currentWordData || !button || button.disabled) return;

  button.disabled = true;
  const word = currentWordData.word;
  let found = false;

  word.split("").forEach((char, index) => {
    if (char === letter) {
      revealedLetters[index] = true;
      found = true;
    }
  });

  if (found) {
    button.classList.add("correct");
    playCorrectSound();
    renderWordDisplay();
    updateStatusMessage("¡Bien! Encontraste una letra científica.", "success");
    createParticleEffect(button, "#b4ff1a");

    if (revealedLetters.every(Boolean)) {
      handleWordCompleted();
    }
  } else {
    button.classList.add("incorrect");
    wrongLetters.push(letter);
    remainingLives -= 1;
    playIncorrectSound();
    updateWrongLetters();
    updateLivesDisplay();
    updateStatusMessage("Letra incorrecta, ¡piensa en otra pista científica!", "warning");

    if (remainingLives <= 0) {
      handleWordFailed();
    }
  }
}

function handleWordCompleted() {
  const basePoints = 10;
  const bonus = Math.max(0, remainingLives * 2);
  const hintPenalty = hintUsedThisRound ? 2 : 0;
  score += Math.max(5, basePoints + bonus - hintPenalty);
  wordsSolved += 1;
  updateScoreDisplay();
  updateStatusMessage("¡Excelente! Descubriste la palabra completa.", "success");

  disableKeyboard();

  setTimeout(() => {
    currentRound += 1;
    loadCurrentWord();
  }, 1400);
}

function handleWordFailed() {
  wordsFailed += 1;
  revealFullWord();
  updateStatusMessage(`Se acabaron las vidas. La palabra era ${currentWordData.word}.`, "error");
  disableKeyboard();

  setTimeout(() => {
    currentRound += 1;
    loadCurrentWord();
  }, 1800);
}

function revealFullWord() {
  if (!currentWordData) return;
  revealedLetters = currentWordData.word.split("").map(() => true);
  renderWordDisplay();
}

function disableKeyboard() {
  const keys = document.querySelectorAll(".key-button");
  keys.forEach(key => key.disabled = true);
}

function updateRoundDisplay() {
  const roundDisplay = document.getElementById("round-display");
  if (!roundDisplay) return;
  roundDisplay.innerHTML = `
    <i class="bx bx-target-lock"></i>
    Palabra ${currentRound + 1} de ${TOTAL_ROUNDS}
  `;
}

function updateScoreDisplay() {
  const scoreValue = document.getElementById("score-value");
  if (scoreValue) {
    scoreValue.textContent = score;
  }
}

function updateLivesDisplay() {
  const livesAmount = document.getElementById("lives-amount");
  const livesTrack = document.getElementById("lives-track");
  if (livesAmount) {
    livesAmount.textContent = `${remainingLives}/${MAX_LIVES}`;
  }
  if (livesTrack) {
    livesTrack.innerHTML = "";
    for (let i = 0; i < MAX_LIVES; i++) {
      const life = document.createElement("span");
      life.className = "life-bubble";
      if (i < remainingLives) {
        life.classList.add("active");
      }
      livesTrack.appendChild(life);
    }
  }

  const mistakes = MAX_LIVES - remainingLives;
  const partStates = [
    { selector: ".part-base", threshold: 0, always: true },
    { selector: ".part-post", threshold: 1 },
    { selector: ".part-beam", threshold: 2 },
    { selector: ".part-rope", threshold: 3 },
    { selector: ".part-head", threshold: 4 },
    { selector: ".part-body", threshold: 5 },
    { selector: ".part-arm-left", threshold: 6 },
    { selector: ".part-arm-right", threshold: 6 },
    { selector: ".part-leg-left", threshold: 6 },
    { selector: ".part-leg-right", threshold: 6 }
  ];

  partStates.forEach(({ selector, threshold, always }) => {
    const element = document.querySelector(selector);
    if (!element) return;
    const isActive = always || mistakes >= threshold;
    element.classList.toggle("active", isActive);
  });
}

function updateWrongLetters() {
  const wrongLettersElement = document.getElementById("wrong-letters");
  if (!wrongLettersElement) return;
  wrongLettersElement.textContent = wrongLetters.length ? wrongLetters.join(", ") : "Ninguno";
}

function updateCategory() {
  const badge = document.getElementById("category-badge");
  if (badge && currentWordData) {
    badge.textContent = currentWordData.category;
  }
}

function updateHint() {
  const hintText = document.getElementById("hint-text");
  if (hintText && currentWordData) {
    hintText.textContent = `${currentWordData.hint} ${currentWordData.description}`;
  }
}

function updateStatusMessage(message, type = "info") {
  const status = document.getElementById("status-message");
  if (!status) return;
  status.textContent = message;
  status.className = `status-message ${type}`;
}

function useHint() {
  if (!currentWordData || remainingLives <= 1 || hintUsedThisRound) {
    updateStatusMessage("No puedes usar pista ahora. Necesitas al menos 2 vidas disponibles.", "warning");
    return;
  }

  const hiddenIndexes = revealedLetters
    .map((revealed, index) => (!revealed && currentWordData.word[index] !== " " ? index : null))
    .filter(index => index !== null);

  if (!hiddenIndexes.length) {
    updateStatusMessage("Ya descubriste todas las letras.", "info");
    return;
  }

  const randomIndex = hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
  revealedLetters[randomIndex] = true;
  hintUsedThisRound = true;
  hintsUsed += 1;
  remainingLives -= 1;
  updateLivesDisplay();
  renderWordDisplay();
  updateStatusMessage("Pista revelada. ¡Aprovecha la letra mostrada!", "success");

  if (revealedLetters.every(Boolean)) {
    handleWordCompleted();
  }
}

function skipWord() {
  updateStatusMessage("Palabra saltada. ¡Vamos por la siguiente!", "info");
  wordsFailed += 1;
  disableKeyboard();
  setTimeout(() => {
    currentRound += 1;
    loadCurrentWord();
  }, 800);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const timerElement = document.getElementById("timer");
    if (timerElement) {
      timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

async function completeGame() {
  stopTimer();
  if (backgroundMusic) {
    backgroundMusic.pause();
  }

  if (victorySound) {
    victorySound.currentTime = 0;
    victorySound.play().catch(() => {});
  }

  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;

  createVictoryParticles(gameContainer);

  const completionData = await reportGameCompletion(score, timeElapsed).catch(() => null);
  const backUrl = window.gameConfig?.backUrl || "../ciencia.html";
  const isAuthenticated = window.gameConfig?.isAuthenticated || false;
  const minScoreRequired = 20;
  const speedBonus = timeElapsed <= 90 ? 8 : timeElapsed <= 150 ? 4 : 0;
  const accuracyBonus = wordsFailed === 0 ? 7 : wordsSolved >= TOTAL_ROUNDS - 1 ? 3 : 0;
  const bonusTotal = speedBonus + accuracyBonus;
  const finalScore = score + bonusTotal;
  const canAdvance = finalScore >= minScoreRequired && wordsSolved >= Math.ceil(TOTAL_ROUNDS * 0.6);

  const bestTime = completionData?.best_time_seconds ?? timeElapsed;
  const minutes = Math.floor(bestTime / 60);
  const seconds = bestTime % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  gameContainer.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx bx-trophy" style="font-size: 40px; color: #ffd700;"></i>
        </div>
        <h2 class="complete-title title-animation">¡Felicidades!</h2>
        <p class="complete-message message-animation">Has completado el juego de ahorcado de ciencias</p>
        <div style="background: rgba(180, 255, 26, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(180, 255, 26, 0.3);" class="stats-animation">
          <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación: <span style="color: #b4ff1a;">${score}</span> puntos
          </p>
          <p class="complete-time" style="font-size: 16px;">
            <i class="bx bx-time-five" style="color: #b4ff1a;"></i>
            Tiempo: <span style="color: #b4ff1a;">${timeString}</span>
          </p>
          ${bonusTotal > 0 ? `<p class="complete-bonus" style="margin-top: 0.4rem; font-size: 14px;">Bonus total: +${bonusTotal} puntos</p>` : ''}
        </div>
        ${!canAdvance ? `<p style="color: #ff6b6b; font-size: 14px; margin: 0.75rem 0; font-weight: bold; padding: 0.75rem; background: rgba(255, 107, 107, 0.1); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);" class="message-animation"><i class="bx bx-info-circle"></i> Necesitas al menos ${minScoreRequired} puntos para avanzar. ¡Sigue intentando!</p>` : ''}
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Volver a Jugar
          </button>
          ${canAdvance ? `<a href="${backUrl}" class="restart-button back-button" style="flex: 1; cursor: pointer;">
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

function restartGame() {
  createGameInterface();
  startGame();
}

function initAudio() {
  const musicUrl = window.gameConfig?.musicUrl || "/static/assets/ciencias/ciensmusic.mp3";
  backgroundMusic = new Audio(musicUrl);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;

  victorySound = new Audio("/static/assets/exam.mp3");
  victorySound.volume = 0.7;

  backgroundMusic.play().catch(() => {});
}

function setupVolumeControl() {
  const volumeSlider = document.getElementById("volume-slider");
  const musicIcon = document.getElementById("music-icon");
  if (!volumeSlider || !musicIcon) return;

  volumeSlider.addEventListener("input", (event) => {
    musicVolume = event.target.value / 100;
    if (backgroundMusic) backgroundMusic.volume = musicVolume;
    updateMusicIcon(musicIcon, musicVolume);
  });

  musicIcon.addEventListener("click", () => {
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
    icon.className = "bx bx-volume-mute";
  } else if (volume < 0.5) {
    icon.className = "bx bx-volume-low";
  } else {
    icon.className = "bx bx-volume-full";
  }
}

function setupFullscreenButton() {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const fullscreenIcon = document.getElementById("fullscreen-icon-inner");
  const gameWrapper = document.querySelector(".game-wrapper");
  if (!fullscreenBtn || !fullscreenIcon || !gameWrapper) return;

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      gameWrapper.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  function updateIcon() {
    if (document.fullscreenElement) {
      fullscreenIcon.className = "fas fa-compress";
    } else {
      fullscreenIcon.className = "fas fa-expand";
    }
  }

  document.addEventListener("fullscreenchange", updateIcon);
}

function playCorrectSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(780, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.25);
}

function playIncorrectSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.2);
}

function createParticleEffect(element, color = "#b4ff1a") {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 10; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.backgroundColor = color;
    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / 10;
    const velocity = 80;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    particle.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
      ],
      { duration: 600, easing: "ease-out" }
    ).onfinish = () => particle.remove();
  }
}

function createVictoryParticles(container) {
  const colors = ["#b4ff1a", "#8cffda", "#f9ff90", "#78f7ff"];
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / 40 + Math.random();
    const velocity = 120 + Math.random() * 80;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    particle.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
      ],
      { duration: 900, easing: "ease-out" }
    ).onfinish = () => particle.remove();
  }
}

async function reportGameCompletion(scoreValue, seconds) {
  console.log("Modo estático: progreso no persistente.");
  return {
    completed: true,
    best_score: scoreValue,
    best_time_seconds: seconds,
    message: "Modo demo"
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("modal-overlay");
  if (modalOverlay && modalOverlay.classList.contains("modal-hidden")) {
    initGame();
  } else if (modalOverlay) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.classList.contains("modal-hidden")) {
          initGame();
        }
      });
    });
    observer.observe(modalOverlay, { attributes: true, attributeFilter: ["class"] });
  } else {
    initGame();
  }
});

