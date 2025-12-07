const TIME_PER_QUESTION = 20;
const TOTAL_LIVES = 4;
const QUESTIONS_PER_LEVEL = 5;
const TOTAL_LEVELS = 3;
const MIN_POINTS_TO_WIN = 15;

const LEVELS = [
  {
    title: "Anatomía: El corazón incansable",
    story: "El corazón es un músculo del tamaño de un puño que late sin descanso desde antes de que nazcamos. Gracias a sus cuatro cavidades (dos aurículas y dos ventrículos) puede bombear sangre rica en oxígeno a todos los rincones del cuerpo y regresar la sangre cargada de dióxido de carbono para oxigenarla de nuevo en los pulmones.",
    themeIcon: "bx bxs-heart",
    questions: [
      { text: "El corazón humano solo tiene dos cavidades internas.", answer: false },
      { text: "Cada latido empuja sangre con oxígeno hacia el resto del cuerpo.", answer: true },
      { text: "La sangre regresa al corazón para cargarse de más dióxido de carbono.", answer: false },
      { text: "Es un músculo que trabaja incluso cuando estamos dormidos.", answer: true },
      { text: "Su tamaño promedio es similar al de un puño cerrado.", answer: true }
    ]
  },
  {
    title: "Física: El experimento de la gravedad",
    story: "Galileo demostró que los objetos caen a la misma velocidad sin importar su peso cuando no hay resistencia del aire. En la Tierra esto es difícil de notar por el aire, pero en la Luna, un martillo y una pluma caen al mismo tiempo.",
    themeIcon: "bx bx-planet",
    questions: [
      { text: "La gravedad empuja los objetos hacia arriba.", answer: false },
      { text: "Sin aire, una pluma y un martillo caerían a la misma velocidad.", answer: true },
      { text: "La resistencia del aire hace que algunos objetos caigan más lento.", answer: true },
      { text: "Galileo fue un científico que estudió los rayos láser.", answer: false },
      { text: "La Luna no tiene aire, por eso el experimento se nota mejor allí.", answer: true }
    ]
  },
  {
    title: "Astronomía: Viaje por el sistema solar",
    story: "Los planetas orbitan el Sol siguiendo trayectorias elípticas. Los más cercanos como Mercurio y Venus son más calientes y tardan menos en dar una vuelta. Los gigantes como Júpiter y Saturno tienen muchos satélites y tardan años en completar una órbita.",
    themeIcon: "bx bx-moon",
    questions: [
      { text: "Todos los planetas giran alrededor del Sol.", answer: true },
      { text: "Los planetas más lejanos tardan menos tiempo en completar una órbita.", answer: false },
      { text: "Júpiter es un planeta gigante con muchos satélites.", answer: true },
      { text: "Las órbitas son siempre círculos perfectos.", answer: false },
      { text: "Mercurio tarda menos en dar una vuelta que Saturno.", answer: true }
    ]
  }
];

let currentLevel = 0;
let currentQuestionIndex = 0;
let score = 0;
let lives = TOTAL_LIVES;
let timeRemaining = TIME_PER_QUESTION;
let timerInterval = null;
let startTime = null;
let timeElapsed = 0;

let backgroundMusic = null;
let victorySound = null;
let musicVolume = 0.5;

function initGame() {
  createGameInterface();
  startGame();
}

function createGameInterface() {
  const container = document.getElementById("game-container");
  if (!container) return;

  container.innerHTML = `
    <div class="game-wrapper">
      <div class="game-header">
        <div class="header-top">
          <h2 class="game-title">
            <i class="bx bx-book-reader"></i>
            Verdadero o Falso Científico
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
          <div class="level-display" id="level-display">
            <i class="bx bx-target-lock"></i>
            Historia 1 de ${TOTAL_LEVELS}
          </div>
          <div class="score-display">
            <i class="bx bx-star"></i>
            Puntos: <strong id="score-value">0</strong>
          </div>
          <div class="timer-display">
            <i class="bx bx-time-five"></i>
            Tiempo total: <strong id="timer">00:00</strong>
          </div>
          <div class="lives-display">
            <i class="bx bx-heart"></i>
            Intentos: <strong id="lives-value">${lives}</strong>
          </div>
        </div>
        <div class="lives-track" id="lives-track"></div>
      </div>

      <div class="timer-bar-container">
        <div class="timer-bar" id="timer-bar"></div>
      </div>

      <div class="game-content" id="game-content">
        <!-- Se renderiza dinámicamente -->
      </div>

      <div class="feedback-message info" id="feedback-message"></div>
    </div>
  `;

  setupFullscreenButton();
  initAudio();
  setupVolumeControl();
  updateLivesUI();
}

function startGame() {
  currentLevel = 0;
  currentQuestionIndex = 0;
  score = 0;
  lives = TOTAL_LIVES;
  updateScore();
  updateLivesUI();
  startTime = Date.now();
  timeElapsed = 0;
  showStory();
}

