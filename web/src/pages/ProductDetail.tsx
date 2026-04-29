import { useParams, Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import type { Product } from '../types/product'
import './ProductDetail.css'

const [productsData, setProductsData] = useState<Product[]>([])
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  fetch('/coquchemas/data/products.json')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    })
    .then((data: Product[]) => {
      setProductsData(data)
    })
    .catch((err: Error) => {
      setError(err.message)
    })
}, [])

const products: Product[] = productsData

export default function ProductDetail() {
  const { id } = useParams()
  const productId = id ? parseInt(id) : null
  
  const product = useMemo(() => {
    return products.find(p => p.id === productId) || products[0]
  }, [productId])
   
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((p: Product) => p.team === product.team && p.id !== product.id)
      .slice(0, 4)
  }, [product])
   
  if (error) {
    return (
      <div className="product-detail">
        <div className="error">{error}</div>
      </div>
    )
  }

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
            <span className="price-currency">$</span>
            <span className="price-amount">{product.price}</span>
            <span className="price-decimal">.00</span>
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
            {relatedProducts.map((p: Product) => (
              <Link key={p.id} to={`/product/${p.id}`} className="related-card">
                <div className="related-image">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="related-info">
                  <span className="related-name">{p.name}</span>
                  <span className="related-price">${p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
