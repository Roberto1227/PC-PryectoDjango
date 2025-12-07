// ============================================
// ENGLISH ADVENTURE MAP - JUEGO CON CANVAS HTML5
// ============================================

// Variables del juego
let canvas = null;
let ctx = null;
let gameRunning = false;
let gameLoopId = null;

// Variables del mapa
let mapOffsetX = 0;
let mapOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let zoomLevel = 0.8;
let mapWidth = 1400;
let mapHeight = 1000;

// Variables de juego
let score = 0;
let missionsCompleted = 0;
let currentLocation = null;
let hoveredLocation = null;
let hoverAnimationTime = 0;

// Imágenes
let backgroundImage = null;
let locationImages = {};
let imagesLoaded = 0;
let totalImages = 6;

// Audio
let backgroundMusic = null;
let correctSound = null;
let incorrectSound = null;
let musicVolume = 0.3;

// Datos de ubicaciones
const locationData = [
  {
    id: 'house',
    name: 'House',
    x: 300,
    y: 250,
    imageKey: 'house',
    unlocked: true,
    missions: [
      {
        type: 'sentence',
        question: 'I ___ breakfast every morning.',
        options: ['eats', 'eat', 'eating', 'ate'],
        correct: 1,
        theme: 'Food',
        explanation: 'Usamos "eat" con "I" porque es la forma del presente simple.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What room do you use to cook food?',
        options: ['Bedroom', 'Kitchen', 'Bathroom', 'Living room'],
        correct: 1,
        theme: 'Places',
        explanation: 'La cocina es donde preparamos y cocinamos las comidas.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'My ___ is in the bedroom.',
        options: ['book', 'car', 'bed', 'dog'],
        correct: 2,
        theme: 'Places',
        explanation: 'Una cama es un mueble que se encuentra en un dormitorio.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What do you say when you enter a house?',
        options: ['Goodbye!', 'Thank you!', 'Hello!', 'Sorry!'],
        correct: 2,
        theme: 'Greetings',
        explanation: '"Hello!" es un saludo común al entrar a un lugar.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'I ___ my room every day.',
        options: ['cleans', 'cleaning', 'clean', 'cleaned'],
        correct: 2,
        theme: 'Actions',
        explanation: 'Usamos "clean" con "I" en tiempo presente simple.',
        completed: false
      }
    ]
  },
  {
    id: 'store',
    name: 'Store',
    x: 700,
    y: 200,
    imageKey: 'store',
    unlocked: false,
    missions: [
      {
        type: 'sentence',
        question: 'I ___ groceries at the store.',
        options: ['buys', 'buying', 'buy', 'bought'],
        correct: 2,
        theme: 'Food',
        explanation: 'Usamos "buy" con "I" en tiempo presente simple.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'Where do you buy food and drinks?',
        options: ['At the park', 'At school', 'At the store', 'At the beach'],
        correct: 2,
        theme: 'Places',
        explanation: 'Una tienda es donde compramos alimentos y otros artículos.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'I need to buy ___ and bread.',
        options: ['run', 'jump', 'milk', 'sleep'],
        correct: 2,
        theme: 'Food',
        explanation: 'La leche es un alimento común que se compra en las tiendas.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What do you say to the cashier when paying?',
        options: ['Hello!', 'Goodbye!', 'How much?', 'Thank you!'],
        correct: 2,
        theme: 'Shopping',
        explanation: '"How much?" se usa para preguntar sobre el precio.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'The ___ helps me find products.',
        options: ['teacher', 'doctor', 'cashier', 'student'],
        correct: 2,
        theme: 'People',
        explanation: 'Un cajero trabaja en una tienda y ayuda a los clientes.',
        completed: false
      }
    ]
  },
  {
    id: 'library',
    name: 'Library',
    x: 500,
    y: 600,
    imageKey: 'library',
    unlocked: false,
    missions: [
      {
        type: 'sentence',
        question: 'I read ___ in the library.',
        options: ['food', 'water', 'books', 'games'],
        correct: 2,
        theme: 'School',
        explanation: 'Los libros son lo que leemos en una biblioteca.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What is the main activity in a library?',
        options: ['Playing soccer', 'Cooking food', 'Reading books', 'Watching TV'],
        correct: 2,
        theme: 'School',
        explanation: 'Las bibliotecas son lugares tranquilos donde las personas leen y estudian.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'The ___ helps me find books.',
        options: ['doctor', 'teacher', 'librarian', 'cook'],
        correct: 2,
        theme: 'People',
        explanation: 'Un bibliotecario trabaja en una biblioteca y ayuda a encontrar libros.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What should you do in a library?',
        options: ['Be loud', 'Run around', 'Be quiet', 'Play music'],
        correct: 2,
        theme: 'Rules',
        explanation: 'Las bibliotecas requieren silencio para que las personas puedan leer y estudiar.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'I ___ books from the library.',
        options: ['borrows', 'borrowing', 'borrow', 'borrowed'],
        correct: 2,
        theme: 'Actions',
        explanation: 'Usamos "borrow" con "I" para tomar libros temporalmente.',
        completed: false
      }
    ]
  },
  {
    id: 'park',
    name: 'Park',
    x: 1000,
    y: 400,
    imageKey: 'park',
    unlocked: false,
    missions: [
      {
        type: 'sentence',
        question: 'I see ___ in the park.',
        options: ['books', 'food', 'trees', 'water'],
        correct: 2,
        theme: 'Nature',
        explanation: 'Los árboles son comunes en los parques y áreas naturales.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What animals can you see in a park?',
        options: ['Lions', 'Sharks', 'Birds and squirrels', 'Bears'],
        correct: 2,
        theme: 'Animals',
        explanation: 'Los parques tienen animales pequeños como pájaros y ardillas.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'The ___ is playing in the park.',
        options: ['book', 'car', 'dog', 'bed'],
        correct: 2,
        theme: 'Animals',
        explanation: 'Los perros son mascotas que juegan en los parques.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What can you do at a park?',
        options: ['Cook food', 'Study quietly', 'Play and exercise', 'Sleep'],
        correct: 2,
        theme: 'Activities',
        explanation: 'Los parques son para actividades al aire libre como jugar y hacer ejercicio.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'I ___ in the park every weekend.',
        options: ['walks', 'walking', 'walk', 'walked'],
        correct: 2,
        theme: 'Actions',
        explanation: 'Usamos "walk" con "I" en tiempo presente simple.',
        completed: false
      }
    ]
  },
  {
    id: 'hospital',
    name: 'Hospital',
    x: 1100,
    y: 700,
    imageKey: 'hospital',
    unlocked: false,
    missions: [
      {
        type: 'sentence',
        question: 'The doctor helps ___ people.',
        options: ['happy', 'tall', 'sick', 'fast'],
        correct: 2,
        theme: 'Health',
        explanation: 'Los doctores ayudan a las personas enfermas a mejorar.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'Where do you go when you are sick?',
        options: ['To the park', 'To school', 'To the hospital', 'To the store'],
        correct: 2,
        theme: 'Places',
        explanation: 'Los hospitales son donde van las personas enfermas para recibir atención médica.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'The ___ works at the hospital.',
        options: ['teacher', 'cook', 'nurse', 'student'],
        correct: 2,
        theme: 'People',
        explanation: 'Las enfermeras son profesionales médicos que trabajan en hospitales.',
        completed: false
      },
      {
        type: 'multiple',
        question: 'What should you do when you feel sick?',
        options: ['Go to the park', 'Play games', 'See a doctor', 'Eat candy'],
        correct: 2,
        theme: 'Health',
        explanation: 'Cuando estás enfermo, es importante ver a un doctor para recibir ayuda.',
        completed: false
      },
      {
        type: 'sentence',
        question: 'I ___ better after visiting the hospital.',
        options: ['feels', 'feeling', 'feel', 'felt'],
        correct: 2,
        theme: 'Health',
        explanation: 'Usamos "feel" con "I" para expresar cómo nos sentimos.',
        completed: false
      }
    ]
  }
];

