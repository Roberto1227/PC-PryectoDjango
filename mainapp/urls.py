"""
URL configuration for mainapp.

Este archivo contiene todas las rutas URL del proyecto EduRetoSV.
Las URLs están organizadas por categorías para facilitar su mantenimiento.
"""
from django.urls import path
from . import views

urlpatterns = [
    # ============================================================================
    # PÁGINAS PRINCIPALES
    # ============================================================================
    path('', views.index, name='index'),                          # Página de inicio
    path('materias/', views.materias, name='materias'),           # Vista de materias
    path('nosotros/', views.nosotros, name='nosotros'),          # Página "Nosotros"
    
    # ============================================================================
    # AUTENTICACIÓN Y USUARIO
    # ============================================================================
    path('login/', views.login, name='login'),                    # Login y registro
    path('logout/', views.logout, name='logout'),                 # Cerrar sesión
    path('auth/google/', views.google_auth, name='google_auth'),  # Autenticación con Google
    path('perfil/', views.perfil, name='perfil'),                 # Perfil de usuario
    
    # ============================================================================
    # MÓDULOS EDUCATIVOS (Materias)
    # ============================================================================
    path('matematica/', views.matematica, name='matematica'),    # Módulo de Matemáticas
    path('ciencia/', views.ciencia, name='ciencia'),              # Módulo de Ciencias
    path('gramatica/', views.gramatica, name='gramatica'),        # Módulo de Gramática
    path('ingles/', views.ingles, name='ingles'),                # Módulo de Inglés
    
    # ============================================================================
    # EXÁMENES
    # ============================================================================
    path('examat/', views.examat, name='examat'),                # Examen de Matemáticas
    path('exacien/', views.exacien, name='exacien'),             # Examen de Ciencias
    path('exagra/', views.exagra, name='exagra'),                # Examen de Gramática
    path('exaing/', views.exaing, name='exaing'),                # Examen de Inglés
    
    # ============================================================================
    # RETO FINAL Y DIPLOMA
    # ============================================================================
    path('edureto1/', views.edureto1, name='edureto1'),          # Reto Final
    path('diploma/', views.diploma, name='diploma'),             # Diploma de superación
    
    # ============================================================================
    # JUEGOS - CIENCIAS (5 juegos)
    # ============================================================================
    path('games/cienjuego1/', views.cienjuego1, name='cienjuego1'),  # Juego 1: Ahorcado
    path('games/cienjuego2/', views.cienjuego2, name='cienjuego2'),  # Juego 2: Reinos
    path('games/cienjuego3/', views.cienjuego3, name='cienjuego3'),  # Juego 3: Verdadero/Falso
    path('games/cienjuego4/', views.cienjuego4, name='cienjuego4'),  # Juego 4: Esqueleto
    path('games/cienjuego5/', views.cienjuego5, name='cienjuego5'),  # Juego 5: Sistema Solar
    
    # ============================================================================
    # JUEGOS - GRAMÁTICA (5 juegos)
    # ============================================================================
    path('games/gramjuego1/', views.gramjuego1, name='gramjuego1'),  # Juego 1: Sopa de Letras
    path('games/gramjuego2/', views.gramjuego2, name='gramjuego2'),  # Juego 2: ABC
    path('games/gramjuego3/', views.gramjuego3, name='gramjuego3'),  # Juego 3: Ruleta
    path('games/gramjuego4/', views.gramjuego4, name='gramjuego4'),  # Juego 4: Detective
    path('games/gramjuego5/', views.gramjuego5, name='gramjuego5'),  # Juego 5: Cartas
    
    # ============================================================================
    # JUEGOS - INGLÉS (5 juegos)
    # ============================================================================
    path('games/ingjuego1/', views.ingjuego1, name='ingjuego1'),     # Juego 1: Aventura
    path('games/ingjuego2/', views.ingjuego2, name='ingjuego2'),    # Juego 2: Detective
    path('games/ingjuego3/', views.ingjuego3, name='ingjuego3'),    # Juego 3: Colores
    path('games/ingjuego4/', views.ingjuego4, name='ingjuego4'),    # Juego 4: Constructor de Palabras
    path('games/ingjuego5/', views.ingjuego5, name='ingjuego5'),   # Juego 5: Coincidencia de Palabras
    
    # ============================================================================
    # JUEGOS - MATEMÁTICAS (5 juegos)
    # ============================================================================
    path('games/matjuego1/', views.matjuego1, name='matjuego1'),    # Juego 1: Secuencias Numéricas
    path('games/matjuego2/', views.matjuego2, name='matjuego2'),    # Juego 2: Serpiente
    path('games/matjuego3/', views.matjuego3, name='matjuego3'),    # Juego 3: Carrera
    path('games/matjuego4/', views.matjuego4, name='matjuego4'),    # Juego 4: Memoria
    path('games/matjuego5/', views.matjuego5, name='matjuego5'),   # Juego 5: Figuras y Operaciones
    
    # ============================================================================
    # API ENDPOINTS (Endpoints para guardar progreso)
    # ============================================================================
    path('api/guardar-progreso-juego/', views.guardar_progreso_juego, name='guardar_progreso_juego'),
    path('api/guardar-progreso-examen/', views.guardar_progreso_examen, name='guardar_progreso_examen'),
]


