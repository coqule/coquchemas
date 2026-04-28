# Plan de Despliegue Dual: GitHub Pages + Vercel

## Contexto Técnico del Proyecto

- **Frontend:** En carpeta `web/` (React + Vite + TypeScript)
- **Datos:** `scraper/products.json` (actualizado diariamente) → copiado a `web/src/data/products.json`
- **Vite config:** Actualmente sin `base` path configurado (necesario para GitHub Pages)
- **Repositorio:** https://github.com/coqule/coquchemas (público)

---

## 1. Preparación del Proyecto (Común a Ambos)

### A. Configurar `base` path en Vite para GitHub Pages

```typescript
// web/vite.config.ts
export default defineConfig({
  base: '/coquchemas/',  // Necesario para GitHub Pages
  // ... resto de config
})
```

### B. Script para sincronizar `products.json` antes del build

```json
// web/package.json
"scripts": {
  "predeploy": "copy ..\\scraper\\products.json src\\data\\",
  "build": "tsc -b && vite build"
}
```

---

## 2. GitHub Pages (Despliegue Estático)

### Workflow de Despliegue

Creado en: `.github/workflows/deploy-pages.yml`

**URL resultante:** `https://coqule.github.io/coquchemas/`

### Activar GitHub Pages

1. Ir a: https://github.com/coqule/coquchemas/settings/pages
2. Source: **GitHub Actions**
3. Guardar configuración

---

## 3. Vercel (Despliegue con Framework)

### Configuración en Vercel Dashboard

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. **Add New Project** → Import Git Repository
3. Seleccionar: `coqule/coquchemas`
4. Configuración:
   - **Root Directory:** `web`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**URL resultante:** `https://coquchemas.vercel.app`

---

## 4. Sincronización de Datos para Ambos

### Modificación en `.github/workflows/scrape.yml`

El scraper ahora sincroniza automáticamente:
1. Scrapea nuevos productos → `scraper/products.json`
2. Copia a `web/src/data/products.json`
3. Hace commit de ambos archivos
4. Esto dispara automáticamente:
   - `deploy-pages.yml` (GitHub Pages)
   - Vercel deploy (si está conectado)

### Script de sincronización manual

```bash
npm run sync  # Ejecuta scripts/sync-products.js
```

---

## 5. Cronograma de Ejecución

| Evento | Workflow | Despliegue |
|--------|-----------|-------------|
| Push a `main` | `deploy-pages.yml` | GitHub Pages ✅ |
| Push a `main` | Vercel (auto) | Vercel ✅ |
| Scraper diario (00:00 UTC) | `scrape.yml` → commit → | Ambos se actualizan ✅ |

---

## 6. Pasos Inmediatos para Completar Despliegue

### Para GitHub Pages:
- [x] Workflow `deploy-pages.yml` creado
- [ ] Activar GitHub Pages en settings (manual)
- [ ] Verificar primer despliegue

### Para Vercel:
- [ ] Conectar repo a Vercel (vía dashboard)
- [ ] Configurar Root Directory: `web`
- [ ] Verificar despliegue

---

## 7. Limitaciones y Consideraciones

### ⚠️ Tamaño de `products.json`
- **Actual:** 9.31 MB (14,640 productos)
- **Impacto:** Puede afectar el build time en Vercel
- **Solución futura:** Considerar API endpoint o paginación

### ✅ Ventajas de Vercel
- Mejores tiempos de build para proyectos Vite
- CDN global automático
- Preview deployments

### ✅ Ventajas de GitHub Pages
- Gratuito ilimitado para repos públicos
- Integración nativa con GitHub Actions

---

## Enlaces Útiles

- **Repositorio:** https://github.com/coqule/coquchemas
- **GitHub Actions:** https://github.com/coqule/coquchemas/actions
- **GitHub Pages Settings:** https://github.com/coqule/coquchemas/settings/pages
- **Vercel Dashboard:** https://vercel.com/dashboard

---

Última actualización: 2026-04-28
