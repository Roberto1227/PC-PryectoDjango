// Datos de los cuerpos celestes en orden desde el sol
// Tamaños basados en proporciones reales (escalados para el juego)
const celestialBodies = [
  { id: 'sol', name: 'Sol', image: 'sol.png', size: 180, orbit: 0, x: 50, y: 50, isSun: true },
  { id: 'mercurio', name: 'Mercurio', image: 'mercurio.png', size: 38, orbit: 1, x: 50, y: 50 },
  { id: 'venus', name: 'Venus', image: 'venus.png', size: 50, orbit: 2, x: 50, y: 50 },
  { id: 'tierra', name: 'Tierra', image: 'tierra.png', size: 52, orbit: 3, x: 50, y: 50 },
  { id: 'marte', name: 'Marte', image: 'marte.png', size: 42, orbit: 4, x: 50, y: 50 },
  { id: 'jupiter', name: 'Júpiter', image: 'jupiter.png', size: 110, orbit: 5, x: 50, y: 50 },
  { id: 'saturno', name: 'Saturno', image: 'saturno.png', size: 95, orbit: 6, x: 50, y: 50 },
  { id: 'urano', name: 'Urano', image: 'urano.png', size: 65, orbit: 7, x: 50, y: 50 },
  { id: 'neptuno', name: 'Neptuno', image: 'neptuno.png', size: 60, orbit: 8, x: 50, y: 50 },
  { id: 'pluton', name: 'Plutón', image: 'pluton.png', size: 22, orbit: 9, x: 50, y: 50 },
  { id: 'luna', name: 'Luna', image: 'luna.png', size: 20, orbit: 3.5, x: 50, y: 50, isMoon: true }
];

// Datos curiosos sobre los cuerpos celestes
const celestialFacts = {
  'sol': [
    'Es una estrella que contiene el 99.86% de la masa del sistema solar.',
    'Su temperatura en el núcleo es de aproximadamente 15 millones de grados Celsius.',
    'Produce energía mediante fusión nuclear de hidrógeno a helio.'
  ],
  'mercurio': [
    'Es el planeta más cercano al Sol y el más pequeño del sistema solar.',
    'Tiene temperaturas extremas: 430°C de día y -170°C de noche.',
    'Un día en Mercurio dura más que su año (176 días terrestres).'
  ],
  'venus': [
    'Es el planeta más caliente del sistema solar, con 462°C.',
    'Rota en sentido contrario a la mayoría de planetas (rotación retrógrada).',
    'Tiene una atmósfera densa de dióxido de carbono que causa efecto invernadero extremo.'
  ],
  'tierra': [
    'Es el único planeta conocido con vida.',
    'Tiene agua líquida en su superficie, esencial para la vida.',
    'Su atmósfera contiene 21% de oxígeno, único en el sistema solar.'
  ],
  'luna': [
    'Es el único satélite natural de la Tierra.',
    'Su gravedad causa las mareas en los océanos terrestres.',
    'Se está alejando de la Tierra aproximadamente 3.8 cm por año.'
  ],
  'marte': [
    'Es conocido como el "planeta rojo" por su color oxidado.',
    'Tiene el volcán más grande del sistema solar: el Monte Olimpo.',
    'Tiene dos lunas pequeñas: Fobos y Deimos.'
  ],
  'jupiter': [
    'Es el planeta más grande del sistema solar.',
    'Tiene la Gran Mancha Roja, una tormenta más grande que la Tierra.',
    'Tiene más de 80 lunas conocidas, incluyendo las cuatro lunas galileanas.'
  ],
  'saturno': [
    'Es famoso por sus anillos visibles, compuestos principalmente de hielo y roca.',
    'Es menos denso que el agua, flotaría en un océano gigante.',
    'Tiene más de 80 lunas, incluyendo Titán, más grande que Mercurio.'
  ],
  'urano': [
    'Rota de lado, con su eje inclinado 98 grados.',
    'Es un planeta gaseoso de color azul-verde debido al metano en su atmósfera.',
    'Tiene anillos verticales únicos en el sistema solar.'
  ],
  'neptuno': [
    'Es el planeta más lejano del Sol en el sistema solar.',
    'Tiene los vientos más fuertes del sistema solar, hasta 2,100 km/h.',
    'Fue el primer planeta descubierto mediante cálculos matemáticos.'
  ],
  'pluton': [
    'Fue reclasificado como planeta enano en 2006.',
    'Tiene una órbita muy elíptica que lo acerca y aleja del Sol.',
    'Tiene cinco lunas conocidas, siendo Caronte la más grande.'
  ]
};