// ============================================
// INICIALIZACIÓN
// ============================================

function initGame() {
  console.log('Inicializando English Adventure Map...');
  // Verificar que gameConfig esté disponible
  if (!window.gameConfig) {
    console.warn('gameConfig no disponible, esperando...');
    setTimeout(() => {
      if (window.gameConfig) {
        initGame();
      } else {
        console.error('gameConfig no disponible después de esperar');
      }
    }, 100);
    return;
  }
  createGameInterface();
  setTimeout(() => {
    loadImages();
  }, 100);
}

function createGameInterface() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) {
    console.error('game-container no encontrado');
    return;
  }
  
  gameContainer.innerHTML = `
    <div class="game-wrapper">
      <div class="game-header">
        <div class="game-info-panel">
          <div class="info-item">
            <span class="info-label">Puntuación</span>
            <span class="info-value" id="score-display">0</span>
          </div>
          <div class="info-item">
            <span class="info-label">Misiones</span>
            <span class="info-value" id="missions-display">0/15</span>
          </div>
        </div>
        <div class="header-tools">
          <div class="zoom-controls">
            <button class="zoom-btn" id="zoom-in" title="Acercar">
              <i class="bx bx-zoom-in"></i>
            </button>
            <button class="zoom-btn" id="zoom-out" title="Alejar">
              <i class="bx bx-zoom-out"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="game-content">
        <canvas id="adventureCanvas"></canvas>
      </div>
      
      <div class="game-controls">
        <div class="audio-controls" id="audio-controls" title="Control de música">
          <button class="audio-btn" id="music-toggle">
            <i class="bx bx-volume-full" id="music-icon"></i>
          </button>
          <input type="range" id="volume-slider" min="0" max="100" value="${musicVolume * 100}" class="volume-slider">
          <span class="volume-level" id="volume-level">${Math.round(musicVolume * 100)}%</span>
        </div>
      </div>
    </div>
  `;

  // Inicializar canvas
  canvas = document.getElementById("adventureCanvas");
  if (!canvas) {
    console.error('Canvas no encontrado');
    return;
  }
  
  ctx = canvas.getContext("2d");
  adjustCanvasSize();
  
  // Configurar eventos
  setupEventListeners();
  setupVolumeControl();
  initAudio();
  
  // Mostrar instrucciones iniciales
  setTimeout(() => {
    showInstructions();
  }, 500);
}

function adjustCanvasSize() {
  if (!canvas) return;
  
  const container = canvas.parentElement;
  if (!container) return;
  
  const containerWidth = container.clientWidth - 32; // padding
  const containerHeight = container.clientHeight - 32;
  
  const maxWidth = Math.min(1400, containerWidth);
  const maxHeight = Math.min(600, containerHeight);
  
  canvas.width = maxWidth;
  canvas.height = maxHeight;
  
  canvas.style.width = maxWidth + 'px';
  canvas.style.height = maxHeight + 'px';
  
  // Redibujar si el juego ya está corriendo
  if (gameRunning) {
    draw();
  }
}

function setupEventListeners() {
  // Arrastre del mapa
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mouseleave', handleMouseUp);
  
  // Touch events para móviles
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', handleTouchEnd);
  
  // Zoom
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      zoomLevel = Math.min(zoomLevel + 0.1, 1.5);
      draw();
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      zoomLevel = Math.max(zoomLevel - 0.1, 0.3);
      draw();
    });
  }
  
  // Click en ubicaciones
  canvas.addEventListener('click', handleCanvasClick);
  
  // Resize
  window.addEventListener('resize', () => {
    adjustCanvasSize();
    draw();
  });
}

// ============================================
// CARGA DE IMÁGENES
// ============================================

