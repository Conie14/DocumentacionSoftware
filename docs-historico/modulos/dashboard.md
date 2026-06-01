---
sidebar_position: 2
title: Dashboard
---

# Módulo 2 — Dashboard (Vista General)

## ¿Qué hace?

Es la pantalla principal después del login. Proporciona una visión ejecutiva del estado del sistema: cuántas recetas, subrecetas, productos de mixología y usuarios hay registrados, junto con análisis visuales de los insumos más utilizados. También actúa como punto de acceso al Procesador de Recetas externo.

## Componentes de la Vista

### Tarjetas de Estadísticas

Cuatro tarjetas con gradientes de color (violeta, azul, ámbar, esmeralda) que muestran conteos en tiempo real obtenidos directamente desde PostgreSQL. Cada tarjeta es un enlace clickeable que redirige al módulo correspondiente.

Los conteos se calculan con `groupBy` para no contar filas de ingredientes sino **recetas únicas** (agrupadas por `idElaborado` o `idProducto`).

| Tarjeta | Color | Datos que muestra |
|---------|-------|-------------------|
| Recetas | Violeta | Total de platillos únicos |
| Subrecetas | Azul | Total de preparaciones base únicas |
| Mixología | Ámbar | Total de cócteles únicos |
| Usuarios | Esmeralda | Total de cuentas registradas |

### Procesador de Recetas

Tarjeta especial con gradiente índigo que muestra la URL configurada del sistema externo y un botón "Abrir" que lanza el procesador en una nueva pestaña. La URL se configura en `.env` como `NEXT_PUBLIC_PROCESADOR_URL` y puede cambiarse sin tocar código.

### Gráficas de Insumos (InsumosCharts)

Componente cliente que consulta `GET /api/dashboard/insumos-stats`. La API agrega los insumos usados en las tres fuentes (Recetas, Subrecetas y MixologiaCocteleria) y devuelve los 20 más frecuentes.

| Gráfica | Tipo | Descripción |
|---------|------|-------------|
| Distribución de insumos | Pastel | Top 12 insumos más usados con paleta de 12 colores y leyenda lateral |
| Ranking de insumos | Barras horizontal | Top 10 insumos por número total de usos |

Ambas gráficas se adaptan automáticamente al tema claro/oscuro mediante un `MutationObserver` que detecta cambios en la clase `dark` del `<html>`.
