---
sidebar_position: 3
title: Base de Datos
---

# Base de Datos

La base de datos es **PostgreSQL** y se accede exclusivamente a través de **Prisma ORM**, lo que elimina el riesgo de inyección SQL ya que todas las queries son parametrizadas automáticamente. La base se compone de **17 tablas**.

---

## Diagrama de Relaciones

```
Roles ──< Usuarios          (un rol tiene muchos usuarios)
Roles ──< Privilegios        (un rol tiene permisos por módulo)

Clasificacion ─────────────────────────────────────────┐
Grupo ──────────────────────────────────────────────────┤
Presentacion ───────────────────────────────────────────┤──► Insumos ──► InsumoHasProveedor ──► Proveedor
                                                        │                                          │
                                                        └──► Costos ◄──────────────────────────────┘

Recetas            (una fila por ingrediente, agrupadas por idElaborado)
Subrecetas         (misma estructura que Recetas)
Bebidas            (tabla plana independiente)
MixologiaCocteleria (una fila por ingrediente, agrupadas por idProducto)
Costeoplatillo     (configuración global de % ganancia)

Alertas            (generadas por el Asistente IA)
Bitacora           (registro inmutable de acciones)
```

---

## Tablas de acceso y seguridad

### Tabla: Roles

**Función:** Define los perfiles de acceso. Los roles `admin`, `administrador` y `sistemas` tienen acceso total sin verificar privilegios. Todos los demás roles se rigen por la tabla `Privilegios`.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_rol` | INT PK autoincrement | Identificador único |
| `NombreRol` | VARCHAR(45) | Nombre del rol. Ej: `admin`, `gerente de compras`, `capturista` |

---

### Tabla: Usuarios

**Función:** Almacena las cuentas de acceso. Implementa bloqueo automático por intentos fallidos: tras 3 fallos consecutivos activa bloqueo temporal de 30 minutos; si ocurre por segunda vez, el bloqueo es permanente hasta que el administrador lo libere manualmente.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_usuarios` | INT PK autoincrement | Identificador único |
| `Nombre` | VARCHAR(50) | Nombre de pila |
| `ApellidoPaterno` | VARCHAR(45) | Apellido paterno |
| `ApellidoMaterno` | VARCHAR(45) | Apellido materno |
| `Usuario` | VARCHAR(45) | Nombre de usuario para login |
| `Contrasena` | VARCHAR(200) | Hash bcrypt — **nunca texto plano** |
| `IdRol` | VARCHAR(45) | Referencia textual al nombre del rol |
| `Roles_id_rol` | INT FK → `Roles` | Vínculo con la tabla de roles |
| `intentosFallidos` | INT default 0 | Contador de intentos incorrectos; se reinicia al login exitoso |
| `bloqueadoHasta` | DATETIME? | Bloqueo temporal: indica hasta cuándo. `null` = no bloqueado |
| `bloqueadoPermanente` | BOOLEAN default false | `true` = requiere desbloqueo manual por el administrador |
| `bloqueadoVeces` | INT default 0 | Historial acumulado de bloqueos de la cuenta |

---

### Tabla: Privilegios

