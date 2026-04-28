# Gakits.com - Campos de Producto

## Modelo de Datos Extraíbles

### Campos actuales (implementados)

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|------------|---------|
| `id` | number | ID secuencial | 1 |
| `sku` | string | Item NO - referencia para pedidos | 2088902 |
| `name` | string | Nombre del producto | 2026/27 Spain Home 1:1 Fans Soccer Jersey |
| `team` | string | Equipo/DSelección | Spain |
| `league` | string | Liga/Categoría | National Teams |
| `season` | string | Temporada | 2026/27 |
| `price` | string | Precio en USD | 14.50 |
| `image` | string | URL de imagen | https://... |
| `category` | string | Categoría general | Jersey |
| `type` | string | Tipo (Fan/Player) | Fan Version |
| `description` | string | Descripción | 2026/27 Spain Home... |
| `link` | string | URL del producto | https://www.gakits.com/... |

---

### Campos adicionales (pendientes de implementar)

| Campo | Tipo | Descripción | Ejemplo | Prioridad |
|-------|------|------------|---------|----------|
| `sold` | number | Cantidad Vendida | 63 | Media |
| `brand` | string | Marca (Fans/Player) | Fans | Alta |
| `sizes` | string[] | Tallas disponibles | ["S","M","L","XL","XXL","3XL","4XL"] | Alta |
| `categoryPath` | string | Ruta de categoría | National Teams > Europe > Spain | Media |
| `creationDate` | string | Fecha de creación | 2025-10-28 | Baja |
| `weight` | string | Peso del producto | 0.25 kg | Baja |
| `patches` | object[] | Parches disponibles | [{name, price}] | Media |
| `images` | string[] | Galería de imágenes | [url1, url2, ...] | Alta |
| `sizeChart` | object | Guía de tallas | {fan, player, woman, kids} | Baja |
| `stock` | string | Stock disponible | In Stock | Baja |

---

### Campos para futuro (e-commerce)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `stockStatus` | string | Disponibilidad |
| `originalPrice` | string | Precio sin descuento |
| `discountPrice` | string | Precio en oferta |
| `rating` | number | Valoración media |
| `reviewsCount` | number | Cantidad de reseñas |
| `featured` | boolean | Producto destacado |

---

## Referencia de SKU

- El **SKU** (Item NO.) es el identificador único del producto en gakits.com
- Se extrae del link: `-p3423963.html` → `3423962- SKU`
- Es el campo clave para hacer pedidos por WhatsApp

---

## Uso del SKU para pedidos

```javascript
// Ejemplo: Producto para pedido
const producto = {
  name: "2026/27 Spain Home 1:1 Fans Soccer Jersey",
  sku: "2088902",  // ← Usar este SKU al contactar a gakits
  price: "14.50",
  link: "https://www.gakits.com/2026-27-Spain-Home-1-1-Fans-Soccer-Jersey-p2088902.html"
};
```

Cuando el cliente quiere comprar, se contacta a gakits por WhatsApp con:
- SKU: 2088902
- Nombre: 2026/27 Spain Home 1:1 Fans Soccer Jersey
- Tallas deseadas