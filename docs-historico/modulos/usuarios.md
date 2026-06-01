---
sidebar_position: 8
title: Usuarios
---

# Módulo 8 — Usuarios

## ¿Qué hace?

Gestión completa de las cuentas de acceso al sistema. Los administradores pueden crear nuevos usuarios, asignarles roles y gestionar el estado de sus cuentas. Es también el panel desde donde se desbloquean cuentas bloqueadas por el sistema de seguridad del login.

## Estados de Cuenta

| Estado | Badge | Descripción |
|--------|-------|-------------|
| Activo | — | Puede iniciar sesión normalmente |
| Con intentos fallidos | Naranja | Entre 1 y 2 intentos fallidos, aún puede intentar |
| Bloqueado temporal | Ámbar | Superó 3 intentos, bloqueado 30 min. Se desbloquea solo |
| Bloqueado permanente | Rojo | Requiere intervención del administrador |

El avatar del usuario cambia de color según su estado: **violeta** (activo), **ámbar** (temporal), **rojo** (permanente).

## Desbloqueo de Cuentas

El botón "Desbloquear" llama a `POST /api/usuarios/{id}/desbloquear`, que resetea:

```
bloqueadoPermanente = false
bloqueadoHasta      = null
intentosFallidos    = 0
bloqueadoVeces      = 0
```

## Creación de Usuarios

Modal con campos: nombre, apellido paterno, apellido materno, nombre de usuario, contraseña y selector de rol. La contraseña se hashea con bcrypt antes de guardarse. El nuevo usuario aparece instantáneamente al inicio de la lista sin recargar la página.

## Exportación

Exporta a **Excel** o **PDF** con columnas: Usuario, Nombre completo, Rol y Estado.
