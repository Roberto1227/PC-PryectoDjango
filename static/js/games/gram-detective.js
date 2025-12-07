const DETECTIVE_MUSIC_PATH = '/static/assets/gramatic/gramusic.mp3';
const DETECTIVE_SUCCESS_SOUND = '/static/assets/gramatic/success.mp3';
const DETECTIVE_ERROR_SOUND = '/static/assets/gramatic/error.mp3';

const detectiveLevels = [
  {
    title: 'Nivel 1 · El cuento del faro',
    story: `El viejo faro del acantilado <span class="invalid-word" data-word="0">cantaba</span> luces cada noche para los navegantes distraídos. El farero decía que preparaba <span class="invalid-word" data-word="1">sopa</span> de estrellas y alimentaba a los <span class="invalid-word" data-word="2">turistas</span> que llegaban cansados. Juraba que las olas traían <span class="invalid-word" data-word="3">cohetes</span> brillantes y que las gaviotas enviaban <span class="invalid-word" data-word="4">zanahorias</span> para iluminar la bahía.`,
    words: [
      {
        incorrect: 'cantaba',
        correct: 'proyectaba',
        options: ['cantaba', 'narraba', 'proyectaba', 'saltaba'],
        explanation: 'Los faros proyectan luz para guiar a los navegantes.'
      },
      {
        incorrect: 'sopa',
        correct: 'guía',
        options: ['sopa', 'helado', 'guía', 'dulces'],
        explanation: 'El farero brinda guía, no comida fantástica.'
      },
      {
        incorrect: 'turistas',
        correct: 'marineros',
        options: ['turistas', 'robots', 'marineros', 'cantantes'],
        explanation: 'Los faros ayudan principalmente a los marineros.'
      },
      {
        incorrect: 'cohetes',
        correct: 'destellos',
        options: ['cohetes', 'destellos', 'pelotas', 'nubes'],
        explanation: 'Las olas reflejan destellos de luz, no cohetes.'
      },
      {
        incorrect: 'zanahorias',
        correct: 'señales',
        options: ['zanahorias', 'señales', 'bolsas', 'pinturas'],
        explanation: 'Las gaviotas pueden transportar señales visuales, no zanahorias.'
      }
    ]
  },
  {
    title: 'Nivel 2 · La biblioteca viviente',
    story: `En la biblioteca viviente los libros <span class="invalid-word" data-word="0">saltaban</span> sobre estantes antiguos para saludar a las <span class="invalid-word" data-word="1">lámparas</span> soñolientas. Los estudiantes se sentaban a <span class="invalid-word" data-word="2">dormir</span> mientras las mesas les pedían <span class="invalid-word" data-word="3">patinar</span> en silencio y las bibliotecarias recomendaban <span class="invalid-word" data-word="4">telenovelas</span> para practicar ortografía.`,
    words: [
      {
        incorrect: 'saltaban',
        correct: 'reposaban',
        options: ['saltaban', 'reposaban', 'volaban', 'pintaban'],
        explanation: 'Los libros reposan sobre los estantes.'
      },
      {
        incorrect: 'lámparas',
        correct: 'lectores',
        options: ['lámparas', 'lectores', 'ventanas', 'pisos'],
        explanation: 'Los libros se dirigen a las personas lectoras.'
      },
      {
        incorrect: 'dormir',
        correct: 'leer',
        options: ['dormir', 'cantar', 'leer', 'jugar'],
        explanation: 'En la biblioteca se va a leer, no a dormir.'
      },
      {
        incorrect: 'patinar',
        correct: 'estudiar',
        options: ['patinar', 'estudiar', 'cocinar', 'saltar'],
        explanation: 'Las mesas sirven para estudiar, no para patinar.'
      },
      {
        incorrect: 'telenovelas',
        correct: 'cuentos',
        options: ['telenovelas', 'cuentos', 'canciones', 'mensajes'],
        explanation: 'Para practicar ortografía se recomiendan cuentos.'
      }
    ]
  },
  {
    title: 'Nivel 3 · El bosque musical',
    story: `Cada mañana, los árboles <span class="invalid-word" data-word="0">corrían</span> al lago para tocar <span class="invalid-word" data-word="1">tambores</span> gigantes. Las ardillas organizaban conciertos con música <span class="invalid-word" data-word="2">silenciosa</span>, dirigidos por <span class="invalid-word" data-word="3">robots</span> que repartían partituras a los <span class="invalid-word" data-word="4">televisores</span> escondidos entre los arbustos.`,
    words: [
      {
        incorrect: 'corrían',
        correct: 'se inclinaban',
        options: ['corrían', 'se inclinaban', 'nadaban', 'volaban'],
        explanation: 'Los árboles solo pueden inclinarse con el viento.'
      },
      {
        incorrect: 'tambores',
        correct: 'melodías',
        options: ['tambores', 'melodías', 'caramelos', 'luces'],
        explanation: 'El bosque crea melodías suaves, no tambores metálicos.'
      },
      {
        incorrect: 'silenciosa',
        correct: 'estridente',
        options: ['silenciosa', 'estridente', 'apagada', 'misteriosa'],
        explanation: 'Si los animales se quejan, la música es estridente.'
      },
      {
        incorrect: 'robots',
        correct: 'músicos',
        options: ['robots', 'músicos', 'pájaros', 'arbustos'],
        explanation: 'Los conciertos los dirigen músicos del bosque.'
      },
      {
        incorrect: 'televisores',
        correct: 'instrumentos',
        options: ['televisores', 'instrumentos', 'sillas', 'libros'],
        explanation: 'Las partituras se entregan a instrumentos, no a televisores.'
      }
    ]
  },
  {
    title: 'Nivel 4 · El mercado submarino',
    story: `En el mercado submarino los peces vendían <span class="invalid-word" data-word="0">nubes</span> empaquetadas mientras los buzos probaban <span class="invalid-word" data-word="1">desiertos</span> miniatura. Cada puesto regalaba bolsitas de <span class="invalid-word" data-word="2">arena seca</span>, exhibía collares de <span class="invalid-word" data-word="3">mangueras</span> y estacionaba <span class="invalid-word" data-word="4">autos</span> junto a los arrecifes.`,
    words: [
      {
        incorrect: 'nubes',
        correct: 'algas',
        options: ['nubes', 'algas', 'diamantes', 'sombreros'],
        explanation: 'Bajo el mar se comercian elementos marinos como algas.'
      },
      {
        incorrect: 'desiertos',
        correct: 'corales',
        options: ['desiertos', 'corales', 'lápices', 'aviones'],
        explanation: 'Los buzos buscan corales y tesoros marinos.'
      },
      {
        incorrect: 'arena seca',
        correct: 'perlas',
        options: ['arena seca', 'perlas', 'fósforos', 'mantas'],
        explanation: 'En el fondo del mar no hay arena seca, sí perlas.'
      },
      {
        incorrect: 'mangueras',
        correct: 'conchas',
        options: ['mangueras', 'conchas', 'toallas', 'lámparas'],
        explanation: 'Las joyas marinas se hacen con conchas, no con mangueras.'
      },
      {
        incorrect: 'autos',
        correct: 'barcos',
        options: ['autos', 'barcos', 'medias', 'lunas'],
        explanation: 'En los arrecifes se estacionan barcos, no autos.'
      }
    ]
  },
  {
    title: 'Nivel 5 · El tren del tiempo',
    story: `Un tren de <span class="invalid-word" data-word="0">cartón</span> viajaba por las nubes transportando <span class="invalid-word" data-word="1">minutos</span> derretidos. Para abordar había que mostrar un <span class="invalid-word" data-word="2">sol</span> brillante, pagar con <span class="invalid-word" data-word="3">helado</span> frío y guardar los <span class="invalid-word" data-word="4">globos</span> en el techo del vagón.`,
    words: [
      {
        incorrect: 'cartón',
        correct: 'acero',
        options: ['cartón', 'acero', 'algodón', 'yeso'],
        explanation: 'Los trenes están hechos de materiales resistentes como el acero.'
      },
      {
        incorrect: 'minutos',
        correct: 'carga',
        options: ['minutos', 'carga', 'globos', 'nubes'],
        explanation: 'Los trenes transportan carga o pasajeros, no minutos.'
      },
      {
        incorrect: 'sol',
        correct: 'estación',
        options: ['sol', 'estación', 'planeta', 'volcán'],
        explanation: 'Un tren llega a una estación, no al sol.'
      },
      {
        incorrect: 'helado',
        correct: 'boleto',
        options: ['helado', 'boleto', 'aplauso', 'sombrero'],
        explanation: 'Para subir al tren se presenta un boleto, no helado.'
      },
      {
        incorrect: 'globos',
        correct: 'maletas',
        options: ['globos', 'maletas', 'linternas', 'guitarras'],
        explanation: 'Los pasajeros guardan sus maletas, no globos.'
      }
    ]
  }
];

