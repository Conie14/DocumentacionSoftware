---
sidebar_position: 17
title: Bitácora
---

# Módulo 17 — Bitácora

## ¿Qué hace?

Registro inmutable de todas las acciones del sistema. Se escribe automáticamente en cada operación relevante (crear, editar, eliminar, importar, login). **Nunca se borra ni modifica** — garantiza la trazabilidad completa de quién hizo qué y cuándo.

## Estructura de cada entrada

| Campo | Descripción |
|---|---|
| `fecha` | Timestamp exacto de la acción (automático) |
| `usuario` | Nombre del usuario que realizó la acción |
| `accion` | Tipo: `Crear` · `Modificar` · `Eliminar` · `Importar` · `Login` |
| `modulo` | Módulo del sistema donde ocurrió |
| `detalle` | Descripción específica del cambio |

### Ejemplo de entradas

```
2025-05-29 10:32:14  |  María García  |  Crear    |  recetas       |  Se creó la receta FILETE AL VINO (REC0234)
2025-05-29 10:45:01  |  Juan López    |  Importar |  costos        |  Se importaron 450 registros de costos Mayo 2025
2025-05-29 11:02:33  |  Admin         |  Eliminar |  usuarios      |  Se eliminó el usuario "jsmith"
2025-05-29 11:15:00  |  María García  |  Login    |  —             |  Inicio de sesión exitoso
```

## Cómo se registra automáticamente

La función `logAccion()` de `lib/bitacora.ts` se llama en cada endpoint de la API que modifica datos:

```typescript
// lib/bitacora.ts
await logAccion(usuario, idUsuario, 'Crear', 'recetas', `Se creó la receta ${nombre}`)
```

No requiere ninguna acción del usuario — el registro es transparente.

## Funcionalidades de la vista

| Funcionalidad | Descripción |
|---|---|
| Búsqueda | Por usuario, módulo o detalle |
| Filtro por fecha | Rango de fechas configurable |
| Filtro por acción | Ver solo Crear, Modificar, Eliminar, etc. |
| Ordenamiento | Por fecha (descendente por defecto) |
| Paginación | Configurable |
| Exportar Excel | Descarga del historial filtrado |
| Exportar PDF | Reporte con formato profesional |

:::info Solo lectura
La bitácora es de solo lectura. No existe ningún botón de edición o eliminación — es un registro permanente por diseño.
:::

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/bitacora` | Historial de actividad (solo lectura) |