// Estado del juego
let gameState = {
  currentLevel: 1, // 1: Colocar planetas, 2: Preguntas sobre datos curiosos
  placedPlanets: {},
  answeredQuestions: {}, // Cambiar de placedNames a answeredQuestions
  currentQuestionIndex: 0,
  questions: [],
  backgroundMusic: null,
  victorySound: null,
  musicVolume: 0.5,
  gameCompleted: false
};

// Configuración de órbitas (porcentajes desde el centro) - Reducidos para que quepan todas en pantalla
const orbitRadii = {
  0: 0,   // Sol (centro)
  1: 8,   // Mercurio
  2: 12,  // Venus
  3: 16,  // Tierra
  3.5: 18, // Luna (cerca de la Tierra, debajo)
  4: 20,  // Marte
  5: 25,  // Júpiter
  6: 30,  // Saturno
  7: 35,  // Urano
  8: 40,  // Neptuno
  9: 44   // Plutón
};

// Ángulos para posicionar planetas en órbitas
const orbitAngles = {
  1: 0,    // Mercurio
  2: 40,   // Venus
  3: 80,   // Tierra
  3.5: 170, // Luna (debajo de la Tierra, 90° más abajo)
  4: 120,  // Marte
  5: 160,  // Júpiter
  6: 200,  // Saturno
  7: 240,  // Urano
  8: 280,  // Neptuno
  9: 320   // Plutón
};

function initGame() {
  // Esperar un momento para asegurar que gameConfig esté disponible
  if (!window.gameConfig) {
    console.warn('gameConfig no disponible aún, esperando...');
    setTimeout(initGame, 100);
    return;
  }
  console.log('Inicializando juego solar con config:', window.gameConfig);
  renderLayout();
}

function renderLayout() {
  const container = document.getElementById('game-container');
  if (!container) return;

  container.innerHTML = `
    <div class="game-wrapper">
      <div class="game-layout">
        <div class="left-panel">
          <div class="left-header">
            <h2 class="game-title">
              <i class="bx bx-planet"></i>
              El Sistema Solar
            </h2>
            <div class="left-controls">
              <button class="info-icon" id="info-btn" title="¡Haz clic para ver las instrucciones!">
                <i class="bx bx-info-circle"></i>
                <span class="info-text">Instrucciones</span>
              </button>
              <button class="fullscreen-icon" id="fullscreen-btn" title="Pantalla completa">
                <i class="fas fa-expand" id="fullscreen-icon-inner"></i>
              </button>
              <div class="music-control" id="music-control" title="Control de música">
                <i class="bx bx-volume-full" id="music-icon"></i>
                <input type="range" id="volume-slider" min="0" max="100" value="${gameState.musicVolume * 100}" class="volume-slider" />
              </div>
            </div>
          </div>
          <div class="level-indicator" id="level-indicator">
            Nivel 1: Coloca los planetas en sus órbitas
          </div>
          <div class="instructions-panel" id="instructions-panel">
            <h3>Instrucciones</h3>
            <div id="instructions-content"></div>
          </div>
          <div class="celestial-panel">
            <h3 id="panel-title">Cuerpos Celestes</h3>
            <div class="celestial-items" id="celestial-items"></div>
          </div>
        </div>
        <div class="solar-system-area" id="solar-system-area">
          <div class="solar-system-canvas" id="solar-canvas"></div>
        </div>
      </div>

      <div class="feedback-message" id="feedback-message"></div>
    </div>
  `;

  setupEventListeners();
  renderLevel();
  initAudio();
}

function setupEventListeners() {
  const infoBtn = document.getElementById('info-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  if (infoBtn) {
    infoBtn.addEventListener('click', toggleInstructions);
  }
  
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }
  
  setupVolumeControl();
  updateInstructions();
}

function toggleInstructions() {
  const panel = document.getElementById('instructions-panel');
  if (panel) {
    // Toggle entre mostrar y ocultar
    panel.classList.toggle('show');
    panel.classList.toggle('collapsed');
    
    // Si se está mostrando, asegurar que no tenga la clase collapsed
    if (panel.classList.contains('show')) {
      panel.classList.remove('collapsed');
    }
  }
}

