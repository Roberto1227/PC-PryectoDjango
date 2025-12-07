document.querySelectorAll('.info-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const info = button.parentElement.nextElementSibling;
    info.classList.toggle('hidden');
    info.classList.toggle('fade-in');
  });
});

/*ScrollReveal Animations para materias.html*/
// Esperar a que el DOM esté listo y que main.js haya cargado
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

// Animación para la primera sección "Conoce Nuetras Materias"
sr.reveal('.new-section', {
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200
})

sr.reveal('.new-section-image', {
    origin: 'left',
    distance: '60px',
    duration: 2000,
    delay: 400
})

sr.reveal('.new-section-text', {
    origin: 'right',
    distance: '60px',
    duration: 2000,
    delay: 400
})

// Animación para el título y subtítulo de materias
sr.reveal('.materias-section h3', {
    origin: 'top',
    distance: '40px',
    duration: 1500,
    delay: 200
})

sr.reveal('.materias-section > p', {
    origin: 'top',
    distance: '40px',
    duration: 1500,
    delay: 300
})

// Animación para las tarjetas de materias con intervalo
sr.reveal('.materia-card', {
    origin: 'bottom',
    distance: '60px',
    duration: 2000,
    delay: 200,
    interval: 150
})

// Animación para la sección "¿Porque aprender con juegos?"
sr.reveal('.aprender-section', {
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200
})

sr.reveal('.aprender-image', {
    origin: 'left',
    distance: '60px',
    duration: 2000,
    delay: 400
})

sr.reveal('.aprender-text', {
    origin: 'right',
    distance: '60px',
    duration: 2000,
    delay: 400
})

sr.reveal('.thought-bubble', {
    origin: 'top',
    distance: '40px',
    duration: 1500,
    delay: 300
})

// Animación para la sección de enlaces externos
sr.reveal('.enlaces-section .sectiontitle', {
    origin: 'top',
    distance: '40px',
    duration: 1500,
    delay: 200
})

sr.reveal('.enlaces-subtitle', {
    origin: 'top',
    distance: '40px',
    duration: 1500,
    delay: 300
})

// Animación para las tarjetas de enlaces con intervalo
sr.reveal('.enlace-card', {
    origin: 'bottom',
    distance: '60px',
    duration: 2000,
    delay: 200,
    interval: 150
})

// Las animaciones del footer ya están manejadas por main.js
// No es necesario duplicarlas aquí
}) // Cierre del DOMContentLoaded