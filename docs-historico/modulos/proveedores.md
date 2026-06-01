---
sidebar_position: 12
title: Proveedores
---

# Módulo 12 — Proveedores

## ¿Qué hace?

Administra el catálogo de proveedores del sistema con sus datos fiscales y de contacto. Permite activar o suspender proveedores mediante el campo `autorizacion`. Un proveedor suspendido (`autorizacion = false`) no aparece en los procesos de compra.

## Datos del proveedor

| Campo | Descripción |
|---|---|
| `idproveedor` | Código interno |
| `nombre` | Nombre comercial |
| `razonsocial` | Razón social para facturación |
| `rfc` | RFC para efectos fiscales |
| `telefono` | Teléfono de contacto |
| `email` | Correo electrónico |
| `credito` | Condiciones de crédito (ej. "30 días") |
| `tipoproveedor` | Categoría (ej. NACIONAL, IMPORTADO) |
| `Cuentacontable` | Cuenta contable para integración con contabilidad |
| `autorizacion` | `true` = activo · `false` = suspendido |

## Autorización de proveedores

El botón de autorizar/desautorizar cambia el campo `autorizacion` del proveedor:

```
PATCH /api/proveedores/{id}/autorizacion
→ Activa o desactiva el proveedor
```

Los proveedores suspendidos se muestran con badge rojo en la lista.

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Búsqueda | Por código, nombre o RFC |
| Ordenamiento | En columnas principales |
| Paginación | Configurable |
| Crear / Editar | Modal con todos los campos |
| Autorizar / Desautorizar | Botón de toggle en cada fila |
| Eliminar | Con confirmación |
| Importar Excel | Carga masiva de proveedores |
| Siguiente ID disponible | `GET /api/proveedores/siguiente-id` |

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/proveedores` | Lista de proveedores |
| `POST` | `/api/proveedores` | Crear proveedor |
| `PUT` | `/api/proveedores/{id}` | Modificar |
| `DELETE` | `/api/proveedores/{id}` | Eliminar |
| `PATCH` | `/api/proveedores/{id}/autorizacion` | Autorizar/desautorizar |
| `GET` | `/api/proveedores/siguiente-id` | Próximo ID disponible |
| `POST` | `/api/proveedores/importar` | Importar desde Excel |
