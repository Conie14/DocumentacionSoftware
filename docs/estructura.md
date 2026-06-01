---
sidebar_position: 3
title: Estructura del Proyecto
---

# Estructura del Proyecto

```
recetas_processor/
├── procesador/
│   ├── views.py                 # Vistas principales de los 3 módulos
│   ├── urls.py                  # Rutas del sistema
│   ├── templates/
│   │   └── procesador/
│   │       ├── index.html       # Módulo de Recetas
│   │       ├── copeo.html       # Módulo de Copeo
│   │       └── diversos.html    # Módulo de Diversos
│   └── utils/
│       ├── excel_reader.py      # Lectura de archivos Excel
│       ├── ingredient_matcher.py# Matching de ingredientes
│       └── excel_generator.py   # Generación de reportes
└── media/
    ├── uploads/                 # Archivos subidos temporalmente
    └── outputs/                 # Archivos procesados generados
```

## Descripción de Componentes

### `views.py`
Contiene las vistas principales para los tres módulos: recetas, copeo y diversos. Maneja la lógica de recepción de archivos, procesamiento y generación de respuestas.

### `utils/excel_reader.py`
Encargado de leer y parsear archivos Excel de entrada (.xlsx, .xls).

### `utils/ingredient_matcher.py`
Implementa las estrategias de matching de ingredientes/productos contra el catálogo de insumos.

### `utils/excel_generator.py`
Genera los archivos Excel de salida con formato profesional (encabezados azules, filas sin match en rojo).

### `media/`
Directorio para almacenamiento temporal de archivos subidos y archivos de salida generados.
