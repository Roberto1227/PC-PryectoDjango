# EduRetoSV – Plataforma de Juegos Educativos

EduRetoSV es una plataforma web educativa desarrollada con Django diseñada para niños y niñas que desean aprender mediante juegos interactivos. La plataforma ofrece un sistema de aprendizaje progresivo con juegos, exámenes y seguimiento de progreso personalizado.

## 📋 Descripción del Proyecto

EduRetoSV es una aplicación web educativa que combina diversión y aprendizaje a través de:

- **4 Módulos Educativos**: Matemáticas, Ciencias, Gramática e Inglés
- **20 Juegos Interactivos**: 5 juegos por módulo con diferentes mecánicas de juego
- **Sistema de Progreso Progresivo**: Los juegos se desbloquean secuencialmente al completar los anteriores
- **Exámenes Finales**: Evaluación al completar cada módulo
- **Reto Final**: Desafío final que se desbloquea al completar todos los exámenes
- **Sistema de Usuarios**: Registro, autenticación y perfiles personalizados
- **Autenticación Social**: Login con Google
- **Perfil de Usuario**: Visualización de progreso, estadísticas y gestión de perfil
- **Diploma de Superación**: Certificado digital al completar el reto final

## 🎯 Características Principales

### Sistema de Usuarios
- Registro con username, email opcional y contraseña de 5 caracteres (diseñado para niños)
- Autenticación con username o email
- Autenticación social con Google
- Perfil de usuario con imagen personalizable
- Menú de usuario con dropdown en todas las páginas

### Sistema de Progreso
- **Desbloqueo Progresivo**: 
  - El primer juego de cada módulo está desbloqueado por defecto
  - Para desbloquear el juego siguiente, se debe completar el anterior
  - Los exámenes se desbloquean al completar el juego 5 de su módulo
  - El Reto Final se desbloquea al completar los 4 exámenes de los módulos
- **Guardado Automático**: El progreso se guarda automáticamente al completar juegos y exámenes
- **Visualización de Progreso**: Gráficos y estadísticas en el perfil del usuario

### Módulos y Juegos

#### 📐 Matemáticas (5 juegos)
1. Secuencias Numéricas
2. Snake Matemático
3. Carreras Matemáticas
4. Memoria Matemática
5. Operaciones con Figuras

#### 🔬 Ciencias (5 juegos)
1. Ahorcado de Ciencias
2. Identifica el Reino
3. Verdadero o Falso Científico
4. El Esqueleto
5. El Sistema Solar

#### 📝 Gramática (5 juegos)
1. Sopa de Letras
2. Ordena el Abecedario
3. Ruleta Gramatical
4. Detective de Palabras Prohibidas
5. Cartas de Gramática

#### 🗣️ Inglés (5 juegos)
1. English Adventure Map
2. English Detective
3. English Colors
4. Word Builder
5. Word Match

## 🛠️ Tecnologías Utilizadas

- **Backend**: Django 4.2+
- **Base de Datos**: SQLite (desarrollo)
- **Frontend**: HTML5, CSS3, JavaScript
- **Librerías JavaScript**:
  - Chart.js (gráficos de progreso)
  - AOS (Animate On Scroll)
  - ScrollReveal (animaciones)
  - Swiper (carruseles)
- **Autenticación**: Google Identity Services
- **Analytics**: Google Tag Manager

## 📦 Requisitos del Sistema

### Requisitos Mínimos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Dependencias de Python
Las dependencias se encuentran en `requirements.txt`:

```
Django>=4.2.0,<5.0.0
```

**Nota**: El proyecto actualmente decodifica los tokens JWT de Google manualmente. Para una implementación más robusta y segura en producción, considera agregar las siguientes dependencias opcionales:

```
google-auth>=2.0.0
google-auth-oauthlib>=1.0.0
google-auth-httplib2>=0.1.0
```

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd EduRetoSV
```

### 2. Crear un Entorno Virtual (Recomendado)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar la Base de Datos
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Crear un Superusuario (Opcional)
```bash
python manage.py createsuperuser
```

### 6. Configurar Google OAuth (Opcional)
Si deseas usar la autenticación con Google:

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita la API de Google Identity Services
3. Crea credenciales OAuth 2.0
4. Agrega los orígenes autorizados en Google Cloud Console:
   - `http://127.0.0.1:8000`
   - `http://localhost:8000`