**Función:** Controla qué puede hacer cada rol en cada módulo. El menú lateral lee esta tabla para mostrar solo los módulos con `Ver = true`. Los botones de acción (Crear, Editar, Eliminar, Importar) se habilitan o deshabilitan según los permisos activos. Los cambios aplican inmediatamente a todos los usuarios del rol.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_privilegio` | INT PK autoincrement | Identificador único |
| `modulo` | VARCHAR(50) default `'global'` | Módulo al que aplica. Ej: `recetas`, `costos`, `administracion` |
| `Ver` | BOOLEAN default false | El módulo aparece en el menú y puede consultarse |
| `Crear` | BOOLEAN default false | Puede agregar nuevos registros |
| `Modifiar` | BOOLEAN default false | Puede editar registros *(typo original en la BD — falta la `c`)* |
| `Eliminar` | BOOLEAN default false | Puede borrar registros |
| `Autorizar` | BOOLEAN default false | Puede realizar acciones especiales del módulo |
| `Importar` | BOOLEAN default false | Puede subir archivos Excel para carga masiva |
| `Roles_id_rol` | INT FK → `Roles` | Rol al que pertenece este conjunto de permisos |

**Módulos válidos:** `dashboard` · `recetas` · `subrecetas` · `bebidas` · `mixologia` · `insumos` · `proveedores` · `costos` · `costeoplatillo` · `administracion` · `herramientas`

:::caution Typo en el schema
El campo `Modifiar` está escrito así en la BD original (le falta la `c`). Al hacer queries o usarlo en código debe escribirse exactamente `Modifiar`.
:::

---

## Tablas de recetas y producción

### Tabla: Recetas

**Función:** Almacena el detalle de ingredientes de todas las recetas. **Una receta con N ingredientes genera N filas**, todas compartiendo el mismo `idElaborado`. El sistema agrupa las filas por `idElaborado` para mostrar la receta como unidad con su lista de ingredientes.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_Recetas` | INT PK autoincrement | Identificador único de la fila |
| `idElaborado` | VARCHAR(200) | Código que agrupa todas las filas de la misma receta. Ej: `"REC0042"` |
| `NombElaborado` | VARCHAR(200) | Nombre de la receta (se repite en cada fila del mismo grupo) |
| `rendimiento` | FLOAT | Cuántas porciones produce la receta completa |
| `Unidad` | VARCHAR(200) | Unidad del rendimiento (PORCION, KG, LT, etc.) |
| `idInsumo` | VARCHAR(200) | Código del ingrediente. Si coincide con `Subrecetas.idElaborado` → es una subreceta |
| `insumo` | VARCHAR(200) | Nombre del ingrediente |
| `Cantidad` | FLOAT | Cantidad requerida en esta fila |
| `Hoja` | VARCHAR(100) | Hoja del Excel de origen |
| `idgrupo` | VARCHAR(45) | Código del grupo al que pertenece la receta |
| `grupo` | VARCHAR(100) | Nombre del grupo/categoría. Ej: `"CARNES"`, `"POSTRES"` |
| `Usuarios_id_usuarios` | INT? | Usuario que la registró |
| `Usuarios_Roles_id_rol` | INT? | Rol del usuario |
| `Costeoplatillo_idCosteoplatillo` | INT? | Configuración de costeo asociada |
| `PorcentajeGanancia` | FLOAT? | % de ganancia de esta receta (sobrescribe el global) |

---

### Tabla: Subrecetas

**Función:** Almacena preparaciones base (fondos, salsas, masas) que se usan como ingrediente dentro de las recetas principales. Estructura idéntica a `Recetas`. Cuando `Recetas.idInsumo` coincide con `Subrecetas.idElaborado`, ese ingrediente es una subreceta y el sistema calcula su costo sumando sus propios sub-ingredientes.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_Recetas` | INT PK autoincrement | Identificador único de la fila |
| `idElaborado` | VARCHAR(200) | Código de la subreceta |
| `NombElaborado` | VARCHAR(200) | Nombre de la subreceta |
| `rendimiento` | FLOAT | Cantidad que produce |
| `Unidad` | VARCHAR(200) | Unidad del rendimiento |
| `idInsumo` | VARCHAR(200) | Código del insumo componente |
| `insumo` | VARCHAR(200) | Nombre del insumo |
| `Cantidad` | FLOAT | Cantidad requerida |
| `Hoja` | VARCHAR(100) | Hoja de origen del Excel |
| `idgrupo` | VARCHAR(45) | Código del grupo |
| `grupo` | VARCHAR(100) | Nombre del grupo |
| `PorcentajeGanancia` | FLOAT? | % de ganancia de la subreceta |

---

### Tabla: Bebidas

**Función:** Catálogo de bebidas preparadas (jugos, aguas, licuados). Cada registro representa una bebida con su insumo principal y rendimiento esperado.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_Bebidas` | INT PK autoincrement | Identificador único |
| `Descripcion` | VARCHAR(200) | Nombre de la bebida |
| `idinsumo` | VARCHAR(45) | Código del insumo principal |
| `insumo` | VARCHAR(45) | Nombre del insumo principal |
| `Rendimiento` | FLOAT | Cuántas porciones o unidades se obtienen |
| `Unidad` | VARCHAR(45) | Unidad del rendimiento |
| `PorcentajeGanancia` | FLOAT? | % de ganancia sugerido |

---

### Tabla: MixologiaCocteleria

