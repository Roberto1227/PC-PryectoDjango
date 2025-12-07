/*ScrollReveal Animations para matematica.html*/
document.addEventListener('DOMContentLoaded', function() {
    // Usar la misma instancia de ScrollReveal que main.js o crear una nueva si no existe
    let sr;
    if (window.srInstance) {
        sr = window.srInstance;
    } else {
        sr = ScrollReveal({
            origin: 'top',
            distance: '60px',
            duration: 2500,
            delay: 300,
            reset: false
        });
        window.srInstance = sr;
    }

    // Animación para la sección de introducción
    sr.reveal('.matematica-intro-section .sectiontitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 200
    })

    sr.reveal('.thought-bubble-math', {
        origin: 'left',
        distance: '60px',
        duration: 2000,
        delay: 400
    })

    sr.reveal('.matematica-personaje', {
        origin: 'right',
        distance: '60px',
        duration: 2000,
        delay: 400
    })

    // Animación para el título de juegos
    sr.reveal('.juegos-matematicas-section .sectiontitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 200
    })

    sr.reveal('.juegos-subtitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 300
    })

    // Animación para las tarjetas de juegos con intervalo
    sr.reveal('.juego-card', {
        origin: 'bottom',
        distance: '60px',
        duration: 2000,
        delay: 200,
        interval: 200
    })

    // Animación para la sección de progreso
    sr.reveal('.juegos-progreso-section .sectiontitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 200
    })

    sr.reveal('.progreso-subtitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 300
    })

    // Animación para los juegos de progreso con intervalo
    sr.reveal('.juego-progreso-item', {
        origin: 'bottom',
        distance: '60px',
        duration: 2000,
        delay: 200,
        interval: 150
    })

    // Animación para las líneas de progreso
    sr.reveal('.progreso-linea', {
        origin: 'top',
        distance: '30px',
        duration: 1500,
        delay: 100,
        interval: 100
    })
})

