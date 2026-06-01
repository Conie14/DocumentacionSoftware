---
sidebar_position: 7
title: Módulo de Diversos
---

# Módulo de Diversos

:::note Herramienta externa
Este módulo forma parte del **Procesador de Recetas** (sistema Django externo). Se accede desde la sección **Herramientas** del menú lateral (el administrador debe habilitar el permiso `herramientas` para el rol).

**URL directa:** `{PROCESADOR_URL}/diversos/`
:::

---

## Descripción

Calcula el rendimiento de productos diversos: vinos, refrescos y cervezas.

---

## Archivos requeridos

### Archivo de Diversos (Excel)
Debe contener:
- `descripcion`: Descripción del producto

### Archivo de Insumos (Excel)

| Columna | Descripción |
|---------|-------------|
| `idinsumo` | Identificador único |
| `descripcion` | Nombre del insumo |
| `presentacion` | Tamaño del producto |
| `grupo` *(opcional)* | Categoría (VINOS, CERVEZA, BEBIDAS) |

---

## Detección automática de tipo

### Prioridad 1: columna de grupo
Si existe columna `grupo`, `tipo` o `categoria` en insumos:
- Contiene `VINO` → VINO
- Contiene `CERVEZA` o `BEER` → CERVEZA
- Contiene `REFRESCO`, `BEBIDA`, `JUGO` → REFRESCO

### Prioridad 2: palabras clave en descripción

#### Vinos
Tipos: `VINO`, `TINTO`, `BLANCO`, `ROSADO`, `ROSE`  
Variedades: `CABERNET`, `MERLOT`, `CHARDONNAY`, `SAUVIGNON`, `MALBEC`, `SHIRAZ`, `PINOT`, `TEMPRANILLO`, `SYRAH`, `GRENACHE`, `ZINFANDEL`  
Clasificaciones: `RESERVA`, `GRAN RESERVA`, `CRIANZA`  
Regiones: `BORGONA`, `RIOJA`, `CHIANTI`, `BORDEAUX`  
Espumantes: `ESPUMANTE`, `CHAMPAGNE`, `PROSECCO`, `CAVA`

#### Cervezas
Términos: `CERVEZA`, `BEER`, `ALE`, `LAGER`  
Marcas: `CORONA`, `MODELO`, `HEINEKEN`, `BUDWEISER`

#### Refrescos
Términos: `JUGO`, `AGUA`, `REFRESCO`  
Marcas: `COCA`, `PEPSI`, `SPRITE`, `FANTA`

---

## Reglas de cálculo

### Vinos

Busca tamaño en ML en tres lugares:
1. Columna `presentacion` del insumo
2. Columna `descripcion` del insumo
3. Descripción original del archivo diversos

| Tamaño | Copas |
|--------|-------|
| 700 – 750 ML | 6 copas |
| 375 ML | 3 copas |
| Otros tamaños | 0 copas |

### Refrescos
- **1 unidad** por producto (sin importar tamaño)

### Cervezas
- **1 unidad** por producto (sin importar tamaño)

---

## Estrategias de matching

| # | Estrategia | Descripción |
|---|-----------|-------------|
| 1 | Match Exacto | Coincidencia exacta normalizada |
| 2 | Match Parcial | Descripción contenida al inicio |
| 3 | Limpieza de Términos | Quita `LATA`, `VIDRIO`, `VASO` |
| 4 | Sin Prefijo VASO | Quita `VASO` del inicio |
| 5 | Sin Prefijo BOTELLA | Quita `BOTELLA` del inicio |
| 6 | Match Flexible | Compara palabras clave, requiere ≥60% de coincidencia |

:::info Match Flexible
El match flexible ignora: tamaños (235ML, 355ML, 1LT) y palabras descriptivas (MINI, DE, DEL, LA, EL, CON, Y, A, EN).
:::

---

## Ejemplos de matching

### Vino con prefijo BOTELLA
```
Input:  BOTELLA 34 MALBEC 750 ML
Insumo: 34 MALBEC 750 ML
→ Quita "BOTELLA" → Match exacto → VINO → 750ML → 6 copas
```

### Jugo con prefijo VASO
```
Input:  VASO JUGO DE ARANDANO
Insumo: JUGO DE ARANDANO
→ Quita "VASO" → Match exacto → REFRESCO → 1 unidad
```

### Cerveza con sufijo LATA
```
Input:  MICHELOB ULTRA DE LATA
Insumo: ULTRA DE LATA
→ Match parcial → CERVEZA → 1 unidad
```

### Agua con tamaño diferente
```
Input:  AGUA MINERAL CIEL MINI DE 235 ML
Insumo: AGUA MINERAL CIEL 355 ML
→ Match flexible (AGUA + MINERAL + CIEL) → REFRESCO → 1 unidad
```

---

## Archivo de salida

Nombre: `diversos_procesado.xlsx`

| Columna | Descripción |
|---------|-------------|
| *(columnas originales)* | Datos del archivo de entrada |
| `idinsumo` | ID del insumo matcheado |
| `copas_unidades` | Cantidad calculada |