function loadImages() {
  // Obtener rutas desde gameConfig
  const bgImageUrl = window.gameConfig?.bgImageUrl || '/static/assets/english/bg1.png';
  const imagesBaseUrl = window.gameConfig?.imagesBaseUrl || '/static/assets/english/';
  
  console.log('Cargando imágenes desde:', { bgImageUrl, imagesBaseUrl });
  
  // Cargar fondo
  backgroundImage = new Image();
  backgroundImage.onload = imageLoaded;
  backgroundImage.onerror = () => {
    console.error('Error cargando fondo desde:', backgroundImage.src);
  };
  backgroundImage.src = bgImageUrl;
  
  // Cargar imágenes de ubicaciones
  const locationKeys = ['house', 'store', 'library', 'park', 'hospital'];
  locationKeys.forEach(key => {
    const img = new Image();
    img.onload = imageLoaded;
    img.onerror = () => {
      console.error(`Error cargando ${key} desde:`, img.src);
    };
    // Asegurar que la URL base termine con /
    const baseUrl = imagesBaseUrl.endsWith('/') ? imagesBaseUrl : imagesBaseUrl + '/';
    img.src = baseUrl + key + '.png';
    console.log(`Cargando imagen ${key} desde:`, img.src);
    locationImages[key] = img;
  });
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    startGame();
  }
}

// ============================================
// CONTROL DEL JUEGO
// ============================================

function startGame() {
  gameRunning = true;
  
  // Ajustar tamaño del canvas
  adjustCanvasSize();
  
  // Centrar en el centro del mapa (mostrar todas las ubicaciones)
  const centerX = mapWidth / 2;
  const centerY = mapHeight / 2;
  
  mapOffsetX = centerX - canvas.width / (2 * zoomLevel);
  mapOffsetY = centerY - canvas.height / (2 * zoomLevel);
  
  draw();
}

function draw() {
  if (!ctx || !canvas) return;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Guardar contexto
  ctx.save();
  
  // Aplicar zoom y offset
  ctx.translate(-mapOffsetX * zoomLevel, -mapOffsetY * zoomLevel);
  ctx.scale(zoomLevel, zoomLevel);
  
  // Dibujar fondo
  if (backgroundImage && backgroundImage.complete) {
    ctx.drawImage(backgroundImage, 0, 0, mapWidth, mapHeight);
  } else {
    // Fondo temporal
    ctx.fillStyle = '#2c3c5c';
    ctx.fillRect(0, 0, mapWidth, mapHeight);
  }
  
  // Dibujar ubicaciones
  locationData.forEach(location => {
    drawLocation(location);
  });
  
  // Restaurar contexto
  ctx.restore();
  
  // Dibujar UI (no se escala)
  drawUI();
}

