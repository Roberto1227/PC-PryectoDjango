// Obtener elementos
const modalOverlay = document.getElementById('modal-overlay');
const btnIniciar = document.getElementById('btn-iniciar');
const pageContent = document.getElementById('page-content');
const body = document.body;

// Variable para controlar si el juego ya fue inicializado
let gameInitialized = false;

// Agregar clase al body para prevenir scroll cuando el modal está visible
body.classList.add('modal-open');

// Función para ocultar el modal
btnIniciar.addEventListener('click', function() {
  modalOverlay.classList.add('modal-hidden');
  body.classList.remove('modal-open');
  
  // Inicializar el juego cuando se cierra el modal
  if (!gameInitialized) {
    // Esperar un momento para que el modal se oculte completamente
    setTimeout(() => {
      if (typeof initGame === 'function') {
        initGame();
      } else if (typeof createGameInterface === 'function') {
        createGameInterface();
        if (typeof startGame === 'function') {
          startGame();
        }
      }
      gameInitialized = true;
    }, 100);
  }
});

// Prevenir que el clic en el modal cierre la ventana
const modalContainer = document.querySelector('.modal-container');
modalContainer.addEventListener('click', function(e) {
  e.stopPropagation();
});

