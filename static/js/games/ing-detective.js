const DETECTIVE_MUSIC_PATH = '/static/assets/english/ingmusic.mp3';
const DETECTIVE_SUCCESS_SOUND = '/static/assets/math/acierto.mp3';
const DETECTIVE_ERROR_SOUND = '/static/assets/math/error.mp3';

const detectiveCases = [
  {
    title: 'Case 1 · The Lost Book Mystery',
    story: `In the school library, Emma was looking for her favorite book. She asked the librarian: "Have you <span class="invalid-word" data-word="0">seen</span> my book? I <span class="invalid-word" data-word="1">loose</span> it yesterday." The librarian smiled and said: "Let me <span class="invalid-word" data-word="2">helps</span> you find it. What book <span class="invalid-word" data-word="3">was</span> you looking for?" Emma replied: "It's a book about <span class="invalid-word" data-word="4">animal</span> and adventures."`,
    words: [
      {
        incorrect: 'seen',
        correct: 'see',
        options: ['seen', 'see', 'saw', 'seeing'],
        explanation: 'After "Have you", we use the base form "see" or the past participle "seen". Here "see" is more natural in this question.'
      },
      {
        incorrect: 'loose',
        correct: 'lost',
        options: ['loose', 'lost', 'lose', 'losing'],
        explanation: '"Lost" is the past tense of "lose". "Loose" means not tight.'
      },
      {
        incorrect: 'helps',
        correct: 'help',
        options: ['helps', 'help', 'helped', 'helping'],
        explanation: 'After "Let me", we use the base form of the verb: "help".'
      },
      {
        incorrect: 'was',
        correct: 'are',
        options: ['was', 'are', 'is', 'were'],
        explanation: 'We use "are" with "you" in present tense questions.'
      },
      {
        incorrect: 'animal',
        correct: 'animals',
        options: ['animal', 'animals', 'animales', 'animal\'s'],
        explanation: 'We use plural "animals" when talking about more than one animal.'
      }
    ]
  },
  {
    title: 'Case 2 · The Secret Message',
    story: `Tom found a secret message in his desk. It said: "Meet me at the <span class="invalid-word" data-word="0">parks</span> at 3 PM. Bring your <span class="invalid-word" data-word="1">friend</span> too!" Tom was excited. He <span class="invalid-word" data-word="2">go</span> to the park and saw his friend Sarah. She said: "I <span class="invalid-word" data-word="3">am</span> so happy you came! We have a surprise for you." Tom asked: "What <span class="invalid-word" data-word="4">are</span> the surprise?"`,
    words: [
      {
        incorrect: 'parks',
        correct: 'park',
        options: ['parks', 'park', 'parked', 'parking'],
        explanation: 'We use singular "park" after "the" when referring to a specific location.'
      },
      {
        incorrect: 'friend',
        correct: 'friends',
        options: ['friend', 'friends', 'friendly', 'friendship'],
        explanation: 'Since the message says "your friend too", it implies more than one friend, so "friends" is better.'
      },
      {
        incorrect: 'go',
        correct: 'went',
        options: ['go', 'went', 'goes', 'going'],
        explanation: 'We use "went" (past tense) because Tom already went to the park.'
      },
      {
        incorrect: 'am',
        correct: 'was',
        options: ['am', 'was', 'is', 'are'],
        explanation: 'We use "was" (past tense) because Sarah is talking about how she felt in the past.'
      },
      {
        incorrect: 'are',
        correct: 'is',
        options: ['are', 'is', 'was', 'were'],
        explanation: 'We use "is" (singular) because "surprise" is a singular noun.'
      }
    ]
  },
  {
    title: 'Case 3 · The Birthday Party',
    story: `It was Lisa's birthday party. Her friends <span class="invalid-word" data-word="0">was</span> singing "Happy Birthday". Lisa <span class="invalid-word" data-word="1">blow</span> out the candles and made a wish. Her mom asked: "What <span class="invalid-word" data-word="2">do</span> you wish for?" Lisa smiled and said: "I wish for more <span class="invalid-word" data-word="3">book</span> to read and more <span class="invalid-word" data-word="4">times</span> to play with my friends."`,
    words: [
      {
        incorrect: 'was',
        correct: 'were',
        options: ['was', 'were', 'is', 'are'],
        explanation: 'We use "were" (plural) because "friends" is plural.'
      },
      {
        incorrect: 'blow',
        correct: 'blew',
        options: ['blow', 'blew', 'blows', 'blowing'],
        explanation: 'We use "blew" (past tense) because Lisa already blew out the candles.'
      },
      {
        incorrect: 'do',
        correct: 'did',
        options: ['do', 'did', 'does', 'doing'],
        explanation: 'We use "did" (past tense) in questions about the past.'
      },
      {
        incorrect: 'book',
        correct: 'books',
        options: ['book', 'books', 'book\'s', 'booking'],
        explanation: 'We use plural "books" because Lisa wants more than one book.'
      },
      {
        incorrect: 'times',
        correct: 'time',
        options: ['times', 'time', 'timing', 'timed'],
        explanation: 'We use "time" (uncountable) when talking about duration, not "times" (which means occasions).'
      }
    ]
  },
  {
    title: 'Case 4 · The School Project',
    story: `The students were working on a science project. Maria said: "We need to <span class="invalid-word" data-word="0">collects</span> more information." Her partner Jake replied: "I <span class="invalid-word" data-word="1">has</span> already collected some data. Let's <span class="invalid-word" data-word="2">makes</span> a poster now." Maria agreed: "That's a great <span class="invalid-word" data-word="3">ideas</span>! We can <span class="invalid-word" data-word="4">presents</span> it tomorrow."`,
    words: [
      {
        incorrect: 'collects',
        correct: 'collect',
        options: ['collects', 'collect', 'collected', 'collecting'],
        explanation: 'After "need to", we use the base form "collect".'
      },
      {
        incorrect: 'has',
        correct: 'have',
        options: ['has', 'have', 'had', 'having'],
        explanation: 'We use "have" with "I" in present perfect tense, not "has" (which is for he/she/it).'
      },
      {
        incorrect: 'makes',
        correct: 'make',
        options: ['makes', 'make', 'made', 'making'],
        explanation: 'After "Let\'s", we use the base form "make".'
      },
      {
        incorrect: 'ideas',
        correct: 'idea',
        options: ['ideas', 'idea', 'ideal', 'ideally'],
        explanation: 'We use singular "idea" because we\'re talking about one specific idea.'
      },
      {
        incorrect: 'presents',
        correct: 'present',
        options: ['presents', 'present', 'presented', 'presenting'],
        explanation: 'After "can", we use the base form "present", not "presents" (which is third person singular).'
      }
    ]
  },
  {
    title: 'Case 5 · The Treasure Hunt',
    story: `The children were on a treasure hunt. The first clue said: "Look under the big <span class="invalid-word" data-word="0">trees</span> near the playground." The second clue said: "Count the <span class="invalid-word" data-word="1">step</span> to the library." The third clue said: "Find the <span class="invalid-word" data-word="2">books</span> with a red cover." The children <span class="invalid-word" data-word="3">find</span> the treasure and <span class="invalid-word" data-word="4">was</span> very happy!`,
    words: [
      {
        incorrect: 'trees',
        correct: 'tree',
        options: ['trees', 'tree', 'tree\'s', 'treed'],
        explanation: 'We use singular "tree" after "the big" when referring to a specific tree.'
      },
      {
        incorrect: 'step',
        correct: 'steps',
        options: ['step', 'steps', 'step\'s', 'stepped'],
        explanation: 'We use plural "steps" because you count multiple steps.'
      },
      {
        incorrect: 'books',
        correct: 'book',
        options: ['books', 'book', 'book\'s', 'booking'],
        explanation: 'We use singular "book" after "the" when referring to a specific book.'
      },
      {
        incorrect: 'find',
        correct: 'found',
        options: ['find', 'found', 'finds', 'finding'],
        explanation: 'We use "found" (past tense) because the children already found the treasure.'
      },
      {
        incorrect: 'was',
        correct: 'were',
        options: ['was', 'were', 'is', 'are'],
        explanation: 'We use "were" (plural) because "children" is plural.'
      }
    ]
  }
];

