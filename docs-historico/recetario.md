---
id: recetario
title: Sistema Recetario
sidebar_label: Recetario
sidebar_position: 10
description: Documentación técnica y manual de usuario completo del Sistema Recetario.
---

# Sistema Recetario

Sistema integral para la gestión de recetas, control de costos, catálogos de insumos, mixología y análisis automático con Inteligencia Artificial para la industria de alimentos y bebidas.

| Atributo | Detalle |
|---|---|
| **Versión** | 1.0.0 |
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript 5 |
| **Base de datos** | PostgreSQL 14+ |
| **ORM** | Prisma 7 |
| **Autenticación** | JWT con `jose` + cookie `httpOnly` |
| **Gestor de paquetes** | **pnpm 11** (ver advertencia de seguridad) |
| **IA local** | Ollama + Qwen 2.5 (sin costo, sin datos a la nube) |
| **Puerto por defecto** | `3000` |
| **URL del sistema** | `http://localhost:3000` |

---

## ⚠️ Seguridad — Por qué pnpm y no npm

:::danger No ejecutes npm install en este proyecto
En 2024–2025 se han reportado múltiples incidentes de **paquetes maliciosos en el registro público de npm** que roban credenciales, inyectan código en el build o comprometen el sistema durante la instalación. Este proyecto usa **pnpm** como medida de seguridad activa:
:::

### Diferencias de seguridad pnpm vs npm

| Característica | npm | pnpm |
|---|---|---|
| Almacenamiento de paquetes | Copia por proyecto | Enlace duro desde store central |
| Dependencias fantasma | ✅ Permite acceso a no declaradas | ❌ Bloquea acceso no declarado |
| Scripts de instalación | Todos los paquetes pueden ejecutar | Solo los de `allowBuilds` |
| Lockfile con integridad | Parcial | Hash SHA-512 por paquete |
| Aislamiento por paquete | Débil | Estricto (cada paquete solo ve sus deps) |

### Configuración de seguridad activa en este proyecto

El archivo `pnpm-workspace.yaml` declara explícitamente qué paquetes pueden ejecutar scripts durante la instalación:

```yaml
# pnpm-workspace.yaml
packages:
  - 'recetario'

allowBuilds:
  '@prisma/engines': true   # ← motor nativo de Prisma (C++)
  prisma: true              # ← CLI de Prisma
```

**Todo paquete no listado aquí es instalado sin ejecutar ningún script.** Si un paquete malicioso intenta ejecutar código en su `postinstall`, pnpm lo bloquea silenciosamente.

---

## Requisitos previos

### 1. Node.js v18 o superior

Descarga desde **https://nodejs.org** → sección **LTS (Long-Term Support)**.

```bash
# Verificar instalación
node --version
# Este entorno: v22.14.0
# Mínimo requerido: v18.0.0
```

### 2. pnpm v8 o superior (sin usar npm)

pnpm viene empaquetado con Node.js a través de **Corepack**:

```bash
# Paso 1 — Activar Corepack (incluido con Node.js 16.9+)
corepack enable

# Paso 2 — Instalar la versión estable de pnpm
corepack prepare pnpm@latest --activate

# Paso 3 — Verificar
pnpm --version
# Este entorno: 11.1.2
```

Si Corepack no está disponible en tu versión de Node.js:

```bash
# ÚNICO uso permitido de npm: instalar pnpm globalmente
npm install -g pnpm

# Después de esto, NUNCA usar npm dentro del proyecto
```

:::caution
Una vez instalado pnpm, **no ejecutes `npm install`** dentro de la carpeta del proyecto. Usa exclusivamente `pnpm install`.
:::

### 3. PostgreSQL v14 o superior

Descarga desde **https://www.postgresql.org/download/**

Durante la instalación de PostgreSQL:
- Anota el **puerto** (por defecto `5432`)
- Anota el **superusuario** (por defecto `postgres`)
- Establece una **contraseña fuerte**

Después de instalar, crea la base de datos:

```sql
-- Conéctate con psql o pgAdmin y ejecuta:
CREATE DATABASE recetario
  WITH ENCODING = 'UTF8'
       LC_COLLATE = 'es_MX.UTF-8'
       LC_CTYPE = 'es_MX.UTF-8';
```

Si no tienes soporte de locale español:
```sql
CREATE DATABASE recetario WITH ENCODING = 'UTF8';
```

### 4. Ollama (opcional — solo para el Asistente IA)

Descarga desde **https://ollama.com** → botón Download for Windows.

La instalación es un ejecutable estándar de Windows. No requiere configuración adicional.

### 5. Git (recomendado)

Descarga desde **https://git-scm.com/download/win**

---

## Instalación completa paso a paso

### Paso 1 — Obtener el código fuente

**Con Git:**
```bash
git clone <url-del-repositorio>
cd HistoricoRecetas
```

**Sin Git (desde ZIP):**
1. Descomprime el archivo en `C:\Proyectos\HistoricoRecetas\` (evitar rutas con espacios o acentos)
2. Abre una terminal en esa carpeta

### Paso 2 — Instalar dependencias con pnpm

```bash
# Ejecutar desde la carpeta raíz: HistoricoRecetas/
pnpm install
```

**¿Qué ocurre durante este comando?**

1. Lee `pnpm-workspace.yaml` — detecta el paquete `recetario`
2. Lee `recetario/package.json` — lista todas las dependencias
3. Descarga cada paquete al store central de pnpm (`%LOCALAPPDATA%\pnpm\store`)
4. Crea enlaces duros desde el store a `recetario/node_modules`
5. **Solo ejecuta scripts de build para `@prisma/engines` y `prisma`**
6. Genera/actualiza `pnpm-lock.yaml` con hashes SHA-512 de cada paquete

Salida esperada:
```
Packages: +312
++++++++++++++++++++++++++++++++++++
Progress: resolved 312, reused 310, downloaded 2, added 312, done
```

### Paso 3 — Configurar variables de entorno

```bash
# Copiar la plantilla
copy recetario\.env.example recetario\.env
```

Abre `recetario/.env` con cualquier editor (Bloc de notas, VS Code, etc.) y edita:

```env
# ─── Base de datos ────────────────────────────────────────────────────────────
# Formato: postgresql://USUARIO:CONTRASEÑA@SERVIDOR:PUERTO/NOMBRE_BASE_DE_DATOS
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/recetario"

# ─── Seguridad JWT ────────────────────────────────────────────────────────────
# Mínimo 32 caracteres aleatorios. La sesión dura 30 minutos.
JWT_SECRET="PonAquíUnaClaveAleatoriaMuyLargaYSegura2025"

# ─── Puerto del servidor (opcional) ──────────────────────────────────────────
PORT=3000

# ─── Procesador externo Django ────────────────────────────────────────────────
NEXT_PUBLIC_PROCESADOR_URL="http://TU_IP_SERVIDOR:1070"

# ─── reCAPTCHA (para el login) ────────────────────────────────────────────────
RECAPTCHA_SECRET_KEY="tu_clave_secreta_de_google_recaptcha"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="tu_clave_publica_de_google_recaptcha"
```

**Generar un JWT_SECRET seguro:**

```powershell
# Opción 1 — PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 48 | ForEach-Object {[char]$_})

# Opción 2 — Node.js en la terminal
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

:::danger Nunca subas .env a Git
El archivo `.env` está en `.gitignore`. Contiene contraseñas reales. Si accidentalmente lo subes a un repositorio, cambia inmediatamente todas las credenciales.
:::

### Paso 4 — Sincronizar la base de datos con Prisma

```bash
# Navegar a la carpeta de la aplicación
cd recetario

# Generar el cliente TypeScript de Prisma
# (esto lee schema.prisma y crea los tipos para el código)
pnpm exec prisma generate

# Crear todas las tablas en PostgreSQL
# (lee schema.prisma y ejecuta los CREATE TABLE necesarios)
pnpm exec prisma db push

# Volver a la raíz
cd ..
```

**Salida esperada de `prisma db push`:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "recetario", schema "public" at "localhost:5432"

🚀  Your database is now in sync with your Prisma schema. Done in 847ms
```

### Paso 5 — Descargar el modelo de IA (opcional)

```bash
# Solo si vas a usar el Asistente IA
ollama pull qwen2.5
```

La descarga es ~4.7 GB y solo se hace una vez. Progreso esperado:
```
pulling manifest
pulling 7b0e9eefc17b...  100% ▕████████████████▏ 4.7 GB
pulling 66b9ea09bd5b...  100% ▕████████████████▏  68 B
verifying sha256 digest
writing manifest
success
```

### Paso 6 — Iniciar el servidor

```bash
# Desde HistoricoRecetas/ (la raíz del proyecto)
pnpm run dev
```

Salida esperada:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Starting...
✓ Ready in 2.1s
```

