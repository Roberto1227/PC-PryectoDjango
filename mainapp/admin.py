from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, ExamenCompletado, JuegoCompletado


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """
    Configuración del admin para el modelo Usuario personalizado.
    Hereda de UserAdmin para mantener todas las funcionalidades
    del admin de usuarios de Django.
    """
    list_display = ('username', 'email', 'fecha_registro', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'fecha_registro')
    search_fields = ('username', 'email')
    ordering = ('-fecha_registro',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {
            'fields': ('fecha_registro',)
        }),
    )
    
    readonly_fields = ('fecha_registro',)


@admin.register(ExamenCompletado)
class ExamenCompletadoAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo ExamenCompletado.
    """
    list_display = ('usuario', 'tipo_examen', 'puntuacion', 'aprobado', 'fecha_completado')
    list_filter = ('tipo_examen', 'aprobado', 'fecha_completado')
    search_fields = ('usuario__username', 'tipo_examen')
    ordering = ('-fecha_completado',)
    readonly_fields = ('fecha_completado',)


@admin.register(JuegoCompletado)
class JuegoCompletadoAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo JuegoCompletado.
    """
    list_display = ('usuario', 'modulo', 'numero_juego', 'puntuacion', 'fecha_completado')
    list_filter = ('modulo', 'numero_juego', 'fecha_completado')
    search_fields = ('usuario__username', 'modulo')
    ordering = ('-fecha_completado',)
    readonly_fields = ('fecha_completado',)

