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
  const heroAudio = heroAudioEl || new Audio('/static/assets/gramatic/gramusic.mp3');
  const examAudio = examAudioEl || new Audio('/static/assets/exam.mp3');
  const correctSfx = new Audio('/static/assets/math/acierto.mp3');
  const incorrectSfx = new Audio('/static/assets/math/error.mp3');

  const PASSING_SCORE = 10;
  const QUESTION_TIME = 30;
  const AUTO_ADVANCE_DELAY = 2000;
  const COLOR_CLASSES = ['mint', 'lime', 'orange', 'purple'];
  const BACK_URL = window.EXAM_CONFIG?.backUrl || '/gramatica/';

  const QUESTIONS = [
    {
      topic: 'Sopa de Letras',
      icon: 'bx bx-grid-alt',
      question: '¿Cuál de estas palabras es un sustantivo común?',
      options: ['brillante', 'correr', 'montaña', 'feliz'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: '"Montaña" nombra un objeto; es un sustantivo común.'
    },
    {
      topic: 'Sopa de Letras',
      icon: 'bx bx-grid-alt',
      question: 'Escoge el adjetivo que describe cómo es algo.',
      options: ['suave', 'cantar', 'bosque', 'salté'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: '"Suave" expresa una cualidad; es un adjetivo.'
    },
    {
      topic: 'Sopa de Letras',
      icon: 'bx bx-grid-alt',
      question: 'Selecciona el verbo que indica una acción.',
      options: ['amistad', 'descubrir', 'azul', 'valiente'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: '"Descubrir" es una acción; por eso es verbo.'
    },
    {
      topic: 'Ruleta Gramatical',
      icon: 'bx bx-cycling',
      question: 'La ruleta te da la palabra "honesto". ¿Cuál oración es correcta?',
      options: [
        'Honesto siempre digo la verdad.',
        'Soy honesto cuando explico lo que pasó.',
        'Honesto somos cuando jugamos.',
        'Honesto dijo la maestra que soy.'
      ].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'La segunda opción usa "honesto" como adjetivo que concuerda con "soy".'
    },
    {
      topic: 'Ruleta Gramatical',
      icon: 'bx bx-cycling',
      question: 'Si sale la palabra "mariposas", ¿qué oración respeta mayúscula y punto?',
      options: [
        'mariposas vuelan sobre el jardín',
        'Las mariposas vuelan sobre el jardín.',
        'las mariposas vuelan sobre el jardín?',
        'Las mariposas vuelan sobre el jardín'
      ].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Inicia con mayúscula y termina con punto.'
    },
    {
      topic: 'Ruleta Gramatical',
      icon: 'bx bx-cycling',
      question: 'La palabra es "imaginación". ¿Cuál oración mantiene coherencia?',
      options: [
        'Tu imaginación construye historias nuevas.',
        'Tu imaginación camina comiendo helado.',
        'Tu imaginación tiene cuatro ruedas.',
        'Tu imaginación se estaciona en la calle.'
      ].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'La imaginación crea historias; el resto no tiene sentido lógico.'
    },
    {
      topic: 'Detective de Palabras',
      icon: 'bx bx-search-alt',
      question: 'El faro "cantaba luces" en el cuento. ¿Qué palabra corrige la frase?',
      options: ['saltaba', 'proyectaba', 'escribía', 'apagaba'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Un faro proyecta luces para guiar a los navegantes.'
    },
    {
      topic: 'Detective de Palabras',
      icon: 'bx bx-search-alt',
      question: 'Las gaviotas enviaban "zanahorias". ¿Qué palabra debería aparecer?',
      options: ['señales', 'pájaros', 'caramelos', 'globos'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'En el cuento llevan señales luminosas, no zanahorias.'
    },
    {
      topic: 'Detective de Palabras',
      icon: 'bx bx-search-alt',
      question: 'En la biblioteca viviente, los libros "saltaban". ¿Qué reemplazo es correcto?',
      options: ['reposaban', 'corrían', 'cantaban', 'patinaban'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'Los libros reposan en los estantes; no saltan.'
    },
    {
      topic: 'Detective de Palabras',
      icon: 'bx bx-search-alt',
      question: 'El tren del tiempo estaba hecho de "cartón". ¿Cuál palabra lo corrige?',
      options: ['algodón', 'acero', 'nieve', 'papel'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Un tren resistente está fabricado de acero.'
    },
    {
      topic: 'Cartas de Gramática',
      icon: 'bx bx-card',
      question: 'En Cartas de Gramática, ¿cómo clasificas la palabra "amistad"?',
      options: ['Sustantivo', 'Adjetivo', 'Verbo', 'Adverbio'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: '"Amistad" nombra un sentimiento; es un sustantivo.'
    },
    {
      topic: 'Cartas de Gramática',
      icon: 'bx bx-card',
      question: '¿Qué tipo de palabra es "generoso"?',
      options: ['Sustantivo', 'Adjetivo', 'Verbo', 'Pronombre'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: '"Generoso" describe cualidades; es adjetivo.'
    },
    {
      topic: 'Cartas de Gramática',
      icon: 'bx bx-card',
      question: 'La palabra "construir" pertenece a la categoría de:',
      options: ['Sustantivo', 'Adjetivo', 'Verbo', 'Interjección'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: '"Construir" expresa acción; es un verbo.'
    },
    {
      topic: 'Gramática General',
      icon: 'bx bx-edit',
      question: '¿En qué oración el verbo concuerda con el sujeto?',
      options: [
        'Los detectives encuentra pistas claras.',
        'Los detectives encuentran pistas claras.',
        'Los detectives encuentran pista clara.',
        'Los detective encuentran pistas claras.'
      ].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Sujeto plural → verbo plural "encuentran".'
    },
    {
      topic: 'Gramática General',
      icon: 'bx bx-edit',
      question: '¿Cuál palabra necesita tilde para escribirse correctamente?',
      options: ['camion', 'silla', 'árbol', 'nube'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: '"Árbol" lleva tilde por ser palabra llana terminada en consonante distinta de n o s.'
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
      ? '¡Excelente trabajo! Has demostrado un gran dominio de la gramática.'
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