Abre **http://localhost:3000** en tu navegador.

---

## Comandos de referencia rápida

### Desde `HistoricoRecetas/` (raíz)

| Comando | Descripción |
|---|---|
| `pnpm install` | Instalar/actualizar dependencias |
| `pnpm run dev` | Servidor de desarrollo (hot-reload) |
| `pnpm run build` | Compilar para producción |
| `pnpm run start` | Iniciar versión compilada |
| `pnpm run lint` | Verificar errores de código |

### Desde `HistoricoRecetas/recetario/` (aplicación)

| Comando | Descripción |
|---|---|
| `pnpm exec prisma generate` | Regenerar cliente Prisma (tras cambiar schema) |
| `pnpm exec prisma db push` | Aplicar cambios del schema a la BD (desarrollo) |
| `pnpm exec prisma migrate deploy` | Aplicar migraciones en producción |
| `pnpm exec prisma migrate status` | Ver estado de las migraciones |
| `pnpm exec prisma studio` | Abrir explorador visual de la BD en el navegador |
| `pnpm exec prisma db pull` | Importar schema desde una BD existente |

### Ollama (IA)

| Comando | Descripción |
|---|---|
| `ollama pull qwen2.5` | Descargar el modelo (4.7 GB, una sola vez) |
| `ollama list` | Ver modelos descargados |
| `ollama run qwen2.5` | Probar el modelo en la terminal |
| `ollama serve` | Iniciar el servidor manualmente |
| `ollama stop qwen2.5` | Liberar memoria RAM del modelo |
| `ollama rm qwen2.5` | Eliminar el modelo del disco |

---

## Estructura del proyecto

```
HistoricoRecetas/                   ← Raíz del monorepo
│
├── package.json                    ← Scripts raíz (dev, build, start, lint)
├── pnpm-workspace.yaml             ← Config workspace + allowBuilds
├── pnpm-lock.yaml                  ← Lockfile con hashes SHA-512
│
└── recetario/                      ← Aplicación Next.js 16
    │
    ├── .env                        ← Variables de entorno (NO en Git)
    ├── .env.example                ← Plantilla de variables
    ├── package.json                ← Dependencias del proyecto
    ├── next.config.ts              ← Configuración de Next.js
    ├── tsconfig.json               ← Configuración de TypeScript
    ├── tailwind.config.ts          ← Configuración de Tailwind CSS
    │
    ├── prisma/
    │   └── schema.prisma           ← Definición de todas las tablas y relaciones
    │
    ├── app/                        ← App Router de Next.js 16
    │   │
    │   ├── layout.tsx              ← Layout raíz (HTML, body, ThemeProvider)
    │   │
    │   ├── (auth)/
    │   │   └── login/
    │   │       └── page.tsx        ← Pantalla de login con reCAPTCHA
    │   │
    │   ├── api/                    ← Endpoints del servidor (REST)
    │   │   ├── auth/
    │   │   │   ├── login/          ← POST login, DELETE logout
    │   │   │   └── privilegios/    ← GET mapa de permisos del usuario
    │   │   ├── recetas/
    │   │   │   ├── route.ts        ← GET lista, POST crear
    │   │   │   ├── [id]/           ← GET, PUT, DELETE por ID
    │   │   │   ├── nombre/         ← GET búsqueda por nombre
    │   │   │   ├── ganancia/       ← PUT actualizar % ganancia
    │   │   │   └── insumo-info/    ← GET presentaciones + costos de un insumo
    │   │   ├── subrecetas/         ← Misma estructura que recetas/
    │   │   ├── bebidas/            ← Misma estructura
    │   │   ├── mixologia/          ← Misma estructura
    │   │   ├── insumos/
    │   │   │   ├── route.ts        ← GET, POST
    │   │   │   ├── [id]/           ← GET, PUT, DELETE
    │   │   │   ├── importar/       ← POST importación masiva Excel
    │   │   │   └── lookup/         ← GET búsqueda por código
    │   │   ├── costos/
    │   │   │   ├── route.ts        ← GET, POST
    │   │   │   ├── [id]/           ← GET, PUT, DELETE
    │   │   │   ├── importar/       ← POST importación masiva Excel
    │   │   │   └── reconciliar/    ← POST reconciliación con insumos
    │   │   ├── proveedores/
    │   │   │   ├── route.ts
    │   │   │   ├── [id]/
    │   │   │   │   ├── route.ts
    │   │   │   │   └── autorizacion/ ← PATCH autorizar/desautorizar
    │   │   │   ├── importar/
    │   │   │   └── siguiente-id/   ← GET próximo ID disponible
    │   │   ├── grupos/             ← CRUD + importar
    │   │   ├── clasificacion/      ← CRUD + importar
    │   │   ├── presentaciones/     ← CRUD + importar
    │   │   ├── usuarios/
    │   │   │   ├── route.ts
    │   │   │   └── [id]/
    │   │   │       ├── route.ts
    │   │   │       └── desbloquear/ ← POST desbloquear cuenta
    │   │   ├── roles/              ← CRUD
    │   │   ├── costeoplatillo/     ← GET config, PUT actualizar
    │   │   ├── bitacora/           ← GET historial
    │   │   ├── notificaciones/     ← GET alertas no leídas
    │   │   ├── perfil/             ← GET/PUT datos del perfil
    │   │   ├── importar/           ← POST importar recetas completas
    │   │   │   └── subrecetas/
    │   │   ├── dashboard/
    │   │   │   ├── datos/          ← GET datos personalizados por módulo
    │   │   │   └── insumos-stats/  ← GET estadísticas de uso de insumos
    │   │   └── ia/
    │   │       ├── analizar/       ← POST análisis automático con Qwen
    │   │       ├── alertas/        ← GET lista, PATCH/DELETE por ID
    │   │       └── chat/           ← POST pregunta → respuesta + gráfica
    │   │
    │   └── dashboard/              ← Páginas del sistema (protegidas)
    │       ├── layout.tsx          ← Layout con sidebar + header
    │       ├── page.tsx            ← Dashboard principal
    │       ├── recetas/page.tsx
    │       ├── subrecetas/page.tsx
    │       ├── bebidas/page.tsx
    │       ├── mixologia/page.tsx
    │       ├── insumos/page.tsx
    │       ├── clasificacion/page.tsx
    │       ├── grupos/page.tsx
    │       ├── presentaciones/page.tsx
    │       ├── proveedores/page.tsx
    │       ├── costos/page.tsx
    │       ├── costeoplatillo/page.tsx
    │       ├── usuarios/page.tsx
    │       ├── roles/page.tsx
    │       ├── bitacora/page.tsx
    │       ├── perfil/page.tsx
    │       ├── importar/page.tsx
    │       └── ia/page.tsx
    │
    ├── components/                 ← Componentes React reutilizables
    │   ├── sidebar.tsx             ← Menú lateral + header + layout responsive
    │   ├── dashboard-personalizado.tsx ← Gráficas por módulo (Chart.js)
    │   ├── insumos-charts.tsx      ← Gráficas de uso de insumos
    │   ├── presentacion-modal.tsx  ← Modal de selección de presentación
    │   ├── notification-bell.tsx   ← Campana de notificaciones IA
    │   ├── theme-toggle.tsx        ← Botón modo oscuro/claro
    │   └── user-menu.tsx           ← Menú de usuario (perfil, logout)
    │
    └── lib/                        ← Utilidades y servicios
        ├── auth.ts                 ← signToken(), getSession(), cookies JWT
        ├── prisma.ts               ← Instancia singleton de PrismaClient
        ├── swal.ts                 ← Helpers de SweetAlert2
        ├── bitacora.ts             ← logAccion() para registrar actividad
        └── presentacion-store.ts   ← loadSelecciones(), saveSelecc(), computeCostos()
```

---

## Autenticación — Flujo completo

### Proceso de inicio de sesión

