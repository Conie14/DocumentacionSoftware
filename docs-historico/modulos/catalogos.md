---
sidebar_position: 13
title: Catálogos
---

# Módulo 13 — Catálogos

Agrupa tres catálogos auxiliares que clasifican y dan contexto a los insumos: **Clasificaciones**, **Grupos** y **Presentaciones**. Los tres siguen la misma estructura de interfaz.

---

## Clasificaciones

**Función:** Primer nivel de categorización de insumos. Agrupa por naturaleza o uso general.

| Campo | Descripción |
|---|---|
| `Idclasificacion` | Código alfanumérico. Ej: `"CLASIF001"` |
| `Clasificacion` | Nombre. Ej: `"CARNES FRÍAS"`, `"ABARROTES"` |

---

## Grupos

**Función:** Segundo nivel de categorización, más específico que la clasificación. Usado en las gráficas del dashboard para mostrar la distribución del catálogo.

| Campo | Descripción |
|---|---|
| `Idgrupos` | Código. Ej: `"GRP01"` |
| `Grupo` | Nombre. Ej: `"LÁCTEOS"`, `"VERDURAS"`, `"CARNES"` |

---

## Presentaciones

**Función:** Define cómo se compra un insumo comercialmente. El campo `costopresentacion` es la **base para calcular el costo de todos los ingredientes** en recetas y subrecetas.

| Campo | Descripción |
|---|---|
| `idpresentacion` | Código de la presentación |
| `presentacion` | Descripción. Ej: `"BOLSA 5 KG"`, `"BOTELLA 750 ML"` |
| `costopresentacion` | **Precio de catálogo** por esa presentación |

### Cómo se usa `costopresentacion` en el cálculo de costos

```
Presentación: "BOLSA 5 KG"
costopresentacion: $650.00
rendimiento del insumo: 5000 (gramos)

Si la receta usa 500 gramos:
  Costo = (650 / 5000) × 500 = $65.00
```

:::info Precio catálogo vs precio compras
- **`costopresentacion`**: precio fijo de la lista de precios del catálogo
- **Precio compras**: calculado dinámicamente desde `Costos` como `SUM(Total_Inversion) / SUM(Total_Cantidad)` — refleja el precio real pagado el último mes
:::

---

## Funcionalidades comunes

Los tres catálogos tienen las mismas operaciones:

| Funcionalidad | Descripción |
|---|---|
| Búsqueda | Por código o nombre en tiempo real |
| Ordenamiento | En todas las columnas |
| Paginación | Configurable |
| Crear / Editar | Modal con los campos del catálogo |
| Eliminar | Con confirmación |
| Importar Excel | Carga masiva desde `.xlsx`/`.xls` |

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET/POST` | `/api/clasificacion` | Lista / Crear clasificación |
| `GET/PUT/DELETE` | `/api/clasificacion/{id}` | Por ID |
| `POST` | `/api/clasificacion/importar` | Importar desde Excel |
| `GET/POST` | `/api/grupos` | Lista / Crear grupo |
| `GET/PUT/DELETE` | `/api/grupos/{id}` | Por ID |
| `POST` | `/api/grupos/importar` | Importar desde Excel |
| `GET/POST` | `/api/presentaciones` | Lista / Crear presentación |
| `GET/PUT/DELETE` | `/api/presentaciones/{id}` | Por ID |
| `POST` | `/api/presentaciones/importar` | Importar desde Excel |
