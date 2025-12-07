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
  const heroAudio = heroAudioEl || new Audio('/static/assets/math/matmusic.mp3');
  const examAudio = examAudioEl || new Audio('/static/assets/exam.mp3');
  const correctSfx = new Audio('/static/assets/math/acierto.mp3');
  const incorrectSfx = new Audio('/static/assets/math/error.mp3');

  const PASSING_SCORE = 10;
  const QUESTION_TIME = 30; // 30 segundos por pregunta
  const AUTO_ADVANCE_DELAY = 2000;
  const COLOR_CLASSES = ['mint', 'lime', 'orange', 'purple'];
  
  // Obtener URL de retorno desde el HTML
  const BACK_URL = window.EXAM_CONFIG?.backUrl || '/matematica/';

  const QUESTIONS = [
    {
      topic: 'Secuencias Numéricas',
      icon: 'bx bx-calculator',
      question: '¿Qué número sigue en la secuencia 3, 6, 9, __?',
      options: ['11', '12', '14', '15'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Sumas 3 cada vez: 3, 6, 9, 12…'
    },
    {
      topic: 'Secuencias Numéricas',
      icon: 'bx bx-calculator',
      question: 'Completa la serie 10, 15, 20, __, 30.',
      options: ['22', '23', '24', '25'].map((text, idx) => ({ text, correct: idx === 3 })),
      explanation: 'La secuencia aumenta de 5 en 5; después de 20 viene 25.'
    },
    {
      topic: 'Secuencias Numéricas',
      icon: 'bx bx-calculator',
      question: 'Si empiezas en 7 y sumas 4 cada vez, ¿cuál es el tercer número de la secuencia?',
      options: ['11', '15', '19', '23'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Los términos son 7, 11 y 15; el tercero es 15.'
    },
    {
      topic: 'Gusano Comelón',
      icon: 'bx bx-plus-circle',
      question: 'El gusano debe resolver 8 + 7. ¿Qué resultado debe buscar?',
      options: ['13', '14', '15', '16'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: '8 + 7 = 15, así que debe comer la fruta con ese número.'
    },
    {
      topic: 'Gusano Comelón',
      icon: 'bx bx-minus-circle',
      question: 'Si la operación es 18 - 9, ¿qué número elige el gusano?',
      options: ['6', '7', '8', '9'].map((text, idx) => ({ text, correct: idx === 3 })),
      explanation: '18 menos 9 es 9.'
    },
    {
      topic: 'Gusano Comelón',
      icon: 'bx bx-plus-circle',
      question: 'En una suma 12 + 5, ¿qué fruta debe comer?',
      options: ['15', '16', '17', '18'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: '12 + 5 = 17.'
    },
    {
      topic: 'Carrera Matemática',
      icon: 'bx bx-car',
      question: 'En la pista aparece 4 × 6. ¿Qué respuesta debes chocar?',
      options: ['18', '20', '24', '26'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: '4 por 6 es 24.'
    },
    {
      topic: 'Carrera Matemática',
      icon: 'bx bx-car',
      question: 'Cuando ves 24 ÷ 6, ¿con qué número ganas puntos?',
      options: ['3', '4', '5', '6'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: '24 dividido entre 6 es 4.'
    },
    {
      topic: 'Carrera Matemática',
      icon: 'bx bx-car',
      question: 'Si la pista muestra 9 + 6, ¿qué respuesta eliges?',
      options: ['13', '14', '15', '16'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: '9 + 6 = 15.'
    },
    {
      topic: 'Memoria Matemática',
      icon: 'bx bx-brain',
      question: '¿Qué pareja suma 14?',
      options: ['7 + 4', '6 + 8', '9 + 3', '5 + 6'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: '6 y 8 forman el objetivo 14.'
    },
    {
      topic: 'Memoria Matemática',
      icon: 'bx bx-brain',
      question: '¿Cuál de estas restas da 5?',
      options: ['14 - 9', '18 - 4', '12 - 6', '9 - 1'].map((text, idx) => ({ text, correct: idx === 0 })),
      explanation: '14 menos 9 deja 5.'
    },
    {
      topic: 'Memoria Matemática',
      icon: 'bx bx-brain',
      question: '¿Qué multiplicación tiene como resultado 16?',
      options: ['3 × 5', '4 × 4', '2 × 6', '5 × 3'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: '4 por 4 es 16.'
    },
    {
      topic: 'Operaciones con Figuras',
      icon: 'bx bx-shape-triangle',
      question: 'Si un triángulo tiene 3 lados y un cuadrado tiene 4 lados, ¿cuánto es 3 + 4?',
      options: ['5', '6', '7', '8'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: 'Un triángulo (3 lados) más un cuadrado (4 lados) = 3 + 4 = 7.'
    },
    {
      topic: 'Operaciones con Figuras',
      icon: 'bx bx-shape-triangle',
      question: 'Un pentágono tiene 5 lados y un triángulo tiene 3 lados. ¿Cuánto es 5 - 3?',
      options: ['1', '2', '3', '4'].map((text, idx) => ({ text, correct: idx === 1 })),
      explanation: 'Pentágono (5 lados) menos triángulo (3 lados) = 5 - 3 = 2.'
    },
    {
      topic: 'Operaciones con Figuras',
      icon: 'bx bx-shape-triangle',
      question: 'Si un cuadrado tiene 4 lados, ¿cuánto es 4 × 2?',
      options: ['6', '7', '8', '9'].map((text, idx) => ({ text, correct: idx === 2 })),
      explanation: 'Cuadrado (4 lados) multiplicado por 2 = 4 × 2 = 8.'
    }
  ];

  let stats = { correct: 0, incorrect: 0 };
  let currentQuestionIndex = 0;
  let hasAnswered = false;
  let timerInterval = null;
  let timeLeft = QUESTION_TIME;
  let totalTimeElapsed = 0; // Tiempo total del examen
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

    // Resetear el estado de respuesta para la nueva pregunta
    hasAnswered = false;
    
    const data = QUESTIONS[currentQuestionIndex];
    if (!data) {
      console.error('No hay datos para la pregunta', currentQuestionIndex);
      finishQuiz();
      return;
    }

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
      button.disabled = false; // Asegurar que esté habilitado
      button.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
        <span class="option-text">${option.text}</span>
      `;
      // Usar una función wrapper para asegurar que el índice se pase correctamente
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleAnswer(index, button);
      }, { once: true }); // Usar once: true para prevenir múltiples listeners
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
    // Prevenir múltiples clics
    if (hasAnswered) {
      console.log('Ya se respondió esta pregunta');
      return;
    }
    
    // Marcar como respondida inmediatamente para prevenir race conditions
    hasAnswered = true;
    stopTimer();

    // Deshabilitar todas las opciones inmediatamente
    disableOptions();

    const questionData = QUESTIONS[currentQuestionIndex];
    if (!questionData) {
      console.error('No hay pregunta actual');
      return;
    }

    // Verificar si la respuesta es correcta
    const selectedOption = questionData.options[selectedIndex];
    const isCorrect = selectedOption && selectedOption.correct === true;

    // Resaltar la opción correcta
    highlightCorrectOption(questionData);

    // Actualizar estadísticas
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

    // Actualizar el marcador
    updateScoreboard();
    
    // Ir a la siguiente pregunta
    goToNextQuestion();
  }

  function handleTimeout() {
    // Prevenir que se ejecute si ya se respondió
    if (hasAnswered) {
      console.log('Timeout ignorado: ya se respondió');
      return;
    }
    
    // Marcar como respondida inmediatamente
    hasAnswered = true;
    stopTimer();

    // Deshabilitar todas las opciones
    disableOptions();

    const questionData = QUESTIONS[currentQuestionIndex];
    if (!questionData) {
      console.error('No hay pregunta actual en timeout');
      return;
    }

    // Marcar como incorrecta por timeout
    stats.incorrect += 1;
    playSfx(incorrectSfx);
    
    // Resaltar la opción correcta
    highlightCorrectOption(questionData);
    
    if (feedbackPanel) feedbackPanel.textContent = `Se acabó el tiempo. ${questionData.explanation}`;
    
    // Actualizar el marcador
    updateScoreboard();
    
    // Ir a la siguiente pregunta
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

    // Ocultar elementos del quiz
    if (quizHeaderEl) quizHeaderEl.style.display = 'none';
    if (questionCardEl) questionCardEl.style.display = 'none';
    
    // Calcular porcentaje
    const percentage = Math.round((stats.correct / QUESTIONS.length) * 100);
    const passedMessage = passed 
      ? '¡Excelente trabajo! Has demostrado un gran dominio de las matemáticas.'
      : 'No te desanimes. Sigue practicando y mejorarás tus resultados.';
    
    // Crear pantalla de finalización mejorada
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
    
    // Agregar animación de la barra de progreso después de renderizar
    setTimeout(() => {
      const progressFill = document.querySelector('.progress-fill');
      if (progressFill) {
        const finalWidth = progressFill.style.width;
        progressFill.style.width = '0%';
        setTimeout(() => {
          progressFill.style.width = finalWidth;
        }, 100);
      }
    }, 100);

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