```
Usuario ingresa credenciales + reCAPTCHA
           ↓
POST /api/auth/login
           ↓
┌──────────────────────────────────────────────┐
│ 1. Validar que usuario y contraseña no        │
│    estén vacíos                               │
│                                               │
│ 2. Verificar reCAPTCHA con Google API        │
│    → Si falla: 400 "reCAPTCHA fallida"       │
│                                               │
│ 3. Buscar usuario en BD por nombre           │
│    (la contraseña NO va en la query SQL)     │
│    → Si no existe: 401 "Credenciales inv."  │
│                                               │
│ 4. Verificar bloqueo permanente              │
│    → Si true: 403 "Contacta administrador"  │
│                                               │
│ 5. Verificar bloqueo temporal                │
│    → Si activo: 403 "Bloqueado X minutos"   │
│    → Si expirado: limpiar contadores         │
│                                               │
│ 6. bcrypt.compare(contraseña, hash_bd)       │
│    → Si no coincide:                         │
│       intentosFallidos++                     │
│       Si intentos >= 3:                      │
│         1ª vez → bloqueo 30 minutos          │
│         2ª vez → bloqueo permanente          │
│       Mostrar intentos restantes             │
│                                               │
│ 7. Login exitoso:                            │
│    → Reset intentosFallidos = 0              │
│    → Registrar en Bitácora                   │
│    → Generar JWT (expira en 30 minutos)      │
│    → Set cookie "session" httpOnly           │
└──────────────────────────────────────────────┘
           ↓
Redirigir a /dashboard
```

### Política de bloqueo de cuentas

| Situación | Resultado |
|---|---|
| 1 intento fallido | Alerta: "2 intentos restantes" |
| 2 intentos fallidos | Alerta: "1 intento restante" |
| 3 intentos fallidos (1ª vez) | Bloqueo temporal: 30 minutos |
| 3 intentos fallidos (2ª vez) | Bloqueo permanente (requiere admin) |
| Bloqueo temporal expirado | Se limpian los contadores automáticamente |

### JWT y sesión

- Token firmado con `jose` usando el `JWT_SECRET` del `.env`
- Almacenado en cookie `session` con flags `httpOnly` y `path=/`
- Duración: **30 minutos** desde el último request
- Al expirar, el siguiente request devuelve `401` y el frontend muestra "Sesión expirada" con SweetAlert

### Sistema de privilegios

```
GET /api/auth/privilegios
→ Devuelve mapa: { "modulo": { Ver, Crear, Modificar, Eliminar, Autorizar, Importar } }
```

Ejemplo de respuesta:
```json
{
  "recetas":        { "Ver": true,  "Crear": true,  "Modificar": true,  "Eliminar": false, "Autorizar": false, "Importar": false },
  "costos":         { "Ver": true,  "Crear": false, "Modificar": false, "Eliminar": false, "Autorizar": false, "Importar": true  },
  "administracion": { "Ver": false, "Crear": false, "Modificar": false, "Eliminar": false, "Autorizar": false, "Importar": false }
}
```

Los Super Admins (`admin`, `administrador`, `sistemas`) no consultan esta tabla — siempre tienen `true` en todo.

---

## Módulos del sistema — Referencia completa

### Dashboard personalizado

La pantalla de inicio lee `/api/dashboard/datos` y muestra únicamente las secciones a las que el usuario tiene acceso (`Ver = true`).

#### Secciones y gráficas

| Sección | Acceso | Gráficas incluidas |
|---|---|---|
| **Alertas IA** | Cualquier usuario | Cards de alertas sin leer con link a Asistente IA |
| **Costos** | módulo `costos` | Línea (tendencia 12 meses) + Barras horizontales (top 10 insumos) + Barras verticales (comparativa mensual) + Stat de inversión del mes |
| **Recetas** | módulo `recetas` | Doughnut (por grupo) + Barras horizontales (más ingredientes) + Barras verticales (conteo por grupo) |
| **Insumos** | módulo `insumos` | Doughnut (por grupo) + Barras horizontales (ranking por grupo) |
| **Bebidas y Mixología** | módulo `bebidas` / `mixologia` | Stats numéricos + Barra comparativa bebidas vs cócteles |
| **Administración** | módulo `administracion` | Stat total usuarios + Stat total roles + Doughnut (por rol) + Barras (por rol) |

---

### Módulo de Recetas

#### ¿Cómo está estructurada la BD para las recetas?

Cada **fila** en la tabla `Recetas` representa un **ingrediente** de una receta. La receta como entidad se identifica por `idElaborado` y agrupa múltiples filas:

```
idElaborado: "REC0001" — "CALDO DE POLLO"
  ├─ Fila 1: idInsumo="INS0042" insumo="POLLO" Cantidad=0.5 Unidad=KG
  ├─ Fila 2: idInsumo="INS0103" insumo="ZANAHORIA" Cantidad=0.2 Unidad=KG
  ├─ Fila 3: idInsumo="INS0021" insumo="CEBOLLA" Cantidad=0.15 Unidad=KG
  └─ Fila 4: idInsumo="SUB0094" insumo="POLVO DE CHILES" Cantidad=0.05 Unidad=KG
              └─ Este idInsumo existe en tabla Subrecetas → ES UNA SUBRECETA
```

#### Cómo se calcula el costo — Detalle técnico

El cálculo ocurre **100% en el navegador** (cliente) usando datos de `localStorage`. No genera carga adicional al servidor:

```typescript
// lib/presentacion-store.ts
function computeCostos(cantidad: number, seleccion: SeleccionPresentacion) {
  // precio_catalogo viene de Presentacion.costopresentacion
  // precio_compras viene de Costos (Total_Inversion / Total_Cantidad)
  // rendimiento viene de Insumos.rendimiento

  const costoCat  = (seleccion.precioCatalogo / seleccion.rendimiento) * cantidad
  const costoComp = seleccion.precioCompras
                  ? (seleccion.precioCompras / seleccion.rendimiento) * cantidad
                  : null

  return { costoCalc: costoCat, costoCompras: costoComp }
}
```

**Para ingredientes normales:**
```
Costo catálogo = (Precio catálogo ÷ Rendimiento presentación) × Cantidad receta
Costo compras  = (Precio compras ÷ Rendimiento presentación) × Cantidad receta
```

**Para ingredientes que son subrecetas:**
```
El sistema consulta cada sub-ingrediente de la subreceta
Para cada sub-ingrediente: aplica la misma fórmula anterior
Suma todos los sub-costos → ese es el costo de la subreceta
```

#### Cómo funciona el Modal de Presentación

Cuando el usuario hace clic en ✏️ de un ingrediente:

```
1. GET /api/recetas/insumo-info?idinsumo={código}
   ↓
2. El servidor busca en Insumos todos los registros con ese idinsumo
   ↓
3. Obtiene los IDs de Presentacion asociados
   ↓
4. Busca en Costos el precio promedio de compras:
   avgCostoCompras = SUM(Total_Inversion) / SUM(Total_Cantidad)
   (filtrando por Insumo e Insumos_Presentacion_id_presentacion)
   ↓
5. Devuelve al cliente:
   {
     rendimiento: 1000,        ← gramos en 1 KG
     unidad: "GR",
     presentaciones: [
       {
         id_presentacion: 5,
         presentacion: "1 KG",
         costopresentacion: 150.00,    ← precio catálogo
         avgCostoCompras: 142.50       ← precio real de compras
       }
     ]
   }
   ↓
6. El usuario selecciona una presentación
   ↓
7. La selección se guarda en localStorage con clave = idinsumo
   ↓
8. Se recalcula el costo de la receta con los nuevos valores
```

#### API de Recetas

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/recetas` | Lista todas las recetas (agrupadas por idElaborado) |
| `GET` | `/api/recetas/nombre?q=texto` | Búsqueda por nombre |
| `GET` | `/api/recetas/insumo-info?idinsumo=X` | Presentaciones + costos de un insumo |
| `POST` | `/api/recetas` | Crear nueva receta |
| `PUT` | `/api/recetas/{id}` | Modificar ingrediente/receta |
| `DELETE` | `/api/recetas/{id}` | Eliminar ingrediente |
| `PUT` | `/api/recetas/ganancia` | Actualizar % ganancia de una receta |

---

### Módulo de Subrecetas

Estructura y funcionamiento **idénticos** al módulo de Recetas, usando la tabla `Subrecetas`.

#### Integración con Recetas y Mixología

Cuando el sistema procesa los ingredientes de una receta o cóctel:

```
GET /api/recetas  (o /api/mixologia)
↓
El servidor consulta:
  SELECT DISTINCT idInsumo FROM Recetas WHERE idElaborado = 'REC0001'
  → lista de idInsumos: ['INS0042', 'INS0103', 'SUB0094', ...]
