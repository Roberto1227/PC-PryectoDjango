/**
 * Sistema de seguimiento de progreso para juegos y exámenes
 * Guarda automáticamente el progreso cuando el usuario completa un juego o examen
 */

// Configuración del juego actual (se detecta automáticamente desde la URL)
window.gameProgressConfig = {
  modulo: null,        // 'matematicas', 'ciencias', 'gramatica', 'ingles'
  numeroJuego: null,   // 1-5 para juegos, null para exámenes
  esExamen: false,     // true si es un examen
  tipoExamen: null      // 'matematicas', 'ciencias', 'gramatica', 'ingles' (solo para exámenes)
};

/**
 * Detecta automáticamente el módulo y número de juego desde la URL
 */
function detectarConfiguracionJuego() {
  const path = window.location.pathname;
  
  // Detectar si es un examen
  if (path.includes('/examat')) {
    window.gameProgressConfig.esExamen = true;
    window.gameProgressConfig.tipoExamen = 'matematicas';
    return;
  } else if (path.includes('/exacien')) {
    window.gameProgressConfig.esExamen = true;
    window.gameProgressConfig.tipoExamen = 'ciencias';
    return;
  } else if (path.includes('/exagra')) {
    window.gameProgressConfig.esExamen = true;
    window.gameProgressConfig.tipoExamen = 'gramatica';
    return;
  } else if (path.includes('/exaing')) {
    window.gameProgressConfig.esExamen = true;
    window.gameProgressConfig.tipoExamen = 'ingles';
    return;
  }
  
  // Detectar módulo y número de juego
  if (path.includes('/matjuego')) {
    window.gameProgressConfig.modulo = 'matematicas';
    const match = path.match(/matjuego(\d+)/);
    if (match) {
      window.gameProgressConfig.numeroJuego = parseInt(match[1]);
    }
  } else if (path.includes('/cienjuego')) {
    window.gameProgressConfig.modulo = 'ciencias';
    const match = path.match(/cienjuego(\d+)/);
    if (match) {
      window.gameProgressConfig.numeroJuego = parseInt(match[1]);
    }
  } else if (path.includes('/gramjuego')) {
    window.gameProgressConfig.modulo = 'gramatica';
    const match = path.match(/gramjuego(\d+)/);
    if (match) {
      window.gameProgressConfig.numeroJuego = parseInt(match[1]);
    }
  } else if (path.includes('/ingjuego')) {
    window.gameProgressConfig.modulo = 'ingles';
    const match = path.match(/ingjuego(\d+)/);
    if (match) {
      window.gameProgressConfig.numeroJuego = parseInt(match[1]);
    }
  }
  
  console.log('Configuración detectada:', window.gameProgressConfig);
}

/**
 * Guarda el progreso de un juego completado
 */
async function guardarProgresoJuego(modulo, numeroJuego, puntuacion) {
  try {
    const response = await fetch('/api/guardar-progreso-juego/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        modulo: modulo,
        numero_juego: numeroJuego,
        puntuacion: puntuacion || 0
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log('Progreso del juego guardado correctamente');
      return true;
    } else {
      console.error('Error al guardar progreso:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error al guardar progreso del juego:', error);
    return false;
  }
}

/**
 * Guarda el progreso de un examen completado
 */
async function guardarProgresoExamen(tipoExamen, puntuacion, aprobado) {
  try {
    const response = await fetch('/api/guardar-progreso-examen/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        tipo_examen: tipoExamen,
        puntuacion: puntuacion || 0,
        aprobado: aprobado || false
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log('Progreso del examen guardado correctamente');
      return true;
    } else {
      console.error('Error al guardar progreso:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error al guardar progreso del examen:', error);
    return false;
  }
}

/**
 * Obtiene el valor de una cookie
 */
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

/**
 * Intercepta los clics en botones "Volver" y "Volver a jugar" para guardar el progreso
 */
function setupProgressTracking() {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupProgressTracking);
    return;
  }

  // Detectar configuración del juego
  detectarConfiguracionJuego();

  // Interceptar clics en botones "Volver" y "Volver a jugar" después de un delay
  // para que los botones se hayan creado dinámicamente
  setTimeout(() => {
    // Interceptar todos los enlaces "Volver" y botones "Volver a jugar"
    document.addEventListener('click', async function(e) {
      const target = e.target.closest('a.back-button, a[href*="matematica"], a[href*="ciencia"], a[href*="gramatica"], a[href*="ingles"]');
      const button = e.target.closest('button.restart-button, button[onclick*="restart"], button[onclick*="location.reload"]');
      
      if (target || button) {
        // Si es un botón de "Volver a jugar", guardar progreso pero permitir reiniciar
        if (button && (button.textContent.includes('Jugar') || button.textContent.includes('jugar'))) {
          // Guardar progreso antes de reiniciar si el juego está completado
          if (window.gameProgressConfig.modulo && window.gameProgressConfig.numeroJuego) {
            let puntuacion = 0;
            const scoreElement = document.querySelector('.complete-score span, .stats-animation span, .complete-lives');
            if (scoreElement) {
              const scoreText = scoreElement.textContent.trim();
              const scoreMatch = scoreText.match(/\d+/);
              if (scoreMatch) {
                puntuacion = parseInt(scoreMatch[0]);
              }
            }
            await guardarProgresoJuego(
              window.gameProgressConfig.modulo,
              window.gameProgressConfig.numeroJuego,
              puntuacion
            );
          }
          return; // Permitir que el botón funcione normalmente
        }

        // Si es un enlace "Volver", guardar el progreso antes de navegar
        if (target && window.gameProgressConfig.modulo && window.gameProgressConfig.numeroJuego) {
          e.preventDefault();
          
          // Obtener la puntuación del juego si está disponible
          let puntuacion = 0;
          const scoreElement = document.querySelector('.complete-score span, .stats-animation span, .complete-lives');
          if (scoreElement) {
            const scoreText = scoreElement.textContent.trim();
            const scoreMatch = scoreText.match(/\d+/);
            if (scoreMatch) {
              puntuacion = parseInt(scoreMatch[0]);
            }
          }

          // Guardar el progreso
          await guardarProgresoJuego(
            window.gameProgressConfig.modulo,
            window.gameProgressConfig.numeroJuego,
            puntuacion
          );

          // Navegar después de guardar
          window.location.href = target.getAttribute('href');
        }
      }
    }, true); // Usar capture phase para interceptar antes
  }, 1000);
}