function updateInstructions() {
  const content = document.getElementById('instructions-content');
  if (!content) return;
  
  const level = gameState.currentLevel;
  const instructions = level === 1 
    ? `
      <ul>
        <li>Arrastra el Sol desde el panel hasta el centro del sistema solar.</li>
        <li>Luego arrastra los planetas en orden: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón.</li>
        <li>La Luna va a la par de la Tierra en su órbita.</li>
        <li>Cuando coloques el Sol correctamente, su contorno brillará.</li>
      </ul>
    `
    : `
      <ul>
        <li>Arrastra los nombres desde el panel lateral hasta cada planeta.</li>
        <li>Cada nombre debe ir en su planeta correspondiente.</li>
        <li>Completa todos los nombres para finalizar el juego.</li>
      </ul>
    `;
  
  content.innerHTML = instructions;
}


function renderLevel() {
  updateInstructions();
  if (gameState.currentLevel === 1) {
    renderLevel1();
  } else {
    renderLevel2();
  }
}

function renderLevel1() {
  const levelIndicator = document.getElementById('level-indicator');
  const panelTitle = document.getElementById('panel-title');
  const celestialItems = document.getElementById('celestial-items');
  const solarCanvas = document.getElementById('solar-canvas');
  
  if (levelIndicator) {
    levelIndicator.textContent = 'Nivel 1: Coloca los planetas en sus órbitas';
  }
  
  if (panelTitle) {
    panelTitle.textContent = 'Cuerpos Celestes';
  }
  
  // Renderizar planetas disponibles (incluyendo el sol)
  if (celestialItems) {
    const availableBodies = celestialBodies.filter(c => !gameState.placedPlanets[c.id]);
    celestialItems.innerHTML = availableBodies.map(c => {
      // Tamaño máximo para mostrar en el panel (escalado)
      const panelSize = Math.min(c.size, 70);
      return `
        <div class="celestial-item" data-celestial="${c.id}" draggable="true">
          <img src="/static/assets/ciencias/planetas/${c.image}" alt="${c.name}" style="max-width: ${panelSize}px; max-height: ${panelSize}px;">
          <div style="margin-top: 0.25rem; font-size: 0.85rem;">${c.name}</div>
        </div>
      `;
    }).join('');
  }
  
  // Renderizar sistema solar con órbitas
  if (solarCanvas) {
    solarCanvas.innerHTML = '';
    
    // Crear zona de drop para el Sol en el centro
    const sunDropZone = document.createElement('div');
    sunDropZone.className = 'sun-drop-zone';
    sunDropZone.dataset.orbit = '0';
    sunDropZone.style.width = '150px';
    sunDropZone.style.height = '150px';
    sunDropZone.style.left = '50%';
    sunDropZone.style.top = '50%';
    sunDropZone.style.transform = 'translate(-50%, -50%)';
    solarCanvas.appendChild(sunDropZone);
    
    // Crear órbitas y zonas de drop
    Object.keys(orbitRadii).forEach(orbitKey => {
      const orbitNum = parseFloat(orbitKey);
      if (orbitNum == 0) return; // El sol tiene su propia zona
      const radius = orbitRadii[orbitKey];
      const angle = orbitAngles[orbitKey] || 0;
      
      // Crear órbita visual (usar porcentajes más pequeños para que quepan todas)
      const orbit = document.createElement('div');
      orbit.className = 'orbit';
      // Limitar el tamaño máximo de las órbitas al 85% del contenedor
      const maxOrbitSize = 85;
      const orbitSizePercent = Math.min((radius * 2), maxOrbitSize);
      orbit.style.width = `${orbitSizePercent}%`;
      orbit.style.height = `${orbitSizePercent}%`;
      orbit.style.left = `${50 - orbitSizePercent / 2}%`;
      orbit.style.top = `${50 - orbitSizePercent / 2}%`;
      solarCanvas.appendChild(orbit);
      
      // Calcular posición del planeta en la órbita
      const angleRad = (angle * Math.PI) / 180;
      const centerX = 50;
      const centerY = 50;
      let planetX = centerX + radius * Math.cos(angleRad);
      let planetY = centerY + radius * Math.sin(angleRad);
      
      // Para la Luna, ajustar posición para que esté debajo de la Tierra
      if (orbitNum === 3.5) {
        // Si la Tierra está colocada, usar su posición
        const earthPos = gameState.placedPlanets['tierra'];
        if (earthPos) {
          planetX = earthPos.x;
          planetY = earthPos.y + 5.5; // Debajo de la Tierra
        } else {
          // Si no, calcular basándose en la posición esperada de la Tierra
          const earthAngle = orbitAngles[3] * Math.PI / 180;
          const earthRadius = orbitRadii[3];
          const earthX = centerX + earthRadius * Math.cos(earthAngle);
          const earthY = centerY + earthRadius * Math.sin(earthAngle);
          planetX = earthX;
          planetY = earthY + 5.5; // Debajo de la Tierra
        }
      }
      
      // Crear zona de drop más pequeña y precisa
      // Solo crear si el planeta no está ya colocado
      const planet = celestialBodies.find(c => {
        if (orbitKey === '3.5') return c.isMoon;
        return c.orbit === orbitNum && !c.isMoon && !c.isSun;
      });
      
      if (planet && !gameState.placedPlanets[planet.id]) {
        const dropZone = document.createElement('div');
        dropZone.className = 'orbit-drop-zone';
        dropZone.dataset.orbit = orbitKey; // Usar la clave original para mantener precisión
        dropZone.dataset.planetId = planet.id; // Identificador del planeta
        dropZone.style.width = orbitNum === 3.5 ? '40px' : '60px'; // Luna más pequeña, planetas reducidos
        dropZone.style.height = orbitNum === 3.5 ? '40px' : '60px';
        dropZone.style.left = `${planetX}%`;
        dropZone.style.top = `${planetY}%`;
        dropZone.style.transform = 'translate(-50%, -50%)';
        solarCanvas.appendChild(dropZone);
      }
    });
    
    // Colocar planetas ya colocados
    Object.keys(gameState.placedPlanets).forEach(planetId => {
      const planet = celestialBodies.find(c => c.id === planetId);
      if (planet && gameState.placedPlanets[planetId]) {
        placePlanet(planet, gameState.placedPlanets[planetId]);
      }
    });
  }
  
  setupDragAndDropLevel1();
}