function drawLocation(location) {
  const img = locationImages[location.imageKey];
  if (!img || !img.complete) return;
  
  // Calcular misiones completadas
  const completedMissions = location.missions.filter(m => m.completed).length;
  const totalMissions = location.missions.length;
  
  // Animación hover mejorada con múltiples efectos
  const isHovered = hoveredLocation === location.id;
  hoverAnimationTime += isHovered ? 0.12 : -0.08;
  hoverAnimationTime = Math.max(0, Math.min(1, hoverAnimationTime));
  
  // Múltiples ondas de pulso para efecto más rico
  const pulse1 = Math.sin(hoverAnimationTime * Math.PI * 2) * 0.06;
  const pulse2 = Math.sin(hoverAnimationTime * Math.PI * 4) * 0.03;
  const pulse = pulse1 + pulse2;
  
  const hoverScale = isHovered ? 1.18 + pulse : 1.0;
  const hoverRotation = isHovered ? Math.sin(hoverAnimationTime * Math.PI * 2) * 3 : 0;
  const hoverGlow = isHovered ? 0.25 + Math.abs(pulse) * 0.25 : 0;
  const hoverBrightness = isHovered ? 1.2 : 1.0;
  
  const baseSize = 180;
  const size = baseSize * hoverScale;
  const x = location.x - size / 2;
  const y = location.y - size / 2;
  
  // Múltiples capas de brillo para efecto más rico
  if (isHovered && hoverGlow > 0) {
    // Capa exterior de brillo
    ctx.save();
    ctx.globalAlpha = hoverGlow * 0.4;
    ctx.shadowBlur = 50;
    ctx.shadowColor = '#9B59B6';
    ctx.fillStyle = '#9B59B6';
    ctx.beginPath();
    ctx.arc(location.x, location.y, size / 2 + 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Capa media de brillo
    ctx.save();
    ctx.globalAlpha = hoverGlow * 0.6;
    ctx.shadowBlur = 35;
    ctx.shadowColor = '#BA68C8';
    ctx.fillStyle = '#BA68C8';
    ctx.beginPath();
    ctx.arc(location.x, location.y, size / 2 + 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Capa interior de brillo
    ctx.save();
    ctx.globalAlpha = hoverGlow * 0.8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#CE93D8';
    ctx.fillStyle = '#CE93D8';
    ctx.beginPath();
    ctx.arc(location.x, location.y, size / 2 + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Partículas de brillo alrededor
    for (let i = 0; i < 8; i++) {
      const angle = (hoverAnimationTime * Math.PI * 2) + (i * Math.PI / 4);
      const radius = size / 2 + 30 + Math.sin(hoverAnimationTime * Math.PI * 4 + i) * 10;
      const particleX = location.x + Math.cos(angle) * radius;
      const particleY = location.y + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.globalAlpha = hoverGlow * 0.5;
      ctx.fillStyle = '#E1BEE7';
      ctx.beginPath();
      ctx.arc(particleX, particleY, 4 + Math.sin(hoverAnimationTime * Math.PI * 4 + i) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // Dibujar imagen con rotación y brillo
  ctx.save();
  ctx.translate(location.x, location.y);
  ctx.rotate(hoverRotation * Math.PI / 180);
  ctx.globalAlpha = hoverBrightness;
  ctx.filter = isHovered ? 'brightness(1.15) saturate(1.2)' : 'none';
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
  
  // Dibujar nombre
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 5;
  ctx.font = 'bold 28px "Comic Neue", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const textY = y + size + 15;
  ctx.strokeText(location.name, location.x, textY);
  ctx.fillText(location.name, location.x, textY);
  
  // Dibujar contador de misiones
  const missionsText = `${completedMissions}/${totalMissions}`;
  ctx.fillStyle = completedMissions === totalMissions ? '#4CAF50' : '#BA68C8';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.font = 'bold 22px "Comic Neue", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const missionsY = textY + 35;
  ctx.strokeText(missionsText, location.x, missionsY);
  ctx.fillText(missionsText, location.x, missionsY);
  
  // Dibujar candado si está bloqueada
  if (!location.unlocked) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, size, size);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔒', location.x, location.y);
  } else if (completedMissions === totalMissions) {
    // Mostrar check si todas las misiones están completadas
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓', location.x, location.y - size / 2 + 20);
  }
}

function drawUI() {
  // UI se dibuja sin transformación
  // Ya está en el HTML, solo actualizamos valores
  updateUI();
}

function updateUI() {
  const scoreDisplay = document.getElementById('score-display');
  const missionsDisplay = document.getElementById('missions-display');
  
  if (scoreDisplay) {
    scoreDisplay.textContent = score;
  }
  
  if (missionsDisplay) {
    const totalMissions = locationData.reduce((sum, loc) => sum + loc.missions.length, 0);
    missionsDisplay.textContent = `${missionsCompleted}/${totalMissions}`;
  }
}

// ============================================
// CONTROL DE ARRASTRE
// ============================================

function handleMouseDown(e) {
  isDragging = true;
  const rect = canvas.getBoundingClientRect();
  dragStartX = e.clientX - rect.left;
  dragStartY = e.clientY - rect.top;
  canvas.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const deltaX = (currentX - dragStartX) / zoomLevel;
    const deltaY = (currentY - dragStartY) / zoomLevel;
    
    mapOffsetX -= deltaX;
    mapOffsetY -= deltaY;
    
    dragStartX = currentX;
    dragStartY = currentY;
    
    draw();
  } else {
    // Verificar hover sobre ubicaciones
    checkLocationHover(e);
  }
}

function handleMouseUp() {
  isDragging = false;
  canvas.style.cursor = 'default';
}

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  dragStartX = touch.clientX - rect.left;
  dragStartY = touch.clientY - rect.top;
  isDragging = true;
}

function handleTouchMove(e) {
  e.preventDefault();
  if (isDragging) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    const deltaX = (currentX - dragStartX) / zoomLevel;
    const deltaY = (currentY - dragStartY) / zoomLevel;
    
    mapOffsetX -= deltaX;
    mapOffsetY -= deltaY;
    
    dragStartX = currentX;
    dragStartY = currentY;
    
    draw();
  }
}

function handleTouchEnd(e) {
  e.preventDefault();
  isDragging = false;
}

function checkLocationHover(e) {
  if (isDragging) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = (e.clientX - rect.left) / zoomLevel + mapOffsetX;
  const mouseY = (e.clientY - rect.top) / zoomLevel + mapOffsetY;
  
  let foundHover = false;
  let newHoveredLocation = null;
  
  locationData.forEach(location => {
    const size = 180;
    const dist = Math.sqrt(
      Math.pow(mouseX - location.x, 2) + Math.pow(mouseY - location.y, 2)
    );
    
    if (dist < size / 2) {
      foundHover = true;
      newHoveredLocation = location.id;
      canvas.style.cursor = 'pointer';
    }
  });
  
  // Actualizar hoveredLocation y redibujar si cambió
  if (hoveredLocation !== newHoveredLocation) {
    hoveredLocation = newHoveredLocation;
    hoverAnimationTime = 0;
    draw();
    startHoverAnimation();
  }
  
  if (!foundHover) {
    if (hoveredLocation !== null) {
      hoveredLocation = null;
      hoverAnimationTime = 0;
      draw();
    }
    canvas.style.cursor = 'default';
  }
}

let animationFrameId = null;

function startHoverAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  function animate() {
    if (hoveredLocation) {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animationFrameId = null;
    }
  }
  
  if (hoveredLocation) {
    animationFrameId = requestAnimationFrame(animate);
  }
}

// ============================================
// CLICK EN UBICACIONES
// ============================================

function handleCanvasClick(e) {
  if (isDragging) return;
  
  const rect = canvas.getBoundingClientRect();
  const clickX = (e.clientX - rect.left) / zoomLevel + mapOffsetX;
  const clickY = (e.clientY - rect.top) / zoomLevel + mapOffsetY;
  
  // Verificar click en ubicaciones
  locationData.forEach(location => {
    const size = 180;
    const dist = Math.sqrt(
      Math.pow(clickX - location.x, 2) + Math.pow(clickY - location.y, 2)
    );
    
    if (dist < size / 2) {
      if (location.unlocked) {
        openLocationMission(location);
      } else {
        showLocationLocked(location);
      }
    }
  });
}

// ============================================
// SISTEMA DE MISIONES
// ============================================

function openLocationMission(location) {
  currentLocation = location;
  const mission = location.missions.find(m => !m.completed);
  
  if (!mission) {
    showLocationComplete(location);
    return;
  }
  
  showMissionDialog(mission, location);
}

