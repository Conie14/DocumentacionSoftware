---
sidebar_position: 6
title: Rendimiento
---

# Optimizaciones y Rendimiento

## Estrategias Implementadas

- **Indexación por diccionario**: Búsquedas O(1) en lugar de O(n)
- **Normalización en memoria**: Sin modificar archivos originales
- **Búsqueda progresiva**: De estrategias rápidas a lentas
- **Índices duales**: Descripción y presentación indexadas
- **Procesamiento por chunks**: Para archivos grandes

## Recomendaciones por Volumen

| Tamaño del archivo | Rendimiento |
|--------------------|-------------|
| Hasta 10,000 registros | Procesamiento rápido |
| 10,000 – 50,000 registros | Procesamiento moderado |
| Más de 50,000 registros | Considerar división del archivo |
