---
sidebar_position: 7
title: Importar Excel
---

# Módulo 7 — Importar Excel

## ¿Qué hace?

Es el motor de carga de datos del sistema. Permite importar múltiples hojas de un archivo Excel en una sola operación, mapeando automáticamente cada hoja a su tabla correspondiente en la base de datos. Está disponible como botón en cada módulo de datos y todos importan el archivo completo sin importar desde qué página se abra.

## Hojas Reconocidas

| Nombre de hoja en Excel | Tabla en BD | Unidad |
|-------------------------|-------------|--------|
| Recetas Alimentos | Recetas | — |
| Subrecetas | Subrecetas | — |
| Sencillas | Bebidas | `Copa` |
| Dobles | Bebidas | `Copa D` |
| Mixología y Coctelería | MixologiaCocteleria | — |
| Refresco y Cerveza | Bebidas | Del Excel |

## Proceso de Importación (Backend)

1. **Autenticación**: verifica sesión activa
2. **Permiso**: verifica que el rol del usuario tenga `Crear = true` en Privilegios
3. **Lectura**: parsea el archivo Excel con la librería `xlsx`
4. **Normalización de columnas**: la función `nk()` convierte todos los encabezados a minúsculas sin caracteres especiales (`copas_sencillas` → `copassencillas`), permitiendo manejar variaciones en los archivos Excel
5. **Fill-down**: en hojas de recetas el ID del platillo solo aparece en la primera fila del grupo. El parser recuerda el último ID/Nombre visto y lo aplica a las filas siguientes hasta encontrar uno nuevo
6. **Deduplicación interna**: antes de consultar la BD, se eliminan filas duplicadas dentro del mismo archivo (mismo `idElaborado` + `idInsumo`) usando la función `dedupBy()`
7. **Verificación en BD**: consulta qué registros ya existen para no duplicar
8. **Inserción**: `createMany` con los registros genuinamente nuevos
9. **Respuesta**: devuelve por cada hoja cuántos registros se insertaron y cuántos ya existían

## Manejo de Errores

- Si una hoja falla, el error se registra en el arreglo `errores` pero el proceso **continúa con las demás hojas**
- Las hojas con nombres no reconocidos se registran en `omitidas`
- El frontend muestra un resumen por hoja con el resultado de cada una
