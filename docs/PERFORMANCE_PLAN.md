# Performance Optimization Plan - CoquChemas

Guía de mejoras de rendimiento basada en [Vercel React Best Practices](https://github.com/vercel-labs/react-best-practices).

## Estado de Implementación

- ✅ Completado
- 🔄 En progreso
- ⬜ Pendiente

---

## 1. Bundle Size Optimization (CRITICAL)

### ✅ `bundle-dynamic-imports` - Lazy load de rutas
**Archivos:** `App.tsx`
**Implementado:** `React.lazy()` + `Suspense` para Home, Catalog, ProductDetail.
**Resultado:** Bundle principal ~55KB → 44KB (-20%). Cada página carga su chunk bajo demanda.

### ✅ `bundle-conditional` - Inline sort en Home
**Archivos:** `Home.tsx`
**Implementado:** Sort inline por fecha en Home, sin importar `sortProducts`.
**Resultado:** Home no carga el módulo sortProducts (~1.4KB), solo Catalog.

---

## 2. Client-Side Data Fetching (HIGH)

### ✅ `client-swr-dedup` - Cache global de products.json
**Archivos:** `utils/dataCache.ts`, `Home.tsx`, `Catalog.tsx`, `ProductDetail.tsx`
**Implementado:** Singleton que cachea la Promise del fetch.
**Resultado:** 3 requests → 1 request.

---

## 3. JavaScript Performance (MEDIUM)

### ✅ `js-index-maps` - Map para búsqueda de productos
**Archivos:** `ProductDetail.tsx`
**Implementado:** `Map<sku, Product>` + `Map<team, Product[]>` para búsqueda O(1).
**Resultado:** Búsqueda instantánea con 14,790+ productos.

### ✅ `js-cache-function-results` - Cachear resultados de sort
**Archivos:** `utils/sortProducts.ts`
**Implementado:** `Map<string, Product[]>` con clave basada en length + sortBy + first/last SKU.
**Resultado:** Reutiliza resultados de sort idénticos.

### ✅ `js-combine-iterations` - Unir filter + sort
**Archivos:** `Catalog.tsx`, `utils/sortProducts.ts`
**Implementado:** `filterAndSortProducts()` con loop `for` + sort in-place.
**Resultado:** Elimina array intermedio de `filter()`.

---

## 4. Re-render Optimization (MEDIUM)

### ✅ `rerender-memo` - Memoizar ProductCard
**Archivos:** `components/ProductCard.tsx`, `Catalog.tsx`, `Home.tsx`, `ProductDetail.tsx`
**Implementado:** Componente extraído con `React.memo()`.
**Resultado:** Cards no se re-renderizan si el producto no cambia.

### ✅ `rerender-functional-setstate` - Callbacks estables
**Archivos:** `Catalog.tsx`
**Implementado:** `useCallback` en handlers + `setPage(() => 1)`.
**Resultado:** Handlers estables entre renders, compatible con memo.

### ✅ `rerender-lazy-state-init` - Init perezoso de useState
**Archivos:** `Catalog.tsx`, `Home.tsx`, `ProductDetail.tsx`
**Implementado:** `useState(() => [])` en lugar de `useState([])`.
**Resultado:** Evita crear arrays vacíos en cada render.

---

## 5. Rendering Performance (LOW-MEDIUM)

### ✅ `rendering-content-visibility` - CSS content-visibility
**Archivos:** `Catalog.css`
**Implementado:** `content-visibility: auto` + `contain-intrinsic-size: 0 320px` en `.product-card`.
**Resultado:** Navegador salta layout/paint de cards fuera de viewport.

### ✅ `rendering-conditional-render` - Ternario en vez de &&
**Archivos:** `ProductDetail.tsx`
**Implementado:** `relatedProducts.length > 0 ? (...) : null`
**Resultado:** Evita renders falsy inesperados.

---

## Resumen de Impacto

| # | Mejora | Estado | Impacto Real |
|---|--------|--------|-------------|
| 1 | `client-swr-dedup` | ✅ | 3→1 requests |
| 2 | `js-index-maps` | ✅ | O(n)→O(1) búsqueda |
| 3 | `bundle-dynamic-imports` | ✅ | -20% bundle inicial |
| 4 | `rerender-memo` | ✅ | Menos re-renders |
| 5 | `js-combine-iterations` | ✅ | Sin array intermedio |
| 6 | `rendering-content-visibility` | ✅ | Mejor scroll |
| 7 | `js-cache-function-results` | ✅ | Reutiliza sorts |
| 8 | `rerender-functional-setstate` | ✅ | Callbacks estables |
| 9 | `rerender-lazy-state-init` | ✅ | Micro-optimización |
| 10 | `rendering-conditional-render` | ✅ | Sin falsy renders |
| 11 | `bundle-conditional` | ✅ | Home más ligero |
