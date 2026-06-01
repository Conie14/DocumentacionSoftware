---
sidebar_position: 1
title: Módulo de Recetas
---

# Módulo de Recetas

## Descripción

Procesa archivos Excel de recetas, extrae ingredientes y hace match con un catálogo maestro de insumos.

**URL de acceso**: `http://localhost:8000/`

## Archivos Requeridos

### Archivo de Recetas (Excel)
Estructura flexible configurada por el usuario:
- Una o más hojas con recetas
- Columnas configurables para:
  - Nombre de receta
  - Código de receta
  - Tipo de receta (Principal / Sub-receta)
  - Ingredientes y cantidades

### Archivo de Insumos (Excel)
Debe contener:

| Columna | Descripción |
|---------|-------------|
| `IDInsumo` | Identificador único |
| `Descripcion` | Nombre del insumo |
| `Presentacion` | Formato de presentación |

## Funcionalidades

### Configuración Dinámica
- Selección de hojas a procesar
- Mapeo personalizado de columnas
- Identificación de filas de encabezado
- Configuración de rangos de datos

### Tipos de Descarga
- **Todas**: Recetas principales y sub-recetas
- **Principales**: Solo recetas principales
- **Sub-recetas**: Solo sub-recetas

### Detección de Duplicados
- Identifica recetas duplicadas por nombre
- Mantiene la primera ocurrencia
- Marca duplicados en el reporte

### Matching de Ingredientes

Estrategias de búsqueda (en orden):
1. Match exacto por descripción
2. Match parcial (descripción contenida)
3. Match por presentación
4. Normalización y limpieza de texto

## Archivo de Salida

Nombre: `{nombre_sociedad}_recetas_procesadas.xlsx`

| Columna | Descripción |
|---------|-------------|
| `Receta` | Nombre de la receta |
| `Codigo` | Código de la receta |
| `Tipo` | Principal o Sub-receta |
| `Ingrediente` | Nombre del ingrediente |
| `Cantidad` | Cantidad requerida |
| `Unidad` | Unidad de medida |
| `IDInsumo` | ID del insumo matcheado |
| `Insumo` | Descripción del insumo |
| `Presentacion` | Presentación del insumo |
| `Es_Duplicado` | Indica si la receta es duplicada |

## Estadísticas Generadas

- Total de recetas procesadas
- Recetas principales vs sub-recetas
- Cantidad de duplicados encontrados
- Total de ingredientes
- Ingredientes con match exitoso
- Porcentaje de match