const totalDetectiveWords = detectiveCases.reduce((acc, case_) => acc + case_.words.length, 0);

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;

  let currentLevel = 0;
  let selectedWord = null;
  let score = 0;
  let hintsUsed = 0;
  let bgMusic = null;
  let successSound = null;
  let errorSound = null;
  let audioReady = false;
  let isMuted = false;
  let currentVolume = 0.5;

  renderLayout();
  loadLevel();

  function renderLayout() {
    container.innerHTML = `
      <div class="detective-header">
        <div>
          <p class="round-progress" id="level-progress"></p>
          <h2>English Detective</h2>
        </div>
        <div class="detective-stats">
          <div class="stat-pill">
            <span>POINTS</span>
            <strong id="detective-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>HINTS</span>
            <strong id="detective-hints">0</strong>
          </div>
          <div class="volume-control">
            <button class="volume-toggle" id="volume-toggle" title="Mute/unmute sound">
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
      <div class="detective-body">
        <div class="detective-story">
          <h3 id="story-title"></h3>
          <p id="story-text"></p>
        </div>
        <div class="detective-panel">
          <h3>Replacement Options</h3>
          <div class="option-list" id="option-list">
            <p>First, select an incorrect word from the story.</p>
          </div>
          <div class="detective-feedback" id="detective-feedback">
            Click on a highlighted word to begin.
          </div>
          <div class="detective-footer">
            <button class="btn-pista" id="btn-hint">
              <i class='bx bx-search-alt'></i> Hint
            </button>
            <button class="btn-validar" id="btn-next" disabled>
              <i class='bx bx-chevrons-right'></i> Next Case
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('btn-hint').addEventListener('click', useHint);
    document.getElementById('btn-next').addEventListener('click', nextLevel);
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

  function loadLevel() {
    selectedWord = null;
    const level = detectiveCases[currentLevel];
    document.getElementById('level-progress').textContent =
      `Case ${currentLevel + 1} of ${detectiveCases.length}`;
    document.getElementById('detective-score').textContent = score;
    document.getElementById('detective-hints').textContent = hintsUsed;
    document.getElementById('story-title').textContent = level.title;
    level.words.forEach((word) => {
      word.corrected = false;
    });
    const storyElement = document.getElementById('story-text');
    storyElement.innerHTML = level.story;
    document.getElementById('option-list').innerHTML =
      '<p>Select an incorrect word to see the options.</p>';
    document.getElementById('detective-feedback').textContent =
      'Click on a highlighted word to begin.';
    document.getElementById('detective-feedback').classList.remove('success', 'error');
    setNextButtonState();
    attachWordEvents();
  }

  function attachWordEvents() {
    const level = detectiveCases[currentLevel];
    document.querySelectorAll('.invalid-word').forEach((span) => {
      span.addEventListener('click', () => {
        document.querySelectorAll('.invalid-word').forEach((el) =>
          el.classList.remove('active')
        );
        span.classList.add('active');
        const index = Number(span.getAttribute('data-word'));
        selectedWord = index;
        const optionsContainer = document.getElementById('option-list');
        const wordData = level.words[index];
        const options = shuffleArray(wordData.options);
        optionsContainer.innerHTML = `
          <p>Select the correct option to replace "<strong>${wordData.incorrect}</strong>":</p>
          ${options
            .map(
              (option) =>
                `<button class="option-btn" data-option="${option}">${option}</button>`
            )
            .join('')}
        `;
        optionsContainer.querySelectorAll('.option-btn').forEach((btn) => {
          btn.addEventListener('click', () => handleOptionClick(btn.dataset.option));
        });
      });
    });
  }

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function handleOptionClick(selectedOption) {
    const level = detectiveCases[currentLevel];
    const wordData = level.words[selectedWord];
    if (selectedOption === wordData.correct) {
      playFeedbackSound(true);
      score += 10;
      document.getElementById('detective-score').textContent = score;
      document.getElementById('detective-feedback').textContent =
        `Correct! "${wordData.incorrect}" was replaced by "${wordData.correct}". ${wordData.explanation}`;
      document.getElementById('detective-feedback').classList.remove('error');
      document.getElementById('detective-feedback').classList.add('success');
      replaceWordInStory(wordData, selectedWord);
      if (isLevelComplete()) {
        document.getElementById('detective-feedback').textContent += ' Case completed!';
      }
      setNextButtonState();
    } else {
      playFeedbackSound(false);
      document.getElementById('detective-feedback').textContent = `Incorrect. ${wordData.explanation}`;
      document.getElementById('detective-feedback').classList.remove('success');
      document.getElementById('detective-feedback').classList.add('error');
    }
  }

  function replaceWordInStory(wordData, index) {
    const span = document.querySelector(`.invalid-word[data-word="${index}"]`);
    if (span) {
      span.textContent = wordData.correct;
      span.classList.add('correct-word');
      span.classList.remove('invalid-word', 'active');
      span.setAttribute('data-corrected', 'true');
      span.style.borderBottom = '2px solid rgba(84, 246, 195, 0.9)';
      span.style.color = '#54f6c3';
    }
    wordData.corrected = true;
    selectedWord = null;
  }

  function useHint() {
    hintsUsed += 1;
    document.getElementById('detective-hints').textContent = hintsUsed;
    const level = detectiveCases[currentLevel];
    const nextWord = level.words.find((word) => !word.corrected);
    if (nextWord) {
      document.getElementById('detective-feedback').textContent =
        `Hint: Look for a word that doesn't fit grammatically in the sentence.`;
      document.getElementById('detective-feedback').classList.remove('success', 'error');
      const span = document.querySelector(`.invalid-word[data-word="${level.words.indexOf(nextWord)}"]`);
      if (span) {
        document.querySelectorAll('.invalid-word').forEach((el) =>
          el.classList.remove('active')
        );
        span.classList.add('active');
      }
    } else {
      document.getElementById('detective-feedback').textContent =
        'You have already corrected all the words.';
    }
  }

  function nextLevel() {
    if (currentLevel < detectiveCases.length - 1) {
      currentLevel += 1;
      loadLevel();
    } else {
      showFinalScreen();
    }
  }

  function isLevelComplete() {
    return detectiveCases[currentLevel].words.every((word) => word.corrected);
  }

  function setNextButtonState() {
    const btn = document.getElementById('btn-next');
    const finalLevel = currentLevel >= detectiveCases.length - 1;
    btn.disabled = !isLevelComplete();
    btn.innerHTML = finalLevel ? "<i class='bx bx-flag'></i> Finish Case" : "<i class='bx bx-chevrons-right'></i> Next Case";
  }

  function ensureAudioInstances() {
    if (audioReady) return;
    bgMusic = new Audio(DETECTIVE_MUSIC_PATH);
    bgMusic.loop = true;
    successSound = new Audio(DETECTIVE_SUCCESS_SOUND);
    errorSound = new Audio(DETECTIVE_ERROR_SOUND);
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
      let numeroJuego = 2;
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
            <i class="bx bx-loader-alt" style="font-size: 48px; color: #9c27b0; animation: rotate 2s linear infinite;"></i>
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
    
    const backUrl = window.gameConfig?.backUrl || '/ingles/';
    const isAuthenticated = true;
    const totalDetectiveWords = detectiveCases.reduce((sum, case_) => sum + case_.words.length, 0);
    
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
          <p class="complete-message message-animation">Has completado todos los casos</p>
          ${progressSaved && isAuthenticated ? '<p style="color: #00ff00; font-size: 13px; margin-bottom: 0.5rem;">✅ Progreso guardado correctamente</p>' : ''}
          <div style="background: rgba(156, 39, 176, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(156, 39, 176, 0.3);" class="stats-animation">
            <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
              <i class="bx bx-star" style="color: #ffd700;"></i>
              Puntuación: <span style="color: #9c27b0;">${finalScore}</span> puntos
            </p>
            <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
              <i class="bx bx-search-alt" style="color: #9c27b0;"></i>
              Pistas usadas: <span style="color: #9c27b0;">${hintsUsed}</span>
            </p>
            <p class="complete-time" style="font-size: 16px;">
              <i class="bx bx-check-circle" style="color: #9c27b0;"></i>
              Palabras corregidas: <span style="color: #9c27b0;">${totalDetectiveWords}</span>
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

