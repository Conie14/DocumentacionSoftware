---
sidebar_position: 4
title: Uso del Sistema
---

# Uso del Sistema

## Flujo de Trabajo General

1. **Seleccionar Módulo**: Navegar al módulo deseado
2. **Cargar Archivos**: Subir archivo de entrada y archivo de insumos
3. **Configurar** (solo Recetas): Mapear columnas y configurar hojas
4. **Procesar**: Hacer clic en el botón de procesamiento
5. **Revisar Estadísticas**: Ver el resumen de procesamiento
6. **Descargar**: Obtener el archivo Excel procesado

## Características Comunes a Todos los Módulos

### Normalización de Texto
Todos los módulos normalizan automáticamente:
- Conversión a mayúsculas
- Eliminación de acentos y tildes
- Normalización de espacios múltiples
- Trim de espacios inicial y final

### Búsqueda en Múltiples Columnas
Los sistemas buscan matches en:
- Columna `descripcion` de insumos
- Columna `presentacion` de insumos (si existe)

### Formato de Salida Excel
Todos los archivos generados incluyen:
- Encabezados con fondo azul (`#4472C4`) y texto blanco
- Bordes delgados en todas las celdas
- Filas sin match resaltadas en rojo (`#FFC7CE`)
- Anchos de columna optimizados
- Alineación centrada en encabezados

### Estadísticas de Procesamiento
Todos los módulos reportan:
- Total de registros procesados
- Cantidad de matches exitosos
- Cantidad sin match
- Porcentaje de éxito

## Logs del Sistema

Los módulos imprimen logs detallados en consola:

```
Leyendo archivo de recetas...
✓ 150 recetas extraídas

Leyendo archivo de insumos...
✓ 450 insumos cargados

Haciendo match de ingredientes...
✓ Match completado: 420/450 ingredientes

Matches: 420
Sin match: 30
```