function showMissionDialog(mission, location) {
  const overlay = document.createElement('div');
  overlay.className = 'mission-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const panel = document.createElement('div');
  panel.className = 'mission-panel';
  panel.style.cssText = `
    background: linear-gradient(135deg, rgb(18, 55, 103) 0%, rgb(25, 65, 115) 100%);
    border: 4px solid #9B59B6;
    border-radius: 24px;
    padding: 35px;
    max-width: 700px;
    width: 90%;
    color: #fff;
    font-family: 'Comic Neue', cursive;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                0 0 40px rgba(155, 89, 182, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: panelSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  
  const title = document.createElement('h2');
  title.textContent = `Mission at ${location.name}`;
  title.style.cssText = 'color: #9B59B6; margin-bottom: 10px; text-align: center; font-size: 28px; font-weight: bold;';
  panel.appendChild(title);
  
  const theme = document.createElement('p');
  theme.textContent = `Theme: ${mission.theme}`;
  theme.style.cssText = 'color: #BA68C8; margin-bottom: 20px; text-align: center; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;';
  panel.appendChild(theme);
  
  const question = document.createElement('p');
  if (mission.type === 'sentence') {
    const questionParts = mission.question.split('___');
    question.innerHTML = `
      <span style="font-size: 22px; font-weight: bold;">${questionParts[0]}</span>
      <span style="color: #9B59B6; font-size: 22px; font-weight: bold;">___</span>
      <span style="font-size: 22px; font-weight: bold;">${questionParts[1] || ''}</span>
    `;
  } else {
    question.textContent = mission.question;
  }
  question.style.cssText = 'font-size: 22px; margin-bottom: 25px; font-weight: bold; text-align: center; line-height: 1.5;';
  panel.appendChild(question);
  
  const optionsContainer = document.createElement('div');
  const isMobile = window.innerWidth < 600;
  optionsContainer.style.cssText = `display: grid; grid-template-columns: ${isMobile ? '1fr' : 'repeat(2, 1fr)'}; gap: 15px; margin-bottom: 20px;`;
  
  mission.options.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.textContent = option;
    optionBtn.className = 'mission-option-btn';
    optionBtn.style.cssText = `
      padding: 0.85rem 1rem;
      background: linear-gradient(135deg, #BA68C8 0%, #9B59B6 100%);
      color: #fff;
      border: none;
      border-radius: 0.9rem;
      font-size: 0.95rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 12px 20px rgba(155, 89, 182, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    `;
    
    // Efecto de brillo al hover
    const shine = document.createElement('div');
    shine.style.cssText = `
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: rotate(45deg);
      transition: left 0.5s;
    `;
    optionBtn.appendChild(shine);
    
    optionBtn.addEventListener('mouseenter', () => {
      optionBtn.style.transform = 'translateY(-2px)';
      optionBtn.style.boxShadow = '0 15px 25px rgba(155, 89, 182, 0.5)';
      shine.style.left = '100%';
    });
    
    optionBtn.addEventListener('mouseleave', () => {
      optionBtn.style.transform = 'translateY(0)';
      optionBtn.style.boxShadow = '0 12px 20px rgba(155, 89, 182, 0.4)';
      shine.style.left = '-50%';
    });
    
    optionBtn.addEventListener('click', () => {
      checkAnswer(index === mission.correct, mission, location, overlay);
    });
    
    optionsContainer.appendChild(optionBtn);
  });
  
  panel.appendChild(optionsContainer);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

function checkAnswer(isCorrect, mission, location, overlay) {
  // Reproducir sonido
  if (isCorrect) {
    playCorrectSound();
  } else {
    playIncorrectSound();
  }
  
  const feedback = document.createElement('div');
  feedback.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
  
  if (isCorrect) {
    feedback.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
        <div style="font-size: 80px; animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);">🎉</div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
          <div style="font-size: 36px; font-weight: 800; text-shadow: 0 4px 8px rgba(0,0,0,0.3);">¡Excelente!</div>
          <div style="font-size: 24px; opacity: 0.9; font-weight: 600;">¡Lo hiciste bien! ✓</div>
        </div>
        <div style="font-size: 20px; opacity: 0.8; font-weight: 500;">+10 Puntos</div>
      </div>
    `;
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: linear-gradient(135deg, #00FF41 0%, #39FF14 50%, #7FFF00 100%);
      color: #003300;
      padding: 40px 60px;
      border-radius: 30px;
      font-size: 28px;
      font-weight: bold;
      z-index: 100000;
      font-family: 'Comic Neue', cursive;
      box-shadow: 0 20px 60px rgba(0, 255, 65, 0.8),
                  0 0 60px rgba(57, 255, 20, 0.6),
                  0 0 100px rgba(127, 255, 0, 0.4),
                  inset 0 2px 10px rgba(255, 255, 255, 0.4);
      border: 4px solid #00FF00;
      animation: correctFeedbackPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      min-width: 300px;
      text-align: center;
    `;
  } else {
    feedback.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
        <div style="font-size: 60px; animation: shake 0.5s;">❌</div>
        <div style="font-size: 32px; font-weight: 800; text-shadow: 0 4px 8px rgba(0,0,0,0.3);">Inténtalo de nuevo</div>
        <div style="font-size: 20px; opacity: 0.9; font-weight: 600;">¡Sigue practicando!</div>
      </div>
    `;
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 50%, #FF1744 100%);
      color: white;
      padding: 35px 55px;
      border-radius: 25px;
      font-size: 28px;
      font-weight: bold;
      z-index: 100000;
      font-family: 'Comic Neue', cursive;
      box-shadow: 0 20px 60px rgba(255, 107, 107, 0.7),
                  0 0 50px rgba(255, 82, 82, 0.5),
                  0 0 80px rgba(255, 23, 68, 0.3);
      border: 4px solid #FF5252;
      animation: incorrectFeedbackPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
                 shake 0.5s ease-in-out 0.5s;
      min-width: 280px;
      text-align: center;
    `;
  }
  
  document.body.appendChild(feedback);
  
  if (isCorrect) {
    score += 10;
    mission.completed = true;
    missionsCompleted++;
    
    // Mostrar explicación después del mensaje de correcto
    setTimeout(() => {
      if (mission.explanation) {
        const explanation = document.createElement('div');
        explanation.style.cssText = `
          position: fixed;
          top: 65%;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: linear-gradient(135deg, rgba(18, 55, 103, 0.98) 0%, rgba(25, 65, 115, 0.98) 100%);
          border: 3px solid #00FF41;
          border-radius: 20px;
          padding: 25px 35px;
          color: #54f6c3;
          font-size: 18px;
          font-weight: 600;
          z-index: 100001;
          font-family: 'Comic Neue', cursive;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 15px 40px rgba(0, 255, 65, 0.4),
                      0 0 30px rgba(57, 255, 20, 0.3);
          animation: explanationSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        `;
        explanation.innerHTML = `
          <div style="font-size: 24px; font-weight: 700; color: #00FF41; margin-bottom: 10px;">💡 Explicación</div>
          <div style="line-height: 1.6;">${mission.explanation}</div>
        `;
        document.body.appendChild(explanation);
        
        setTimeout(() => {
          explanation.style.animation = 'explanationSlideOut 0.4s ease forwards';
          setTimeout(() => explanation.remove(), 400);
        }, 4000);
      }
    }, 1500);
    
    const allMissionsComplete = location.missions.every(m => m.completed);
    const allLocationsComplete = locationData.every(loc => 
      loc.missions.every(m => m.completed)
    );
    
    if (allLocationsComplete) {
      setTimeout(() => {
        feedback.remove();
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
        showFinishButton();
      }, 5500); // Esperar a que termine la explicación
    } else if (allMissionsComplete) {
      unlockNextLocation(location);
      setTimeout(() => {
        feedback.remove();
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
        showLocationComplete(location);
      }, 5500); // Esperar a que termine la explicación
    } else {
      updateUI();
      // Cerrar el overlay después de mostrar la explicación
      setTimeout(() => {
        feedback.remove();
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
      }, 5500); // Esperar a que termine la explicación (4000ms) + tiempo extra
    }
  } else {
    // Si es incorrecto, mantener el overlay abierto para que puedan intentar de nuevo
    setTimeout(() => {
      feedback.remove();
      // El overlay permanece abierto para que puedan intentar de nuevo
    }, 1500);
  }
}

function unlockNextLocation(completedLocation) {
  const currentIndex = locationData.findIndex(loc => loc.id === completedLocation.id);
  if (currentIndex < locationData.length - 1) {
    const nextLocation = locationData[currentIndex + 1];
    nextLocation.unlocked = true;
    showUnlockNotification(nextLocation);
    draw();
  }
}

function showUnlockNotification(location) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgb(18, 55, 103);
    border: 4px solid #9B59B6;
    border-radius: 15px;
    padding: 20px 40px;
    color: #9B59B6;
    font-size: 28px;
    font-weight: bold;
    font-family: 'Comic Neue', cursive;
    z-index: 99998;
    animation: slideDown 0.5s ease;
  `;
  notification.textContent = `🎉 ${location.name} unlocked!`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

function showLocationComplete(location) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const panel = document.createElement('div');
  panel.style.cssText = `
    background: rgb(18, 55, 103);
    border: 4px solid #9B59B6;
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    color: #fff;
    font-family: 'Comic Neue', cursive;
  `;
  
  const title = document.createElement('h2');
  title.textContent = `🎊 ${location.name} completed!`;
  title.style.cssText = 'color: #9B59B6; font-size: 32px; margin-bottom: 20px;';
  panel.appendChild(title);
  
  const btn = document.createElement('button');
  btn.textContent = 'Continue';
  btn.style.cssText = `
    padding: 15px 30px;
    background: linear-gradient(135deg, #BA68C8 0%, #9B59B6 100%);
    color: #fff;
    border: none;
    border-radius: 0.9rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    margin-top: 20px;
    box-shadow: 0 12px 20px rgba(155, 89, 182, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  `;
  
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 15px 25px rgba(155, 89, 182, 0.5)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 12px 20px rgba(155, 89, 182, 0.4)';
  });
  
  btn.addEventListener('click', () => {
    overlay.remove();
  });
  
  panel.appendChild(btn);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

function showLocationLocked(location) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(18, 55, 103);
    border: 4px solid #f44336;
    border-radius: 15px;
    padding: 20px 40px;
    color: #f44336;
    font-size: 24px;
    font-weight: bold;
    font-family: 'Comic Neue', cursive;
    z-index: 99998;
    text-align: center;
  `;
  notification.innerHTML = `${location.name} is locked.<br>Complete previous missions to unlock.`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => notification.remove(), 500);
  }, 2000);
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
    // Detectar número de juego desde la URL
    const path = window.location.pathname;
    let numeroJuego = 1;
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

// Función para mostrar el botón de finalizar
function showFinishButton() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;
  
  // Detener música de fondo
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
  
  const totalMissions = locationData.reduce((sum, loc) => sum + loc.missions.length, 0);
  const totalLocations = locationData.length;
  
  // Crear overlay para el botón de finalizar
  const finishOverlay = document.createElement('div');
  finishOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  const finishCard = document.createElement('div');
  finishCard.style.cssText = `
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.95) 0%, rgba(138, 43, 226, 0.95) 100%);
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    max-width: 400px;
    width: 90%;
  `;
  
  finishCard.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <i class="bx bx-trophy" style="font-size: 64px; color: #ffd700; margin-bottom: 1rem;"></i>
      <h2 style="color: #fff; margin-bottom: 0.5rem; font-size: 24px;">¡Aventura Completada!</h2>
      <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px;">
        Exploraste ${totalLocations} ubicaciones y completaste ${totalMissions} misiones.
      </p>
    </div>
    <button id="btn-finalizar-aventura" style="
      background: #fff;
      color: #9c27b0;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transition: all 0.3s;
      width: 100%;
    ">
      <i class="bx bx-check-circle" style="margin-right: 0.5rem;"></i>
      Finalizar Aventura
    </button>
  `;
  
  finishOverlay.appendChild(finishCard);
  document.body.appendChild(finishOverlay);
  
  // Agregar efecto hover al botón
  const finishButton = document.getElementById('btn-finalizar-aventura');
  finishButton.addEventListener('mouseenter', () => {
    finishButton.style.transform = 'translateY(-3px) scale(1.05)';
    finishButton.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
  });
  
  finishButton.addEventListener('mouseleave', () => {
    finishButton.style.transform = 'translateY(0) scale(1)';
    finishButton.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
  });
  
  // Al hacer clic en el botón, mostrar la pantalla de finalización
  finishButton.addEventListener('click', () => {
    finishOverlay.remove();
    showGameComplete();
  });
}

