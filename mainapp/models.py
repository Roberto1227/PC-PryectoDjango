from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    """
    Modelo de usuario personalizado para EduRetoSV.
    Extiende AbstractUser de Django para mantener toda la funcionalidad
    de autenticación mientras personalizamos los campos.
    """
    email = models.EmailField(
        'correo electrónico',
        blank=True,
        null=True,
        help_text='Correo electrónico (opcional)'
    )
    
    # Campos adicionales para el sistema de progreso (se completarán después)
    fecha_registro = models.DateTimeField(
        'fecha de registro',
        auto_now_add=True
    )
    
    imagen_perfil = models.ImageField(
        'imagen de perfil',
        upload_to='perfiles/',
        blank=True,
        null=True,
        help_text='Imagen de perfil del usuario'
    )
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-fecha_registro']
    
    def get_imagen_perfil_url(self):
        """Retorna la URL de la imagen de perfil si existe y no es el default"""
        if self.imagen_perfil and self.imagen_perfil.name != 'perfiles/default.png':
            try:
                return self.imagen_perfil.url
            except:
                return None
        return None
    
    def __str__(self):
        return self.username


class ExamenCompletado(models.Model):
    """
    Modelo para rastrear los exámenes completados por los usuarios.
    """
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='examenes_completados'
    )
    tipo_examen = models.CharField(
        'tipo de examen',
        max_length=20,
        choices=[
            ('matematicas', 'Matemáticas'),
            ('ciencias', 'Ciencias'),
            ('gramatica', 'Gramática'),
            ('ingles', 'Inglés'),
        ]
    )
    fecha_completado = models.DateTimeField(
        'fecha de completado',
        auto_now_add=True
    )
    puntuacion = models.IntegerField(
        'puntuación',
        default=0,
        help_text='Puntuación obtenida en el examen'
    )
    aprobado = models.BooleanField(
        'aprobado',
        default=False,
        help_text='Indica si el examen fue aprobado (≥10 aciertos)'
    )
    
    class Meta:
        verbose_name = 'Examen Completado'
        verbose_name_plural = 'Exámenes Completados'
        ordering = ['-fecha_completado']
        unique_together = ['usuario', 'tipo_examen']
    
    def __str__(self):
        return f'{self.usuario.username} - {self.get_tipo_examen_display()}'


class JuegoCompletado(models.Model):
    """
    Modelo para rastrear los juegos completados por los usuarios.
    """
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='juegos_completados'
    )
    modulo = models.CharField(
        'módulo',
        max_length=20,
        choices=[
            ('matematicas', 'Matemáticas'),
            ('ciencias', 'Ciencias'),
            ('gramatica', 'Gramática'),
            ('ingles', 'Inglés'),
        ]
    )
    numero_juego = models.IntegerField(
        'número de juego',
        help_text='Número del juego (1-5)'
    )
    fecha_completado = models.DateTimeField(
        'fecha de completado',
        auto_now_add=True
    )
    puntuacion = models.IntegerField(
        'puntuación',
        default=0,
        help_text='Puntuación obtenida en el juego'
    )
    
    class Meta:
        verbose_name = 'Juego Completado'
        verbose_name_plural = 'Juegos Completados'
        ordering = ['-fecha_completado']
        unique_together = ['usuario', 'modulo', 'numero_juego']
    
    def __str__(self):
        return f'{self.usuario.username} - {self.get_modulo_display()} - Juego {self.numero_juego}'

