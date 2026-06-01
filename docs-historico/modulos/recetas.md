---
sidebar_position: 3
title: Recetas
---

# Módulo 3 — Recetas

## ¿Qué hace?

Gestiona el catálogo completo de recetas de alimentos del establecimiento. Cada receta está formada por un encabezado (ID y nombre del platillo) y un listado de ingredientes con sus cantidades y costos calculados. La vista principal muestra el nivel de receta y permite expandir cada una para ver sus ingredientes de forma interactiva con costos en tiempo real.

## Estructura de datos en la BD

Cada **fila** en la tabla `Recetas` representa un **ingrediente**, no una receta completa. Una receta con 8 ingredientes tiene 8 filas en la BD, todas con el mismo `idElaborado`. La API agrupa estas filas antes de enviarlas al frontend:

```
idElaborado: "REC0001" → "CALDO DE POLLO"
  ├─ Fila 1: idInsumo="INS0042"  insumo="POLLO"         Cantidad=0.50 Unidad=KG
  ├─ Fila 2: idInsumo="INS0103"  insumo="ZANAHORIA"     Cantidad=0.20 Unidad=KG
  ├─ Fila 3: idInsumo="INS0021"  insumo="CEBOLLA"       Cantidad=0.15 Unidad=KG
  └─ Fila 4: idInsumo="SUB0094"  insumo="POLVO DE CHILES" Cantidad=0.05 Unidad=KG
                └─ Este idInsumo existe en Subrecetas → ES UNA SUBRECETA
```

## Cómo se calcula el costo

El cálculo ocurre **100% en el navegador** usando datos de `localStorage`. No genera carga adicional al servidor:

```
Costo catálogo = (Precio catálogo ÷ Rendimiento presentación) × Cantidad receta
Costo compras  = (Precio compras  ÷ Rendimiento presentación) × Cantidad receta
```

**Ejemplo concreto:**
- Presentación "1 KG" de pollo = $150.00, rendimiento = 1000 gramos
- Cantidad en receta: 250 gramos
- Costo = (150 ÷ 1000) × 250 = **$37.50**

### Cómo funciona el modal de presentación (✏️)

```
1. GET /api/recetas/insumo-info?idinsumo={código}
   ↓
2. El servidor devuelve presentaciones disponibles con:
   - costopresentacion (precio catálogo)
   - avgCostoCompras (precio real de compras del último mes)
   ↓
3. El usuario selecciona una presentación
   ↓
4. La selección se guarda en localStorage
   ↓
5. Se recalcula el costo de toda la receta automáticamente
```

## Ingredientes que son subrecetas

Cuando `Recetas.idInsumo` coincide con `Subrecetas.idElaborado`, el sistema lo detecta automáticamente:

- Muestra badge azul **"Subreceta (N)"** — N = número de sub-ingredientes
- El botón ✏️ se deshabilita (la presentación se gestiona en el módulo Subrecetas)
- El costo se calcula sumando todos los sub-ingredientes de la subreceta

**Para ver el costo de una subreceta:**
1. Ir al módulo **Subrecetas**
2. Abrir la subreceta
3. Seleccionar presentación de cada ingrediente (✏️)
4. Volver a **Recetas** → el costo ya aparecerá calculado

## Columnas de la tabla de ingredientes

| Columna | Descripción |
|---|---|
| Clave | Código del insumo |
| Ingrediente | Nombre o badge azul si es subreceta |
| Cantidad | Cantidad requerida |
| Unidad | KG, LT, PZA, etc. |
| Presentación | Presentación seleccionada |
| Precio catálogo | Costo con `costopresentacion` |
| Precio compras | Costo con precio real de compras |
| Acciones | ✏️ Editar presentación |

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Búsqueda en tiempo real | Por ID de receta o nombre del platillo |
| Ordenamiento | Clickeable en columnas ID y Nombre (asc/desc) |
| Expansión de filas | Clic despliega la sub-tabla de ingredientes con costos |
| Paginación configurable | Selector de 15, 25, 50, 100 registros o "Todos" |
| Importar Excel | Modal de importación para cargar nuevas recetas |
| Exportar Excel | `.xlsx` con todos los costos calculados |
| Exportar PDF | PDF horizontal con encabezado violeta, fecha y filas alternas |
| % Ganancia | Se puede actualizar por receta individualmente |

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/recetas` | Lista de recetas agrupadas por `idElaborado` |
| `GET` | `/api/recetas/nombre?q=X` | Búsqueda por nombre |
| `GET` | `/api/recetas/insumo-info?idinsumo=X` | Presentaciones + precios de compra |
| `POST` | `/api/recetas` | Crear receta/ingrediente |
| `PUT` | `/api/recetas/{id}` | Modificar ingrediente |
| `DELETE` | `/api/recetas/{id}` | Eliminar ingrediente |
| `PUT` | `/api/recetas/ganancia` | Actualizar % ganancia |
| `POST` | `/api/importar` | Importar recetas completas desde Excel |
