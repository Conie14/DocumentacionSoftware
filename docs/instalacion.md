---
sidebar_position: 2
title: Instalación
---

# Instalación y Requisitos

## Requisitos del Sistema

### Software
- Python 3.8+
- Django 4.0+
- pandas
- openpyxl
- unidecode

### Instalación de Dependencias

```bash
pip install django pandas openpyxl unidecode
```

```bash
pip install XlsxWriter
```

## Levantar el Servidor

```bash
cd recetas_processor
python manage.py runserver
```

El sistema estará disponible en `http://localhost:8000/`.

## Configuración de Rutas (urls.py)

```python
# Recetas
path('', views.index, name='index')
path('obtener-hojas/', views.obtener_hojas, name='obtener_hojas')
path('procesar/', views.procesar_recetas, name='procesar_recetas')

# Copeo
path('copeo/', views.copeo, name='copeo')
path('copeo/procesar/', views.procesar_copeo, name='procesar_copeo')

# Diversos
path('diversos/', views.diversos, name='diversos')
path('diversos/procesar/', views.procesar_diversos, name='procesar_diversos')

# Descarga
path('media/outputs/<str:filename>/', views.descargar_resultado, name='descargar_resultado')
```

## Variables de Entorno (settings.py)

```python
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
```