**Función:** Almacena las recetas de cócteles. Al igual que `Recetas`, **una fila por ingrediente por cóctel**. Incluye campo de merma para ajustar la cantidad real consumida durante la preparación.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_mixologiacocteleria` | INT PK autoincrement | Identificador único de la fila |
| `idProducto` | VARCHAR(45) | Código del cóctel — todas las filas del mismo cóctel lo comparten |
| `Descripcion` | VARCHAR(200) | Nombre del cóctel. Ej: `"MARGARITA CLÁSICA"` |
| `Idinsumo` | VARCHAR(45) | Código del ingrediente en esta fila |
| `Insumo` | VARCHAR(200) | Nombre del ingrediente |
| `Cantidad` | FLOAT | Cantidad teórica del ingrediente |
| `CantidadMerma` | FLOAT? | Cantidad ajustada incluyendo merma (`Cantidad_c/merma` en la BD) |
| `Unidad` | VARCHAR(45) | Unidad de medida |
| `IdAlmacen` | INT? | Almacén del que proviene el insumo |
| `elaborado` | VARCHAR(45) | Indica si el ingrediente es un elaborado interno |
| `PorcentajeGanancia` | FLOAT? | % de ganancia del cóctel |

---

### Tabla: Costeoplatillo

**Función:** Configuración global para el módulo de Costo Platillo. Guarda los porcentajes que se aplican al calcular el precio de venta sugerido. En la práctica tiene **un solo registro activo**.

| Campo | Tipo | Descripción |
|---|---|---|
| `idCosteoplatillo` | INT PK autoincrement | Identificador |
| `PorcentajeGanancia` | FLOAT? | % de ganancia sobre el costo de ingredientes |
| `ServicioMesa` | FLOAT? | % adicional para cubrir el costo del servicio a mesa |
| `ComidaPersonal` | FLOAT? | % adicional para cubrir el consumo del personal |

**Fórmula de aplicación:**
```
Precio base    = Costo × (1 + PorcentajeGanancia / 100)
Con servicio   = Precio base × (1 + ServicioMesa / 100)
Precio final   = Con servicio × (1 + ComidaPersonal / 100)
```

---

## Catálogos de insumos

### Tabla: Clasificacion

**Función:** Primer nivel de categorización de los insumos. Agrupa insumos por naturaleza o uso general. Se usa en filtros y gráficas del dashboard.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_clasificacion` | INT PK autoincrement | Identificador único |
| `Idclasificacion` | VARCHAR(45) | Código alfanumérico. Ej: `"CLASIF001"` |
| `Clasificacion` | VARCHAR(100) | Nombre. Ej: `"CARNES FRÍAS"`, `"ABARROTES"` |

---

### Tabla: Grupo

**Función:** Segundo nivel de categorización, más específico que la clasificación. Permite segmentar los insumos dentro de una categoría. Se usa en el dashboard para mostrar la distribución del catálogo.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_grupo` | INT PK autoincrement | Identificador único |
| `Idgrupos` | VARCHAR(45) | Código. Ej: `"GRP01"` |
| `Grupo` | VARCHAR(45) | Nombre. Ej: `"LÁCTEOS"`, `"VERDURAS"`, `"CARNES"` |

---

### Tabla: Presentacion

**Función:** Catálogo de presentaciones comerciales de los insumos (ej. "1 KG", "750 ML", "CAJA 12 PZA"). **El campo `costopresentacion` es la base para calcular el costo de los ingredientes en recetas.** El usuario selecciona la presentación activa para cada insumo al revisar una receta.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_presentacion` | INT PK autoincrement | Identificador único |
| `idpresentacion` | VARCHAR(45) | Código de la presentación |
| `presentacion` | VARCHAR(600) | Descripción. Ej: `"BOLSA 5 KG"`, `"BOTELLA 750 ML"` |
| `costopresentacion` | FLOAT? | **Precio de catálogo** por esa presentación. Base del cálculo de costos |

:::info Precio catálogo vs precio compras
- **`costopresentacion`**: precio publicado en la lista de precios del catálogo
- **Precio de compras**: calculado dinámicamente desde `Costos` como `SUM(Total_Inversion) / SUM(Total_Cantidad)` — refleja el precio real pagado el último mes
:::

---

### Tabla: Insumos