5. Agrega las URIs de redirección:
   - `http://127.0.0.1:8000/auth/google/`
   - `http://localhost:8000/auth/google/`
6. Actualiza `GOOGLE_CLIENT_ID` en `eduretosv/settings.py`

### 7. Ejecutar el Servidor de Desarrollo
```bash
python manage.py runserver
```

El servidor estará disponible en `http://127.0.0.1:8000/`

## 📁 Estructura del Proyecto

```
EduRetoSV/
├── eduretosv/              # Configuración del proyecto Django
│   ├── settings.py         # Configuración principal
│   ├── urls.py             # URLs principales
│   └── wsgi.py             # Configuración WSGI
├── mainapp/                # Aplicación principal
│   ├── models.py           # Modelos de datos (Usuario, JuegoCompletado, ExamenCompletado)
│   ├── views.py            # Vistas y lógica de negocio
│   ├── urls.py             # URLs de la aplicación
│   ├── admin.py            # Configuración del admin de Django
│   └── templates/          # Plantillas HTML
│       ├── index.html      # Página principal
│       ├── login.html      # Login y registro
│       ├── perfil.html     # Perfil de usuario
│       ├── materias.html   # Vista de materias
│       ├── games/          # Plantillas de juegos (20 juegos)
│       └── ...             # Otras plantillas
├── static/                 # Archivos estáticos
│   ├── css/               # Hojas de estilo
│   ├── js/                # Scripts JavaScript
│   ├── img/               # Imágenes
│   └── assets/            # Assets de juegos (audio, imágenes)
├── media/                 # Archivos subidos por usuarios (imágenes de perfil)
├── db.sqlite3             # Base de datos SQLite
├── manage.py             # Script de administración de Django
├── requirements.txt       # Dependencias del proyecto
└── README.md             # Este archivo
```

## 🎮 Uso de la Plataforma

### Para Usuarios

1. **Registro/Login**: 
   - Accede a la página de login
   - Regístrate con un username y contraseña (mínimo 5 caracteres)
   - O inicia sesión con Google

2. **Navegación**:
   - Explora las 4 materias desde la página principal
   - Cada materia tiene 5 juegos progresivos
   - El primer juego está desbloqueado, los demás se desbloquean al completar los anteriores

3. **Jugar**:
   - Completa los juegos en orden
   - Tu progreso se guarda automáticamente
   - Al completar el juego 5, desbloqueas el examen del módulo

4. **Exámenes**:
   - Completa los 4 exámenes de los módulos
   - Al completarlos todos, desbloqueas el Reto Final

5. **Perfil**:
   - Visualiza tu progreso general y por módulo
   - Cambia tu imagen de perfil
   - Revisa tus estadísticas y exámenes completados

### Para Desarrolladores

- **Modelos**: `mainapp/models.py` contiene los modelos de Usuario, JuegoCompletado y ExamenCompletado
- **Vistas**: `mainapp/views.py` contiene toda la lógica de las vistas
- **Progreso**: El sistema de guardado de progreso está en `static/js/progress-tracker.js`
- **Desbloqueo**: La lógica de desbloqueo está en las funciones helper de `views.py`

## 🔧 Configuración Adicional

### Google Tag Manager
El proyecto incluye Google Tag Manager (ID: `GTM-WBJ2PWNG`) en todas las páginas para análisis y seguimiento.

### Media Files
Las imágenes de perfil se guardan en `media/perfiles/`. Asegúrate de que esta carpeta tenga permisos de escritura.

## 📝 Notas Importantes

- Este proyecto está diseñado para ser amigable para niños, por lo que:
  - El email es opcional en el registro
  - La contraseña mínima es de 5 caracteres
  - La interfaz es colorida y fácil de usar

- El sistema de progreso es estricto: no se puede saltar juegos sin completar los anteriores

- La base de datos SQLite es adecuada para desarrollo. Para producción, considera usar PostgreSQL o MySQL

## 🤝 Contribuciones

Este es un proyecto educativo. Las contribuciones son bienvenidas.



## 👥 Autores

Roberto Carlos Chavez Camoos
Edwin Josue Parada Campos
Yader Enmanuel Romero Bonilla
Carlos Felipe Soto Mayorga

---

**EduRetoSV** - Aprende jugando, juega aprendiendo 🎓🎮
