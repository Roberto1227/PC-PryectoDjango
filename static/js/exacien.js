document.addEventListener('DOMContentLoaded', () => {
  const quizSection = document.getElementById('quiz-section');
  const startBtn = document.getElementById('start-exam');
  const questionTopicEl = document.getElementById('question-topic');
  const questionProgressEl = document.getElementById('question-progress');
  const questionText = document.getElementById('question-text');
  const optionsGrid = document.getElementById('options-grid');
  const feedbackPanel = document.getElementById('feedback-panel');
  const correctCountEl = document.getElementById('correct-count');
  const incorrectCountEl = document.getElementById('incorrect-count');
  const timerDisplay = document.getElementById('timer-display');
  const timerPill = document.getElementById('timer-pill');
  const questionCardEl = document.querySelector('.question-card');
  const quizHeaderEl = document.querySelector('.quiz-header');
  const heroAudioEl = document.getElementById('bg-audio');
  const examAudioEl = document.getElementById('exam-audio');
  const heroAudio = heroAudioEl || new Audio('/static/assets/ciencias/ciensmusic.mp3');
  const examAudio = examAudioEl || new Audio('/static/assets/exam.mp3');
  const correctSfx = new Audio('/static/assets/math/acierto.mp3');
  const incorrectSfx = new Audio('/static/assets/math/error.mp3');

  const PASSING_SCORE = 10;
  const QUESTION_TIME = 30;
  const AUTO_ADVANCE_DELAY = 2000;
  const COLOR_CLASSES = ['mint', 'lime', 'orange', 'purple'];
  const BACK_URL = window.EXAM_CONFIG?.backUrl || '/ciencia/';

  const QUESTIONS = [
    {
      topic: 'Ahorcado de Ciencias',
      icon: 'bx bx-atom',
      question: '¿Qué palabra científica describe el proceso con el que las plantas producen su alimento usando luz?',
      options: ['Fotosíntesis', 'Respiración', 'Digestión', 'Circulación'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'La fotosíntesis es el proceso mediante el cual las plantas usan luz, dióxido de carbono y agua para crear alimento y oxígeno.'
    },
    {
      topic: 'Ahorcado de Ciencias',
      icon: 'bx bx-atom',
      question: '¿Qué palabra describe el conjunto de seres vivos y el lugar donde viven?',
      options: ['Ecosistema', 'Hábitat', 'Biósfera', 'Comunidad'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'Un ecosistema es el conjunto de seres vivos (plantas, animales) y el lugar donde viven, interactuando para mantener el equilibrio.'
    },
    {
      topic: 'Ahorcado de Ciencias',
      icon: 'bx bx-atom',
      question: '¿Qué herramienta se usa para observar objetos muy pequeños como células?',
      options: ['Telescopio', 'Microscopio', 'Binoculares', 'Lupa'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'El microscopio es una herramienta que permite observar objetos muy pequeños como células y microbios que no se ven a simple vista.'
    },
    {
      topic: 'Identifica el Reino',
      icon: 'bx bx-leaf',
      question: '¿A qué reino pertenece un árbol?',
      options: ['Reino Animal', 'Reino Planta', 'Reino Fúngico', 'Reino Eucariota'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Los árboles pertenecen al Reino Planta porque realizan fotosíntesis y tienen células con pared celular.'
    },
    {
      topic: 'Identifica el Reino',
      icon: 'bx bx-leaf',
      question: '¿A qué reino pertenece un hongo?',
      options: ['Reino Animal', 'Reino Planta', 'Reino Fúngico', 'Reino Eucariota'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: 'Los hongos pertenecen al Reino Fúngico, que es diferente al reino de las plantas porque no hacen fotosíntesis.'
    },
    {
      topic: 'Identifica el Reino',
      icon: 'bx bx-leaf',
      question: '¿A qué reino pertenece un perro?',
      options: ['Reino Animal', 'Reino Planta', 'Reino Fúngico', 'Reino Eucariota'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'Los perros pertenecen al Reino Animal porque se mueven, se alimentan de otros seres vivos y tienen células sin pared celular.'
    },
    {
      topic: 'Verdadero o Falso Científico',
      icon: 'bx bx-brain',
      question: 'El corazón humano tiene cuatro cavidades: dos aurículas y dos ventrículos.',
      options: ['Verdadero', 'Falso', 'Solo tiene dos', 'Tiene seis'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'Verdadero. El corazón tiene cuatro cavidades: dos aurículas (superiores) y dos ventrículos (inferiores) que bombean sangre.'
    },
    {
      topic: 'Verdadero o Falso Científico',
      icon: 'bx bx-brain',
      question: 'Sin resistencia del aire, una pluma y un martillo caerían a la misma velocidad.',
      options: ['Verdadero', 'Falso', 'Solo en la Luna', 'Nunca'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'Verdadero. Galileo demostró que sin resistencia del aire, todos los objetos caen a la misma velocidad, independientemente de su peso.'
    },
    {
      topic: 'Verdadero o Falso Científico',
      icon: 'bx bx-brain',
      question: 'Los planetas más lejanos del Sol tardan menos tiempo en completar una órbita.',
      options: ['Verdadero', 'Falso', 'Todos tardan igual', 'Depende del tamaño'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Falso. Los planetas más lejanos tardan más tiempo en completar una órbita porque tienen que recorrer una distancia mayor.'
    },
    {
      topic: 'El Esqueleto',
      icon: 'bx bx-body',
      question: '¿Qué parte del esqueleto protege el cerebro?',
      options: ['Mandíbula', 'Cráneo', 'Columna', 'Esternón'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'El cráneo es la parte del esqueleto que protege el cerebro, formando una caja ósea resistente.'
    },
    {
      topic: 'El Esqueleto',
      icon: 'bx bx-body',
      question: '¿Qué hueso largo se encuentra en el brazo, entre el hombro y el codo?',
      options: ['Radio', 'Cúbito', 'Húmero', 'Clavícula'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: 'El húmero es el hueso largo del brazo que va desde el hombro hasta el codo.'
    },
    {
      topic: 'El Esqueleto',
      icon: 'bx bx-body',
      question: '¿Qué hueso largo se encuentra en la pierna, entre la cadera y la rodilla?',
      options: ['Tibia', 'Peroné', 'Fémur', 'Rótula'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: 'El fémur es el hueso más largo del cuerpo y se encuentra en la pierna, entre la cadera y la rodilla.'
    },
    {
      topic: 'El Sistema Solar',
      icon: 'bx bx-planet',
      question: '¿Cuál es el planeta más cercano al Sol?',
      options: ['Venus', 'Mercurio', 'Tierra', 'Marte'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Mercurio es el planeta más cercano al Sol en nuestro sistema solar.'
    },
    {
      topic: 'El Sistema Solar',
      icon: 'bx bx-planet',
      question: '¿Qué planeta tiene anillos visibles desde la Tierra?',
      options: ['Júpiter', 'Saturno', 'Urano', 'Neptuno'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Saturno es famoso por sus anillos visibles, formados por hielo y rocas que orbitan alrededor del planeta.'
    },
    {
      topic: 'El Sistema Solar',
      icon: 'bx bx-planet',
      question: '¿Cuál es el planeta más lejano del Sol en el sistema solar?',
      options: ['Urano', 'Neptuno', 'Plutón', 'Júpiter'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Neptuno es el planeta más lejano del Sol en el sistema solar, aunque Plutón (planeta enano) está aún más lejos.'
    }
  ];

  let stats = { correct: 0, incorrect: 0 };
  let currentQuestionIndex = 0;
  let hasAnswered = false;
  let timerInterval = null;
  let timeLeft = QUESTION_TIME;
  let totalTimeElapsed = 0;
  let examStartTime = null;
  let heroMusicPrimed = false;
  let audioSuitePrimed = false;

  function restartAnimation(el, className) {
    if (!el) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function triggerQuestionAnimation() {
    restartAnimation(quizHeaderEl, 'header-enter');
    restartAnimation(questionCardEl, 'card-enter');
    restartAnimation(optionsGrid, 'options-enter');
  }

  function primeAudioSuite() {
    if (audioSuitePrimed) return;
    audioSuitePrimed = true;
    [heroAudio, examAudio, correctSfx, incorrectSfx].forEach(audio => {
      audio.volume = audio === correctSfx || audio === incorrectSfx ? 0.6 : audio.volume;
      audio.preload = 'auto';
    });
  }

  function tryPlayAudio(audioEl, volume = 0.4) {
    if (!audioEl) return;
    audioEl.volume = volume;
    audioEl.loop = true;
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  }

  function stopAudio(audioEl) {
    if (!audioEl) return;
    audioEl.pause();
    audioEl.currentTime = 0;
  }

  function ensureHeroMusic() {
    if (heroMusicPrimed) return;
    heroMusicPrimed = true;
    primeAudioSuite();
    tryPlayAudio(heroAudio, 0.32);
  }

  function switchToExamMusic() {
    primeAudioSuite();
    stopAudio(heroAudio);
    tryPlayAudio(examAudio, 0.42);
  }

  function playSfx(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function setupHeroMusicTrigger() {
    const handler = () => {
      ensureHeroMusic();
      window.removeEventListener('pointerdown', handler);
    };
    window.addEventListener('pointerdown', handler, { once: true });
  }
  setupHeroMusicTrigger();

  function updateScoreboard() {
    if (correctCountEl) correctCountEl.textContent = stats.correct;
    if (incorrectCountEl) incorrectCountEl.textContent = stats.incorrect;
  }

  function updateTimerDisplay() {
    if (!timerDisplay) return;
    const safeTime = Math.max(0, timeLeft);
    timerDisplay.textContent = `${safeTime.toString().padStart(2, '0')}s`;
    if (timerPill) {
      timerPill.classList.toggle('danger', safeTime <= 5);
    }
  }

  function startTimer() {
    stopTimer();
    timeLeft = QUESTION_TIME;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft -= 1;
      totalTimeElapsed += 1;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function renderQuestion() {
    if (currentQuestionIndex >= QUESTIONS.length) {
      finishQuiz();
      return;
    }

    hasAnswered = false;
    const data = QUESTIONS[currentQuestionIndex];

    if (questionTopicEl) {
      questionTopicEl.innerHTML = `<i class="${data.icon}" aria-hidden="true"></i> <span>${data.topic}</span>`;
    }
    if (questionProgressEl) {
      questionProgressEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${QUESTIONS.length}`;
    }

    if (questionText) questionText.textContent = data.question;
    if (feedbackPanel) feedbackPanel.textContent = 'Selecciona una respuesta antes de que el cronómetro llegue a cero.';
    if (optionsGrid) optionsGrid.innerHTML = '';

    data.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `option-card ${COLOR_CLASSES[index] || ''}`;
      button.dataset.index = index.toString();
      button.disabled = false;
      button.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
        <span class="option-text">${option.text}</span>
      `;
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleAnswer(index, button);
      }, { once: true });
      if (optionsGrid) optionsGrid.appendChild(button);
    });

    startTimer();
    triggerQuestionAnimation();
  }

  function disableOptions() {
    if (!optionsGrid) return;
    optionsGrid.querySelectorAll('.option-card').forEach(btn => {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';
    });
  }

  function highlightCorrectOption(questionData) {
    if (!optionsGrid) return;
    optionsGrid.querySelectorAll('.option-card').forEach((btn, idx) => {
      if (questionData.options[idx]?.correct) {
        btn.classList.add('correct');
      }
    });
  }

  function handleAnswer(selectedIndex, selectedButton) {
    if (hasAnswered) {
      console.log('Ya se respondió esta pregunta');
      return;
    }
    
    hasAnswered = true;
    stopTimer();
    disableOptions();

    const questionData = QUESTIONS[currentQuestionIndex];
    if (!questionData) {
      console.error('No hay pregunta actual');
      return;
    }

    const selectedOption = questionData.options[selectedIndex];
    const isCorrect = selectedOption && selectedOption.correct === true;

    highlightCorrectOption(questionData);

    if (isCorrect) {
      stats.correct += 1;
      playSfx(correctSfx);
      selectedButton.classList.add('correct');
      if (feedbackPanel) feedbackPanel.textContent = `¡Correcto! ${questionData.explanation}`;
    } else {
      stats.incorrect += 1;
      playSfx(incorrectSfx);
      selectedButton.classList.add('incorrect');
      if (feedbackPanel) feedbackPanel.textContent = `Respuesta incorrecta. ${questionData.explanation}`;
    }

    updateScoreboard();
    goToNextQuestion();
  }

  function handleTimeout() {
    if (hasAnswered) {
      console.log('Timeout ignorado: ya se respondió');
      return;
    }
    
    hasAnswered = true;
    stopTimer();
    disableOptions();

    const questionData = QUESTIONS[currentQuestionIndex];
    if (!questionData) {
      console.error('No hay pregunta actual en timeout');
      return;
    }

    stats.incorrect += 1;
    playSfx(incorrectSfx);
    highlightCorrectOption(questionData);
    if (feedbackPanel) feedbackPanel.textContent = `Se acabó el tiempo. ${questionData.explanation}`;
    updateScoreboard();
    goToNextQuestion();
  }

  function goToNextQuestion() {
    setTimeout(() => {
      currentQuestionIndex += 1;
      if (currentQuestionIndex < QUESTIONS.length) {
        renderQuestion();
      } else {
        finishQuiz();
      }
    }, AUTO_ADVANCE_DELAY);
  }

  function finishQuiz() {
    stopTimer();
    stopAudio(examAudio);
    
    const passed = stats.correct >= PASSING_SCORE;
    const timeString = formatTime(totalTimeElapsed);
    const backUrl = BACK_URL;
    const percentage = Math.round((stats.correct / QUESTIONS.length) * 100);
    const passedMessage = passed 
      ? '¡Excelente trabajo! Has demostrado un gran conocimiento científico.'
      : 'No te desanimes. Sigue practicando y mejorarás tus resultados.';

    if (quizHeaderEl) quizHeaderEl.style.display = 'none';
    if (questionCardEl) questionCardEl.style.display = 'none';
    
    const resultsHTML = `
      <div class="exam-results-screen">
        <div class="results-card">
          <div class="results-header">
            <div class="results-icon ${passed ? 'passed' : 'failed'}">
              <i class="bx ${passed ? 'bx-trophy' : 'bx-x-circle'}"></i>
            </div>
            <h2 class="results-title">${passed ? '¡Felicidades!' : '¡Sigue intentando!'}</h2>
            <p class="results-subtitle">${passedMessage}</p>
          </div>
          
          <div class="results-stats">
            <div class="stat-item">
              <div class="stat-icon correct-stat">
                <i class="bx bx-check-circle"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Aciertos</span>
                <strong class="stat-value">${stats.correct}</strong>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon incorrect-stat">
                <i class="bx bx-error"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Errores</span>
                <strong class="stat-value">${stats.incorrect}</strong>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon time-stat">
                <i class="bx bx-time-five"></i>
              </div>
              <div class="stat-content">
                <span class="stat-label">Tiempo Total</span>
                <strong class="stat-value">${timeString}</strong>
              </div>
            </div>
          </div>
          
          <div class="results-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <p class="progress-text">${stats.correct} de ${QUESTIONS.length} preguntas correctas (${percentage}%)</p>
          </div>
          
          <div class="results-actions">
            <a href="${backUrl}" class="button finish-button">
              <i class="bx bx-arrow-back"></i>
              Finalizar
            </a>
          </div>
        </div>
      </div>
    `;

    if (quizSection) {
      const wrapper = quizSection.querySelector('.quiz-card-wrapper');
      if (wrapper) {
        wrapper.innerHTML = resultsHTML;
      }
    }
  }

  function resetState() {
    stats = { correct: 0, incorrect: 0 };
    currentQuestionIndex = 0;
    totalTimeElapsed = 0;
    examStartTime = null;
    updateScoreboard();
    if (quizHeaderEl) quizHeaderEl.style.display = '';
    if (questionCardEl) questionCardEl.style.display = '';
  }

  function startQuiz() {
    resetState();
    examStartTime = Date.now();
    if (quizSection) quizSection.classList.add('active');
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = 'Quiz en curso';
    }
    renderQuestion();
    switchToExamMusic();
    if (quizSection) quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }
});