↓
Para cada idInsumo:
  SELECT idElaborado FROM Subrecetas WHERE idElaborado IN (lista de idInsumos)
  → Si hay coincidencia: ese ingrediente ES una subreceta
  → También carga: SELECT idInsumo, insumo, Cantidad, Unidad FROM Subrecetas WHERE idElaborado = 'SUB0094'
↓
La respuesta incluye por cada ingrediente:
  isSubreceta: true/false
  subIngredientes: [...] (solo si isSubreceta = true)
```

---

### Módulo de Costos

#### Estructura de datos importados

Cada registro en `Costos` representa la **inversión total mensual** de un insumo específico con un proveedor:

```
Año: 2025, Mes: 5 (Mayo)
nombre: "POLLO ENTERO"
descripcion: "POLLO ENTERO FRESCO 1.8KG PROMEDIO"
grupo: "CARNES"
Total_Inversion: 45000.00   ← pesos gastados en el mes
Total_Cantidad: 300.00       ← kilogramos comprados en el mes
Precio unitario calculado: 45000 / 300 = $150.00 / KG
```

#### Proceso de importación

```
1. Usuario sube archivo Excel (.xlsx/.xls)
   ↓
POST /api/costos/importar
   ↓
2. El servidor lee el Excel fila por fila
   ↓
3. Por cada fila:
   a. Normaliza texto (mayúsculas, sin acentos)
   b. Busca el Insumo en el catálogo por descripción
   c. Registra el costo con la referencia al Insumo si hay match
   d. Si no hay match: guarda igual pero sin FK a Insumos
   ↓
4. Devuelve estadísticas:
   { total: 500, conMatch: 430, sinMatch: 70, porcentaje: "86%" }
```

#### Conciliación con el catálogo

```
POST /api/costos/reconciliar
↓
Busca registros en Costos donde Insumo IS NULL
Para cada uno: intenta hacer match con Insumos por descripción/nombre
Actualiza el FK Insumo si encuentra coincidencia
```

---

### Módulo de Costo Platillo

Configuración global de porcentajes aplicada al calcular precios de venta.

#### Tabla Costeoplatillo

```json
{
  "PorcentajeGanancia": 80.0,   ← % de ganancia sobre el costo
  "ServicioMesa":        12.0,  ← % de servicio a mesa
  "ComidaPersonal":       4.0   ← % de consumo del personal
}
```

#### Fórmula completa

```
Costo materia prima    = Σ costos de ingredientes
Precio base sugerido   = Costo × (1 + PorcentajeGanancia / 100)
Precio con servicio    = Precio base × (1 + ServicioMesa / 100)
Precio final           = Precio con servicio × (1 + ComidaPersonal / 100)
```

**Ejemplo:**
```
Costo total ingredientes: $159.00
Ganancia 80%:     $159 × 1.80 = $286.20
Servicio 12%:   $286.20 × 1.12 = $320.54
Personal 4%:    $320.54 × 1.04 = $333.37  ← Precio final sugerido
```

:::caution Dirección de la fórmula
**Mayor % de ganancia = mayor precio de venta.** Si el precio parece bajo, es porque algún ingrediente tiene costo $0.00 (sin presentación seleccionada).
:::

---

### Módulo de Mixología y Coctelería

Gestión de recetas de cócteles. Usa la tabla `MixologiaCocteleria` donde cada fila es un ingrediente.

#### Campos adicionales vs Recetas

- **`CantidadMerma`** (`Cantidad_c/merma`): cantidad incluyendo el factor de merma/desperdicio
- **`IdAlmacen`**: almacén o bodega de origen del ingrediente
- **`elaborado`**: categoría del elaborado (coctel, mocktail, etc.)

---

### Catálogos

#### Insumos

El catálogo maestro. Cada insumo puede tener hasta 26 proveedores asignados (campos `proveedorA` a `proveedorZ`) y además una relación formal en `InsumoHasProveedor`.

**Campos clave para el cálculo de costos:**

| Campo | Uso |
|---|---|
| `idinsumo` | Código que se referencia desde Recetas, Subrecetas, etc. |
| `rendimiento` | Factor divisor para calcular el costo unitario |
| `Presentacion_id_presentacion` | Presentación predeterminada |

**Relaciones:**
- Un insumo pertenece a un `Grupo`, una `Clasificacion` y tiene una `Presentacion` predeterminada
- Un insumo puede tener registros en `Costos` (historial de compras)
- Un insumo puede tener múltiples proveedores via `InsumoHasProveedor`

#### Presentaciones

Cada presentación define **cómo se compra** un insumo:

```
presentacion: "BOLSA 5 KG"
costopresentacion: 650.00   ← precio de catálogo de esa bolsa

Si la receta usa 500 gramos:
  Costo = (650 / 5000) × 500 = $65.00
```

#### Proveedores

Contiene los datos fiscales y de contacto. El campo `autorizacion` indica si el proveedor está activo/autorizado para compras.

```
PATCH /api/proveedores/{id}/autorizacion
→ Activa o desactiva la autorización del proveedor
```

---

## API — Referencia completa

### Autenticación

| Método | Endpoint | Body | Respuesta |
|---|---|---|---|
| `POST` | `/api/auth/login` | `{ usuario, contrasena, captchaToken }` | `{ ok: true }` + cookie session |
| `DELETE` | `/api/auth/login` | — | `{ ok: true }` + elimina cookie |
| `GET` | `/api/auth/privilegios` | — | Mapa de permisos por módulo |

### Recetas y Subrecetas

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/recetas` | Lista de recetas agrupadas |
| `GET` | `/api/recetas/nombre?q=X` | Búsqueda por nombre |
| `GET` | `/api/recetas/insumo-info?idinsumo=X` | Presentaciones + precios de compra |
| `POST` | `/api/recetas` | Crear receta/ingrediente |
| `PUT` | `/api/recetas/{id}` | Modificar |
| `DELETE` | `/api/recetas/{id}` | Eliminar |
| `PUT` | `/api/recetas/ganancia` | Cambiar % ganancia |
| (mismo patrón) | `/api/subrecetas/…` | Mismos endpoints para subrecetas |

### Bebidas y Mixología

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/bebidas` | Lista de bebidas |
| `POST` | `/api/bebidas` | Crear bebida |
| `PUT` | `/api/bebidas/{id}` | Modificar |
| `DELETE` | `/api/bebidas/{id}` | Eliminar |
| `PUT` | `/api/bebidas/ganancia` | Cambiar % ganancia |
| (mismo patrón) | `/api/mixologia/…` | Para mixología |
| `GET` | `/api/mixologia/nombre?q=X` | Búsqueda de cócteles |

### Catálogos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET/POST` | `/api/insumos` | Lista / Crear |
| `GET/PUT/DELETE` | `/api/insumos/{id}` | Por ID |
| `GET` | `/api/insumos/lookup?idinsumo=X` | Buscar por código |
| `POST` | `/api/insumos/importar` | Importar desde Excel |
| (mismo patrón) | `/api/grupos/…` | Grupos |
| (mismo patrón) | `/api/clasificacion/…` | Clasificaciones |
| (mismo patrón) | `/api/presentaciones/…` | Presentaciones |
| `GET/POST` | `/api/proveedores` | Lista / Crear |
| `GET/PUT/DELETE` | `/api/proveedores/{id}` | Por ID |
| `PATCH` | `/api/proveedores/{id}/autorizacion` | Autorizar/desautorizar |
| `GET` | `/api/proveedores/siguiente-id` | Próximo ID disponible |
| `POST` | `/api/proveedores/importar` | Importar desde Excel |

### Costos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET/POST` | `/api/costos` | Lista / Crear |
| `GET/PUT/DELETE` | `/api/costos/{id}` | Por ID |
| `POST` | `/api/costos/importar` | Importar Excel mensual |
| `POST` | `/api/costos/reconciliar` | Conciliar con catálogo de insumos |

