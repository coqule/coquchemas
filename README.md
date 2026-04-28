# CoquChemas - Catálogo de Camisetas de Fútbol

Catálogo mobile-first de camisetas de fútbol, con datos extraídos automáticamente mediante scraping de [gakits.com](https://www.gakits.com). El proyecto prioriza la calidad de datos antes del desarrollo de interfaz, siguiendo un enfoque de fases automatizado.

---

## Stack Tecnológico

- **Backend/Scraping:** Node.js ≥18, Playwright (scraping resiliente)
- **Frontend (Planificado):** React + Vite + TypeScript, diseño oscuro (#00142b)
- **Automatización:** GitHub Actions (actualización diaria de datos)
- **Datos:** `products.json` como única fuente de verdad (14,584 productos actuales)

---

## Lógica de Scrapers: Mantenimiento de Productos

El motor de scraping mantiene `products.json` actualizado con los últimos productos de gakits.com de forma automática y manual.

### Scrapers Disponibles

#### 1. `scraper/scrape.js` (Actualización Diaria Incremental)
Scraper principal, enfocado en la sección **New Arrivals** de gakits.com (ordenado por fecha de llegada). Ejecutado diariamente por GitHub Actions.

**Modos de ejecución:**
- `--preview`: Scrapea 2 páginas (por defecto) para pruebas
- `--new`: Scrapea hasta 3 páginas, añade solo productos con SKUs no existentes (incremental)
- `--full`: Scrapea hasta 300 páginas, reemplaza el catálogo existente
- `--pages=N`: Número personalizado de páginas a scrapear
- `--start=N`: Comienza el scrapeo desde la página N

**Lógica incremental:**
1. Carga los productos existentes en `products.json` y extrae sus SKUs
2. Scrapea páginas de New Arrivals, verificando que el SKU del producto no exista previamente
3. Añade solo los productos nuevos, evitando duplicados
4. Actualiza `meta.json` con estadísticas del scrape (fecha, total de productos, nuevos añadidos)

#### 2. `scraper/scrape-all.js` (Scrapeo Manual de Categorías)
Scraper manual para obtener productos de múltiples categorías más allá de New Arrivals. **No está programado**, se ejecuta manualmente cuando se requiere ampliar el catálogo.

**Categorías cubiertas:**
New Arrivals, National Teams, La Liga, Premier League, Ligue 1, Bundesliga, Serie A, Brazil, Mexico/MLS, Retro Jerseys, Player Version, F1/Rugby/NFL, Training Tracksuits

**Uso:**
```bash
npm run scrape:all        # Modo preview (2 páginas por categoría)
npm run scrape:all:new    # Incremental para todas las categorías
npm run scrape:all:full   # Scrapeo completo de todas las categorías
```

### Automatización con GitHub Actions

El workflow `.github/workflows/scrape.yml` mantiene el catálogo actualizado sin intervención manual:

- **Ejecución:** Diaria a las 00:00 UTC, o manual mediante `workflow_dispatch`
- **Pasos:**
  1. Checkout del repositorio
  2. Configuración de Node.js 20
  3. Instalación de dependencias y Playwright Chromium
  4. Ejecución de `npm run scrape` (modo incremental por defecto)
  5. Commit automático de cambios en `products.json` usando `stefanzweifel/git-auto-commit-action`

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run scrape` | Ejecuta scrape.js en modo preview (5 páginas) |
| `npm run scrape:new` | Scrapeo incremental de New Arrivals |
| `npm run scrape:full` | Scrapeo completo de New Arrivals (300 páginas) |
| `npm run scrape:all` | Scrapeo manual multi-categoría (preview) |
| `npm run categories` | Genera estructura de categorías |
| `npm run count` | Cuenta productos por categoría |

---

## Estructura del Proyecto

```
/coquchemas
├── scraper/
│   ├── scrape.js          # Scraper diario incremental
│   ├── scrape-all.js      # Scraper manual multi-categoría
│   ├── products.json      # Única fuente de verdad (14,584 productos)
│   ├── meta.json          # Meta datos del último scrape
│   └── categories.json    # Estructura de categorías
├── web/                   # Frontend React (Planificado)
│   ├── src/
│   │   ├── pages/         # Home, Catalog, ProductDetail
│   │   ├── data/          # Copia de products.json
│   │   └── types/         # TypeScript types (Product)
│   └── package.json
├── .github/
│   └── workflows/
│       └── scrape.yml     # Automatización diaria
├── docs/                  # Documentación de diseño y planificación
├── package.json           # Dependencias y scripts del proyecto
└── AGENTS.md              # Instrucciones para el agente de IA
```

---

## Cómo Ejecutar Localmente

### Prerrequisitos
- Node.js ≥18
- npm

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/coquchemas.git
   cd coquchemas
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar el scraper en modo preview (prueba):
   ```bash
   npm run scrape
   ```

4. Ver el catálogo de productos generado:
   ```bash
   cat scraper/products.json | head -20
   ```

---

## Frontend (Fase 2)

Una vez validados los datos, el siguiente paso es el desarrollo del catálogo en React + Vite + TypeScript, con:
- Diseño mobile-first, modo oscuro (#00142b)
- Páginas: Landing, Catálogo con filtros, Detalle de producto
- Integración de `products.json` como fuente de datos estática

---

## Notas Importantes

- **Seguridad:** Se utilizan solo librerías sin vulnerabilidades reportadas (Playwright como alternativa moderna)
- **Datos:** `products.json` es la única fuente de verdad; no se modifica manualmente
- **Accesibilidad:** Enfoque móvil prioritario para la interfaz

---

## Licencia

MIT
