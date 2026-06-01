---
sidebar_position: 5
title: Bebidas
---

# Módulo 5 — Bebidas

## ¿Qué hace?

Gestiona el inventario de bebidas alcohólicas del bar, específicamente el rendimiento de botellas: cuántas copas sencillas y cuántas copas dobles se pueden servir de cada botella. Es una tabla plana (sin expansión de filas) porque cada fila ya contiene toda la información relevante.

## Lógica de Rendimiento

Una misma botella (mismo `idinsumo`) puede tener **dos registros** en la BD:

| Registro | Unidad | Rendimiento (ejemplo) |
|----------|--------|-----------------------|
| Copas sencillas | `Copa` | 17 |
| Copas dobles | `Copa D` | 9 |

Esto permite calcular el costo por copa según el tipo de servicio.

## Importación desde Excel

La importación maneja la doble inserción leyendo columnas específicas según la hoja del Excel:

| Hoja del Excel | Columna leída | Unidad asignada |
|----------------|---------------|-----------------|
| Sencillas | `copas_sencillas` | `Copa` |
| Dobles | `copas_dobles` | `Copa D` |
| Refresco y Cerveza | `cantidad` | Proveniente del Excel |

## Funcionalidades

| Funcionalidad | Descripción |
|---------------|-------------|
| Búsqueda | Por descripción, ID de insumo o nombre del insumo |
| Ordenamiento | En todas las columnas (asc/desc) |
| Paginación | Configurable (15, 25, 50, 100 o Todos) |
| Exportar Excel | Descarga en formato `.xlsx` |
| Exportar PDF | PDF con formato profesional |
| Importar Excel | Modal para cargar datos desde archivo |
