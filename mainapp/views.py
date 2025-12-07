from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import requests
from .models import Usuario, ExamenCompletado, JuegoCompletado


def juego_desbloqueado(usuario, modulo, numero_juego):
    """
    Verifica si un juego está desbloqueado para un usuario.
    El juego 1 siempre está desbloqueado.
    Para juegos 2-5, requiere que el juego anterior esté completado.
    """
    if not usuario.is_authenticated:
        return False
    
    # El juego 1 siempre está desbloqueado
    if numero_juego == 1:
        return True
    
    # Para juegos 2-5, verificar que el juego anterior esté completado
    juego_anterior = JuegoCompletado.objects.filter(
        usuario=usuario,
        modulo=modulo,
        numero_juego=numero_juego - 1
    ).exists()
    
    return juego_anterior


def examen_desbloqueado(usuario, modulo):
    """
    Verifica si el examen de un módulo está desbloqueado.
    Requiere que el juego 5 de ese módulo esté completado.
    """
    if not usuario.is_authenticated:
        return False
    
    juego5_completado = JuegoCompletado.objects.filter(
        usuario=usuario,
        modulo=modulo,
        numero_juego=5
    ).exists()
    
    return juego5_completado

def index(request):
    return render(request, 'index.html')

def materias(request):
    # Verificar si el reto final está desbloqueado (requiere los 4 exámenes completados)
    reto_final_desbloqueado = False
    if request.user.is_authenticated:
        examenes_completados = ExamenCompletado.objects.filter(usuario=request.user)
        examenes_tipos = set(examenes_completados.values_list('tipo_examen', flat=True))
        reto_final_desbloqueado = len(examenes_tipos) == 4 and all([
            'matematicas' in examenes_tipos,
            'ciencias' in examenes_tipos,
            'gramatica' in examenes_tipos,
            'ingles' in examenes_tipos
        ])
    
    context = {
        'reto_final_desbloqueado': reto_final_desbloqueado
    }
    return render(request, 'materias.html', context)

def nosotros(request):
    return render(request, 'nosotros.html')

def login(request):
    if request.user.is_authenticated:
        # Si ya está autenticado, redirigir a la URL original si existe 'next', sino a index
        next_url = request.GET.get('next', 'index')
        return redirect(next_url)
    
    if request.method == 'POST':
        form_type = request.POST.get('form_type')
        
        if form_type == 'register':
            # Proceso de registro
            username = request.POST.get('username', '').strip()
            email = request.POST.get('email', '').strip()
            password1 = request.POST.get('password1', '')
            password2 = request.POST.get('password2', '')
            
            # Validaciones básicas
            errors = []
            
            if not username:
                errors.append('El nombre de usuario es requerido.')
            elif Usuario.objects.filter(username=username).exists():
                errors.append('Este nombre de usuario ya está en uso.')
            
            if password1 and len(password1) < 5:
                errors.append('La contraseña debe tener al menos 5 caracteres.')
            
            if password1 != password2:
                errors.append('Las contraseñas no coinciden.')
            
            if email and Usuario.objects.filter(email=email).exists():
                errors.append('Este correo electrónico ya está registrado.')
            
            if errors:
                return render(request, 'login.html', {
                    'register_errors': errors,
                    'register_username': username,
                    'register_email': email,
                })
            
            # Crear usuario
            try:
                user = Usuario.objects.create_user(
                    username=username,
                    email=email if email else None,
                    password=password1
                )
                # Iniciar sesión automáticamente después del registro
                auth_login(request, user)
                messages.success(request, f'¡Bienvenido {username}! Tu cuenta ha sido creada exitosamente.')
                # Redirigir a la URL original si existe el parámetro 'next', sino a index
                next_url = request.GET.get('next', 'index')
                return redirect(next_url)
            except Exception as e:
                return render(request, 'login.html', {
                    'register_errors': [f'Error al crear la cuenta: {str(e)}'],
                    'register_username': username,
                    'register_email': email,
                })
        
        elif form_type == 'login':
            # Proceso de inicio de sesión
            username_or_email = request.POST.get('username', '').strip()
            password = request.POST.get('password', '')
            
            if not username_or_email or not password:
                return render(request, 'login.html', {
                    'login_errors': ['Por favor, completa todos los campos.']
                })
            
            # Intentar autenticar primero con username
            user = authenticate(request, username=username_or_email, password=password)
            
            # Si falla, intentar buscar por email
            if user is None:
                try:
                    # Buscar usuario por email
                    usuario_obj = Usuario.objects.get(email=username_or_email)
                    # Intentar autenticar con el username del usuario encontrado
                    user = authenticate(request, username=usuario_obj.username, password=password)
                except Usuario.DoesNotExist:
                    user = None
                except Usuario.MultipleObjectsReturned:
                    # Si hay múltiples usuarios con el mismo email, intentar con el primero
                    usuario_obj = Usuario.objects.filter(email=username_or_email).first()
                    if usuario_obj:
                        user = authenticate(request, username=usuario_obj.username, password=password)
                    else:
                        user = None
            
            if user is not None:
                auth_login(request, user)
                messages.success(request, f'¡Bienvenido de nuevo, {user.username}!')
                # Redirigir a la URL original si existe el parámetro 'next', sino a index
                next_url = request.GET.get('next', 'index')
                return redirect(next_url)
            else:
                return render(request, 'login.html', {
                    'login_errors': ['Usuario o contraseña incorrectos.']
                })
    
    return render(request, 'login.html')

