---
sidebar_position: 5
title: Integración con el Procesador
---

# Integración con el Procesador de Recetas

El Procesador de Recetas es un **sistema externo independiente**. La relación entre ambos sistemas es la siguiente:

## Tabla de Integración

| Aspecto | Detalle |
|---------|---------|
| Tipo de integración | Enlace externo (no API, no embebido) |
| Acceso | Se abre en nueva pestaña del navegador |
| Configuración | Variable de entorno `NEXT_PUBLIC_PROCESADOR_URL` en el archivo `.env` |
| Cambiar URL | Solo editar el `.env` y reiniciar el servidor, sin tocar código |
| Ubicación en UI | Tarjeta en el Dashboard + opción en el menú lateral bajo "Herramientas" |
| Datos compartidos | El Recetario importa y almacena los datos desde Excel; el Procesador los consume por su cuenta |
| Seguridad | El enlace usa `rel="noopener noreferrer"` para prevenir acceso al contexto del Recetario |

## Arquitectura de la Relación

```
┌─────────────────────────┐         ┌──────────────────────────────┐
│     RECETARIO           │         │    PROCESADOR DE RECETAS     │
│  (Next.js + PostgreSQL) │──link──▶│      (Django + Excel)        │
│                         │         │                              │
│  • Importar desde Excel │         │  • Procesar recetas          │
│  • Visualizar recetas   │         │  • Matching de insumos       │
│  • Exportar PDF / Excel │         │  • Calcular rendimientos     │
│  • Gestionar usuarios   │         │  • Generar reportes          │
└─────────────────────────┘         └──────────────────────────────┘
       Repositorio central                  Motor de cálculo
```

El **Recetario** actúa como el gestor y repositorio (importar, visualizar, exportar recetas), mientras que el **Procesador de Recetas** actúa como el motor de cálculo o producción que opera sobre esos datos de forma independiente.

## Configuración

En el archivo `.env` del proyecto Recetario:

```env
NEXT_PUBLIC_PROCESADOR_URL=http://189.235.215.104:1070
```

Para apuntar a una URL diferente, solo se modifica este valor y se reinicia el servidor Next.js. No es necesario modificar ningún archivo de código fuente.
