---
sidebar_position: 9
title: Roles
---

# Módulo 9 — Roles

## ¿Qué hace?

Gestiona los perfiles de acceso del sistema. Un rol define qué puede hacer un usuario: solo ver datos, o también crear, modificar y eliminar. Cada usuario tiene exactamente un rol y cada rol tiene un conjunto de privilegios que se aplica a todos sus usuarios.

## Matriz de Permisos

Cada rol tiene 4 permisos booleanos independientes:

| Permiso | Badge | Descripción |
|---------|-------|-------------|
| Ver | Azul | Acceder y visualizar los módulos de datos |
| Crear | Verde | Crear nuevos registros e importar datos desde Excel |
| Modificar | Ámbar | Editar registros existentes |
| Eliminar | Rojo | Eliminar registros |

Estos permisos se verifican en las APIs del servidor. Por ejemplo, la API de importación verifica `privilegios.Crear === true` antes de procesar el archivo.

## Funcionalidades

| Funcionalidad | Descripción |
|---------------|-------------|
| Crear rol | Nombre y asignación de permisos mediante checkboxes |
| Editar rol | Modificar nombre y permisos de un rol existente |
| Eliminar rol | Bloqueado si tiene usuarios asignados |
| Búsqueda | Por nombre del rol |
| Conteo | Muestra cuántos usuarios tiene asignados cada rol |
