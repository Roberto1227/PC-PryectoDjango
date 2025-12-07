document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.reto-hero-section');
  const quizSection = document.getElementById('reto-quiz-section');
  const resultsSection = document.getElementById('reto-results-section');
  const startBtn = document.getElementById('start-reto');
  const submitBtn = document.getElementById('submit-answer');
  const jokerBtn = document.getElementById('use-joker');
  const questionTopicEl = document.getElementById('reto-question-topic');
  const topicTextEl = document.getElementById('topic-text');
  const questionTextEl = document.getElementById('reto-question-text');
  const optionsGrid = document.getElementById('reto-options-grid');
  const questionNumberEl = document.getElementById('question-number');
  const totalTimerEl = document.getElementById('total-timer');
  const jokersGrid = document.getElementById('jokers-grid');
  const retoAudio = document.getElementById('reto-audio');

  const TOTAL_TIME = 30 * 60; // 30 minutos en segundos
  const PASSING_SCORE = 18; // Mínimo 18 aciertos
  const TOTAL_QUESTIONS = 26;
  const TOTAL_JOKERS = 4;
  const COLOR_CLASSES = ['mint', 'lime', 'orange', 'purple'];
  const SILENCE_DURATION = 10; // 10 segundos de silencio

  // 26 preguntas distribuidas entre los 4 módulos (sobre temas, no sobre juegos)
  const QUESTIONS = [
    // Matemáticas (7 preguntas)
    {
      topic: 'Matemáticas - Secuencias Numéricas',
      icon: 'bx bx-math',
      question: '¿Qué número sigue en la secuencia 3, 6, 9, __?',
      options: ['11', '12', '14', '15'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Matemáticas - Suma',
      icon: 'bx bx-calculator',
      question: '¿Cuál es el resultado de 8 + 7?',
      options: ['13', '14', '15', '16'].map((text, idx) => ({ text, correct: idx === 2 })),
    },
    {
      topic: 'Matemáticas - Multiplicación',
      icon: 'bx bx-math',
      question: '¿Cuánto es 4 × 6?',
      options: ['18', '20', '24', '26'].map((text, idx) => ({ text, correct: idx === 2 })),
    },
    {
      topic: 'Matemáticas - División',
      icon: 'bx bx-calculator',
      question: '¿Cuál es el resultado de 24 ÷ 6?',
      options: ['3', '4', '5', '6'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Matemáticas - Patrones',
      icon: 'bx bx-math',
      question: 'Completa la serie: 10, 15, 20, __, 30.',
      options: ['22', '23', '24', '25'].map((text, idx) => ({ text, correct: idx === 3 })),
    },
    {
      topic: 'Matemáticas - Operaciones Básicas',
      icon: 'bx bx-brain',
      question: '¿Qué pareja de números suma 14?',
      options: ['7 + 4', '6 + 8', '9 + 3', '5 + 6'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Matemáticas - Geometría',
      icon: 'bx bx-shape-polygon',
      question: 'Un triángulo tiene 3 lados y un cuadrado tiene 4 lados. ¿Cuánto es 3 + 4?',
      options: ['5', '6', '7', '8'].map((text, idx) => ({ text, correct: idx === 2 })),
    },
    // Ciencias (7 preguntas)
    {
      topic: 'Ciencias - Fotosíntesis',
      icon: 'bx bx-leaf',
      question: '¿Qué proceso realizan las plantas para producir su alimento usando luz solar?',
      options: ['Fotosíntesis', 'Respiración', 'Digestión', 'Circulación'].map((text, idx) => ({ text, correct: idx === 0 })),
    },
    {
      topic: 'Ciencias - Ecosistemas',
      icon: 'bx bx-atom',
      question: '¿Qué término describe el conjunto de seres vivos y el lugar donde viven?',
      options: ['Ecosistema', 'Hábitat', 'Biósfera', 'Comunidad'].map((text, idx) => ({ text, correct: idx === 0 })),
    },
    {
      topic: 'Ciencias - Herramientas Científicas',
      icon: 'bx bx-atom',
      question: '¿Qué instrumento se utiliza para observar objetos muy pequeños como células?',
      options: ['Telescopio', 'Microscopio', 'Binoculares', 'Lupa'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Ciencias - Clasificación de Seres Vivos',
      icon: 'bx bx-leaf',
      question: '¿A qué reino pertenecen los árboles?',
      options: ['Reino Animal', 'Reino Planta', 'Reino Fúngico', 'Reino Eucariota'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Ciencias - Astronomía',
      icon: 'bx bx-planet',
      question: '¿Cuál es el planeta más cercano al Sol en nuestro sistema solar?',
      options: ['Venus', 'Mercurio', 'Tierra', 'Marte'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Ciencias - Anatomía Humana',
      icon: 'bx bx-body',
      question: '¿Cuántos huesos tiene aproximadamente el cuerpo humano adulto?',
      options: ['156', '206', '256', '306'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Ciencias - Clasificación Animal',
      icon: 'bx bx-leaf',
      question: '¿Cuál de estos animales es un mamífero?',
      options: ['Pez', 'Ave', 'Perro', 'Reptil'].map((text, idx) => ({ text, correct: idx === 2 })),
    },
    // Gramática (6 preguntas)
    {
      topic: 'Gramática - Sustantivos',
      icon: 'bx bx-book',
      question: '¿Cuál de estas palabras es un sustantivo común?',
      options: ['brillante', 'correr', 'montaña', 'feliz'].map((text, idx) => ({ text, correct: idx === 2 })),
    },
    {
      topic: 'Gramática - Adjetivos',
      icon: 'bx bx-book',
      question: '¿Cuál de estas palabras es un adjetivo que describe una cualidad?',
      options: ['suave', 'cantar', 'bosque', 'salté'].map((text, idx) => ({ text, correct: idx === 0 })),
    },
    {
      topic: 'Gramática - Verbos',
      icon: 'bx bx-book',
      question: '¿Cuál de estas palabras es un verbo que indica una acción?',
      options: ['amistad', 'descubrir', 'azul', 'valiente'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Gramática - Construcción de Oraciones',
      icon: 'bx bx-book',
      question: '¿Cuál de estas oraciones usa correctamente la palabra "honesto"?',
      options: [
        'Honesto siempre digo la verdad.',
        'Soy honesto cuando explico lo que pasó.',
        'Honesto somos cuando jugamos.',
        'Honesto dijo la maestra que soy.'
      ].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Gramática - Ortografía y Puntuación',
      icon: 'bx bx-book',
      question: '¿Cuál de estas oraciones tiene la mayúscula inicial y el punto final correctos?',
      options: [
        'mariposas vuelan sobre el jardín',
        'Las mariposas vuelan sobre el jardín.',
        'las mariposas vuelan sobre el jardín?',
        'Las mariposas vuelan sobre el jardín'
      ].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Gramática - Clasificación de Palabras',
      icon: 'bx bx-grid-alt',
      question: '¿Qué tipo de palabra es "correr"?',
      options: ['Sustantivo', 'Verbo', 'Adjetivo', 'Adverbio'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    // Inglés (6 preguntas)
    {
      topic: 'Inglés - Presente Simple',
      icon: 'bx bx-world',
      question: 'Completa la oración: "I ___ breakfast every morning."',
      options: ['eats', 'eat', 'eating', 'ate'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Inglés - Vocabulario - Partes de la Casa',
      icon: 'bx bx-world',
      question: '¿En qué habitación de la casa se cocina la comida?',
      options: ['Bedroom', 'Kitchen', 'Bathroom', 'Living room'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
    {
      topic: 'Inglés - Vocabulario - Muebles',
      icon: 'bx bx-world',
      question: 'Completa: "My ___ is in the bedroom."',
      options: ['book', 'car', 'bed', 'dog'].map((text, idx) => ({ text, correct: idx === 2 })),
    },
    {
      topic: 'Inglés - Gramática - Verbo To Be',
      icon: 'bx bx-world',
      question: '¿Cuál es la forma correcta de esta oración? "The cat are sleeping."',
      options: [
        'The cat is sleeping.',
        'The cat am sleeping.',
        'The cat be sleeping.',
        'The cat was sleeping.'
      ].map((text, idx) => ({ text, correct: idx === 0 })),
    },
    {
      topic: 'Inglés - Presente Simple',
      icon: 'bx bx-world',
      question: 'Corrige esta oración: "I goes to school every day."',
      options: [
        'I go to school every day.',
        'I going to school every day.',
        'I went to school every day.',
        'I gone to school every day.'
      ].map((text, idx) => ({ text, correct: idx === 0 })),
    },
    {
      topic: 'Inglés - Colores',
      icon: 'bx bx-world',
      question: '¿Qué color se obtiene al mezclar rojo y azul?',
      options: ['Green', 'Purple', 'Orange', 'Yellow'].map((text, idx) => ({ text, correct: idx === 1 })),
    },
  ];

  // Estado del quiz
  let currentQuestionIndex = 0;
  let selectedAnswer = null;
  let answers = []; // Array para guardar las respuestas
  let jokersUsed = [false, false, false, false]; // Array para rastrear qué comodines se han usado
  let totalTimeLeft = TOTAL_TIME;
  let totalTimerInterval = null;
  let audioPlaying = false;
  let audioStartTime = 0;

  // Mezclar preguntas aleatoriamente
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Mezclar las preguntas al inicio
  const shuffledQuestions = shuffleArray(QUESTIONS);

  // Control de audio con silencio
  function playBackgroundMusic() {
    if (!retoAudio) return;
    
    retoAudio.volume = 0.3;
    retoAudio.loop = false;
    audioPlaying = true;
    
    function playWithSilence() {
      if (!audioPlaying) return;
      
      retoAudio.currentTime = 0;
      retoAudio.play().then(() => {
        audioStartTime = Date.now();
        
        // Cuando termine el audio, esperar 10 segundos y reproducir de nuevo
        retoAudio.onended = () => {
          if (audioPlaying) {
            setTimeout(() => {
              if (audioPlaying) {
                playWithSilence();
              }
            }, SILENCE_DURATION * 1000);
          }
        };
      }).catch(() => {
        // Si falla la reproducción, intentar de nuevo después del silencio
        if (audioPlaying) {
          setTimeout(() => {
            if (audioPlaying) {
              playWithSilence();
            }
          }, SILENCE_DURATION * 1000);
        }
      });
    }
    
    playWithSilence();
  }

  function stopBackgroundMusic() {
    if (retoAudio) {
      audioPlaying = false;
      retoAudio.pause();
      retoAudio.currentTime = 0;
    }
  }

  // Timer principal
  function startTotalTimer() {
    totalTimerInterval = setInterval(() => {
      totalTimeLeft--;
      updateTotalTimer();
      
      if (totalTimeLeft <= 0) {
        stopTotalTimer();
        finishQuiz();
      }
    }, 1000);
  }

  function stopTotalTimer() {
    if (totalTimerInterval) {
      clearInterval(totalTimerInterval);
      totalTimerInterval = null;
    }
  }

  function updateTotalTimer() {
    const minutes = Math.floor(totalTimeLeft / 60);
    const seconds = totalTimeLeft % 60;
    totalTimerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (totalTimeLeft <= 300) { // 5 minutos restantes
      totalTimerEl.parentElement.style.borderColor = 'rgba(248, 113, 113, 0.6)';
      totalTimerEl.parentElement.style.boxShadow = '0 0 20px rgba(248, 113, 113, 0.4)';
    }
  }

  // Renderizar pregunta
  function renderQuestion() {
    if (currentQuestionIndex >= shuffledQuestions.length) {
      finishQuiz();
      return;
    }

    const question = shuffledQuestions[currentQuestionIndex];
    selectedAnswer = null;
    
    // Actualizar tema
    const topicIcon = questionTopicEl.querySelector('i');
    if (topicIcon) {
      topicIcon.className = question.icon;
    }
    topicTextEl.textContent = question.topic;
    
    // Actualizar texto de pregunta
    questionTextEl.textContent = question.question;
    
    // Actualizar número de pregunta
    questionNumberEl.textContent = `${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`;
    
    // Limpiar opciones
    optionsGrid.innerHTML = '';
    
    // Crear opciones
    question.options.forEach((option, idx) => {
      const optionCard = document.createElement('button');
      optionCard.className = `reto-option-card ${COLOR_CLASSES[idx]}`;
      optionCard.dataset.index = idx;
      optionCard.dataset.correct = option.correct;
      
      optionCard.innerHTML = `
        <div class="reto-option-letter">${String.fromCharCode(65 + idx)}</div>
        <div class="reto-option-text">${option.text}</div>
      `;
      
      optionCard.addEventListener('click', () => selectOption(optionCard, idx));
      optionsGrid.appendChild(optionCard);
    });
    
    // Resetear botones
    submitBtn.classList.add('hidden');
    updateJokersDisplay();
  }

  // Seleccionar opción
  function selectOption(optionCard, index) {
    // Remover selección anterior
    document.querySelectorAll('.reto-option-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Marcar como seleccionada
    optionCard.classList.add('selected');
    selectedAnswer = index;
    
    // Mostrar botón de enviar
    submitBtn.classList.remove('hidden');
  }

  // Actualizar visualización de comodines
  function updateJokersDisplay() {
    const jokerIcons = jokersGrid.querySelectorAll('.reto-joker-icon');
    jokerIcons.forEach((icon, index) => {
      if (jokersUsed[index]) {
        icon.classList.remove('active');
        icon.classList.add('used');
      } else {
        icon.classList.remove('used');
        icon.classList.add('active');
      }
    });
    
    // Actualizar botón de comodín
    const hasAvailableJokers = jokersUsed.some(used => !used);
    jokerBtn.disabled = !hasAvailableJokers;
    if (!hasAvailableJokers) {
      jokerBtn.style.opacity = '0.5';
    }
  }

  // Usar comodín 50/50
  function useJoker() {
    // Encontrar el primer comodín disponible
    const availableJokerIndex = jokersUsed.findIndex(used => !used);
    if (availableJokerIndex === -1) return;
    
    const question = shuffledQuestions[currentQuestionIndex];
    const correctIndex = question.options.findIndex(opt => opt.correct);
    const incorrectOptions = question.options
      .map((opt, idx) => ({ opt, idx }))
      .filter(({ opt, idx }) => !opt.correct && idx !== correctIndex);
    
    // Seleccionar 2 opciones incorrectas aleatoriamente para eliminar
    const toRemove = [];
    while (toRemove.length < 2 && incorrectOptions.length > 0) {
      const randomIdx = Math.floor(Math.random() * incorrectOptions.length);
      toRemove.push(incorrectOptions[randomIdx].idx);
      incorrectOptions.splice(randomIdx, 1);
    }
    
    // Deshabilitar las opciones seleccionadas
    toRemove.forEach(idx => {
      const optionCard = optionsGrid.querySelector(`[data-index="${idx}"]`);
      if (optionCard) {
        optionCard.classList.add('disabled');
        optionCard.disabled = true;
      }
    });
    
    // Marcar el comodín como usado
    jokersUsed[availableJokerIndex] = true;
    updateJokersDisplay();
  }

  // Enviar respuesta
  function submitAnswer() {
    if (selectedAnswer === null) return;
    
    const question = shuffledQuestions[currentQuestionIndex];
    const isCorrect = question.options[selectedAnswer].correct;
    
    // Guardar respuesta
    answers.push({
      questionIndex: currentQuestionIndex,
      selectedAnswer: selectedAnswer,
      correct: isCorrect,
      question: question
    });
    
    // Avanzar a la siguiente pregunta
    currentQuestionIndex++;
    
    if (currentQuestionIndex < shuffledQuestions.length) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  // Finalizar quiz
  function finishQuiz() {
    stopTotalTimer();
    stopBackgroundMusic();
    
    // Si hay preguntas sin responder, marcarlas como incorrectas
    while (answers.length < shuffledQuestions.length) {
      const question = shuffledQuestions[answers.length];
      answers.push({
        questionIndex: answers.length,
        selectedAnswer: null,
        correct: false,
        question: question
      });
    }
    
    quizSection.classList.remove('active');
    resultsSection.classList.remove('hidden');
    
    const correctCount = answers.filter(a => a.correct).length;
    const incorrectCount = answers.filter(a => !a.correct).length;
    const percentage = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    
    // Actualizar estadísticas
    document.getElementById('final-correct').textContent = correctCount;
    document.getElementById('final-incorrect').textContent = incorrectCount;
    document.getElementById('final-percentage').textContent = `${percentage}%`;
    
    // Determinar si pasó
    const passed = correctCount >= PASSING_SCORE;
    
    // Actualizar mensaje y acciones
    const resultsIcon = document.getElementById('results-icon');
    const resultsTitle = document.getElementById('results-title');
    const resultsMessage = document.getElementById('results-message');
    const resultsActions = document.getElementById('results-actions');
    
    if (passed) {
      resultsIcon.className = 'bx bx-trophy';
      resultsIcon.style.color = '#ffd700';
      resultsTitle.textContent = '¡Felicitaciones! Has Aprobado';
      resultsMessage.innerHTML = `
        <p style="color: #4fd1c5; font-weight: 700; font-size: 1.4rem; margin-bottom: 1rem;">
          ¡Excelente trabajo! Has completado el Reto Final con éxito.
        </p>
        <p>Obtuviste <strong style="color: #4fd1c5;">${correctCount} aciertos</strong> de ${TOTAL_QUESTIONS} preguntas.</p>
        <p>Has demostrado un gran dominio de los conocimientos en Matemáticas, Ciencias, Gramática e Inglés.</p>
        <p style="margin-top: 1.5rem; font-size: 1.1rem; color: #ffd700;">
          ¡Es hora de recibir tu diploma!
        </p>
      `;
      resultsActions.innerHTML = `
        <a href="Diploma/diploma.html" class="button reto-btn-primary">
          <i class="bx bx-trophy"></i>
          Ver Mi Diploma
        </a>
      `;
    } else {
      resultsIcon.className = 'bx bx-x-circle';
      resultsIcon.style.color = '#f87171';
      resultsTitle.textContent = 'No Has Aprobado Esta Vez';
      resultsMessage.innerHTML = `
        <p style="color: #f87171; font-weight: 700; font-size: 1.4rem; margin-bottom: 1rem;">
          Necesitas al menos ${PASSING_SCORE} aciertos para aprobar.
        </p>
        <p>Obtuviste <strong style="color: #f87171;">${correctCount} aciertos</strong> de ${TOTAL_QUESTIONS} preguntas.</p>
        <p>No te desanimes, puedes intentarlo de nuevo. ¡Sigue practicando y vuelve a intentarlo!</p>
      `;
      resultsActions.innerHTML = `
        <button class="button reto-btn-primary" id="retry-reto">
          <i class="bx bx-refresh"></i>
          Intentar de Nuevo
        </button>
        <a href="materias.html" class="button reto-btn secondary">
          <i class="bx bx-arrow-back"></i>
          Volver a Materias
        </a>
      `;
      
      // Agregar listener para reintentar
      setTimeout(() => {
        const retryBtn = document.getElementById('retry-reto');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            location.reload();
          });
        }
      }, 100);
    }
    
    // Mostrar preguntas correctas e incorrectas
    const correctQuestions = answers.filter(a => a.correct);
    const incorrectQuestions = answers.filter(a => !a.correct);
    
    if (correctQuestions.length > 0) {
      const correctDiv = document.createElement('div');
      correctDiv.style.marginTop = '2rem';
      correctDiv.style.textAlign = 'left';
      correctDiv.innerHTML = `
        <h3 style="color: #4fd1c5; margin-bottom: 1rem;">Preguntas Correctas (${correctQuestions.length}):</h3>
        <ul style="list-style: none; padding: 0;">
          ${correctQuestions.map((a, idx) => `
            <li style="margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(79, 209, 197, 0.1); border-radius: 8px;">
              ${idx + 1}. ${a.question.question}
            </li>
          `).join('')}
        </ul>
      `;
      resultsMessage.appendChild(correctDiv);
    }
    
    if (incorrectQuestions.length > 0) {
      const incorrectDiv = document.createElement('div');
      incorrectDiv.style.marginTop = '2rem';
      incorrectDiv.style.textAlign = 'left';
      incorrectDiv.innerHTML = `
        <h3 style="color: #f87171; margin-bottom: 1rem;">Preguntas Incorrectas (${incorrectQuestions.length}):</h3>
        <ul style="list-style: none; padding: 0;">
          ${incorrectQuestions.map((a, idx) => `
            <li style="margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(248, 113, 113, 0.1); border-radius: 8px;">
              ${idx + 1}. ${a.question.question}
            </li>
          `).join('')}
        </ul>
      `;
      resultsMessage.appendChild(incorrectDiv);
    }
  }

  // Iniciar reto
  function startReto() {
    heroSection.style.display = 'none';
    quizSection.classList.add('active');
    
    // Resetear estado
    currentQuestionIndex = 0;
    selectedAnswer = null;
    answers = [];
    jokersUsed = [false, false, false, false];
    totalTimeLeft = TOTAL_TIME;
    
    // Actualizar UI
    updateJokersDisplay();
    jokerBtn.style.opacity = '1';
    updateTotalTimer();
    
    // Iniciar timer y música
    startTotalTimer();
    playBackgroundMusic();
    
    // Renderizar primera pregunta
    renderQuestion();
  }

  // Event listeners
  startBtn.addEventListener('click', () => {
    // Activar audio con interacción del usuario
    if (retoAudio) {
      retoAudio.play().catch(() => {});
    }
    startReto();
  });

  submitBtn.addEventListener('click', submitAnswer);
  jokerBtn.addEventListener('click', useJoker);

  // Inicializar timer display
  updateTotalTimer();
});