async function showGameComplete() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;
  
  // Detener música de fondo
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
  
  // Reproducir sonido de victoria si existe
  if (victorySound) {
    victorySound = new Audio('/static/assets/exam.mp3');
    victorySound.volume = 0.7;
    victorySound.currentTime = 0;
    victorySound.play().catch(() => {});
  }
  
  const totalMissions = locationData.reduce((sum, loc) => sum + loc.missions.length, 0);
  const totalLocations = locationData.length;
  
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
  gameContainer.innerHTML = `
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
  const isAuthenticated = true; // Asumimos que está autenticado si llegó aquí
  
  const finalScore = completionData?.best_score || score;
  const minScoreRequired = 10;
  const canAdvance = finalScore >= minScoreRequired;
  
  // Función para manejar el botón "Volver"
  const handleBackButton = async (e) => {
    e.preventDefault();
    
    // Si el progreso no se ha guardado, intentar guardarlo de nuevo
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
  
  gameContainer.innerHTML = `
    <div class="game-complete victory-screen-enter">
      <div class="complete-content victory-content-enter">
        <div style="text-align: center; margin-bottom: 0.75rem;" class="trophy-animation">
          <i class="bx bx-trophy" style="font-size: 40px; color: #ffd700;"></i>
        </div>
        <h2 class="complete-title title-animation">¡Felicidades!</h2>
        <p class="complete-message message-animation">Has completado todos los niveles</p>
        ${progressSaved && isAuthenticated ? '<p style="color: #00ff00; font-size: 13px; margin-bottom: 0.5rem;">✅ Progreso guardado correctamente</p>' : ''}
        <div style="background: rgba(156, 39, 176, 0.1); padding: 1rem; border-radius: 15px; margin: 0.75rem 0; border: 2px solid rgba(156, 39, 176, 0.3);" class="stats-animation">
          <p class="complete-score" style="font-size: 20px; margin-bottom: 0.5rem;">
            <i class="bx bx-star" style="color: #ffd700;"></i>
            Puntuación: <span style="color: #9c27b0;">${finalScore}</span> puntos
          </p>
          <p class="complete-time" style="font-size: 16px; margin-bottom: 0.5rem;">
            <i class="bx bx-check-circle" style="color: #9c27b0;"></i>
            Misiones: <span style="color: #9c27b0;">${missionsCompleted}/${totalMissions}</span>
          </p>
          <p class="complete-time" style="font-size: 16px;">
            <i class="bx bx-map" style="color: #9c27b0;"></i>
            Ubicaciones: <span style="color: #9c27b0;">${totalLocations}</span>
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

