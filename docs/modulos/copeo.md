---
sidebar_position: 6
title: Módulo de Copeo
---

# Módulo de Copeo

:::note Herramienta externa
Este módulo forma parte del **Procesador de Recetas** (sistema Django externo). Se accede desde la sección **Herramientas** del menú lateral (el administrador debe habilitar el permiso `herramientas` para el rol).

**URL directa:** `{PROCESADOR_URL}/copeo/`
:::

---

## Descripción

Calcula el rendimiento en copas de botellas de licores y bebidas alcohólicas.

---

## Archivos requeridos

### Archivo de Copeo (Excel)
Debe contener:
- `descripcion`: Descripción del producto

### Archivo de Insumos (Excel)

| Columna | Descripción |
|---------|-------------|
| `idinsumo` | Identificador único |
| `descripcion` | Nombre del insumo |
| `presentacion` | Tamaño de la botella |

---

## Factores de conversión

| Tipo de copa | Factor |
|---|---|
| Copa sencilla | ×1 |
| Copa doble | ×1.78 |

```
Copas Dobles = int(Copas Sencillas / 1.78)
```

---

## Reglas de cálculo

### Copas sencillas por tamaño

| Tamaño de botella | Copas sencillas |
|-------------------|-----------------|
| 1000 ML o más | 22 |
| 750 ML | 17 |
| 700 ML | 16 |
| Otros tamaños | Proporcional a 22 copas/litro |

### Copas dobles calculadas

| Botella | Sencillas | Dobles |
|---|---|---|
| 1 LT | 22 | 12 |
| 750 ML | 17 | 9 |
| 700 ML | 16 | 8 |

### Copas individuales

Detecta productos con prefijo `COPA` o `COPA D`:

| Prefijo | Copas sencillas | Copas dobles |
|---------|-----------------|--------------|
| `COPA` | 1 | 0 |
| `COPA D` | 0 | 1 |

---

## Estrategias de matching

1. Match exacto normalizado
2. Match parcial normalizado
3. Sin prefijo `COPA`/`COPA D`: quita el prefijo y busca la base
4. Con prefijo `BOTELLA`: agrega BOTELLA si no se encontró
5. Match en presentación: busca también en columna presentación

---

## Archivo de salida

Nombre: `copeo_procesado.xlsx`

| Columna | Descripción |
|---------|-------------|
| *(columnas originales)* | Datos del archivo de entrada |
| `idinsumo` | ID del insumo matcheado |
| `copas_sencillas` | Cantidad de copas sencillas |
| `copas_dobles` | Cantidad de copas dobles |

**Formato:** encabezados azules `#4472C4` · bordes en todas las celdas · filas sin match en rojo `#FFC7CE`