def logout(request):
    auth_logout(request)
    messages.success(request, 'Has cerrado sesión exitosamente.')
    return redirect('index')

@csrf_exempt
def google_auth(request):
    """
    Maneja la autenticación con Google OAuth.
    Recibe el token de Google, lo verifica y crea/autentica al usuario.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            credential = data.get('credential')
            
            if not credential:
                return JsonResponse({'status': 'error', 'message': 'No se recibió el token de Google.'}, status=400)
            
            # Verificar el token con Google
            # En producción, deberías verificar el token con Google's tokeninfo endpoint
            # Por ahora, vamos a decodificar el JWT directamente (solo para desarrollo)
            import base64
            
            # El JWT de Google tiene 3 partes separadas por puntos
            parts = credential.split('.')
            if len(parts) != 3:
                return JsonResponse({'status': 'error', 'message': 'Token inválido.'}, status=400)
            
            # Decodificar el payload (segunda parte)
            payload = parts[1]
            # Agregar padding si es necesario
            padding = 4 - len(payload) % 4
            if padding != 4:
                payload += '=' * padding
            
            try:
                decoded = base64.urlsafe_b64decode(payload)
                user_data = json.loads(decoded)
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': 'Error al decodificar el token.'}, status=400)
            
            # Extraer información del usuario
            email = user_data.get('email')
            name = user_data.get('name', '')
            picture = user_data.get('picture', '')
            google_id = user_data.get('sub')
            
            if not email:
                return JsonResponse({'status': 'error', 'message': 'No se pudo obtener el email de Google.'}, status=400)
            
            # Buscar o crear usuario
            try:
                # Intentar buscar por email primero
                user = Usuario.objects.filter(email=email).first()
                
                if not user:
                    # Si no existe, crear nuevo usuario
                    # Usar el email como username base, pero verificar que sea único
                    base_username = email.split('@')[0]
                    username = base_username
                    counter = 1
                    while Usuario.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1
                    
                    user = Usuario.objects.create_user(
                        username=username,
                        email=email,
                        password=None  # Sin contraseña para usuarios de Google
                    )
                    user.set_unusable_password()  # Marcar que no tiene contraseña
                    user.save()
                    messages.success(request, f'¡Bienvenido {name or username}! Tu cuenta ha sido creada con Google.')
                else:
                    messages.success(request, f'¡Bienvenido de nuevo, {user.username}!')
                
                # Iniciar sesión
                auth_login(request, user)
                
                return JsonResponse({
                    'status': 'success',
                    'message': 'Autenticación exitosa.',
                    'redirect': '/'
                })
                
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': f'Error al crear/autenticar usuario: {str(e)}'}, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Formato JSON inválido.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Error: {str(e)}'}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'}, status=405)

@login_required
def perfil(request):
    if request.method == 'POST':
        # Actualizar imagen de perfil
        if 'imagen_perfil' in request.FILES:
            usuario = request.user
            usuario.imagen_perfil = request.FILES['imagen_perfil']
            usuario.save()
            messages.success(request, 'Imagen de perfil actualizada exitosamente.')
            return redirect('perfil')
    
    # Obtener exámenes completados
    examenes_completados = ExamenCompletado.objects.filter(usuario=request.user)
    
    # Crear diccionario de exámenes completados
    examenes_dict = {}
    for examen in examenes_completados:
        examenes_dict[examen.tipo_examen] = {
            'fecha': examen.fecha_completado,
            'puntuacion': examen.puntuacion,
            'aprobado': examen.aprobado
        }
    
    # Calcular progreso real
    juegos_completados = JuegoCompletado.objects.filter(usuario=request.user)
    
    # Progreso por módulo (5 juegos por módulo = 20% por juego)
    juegos_matematica = juegos_completados.filter(modulo='matematicas').count()
    juegos_ciencia = juegos_completados.filter(modulo='ciencias').count()
    juegos_gramatica = juegos_completados.filter(modulo='gramatica').count()
    juegos_ingles = juegos_completados.filter(modulo='ingles').count()
    
    progreso_matematica = (juegos_matematica / 5) * 100
    progreso_ciencia = (juegos_ciencia / 5) * 100
    progreso_gramatica = (juegos_gramatica / 5) * 100
    progreso_ingles = (juegos_ingles / 5) * 100
    
    # Progreso general (promedio de los 4 módulos)
    progreso_general = (progreso_matematica + progreso_ciencia + progreso_gramatica + progreso_ingles) / 4
    
    context = {
        'progreso_general': progreso_general,
        'progreso_matematica': progreso_matematica,
        'progreso_ciencia': progreso_ciencia,
        'progreso_gramatica': progreso_gramatica,
        'progreso_ingles': progreso_ingles,
        'examenes_completados': examenes_dict if examenes_dict else None,
    }
    
    return render(request, 'perfil.html', context)

def matematica(request):
    juegos_desbloqueados = {}
    if request.user.is_authenticated:
        for i in range(1, 6):
            juegos_desbloqueados[i] = juego_desbloqueado(request.user, 'matematicas', i)
    else:
        # Si no está autenticado, solo el juego 1 está disponible
        juegos_desbloqueados = {1: True, 2: False, 3: False, 4: False, 5: False}
    
    examen_desbloq = examen_desbloqueado(request.user, 'matematicas') if request.user.is_authenticated else False
    
    context = {
        'juegos_desbloqueados': juegos_desbloqueados,
        'examen_desbloqueado': examen_desbloq
    }
    return render(request, 'matematica.html', context)

def ciencia(request):
    juegos_desbloqueados = {}
    if request.user.is_authenticated:
        for i in range(1, 6):
            juegos_desbloqueados[i] = juego_desbloqueado(request.user, 'ciencias', i)
    else:
        juegos_desbloqueados = {1: True, 2: False, 3: False, 4: False, 5: False}
    
    examen_desbloq = examen_desbloqueado(request.user, 'ciencias') if request.user.is_authenticated else False
    
    context = {
        'juegos_desbloqueados': juegos_desbloqueados,
        'examen_desbloqueado': examen_desbloq
    }
    return render(request, 'ciencia.html', context)

def gramatica(request):
    juegos_desbloqueados = {}
    if request.user.is_authenticated:
        for i in range(1, 6):
            juegos_desbloqueados[i] = juego_desbloqueado(request.user, 'gramatica', i)
    else:
        juegos_desbloqueados = {1: True, 2: False, 3: False, 4: False, 5: False}
    
    examen_desbloq = examen_desbloqueado(request.user, 'gramatica') if request.user.is_authenticated else False
    
    context = {
        'juegos_desbloqueados': juegos_desbloqueados,
        'examen_desbloqueado': examen_desbloq
    }
    return render(request, 'gramatica.html', context)

def ingles(request):
    juegos_desbloqueados = {}
    if request.user.is_authenticated:
        for i in range(1, 6):
            juegos_desbloqueados[i] = juego_desbloqueado(request.user, 'ingles', i)
    else:
        juegos_desbloqueados = {1: True, 2: False, 3: False, 4: False, 5: False}
    
    examen_desbloq = examen_desbloqueado(request.user, 'ingles') if request.user.is_authenticated else False
    
    context = {
        'juegos_desbloqueados': juegos_desbloqueados,
        'examen_desbloqueado': examen_desbloq
    }
    return render(request, 'ingles.html', context)

@login_required
def edureto1(request):
    # Verificar que los 4 exámenes estén completados
    examenes_completados = ExamenCompletado.objects.filter(usuario=request.user)
    examenes_tipos = set(examenes_completados.values_list('tipo_examen', flat=True))
    
    if len(examenes_tipos) < 4 or not all([
        'matematicas' in examenes_tipos,
        'ciencias' in examenes_tipos,
        'gramatica' in examenes_tipos,
        'ingles' in examenes_tipos
    ]):
        messages.warning(request, 'Debes completar los 4 exámenes de los módulos para acceder al Reto Final.')
        return redirect('materias')
    
    return render(request, 'edureto1.html')

@login_required
def examat(request):
    if not examen_desbloqueado(request.user, 'matematicas'):
        messages.warning(request, 'Debes completar el juego 5 de Matemáticas para acceder al examen.')
        return redirect('matematica')
    return render(request, 'examat.html')

@login_required
def exacien(request):
    if not examen_desbloqueado(request.user, 'ciencias'):
        messages.warning(request, 'Debes completar el juego 5 de Ciencias para acceder al examen.')
        return redirect('ciencia')
    return render(request, 'exacien.html')

@login_required
def exagra(request):
    if not examen_desbloqueado(request.user, 'gramatica'):
        messages.warning(request, 'Debes completar el juego 5 de Gramática para acceder al examen.')
        return redirect('gramatica')
    return render(request, 'exagra.html')

@login_required
def exaing(request):
    if not examen_desbloqueado(request.user, 'ingles'):
        messages.warning(request, 'Debes completar el juego 5 de Inglés para acceder al examen.')
        return redirect('ingles')
    return render(request, 'exaing.html')

def diploma(request):
    return render(request, 'diploma.html')

# Juegos - Ciencias
@login_required
def cienjuego1(request):
    if not juego_desbloqueado(request.user, 'ciencias', 1):
        messages.warning(request, 'Este juego no está disponible.')
        return redirect('ciencia')
    return render(request, 'games/cienjuego1.html')

@login_required
def cienjuego2(request):
    if not juego_desbloqueado(request.user, 'ciencias', 2):
        messages.warning(request, 'Debes completar el juego 1 para desbloquear este juego.')
        return redirect('ciencia')
    return render(request, 'games/cienjuego2.html')

@login_required
def cienjuego3(request):
    if not juego_desbloqueado(request.user, 'ciencias', 3):
        messages.warning(request, 'Debes completar el juego 2 para desbloquear este juego.')
        return redirect('ciencia')
    return render(request, 'games/cienjuego3.html')

@login_required
def cienjuego4(request):
    if not juego_desbloqueado(request.user, 'ciencias', 4):
        messages.warning(request, 'Debes completar el juego 3 para desbloquear este juego.')
        return redirect('ciencia')
    return render(request, 'games/cienjuego4.html')

@login_required
def cienjuego5(request):
    if not juego_desbloqueado(request.user, 'ciencias', 5):
        messages.warning(request, 'Debes completar el juego 4 para desbloquear este juego.')
        return redirect('ciencia')
    return render(request, 'games/cienjuego5.html')

# Juegos - Gramática
@login_required
def gramjuego1(request):
    if not juego_desbloqueado(request.user, 'gramatica', 1):
        messages.warning(request, 'Este juego no está disponible.')
        return redirect('gramatica')
    return render(request, 'games/gramjuego1.html')

@login_required
def gramjuego2(request):
    if not juego_desbloqueado(request.user, 'gramatica', 2):
        messages.warning(request, 'Debes completar el juego 1 para desbloquear este juego.')
        return redirect('gramatica')
    return render(request, 'games/gramjuego2.html')

@login_required
def gramjuego3(request):
    if not juego_desbloqueado(request.user, 'gramatica', 3):
        messages.warning(request, 'Debes completar el juego 2 para desbloquear este juego.')
        return redirect('gramatica')
    return render(request, 'games/gramjuego3.html')

@login_required
def gramjuego4(request):
    if not juego_desbloqueado(request.user, 'gramatica', 4):
        messages.warning(request, 'Debes completar el juego 3 para desbloquear este juego.')
        return redirect('gramatica')
    return render(request, 'games/gramjuego4.html')

@login_required
def gramjuego5(request):
    if not juego_desbloqueado(request.user, 'gramatica', 5):
        messages.warning(request, 'Debes completar el juego 4 para desbloquear este juego.')
        return redirect('gramatica')
    return render(request, 'games/gramjuego5.html')

# Juegos - Inglés
@login_required
def ingjuego1(request):
    if not juego_desbloqueado(request.user, 'ingles', 1):
        messages.warning(request, 'Este juego no está disponible.')
        return redirect('ingles')
    return render(request, 'games/ingjuego1.html')

@login_required
def ingjuego2(request):
    if not juego_desbloqueado(request.user, 'ingles', 2):
        messages.warning(request, 'Debes completar el juego 1 para desbloquear este juego.')
        return redirect('ingles')
    return render(request, 'games/ingjuego2.html')

@login_required
def ingjuego3(request):
    if not juego_desbloqueado(request.user, 'ingles', 3):
        messages.warning(request, 'Debes completar el juego 2 para desbloquear este juego.')
        return redirect('ingles')
    return render(request, 'games/ingjuego3.html')

@login_required
def ingjuego4(request):
    if not juego_desbloqueado(request.user, 'ingles', 4):
        messages.warning(request, 'Debes completar el juego 3 para desbloquear este juego.')
        return redirect('ingles')
    return render(request, 'games/ingjuego4.html')

@login_required
def ingjuego5(request):
    if not juego_desbloqueado(request.user, 'ingles', 5):
        messages.warning(request, 'Debes completar el juego 4 para desbloquear este juego.')
        return redirect('ingles')
    return render(request, 'games/ingjuego5.html')

# Juegos - Matemáticas
@login_required
def matjuego1(request):
    if not juego_desbloqueado(request.user, 'matematicas', 1):
        messages.warning(request, 'Este juego no está disponible.')
        return redirect('matematica')
    return render(request, 'games/matjuego1.html')

@login_required
def matjuego2(request):
    if not juego_desbloqueado(request.user, 'matematicas', 2):
        messages.warning(request, 'Debes completar el juego 1 para desbloquear este juego.')
        return redirect('matematica')
    return render(request, 'games/matjuego2.html')

@login_required
def matjuego3(request):
    if not juego_desbloqueado(request.user, 'matematicas', 3):
        messages.warning(request, 'Debes completar el juego 2 para desbloquear este juego.')
        return redirect('matematica')
    return render(request, 'games/matjuego3.html')

@login_required
def matjuego4(request):
    if not juego_desbloqueado(request.user, 'matematicas', 4):
        messages.warning(request, 'Debes completar el juego 3 para desbloquear este juego.')
        return redirect('matematica')
    return render(request, 'games/matjuego4.html')

@login_required
def matjuego5(request):
    if not juego_desbloqueado(request.user, 'matematicas', 5):
        messages.warning(request, 'Debes completar el juego 4 para desbloquear este juego.')
        return redirect('matematica')
    return render(request, 'games/matjuego5.html')


# Endpoint para guardar progreso de juego
@login_required
@require_POST
@csrf_exempt
def guardar_progreso_juego(request):
    """
    Endpoint para guardar el progreso cuando un usuario completa un juego.
    Se llama desde JavaScript cuando el usuario hace clic en "Volver" o "Volver a jugar".
    """
    try:
        data = json.loads(request.body)
        modulo = data.get('modulo')
        numero_juego = data.get('numero_juego')
        puntuacion = data.get('puntuacion', 0)
        
        if not modulo or not numero_juego:
            return JsonResponse({'success': False, 'error': 'Faltan datos requeridos'}, status=400)
        
        # Validar módulo
        modulos_validos = ['matematicas', 'ciencias', 'gramatica', 'ingles']
        if modulo not in modulos_validos:
            return JsonResponse({'success': False, 'error': 'Módulo inválido'}, status=400)
        
        # Validar número de juego
        if numero_juego < 1 or numero_juego > 5:
            return JsonResponse({'success': False, 'error': 'Número de juego inválido'}, status=400)
        
        # Crear o actualizar el registro de juego completado
        juego_completado, created = JuegoCompletado.objects.get_or_create(
            usuario=request.user,
            modulo=modulo,
            numero_juego=numero_juego,
            defaults={'puntuacion': puntuacion}
        )
        
        if not created:
            # Si ya existe, actualizar la puntuación si es mayor
            if puntuacion > juego_completado.puntuacion:
                juego_completado.puntuacion = puntuacion
                juego_completado.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Progreso guardado correctamente',
            'juego_desbloqueado': numero_juego < 5  # El siguiente juego se desbloquea si no es el 5
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


# Endpoint para guardar progreso de examen
@login_required
@require_POST
@csrf_exempt
def guardar_progreso_examen(request):
    """
    Endpoint para guardar el progreso cuando un usuario completa un examen.
    Se llama desde JavaScript cuando el usuario hace clic en "Finalizar".
    """
    try:
        data = json.loads(request.body)
        tipo_examen = data.get('tipo_examen')
        puntuacion = data.get('puntuacion', 0)
        aprobado = data.get('aprobado', False)
        
        if not tipo_examen:
            return JsonResponse({'success': False, 'error': 'Faltan datos requeridos'}, status=400)
        
        # Validar tipo de examen
        tipos_validos = ['matematicas', 'ciencias', 'gramatica', 'ingles']
        if tipo_examen not in tipos_validos:
            return JsonResponse({'success': False, 'error': 'Tipo de examen inválido'}, status=400)
        
        # Crear o actualizar el registro de examen completado
        examen_completado, created = ExamenCompletado.objects.get_or_create(
            usuario=request.user,
            tipo_examen=tipo_examen,
            defaults={
                'puntuacion': puntuacion,
                'aprobado': aprobado
            }
        )
        
        if not created:
            # Si ya existe, actualizar si la nueva puntuación es mayor
            if puntuacion > examen_completado.puntuacion:
                examen_completado.puntuacion = puntuacion
                examen_completado.aprobado = aprobado
                examen_completado.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Examen guardado correctamente'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


