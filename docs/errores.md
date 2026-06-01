---
sidebar_position: 5
title: Manejo de Errores
---

# Manejo de Errores

## Errores Comunes

### "Faltan archivos"
- **Causa**: No se subieron todos los archivos requeridos
- **Solución**: Verificar que se hayan seleccionado ambos archivos

### "Error al leer el archivo"
- **Causa**: Archivo corrupto o formato incorrecto
- **Solución**: Verificar formato Excel válido (`.xlsx`, `.xls`)

### "Columnas no encontradas"
- **Causa**: El archivo no tiene las columnas esperadas
- **Solución**: Revisar estructura del archivo según el módulo usado

### Productos/Ingredientes sin match (en rojo)
- **Causa**: No se encontró coincidencia en el catálogo de insumos
- **Solución**:
  - Verificar ortografía
  - Agregar insumo faltante al catálogo
  - Revisar caracteres especiales

## Limitaciones Conocidas

### Módulo de Recetas
- Requiere configuración manual de columnas por primera vez
- No detecta automáticamente estructura de recetas
- Limitado a archivos Excel (no CSV directo)

### Módulo de Copeo
- Factor fijo de 1.78 para copas dobles
- No distingue tipos de licor (mismo cálculo para todos)
- No maneja presentaciones especiales (cajas, garrafones)

### Módulo de Diversos
- Solo dos reglas de vinos: 700-750ML y 375ML
- Match flexible requiere mínimo 60% de coincidencia
- No concatena descripción + presentación automáticamente
- Palabras clave de detección predefinidas
