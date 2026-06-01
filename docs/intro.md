---
sidebar_position: 1
title: Introducción
---

# Sistema de Procesamiento de Recetas e Insumos

Sistema integral para el procesamiento, análisis y cálculo de rendimientos de recetas, copeo y productos diversos en la industria de alimentos y bebidas.

## Descripción General

Este sistema Django permite procesar tres tipos de información clave:

| Módulo | Descripción |
|--------|-------------|
| **Recetas** | Extracción y matching de ingredientes con catálogo de insumos |
| **Copeo** | Cálculo de rendimiento de botellas en copas sencillas y dobles |
| **Diversos** | Cálculo de rendimiento de vinos, refrescos y cervezas |

## Características Principales

- Procesamiento de archivos Excel con configuración dinámica
- Matching inteligente con múltiples estrategias de búsqueda
- Normalización automática de texto (acentos, espacios, mayúsculas)
- Detección automática de tipos de productos
- Generación de reportes Excel con formato profesional
- Interfaz web intuitiva y responsive

## Acceso a los Módulos

| Módulo | URL |
|--------|-----|
| Recetas | `http://localhost:8000/` |
| Copeo | `http://localhost:8000/copeo/` |
| Diversos | `http://localhost:8000/diversos/` |

## Versión

- **Versión**: 1.0.0
- **Fecha**: 2026-01-28
- **Framework**: Django 4.x
- **Python**: 3.8+
