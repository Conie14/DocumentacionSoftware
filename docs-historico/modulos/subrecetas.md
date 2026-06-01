---
sidebar_position: 4
title: Subrecetas
---

# Módulo 4 — Subrecetas

## ¿Qué hace?

Administra las preparaciones base del establecimiento: fondos, salsas madres, masas, rellenos y cualquier preparación que se usa como ingrediente dentro de otra receta. Su importancia radica en que cuando una subreceta cambia (por ejemplo, cambia el costo de la harina), ese cambio se refleja en todas las recetas que la utilizan.

## Diferencia con Recetas

Aunque la estructura de datos es idéntica a Recetas (mismos campos, mismo patrón de agrupación por `idElaborado`), se almacenan en tablas separadas y tienen IDs con prefijo diferente en el Excel original (generalmente `SUB####`).

Los IDs de subrecetas aparecen como `idInsumo` en las recetas que las utilizan, cerrando el ciclo de referencia.

```
Receta principal
  └── idInsumo: "SUB0012"  ← apunta a una Subreceta
        └── Subreceta "SUB0012"
              ├── ingrediente 1
              ├── ingrediente 2
              └── ingrediente 3
```

## Funcionalidades

Idénticas al módulo de Recetas: búsqueda, ordenamiento, expansión de filas con ingredientes, paginación configurable, importación desde Excel y exportación a Excel/PDF.

Los badges de ID usan color **azul** para diferenciarse visualmente de las recetas (violeta).
