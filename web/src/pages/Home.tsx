import { Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import type { Product } from '../types/product'
import ProductCard from '../components/ProductCard'
import './Home.css'

import { fetchProducts } from '../utils/dataCache'

const categoryIcons: Record<string, string> = {
  'Jersey': '⚽',
  'Player Version': '👕',
  'Retro': '🏆',
  'Training': '🏃',
  'Women': '👩',
  'Kids': '👦',
  'Outerwear': '🧥'
}

const pillColors: Record<string, string> = {
  'Jersey': '#ffce56',
  'Player Version': '#9dcaff',
  'Retro': '#f59e0b',
  'Training': '#34d399',
  'Women': '#f472b6',
  'Kids': '#22d3ee',
  'Outerwear': '#a78bfa'
}

export default function Home() {
  const [productsData, setProductsData] = useState<Product[]>(() => [])

  useEffect(() => {
    fetchProducts().then((data: Product[]) => {
      setProductsData(data)
    })
  }, [])

  const newestProducts = useMemo(() => {
    return [...productsData]
      .sort((a, b) => new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime())
      .slice(0, 4)
  }, [productsData])

  const categories = [...new Set(productsData.map(p => p.category))].filter(Boolean).map(cat => ({
    name: cat,
    slug: cat.toLowerCase().replace(/ /g, '-')
  }))
  const teams = [...new Set(productsData.map(p => p.team))].filter(Boolean).slice(0, 12)

  return (
    <div className="landing">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">Coqu<span className="logo-accent">Chemas</span></Link>
          <nav className="nav">
            <Link to="/catalog" className="nav-link">Catálogo</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-grid-bg"></div>
        <div className="hero-decoration">
          <div className="hero-line hero-line-1"></div>
          <div className="hero-line hero-line-2"></div>
          <div className="hero-line hero-line-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge" style={{ animationDelay: '0ms' }}>
            <span className="badge-dot"></span>
            +14,000 productos disponibles
          </div>
          <h1 className="hero-title" style={{ animationDelay: '150ms' }}>
            Coqu<span className="highlight">Chemas</span>
          </h1>
          <p className="hero-subtitle" style={{ animationDelay: '300ms' }}>
            Las mejores camisetas de fútbol y deportes. Envíos a todo Costa Rica.
          </p>
          <Link to="/catalog" className="btn-primary" style={{ animationDelay: '450ms' }}>
            Ver Catálogo
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="hero-visual" style={{ animationDelay: '200ms' }}>
          <div className="hero-image-container">
            <img src="/hero.png" alt="" className="hero-image" />
            <div className="hero-glow"></div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Categorías</h2>
        <div className="categories-scroll">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/catalog?category=${cat.slug}`}
              className="category-pill"
              style={{ '--pill-color': pillColors[cat.name] || '#ffce56' } as React.CSSProperties}
            >
              <span className="pill-icon">{categoryIcons[cat.name] || '👕'}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Equipos</h2>
        <div className="featured-grid">
          {teams.map(team => (
            <Link key={team} to={`/catalog?team=${team}`} className="featured-card">
              <span className="team-badge">{team.substring(0, 3).toUpperCase()}</span>
              <span>{team}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="trending-section">
        <h2>Lo más nuevo</h2>
        <p className="trending-subtitle">Recién llegados a nuestro catálogo</p>
        <div className="trending-grid">
          {newestProducts.map(product => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
        <Link to="/catalog" className="view-all-btn">
          Ver todos los productos
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </section>

      <footer className="footer">
        <p>© 2026 CoquChemas - Las mejores camisetas de fútbol</p>
      </footer>
    </div>
  )
}
