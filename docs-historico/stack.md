---
sidebar_position: 2
title: Stack Tecnológico
---

# Stack Tecnológico

## Tabla General

| Capa | Tecnología | Versión | Propósito |
|------|------------|---------|-----------|
| Framework | Next.js | 16.1.6 | App Router, SSR, API Routes |
| Lenguaje | TypeScript | 5 | Tipado estático en todo el proyecto |
| Estilos | Tailwind CSS | v4 | Utilidades CSS, dark/light mode |
| ORM | Prisma | 7.4.2 | Modelado y acceso a base de datos |
| Base de datos | PostgreSQL | — | Motor relacional principal |
| Adaptador BD | @prisma/adapter-pg | 7.4.2 | Conexión directa via driver pg |
| Autenticación | jose (JWT) | 6.2 | Firma y verificación de tokens |
| Hashing | bcryptjs | 3 | Cifrado de contraseñas |
| Gráficas | Chart.js + react-chartjs-2 | 4.5 / 5.3 | Visualizaciones en dashboard |
| Excel import | xlsx | 0.18.5 | Lectura de archivos .xlsx/.xls |
| Excel export | xlsx (cliente) | 0.18.5 | Descarga de reportes en Excel |
| PDF export | jspdf + jspdf-autotable | 4.2 / 5.0 | Generación de reportes PDF |
| CAPTCHA | react-google-recaptcha | 3.1 | Verificación humana en login |
| Iconos | Lucide React | 0.577 | Íconos SVG consistentes |

## Decisiones Arquitectónicas

### Next.js App Router
Se utiliza el App Router de Next.js 16, que permite definir rutas como directorios con archivos `page.tsx` y `layout.tsx`. Las API Routes (`/api/*`) se usan para toda la lógica de servidor: autenticación, consultas a BD, importación de archivos y exportación de reportes.

### Prisma + PostgreSQL
Todo el acceso a la base de datos pasa por Prisma ORM. Esto garantiza que todas las queries sean parametrizadas automáticamente, eliminando el riesgo de inyección SQL. El adaptador `@prisma/adapter-pg` establece la conexión directa con PostgreSQL mediante el driver nativo `pg`.

### Autenticación con JWT httpOnly
La sesión se maneja mediante JSON Web Tokens firmados con `jose` (algoritmo HS256), almacenados en cookies `httpOnly`. Al ser `httpOnly`, JavaScript del cliente no puede acceder al token, protegiéndolo contra ataques XSS. La sesión expira en 30 minutos.

### Importación y Exportación de Excel
La librería `xlsx` se utiliza tanto para leer archivos `.xlsx`/`.xls` al importar datos como para generar archivos Excel en las exportaciones. La generación de PDF se realiza con `jspdf` en combinación con `jspdf-autotable` para tablas formateadas.
