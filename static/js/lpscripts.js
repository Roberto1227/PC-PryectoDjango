const container = document.querySelector(".container");
const btnSingIn = document.getElementById("btn-sign-in");
const btnSingUp = document.getElementById("btn-sign-up");

btnSingIn.addEventListener("click", () => {
    container.classList.remove("toggle");
});

btnSingUp.addEventListener("click", () => {
    container.classList.add("toggle");
});

// ========== CONFIGURACIÓN DE AUTENTICACIÓN SOCIAL ==========
// NOTA: Para producción, necesitarás configurar tus propias credenciales:
// - Facebook App ID: https://developers.facebook.com/
// - Google Client ID: https://console.cloud.google.com/

// Configuración (reemplaza con tus credenciales reales)
const FACEBOOK_APP_ID = 'TU_FACEBOOK_APP_ID'; // Reemplazar con tu App ID
const GOOGLE_CLIENT_ID = '855312988729-u3d0a2qu2due63nfe3r6808dkn88gcl5.apps.googleusercontent.com'; // Reemplazar con tu Client ID

// ========== FACEBOOK LOGIN ==========
function initFacebookSDK() {
    window.fbAsyncInit = function() {
        FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
        });
    };
}

function loginWithFacebook(isRegister = false) {
    if (FACEBOOK_APP_ID === 'TU_FACEBOOK_APP_ID') {
        alert('Por favor, configura tu Facebook App ID en js/lpscripts.js');
        return;
    }

    FB.login(function(response) {
        if (response.authResponse) {
            // Usuario autenticado
            FB.api('/me', {fields: 'name,email,picture'}, function(userInfo) {
                handleSocialLogin({
                    provider: 'facebook',
                    name: userInfo.name,
                    email: userInfo.email || '',
                    picture: userInfo.picture?.data?.url || '',
                    id: userInfo.id
                }, isRegister);
            });
        } else {
            console.log('Usuario canceló el login o no autorizó la aplicación.');
        }
    }, {scope: 'email,public_profile'});
}

// ========== INSTAGRAM LOGIN (usa Facebook) ==========
function loginWithInstagram(isRegister = false) {
    // Instagram usa Facebook Login, así que redirigimos a Facebook
    // Para acceso completo a Instagram API, necesitarías Instagram Basic Display API
    if (FACEBOOK_APP_ID === 'TU_FACEBOOK_APP_ID') {
        alert('Por favor, configura tu Facebook App ID en js/lpscripts.js');
        return;
    }

    FB.login(function(response) {
        if (response.authResponse) {
            FB.api('/me', {fields: 'name,email,picture'}, function(userInfo) {
                handleSocialLogin({
                    provider: 'instagram',
                    name: userInfo.name,
                    email: userInfo.email || '',
                    picture: userInfo.picture?.data?.url || '',
                    id: userInfo.id
                }, isRegister);
            });
        }
    }, {scope: 'email,public_profile'});
}

// ========== GOOGLE LOGIN ==========
let googleIsRegister = false;

function initGoogleSignIn() {
    if (GOOGLE_CLIENT_ID === 'TU_GOOGLE_CLIENT_ID') {
        console.warn('Por favor, configura tu Google Client ID en js/lpscripts.js');
        // Para pruebas, usar un Client ID de demostración (no funcionará completamente)
        return;
    }

    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse
        });
    }
}

function handleGoogleResponse(response) {
    try {
        // Decodificar el token JWT
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        handleSocialLogin({
            provider: 'google',
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            id: payload.sub
        }, googleIsRegister);
    } catch (error) {
        console.error('Error procesando respuesta de Google:', error);
        alert('Error al procesar la autenticación de Google');
    }
}

