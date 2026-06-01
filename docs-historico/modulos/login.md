---
sidebar_position: 1
title: Login / Autenticación
---

# Módulo 1 — Login / Autenticación

## ¿Qué hace?

Es la puerta de entrada al sistema. Ninguna ruta del dashboard es accesible sin haber pasado por este módulo. Cuando el usuario envía sus credenciales, el sistema ejecuta una cadena de verificaciones antes de conceder acceso. Si todo es correcto, se emite una sesión cifrada que dura 30 minutos y se renueva con cada navegación.

## Flujo Detallado

1. El usuario escribe su nombre de usuario y contraseña
2. Debe completar el reCAPTCHA de Google (checkbox "No soy un robot" con posible desafío de imágenes)
3. El frontend envía los tres valores al endpoint `POST /api/auth/login`
4. El servidor verifica el token CAPTCHA con la API de Google. Si falla, rechaza inmediatamente sin consultar la base de datos
5. Busca al usuario en la BD solo por nombre de usuario (nunca incluye la contraseña en la query SQL)
6. Verifica si la cuenta está bloqueada permanente o temporalmente
7. Compara la contraseña ingresada con el hash bcrypt almacenado usando `bcrypt.compare()`
8. Si es incorrecta, incrementa el contador de intentos y aplica bloqueos según las reglas
9. Si es correcta, resetea los contadores y emite un JWT firmado en cookie `httpOnly`

## Seguridad Implementada (5 Capas)

### Capa 1 — Google reCAPTCHA v2

El servidor verifica el token con `https://www.google.com/recaptcha/api/siteverify` antes de procesar cualquier credencial. Esto bloquea completamente bots, scripts automatizados y ataques de fuerza bruta masivos. La clave secreta `RECAPTCHA_SECRET_KEY` nunca sale del servidor.

### Capa 2 — Protección contra Inyección SQL

La contraseña jamás se usa en una query SQL. El flujo es: buscar usuario → traer hash de BD → comparar en memoria con bcrypt. Prisma ORM parametriza automáticamente todas las queries, haciendo imposible cualquier intento de inyección como `' OR 1=1 --`.

### Capa 3 — Hashing bcrypt

Las contraseñas se almacenan como hashes bcrypt en el campo `Contrasena VARCHAR(200)`. Bcrypt es resistente a ataques de diccionario, rainbow tables y fuerza bruta por hardware. La función `bcrypt.compare()` es resistente a timing attacks al ejecutarse en tiempo constante.

### Capa 4 — Sistema de Bloqueo por Intentos Fallidos

```
Intento 1 incorrecto → "Credenciales inválidas. 2 intentos restantes"
Intento 2 incorrecto → "Credenciales inválidas. 1 intento restante"
Intento 3 incorrecto → BLOQUEO TEMPORAL 30 minutos (bloqueadoHasta = ahora + 30min)
                        bloqueadoVeces = 1
[Pasados 30 min]     → Desbloqueo automático, contador reinicia

Intento 4 incorrecto → "1 intento restante"
Intento 5 incorrecto → "1 intento restante"
Intento 6 incorrecto → BLOQUEO PERMANENTE (bloqueadoPermanente = true)
                        bloqueadoVeces = 2
                        Solo el Administrador puede desbloquear desde Usuarios
```

El estado de bloqueo se almacena en los campos `intentosFallidos`, `bloqueadoHasta`, `bloqueadoPermanente` y `bloqueadoVeces` de la tabla Usuarios.

### Capa 5 — JWT httpOnly

Al autenticarse exitosamente se genera un token JWT firmado con HS256 usando la clave `JWT_SECRET` del `.env`. Se almacena en una cookie con la bandera `httpOnly`, lo que significa que ningún script JavaScript del navegador puede leerla, protegiéndola contra ataques XSS. La sesión expira en **30 minutos**.

## Interfaz

Fondo oscuro `#0d1117` con orbes decorativos de gradiente violeta/azul. Card central con campos de usuario, contraseña (con toggle mostrar/ocultar), widget reCAPTCHA y botón de ingreso con estado de carga. Toggle de tema claro/oscuro en la esquina superior derecha.