### Dashboard e IA

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/dashboard/datos` | Datos personalizados por privilegio |
| `GET` | `/api/dashboard/insumos-stats` | Estadísticas de uso de insumos |
| `POST` | `/api/ia/analizar` | Generar análisis automático con Qwen |
| `GET` | `/api/ia/alertas` | Listar alertas del usuario |
| `PATCH` | `/api/ia/alertas/{id}` | Marcar como leída |
| `DELETE` | `/api/ia/alertas/{id}` | Eliminar alerta |
| `POST` | `/api/ia/chat` | Enviar pregunta → texto + gráfica |
| `GET` | `/api/notificaciones` | Campana: alertas sin leer |

### Administración

| Método | Endpoint | Descripción |
|---|---|---|
| `GET/POST` | `/api/usuarios` | Lista / Crear usuario |
| `GET/PUT/DELETE` | `/api/usuarios/{id}` | Por ID |
| `POST` | `/api/usuarios/{id}/desbloquear` | Desbloquear cuenta |
| `GET/POST` | `/api/roles` | Lista / Crear rol |
| `GET/PUT/DELETE` | `/api/roles/{id}` | Por ID |
| `GET` | `/api/bitacora` | Historial de actividad |
| `GET/PUT` | `/api/costeoplatillo` | Config de porcentajes |
| `GET/PUT` | `/api/perfil` | Datos del usuario actual |
| `POST` | `/api/importar` | Importar recetas completas |
| `POST` | `/api/importar/subrecetas` | Importar subrecetas completas |

---

## Asistente IA — Funcionamiento interno

### Análisis automático de costos

```
Usuario presiona "Generar análisis"
           ↓
POST /api/ia/analizar
           ↓
┌─────────────────────────────────────────────────────────┐
│  Consultas paralelas a la BD (Promise.all):             │
│  ─ Costos mes actual: Total_Inversion, Total_Cantidad   │
│  ─ Costos mes anterior: mismos campos                   │
│  ─ Total recetas y subrecetas                           │
└─────────────────────────────────────────────────────────┘
           ↓
Calcula precio unitario por insumo:
  precio = Total_Inversion / Total_Cantidad
           ↓
Detecta variaciones ≥ 5%:
  variacion% = ((precioActual - precioAnterior) / precioAnterior) × 100
           ↓
Construye prompt en español con:
  - Variaciones detectadas (hasta 20 insumos)
  - Top 10 insumos por inversión
  - Resumen general del sistema
           ↓
POST http://localhost:11434 → Qwen 2.5
  temperature: 0.3 (respuestas consistentes)
           ↓
Extrae JSON del output usando regex /\[[\s\S]*\]/
           ↓
Elimina alertas del día anterior (idUsuario IS NULL)
           ↓
Guarda nuevas alertas en tabla Alertas
           ↓
Devuelve { generadas: N, alertas: [...] }
```

### Chat con gráficas

```
Usuario escribe pregunta → Enter
           ↓
POST /api/ia/chat  { pregunta: "¿Cuáles son los insumos más caros?" }
           ↓
┌─────────────────────────────────────────────────────────┐
│  Consultas paralelas para construir contexto:           │
│  ─ Top 10 insumos por inversión este mes               │
│  ─ Tendencia 12 meses                                  │
│  ─ Recetas por grupo                                   │
│  ─ Insumos por grupo (con nombres de grupo)            │
│  ─ Totales generales                                   │
│  ─ Inversión mes actual vs mes anterior                │
└─────────────────────────────────────────────────────────┘
           ↓
Construye prompt con todos los datos + pregunta
           ↓
POST http://localhost:11434 → Qwen 2.5
  temperature: 0.2 (más determinístico)
           ↓
Extrae JSON usando regex /\{[\s\S]*\}/
Valida que tenga campo "texto" (string)
Valida que "grafica" tenga labels[] y datos[] si no es null
           ↓
Devuelve:
  {
    "texto": "Los 3 insumos con mayor inversión...",
    "grafica": {
      "tipo": "bar",
      "titulo": "Top insumos por inversión",
      "subtitulo": "Mayo 2025",
      "labels": ["POLLO", "RES", "CAMARÓN"],
      "datos": [45000, 32000, 28000]
    }
  }
           ↓
El frontend renderiza el texto y dibuja la gráfica con Chart.js
```

---

## Base de datos — Esquema completo

Motor: **PostgreSQL 14+** · ORM: **Prisma 7** · Archivo: `recetario/prisma/schema.prisma`

### Diagrama entidad-relación

```
┌──────────┐          ┌─────────────┐
│  Roles   │──────────│ Privilegios │  (uno por módulo por rol)
│          │    1:N   │  modulo     │
│ id_rol   │          │  Ver        │
│ NombreRol│          │  Crear      │
└──────────┘          │  Modificar  │
     │                │  Eliminar   │
     │ 1:N            │  Autorizar  │
     ▼                │  Importar   │
┌──────────┐          └─────────────┘
│ Usuarios │
│          │
│ Usuario  │
│ Contrasena (bcrypt)
│ intentosFallidos    ┌───────────────┐
│ bloqueadoHasta      │ Clasificacion │
│ bloqueadoPermanente │    id         │
│ bloqueadoVeces      │    nombre     │
└──────────┘          └───────┬───────┘
                              │ 1:N
┌─────────────┐        ┌──────▼──────────────────────┐
│ Presentacion│──────── │          Insumos            │──────── InsumoHasProveedor ──── Proveedor
│             │   N:1   │                             │   N:M
│ presentacion│         │ idinsumo (clave de búsqueda)│──────── Costos (historial mensual)
│ costopresent│         │ descripcion                 │
└─────────────┘         │ rendimiento                 │
                        │ proveedorA … proveedorZ     │
┌────────┐       N:1    └─────────────────────────────┘
│ Grupo  │──────────────────────────────────────────────┘
└────────┘

┌──────────┐     ┌───────────┐     ┌────────────────────┐     ┌─────────┐
│ Recetas  │     │ Subrecetas│     │ MixologiaCocteleria │     │ Bebidas │
│          │     │           │     │                     │     │         │
│idElaborado←────→idElaborado│     │idProducto           │     │id_Bebidas│
│idInsumo  │     │idInsumo   │     │Idinsumo             │     │idinsumo │
│Cantidad  │     │Cantidad   │     │Cantidad             │     │Rendimiento│
│          │     │           │     │CantidadMerma        │     │         │
└──────────┘     └───────────┘     └────────────────────┘     └─────────┘

