/*ScrollReveal Animations para nosotros.html*/
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

    // Animación para la sección hero
    sr.reveal('.nosotros-hero-section', {
        origin: 'top',
        distance: '60px',
        duration: 2000,
        delay: 200
    })

    sr.reveal('.nosotros-hero-image', {
        origin: 'left',
        distance: '60px',
        duration: 2000,
        delay: 400
    })

    sr.reveal('.nosotros-hero-data', {
        origin: 'right',
        distance: '60px',
        duration: 2000,
        delay: 400
    })

    // Animación para el título de misión
    sr.reveal('.nosotros-mision-section .sectiontitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 200
    })

    // Animación para las tarjetas de misión con intervalo
    sr.reveal('.mision-card', {
        origin: 'bottom',
        distance: '60px',
        duration: 2000,
        delay: 200,
        interval: 150
    })

    // Animación para el título de valores
    sr.reveal('.nosotros-valores-section .sectiontitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 200
    })

    // Animación para las tarjetas de valores con intervalo
    sr.reveal('.valor-card', {
        origin: 'bottom',
        distance: '60px',
        duration: 2000,
        delay: 200,
        interval: 100
    })

    // Animación para el título de equipo
    sr.reveal('.nosotros-equipo-section .sectiontitle', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 200
    })

    sr.reveal('.equipo-description', {
        origin: 'top',
        distance: '40px',
        duration: 1500,
        delay: 300
    })

    // Animación para las tarjetas de equipo con intervalo
    sr.reveal('.equipo-card', {
        origin: 'bottom',
        distance: '60px',
        duration: 2000,
        delay: 200,
        interval: 150
    })

    // Las animaciones del footer ya están manejadas por main.js
    // No es necesario duplicarlas aquí
}) // Cierre del DOMContentLoaded

