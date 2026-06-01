---
sidebar_position: 6
title: Mixología y Coctelería
---

# Módulo 6 — Mixología y Coctelería

## ¿Qué hace?

Administra las recetas de cócteles, mocktails y preparaciones de bar. Similar a Recetas en estructura, pero con campos adicionales propios del bar: la cantidad con merma (que considera el desperdicio en la preparación) y el ID de almacén (para trazabilidad del insumo por bodega).

## Estructura de Datos

La tabla `MixologiaCocteleria` agrupa por `idProducto` (equivalente al `idElaborado` en recetas).

### Campos Adicionales

| Campo | Descripción |
|-------|-------------|
| `Cantidad_c/merma` | Cantidad real considerando pérdida por evaporación, derrame o preparación |
| `IdAlmacen` | Identifica de qué almacén o bodega proviene el insumo |
| `elaborado` | Campo adicional de trazabilidad |

:::note
El forward slash en el nombre de columna `Cantidad_c/merma` se maneja con `@map("Cantidad_c/merma")` en el schema de Prisma.
:::

## Sub-tabla de Ingredientes

Al expandir un cóctel se muestra: ID Insumo, Nombre del Insumo, Cantidad y Unidad. Los badges de ID usan color **ámbar/dorado** para identificación visual.

## Funcionalidades

Idénticas al módulo de Recetas: búsqueda, ordenamiento, filas expandibles con ingredientes, paginación configurable, importación y exportación a Excel/PDF.
