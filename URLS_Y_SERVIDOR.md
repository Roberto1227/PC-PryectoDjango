# URLs y Comandos del Servidor - EduRetoSV

## Comando para ejecutar el servidor

```bash
python manage.py runserver
```

El servidor se ejecutará en: `http://127.0.0.1:8000/`

Para ejecutar en un puerto específico:
```bash
python manage.py runserver 8080
```

## URLs Disponibles

### Páginas Principales

- **Inicio**: `/` o `http://127.0.0.1:8000/`
- **Materias**: `/materias/` o `http://127.0.0.1:8000/materias/`
- **Nosotros**: `/nosotros/` o `http://127.0.0.1:8000/nosotros/`
- **Login/Registro**: `/login/` o `http://127.0.0.1:8000/login/`

### Materias

- **Matemáticas**: `/matematica/` o `http://127.0.0.1:8000/matematica/`
- **Ciencias**: `/ciencia/` o `http://127.0.0.1:8000/ciencia/`
- **Gramática**: `/gramatica/` o `http://127.0.0.1:8000/gramatica/`
- **Inglés**: `/ingles/` o `http://127.0.0.1:8000/ingles/`

### Exámenes

- **Examen de Matemáticas**: `/examat/` o `http://127.0.0.1:8000/examat/`
- **Examen de Ciencias**: `/exacien/` o `http://127.0.0.1:8000/exacien/`
- **Examen de Gramática**: `/exagra/` o `http://127.0.0.1:8000/exagra/`
- **Examen de Inglés**: `/exaing/` o `http://127.0.0.1:8000/exaing/`

### Reto Final

- **Reto Final**: `/edureto1/` o `http://127.0.0.1:8000/edureto1/`

### Diploma

- **Diploma**: `/diploma/` o `http://127.0.0.1:8000/diploma/`

### Juegos de Ciencias

- **Juego 1 - Ahorcado**: `/games/cienjuego1/` o `http://127.0.0.1:8000/games/cienjuego1/`
- **Juego 2 - Reinos**: `/games/cienjuego2/` o `http://127.0.0.1:8000/games/cienjuego2/`
- **Juego 3 - Verdadero/Falso**: `/games/cienjuego3/` o `http://127.0.0.1:8000/games/cienjuego3/`
- **Juego 4 - Esqueleto**: `/games/cienjuego4/` o `http://127.0.0.1:8000/games/cienjuego4/`
- **Juego 5 - Sistema Solar**: `/games/cienjuego5/` o `http://127.0.0.1:8000/games/cienjuego5/`

### Juegos de Gramática

- **Juego 1 - Sopa de Letras**: `/games/gramjuego1/` o `http://127.0.0.1:8000/games/gramjuego1/`
- **Juego 2 - ABC**: `/games/gramjuego2/` o `http://127.0.0.1:8000/games/gramjuego2/`
- **Juego 3 - Ruleta**: `/games/gramjuego3/` o `http://127.0.0.1:8000/games/gramjuego3/`
- **Juego 4 - Detective**: `/games/gramjuego4/` o `http://127.0.0.1:8000/games/gramjuego4/`
- **Juego 5 - Cartas**: `/games/gramjuego5/` o `http://127.0.0.1:8000/games/gramjuego5/`

### Juegos de Inglés

- **Juego 1 - Aventura**: `/games/ingjuego1/` o `http://127.0.0.1:8000/games/ingjuego1/`
- **Juego 2 - Detective**: `/games/ingjuego2/` o `http://127.0.0.1:8000/games/ingjuego2/`
- **Juego 3 - Colores**: `/games/ingjuego3/` o `http://127.0.0.1:8000/games/ingjuego3/`
- **Juego 4 - Constructor de Palabras**: `/games/ingjuego4/` o `http://127.0.0.1:8000/games/ingjuego4/`
- **Juego 5 - Coincidencia de Palabras**: `/games/ingjuego5/` o `http://127.0.0.1:8000/games/ingjuego5/`

### Juegos de Matemáticas

- **Juego 1 - Secuencias Numéricas**: `/games/matjuego1/` o `http://127.0.0.1:8000/games/matjuego1/`
- **Juego 2 - Serpiente**: `/games/matjuego2/` o `http://127.0.0.1:8000/games/matjuego2/`
- **Juego 3 - Carrera**: `/games/matjuego3/` o `http://127.0.0.1:8000/games/matjuego3/`
- **Juego 4 - Memoria**: `/games/matjuego4/` o `http://127.0.0.1:8000/games/matjuego4/`
- **Juego 5 - Figuras y Operaciones**: `/games/matjuego5/` o `http://127.0.0.1:8000/games/matjuego5/`

## Panel de Administración

- **Admin**: `/admin/` o `http://127.0.0.1:8000/admin/`

## Comandos Útiles

### Instalar dependencias
```bash
pip install -r requirements.txt
```

### Crear migraciones (si es necesario)
```bash
python manage.py makemigrations
```

### Aplicar migraciones
```bash
python manage.py migrate
```

### Crear superusuario (para acceder al admin)
```bash
python manage.py createsuperuser
```

### Recopilar archivos estáticos (para producción)
```bash
python manage.py collectstatic
```

## Notas

- Todas las rutas terminan con `/` (barra diagonal)
- Los archivos estáticos (CSS, JS, imágenes) se sirven desde `/static/`
- El proyecto está configurado para desarrollo (DEBUG=True)
- Para producción, cambiar DEBUG=False en `eduretosv/settings.py`