┌────────────────┐     ┌──────────┐
│   Alertas (IA) │     │ Bitacora │
│                │     │          │
│ tipo, nivel    │     │ usuario  │
│ titulo, mensaje│     │ accion   │
│ leida          │     │ modulo   │
│ idUsuario      │     │ detalle  │
└────────────────┘     └──────────┘
```

### Tabla `Roles`

```sql
CREATE TABLE "Roles" (
    "id_rol"    SERIAL PRIMARY KEY,
    "NombreRol" VARCHAR(45)
);
```

| Campo | Tipo Prisma | Tipo SQL | Descripción |
|---|---|---|---|
| `id_rol` | `Int` @id @default(autoincrement()) | `SERIAL PRIMARY KEY` | Identificador único |
| `NombreRol` | `String?` @db.VarChar(45) | `VARCHAR(45)` | Nombre del rol |

**Valores especiales** (Super Admin, sin verificación de privilegios):  
`admin` · `administrador` · `sistemas`

---

### Tabla `Usuarios`

```sql
CREATE TABLE "Usuarios" (
    "id_usuarios"         SERIAL PRIMARY KEY,
    "Nombre"              VARCHAR(50),
    "ApellidoPaterno"     VARCHAR(45),
    "ApellidoMaterno"     VARCHAR(45),
    "Usuario"             VARCHAR(45),
    "Contrasena"          VARCHAR(200),   -- hash bcrypt $2b$10$...
    "IdRol"               VARCHAR(45),
    "Roles_id_rol"        INT NOT NULL REFERENCES "Roles"("id_rol"),
    "intentosFallidos"    INT DEFAULT 0,
    "bloqueadoHasta"      TIMESTAMP,
    "bloqueadoPermanente" BOOLEAN DEFAULT FALSE,
    "bloqueadoVeces"      INT DEFAULT 0
);
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id_usuarios` | `Int` PK | Identificador único |
| `Nombre` | `String?` | Nombre(s) |
| `ApellidoPaterno` | `String?` | Apellido paterno |
| `ApellidoMaterno` | `String?` | Apellido materno |
| `Usuario` | `String?` | Username para login |
| `Contrasena` | `String?` VarChar(200) | Hash bcrypt (nunca texto plano) |
| `Roles_id_rol` | `Int` FK | → `Roles.id_rol` |
| `intentosFallidos` | `Int` default 0 | Contador de intentos incorrectos |
| `bloqueadoHasta` | `DateTime?` | Bloqueo temporal expira aquí |
| `bloqueadoPermanente` | `Boolean` default false | Bloqueo permanente (admin) |
| `bloqueadoVeces` | `Int` default 0 | Veces que ha llegado al límite |

---

### Tabla `Privilegios`

```sql
CREATE TABLE "Privilegios" (
    "id_privilegio" SERIAL PRIMARY KEY,
    "modulo"        VARCHAR(50) DEFAULT 'global',
    "Ver"           BOOLEAN DEFAULT FALSE,
    "Crear"         BOOLEAN DEFAULT FALSE,
    "Modifiar"      BOOLEAN DEFAULT FALSE,   -- typo original, conservado
    "Eliminar"      BOOLEAN DEFAULT FALSE,
    "Autorizar"     BOOLEAN DEFAULT FALSE,
    "Importar"      BOOLEAN DEFAULT FALSE,
    "Roles_id_rol"  INT NOT NULL REFERENCES "Roles"("id_rol")
);
```

| Campo | Notas |
|---|---|
| `modulo` | Uno de: `dashboard`, `recetas`, `subrecetas`, `bebidas`, `mixologia`, `insumos`, `proveedores`, `costos`, `costeoplatillo`, `administracion`, `herramientas` |
| `Modifiar` | **Atención:** typo en la BD original (falta la c). El código ya lo contempla correctamente. |

---

### Tabla `Costeoplatillo`

```sql
CREATE TABLE "Costeoplatillo" (
    "idCosteoplatillo"   SERIAL PRIMARY KEY,
    "PorcentajeGanancia" FLOAT,
    "ServicioMesa"       FLOAT,
    "ComidaPersonal"     FLOAT
);
```

En la práctica se usa un **solo registro** que aplica globalmente a todos los cálculos de costo de platillo.

---

### Tabla `Recetas`

```sql
CREATE TABLE "Recetas" (
    "id_Recetas"                       SERIAL PRIMARY KEY,
    "idElaborado"                      VARCHAR(200),  -- identifica la receta
    "NombElaborado"                    VARCHAR(200),  -- nombre de la receta
    "rendimiento"                      FLOAT,
    "Unidad"                           VARCHAR(200),
    "idInsumo"                         VARCHAR(200),  -- código del ingrediente
    "insumo"                           VARCHAR(200),  -- nombre del ingrediente
    "Cantidad"                         FLOAT,
    "Hoja"                             VARCHAR(100),
    "idgrupo"                          VARCHAR(45),
    "grupo"                            VARCHAR(100),
    "Usuarios_id_usuarios"             INT,
    "Usuarios_Roles_id_rol"            INT,
    "Costeoplatillo_idCosteoplatillo"   INT,
    "PorcentajeGanancia"               FLOAT
);
```

| Campo | Descripción |
|---|---|
| `idElaborado` | Código que **agrupa** todas las filas de una misma receta (ej. `"REC0042"`) |
| `NombElaborado` | Nombre de la receta (se repite en cada fila del mismo grupo) |
| `idInsumo` | Si este código existe en `Subrecetas.idElaborado` → es una subreceta |
| `Cantidad` | Cantidad del ingrediente en la unidad especificada |
| `PorcentajeGanancia` | Puede ser distinto por receta (sobrescribe el global de Costeoplatillo) |

---

### Tabla `Subrecetas`

Estructura idéntica a `Recetas`. Las subrecetas tienen su `idElaborado` con prefijo diferente (ej. `SUB0094`). Cuando `Recetas.idInsumo = Subrecetas.idElaborado`, ese ingrediente es una subreceta.

---

### Tabla `Bebidas`

```sql
CREATE TABLE "Bebidas" (
    "id_Bebidas"         SERIAL PRIMARY KEY,
    "Descripcion"        VARCHAR(200),
    "idinsumo"           VARCHAR(45),
    "insumo"             VARCHAR(45),
    "Rendimiento"        FLOAT,      -- copas por botella
    "Unidad"             VARCHAR(45),
    "PorcentajeGanancia" FLOAT
);
```

---

### Tabla `MixologiaCocteleria`

```sql
CREATE TABLE "MixologiaCocteleria" (
    "id_mixologiacocteleria" SERIAL PRIMARY KEY,
    "idProducto"             VARCHAR(45),   -- agrupa ingredientes del mismo cóctel
    "Descripcion"            VARCHAR(200),  -- nombre del cóctel
    "Idinsumo"               VARCHAR(45),
    "Insumo"                 VARCHAR(200),
    "Cantidad"               FLOAT,
    "Cantidad_c/merma"       FLOAT,         -- mapped como CantidadMerma en Prisma
    "Unidad"                 VARCHAR(45),
    "IdAlmacen"              INT,
    "elaborado"              VARCHAR(45),
    "PorcentajeGanancia"     FLOAT
);
```

---

### Tabla `Clasificacion`

```sql
CREATE TABLE "Clasificacion" (
    "id_clasificacion" SERIAL PRIMARY KEY,
    "Idclasificacion"  VARCHAR(45),   -- código (ej. "CLASIF001")
    "Clasificacion"    VARCHAR(100)   -- nombre (ej. "CARNES FRÍAS")
);
```

---

### Tabla `Grupo`

```sql
CREATE TABLE "Grupo" (
    "id_grupo" SERIAL PRIMARY KEY,
    "Idgrupos" VARCHAR(45),   -- código (ej. "GRP01")
    "Grupo"    VARCHAR(45)    -- nombre (ej. "CARNES")
);
```

---

### Tabla `Presentacion`

```sql
CREATE TABLE "Presentacion" (
    "id_presentacion"   SERIAL PRIMARY KEY,
    "idpresentacion"    VARCHAR(45),
    "presentacion"      VARCHAR(600),  -- ej. "BOLSA 5 KG", "BOTELLA 1 LT"
    "costopresentacion" FLOAT          -- precio de CATÁLOGO por esa presentación
);
```

:::info Precio de catálogo vs precio de compras
- **`costopresentacion`**: precio publicado en el catálogo/lista de precios
- **Precio de compras**: calculado dinámicamente desde `Costos` como `SUM(Total_Inversion) / SUM(Total_Cantidad)` — refleja el precio real pagado
:::

---

### Tabla `Insumos`

```sql
CREATE TABLE "Insumos" (
    "id_Insumo"                      SERIAL PRIMARY KEY,
    "idinsumo"                       VARCHAR(20),    -- código (ej. "INS0042")
    "descripcion"                    VARCHAR(500),   -- nombre completo
    "unidad"                         VARCHAR(20),    -- unidad base (KG, LT, PZA)
    "elaborado"                      VARCHAR(45),
    "impuesto"                       FLOAT,
    "inventariable"                  INT,            -- 1=sí, 0=no
    "rendimiento"                    FLOAT,          -- factor para costo unitario
    "Clasificacion_id_clasificacion" INT REFERENCES "Clasificacion"("id_clasificacion"),
    "Grupo_id_grupo"                 INT REFERENCES "Grupo"("id_grupo"),
    "Presentacion_id_presentacion"   INT REFERENCES "Presentacion"("id_presentacion"),
    "Usuarios_id_usuarios"           INT,
    "Usuarios_Roles_id_rol"          INT,
    -- Proveedores A–Z (hasta 26 proveedores simultáneos)
    "proveedorA" INT, "proveedorB" INT, ... "proveedorZ" INT,
    "rfc"           VARCHAR(200),
    "tipoproveedor" VARCHAR(45),
    "telefono"      INT,
    "email"         VARCHAR(55),
    "diascredito"   INT
);
```

| Campo | Descripción |
|---|---|
| `idinsumo` | Código de referencia cruzada con `Recetas.idInsumo`, `Costos.descripcion`, etc. |
| `rendimiento` | Factor divisor. Ej: si rendimiento=1000 y la unidad es GR, el costo por gramo = precio/1000 |
| `proveedorA`…`proveedorZ` | IDs de hasta 26 proveedores (`Proveedor.id_Proveedor`) |

---

### Tabla `Proveedor`

```sql
CREATE TABLE "Proveedor" (
    "id_Proveedor"   SERIAL PRIMARY KEY,
    "idproveedor"    VARCHAR(45),    -- código interno
    "nombre"         VARCHAR(500),   -- nombre comercial
    "razonsocial"    VARCHAR(600),   -- razón social para facturación
    "direccion"      VARCHAR(400),
    "codigopostal"   VARCHAR(45),
    "tipoproveedor"  VARCHAR(45),    -- ej. "NACIONAL", "IMPORTADO"
    "rfc"            VARCHAR(45),
    "telefono"       VARCHAR(45),
    "email"          VARCHAR(45),
    "credito"        VARCHAR(45),    -- ej. "30 días"
    "ProveedorA"     VARCHAR(45),
    "Cuentacontable" VARCHAR(45),
    "autorizacion"   BOOLEAN         -- false = proveedor suspendido
);
```

---

### Tabla `InsumoHasProveedor`

Tabla de unión para la relación muchos-a-muchos formal entre insumos y proveedores.

```sql
CREATE TABLE "InsumoHasProveedor" (
    "id"                                     SERIAL PRIMARY KEY,
    "Insumos_id_Insumo"                      INT NOT NULL REFERENCES "Insumos"("id_Insumo"),
    "Insumos_id_Proveedor"                   INT NOT NULL REFERENCES "Proveedor"("id_Proveedor"),
    "Insumos_Clasificacion_id_clasificacion" INT,
    "Insumos_Grupo_id_grupo"                 INT,
    "Insumos_Presentacion_id_presentacion"   INT,
    "Insumos_Usuarios_id_usuarios"           INT,
    "Insumos_Usuarios_Roles_id_rol"          INT
);
```

---

### Tabla `Costos`

Historial de inversión mensual por insumo. Es la fuente principal del Asistente IA.

```sql
CREATE TABLE "Costos" (
    "idCostos"                               SERIAL PRIMARY KEY,
    "Unidad"                                 VARCHAR(100),
    "Ano"                                    INT,           -- ej. 2025
    "Mes_Num"                                INT,           -- 1=Enero, 12=Diciembre
    "Mes_Nombre"                             VARCHAR(60),   -- ej. "Mayo"
    "grupo"                                  VARCHAR(45),
    "nombre"                                 VARCHAR(500),
    "descripcion"                            VARCHAR(500),  -- clave de match con Insumos
    "Total_Inversion"                        FLOAT,         -- pesos gastados en el mes
    "Total_Cantidad"                         FLOAT,         -- unidades compradas en el mes
    "Proveedor_id_Proveedor"                 INT REFERENCES "Proveedor"("id_Proveedor"),
    "Insumo"                                 INT REFERENCES "Insumos"("id_Insumo"),
    "Insumos_Clasificacion_id_clasificacion" INT,
    "Insumos_Grupo_id_grupo"                 INT,
    "Insumos_Presentacion_id_presentacion"   INT,
    "Insumos_Usuarios_id_usuarios"           INT,
    "Insumos_Usuarios_Roles_id_rol"          INT,
    "idcompra"                               INT,
    "folio"                                  VARCHAR(80),
    "region"                                 VARCHAR(60),
    "marca"                                  VARCHAR(60)
);
```

**Precio unitario real:**
```sql
SELECT descripcion,
       SUM("Total_Inversion") / SUM("Total_Cantidad") AS precio_unitario