**Función:** Catálogo maestro de todos los insumos del sistema. Es la tabla central que referencian `Recetas`, `Subrecetas`, `Bebidas`, `MixologiaCocteleria` y `Costos`. Cada insumo puede tener hasta 26 proveedores (campos `proveedorA`–`proveedorZ`) y además una relación formal en `InsumoHasProveedor`.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_Insumo` | INT PK autoincrement | Identificador único |
| `idinsumo` | VARCHAR(20) | **Código de referencia cruzada** con las demás tablas. Ej: `"INS0042"` |
| `descripcion` | VARCHAR(500) | Nombre completo del insumo. Ej: `"PECHUGA DE POLLO SIN HUESO"` |
| `unidad` | VARCHAR(20) | Unidad base de medida (KG, LT, PZA) |
| `elaborado` | VARCHAR(45) | Indica si es un producto elaborado internamente |
| `impuesto` | FLOAT? | Porcentaje de impuesto aplicable |
| `inventariable` | INT? | `1` = se controla en inventario, `0` = no |
| `rendimiento` | FLOAT? | Factor divisor para calcular el costo unitario. Ej: si `rendimiento=1000` y unidad=GR, costo por gramo = precio/1000 |
| `Clasificacion_id_clasificacion` | INT? FK → `Clasificacion` | Clasificación asignada |
| `Grupo_id_grupo` | INT? FK → `Grupo` | Grupo asignado |
| `Presentacion_id_presentacion` | INT? FK → `Presentacion` | Presentación por defecto |
| `Usuarios_id_usuarios` | INT? | Usuario que lo registró |
| `Usuarios_Roles_id_rol` | INT? | Rol del usuario |
| `proveedorA` … `proveedorZ` | INT? | IDs de hasta 26 proveedores asociados al insumo |
| `rfc` | VARCHAR(200) | RFC del proveedor principal |
| `tipoproveedor` | VARCHAR(45) | Tipo o categoría del proveedor |
| `telefono` | INT? | Teléfono de contacto |
| `email` | VARCHAR(55) | Correo electrónico |
| `diascredito` | INT? | Días de crédito otorgados |

---

## Proveedores

### Tabla: Proveedor

**Función:** Catálogo de todos los proveedores del sistema con datos fiscales y de contacto. El campo `autorizacion` indica si el proveedor está activo para compras. Se referencia en `Costos` para saber qué proveedor abasteció cada compra.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_Proveedor` | INT PK autoincrement | Identificador único |
| `idproveedor` | VARCHAR(45) | Código interno del proveedor |
| `nombre` | VARCHAR(500) | Nombre comercial |
| `razonsocial` | VARCHAR(600) | Razón social para facturación |
| `direccion` | VARCHAR(400) | Dirección física |
| `codigopostal` | VARCHAR(45) | Código postal |
| `tipoproveedor` | VARCHAR(45) | Categoría. Ej: `"NACIONAL"`, `"IMPORTADO"` |
| `rfc` | VARCHAR(45) | RFC para efectos fiscales |
| `telefono` | VARCHAR(45) | Teléfono de contacto |
| `email` | VARCHAR(45) | Correo electrónico |
| `credito` | VARCHAR(45) | Condiciones de crédito. Ej: `"30 días"` |
| `ProveedorA` | VARCHAR(45) | Campo auxiliar adicional |
| `Cuentacontable` | VARCHAR(45) | Cuenta contable para integración con contabilidad |
| `autorizacion` | BOOLEAN? | `false` = proveedor suspendido, no aparece en compras |

---

### Tabla: InsumoHasProveedor

**Función:** Tabla de unión muchos-a-muchos entre insumos y proveedores. Establece la relación formal de qué proveedores pueden abastecer cada insumo. Complementa los campos `proveedorA`–`proveedorZ` de la tabla `Insumos`.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK autoincrement | Identificador único de la relación |
| `Insumos_id_Insumo` | INT FK → `Insumos` | Insumo relacionado |
| `Insumos_id_Proveedor` | INT FK → `Proveedor` | Proveedor relacionado |
| `Insumos_Clasificacion_id_clasificacion` | INT? | Clasificación del insumo al momento de la relación |
| `Insumos_Grupo_id_grupo` | INT? | Grupo del insumo al momento de la relación |
| `Insumos_Presentacion_id_presentacion` | INT? | Presentación al momento de la relación |
| `Insumos_Usuarios_id_usuarios` | INT? | Usuario que creó la relación |
| `Insumos_Usuarios_Roles_id_rol` | INT? | Rol del usuario |

---

## Costos

### Tabla: Costos

**Función:** Historial mensual de compras importado desde Excel. Cada registro representa la inversión total de **un insumo en un mes específico**. El sistema calcula el precio unitario (`Total_Inversion ÷ Total_Cantidad`) y lo usa para detectar variaciones entre meses, alimentar el dashboard y generar análisis con el Asistente IA.