function renderLevel2() {
  const levelIndicator = document.getElementById('level-indicator');
  const panelTitle = document.getElementById('panel-title');
  const celestialItems = document.getElementById('celestial-items');
  const solarCanvas = document.getElementById('solar-canvas');
  
  if (levelIndicator) {
    levelIndicator.textContent = 'Nivel 2: ¿De qué planeta es este dato?';
  }
  
  if (panelTitle) {
    panelTitle.textContent = 'Preguntas';
  }
  
  // Generar preguntas aleatorias para cada cuerpo celeste
  if (gameState.questions.length === 0) {
    generateQuestions();
  }
  
  // Mostrar la pregunta actual
  if (celestialItems) {
    renderCurrentQuestion(celestialItems);
  }
  
  // Mantener planetas visibles
  if (solarCanvas) {
    // Limpiar cualquier marcador anterior
    document.querySelectorAll('.name-drop-marker').forEach(z => z.remove());
  }
  
  setupQuestionHandlers();
}

function setupDragAndDropLevel1() {
  const items = document.querySelectorAll('.celestial-item[data-celestial]');
  const dropZones = document.querySelectorAll('.orbit-drop-zone');
  const sunDropZone = document.querySelector('.sun-drop-zone');
  
  items.forEach(item => {
    item.addEventListener('dragstart', handleDragStartLevel1);
    item.addEventListener('dragend', handleDragEnd);
  });
  
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDropLevel1);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
  });
  
  // Agregar eventos para la zona del Sol
  if (sunDropZone) {
    sunDropZone.addEventListener('dragover', handleDragOver);
    sunDropZone.addEventListener('drop', handleDropSun);
    sunDropZone.addEventListener('dragenter', handleDragEnter);
    sunDropZone.addEventListener('dragleave', handleDragLeave);
  }
}

function generateQuestions() {
  // Generar una pregunta aleatoria para cada cuerpo celeste colocado
  gameState.questions = [];
  Object.keys(gameState.placedPlanets).forEach(planetId => {
    if (celestialFacts[planetId] && celestialFacts[planetId].length > 0) {
      const facts = celestialFacts[planetId];
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      gameState.questions.push({
        planetId: planetId,
        fact: randomFact,
        answered: false
      });
    }
  });
  // Mezclar las preguntas
  gameState.questions = shuffleArray(gameState.questions);
  gameState.currentQuestionIndex = 0;
}

function renderCurrentQuestion(container) {
  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    checkLevel2Complete();
    return;
  }
  
  const question = gameState.questions[gameState.currentQuestionIndex];
  const planet = celestialBodies.find(c => c.id === question.planetId);
  
  if (!planet) return;
  
  // Generar opciones: la correcta + 3 incorrectas aleatorias
  const allPlanets = celestialBodies.filter(c => c.id !== question.planetId);
  const wrongAnswers = shuffleArray([...allPlanets]).slice(0, 3);
  const options = shuffleArray([planet, ...wrongAnswers]);
  
  container.innerHTML = `
    <div class="question-container">
      <div class="question-header">
        <h3>Pregunta ${gameState.currentQuestionIndex + 1} de ${gameState.questions.length}</h3>
      </div>
      <div class="question-content">
        <p class="question-text">${question.fact}</p>
        <p class="question-prompt">¿De qué cuerpo celeste es este dato?</p>
        <div class="question-options">
          ${options.map((option, index) => `
            <button class="question-option" data-planet="${option.id}" data-correct="${option.id === question.planetId}">
              ${option.name}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function setupQuestionHandlers() {
  const options = document.querySelectorAll('.question-option');
  options.forEach(option => {
    option.addEventListener('click', handleQuestionAnswer);
  });
}

