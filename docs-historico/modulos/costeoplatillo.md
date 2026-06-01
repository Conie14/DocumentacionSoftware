---
sidebar_position: 15
title: Costo Platillo
---

# Módulo 15 — Costo Platillo

## ¿Qué hace?

Calcula el costo de producción y el precio de venta sugerido de cualquier platillo. Aplica tres porcentajes configurables sobre el costo total de ingredientes: ganancia, servicio a mesa y comida del personal.

## Configuración global

La tabla `Costeoplatillo` guarda un único registro con los parámetros activos:

```json
{
  "PorcentajeGanancia": 80.0,   → % de ganancia sobre el costo
  "ServicioMesa":        12.0,  → % adicional por servicio a mesa
  "ComidaPersonal":       4.0   → % adicional por comida del personal
}
```

Estos valores se editan desde el botón **Configuración** del módulo y aplican globalmente.

## Fórmula completa

```
Costo materia prima   = Σ costos de todos los ingredientes

Precio base           = Costo × (1 + PorcentajeGanancia / 100)
Precio con servicio   = Precio base × (1 + ServicioMesa / 100)
Precio final          = Precio con servicio × (1 + ComidaPersonal / 100)
```

### Ejemplo detallado

```
Costo total ingredientes:  $159.00

Ganancia 80%:   $159.00 × 1.80 = $286.20
Servicio 12%:   $286.20 × 1.12 = $320.54
Personal 4%:    $320.54 × 1.04 = $333.37  ← Precio final sugerido
```

### Tabla de referencia rápida (sin servicio ni personal)

| Costo | Ganancia | Precio sugerido |
|---|---|---|
| $100.00 | 30% | $130.00 |
| $100.00 | 80% | $180.00 |
| $100.00 | 150% | $250.00 |
| $159.00 | 80% | $286.20 |

:::caution Costos en $0.00
Si el precio sugerido parece bajo, verifica que TODOS los ingredientes tengan una presentación seleccionada (✏️). Los ingredientes sin presentación cuentan como **$0.00** en el cálculo.
:::

## Cómo se calculan los costos

El cálculo ocurre **100% en el navegador** usando datos guardados en `localStorage`. No genera consultas adicionales al servidor:

```typescript
// lib/presentacion-store.ts
Costo ingrediente = (precioCatalogo / rendimiento) × cantidad
Costo compras     = (precioCompras  / rendimiento) × cantidad
```

- **Precio catálogo**: viene de `Presentacion.costopresentacion`
- **Precio compras**: calculado desde `Costos` como `SUM(Total_Inversion) / SUM(Total_Cantidad)`
- **Rendimiento**: viene de `Insumos.rendimiento` (factor divisor)

## Ingredientes que son subrecetas

Si un ingrediente apunta a una subreceta (su `idInsumo` coincide con un `idElaborado` de `Subrecetas`), el sistema calcula su costo sumando todos los sub-ingredientes de esa subreceta.

Para que el costo de la subreceta aparezca correctamente:
1. Ir al módulo **Subrecetas**
2. Abrir la subreceta
3. Seleccionar la presentación de cada uno de sus ingredientes (✏️)
4. Volver a **Costo Platillo** → el costo ya aparecerá calculado

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/costeoplatillo` | Obtener configuración actual |
| `PUT` | `/api/costeoplatillo` | Actualizar porcentajes |
| `GET` | `/api/recetas/insumo-info?idinsumo=X` | Presentaciones + precios de compra de un insumo |