const totalDetectiveWords = detectiveLevels.reduce(
  (total, level) => total + level.words.length,
  0
);

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
          <h2>Detective de Palabras Prohibidas</h2>
        </div>
        <div class="detective-stats">
          <div class="stat-pill">
            <span>PUNTOS</span>
            <strong id="detective-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>PISTAS</span>
            <strong id="detective-hints">0</strong>
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
      <div class="detective-body">
        <div class="detective-story">
          <h3 id="story-title"></h3>
          <p id="story-text"></p>
        </div>
        <div class="detective-panel">
          <h3>Opciones de reemplazo</h3>
          <div class="option-list" id="option-list">
            <p>Selecciona primero una palabra prohibida del cuento.</p>
          </div>
          <div class="detective-feedback" id="detective-feedback">
            Haz clic en una palabra destacada para comenzar.
          </div>
          <div class="detective-footer">
            <button class="btn-pista" id="btn-hint">
              <i class='bx bx-search-alt'></i> Pista
            </button>
            <button class="btn-validar" id="btn-next" disabled>
              <i class='bx bx-chevrons-right'></i> Siguiente nivel
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
    const level = detectiveLevels[currentLevel];
    document.getElementById('level-progress').textContent =
      `Nivel ${currentLevel + 1} de ${detectiveLevels.length}`;
    document.getElementById('detective-score').textContent = score;
    document.getElementById('detective-hints').textContent = hintsUsed;
    document.getElementById('story-title').textContent = level.title;
    level.words.forEach((word) => {
      word.corrected = false;
    });
    const storyElement = document.getElementById('story-text');
    storyElement.innerHTML = level.story;
    document.getElementById('option-list').innerHTML =
      '<p>Selecciona una palabra prohibida para ver las opciones.</p>';
    document.getElementById('detective-feedback').textContent =
      'Haz clic en una palabra destacada para comenzar.';
    setNextButtonState();
    attachWordEvents();
  }

  function attachWordEvents() {
    const level = detectiveLevels[currentLevel];
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
          <p>Selecciona la opción correcta para reemplazar "<strong>${wordData.incorrect}</strong>":</p>
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
    const level = detectiveLevels[currentLevel];
    const wordData = level.words[selectedWord];
    if (selectedOption === wordData.correct) {
      playFeedbackSound(true);
      score += 10;
      document.getElementById('detective-score').textContent = score;
      document.getElementById('detective-feedback').textContent =
        `¡Correcto! "${wordData.incorrect}" fue reemplazado por "${wordData.correct}".`;
      document.getElementById('detective-feedback').classList.remove('error');
      document.getElementById('detective-feedback').classList.add('success');
      replaceWordInStory(wordData, selectedWord);
      if (isLevelComplete()) {
        document.getElementById('detective-feedback').textContent += ' Nivel completado.';
      }
      setNextButtonState();
    } else {
      playFeedbackSound(false);
      document.getElementById('detective-feedback').textContent = wordData.explanation;
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
    }
    wordData.corrected = true;
    selectedWord = null;
  }

  function useHint() {
    hintsUsed += 1;
    document.getElementById('detective-hints').textContent = hintsUsed;
    const level = detectiveLevels[currentLevel];
    const nextWord = level.words.find((word) => !word.corrected);
    if (nextWord) {
      document.getElementById('detective-feedback').textContent =
        `Pista: busca una palabra que no encaja con la idea central del cuento.`;
      const span = document.querySelector('.invalid-word');
      if (span) {
        document.querySelectorAll('.invalid-word').forEach((el) =>
          el.classList.remove('active')
        );
        span.classList.add('active');
      }
    } else {
      document.getElementById('detective-feedback').textContent =
        'Ya corregiste todas las palabras.';
    }
  }

  function nextLevel() {
    if (currentLevel < detectiveLevels.length - 1) {
      currentLevel += 1;
      loadLevel();
    } else {
      showFinalScreen();
    }
  }

  function isLevelComplete() {
    return detectiveLevels[currentLevel].words.every((word) => word.corrected);
  }

  function setNextButtonState() {
    const btn = document.getElementById('btn-next');
    const finalLevel = currentLevel >= detectiveLevels.length - 1;
    btn.disabled = !isLevelComplete();
    btn.innerHTML = finalLevel ? "<i class='bx bx-flag'></i> Finalizar caso" : "<i class='bx bx-chevrons-right'></i> Siguiente nivel";
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
      let numeroJuego = 3;
      const match = path.match(/gramjuego(\d+)/);
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
          modulo: 'gramatica',
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
            <i class="bx bx-loader-alt" style="font-size: 48px; color: #ff9800; animation: rotate 2s linear infinite;"></i>
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
    
    const backUrl = window.gameConfig?.backUrl || '/gramatica/';
    const isAuthenticated = true;
    const totalDetectiveWords = detectiveLevels.reduce((sum, level) => sum + level.words.length, 0);
    
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
          <p class="complete-message message-animation">Has completado todos los niveles</p>
          ${progressSaved && isAuthenticated ? '<p style="color: #00ff00; font-size: 13px; margin-bottom: 0.5rem;">✅ Progreso guardado correctamente</p>' : ''}
          <div style="background: rgba(255, 152, 0, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(255, 152, 0, 0.3);" class="stats-animation">
            <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
              <i class="bx bx-star" style="color: #ffd700;"></i>
              Puntuación: <span style="color: #ff9800;">${finalScore}</span> puntos
            </p>
            <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
              <i class="bx bx-search-alt" style="color: #ff9800;"></i>
              Pistas usadas: <span style="color: #ff9800;">${hintsUsed}</span>
            </p>
            <p class="complete-time" style="font-size: 16px;">
              <i class="bx bx-check-circle" style="color: #ff9800;"></i>
              Palabras corregidas: <span style="color: #ff9800;">${totalDetectiveWords}</span>
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

