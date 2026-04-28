# Plan del Proyecto - CoquChemas

## Descripción General

Catálogo de camisetas de fútbol obtenido mediante scraping de [gakits.com](https://www.gakits.com). Desarrollo Mobile-First con React + Vite + TypeScript.

---

## Fases del Proyecto

### ✅ Fase 1: Scraper (Completada)
- **Script:** `scraper/scrape.js` (Node.js + Playwright)
- **Total productos:** 14,584
- **Comandos:** `--pages=N`, `--start=N`
- **Fuente:** New Arrivals ordenado por fecha
- **Categorías:** Jersey, Player Version, Retro, Training, Outerwear, Kids, Women
- **Workflow:** `.github/workflows/scrape.yml`

### ✅ Fase 2: Frontend (Completada)
- React + Vite + TypeScript
- Landing page con hero mejorado
- Catálogo con filtros y paginación
- Página de detalle de producto (/product/:id)
- Dark mode (#00142b)

---

## Comandos del Scraper

```bash
# Preview (5 páginas por defecto)
npm run scrape

# Con páginas específicas
node scraper/scrape.js --pages=20

# Desde página específica
node scraper/scrape.js --start=51 --pages=20
```

---

## Datos del Scraper (Modelo 14 campos)

| Campo | Descripción |
|-------|-------------|
| `id` | ID secuencial |
| `sku` | Item NO. (referencia para pedidos) |
| `name` | Nombre del producto |
| `team` | Equipo/Selección |
| `league` | Liga (New Arrivals) |
| `season` | Temporada |
| `price` | Precio en USD |
| `image` | URL de imagen |
| `category` | Categoría (Jersey/Player/Retro/etc) |
| `type` | Tipo (Fan/Player Version) |
| `description` | Descripción |
| `link` | URL del producto |
| `scrapedAt` | Fecha de scrape |

---

## Estructura del Proyecto

```
/coquchemas
├── scraper/
│   ├── scrape.js       # Script de scraping
│   ├── products.json   # 14,584 productos
│   └── meta.json       # Meta del último scrape
├── web/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx     # Landing con hero mejorado
│   │   │   ├── Catalog.tsx  # Catálogo con filtros
│   │   │   └── ProductDetail.tsx  # Detalle producto
│   │   ├── data/
│   │   │   └── products.json
│   │   └── types/
│   │       └── product.ts
│   └── package.json
├── .github/
│   └── workflows/
│       └── scrape.yml
├── docs/
│   ├── plan.md
│   ├── TODOS.md
│   └── scrapers.md
└── package.json
```

---

## Paleta de Colores

| Variable | Color | Uso |
|----------|-------|-----|
| `--bg-primary` | #00142b | Fondo principal |
| `--bg-secondary` | #002040 | Cards, inputs |
| `--bg-tertiary` | #003257 | Imágenes |
| `--text-primary` | #ffffff | Texto principal |
| `--text-secondary` | #c2c7d0 | Texto secundario |
| `--text-muted` | #8c919a | Texto muted |
| `--border` | #42474f | Bordes |
| `--accent` | #9dcaff | Acento azul |
| `--accent-yellow` | #ffce56 | Acento dorado (precios) |

---

## Pendientes

- [ ] Deploy a Vercel
- [ ] SEO y meta tags
- [ ] Rediseño con Stitch MCP (v2)

---

## Skills Cargadas

- `playwright` - CLI automation
- `playwright-best-practices` - Testing patterns
- `frontend-design` - UI design
- `deploy-to-vercel` - Deployment