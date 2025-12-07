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
  const heroAudio = heroAudioEl || new Audio('/static/assets/english/ingmusic.mp3');
  const examAudio = examAudioEl || new Audio('/static/assets/exam.mp3');
  const correctSfx = new Audio('/static/assets/math/acierto.mp3');
  const incorrectSfx = new Audio('/static/assets/math/error.mp3');

  const PASSING_SCORE = 10;
  const QUESTION_TIME = 30;
  const AUTO_ADVANCE_DELAY = 2000;
  const COLOR_CLASSES = ['mint', 'lime', 'orange', 'purple'];
  const BACK_URL = window.EXAM_CONFIG?.backUrl || '/ingles/';

  const QUESTIONS = [
    {
      topic: 'English Adventure Map',
      icon: 'bx bx-map',
      question: 'Complete the sentence: "I ___ breakfast every morning."',
      options: ['eats', 'eat', 'eating', 'ate'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Usamos "eat" con "I" porque es la forma del presente simple para la primera persona.'
    },
    {
      topic: 'English Adventure Map',
      icon: 'bx bx-map',
      question: 'What room do you use to cook food?',
      options: ['Bedroom', 'Kitchen', 'Bathroom', 'Living room'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'La cocina (Kitchen) es donde preparamos y cocinamos las comidas.'
    },
    {
      topic: 'English Adventure Map',
      icon: 'bx bx-map',
      question: 'Complete: "My ___ is in the bedroom."',
      options: ['book', 'car', 'bed', 'dog'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: 'Una cama (bed) es un mueble que se encuentra en un dormitorio (bedroom).'
    },
    {
      topic: 'English Detective',
      icon: 'bx bx-search-alt',
      question: 'Find the error: "The cat are sleeping."',
      options: [
        'The cat is sleeping.',
        'The cat am sleeping.',
        'The cat be sleeping.',
        'The cat was sleeping.'
      ].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'Con "cat" (singular) usamos "is", no "are" (que es para plural).'
    },
    {
      topic: 'English Detective',
      icon: 'bx bx-search-alt',
      question: 'Correct this sentence: "I goes to school every day."',
      options: [
        'I go to school every day.',
        'I going to school every day.',
        'I went to school every day.',
        'I gone to school every day.'
      ].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'Con "I" usamos "go" en presente simple, no "goes" (que es para tercera persona).'
    },
    {
      topic: 'English Detective',
      icon: 'bx bx-search-alt',
      question: 'Which sentence is correct?',
      options: [
        'She don\'t like apples.',
        'She doesn\'t like apples.',
        'She not like apples.',
        'She no like apples.'
      ].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Con "she" (tercera persona singular) usamos "doesn\'t" para negaciones en presente.'
    },
    {
      topic: 'English Colors',
      icon: 'bx bx-palette',
      question: 'How do you say "azul claro" in English?',
      options: ['dark blue', 'light blue', 'blue light', 'blue dark'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: '"Light blue" significa azul claro. El prefijo "light" va antes del color.'
    },
    {
      topic: 'English Colors',
      icon: 'bx bx-palette',
      question: 'What color is formed by "dark" + "green"?',
      options: ['light green', 'dark green', 'green dark', 'green light'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: '"Dark green" significa verde oscuro. El prefijo "dark" va antes del color.'
    },
    {
      topic: 'English Colors',
      icon: 'bx bx-palette',
      question: 'Complete: "The sky is ___ blue."',
      options: ['light', 'dark', 'bright', 'clear'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: '"Light blue" describe un azul claro, como el color del cielo durante el día.'
    },
    {
      topic: 'Word Builder',
      icon: 'bx bx-font',
      question: 'Arrange the letters to form a word: C-A-T',
      options: ['CAT', 'ACT', 'TAC', 'ATC'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'CAT significa "gato" en inglés. Es una palabra básica del vocabulario.'
    },
    {
      topic: 'Word Builder',
      icon: 'bx bx-font',
      question: 'What word do these letters form? D-O-G',
      options: ['DOG', 'GOD', 'ODG', 'DGO'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'DOG significa "perro" en inglés. Es una palabra fundamental del vocabulario básico.'
    },
    {
      topic: 'Word Builder',
      icon: 'bx bx-font',
      question: 'Build the word: S-U-N',
      options: ['SUN', 'NUS', 'UNS', 'SNU'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: 'SUN significa "sol" en inglés. Es una palabra común del vocabulario básico.'
    },
    {
      topic: 'Word Match',
      icon: 'bx bx-check-square',
      question: 'What is the Spanish translation of "CAT"?',
      options: ['perro', 'gato', 'pájaro', 'pez'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'CAT se traduce como "gato" en español.'
    },
    {
      topic: 'Word Match',
      icon: 'bx bx-check-square',
      question: 'Match: "BOOK" in Spanish is:',
      options: ['mesa', 'libro', 'silla', 'casa'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'BOOK se traduce como "libro" en español.'
    },
    {
      topic: 'Word Match',
      icon: 'bx bx-check-square',
      question: 'What does "TEACHER" mean in Spanish?',
      options: ['doctor', 'maestro', 'cocinero', 'policía'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'TEACHER se traduce como "maestro" o "profesor" en español.'
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
      ? '¡Excelente trabajo! Has demostrado un gran dominio del inglés.'
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
