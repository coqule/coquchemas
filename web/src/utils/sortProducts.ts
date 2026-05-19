import type { Product } from '../types/product'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'season-desc' | 'team-asc'

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
  { value: 'season-desc', label: 'Temporada: más reciente' },
  { value: 'team-asc', label: 'Equipo: A-Z' },
]

function parsePrice(price: string): number {
  const cleaned = price.replace(/[^0-9.]/g, '')
  return parseFloat(cleaned) || 0
}

const sortCache = new Map<string, Product[]>()

function getCacheKey(products: Product[], sortBy: SortOption): string {
  return `${products.length}-${sortBy}-${products[0]?.sku ?? ''}-${products[products.length - 1]?.sku ?? ''}`
}

function doSort(products: Product[], sortBy: SortOption): Product[] {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
      case 'price-asc':
        return parsePrice(a.price) - parsePrice(b.price)
      case 'price-desc':
        return parsePrice(b.price) - parsePrice(a.price)
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'season-desc':
        return (b.season || '').localeCompare(a.season || '')
      case 'team-asc':
        return (a.team || '').localeCompare(b.team || '')
      default:
        return 0
    }
  })
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const key = getCacheKey(products, sortBy)
  const cached = sortCache.get(key)
  if (cached) return cached
  const result = doSort(products, sortBy)
  sortCache.set(key, result)
  return result
}

export function filterAndSortProducts(
  products: Product[],
  predicate: (p: Product) => boolean,
  sortBy: SortOption
): Product[] {
  const filtered: Product[] = []
  for (let i = 0; i < products.length; i++) {
    if (predicate(products[i])) {
      filtered.push(products[i])
    }
  }
  return doSort(filtered, sortBy)
}