| Campo | Tipo | Descripción |
|---|---|---|
| `idCostos` | INT PK autoincrement | Identificador único |
| `Unidad` | VARCHAR(100) | Unidad de medida |
| `Ano` | INT? | Año del registro. Ej: `2025` |
| `Mes_Num` | INT? | Número del mes (1=Enero … 12=Diciembre) |
| `Mes_Nombre` | VARCHAR(60) | Nombre del mes. Ej: `"Mayo"` |
| `grupo` | VARCHAR(45) | Grupo del insumo |
| `nombre` | VARCHAR(500) | Nombre corto del insumo |
| `descripcion` | VARCHAR(500) | Descripción completa — clave de match con el catálogo de Insumos |
| `Total_Inversion` | FLOAT? | **Monto total** invertido en este insumo durante el mes |
| `Total_Cantidad` | FLOAT? | **Cantidad total** comprada durante el mes |
| `Proveedor_id_Proveedor` | INT? FK → `Proveedor` | Proveedor que abasteció |
| `Insumo` | INT? FK → `Insumos` | Insumo del catálogo al que corresponde |
| `Insumos_Clasificacion_id_clasificacion` | INT? | Clasificación al momento del registro |
| `Insumos_Grupo_id_grupo` | INT? | Grupo al momento del registro |
| `Insumos_Presentacion_id_presentacion` | INT? | Presentación al momento del registro |
| `Insumos_Usuarios_id_usuarios` | INT? | Usuario que realizó la importación |
| `Insumos_Usuarios_Roles_id_rol` | INT? | Rol del usuario |
| `idcompra` | INT? | ID de la orden de compra de origen |
| `folio` | VARCHAR(80) | Folio del documento de compra (factura, remisión) |
| `region` | VARCHAR(60) | Región geográfica del proveedor o de la compra |
| `marca` | VARCHAR(60) | Marca comercial del producto comprado |

**Precio unitario real:**
```
Precio unitario = Total_Inversion ÷ Total_Cantidad
```

**Análisis de variación mes a mes (usado por el Asistente IA):**
```
Variación % = ((Precio actual - Precio anterior) ÷ Precio anterior) × 100
```

| Variación | Nivel | Alerta generada |
|---|---|---|
| > +20% | 🔴 Crítico | Alerta roja |
| +10% a +20% | 🟡 Advertencia | Alerta ámbar |
| +5% a +10% | 🔵 Información | Alerta azul |
| < 5% | Sin alerta | — |

---

## Alertas y bitácora

### Tabla: Alertas

**Función:** Almacena las alertas generadas automáticamente por el Asistente IA al analizar variaciones de costos. La campana 🔔 de la barra superior consulta esta tabla para mostrar alertas con `leida = false`. El sistema elimina las alertas del día anterior antes de insertar nuevas (evita duplicados).

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK autoincrement | Identificador único |
| `fecha` | DATETIME default `now()` | Fecha y hora de creación (automática) |
| `idUsuario` | INT? | `null` = alerta global (todos la ven) |
| `tipo` | VARCHAR(50) | Categoría. Ej: `"variacion_precio"`, `"tendencia"` |
| `nivel` | VARCHAR(20) | Severidad: `critical` · `warning` · `info` |
| `titulo` | VARCHAR(200) | Título breve y descriptivo |
| `mensaje` | TEXT | Análisis completo generado por Qwen 2.5 con datos numéricos |
| `leida` | BOOLEAN default false | `false` = aparece en la campana. `true` = ya revisada |

---

### Tabla: Bitacora

**Función:** Registro inmutable de todas las acciones del sistema. Se escribe automáticamente en cada operación (crear, editar, eliminar, importar, login). **Nunca se borra ni modifica** — garantiza la trazabilidad completa de quién hizo qué y cuándo.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK autoincrement | Identificador único |
| `fecha` | DATETIME default `now()` | Timestamp exacto de la acción |
| `usuario` | VARCHAR(100) | Nombre del usuario que realizó la acción |
| `idUsuario` | INT? | ID del usuario para trazabilidad |
| `accion` | VARCHAR(100) | Tipo: `Crear` · `Modificar` · `Eliminar` · `Importar` · `Login` |
| `modulo` | VARCHAR(100) | Módulo del sistema donde ocurrió |
| `detalle` | VARCHAR(500) | Descripción específica. Ej: `"Se modificó la receta FILETE AL VINO"` |

---

## Comandos Prisma de referencia

```bash
# Entrar a la carpeta de la app
cd recetario

# Regenerar el cliente TypeScript tras cambiar schema.prisma
pnpm exec prisma generate

# Aplicar cambios a la BD (desarrollo — sin historial de migraciones)
pnpm exec prisma db push

# Crear migración con nombre descriptivo (desarrollo)
pnpm exec prisma migrate dev --name descripcion_del_cambio

# Aplicar migraciones en producción
pnpm exec prisma migrate deploy

# Ver estado de migraciones
pnpm exec prisma migrate status

# Explorador visual de la BD en el navegador
pnpm exec prisma studio
```
