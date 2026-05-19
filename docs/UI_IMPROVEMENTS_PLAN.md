# UI/UX Improvements Plan - CoquChemas

Guía de mejoras visuales basada en principios de **frontend-design** para crear interfaces memorables y production-grade.

## Estado de Implementación

- ✅ Completado
- 🔄 En progreso
- ⬜ Pendiente
- ❌ Descartado

---

## 1. Product Cards (ALTO IMPACTO)

### ❌ Rediseño visual de cards (Descartado)
**Fecha:** 19/05/2026
**Motivo:** Los cambios no se percibían visualmente y no gustaron al revisar.
**Archivos:** `components/ProductCard.tsx`, `components/ProductCard.css`, `Catalog.css`
**Lo que se intentó:** Badges, gradient border hover, overlay, staggered animations.

---

## 2. Hero Section Landing (ALTO IMPACTO)

### ⬜ Composición más impactante
**Archivos:** `Home.tsx`, `Home.css`
**Problema:** Hero básico con texto + botón + imagen.
**Mejora:**
- Tipografía display con escala dramática
- Efectos de gradiente atmosféricos
- Animaciones staggered en page load
- Elementos decorativos (líneas diagonales, formas)
- Badge animado de "+14,000 productos"

---

## 3. Filtros y Ordenamiento (MEDIO IMPACTO)

### ⬜ Dropdowns custom con estilo
**Archivos:** `Catalog.tsx`, `Catalog.css`
**Problema:** Selects nativos del browser sin estilo.
**Mejora:**
- Dropdowns custom con iconos por opción
- Chips de filtro activo removibles
- Animaciones de apertura/cierre
- Indicador visual de filtro aplicado
- Iconos de ordenamiento (↑↓)

---

## 4. Página Detalle de Producto (MEDIO IMPACTO)

### ⬜ Layout más refinado
**Archivos:** `ProductDetail.tsx`, `ProductDetail.css`
**Problema:** Layout grid simple con info básica.
**Mejora:**
- Zoom effect en imagen de producto
- Badges estilizados con gradientes
- Tipografía jerárquica más dramática
- Productos relacionados con grid asimétrico
- Animación de entrada por sección

---

## 5. Tipografía y Jerarquía Visual (BAJO-MEDIO IMPACTO)

### ⬜ Escala tipográfica más impactante
**Archivos:** Todos los `.css`
**Problema:** Lexend bien pero sin variación de escala dramática.
**Mejora:**
- Font pairing: display font + body font
- Escala más dramática (h1 vs body ratio)
- Tracking/letter-spacing intencional
- Pesos variados (300, 500, 700, 900)
- Line-height optimizado para legibilidad

---

## 6. Animaciones y Micro-interacciones (MEDIO IMPACTO)

### ⬜ Motion design system
**Archivos:** Todos los componentes
**Problema:** Transiciones básicas (solo hover en cards).
**Mejora:**
- Page load con staggered reveals
- Scroll-triggered animations
- Hover states que sorprenden
- Loading states elegantes (spinners, skeleton)
- Transiciones entre páginas

---

## 7. Paleta de Colores y Atmósfera (MEDIO IMPACTO)

### ⬜ Refinamiento visual del tema
**Archivos:** Variables CSS en todos los `.css`
**Problema:** Dark mode funcional pero sin profundidad.
**Mejora:**
- CSS variables más refinadas y cohesivas
- Gradientes sutiles de fondo
- Noise texture para atmósfera
- Glassmorphism en header
- Acentos de color más intencionales

---

## 8. Footer y Navegación (BAJO IMPACTO)

### ⬜ Footer con más info y nav mejorada
**Archivos:** `Home.tsx`, `Home.css`, `Catalog.tsx`, `Catalog.css`, `ProductDetail.tsx`, `ProductDetail.css`
**Problema:** Footer solo con copyright, nav minimal.
**Mejora:**
- Footer con links, stats, info de contacto
- Nav con indicador de página activa
- Hamburger menu animado en mobile
- Breadcrumbs más visuales

---

## Prioridad Recomendada

| # | Mejora | Estado | Esfuerzo | Impacto Visual |
|---|--------|--------|----------|----------------|
| 1 | Product Cards redesign | ❌ Descartado | Medio | Muy Alto |
| 2 | Hero Section | ⬜ Pendiente | Medio | Muy Alto |
| 3 | Filtros custom | ⬜ Pendiente | Medio | Alto |
| 4 | Product Detail layout | ⬜ Pendiente | Medio | Alto |
| 5 | Animaciones | ⬜ Pendiente | Alto | Alto |
| 6 | Paleta de colores | ⬜ Pendiente | Bajo | Medio |
| 7 | Tipografía | ⬜ Pendiente | Bajo | Medio |
| 8 | Footer y Nav | ⬜ Pendiente | Bajo | Medio |
