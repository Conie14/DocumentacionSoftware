---
sidebar_position: 10
title: Mi Perfil
---

# Módulo 10 — Mi Perfil

## ¿Qué hace?

Permite a cada usuario gestionar su propia información personal y cambiar su contraseña sin necesidad de que un administrador intervenga. Es accesible desde el menú desplegable del avatar en la barra superior.

## Secciones

### Tarjeta de Presentación

Muestra avatar con inicial del nombre en gradiente violeta/azul, nombre completo, nombre de usuario con `@`, y badge del rol asignado.

### Información Personal

Formulario con cuatro campos editables: Nombre, Apellido paterno, Apellido materno y Usuario (nombre de login). Los cambios se envían mediante `PATCH /api/perfil` y se validan en el servidor verificando que la sesión sea válida.

### Cambio de Contraseña

Sección independiente que requiere tres campos:

| Campo | Descripción |
|-------|-------------|
| Contraseña actual | Para verificación de identidad |
| Nueva contraseña | Mínimo 6 caracteres |
| Confirmación | Debe coincidir con la nueva contraseña |

Si los campos de contraseña están **vacíos**, el servidor ignora esa sección y solo actualiza los datos personales. Todos los campos tienen toggle de visibilidad.

## Feedback Visual

Al guardar aparece una alerta **verde** de éxito o **roja** de error. El botón muestra "Guardando..." durante la operación.
