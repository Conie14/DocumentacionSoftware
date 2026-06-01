---
sidebar_position: 14
title: Costos
---

# Módulo 14 — Costos

## ¿Qué hace?

Registra el historial mensual de compras importado desde Excel. Cada registro representa la inversión total de **un insumo en un mes específico**. El sistema calcula el precio unitario real (`Total_Inversion ÷ Total_Cantidad`) y lo usa para alimentar el dashboard, detectar variaciones de precio entre meses y generar análisis con el Asistente IA.

## Estructura de un registro de costo

```
Año: 2025, Mes: 5 (Mayo)
nombre: "POLLO ENTERO"
descripcion: "POLLO ENTERO FRESCO 1.8KG PROMEDIO"
grupo: "CARNES"
Total_Inversion: 45,000.00   → pesos gastados en el mes
Total_Cantidad: 300.00        → kilogramos comprados en el mes

Precio unitario = 45,000 ÷ 300 = $150.00 / KG
```

## Importación mensual desde Excel

### Campos requeridos

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | texto | Nombre corto del insumo |
| `descripcion` | texto | Descripción completa (clave de match con catálogo) |
| `grupo` | texto | Grupo del insumo (ej. CARNES) |
| `Unidad` | texto | Unidad de medida (KG, LT, PZA) |
| `Total_Inversion` | número | Monto total invertido en el mes |
| `Total_Cantidad` | número | Cantidad total comprada en el mes |
| `Mes_Num` | número | Número del mes (1=Enero … 12=Diciembre) |
| `Mes_Nombre` | texto | Nombre del mes (ej. "Mayo") |
| `Ano` | número | Año (ej. 2025) |

### Campos opcionales

| Campo | Descripción |
|---|---|
| `idcompra` | ID de la orden de compra |
| `folio` | Folio del documento (factura, remisión) |
| `region` | Región geográfica del proveedor |
| `marca` | Marca comercial del producto |

### Flujo de importación

```
1. Usuario sube archivo Excel (.xlsx/.xls)
   ↓
POST /api/costos/importar
   ↓
2. El servidor lee el Excel fila por fila
   ↓
3. Por cada fila:
   a. Normaliza texto (mayúsculas, sin acentos)
   b. Busca el insumo en el catálogo por descripción
   c. Si hay match → guarda con FK a Insumos
   d. Si no hay match → guarda sin FK (para conciliación posterior)
   ↓
4. Devuelve estadísticas:
   { total: 500, conMatch: 430, sinMatch: 70, porcentaje: "86%" }
```

## Conciliación con el catálogo

Cuando existen registros importados sin match con el catálogo de insumos:

```
POST /api/costos/reconciliar
→ Busca registros donde Insumo IS NULL
→ Intenta hacer match por descripción/nombre con Insumos
→ Actualiza el FK si encuentra coincidencia
```

## Análisis de variaciones (alimenta el Asistente IA)

El sistema compara automáticamente el mes actual contra el mes anterior:

```
Variación % = ((Precio actual - Precio anterior) ÷ Precio anterior) × 100
```

| Variación | Nivel | Alerta |
|---|---|---|
| > +20% | 🔴 Crítico | Alerta roja |
| +10% a +20% | 🟡 Advertencia | Alerta ámbar |
| +5% a +10% | 🔵 Información | Alerta azul |
| < 5% | Sin alerta | — |

## Visualización en el dashboard

Con permiso `Ver` en Costos, el dashboard muestra:
- Tendencia de inversión total en los últimos 12 meses
- Top 10 insumos por inversión en el mes actual
- Comparativa mensual de los últimos 12 meses
- Inversión total del mes actual

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET/POST` | `/api/costos` | Lista / Crear |
| `GET/PUT/DELETE` | `/api/costos/{id}` | Por ID |
| `POST` | `/api/costos/importar` | Importar Excel mensual |
| `POST` | `/api/costos/reconciliar` | Conciliar con catálogo de insumos |
