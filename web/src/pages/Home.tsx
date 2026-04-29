import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Product } from '../types/product'
import './Home.css'

const [productsData, setProductsData] = useState<Product[]>([])

useEffect(() => {
  fetch('/coquchemas/data/products.json')
    .then(res => res.json())
    .then((data: Product[]) => {
      setProductsData(data)
    })
}, [])

const trendingProducts = productsData.slice(0, 4)

const categories = [...new Set(productsData.map((p: Product) => p.category))].filter((cat): cat is string => Boolean(cat)).map(cat => ({
  name: cat,
  slug: cat.toLowerCase().replace(' ', '-')
}))

const teams = [...new Set(productsData.map((p: Product) => p.team))].filter((team): team is string => Boolean(team)).slice(0, 12)

const categoryIcons: Record<string, string> = {
  'Jersey': '⚽',
  'Player Version': '👕',
  'Retro': '🏆',
  'Training': '🏃',
  'Women': '👩',
  'Kids': '👦',
  'Outerwear': '🧥'
}

export default function Home() {

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
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            +14,000 productos disponibles
          </div>
          <h1>Coqu<span className="highlight">Chemas</span></h1>
          <p>Las mejores camisetas de fútbol y deportes. Envíos a todo Costa Rica.</p>
          <Link to="/catalog" className="btn-primary">
            Ver Catálogo
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="hero-visual">
          <div className="hero-image-container">
            <img src="/hero.png" alt="" className="hero-image" />
            <div className="hero-glow"></div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <h2>Categorías</h2>
        <div className="categories-grid">
          {categories.map((cat: { name: string; slug: string }) => (
            <Link key={cat.slug} to={`/catalog?category=${cat.slug}`} className="category-card">
              <span className="category-icon">{categoryIcons[cat.name] || '👕'}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <h2>Equipos</h2>
        <div className="featured-grid">
          {teams.map((team: string) => (
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
          {trendingProducts.map((product: Product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="trending-card">
              <div className="trending-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="trending-tag">Nuevo</span>
              </div>
              <div className="trending-info">
                <span className="trending-name">{product.name}</span>
                <span className="trending-price">${product.price}</span>
              </div>
            </Link>
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