FROM "Costos"
WHERE "Ano" = 2025 AND "Mes_Num" = 5
  AND "Total_Inversion" > 0 AND "Total_Cantidad" > 0
GROUP BY descripcion
ORDER BY precio_unitario DESC
LIMIT 10;
```

---

### Tabla `Alertas`

```sql
CREATE TABLE "Alertas" (
    "id"        SERIAL PRIMARY KEY,
    "fecha"     TIMESTAMP DEFAULT NOW(),
    "idUsuario" INT,                  -- NULL = alerta global (todos la ven)
    "tipo"      VARCHAR(50),          -- 'costo' | 'insumo' | 'receta' | 'general'
    "nivel"     VARCHAR(20),          -- 'critical' | 'warning' | 'info'
    "titulo"    VARCHAR(200),
    "mensaje"   TEXT,
    "leida"     BOOLEAN DEFAULT FALSE
);
```

**Query de visibilidad por usuario:**
```sql
SELECT * FROM "Alertas"
WHERE "leida" = FALSE
  AND ("idUsuario" IS NULL OR "idUsuario" = :id_usuario)
ORDER BY "fecha" DESC
LIMIT 5;
```

---

### Tabla `Bitacora`

```sql
CREATE TABLE "Bitacora" (
    "id"        SERIAL PRIMARY KEY,
    "fecha"     TIMESTAMP DEFAULT NOW(),
    "usuario"   VARCHAR(100),   -- nombre del usuario
    "idUsuario" INT,
    "accion"    VARCHAR(100),   -- 'Crear' | 'Modificar' | 'Eliminar' | 'Importar' | 'Login'
    "modulo"    VARCHAR(100),
    "detalle"   VARCHAR(500)    -- descripción específica del cambio
);
```

Se registra automáticamente mediante la función `logAccion()` de `lib/bitacora.ts` en cada operación del sistema.

---

### Comandos Prisma completos

```bash
# Entrar a la carpeta de la app
cd recetario

# ── Desarrollo ────────────────────────────────────────────────────
# Regenerar cliente TypeScript tras cambiar schema.prisma
pnpm exec prisma generate

# Aplicar cambios del schema directamente (sin crear archivos de migración)
pnpm exec prisma db push

# Ver diferencias entre schema.prisma y la BD actual
pnpm exec prisma migrate diff --from-schema-datamodel schema.prisma --to-schema-datasource schema.prisma

# ── Producción ───────────────────────────────────────────────────
# Crear archivo de migración con nombre descriptivo
pnpm exec prisma migrate dev --name agregar_tabla_alertas

# Aplicar migraciones pendientes en producción
pnpm exec prisma migrate deploy

# Ver estado de migraciones
pnpm exec prisma migrate status

# ── Herramientas de exploración ──────────────────────────────────
# Abrir Prisma Studio (explorador visual de BD en navegador)
pnpm exec prisma studio

# Importar schema desde una BD existente (ingeniería inversa)
pnpm exec prisma db pull

# Validar el archivo schema.prisma
pnpm exec prisma validate

# Formatear schema.prisma
pnpm exec prisma format
```

:::caution `db push` vs `migrate deploy`
| Comando | Uso | ¿Guarda historial? | ¿Seguro en producción? |
|---|---|---|---|
| `db push` | Desarrollo | No | ⚠️ Puede perder datos si hay cambios destructivos |
| `migrate dev` | Desarrollo | Sí | No (interactivo) |
| `migrate deploy` | Producción | Sí | ✅ Solo aplica cambios seguros |
:::

---

## Procesador de Recetas — Sistema externo

Sistema Django separado para procesar archivos Excel de recetas en lote.

**Acceso:** Sección **Herramientas** del menú lateral (el administrador debe habilitar el permiso `herramientas` para el rol).

**URL:** Configurada en `.env` como `NEXT_PUBLIC_PROCESADOR_URL`

### Módulos del Procesador

#### Módulo Recetas (`/`)

Extrae ingredientes de archivos Excel y hace matching automático con el catálogo de insumos.

**Archivos requeridos:**

*Archivo de Recetas (Excel)*: una o más hojas con columnas configurables:
- Nombre de la receta
- Código
- Tipo (Principal / Sub-receta)
- Ingredientes y cantidades

*Archivo de Insumos (Excel)*:

| Columna | Descripción |
|---|---|
| `IDInsumo` | Código identificador |
| `Descripcion` | Nombre del insumo |
| `Presentacion` | Formato de presentación |

**Flujo de procesamiento:**

```
1. Configurar hojas y mapear columnas
2. El sistema aplica matching en 4 niveles (orden de prioridad):
   Nivel 1: Coincidencia exacta de descripción
   Nivel 2: Descripción contenida (match parcial)
   Nivel 3: Match por campo presentación
   Nivel 4: Normalización (mayúsculas, sin acentos, espacios limpios)
3. Detecta duplicados por nombre (conserva la primera ocurrencia)
4. Genera estadísticas:
   - Total recetas · Principales · Sub-recetas · Duplicados
   - Con match · Sin match · % de éxito
5. Descarga Excel procesado
```

**Archivo de salida:** `{nombre_sociedad}_recetas_procesadas.xlsx`

| Columna | Descripción |
|---|---|
| Receta | Nombre de la receta |
| Codigo | Código |
| Tipo | `Principal` o `Sub-receta` |
| Ingrediente | Nombre del ingrediente |
| Cantidad | Cantidad requerida |
| Unidad | Unidad de medida |
| IDInsumo | Código del insumo matcheado |
| Insumo | Descripción del insumo matcheado |
| Presentacion | Presentación del insumo |
| Es_Duplicado | `Sí` si es receta duplicada |

**Formato del archivo:** encabezados en azul `#4472C4`, filas sin match en rojo `#FFC7CE`.

