---
sidebar_position: 16
title: Asistente IA
---

# Módulo 16 — Asistente IA

## ¿Qué hace?

Módulo de análisis automático de costos y chat interactivo con gráficas. Usa **Qwen 2.5** corriendo localmente vía **Ollama** — ningún dato sale a servidores externos, todo el procesamiento ocurre en la máquina local.

## Requisito previo

Ollama debe estar instalado y el modelo descargado:

```bash
ollama pull qwen2.5   # Descarga ~4.7 GB, solo una vez
```

Verificar que Ollama está activo: abrir **http://localhost:11434** — debe mostrar `Ollama is running`.

---

## Análisis automático de costos

Al presionar **Generar análisis**, el sistema:

```
1. Consulta costos del mes actual y del mes anterior (Promise.all)
   ↓
2. Calcula precio unitario por insumo:
   precio = Total_Inversion / Total_Cantidad
   ↓
3. Detecta variaciones ≥ 5%:
   variacion% = ((actual - anterior) / anterior) × 100
   ↓
4. Construye prompt en español con:
   - Variaciones detectadas (hasta 20 insumos)
   - Top 10 insumos por inversión del mes
   - Resumen general del sistema
   ↓
5. Envía a Qwen 2.5 vía Ollama (localhost:11434)
   temperature: 0.3 (respuestas consistentes)
   ↓
6. Elimina alertas del día anterior (evita duplicados)
   ↓
7. Guarda nuevas alertas en tabla Alertas
```

### Niveles de alerta

| Nivel | Condición | Color |
|---|---|---|
| 🔴 **Crítico** | Variación >20% o impacto directo en precios de venta | Rojo |
| 🟡 **Advertencia** | Variación 10–20% o tendencias preocupantes | Ámbar |
| 🔵 **Información** | Variación 5–10% o datos relevantes | Azul |

---

## Chat con gráficas

El chat envía a Qwen el siguiente contexto con cada pregunta:

| Dato enviado | Descripción |
|---|---|
| Total recetas / insumos | Conteos actuales del sistema |
| Inversión mes actual | Total en pesos |
| Inversión mes anterior | Total y variación % |
| Top 10 insumos | Los de mayor inversión este mes |
| Recetas por grupo | Conteo por categoría |
| Insumos por grupo | Conteo por grupo del catálogo |
| Tendencia 12 meses | Inversión mensual histórica |

### Formato de respuesta

La IA devuelve un JSON con texto y gráfica opcional:

```json
{
  "texto": "Los 3 insumos con mayor inversión este mes son...",
  "grafica": {
    "tipo": "bar",
    "titulo": "Top insumos por inversión",
    "subtitulo": "Mayo 2025",
    "labels": ["POLLO", "RES", "CAMARÓN"],
    "datos": [45000, 32000, 28000]
  }
}
```

Si la pregunta no tiene datos visualizables: `"grafica": null`

### Tipos de gráfica

| Tipo | Cuándo se genera |
|---|---|
| `bar` | Rankings, comparativas (barras horizontales) |
| `line` | Tendencias temporales (línea con área) |
| `pie` | Proporciones y distribuciones (pastel) |

---

## Campana de notificaciones 🔔

La campana en la barra superior muestra alertas sin leer (`leida = false`). Al marcarlas como leídas desaparecen del contador.

**Visible para los roles:** `admin`, `administrador`, `sistemas`, `direccion de compras`, `dirección de compras`, `dir compras`, `gerente de compras`

---

## Tiempos de respuesta

| Operación | Tiempo estimado |
|---|---|
| Generar análisis automático | 15–45 segundos |
| Respuesta del chat | 15–30 segundos |
| Primera carga del modelo en RAM | Hasta 60 segundos |

---

## Solución de problemas

| Problema | Causa | Solución |
|---|---|---|
| Error 503 al generar análisis | Ollama detenido | Abrir Ollama o ejecutar `ollama serve` |
| "No generó alertas" | Modelo no descargado | `ollama pull qwen2.5` |
| Respuesta muy lenta | Primera carga en RAM | Esperar — las siguientes son más rápidas |

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/ia/analizar` | Generar análisis automático |
| `GET` | `/api/ia/alertas` | Listar alertas |
| `PATCH` | `/api/ia/alertas/{id}` | Marcar como leída |
| `DELETE` | `/api/ia/alertas/{id}` | Eliminar alerta |
| `POST` | `/api/ia/chat` | Enviar pregunta → texto + gráfica |
| `GET` | `/api/notificaciones` | Alertas sin leer (campana) |
