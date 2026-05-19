# Performance Optimization Plan - CoquChemas

Guía de mejoras de rendimiento basada en [Vercel React Best Practices](https://github.com/vercel-labs/react-best-practices).

## Estado de Implementación

- ✅ Completado
- 🔄 En progreso
- ⬜ Pendente

---

## 1. Bundle Size Optimization (CRITICAL)

### ⬜ `bundle-dynamic-imports` - Lazy load de rutas
**Archivos:** `App.tsx`, `vite.config.ts`
**Problema:** Todas las páginas se cargan en el bundle inicial.
**Solución:** Usar `React.lazy()` + `Suspense` para cargar rutas bajo demanda.
```tsx
// App.tsx
const Home = React.lazy(() => import('./pages/Home'))
const Catalog = React.lazy(() => import('./pages/Catalog'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'))
```
**Impacto:** Menor bundle inicial, carga más rápida de la landing.

### ⬜ `bundle-conditional` - Importar sortProducts solo cuando se usa
**Archivos:** `Home.tsx`
**Problema:** Home importa `sortProducts` pero solo necesita "newest", podría simplificar.
**Solución:** Si Home solo usa un tipo de orden, no necesita toda la utilidad.
**Impacto:** Micro-optimización, reduce dependencia innecesaria.

---

## 2. Client-Side Data Fetching (HIGH)

### ⬜ `client-swr-dedup` - Cachear products.json globalmente
**Archivos:** `Home.tsx`, `Catalog.tsx`, `ProductDetail.tsx`
**Problema:** Cada página hace fetch de `products.json` independientemente. 3 requests al mismo archivo.
**Solución:** Crear un contexto o módulo singleton que cachee el fetch.
```ts
// utils/dataCache.ts
let productsCache: Promise<Product[]> | null = null
export function fetchProducts(): Promise<Product[]> {
  if (!productsCache) {
    const base = window.location.pathname.startsWith('/coquchemas') ? '/coquchemas' : ''
    productsCache = fetch(`${base}/data/products.json`).then(r => r.json())
  }
  return productsCache
}
```
**Impacto:** 3 requests → 1 request. Menor latencia, menos ancho de banda.

---

## 3. JavaScript Performance (MEDIUM)

### ⬜ `js-index-maps` - Map para búsqueda de productos
**Archivos:** `ProductDetail.tsx:21`
**Problema:** `productsData.find(p => p.sku === productSku)` es O(n) en cada render.
**Solución:** Crear un `Map<sku, Product>` una sola vez.
```ts
const productMap = useMemo(() => {
  const map = new Map<string, Product>()
  productsData.forEach(p => map.set(p.sku, p))
  return map
}, [productsData])

const product = productMap.get(productSku)
```
**Impacto:** Búsqueda O(1) en vez de O(n). Notable con 14,790+ productos.

### ⬜ `js-cache-function-results` - Cachear resultados de sortProducts
**Archivos:** `utils/sortProducts.ts`
**Problema:** Se re-ordena el mismo array aunque los datos no cambien.
**Solución:** Cache por clave (sortBy + count).
**Impacto:** Evita re-ordenar innecesario.

### ⬜ `js-combine-iterations` - Unir filter + sort
**Archivos:** `Catalog.tsx`
**Problema:** `filter()` crea array intermedio, luego `sort()` itera de nuevo.
**Solución:** Combinar en un solo loop si es posible.
**Impacto:** Menos iteraciones sobre arrays grandes.

---

## 4. Re-render Optimization (MEDIUM)

### ⬜ `rerender-memo` - Memoizar ProductCard
**Archivos:** `Catalog.tsx`, `Home.tsx`
**Problema:** Cada card se re-renderiza al cambiar filtros, búsqueda o página.
**Solución:** Extraer componente `ProductCard` con `React.memo()`.
```tsx
const ProductCard = React.memo(({ product }: { product: Product }) => (
  <Link to={`/product/${product.sku}`} className="product-card">
    ...
  </Link>
))
```
**Impacto:** Cards visibles no se re-renderizan innecesariamente.

### ⬜ `rerender-functional-setstate` - Callbacks estables
**Archivos:** `Catalog.tsx`
**Problema:** `setPage(1)` se llama en múltiples handlers.
**Solución:** Usar `setPage(() => 1)` para callbacks estables.
**Impacto:** Menos re-renders por callbacks recreados.

### ⬜ `rerender-lazy-state-init` - Init perezoso de useState
**Archivos:** `Catalog.tsx`, `Home.tsx`, `ProductDetail.tsx`
**Problema:** `useState<Product[]>([])` crea array vacío en cada render.
**Solución:** `useState<Product[]>(() => [])`
**Impacto:** Micro-optimización.

---

## 5. Rendering Performance (LOW-MEDIUM)

### ⬜ `rendering-content-visibility` - CSS content-visibility para listas
**Archivos:** `Catalog.css`
**Problema:** El navegador renderiza todas las cards aunque estén fuera de viewport.
**Solución:** `content-visibility: auto` en `.products-grid`
**Impacto:** Mejor scroll performance con muchos items.

### ⬜ `rendering-conditional-render` - Ternario en vez de &&
**Archivos:** `ProductDetail.tsx:96`
**Problema:** `relatedProducts.length > 0 && (...)` puede renderizar `0`.
**Solución:** Usar ternario `relatedProducts.length > 0 ? (...) : null`
**Impacto:** Evita renders falsy inesperados.

---

## Prioridad Recomendada

| # | Mejora | Esfuerzo | Impacto |
|---|--------|----------|---------|
| 1 | `client-swr-dedup` - Cache global de products.json | Bajo | Alto |
| 2 | `js-index-maps` - Map para búsqueda | Bajo | Alto |
| 3 | `bundle-dynamic-imports` - Lazy load rutas | Medio | Alto |
| 4 | `rerender-memo` - Memoizar ProductCard | Bajo | Medio |
| 5 | `js-combine-iterations` - Unir filter+sort | Bajo | Medio |
| 6 | `rendering-content-visibility` | Bajo | Medio |
| 7 | `js-cache-function-results` | Medio | Bajo |
| 8 | `rerender-functional-setstate` | Bajo | Bajo |
| 9 | `rerender-lazy-state-init` | Bajo | Bajo |
| 10 | `rendering-conditional-render` | Bajo | Bajo |
| 11 | `bundle-conditional` | Bajo | Bajo |