function restartGame() {
  // Detener animaciones
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Detener música de fondo
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
  
  // Detener el juego
  gameRunning = false;
  
  // Resetear todas las variables del juego
  score = 0;
  missionsCompleted = 0;
  mapOffsetX = 0;
  mapOffsetY = 0;
  zoomLevel = 0.8;
  hoveredLocation = null;
  hoverAnimationTime = 0;
  imagesLoaded = 0;
  isDragging = false;
  
  // Resetear todas las ubicaciones
  locationData.forEach((location, index) => {
    location.unlocked = index === 0; // Solo la primera ubicación desbloqueada
    location.missions.forEach(mission => {
      mission.completed = false;
    });
  });
  
  // Reiniciar el juego
  initGame();
}

function showInstructions() {
  const overlay = document.createElement('div');
  overlay.className = 'instructions-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(18, 55, 103, 0.95) 100%);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    box-sizing: border-box;
    animation: fadeIn 0.4s ease;
  `;
  
  const panel = document.createElement('div');
  panel.className = 'instructions-panel';
  panel.style.cssText = `
    background: linear-gradient(135deg, rgb(18, 55, 103) 0%, rgb(25, 65, 115) 100%);
    border: 3px solid #9B59B6;
    border-radius: 20px;
    padding: 20px 30px;
    max-width: 580px;
    width: 100%;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    text-align: center;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6),
                0 0 60px rgba(155, 89, 182, 0.4),
                inset 0 2px 10px rgba(255, 255, 255, 0.1);
    animation: panelSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    overflow: hidden;
  `;
  
  // Efecto de brillo decorativo
  const shine = document.createElement('div');
  shine.style.cssText = `
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    animation: shine 3s infinite;
    pointer-events: none;
  `;
  panel.appendChild(shine);
  
  // Icono de bienvenida
  const iconContainer = document.createElement('div');
  iconContainer.style.cssText = `
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
  `;
  const icon = document.createElement('div');
  icon.innerHTML = '<i class="bx bx-world" style="font-size: 40px; color: #9B59B6; animation: bounceIn 0.8s ease;"></i>';
  iconContainer.appendChild(icon);
  panel.appendChild(iconContainer);
  
  const title = document.createElement('h2');
  title.textContent = '¡Bienvenido a English Adventure Map!';
  title.style.cssText = `
    color: #9B59B6;
    font-size: 22px;
    margin-bottom: 4px;
    font-weight: 800;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
    line-height: 1.2;
  `;
  panel.appendChild(title);
  
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Explora el mapa y completa misiones para aprender inglés';
  subtitle.style.cssText = `
    color: #BA68C8;
    font-size: 13px;
    margin-bottom: 15px;
    font-weight: 500;
  `;
  panel.appendChild(subtitle);
  
  // Contenedor de instrucciones
  const instructionsContainer = document.createElement('div');
  instructionsContainer.style.cssText = `
    background: rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 15px 18px;
    margin-bottom: 15px;
    border: 2px solid rgba(155, 89, 182, 0.3);
    text-align: left;
  `;
  
  const instructions = [
    {
      icon: 'bx-move',
      text: 'Arrastra el mapa con el mouse para explorar diferentes ubicaciones',
      color: '#54f6c3'
    },
    {
      icon: 'bx-mouse',
      text: 'Haz clic en los edificios desbloqueados para iniciar misiones',
      color: '#BA68C8'
    },
    {
      icon: 'bx-check-circle',
      text: 'Completa las misiones respondiendo preguntas en inglés',
      color: '#54f6c3'
    },
    {
      icon: 'bx-lock-open',
      text: 'Desbloquea nuevas ubicaciones completando todas las misiones',
      color: '#BA68C8'
    },
    {
      icon: 'bx-trophy',
      text: 'Gana puntos por cada respuesta correcta y completa todas las ubicaciones',
      color: '#54f6c3'
    }
  ];
  
  instructions.forEach((instruction, index) => {
    const instructionItem = document.createElement('div');
    instructionItem.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: ${index < instructions.length - 1 ? '10px' : '0'};
      padding: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      transition: transform 0.2s ease, background 0.2s ease;
    `;
    
    instructionItem.innerHTML = `
      <div style="
        width: 35px;
        height: 35px;
        background: linear-gradient(135deg, ${instruction.color}22, ${instruction.color}11);
        border: 2px solid ${instruction.color}66;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      ">
        <i class="bx ${instruction.icon}" style="font-size: 18px; color: ${instruction.color};"></i>
      </div>
      <p style="
        margin: 0;
        color: #fff;
        font-size: 12px;
        line-height: 1.35;
        font-weight: 500;
        flex: 1;
      ">${instruction.text}</p>
    `;
    
    instructionItem.addEventListener('mouseenter', () => {
      instructionItem.style.transform = 'translateX(5px)';
      instructionItem.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    instructionItem.addEventListener('mouseleave', () => {
      instructionItem.style.transform = 'translateX(0)';
      instructionItem.style.background = 'rgba(255, 255, 255, 0.05)';
    });
    
    instructionsContainer.appendChild(instructionItem);
  });
  
  panel.appendChild(instructionsContainer);
  
  // Botón de comenzar
  const btn = document.createElement('button');
  btn.className = 'instructions-start-btn';
  btn.innerHTML = '<i class="bx bx-play-circle" style="font-size: 18px; margin-right: 6px;"></i> Comenzar Aventura';
  btn.style.cssText = `
    padding: 12px 30px;
    background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 12px 30px rgba(155, 89, 182, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    position: relative;
    overflow: hidden;
  `;
  
  // Efecto hover del botón
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-3px) scale(1.05)';
    btn.style.boxShadow = '0 15px 40px rgba(155, 89, 182, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0) scale(1)';
    btn.style.boxShadow = '0 12px 30px rgba(155, 89, 182, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)';
  });
  
  btn.addEventListener('click', () => {
    panel.style.animation = 'panelSlideOut 0.3s ease forwards';
    setTimeout(() => {
      overlay.remove();
    }, 300);
  });
  
  panel.appendChild(btn);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  
  // Cerrar al hacer clic fuera del panel
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      panel.style.animation = 'panelSlideOut 0.3s ease forwards';
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
  });
}

