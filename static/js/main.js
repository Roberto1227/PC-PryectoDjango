/*menu*/
// Envolver en try-catch para evitar errores que rompan la página
try {
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if(navToggle) {
    navToggle.addEventListener('click', () =>  {
        navMenu.classList.add('show-menu')
    })
}

if(navClose) {
    navClose.addEventListener('click', () =>  {
        navMenu.classList.remove('show-menu')
    })
}

/* remove menu mobile*/
const navLink = document.querySelectorAll('.navLink')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // Solo cerrar el menú móvil cuando se hace clic en un enlace
    navMenu.classList.remove('show-menu')
    // Permitir que el enlace funcione normalmente (no prevenir el comportamiento por defecto)
}

navLink.forEach(n => {
    n.addEventListener('click', linkAction);
})

/*swiper nuevos slider */

let newSwiper = new Swiper (".new-swiper", {
    centeredSlides: true,
    slidesPerView: "auto",
    loop: 'true',
    spaceBetween: 16,
})



/*Background header*/

function scrollHeader() {
    const header = document.getElementById('header')
    if (header) {
        if(window.scrollY >= 50) header.classList.add('scroll-header'); 
        else header.classList.remove('scroll-header');
    }
}
window.addEventListener('scroll', scrollHeader)

/*scroll section*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset 
    sections.forEach(current =>  {
        const sectionHeight = current.offsetHeight,
        sectionTop = current.offsetTop -58,
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            const activeLink = document.querySelector('.navM a[href*='+ sectionId + ']')
            if(activeLink) activeLink.classList.add('active-link')
        }
        else {
            const activeLink = document.querySelector('.navM a[href*='+ sectionId + ']')
            if(activeLink) activeLink.classList.remove('active-link')
        }
    } )
}
window.addEventListener('scroll', scrollActive)


/*scroll up*/
// Solo ejecutar cuando el DOM esté listo y si el elemento existe
// Nota: Este código solo se ejecuta si el elemento con id 'scroll-up' existe en la página
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    function setupScrollUp() {
        var scrollUpElement = document.getElementById('scroll-up');
        if (!scrollUpElement) {
            return; // El elemento no existe, salir silenciosamente
        }
        
        function handleScroll() {
            var element = document.getElementById('scroll-up');
            if (element && element.classList) {
                if(window.scrollY >= 460) {
                    element.classList.add('show-scroll');
                } else {
                    element.classList.remove('show-scroll');
                }
            }
        }
        
        // Verificar que addEventListener existe y es una función
        if (window.addEventListener && typeof window.addEventListener === 'function') {
            window.addEventListener('scroll', handleScroll);
        }
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        if (document.addEventListener && typeof document.addEventListener === 'function') {
            document.addEventListener('DOMContentLoaded', setupScrollUp);
        }
    } else {
        setupScrollUp();
    }
}


/*Animation*/
// Solo inicializar ScrollReveal si está disponible
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2500,
        delay: 300
    });
    // Guardar la instancia para que materias.js pueda usarla
    window.srInstance = sr;

    sr.reveal(`.home-swiper, .new-swiper, .newslc`);
    sr.reveal(`.aprendizajedata`, {interval: 100});
    // Animaciones del footer - ejecutar después de que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            sr.reveal(`.footercontainer > div`, {origin: 'bottom', distance: '60px', duration: 2000, delay: 200, interval: 100});
            sr.reveal(`.footercopy`, {origin: 'bottom', distance: '40px', duration: 1500, delay: 400});
        });
    } else {
        sr.reveal(`.footercontainer > div`, {origin: 'bottom', distance: '60px', duration: 2000, delay: 200, interval: 100});
        sr.reveal(`.footercopy`, {origin: 'bottom', distance: '40px', duration: 1500, delay: 400});
    }
    sr.reveal(`.aboutdata, .discountimg`, {origin: 'left'});
    sr.reveal(`.aboutimg, .discountdata`, {origin: 'left'});
}

/* User menu dropdown - Solución definitiva usando delegación de eventos */
(function() {
    'use strict';
    
    // Usar delegación de eventos en el documento para que funcione siempre
    // Esto evita problemas con elementos que se cargan dinámicamente
    
    // Handler para el click en el trigger del menú
    document.addEventListener('click', function(e) {
        // Verificar si el click fue en un trigger del menú de usuario
        const trigger = e.target.closest('.user-menu-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            
            const userMenu = trigger.closest('.user-menu');
            if (!userMenu) return;
            
            const dropdown = userMenu.querySelector('.user-menu-dropdown');
            if (!dropdown) return;
            
            // Cerrar otros dropdowns abiertos
            document.querySelectorAll('.user-menu-dropdown.show').forEach(function(openDropdown) {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('show');
                }
            });
            
            // Toggle el dropdown actual
            dropdown.classList.toggle('show');
            return;
        }
        
        // Si el click fue en un enlace del dropdown, cerrar el dropdown
        const dropdownItem = e.target.closest('.dropdown-item');
        if (dropdownItem) {
            document.querySelectorAll('.user-menu-dropdown.show').forEach(function(dropdown) {
                dropdown.classList.remove('show');
            });
            return;
        }
        
        // Si el click fue fuera del menú, cerrar todos los dropdowns
        if (!e.target.closest('.user-menu')) {
            document.querySelectorAll('.user-menu-dropdown.show').forEach(function(dropdown) {
                dropdown.classList.remove('show');
            });
        }
    }, true); // Usar capture phase para tener prioridad
})();

} catch(error) {
    console.error('Error en main.js:', error);
    // Continuar ejecutando aunque haya errores
}