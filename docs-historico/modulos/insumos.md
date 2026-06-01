---
sidebar_position: 11
title: Insumos
---

# Módulo 11 — Insumos

## ¿Qué hace?

Administra el catálogo maestro de todos los insumos del sistema. Es la tabla central que referencian `Recetas`, `Subrecetas`, `Bebidas`, `MixologiaCocteleria` y `Costos` para identificar ingredientes y productos. Cada insumo puede tener hasta 26 proveedores asignados y pertenece a un grupo y una clasificación.

## Estructura de datos

| Campo clave | Uso en el sistema |
|---|---|
| `idinsumo` | Código de referencia cruzada con todas las demás tablas |
| `descripcion` | Nombre completo del insumo (ej. "PECHUGA DE POLLO SIN HUESO") |
| `unidad` | Unidad base de medida (KG, LT, PZA) |
| `rendimiento` | Factor divisor para el cálculo de costos |
| `Grupo_id_grupo` | Grupo al que pertenece (CARNES, LÁCTEOS, etc.) |
| `Clasificacion_id_clasificacion` | Clasificación asignada |
| `Presentacion_id_presentacion` | Presentación predeterminada |

### El campo `rendimiento`

Es el factor que divide el precio de la presentación para obtener el costo por unidad base:

```
Presentación: "1 KG" → precio = $150.00 → rendimiento = 1000 (gramos)

Si la receta usa 250 gramos:
  Costo = (150 / 1000) × 250 = $37.50
```

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Búsqueda | Por código (`idinsumo`) o descripción en tiempo real |
| Ordenamiento | En columnas principales (asc/desc) |
| Paginación | Configurable (15, 25, 50, 100 o Todos) |
| Filtro por grupo | Ver solo insumos de un grupo específico |
| Crear / Editar | Modal con todos los campos del insumo |
| Eliminar | Con confirmación |
| Importar Excel | Carga masiva desde archivo `.xlsx`/`.xls` |
| Exportar Excel | Descarga del catálogo completo |
| Exportar PDF | Reporte con formato profesional |

## Relación con Proveedores

Cada insumo puede tener hasta 26 proveedores en los campos `proveedorA` a `proveedorZ` (IDs de la tabla `Proveedor`). La relación formal se gestiona en la tabla intermedia `InsumoHasProveedor`.

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/insumos` | Lista completa del catálogo |
| `GET` | `/api/insumos/lookup?idinsumo=X` | Buscar por código |
| `POST` | `/api/insumos` | Crear insumo |
| `PUT` | `/api/insumos/{id}` | Modificar |
| `DELETE` | `/api/insumos/{id}` | Eliminar |
| `POST` | `/api/insumos/importar` | Importar desde Excel |