/**
 * Intercepta el envío de exámenes para guardar el progreso
 */
function setupExamTracking() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupExamTracking);
    return;
  }

  // Detectar configuración del examen
  detectarConfiguracionJuego();

  // Inicializar flag de examen guardado
  if (!window.gameProgressConfig.examenGuardado) {
    window.gameProgressConfig.examenGuardado = false;
  }

  // Buscar botones de "Finalizar" en exámenes
  setTimeout(() => {
    // Observar cambios en el DOM para detectar cuando se muestran los resultados
    const observer = new MutationObserver(async function(mutations) {
      if (window.gameProgressConfig.esExamen && window.gameProgressConfig.tipoExamen && !window.gameProgressConfig.examenGuardado) {
        // Buscar elementos de resultados del examen con múltiples selectores
        const resultsSection = document.querySelector('.exam-results-screen, #reto-results-section, .results-card');
        const correctElement = document.querySelector('.stat-value, #final-correct, [id*="correct"], .correct-stat + .stat-content .stat-value');
        
        // Si hay resultados visibles y aún no se ha guardado
        if (resultsSection && correctElement) {
          let puntuacion = 0;
          let aprobado = false;

          // Intentar obtener la puntuación de diferentes formas
          const correctText = correctElement.textContent || correctElement.innerText || '';
          const match = correctText.match(/\d+/);
          if (match) {
            puntuacion = parseInt(match[0]);
          }
          
          // También buscar en otros elementos de estadísticas
          if (puntuacion === 0) {
            const allStatValues = document.querySelectorAll('.stat-value');
            for (let stat of allStatValues) {
              const text = stat.textContent || stat.innerText || '';
              if (text.includes('Aciertos') || stat.previousElementSibling?.textContent?.includes('Aciertos')) {
                const numMatch = text.match(/\d+/);
                if (numMatch) {
                  puntuacion = parseInt(numMatch[0]);
                  break;
                }
              }
            }
          }

          // Determinar si está aprobado (10 o más aciertos)
          aprobado = puntuacion >= 10;

          // Solo guardar si tenemos una puntuación válida
          if (puntuacion > 0) {
            console.log('Guardando examen:', {
              tipo: window.gameProgressConfig.tipoExamen,
              puntuacion: puntuacion,
              aprobado: aprobado
            });

            // Guardar el progreso del examen
            const guardado = await guardarProgresoExamen(
              window.gameProgressConfig.tipoExamen,
              puntuacion,
              aprobado
            );
            
            if (guardado) {
              // Marcar como guardado para evitar guardar múltiples veces
              window.gameProgressConfig.examenGuardado = true;
              console.log('✅ Examen guardado correctamente');
            }
          }
        }
      }
    });

    // Observar cambios en el body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // También interceptar clics en el botón "Finalizar"
    document.addEventListener('click', async function(e) {
      const finishButton = e.target.closest('.finish-button, button[class*="finish"], a[class*="finish"]');
      
      if (finishButton && window.gameProgressConfig.esExamen && window.gameProgressConfig.tipoExamen) {
        // Si aún no se ha guardado, intentar guardar antes de redirigir
        if (!window.gameProgressConfig.examenGuardado) {
          e.preventDefault();
          
          // Buscar la puntuación
          let puntuacion = 0;
          let aprobado = false;
          
          const correctElement = document.querySelector('.stat-value, #final-correct, [id*="correct"]');
          if (correctElement) {
            const text = correctElement.textContent || correctElement.innerText || '';
            const match = text.match(/\d+/);
            if (match) {
              puntuacion = parseInt(match[0]);
              aprobado = puntuacion >= 10;
            }
          }

          // Si no encontramos la puntuación, buscar en todos los stat-value
          if (puntuacion === 0) {
            const allStats = document.querySelectorAll('.stat-content');
            for (let stat of allStats) {
              const label = stat.querySelector('.stat-label');
              const value = stat.querySelector('.stat-value');
              if (label && value && (label.textContent.includes('Aciertos') || label.textContent.includes('Correct'))) {
                const match = value.textContent.match(/\d+/);
                if (match) {
                  puntuacion = parseInt(match[0]);
                  aprobado = puntuacion >= 10;
                  break;
                }
              }
            }
          }

          if (puntuacion > 0) {
            console.log('Guardando examen desde botón Finalizar:', {
              tipo: window.gameProgressConfig.tipoExamen,
              puntuacion: puntuacion,
              aprobado: aprobado
            });

            await guardarProgresoExamen(
              window.gameProgressConfig.tipoExamen,
              puntuacion,
              aprobado
            );
            
            window.gameProgressConfig.examenGuardado = true;
          }

          // Esperar un momento y luego redirigir
          setTimeout(() => {
            if (finishButton.href) {
              window.location.href = finishButton.href;
            } else if (finishButton.getAttribute('href')) {
              window.location.href = finishButton.getAttribute('href');
            }
          }, 300);
        }
      }
    }, true);
  }, 1000);
}

// Inicializar el seguimiento cuando se carga el script
setupProgressTracking();
setupExamTracking();

