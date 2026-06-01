---
sidebar_position: 4
title: Seguridad en el Login
---

# Seguridad en el Login

Se implementan **5 capas de seguridad** en el proceso de autenticación.

---

## 1. Google reCAPTCHA v2

Antes de procesar cualquier credencial, el servidor verifica el token CAPTCHA contra la API de Google. Si la verificación falla, el login es rechazado **antes de consultar la base de datos**. Esto bloquea bots y ataques automatizados.

---

## 2. Protección contra Inyección SQL

La contraseña nunca se incluye en la query SQL. El flujo es:

1. Buscar usuario por nombre de usuario (query simple)
2. Comparar contraseña con hash usando `bcrypt.compare()` en memoria

Prisma ORM parametriza todas las queries automáticamente, haciendo imposible la inyección SQL.

---

## 3. Hashing bcrypt

Las contraseñas se almacenan en la BD como **hash bcrypt** (~12 rondas de costo). Nunca se guarda ni se transmite la contraseña en texto plano. La verificación usa `bcrypt.compare()`, que es resistente a ataques de tiempo.

---

## 4. Sistema de Bloqueo por Intentos Fallidos

```
Intento 1 fallido → intentosFallidos = 1  → "2 intentos restantes"
Intento 2 fallido → intentosFallidos = 2  → "1 intento restante"
Intento 3 fallido → BLOQUEO TEMPORAL 30 min, bloqueadoVeces = 1
   [30 min después → se desbloquea automáticamente]

Intento 4 fallido → intentosFallidos = 1  (reinicia contador)
Intento 5 fallido → intentosFallidos = 2
Intento 6 fallido → BLOQUEO PERMANENTE, bloqueadoVeces = 2
   [Solo el administrador puede desbloquear desde el módulo Usuarios]
```

| Estado | Condición | Desbloqueo |
|--------|-----------|------------|
| Normal | `intentosFallidos` < 3 | — |
| Bloqueado temporal | 3 fallos consecutivos | Automático a los 30 min |
| Bloqueado permanente | 6 fallos acumulados | Manual por administrador |

---

## 5. JWT httpOnly

Al autenticarse exitosamente se emite un **JSON Web Token** firmado con clave secreta (algoritmo HS256), almacenado en cookie `httpOnly`.

Al ser `httpOnly`, JavaScript del cliente **no puede leer el token**, protegiéndolo contra ataques XSS. La sesión expira en **30 minutos**.