function loginWithGoogle(isRegister = false) {
    googleIsRegister = isRegister;
    
    if (GOOGLE_CLIENT_ID === 'TU_GOOGLE_CLIENT_ID') {
        alert('Por favor, configura tu Google Client ID en js/lpscripts.js');
        return;
    }

    // Verificar que Google SDK esté cargado
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
        alert('Google Sign-In no está disponible. Por favor, espera a que se cargue el SDK.');
        return;
    }

    // Obtener el origen y pathname actual
    const currentOrigin = window.location.origin;
    const currentPath = window.location.pathname;
    const fullUri = currentOrigin + currentPath;

    console.log('Intentando autenticar desde:', currentOrigin);
    console.log('URI completo:', fullUri);

    // Usar el método de popup (el redirect_uri se determina automáticamente desde el origen)
    const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: (response) => {
            if (response && response.access_token) {
                // Obtener información del usuario
                fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${response.access_token}`
                    }
                })
                .then(res => res.json())
                .then(userInfo => {
                    handleSocialLogin({
                        provider: 'google',
                        name: userInfo.name,
                        email: userInfo.email,
                        picture: userInfo.picture,
                        id: userInfo.id
                    }, isRegister);
                })
                .catch(error => {
                    console.error('Error obteniendo información de Google:', error);
                    alert('Error al obtener información del usuario');
                });
            } else {
                console.error('Error en la respuesta de Google:', response);
                if (response && response.error) {
                    console.error('Error de Google:', response.error);
                    if (response.error === 'redirect_uri_mismatch') {
                        alert('Error de configuración:\n\nEl URI de redirección no coincide.\n\nPor favor, agrega estos URIs en Google Cloud Console:\n- ' + currentOrigin + '\n- ' + fullUri + '\n\nVe a: APIs y servicios > Credenciales > Tu cliente OAuth > Editar');
                    } else {
                        alert('Error al autenticarse con Google: ' + response.error);
                    }
                } else {
                    alert('Error al autenticarse con Google. Por favor, intenta de nuevo.');
                }
            }
        }
    });
    
    // Solicitar el token de acceso
    client.requestAccessToken();
}

// ========== MANEJO DE RESPUESTA DE AUTENTICACIÓN ==========
function handleSocialLogin(userData, isRegister) {
    console.log('Usuario autenticado:', userData);
    
    // Guardar datos en localStorage (en producción, esto debería ir al servidor)
    localStorage.setItem('user', JSON.stringify({
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        provider: userData.provider,
        loggedIn: true,
        timestamp: new Date().toISOString()
    }));

    // Mostrar mensaje de éxito
    const message = isRegister 
        ? `¡Bienvenido ${userData.name}! Tu cuenta ha sido creada.`
        : `¡Bienvenido de nuevo ${userData.name}!`;
    
    alert(message);
    
    // Redirigir a la página principal
    window.location.href = 'index.html';
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Facebook SDK
    initFacebookSDK();
    
    // Esperar a que Google SDK esté listo
    function initGoogleWhenReady() {
        if (typeof google !== 'undefined' && google.accounts) {
            initGoogleSignIn();
        } else {
            setTimeout(initGoogleWhenReady, 100);
        }
    }
    
    // Inicializar Google después de que el SDK se cargue
    if (document.readyState === 'loading') {
        window.addEventListener('load', initGoogleWhenReady);
    } else {
        initGoogleWhenReady();
    }

    // Facebook Login
    const facebookLogin = document.getElementById('facebook-login');
    const facebookRegister = document.getElementById('facebook-register');
    
    if (facebookLogin) {
        facebookLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof FB !== 'undefined') {
                loginWithFacebook(false);
            } else {
                alert('Facebook SDK aún no está cargado. Por favor, espera un momento e intenta de nuevo.');
            }
        });
    }
    if (facebookRegister) {
        facebookRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof FB !== 'undefined') {
                loginWithFacebook(true);
            } else {
                alert('Facebook SDK aún no está cargado. Por favor, espera un momento e intenta de nuevo.');
            }
        });
    }

    // Instagram Login (usa Facebook)
    const instagramLogin = document.getElementById('instagram-login');
    const instagramRegister = document.getElementById('instagram-register');
    
    if (instagramLogin) {
        instagramLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof FB !== 'undefined') {
                loginWithInstagram(false);
            } else {
                alert('Facebook SDK aún no está cargado. Por favor, espera un momento e intenta de nuevo.');
            }
        });
    }
    if (instagramRegister) {
        instagramRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof FB !== 'undefined') {
                loginWithInstagram(true);
            } else {
                alert('Facebook SDK aún no está cargado. Por favor, espera un momento e intenta de nuevo.');
            }
        });
    }

    // Google Login
    const googleLogin = document.getElementById('google-login');
    const googleRegister = document.getElementById('google-register');
    
    if (googleLogin) {
        googleLogin.addEventListener('click', (e) => {
            e.preventDefault();
            loginWithGoogle(false);
        });
    }
    if (googleRegister) {
        googleRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginWithGoogle(true);
        });
    }
});