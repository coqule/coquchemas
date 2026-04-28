# Scrapers - CoquChemas

Documentación de los scripts de scraping disponibles en el proyecto.

---

## 1. scrape.js

**Propósito:** Extraer productos de New Arrivals ordenado por fecha (más recientes primero).

**Características:**
- Extrae productos de la página de New Arrivals
- Ordenado por fecha de ingreso (más reciente primero)
- Modos: preview, incremental, full
- Detección automática de productos duplicados

**Comandos:**
```bash
npm run scrape:preview     # 2 páginas (preview)
npm run scrape:new        # 10 páginas, solo nuevos
npm run scrape:full       # 300 páginas (~14,500 productos)
```

**Output:** `scraper/products.json`

**URLs:**
- Preview: `https://www.gakits.com/New-Arrivals-c68135/list---7-2-----r1.html`

---

## 2. scrape-all.js

**Propósito:** Extraer productos de múltiples categorías simultáneamente.

**Características:**
- Escanea todas las categorías principales
- Evita duplicados entre categorías
- **NO se ejecuta automáticamente** (solo manual)

**Comandos:**
```bash
npm run scrape:all        # Full scrape de todas las categorías
npm run scrape:all:new    # Solo productos nuevos
```

**Categorías incluidas:**
- New Arrivals (300 páginas)
- National Teams (50 páginas)
- Spain - La Liga (50 páginas)
- Premier League (50 páginas)
- France - Ligue 1 (50 páginas)
- Bundesliga (50 páginas)
- Italy - Serie A (50 páginas)
- Brazil (50 páginas)
- Mexico / MLS (50 páginas)
- Retro Jersey (50 páginas)
- Player Version (30 páginas)
- F1 / Rugby / NFL (30 páginas)
- Training Tracksuit (30 páginas)

---

## 4. pre-scraper.js

**Propósito:** Mostrar resumen antes de ejecutar el scraper.

**Características:**
- Muestra total de productos en New Arrivals
- Muestra cantidad de productos existentes en products.json
- Calcula productos nuevos (total - existentes)
- **NO se ejecuta automáticamente** (solo manual)

**Comandos:**
```bash
npm run pre-scrape
```

**Resultado típico:**
```
┌──────────────────────────────────────────────────────────────┐
│ PRODUCTOS EN NEW ARRIVAL (gakits.com)                    │
├──────────────────────────────────────────────────────────────┤
│ Total New Arrivals             14584 productos │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ PRODUCTOS ACTUALES (products.json)                          │
├──────────────────────────────────────────────────────────────┤
│ Productos guardados              400       │
│ Último agregado           2026/27 Man City Awa │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ RESUMEN DE SCRAPER                                          │
├──────────────────────────────────────────────────────────────┤
│ Productos nuevos               14184       │
│ Productos existentes             400       │
│ Total después scrape           14584       │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. products-by-category.js

**Propósito:** Contar cantidad de productos por categoría.

**Características:**
- Escanea todas las categorías principales
- Muestra el total de productos en cada una
- Útil para saber el tamaño del catálogo

**Comandos:**
```bash
npm run count
```

**Resultado típico:**
```
New Arrivals: 14584
National Teams: 4853
Spain - La Liga: 3286
...
=== TOTAL PRODUCTS: 43894 ===
```

---

## 6. category-structure.js

**Propósito:** Obtener estructura de categorías (padre-hijo).

**Características:**
- Extrae las 14 categorías principales
- Muestra subcategorías de cada una
- Útil para construir el menú de navegación

**Comandos:**
```bash
npm run categories
```

**Output:** `scraper/categories.json`

---

## Resumen de Comandos

| Comando | Descripción | Scheduled |
|---------|-------------|-----------|
| `npm run scrape:preview` | Preview (2 páginas) | No |
| `npm run scrape:new` | Solo productos nuevos | No |
| `npm run scrape:full` | Full New Arrivals (~14,500) | **Sí (diario)** |
| `npm run scrape:all` | Todas las categorías | No (manual) |
| `npm run scrape:all:new` | Solo nuevos (todas) | No |
| `npm run pre-scrape` | Resumen antes de scrape | No (manual) |
| `npm run count` | Contar por categoría | No |
| `npm run categories` | Estructura categorías | No |

---

## GitHub Actions

El workflow `.github/workflows/scrape.yml` ejecuta diariamente:
- **Comando:** `npm run scrape` (scrape.js)
- **Hora:** 00:00 UTC
- **Objetivo:** New Arrivals ordenados por fecha

**Nota:** `scrape-all.js` NO está programado, ejecutar solo manualmente si es necesario actualizar todas las categorías.

---

## Archivos Generados

| Archivo | Descripción |
|---------|-------------|
| `scraper/products.json` | Productos extraídos (scrape.js) |
| `scraper/meta.json` | Metadata del último scrape |
| `scraper/categories.json` | Estructura de categorías |

---

## Notas

- Todos los scrapers usan Playwright para extraer datos
- Los productos incluyen SKU para referencia en pedidos
- El campo `scrapedAt` permite filtrar por fecha de agregado