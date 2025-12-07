// Variable para controlar si el juego ya fue inicializado
let gameInitialized = false;

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  // Obtener elementos
  const modalOverlay = document.getElementById('modal-overlay');
  const btnIniciar = document.getElementById('btn-iniciar');
  const pageContent = document.getElementById('page-content');
  const body = document.body;

  if (!modalOverlay || !btnIniciar) {
    console.error('Elementos del modal no encontrados');
    return;
  }

  // Agregar clase al body para prevenir scroll cuando el modal está visible
  if (body) {
    body.classList.add('modal-open');
  }

  // Función para ocultar el modal
  btnIniciar.addEventListener('click', function() {
    console.log('Botón INICIAR clickeado');
    modalOverlay.classList.add('modal-hidden');
    if (body) {
      body.classList.remove('modal-open');
    }
    
    // Inicializar el juego cuando se cierra el modal
    if (!gameInitialized) {
      // Esperar un momento para que el modal se oculte completamente
      setTimeout(() => {
        console.log('Inicializando juego...');
        if (typeof initGame === 'function') {
          initGame();
        } else if (typeof createGameInterface === 'function') {
          createGameInterface();
          if (typeof startGame === 'function') {
            startGame();
          }
        } else {
          console.warn('No se encontró función initGame, createGameInterface o startGame');
        }
        gameInitialized = true;
      }, 100);
    }
  });

  // Prevenir que el clic en el modal cierre la ventana
  const modalContainer = document.querySelector('.modal-container');
  if (modalContainer) {
    modalContainer.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});
















