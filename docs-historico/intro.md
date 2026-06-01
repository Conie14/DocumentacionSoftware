---
sidebar_position: 1
title: Introducción
---

# Sistema Recetario — Histórico de Recetas

Sistema web para la gestión, visualización y exportación de recetas institucionales de los 12 restaurantes de la empresa.

## Descripción General

El Recetario actúa como el **gestor y repositorio central** de recetas: permite importar, visualizar y exportar la información, mientras que el Procesador de Recetas opera como motor de cálculo de forma independiente.

## Módulos Principales

| Módulo | Descripción |
|--------|-------------|
| **Recetas** | Visualización de platillos con sus ingredientes agrupados |
| **Subrecetas** | Preparaciones base usadas como insumo en recetas principales |
| **Bebidas** | Catálogo de botellas con rendimiento en copas sencillas y dobles |
| **Mixología** | Recetas de cócteles y preparaciones de bar con merma |
| **Usuarios** | Gestión de accesos, roles y privilegios |
| **Dashboard** | Visualizaciones y acceso rápido a herramientas |

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | Next.js | 16.1.6 |
| Lenguaje | TypeScript | 5 |
| Estilos | Tailwind CSS | v4 |
| ORM | Prisma | 7.4.2 |
| Base de datos | PostgreSQL | — |
| Autenticación | jose (JWT) | 6.2 |

## Versión

- **Framework**: Next.js 16.1.6
- **Lenguaje**: TypeScript 5
- **Base de datos**: PostgreSQL + Prisma ORM