function showStory() {
  const content = document.getElementById("game-content");
  if (!content) return;

  const level = LEVELS[currentLevel];
  content.innerHTML = `
    <div class="story-card">
      <h3 class="story-title"><i class="bx ${level.themeIcon}"></i> ${level.title}</h3>
      <p class="story-text">${level.story}</p>
      <button class="story-button" id="start-questions">
        <i class="bx bx-play-circle"></i> Empezar preguntas
      </button>
    </div>
    <div class="question-card" style="opacity:0.4;pointer-events:none;">
      <p style="text-align:center;">Lee la historia para comenzar las preguntas.</p>
    </div>
  `;

  const button = document.getElementById("start-questions");
  if (button) {
    button.addEventListener("click", () => {
      currentQuestionIndex = 0;
      showQuestion();
    });
  }
}

function showQuestion() {
  if (currentQuestionIndex >= QUESTIONS_PER_LEVEL) {
    currentLevel++;
    if (currentLevel >= TOTAL_LEVELS) {
      completeGame(true);
      return;
    }
    showStory();
    updateLevelDisplay();
    return;
  }

  timeRemaining = TIME_PER_QUESTION;
  updateTimerBar();

  const content = document.getElementById("game-content");
  if (!content) return;

  const level = LEVELS[currentLevel];
  const question = level.questions[currentQuestionIndex];

  content.innerHTML = `
    <div class="story-card blurred">
      <h3 class="story-title"><i class="bx ${level.themeIcon}"></i> ${level.title}</h3>
      <p class="story-text">${level.story}</p>
      <p style="font-size:0.85rem;color:#b4ff1a;">Pregunta ${currentQuestionIndex + 1} de ${QUESTIONS_PER_LEVEL}</p>
    </div>
    <div class="question-card">
      <p class="question-title">¿Verdadero o falso?</p>
      <p class="question-text">${question.text}</p>
      <div class="options-row">
        <button class="option-button" data-answer="true"><i class="bx bx-check"></i> Verdadero</button>
        <button class="option-button" data-answer="false"><i class="bx bx-x"></i> Falso</button>
      </div>
    </div>
  `;

  const buttons = content.querySelectorAll(".option-button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => handleAnswer(btn.dataset.answer === "true"));
  });

  startQuestionTimer();
}

function handleAnswer(selected) {
  stopQuestionTimer();
  const level = LEVELS[currentLevel];
  const correctAnswer = level.questions[currentQuestionIndex].answer;
  const feedback = document.getElementById("feedback-message");
  const buttons = document.querySelectorAll(".option-button");

  buttons.forEach(btn => {
    btn.disabled = true;
    const isCorrectBtn = (btn.dataset.answer === "true") === correctAnswer;
    if (isCorrectBtn) btn.classList.add("correct");
  });

  if (selected === correctAnswer) {
    score++;
    updateScore();
    if (feedback) {
      feedback.className = "feedback-message success";
      feedback.innerHTML = '<i class="bx bx-check-circle"></i> ¡Correcto! +1 punto';
    }
    createParticleEffect(buttons[0]);
  } else {
    lives--;
    updateLivesUI();
    buttons.forEach(btn => {
      if ((btn.dataset.answer === "true") === selected) {
        btn.classList.add("incorrect");
      }
    });
    if (feedback) {
      feedback.className = "feedback-message error";
      feedback.innerHTML = `<i class="bx bx-x-circle"></i> Incorrecto. Recuerda releer la historia.`;
    }
    if (lives <= 0) {
      completeGame(false);
      return;
    }
  }

  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1600);
}

function startQuestionTimer() {
  stopQuestionTimer();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerBar();
    if (timeRemaining <= 0) {
      stopQuestionTimer();
      lives--;
      updateLivesUI();
      const feedback = document.getElementById("feedback-message");
      if (feedback) {
        feedback.className = "feedback-message error";
        feedback.innerHTML = '<i class="bx bx-time"></i> Se terminó el tiempo.';
      }
      if (lives <= 0) {
        completeGame(false);
      } else {
        currentQuestionIndex++;
        showQuestion();
      }
    }
  }, 1000);
}

function stopQuestionTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerBar() {
  const bar = document.getElementById("timer-bar");
  if (!bar) return;
  const percentage = (timeRemaining / TIME_PER_QUESTION) * 100;
  bar.style.width = `${percentage}%`;
  bar.classList.remove("warning", "danger");
  if (percentage <= 30) bar.classList.add("danger");
  else if (percentage <= 50) bar.classList.add("warning");

  timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timerElement = document.getElementById("timer");
  if (timerElement) timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateScore() {
  const scoreElement = document.getElementById("score-value");
  if (scoreElement) {
    scoreElement.textContent = score;
    scoreElement.parentElement.style.animation = "scoreUpdate 0.5s ease";
    setTimeout(() => scoreElement.parentElement.style.animation = "", 500);
  }
}

function updateLivesUI() {
  const livesValue = document.getElementById("lives-value");
  if (livesValue) livesValue.textContent = lives;
  const track = document.getElementById("lives-track");
  if (track) {
    track.innerHTML = "";
    for (let i = 0; i < TOTAL_LIVES; i++) {
      const heart = document.createElement("span");
      heart.className = "life-heart";
      if (i < lives) heart.classList.add("active");
      track.appendChild(heart);
    }
  }
}

function updateLevelDisplay() {
  const levelDisplay = document.getElementById("level-display");
  if (levelDisplay) {
    levelDisplay.innerHTML = `<i class="bx bx-target-lock"></i> Historia ${currentLevel + 1} de ${TOTAL_LEVELS}`;
  }
}

function completeGame(won) {
  stopQuestionTimer();
  if (backgroundMusic) backgroundMusic.pause();
  if (victorySound && won) {
    victorySound.currentTime = 0;
    victorySound.play().catch(() => {});
  }

  const container = document.getElementById("game-container");
  if (!container) return;

  const backUrl = window.gameConfig?.backUrl || "../ciencia.html";
  if (won) createVictoryParticles(container);

  const totalQuestions = TOTAL_LEVELS * QUESTIONS_PER_LEVEL;
  const accuracy = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  setTimeout(() => {
    container.innerHTML = `
      <div class="game-complete victory-screen-enter">
        <div class="complete-content victory-content-enter">
          <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
            <i class="bx ${won ? "bx-trophy" : "bx-x-circle"}" style="font-size: 40px; color: ${won ? "#ffd700" : "#ff6b6b"};"></i>
          </div>
          <h2 class="complete-title title-animation">${won ? "¡Científico experto!" : "Game Over"}</h2>
          <p class="complete-message message-animation">${won ? "Demostraste gran comprensión de las historias científicas." : "Los intentos se agotaron. ¡Vuelve a intentarlo!"}</p>
          <div class="stats-card stats-animation">
            <p><span>Puntuación</span> <span>${score}/${totalQuestions}</span></p>
            <p><span>Tiempo</span> <span>${timeString}</span></p>
            <p><span>Precisión</span> <span>${accuracy}%</span></p>
          </div>
          <div class="complete-buttons buttons-animation">
            <button class="restart-button" onclick="restartGame()">
              <i class="bx bx-refresh"></i> Volver a jugar
            </button>
            ${won ? `<a href="${backUrl}" class="restart-button back-button">
              <i class="bx bx-arrow-back"></i> Volver al menú
            </a>` : `<button class="restart-button back-button" disabled>
              <i class="bx bx-lock"></i> Bloqueado
            </button>`}
          </div>
        </div>
      </div>
    `;
  }, 400);
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
  backgroundMusic.play().catch(() => {});

  victorySound = new Audio("/static/assets/exam.mp3");
  victorySound.volume = 0.7;
}

function setupVolumeControl() {
  const slider = document.getElementById("volume-slider");
  const icon = document.getElementById("music-icon");
  if (!slider || !icon) return;

  slider.addEventListener("input", e => {
    musicVolume = e.target.value / 100;
    if (backgroundMusic) backgroundMusic.volume = musicVolume;
    updateMusicIcon(icon, musicVolume);
  });

  icon.addEventListener("click", () => {
    if (!backgroundMusic) return;
    if (backgroundMusic.paused) {
      backgroundMusic.play().catch(() => {});
      slider.value = musicVolume * 100;
      updateMusicIcon(icon, musicVolume);
    } else {
      backgroundMusic.pause();
      slider.value = 0;
      updateMusicIcon(icon, 0);
    }
  });
}

function updateMusicIcon(icon, volume) {
  if (volume === 0) icon.className = "bx bx-volume-mute";
  else if (volume < 0.5) icon.className = "bx bx-volume-low";
  else icon.className = "bx bx-volume-full";
}

function setupFullscreenButton() {
  const btn = document.getElementById("fullscreen-btn");
  const icon = document.getElementById("fullscreen-icon-inner");
  const wrapper = document.querySelector(".game-wrapper");
  if (!btn || !icon || !wrapper) return;

  btn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      icon.className = "fas fa-compress";
    } else {
      icon.className = "fas fa-expand";
    }
  });
}

function createParticleEffect(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.position = "fixed";
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.width = "8px";
    particle.style.height = "8px";
    particle.style.backgroundColor = "#b4ff1a";
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "9999";
    particle.style.boxShadow = "0 0 10px #b4ff1a";
    document.body.appendChild(particle);
    const angle = (Math.PI * 2 * i) / 10;
    const velocity = 80;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    particle.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
    ], { duration: 600, easing: "ease-out" }).onfinish = () => particle.remove();
  }
}

function createVictoryParticles(container) {
  const colors = ["#b4ff1a", "#8cffda", "#f9ff90", "#78f7ff"];
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.width = `${Math.random() * 8 + 4}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "10000";
    particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
    document.body.appendChild(particle);
    const angle = (Math.PI * 2 * i) / 40 + Math.random();
    const velocity = 120 + Math.random() * 80;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;
    particle.animate([
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(0) rotate(360deg)`, opacity: 0 }
    ], { duration: 900, easing: "ease-out" }).onfinish = () => particle.remove();
  }
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

