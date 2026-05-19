import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types/product'

const ProductCard = memo(({ product }: { product: Product }) => (
  <Link
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
))

ProductCard.displayName = 'ProductCard'

export default ProductCard
