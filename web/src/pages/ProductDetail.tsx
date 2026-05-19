import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import type { Product } from '../types/product'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

import { fetchProducts } from '../utils/dataCache'

export default function ProductDetail() {
  const [productsData, setProductsData] = useState<Product[]>(() => [])
  const { id } = useParams()
  const productSku = id || null
  
  useEffect(() => {
    fetchProducts().then((data: Product[]) => {
      setProductsData(data)
    })
  }, [])
  
  const productMap = useMemo(() => {
    const map = new Map<string, Product>()
    productsData.forEach(p => map.set(p.sku, p))
    return map
  }, [productsData])
  
  const product = productMap.get(productSku || '') || productsData[0]

  const productsByTeam = useMemo(() => {
    const map = new Map<string, Product[]>()
    productsData.forEach(p => {
      if (p.team) {
        const team = map.get(p.team) || []
        team.push(p)
        map.set(p.team, team)
      }
    })
    return map
  }, [productsData])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return (productsByTeam.get(product.team) || [])
      .filter(p => p.id !== product.id)
      .slice(0, 4)
  }, [product, productsByTeam])
  
  if (!product) {
    return (
      <div className="product-detail">
        <div className="not-found">
          <h1>Producto no encontrado</h1>
          <Link to="/catalog" className="back-link">Volver al catálogo</Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="product-detail">
      <header className="product-header">
        <div className="header-content">
          <Link to="/" className="logo">Coqu<span className="logo-accent">Chemas</span></Link>
          <nav className="nav">
            <Link to="/catalog" className="nav-link">Catálogo</Link>
          </nav>
        </div>
      </header>

      <div className="product-content">
      <nav className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/catalog">Catálogo</Link>
        <span>/</span>
        <span>{product.team}</span>
      </nav>
      
      <div className="product-grid">
        <div className="product-image-section">
          <div className="image-container">
            <img src={product.image} alt={product.name} />
          </div>
        </div>
        
        <div className="product-info-section">
          <div className="product-badges">
            <span className="badge season">{product.season}</span>
            <span className="badge type">{product.type}</span>
            <span className="badge category">{product.category}</span>
          </div>
          
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Equipo</span>
              <span className="meta-value team">{product.team}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Liga</span>
              <span className="meta-value">{product.league}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">SKU</span>
              <span className="meta-value sku">{product.sku}</span>
            </div>
          </div>
          
          <div className="product-price">
              <span className="price-currency">₡</span>
              <span className="price-amount">20,000</span>
              <span className="price-decimal"></span>
            </div>
          
          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 ? (
        <section className="related-section">
          <h2>Más de {product.team}</h2>
          <div className="related-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>
      ) : null}
      </div>

      <footer className="footer">
        <p>© 2026 CoquChemas - Las mejores camisetas de fútbol</p>
      </footer>
    </div>
  )
}