function handleQuestionAnswer(e) {
  const button = e.currentTarget;
  const selectedPlanetId = button.dataset.planet;
  const isCorrect = button.dataset.correct === 'true';
  const question = gameState.questions[gameState.currentQuestionIndex];
  
  if (isCorrect) {
    button.classList.add('correct');
    question.answered = true;
    gameState.answeredQuestions[question.planetId] = true;
    showFeedback('¡Correcto!', 'success');
    
    // Avanzar a la siguiente pregunta después de un breve delay
    setTimeout(() => {
      gameState.currentQuestionIndex++;
      const celestialItems = document.getElementById('celestial-items');
      if (celestialItems) {
        renderCurrentQuestion(celestialItems);
        setupQuestionHandlers();
      }
      checkLevel2Complete();
    }, 1500);
  } else {
    button.classList.add('incorrect');
    showFeedback('Incorrecto. Intenta de nuevo.', 'error');
    
    // Remover la clase incorrect después de un momento
    setTimeout(() => {
      button.classList.remove('incorrect');
    }, 1500);
  }
}

let draggedElement = null;
let draggedData = null;

function handleDragStartLevel1(e) {
  draggedElement = e.target.closest('.celestial-item');
  draggedData = draggedElement.dataset.celestial;
  e.dataTransfer.setData('text/plain', draggedData);
  draggedElement.classList.add('dragging');
}

function handleDragStartLevel2(e) {
  draggedElement = e.target.closest('.celestial-item');
  draggedData = draggedElement.dataset.name;
  e.dataTransfer.setData('text/plain', draggedData);
  draggedElement.classList.add('dragging');
}

