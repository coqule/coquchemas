import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import type { Product } from '../types/product'
import './ProductDetail.css'

export default function ProductDetail() {
  const [productsData, setProductsData] = useState<Product[]>([])
  const { id } = useParams()
  const productSku = id || null
  
  useEffect(() => {
    const base = window.location.pathname.startsWith('/coquchemas') ? '/coquchemas' : ''
    fetch(`${base}/data/products.json`)
      .then(res => res.json())
      .then((data: Product[]) => {
        setProductsData(data)
      })
  }, [])
  
  const product = useMemo(() => {
    return productsData.find(p => p.sku === productSku) || productsData[0]
  }, [productsData, productSku])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return productsData
      .filter(p => p.team === product.team && p.id !== product.id)
      .slice(0, 4)
  }, [product, productsData])
  
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
      
      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h2>Más de {product.team}</h2>
          <div className="related-grid">
            {relatedProducts.map(p => (
              <Link key={p.sku} to={`/product/${p.sku}`} className="related-card">
                <div className="related-image">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="related-info">
                  <span className="related-name">{p.name}</span>
                  <span className="related-price">₡20,000</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}