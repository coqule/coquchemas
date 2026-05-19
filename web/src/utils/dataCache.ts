import type { Product } from '../types/product'

let productsCache: Promise<Product[]> | null = null

export function fetchProducts(): Promise<Product[]> {
  if (!productsCache) {
    const base = window.location.pathname.startsWith('/coquchemas') ? '/coquchemas' : ''
    productsCache = fetch(`${base}/data/products.json`).then(res => res.json())
  }
  return productsCache
}
