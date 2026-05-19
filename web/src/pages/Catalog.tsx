import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Product } from '../types/product'
import { sortProducts, SORT_OPTIONS, type SortOption } from '../utils/sortProducts'
import './Catalog.css'

const ITEMS_PER_PAGE = 20

export default function Catalog() {
  const [productsData, setProductsData] = useState<Product[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const base = window.location.pathname.startsWith('/coquchemas') ? '/coquchemas' : ''
    fetch(`${base}/data/products.json`)
      .then(res => res.json())
      .then((data: Product[]) => {
        setProductsData(data)
      })
  }, [])

  const initialCategory = searchParams.get('category') || 'all'
  const initialTeam = searchParams.get('team') || ''
  const urlSort = searchParams.get('sort') as SortOption | null
  const savedSort = localStorage.getItem('catalog-sort') as SortOption | null

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedTeam, setSelectedTeam] = useState(initialTeam)
  const [sortBy, setSortBy] = useState<SortOption>(urlSort || savedSort || 'newest')

  const categories = useMemo(() => {
    const cats = new Set(productsData.map((p: Product) => p.category).filter(Boolean))
    return ['all', ...Array.from(cats)]
  }, [productsData])

  const teams = useMemo(() => {
    const t = new Set(productsData.map((p: Product) => p.team).filter(Boolean))
    return [...Array.from(t)].slice(0, 30)
  }, [productsData])

  const filtered = useMemo(() => {
    const result = productsData.filter((p: Product) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
      const matchesTeam = !selectedTeam || p.team === selectedTeam
      return matchesSearch && matchesCategory && matchesTeam
    })
    return sortProducts(result, sortBy)
  }, [productsData, search, selectedCategory, selectedTeam, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedProducts = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    setPage(1)
    if (cat === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  const handleTeamChange = (team: string) => {
    setSelectedTeam(team)
    setPage(1)
    if (!team) {
      searchParams.delete('team')
    } else {
      searchParams.set('team', team)
    }
    setSearchParams(searchParams)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort as SortOption)
    setPage(1)
    localStorage.setItem('catalog-sort', sort)
    searchParams.set('sort', sort)
    setSearchParams(searchParams)
  }

  return (
    <div className="catalog">
      <header className="catalog-header">
        <div className="header-content">
          <Link to="/" className="logo">CoquChemas</Link>
          <nav className="nav">
            <Link to="/catalog" className="nav-link">Catálogo</Link>
          </nav>
        </div>
      </header>

      <div className="catalog-filters">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
      </div>

      <div className="filter-row">
        <select 
          value={selectedCategory} 
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="filter-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Todas las categorías' : cat}
            </option>
          ))}
        </select>

        <select 
          value={selectedTeam} 
          onChange={(e) => handleTeamChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los equipos</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => handleSortChange(e.target.value)}
          className="filter-select"
          aria-label="Ordenar por"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="results-info">
        {filtered.length} productos - Página {page} de {totalPages}
      </div>

      <div className="products-grid">
        {paginatedProducts.map(product => (
          <Link
            key={product.sku}
            to={`/product/${product.sku}`}
            className="product-card"
          >
            <div className="product-image">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
              />
            </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">₡20,000</p>
              </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="page-btn"
          >
            Anterior
          </button>
          <span className="page-info">{page} / {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="page-btn"
          >
            Siguiente
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="no-results">
          <p>No se encontraron productos</p>
        </div>
      )}
    </div>
  )
}