function handleDragEnd(e) {
  if (draggedElement) {
    draggedElement.classList.remove('dragging');
  }
  document.querySelectorAll('.orbit-drop-zone, .name-drop-marker').forEach(z => {
    z.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragEnter(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDropSun(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  if (!draggedData || !draggedElement) return;
  
  const celestial = celestialBodies.find(c => c.id === draggedData);
  if (!celestial) return;
  
  // Verificar si es el Sol
  if (celestial.id === 'sol') {
    const dropZone = e.currentTarget;
    
    placePlanet(celestial, { x: 50, y: 50 });
    gameState.placedPlanets[celestial.id] = { x: 50, y: 50 };
    draggedElement.classList.add('used');
    draggedElement.remove();
    
    // Remover la zona de drop del sol
    dropZone.remove();
    
    // Agregar efecto de brillo al sol
    const solElement = document.querySelector('.planet-placed[data-planet="sol"]');
    if (solElement) {
      solElement.classList.add('sun-placed');
    }
    
    showFeedback('¡Sol colocado correctamente!', 'success');
    
    // Verificar si se completó el nivel 1
    setTimeout(() => {
      checkLevel1Complete();
    }, 500);
  } else {
    showFeedback('Ese no es el Sol', 'error');
  }
  
  draggedData = null;
  draggedElement = null;
}

function handleDropLevel1(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  if (!draggedData || !draggedElement) return;
  
  const celestial = celestialBodies.find(c => c.id === draggedData);
  if (!celestial) return;
  
  // No permitir colocar el sol aquí
  if (celestial.id === 'sol') {
    showFeedback('El Sol va en el centro', 'error');
    draggedData = null;
    draggedElement = null;
    return;
  }
  
  const orbitNumStr = e.currentTarget.dataset.orbit;
  const orbitNum = parseFloat(orbitNumStr);
  const expectedOrbit = celestial.orbit;
  
  // Verificar si es la órbita correcta (comparar tanto número como string)
  const isCorrectOrbit = orbitNum === expectedOrbit || 
                         orbitNumStr === String(expectedOrbit) ||
                         (celestial.isMoon && (orbitNum === 3.5 || orbitNumStr === '3.5'));
  
  if (isCorrectOrbit) {
    const dropZone = e.currentTarget;
    
    // Calcular posición basada en la órbita
    let x, y;
    
    if (celestial.isMoon) {
      // La luna va debajo de la Tierra, fuera de su círculo pero cerca
      // Si la Tierra está colocada, usar su posición como referencia
      const earthPos = gameState.placedPlanets['tierra'];
      if (earthPos) {
        // Posicionar la Luna debajo de la Tierra (mismo X, Y mayor)
        x = earthPos.x;
        y = earthPos.y + 5.5; // 5.5% más abajo
      } else {
        // Si la Tierra no está colocada, calcular posición basada en la órbita
        const earthAngle = orbitAngles[3] * Math.PI / 180;
        const earthRadius = orbitRadii[3];
        const earthX = 50 + earthRadius * Math.cos(earthAngle);
        const earthY = 50 + earthRadius * Math.sin(earthAngle);
        x = earthX;
        y = earthY + 5.5; // Debajo de la Tierra
      }
    } else {
      // Calcular posición en la órbita
      const angle = orbitAngles[orbitNum] * Math.PI / 180;
      const radius = orbitRadii[orbitNum];
      x = 50 + radius * Math.cos(angle);
      y = 50 + radius * Math.sin(angle);
    }
    
    placePlanet(celestial, { x, y });
    gameState.placedPlanets[celestial.id] = { x, y };
    draggedElement.classList.add('used');
    draggedElement.remove();
    
    // Remover solo la zona de drop usada (verificar que sea la correcta)
    if (dropZone && dropZone.dataset.orbit === orbitNumStr) {
      dropZone.remove();
    }
    
    showFeedback('¡Correcto!', 'success');
    
    // Si se colocó la Tierra, asegurar que la zona de drop de la Luna esté disponible
    if (celestial.id === 'tierra' && !gameState.placedPlanets['luna']) {
      // La zona de drop de la Luna ya debería estar creada, solo verificar que exista
      const moonDropZone = document.querySelector('.orbit-drop-zone[data-orbit="3.5"]');
      if (!moonDropZone) {
        // Recrear la zona de drop de la Luna debajo de la Tierra
        const earthPos = gameState.placedPlanets['tierra'];
        const moonX = earthPos ? earthPos.x : 50;
        const moonY = earthPos ? earthPos.y + 5.5 : 50 + orbitRadii[3] + 5.5; // Debajo de la Tierra
        
        const newMoonDropZone = document.createElement('div');
        newMoonDropZone.className = 'orbit-drop-zone';
        newMoonDropZone.dataset.orbit = '3.5';
        newMoonDropZone.dataset.planetId = 'luna';
        newMoonDropZone.style.width = '40px';
        newMoonDropZone.style.height = '40px';
        newMoonDropZone.style.left = `${moonX}%`;
        newMoonDropZone.style.top = `${moonY}%`;
        newMoonDropZone.style.transform = 'translate(-50%, -50%)';
        
        const solarCanvas = document.getElementById('solar-canvas');
        if (solarCanvas) {
          solarCanvas.appendChild(newMoonDropZone);
          // Reconfigurar eventos de drag and drop
          newMoonDropZone.addEventListener('dragover', handleDragOver);
          newMoonDropZone.addEventListener('drop', handleDropLevel1);
          newMoonDropZone.addEventListener('dragenter', handleDragEnter);
          newMoonDropZone.addEventListener('dragleave', handleDragLeave);
        }
      } else {
        // Actualizar posición de la zona de drop existente para que esté debajo de la Tierra
        const earthPos = gameState.placedPlanets['tierra'];
        if (earthPos) {
          moonDropZone.style.left = `${earthPos.x}%`;
          moonDropZone.style.top = `${earthPos.y + 5.5}%`;
        }
      }
    }
    
    // Verificar si se completó el nivel 1
    setTimeout(() => {
      checkLevel1Complete();
    }, 500);
  } else {
    showFeedback('Esa no es la órbita correcta', 'error');
  }
  
  draggedData = null;
  draggedElement = null;
}

function handleDropLevel2(e) {
  e.preventDefault();
  if (!draggedData || !draggedElement || gameState.gameCompleted) return;
  
  const targetPlanet = e.currentTarget.dataset.planet;
  const draggedElementItem = document.querySelector(`.celestial-item[data-name="${draggedData}"]`);
  if (!draggedElementItem) return;
  
  const feedback = document.getElementById('feedback-message');
  
  if (targetPlanet === draggedData && !e.currentTarget.classList.contains('filled')) {
    const marker = e.currentTarget;
    marker.classList.add('filled');
    marker.textContent = '';
    
    // Crear etiqueta con el nombre en la posición correcta
    const label = document.createElement('span');
    label.className = 'placed-label';
    const labelPos = marker.dataset.labelPos || 'top';
    label.classList.add(`label-${labelPos}`);
    label.textContent = celestialBodies.find(c => c.id === draggedData).name;
    marker.appendChild(label);
    
    // Remover el elemento arrastrado
    draggedElementItem.remove();
    
    // Marcar como colocado
    gameState.placedNames[draggedData] = true;
    
    // Mostrar feedback positivo
    if (feedback) {
      feedback.className = 'feedback-message success';
      feedback.innerHTML = '<i class="bx bx-check-circle"></i> ¡Correcto!';
    }
    
    // Verificar si se completó el nivel 2
    setTimeout(() => {
      checkLevel2Complete();
    }, 500);
  } else {
    // Mostrar feedback negativo
    if (feedback && !gameState.gameCompleted) {
      feedback.className = 'feedback-message error';
      feedback.innerHTML = '<i class="bx bx-x-circle"></i> Ese nombre no corresponde a ese planeta.';
    }
  }
  
  draggedData = null;
  draggedElement = null;
}

function placePlanet(celestial, position) {
  const canvas = document.getElementById('solar-canvas');
  if (!canvas) return;
  
  // Verificar si el planeta ya está colocado para evitar duplicados
  const existing = canvas.querySelector(`.planet-placed[data-planet="${celestial.id}"]`);
  if (existing) return;
  
  const planetDiv = document.createElement('div');
  planetDiv.className = 'planet-placed';
  planetDiv.dataset.planet = celestial.id;
  planetDiv.style.width = `${celestial.size}px`;
  planetDiv.style.height = `${celestial.size}px`;
  planetDiv.style.left = `${position.x}%`;
  planetDiv.style.top = `${position.y}%`;
  planetDiv.style.transform = 'translate(-50%, -50%)';
  
  // Si es el sol, agregar efecto especial
  if (celestial.isSun) {
    planetDiv.style.zIndex = '5';
    planetDiv.style.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))';
  }
  
  const img = document.createElement('img');
  img.src = `/static/assets/ciencias/planetas/${celestial.image}`;
  img.alt = celestial.name;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  planetDiv.appendChild(img);
  
  canvas.appendChild(planetDiv);
}

function checkLevel1Complete() {
  // Verificar que TODOS los cuerpos celestes estén colocados, incluyendo la Luna
  const requiredPlanets = celestialBodies; // Todos los cuerpos celestes son requeridos
  const placedPlanets = Object.keys(gameState.placedPlanets);
  
  // Verificar que todos los cuerpos celestes requeridos estén colocados
  const allPlaced = requiredPlanets.every(c => gameState.placedPlanets[c.id]);
  
  if (allPlaced && placedPlanets.length === requiredPlanets.length) {
    // Completar nivel 1, pasar a nivel 2
    setTimeout(() => {
      gameState.currentLevel = 2;
      renderLevel();
      showFeedback('¡Nivel 1 completado! Ahora responde las preguntas sobre los planetas.', 'success');
    }, 1000);
  }
}

function checkLevel2Complete() {
  // Verificar que todas las preguntas estén respondidas
  const allAnswered = gameState.questions.length > 0 && 
                      gameState.questions.every(q => q.answered) &&
                      gameState.currentQuestionIndex >= gameState.questions.length;
  
  if (allAnswered) {
    // Mostrar botón de finalizar
    showFinishButton();
  }
}

function showFinishButton() {
  const canvas = document.getElementById('solar-canvas');
  if (!canvas) return;
  
  const finishBtn = document.createElement('button');
  finishBtn.className = 'finish-button';
  finishBtn.innerHTML = '<i class="bx bx-check"></i> Finalizar';
  finishBtn.style.position = 'absolute';
  finishBtn.style.bottom = '20px';
  finishBtn.style.left = '50%';
  finishBtn.style.transform = 'translateX(-50%)';
  finishBtn.addEventListener('click', () => {
    completeGame(true);
  });
  
  canvas.appendChild(finishBtn);
}

function showFeedback(message, type) {
  const feedback = document.getElementById('feedback-message');
  if (!feedback) return;
  
  feedback.textContent = message;
  feedback.className = `feedback-message ${type} show`;
  
  setTimeout(() => {
    feedback.classList.remove('show');
  }, 2000);
}

function completeGame(won) {
  gameState.gameCompleted = true;
  
  if (gameState.backgroundMusic) {
    gameState.backgroundMusic.pause();
  }
  
  if (gameState.victorySound && won) {
    gameState.victorySound.currentTime = 0;
    gameState.victorySound.play().catch(() => {});
  }

  const container = document.getElementById('game-container');
  if (!container) return;

  const backUrl = window.gameConfig?.backUrl || '../ciencia.html';
  const level1Score = Object.keys(gameState.placedPlanets).length;
  const level2Score = gameState.questions ? gameState.questions.filter(q => q.answered).length : 0;
  const totalScore = level1Score + level2Score;
  const totalQuestions = gameState.questions ? gameState.questions.length : 0;

  container.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx bx-trophy" style="font-size: 40px; color: #ffd700;"></i>
        </div>
        <h2 class="complete-title title-animation">¡Felicidades!</h2>
        <p class="complete-message message-animation">Completaste el Sistema Solar correctamente.</p>
        <div class="stats-card stats-animation">
          <p class="complete-score">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación: <span style="color: #b4ff1a;">${totalScore}</span> puntos
          </p>
          <p class="complete-time">
            <i class="bx bx-check-circle" style="color: #b4ff1a;"></i>
            Planetas colocados: <span style="color: #b4ff1a;">${level1Score}</span>
          </p>
          <p class="complete-time">
            <i class="bx bx-check-circle" style="color: #b4ff1a;"></i>
            Preguntas respondidas: <span style="color: #b4ff1a;">${level2Score}</span>/${totalQuestions}
          </p>
        </div>
        <div class="complete-buttons buttons-animation">
          <button class="restart-button" onclick="restartGame()" style="flex: 1;">
            <i class="bx bx-refresh"></i>
            Volver a Jugar
          </button>
          <a href="${backUrl}" class="restart-button back-button" style="flex: 1; cursor: pointer;">
            <i class="bx bx-arrow-back"></i>
            Volver al menú
          </a>
        </div>
      </div>
    </div>
  `;
}

function restartGame() {
  if (gameState.backgroundMusic) {
    gameState.backgroundMusic.pause();
    gameState.backgroundMusic = null;
  }
  gameState.currentLevel = 1;
  gameState.placedPlanets = {};
  gameState.answeredQuestions = {};
  gameState.currentQuestionIndex = 0;
  gameState.questions = [];
  gameState.gameCompleted = false;
  renderLayout();
}

function toggleFullscreen() {
  const wrapper = document.querySelector('.game-wrapper');
  const icon = document.getElementById('fullscreen-icon-inner');
  
  if (!document.fullscreenElement) {
    wrapper.requestFullscreen?.();
    if (icon) icon.className = 'fas fa-compress';
  } else {
    document.exitFullscreen?.();
    if (icon) icon.className = 'fas fa-expand';
  }
}

function initAudio() {
  if (gameState.backgroundMusic) {
    gameState.backgroundMusic.pause();
  }
  const musicUrl = window.gameConfig?.musicUrl || '/static/assets/ciencias/ciensmusic.mp3';
  gameState.backgroundMusic = new Audio(musicUrl);
  gameState.backgroundMusic.loop = true;
  gameState.backgroundMusic.volume = gameState.musicVolume;
  gameState.backgroundMusic.play().catch(() => {});

  gameState.victorySound = new Audio('/static/assets/exam.mp3');
  gameState.victorySound.volume = 0.7;
}

function setupVolumeControl() {
  const slider = document.getElementById('volume-slider');
  const icon = document.getElementById('music-icon');
  if (!slider || !icon) return;

  slider.addEventListener('input', e => {
    gameState.musicVolume = e.target.value / 100;
    if (gameState.backgroundMusic) gameState.backgroundMusic.volume = gameState.musicVolume;
    updateMusicIcon(icon, gameState.musicVolume);
  });

  icon.addEventListener('click', () => {
    if (!gameState.backgroundMusic) return;
    if (gameState.backgroundMusic.paused) {
      gameState.backgroundMusic.play().catch(() => {});
      slider.value = gameState.musicVolume * 100;
      updateMusicIcon(icon, gameState.musicVolume);
    } else {
      gameState.backgroundMusic.pause();
      slider.value = 0;
      updateMusicIcon(icon, 0);
    }
  });
}

function updateMusicIcon(icon, volume) {
  if (volume === 0) icon.className = 'bx bx-volume-mute';
  else if (volume < 0.5) icon.className = 'bx bx-volume-low';
  else icon.className = 'bx bx-volume-full';
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay && modalOverlay.classList.contains('modal-hidden')) {
    initGame();
  } else if (modalOverlay) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.classList.contains('modal-hidden')) {
          initGame();
        }
      });
    });
    observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
  } else {
    initGame();
  }
});