**Tipos de descarga:**
- Todas las recetas
- Solo recetas principales
- Solo sub-recetas

#### Módulo Copeo (`/copeo`)

Calcula el rendimiento de botellas en copas.

| Factor | Valor |
|---|---|
| Copa sencilla | ×1 |
| Copa doble | ×1.78 |

#### Módulo Diversos (`/diversos`)

Calcula rendimiento de vinos, refrescos y cervezas:

| Producto | Regla |
|---|---|
| Vino 700–750 ML | 6 copas |
| Vino 375 ML | 3 copas |
| Refresco | Según presentación configurada |
| Cerveza | Según presentación configurada |

---

## Solución de problemas completa

### Errores de instalación

| Error | Causa | Solución |
|---|---|---|
| `ERR_PNPM_NO_SCRIPT: Missing script: dev` | Ejecutando desde carpeta incorrecta | Asegúrate de estar en `HistoricoRecetas/` (raíz), no en `recetario/` |
| `ERR_PNPM_IGNORED_BUILDS` | Scripts no aprobados | Verificar `pnpm-workspace.yaml` con `@prisma/engines: true` y `prisma: true` |
| `Command failed with exit code 1: pnpm install` | Dependencias de build bloqueadas | Ejecutar `pnpm approve-builds` o editar `pnpm-workspace.yaml` manualmente |
| Error de conexión al instalar | Sin acceso a internet o npm registry | Verificar conexión; pnpm usa `https://registry.npmjs.org` |
| `Cannot find module '@prisma/client'` | prisma generate no se ejecutó | `cd recetario && pnpm exec prisma generate` |

### Errores de base de datos

| Error | Causa | Solución |
|---|---|---|
| `Can't reach database server at localhost:5432` | PostgreSQL no está corriendo | Iniciar el servicio PostgreSQL desde Servicios de Windows |
| `password authentication failed` | Contraseña incorrecta en DATABASE_URL | Verificar usuario y contraseña en `.env` |
| `database "recetario" does not exist` | BD no creada | `CREATE DATABASE recetario;` en psql o pgAdmin |
| `prisma:error Invalid DATABASE_URL` | Formato incorrecto | Formato: `postgresql://usuario:contraseña@localhost:5432/nombre_bd` |
| Tablas no encontradas | `prisma db push` no se ejecutó | `cd recetario && pnpm exec prisma db push` |

### Errores en tiempo de ejecución

| Situación | Causa | Solución |
|---|---|---|
| "Sesión expirada" al abrir receta | Inactividad >30 minutos | El sistema redirige automáticamente al login |
| Costos en $0.00 | Sin presentación seleccionada | Clic en ✏️ → seleccionar presentación |
| Costo de subreceta en $0.00 | Sub-ingredientes sin presentación | Ir a **Subrecetas** → seleccionar presentaciones de esa subreceta |
| "Ollama no está corriendo" (503) | Servicio Ollama detenido | Abrir Ollama desde aplicaciones o ejecutar `ollama serve` en terminal |
| "Qwen no generó alertas" | Modelo no descargado | `ollama pull qwen2.5` (4.7 GB) |
| La IA tarda mucho | Primera carga del modelo en RAM | Normal: primera vez puede tardar 60+ segundos |
| El módulo no aparece en el menú | Sin permiso Ver | Pedir al administrador que habilite el permiso para el rol |
| Cuenta bloqueada sin razón | `bloqueadoHasta` en el pasado | El sistema lo desbloquea automáticamente en el próximo login |
| Cuenta bloqueada permanentemente | Llegó al límite 2 veces | Administrador debe ir a Usuarios → desbloquear |
| Error al importar Excel | Archivo abierto en Excel | Cerrar Excel, guardar y volver a intentar |
| Filas rojas en el Procesador | Sin match en catálogo | Agregar el insumo al catálogo o corregir ortografía |

### Diagnóstico del sistema

```bash
# ¿El servidor Next.js está corriendo?
# Abrir: http://localhost:3000

# ¿La base de datos responde?
cd recetario
pnpm exec prisma migrate status
# Si falla, el error indicará el problema exacto

# ¿Ollama está activo?
# Abrir: http://localhost:11434
# Debe mostrar: "Ollama is running"

# ¿Qué modelos IA están descargados?
ollama list

# Regenerar todo desde cero (sin borrar datos)
pnpm exec prisma generate
pnpm exec prisma db push

# Ver logs del servidor en tiempo real
pnpm run dev
# Los errores del servidor aparecen en la terminal con stack trace
```

---

## Rendimiento y límites

| Operación | Volumen óptimo | Límite práctico | Notas |
|---|---|---|---|
| Cargar lista de recetas | hasta 500 grupos | 10,000 grupos | Paginación recomendada arriba de 1,000 |
| Importar costos Excel | hasta 10,000 filas | 50,000 filas | Dividir si es mayor |
| Búsqueda de insumos | cualquier tamaño | sin límite | Indexado por `idinsumo` y `descripcion` |
| Generar análisis IA | cualquiera | sin límite | Limitado por velocidad de Qwen (~30 seg) |
| Chat con IA | cualquiera | 1 query a la vez | Respuesta simultánea no soportada |
| Dashboard gráficas | cualquiera | sin límite | Agrupaciones en BD, no en memoria |

### Estrategias de optimización implementadas

- **`Promise.all`** en todos los endpoints que hacen múltiples consultas independientes
- **`groupBy` con Prisma** en lugar de cargar todos los registros y agrupar en memoria
- **`take: N`** con `orderBy` para paginación en todas las listas
- **Cálculo de costos en el cliente** — no genera requests adicionales al servidor
- **`localStorage`** para persistir selecciones de presentación — no necesita BD
- **Instancia singleton de PrismaClient** — evita abrir múltiples conexiones a PostgreSQL
- **Modo `httpOnly` en JWT** — sin acceso desde JavaScript del navegador

---

## Dependencias del proyecto

### Dependencias de producción (`recetario/package.json`)

| Paquete | Versión | Propósito |
|---|---|---|
| `next` | 16.1.6 | Framework web principal (App Router, API Routes, SSR) |
| `react` + `react-dom` | 19.2.3 | UI reactiva |
| `@prisma/client` | 7.4.2 | Cliente TypeScript para PostgreSQL |
| `@prisma/adapter-pg` | 7.4.2 | Adaptador nativo de PostgreSQL para Prisma |
| `pg` | 8.20.0 | Driver de PostgreSQL para Node.js |
| `jose` | 6.2.0 | Generación y verificación de tokens JWT |
| `bcryptjs` | 3.0.3 | Hash de contraseñas con bcrypt |
| `ollama` | 0.6.3 | Cliente HTTP para el servidor Ollama local |
| `chart.js` | 4.5.1 | Motor de gráficas (canvas) |
| `react-chartjs-2` | 5.3.1 | Componentes React para Chart.js |
| `sweetalert2` | 11.26.24 | Diálogos modales con confirmación/error |
| `lucide-react` | 0.577.0 | Biblioteca de íconos SVG |
| `xlsx` | 0.18.5 | Lectura y escritura de archivos Excel |
| `jspdf` | 4.2.1 | Generación de documentos PDF |
| `jspdf-autotable` | 5.0.7 | Tablas automáticas en PDF |
| `react-google-recaptcha` | 3.1.0 | Componente de reCAPTCHA v2 |
| `tailwind-merge` | 3.5.0 | Merging de clases Tailwind sin conflictos |
| `clsx` | 2.1.1 | Constructor condicional de clases CSS |
| `radix-ui` | 1.4.3 | Componentes UI sin estilos (accesibles) |
| `class-variance-authority` | 0.7.1 | Variantes tipadas de clases CSS |

### Dependencias de desarrollo

| Paquete | Versión | Propósito |
|---|---|---|
| `prisma` | 7.4.2 | CLI de Prisma (generate, migrate, studio) |
| `typescript` | 5.x | Tipado estático |
| `tailwindcss` | 4.x | Framework CSS utility-first |
| `@tailwindcss/postcss` | 4.x | Plugin PostCSS para Tailwind |
| `eslint` + `eslint-config-next` | 9.x | Linting de código |
| `tw-animate-css` | 1.4.0 | Animaciones CSS para Tailwind |
| `shadcn` | 3.8.5 | CLI de componentes de UI |