// ============================================
// AUDIO
// ============================================

function initAudio() {
  const musicUrl = window.gameConfig?.musicUrl || '/static/assets/english/ingmusic.mp3';
  const correctSoundUrl = window.gameConfig?.correctSoundUrl || '/static/assets/math/acierto.mp3';
  const incorrectSoundUrl = window.gameConfig?.incorrectSoundUrl || '/static/assets/math/error.mp3';
  
  console.log('Cargando audio desde:', { musicUrl, correctSoundUrl, incorrectSoundUrl });
  
  backgroundMusic = new Audio(musicUrl);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;
  
  correctSound = new Audio(correctSoundUrl);
  correctSound.volume = 0.7;
  
  incorrectSound = new Audio(incorrectSoundUrl);
  incorrectSound.volume = 0.7;
  
  backgroundMusic.play().catch(err => {
    console.log('No se pudo reproducir música automáticamente:', err);
  });
}

function playCorrectSound() {
  if (correctSound) {
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
  }
}

function playIncorrectSound() {
  if (incorrectSound) {
    incorrectSound.currentTime = 0;
    incorrectSound.play().catch(() => {});
  }
}

function setupVolumeControl() {
  const volumeSlider = document.getElementById('volume-slider');
  const musicIcon = document.getElementById('music-icon');
  const musicToggle = document.getElementById('music-toggle');
  const volumeLevel = document.getElementById('volume-level');
  
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      musicVolume = e.target.value / 100;
      if (backgroundMusic) {
        backgroundMusic.volume = musicVolume;
      }
      
      if (volumeLevel) {
        volumeLevel.textContent = Math.round(musicVolume * 100) + '%';
      }
      
      if (musicIcon) {
        if (musicVolume === 0) {
          musicIcon.className = 'bx bx-volume-mute';
        } else if (musicVolume < 0.5) {
          musicIcon.className = 'bx bx-volume-low';
        } else {
          musicIcon.className = 'bx bx-volume-full';
        }
      }
    });
  }
  
  if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play();
        if (musicIcon) {
          musicIcon.className = musicVolume === 0 ? 'bx bx-volume-mute' : 
                                musicVolume < 0.5 ? 'bx bx-volume-low' : 'bx bx-volume-full';
        }
      } else {
        backgroundMusic.pause();
        if (musicIcon) {
          musicIcon.className = 'bx bx-volume-mute';
        }
      }
    });
  }
}
